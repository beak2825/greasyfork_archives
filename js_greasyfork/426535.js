// ==UserScript==
// @name     skip Google and Youtube "Before you continue"
// @description remove popup
// @author   Pascal
// @version  1.7
// @match    https://consent.google.com/*
// @match    https://consent.google.de/*
// @match    https://www.google.com/*
// @match    https://consent.youtube.com/*
// @match    https://www.youtube.com/*
// @grant    none
// @namespace https://greasyfork.org/users/767993
// @downloadURL https://update.greasyfork.org/scripts/426535/skip%20Google%20and%20Youtube%20%22Before%20you%20continue%22.user.js
// @updateURL https://update.greasyfork.org/scripts/426535/skip%20Google%20and%20Youtube%20%22Before%20you%20continue%22.meta.js
// ==/UserScript==


// Simulate "I agree" Button click on Youtube/Google consent page
// document.getElementsByTagName('button')[0].click()

/*
   document.addEventListener("DOMContentLoaded", function() {
   console.log("DOMContentLoaded");
*/

// setTimeout(function(){ 
timerId = setInterval(function() {

    console.log("check...");


    txt_en = "Before you continue";
    txt_de = "Bevor Sie";

    confirm_button_txt = ["i agree", "ich stimme zu"];

    function inpage(str) {
        return ((document.documentElement.textContent || document.documentElement.innerText).indexOf(str) > -1);
    }

    if (inpage(txt_en) || inpage(txt_de)) {
        console.log("consent page detected");

        var elements_1 = Array.from(document.getElementsByTagName('button'));
        var elements_2 = Array.from(document.getElementsByTagName('ytd-button-renderer')); // youtube-specific button tag

        var elements = [];

        elements = elements.concat(elements_1);
        elements = elements.concat(elements_2);

        var elements_len = elements.length;

        console.log("elements:", elements_len);

        for (var i = 0; i < elements_len; i++) {
            var el = elements[i];
            var txt = el.innerText;

            console.log("button", i, txt);

            if (confirm_button_txt.indexOf(txt.toLowerCase()) > -1) {
                console.log("found button");
                el.click();
                clearInterval(timerId);
                break;
            }
        }
    }

    // });
}, 300);