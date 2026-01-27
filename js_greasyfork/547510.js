// ==UserScript==
// @name         Magiczny przesuwacz przedmiotów
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  Przesuwa rzeczy z raportów na 20 półkę - trzeba kilkać w pole obok nazwy itemu (pojawi się podkreślenie jak przy linku)
// @author       Varriz
// @license      MIT
// @include      *://*.bloodwars.pl/*?a=msg*
// @include      *://*.bloodwars.pl/*?a=equip*
// @include      *://*.bloodwars.pl/*?a=settings*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547510/Magiczny%20przesuwacz%20przedmiot%C3%B3w.user.js
// @updateURL https://update.greasyfork.org/scripts/547510/Magiczny%20przesuwacz%20przedmiot%C3%B3w.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var id = location.host.split('.')[0];
  if (location.host.split('.')[2] === 'net') {
    id = id + 'en';
  }

  // globalny klucz – wspólne ustawienie dla wszystkich światów
  var STORAGE_SHOW_DOWNLOAD = 'MP_showDownloadLink';

  const params = new URLSearchParams(location.search);
  const action = params.get('a');

  // -------------------------
  // USTAWIENIA W /?a=settings
  // -------------------------
  (function injectSettingsUI() {
    if (location.search != "?a=settings") return;

    var div = document.getElementsByClassName('hr720')[0];
    if (!div) return;

    var showDownload = !!GM_getValue(STORAGE_SHOW_DOWNLOAD, false);

    var options = '';
    options += '<br /><br /><span ' +
      'style="color: #fff; text-shadow: 0px -1px 4px white,' +
      ' 0px -2px 10px yellow, 0px -10px 20px #ff8000, 0px -18px 40px red;' +
      ' font: 20px \'BlackJackRegular\';">' +
      'Magiczny przesuwacz przedmiotów</span><br /><br />';

    options += '<center><table width="90%" style="text-align: left; margin-top: 5px;' +
      ' font-family: \'Lucida Grande\', \'Lucida Sans Unicode\', Helvetica, Arial;">';

    options += '<tr><td>' +
      '<input type="checkbox" id="MP_showDownload" ' +
      (showDownload ? 'checked="checked"' : '') +
      '> wyświetlaj link [pobierz]' +
      '</td></tr>';

    options += '</table></center><br /><br />';

    // wstrzykujemy HTML
    div.innerHTML += options;

    // **event delegacja** na kontenerze – łapie change z inputa, nawet jeśli DOM go podmieni
    div.addEventListener('change', function (e) {
      var target = e.target;
      if (!target || target.id !== 'MP_showDownload') return;

      var checked = !!target.checked;
      GM_setValue(STORAGE_SHOW_DOWNLOAD, checked);
      // pomocniczo możesz na chwilę wrzucić:
      // console.log('MP_showDownload changed ->', checked);
    }, false);
  })();

  // -------------------------
  // PART 1: ?a=msg (raporty)
  // -------------------------
  if (action === 'msg' && document.querySelector('.msg_metadata_questResultContainer')) {
    const spans = document.querySelectorAll('span.item-link');
    const showDownload = !!GM_getValue(STORAGE_SHOW_DOWNLOAD, false);

    spans.forEach((span) => {
      const rawId = span.id || '';
      const match = rawId.match(/\d+/);
      if (!match) return;

      const numericId = match[0];

      const link = document.createElement('a');
      link.href = '#';
      if (showDownload) {
        link.innerHTML = '[pobierz]';
      } else {
        link.innerHTML = '&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &#32; &#32;';
      }
      link.style.marginLeft = '6px';
      link.addEventListener('click', (e) => {
        e.preventDefault();
        GM_setValue(id + 'przeniesId', numericId);
        window.location.href = '?a=equip';
      });

      span.appendChild(document.createTextNode(' '));
      span.appendChild(link);
    });
  }

  // -------------------------
  // PART 2: ?a=equip (przenoszenie)
  // -------------------------
  if (action === 'equip') {
    const key = id + 'przeniesId';
    const stored = GM_getValue(key, '');

    if (stored) {
      try {
        const btn =
          document.querySelector('#equipNewTabBtn') ||
          document.querySelector('.equipNewTabBtn') ||
          document.querySelector('input[type="submit"][name="changeTab"]');

        const form =
          (btn && btn.closest('form')) ||
          document.querySelector('form[action*="equip"]') ||
          document.querySelector('form');

        if (!form) {
          alert('Nie znaleziono formularza wyposażenia (equip).');
          return;
        }

        const newTabSelect = form.querySelector('select[name="newTab"]');
        if (newTabSelect && typeof clanItemsTabNr !== 'undefined') {
          newTabSelect.value = String(clanItemsTabNr);
          if (typeof simulateNewTabChange === 'function') simulateNewTabChange();
        }

        const isItemCb = (cb) =>
          cb.type === 'checkbox' &&
          (
            cb.hasAttribute('data-itemid') ||
            /item/i.test(cb.name || '') ||
            cb.hasAttribute('data-name')
          );

        const allCbs = Array.from(form.querySelectorAll('input[type="checkbox"]'));
        const itemCbs = allCbs.filter(isItemCb);

        itemCbs.forEach(cb => { cb.checked = false; });

        form.querySelectorAll('input[data-tm-injected="1"]').forEach(el => el.remove());

        let existing =
          itemCbs.find(cb => cb.getAttribute('data-itemid') === String(stored)) ||
          itemCbs.find(cb => cb.value === String(stored));

        let scheme = { mode: 'array', nameBase: 'itemid', valueKind: 'id', dataName: 'moveTbl' };

        const sample =
          existing ||
          itemCbs.find(cb => cb.hasAttribute('data-name')) ||
          itemCbs[0];

        if (sample) {
          const sampleName = sample.getAttribute('name') || 'itemid';
          const sampleVal = sample.getAttribute('value') || '';
          const sampleDataName = sample.getAttribute('data-name') || 'moveTbl';
          scheme.dataName = sampleDataName;

          if (/\[\s*\]$/.test(sampleName)) {
            scheme.mode = 'array';
            scheme.nameBase = sampleName;
            scheme.valueKind = 'id';
          } else if (/^[^\[]+\[\d+\]$/.test(sampleName)) {
            scheme.mode = 'bracket';
            scheme.nameBase = sampleName.replace(/\[\d+\]$/, '');
            scheme.valueKind = (/\d+/.test(sampleVal)) ? 'id' : 'on';
          } else {
            scheme.mode = 'flat';
            scheme.nameBase = sampleName;
            scheme.valueKind = 'id';
          }
        }

        let targetCb;
        if (existing) {
          existing.checked = true;
          targetCb = existing;
        } else {
          const makeCb = (name, value) => {
            const el = document.createElement('input');
            el.type = 'checkbox';
            el.name = name;
            el.value = value;
            el.checked = true;
            el.style.display = 'none';
            el.setAttribute('data-itemid', String(stored));
            el.setAttribute('data-name', scheme.dataName);
            el.setAttribute('data-tm-injected', '1');
            return el;
          };

          if (scheme.mode === 'array') {
            targetCb = makeCb(scheme.nameBase, String(stored));
          } else if (scheme.mode === 'bracket') {
            targetCb = makeCb(`${scheme.nameBase}[${stored}]`, scheme.valueKind === 'on' ? 'on' : String(stored));
          } else {
            targetCb = makeCb(scheme.nameBase, String(stored));
          }
          form.appendChild(targetCb);
        }

        form.querySelectorAll('input[name="changeTab"]').forEach(el => {
          if (el !== btn) el.remove();
        });
        const hiddenSubmitName = document.createElement('input');
        hiddenSubmitName.type = 'hidden';
        hiddenSubmitName.name = 'changeTab';
        hiddenSubmitName.value = (btn && btn.value) ? btn.value : 'PRZENIEŚ';
        hiddenSubmitName.setAttribute('data-tm-injected', '1');
        form.appendChild(hiddenSubmitName);

        form.submit();

      } finally {
        GM_setValue(key, '');
      }
    }
  }

})();
