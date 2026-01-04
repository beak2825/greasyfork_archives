// ==UserScript==
// @name         Sort clan members according to event points
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Add button to sort clan members
// @author       Arekino
// @match        https://www.lordswm.com/clan_info.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423405/Sort%20clan%20members%20according%20to%20event%20points.user.js
// @updateURL https://update.greasyfork.org/scripts/423405/Sort%20clan%20members%20according%20to%20event%20points.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i = document.createElement("button");
    i.innerText = "Sort clan members event points";
    i.onclick=()=>{[...document.querySelectorAll("tr")].filter(x=>{if(x.childElementCount==6||(x.children[0].innerText.includes(".")&&x.childElementCount==5)){if(isNaN(parseInt(x.lastElementChild.innerText))) x.lastElementChild.innerText=0;return true}return false})
        .sort((x,y)=>parseInt(y.lastElementChild.innerText.replace(",",""))-parseInt(x.lastElementChild.innerText.replace(",",""))).forEach((x,i)=>{x.parentElement.appendChild(x);x.firstElementChild.innerText=`${i+1}.`})}
    document.querySelectorAll("table.wb")[0].firstElementChild.appendChild(i)

    i = document.createElement("button");
    i.innerText = "Sort clan members online and level";
    document.querySelectorAll("table.wb")[0].firstElementChild.appendChild(i)
    // Your code here...


    i.onclick=()=>{[...document.querySelectorAll("tr")].filter(x=>{if(x.childElementCount==6||(x.children[0].innerText.includes(".")&&x.childElementCount==5)){if(isNaN(parseInt(x.lastElementChild.innerText))) x.lastElementChild.innerText=0;return true}return false}).sort((x,y)=>{
    let xOnline = x.innerHTML.includes("online")||x.innerHTML.includes("battle")||x.innerHTML.includes("arcomag")
    let yOnline = y.innerHTML.includes("online")||y.innerHTML.includes("battle")||y.innerHTML.includes("arcomag")
    if(xOnline!=yOnline){
        return xOnline?-1:1;
    }
    return parseInt(y.children[3].innerText)-parseInt(x.children[3].innerText)}).forEach((x,i)=>{x.parentElement.appendChild(x);x.firstElementChild.innerText=`${i+1}.`})}
})();