// ==UserScript==
// @name         广州中小学继续教育网自动看视频
// @namespace    https://i.teacher.gzteacher.com
// @version      1.0.0
// @description  广州中小学继续教育网自动看视频1
// @author       wisen
// @match        https://i.teacher.gzteacher.com/*
// @match        http://study.gzteacher.com/*
// @grant        none
// @license
// @downloadURL https://update.greasyfork.org/scripts/469408/%E5%B9%BF%E5%B7%9E%E4%B8%AD%E5%B0%8F%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/469408/%E5%B9%BF%E5%B7%9E%E4%B8%AD%E5%B0%8F%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function () {
    const getSessionStorage = window.sessionStorage.getItem.bind(window.sessionStorage)
    window.sessionStorage.getItem = (key) => {
        if (key !== 'preventManyWindowRank') return getSessionStorage(key)
        console.log('获取preventManyWindowRank',1222)
        return '{"sessionStorageitem":"1"}'
    }
    // 检测间隔
    const time = 3000
    const wisenTimer = setInterval(()=>{
        // 固定选择选项 B
        const answerB = document.querySelector("#videoQasData > div:nth-child(2) > div.ant-radio-group.ant-radio-group-outline.ant-radio-group-default > label:nth-child(2)")
        if(answerB){
            answerB.click()
            setTimeout(() => {
                // 确认按钮
                const confirmBtn = document.querySelector("body > div:nth-child(7) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-footer > button:nth-child(2)")
                confirmBtn && confirmBtn.click()
                // 继续学习按钮
                const continueStudyBtn = document.querySelector("body > div:nth-child(6) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-footer > button:nth-child(1)")
                continueStudyBtn && continueStudyBtn.click()
            }, 500)
            return
        }

        // 下一活动按钮
        // const nextBtn = document.querySelector("body > div:nth-child(8) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-body > div > button:nth-child(2) > span")
        // nextBtn && nextBtn.click()
    }, time)
    })();
