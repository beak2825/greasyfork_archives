// ==UserScript==
// @name       Nu arata torrentele inchise in lista
// @namespace  tmd
// @version    0.3
// @description  enter something useful
// @include     *torrentsmd.*/browse.php*
// @copyright  2014, drakulaboy
// @icon         http://i.imgur.com/uShqmkR.png
// @require     http://code.jquery.com/jquery-1.10.2.js
// @downloadURL https://update.greasyfork.org/scripts/1055/Nu%20arata%20torrentele%20inchise%20in%20lista.user.js
// @updateURL https://update.greasyfork.org/scripts/1055/Nu%20arata%20torrentele%20inchise%20in%20lista.meta.js
// ==/UserScript==
var torclose = $('.tableTorrents b[title="Închis"]');
    torclose.closest('tr').hide();