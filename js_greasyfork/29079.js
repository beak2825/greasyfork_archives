// ==UserScript==
// @name                annotation-board
// @name:zh-CN          注释墙
// @description         allow you to add annotation after selected content and copy to clipboard and save to local server
// @description:zh-CN   选中内容后添加注释并复制到剪贴板, 同时在本地的服务其中新建一个副本, 参见 https://github.com/ezirmusitua/snippet-board
// @version             0.2.0
// @author              jferroal
// @license             GPL-3.0
// @require             https://greasyfork.org/scripts/31793-jmul/code/JMUL.js?version=209567
// @include             http://*
// @include             https://*
// @grant               GM_xmlhttpRequest
// @run-at              document-start
// @namespace           https://greasyfork.org/users/34556
// @downloadURL https://update.greasyfork.org/scripts/29079/annotation-board.user.js
// @updateURL https://update.greasyfork.org/scripts/29079/annotation-board.meta.js
// ==/UserScript==

(function e (t, n, r) { function s (o, u) { if (!n[o]) { if (!t[o]) { var a = typeof require === 'function' && require; if (!u && a) return a(o, !0); if (i) return i(o, !0); var f = new Error("Cannot find module '" + o + "'"); throw f.code = 'MODULE_NOT_FOUND', f } var l = n[o] = { exports: {} }; t[o][0].call(l.exports, function (e) { var n = t[o][1][e]; return s(n || e) }, l, l.exports, e, t, n, r) } return n[o].exports } var i = typeof require === 'function' && require; for (var o = 0; o < r.length; o++)s(r[o]); return s })({ 1: [function (require, module, exports) {
  const elements = require('./element');
  const request = require('./snippet.service');

  class AnnotationBoard {
    constructor () {
      this.request = request;
      this.container = new elements.Container();
      this.textarea = new elements.Textarea();
      this.saveBtn = new elements.Button();
      this.saveBtn.listenClick(() => {
        this.textarea.copyToClipboard();
        this.request.save({
          link: window.location.href,
          raw_content: this.textarea.value,
        });
        this.hide();
      });
      this.container.appendChild([this.textarea, this.saveBtn]);
      this.container.element.appendTo(document.body);
      this.isShowing = false;
    }

    show () {
      this.textarea.appendSelection();
      this.container.show();
      this.isShowing = true;
    }

    shouldShow () {
      const isEmptySelection = !!this.textarea.element.getSelection();
      return !this.isShowing && isEmptySelection;
    }

    hide () {
      this.isShowing = false;
      this.container.hide('display', 'none');
    }

    shouldHide (event) {
      const target = event && event.target;
      if (!target && this.isShowing) {
        return true;
      } else {
        const inContainer = elements.Container.isContainer(target.id);
        const inTextarea = elements.Textarea.isTextarea(target.id);
        const inButton = elements.Button.isButton(target.id);
        return !inContainer && !inTextarea && !inButton && this.isShowing;
      }
    }
  }

  module.exports = AnnotationBoard;
}, { './element': 2, './snippet.service': 4 }],
2: [function (require, module, exports) {
  const JMUL = window.JMUL || {};

  const AnnotationBoardId = {
    CONTAINER: 'annotation-container',
    TEXTAREA: 'annotation-textarea',
    BUTTON: 'annotation-button',
  };

  class BoardContainer {
    constructor () {
      this.element = new JMUL.Element('div');
      this.element.setId(AnnotationBoardId.CONTAINER);
      BoardContainer._initCss(this.element)
    }

    appendChild (children) {
      children.forEach((c) => {
        try {
          this.element.appendChild(c.element)
        } catch (er) {
          console.log(er);
        }
      });
    }

    show () {
      try {
        const pos = JMUL.Element.getSelectedPosition();
        this.element.setCss({
          display: 'flex',
          flexDirection: 'column',
          left: pos.x,
          top: pos.y,
        });
      } catch (err) {
        console.error(err);
      }
    }

    hide () {
      this.element.setCss({
        display: 'none',
      });
    }

    static isContainer (id) {
      return AnnotationBoardId.CONTAINER === id;
    }

    static _initCss (elem) {
      elem.setCss({
        display: 'none',
        fontFamily: 'Noto',
        border: '4px',
        boxShadow: '0px 3px 8px 1px rgba(0, 0, 0, 0.26)',
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.56)',
        padding: '16px 4px 8px 4px',
      });
    }
  }

  class BoardEdit {
    constructor () {
      this.element = JMUL.Decorator.selectable(new JMUL.Element('textarea'));
      this.element.setId(AnnotationBoardId.TEXTAREA);
      BoardEdit._initCss(this.element);
    }

    appendSelection () {
      const prevVal = this.element.value();
      const selectedText = this.element.getSelection();
      const newVal = (!!prevVal && (prevVal + '\n') || '') + '========' + '\n' + selectedText + '\n';
      this.element.setValue(newVal)
    }

    hide () {
      this.element.setStyle('display', 'none');
    }

    copyToClipboard () {
      this.element.copyToClipboard();
    }

    get value () {
      return this.element.value();
    }

    static isTextarea (id) {
      return AnnotationBoardId.TEXTAREA === id;
    }

    static _initCss (elem) {
      elem.setCss({
        fontFamily: 'Noto',
        width: '240px',
        height: '128px',
        backgroundColor: 'rgba(255, 255, 255, 0.87)',
        marginBottom: '8px',
        borderRadius: '4px',
        color: 'rgba(0, 0, 0, 0.76)',
        fontSize: '12px',
      });
    }
  }

  class BoardButton {
    constructor () {
      this.element = new JMUL.Element('button');
      this.element.setId(AnnotationBoardId.BUTTON);
      this.element.setInnerHTML('复制到剪贴板');
      BoardButton._initCss(this.element);
    }

    listenClick (fn) {
      this.element.listen('click', (e) => fn());
    }

    static isButton (id) {
      return AnnotationBoardId.BUTTON === id;
    }

    static _initCss (elem) {
      elem.setCss({
        fontFamily: 'Noto',
        border: 'none',
        borderRadius: '4px',
        height: '24px',
        backgroundColor: 'rgba(255, 255, 255, 0.87)',
        color: 'rgba(0, 0, 0, 0.76)',
        fontSize: '14px',
      });
    }
  }

  module.exports = {
    Container: BoardContainer,
    Textarea: BoardEdit,
    Button: BoardButton,
  };
}, {}],
3: [function (require, module, exports) {
  const AnnotationBoard = require('./annotation-board');

  (function () {
    const annotationBoard = new AnnotationBoard();
    bindEvent();
    function bindEvent () {
      window.addEventListener('mouseup', (event) => {
        handleMouseUp(event);
      }, false);
    }

    function handleMouseUp (event) {
      if (annotationBoard.shouldShow()) {
        annotationBoard.show();
      } else if (annotationBoard.shouldHide(event)) {
        annotationBoard.hide();
      }
    }
  })();
}, { './annotation-board': 1 }],
4: [function (require, module, exports) {
  const JMUL = window.JMUL || {};

  class SnippetService {
    constructor (host = 'http://127.0.0.1', port = 5000, _options = {}) {
      if (!SnippetService.instance) {
        this.host = host;
        this.port = port;
        this.options = _options;
        if (!this.options.headers) {
          this.options.headers = { 'Content-Type': 'application/json' };
        }
        SnippetService.instance = this;
      }
      return SnippetService.instance;
    }

    save (data) {
      const request = new JMUL.Request(this.options);
      request.setMethod('POST');
      request.setUrl(this.host + ':' + this.port.toString() + '/snippet/api/v0.1.0');
      request.setData(data);
      request.send();
    }
  }

  SnippetService.instance = undefined;

  module.exports = new SnippetService();
}, {}] }, {}, [3]);
