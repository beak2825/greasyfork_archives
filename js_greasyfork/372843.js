// ==UserScript==
// @name         Pastebin selector language
// @version      1.1
// @description  With this script you can select language via hash
// @author Maxeo | maxeo.net
// @license https://creativecommons.org/licenses/by-sa/4.0/
// @include     https://pastebin.com/*
// @icon        https://www.maxeo.net/imgs/icon/android-chrome-192x192.png
// @grant        none
// @namespace https://greasyfork.org/users/88678
// @downloadURL https://update.greasyfork.org/scripts/372843/Pastebin%20selector%20language.user.js
// @updateURL https://update.greasyfork.org/scripts/372843/Pastebin%20selector%20language.meta.js
// ==/UserScript==
(function () {
  'use strict';
  var not_find = 1
  $('select[name=paste_format] option').each(function () {
    if (not_find && ($(this).html() + ' ').toUpperCase().indexOf(document.location.hash.substr(1).toUpperCase()) + 1) {
      $('select[name=paste_format]').val($(this).val()).change()
      not_find = 0;
    }
  })
}) ();
