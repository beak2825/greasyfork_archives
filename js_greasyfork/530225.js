// ==UserScript==
// @name         Install VS Code extension with Cursor
// @name:zh-CN   在 VS Code 插件扩展市场上使用 Cursor 代码编辑器安装插件
// @name:zh-TW   在 VS Code 外掛插件程式擴充市場上使用 Cursor 程式碼編輯器安裝外掛
// @name:fr      Installer l'extension avec l'éditeur Cursor Editor sur VS Code Marketplace
// @name:fr-CA   Installer l'extension avec l'éditeur Cursor Editor sur VS Code Marketplace
// @namespace    https://tomchen.org/
// @version      1.0.0
// @description  Change "vscode:" URI scheme links to "cursor:" in the install button on Visual Studio Code Extension Marketplace extension page, so click the button, the extension can be opened and installed by Cursor AI Editor
// @description:zh-CN 对于 Visual Studio Code 插件扩展市场上插件页面的安装按钮，将“vscode:”链接更改为“cursor:”，这样点击按钮即可使用 Cursor AI 代码编辑器打开并安装该插件
// @description:zh-TW 對於 Visual Studio Code 外掛插件程式擴充市場上外掛頁面的安裝按鈕，將“vscode:”連結變更為“cursor:”，這樣點擊按鈕即可使用 Cursor AI 程式碼編輯器開啟並安裝插件
// @description:fr Remplacer les liens du schéma URI « vscode : » par « cursor : » dans le bouton d'installation sur la page d'extension de Visual Studio Code Extension Marketplace, quand vous cliquez sur le bouton, l'extension peut être ouverte et installée par Cursor, l'éditeur AI
// @description:fr-CA Remplacer les liens du schéma URI « vscode : » par « cursor : » dans le bouton d'installation sur la page d'extension de Visual Studio Code Extension Marketplace, quand vous cliquez sur le bouton, l'extension peut être ouverte et installée par Cursor, l'éditeur AI
// @author       Tom Chen (tomchen.org)
// @license      MIT
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   opera
// @compatible   brave
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cursor.com
// @match        https://marketplace.visualstudio.com/items*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/530225/Install%20VS%20Code%20extension%20with%20Cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/530225/Install%20VS%20Code%20extension%20with%20Cursor.meta.js
// ==/UserScript==

(function() {
    function replaceVscodeUrlWithCursor() {
        const button = document.querySelector('.ux-oneclick-install-button-container a.ms-Button');
        if (button && button.href.startsWith('vscode:')) {
            button.href = button.href.replace('vscode:', 'cursor:');
        }
    }
    [0, 400, 800, 1200, 1800, 3000, 5000].forEach(delay => setTimeout(replaceVscodeUrlWithCursor, delay));
})();
