// ==UserScript==
// @name         auto dl megaup.net
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Click sur "Create Download Link" après le décompte et ferme l'onglet automatiquement.
// @author       DEV314R
// @include      *megaup.net/*.rar
// @include      *download.megaup.net/?idurl=*
// @icon         https://icons.duckduckgo.com/ip2/megaup.net.ico
// @run-at       document-end
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/427182/auto%20dl%20megaupnet.user.js
// @updateURL https://update.greasyfork.org/scripts/427182/auto%20dl%20megaupnet.meta.js
// ==/UserScript==
if(location.href.search(/download\.megaup\.net\/\?idurl/gi)>-1){
 document.title="✔️"+document.title
 setTimeout(()=>{window.close(document.URL)},5000)
}else{
 document.title="⏳"+document.title
 setTimeout(()=>{document.querySelector('[value="Create Download Link"]').click()},6000)
}