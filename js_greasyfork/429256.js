// ==UserScript==
// @name         YummiPatch'er
// @namespace    https://yummyanime.com
// @version      0.2
// @description  Add new seria block on site, which allow you to watch all dub lines
// @author       DV
// @match        *://yummyanime.club/catalog/*
// @match        *://aniqit.com/serial/*
// @match        *://kodik.info/serial/*
// @icon         https://yummyanime.club/img/icon/yummy-32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429256/YummiPatch%27er.user.js
// @updateURL https://update.greasyfork.org/scripts/429256/YummiPatch%27er.meta.js
// ==/UserScript==

function DisplayChange(className, type) {
    var elements = document.getElementsByClassName(className);
    for(var i = 0, length = elements.length; i < length; i++) {
        elements[i].style.display = type;
    }
};

var website = window.location.href;

if (website.includes('yummyanime.club/catalog/')) {
    var meta = document.createElement('meta');
    meta.name = "referrer";
    meta.content = "no-referrer";
    document.getElementsByTagName('head')[0].appendChild(meta);

    let btn = document.createElement("button");
    btn.innerHTML = "DV";
    btn.style = 'cursor: pointer; display: inline-block; text-align: center; font-size: 16px; padding: 9px5px0; margin: 02px6px0; background: var(--main-button); color: var(--light-text); min-width: 41px; height: 41px; -webkit-transition: .3s; -o-transition: .3s; transition: .3s';

    var someElement = document.querySelector("#video > div.video-wrapper.video_updated.video_select > div:nth-child(2) > div:nth-child(1) > div.episodes-container > div.episodes.custom-scroll > div > div:nth-child(1)");
    var link = someElement.getAttribute('data-href'); // //aniqit.com/serial/35619/2422566b311747b9b05435fdc04cd527/720p?season=1&only_episode=true&episode=1
    link = link.split('?season')[0];

    btn.onclick = function () {
      window.location.href = link;
    };

    var episodes_container = document.querySelector("#video > div.video-wrapper.video_updated.video_select > div:nth-child(2) > div:nth-child(1) > div.episodes-container > div.episodes.custom-scroll > div");
    episodes_container.appendChild(btn);
};

if (website.includes('aniqit.com/serial/') || website.includes('kodik.info/serial/')) {
document.body.appendChild(iframe);
DisplayChange('promo-error','none');
DisplayChange('play_background','block');
DisplayChange('player_box','block');
DisplayChange('serial-panel','block');
DisplayChange('movie-panel','block');
DisplayChange('player-iframe','block');
};