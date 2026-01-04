// ==UserScript==
// @name         ShaderToy Number Tweaker
// @namespace    http://tampermonkey.net/
// @version      2025-08-07
// @description  A tweaker for tweakers.
// @author       PAEz
// @match        https://www.shadertoy.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shadertoy.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545696/ShaderToy%20Number%20Tweaker.user.js
// @updateURL https://update.greasyfork.org/scripts/545696/ShaderToy%20Number%20Tweaker.meta.js
// ==/UserScript==

// Ctrl+Up/Down or Ctrl+MouseWheel: adjust numbers | Ctrl+Enter or Ctrl+MiddleClick: trigger Alt+Enter | Ctrl: track to mouse
(function() {
    let mouseX = 0, mouseY = 0, overEditor = null;
    let ctrlHeld = false;

    // Track mouse position over editors and update cursor if Ctrl is held
    document.addEventListener('mousemove', function(e) {
        const el = e.target.closest('.CodeMirror, .cm-editor');
        if (el) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            overEditor = el;

            // If Ctrl is held, move cursor to mouse position
            if (ctrlHeld && overEditor && overEditor.CodeMirror) {
                const cm = overEditor.CodeMirror;
                const coords = cm.coordsChar({left: mouseX, top: mouseY});
                if (coords) {
                    cm.setCursor(coords);
                }
            }
        } else {
            overEditor = null;
        }
    });

    // Track Ctrl key state
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Control') {
            ctrlHeld = true;
        }

        // Ctrl+Enter → Alt+Enter
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const evt = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                altKey: true,
                bubbles: true,
                cancelable: true
            });

            (document.activeElement || document).dispatchEvent(evt);
            return false;
        }

        // Number adjustment with Ctrl+Up/Down
        if (e.ctrlKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
            const el = e.target.closest('.CodeMirror, .cm-editor');
            if (!el) return;

            e.preventDefault();
            e.stopImmediatePropagation();

            const dir = e.key === 'ArrowUp' ? 1 : -1;
            const inc = e.altKey ? 0.01 : e.shiftKey ? 0.1 : 1;

            // CM5
            if (el.CodeMirror) {
                const cm = el.CodeMirror;
                const cur = cm.getCursor();
                const res = adjust(cm.getLine(cur.line), cur.ch, dir * inc);

                if (res) cm.replaceRange(res.t,
                    {line: cur.line, ch: res.s},
                    {line: cur.line, ch: res.e});
            }
        }
    }, true);

    // Track when Ctrl is released
    document.addEventListener('keyup', function(e) {
        if (e.key === 'Control') {
            ctrlHeld = false;
        }
    }, true);

    // Ctrl + Mouse wheel → Adjust numbers
    document.addEventListener('wheel', function(e) {
        if (!e.ctrlKey) return; // Only activate with Ctrl held

        const el = e.target.closest('.CodeMirror, .cm-editor');
        if (!el) return;

        e.preventDefault();
        e.stopPropagation();

        const dir = e.deltaY < 0 ? 1 : -1;
        const inc = e.altKey ? 0.01 : e.shiftKey ? 0.1 : 1;

        // CM5
        if (el.CodeMirror) {
            const cm = el.CodeMirror;
            const cur = cm.getCursor();
            const res = adjust(cm.getLine(cur.line), cur.ch, dir * inc);

            if (res) cm.replaceRange(res.t,
                {line: cur.line, ch: res.s},
                {line: cur.line, ch: res.e});
        }

    }, {passive: false});

    // Ctrl + Middle click → Alt+Enter
    ['mousedown', 'auxclick', 'mouseup'].forEach(eventType => {
        document.addEventListener(eventType, function(e) {
            if (e.button === 1 && (e.ctrlKey || e.metaKey)) { // Middle button + Ctrl
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                if (eventType === 'mousedown') { // Only trigger on mousedown, not all three
                    console.log('Ctrl+MiddleClick detected');

                    const evt = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        altKey: true,
                        bubbles: true,
                        cancelable: true
                    });

                    setTimeout(() => {
                        (document.activeElement || e.target || document).dispatchEvent(evt);
                    }, 0);
                }
                return false;
            }
        }, true);
    });

    function adjust(txt, pos, inc) {
        let s = pos, e = pos;
        if (s > 0 && /[\d.-]/.test(txt[s-1])) s--;
        while (s > 0 && /[\d.-]/.test(txt[s-1])) s--;
        while (e < txt.length && /[\d.]/.test(txt[e])) e++;

        const m = txt.substring(s, e).match(/-?\d+\.?\d*/);
        if (!m) return null;

        const n = parseFloat(m[0]) + inc;
        const orig = m[0];
        const dec = orig.includes('.') ? orig.split('.')[1]?.length || 0 : 0;

        let str;
        if (!orig.includes('.') && Math.abs(inc) >= 1 && n % 1 === 0) {
            str = n.toString();
        } else {
            const d = Math.abs(inc) < 0.1 ? Math.max(dec, 2) :
                      Math.abs(inc) < 1 ? Math.max(dec, 1) : dec;
            str = n.toFixed(d);
        }

        console.log({s: s + txt.substring(s, e).indexOf(m[0]), e: s + txt.substring(s, e).indexOf(m[0]) + m[0].length, t: str});
        return {s: s + txt.substring(s, e).indexOf(m[0]), e: s + txt.substring(s, e).indexOf(m[0]) + m[0].length, t: str};
    }

    console.log('Controls: Ctrl+Up/Down or Ctrl+Wheel (±1/0.1/0.01) | Ctrl+Enter or Ctrl+MiddleClick (Alt+Enter) | Ctrl: jump to mouse');
})();