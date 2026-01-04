// ==UserScript==
// @name         Google Logo Replacer
// @namespace    https://greasyfork.org/en/users/86284-benjababe
// @version      1.02
// @description  Replaces google logo on search and image page
// @author       Benjababe
// @license      MIT

// @match        https://*.google.com/*
// @match        https://*.google.com/sg/*

// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/430850/Google%20Logo%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/430850/Google%20Logo%20Replacer.meta.js
// ==/UserScript==

// jshint esversion: 6

(function () {
    'use strict';
    const SEARCH_URL = "https://i.imgur.com/8nBk4bu.png",
        IMAGE_URL = "https://i.imgur.com/oJzo0UN.png";

    GM_addStyle(`
        img.lnXdpd, img#hplogo {
        /* Google logo on google.com */
            content: url(${SEARCH_URL});
            height:310px;
            max-height:310px;
            width:600px;
            max-width:600px;
            margin-top:-168px;
            display:inline-block;
        }

        div[title="Google Images"] {
        /* Google logo on images.google.com */
            content:""!important;
            background:url(${IMAGE_URL})no-repeat!important;
            background-size: 800px 271px!important;
            z-index:-1!important;
            height:271px!important;
            width:800px!important;
            margin-top: -158px!important;
            position:relative!important;
        }

        /* Search bar container */
        .sfbg {
	        background: transparent!important;
        }

        /* Offset top by 110px because this laptop's shitty resolution */
        div.LLD4me {
        	margin-top: 110px;
        }

        div.logo-subtext {
           /* The "images" text below the google images logo */
            top:initial!important;
            left:initial!important;
            bottom:0!important;
            right:0!important;
        	position:absolute!important;
        }

        #prm {
            /* Nugget info below search bar */
            display:none!important;
        }
    `);
})();