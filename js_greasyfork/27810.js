// ==UserScript==
// @name     Tutsplus Code
// @version	1.2001
// @description Hide readed article
// @include    https://tutsplus.com/*
// @include    http://tutsplus.com/* 
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js
// @namespace https://greasyfork.org/users/38384
// @downloadURL https://update.greasyfork.org/scripts/27810/Tutsplus%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/27810/Tutsplus%20Code.meta.js
// ==/UserScript==

jQuery(function() {
    $("a.topic-design").closest("li").hide();
    $("a.topic-gamedevelopment").closest("li").hide();
    $("a.topic-photography").closest("li").hide();

});