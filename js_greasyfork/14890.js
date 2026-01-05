// ==UserScript==
// @name        Tumblr Archive Reblog Remover
// @author      Arnold François Lecherche
// @namespace   greasyfork.org
// @icon        https://www.tumblr.com/favicon.ico
// @version     0.1.2
// @description Make browsing Tumblr archives easier.
// @include     http://*.tumblr.com/archive/*
// @include     https://*.tumblr.com/archive/*
// @include     http://*.tumblr.com/archive
// @include     https://*.tumblr.com/archive
// @exclude     http://www.tumblr.com/*
// @exclude     https://www.tumblr.com/*
// @grant       none
// @run-at      document-start
// @copyright 2016 Arnold François Lecherche
// @downloadURL https://update.greasyfork.org/scripts/14890/Tumblr%20Archive%20Reblog%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/14890/Tumblr%20Archive%20Reblog%20Remover.meta.js
// ==/UserScript==
/* jshint -W097 */
;(function setup(D, E, O, M, Date, undefined) {
  'use strict';
  var remove = function (node) {
    if (typeof E.prototype.remove === 'function') remove = function remove(node) {return node.remove();};
    else remove = function remove(node) {return node.parentNode.removeChild(node);};
    return remove(node);
  }, swiftRemove = function swiftRemove() {
    var now = Date.now();
    if (now - check < 100) return;
    check = now;
    fake[0].addedNodes = archive.querySelectorAll('.not_mine.is_reblog');
    removeReblogs(fake);
  }, observerConfig = {
    attributes: false,
    characterData: false,
    childList: true,
    subtree: true
  }, hiddenKey = typeof Symbol !== 'undefined' ? Symbol('hidden') : '$hidden$' + M.random() + '$',
    observer = new MutationObserver(removeReblogs), d = {value: true}, check = Date.now(),
    fake = [{addedNodes:null}], archive, r;
  function clearChildren(node) {
    var nod;
    node.style.display = 'none';
    while ((nod = node.firstChild)) remove(nod);
    O.defineProperty(node, hiddenKey, d);
  }
  function removeReblogs(mutations) {
    observer.stop();
    var i = mutations.length, nodes, node, j, nc;
    while (i--) {
      nodes = mutations[i].addedNodes;
      j = nodes.length;
      while (j--) {
        node = nodes[j];
        if (node[hiddenKey]) continue;
        nc = node.classList;
        if (nc.contains('not_mine') && nc.contains('is_reblog')) clearChildren(node);
      }
    }
    observer.start();
  }
  function init() {
    D.removeEventListener('DOMContentLoaded', init, false);
    archive = D.querySelector('.l-content');
    observer.start();
  }
  observer.start = function () {
    observer.start = observer.observe.bind(observer, archive, observerConfig);
    observer.start();
    swiftRemove();
  };
  observer.stop = observer.disconnect.bind(observer);
  r = D.readyState;
  if (r === 'complete' || r === 'loaded' || r === 'interactive') init();
  else D.addEventListener('DOMContentLoaded', init, false);
  D.addEventListener('keydown', swiftRemove, true);
  D.addEventListener('scroll', swiftRemove, true);
  D.addEventListener('click', swiftRemove, true);
})(document, Element, Object, Math, Date);