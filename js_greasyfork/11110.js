// ==UserScript==
// @name        HF removeLogo()
// @namespace   HF
// @description Remove the HF logo.
// @include     http://www.hackforums.net/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @version     1.0
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/11110/HF%20removeLogo%28%29.user.js
// @updateURL https://update.greasyfork.org/scripts/11110/HF%20removeLogo%28%29.meta.js
// ==/UserScript==

$('.logo > a:nth-child(1) > img:nth-child(1)').remove();