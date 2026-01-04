// ==UserScript==
// @name         Pixlr Ad Blocker
// @namespace    https://greasyfork.org/en/users/783447-logzilla6
// @version      1.0
// @description  This will remove the ads on pixlr.com
// @author       Logzilla6
// @match        https://pixlr.com/e/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixlr.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446236/Pixlr%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/446236/Pixlr%20Ad%20Blocker.meta.js
// ==/UserScript==
var clearRight = setInterval(function(){
    if(window.location.href == "https://pixlr.com/e/#editor") {
        clearInterval(clearRight)
        document.getElementById("workspace").style.right = "0px";
        document.getElementById('right-space').remove()
        document.getElementById('sneaky').remove()
    }
}, 500);
var clearSneaky = setInterval(function(){
    document.getElementById('sneaky').remove()
}, 3000);