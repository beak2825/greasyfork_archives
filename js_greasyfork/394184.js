// ==UserScript==
// @name         FixAnnoyingTwitterCrap
// @version      0.1.8
// @description  Remove annoying crap from Twitter
// @author       Jeremy Bornstein <jeremy@jeremy.org>
// @match        https://*.twitter.com/*
// @grant        none
// @namespace https://greasyfork.org/users/414927
// @downloadURL https://update.greasyfork.org/scripts/394184/FixAnnoyingTwitterCrap.user.js
// @updateURL https://update.greasyfork.org/scripts/394184/FixAnnoyingTwitterCrap.meta.js
// ==/UserScript==

(function() {
    'use strict';

      function debugSearch(selector, text) {
        const nodes = document.body.querySelectorAll(selector);
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.innerText.startsWith(text)) {
                const offendingNode = node;
                console.debug("found", node);
                offendingNode.style.backgroundColor = 'green';
                offendingNode.style.color = 'orange';
            }
        }
    }
  
  	function findNewsfeed() {
  		const nodes = document.querySelectorAll('section');  
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.querySelector('h2') == null) {
          return node;
        }
      }
      return null;
    }
  
  
  	function findNamedSection(parent, predicate) {
    	const nodes = parent.querySelectorAll('h2');
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (predicate(node)) {
          let container = node.parentElement;
          // first, find the first element which has more than a single child
          while (container.childElementCount <= 1 && container.parentElement != null) {
            container = container.parentElement;
          }
          // then, go up the tree as long as we only have a single child.
          while (container.parentElement != null && container.parentElement.childElementCount == 1) {
          	container = container.parentElement;
          }
         	return container;
        }
      }
      return null;
    }
  
  	function findTrendingSection(parent) {
      function isTargetNode(n) {
        const text = n.innerText;
        // TODO: clearly need more examples
        return text.startsWith("Tendances : ")
        	  || text == "Ce qui se passe"
        		|| text == "Trends"
        		|| text == "Trends for you"
      }
    	return findNamedSection(parent, isTargetNode);
    }

  
 		function findSponsoredSection(parent) {
      function isTargetNode(n) {
        const text = n.innerText;
        // TODO: clearly need more examples
        return text.startsWith("Tendances : ")
        		|| text == "Tweet sponsorisé"
        		|| text == "Sponsored Tweet"  // have yet to observe in practice
      }
    	return findNamedSection(parent, isTargetNode);
    }

  function findSuggestionsSection(parent) {
      function isTargetNode(n) {
        const text = n.innerText;
        // TODO: clearly need more examples
        return text == "Suggestions"
      }
    	return findNamedSection(parent, isTargetNode);
    }

  function removeMatchingNodes(parent, selector, predicate, findParent, debugBGColor, debugTextColor, removeIt) {
        const nodes = parent.querySelectorAll(selector);
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (predicate(node)) {
                const offendingNode = findParent(node);
                if (debugBGColor && debugTextColor) {
                  	console.debug("found", node, "with text:", node.innerText);
                    offendingNode.style.backgroundColor = debugBGColor;
                    offendingNode.style.color = debugTextColor;
                    console.debug("TARGET", offendingNode);
                }
              	if (removeIt) {
                    //offendingNode.parentNode.removeChild(offendingNode);
                    offendingNode.hidden = true;
                    offendingNode.style.display = "none";
                }
            }
        }
    }

    function removeAds(parent) {
        if (!parent) return;
      
        function isTargetNode(n) {
            const nodeText = n.innerText;
            return nodeText == "Sponsorisé"
                || nodeText == "Sponsored"
                || nodeText == "Promoted"
        }
        removeMatchingNodes(parent, 'span', isTargetNode, n => n.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode /*.parentNode.parentNode*/, 'black', 'black', true);
    }

		function removeSuggestionsAds(parent) {
     	// TK 
    }
  
    function removeTrendAds(parent) {
        if (!parent) return;
      
        function isTargetNode(n) {
            const nodeText = n.innerText;
            return nodeText.startsWith("Promoted by ")
                || nodeText.startsWith("Sponsored by ")
                || nodeText.startsWith("Sponsorisé par ")
        }
      
      	function findParentNode(n) {
        	let parent = n.parentElement;
          while (parent.childElementCount <= 2 && parent.parentElement != null) {
            parent = parent.parentElement;
          }
          if (parent) {
           	while (parent.childElementCount == 1 && parent.parentElement != null) {
              parent = parent.parentElement; 
            }
          }
          return parent;
        }
        removeMatchingNodes(parent, 'span', isTargetNode, findParentNode, '#701625', 'pink', true);
    }


    function removeFollowedBy(parent) {
  		if (!parent) return;
              function isTargetNode(n) {
            const nodeText = n.innerText;
            return nodeText.endsWith(" suivent")
            || nodeText.endsWith(" suit")
            || nodeText.endsWith(" follow");
        }

        removeMatchingNodes(parent, 'a', isTargetNode, n => n.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode, '#0f3d82', 'lightblue', false);
    }

    function removeLikedBy(parent) {
        if (!parent) return;
        function isTargetNode(n) {
            const nodeText = n.innerText;
            return nodeText.endsWith(" a aimé") 
                || nodeText.endsWith(" ont aimé")
                || nodeText.endsWith(" liked");
        }

        removeMatchingNodes(parent, 'a', isTargetNode, n => n.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode, '#49491c', 'black', true);
    }

  	function removeSponsoredSection(section) {
      section.hidden = true;
      section.style.display = "none";
    }
  
    const observer = new MutationObserver(function(mutationsList, observer) {
      // we just look at the whole page each time; it's fast enough and seems to work.
	    removeTrendAds(findTrendingSection(document));  // trends are only loaded once (and always dynamically) so theoretically we could disable this after it finds any once.
      removeSuggestionsAds(findSuggestionsSection(document));  // probably same
      removeSponsoredSection(findSponsoredSection(document));
      const newsfeed = findNewsfeed();
   	  removeAds(newsfeed);
      removeLikedBy(newsfeed);
      removeFollowedBy(newsfeed);
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();