// ==UserScript==
// @name        Wikipedia Narrow - wikipedia.org
// @namespace   Violentmonkey Scripts
// @match       https://*.wikipedia.org/wiki/*
// @grant       none
// @version     1.5
// @author      -
// @description 9.4.2021, 23:41:54
// @downloadURL https://update.greasyfork.org/scripts/424787/Wikipedia%20Narrow%20-%20wikipediaorg.user.js
// @updateURL https://update.greasyfork.org/scripts/424787/Wikipedia%20Narrow%20-%20wikipediaorg.meta.js
// ==/UserScript==

class wikiNarrow
{
  run()
  {
    const selectors = '.mw-body-content p, .mw-body-content h2, .mw-body-content h3, .mw-body-content h4';
    const newWidth = '750px';
    const newTSize = '2vw';
    const newH2Size = '2.2vw';
    const newH3Size = '2.1vw';
    const newH4Size = '1.8vw';
    let s = null;
    let nodes = null;
    
    s = document.querySelector('#content').style;
    s.width = newWidth;
    s.marginLeft = 'auto';
    s.marginRight = 'auto';
    
    nodes = document.querySelectorAll(selectors);
    nodes.forEach((node) => 
    {
      switch (node.tagName)
      {
        case 'P':
          node.style.fontSize = newTSize;
        break;
          
        case 'H2':
          node.style.fontSize = newH2Size;
        break;
          
        case 'H3':
          node.style.fontSize = newH3Size;
        break;
          
        case 'H4':
          node.style.fontSize = newH4Size;
        break;
          
      }
    });
  }
}

let wN = new wikiNarrow();
wN.run();