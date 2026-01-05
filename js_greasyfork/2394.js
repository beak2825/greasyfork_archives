// ==UserScript==
// @name       Ascunde temele care nu au mesaje noi
// @namespace  tmd
// @version    3.1
// @description  descriere
// @include     *torrentsmd.*/watcher.php
// @copyright  flienteen
// @icon         http://s017.radikal.ru/i432/1308/7b/34fa18a96812.png
// @require     http://code.jquery.com/jquery-1.10.2.js

// @downloadURL https://update.greasyfork.org/scripts/2394/Ascunde%20temele%20care%20nu%20au%20mesaje%20noi.user.js
// @updateURL https://update.greasyfork.org/scripts/2394/Ascunde%20temele%20care%20nu%20au%20mesaje%20noi.meta.js
// ==/UserScript==

$j('img[src*="unlocked.gif"]').closest('.fullWidth>tbody>tr').hide();