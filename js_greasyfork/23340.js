// ==UserScript==
// @name         Greasyfork install button on search
// @namespace    Danielv123
// @version      1.2
// @description  Adds install buttons to all the search result pages, nice for mass installing
// @author       You
// @match        https://greasyfork.org/*
// @match        https://sleazyfork.org/*
// @requires     jQuery
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23340/Greasyfork%20install%20button%20on%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/23340/Greasyfork%20install%20button%20on%20search.meta.js
// ==/UserScript==

// vanilla greasyfork
if(document.querySelector("#user-script-list")){
    for(i = 1; document.querySelector("#user-script-list").childNodes.length > i; i++) {
        (function(i){
            if(document.querySelector("#user-script-list > li:nth-child(" + i + ")>article>h2>a")) {
                console.log(document.querySelector("#user-script-list > li:nth-child(" + i + ")>article>h2>a"));
                $("<div>").load(document.querySelector("#user-script-list > li:nth-child(" + i + ")>article>h2>a").href+" #install-area", function() {
                    $("#user-script-list > li:nth-child(" + i + ")").append($(this).html());
                    console.log(i);
                });
            }
        })(i);
    }
}
if(document.querySelector("#browse-script-list")){
    for(i = 1; document.querySelector("#browse-script-list").childNodes.length > i; i++) {
        (function(i){
            if(document.querySelector("#browse-script-list > li:nth-child(" + i + ")>article>h2>a")) {
                console.log(document.querySelector("#browse-script-list > li:nth-child(" + i + ")>article>h2>a"));
                $("<div>").load(document.querySelector("#browse-script-list > li:nth-child(" + i + ")>article>h2>a").href+" #install-area", function() {
                    $("#browse-script-list > li:nth-child(" + i + ")").append($(this).html());
                    console.log(i);
                });
            }
        })(i);
    }
}

// compat with [TS] Citrus GFork
setTimeout(function(){
    if(document.querySelector("#script-table")){
        for(i = 0; document.querySelector("#script-table > tbody").childNodes.length > i; i++) {
            (function(i){
                if(document.querySelector("#script-table tr:nth-child("+i+") > td:nth-child(2) > div.thetitle > a")) {
                    console.log(document.querySelector("#script-table tr:nth-child("+i+") > td:nth-child(2) > div.thetitle > a"));
                    $("<div>").load(document.querySelector("#script-table tr:nth-child("+i+") > td:nth-child(2) > div.thetitle > a").href+" #install-area", function() {
                        $("#script-table tr:nth-child(" + i + ") div:nth-child(2)").append($(this).html());
                        console.log(i);
                    });
                }
            })(i);
        }
    }
}, 1000);