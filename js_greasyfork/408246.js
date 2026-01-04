// ==UserScript==
// @name        sm.arca.LinkHelper
// @namespace   sm.arca
// @include     https://arca.live/b/*
// @include     https://*.arca.live/b/*
// @grant       none
// @version     2.1.0
// @author      Anonymous
// @run-at      document-ready
// @description 인코딩/디코딩하기 귀찮아서
// @downloadURL https://update.greasyfork.org/scripts/408246/smarcaLinkHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/408246/smarcaLinkHelper.meta.js
// ==/UserScript==

'use strict';

const cr = document.createElement.bind(document);

function revealLinkTexts($root) {
  const it = document.createNodeIterator($root, NodeFilter.SHOW_TEXT);
  let tnode = null;
  while(tnode = it.nextNode()) {
    const s = tnode.data;
    if(s.startsWith('aHR0c') && s.match(/^[0-9a-zA-Z+/]+={0,2}$/) && s.length % 4 == 0) {
      const url = atob(s);
      const $a = cr('a');
      $a.href = url; $a.target = '_blank'; $a.textContent = `자동변환 - ${url}`;
      tnode.parentNode.replaceChild($a, tnode);
    }
  }
}

function addBase64Helpers(snoteFn) {
  const $toolbar = document.querySelector('.note-toolbar')
  const $btnGroup = cr('div'); $btnGroup.classList.add('note-btn-group');
  const $encodeBtn = cr('button'); $encodeBtn.type = 'button'; $encodeBtn.classList.add('note-btn');
  $encodeBtn.textContent = 'encode';
  
  $btnGroup.appendChild($encodeBtn);
  $toolbar.appendChild($btnGroup);
  
  $encodeBtn.addEventListener('click', () => {
    const rng = snoteFn('createRange');
    const text = rng.toString();
    const encoded = btoa(text);
    snoteFn('pasteHTML', encoded);
  });
}

function main() {
  const $contentRoot = document.querySelector('.article-content');
  if($contentRoot) revealLinkTexts($contentRoot);
  
  const $writeRoot = document.querySelector('.article-write');
  if($writeRoot) setTimeout(() => { addBase64Helpers($('#content').summernote.bind($('#content'))) }, 0);
}

window.addEventListener('load', main);