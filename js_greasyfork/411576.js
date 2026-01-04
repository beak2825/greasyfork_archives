// ==UserScript==
// @name         RYM Quick search with "Shift" instead of "Enter"
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Skips the "Search results for..." page by autoclicking the first result. Exceptions can be added.
// @author       mapple
// @match        https://rateyourmusic.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411576/RYM%20Quick%20search%20with%20%22Shift%22%20instead%20of%20%22Enter%22.user.js
// @updateURL https://update.greasyfork.org/scripts/411576/RYM%20Quick%20search%20with%20%22Shift%22%20instead%20of%20%22Enter%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var flag=localStorage.getItem('flag')
    if (flag==1){
        flag=0;
        localStorage.setItem('flag',flag)
    document.querySelectorAll("a.searchpage")[0].click()//opens the first link
    }

   var btn=document.getElementById("mainsearch_submit")
    var fld=document.getElementsByName("searchterm")[0]


function smartSearch(){
           var s=fld.value
       var ss=s.toLowerCase()
       if (ss.includes("mozart")==true) {
        window.location.replace("https://rateyourmusic.com/artist/wolfgang-amadeus-mozart")}
        else if (ss.includes("beethoven")==true) {
        window.location.replace("https://rateyourmusic.com/artist/ludwig-van-beethoven")}
        else if (ss.includes("schumann")==true) {
        window.location.replace("https://rateyourmusic.com/artist/robert-schumann")}
        else if (ss.includes("ravel")==true) {
        window.location.replace("https://rateyourmusic.com/artist/maurice-ravel")}
        else if (ss.includes("chopin")==true) {
        window.location.replace("https://rateyourmusic.com/artist/frederic_chopin")}
        else if (ss.includes("brahms")==true) {
        window.location.replace("https://rateyourmusic.com/artist/johannes-brahms")}
        else if (ss.includes("schubert")==true) {
        window.location.replace("https://rateyourmusic.com/artist/franz_schubert")}
        else if (ss.includes("liszt")==true) {
        window.location.replace("https://rateyourmusic.com/artist/franz_liszt")}
        else if (ss.includes("saens")==true) {
        window.location.replace("https://rateyourmusic.com/artist/camille-saint-saens")}
        else if (ss.includes("debussy")==true) {
        window.location.replace("https://rateyourmusic.com/artist/claude-debussy")}
        else {$('#mainsearch')[0].submit()}
                 }



    fld.onkeydown=function (){

     if (event.keyCode == 16) {
         flag=1
         localStorage.setItem('flag',flag)
         smartSearch();
     }

 }
//----------------
})();