// ==UserScript==
// @name         Munzee Map Remove Alert
// @namespace    MOBlox
// @version      1.0
// @description  Remove Message on Munzee Map.
// @author       MOBlox
// @match        https://www.munzee.com/map
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372757/Munzee%20Map%20Remove%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/372757/Munzee%20Map%20Remove%20Alert.meta.js
// ==/UserScript==
$('div.alert:contains(Dear Munzee players)').hide();