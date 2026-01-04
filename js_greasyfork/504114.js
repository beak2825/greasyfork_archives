/* eslint-disable */
// ==UserScript==
// @name              adjust-figma-toolbelt
// @name:zh-CN        adjust-figma-toolbelt
// @namespace         https://github.com/palmcivet/adjust-figma-toolbelt
// @version           1.0.6
// @license           MIT
// @author            Palm Civet
// @description       adjust-figma-toolbelt is a versatile script designed to enhance your Figma experience by allowing you to reposition the toolbelt with ease.
// @description:zh-CN adjust-figma-toolbelt 是一个用于增强 Figma 体验的脚本，可以轻松地将工具栏调整到想要的位置。
// @match             https://www.figma.com/design/*
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_addStyle
// @grant             GM_registerMenuCommand
// @grant             GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/504114/adjust-figma-toolbelt.user.js
// @updateURL https://update.greasyfork.org/scripts/504114/adjust-figma-toolbelt.meta.js
// ==/UserScript==
(function() {
  "use strict";
  // @license           MIT
  const PREFIX = "adjust";
  const STORAGE_LEFT = `__${PREFIX.toUpperCase()}_LEFT__`;
  const STORAGE_BOTTOM = `__${PREFIX.toUpperCase()}_BOTTOM__`;
  const TOOLBELT_SELECTOR = `[class*="positioned_design_toolbelt--root--"]`;
  const FLOAT_MENU_STYLE = `
${TOOLBELT_SELECTOR} [class*="dropdown--dropdown--"] {
  margin-top: 6px;
  bottom: unset !important;
}

${TOOLBELT_SELECTOR} [class*="scroll_container--clipContainer--"] {
  height: auto !important;
}

${TOOLBELT_SELECTOR} [class*="pointing_dropdown--scrollIndicator--"] {
  display: none !important;
}`;
  const DEFAULT_PADDING = 12;
  const DEFAULT_TOP = 48 + DEFAULT_PADDING;
  const FLOAT_MENU_TOP = 184;
  const LABEL_PIN_DEFAULT_TOP = "⬆️ Pin the toolbelt to the top";
  const LABEL_UNPIN_DEFAULT_TOP = "🔝 The toolbelt is already at the top";
  const LABEL_START_CUSTOM_POSITION = "🎨 Customize the toolbelt position";
  const LABEL_STOP_CUSTOM_POSITION = "💾 Save the position and exit";
  // @license           MIT
  function findToolbeltElement() {
    const element = window.document.querySelector(TOOLBELT_SELECTOR);
    if (!element) {
      return null;
    }
    return element;
  }
  // @license           MIT
  async function getToolbeltPosition() {
    const left = await GM.getValue(STORAGE_LEFT);
    const bottom = await GM.getValue(STORAGE_BOTTOM);
    console.info(`[${PREFIX}] Read persistent data: ${left}, ${bottom}.`);
    return {
      left: left ?? null,
      bottom: bottom ?? DEFAULT_PADDING
    };
  }
  async function setToolbeltPosition({
    left,
    bottom
  }) {
    console.info(`[${PREFIX}] Save persistent data: ${left}, ${bottom}.`);
    await GM.setValue(STORAGE_LEFT, left);
    await GM.setValue(STORAGE_BOTTOM, bottom);
  }
  // @license           MIT
  function createMenuStore() {
    const menuStore2 = /* @__PURE__ */ new Map();
    const _removeMenus = () => {
      for (const menu of menuStore2.values()) {
        GM_unregisterMenuCommand(menu.id);
      }
    };
    const _registerMenus = () => {
      for (const menu of menuStore2.values()) {
        const newId = GM_registerMenuCommand(menu.label, menu.callback);
        menu.id = newId;
      }
    };
    const update = (type, label, callback) => {
      _removeMenus();
      menuStore2.set(type, {
        id: 0,
        label,
        callback
      });
      _registerMenus();
    };
    return {
      update
    };
  }
  function createFloatMenuStore() {
    let styleElement;
    const update = (element) => {
      setTimeout(() => {
        const { top, bottom } = element.getBoundingClientRect();
        const toolbeltBottom = window.innerHeight - bottom;
        console.log(top, FLOAT_MENU_TOP, toolbeltBottom, FLOAT_MENU_TOP);
        if (top < FLOAT_MENU_TOP && toolbeltBottom > FLOAT_MENU_TOP) {
          styleElement = GM_addStyle(FLOAT_MENU_STYLE);
        } else {
          styleElement == null ? void 0 : styleElement.remove();
        }
      }, 1e3);
    };
    return {
      update
    };
  }
  function createTransitionStore() {
    let transitionStyle = null;
    const enable = (element) => {
      if (transitionStyle === null) {
        transitionStyle = element.style.transition;
      }
      element.style.transition = "bottom 0.3s ease-in-out";
    };
    const disable = (element) => {
      if (transitionStyle !== null) {
        element.style.transition = transitionStyle;
      }
    };
    return {
      enable,
      disable
    };
  }
  const menuStore = createMenuStore();
  const floatMenuStore = createFloatMenuStore();
  const transitionStore = createTransitionStore();
  // @license           MIT
  function moveToolbeltToTop(element, top) {
    const { height: toolbeltHeight } = element.getBoundingClientRect();
    const { innerHeight: viewportHeight } = window;
    const bottom = viewportHeight - toolbeltHeight - top;
    element.style.bottom = `${bottom}px`;
    return { left: null, bottom };
  }
  function moveToolbeltToBottom(element, bottom) {
    element.style.bottom = `${bottom}px`;
    return { left: null, bottom };
  }
  async function resizeWindow(element) {
    const { height } = element.getBoundingClientRect();
    const position = await getToolbeltPosition();
    if (position.bottom + height + DEFAULT_PADDING > window.innerHeight) {
      moveToolbeltToTop(element, DEFAULT_TOP);
    } else {
      moveToolbeltToBottom(element, position.bottom);
    }
  }
  async function registerInitialize(element) {
    transitionStore.enable(element);
    const data = await getToolbeltPosition();
    if (data.bottom !== null) {
      moveToolbeltToBottom(element, data.bottom);
      resizeWindow(element);
    }
    floatMenuStore.update(element);
  }
  function registerResizeWindow(element) {
    const onResize = () => {
      resizeWindow(element);
    };
    window.addEventListener("resize", onResize);
    return {
      unregister: () => {
        window.removeEventListener("resize", onResize);
      }
    };
  }
  function bindMouseEvent(element) {
    let isDragging = false;
    let startY = 0;
    let toolbeltY = 0;
    let position;
    const onMouseDown = (event) => {
      event.stopPropagation();
      startY = event.clientY;
      const { y } = element.getBoundingClientRect();
      toolbeltY = y;
      window.document.addEventListener("mousemove", onMouseMove);
      window.document.addEventListener("mouseup", onMouseUp);
      isDragging = true;
    };
    const onMouseMove = (event) => {
      if (!isDragging) {
        return;
      }
      const { clientY } = event;
      const offsetY = clientY - startY;
      position = moveToolbeltToTop(element, toolbeltY + offsetY);
    };
    const onMouseUp = (event) => {
      onMouseMove(event);
      isDragging = false;
      window.document.removeEventListener("mousemove", onMouseMove);
      window.document.removeEventListener("mouseup", onMouseUp);
    };
    return {
      enable: () => {
        element.addEventListener("mousedown", onMouseDown);
      },
      disable: () => {
        element.removeEventListener("mousedown", onMouseDown);
        return position;
      }
    };
  }
  function bindCursorStyle(element) {
    let cursorStyle = "default";
    const enable = () => {
      cursorStyle = element.style.cursor;
      element.style.cursor = "move";
    };
    const disable = () => {
      element.style.cursor = cursorStyle;
    };
    return {
      enable,
      disable
    };
  }
  // @license           MIT
  function registerDefaultMenu(element) {
    const onPin = () => {
      menuStore.update("DEFAULT", LABEL_UNPIN_DEFAULT_TOP, onUnpin);
      const position = moveToolbeltToTop(element, DEFAULT_TOP);
      setToolbeltPosition(position);
      floatMenuStore.update(element);
    };
    const onUnpin = () => {
      menuStore.update("DEFAULT", LABEL_PIN_DEFAULT_TOP, onPin);
      const position = moveToolbeltToBottom(element, DEFAULT_PADDING);
      setToolbeltPosition(position);
      floatMenuStore.update(element);
    };
    menuStore.update("DEFAULT", LABEL_PIN_DEFAULT_TOP, onPin);
  }
  function registerCustomizeMenu(element) {
    const cursorStyle = bindCursorStyle(element);
    const mouseEvent = bindMouseEvent(element);
    const onStart = () => {
      transitionStore.disable(element);
      menuStore.update("CUSTOMIZE", LABEL_STOP_CUSTOM_POSITION, onStop);
      cursorStyle.enable();
      mouseEvent.enable();
    };
    const onStop = () => {
      menuStore.update("CUSTOMIZE", LABEL_START_CUSTOM_POSITION, onStart);
      cursorStyle.disable();
      const position = mouseEvent.disable();
      setToolbeltPosition(position);
      floatMenuStore.update(element);
      transitionStore.enable(element);
    };
    menuStore.update("CUSTOMIZE", LABEL_START_CUSTOM_POSITION, onStart);
  }
  // @license           MIT
  (() => {
    function onReady() {
      const element = findToolbeltElement();
      if (!element) {
        console.error(
          `[${PREFIX}] Can not find figma toolbelt: \`${TOOLBELT_SELECTOR}\`.`
        );
        return;
      }
      registerInitialize(element);
      registerResizeWindow(element);
      registerDefaultMenu(element);
      registerCustomizeMenu(element);
      console.info(`[${PREFIX}] The script is enabled.`);
    }
    const _onload_ = window.onload || function() {
    };
    window.onload = (event) => {
      _onload_(event);
      setTimeout(onReady, 1e3);
    };
  })();
})();
