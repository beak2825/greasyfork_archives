// ==UserScript==
// @name       Hybrid - Websites
// @version    1.0
// @author	   jawz
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/26844/Hybrid%20-%20Websites.user.js
// @updateURL https://update.greasyfork.org/scripts/26844/Hybrid%20-%20Websites.meta.js
// ==/UserScript==

if ($('li:contains("Website")').length) {
    $('p:contains("Did the website or the domain connect")').prependTo($('div[class="item-response order-1"]'));
    $('div[class="item-response order-1"]').find('label[class="control-label"]').hide();
}