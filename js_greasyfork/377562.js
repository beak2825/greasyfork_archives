// ==UserScript==

// @name NetSuite Header Locking and Styling

// @version 0.1

// @description Float item sublist header on scroll

// @match https://*.netsuite.com/*

// grant none

// @require http://code.jquery.com/jquery-latest.js

// @namespace https://greasyfork.org/users/245342
// @downloadURL https://update.greasyfork.org/scripts/377562/NetSuite%20Header%20Locking%20and%20Styling.user.js
// @updateURL https://update.greasyfork.org/scripts/377562/NetSuite%20Header%20Locking%20and%20Styling.meta.js
// ==/UserScript==

(function() {

'use strict';

var elem = $('#item_layer').append('<div id="floating_header" style="position:fixed;top:60px;display:none;"></div>');

var header = $('#item_splits').closest('tr').find('.uir-machine-headerrow').clone();

var fixed = $('#floating_header').append(header);

var tableOffset = $("#item_splits").offset().top;

$(window).bind("scroll", function() {

var offset = $(this).scrollTop();

if (offset >= tableOffset && fixed.is(":hidden")) {

fixed.show();

}

else if (offset < tableOffset) {

fixed.hide();

}

});

})();