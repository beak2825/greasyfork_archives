// ==UserScript==
// @name          Insomnia Advertorial Remover
// @author        cckats
// @description  Removes Insomnia Advertorials 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @match        https://www.insomnia.gr/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428998/Insomnia%20Advertorial%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/428998/Insomnia%20Advertorial%20Remover.meta.js
// ==/UserScript==

var test=0;
(function() {
    'use strict';
    const regex = RegExp('Advertorial');
    const interval = setInterval(function() {
    for(var k=0; k< document.getElementsByClassName("featured-small box__white grid").length ;k++){
     var spon = document.getElementsByClassName("featured-small box__white grid")[k].innerText;
     if(regex.test(spon)){
         document.getElementsByClassName("featured-small box__white grid")[k].remove();
          return;
     }
    }
    test++;
        if(test >= 3){
            clearInterval(interval);
        }
},500)

})();