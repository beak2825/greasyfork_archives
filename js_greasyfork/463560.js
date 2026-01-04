// ==UserScript==
// @name         MisskeyioTextLength(tampermonkey ver)
// @namespace    https://misskey.io/@secineralyr
// @version      0.0.2
// @description  投稿フォームに残り文字数を表示する
// @author       しせる
// @match        https://misskey.io/*
// @downloadURL https://update.greasyfork.org/scripts/463560/MisskeyioTextLength%28tampermonkey%20ver%29.user.js
// @updateURL https://update.greasyfork.org/scripts/463560/MisskeyioTextLength%28tampermonkey%20ver%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const maxLength = 3000;

    let showed_widget = false;
    let opened_popup = false;
    window.addEventListener("load", () => {
        const targetNode = document.querySelector('body');

        const config = { childList: true, subtree: true };

        const callback = function (mutationsList, observer) {
            const form_e = document.querySelector(".xpDI4.xxtDg");
            if (form_e != null) {
                if (opened_popup) return;
                opened_popup = true;
                const input_e = document.querySelector(".xpDI4.xxtDg>.xnEld>textarea");
                const p_e = document.createElement("p");
                p_e.innerText = maxLength.toString();
                input_e.addEventListener("input", (eo) => {
                    p_e.innerText = (maxLength - eo.target.value.length).toString();
                });
                document.querySelector(".xpDI4.xxtDg>.x6ccQ>.x1Ye0").prepend(p_e);
                setTimeout(() => {
                    p_e.innerText = (maxLength - input_e.value.length).toString();
                }, 100);
            }
            else {
                opened_popup = false;
            }

            const widget_e = document.querySelector(".xpDI4.xtI5S");
            if (widget_e != null) {
                if (showed_widget) return;
                showed_widget = true;
                const input_e = document.querySelector(".xpDI4.xtI5S>.xnEld>textarea");
                const p_e = document.createElement("p");
                p_e.innerText = maxLength.toString();
                input_e.addEventListener("input", (eo) => {
                    p_e.innerText = (maxLength - eo.target.value.length).toString();
                });
                document.querySelector(".xpDI4.xtI5S>.x6ccQ>.x1Ye0").prepend(p_e);
                setTimeout(() => {
                    p_e.innerText = (maxLength - input_e.value.length).toString();
                }, 100);
            }
            else {
                showed_widget = false;
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }, { once: true });
})();