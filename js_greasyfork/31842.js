// ==UserScript==
// @name dribbble - switch to gif
// @description     lightbox
// @namespace emattias
// @version 1.2
// @include https://dribbble.com/*
// @downloadURL https://update.greasyfork.org/scripts/31842/dribbble%20-%20switch%20to%20gif.user.js
// @updateURL https://update.greasyfork.org/scripts/31842/dribbble%20-%20switch%20to%20gif.meta.js
// ==/UserScript==

const processNodeList = (nodeList) => {
  nodeList.forEach((node) => {
    const nodes = node.querySelectorAll('source, img')
    
    if (nodes.length > 0) {
      nodes.forEach((node) => {
        let attributeName
        switch(node.tagName) {
          case 'SOURCE':
            attributeName = 'srcSet'
            break;
          case 'IMG':
            attributeName = 'src'
            break;

        }
        const attributeValue = node.getAttribute(attributeName)
        if(attributeValue) {
          node.setAttribute(attributeName, attributeValue.replace(/(http.+?)(_still)?_\dx(\.gif)/gi, '$1$3'));
        }
      })

      node.querySelector('.dribbble-over').style.display = 'none'
    }
  })
}

processNodeList(document.querySelectorAll('.dribbble-img'))

// create an observer instance
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        processNodeList(mutation.addedNodes)
      }
    });
});

// pass in the target node, as well as the observer options
observer.observe(document.querySelector('.dribbbles'), { childList: true });