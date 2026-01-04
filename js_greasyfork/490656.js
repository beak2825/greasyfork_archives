// ==UserScript==
// @name         AO3: [Wrangling] Add links filtered results on Syn tags
// @description  in a landing page of a tag that's already a synonim of a canonical tag this script will add a button/link that will direct you to the works on the canonical tag with the applied filter 'Other tags to include', so it will show only the works tagged with the synonim. Same thing will happen in the edit page, it will simply add a link in the navigation menu on the left
// @author       roissy
// @version      1.4
// @match        *://*.archiveofourown.org/tags/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1278384
// @downloadURL https://update.greasyfork.org/scripts/490656/AO3%3A%20%5BWrangling%5D%20Add%20links%20filtered%20results%20on%20Syn%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/490656/AO3%3A%20%5BWrangling%5D%20Add%20links%20filtered%20results%20on%20Syn%20tags.meta.js
// ==/UserScript==

(function() {
    'use strict';

//tag landing page
if (document.getElementsByClassName('merger').length > 0) {
	var CanonicalTagLanding = document.querySelector('.merger a.tag').innerHTML;
	var SynTagLanding = document.querySelector('h2.heading').innerHTML;
	var FilteredUrlLanding = "https://archiveofourown.org/works?commit=Sort+and+Filter&work_search%5Bother_tag_names="+ encodeURIComponent(SynTagLanding) +"&tag_id=" + encodeURIComponent(CanonicalTagLanding);
	//adds a button
	var navigationElementLanding = document.querySelector('.tag [role="navigation"]');
	navigationElementLanding.innerHTML = '<li><a href="'+ FilteredUrlLanding + '">Filtered Works</a></li>' + navigationElementLanding.innerHTML;
}
//edit page
else if (document.getElementsByClassName('tags-edit').length > 0) {

    var CanonicalTagEdit = document.getElementById("tag_syn_string") ? document.getElementById("tag_syn_string").value : "";
      //(thanks escctrl for the correction here)
    if (CanonicalTagEdit != ""){
	    var SynTagEdit = document.getElementById('tag_name').value;
		var FilteredUrlEdit = "https://archiveofourown.org/works?commit=Sort+and+Filter&work_search%5Bother_tag_names="+ encodeURIComponent(SynTagEdit) +"&tag_id=" + encodeURIComponent(CanonicalTagEdit);
		//adds a link to the menu on the left
		var navigationElementEdit = document.querySelectorAll("div.tag.wrangling ul.navigation")[1];
		navigationElementEdit.innerHTML = navigationElementEdit.innerHTML + '<li><a href="'+ FilteredUrlEdit + '">Filtered Works</a></li>';
	}
}


})();


