// ==UserScript==
// @name         Asana Dynamic Favicon
// @namespace    AsanaDynamicFavicon
// @version      1.0.3
// @description  This modern Asana Inbox favicon notification displays an orange notification circle (just like Asana does in the app) to the top right of the Asana favicon when your active Organization/Workspace Inbox has any unread items. Enjoy!
// @author       Joe Thomas
// @match        https://app.asana.com/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/29414/Asana%20Dynamic%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/29414/Asana%20Dynamic%20Favicon.meta.js
// ==/UserScript==

(function() {
    // Change the favicon.
    function updateFavicon(unread) {
        var readIcon = "data:image/png;base64,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";
        var unreadIcon = "data:image/png;base64,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";

    	if(this.lastState != unread) { // Do not change the icon if not necessary.
            var faviconLink = document.evaluate("//link[@rel='shortcut icon']", document, null, XPathResult.ANY_TYPE, null).iterateNext();
            faviconLink.href = unread ? unreadIcon : readIcon;
			document.head.appendChild(faviconLink); // Firefox
            this.lastState = unread;
        }
    }
    
    // Check read count and update favicon if necessary.
    function updateRead(title) {
        var unread = title.indexOf("●") == 0;
        updateFavicon(unread);
    }
    
    // Observe any change in the <title> content, checking for the unread notification character.
    function install() {
        var titleNode = document.querySelector('head > title');
        this.observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                var newTitle = mutation.target.textContent;
	            updateRead(newTitle);
            });
        });
        observer.observe(titleNode, { subtree: true, characterData: true, childList: true });
        updateRead(document.title); // Ensure it's up to date before first event.
    }
    
    install();
})();