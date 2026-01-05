// ==UserScript==
// @id             planetsuzy.org-1029042c-1bfd-412a-82a3-18b6e901a827@scriptish
// @name           planetsuzy remove subscription
// @version        0.1
// @namespace      
// @author         billysanca
// @description    Adds a 'remove subscription' button on the subscribe page
// @include        http://planetsuzy.org/subscription.php?do=*
// @include        *planetsuzy.org/subscription.php?do=*
// @include        http://planetsuzy.org/showthread.php?do=*
// @include        http://www.vamateur.com/subscription.php?do=*
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/17053/planetsuzy%20remove%20subscription.user.js
// @updateURL https://update.greasyfork.org/scripts/17053/planetsuzy%20remove%20subscription.meta.js
// ==/UserScript==

var urloriginal = document.URL;

urlremove = urloriginal.replace('addsubscription', 'removesubscription');

var newbtn = document.createElement("input");
newbtn.setAttribute = ('class', 'button');
newbtn.type = "button";
newbtn.accesskey = "r";
newbtn.value = "Unsubscribe";
newbtn.onclick = function(){
    window.location = urlremove;
};

if (document.URL = "www.vamateur.com*") {
    document.getElementsByTagName('div')[18].appendChild(newbtn);
    document.getElementByClassName('tcat').appendChild(newbtn);
}
if (document.URL = "planetsuzy.org*") {
    document.getElementsByTagName('div')[18].appendChild(newbtn);
    document.getElementByClassName('tcat').appendChild(newbtn);
}