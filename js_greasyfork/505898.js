// ==UserScript==
// @name         Google Scholar DOI Extractor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Identify DOI from Google Scholar search result page and highlight it.
// @author       nodelore
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @match        https://scholar.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505898/Google%20Scholar%20DOI%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/505898/Google%20Scholar%20DOI%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const triggerNotification = (doi)=>{
        const notification = $(`<div>Copy ${doi} to clipboard</div>`);
        notification.css({
            position: "fixed",
            right: 0,
            "z-index": 100000000,
            top: "0",
            background: "#000",
            color: "#FFF",
            "box-shadow": "0 0 10px #000",
            "font-size": "18px",
            padding: "10px",
            "border-radius": "5px",
            "display": "none",
        });
        $("#gs_top").append(notification);
        notification.fadeIn(300);
        notification.click(() => {
            notification.remove();
        });
        setTimeout(() => {
            notification.fadeOut(1000);
        }, 500);
    }
    $("#gs_bdy_ccl a").each(function(){
        console.log($(this)[0])
        const href = $(this).attr("href");
        const match = href.match(/10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i);
        if(match){
            const doi = match[0].split(".pdf")[0];
            const doiItem = $(`<span style='color: red; cursor: pointer;'><br/>DOI: ${doi}</span>`);
            doiItem.click(function(){
                triggerNotification(doi);
                navigator.clipboard.writeText(doi);
            })
            $(this).after(doiItem);
        }
    })
})();