// ==UserScript==
// @name         Google Translate Icon Auto Click

// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a feature that adds a shortcut key that auto-clicks the Google Translate extension icon on Chrome browsers for the quick and better language learning experience.

// @author       You
// @match        http://*/*
// @match        https://*/*

// @require      https://cdn.jsdelivr.net/npm/alertifyjs@1.11.1/build/alertify.min.js
// @resource     alertify.min.css  https://cdn.jsdelivr.net/npm/alertifyjs@1.11.1/build/css/alertify.min.css
// @resource     default.min.css  https://cdn.jsdelivr.net/npm/alertifyjs@1.11.1/build/css/themes/default.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText

// @require      https://unpkg.com/url-parse@1.5.1/dist/url-parse.js
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js


// @run-at       document-idle
// @noframes

// @license mit
// @downloadURL https://update.greasyfork.org/scripts/456659/Google%20Translate%20Icon%20Auto%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/456659/Google%20Translate%20Icon%20Auto%20Click.meta.js
// ==/UserScript==


function waitForElm(selector) { // wait for element
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function getSelectionText() {

    var text = "";
    if(window.location.hostname == "docs.google.com")
	{
    	var googleDocument = googleDocsUtil.getGoogleDocument();
    	text = googleDocument.selectedText;
	}
    else
    {
    	if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }
    }

    return text.trim();
}

// alt + double click to auto click google translate icon

document.addEventListener('dblclick', async function(e){
    var searchWord = getSelectionText()
    if(searchWord != "")
    {
        if (e.altKey)
        {
            await waitForElm('#gtx-trans');
            document.querySelector('#gtx-trans').click()
        }
    }
})
