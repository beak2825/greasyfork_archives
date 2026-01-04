// ==UserScript==
// @name         DYJJHelper
// @namespace    https://github.com/qisumi
// @version      0.1
// @description  Dao Yuan Jie Jie !
// @author       Qisumi
// @match        https://ywgl.seu.edu.cn/*
// @connect      ywgl.seu.edu.cn
// @match        https://infoplus.seu.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net.cn
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @license MIT
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/473196/DYJJHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/473196/DYJJHelper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 这里编写审核通过的条件逻辑判断，需要注意的是在JS中，日期的月份是从0开始的
     *
     */
    let filter = function (item, idx, array) {
        let arriveGateTime = new Date(item.arrive_gate_time)
        let beginTime = new Date(2023, 7, 19)
        let endTime = new Date(2023, 7, 21)
        if (arriveGateTime < beginTime || arriveGateTime > endTime) {
            return false
        }
        return true
    }

    let getUrls = function () {
        GM_xmlhttpRequest({
            url: "https://ywgl.seu.edu.cn/api/stureturn/bkslook/0",
            method: "POST",
            data: "filter=%7B%22student_id%22%3A%22%22%2C%22health_report%22%3Anull%2C%22status_code%22%3A%224%22%2C%22createTL%22%3Anull%2C%22createTR%22%3Anull%2C%22arriveTL%22%3Anull%2C%22arriveTR%22%3Anull%2C%22area_province%22%3Anull%2C%22area_city%22%3Anull%2C%22area%22%3Anull%7D&order=create_time",
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
                "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Microsoft Edge\";v=\"115\", \"Chromium\";v=\"115\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            onload: function (xhr) {
                let res = JSON.parse(xhr.responseText).response
                let items = res.filter(filter)
                items = items.map(item => {
                    return item.url
                })
                GM_log(items)
                let anchor_button = $('div.main button')
                if (anchor_button.length > 0) {
                    anchor_button.parent().append(`
                        <span style='margin-left:10px'>
                        存在<span style='font-weight:bold;color:red;'>${res.length}</span>个未审核的请求，其中满足预定义条件的有<span style='font-weight:bold;color:green;'>
                        ${items.length}</span>个</span>`)
                    GM_log("管理页面")
                    GM_setValue('DYJJHelper_autoSubmit', false)
                    return
                }

                /* -------------------------------------------------------------------------- */
                /*                                   自动审核流程                              */
                /* -------------------------------------------------------------------------- */
                function submit() {
                    GM_log("审核页面")
                    if (items.length === 0) {
                        // 如果没有未审批，跳转回到管理页面
                        window.location.href = 'https://ywgl.seu.edu.cn/bkslook'
                    }
                    let submit_btn = document.querySelectorAll("a.command_button_content")[0]
                    if (submit_btn) {
                        if (submit_btn.innerHTML !== '<nobr>审批通过</nobr>') return
                        submit_btn.click();
                        setTimeout(() => {
                            let ok_btn = document.querySelector('div.dialog_footer > button.dialog_button.default.fr')
                            ok_btn.click()
                            setTimeout(() => {
                                if (items.length === 1) {
                                    // 如果这已经是最后一个需要审核的，直接跳转回到管理页面
                                    window.location.href = 'https://ywgl.seu.edu.cn/bkslook'
                                }
                                let newUrl = items.pop()
                                if (newUrl === window.location.href) {
                                    newUrl = items.pop()
                                    alert(newUrl)
                                    alert(window.location.href)
                                }
                                window.location.href = newUrl
                            }, 1000)
                        }, 1000);
                    } else {
                        setTimeout(submit, 1000)
                    }
                }
                if (GM_getValue('DYJJHelper_autoSubmit')) {
                    submit()
                } else {
                    GM_registerMenuCommand('开始自动审核', function () {
                        GM_setValue('DYJJHelper_autoSubmit', true)
                        setTimeout(submit, 1000)
                        GM_unregisterMenuCommand('开始自动审核')
                    })
                }

            }
        });
    }

    getUrls();
})();