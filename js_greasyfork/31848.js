// ==UserScript==
// @name         Linkify Pivotal Tracker links on Github
// @namespace    http://paradox.io/linkify-pivotal-links
// @homepage     https://github.com/paradox460/userscripts/blob/master/pivotal-tracker-linkify.user.js
// @version      0.2
// @description  Converts pivotal tracker story links (#123456789) to actual links
// @author       Jeff Sandberg
// @match        *://github.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/gh/padolsey/findAndReplaceDOMText@0.4.5/src/findAndReplaceDOMText.min.js

// @downloadURL https://update.greasyfork.org/scripts/31848/Linkify%20Pivotal%20Tracker%20links%20on%20Github.user.js
// @updateURL https://update.greasyfork.org/scripts/31848/Linkify%20Pivotal%20Tracker%20links%20on%20Github.meta.js
// ==/UserScript==

const forEach = (array, callback, scope) => {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]); // passes back stuff we need
  }
};

const linkify = (elem) => {
  findAndReplaceDOMText(elem, {
    find: /#(\d{9,})/,
    replace: (m, [, id]) => {
      if (m.node.parentElement.matches('a')) { return m.text; }

      var el = document.createElement('a');
      el.href = `https://www.pivotaltracker.com/story/show/${id}`;
      el.innerHTML = m.text;
      return el;
    },
  });
};

let textNodes = document.querySelectorAll('.comment-body');
forEach(textNodes, (index, elem) => {
  linkify(elem);
});
