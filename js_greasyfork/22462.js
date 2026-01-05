// ==UserScript==
// @name         Ask for name
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Asks for your name when you open a website!
// @author       Arden Xie
// @match        https://*
// @match        http://*
// @grant        none
// @copyright    2016 Arden Xie
// @icon         https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ4rWlNnlWwhYwlun4-QLdt3BpUnhz921Dj1Q1iX_QHUBGRBh7Q8L7BEQ
// @downloadURL https://update.greasyfork.org/scripts/22462/Ask%20for%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/22462/Ask%20for%20name.meta.js
// ==/UserScript==

(function() {
    var yourname = prompt("What is your name?");
    if (yourname != null){
        alert("Hello, " + yourname);
    } else{
        alert("Actually enter a name, please");
    }
})();