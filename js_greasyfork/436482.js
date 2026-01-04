// ==UserScript==
// @name         填充人社局
// @namespace    Dawnnnnnn
// @version      0.2
// @license MIT
// @description  填充人社局23333
// @author       Dawnnnnnn
// @match        *://rsj.tangshan.gov.cn/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/436482/%E5%A1%AB%E5%85%85%E4%BA%BA%E7%A4%BE%E5%B1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/436482/%E5%A1%AB%E5%85%85%E4%BA%BA%E7%A4%BE%E5%B1%80.meta.js
// ==/UserScript==

(function() {

  function insert_data(){
      console.log(document.querySelectorAll('.login-input .el-input__inner'))
      if (document.querySelectorAll('.el-input .el-input__inner').length > 0)
      {
          document.querySelectorAll('.el-input .el-input__inner')[2].value = "1302"
          document.querySelectorAll('.el-input .el-input__inner')[3].value = "姚凌宇"
          document.querySelectorAll('.el-input .el-input__inner')[4].value = "130203199709040027"
          document.querySelectorAll('.el-input .el-input__inner')[6].value = "Aa12345678"
          document.querySelectorAll('.el-input .el-input__inner')[7].value = "Aa12345678"
          document.querySelectorAll('.el-input .el-input__inner')[8].value = "18532552773"
          document.querySelectorAll('.el-input .el-input__inner')[2].dispatchEvent(new Event("input"))
          document.querySelectorAll('.el-input .el-input__inner')[3].dispatchEvent(new Event("input"))
          document.querySelectorAll('.el-input .el-input__inner')[4].dispatchEvent(new Event("input"))
          document.querySelectorAll('.el-input .el-input__inner')[6].dispatchEvent(new Event("input"))
          document.querySelectorAll('.el-input .el-input__inner')[7].dispatchEvent(new Event("input"))
          document.querySelectorAll('.el-input .el-input__inner')[8].dispatchEvent(new Event("input"))
          return
      }
      else {
          setTimeout(function() { insert_data(); }, 3000);
      }
  }

  setTimeout(function() { insert_data(); }, 100);
})();