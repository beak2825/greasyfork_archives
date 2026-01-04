// ==UserScript==
// @name         Automatically click on Twitter's "Following" tab
// @namespace    http://twitter.com/DuXtin
// @version      0.1
// @description  Automatically click on Twitter's "Following" tab after a couple of seconds.
// @author       DuXtin
// @match        https://twitter.com/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458597/Automatically%20click%20on%20Twitter%27s%20%22Following%22%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/458597/Automatically%20click%20on%20Twitter%27s%20%22Following%22%20tab.meta.js
// ==/UserScript==

setTimeout(function(){
    document.querySelector("div[data-testid=ScrollSnap-List]").childNodes[1].firstChild.click();
},2000);
