// ==UserScript==
// @name         Wikipedia Random Episode
// @namespace    https://en.wikipedia.org/wiki/List_of_*episodes*
// @version      0.2
// @description  random episode title from wikipedia
// @author       crisxh
// @match        https://en.wikipedia.org/wiki/List_of_*episodes*
// @icon         https://www.google.com/s2/favicons?domain=wikipedia.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438391/Wikipedia%20Random%20Episode.user.js
// @updateURL https://update.greasyfork.org/scripts/438391/Wikipedia%20Random%20Episode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var randomBox=document.createElement("div");
    randomBox.id="randomBox";
    randomBox.style.display="flex";
    randomBox.style.flexDirection="row-reverse";
    randomBox.style.justifyContent="flex-end";


    /*let body=document.getElementById("bodyContent");*/
    var body=document.querySelector(".wikiepisodetable");

    var randomOutput=document.createElement("div");
    randomOutput.id="randomOutput";
    randomOutput.style.backgroundColor="lightgrey";
    randomOutput.style.border="1px black solid";
    randomOutput.style.height="50px";
    randomOutput.style.width="300px";
    randomOutput.style.margin="10px";
    randomOutput.style.borderRadius="5%";
    randomOutput.style.padding="5px";


    var randomButton=document.createElement("button");
    randomButton.id="randomButton";
    randomButton.style.margin="10px";
    randomButton.style.border="none";
    randomButton.style.backgroundColor="green";
    randomButton.style.height="50px";
    randomButton.style.width="100px";
    randomButton.style.borderRadius="5%";
    randomButton.style.border="2px outset black";
    randomButton.style.color="white";

    randomButton.addEventListener("click",function(){
         var episodes= document.querySelectorAll("td.summary");
    var titleRegex=/[^("\\")]\w+\s*[^(\\"")]/;

    var epArr=[];
    var titles=[];




    for (let i=0;i<episodes.length;i++){
    epArr.push(episodes[i].innerText);
    }

     var randomEp=epArr[Math.floor(Math.random()*epArr.length)];
    randomOutput.innerHTML="Your random episode title is: "+randomEp;


    });

    randomButton.innerHTML="Random Episode";



   body.prepend(randomBox);
    randomBox.append(randomOutput);
    randomBox.append(randomButton);


    randomButton.addEventListener("mousedown",e=>{
    randomButton.style.backgroundColor="darkgreen";
    randomButton.style.border="2px inset black";
        });

    randomButton.addEventListener("mouseup",function(e){
     
        randomButton.style.backgroundColor="green";
        randomButton.style.border="2px outset black";
    });







})();