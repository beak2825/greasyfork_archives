// ==UserScript==
// @name       jawz Huey Antley
// @version    1.0
// @author	   jawz
// @description  na
// @match      https://s3.amazonaws.com/mturk_bulk/hits/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/12296/jawz%20Huey%20Antley.user.js
// @updateURL https://update.greasyfork.org/scripts/12296/jawz%20Huey%20Antley.meta.js
// ==/UserScript==

console.log($('div:has(img)'));
$('section').eq(1).css({'left': '0px', 'position': 'absolute'});
$('div:has(img)').css({'height': '220px', 'width':'2500px', 'position': 'relative', 'left': '0px'});
$('img[alt=image1]').css({'height': '200px'});