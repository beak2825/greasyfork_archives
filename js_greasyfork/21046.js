// ==UserScript==
// @name           Flickr Friends/Family and Non-Reciprocal Contacts Finder
// @namespace      http://www.flickr.com/photos/carve/
// @description    Find out which of your Flickr contacts has not added you back.
// @include        *.flickr.com/people/*/contacts/
// @include        *.flickr.com/people/*/contacts
// @include        *.flickr.com/people/*/contacts/?page=*
// @include        *.flickr.com/people/*/contacts/by-*/
// @include        *.flickr.com/people/*/contacts/by-*
// @include        *.flickr.com/people/*/contacts/by-*/?page=*
// @include        *.flickr.com/people/*/contacts/?page=*
// @include        *.flickr.com/people/*/contacts/by-*/
// @include        *.flickr.com/people/*/contacts/by-*
// @include        *.flickr.com/people/*/contacts/by-*/?page=*
// @include        *.flickr.com/people/*/contacts/rev/?page=*
// @include        *.flickr.com/people/*/contacts/rev/
// @include        *.flickr.com/people/*/contacts/friends/
// @include        *.flickr.com/people/*/contacts/friends
// @include        *.flickr.com/people/*/contacts/friends/?page=*
// @include        *.flickr.com/people/*/contacts/family/?page=*
// @include        *.flickr.com/people/*/contacts/family/
// @include        *.flickr.com/people/*/contacts/family
// @include        *.flickr.com/people/*/contacts/both/
// @include        *.flickr.com/people/*/contacts/both
// @include        *.flickr.com/people/*/contacts/both/?page=*
// @grant          none
// @version 0.02 beta
// @downloadURL https://update.greasyfork.org/scripts/21046/Flickr%20FriendsFamily%20and%20Non-Reciprocal%20Contacts%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/21046/Flickr%20FriendsFamily%20and%20Non-Reciprocal%20Contacts%20Finder.meta.js
// ==/UserScript==
//

// 
// This is the very first version of this script. It is still in the testing phase and may generate
// false positives. Please use it at your own risk, as there may be bugs.

(function() {
	snapIcons = document.evaluate("//td[@class='contact-list-bicon']/a/img[@class='BuddyIconX']",
		document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	
	if (snapIcons.snapshotLength == 0) {
		snapIcons = document.evaluate("//td[@class='contact-list-bicon contact-list-sorted']/a/img[@class='BuddyIconX']",
			document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	}
		
	if (snapIcons.snapshotLength == 0) {
		return;
	}
		
	for (var i = snapIcons.snapshotLength - 1; i >= 0; i--) {
		var thisIcon = snapIcons.snapshotItem(i);
		var matchNSID = /([a-zA-Z0-9]+@[A-Z0-9]+)/;
		var matches = matchNSID.exec(thisIcon.src);
		if (matches[1]) {
			var listener = {
				flickr_people_getInfo_onLoad: function(success, responseXML, responseText, params) {
					if (success) {
						var rsp = responseText.replace(/jsonFlickrApi\(/,'');
						rsp = eval('('+rsp);
						if (rsp.stat == 'ok') {
							if (
								rsp.person.revcontact == 0 &&
								rsp.person.revfriend == 0 && 
								rsp.person.revfamily == 0
							) {
								snapUnames = document.evaluate("//td[@class='contact-list-name']/a/text()",
									document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
								
								if (snapUnames.snapshotLength == 0) {
									snapUnames = document.evaluate("//td[@class='contact-list-name contact-list-sorted']/a/text()",
										document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
								}
								
								for (j = 0; j < snapUnames.snapshotLength; j++) {
									if (snapUnames.snapshotItem(j).nodeValue == rsp.person.username._content) {
										snapUnames.snapshotItem(j).parentNode.style.color = 'red';
									}
								}
							}
							
							if (
								//rsp.person.revcontact == 0 ||
								rsp.person.revfriend == 1 
								//rsp.person.revfamily == 0
							) {
								snapUnames = document.evaluate("//td[@class='contact-list-name']/a/text()",
									document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
								
								if (snapUnames.snapshotLength == 0) {
									snapUnames = document.evaluate("//td[@class='contact-list-name contact-list-sorted']/a/text()",
										document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
								}
								
								for (j = 0; j < snapUnames.snapshotLength; j++) {
									if (snapUnames.snapshotItem(j).nodeValue == rsp.person.username._content) {
										snapUnames.snapshotItem(j).parentNode.style.color = 'green';
									}
								}
							}
							
							
							
							if (
								//rsp.person.revcontact == 0 ||
								//rsp.person.revfriend == 0 || 
								rsp.person.revfamily == 1
							) {
								snapUnames = document.evaluate("//td[@class='contact-list-name']/a/text()",
									document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
								
								if (snapUnames.snapshotLength == 0) {
									snapUnames = document.evaluate("//td[@class='contact-list-name contact-list-sorted']/a/text()",
										document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
								}
								
								for (j = 0; j < snapUnames.snapshotLength; j++) {
									if (snapUnames.snapshotItem(j).nodeValue == rsp.person.username._content) {
										snapUnames.snapshotItem(j).parentNode.style.color = 'purple';
									}
								}
							}
							
						}
					}
				}
			};
			var f = function() {
				try {
					unsafeWindow.F.API.callMethod(
						'flickr.people.getInfo',
						{
							user_id: matches[1],
							format: 'json'
						},
						listener
					);
				}
				catch (err) {
					setTimeout(f, 1000);
				}
			};
			f();
		}
	}
})()
