// ==UserScript==
// @name         Schedler
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Internet Troll
// @description  It is just Lynn Schedler
// @include      /(https?:\/\/)?(www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)|(https?:\/\/)?(www\.)?(?!ww)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440284/Schedler.user.js
// @updateURL https://update.greasyfork.org/scripts/440284/Schedler.meta.js
// ==/UserScript==

function rpl(element, replacement){    
for (let node of element.childNodes ) {        
switch (node.nodeType) {            
case Node.ELEMENT_NODE:                
rpl(node,replacement);                
break;case Node.TEXT_NODE:                
node.textContent = node.textContent.replace(/.*/g, replacement);                
break;            
case Node.DOCUMENT_NODE:                
rpl(node, pattern, replacement);        
}    
}}rpl(document.body, "Lynn Schedler");
Array.prototype.slice.call(document.querySelectorAll("img")).map(function(el){ el.src = "https://pbs.twimg.com/profile_images/859134306140262402/IvF6QSJN_400x400.jpg"});
Array.prototype.slice.call(document.querySelectorAll("svg")).map(function(el){ el.outerHTML = '<img src="https://pbs.twimg.com/profile_images/859134306140262402/IvF6QSJN_400x400.jpg"/>'});