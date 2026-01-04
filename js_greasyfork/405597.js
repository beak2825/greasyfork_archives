// ==UserScript==
// @name         Sexverse DarkMode
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Dark Mode for Sexverse
// @author       SoaringGecko
// @match        *://sexversereturns.rf.gd/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/405597/Sexverse%20DarkMode.user.js
// @updateURL https://update.greasyfork.org/scripts/405597/Sexverse%20DarkMode.meta.js
// ==/UserScript==


GM_addStyle('body{color:#fff;background-color:#000}a{color:#77d8f7}div a{color:#a21ea2}');
console.log('ran');

(function() {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'https://66.media.tumblr.com/5798a3583f441dcaa668729de45e15e8/tumblr_pc2n03XAmX1waey3po5_1280.jpg';
    document.getElementsByTagName('head')[0].appendChild(link);
})();

(function() {
var y = document.getElementsByTagName("a");
//document.write(y[0].innerHTML);
if (y[0].innerHTML == "back to home page") {
    y[0].innerHTML = "back to home page" + "<br/>";
}
})();

(function() {
var x = document.getElementsByTagName("p");
//document.write(y[0].innerHTML);
if (x[0].innerHTML == "who cares also only i can talk here hahahahahahaah!!!!!!!!!!!!!!!!!!!!1") {
    x[0].innerHTML = "who cares also only i can talk here hahahahahahaah!!!!!!!!!!!!!!!!!!!!1<br/><img src='https://www.gravatar.com/avatar/e2cf7fbdd3478eb3a91cc5df334bb37f?s=40&d=http%3A%2F%2Fhtmlcommentbox.com%2Fstatic%2Fimages%2Fgravatar.png'>No you aren't asshole";
}
})();