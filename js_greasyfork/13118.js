// ==UserScript==
// @name        LT assistant
// @description Переименовывание компаниий
// @author      Boltegg
// @icon        http://www.linktrust.com/favicon.ico
// @include	http://account.linktrust.com/New/Reports/CampaignPerformance
// @include	https://account.linktrust.com/New/Reports/CampaignPerformance
// @version     1
// @namespace
// @grant       none
// @namespace https://greasyfork.org/users/18149
// @downloadURL https://update.greasyfork.org/scripts/13118/LT%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/13118/LT%20assistant.meta.js
// ==/UserScript==

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
			"WL - INT - French":"ZEN TEST 1",
			"WL - INT - Germa":"ZEN TEST 2",
			//"(US)":"tyt SKOBOWKI",
			"WL - GM - CLA(AUGBNZIEIRCA)":"tyt SKOBOWKI",
			"WL - INT - 1P - (MYSGINPHID...":"tyt SKOBOWKI 2222",
			"：":":",
			"，":", ",
		};
        for(var t in ts) {
            findAndReplace(t,ts[t]);
        };
        setTimeout(translate, 1000);
    };

    setTimeout(translate, 1000);

})();
