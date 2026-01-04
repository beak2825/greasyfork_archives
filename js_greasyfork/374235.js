// ==UserScript==
// @name 贴吧邮箱采集器
// @namespace Violentmonkey Scripts
// @version 2.1
// @description 邮箱采集器，目前支持百度贴吧，适配更多网站以及功能联系作者微信：bianbingdang
// @match *://tieba.baidu.com/*
// @require https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require https://cdn.bootcss.com/clipboard.js/2.0.1/clipboard.min.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/374235/%E8%B4%B4%E5%90%A7%E9%82%AE%E7%AE%B1%E9%87%87%E9%9B%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/374235/%E8%B4%B4%E5%90%A7%E9%82%AE%E7%AE%B1%E9%87%87%E9%9B%86%E5%99%A8.meta.js
// ==/UserScript==


$(document).ready(function () {
  //需要展示的邮箱
  var email_str = ''
  regex = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/g
  let doc = $('body').html();
  emails = doc.match(regex) || [];

  if (emails.length <= 1) {
      return
  }

  emailsCopy = []

  for (let email of emails) {
      if (email.indexOf('**') > -1) {
          continue
      }
      emailsCopy.push(email)
  }

  let emailLength = emailsCopy.length

  email_str = emailsCopy.join(';')
  
  if(email_str.length > 150){
            display_email_str = email_str.substring(0,150) + "...";
        }else{
            display_email_str = email_str
        }
  
  //创建页面
  let panel_rignt = $("#pb_content > div.right_section.right_bright")
  panel_rignt.prepend(`
  <div class="region_bright app_download_box" id="emials_box">
      <h4 class="region_header">
          <span class="title">本页面发现邮箱${emailLength}个</span>
      </h4>
      <div style="word-wrap:break-word">
          ${display_email_str}
      </div>       
          <a id="copyEmails" href="javascript:;" data-clipboard-text=${email_str}>[复制邮箱]</a>
          <a id="closeEmails" href="javascript:;">[关闭该显示]</a>
      </div>
  </div> 
  `)

  $('#closeEmails').click(function () {
      $('#emials_box').fadeOut()
  })
  //剪贴板
  var clipboard = new ClipboardJS('#copyEmails');

  clipboard.on('success', function (e) {
      console.log(e)
      alert("本页共发现邮箱" + emailLength + "个，已复制到剪贴板" + '\n' + "bugs可联系作者微信：bianbingdang")
      e.clearSelection();
  });
  }
)