// ==UserScript==
// @name         Youtube clear
// @version      0.2
// @description  Disables video recommendations on the front page and video viewing pages of youtube.
// @author       You
// @include http://youtube.com/*
// @include http://www.youtube.com/*
// @include https://youtube.com/*
// @include https://www.youtube.com/*
// @namespace https://greasyfork.org/users/12940
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10752/Youtube%20clear.user.js
// @updateURL https://update.greasyfork.org/scripts/10752/Youtube%20clear.meta.js
// ==/UserScript==

window.setInterval(function(){
    erase();
}, 500);

function erase(){

    var query = getQueryParams(document.location.search);

    if(query.list == null){
        var menus = document.getElementsByClassName("branded-page-v2-container branded-page-base-bold-titles branded-page-v2-container-flex-width branded-page-v2-secondary-column-hidden");
        for (var i = menus.length - 1; i >= 0; i--)
        {
            menus[i].style.display = "none";
        }
    }

    if(query.watch == null){
        var sidebar = document.getElementsByClassName("watch-sidebar-section");
        for (var i = sidebar.length - 1; i >= 0; i--)
        {
            sidebar[i].style.display = "none";
        }
    }
}

erase();

function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    console.log(params);
    return params;
}