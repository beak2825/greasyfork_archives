// ==UserScript==
// @name         MT script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *amazonaws*
//@include       *mturkcontent*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @downloadURL https://update.greasyfork.org/scripts/39625/MT%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39625/MT%20script.meta.js
// ==/UserScript==

if(!$('p:contains(Determine whether the image is a logo belonging to the insitution name listed)').eq(0)) return;
$('#Q1Valid').val("Yes");
afterPic($('a').eq(0), $('a').eq(0).attr('href'), 400);
