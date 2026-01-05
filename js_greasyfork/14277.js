// ==UserScript== 
// @name Lenny Face
// @author david0ff
// @version 1.0.1
// @description Just type lenny on fb chat.
// @include https://www.facebook.com/*
// @namespace https://greasyfork.org/users/21339
// @downloadURL https://update.greasyfork.org/scripts/14277/Lenny%20Face.user.js
// @updateURL https://update.greasyfork.org/scripts/14277/Lenny%20Face.meta.js
// ==/UserScript==

var f5 = setInterval(Lenny,100);

function Lenny(){
    var t = document.getElementsByClassName("uiTextareaAutogrow");
        for(i=0; i<t.length; i++){
            document.getElementsByClassName("uiTextareaAutogrow")[i].onkeyup = function() {
                var rep = this.value.replace("lenny", "( ͡° ͜ʖ ͡°)");
                this.value = rep;
            }
        }
}

Lenny();