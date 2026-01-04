// ==UserScript==
// @name         有道云笔记增强大师
// @namespace    rollup-react
// @version      0.0.6
// @description  有道云笔记网页版的增强优化
// @author       sunrui
// @include     https://note.youdao.com/web/*
// @grant       unsafeWindow
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/389578/%E6%9C%89%E9%81%93%E4%BA%91%E7%AC%94%E8%AE%B0%E5%A2%9E%E5%BC%BA%E5%A4%A7%E5%B8%88.user.js
// @updateURL https://update.greasyfork.org/scripts/389578/%E6%9C%89%E9%81%93%E4%BA%91%E7%AC%94%E8%AE%B0%E5%A2%9E%E5%BC%BA%E5%A4%A7%E5%B8%88.meta.js
// ==/UserScript==

'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/* eslint-disable no-restricted-properties */

var MoveListExpander = function MoveListExpander() {
  var _this = this;

  classCallCheck(this, MoveListExpander);

  this.insertInputBox = function () {
    var parentDom = document.querySelector('.file-selector-bd');
    var refDom = document.querySelector('.bd-selector-path');
    if (document.querySelectorAll('.tampermonkey-search').length > 0 || !parentDom || !refDom) return;
    var input = document.createElement('input');
    input.style.borderTop = 'none';
    input.style.borderLeft = 'none';
    input.style.borderRight = 'none';
    input.style.width = '100%';
    input.style.padding = '0';
    input.className = 'tampermonkey-search';
    input.onkeyup = _this.handleKeyUp;
    parentDom.insertBefore(input, refDom);
    _this.inputDom = input;
  };

  this.runWithInterval = function (interval) {
    setTimeout(function () {
      _this.insertInputBox();
      var expandableDoms = document.querySelectorAll('.file-selector-bd div.expandable:not(.expanded) > div.toggle');
      if (_this.inputDom) {
        _this.searchInDom(_this.inputDom.value);
      }
      if (expandableDoms.length > 0) {
        expandableDoms.forEach(function (v) {
          v.click();
        });
        _this.runWithInterval(500);
      } else {
        _this.runWithInterval(3000);
      }
    }, interval);
  };

  this.handleKeyUp = function (e) {
    var input = e.currentTarget.value.toLowerCase();
    _this.searchInDom(input);
  };

  this.searchInDom = function (searchWord) {
    var allLeaves = document.querySelectorAll('.file-selector-bd div.tree-title');
    allLeaves.forEach(function (leaf) {
      if (leaf.innerText && leaf.innerText.toLowerCase().indexOf(searchWord) >= 0) {
        leaf.style.display = '';
      } else {
        leaf.style.display = 'none';
      }
    });
  };

  console.log('移动笔记增强功能已启动.');
};

var MarkdownViewerPlugin = function MarkdownViewerPlugin() {
  var _this = this;

  classCallCheck(this, MarkdownViewerPlugin);
  this.active = false;
  this.iframe = null;

  this.handleIframeOnload = function () {
    var iframe = document.querySelector('#mdEditor');
    document.querySelector('.content-container .loading-style').setAttribute('hidden', null);
    iframe.removeAttribute('hidden');
  };

  this.switchToView = function () {
    var iframe = document.querySelector('#mdEditor');
    iframe.setAttribute('hidden', null);
    iframe.src = iframe.src;
    document.querySelector('.content-container .loading-style').removeAttribute('hidden');
    if (!iframe.onload) {
      iframe.onload = _this.handleIframeOnload;
    }
  };

  this.insertViewButton = function () {
    var parentDom = document.querySelector('.file-detail .hd');
    var refDom = document.querySelector('.file-detail .btn-wrap');
    if (!parentDom || !refDom) {
      return;
    }
    if (document.querySelectorAll('.tampermonkey-view').length > 0 || !parentDom || !refDom) return;
    var btnSwitchToView = document.createElement('div');
    btnSwitchToView.innerText = '查看';
    btnSwitchToView.className = 'hd-btn tampermonkey-view';
    btnSwitchToView.onclick = _this.switchToView;
    parentDom.insertBefore(btnSwitchToView, refDom);
  };

  this.removeButton = function () {
    document.querySelectorAll('.tampermonkey-view').forEach(function (button) {
      button.remove();
    });
  };

  this.detect = function () {
    _this.iframe = document.querySelector('#mdEditor');
    var currentActive = _this.iframe != null;
    if (!_this.active && currentActive) {
      console.log('检测到markdonw编辑状态');
    }
    if (_this.active && !currentActive) {
      console.log('退出markdonw编辑状态');
    }
    _this.active = currentActive;
    if (_this.active) {
      // 检测当前是不是编辑状态
      var iframeDoc = _this.iframe.contentDocument;
      if (iframeDoc && iframeDoc.querySelector('body') && iframeDoc.querySelector('body').getAttribute('data-mode') === 'edit') {
        _this.insertViewButton();
      } else {
        _this.removeButton();
      }
    }
    setTimeout(function () {
      _this.detect();
    }, 300);
  };

  console.log('Markdown增强插件启动.');
};

var TagPlugin = function TagPlugin() {
  var _this = this;

  classCallCheck(this, TagPlugin);
  this.currentIndex = -1;
  this.currentLabel = '';

  this.detect = function () {
    return;
    setInterval(function () {
      var fileTagCtl = document.querySelector('div.tools-item .tag-icon');
      var fileTags = document.querySelectorAll('.file-tag');
      if (fileTags.length > 0) {
        return;
      }
      if (fileTagCtl) {
        fileTagCtl.click();
      }
    }, 1000);
    $(document).delegate('.tag-add-container input', 'keydown', function (event) {
      var list = document.querySelectorAll('.tag-candidate-list .tag-candidate');
      if (list[_this.currentIndex] && list[_this.currentIndex].hasAttribute('style')) {
        list[_this.currentIndex].removeAttribute('style');
      }
      switch (event.key) {
        case 'ArrowDown':
          if (_this.currentIndex >= list.length - 1) {
            _this.currentIndex = list.length - 1;
          } else {
            _this.currentIndex += 1;
          }
          _this.currentLabel = list[_this.currentIndex].getAttribute('title');
          event.currentTarget.value = _this.currentLabel;
          break;
        case 'ArrowUp':
          if (_this.currentIndex <= 0) {
            _this.currentIndex = 0;
          } else {
            _this.currentIndex -= 1;
          }
          _this.currentLabel = list[_this.currentIndex].getAttribute('title');
          event.currentTarget.value = _this.currentLabel;
          break;
        case 'Tab':
          if (_this.currentIndex < 0) {
            return;
          }
          list[_this.currentIndex].click();
          event.currentTarget.value = _this.currentLabel;
          _this.currentIndex = -1;
          event.preventDefault();
          event.stopPropagation();
          break;
        default:
          _this.currentIndex = -1;
          break;
      }
      if (list[_this.currentIndex]) {
        list[_this.currentIndex].setAttribute('style', 'color: #fff;background:#398dee;');
      }
    });
  };

  console.log('TagPlugin is running.');
};

var EventMng = function EventMng() {
  var _this = this;

  classCallCheck(this, EventMng);
  this.stateCallbacks = {};
  this.detectors = [];
  this.plugins = [];

  this.monitorState = function () {
    setInterval(function () {
      _this.detectAll();
    }, 1000);
  };

  this.detectAll = function () {
    var dets = _this.detectors;
    for (var i = 0; i < dets.length; i += 1) {
      var det = dets[i];
      det(_this.trigger);
    }
  };

  this.on = function (eventType, cb) {
    if (_this.stateCallbacks[eventType]) {
      _this.stateCallbacks[eventType].push(cb);
    } else {
      _this.stateCallbacks[eventType] = [cb];
    }
  };

  this.use = function (eventPlugin) {
    if (eventPlugin && eventPlugin.version > 0) {
      _this.on(eventPlugin.eventType, eventPlugin.action);
      _this.detectors.push(eventPlugin.detect);
    }
  };

  this.trigger = function (stateType) {
    for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    console.log('[StateEvent] ' + stateType + ' is triggered.');
    var callbacks = _this.stateCallbacks[stateType];
    for (var i = 0; i < callbacks.length; i += 1) {
      var cb = callbacks[i];
      cb.apply(undefined, params);
    }
  };

  console.log('状态管理上线...');
  this.monitorState();
};

var FakeLoadingEvent = function FakeLoadingEvent() {
  var _this = this;

  classCallCheck(this, FakeLoadingEvent);
  this.version = 1;
  this.eventType = 'fake-loading';

  this.action = function (notePoint, loadingGif) {
    setTimeout(function () {
      notePoint.removeAttribute('hidden');
      loadingGif.setAttribute('hidden', null);
    }, 2000);
  };

  this.detect = function (trigger) {
    var notePoint = document.querySelector('.note-detail .detail-bd');
    if (!notePoint) return;
    var loadingGif = document.querySelector('.content-container .loading-style');
    if (!loadingGif) return;
    if (notePoint.hasAttribute('hidden') && !loadingGif.hasAttribute('hidden')) {
      trigger(_this.eventType, notePoint, loadingGif);
    }
  };

  console.log('FakeLoadingEvent monitor start..');
};

FakeLoadingEvent.new = function () {
  return new FakeLoadingEvent();
};

var Runner = function Runner() {
  classCallCheck(this, Runner);

  this.run = function () {
    var eventMng = new EventMng();
    eventMng.use(FakeLoadingEvent.new());
    new MoveListExpander().runWithInterval(1000);
    new MarkdownViewerPlugin().detect();
    new TagPlugin().detect();
  };
};

// eslint-disable-next-line


(function () {

  var runner = new Runner();
  runner.run();
  // eslint-disable-next-line
})();
