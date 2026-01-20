// ==UserScript==
// @name          "Nonfren Radar"
// @description   "Warns you of unfrenly people on the internet"
// @include       *
// @grant         GM_getResourceText
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @resource      theList https://files.catbox.moe/gzzaj4.json
// @homepageURL   http://www.whatreallyhappened.info/ https://web.archive.org/web/20210528121829/https://holocaustdeprogrammingcourse.com/ https://web.archive.org/web/20230318003504/http://www.holohoax101.org/
// @version       1488.0.8
// @namespace     https://greasyfork.org/users/1185877
// @license       GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/480944/%22Nonfren%20Radar%22.user.js
// @updateURL https://update.greasyfork.org/scripts/480944/%22Nonfren%20Radar%22.meta.js
// ==/UserScript==

(function () {
  var theList = JSON.parse(GM_getResourceText("theList"));

  // Build a trie from the list of phrases
  var trie = theList.reduce(function (node, phrase) {
    var words = phrase.toLowerCase().split(" ");
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
  GM_registerMenuCommand("Disable script for this site", function () {
    if (!isDisabled) {
      GM_setValue(window.location.hostname, true);
      console.log("Script disabled for this site");
      location.reload(); // Reload the page to apply the changes
    } else {
      console.log("Script is already disabled for this site");
    }
  });

  // Add a menu command to enable the script for the current site
  GM_registerMenuCommand("Enable script for this site", function () {
    if (isDisabled) {
      GM_setValue(window.location.hostname, false);
      console.log("Script enabled for this site");
      location.reload(); // Reload the page to apply the changes
    } else {
      console.log("Script is already enabled for this site");
    }
  });

  if (isDisabled) {
    console.log("Script is disabled for this site");
    return;
  }

  function searchTrie(node, trie) {
    var text = node.nodeValue;

    // Split while preserving whitespace
    var tokens = text.split(/(\s+)/);
    var output = [];
    var i = 0;

    while (i < tokens.length) {
      // If it's whitespace, keep it as-is
      if (/^\s+$/.test(tokens[i])) {
        output.push(tokens[i]);
        i++;
        continue;
      }

      var current = trie;
      var sequence = "";
      var matchedTokens = [];
      var j = i;

      // Try to match a phrase
      while (j < tokens.length) {
        // Skip whitespace tokens during matching
        if (/^\s+$/.test(tokens[j])) {
          j++;
          continue;
        }

        if (current[tokens[j].toLowerCase()]) {
          current = current[tokens[j].toLowerCase()];
          matchedTokens.push(tokens[j]);
          j++;
        } else {
          break;
        }
      }

      if (current.isEndOfPhrase && matchedTokens.length > 0) {
        // Found a match - wrap it and add a space
        output.push("(((" + matchedTokens.join(" ") + "))) ");
        // Skip all tokens that were part of the match (including whitespace between them)
        i = j;
      } else {
        // No match - keep the original token
        output.push(tokens[i]);
        i++;
      }
    }

    node.nodeValue = output.join("");
  }

  function handleText(textNode) {
    var currentNode = textNode.parentNode;
    while (currentNode) {
      var nodeName = currentNode.nodeName.toLowerCase();
      // Skip processing if the text node is within an interactive or code-related element
      if (
        nodeName === "input" ||
        nodeName === "textarea" ||
        nodeName === "code" ||
        nodeName === "pre" ||
        nodeName === "kbd" ||
        nodeName === "samp" ||
        nodeName === "xmp" ||
        currentNode.isContentEditable
      ) {
        return;
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
