// ==UserScript==
// @name           FBSMS1.0
// @namespace      http://userscripts.org/users/23652
// @description    Facebook Staff Mode Sprite Part Two
// @include        http://*.facebook.com/*
// @include        http://facebook.com/*
// @include        https://*.facebook.com/*
// @include        https://facebook.com/*
// @copyright      KemalDikkulak
// @version        1.0.3
// @require        https://greasyfork.org/scripts/1885-joesimmons-library/code/JoeSimmons'%20Library.js?version=7915
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/12857/FBSMS10.user.js
// @updateURL https://update.greasyfork.org/scripts/12857/FBSMS10.meta.js
// ==/UserScript==

JSL.runAt('interactive', function () {
    'use strict';

    var menubar, navSearch, rTrim, u;
    var links = {



        // LINKS SECTION
        // FORMAT: 'LINK TEXT' : 'LINK URL',
        /////////////////////////////////////////////////////////////////////////////
        'Panel' : 'http://developers.facebook.com',
        /////////////////////////////////////////////////////////////////////////////



    '':'' // don't change
    };






        navSearch = JSL('#blueBarNAXAnchor');
        rTrim = /^\s*(\S*(?:\s+\S+)*)\s*$/; // trim regexp by douglas crockford
        menubar = JSL.create('div', {id: 'extra_links_holder', style: 'float: right; padding: 11px 0 0 4px;'});

    if (navSearch.exists) {
        for (u in links) {
            u = u.replace(rTrim, '$1'); // trim text
            if (u !== '') {
                menubar.appendChild(
                    JSL.create('a', {href: links[u], style: 'padding: 6px 8px; color: #FFFFFF; font-family: elvetica, arial, sans-serif; font-size: 11pt;', target:'_parent'}, [
                        JSL.create('text', u)
                    ])
                );
            }
        }

        navSearch.prepend(menubar);
    }

});
