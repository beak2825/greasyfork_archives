// ==UserScript==
// @name         v4c redux
// @namespace    http://use.i.E.your.homepage/
// @version      1.0.0
// @description  New and improved emotes to use!
// @match        http://instasync.com/*
// @grant        none
// @copyright    2014
// @downloadURL https://update.greasyfork.org/scripts/12840/v4c%20redux.user.js
// @updateURL https://update.greasyfork.org/scripts/12840/v4c%20redux.meta.js
// ==/UserScript==
 
// emote script for greasemonkey or tampermonkey.
// $codes[""] = \'<img src="">\'; \
 
// Gr8                                
// by the goyim *totally not a stolen script*
 
var script = document.createElement('script');
script.setAttribute("type", "application/javascript");
script.textContent = ' \
    setTimeout(function(){ \
    $codes["benny"] = \' <img src="http://i.imgur.com/bXxWKqn.png">\'; \
    $codes["vidyaplox"] = \' <img src="http://i.imgur.com/59N5R86.png">\'; \
    $codes["rookie"] = \' <img src="http://i.imgur.com/GL6JHxF.png?1">\'; \
    $codes["wow"] = \'<img src="http://i.imgur.com/Gx5wmqn.gif">\'; \
    $codes["snake"] = \'<img src="http://i.imgur.com/h1YQvAU.gif">\'; \
    $codes["edgy"] = \'<img src="http://i.imgur.com/uOzyYGx.jpg">\'; \
    $codes["ayylmao"] = \'<img src="http://i.imgur.com/grzlkIC.jpg">\'; \
    $codes["kawaii"] = \'<img src="http://i.imgur.com/qeDCqGR.gif?1">\'; \
    $codes["nice"] = \'<img src="http://i.imgur.com/n7gKxLw.jpg">\'; \
    $codes["sadboi"] = \' <img src="http://i.imgur.com/W4WaFAL.gif">\'; \
    $codes["lolita"] = \'<img src="http://i.imgur.com/NAPxXD1.gif">\'; \
    $codes["alien2"] = \'<img src="http://i.imgur.com/Nd5bcpJ.gif">\'; \
    $codes["isis"] = \'<img src="http://i.imgur.com/HoSe4Qm.gif">\'; \
    $codes["goblinu2"] = \'<img src="http://i.imgur.com/1S4Y8Ak.gif">\'; \
    $codes["carlton"] = \'<img src="http://i.imgur.com/svVxAqM.gif">\'; \
    $codes["eurobeat"] = \'<img src="http://i.imgur.com/VLpSaIn.gif">\'; \
    $codes["suicide"] = \'<img src="http://i.imgur.com/3R4BigF.gif">\'; \
    $codes["ebola"] = \'<img src="http://i.imgur.com/CXq73GG.gif">\'; \
    $codes["bean"] = \'<img src="http://i.imgur.com/TcIX5AZ.gif">\'; \
    $codes["smuganime2"] = \'<img src="http://i.imgur.com/2FF3kvJ.gif">\'; \
     }, 1500);'
        ;
 
document.body.appendChild(script);