// ==UserScript==
// @name     PlugDJ
// @author   Nizax
// @include  http://*plug.dj*
// @include  https://*plug.dj*
// @version  1.2
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @namespace http://plug.dj
// @description Adds mirkoczat.pl integration
// @downloadURL https://update.greasyfork.org/scripts/398338/PlugDJ.user.js
// @updateURL https://update.greasyfork.org/scripts/398338/PlugDJ.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
        setTimeout( () => {
            $.getScript('https://code.radiant.dj/rcs.min.js');
            gapi.client.setApiKey('AIzaSyCW65iRxBxiqklczIePiP32dCuSNUK7ul0');
        }, 5000);
    };
})();