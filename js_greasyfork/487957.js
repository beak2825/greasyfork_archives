// ==UserScript==
// @name         GoobooObserver
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Gooboo画廊刷现金
// @author       You
// @match        https://*/gooboo/
// @icon         https://tendsty.github.io/gooboo/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487957/GoobooObserver.user.js
// @updateURL https://update.greasyfork.org/scripts/487957/GoobooObserver.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function getStore(item) {
    const store = localStorage.getItem('goobooObserver');
    return store ? JSON.parse(store)[item] : null;
  }
  function setStore(item, value) {
    const store = JSON.parse(localStorage.getItem('goobooObserver') || '{}');
    store[item] = value;
    localStorage.setItem('goobooObserver', JSON.stringify(store));
  }
  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  let running = false, t = 0;
  let cycle = getStore('gallery_auto_cash_cycle') || 1; // 每次声望等待的时间，单位是秒
  function sleep(s) {
    return new Promise((resolve) => setTimeout(resolve, s * 1000));
  }
  function get_module() {
    return document.getElementsByClassName("primary")[0].__vue__.$store.state.system.screen;
  }
  function click(ele) {
    ele && ele.click();
  }
  async function auto_cash() {
    const cbtn = document.getElementById("auto_cash_stop");
    cbtn.classList.add("success");
    cbtn.classList.remove("error");
    t = 1;
    while (running) {
      if(get_module()==='gallery') {
        click(document.querySelectorAll(".mdi-gavel")[0]);
        await sleep(0.5);
        document.querySelectorAll(".flex-shrink-0.v-chip")[0] && click(document.querySelectorAll(".flex-shrink-0.v-chip")[0].nextSibling.nextSibling.nextSibling.nextSibling);
        await sleep(0.5);
        const confirm_dialog = document.querySelectorAll('.v-dialog.v-dialog--active')[0];
        confirm_dialog && click(confirm_dialog.querySelectorAll('.v-btn.success')[0]);
        click(document.querySelectorAll(".v-slide-group__content .mdi-image-frame")[0]);
        await sleep(1);
        const insp = parseInt((document.querySelectorAll('.currency-border .v-progress-linear__content span')[0]||{innerText:0}).innerText);
        const cash = document.querySelectorAll(".bg-tile-default .mdi-cash")[0] ? document.querySelectorAll(".bg-tile-default .mdi-cash")[0].parentNode.parentNode.parentNode:null;
        let tt = 0;
        while (cash && tt<insp) {
          cash.click();
          tt++;
        }
        await sleep(cycle);
        t++;
      } else {
        await sleep(1);
      }
    }
  }
  let auto_cash_icon = document.createElement('i');
  auto_cash_icon.classList = 'v-icon mx-2 mdi mdi-cash';
  let auto_cash_btn = document.createElement('button');
  auto_cash_btn.id = "auto_cash_stop";
  auto_cash_btn.classList = 'mx-2 v-btn v-btn--round v-btn--icon v-size--default error';
  auto_cash_btn.appendChild(auto_cash_icon);
  auto_cash_btn.addEventListener("click", function () {
    running = !running;
    if (running) {
      auto_cash();
    } else {
      const cbtn = document.getElementById("auto_cash_stop");
      cbtn.classList.remove("success");
      cbtn.classList.add("error");
    }
  });
  let setting_btn = document.createElement("button");
  setting_btn.innerText = '设置';
  setting_btn.classList = "v-btn v-btn--is-elevated v-btn--has-bg v-size--default";
  setting_btn.addEventListener("click", function () {
    const ans = parseInt(prompt('设置画廊现金循环间隔时间', getStore('gallery_auto_cash_cycle')));
    if(!ans) return;
    setStore('gallery_auto_cash_cycle', ans);
    cycle = ans;
  });
  const spacer = document.querySelectorAll(".spacer")[0];
  const parent = spacer.parentNode;
  parent.insertBefore(auto_cash_btn, spacer);
  !isMobile() && parent.insertBefore(setting_btn, spacer);
})();
