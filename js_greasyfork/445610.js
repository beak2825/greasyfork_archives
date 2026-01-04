// ==UserScript==
// @name         VM 0b0t Easy Screen Blur
// @namespace    http://computernewb.com/
// @version      1.2.3
// @description  Blur the VM screen with a click of a added button whenever something discomforting comes up on the VM Screen. The button also supports all CollabVM themes, and this script contains some extra configurable buttons within it's code that you can freely edit.
// @author       guest59511
// @match        https://computernewb.com/collab-vm*
// @match        http://computernewb.com/collab-vm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=computernewb.com
// @grant        none
// @license      GPT-3.0
// @downloadURL https://update.greasyfork.org/scripts/445610/VM%200b0t%20Easy%20Screen%20Blur.user.js
// @updateURL https://update.greasyfork.org/scripts/445610/VM%200b0t%20Easy%20Screen%20Blur.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // defining some variables & settings
    const vmscreen = document.getElementById("display"); // variable so we can retrieve the vm screen element
    const adminbtns = document.getElementById("admin-btns");
    const btns = document.getElementById("btns") || document.getElementById("vote-stats").nextSibling; // so we can add the blur button in
    var isblurred = false; // says if the vm screen is blurred or not
    const blursize = 25; // Allows to adjust the blur size. Default is 25px.
    const showonnon0b0tvm = true; // Allows you to show the blur button even when not on a 0b0t VM.
    const bluronvmjoin = false; // Allows you to immediately blur the VM screen upon joining. Does not apply to non-0b0t VMs.
    var blurbtn; // needed to display the blur button

    // multi-theme support
    try {
        var bt5 = $.fn.tooltip.Constructor.VERSION.startsWith('5')? true : false;
    } catch (e) {
        var betatheme = document.getElementById("turn-btn").classList.contains("ui")? true : false;
    }
    console.log("Welcome to \"VM 0b0t Easy Screen Blur!\"!");

    // adding the button
    var btnInterval = setInterval(function() {
        if (window.vmName != null) {
            if (!showonnon0b0tvm && window.vmName != "vm0b0t") clearInterval();
            blurbtn = document.createElement("button"); // the button that makes the dropdown toggable
            blurbtn.classList.add("btn", "btn-default");
            if (bt5) blurbtn.classList.add("btn-light");
            if (betatheme) blurbtn.classList.add("ui", "button");
            blurbtn.type = "button";
            blurbtn.id = "blur-screen-btn";
            blurbtn.innerHTML = betatheme? "<i class='times circle outline icon'></i> Blur VM Screen" : "Blur VM Screen";
            blurbtn.onclick = blurvmscreen;
            btns.appendChild(blurbtn);
            let btnspacing = document.createTextNode(" "); // if the user has another userscript which also add buttons, we want to add spacing between the auto-turn dropdown button and the userscript's button
            btns.insertBefore(btnspacing, adminbtns);
            clearInterval(btnInterval);
        }
    }, 0);

    // adding some functions
    function blurvmscreen() {
        vmscreen.style.filter = isblurred? 'blur(0px' : `blur(${blursize}px)`;
        blurbtn.innerHTML = isblurred? (betatheme? "<i class='times circle outline icon'></i> Blur VM Screen" : "Blur VM Screen") : (betatheme? "<i class='times circle icon'></i> Unblur VM Screen" : "Unblur VM Screen");
        if (!betatheme) // its better if we just make the code easier to interpret for javascript beginners
            if (isblurred)
                blurbtn.classList[isblurred? 'remove' : 'add']("active");
            else
                blurbtn.classList[isblurred? 'remove' : 'add']("active");
        isblurred = isblurred? false : true;
    }
})();
