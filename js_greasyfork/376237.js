// ==UserScript==
// @name         Bye bye bing
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  makes it so you can't search bing
// @author       Tim Spark
// @match        https://www.bing.com/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376237/Bye%20bye%20bing.user.js
// @updateURL https://update.greasyfork.org/scripts/376237/Bye%20bye%20bing.meta.js
// ==/UserScript==

jQuery('#sb_form_q').remove()
jQuery('#sb_form_go').remove()
jQuery('.sw_sform').remove()