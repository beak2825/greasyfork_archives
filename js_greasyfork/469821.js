// ==UserScript==
// @name           GY TikTok 广告链接优化助手
// @description    此插件用来自动检测/补全 TikTok 广告目标链接，使之能够全链路追踪
// @author         BikeKoala
// @contributor    BikeKoala
// @version        1.0.0
// @license        MIT
// @connect        *
// @match          https://ads.tiktok.com/i18n/*
// @require        https://cdn.staticfile.org/jquery/3.6.0/jquery.js
// @icon           https://lf16-ttmp.byteintlstatic.com/obj/goofy-sg/tt4b_main/favicon.ico
// @run-at         document-end
// @namespace      bikekoala_js
// @downloadURL https://update.greasyfork.org/scripts/469821/GY%20TikTok%20%E5%B9%BF%E5%91%8A%E9%93%BE%E6%8E%A5%E4%BC%98%E5%8C%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/469821/GY%20TikTok%20%E5%B9%BF%E5%91%8A%E9%93%BE%E6%8E%A5%E4%BC%98%E5%8C%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 定义变量
/* globals $ jQuery */
const mInputId = 'creative_aco_url'
const mUnselectedButtonClass = '_goyoo_handle_param'
const mParamsTipId = '_goyoo_params_tip'
const mUtmParams = {
  utm_source: 'TikTok',
  utm_medium: 'video',
  utm_content: '__CAMPAIGN_ID__-__AID__-__CID__'
}

function showUnselectedButton() {
  removeBtnArea()
  const $container = $('#material_external_url')
  $container.parent().append(`
    <div id="_goyoo_params_tip" style="display: flex; margin-top: 8px;">
      <span content="" placement="bottom" effect="light" class="index_switch_fSi_w _goyoo_handle_param">
        <div role="switch" class="vi-switch vi-tooltip item" elementtiming="perf-element-timing" aria-describedby="vi-tooltip-4638" tabindex="0">
          <input type="checkbox" name="" true-value="true" class="vi-switch__input" elementtiming="perf-element-timing">
          <span class="vi-switch__core" elementtiming="perf-element-timing" style="width: 35px;"></span>
        </div>
      </span>
      <div>
        <div class="index_contentTitle_G8rcQ index_contentTitleDisalbled_HFwGw handle_text" style="color: #F56C6C;">
        未添加追踪参数，请点击左侧按钮进行添加
         <span class="index_redDot_yquYy"></span>
        </div>
      </div>
    </div>
  `)
  if (!isInputDisabled()) {
    addEventToUnselectedBtn()
  }
}

function showSelectedButton() {
  removeBtnArea()
  const $container = $('#material_external_url')
  $container.parent().append(`
    <div id="_goyoo_params_tip" style="display: flex; margin-top: 8px;">
      <div role="switch" class="vi-switch vi-tooltip is-checked item" elementtiming="perf-element-timing" aria-describedby="vi-tooltip-6988" tabindex="0" aria-checked="true">
        <input type="checkbox" name="" true-value="true" class="vi-switch__input" elementtiming="perf-element-timing">
        <span class="vi-switch__core" elementtiming="perf-element-timing" style="width: 35px;"></span>
      </div>
      <div>
        <div class="index_contentTitle_G8rcQ index_contentTitleDisalbled_HFwGw handle_text" style="color: #67C23A;">
        追踪参数已添加
        <span class="index_redDot_yquYy"></span>
        </div>
      </div>
    </div>
  `)
}

// 处理当url参数为空时，点击那个添加参数的按钮进行提醒
function addUrlTip() {
  const $textDom = $('#' + mParamsTipId).children(':last-child')
  $textDom.remove()
  $('#' + mParamsTipId).append(`
    <div>
      <div class="index_contentTitle_G8rcQ index_contentTitleDisalbled_HFwGw handle_text" style="color: #F56C6C;">
      请先添加链接，再添加追踪参数
       <span class="index_redDot_yquYy"></span>
      </div>
    </div>
  `)
}

// 处理当url非法时，点击那个添加参数的按钮进行提醒
function addIllegalUrlTip() {
  const $textDom = $('#' + mParamsTipId).children(':last-child')
  $textDom.remove()
  $('#' + mParamsTipId).append(`
    <div>
      <div class="index_contentTitle_G8rcQ index_contentTitleDisalbled_HFwGw handle_text" style="color: #F56C6C;">
      请添加正确的链接，再添加追踪参数
       <span class="index_redDot_yquYy"></span>
      </div>
    </div>
  `)
}

function removeBtnArea() {
  const tipArea = $('#' + mParamsTipId)
  tipArea.remove()
}

function handleInputFocus() {
  removeBtnArea()
  showUnselectedButton()
}

// 判断input输入框是否是disabled状态
function isInputDisabled() {
  const inputDom = $('#' + mInputId)
  return inputDom.prop('disabled')
}

// 点击未选中按钮时的回调函数：点击之后对input内容进行格式化调整，添加上相应参数，并且显示已选中的按钮，提示语也做相应变化
function handleUnselectedBtnClick() {
  const input = document.getElementById(mInputId)
  let value = input.value
  if (!value) {
    addUrlTip()
    return
  }
  try {
    const url = new URL(value)
    for (const key of Object.keys(mUtmParams)) {
      url.searchParams.set(key, mUtmParams[key])
    }
    value = url.toString()
  } catch (e) {
    addIllegalUrlTip()
    return
  }
  input.value = value
  const event = new InputEvent('input', { bubbles: true })
  input.dispatchEvent(event)
  const blurEvent = new InputEvent('blur', { bubbles: true })
  input.dispatchEvent(blurEvent)
  showSelectedButton()
}

// 给未选中按钮添加点击事件
function addEventToUnselectedBtn() {
  const btnDom = $('.' + mUnselectedButtonClass)[0]
  btnDom.addEventListener('click', handleUnselectedBtnClick)
}

// 打开修改页面回显input数据时，进行检验参数，如果不带参数则显示未选中的按钮，如果带参数显示已选中的按钮
function checkParams() {
  const input = document.getElementById(mInputId)
  let value = input.value
  let containAllParamsFlag = true
  let url = null
  let params = null
  try {
    url = new URL(value)
    params = url.searchParams
  } catch (e) {
    return
  }
  for (const key of Object.keys(mUtmParams)) {
    if (!params.has(key) || params.get(key) != mUtmParams[key]) {
      containAllParamsFlag = false
    }
  }
  if (containAllParamsFlag == true) {
    showSelectedButton()
  } else {
    showUnselectedButton()
  }
}

;(function () {
  'use strict'

  setInterval(function () {
    const input = document.getElementById(mInputId)
    const tipArea = document.getElementById(mParamsTipId)

    // 当可以获取到input的值之后，并且按钮提示区域dom已经显示之后，对input里面的值进行检查
    if (input?.value && tipArea) {
      checkParams()
    }

    // 当页面初始化时input框的dom还没有渲染出来时或者按钮区域dom已经有了之后，就返回，避免后面重复创建按钮区域dom
    if (!input || tipArea) {
      /*
       判断input的值是否为空，空的时候就显示未添加参数的按钮
      （目的是修复当input中追踪参数已添加，且追踪参数状态显示已添加时，突然删除input框内容，而下面按钮区域仍显示参数已添加的bug）
      */
      if (input?.value === '') {
        showUnselectedButton()
      }
      return
    }

    // 页面初始化时，默认显示未添加追踪参数按钮
    showUnselectedButton()

    // input框的dom第一次被渲染之后，给它添加上focus事件
    input.addEventListener('focus', handleInputFocus)
  }, 2000)
})()
