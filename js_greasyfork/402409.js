// ==UserScript==
// @name        Nickname ----> Translate
// @author      ...
// @description ...
// @icon        https://www.gstatic.com/classroom/ic_product_classroom_144.png
// @include	https://classroom.google.com/*
// @downloadUrl https://greasyfork.org/scripts/402409-nickname-translate/code/Nickname%20----%3E%20Translate.user.js
// @updateUrl https://greasyfork.org/scripts/402409-nickname-translate/code/Nickname%20----%3E%20Translate.user.js
// @version     2020.06.26
// @namespace https://greasyfork.org/users/547514
// @downloadURL https://update.greasyfork.org/scripts/402409/Nickname%20----%3E%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/402409/Nickname%20----%3E%20Translate.meta.js
// ==/UserScript==
//

(function () {

    function findAndReplace(searchText, replacement, searchNode) {
        if (!searchText || typeof replacement === 'undefined') {
            // Throw error here if you want...
            return;
        }
        var regex = typeof searchText === 'string' ? new RegExp(searchText, 'g') : searchText,
            childNodes = (searchNode || document.body).childNodes,
            cnLength = childNodes.length;
	    excludes = 'html,head,style,title,link,meta,script,object,iframe';
        while (cnLength--) {
            var currentNode = childNodes[cnLength];
            if (currentNode.nodeType === 1 && (',' + excludes + ',').indexOf(',' + currentNode.nodeName.toLowerCase() + ',') === -1) {
                arguments.callee(searchText, replacement, currentNode);
            }
            if (currentNode.nodeType !== 3 || !regex.test(currentNode.data) ) {
                continue;
            }
            var parent = currentNode.parentNode,
                frag = (function(){
                    var html = currentNode.data.replace(regex, replacement),
                        wrap = document.createElement('div'),
                        frag = document.createDocumentFragment();
                    wrap.innerHTML = html;
                    while (wrap.firstChild) {
                        frag.appendChild(wrap.firstChild);
                    }
                    return frag;
                })();
            parent.insertBefore(frag, currentNode);
            parent.removeChild(currentNode);
        }
    }

    function translate() {
        var ts = {
            "Xenia Xenia":"Оксана Василівна",
            "ataman":"Костик Марін",
            "Едуард":"Лебідь Едуaрд",
            "RyDi":"Руснак Діма",
		};
        for(var t in ts) {
            findAndReplace(t,ts[t]);
        };
        setTimeout(translate, 500);
    };

    setTimeout(translate, 500);

})();