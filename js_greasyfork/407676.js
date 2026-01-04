// ==UserScript==
// @name Messagerie fix
// @version 1.0.
// @description A new userstyle
// @author Slytia
// @grant GM_addStyle
// @run-at document-start
// @include https://www.dreadcast.net/Main
// @namespace https://greasyfork.org/users/669925
// @downloadURL https://update.greasyfork.org/scripts/407676/Messagerie%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/407676/Messagerie%20fix.meta.js
// ==/UserScript==
(function() {
    let css=` div[id^="db_message_"] {
        width: 600px !important;
        height: 450px !important;
    }

    .dataBox .message .contenu .avatar {
        width: 70px;
        height: 70px;
    }

    .dataBox .message .zone_reponse {
        width: 406px !important;
        height: 450px !important;
    }

    .dataBox .message .zone_conversation {
        width: 134px !important;
        height: 300px !important;
    }
    `;
    if (typeof GM_addStyle !=="undefined") {
        GM_addStyle(css);
    }
    else {
        let styleNode=document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }
}
)();