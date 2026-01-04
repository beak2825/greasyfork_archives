// ==UserScript==
// @name         Bing Redirect Remover
// @namespace    http://www.bing.com/
// @version      2024-03-26
// @description  Replace Bing's redirect and rebates links with normal links.
// @author       Rudy Raab
// @match        https://www.bing.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492274/Bing%20Redirect%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/492274/Bing%20Redirect%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fixRedirects() {
        let anchors = [...document.getElementsByTagName("a")];
        let broken = anchors.filter(a => a.href.indexOf("bing.com/") >= 0);
        for(let ab of broken) {
            let url = new URL(ab.href);
            if(url.pathname == "/rebates/welcome") {
                let redir = url.searchParams.get("url");
                if(redir) {
                    ab.href = decodeURIComponent(redir);
                }
            }
            else if(url.pathname == "/ck/a") {
                let redir = url.searchParams.get("u");
                if(redir) {
                    let u = redir.substr(2).replaceAll("-","+").replaceAll("_","/");
                    ab.href = atob(u);
                }
            }
        }
    }

    window.setTimeout(fixRedirects, 50);

})();