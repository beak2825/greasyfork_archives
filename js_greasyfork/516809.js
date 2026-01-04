// ==UserScript==
// @name        ubits_upload_subsidiary
// @namespace   Violentmonkey Scripts
// @match       https://ubits.club/upload.php*
// @description ubits发种辅助
// @grant       none
// @version     0.0.3
// @author      Jeremy
// @icon        https://ubits.club/pic/logo_V2.png
// @description 2024/11/10 20:27:11
// @grant       GM_xmlhttpRequest
// @connect     https://ubits.club/ajax.php
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/516809/ubits_upload_subsidiary.user.js
// @updateURL https://update.greasyfork.org/scripts/516809/ubits_upload_subsidiary.meta.js
// ==/UserScript==
;(async function () {
  'use strict'
  let url = window.location.href
  console.log(url)
  console.log(url.includes('upload') && url.includes('ubits.club'))
  if (url.includes('upload') && url.includes('ubits.club')) {
    // 获取指定元素
    const targetElement = document.querySelector('input[name="small_descr"]') // 将 'targetElementId' 替换为你的元素ID
    // 创建新的父元素
    const parentElement = document.createElement('div')

    // 设置父元素的样式为 flex 布局
    parentElement.style.display = 'flex'
    parentElement.style.justifyContent = 'space-between' // 可根据需求设置
    parentElement.style.alignItems = 'center' // 可根据需求设置

    // 将原来的 input 元素插入到新父元素中
    targetElement.parentNode.insertBefore(parentElement, targetElement)
    parentElement.appendChild(targetElement)
    // 创建按钮元素

    // 创建包含按钮的 div 元素
    const buttonWrapper = document.createElement('div')

    // 创建按钮 input 元素
    const button = document.createElement('input')
    button.type = 'button'
    button.className = 'nexus-action-btn'
    button.value = '解析豆瓣'
    button.onclick = function (e) {
      e.stopPropagation()
      handleAnalysisDouban()
    }

    // 将按钮添加到 div 中
    buttonWrapper.appendChild(button)
    // 将按钮插入到目标元素后面
    targetElement.insertAdjacentElement('afterend', button)
  }
})()

async function handleAnalysisDouban() {
  var genUrl = document.querySelector("input[name='pt_gen']").value
  console.log(genUrl)
  if (!genUrl) return showToast('请先填入imdb/douban/bangumi/indienova链接地址')

  // 修改标题的值
  const text = document.querySelector('input[name="name"]').value
  if (!text) return showToast('请先填入获取PT-Gen简介信息')

  document.querySelector('input[name="name"]').value = `${text.replace(
    /(\[.*?\])\s+/,
    '$1'
  )}`

  // 修改简介的值
  const desc = document.querySelector('textarea[name="descr"]').value
  if (!desc.includes('禁转PTT')) {
    document.querySelector(
      'textarea[name="descr"]'
    ).value = `[quote][b][color=Red][size=6]禁转PTT[/size][/color][/b][/quote]\n${document
      .querySelector('textarea[name="descr"]')
      .value?.replace(/img1/, 'img9')}`
  }

  // 修改页面展示
  const hiddenRows = document.querySelectorAll(
    'tr.mode_4[style="display: none;"]'
  )
  // 遍历每个元素，将 display 样式改为 "table-row"
  hiddenRows.forEach((row) => {
    row.style.display = 'table-row'
  })

  // 标题名称中包含UBWEB
  if (text && text.includes('UBWEB')) {
    document.querySelector('select[name="team_sel[4]"]').value = '6'
    // 勾选 value="3"（官方）的复选框
    document.querySelector(
      'input[type="checkbox"][name="tags[4][]"][value="3"]'
    ).checked = true
    // 勾选 value="6"（中字）的复选框
    document.querySelector(
      'input[type="checkbox"][name="tags[4][]"][value="6"]'
    ).checked = true
    // 勾选一级置顶
    document.querySelector('select[name="pos_state"]').value = 'sticky'
  } else if (text && text.includes('UBits')) {
    document.querySelector('select[name="team_sel[4]"]').value = '1'
  } else {
    document.querySelector('select[name="team_sel[4]"]').value = '5'
  }
  if (text) {
    // 根据标题名自动适配
    normalSelectValue('medium_sel[4]', text)
    normalSelectValue('codec_sel[4]', text)
    normalSelectValue('audiocodec_sel[4]', text)
    normalSelectValue('standard_sel[4]', text)
  }

  // 截止时间
  const dateTimeElement = document.getElementById(
    'datetime-picker-pos_state_until'
  )
  if (text.includes('Complete')) {
    dateTimeElement.value = getCutoffTime(5)
  } else {
    dateTimeElement.value = getCutoffTime(2)
  }

  // 默认勾选匿名发布
  document.querySelector('input[type="checkbox"][name="uplver"]').checked = true

  // 设置HR值为NO
  document.querySelector(
    'input[type="radio"][name="hr[4]"][value="0"]'
  ).checked = true

  // 请求数据
  const formData = new FormData()

  /**
   * 生成副标题名称
   * 添加表单字段 */
  formData.append('action', 'getPtGen')
  formData.append('params[url]', genUrl)
  fetch('https://ubits.club/ajax.php', {
    method: 'POST',
    body: formData
  })
    .then((response) => response.json()) // 解析响应为 JSON 格式
    .then((result) => {
      console.log('Success:', result) // 输出响应数据
      if (result.ret === 0) {
        const { data } = result
        const origin_title = document.querySelector("input[name='name']").value
        const newTitle = data?.trans_title
          ?.filter(
            (item) => !origin_title.replace(/\[.*?\]\s*/, '').includes(item)
          )
          .join('/')
        const split_str = ' | '
        const sub_title = `${newTitle}${split_str}${
          data?.episodes > 0 ? `全${data?.episodes}集` : ''
        }${split_str}导演：${filtersName(
          data?.director,
          data?.director?.length
        )}${split_str}主演: ${filtersName(
          data?.cast,
          4
        )} [${data?.language.join('|')}/${data?.captions || '中字'}]`
        document.querySelector("input[name='small_descr']").value = sub_title

        // 类型判断
        let type = '402'
        const { genre } = data
        if (genre.includes('动画')) type = '405'
        if (genre.includes('真人秀') || genre.includes('脱口秀')) type = '403'
        if (!data?.episodes) type = '401'
        console.log(type)
        const selectElement = document.querySelector('select[name="type"]')
        selectElement.value = type
      }
    })
    .catch((error) => {
      // 处理请求错误
      console.error('请求失败：', error)
    })
}

function getCutoffTime(num) {
  // 获取当前时间
  const currentDate = new Date()

  // 向后推迟五天（5天 * 24小时 * 60分钟 * 60秒 * 1000毫秒）
  const delayedDate = new Date(
    currentDate.getTime() + num * 24 * 60 * 60 * 1000
  )

  // 输出推迟五天后的时间，精确到分钟
  const year = delayedDate.getFullYear()
  const month = String(delayedDate.getMonth() + 1).padStart(2, '0') // 月份从0开始，需要+1
  const day = String(delayedDate.getDate()).padStart(2, '0')
  const hours = String(delayedDate.getHours()).padStart(2, '0')
  const minutes = String(delayedDate.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}`
}

function normalSelectValue(eleName, title) {
  const element = document.querySelector(`select[name="${eleName}"]`)
  if (!element) return
  const options = element.options
  console.log(Array.from(options))
  // 分割 str1 为单词数组
  const words = title.replace(/-\w+$/, '').split(/[\s\[\]()]+/) // 使用空格、括号和其他符号作为分隔符
  console.log(words)
  const option = Array.from(options).filter(
    (item) =>
      !!words.filter(
        (word) => word && item.text.toLowerCase().includes(word.toLowerCase())
      ).length
  )
  if (option && option.length > 0) element.value = option[0].value
}

function filtersName(names, num) {
  if (names && names.length === 0) return ''
  return names
    .slice(0, num)
    .map((item) => item.name.split(' ')[0])
    .join(' ')
}

function showToast(message) {
  // 如果弹窗已经存在，先移除它，防止重复创建
  const existingModal = document.querySelector('.custom-alert-modal')
  if (existingModal) {
    existingModal.remove()
  }

  // 创建弹窗容器
  const modal = document.createElement('div')
  modal.className = 'custom-alert-modal'
  modal.style.position = 'fixed'
  modal.style.top = '50%'
  modal.style.left = '50%'
  modal.style.transform = 'translate(-50%, -50%)'
  modal.style.padding = '20px'
  modal.style.backgroundColor = '#fff'
  modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)'
  modal.style.zIndex = '9999'
  modal.style.textAlign = 'center'
  modal.style.borderRadius = '4px'

  // 弹窗内容
  const messageElement = document.createElement('p')
  messageElement.textContent = message
  modal.appendChild(messageElement)

  // 关闭按钮
  const closeButton = document.createElement('button')
  closeButton.textContent = '关闭'
  closeButton.style.marginTop = '4px'
  closeButton.onclick = () => document.body.removeChild(modal)
  modal.appendChild(closeButton)

  // 将弹窗添加到页面
  document.body.appendChild(modal)
}
