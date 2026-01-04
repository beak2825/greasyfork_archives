// ==UserScript==
// @name         智能店长编辑
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  智能店长编辑器
// @author       肥猫
// @license MIT
// @match        https://dddz.jiancent.com/item/item/manage
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479146/%E6%99%BA%E8%83%BD%E5%BA%97%E9%95%BF%E7%BC%96%E8%BE%91.user.js
// @updateURL https://update.greasyfork.org/scripts/479146/%E6%99%BA%E8%83%BD%E5%BA%97%E9%95%BF%E7%BC%96%E8%BE%91.meta.js
// ==/UserScript==

(function () {
  'use strict'

  waitForElementToAppear(
    '.J_editProductTabs',
    () => {
      console.log('J_wareInfoAttribute appear')
      addButton('.J_editProductTabs')
    },
    1000
  )
})()

const start = async () => {
  let n = 0
  let productSize = $('#J_editProductList .box-product').size()
  while (productSize--) {
    selectEdit()
    inputEdit()
    saveAndNext()
    await new Promise(resolve => setTimeout(resolve, 5000))
  }
}

const keyMap = new Map([
  ['上市时间', '2023'],
  ['面料材质', ['54740', '267715']],//聚酯纤维，其他纤维
])

const saveAndNext = async () => {
  const saveBtn = $('.J_saveEditedProduct')
  const nextBtn = $('.J_gotoNextProduct')
  saveBtn.click()
  nextBtn.click()
}

const inputEdit = () => {
  const inputElm = $('#J_wareInfoAttribute input.J_cateAttributeItems')
  inputElm &&
    inputElm.each((index, item) => {
      const label = $(item).attr('data-pid')
      //品牌单独处理，设置为无品牌
      if (index == 0) {
        $(item).val('596120136')
      } else {
        if (keyMap.has(label)) {
          $(item).val(keyMap.get(label))
        }
      }
    })
}

const selectEdit = () => {
    //普通单选
  $('#J_wareInfoAttribute select[data-type="select"]').each((index, item) => {
    const label = $(item).attr('data-pid')

    if ($(item).val() == 0) {
      const option1 = $(item).find('option').eq(1)
      $(item).val(option1.val())
    }
  })

  //多选框
  const multiSelectElm = $('#J_wareInfoAttribute select.J_multipleCateAttributeItems')
  multiSelectElm &&
    multiSelectElm.each((index, item) => {
      const label = $(item).attr('data-pid')
        //某些特殊属性特殊处理
      if (!$(item).val()) {
        if (keyMap.has(label)) {
            $(item).val(keyMap.get(label))
          } else {
            const option1 = $(item).find('option').eq(1)
            $(item).val([option1.val()])
          }
      }
    })
}

const addButton = parent => {
  const attrElement = $(parent)
  const btn = $('<button>开始</button>')
  attrElement.append(btn)

  btn.click(async event => {
    event.stopPropagation()
    event.preventDefault()
    start()
  })
}

// 检查某个元素是否出现
function waitForElementToAppear(elementSelector, callback, intervalMs) {
  var checkInterval = setInterval(function () {
    var element = $(elementSelector)
    if (element.length > 0) {
      clearInterval(checkInterval)
      callback(element)
    }
  }, intervalMs)
}
