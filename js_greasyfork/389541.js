// ==UserScript==
// @name         Aternos Minecraft Server Hosting ADBLOCKER
// @namespace    https://aternos.org/*
// @version      0.2
// @description  Great minecraft hosting, but it has adblocker detection, this script automatically destroy antiadblock windows. I would prefer to show a donate button instead of forcing Ads. Script tested with Tapermonkey, Chrome 76.
// @author       You
// @include      https://aternos.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389541/Aternos%20Minecraft%20Server%20Hosting%20ADBLOCKER.user.js
// @updateURL https://update.greasyfork.org/scripts/389541/Aternos%20Minecraft%20Server%20Hosting%20ADBLOCKER.meta.js
// ==/UserScript==

(function() {
    // Your code here...
    let tries = 50

setTimeout(doClear,20);



    function doClear(){

            document.querySelectorAll('[style="display: none;"]').forEach(e => {e.style.display = ""})
            document.querySelectorAll(".ad-replacement").forEach(e => {e.parentElement.style.display = "none"})
            document.querySelector('.fas.fa-ban').parentElement.parentElement.parentElement.parentElement.style.display ="none";
          if(tries-- > 0){
            setTimeout(doClear,10);
     }
 }
    document.querySelector(" div > div > div:nth-child(2) > div:nth-child(3) > div.btn.btn-white").click();
})();
