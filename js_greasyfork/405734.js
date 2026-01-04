// ==UserScript==
// @name         Youtube livestream comment bot
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  This is a spam bot for youtube livestreams. You can change the @match to whatever url you want...
// @author       joldboy69
// @match        https://www.youtube.com/watch?v=jG6fg8csDM4
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405734/Youtube%20livestream%20comment%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/405734/Youtube%20livestream%20comment%20bot.meta.js
// ==/UserScript==

/*
I was a little lazy making this script so you will need to follow a few instructions to set this up.
First, you will need to go to the youtube livestream you want to bot and change the match to your livestream url.
Next, since there are multiple buttons on the page with the id of "button", you will need to manually change the submit button to post your reply to "mybutton" (or whatever you want the new id to be).
You can do this by hovering your mouse over the submit button (it looks like a paper airplane) and right clicking on it and clicking "inspect".
Now that you are in the html editor, you need to right click the object that contains the submit button's id and click "edit as html". Then change the id to "mybutton" (or whatever you want to call it but you will have to change the code below as well) and then save it.
Now that you have done all of that, you should be able to comment bot as long as you are signed in to a youtube account. Enjoy and use wisely.
*/


(function() {
    'use strict';
    setTimeout (function() {

    var a = prompt("Enter the comment to make: ");
    },20000);

    setInterval (function() {
        document.querySelector("div#input").textContent=a;
        document.querySelector("div#input").dispatchEvent(new Event('input',{bubles:true,cancelable:true}));
        document.getElementById("mybutton").click();
    },5000);

})();