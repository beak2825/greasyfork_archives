// ==UserScript==
// @name          Internet gets better: Cool stuff
// @description	  You get free adblocker, permanent safesearch and custom backrounds. AND: it works on multiple websites.
// @author        iloverats1234
// @version       2.5
// @include       *.google.com*/*
// @include       *.friv.com*/*
// @include       *.amazon.ca*/*
// @include       *.ask.com*/*
// @include       *.youtube.com*/*
// @include       *.twitter.com*/*
// @include       *.facebook.com*/*
// @include       *.instagram.com*/*
// @include       *.reflexmath.com*/*
// @include       *.greasyfork.org*/*
// @include       *.crazygames.com*/*
// @include       *.duckduckgo.com*/*
// @include       *.scholar.google.ca*/*
// @include       *.shellshock.io*/*
// @include       *.krunker.io*/*
// @include       *.https://apps.explorelearning.com/account/reflex/login/student?_ga=2.175240618.989040113.1674566353-2132360300.1674566352*/*
// @run-at        document-start
// @license MIT
// @namespace https://greasyfork.org/users/998067
// @downloadURL https://update.greasyfork.org/scripts/456617/Internet%20gets%20better%3A%20Cool%20stuff.user.js
// @updateURL https://update.greasyfork.org/scripts/456617/Internet%20gets%20better%3A%20Cool%20stuff.meta.js
// ==/UserScript==
(function() {
    var css = "";
    css += [
        "body{",
        "    background: transparent url(https://i.pinimg.com/originals/88/82/bc/8882bcf327896ab79fb97e85ae63a002.gif) center center  fixed !important;",
        "    background-size: cover !important;",
        "    background-repeat: no-repeat !important;",
        "}",
        "div.g{",
        "    background: rgba(237,237,248, 0.7) !important;",
        "}",
        "",
        "#appbar{",
        "    background:transparent!important;",
        "}",
        "",
        "g-inner-card{",
        "    background: rgba(237,237,248, 0.7) !important;",
        "}",
        "#hdtb {",
        "    background: transparent !important;",
        "}",
        "",
        ".sfbg, .kp-blk{",
        "    background: transparent !important;",
        "}",
        "",
        "#hdtbSum{",
        "    background: transparent !important;",
        "}",
    ].join("\n");
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            document.documentElement.appendChild(node);
        }
    }
    //var rick =document.createElement("div");
    //rick.style="top:100;right:50%;z-index:420;position:absolute;";
    var audio = new Audio("https://www.myinstants.com/media/sounds/epic_0s1iP1t.mp3");
    audio.loop=true;
    //var sound=document.createElement("button");
    //sound.innerHTML="Sound On";
    //sound.onclick=function(){audio.play();console.log("rolled")};
    //rick.appendChild(sound);
    //document.body.appendChild(rick);
    audio.play();
})();