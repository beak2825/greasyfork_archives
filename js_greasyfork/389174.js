// ==UserScript==
// @name           YT: peek-a-pic
// @description    Hover a thumbnail at its bottom part and move the mouse horizontally to view the actual screenshots from the video
// @version        1.2.1
//
// @match          https://www.youtube.com/*
//
// @noframes
// @grant          none
// @run-at         document-start
//
// @author         wOxxOm
// @namespace      wOxxOm.scripts
// @license        MIT License
// @downloadURL https://update.greasyfork.org/scripts/389174/YT%3A%20peek-a-pic.user.js
// @updateURL https://update.greasyfork.org/scripts/389174/YT%3A%20peek-a-pic.meta.js
// ==/UserScript==

'use strict';

const ME = 'yt-peek-a-pic-storyboard';
const THUMB = ['yt-thumbnail-view-model', 'ytd-thumbnail'];
const START_DELAY = 50; // ms
const HOVER_DELAY = 250; // ms
const HEIGHT_PCT = 25;
const HEIGHT_HOVER_THRESHOLD = 1 - HEIGHT_PCT / 100;
const POPOVER = 'popover' in HTMLElement.prototype;
const requests = {};
const imageReqs = {};
/** @type {Map<HTMLElement,Object|Storyboard>} */
const registry = new WeakMap();
const getVideoId = (el, deep) =>
  (deep ? el = el.querySelector('a[href*="?v="], img[src*="ytimg.com/vi"]') : el) &&
  (el = (el.search || el.src).match(/(?:\?v=|\/vi\w*\/)([^&/]+)/)) &&
  el[1];
let API_DATA, API_URL;

//#region Styles
const STYLE_MAIN = /*language=CSS*/ important(`
  .${ME} {
    height: ${HEIGHT_PCT}%;
    max-height: 90px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #0006;
    pointer-events: none;
    transition: opacity ${HOVER_DELAY}ms ease;
    opacity: 0;
    z-index: 10000;
  }
  .ytp-suggestion-set:hover .${ME},
  :is(:is(${THUMB})):hover .${ME} {
    pointer-events: auto;
  }
  .${ME}:hover {
    opacity: 1;
  }
  .${ME}:hover::before {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: ${100 / HEIGHT_PCT * 100}%;
    content: "";
    pointer-events: none;
  }
  .${ME}[title] {
    height: ${HEIGHT_PCT / 3}%;
  }
  .${ME}[data-state]:hover::after {
    content: attr(data-state);
    position: absolute;
    font-weight: bold;
    color: #fff8;
    bottom: 4px;
    left: 4px;
  }
  .${ME} > * {
    pointer-events: none;
  }
  .${ME} main {
    position: absolute;
    bottom: 0;
    box-shadow: 2px 2px 10px 2px black;
    background-color: transparent;
    opacity: 0;
    transition: opacity .25s .25s ease;
  }
  .${ME} main[popover] {
    padding: 0;
    bottom: auto;
    inset: unset;
    border: none;
    overflow: hidden;
  }
  .${ME}:hover main {
    opacity: 1;
  }
  .${ME} div {
    background-origin: content-box;
    transform-origin: top left;
  }
  .${ME} span {
    position: absolute;
    width: 100%;
    height: 4px;
    bottom: 0;
  }
  .${ME} b {
    opacity: .5;
    color: #fff;
    background-color: #000;
    position: absolute;
    bottom: 4px;
    left: 4px;
    padding: 1px 3px;
  }`);
const STYLE_HOVER = /*language=CSS*/ important(`
  :is(${THUMB}):not(#\\0):hover a.ytd-thumbnail {
    opacity: .2;
    transition: opacity .75s .25s;
  }
  :is(${THUMB}):not(#\\0):hover::before {
    background-color: transparent;
  }`);
//#endregion

let /** @type {HTMLElement} */ ELEMENT;
let /** @type {HTMLElement|void} */ PP;
let /** @type {HTMLStyleElement} */ elStyle;
let /** @type {HTMLStyleElement} */ elStyleHover;

document.addEventListener('mouseover', event => {
  if (event.target.classList.contains(ME))
    return;
  for (const el of event.composedPath()) {
    let id = el.localName;
    if (THUMB.includes(id) ? id = getVideoId(el, true)
      : id === 'a' && el.classList.contains('ytp-suggestion-set') && (id = getVideoId(el))
    ) {
      let sb = registry.get(el);
      if (sb && sb.id !== id) {
        registry.delete(el);
        sb = null;
      }
      if (!sb) {
        setTimeout(start, START_DELAY, el);
        registry.set(el, {event, id});
        el.addEventListener('mousemove', trackThumbCursor, {passive: true});
      }
      return;
    }
  }
}, {
  passive: true,
  capture: true,
});

function start(thumb) {
  if (thumb.matches(':hover'))
    new Storyboard(thumb);
  else // mouse moved somewhere else
    registry.delete(thumb);
  thumb.removeEventListener('mousemove', trackThumbCursor);
}

function trackThumbCursor(event) {
  (registry.get(this) || {}).event = event;
}

class Storyboard {
  /**
   * @prop {HTMLElement} popup
   * @prop {HTMLElement} element
   * @prop {HTMLElement} thumb
   * @prop {HTMLElement} pic
   * @prop {HTMLElement} time
   * @prop {HTMLElement} pct
   */
  /** @param {HTMLElement} thumb */
  constructor(thumb) {
    const {event, id} = registry.get(thumb) || {};
    if (!id)
      return;
    /** @type {HTMLElement} */
    this.thumb = thumb;
    this.id = id;
    this.init(event);
  }

  /** @param {MouseEvent} event */
  async init(event) {
    const {thumb} = this;
    const y = event.pageY - thumb.offsetTop;
    const thH = thumb.offsetHeight;
    let inHotArea = y >= thH * HEIGHT_HOVER_THRESHOLD;
    const x = inHotArea && event.offsetX;

    const el = this.show();
    Storyboard.injectStyles();

    try {
      await this.fetchInfo();
      if (thumb.matches(':hover'))
        await this.prefetchImages(x);
    } catch (e) {
      el.dataset.state = typeof e === 'string' ? e : 'Error loading storyboard';
      setTimeout(Storyboard.destroy, 1000, thumb, el);
      console.debug(e);
      return;
    }

    el.addEventListener('mousemove', this);
    el.addEventListener('mouseleave', this);
    thumb.addEventListener('mouseleave', this);
    window.addEventListener('mouseleave', this);
    delete el.dataset.state;

    // recalculate as the mouse cursor may have left the area by now
    inHotArea = el.matches(':hover');
    const scale = POPOVER ? 1 : Math.min(1, thumb.offsetWidth / this.w, thH / this.h);
    this.popup.style = important(`
      width: ${this.w * scale}px;
      height: ${this.h * scale}px;
      transform: translate(0,0);
    `);
    this.pic.style = important(`
      width: ${this.w}px;
      height: ${this.h}px;
      ${POPOVER ? '' : `transform: scale(${Math.min(1, thumb.offsetWidth / this.w, thH / this.h)})`};
    `);
    if (inHotArea) {
      this.onmousemove(event);
    }
  }

  show() {
    let el = this.thumb.getElementsByClassName(ME)[0];
    if (el)
      el.remove();
    el = this.element = (ELEMENT || makeElement()).cloneNode(true);
    registry.set(el, this);
    [this.pic, this.time, this.pct] = (this.popup = el.firstChild).children;
    this.thumb.appendChild(el);
    return el;
  }

  /** @param {MouseEvent} e */
  handleEvent(e) {
    switch (e.type) {
      case 'mousemove': return this.onmousemove(e);
      case 'mouseleave': return this.onmouseleave(e);
    }
  }

  async prefetchImages(x) {
    this.thumb.addEventListener('mouseleave', Storyboard.stopPrefetch, {once: true});
    const hoveredPart = Math.floor(this.calcHoveredIndex(x) / this.partlen);
    await new Promise(resolve => {
      const resolveFirstLoaded = {resolve};
      const numParts = Math.ceil((this.len - 1) / (this.rows * this.cols)) | 0;
      for (let p = 0; p < numParts; p++) {
        const el = document.createElement('link');
        el.as = 'image';
        el.rel = 'prefetch';
        el.href = this.calcPartUrl((hoveredPart + p) % numParts);
        el.onload = Storyboard.onImagePrefetched;
        registry.set(el, resolveFirstLoaded);
        document.head.appendChild(el);
      }
    });
    this.thumb.removeEventListener('mouseleave', Storyboard.stopPrefetch);
  }

  async fetchInfo() {
    if (!API_DATA) {
      API_DATA = (window.wrappedJSObject || window).ytcfg.data_;
      API_URL = 'https://www.youtube.com/youtubei/v1/player?key=' + API_DATA.INNERTUBE_API_KEY;
    }
    const {id} = this;
    const info = await (requests[id] || (requests[id] = this.fetch()));
    delete requests[id];
    if (!info.storyboards)
      throw 'No storyboard in this video';
    const [sbUrl, ...specs] = info.storyboards.playerStoryboardSpecRenderer.spec.split('|');
    const lastSpec = specs.pop();
    const numSpecs = specs.length;
    const [w, h, len, rows, cols, ...rest] = lastSpec.split('#');
    const sigh = rest.pop();
    this.w = w | 0;
    this.h = h | 0;
    this.len = len | 0;
    this.rows = rows | 0;
    this.cols = cols | 0;
    this.partlen = rows * cols | 0;
    this.frac100 = len > 1 && (len - 2) / len;
    const u = new URL(sbUrl.replace('$L/$N', `${numSpecs}/M0`));
    u.searchParams.set('sigh', sigh);
    this.url = u.href;
    this.seconds = info.videoDetails.lengthSeconds | 0;
  }

  async fetch() {
    return (await fetch(API_URL, {
      body: JSON.stringify({
        videoId: this.id,
        context: API_DATA.INNERTUBE_CONTEXT,
      }), method: 'POST',
    })).json();
  }

  calcPartUrl(part) {
    return this.url.replace(/M\d+\.jpg\?/, `M${part}.jpg?`);
  }

  calcHoveredIndex(fraction) {
    const index = fraction * (this.len + 1) | 0;
    return Math.max(0, Math.min(index, this.len - 1));
  }

  calcTime(index) {
    const sec = index / (this.len - 1 || 1) * this.seconds | 0;
    const h = sec / 3600 | 0;
    const m = (sec / 60) % 60 | 0;
    const s = sec % 60 | 0;
    return `${h ? h + ':' : ''}${m < 10 && h ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }

  /** @param {MouseEvent} e */
  async onmousemove(e) {
    const sb = this;
    const el = sb.element;
    elStyleHover.disabled = false;
    importantProp(el, 'z-index', '11001'); // "YT: not interested in one click" + 1
    if (POPOVER && (!PP || PP !== this.popup)) {
      if (PP) PP.hidePopover();
      (PP = this.popup).showPopover();
      const b = el.getBoundingClientRect();
      importantProp(PP, 'top', `${b.bottom - sb.h + scrollY}px`);
      importantProp(PP, 'left', `${b.x + scrollX}px`);
    }
    const {pic} = sb;
    const {offsetX} = e;
    const thWidth = el.clientWidth;
    const frac = offsetX / thWidth;
    const i = sb.calcHoveredIndex(frac);
    const pct = Math.round(frac >= sb.frac100 ? 100 : frac * 100) + '%';
    const left = Math.max(0, Math.min(thWidth - sb.w, offsetX)).toFixed(0);
    const tx0 = sb.popup.style.transform;
    const tx = tx0.replace(/(translate)\(.+?\)/, `$1(${left}px,0)`);
    if (tx !== tx0)
      importantProp(sb.popup, 'transform', tx);
    if (pct !== /\d+%|$/.exec(sb.pct.style.background)[0])
      importantProp(sb.pct, 'background',
        `linear-gradient(to right,#888 ${pct},#444 calc(${pct} + 1px))`);

    if (i === sb.oldIndex)
      return;

    if (sb.seconds)
      sb.time.textContent = sb.calcTime(i);

    const part = i / sb.partlen | 0;
    if (!sb.oldIndex || part !== (sb.oldIndex / sb.partlen | 0)) {
      const url = sb.calcPartUrl(part);
      const req = imageReqs[url] || (imageReqs[url] = loadImage(url));
      if (req.then ? await req : req)
        importantProp(pic, 'background-image', `url(${url})`);
    }

    sb.oldIndex = i;
    const j = i % sb.partlen;
    const x = (j % sb.cols) * sb.w;
    const y = (j / sb.cols | 0) * sb.h;
    importantProp(pic, 'background-position', `-${x}px -${y}px`);
  }

  onmouseleave() {
    elStyleHover.disabled = true;
    if (PP) PP = PP.hidePopover();
  }

  static destroy(thumb, el) {
    el.remove();
    const sb = registry.get(thumb);
    if (!sb) return;
    registry.delete(thumb);
    elStyleHover.disabled = true;
    thumb.removeEventListener('mouseleave', sb);
    window.removeEventListener('mouseleave', sb);
  }

  static onImagePrefetched(e) {
    e.target.remove();
    const r = registry.get(e.target);
    if (r && r.resolve) {
      r.resolve();
      delete r.resolve;
    }
  }

  static stopPrefetch() {
    try {
      const {videoId} = this.data;
      const elements = document.head.querySelectorAll(`link[href*="/${videoId}/storyboard"]`);
      elements.forEach(el => el.remove());
      elements[0].onload();
    } catch (e) {}
  }

  static injectStyles() {
    elStyle = makeStyleElement(elStyle, STYLE_MAIN);
    elStyleHover = makeStyleElement(elStyleHover, STYLE_HOVER);
    elStyleHover.disabled = true;
  }
}

function important(str) {
  return str.replace(/;/g, '!important;');
}

function importantProp(el, name, value) {
  el.style.setProperty(name, value, 'important');
}

function loadImage(url) {
  return new Promise(resolve => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(imageReqs[url] = true);
    img.onerror = () => resolve(imageReqs[url] = false);
  });
}

function makeElement() {
  ELEMENT = document.createElement('div');
  ELEMENT.className = ME;
  ELEMENT.dataset.state = 'loading';
  const el = document.createElement('main');
  ELEMENT.appendChild(el).append(
    document.createElement('div'),
    document.createElement('b'),
    document.createElement('span'));
  if (POPOVER) el.popover = 'manual';
  return ELEMENT;
}

function makeStyleElement(el, css) {
  if (!el)
    el = document.createElement('style');
  if (el.textContent !== css)
    el.textContent = css;
  if (el.parentElement !== document.head)
    document.head.appendChild(el);
  return el;
}
