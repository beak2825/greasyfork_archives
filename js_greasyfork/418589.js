// ==UserScript==
// @name         AtCoderJudgeStatusNotifier
// @namespace    https://twitter.com/merom686
// @version      1.0
// @description  ジャッジの進行状況をデスクトップ通知で表示
// @author       merom686
// @match        https://atcoder.jp/contests/*/submissions/me*
// @grant        GM_notification
// @grant        window.focus
// @downloadURL https://update.greasyfork.org/scripts/418589/AtCoderJudgeStatusNotifier.user.js
// @updateURL https://update.greasyfork.org/scripts/418589/AtCoderJudgeStatusNotifier.meta.js
// ==/UserScript==

(function(){
    const cAC = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAALklEQVRYhe3OIQEAAAgDsAd9UNpBDMzE/NLpfoqAgICAgICAgICAgICAgMB34ABPc7yI0MaTwgAAAABJRU5ErkJggg==';
    const cWA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAL0lEQVRYhe3OIQEAAAgDMBLSlG40gBg3E/Ornb6kEhAQEBAQEBAQEBAQEBAQSAcediCopjwhoTMAAAAASUVORK5CYII=';
    const cWJ = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAALElEQVRYhe3OoQEAAAwCIL/2/O0MC4FO2t5SBAQEBAQEBAQEBAQEBAQE1oEHZKaQiHWRRSkAAAAASUVORK5CYII=';
    let s0 = '';
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node.tagName == 'SPAN') node = node.parentNode;
                if (node.tagName == 'TD') {
                    const text = node.innerText;
                    if (text == 'WJ') continue;
                    const td = node.parentNode.getElementsByTagName('TD');
                    const s1 = td[1].textContent + ' (' + td[0].textContent + ')\n\n' + text;
                    if (s1 == s0) continue; else s0 = s1;
                    GM_notification({
                        title: 'AtCoderJudgeStatusNotifier',
                        text: s1,
                        image: text == 'AC' ? cAC : /[A-Z]/.test(text) ? cWA : cWJ,
                        timeout: /[A-Z]/.test(text) ? 10000 : 2000,
                        onclick: () => window.focus(),
                    });
                }
                break;
            }
        }
    });
    observer.observe(document, {childList:true, subtree:true});
})();