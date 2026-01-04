// ==UserScript==
// @name         校园认证助手
// @namespace    mrnianj@hotmail.com
// @version      1.0
// @description  校园网认证自动填充
// @author       mrnianj
// @match        http://172.16.100.32/srun_portal_pc?ac_id=1&theme=basic
// @match        http://172.16.100.32/srun_portal_phone?ac_id=1&theme=basic
// @icon         https://tse1-mm.cn.bing.net/th/id/OIP-C._iGQZ2e0WM5O4u8UTc0IbwAAAA?w=141&h=146&c=7&r=0&o=5&dpr=1.25&pid=1.7
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444284/%E6%A0%A1%E5%9B%AD%E8%AE%A4%E8%AF%81%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/444284/%E6%A0%A1%E5%9B%AD%E8%AE%A4%E8%AF%81%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
  "use strict";
  // cookie 过期时间(天)
  let maxAge = 30;

  // 获取 Dom节点
  const getNode = (className) => {
      return document.querySelector(className)
  }
  // 更新cookie
  const setCookie = (name,pwd,isFirst) => {
    document.cookie = `name=${name}; max-age=${maxAge*24*60*60}`
    document.cookie = `pwd=${pwd}; max-age=${maxAge*24*60*60}`
    document.cookie = `isFirst=${isFirst}; max-age=${maxAge*24*60*60}`
  }
  // 获取 cookie
  const getCookie = () => {
    let cookieObj = {}
    document.cookie.split(';').map((item) => {
      let Objkey,Objvalue = ''
      let objItem = {}
      item.split("=").map((value,index) => {
        index==0 ? Objkey = value.trim() : Objvalue = value.trim()
      })
      objItem[Objkey] = Objvalue
      cookieObj = {...cookieObj,...objItem }
    })
    return cookieObj
  }

  let { name,pwd,isFirst } = getCookie()

  if( isFirst ) {
    getNode("#username").value = name
    getNode("#password").value = pwd
    getNode("#login").click()
  }else {
    alert('第一次使用需要手动登录，登录信息默认保存30天')
    // 监测点击事件
    getNode('#login').addEventListener("click", function(){
      setCookie(getNode("#username").value, getNode("#password").value, 1)
    });
  }
})();