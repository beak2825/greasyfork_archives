// ==UserScript==
// @name                 Bilibili BV to av
// @name:zh-CN           Bilibili BV转AV
// @author               net2cn
// @description          Convert Bilibili's video BV id back to av id seamlessly.
// @description:zh-CN    无缝地将Bilibili的BV号转为av号
// @description:es       ???
// @namespace            https://github.com/net2cn
// @license              MIT License
// @version              0.0.2
// @include              /^https?:\/\/www\.bilibili\.com\/video\/[BbVv]+/
// @mainpage             https://github.com/net2cn/Bilibili_BV_to_av
// @grant                none
// @downloadURL https://update.greasyfork.org/scripts/437434/Bilibili%20BV%20to%20av.user.js
// @updateURL https://update.greasyfork.org/scripts/437434/Bilibili%20BV%20to%20av.meta.js
// ==/UserScript==

function convert(){
    if(window.aid!=undefined) {
        // Use regex to match BV id and replace it with the av id. bv is not case sensitive
        let av_url = window.location.href.replace(/\/BV(.*)(?=\/)|\/BV(.*)(?=\?)|\/BV(.*)(?=$)/i, "/av"+window.aid)
        history.replaceState(null, null, av_url)
    }else {
        console.log("Unable to find aid for replacement.")
    }
}

(function() {
    'use strict';
    // Add listener to observe if url has changed.
    let previousUrl = "";
    const observer = new MutationObserver(function(mutations) {
        if (location.href !== previousUrl) {
            previousUrl = location.href
            convert()
        }
    });
    const config = {subtree: true, childList: true};
    observer.observe(document, config);

    // Initial convert.
    convert()
})();