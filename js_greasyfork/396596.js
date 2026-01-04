// ==UserScript==
// @name         Commit: Interactive image diff using Pixelmatch
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Adds an image diff control in place of a regular image comparison renderer on GitHub
// @author       You
// @match        https://render.githubusercontent.com/diff/img?*
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396596/Commit%3A%20Interactive%20image%20diff%20using%20Pixelmatch.user.js
// @updateURL https://update.greasyfork.org/scripts/396596/Commit%3A%20Interactive%20image%20diff%20using%20Pixelmatch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.hostname === 'github.com') {
        if (window) {
            window.addEventListener('keyup', (ev) => {
                const iframes = Array.from(document.querySelectorAll('iframe'));
                iframes.forEach(x => {
                    if (x.hasAttribute('sandbox')) {
                        x.removeAttribute('sandbox')
                    }
                    x.contentWindow.postMessage({name: 'keyup-image-diff', key: ev.key}, '*');
                });
            });
        }

        console.log("Commit: Interactive image diff");
        let styleApplied = false;
        const styleNode = document.createElement("style");
        styleNode.innerHTML = `
/*body.hasIframe .container-lg.new-discussion-timeline { max-width: initial; }*/
.render-container[data-type='img'] { height: 700px !important; }
`;
        document.head.appendChild(styleNode);

        document.body.addEventListener('click', (ev) => {
            let target = ev.target.closest('button');
            if (!target || styleApplied) {
                return;
            }
            if (target.getAttribute('aria-label') == 'Display the rich diff') { // are we on milestones page
                styleApplied = true;
                document.body.classList.add('full-width'); // this is a built-in class on GH, but it is only on in PR review, not in commits

                // click on all rich previews
                const buttons = document.querySelectorAll("[aria-label='Display the rich diff']");
                Array.from(buttons).forEach(button => {
                    const mockedEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true
                    });
                    button.dispatchEvent(mockedEvent);
                });
            }
        });


        return;
    }

    window.addEventListener('message', (ev) => {
        const input = document.querySelector('#thisPluginsInput');
        if(ev.data.name === 'keyup-image-diff') {
            switch (ev.data.key) {
                case '1':
                    input.setAttribute('value', '1');
                    break;
                case '2':

                    input.setAttribute('value', '2');
                    break;
                case '3':

                    input.setAttribute('value', '3');
                    break;
            }
            var event = new Event('input', {
                bubbles: true,
                cancelable: true,
            });

            input.dispatchEvent(event);
        }
    });

    //pixelmatch
    !function (t) { if ("object" == typeof exports && "undefined" != typeof module) module.exports = t(); else if ("function" == typeof define && define.amd) define([], t); else { ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).pixelmatch = t() } }(function () { return function () { return function t(e, n, r) { function o(i, u) { if (!n[i]) { if (!e[i]) { var a = "function" == typeof require && require; if (!u && a) return a(i, !0); if (f) return f(i, !0); var c = new Error("Cannot find module '" + i + "'"); throw c.code = "MODULE_NOT_FOUND", c } var l = n[i] = { exports: {} }; e[i][0].call(l.exports, function (t) { return o(e[i][1][t] || t) }, l, l.exports, t, e, n, r) } return n[i].exports } for (var f = "function" == typeof require && require, i = 0; i < r.length; i++)o(r[i]); return o } }()({ 1: [function (t, e, n) { "use strict"; e.exports = function (t, e, n, i, a, c) { if (!o(t) || !o(e) || n && !o(n)) throw new Error("Image data: Uint8Array, Uint8ClampedArray or Buffer expected."); if (t.length !== e.length || n && n.length !== t.length) throw new Error("Image sizes do not match."); if (t.length !== i * a * 4) throw new Error("Image data size does not match width/height."); c = Object.assign({}, r, c); const l = i * a, s = new Uint32Array(t.buffer, t.byteOffset, l), p = new Uint32Array(e.buffer, e.byteOffset, l); let m = !0; for (let t = 0; t < l; t++)if (s[t] !== p[t]) { m = !1; break } if (m) { if (n && !c.diffMask) for (let e = 0; e < l; e++)h(t, 4 * e, c.alpha, n); return 0 } const w = 35215 * c.threshold * c.threshold; let y = 0; const [M, g, x] = c.aaColor, [E, b, A] = c.diffColor; for (let r = 0; r < a; r++)for (let o = 0; o < i; o++) { const l = 4 * (r * i + o), s = u(t, e, l, l); s > w ? c.includeAA || !f(t, o, r, i, a, e) && !f(e, o, r, i, a, t) ? (n && d(n, l, E, b, A), y++) : n && !c.diffMask && d(n, l, M, g, x) : n && (c.diffMask || h(t, l, c.alpha, n)) } return y }; const r = { threshold: .1, includeAA: !1, alpha: .1, aaColor: [255, 255, 0], diffColor: [255, 0, 0], diffMask: !1 }; function o(t) { return ArrayBuffer.isView(t) && 1 === t.constructor.BYTES_PER_ELEMENT } function f(t, e, n, r, o, f) { const a = Math.max(e - 1, 0), c = Math.max(n - 1, 0), l = Math.min(e + 1, r - 1), s = Math.min(n + 1, o - 1), d = 4 * (n * r + e); let h, p, m, w, y = e === a || e === l || n === c || n === s ? 1 : 0, M = 0, g = 0; for (let o = a; o <= l; o++)for (let f = c; f <= s; f++) { if (o === e && f === n) continue; const i = u(t, t, d, 4 * (f * r + o), !0); if (0 === i) { if (++y > 2) return !1 } else i < M ? (M = i, h = o, p = f) : i > g && (g = i, m = o, w = f) } return 0 !== M && 0 !== g && (i(t, h, p, r, o) && i(f, h, p, r, o) || i(t, m, w, r, o) && i(f, m, w, r, o)) } function i(t, e, n, r, o) { const f = Math.max(e - 1, 0), i = Math.max(n - 1, 0), u = Math.min(e + 1, r - 1), a = Math.min(n + 1, o - 1), c = 4 * (n * r + e); let l = e === f || e === u || n === i || n === a ? 1 : 0; for (let o = f; o <= u; o++)for (let f = i; f <= a; f++) { if (o === e && f === n) continue; const i = 4 * (f * r + o); if (t[c] === t[i] && t[c + 1] === t[i + 1] && t[c + 2] === t[i + 2] && t[c + 3] === t[i + 3] && l++ , l > 2) return !0 } return !1 } function u(t, e, n, r, o) { let f = t[n + 0], i = t[n + 1], u = t[n + 2], d = t[n + 3], h = e[r + 0], p = e[r + 1], m = e[r + 2], w = e[r + 3]; if (d === w && f === h && i === p && u === m) return 0; d < 255 && (f = s(f, d /= 255), i = s(i, d), u = s(u, d)), w < 255 && (h = s(h, w /= 255), p = s(p, w), m = s(m, w)); const y = a(f, i, u) - a(h, p, m); if (o) return y; const M = c(f, i, u) - c(h, p, m), g = l(f, i, u) - l(h, p, m); return .5053 * y * y + .299 * M * M + .1957 * g * g } function a(t, e, n) { return .29889531 * t + .58662247 * e + .11448223 * n } function c(t, e, n) { return .59597799 * t - .2741761 * e - .32180189 * n } function l(t, e, n) { return .21147017 * t - .52261711 * e + .31114694 * n } function s(t, e) { return 255 + (t - 255) * e } function d(t, e, n, r, o) { t[e + 0] = n, t[e + 1] = r, t[e + 2] = o, t[e + 3] = 255 } function h(t, e, n, r) { const o = s(a(t[e + 0], t[e + 1], t[e + 2]), n * t[e + 3] / 255); d(r, e, o, o, o) } }, {}] }, {}, [1])(1) });



    function setMode(input, span) {
        const pictures = document.querySelectorAll('.warpech-slider > *');

        switch (parseInt(input.value, 10)) {
            case 3:
                span.innerHTML = 'Diff';
                pictures[0].style.display = 'none';
                pictures[1].style.display = 'none';
                pictures[2].style.display = 'block';
                break;

            case 2:
                span.innerHTML = 'Changed file';
                pictures[0].style.display = 'none';
                pictures[1].style.display = 'block';
                pictures[2].style.display = 'none';
                break;

            case 1:
                span.innerHTML = 'Original file';
                pictures[0].style.display = 'block';
                pictures[1].style.display = 'none';
                pictures[2].style.display = 'none';
                break;
        }
    }

    async function compareImages() {
        const imgsMeta = document.querySelector("div[data-type='diff']");
        const imgs = [
            imgsMeta.getAttribute('data-file1'),
            imgsMeta.getAttribute('data-file2')
        ];
        console.log("imgs", imgs);

        const label = document.createElement('label');
        label.classList.add('warpech-sliderControl');
        const input = document.createElement('input');
        input.id = 'thisPluginsInput';
        input.setAttribute('type', 'range');
        input.setAttribute('min', '1');
        input.setAttribute('max', '3');
        input.setAttribute('value', '3');
        input.addEventListener('input', (ev) => {
            setMode(input, span);
        });
        const span = document.createElement('span');
        label.appendChild(input);
        label.appendChild(span);
        document.body.appendChild(label);

        const sliderElem = document.createElement('div');
        sliderElem.classList.add('warpech-slider');
        document.body.appendChild(sliderElem);

        if (!imgs[0]) {
            throw new Error("Too early! The image does not have the src attribute");
        }

        const img1clone = document.createElement('img');
        img1clone.setAttribute('src',imgs[0]);
        sliderElem.appendChild(img1clone);

        const img2clone = document.createElement('img');
        img2clone.setAttribute('src',imgs[1]);
        sliderElem.appendChild(img2clone);

        const img1 = await fetchImage(imgs[0]);
        const img2 = await fetchImage(imgs[1]);

        const { width: w, height: h } = img1;

        const ctx = context2d(w, h, 1);
        ctx.drawImage(img1, 0, 0);
        const data1 = ctx.getImageData(0, 0, w, h).data;
        ctx.drawImage(img2, 0, 0);
        const data2 = ctx.getImageData(0, 0, w, h).data;
        const diff = ctx.createImageData(w, h);

        pixelmatch(data1, data2, diff.data, w, h, {});
        ctx.putImageData(diff, 0, 0);

        sliderElem.appendChild(ctx.canvas)

        setMode(input, span);
    }
    function fetchImage(src) {
        return new Promise((resolve, reject) => {
            const image = new Image;
            image.crossOrigin = "anonymous";
            image.src = src;
            image.onload = () => resolve(image);
            image.onerror = reject;
        });
    }

    function context2d(width, height, dpi) {
        if (dpi == null) dpi = devicePixelRatio;
        var canvas = document.createElement("canvas");
        canvas.width = width * dpi;
        canvas.height = height * dpi;
        // canvas.style.width = width + "px";
        var context = canvas.getContext("2d");
        context.scale(dpi, dpi);
        return context;
    }
    const styleNode = document.createElement("style");
    styleNode.innerHTML = `
.render-shell {
visibility: hidden;
}

.warpech-sliderControl {
display: flex;
align-items: center;
position: absolute;
right: 0;
z-index: 9;
background: #eaf5ff;
padding: 5px;
border-radius: 0 0 0 5px;
border-left: 1px solid rgba(27,31,35,.15);
border-bottom: 1px solid rgba(27,31,35,.15);
}

.warpech-sliderControl input {
width: 100px;
margin-right: 10px;
}

.warpech-sliderControl span {
width: 100px;
overflow: hidden;
}

.warpech-slider {
position: relative;
/*overflow: scroll;*/
}

.warpech-slider img,
.warpech-slider canvas {
position: absolute;
width: initial;
max-height: 700px;
}`;
    document.head.appendChild(styleNode);

    setTimeout(() => {
        compareImages();
    }, 500);

})();