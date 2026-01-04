// ==UserScript==
// @name         2022华医网公需课
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  2022华医网公需课，进入视频播放界面后全自动。
// @author       浩浩
// @match        *://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @match        *://*.91huayi.com/pages/exam.aspx?*
// @match        *://*.91huayi.com/pages/exam_result.aspx?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453779/2022%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%85%AC%E9%9C%80%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/453779/2022%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%85%AC%E9%9C%80%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Your code here...
    // 考试页面
    if(window.location.pathname == '/pages/exam.aspx') {
        let quests = window.localStorage.getItem('MyQuests')
        if(quests == undefined || quests == null) quests = "{}"
        try{
            quests = JSON.parse(quests)
        } catch(err) {
            quests = {}
        }

        let trs = $("tr[align='left']")
        for(let i=0;i<trs.length;++i){
            let title = $(trs[i]).find('thead span')[0].innerText.substring(2).replaceAll(" ","")

            let as = $(trs[i]).find("table input")
            
            // 有记录
            if(quests[title]){

            } else {
                quests[title] = {}
                quests[title].index = 0
            }
            as[quests[title].index].click()
        }
        window.localStorage.setItem('MyQuests', JSON.stringify(quests))

        setTimeout(function(){
            // 提交
            $("#btn_submit").click()
            // 随机时间，太快了貌似会触发验证码
        }, 5000 + Math.random()*5000)
    // 视频页面
    } else if(window.location.pathname == '/course_ware/course_ware_polyv.aspx'){
        window.jrksInter = setInterval(function(){
            console.log("检查是否可以进入考试。。。")
            let attr = $("#jrks").attr("disabled")
            // 可以进入考试了
            if(attr != 'disabled') {
                window.localStorage.setItem('MyQuests', JSON.stringify({}))
                $("#jrks")[0].click()
            }
        }, 10000)
    
        window.videoAskInter = setInterval(function(){
            console.log("检查是否进入视频小测试。。。")
            let askDiv = $(".pv-ask-modal-wrap")[0]
            if(askDiv) {
                console.log("小测评")
                let preTestIndex = window.localStorage.getItem('preTestIndex')
                if(preTestIndex == undefined || preTestIndex == null) preTestIndex = -1;
                else {
                    try{
                        preTestIndex = Number(preTestIndex)
                    } catch(err) {
                        localStorage.setItem('preTestIndex', -1)
                        return
                    }
                }
                let radios = $(".pv-ask-modal-wrap").find("input[type='radio']")
                preTestIndex += 1;
                if(!radios[preTestIndex]) {
                    localStorage.setItem('preTestIndex', -1)
                }
                radios[preTestIndex].click()
                localStorage.setItem('preTestIndex', preTestIndex)
                // 点击提交
                $(".pv-ask-modal-wrap").find(".pv-ask-submit")[0].click()
                // 检查提交结果
                setTimeout(function(){
                    if($(".pv-ask-error-tip").length == 1){
                        // 答错
                    } else {
                        // 答对
                        localStorage.setItem('preTestIndex', -1)
                    }
                    $(".pv-ask-modal-wrap").find(".pv-ask-default")[0].click()
                },2000)
            }
        }, 10000)
    // 考试结束页面
    } else if(window.location.pathname == '/pages/exam_result.aspx'){
        let btns = $("input[value='重新考试']")
        if(btns && btns.length>0){
            let quests = window.localStorage.getItem('MyQuests')
            quests = JSON.parse(quests)

            let errQuest = $("dd")
            for(let i=0;i<errQuest.length;++i){
                let title = errQuest[i].title.replaceAll(" ","")
                quests[title].index++
            }
            window.localStorage.setItem('MyQuests', JSON.stringify(quests))

            btns[0].click()
            return
        }

        let items = $("input[value='立即学习']")
        if(items && items.length>0){
            items[0].click()
        }
    }

})();