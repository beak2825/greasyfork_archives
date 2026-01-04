// ==UserScript==
// @name        ExtOn40
// @description 在40code上加载任何来源扩展, 包括文件和其它网站！
// @version     1
// @author      0832
// @match     https://www.40code.com/*
// @grant       none
// @namespace   ExtOn40
// @run-at      document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487885/ExtOn40.user.js
// @updateURL https://update.greasyfork.org/scripts/487885/ExtOn40.meta.js
// ==/UserScript==

function waitForVmDeclaration() {
    return new Promise((resolve) => {
        let interval = setInterval(() => {
            if (typeof vm !== 'undefined') {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    });
}

async function main() {
    await waitForVmDeclaration();
    console.log('%c💫 ExtOn40', 'font-weight: bold;');
    vm.extensionManager.securityManager.getSandboxMode = function () { return 'unsandboxed' };
    vm.extensionManager._isValidExtensionURL = function (a) { return a };
}
main();