// ==UserScript==
// @name        LongMsgBuster
// @namespace   https://gitter.im/
// @description Collapse or shrink tall messages
// @include     https://gitter.im/*/*/~*#*
// @version     3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26053/LongMsgBuster.user.js
// @updateURL https://update.greasyfork.org/scripts/26053/LongMsgBuster.meta.js
// ==/UserScript==

var MAX_HEIGHT = 350; // Pixels
var WARNING = '<p>This message was hidden because it exceeded the desired height.</p>';

document.addEventListener('keydown', function(e) {
  // Key Binding | Defaults:
  // CTRL~CMD + ALT + F -> Shrink blocks
  // CTRL~CMD + ALT + G -> Collapse blocks
  var collapse = e.keyCode === 71; // G
  var shrink = e.keyCode === 70; // F
  var middle = e.altKey;
  var first = e.metaKey || e.ctrlKey;

  if (first && middle && shrink) {
    applyToDomElements(
      document.querySelectorAll('.chat-item'),
      shrinkChatBlock
    );
  } else if (first && middle && collapse) {
    applyToDomElements(
      document.querySelectorAll('.chat-item'),
      hideChatBlock
    );
  }
});

function applyToDomElements(elements, action) {
  for (var i = 0, l = elements.length; i < l; i++) {
    if (elements[i].offsetHeight > MAX_HEIGHT) {
      action(elements[i]);
    }
  }
}

function shrinkChatBlock(block) {
  var btn = document.createElement('button');
  var text = document.createTextNode('Expand');

  btn.appendChild(text);
  btn.addEventListener('click', function(e) {
    var block = e.target.parentNode;

    block.style.textAlign = 'left';
    block.innerHTML = this.oldHTML;
    block.style.boxShadow = 'none';
  }.bind({ oldHTML: block.innerHTML }));

  block.innerHTML = WARNING;
  block.style.boxShadow = '0px 1px 5px 1px rgba(0,0,0,0.25)';
  block.style.textAlign = 'center';
  btn.appendChild(text);
  block.appendChild(btn, block.firstChild);
}

function hideChatBlock(block) {
  // Straight up delete the node from the tree
  block.parentNode.removeChild(block);
}