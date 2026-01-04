// ==UserScript==
// @name         welearn助手
// @namespace    t
// @version      1.0.5
// @description  welearn
// @author       t
// @compatible   Chrome
// @match        *://course.sflep.com/student/StudyCourse.aspx?*
// @connect      bigdata.receive.plugin.xuanke.com
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/419279/welearn%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/419279/welearn%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var kdaurl = "http://bigdata.receive.plugin.xuanke.com/api/plugin"

    setTimeout(function () {
        getData()
    }, 2000)

    function getData() {
        var wordArr = ['A','B','C','D','E','F','H','I']
        var frame = $("#contentFrame").contents()
        var classification = 'welearn';
        var year = new Date().getFullYear();
        var q_onlineclass = frame.find('header div div div').text();
        var q_lesson = frame.find('header div div label').text();
        var q_type = '单选题';
        var q_option_list = ''

        frame.find("[data-controltype = 'choice']").each(function(index){
          var q_stem = $(this).find('div div').text()
          var q_option_list = ''
          $(this).find('ul li').each(function(index){
              var text = $(this).text().replace(/\s+/g, "")
              q_option_list = q_option_list + wordArr[index] +'.' + text + ' '
          })
          var q_answer = $(this).find("[data-itemtype='result']").text().split(':')[1]
          var data = {
              classification: classification,
              year: year,
              q_onlineclass: q_onlineclass.replace(/\s+/g, ""),
              q_lesson: q_lesson,
              q_stem: q_stem,
              q_type: q_type,
              q_option_list: q_option_list,
              q_answer: q_answer,
              q_index: index + 1,
              timestamp: new Date().getTime() + index * 1000
          }
          var kdaurl = "http://bigdata.receive.plugin.xuanke.com/api/plugin"
          console.log(data)
          setTimeout(function(){
              GM_xmlhttpRequest({
                  method: 'POST',
                  url: kdaurl,
                  headers: {
                      'Content-type': 'application/json'
                  },
                  data: JSON.stringify(data),
                    onload: function(res) {
                        console.log(index,frame.find("[data-controltype = 'choice']").length)
                        if(index == frame.find("[data-controltype = 'choice']").length - 1) {
                            alert('完成')
                        }
                    }
             })
          },index*1000)

        })
    }
})();