// ==UserScript==
// @name          Rickroll on google
// @namespace     https://github.com/TheFantasticWarrior/GoogleRickRoll
// @description	  You thought it was google, but it was I Rick Astley
// @author        TFW
// @include       *.google.com*/*
// @run-at        document-start
// @version       69.420
// @downloadURL https://update.greasyfork.org/scripts/412654/Rickroll%20on%20google.user.js
// @updateURL https://update.greasyfork.org/scripts/412654/Rickroll%20on%20google.meta.js
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
