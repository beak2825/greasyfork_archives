// ==UserScript==
// @name         iFrame remover
// @namespace    http://tampermonkey.net/
// @version      0.111
// @description  try to take over the world!
// @author       Life
// @run-at      document-start
// @include http://*/*
// @include https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417463/iFrame%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/417463/iFrame%20remover.meta.js
// ==/UserScript==

(function() {
    var frames=['discord.com','facebook.com','vk.com'];
    var itr=0;
    var deb=true;
    function check(o){return frames.some(x=> o.indexOf(x)+1)}
    function dtct(o){
        if (check(o.outerHTML+"")) {
            if (deb){console.log(itr++ +" _remove"+o.nodeName); console.log(o);}
            o.remove();
        }
    }
    function subchild(o){
        if (o.childNodes) for (var child of o.childNodes) {
            if (child.nodeName!='IFRAME') { subchild(child); return;}
            dtct(child);
        }
    }
    //if((this.locBase+"").indexOf('vk.com/widget')) console.log(this);
    var ls = document.getElementsByTagName('iframe');
    for (var el of ls){
        console.log(el);
        if ((el.src+"").indexOf('vk.com')+1){el.remove();}
        if ((el.src+"").indexOf('facebook.com')+1){el.remove();}
        if ((el.src+"").indexOf('discord.com')+1){el.remove();}
    }

    if (observer) observer.disconnect();
    var observer = new MutationObserver(function(mutationList) {
        for (var mutation of mutationList) { //console.log(mutation); /*removedNodes*/
            if (deb)console.log(mutation);
            if (mutation.addedNodes.length) for (var child of mutation.addedNodes){
                if (deb)console.log(itr++ +" "+child.nodeName);
                subchild(child);
                if (child.nodeName=='IFRAME') dtct(child);
                if (document.domain=="e.mail.ru"){
                    if ((child.offsetWidth<=240)
                        &&(child.offsetWidth>=235)) {console.log(mutation); console.log(child); child.innerHTML=''; child.parentNode.parentNode.remove(); }
                   // if (child.marginRight)
                }
            }
        }
    });
    observer.observe(document, {childList: true, subtree: true});
})();