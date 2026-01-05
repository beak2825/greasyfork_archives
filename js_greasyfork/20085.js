// ==UserScript==
// @name DiepIoRG
// @description For now just chatbox. Wait til' more =)
// @author nosomebodies
// @license MIT
// @version 0.0.0.0.0.0.0.0.0.0.0.0.0.1.1
// @include http://diep.io/*
// @namespace https://greasyfork.org/users/46319
// @downloadURL https://update.greasyfork.org/scripts/20085/DiepIoRG.user.js
// @updateURL https://update.greasyfork.org/scripts/20085/DiepIoRG.meta.js
// ==/UserScript==
// [1] 
str = "<script type=\"text\/javascript\">\r\n    var chatovodOnLoad = chatovodOnLoad || [];\r\n    chatovodOnLoad.push(function() {\r\n        chatovod.addChatButton({host: \"rgdiep.chatovod.com\", align: \"bottomRight\",\r\n            width: 600, height: 380,z-index: 400, defaultLanguage: \"en\"});\r\n    });\r\n    (function() {\r\n        var po = document.createElement(\'script\');\r\n        po.type = \'text\/javascript\'; po.charset = \"UTF-8\"; po.async = true;\r\n        po.src = (document.location.protocol==\'https:\'?\'https:\':\'http:\') + \'\/\/st1.chatovod.com\/api\/js\/v1.js?2\';\r\n        var s = document.getElementsByTagName(\'script\')[0];\r\n        s.parentNode.insertBefore(po, s);\r\n    })();\r\n<\/script>"
function create(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}
var fragment = create(str);
document.body.insertBefore(fragment, document.body.childNodes[0]);