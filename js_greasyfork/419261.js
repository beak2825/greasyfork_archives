// ==UserScript==
// @name         学习通助手
// @namespace    t
// @version      1.0.8
// @description  学习通
// @author       t
// @compatible   Chrome
// @match        *://*.chaoxing.com/work/*
// @match        *://*.chaoxing.com/*/work/*
// @connect      bigdata.receive.plugin.xuanke.com
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/419261/%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/419261/%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // Your code here...
  var kdaurl = "http://bigdata.receive.plugin.xuanke.com/api/plugin"
  if(location.href.includes('getAllWork')) {
      return
  }
  setTimeout(function () {
    if(location.href.includes("mooc2")){
        alert("开始")
      getSepacialData();
    }else {
      getData()
    }
  }, 2000)

  function getData() {
      var classification = '学习通';
      var year = new Date().getFullYear();
      var q_onlineclass = $('.headerwrap h1 span').attr('title');
      var q_lesson = $('.CyTop .cur').text()
      $('.TiMu').each(function(index) {
          var q_stem = $(this).find('.Zy_TItle').text()
          var type = $(this).prevAll('.Cy_TItle1').eq(0).text()
          var q_type = ''
          if (type.includes('单选')) {
              q_type = '单选题'
          } else if (type.includes('多选题')) {
              q_type = '多选题'
          } else {
              q_type = '简答题'
          }
          var q_option_list = ''
          $(this).find('.Zy_ulTop li').each(function(){
             q_option_list = q_option_list + ' ' + $(this).text()
          })
          var q_answer = ''
          if($(this).find('.Py_answer span')[0]) {
             q_answer =  $(this).find('.Py_answer span')[0].textContent.split('：')[1] || ''
          }
          var data = {
              classification: classification,
              year: year,
              q_onlineclass: q_onlineclass.replace(/\s+/g, ""),
              q_lesson: q_lesson,
              q_stem: q_stem.replace(/\s+/g, ""),
              q_type: q_type,
              q_option_list: q_option_list,
              q_answer: q_answer,
              q_index: index + 1,
              timestamp: new Date().getTime() + index * 1000
          }
          setTimeout(function() {
              console.log(data)
              GM_xmlhttpRequest({
                  method: 'POST',
                  url: kdaurl,
                  headers: {
                      'Content-type': 'application/json'
                  },
                  data: JSON.stringify(data),
                  onload: function(res) {
                      console.log(index,$('.TiMu').length)
                      if(index == $('.TiMu').length - 1) {
                          alert('完成')
                      }
                  }
              })
          }, index*1000)
      })
  }
  function getSepacialData() {
    var classification = '学习通';
    var year = new Date().getFullYear();
    var q_onlineclass = $('.mark_title').text();
    var q_lesson = ''
    $(".mark_item").each(function(i) {
      $('.questionLi').each(function(index) {
        var q_stem = $(this).find('.mark_name').text()
        var type = $(this).find(".colorShallow").text()
        var q_type = ''
        if (type.includes('单选')) {
            q_type = '单选题'
        } else if (type.includes('多选题')) {
            q_type = '多选题'
        } else {
            q_type = '简答题'
        }
        var q_option_list = ''
        $(this).find('.mark_letter li').each(function(){
           q_option_list = q_option_list + ' ' + $(this).text()
        })
        var q_answer = ''
        if($(this).find('.colorGreen')) {
            console.log(typeof($(this).find('.mark_key span')[1].textContent))
            q_answer = $(this).find('.mark_key span')[1].textContent.split(': ')[1] || ''
        }
        var data = {
            classification: classification,
            year: year,
            q_onlineclass: q_onlineclass.replace(/\s+/g, ""),
            q_lesson: q_lesson,
            q_stem: q_stem.replace(/\s+/g, ""),
            q_type: q_type,
            q_option_list: q_option_list,
            q_answer: q_answer,
            timestamp: new Date().getTime() + index * 1000
        }
        setTimeout(function() {
            console.log(data)
            GM_xmlhttpRequest({
                method: 'POST',
                url: kdaurl,
                headers: {
                    'Content-type': 'application/json'
                },
                data: JSON.stringify(data),
                onload: function(res) {

                }
            })
        }, index*1000)
      })
    })

}

})();