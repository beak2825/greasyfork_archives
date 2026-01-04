// ==UserScript==
// @name        移除弹窗和跳转
// @namespace   vurses
// @license     Mit
// @author      layenh
// @match       https://security-otp.kakaogames.com/*
// @grant       none
// @version     1.0
// @run-at      document-start
// @description 移除kakao弹窗和跳转
// @downloadURL https://update.greasyfork.org/scripts/535673/%E7%A7%BB%E9%99%A4%E5%BC%B9%E7%AA%97%E5%92%8C%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/535673/%E7%A7%BB%E9%99%A4%E5%BC%B9%E7%AA%97%E5%92%8C%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==


const originalCall = Function.prototype.call;
Function.prototype.call = function (...args) {
  if (this.name === "4528") {
    let temp = this.toString();
    temp.indexOf(`alert(B.$i18n.t("page.error.common"))`);
    console.log(temp.indexOf(`alert(B.$i18n.t("page.error.common"))`))
    // // 移除alert并直接return防止跳转
    temp = temp.replace(`alert(B.$i18n.t("page.error.common"))`,`console.log("hello world!")`);
    temp = temp.replace(`f.replace(I("/"))`,`console.log("code injected successful!")`);
    temp = eval("(" + temp + ")");
    return originalCall.apply(temp, args);
  }
  return originalCall.apply(this, args);
};