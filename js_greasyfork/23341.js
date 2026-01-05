// ==UserScript==
// @name         TuChongTools
// @namespace    http://kirinrin.me/
// @version      0.2
// @description  Download Image in TuChong
// @author       Kirinrin
// @match        https://*.tuchong.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23341/TuChongTools.user.js
// @updateURL https://update.greasyfork.org/scripts/23341/TuChongTools.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var imgDiv = $(".post-scene.photo-wrapper.current-scene img[data-src]");
    var src = imgDiv.attr("src").replace(/webp/,"jpg");
    var name = imgDiv.attr("data-image-id");
    var sharePanel = $(".share-nav.inner.share-info");
    var downloadButton = $("<a>下载图片</a>").attr("href", src).attr("download", name+".png").attr("id","downloadButton").appendTo(sharePanel);
    var recentHash = window.location.hash;
    setInterval(function(recentHash,downloadButton){
    console.log("hash="+window.location.hash +" recentHash="+recentHash);
    if(recentHash!=window.location.hash){
        console.log('update');
        var imgDiv = $(".post-scene.photo-wrapper.current-scene img[data-src]");
        var src = imgDiv.attr("src").replace(/webp/,"jpg");
        var name = imgDiv.attr("data-image-id");
        $("#downloadButton").attr("href",src);
        recentHash = window.location.hash;
    }
    }, 1000);
})();
