// ==UserScript==
// @name         editorify
// @namespace    http://twitter.com/cvsilly_
// @version      v1.1
// @description  you just lost the game
// @author       cv
// @match        *://x.com/*
// @match        *://twitter.com/*
// @icon         https://files.catbox.moe/2s6rw9.png
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/506298/editorify.user.js
// @updateURL https://update.greasyfork.org/scripts/506298/editorify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const loadwait = setInterval(() => {
        const element = document.querySelector('div.r-u8s1d.r-zchlnj.r-ipm5af[aria-label="Opens profile photo"]');
        if (element) {
            loadstuff();
            clearInterval(loadwait);
        }
    }, 100);
    function loadstuff() {
        const logo = document.querySelector('aside.css-175oi2r[aria-label="Who to follow"]');
        const thefunny = document.createElement('audio');

        const savepfp = document.querySelector('img[alt="Opens profile photo"]').src;
        var replacepfp = document.querySelector('div.r-u8s1d.r-zchlnj.r-ipm5af[aria-label="Opens profile photo"]');

        logo.innerHTML = `<div class="css-175oi2r r-1wtj0ep r-1mmae3n r-3pj75a r-1ny4l3l">
<h2 aria-level="1" role="heading" class="css-175oi2r r-18u37iz r-7cikom">
<div dir="ltr" class="css-146c3p1 r-8akbws r-krxsd3 r-dnmrzs r-1udh08x r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-adyw6z r-135wba7 r-1vr29t4 r-1kihuf0" style="-webkit-line-clamp: 3; text-overflow: unset; color: rgb(231, 233, 234);"><span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3" id="liketitle" style="text-overflow: unset;">You might like</span></div>
<div class="css-175oi2r r-1kihuf0 r-18u37iz r-16y2uox r-17s6mgv r-1ez5h0i"></div></h2></div>
<a href="https://adriandrummis.github.io/CutTheRopeEditor" target=”_blank”>
<img src="https://pbs.twimg.com/media/G2VIGScWgAAIba6?format=png&name=small" style="width:100%; height:100%; object-fit: cover; position:relative; top:-20%; z-index:1">
</a>`;

        thefunny.innerHTML = `<source src="https://video.twimg.com/amplify_video/1974062702856159232/vid/avc1/640x360/moHuXq6JKllYXX8n.mp4?tag=14" style="display:none" type="audio/mp4">`;
        console.log(logo); console.log(thefunny);
        console.log("[!] if either of these is set to null then your twitter is broken..");

        logo.addEventListener('mouseenter', () => {thefunny.play();
                                                   document.getElementById("liketitle").textContent = "You will like";
                                                   replacepfp.innerHTML = `<video autoplay loop muted class="css-175oi2r r-1niwhzg r-vvn4in r-u6sd8q r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw r-4gszlv"><source src="https://video.twimg.com/tweet_video/G2VHh3sWIAAGg_T.mp4" style="border-radius:10px;"></video>`});
        logo.addEventListener('mouseleave', () => {thefunny.pause();
                                                   document.getElementById("liketitle").textContent = "You might like";
                                                   replacepfp.innerHTML = `<div class="css-175oi2r r-1niwhzg r-vvn4in r-u6sd8q r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw r-4gszlv" style="background-image: url(&quot;` + savepfp +`&quot;);"></div>`});
}})();