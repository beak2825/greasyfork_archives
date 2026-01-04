// ==UserScript==
// @name jump-to-anchor
// @version 0.2
// @description Context menu item to jump to the closest anchor to the selected text (if any) or to the right-click point otherwise.
// @license MIT
// @author eight04 <eight04@gmail.com>, YFdyh000
// @incompatible chrome
// @incompatible opera
// @incompatible safari
// @include *
// @require https://greasyfork.org/scripts/33034-gm-context/code/GM_context.js?version=219427
// @grant none
// @namespace https://greasyfork.org/users/3017-yfdyh000
// @downloadURL https://update.greasyfork.org/scripts/34811/jump-to-anchor.user.js
// @updateURL https://update.greasyfork.org/scripts/34811/jump-to-anchor.meta.js
// ==/UserScript==

/* global GM_context */

(function () {
  const all_context = ["page", "selection", "editable", "image", "link"];
  const menuitem = {
    label: "Jump to anchor (from click location)",
    onclick: function() { jumpToAnchor() }
  };
  const menuitem_selected = {
    label: "Jump to anchor (from highlighted selection)",
    onclick: function () { jumpToAnchor() } // TODO: keep the selection
  };

  GM_context.add({
    context: all_context,
    items: [menuitem]
  });
  GM_context.add({
    context: all_context,
    items: [menuitem_selected],
    oncontext(e) {
      if (!getSelection()) return false;
    }
  });

  function getSelection() {
    return document.getSelection().toString();
  }
  var x, y;
  window.addEventListener('click', function (e) {
    // Avoid grabbing for the actual selection
    // Doesn't seem to execute on single click anyways
    //  but add for good measure
    if (e.button === 2) {
      x = e.clientX;
      y = e.clientY;
    }
  }, true);
  function jumpToAnchor() {
    x = Math.max(0, Math.min(window.innerWidth, x));
    y = Math.max(0, Math.min(window.innerHeight, y));

    var node;
    var hasSelection = getSelection();
    if (hasSelection) {
      // For some reason, we can't just check ourselves here for
      //  getSelection().anchorNode, as it is always present
      node = document.getSelection().anchorNode;
    }
    else {
      var caretPosition = document.caretPositionFromPoint(x, y);
      node = caretPosition.offsetNode;
    }

    function findDeepestLastChild(elem) {
      var oldElem;
      do {
        oldElem = elem;
        elem = elem.lastElementChild;
      } while (elem);
      return oldElem;
    }
    function foundAnchor(nde) {
      if (nde.id || (nde.name && nde.nodeName.toLowerCase() === 'a')) {
        location.hash = '#' + (nde.id || nde.name);
        return true;
      }
    }

    do {
      if (foundAnchor(node)) {
        break;
      }

      if (node.previousElementSibling) {
        node = findDeepestLastChild(node.previousElementSibling);
      }
      else {
        node = node.parentNode;
      }
    } while (node);
  }
})();
