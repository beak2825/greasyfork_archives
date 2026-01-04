// ==UserScript==
// @name         Rscripts.net Night Theme
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  A vibrant look for the best Roblox Scripts page on the www.
// @author       You
// @match        https://rscripts.net/
// @icon         https://www.google.com/s2/favicons?domain=simply-how.com
// @grant       GM_setValue
// @grant       GM_getValue
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @match      *://*/*
// @downloadURL https://update.greasyfork.org/scripts/425048/Rscriptsnet%20Night%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/425048/Rscriptsnet%20Night%20Theme.meta.js
// ==/UserScript==
(function() {
    'use strict';

    if (GM_getValue("version", "") < "1.0.5") {
        GM_setValue("version", "1.0.5");
        alert("Have fun with my theme <3 - xyba");
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) {
            return;
        }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    var all = document.getElementsByClassName('bg-dark');
    for (var i = 0; i < all.length; i++) {
        all[i].style.setProperty("background-color", "#6700bc", "important");
    }

    var all2 = document.getElementsByClassName('btn-secondary:hover');
    for (var e = 0; e < all2.length; e++) {
        all[e].style.setProperty("background-color", "#1a0133", "important");
    }

    var all3 = document.getElementsByClassName('rounded-pill');
    for (var f = 0; f < all3.length; f++) {
        all3[f].style.setProperty("background-color", "rgb(113 13 233)", "important");
    }

    var all4 = document.getElementsByClassName('text-success  fad fa-code');
    for (var g = 0; g < all4.length; g++) {
        all4[g].style.setProperty("color", "#9119ff", "important");
    }

    var jll4 = document.getElementsByClassName('fad fa-eye');
    for (var j = 0; j < jll4.length; j++) {
        jll4[j].style.setProperty("color", "white", "important");
    }

    var oll4 = document.getElementsByClassName('card');
    for (var o = 0; o < oll4.length; o++) {
        oll4[o].style.setProperty("background-color", "black", "important");
    }

    //cards
    addGlobalStyle(".bar { background: #6200ff !important; } strong { color: #9a3eff !important; } .btn:hover { box-shadow: 1px 1px 14px 10px rgb(147 9 233 / 20%) !important; } .goldenadmin { color: #aa39ff !important; text-shadow: 0 0 0.9em #9521ff !important; } .btn { border: 1px solid rgb(128 0 255) !important; } .card { background-color: #000000 !important; } br { background-color: black !important; } center { border-radius: 20px;  background-color: #000000 !important; } .nav-link  active { color: white !important; } .fad { color: #892fff !important; } #header h2 span { border-bottom: 2px solid #740bff !important; } footer { background-color: #090909 !important; } .input-group-text { border: 1px solid #6b0ef1 !important; border-radius: 0px !important; background-color: rgb(25 0 46 / 100%) !important; } .fad.fa-search { color: white !important; } .form-control:focus { color: azure !important; background-color: #1c004d !important; border-color: #2e005f !important; box-shadow: 0 0 0 0.25rem rgb(66 4 255 / 55%) !important; } .form-control { color: #9140fc; background-color: rgb(64 4 169 / 20%); border: 1px solid #8c00ff; }  a.nav-link { color: white !important; } p#credits-theme { color: white; } a { color: #9828ff !important; } .card { box-shadow: 0px 0px 18px 0px rgb(124 70 255 / 41%) !important; } hr { color: #4a00ff; } .card-header { background-color: #7704ff !important; } .bg-dark { background-color: #8e3fff !important; } .card-title { color: #5e1bff; } .card-body { background-color: #080015; border-radius: 20px !important;} .card-body:hover { box-shadow: 0 30px 40px rgb(110 0 255 / 10%) !important; cursor: pointer; } .card { border-radius: 20px !important; } .section-title h2::after { background: #6200ff; }");
    //body-background
    addGlobalStyle(" body::before { background: #040404 url(https://i2.wp.com/windowscustomization.com/wp-content/uploads/2019/01/Purple-Landscape.gif?resize=600%2C354&quality=80&strip=all&ssl=1) top right no-repeat; background-size: cover; position: fixed; top: 0; right: 0; left: 0; height: 100vh; z-index: -1; }");
    //nav
    addGlobalStyle(".shadow { background-color: rgb(0 0 0 / 70%) !important; }");
    //btn
    addGlobalStyle(".btn-secondary { border-color: #5a07a5;     background-color: #000001 !important; } .btn-secondary:hover { border-color: #9f00ff !important; }  ");

    var old_url = "assets/img/rscriptsnet.png?v4"
    var new_url = "https://media4.giphy.com/media/cJA1kboljf8r40bof9/giphy.gif"
    $(document).ready(function() {
        $("img[src='" + old_url + "']").attr("src", new_url);
    });

    var ald_url = "assets/img/rscriptsnet.png?v5"
    var aew_url = "https://media4.giphy.com/media/cJA1kboljf8r40bof9/giphy.gif"
    $(document).ready(function() {
        $("img[src='" + ald_url + "']").attr("src", aew_url);
    });

    var fld_url = "/assets/img/speed.png?v3"
    var few_url = "https://i.imgur.com/r5MtBpc.png"
    $(document).ready(function() {
        $("img[src='" + fld_url + "']").attr("src", few_url);
    });

    var gld_url = "/assets/img/daily.png"
    var gew_url = "https://i.imgur.com/7a2TCgJ.png"
    $(document).ready(function() {
        $("img[src='" + gld_url + "']").attr("src", gew_url);
    });

    var hld_url = "/assets/img/protect.png"
    var hew_url = "https://i.imgur.com/a40RwCK.png"
    $(document).ready(function() {
        $("img[src='" + hld_url + "']").attr("src", hew_url);
    });

    var tld_url = "assets/img/nothing-found.png"
    var tew_url = "https://cdn140.picsart.com/236954747101212.png?type=webp&to=min&r=640"
    $(document).ready(function() {
        $("img[src='" + tld_url + "']").attr("src", tew_url);
    });

    var PTag = document.createElement('p');
    PTag.setAttribute("id", "credits-theme");
    PTag.setAttribute("style", "font-size: 1.4vh; position: absolute; padding-left: 190px; padding-top: 1.1vh;");
    PTag.innerHTML = "Night Theme by Xyba";
    $('.navbar-brand').prepend(PTag);
})();