// ==UserScript==
// @name         Agar Server Selector
// @namespace    
// @version      1.0
// @description  Modifies the agar.io server select page to be useful.
// @author       Ununoctium118
// @match        http://agar.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10059/Agar%20Server%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/10059/Agar%20Server%20Selector.meta.js
// ==/UserScript==
 
// Clear the dialog box
var selector = $('#region');
 
// Load the server list
var selected;
 
var regionTable = {
    'US-Atlanta': 'US East',
    'US-Fremont': 'US West',
    'EU-London': 'Europe',
    'JP-Tokyo': 'Japan',
};
 
$.getJSON('http://m.agar.io/fullInfo', function(serverList) {
    var output = [];
    serverList.servers.sort(function (a, b) {
        var x = regionTable[a.region], y = regionTable[b.region];
        return ((x < y) ? - 1 : ((x > y) ? 1 : 0));
    });
    $.each(serverList.servers, function(index, server) {
        output.push('<option value="' + server.ip + '">' + regionTable[server.region] + ' (' + server.ip + ') (' + server.numPlayers + ' players)</option>');
    });
    selector.html(output.join(''));
});
 
 
// Add our extra onchangelistener
selector.on('change', function() {
    selected = selector.val() + ':443';
});
 
 
// Intercept requests for m.agar.io and instead return our data.
var realAjax = $.ajax;
$.ajax = function() {
    if(arguments[0] == 'http://m.agar.io/') {
        var callback = arguments[1].success;
        // The selector callback probably hasn't run yet.
        // Really should use a promise or something here.
        setTimeout(function() {
            callback(selected);
        }, 10);
    } else {
        // Use irl ajax
        return realAjax.apply(this, arguments);
    }
};