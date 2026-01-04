// ==UserScript==
// @name         自动登陆ERP
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  ERP自动登陆
// @author       CListery
// @match        *://erp.dnmp.com/login.html
// @match        *://test.e.fangstar.net/login.html
// @match        *://erp.dnmp.nrp.fangstar.com/login.html
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476148/%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86ERP.user.js
// @updateURL https://update.greasyfork.org/scripts/476148/%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86ERP.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const server = window.location.origin

  console.log('开始登录...')
  // 用Ext在页面中显示loadding
  var loadding = document.createElement('div')
  loadding.style = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,.5); z-index: 999999;'
  loadding.innerHTML = '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #fff;">正在登录...</div>'
  document.body.appendChild(loadding)

  var user = '15696861956'
  var pwd
  if(location.host.startsWith('test')){
      // test
      pwd = 'abc123'
  }else if(location.host.startsWith('e.fangstar.net')){
      // pord
  }else{
      pwd = 'admin'
  }
  // 用 XMLHttpRequest 重新发送上面的请求
  var xhr = new XMLHttpRequest();
  xhr.open("POST", `${server}/v2/pc/auth/login-by-pwd?user_name=${user}&pwd=${pwd}`, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded, charset=UTF-8");
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var data = JSON.parse(xhr.responseText);

      if(data && data.result === 1){
        window.location.href = `${server}/index.html`
      }

    }
  };
  xhr.send();

})()
