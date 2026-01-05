// ==UserScript==
// @name         MSPFA Nightfall Fix
// @namespace    http://nallar.me/
// @version      0.1
// @description  fix broken encoding on some pages of nightfall
// @author       You
// @match        http://mspfanventures.com/?s=620&p=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21640/MSPFA%20Nightfall%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/21640/MSPFA%20Nightfall%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    fix(document.body);
    function uniq(a){
        var o = {}, i, l = a.length, r = [];
        for(i=0; i<l;i+=1) o[a[i]] = a[i];
        for(i in o) r.push(o[i]);
        return r;
    }
    var wkMutation = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    (new wkMutation(function(mutations, observer){
					var mut = [];
					for(var i = 0, len = mutations.length; i < len;i++){
						mut.push(mutations[i].target);
					}
					mut = uniq(mut);
					for(i = 0, len = mut.length; i < len; i++){
						domInsertFunction({target:mut[i]});
					}
				})).observe(document.body, {subtree: true, childList: true, characterData: true, attributes: false,});
    var goFind = true;
    function domInsertFunction(evt){
			if(!evt.target || !evt.target.getElementsByTagName || !goFind){
				return;
			}
			goFind = false;
			fix(evt.target);
            goFind = true;
    }
    function fix(root){
			var node = root.firstChild;
			while(node){
				if(node.nodeType == 3){
					var text = node, v;
                    if (text.nodeValue && text.nodeValue.length > 0) {
                        var t = text.nodeValue;
                        text.nodeValue = text.nodeValue.replace(/\xe2/g, "'");
                        text.nodeValue = text.nodeValue.replace(/\uFFFD/g, "");
                        text.nodeValue = text.nodeValue.replace(/ï¿½ï¿½/g, "");
                    }
				}
				if (node.hasChildNodes()){
					node = node.firstChild;
				} else {
					while (!node.nextSibling){
						node = node.parentNode;
						if (node == root){
							return;
						}
					}
					node = node.nextSibling;
				}
			}
		}
})();