// ==UserScript==
// @name        ClassicAllHITsLink
// @description Changes All HITs link back to the classic search results.
//              All HITs link will go to https://worker.mturk.com/projects?filters[qualified]=false&filters[masters]=false&sort=num_hits_desc&filters[min_reward]=0
// @namespace   https://greasyfork.org/en/users/6503-turk05022014
// @match       https://worker.mturk.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @version     1.0.20180113
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/37597/ClassicAllHITsLink.user.js
// @updateURL https://update.greasyfork.org/scripts/37597/ClassicAllHITsLink.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
var newURL = "https://worker.mturk.com/projects?filters[qualified]=false&filters[masters]=false&sort=num_hits_desc&filters[min_reward]=0";
$(function (){
	var allHits = $('a.nav-link:contains("All HITs")');
	allHits.attr('href', newURL);
});