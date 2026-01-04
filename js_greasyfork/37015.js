// ==UserScript==
// @name     	Rename Facebook Browser Tab
// @include 	https://*.facebook.com/*
// @version  	1
// @grant    	none
// @description	Renames any Facebook browser tab, to remove the number of unread notifications in '()'
// @namespace https://greasyfork.org/users/165492
// @downloadURL https://update.greasyfork.org/scripts/37015/Rename%20Facebook%20Browser%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/37015/Rename%20Facebook%20Browser%20Tab.meta.js
// ==/UserScript==

var target = document.querySelector('title');
var config = { attributes: true, childList: true, characterData: true }
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        console.log(mutation.type);
      	observer.disconnect();
        document.title="Facebook"
        observer.observe(target, config);
        console.log("Title Changed");
    });
});
observer.observe(target, config);