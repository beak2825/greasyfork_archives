// ==UserScript==
// @name         U校园 助手
// @namespace    t
// @version      1.0.5
// @description  U校园助手
// @author       t
// @compatible   Chrome
// @match        *://ucontent.unipus.cn/_pc_default/pc.html?*
// @match        *://ucontent.unipus.cn/_utalk_default/pc.html?*
// @match        *://uexercise.unipus.cn/uexercise*
// @match        *://u.unipus.cn/user/student/homework*
// @match        *://sso.unipus.cn/sso/login*
// @match        *://u.unipus.cn/*
// @match        *://ucamapi.unipus.cn/*
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
// @downloadURL https://update.greasyfork.org/scripts/419145/U%E6%A0%A1%E5%9B%AD%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/419145/U%E6%A0%A1%E5%9B%AD%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var classification = 'U校园';
    var year = '2020';
    var q_onlineclass = '';
    var q_type = '单选题'
    var kdaurl = "http://bigdata.receive.plugin.xuanke.com/api/plugin"
    setTimeout(function(){
        var url = location.href;
        if(url.match(/enter_check_student_exam_detail/)) {
            //答题页
            getQusetionData()
        }
    },2000)

    function getQusetionData() {
     console.log(q_onlineclass)
     $('.Analysis').css('display','block')

     $('.Question-Conversation').each(function(index){
         var q_lesson = $('.TestTitle .title').html();
         var q_stem =  $(this).find('.padding p').html()
         var q_option_list = ''
         // 获取选项
         $(this).find('.optNormal label').each(function(){
             q_option_list = q_option_list + ' ' + $(this).text()
         })
         $(this).find('.Analysis p')[1]
         var q_answer = $(this).find('.Analysis p')[1].innerHTML.replace(/&nbsp;/ig,'');
         var data = {
             classification: classification,
             q_lesson: q_lesson,
             q_stem:q_stem,
             q_option_list: q_option_list,
             q_answer: q_answer,
             q_type: q_type,
             year: year,
             q_index: index + 1,
             timestamp: new Date().getTime() + index * 1000
         }
         setTimeout(function() {
             GM_xmlhttpRequest({
                 method: 'POST',
                 url: kdaurl,
                 headers: {
                     'Content-type': 'application/json'
                 },
                 data: JSON.stringify(data),
                 onload: function() {
                     if(index == $('.Question-Conversation').length - 1) {
                         alert('完成')
                     }
                 }
             })
         },index * 1000)

     })
    }

})();