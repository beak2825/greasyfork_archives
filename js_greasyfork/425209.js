// ==UserScript==
// @name         网易云显示封面
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  网易云显示封面，支持歌单页、每日推荐页、歌手热门50首歌曲页、榜单页
// @author       Beats0
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @home-url     https://greasyfork.org/zh-CN/scripts/425209-%E7%BD%91%E6%98%93%E4%BA%91%E6%98%BE%E7%A4%BA%E5%B0%81%E9%9D%A2
// @home-url2    https://github.com/Beats0/scripter/tree/master/NeteaseCloudMusicPic
// @match        https://music.163.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425209/%E7%BD%91%E6%98%93%E4%BA%91%E6%98%BE%E7%A4%BA%E5%B0%81%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/425209/%E7%BD%91%E6%98%93%E4%BA%91%E6%98%BE%E7%A4%BA%E5%B0%81%E9%9D%A2.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function loadPublicCss() {
    const gIframe = document.getElementById('g_iframe')
    const gDocument = gIframe.contentDocument
    const styleCode = `.m-table .w1 { width: 170px; } .m-table .hd { display: flex; width: 100%; height: 100px; align-items: center; justify-content: center; } .picImg { display: block; width: 100px; height: 100px; } tbody .left, .m-table td { padding-top: 0; padding-bottom: 0; }`
    const style = gDocument.createElement('style');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.appendChild(gDocument.createTextNode(styleCode));
    const head = gDocument.getElementsByTagName('head')[0];
    head.appendChild(style);
  }

  class NeteaseCloudMusicPic {
    constructor() {
      this.init()
    }

    init() {
      console.log('init NeteaseCloudMusicPic')
      this.initPushStateEvent()
      let _this = this
      window.addEventListener('locationchange', function () {
        _this.getList()
      })
      this.getList()
    }

    // 获取g_iframe document
    getGIframeDocument() {
      const gIframe = document.getElementById('g_iframe')
      if (gIframe) {
        return gIframe.contentDocument
      }
    }

    // 获取数据
    getList() {
      const currentUrl = document.location.href
      // 歌单页
      const playlistUrl = `/playlist?id=`
      // 每日推荐页
      const recommendPlayListUrl = `/discover/recommend/taste`
      // 歌手热门50首歌曲页
      const artistHotTopUrl = `/artist?id=`
      // 榜单页
      const topListUrl = `/toplist?id=`
      let id = ''
      // 歌单
      if (currentUrl.indexOf(playlistUrl) !== -1 || currentUrl.indexOf(topListUrl) !== -1) {
        const parsedUrlData = this.parseUrl();
        id = parsedUrlData['id']
        if (id) {
          this.loadPlaylist(id)
        }
      }
      // 每日推荐
      if (currentUrl.indexOf(recommendPlayListUrl) !== -1) {
        this.loadRecommendPlayList()
      }
      // 歌手热门50首歌曲
      if (currentUrl.indexOf(artistHotTopUrl) !== -1) {
        const parsedUrlData = this.parseUrl();
        id = parsedUrlData['id']
        if (id) {
          this.loadArtistHotTop(id)
        }
      }
    }

    // 歌单
  loadPlaylist(id) {
    const formData = {
      id,
      limit: "9999",
      n: "9999",
      offset: "0",
      total: "true",
    }
    let _this = this
    const apiUrl = `/weapi/v6/playlist/detail`
    this.fetchData(apiUrl, formData)
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          let tracks = res.playlist.tracks || [];
          setTimeout(() => {
            const gDocument = _this.getGIframeDocument();
            const resId = String(gDocument.querySelector('.u-btni-addply').getAttribute('data-res-id'))
            let elLists = gDocument.querySelectorAll('td .hd');
            tracks.forEach((track, index) => {
              if(resId !== String(id)) return;
              const picUrl = track.al.picUrl;
              let albumEl = document.createElement('a');
              albumEl.setAttribute('href', picUrl);
              albumEl.setAttribute('target', '_blank');
              let albumImgEl = document.createElement('img');
              albumImgEl.setAttribute('src', `${picUrl}?param=150y150`);
              albumImgEl.setAttribute('class', `picImg`);
              albumEl.appendChild(albumImgEl);
              elLists[index].appendChild(albumEl);
            });
          }, 1000);
        }
      });
  }

    // 每日推荐
    loadRecommendPlayList() {
      const formData = {
        'limit': '30',
        'offset': '0',
        'total': 'true'
      }
      let _this = this
      const apiUrl = `/weapi/v2/discovery/recommend/songs`
      this.fetchData(apiUrl, formData)
        .then((res) => res.json())
        .then((res) => {
          if (res.code === 200) {
            let tracks = res.data.dailySongs || []
            setTimeout(() => {
              const gDocument = _this.getGIframeDocument()
              let elLists = gDocument.querySelectorAll('td.left .hd')
              tracks.forEach((track, index) => {
                const picUrl = track.album.picUrl
                let albumEl = document.createElement('a');
                albumEl.setAttribute('href', picUrl)
                albumEl.setAttribute('target', '_blank')
                let albumImgEl = document.createElement('img');
                albumImgEl.setAttribute('src', `${ picUrl }?param=150y150`)
                albumImgEl.setAttribute('class', `picImg`)
                albumEl.appendChild(albumImgEl)
                elLists[index].appendChild(albumEl)
              })
            }, 1000);
          }
        });
    }

    // 歌手热门50首歌曲
    loadArtistHotTop(id) {
      const formData = {
        id,
      }
      let _this = this
      const apiUrl = `/api/artist/top/song?id=${ id }`
      this.fetchData(apiUrl, formData)
        .then((res) => res.json())
        .then((res) => {
          if (res.code === 200) {
            let tracks = res.songs
            setTimeout(() => {
              const gDocument = _this.getGIframeDocument()
              let elLists = gDocument.querySelectorAll('td .hd')

              tracks.forEach((track, index) => {
                const picUrl = track.al.picUrl
                let albumEl = document.createElement('a');
                albumEl.setAttribute('href', picUrl)
                albumEl.setAttribute('target', '_blank')
                let albumImgEl = document.createElement('img');
                albumImgEl.setAttribute('src', `${ picUrl }?param=150y150`)
                albumImgEl.setAttribute('class', `picImg`)
                albumEl.appendChild(albumImgEl)
                elLists[index].appendChild(albumEl)
              })
            }, 1000);
          }
        });
    }

    // fetch 封装
    fetchData(url, formData, method = 'POST') {
      const csrf_token = this.getCookieName('__csrf')
      if (url.indexOf('?') !== -1) {
        url = `https://music.163.com${ url }&csrf_token=${ csrf_token }`
      } else {
        url = `https://music.163.com${ url }?csrf_token=${ csrf_token }`
      }
      formData.csrf_token = csrf_token
      let queryData = [
        JSON.stringify(formData),
        "010001",
        "00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7",
        "0CoJUm6Qyw8W8jud",
      ];

      let a = window.asrsea(...queryData);
      return fetch(url, {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        referrer: "https://music.163.com/",
        body: `params=${ encodeURIComponent(a.encText) }&encSecKey=${ encodeURIComponent(a.encSecKey) }`,
        method
      })
    }

    // 获取cookie
    getCookieName(cookieName) {
      var c = document.cookie
        , cc = "\\b" + cookieName + "="
        , cs = c.search(cc);
      if (cs < 0)
        return "";
      cs += cc.length - 2;
      var result = c.indexOf(";", cs);
      if (result < 0)
        result = c.length;
      return c.substring(cs, result) || ""
    }

    // 解析url
    parseUrl() {
      const href = window.location.href;
      const params = href.split('?')[1];

      let result = {}

      if (params && params !== '') {
        result = params.split('&').reduce(function (res, item) {
          const parts = item.split('=');
          res[parts[0]] = parts[1];
          return res;
        }, {});
      }
      return result
    }

    // 监听 history PushState
    initPushStateEvent() {
      history.pushState = (f => function pushState() {
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
      })(history.pushState);

      history.replaceState = (f => function replaceState() {
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
      })(history.replaceState);

      window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'))
      });
    }
  }

  let iframe = $("#g_iframe");
  iframe.on('load', function () {
    // 每次都加载样式
    loadPublicCss()
    // 防止重复
    if (window.neteaseCloudMusicPic) return
    const neteaseCloudMusicPic = new NeteaseCloudMusicPic()
    window.neteaseCloudMusicPic = neteaseCloudMusicPic
  });
})();


