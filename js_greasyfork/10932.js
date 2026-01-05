// ==UserScript==
// @name        REMOVE CANADA
// @namespace   REMOVE CANADA
// @description REMOVE_CANADA
// @include     https://8ch.net/intl/
// @include     https://8ch.net/intl/*
// @version     1
// @grant       none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
canuck = $(".flag-ca").parent().parent().parent()
canuck.prev('br').remove();
canuck.remove();
// @downloadURL https://update.greasyfork.org/scripts/10932/REMOVE%20CANADA.user.js
// @updateURL https://update.greasyfork.org/scripts/10932/REMOVE%20CANADA.meta.js
// ==/UserScript==