// ==UserScript==
// @name         Mladeleta.sk Copy Tool with Order Autofill (Draggable Visual Border)
// @namespace    dev.chib.copybox
// @version      2.93
// @description  Draggable/hoverable border (visible), native resize, no header, content is fully interactive, number sequence generator
// @author       chib
// @license      MIT
// @match        https://admin.mladeleta.sk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537747/Mladeletask%20Copy%20Tool%20with%20Order%20Autofill%20%28Draggable%20Visual%20Border%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537747/Mladeletask%20Copy%20Tool%20with%20Order%20Autofill%20%28Draggable%20Visual%20Border%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---- STYLE PATCH FOR VISUAL BORDER HOVER ----
    const style = document.createElement('style');
    style.textContent = `
#copybox-draggable {
    box-shadow: 2px 2px 8px rgba(0,0,0,0.8);
    border: 12px solid #222;
    border-radius: 13px;
    transition: box-shadow 0.18s, border 0.18s, border-color 0.18s;
    position: fixed;
    background: #1e1e1e;
    z-index: 9999;
    padding: 0;
}
#copybox-draggable.drag-hover {
    border-color: #3661a6 !important;
    box-shadow: 0 0 0 2.5px #3661a6, 4px 4px 24px #000;
    cursor: move !important;
}
#copybox-content {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    background: #1e1e1e;
    border-radius: 6px;
    padding: 0;
    margin: 0;
    min-height: 100%;
}
#sticky-text {
    flex: 1 1 auto;
    min-height: 40px;
    resize: none;
    background: #2b2b2b;
    color: #ddd;
    border: 1px solid #555;
    margin-bottom: 0;
    box-sizing: border-box;
    border-radius: 4px;
    font-family: inherit;
    font-size: inherit;
}
#copybox-minimize {
    position: absolute;
    top: 2.5px;
    right: 4px;
    z-index: 20;
    background: none;
    border: none;
    color: #aaa;
    font-size: 18px;
    cursor: pointer;
    padding: 0 4px 0 8px;
    line-height: 1;
    transition: color 0.13s, background 0.13s;
}
#copybox-minimize:hover {
    color: #ffec7f !important;
    background: #203152 !important;
    border-radius: 3px;
}
    `;
    document.head.appendChild(style);

    const savedTop = localStorage.getItem('copybox-top') || '100px';
    const savedLeft = localStorage.getItem('copybox-left') || '100px';
    const box = document.createElement('div');
    box.id = "copybox-draggable";
    box.style.top = savedTop;
    box.style.left = savedLeft;
    box.style.width = localStorage.getItem('copybox-width') ?? '220px';
    box.style.height = localStorage.getItem('copybox-height') ?? '320px';
    box.style.minHeight = '140px';
    box.style.padding = '0';
    box.style.color = '#ddd';
    box.style.resize = 'both';
    box.style.overflow = 'auto';
    box.style.boxSizing = 'border-box';
    box.style.display = 'flex';
    box.style.flexDirection = 'column';
    box.style.fontFamily = 'sans-serif';
    box.style.fontSize = '14px';
    box.style.transition = 'width 0.13s, height 0.13s, box-shadow 0.18s, border 0.18s, border-color 0.18s';

    // Content
    const content = document.createElement('div');
    content.id = "copybox-content";
    content.innerHTML = `
        <div id="copybox-autofill" style="margin-top:10px;"></div>
        <hr style="margin:8px 0;">
        <div style="font-weight:bold; margin-bottom:5px;"></div>
        <textarea id="sticky-text" placeholder=""></textarea>
    `;
    box.appendChild(content);

// --- PERCENT CALCULATOR (pod notes) ---
const percentCalcHTML = `
  <div id="percent-calc" style="margin-top:10px;border-top:1px dashed #444;padding-top:8px;display:flex;flex-direction:column;gap:6px;">
    <div style="display:flex;gap:6px;align-items:center;">
      <input id="pc-base" type="number" step="any" placeholder="Čiastka"
             style="width:110px;padding:6px;border:1px solid #555;border-radius:3px;background:#232323;color:#eee;">
      <input id="pc-percent" type="number" step="any" placeholder="%"
             style="width:80px;padding:6px;border:1px solid #555;border-radius:3px;background:#232323;color:#eee;">
      <select id="pc-mode" style="padding:6px;border:1px solid #555;border-radius:3px;background:#232323;color:#eee;">
        <option value="value">Iba %</option>
        <option value="add">Pripočítať %</option>
        <option value="sub" selected>Odpočítať %</option>
        <option value="percentOfBase">Koľko % je hodnota z čiastky</option>
      </select>
      <button id="pc-calc" style="padding:6px 10px;background:#333;color:#ddd;border:1px solid #555;border-radius:3px;">=</button>
      <button id="pc-copy" title="Kopírovať výsledok"
              style="padding:6px 10px;background:#333;color:#ddd;border:1px solid #555;border-radius:3px;margin-left:6px;">📋</button>
    </div>
    <input id="pc-result" readonly placeholder="Výsledok"
           style="width:100%;padding:6px;border:1px solid #555;border-radius:3px;background:#2b2b2b;color:#eee;">
  </div>
`;

const sticky = content.querySelector('#sticky-text');
sticky.insertAdjacentHTML('afterend', percentCalcHTML);

// elements
const pcBase = content.querySelector('#pc-base');
const pcPercent = content.querySelector('#pc-percent');
const pcMode = content.querySelector('#pc-mode');
const pcCalc = content.querySelector('#pc-calc');
const pcResult = content.querySelector('#pc-result');
const pcCopy = content.querySelector('#pc-copy');

// load saved values (optional persistence)
pcBase.value = localStorage.getItem('pc-base') || '';
pcPercent.value = localStorage.getItem('pc-percent') || '';
pcMode.value = localStorage.getItem('pc-mode') || 'sub';

function formatNumber(n) {
  if (Number.isNaN(n) || n === null) return '';
  return Number(n).toFixed(2);
}

function computePercent() {
  const base = parseFloat(pcBase.value);
  const percent = parseFloat(pcPercent.value);

  // percentOfBase: koľko percent je hodnota z base
  if (pcMode.value === 'percentOfBase') {
    if (isNaN(base) || isNaN(percent) || base === 0) {
      pcResult.value = '';
      return;
    }
    const pct = (percent / base) * 100;
    pcResult.value = formatNumber(pct) + ' %';
    return;
  }

  if (isNaN(base) || isNaN(percent)) {
    pcResult.value = '';
    return;
  }

  const value = base * (percent / 100);

  if (pcMode.value === 'value') {
    pcResult.value = formatNumber(value);
  } else if (pcMode.value === 'add') {
    pcResult.value = `${formatNumber(value)} (celkom ${formatNumber(base + value)})`;
  } else if (pcMode.value === 'sub') {
    const remaining = base - value;
    pcResult.value = `${formatNumber(value)} (po odpočítaní ${formatNumber(remaining)})`;
  } else {
    pcResult.value = formatNumber(value);
  }
}

// events
pcCalc.addEventListener('click', computePercent);
pcBase.addEventListener('input', () => { localStorage.setItem('pc-base', pcBase.value); computePercent(); });
pcPercent.addEventListener('input', () => { localStorage.setItem('pc-percent', pcPercent.value); computePercent(); });
pcMode.addEventListener('change', () => { localStorage.setItem('pc-mode', pcMode.value); computePercent(); });

pcCopy.addEventListener('click', () => {
  if (!pcResult.value) return;
  navigator.clipboard.writeText(pcResult.value).then(() => {
    const old = pcCopy.textContent;
    pcCopy.textContent = 'OK';
    setTimeout(() => pcCopy.textContent = old, 900);
  });
});

// Enter support
[pcBase, pcPercent].forEach(el => {
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      computePercent();
    }
  });
});

// initial compute (ak su uložené hodnoty)
computePercent();

    document.body.appendChild(box);

    // --- DRAG VIA BORDER ONLY ---
    let offsetX = 0,
        offsetY = 0,
        isDragging = false;
    // Only drag if mouse is in the border area (not inner content)
    box.addEventListener('mousedown', (e) => {
        // Get box rect and inner content rect
        const boxRect = box.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();

        // Border thickness in px (must match CSS above)
        const border = 12;
        // Mouse must not be inside the content rect (with 1px fudge for border-radius)
        if (
            e.clientX > contentRect.left - 1 &&
            e.clientX < contentRect.right + 1 &&
            e.clientY > contentRect.top - 1 &&
            e.clientY < contentRect.bottom + 1
        ) return;

        // Don't drag if inside the resize corner
        const resizeZone = 18;
        if (
            e.clientX > boxRect.right - resizeZone &&
            e.clientY > boxRect.bottom - resizeZone
        ) return;

        isDragging = true;
        offsetX = e.clientX - box.offsetLeft;
        offsetY = e.clientY - box.offsetTop;
        box.classList.add('drag-hover');
        e.preventDefault();
    });
    box.addEventListener('mousemove', (e) => {
        // On hover over border, highlight
        const contentRect = content.getBoundingClientRect();
        if (
            e.clientX > contentRect.left - 1 &&
            e.clientX < contentRect.right + 1 &&
            e.clientY > contentRect.top - 1 &&
            e.clientY < contentRect.bottom + 1
        ) {
            box.classList.remove('drag-hover');
            box.style.cursor = "";
        } else {
            box.classList.add('drag-hover');
            box.style.cursor = "move";
        }
    });
    box.addEventListener('mouseleave', () => {
        if (!isDragging) {
            box.classList.remove('drag-hover');
            box.style.cursor = "";
        }
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            box.style.left = `${e.clientX - offsetX}px`;
            box.style.top = `${e.clientY - offsetY}px`;
            localStorage.setItem('copybox-left', box.style.left);
            localStorage.setItem('copybox-top', box.style.top);
        }
    });
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            box.classList.remove('drag-hover');
            box.style.cursor = "";
        }
    });

    // --- RESIZE REMEMBER ---
    const resizeObserver = new ResizeObserver(() => {
        const computed = window.getComputedStyle(box);
        localStorage.setItem('copybox-width', computed.width);
        localStorage.setItem('copybox-height', computed.height);
    });
    resizeObserver.observe(box);

    // --- MINIMIZE PATCH ---
    const minimizeBtn = document.createElement('button');
    minimizeBtn.id = "copybox-minimize";
    minimizeBtn.textContent = "–";
    box.appendChild(minimizeBtn);

    function saveNormalSize() {
        localStorage.setItem('copybox-normal-width', box.style.width);
        localStorage.setItem('copybox-normal-height', box.style.height);
    }

    function getNormalWidth() {
        return localStorage.getItem('copybox-normal-width') || localStorage.getItem('copybox-width') || '220px';
    }

    function getNormalHeight() {
        return localStorage.getItem('copybox-normal-height') || localStorage.getItem('copybox-height') || '320px';
    }

    if (localStorage.getItem('copybox-minimized') === '1') {
        content.style.display = 'none';
        minimizeBtn.textContent = '+';
        box.style.width = '100px';
        box.style.height = '40px';
        box.style.minHeight = '0';
        box.style.resize = 'none';
        box.style.overflow = 'hidden';
    }

    minimizeBtn.onclick = () => {
        if (content.style.display === 'none') {
            content.style.display = 'flex';
            minimizeBtn.textContent = '–';
            localStorage.setItem('copybox-minimized', '0');
            box.style.width = getNormalWidth();
            box.style.height = getNormalHeight();
            box.style.minHeight = '140px';
            box.style.resize = 'both';
            box.style.overflow = 'auto';
        } else {
            saveNormalSize();
            content.style.display = 'none';
            minimizeBtn.textContent = '+';
            localStorage.setItem('copybox-minimized', '1');
            box.style.width = '100px';
            box.style.height = '40px';
            box.style.minHeight = '0';
            box.style.resize = 'none';
            box.style.overflow = 'hidden';
            box.scrollTop = 0;
            box.scrollLeft = 0;
        }
    };

    // --- RESET POSITION SHORTCUT ---
    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key.toLowerCase() === 'r') {
            box.style.top = '100px';
            box.style.left = '100px';
            localStorage.setItem('copybox-top', '100px');
            localStorage.setItem('copybox-left', '100px');
        }
    });

    // Sticky notes logic
    const stickyTextarea = content.querySelector('#sticky-text');
    const savedSticky = localStorage.getItem('copybox-sticky') || '';
    stickyTextarea.value = savedSticky;
    stickyTextarea.addEventListener('input', e => {
        localStorage.setItem('copybox-sticky', e.target.value);
    });
    stickyTextarea.addEventListener('mousedown', (e) => {
        if (e.button !== 1) return;
        e.preventDefault();
        const rect = stickyTextarea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const approxLineHeight = 20;
        const lines = stickyTextarea.value.split('\n');
        const line = Math.floor(y / approxLineHeight);
        if (line >= lines.length) return;
        const clickedLine = lines[line];
        let charPos = Math.floor((x / rect.width) * clickedLine.length);
        charPos = Math.max(0, Math.min(clickedLine.length, charPos));
        const urlRegex = /https?:\/\/[^\s]+/g;
        let match;
        while ((match = urlRegex.exec(clickedLine)) !== null) {
            const start = match.index;
            const end = start + match[0].length;
            if (charPos >= start && charPos <= end) {
                window.open(match[0], '_blank');
                return;
            }
        }
    });

    // Autofill logic + number sequence
    const autofillDiv = content.querySelector('#copybox-autofill');
    const observer = new MutationObserver(() => {
        const customerBlock = document.querySelector('p.ndUserInfo_name')?.closest('div');
        const nameEl = customerBlock?.querySelector('p.ndUserInfo_name');
        const emailAnchor = customerBlock?.querySelector('a[href^="mailto:"]');
        const phoneAnchor = customerBlock?.querySelector('a[href^="tel:"]');
        const fullName = nameEl?.textContent.trim() || '';
        const lastName = fullName.split(' ').slice(-1)[0] || '';
        const email = emailAnchor?.textContent.trim() || '';
        const phone = phoneAnchor?.textContent.replace(/\D+/g, '') || '';
        if (lastName && phone && email) {
            const formatted = `${lastName}, ${phone}, ${email}`;
            autofillDiv.innerHTML = `
                <hr style="margin:8px 0;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <strong></strong>
                    <label style="font-weight:normal;font-size:12px;">
                        <input type="checkbox" id="use-full-name" style="vertical-align:middle;margin-right:2px;">
                        Full name
                    </label>
                </div>
             <div style="margin-top:5px; font-size:13px;">
    <code style="display:block; margin-bottom:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${formatted}">
        ${formatted}
    </code>
    <div style="display:flex; gap:5px; margin-bottom:5px;">
        <button id="copy-auto" style="width:100%; padding:6px 0; font-weight:bold; font-size:14px; background:#333; color:#ddd; border:1px solid #555;">
            📋 Meno + Phone + Email
        </button>
        <button id="copy-pošta" style="width:200px; padding:6px 0; font-weight:bold; font-size:14px; background:#333; color:#ddd; border:1px solid #555;">
            📋 Pošta
        </button>
    </div>
    <button id="copy-fullname" style="width:100%; padding:6px 0; font-weight:bold; font-size:14px; background:#333; color:#ddd; border:1px solid #555;">
        📋 Priezvisko Meno
    </button>
    <div style="display:flex;gap:5px;margin-top:5px;flex-wrap:nowrap;">
        <button id="copy-street" style="width:33%; padding:6px 0; font-weight:bold; font-size:14px; background:#333; color:#ddd; border:1px solid #555;">🏠 Ulica</button>
        <button id="copy-city" style="width:33%; padding:6px 0; font-weight:bold; font-size:14px; background:#333; color:#ddd; border:1px solid #555;">🌆 Mesto</button>
        <button id="copy-ico" style="width:32%; padding:6px 0; font-weight:bold; font-size:14px; background:#333; color:#ddd; border:1px solid #555;">🆔 IČO</button>
    </div>
    <!-- NUMBER SEQUENCE -->
    <div style="display:flex;align-items:center;gap:6px;margin:10px 0 2px 0;">
        <input id="number-seq-input" type="number" min="0" step="1" style="width:110px;padding:4px 8px;border:1px solid #555;border-radius:3px;background:#232323;color:#eee;font-size:15px;">
        <button id="copy-number-seq" style="padding:6px 16px;font-weight:bold;font-size:14px;background:#333;color:#ddd;border:1px solid #555;border-radius:3px;">➕ 10 čísel</button>
    </div>
    </div>
                `;
            autofillDiv.querySelector('#copy-street').addEventListener('click', () => {
                const text = document.querySelector('p.ndAddressModel_address')?.textContent?.split(',')[0]?.trim();
                if (text) navigator.clipboard.writeText(text);
            });
            autofillDiv.querySelector('#copy-city').addEventListener('click', () => {
                const text = document.querySelector('p.ndAddressModel_address')?.textContent?.split(',')[1]?.trim();
                if (text) navigator.clipboard.writeText(text);
            });
            autofillDiv.querySelector('#copy-ico').addEventListener('click', () => {
                const text = document.querySelector('p.ndAddressModel_ico')?.textContent?.match(/\d+/)?.[0];
                if (text) navigator.clipboard.writeText(text);
            });
            autofillDiv.querySelector('#use-full-name').addEventListener('change', (e) => {
                const namePart = e.target.checked ? fullName : lastName;
                const newFormatted = `${namePart}, ${phone}, ${email}`;
                const codeEl = autofillDiv.querySelector('code');
                codeEl.textContent = newFormatted;
                codeEl.title = newFormatted;
                autofillDiv.querySelector('#copy-auto').onclick = () => {
                    navigator.clipboard.writeText(newFormatted);
                };
            });
            autofillDiv.querySelector('#copy-auto').addEventListener('click', () => {
                navigator.clipboard.writeText(formatted);
            });
            autofillDiv.querySelector('#copy-fullname').addEventListener('click', () => {
                const nameParts = fullName.trim().split(/\s+/);
                const last = nameParts.slice(-1)[0];
                const first = nameParts.slice(0, -1).join(' ');
                const reversed = `${last} ${first}`;
                navigator.clipboard.writeText(reversed);
            });
            autofillDiv.querySelector('#copy-pošta').addEventListener('click', () => {
                const namePart = autofillDiv.querySelector('#use-full-name')?.checked ? fullName : lastName;
                const finalText = `${namePart}, ${phone}, ${email}, Prosím poslať na poštu`;
                navigator.clipboard.writeText(finalText);
            });

            // ---- Number sequence logic ----
            const input = autofillDiv.querySelector('#number-seq-input');
            const button = autofillDiv.querySelector('#copy-number-seq');
            button.addEventListener('click', () => {
                let base = parseInt(input.value, 10);
                if (isNaN(base)) return;
                const lines = [];
                for (let i = 1; i <= 10; ++i) {
                    lines.push(`${base + i} –`);
                }
                navigator.clipboard.writeText(lines.join('\n'));
                button.textContent = 'Skopírované!';
                setTimeout(() => button.textContent = '➕ 10 čísel', 1200);
            });

            observer.disconnect();
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();