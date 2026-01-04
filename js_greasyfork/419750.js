// ==UserScript==
// @name         Gitee 优化
// @icon         https://gitee.com/assets/favicon.ico
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  10101010
// @author       Bubble
// @match        *://*gitee.com/*
// @grant        GM_addStyle
// @grant        GM_listValues
// @grant        GM_log
// @grant        GM_getTab
// @downloadURL https://update.greasyfork.org/scripts/419750/Gitee%20%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/419750/Gitee%20%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

;(function() {
  'use strict';
  const hiddenList = [
    document.querySelector('.udesk-icon-item'),
    document.querySelector("#git-header-nav > div > div.right.menu.userbar > div.item.text"),
    document.querySelector("#git-nav-user-bar > div.ent-guide-helper-button"),
    document.querySelector("#enterprise-projects-app > div.ent-projects > div.ent-filters-panel"),
  ]
  hiddenList.forEach(item=>{
    if(item){
      item.style.display = 'none'
    }
  })
  const headerIcons = document.querySelectorAll("#git-header-nav i")
  headerIcons.forEach(item=>{
    item.style.color = 'white'
  })

  GM_addStyle(`
:root {
  --color-blue-light: #e3f2fd;
  --color-blue: #03a9f4;
  --color-blue-1: #01579b;
}
#git-header-nav,
.ui.orange.button{
  background: var(--color-blue) !important;
}
.ui.basic.orange.button,
.ui.menu .orange.active.item, .ui.orange.menu .active.item {
  border-color: var(--color-blue) !important;
  color: var(--color-blue) !important;
}
.ui.basic.orange.button:hover {
  color: var(--color-blue-1) !important;
}
.ui.orange.secondary.menu .active.item .ui.label {
  color: var(--color-blue) !important;
  background: var(--color-blue-light) !important;
}
#git-header-nav #git-nav-user .userbar>.item.active.visible,
#git-header-nav #git-nav-user .userbar>.item.active.visible:hover{
  background: var(--color-blue) !important;
}
.ent-dashboard-page .workbench-sidebar>.ui.menu>.item.active:after, #admin-enterprise.has-workbench-sidebar .workbench-sidebar>.ui.menu>.item.active:after {
  background: none !important;
}
#dashboard-sidebar > div > a.item.active {
  background: var(--color-blue);
  border-radius: 8px;
  height: 70px !important;
  box-sizing: border-box;
  color: white !important;
}
#dashboard-sidebar > div > a.item.active i {
  color: white !important;
}
.ent-view-sidebar {
  background: var(--color-blue-1);
}
.ent-view-sidebar:before {
  content:'';
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  z-index: -1;
  background-image: url(https://miro.medium.com/max/719/1*WaaXnUvhvrswhBJSw4YTuQ.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom;
}
`)
})()

function request(url, method, data){
  method = method || 'GET'
  data = data || {}
  return new Promise((resolve, reject)=>{
    fetch(url, {method, data}).then(res=>res.json()).then(res=>resolve(res)).catch(err=>reject(err))
  })
}