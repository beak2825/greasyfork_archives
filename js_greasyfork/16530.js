// ==UserScript==
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @name         Agarplus v2 - Benunzee
// @namespace    Agarplus v2 - Benunzee
// @version      2.0
// @description  Agarplus v2 Edit by Benunzee
// @author       Benunzee
// @match        http*://agar.io
// @include      http://*agar.io/agarplus.io
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/16530/Agarplus%20v2%20-%20Benunzee.user.js
// @updateURL https://update.greasyfork.org/scripts/16530/Agarplus%20v2%20-%20Benunzee.meta.js
// ==/UserScript==

// variables
var sideContainer = '.side-container.left-side'; //container to append skin changer menu
var leftContainer = '.forums'; //used to find left container
var loadCheckInterval = 100; //interval to check if container has loaded
var Title = 'h2.aTitle'
var Tags = 'div#teamNameContainer.input-group'
var Ad = 'center'
var Leaderboard = 'div.header'
var Team = 'input#team_name.form-control'
var TagBox = 'input#team_name.form-control'
var Thing = 'h2.FirstTitle'
var ServerIP = 'input#serverIP.form-control'
var Button = 'button.btn.btn-nosx.cry'
var PS = 'div#privateServerBox.agario-panel.agario-side-panel.ps'
var Rem = 'div#CikYT.agario-panel.agario-side-panel.yt'
var Title = 'title'
var This2 = 'button#Private2.close'

//check if page loaded
var ci = setInterval(function()
{
    if ($(sideContainer).has(leftContainer).length)
    {
        clearInterval(ci);
        // Remove Ads
        $(Ad).replaceWith('');
        // Remove Thing
        $(Thing).replaceWith('');
        // Remove Server IP box
        $(ServerIP).replaceWith('');
        // Remove Button
        $(Button).replaceWith('');
        // Remove This
        $(Rem).replaceWith('');
        // Change Title
        $(Title).replaceWith('<title>Agarplus.io</title>');
        // Remove This2
        $(This2).replaceWith('');
    }

    else
    {
        // Remove Ads
        $(Ad).replaceWith('');
        // Remove Thing
        $(Thing).replaceWith('');
        // Remove Server IP box
        $(ServerIP).replaceWith('');
        // Remove Button
        $(Button).replaceWith('');
        // Remove This
        $(Rem).replaceWith('');
        // Change Title
        $(Title).replaceWith('<title>Agarplus.io</title>');
        // Remove This2
        $(This2).replaceWith('');
    }
    
}, loadCheckInterval);
    
    