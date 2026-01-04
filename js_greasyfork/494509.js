// ==UserScript==
// @name         DDG-like Vim keybindings for any website
// @namespace    https://gist.github.com/KiaraGrouwstra/cbc198f6be09f703c42327b2cb6a6947
// @version      0.0.3
// @description  navigate page by keyboard!
// @author       KiaraGrouwstra
// @match        https://*/*
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/494509/DDG-like%20Vim%20keybindings%20for%20any%20website.user.js
// @updateURL https://update.greasyfork.org/scripts/494509/DDG-like%20Vim%20keybindings%20for%20any%20website.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function unfold(fn, seed) {
    let pair = fn(seed);
    const result = [];
    while (pair && pair.length) {
      result[result.length] = pair[0];
      pair = fn(pair[1]);
    }
    return result;
  }

  function area(el) {
    const rect = el.getBoundingClientRect();
    return rect.height * rect.width;
  }

  const maxBy = (f) => (a, b) => {
    const resultB = f(b);
    return Math.max(f(a), resultB) === resultB ? b : a;
  }

  const viableChildren = el => Array.from(el.children).filter(x=>area(x) > 100);

  let items = [];
  var hit = 0; // global

  function getItems() {
    const head = document.getElementsByTagName('head')[0];
    // console.log({head});
    const contents = document.getElementById('main') || document.querySelectorAll('[role="main"]')[0] || document.getElementsByTagName('body')[0];
    // console.log({contents});
    const biggestChild = el => viableChildren(el).reduce(maxBy(area), head);
    const candidates = unfold(el => {
      let child = biggestChild(el);
      return area(child) > 100 ? [child, child] : false;
    }, contents);
    // console.log({candidates});
    const parent = candidates.reduce(maxBy(el => area(el) * viableChildren(el).length), head);
    // console.log({parent});
    const items = viableChildren(parent);
    // console.log({items});
    // console.log(Array.from(parent.children).filter(x=>area(x) > 100));
    // console.log(Array.from(parent.children));
    return items;
  }

  function select_hit(next = true) {
      if (!items.length) {
        items = getItems();
      }
      console.log({items});
      if (items.length) {
        const get_res = i => items[i];
        console.log({hit});
        const el_ = get_res(hit);
        console.log({el_});
        if(el_) el_.classList.remove("highlight");
        hit = Math.min(items.length-1, Math.max(0, next ? hit + 1 : hit - 1));
        const el = get_res(hit);
        console.log({el});
        el.classList.add("highlight");
        el.getElementsByTagName("a")[0].focus();
        el.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
      }
  }

  document.addEventListener('keydown', function(event) {
      const code = event.keyCode;
      const active = document.activeElement;
      const editing = ['INPUT', 'TEXTAREA'].includes(active.nodeName) ||
            active.getAttribute("contenteditable") == "true" ||
            active.getAttribute("role") == "textbox";
      if (!editing) {
          // if not in a text box, we can safely intercept keys
          if (code == 40 || code == 74 || code == 78) { // down / j / n
              event.preventDefault();
              select_hit(true);
          }
          if (code == 38 || code == 75 || code == 69) { // up / k / e
              event.preventDefault();
              select_hit(false);
          }
      }
  });

  // define css class
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = '.highlight { background-color: rgba(120, 120, 255, 0.1); }';
  document.getElementsByTagName('head')[0].appendChild(style);

})();
