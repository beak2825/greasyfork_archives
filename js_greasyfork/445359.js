// ==UserScript==
// @name     skeb-request-auto-link
// @version  1.6
// @grant    none
// @include  https://skeb.jp/*
// @description The auto link for requests of Skeb.
// @license MIT
// @namespace https://greasyfork.org/users/114367
// @downloadURL https://update.greasyfork.org/scripts/445359/skeb-request-auto-link.user.js
// @updateURL https://update.greasyfork.org/scripts/445359/skeb-request-auto-link.meta.js
// ==/UserScript==

const makeLink = elm => {
  if (elm.nodeType != 3) return elm;
  if (elm.textContent.match(/([\s\S]*)(https?:\/\/[\w!?\/+\-=_~;.,*&@#$%()'[\]]+)([\s\S]*)/m)) {
    const pre = RegExp.$1;
    const url = RegExp.$2;
    const next = RegExp.$3;
    const f = document.createDocumentFragment();
    f.appendChild(makeLink(document.createTextNode(pre)));
    const link = document.createElement('A');
    link.textContent = url;
    link.href = url;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.className = 'skeb-request-auto-link';
    f.appendChild(link);
    f.appendChild(makeLink(document.createTextNode(next)));
    return f;
  } else {
    return elm;
  }
};

const execute = () => {
  for (const panel of document.getElementsByClassName('panel-block')) {
    if (panel.getAttribute('data-skebrequestautolink')) continue;
    panel.setAttribute('data-skebrequestautolink', true);
    for (const lines of panel.getElementsByClassName('pre-line')) {
      lines.replaceChild(makeLink(lines.firstChild), lines.firstChild);
    }
  }
};

let timer = setTimeout(execute, 1000);
const observer = new MutationObserver(rec => {
  clearTimeout(timer);
  timer = setTimeout(execute, 1000);
});
observer.observe(document.body, { childList: true, subtree: true });

const style = document.createElement('STYLE');
style.textContent = `
  .skeb-request-auto-link { transition: .2s; }
  .skeb-request-auto-link:hover { background: #0962; }
`;
document.head.appendChild(style);
