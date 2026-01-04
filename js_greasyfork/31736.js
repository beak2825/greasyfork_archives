// ==UserScript==
// @name		LinkedIn - Hide Invite-only Email Contacts in People You May Know
// @version		1.2.0
// @description	Hides the fake email-only contact cards to "Invite" which are mixed in with real profiles you can "Connect" to for LinkedIn.com - My Network - "People You May Know". NOTE: If you don't see more contacts loading at the end, you need to zoom or resize window so that you can scroll downwards to trigger it the first time. By Dan Moorehead (dan@PowerAccessDB.com), PowerAccess™ Framework for MS Access (https://www.PowerAccessDB.com/PowerAccess-Framework-MS-Access) and Visual3D Game Engine founder.
// @author		Dan Moorehead (dan@PowerAccessDB.com), PowerAccess™ Framework for MS Access (https://www.PowerAccessDB.com/PowerAccess-Framework-MS-Access) and Visual3D Game Engine (https://www.PowerAccessDB.com/Visual3D-Game-Engine) founder
// @copyright	© 2017 Dan Moorehead (dan@PowerAccessDB.com), PowerAccess™ Framework for MS Access (https://www.PowerAccessDB.com/PowerAccess-Framework-MS-Access) and Visual3D Game Engine (https://www.PowerAccessDB.com/Visual3D-Game-Engine) founder
// @include		http*://*linkedin.com/mynetwork*
// @namespace	https://www.PowerAccessDB.com/
// @homepage	https://www.PowerAccessDB.com/PowerAccess-Framework-MS-Access
// @supportURL	https://greasyfork.org/en/scripts/31736-linkedin-hide-invite-only-email-contacts-in-people-you-may-know
// @require		https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @icon		data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAFXRFWHRDcmVhdGlvbiBUaW1lADYvMjQvMDn2wWvjAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M0BrLToAAAAY9QTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWJ+8Upq2DFJ4BklsVJu4CU1zCU5zTpWyV5+7DlN4B0twB0tvCU50C1mEC1+NDFF3DGWWDmSRD2iYEFV5EmuaE1d7FGeTFVp9FWGKFW2cGFyAGHCeGmCDG3OgHWKFHnWiIGSHIXikI2iLJHumJmuNKG6PKH2oK3CSK4CrLnSVLoOtL2iDMHaXMYavM3maNHOQNIixNXaUNnycN4uzOX6eOX+fOo21O3SLPIKiPY2yPY2zPZC3PoqtP4WkP42xQJO5QoinQ5W7RYuqRpi9SIOfSI+sSZu/S5KvS5OwTJ3BTpe6T6DDUYGXUpq2UqPFVZy5VabHV566WKjJWafHW4eaW6vLXaHAYa7NYqC+Yq3MY6LBZ6K9aq7Kbq3Hc7LMdJindbjTgbTLhL/VicDXi6u5j8TZornErL7GuMbNxdDVy9ng1dzg19fX2tra3Nzc3ODh3t7e5ubm6Ojo6urq7e3t7+/v8fHx9PT09vb2+fn5+/v7/f39/////8EcrgAAABN0Uk5TAAEFBgcSFxiGh4+a1Nra4+Pm6f7wNSIAAAFdSURBVDjLrZM7T8NAEIS/tTfOA0hogIqHgJKWv4BA8HNB/AsaKjoEgoKHCDKKbdZ3RxEHUHKWKJhmdJrRzu7enQC93gkxXJYlCCyfjjpJRPf2fvGB0D9b84WPGJJ+8nxeKNlqUUUTnHVXsyLleDAJIRRPuaZhDnW2fqNM62/sk78tFCk8iisBhjB8WUxxKN4DCBDp1KM4B5CPeHeRRlEsA7iLDoKhOA/wBKxjb9Dv5TVkK+mswtRwBFyxfQj5+KAPk4fXrDHU9azJGhPobAEs7ZUFUJPgzcxMRMTsVkQGIiIiumtm9jOFAG5Kk1t2BtBxTYSfN4wfGS7BwDV7WDBcw93W9IhHCfMGB+OGCfOrnm18xv5PhkjEN/t/iXDpz+X/JjzgEDYz2vF5r3hLW3XnUSYjazVojlIVibTowSpUSs1Eol8vhKoUSVLpdOMlQmXBKTRvqgUiItKqhhC+ALfVx6MKijHaAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/31736/LinkedIn%20-%20Hide%20Invite-only%20Email%20Contacts%20in%20People%20You%20May%20Know.user.js
// @updateURL https://update.greasyfork.org/scripts/31736/LinkedIn%20-%20Hide%20Invite-only%20Email%20Contacts%20in%20People%20You%20May%20Know.meta.js
// ==/UserScript==


$(function () {

	//enable strict syntax mode for this function
	'use strict';

	var selector = 'div.mn-person-info--card > div.pt3';
	var listSelector = 'ul.mn-pymk-list__cards';

	// LinkedIn People You May Know DOM structure:
	//	ul.mn-pymk-list__cards > li.mn-pymk-list__card.display-flex.flex-column
	//		> div.mn-person-info.mn-person-info--card.ember-view
	//			>  a.pt3 (for existing Profiles to Connect to) OR
	//		OR 	> div.pt3 (for emails to Invite)

	//nonContactIndicators is a node list of contact's child's children for contacts to remove
	function removeContacts(nonContactIndicators) {
		nonContactIndicators.parent().parent().remove();
	}

	//hookup so will remove any email-only contacts which get delay/auto-loaded in the background

	//create alias of MutationObserver class for whatever browser-specific class name is
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver ;

	//create observer to handle new elements being added later
	var config = { childList: true, characterData: false, attributes: false, subtree: true };
	var observer = new MutationObserver( function (mutations) {
		mutations.forEach( function (mutation) {
			if (mutation.addedNodes) {
				removeContacts( $(mutation.addedNodes).find(selector).addBack(selector) );
			}
		});
	});

	//find the ul contact list items parent and watch for delayed loading/inserting of more contacts as you scroll downwards
	$(listSelector).each( function () { observer.observe(this, config); } );

	//MAYBE: If list ul gets delay loaded too, can check if list not found yet (via listSelector), and, if not, observe for entire document and add the item observer to any dynamically inserted list

	//now remove any invite-only / email-only / non-existent contacts that were loaded originally, instead of delay-inserted
	removeContacts( $(selector) );
});