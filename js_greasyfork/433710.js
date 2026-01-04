// ==UserScript==
// @name         publink-shb-login-page-beautify
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  publink 售后宝首页美化
// @author       HuangBaoCheng
// @include      *://*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/433710/publink-shb-login-page-beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/433710/publink-shb-login-page-beautify.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  if (window.location.href.indexOf('ltd') < 0 && window.location.href.indexOf('shouhoubao') < 0) return
  
  let tenantList = []
  let dingtalkMixinComponent = {}
  
  // Your code here...
  try {
    
    window.onload = function() {
      const loginContainerElement = document.querySelector('.login-container')
      if (loginContainerElement) {
        loginContainerElement.style.height = '100vh'
      }
      
      const loginBoxElement = document.querySelector('.login-box')
      if (loginBoxElement) {
        loginBoxElement.style.width = '470px'
        loginBoxElement.style.minHeight = '870px'
      }
      
    }
    
    let isFindChooseTenantContentElement = false
    
    const setIntervalSetChooseTenantStyle = setInterval(function() {
      const elCarouselContainerElement = document.querySelector('.el-carousel__container')
      const chooseTenantContentElement = document.querySelector('.choose-tenant_content')
      
      if (!elCarouselContainerElement || isFindChooseTenantContentElement) return
      
      if (chooseTenantContentElement) {
        chooseTenantContentElement.style.justifyContent = 'flex-start'
      }
      
      isFindChooseTenantContentElement = true
      
      const elCarouselElement = document.querySelector('.el-carousel')
      if (elCarouselElement) {
        elCarouselElement.style.height = 'calc(100% - 150px)'
      }
      
      if (elCarouselContainerElement) {
        elCarouselContainerElement.style.height = '100%'
      }
      
      setTimeout(function() {
        setElCarouselContainerDivElements()
      }, 300)
      
      tenantList = getTenantList()
      
    }, 500)
    
    function setElCarouselContainerDivElements() {
      const elCarouselContainerDivElements = document.querySelectorAll('.el-carousel__container > div')
      
        for (let i = 0; i < elCarouselContainerDivElements.length; i++) {
          let spanElement = document.createElement('span')
          spanElement.innerText = tenantList[i] ? tenantList[i].tenantName : ''
          elCarouselContainerDivElements[i].appendChild(spanElement)
          elCarouselContainerDivElements[i].onclick = function(event) {
            event.stopPropagation()
            login(i)
          }
        }
    }
    
    function login(index) {
      let currentTenant = tenantList[index]
      if (!currentTenant) return
      
      dingtalkMixinComponent.currentTenant = currentTenant
      dingtalkMixinComponent.confirmToLogin(currentTenant)
    }
    
    function getTenantList() {
      const appElement = document.querySelector('#app')
      if (!appElement || !appElement.__vue__) return
      
      dingtalkMixinComponent = findComponentDownward(appElement.__vue__, 'dingtalk-mixin') || {}
      const tenantList = dingtalkMixinComponent.tenantList || []
      
      return tenantList
    }
    
    /* 向下找到最近指定组件 */
    function findComponentDownward(context, componentName) {
      const childrens = context?.$children
      let children = null
      
      if (!childrens || !childrens.length) return children
      
      for (const child of childrens) {
        // 判断当前的子元素 名字是否相同
        if(child.$options.name == componentName) {
          children = child
          break
        } else {
          // 递归判断 当前子元素的 子元素是否相等
          let isChild = findComponentDownward(child, componentName);
          if(isChild) {
            children = isChild
            break
          }
        }
      }
      
      return children
    }
    
    function addNewStyle(newStyle) {
      let styleElement = document.createElement('style');
      styleElement.type = 'text/css';
      styleElement.id = 'styles_js';
      document.getElementsByTagName('head')[0].appendChild(styleElement);
      
      styleElement.appendChild(document.createTextNode(newStyle));
    }
    
    addNewStyle(`
      #dingtalk-login-frame {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .el-carousel__item {
        transform: inherit !important;
        height: 50px;
        width: 100% !important;
        position: inherit !important;
      }
      .el-carousel__container button {
        display: none !important;
      }
      .el-carousel__container {
        padding: 20px 0;
        overflow-y: scroll !important;
      }
      .login-box {
        max-height: 870px;
      }
      .login-content {
        margin-top: 100px;
      }
      .tenantName {
        display: none !important;
      }
      .confirm-button,
      .switch-other-way {
        margin-top: 10px;
      }
      .el-carousel__container > div > span {
        cursor: pointer;
      }
      .login-bottom-wrap {
        display: none !important;
      }
      .el-carousel__item {
        margin-top: 10px;
      }
    `)
    
  } catch (error) {
    console.warn('publink-shb-login-page-beautify -> ', error)
  }
  
})();