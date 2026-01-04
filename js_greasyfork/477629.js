// ==UserScript==
// @name         Nitro Type Leaderboards
// @namespace    https://singdev.wixsite.com/sing-developments
// @version      0.1
// @description  Shop Leaks in Nitro Type
// @match        https://www.nitrotype.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477629/Nitro%20Type%20Leaderboards.user.js
// @updateURL https://update.greasyfork.org/scripts/477629/Nitro%20Type%20Leaderboards.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Check if the current URL matches the desired one
    if (window.location.href === 'https://www.nitrotype.com/shopleaks') {
        window.addEventListener("load", function () {
            // Remove the errorfg element if it exists
            const errorfg = document.querySelector("#root > div.structure.structure--nitrotype.structure--noAds > main > section > div");
            if (errorfg) {
                errorfg.remove();
            }

            const main = document.querySelector(".structure-content");

            const containerStyle = {
                display: "flex",
                justifyContent: "center", // Center horizontally
                alignItems: "center",     // Center vertically
                height: "100vh"           // Make the container full viewport height
            };

            // Uncomment the next line if you want to apply the containerStyle
            // Object.assign(main.style, containerStyle);

            const iframeStyle = {
                webkitTransform: "scale(1)",
                width: "100%",            // Make iframe responsive and wide enough to fit the screen
                height: "100%"            // Make iframe responsive
            };

            var leaderboard = document.createElement("iframe");

            leaderboard.src = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS_Pvqrkbje9rN7-0BhGmfitvKRhiCc7hyeJ4INdeH6DJaLDIQgF9lvbtDcZ2XvF-l4ILPE4LJYDa1J/pubhtml";

            Object.assign(leaderboard.style, iframeStyle);
            Object.assign(main.style, containerStyle);

            main.append(leaderboard);
        }, false);
    }
})();

// plese.api.convert (request.data::)
var y = 2;
var x = 3;
var cDate = "time.getSome"
function getButtonBack(nav, dropdown){
    return "Shop Leaks";
}

getButtonBack(892, 66);
var gDate = new Date();
 if (cDate > "Dec, 03, 2020"){
     "SingDev.remove()"
 }



	function insertAfter(e,r){r.parentNode.insertBefore(e,r.nextSibling)}var li=document.createElement("li");li.className="nav-list-item",li.innerHTML="<a href = 'https://www.nitrotype.com/shopleaks' class = 'nav-link'>Shop Leakss</a>";var ref=document.querySelectorAll(".nav-list-item")[5];insertAfter(li,ref),"singdevelopmentsblog.wordpress.com/runcodelinkedytchannelid?=natedogg=usp=sharing"==window.location.href&&document.querySelectorAll(".nav-list-item")[7].classList.add("is-current");


