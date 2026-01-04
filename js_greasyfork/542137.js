// ==UserScript==
// @name        QuickCoords
// @namespace   Violentmonkey Scripts
// @match       *://cavegame.io/*
// @match       *://mineroyale.io/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @version     2.0
// @author      Drik
// @description Sends coordinates to chat when the binding key is pressed. HUD (F10 toggle). msg mode.
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/542137/QuickCoords.user.js
// @updateURL https://update.greasyfork.org/scripts/542137/QuickCoords.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const SK = 'cfg';
    const SEL = '.player-position.no-select';
    const CHAT = '#chat-input';
    const DEF = {
        k: 'KeyR',
        kl: 'R',
        msg: false,
        n: []
    };

    async function save(x) {
        await GM_setValue(SK, JSON.stringify(x));
        cfg = x;
    }
    async function load() {
        const v = await GM_getValue(SK);
        return v ? JSON.parse(v) : DEF;
    }

    let cfg = await load();
    cfg.n = Array.isArray(cfg.n) ? cfg.n.slice(0, 2) : [];

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    function openChat() {
        document.dispatchEvent(new KeyboardEvent('keydown', {
            key: 't',
            code: 'KeyT',
            keyCode: 84,
            which: 84,
            bubbles: true,
            cancelable: true
        }));
    }

    async function sendRaw(txt) {
        const el = document.querySelector(CHAT);
        if (!el) return;
        el.focus();
        el.value = txt;
        el.dispatchEvent(new InputEvent('input', {
            bubbles: true
        }));
        await sleep(69);
        el.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true
        }));
    }

    async function sendAll(txt) {
        if (!txt) return;
        const list = Array.isArray(cfg.n) ? cfg.n.slice(0, 2) : [];
        if (list.length === 0) {
            openChat();
            await sleep(69);
            await sendRaw(txt);
            return;
        }
        for (let i = 0; i < list.length; i++) {
            openChat();
            await sleep(69);
            await sendRaw(`/msg ${list[i]} ${txt}`);
            await sleep(200);
        }
    }

    function getCoords() {
        const e = document.querySelector(SEL);
        return e ? e.textContent.trim() : null;
    }

    function pretty(k) {
        if (!k) return '?';
        if (/^Key[A-Z]$/.test(k)) return k.slice(3);
        if (/^Digit[0-9]$/.test(k)) return k.slice(5);
        return k;
    }

    function esc(s) {
        return String(s).replace(/[&<>"]/g, m => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;'
        } [m]));
    }

    function onKey(ev) {
        if (ev.code === 'F10') {
            toggleHUD();
            ev.preventDefault();
            ev.stopPropagation();
            return;
        }
        const a = document.activeElement;
        if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.isContentEditable)) return;
        if (ev.code === cfg.k) {
            const c = getCoords();
            sendAll(c);
        }
    }
    window.addEventListener('keydown', onKey, true);

    function UI() {
        if (document.getElementById('chud')) return;
        const s = document.createElement('style');
        s.textContent = `
#chud{position:fixed;left:12px;top:12px;z-index:2147483646;font-family:Inter,system-ui,Arial,sans-serif;user-select:none;background:linear-gradient(180deg,rgba(16,10,30,0.96),rgba(12,7,22,0.94));color:#f2eefc;border-radius:12px;padding:12px;min-width:260px;box-shadow:0 14px 30px rgba(2,2,8,0.7);backdrop-filter:blur(6px);font-size:13px;overflow:hidden;transition:transform .18s ease,opacity .18s ease}
#chud.hidden{transform:translateY(-10px) scale(.98);opacity:0;pointer-events:none}
#chud .row{display:flex;gap:10px;align-items:center;margin:10px 0}
.btn{cursor:pointer;padding:8px 12px;border-radius:10px;background:linear-gradient(90deg,#6f5bd6,#8f7df0);border:1px solid rgba(255,255,255,0.08);font-size:13px;color:#fff;transition:transform .12s ease,box-shadow .12s ease}
.btn:hover{transform:translateY(-3px);box-shadow:0 10px 30px rgba(111,91,214,0.18)}
#kd{font-weight:700;padding:8px 12px;border-radius:12px;background:linear-gradient(90deg,rgba(150,110,230,0.22),rgba(110,80,200,0.14));border:1px solid rgba(150,110,230,0.18);color:#fff}
#names{margin-top:10px;display:flex;flex-direction:column;gap:8px;max-height:240px;overflow:auto}
.nm{display:flex;justify-content:space-between;align-items:center;padding:8px 10px;border-radius:10px;background:linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01));border:1px solid rgba(255,255,255,0.02)}
.nm .del{cursor:pointer;padding:6px;border-radius:8px;background:rgba(255,255,255,0.03)}
#nin{flex:1;padding:8px 10px;border-radius:10px;background:transparent;border:1px solid rgba(255,255,255,0.06);color:inherit}
#msgWrap{max-height:0;opacity:0;overflow:hidden;transition:max-height .32s cubic-bezier(.2,.9,.2,1),opacity .2s ease}
#msgWrap.show{max-height:260px;opacity:1}
.tip{font-size:12px;opacity:0.86}
@keyframes shake{0%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}100%{transform:translateX(0)}}
.shake{animation:shake .45s}
`;
        document.head.appendChild(s);

        const h = document.createElement('div');
        h.id = 'chud';
        h.innerHTML = `
<div style="display:flex;justify-content:space-between;align-items:center"><div style="font-weight:700">CoordsHelper</div></div>
<div class="row">
  <div style="flex:1">
    <div style="font-size:12px;opacity:0.9">Key</div>
    <div style="display:flex;gap:10px;margin-top:8px;align-items:center">
      <div id="kd">${esc(cfg.kl || pretty(cfg.k))}</div>
      <button class="btn" id="chg">Change</button>
      <button class="btn" id="rst" title="Reset">Reset</button>
    </div>
  </div>
</div>
<div class="row"><label><input type="checkbox" id="msgc" ${cfg.msg ? 'checked' : ''}/> Msg</label></div>
<div id="msgWrap" class="${cfg.msg ? 'show' : ''}">
  <div id="names"></div>
  <div style="display:flex;gap:10px;margin-top:10px">
    <input id="nin" placeholder="add nick (max 2)" maxlength="32" />
    <button class="btn" id="add">Add</button>
  </div>
</div>
<div class="tip" style="margin-top:10px">Press Change then press the key. F10 toggles HUD (not bindable)</div>
`;
        document.body.appendChild(h);

        document.getElementById('msgc').addEventListener('change', async e => {
            cfg.msg = e.target.checked;
            const w = document.getElementById('msgWrap');
            if (w) w.classList.toggle('show', cfg.msg);
            await save(cfg);
        });

        document.getElementById('add').addEventListener('click', async () => {
            const ip = document.getElementById('nin');
            if (!ip) return;
            const v = ip.value.trim();
            if (!v) return;
            cfg.n = cfg.n || [];
            if (cfg.n.length >= 2) {
                flashShake();
                ip.value = '';
                return;
            }
            const safe = v.replace(/[\n\r]/g, '').slice(0, 32);
            cfg.n.push(safe);
            ip.value = '';
            cfg.n = cfg.n.slice(0, 2);
            await save(cfg);
            refreshNames();
        });

        document.getElementById('nin').addEventListener('keydown', ev => {
            if (ev.key === 'Enter') document.getElementById('add').click();
        });

        document.getElementById('chg').addEventListener('click', startCap);
        document.getElementById('rst').addEventListener('click', async () => {
            cfg.k = DEF.k;
            cfg.kl = DEF.kl;
            updKD();
            await save(cfg);
        });

        refreshNames();
    }

    function refreshNames() {
        const c = document.getElementById('names');
        if (!c) return;
        c.innerHTML = '';
        (cfg.n || []).forEach((nm, i) => {
            const w = document.createElement('div');
            w.className = 'nm';
            w.innerHTML = `<div style="overflow:hidden;text-overflow:ellipsis">${esc(nm)}</div><div style="display:flex;gap:10px;align-items:center"><div style="font-size:11px;opacity:.8">#${i+1}</div><div class="del" data-i="${i}">✕</div></div>`;
            c.appendChild(w);
            w.querySelector('.del').addEventListener('click', async (ev) => {
                const idx = Number(ev.currentTarget.getAttribute('data-i'));
                cfg.n.splice(idx, 1);
                cfg.n = cfg.n.slice(0, 2);
                await save(cfg);
                refreshNames();
            });
        });
    }

    function flashShake() {
        const el = document.getElementById('chud');
        if (!el) return;
        el.classList.add('shake');
        setTimeout(() => el.classList.remove('shake'), 480);
    }

    let cap = false;

    function startCap() {
        if (cap) return;
        cap = true;
        const wait = document.getElementById('kd');
        wait.textContent = '...';

        function kh(e) {
            const a = document.activeElement;
            if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.isContentEditable)) return;
            const code = e.code || ('Key' + (e.key || '').toUpperCase());
            if (!code) return;
            if (code === 'F10') {
                updKD();
                cap = false;
                window.removeEventListener('keydown', kh, true);
                flashShake();
                return;
            }
            cfg.k = code;
            cfg.kl = (e.key && e.key.length === 1) ? e.key.toUpperCase() : pretty(code);
            updKD();
            save(cfg);
            cap = false;
            window.removeEventListener('keydown', kh, true);
            e.preventDefault();
            e.stopPropagation();
        }
        window.addEventListener('keydown', kh, true);
    }

    function updKD() {
        const el = document.getElementById('kd');
        if (el) el.textContent = cfg.kl || pretty(cfg.k);
    }

    function toggleHUD() {
        const el = document.getElementById('chud');
        if (!el) return;
        el.classList.toggle('hidden');
    }

    async function init() {
        if (!document.body) {
            requestAnimationFrame(init);
            return;
        }
        UI();
        updKD();
        cfg.n = cfg.n.slice(0, 2);
        await save(cfg);
    }

    init();

})();