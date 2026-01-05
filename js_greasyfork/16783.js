// ==UserScript==
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @name         ȶς Skin preview
// @namespace    ȶς Skin preview
// @version      2.0.7
// @description  HKG Skin Preview for Agarplus
// @author       TurboCheetah
// @match        http*://agar.io
// @include      http://*agar.io/agarplus.io
// @include      http://agar.io/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/16783/%C8%B6%CF%82%20Skin%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/16783/%C8%B6%CF%82%20Skin%20preview.meta.js
// ==/UserScript==

// variables
var sideContainer = '.side-container.left-side'; //container to append skin changer menu
var leftContainer = '.forums'; //used to find left container
var loadCheckInterval = 100; //interval to check if container has loaded
var Title = 'h2.aTitle'
var Tags = 'div#teamNameContainer.input-group'
var Ad = 'center'

//check if page loaded
var ci = setInterval(function()
{
    if ($(sideContainer).has(leftContainer).length)
    {
        clearInterval(ci);
        // set the title to something cooler
        $(Title).replaceWith('</div><size="10"><div id="profile-main"><div id="profile-pic" class="form-group clearfix"><div class="nav arrow-left"></div><div id="preview-img-area"><img id="preview-img" src="blob:http%3A//agar.io/e10a5854-4df7-4a48-87f1-c5ed28feb661" style="display: inline;"></div><div class="nav arrow-right"></div></div><font face="header"><font color="#00c9ff"><h2 align="middle"><font size="10">ȶ<font color="#FF9100"><font size="10">ς');
        // Remove Ads
        $(Ad).replaceWith('');
    }

    else
    {
        // set title
        $(Title).replaceWith('<font face="header"><font color="#00c9ff"><h2 align="middle"><font size="10">ȶ<font color="#FF9100"><font size="10">ς</font></div><size="10"><div id="profile-main"><div id="profile-pic" class="form-group clearfix"><div class="nav arrow-left"></div><div id="preview-img-area"><img id="preview-img" src="blob:http%3A//agar.io/e10a5854-4df7-4a48-87f1-c5ed28feb661" style="display: inline;"></div><div class="nav arrow-right"></div></div>');
        // Remove Ads
        $(Ad).replaceWith('');
    }
    
}, loadCheckInterval);