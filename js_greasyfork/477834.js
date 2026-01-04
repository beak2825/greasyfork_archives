// ==UserScript==
// @name               Record Microsoft Teams CC Subtitles
// @name:zh            記錄 Microsoft Teams CC 字幕
// @name:zh-TW         記錄 Microsoft Teams CC 字幕
// @name:zh-CN         记录 Microsoft Teams CC 字幕
// @namespace          https://github.com/kevin823lin
// @version            1.0
// @description        Save CC subtitles to window.textList for later reference after the meeting ends.
// @description:zh     把 CC 字幕保存到 window.textList 以便在會議結束後查閱
// @description:zh-TW  把 CC 字幕保存到 window.textList 以便在會議結束後查閱
// @description:zh-CN  把 CC 字幕保存到 window.textList 以便在会议结束后查阅
// @author             kevin823lin
// @match              https://teams.microsoft.com/multi-window/*
// @icon               https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/477834/Record%20Microsoft%20Teams%20CC%20Subtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/477834/Record%20Microsoft%20Teams%20CC%20Subtitles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.textList = []
    function saveToList() {
        [...document.querySelectorAll('.ui-chat__messagecontent:not(.saved)')]
            .slice(0, -1)
            .forEach(chat => {
            window.textList.push(chat.innerText);
            chat.classList.add('saved');
        })
        // window.textList.length && console.log(window.textList.join('\n'));
    }
    setInterval(saveToList, 5000);
})();