// ==UserScript==
// @name         id changer
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  changes a html object's id to whatever you want without inspect. works great with my button clicker
// @author       twarped
// @match        http*://*/*
// @exclude      sites.google.com/*/edit
// @exclude      docs.google.com/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387796/id%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/387796/id%20changer.meta.js
// ==/UserScript==

var id = document. createElement("button");
id.innerHTML='change id'
var idbutton = document. getElementsByTagName("body")[0];
idbutton. appendChild(id);
id.addEventListener ("click",function idmaker(){
   var thing = prompt('id','');
    if(thing != null){
    var change = prompt('id ' +thing+ ' change to','')
    }
    document.getElementById(thing).id = change;
});
