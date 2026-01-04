// ==UserScript==
// @name		AutoScroll
// @author		Yiero
// @description		全平台自动滚动
// @version		1.0.0
// @namespace		https://github.com/AliubYiero/TamperMonkeyScripts
// @match		https://*/*
// @icon		https://*/favicon.ico
// @license		GPL
// @grant		GM_addStyle
// @grant		GM_registerMenuCommand
// @grant		GM_unregisterMenuCommand
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_deleteValue
// @grant		GM_listValues
// @updateUrl		https://raw.githubusercontent.com/AliubYiero/TamperMonkeyScripts/master/dist/AutoScroll.js
// @downloadUrl		https://raw.githubusercontent.com/AliubYiero/TamperMonkeyScripts/master/dist/AutoScroll.js
// @downloadURL https://update.greasyfork.org/scripts/472556/AutoScroll.user.js
// @updateURL https://update.greasyfork.org/scripts/472556/AutoScroll.meta.js
// ==/UserScript==

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const registerMenu = (title, callback) => {
  return GM_registerMenuCommand(title, function() {
    callback();
  });
};
const unregisterMenu = (menuId) => {
  GM_unregisterMenuCommand(menuId);
};
const createElement = (elementConfig) => {
  const { tagName, className, id, innerHTML, innerText } = elementConfig;
  const element = document.createElement(tagName);
  if (className && typeof className === "string") {
    element.classList.add(className);
  } else if (className && Array.isArray(className)) {
    element.classList.add(...className);
  }
  if (id) {
    element.id = id;
  }
  if (innerHTML) {
    element.innerHTML = innerHTML;
  }
  if (innerText) {
    element.innerText = innerText;
  }
  for (let elementConfigKey in elementConfig) {
    if (["tagName", "className", "id", "innerHTML", "innerText"].indexOf(elementConfigKey) !== -1) {
      continue;
    }
    element.setAttribute(elementConfigKey, elementConfig[elementConfigKey]);
  }
  return element;
};
const addElementToDocument = (element, cssString, fatherElement = document.body) => {
  fatherElement.append(element);
  GM_addStyle(cssString);
};
const tupleToObject = (keyArray, valueArray) => {
  return keyArray.reduce((obj, key, index) => {
    obj[key] = valueArray[index];
    return obj;
  }, {});
};
class GMStorage {
  constructor(key) {
    __publicField(this, "key");
    this.key = key;
  }
  /** 设置/更新键 */
  static set(key, value) {
    GM_setValue(key, value);
  }
  /** 获取值 */
  static get(key, defaultValue = null) {
    return GM_getValue(key, defaultValue);
  }
  /** 移除键 */
  static remove(key) {
    GM_deleteValue(key);
  }
  /** 设置/更新键 */
  set(value) {
    GM_setValue(this.key, value);
  }
  /** 批量设置/更新键 */
  setList(keyValueObject) {
    for (let key in keyValueObject) {
      const value = keyValueObject[key];
      GMStorage.set(key, value);
    }
  }
  /** 获取值 */
  get(defaultValue = null) {
    return GM_getValue(this.key, defaultValue);
  }
  /** 批量获取值 */
  getList(keys, defaultValue = null) {
    const values = [];
    keys.forEach((key) => {
      values.push(GMStorage.get(key, defaultValue));
    });
    return values;
  }
  /** 移除键 */
  remove() {
    GM_deleteValue(this.key);
  }
  /**
   * 返回所有键
   * */
  keys() {
    return GM_listValues();
  }
  /** 返回所有值 */
  values() {
    const values = [];
    const keys = this.keys();
    keys.forEach((key) => {
      values.push(GMStorage.get(key));
    });
    return values;
  }
  /** 返回所有键值对对象 */
  getAll() {
    const keys = this.keys();
    const values = this.values();
    return tupleToObject(keys, values);
  }
  /** 清除所有储存 */
  clear() {
    const keys = this.keys();
    keys.forEach((key) => {
      GMStorage.remove(key);
    });
  }
}
class Prompt {
  constructor(title, confirmCallback, mountedCallback = () => {
  }) {
    __publicField(this, "title");
    __publicField(this, "confirmCallback");
    __publicField(this, "mountedCallback");
    __publicField(this, "promptElement");
    this.title = title;
    this.confirmCallback = confirmCallback;
    this.mountedCallback = mountedCallback;
    this.createElement();
  }
  // 隐藏
  hide() {
    document.querySelector(".custom-prompt__container").classList.add("hide");
  }
  // 展示元素
  show() {
    document.querySelector(".custom-prompt__container").classList.remove("hide");
  }
  createElement() {
    this.promptElement = createElement({
      tagName: "section",
      className: ["custom-prompt__container", "hide"],
      innerHTML: `
		<header>
			<h3 class="custom-prompt__title">${this.title}</h3>
		</header>
		<main>
			<input class="custom-prompt__input" type="text">
		</main>
		<footer class="custom-prompt__confirm-btn">
			<button>确认</button>
			<button>取消</button>
		</footer>
		`
    });
    const cssString = `
			.custom-prompt__container{width:400px;height:125px;background:#f8f8f8;border-radius:15px;box-sizing:border-box;padding:20px;box-shadow:2px 2px #a6a6a6;display:flex;justify-content:center;flex-flow:column;position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:10002}h3.custom-prompt__title{margin:10px -0px}input.custom-prompt__input{width:360px;border:#a6a6a6 2px solid;border-radius:5px;box-sizing:border-box;padding:5px 10px}.custom-prompt__confirm-btn{margin-top:10px;align-self:flex-end}.custom-prompt__confirm-btn>button{padding:3px;border-radius:5px;border:2px #a6a6a6 solid}.custom-prompt__confirm-btn>button:hover{border:2px cornflowerblue solid;color:cornflowerblue}.custom-prompt__container.hide{display:none}
		`;
    const htmlElements = {
      confirmBtn: this.promptElement.querySelector(".custom-prompt__confirm-btn > button:first-of-type"),
      cancelBtn: this.promptElement.querySelector(".custom-prompt__confirm-btn > button:last-of-type"),
      userInputContainer: this.promptElement.querySelector(".custom-prompt__input")
    };
    this.mountedCallback(this.promptElement);
    htmlElements.confirmBtn.addEventListener("click", () => {
      this.confirmCallback(htmlElements.userInputContainer.value, this.promptElement);
      this.hide();
    });
    htmlElements.cancelBtn.addEventListener("click", this.hide);
    document.addEventListener("click", (e) => {
      if (this.promptElement && !this.promptElement.contains(e.target)) {
        this.hide();
      }
    });
    addElementToDocument(this.promptElement, cssString);
  }
}
class Config {
  constructor() {
  }
  // 读取是否滚动(滚动状态)
  get isScroll() {
    return this.isScrollStorage.get(false);
  }
  // 写入是否滚动(滚动状态)
  set isScroll(newScrollStatus) {
    this.isScrollStorage.set(newScrollStatus);
  }
  // 读取滚动速度(一次滚动多少像素)
  get scrollSpeed() {
    return this.scrollSpeedStorage.get(5);
  }
  // 写入滚动速度
  set scrollSpeed(newSpeed) {
    this.scrollSpeedStorage.set(newSpeed);
  }
  // 滚动储存
  get isScrollStorage() {
    return new GMStorage("isScroll");
  }
  // 注册滚动速度储存
  get scrollSpeedStorage() {
    return new GMStorage("scrollSpeed");
  }
}
const config = new Config();
class AutoScroll {
  constructor() {
    __publicField(this, "timer");
  }
  open() {
    this.timer = setInterval(() => {
      /* @__PURE__ */ (() => {
      })("滚动", config.scrollSpeed);
      scrollBy({
        top: config.scrollSpeed,
        behavior: "smooth"
      });
    }, 16);
  }
  close() {
    clearInterval(this.timer);
  }
}
const autoScroll = new AutoScroll();
(async () => {
  const prompt = new Prompt("输入滚动速度 (数字越大滚动速度越快) ", (value) => {
    if (isNaN(+value)) {
      return;
    }
    config.scrollSpeed = +value;
  }, (element) => {
    element.value = String(config.scrollSpeed);
  });
  registerMenu("定义滚动速度", () => {
    prompt.show();
  });
  config.isScroll = false;
  openMenu();
  function openMenu() {
    const openMenuId = registerMenu("[自动滚动] 开启", () => {
      autoScroll.open();
      unregisterMenu(openMenuId);
      const closeMenuId = registerMenu("[自动滚动] 关闭", () => {
        autoScroll.close();
        unregisterMenu(closeMenuId);
        openMenu();
      });
    });
  }
})();
