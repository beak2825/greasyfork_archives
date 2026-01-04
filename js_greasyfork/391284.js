// ==UserScript==
// @name         高新信建演示Demo
// @namespace    https://wfgxic.com/
// @version      0.0.5
// @description  演示Demo
// @author       潍坊高新信建
// @include      *
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/391284/%E9%AB%98%E6%96%B0%E4%BF%A1%E5%BB%BA%E6%BC%94%E7%A4%BADemo.user.js
// @updateURL https://update.greasyfork.org/scripts/391284/%E9%AB%98%E6%96%B0%E4%BF%A1%E5%BB%BA%E6%BC%94%E7%A4%BADemo.meta.js
// ==/UserScript==

(function() {
  'use strict';

  console.warn("------------ 开始监听 ------------");
  alert('高新信建插件已启动')

  var _regs = {
    'sfz': /^[1-9]\d{16}[a-zA-Z0-9]{1}$/,
    'tyshxydm' : /(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/,
    'address1': /^.+(省|市|区|县|里|镇|乡|村).+(路|街|巷).+(号|苑|园|城|社区|小区|宿舍|花园|里|广场).+(栋|座|单元|号楼|室|层).+[0-9].*$/,
    'address2': /^.+(省|市|区|县|里|镇|乡|村).+(路|街|巷|以南|以东|以西|以北).+(号|苑|园|城|社区|小区|宿舍|花园|里|广场).+(栋|座|单元|号楼|室|层).+[0-9].*$/,
    'address3': /^.+(省|市|区|县|里|镇|乡|村|区|苑|园|城|社区|小区|宿舍|花园|里|广场|路|街|交叉口|交汇处|以南|以东|以西|以北).+[0-9].*$/,
    'address4':  /^.+(省|市|区|县|里|镇|乡|村|区|苑|园|城|社区|小区|宿舍|花园|里|广场|路|街|交叉口|交汇处).*$/
  }

  var _prefix = ''

  var _inputs = Array.from(document.querySelectorAll('input'))
  _inputs.forEach(function (input) {

    // input.addEventListener('focus', function (event) {
      // console.log('[focus]', input.value)
      // checkInputValue(input)
    // }, false)

    // input.addEventListener('blur', function (event) {
      // console.log('[blur]', input.value)
      // checkInputValue(input)
    // }, false)

    input.addEventListener('input', function () {
      console.log('[input]', input.value);
      checkInputValue(input)
    }, false);

    input.addEventListener('change', function () {
      console.log('[change]', input.value);
      checkInputValue(input)
    }, false);

  })


  function checkInputValue(input) {
    if (input.type === 'hidden') {
      return
    }

    if (_regs.sfz.test(input.value)) {
      _prefix = '检测到异常身份证：'
      return queryCreditInfo(input.value)
    }

    if (_regs.tyshxydm.test(input.value)) {
      _prefix = '检测到异常统一社会信用代码：'
      return queryCreditInfo(input.value)
    }

    if (_regs.address1.test(input.value) || _regs.address2.test(input.value) || _regs.address3.test(input.value) || _regs.address4.test(input.value)) {
      _prefix = '将地址转化为标准地址：'
      return queryAddress(input.value)
    }

  }


  function queryCreditInfo (value) {
    console.warn(_prefix, value);
    GM_xmlhttpRequest({
      method: "get",
      url: 'https://dev6.wfgxic.com/api/credit?id='+ value,
      onload: function(res) {
        if (res.status == 200 && res.responseText) {
          var responseJson = JSON.parse(res.responseText);
          console.log(responseJson)
          if (responseJson.code === "0") {
            alert(_prefix + responseJson.idCardNo + responseJson.allLog)
          }
        }
      }
    })
  }

  function queryAddress (value) {
    console.warn(_prefix, value);
    GM_xmlhttpRequest({
      method: "get",
      url: 'http://116.62.207.13/admin/interface/standardaddress/' + value,
      headers: {
        "Accept": "application/json"
      },
      onload: function(res) {
        console.warn(res)
        if (res.status == 200 && res.responseText) {
          var responseJson = JSON.parse(res.responseText);
          console.log(responseJson)
          if (responseJson.code === 200) {
            alert(_prefix + responseJson.result.address + ' 坐标 [' + responseJson.result.longitude  + ', '+  responseJson.result.latitude + ']')
          }
        }
      }
    })
  }

})();