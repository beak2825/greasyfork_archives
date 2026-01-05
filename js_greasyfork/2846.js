// ==UserScript==
// @name           Mail Ad Remover Beta
// @description    Removes annoying Mail.ru animated and context adverts
// @author         Galchonok
// @include        http://e.mail.ru/*
// @include        https://e.mail.ru/*
// @version        1.3
// @namespace https://greasyfork.org/users/3077
// @downloadURL https://update.greasyfork.org/scripts/2846/Mail%20Ad%20Remover%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/2846/Mail%20Ad%20Remover%20Beta.meta.js
// ==/UserScript==

//Parent Element To animated and context adverts
grandparent = document.getElementById('ScrollBodyInner'); 
var removeMailAdverts = function(){
//Mail Adverts
document.getElementById('slot-container_2').style.visibility = 'hidden'; 
document.getElementById('slot-container_2').style.display = 'none';
document.getElementById('rb-context-left-slots').style.visibility = 'hidden';
document.getElementById('rb-context-left-slots').style.display = 'none';
document.getElementById('getmov230935510').style.visibility = 'hidden';
document.getElementById('getmov230935510').style.display = 'none';
document.getElementById('b-slot_left_direct').style.visibility = 'hidden';
document.getElementById('b-slot_left_direct').style.display = 'none';
}; 
//Below function happens whenever the contents of 
//grandparent change
grandparent.addEventListener("DOMSubtreeModified", removeMailAdverts, true);
//fires off the function to start with
removeMailAdverts();