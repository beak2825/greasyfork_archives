// ==UserScript==
// @name         Add Watermark
// @license      MIT
// @namespace    https://github.com/ZJU-CC98/Forum
// @version      1.4
// @description  Add watermarks to CC98 webpages
// @author       Secant
// @match        https://www.cc98.org/*
// @icon         https://www.cc98.org/static/98icon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451563/Add%20Watermark.user.js
// @updateURL https://update.greasyfork.org/scripts/451563/Add%20Watermark.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  /**
   * Get user ID
   * @returns user ID (at least 8 bytes)
   */
  function getUserId() {
    try {
      return (
        "" + JSON.parse(localStorage.getItem("userInfo").slice(4)).id
      ).padStart(8, "0");
    } catch (e1) {
      return "".padStart(8, "0");
    }
  }

  /**
   * Get topic ID
   * @returns topic ID (at least 8 bytes)
   */
  function getTopicId() {
    return (
      window.location.pathname.match(/(?<=^\/topic\/)\d+/)?.[0] || "0"
    ).padStart(8, "0");
  }

  /**
   * Get timestamp
   * @returns timestamp (10 bytes)
   */
  function getTimeStamp() {
    return "" + Math.round(Date.now() / 1000);
  }

  /**
   * Get user watermark ID
   * @returns {Promise<string>} watermark ID (32 bytes)
   */
  async function getWatermarkId() {
    try {
      // get from localstorage
      const watermarkId = JSON.parse(
        localStorage.getItem("userInfo").slice(4)
      ).watermarkId;
      if (!watermarkId || !/[0-9a-f]{32}/.test(watermarkId)) {
        throw undefined;
      }
      return watermarkId;
    } catch (e) {
      // get from api
      try {
        const accessToken = localStorage.getItem("accessToken").slice(4);
        const resp = await fetch("https://api.cc98.org/me", {
          headers: new Headers({
            Authorization: accessToken,
          }),
        });
        if (!resp.ok) {
          throw undefined;
        }
        const userInfo = await resp.json();
        const watermarkId = userInfo.watermarkId;
        if (!watermarkId || !/[0-9a-f]{32}/.test(watermarkId)) {
          throw undefined;
        }
        localStorage.setItem("userInfo", "obj-" + JSON.stringify(userInfo));
        return watermarkId;
      } catch (e) {
        // placeholder
        return "".padStart(32, "cc98");
      }
    }
  }

  /**
   * Generate watermark hash ID in hex format
   * @param {string} userId
   * @param {string} topicId
   * @param {string} timestamp
   * @param {string} watermarkId
   * @returns SHA-256 watermark hash ID in hex format
   */
  async function generateWatermarkHashId(
    userId,
    topicId,
    timestamp,
    watermarkId
  ) {
    const encoder = new TextEncoder();
    const data = encoder.encode([...arguments].join(""));
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  }

  /**
   * Randomly generate a custom element tag name
   * @returns element tag name
   */
  function generateElementName() {
    // valid char codes that can be used in the name
    // https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
    // in [start, end) format
    const validCharCodeRange = [
      [0x0002d, 0x0002f],
      [0x00030, 0x0003a],
      [0x0005f, 0x00060],
      [0x00061, 0x0007b],
      [0x000b7, 0x000b8],
      [0x000c0, 0x000d7],
      [0x000d8, 0x000f7],
      [0x000f8, 0x0037e],
      [0x0037f, 0x02000],
      [0x0200c, 0x0200e],
      [0x0203f, 0x02041],
      [0x02070, 0x02190],
      [0x02c00, 0x02ff0],
      [0x03001, 0x0d800],
      [0x0f900, 0x0fdd0],
      [0x0fdf0, 0x0fffe],
      [0x10000, 0xf0000],
    ];
    // for binary search
    const searchArray = [];
    // calculate the count of total valid char codes
    const validCharCodeCount = validCharCodeRange.reduce((a, b) => {
      searchArray.push(a);
      return a + b[1] - b[0];
    }, 0);

    //               starting  prefix         postfix
    // tag name is in <[a-z] (PCENChar)* '-' (PCENChar)*> format

    // starting, random select
    const tagStarting = String.fromCharCode(
      97 + Math.floor(Math.random() * 26)
    );

    // prefix, random select
    let tagPrefix = "";
    const tagPrefixLength = Math.floor(Math.random() * 4);
    for (let index = 0; index < tagPrefixLength; ++index) {
      const validCharCodeIndex = Math.floor(Math.random() * validCharCodeCount);
      tagPrefix += String.fromCodePoint(getValidCharCodeAt(validCharCodeIndex));
    }

    // postfix, random select
    let tagPostfix = "";
    const tagPostfixLength = Math.floor(Math.random() * 4);
    for (let index = 0; index < tagPostfixLength; ++index) {
      const validCharCodeIndex = Math.floor(Math.random() * validCharCodeCount);
      tagPostfix += String.fromCodePoint(
        getValidCharCodeAt(validCharCodeIndex)
      );
    }
    // join them together
    return tagStarting + tagPrefix + "-" + tagPostfix;

    /**
     * Binary search helper function
     * @param {number} index
     * @returns the target valid char code
     */
    function getValidCharCodeAt(index) {
      let start = 0;
      let end = searchArray.length - 1;
      let target;
      while (start <= end) {
        let mid = Math.floor((start + end) / 2);
        if (searchArray[mid] === index) {
          target = mid;
          break;
        } else if (searchArray[mid] < index) {
          start = mid + 1;
        } else {
          end = mid - 1;
        }
      }
      target = end;
      return validCharCodeRange[target][0] + index - searchArray[target];
    }
  }

  /**
   * Generate watermark svg
   * @returns base64 encoded svg
   */
  async function generateSvgBase64() {
    // this can be adjusted to a appropriate level between
    // where the opacity is so small that
    // jpeg compression can easily destroy the watermark
    // and
    // where the opacity is large enough
    // for the watermark to be distinguished uncomfortably by human eyes
    // 0.005 ~ 0.05 is a reasonable range
    const opacity = 0.015;
    // some paramerters used in svg
    const height = 50;
    const width = 200;
    const fontSize = 20;

    // create svg element
    const svg = document.createElement("svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("viewBox", `0 0 ${2 * width} ${2 * height}`);
    svg.setAttribute("fill-opacity", opacity);
    svg.setAttribute("width", 2 * width);
    svg.setAttribute("height", 2 * height);
    svg.setAttribute("font-size", fontSize);
    svg.setAttribute(
      "font-family",
      [
        "Consolas",
        "Monaco",
        "Lucida Console",
        "Liberation Mono",
        "DejaVu Sans Mono",
        "Bitstream Vera Sans Mono",
        "Courier New",
        "monospace",
      ].join(",")
    );

    const userId = getUserId();
    const topicId = getTopicId();
    const timestamp = getTimeStamp();
    const watermarkHashId = await generateWatermarkHashId(
      userId,
      topicId,
      timestamp,
      await getWatermarkId()
    );

    // create first row text element
    // user ID + topic ID
    const firstRow1 = document.createElement("text");
    firstRow1.textContent = userId + " " + topicId;
    firstRow1.setAttribute("fill", "#000");
    firstRow1.setAttribute("x", 10);
    firstRow1.setAttribute("y", (height / 3).toFixed(2));

    const firstRow2 = firstRow1.cloneNode(true);
    firstRow2.setAttribute("fill", "#fff");
    firstRow2.setAttribute("x", 10 + width);
    firstRow2.setAttribute("y", (height / 3).toFixed(2));

    const firstRow3 = firstRow1.cloneNode(true);
    firstRow3.setAttribute("fill", "#fff");
    firstRow3.setAttribute("x", 10);
    firstRow3.setAttribute("y", ((height / 3) * 4).toFixed(2));

    const firstRow4 = firstRow1.cloneNode(true);
    firstRow4.setAttribute("fill", "#000");
    firstRow4.setAttribute("x", 10 + width);
    firstRow4.setAttribute("y", ((height / 3) * 4).toFixed(2));

    // create second row text element
    // timestamp + watermark hash ID
    const secondRow1 = document.createElement("text");
    secondRow1.textContent = timestamp + " " + watermarkHashId.slice(0, 6);
    secondRow1.setAttribute("fill", "#000");
    secondRow1.setAttribute("x", 10);
    secondRow1.setAttribute("y", ((height / 3) * 2).toFixed(2));

    const secondRow2 = secondRow1.cloneNode(true);
    secondRow2.setAttribute("fill", "#fff");
    secondRow2.setAttribute("x", 10 + width);
    secondRow2.setAttribute("y", ((height / 3) * 2).toFixed(2));

    const secondRow3 = secondRow1.cloneNode(true);
    secondRow3.setAttribute("fill", "#fff");
    secondRow3.setAttribute("x", 10);
    secondRow3.setAttribute("y", ((height / 3) * 5).toFixed(2));

    const secondRow4 = secondRow1.cloneNode(true);
    secondRow4.setAttribute("fill", "#000");
    secondRow4.setAttribute("x", 10 + width);
    secondRow4.setAttribute("y", ((height / 3) * 5).toFixed(2));

    svg.append(
      firstRow1,
      secondRow1,
      firstRow2,
      secondRow2,
      firstRow3,
      secondRow3,
      firstRow4,
      secondRow4
    );

    return "data:image/svg+xml;base64," + btoa(svg.outerHTML);
  }

  /**
   * The class object that defines the behavior
   * of the watermark custom element
   */
  class Watermark extends HTMLElement {
    timeout;
    isCompleted = false;
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: "closed" });
      const carrier = document.createElement("div");
      const style = document.createElement("style");
      const rotateAngle =
        (Math.random() >= 0.5 ? 1 : -1) * (Math.random() * 10 + 40);
      style.textContent =
        ":host { all: unset !important; }\n" +
        "div { " +
        [
          "position: fixed;",
          "--side-length: 142vmax;",
          "top: calc(0.45 * (100vh - var(--side-length)));",
          "left: calc(0.45 * (100vw - var(--side-length)));",
          "width: var(--side-length);",
          "height: var(--side-length);",
          `background: url("${svgBase64}");`,
          `transform: rotate(${rotateAngle}deg);`,
          "pointer-events: none;",
          "z-index: 9999;",
        ].join(" ") +
        " }";
      shadow.appendChild(carrier);
      shadow.appendChild(style);
    }
    connectedCallback() {
      this.isCompleted = false;
      this.timeout = setTimeout(async () => {
        svgBase64 = await generateSvgBase64();
        this.isCompleted = true;
        this.remove();
      }, 4000 + 2000 * Math.random());
    }
    disconnectedCallback() {
      if (!this.isCompleted) {
        (async () => {
          clearTimeout(this.timeout);
          svgBase64 = await generateSvgBase64();
          addWatermark();
        })();
      } else {
        clearTimeout(this.timeout);
        addWatermark();
      }
    }
  }

  /**
   * Regenerate and reposition the
   * watermark custom element
   */
  function addWatermark() {
    // make a clone of the Watermark class
    const T = class extends Watermark {
      constructor() {
        super();
      }
    };
    // randomly generate a new name
    const elementName = generateElementName();

    if (!customElementsGet(elementName)) {
      // define a new custom element unless
      // the name is already defined before
      try {
        customElementsDefine(elementName, T);
      } catch (e) {
        // strange behavior
        customElementsDefine(elementName + "cc98", T);
      }
    }
    // query all candidate elements where
    // the watermark can be inserted into
    const allDivElements = [
      ...document.querySelectorAll(
        [
          "div.mainPageList",
          "div.mainPageListRow",
          "div.reply",
          "div.boardContent",
          "div.focus-topic",
          "div.board-postItem-body",
        ].join(", ")
      ),
    ].filter((elem) => {
      const style = window.getComputedStyle(elem);
      return style.display !== "none" && style.visibility !== "hidden";
    });
    // random pick a candidate element as the parent element
    // where the watermark is to be inserted into
    // if none is found, body element is used
    const parentElement = allDivElements.length
      ? allDivElements[Math.floor(Math.random() * allDivElements.length)]
      : document.body;
    // in case of errors when document.body is not found
    if (parentElement) {
      // make a new watermark element
      watermarkElement = htmlStringToElement(`<${elementName}/>`);
      // add watermark inside parent element
      const childNodes = parentElement.childNodes;
      const length = childNodes.length;
      const index = Math.floor(Math.random() * length + 1);
      if (index === length) {
        parentElement.appendChild(watermarkElement);
      } else {
        parentElement.insertBefore(watermarkElement, childNodes[index]);
      }
    }
  }

  /**
   * HTML string to DOM element helper function
   * @param {string} htmlString
   * @returns DOM element
   */
  function htmlStringToElement(htmlString) {
    var template = document.createElement("template");
    htmlString = htmlString.trim();
    template.innerHTML = htmlString;
    return template.content.firstChild;
  }

  /**
   * Get iframe window
   * @returns iframe window
   */
  function getIframeWindow() {
    let iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    const contentWindow = iframe.contentWindow;
    document.body.removeChild(iframe);
    return contentWindow;
  }

  /**
   * Custom elements get wrapper
   */
  function customElementsGet() {
    if (
      window.customElements.get instanceof Function &&
      window.customElements.get.toString() ===
        "function get() { [native code] }"
    ) {
      window.customElements.get.apply(window.customElements, arguments);
    } else {
      iframeWindow.customElements.get.apply(window.customElements, arguments);
    }
  }

  /**
   * Custom elements define wrapper
   */
  function customElementsDefine() {
    if (
      window.customElements.define instanceof Function &&
      window.customElements.define.toString() ===
        "function define() { [native code] }"
    ) {
      window.customElements.define.apply(window.customElements, arguments);
    } else {
      iframeWindow.customElements.define.apply(
        window.customElements,
        arguments
      );
    }
  }

  // init and execute
  const iframeWindow = getIframeWindow();
  let watermarkElement = null;
  let svgBase64 = await generateSvgBase64();
  addWatermark();
})();