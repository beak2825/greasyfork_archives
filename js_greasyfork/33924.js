// ==UserScript==
// @name Hide Casino
// @namespace Revis290
// @version 1.1
// @description Hides Casino
// @author Revis290
// @icon http://files.shroomery.org/smileys/happyweed.gif
// @match https://www.torn.com/casino.php*
// @match http://www.torn.com/casino.php*
// @downloadURL https://update.greasyfork.org/scripts/33924/Hide%20Casino.user.js
// @updateURL https://update.greasyfork.org/scripts/33924/Hide%20Casino.meta.js
// ==/UserScript==
$(document).ready(function(){$('#mainContainer').hide();});