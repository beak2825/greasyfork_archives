// ==UserScript==
// @name         Filter Upcoming releases
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Check out your upcoming section on profile page!
// @author       mapple
// @match        https://rateyourmusic.com/~*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/409792/Filter%20Upcoming%20releases.user.js
// @updateURL https://update.greasyfork.org/scripts/409792/Filter%20Upcoming%20releases.meta.js
// ==/UserScript==
(function(){
     'use strict';

//-------------------------------------

    var upcom =document.getElementsByClassName("mbgen")
    var N=0

for (var i = 0; i < upcom.length; i++) {
    var txt=upcom[i].innerHTML
         if (txt.includes("A venir")==true||txt.includes("Upcoming")==true) {N=i}}

   var alb= upcom[N].querySelectorAll("a.album")// All the upcoming releases
   var art=upcom[N].querySelectorAll("a.artist") // Artists of the upcoming releases
   var lin=upcom[N].querySelectorAll("br") // Line breaks

//----------------------------------------

var sort = document.createElement("select")
sort.id="sort"
var array = ["None","Albums","Singles","EPs","Compilations","DJ Mixes","Mixtapes","Bootlegs","Videos"];
//Create and append the options
for (i = 0; i < array.length; i++) {
    var option = document.createElement("option");
    option.value = array[i];
    option.text = array[i];
    sort.appendChild(option);
}
upcom[N].querySelectorAll("th")[0].textContent=upcom[N].querySelectorAll("th")[0].textContent+". Filter by:"
upcom[N].querySelectorAll("th")[0].appendChild(sort)

       sort.onchange= function(){filter(sort.value)}

//----------------------------------------------------------
            for (i = 1; i < alb.length; i++) {//removes duplicates
             if (alb[i-1].title==alb[i].title){
                var element=alb[i]
               element.style.display="none"
            while (element.nodeName=="A"||element.nodeName=="SPAN"){
                element.style.display="none"
                if (element.previousElementSibling.nodeName=="BR"){element.previousElementSibling.style.display="none"}
                element=element.previousElementSibling}}}


function filter(n){
    var filter="/"
    if (n=="Albums"){filter="/album/"}
    else if (n=="EPs"){filter="/ep/"}
    else if (n=="Singles"){filter="/single/"}
    else if (n=="Compilations"){filter="/comp/"}
    else if (n=="Mixtapes"){filter="/mixtape/"}
    else if (n=="DJ Mixes"){filter="/djmix/"}
    else if (n=="Videos"){filter="/video/"}
    else if (n=="Bootlegs"){filter="/unauth/"}

            for (i = 0; i < alb.length; i++) {//releases
 element=alb[i]
        if (element.href.includes(filter)==true) {
            while(element.nodeName=="A"||element.nodeName=="SPAN"){
                element.style.display=""
                if (element.previousElementSibling.nodeName=="BR"){element.previousElementSibling.style.display=""}
                element=element.previousElementSibling
            }
//      lin[i].style.display = ""
           }
        else {
            while (element.nodeName=="A"||element.nodeName=="SPAN"){
                element.style.display="none"
                if (element.previousElementSibling.nodeName=="BR"){element.previousElementSibling.style.display="none"}
                element=element.previousElementSibling}
//      lin[i].style.display = "none"

           }
           }

            for (i = 1; i < alb.length; i++) {//removes duplicates
             if (alb[i-1].title==alb[i].title){
                var element=alb[i]
               element.style.display="none"
            while (element.nodeName=="A"||element.nodeName=="SPAN"){
                element.style.display="none"
                if (element.previousElementSibling.nodeName=="BR"){element.previousElementSibling.style.display="none"}
                element=element.previousElementSibling}}}

      };
  //-----------------------------------------


    })();
