// ==UserScript==
// @name         网站访问优化
// @namespace    http://www.aezo.cn/
// @version      1.5.0
// @description  【网站访问优化】主要为了改善一些用户体验不佳的网站访问。如去除网站的一些强制广告，对网站排版进行调整等
// @author       smalle
// @match        *://*.csdn.net/*
// @match        *://*.iviewui.com/*
// @match        *://hub.kubeapps.com/*
// @match        *://www.jianshu.com/*
// @match        *://*.cnblogs.com/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/398574/%E7%BD%91%E7%AB%99%E8%AE%BF%E9%97%AE%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/398574/%E7%BD%91%E7%AB%99%E8%AE%BF%E9%97%AE%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

/*
## 功能

- CSDN二维码登录去除，自动点击查看更多
- 简书详情页面宽度调整
- 去掉iview文档页小广告
- 设置hub.kubeapps.com详情页宽度
- 解决cnblogs中png图片放大查询时看不清问题

## TODO

- 如何监听新加入的元素，如去除知乎登录弹框
*/

(function () {
  "use strict";

  window.onload = function () {
    main.run();
  };

  var main = {
    run: function () {
      main.csdn();
      main.janshu();
      main.iview();
      main.kubeapps();
      main.cnblogs();
    },
    /* === CSDN二维码登录去除，自动点击查看更多 === */
    csdn: function () {
      if (location.host.match(/blog.csdn.net/gi)) {
        // 清除二维码登录弹框
        var csdn_passportbox = document.getElementById("passportbox");
        if (csdn_passportbox) csdn_passportbox.remove();
        var csdn_login_mark = document.getElementsByClassName("login-mark");
        if (csdn_login_mark && csdn_login_mark.length > 0) {
          for (var i = 0; i < csdn_login_mark.length; i++) {
            csdn_login_mark[i].remove();
          }
        }

        // 自动点击查看更多
        var csdn_btn_readmore_zk = document.getElementById("btn-readmore-zk");
        console.log(csdn_btn_readmore_zk);
        if (csdn_btn_readmore_zk) {
          csdn_btn_readmore_zk.click();
        }
      }
    },
    /* === 简书详情页面宽度 === */
    janshu: function () {
      if (location.host.match(/www.jianshu.com/gi)) {
        GM_addStyle(`
          ._gp-ck {width: 1200px;}
          ._3Pnjry {left: calc((100vw - 1500px)/2 - 78px);}
        `);
      }
    },
    /* === 隐藏iview官网友情提示 === */
    iview: function () {
      if (location.host.match(/www.iviewui.com/gi)) {
        GM_addStyle(`
          .wrapper-container-tip-out{display:none !important;}
        `);
      }
    },
    /* === 设置hub.kubeapps.com详情页宽度 === */
    kubeapps: function () {
      if (location.host.match(/hub.kubeapps.com/gi)) {
        GM_addStyle(`
          .chart-details__content[_ngcontent-c2] {max-width: 1920px;}
          @media (min-width: 52.5em) .chart-details__content__info[_ngcontent-c2] {width: 26%;}
        `);
      }
    },
    /* === 设置images2018.cnblogs.com的背景为白色，解决png图片放大查询时看不清问题 === */
    cnblogs: function () {
      if (location.host.match(/^((?!www).*)\.cnblogs\.com/)) {
        document.body.style.backgroundColor = "#fff";
      }
    }
  };
})();
