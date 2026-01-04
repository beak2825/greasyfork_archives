// ==UserScript==
// @name         隐藏知乎视频
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  隐藏知乎首页的视频回答
// @author       clam314
// @match        https://www.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?domain=zhihu.com
// @downloadURL https://update.greasyfork.org/scripts/434610/%E9%9A%90%E8%97%8F%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/434610/%E9%9A%90%E8%97%8F%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css.replace(/;/g, ' !important;');
        head.appendChild(style);
    }

    addGlobalStyle ( `
    div.ZVideoItem , div.css-5tmz26{
        display: none;
    }
    div[style^='height: 180px']{
        display: none;
    }
    div[data-za-extra-module*='"has_video":true']{
       display:none;
    }
` );
})();