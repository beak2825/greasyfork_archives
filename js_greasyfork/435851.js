// ==UserScript==
// @name         页面美化(滚动条)
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自用的一些美化，不定时更新
// @author       攸泠
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435851/%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96%28%E6%BB%9A%E5%8A%A8%E6%9D%A1%29.user.js
// @updateURL https://update.greasyfork.org/scripts/435851/%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96%28%E6%BB%9A%E5%8A%A8%E6%9D%A1%29.meta.js
// ==/UserScript==

(function() {
    /*创建一个style节点用来存放滚动条的样式*/
    var rollStyle = document.createElement("style");
    /*存放于rollStyle中的样式*/
    var roll = `
    ::-webkit-scrollbar{max-width:15px;}
    ::-webkit-scrollbar-track{border-radius: 15px;
    -webkit-box-shadow:inset 0 0 13px rgba(0,120,120,0.7)}
    ::-webkit-scrollbar-thumb{border-radius:15px;background:rgba(0,120,120,0.2);
    -webkit-box-shadow: inset 0 0 6px rgba(0,120,120,0.4);}';
    `;
    /*将roll样式丢进rollStyle中*/
    rollStyle.innerHTML = roll;
    /*将rollStyle节点丢进head节点中*/
    document.getElementsByTagName('head')[0].append(rollStyle);
})();