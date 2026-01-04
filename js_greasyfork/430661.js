// ==UserScript==
// @name         KAIST-BG
// @version      3.1
// @author       Aziz
// @description  Custom animated background for IAM2
// @match        https://iam2.kaist.ac.kr/*
// @namespace    https://greasyfork.org/users/803596
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/430661/KAIST-BG.user.js
// @updateURL https://update.greasyfork.org/scripts/430661/KAIST-BG.meta.js
// ==/UserScript==
"use strict";

GM_config.init(
{
    'id': 'settings',
    'title': 'KAIST Custom BG settings',
    'fields':
    {
        'bg-media-link':
        {
            'label': 'Background Media Link',
            'type': 'text',
            'default': 'https://iam2.kaist.ac.kr/static/img/bg.88859a1.png'
        },
        'bg-media-type':
        {
            'label': 'Background Media Type',
            'type': 'radio',
            'options': ['Image', 'Video'],
            'default': 'Image'
        },
        'logo-link':
        {
            'label': 'Logo Link',
            'type': 'text',
            'default': 'https://iam2.kaist.ac.kr/static/img/logo_login.d72fcf0.png'
        }
    },
    'events':
    {
        'save': function() { this.close(); handleBG(document.getElementById("custom-bg")); handleLogo(document.getElementById("custom-logo"));},
    },
    'css': `
        #settings .config_header {
            margin: 0.5em 0;
        }
        #settings_field_bg-media-link {
            width: calc(100% - 200px);
        }
        #settings_buttons_holder {
            text-align: left;
        }
        #settings_field_bg-media-type {
            display: inline;
        }
        #settings_field_logo-link {
            width: calc(100% - 122px);
        }
        `,
});

// Register settings in Tampermonkey menu
GM_registerMenuCommand("Settings", () => {GM_config.open();});

// Preload assets
let preload = document.createElement("link");
preload.rel = "preload";
preload.href = GM_config.get("bg-media-link");
preload.as = (GM_config.get("bg-media-type") == 'Video'? "video" : "image");
document.head.appendChild(preload);

// Update backgound
let handleBG = function(bg) {
    let media = document.createElement(GM_config.get("bg-media-type") == 'Video'? "video" : "img");
    media.autoplay = true;
    media.muted = true;
    media.loop = true;
    media.id = "custom-bg";
    media.src = GM_config.get("bg-media-link");
    media.style = "position: fixed; right: 0; bottom: 0; height: 100%; width: 100%; object-fit: cover; z-index: -1";
    bg.replaceWith(media);
}

// Update logo
let handleLogo = function(oldLogo) {
    let logo = document.createElement("img");
    logo.id = "custom-logo";
    logo.src = GM_config.get("logo-link");
    logo.style = "display: block; max-height: 90px; max-width: 460px; margin: 0 auto;";
    oldLogo.parentElement.style = "height: 90px;";
    oldLogo.replaceWith(logo);
}


let observer = new MutationObserver(function (mutations, me) {
    console.debug("Observed!");
    let bg = document.getElementsByClassName('bg')[0];
    if (bg) handleBG(bg);
    let logo = document.querySelector("header>h1");
});

observer.observe(document, {
    childList: true,
    subtree: true
});
