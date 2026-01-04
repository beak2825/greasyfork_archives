// ==UserScript==
// @name                 AdBlock Userscript
// @version              0.0.2
// @author               karrdozo
// @match                http*://*/*
// @namespace            https://greasyfork.org/users/1115413
// @icon                 https://www.google.com/s2/favicons?sz=64&domain=getadblock.com
// @license              MIT
// @grant                GM_xmlhttpRequest
// @grant                GM_registerMenuCommand
// @grant                GM_getResourceText
// @grant                GM_addStyle
// @require              https://code.jquery.com/jquery-3.6.3.min.js
// @resource global.json https://raw.githubusercontent.com/matheuslive/js/main/filter/global.json
// @description          AdBlock, CSP and DOM element remover
// @downloadURL https://update.greasyfork.org/scripts/470111/AdBlock%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/470111/AdBlock%20Userscript.meta.js
// ==/UserScript==

/* eslint-env jquery */

const cspRule = localStorage.getItem("CSPBlocker");
const cssRule = GM_getResourceText("global.json");

// Append CSP meta
if (cspRule && cspRule != "disable") {
    const meta = document.createElement("meta");
    meta.setAttribute("http-equiv", "Content-Security-Policy");
    meta.setAttribute("content", cspRule);
    try {
        document.head.append(meta);
    } catch {
        setTimeout(() => {
            document.head.append(meta);
        }, 0);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    function GM_addStyle(css) {
        const style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.textContent = css;
        document.head.appendChild(style);
    }

    let cssRuleobj = JSON.parse(cssRule)[window.location.hostname];
    if (cssRuleobj != null) {
        filter = JSON.parse(filter)
            .filter((item) => item.trim() != "")
            .join(", ");
        try {
            GM_addStyle(filter + " {display: none !important;}");
        } finally {
            window.addEventListener("load", () => {
                document.querySelectorAll(filter).forEach((node) => {
                    node.hidden = true;
                    node.style.display = "none";
                });
            });
        }
    }

    document
        .querySelectorAll("amp-ad,amp-embed,amp-sticky-ad")
        .forEach((node) => node.remove());
});

GM_registerMenuCommand("No JavaScript", () => { localStorage.setItem("CSPBlocker", "script-src 'none'") });
GM_registerMenuCommand("No Third-Party", () => { localStorage.setItem("CSPBlocker", "default-src 'unsafe-inline' 'self'") });
GM_registerMenuCommand("Restrict js-elem", () => { localStorage.setItem("CSPBlocker", "script-src-elem 'self'") });
GM_registerMenuCommand("Edit CSP rules", () => {
    var currentRule = localStorage.getItem("CSPBlocker");
    if (currentRule == "disable") { currentRule = null }
    const newrule = prompt("Editing CSP rules", currentRule || "");
    if (newrule && newrule != "") {
        localStorage.setItem("CSPBlocker", newrule)
    }
});
GM_registerMenuCommand("Clear CSP rules", () => { localStorage.setItem("CSPBlocker", "disable") });
//GM_registerMenuCommand("Reload Page", () => { location.reload() });
