// ==UserScript==
// @name         YYGQ过滤器
// @namespace    SeaLoong
// @version      0.2
// @description  过滤网页中一些令人反感和阴阳怪气的词句
// @author       SeaLoong
// @include      /https?.+/
// @grant        none
// @run-at       document-end
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/408345/YYGQ%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/408345/YYGQ%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

'use strict';

const tagReg = /<\S*?[^>]*>/g;
const words = [
  /(不会.*?吧)+/g,
  /((ta?|他|她|它)(急了)+)+/g,
  /(你.*?品)+/g,
  /(就这)+/g
];
const replacement = '🚫';

function matchAll (regex, str) {
  const results = [];
  if (regex.global) {
    let r;
    while ((r = regex.exec(str))) results.push(r);
  }
  return results;
}

const wm = new WeakMap();
async function filter (node) {
  let html = node.innerHTML;
  if (wm.get(node) === html) return;
  if (node.innerText && node.innerText.includes('\n')) {
    for (const ch of node.children) {
      await filter(ch);
    }
    for (const nd of node.childNodes) {
      if (nd.nodeType !== 3) continue;
      let text = nd.nodeValue;
      if (!text) continue;
      for (const w of words) {
        text = text.replace(w, replacement);
      }
      nd.nodeValue = text;
    }
    wm.set(node, html);
    return;
  }
  let text = html.replace(tagReg, '');
  let reassign = false;
  for (let cnt = 0; cnt < words.length; cnt++) {
    const poses = matchAll(words[cnt], text);
    if (poses.length === 0) continue;
    reassign = true;
    const list = [];
    const tags = matchAll(tagReg, html);
    let i = 0;
    let j = 0;
    let pos = 0;
    let lpos = 0;
    while (i < poses.length) {
      const diff = poses[i].index - (i > 0 ? (poses[i - 1].index + poses[i - 1][0].length) : 0);
      pos += diff;
      while (j < tags.length && pos >= tags[j].index) {
        pos += tags[j][0].length;
        j++;
      }
      list.push(html.substring(lpos, pos));
      list.push(replacement);
      pos += poses[i][0].length;
      while (j < tags.length && pos > tags[j].index) {
        list.push(tags[j][0]);
        pos += tags[j][0].length;
        j++;
      }
      lpos = pos;
      i++;
    }
    list.push(html.substring(pos));
    html = list.join('');
    if (cnt < words.length - 1) text = html.replace(tagReg, '');
  }
  if (reassign) node.innerHTML = html;
  wm.set(node, html);
}

const f = async () => {
  await filter(document.head);
  await filter(document.body);
  setTimeout(f, 500);
};

f();
