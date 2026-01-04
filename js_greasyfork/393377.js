// ==UserScript==
// @name         DOC同步
// @namespace    lishuihua
// @version      0.3
// @description  使用html同步DOC
// @author       lishuihua
// @match        https://bytedance.feishu.cn/docs/doccnURW8SlcvLmfm98iozfbRFd
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393377/DOC%E5%90%8C%E6%AD%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/393377/DOC%E5%90%8C%E6%AD%A5.meta.js
// ==/UserScript==

(function() {
  'use strict';

let isExited = false

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

function once(fn) {
  let isFirst = true
  return (...args) => {
    if (isFirst) fn(...args)
    isFirst = false
  }
}

const printTip = once(docId => {
  console.log(
`
%c DOC同步：用下面这段代码上传html
%c
;(async () => console.log(await (await fetch(
'https://cloudapi.bytedance.net/faas/services/ttql9br31b7dunq3qm/invoke/submitHTML',
{
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    docId: '${docId}',
    html: \`<div>DOC同步测试</div><div>测试时间：\${Date()}</div>\`,
    confirm: false,
  }),
},
)).json()))()
`,
'font-size:18px;color:red',
'font-size:14px;color:black',
  )
})

async function checkDocUpdate() {
  const el = document.getElementById('innerdocbody')
  const docId = window.location.pathname.split('/')[2]
  if (!el || !docId) return
  printTip(docId)
  const { code, data } = await (await fetch(
    'https://cloudapi.bytedance.net/faas/services/ttql9br31b7dunq3qm/invoke/getHTML',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        docId,
        md5: getMd5(el),
      }),
    },
  )).json()
  if (code || !data) return
  const { item } = data
  if (!item) return
  const { md5, html } = item
  console.log('取得新版本', { md5, html })
  if (item.confirm && !window.confirm('取得新的HTML版本，是否同步？')) {
    isExited = true
    return
  }
  paste(html + `<br/><br/><div>[doc md5][${md5}]</div>`, el)
  await sleep(5000)
}

function getMd5(el) {
  const line = (el.innerText.match(/\[doc md5\]\[.*\]/g) || [])[0]
  if (!line) return ''
  return line.split(/[\[\]]/)[3]
}

function paste(html, el) {
  const keyboardEv = new KeyboardEvent('keydown', { key: 'a', keyCode: 65, char: 65,  metaKey: true })
  el.dispatchEvent(keyboardEv);
  const clipboardEv = new ClipboardEvent('paste', { clipboardData: new DataTransfer() });
  clipboardEv.clipboardData.setData('text/html', html);
  el.dispatchEvent(clipboardEv);
}

;(async () => {
while (!isExited) {
  await sleep(5000)
  try {
    await checkDocUpdate()
  } catch (e) {
    console.error('checkDocUpdate error', e)
  }
}
})()

})();