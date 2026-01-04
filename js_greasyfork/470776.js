// ==UserScript==
// @license MIT
// @name         华医答题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  华医记录答题
// @author       lemondqs
// @match        https://cme42.91huayi.com/pages/exam.aspx?**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=91huayi.com
// @grant        none

// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.js
/* globals jQuery, $, waitForKeyElements */

// @downloadURL https://update.greasyfork.org/scripts/470776/%E5%8D%8E%E5%8C%BB%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/470776/%E5%8D%8E%E5%8C%BB%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==
(function() {
    'use strict';
const hashCode = str => Array.from(str).reduce((hash, char) => ((hash << 5) - hash) + char.charCodeAt(0), 0).toString();



//data = {
//    'tit_1': {
//        'opt_1': {
//            check: true,
//            pass: true,
//        }
//    }
//}


    $(function(){
        $("body").append('<button style="position: fixed; top: 100px; left: 100px;" onclick="javascript;localStorage.setItem("questionData", JSON.stringify({}))">清空</button>')
        let data = JSON.parse((localStorage.getItem("questionData") || "{}"));
        console.log(JSON.stringify(data)); // 打印数据
        $('[id*=gvQuestion_question]').each((i,e)=> {
            let options = $('#gvQuestion_rbl_'+i).find('input[type=radio]')
            // let tit = hashCode($(e).text().replace(/[^\u4e00-\u9fa5]/g, ''))
            let tit = $(e).text().replace(/[^\u4e00-\u9fa5]/g, '')
            let titItem = data[tit]
            console.log("tit, titItem", JSON.stringify(tit), JSON.stringify(titItem))
            if (!titItem) {
                titItem = {}
                options.each((idx,elm) => {
                    let okey = $(elm).val()
                    titItem[okey] = {check: idx==0}
                    idx==0 && $(elm).prop("checked", true);
                })
                console.log("titItem", JSON.stringify(titItem))
            } else {
                const clkopt = (options, key) => options.each((idx, elm) => $(elm).val() === key && $(elm).prop("checked", true));
                // 是否已经正确通过
                let passkey = Object.keys(titItem).find(key => titItem[key].pass === true);
                console.log("passkey", JSON.stringify(passkey))
                if (passkey) {
                    clkopt(options, passkey)
                } else {
                    let actkey = Object.keys(titItem).find(key => titItem[key].check === false);
                    titItem[actkey].check = true;
                    clkopt(options, actkey)
                    console.log("actkey", JSON.stringify(actkey))
                }
            }
            data[tit] = titItem;
            console.log("tit, titItem", JSON.stringify(tit), JSON.stringify(titItem))
        })
        console.log(JSON.stringify(data)); // 打印更新后的数据

        // 将 data 存储到 localStorage 的名为 "questionData" 的键中
        localStorage.setItem("questionData", JSON.stringify(data));
    })
    // Your code here...
})();