// ==UserScript==
// @name         跨域获取图片地址的blob
// @version      1.0.2
// @description  通过发送消息的方式提供图片url转blob的方法
// @author       wilder
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/1211834
// @downloadURL https://update.greasyfork.org/scripts/479155/%E8%B7%A8%E5%9F%9F%E8%8E%B7%E5%8F%96%E5%9B%BE%E7%89%87%E5%9C%B0%E5%9D%80%E7%9A%84blob.user.js
// @updateURL https://update.greasyfork.org/scripts/479155/%E8%B7%A8%E5%9F%9F%E8%8E%B7%E5%8F%96%E5%9B%BE%E7%89%87%E5%9C%B0%E5%9D%80%E7%9A%84blob.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('message',(e)=>{
        if(e.data && e.data.type === 'getImageBlob'){
            console.log('准备解析',e.data)
           getImageBlob(e.data.url).then(blob=>{
               console.log('是不是blob',blob)
               window.postMessage({
                  blob: blob,
                  type: e.data.type + '_result'
               },'*')
           })
        }
    })
})();

function getImageBlob(url){
    return new Promise((resolve,reject)=>{
        GM_xmlhttpRequest({
            method:'get',
            url:url,
            responseType:'blob',
            onload(res){
               resolve(res.response)
            }
        })
    })
}

function getImageBase64(blob) {

  return new Promise((resolve,reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      const base64 = reader.result;
      resolve(base64);
    }
    reader.onerror = error => reject(error);
  });
}

