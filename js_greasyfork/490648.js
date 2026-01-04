// ==UserScript==
// @name         情報処理学会 学認転送防止
// @description  情報処理学会の学認（GakuNin）システムへの自動リダイレクトを防止する
// @version      2024-03-23
// @match        https://idp.ixsq.nii.ac.jp/idp/Authn/UserPassword
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @license      CC0
// @locale       ja
// @namespace https://greasyfork.org/users/1087114
// @downloadURL https://update.greasyfork.org/scripts/490648/%E6%83%85%E5%A0%B1%E5%87%A6%E7%90%86%E5%AD%A6%E4%BC%9A%20%E5%AD%A6%E8%AA%8D%E8%BB%A2%E9%80%81%E9%98%B2%E6%AD%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/490648/%E6%83%85%E5%A0%B1%E5%87%A6%E7%90%86%E5%AD%A6%E4%BC%9A%20%E5%AD%A6%E8%AA%8D%E8%BB%A2%E9%80%81%E9%98%B2%E6%AD%A2.meta.js
// ==/UserScript==

// https://stackoverflow.com/questions/3972038/stop-execution-of-javascript-function-client-side-or-tweak-it/10468821#10468821

'use strict';

if (document.head) {
    throw new Error('Head already exists - make sure to enable instant script injection');
}
console.log("take over prevention script loaded");

new MutationObserver((_, observer) => {
    console.log("mutation observed");
    // const scriptTag = document.querySelector('script[src^="https://ds.gakunin.nii.ac.jp/WAYF/embedded-wayf.js?"]');
    //      const scriptTag = document.querySelector('script');

    for (const scriptTag of document.querySelectorAll('script')) {
        console.log("script found", scriptTag);
        if (scriptTag) {
            scriptTag.remove();
            // observer.disconnect();
        }
    }
})
    .observe(document.documentElement, { childList: true, subtree: true });
