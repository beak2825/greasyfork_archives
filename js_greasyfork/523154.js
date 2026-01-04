// ==UserScript==
// @name         网页长截图
// @description  使用 html2canvas-pro 实现对网页的长截屏
// @author       little3022
// @namespace    little3022.TM
// @homepageURL  https://greasyfork.org/users/782903
// @supportURL   https://greasyfork.org/scripts/523154/feedback
// @version      0.0.1
// @license      MIT
// @icon         data:image/png;base64,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
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @require      https://unpkg.com/html2canvas-pro/dist/html2canvas-pro.min.js
// @downloadURL https://update.greasyfork.org/scripts/523154/%E7%BD%91%E9%A1%B5%E9%95%BF%E6%88%AA%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/523154/%E7%BD%91%E9%A1%B5%E9%95%BF%E6%88%AA%E5%9B%BE.meta.js
// ==/UserScript==

const LOGS = [
    {
        version: '0.0.1',
        datetime: '2025年1月7日 14:51:10',
        describe: '1、初始化脚本'
    },
];
const __name__ = '网页长截图';
const __version__ = LOGS[0].version;
const __author__ = 'little3022';
const html2canvas = window.html2canvas;

function clog(msg) {
    function colorLog(msg, title='', version='0.0.0', level='log') {
        if(title) {
            return console[level](
                '%c %s %c %s',
                'border: 1px solid white;border-radius: 3px 0 0 3px;padding: 2px 5px;color: white;background-color: green;',
                title,
                'margin-left: -1px;border: 1px solid white;border-radius: 0 3px 3px 0;padding: 2px 5px;color: black;background-color: white;border-left: none;',
                `v${version}`,
                msg
            );
        }
        return console[level](msg);
    }
    return colorLog(msg, `${__name__} by ${__author__}`, __version__);
}

function screenshot() {
    const of = document.scrollingElement.style.overflow;
    const dialog = document.createElement('dialog');
    const title = document.createElement('div');

    dialog.addEventListener('click', () => {
        dialog.close();
        document.scrollingElement.style.overflow = of;
        document.body.removeChild(dialog);
    });
    dialog.style.margin = 'auto';
    dialog.style.border = '5px dashed #fb7cc2';
    dialog.style.borderRadius = '10px';
    dialog.style.padding = 0;
    dialog.style.minWidth = dialog.style.maxWidth = '80vw';
    dialog.style.minHeight = dialog.style.maxWidth = '80vh';

    title.style = 'display: flex;flex-direction: column;align-items: center;font-size: 24px;margin-bottom: 10px';
    title.innerHTML = '网页长截图<div style="font-size: .6em;color: #888;">（截屏中，请等待...）</div>';

    dialog.appendChild(title);
    
    html2canvas(document.body, {
        allowTaint: true,
        useCORS: true,
    }).then(canvas => {
        title.innerHTML = '网页长截图<div style="font-size: .6em;color: #888;">（请使用右键另存为图片）</div>';

        dialog.appendChild(canvas);
    }).catch(() => {
        title.innerHTML = '网页长截图<div style="font-size: .6em;color: #F92672;">（截图失败）</div>';
    });

    document.body.appendChild(dialog);
    document.scrollingElement.style.overflow = 'hidden';
    dialog.showModal();
}

(function() {
    'use strict';

    clog('[事件] - 网页长截屏已激活');
    GM_registerMenuCommand('截屏', screenshot);
})();
