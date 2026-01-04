// ==UserScript==
// @name         Custom media url
// @namespace    https://github.com/xue-blood/cup
// @version      0.31
// @description  Open media in html in ONE click!
// @author       doolb
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368527/Custom%20media%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/368527/Custom%20media%20url.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
var all = document.querySelectorAll('a');
for(var i=0;i<all.length;i++){
	if( all[i].text.indexOf("mp4") != -1 ||
		all[i].text.indexOf("mkv") != -1 ||
		all[i].text.indexOf("wmv") != -1){

		addurl('[M]','mpv',all[i]);
		addurl('[P]','potplayermini64',all[i]);
		addbtn('[C]',all[i]);
	}
}

function addurl(title,prefix,element){
	var a = document.createElement('a');
	a.text = title;
	a.href = prefix + ':' + element.href;
	a.title='Open in '+prefix;
	element.parentElement.insertBefore(a,element);
}

function addbtn(title,element){
	var b = document.createElement('input');
	b.value=title;
	b.setAttribute('data',element.href);
	b.type='button';
	b.title='Copy url to copyboard';
	b.style='display:inline';
	b.onclick=function(){
		copyToClipboard(b.getAttribute('data'));
	}
	element.parentElement.insertBefore(b,element);
}

// by https://stackoverflow.com/questions/22581345/click-button-copy-to-clipboard-using-jquery?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
function copyToClipboard(text) {
  // Create a "hidden" input
  var aux = document.createElement("input");
  // Assign it the value of the specified element
  aux.setAttribute("value", text);
  // Append it to the body
  document.body.appendChild(aux);
  // Highlight its content
  aux.select();
  // Copy the highlighted text
  document.execCommand("copy");
  // Remove it from the body
  document.body.removeChild(aux);
}



})();