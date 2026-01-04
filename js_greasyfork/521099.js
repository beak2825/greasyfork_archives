// ==UserScript==
// @name                观影体验提升计划
// @namespace           25d40a5ff8ad4ac6a0c05b350c0ce90c
// @version             1.0.0
// @description         wwwpdw观影体验之史诗级提升
// @author              boccaro
// @copyright           boccaro
// @license             MIT
// @match               https://wwpdw.notion.site/*
// @require             https://cdn.jsdelivr.net/npm/dplayer@1/dist/DPlayer.min.js

// @run-at              document-idle
// @supportURL          https://github.com/forestsheep911/monkey-notion-video-enhancer/issues
// @homepage            https://github.com/forestsheep911/monkey-notion-video-enhancer
// @grant               GM_getResourceText
// @grant               GM_addStyle
// @grant               GM_registerMenuCommand
// @icon                https://img.icons8.com/external-vitaliy-gorbachev-blue-vitaly-gorbachev/60/external-player-stay-home-vitaliy-gorbachev-blue-vitaly-gorbachev.png
// @downloadURL https://update.greasyfork.org/scripts/521099/%E8%A7%82%E5%BD%B1%E4%BD%93%E9%AA%8C%E6%8F%90%E5%8D%87%E8%AE%A1%E5%88%92.user.js
// @updateURL https://update.greasyfork.org/scripts/521099/%E8%A7%82%E5%BD%B1%E4%BD%93%E9%AA%8C%E6%8F%90%E5%8D%87%E8%AE%A1%E5%88%92.meta.js
// ==/UserScript==
/* eslint-disable */ /* spell-checker: disable */
// @[ You can find all source codes in GitHub repo ]
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 718:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isTampermonkey": () => (/* binding */ isTampermonkey)
/* harmony export */ });
/**
 * 判断运行环境，阻止本地webpack注入的重复js代码执行
 */
const isTampermonkey = () => {
  let tampermonkey = true;

  try {
    GM_info;
  } catch (err) {
    tampermonkey = false;
  }

  return tampermonkey;
};

/***/ }),

/***/ 176:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hotReload": () => (/* binding */ hotReload)
/* harmony export */ });
const hotReload = () => {
  if (window.location.host.includes('localhost')) {
    const oldRefresh = GM_getValue('refresh');
    GM_setValue('refresh', !oldRefresh);
  } else {
    const callback = (name, oldValue, newValue, remote) => {
      if (remote) {
        window.location.reload();
      }
    };

    GM_addValueChangeListener('refresh', callback);
  }
};



/***/ }),

/***/ 531:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "autoInstall": () => (/* binding */ autoInstall)
/* harmony export */ });
const autoInstall = () => {
  const isNewInstall = localStorage.getItem('isNewInstall');

  if (!isNewInstall) {
    window.open(FILENAME, 'self');
    localStorage.setItem('isNewInstall', 'false');
  }
};

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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

;// CONCATENATED MODULE: ./src/removeHeightAttributes.ts
const removeHeightAttributes = () => {
  const startRemovingHeight = () => {
    let parentElement = null; // 判断 URL 来选择父元素

    if (window.location.href.includes('f47ef8788acb4e12b604011e95fb1738')) {
      parentElement = document.querySelector('.notion-gallery-view');
    } else {
      parentElement = document.querySelector('[data-block-id="f47ef878-8acb-4e12-b604-011e95fb1738"]');
    }

    if (!parentElement) {
      console.warn('No appropriate parent element found');
      return;
    }

    const removeHeight = element => {
      const elementsWithHeight = element.querySelectorAll('.notion-gallery-view [style*="height"]');
      elementsWithHeight.forEach(elem => {
        const style = elem.getAttribute('style');

        if (style) {
          const newStyle = style.replace(/height:\s*[0-9.]+px;?/g, '');
          elem.setAttribute('style', newStyle);
        }
      });
    }; // 初始处理


    removeHeight(parentElement); // 使用 MutationObserver 监视新元素的添加

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node;
            removeHeight(element);
          }
        });
      });
    }); // 观察 parentElement 的子树变化

    observer.observe(parentElement, {
      childList: true,
      subtree: true
    });
  }; // 延迟处理，确保内容加载完毕


  setTimeout(startRemovingHeight, 3000); // 监听窗口 resize 事件

  window.addEventListener('resize', () => {
    setTimeout(startRemovingHeight, 300);
  });
};
;// CONCATENATED MODULE: external "DPlayer"
const external_DPlayer_namespaceObject = DPlayer;
var external_DPlayer_default = /*#__PURE__*/__webpack_require__.n(external_DPlayer_namespaceObject);
;// CONCATENATED MODULE: ./src/videoEnhancer.ts

const enhanceVideo = () => {
  const replaceVideoPlayer = () => {
    const videos = document.querySelectorAll('video:not(.dplayer-video):not([data-enhanced])');

    if (videos.length === 0) {
      return;
    }

    videos.forEach(video => {
      // 防止重复处理已增强的视频
      if (video.getAttribute('data-enhanced')) {
        return;
      } // 向上查找4层父元素，并转换类型


      const parent4 = video.parentElement?.parentElement?.parentElement?.parentElement;

      if (!parent4 || !parent4.parentElement) {
        return;
      }

      try {
        const dpElement = document.createElement('div');
        new (external_DPlayer_default())({
          container: dpElement,
          video: {
            url: video.getAttribute('src') || '',
            type: 'auto'
          }
        });
        parent4.parentElement.insertBefore(dpElement, parent4);
        parent4.style.display = 'none';
        video.setAttribute('data-enhanced', 'true');
      } catch (err) {
        console.error('Failed to enhance a video:', err);
      }
    });
  };

  document.addEventListener('keydown', e => {
    if (e.altKey && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      replaceVideoPlayer();
    }
  });
  GM_registerMenuCommand('使用 DPlayer 播放', replaceVideoPlayer);
};
;// CONCATENATED MODULE: ./src/app.ts



const app_app = () => {
  // 立即执行手动视频增强功能
  enhanceVideo();

  const executeFunctions = () => {
    // 只对自动触发的功能使用延迟
    setTimeout(() => {
      // 这里可以只保留需要等待DOM加载的功能
      removeHeightAttributes();
    }, 3000);
  };

  let oldURL = location.href; // 监听URL变化

  const observeUrlChange = () => {
    const observer = new MutationObserver(() => {
      if (location.href !== oldURL) {
        oldURL = location.href;
        executeFunctions(); // URL变化时也需要重新初始化视频增强功能
        // enhanceVideo()
      }
    });
    observer.observe(document, {
      subtree: true,
      childList: true
    });
  }; // 初始执行


  executeFunctions();
  observeUrlChange();
};

/* harmony default export */ const src_app = (app_app);
;// CONCATENATED MODULE: ./src/index.ts


async function initDevelopment() {
  try {
    const {
      isTampermonkey
    } = await Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 718));

    if (isTampermonkey()) {
      const {
        hotReload
      } = await Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 176));
      hotReload();
      app();
    } else {
      const {
        autoInstall
      } = await Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 531));
      autoInstall();
    }
  } catch (err) {
    console.error('Development initialization failed:', err);
  }
}

if (true) {
  src_app();
} else {}
})();

/******/ })()
;