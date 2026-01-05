// ==UserScript==
// @name        Funnyjunk Notification Preview Radius Changer
// @namespace   Posttwo
// @description Changes the radius of the notification preview
// @include     *.funnyjunk.com/*
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/3536/Funnyjunk%20Notification%20Preview%20Radius%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/3536/Funnyjunk%20Notification%20Preview%20Radius%20Changer.meta.js
// ==/UserScript==

(function() {
    var css = "\n#rightPopupAlert { border-radius: 2px;!important;  border-width: thin; }\n}";
if (typeof GM_addStyle != "undefined") {
    GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
    PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
    addStyle(css);
} else {
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        heads[0].appendChild(node); 
    }
}
})();
 