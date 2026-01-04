// ==UserScript==
// @name        Template loader
// @namespace   Violentmonkey Scripts
// @match       https://sm.arca.live/b/smpeople/write
// @grant       none
// @version     1.0
// @author      -
// @description 2021. 1. 17. 오후 2:49:38
// @downloadURL https://update.greasyfork.org/scripts/420307/Template%20loader.user.js
// @updateURL https://update.greasyfork.org/scripts/420307/Template%20loader.meta.js
// ==/UserScript==

const TEMPLATE = {
  '일반': null,
  '정보': 'https://sm.arca.live/b/smpeople/19383868'
};

const fetchTemplate = async (category) => {
  if(!TEMPLATE[category]) return '';
  return await fetch(TEMPLATE[category])
    .then(res => res.text())
    .then(html => new DOMParser().parseFromString(html, 'text/html'))
    .then(dom => dom.querySelector('.article-content').innerHTML);
}

const loadTemplate = async (category) => {
  const template = await fetchTemplate(category);
  
  const editorBox = document.querySelector('.write-body .fr-element');
  editorBox.innerHTML = template;
  
  const editorPlaceHolder = document.querySelector('.fr-placeholder');
  editorPlaceHolder.style.display = template ? 'none' : 'block';
};

const attachTemplate = () => {
  const tabs = document.querySelectorAll('.sub-row span');
  tabs.forEach(tab => {
    const button = tab.querySelector('input');
    const label = tab.querySelector('label');
    
    if(button && label) {
      button.addEventListener('click', e => {
        loadTemplate(label.innerText);
      });
    }
  });
}

window.addEventListener('load', e => {
  attachTemplate();
});