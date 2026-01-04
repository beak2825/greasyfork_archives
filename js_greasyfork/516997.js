// ==UserScript==
// @name         Riristage Avatar Filter Star Moon
// @namespace    https://github.com/weiduhuo/scripts
// @version      0.3
// @description  Filter avatars based on the attributes of star or moon, with passive automatic data updates via the web.
// @author       weiduhuo
// @match        *://gamewith.jp/riristage/462336
// @match        *://gamewith.jp/riristage/462324
// @match        *://gamewith.jp/riristage/460837*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516997/Riristage%20Avatar%20Filter%20Star%20Moon.user.js
// @updateURL https://update.greasyfork.org/scripts/516997/Riristage%20Avatar%20Filter%20Star%20Moon.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let starAttrIdList = [];

  if (['/riristage/462336', '/riristage/462324'].includes(location.pathname)) {
    getData();
    addFilter();
    loadStyle();
  } else if (location.pathname === '/riristage/460837') {
    saveData();
  }

  function addFilter() {
    if (!starAttrIdList || !starAttrIdList.length) {
      console.log(`Failed to add filter due to data loss. Please updata!`)
      return addUpdataButton();
    }
    const avatarDict = { star: [], moon: [] };
    const parent = document.querySelector('#TierTable0');
    const filter = parent.querySelector('div.w-tier-filter ol');
    const avatars = parent.querySelectorAll('ol._tier-table a._item');

    if (location.pathname === '/riristage/462336') {
      const preCharaNumNotA = localStorage.getItem('GamewithRiristage_charaNumNotA');
      console.log(`The number of charaters: ${avatars.length}`);
      if (!preCharaNumNotA || preCharaNumNotA != avatars.length) {
        console.log(`New charaters is added. Please updata!`);
        return addUpdataButton(filter);
      }
    }
    avatars.forEach((avatar) => {
      const id = avatar.href.match(/\/(\d+)$/)[1];
      if (starAttrIdList.includes(id)) {
        avatarDict.star.push(avatar);
      } else {
        avatarDict.moon.push(avatar);
      }
    });

    const starCheckbox = createElement('input', { type: 'checkbox', id: 'star', value: '星' });
    const moonCheckbox = createElement('input', { type: 'checkbox', id: 'moon', value: '月' });
    function toggleOpacity(avatar, flag) {
      if (flag) {
        avatar.classList.add('is-star-moon');
        avatar.style.setProperty('opacity', '0.3');
      } else {
        avatar.classList.remove('is-star-moon');
        avatar.style.removeProperty('opacity');
      }
    }
    starCheckbox.addEventListener('click', function () {
      avatarDict.moon.forEach((avatar) => toggleOpacity(avatar, this.checked));
    });
    moonCheckbox.addEventListener('click', function () {
      avatarDict.star.forEach((avatar) => toggleOpacity(avatar, this.checked));
    });

    const starCntr = createElement('li', null, [
      starCheckbox, createElement('label', { htmlFor: 'star' }, '星')
    ])
    const moonCntr = createElement('li', null, [
      moonCheckbox, createElement('label', { htmlFor: 'moon' }, '月')
    ])
    const span = createElement('li', null, ' ')
    filter.append(span, starCntr, moonCntr);
  }

  function addUpdataButton(parent) {
    if (!parent) parent = document.querySelector('#TierTable0 ol.w-tier-filter');
    const button = createElement('input', { class: 'updata', type: 'button', id: 'updata', value: 'updata' }, null, {
      click: () => {
        let lastValue = localStorage.getItem('GamewithRiristage_charaNumNotA');
        const newWindow = window.open('/riristage/460837');
        setInterval(() => {
          const newValue = localStorage.getItem('GamewithRiristage_charaNumNotA');
          if (newValue !== lastValue) {
            console.log(`Successfully updated!`);
            newWindow.close();
            location.reload();
          }
        }, 1000);
      }
    });
    const buttonCntr = createElement('li', null, [
      button, createElement('label', { class: 'updata', htmlFor: 'updata' }, 'Click to Updata')
    ]);
    const span = createElement('li', null, ' ')
    parent.append(span, buttonCntr);
  }

  function getData() {
    starAttrIdList = JSON.parse(localStorage.getItem('GamewithRiristage_starAttrIdList'));
  }

  function saveData() {
    const attrAvatars = document.querySelectorAll('.w-instant-database-list tbody > tr ~ tr');
    const charaNumNotA = attrAvatars.length - 12
    console.log(`The number of charaters: ${charaNumNotA} + 12`);
    localStorage.setItem('GamewithRiristage_charaNumNotA', charaNumNotA);
    attrAvatars.forEach((avatar) => {
      if (avatar.classList.contains('star')) {
        const id = avatar.querySelector('a').href.match(/\/(\d+)$/)[1];
        starAttrIdList.push(id);
      }
    })
    starAttrIdList.sort();
    starAttrIdList = starAttrIdList.slice(6); // top 6 A chara 
    localStorage.setItem('GamewithRiristage_starAttrIdList', JSON.stringify(starAttrIdList));
    console.log(`Star attribute charaters excluded A:`);
    console.log(starAttrIdList);
  }

  function createElement(tagName, options, subElements, eventHandlers) {
    const element = document.createElement(tagName);
    if (options) {
      for (let opt in options) {
        if (opt === 'dataset' || opt === 'style') {
          for (let key in options[opt]) {
            element[opt][key] = options[opt][key];
          }
        } else if (opt === 'class') {
          element.className = options[opt];
        } else {
          element[opt] = options[opt];
        }
      }
    }
    if (subElements) {
      updateSubElements(element, subElements);
    }
    if (eventHandlers) {
      for (let e in eventHandlers) {
        element.addEventListener(e, eventHandlers[e]);
      }
    }
    return element;
  }

  function updateSubElements(parent, subElements, isReplace = false) {
    if (isReplace) parent.innerHTML = '';
    if (!subElements) return parent;
    if (typeof subElements === 'string') subElements = [subElements];
    for (let e of subElements) {
      parent.appendChild(typeof e === 'string' ? document.createTextNode(e) : e);
    }
    return parent;
  }

  function loadStyle() {
    const style = document.createElement('style');
    style.innerHTML = `
      .w-tier-table-ui.is-2column>._tier-table>._row ._item-wrap>._item:hover {
        opacity: 0.7 !important;
      }
      input.updata {
        display: none;
      }
      label.updata {
        display: block;
        font-size: 12px;
        font-weight: 700;
        color: #fff;
        background: linear-gradient(
          to bottom,
          #606060 0%,
          #404040 50%,
          #202020 51%,
          #505050 100%
        );
        padding: 2px 6px;
        border-radius: 2px;
        cursor: pointer;
        box-shadow: 0 0 2px #32323233 inset;
      }
    `;
    document.head.appendChild(style);
  }
}());