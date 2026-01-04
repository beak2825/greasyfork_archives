// ==UserScript==
// @name         Check QuickerAction is Dwonloaded or can Update
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  对动作网页进行优化
// @author       HDG
// @match        https://getquicker.net/Sharedaction?code=*
// @icon         data:image/png;base64,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
// @license       MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502258/Check%20QuickerAction%20is%20Dwonloaded%20or%20can%20Update.user.js
// @updateURL https://update.greasyfork.org/scripts/502258/Check%20QuickerAction%20is%20Dwonloaded%20or%20can%20Update.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function resetSessionStorage() {
        // 刷新网页后要移除缓存
        if (sessionStorage.getItem('scriptRun') !== null) {
            sessionStorage.removeItem('scriptRun');
            run();
        }
    }

    function run() {
        const runner = "96b44184-fea7-4bd8-9b5c-08dcb09936a7";
        var button = document.getElementById('btnCopyToClipboard');
        var id = button.getAttribute('sharedaction');
        const versionNumber = document.querySelector("tr:nth-child(3) td+ td").innerText
        const url = `quicker:runaction:${runner}?id=${id};version=${versionNumber}`;
        window.location.assign(url);
        sessionStorage.setItem('scriptRun', true);
    }

    window.addEventListener('load', resetSessionStorage);

    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            if (sessionStorage.getItem('scriptRun') === null) {
                //切换到符合的标签页且未运行过脚本（后台打开的标签页）
                run();
            }
        }
    });
})();