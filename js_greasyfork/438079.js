// ==UserScript==
// @name         自动填充版本号
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  帮助你自动填充版本号，节省你的 1 分钟
// @author       Xuanyun
// @match        https://*/ec/pipelines/32405*
// @icon         <$ICON$>
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438079/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E7%89%88%E6%9C%AC%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/438079/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E7%89%88%E6%9C%AC%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isFinish = false;
    let timer;

    const changeValue = (input, value) => {
        input.value = value;
        let event = new Event('input', { bubbles: true });
        // hack React15
        event.simulated = true;
        // hack React16 内部定义了descriptor拦截value，此处重置状态
        let tracker = input._valueTracker;
        if (tracker) {
            tracker.setValue(input);
        }
        input.dispatchEvent(event);
    };

    const modified = () => {
        if (isFinish) {
            clearInterval(timer);
            return;
        }

        let version = localStorage.getItem('lucky-aone-version') || 0;
        document.querySelectorAll('input').forEach((input) => {
            switch (input.value) {
                case '0.0.8-alpha.0.0.1': {
                    changeValue(input, `0.0.17-alpha.1.${window.AK_GLOBAL.currentUser.workid}.${version}`);
                    break;
                }
                case 'anybranch': {
                    changeValue(input, `请输入你的分支名`);
                    break;
                }
                case 'daily/xxxx.x.x': {
                    changeValue(input, `daily/2022.${window.AK_GLOBAL.currentUser.workid}.1`);
                    break;
                }
            }
        });

        // 跳过预构建
        //     document.querySelectorAll('span.stage-item-label').forEach(span => {
        //         if (span.innerText === '预构建[需跳过-_-]') {
        //             const input = span.parentNode.parentNode.querySelectorAll('input')[0];
        //             changeValue(input, 'off');
        //             const checkedSpan = span.parentNode.parentNode.querySelectorAll('.checked')[0];
        //             checkedSpan && checkedSpan.classList.remove('checked');
        //         }
        //     });

        document.querySelectorAll('.next-btn-primary').forEach(button => {
            if (button.innerText === '确 认') {
                button.addEventListener('click', e => {
                    version++;
                    localStorage.setItem('lucky-aone-version', version);
                }, true);

                isFinish = true;
            }
        })
    };

    const start = () => {
        timer = setInterval(modified, 500);
    };

    start();
    // Your code here...
})();