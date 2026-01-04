// ==UserScript==
// @name         OpenWithVSCode
// @name:en      OpenWithVSCode
// @version      1.1.4
// @description  快速将GitHub项目下载到本地，并支持选择VSCode或VSCodeInsiders
// @description:en  Quickly download GitHub project to local and choose VSCode or VSCodeInsiders
// @author       hoorn
// @icon         https://code.visualstudio.com/favicon.ico
// @license      MIT
// @compatible   chrome Latest
// @compatible   firefox Latest
// @compatible   edge Latest
// @noframes
// @grant        window.onurlchange
// @match        https://github.com/*
// @namespace https://greasyfork.org/users/1276388
// @downloadURL https://update.greasyfork.org/scripts/496513/OpenWithVSCode.user.js
// @updateURL https://update.greasyfork.org/scripts/496513/OpenWithVSCode.meta.js
// ==/UserScript==

(() => {
    "use strict";

    const actions = document.querySelector('.pagehead-actions');
    if (!actions || document.getElementById('openwithvscode-button')) return;

    actions.insertAdjacentHTML('afterBegin', `
        <li>
            <div class="BtnGroup">
                <a id="openwithvscode-button" class="btn btn-sm BtnGroup-item">OpenVSCode</a>
                <a id="openwithvscodeinsiders-button" class="btn btn-sm BtnGroup-item">OpenInsiders</a>
            </div>
        </li>`);

    const projectUrl = window.location.href + ".git";

    document.getElementById('openwithvscode-button').addEventListener('click', e => {
        e.preventDefault();
        window.location.href = `vscode://vscode.git/clone?url=${projectUrl}`;
    });

    document.getElementById('openwithvscodeinsiders-button').addEventListener('click', e => {
        e.preventDefault();
        window.location.href = `vscode-insiders://vscode.git/clone?url=${projectUrl}`;
    });

})();
