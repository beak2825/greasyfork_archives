// ==UserScript==
// @name         轮询检测
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.3
// @description  try to take over the world!And
// @author       You
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @match        http://discover.sm.cn/2/
// @grant window.onurlchange
// @grant        GM_addStyle
// @grant GM_notification
// @grant unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448746/%E8%BD%AE%E8%AF%A2%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/448746/%E8%BD%AE%E8%AF%A2%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function () {

  var curUrl = window.location.href
  if (window.onurlchange === null) {
    window.addEventListener('urlchange', info => curUrl = info.url)
  }
  var task = 'query_ac_eps_re'   // 任务链接标识 只有url中包含此字段才会刷新
  var time = 3000
  var cnt = GM_getValue('cnt') ? parseInt(GM_getValue('cnt')) : 0
  var mode = GM_getValue('mode') || '0'
  var interval = null
  var taskList = []

  setTimeout(() => {
    if (mode === '0' && window.location.href.includes(task)) {
      setTimeout(() => window.location.reload(), time)
    } else if (mode === '1') {
      getTaskUrl() && getInfo()
    }

    GM_addStyle(`#refresh-script{position: fixed;top: 10px;left: 10px;width: 50px;height: 50px;border-radius: 50px;line-height: 50px;background-color: rgb(190, 190, 190);text-align: center;opacity: .3;font-size: 20px;cursor: pointer;z-index:9999}`)
    $(`<div class="active" id="refresh-script"><span class="refresh-text">${mode === '0' ? '刷' : cnt}</span></div>`).appendTo($('body'))
    $('#refresh-script').on('click', function () {
      if (interval) clearInterval(interval)
      mode = mode === '0' ? '1' : '0'
      GM_setValue('mode', mode)
      setHtml(mode === '0' ? '刷' : cnt)
      if (mode === '0' && window.location.href.includes(task)) {
        setTimeout(() => window.location.reload(), time)
      } else if (mode === '1') {
        getTaskUrl() && getInfo()
      }
    })
  }, 2000)

  function getTaskUrl () {
    if (curUrl.split('#')[1].length > 2) {
      alert('前往首页才可启用后台发送请求功能')
      return false
    }
    if (interval) clearInterval(interval)
    document.querySelector('#root > div > section > main > div > div > div > div.ant-tabs-bar.ant-tabs-top-bar > div > div > div > div > div:nth-child(1) > div:nth-child(2)').click()
    let list = document.querySelectorAll('.ant-table-wrapper .ant-table-tbody')[1]
    for (let ele of list.children) {
      if (ele.textContent.includes('0%')) {
        taskList.push(ele.querySelector('a').href.substr(-8, 6))
      }
    }
    return true
  }

  function getInfo () {
    let base_url = 'http://discover.sm.cn/2/api/task/get_question_info?question_index=0&task_type=query_ac_eps_re&task_id='

    taskList.map(url => {
      fetch(base_url + url)
        .then(res => res.json())
        .then(data => {
          if (!data.status) {
            GM_setValue('cnt', ++cnt)
            setHtml(cnt)
            if (interval === null) {
              interval = setInterval(getInfo, time)
            }
          } else {
            if (interval) {
              clearInterval(interval)
            }
            GM_notification('测试结果：true，请查看具体信息', '脚本通知')
          }
        })
        .catch(err => {
          console.log(err)
          GM_notification('请求发生错误:' + err, '脚本通知')
        })
    })
  }

  function setHtml (data) {
    $('.refresh-text').text(data)
  }

  // Your code here...
})()
