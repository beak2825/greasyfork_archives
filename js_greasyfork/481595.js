// ==UserScript==
// @name         WarcraftLogs移除广告
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  WarcraftLogs 站点移除广告
// @author       denisding
// @icon    data:image/png;base64,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
// @match        https://*.warcraftlogs.com/**
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481595/WarcraftLogs%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/481595/WarcraftLogs%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var loadingContainer = $("<div></div>").css({
        "position": "fixed",
        "top": "0",
        "left": "0",
        "width": "100%",
        "height": "100%",
        "background-color": "rgba(255, 255, 255, 0.8)",
        "display": "flex",
        "justify-content": "center",
        "align-items": "center",
        "z-index": "99999"
      }).appendTo("body");
    var loadingIcon = $("<div></div>").css({
        "border": "8px solid #f3f3f3",
        "border-top": "8px solid #3498db",
        "border-radius": "50%",
        "width": "50px",
        "height": "50px",
        "animation": "spin 2s linear infinite"
      }).appendTo(loadingContainer);
    var style = $("<style></style>").text("@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }").appendTo("head");
    var style1 = $("<style></style>").text(".adsbygoogle { display: none !important; }").appendTo("head");

    $(document).ready(function() {
        $("#top-banner").remove();
        $("#google-center-div").remove();
        $("#right-ad-box").remove();
        $("#bottom-banner").remove();
        $('.adsbygoogle').remove();
        let wrappers = $('#iframe-guide-wrapper');
        if (wrappers.length > 0) {
            //wrappers[0].style.maxWidth = "1200px";
            wrappers[0].style.margin = "0 100px";
        }
        loadingContainer.fadeOut("slow");
    });
})();