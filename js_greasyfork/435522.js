// ==UserScript==
// @name         选中输入框内容,给中英文之间加空格
// @namespace    https://github.com/Tyrone2333/add-space-between-zh-and-en
// @version      1.0.1
// @description  选中输入框内容,自动给中英文之间加空格
// @author       en20
// @include      http*://*
// @grant        none
// @license MIT
// @run-at		 document-start
// @downloadURL https://update.greasyfork.org/scripts/435522/%E9%80%89%E4%B8%AD%E8%BE%93%E5%85%A5%E6%A1%86%E5%86%85%E5%AE%B9%2C%E7%BB%99%E4%B8%AD%E8%8B%B1%E6%96%87%E4%B9%8B%E9%97%B4%E5%8A%A0%E7%A9%BA%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/435522/%E9%80%89%E4%B8%AD%E8%BE%93%E5%85%A5%E6%A1%86%E5%86%85%E5%AE%B9%2C%E7%BB%99%E4%B8%AD%E8%8B%B1%E6%96%87%E4%B9%8B%E9%97%B4%E5%8A%A0%E7%A9%BA%E6%A0%BC.meta.js
// ==/UserScript==
(function () {

  var getSelectedText = function () {

    if (window.getSelection)
      return window.getSelection().toString()
    else if (document.getSelection)
      return document.getSelection().toString()
    else if (document.selection)
      return document.selection.createRange().text
    return ""
  }

  function addSpace(text) {
    var p1 = /([A-Za-z])((<[^<]*>)*[\u4e00-\u9fa5]+)/gi
    var r = text
    r = r.replace(p1, "$1 $2")

    // 在前面添加空格
    var p2 = /([\u4e00-\u9fa5]+(<[^<]*>)*)([A-Za-z])/gi
    r = r.replace(p2, "$1 $3")
    return r
  }


  document.addEventListener("mouseup", function (e) {
    var copyText = getSelectedText()
    if (copyText) {

      var textObj = document.querySelector('input:focus')
      if (!textObj) {
        return
      }
      var rangeStart = textObj.selectionStart
      var rangeEnd = textObj.selectionEnd
      var delValue = textObj.value.substring(rangeStart, rangeStart)
      var tempStr1 = textObj.value.substring(0, rangeStart)
      var tempStr2 = textObj.value.substring(rangeEnd)
      var textValue = tempStr1 + tempStr2
      console.log('替换输入框选中文本',copyText)

      textObj.value = tempStr1 + addSpace(copyText) + tempStr2

    } else {

      return ""
    }

  })
})()
