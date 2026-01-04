// ==UserScript==
// @name         linux.do.cq.auto.fire
// @namespace    https://linux.do/u/io.oi/cq.auto.fire
// @version      1.3.3
// @author       io.oi
// @description  auto fire wall
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-hai.one
// @match        http://cq.e-hai.one/play?*
// @match        http://chuanqi.proxy2world.com/play?*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/520761/linuxdocqautofire.user.js
// @updateURL https://update.greasyfork.org/scripts/520761/linuxdocqautofire.meta.js
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const t=document.createElement("style");t.textContent=o,document.head.append(t)})(" .control-panel{position:fixed;bottom:0;left:0;min-width:auto}.control-panel .control-group{display:flex}.control-panel .control-group .button{color:#ece6cf;background-color:#084552;padding:.4rem;border:none;cursor:pointer;border-radius:.1rem} ");

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  class Icons {
  }
  __publicField(Icons, "startIcon", '<svg class="icon" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg"><path d="M823.8 603.5l-501.2 336c-50.7 34-119.3 20.4-153.2-30.2-12.2-18.2-18.7-39.6-18.7-61.5v-672c0-61 49.5-110.4 110.4-110.4 21.9 0 43.3 6.5 61.5 18.7l501.1 336c50.7 34 64.2 102.6 30.2 153.2-7.8 11.9-18.1 22.2-30.1 30.2z m0 0"></path></svg>');
  __publicField(Icons, "stopIcon", '<svg class="icon" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M941.967463 109.714286v804.571428q0 14.857143-10.857143 25.714286t-25.714286 10.857143H100.824606q-14.857143 0-25.714286-10.857143t-10.857143-25.714286V109.714286q0-14.857143 10.857143-25.714286t25.714286-10.857143h804.571428q14.857143 0 25.714286 10.857143t10.857143 25.714286z"></path></svg>');
  function createControlPanel(clicked) {
    const controlPanel = document.createElement("div");
    controlPanel.id = "control-panel";
    controlPanel.className = "control-panel";
    controlPanel.innerHTML = `
    <div class="control-group">
    <button id="toggle" class="button" title="点击开始自动释放火墙">${Icons.startIcon}</button>
    <button id="random" class="button" title="封魔谷全自动挂机
1.人物进城自动飞鞋，不止防小黑屋，也防贴着建筑走路慢的问题
2.挂机误入其他图，会自动传送封魔谷，自动开启挂机
3.监测挂机状态，中断会自动开启挂机
4.检测周围怪物和掉落物数量，无怪无掉落物自动飞鞋
注：以上功能全部基于飞鞋，请多充些飞鞋点数">${Icons.startIcon}</button>
    <button id="auto-fly" class="button" title="周围无怪无掉落物自动飞鞋和监测挂机状态，这个功能无法和封魔谷挂机同时开启">${Icons.startIcon}</button>
</div>`;
    const btns = Array.from(controlPanel.querySelectorAll("button"));
    for (const btn of btns) {
      btn.addEventListener("click", () => {
        clicked(btn);
      });
    }
    return controlPanel;
  }
  class Rectangle {
    constructor(vertices) {
      __publicField(this, "vertices");
      this.vertices = vertices;
    }
    crossProduct(x, y, z) {
      return (z[1] - y[1]) * (y[0] - x[0]) - (z[0] - y[0]) * (y[1] - x[1]);
    }
    isOnSameSide(p1, p2, a, b) {
      const cp1 = this.crossProduct(a, b, p1);
      const cp2 = this.crossProduct(a, b, p2);
      return cp1 * cp2 >= 0;
    }
    isInside(x, y) {
      const [A, B, C, D] = this.vertices;
      const p = [x, y];
      return this.isOnSameSide(p, A, B, C) && this.isOnSameSide(p, B, C, D) && this.isOnSameSide(p, C, D, A) && this.isOnSameSide(p, D, A, B);
    }
  }
  window.addEventListener("load", () => {
    let timer = void 0;
    let watchTimer = void 0;
    let autoFlyTimer = void 0;
    let status = "None";
    const buttonColor = "#55b47d";
    const buttonColor2 = "#084552";
    function checkEdcwsp() {
      if (!app.qTVCL.ins().isOpen) {
        app.qTVCL.ins().edcwsp();
        toast("开始挂机", "0x00ff60");
      }
    }
    function checkMonster() {
      const all = app.NWRFmB.ins().YUwhM();
      let count = 0;
      for (const a in all) {
        const monster = all[a];
        if (monster.propSet.getRace() == 1) {
          count++;
        }
      }
      return count;
    }
    function checkDropCount() {
      const drops = app.NWRFmB.ins().dropList;
      let count = 0;
      for (const _ in drops) {
        count++;
      }
      return count;
    }
    function inMap(id) {
      return app.GameMap.mapID === id;
    }
    function fly() {
      app.EhSWiR.m_clickSkillId = 58;
    }
    function fire() {
      app.EhSWiR.m_clickSkillId = 14;
    }
    function send(user, mapId) {
      app.PKRX.ins().send_1_7(user, mapId);
    }
    function getPlayer() {
      return app.NWRFmB.ins().getPayer;
    }
    function toast(message, color = "0xff7700") {
      app.uMEZy.ins().IrCm(`|C:${color}&T:${message}|`);
    }
    function toggleBtnStatus(btn, color, icon) {
      btn.style.backgroundColor = color;
      btn.innerHTML = icon;
    }
    function autoFly(player) {
      const count = player.propSet.getFlyshoes();
      if (count > 0) {
        toast(`周围没有怪了，开始飞，飞鞋点数剩余：${count - 1}`);
        fly();
      } else {
        toast(`飞鞋点数不足，请补充飞鞋点数`, "0xff0000");
      }
    }
    const panel = createControlPanel((btn) => {
      const id = btn.getAttribute("id");
      switch (id) {
        case "toggle":
          if (timer) {
            clearInterval(timer);
            timer = void 0;
            toggleBtnStatus(btn, buttonColor2, Icons.startIcon);
          } else {
            fire();
            timer = setInterval(() => {
              fire();
            }, 9e3);
            toggleBtnStatus(btn, buttonColor, Icons.stopIcon);
          }
          break;
        case "random":
          if (status === "Other") {
            toast("封魔谷挂机和无怪自动飞鞋只能开启一个，请关闭无怪自动飞鞋后重试");
            return;
          }
          if (watchTimer) {
            clearInterval(watchTimer);
            watchTimer = void 0;
            toggleBtnStatus(btn, buttonColor2, Icons.startIcon);
            status = "None";
          } else {
            toast("4秒后开始挂机，请不要有任何操作");
            const player = getPlayer();
            const rectangle = new Rectangle([[162, 60], [208, 95], [155, 130], [110, 100]]);
            watchTimer = setInterval(() => {
              if (inMap(9)) {
                checkEdcwsp();
                if (rectangle.isInside(player.lastX, player.lastY)) {
                  toast(`人[${player.lastX},${player.lastY}],在封魔谷的城中，危险，防止小黑屋，开飞`, "0xff0000");
                  fly();
                } else if (checkMonster() < 1 && checkDropCount() < 1) {
                  autoFly(player);
                }
              } else {
                toast("不在封魔谷，开始传送");
                send(player.recog, 12);
                const tt = setInterval(() => {
                  if (inMap(9)) {
                    checkEdcwsp();
                    clearInterval(tt);
                  }
                }, 2e3);
              }
            }, 4e3);
            toggleBtnStatus(btn, buttonColor, Icons.stopIcon);
            status = "FengMoGu";
          }
          break;
        case "auto-fly":
          if (status === "FengMoGu") {
            toast("封魔谷挂机和无怪自动飞鞋只能开启一个，请关闭封魔谷挂机后重试");
            return;
          }
          if (autoFlyTimer) {
            clearInterval(autoFlyTimer);
            autoFlyTimer = void 0;
            toggleBtnStatus(btn, buttonColor2, Icons.startIcon);
            status = "None";
          } else {
            toast("3秒后开启无怪自动飞鞋");
            const player = getPlayer();
            autoFlyTimer = setInterval(() => {
              if (checkMonster() < 1 && checkDropCount() < 1) {
                autoFly(player);
              }
              checkEdcwsp();
            }, 3e3);
            status = "Other";
            toggleBtnStatus(btn, buttonColor, Icons.stopIcon);
          }
          break;
      }
    });
    document.body.appendChild(panel);
  });

})();