// ==UserScript==
// @name               Kill Alert2
// @namespace          duncanx
// @version            0.05
// @description        Just Kill Alert
// @author             duncanx
// @include            http*://www.lixianhezi.com/*
// @grant              none
// @run-at             document-start
// @license            MIT License
// @require     http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/30542/Kill%20Alert2.user.js
// @updateURL https://update.greasyfork.org/scripts/30542/Kill%20Alert2.meta.js
// ==/UserScript==

(function(){
    'use strict';
	var div=$('div.new_alert');
	div.remove();
})();

