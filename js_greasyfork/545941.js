// ==UserScript==
// @name         Bitcointalk Mobile Enhancer v1.4.6 (Merit Highlighter)
// @namespace    Violentmonkey Scripts
// @version      1.4.6
// @description  Tema moderno AMOLED, quote leggibili, pulsanti, sMerit via AJAX, toggle dark/light, barra progresso + nome rank, popup per invio merit con stile personalizzato + evidenziazione merit utente loggato
// @match        https://bitcointalk.org/*
// @grant        none
// @author       *ace*
// @license      MIT
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/545941/Bitcointalk%20Mobile%20Enhancer%20v146%20%28Merit%20Highlighter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545941/Bitcointalk%20Mobile%20Enhancer%20v146%20%28Merit%20Highlighter%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let sMerit = null;

  // 🔹 Tabella rank (ufficiali + custom)
  const rankTable = [
    { name: "Brand New", merit: 0, activity: 0 },
    { name: "Newbie", merit: 0, activity: 1 },
    { name: "Jr. Member", merit: 1, activity: 30 },
    { name: "Member", merit: 10, activity: 60 },
    { name: "Full Member", merit: 100, activity: 120 },
    { name: "Sr. Member", merit: 250, activity: 240 },
    { name: "Hero Member", merit: 500, activity: 480 },
    { name: "Legendary", merit: 1000, activity: 775 },
    { name: "🌀 Mythical", merit: 1500, activity: 1200 },
    { name: "🔺 Ascendant", merit: 2500, activity: 2000 },
    { name: "🌌 Celestial", merit: 5000, activity: 3000 },
    { name: "♾️ Immortal", merit: 10000, activity: 4000 }
  ];

  // Recupera il token CSRF
  function getCsrfToken() {
    const logoutLink = document.querySelector('td.maintab_back a[href*="index.php?action=logout;sesc="]');
    if (!logoutLink) return null;
    const match = /;sesc=(.*)/.exec(logoutLink.href);
    return match ? match[1] : null;
  }

  // Invia merit via POST
  function sendMerit(msgId, merits, sc) {
    const formData = new FormData();
    formData.append('merits', merits);
    formData.append('msgID', msgId);
    formData.append('sc', sc);

    fetch('https://bitcointalk.org/index.php?action=merit', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
    .then(response => response.text())
    .then(data => {
      if (data.includes('<title>An Error Has Occurred!</title>')) {
        alert('Errore nell\'invio del merit.');
      } else if (data.includes(`#msg${msgId}`)) {
        alert('Merit inviato con successo!');
        fetchSmerit();
      } else {
        alert('Risposta del server indeterminata.');
      }
    })
    .catch(() => alert('Errore di rete.'));
  }

// Crea il popup per l'invio dei merit
function openMeritPopup(msgId, sc) {
  let popup = document.getElementById(`merit-popup-${msgId}`);
  if (popup) {
    popup.remove();
  }

  popup = document.createElement('div');
  popup.id = `merit-popup-${msgId}`;
  popup.className = 'merit-popup';
  popup.style.position = 'absolute';
  popup.style.right = '40px';
  popup.style.zIndex = '10000';
  popup.style.display = 'none'; // Nascondi il popup di default

  popup.innerHTML = `
    <form>
      <div style="margin-bottom: 8px;">
        Merit points: <input size="4" name="merits" value="1" type="text" style="text-align: center;" />
      </div>
      <div style="text-align: right;">
        <input value="Invia" type="submit" style="margin-left: 8px;" />
      </div>
    </form>
  `;

  popup.querySelector('form').onsubmit = (e) => {
    e.preventDefault();
    const merits = e.target.elements['merits'].value;
    const submitBtn = e.target.querySelector('input[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.value = 'Invio...';

    sendMerit(msgId, merits, sc, popup); // Passa il popup a sendMerit
  };

  return popup;
}

// Invia merit via POST
function sendMerit(msgId, merits, sc, popup) {
  const formData = new FormData();
  formData.append('merits', merits);
  formData.append('msgID', msgId);
  formData.append('sc', sc);

  fetch('https://bitcointalk.org/index.php?action=merit', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  .then(response => response.text())
  .then(data => {
    if (data.includes('<title>An Error Has Occurred!</title>')) {
      alert('Errore nell\'invio del merit.');
    } else if (data.includes(`#msg${msgId}`)) {
      alert('Merit inviato con successo!');
      fetchSmerit();
      popup.style.display = 'none'; // Chiudi il popup dopo l'invio
    } else {
      alert('Risposta del server indeterminata.');
    }
  })
  .catch(() => alert('Errore di rete.'))
  .finally(() => {
    // Reimposta il pulsante in ogni caso
    const submitBtn = popup.querySelector('input[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.value = 'Invia';
    }
  });
}

// Aggiungi i popup ai link "+Merit"
function addMeritPopups() {
  const sc = getCsrfToken();
  if (!sc) return;

  document.querySelectorAll('a[href*="index.php?action=merit;msg="]').forEach(link => {
    const msgId = /msg=([0-9]+)/.exec(link.href)[1];
    const popup = openMeritPopup(msgId, sc);
    link.parentNode.insertBefore(popup, link.nextSibling);

    link.onclick = (e) => {
      e.preventDefault();
      // Toggle del popup (apri/chiudi al click)
      popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
    };
  });
}


  // Carica sMerit via AJAX
  function fetchSmerit() {
    const meritPage = 'https://bitcointalk.org/index.php?action=merit';
    fetch(meritPage, { credentials: 'include', redirect: 'manual' })
      .then(res => {
        if (res.type === 'opaqueredirect' || res.status === 0 || res.status === 302) {
          sMerit = '?';
          updateSmeritIndicator();
          return null;
        }
        return res.text();
      })
      .then(html => {
        if (!html) return;
        const match = html.match(/You\s+have\s+(?:<b>)?(\d+)(?:<\/b>)?\s+sendable/i);
        sMerit = match ? match[1] : '?';
        updateSmeritIndicator();
      })
      .catch(() => {
        sMerit = 'x';
        updateSmeritIndicator();
      });
  }

  // Indicatore sMerit
  function updateSmeritIndicator() {
    let indicator = document.getElementById('smerit-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'smerit-indicator';
      document.body.appendChild(indicator);
    }
    indicator.textContent = `🪙 ${sMerit ?? '...'}`;
  }

  // Quote espandibili
  function fixQuotes() {
    document.querySelectorAll('.quote').forEach(quote => {
      if (quote.classList.contains('enhanced')) return;
      quote.classList.add('enhanced');

      if (quote.scrollHeight > 140) {
        const button = document.createElement('div');
        button.className = 'show-more';
        button.textContent = 'Mostra tutto';
        button.onclick = () => {
          quote.classList.add('expanded');
          button.remove();
        };
        quote.appendChild(button);
      }
    });
  }

  // Pulsanti mobile
  function addButtons() {
    document.querySelectorAll('td[class^="windowbg"] > div:nth-child(2)').forEach(post => {
      if (post.closest('.windowbg:first-child')) return;
      if (post.querySelector('.mobile-buttons')) return;

      const links = post.querySelectorAll('a');
      let quote, report, merit;

      links.forEach(a => {
        const href = a.getAttribute('href') || '';
        if (href.includes('quote')) quote = a;
        if (href.includes('report')) report = a;
        if (href.includes('merit')) merit = a;
      });

      const box = document.createElement('div');
      box.className = 'mobile-buttons';

      if (quote) {
        const q = quote.cloneNode(true);
        q.textContent = 'Quote';
        box.appendChild(q);
      }
      if (report) {
        const r = report.cloneNode(true);
        r.textContent = 'Report';
        box.appendChild(r);
      }

      post.appendChild(box);
    });
  }

  // Barra progresso + nome rank sotto avatar
  function addRankBarsInThreads() {
    document.querySelectorAll('td.poster_info').forEach(avatarCell => {
      if (avatarCell.querySelector('.rank-container')) return;

      const text = avatarCell.textContent;
      const meritMatch = text.match(/Merit:\s*(\d+)/i);
      const activityMatch = text.match(/Activity:\s*(\d+)/i);
      if (!meritMatch || !activityMatch) return;

      const merit = parseInt(meritMatch[1], 10);
      const activity = parseInt(activityMatch[1], 10);

      let currentRankIndex = 0;
      for (let i = 0; i < rankTable.length; i++) {
        if (merit >= rankTable[i].merit && activity >= rankTable[i].activity) {
          currentRankIndex = i;
        }
      }

      const currentRank = rankTable[currentRankIndex];
      const nextRank = rankTable[Math.min(currentRankIndex + 1, rankTable.length - 1)];

      let totalProgress;
      if (currentRankIndex === rankTable.length - 1) {
        totalProgress = 100;
      } else {
        const meritProgress = Math.min(
          (merit - currentRank.merit) / (nextRank.merit - currentRank.merit || 1),
          1
        );
        const activityProgress = Math.min(
          (activity - currentRank.activity) / (nextRank.activity - currentRank.activity || 1),
          1
        );
        totalProgress = Math.min(meritProgress, activityProgress) * 100;
      }

      const container = document.createElement('div');
      container.className = 'rank-container';

      const rankName = document.createElement('div');
      rankName.className = 'rank-name';
      rankName.textContent = currentRank.name;
      container.appendChild(rankName);

      const bar = document.createElement('div');
      bar.className = 'rank-progress-bar';
      const fill = document.createElement('div');
      fill.className = 'rank-progress-fill';
      fill.style.width = totalProgress + '%';
      bar.appendChild(fill);
      container.appendChild(bar);

      avatarCell.appendChild(container);
    });
  }

  function removeOfficialRank() {
    document.querySelectorAll('td.poster_info div.smalltext').forEach(div => {
      const rankTexts = [
        "Brand New", "Newbie", "Jr. Member", "Member",
        "Full Member", "Sr. Member", "Hero Member", "Legendary"
      ];
      let lines = div.innerHTML.split('<br>');
      lines = lines.filter(line => {
        return !rankTexts.some(rank => line.includes(rank));
      });
      div.innerHTML = lines.join('<br>');
    });
  }

  // 🔹 Funzione per trovare il nome utente loggato
  function getLoggedInUsername() {
    // Cerca il nome utente nel saluto "Hello *Ace*"
    const helloElement = document.querySelector('#hellomember b');
    if (!helloElement) {
      console.error("Utente loggato non trovato.");
      return null;
    }
    const userName = helloElement.textContent.replace(/\*/g, '').trim();
    console.log("Utente loggato trovato:", userName);
    return userName;
  }

// 🔹 Funzione per evidenziare i merit dell'utente loggato
function highlightUserMerits() {
  const loggedInUser = getLoggedInUsername();
  if (!loggedInUser) {
    console.error("Utente loggato non trovato.");
    return;
  }

  console.log("Evidenzio i merit per l'utente:", loggedInUser);

  // Trova tutti gli elementi "Merited by"
  const meritElements = document.querySelectorAll('div.smalltext i');
  meritElements.forEach(el => {
    if (el.textContent.includes('Merited by')) {
      const meritLinks = el.querySelectorAll('a');
      let totalMerits = 0;

      // Elabora ogni link (utente e numero di merit)
      meritLinks.forEach(link => {
        const meritText = link.nextSibling?.textContent.trim();
        if (!meritText) return;

        const meritCountMatch = meritText.match(/\((\d+)\)/);
        const meritCount = meritCountMatch ? parseInt(meritCountMatch[1], 10) : 0;
        totalMerits += meritCount;

        // Evidenzia SOLO i link dell'utente loggato in BLU GRASSETTO
        const linkUserName = link.textContent.replace(/\*/g, '').trim();
        if (linkUserName === loggedInUser) {
          link.style.fontWeight = 'bold';
          link.style.color = '#3b82f6'; // Blu come la barra di progresso del rank
          console.log(`Merit di ${loggedInUser} evidenziato:`, link);
        }
      });

      // Aggiungi il totale dei merit (in nero e grassetto, prima di "Merited by")
      if (!el.querySelector('.total-merit')) {
        const totalElement = document.createElement('span');
        totalElement.className = 'total-merit';
        totalElement.style.fontWeight = 'bold';
        totalElement.style.color = 'black'; // Nero
        totalElement.textContent = `Total Merit: ${totalMerits} `;

        // Crea un nuovo span per contenere il totale + il testo originale
        const newContent = document.createElement('span');
        newContent.innerHTML = totalElement.outerHTML + el.innerHTML;
        el.innerHTML = newContent.innerHTML;
      }
    }
  });
}


  // 🔹 Temi
  const lightTheme = `
    body {
      font-family: "Segoe UI", sans-serif !important;
      font-size: 16px;
      background: #f9fafb !important;
      color: #222;
    }
    table, .windowbg, .windowbg2 {
      background: #fff !important;
      border-radius: 10px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border: 1px solid #e5e7eb !important;
    }
    td.poster_info {
      width: 70px !important;
      max-width: 70px !important;
      background: #fff !important;
      text-align: center;
      padding: 4px !important;
    }
    td.poster_info img {
      max-width: 48px !important;
      height: auto;
      border-radius: 6px;
    }
    .quote {
      background: #e0f2fe;
      border-left: 4px solid #3b82f6;
    }
    .mobile-buttons a {
      background: #3b82f6;
      color: white !important;
    }
    .mobile-buttons a:hover {
      background: #1d4ed8;
    }
    #smerit-indicator {
      background: #10b981;
      color: white;
    }
    .rank-progress-bar {
      background: #ddd;
    }
    .rank-progress-fill {
      background: #3b82f6;
      height: 6px;
      border-radius: 3px;
    }
    .merit-popup {
      background: #f0f0f0 !important;
      color: #333 !important;
      border: 1px solid #ccc !important;
      border-radius: 6px !important;
      padding: 10px !important;
      font-size: 14px !important;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important;
    }
    .merit-popup input[type="text"] {
      background: #fff !important;
      color: #333 !important;
      border: 1px solid #ccc !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
    }
    .merit-popup input[type="submit"] {
      background: #3b82f6 !important;
      color: white !important;
      border: none !important;
      padding: 6px 12px !important;
      border-radius: 4px !important;
      cursor: pointer !important;
    }
    .merit-popup input[type="submit"]:hover {
      background: #1d4ed8 !important;
    }
  `;

  const darkTheme = `
    body, td, tr, th {
      font-family: "Segoe UI", sans-serif !important;
      font-size: 16px;
      background: #000000 !important;
      color: #e5e7eb !important;
    }
    table, .windowbg, .windowbg2, td.td_headerandpost, table.bordercolor {
      background: #0a0a0a !important;
      color: #f1f1f1 !important;
      border-radius: 10px;
      box-shadow: 0 0 8px rgba(0,0,0,0.8);
      border: 1px solid #222 !important;
    }
    td.titlebg, td.catbg {
      background: #111 !important;
      color: #00d4ff !important;
      font-weight: bold;
    }
    td.titlebg a, td.catbg a {
      color: #00d4ff !important;
      font-weight: bold;
      text-decoration: none !important;
    }
    td.poster_info {
      width: 70px !important;
      max-width: 70px !important;
      background: #0a0a0a !important;
      text-align: center;
      padding: 4px !important;
      color: #f1f1f1 !important;
    }
    td.poster_info small {
      color: #a0a0a0 !important;
      font-size: 11px;
    }
    td.poster_info img {
      max-width: 48px !important;
      border-radius: 6px;
      box-shadow: 0 0 6px rgba(0,0,0,0.8);
    }
    .quote {
      background: #111111 !important;
      border-left: 4px solid #00d4ff !important;
      color: #f8f8f8 !important;
    }
    .quote cite, .quote .quoteheader {
      color: #00d4ff !important;
      font-weight: bold;
    }
    .quote .quote {
      background: #1a1a1a !important;
      border-left: 3px solid #0077ff !important;
    }
    .mobile-buttons a {
      background: linear-gradient(135deg, #00d4ff, #0077ff);
      color: white !important;
      box-shadow: 0 0 6px rgba(0, 122, 255, 0.6);
    }
    .mobile-buttons a:hover {
      background: linear-gradient(135deg, #00aaff, #0055cc);
    }
    #smerit-indicator {
      background: linear-gradient(135deg, #10b981, #065f46);
      color: white !important;
      box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
    }
    .rank-progress-bar {
      background: #1f1f1f;
    }
    .rank-progress-fill {
      background: linear-gradient(90deg, #00d4ff, #0077ff);
      height: 6px;
      border-radius: 3px;
    }
    a.board, a:link, a:visited {
      color: #00d4ff !important;
      font-weight: bold;
      text-decoration: none !important;
    }
    a:hover {
      color: #ffffff !important;
      text-decoration: underline !important;
    }
    .smerit_received, .smerit_given, .activity {
      color: #00d4ff !important;
      font-weight: bold;
      background: #111111 !important;
      padding: 2px 4px;
      border-radius: 4px;
      display: inline-block;
    }
    .smerit_received a, .smerit_given a, .activity a {
      color: #00d4ff !important;
      text-decoration: none !important;
    }
    .smerit_received:hover, .smerit_given:hover, .activity:hover {
      color: #ffffff !important;
      background: #0077ff !important;
    }
    .smalltext, .smalltext a {
      color: #c0c0c0 !important;
    }
    .smalltext a:hover {
      color: #00d4ff !important;
    }
    input, select, textarea {
      background: #111 !important;
      color: #f1f1f1 !important;
      border: 1px solid #333 !important;
      border-radius: 6px !important;
      padding: 4px 6px !important;
    }
    input[type="submit"], input[type="button"], button {
      background: linear-gradient(135deg, #00d4ff, #0077ff) !important;
      color: #fff !important;
      border: none !important;
      padding: 6px 12px !important;
      border-radius: 6px !important;
      cursor: pointer !important;
    }
    input[type="submit"]:hover, input[type="button"]:hover, button:hover {
      background: linear-gradient(135deg, #00aaff, #0055cc) !important;
    }
    tr td:nth-child(1) .trust img {
      filter: brightness(2) contrast(2) !important;
    }
    .merit-popup {
      background: #1e1e1e !important;
      color: #e0e0e0 !important;
      border: 1px solid #444 !important;
      border-radius: 6px !important;
      padding: 10px !important;
      font-size: 14px !important;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3) !important;
    }
    .merit-popup input[type="text"] {
      background: #2d2d2d !important;
      color: #e0e0e0 !important;
      border: 1px solid #444 !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
    }
    .merit-popup input[type="submit"] {
      background: linear-gradient(135deg, #00d4ff, #0077ff) !important;
      color: white !important;
      border: none !important;
      padding: 6px 12px !important;
      border-radius: 4px !important;
      cursor: pointer !important;
    }
    .merit-popup input[type="submit"]:hover {
      background: linear-gradient(135deg, #00aaff, #0055cc) !important;
    }
  `;

  const commonStyles = `
    .quote { max-height: 120px; overflow: hidden; padding: 8px; border-radius: 6px; position: relative; margin: 6px 0; }
    .quote.expanded { max-height: none !important; }
    .quote .show-more { position: absolute; bottom: 4px; right: 6px; font-size: 12px; background: rgba(0,0,0,0.3); color: #fff; padding: 2px 6px; border-radius: 4px; cursor: pointer; }
    .mobile-buttons { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; font-size: 14px; }
    .mobile-buttons a { padding: 6px 10px; border-radius: 20px; text-decoration: none; transition: background 0.2s; }
    #smerit-indicator { position: fixed; top: 14px; left: 14px; background: #6b7280; color: white; padding: 6px 10px; font-size: 13px; border-radius: 10px; z-index: 9999; font-weight: bold; }
    #theme-toggle { position: fixed; top: 14px; right: 14px; background: #6b7280; color: white; padding: 6px 10px; font-size: 13px; border-radius: 10px; z-index: 9999; cursor: pointer; }
    .rank-container { margin-top: 6px; text-align: center; font-size: 12px; font-weight: bold; }
    .rank-name { margin-bottom: 2px; }
    .rank-progress-bar { width: 100%; margin: 0 auto; height: 6px; border-radius: 3px; }
    .rank-progress-fill { height: 6px; border-radius: 3px; }
  `;

  const style = document.createElement("style");
  document.head.appendChild(style);

  function applyTheme(theme) {
    const css = (theme === 'dark' ? darkTheme : lightTheme) + commonStyles;
    style.textContent = css;
    localStorage.setItem('bitcointalk-theme', theme);
  }

  // Toggle tema
  const toggle = document.createElement("div");
  toggle.id = "theme-toggle";
  toggle.textContent = "🔆🌘";
  toggle.onclick = () => {
    const current = localStorage.getItem('bitcointalk-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(current);
  };
  document.body.appendChild(toggle);

  // Avvio
  applyTheme(localStorage.getItem('bitcointalk-theme') || 'light');
  updateSmeritIndicator();
  addMeritPopups();
  addButtons();
  fixQuotes();
  addRankBarsInThreads();
  removeOfficialRank();
  if (document.querySelector('a[href*="action=profile"]')) fetchSmerit();

  // Aggiungi evidenziazione merit dopo un breve delay per assicurarsi che la pagina sia caricata
  setTimeout(highlightUserMerits, 2000);
})();

