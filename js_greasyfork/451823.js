// ==UserScript==
// @name                喜马拉雅音频地址提取工具 - 12redcircle
// @namespace           cyou.12redcircle.xmly-radio-extractor
// @match               https://www.ximalaya.com/**
// @require             https://cdn.jsdelivr.net/npm/blueimp-md5@2.19.0/js/md5.min.js
// @require             https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.min.js
// @require             https://cdn.jsdelivr.net/npm/jquery@3.6.1/dist/jquery.slim.min.js
// @require             https://cdn.jsdelivr.net/npm/sodajs@0.4.10/dist/soda.min.js
// @grant               GM_addStyle
// @grant               GM_setClipboard
// @version             20220923.1-alpha
// @author              12redcircle
// @description         提取喜马拉雅网页上专辑和音频的播放链接
// @contributionURL     https://afdian.net/@yuyegongmian
// @license             WTFPL
// @downloadURL https://update.greasyfork.org/scripts/451823/%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%E9%9F%B3%E9%A2%91%E5%9C%B0%E5%9D%80%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7%20-%2012redcircle.user.js
// @updateURL https://update.greasyfork.org/scripts/451823/%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%E9%9F%B3%E9%A2%91%E5%9C%B0%E5%9D%80%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7%20-%2012redcircle.meta.js
// ==/UserScript==


(async function () {
  'use strict';

  /*************** 基础 *******************/
  const SECRET_KEY = 'himalaya-'; // 证书生成秘钥

  /**
   * 获取接口签名，header 中的 xm-sign
   * @returns
   */
  function getSign() {
    var secretKey = SECRET_KEY;
    var serverTime = window.XM_SERVER_CLOCK || 0;
    var clientTime = Date.now();
    var random = (t) => ~~(Math.random() * t);

    return `${md5(`${secretKey}${serverTime}`)}(${random(100)})${serverTime}(${random(100)})${clientTime}`;
  }

  /**
   * 获取服务器时间（无需xm-sign）
   * 备用方法，如果获取不到 window.XM_SERVER_CLOCK, serverTime = await getServerTime()
   * @returns 一个时间字符串
   */
  async function getServerTime() {
    return await fetch("https://www.ximalaya.com/revision/time")
      .then(res => res.text());
  }

  /**
   * 获取专辑播放列表
   * 注意：请在专辑界面调用
   * @param {*} albumId 专辑id
   * @param {*} pageNum 分页
   * @returns
   */
  async function getAlbumTrackList(albumId, pageNum) {
    const response = await fetch(`https://www.ximalaya.com/revision/album/v1/getTracksList?albumId=${albumId}&pageNum=${pageNum}&pageSize=100&sort=0`, {
      "credentials": "include",
      "headers": {
        "xm-sign": getSign(),
      },
      "method": "GET",
      "mode": "cors"
    });

    return response.json();
  }

  /**
   * 获取播放url列表（需要cookie，无需xm-sign）
   * 在任何界面均可调用
   * https://www.ximalaya.com/sound/${trackId}
   * @param {*} trackId 音轨id
   * @returns
   */
  async function getTrackList(trackId) {
    const response = await fetch(`https://mobile.ximalaya.com/mobile-playpage/track/v3/baseInfo/${Date.now()}?device=web&trackId=${trackId}&trackQualityLevel=1`, {
      "credentials": "include",
      "method": "GET",
      "mode": "cors"
    });
    return response.json();
  }

  /**
   * 获取播放url列表中的第一个直链
   * @param {*} playList
   * @returns
   */
  function getDownloadURL(playUrlList) {
    if (playUrlList && playUrlList.length) {
      const url = playUrlList[0].url;
      return decrypt(url);
    }
    return false;

    function decrypt(t) {
      return CryptoJS.AES.decrypt({
        ciphertext: CryptoJS.enc.Base64url.parse(t)
      }, CryptoJS.enc.Hex.parse('aaad3e4fd540b0f79dca95606e72bf93'), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      })
        .toString(CryptoJS.enc.Utf8);
    }
  }

  /*************** 对链接的操作 *******************/
  function isAlbumView() {
    return location.href.includes('/album/');
  }

  function isTrackView() {
    return location.href.includes('/sound/') || location.href.includes('/youshengshu/');
  }

  function getId(href) {
    return href.substring(href.lastIndexOf('/') + 1);
  }

  // 监听网页地址变化
  function pageViewChange$(callback) {

    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        callback();
      }
    });

    observer.observe(document, {
      subtree: true,
      childList: true
    });
    callback();
  }

  /*************** 数据逻辑 *******************/

  async function getAlbumViewData(albumId) {
    const albumList = [];

    let pageNum = 1;
    while (1) {
      const {
        data
      } = await getAlbumTrackList(albumId, pageNum);
      const _albumList = data.tracks;
      if (_albumList.length === 0) {
        break;
      }
      albumList.push(..._albumList);
      pageNum++;
    }

    return albumList.map(function (album) {
      return {
        title: album.title,
        index: album.index,
        trackId: getId(album.url)
      };
    });
  }

  async function getTrackViewData(trackId) {
    const {
      trackInfo
    } = await getTrackList(trackId);

    const title = trackInfo.title;
    const url = getDownloadURL(trackInfo.playUrlList);

    return {
      title,
      url,
      trackId
    };
  }

  /*************** UI交互窗口 *******************/

  function addDragBehavior(selector) {
    const Drag = document.querySelector(selector);

    Drag.onmousedown = function (event) {
      const ev = event || window.event;
      ev?.stopPropagation();

      const disX = ev.clientX - Drag.offsetLeft;
      const disY = ev.clientY - Drag.offsetTop;

      Drag.onmousemove = function (event) {
        const ev = event || window.event;

        const left = ev.clientX - disX;
        const top = ev.clientY - disY;

        Drag.style.left = left + "px";
        Drag.style.top = top + "px";
      };
    };

    Drag.onmouseup = function () {
      Drag.onmousemove = null;
    };
  };

  const APPID = `__xmdownload__community__`;

  $(document.body)
    .append(`<div id="${APPID}"></div>`);

  GM_addStyle(`

    #__xmdownload__community__ {
      position: fixed;
      top: 0;
      line-height: 1.6;
      padding: 10px 20px;
      background-color: #dcdcdc;
      z-index: 20220923;
      min-height: 100px;
      max-height: 80vh;
      overflow: auto;
      background-color: rgba(240, 223, 175, 0.9);
      border: 2px solid black;
      box-shadow: 5px 5px 5px #000000;
    }

    #__xmdownload__community__:hover {
      cursor: move;
      user-select: none;
    }

    #__xmdownload__community__ .albumView table {
      width: 100%;
    }

    #__xmdownload__community__ .albumView table th{
      text-align: left;
    }

    #__xmdownload__community__ .albumView table td{
      min-width: 80px;
      max-width: 300px;
    }
  ` );

  addDragBehavior(`#${APPID}`);

  $(`#${APPID}`)
    .on('click', '.download_hook', async function (item) {
      const trackId = item.target.dataset.trackId;
      const {
        url
      } = await getTrackViewData(trackId);
      if (url) {
        window.open(url, '_blank');
      } else {
        alert(`获取下载链接失败，可能是因为【你正在尝试获取会员专享音频，但你目前不是会员】`);
      }
    });

  $(`#${APPID}`)
    .on('click', '.get_link_hook', async function (item) {
      const trackId = item.target.dataset.trackId;
      const {
        url
      } = await getTrackViewData(trackId);
      if (url) {
        GM_setClipboard(url, 'text/plain');
      } else {
        alert(`获取下载链接失败，可能是因为【你正在尝试获取会员专享音频，但你目前不是会员】`);
      }
    });

  const albumViewTpl = `
    <div class="albumView">
      <table>
        <thead>
          <th>序号</th>
          <th>标题（点击标题打开音频）</th>
          <th></th>
        </thead>
        <tbody>
          <tr soda-repeat="item in data">
            <td>{{item.index}}</td>
            <td><a class="download_hook" data-track-id="{{item.trackId}}">{{item.title}}</a></td>
            <td><a class="get_link_hook" data-track-id="{{item.trackId}}">复制链接</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  const trackViewTpl = `
    <div class="trackView">
      <a class="download_hook" data-track-id="{{data.trackId}}" target="_blank">{{data.title}}（点击打开音频）</a>
      <a class="get_link_hook" data-track-id="{{item.trackId}}">复制链接</a>
    </div>
  `;


  const loadingViewTpl = `
    正在为你获取音频列表……
  `;

  pageViewChange$(async function () {
    $(`#${APPID}`)
      .html(soda(loadingViewTpl, {}))
      .show();

    if (isAlbumView()) {
      const albumId = getId(location.href);
      const albumData = await getAlbumViewData(albumId);
      $(`#${APPID}`)
        .html(soda(albumViewTpl, {
          data: albumData
        }));
    } else if (isTrackView()) {
      const trackId = getId(location.href);
      const trackData = await getTrackViewData(trackId);
      $(`#${APPID}`)
        .html(soda(trackViewTpl, {
          data: trackData
        }));
    } else {
      $(`#${APPID}`).hide();
    }
  });
})();
