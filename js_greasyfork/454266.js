// ==UserScript==
// @name         好昵称-昵称抓取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  抓取【好昵称】网中的昵称数据。
// @author       buyi
// @match        http://haonicheng.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=haonicheng.com
// @grant        none
// @grant        GM_xmlhttpRequest
// 因为要把抓取到的昵称推送至服务器，所以需要发送ajax请求。最初使用GM_xmlhttpRequest函数，所以必须设置 @connect 标签。（但是后来发现GM_xmlhttpRequest函数只能在油猴沙箱使用，但是抓取数据代码需要在当前网页上下文中执行。所以换成了Axios）
// @connect      *
// @license      MIT
// @require      https://greasyfork.org/scripts/454265-axios/code/Axios.js?version=1113258
// @downloadURL https://update.greasyfork.org/scripts/454266/%E5%A5%BD%E6%98%B5%E7%A7%B0-%E6%98%B5%E7%A7%B0%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/454266/%E5%A5%BD%E6%98%B5%E7%A7%B0-%E6%98%B5%E7%A7%B0%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==



(function() {
  'use strict';
  
  // ajax请求url
  const pullDataUrl = 'http://localhost:10030/nickname/add';
  // ajax请求方法
  const pullDataMethod = 'post';
  // ajax请求数据字段，例如赋值为 nicknameList，那么请求body为：{"nicknameList":[]}
  const pullDataField = 'nicknameList';
  
  
  
  // Your code here...
  console.log("好昵称 昵称数据抓取已启动！配置参数：", {
    pullDataUrl,
    pullDataMethod,
    pullDataField,
  })
  
  
  var oldxhr=window.XMLHttpRequest
  function newobj(){}
  
  window.XMLHttpRequest=function(){
    let tagetobk=new newobj();
    tagetobk.oldxhr=new oldxhr();
    let handle={
      get: function(target, prop, receiver) {
        if(prop==='oldxhr'){
          return Reflect.get(target,prop);
        }
        if(typeof Reflect.get(target.oldxhr,prop)==='function')
        {
          if(Reflect.get(target.oldxhr,prop+'proxy')===undefined)
          {
            target.oldxhr[prop+'proxy']=(...funcargs)=> {
              let result=target.oldxhr[prop].call(target.oldxhr,...funcargs)
              console.log('函数劫持获取结果',result)
              return result;
            }
            
            
          }
          return Reflect.get(target.oldxhr,prop+'proxy')
        }
        if(prop.indexOf('response')!==-1)
        {
          console.log(target.oldxhr)
          if(target.oldxhr.responseURL.indexOf('nickname/nickname/randomNickname') !== -1){
            let responseDataStr = Reflect.get(target.oldxhr,prop)
            console.log('属性劫持结果',responseDataStr)
            let data = JSON.parse(responseDataStr).data
            console.log(axios)
            axios && axios({
              method: pullDataMethod,
              url: pullDataUrl,
              data: {
                [pullDataField]: data
              }
            })
          }
          return Reflect.get(target.oldxhr,prop)
        }
        return Reflect.get(target.oldxhr,prop);
      },
      set(target, prop, value) {
        return Reflect.set(target.oldxhr, prop, value);
      },
      has(target, key) {
        // debugger;
        return Reflect.has(target.oldxhr,key);
      }
    }
    
    let ret = new Proxy(tagetobk, handle);
    
    return ret;
  }
  
})();
