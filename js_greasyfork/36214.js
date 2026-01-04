// ==UserScript==
// @name              replace copy flash on Discuz
// @name:zh-CN        替换Discuz的复制flash
// @description       Replace the "click here to copy" flash on Discuz
// @description:zh-CN 替换Discuz论坛的"点此复制到剪贴板"flash
// @namespace         https://github.com/Testla
// @version           0.9.1
// @include           http*://www.tsdm.me/*
// @include           http*://www.lightnovel.cn/*
// @author            Testla
// @license           MIT License
// @compatible        firefox 57 + Greasemonkey4/Tampermonkey tested
// @compatible        chrome + Tampermonkey
// @require           https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant             GM.info
// @grant             GM.setClipboard
// @grant             GM_info
// @grant             GM_setClipboard
// @grant             unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/36214/replace%20copy%20flash%20on%20Discuz.user.js
// @updateURL https://update.greasyfork.org/scripts/36214/replace%20copy%20flash%20on%20Discuz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // There are two versions available,
    // the non-privileged version doesn't use privileged API
    // but doesn't support Greasemonkey 4+
    // and may be incompatible with some old browsers
    // (check https://developer.mozilla.org/en-US/docs/Web/API/document/execCommand#Browser_compatibility).
    // To switch to the non-privileged version:
    // 1. remove all @require and @grant in the header
    // 2. add @grant none to the same place
    // 3. comment out the privileged version
    // 4. uncomment the non-privileged version

    // ---------------- BEGIN PRIVILEGED VERSION ----------------
    // If you only run on Greasemonkey 4+, you can remove the @require.
    // If you need not to run on Greasemonkey 4+,
    // you can remove the @require line together with the @grant GM.*s
    // and replace all "GM." with "GM_".
    // Note that the "@grant GM_*"s are required for Tampermonkey in Chrome
    // even if the corresponding "@grant GM.*"s and gm4-polyfill already exists,
    // please let me know if you can figure out why.

    function copyAndHint(text) {
        GM.setClipboard(text);
        // showPrompt comes with Discuz
        unsafeWindow.showPrompt(null, null, 'Copied', 3000);
    }

    function setCopy(text, hint) {
        copyAndHint(text);
    }

    function copycode(code_div) {
        copyAndHint(code_div.textContent);
    }

    var greasemonkey4OrGreater = GM.info.scriptHandler == 'Greasemonkey' &&
                                 parseFloat(GM.info.version) >= 4.0;
    if (greasemonkey4OrGreater) {
        // uses Firefox-specific hack
        // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Content_scripts
        exportFunction(copyAndHint, window, {defineAs:'copyAndHint'});
        window.eval(
            'window.setCopy = function(text, hint) { copyAndHint(text); };' +
            'window.copycode = function(code_div) { copyAndHint(code_div.textContent); };');
    } else {
        unsafeWindow.setCopy = setCopy;
        unsafeWindow.copycode = copycode;
    }
    // ---------------- END PRIVILEGED VERSION ----------------

    // ---------------- BEGIN NON-PRIVILEGED VERSION ----------------
    // var copyTextarea = document.createElement("textarea");
    // copyTextarea.style.width = "0px";
    // copyTextarea.style.height = "0px";
    // copyTextarea.style.position = "fixed";

    // // https://stackoverflow.com/questions/400212
    // function copyAndHint(text) {
    //     document.body.appendChild(copyTextarea);
    //     copyTextarea.textContent = text;
    //     copyTextarea.select();

    //     try {
    //         var successful = document.execCommand('copy');
    //         var msg = successful ? 'succeeded' : 'failed';
    //         showPrompt(null, null, 'Copy ' + msg, 3000);
    //     } catch (err) {
    //         showPrompt(null, null, 'Oops, unable to copy', 3000);
    //         console.log(err);
    //     }
    //     document.body.removeChild(copyTextarea);
    // }

    // window.setCopy = function(text, hint) {
    //     copyAndHint(text);
    // };

    // window.copycode = function(code_div) {
    //     copyAndHint(code_div.textContent);
    // };
    // ---------------- END NON-PRIVILEGED VERSION ----------------

    console.log('finished replacing Discuz\'s copy flash');
})();
