
// ==UserScript==
// @name         导出客户联系方式
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  清晖导出客户信息增强，导出客户的联系方式
// @author       gepik
// @match        https://www.fxiaoke.com/XV/UI/Home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fxiaoke.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464651/%E5%AF%BC%E5%87%BA%E5%AE%A2%E6%88%B7%E8%81%94%E7%B3%BB%E6%96%B9%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/464651/%E5%AF%BC%E5%87%BA%E5%AE%A2%E6%88%B7%E8%81%94%E7%B3%BB%E6%96%B9%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
  'use strict';
  function insertXlsxScript() {
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/xlsx/dist/xlsx.full.min.js';
    head.appendChild(script);
  }
  insertXlsxScript();
  const consumerExtFields=[
    'email',
    'phone',
    'UDSText7__c', // 微信
  ]

  function addConsumerExportBtn() {
    const neighborBtn = document.querySelector('.fn-right.bi-btn.btn-export');
    const existBtn = document.querySelector('#__export_consumer_btn__');
    if(neighborBtn && !existBtn) {
      const parent = neighborBtn.parentElement;
      const btn = document.createElement('button');
      btn.setAttribute("id",'__export_consumer_btn__')
      btn.classList.add('fn-right')
      btn.classList.add('bi-btn')
      btn.textContent = '导出客户联系信息'
      btn.onclick= startExport
      parent.appendChild(btn);
    }
  }
 
 
  function hackApi() {
    if(!FS.util) return;
    const originFHHApi = FS.util.FHHApi;
    FS.util.FHHApi= function(i,o) {
      function complete(e,t) {
        if(t==='success' && i.url.includes('loadQueryReportResult')) {
          const r = JSON.parse(e.responseText);
          const reqId = r.Value.reqId;
          if(reqId) {
            localStorage.setItem('reqId',reqId)
            addConsumerExportBtn();
          }
          
        }
        if(i.complete) {
          i.complete(e,t)
        }
       
      }
      return originFHHApi({...i,complete},o);
    }

  }
setTimeout(() => {
  hackApi()
}, 500);
/**
 * @method 获取客户列表
 * @returns Promise
 */
  function getList() {
    const body = {
        "reqId": localStorage.getItem('reqId'),
        "pageSize": 100,
        "pageNumber": 1
    }
    return fetch('https://www.fxiaoke.com/FHH/EM1HBIUDF/async/rptUdfViewDataController/loadQueryReportResult',{
      method: 'POST',
      body: JSON.stringify(body),
    }).then(res=>{
      return res.json()
    })
  }
/**
 * @method 获取客户详情
 * @returns Promise
 */
  function getConsumerDetail(objectDataId) {
    const body = {
      "layoutVersion": "V3",
      "objectDataId": objectDataId,
      "objectDescribeApiName": "LeadsObj",
      "fromRecycleBin": false,
      "management": false,
      "serializeEmpty": false,
      "describeVersionMap": {
        "LeadsObj": 1585
      }
    }
    return fetch('https://www.fxiaoke.com/FHH/EM1HNCRM/API/v1/object/LeadsObj/controller/WebDetail',{
      method: 'POST',
      body: JSON.stringify(body),
    }).then(res=>{
      return res.json()
    })
  }
  const fieldMap = [{key:'name',value:'姓名'},{key:'mobile',value:'手机'},{key:'email',value:'邮箱'}]
function startExport() {
  getList().then(res=>{
    const consumerList = res.Value.dataSet.map(it=>it.biz_leads_name$0);
    if(consumerList.length===0) return;
    const excelData = [
      fieldMap.map(it=>it.value)
  ];
    const promiseList = consumerList.map(it=>{
      const list = [];
      excelData.push(list)
      return getConsumerDetail(it.linkKeyValue).then(res=>{
        const obj = {}
        obj.name = it.value;
        obj.mobile = res.Value?.data?.mobile;
        obj.email = res.Value?.data?.email;
        fieldMap.forEach(it=>{
          list.push(obj[it.key])
        })
        return obj;
      })
    });
    Promise.all(promiseList).then(res=>{
      console.log('excleData',excelData);
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();//创建虚拟workbook
      /* 将工作表添加到工作簿,生成xlsx文件(book,sheet数据,sheet命名)*/
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, '客户联系信息.xlsx');
    })
  })
}
})();
