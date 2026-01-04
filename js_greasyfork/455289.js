// ==UserScript==
// @name         Nagwa Locked Content Shower
// @namespace    http://aviparshan.com/
// @version      1.0.1.3
// @description  Shows the locked content on Nagwa (math and science content)
// @author       avipars
// @include      *://nagwa.com/*
// @include      *://*.nagwa.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455289/Nagwa%20Locked%20Content%20Shower.user.js
// @updateURL https://update.greasyfork.org/scripts/455289/Nagwa%20Locked%20Content%20Shower.meta.js
// ==/UserScript==

var collection = document.querySelector('div[class*="not-available"]'); //match any class that is locked
for (let i = collection.classList.length - 1; i >= 0; i--) { //iteratre through results
    const className = collection.classList[i]; //save current element in variable
    if (className.startsWith('not-available')) { //verify if it is a match
        collection.classList.remove(className); //remove the lock
	   collection.classList.add("theorem"); //add the theorem div class
    }
}