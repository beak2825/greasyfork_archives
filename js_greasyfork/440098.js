// ==UserScript==
// @name         1fichier resolve
// @namespace    http://tampermonkey.net/
// @version      0.6.2
// @description  resolver 1fichier (sauf captcha, le reste est automatique) (si ça ne s'ouvre pas autoriser les popup sur 1fichier.com (à droit dans l'url) )
// @author       DEV314R
// @include      *1fichier.com/?*
// @include      *hidester.com/fr/proxy/*
// @match        https://debridup.com*
// @match        https://iir.ai/*
// @icon         https://icons.duckduckgo.com/ip2/1fichier.com.ico
// @run-at       document-end
// @grant        window.close
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/440098/1fichier%20resolve.user.js
// @updateURL https://update.greasyfork.org/scripts/440098/1fichier%20resolve.meta.js
// ==/UserScript==
const tolérance=5//minute (réglage: 2 à 120 )

// "_self" (ouvre le lien sur la même page que 1fichier)
//    ou
// "_blank" (ouvre le lien sur une autre page que 1fichier)
const ouverture="_self"

var fermer=0// 1 ferme la page automatiquement ou 0 reste ouvert

GM_addStyle('body,div,#countdown{background-color:#000!important;color:#f3f3f3!important;}');

if(location.href.search(/iir.ai\/.+/gi)>-1){
  if(document.querySelector("#recaptcha-accessible-status")>-1){document.title="💬"+document.title}
 setTimeout(()=>{document.querySelector(".btn.btn-success.btn-lg").click()
 if(fermer==1){setTimeout(()=>{window.close(document.URL)},4000)
 }
 },12000)

}else if(location.href.search(/debridup.com\/#.+1fichier.com.+/gi)>-1){
document.title="⏳"+document.title
var ch1=decodeURI(location.href.match(/(?<=debridup.com\/#).+(?=&af=)|(?<=debridup.com\/#).+(?=&af=)?/gi)[0])
document.querySelector('#lien').value=ch1

setTimeout(()=>{document.querySelector("#debrider").click()
setTimeout(()=>{clearInterval()},60000)
lo()
 function lo(){
   var c2=document.querySelector("#debrid > p:nth-child(2) > a[href]")
  if(c2!=null){
  c2.setAttribute('target', '_self')
  c2.click()
  clearInterval()
  }else{
  setTimeout(()=>{lo()},2000)
  }
  }
},1000)

}else if(location.href.search(/https:\/\/1fichier.com\/\?/gi)>-1){

if (document.querySelector(".ct_warn span")==null){
setTimeout(function c(){document.querySelector("[value='Download'],[value='Acceder au téléchargement']").click()
					    document.title="⏳"+document.title
					    },500)
 if(document.querySelector('.ok.btn-general.btn-orange').textContent.match(/Click here|Cliquer ici/gi)[0]=true ){
 setTimeout(function c(){document.querySelector(".ok.btn-general.btn-orange").click()
						document.title="✔️"+document.title
setTimeout(function wc(){window.close(document.URL)},5000)
					   },500)}
}
else if(document.querySelector(".ct_warn span").textContent.match(/!/gi)[0]=true ){
document.title="⏳"+document.title
if(tolérance<=document.querySelector("form > div:nth-child(5).ct_warn").innerText.match(/\d+(?!minute.)|qu'un seul fichier à la fois/gi)[0]|| !document.querySelector("form > div:nth-child(5).ct_warn")>-1 ){
var y=location.href
document.body.insertAdjacentHTML('beforeend','<a id="cy" href="https://debridup.com/#'+y+'" target='+ouverture+' ></a>')
document.querySelector("#cy").click()

}else{
setTimeout(()=>{document.querySelector(".clock.flip-clock-wrapper").remove()},2000)
setTimeout(()=>{
var onMutate = function(){
setTimeout(()=>{document.querySelector("[value='Download'],[value='Acceder au téléchargement']").click()},1000)
}
let observer = new MutationObserver(onMutate);
observer.observe(document.body,{childList: true,subtree: true});
},3000)

}
}
}