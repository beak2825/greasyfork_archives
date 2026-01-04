// ==UserScript==
// @name         Photobucket Fighter (get img)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Press 'c' and get img
// @author       You
// @include      http://photobucket.com/*
// @include      http://photobucket.com/gallery/user/*/media/*
// @include      https://photobucket.com/gallery/user/*/media/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371668/Photobucket%20Fighter%20%28get%20img%29.user.js
// @updateURL https://update.greasyfork.org/scripts/371668/Photobucket%20Fighter%20%28get%20img%29.meta.js
// ==/UserScript==

function getImage() {
    var elmt = document.getElementsByClassName("slick-active");
    var newURL = elmt[0].getElementsByTagName("img")[0].src;

    var new_elmt = document.createElement ('div');
    new_elmt.id = "img_cont";
    //new_elmt.style.backgroundColor = "red";
    new_elmt.style.position = "absolute";
    new_elmt.style.width = "100%";
    new_elmt.style.height = "100%";

    var new_img = document.createElement('img');
    new_img.src = newURL;
    new_elmt.appendChild(new_img);

    document.body.appendChild(new_elmt);
    document.getElementById('img_cont').scrollIntoView();
    //window.location.hash = '#img_cont';
    //window.location.href = newURL;
}
function getVideo() {
    var met = document.getElementsByTagName("META")[22];
    var newURL = met.content;
    window.location.href = newURL;
}

document.addEventListener('keydown', checkKey, false);
function checkKey(e)
{
    e=e||window.event;
    if(e.keyCode=='67')  // "c"
    {
        getImage();
    }
    else if(e.keyCode=='86')  // "v"
    {
        getVideo();
    }
}