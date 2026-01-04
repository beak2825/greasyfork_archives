// ==UserScript==
// @name         paper search
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  search paper in scihub
// @author       www
// @match        *://ieeexplore.ieee.org/document/*
// @match        *://ieeexplore.ieee.org/abstract/document/*
// @match        *://link.springer.com/article/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/373981/paper%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/373981/paper%20search.meta.js
// ==/UserScript==]]]

function go_scihub(){
    window.open("http://sci-hub.tw/" + window.location.href, "sci-hub");
}
function run () {
    
    var menu = $("<div>").text('scihub');;
    menu.attr("id", "scihub");
    menu.bind("click",go_scihub );

    $("body").append(menu);

    $("body").contextmenu(function(e) {
        $("#scihub").css("position", "fixed");
        $("#scihub").css("z-index", 0);
        $("#scihub").css("left", e.clientX);
        $("#scihub").css("top", e.clientY);

        e.preventDefault();
    });
}


run();