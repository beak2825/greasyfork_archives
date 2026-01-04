// ==UserScript==
// @name         Imgur Mirror
// @namespace    https://github.com/jhxxs
// @version      0.0.4
// @description  Switches all imgur links to the mirror site https://imgur.kageurufu.net/
// @author       Kyle
// @include      http*
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536069/Imgur%20Mirror.user.js
// @updateURL https://update.greasyfork.org/scripts/536069/Imgur%20Mirror.meta.js
// ==/UserScript==

(() => {
  'use strict';


  let is_add = false;
  const regex =
    /imgur\.com\/(?!a\/|gallery\/)(?:r\/[a-z0-9_]+\/)?([a-z0-9]+)(\.?[a-z0-9]+)?/iu;
  const extensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.gifv',
    '.webm',
    '.mp4'
  ];

  function getNewLink(imgurLink, useGif) {
    const match = imgurLink.match(regex);
    if (match) {
      const file = match[1];
      let extension = match[2]?.toLowerCase();
      if (!extension || !extensions.includes(extension)) {
        extension = '.png';
      } else if (
        extension === '.gifv' ||
        extension === '.gif' ||
        extension === '.webm'
      ) {
        extension = '.mp4';
      }
      if (useGif && extension === '.mp4') {
        extension = '.gif';
      }
      return `https://imgur.kageurufu.net/${file + extension}`;
    } else {
      return null;
    }
  };

  waitForElems({
    sel: 'img,a',
    onmatch(node) {
      const isImg = node.nodeName === 'IMG';
      const prop = isImg ? 'src' : 'href';
      const newLink = getNewLink(node[prop], isImg);
      if (newLink) {
        if(!is_add){
            const meta = document.createElement('meta');
            meta.setAttribute('name', 'referrer');
            meta.setAttribute('content', 'no-referrer');
    
            document.getElementsByTagName('head')[0].appendChild(meta);
            is_add = true;
        }
        
        node[prop] = newLink;
        if (node.dataset.hrefUrl) {
          node.dataset.hrefUrl = newLink;
        }
        if (node.dataset.outboundUrl) {
          node.dataset.outboundUrl = newLink;
        }
      }
    }
  });
})();
