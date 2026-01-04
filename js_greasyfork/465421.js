// ==UserScript==
// @name         Vanilla JS Dialog
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  A general purpose JavaScript class for Dialog Creation in Vanilla JS.
// @author       CY Fung
// @grant        none
// @license      MIT
// ==/UserScript==
/*

MIT License

Copyright (c) 2023 cyfung1031

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
/* version: 0.1.2 */
const VanillaJSDialog = (function pluginVanillaJSDialog() {
  'strict';

  const _themeProps_ = {
    dialogBackgroundColor: '#f6f6f6',
    dialogBackgroundColorDark: '#23252a',
    backdropColor: '#b5b5b568',
    textColor: '#343434',
    textColorDark: '#f0f3f4',
    zIndex: 60000,
    fontSize: '10pt',
    dialogMinWidth: '320px',
    dialogMinHeight: '240px',

  };


  /* https://www.freeformatter.com/css-beautifier.html */
  const _cssForThemeProps_ = ($) =>
    `
    .vjsd-dialog {
      --vjsd-font-family: "Inter var", ui-sans-serif, system-ui, -apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      --vjsd-dialog-background-color: ${$.dialogBackgroundColor};
      --vjsd-dialog-text-color: ${$.textColor};
      --vjsd-dialog-border-color: #747474;
      --vjsd-inputable-background-color: #fcfcfc;
      --vjsd-inputable-text-color: ${$.textColor};
      --vjsd-inputable-outline-color: #959494;
      --vjsd-inputable-focus-outline-color: #212121;
      --vjsd-button-background-color: #FFFFFF;
      --vjsd-button-border-color: #959494;
      --vjsd-button-text-color: #111827;
      --vjsd-button-hover-background-color: rgb(249, 250, 251);
      --vjsd-button-hover-border-color: #212121;
    }
    
    .vjsd-dialog.vjsd-dark {
      --vjsd-dialog-background-color: ${$.dialogBackgroundColorDark};
      --vjsd-dialog-text-color: ${$.textColorDark};
      --vjsd-dialog-border-color: #878787;
      --vjsd-inputable-background-color: #181a1e;
      --vjsd-inputable-text-color: ${$.textColorDark};
      --vjsd-inputable-outline-color: #757576;
      --vjsd-inputable-focus-outline-color: #a7a5a5;
      --vjsd-button-background-color: #21262d;
      --vjsd-button-border-color: #6a6a6a;
      --vjsd-button-text-color: #c9d1d9;
      --vjsd-button-hover-background-color: #30363d;
      --vjsd-button-hover-border-color: #8b949e;
    }
    
    .vjsd-dialog * {
      overscroll-behavior: inherit;
    }
    
    .vjsd-overscroll-none {
      overscroll-behavior: none;
    }
    
    .vjsd-overscroll-contain {
      overscroll-behavior: contain;
    }
    
    .vjsd-overscroll-auto {
      overscroll-behavior: auto;
    }
    
    .vjsd-dialog {
      font-family: var(--vjsd-font-family);
      font-size: ${$.fontSize};
      display: none;
      flex-direction: column;
      position: fixed;
      pointer-events: all;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: ${$.zIndex};
      user-select: none;
      touch-action: none;
      border-radius: 12px;
      border: 1px solid var(--vjsd-dialog-border-color);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      background-color: var(--vjsd-dialog-background-color);
      color: var(--vjsd-dialog-text-color);
      contain: content;
    }
    
    .vjsd-dialog textarea,
    .vjsd-dialog input {
      font-family: var(--vjsd-font-family);
      border: 0;
      outline: 1px solid var(--vjsd-inputable-outline-color);
      border-radius: 3px;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0.18) !important;
      overflow: auto;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      resize: none;
      /* remove the resize handle on the bottom right */
      background-color: var(--vjsd-inputable-background-color);
      color: var(--vjsd-inputable-text-color);
      outline-color: var(--vjsd-inputable-outline-color);
    }
    
    .vjsd-dialog textarea:focus,
    .vjsd-dialog input:focus {
      outline-color: var(--vjsd-inputable-focus-outline-color);
      transition-duration: .1s;
    }
    
    .vjsd-title {
      padding: 4px 16px;
      text-decoration: none #D1D5DB solid;
      text-decoration-thickness: auto;
      font-weight: 700;
      letter-spacing: .6px;
    }
    
    .vjsd-dialog-visible {
      display: flex;
    }
    
    .vjsd-dialog-header {
      padding: 7px 12px;
    }
    
    .vjsd-dialog-body {
      padding: 7px 12px;
    }
    
    .vjsd-dialog-footer {
      padding: 7px 12px;
    }
    
    .vjsd-flex-fill {
      flex-grow: 1;
    }
    
    .vjsd-space {
      flex-grow: 1;
    }
    
    .vjsd-buttonicon {
      cursor: pointer;
      opacity: 0.85;
    }
    
    .vjsd-dialog-backdrop {
      background-color: ${$.backdropColor};
      contain: strict;
    }
    
    .vjsd-buttonicon:hover {
      opacity: 1.0;
    }
    
    .vjsd-icon {
      font-size: 180%;
      display: inline-flex;
    }
    
    .vjsd-button {
      display: inline-flex;
      background-color: var(--vjsd-button-background-color);
      border: 1px solid var(--vjsd-button-border-color);
      color: var(--vjsd-button-text-color);
      border-radius: .5em;
      box-sizing: border-box;
      font-family: var(--vjsd-font-family);
      font-size: 85%;
      font-weight: 600;
      padding: .66em .86em;
      text-align: center;
      text-decoration: none #D1D5DB solid;
      text-decoration-thickness: auto;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
    }
    
    .vjsd-button:hover {
      background-color: var(--vjsd-button-hover-background-color);
      border-color: var(--vjsd-button-hover-border-color);
      transition-duration: .1s;
    }
    
    .vjsd-button:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }
    
    .vjsd-button:focus-visible {
      box-shadow: none;
    }
    
    .vjsd-vflex {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .vjsd-dialog-footer.vjsd-hflex {
      column-gap: 8px;
    }
    
    .vjsd-hflex {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    
    .vjsd-dialog-backdrop {
      display: none;
      position: fixed;
      pointer-events: all;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      pointer-events: all;
      z-index: ${$.zIndex - 1};
      /* when modal active */
      touch-action: none;
      -webkit-overflow-scrolling: none;
      overflow: hidden;
      /* Other browsers */
      overscroll-behavior: none;
    }
    
    .vjsd-dialog-body {
      min-width: ${$.dialogMinWidth};
      min-height: ${$.dialogMinHeight};
    }
    
    .vjsd-dialog-body.vjsd-vflex {
      align-items: stretch;
    }
    
    .vjsd-dialog-backdrop.vjsd-backdrop-visible {
      display: flex;
    }
    
    label.vjsd-checkbox-label {
      font-weight: bold;
      line-height: 1.1;
      display: flex;
      flex-direction: row;
      gap: 0.5em;
      position: relative;
      z-index: 0;
    }
    
    label.vjsd-checkbox-label::after {
      /* avoid text seleciton */
      position: absolute;
      content: '';
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }
    
    input.vjsd-checkbox1 {
      -webkit-appearance: none;
      appearance: none;
      /*background-color: var(--vjsd-dialog-background-color);*/
      margin: 0;
      font: inherit;
      color: currentColor;
      width: 1.15em;
      height: 1.15em;
      border: 0.15em solid currentColor;
      border-radius: 0.15em;
      transform: translateY(-0.075em);
      display: grid;
      place-content: center;
      outline: none;
    }
    
    input.vjsd-checkbox1::before {
      content: "";
      width: 0.65em;
      height: 0.65em;
      transform: scale(0);
    }
    
    input.vjsd-checkbox1:checked::before {
      transform: scale(1);
    }
    
    
    input.vjsd-checkbox-tick::before {
      transform-origin: bottom left;
      transition: 80ms transform ease-in-out;
      box-shadow: inset 1em 1em currentColor;
      background-color: CanvasText;
      clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    }
    
    input.vjsd-checkbox-square::before {
      transition: 80ms transform ease-in-out;
      box-shadow: inset 1em 1em currentColor;
      border-radius: 4px;
    }
    
    input.vjsd-checkbox1.vjsd-checkbox-square:checked::before {
      transform: scale(0.9);
    }
    
    .vjsd-gap-1 {
      gap: 3px;
    }
    
    .vjsd-gap-2 {
      gap: 6px;
    }
    
    .vjsd-gap-3 {
      gap: 9px;
    }
    
    .vjsd-gap-4 {
      gap: 12px;
    }
    
    .vjsd-gap-5 {
      gap: 15px;
    }
    
    .sample-textbox {
      height: 300px;
    }
    
    html.vjsd-dialog-shown {
      --vjsd-prevent-scroll-pointer-events: none;
      --vjsd-prevent-scroll-overflow: hidden;
    }
    
    html,
    body {
      pointer-events: var(--vjsd-prevent-scroll-pointer-events) !important;
      overflow: var(--vjsd-prevent-scroll-overflow) !important;
    }
    
    html.vjsd-dialog-shown {
      --vjsd-page-background-filter: blur(4px);
      --vjsd-page-background-opacity: 0.4;
    }
    
    .vjsd-dialog-backdrop,
    .vjsd-dialog {
      --vjsd-page-background-filter: void;
      --vjsd-page-background-opacity: void;
    }
    
    body > * {
      filter: var(--vjsd-page-background-filter);
      opacity: calc(var(--vjsd-page-background-opacity) * 1.0);
    }
      `;



  /**
   * 
   * @typedef { (...args: HTMLElement[]) => void } onElementGenerated
   * 
   * */



  /*

  class Derived extends Base {
   
    constructor() {
      super();
      this.field = 1;
      console.log("Derived constructor:", this.field);
      this.field = 2;
    }
  }

  */

  // let __ceId__ =0;
  // const  __ceIdStore__ = new WeakMap();

  // This is just for common utils.
  class VanillaJSDialogMethods {
    constructor() {
      /**
       * @type {object} __widgets__ - store of widgets (private)
       */
      this.__widgets__ = {};

      this.esProxyHandler = {
        get(obj, prop) {
          const elm = obj[prop];
          if (elm instanceof HTMLElement) {
            return elm;
          }
          console.warn(`Element '${prop}' is not yet assigned.`);
          return null;
        }
      };
    }


    /**
     * @returns { Object.<string, (...args?: ( onElementGenerated|string|number)[])=>HTMLElement > }
     */
    get widgets() {
      return this.__widgets__
    };

    set widgets(newWidgets) {

      if ('prototype' in newWidgets) {
        // class
        newWidgets = new newWidgets;
      }

      // object
      Object.assign(this.__widgets__, newWidgets);

      return true;
    }

    /**
     * 
     * @param {HTMLElement} elm 
     * @param {string} parentSelector 
     * @param {string} childSelector 
     * @returns 
     */
    query(elm, parentSelector, childSelector) {
      return elm.closest(parentSelector).querySelector(childSelector)
    }

    /**
     * 
     * @param {HTMLElement} elm 
     * @param {string} parentSelector 
     * @param {string} childSelector 
     * @returns 
     */
    querys(elm, parentSelector, childSelector) {
      return elm.closest(parentSelector).querySelectorAll(childSelector)
    }

    /**
     * You might override it using userscript manager's css loader.
     * @param {...string} urls external url of the css file
     */
    importCSS(...urls) {
      /*

// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js#sha512=qTXRIMyZIFb8iQcfjXWCO8+M5Tbc38Qi5WzdPOYZHIlZpzBHG3L3by84BBBOiRGiEb7KKtAOAs5qYdUiZiQNNQ==
 
< script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js" integrity="sha512-qTXRIMyZIFb8iQcfjXWCO8+M5Tbc38Qi5WzdPOYZHIlZpzBHG3L3by84BBBOiRGiEb7KKtAOAs5qYdUiZiQNNQ==" crossorigin="anonymous" referrerpolicy="no-referrer" >< /script >

      */
      const elements = urls.map(url => {
        let elm = document.createElement('link');
        elm.setAttribute('rel', 'stylesheet');
        elm.setAttribute('href', url);
        if (url.includes('#')) {
          let idx1 = url.indexOf('#');
          let idx2 = url.indexOf('=', idx1);
          if (idx1 > 1 && idx2 === idx1 + 7) {
            let s = url.substring(idx1 + 1, idx2);
            switch (s) {
              case 'sha256':
              case 'sha384':
              case 'sha512':
                elm.setAttribute('integrity', `${s}-${url.substring(idx2 + 1)}`);
            }
          }
        }
        elm.setAttribute('crossorigin', 'anonymous');
        elm.setAttribute('referrerpolicy', 'no-referrer');
        // document.head.appendChild(elm);
        return elm;
      })
      document.head.append(...elements);
      return urls.length === 1 ? elements[0] : elements;

    }

    //  ceToString(){
    //   return `${__ceIdStore__.toString.call(this)} #${__ceIdStore__.get(this)}`;
    //  }
    /**
     * 
     * @param {string} tag 
     * @param {Object.<string, any?>} props 
     * @param {Object.<string, string?>} attrs 
     * @returns {HTMLElement}
     */
    ce(tag, props, attrs) {

      /** @type {HTMLElement} */
      const elm = (tag instanceof HTMLElement) ? elm :
        (typeof tag == 'string') ? document.createElement(tag) :
          console.assert(false, "argument invalid");

      if (props) Object.assign(elm, props);
      if (attrs) {
        for (const k of Object.keys(attrs)) {
          elm.setAttribute(k, attrs[k]);
        }
      }
      // __ceIdStore__.set(elm, ++__ceId__);
      // elm.toString = this.ceToString;
      return elm;
    }

    /**
     * 
     * @param {string} t 
     * @param {string} [id] 
     * @returns 
     */
    addCSS(t, id) {
      let styleElm = document.createElement('style');
      styleElm.textContent = t;
      if (id) styleElm.id = id;
      document.head.appendChild(styleElm);
      return styleElm;
    }

    randomInputId() {
      const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
      const resultArr = new Array(8);
      for (let i = 0; i < 8; i++) {
        resultArr[i] = chars.charAt(Math.floor(Math.random() * (i ? 36 : 26)));
      }
      return resultArr.join('');
    }

    /**
     *
     * @param {HTMLElement} elm
     * @param {Object.<string, string|number> | Function | any[]} args
     * @returns
     * */
    st(elm, ...args) {
      console.assert(elm instanceof HTMLElement, 'HTMLElement shall be required.');
      if (args.length === 0) return;
      if ('length' in args[0]) args = args[0];

      let f = null;
      for (const arg of args) {
        if (typeof arg == 'function') {
          f = arg;
        } else if (typeof arg == 'object') {
          const obj = arg;
          for (const k of Object.keys(obj)) {
            if (k in elm) {
              if (k === 'className' && elm[k].length > 0) obj[k] = `${elm[k]} ${obj[k]}`;
              elm[k] = obj[k];
            } else elm.setAttribute(k, obj[k]);
          }
        }
      }
      if (f instanceof Function) f(elm);

    }
  }

  const S = new VanillaJSDialogMethods();

  class VanillaJSDialog {
    // CAUTION: DO NOT CACHE ELEMENTS IN THE NESTED FUNCTIONS.
    constructor() {
      this.S = S;
      this.shown = false;

      /**
       * @type {Function | null} backdropClickHandler - the function handler for backdrop click
       */
      this.backdropClickHandler = null;
      this.backdrop = '';

      /** @type {Map<string, Function>} */
      this.clicks2 = new Map(); /* the string key is just an arbitrary id for the click handler */

      /** @type {Function?} */
      this.clickHandler = null;

      /** @type {VanillaJSDialog} */
      this._es_proxy_ = new Proxy({}, S.esProxyHandler);
      if (!S.firstDialogCreated) this.onFirstCreation();
      this.init();
      console.assert(this.es.dialog instanceof HTMLElement, 'es.dialog must be set.');

      if (this.clickHandler !== null) {
        this.es.dialog.addEventListener('click', this.clickHandler, true);
      }
      S.firstDialogCreated = true;
    }

    /** @returns {Object.<string, HTMLElement?>} */
    get es() {
      return this._es_proxy_;
    }

    onFirstCreation() {
      // TODO
    }

    init() {
      // TODO
    }

    get themeProps() {
      return _themeProps_;
    }

    get cssForThemeProps() {
      return _cssForThemeProps_;
    }
    themeSetup() {
      S.addCSS(this.cssForThemeProps(this.themeProps), 'vjsd-style');
    }

    onBeforeShow() {
      // TODO
    }
    onShow() {
      // TODO
    }

    show() {

      if (this.shown === true) return;
      if (this.onBeforeShow() === false) return;


      let { dialog } = this.es;
      dialog.classList.add('vjsd-dialog-visible');
      this.shown = true;


      if (this.backdrop === 'dismiss' || this.backdrop === 'block') {

        if (this.backdropClickHandler === null) {
          this.backdropClickHandler = () => {
            const shown = this.shown;
            if (shown && this.backdrop === 'dismiss') {
              this.dismiss();
            }
          };
        }

        if (!('backdrop' in this.es)) {
          const backdrop = S.ce('div', {
            className: 'vjsd-dialog-backdrop'
          });

          backdrop.setAttribute('__vjsd__', '');

          backdrop.addEventListener('click', this.backdropClickHandler, true);



          document.body.appendChild(backdrop);

          this.es.backdrop = backdrop;
        }

        document.documentElement.classList.add('vjsd-dialog-shown');
        this.es.backdrop.classList.add('vjsd-backdrop-visible');

      }

      dialog.classList.toggle('vjsd-dark', this.isDarkTheme());

      this.onShow();

    }

    onBeforeDismiss() {
      // TODO

    }
    onDismiss() {
      // TODO

    }

    dismiss() {

      if (this.shown) {

        if (this.onBeforeDismiss() === false) return;

        document.documentElement.classList.remove('vjsd-dialog-shown');
        const es = this.es;

        es.dialog.classList.remove('vjsd-dialog-visible');
        if ('backdrop' in es) {
          let backdrop = es.backdrop;
          if (backdrop instanceof HTMLElement && backdrop.classList.contains('vjsd-backdrop-visible')) {
            backdrop.classList.remove('vjsd-backdrop-visible');
          }
        }
        this.shown = false;
        this.onDismiss();
      }


    }

    isDarkTheme() {
      // TODO - shall be overrided
      return false;
    }

    createClickHandler() {
      const clicks2 = this.clicks2;
      return (evt) => {
        let evtTarget = ((evt || 0).target || 0);
        if (!(evtTarget instanceof HTMLElement)) return;
        let vjsdElement = evtTarget.closest('[vjsd-clickable]');
        if (vjsdElement instanceof HTMLElement) {
          let p = vjsdElement.getAttribute('vjsd-clickable');
          let f = clicks2.get(p);
          if (f instanceof Function) f(evt);
        }
      };
    }


    /**
     * 
     * @param {HTMLElement | string} elm
     * @param {Function} func
     * 
     * */
    clickable(elm, func) {
      if (typeof elm == 'string') {
        this.clicks2.set(elm, func);
      }
      if (this.clickHandler === null) this.clickHandler = this.createClickHandler();

    }



  };
  VanillaJSDialog.S = S;

  VanillaJSDialog.setup1 = function () {
    const S = this.S;

    S.widgets = {


      /**
       * [@Override] The user shall set a customized method to replace VJSD.icon for customization
       * @param {string} iconTag Icon Tag
       * @returns {VE} generated VE
       */
      icon(iconTag) {
        return S.ce('i', { className: 'vjsd-icon vjsd-icon-' + iconTag });
        // return  VJSD.iconBuilder(VJSD.ce('span', {className:'vjsd-icon'}), iconTag);
      },

      title(text, ...args) {
        const elm = S.ce('span', { className: 'vjsd-title', textContent: text });
        S.st(elm, args);
        return elm;
      },

      buttonIcon(iconTag, ...args) {
        const icon = S.widgets.icon(iconTag);
        icon.classList.add('vjsd-buttonicon');
        S.st(icon, args)
        return icon;
      },


      labeledCheckbox(className, text, f) {

        let elmLabel = S.ce('label', {
          className: 'vjsd-checkbox-label'
        });

        let elmInput = S.ce('input', {
          className
        }, {
          'type': 'checkbox'
        })

        elmLabel.append(elmInput, text + "")

        if (f instanceof Function) f(elmLabel, elmInput);

        return elmLabel;

      },

      labeledRadio(className, text, f) {

        let elmLabel = S.ce('label', {
          className: 'vjsd-checkbox-label'
        });

        let elmInput = S.ce('input', {
          className
        }, {
          'type': 'radio'
        });

        elmLabel.append(elmInput, text + "");

        if (f instanceof Function) f(elmLabel, elmInput);

        return elmLabel;
      },

      button(text, ...args) {
        let elm = S.ce('div', { className: 'vjsd-button', textContent: text });
        S.st(elm, args)
        return elm;
      },

      space() {
        return S.ce('div', { className: 'vjsd-space' });
      },

      span(text) {
        return S.ce('span', { className: 'vjsd-span', textContent: text });
      },

      inputText(f) {
        let elm = S.ce('input', { className: 'vjsd-input' }, {
          'type': 'text',
          id: S.randomInputId(),
          autocomplete: "off"
        });
        if (f instanceof Function) f(elm);
        return elm
      }

    };

  }

  VanillaJSDialog.VanillaJSDialogMethods = VanillaJSDialogMethods;

  // Export to external environment
  try { window.VanillaJSDialog = VanillaJSDialog; } catch (error) { /* for Greasemonkey */ }
  try { module.VanillaJSDialog = VanillaJSDialog; } catch (error) { /* for CommonJS */ }

  // module.exports = VanillaJSDialog
  return VanillaJSDialog;
})();
