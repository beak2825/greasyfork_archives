// ==UserScript==
// @name         Unboxholics Sponsored post Remover
// @author        cckats
// @namespace https://greasyfork.org/users/661487
// @version      1.0
// @description  Removes Unboxholics Sponsored posts
// @match        https://unboxholics.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428999/Unboxholics%20Sponsored%20post%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/428999/Unboxholics%20Sponsored%20post%20Remover.meta.js
// ==/UserScript==

var test=0;
(function() {
    'use strict';
    const regex = RegExp('SPONSORED');
    const interval = setInterval(function() {
    for(var k=0; k< document.getElementsByClassName("col-md-6").length ;k++){
     var spon = document.getElementsByClassName("col-md-6")[k].innerText;
     if(regex.test(spon)){
         document.getElementsByClassName("col-md-6")[k].remove();
          return;
     }
    }
    test++;
        if(test >= 3){
            clearInterval(interval);
        }
},500)

})();