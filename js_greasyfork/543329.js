// ==UserScript==
// @name         OM kitöltő inyr.hu-hoz
// @name:en      OM Autofill for inyr.hu
// @name:de      OM Auto-Ausfüllen für inyr.hu
// @name:fr      Remplissage automatique OM pour inyr.hu

// @description  Magán fejlesztésű bővítmény, független az inyr.hu-tól — Több OM automatikus kitöltése, lebegő beállítási panellel, biztonságos GM tárolással és többnyelvű kezeléssel
// @description:en  Personal, independent userscript for inyr.hu – Multiple OM autofill with floating settings panel, secure GM storage, and multilingual support
// @description:de  Persönliches, unabhängiges Skript für inyr.hu – Automatisches Ausfüllen mehrerer OM-IDs mit schwebendem Panel und sicherem GM-Speicher
// @description:fr  Script personnel et indépendant pour inyr.hu – Remplissage automatique de plusieurs OM avec panneau flottant et stockage sécurisé

// @namespace    https://greasyfork.org/hu/users/1496003-d%C3%A1niel-%C3%A1cs-dani
// @version      4.1
// @author       Ács Dániel
// @license      GPL-3.0
// @match        https://www.inyr.hu/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/543329/OM%20kit%C3%B6lt%C5%91%20inyrhu-hoz.user.js
// @updateURL https://update.greasyfork.org/scripts/543329/OM%20kit%C3%B6lt%C5%91%20inyrhu-hoz.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const alapHatter = '#fff7e5';
  const hibaHatter = 'lightpink';
  const shareUrl = 'https://greasyfork.org/hu/scripts/543329';

  const labelsByLang = {
    hu: {
      name: 'Magyar',
      autofill: 'Automatikus kitöltés',
      language: 'Nyelv',
      save: 'Mentés',
      clear: 'OM törlése',
      openPanel: '⚙ Beállítások',
      panelTitle: 'Beállítások',
      omPlaceholder: 'Írd be az OM azonosítót...',
      share: 'Megosztási link másolása',
      shareSuccess: 'A megosztási link vágólapra került!',
      shareError: 'Sajnos nem sikerült másolni. Másold manuálisan:',
      omListLabel: 'Mentett OM azonosítók',
      omAddButton: '+',
      omDeleteButton: '❌',
      invalidOmAlert: 'Hibás OM azonosító! Csak 6 számjegy megengedett.'
    },
    en: {
      name: 'English',
      autofill: 'Autofill',
      language: 'Language',
      save: 'Save',
      clear: 'Clear OM',
      openPanel: '⚙ Settings',
      panelTitle: 'Settings',
      omPlaceholder: 'Enter OM ID...',
      share: 'Copy share link',
      shareSuccess: 'The share link has been copied to clipboard!',
      shareError: 'Copy failed. Please copy manually:',
      omListLabel: 'Saved OM IDs',
      omAddButton: '+',
      omDeleteButton: '❌',
      invalidOmAlert: 'Invalid OM ID! Only 6 digits are allowed.'
    },
    de: {
      name: 'Deutsch',
      autofill: 'Auto-Ausfüllen',
      language: 'Sprache',
      save: 'Speichern',
      clear: 'OM löschen',
      openPanel: '⚙ Einstellungen',
      panelTitle: 'Einstellungen',
      omPlaceholder: 'OM-ID eingeben...',
      share: 'Teilen-Link kopieren',
      shareSuccess: 'Der Teilen-Link wurde in die Zwischenablage kopiert!',
      shareError: 'Kopieren fehlgeschlagen. Bitte manuell kopieren:',
      omListLabel: 'Gespeicherte OM-IDs',
      omAddButton: '+',
      omDeleteButton: '❌',
      invalidOmAlert: 'Ungültige OM-ID! Nur 6 Ziffern erlaubt.'
    },
    fr: {
      name: 'Français',
      autofill: 'Remplissage automatique',
      language: 'Langue',
      save: 'Sauvegarder',
      clear: 'Effacer OM',
      openPanel: '⚙ Paramètres',
      panelTitle: 'Paramètres',
      omPlaceholder: 'Entrez l’ID OM...',
      share: 'Copier le lien de partage',
      shareSuccess: 'Le lien de partage a été copié dans le presse-papiers !',
      shareError: 'Échec de la copie. Veuillez le copier manuellement :',
      omListLabel: 'Identifiants OM enregistrés',
      omAddButton: '+',
      omDeleteButton: '❌',
      invalidOmAlert: 'ID OM invalide ! Seuls 6 chiffres sont autorisés.'
    }
  };

  const userLangCode = GM_getValue('nyelv') || navigator.language?.split('-')[0]?.toLowerCase();
  const lang = labelsByLang[userLangCode] ? userLangCode : 'hu';
  const labels = labelsByLang[lang];

  const omLista = GM_getValue('omLista', []);
  const aktivOm = omLista.length > 0 ? omLista[omLista.length - 1] : '';
  GM_setValue('aktivOm', aktivOm);
  const autofillEnabled = GM_getValue('autofillEnabled', true);
  const omInput = document.querySelector('#Omkod');
  if (!omInput) return;

  omInput.setAttribute('type', 'text');
  omInput.setAttribute('inputmode', 'numeric');
  omInput.setAttribute('placeholder', labels.omPlaceholder);
  omInput.style.backgroundColor = alapHatter;

  if (autofillEnabled && /^\d{6}$/.test(aktivOm) && omInput.value === '') {
    omInput.value = aktivOm;
  }

  omInput.addEventListener('input', () => {
  const val = omInput.value.trim();
  if (/^\d{6}$/.test(val)) {
    omInput.style.backgroundColor = alapHatter;

    const omLista = GM_getValue('omLista', []);
    if (!omLista.includes(val)) {
      const updatedList = [...omLista, val];
      GM_setValue('omLista', updatedList);
      GM_setValue('aktivOm', val);
    } else {
      GM_setValue('aktivOm', val);
    }
  } else {
    omInput.style.backgroundColor = hibaHatter;
  }
});

  const panelBtn = document.createElement('div');
  panelBtn.textContent = labels.openPanel;
  panelBtn.style.position = 'fixed';
  panelBtn.style.top = '50%';
  panelBtn.style.right = '0';
  panelBtn.style.transform = 'translateY(-50%)';
  panelBtn.style.padding = '8px 12px';
  panelBtn.style.background = '#007b5e';
  panelBtn.style.color = '#fff';
  panelBtn.style.fontSize = '14px';
  panelBtn.style.borderRadius = '4px 0 0 4px';
  panelBtn.style.cursor = 'pointer';
  panelBtn.style.zIndex = '9999';
  document.body.appendChild(panelBtn);

  const panel = document.createElement('div');
  panel.style.position = 'fixed';
  panel.style.top = '50%';
  panel.style.right = '-260px';
  panel.style.transform = 'translateY(-50%)';
  panel.style.width = '260px';
  panel.style.background = '#f4f4f4';
  panel.style.border = '1px solid #ccc';
  panel.style.padding = '12px';
  panel.style.fontFamily = 'sans-serif';
  panel.style.zIndex = '9999';
  panel.style.transition = 'right 0.3s ease';

  const languageOptions = Object.entries(labelsByLang)
    .map(([code, data]) => `<option value="${code}">${data.name}</option>`)
    .join('');

  const omSelectOptions = omLista.map(om => `<option value="${om}">${om}</option>`).join('');

  panel.innerHTML = `
    <div style="position:absolute; top:6px; right:8px; font-size:16px; cursor:pointer;" id="omPanelCloseBtn">❌</div>
    <div style="font-weight:bold; margin-bottom:10px;">${labels.panelTitle}</div>
    <label><input type="checkbox" id="omAutofillToggle"> ${labels.autofill}</label><br><br>
    <label>${labels.language}:
      <select id="omLangSelect">${languageOptions}</select>
    </label><br><br>
    <label>${labels.omListLabel}:
      <select id="omSelect" style="width:130px;">${omSelectOptions}</select>
      <button id="omAddBtn">${labels.omAddButton}</button>
      <button id="omDeleteBtn">${labels.omDeleteButton}</button>
    </label><br><br>
    <button id="omSaveBtn">${labels.save}</button>
    <button id="omClearBtn" style="margin-left:8px;">${labels.clear}</button>
    <button id="omShareBtn" style="margin-top:12px;">${labels.share}</button><br>
    <div style="margin-top:16px; font-size:12px; text-align:center;">
  <a href="https://kirint.kir.hu/IntezmenyKereso/" target="_blank" style="color:#007b5e; text-decoration:none;">
    🔗 KIRINT Intézménykereső
  </a>
</div>
  `;
  document.body.appendChild(panel);
  panel.querySelector('#omAutofillToggle').checked = autofillEnabled;
  panel.querySelector('#omLangSelect').value = lang;
  panel.querySelector('#omSelect').value = aktivOm;

  panel.querySelector('#omPanelCloseBtn').addEventListener('click', () => {
  panelVisible = false;
  panel.style.right = '-260px';
});

  panel.querySelector('#omSaveBtn').addEventListener('click', () => {
    const enabled = panel.querySelector('#omAutofillToggle').checked;
    const langSel = panel.querySelector('#omLangSelect').value;
    GM_setValue('autofillEnabled', enabled);
    GM_setValue('nyelv', langSel);
    location.reload();
  });

  panel.querySelector('#omClearBtn').addEventListener('click', () => {
    GM_setValue('omLista', []);
    GM_setValue('aktivOm', '');
    omInput.value = '';
    omInput.style.backgroundColor = alapHatter;
    location.reload();
  });

  panel.querySelector('#omDeleteBtn').addEventListener('click', () => {
    const select = panel.querySelector('#omSelect');
    const toDelete = select.value;
    const updatedList = omLista.filter(om => om !== toDelete);
    GM_setValue('omLista', updatedList);
    GM_setValue('aktivOm', updatedList[updatedList.length - 1] || '');
    location.reload();
  });

  panel.querySelector('#omAddBtn').addEventListener('click', () => {
    const newOM = prompt(labels.omPlaceholder);
    if (newOM && /^\d{6}$/.test(newOM)) {
  const updatedList = [...omLista, newOM];
  GM_setValue('omLista', updatedList);
  GM_setValue('aktivOm', newOM);
  location.reload();
} else {
  alert(`❌ ${labels.invalidOmAlert}`);
}
  });

  panel.querySelector('#omShareBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => alert(`✅ ${labels.shareSuccess}`))
      .catch(() => alert(`⚠️ ${labels.shareError}\n${shareUrl}`));
  });

  let panelVisible = false;
  panelBtn.addEventListener('click', () => {
    panelVisible = !panelVisible;
    panel.style.right = panelVisible ? '0' : '-260px';
  });
})();
