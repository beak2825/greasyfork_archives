// ==UserScript==
// @name        Epitech PowerUp
// @namespace   glemartret@gmail.com
// @description Add infos on user page
// @include     https://intra.epitech.eu/user/*
// @version     0.0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29293/Epitech%20PowerUp.user.js
// @updateURL https://update.greasyfork.org/scripts/29293/Epitech%20PowerUp.meta.js
// ==/UserScript==

total = 0;
i = 0;

setTimeout(function () {
    if (document.readyState != "complete") {
        console.log("Wait page");
    }
    if (!(elem = document.getElementById("user-module"))) {
        console.log("wait user-module")
    }
    if (!(elem = elem.getElementsByClassName("overflow")[0])) {
        console.log("wait overflow")
    }
    if (!(elem = elem.getElementsByTagName("tbody")[0])) {
        console.log("wait tbody")
    }
    if (!(elem = elem.getElementsByClassName("item"))) {
        console.log("wait item")
    }
    while (elem[i]) {
        cred = elem[i++].getElementsByClassName("number")[0];
    	total = total + Number(cred.innerText);
    }
    if (elem = document.getElementsByClassName("note")[0]) {
        if (note = elem.getElementsByTagName("span")[0]) {
            note.innerText = note.innerText + " / " + total;
        }
    }
}, 500)