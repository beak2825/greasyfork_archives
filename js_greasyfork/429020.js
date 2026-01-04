// ==UserScript==
// @name         填充医保局
// @namespace    Dawnnnnnn
// @version      0.1
// @description  填充医保局用户名密码
// @author       Dawnnnnnn
// @match        http://111.63.208.5/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/429020/%E5%A1%AB%E5%85%85%E5%8C%BB%E4%BF%9D%E5%B1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/429020/%E5%A1%AB%E5%85%85%E5%8C%BB%E4%BF%9D%E5%B1%80.meta.js
// ==/UserScript==

(function() {

  function insert_data(){
      console.log(document.querySelectorAll('.login-input .el-input__inner'))
      if (document.querySelectorAll('.login-input .el-input__inner').length > 0)
      {

          document.querySelectorAll('.login-input .el-input__inner')[0].value = "18532552773"
          document.querySelectorAll('.login-input .el-input__inner')[1].value = "a12345678"
          document.querySelectorAll('.login-input .el-input__inner')[0].dispatchEvent(new Event("input"))
          document.querySelectorAll('.login-input .el-input__inner')[1].dispatchEvent(new Event("input"))
          return
      }
      else {
          setTimeout(function() { insert_data(); }, 3000);
      }
  }

  setTimeout(function() { insert_data(); }, 100);
})();