 // ==UserScript==
// @icon         https://ci.phncdn.com/www-static/favicon.ico
// @name         【fork&mod】Pornhub 视频一键下载 | pornhub.com
// @namespace    https://github.com/ekoooo/tampermonkey_pornhub_video_download
// @version      0.1.3-01
// @description  Pornhub 视频一键下载 | pornhub.com | 无需登录直接下载 | 可直接下载免费观看付费下载视频 | 可下载已禁止下载的视频 | 可下载所有可观看分辨率
// @author       liuwanlin 【mod by heckles】
// @match        *://*.pornhub.com/view_video.php?viewkey=*
// @match        *://*.pornhubpremium.com/view_video.php?viewkey=*
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_notification
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/491329/%E3%80%90forkmod%E3%80%91Pornhub%20%E8%A7%86%E9%A2%91%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%20%7C%20pornhubcom.user.js
// @updateURL https://update.greasyfork.org/scripts/491329/%E3%80%90forkmod%E3%80%91Pornhub%20%E8%A7%86%E9%A2%91%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%20%7C%20pornhubcom.meta.js
// ==/UserScript==

GM_addStyle(`
.download-urls ul {
  padding: 10px;
  font-weight: bold;
  line-height: 1.5;
}
.download-urls ul li {
  display: flex;
  align-items: center;
  height: 20px;
  max-width:400px;
}
.download-url-label {
  //width: 100px;
  text-align: right;
}
.download-url-copy {
  flex: 100;
}
.download-url-input {
  flex: 3;
  font-size: 12px;
  padding: 0 5px;
  border: 1px solid #ffff;
  margin: 0 5px;
}
`);

(function () {
  'use strict';

  const MutationObserver = unsafeWindow.MutationObserver || unsafeWindow.WebKitMutationObserver || unsafeWindow.MozMutationObserver;
  const mutationObserver = new MutationObserver(mutations => {
    mutationObserver.disconnect();
    setTimeout(() => {
      unsafeWindow.VideoParsing.init();
    }, 200);
  });
//PC和非PC,注意判断条件里不能用$简写，不知为问什么
  let playerdiv;//let可以先不赋值，用在这里
  if (document.querySelector('#player')) {
    playerdiv = document.querySelector('#player');
  }
  else{
    console.log("安卓");
    playerdiv = document.querySelector('.playerWrapper');
  }
  const playerDom = playerdiv;
//

  if (playerDom) {
    mutationObserver.observe(playerDom, {
      childList: true,
      subtree: true,
    });
  } else {
    console.warn('视频一键下载未生效！');
  }
})();

(function () {
  class VideoParsing {
    // 根据 key 开头字母获取对象中的值，返回数组
    static getObjectValueByStartsWithChar(obj, char) {
      const vars = [];
      Object.keys(obj).forEach(key => {
        if (key.startsWith(char)) {
          vars.push({
            key: key,
            value: obj[key],
          });
        }
      });
      return vars;
    }

    // 获取下载地址信息，返回数组
    static getUrlInfo() {
      const flashvars = this.getObjectValueByStartsWithChar(unsafeWindow, 'flashvars_');
      if (!flashvars.length) {
        console.error('错误，未获取视频地址！', flashvars);
        return;
      }

      let videosInfo = [];

      try {
        videosInfo = flashvars[0]['value']['mediaDefinitions'];
      } catch (e) {
        console.error('错误，获取视频信息失败！', e, flashvars);
        return;
      }

      let remoteAddress = undefined;
      let urlInfo = [];

      for (let i = 0; i < videosInfo.length; i++) {
        if (videosInfo[i]['remote']) {
          remoteAddress = videosInfo[i]['videoUrl'];
          break;
        }
      }

      // MP4 信息
      if (remoteAddress) {
        $.ajax({
          url: remoteAddress,
          async: false,
          success: (data) => {
            if (data && data.length) {
              urlInfo = urlInfo.concat(data.map(item => ({
                quality: item.quality + '.' + item.format,
                url: item.videoUrl
              })));
            }
          }
        });
      }

      console.log(videosInfo);

      return urlInfo;
    }

    // 注入到下载面板
    static injectUrls2Dom(urlInfo) {
      const li = [];

      urlInfo.forEach(item => {
        li.push(`
          <li>
            <span class="download-url-label">[ ${item.quality} ]</span>
            <input class="download-url-input" value="${item.url}" />
            <a target="_blank" class="download-url-copy" data-href="${item.url}" href="javascript: void(0);">点击复制地址</a>
          </li>
        `);
      });
//pc和非PC两种情况都加上
      $('.playerWrapper').after(`<div class="download-urls"><h3>不同分辨率视频下载地址：</h3><ul>${li.join('')}</ul></div>`);
      $('#player').after(`<div class="download-urls"><h3>不同分辨率视频下载地址：</h3><ul>${li.join('')}</ul></div>`);
    }

    // 初始化事件
    static initEvens() {
      // 点击下载复制到粘贴板中
      $(document).on('click', '.download-url-copy', function (e) {
        e.preventDefault();
        GM_setClipboard($(this).data('href'));
        GM_notification('下载地址复制成功！', '提示');
      });
    }

    static init() {
      this.injectUrls2Dom(this.getUrlInfo());
      this.initEvens();
    }
  }

  unsafeWindow.VideoParsing = VideoParsing;
})();