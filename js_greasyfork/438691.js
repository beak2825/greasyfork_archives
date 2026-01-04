/* eslint-disable */
// ==UserScript==
// @name         海底掘金
// @namespace    https://github.com/palmcivet/juejin-miming
// @version      0.0.4
// @license      MIT
// @description  这是一个针对 海底掘金活动 编写的油猴脚本，实现了用户信息的自动获取和掘进方式的高效的选择。
// @author       Palm Civet
// @match        https://juejin.cn/game/haidijuejin/*
// @require      https://unpkg.com/alpinejs@3.8/dist/cdn.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438691/%E6%B5%B7%E5%BA%95%E6%8E%98%E9%87%91.user.js
// @updateURL https://update.greasyfork.org/scripts/438691/%E6%B5%B7%E5%BA%95%E6%8E%98%E9%87%91.meta.js
// ==/UserScript==
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
(function() {
  const CLASS_NAME = "juejin-miming";
  const API_USER = "https://api.juejin.cn/user_api/v1/user/get";
  const API_GAME_BASE = "https://juejin-game.bytedance.com/game/sea-gold";
  const API_GAME_COMMAND = `${API_GAME_BASE}/game/command`;
  async function getUserInfo() {
    try {
      const result = await fetch(API_USER, {
        credentials: "include"
      });
      const data = await result.json();
      return data.data;
    } catch (error) {
      throw error;
    }
  }
  async function gameCommand({ uid = "", authorization = "", gameId = "", commandStep = 0 }) {
    const commandArr = [
      [{ times: 2, command: ["2", "L", "D", "L", "4", "D", "6", "R", "D", "R"] }],
      [{ times: 2, command: ["2", "R", "D", "R", "6", "D", "4", "L", "D", "L"] }],
      [
        {
          times: 10,
          command: [
            {
              times: 2,
              command: ["D", "2", "L", "D", "L", "4", "D", "6", "U", "L", "D", "R"]
            },
            "L",
            "D"
          ]
        },
        { times: 2, command: ["U", "U", "8", "R"] },
        {
          times: 10,
          command: [
            {
              times: 2,
              command: ["D", "2", "R", "D", "R", "6", "D", "4", "U", "R", "D", "L"]
            },
            "R",
            "D"
          ]
        },
        { times: 2, command: ["U", "U", "8", "L"] }
      ],
      [
        {
          times: 10,
          command: [
            {
              times: 2,
              command: ["D", "2", "L", "D", "L", "4", "D", "6", "U", "L", "D", "R"]
            },
            "L",
            "D"
          ]
        },
        { times: 2, command: ["U", "U", "8", "R"] },
        {
          times: 10,
          command: [
            {
              times: 2,
              command: ["D", "2", "R", "D", "R", "6", "D", "4", "U", "R", "D", "L"]
            },
            "R",
            "D"
          ]
        },
        { times: 2, command: ["U", "U", "8", "L"] }
      ],
      [
        {
          times: 10,
          command: [
            "L",
            "L",
            "L",
            "4",
            "L",
            "L",
            "L",
            "4",
            "D",
            "R",
            "R",
            "R",
            "6",
            "R",
            "R",
            "R",
            "6"
          ]
        },
        { times: 3, command: ["U", "U", "L", "L", "8", "4"] },
        {
          times: 6,
          command: ["D", "2", "L", "D", "L", "4", "D", "6", "U", "L", "D", "R"]
        },
        "L",
        "D",
        {
          times: 10,
          command: [
            "R",
            "R",
            "R",
            "6",
            "R",
            "R",
            "R",
            "6",
            "D",
            "L",
            "L",
            "L",
            "4",
            "L",
            "L",
            "L",
            "4"
          ]
        },
        { times: 3, command: ["U", "U", "R", "R", "8", "6"] },
        {
          times: 6,
          command: ["D", "2", "R", "D", "R", "6", "D", "4", "U", "R", "D", "L"]
        },
        "R",
        "D"
      ]
    ];
    const coreCode = commandArr[commandStep];
    const loop = commandStep <= 1 ? 2 : 4;
    const params = { command: [] };
    let _params = params;
    for (let i = 0; i < loop; i++) {
      _params["command"].push({ times: 10, command: [] });
      _params = _params.command[0];
      if (i >= loop - 1) {
        _params.command.push(...coreCode);
      }
    }
    _params = null;
    const datarus = await fetch(`${API_GAME_COMMAND}?uid=${uid}&time=${Date.parse(new Date().toString())}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "authorization": authorization,
        "accept": "application/json, text/plain, */*",
        "content-length": JSON.stringify(params).length.toString(),
        "x-tt-gameid": gameId
      },
      body: JSON.stringify(params)
    });
    return datarus.json();
  }
  function injectStyle() {
    const styleDOM = document.createElement("style");
    styleDOM.id = `${CLASS_NAME}-style`;
    styleDOM.innerHTML = `:root {
  --radius: 6px;
  --padding: 10px;
  --primary-color: #3c7eff;
}

.juejin-miming-controls {
  background-color: #3c7eff;
  border: 2px solid #bedaff;
  border-radius: var(--radius);
  position: absolute;
  right: 10px;
  top: 10px;
  width: 200px;
  padding: var(--padding);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
}

.juejin-miming-controls h2 {
  margin: var(--padding) 0;
}

.juejin-miming-controls a {
  color: white;
}

.juejin-miming-info input[type="text"] {
  font-family: monospace, "Courier New", Courier;
  width: 100%;
  font-size: 15px;
  height: 28px;
  border: 0;
  outline: 0;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  box-sizing: border-box;
  border-radius: calc(var(--radius) / 2);
  margin: 2px 0;
  padding: 0 4px;
}

.juejin-miming-cmd {
  margin: var(--padding) 0;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.juejin-miming-cmd label {
  list-style: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  font-family: monospace, "Courier New", Courier;
}

.juejin-miming-cmd input[type="radio"] {
  cursor: pointer;
  padding: 0;
  width: 17px;
  height: 17px;
  margin: 0 5px 0 5px;
}

.juejin-miming-btn {
  color: #1d4dd2;
  background-color: white;
  border: 2px solid #1d4dd2;
  width: 70px;
  height: 30px;
  cursor: pointer;
  border-radius: calc(var(--radius) / 2);
}

.juejin-miming-btn:hover {
  color: white;
  background-color: #1d4dd2;
  border: 2px solid white;
}

.juejin-miming-msg {
  margin-top: var(--padding);
  height: 24px;
}
`;
    document.head.append(styleDOM);
  }
  function injectControls() {
    const root = document.querySelector("#Cocos2dGameContainer");
    const container = document.createElement("div");
    container.className = `${CLASS_NAME}-script`;
    container.innerHTML = `<div class="juejin-miming-controls" x-data>
  <div class="juejin-miming-project">
    <h2>
      <a href="//github.com/palmcivet/juejin-miming" target="_blank" title="GitHub">\u6398\u91D1\u6316\u77FF</a>
    </h2>
  </div>

  <div class="juejin-miming-info">
    <input type="text" x-model="$store.controls.form.uid" placeholder="uid" />
    <input type="text" x-model="$store.controls.form.authorization" placeholder="authorization" />
    <input type="text" x-model="$store.controls.form.gameId" placeholder="x-tt-gameid" />
  </div>

  <div class="juejin-miming-cmd">
    <label>
      <input type="radio" value="0" name="commandStep" @change="$store.controls.onChange(0)" />
      0\uFF1A\u5F00\u5C40\u5F80\u5DE6
    </label>

    <label>
      <input type="radio" value="1" name="commandStep" @change="$store.controls.onChange(1)" />
      1\uFF1A\u5F00\u5C40\u5F80\u53F3
    </label>

    <label>
      <input type="radio" value="2" name="commandStep" @change="$store.controls.onChange(2)" />
      2\uFF1A\u4E2D\u671F
    </label>

    <label>
      <input type="radio" value="3" name="commandStep" @change="$store.controls.onChange(3)" />
      3\uFF1A\u540E\u671F\u98DE\u7FD4
    </label>

    <label>
      <input type="radio" value="4" name="commandStep" @change="$store.controls.onChange(4)" />
      4\uFF1A\u540E\u671F\u626B\u8361
    </label>
  </div>

  <button class="juejin-miming-btn" @click="$store.controls.onSubmit()">\u6267\u884C</button>

  <div class="juejin-miming-msg" x-text="$store.controls.message"></div>
</div>
`;
    root.appendChild(container);
  }
  (function(context) {
    context.rewriteXHR = {
      cachedProto: function() {
        this._originXhr = context.XMLHttpRequest.prototype;
        this._originOpen = this._originXhr.open;
        this._originSend = this._originXhr.send;
        this._originSetRequestHeader = this._originXhr.setRequestHeader;
      },
      overWrite: function() {
        const _this = this;
        this._originXhr.open = function() {
          this.open_args = [...arguments];
          return _this._originOpen.apply(this, arguments);
        };
        this._originXhr.send = function() {
          return _this._originSend.apply(this, arguments);
        };
        this._originXhr.setRequestHeader = function() {
          const url = this.open_args && this.open_args[1];
          if (url.startsWith(API_GAME_BASE)) {
            const headerKey = arguments[0];
            if (/^x-tt-gameid$/.test(headerKey)) {
              localStorage.setItem(`${CLASS_NAME}-gameid`, arguments[1]);
              Alpine.store("controls").form.gameId = localStorage.getItem(`${CLASS_NAME}-gameid`);
            }
            if (/^Authorization$/.test(headerKey)) {
              localStorage.setItem(`${CLASS_NAME}-authid`, arguments[1]);
              Alpine.store("controls").form.authorization = localStorage.getItem(`${CLASS_NAME}-authid`);
            }
          }
          return _this._originSetRequestHeader.apply(this, arguments);
        };
      },
      init: function() {
        this.cachedProto();
        this.overWrite();
      }
    };
    context.rewriteXHR.init();
  })(window);
  document.addEventListener("alpine:init", () => {
    Alpine.store("controls", {
      form: {
        uid: "",
        gameId: "",
        authorization: "",
        commandStep: "0"
      },
      message: "",
      onChange(value) {
        Alpine.store("controls").form.commandStep = value;
      },
      async onSubmit() {
        Alpine.store("controls").message = "";
        const result = await gameCommand(__spreadValues({}, Alpine.store("controls").form));
        const { message } = result;
        Alpine.store("controls").message = message;
      }
    });
    console.info("== Juejin miming: inject ==");
  });
  const _onload = window.onload || function() {
  };
  window.onload = async (event) => {
    _onload(event);
    setTimeout(injectStyle);
    setTimeout(injectControls, 8e3);
    const { user_id } = await getUserInfo();
    Alpine.store("controls").form.uid = user_id;
    Alpine.store("controls").form.gameId = localStorage.getItem(`${CLASS_NAME}-gameid`);
    Alpine.store("controls").form.authorization = localStorage.getItem(`${CLASS_NAME}-authid`);
    console.log("== Juejin miming: enjoy ==");
  };
})();
