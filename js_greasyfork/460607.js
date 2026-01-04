// ==UserScript==
// @name         Sort confluence "My Spaces" alphabetically
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Alphabetically Sort confluence "My Spaces"
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.3.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460607/Sort%20confluence%20%22My%20Spaces%22%20alphabetically.user.js
// @updateURL https://update.greasyfork.org/scripts/460607/Sort%20confluence%20%22My%20Spaces%22%20alphabetically.meta.js
// ==/UserScript==

/* global jQuery */

function capitalizeFirstLetter(val) {
    return val.charAt(0).toUpperCase() + val.toLowerCase().slice(1);
}

jQuery(function(){
    'use strict';

    setTimeout(() => {
        let mySpaces = {};
        let list = jQuery('#sidebar-spaces').find('ul:first');

        list.find('li').each(function(){
            let val = jQuery(this).html();
            let name = capitalizeFirstLetter(jQuery(this).find('.aui-nav-item-label').html());
            mySpaces[name] = val;
        });

        const mySpacesOrdered = Object.keys(mySpaces).sort().reduce(
            (obj, key) => {
                obj[key] = mySpaces[key];
                return obj;
            },
            {}
        );

        list.html('');
        for (const [name, value] of Object.entries(mySpacesOrdered)) {
            jQuery('<li class="item" />').append(value).appendTo(list);
        }
    }, "500");

});
