// ==UserScript==
// @name         HF letter counter
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Quick-reply Letter Counter for HackForums.net
// @author       ᴍs-ᴅᴏs
// @match        https://hackforums.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382731/HF%20letter%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/382731/HF%20letter%20counter.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function insertAfter(el, referenceNode) {
        referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
    }

    if(!document.getElementById("letter-count")){
        var el = document.createElement('p');
        el.setAttribute("id","letter-count");
        el.style.color = "#ababab";
        el.style.margin = "5px";
        var ref = document.getElementById("message");
        var ref2 = document.querySelector(".sceditor-container");
        insertAfter(el, ref);
        insertAfter(el, ref2);
    }

    document.getElementById("message").addEventListener("input", function(e){
        var letter = e.target.value.length;
        //console.log(letter);
        document.getElementById("letter-count").innerHTML = letter;
    })

     document.querySelector("#content > div > form > table > tbody > tr:nth-child(3) > td:nth-child(2) > div > textarea").addEventListener("input", function(e){
        var letter = e.target.value.length;
        console.log(letter);
        document.getElementById("letter-count").innerHTML = letter;
    })

})();