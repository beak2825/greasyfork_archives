// ==UserScript==
// @name         zentao_testengineer
// @namespace    http://www.akuvox.com/
// @version      1.36
// @description  take on the world!
// @author       andy.wang
// @icon         https://www.google.com/s2/favicons?sz=64&domain=10.17
// @match        http://192.168.10.17/zentao/testcase-view*.html*
// @match        http://zentao.akuvox.local/zentao/testcase-view-*.html*
// @match        http://192.168.10.17/zentao/testcase-create*.html*
// @match        http://zentao.akuvox.local/zentao/testcase-create-*.html*
// @match        http://192.168.10.17/zentao/bug-create-*.html*
// @match        http://zentao.akuvox.local/zentao/bug-create-*.html*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/504385/zentao_testengineer.user.js
// @updateURL https://update.greasyfork.org/scripts/504385/zentao_testengineer.meta.js
// ==/UserScript==

/**
 * 获取页面信息
 */
var caseId, title
const mainArray = [
  { type: '音频', text: 'codec:xxx,是否提供抓包文件:xxx'},
  { type: '视频', text: '分辨率:xxx,码率:xxx,帧率:xxx,是否提供抓包文件:xxx'},
  { type: '网络', text: '有线:xxx,2.4G-WIFI:xxx,5G-wifi:xxx'},
  { type: '蓝牙', text: '型号:xxx'},
]

const getSendData = () => {
  const headDom = document.getElementsByClassName('heading')[0]
  caseId = headDom.getElementsByTagName('strong')[0].textContent
  title = headDom.getElementsByTagName('strong')[1].textContent
}
// 获取bug数据
const getDetail = async (id = caseId) => {
  return new Promise(async (resolve) => {
    const result = await fetch(`http://192.168.10.51:51081/api/zentao/selectzentaoLabelId`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: id })
    })

    try {
      let res = await result.json()
      resolve(res)
    } catch (e) {
      resolve('')
    }
  })
}
/**
 * 创建用例选项
 */
async function createCaseSelect() {
  const container = document.getElementsByClassName('main-side')[0]
  const getAllResult = async (
    url = `http://192.168.10.51:51081/api/zentao/selectAllzentaoLabel`
  ) => {
    return new Promise(async (resolve) => {
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      try {
        let res = await result.json()
        resolve(res)
      } catch (e) {
        resolve('')
      }
    })
  }
  const result = await getAllResult()
  const newResult = result.result
  let optionHtml = ''
  newResult.forEach((v, i) => {
    optionHtml =
      optionHtml +
      `<div style="padding: 3px;"><input class="ceshi-option-type" type="checkbox" value="${v.id}" name="akcheck">${v.type}</div>`
  })
  const div2 = document.createElement('div')
  div2.style = 'border:1px solid #ccc;padding:10px;width: 340px;margin-top: 10px;'
  div2.innerHTML = `
    <div style="text-align: right;color: #036;"><span class="ak-new-scoreButton-ceshi" style="cursor: pointer;">提交</span></div>
    <div>
    关联用例类型:
        <div style="display: flex;flex-wrap: wrap;width: 318px;"> 
            ${optionHtml}
        </div>
    </div>
     `
  container.appendChild(div2)
  const selectDom = document.querySelectorAll('.ceshi-option-type')
  const noUnresolevButton = document.querySelector('.ak-new-scoreButton-ceshi')
  noUnresolevButton.addEventListener('click', function (e) {
    // 获取下拉框的值
    let labelids = ''
    selectDom.forEach((v) => {
      if (v.checked) {
        labelids = labelids + v.value + ','
      }
    })
    fetch(`http://192.168.10.51:51081/api/zentao/saveZentaoLableData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        labelids: labelids,
        title: title,
        id: caseId
      })
    })
    alert('提交成功')
  })
  const { result: detailResult } = await getDetail()
  if (detailResult?.length) {
    //首先获得下拉框的节点对象；
    const nowObj = detailResult[0]
    selectDom.forEach((v) => {
      if (nowObj.labelids.includes(v.value)) {
        v.checked = true
      }
    })
  }
}

async function getCreateData() {
  let number, createTitle, labelids
  const GroupInput = document.getElementsByClassName('input-group-required')
  // 获取标题
  createTitle = GroupInput[0].getElementsByTagName('input')[0].value
  let url = location.href
  let parts = url.split('-testcase-') // 假设'-testcase-'是分隔符
  if (parts.length > 1) {
    number = parts[1].split('.')[0] // 移除'.html'部分
  }
  const { result: detailResult } = await getDetail(number)
  if (detailResult?.length) {
    const nowObj = detailResult[0]
    if (nowObj.labelids) {
      labelids = nowObj.labelids
    }
  }

  if (labelids) {
    const submitDom = document.getElementsByClassName('btn-primary')[0]
    submitDom.addEventListener('click', async function () {
      const newGroupInput = document.getElementsByClassName('input-group-required')
      // 获取标题
      const newCreateTitle = newGroupInput[0].getElementsByTagName('input')[0].value
      const getZentaoCase = async () => {
        return new Promise(async (resolve) => {
          const result = await fetch(`http://192.168.10.51:51081/api/zentao/selectztCase`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: newCreateTitle })
          })

          try {
            let res = await result.json()
            resolve(res)
          } catch (e) {
            resolve('')
          }
        })
      }
      setTimeout(async () => {
        const result = await getZentaoCase()
        const obj = result?.result[0]
        if (obj) {
          fetch(`http://192.168.10.51:51081/api/zentao/saveZentaoLableData`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              labelids: labelids,
              title: newCreateTitle,
              id: obj.id
            })
          })
        }
      }, 2000)
    })
  }
}

/**
 * BUG创建触发关键字的时候备注返回
 */
async function getBugCreateData() {
  const titleDom = document.getElementById('title')  
  titleDom.addEventListener('blur', function() {
    const inputValue = titleDom.value
    
    mainArray.forEach(v => {
      // 满足关键字补充
      if(inputValue.includes(v.type)) {  
        let submitDom =  document.getElementById('submit') 
        const inputDom =  document.getElementsByClassName('ke-edit-iframe')[1].contentDocument.getElementsByClassName('article-content')[0]
        const stringDom = `<p><strong>${v.text}</strong></p>`
        inputDom.insertAdjacentHTML('beforeend', stringDom);
        console.log(inputDom)  
        submitDom.addEventListener("click", (event) => { 
            if(inputDom.innerHTML.includes(v.text)) { 
              alert('需要补充复现步骤的信息') 
              event.preventDefault();
            } 
        })
      }
    })
  });
}

;(function () {
  'use strict'
  if (window.location.href.includes('testcase-view-')) {
    getSendData()
    createCaseSelect()
  }
  if (window.location.href.includes('testcase-create-')) {
    getCreateData()
  }
  if (window.location.href.includes('bug-create-')) {
    getBugCreateData()
  }
})()
