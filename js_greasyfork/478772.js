// ==UserScript==
// @name            steamcommunity-enable-html-rendering
// @name:en         steamcommunity-enable-html-rendering
// @namespace       http://tampermonkey.net/
// @version         0.2
// @description     让Steam创意工坊正常渲染更新日志中的HTML代码。
// @description:en  Let the Steam Workshop render the HTML code in the update log normally.
// @author          青青草原专业抓羊
// @match           https://steamcommunity.com/sharedfiles/filedetails/changelog/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @homepage        https://greasyfork.org/zh-CN/scripts/478772-steamcommunity-enable-html-rendering
// @license         MIT
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/478772/steamcommunity-enable-html-rendering.user.js
// @updateURL https://update.greasyfork.org/scripts/478772/steamcommunity-enable-html-rendering.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function htmlDecode(input) {
        var ret = input.replace(/&gt;/g, '>');
          ret = ret.replace(/&lt;/g, '<');
          ret = ret.replace(/&quot;/g, '"');
          ret = ret.replace(/&apos;/g, "'");
          ret = ret.replace(/&amp;/g, '&');
          return ret;
    }

    var logList = document.querySelectorAll("#profileBlock > div > p");
    logList.forEach(element => {
        element.innerHTML = htmlDecode(element.innerHTML);
    });
})();
