// ==UserScript==
// @name mdBook Single-Page Helper
// @description Adds a nice single-page mode to mdBook by augmenting the print version
// @version 1
// @grant unsafeWindow
// @run-at document-start
// @match https://*/*
// @license MIT
// @namespace https://greasyfork.org/users/833386
// @downloadURL https://update.greasyfork.org/scripts/435558/mdBook%20Single-Page%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/435558/mdBook%20Single-Page%20Helper.meta.js
// ==/UserScript==

(() => {
  const old_bse = document.onbeforescriptexecute;
  const ef = (f) => exportFunction(f, unsafeWindow);
  const is_print = (s) => s.innerHTML.includes("window.setTimeout(window.print");
  const magic_anchor = "#suppress_print";
  
  let is_md_memo = false;
  const is_md = () => is_md_memo || (() => { 
    let iterator = document.createNodeIterator(document.head, NodeFilter.SHOW_COMMENT);
    
    for (let comment = null; comment = iterator.nextNode();)
		  if (comment.nodeValue.includes("mdBook"))
		    return true;
    
    return false;
  })();
  
	const add_button = function() {
    if (!is_md())
    	return;
		const new_title = "View as single page";
    let buttons = document.querySelector("#menu-bar > .right-buttons");
    let print_button = buttons.querySelector(".fa-print").parentElement;
    let new_button = print_button.cloneNode(true);
    let new_icon = new_button.querySelector(".fa-print");

    new_icon.classList.replace('fa-print', 'fa-file');
    new_button.setAttribute('href', `${new_button.getAttribute('href')}${magic_anchor}`);
    new_button.setAttribute('title', new_title);
    new_button.setAttribute('aria-label', new_title);
    buttons.prepend(new_button);
  };
  const anchorify = function() {
    document.querySelectorAll(".chapter-item.expanded > a").forEach(a => {
    	let id = [...a.childNodes].filter(x => x.nodeName == "#text")[0]
        .textContent.trim()
      	.toLowerCase()
        .replaceAll(/\s/g, '-')
      	.replaceAll(/[^a-z0-9_-]/g, '');
      if (!document.getElementById(id)) {
        a.removeAttribute('href');
        a.setAttribute('disabled', "disabled");
        a.style.cssText = "cursor: no-drop; opacity: 0.2"
      } else {
      	a.setAttribute('href', `#${id}`);
      }
    });
  };
  window.addEventListener('load', add_button);
  
  document.onbeforescriptexecute = function(e) {
    if (is_md() && is_print(e.target) && window.location.hash == magic_anchor) {
      let oldprint = window.print;
      
      /* suppress a single scripted print then restore it */
      unsafeWindow.print = ef(function() {
        unsafeWindow.print = ef(oldprint);
      });

      window.removeEventListener('load', add_button);
      window.addEventListener('load', anchorify);
      document.onbeforescriptexecute = old_bse;
    }
  };

})();




