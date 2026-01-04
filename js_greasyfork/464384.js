// ==UserScript==店小秘
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1s
// @description  店小秘
// @author       You
// @match        https://www.dianxiaomi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dianxiaomi.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464384/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/464384/New%20Userscript.meta.js
// ==/UserScript==

;(function () {
  "use strict"
  const sleep = (time) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, time)
    })
  }

  const pageScroll = (selector) => {
    const element = document.querySelector(selector)
    document.body.scrollTop = element.getBoundingClientRect().top - 100
  }

  window.$dxm = {
    store: {
      sku: false,
    },
    async handleShopid() {
      pageScroll('#shopId')
      await sleep(300)
      // 政政这个店铺
      document.querySelector('[name="shopId"]').value = "4231507"
      window.selectShop();
    },
    // 标题
    async handleSubject() {
      pageScroll('#subject')
      await sleep(300)
      alert("请前往chatgpt")
    },
    // 品牌
    async handleBrand() {
      pageScroll('#productAttribute')

      11594115643
    },
    // 产品分组
    async handleProductGroup() {
      pageScroll('#groupIdSpan')
    },
    async handleProductImage() {
      alert("注意产品图片是是否有logo，需要去掉")
    },
    async handleSku() {
      pageScroll('#skuVariantList')
      await sleep(300)
      if (this.store.sku) return
      // 处理价格
      var all = [...document.querySelectorAll(["#skuVariantList .sellingPriceResultCiteToAllProductSKU"])]
      all.forEach((node) => {
        node.value = (node.value * 7).toFixed(2)
      })
      this.store.sku = true
    },
    // 发货期限
    async handleDeliveryTime() {
      pageScroll('#deliveryTime')
      await sleep(300)
      document.querySelector('[name="deliveryTime"]').value = "7"
    },
    // PC端描述
    async handlePcDetail() {
      // 请检查是否有logo
      const name = 'myj-editor'
      const newDiv = document.createElement('div')
      newDiv.innerHTML = window.getEditorData(name)
      console.log(newDiv.innerText)
      // ar url =$("input[name='sourceUrl']").val();
      // var setEditorData = function(name,value){
      //   CKEDITOR.instances[name].setData(value);//编辑器插入内容
      // };
      // 插入footer template
      const footerTemplate = '<img class="noImg" referrerpolicy="no-referrer" data-kse="%3Ckse%3Awidget%20data-widget-type%3D%22customText%22%20id%3D%221005000002442024%22%20title%3D%22footer%20template%22%20type%3D%22custom%22%3E%3C/kse%3Awidget%3E" src="http://style.aliexpress.com/js/5v/lib/kseditor/plugins/widget/images/widget1.png?t=AEO9LPV"/>'
      window.insertEditorData(name, footerTemplate)
    },
    // 无线端描述
    async handleSmtDetail() {
      smtNewEditor.newEditorModalShow()
      await sleep(300)
      // 根据PC端描述一键生成
      smtNewEditor.aKeyGenerationDesc()
      await sleep(300)
      document.querySelector(".modal-alert .btn-determine").click()
      await sleep(1200)
      //保存
      smtNewEditor.saveNewEditorData()
    },
    // 运费模板
    async handleFreight() {},
  }

  const style = document.createElement("style")
  style.setAttribute("type", "text/css")
  style.innerHTML = `
    .tm-menu {
        position: fixed;
        right: 10px;
        bottom: 10px;
    }
	`
  document.head.appendChild(style)

  const menu = document.createElement("div")
  menu.className = "tm-menu"
  menu.innerHTML = `
    <ul>
      <li onclick="window.$dxm.handleShopid()">1.店铺名称</li>
      <li onclick="window.$dxm.handleSubject()">2.产品标题</li>
      <li onclick="window.$dxm.handleBrand()">3.品牌</li>
      <li onclick="window.$dxm.handleProductGroup()">4.产品分组</li>
      <li onclick="window.$dxm.handleProductImage()">5.产品图片</li>
      <li onclick="window.$dxm.handleSku()">6.sku</li>
      <li onclick="window.$dxm.handleDeliveryTime()">7.发货期限</li>
      <li onclick="window.$dxm.handlePcDetail()">8.PC端描述</li>
      <li onclick="window.$dxm.handleSmtDetail()">9.无线端描述</li>
      <li onclick="window.$dxm.handleFreight()">10.运费模板</li>
    </ul>
    `
  document.body.appendChild(menu)

})()
