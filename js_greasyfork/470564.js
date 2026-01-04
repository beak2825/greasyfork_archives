// ==UserScript==
// @name         18comic漫画下载
// @namespace    https://github.com/eternalphane/Userscripts/
// @version      1.1.1
// @description  从18comic上下载cbz格式（整话阅读）或webp格式（分页阅读）的漫画
// @author       eternalphane
// @license      MIT
// @supportURL   https://github.com/eternalphane/UserScripts/issues
// @match        https://18comic.vip/photo/*
// @match        https://18comic.org/photo/*
// @match        https://jmcomic.me/photo/*
// @match        https://jmcomic1.me/photo/*
// @match        https://jm-comic1.art/photo/*
// @match        https://jm-comic2.art/photo/*
// @match        https://jm-comic3.art/photo/*
// @require      https://unpkg.com/jszip@3.9.1/dist/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/470564/18comic%E6%BC%AB%E7%94%BB%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/470564/18comic%E6%BC%AB%E7%94%BB%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
'use strict';

setTimeout(async () => {
    const ICON_DOWNLOAD = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1ODAgNTIwIj48cGF0aCBkPSJNNTI4IDI4OXEyMCAwIDM0IDE0dDE0IDM0djEyOHEwIDIwLTE0IDM0dC0zNCAxNEg0OHEtMjAgMC0zNC0xNFQwIDQ2NVYzMzdxMC0yMCAxNC0zNHQzNC0xNGg5MmwtNDYtNDZxLTIyLTIzLTEwLTUyLjV0NDQtMjkuNWg2NFY0OXEwLTIwIDE0LTM0dDM0LTE0aDk2cTIwIDAgMzQgMTR0MTQgMzR2MTEyaDY0cTMyIDAgNDQuNSAyOS41VDQ4MiAyNDNsLTQ2IDQ2aDkyem0tNDAwLTgwbDE2MCAxNjAgMTYwLTE2MEgzMzZWNDloLTk2djE2MEgxMjh6bTQwMCAyNTZWMzM3SDM4OGwtNjYgNjZxLTE0IDE0LTM0IDE0dC0zNC0xNGwtNjYtNjZINDh2MTI4aDQ4MHptLTgxLTQ3cS03LTctNy0xN3Q3LTE3cTctNyAxNy03dDE3IDdxNyA3IDcgMTd0LTcgMTdxLTcgNy0xNyA3dC0xNy03eiIvPjwvc3ZnPg==';
    const progress = new ProgressCircle;
    progress.hidden = true;
    document.body.appendChild(progress);
    for (const liPrev of document.querySelectorAll('li:not(.ph-active):has(a .fa-bookmark), li.ph-active:has(a .fa-heart)')) {
        const li = document.createElement('li');
        for (const attr of liPrev.attributes) {
            li.setAttribute(attr.name, attr.value);
        }
        const btn = document.createElement('a');
        btn.href = '#';
        const styles = [`background:url(${ICON_DOWNLOAD}) center / contain no-repeat`];
        if (liPrev.classList.contains('ph-active')) {
            styles.push('filter:invert(1)');
        }
        btn.innerHTML = `
<i class="far" style="${styles.join(';')}">&#xfeff;</i>
<span>下载</span>`;
        btn.addEventListener('click', async e => {
            e.preventDefault();
            btn.href = null;
            progress.hidden = false;
            progress.text = 'Downloading...';
            const selector = new URLSearchParams(location.search).get('read_mode') === 'read-by-page' ?
                '.owl-item .center img' :
                '.scramble-page img';
            const pages = [...document.querySelectorAll(selector)];
            progress.max = pages.length;
            const zip = new JSZip;
            await Promise.all(pages.map(async page => {
                try {
                    zip.file(...await download(page.dataset.original ?? page.dataset.src));
                } catch {}
                ++progress.value;
            }));
            progress.text = 'Compressing...';
            progress.value = 0;
            progress.max = 100;
            // TODO: Select output format? (cbz, cbt, pdf)
            btn.download = `${document.querySelector('.panel-heading .pull-left').textContent.trim()}.cbz`
            btn.href = URL.createObjectURL(await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 9 },
                mimeType: 'application/vnd.comicbook+zip'
            }, (meta) => progress.value = meta.percent));
            progress.hidden = true;
            setTimeout(() => btn.click(), 0);
        }, { once: true });
        li.appendChild(btn);
        liPrev.after(li);
    }
}, 0);

/**
 * @param {string} url
 */
const download = async url => {
    const filename = new URL(url).pathname.split('/').at(-1);
    const [id, ext] = filename.split('.');
    const img = new Image;
    img.src = URL.createObjectURL(await (await fetch(url)).blob());
    await new Promise((resolve, reject) => (img.onload = resolve, img.onerror = reject));
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const canvas = new OffscreenCanvas(w, h);
    const ctx = canvas.getContext('2d');
    // `aid`, `scramble_id` and `get_num` are both global variables
    if (url.includes('.gif') || aid < scramble_id) {
        ctx.drawImage(img, 0, 0);
    } else {
        const num = get_num(btoa(aid), btoa(id));
        const rem = h % num;
        const sh = Math.floor(h / num);
        let sy = h - rem - sh, dy = rem;
        ctx.drawImage(img, 0, sy, w, rem + sh, 0, 0, w, rem + sh);
        for (let i = 1; i < num; ++i) {
            ctx.drawImage(img, 0, sy -= sh, w, sh, 0, dy += sh, w, sh);
        }
    }
    URL.revokeObjectURL(img.src);
    // TODO: Select image type? Change quality?
    return [filename, await canvas.convertToBlob({
        type: {
            jpg: 'image/jpeg',
            png: 'image/png',
            webp: 'image/webp'
        }[ext],
        quality: 1
    })];
};

const template = document.createElement('template');
template.innerHTML = /* html */`
<style>
  #overlay {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    text-align: -moz-center;
    text-align: -webkit-center;
  }

  #card {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 1.5em 4em;
    border-radius: 0.5em;
    background: white;
  }

  #progress {
    position: relative;
    width: 15em;
    height: 15em;
    border-radius: 50%;
  }

  #indicator {
    transition: .5s;
  }

  #percentage {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    font-size: 1.8em;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%
  }

  #value {
    font-size: 1.8em;
  }
</style>

<div id="overlay">
  <div id="card">
    <div id="progress">
      <svg viewBox="0 0 72 72" stroke="#cccccc" stroke-width="5" fill="none">
        <circle cx="36" cy="36" r="32"/>
        <circle id="indicator" cx="36" cy="36" r="32" stroke="#4cc790"/>
      </svg>
      <div id="percentage">
        <p><span id="value"></span>%</p>
      </div>
    </div>
    <h2 id="text"></h2>
  </div>
</div>
`;

class ProgressCircle extends HTMLElement {
    static #attrs = /** @type {const} */ (['max', 'value', 'text', 'hidden']);

    #isReady = false;
    #isRenderScheduled = false;
    #max = 1;
    #value = 0;
    #text = '';
    /** @type {SVGCircleElement} */
    #elIndicator;
    /** @type {HTMLSpanElement} */
    #elValue;
    /** @type {HTMLHeadingElement} */
    #elText;

    static get observedAttributes() {
        return this.#attrs;
    }

    get max() {
        return this.#max;
    }

    set max(value) {
        this.#max = value;
        this.#render();
    }

    get value() {
        return this.#value;
    }

    set value(value) {
        this.#value = value;
        this.#render();
    }

    get text() {
        return this.#text;
    }

    set text(value) {
        this.#text = value;
        this.#elText.textContent = value;
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        if (!this.#isReady) {
            this.#init();
        }
        this.#render();
    }

    /**
     * @template {typeof ProgressCircle.observedAttributes[number]} P
     * @param {P} name
     * @param {ProgressCircle[P]} _oldValue
     * @param {ProgressCircle[P]} newValue
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        if ('hidden' === name) {
            null === newValue ?
                document.body.style.setProperty('overflow', 'hidden', 'important') :
                document.body.style.removeProperty('overflow');
        } else {
            this[name] = newValue;
        }
    }

    #init() {
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.#elIndicator = this.shadowRoot.getElementById('indicator');
        this.#elValue = this.shadowRoot.getElementById('value');
        this.#elText = this.shadowRoot.getElementById('text');
        this.#max = +(this.getAttribute('max') ?? this.#max);
        this.#value = +(this.getAttribute('value') ?? this.#value);
        this.text = this.getAttribute('text') ?? this.#text;
        this.#isReady = true;
    }

    #render() {
        if (!this.isConnected || !this.#isReady || this.hidden || this.#isRenderScheduled) {
            return;
        }
        this.#isRenderScheduled = true;
        requestAnimationFrame(() => {
            this.#elIndicator.pathLength.baseVal = this.#max;
            this.#elIndicator.style.strokeDasharray = this.#max;
            this.#elIndicator.style.strokeDashoffset = this.#max - this.#value;
            this.#elValue.textContent = Math.round(this.#value * 100 / this.#max);
            this.#isRenderScheduled = false;
        });
    }
}

customElements.define('progress-circle', ProgressCircle);
