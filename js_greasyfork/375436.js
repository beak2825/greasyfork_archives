// ==UserScript==
// @name         Bootleggers Script Injector
// @namespace    https://greasyfork.org/en
// @version      0.0.1
// @description  try to take over the world!
// @author       You
// @include      https://www.bootleggers.us/*
// @update       https://greasyfork.org/scripts/375436-bootleggers-script-injector/code/Bootleggers%20Script%20Injector.user.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375436/Bootleggers%20Script%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/375436/Bootleggers%20Script%20Injector.meta.js
// ==/UserScript==

$(document).ready(function() {
    var child = document.createElement("h1");
    child.innerText = $(".BL-player-dashboard")[0].querySelector("[data-username]").dataset.username;
    $(child).css({"margin": "auto", "margin-top": "15px"});
    $(child).insertBefore($(".top-links")[0]);
    var scriptsLI = document.createElement("li");
    scriptsLI.innerHTML = "<div class='page-icon scripts'><div></div></div><p>Scripts</p><a href='/home?s=1'></a>";
    $("div.category")[0].nextSibling.append(scriptsLI);
    $(".page-icon").css({"background-image": "url(https://i.imgur.com/941p1JS.png)"});
    $(".page-icon.scripts").css({"background-position": "-100% -400%"});
    window.addEventListener("keyup", function(e) {
        if (e.keyCode == 44) {
            alert("DON'T FORGET TO CROP THE SCRIPTS ACTION OUT");
        }
    });
});