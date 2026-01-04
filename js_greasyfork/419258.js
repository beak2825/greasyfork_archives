// ==UserScript==
// @name         mooc
// @namespace    t
// @version      1.1.3
// @description  mooc 助手
// @author       t
// @compatible   Chrome
// @match        https://www.icourse163.org/learn/*
// @match        http://www.icourse163.org/learn/*
// @match        http://www.icourse163.org/spoc/learn/*
// @match        https://www.icourse163.org/spoc/learn/*
// @connect      bigdata.receive.plugin.xuanke.com
// @grant        GM_xmlhttpRequest
// @grant        GM.deleteValue
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_info
// @grant        unsafeWindow
// @run-at       document-start
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/419258/mooc.user.js
// @updateURL https://update.greasyfork.org/scripts/419258/mooc.meta.js
// ==/UserScript==


    $(function () {
        'use strict';
        // 在这里填写用户 随便给自己起一个 不容易重复的就行
        // 例如 let userName = "张三11111111"
        let userName = ""
        //异步请求地址
        var kdaurl = "http://bigdata.receive.plugin.xuanke.com/api/plugin"
        // 插件控制台日志显示
        appendConsole()
        $('#consoleMsg').text(`请前往题目页面获取数据`)
        // 判断hash
        if ("onhashchange" in window) {
            window.onhashchange = function (ev) {
                $('#consoleMsg').text(`请前往题目页面获取数据`)
                if(location.hash.includes('/learn/quiz')) {
                    $('#consoleMsg').html(`<button id="getDataBtn">开始获取数据</button>`)
                }
            }
        }
      $('body').on ('click','#getDataBtn',function() {
          $('#consoleMsg').text(`正在获取数据`)
          setTimeout(function(){
              getData()
          },2000)
      })

      function getData() {
        var classification = '中国大学MOOC';
        var year = new Date().getFullYear();
        var q_onlineclass = $('.courseTxt').html();
        var teacher = $('.info h5').text()
        var q_lesson = $('.u-learn-moduletitle .j-title').text()
        // 选择题
        $('.u-questionItem') && $('.u-questionItem').each(function (index) {
          var q_stem = $(this).find('.j-richTxt').text()
          var qaCate = $(this).find('.qaCate span').text()
          var q_type = ''
          if (qaCate.includes('单选')) {
            q_type = '单选题'
          } else if (qaCate.includes('多选')) {
            q_type = '多选题'
          } else {
            q_type = '简答题'
          }
          var q_option_list = ''
          $(this).find('.choices li') && $(this).find('.choices li').each(function () {
            q_option_list = q_option_list + ' ' + $(this).text()
          })
          if(qaCate.includes('判断')) {
            q_option_list = 'A.对 B.错'
          }
          var data = {
            classification: classification,
            year: year,
            q_onlineclass: q_onlineclass,
            teacher: teacher.replace(/\s+/g, ""),
            q_lesson: q_lesson,
            q_stem: q_stem,
            q_type: q_type,
            q_option_list: q_option_list,
            q_answer: "",
            q_index: index + 1,
            timestamp: new Date().getTime() + index * 1000
          }
          console.log("kda",data)
          GM_xmlhttpRequest({
                method: 'POST',
                url: kdaurl,
                headers: {
                    'Content-type': 'application/json'
                },
                data: JSON.stringify(data),
                onload: function() {
                    if(index == $('.u-questionItem').length - 1) {
                        $('#consoleMsg').text(`获取数据完成!!!!!!!!`)
                    }
                }
           })
        })
      }
      function appendConsole() {
        let html = `<div style="position: fixed; top: 10%; left: 10%; width: 300px; height:100px; border: 1px solid rgb(189, 189, 189);background-color: rgba(0,199,88, 0.8); z-index:99999">
                    <p id="consoleMsg" style="font-size: 18px; color: #333">插件已运行</p>
                  </div>`
        $('body').append(html)
      }
    })