// ==UserScript==
// @name         Bloxd steriods: auto clicker + steroids (killaura, spider, jesus, antispike)
// @namespace    https://bloxd.io
// @version      1.2.1
// @description  Helps you click when you struggle to click manually. (draggable UI, notifications, right default) with steroids modules (killaura, spider, jesus, antispike) for staging.bloxd.io
// @author       MakeItOrBreakIt
// @match        https://bloxd.io/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531448/Bloxd%20steriods%3A%20auto%20clicker%20%2B%20steroids%20%28killaura%2C%20spider%2C%20jesus%2C%20antispike%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531448/Bloxd%20steriods%3A%20auto%20clicker%20%2B%20steroids%20%28killaura%2C%20spider%2C%20jesus%2C%20antispike%29.meta.js
// ==/UserScript==

(() => {
  // --- utils ---
  const utils = {
    assign: Object.assign,
    values: Object.values,
    keys: Object.keys,
  };

  // --- bloxd module loader ---
  const bloxd = {
    wpRequire: null,
    _cachedNoa: null,
    get noa() {
      return this._cachedNoa ??= utils.values(this.bloxdProps).find(x => x?.entities);
    },
    init() {
      window.webpackChunkbloxd = window.webpackChunkbloxd || [];
      // safer push to avoid black screen
      const origPush = window.webpackChunkbloxd.push.bind(window.webpackChunkbloxd);
      window.webpackChunkbloxd.push = (...args) => {
        for (const mod of args[0][2] ? [args[0][2]] : []) {
          if (typeof mod === "function") this.wpRequire = mod;
        }
        return origPush(...args);
      };
      window.webpackChunkbloxd.push([
        [Symbol()],
        {},
        req => (this.wpRequire = req),
      ]);
      this.bloxdProps = utils.values(this.findModule("nonBlocksClient:")).find(x => typeof x === "object");
    },
    findModule(content) {
      const modules = this.wpRequire?.m;
      if (!modules) return null;
      for (const key in modules) {
        try {
          if (modules[key] && modules[key].toString().includes(content)) return this.wpRequire(key);
        } catch {}
      }
      return null;
    },
  };

  // --- game helpers ---
  const game = {
    getPosition(id) {
      return utils.values(bloxd.noa.entities)[28](id);
    },
    getMoveState(id) {
      return utils.values(bloxd.noa.entities)[36](id);
    },
    getHeldItem(id) {
      return utils.values(bloxd.noa.entities)[39](id);
    },
    safeGetHeldItem(id) {
      try {
        return this.getHeldItem(id);
      } catch {
        return null;
      }
    },
    getBlockSolidity() {
      return utils.values(game.registry())[5];
    },
    getBlockID() {
      return bloxd.noa.bloxd[Object.getOwnPropertyNames(bloxd.noa.bloxd.constructor.prototype)[3]].bind(bloxd.noa.bloxd);
    },
    registry() {
      return utils.values(bloxd.noa)[17];
    },
    get playerList() {
      return Object.values(bloxd.noa.bloxd.getPlayerIds())
        .filter(x => x !== 1 && this.safeGetHeldItem(x))
        .map(x => parseInt(x));
    },
    get doAttack() {
      const item = this.safeGetHeldItem(1);
      return (item?.doAttack || item?.breakingItem?.doAttack)?.bind(item);
    },
    touchingWall() {
      const pos = game.getPosition(1);
      if (!pos) return false;
      const offset = 0.35;
      const checks = [
        [0, 0, 0],[offset, 0, 0],[-offset, 0, 0],[0, 0, offset],[0, 0, -offset],
        [offset, 0, offset],[offset, 0, -offset],[-offset, 0, offset],[-offset, 0, -offset],
      ];
      for (const [dx, dy, dz] of checks) {
        for (let h = 0; h <= 2; h++) {
          const x = Math.floor(pos[0] + dx);
          const y = Math.floor(pos[1] + dy + h);
          const z = Math.floor(pos[2] + dz);
          const id = game.getBlockID()(x, y, z);
          if (game.getBlockSolidity()(id)) return true;
        }
      }
      return false;
    },
  };

  // --- steroids modules ---
  class Module {
    constructor(name, keyCode, keyDisplay) {
      this.name = name;
      this.keyCode = keyCode;
      this.keyDisplay = keyDisplay;
      this.enabled = false;
    }
    onEnable() {}
    onDisable() {}
    onRender() {}
    toggle(state = !this.enabled) {
      this.enabled = state;
      state ? this.onEnable() : this.onDisable();
    }
  }

  class Killaura extends Module {
    constructor(keyCode, keyDisplay) {
      super("Killaura", keyCode, keyDisplay);
      this.last = 0;
      this.delay = 350;
    }
    onRender() {
      const now = Date.now();
      if (now - this.last < this.delay) return;
      this.last = now;
      const selfPos = game.getPosition(1);
      for (const id of game.playerList) {
        const pos = game.getPosition(id);
        if (!pos) continue;
        const dx = pos[0] - selfPos[0];
        const dy = pos[1] - selfPos[1];
        const dz = pos[2] - selfPos[2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist <= 7) {
          game.getHeldItem(1)?.trySwingBlock?.();
          game.getMoveState(1)?.setArmsAreSwinging?.();
          game.doAttack([dx / dist, dy / dist, dz / dist], id.toString(), "HeadMesh");
        }
      }
    }
  }

  class Spider extends Module {
    constructor(keyCode, keyDisplay) {
      super("Spider", keyCode, keyDisplay);
    }
    onRender() {
      if (game.touchingWall() && bloxd.noa.inputs.state.jump) {
        const body = bloxd.noa.entities.getPhysics(1).body;
        body.velocity[1] = 5;
      }
    }
  }

  class Jesus extends Module {
    constructor(keyCode, keyDisplay) {
      super("Jesus", keyCode, keyDisplay);
      this.fluidityKey = null;
      this.blocks = null;
    }
    onEnable() {
        if (!this.blocks) {
            this.blocks = utils.values(utils.values(bloxd.findModule("Gun:class")).find(x => typeof x === "object"));
            this.fluidityKey = utils.keys(game.registry())[12];
        }
        game.registry()[this.fluidityKey][this.blocks.find(x => x.name === "Water").id] = true;
        game.registry()[this.fluidityKey][this.blocks.find(x => x.name === "Lava").id] = true;
    }
    onDisable() {
        game.registry()[this.fluidityKey][this.blocks.find(x => x.name === "Water").id] = false;
        game.registry()[this.fluidityKey][this.blocks.find(x => x.name === "Lava").id] = false;
    }
  }

  class AntiSpike extends Module {
    constructor(keyCode, keyDisplay) {
        super("AntiSpike", keyCode, keyDisplay);
        this.fluidityKey = null;
        this.blocks = null;
    }
    onEnable() {
        if (!this.blocks) {
            this.blocks = utils.values(utils.values(bloxd.findModule("Gun:class")).find(x => typeof x === "object"));
            this.fluidityKey = utils.keys(game.registry())[12];
        }
        this.blocks.filter(x => x.name.includes("Spikes")).forEach(x => (game.registry()[this.fluidityKey][x.id] = true));
    }
    onDisable() {
        this.blocks.filter(x => x.name.includes("Spikes")).forEach(x => (game.registry()[this.fluidityKey][x.id] = false));
    }
  }

  // --- steroids UI ---
  class ModuleHUD {
    constructor(modules) {
      this.modules = modules;
      this.container = document.createElement("div");
      utils.assign(this.container.style, {
        position: "fixed",
        top: "10px",
        left: "10px",
        color: "#FF4444",
        zIndex: 10000,
        pointerEvents: "none",
        fontSize: "20px",
        fontFamily: "monospace",
        textShadow: "1px 1px 2px black",
      });
      document.body.appendChild(this.container);
      this.update();
    }
    update() {
      this.container.innerHTML = "";
      this.modules
        .filter(m => m.enabled)
        .forEach(m => {
          const p = document.createElement("p");
          p.textContent = `${m.name}`;
          p.style.margin = "0";
          this.container.appendChild(p);
        });
    }
  }

  class RightShiftGUI {
    constructor(modules, hud) {
      this.modules = modules;
      this.hud = hud;
      this.panel = document.createElement("div");
      utils.assign(this.panel.style, {
        position: "fixed",
        top: "100px",
        right: "20px",
        background: "rgba(17, 17, 17, 0.8)",
        color: "white",
        border: "2px solid #555",
        borderRadius: "5px",
        padding: "10px",
        display: "none",
        zIndex: 9999,
        fontFamily: "monospace",
        backdropFilter: "blur(5px)",
      });
      document.body.appendChild(this.panel);
      this.setupKeybinds();
    }
    createButtons() {
      this.panel.innerHTML = "<h2>Dblox Steroids</h2>";
      this.modules.forEach(mod => {
        const btn = document.createElement("button");
        btn.textContent = `[${mod.keyDisplay}] ${mod.name}`;
        utils.assign(btn.style, {
          display: "block",
          width: "100%",
          margin: "5px 0",
          padding: "5px 10px",
          background: mod.enabled ? "#4CAF50" : "#f44336",
          color: "white",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          borderRadius: "3px",
        });
        btn.onclick = () => {
          mod.toggle();
          btn.style.background = mod.enabled ? "#4CAF50" : "#f44336";
          this.hud.update();
        };
        this.panel.appendChild(btn);
      });
    }
    setupKeybinds() {
      document.addEventListener("keydown", e => {
        if (document.activeElement.tagName === "INPUT") return;
        if (e.code === "ShiftRight") {
          this.panel.style.display = this.panel.style.display === "none" ? "block" : "none";
          if (this.panel.style.display === "block") this.createButtons();
          return;
        }
        const mod = this.modules.find(m => m.keyCode === e.code);
        if (mod) {
          mod.toggle();
          this.hud.update();
          if (this.panel.style.display === "block") this.createButtons();
        }
      });
    }
  }

  // --- auto clicker ---
  const config = JSON.parse(localStorage.getItem('bloxdConfig')) || {
    leftClickKey: 'KeyR',
    rightClickKey: 'KeyF'
  };

  let minCPS = 10, maxCPS = 15;
  let leftClickActive = false, rightClickActive = false;
  let leftClickInterval, rightClickInterval;

  let arraylistVisible = true;
  let arraylist = [];

  // Notifications
  function showNotification(msg, duration = 1800) {
    let notif = document.createElement("div");
    notif.className = "bloxd-notification";
    notif.textContent = msg;
    document.body.appendChild(notif);
    setTimeout(() => {
      notif.style.opacity = "0";
      setTimeout(() => notif.remove(), 400);
    }, duration);
  }

  // Click simulation on #noa-canvas
  const TARGET_SELECTOR = "#noa-canvas";
  function simulateClick(button) {
    const element = document.querySelector(TARGET_SELECTOR);
    if (!element) return;
    element.dispatchEvent(new MouseEvent("mousedown", { button, bubbles: true }));
    element.dispatchEvent(new MouseEvent("mouseup", { button, bubbles: true }));
    if (button === 0) element.dispatchEvent(new MouseEvent("click", { button, bubbles: true }));
    if (button === 2) element.dispatchEvent(new MouseEvent("contextmenu", { button, bubbles: true }));
  }

  function randomInterval() {
    return 1000 / (Math.random() * (maxCPS - minCPS) + minCPS);
  }

  function startLeftClick() {
    if (leftClickActive) return;
    leftClickActive = true;
    function loop() {
      if (!leftClickActive) return;
      simulateClick(0);
      leftClickInterval = setTimeout(loop, randomInterval());
    }
    loop();
    updateArraylist();
  }
  function stopLeftClick() {
    leftClickActive = false;
    clearTimeout(leftClickInterval);
    updateArraylist();
  }
  function toggleLeftClick() {
    leftClickActive ? stopLeftClick() : startLeftClick();
  }

  function startRightClick() {
    if (rightClickActive) return;
    rightClickActive = true;
    function loop() {
      if (!rightClickActive) return;
      simulateClick(2);
      rightClickInterval = setTimeout(loop, randomInterval());
    }
    loop();
    updateArraylist();
  }
  function stopRightClick() {
    rightClickActive = false;
    clearTimeout(rightClickInterval);
    updateArraylist();
  }
  function toggleRightClick() {
    rightClickActive ? stopRightClick() : startRightClick();
  }

  function saveConfig() {
    localStorage.setItem('bloxdConfig', JSON.stringify(config));
  }

  function clearCookies() {
    document.cookie.split(";").forEach(cookie => {
      document.cookie = cookie.split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
    setTimeout(() => location.reload(), 1000);
  }

  function updateArraylist() {
    arraylist = [];
    if (leftClickActive) arraylist.push("Auto Left Click");
    if (rightClickActive) arraylist.push("Auto Right Click");
    modules.forEach(m => { if(m.enabled) arraylist.push(m.name); });
    renderArraylist();
  }

  function renderArraylist() {
    const arrDiv = document.getElementById("bloxd-arraylist");
    arrDiv.innerHTML = arraylist.length
      ? arraylist.map(f => `<span class="arraylist-item">${f}</span>`).join("<br>")
      : `<span style="color:#888;">No features active</span>`;
    arrDiv.style.display = arraylistVisible ? "block" : "none";
  }

  function createUI() {
    let saved = JSON.parse(localStorage.getItem('bloxdUIPos') || '{}');
    let useCustom = typeof saved.x === "number" && typeof saved.y === "number";
    let startX = saved.x || 0, startY = saved.y || 10;

    let ui = document.createElement("div");
    ui.id = "bloxd-ui-container";
    if (useCustom) {
      ui.setAttribute("style", `position: fixed; top: ${startY}px; left: ${startX}px; right: auto; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 8px; z-index: 9999; font-size: 14px; min-width: 320px; max-width: 440px; box-shadow: 0 2px 8px #0008; cursor: move;`);
    } else {
      ui.setAttribute("style", `position: fixed; top: 10px; right: 10px; left: auto; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 8px; z-index: 9999; font-size: 14px; min-width: 320px; max-width: 440px; box-shadow: 0 2px 8px #0008; cursor: move;`);
    }
    ui.innerHTML = `
        <div style="display: flex; flex-direction: row; gap: 10px; margin-bottom: 8px; cursor: move;">
            <button id="leftClickToggle" class="action-button">Left Click</button>
            <button id="rightClickToggle" class="action-button">Right Click</button>
            <button id="clearCookies" class="action-button">Gen Account</button>
            <button id="arraylistToggle" class="action-button">Arraylist</button>
        </div>
        <div style="display: flex; flex-direction: row; gap: 8px;">
            <label class="cps-label">Min CPS: <input type="number" id="minCPS" value="${minCPS}" min="1" max="50"></label>
            <label class="cps-label">Max CPS: <input type="number" id="maxCPS" value="${maxCPS}" min="1" max="50"></label>
            <label class="key-label">Left Key: <input id="keyLeft" type="text" value="${config.leftClickKey}" size="8"></label>
            <label class="key-label">Right Key: <input id="keyRight" type="text" value="${config.rightClickKey}" size="8"></label>
            <button id="saveKeys" class="action-button">Save Keys</button>
        </div>
    `;
    document.body.appendChild(ui);

    let arrDiv = document.createElement("div");
    arrDiv.id = "bloxd-arraylist";
    arrDiv.className = "arraylist-container";
    if (useCustom) {
      arrDiv.setAttribute("style", `position: fixed; top: ${startY+140}px; left: ${startX}px; right: auto; background: rgba(30,30,30,0.97); color: #00ffb0; padding: 10px 22px; border-radius: 8px; z-index: 10000; font-size: 16px; min-width: 120px; text-align: left; box-shadow: 0 2px 8px #0008; user-select: none; margin-top: 10px;`);
    } else {
      arrDiv.setAttribute("style", `position: fixed; top: 150px; right: 10px; left: auto; background: rgba(30,30,30,0.97); color: #00ffb0; padding: 10px 22px; border-radius: 8px; z-index: 10000; font-size: 16px; min-width: 120px; text-align: left; box-shadow: 0 2px 8px #0008; user-select: none; margin-top: 10px;`);
    }
    document.body.appendChild(arrDiv);

    // Drag logic
    let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
    ui.addEventListener('mousedown', function(e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;
      isDragging = true;
      dragOffsetX = e.clientX - ui.getBoundingClientRect().left;
      dragOffsetY = e.clientY - ui.getBoundingClientRect().top;
      document.body.style.userSelect = "none";
    });
    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      let x = e.clientX - dragOffsetX;
      let y = e.clientY - dragOffsetY;
      x = Math.max(0, Math.min(window.innerWidth - ui.offsetWidth, x));
      y = Math.max(0, Math.min(window.innerHeight - ui.offsetHeight, y));
      ui.style.left = x + "px";
      ui.style.top = y + "px";
      ui.style.right = "auto";
      arrDiv.style.left = x + "px";
      arrDiv.style.top = (y + 140) + "px";
      arrDiv.style.right = "auto";
    });
    document.addEventListener('mouseup', function(e) {
      if (isDragging) {
        isDragging = false;
        document.body.style.userSelect = "";
        localStorage.setItem('bloxdUIPos', JSON.stringify({
          x: parseInt(ui.style.left),
          y: parseInt(ui.style.top)
        }));
      }
    });

    // Event listeners
    document.getElementById("leftClickToggle").onclick = () => { toggleLeftClick(); updateArraylist(); };
    document.getElementById("rightClickToggle").onclick = () => { toggleRightClick(); updateArraylist(); };
    document.getElementById("clearCookies").onclick = clearCookies;

    document.getElementById("minCPS").onchange = e => { minCPS = parseInt(e.target.value); };
    document.getElementById("maxCPS").onchange = e => { maxCPS = parseInt(e.target.value); };

    document.getElementById("saveKeys").onclick = () => {
      config.leftClickKey = document.getElementById("keyLeft").value;
      config.rightClickKey = document.getElementById("keyRight").value;
      saveConfig();
      showNotification("Keybinds saved!");
    };

    document.getElementById("arraylistToggle").onclick = () => {
      arraylistVisible = !arraylistVisible;
      renderArraylist();
    };

    updateArraylist();
  }

  // --- styles ---
  const styles = `
    #bloxd-ui-container .action-button {
      background-color: #444;
      color: white;
      border: none;
      padding: 9px 18px;
      border-radius: 6px;
      margin: 0 2px;
      cursor: pointer;
      font-size: 15px;
      transition: background-color 0.3s;
    }
    #bloxd-ui-container .action-button:hover {
      background-color: #888;
    }
    #bloxd-ui-container .action-button:active {
      background-color: #333;
    }
    #bloxd-ui-container .cps-label, #bloxd-ui-container .key-label {
      margin: 0 4px;
      font-size: 13px;
    }
    #bloxd-ui-container input[type="number"], #bloxd-ui-container input[type="text"] {
      padding: 4px 7px;
      font-size: 13px;
      width: 55px;
      margin-left: 2px;
      border-radius: 3px;
      border: 1px solid #333;
      background: #222;
      color: #fff;
    }
    #bloxd-arraylist .arraylist-item {
      color: #00ffb0;
      font-weight: bold;
    }
    .bloxd-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #222d;
      color: #fff;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      z-index: 10001;
      box-shadow: 0 2px 8px #0008;
      opacity: 1;
      transition: opacity 0.4s;
      pointer-events: none;
    }
  `;
  let styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  // --- steroids modules init ---
  const modules = [
    new Killaura("KeyK", "K"),
    new Spider("KeyV", "V"),
    new Jesus("KeyJ", "J"),
    new AntiSpike("KeyN", "N")
  ];
  const hud = new ModuleHUD(modules);
  new RightShiftGUI(modules, hud);

  // --- main loop for steroids ---
  function steroidsLoop() {
    try {
      for (const mod of modules) if (mod.enabled) mod.onRender();
    } catch {}
    requestAnimationFrame(steroidsLoop);
  }

  // --- keybinds for auto clicker ---
  document.addEventListener("keydown", (event) => {
    if (event.repeat || ["INPUT", "TEXTAREA"].includes(event.target.tagName) || event.target.isContentEditable) return;
    if (event.code === config.leftClickKey) {
      toggleLeftClick();
      updateArraylist();
    }
    if (event.code === config.rightClickKey) {
      toggleRightClick();
      updateArraylist();
    }
  });

  // --- wait for game ---
  const waitForGame = setInterval(() => {
    try {
      bloxd.init();
      if (bloxd.noa && bloxd.wpRequire) {
        clearInterval(waitForGame);
        if (!/Mobi|Android/i.test(navigator.userAgent)) createUI();
        steroidsLoop();
      }
    } catch {}
  }, 100);
})();
