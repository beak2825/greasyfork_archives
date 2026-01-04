// ==UserScript==
// @name         V2EX-Comments-Summarizer
// @namespace    https://github.com/banbri
// @version      1.2
// @description  V2EX 评论区总结
// @author       Banbri
// @match        https://*.v2ex.com/t/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @license      GPL-2.0-only
// @resource     iconLib https://at.alicdn.com/t/c/font_3236038_ha9rkafjvq.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/470602/V2EX-Comments-Summarizer.user.js
// @updateURL https://update.greasyfork.org/scripts/470602/V2EX-Comments-Summarizer.meta.js
// ==/UserScript==

GM_addStyle(GM_getResourceText('iconLib'))

const rightbar = document.getElementById('Rightbar')

const box = document.createElement('div')
box.className = 'box'
box.style.minHeight = '200px'
box.style.padding = '10px'
box.style.overflowX = 'hidden'
rightbar.appendChild(box)

// 创建一个 div，用于存放标题
const commentHeader = document.createElement('div')
commentHeader.style.display = 'flex'
commentHeader.style.justifyContent = 'space-between'

// 向 box 中添加一个 title 为 '评论区总结'，并且添加样式
const title = document.createElement('div')
title.innerText = '评论区总结：'
title.style.textAlign = 'left'
title.style.fontWeight = 'bold'
commentHeader.appendChild(title)

// 向 box 中添加一个icon，icon-bx-donate-heart
const icon = document.createElement('i')
icon.className = 'iconfont icon-bx-donate-heart'
icon.style.fontSize = '20px'
icon.style.color = '#E24242'
icon.style.cursor = 'pointer'
commentHeader.appendChild(icon)
box.appendChild(commentHeader)

// 再新建一个 div，用于存放评论区总结的内容
const contentDiv = document.createElement('div')
contentDiv.className = 'reply_content'
contentDiv.style.textAlign = 'left'
box.appendChild(contentDiv)

// 创建一个 dialog，用于展示支付宝和微信收款码
const dialog = document.createElement('dialog')
dialog.style.width = '600px'
dialog.style.height = '400px'
dialog.style.borderRadius = '10px'
dialog.style.boxShadow = '0 0 10px #ccc'
dialog.style.padding = '10px'
dialog.style.textAlign = 'center'
dialog.style.position = 'fixed'
dialog.style.top = '50%'
dialog.style.left = '50%'
dialog.style.transform = 'translate(-50%, -50%)'
dialog.style.zIndex = '9999'
dialog.style.background = '#fff'
dialog.style.display = 'none'
document.body.appendChild(dialog)

// 创建一个 img，用于展示支付宝收款码
const alipay = document.createElement('img')
alipay.src = 'http://lskypro.banbri.cn/i/2023/07/11/64ad66414792a.jpg'
alipay.style.width = '500px'
alipay.style.height = '295px'
dialog.appendChild(alipay)

// 创建一个 div，用于存放支付宝和微信收款码的文字说明
const text = document.createElement('div')
text.innerText = '如果觉得有帮助，可以请我喝杯咖啡。'
text.style.marginTop = '20px'
dialog.appendChild(text)

// dialog 右上角添加一个关闭按钮
const closeBtn = document.createElement('button')
closeBtn.innerText = '关闭'
closeBtn.style.marginTop = '20px'
closeBtn.style.padding = '5px 10px'
closeBtn.style.borderRadius = '5px'
closeBtn.style.border = 'none'
closeBtn.style.background = '#E24242'
closeBtn.style.color = '#fff'
closeBtn.style.cursor = 'pointer'
dialog.appendChild(closeBtn)

// 点击关闭按钮，关闭 dialog
closeBtn.onclick = () => {
  dialog.style.display = 'none'
}

// 点击 icon，展示 dialog
icon.onclick = () => {
  dialog.style.display = 'block'
}

// 获取到所有的评论
const comments = document.querySelectorAll('.reply_content')
let contentText = ''
for (let i = 0; i < comments.length; i++) {
  contentText += comments[i].innerText
}

// 如果评论内容低于 200 个字符，就不进行总结
if (contentText.length < 200) {
  contentDiv.innerText = '评论内容太少，不进行总结。'
} else {
  if (contentText.length > 2000) {
    contentText = contentText.substring(0, 2000)
  }
  getSummary()
}

async function getSummary() {
  const param = {
    model: 'gpt-3.5-turbo',
    temperature: 1,
    top_p: 0.9,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: '',
    messages: [
      { role: 'assistant', content: contentText },
      {
        role: 'user',
        content: '这是一个帖子的评论区，请总结一下，仅回复总结内容。',
      },
    ],
    stream: true,
  }
  const response = await fetch('https://thread-sum.com/v1/chat/completions', {
    method: 'POST',
    body: JSON.stringify(param),
  })
  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  contentText.innerText = ''
  let text = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    const chunk = decoder.decode(value, { stream: true })
    const dataStrList = chunk.split('\n\n')
    dataStrList.forEach((dataStr) => {
      const dataJson = dataStr.replace(/^data:/, '').trim()
      try {
        const data = JSON.parse(dataJson)
        const content = data?.choices[0]?.delta?.content
        if (!content) return
        text += content
        contentDiv.innerText = text
      } catch (e) {}
    })
  }
}
