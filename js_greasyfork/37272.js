// ==UserScript==
// @name        Video AB Repeater
// @namespace   https://github.com/segabito/
// @description 動画のABリピート機能 ZenzaWatch用
// @match       *://www.nicovideo.jp/*
// @match       *://ext.nicovideo.jp/
// @match       *://ext.nicovideo.jp/#*
// @match       *://ch.nicovideo.jp/*
// @match       *://com.nicovideo.jp/*
// @match       *://commons.nicovideo.jp/*
// @match       *://dic.nicovideo.jp/*
// @exclude     *://ads*.nicovideo.jp/*
// @exclude     *://www.upload.nicovideo.jp/*
// @exclude     *://www.nicovideo.jp/watch/*?edit=*
// @exclude     *://ch.nicovideo.jp/tool/*
// @exclude     *://flapi.nicovideo.jp/*
// @exclude     *://dic.nicovideo.jp/p/*
// @include     *://www.youtube.com/*
// @version     0.0.7
// @grant       none
// @author      segabito macmoto
// @license     public domain
// @noframes
// @require        https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.1/fetch.js
// @downloadURL https://update.greasyfork.org/scripts/37272/Video%20AB%20Repeater.user.js
// @updateURL https://update.greasyfork.org/scripts/37272/Video%20AB%20Repeater.meta.js
// ==/UserScript==



(() => {
  const PRODUCT = 'Repeater';
  const monkey = function(PRODUCT) {
    const console = window.console;
    let ZenzaWatch = null;
    console.log(`exec ${PRODUCT}..`);

    const CONSTANT = {
      BASE_Z_INDEX: 150000
    };
    const product = {debug: {_const: CONSTANT}};
    window[PRODUCT] = product;

    const {util, Emitter} = (function() {
      const util = {};
      class Emitter {

        on(name, callback) {
          if (!this._events) { this._events = {}; }
          name = name.toLowerCase();
          if (!this._events[name]) {
            this._events[name] = [];
          }
          this._events[name].push(callback);
        }

        clear(name) {
          if (!this._events) { this._events = {}; }
          if (name) {
            this._events[name] = [];
          } else {
            this._events = {};
          }
        }

        emit(name) {
          if (!this._events) { this._events = {}; }
          name = name.toLowerCase();
          if (!this._events.hasOwnProperty(name)) { return; }
          const e = this._events[name];
          const arg = Array.prototype.slice.call(arguments, 1);
          for (let i =0, len = e.length; i < len; i++) {
            e[i].apply(null, arg);
          }
        }

        emitAsync(...args) {
          window.setTimeout(() => {
            this.emit(...args);
          }, 0);
        }
      }

      util.emitter = new Emitter();

      return {util, Emitter};
    })(PRODUCT);
    product.util = util;

    class BaseViewComponent extends Emitter {
      constructor({parentNode = null, name = '', template = '', shadow = '', css = ''}) {
        super();

        this._params = {parentNode, name, template, shadow, css};
        this._bound = {};
        this._state = {};
        this._props = {};
        this._elm = {};

        this._initDom({
          parentNode,
          name,
          template,
          shadow,
          css
        });
      }

      _initDom({parentNode, name, template, css = '', shadow = ''}) {
        let tplId = `${PRODUCT}${name}Template`;
        let tpl = document.getElementById(tplId);
        if (!tpl) {
          if (css) { util.addStyle(css, `${name}Style`); }
          tpl = document.createElement('template');
          tpl.innerHTML = template;
          tpl.id = tplId;
          document.body.appendChild(tpl);
        }
        const onClick = this._bound.onClick = this._onClick.bind(this);

        const view = document.importNode(tpl.content, true);
        this._view = view.querySelector('*') || document.createDocumentFragment();
        if (this._view) {
          this._view.addEventListener('click', onClick);
        }
        this.appendTo(parentNode);

        if (shadow) {
          this._attachShadow({host: this._view, name, shadow});
          if (!this._isDummyShadow) {
            this._shadow.addEventListener('click', onClick);
          }
        }
      }

      _attachShadow ({host, shadow, name, mode = 'open'}) {
        let tplId = `${PRODUCT}${name}Shadow`;
        let tpl = document.getElementById(tplId);
        if (!tpl) {
          tpl = document.createElement('template');
          tpl.innerHTML = shadow;
          tpl.id = tplId;
          document.body.appendChild(tpl);
        }

        if (!host.attachShadow && !host.createShadowRoot) {
          return this._fallbackNoneShadowDom({host, tpl, name});
        }

        const root = host.attachShadow ?
          host.attachShadow({mode}) : host.createShadowRoot();
        const node = document.importNode(tpl.content, true);
        root.appendChild(node);
        this._shadowRoot = root;
        this._shadow = root.querySelector('.root');
        this._isDummyShadow = false;
      }

      _fallbackNoneShadowDom({host, tpl, name}) {
        const node = document.importNode(tpl.content, true);
        const style = node.querySelector('style');
        style.remove();
        util.addStyle(style.innerHTML, `${name}Shadow`);
        host.appendChild(node);
        this._shadow = this._shadowRoot = host.querySelector('.root');
        this._isDummyShadow = true;
      }

      setState(key, val) {
        if (typeof key === 'string') {
          this._setState(key, val);
        }
        Object.keys(key).forEach(k => {
          this._setState(k, key[k]);
        });
      }

      _setState(key, val) {
        if (this._state[key] !== val) {
          this._state[key] = val;
          if (/^is(.*)$/.test(key))  {
            this.toggleClass(`is-${RegExp.$1}`, !!val);
          }
          this.emit('update', {key, val});
        }
      }

      _onClick(e) {
        const target = e.target.classList.contains('command') ?
          e.target : e.target.closest('.command');

        if (!target) { return; }

        const command = target.getAttribute('data-command');
        if (!command) { return; }
        const type  = target.getAttribute('data-type') || 'string';
        let param   = target.getAttribute('data-param');
        e.stopPropagation();
        e.preventDefault();
        param = this._parseParam(param, type);
        this._onCommand(command, param);
      }

      _parseParam(param, type) {
        switch (type) {
          case 'json':
          case 'bool':
          case 'number':
            param = JSON.parse(param);
            break;
        }
        return param;
      }

      appendTo(parentNode) {
        if (!parentNode) { return; }
        this._parentNode = parentNode;
        parentNode.appendChild(this._view);
      }

      _onCommand(command, param) {
        this.emit('command', command, param);
      }

      toggleClass(className, v) {
        (className || '').split(/ +/).forEach((c) => {
          if (this._view && this._view.classList) {
            this._view.classList.toggle(c, v);
          }
          if (this._shadow && this._shadow.classList) {
            this._shadow.classList.toggle(c, this._view.classList.contains(c));
          }
        });
      }

      addClass(name)    { this.toggleClass(name, true); }
      removeClass(name) { this.toggleClass(name, false); }
    }

    class RepeaterRange extends BaseViewComponent {
      constructor({parentNode, repeater}) {
        super({
          parentNode,
          name: 'VideoABRepeaterRange',
          shadow: RepeaterRange.__shadow__,
          template: '<div class="RepeaterRange"></div>',
          css: ''
        });

        this._a = -1;
        this._b = -1;
        this._repeater = repeater;
        repeater.on('range', () => {
          this.setA(repeater.getA());
          this.setB(repeater.getB());
          this.refresh();
        });
      }

      get _duration() {
        return this._repeater.duration;
      }

      setA(v) {
        this._a = v;
      }

      setB(v) {
        this._b = v;
      }

      _reset() {
        this._shadow.style.display = 'none';
        this._a = -1;
        this._b = -1;
      }

      onVideoChange() {
        this._reset();
      }

      _timeToPer(time) {
        return (time / Math.max(this._duration, 1)) * 100;
      }

      refresh() {
        this._shadow.style.display = this._b < 0 ? 'none': '';
        if (this._b < 0) {
          return;
        }
        const perLeft = (this._timeToPer(this._a));
        const scaleX = this._timeToPer(this._b - this._a) / 100;
        this._shadow.style.transform =
          `translate3d(${perLeft}%, 0, 0) scaleX(${scaleX})`;
        this._shadow.setAttribute('data-pos', `a: ${this._a}, b: ${this._b}`);
      }
    }

    RepeaterRange.__shadow__ = `
      <style>
        .root {
          pointer-events: none;
          position: absolute;
          width: 100vw;
          height: 100%;
          left: 0px;
          top: 0%;
          /*box-shadow: 0 0 6px #333 inset, 0 0 4px #333;*/
          z-index: 100;
          background: rgba(255, 255, 90, 0.5);
          transform-origin: left;
          transform: translate3d(0, 0, 0) scaleX(0);
          transition: transform 0.2s;
          outline: 2px solid orange;
        }

        :host-context(.zenzaStoryboardOpen) .VideoAPRepeaterRange {
          background: #ff9;
          mix-blend-mode: lighten;
          opacity: 0.5;
        }

      </style>
      <div class="VideoABRepeaterRange root"></div>
    `.trim();

    class ContextMenuButton extends BaseViewComponent {
      constructor({parentNode, repeater}) {
        super({
          parentNode,
          name: 'ContextMenuButton',
          shadow: ContextMenuButton.__shadow__,
          template: '<div class="ContextMenuButton"></div>',
          css: ''
        });
      }

      _initDom(...args) {
        super._initDom(...args);

        const root = this._shadowRoot;
        root.addEventListener('mousedown', e => {
          e.preventDefault(); e.stopPropagation();
        });
      }
    }

    ContextMenuButton.__shadow__ = `
      <style>
        .root {
          white-space: nowrap;
          display: flex;
        }

        :host-context(.zenzaStoryboardOpen) .VideoAPRepeaterRange {
          background: #ff9;
          mix-blend-mode: lighten;
          opacity: 0.5;
        }

        .controlButton {
          width: 33%;
          margin: 0;
          padding: 0;
          flex: 1;
          height: 48px;
          font-size: 24px;
          line-height: 46px;
          border: 1px solid;
          border-radius: 4px;
          color: #333;
          background: rgba(192, 192, 192, 0.95);
          cursor: pointer;
          transition: transform 0.1s, box-shadow 0.1s;
          box-shadow: 0 0 0;
          opacity: 1;
          margin: auto;
          font-family: 'Arial Black';
        }

        .controlButton:hover {
          transform: translate(0px, -4px);
          box-shadow: 0px 4px 2px #666;
        }

        .controlButton:active {
          transform: none;
          box-shadow: 0 0 0;
          border: 1px inset;
        }

        .controlButton .tooltip {
          display: none;
          pointer-events: none;
          position: absolute;
          left: 16px;
          top: -30px;
          transform:  translate(-50%, 0);
          font-size: 12px;
          line-height: 16px;
          padding: 2px 4px;
          border: 1px solid !000;
          background: #ffc;
          color: #000;
          text-shadow: none;
          white-space: nowrap;
          z-index: 100;
          opacity: 0.8;
        }

        :host-context(.is-mouseMoving) .controlButton:hover .tooltip {
          display: block;
          opacity: 1;
        }

      </style>
      <div class="root">
        <button class="controlButton command" data-command="setA">
          A
          <div class="tooltip">リピート開始点</div>
        </button>
        <button class="controlButton command" data-command="setB">
          B
          <div class="tooltip">リピート終了点</div>
        </button>
        <button class="controlButton command" data-command="reset">
          *
          <div class="tooltip">リピート解除</div>
        </button>
      </div>
    `.trim();




    const ZenzaDetector = (function() {
      let isReady = false;
      const emitter = new Emitter();

      const onZenzaReady = () => {
        isReady = true;
        ZenzaWatch = window.ZenzaWatch;

        emitter.emit('ready', window.ZenzaWatch);
      };

      if (window.ZenzaWatch && window.ZenzaWatch.ready) {
        window.console.log('ZenzaWatch is Ready');
        isReady = true;
      } else {
        document.body.addEventListener('ZenzaWatchInitialize', () => {
          window.console.log('ZenzaWatchInitialize');
          onZenzaReady();
        });
      }

      const detect = function() {
        return new Promise(res => {
          if (isReady) {
            return res(window.ZenzaWatch);
          }
          emitter.on('ready', () => {
            res(window.ZenzaWatch);
          });
        });
      };

      return {detect};
    })();


    class Repeater extends Emitter {
      constructor(params) {
        super();
        this._timer = null;
        this._videoTime = params.videoTime;
        this._notifier = params.notifier;
      }

      setA() {
        this._a = this.currentTime;
        if (this._b < this._a) {
          this._b = this.duration + 1;
        }
        this.notify('set "A"');
        this.emit('range');
        this.enable();
      }

      getA() {
        return this._a;
      }

      setB() {
        this._b = this.currentTime;
        if (this._b < this._a || this._a < 0) {
          this._a = Math.max(this._b - 30, 0);
        }
        this.emit('range');
        this.notify('set "B"');
        this.enable();
      }

      getB() {
        return this._b;
      }

      resetA() {
        this._a = -1;
        this.notify('reset "A"');
        this.emit('range');
      }

      resetB() {
        this._b = this.duration;
        this.notify('reset "B"');
        this.emit('range');
      }

      jumpToA() {
        this.currentTime = Math.max(this._a, 0);
      }

      _reset() {
        this._a = -1;
        this._b = -1;
        this.emit('range');
      }

      reset() {
        this._reset();
      }

      get currentTime() {
        return this._videoTime.get();
      }

      set currentTime(v) {
        this._videoTime.set(v);
      }

      get duration() {
        return this._videoTime.duration();
      }

      notify(msg) {
        this._notifier.notify(msg);
      }

      enable() {
        if (this._timer) { return; }
        console.info('start timer', this._timer, this._rate);
        this._timer = setInterval(this._onTimer.bind(this), 100);
      }

      disable() {
        clearInterval(this._timer);
        this._reset();
        this._timer = null;
      }

      onVideoChange() {
        this._reset();
      }

      _onTimer() {
        if (this._b < 0) { return; }
        if (this.currentTime > this._b) {
          this.currentTime = Math.max(this._a, 0);
        }
      }

    }

    const KeyEmitter = (() => {
      const emitter = new Emitter();

      const onKeyDown = e => {
        if (e.target.tagName === 'SELECT' ||
            e.target.tagName === 'INPUT' ||
            e.target.tagName === 'TEXTAREA') {
          return;
        }

        let keyCode = e.keyCode +
          (e.metaKey  ? 0x1000000 : 0) +
          (e.altKey   ? 0x100000  : 0) +
          (e.ctrlKey  ? 0x10000   : 0) +
          (e.shiftKey ? 0x1000    : 0);
        emitter.emit('keydown', keyCode);
      };

      const onKeyUp = e => {
        if (e.target.tagName === 'SELECT' ||
            e.target.tagName === 'INPUT' ||
            e.target.tagName === 'TEXTAREA') {
          return;
        }

        let keyCode = e.keyCode +
          (e.metaKey  ? 0x1000000 : 0) +
          (e.altKey   ? 0x100000  : 0) +
          (e.ctrlKey  ? 0x10000   : 0) +
          (e.shiftKey ? 0x1000    : 0);
        switch (keyCode) {
        }
        emitter.emit('keyup', keyCode);
      };

      let initialize = () => {
        initialize = () => {};
        document.body.addEventListener('keydown', onKeyDown);
        document.body.addEventListener('keyup', onKeyUp);
      };

      return {
        on: (...args) => { emitter.on(...args); },
        off: (...args) => { emitter.off(...args); },
        initialize
      };
    })();


    const initExternal = (repeater, range) => {
      product.external = {
        repeater
      };

      product.isReady = true;
      const ev = new CustomEvent(`${PRODUCT}Initialized`, { detail: { product } });
      document.body.dispatchEvent(ev);
    };

    const initKey = repeater => {
      KeyEmitter.initialize();

      KeyEmitter.on('keydown', code => {
        switch (code) {
          case 219: // [
            repeater.setA();
            //if (range) {
            //  range.setA(repeater.getA());
            //  range.setB(repeater.getB());
            //}
            break;
          case 221: // ]
            repeater.setB();
            //if (range) {
            //  range.setA(repeater.getA());
            //  range.setB(repeater.getB());
            //}
            break;
          case 219 + 0x1000:
            repeater.jumpToA();
            break;
          case 221 + 0x1000:
            repeater.reset();
            //if (range) {
            //  range.setA(repeater.getA());
            //  range.setB(repeater.getB());
            //}
            break;
        }
      });
    };

    const initNico = () => {
      let repeater, range, control;
      ZenzaDetector.detect().then(() => {
        const ZenzaWatch = window.ZenzaWatch;
        const videoTime = {
          get: () => {
            return ZenzaWatch.external.getVideoElement().currentTime;
          },
          set: (v) => {
            ZenzaWatch.external.getVideoElement().currentTime = v;
          },
          duration: () => {
            return ZenzaWatch.external.getVideoElement().duration;
          }
        };
        const notifier = {
          notify: msg => {
            //ZenzaWatch.external.execCommand('notify', msg);
          }
        };

        let dialog;
        ZenzaWatch.emitter.on('DialogPlayerOpen', () => {
          if (!dialog) {
            dialog = ZenzaWatch.debug.dialog;
            dialog.on('loadVideoInfo', () => {
              repeater.onVideoChange();
            });
          }
        });

        ZenzaWatch.emitter.on('DialogPlayerClose', () => {
          repeater.disable();
        });

        repeater = new Repeater({videoTime, notifier});

        ZenzaWatch.emitter.on('seekBar.addonMenuReady', container => {
          range = new RepeaterRange({parentNode: container, repeater});
          initKey(repeater, range);
          initExternal(repeater);
        });

        ZenzaWatch.emitter.on('videoContextMenu.addonMenuReady', (container, handler) => {
          control = new ContextMenuButton({parentNode: container});
          control.on('command', (command, param) => {
            switch(command) {
              case 'setA':
                repeater.setA();
                break;
              case 'setB':
                repeater.setB();
                break;
              case 'reset':
                repeater.reset();
                document.body.click();
                break;
            }
          });
        });

      });
    };

    const initTube = () => {
      let video = document.querySelector('video.html5-main-video');
      const getVideoElement = () => {
        if (!video) {
          video = document.querySelector('video.html5-main-video');
        }
        return video;
      };
      const videoTime = {
        get: () => {
          return getVideoElement().currentTime;
        },
        set: (v) => {
          getVideoElement().currentTime = v;
        },
        duration: () => {
          return getVideoElement().duration;
        }
      };

      const notifier = {
        notify: msg => {
          console.log('%c%s', 'background: lightgreen;', msg);
        }
      };
      let lastPath = location.pathname + location.search;

      let repeater = new Repeater({videoTime, notifier});
      initKey(repeater);

      const onUpdatePage = () => {
        if (lastPath !== location.pathname + location.search) {
          lastPath = location.pathname + location.search;

          repeater.onVideoChange();
        }
      };

      window.setInterval(onUpdatePage, 1000);
    };

    if (location.host.match(/^[a-z0-9_-]+\.nicovideo\.jp$/)) {
      initNico();
    } else if (location.host.match(/youtube\.com$/)) {
      initTube();
    }
  };

  (() => {
    const script = document.createElement('script');
    script.id = `${PRODUCT}Loader`;
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('charset', 'UTF-8');
    script.appendChild(document.createTextNode(
      `(${monkey})("${PRODUCT}");`
    ));
    document.body.appendChild(script);
  })();

})();
