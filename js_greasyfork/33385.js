// ==UserScript==
// @name Copy URL with Hash
// @version 0.1.1
// @description Add a contextmenu command to copy URL with '#' anchor
// @license MIT
// @author eight04 <eight04@gmail.com>
// @homepageURL https://github.com/eight04/copy-url-with-hash
// @supportURL https://github.com/eight04/copy-url-with-hash/issues
// @incompatible chrome
// @incompatible opera
// @incompatible safari
// @include *
// @require https://greasyfork.org/scripts/33034-gm-context/code/GM_context.js?version=219427
// @grant none
// @namespace https://greasyfork.org/users/813
// @downloadURL https://update.greasyfork.org/scripts/33385/Copy%20URL%20with%20Hash.user.js
// @updateURL https://update.greasyfork.org/scripts/33385/Copy%20URL%20with%20Hash.meta.js
// ==/UserScript==

/* global GM_context */

(function(){
  let hash;
    
  const item = {
    label: "Copy URL with #hash",
    onclick() {
      const url = new URL(location.href);
      url.hash = hash;
      const input = document.createElement("input");
      input.value = url.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
  };
  
  GM_context.add({
    context: ["page", "link"],
    items: [item],
    oncontext(e) {
      hash = findHash(e.target);
      if (!hash) return false;
      GM_context.update(item, {label: `Copy URL with #${hash}`});
    }
  });
  
  function findHash(node) {
    if (node.id || node.name) {
      return node.id || node.name;
    }
    const anchor = node.querySelector("[id], a[name]");
    if (anchor) {
      return anchor.id || anchor.name;
    }
    const head = node.closest("h1, h2, h3, h4, h5, h6");
    if (head) {
      if (head.id) {
        return head.id;
      }
      const anchor = head.querySelector("[id], a[name]");
      if (anchor) {
        return anchor.id || anchor.name;
      }
    }
    const header = head.closest("header");
    if (header) {
      if (header.id) {
        return header.id;
      }
      const anchor = header.querySelector("[id], a[name]");
      if (anchor) {
        return anchor.id || anchor.name;
      }
    }
  }
})();
