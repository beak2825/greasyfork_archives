// ==UserScript==   
// @name            TextileChat
// @namespace       skyboy@kongregate
// @author          skyboy
// @version         1.0.1.1
// @description     Adds a variant textile support to chat
// @include         *://www.kongregate.com/games/*/*
// @homepage        
// @downloadURL https://update.greasyfork.org/scripts/17736/TextileChat.user.js
// @updateURL https://update.greasyfork.org/scripts/17736/TextileChat.meta.js
// ==/UserScript==    
if (/^\/?games\/[^\/]+\/[^\/?]+(\?.*)?$/.test(window.location.pathname))
setTimeout(function() {
window.location.assign("javascript:holodeck.addIncomingMessageFilter(function(m,nF){return nF(m.gsub(/[\\s\\S]+/, function(b,t){b=b[0];while(!!(a=b.match(/(\\[|\\B)(\\||\\+|\\_|\\-)((?:\\b|<)[\\s\\S]+(?:\\b|>))\\2(\\]|\\B)/i))){switch(a[2]){case'|':t='b';break; case'+':t='u';break; case'_':t='i';break; case'-':t='strike'}; b=b.replace(a[0],'<'+t+'>'+a[3]+'</'+t+'>')};return b}), nF);});void(0)");
}, 1250);