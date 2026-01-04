// ==UserScript==
// @name         Chat Scroller Gallons % Gulch
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  chat scroller gallons & gulch
// @author       Guzmán11
// @match        https://gallons.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433272/Chat%20Scroller%20Gallons%20%25%20Gulch.user.js
// @updateURL https://update.greasyfork.org/scripts/433272/Chat%20Scroller%20Gallons%20%25%20Gulch.meta.js
// ==/UserScript==
let condiciones=true;
let space=" ";
let rango=120;
let aumento=0;
let disminuir=rango;
let texto="========>";
function todo(){

if(condiciones == false){
texto="<========";
}

if(condiciones == true){
texto="========>";
}
    if(condiciones == true){
        aumento++;
        disminuir--;
    }
    if(aumento == rango){
        condiciones=false;
    }
    if(condiciones == false){
        disminuir++;
        aumento--;
    }
    if(aumento == 0){
        condiciones = true
    }

 window['objects']['websocket'].send(`c,${space.repeat(aumento)} ${texto} ${space.repeat(disminuir)}`);
}
let chat=setInterval(()=>{
todo();
todo();
todo();
},0);
