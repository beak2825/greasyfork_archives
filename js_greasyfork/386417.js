// ==UserScript==
// @name         Balz.io auto solo tricksplit
// @namespace    http://tampermonkey.net/
// @version      1.09
// @description  Letter key is A
// @author       James K
// @match        *.balz.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386417/Balzio%20auto%20solo%20tricksplit.user.js
// @updateURL https://update.greasyfork.org/scripts/386417/Balzio%20auto%20solo%20tricksplit.meta.js
// ==/UserScript==

(function() {
   //Reads your score
setInterval(function(){dd=document.getElementById("93dk2e").innerHTML; if(dd.includes(".")){ree=1;} dd=dd.replace(",", ""); dd=dd.replace("k", ""); dd=dd.replace(".", ""); pp= parseInt(dd);  if(ree==1){ree=0; pp=pp*1000;}}, 20);
//Function to split
function split() {
        window.onkeydown({keyCode: 32});
window.onkeyup({keyCode: 32});
          };
//Checking if “a” is pressed
window.addEventListener("keypress", function(event) {
    if (event.keyCode == 97) {
        hitbutt();
    }
});
var fed = 0;
setInterval(function(){if(fed==1){window.onkeydown({keyCode: 87})}}, 1);
function feed(t){fed=1; setTimeout(function(){fed=0;}, t)};

function hitbutt(){
if(pp<=1500){feed(8*24);
 split();split();
}
else if(pp<=3000&&pp>1500)
{feed(18*24);
split();split();split();
}
else if(pp<=6000&&pp>3000)
{feed(20*24);
split();split();split();split();sleep(1600);
}
else if(pp>6000)
{feed(30*24);
split();split();split();split();split();split();split();
}
};





})();

//James K 2019 All right reserved ©