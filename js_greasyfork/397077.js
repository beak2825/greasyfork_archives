// ==UserScript==
// @name         吾爱破解自动切换宽窄版（去广告）
// @icon         https://www.52pojie.cn/favicon.ico
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  吾爱破解（www.52pojie.cn）自动切换窄版，去除广告
// @author       The_Soloist
// @match        https://www.52pojie.cn/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/397077/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E5%AE%BD%E7%AA%84%E7%89%88%EF%BC%88%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/397077/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E5%AE%BD%E7%AA%84%E7%89%88%EF%BC%88%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const css = `
      /* 帖内广告：水平 + 竖直 */
      .dnch_eo_pt, .dnch_eo_pr{ display: none !important; }

      /* 用户签名 + 签名下的提示 */
      .sign, .dnch_eo_pb{ display: none !important; }

      /* 底部广告 */
      .dnch_eo_f, .dnch_eo_mu{ display: none !important; }
    `

    // css去除广告
    try {
        GM_addStyle(css)
    } catch (e) {
        console.log('脚本失效，刷新后重试。', e)
    }

    // 模拟点击
    var url = document.URL;
    var switch_width_title = document.getElementById('switchwidth').getAttribute("title");
    if (url == 'https://www.52pojie.cn/' || url.indexOf('forum-') != -1 || url.indexOf('forum.php') != -1 || url.indexOf('misc.php') != -1 || url.indexOf('home.php') != -1) {
        if (switch_width_title == "切换到窄版") { // 网站目录等 切换到窄版
            document.getElementById("switchwidth").click();
        }
    }
    if (url.indexOf('thread-') != -1) {
        if (switch_width_title == "切换到宽版") { // 帖子等 切换到宽版
            document.getElementById("switchwidth").click();
        }
    }


})();