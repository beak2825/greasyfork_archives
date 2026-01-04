// ==UserScript==
// @name               ASMR Online 一键复制名称
// @name:zh-CN         ASMR Online 一键复制名称
// @name:en            ASMR Online copy title name
// @namespace          ASMR-ONE
// @version            0.1
// @description        给目录树的每个音声加上复制名称的按钮
// @description:zh-CN  给目录树的每个音声加上复制名称的按钮
// @description:en     Add a button to copy title for each file in working tree
// @author             moriya
// @license            MIT
// @match              https://www.asmr.one/work/*
// @icon               https://www.asmr.one/statics/app-logo-128x128.png
// @downloadURL https://update.greasyfork.org/scripts/457308/ASMR%20Online%20%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%90%8D%E7%A7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/457308/ASMR%20Online%20%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%90%8D%E7%A7%B0.meta.js
// ==/UserScript==

(function __MAIN__ () {
  'use strict';

  const aBtnEle = document.createElement('button')
  aBtnEle.style.border = 'none'
  aBtnEle.classList.add(...'q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-cyan shadow-4 q-mx-xs q-px-sm text-white q-btn--actionable q-btn--wrap q-btn--dense'.split(' '))
  aBtnEle.textContent = 'copy'
  aBtnEle.setAttribute('data-xxcopy', true)

  const listContainer = document.getElementById('work-tree').getElementsByClassName('q-card')[0].children[0]
  const Observer = new MutationObserver(() => {

    const items = listContainer.querySelectorAll('[role="listitem"]');

    items.forEach(li => {
      const lastChild = li.lastElementChild
      if (!lastChild.getAttribute('data-xxcopy')) {
        const btnEle = aBtnEle.cloneNode(true)

        li.appendChild(btnEle)
        btnEle.addEventListener('click', (ev) => {
          ev.stopPropagation()

          copy(li.children[2].children[0].textContent)
        })
      }

    })
  });
  Observer.observe(listContainer, { childList: true })

  function copy(title) {
    const type = "text/plain";
    const blob = new Blob([title], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    navigator.clipboard.write(data)
  }

})();