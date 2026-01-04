// ==UserScript==
// @name         rolz.org draggable panes
// @namespace    UserScript
// @version      1.0
// @description  make panes resizeable by dragging, in dice room on rolz.org
// @author       Michael Schreiner
// @match        https://rolz.org/dr?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rolz.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509702/rolzorg%20draggable%20panes.user.js
// @updateURL https://update.greasyfork.org/scripts/509702/rolzorg%20draggable%20panes.meta.js
// ==/UserScript==

movable_panesize();

function movable_panesize() {
	// smaller paddings, more space
	var paddingwidth = 4;
	document.getElementById('content').style.paddingLeft = '0.25em';
	document.getElementById('content').style.paddingRight = '0.25em';
	document.getElementById('prompt-line-lower2').style.marginTop = '0';
	document.getElementById('prompt-line-lower2').style.height = '3em';
	document.getElementById('topmenu').style.lineHeight = '130%';
	document.getElementById('container').style.marginTop = '37px';
	document.getElementById('send-button').style.float = 'none';
	document.getElementById('dr-panes').style.maxWidth = 'none';
	// hide button for optional content does not work anymore
	document.getElementsByClassName('width-optional-content')[2].style.display = 'none';
	// insert draggable pane
	document.getElementById('dr-panes').style.backgroundColor = '#888888';
	document.getElementById('dr-panes').style.display = 'flex';
	document.getElementById('dr-panes').style.gap = '0';
	document.getElementById('pane-x-1').insertAdjacentHTML('afterend', '<div id="handler" style="display: relative; width: 0.45em; height: 37px; padding: 0; background-color: #888888; background-image: radial-gradient(circle at center, black 1px, transparent 0), radial-gradient(circle at center, black 1px, transparent 0); background-size: 6px 6px; background-position: 2px 2px, 5px 5px; cursor: ew-resize; user-select: none; flex: 0 0 auto;"></div>');
	document.getElementById('pane-x-1').style.boxSizing = 'border-box';
	document.getElementById('pane-x-1').style.flex = '1 1 auto';
	document.getElementById('pane-x-1').style.width = '250px';
	document.getElementById('pane-x-2').style.boxSizing = 'border-box';
	document.getElementById('pane-x-2').style.flex = '1 1 auto';
	var handler = document.getElementById('handler');
	var wrapper = document.getElementById('dr-panes');
	var leftBox = document.getElementById('pane-x-1');
	// minimum width set on pane-x-1
	var leftBoxminWidth = 250;
	// minimum width set on pane-x-2
	var righBoxminWidth = 332;
	var isHandlerDragging = false;
	var isHandlerTouching = false;

 function movePane(moveEvent) {
	  // get offset
	  var containerOffsetLeft = wrapper.offsetLeft;
	  // get x-coordinate of pointer relative to container
	  var pointerRelativeXpos = moveEvent.clientX - containerOffsetLeft;
	  // resize left box
	  leftBox.style.width = (Math.min(Math.max(leftBoxminWidth, pointerRelativeXpos), document.getElementById('dr-panes').offsetWidth - righBoxminWidth)) + 'px';
	  // set flex-grow to 0 to prevent it from growing
	  leftBox.style.flexGrow = 0;
 }

	document.addEventListener('mousedown', function(e) {
	  if (e.target === handler) {
	    isHandlerDragging = true;
	  }
	});

	document.addEventListener('mouseup', function(e) {
	  isHandlerDragging = false;
	});

	document.addEventListener('mousemove', function(e) {
	  if (!isHandlerDragging) {
	    return false;
	  }
	  movePane(e);
	});

	document.addEventListener('touchstart', function(e) {
	  if (e.target === handler) {
	    isHandlerTouching = true;
	  }
	});

	document.addEventListener('touchend', function(e) {
	  isHandlerTouching = false;
	});

	document.addEventListener('touchmove', function(e) {
	  if (!isHandlerTouching) {
	    return false;
	  }
	  movePane(e.changedTouches[0]);
	});
}
