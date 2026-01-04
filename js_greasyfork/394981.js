// ==UserScript==
// @name         Min Quantity Multi Search Path Of Exile
// @version      1
// @description  Only show searches with  minimum quantity
// @author       TheBerzzeekr
// @match        *://www.pathofexile.com/trade/*
// @grant        none
// @namespace https://greasyfork.org/users/294634
// @downloadURL https://update.greasyfork.org/scripts/394981/Min%20Quantity%20Multi%20Search%20Path%20Of%20Exile.user.js
// @updateURL https://update.greasyfork.org/scripts/394981/Min%20Quantity%20Multi%20Search%20Path%20Of%20Exile.meta.js
// ==/UserScript==

var quantityenabled = false;
var minimumQuantity = 10;

var results;
function init(){

    results = document.getElementsByClassName("results")[0];

    console.log(results);
    delete_lowQ();

}


function delete_lowQ(){

    if(results == null){
        results = document.getElementsByClassName("results")[0];
        setTimeout(delete_lowQ,1000);
        return;
    }

    if(results.childElementCount==0) {setTimeout(delete_lowQ,1000);return;}

    var child;
    var quantity;

    for(var i=1;i<results.childElementCount;++i){
        child = results.children[i];

        if(child.children[0].childElementCount!=3) continue;

        if(child.classList.contains("checked")) continue;

        child.classList.add("checked");

        checkDIV(child);

    }

setTimeout(delete_lowQ,1000);
}

function checkDIV(element){

    var quantity = element.getElementsByClassName("colourDefault");
    if(quantity==null || quantity.length==0) {setTimeout(function(){checkDIV(element);},500);return;}

    parseQuantity(quantity[0],element);

}

function parseQuantity(quantity,daddy){

    var text = quantity.innerHTML;

    var altext = text.split("/");

    var q = parseInt(altext[0]);

    if(q<minimumQuantity) daddy.parentNode.removeChild(daddy);

}

init();




