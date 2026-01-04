// ==UserScript==
// @name         feishuHelper
// @namespace    http://tampermonkey.net/
// @version      0.18
// @description  hack feishu
// @author       Amos
// @match        https://onetoken.feishu.cn/*
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/449157/feishuHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/449157/feishuHelper.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

function test(){
  getMyMinutes().then(minutes=>{
    let toRemove = minutes.filter(m=>{
      return Date.now()-m.create_time>24*30*3600*1000
    })
    removeMinute(toRemove).then(()=>{
      console.log('删除成功')
    })
  })
}

function removeMinute(items){
  return new Promise((resolve,reject)=>{
    let nowTs = Date.now()
    let tokens=items.map(i=>i.object_token)
    let data = new FormData()
    data.append('language', 'zh_cn')
    data.append('object_token', '')
    data.append('object_tokens', tokens.join(','))
    data.append('space_name', 1)
    // let data = {language:'zh_cn',object_token:'','object_tokens': tokens.join(','),'space_name': 1}
    jQuery.ajax({
      url: `https://onetoken.feishu.cn/minutes/api/space/remove?_t=${nowTs}`,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      contentType: 'application/x-www-form-urlencoded; charset=utf-8',
      dataType:'json',
      data:data,
      async: true,
      cache: false,
      timeout: 30000,
      success:  (res)=> {
          if(res.code===0){
            resolve()
          } else{
            reject()
          }
      },
      error: (request, status, error)=> {
          reject(error)
      },
      type: "POST"
  });
  })
}
function getMyMinutes(){
  return new Promise((resolve,reject)=>{
    jQuery.ajax({
      url: 'https://onetoken.feishu.cn/minutes/api/space/list',
      dataType: "json",
      data: {size:1000,space_name:1,rank:2,asc:false,owner_type:1,object_token:'',language:'zh_cn'},
      async: true,
      cache: false,
      timeout: 30000,
      success:  (res)=> {
          if(res.code===0){
            resolve(res.data.list)
          } else{
            reject()
          }
      },
      error: (request, status, error)=> {
          reject(error)
      },
      type: "GET"
  });
  })
  
}

(function() {
  'use strict';
  setTimeout(()=>{
    test()
  },10000)
  
})();