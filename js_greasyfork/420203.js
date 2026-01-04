// ==UserScript==
// @name         TitleHider JustATranslatorTranslations
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Blur Title
// @author       Askidox
// @match        https://justatranslatortranslations.com/lgs-chapter-*/
// @match        https://justatranslatortranslations.com/csg-chapter-*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420203/TitleHider%20JustATranslatorTranslations.user.js
// @updateURL https://update.greasyfork.org/scripts/420203/TitleHider%20JustATranslatorTranslations.meta.js
// ==/UserScript==

(function() {
    //Blur titles

    var titleStart = Math.max(document.querySelector("h1").innerHTML.indexOf(":"), document.querySelector("h1").innerHTML.indexOf("–")) + 1;
    //Main title
    document.querySelectorAll("h1")[0].innerHTML = document.querySelector("h1").innerHTML.slice(0, titleStart) + "<span class=\"title\">" + document.querySelector("h1").innerHTML.slice(titleStart)+"</span>";
    //document.querySelectorAll("h1")[1].style = "color: transparent; text-shadow: 0 0 20px #000; cursor: pointer";

    document.querySelector(".entry-content").innerHTML = putTitle(document.querySelector(".entry-content").innerHTML, regexIndexOf(document.querySelector(".entry-content").innerHTML, /<p>Chapter \d{1,4}\s?[:–].+<\/p>/));


    document.querySelectorAll(".title").forEach(function(elt){
        elt.style = "color: transparent; text-shadow: 0 0 20px #000; cursor: pointer";
        elt.addEventListener("click", function(){
            document.querySelectorAll(".title").forEach(elt => elt.style = "");
        });
    })

    document.querySelector(".title").addEventListener("click", function(){
        document.querySelector(".title").style = "";
    });



})();

function regexIndexOf(string, regex, startpos) {
    var indexOf = string.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}

function putTitle(string, index){
    var start = string.slice(0, index)
    var end = string.slice(index+3)
    return start + "<p class=\"title\">" + end;
}