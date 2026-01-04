// ==UserScript==
// @name         ExIndex
// @name:zh-TW   快速索引
// @namespace    https://github.com/FlandreDaisuki
// @version      0.3
// @description  Like bookmarks, but apply E-H & ExH
// @description:zh-TW  車速才是老司機的價值
// @author       FlandreDaisuki
// @match        https://exhentai.org/*
// @match        https://e-hentai.org/*
// @exclude      https://exhentai.org/s/*
// @exclude      https://exhentai.org/g/*
// @exclude      https://e-hentai.org/s/*
// @exclude      https://e-hentai.org/g/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAACeklEQVRYhe2XTWgTQRiGB1Qspd6lp9ySNe4s7EA9lP6xK7RNRlEp4sUfij32IiLoyXpR8GDFgr1VkZ6CQZqSiGDF9pB2J6FId3vIbBYvFX+o9KK2IK+HkpTURJI0TSPkg+f0Me88fAzDDCHNalazdiqTyRy17GxH2nYNy3HNahC2d8rzvJY9y4hVeUXY7rpwXOwZ2/2est1rVcukVrO8JiK7sGzvbHXTcdzkfggJR4qiG8LubYPgOtJhA1bI3I1wMr/2RciWm4UiS4PHIfgULP4DgqMUwsnsw3S22ZHB0CFYfAWC48P8LTxJvMJY7D3uxuYPSCjFr0JwvJl7iKHIegF1F8Jc72EILr8lL+NS5EsDCFl8GILj6euXf8nUXQiCHYHg3qfkMC5GvjaAUCo0AsExHo8VlTmACYU/QnA4CzewsnCzKHUWKn3fHMg91BT674R+vgihUlaTcThLiUIWE1iOxPcMcamJRoJIamyVatrUwAztwQztgU2NqjcpN0eq5iaR1EgXa06oXdApg6Jto1OGCbWrYplKciQ1UsSl5oXdjee0C4rG0G0OYHxyCuOTU+g2B6BoDM8qkKo456R5nhBCSFY1r0vV3Mg1QrQDisYwHZ3Nn/7p6CwUjaGfdpQtVG6OVM0NqZojBa/FtXbWKoN9nR41+k9QfUvRGN4m0/mgd4vLUDSGANV/e9ToL4dycmSwr3OtnbX+8xEf0NiaojHcufcgH3R77H4u6HOZf4Ga5RCF6o9yh9AYPIPT4XP5QxlQ2eN65xC/338sQHUrtzgfQnUrGAy21TuHEEKIz+dr8VM2qmgsqmgs6qds1OfzVfzlrVVOsxq2/gB2jJNrPQttPQAAAABJRU5ErkJggg==
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/375969/ExIndex.user.js
// @updateURL https://update.greasyfork.org/scripts/375969/ExIndex.meta.js
// ==/UserScript==

const db = new Map(GM_getValue('📑', []));
const i18nDict = {
  zh: {
    ExIndex: '快速索引',
    AddBtnText: '加入目前網址',
    AddBtnDesc: '有相同名字更新網址、無則新增',
    RmBtnText: '刪除此名字',
    RmBtnDesc: '有相同名字刪除之、無則不變',
  },
  en: {
    ExIndex: 'ExIndex',
    AddBtnText: 'Add current url with this name',
    AddBtnDesc: 'If you had the same name index, replace to current url, else add it.',
    RmBtnText: 'Remove the index has this name',
    RmBtnDesc: 'If you had the same name index, remove it, else no change.',
  },
};

/* Functions */
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const $el = (t, a = {}, c = () => {}) => {
  const e = document.createElement(t);
  Object.assign(e, a);
  c(e);
  return e;
};
const db2li = (ul) => {
  while(ul.firstChild) {
    ul.firstChild.remove();
  }

  for(const [name, href] of db) {
    const li = $el('li');
    const a = $el('a', { href, textContent: name });
    li.appendChild(a);
    ul.appendChild(li);
  }
}
const i18n = (key) => {
  for(const lang of navigator.languages) {
    const s = i18nDict[lang] && i18nDict[lang][key];
    if(s) {
      return s;
    }
  }
  return i18nDict.en[key];
};

/* Elements */
const searchOptLists = $('p.nopm:nth-of-type(2)');
searchOptLists.id = '🔱';
searchOptLists.childNodes[1].remove();

const enrtyBtn = $el('a', {
  href: 'javascript:;',
  textContent: i18n('ExIndex'),
});

const fastListBlock = $el('div', { id: '🏕', className: '🈚️' });
const fastLists = $el('ul', { id: '🔢' });
const fastListAddName = $el('input', { type: 'text' });
const fastListAddBtn = $el('button', {
  textContent: i18n('AddBtnText'),
  title: i18n('AddBtnDesc'),
});
const fastListRmBtn = $el('button', {
  textContent: i18n('RmBtnText'),
  title: i18n('RmBtnDesc'),
});

const stylesheet = $el('style', {
  textContent:`
#🔱 {
  display: flex;
  justify-content: center;
  align-items: baseline;
}
#🏕 {
  width: 600px;
  margin: 8px auto;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
}
#🔢 {
  width: 100%;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: baseline;
  list-style: none;
}
#🔱 > a,
#🔢 > li {
  margin: 0 5px;
}
.🈚️ {
  display: none !important;
}
`,
});

/* Events */

EventTarget.prototype.on = EventTarget.prototype.addEventListener;

enrtyBtn.on('click', () => {
  fastListBlock.classList.toggle('🈚️');
});

fastListAddBtn.on('click', () => {
  const nameValue = fastListAddName.value.trim();
  if(!nameValue) { return; }

  const u = new URL(location.href);
  [...u.searchParams.entries()].forEach(([k, v]) => {
    if(v === '0') { u.searchParams.delete(k); }
  });
  db.set(nameValue, u.href.replace(u.origin, ''));
  GM_setValue('📑', [...db.entries()]);

  db2li(fastLists);
});

fastListRmBtn.on('click', () => {
  const nameValue = fastListAddName.value.trim();
  if(!nameValue) { return; }

  if(db.delete(nameValue)) {
    GM_setValue('📑', [...db.entries()]);
    db2li(fastLists);
  }
});

delete EventTarget.prototype.on;

/* RealDOM */
searchOptLists.appendChild(enrtyBtn);
fastListBlock.appendChild(fastLists);
db2li(fastLists);
fastListBlock.appendChild(fastListRmBtn);
fastListBlock.appendChild(fastListAddName);
fastListBlock.appendChild(fastListAddBtn);
$('#fsdiv').insertAdjacentElement('afterend', fastListBlock);
document.head.appendChild(stylesheet);

/* Overrides */
const show_pane = (id, a, ofunc) => {
  const div = $(`#${id}`);
  if(div.firstChild) {
    div.style.display = null;
    a.textContent = a.textContent.replace('Show', 'Hide');
  } else {
    ofunc(a);
  }
};
const __show_advsearch_pane = unsafeWindow.show_advsearch_pane;
const __show_filesearch_pane = unsafeWindow.show_filesearch_pane;
unsafeWindow.show_advsearch_pane = (a) => show_pane('advdiv', a, __show_advsearch_pane);
unsafeWindow.show_filesearch_pane = (a) => show_pane('fsdiv', a, __show_filesearch_pane);

const hide_pane = (id, a) => {
  $(`#${id}`).style.display = 'none';
  a.textContent = a.textContent.replace('Hide', 'Show');
};
unsafeWindow.hide_advsearch_pane = (a) => hide_pane('advdiv', a);
unsafeWindow.hide_filesearch_pane = (a) => hide_pane('fsdiv', a);

$$('#🔱 > a[href="#"]').forEach((a) => {
  if(a.textContent.includes('Hide')) {
    a.click();
  }
});
