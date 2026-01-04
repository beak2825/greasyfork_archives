// ==UserScript==
// @name StackExchange chat links
// @namespace http://ostermiller.org/
// @version 1.00
// @description Adds a chat link to the left hand nav of the home page of all Stack sites followed by a lightly filtered list of recently active chat rooms
// @include /https?\:\/\/([a-z\.]*\.)?(stackexchange|askubuntu|superuser|serverfault|stackoverflow|answers\.onstartups)\.com\/$/
// @exclude *://chat.stackoverflow.com/*
// @exclude *://chat.stackexchange.com/*
// @exclude *://chat.*.stackexchange.com/*
// @exclude *://api.*.stackexchange.com/*
// @exclude *://data.stackexchange.com/*
// @connect chat.stackoverflow.com
// @connect chat.stackexchange.com
// @connect chat.meta.stackexchange.com
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/391169/StackExchange%20chat%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/391169/StackExchange%20chat%20links.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var base='https://chat.stackexchange.com/'
    var nav = $('.left-sidebar .nav-links .nav-links')
    var chatlink=$('<li>').html('<a class="pl8 js-gps-track nav-links--link" href="'+base+'?tab=site&sort=active&host='+location.hostname+'">Chat</a>')
    nav.append(chatlink)
    var chatlinks=$('<ol class="nav-links">')
    chatlink.append(chatlinks)
    GM_xmlhttpRequest({
        method: "GET",
        url: base+'?tab=site&sort=active&host='+location.hostname,
        responseType: 'html',
        onload:function (resp) {
            $(resp.responseText).find('.roomcard').each(function(){
                var name=$(this).find('.room-name').html().replace('"/', '"'+base)
                if (!name.match(/((discussion between)|(room for).* and )|(discussion on answer|question)/i)){
                    var act=$(this).find('.last-activity').html().replace('"/', '"'+base)
                    var daysago = act.match(/([0-9])+d ago/)
                    if (!daysago || parseInt(daysago) <= 7) chatlinks.append($('<li>').html(name + " " + act))
                }
            });
        }
    });
})();