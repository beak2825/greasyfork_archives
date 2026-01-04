// ==UserScript==
// @name     HWUpgrade - Anti mosche tze-tze
// @version  1
// @grant    none
// @include  https://www.hwupgrade.it/forum/showthread.php*
// @include  https://www.hwupgrade.it/forum/newreply.php*
// @run-at   document-start
// @description Schiaccia mosche tze-tze nel forum (funzione "ignore" avanzata)
// @namespace https://greasyfork.org/users/803627
// @downloadURL https://update.greasyfork.org/scripts/430673/HWUpgrade%20-%20Anti%20mosche%20tze-tze.user.js
// @updateURL https://update.greasyfork.org/scripts/430673/HWUpgrade%20-%20Anti%20mosche%20tze-tze.meta.js
// ==/UserScript==

 
const LEVEL_SWATTER = 1; // Paletta per le mosche (minimale): rimuove i post delle mosche tze-tze (che siano in "ignore" o meno)
const LEVEL_DDT = 2;     // DDT (consigliato): come la paletta, ma "riassumendo succintamente" le citazioni delle mosche da parte degli utenti non mosche
const LEVEL_KABOOM = 3;  // KA-BOOM! (drastico, ma quanno ce vo', ce vo'): come la paletta, ma rimuove completamente anche i post che citano le mosche
 
const QUOTE_ID = "Originariamente inviato da";
const MEMBER_ID = "member.php";
const MSG_ID = "Messaggio"
 
let flies = ['nickname1','nickname42','nickname88']; // array di nomi di mosche tze-tze da annientare;
// Nel caso di un solo utente: let flies = ['nickname'];
 
let killLevel = LEVEL_DDT; // livello annientamento dei post delle mosche tze-tze
 
function isReplying() { return document.URL.indexOf("newreply") != -1 };
 
function callback( mutations)
{
    for( const mutation of mutations)
        for( const node of mutation.addedNodes)
            if( node instanceof Element)
                if( node.tagName == "A" && !isReplying() && node.href.indexOf( MEMBER_ID) != -1 || 
                    node.tagName == "TD" && isReplying() && node.className == "alt1" ||
                    node.tagName == "STRONG" && node.parentElement.tagName == "DIV" && node.parentElement.textContent.indexOf( QUOTE_ID) != -1 &&
                        killLevel >= LEVEL_DDT)  
                    for( const fly of flies)
                        if( node.textContent == fly)
                        {
                            let flyPoop = node;
                          
                            if( flyPoop.tagName == "STRONG" && killLevel == LEVEL_DDT)
                            {        
                                flyPoop.nextElementSibling.style.display = "none";
                                flyPoop.parentElement.nextElementSibling.textContent = "tze-tze tze-tze tze-tze";  
                            }
                            else
                            {
                                if( !isReplying())
                                    while( flyPoop.tagName != "DIV" || flyPoop.className != "page")
                                         flyPoop = flyPoop.parentElement;
                                else // replying
                                {                              
                                    while( flyPoop.tagName != "TR" || flyPoop.title.indexOf( MSG_ID) == -1)
                                        flyPoop = flyPoop.parentElement;
 
                                    flyPoop.previousElementSibling.style.display = "none";
                                }
                              
                                flyPoop.style.display = "none";
                            }
                        }              
}
 
var observer = new MutationObserver( callback);
 
observer.observe( document, {childList: true, subtree: true});