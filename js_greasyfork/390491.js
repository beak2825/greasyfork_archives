// ==UserScript==
// @name         TWI forums 1 block nodes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://forums.tripwireinteractive.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390491/TWI%20forums%201%20block%20nodes.user.js
// @updateURL https://update.greasyfork.org/scripts/390491/TWI%20forums%201%20block%20nodes.meta.js
// ==/UserScript==

(function() {
    'use strict';
	window.themehouse.nodes.grid_options = {"0":{"max_columns":{"enable":1,"value":"1"},"min_column_width":{"enable":1,"value":"250px"},"fill_last_row":{"enable":1,"value":"0"}},"2329468":{"max_columns":{"enable":1,"value":"1"},"min_column_width":{"enable":1,"value":"250px"},"fill_last_row":{"enable":1,"value":"0"}},"2329459":{"max_columns":{"enable":1,"value":"1"},"min_column_width":{"enable":1,"value":"250px"},"fill_last_row":{"enable":1,"value":"0"}},"2329461":{"max_columns":{"enable":1,"value":"1"},"min_column_width":{"enable":1,"value":"250px"},"fill_last_row":{"enable":1,"value":"0"}},"2329463":{"max_columns":{"enable":1,"value":"1"},"min_column_width":{"enable":1,"value":"250px"},"fill_last_row":{"enable":1,"value":"0"}},"2":{"max_columns":{"enable":1,"value":"2"},"min_column_width":{"enable":1,"value":"250px"},"fill_last_row":{"enable":1,"value":"0"}}};

	window.themehouse.nodes.ele = new window.themehouse.nodes.grid({
		layout: window.themehouse.nodes.grid_options,
		settings: {

		},
	});

	window.themehouse.nodes.ele.register();
})();