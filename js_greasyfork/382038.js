// ==UserScript==
// @name News Item Fix
// @description Change the background colour of a page
// @include https://www.newsitem.com/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version 0.0.1.20190419164345
// @namespace https://greasyfork.org/users/293356
// @downloadURL https://update.greasyfork.org/scripts/382038/News%20Item%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/382038/News%20Item%20Fix.meta.js
// ==/UserScript==

$('.subscription-required').remove();
$('.site-container').removeClass('subscriber-only hide').addClass('subscriber-preview');
$('.redacted-overlay').remove();
$('.subscription-modal').remove();


$( "div" ).removeClass( "subscriber-only hide" ).addClass( "subscriber-preview" );

