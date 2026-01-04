// ==UserScript==
// @name YT-DimBotComments
// @version 0.1.1
// @description Dim YouTube comments from suspected bot accounts
// @author codenameClio
// @match https://www.youtube.com/*
// @run-at document-end
// @namespace https://github.com/codenameClio/YT-DimBotComments
// @homepageURL https://github.com/codenameClio/YT-DimBotComments
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527251/YT-DimBotComments.user.js
// @updateURL https://update.greasyfork.org/scripts/527251/YT-DimBotComments.meta.js
// ==/UserScript==

const appname = 'YT-DBC';
const containerQuery = 'ytd-comments#comments ytd-item-section-renderer#sections div#contents.ytd-item-section-renderer';
const commentQuery = 'ytd-comment-thread-renderer';
const commentAuthorQuery = '#comment a#author-text span';

const suspects = [
  /^@[a-zA-Z]+-?(?!19\d{2}|20[0-4]\d|2050)\d{4}$/,
  /^@[A-Za-z]*-([a-z]{1,2}\d){1,2}[a-z]{1,2}$/
]

const containerConfig = {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false
};

const commentConfig = {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false
};

const parseAuthor = node => {
  return node.querySelector(commentAuthorQuery).textContent.trim();
}

const validateAuthor = author => {
  for (const suspect of suspects) {
    if (suspect.test(author)) {
      return true;
    }
  }
  return false;
}

const processComment = comment => {
  let author = parseAuthor(comment);
  if (author) {
    let authorFlag = validateAuthor(author);
    if (authorFlag)
      comment.style.opacity = '0.5';
  }
}

const connectObserver = (observer, target, config, observerName = 'observer') => {
  if (observer && observer instanceof MutationObserver) {
    observer.observe(target, config);
  }
}

const disconnectObserver = (observer, observerName = 'observer') => {
  if (observer && observer instanceof MutationObserver) {
    observer.disconnect();
  }
}

const commentObserver = new MutationObserver(commentMuts => {
  commentMuts.forEach(commentMut => {
    if (commentMut.type === 'childList') {
      commentMut.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && node.nodeName.toLowerCase() === commentQuery) {
          processComment(node);
        }
      });
    }
  });
});

const containerObserver = new MutationObserver(containerMuts => {
  containerMuts.forEach(containerMut => {
    if (containerMut.type === 'childList') {
      containerMut.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          let target = document.querySelector(containerQuery);
          if (node === target) {
            disconnectObserver(containerObserver, 'containerObserver');
            connectObserver(commentObserver, node, commentConfig, 'commentObserver');
            return;
          }
        }
      });
    }
  });
});

const startObservers = () => {
  const container = document.querySelector(containerQuery);
  if (container) {
    disconnectObserver(containerObserver, 'containerObserver');
    connectObserver(commentObserver, container, commentConfig, 'commentObserver');
  } else {
    connectObserver(containerObserver, document.body, containerConfig, 'containerObserver');
  }
};

document.addEventListener('yt-navigate-start', () => {
  disconnectObserver(commentObserver, 'commentObserver');
  disconnectObserver(containerObserver, 'containerObserver');
});

document.addEventListener('yt-navigate-finish', () => {
  let watchFlag = document.location.pathname === '/watch';
  if (watchFlag) {
    startObservers();
  }
});
