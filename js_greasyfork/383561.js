// ==UserScript==
// @name        pindonga
// @namespace   needrom
// @description modo chimuelo.
// @include     *://*.pindonga.net/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @version     1.2
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/383561/pindonga.user.js
// @updateURL https://update.greasyfork.org/scripts/383561/pindonga.meta.js
// ==/UserScript==

(function() {
    'use strict';
$('#scrollToTop').remove();
$('#brandday').append('<a href="#head" id="scrollToTop" style="display: inline;"><i class="fa fa-angle-double-up" aria-hidden="true"></i></a>');
$('#head').append('<style type="text/css">#contenido_principal,.icon{filter: invert(100%) !important;}img[src*=".jpeg"],img[src*=".jpg"],img[src*=".gif"],img[src*=".png"],iframe[src*="youtube"],.online,#scrollToTop{filter: invert(100%) !important;}#head > div.hero-head > header > div > div.nav-center > a > span > img,.avatar-crop,#modalBody > div > div:nth-child(1) > div:nth-child(1) > img{filter: invert(0%) !important;}#head > div.hero-head > header > div > div.nav-left > a > img,#head > div.hero-head > div > a:nth-child(4) > img,#head > div.hero-head > div > a:nth-child(3) > img,#head > div.hero-head > div > a:nth-child(2) > img,#head > div.hero-head > div > a:nth-child(1) > img,#pp_copyright > div > a:nth-child(4) > img,#pp_copyright > div > a:nth-child(3) > img,#pp_copyright > div > a:nth-child(2) > img,#pp_copyright > div > a:nth-child(1) > img,#pie > div > div:nth-child(1) > img{filter: invert(0%) !important;}#head .hero-head a {color: #000;}.cadGe_red {background: #fff;}#head .hero-head a.is-active {color: #e06d19;}</style>');
})();