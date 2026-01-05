// ==UserScript==
// @name         Edit on Top
// @version      0.2
// @description  Adds "Edit" link to the top bar of posts
// @author       Ghost
// @match        http://myanimelist.net/forum/*
// @grant        none
// @namespace https://greasyfork.org/users/10763
// @downloadURL https://update.greasyfork.org/scripts/19539/Edit%20on%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/19539/Edit%20on%20Top.meta.js
// ==/UserScript==

// Catch all Postnum instances
$('.postnum').each(function() {
    // Add the Edit link after the post number
    $(this).after(' | <a href="http://myanimelist.net/forum/?action=message&msgid=' + $(this).attr('href').replace('#msg','') +'">Edit ✎</a>');
});

// Sets the color as permanently white for the post number and edit link.
$(".topEdit, .postnum").css('color', '#ffffff');