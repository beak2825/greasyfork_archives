// ==UserScript==
// @name         【首发】EasyWJX附加-保存问卷星已填写答案，实现企业版断点续答；刷新保留答案；实时保存答案；自动恢复答案；
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  EasyWJX附加脚本，问卷星问卷保存正在填写的答案，刷新后自动补充上次已填写过的内容，可实现问卷星企业版“断点续答”类似的功能
// @author       MelonFish
// @match        https://ks.wjx.top/*/*
// @match        http://ks.wjx.top/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/455088/%E3%80%90%E9%A6%96%E5%8F%91%E3%80%91EasyWJX%E9%99%84%E5%8A%A0-%E4%BF%9D%E5%AD%98%E9%97%AE%E5%8D%B7%E6%98%9F%E5%B7%B2%E5%A1%AB%E5%86%99%E7%AD%94%E6%A1%88%EF%BC%8C%E5%AE%9E%E7%8E%B0%E4%BC%81%E4%B8%9A%E7%89%88%E6%96%AD%E7%82%B9%E7%BB%AD%E7%AD%94%EF%BC%9B%E5%88%B7%E6%96%B0%E4%BF%9D%E7%95%99%E7%AD%94%E6%A1%88%EF%BC%9B%E5%AE%9E%E6%97%B6%E4%BF%9D%E5%AD%98%E7%AD%94%E6%A1%88%EF%BC%9B%E8%87%AA%E5%8A%A8%E6%81%A2%E5%A4%8D%E7%AD%94%E6%A1%88%EF%BC%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/455088/%E3%80%90%E9%A6%96%E5%8F%91%E3%80%91EasyWJX%E9%99%84%E5%8A%A0-%E4%BF%9D%E5%AD%98%E9%97%AE%E5%8D%B7%E6%98%9F%E5%B7%B2%E5%A1%AB%E5%86%99%E7%AD%94%E6%A1%88%EF%BC%8C%E5%AE%9E%E7%8E%B0%E4%BC%81%E4%B8%9A%E7%89%88%E6%96%AD%E7%82%B9%E7%BB%AD%E7%AD%94%EF%BC%9B%E5%88%B7%E6%96%B0%E4%BF%9D%E7%95%99%E7%AD%94%E6%A1%88%EF%BC%9B%E5%AE%9E%E6%97%B6%E4%BF%9D%E5%AD%98%E7%AD%94%E6%A1%88%EF%BC%9B%E8%87%AA%E5%8A%A8%E6%81%A2%E5%A4%8D%E7%AD%94%E6%A1%88%EF%BC%9B.meta.js
// ==/UserScript==
var ran = 1;
(function() {
    'use strict';
    if (ran == 1) {
        ran++;
        // Your code here...
        setTimeout(function () {
            writeAllAnswer() //加载之后就自动填写保存过的答案
        },1000)
        function writeAnswer_radio(id, answer){
            var all_html = document.querySelectorAll('.field.ui-field-contain')[id]
            var radios = all_html.querySelectorAll('.ui-radio')
            if (radios.length!=0) {
                if (answer.ques_id == id) {
                    for (var j=0; j<radios.length; j++) {
                        var this_radio = radios[j];
                        if (this_radio.querySelector('span input').value == answer.answer) {
                            this_radio.click()
                            return 'success'
                        }
                    }
                }
            }
            return 'not_radio'
        }
        function writeAllAnswer() {
            var localAns_ls = getLocalStorage(getwjid())
            if (localAns_ls == null) {
                return 'no_localstorage'
            }
            for (var i=0; i<localAns_ls.length; i++) {
                if (localAns_ls[i].kind == 'radio') {
                    var ret = writeAnswer_radio(i, localAns_ls[i])
                }
            }
        }
        function getAnswer_radio(id) {
            //var id = parseInt(str_id);
            var all_html = document.querySelectorAll('.field.ui-field-contain')[id]
            var checked_radio = all_html.querySelector('.ui-radio.checked')
            if (checked_radio) {
                // 这里返回两个内容，一个是value，一个是结果
                return [checked_radio.querySelector('span input').value, 'success']
            }
            return [0, 'fail']
        }
        function getAllAnswer(){
            var all_ques_html = document.querySelectorAll('.field.ui-field-contain')
            var answer_ls = []
            for (var i=0; i<all_ques_html.length; i++) {
                try {
                    var [ans,status] = getAnswer_radio(i)
                    }catch {
                        var [ans,status] = [0, 'fail']
                        }
                if (status != 'fail') {
                    answer_ls.push({ques_id: i, answer: ans, kind: 'radio'})
                }
            }
            return answer_ls
        }
        function saveAnswerToLocal() {
            var answer_ls = getAllAnswer()
            if (answer_ls.length==0) {
                return false
            }
            var wj_id = getwjid()
            localStorage.setItem('easywjx_localans_'+wj_id, JSON.stringify(answer_ls))
            console.log(answer_ls)
            return true
        }
        function getwjid() {
            return window.location.pathname.replace('/vm/', '').replace('.aspx', '')
        }
        function getLocalStorage(wj_id) {
            return JSON.parse(localStorage.getItem('easywjx_localans_'+wj_id))
        }

        function sleep(time) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve()
                }, time * 1000)
            })
        }
        setTimeout(async function () {
            while(true){
                await sleep(1)
                saveAnswerToLocal()
                await sleep(1)
            }
        }, 2000)
    }
})();