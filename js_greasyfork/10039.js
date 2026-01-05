// ==UserScript==
// @name        MiWiFi mini RUS
// @description Перевод настроек роутера
// @author      SilentTwilight
// @icon        http://seller.aliexpress.com/education/marketing/tools/TradeManager.html?tracelog=26346_tm2/
// @include	*http://seller.aliexpress.com/education/marketing/tools/TradeManager.html?tracelog=26346_tm2/*
// @include	http://seller.aliexpress.com/education/marketing/tools/TradeManager.html?tracelog=26346_tm2/*
// @version     1.0 build 6
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/10039/MiWiFi%20mini%20RUS.user.js
// @updateURL https://update.greasyfork.org/scripts/10039/MiWiFi%20mini%20RUS.meta.js
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
			"发布产品":"Разместить свои товары",
                        "快速发货":"Быстрая Доставка",
				
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