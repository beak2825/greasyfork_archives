// ==UserScript==
// @name        googleform
// @namespace   Violentmonkey Scripts
// @match       *://docs.google.com/*
// @grant       none
// @version     1.2
// @author      -
// @require    https://code.jquery.com/jquery-1.12.4.min.js
// @description 2020/8/20 下午2:06:11
// @downloadURL https://update.greasyfork.org/scripts/409427/googleform.user.js
// @updateURL https://update.greasyfork.org/scripts/409427/googleform.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // 邮件地址
  const email = 'test@qq.com'

  // 设置的插入规则
  /**
  * key 指想配置的栏目的关键字，或者正则
  * value 指匹配到栏目需要自动填写到内容
  */
  const fillList = [
    {
      key: 'email',
      value: email,
    },
    {
      key: 'adress',
      value: '0x000000000',
    },
    {
      key: 'id',
      value: 'test',
    },
  ]

  // 查找input的关联标题
  const findInputHeaderText = inputObj => {
    let obj = $(inputObj)
    for(let i=0;obj=obj.parent();i++) {
      if (obj.prev().attr('class') === 'freebirdFormviewerComponentsQuestionBaseHeader') {
        return obj.prev().text().toLowerCase()
      }
      if (i >= 10) return '' // 防止卡死
    }
  }

  // 使页面识别输入
  const fireEvents = element => {
    ['input', 'click', 'change', 'blur'].forEach((event) => {
       const changeEvent = new Event(event, { bubbles: true, cancelable: true })
       element.dispatchEvent(changeEvent);
     })
  }

  $(document).ready(() => {
    $('input').each((index,element) => {
      // 填充邮箱
      if (element.type === 'email') {
        $(element).val(email)
        fireEvents(element)
      }
      // 填充text
      if (element.type === 'text') {
        fillList.forEach(item => {
          if (findInputHeaderText(element).indexOf(item['key']) !== -1) {
            // console.log(item['key'])
            $(element).val(item['value'])
            fireEvents(element)
          }
        })
      }
    })
  })

})();
