// ==UserScript==
// @name         千峰直播课堂自动签到
// @version      1.2
// @description  高校实训平台直播课堂自动签到
// @author       jxxxxx
// @match        https://live.polyv.cn/watch/*
// @namespace https://greasyfork.org/users/755789
// @downloadURL https://update.greasyfork.org/scripts/456981/%E5%8D%83%E5%B3%B0%E7%9B%B4%E6%92%AD%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/456981/%E5%8D%83%E5%B3%B0%E7%9B%B4%E6%92%AD%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(() => {
  var timer;
  function autoSignIn() {
    console.log("等待签到中...")
    document.querySelectorAll(".c-modal.g-mask").forEach((e) => {
      if (e.style.display === "none") {
        return;
      }
      // 有模态框显示，点击签到按钮
      e.querySelector(".plv-iar-btn-default.pws-btn-bg-color.pws-vclass-btn--primary").click();
      console.log("签到成功！");
    })
  }
  function autoOn() {
    timer = setInterval(autoSignIn, 2000);
  }
  function autoOff() {
    clearInterval(timer);
  }
  function handleChange() {
    const e = document.querySelector("#autoSignIn");
    if (e.checked) {
      autoOn();
    } else {
      autoOff();
    }
  }
  autoOn();
  setTimeout(() => {
    document.querySelector(".c-input-controller__tools").innerHTML += `
  <label style="color:black;" id="auto">
    <input id="autoSignIn" type="checkbox" style="margin-right:3px;" checked></input>自动签到
  </label>
  `;
    document.querySelector("#autoSignIn").addEventListener('change', handleChange);
  }, 5000)
})()