// ==UserScript==
// @name         Notion Mlemedia
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  "try to take over the world!"
// @author       David P
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @match        https://mlemedia.notion.site/*
// @match        https://www.notion.so/*
// @resource        YOUR_CSS  https://raw.githubusercontent.com/dpitch/mlemedia/main/mlemedia_notion.css
// @grant           GM_addStyle
// @grant           GM_getResourceText



// @downloadURL https://update.greasyfork.org/scripts/466847/Notion%20Mlemedia.user.js
// @updateURL https://update.greasyfork.org/scripts/466847/Notion%20Mlemedia.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var cssTxt = GM_getResourceText ("YOUR_CSS");
    GM_addStyle (cssTxt);

      setInterval(function() {

$('div.whenContentEditable>div:nth-child(3)>div>div:nth-child(2)>div>div>div>div>div>div:nth-child(1)>div:nth-child(1)>div>div:nth-child(2)>div>div>div>div>div').each(function() {

     if ($(this).text().trim() === 'Infos') {

/* Cacher les items qui ne servent à rien pour info  */
/* Selectionne les items de la database du 2eme à l'avant-avant dernier  */
var numDivs = $("div.whenContentEditable>div:nth-child(3)>div>div:nth-child(2)>div>div:nth-child(1)>div>div>div>div:nth-child(1)>div").length;
$("div.whenContentEditable>div:nth-child(3)>div>div:nth-child(2)>div>div:nth-child(1)>div>div>div>div:nth-child(1)>div:gt(" + (numDivs - 2,numDivs - 3) + ")").addClass('show');
$("div.whenContentEditable>div:nth-child(3)>div>div:nth-child(2)>div>div:nth-child(1)>div>div>div>div:nth-child(1)>div:gt(" + (1) + "):lt(" + (-2) + ")").addClass('hide');


      }
	});




    }, 250);








})();