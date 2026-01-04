// ==UserScript==
// @name         给登录教学信息网的同学一人一个ymzx
// @namespace    http://tampermonkey.net/
// @version      2023-12-18
// @description  给登录教学信息网的同学一人一个元梦之星
// @author       Teruteru
// @match        https://i.sjtu.edu.cn/xtgl/login_slogin.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sjtu.edu.cn
// @grant        GM_addStyle
// @runat        document-start
// @downloadURL https://update.greasyfork.org/scripts/482515/%E7%BB%99%E7%99%BB%E5%BD%95%E6%95%99%E5%AD%A6%E4%BF%A1%E6%81%AF%E7%BD%91%E7%9A%84%E5%90%8C%E5%AD%A6%E4%B8%80%E4%BA%BA%E4%B8%80%E4%B8%AAymzx.user.js
// @updateURL https://update.greasyfork.org/scripts/482515/%E7%BB%99%E7%99%BB%E5%BD%95%E6%95%99%E5%AD%A6%E4%BF%A1%E6%81%AF%E7%BD%91%E7%9A%84%E5%90%8C%E5%AD%A6%E4%B8%80%E4%BA%BA%E4%B8%80%E4%B8%AAymzx.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('.shjd-header{height: 180px;background-image: url("https://s2.loli.net/2023/12/17/Xdtx79pQNrGeWfB.webp");background-size: cover;}')
    GM_addStyle('.container_1170{margin-top:20px}')
    GM_addStyle('#xtmc{color: white;-webkit-text-stroke: 6px transparent;background: #8865ff top left / 100% 100%;-webkit-background-clip: text;}')
    GM_addStyle('.navbar{border-width: 0}')
    // 获取图片元素
    var img = document.querySelector('.logo img');
    // 替换图片地址
    img.src = 'https://game.gtimg.cn/images/ymzx/web202312pc/logo-GKu6Sdbo.png';
})();