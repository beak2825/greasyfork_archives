
// ==UserScript==
// @name        Spectacles
// @version     1.1.1
// @description A reddit userscript to effortlessly remove all spoilers in posts, and make it crystal clear.
// @namespace   https://github.com/quantix-dev/userscripts
// @homepageURL https://github.com/quantix-dev/userscripts/tree/main/src/Spectacles
// @supportURl  https://github.com/quantix-dev/userscripts/issues
// @author      quantix-dev
// @run-at      document-end
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @match       https://www.reddit.com/*
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/444430/Spectacles.user.js
// @updateURL https://update.greasyfork.org/scripts/444430/Spectacles.meta.js
// ==/UserScript==

(function () {
'use strict';

const mediaLinks = ['preview.redd.it', 'external-preview.redd.it', 'i.redd.it'];

function createPostTreeWalker(post) {
  return document.createTreeWalker(post, NodeFilter.SHOW_ELEMENT, function (node) {
    if (node.nodeName === 'IMG') {
      let url;

      try {
        url = new URL(node.src);
      } catch (_unused) {
        return NodeFilter.FILTER_SKIP;
      }

      if (mediaLinks.includes(url.hostname) && url.searchParams.has('blur')) {
        return NodeFilter.FILTER_ACCEPT;
      }
    }

    return NodeFilter.FILTER_SKIP;
  });
}

async function findExternalNode(mediaNode) {
  return new Promise((resolve, reject) => {
    let depth = 0;
    let par = mediaNode;

    while (par && par.classList) {
      if (par.classList.contains('scrollerItem') || par.nodeName == 'A' || depth >= 15) break;
      par = par.parentNode;
      depth++;
    }

    if (!par) return null;

    if (par.nodeName == 'A') {
      resolve(par);
    }
  });
}

const fileTypes = ['png', 'jpeg', 'webp', 'gif', 'mp4'];

function removeMediaSpoiler(mediaNode, source) {
  let fileType = source.split('?')[0].split('.').pop().toLowerCase();
  fileType = !fileTypes.includes(fileType) ? source.match(/(mediaembed)/g) ? 'embed' : null : fileType;

  switch (fileType) {
    case 'gif':
    case 'mp4':
      {
        let video = document.createElement('video');
        video.className = 'media-element';
        video.height = 360;
        video.width = 640;
        video.style = 'margin: 0px auto; max-height: 700px; display: block; height: 100%; max-width: 100%; position: relative;';
        video.volume = 0;
        video.src = source;
        video.autoplay = true;
        video.loop = true;
        mediaNode.parentNode.appendChild(video);
        mediaNode.remove();
        mediaNode = video;
        break;
      }

    default:
      {
        mediaNode.src = source;
        mediaNode.style.filter = 'blur(0px)';
        break;
      }
  }

  findExternalNode(mediaNode).then(linkNode => {
    for (let child of linkNode.children) {
      if (child !== mediaNode && child.nodeName == "DIV") {
        let children = Array.from(child.children);
        children = children.filter(x => {
          return x.nodeName === "BUTTON" && x.innerHTML.includes('spoiler');
        });

        if (children[0]) {
          children[0].style.display = "none";
        }
      }
    }
  });
}

async function grabSourceFromImage(blurredSrc, externalSrc) {
  return new Promise((resolve, reject) => {
    const splitURL = externalSrc.split('?')[1];
    const subdomURL = externalSrc.split('/');
    const urlParams = new URLSearchParams(splitURL);

    if (!subdomURL.includes('reddit.com') && !subdomURL.includes('comments') && !urlParams.has('blur')) {
      return resolve(externalSrc);
    }

    GM_xmlhttpRequest({
      method: 'GET',
      url: externalSrc,
      responseType: 'document',
      onload: response => {
        if (response.readyState !== response.DONE && response.status !== 200) return;
        const page = response.response;
        const pageContent = page.getElementById('AppRouter-main-content');
        const tmpTreeWalker = page.createTreeWalker(pageContent, NodeFilter.SHOW_ELEMENT, node => {
          return node.nodeName == 'A' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        });
        let curNode = tmpTreeWalker.currentNode;

        while (tmpTreeWalker.nextNode()) {
          curNode = tmpTreeWalker.currentNode;
          const children = curNode.childNodes;

          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.nodeName !== 'IMG') continue;

            if (child.src == blurredSrc) {
              return resolve(curNode.href);
            }
          }
        }

        return reject(blurredSrc);
      }
    });
  });
}

async function getImagesFromPost(post) {
  return new Promise((resolve, reject) => {
    const treeWalker = createPostTreeWalker(post);
    let currentNode = treeWalker.currentNode;
    let promises = [];

    while (currentNode) {
      promises.push(findExternalNode(treeWalker.currentNode));
      currentNode = treeWalker.nextNode();
    }

    Promise.race(promises).then(source => {
      resolve({
        mediaNode: treeWalker.currentNode,
        source: source.href
      });
    });
  });
}

async function removePostSpoiler(post, pageType) {

  if (pageType == 'thread') {
    getImagesFromPost(post).then(({
      mediaNode,
      source
    }) => {
      removeMediaSpoiler(mediaNode, source);
    });
    post.click();
  } else {
    getImagesFromPost(post).then(({
      mediaNode,
      source
    }) => {
      if (!mediaNode || !source) return;
      grabSourceFromImage(mediaNode.src, source).then(content => {
        removeMediaSpoiler(mediaNode, content);
      });
    });
  }
}

(() => {
  let rootNode, postType;

  if (window.location.href.split('/')[5] !== 'comments') {
    let depth = 0;
    rootNode = document.getElementsByClassName('scrollerItem Post')[0];

    while (rootNode && depth < 10) {
      rootNode = rootNode.parentNode;
      if (rootNode.childNodes.length > 5) break;
      depth++;
    }
  } else {
    rootNode = document.getElementsByClassName('Post')[0];
    postType = 'thread';
  }

  if (!rootNode) return;
  console.log("Spectacles loaded successfully!");

  if (postType === 'thread') {
    removePostSpoiler(rootNode);
  } else {
    rootNode.childNodes.forEach(x => {
      removePostSpoiler(x, postType);
    });
  }

  VM.observe(rootNode, mutList => {
    mutList.filter(mut => mut.type === 'childList').map(mut => mut.addedNodes[0]).forEach(x => {
      if (!x) return false;
      removePostSpoiler(x, postType);
    });
  }, {
    childList: true
  });
})();

})();
