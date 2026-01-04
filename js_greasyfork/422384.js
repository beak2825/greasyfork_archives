// ==UserScript==
// @name        [AO3] Menu Items
// @description add more options to the dropdown
// @version     0.4
// @author      Rhine
// @namespace   https://github.com/RhineCloud
// @include     http*://*archiveofourown.org*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/445692/%5BAO3%5D%20Menu%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/445692/%5BAO3%5D%20Menu%20Items.meta.js
// ==/UserScript==

$(function() {
    const username = $('#greeting').find('a:first-of-type').attr('href').slice(7);
    const menuArr = [//{name: 'My Dashboard', url: ''},
                     //{name: 'My Profile', url: '/profile'},
                     {name: 'My Preferences', url: '/preferences'},
                     {name: 'My Site Skins', url: '/skins?skin_type=Site'},
                     {name: 'My Work Skins', url: '/skins?skin_type=WorkSkin'},
                     {name: 'My Works', url: '/works'},
                     {name: 'My Drafts', url: '/drafts'},
                     {name: 'My Series', url: '/series'},
                     {name: 'My Bookmarks', url: '/bookmarks'},
                     //{name: 'My Collections', url: '/collections'},
                     {name: 'My Inbox', url: '/inbox'},
                     {name: 'My Statistics', url: '/stats'},
                     {name: 'My Subscriptions', url: '/subscriptions'},
                     //{name: 'My Co-Creator Requests', url: '/creatorships'},
                     //{name: 'My Sign-ups', url: '/signups'},
                     //{name: 'My Assignments', url: '/assignments'},
                     //{name: 'My Claims', url: '/claims'},
                     //{name: 'My Related Works', url: '/related_works'},
                     //{name: 'My Gifts', url: '/gifts'},
                     {name: 'Tag Wrangling', url: '/tag_wranglers/'}];
    let menuHTML = '';
    menuArr.forEach(function(item) {
        item.url = item.name.startsWith('My ') ? `/users/${username}${item.url}` : `${item.url}${username}`;
        menuHTML = `${menuHTML}<li><a href="${item.url}">${item.name}</a></li>`;
    });
    $('#greeting').find('li:eq(0) ul').html(menuHTML);
});