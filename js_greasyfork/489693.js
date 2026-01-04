// ==UserScript==
// @name            	Theater player default in youtube
// @namespace       	https://greasyfork.org/users/821661
// @match           	https://www.youtube.com/*
// @grant           	none
// @run-at              document-body
// @version         	1.3
// @author          	hdyzen
// @description     	set youtube player theater mode when open video
// @license         	MIT
// @downloadURL https://update.greasyfork.org/scripts/489693/Theater%20player%20default%20in%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/489693/Theater%20player%20default%20in%20youtube.meta.js
// ==/UserScript==
'use strict';

window.ytcfg.data_.START_IN_THEATER_MODE = true;
