// ==UserScript==
// @name        ablink solve check
// @license      opensource
// @description  Check if anti bot (ab link) is solved or not
// @namespace    http://tampermonkey.net/
// @version      1
// @author       shrmarock
// @match        https://claimfreecoins.io/* 
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448973/ablink%20solve%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/448973/ablink%20solve%20check.meta.js
// ==/UserScript==

var ablinksSolved = false;
 

        var captchaInterval = setInterval(function(){
           if(document. getElementById("antibotlinks_reset"). style. display == "none")
{
     ablinksSolved = false;
    console.log(ablinksSolved)
}
else
{
    clearInterval(captchaInterval);
     ablinksSolved = true;
    console.log(ablinksSolved)
}
           
        },5000);
