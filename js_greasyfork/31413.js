// ==UserScript==
// @name         Debtwire Highlights
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.debtwire.com/intelligence/view/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31413/Debtwire%20Highlights.user.js
// @updateURL https://update.greasyfork.org/scripts/31413/Debtwire%20Highlights.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var highlightedIndex = {
  intelId: 0,
  highlightedParagraphPaths: []
}
var highlightedRegister = []
var intelArticles = document.querySelectorAll('.headline-card.intel-article')

intelArticles.forEach(function(articleTag) {
  var o = Object.assign({}, highlightedIndex)
  o.intelId = articleTag.querySelector('.headline-card__main h1').id.split('-')[2]
  highlightedRegister.push(o)
})


document.addEventListener('mouseup', function() {
      // toggleHighlightElement(getSelectedText().containingElement)
      window.location.hash = JSON.stringify(toggleHighlight(getSelectedText().containingElement))
}, false);

function getSelectedText() {
  if (window.getSelection) {
    var selection = window.getSelection();
    return {
      text: selection.toString(),
      containingElement: selection.baseNode,
      baseOffset: selection.baseOffset,
      focusOffset: selection.focusOffset
    };
  }
  return null;
}

function getDomPath(el) {
  if (!el) {
    return;
  }
  var stack = [];
  while (el.parentNode != null) {
    // console.log(el.nodeName);
    var sibCount = 0;
    var sibIndex = 0;
    // get sibling indexes
    for ( var i = 0; i < el.parentNode.childNodes.length; i++ ) {
      var sib = el.parentNode.childNodes[i];
      if ( sib.nodeName == el.nodeName ) {
        if ( sib === el ) {
          sibIndex = sibCount;
        }
        sibCount++;
      }
    }
    var nodeName = el.nodeName.toLowerCase();
    if ( sibCount > 1 ) {
      stack.unshift(nodeName + ':nth-of-type(' + (sibIndex + 1) + ')');
    } else {
      stack.unshift(nodeName);
    }
    el = el.parentNode;
  }
  stack.splice(0,1); // removes the html element
  return stack.join(' > ');
}

function toggleHighlight(el) {
  var closestParagraph = getClosest(el.parentNode, 'p')
  var intelId = getClosest(el.parentNode, 'article').querySelector('.headline-card__main h1').id.split('-')[2]

  toggleHighlightElement(closestParagraph)

  return highlightedRegister.filter(function(o){
    if(o.intelId === intelId) {
      togglePath(o, getDomPath(closestParagraph))
      return o
    }
  })

}

function togglePath(o, path) {
  var index = o.highlightedParagraphPaths.indexOf(path)
  if(index === -1) {
    o.highlightedParagraphPaths.push(path)
  } else {
    o.highlightedParagraphPaths.splice(index)
  }
}

function toggleHighlightElement(el) {
  el.innerHTML = el.firstChild.tagName === 'MARK' ? el.firstChild.innerHTML : "<mark>"+el.innerHTML+"</mark>"
}

function getClosest( elem, selector ) {

  // Element.matches() polyfill
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function(s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1;
      };
  }

  // Get closest match
  for ( ; elem && elem !== document; elem = elem.parentNode ) {
    if ( elem.matches( selector ) ) {
      return elem;
    }
  }

  return null;

};



})();