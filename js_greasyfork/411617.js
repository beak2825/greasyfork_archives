// ==UserScript==
// @name     Tinder Auto-Like By N.S
// @version  1
// @grant    none
// @match    *://tinder.com/*
// @description like anynone in second
// @namespace astroid.com.tr
// @downloadURL https://update.greasyfork.org/scripts/411617/Tinder%20Auto-Like%20By%20NS.user.js
// @updateURL https://update.greasyfork.org/scripts/411617/Tinder%20Auto-Like%20By%20NS.meta.js
// ==/UserScript==
function likeByButton() { setInterval(function(){
    var buttons = document.getElementsByTagName("button");
    var button;
    var global_i;

    for (var i = 0; i < buttons.length; i++) {
       var attr = buttons[i].getAttribute("aria-label");
       if (attr == "Beğen") {
           button = buttons[i];
           global_i = i;
            //console.log("Beğen Butonunu Bulduk Agam");
           break;
       }        
    } 

    if (button =! null) {
        document.getElementsByTagName("button")[i].click();
    }else{
        console.log("There is no like button");
    }

},100);
}




likeByButton();