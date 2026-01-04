// ==UserScript==
// @name         河南理工大学校园网自动登录
// @namespace    https://github.com/HPUhushicheng/HPU-Giwifi
// @version      1.1
// @description  自动登录【河南理工大学·校园网】
// @author       hushicheng
// @include      *://*/gportal/web/login?*
// @include      *://*/srun_portal_pc?*
// @icon         https://h5.cyol.com/special/daxuexi/ck6hfr2g0y/images/loading.gif
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472374/%E6%B2%B3%E5%8D%97%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/472374/%E6%B2%B3%E5%8D%97%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

const username = "填写你的学号";
const password = "填写你的密码";
const currentHref = window.location.href;
function generateFormSelector() {
  let retObj = undefined;
  if (currentHref.includes("gportal/web/login")) {
    retObj = {
      userSelector: "first_name",
      passSelector: "first_password",
      btnSelector: ".form-input.submit_btn",
    };
  } else if (currentHref.includes("srun_portal_pc")) {
    retObj = {
      userSelector: "username",
      passSelector: "password",
      btnSelector: ".btn-login",
    };
  }
  return retObj;
}
function main() {
  if (
    currentHref.includes("gportal/web/login") ||
    currentHref.includes("srun_portal_pc")
  ) {
    const formSelector = generateFormSelector();
    document.getElementById(formSelector.userSelector).value = username;
    document.getElementById(formSelector.passSelector).value = password;
    const secondLoginButton = document.querySelector(formSelector.btnSelector);
    if (secondLoginButton) {
      secondLoginButton.click();
    }
  }
}
main()
})();

// Hello my friend, this is my contact information, welcome to advise
// Blog:    https://site.hpuedd.top/
// GitHub:  https://github.com/HPUhushicheng/