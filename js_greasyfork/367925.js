// ==UserScript==
// @name        Customize Hayden Technologies DNS Block Page
// @namespace   JeffersonScher
// @description Replace page contents (2018-05-12)
// @author      Jefferson "jscher2000" Scher
// @copyright   Copyright 2018 Jefferson Scher
// @license     BSD-3-clause
// @include     http*://haydentech.com/private/dns/dns.php?report=*
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/367925/Customize%20Hayden%20Technologies%20DNS%20Block%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/367925/Customize%20Hayden%20Technologies%20DNS%20Block%20Page.meta.js
// ==/UserScript==

var myHTML = '<h1>{ICON}You\'re Welcome!</h1>' +
    '<p>{DOMAIN} is terrible, so let\'s not go there.';

var myImageCode = '<span style="display: block; height: 180px; width: 180px; font-size: 144px; text-align: center; ' +
    'float: left; background-color: #f4f4f4; padding: 15px; border-radius: 100px; margin-right: 50px">&#x1f648;</span>';

var myCSS = '<style>html, body {box-sizing: border-box; height: 100%; width: 100%; margin: 0; background-color: red; color: white; }' + 
    'body {font-size: 36px; padding: 20px 30px;}</style>';

// No need to customize below this line

var domain = location.search.substr(location.search.indexOf('report=')+7);

document.body.innerHTML = myHTML.replace('{DOMAIN}', domain).replace('{ICON}', myImageCode) + '\n' + myCSS;