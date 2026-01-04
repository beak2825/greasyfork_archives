// ==UserScript==
// @name         DeviantArt NSFW Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Toggle between NSFW, SFW or all posts on DA galleries and pages.
// @author       You
// @match        https://www.deviantart.com/*/favourites/*
// @match https://www.deviantart.com
// @match https://www.deviantart.com/*/gallery/*
// @match https://www.deviantart.com/*/?q=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382392/DeviantArt%20NSFW%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/382392/DeviantArt%20NSFW%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var newstyle = document.createElement("style");
    newstyle.setAttribute("type","text/css");
    newstyle.setAttribute("id","nsfwfilter");
    newstyle.innerHTML = ".ad-container{display:none !important;}";
    document.body.appendChild(newstyle);

    var button = document.createElement("td");
    button.setAttribute("style","padding-right:10px;")
    button.setAttribute("id","nsfwbutton")
    button.innerHTML= "NSFW: ALL"
    document.querySelector("#overhead > tbody > tr").insertBefore(button,document.querySelector("#oh-menu-deviant"))

    function nsfwonly(){
        document.querySelector("#nsfwfilter").innerHTML = ".thumb:not(.ismature), .ad-container{display:none !important;}";
        document.querySelector("#nsfwbutton").innerHTML = "NSFW: ON";
    }
    function sfwonly(){
        document.querySelector("#nsfwfilter").innerHTML = ".ismature, .ad-container{display:none !important;}";
        document.querySelector("#nsfwbutton").innerHTML = "NSFW: OFF";
    }
    function allposts(){
        document.querySelector("#nsfwfilter").innerHTML = ".ad-container{display:none !important;}";
        document.querySelector("#nsfwbutton").innerHTML = "NSFW: ALL";
    }

    document.querySelector("#nsfwbutton").onclick = function toggleNSFW(){
        var state = document.querySelector("#nsfwfilter").textContent;
        switch(state){
            case ".thumb:not(.ismature), .ad-container{display:none !important;}":
                sfwonly();
                break;
            case ".ismature, .ad-container{display:none !important;}":
                allposts();
                break;
            case ".ad-container{display:none !important;}":
                nsfwonly();
                break;
        }
    }
})();