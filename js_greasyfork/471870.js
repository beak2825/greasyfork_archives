// ==UserScript==
// @name         x-away
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  replace the X logo with the twitter logo
// @author       rowleto
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @license      MIT 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471870/x-away.user.js
// @updateURL https://update.greasyfork.org/scripts/471870/x-away.meta.js
// ==/UserScript==

(function() {
    //replace images
    function replace() {
        
        if (document.getElementsByClassName("r-1nao33i r-4qtqp9 r-yyyyoo r-16y2uox r-8kz0gk r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-lrsllp").length > 0) {
            console.log("replaced");
            document.getElementsByClassName("r-1nao33i r-4qtqp9 r-yyyyoo r-16y2uox r-8kz0gk r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-lrsllp")[0].innerHTML = `<style type="text/css">
	.st0{display:none;}
	.st1{display:inline;}
	.st2{fill:#1D9BF0;}
</style>
<g class="st0">
	<path class="st1" d="M18.2,2.2h3.3l-7.2,8.3l8.5,11.2h-6.7L11,14.9l-6,6.8H1.7l7.7-8.8L1.3,2.2h6.8l4.7,6.2L18.2,2.2z M17.1,19.8
		h1.8L7.1,4.1h-2L17.1,19.8z"/>
</g>
<path class="st2" d="M21.6,7.1c0,0.2,0,0.4,0,0.6c0,6.5-5,14-14,14v0c-2.7,0-5.3-0.8-7.5-2.2c0.4,0,0.8,0.1,1.2,0.1
	c2.2,0,4.4-0.7,6.1-2.1c-2.1,0-4-1.4-4.6-3.4C3.5,14.2,4.2,14.2,5,14C2.7,13.5,1,11.5,1,9.2V9.1c0.7,0.4,1.5,0.6,2.2,0.6
	C1.1,8.3,0.4,5.4,1.7,3.1c2.5,3.1,6.2,4.9,10.1,5.1c-0.4-1.7,0.1-3.5,1.4-4.7c2-1.9,5.1-1.8,7,0.2c1.1-0.2,2.2-0.6,3.1-1.2
	c-0.4,1.1-1.1,2.1-2.2,2.7c1-0.1,1.9-0.4,2.8-0.8C23.4,5.5,22.5,6.4,21.6,7.1z"/>`;
            //replace favicon
            let icon = document.createElement('link');
            icon.rel = 'icon';
            document.head.appendChild(icon);
            icon.href = "https://abs.twimg.com/favicons/twitter.2.ico";
            clearInterval(interval);
            //replace legal notice
            document.getElementsByClassName("css-901oao r-1bwzh9t r-37j5jr r-n6v787 r-16dba41 r-1cwl3u0 r-hrzydr r-bcqeeo r-j2kj52 r-qvutc0")[5].children[0].innerText = "© 2023 Twitter Inc.";
            return;
        }
    }
    //replace website title
    function replacetitle() {
        if(lasttitle == document.title) return;
        document.title = document.title.replace("X", "Twitter");
        lasttitle = document.title;
    }
    'use strict';



    // Your code here...
    var lasttitle = "";
    var interval = setInterval(replace, 100);
    var secinterval = setInterval(replacetitle, 100);



})();