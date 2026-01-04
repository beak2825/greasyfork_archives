// ==UserScript==
// @name         360doc_anti_anti-copy_anti_anti-contextmenu
// @namespace    https://github.com/Kyouichirou
// @version      1.0
// @description  No login required, copy webpage conten and open reader mode in 360doc.com; lightly adjust webpage layout for better reading experience;
// @author       HLA
// @match        http://www.360doc.com/content/*.shtml
// @license      MIT
// @grant        GM_addStyle
// @grant        unsafeWindow
// @compatiable  chrome; just test on chrome80+
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/432182/360doc_anti_anti-copy_anti_anti-contextmenu.user.js
// @updateURL https://update.greasyfork.org/scripts/432182/360doc_anti_anti-copy_anti_anti-contextmenu.meta.js
// ==/UserScript==

(() => {
    "use strict";
    const css = `
    .a_left{
        padding-left: 140px !important;
    }
    #bgchange{
        width: 930px !important;
    }
    #artContent{
        text-align: justify !important;
        width: 920px !important;
        max-width: 930px !important;
        min-width: 920px !important;
    }
    #goTop2,
    .floatqrcode,
    #adarttopgoogle,
    .article_showall{
        display: none !important;
    }
    .articleMaxH .article_container{
        height: auto !important;
    }`;
    GM_addStyle(css);
    window.onload = () => {
        document.oncontextmenu = new Proxy(document.oncontextmenu, {
            apply(t, tg, args) {
                return null;
            },
        });
        unsafeWindow.CopyMainContentObj = new Proxy(
            unsafeWindow.CopyMainContentObj,
            {
                get() {
                    return true;
                },
            }
        );
        new MutationObserver((event) => {
            event.forEach((e) => {
                if (e.addedNodes.length === 1) {
                    let i = e.addedNodes[0];
                    const c = i.className;
                    let l = "";
                    if (
                        !(
                            (c &&
                                typeof c === "string" &&
                                c.includes("artfullscreen")) ||
                            ((l = i.localName) &&
                                l &&
                                typeof l === "string" &&
                                l.includes("artfullscreen"))
                        )
                    ) {
                        i.remove();
                        i = null;
                    }
                }
            });
        }).observe(document.body, { childList: true });
    };
})();
