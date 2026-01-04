// ==UserScript==
// @name         True caller
// @namespace    https://greasyfork.org/en/users/728780-turbo-cafe-clovermail-net
// @description  Search truecaller database
// @include      *
// @version      1.01
// @run-at       document-idle
// @author       turbo.cafe@clovermail.net
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/421581/True%20caller.user.js
// @updateURL https://update.greasyfork.org/scripts/421581/True%20caller.meta.js
// ==/UserScript==

(function () {
    function linkifyPhoneNumber() {
        document.body.normalize();
        function linkifyNode(n) {
            var M, R, currentNode;
            if (n.nodeType == 3) {
                const phonePosition = n.data.search(/\+380[^\s]*/);
                if (phonePosition < 0) return;
                M = n.splitText(phonePosition);
                R = M.splitText(RegExp.lastMatch.length);
                const linkTag = document.createElement("A");
                linkTag.href = "https://www.truecaller.com/search/ua/" + M.data;
                linkTag.appendChild(M);
                R.parentNode.insertBefore(linkTag, R);
            } else if (n.tagName != "STYLE" && n.tagName != "SCRIPT" && n.tagName != "A")
                for (let i = 0; currentNode = n.childNodes[i]; ++i) {
                    linkifyNode(currentNode);
                }
        }
        linkifyNode(document.body);
    }
    GM_registerMenuCommand('Linkify phone number', linkifyPhoneNumber);
})();
