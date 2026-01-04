// ==UserScript==
// @name         manhuagui
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/manhuagui
// @version      1.0.7
// @license      MIT
// @description  enhance manhuagui
// @author       IronKinoko
// @match        https://www.manhuagui.com/comic/*
// @icon         https://www.google.com/s2/favicons?domain=manhuagui.com
// @grant        none
// @noframes
// @require      https://unpkg.com/jquery@3.6.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/451739/manhuagui.user.js
// @updateURL https://update.greasyfork.org/scripts/451739/manhuagui.meta.js
// ==/UserScript==
(function () {
  'use strict';

  function sleep(ms) {
    if (!ms) {
      return new Promise((resolve) => {
        requestAnimationFrame(resolve);
      });
    }
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async function wait(selector) {
    let bool = await selector();
    while (!bool) {
      await sleep();
      bool = await selector();
    }
  }

  function isMobile() {
    const re = /iphone|ipad|ipod|android|webos|blackberry|windows phone/i;
    const ua = navigator.userAgent;
    return re.test(ua);
  }

  async function waitDOM(selector, root = document) {
    await wait(() => !!root.querySelector(selector));
    return root.querySelector(selector);
  }

  /** @type {HTMLElement[]} */
  var containers = [];
  /** @type {{prepend:HTMLStyleElement,append:HTMLStyleElement}[]} */

  var styleTags = [];
  /**
   * @param {string} css
   * @param {object} options
   * @param {boolean} [options.prepend]
   * @param {boolean} [options.singleTag]
   * @param {string} [options.container]
   * @param {Record<string,string>} [options.attributes]
   * @returns {void}
   */

  function injectCss (css, options) {
    if (!css || typeof document === "undefined") return;
    var position = options.prepend === true ? "prepend" : "append";
    var singleTag = options.singleTag === true;
    var container = typeof options.container === "string" ? document.querySelector(options.container) : document.getElementsByTagName("head")[0];

    function createStyleTag() {
      var styleTag = document.createElement("style");
      styleTag.setAttribute("type", "text/css");

      if (options.attributes) {
        var k = Object.keys(options.attributes);

        for (var i = 0; i < k.length; i++) {
          styleTag.setAttribute(k[i], options.attributes[k[i]]);
        }
      }

      var pos = position === "prepend" ? "afterbegin" : "beforeend";
      container.insertAdjacentElement(pos, styleTag);
      return styleTag;
    }
    /** @type {HTMLStyleElement} */


    var styleTag;

    if (singleTag) {
      var id = containers.indexOf(container);

      if (id === -1) {
        id = containers.push(container) - 1;
        styleTags[id] = {};
      }

      if (styleTags[id] && styleTags[id][position]) {
        styleTag = styleTags[id][position];
      } else {
        styleTag = styleTags[id][position] = createStyleTag();
      }
    } else {
      styleTag = createStyleTag();
    } // strip potential UTF-8 BOM if css was read from a file


    if (css.charCodeAt(0) === 0xfeff) css = css.substring(1);

    if (styleTag.styleSheet) {
      styleTag.styleSheet.cssText += css;
    } else {
      styleTag.appendChild(document.createTextNode(css));
    }
  }

  var css = ".k-custom-btn.k-custom-btn {\n  text-indent: 0;\n  background: #b5b5b5;\n  color: white;\n  line-height: 40px;\n  text-align: center;\n  text-decoration: none;\n}\n.k-custom-btn.k-custom-btn:hover {\n  background: #c00f20;\n}\n\n.backToTop {\n  height: auto !important;\n}\n\n.tbCenter {\n  border: none !important;\n  background: none !important;\n}\n\n[data-tag=mangaFile] {\n  width: 980px !important;\n}\n\n.big-h5-btn {\n  width: calc(100% - 72px);\n  display: block;\n  height: 100px;\n  background-color: #c00f20;\n  color: white;\n  font-size: 36px;\n  margin: 36px auto;\n  outline: 0;\n  border: #c00f20;\n}\n\n.next-part-btn-fixed {\n  position: fixed;\n  right: 0;\n  top: 25vh;\n  font-size: 4.27vw;\n  background: white;\n  padding: 2.13vw;\n  writing-mode: vertical-lr;\n  box-shadow: rgba(0, 0, 0, 0.2) -0.27vw 0.27vw 2.67vw 0vw;\n  transition: all 0.2s ease;\n  transform: translateX(0);\n  border-radius: 1.07vw 0 0 1.07vw;\n  opacity: 1;\n}\n.next-part-btn-fixed.hide {\n  opacity: 0;\n  pointer-events: none;\n  transform: translateX(100%);\n}";
  injectCss(css,{});

  (async () => {
    document.oncontextmenu = null;
    createNextBtn();
    createFullScreen();
    if (isMobile()) {
      createNextBtnInH5();
    }
  })();
  async function createNextBtn() {
    const dom = await waitDOM(".backToTop");
    const a = document.createElement("a");
    a.innerHTML = "NEXT";
    a.className = "k-custom-btn";
    a.id = "show-next";
    a.href = "javascript:;";
    a.onclick = window.SMH.nextC;
    dom.append(a);
  }
  async function createFullScreen() {
    const dom = await waitDOM(".backToTop");
    const a = document.createElement("a");
    a.innerHTML = "FULL";
    a.className = "k-custom-btn";
    a.id = "full-btn";
    a.href = "javascript:;";
    a.onclick = () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        a.innerHTML = "FULL";
      } else {
        document.documentElement.requestFullscreen();
        a.innerHTML = "EXIT";
      }
    };
    dom.append(a);
    document.addEventListener("keypress", (e) => {
      if (document.activeElement && /textarea|input|select/i.test(document.activeElement.tagName)) {
        return;
      }
      if (e.key === "f") {
        a.click();
      }
    });
  }
  async function createNextBtnInH5() {
    const $pagination = await waitDOM("#pagination");
    $pagination.innerHTML = "";
    const btn = document.createElement("button");
    btn.className = "big-h5-btn";
    btn.textContent = "\u4E0B\u4E00\u7AE0";
    btn.onclick = () => window.SMH.nextC();
    $pagination.replaceWith(btn);
  }

})();
