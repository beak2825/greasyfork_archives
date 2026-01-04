// ==UserScript==
// @name Hide Casino
// @namespace http://cocainefinger.evilbunnyejuice.com/
// @version 0.4
// @description Hides Casino
// @author CocaineFinger [1952642]
// @icon http://files.shroomery.org/smileys/happyweed.gif
// @match http://www.torn.com/*
// @match https://www.torn.com/*
// @downloadURL https://update.greasyfork.org/scripts/33921/Hide%20Casino.user.js
// @updateURL https://update.greasyfork.org/scripts/33921/Hide%20Casino.meta.js
// ==/UserScript==
$(document).ready(function(){$('#nav-casino').hide();}); //Hides Casino
