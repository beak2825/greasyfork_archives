// ==UserScript==
// @name         Rule34Hentai - Dark Theme
// @version      0.7
// @description  A simple Dark Theme for Rule34Hentai.net!
// @match        https://*.rule34hentai.net/*
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/425685/Rule34Hentai%20-%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/425685/Rule34Hentai%20-%20Dark%20Theme.meta.js
// ==/UserScript==

var text_color = '#c8ff00'
var dark_color = '#040004'
var light_color = '#413d3d'

var btn_color1 = '#FA023C'
var btn_color2 = '#4B000F'

var mainCss = 'body{color:' + text_color + ';background:' + light_color + '}a{color:' + text_color + '}ul li a{color:' + text_color + '}.comment,.setupblock,footer,header,section>.blockbody,section>h3{background:' + dark_color + '}.comment,.setupblock,.thumb img,footer,header,section>.blockbody,section>h3,table.zebra,table.zebra td{border:1px solid ' + text_color + '}.thumb img{background:' + light_color + '}button{margin:14px 0;}button,input[type=submit]{min-height:25px;font-size:18px;text-align:center;line-height:30px;color:rgba(255,255,255,.9);border:none;background:linear-gradient(-45deg,' + btn_color1 + ','+ btn_color2 + ');background-size:600%;-webkit-animation:anime 16s linear infinite;animation:anime 16s linear infinite;cursor:pointer;font-weight:bold;width:100%;}@keyframes anime{0%{background-position:0 50%}50%{background-position:100% 50%}100%{background-position:0 50%}}div#fluid_video_wrapper_video-id{height: 60% !important;width: 100% !important;max-height: 1080px;}.fluid_video_wrapper video{max-height: 1080px !important;}'

var styleEl = document.createElement('style')
styleEl.innerHTML = mainCss
document.body.insertAdjacentElement('beforebegin', styleEl)