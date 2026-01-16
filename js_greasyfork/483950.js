// ==UserScript==
// @name            Youtube MP3 download button → ytmp3 (auto-download) - (by SuchtiOnTour)
// @name:de         Youtube MP3 download button → ytmp3 (Auto-Download) - (by SuchtiOnTour)
// @namespace       Violentmonkey Scripts
// @version         1.6.6
// @author          SuchtiOnTour
// @license         MIT
// @match           https://www.youtube.com/watch*
// @match           https://*.youtube.com/*
// @match           https://ytmp3.la/*
// @match           https://ytmp3.as/*
// @match           https://app.ytmp3.as/*
// @grant           GM_addStyle
// @run-at          document-idle
// @description     Adds a Download button next to the Share button and auto-downloads the MP3 via ytmp3.la
// @description:pt-BR Adiciona um botão Download ao lado de Compartilhar e baixa MP3 automaticamente pelo ytmp3.la
// @description:ar  يضيف زر تنزيل بجوار زر المشاركة ويُحمّل ملف MP3 تلقائياً عبر ytmp3.la
// @description:bg  Добавя бутон „Сваляне“ до бутона „Сподели“ и автоматично сваля MP3 чрез ytmp3.la
// @description:cs  Přidá tlačítko Stáhnout vedle tlačítka Sdílet a automaticky stáhne MP3 přes ytmp3.la
// @description:da  Tilføjer en Download-knap ved siden af Del og downloader automatisk MP3 via ytmp3.la
// @description:de  Fügt rechts neben „Teilen“ einen Download-Button ein und lädt die MP3 über ytmp3.la automatisch herunter
// @description:el  Προσθέτει κουμπί Λήψη δίπλα στο κουμπί Κοινοποίηση και κατεβάζει αυτόματα το MP3 μέσω ytmp3.la
// @description:eo  Aldonas elŝutan butonon apud la butono Kunhavigi kaj aŭtomate elŝutas MP3 per ytmp3.la
// @description:es  Añade un botón Descargar junto al botón Compartir y descarga automáticamente el MP3 vía ytmp3.la
// @description:fi  Lisää Lataa-painikkeen Jaa-painikkeen viereen ja lataa MP3-tiedoston automaattisesti ytmp3.la-palvelusta
// @description:fr  Ajoute un bouton Télécharger à côté de Partager et lance automatiquement le téléchargement MP3 via ytmp3.la
// @description:fr-CA Ajoute un bouton Télécharger à côté de Partager et télécharge automatiquement le MP3 via ytmp3.la
// @description:he  מוסיף כפתור הורדה ליד כפתור השיתוף ומוריד אוטומטית את ה-MP3 דרך ytmp3.la
// @description:hu  Letöltés gombot ad a Megosztás gomb mellé, és automatikusan letölti az MP3-at a ytmp3.la-n
// @description:id  Menambahkan tombol Download di samping tombol Bagikan dan otomatis mengunduh MP3 via ytmp3.la
// @description:it  Aggiunge un pulsante Download accanto al pulsante Condividi e scarica automaticamente l’MP3 tramite ytmp3.la
// @description:ja  共有ボタンの横にダウンロードボタンを追加し、ytmp3.laで自動的にMP3をダウンロードします
// @description:ko  공유 버튼 옆에 다운로드 버튼을 추가하고 ytmp3.la를 통해 MP3를 자동으로 다운로드합니다
// @description:nb  Legger til en Last ned-knapp ved siden av Del og laster automatisk ned MP3 via ytmp3.la
// @description:nl  Voegt een Download-knop naast Delen toe en downloadt automatisch de MP3 via ytmp3.la
// @description:pl  Dodaje przycisk Pobierz obok przycisku Udostępnij i automatycznie pobiera MP3 przez ytmp3.la
// @description:ro  Adaugă un buton Download lângă butonul Distribuie și descarcă automat MP3-ul prin ytmp3.la
// @description:ru  Добавляет кнопку «Скачать» рядом с кнопкой «Поделиться» и автоматически скачивает MP3 через ytmp3.la
// @description:sk  Pridá tlačidlo Stiahnuť vedľa tlačidla Zdieľať a automaticky stiahne MP3 cez ytmp3.la
// @description:sr  Додаје дугме Преузми поред дугмета Подели и аутоматски преузима MP3 преко ytmp3.la
// @description:sv  Lägger till en Hämta-knapp bredvid Dela och hämtar automatiskt MP3 via ytmp3.la
// @description:th  เพิ่มปุ่มดาวน์โหลดถัดจากปุ่ม แชร์ และดาวน์โหลด MP3 อัตโนมัติผ่าน ytmp3.la
// @description:tr  Paylaş düğmesinin yanına İndir düğmesi ekler ve MP3’ü ytmp3.la ile otomatik olarak indirir
// @description:uk  Додає кнопку «Завантажити» поруч із кнопкою «Поділитися» та автоматично завантажує MP3 через ytmp3.la
// @description:ug  «ھەمبەھىرلەش» توپچىقىنىڭ يېنىغا چۈشۈرۈش كۇنۇپكىسى قوشۇپ، ytmp3.la ئارقىلىق MP3 نى ئاپتوماتىك چۈشۈرىدۇ
// @description:vi  Thêm nút Tải xuống bên cạnh nút Chia sẻ và tự động tải MP3 qua ytmp3.la
// @description:zh-CN 在“分享”旁添加下载按钮，并通过 ytmp3.la 自动下载 MP3
// @description:zh-TW 在「分享」旁新增下載按鈕，並透過 ytmp3.la 自動下載 MP3
// @downloadURL https://update.greasyfork.org/scripts/483950/Youtube%20MP3%20download%20button%20%E2%86%92%20ytmp3%20%28auto-download%29%20-%20%28by%20SuchtiOnTour%29.user.js
// @updateURL https://update.greasyfork.org/scripts/483950/Youtube%20MP3%20download%20button%20%E2%86%92%20ytmp3%20%28auto-download%29%20-%20%28by%20SuchtiOnTour%29.meta.js
// ==/UserScript==



(() => {
/* ---------- YouTube: einfacher <a>-Button RECHTS von „Teilen“ ---------- */
if (location.host.includes('youtube.com')) {
  const API    = location.host.startsWith('ytmp3.') ? `https://${location.host}/#` : 'https://ytmp3.as/#';
  const BTN_ID = 'dwnldBtn';

  // Styling: gleiche Pill-Optik, mit Abstand zu Share & YouTube-Download
  try {
    GM_addStyle(`
      #${BTN_ID}{
        background:#0F0F0F;color:#FFF;border:1px solid rgba(255,255,255,.25);
        margin-left:8px; margin-right:8px; /* Abstand links & rechts */
        padding:0 16px;border-radius:18px;
        font:500 14px/normal Roboto,Noto,sans-serif;display:inline-flex;align-items:center;
        height:36px;text-decoration:none;white-space:nowrap;flex:0 0 auto;
        position:relative; z-index:1; pointer-events:auto; cursor:pointer;
      }
      #${BTN_ID}:hover{background:#3F3F3F;border-color:#3F3F3F}
    `);
  } catch {}

  const getVid  = () =>
    ((/v=([\w-]{11})|shorts\/([\w-]{11})/i.exec(location.href)||[]).slice(1).find(Boolean)) || '';
  const makeUrl = () => API + getVid() + '/mp3';

  // Aktionsleiste finden (YT testet mehrere Varianten)
  const findActions = () => {
    const sels = [
      'ytd-watch-metadata #actions-inner #top-level-buttons-computed',
      'ytd-watch-metadata #top-level-buttons-computed',
      'ytd-watch-metadata #actions-inner #actions',
      'ytd-watch-metadata #actions',
      '#actions-inner #top-level-buttons-computed',
      '#actions-inner #actions',
      '#top-level-buttons-computed',
      '#actions'
    ];
    for (const s of sels) {
      const el = document.querySelector(s);
      if (el) return el;
    }
    return null;
  };

  // „Teilen“ finden (Text, aria-label oder Share-Icon)
  const findShare = (actions) => {
    if (!actions) return null;
    const nodes = [...actions.querySelectorAll('ytd-button-renderer,button,a,yt-button-shape')];
    return nodes.find(n => {
      const t = (n.textContent || '').toLowerCase();
      const aria = (n.getAttribute?.('aria-label') || '').toLowerCase();
      const hasIcon = n.querySelector?.('yt-icon[icon="share"]');
      return /teilen|share/.test(t) || /teilen|share/.test(aria) || hasIcon;
    }) || null;
  };

  function placeOnce(){
    if (!location.pathname.startsWith('/watch')) return false;

    const actions = findActions();
    if (!actions) return false;

    const share = findShare(actions);
    if (!share) return false;

    // Duplikate wegräumen (nur 1 Button)
    const dups = [...document.querySelectorAll(`#${BTN_ID}`)];
    if (dups.length > 1) dups.slice(1).forEach(n=>n.remove());

    // Button holen/erstellen
    let a = document.getElementById(BTN_ID);
    if (!a) {
      a = document.createElement('a');
      a.id = BTN_ID;
      a.textContent = 'Download';
      a.target = '_blank';
      a.rel = 'noopener';
      // Fallback, falls irgend ein Overlay Klicks frisst
      a.addEventListener('click', (e)=>{
        const href = a.getAttribute('href');
        if (!href) { e.preventDefault(); window.open(makeUrl(), '_blank', 'noopener'); }
      }, true);
    }
    a.href = makeUrl();

    // Rechts von „Teilen“ einsetzen
    if (share.nextElementSibling !== a) {
      share.insertAdjacentElement('afterend', a);
    }
    return true;
  }

  // leichte Retry-Logik (max. ~5s), keinerlei schwere Observer
  function init(){
    let tries = 0;
    const tick = () => {
      const ok = placeOnce();
      tries++;
      if (!ok && tries < 20) setTimeout(tick, 250);
    };
    tick();
  }

  // initial + bei Navigation in der YouTube-SPA
  init();
  window.addEventListener('yt-navigate-finish', init);
  window.addEventListener('yt-page-data-updated', init);
}

/* ---------- ytmp3.*: Auto-Download auslösen (FIXED) ---------- */
if (location.host.includes('ytmp3.')) {

    let clicked = false;

    // Funktion sucht gezielt nach dem Button
    const attemptClick = () => {
        if(clicked) return;

        // Sucht alle Buttons, die in einem <form> stecken
        const buttons = document.querySelectorAll('form button');

        for (let btn of buttons) {
            // Prüfen ob wirklich "Download" draufsteht
            if ((btn.textContent || '').trim() === 'Download') {
                console.log('[Auto-Click] Download-Button gefunden. Klicke...');
                btn.click();
                clicked = true; // Damit er nicht spammt
            }
        }
    };

    // Prüft jede Sekunde, ob der Button erschienen ist
    const interval = setInterval(() => {
        if (clicked) {
            clearInterval(interval); // Stoppen, wenn geklickt wurde
        } else {
            attemptClick();
        }
    }, 1000);
}
})();