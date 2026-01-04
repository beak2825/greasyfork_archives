// ==UserScript==
// @name         Github 云VSCode「用VS Code打开当前项目」
// @namespace    https://github.com/wanguano
// @version      0.2
// @description  在浏览器中使用VS Code环境打开当前Github项目，再也不用Clone到本地使用IDE打开项目了😎
// @author       风不识途
// @match        *://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421564/Github%20%E4%BA%91VSCode%E3%80%8C%E7%94%A8VS%20Code%E6%89%93%E5%BC%80%E5%BD%93%E5%89%8D%E9%A1%B9%E7%9B%AE%E3%80%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/421564/Github%20%E4%BA%91VSCode%E3%80%8C%E7%94%A8VS%20Code%E6%89%93%E5%BC%80%E5%BD%93%E5%89%8D%E9%A1%B9%E7%9B%AE%E3%80%8D.meta.js
// ==/UserScript==



(function() {
    'use strict';
  const run = () => {
    let matchUrl = window.location.href.replace('github', 'github1s')
    const controlGroupDom = document.querySelector("#js-repo-pjax-container > div.bg-gray-light.pt-3.hide-full-screen.mb-5 > div.d-flex.mb-3.px-3.px-md-4.px-lg-5 > ul")
    const firstLi = controlGroupDom.firstChild
    const newBtn = btnEle(matchUrl)
    controlGroupDom.insertBefore(newBtn, firstLi)
  }

  const btnEle = (url, text = 'GOTO IDE') => {
    let li = document.createElement('li');
    let a = document.createElement('a');
    li.appendChild(a);
    a.href = url;
    a.innerHTML = text;
    a.target = '_bank';
    a.className = 'btn btn-sm btn-with-count  js-toggler-target';
    a.style.cssText = 'color: #ffb061; background: linear-gradient(to left, #9400D3, #4B0082);border-radius: 10%;transition: all .5s;'
    a.addEventListener('mouseover', ({target}) => {
      target.style.cssText = 'color: #rgb(63,136,148); background: linear-gradient(to bottom, #E0EAFC, #CFDEF3);border-radius: 10%;'
    })
    a.addEventListener('mouseout', ({target}) => {
      a.style.cssText = 'color: #ffb061; background: linear-gradient(to left, #9400D3, #4B0082);border-radius: 10%;transition: all .5s;'
    })
    return li
  };

  run()
    // Your code here...
})();