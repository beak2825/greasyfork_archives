// ==UserScript==
// @name         futaba niconico link killer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ふたばでnicovideoを含むリンクを可能な限り解除します。
// @author       nanasi_thunder
// @match        *://*.2chan.net/*
// @match        *://*.2chan.net/*/*
// @match        *://*.2chan.net/*/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2chan.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450754/futaba%20niconico%20link%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/450754/futaba%20niconico%20link%20killer.meta.js
// ==/UserScript==

(function($){
//
    var elementNameExists = !!document.getElementsByName('cont')[0];
    let allLinks;
    if(elementNameExists){
        var iframeElem = document.getElementsByName('cont');
        var iframeDocument = iframeElem[0].contentDocument || iframeElem[0].contentWindow.document;
        allLinks = iframeDocument.getElementsByTagName('a');
    }else{
        allLinks = document.getElementsByTagName('a');
    }
    for (var line of allLinks){
        var href = line.href;
        if(href.match(/nicovideo/)){
            line.removeAttribute('href');
        }
    }
})();