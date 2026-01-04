// ==UserScript==
// @name         Lible
// @name:zh-CN   Lible
// @namespace    Lible
// @version      0.2
// @description  Make library lible.
// @description:zh-CN Make library lible.
// @author       LSP
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js

// @match        https://www.javlibrary.com/cn/*
// @match        https://www.javlibrary.com/en/*
// @match        https://www.javlibrary.com/ja/*

// @match        http://www.javlibrary.com/cn/*
// @match        http://www.javlibrary.com/en/*
// @match        http://www.javlibrary.com/ja/*

// @exclude      */vl_newentries.php
// @exclude      */vl_bestrated.php
// @exclude      */vl_update.php
// @exclude      */vl_mostwanted.php
// @exclude      */search.php
// @exclude      */genres.php
// @exclude      */star_mostfav.php
// @exclude      */star_mostfav.php
// @exclude      */star_list.php*
// @exclude      */tl_bestreviews.php
// @exclude      */publicgroups.php

// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_log(message)
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/422909/Lible.user.js
// @updateURL https://update.greasyfork.org/scripts/422909/Lible.meta.js
// ==/UserScript==

(function() {
    // Your code here...
    'use strict';

    var jav_sites = {
        jable: {
            favicon : "https://assetscdn.jable.tv/assets/icon/favicon-32x32.png"
        },
        avgle: {
            favicon : "https://avgle.com/templates/frontend/bright-blue/img/webapp-icon.png"
        },
        javmost: {
            favicon : "https://nonecss.com/icon/favicon-32x32.png"
        },
        solidtorrents: {
            favicon : "https://solidtorrents.net/favicon.png"
        }
    };

    var lible_CSS = "display: inline-block; float: left; vertical-align: middle; margin-left: 5px; margin-right: 5px";

    var video_id = document.querySelector('#video_id').querySelector("td.text");
    var topbanner = document.querySelector('div.topbanner1');

    var ad = document.querySelector('div.topbanner1').querySelector('iframe');
    if(ad != null){
        ad.parentNode.removeChild(ad);
    }

    jav_sites.jable.link = 'https://jable.tv/videos/' + video_id.innerText + '/';
    jav_sites.avgle.link = 'https://avgle.com/search/videos?search_query=' + video_id.innerText;
    jav_sites.javmost.link = 'https://www5.javmost.com/'+ video_id.innerText + '/';
    jav_sites.solidtorrents.link = 'https://solidtorrents.net/search?q=' + video_id.innerText;

    // $('div#video_id').find("td.text").wrap("<a href='%LINK%'></a>".replace(/%LINK%/, jable_link));
    video_id.innerHTML = "<a href='" + jav_sites.jable.link + "'>" + video_id.innerText + "</a>";


    var banner_div = document.createElement('div');
    banner_div.style.cssText = "float: right";
    for (var key in jav_sites) {
        var div = document.createElement('div');
        div.className = 'lible';
        div.style.cssText = lible_CSS;

        var a = document.createElement('a');
        a.href = jav_sites[key].link;

        var img = document.createElement('img');
        img.src = jav_sites[key].favicon;
        img.width = 32;
        img.height = 32;

        a.appendChild(img);
        div.appendChild(a);
        banner_div.appendChild(div);
    }

    topbanner.appendChild(banner_div);

    // document.getElementsByClassName('lible').style.cssText = 

})();