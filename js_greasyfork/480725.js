// ==UserScript==
// @name         pokemon-1-45-height-weight
// @namespace    https://github.com/hotarupoyo
// @version      0.0.0
// @author       hotarupoyo
// @description  ポケモンの標準の1.45倍のたかさ・おもさを表示する。
// @license      MIT
// @match        https://yakkun.com/*/zukan/*
// @match        https://wiki.xn--rckteqa2e.com/wiki/%E3%83%9D%E3%82%B1%E3%83%A2%E3%83%B3%E3%81%AE%E3%81%9F%E3%81%8B%E3%81%95%E3%83%BB%E3%81%8A%E3%82%82%E3%81%95%E4%B8%80%E8%A6%A7
// @match        https://wiki.xn--rckteqa2e.com/wiki/*
// @downloadURL https://update.greasyfork.org/scripts/480725/pokemon-1-45-height-weight.user.js
// @updateURL https://update.greasyfork.org/scripts/480725/pokemon-1-45-height-weight.meta.js
// ==/UserScript==

(function () {
  'use strict';

  (() => {
    var _a, _b, _c;
    if (location.host === "yakkun.com" && location.pathname.search(/\/.+\/zukan\/.+/) !== -1) {
      const c1ClassElements = document.getElementsByClassName("c1");
      let heightElement = void 0;
      let weightElement = void 0;
      for (let i = 0; i < c1ClassElements.length; i++) {
        const element = c1ClassElements[i];
        if (element.textContent === "高さ" && element.nextElementSibling != null) {
          heightElement = element.nextElementSibling;
          break;
        }
      }
      for (let i = 0; i < c1ClassElements.length; i++) {
        const element = c1ClassElements[i];
        if (element.textContent === "重さ" && element.nextElementSibling != null) {
          weightElement = (_b = (_a = element.nextElementSibling) == null ? void 0 : _a.firstElementChild) == null ? void 0 : _b.firstElementChild;
          break;
        }
      }
      if (heightElement != null) {
        const value = (parseFloat(heightElement.innerText) * 1.45).toString();
        const td = document.createElement("td");
        const ul = document.createElement("ul");
        const li1 = document.createElement("li");
        const li2 = document.createElement("li");
        li1.innerText = heightElement.innerText;
        li2.innerText = `1.45倍${value}m`;
        li2.classList.add("small");
        li2.style.color = "red";
        heightElement.insertAdjacentElement("afterend", td);
        td.insertAdjacentElement("beforeend", ul);
        ul.insertAdjacentElement("beforeend", li1);
        ul.insertAdjacentElement("beforeend", li2);
        heightElement.remove();
      }
      if (weightElement != null) {
        const value = (parseFloat(weightElement.innerText) * 1.45).toString();
        const element = document.createElement("li");
        element.innerHTML = `1.45倍${value}kg`;
        element.classList.add("small");
        element.style.color = "red";
        weightElement.insertAdjacentElement("afterend", element);
      }
    } else if (location.host === "wiki.xn--rckteqa2e.com" && location.pathname === "/wiki/%E3%83%9D%E3%82%B1%E3%83%A2%E3%83%B3%E3%81%AE%E3%81%9F%E3%81%8B%E3%81%95%E3%83%BB%E3%81%8A%E3%82%82%E3%81%95%E4%B8%80%E8%A6%A7") {
      const tbodies = document.getElementsByTagName("tbody");
      let heightWeightRows = void 0;
      for (let i = 0; i < tbodies.length; i++) {
        const element = tbodies[i];
        if ((_c = element.parentElement) == null ? void 0 : _c.classList.contains("graytable")) {
          heightWeightRows = element.getElementsByTagName("tr");
        }
      }
      if (heightWeightRows != null) {
        for (let i = 0; i < heightWeightRows.length; i++) {
          const row = heightWeightRows[i];
          for (let j = 0; j < row.children.length; j++) {
            const cell = row.children[j];
            if (row.children.length === 11 && j === 2) {
              const value = (parseFloat(cell.innerText) * 1.45).toString();
              const element = document.createElement("span");
              element.innerHTML = `1.45倍${value}kg`;
              element.style.fontSize = "smaller";
              element.style.color = "red";
              cell.insertAdjacentElement("beforeend", element);
            }
          }
        }
      }
    } else if (location.host === "wiki.xn--rckteqa2e.com" && location.pathname.search(/\/wiki\/.+/) !== -1) {
      const thTagElements = document.getElementsByTagName("th");
      let heightElement = void 0;
      let weightElement = void 0;
      for (let i = 0; i < thTagElements.length; i++) {
        const element = thTagElements[i];
        const child = element.firstElementChild;
        if (child != null && child.tagName === "A") {
          const childAtagged = child;
          if (childAtagged.pathname === "/wiki/%E3%81%9F%E3%81%8B%E3%81%95" && element.nextElementSibling != null) {
            heightElement = element.nextElementSibling;
            break;
          }
        }
      }
      for (let i = 0; i < thTagElements.length; i++) {
        const element = thTagElements[i];
        const child = element.firstElementChild;
        if (child != null && child.tagName === "A") {
          const childAtagged = child;
          if (childAtagged.pathname === "/wiki/%E3%81%8A%E3%82%82%E3%81%95" && element.nextElementSibling != null) {
            weightElement = element.nextElementSibling;
            break;
          }
        }
      }
      if (heightElement != null) {
        const value = (parseFloat(heightElement.innerText) * 1.45).toString();
        const element = document.createElement("span");
        element.innerHTML = `1.45倍${value}m`;
        element.style.fontSize = "smaller";
        element.style.color = "red";
        heightElement.insertAdjacentElement("beforeend", element);
      }
      if (weightElement != null) {
        const value = (parseFloat(weightElement.innerText) * 1.45).toString();
        const element = document.createElement("span");
        element.innerHTML = `1.45倍${value}kg`;
        element.style.fontSize = "smaller";
        element.style.color = "red";
        weightElement.insertAdjacentElement("beforeend", element);
      }
    }
  })();

})();