// ==UserScript==
// @name        AutoCraft[2.0]
// @namespace   Violentmonkey Scripts
// @match       *://cavegame.io/*
// @grant       GM_addStyle
// @version     2.0
// @author      Drik
// @description fast craft.
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/527723/AutoCraft%5B20%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/527723/AutoCraft%5B20%5D.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const HK = 'F10';
    const SELS = {
        d: "div.inventory.overlay-inventory[data-type='vault-door']",
        b: "div.inventory.overlay-inventory[data-type='barrier']",
        g: "div.inventory.overlay-inventory[data-type='gold-generator']",
        a: "div.inventory.overlay-inventory[data-type='arrow']",
        s: "div.inventory.overlay-inventory[data-type='stew']"
    };

    const EventADD = EventTarget.prototype.addEventListener;
    const EventREMOVE = EventTarget.prototype.removeEventListener;
    const LS = new WeakMap();

    function gM(el) {
        let m = LS.get(el);
        if (!m) {
            m = new Map();
            LS.set(el, m);
        }
        return m;
    }

    EventTarget.prototype.addEventListener = function(t, l, o) {
        try {
            if (typeof l === 'function') {
                const m = gM(this);
                if (!m.has(t)) m.set(t, []);
                m.get(t).push(l);
            }
        } catch (e) {}
        return EventADD.call(this, t, l, o);
    };

    EventTarget.prototype.removeEventListener = function(t, l, o) {
        try {
            const m = LS.get(this);
            if (m && m.has(t)) {
                const arr = m.get(t);
                for (let i = arr.length - 1; i >= 0; i--) {
                    if (arr[i] === l) arr.splice(i, 1);
                }
                if (arr.length === 0) m.delete(t);
            }
        } catch (e) {}
        return EventREMOVE.call(this, t, l, o);
    };

    function cE(type, target) {
        return {
            type: type,
            target: target,
            currentTarget: target,
            bubbles: true,
            cancelable: true,
            defaultPrevented: false,
            button: 0,
            isTrusted: false,
            preventDefault: function() {
                this.defaultPrevented = true;
            },
            stopPropagation: function() {},
            stopImmediatePropagation: function() {}
        };
    }

    function dIH(el, t) {
        try {
            const m = LS.get(el);
            const ev = cE(t, el);
            if (m && m.has(t)) {
                const arr = m.get(t).slice();
                for (let i = 0; i < arr.length; i++) {
                    try {
                        arr[i].call(el, ev);
                    } catch (e) {}
                }
            }
            const inl = 'on' + t;
            if (typeof el[inl] === 'function') {
                try {
                    el[inl].call(el, ev);
                } catch (e) {}
            }
        } catch (e) {}
    }

    function fT(el) {
        if (!el) return false;
        dIH(el, 'click');
        return true;
    }

    const C = {};

    function upd() {
        for (const k in SELS) {
            try {
                C[k] = document.querySelector(SELS[k]) || null;
            } catch (e) {
                C[k] = null;
            }
        }
    }

    const obs = new MutationObserver(() => {
        upd();
    });

    function sObs() {
        const r = document.body;
        if (r) obs.observe(r, {
            childList: true,
            subtree: true
        });
    }

    let running = false;

    function cT(k, n) {
        let el = C[k] || null;
        if (!el) el = document.querySelector(SELS[k]) || null;
        if (!el) return 0;
        let done = 0;
        for (let i = 0; i < n; i++) {
            if (!running) break;
            if (!el || !el.isConnected) {
                el = document.querySelector(SELS[k]) || null;
                if (!el) break;
            }
            try {
                fT(el);
                done++;
            } catch (e) {
                break;
            }
        }
        return done;
    }

    GM_addStyle(`
#UI {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 999999;
  min-width: 260px;
  max-width: 340px;
  background: linear-gradient(180deg, rgba(28,28,28,0.96), rgba(20,20,20,0.96));
  color: #eee;
  padding: 12px;
  border-radius: 10px;
  font-family: Inter, Arial, sans-serif;
  font-size: 13px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.55);
  border: 1px solid rgba(255,255,255,0.04);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

#UI .head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

#UI .grid {
  display: grid;
  grid-template-columns: 1fr 92px;
  gap: 8px 10px;
  align-items: center;
}

#UI .grid .label {
  justify-self: start;
  padding-left: 6px;
  color: #ddd;
  font-size: 13px;
}

#UI .grid input[type="number"] {
  width: 88px;
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
  color: #fff;
  text-align: center;
  font-weight: 600;
  outline: none;
}

#UI .grid input[type="number"]:focus {
  box-shadow: 0 0 0 3px rgba(43,140,255,0.10);
  border-color: rgba(43,140,255,0.9);
}

#UI .controls {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
}

#UI button {
  padding: 8px 10px;
  border-radius: 8px;
  border: 0;
  background: #2b8cff;
  color: #fff;
  cursor: pointer;
  font-weight: 700;
  letter-spacing: 0.2px;
  transition: transform 0.08s ease, box-shadow 0.08s ease, opacity 0.08s ease;
}

#UI button:active {
  transform: translateY(1px);
}

#UI button.secondary {
  background: #666;
  color: #fff;
}

#UI .info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #cfcfcf;
  opacity: 0.9;
  margin-top: 10px;
}

@media (max-width: 420px) {
  #UI { left: 8px; right: 8px; min-width: unset; max-width: calc(100% - 16px); }
  #UI .grid { grid-template-columns: 1fr 84px; }
}
  `);

    const U = {
        r: null,
        i: {},
        runBtn: null,
        stopBtn: null
    };

    function cUI() {
        const c = document.createElement('div');
        c.id = 'UI';

        const head = document.createElement('div');
        head.className = 'head';
        c.appendChild(head);

        const rows = document.createElement('div');
        rows.className = 'grid';

        [
            ['d', 'Doors'],
            ['b', 'Barriers'],
            ['g', 'Generators'],
            ['a', 'Arrows'],
            ['s', 'Stews']
        ].forEach(x => {
            const lab = document.createElement('div');
            lab.className = 'label';
            lab.textContent = x[1] + ':';

            const inp = document.createElement('input');
            inp.type = 'number';
            inp.min = '0';
            inp.value = '0';
            inp.dataset.k = x[0];
            inp.addEventListener('input', function() {
                this.value = this.value.replace(/[^0-9]/g, '')
            });

            rows.appendChild(lab);
            rows.appendChild(inp);
            U.i[x[0]] = inp;
        });

        c.appendChild(rows);

        const cr = document.createElement('div');
        cr.className = 'controls';

        const run = document.createElement('button');
        run.textContent = 'Run';
        run.addEventListener('click', onRun);

        const stop = document.createElement('button');
        stop.textContent = 'Stop';
        stop.className = 'secondary';
        stop.addEventListener('click', onStop);

        cr.appendChild(run);
        cr.appendChild(stop);
        c.appendChild(cr);

        const foot = document.createElement('div');
        foot.className = 'info';
        const hint = document.createElement('div');
        hint.textContent = 'Toggle: F10';
        foot.appendChild(hint);
        c.appendChild(foot);

        document.body.appendChild(c);
        U.r = c;
        U.runBtn = run;
        U.stopBtn = stop;
    }

    function rI() {
        const o = {};
        for (const k in U.i) {
            const v = parseInt(U.i[k].value || '0', 10);
            o[k] = isNaN(v) ? 0 : v;
        }
        return o;
    }

    function onRun() {
        if (running) return;
        running = true;
        U.runBtn.disabled = true;
        U.stopBtn.disabled = false;

        const t = rI();

        for (const k in t) {
            const n = t[k] || 0;
            if (n <= 0) continue;
            cT(k, n);
        }

        running = false;
        U.runBtn.disabled = false;
        U.stopBtn.disabled = true;
    }

    function onStop() {
        running = false;
    }

    document.addEventListener('keydown', (e) => {
        try {
            if (e.key === HK) {
                if (U.r) U.r.style.display = (U.r.style.display === 'none') ? 'block' : 'none';
            }
        } catch (e) {}
    });

    function init() {
        cUI();
        upd();
        sObs();
        if (U.r) U.r.style.display = 'block';
        U.stopBtn.disabled = true;
    }

    init();

})();