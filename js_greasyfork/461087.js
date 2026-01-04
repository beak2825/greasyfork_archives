// ==UserScript==
// @name        hashreplace
// @namespace   Violentmonkey Scripts
// @match       http://creatio.corp.mango.ru/0/Nui/*
// @grant       none
// @version     1.0
// @author      -
// @description 03.03.2023, 09:51:44
// @downloadURL https://update.greasyfork.org/scripts/461087/hashreplace.user.js
// @updateURL https://update.greasyfork.org/scripts/461087/hashreplace.meta.js
// ==/UserScript==

if (document.location.href.split('aspx')[1].split('C')[0] == '%23') {
  document.location.href = document.location.href.replace('%23', '#');
}