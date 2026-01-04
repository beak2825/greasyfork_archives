// ==UserScript==
// @name wsmud_plugins3
// @namespace cqv
// @version  3.1.41
// @description wsmud plugins
// @author fjcqv
// @homepage https://greasyfork.org/zh-CN/scripts/378063-wsmud-plugins3
// @modified     2021/4/21 12:16:52

// @match http://game.wsmud.com/*
// @require https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @require https://cdn.staticfile.org/jquery-contextmenu/3.0.0-beta.2/jquery.ui.position.min.js
// @require https://cdn.staticfile.org/jquery-contextmenu/3.0.0-beta.2/jquery.contextMenu.min.js
// @grant unsafeWindow
// @grant GM_xmlhttpRequest
// @grant GM_addStyle
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/378063/wsmud_plugins3.user.js
// @updateURL https://update.greasyfork.org/scripts/378063/wsmud_plugins3.meta.js
// ==/UserScript==

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 903:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ Injector)
/* harmony export */ });


const sendDirect = 5;
const sendInterval = 256;
const sendDelayCnt = Math.floor(sendDirect / 2 + 3000 / sendInterval);
const sendInterval2 = sendInterval + 150; // 插件，监听及发送网络消息。

const eventToData = event => {
  const data = event.data;

  try {
    return data[0] === '{' ? JSON.parse(event) : {
      'type': 'text',
      'content': data
    };
  } catch (error) {
    return data[0] === '{' ? new Function(`return ${data};`)() : {
      'type': 'text',
      'content': data
    };
  }
};

const dataToEvent = function (data) {
  return data.type === 'text' ? {
    data: data.text
  } : {
    data: JSON.stringify(data)
  };
};

class Injector {
  constructor() {
    this.ws = null;
    this.messageCallback = null;
    this.listeners = [null];
    this.cmd_queue = [];
    this.sentList = [];
    this.cmd_busy = false;
    this.echo = false;
    this.print = console.log; //重载ws

    var _ws = window.WebSocket;
    var ws;
    var injector = this;

    var createWebSocket = uri => {
      ws = new _ws(uri);
      this.ws = ws;
      document.querySelector(".signinfo").innerHTML = "<HIR>插件已运行</HIR>";
    };

    var setMessageCallback = fn => {
      this.messageCallback = fn;

      ws.onmessage = msg => this.onServerMessage(msg);
    };

    unsafeWindow.WebSocket = function (uri) {
      createWebSocket(uri);
    };

    unsafeWindow.WebSocket.prototype = {
      CONNECTING: _ws.CONNECTING,
      OPEN: _ws.OPEN,
      CLOSING: _ws.CLOSING,
      CLOSED: _ws.CLOSED,

      get url() {
        return ws.url;
      },

      get protocol() {
        return ws.protocol;
      },

      get readyState() {
        return ws.readyState;
      },

      get bufferedAmount() {
        return ws.bufferedAmount;
      },

      get extensions() {
        return ws.extensions;
      },

      get binaryType() {
        return ws.binaryType;
      },

      set binaryType(t) {
        ws.binaryType = t;
      },

      get onopen() {
        return ws.onopen;
      },

      set onopen(fn) {
        ws.onopen = fn;
      },

      get onmessage() {
        return ws.onmessage;
      },

      set onmessage(fn) {
        setMessageCallback(fn);
      },

      get onclose() {
        return ws.onclose;
      },

      set onclose(fn) {
        ws.onclose = fn;
      },

      get onerror() {
        return ws.onerror;
      },

      set onerror(fn) {
        ws.onerror = fn;
      },

      close: function () {
        ws.close();
      },
      send: function (text) {
        if (injector.echo) {
          injector._echo('<hiy>' + text + '</hiy>');
        }

        injector.sentList.push({
          cmd: text,
          timestamp: new Date().getTime()
        });
        ws.send(text);
      }
    };
  }

  static getInstance() {
    if (unsafeWindow.inject) return unsafeWindow.inject;
    if (window.WebSocket) if (!this.instance) {
      this.instance = new Injector();
    }
    return this.instance;
  }

  onServerMessage(msg) {
    if (!msg || !msg.data) return;
    let data = eventToData(msg);
    this.listeners.forEach(listener => {
      if (listener != null) {
        listener(data);
      }
    });

    if (this.waylayer && this.waylayer(data)) {
      delete this.waylayer;
    } else {
      if (data.event) {
        this.messageCallback(dataToEvent(data));
      } else this.messageCallback.apply(this, arguments);
    }
  }

  createMessage(msg, timeout) {
    timeout = timeout || 0;
    setTimeout(() => {
      this.onServerMessage({
        data: JSON.stringify(msg)
      });
    }, timeout);
  }

  setListener(listener, info) {
    this.print(info, listener == null ? 0 : 1);
    this.listeners[0] = listener;
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    let index = this.listeners.indexOf(listener);

    if (index == 0) {
      this.listeners[0] = null;
    } else if (index > 0) {
      this.listeners.splice(index, 1);
    }
  }

  _send_cmd() {
    if (!this.ws || this.ws.readyState != 1) {
      this.cmd_busy = false;
      this.cmd_queue = [];
    } else if (this.cmd_queue.length > 0) {
      this.cmd_busy = true;
      const nowt = new Date().getTime();
      const t3000 = nowt - 3000;

      while (this.sentList.length && this.sentList[0].timestamp < t3000) this.sentList.shift();

      do {
        try {
          let cmd = this.cmd_queue.shift();

          if (this.echo) {
            this._echo('<hiy>' + cmd + '</hiy>');
          }

          this.ws.send(cmd);
          this.sentList.push({
            cmd: cmd,
            timestamp: nowt
          });
        } catch (e) {
          this._echo(e);

          this.cmd_busy = false;
          this.cmd_queue = [];
          return;
        }
      } while (this.cmd_queue.length && this.sentList.length < sendDirect);

      setTimeout(() => {
        this._send_cmd();
      }, sendDelayCnt > this.sentList.length ? sendInterval2 : sendInterval);
    } else {
      this.cmd_busy = false;
    }
  }

  send(cmd, no_queue) {
    if (this.ws && this.ws.readyState == 1) {
      cmd = cmd instanceof Array ? cmd : cmd.split(';');

      if (no_queue) {
        for (var i = 0; i < cmd.length; i++) {
          if (this.echo) {
            this._echo('<hiy>' + cmd[i] + '</hiy>');
          }

          this.ws.send(cmd[i]);
        }
      } else {
        for (i = 0; i < cmd.length; i++) {
          this.cmd_queue.push(cmd[i]);
        }

        if (!this.cmd_busy) {
          this._send_cmd();
        }
      }
    }
  }

  _echo(msg) {
    this.messageCallback({
      data: msg
    });
  }

  waylay(trigger) {
    this.waylayer = trigger;
  }

}
Injector.getInstance();

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _module_Injector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(903);



var loadjs = false;

if (window.WebSocket) {
  unsafeWindow.inject = _module_Injector__WEBPACK_IMPORTED_MODULE_0__/* .default.getInstance */ .Z.getInstance();
  document.addEventListener("DOMContentLoaded", () => {
    $(".mypanel").css("visibility", "hidden");
    let jsUrl = GM_info.script.name == "wsmud_plugins3_Dev" ? ["http://127.0.0.1:9000/func.user.js"] : ["http://t6vw1l.coding-pages.com/dist/func.user.js" + `?t=${Date.parse(new Date())}`, "http://cqv.gitee.io/ws/dist/func.user.js" + `?t=${Date.parse(new Date())}`];
    jsUrl.forEach(url => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {
          "If-Modified-Since": "0"
        },
        ignoreCache: true,
        onload: res => {
          if (loadjs || res.statusText !== "OK") return;
          loadjs = true;
          $(".mypanel").css("visibility", "");
          document.querySelector(".signinfo").innerHTML = "<br><HIR>远程代码已下载</HIR>";
          eval(res.responseText);
        }
      });
    });
  });
} else {
  if (document.body) {
    setTimeout(() => {
      location.reload();
    }, 500);
  }
}
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});