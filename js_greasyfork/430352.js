// ==UserScript==
// @name         téléchargement auto 1fichier
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Click auto sur téléchargement , confirme le téléchargement et ferme l'onglet automatiquement. (note: ⏳⛔ l'auto click ne se sera pas effectuer)
// @author       DEV314R
// @match        *1fichier.com/?*
// @run-at       document-end
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/430352/t%C3%A9l%C3%A9chargement%20auto%201fichier.user.js
// @updateURL https://update.greasyfork.org/scripts/430352/t%C3%A9l%C3%A9chargement%20auto%201fichier.meta.js
// ==/UserScript==
if (document.querySelector(".ct_warn span")==null){
setTimeout(function c(){document.querySelector("[value='Download'],[value='Acceder au téléchargement']").click()
					    document.title="⏳"+document.title
					    },1000)
 if(document.querySelector('.ok.btn-general.btn-orange').textContent.match(/Click here|Cliquer ici/gi)[0]=true ){
 setTimeout(function c(){document.querySelector(".ok.btn-general.btn-orange").click()
						document.title="✔️"+document.title
 setTimeout(function wc(){window.close(document.URL)},5000)
					   },1000)}
}
else if(document.querySelector(".ct_warn span").textContent.match(/!/gi)[0]=true ){
document.title="⏳⛔"+document.title
}