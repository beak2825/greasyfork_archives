// ==UserScript==
// @name Grundo's Cafe Art Restoration Project
// @description Restores original Neopets art to Grundo's Cafe.
// @version 1.0
// @icon https://i.imgur.com/mTin48U.png
// @include *grundos.cafe/island/mystichut/*
// @include *grundos.cafe/island/
// @include *grundos.cafe/games/avatar_stats/
// @include *grundos.cafe/userlookup/*
// @include *grundos.cafe/neoboards/*
// @include *grundos.cafe/stamps/album/*
// @include *grundos.cafe/viewshop/?shop_id=58
// @include *grundos.cafe/buyitem/*
// @include *grundos.cafe/games/neodeck/view*
// @include *grundos.cafe/market/browseshop/*
// @include *grundos.cafe/island/tombola/*
// @include *grundos.cafe/inventory/*
// @include *grundos.cafe/safetydeposit/*
// @namespace https://greasyfork.org/users/969872
// @downloadURL https://update.greasyfork.org/scripts/452941/Grundo%27s%20Cafe%20Art%20Restoration%20Project.user.js
// @updateURL https://update.greasyfork.org/scripts/452941/Grundo%27s%20Cafe%20Art%20Restoration%20Project.meta.js
// ==/UserScript==

var tags = document.getElementsByTagName('img');

for (var i = 0; i < tags.length; i++) {

tags[i].src = tags[i].src.replace('https://neopialive.s3.us-west-1.amazonaws.com/misc/mystic.gif', 'https://images.neopets.com/island/mystic.gif');
tags[i].src = tags[i].src.replace('https://www.grundos.cafe/static/images/misc/banners/island/mystichut.gif', 'https://images.neopets.com/headers/island/mystichut.gif');
tags[i].src = tags[i].src.replace('https://neopialive.s3.us-west-1.amazonaws.com/boards/avatars/mystic.gif', 'https://images.neopets.com/neoboards/avatars/islandmystic.gif');
tags[i].src = tags[i].src.replace('https://neopialive.s3.us-west-1.amazonaws.com/misc/tombolaman.gif', 'https://images.neopets.com/island/tombolaman.gif');
tags[i].src = tags[i].src.replace('https://www.grundos.cafe/static/images/misc/banners/island/tombola.gif', 'https://images.neopets.com/headers/island/tombola.gif');
tags[i].src = tags[i].src.replace('https://neopialive.s3.us-west-1.amazonaws.com/games/tradingcards/50.gif', 'https://images.neopets.com/games/tradingcards/lg_50.gif');
tags[i].src = tags[i].src.replace('https://neopialive.s3.us-west-1.amazonaws.com/items/stamp_mys_mystic.gif', 'https://images.neopets.com/items/stamp_mys_mystic.gif');
tags[i].src = tags[i].src.replace('https://neopialive.s3.us-west-1.amazonaws.com/items/stamp_mys_coc.gif', 'https://images.neopets.com/items/stamp_mys_coc.gif');
tags[i].src = tags[i].src.replace('https://neopialive.s3.us-west-1.amazonaws.com/explore/mysteryisland.gif', 'https://images.neopets.com/maps/island/mysteryisland_2005_01.gif');

}

var tags = document.getElementsByTagName('input');

for (var i = 0; i < tags.length; i++) {

tags[i].src = tags[i].src.replace('https://neopialive.s3.us-west-1.amazonaws.com/items/stamp_mys_mystic.gif', 'https://images.neopets.com/items/stamp_mys_mystic.gif');
tags[i].src = tags[i].src.replace('https://neopialive.s3.us-west-1.amazonaws.com/items/stamp_mys_coc.gif', 'https://images.neopets.com/items/stamp_mys_coc.gif');
}