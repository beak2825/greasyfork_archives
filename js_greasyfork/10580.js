// ==UserScript==
// @name        Krautchan Backlinks & Link Preview
// @namespace   kckckckckc
// @description Add backlinks, previews and highlighting to inter-thread links like on 4chan.
// @description:de Backlinks, Vorschau und Highlighting für Beitragsverlinkungen im Stile von 4chan.
// @include     http://krautchan.net/*/thread-*.html*
// @include     https://krautchan.net/*/thread-*.html*
// @version     1.0
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/10580/Krautchan%20Backlinks%20%20Link%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/10580/Krautchan%20Backlinks%20%20Link%20Preview.meta.js
// ==/UserScript==

var forwardThread = document.querySelector('label[for="forward_thread"]');
var threadNum = forwardThread.innerHTML.split(' ')[1];

var highlightPostLinks = document.querySelectorAll('a[onclick^="highlightPost"]:not(.quotelink)');

for (var i = 0; i < highlightPostLinks.length; i++) { 
	// extract target post number
	var targetPostHref = highlightPostLinks[i].getAttribute('href');
	var targetPostNum = targetPostHref.slice(1);

	// extract poster post number
	var fromPostId = highlightPostLinks[i].parentNode.getAttribute('id');
	var fromPostNum = fromPostId.split('post_text_')[1];

	// create the backlink
	var backlinkContainer = document.createElement('a'); 
	var backlink = document.createTextNode('>>'+fromPostNum); 
	backlinkContainer.href = '#'+fromPostNum;
	backlinkContainer.setAttribute('onclick', 'highlightPost(\''+fromPostNum+'\');');
	backlinkContainer.style.marginRight = "3px";
	backlinkContainer.style.fontSize = '85%';
	backlinkContainer.style.verticalAlign = 'baseline';
	backlinkContainer.appendChild(backlink);

	if(targetPostNum != threadNum) {
		var targetPostHead = document.querySelector('#post-'+targetPostNum+' .postheader');
		targetPostHead.appendChild(backlinkContainer);

		registerMouseOver(highlightPostLinks[i]);
	} else {
		var OP = document.createTextNode(' (OP)');
		highlightPostLinks[i].appendChild(OP);
		var targetThreadHead = document.querySelector('#thread_'+targetPostNum+' .thread_body .postheader');
		targetThreadHead.appendChild(backlinkContainer);
	}
	registerMouseOver(backlinkContainer);
}

// link preview
function registerMouseOver(node) {
	var targetPostContainer;
	var targetPostHref = node.getAttribute('href');
	var targetPostNum = targetPostHref.slice(1);
	var dupNode;

	node.addEventListener('mouseover', function(event) {
		targetPostContainer = document.querySelector('td#post-'+targetPostNum);
		
		var bounds = targetPostContainer.getBoundingClientRect();
		var sh = targetPostContainer.scrollHeight;

		// if target post is not in view, display a hovering popup preview
		if(bounds.bottom-sh < 0 || bounds.top+sh > window.innerHeight) {
			dupNode = targetPostContainer.cloneNode(true);
			dupNode.style.position = "absolute";
			dupNode.style.display = "block";
			dupNode.style.top = (event.layerY+10)+'px';
			dupNode.style.left = (event.layerX+10)+'px';
			dupNode.style.maxWidth = '50%';
			dupNode.style.border = '1px solid #313370';
			document.body.appendChild(dupNode);
		} else {
			// if target is in view, just highlight it with a different background color
			targetPostContainer.style.backgroundColor = "#BBD";
		}
	});
	node.addEventListener('mouseout', function(event) {
		// undo background highlight
		targetPostContainer.style.backgroundColor = "#AAC";

		// remove temporary hovering node
		if(dupNode != null) {
			document.body.removeChild(dupNode);
		}
	});
}