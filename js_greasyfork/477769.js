// ==UserScript==
// @name         星云改LOGO
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  自己用的脚本，用来方便改LOGO
// @author       CHEN
// @license      MIT
// @match        https://www.xingyunfeijiu.com/splicing-screen/
// @match        https://www.xingyunfeijiu.vip/splicing-screen/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xingyunfeijiu.com
// @grant        GM_addStyle
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/477769/%E6%98%9F%E4%BA%91%E6%94%B9LOGO.user.js
// @updateURL https://update.greasyfork.org/scripts/477769/%E6%98%9F%E4%BA%91%E6%94%B9LOGO.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...
  let css = `
  .page-login .title-bar .project-name{
    width: 50px;
    overflow: hidden;
    display: flex;
    align-items: center;
  }
  .home-wrap .title-bar .project-name{
    width: 50px;
    overflow: hidden;
    display: flex;
    align-items: center;
    margin-right: 230px;
  }
  .page-login .title-bar .title-bar{
    width: 50px;
    overflow: hidden;
    display: flex;
    align-items: center;
  }
  .project-name_text{
    position: absolute;
    left: 120px;
    color: #fff;
    font-size: 30px;
  }
  `
  GM_addStyle(css)

  function addHtml(className){
    // 登录页面
    let p = document.getElementsByClassName(className)[0]
    let child = document.createElement('div')
    child.innerHTML = '自定义文本'
    child.className = 'project-name_text'
    p.appendChild(child)
  }


  window.onload = function () {
    addHtml('project-name')
    // addHtml('title-bar')
  }
})();