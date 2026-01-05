// ==UserScript==
// @name       No zamolxis images
// @version    0.2
// @description  Replace image sources

// @include http://www.torrentsmd.com/*
// @include http://www.torrentsmd.eu/*
// @include http://www.torrentsmd.me/*
// @include http://www.torrentsmoldova.com/*
// @include http://www.torrentsmoldova.org/*
// @include http://www.torrentsmoldova.net/*

// @include http://torrentsmd.com/*
// @include http://torrentsmd.eu/*
// @include http://torrentsmd.me/*
// @include http://torrentsmoldova.com/*
// @include http://torrentsmoldova.org/*
// @include http://torrentsmoldova.net/*

// @copyright  2014+, mihaylma
// @namespace https://greasyfork.org/users/4263
// @downloadURL https://update.greasyfork.org/scripts/3952/No%20zamolxis%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/3952/No%20zamolxis%20images.meta.js
// ==/UserScript==
jQuery('img[src^="http://zamolxismd.org/m/"]').each(function(){jQuery(this).attr('src', jQuery(this).attr('src').replace('http://zamolxismd.org/m/', 'http://'))});