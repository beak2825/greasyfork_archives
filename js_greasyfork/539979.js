// ==UserScript==
// @name         Regex Helper UI
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Vyhledávání a výběr Regex ID v popupu na stránce Livesport Kvido
// @author       Tvůj Asistent
// @match        *://dc.livesport.eu/kvido/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539979/Regex%20Helper%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/539979/Regex%20Helper%20UI.meta.js
// ==/UserScript==

(function () {
  console.log('🚀 Regex Helper UI v2.2 spuštěn');

  const popupId = '#dlist_Kvido_TemplateItem_Form_box_wrapper';
  const tdSelector = 'td.dc_validation.KvidoAlertTemplateItem-alert_item_regex_id';
  let activeIndex = -1;
  const autoClose = true;

  function isPopupOpen(popup) {
    return popup && getComputedStyle(popup).display !== 'none';
  }

  function logDetection(select) {
    console.groupCollapsed('📦 Detekce popupu a selectu');
    console.log('✅ Popup nalezen v DOM');
    console.log('✅ TD nalezen podle class');
    console.log('✅ Select nalezen');
    console.log(`🔢 Počet možností v selectu: ${select.options.length}`);
    console.groupEnd();
  }

  function setStatusMessage(text, isSuccess) {
    const label = document.querySelector('#regex-selected-label');
    if (label) {
      label.innerText = text;
      label.style.color = isSuccess ? 'green' : 'red';
      label.style.opacity = 1;
      setTimeout(() => {
        label.style.transition = 'opacity 0.5s';
        label.style.opacity = 0;
      }, 2000);
    }
  }

  function forceSelectValue(select, value, label, container) {
    select.value = value;
    select.selectedIndex = Array.from(select.options).findIndex(opt => opt.value === value);
    select.dispatchEvent(new Event('input', { bubbles: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));

    if (select.value === value) {
      console.log(`✅ Výběr potvrzen: ${label} (${value})`);
      select.style.border = '2px solid green';
      setStatusMessage(`✅ Vybráno: ${label}`, true);
      localStorage.setItem('lastRegexLabel', label);
    } else {
      console.error(`❌ Výběr selhal! Pokusili jsme se vybrat ${label} (${value})`);
      select.style.border = '2px solid red';
      setStatusMessage(`❌ Nepodařilo se vybrat: ${label}`, false);
    }

    setTimeout(() => (select.style.border = ''), 2000);

    if (autoClose) {
      setTimeout(() => {
        container.remove();
        select.dataset.searchAttached = 'false';
        console.log('🧼 UI zavřeno po výběru');
      }, 2000);
    }
  }

  function highlightMatch(text, query) {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return text.substring(0, idx) + '<b>' + text.substring(idx, idx + query.length) + '</b>' + text.substring(idx + query.length);
  }

  function addSearchUI(select) {
    if (select.dataset.searchAttached === 'true') return;
    select.dataset.searchAttached = 'true';
    logDetection(select);

    const container = document.createElement('div');
    container.id = 'regex-search-box';
    container.style = `
      position: fixed; top: 20px; right: 20px; padding: 12px;
      background: white; border: 1px solid #ccc; z-index: 9999;
      box-shadow: 0 0 10px rgba(0,0,0,0.2); border-radius: 8px;
      font-family: sans-serif; width: 320px;
    `;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Hledej regex...';
    input.style = 'width: 100%; padding: 6px; margin-bottom: 8px; font-size: 14px;';
    input.id = 'regex-input';

    const resultList = document.createElement('div');
    resultList.id = 'regex-result-list';
    resultList.style = 'max-height: 250px; overflow-y: auto; border: 1px solid #eee; border-radius: 5px;';

    const label = document.createElement('div');
    label.id = 'regex-selected-label';
    label.style = 'margin-top: 10px; font-size: 14px; opacity: 0;';

    const last = localStorage.getItem('lastRegexLabel');
    if (last) {
      const lastDiv = document.createElement('div');
      lastDiv.innerText = `🕘 Naposledy vybráno: ${last}`;
      lastDiv.style = 'font-size: 12px; color: #555; margin-bottom: 8px;';
      container.appendChild(lastDiv);
    }

    const close = document.createElement('span');
    close.innerText = '✖';
    close.style = 'position:absolute; top:5px; right:10px; cursor:pointer; color: red;';
    close.onclick = () => {
      container.remove();
      select.dataset.searchAttached = 'false';
      console.log('❌ Okno zavřeno uživatelem.');
    };

    function renderResults(query) {
      const q = query.toLowerCase().trim();
      resultList.innerHTML = '';
      activeIndex = -1;

      if (q.length < 2) {
        resultList.innerHTML = `<div style="padding:6px; color: gray;">Zadej alespoň 2 znaky…</div>`;
        return;
      }

      const matches = Array.from(select.options).filter(opt =>
        opt.text.toLowerCase().includes(q)
      );

      console.log(`🔍 Hledám "${query}" – výsledků: ${matches.length}`);

      if (matches.length === 0) {
        resultList.innerHTML = `<div style="padding:6px; color: gray;">Žádná shoda</div>`;
        return;
      }

      matches.forEach((opt, i) => {
        const item = document.createElement('div');
        item.innerHTML = highlightMatch(opt.text, q);
        item.classList.add('regex-item');
        item.dataset.index = i;
        item.dataset.value = opt.value;
        item.dataset.label = opt.text;
        item.style = `
          padding: 6px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          font-size: 14px;
        `;
        item.onmouseover = () => {
          Array.from(resultList.children).forEach(el => el.style.background = 'white');
          item.style.background = '#f0f0f0';
          activeIndex = i;
        };
        item.onclick = () => {
          forceSelectValue(select, opt.value, opt.text, container);
        };
        resultList.appendChild(item);
      });
    }

    input.addEventListener('input', () => {
      renderResults(input.value);
    });

    input.addEventListener('keydown', (e) => {
      const items = resultList.querySelectorAll('.regex-item');
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        activeIndex = (activeIndex + 1) % items.length;
        updateActiveItem(items);
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        updateActiveItem(items);
        e.preventDefault();
      } else if (e.key === 'Enter') {
        if (activeIndex >= 0 && items[activeIndex]) {
          const item = items[activeIndex];
          forceSelectValue(select, item.dataset.value, item.dataset.label, container);
        }
      }
    });

    function updateActiveItem(items) {
      items.forEach(el => el.style.background = 'white');
      const active = items[activeIndex];
      if (active) {
        active.scrollIntoView({ block: 'nearest' });
        active.style.background = '#d2ebff';
      }
    }

    container.appendChild(close);
    container.appendChild(input);
    container.appendChild(resultList);
    container.appendChild(label);
    document.body.appendChild(container);
    input.focus();
  }

  const observer = new MutationObserver(() => {
    const popup = document.querySelector(popupId);
    if (!isPopupOpen(popup)) return;

    const td = popup.querySelector(tdSelector);
    const select = td?.querySelector('select');

    if (select) {
      console.log('📦 Select v popupu detekován!');
      addSearchUI(select);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  const popup = document.querySelector(popupId);
  if (isPopupOpen(popup)) {
    const td = popup.querySelector(tdSelector);
    const select = td?.querySelector('select');
    if (select) addSearchUI(select);
  }
})();
