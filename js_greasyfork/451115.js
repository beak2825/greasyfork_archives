// ==UserScript==
// @name         Flip buttons
// @namespace    https://hackforums.net/convo.php
// @version      0.3
// @description  add flip buttons to hf convo
// @author       You
// @match        https://hackforums.net/convo.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hackforums.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451115/Flip%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/451115/Flip%20buttons.meta.js
// ==/UserScript==

$("body").append ('<script>function FlipButtonCalled(flipValue) {\
document.getElementById("comment").value = `/flip ${flipValue}`;\
$("#new_message").submit();\
}</script>'+'<div class="flip_container">\
    <button value="5" onclick="FlipButtonCalled(5)">Flip 5</button>\
    <button value="50" onclick="FlipButtonCalled(50)">Flip 50</button>\
    <button value="100" onclick="FlipButtonCalled(100)">Flip 100</button>\
    <button value="250" onclick="FlipButtonCalled(250)">Flip 250</button>\
    <button value="69" onclick="FlipButtonCalled(69)">Flip 69</button>\
    <button value="420" onclick="FlipButtonCalled(420)">Flip 420</button>\
    <button value="500" onclick="FlipButtonCalled(500)">Flip 500</button>\
    <button value="1000" onclick="FlipButtonCalled(1000)">Flip 1000</button>\
    <button value="5000" onclick="FlipButtonCalled(5000)">Flip 5000</button>\
    <button value="10000" onclick="FlipButtonCalled(10000)">Flip 10k</button>\
</div>\
<style>\
    .flip_container {\
        position: fixed;\
        width: 160px;\
        height: 750px;\
        top: 0;\
        right: 16px;\
        background-color: #0e0e0e;\
        z-index: 9999;\
        border-radius: 3px;\
        display: flex;\
        justify-content: center;\
        flex-wrap: wrap;\
        border: 2px solid #6bff74;\
        flex-direction: row;\
        border-top: none;\
        gap: 5px;\
    }\
    .flip_container > button {\
        flex: 0 0 35%;\
    }\
    .flip_container > button:hover {\
        background-color: #1f6b20;\
    }\
</style>');

