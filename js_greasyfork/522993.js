// ==UserScript==
// @name           Bilibili 视频时间轴
// @description    根据视频字幕, 生成视频时间轴. 
// @version        1.3.8
// @author         Yiero
// @match          https://www.bilibili.com/video/*
// @run-at         document-start
// @connect        hdslb.com
// @license        GPL-3
// @namespace      https://github.com/AliubYiero/TamperMonkeyScripts
// @grant          GM_addStyle
// @grant          GM_registerMenuCommand
// @grant          GM_unregisterMenuCommand
// @grant          GM_setClipboard
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_addValueChangeListener
// @grant          GM_removeValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/522993/Bilibili%20%E8%A7%86%E9%A2%91%E6%97%B6%E9%97%B4%E8%BD%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/522993/Bilibili%20%E8%A7%86%E9%A2%91%E6%97%B6%E9%97%B4%E8%BD%B4.meta.js
// ==/UserScript==
/* ==UserConfig==
配置项:
    alwaysLoad:
        title: 自动加载时间轴
        description: '页面载入时, 自动加载时间轴到页面中'
        type: checkbox
        default: false
    copyTime:
        title: 自动复制时间
        description: '点击时间的时候, 自动复制时间到粘贴板'
        type: checkbox
        default: false
    copyContent:
        title: 自动复制文本
        description: '点击文本的时候, 自动复制文本到粘贴板'
        type: checkbox
        default: false
    disableSelect:
        title: 禁止选中文本
        description: '如果勾选 [自动复制时间/文本], 对应内容将变为不可拖动选中状态. '
        type: checkbox
        default: false
==/UserConfig== */
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const hookXhr = (hookUrl, callback) => {
  const xhrOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
    const xhr = this;
    if (hookUrl(arguments[1])) {
      const getter = Object.getOwnPropertyDescriptor(
        XMLHttpRequest.prototype,
        "responseText"
      ).get;
      Object.defineProperty(xhr, "responseText", {
        get: () => {
          let result = getter.call(xhr);
          callback(result, arguments[1]);
          return result;
        }
      });
    }
    return xhrOpen.apply(xhr, arguments);
  };
};
const removeTimelineContainer = () => {
  const timelineContainerList = document.querySelectorAll(".timeline-container");
  timelineContainerList.forEach((timelineContainer) => timelineContainer.remove());
};
class CommandMenuManager {
  /**
   * 获取所有按钮列表
   */
  static get() {
    return this.menuCommandList;
  }
  /**
   * 设置按钮
   */
  static set(buttonList) {
    this.menuCommandList = buttonList;
  }
  /**
   * 添加按钮
   */
  static add(...button) {
    this.menuCommandList.push(...button);
  }
  /**
   * 移除所有按钮
   */
  static removeAll() {
    this.menuCommandList.forEach((button) => {
      button.remove();
    });
    this.menuCommandList = [];
  }
  /**
   * 注册所有按钮
   */
  static registerAll() {
    this.menuCommandList.forEach((button) => {
      button.register();
    });
  }
  /**
   * 按索引手动激活某个按钮
   */
  static click(index) {
    const button = this.menuCommandList[index];
    if (!button) return;
    button.click();
  }
}
__publicField(CommandMenuManager, "menuCommandList", []);
class MenuCommand {
  constructor(name, callback) {
    __publicField(this, "menuId", 0);
    this.name = name;
    this.callback = callback;
    this.name = name;
    this.callback = callback;
  }
  /**
   * 注册菜单
   */
  register() {
    this.menuId = GM_registerMenuCommand(this.name, (e) => {
      this.callback(e, this);
    });
  }
  /**
   * 手动激活回调函数
   */
  click() {
    return this.callback(void 0, this);
  }
  /**
   * 移除菜单
   */
  remove() {
    GM_unregisterMenuCommand(this.menuId);
  }
}
const getVideoSubtitleData = async (subtitle) => {
  const subtitleDate = await fetch(subtitle.subtitle_url).then((r) => r.json());
  return subtitleDate.body;
};
const timelineUI = `<!doctype html>
<html lang="zh-cn">
<head>
	<meta charset="UTF-8">
	<meta
		content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
		name="viewport">
	<title>Timeline UI</title>
	<link href="timelineUiStyle.css" rel="stylesheet">

</head>
<body>
<div class="timeline-container">
	<header class="timeline-header">
		<h3 class="timeline-title">
			\u65F6\u95F4\u8F74 - \u4E2D\u6587\uFF08\u81EA\u52A8\u751F\u6210\uFF09
		</h3>
		<section class="timeline-sub-title-container">
			<section class="timeline-sub-button-container">
				<button
					class="timeline-sub-button timeline-active-center-button">
					<span>\u65F6\u95F4\u8F74\u5C45\u4E2D</span>
					<span
						class="timeline-active-button">(on)</span>
					<span class="timeline-not-active-button">(off)</span>
				</button>
				<button
					class="timeline-sub-button timeline-jump-blank-button">
					<span>\u8DF3\u8FC7\u7A7A\u767D</span>
					<span
						class="timeline-active-button">(on)</span>
					<span class="timeline-not-active-button">(off)</span>
					<span class="timeline-tip timeline-reduce-time-tip">
						\u7A7A\u767D\u65F6\u95F4 0 s (00:00:00.00)
					</span>
				</button>
			</section>
			<span class="timeline-video-id">
				<span class="timeline-video-aid">av113752863147248</span>
				<span class="timeline-video-bvid">BV1RE6oYtEaf</span>
			</span>
		</section>
	</header>
	<main class="timeline-content-container">
		<!-- (section.timeline-item>span.timeline-start-time{\u4E8B\u4EF6$}+span.timeline-content{\u5185\u5BB9$})* 100 -->
	</main>
</div>

</body>
</html>
`;
const timelineItemUi = `<!doctype html>
<html lang="zh-cn">
<head>
	<meta charset="UTF-8">
	<meta
		content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
		name="viewport">
	<title>Timeline Item UI</title>
</head>
<body>
<section class="timeline-item">
	<span class="timeline-start-time">\u65F6\u95F4</span>
	<span class="timeline-content">\u5185\u5BB9</span>
</section>
</body>
</html>
`;
const timelineUiStyle = `/* \u4E3B\u5BB9\u5668 */
.timeline-container {
	height: 70vh;
	box-shadow: #d8d8d8 0 0 10px;
	margin-bottom: 24px;
	z-index: 999;
	
	display: flex;
	gap: 8px;
	flex-flow: column;
	border-radius: 4px;
	
	pointer-events: all;
}

/* \u5BBD\u5C4F\u72B6\u6001\u4E0D\u663E\u793A\u65F6\u95F4\u8F74 */
#mirror-vdcon:has(.bpx-player-container[data-screen="wide"]) .timeline-container {
	display: none;
}

/* \u5224\u65AD\u65F6\u95F4/\u6587\u672C\u662F\u5426\u53EF\u4EE5\u9009\u4E2D */
.timeline-container[data-disable-select="true"][data-copy-time="true"] .timeline-start-time,
.timeline-container[data-disable-select="true"][data-copy-content="true"] .timeline-content {
	user-select: none;
}

/* \u5934\u90E8\u5BB9\u5668 */
.timeline-header {
	position: sticky;
	top: 0;
	display: flex;
	flex-flow: column;
	gap: 4px;
	justify-content: center;
	align-items: center;
	background-color: #fff;
	box-shadow: inherit;
	
	padding: 10px 0;
}

/* \u6807\u9898 */
.timeline-title {
	color: #333;
	padding: 0;
	margin: 0;
	font-size: 20px;
}

/* \u526F\u6807\u9898 */
.timeline-sub-title-container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 90%;
	gap: 5vw;
}

/* \u526F\u6807\u9898 (\u89C6\u9891\u7F16\u53F7) */
.timeline-video-id {
	color: #aaaaaa;
	font-size: 12px;
	
	display: flex;
	flex-flow: column;
	justify-content: right;
	align-items: flex-end;
}

/* \u526F\u6807\u9898 (\u65F6\u95F4\u8F74\u5C45\u4E2D\u6309\u94AE - \u5173\u95ED\u72B6\u6001) */
.timeline-sub-button-container {
	display: flex;
	gap: 4px;
}

.timeline-sub-button {
	font-size: 12px;
	padding: 4px 8px;
	outline: none;
	border: none;
	border-radius: 5px;
	background-color: #444;
	color: #ccffff;
}

.timeline-sub-button:hover {
	box-shadow: #aaa 0 0 10px;
}

/* \u526F\u6807\u9898 (\u65F6\u95F4\u8F74\u5C45\u4E2D\u6309\u94AE - \u5F00\u542F\u72B6\u6001) */
.timeline-sub-button.active {
	background-color: #ccffff;
	color: #444;
}

.timeline-active-button {
	display: none;
}

.timeline-not-active-button {
	display: initial;
}

.timeline-sub-button.active {
	& .timeline-active-button {
		display: initial;
	}
	
	& .timeline-not-active-button {
		display: none;
	}
}

/* \u8DF3\u8FC7\u7A7A\u767D \u6309\u94AE */
.timeline-jump-blank-button {
	position: relative;
}

/* \u63D0\u793A\u6846 */
.timeline-tip {
	opacity: 0;
	font-size: 12px;
	position: absolute;
	bottom: -25px;
	margin-top: 5px;
	padding: 4px 8px;
	border-radius: 8px;
	white-space: nowrap;
	left: 50%;
	transform: translateX(-50%);
	background-color: rgba(128, 128, 128, 0.50);
	color: #fff;
	transition: all .3s;
}

.timeline-jump-blank-button:hover .timeline-tip {
	opacity: 1;
}

/* \u65F6\u95F4\u8F74\u5BB9\u5668 */
.timeline-content-container {
	display: flex;
	flex-flow: column;
	overflow-y: auto;
	scrollbar-width: thin;
}

/* \u65F6\u95F4\u8F74\u9879 */
.timeline-item {
	display: flex;
	gap: 8px;
	padding: 4px 16px;
	border-radius: 4px;
	font-size: 14px;
	align-items: center;
}

/* \u6FC0\u6D3B\u7684\u65F6\u95F4\u8F74 */
.timeline-item.active {
	background-color: #ccffff;
	padding: 4px 16px;
	margin: 4px 0;
	font-size: 16px;
}

/* \u9AD8\u4EAE\u663E\u793A\u9F20\u6807\u6D6E\u52A8\u7684\u65F6\u95F4\u8F74 */
.timeline-item:hover {
	background: #ddffff;
}

/* \u65F6\u95F4\u8F74 (\u5F00\u59CB\u65F6\u95F4) */
.timeline-start-time {
	color: #aaa;
	font-size: 12px;
	width: 6em;
}

/* \u65F6\u95F4\u8F74 (\u6587\u672C) */
.timeline-content {
	flex: 1;
	color: #333;
}
`;
const uiCreator = (htmlContent, cssContent) => {
  if (cssContent) {
    GM_addStyle(cssContent);
  }
  const domParser = new DOMParser();
  const uiDoc = domParser.parseFromString(htmlContent, "text/html");
  const documentFragment = new DocumentFragment();
  const filterScriptNodeList = Array.from(uiDoc.body.children).filter((node) => node.nodeName !== "SCRIPT");
  documentFragment.append(...filterScriptNodeList);
  return documentFragment;
};
/*
* @module      : @yiero/gmlib
* @author      : Yiero
* @version     : 0.1.5
* @description : GM Lib for Tampermonkey
* @keywords    : tampermonkey, lib, scriptcat, utils
* @license     : MIT
* @repository  : git+https://github.com/AliubYiero/GmLib.git
*/
const isIframe = () => {
  return Boolean(
    window.frameElement && window.frameElement.tagName === "IFRAME" || window !== window.top
  );
};
function elementWaiter(selector, config = {}) {
  const {
    parent = document.body,
    timeoutPerSecond = 20,
    delayPerSecond = 0.5
  } = config;
  return new Promise((resolve, reject) => {
    const returnElement = (selector2) => {
      setTimeout(() => {
        const element2 = parent.querySelector(selector2);
        if (!element2) {
          reject(new Error("Void Element"));
          return;
        }
        window.dispatchEvent(new CustomEvent("ElementUpdate", { detail: element2 }));
        resolve(element2);
      }, delayPerSecond * 1e3);
    };
    const element = parent.querySelector(selector);
    if (element) {
      returnElement(selector);
      return;
    }
    if (MutationObserver) {
      const timer2 = timeoutPerSecond && window.setTimeout(() => {
        observer.disconnect();
        returnElement(selector);
      }, timeoutPerSecond * 1e3);
      const observeElementCallback = (mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((addNode) => {
            if (addNode.nodeType !== Node.ELEMENT_NODE) {
              return;
            }
            const addedElement = addNode;
            const element2 = addedElement.matches(selector) ? addedElement : addedElement.querySelector(selector);
            if (element2) {
              timer2 && clearTimeout(timer2);
              returnElement(selector);
            }
          });
        });
      };
      const observer = new MutationObserver(observeElementCallback);
      observer.observe(parent, {
        subtree: true,
        childList: true
      });
      return;
    }
    const intervalDelay = 100;
    let intervalCounter = 0;
    const maxIntervalCounter = Math.ceil(timeoutPerSecond * 1e3 / intervalDelay);
    const timer = window.setInterval(() => {
      if (++intervalCounter > maxIntervalCounter) {
        clearInterval(timer);
        returnElement(selector);
        return;
      }
      const element2 = parent.querySelector(selector);
      if (element2) {
        clearInterval(timer);
        returnElement(selector);
      }
    }, intervalDelay);
  });
}
class GMStorage {
  constructor(key, defaultValue) {
    __publicField(this, "listenerId", 0);
    this.key = key;
    this.defaultValue = defaultValue;
    this.key = key;
    this.defaultValue = defaultValue;
  }
  /**
   * 获取当前存储的值
   */
  get() {
    return GM_getValue(this.key, this.defaultValue);
  }
  /**
   * 给当前存储设置一个新值
   */
  set(value) {
    return GM_setValue(this.key, value);
  }
  /**
   * 添加 值 到当前储存的数组尾部.
   *
   * @warn 只能在储存值是数组时使用.
   */
  add(appendValue) {
    const list = this.get();
    if (!Array.isArray(list)) {
      return;
    }
    list.push(appendValue);
    this.set(list);
  }
  /**
   * 移除当前键
   */
  remove() {
    GM_deleteValue(this.key);
  }
  /**
   * 监听元素更新, 同时只能存在 1 个监听器
   */
  updateListener(callback) {
    this.removeListener();
    this.listenerId = GM_addValueChangeListener(this.key, (key, oldValue, newValue, remote) => {
      callback({
        key,
        oldValue,
        newValue,
        remote
      });
    });
  }
  /**
   * 移除元素更新回调
   */
  removeListener() {
    GM_removeValueChangeListener(this.listenerId);
  }
}
const CenterTimelineStorage = new GMStorage("centerTimeline", true);
const JumpBlankStorage = new GMStorage("JumpBlank", false);
const AlwaysLoadStorage = new GMStorage("\u914D\u7F6E\u9879.alwaysLoad", false);
const CopyTimeStorage = new GMStorage("\u914D\u7F6E\u9879.copyTime", false);
const CopyContentStorage = new GMStorage("\u914D\u7F6E\u9879.copyContent", false);
const DisableSelectStorage = new GMStorage("\u914D\u7F6E\u9879.disableSelect", false);
const timelineUIEvent = async (timelineContainer) => {
  const timelineActiveButton = await elementWaiter(
    ".timeline-active-center-button",
    { parent: timelineContainer, delayPerSecond: 0 }
  );
  const isCenterTimeline = CenterTimelineStorage.get();
  isCenterTimeline && timelineActiveButton.classList.add("active");
  const jumpBlankButton = await elementWaiter(
    ".timeline-jump-blank-button",
    { parent: timelineContainer, delayPerSecond: 0 }
  );
  const isJumpBlank = JumpBlankStorage.get();
  isJumpBlank && jumpBlankButton.classList.add("active");
  const isCopyTime = CopyTimeStorage.get();
  const isCopyContent = CopyContentStorage.get();
  const videoContainer = await elementWaiter("video");
  timelineContainer.addEventListener("click", (e) => {
    const element = e.target;
    if (element.closest(".timeline-active-center-button")) {
      timelineActiveButton.classList.toggle("active");
      CenterTimelineStorage.set(!CenterTimelineStorage.get());
    }
    if (element.closest(".timeline-jump-blank-button")) {
      jumpBlankButton.classList.toggle("active");
      JumpBlankStorage.set(!JumpBlankStorage.get());
    }
    const timelineItem = element.closest(".timeline-item");
    if (timelineItem) {
      videoContainer.currentTime = Number(timelineItem.dataset.from) || 0;
    }
    if (isCopyTime && element.classList.contains("timeline-start-time")) {
      GM_setClipboard(element.textContent || "");
    }
    if (isCopyContent && element.classList.contains("timeline-content")) {
      GM_setClipboard(element.textContent || "");
    }
  });
};
const toTimeString = (second) => {
  const date = new Date(second);
  return [
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  ].map((time) => time.toString().padStart(2, "0")).join(":") + `.${Math.round(date.getUTCMilliseconds() / 10).toString().padStart(2, "0")}`;
};
const parseTimelineItemHtmlContent = (subtitleData, timelineHtmlContent) => {
  const startTime = toTimeString(subtitleData.from * 1e3);
  const content = subtitleData.content;
  let addedTimelineItemHtmlContent = timelineHtmlContent;
  [["\u65F6\u95F4", startTime], ["\u5185\u5BB9", content]].forEach(([replacer, replaceValue]) => {
    addedTimelineItemHtmlContent = addedTimelineItemHtmlContent.replace(replacer, replaceValue);
  });
  const datasetInfoList = [];
  for (let subtitleDataKey in subtitleData) {
    const subtitleDataValue = subtitleData[subtitleDataKey];
    datasetInfoList.push(`data-${subtitleDataKey}="${subtitleDataValue}"`);
  }
  return addedTimelineItemHtmlContent.replace(new RegExp('(?<=<section class="timeline-item")'), ` ${datasetInfoList.join(" ")}`);
};
const timelineUiImporter = async (subtitleDataList, subtitleTitle) => {
  const containerDocumentFragment = uiCreator(timelineUI, timelineUiStyle);
  const timelineContainer = await elementWaiter(
    ".timeline-container",
    { parent: containerDocumentFragment, delayPerSecond: 0 }
  );
  [
    ["disableSelect", DisableSelectStorage.get()],
    ["copyTime", CopyTimeStorage.get()],
    ["copyContent", CopyContentStorage.get()]
  ].forEach(([datasetKey, value]) => {
    timelineContainer.dataset[datasetKey] = String(value);
  });
  const timelineContentContainer = await elementWaiter(
    ".timeline-content-container",
    { parent: timelineContainer, delayPerSecond: 0 }
  );
  const title = await elementWaiter(".timeline-title", {
    parent: timelineContainer,
    delayPerSecond: 0
  });
  title.textContent = `\u65F6\u95F4\u8F74 - ${subtitleTitle}`;
  const videoAid = await elementWaiter(".timeline-video-aid", {
    parent: timelineContainer,
    delayPerSecond: 0
  });
  const { aid, bvid } = PlayerInfo.get().data;
  const videoBvId = await elementWaiter(".timeline-video-bvid", {
    parent: timelineContainer,
    delayPerSecond: 0
  });
  videoAid.textContent = `av${aid}`;
  videoBvId.textContent = bvid;
  const reduceTimeWithJumpBlank = subtitleDataList.reduce((reduceTime, item, index) => {
    if (index === 0) return reduceTime;
    const prevItem = subtitleDataList[index - 1];
    reduceTime += item.from - prevItem.to;
    return reduceTime;
  }, 0);
  elementWaiter(".timeline-reduce-time-tip", { delayPerSecond: 0 }).then((tipElement) => {
    tipElement.textContent = `\u7A7A\u767D\u65F6\u95F4 ${Math.ceil(reduceTimeWithJumpBlank)} s (${toTimeString(reduceTimeWithJumpBlank * 1e3)})`;
  });
  const itemDocumentFragment = uiCreator(timelineItemUi);
  const timelineItem = await elementWaiter(".timeline-item", {
    parent: itemDocumentFragment,
    delayPerSecond: 0
  });
  const subtitleContentList = [];
  for (const subtitleData of subtitleDataList) {
    const addedTimelineItemHtmlContent = parseTimelineItemHtmlContent(subtitleData, timelineItem.outerHTML);
    subtitleContentList.push(addedTimelineItemHtmlContent);
  }
  timelineContentContainer.innerHTML = subtitleContentList.join("");
  const rightContainer = await elementWaiter(".right-container-inner");
  const rightItemList = Array.from(document.querySelectorAll(".right-container-inner > *"));
  const upPanelContainer = await elementWaiter(".up-panel-container", { delayPerSecond: 1 });
  const newRightItemList = [
    upPanelContainer,
    timelineContainer,
    ...rightItemList.filter((item) => !item.classList.contains("up-panel-container"))
  ];
  newRightItemList.forEach((item) => rightContainer.appendChild(item));
  await timelineUIEvent(timelineContainer);
  return {
    container: timelineContainer,
    contentContainer: timelineContentContainer,
    itemList: Array.from(timelineContentContainer.querySelectorAll(".timeline-item"))
  };
};
function inRange(number, start, end) {
  const isTypeSafe = typeof number === "number" && typeof start === "number" && (typeof end === "undefined" || typeof end === "number");
  if (!isTypeSafe) {
    return false;
  }
  if (typeof end === "undefined") {
    end = start;
    start = 0;
  }
  return number >= Math.min(start, end) && number < Math.max(start, end);
}
const scrollBy = (container, targetElement, scrollPercent) => {
  const {
    top: containerTop,
    height: containerHeight
  } = container.getBoundingClientRect();
  const { top: targetTop } = targetElement.getBoundingClientRect();
  const yOffset = targetTop - containerTop - containerHeight * scrollPercent;
  container.scrollBy({
    top: yOffset,
    behavior: "smooth"
  });
};
const createTimelineContainer = async (subtitle) => {
  const subtitleDataList = await getVideoSubtitleData(subtitle);
  const uiTarget = await timelineUiImporter(subtitleDataList, subtitle.lan_doc);
  const {
    contentContainer: timelineContentContainer,
    itemList: timelineItemList
  } = uiTarget;
  let currentIndex = 0;
  CenterTimelineStorage.updateListener(({ newValue }) => {
    if (!newValue) return;
    scrollBy(timelineContentContainer, timelineItemList[currentIndex], 0.3);
  });
  elementWaiter("video").then((video) => {
    video.addEventListener("timeupdate", () => {
      const {
        from: startTime,
        to: endTime
      } = subtitleDataList[currentIndex];
      const {
        from: nextStartTime = endTime,
        to: nextEndTime = endTime
      } = subtitleDataList[currentIndex + 1] || {};
      let videoPlayStat = 3;
      const { currentTime } = video;
      if (inRange(currentTime, startTime, endTime)) {
        videoPlayStat = 0;
      } else if (inRange(currentTime, endTime, nextStartTime)) {
        videoPlayStat = 1;
      } else if (inRange(currentTime, nextStartTime, nextEndTime)) {
        videoPlayStat = 2;
      }
      if (videoPlayStat === 0) {
        const { classList } = timelineItemList[currentIndex];
        !classList.contains("active") && classList.add("active");
        return;
      }
      if (videoPlayStat === 1 && JumpBlankStorage.get()) {
        video.currentTime = nextStartTime;
        return;
      }
      if (videoPlayStat === 2) {
        timelineItemList[currentIndex].classList.remove("active");
        timelineItemList[++currentIndex].classList.add("active");
      } else {
        timelineItemList[currentIndex].classList.remove("active");
        const currentSubtitle = subtitleDataList.find((subtitleData) => currentTime <= subtitleData.from);
        if (!currentSubtitle) return;
        currentIndex = currentSubtitle.sid - 1;
        timelineItemList[currentIndex].classList.add("active");
      }
      if (CenterTimelineStorage.get()) {
        scrollBy(timelineContentContainer, timelineItemList[currentIndex], 0.3);
      }
    });
  });
};
const LockedTimelineMenuCommand = new MenuCommand("\u5F53\u524D\u89C6\u9891\u6CA1\u6709\u5B57\u5E55", async () => {
});
class isLoading {
  static get stat() {
    return this.isLoading;
  }
  static set(stat) {
    this.isLoading = stat;
  }
  static toggle() {
    this.isLoading = !this.isLoading;
  }
}
__publicField(isLoading, "isLoading", false);
const registerTimelineButton = async (playerInfo) => {
  if (!playerInfo) return Promise.resolve([]);
  const videoSubtitleList = playerInfo.data.subtitle.subtitles || [];
  if (!videoSubtitleList.length) {
    return Promise.resolve([LockedTimelineMenuCommand]);
  }
  return videoSubtitleList.map((subtitle) => {
    const TimeLineMenuCommand = new MenuCommand(`\u751F\u6210\u89C6\u9891\u65F6\u95F4\u8F74 - ${subtitle.lan_doc}`, async () => {
      if (isLoading.stat) {
        return;
      }
      isLoading.set(true);
      /* @__PURE__ */ (() => {
      })("\u751F\u6210\u65F6\u95F4\u8F74: ", subtitle.lan_doc);
      removeTimelineContainer();
      await createTimelineContainer(subtitle);
      isLoading.set(false);
    });
    TimeLineMenuCommand.register();
    return TimeLineMenuCommand;
  });
};
const registerButtons = async (playerInfo) => {
  CommandMenuManager.removeAll();
  const FreshCommandMenu = new MenuCommand("\u5237\u65B0", () => {
    registerButtons(PlayerInfo.get());
  });
  CommandMenuManager.add(FreshCommandMenu);
  CommandMenuManager.add(...await registerTimelineButton(playerInfo));
  CommandMenuManager.registerAll();
  if (AlwaysLoadStorage.get()) {
    elementWaiter(".video-page-card-small", { parent: document }).then(() => {
      const buttonList = CommandMenuManager.get();
      const timelineButton = buttonList.find((button) => button.name !== "\u5237\u65B0");
      if (!timelineButton) return;
      timelineButton.click();
    });
  }
};
class PlayerInfo {
  static get() {
    return this.playerInfo;
  }
  static set(playerInfo) {
    this.playerInfo = playerInfo;
  }
}
__publicField(PlayerInfo, "playerInfo");
const handleHookBaseInfo = () => {
  hookXhr(
    (url) => {
      return url.startsWith("https://api.bilibili.com/x/player/wbi/v2") || url.startsWith("//api.bilibili.com/x/player/wbi/v2");
    },
    async (responseText) => {
      PlayerInfo.set(JSON.parse(responseText));
      removeTimelineContainer();
      await registerButtons(PlayerInfo.get());
    }
  );
};
(async () => {
  if (isIframe()) {
    return;
  }
  handleHookBaseInfo();
})();
