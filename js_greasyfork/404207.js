// ==UserScript==
// @name         BlueSilverTranslation UserScript
// @version      1.1.1
// @description  Some tools to help user's life
// @author       Askidox
// @match        https://bluesilvertranslations.wordpress.com/*
// @match        https://docs.google.com/document/d/*
// @grant        none
// @namespace https://greasyfork.org/users/190016
// @downloadURL https://update.greasyfork.org/scripts/404207/BlueSilverTranslation%20UserScript.user.js
// @updateURL https://update.greasyfork.org/scripts/404207/BlueSilverTranslation%20UserScript.meta.js
// ==/UserScript==

if (document.location.href.indexOf("bluesilvertranslations.wordpress.com") != -1){
    //Add Direct Link
    if (!document.querySelector(".entry-content").innerText.startsWith("Direct link")){
        document.getElementsByClassName("entry-content")[0].innerHTML = "<a href="+document.querySelector("iframe").src+">DIRECT LINK</a>" + document.getElementsByClassName("entry-content")[0].innerHTML ;
    }

    //Blur titles

    //Main title
    document.querySelectorAll("h1")[1].innerHTML = document.querySelectorAll("h1")[1].innerHTML.slice(0, 6) + "<span id=\"title\" style=\"color: transparent; text-shadow: 0 0 20px #000; cursor: pointer\">" + document.querySelectorAll("h1")[1].innerHTML.slice(6)+"</span>";
    //document.querySelectorAll("h1")[1].style = "color: transparent; text-shadow: 0 0 20px #000; cursor: pointer";
    document.querySelector("#title").addEventListener("click", function(){
        document.querySelector("#title").style = "";
    });

    //Buttons
    var aElts = document.querySelector("#nav-below").querySelectorAll("a");
    for(var i = 0 ; i < aElts.length ; i++){
        aElts[i].style = "color: transparent; text-shadow: 0 0 20px #000; cursor: pointer";
        aElts[i].addEventListener("mouseenter", function(event){
            event.target.style = "";
        });
    }

    //Comment Section
    document.querySelector(".comments-title span").style = "color: transparent; text-shadow: 0 0 20px #000; cursor: pointer";

    //Page name
    document.title = document.title.slice(0, 3) + " - "+document.querySelector(".entry-categories a").text;

}
else if (document.location.href.indexOf("https://docs.google.com/document/d/") != -1){
    document.querySelector("h1").children[0].style = "color: transparent; text-shadow: 0 0 20px #000; cursor: pointer";
    document.querySelector("h1").children[0].addEventListener("click", function(){
            document.querySelector("h1").children[0].style = "";
        });
}