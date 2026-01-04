// ==UserScript==
// @name        5ch_mp4_embed
// @namespace   https://catherine.v0cyc1pp.com/5ch_mp4_embed.user.js
// @match       http://*.5ch.net/*
// @match       https://*.5ch.net/*
// @match       http://*.bbspink.com/*
// @match       https://*.bbspink.com/*
// @author      greg10
// @run-at      document-end
// @license     GPL 3.0
// @version     0.6
// @grant       none
// @description ５ちゃんねるのmp4を埋め込み表示する。
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/380571/5ch_mp4_embed.user.js
// @updateURL https://update.greasyfork.org/scripts/380571/5ch_mp4_embed.meta.js
// ==/UserScript==

console.log("5ch_mp4_embed start");



/*
https://video.twimg.com/ext_tw_video/1107735543935201280/pu/vid/1280x720/L0vEXzEaCuZVtP5s.mp4
*/

function main() {
    document.querySelectorAll("a").forEach(function(elem) {
        var thiselem = elem;

        var str = elem.innerText;

        if (elem.getAttribute("flag5ch_mp4_embed") == "done") {
            return;
        }
        elem.setAttribute("flag5ch_mp4_embed", "done");


        //console.log("str="+str);
        //var result = str.match(/(\/\/.*(.mp4|.mp4\?_nc_ht=scontent-nrt1-1.cdninstagram.com))$/i);
        var result = str.match(/(https?:\/\/.*(.mp4))/i);
        if (result == null) {
            return;
        }
        console.log("mp4 matched, str=" + str);

        var url = "";
        if ( str.match( /insta/ ) ) {
            url = str;
        } else {
            url = result[1];
        }
        console.log("url="+url);

        var link2img = document.createElement("a");
        //link2img.href = str;
        link2img.href = str;
        link2img.target = "_blank";
        link2img.flag5ch_mp4_embed = "done";
        var elem_p = document.createElement("p");
        var video = document.createElement("video");
        //video.src = str;
        video.src = url;
        video.border = "1px";
        video.width = "300";
        video.type = "video/mp4";
        video.controls = true;

        thiselem.parentNode.insertBefore(elem_p, thiselem.nextElementSibling);
        elem_p.parentNode.insertBefore(link2img, elem_p.nextElementSibling);
        //link2img.appendChild(video);
        link2img.parentNode.insertBefore(video, link2img.nextElementSibling);

    });
}

main();

var observer = new MutationObserver(function(mutations) {
    observer.disconnect();
    main();
    observer.observe(document, config);
});

var config = {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true
};

observer.observe(document, config);