// ==UserScript==
// @name             test
// @version           3.5.15
// @description      仅供测试使用
// @namespace       testVideo
// @author            test
// @license           MIT
// @supportURL        https://greasyfork.org/scripts/442988-test/code/test.user.js
// @match             *://*/*
// @match             *://*/*/*
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @run-at            document-end
// @grant             unsafeWindow
// @grant             GM_addStyle
// @grant   GM_getValue
// @grant   GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/442988/test.user.js
// @updateURL https://update.greasyfork.org/scripts/442988/test.meta.js
// ==/UserScript==


(function () {
  'use strict';
  GM_setValue('init','no');
  if(GM_getValue('init')=='yes'){
      return;
  }
  GM_setValue('init','yes');
  GM_addStyle('.h-icon-play {color: #d926b5;fill: #d926b5;height: 80px;width: 80px;position: fixed;z-index: 999999;top: 0px;left: 0;cursor: pointer;}  .h-ol {position: fixed;top: 80px;left: 20px;z-index: 99999;counter-reset: li;list-style: none;font-size: 14px;padding: 0;margin-bottom: 2em;text-shadow: 0 1px 0 rgba(255, 255, 255, .5);display: none;}  .h-ol a {position: relative;display: block;padding: 3px 10px 3px 2em;margin: 0.5em 0;background: #ddd;color: #444;text-decoration: none;border-radius: 0.3em;transition: all 0.3s ease-out;}  .h-ol a:hover {background: #eee;color: #ff6f5c;transition: all 0.3s ease-out;}  .h-ol a::before {content: counter(li);counter-increment: li;position: absolute;left: -1.2em;top: 50%;margin-top: -1.2em;background: #87ceeb;height: 2em;width: 2em;line-height: 2em;border: 0.2em solid #fff;text-align: center;font-weight: bold;border-radius: 2em;}');

  // 隐藏页面弹窗干扰信息
  GM_addStyle('.at-app-banner,.mod_vip_popup,#mask_layer{display:none!important;}');

  let api = [
    { "name": "OK解析", "url": "https://okjx.cc/?url=" },
    { "name": "黑云", "url": "https://jiexi.380k.com/?url=" },
    { "name": "天翼", "url": "https://jsap.attakids.com/?url=", "t": "m" },
    { "name": "PPJ腾讯 (芒果)蓝光解析", "url": "https://bf.ppjbk.cn/?url=" },
    { "name": "BL智能解析", "url": "https://svip.bljiex.cc/?v=" },
    { "name": "人人", "url": "https://jx.blbo.cc:4433/?url=" },
    { "name": "盖世", "url": "https://www.gai4.com/?url=" },
    { "name": "江湖", "url": "https://api.jhdyw.vip/?url=" },
    { "name": "PM", "url": "https://www.playm3u8.cn/jiexi.php?url=" },
    { "name": "盘古", "url": "https://www.pangujiexi.com/jiexi/?url=" },
    { "name": "辉煌", "url": "http://jx.hhwlkj.top/jx.php?url=" },
  ];

  let isShow = location.host.match(/youku|iqiyi|le|qq|tudou|mgtv|sohu|bilibili|pptv|baofeng/ig);
  jQuery('.btn_close').trigger('click');
  let main = {
    showButton: function () {
      if(jQuery('.h-icon-play').length > 0){
        return
      }
      if (isShow) {
        let mainButton = '<div class="h-icon-play" title="解析接口"><svg viewBox="0 0 512 512"><path d="M422.6 193.6c-5.3-45.3-23.3-51.6-59-54 -50.8-3.5-164.3-3.5-215.1 0 -35.7 2.4-53.7 8.7-59 54 -4 33.6-4 91.1 0 124.8 5.3 45.3 23.3 51.6 59 54 50.9 3.5 164.3 3.5 215.1 0 35.7-2.4 53.7-8.7 59-54C426.6 284.8 426.6 227.3 422.6 193.6zM222.2 303.4v-94.6l90.7 47.3L222.2 303.4z"></path></svg></div>';
        let apiList = '<ol class="h-ol"></ol>';

        (function () {
          jQuery("body").on('click', '.h-ol a', function (e) {
            let objfj = jQuery(this), href = objfj.attr('href') || objfj.data("href");
            window.open(href + encodeURI(location.href));
          })
        })();

        
        
        jQuery(document.body).append(mainButton);
        jQuery(document.body).append(apiList);

        let fragment = document.createDocumentFragment();
        api.forEach((val, index) => {
          jQuery(fragment).append(`<li><a target="_blank" href="${val.url}">${val.name}</a></li>`)
        });
        jQuery('.h-ol').append(fragment);
        
        let lock = false;
        jQuery(document.body).on('click', '.h-icon-play', function () {
          if (lock) {
            console.log('hide');
            jQuery('.h-ol').hide();
            lock = false;
          } else {
            console.log('show');
            jQuery('.h-ol').show();
            lock = true;
          }

        });
      }
    }
  };

  jQuery(function () {
    main.showButton();
  });
  
})();
