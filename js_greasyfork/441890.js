// ==UserScript==
// @name         XO Java
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  XO with additional PumoBlocker functionality
// @author       FizzKidd
// @match        https://autoadmit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autoadmit.com
// @run-at       document-start
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/441890/XO%20Java.user.js
// @updateURL https://update.greasyfork.org/scripts/441890/XO%20Java.meta.js
// ==/UserScript==

// removed // @grant        none

function addGlobalStyle(css) {
   var head, style;
   head = document.getElementsByTagName('head')[0];
   if (!head) { return; }
   style = document.createElement('style');
   style.type = 'text/css';
   style.innerHTML = css//.replace(/;/g, ' !important;');
   head.appendChild(style);
}

function buildFrontPage() {
    var boardlinks = document.getElementsByTagName('center')[2];
    boardlinks.innerHTML = `<a href="?forum_id=1">College</a>
    | <a href="?forum_id=2">Law</a>
    | <a href="?forum_id=3">Grad School</a>
    | <a href="?forum_id=4">Business</a>
    | <a href="?forum_id=6">SPH</a>
    | <a href="?forum_id=7">Cryptocurrency</a>
    | <a href="?forum_id=10">Hairlines</a>
    | <a href="?forum_id=12">IFNB</a>
    | <a href="?forum_id=15">Tennis</a>
    | <a href="?forum_id=18">Golf</a>
    | <a href="?forum_id=47">Guns</a>
    | <a href="?forum_id=1000000">Megathor</a>`
}


function buildOptions() {

    var left_options = document.getElementsByTagName('font');

    left_options[1].innerHTML += "<b>XO Java Settings</b> <br>";

    var jet_black_box = document.createElement("INPUT");
    jet_black_box.setAttribute("type", "checkbox");
    if (!localStorage.getItem("jetblack")) {
        jet_black_box.checked = false;
        localStorage.setItem("jetblack", "false");
    } else {
        if (localStorage.getItem("jetblack") == "true") {
            jet_black_box.checked = true;
        } else {
            jet_black_box.checked = false;
        };

    };
    jet_black_box.addEventListener("click", function(){ if (jet_black_box.checked) {localStorage.setItem("jetblack", "true"); } else {localStorage.setItem("jetblack", "false"); }; } );
    left_options[1].appendChild(jet_black_box);
    jet_black_box.insertAdjacentHTML('afterend', " JET BLACK Mode <br>");

    var pumoblocker_box = document.createElement("INPUT");
    pumoblocker_box.setAttribute("type", "checkbox");
    if (!localStorage.getItem("pumoblocker")) {
        pumoblocker_box.checked = false;
        localStorage.setItem("pumoblocker", "false");
    } else {
        if (localStorage.getItem("pumoblocker") == "true") {
            pumoblocker_box.checked = true;
        } else {
            pumoblocker_box.checked = false;
        };

    };
    pumoblocker_box.addEventListener("click", function(){ if (pumoblocker_box.checked) {localStorage.setItem("pumoblocker", "true"); } else {localStorage.setItem("pumoblocker", "false"); }; } );
    left_options[1].appendChild(pumoblocker_box);
    pumoblocker_box.insertAdjacentHTML('afterend', " PumoBlocker <br>");



    var blockedusers_textarea = document.createElement("TEXTAREA");
    blockedusers_textarea.setAttribute("rows", "3");
    blockedusers_textarea.setAttribute("cols", "25");
    if (!localStorage.getItem("sudos")) {
        localStorage.setItem("sudos", "");
    } else {
        blockedusers_textarea.value = localStorage.getItem("sudos");
    };
    left_options[1].appendChild(blockedusers_textarea);
    blockedusers_textarea.insertAdjacentHTML('beforebegin', "Blocked Sudos (one per line) <br>");

    var inputs = document.getElementsByTagName('input');

    // Add submission algo to "OK" button
    inputs[inputs.length - 3].addEventListener("click", function(){ localStorage.setItem("sudos", blockedusers_textarea.value); } );
}

function delPumo() {
    const author = /&nbsp;/;
    //const pumoAuthor = /&nbsp;[\\'",\.\:;]*[\\'",\.\:;]/;

    var sudos = "";
    if (localStorage.getItem("sudos") && (localStorage.getItem("sudos") != "")) {
        var sudo_array = localStorage.getItem("sudos").split(/[\r\n]+/);
        for (let i = 0; i < sudo_array.length; i++) {
            sudos += "|(" + sudo_array[i] + ")";
        };

    };

    const pumoAuthor = new RegExp("&nbsp;([\\'\",\.\:;]*[\\'\",\.\:;])" + sudos);
    var post = document.getElementsByTagName('p');

    const linkPumoAuthor = /Serif"\>[\\'",\.\:;]*[\\'",\.\:;]\<\/font\>/;
    const image = /\<img src\="blank/;
    var postLink = document.getElementsByTagName('tr');
    //alert("number of tr elements: " + postLink.length);


    // Clean up tree
    for (let i = 1; i < postLink.length; i++) {
        if (linkPumoAuthor.test(postLink[i].innerHTML)) {

            for (let j = i + 2; j < postLink.length; j++) {
                if (!image.test(postLink[j].innerHTML) || (image.test(postLink[i].innerHTML) && image.test(postLink[j].innerHTML) && (parseInt(postLink[j].getElementsByTagName('img')[0].getAttribute('width')) < parseInt(postLink[i].getElementsByTagName('img')[0].getAttribute('width'))))) {
                    break;
                };

                if (image.test(postLink[j].innerHTML) && (!image.test(postLink[i].innerHTML) || (parseInt(postLink[j].getElementsByTagName('img')[0].getAttribute('width')) > parseInt(postLink[i].getElementsByTagName('img')[0].getAttribute('width'))))) {
                    postLink[j].innerHTML = "";
                };

            };

            postLink[i].innerHTML = "";

        };
    };


    // Clean up posts
    for (let i = 0; i < post.length; i++) {
        if (pumoAuthor.test(post[i].innerHTML)) {

            for (let j = i + 1; j < post.length; j++) {
                if (author.test(post[j].innerHTML) && ((post[j].getElementsByTagName('td')[0].getAttribute('width') == null) || (parseInt(post[j].getElementsByTagName('td')[0].getAttribute('width')) < parseInt(post[i].getElementsByTagName('td')[0].getAttribute('width'))))) {
                   break;
                };

                if (author.test(post[j].innerHTML) && ((post[i].getElementsByTagName('td')[0].getAttribute('width') == null) || (parseInt(post[j].getElementsByTagName('td')[0].getAttribute('width')) > parseInt(post[i].getElementsByTagName('td')[0].getAttribute('width')) + 10))) {
                   post[j].innerHTML = "";
                };
            };

            post[i].innerHTML = "";

        };
    };
}

(function() {
    'use strict';
    if (localStorage.getItem("jetblack") == "true") {
        addGlobalStyle(`body {color: #ffffff; background-color: #121212; } a { color: #BB86FC; } a:visited {color: #03DAC6; } b { color: #ffffff; } font { color: #ffffff; } tr {color: #ffffff; background-color: #121212; } td {color: #ffffff; background-color: #121212; } img {filter: invert(92%); } `);
    };

    document.addEventListener('DOMContentLoaded', function(event) {

        const front_page = /https:\/\/autoadmit.com\/(main\.php)?(\?forum_id=[0-9]+)?(\&show=.*)?$/

        if (front_page.test(window.location.href)) {
            buildFrontPage();
        };

        if (window.location.href == "https://autoadmit.com/options.php") {
            buildOptions();
        };

        if (localStorage.getItem("pumoblocker") == "true") {
            delPumo();
        };
    })

})();