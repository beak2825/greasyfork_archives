// ==UserScript==
// @name Hide Casino
// @namespace Revis290
// @version 1.0
// @description Hides Casino
// @author Revis290
// @icon http://files.shroomery.org/smileys/happyweed.gif
// @match http://www.torn.com/*
// @match https://www.torn.com/*
// @downloadURL https://update.greasyfork.org/scripts/33923/Hide%20Casino.user.js
// @updateURL https://update.greasyfork.org/scripts/33923/Hide%20Casino.meta.js
// ==/UserScript==
$(document).ready(function(){$('#nav-casino').hide();}); //Hides Casino
$(document).ready(function(){$('#mainContainer').hide();});