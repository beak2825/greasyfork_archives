// ==UserScript==
// @name         Visual Studio Code Extension(vsix) Download(Cursor/Trae Install)
// @name:zh-CN   VSCode 插件(vsix)离线下载工具(支持 Cursor/Trae 一键安装)
// @namespace    https://blog.helloworldchao.tech/
// @version      202505101422
// @description  Download history version of vscode extension(vsix) from official website https://marketplace.visualstudio.com/ easily, support Cursor/Trae install one click.
// @description:zh-CN 从VSCode插件官网 https://marketplace.visualstudio.com/ 离线下载插件(vsix)，支持 Cursor/Trae 一键安装。
// @author       helloworldchao
// @match        *://marketplace.visualstudio.com/*
// @grant        none
// @license      GPLv3GPLv3
// @downloadURL https://update.greasyfork.org/scripts/530410/Visual%20Studio%20Code%20Extension%28vsix%29%20Download%28CursorTrae%20Install%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530410/Visual%20Studio%20Code%20Extension%28vsix%29%20Download%28CursorTrae%20Install%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const waitElement = (el, times, waitTime) => {
        return new Promise((resolve, reject) => {
            let _id = null, _times = times || 50, _waitTime = waitTime || 100;
            _id = setInterval(() => {
                if (_times <= 0) {
                    _id && clearInterval(_id);
                    reject();
                    return;
                }
                const element = document.querySelector(el);
                if (element) {
                    _id && clearInterval(_id);
                    resolve(element);
                    return;
                }
                _times <= 0 || _times--;
            }, _waitTime);
        })
    }

    const createElementBeforeLast = (tag, props, parent, child) => {
        const el = document.createElement(tag);
        for (const key in props) {
            el[key] = props[key];
        }
        if (child) {
            el.appendChild(child);
        }
        if (parent.childNodes.length > 0) {
            parent.insertBefore(el, parent.childNodes[parent.childNodes.length - 1]);
        }
        return el;
    }

    const createElement = (tag, props, child) => {
        const el = document.createElement(tag);
        for (const key in props) {
            el[key] = props[key];
        }
        if (child) {
            el.appendChild(child);
        }
        return el;
    }

    const loadCheck = setInterval(async () => {
        const header = await waitElement('.ux-section-header');
        if (header.innerText === 'Categories') {
            waitElement('.ms-Fabric').then((el) => {
                const openUrl = 'extension/ms-toolsai.jupyter';

                const baseProps = {
                    target: '_blank',
                    style: 'margin-left: 10px; line-height: 32px; border: 0; color: ＃FFFFFF;',
                    className: 'ms-Button ux-button install ms-Button--default root-41'
                }

                const cursorA = createElement('a', {
                    ...baseProps,
                    href: `cursor:${openUrl}`,
                    innerText: 'Cursor Install',
                    style: `${baseProps.style} background-color: #000000;`,
                })
                const traeA = createElement('a', {
                    ...baseProps,
                    href: `trae:${openUrl}`,
                    innerText: 'Trae Install',
                    style: `${baseProps.style} background: linear-gradient(90deg, #FF4A36 0%, #DE96FB 100%);`,
                })

                createElementBeforeLast('span', {
                    className: 'ux-oneclick-install-button-container',
                }, el, cursorA);

                createElementBeforeLast('span', {
                    className: 'ux-oneclick-install-button-container',
                }, el, traeA);
            })

            clearInterval(loadCheck);
            return;
        }
    }, 500);

    const search = window.location.search;
    if (search) {
        const searchParams = new URLSearchParams(search);
        const itemNameArr = searchParams.get('itemName').split('.');
        const author = itemNameArr[0];
        const extName = itemNameArr[1];

        waitElement('.version-history-table-body').then((el) => {
            for (let i = 0; i < el.childElementCount; i++) {
                const row = el.childNodes[i];
                const versionEl = row.childNodes[0];
                const version = versionEl.innerText;

                const url = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${author}/vsextensions/${extName}/${version}/vspackage`;
                const a = document.createElement('a');
                a.innerText = 'Download';
                a.href = url;
                a.target = '_blank';
                a.style = 'margin-left: 10px;';
                versionEl.appendChild(a);
            }
        })
    }
})();