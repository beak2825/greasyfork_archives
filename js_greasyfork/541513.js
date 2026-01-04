// ==UserScript==
// Remove ReadOnly attribute
// version 1.0
// 2013-07-24
//
// --------------------------------------------------------------------
//
// This is a Greasemonkey user script.
//
// To install, you need Greasemonkey: http://greasemonkey.mozdev.org/
// Then restart Firefox and revisit this script.
// Under Tools, there will be a new menu item to "Install User Script".
// Accept the default configuration and install.
// If you want, you can configure the Included and Excluded pages in
//  the GreaseMonkey configuration.
//
// To uninstall, go to Tools/Manage User Scripts,
// select "Allow Password Remembering", and click Uninstall.
//
// --------------------------------------------------------------------
//
// WHAT IT DOES:
// Sites can direct the browser not to save some password fields (for
//  increased security). They do it by tagging the password field with
//  autocomplete="off", in the HTML. "Allow Password Remembering" removes
//  these tags, so that the user can decide which password the browser
//  should save.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name            Remove ReadOnly attribute
// @namespace       http://dgnet.rg3.net
// @description     Removes readonly="ANY" attributes
// @grant       GM_getValue
// @grant       GM_setValue
// @version      0.1
// @author       fatih duran
// @match         https://*/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.tr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541513/Remove%20ReadOnly%20attribute.user.js
// @updateURL https://update.greasyfork.org/scripts/541513/Remove%20ReadOnly%20attribute.meta.js
// ==/UserScript==

var removeReadOnly = function(element) {

    var iAttrCount = element.attributes.length;
    for (var i = 0; i < iAttrCount; i++) {
	var oAttr = element.attributes[i];
	if (oAttr.name == 'readonly') {
	    element.removeAttribute('readonly');
	    break;
	}
    }


    for (i = 0; i < iAttrCount; i++) {
	oAttr = element.attributes[i];
	if (oAttr.name == 'autocomplete') {
	    element.removeAttribute('autocomplete');
	    break;
	}
    }


}

var forms = document.getElementsByTagName('form');
for (var i = 0; i < forms.length; i++)
{
    var form = forms[i];
    var elements = form.elements;

    removeReadOnly(form);

    for (var j = 0; j < elements.length; j++)
    {
        removeReadOnly(elements[j]);
    }
}