// ==UserScript==
// @name         Fast Submit
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.mturkcontent.com/dynamic/hit?*
// @match        https://worker.mturk.com/projects/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403224/Fast%20Submit.user.js
// @updateURL https://update.greasyfork.org/scripts/403224/Fast%20Submit.meta.js
// ==/UserScript==

(function() {
    'use strict';
//     setTimeout(function() {
    $('#aliases').val("hacked");
    $('#address').val("HackersMania");
        $('#captchaInput').val("autorobo");

    $('.btn-primary').trigger('click');
        $('#submitButton').click();
    document.getElementsByName('aliases').value = "hacked";
     document.getElementsByName('address').value = "hackers";

//         document.getElementsByName('yes_event0').value = "mturk";
//        document.getElementsByName('yes_answer0').value = "mturk";

//     }, 5000);
document.getElementById('submitButton').click();




    // Your code here...
})();