// ==UserScript==
// @name        百度云提取码
// @namespace   Violentmonkey Scripts
// @match       https://*.gamer520.com/*.html
// @grant       none
// @version     1.0
// @license     MIT
// @author      -
// @description gamer520自动填写密码、百度云提取码
// @downloadURL https://update.greasyfork.org/scripts/514754/%E7%99%BE%E5%BA%A6%E4%BA%91%E6%8F%90%E5%8F%96%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/514754/%E7%99%BE%E5%BA%A6%E4%BA%91%E6%8F%90%E5%8F%96%E7%A0%81.meta.js
// ==/UserScript==


const pwdBh = ()=>{
  const pwdDom = document.querySelector(".entry-title");
  if (pwdDom) {
    const pwd = pwdDom.textContent.match(/\w+/)?.[0];
    const passwordInput = document.querySelector("input[name='post_password']");
    if (pwd && passwordInput) {
      passwordInput.value = pwd;
      const submitButton = document.querySelector("input[name='Submit']");
      submitButton?.click();
    }
  }
}
const baiduyunSuff = ()=>{
  var aTags = document.querySelectorAll('.entry-content.u-text-format.u-clearfix a');
  aTags.forEach(aTag => {
    if (aTag.textContent.includes("pan.baidu.com")) {
      let nextSibling = aTag.parentNode.nextSibling;
      while (nextSibling && nextSibling.nodeType !== Node.ELEMENT_NODE) {
        nextSibling = nextSibling.nextSibling;
      }
      if (nextSibling && (tqm = nextSibling.textContent.match(/\w+/)?.[0])) {
        aTag.href += `?pwd=${tqm}`;
        aTag.textContent += `?pwd=${tqm}`;
        aTag.style.color = "red";
      }
    }
  })
}
setTimeout(()=>{
  // 填充密码
  pwdBh()
  // 百度云链接添加提取码后缀
  baiduyunSuff()
},1000)