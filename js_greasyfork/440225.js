// ==UserScript==
// @name         Old English
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Internet Troll
// @description  Converts text on all websites into Old English
// @include      /(https?:\/\/)?(www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)|(https?:\/\/)?(www\.)?(?!ww)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440225/Old%20English.user.js
// @updateURL https://update.greasyfork.org/scripts/440225/Old%20English.meta.js
// ==/UserScript==

function rpl(element, pattern, replacement) {
    for (let node of element.childNodes) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                rpl(node, pattern, replacement);
                break;
            case Node.TEXT_NODE:
                node.textContent = node.textContent.replace(pattern, replacement);
                break;
            case Node.DOCUMENT_NODE:
                rpl(node, pattern, replacement);
        }
    }

}
var d = document.body;
rpl(d,"s","ſ");
rpl(d,"G","Ᵹ");
rpl(d,"g","ᵹ");
rpl(d,"Th","Þ");
rpl(d,"th","þ");
rpl(d,"you","thou");
rpl(d,"your","thy");