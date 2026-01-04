// ==UserScript==
// @name         Show Rockstar ID On Member Pages
// @version      0.3
// @description  Shows a member's Social Club ID on their profile page
// @author       poedgirl & DJMC
// @match        https://socialclub.rockstargames.com/member/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/376560/Show%20Rockstar%20ID%20On%20Member%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/376560/Show%20Rockstar%20ID%20On%20Member%20Pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getCookie(e) {
        for (var t = e + "=", r = decodeURIComponent(document.cookie).split(";"), o = 0; o < r.length; o++) {
            for (var n = r[o];
                 " " == n.charAt(0);) n = n.substring(1);
            if (0 == n.indexOf(t)) return n.substring(t.length, n.length)
        }
        return ""
    }

    var path = window.location.pathname;
    if(path[path.length-1] != '/') path += '/';
    var username = /^\/member\/([\w\W]+)\//.exec(path)[1];

    setTimeout(function() { // Wait for everything to load
    $.ajax({
          method: 'GET',
          url: 'https://scapi.rockstargames.com/profile/getprofile?nickname=' + username + '&maxFriends=3',
          beforeSend: function(request) {
              request.setRequestHeader('Authorization', 'Bearer ' + getCookie('BearerToken'));
              request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
          }
    })
        .done(function(data) {
            console.log(data);
            var scid = data.accounts[0].rockstarAccount.rockstarId;
            var $name = $('[class^="ProfileHeader__name"]');
            $name.append('<span style="margin-left: 10px;">Social Club ID: ' + scid + '</span>');
        });
    }, 1000);
})();