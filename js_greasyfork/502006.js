// ==UserScript==
// @name        雀魂郊狼监听器
// @namespace   hyperzlib
// @license     AGPL-3.0
// @match       https://game.maj-soul.com/*
// @match       https://mahjongsoul.game.yo-star.com/*
// @match       https://game.mahjongsoul.com/*
// @grant       none
// @version     1.0.4
// @author      https://github.com/Hyperzlib
// @description https://github.com/Hyperzlib/Coyote-Majsoul
// @downloadURL https://update.greasyfork.org/scripts/502006/%E9%9B%80%E9%AD%82%E9%83%8A%E7%8B%BC%E7%9B%91%E5%90%AC%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/502006/%E9%9B%80%E9%AD%82%E9%83%8A%E7%8B%BC%E7%9B%91%E5%90%AC%E5%99%A8.meta.js
// ==/UserScript==

(function(factory) {
  typeof define === "function" && define.amd ? define(factory) : factory();
})(function() {
  "use strict";
  const wsHook = {};
  function MutableMessageEvent(o) {
    this.bubbles = o.bubbles || false;
    this.cancelBubble = o.cancelBubble || false;
    this.cancelable = o.cancelable || false;
    this.currentTarget = o.currentTarget || null;
    this.data = o.data || null;
    this.defaultPrevented = o.defaultPrevented || false;
    this.eventPhase = o.eventPhase || 0;
    this.lastEventId = o.lastEventId || "";
    this.origin = o.origin || "";
    this.path = o.path || new Array(0);
    this.ports = o.parts || new Array(0);
    this.returnValue = o.returnValue || true;
    this.source = o.source || null;
    this.srcElement = o.srcElement || null;
    this.target = o.target || null;
    this.timeStamp = o.timeStamp || null;
    this.type = o.type || "message";
    this.__proto__ = o.__proto__ || MessageEvent.__proto__;
  }
  const before = wsHook.before = function(data, url, wsObject) {
    return data;
  };
  const after = wsHook.after = function(e, url, wsObject) {
    return e;
  };
  const modifyUrl = wsHook.modifyUrl = function(url) {
    return url;
  };
  wsHook.resetHooks = function() {
    wsHook.before = before;
    wsHook.after = after;
    wsHook.modifyUrl = modifyUrl;
  };
  const _WS = WebSocket;
  WebSocket = function(url, protocols) {
    let WSObject;
    url = wsHook.modifyUrl(url) || url;
    this.url = url;
    this.protocols = protocols;
    if (!this.protocols) {
      WSObject = new _WS(url);
    } else {
      WSObject = new _WS(url, protocols);
    }
    const _send = WSObject.send;
    WSObject.send = function(data) {
      arguments[0] = wsHook.before(data, WSObject.url, WSObject) || data;
      _send.apply(this, arguments);
    };
    WSObject._addEventListener = WSObject.addEventListener;
    WSObject.addEventListener = function() {
      const eventThis = this;
      if (arguments[0] === "message") {
        arguments[1] = function(userFunc) {
          return function instrumentAddEventListener() {
            arguments[0] = wsHook.after(new MutableMessageEvent(arguments[0]), WSObject.url, WSObject);
            if (arguments[0] === null)
              return;
            userFunc.apply(eventThis, arguments);
          };
        }(arguments[1]);
      }
      return WSObject._addEventListener.apply(this, arguments);
    };
    Object.defineProperty(WSObject, "onmessage", {
      set: function() {
        const eventThis = this;
        const userFunc = arguments[0];
        const onMessageHandler = function() {
          arguments[0] = wsHook.after(new MutableMessageEvent(arguments[0]), WSObject.url, WSObject);
          if (arguments[0] === null)
            return;
          userFunc.apply(eventThis, arguments);
        };
        WSObject._addEventListener.apply(this, ["message", onMessageHandler, false]);
      }
    });
    return WSObject;
  };
  const serverURL = "http://localhost:56556/";
  window.document.hasFocus();
  window.onfocus = () => {
  };
  window.onblur = () => {
  };
  if (window.location.host === "game.maj-soul.com" || window.location.host === "game.mahjongsoul.com") {
    wsHook.before = (data, url) => {
      var _a, _b, _c, _d;
      if (!url.includes("/game-gateway") && !url.includes("mjjpgs.")) {
        return data;
      }
      try {
        const req = new XMLHttpRequest();
        req.open("POST", `${serverURL}api/event?msg=req&meID=${(_d = (_c = (_b = (_a = window == null ? void 0 : window.GameMgr) == null ? void 0 : _a.Inst) == null ? void 0 : _b.account_data) == null ? void 0 : _c.account_id) != null ? _d : ""}&game=majsoul`);
        req.send(data);
      } catch (err) {
        console.error(err);
      }
      return data;
    };
    wsHook.after = (messageEvent, url) => {
      var _a, _b, _c, _d;
      if (!url.includes("/game-gateway") && !url.includes("mjjpgs.")) {
        return messageEvent;
      }
      try {
        const binaryMsg = messageEvent.data;
        const req = new XMLHttpRequest();
        req.open("POST", `${serverURL}api/event?msg=res&meID=${(_d = (_c = (_b = (_a = window == null ? void 0 : window.GameMgr) == null ? void 0 : _a.Inst) == null ? void 0 : _b.account_data) == null ? void 0 : _c.account_id) != null ? _d : ""}&game=majsoul`);
        req.send(binaryMsg);
      } catch (err) {
        console.error(err);
      }
      return messageEvent;
    };
  }
});
