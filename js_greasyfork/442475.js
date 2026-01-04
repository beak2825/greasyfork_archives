// ==UserScript==
// @name         "My Computer is Broken" April Fool's Prank
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Epic April Fool's Day Prank for students. Run this script and tell your teacher that your laptop is broken. Press space to reveal.
// @author       GKRPLAYZ
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442475/%22My%20Computer%20is%20Broken%22%20April%20Fool%27s%20Prank.user.js
// @updateURL https://update.greasyfork.org/scripts/442475/%22My%20Computer%20is%20Broken%22%20April%20Fool%27s%20Prank.meta.js
// ==/UserScript==

(function() {
    document.body.innerHTML="<h1>404 Error. Page not found.</h1>";
    document.title="404 Error. Page not found.";
    var fool=setInterval(
        function () {
            var color=Math.floor(Math.random()*16777215).toString(16);
            document.body.style.backgroundColor="#"+color;
            document.body.onkeydown=function(){
                clearInterval(fool);
                document.title="April Fool's Day!";
                document.body.style.backgroundColor="orange";
                document.body.innerHTML="";
                document.body.style.backgroundImage="url('https://www.idomavoice.com/wp-content/uploads/2022/03/Origin-of-April-Fools-Day-1.jpeg')";
            };
        },0.0000000000000000000000000000000000000000000001);
})();