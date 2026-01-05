// ==UserScript==
// @version 1.000000000000000001
// @name Full text Steam achievements
// @description Show full text of Steam achievements instead of dumb "..." at the end
// @include  https://steamcommunity.com/id/*/stats/*
// @include  http://steamcommunity.com/id/*/stats/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @namespace https://greasyfork.org/users/79133
// @downloadURL https://update.greasyfork.org/scripts/24714/Full%20text%20Steam%20achievements.user.js
// @updateURL https://update.greasyfork.org/scripts/24714/Full%20text%20Steam%20achievements.meta.js
// ==/UserScript==
var dumbNodes = $("h5.ellipsis");

dumbNodes.removeClass ("ellipsis");