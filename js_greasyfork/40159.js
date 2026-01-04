// ==UserScript==
// @name          Xhamster Helper(just script) - Totally or Viewable DELETED Users (comp Beta) v.02
// @namespace https://greasyfork.org/fr/users/7434-janvier56
// @homepage https://greasyfork.org/fr/users/7434-janvier56

// @description   Just script - Companion for my fork of Xhamster Private Profiles : mark viewable deleted user with a Green X ((lib-add-stylish-string))

//
// @version       v.02.05
//
// @include       https://*xhamster.com/*
//
//
// @run-at        document-start
//
//
// @downloadURL https://update.greasyfork.org/scripts/40159/Xhamster%20Helper%28just%20script%29%20-%20Totally%20or%20Viewable%20DELETED%20Users%20%28comp%20Beta%29%20v02.user.js
// @updateURL https://update.greasyfork.org/scripts/40159/Xhamster%20Helper%28just%20script%29%20-%20Totally%20or%20Viewable%20DELETED%20Users%20%28comp%20Beta%29%20v02.meta.js
// ==/UserScript==


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