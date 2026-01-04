// ==UserScript==
// @name            HWM_show_info
// @author          Мифист
// @namespace       Мифист
// @version         1.0.0
// @description     Подробная инфа артов/существ/навыков
// @match           https://www.heroeswm.ru/*
// @match           https://*.lordswm.com/*
// @exclude         */war.php*
// @exclude         */roulette.php*
// @run-at          document-end
// @grant           none
// @license         MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/491167/HWM_show_info.user.js
// @updateURL https://update.greasyfork.org/scripts/491167/HWM_show_info.meta.js
// ==/UserScript==

(function initModule(view) {
  'use strict';

  if (document.visibilityState === 'hidden') {
    const handler = () => initModule(view);
    document.addEventListener('visibilitychange', handler, { once: true });
    return;
  }

  if (document.readyState === 'loading') {
    const handler = () => initModule(view);
    document.addEventListener('DOMContentLoaded', handler, { once: true });
    return;
  }

  // ==========================

  const MODULE_NAME = 'HWM_show_info';
  const MODULE_VERSION = '1.0.0';

  const modules = (function(symbol) {
    return view[symbol] || (view[symbol] = {
      stack: new Map,
      has(key) { return this.stack.has(key); },
      delete(key) { return this.stack.delete(key); },
      get(key) { return this.stack.get(key); },
      add(key, version, exports) {
        if (this.stack.has(key)) return;
        this.stack.set(key, { version, exports });
      }
    });
  })(Symbol.for('__5781303__'));

  if (modules.has('HWM_auction_upd')) return;

  // ==========================

  let hideFrame = Function.prototype;
  const outerStyleSheet = document.createElement('style');

  const $ = (selector, ctx = document) => ctx.querySelector(selector);

  function fetch(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'document';

      xhr.onload = () => {
        if (xhr.status === 200) return resolve(xhr.response);
        reject(new Error(`Error status: ${xhr.status}`));
      };

      xhr.onerror = () => reject(new Error('ERR_INTERNET_DISCONNECTED'));

      xhr.send(null);
    });
  }

  // ==========================

  async function handleTarget(e) {
    const trg = e.target;
    const anchor = getElemAnchor(trg);

    if (!anchor) return;

    e.preventDefault();
    hideFrame();

    const self = InfoFrame.instances[anchor.flag];
    let data = self.cache.get(anchor.id);

    if (!document.contains(self.frame)) {
      if (!navigator.onLine) return onInternetDisconnect();
      await self.onConnect(self.getURL(anchor.id));
    }

    if (data == null) {
      data = await pullRequest(self, anchor.id);
      if (data == null) return;
    }

    self.setHide(trg);
    self.render(data);
    self.shell.classList.add('__shown');
    centerFrame(self, getClosestBlockElem(trg));

    if (self === ArmyInfo) self.initHints();
  }

  function onInternetDisconnect(err) {
    const msg = err ? err.message : 'ERR_INTERNET_DISCONNECTED';
    alert(`${msg}\nНет подключения к Интернету`);
  }

  function pullRequest(self, id) {
    return self.request(id)
      .then(data => self.cache.set(id, data).get(id))
      .catch(onInternetDisconnect);
  }

  // ==========================

  class InfoFrame {
    static __init__() {
      if (this !== InfoFrame) return;

      const instances = this.instances = [PerkInfo, ArtInfo, ArmyInfo];

      instances.forEach((self, ind) => {
        self.flag = ind;

        if (!$(self.selector)) return;

        self.cache = new Map;
        self.shell = document.createElement('div');
        self.frame = document.createElement('iframe');
        self.shell.classList.add(`${MODULE_NAME}-shell`);
        self.frame.classList.add(`${MODULE_NAME}-frame`);
      });

      if (instances.every(self => !self.hasOwnProperty('cache'))) return;

      outerStyleSheet.append(this.outerCSS);
      document.addEventListener('contextmenu', handleTarget);

      const destroyType = MODULE_NAME + '__destroy';
      const destroyHandler = this.__destroy__.bind(this);
      document.addEventListener(destroyType, destroyHandler, { once: true });

      modules.add(MODULE_NAME, MODULE_VERSION, this);
    }

    static __destroy__() {
      hideFrame();

      this.instances.splice(0).forEach(self => {
        if (!self.hasOwnProperty('cache')) return;
        self.cache.clear();
        self.shell.remove();
      });

      outerStyleSheet.remove();
      document.removeEventListener('contextmenu', handleTarget);
      modules.delete(MODULE_NAME);
    }

    static get outerCSS() {
      return /*css*/`
        .${MODULE_NAME}-shell {
          --w: 0;
          --h: 0;
          --x: 0;
          --y: 0;
          width: var(--w);
          height: var(--h);
          display: none;
          position: absolute;
          left: var(--x);
          top: var(--y);
          z-index: 100;
        }
        .${MODULE_NAME}-shell.__shown {
          display: block;
        }
        .${MODULE_NAME}-shell::before,
        .${MODULE_NAME}-shell::after {
          content: "";
          height: 5px;
          position: absolute;
          left: 0;
          right: 0;
          top: -5px;
        }
        .${MODULE_NAME}-shell::after {
          top: auto;
          bottom: -5px;
        }
        .${MODULE_NAME}-frame {
          width: 100%;
          height: 100%;
          display: block;
          border: none;
          outline: 2px solid #72787c;
          resize: none;
          overflow: hidden;
          user-select: none;
        }
        .hwm_hint_css,
        div[style^="z-index:1;top:0;right:0;"] {
          pointer-events: none;
        }
      `.replace(/^ +/gm, '');
    }

    static get frameView() {
      return this.frame.contentWindow;
    }

    static get frameDoc() {
      return this.frame.contentDocument;
    }

    static onConnect(url) {
      const {frame, shell} = this;

      if (!document.contains(outerStyleSheet)) {
        document.head.append(outerStyleSheet);
      }

      frame.src = url;
      shell.append(frame);
      document.body.prepend(shell);

      return new Promise(resolve => {
        frame.onload = () => {
          this.onFrameLoad();
          resolve();
        };
      });
    }

    static onFrameLoad() {
      const {frame, frameView, frameDoc} = this;
      const target = this.target = frameDoc.createElement('div');
      target.id = 'cont';

      clearAsyncQueue(frameView);
      frameView.setTimeout(() => clearAsyncQueue(frameView), 200);

      frameView.addEventListener('error', (e) => {
        console.log(e);
        alert(`@${MODULE_NAME} => ${this.name}:\n${e.message}`);
        if (this === ArmyInfo) this.shell.remove();
      });

      frameDoc.head.innerHTML = /*html*/`
        <base target="_parent">
        <style>${this.innerCCS}</style>
      `;
      frameDoc.body.replaceChildren(target);
    }

    static onFrameHide() {}

    static setHide(trg) {
      const {frame, shell, frameDoc} = this;

      const onKeyUp = (e) => void (e.key === 'Escape' && hide());

      const hide = hideFrame = () => {
        toggleHandlers(false);
        shell.classList.remove('__shown');
        shell.removeAttribute('style');
        hideFrame = Function.prototype;
        this.onFrameHide();
      };

      toggleHandlers(true);

      function toggleHandlers(force) {
        const method = (force ? 'add' : 'remove') + 'EventListener';
        document[method]('click', hide);
        document[method]('keyup', onKeyUp);
        frameDoc[method]('keyup', onKeyUp);
        shell[method]('mouseleave', hide);
        trg[method]('mouseleave', leave);
        trg[method]('click', preventClick, true);
      }

      function leave({type, relatedTarget}) {
        this.removeEventListener(type, leave);
        if (relatedTarget && !relatedTarget.contains(frame)) hide();
      }

      function preventClick(e) {
        e.preventDefault();
        e.stopPropagation();
        hide();
      }
    }

    static render(html) {
      this.target.innerHTML = html;
    }
  }

  // ==========================

  class PerkInfo extends InfoFrame {
    static get innerCCS() {
      return /*css*/`
        * {
          font-family: inherit;
          font-size: inherit;
          box-sizing: border-box;
        }
        :root {
          font-size: 10px;
        }
        body {
          font-family: Verdana, Arial, sans-serif;
          font-size: 1.3rem;
          line-height: 1.3;
          margin: 0;
          background-image: linear-gradient(45deg, #cdc9c0, #fff);
          overflow: hidden;
          user-select: none;
        }
        #cont {
          width: 60rem;
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: flex-start;
          padding: 1rem;
        }
        #cont > h1 {
          font-size: 1.1em;
          width: 100%;
          margin: 0 0 1rem;
          color: #435970;
          text-transform: uppercase;
        }
        #cont > div {
          flex: 1;
          padding-left: 1rem;
        }
      `.replace(/^ +/gm, '');
    }

    static get selector() {
      return 'a[href*="showperkinfo."]';
    }

    static getURL(id) {
      return `/showperkinfo.php?name=${id}`;
    }

    static getItemId(el) {
      return new URLSearchParams(el.search).get('name');
    }

    static async request(id) {
      const responseDoc = await fetch(this.getURL(id));
      const img = $('img[src*="/perks/"]', responseDoc);
      let elem = img && img.closest('td');
      elem = elem && elem.nextElementSibling;

      if (!elem) return '';

      return /*html*/`
        <h1>${img.alt.slice(7)}</h1>
        <img src="${img.src}">
        <div>${elem.innerHTML.slice(20)}</div>
      `;
    }
  }

  // ==========================

  class ArtInfo extends InfoFrame {
    static get innerCCS() {
      return /*css*/`
        * {
          font-family: inherit;
          font-size: inherit;
          box-sizing: border-box;
        }
        :root {
          font-size: 10px;
        }
        body {
          font-family: Verdana, Arial, sans-serif;
          font-size: 1.3rem;
          line-height: 1.3;
          margin: 0;
          background-image: linear-gradient(45deg, #cdc9c0, #fff);
          overflow: hidden;
          user-select: none;
        }
        #cont {
          width: 74rem;
          max-height: 42rem;
          display: flex;
          position: relative;
          overflow-y: auto;
          scrollbar-width: thin;
        }
        .global_container_block_header {
          font-size: 1.1em;
          position: absolute;
          right: 2rem;
          top: 1rem;
        }
        .global_container_block_header h1 {
          line-height: normal !important;
          text-transform: uppercase;
          margin: 0;
        }
        .global_container_block_header b {
          color: #435970;
        }
        .art_info_left_block {
          padding: 2rem 1rem;
        }
        .s_art_prop_amount_icon {
          min-height: 2.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0a2b4b;
          background-image: linear-gradient(#eee, #bbc4b1);
          border: 1px solid #78878d;
        }
        .s_art_prop_amount_icon:hover {
          filter: saturate(1.5);
        }
        .s_art_prop_amount_icon img {
          width: 2rem;
          margin-right: .5rem;
        }
        .cre_mon_image1 {
          display: none;
        }
        .art_info_desc {
          padding: 3rem 1rem 1rem;
          background: transparent !important;
        }
        .rs {
          margin: 0 2px;
        }
        b {
          color: #332f2f;
        }
        i {
          color: #315473;
        }
        a[href*="=40#"] {
          font-weight: bold;
          font-style: normal;
          text-decoration: none;
        }
      `.replace(/^ +/gm, '');
    }

    static get selector() {
      return location.pathname === '/inventory.php'
        ? '.inv_art_outside'
        : 'a[href*="art_info."]';
    }

    static getURL(id) {
      return `/art_info.php?id=${id}`;
    }

    static getItemId(el) {
      if (el.tagName === 'A') return new URLSearchParams(el.search).get('id');

      const imgPathReg = /\/artifacts\/([^.]+)/;
      const getArtName = (html) => html.match(imgPathReg)[1];
      const artName = getArtName(el.outerHTML);

      const {arts = []} = view;
      const art = arts.find(art => getArtName(art.html) === artName) || {};
      return art.art_id;
    }

    static async request(id) {
      const responseDoc = await fetch(this.getURL(id));
      const elem = $('#set_mobile_max_width', responseDoc);
      return elem ? elem.innerHTML : '';
    }
  }

  // ==========================

  class ArmyInfo extends InfoFrame {
    static get innerCCS() {
      return /*css*/`
        * {
          box-sizing: border-box;
        }
        :root {
          font-size: 10px;
        }
        body {
          font-family: Verdana, Arial, sans-serif;
          font-size: 1.2rem;
          margin: 0;
          background-image: linear-gradient(45deg, #dad1be, #fff);
          overflow: hidden;
          user-select: none;
        }
        .hwm_hint_css {
          font-size: inherit !important;
          max-width: 34rem !important;
          position: fixed;
          display: none;
          padding: .4em .7em;
          color: #ddd;
          background-color: #3a3a3a;
          border: 2px solid #888;
          z-index: 2;
        }
        #cont {
          width: 70rem;
          display: flex;
          flex-wrap: wrap;
        }
        .info_header_content {
          width: 100%;
          height: 3.5em;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #afc2d747;
          border-bottom: 1px solid #757575;
        }
        a:first-child {
          font-size: 1.6em;
          color: #506263;
          text-decoration: none;
        }
        .info_text_content {
          width: calc(100% - 20rem);
          display: flex;
          flex-wrap: wrap;
          border-right: 1px solid #757575;
        }
        .info_text_content > div {
          font-size: 1.1em;
          width: 50%;
          display: flex;
          align-items: center;
          column-gap: .5rem;
          padding: 0 1.4rem;
        }
        .info_text_content img {
          width: 2.4rem;
          height: auto;
        }
        .info_text_content div:last-child {
          margin-left: auto;
        }
        canvas,
        #show_army,
        .konvajs-content {
          width: 20rem !important;
          height: 20rem !important;
        }
        .army_info_skills {
          font-size: 1.1em;
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          column-gap: 0.4em;
          padding: 1rem 1.4rem;
          border-top: 1px solid #757575;
        }
        .army_info_skills > div {
          font-weight: bold;
          margin-right: -0.5em;
        }
        .army_info_skills > span:hover {
          color: brown;
          cursor: help;
        }
      `.replace(/^ +/gm, '');
    }

    static get selector() {
      return 'a[href*="army_info."]';
    }

    static getURL(id) {
      return `/army_info.php?name=${id}`;
    }

    static getItemId(el) {
      return new URLSearchParams(el.search).get('name');
    }

    static async request(id) {
      const responseDoc = await fetch(this.getURL(id));
      const linkHTML = `<a href="${this.getURL(id)}">$1</a>`;
      const html = $('.army_info', responseDoc).innerHTML.trim()
        .replaceAll('\n', '')
        .replace(/\s{2,}/g, ' ')
        .replace(' style="display: show;"', '')
        .replaceAll('> ', '>')
        .replaceAll(' width="48" height="48" alt="" title=""', '')
        .replace(/<div><h1 [^>]+>(.+?)<\/h1><\/div>/, linkHTML)
        .replace(/<div(?:><img| class="corner).+?div>/g, '')
        .replaceAll(' class="scroll_content_half"', '');

      const reg = /info\((.+?)\);/;
      const script = [...responseDoc.scripts].pop();
      const paramsStr = (script.text.match(reg) || ['', ''])[1];

      return [html, paramsStr];
    }

    static render([html, paramsStr]) {
      super.render(html);

      const {frameView} = this;
      const params = new Function(`return [${paramsStr}]`)();
      frameView.setTimeout(() => frameView.init_army_info(...params));
    }

    static onFrameLoad() {
      super.onFrameLoad();

      const {frameView, target} = this;
      const hwmHint = frameView.hwm_hint;

      if (!(hwmHint instanceof frameView.HTMLElement)) return;

      target.after(hwmHint);
    }

    static onFrameHide() {
      const {frameView: ctx} = this;
      const stages = ctx.Konva && ctx.Konva.stages || [];
      stages.splice(0).forEach(stage => ctx.clearInterval(stage.interval));
    }

    static initHints() {
      const initHwmHints = this.frameView.hwm_hints_init;
      if (typeof initHwmHints === 'function') initHwmHints();
    }
  }

  // ==========================

  InfoFrame.__init__();

  // ==========================

  function centerFrame({target, shell}, elem) {
    const {offsetHeight, offsetWidth} = target;
    const {left, right, top, bottom} = elem.getBoundingClientRect();
    const offset = 5;
    const halfw = offsetWidth / 2;
    const height = offsetHeight + offset;
    const maxX = document.documentElement.clientWidth - offset;
    const centerX = left + (right - left) / 2;

    const x = Math.max(offset, Math.min(centerX - halfw, maxX - offsetWidth));
    const y = (bottom + height < view.innerHeight || top - height <= 0)
      ? bottom + offset
      : top - height;

    const setCSS = shell.style.setProperty.bind(shell.style);
    setCSS('--w', `${offsetWidth >> 0}px`);
    setCSS('--h', `${offsetHeight >> 0}px`);
    setCSS('--x', `${x + view.scrollX >> 0}px`);
    setCSS('--y', `${y + view.scrollY >> 0}px`);
  }

  function getElemAnchor(el) {
    const propName = `__cachedInfoFrameAnchor`;
    if (el.hasOwnProperty(propName)) return el[propName];

    const set = (val = null) => (el[propName] = val);
    const artElem = el.closest(ArtInfo.selector);
    const perkElem = artElem ? null : el.closest(PerkInfo.selector);
    const elem = artElem || perkElem || el.closest(ArmyInfo.selector);

    if (!elem) return set();

    const self = perkElem ? PerkInfo : artElem ? ArtInfo : ArmyInfo;
    const id = self.getItemId(elem);

    return !id ? set() : set({ flag: self.flag, id });
  }

  function getClosestBlockElem(elem) {
    if (elem.offsetWidth && elem.offsetHeight) return elem;
    return getClosestBlockElem(elem.parentNode);
  }

  function clearAsyncQueue(ctx) {
    let i = ctx.setTimeout(0);
    while (i) ctx.clearTimeout(i--);
  }
})(document.defaultView);