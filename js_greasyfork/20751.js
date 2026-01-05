// ==UserScript==
// @name         Anti ASCII
// @namespace    Klatu
// @version      1
// @description  Oculta los mensajes con más de 15 caracteres 'raros'
// @author       Klatu
// @match        http://www.kongregate.com/games/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20751/Anti%20ASCII.user.js
// @updateURL https://update.greasyfork.org/scripts/20751/Anti%20ASCII.meta.js
// ==/UserScript==

OCULTAR_SOLO_SI_SOLO_TIENE_CARACTERES_RAROS=false
LIMITE_DE_CARACTERES_RAROS=15

klatu=window.klatu||{}
    
ChatDialogue.prototype.displayUnsanitizedMessageAntesDeAntiASCII=ChatDialogue.prototype.displayUnsanitizedMessage
ChatDialogue.prototype.displayUnsanitizedMessage=function(a,b,c,d){
    for(var i=0, caracteresRaros=0; i<b.length; i++) if(b.charCodeAt(i)>255){
        caracteresRaros++
    }
    if((!OCULTAR_SOLO_SI_SOLO_TIENE_CARACTERES_RAROS||caracteresRaros)&&caracteresRaros<=LIMITE_DE_CARACTERES_RAROS) this.displayUnsanitizedMessageAntesDeAntiASCII(a,b,c,d)
}