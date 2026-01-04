// ==UserScript==
// @name         Onch-Heure
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Horloge digitale sur le coin inférieur gauche de l'écran.
// @author       You
// @match        https://onche.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://www.worldtimebuddy.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470232/Onch-Heure.user.js
// @updateURL https://update.greasyfork.org/scripts/470232/Onch-Heure.meta.js
// ==/UserScript==

let contai = document.body.appendChild(document.createElement("div"));

contai.style.backgroundColor = couleurb();
contai.style.width = "4.2em";
contai.style.color = couleur();
contai.style.textAlign = "center";
contai.style.borderRadius = "3px";
contai.style.outlineWidth = "0.6px";
contai.style.fontSize = "0.8em";
contai.style.outlineColor = couleur();
contai.style.outlineStyle = "solid";
contai.style.height = "2em";
contai.style.paddingTop = "0.45em";
contai.style.position = "fixed";
contai.style.bottom = "10px";
contai.style.left = "7px";
console.log(contai);

setInterval(assignerHeure, 500);

function couleur(){

     if(window.location != "https://onche.org/"){
        switch(document.body.className){
            case "forum logged blue":
                return "#71c2fb";
            case "forum logged grey":
                return "#4a99e9";
            case "forum logged":
                return "#3a3135";
         }
     }else{
         switch(document.body.className){
           case "home forum logged blue":
                return "#71c2fb";
            case "home forum logged grey":
                return "#4a99e9";
            case "home forum logged":
                return "#3a3135";
         }
     }
}

function couleurb(){

 if(window.location != "https://onche.org/"){
        switch(document.body.className){
            case "forum logged blue":
                return "#283441";
            case "forum logged grey":
                return "#1c1e23";
            case "forum logged":
                return "#fff";
         }
     }else{
         switch(document.body.className){
           case "home forum logged blue":
                return "#283441";
            case "home forum logged grey":
                return "#1c1e23";
            case "home forum logged":
                return "#fff";
         }
     }

}

function assignerHeure(){
    const h = new Date();
    contai.innerHTML = h.getHours() + ":" + ((h.getMinutes().toString().length == 1) ? "0" + h.getMinutes() : h.getMinutes()) + ":" + ((h.getSeconds().toString().length == 1) ? "0" + h.getSeconds() : h.getSeconds());
}
