// ==UserScript==
// @name         Unhex NFT Twitter
// @namespace    https://twitter.com/mandogy1
// @version      0.1
// @description  Removes fuckin NFT Hexagon shit from Twitter
// @author       @Mandogy1
// @match        https://twitter.com/*
// @icon         https://www.svethardware.cz/cina-chce-dohlizet-na-metaverse-a-nft/56550/img/nft-zakaz.png
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/438989/Unhex%20NFT%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/438989/Unhex%20NFT%20Twitter.meta.js
// ==/UserScript==
(function() {
    function fuck_off() {
        var fuckers = document.getElementsByClassName("css-1dbjc4n r-kemksi r-1wyvozj r-633pao r-u8s1d r-1v2oles r-desppf");
        var fuckers2 = document.getElementsByClassName("css-1dbjc4n r-1wyvozj r-633pao r-u8s1d r-1v2oles r-desppf");
        var fuckers3 = document.getElementsByClassName("css-1dbjc4n r-ggadg3 r-u8s1d r-8jfcpp");
        var fuckers4 = document.getElementsByClassName("css-1dbjc4n r-1wyvozj r-u8s1d r-1v2oles r-desppf");
        var fuckers5 = document.getElementsByClassName("css-1dbjc4n r-sdzlij r-ggadg3 r-1udh08x r-u8s1d r-8jfcpp");

        function now(f) {
            for (var i = 0; i < f.length; i++) {
                if (f[i].getAttribute("style") != null) {
                    if ((String(f[i].attributes.style.value).includes("hex")) == true) {
                        f[i].setAttribute("style", "clip-path: circle(50% at 50% 50%); height: calc(100%); width: calc(100%);");
                    }
                }
            }
        }
        now(fuckers);
        now(fuckers2);
        now(fuckers3);
        now(fuckers4);
        now(fuckers5);
        setTimeout(fuck_off, 1000);
    }
    fuck_off();
})();