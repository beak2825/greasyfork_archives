// ==UserScript==
// @name                    Jump to gitsummarize from Github
// @name:zh-CN              Github 跳转至 gitsummarize
// @namespace               http://tampermonkey.net/
// @version                 0.1.1
// @description             Add a button to jump to gitsummarize from Github
// @description:zh-CN       在 Github 页面添加一个按钮，跳转至 gitsummarize
// @author                  shiquda
// @namespace               https://github.com/shiquda/shiquda_UserScript
// @supportURL              https://github.com/shiquda/shiquda_UserScript/issues
// @match                   *://github.com/*
// @include                 *://*github*/
// @grant                   GM_addStyle
// @grant                   GM_setValue
// @grant                   GM_getValue
// @license                 MIT
// @downloadURL https://update.greasyfork.org/scripts/535130/Jump%20to%20gitsummarize%20from%20Github.user.js
// @updateURL https://update.greasyfork.org/scripts/535130/Jump%20to%20gitsummarize%20from%20Github.meta.js
// ==/UserScript==

// 判断当前path是否是一个 github repo，且位于项目的主页面
function isGithubRepo(path) {
    return path.split('/').length === 3;
}

function CreateUI() {
    const path = window.location.pathname;
    const gitsummarizeUrl = `https://gitsummarize.com${path}`;

    const button = document.createElement('button');
    button.classList.add('Box-sc-g0xbh4-0', 'exSala', 'prc-Button-ButtonBase-c50BI');
    button.setAttribute('type', 'button');
    button.setAttribute('data-size', 'small');
    button.setAttribute('data-variant', 'default');

    const buttonContent = document.createElement('span');
    buttonContent.classList.add('Box-sc-g0xbh4-0', 'gUkoLg', 'prc-Button-ButtonContent-HKbr-');

    const leadingVisual = document.createElement('span');
    leadingVisual.classList.add('prc-Button-Visual-2epfX', 'prc-Button-VisualWrap-Db-eB');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('class', 'octicon octicon-eye');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('fill', 'currentColor');
    svg.style.verticalAlign = 'text-bottom';

    const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svgPath.setAttribute('d', 'M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.825.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z');

    svg.appendChild(svgPath);
    leadingVisual.appendChild(svg);

    const text = document.createElement('span');
    text.classList.add('prc-Button-Label-pTQ3x');
    text.textContent = 'GitSummarize';

    buttonContent.appendChild(leadingVisual);
    buttonContent.appendChild(text);
    button.appendChild(buttonContent);

    button.addEventListener('click', () => {
        window.open(gitsummarizeUrl, '_blank');
    });

    const li = document.createElement('li');
    li.appendChild(button);
    li.addEventListener('click', () => {
        window.open(gitsummarizeUrl, '_blank');
    });
    document.querySelector('ul.pagehead-actions').insertBefore(li, document.querySelector('ul.pagehead-actions').firstChild);

}

(function () {
    "use strict";

    // 获取当前路径
    const path = window.location.pathname;

    // 判断当前path是否是一个 github repo，且位于项目的主页面
    if (isGithubRepo(path)) {
        CreateUI();
    }
})();
