// ==UserScript==
// @name        BlueCat Address Manager Top Button
// @namespace   *
// @description Add a "Go to Top" button in BlueCat Address Manager
// @include     */app*
// @version     2
// @author      Marius Galm
// @copyright   2018, Marius Galm
// @license     MIT
// @grant       none
// @icon        https://www.bluecatnetworks.com/wp-content/uploads/2018/03/cropped-bluecat-favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/374433/BlueCat%20Address%20Manager%20Top%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/374433/BlueCat%20Address%20Manager%20Top%20Button.meta.js
// ==/UserScript==

if (document.readyState === "interactive" ) {
    addTopButton();
}

function addTopButton() {
    var button = document.createElement("button");
    button.innerHTML="Top";
    button.id="topBtn";
    button.title="Go to top";
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(button);
    button.addEventListener ("click", function() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });
    var btncss = '#topBtn {display: none; box-shadow: 1px 1px #888888; position: fixed; width: 60px; bottom: 20px; right: 30px; z-index: 99; border: none; outline: none; background-color: #8CB7D1; color: white; cursor: pointer; padding: 15px; border-radius: 10px; font-size: 18px; } #topBtn:hover { background-color: #555; }';
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet){
        style.styleSheet.cssText = btncss;
    } else {
        style.appendChild(document.createTextNode(btncss));
    }
    console.log("add new btncss stylings to head element")
    head.appendChild(style);
    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function() {scrollFunction()};
}

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("topBtn").style.display = "block";
    } else {
        document.getElementById("topBtn").style.display = "none";
    }
}