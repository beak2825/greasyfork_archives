// ==UserScript==
// @name         Anti-Censure JVC Reloaded
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  And the power they took from the people will return to the people.
// @author       Jean__Roulin
// @match        http://www.jeuxvideo.com/forums/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387414/Anti-Censure%20JVC%20Reloaded.user.js
// @updateURL https://update.greasyfork.org/scripts/387414/Anti-Censure%20JVC%20Reloaded.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var stickers=`
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkh" id="1kkh" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkg" id="1kkg" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkj" id="1kkj" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkk" id="1kkk" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkl" id="1kkl" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkm" id="1kkm" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkn" id="1kkn" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkr" id="1kkr" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kko" id="1kko" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkp" id="1kkp" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkq" id="1kkq" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kks" id="1kks" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkt" id="1kkt" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kku" id="1kku" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkv" id="1kkv" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1jnd" id="1jnd" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1jnc" id="1jnc" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1jne" id="1jne" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1jnf" id="1jnf" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1jng" id="1jng" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1jnh" id="1jnh" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1jni" id="1jni" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1jnj" id="1jnj" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1ljl" id="1ljl" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1ljj" id="1ljj" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1ljm" id="1ljm" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1ljn" id="1ljn" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1ljo" id="1ljo" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1ljp" id="1ljp" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1ljr" id="1ljr" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1ljq" id="1ljq" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lm9" id="1lm9" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lma" id="1lma" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmb" id="1lmb" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmc" id="1lmc" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmd" id="1lmd" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lme" id="1lme" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmf" id="1lmf" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmg" id="1lmg" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmi" id="1lmi" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lml" id="1lml" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmh" id="1lmh" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmj" id="1lmj" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmk" id="1lmk" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmm" id="1lmm" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmn" id="1lmn" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmo" id="1lmo" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmp" id="1lmp" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1mqv" id="1mqv" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1mqw" id="1mqw" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1mqx" id="1mqx" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1mqy" id="1mqy" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1mqz" id="1mqz" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1mr0" id="1mr0" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1mr1" id="1lmc" width="40px"/>
`

var reference=document.getElementById("bloc-formulaire-forum");var stickersBox=document.createElement("div");stickersBox.style.border="1px solid black";stickersBox.style.width="100%";stickersBox.style.marginTop="10px";stickersBox.style.marginBottom="10px";stickersBox.style.backgroundColor="white";stickersBox.style.padding="8px";reference.insertAdjacentElement("beforebegin",stickersBox);stickersBox.insertAdjacentHTML("afterbegin",stickers);stickersBox.insertAdjacentHTML("beforebegin",'<p style="font-weight:bold;font-size:14px";>Entrez votre message secret puis cliquez sur un sticker:</¨p> <br> <textarea id="secret-area" style="width:100%;resize:vertical"></textarea> <br> <input style="width:350px;" id="couleur_secret" type="text" placeholder="Couleur du texte (valeur en hexa, exemple : #fff)">');var stickersList=document.getElementsByClassName("secret-sticker");
for (let sticker of stickersList){sticker.onclick=function(){var secretValue=document.getElementById("secret-area").value
for (var i=0; i < secretValue.length; i++){secretValue=secretValue.replace(' ','_')}var code = new Array(secretValue.length);
for (var i=0;i<secretValue.length;i++){code[i]=secretValue.charCodeAt(i);}var secretmessage=btoa(code);var stickerPicked=this.id;var couleur=document.getElementById("couleur_secret").value;
if (couleur==""){couleur="#000000";}
if (code.length===0||code===undefined){document.getElementById("message_topic").value+=`[[sticker:p/1jnc[[sticker:p/${stickerPicked}]]`;} else {document.getElementById("message_topic").value+=`[[sticker:p/1jnc${couleur}#${secretmessage}[[sticker:p/${stickerPicked}]]`;}}}
var liste=["U3V1bWFz", "TWVuY2hvdi1HaXJv", "b2Rva2k=", "TGFuZXN0cmE=", "TGlrZUdvZA==", "a2lyaWtydW5n","YnVtYmxlYmVl","bWVuY2hvdi1naXJv","a3ZlbGRzc2FuZw==","b2Rva2k=","Y2VyemF0NDM=","ZXRvcmFrZW4=","W3RoZV1fc29ycm93","cmlyaV8xNQ==","c3BpeGVsXw==","YnJ5a291","NGtpdG8=","bibislayer","anZjX2NlZHJpeA==","c2F1bW9uYXJjZW5jaWVs"];var conteneur=document.getElementsByClassName("img-stickers");var pseudo=document.getElementsByClassName("account-pseudo")[0].innerHTML;
for(var i=0;i<conteneur.length;i++){
if(conteneur[i].alt.split("#")[2]!=undefined&&liste.indexOf(btoa(pseudo.toLowerCase()))==-1){var texte=conteneur[i].alt.split("#")[2].split("[")[0];var couleur_message=conteneur[i].alt.split("#")[1];var message_clair="";
for(var u=0;u<(texte.length-1);u++){message_clair=message_clair+texte[u];}
message_clair=atob(message_clair);var result="";
for(var a=0;a<message_clair.split(",").length;a++){result=result+String.fromCharCode(message_clair.split(",")[a]);}
for(var l=0;l<result.length;l++){result=result.replace("_"," ");}var p_message_clair=document.createElement("p");p_message_clair.setAttribute("style","font-weight: bold;color:#"+couleur_message);p_message_clair.innerHTML=result;p_message_clair.value=result;conteneur[i].setAttribute("style","display:none;");conteneur[i].after(p_message_clair);}}
})();