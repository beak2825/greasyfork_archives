// ==UserScript==
// @name         Turn all CS2204 Lecture Notes into a seamless page
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Ease your life while searching during the final exam.
// @author       You
// @match        https://courses.cs.cityu.edu.hk/cs2204/notes/html/notes-read.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.hk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444366/Turn%20all%20CS2204%20Lecture%20Notes%20into%20a%20seamless%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/444366/Turn%20all%20CS2204%20Lecture%20Notes%20into%20a%20seamless%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const nts = genNotes()

    function getCode(idx){
        return nts[idx].code
    }

    var currentIDX = -1
    var allHTMLs = ""
//    var intv = setInterval(()=>{
    while(true){
        currentIDX++
        goPage(getCode(currentIDX))
        allHTMLs += document.body.innerHTML
        if(currentIDX == 243){
            //clearInterval(intv)
            setTimeout(()=>{document.body.innerHTML = allHTMLs},500)
            break;
        }

    }
//    },2)
})();