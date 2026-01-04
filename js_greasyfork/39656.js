// ==UserScript==
// @name         New Userscript翻译
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world! 翻译你
// @author       You
// @include      *.sslibrary.com/cat/cat2xml.dll?kid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39656/New%20Userscript%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/39656/New%20Userscript%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var level = 0;
	function display(elem){
		var elem_child = elem.childNodes;
		for(var i=0; i<elem_child.length;i++){
			/*if(elem_child[i].nodeName == "#text" && !/\s/.test(elem_child.nodeValue)){
				elem.removeChild(elem_child[i]);
			}*/if(elem_child[i].nodeType == 1){
				if(elem_child[i].parentElement.tagName == 'TREEVIEW'){
					//console.warn(elem_child[i].parentElement);
					level = 0;
				}
				else if(elem_child[i].parentElement.tagName == 'TREE'){
					//console.warn(elem_child[i].parentElement);
					level ++;
				}
				console.log(level + '\t'.repeat(level) + elem_child[i].attributes[1].value + '\t' + elem_child[i].attributes[2].value + '\n');
				if(elem_child[i].hasChildNodes){
					//console.warn(elem_child[i]);
					display(elem_child[i]);
				}
			}
		}
	}
	var root=document.body.firstChild;
	//var trees=root.getElementsByTagName("tree");
	//var nodes=root.getElementsByTagName("node");
	//console.log(trees);
	//console.warn(nodes);
	//console.log(root.childNodes);
	console.log(root);
	display(root);
	// Your code here...
})();