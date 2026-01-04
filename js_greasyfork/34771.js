// ==UserScript==
// @name         Neopets: Double or Nothing AP
// @namespace    http://clraik.com/forum/showthread.php?62618
// @version      0.1
// @description  Plays Double or Nothing. Stops when you reach 320 NP. When you get the avatar, a pop up window will appear.
// @author       AyBeCee (clraik)
// @match        http://www.neopets.com/medieval/doubleornothing.phtml*
// @grant        none
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/34771/Neopets%3A%20Double%20or%20Nothing%20AP.user.js
// @updateURL https://update.greasyfork.org/scripts/34771/Neopets%3A%20Double%20or%20Nothing%20AP.meta.js
// ==/UserScript==

var wait = Math.floor(Math.random() * 2901) + 100;
if (document.body.innerHTML.indexOf("You are now eligible to use") !== -1){
    alert("Avatar received!");
} else if (document.body.innerHTML.indexOf("Snargan takes") !== -1){
    setTimeout(function() {
        $("input[value='Try again...']").click();
    }, wait);
} else if (document.body.innerHTML.indexOf("Congratulations! You have won <b>320 NP</b> so far") !== -1) {
    setTimeout(function() {
        $("input[value='Collect Your Winnings - 320 NP']").click();
    }, wait);
} else if (document.body.innerHTML.indexOf("Congratulations! You have won") !== -1) {
    setTimeout(function() {
        $("input[value='Continue']").click();
    }, wait);
} else {
    setTimeout(function() {
        $("a[href*='process_doubleornothing.phtml'] img").click();
    }, wait);
}