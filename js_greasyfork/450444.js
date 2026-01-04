// ==UserScript==
// @name         Giphy unfucker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Gets you the actual Giphy source file
// @author       You
// @match        https://giphy.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=giphy.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant        none
// @license GNU
// @downloadURL https://update.greasyfork.org/scripts/450444/Giphy%20unfucker.user.js
// @updateURL https://update.greasyfork.org/scripts/450444/Giphy%20unfucker.meta.js
// ==/UserScript==

(function() {
    'use strict';
	 let lastUrl = location.href;
    if(lastUrl.indexOf('/gifs/') != -1)
    {
        setTimeout(function() {
            init();
        },1000);// need basic DOM to load, since bitbucket uses OnePAge application it needs time to load even with run at doc end
    }

    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            if(url.indexOf('/gifs/') != -1)
            {
                console.log("on branch tree");
                setTimeout(function() {
                    init();
                },1000);
            }
            console.log(`new url is ${lastUrl}`);
        }
    }).observe(document, {subtree: true, childList: true});
  
})();
function init() {
	$("[class ^= 'Navigation-sc'] > [class ^= 'Container-sc']").append(`
	<div>
	    <button type="button" id="downloadImage"> Download the gif >:3 </button>
    </div>
	`);
    // Your code here...
	registerEvents();
}
function getImageSrc() {
    var vidlink = window.location.href;
	vidlink = vidlink.slice(vidlink.lastIndexOf('-') + 1 );
	open(`https://i.giphy.com/${vidlink}.gif`, "newwindow");
	console.log(vidlink);
}

function registerEvents() {
    $("#downloadImage").on("click", function() {
		getImageSrc();
	});
}