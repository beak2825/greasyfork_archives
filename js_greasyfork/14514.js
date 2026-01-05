// ==UserScript==
// @name         QuickBase - Linkify Revs from a TR
// @icon         http://i.imgur.com/ujKcGbO.jpg
// @namespace    skoshy.com
// @version      0.10.1
// @description  Allows linkifying revisions in a TR on QuickBase. Predominantly created for NxJ.
// @author       Stefan Koshy
// @match        https://nextjump.quickbase.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14514/QuickBase%20-%20Linkify%20Revs%20from%20a%20TR.user.js
// @updateURL https://update.greasyfork.org/scripts/14514/QuickBase%20-%20Linkify%20Revs%20from%20a%20TR.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// URL parts for Trac
var codebaseURL = {
	'empire': {
		1: 'https://phabricator.nextjump.com/R1:',
		2: '',
	},
	'empirebranches': {
		1: 'https://phabricator.nextjump.com/R2:',
		2: '',
	},
	'jobs': {
		1: 'https://phabricator.nextjump.com/R3:',
		2: '',
	},
	'mercury': {
		1: 'https://phabricator.nextjump.com/R4:',
		2: '',
	},
	'db_stored_procs': {
		1: 'https://phabricator.nextjump.com/R6:',
		2: '',
	},
	'platform8': {
		1: 'https://phabricator.nextjump.com/R7:',
		2: '',
	},
	'keystone': {
		1: 'https://phabricator.nextjump.com/R8:',
		2: '',
	},
}

// Get certain elements on the QuickBase page
var revsList = findRevsList();

// Restrict this script to only run if we're on a TR page
if (
     revsList !== null
	 && document.getElementById('saveButton') === null // prevents this getting triggered when editing/creating a TR
   ) {
    console.log(revsList);
	start();
}

function findRevsList() {
	var els = document.querySelectorAll('b');
	
	for (var i = 0; i < els.length; i++) {
		if (els[i].textContent == 'Comma Sep Rev List (No Spaces)') {
			// this is the field, let's get the revs
			var parent = els[i].parentNode;
			while(parent.tagName !== 'HTML') {
				if (parent.tagName == 'TD') {
					// found it, get the sibling and return
					return parent.nextElementSibling;
				}
				
				// else, keep traversing up
				parent = parent.parentNode;
			}
		}
	}
	
	return null;
}

function start() {
    // We're gonna save the original text in the revisions box for later
    var originalRevsText = revsList.innerHTML.trim();
    
    // Now let's get each revision number and create an array of them
    var revs = revsList.innerHTML.replace(/[^\d,]/g, '');
    revs = revs.split(',');
    
    // Holder array for each of the linkified revs we're gonna make
    var linkArray = [];
	var linkCat = [];
    
    // Loop through each rev
    for (var i = 0; i < revs.length; i++) {
        // Ensure this array entry isn't blank
        if (revs[i] !== '') {
            // determine which URL to use.
			linkCat[i] = 'empire';
			if (revs[i] < 10000) {
				linkCat[i] = 'jobs';
			}
			
			// Linkify and add it to the link holder array
            linkArray.push('<a class="rev-link" data-rev="'+revs[i]+'" data-rev-type="'+linkCat[i]+'" target="_blank" href="'+codebaseURL[linkCat[i]][1]+revs[i]+codebaseURL[linkCat[i]][2]+'">'+revs[i]+'</a>');
		}
    }
    
    // Determine if we need to create a "Open All Revs" link
    var show_allRevsLink = false;
    if (linkArray.length > 1) {
        show_allRevsLink = true;
        linkArray.push('&nbsp;&nbsp;<span style="color: red; cursor: pointer; text-decoration: underline;" class="all-revs-link">Open all Revs</span>');
    }
    
    // If the original text that was in the revision box had extra content besides just the revision numbers, let's display it for the user
    if (originalRevsText != revs)
        linkArray.push('&nbsp;&nbsp;Original Text: '+originalRevsText);
		
	// tell the user what types of links we detected
	var linkTypeAll = '';
	for (i = 0; i < linkCat.length; i++) {
		if (linkTypeAll == '') {
			linkTypeAll = linkCat[i];
		} else if (linkTypeAll != linkCat[i]) {
			linkTypeAll = 'Mixed';
			break;
		}
	}
	
	// construct select box
	var codebaseURLKeys = Object.keys(codebaseURL);
	codebaseURLKeys.push('Mixed');
	var selectBoxOptions = [];
	for (i = 0; i < codebaseURLKeys.length; i++) {
		var selected = false;
		var suffix = '';
		
		// skip if the option is Mixed and the revs aren't mixed
		if (codebaseURLKeys[i] == 'Mixed' && linkTypeAll != 'Mixed') {
			continue;
		}
		
		if (codebaseURLKeys[i] == linkTypeAll) {
			selected = true;
			suffix = ' (auto-detected)';
		}
		selectBoxOptions.push({
			'key': codebaseURLKeys[i],
			'display': codebaseURLKeys[i] + suffix,
			'selected': selected
		});
	}
	
	linkArray.push('&nbsp;&nbsp;<span style="color: green;">Link Type: '+createSelectBox('linkTypeSelect', selectBoxOptions)+'</span>');
    
    // Update the revs box to show all the content we created
    revsList.innerHTML = linkArray.join(',');
	
	// Enable the selectbox
	document.querySelector('#linkTypeSelect').addEventListener('change', changeLinkTypeSelectBox);
    
    // Linkify the Open All Revs link if it exists
    if (show_allRevsLink === true)
        document.querySelector('.all-revs-link').addEventListener("click", allRevsLinkHandler);
}

function createSelectBox(id, options) {
	var html = '<select id="'+id+'">';
	
	for (var i = 0; i < options.length; i++) {
		html += '<option '+(options[i].selected ? 'selected' : '')+' value="'+options[i].key+'">'+options[i].display+'</option>';
	}
	
	html += '</select>';
	return html
}

function changeLinkTypeSelectBox(e) {
	var selectedOption = this.selectedOptions[0];
	var key = selectedOption.value;
	var allRevsLinks = document.querySelectorAll('.rev-link');
	
	// loop through all the revs and change their links
	for (var i = 0; i < allRevsLinks.length; i++) {
		var linkPart1;
		var linkPart2;
		
		if (key == 'Mixed') {
			linkPart1 = codebaseURL[allRevsLinks[i].getAttribute('data-rev-type')][1];
			linkPart2 = codebaseURL[allRevsLinks[i].getAttribute('data-rev-type')][2];
		} else {
			linkPart1 = codebaseURL[key][1];
			linkPart2 = codebaseURL[key][2];
		}
		
		allRevsLinks[i].href = linkPart1+allRevsLinks[i].getAttribute('data-rev')+linkPart2;
	}
	
	alert('Rev Links have been changed to "'+key+'" type');
}

function allRevsLinkHandler() {
    // Loop through each rev and open all of them in new tabs
    var allRevs = document.querySelectorAll('.rev-link');
    for (var i = 0; i < allRevs.length; i++) {
        window.open(allRevs[i].href, '_blank');
    }
}