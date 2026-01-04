// ==UserScript==
// @name         Purves.cc Advert Remover
// @namespace    http://necrosis.tech
// @version      0.2
// @description  remove stupid purves advert modal
// @run-at document-end
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @author       Nulled(Nulled#1337)
// @match       *://purves.cc/beta_tools/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394083/Purvescc%20Advert%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/394083/Purvescc%20Advert%20Remover.meta.js
// ==/UserScript==

setTimeout(function()
{
    jQuery("#advertiseModal").remove()
}, 2000);