// ==UserScript==
// @name         Kill the snobs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.plemiona.pl/game.php*mode=decommission*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401828/Kill%20the%20snobs.user.js
// @updateURL https://update.greasyfork.org/scripts/401828/Kill%20the%20snobs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();

let loop_flag

$(document).ready(function() {
    loop_flag = localStorage.getItem('kill_snob_loop')
    if (!loop_flag) {loop_flag = 0; localStorage.setItem('kill_snob_loop',0)}
    console.log("Loop flag: "+loop_flag)
    if (loop_flag == 0) {text = 'Activate'} else {text = 'Deactivate'}
    $("#content_value").prepend(`<button class="btn toogle_loop">${text} loop</button>`)
    if (loop_flag == 1 && $(".groupRight").length > 0) {
        if ($("#snob_0_a").text().trim() != '(0)') {
            $("#snob_0_a")[0].click()
            setTimeout(function() {$(".btn-recruit").click()},200)
            setTimeout(function() {$(".groupRight").click()},1000)
        } else {
            localStorage.setItem('kill_snob_loop',0)
        }
    } else {
        localStorage.setItem('kill_snob_loop',0)
    }
})

$(document.body).on('click','.toogle_loop',function() {
    if (loop_flag == 1) {localStorage.setItem('kill_snob_loop',0)} else {localStorage.setItem('kill_snob_loop',1)}
})