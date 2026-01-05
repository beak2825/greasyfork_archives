// ==UserScript==
// @name         Shush Episode Navigator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Easily change episodes on Shush.TV!
// @author       Aether Studios
// @match        http://www.shush.se/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/15787/Shush%20Episode%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/15787/Shush%20Episode%20Navigator.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

$.urlParam = function(name){
     var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
     if (results==null){
        return null;
     }
     else{
        return results[1] || 0;
     }
}

if($.urlParam("show") != null){        
    var hostname = "http://www.shush.se/index.php?";
    var currentEpisode = parseInt($.urlParam('id'));
    var showName = $.urlParam('show');
    var buttons = '<a href="'+hostname+'id='+(currentEpisode-1)+'&show='+showName+'">Previous</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="'+hostname+'id='+(currentEpisode+1)+'&show='+showName+'">Next</a>';
    $('#load').append(buttons);
}
