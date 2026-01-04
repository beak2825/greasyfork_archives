// ==UserScript==
// @license MIT
// @name         华医答题结果
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  华医记录答题结果
// @author       lemondqs
// @match        https://cme42.91huayi.com/pages/exam_result.aspx?**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=91huayi.com
// @grant        none

// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.js
/* globals jQuery, $, waitForKeyElements */

// @downloadURL https://update.greasyfork.org/scripts/470777/%E5%8D%8E%E5%8C%BB%E7%AD%94%E9%A2%98%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/470777/%E5%8D%8E%E5%8C%BB%E7%AD%94%E9%A2%98%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==
(function() {
    'use strict';
//data = {
//    'tit_1': {
//        'opt_1': {
//            check: true,
//            pass: true,
//        }
//    }
//}
    $(function(){
        let data = JSON.parse((localStorage.getItem("questionData") || "{}"));
        console.log(data); // 打印数据
        let tits = []
        $('.state_lis_text').each((i,e)=> {
            let tit = $(e).text().replace(/[^\u4e00-\u9fa5]/g, '')
            tits.push(tits)
            let titItem = data[tit]
            Object.values(titItem).forEach(item => {
                if (item.check===true && item.pass==undefined) {
                    item.pass = false
                }
            });
            // data[tit] = titItem
        })
        Object.keys(data).filter(key => !tits.includes(key)).forEach(key=> {
            data[key].forEach(item => {
                if (item.check===true && item.pass==undefined) {
                    item.pass = true
                }
            })
        })

        console.log(data); // 打印更新后的数据

        // 将 data 存储到 localStorage 的名为 "questionData" 的键中
        localStorage.setItem("questionData", JSON.stringify(data));
    })
    // Your code here...
})();