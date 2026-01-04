// ==UserScript==
// @name         评教助手
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  新余学院评教
// @author       xie feng
// @match        http://jwxt.xyc.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428488/%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/428488/%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/evaluate.js":
/*!*************************!*\
  !*** ./src/evaluate.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "confirmStart": () => (/* binding */ confirmStart),
/* harmony export */   "checkEvaluations": () => (/* binding */ checkEvaluations),
/* harmony export */   "autoEvaluate": () => (/* binding */ autoEvaluate),
/* harmony export */   "handleEvaluates": () => (/* binding */ handleEvaluates)
/* harmony export */ });
/* harmony import */ var _notificate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./notificate */ "./src/notificate.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.js");



const confirmStart = async () => {
  const start = window.confirm('是否开始开始评教?');
  if (start) {
    if (!await (0,_utils__WEBPACK_IMPORTED_MODULE_1__.testOpenWindow)()) {
      (0,_notificate__WEBPACK_IMPORTED_MODULE_0__.notificate)('提示', '取消自主评教');
      return;
    }
    (0,_notificate__WEBPACK_IMPORTED_MODULE_0__.notificate)('提示', '即将开始自动评教');
    await (0,_utils__WEBPACK_IMPORTED_MODULE_1__.delay)(1000);
    $('.wap a')[1].click();
  } else {
    (0,_notificate__WEBPACK_IMPORTED_MODULE_0__.notificate)('提示', '取消自主评教');
  }
}

const checkEvaluations = async () => {
  const links = $('tr').eq(2).find('td').eq(-1).find('a');
  if (!links.length) {
    (0,_notificate__WEBPACK_IMPORTED_MODULE_0__.notificate)('提示', '暂无评教，请关闭脚本。');
  } else {
    (0,_notificate__WEBPACK_IMPORTED_MODULE_0__.notificate)('提示', '即将进入评教页面');
    await (0,_utils__WEBPACK_IMPORTED_MODULE_1__.delay)(800);
    links[0].click();
  }
}

const autoEvaluate = async () => {
  window.alert = () => true;
  window.confirm = () => true;
  $('#table1 tbody tr td:odd')
    .find('input:first-child')
    .click().end().eq(0).find('input:nth-child(3)').click();
  $('#tj').click();
  await (0,_utils__WEBPACK_IMPORTED_MODULE_1__.delay)(100);
  window.close();
}

const handleEvaluates = async () => {

  // 简单考虑有人直接进入该页面的情况（测试窗口拦截），别的复杂情况就不判断了
  if (!await (0,_utils__WEBPACK_IMPORTED_MODULE_1__.testOpenWindow)()) {
    (0,_notificate__WEBPACK_IMPORTED_MODULE_0__.notificate)('提示', '取消自主评教');
    return;
  }

  const count = $('.Nsb_r_list_fy3 span').html().trim().slice(1, 2);
  const cur = $('#pageIndex').val();

  // 这一页所有需要评价的列表
  const list = Array.from($('tr td a')).filter(a => a.innerText.includes('评价'));

  // 下一页评价的按钮
  const nextBtn = $('#PagingControl1_btnNextPage').get(0);
  // 查看是否有下一页
  const hasNext = nextBtn.getAttribute('disabled') !== "disabled";

  if (!list.length && hasNext) {
    nextBtn.click();
  } else if (!list.length && !hasNext) {
    window.sessionStorage.setItem('complete', 1);
    (0,_utils__WEBPACK_IMPORTED_MODULE_1__.notifySuccess)();
    return;
  }

  (0,_notificate__WEBPACK_IMPORTED_MODULE_0__.notificate)('提示', '开始评教', 1000);

  await (0,_utils__WEBPACK_IMPORTED_MODULE_1__.delay)(500);

  (0,_notificate__WEBPACK_IMPORTED_MODULE_0__.notificate)('提示', `正在评教 ${cur} / ${count}，请等待。`, null);

  for (const a of list) {
    a.click();
    await (0,_utils__WEBPACK_IMPORTED_MODULE_1__.delay)(1000); // 慢点打开，窗口需要加载
  }
  window.location.reload();

}


/***/ }),

/***/ "./src/judge.js":
/*!**********************!*\
  !*** ./src/judge.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
/* harmony import */ var _evaluate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./evaluate */ "./src/evaluate.js");



const urls = ['.jsp', 'xspj_find.do', 'xspj_list.do', 'xspj_edit.do'];

const judge = () => {

  const url = window.location.pathname;

  const complete = Number(window.sessionStorage.getItem('complete') ?? 0);

  const canDoSomething = urls.some(u => url.includes(u));

  // 事不过三，不提醒超过 3 次
  if (!canDoSomething || complete > 3) {
    return;
  } else if (complete > 0) {
    if (!url.includes(urls[3])) {
      window.sessionStorage.setItem('complete', Number(complete) + 1);
      (0,_utils__WEBPACK_IMPORTED_MODULE_0__.notifySuccess)();
    }
  } else {
    if (url.endsWith(urls[0])) {
      (0,_evaluate__WEBPACK_IMPORTED_MODULE_1__.confirmStart)();
    } else if (url.includes(urls[1])) {
      (0,_evaluate__WEBPACK_IMPORTED_MODULE_1__.checkEvaluations)();
    } else if (url.includes(urls[2])) {
      (0,_evaluate__WEBPACK_IMPORTED_MODULE_1__.handleEvaluates)();
    } else if (url.includes(urls[3])) {
      (0,_evaluate__WEBPACK_IMPORTED_MODULE_1__.autoEvaluate)();
    }
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (judge);



/***/ }),

/***/ "./src/notificate.js":
/*!***************************!*\
  !*** ./src/notificate.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "injectStyle": () => (/* binding */ injectStyle),
/* harmony export */   "notificate": () => (/* binding */ notificate)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.js");


const notifications = [];

const NOTIFICATION_TEMPLATE = `
<div class="inject-notification">
  <div class="inject-notification-box">
    <h2 class="inject-notification-title">{{title}}</h2>
    <div class="inject-notification-content">
      <p>{{content}}</p>
    </div>
    <div class="inject-notification-close">×</div>
  </div>
</div>`;

const NOTIFICATION_STYLE = `
.inject-notification {
  display: flex;
  width: 330px;
  padding: 14px 26px 14px 13px;
  border-radius: 8px;
  box-sizing: border-box;
  border: 1px solid #ebeef5;
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  transition: .4s ease-in-out;
  overflow-wrap: anywhere;
  overflow: hidden;
}

.inject-notification p {
    margin: 0;
}

.inject-notification-box {
    margin-left: 13px;
    margin-right: 8px
}

.inject-notification-title {
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: #303133;
    margin: 0;
}

.inject-notification-content {
    font-size: 14px;
    line-height: 24px;
    margin: 6px 0 0;
    color: #606266;
    text-align: justify;
}

.inject-notification-close {
    position: absolute;
    top: 5px;
    right: 15px;
    cursor: pointer;
    color: #909399;
    font-size: 24px;
    font-weight: 100;
}

.inject-notification-close:hover{
    color: #606266;
}`;

const initTitle = "标题";

const initContent = "这是一段提示";

// 初始定位的 top
const startTop = 16;
// 每两个 notification 的间隔
const offset = 4;

const injectStyle = () => {
  $('<style></style>')
    .attr('id', "inject")
    .html(NOTIFICATION_STYLE)
    .appendTo('body');
}

const notificate = async (title = initTitle, content = initContent, duration = 2000) => {
  const NOTIFICATION_ELEMENT = NOTIFICATION_TEMPLATE.replace(
    /{{title}}|{{content}}/g,
    match => match.includes('title') ? title : content
  );

  // outerHeight -> 边框盒高度
  const top = notifications.reduce((acc, cur) => acc + cur.outerHeight() + offset, startTop);

  const notification = $(NOTIFICATION_ELEMENT).css({
    transform: 'translateX(110%)',
    top: top + 'px'
  }).appendTo('body');

  notifications.push(notification);
  await (0,_utils__WEBPACK_IMPORTED_MODULE_0__.delay)(100);
  notification
    .css('transform', 'translateX(0)')
    .find('.inject-notification-close')
    .one('click', () => close(notification));
  if (duration != null) {
    await (0,_utils__WEBPACK_IMPORTED_MODULE_0__.delay)(duration);
    close(notification);
  }
}

const close = (notification) => {
  const index = notifications.indexOf(notification);
  if (index !== -1) {
    notification.one('transitionend', () => {
      const height = notification.outerHeight() + offset;
      notifications.splice(index, 1);
      // 更新后面所有 notification 的位置
      notifications.forEach((n, i) => {
        if (i >= index) {
          n.css('top', parseInt(n.css('top')) - height + 'px');
        }
      });
      notification.remove();
    });
    notification.css('transform', 'translateX(110%)');
  }
}




/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "delay": () => (/* binding */ delay),
/* harmony export */   "notifySuccess": () => (/* binding */ notifySuccess),
/* harmony export */   "openWindow": () => (/* binding */ openWindow),
/* harmony export */   "testOpenWindow": () => (/* binding */ testOpenWindow)
/* harmony export */ });
/* harmony import */ var _notificate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./notificate */ "./src/notificate.js");


const delay = n => new Promise(resolve => setTimeout(resolve, n));

const notifySuccess = () => (0,_notificate__WEBPACK_IMPORTED_MODULE_0__.notificate)('提示', '评教完成，请注意关闭脚本。', 5000);

const openWindow = url => {

  const width = 500, height = 500;

  const left = (window.screen.availWidth - 10 - width) / 2;

  const top = (window.screen.availHeight - 30 - height) / 2;

  const windowFeatures1 = 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no';

  const windowFeatures2 = `top=${top},left=${left},width=${width}px,height=${height}px`;

  const windowFeatures = `${windowFeatures1},${windowFeatures2}`;

  return window.open(url, "_blank", windowFeatures);
}

const testOpenWindow = async () => {
  let count = 0;
  if (!window.sessionStorage.getItem('canOpenWindow')) {
    (0,_notificate__WEBPACK_IMPORTED_MODULE_0__.notificate)('提示', '开始弹窗测试，以检查是否允许该站点弹窗');
    await delay(1000);
    while (count < 3) {
      const newWindow = openWindow('/');
      if (newWindow === null) {
        if (count === 0) {
          (0,_notificate__WEBPACK_IMPORTED_MODULE_0__.notificate)('提示', '弹窗被拦截，请手动开启', 5000);
          (0,_notificate__WEBPACK_IMPORTED_MODULE_0__.notificate)('提示', '请查看浏览器提醒（例如地址栏右侧），手动允许该站点弹窗', 5000);
          await delay(1000); // 不 delay 的画，confirm 会先出来，阻塞 notification的渲染
        }
        const confirm = window.confirm('允许弹窗后点击确认'); // 别骗我
        if (!confirm) {
          return false;
        }
        count++;
      } else {
        (0,_notificate__WEBPACK_IMPORTED_MODULE_0__.notificate)('提示', '弹窗测试通过');
        await delay(500);
        newWindow.close();
        window.sessionStorage.setItem('canOpenWindow', true);
        return true;
      }
    }
  } else {
    return true;
  }
  return false;
}

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
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _judge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./judge */ "./src/judge.js");
/* harmony import */ var _notificate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./notificate */ "./src/notificate.js");



(0,_notificate__WEBPACK_IMPORTED_MODULE_1__.injectStyle)();

(0,_judge__WEBPACK_IMPORTED_MODULE_0__.default)();






})();

/******/ })()
;