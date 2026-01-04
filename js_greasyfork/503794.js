// ==UserScript==
// @name         喵达投诉单同步
// @namespace    http://tampermonkey.net/
// @description	 喵达投诉单同步信息
// @grant        GM_cookie
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @version      0.26
// @description  try to take over the world!
// @author       wcj
// @match        https://miaoda.sina.com.cn/index/index
// @match        https://miaoda.sina.com.cn/comp/index
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://code.jquery.com/jquery-2.0.0.min.js
// @run-at       document-end
// @grant        unsafeWindow
// @license    	 MIT
// @downloadURL https://update.greasyfork.org/scripts/503794/%E5%96%B5%E8%BE%BE%E6%8A%95%E8%AF%89%E5%8D%95%E5%90%8C%E6%AD%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/503794/%E5%96%B5%E8%BE%BE%E6%8A%95%E8%AF%89%E5%8D%95%E5%90%8C%E6%AD%A5.meta.js
// ==/UserScript==

var company = "橡树黑卡"
async function fetchList() {
  // 查询30天内的投诉信息
  let end = Date.now();
  let start = end - 30 * 24 * 60 * 60 * 1000;
  let list = []
  async function getData(page = 1) {
    let pageSize = 50
    let res = await fetch(location.origin + `/api/comp/query?sn=&gsn=&title=&content=&status=&coappeal_st=&exp=&ct_s=&ct_e=&assign_st=${start / 1000}&assign_et=${end / 1000}&has_supp=&danger=&page=${page}&page_size=${pageSize}&reply_type=&not_exp=&cocomplete_status=&sync_wb=&user=&issue=&complete_st=&complete_et=&supp_st=&supp_et=`)
    let { result } = await res.json()
    list.push(...result.data.list)
    if (page < result.data.pager.page_amount) {
      page++
      await getData(page)
    }
  }
  await getData()
  const cocomplete_st_enum = ["未发起结案", "结案中", "用户拒绝结案", "用户同意结案", "平台自动结案"]
  return list.map(item => {
    const obj = {
      "slug": item.sn,
      "note_created_at": item.create_time,
      "t_distribution": item.assign_time,
      "content": item.content,
      "question_content": item.title + '\n' + item.issue + '\n' + item.content,
      "category": "黑猫-" + company,
      "phone_number": item.phone?.length > 0 ? item.phone[0] : "",
    }
    if (cocomplete_st_enum[item.cocomplete_st] === '结案中') {
      obj.note_status = cocomplete_st_enum[item.cocomplete_st]
    }
    if (item.status === "已完成") {
      obj.note_status = item.status
    }
    return obj
  })
}

const promiseSuccesspromiseSuccess = (item) => {
  return new Promise((resolve, reject) => {
    try {

    } finally {
      resolve()
    }
  })
}


async function computeSHA256(message) {
  // 将字符串转换为 ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  // 计算 SHA-256 哈希值
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // 将 ArrayBuffer 转换为十六进制字符串
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function start() {
  const MIAODA_UPLOAD_LAST_TIME = Number(localStorage.getItem('MIAODA_UPLOAD_LAST_TIME') || 0);
  if (Date.now() - MIAODA_UPLOAD_LAST_TIME < 5 * 60 * 1000) {
    return
  }
  const res = await fetchList();
  const timestamp = Math.round(Date.now() / 1000)
  const sign = await computeSHA256(timestamp + 'cc94dedd3982495b80c76089e03b13c7')

  await fetch('https://new-admin.oakvip.cn/api/project/customer_service/batch_create_feedback', {
    headers: {
      "content-type": "application/json"
    },
    method: 'POST',
    body: JSON.stringify({
      data: res,
      timestamp,
      sign,
    })
  })
  localStorage.setItem('MIAODA_UPLOAD_LAST_TIME', Date.now())
  showAutoNotification('喵达同步成功', "成功同步" + res.length + "条投诉单")
}

function showAutoNotification(title, msg) {
  if ("Notification" in window) {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        var notification = new Notification(title, {
          body: msg,
        });
        setTimeout(function () {
          notification.close();
        }, 2000);
      }
    });
  }
}

// 获取当前账号的公司名称
async function getCompany() {
  const res = await fetch(location.origin + '/setting/index')
  const text = await res.text()
  const doc = new DOMParser().parseFromString(text, 'text/html');
  company = doc.querySelector('.uname .s1').innerHTML
  if (company === '深圳市高光时刻网络科技有限公司') {
    company = "高光时刻"
  }
  console.log(company)
}

(function () {
  'use strict'
  getCompany()
  setTimeout(start, 10000)
  // 30分钟执行一次
  setInterval(start, 1800 * 1000)
})();