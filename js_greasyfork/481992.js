// ==UserScript==
// @name         网页样式格式化
// @namespace    xywc-s
// @author       xywc-s
// @version      1.1.1
// @description  一些网页的样式格式化
// @match        https://*.2biqu.com/*
// @match        https://*.2biquw.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spankbang.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481992/%E7%BD%91%E9%A1%B5%E6%A0%B7%E5%BC%8F%E6%A0%BC%E5%BC%8F%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/481992/%E7%BD%91%E9%A1%B5%E6%A0%B7%E5%BC%8F%E6%A0%BC%E5%BC%8F%E5%8C%96.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

const {host} = location
switch(host){
  case 'www.2biquw.com':
  case 'www.2biqu.com':
      biquFormat();
  break;
}

function biquFormat(){
    console.log('biqu')
    document.querySelector('.layout').style.border = 'none'
    const readerFun = document.querySelector('.reader-fun')
    readerFun.style.margin = '0 12px'
    readerFun.style.float = 'none'
    const searchForm = document.querySelector('.search-form')
    searchForm.style.margin = 0
    searchForm.style.float = 'none'
    searchForm.style.width = 'auto'
    const searchInput = document.querySelector('#keyWord')
    searchInput.style.width = 'auto'
    searchInput.style.height = '30px'
    searchInput.style.backgroundColor = 'transparent'
    searchInput.style.borderBottom = '1px solid #aaa'
    searchInput.style.borderWidth = '0 0 1px 0'
    searchInput.placeholder = '作者、书名'
    const searchBtn = document.querySelector('.btn-tosearch')
    searchBtn.style.width = 'auto'
    searchBtn.style.backgroundColor = 'transparent'
    const layoutTit = document.querySelector('.layout-tit')
    layoutTit.style.backgroundColor = 'transparent'
    layoutTit.style.border = 'none'
    layoutTit.append(searchForm)
    layoutTit.style.display = 'flex'
    layoutTit.style.justifyContent = 'center'
    const header = document.querySelector('.header')
    header.append(layoutTit)
    header.style.width = 'auto'
    

}