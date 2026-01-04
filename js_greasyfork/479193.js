// ==UserScript==
// @name         Inspect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Inspects a website.
// @author       cool
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479193/Inspect.user.js
// @updateURL https://update.greasyfork.org/scripts/479193/Inspect.meta.js
// ==/UserScript==

(function(w) {
    'use strict';
    var link = document.createElement("link");
    link.id = "inspect-hljs-css";
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css";
    link.media = "all";
    document.getElementsByTagName("head")[0].appendChild(link);
    var bi = false;
    var ib = document.createElement("button");
    ib.setAttribute("style", "width: 80px !important; height: 40px !important; padding: 0px !important; margin: 0px !important; font-size: 14px !important; background-color: dodgerblue !important; color: white !important; border: none !important; border-radius: 5px 0px 5px 0px !important; position: fixed !important; right: 0px !important; bottom: 0px !important; z-index: 99999999 !important; cursor: pointer !important; font-family: Arial !important;");
    ib.innerHTML = "Inspect";
    document.body.appendChild(ib);
    var c = document.createElement("div");
    c.hidden = true;
    c.setAttribute("style", "width: 100% !important; height: 100% !important; padding: 0px !important; margin: 0px !important; font-size: 14px !important; background-color: lightgray !important; color: black !important; border: none !important; border-radius: 0px !important; position: fixed !important; left: 0px !important; top: 0px !important; z-index: 99999998 !important; cursor: auto !important; font-family: courier !important; user-select: text !important; overflow: auto;");
    document.body.appendChild(c);
    var co = document.createElement("button");
    co.setAttribute("style", "width: 80px !important; height: 20px !important; padding: 0px !important; margin: 0px !important; font-size: 12px !important; background-color: gray !important; color: white !important; border: none !important; border-radius: 0px 5px 0px 5px !important; position: fixed !important; right: 0px !important; top: 0px !important; z-index: 99999999 !important; cursor: pointer !important; font-family: Arial !important;");
    co.hidden = true;
    co.innerHTML = "Copy";
    document.body.appendChild(co);
    var pre = document.createElement("pre");
    var code = document.createElement("code");
    code.class = "language-html";
    pre.appendChild(code);
    c.appendChild(pre);
    var p = "";
    ib.addEventListener("click", function() {
        if (bi) {
        bi = false;
            ib.innerHTML = "Inspect";
            c.hidden = true;
            co.hidden = true;
        } else {
            bi = true;
            ib.innerHTML = "Close";
            c.hidden = false;
            co.hidden = false;
        }
    });
    co.addEventListener("click", function() {
        navigator.clipboard.writeText(code.textContent).then(() => {
          co.textContent = "Copied!";
            setTimeout(function() {
              co.textContent = "Copy";
            }, 2000);
        }).catch(() => {
          co.textContent = "Failed to copy!";
            setTimeout(function() {
              co.textContent = "Copy";
            }, 2000);
        });
    });
   setInterval(function() {
       if (document.documentElement.outerHTML != p) {
       code.textContent = document.documentElement.outerHTML;
           hljs.highlightAll();
       }
       p = document.documentElement.outerHTML;
   }, 250);
})(window);