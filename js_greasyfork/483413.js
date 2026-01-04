// ==UserScript==
// @name         LeadPerfection Enhancer
// @namespace    http://tampermonkey.net/
// @version      4.9
// @author       Nathan Resinger
// @description  Dispo sort on Issue pages; inline “Copy” next to each phone; “Copy Text Msg” below; pulls your LP first name; full-width container; robust polling on SPA nav.
// @license      MIT
// @match        https://v9r7a.leadperfection.com/Issue*
// @match        https://v9r7a.leadperfection.com/leaddetail*
// @match        https://v9r7a.leadperfection.com/LeadDetail.html*
// @grant        none
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/483413/LeadPerfection%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/483413/LeadPerfection%20Enhancer.meta.js
// ==/UserScript==

;(function(){
  'use strict';

  const POLL_INTERVAL = 500;   // ms
  const POLL_TIMEOUT  = 10000; // ms

  // — SPA navigation watcher —
  function watchNavigation(fn) {
    window.addEventListener('popstate', fn);
    ['pushState','replaceState'].forEach(method => {
      const orig = history[method];
      history[method] = function(){
        const ret = orig.apply(this, arguments);
        window.dispatchEvent(new Event('popstate'));
        return ret;
      };
    });
  }

  // — Fetch LP user’s first name once from email-template AJAX —
  let firstNamePromise = null;
  function getMyFirstName() {
    if (firstNamePromise) return firstNamePromise;
    firstNamePromise = (async () => {
      const url =
        'https://v9r7a.leadperfection.com/djson.aspx?' +
        '[{%22ajax%22:%22GetMessageToMail%22,%22options%22:%220%22,' +
        '%22term%22:%22get%22,%22format%22:%22jsondata%22,' +
        '%22data%22:[%7B%22recid%22%3A%2224679%22%2C%22mode%22%3A%22L%22%2C%22msgid%22%3A%221%22%7D]}]';
      try {
        const resp = await fetch(url, { credentials: 'same-origin' });
        const html = await resp.text();
        const m = html.match(/Regards,<br\s*\/><br\s*\/>\s*([^<]+)\s*<br\s*\/>/i);
        const full = m ? m[1].trim() : 'Nathan Resinger';
        return full.split(' ')[0];
      } catch {
        return 'Nathan';
      }
    })();
    return firstNamePromise;
  }

  // — Auto-select “Dispo” on Issue pages —
  function setDispoOption(){
    const sel = document.getElementById('SortBy');
    if (!sel) return;
    sel.value = 'dsp_id';
    sel.dispatchEvent(new Event('change',{ bubbles:true }));
  }

  // — Inject copy buttons on LeadDetail —
  function tryAddCopyButtons(){
    const phoneContainer = document.getElementById('rocontainerphone');
    const phoneSpan      = document.getElementById('phonesectionro');
    if (!phoneContainer || !phoneSpan) return false;

    // full width
    phoneContainer.style.width = '100%';
    if (phoneSpan.dataset.enhanced) return true;
    phoneSpan.dataset.enhanced = '1';

    // inline “Copy” next to each number
    phoneSpan.querySelectorAll('a.adialer').forEach(link => {
      const txt = link.nextSibling;
      if (!txt) return;
      const m = txt.textContent.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
      if (!m) return;
      const num = m[0];
      const btn = document.createElement('button');
      btn.textContent = 'Copy';
      Object.assign(btn.style, {
        marginLeft: '4px',
        padding:    '1px 4px',
        fontSize:   '11px',
        cursor:     'pointer',
        border:     '1px solid #666',
        background: '#fff',
        transform:  'scale(0.8)',
        transformOrigin: 'left center'
      });
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(num).then(() => {
          const o = btn.textContent;
          btn.textContent = '✓';
          setTimeout(()=> btn.textContent = o, 800);
        });
      });
      txt.parentNode.insertBefore(document.createTextNode(' '), txt.nextSibling);
      txt.parentNode.insertBefore(btn, txt.nextSibling);
    });

    // single “Copy Text Msg” below
    const msgBtn = document.createElement('button');
    msgBtn.textContent = 'Copy Text Msg';
    Object.assign(msgBtn.style, {
      display:    'block',
      marginTop:  '4px',
      padding:    '2px 6px',
      fontSize:   '12px',
      cursor:     'pointer',
      border:     '1px solid #000',
      background: '#fff',
      transform:  'scale(0.8)',
      transformOrigin: 'left center'
    });
    msgBtn.addEventListener('click', async () => {
      await copyTextMsg();
      const o = msgBtn.textContent;
      msgBtn.textContent = 'Copied!';
      setTimeout(()=> msgBtn.textContent = o, 1200);
    });

    const wrapper = document.createElement('div');
    wrapper.style.marginTop = '8px';
    wrapper.appendChild(msgBtn);
    phoneSpan.appendChild(wrapper);

    return true;
  }

  // — Build & copy the text message —
  async function copyTextMsg(){
    const nameSpan  = document.getElementById('namesectionro');
    const dateCells = Array.from(document.querySelectorAll('#LeadsBody > tr > td:nth-child(7)'));
    if (!nameSpan || !dateCells.length) return;

    // prospect first name
    const raw   = nameSpan.textContent.trim().replace(/\s+/g,' ');
    const first = raw.split(' ')[0] || '';
    const prospect = first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
    // your first name
    const myName   = await getMyFirstName();

    // pick latest date
    const dates = dateCells.map(td => {
      const m = td.textContent.trim().match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})(AM|PM)/);
      if (!m) return null;
      let [ , mm, dd, yyyy, h, mi, ap ] = m;
      let hh = parseInt(h,10);
      if (ap==='PM' && hh!==12) hh+=12;
      if (ap==='AM' && hh===12) hh=0;
      return new Date(`${yyyy}-${mm}-${dd}T${String(hh).padStart(2,'0')}:${mi}`);
    }).filter(Boolean);
    if (!dates.length) return;
    const latest = dates.reduce((a,b) => a>b? a : b);

    // format "Monday, August 4th, at 9am"
    const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const dow    = days[latest.getDay()];
    const mo     = months[latest.getMonth()];
    const d      = latest.getDate();
    const suf    = (d>3&&d<21)?'th':({1:'st',2:'nd',3:'rd'}[d%10]||'th');
    let hr       = latest.getHours(), mn = latest.getMinutes();
    const time   = `${(hr%12)||12}${mn? ':'+String(mn).padStart(2,'0'):''}${hr<12?'am':'pm'}`;
    const when   = `${dow}, ${mo} ${d}${suf}, at ${time}`;

    const msg =
      `Hi ${prospect}, this is ${myName} with Pella Windows & Doors. `+
      `Thank you for scheduling your no cost, no obligation consultation with us! `+
      `Your appointment is for ${when} — as a reminder the visit takes about 60–90 minutes. `+
      `Please reply YES to confirm.`;

    await navigator.clipboard.writeText(msg);
  }

  // — run on load & SPA nav —
  function runEnhancer(){
    const p = location.pathname.toLowerCase();

    // Make Issue page behavior match your original working script:
    // 1) run immediately  2) run again after 500ms
    if (p.startsWith('/issue')) {
      setDispoOption();
      setTimeout(setDispoOption, 500);
    }

    if (p.includes('leaddetail')) {
      const start = Date.now();
      const poll = setInterval(()=>{
        if (tryAddCopyButtons() || Date.now() - start > POLL_TIMEOUT) {
          clearInterval(poll);
        }
      }, POLL_INTERVAL);
    }
  }

  // initial
  runEnhancer();
  watchNavigation(runEnhancer);

})();
