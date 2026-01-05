// ==UserScript==
// @name           Facebook - Extra Links
// @namespace      http://userscripts.org/users/23652
// @description    Adds extra links at the top of facebook; customizable
// @include        http://*.facebook.com/*
// @include        http://facebook.com/*
// @include        https://*.facebook.com/*
// @include        https://facebook.com/*
// @copyright      JoeSimmons
// @version        1.0.26
// @require        https://greasyfork.org/scripts/1885-joesimmons-library/code/JoeSimmons'%20Library.js?version=7915
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/3565/Facebook%20-%20Extra%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/3565/Facebook%20-%20Extra%20Links.meta.js
// ==/UserScript==

JSL.runAt('interactive', function () {
    'use strict';

    var menubar, navSearch, rTrim, u;
    var links = {



        // LINKS SECTION
        // FORMAT: 'LINK TEXT' : 'LINK URL',
        /////////////////////////////////////////////////////////////////////////////
        'FarmVille' : 'http://apps.facebook.com/onthefarm/',
        'Requests' : 'http://www.facebook.com/reqs.php',
        'Notifications' : 'http://www.facebook.com/notifications.php',
        /////////////////////////////////////////////////////////////////////////////



    '':'' // don't change
    };






        navSearch = JSL('#blueBarNAXAnchor');
        rTrim = /^\s*(\S*(?:\s+\S+)*)\s*$/; // trim regexp by douglas crockford
        menubar = JSL.create('div', {id: 'extra_links_holder', style: 'float: left; padding: 11px 0 0 4px;'});

    if (navSearch.exists) {
        for (u in links) {
            u = u.replace(rTrim, '$1'); // trim text
            if (u !== '') {
                menubar.appendChild(
                    JSL.create('a', {href: links[u], style: 'padding: 6px 8px; color: #FFFFFF; font-family: verdana, tahoma, arial, sans-serif; font-size: 11pt;', target:'_parent'}, [
                        JSL.create('text', u)
                    ])
                );
            }
        }

        navSearch.prepend(menubar);
    }

});