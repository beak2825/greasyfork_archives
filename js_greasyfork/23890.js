// ==UserScript==
// @name           crbug colorize
// @description    Colorize bug list based on status
// @match          https://bugs.chromium.org/*
// @version        1.0.4
// @author         wOxxOm
// @namespace      wOxxOm.scripts
// @license        MIT License
// @run-at         document-start
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/23890/crbug%20colorize.user.js
// @updateURL https://update.greasyfork.org/scripts/23890/crbug%20colorize.meta.js
// ==/UserScript==

const prefix = 'wOxxOm-'
const sheet = new CSSStyleSheet();
sheet.replaceSync(`
  .${prefix}Starred { font-weight: bold }
  .${prefix}Archived { color: gray }
  .${prefix}Assigned { color: #3f71b1 }
  .${prefix}Available { color: #92479a }
  .${prefix}Duplicate,
  .${prefix}Invalid { opacity: 0.3 }
  .${prefix}ExternalDependency { color: #ababab }
  .${prefix}Fixed { color: #227700 }
  .${prefix}Started,
  .${prefix}FixPending { color: #06908b }
  .${prefix}Unconfirmed,
  .${prefix}New { color: black }
  .${prefix}Untriaged { color: #947911 }
  .${prefix}Verified, .${prefix}Accepted { color: #6a846f }
  .${prefix}WontFix { color: #d00 }
  tr[class*="${prefix}"] td[width="100%"] a {
    color: inherit;
    text-decoration: underline;
  }
`);

(async () => {
  const app = await added('mr-app');
  const main = await added('main', app);
  while (true) await colorize(main);
})();

async function colorize(main) {
  const page = await added('mr-list-page', main);
  const list = await shadowOf(await added('mr-issue-list', page));
  list.adoptedStyleSheets = [...new Set([...list.adoptedStyleSheets, sheet])];
  await added('td', list.host);
  const tbody = list.querySelector('tbody');
  while (true) {
    for (const el of tbody.getElementsByTagName('td')) {
      const text = el.textContent.trim();
      switch (text) {
        case '':
          continue;
        case 'Accepted':
        case 'Archived':
        case 'Assigned':
        case 'Available':
        case 'Duplicate':
        case 'ExternalDependency':
        case 'FixPending':
        case 'Fixed':
        case 'Invalid':
        case 'New':
        case 'Started':
        case 'Unconfirmed':
        case 'Untriaged':
        case 'Verified':
        case 'WontFix':
          setClass(el, text);
          continue;
        case '★':
          setClass(el, 'Starred');
          continue;
      }
      if (el.align === 'right' && (text === '1' || text === '0')) {
        el.textContent = '';
      }
      if (/% regression in|\b\d(\.\d)?%(-\d(\.\d)?%)? improvement in|test.*?is flaky|^(Android|Chrome)$/.test(text) && el.parentNode) {
        el.parentNode.remove();
      }
    }
    const winner = await Promise.race([
      removed(page),
      added('td', list.host, true),
    ]);
    if (!winner)
      return;
  }
}

function setClass(el, type) {
  const {className} = el.parentNode;
  const token = prefix + type;
  const allTokens = className
    .trim()
    .split(/\s+/)
    .filter(t => !t.startsWith(prefix) || t === token);
  const s = allTokens.join(' ') + (allTokens.includes(token) ? '' : ' ' + token);
  if (s !== className)
    el.parentNode.className = s;
}

async function added(tag, parent = document.documentElement, forceObserver) {
  const target =
    parent.shadowRoot ||
    !parent.localName.includes('-') && parent ||
    await shadowOf(parent);
  return !forceObserver && target.querySelector(tag) || new Promise(resolve => {
    const mo = new MutationObserver(mutations => {
      const el = forceObserver ? mutations.some(mutantAdded, {tag}) : target.querySelector(tag);
      if (el) {
        mo.disconnect();
        resolve(el);
      }
    });
    mo.observe(target, {childList: true, subtree: true});
  });
}

function removed(el) {
  const root = el.getRootNode();
  return root.contains(el) && new Promise(resolve => {
    const mo = new MutationObserver(() => {
      if (!root.contains(el)) {
        mo.disconnect();
        resolve();
      }
    });
    mo.observe(root, {childList: true, subtree: true});
  });
}

function shadowOf(el) {
  return el.shadowRoot || new Promise(resolve => {
    el.attachShadow = function (...args) {
      delete el.attachShadow;
      const root = el.attachShadow(...args);
      resolve(root);
      return root;
    };
  });
}

function mutantAdded({addedNodes, target}) {
  const {tag} = this;
  if (target.localName === tag)
    return true;
  for (const n of addedNodes)
    if (n.localName === tag || n.firstElementChild && n.getElementsByTagName(tag)[0])
      return true;
}
