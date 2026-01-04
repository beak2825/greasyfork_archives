// ==UserScript==
// @name         考试云增强脚本
// @namespace    https://greasyfork.org/zh-CN/users/563657-seast19
// @version      0.1
// @description  考试云增强脚本，解锁更多功能
// @author       seast19
// @icon         https://s1.ax1x.com/2020/05/18/YWucdO.png
// @match        http://www.kaoshiyun.com.cn/Cloud/Exam/ExamGrade.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408212/%E8%80%83%E8%AF%95%E4%BA%91%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/408212/%E8%80%83%E8%AF%95%E4%BA%91%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  //全局添加样式
  function addGlobalStyle(css) {
    let head, style
    head = document.getElementsByTagName('head')[0]
    if (!head) {
      return
    }
    style = document.createElement('style')
    style.type = 'text/css'
    css = css.replace('!important', '')
    style.innerHTML = css.replace(/;/g, ' !important;')
    head.appendChild(style)
  }

  //  导出成绩
  function downloadXlsx() {
    $.post(
      addURLTimeStamp(
        'http://www.kaoshiyun.com.cn/Cloud/Exam/ExamAjaxHelper.ashx'
      ),
      {
        method: 'GetUserExamAnalysisGradeList',
        arrangeID: GetQueryString('arrangeID'),
        currentPageIndex: $('#hidCurrentPageIndex').val(),
        keyword: '',
        status: '',
        isExport: 'Y',
        beginTime: $('#txtBeginTime').val(),
        endTime: $('#txtEndTime').val(),
        analysisType: 'max',
        pageSize: '1000000',
        classCode: 'info',
      },
      function (jsonData) {
        console.log(jsonData.exportURL)
        window.location = jsonData.exportURL
      }
    )
  }

  switch (location.pathname) {
    case '/Cloud/Exam/ExamGrade.html':
      // 显示删除按钮
      let css = `
          #delete {
            display:inline !important;
          }`

      addGlobalStyle(css)

      // 添加 `导出考试分析` 按钮
      let myli = document.createElement('li')
      myli.innerHTML = '<a id="mygrade" href="javascript:;">[助手]导出成绩</a>'
      document.querySelector('.dropdown-menu').prepend(myli)
      myli.addEventListener('click', downloadXlsx)
      break

    default:
      break
  }
})()
