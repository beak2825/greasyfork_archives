// ==UserScript==
// @name         atbmarket.com - cashback reminder
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  cashback reminder
// @author       Untiy16
// @license      MIT
// @match        https://www.atbmarket.com/shop/checkout/index
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atbmarket.com
// @require      https://raw.githubusercontent.com/Untiy16/links/master/jQueryMod-3.7.1-no-conflict.js#sha384=9Yrn245SmfrViewuGHURMDbyV8WnI+sZxpoY7qcliR+941oQoejbYA94IYy+L6jo
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507526/atbmarketcom%20-%20cashback%20reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/507526/atbmarketcom%20-%20cashback%20reminder.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    $('button.delivery-submit').one('mouseenter', function () {
        alert('Активуйте кешбек!');
    });
})(jQueryMod);