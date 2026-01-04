// ==UserScript==
// @name         Dropbooks Extension
// @namespace    https://greasyfork.org/ja/users/2332-deadman-from-sora
// @version      0.1.6
// @description  Extension for dlbooks.to
// @author       deademan-from-sora
// @license      MIT
// @homepageURL  https://greasyfork.org/ja/scripts/34129-dropbooks-extension
// @supportURL   https://greasyfork.org/ja/scripts/34129-dropbooks-extension/feedback
// @match        *://dlbooks.to/
// @match        *://dlbooks.to/search*
// @match        *://dlbooks.to/tops/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/34129/Dropbooks%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/34129/Dropbooks%20Extension.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const DL_LINK = "http://dlbooks.to/detail/download_zip/";
    const CSS = ".direct_download {display: block; border: 1px solid rgb(0, 0, 0); height: 28px; width: 28px; " +
          "background-color: rgb(255, 255, 255); text-align: center; position: absolute; z-index: 110;	top: 171px;	left: 90px;}";
    GM_addStyle(CSS);

    let bookElements = Array.from(document.getElementsByClassName("list"));
    let icon, refNode;

    let addDirectDownloadLink = function(elem) {
        let icon = document.createElement("i");
        let link = document.createElement("a");

        icon.setAttribute("class", "fa fa-download fa-2x");
        icon.setAttribute("style", "padding-top: 3px; padding-left: 1px;");

        link.setAttribute("class", "direct_download");
        link.setAttribute("href",  DL_LINK + elem.id);
        link.setAttribute("title", "Download");

        link.appendChild(icon);
        return link;
    };

    (function () { /* fix protocol-relative URL*/
        const pat = /^http:(\/\/.+\/font\-awesome\/[0-9\.]+\/css\/font\-awesome\.css)$/;
        let links = Array.from(document.head.getElementsByTagName("link"));
        for (let link of links) {
            let match = link.href.match(pat);
            if (match !== null) {
                link.href = match[1];
            }
        }
    })();

    for (let elem of bookElements) {
        icon = addDirectDownloadLink(elem);
        refNode = Array.from(elem.getElementsByClassName("bookplus"))[0];
        elem.insertBefore(icon, refNode);
    }
})();