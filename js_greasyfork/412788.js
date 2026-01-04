// ==UserScript==
// @name     Geekhub Markdown Editor
// @namespace https://geekhub.com/
// @version  4
// @description  add CodeMirror Editor for comment & topic
// @author       dallaslu
// @match        https://geekhub.com/*
// @match        https://www.geekhub.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/codemirror/lib/codemirror.min.js
// @require      https://cdn.jsdelivr.net/npm/codemirror/mode/markdown/markdown.js
// @require      https://cdn.jsdelivr.net/npm/codemirror/mode/gfm/gfm.js
// @require      https://cdn.jsdelivr.net/npm/codemirror/addon/mode/overlay.js
// @downloadURL https://update.greasyfork.org/scripts/412788/Geekhub%20Markdown%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/412788/Geekhub%20Markdown%20Editor.meta.js
// ==/UserScript==

(function() {
	'use strict';
  
  	var ghSchemeButtons = {
        'light': 'dark',
        'dark': 'darcula',
        'solar': 'darcula',
        'ocean': 'darcula',
        'jade': 'default'
    };

    function init() {
      	var cmElement = document.querySelector('.CodeMirror');
      	if(!cmElement){
            var textElement = document.getElementById('comment-box') 
                || document.getElementById('post_content')
                || document.getElementById('second_hand_content')
                || document.getElementById('molecule_content')
                || document.getElementById('group_buy_content')
                || document.getElementById('service_content');
          
          	if(textElement){
				var theme = '';
                for (var btn in ghSchemeButtons) {
                    var schemeBtn = document.getElementById(btn);
                    if (schemeBtn && !schemeBtn.classList.contains('hidden')) {
                        theme = ghSchemeButtons[btn];
                        break;
                    }
                }

				theme = theme || 'darcula';
              
              	loadStyles('https://cdn.jsdelivr.net/npm/codemirror/lib/codemirror.css');
              	loadStyles('https://cdn.jsdelivr.net/npm/codemirror/theme/darcula.css');
              
      			var cm = CodeMirror.fromTextArea(textElement, {
    				mode : {
						name : "gfm",
						tokenTypeOverrides : {
							emoji : "emoji"
						}
					},
					lineWrapping : true,
					lineNumbers : false,
              	    theme: theme
       		 	});
              
              	cm.on('change', function(){
            		cm.save();
                });
              	
              	// TODO clear with textarea after submit
            }
        }
    }
  
  	function loadStyles(url) {
		var link = document.createElement("link");
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = url;
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(link);
	}

    var observer = new MutationObserver(function(doc, observer) {
		init();
    });

    observer.observe(document, {
        characterData: true,
        childList: true,
        attributes: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true
    });

    init();
})();