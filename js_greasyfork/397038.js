// ==UserScript==
// @name         显示 greasyfork 当前页面脚本的总安装量
// @namespace    https://1silencer.github.io/
// @version      0.4.3
// @description  在用户页面生效(网页的标题)
// @author       Silencer
// @match        *://greasyfork.org/*/users/*
// @icon         https://greasyfork.org/assets/blacklogo96-e0c2c76180916332b7516ad47e1e206b42d131d36ff4afe98da3b1ba61fd5d6c.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397038/%E6%98%BE%E7%A4%BA%20greasyfork%20%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E8%84%9A%E6%9C%AC%E7%9A%84%E6%80%BB%E5%AE%89%E8%A3%85%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/397038/%E6%98%BE%E7%A4%BA%20greasyfork%20%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E8%84%9A%E6%9C%AC%E7%9A%84%E6%80%BB%E5%AE%89%E8%A3%85%E9%87%8F.meta.js
// ==/UserScript==

document.title = `${document.querySelector('.user-profile-link')?document.querySelector('.user-profile-link').innerText:''}共${document.querySelectorAll('.script-list-total-installs').length / 2}个脚本安装量:${new Array(...document.querySelectorAll('.script-list-total-installs')).filter(i=>!isNaN(parseFloat(i.innerText))).reduce((sum, i) =>sum + Number(i.innerText.replace(/\D/, '')), 0)}`