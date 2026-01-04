// ==UserScript==
// @name         禅道日志
// @namespace    chandao-wangguofeng
// @version      0.3
// @description  chandao!
// @author       WangGuoFeng
// @match        http://*/zentao/my-dynamic*.html
// @match        https://*/zentao/my-dynamic*.html
// @icon         <$ICON$>
// @grant        none
// @license      MIT
// @require      https://unpkg.com/axios@0.24.0/dist/axios.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.8/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/436644/%E7%A6%85%E9%81%93%E6%97%A5%E5%BF%97.user.js
// @updateURL https://update.greasyfork.org/scripts/436644/%E7%A6%85%E9%81%93%E6%97%A5%E5%BF%97.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  let results = []
  const deleteR = []
  const mapType = {
    task: '任务'
  }
  const url = location.href.replace('.html', '.json')
  axios({
    url
  }).then((res) => {
    const { actions } = JSON.parse(res.data.data)
    const actionLabel = ['解决了', '完成了', '创建', '记录了工时']
    actions.forEach((item) => {
      if (actionLabel.includes(item.actionLabel)) {
        results.push(item)
      }
      if (item.actionLabel === '删除了') {
        deleteR.push(item.objectID)
      }
    })
    results = results.filter((result) => !deleteR.includes(result.objectID))
    const r = []
    results.forEach((result, index) => {
      const hour = result.extra.match(/\d+/) ? `(${result.extra}工时)` : ''
      const dayLog = `${index + 1}. ${result.actionLabel} ${
        mapType[result.objectType] || result.objectType
      }: ${result.objectName} ${hour}`
      r.push(dayLog)
    })
    const btn = document.createElement('button')
    btn.style.position = 'absolute'
    btn.style.right = 0
    btn.style.top = '50%'
    btn.innerHTML = '点我复制'
    const clipboard = new ClipboardJS(btn, {
      text: () => r.join('\r\n')
    })
    clipboard.on('success', () => {
      alert('复制成功')
    })
    document.body.appendChild(btn)
  })
})()
