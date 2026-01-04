// ==UserScript==
// @name        CookieBot
// @namespace   CookieBot
// @version     1.0
// @description Aimbot and ESP for Voxiom.io
// @author      CookieBot
// @license MIT 
// @icon        https://www.google.com/s2/favicons?sz=64&domain_url=voxiom.io
// @grant       none
// @run-at      document-start
// @require     https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.min.js#sha256-ec0a84377f1dce9d55b98f04ac7057376fa5371c33ab1cd907b85ae5f18fab7e
// @match       https://voxiom.io/*
// @downloadURL https://update.greasyfork.org/scripts/475951/CookieBot.user.js
// @updateURL https://update.greasyfork.org/scripts/475951/CookieBot.meta.js
// ==/UserScript==

(() => {
  // src/core/utils/dom.ts
  function createElement(parent, tagName) {
    const elem = document.createElement(tagName);
    parent.appendChild(elem);
    return elem;
  }

  // src/core/Module.ts
  var Module = class {
    constructor(key, name, description) {
      this.key = key;
      this.name = name;
      this.description = description;
      this.key = this.key.toUpperCase();
    }
    state;
    onGameEnter() {
    }
    onGameExit() {
    }
    onTick() {
    }
    onKeyDown(event) {
    }
    onKeyUp(event) {
    }
    onMouseDown(event) {
    }
    onMouseUp(event) {
    }
  };

  // src/core/utils/format.ts
  function joinOxfordComma(items) {
    switch (items.length) {
      case 0:
        return "";
      case 1:
        return items[0];
      case 2:
        return `${items[0]} and ${items[1]}`;
      default:
        return `${items.slice(0, items.length - 1).join(", ")}, and ${items[items.length - 1]}`;
    }
  }

  // src/core/modules/ToggleModule.ts
  var ToggleModule = class extends Module {
    constructor(key, name, description, modes, defaultModeIndex = 0) {
      super(key, name, description);
      this.modes = modes;
      this.defaultModeIndex = defaultModeIndex;
      this.currentModeIndex = defaultModeIndex;
    }
    currentModeIndex;
    onKeyDown(event) {
      super.onKeyDown(event);
      if (event.key.toUpperCase() === this.key) {
        this.currentModeIndex = (this.currentModeIndex + 1) % this.modes.length;
        this.onModeChange();
      }
    }
    onModeChange() {
    }
    getCurrentMode() {
      return this.modes[this.currentModeIndex];
    }
    isEnabled() {
      return this.currentModeIndex > 0;
    }
    getMenuItem() {
      return `[${this.key}] ${this.name}: ${this.getCurrentMode()}`;
    }
    getDocumentation() {
      return `**${this.name} (toggle key: ${this.key}, modes: ${joinOxfordComma(this.modes.map((mode, i) => i === this.defaultModeIndex ? `${mode} (default)` : mode))})**: ${this.description}`;
    }
  };

  // src/core/modules/MenuModule.ts
  var MenuModule = class extends ToggleModule {
    constructor(key, position, modules) {
      super(key, "Menu", "Displays the status of all features.", ["Off", "On"], 1);
      this.position = position;
      this.modules = modules;
    }
    container = void 0;
    activationKeys = void 0;
    onGameEnter() {
      super.onGameEnter();
      if (this.container === void 0) {
        this.container = this.state.widgets.createWidget(this.position);
        this.activationKeys = new Set(this.modules.map((module) => module.key));
      }
      if (this.isEnabled()) {
        this.setVisible(true);
        this.updateMenu();
      } else {
        this.setVisible(false);
      }
    }
    onModeChange() {
      super.onModeChange();
      if (this.isEnabled()) {
        this.setVisible(true);
        this.updateMenu();
      } else {
        this.setVisible(false);
      }
    }
    onKeyDown(event) {
      super.onKeyDown(event);
      if (this.isEnabled() && this.activationKeys.has(event.key.toUpperCase())) {
        this.updateMenu();
      }
    }
    onKeyUp(event) {
      super.onKeyUp(event);
      if (this.isEnabled() && this.activationKeys.has(event.key.toUpperCase())) {
        this.updateMenu();
      }
    }
    updateMenu() {
      this.container.innerHTML = "";
      this.appendLine(`CookieBot ${GM.info.script.version}`, 18, "white");
      for (const module of this.modules) {
        this.appendLine(module.getMenuItem(), 16, module.isEnabled() ? "green" : "red");
      }
    }
    appendLine(text, size, color) {
      const div = createElement(this.container, "div");
      div.textContent = text;
      div.style.fontSize = `${size}px`;
      div.style.color = color;
    }
    setVisible(visible) {
      this.container.style.display = visible ? "block" : "none";
    }
  };

  // src/core/WidgetContainer.ts
  var WidgetContainer = class {
    element;
    constructor() {
      this.element = createElement(document.body, "div");
      this.element.style.zIndex = "2147483647";
      this.element.style.width = "100vw";
      this.element.style.height = "100vh";
      this.setVisible(false);
    }
    setVisible(visible) {
      this.element.style.display = visible ? "block" : "none";
    }
    createWidget(position) {
      const div = createElement(this.element, "div");
      div.style.position = "absolute";
      div.style.left = position.left;
      div.style.right = position.right;
      div.style.top = position.top;
      div.style.bottom = position.bottom;
      div.style.zIndex = "2147483647";
      div.style.padding = "4px";
      div.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      div.style.fontFamily = "monospace";
      return div;
    }
  };

  // src/core/Script.ts
  var Script = class {
    constructor(websiteName, iconDomain, requires, matchPatterns, changelog, modules, state, menuKey, menuPosition) {
      this.websiteName = websiteName;
      this.iconDomain = iconDomain;
      this.requires = requires;
      this.matchPatterns = matchPatterns;
      this.changelog = changelog;
      this.modules = modules;
      this.state = state;
      const menuModule = new MenuModule(menuKey, menuPosition, modules);
      modules.push(menuModule);
      for (const module of modules) {
        module.state = this.state;
      }
    }
    inGame = false;
    init() {
      this.state.widgets = new WidgetContainer();
      document.addEventListener("keydown", (event) => {
        this.onKeyDown(event);
      });
      document.addEventListener("keyup", (event) => {
        this.onKeyUp(event);
      });
      document.addEventListener("mousedown", (event) => {
        this.onMouseDown(event);
      });
      document.addEventListener("mouseup", (event) => {
        this.onMouseUp(event);
      });
      this.setUp();
    }
    onGameEnter() {
      if (this.inGame) {
        this.onGameExit();
      }
      this.inGame = true;
      this.state.widgets.setVisible(true);
      for (const module of this.modules) {
        module.onGameEnter();
      }
    }
    onGameExit() {
      this.inGame = false;
      this.state.widgets.setVisible(false);
      for (const module of this.modules) {
        module.onGameExit();
      }
    }
    onTick() {
      if (!this.inGame) {
        return;
      }
      for (const module of this.modules) {
        if (module.isEnabled()) {
          module.onTick();
        }
      }
    }
    onKeyDown(event) {
      if (this.shouldSkipEvent(event)) {
        return;
      }
      for (const module of this.modules) {
        module.onKeyDown(event);
      }
    }
    onKeyUp(event) {
      if (this.shouldSkipEvent(event)) {
        return;
      }
      for (const module of this.modules) {
        module.onKeyUp(event);
      }
    }
    onMouseDown(event) {
      if (this.shouldSkipEvent(event)) {
        return;
      }
      for (const module of this.modules) {
        module.onMouseDown(event);
      }
    }
    onMouseUp(event) {
      if (this.shouldSkipEvent(event)) {
        return;
      }
      for (const module of this.modules) {
        module.onMouseUp(event);
      }
    }
    shouldSkipEvent(event) {
      if (!this.inGame) {
        return true;
      }
      const tagName = event.target.tagName;
      return tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "A" || tagName === "BUTTON";
    }
  };

  // src/core/utils/hook.ts
  function hookApply(obj, prop, callback) {
    obj[prop] = new Proxy(obj[prop], {
      apply(target, thisArg, args) {
        const value = callback(...args);
        return value !== void 0 ? value : Reflect.apply(target, thisArg, args);
      }
    });
  }

  // src/scripts/voxiom/modules/AimbotModule.ts
  var AimbotModule = class extends ToggleModule {
    holdingRMB = false;
    constructor() {
      super(
        "Q",
        "Aimbot",
        "Automatically aims at the nearest attackable player. In **Always** mode it always aims automatically, in **RMB** mode only when the right mouse button is held down. Please note that this feature may cause performance issues on less powerful computers because of visibility checks.",
        ["Off", "Always", "RMB"]
      );
    }
    onMouseDown(event) {
      super.onMouseDown(event);
      if (event.button === 2) {
        this.holdingRMB = true;
      }
    }
    onMouseUp(event) {
      super.onMouseUp(event);
      if (event.button === 2) {
        this.holdingRMB = false;
      }
    }
    onTick() {
      super.onTick();
      if (this.getCurrentMode() === "RMB" && !this.holdingRMB) {
        return;
      }
      const camera = this.state.getPlayerCamera();
      if (camera === null) {
        return;
      }
      const opponents = this.state.getOpponents();
      if (opponents.length === 0) {
        return;
      }
      const { Vector3 } = this.state.THREE;
      const targets = opponents.filter((player) => player.visible).map((player) => {
        let node = player.children[1].children[2].children[0];
        const target = new Vector3();
        while (node !== null) {
          target.add(node.position);
          node = node.parent;
        }
        const height = new Vector3().copy(target).sub(player.position).y;
        if (height > 1) {
          target.y += 0.1;
        }
        return target;
      }).sort((a, b) => camera.position.distanceToSquared(a) - camera.position.distanceToSquared(b));
      for (const target of targets) {
        if (this.isVisible(camera, target)) {
          camera.lookAt(target.x, target.y, target.z);
          break;
        }
      }
    }
    isVisible(camera, target) {
      const { Box3, Raycaster, Vector3 } = this.state.THREE;
      const from = camera.position;
      const to = target;
      const direction = new Vector3().subVectors(to, from).normalize();
      const far = new Vector3().subVectors(to, from).length();
      const raycaster = new Raycaster(from, direction, 0, far);
      const lineBox = new Box3(
        new Vector3(Math.min(from.x, to.x), Math.min(from.y, to.y), Math.min(from.z, to.z)),
        new Vector3(Math.max(from.x, to.x), Math.max(from.y, to.y), Math.max(from.z, to.z))
      );
      const chunks = this.state.scene.children[4].children;
      for (const chunk of chunks) {
        if (chunk.geometry.boundingBox === null) {
          chunk.geometry.computeBoundingBox();
        }
        const chunkBox = new Box3().copy(chunk.geometry.boundingBox).applyMatrix4(chunk.matrixWorld);
        const intersections = raycaster.intersectObject(chunk, false).length;
        if (intersections === 0 && chunkBox.containsBox(lineBox)) {
          return true;
        } else if (intersections > 0) {
          return false;
        }
      }
      return true;
    }
  };

  // src/scripts/voxiom/modules/ESPModule.ts
  var ESPModule = class extends ToggleModule {
    boxes = {};
    lines = {};
    constructor() {
      super(
        "V",
        "ESP",
        "Displays lines to other players, as well as lines around player bodies, all visible through other blocks. Attackable players have red lines, friendlies have green lines.",
        ["Off", "On"]
      );
    }
    onModeChange() {
      super.onModeChange();
      if (this.isEnabled()) {
        this.update();
      } else {
        for (const player of this.state.getOtherPlayers()) {
          if (player.espBox !== void 0) {
            player.espBox.visible = false;
            player.espLine.visible = false;
          }
        }
      }
    }
    onTick() {
      super.onTick();
      this.update();
    }
    update() {
      const { BoxHelper, BufferGeometry, Color, Line, LineBasicMaterial, Vector3 } = this.state.THREE;
      const camera = this.state.getPlayerCamera();
      const players = this.state.getOtherPlayers();
      const playerIds = new Set(players.map((p) => p.id));
      for (const id of Object.keys(this.boxes)) {
        if (!playerIds.has(id)) {
          this.boxes[id].visible = false;
          this.lines[id].visible = false;
        }
      }
      for (const player of players) {
        if (!player.visible) {
          if (player.espBox !== void 0) {
            player.espBox.visible = false;
            player.espLine.visible = false;
          }
          continue;
        }
        const playerBox = player.children[1].children[3];
        const boundingBox = playerBox.geometry.boundingBox;
        const height = boundingBox.max.y - boundingBox.min.y;
        const color = this.state.opponentIds.has(player.id) ? 16711680 : 65280;
        if (player.espBox === void 0) {
          const box = new BoxHelper(playerBox, color);
          const lineMaterial = new LineBasicMaterial({ color });
          const lineFrom = new Vector3().copy(camera.position);
          const lineTo = new Vector3(player.position.x, player.position.y + height / 2, player.position.z);
          const lineGeometry = new BufferGeometry().setFromPoints([lineFrom, lineTo]);
          const line = new Line(lineGeometry, lineMaterial);
          this.saveObject(player, box, this.boxes, "espBox");
          this.saveObject(player, line, this.lines, "espLine");
        } else {
          player.espBox.setFromObject(playerBox);
          player.espBox.material.color = new Color(color);
          player.espBox.material.needsUpdate = true;
          player.espBox.visible = true;
          const lineGeometry = player.espLine.geometry;
          lineGeometry.attributes.position.setXYZ(0, camera.position.x, camera.position.y - 1, camera.position.z);
          lineGeometry.attributes.position.setXYZ(
            1,
            player.position.x,
            player.position.y + height / 2,
            player.position.z
          );
          lineGeometry.attributes.position.needsUpdate = true;
          player.espLine.material.color = new Color(color);
          player.espLine.material.needsUpdate = true;
          player.espLine.visible = true;
        }
      }
    }
    saveObject(player, obj, store, playerProp) {
      obj.renderOrder = 1e6;
      obj.material.depthTest = false;
      obj.material.depthWrite = false;
      player[playerProp] = obj;
      store[player.id] = obj;
      this.state.scene.add(obj);
    }
  };

  // src/core/State.ts
  var State = class {
    widgets;
  };

  // src/scripts/voxiom/VoxiomState.ts
  var VoxiomState = class extends State {
    THREE;
    scene;
    cameras;
    opponentIds;
    getPlayerCamera() {
      for (const camera of this.cameras) {
        if (camera.parent === null && camera.children.length === 1) {
          return camera;
        }
      }
      return null;
    }
    getOtherPlayers() {
      return this.scene.children[5].children.filter((p) => {
        const childTypes = new Set(p.children.map((c) => c.type));
        return childTypes.has("Mesh") && childTypes.has("Object3D");
      });
    }
    getOpponents() {
      return this.getOtherPlayers().filter((p) => this.opponentIds.has(p.id));
    }
  };

  // src/scripts/voxiom/VoxiomScript.ts
  var VoxiomScript = class extends Script {
    hasSpriteCounts = {};
    constructor() {
      super(
        "Voxiom.io",
        "voxiom.io",
        [
          "https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.min.js#sha256-ec0a84377f1dce9d55b98f04ac7057376fa5371c33ab1cd907b85ae5f18fab7e"
        ],
        ["https://voxiom.io/*"],
        [
          {
            version: "1.0",
            date: "TODO",
            changes: ["Initial public release."]
          }
        ],
        [new AimbotModule(), new ESPModule()],
        new VoxiomState(),
        "N",
        { right: "0", bottom: "50%" }
      );
    }
    setUp() {
      this.state.THREE = window.THREE;
      delete window.THREE;
      this.state.cameras = /* @__PURE__ */ new Set();
      hookApply(WeakMap.prototype, "set", (key) => {
        if (key.type === "PerspectiveCamera") {
          this.state.cameras.add(key);
        } else if (key.isScene && key.type !== "Scene" && key.children.length === 9) {
          this.state.scene = key;
        }
      });
      hookApply(window, "requestAnimationFrame", () => {
        this.onTick();
      });
      const setUpInterval = setInterval(() => {
        if (this.state.scene !== void 0 && this.state.scene.children[5].children.length > 0) {
          this.onGameEnter();
          clearInterval(setUpInterval);
        }
      }, 100);
    }
    onTick() {
      if (!this.inGame) {
        return;
      }
      super.onTick();
      this.state.opponentIds = /* @__PURE__ */ new Set();
      for (const player of this.state.getOtherPlayers()) {
        if (this.hasSpriteCounts[player.id] === void 0) {
          this.hasSpriteCounts[player.id] = 0;
        }
        if (player.children.some((c) => c.type === "Sprite")) {
          this.hasSpriteCounts[player.id]++;
        } else {
          this.hasSpriteCounts[player.id]--;
        }
        if (this.hasSpriteCounts[player.id] <= 0) {
          this.state.opponentIds.add(player.id);
        }
      }
    }
  };

  // <stdin>
  var script = new VoxiomScript();
  script.init();
})();
