// ==UserScript==
// @name         jira功能增强
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  jira功能增强!
// @author       e-commerce Fontend Team
// @match        http://192.168.0.151:8080/browse/*
// @match        http://192.168.0.151:8080/projects/*/issues/*
// @match        https://cdn.bootcdn.net/*
// @require      https://cdn.bootcdn.net/ajax/libs/toastify-js/1.12.0/toastify.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452139/jira%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/452139/jira%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
(function () {
  'use strict';
  function loadCSS(path) {
    if (!path || path.length === 0) {
      throw new Error('argument "path" is required !');
    }
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.href = path;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    head.appendChild(link);
  }
  function createCopy() {
    $('#create-menu').after('<button class="aui-button aui-button-primary aui-style" id="copyLink">复制源码关键字</button>')
    $(document).on('click', '#copyLink', function () {
      var link = window.location.href;
      var title = $('#summary-val').text();
      var input = document.createElement('input');
      console.log(input)
      input.value = title + ' ' + link;
      document.body.appendChild(input);
      input.select();
      input.setSelectionRange(0, input.value.length),
        document.execCommand('Copy');
      document.body.removeChild(input);
      Toastify({
        text: "复制成功",
        position: "center",
      }).showToast();
    })
  }
  function autoCopySubTask() {
    let version = $("#fixfor-val").find("a").text();
    let summary = $("#summary-val").text();
    if (!$("#fixVersions-textarea").val()) {
      setTimeout(() => {
        $("#fixVersions-textarea").val(version);
      }, 1000)
    }
    if (!$("#summary").val()) {
      setTimeout(() => {
        $("#summary").val(summary);
      }, 1000)
    }
  }
  $(document).on('click', "#stqc_show,#create-subtask", function () {
    autoCopySubTask();
  })
  $(document).on('click', "#create-issue-submit", function () {
    if ($("#qf-create-another").attr("checked") == "checked"){
      autoCopySubTask();
    }
  })
  loadCSS("https://cdn.bootcdn.net/ajax/libs/toastify-js/1.12.0/toastify.min.css")
  createCopy();
})();