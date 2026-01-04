// ==UserScript==
// @name         IRCAM latin tifinagh
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  changer le tifinagh en latin
// @author       You
// @match        https://tal.ircam.ma/conjugueur/conjugappl.php
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/421791/IRCAM%20latin%20tifinagh.user.js
// @updateURL https://update.greasyfork.org/scripts/421791/IRCAM%20latin%20tifinagh.meta.js
// ==/UserScript==

(function() {
    window.tifinaghize = (text)=>{
       var res = "";
       for(var i=0;i<text.length;i++){
         var char = text[i];
         if(window.tifinagh[char]){
           res+=window.tifinagh[char]
         }else{
           res+=char
         }
       }
       return res;
    }
    'use strict';
    window.tifinagh = {"a":"ⴰ","b":"ⴱ","g":"ⴳ","d":"ⴷ","ḍ":"ⴹ","e":"ⴻ","f":"ⴼ","k":"ⴽ","h":"ⵀ","ḥ":"ⵃ","ɛ":"ⵄ","q":"ⵇ","i":"ⵉ","j":"ⵊ","l":"ⵍ","m":"ⵎ","n":"ⵏ","u":"ⵓ","r":"ⵔ","ṛ":"ⵕ","ɣ":"ⵖ","s":"ⵙ","c":"ⵛ","t":"ⵜ","w":"ⵡ","y":"ⵢ","z":"ⵣ","ẓ":"ⵥ","'":"ⵯ"}
    setInterval(()=>{
      document.getElementById('textfield').value= tifinaghize(document.getElementById('textfield').value);
    },10)
    window.dtmz = {"ⴰ":"a","ⴱ":"b","ⴳ":"g","ⴷ":"d","ⴹ":"ḍ","ⴻ":"e","ⴼ":"f","ⴽ":"k","ⵀ":"h","ⵃ":"ḥ","ⵄ":"ɛ","ⵇ":"q","ⵉ":"i","ⵊ":"j","ⵍ":"l","ⵎ":"m","ⵏ":"n","ⵓ":"u","ⵔ":"r","ⵕ":"ṛ","ⵖ":"ɣ","ⵙ":"s","ⵛ":"c","ⵜ":"t","ⵡ":"w","ⵢ":"y","ⵣ":"z","ⵥ":"ẓ","ⵯ":"'"}
    window.det = (text)=>{
       var res = "";
       for(var i=0;i<text.length;i++){
         var char = text[i];
         if(window.dtmz[char]){
           res+=window.dtmz[char]
         }else{
           res+=char
         }
       }
       return res;

    }
    eval(document.body.innerHTML=det(document.body.innerHTML))
})();