// ==UserScript==
// @name         copy uid
// @namespace    https://www.haijiao.com/homepage/last/*
// @version      0.0.8
// @description  copy user id
// @author       You
// @match        https://www.haijiao.com/homepage/last/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.11/dist/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/467664/copy%20uid.user.js
// @updateURL https://update.greasyfork.org/scripts/467664/copy%20uid.meta.js
// ==/UserScript==

function preparingCopyText(text){
    let timer;
    const setup = () => {
        console.log('Preparing to copy text');
        const selector="#toolbar-container > .hj-search > .text";
        const el = document.querySelector(selector);
        console.log(el);
        if (el == null){
            return;
        }

        el.dataset.clipboardText = text;
        new ClipboardJS(selector);
        el.onclick = () => {window.close()}
        document.addEventListener('keyup', (e) => {
            if (e.ctrlKey && e.keyCode === 67){
                el.click();
            }
        })
        console.log('done');
        clearInterval(timer);
    };

    timer = setInterval(() => {
        setup()
    }, 300);
}

(async function () {
    "use strict";
    const paths = window.location.pathname.split('/');
    let timer;

    if (paths.length === 4) {
        preparingCopyText(paths[3]);
    }

})();
