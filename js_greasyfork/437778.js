// ==UserScript==
// @name         etherscan-helper
// @version      0.0.1
// @description  Gadget for etherscan.io
// @namespace    userscripts.henryfour.com
// @homepageURL  https://github.com/henryfour/userscripts
// @supportURL   https://github.com/henryfour/userscripts/issues
// @author       HenryFour
// @copyright    2020+, HenryFour
// @license      MIT
//
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @match        https://cn.etherscan.com/*
// @match        https://*.etherscan.io/*
// @match        https://*.bscscan.com/*
// @match        https://*.hecoinfo.com/*
// @match        https://*.ftmscan.com/*
// @match        https://*.polygonscan.com/*
// @match        https://*.arbiscan.io/*
// @match        https://*.snowtrace.io/*
//
// @icon         https://etherscan.io/images/favicon2.ico
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/437778/etherscan-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/437778/etherscan-helper.meta.js
// ==/UserScript==

GM_addStyle(
  // reference: https://gradientbuttons.colorion.co/
  ".btn-grad {background-image: linear-gradient(to right, #E55D87 0%, #5FC3E4 51%, #E55D87 100%)}"
  + ".btn-grad {margin: 10px; padding: 10px 20px; text-align: center; text-transform: uppercase; transition: 0.5s; background-size: 200% auto; color: white; box-shadow: 0 0 20px #eee; border-radius: 10px; display: block; border-width: 0;}"
  + ".btn-grad:hover { background-position: right center; color: #fff; text-decoration: none; }"
  + ".auto-jump { margin: 10px; padding: 4px; color: #fff; background-color: #21325b; }"
  + ".auto-jump label { margin: 0 0 0 4px; }"
);

(function () {
  'use strict';

  const HostCN = "cn.etherscan.com";
  const HostEN = "etherscan.io";

  const KeyAutoI18n = "etherscan.auto-jump";
  function getAutoI18n() {
    return GM_getValue(KeyAutoI18n, "");
  }

  function isHostEN() {
    return window.location.hostname == HostEN;
  }
  function isHostCN() {
    return window.location.hostname == HostCN;
  }

  function jumpToHost(toHost) {
    if (toHost && window.location.hostname != toHost) {
      if (getAutoI18n()) {
        setAutoI18n(toHost);
      }
      let jumpUrl = window.location.href.replace(window.location.hostname, toHost);
      window.location.href = jumpUrl;
      return true;
    }
    return false;
  }


  function setAutoI18n(toHost) {
    GM_setValue(KeyAutoI18n, toHost);
  }

  function tryAutoI18n() {
    let toHost = getAutoI18n();
    switch (toHost) {
      case HostEN:
        return isHostCN() && jumpToHost(toHost);
      case HostCN:
        return isHostEN() && jumpToHost(toHost);
      default:
        return false;
    }
  }

  // auto jump before document loaded
  if (tryAutoI18n()) {
    return;
  }

  function toI18n(parent) {
    let btnText, toHost, checkText;
    if (isHostEN()) {
      btnText = '转到中文站';
      toHost = HostCN;
      checkText = '自动跳转';
    } else if (isHostCN()) {
      btnText = 'Goto EN';
      toHost = HostEN;
      checkText = 'Auto Jump';
    } else {
      // no jump for testnets
      return;
    }
    addButton(parent, btnText, () => { jumpToHost(toHost) }, 'btn-grad');
    addCheckbox(parent, checkText, (checked) => { setAutoI18n(checked ? toHost : ""); });
  }

  // Add button to view code in deth.net
  function toCodeViewer(parent) {
    // https://github.com/dethcrypto/ethereum-code-viewer/blob/main/docs/supported-explorers.md
    let url = location.href;
    if (url.indexOf(".io/") > 0) {
        url = url.replace(".io/", ".deth.net/");
    } else if (url.indexOf(".com") > 0) {
        url = url.replace(".com/", ".deth.net/");
    }
    addButton(parent, 'deth.net', () => window.open(url), 'btn-grad');
  }

  window.addEventListener('load', () => {
    // Hide username for screenshots sharing
    let profile = document.getElementById("dropdownUser");
    if (profile) {
      profile.childNodes[1].textContent = "My Profile";
    }

    // floating functions
    const floatingArea = addFloatingArea();
    toCodeViewer(floatingArea);
    toI18n(floatingArea);
  })

  function addButton(parent, text, onclick, cls, styles) {
    let button = document.createElement('button');
    button.innerHTML = text;
    button.onclick = onclick;
    button.className = cls;
    styles = styles || {}
    Object.keys(styles).forEach(key => button.style[key] = styles[key]);
    parent.appendChild(button);
    return button
  }

  function addCheckbox(parent, text, cb, cls) {
    let div = document.createElement('div');
    div.className = 'auto-jump';
    let input = document.createElement('input');
    input.type = 'checkbox';
    input.id = 'auto-jump-check';
    input.checked = getAutoI18n() ? true : false;
    input.value = true;
    input.onclick = () => { cb(input.checked); };
    let label = document.createElement('label');
    label.innerHTML = text;
    label.setAttribute('for', input.id);
    div.append(input, label);
    parent.appendChild(div);
  }

  function addFloatingArea() {
    let div = document.createElement('div');
    let styles = { position: 'fixed', top: '20%', right: '1%', 'z-index': 9999 };
    Object.keys(styles).forEach(key => div.style[key] = styles[key]);
    document.body.appendChild(div);
    return div;
  }
})();
