// ==UserScript==
// @name         Auto Click Play Button in thewatchseries
// @namespace    Auto Click Play Button in thewatchseries
// @version      0.1
// @description  Auto Click Play Button in thewatchseries!
// @author       jscriptjunkie
// @match        http://thewatchseries.to/cale.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14499/Auto%20Click%20Play%20Button%20in%20thewatchseries.user.js
// @updateURL https://update.greasyfork.org/scripts/14499/Auto%20Click%20Play%20Button%20in%20thewatchseries.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

window.location.href = $('.push_button.blue').attr('href');