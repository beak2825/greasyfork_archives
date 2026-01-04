// ==UserScript==
// @name         校园认证助手
// @namespace    mrnianj@hotmail.com
// @version      0.3
// @description  兰州文理学院（Lanzhou University of Arts and Science）深澜认证助手
// @author       mrnianj
// @match        http://172.16.100.32/srun_portal_pc?ac_id=1&theme=basic
// @match        http://172.16.100.32/srun_portal_phone?ac_id=1&theme=basic
// @match        http://172.16.100.32/srun_portal_success?ac_id=1&theme=basic&srun_domain=
// @icon         https://tse1-mm.cn.bing.net/th/id/OIP-C._iGQZ2e0WM5O4u8UTc0IbwAAAA?w=141&h=146&c=7&r=0&o=5&dpr=1.25&pid=1.7
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436659/%E6%A0%A1%E5%9B%AD%E8%AE%A4%E8%AF%81%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/436659/%E6%A0%A1%E5%9B%AD%E8%AE%A4%E8%AF%81%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
  "use strict";
  let user = {
    username: "12185127030", // 学号
    password: "125262" //密码
  }
  let locationUrl = "https://cn.bing.com" //登录成功之后重定向页面

  if (location.href.indexOf("srun_portal_pc") > 0 || location.href.indexOf("srun_portal_phone") > 0) {
    document.querySelector("#username").value = user.username
    document.querySelector("#password").value = user.password
    document.querySelector("#login").click()
  }
  if (location.href.indexOf('srun_portal_success') > 0) {
    if(navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") != -1){
      window.location.href = "about:blank";
      window.close();
    }else{
        window.opener = null;
        window.open("", "_self");
        window.close();
    }
    window.location.replace(locationUrl);
  }
})();