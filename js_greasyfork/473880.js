// ==UserScript==
// @name              Link Wrapper
// @author             TM
// @namespace    https://trap.jp/
// @version           0.1
// @description     Wraps links with specified protocols in <a> tags.
// @match             *://*/*
// @grant               none
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/473880/Link%20Wrapper.user.js
// @updateURL https://update.greasyfork.org/scripts/473880/Link%20Wrapper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var regexp_url = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g;

    var wrapLink = function(all, url, h, href) {
        return '<a href="h' + href + '" target="_blank">' + url + '</a><br/>';
    }

    /**
     * 渡されるコンテンツ:
     *   - <div>hoge<div>...<div>fuga</div>
     *  <div>hogefuga</div>
     */
    function wrapLinks(element) {
        var textContent = "";
        if(element.nodeType === 3) {
            textContent = element.textContent;
        }
        else{
            for(var elem of element.childNodes){
                console.log(elem);
                console.log(elem.nodeType);
                if(elem.nodeType === 3) {
                    textContent += elem.textContent;
                }
            }
        }
        if (textContent) {
            var newTextContent = textContent.replace(regexp_url, wrapLink);
            if (newTextContent !== textContent) {
                element.innerHTML = newTextContent;
            }
        }
    }

    function traverseAndWrap(element) {
        if(element.tagName === "A" || element.tagName === "STYLE" || element.tagName === "SCRIPT"){
            return;
        }
        if (element.childNodes.length === 1) {
            console.log(element);
            wrapLinks(element);
        }

        for (var i = 0; i < element.childNodes.length; i++) {
            var childNode = element.childNodes[i];
            if (childNode.nodeType === 1) {
                traverseAndWrap(childNode);
            }
        }

    }

    window.addEventListener('load', function() {
        traverseAndWrap(document.body);
    });
})();