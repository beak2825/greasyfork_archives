// ==UserScript==
// @name          Xhamster Helper - Spam user indicator + infos about DELETED Users v.51
// @namespace     https://greasyfork.org/en/users/7434-janvier56
// @description   The SPAM indicator is now (with the New Xhamster design) the only useful infos
//
// @version       v.51
//
// @include       https://*xhamster.com/*
//
// @require       https://greasyfork.org/scripts/24621-lib-add-stylish-string/code/lib-add-stylish-string.js
//
// @run-at        document-start
//
// @resource      css  https://pastebin.com/raw/VruvGQTw
//
// @grant         GM_getResourceText
//
// @downloadURL https://update.greasyfork.org/scripts/24376/Xhamster%20Helper%20-%20Spam%20user%20indicator%20%2B%20infos%20about%20DELETED%20Users%20v51.user.js
// @updateURL https://update.greasyfork.org/scripts/24376/Xhamster%20Helper%20-%20Spam%20user%20indicator%20%2B%20infos%20about%20DELETED%20Users%20v51.meta.js
// ==/UserScript==

window.addStylish(GM_getResourceText('css'));
/*
======== pseudo elements  - innerHTML - Using attr(), with pseudo-elements and JavaScript
== https://tiffanybbrown.com/2014/11/using-attr-with-pseudo-elements-and-javascript/
 we'll set a data-txt attribute using DOM scripting.
 Here we've just copied the innerHTML of our paragraph element 
 to the data-txt attribute when the DOMContentLoaded event fires.
window.addEventListener('DOMContentLoaded', function(){
    var p = document.querySelector('p');
    p.dataset.txt = p.innerHTML;
}
window.addEventListener('DOMContentLoaded', function(){
    var p = document.querySelector('p');
    p.dataset.txt = p.innerHTML;
    p.classList.add('triptych');
},false);

*/
window.addEventListener('DOMContentLoaded', function(){
    var p = document.querySelector('.entity-author-container__name>span');
    p.dataset.txt = p.innerHTML;
    p.classList.add('DEL');
},false);