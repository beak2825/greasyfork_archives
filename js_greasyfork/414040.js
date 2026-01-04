// ==UserScript==
// @name         Nitro Type default cursor to a random Nitro Type car changer 
// @namespace    https://www.nitrotype.com/racer/ginfio_best
// @version      1.0
// @description  Every time you click on the page, or refresh page, the cursor changes to a random Nitro Type car.
// @author       Ginfio
// @match        https://www.nitrotype.com/*
// @downloadURL https://update.greasyfork.org/scripts/414040/Nitro%20Type%20default%20cursor%20to%20a%20random%20Nitro%20Type%20car%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/414040/Nitro%20Type%20default%20cursor%20to%20a%20random%20Nitro%20Type%20car%20changer.meta.js
// ==/UserScript==


var cursor = "get${cursor}";
    /*cursor.convert("https://www.nitrotype.com/car${random}")
return cursor.random(x*222);

api.get(name); SkittlesTyper()
    */


window.onload = function(){
document.body.addEventListener("click", function(){
document.body.style.cursor = "url(https://www.nitrotype.com/cars/"+Math.floor(Math.random()*217)+"_small_1.png), auto";
}) 
}