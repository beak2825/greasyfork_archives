// ==UserScript==
// @name         _提问小助手
// @namespace    https://ysslang.com/
// @version      0.7.1
// @description  问答页面问问题小助手, 提供一些小功能
// @author       LeoYuan
// @match        https://kms.finedevelop.com/display/support/qa/questions/ask
// @match        https://kms.finedevelop.com/qa/questions/ask
// @match        https://kms.finedevelop.com/tnqa/ask.action
// @match        https://kms.fineres.com/qa/questions/ask
// @match        https://kms.fineres.com/display/support/qa/questions/ask
// @match        https://kms.fineres.com/tnqa/ask.action
// @grant        none
// @icon         https://kms.finedevelop.com/download/resources/com.elitesoftsp.confluence.tiny.question.answer.plugins:tiny-qa-main-res/images/favicon.ico
// @note         脚本地址：https://greasyfork.org/zh-CN/scripts/391521
// @downloadURL https://update.greasyfork.org/scripts/391521/_%E6%8F%90%E9%97%AE%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/391521/_%E6%8F%90%E9%97%AE%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // Your code here...
  var $ = window.jQuery;

  // 默认标题
  document.getElementById('title').value="【报表/BI/图表/移动端】【问题/需求】";

  // 默认内容
  document.getElementById('question-body_ifr').contentDocument.getElementById('tinymce').innerHTML="<p>【现象】：</p><p>【JAR】：</p><p>【相关插件】：</p><p>【运行环境】：</p><p>【详情】：</p><p>【日志】：</p><p>【】：</p>";

  // 指定空间
  document.getElementById('postSpaceKeyAutoComplete').value="3.2 技术支持组";
  document.getElementById('postSpaceKey').value="support";
  document.getElementById('postSpaceName').value="3.2 技术支持组";

  // 默认标签
  //


  //附加图片
  $('#content').css('width','100%');
  $('#question-form > div.page-title > h1').append('<a target="_blank" href="https://kms.finedevelop.com/pages/viewpage.action?pageId=78357398">&nbsp;&nbsp;&nbsp;&nbsp;问答规范</a>')
  $('#question-form > div.page-title > h1').append('<a target="_blank" href="https://kms.finedevelop.com/pages/viewpage.action?pageId=35753576">&nbsp;&nbsp;&nbsp;&nbsp;问答模块共创</a>')
  $('#content').append('<div style="overflow:hidden;"><a target="_blank" href="https://kms.finedevelop.com/pages/viewpage.action?pageId=35753576"><img src="https://kms.finedevelop.com/download/attachments/35753576/子标签.png?version=95&modificationDate=1567561747000&api=v2" style=""></a></div>')

  //Support pasting image from clipboard
  var editor = document.getElementById('question-body_ifr').contentWindow.document.getElementById("tinymce");

  function insertImage(response) {
    var imageUrl = response.results[0]._links.download;
    var imageContent = '<p><img src="' + imageUrl + '" alt="" data-mce-selected="1"></p>'
    editor.innerHTML += imageContent;
  }

  function uploadFile(file) {
    var formdata = new FormData();
    var fileName = 'QA_Attachment_' + AJS.params.remoteUser + (+ new Date()) + '.' + file.type.split('/')[1];
    formdata.append('file', file, fileName);
    formdata.append('comment', 'Question & Answer attachment');
    formdata.append('minorEdit', 'true');
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if (xhr.status == 200) { insertImage(JSON.parse(xhr.response)); }
      else { alert("Error! Image upload failed"); }
    };
    xhr.onerror = function() {
      alert("Error! Image upload failed. Can not connect to server.");
    };
    xhr.open("POST", "https://kms.fineres.com/rest/api/content/105297037/child/attachment", true);
    xhr.setRequestHeader("X-Atlassian-Token", 'nocheck');
    xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
    xhr.send(formdata);
  }

  function handlePaste(e) {
    for (var i = 0 ; i < e.clipboardData.items.length ; i++) {
      var item = e.clipboardData.items[i];
      if (item.type.indexOf("image") != -1) uploadFile(item.getAsFile());
    }
  }

  editor.addEventListener("paste", handlePaste);
})();