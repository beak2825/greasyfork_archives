// ==UserScript==
// @name         backpack tool
// @namespace    https://github.com/zhowiny
// @version      0.2.2
// @author       oooooyoung & zhowiny
// @description  backpack script 刷成交量脚本,支持手动开启关闭,设置买入卖出点
// @icon         https://backpack.exchange/favicon-32x32.png
// @match        https://backpack.exchange/trade/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.24/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/491346/backpack%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/491346/backpack%20tool.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(' *,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }.pointer-events-auto{pointer-events:auto}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.-bottom-5{bottom:-1.25rem}.left-1\\/2{left:50%}.mt-4{margin-top:1rem}.flex{display:flex}.grid{display:grid}.h-1{height:.25rem}.h-12{height:3rem}.h-2{height:.5rem}.h-full{height:100%}.w-12{width:3rem}.flex-1{flex:1 1 0%}.-translate-x-1\\/2{--tw-translate-x: -50%;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.-translate-y-\\[90\\%\\]{--tw-translate-y: -90%;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.gap-2{gap:.5rem}.self-center{align-self:center}.overflow-y-auto{overflow-y:auto}.rounded{border-radius:.25rem}.rounded-full{border-radius:9999px}.border{border-width:1px}.border-t{border-top-width:1px}.bg-black{--tw-bg-opacity: 1;background-color:rgb(0 0 0 / var(--tw-bg-opacity))}.bg-black\\/25{background-color:#00000040}.p-2{padding:.5rem}.px-2{padding-left:.5rem;padding-right:.5rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.pt-2{padding-top:.5rem}.text-center{text-align:center}.font-sans{font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xs{font-size:.75rem;line-height:1rem}.text-gray-500{--tw-text-opacity: 1;color:rgb(107 114 128 / var(--tw-text-opacity))}.text-white{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.opacity-10{opacity:.1}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.hover\\:underline:hover{text-decoration-line:underline} ');

(function (vue) {
  'use strict';

  const LANG_MAP = {
    Limit: "限价",
    Market: "市价",
    Max: "最大",
    Buy: "购买",
    Sell: "出售",
    Cancel: "取消",
    Balances: "余额"
  };
  const MIN_WAIT_MS = 300;
  const MAX_WAIT_MS = 2e3;
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const getRandomWait = (min, max) => Math.floor(Math.random() * max + min);
  function findElementsByText(text, tag, parent = document) {
    const elements = parent.querySelectorAll(`${tag}:not(:empty):not(:has(*))`);
    return Array.from(elements).filter((ele) => ele.textContent === text || ele.textContent === LANG_MAP[text]);
  }
  function getElement(text, tag) {
    let element = findElementsByText(text, tag)[0];
    if (!element) {
      element = findElementsByText(LANG_MAP[text] || text, tag)[0];
      if (!element)
        return;
    }
    return element;
  }
  function clickElementByText(text, tag) {
    const element = getElement(text, tag);
    if (!element || !window.running)
      return;
    triggerEvent(element);
  }
  function triggerEvent(element, type = "click", position = ({ x, width, y, height }) => ({
    x: x + width * 0.5,
    y: y + height * 0.5
  })) {
    if (!element) {
      console.warn("missing element");
      return;
    }
    const domRect = element.getBoundingClientRect();
    let x = domRect.x;
    let y = domRect.y;
    if (typeof position === "function") {
      const pos = position(domRect);
      x = pos.x;
      y = pos.y;
    } else if (typeof position === "object" && Object.keys(position).includes("x")) {
      x = position.x;
      y = position.y;
    }
    const evt = new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y
    });
    element.dispatchEvent(evt);
  }
  function useBackpackHelper() {
    const countState = vue.ref({
      buyCount: 0,
      sellCount: 0,
      cancelCount: 0
    });
    function getPriceCnt() {
      return document.querySelector(".flex.flex-col.no-scrollbar.h-full.flex-1.overflow-y-auto.font-sans");
    }
    function getPriceElement(type, num) {
      const isBuy = type === "Buy";
      const priceCnt = getPriceCnt();
      return priceCnt.querySelector(`& > div:${isBuy ? "last" : "first"}-child > div > div:nth-child(${num}) button div > div:nth-child(3)`);
    }
    function setPrice(type, num) {
      const price = getPriceElement(type, num);
      price.classList.add("border");
      price.click();
    }
    async function setQuantity(percent = 0) {
      let slider = document.querySelector('div[aria-label="Percentage Slider"] > div.h-1');
      if (!slider) {
        slider = document.querySelector('div[aria-label="百分比滑块"] > div.h-1');
      }
      const calcPosition = ({ x, width, y, height }) => ({
        x: x + width * percent,
        y: y + height * 0.5
      });
      triggerEvent(slider, "mousedown", calcPosition);
      await sleep(50);
      triggerEvent(slider, "mouseup", calcPosition);
    }
    function clickTradeButton(type) {
      const button = document.querySelector("div.flex ~ button[data-rac].text-center.h-12");
      const element = getElement(type, "div");
      if (!element || button.disabled)
        return;
      button.addEventListener("click", () => {
        if (type === "Buy") {
          countState.value.buyCount++;
          console.log(`%c第${countState.value.buyCount}次买入`, "color: #afa;");
        } else {
          countState.value.sellCount++;
          console.log(`%c第${countState.value.sellCount}次卖出`, "color: #faf;");
        }
      }, { once: true });
      triggerEvent(element);
    }
    async function randomWaitFn(fn, ms) {
      await fn();
      await sleep(ms || getRandomWait(MIN_WAIT_MS, MAX_WAIT_MS));
    }
    async function executeTrade(type, params) {
      if (!window.running)
        return console.log("已暂停");
      await randomWaitFn(() => clickElementByText(type, "button"));
      await randomWaitFn(() => clickElementByText(params.mode || "Limit", "div"));
      if (params.mode === "Limit")
        await randomWaitFn(() => setPrice(type, params[type]), 300);
      await randomWaitFn(() => setQuantity(0), 300);
      await randomWaitFn(() => setQuantity(1));
      await randomWaitFn(() => clickTradeButton(type));
    }
    async function performTradeCycle(params) {
      try {
        await executeTrade("Buy", params);
        await sleep(3e3);
        await executeTrade("Sell", params);
      } catch (error) {
        console.error("发生错误:", error);
      }
    }
    const orderTimeoutMap = /* @__PURE__ */ new Map();
    function checkOrderTimeout(orderList) {
      orderList.forEach((order) => {
        const timeoutTime = orderTimeoutMap.get(order.orderText);
        if (!timeoutTime)
          return;
        if (Date.now() > timeoutTime) {
          order.cancel();
          orderTimeoutMap.delete(order.orderText);
          countState.value.cancelCount++;
          console.log(`%c订单【${order.orderText}】超时未成交，已取消！订单取消次数：${countState.value.cancelCount}`, "color: #ffa;");
        }
      });
    }
    function getTabs() {
      const anchorElement = findElementsByText("Balances", "div")[0];
      const tabsElement = anchorElement.parentElement;
      const openOrderTab = tabsElement.children[3];
      return {
        openOrderTab,
        tabsElement
      };
    }
    const getOrderListElement = (tabsElement) => tabsElement.parentElement.parentElement.parentElement.querySelector("tbody");
    function getOrderList(tradingParams) {
      const element = getOrderListElement(getTabs().tabsElement);
      const { timeout = 0 } = tradingParams;
      return [...(element == null ? void 0 : element.children) ?? []].reduce((res, ele) => {
        const orderText = ele.textContent;
        if (orderText.includes("No open Orders"))
          return [];
        const order = {
          orderText,
          ele,
          cancel: () => findElementsByText("Cancel", "button", ele)[0].click(),
          data: ele.textContent.split("\n").filter((i) => i)
        };
        res.push(order);
        const timeoutTime = timeout ? orderTimeoutMap.get(orderText) || Date.now() + timeout * 1e3 : 0;
        orderTimeoutMap.set(orderText, timeoutTime);
        return res;
      }, []);
    }
    return {
      countState,
      getPriceElement,
      performTradeCycle,
      checkOrderTimeout,
      getTabs,
      getOrderList
    };
  }
  const _hoisted_1 = /* @__PURE__ */ vue.createElementVNode("span", null, "限价：", -1);
  const _hoisted_2 = ["disabled"];
  const _hoisted_3 = /* @__PURE__ */ vue.createElementVNode("span", null, "市场：", -1);
  const _hoisted_4 = ["disabled"];
  const _hoisted_5 = ["disabled"];
  const _hoisted_6 = ["disabled"];
  const _hoisted_7 = /* @__PURE__ */ vue.createElementVNode("span", null, "超时时间(秒):", -1);
  const _hoisted_8 = ["disabled"];
  const _hoisted_9 = /* @__PURE__ */ vue.createElementVNode("p", {
    class: "text-xs mt-4 px-2 pt-2 border-t",
    style: { "grid-area": "b" }
  }, [
    /* @__PURE__ */ vue.createTextVNode(" 超时时间：超时自动取消订单，"),
    /* @__PURE__ */ vue.createElementVNode("code", null, "0"),
    /* @__PURE__ */ vue.createTextVNode("为不取消！ "),
    /* @__PURE__ */ vue.createElementVNode("span", { class: "text-gray-500" }, [
      /* @__PURE__ */ vue.createTextVNode(" (author: "),
      /* @__PURE__ */ vue.createElementVNode("a", {
        class: "hover:underline",
        href: "https://x.com/ouyoung11",
        target: "_blank"
      }, "oooooyoung"),
      /* @__PURE__ */ vue.createTextVNode(" & "),
      /* @__PURE__ */ vue.createElementVNode("a", {
        class: "hover:underline",
        href: "https://x.com/zhowiny",
        target: "_blank"
      }, "zhowiny"),
      /* @__PURE__ */ vue.createTextVNode(") ")
    ])
  ], -1);
  const _hoisted_10 = { style: { "color": "#afa" } };
  const _hoisted_11 = { style: { "color": "#faf" } };
  const _hoisted_12 = { style: { "color": "#ffa" } };
  const _sfc_main$1 = {
    __name: "BackpackTool",
    setup(__props) {
      const {
        countState,
        performTradeCycle,
        checkOrderTimeout,
        getTabs,
        getPriceElement,
        getOrderList
      } = useBackpackHelper();
      const expand = vue.ref(true);
      const running = vue.ref(false);
      const tradingParams = vue.ref({
        Buy: 2,
        Sell: 2,
        timeout: 0,
        mode: "Market"
      });
      const currentOrder = vue.ref([]);
      function handleNumberInput(e, type, options = { min: 1, max: 20 }) {
        const { min, max } = options;
        let value = Number.parseInt(e.target.value);
        if (value > max)
          value = max;
        if (value < min || Number.isNaN(value))
          value = min;
        tradingParams.value[type] = Math.max(min, Math.min(max, value));
      }
      async function startTrading() {
        await performTradeCycle(tradingParams.value);
        await sleep(3e3);
        if (running.value)
          window.requestAnimationFrame(() => startTrading());
      }
      async function queryOrderListTask() {
        const { openOrderTab } = getTabs();
        openOrderTab.click();
        await sleep(300);
        const orderList = getOrderList(tradingParams.value);
        currentOrder.value = orderList;
        checkOrderTimeout(orderList);
        await sleep(2e3);
        if (running.value)
          window.requestAnimationFrame(() => queryOrderListTask());
      }
      async function handleStart() {
        window.running = running.value = !running.value;
        console.log(running.value ? "start" : "stop");
        running.value && await startTrading();
        running.value && await queryOrderListTask();
        !running.value && getPriceElement("Buy", tradingParams.value.Buy).classList.remove("border");
        !running.value && getPriceElement("Sell", tradingParams.value.Sell).classList.remove("border");
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(["backpack-tool transition grid gap-2 text-sm text-white bg-base-700 p-2 rounded relative pointer-events-auto", { "-translate-y-[90%]": expand.value }]),
          style: { "grid-template-areas": "'a a . .' 'a a . .' 'a a . .' 'a a . .' 'b b b b' '. . . .'" }
        }, [
          vue.createElementVNode("button", {
            class: vue.normalizeClass(["bg-greenText rounded p-2 h-12 self-center", { "bg-redText": running.value }]),
            style: { "grid-area": "a" },
            onClick: handleStart
          }, vue.toDisplayString(running.value ? "脚本运行中,点击关闭交易" : "启动脚本,点击开始交易"), 3),
          vue.createElementVNode("label", null, [
            _hoisted_1,
            vue.withDirectives(vue.createElementVNode("input", {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => tradingParams.value.mode = $event),
              type: "radio",
              value: "Limit",
              disabled: running.value
            }, null, 8, _hoisted_2), [
              [vue.vModelRadio, tradingParams.value.mode]
            ])
          ]),
          vue.createElementVNode("label", null, [
            _hoisted_3,
            vue.withDirectives(vue.createElementVNode("input", {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => tradingParams.value.mode = $event),
              type: "radio",
              value: "Market",
              disabled: running.value
            }, null, 8, _hoisted_4), [
              [vue.vModelRadio, tradingParams.value.mode]
            ])
          ]),
          vue.createElementVNode("span", {
            class: vue.normalizeClass({ "opacity-10": tradingParams.value.mode === "Market" })
          }, "第几个买入:", 2),
          vue.withDirectives(vue.createElementVNode("input", {
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => tradingParams.value.Buy = $event),
            class: vue.normalizeClass(["w-12 h-2 py-2 text-center bg-black text-greenText", { "bg-black/25": running.value, "opacity-10": tradingParams.value.mode === "Market" }]),
            type: "number",
            min: 1,
            max: 20,
            step: 1,
            disabled: running.value || tradingParams.value.mode === "Market",
            onInput: _cache[3] || (_cache[3] = (e) => handleNumberInput(e, "Buy"))
          }, null, 42, _hoisted_5), [
            [
              vue.vModelText,
              tradingParams.value.Buy,
              void 0,
              { number: true }
            ]
          ]),
          vue.createElementVNode("span", {
            class: vue.normalizeClass({ "opacity-10": tradingParams.value.mode === "Market" })
          }, "第几个卖出:", 2),
          vue.withDirectives(vue.createElementVNode("input", {
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => tradingParams.value.Sell = $event),
            class: vue.normalizeClass(["w-12 h-2 py-2 text-center bg-black text-redText", { "bg-black/25": running.value, "opacity-10": tradingParams.value.mode === "Market" }]),
            type: "number",
            min: 1,
            max: 20,
            step: 1,
            disabled: running.value || tradingParams.value.mode === "Market",
            onInput: _cache[5] || (_cache[5] = (e) => handleNumberInput(e, "Sell"))
          }, null, 42, _hoisted_6), [
            [
              vue.vModelText,
              tradingParams.value.Sell,
              void 0,
              { number: true }
            ]
          ]),
          _hoisted_7,
          vue.withDirectives(vue.createElementVNode("input", {
            "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => tradingParams.value.timeout = $event),
            class: vue.normalizeClass(["w-12 h-2 py-2 text-center bg-black text-accentBlue", { "bg-black/25": running.value }]),
            type: "number",
            min: 0,
            max: 600,
            step: 1,
            disabled: running.value,
            onInput: _cache[7] || (_cache[7] = (e) => handleNumberInput(e, "timeout", { min: 0, max: 600 }))
          }, null, 42, _hoisted_8), [
            [
              vue.vModelText,
              tradingParams.value.timeout,
              void 0,
              { number: true }
            ]
          ]),
          _hoisted_9,
          vue.createElementVNode("div", null, "当前订单数：" + vue.toDisplayString(currentOrder.value.length), 1),
          vue.createElementVNode("div", null, [
            vue.createTextVNode("买入次数："),
            vue.createElementVNode("span", _hoisted_10, vue.toDisplayString(vue.unref(countState).buyCount), 1)
          ]),
          vue.createElementVNode("div", null, [
            vue.createTextVNode("卖出次数："),
            vue.createElementVNode("span", _hoisted_11, vue.toDisplayString(vue.unref(countState).sellCount), 1)
          ]),
          vue.createElementVNode("div", null, [
            vue.createTextVNode("取消次数："),
            vue.createElementVNode("span", _hoisted_12, vue.toDisplayString(vue.unref(countState).cancelCount), 1)
          ]),
          vue.createElementVNode("div", {
            class: "cursor-pointer rounded-full bg-base-700 text-xs p-2 text-center absolute left-1/2 -translate-x-1/2 -bottom-5",
            onClick: _cache[8] || (_cache[8] = ($event) => expand.value = !expand.value)
          }, vue.toDisplayString(expand.value ? "↓展开" : "↑收起") + vue.toDisplayString(running.value ? "(运行中...)" : ""), 1)
        ], 2);
      };
    }
  };
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(_sfc_main$1);
      };
    }
  };
  const containerID = "tampermonkey_vue_app".toUpperCase();
  vue.createApp(_sfc_main).mount((() => {
    const app = document.createElement("div");
    app.id = containerID;
    app.style.cssText = "position: fixed;top: 10px;left:50%;z-index:1000;transform: translateX(-50%);pointer-events: none;";
    document.body.append(app);
    return app;
  })());

})(Vue);