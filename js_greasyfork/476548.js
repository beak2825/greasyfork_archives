// ==UserScript==
// @name          "Nonfren Radar"
// @description   "Warns you of unfrenly people on the internet"
// @include       *
// @grant         GM_getResourceText
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @resource      theList https://files.catbox.moe/idfplf.json
// @homepageURL   https://web.archive.org/web/20210415002314/https://holocaustdeprogrammingcourse.com/
// @version       1488.0.4
// @license       GNU GPLv3
// @namespace https://greasyfork.org/users/1185877
// @downloadURL https://update.greasyfork.org/scripts/480944/%22Nonfren%20Radar%22.user.js
// @updateURL https://update.greasyfork.org/scripts/480944/%22Nonfren%20Radar%22.meta.js
// ==/UserScript==

(function () {
  var theList = JSON.parse(GM_getResourceText("theList"));

  // Build a trie from the list of phrases
  var trie = theList.reduce(function (node, phrase) {
    var words = phrase.toLowerCase().split(' ');
    var current = node;
    words.forEach(function (word) {
      if (!current[word]) {
        current[word] = {};
      }
      current = current[word];
    });
    current.isEndOfPhrase = true;
    return node;
  }, {});

  // Check if the script is disabled for the current site
  var isDisabled = GM_getValue(window.location.hostname, false);

  // Add a menu command to disable the script for the current site
  GM_registerMenuCommand('Disable script for this site', function() {
    if (!isDisabled) {
      GM_setValue(window.location.hostname, true);
      console.log('Script disabled for this site');
      location.reload(); // Reload the page to apply the changes
    } else {
      console.log('Script is already disabled for this site');
    }
  });

  // Add a menu command to enable the script for the current site
  GM_registerMenuCommand('Enable script for this site', function() {
    if (isDisabled) {
      GM_setValue(window.location.hostname, false);
      console.log('Script enabled for this site');
      location.reload(); // Reload the page to apply the changes
    } else {
      console.log('Script is already enabled for this site');
    }
  });

  if (isDisabled) {
    console.log('Script is disabled for this site');
    return;
  }

  function searchTrie(node, trie) {
    var text = node.nodeValue;
    var words = text.split(/\s+/);
    var output = [];
    var i = 0;

    while (i < words.length) {
      var current = trie;
      var sequence = '';
      var j = i;

      while (j < words.length && current[words[j].toLowerCase()]) {
        current = current[words[j].toLowerCase()];
        sequence += words[j] + ' ';
        j++;
      }

      if (current.isEndOfPhrase) {
        output.push("(((" + sequence.trim() + ")))");
        i = j;
      } else {
        output.push(words[i]);
        i++;
      }
    }

    node.nodeValue = output.join(' ');
  }

  function handleText(textNode) {
    var currentNode = textNode;
    while (currentNode) {
      if (currentNode.nodeName.toLowerCase() === 'input' || currentNode.nodeName.toLowerCase() === 'textarea' || currentNode.isContentEditable) {
        return; // Skip processing if the text node is within an interactive element
      }
      currentNode = currentNode.parentNode;
    }
    searchTrie(textNode, trie);
  }

  function processNode(node) {
    if (node.nodeType === 3) {
      handleText(node);
    } else {
      node.childNodes.forEach(processNode);
    }
  }

  // Processes the initial page content
  processNode(document.body);

  // Observes the changes in the DOM to handle dynamic content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach(processNode);
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();