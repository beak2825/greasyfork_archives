// ==UserScript==
// @name         zhongbaoxin_order_grabbing
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  shows how to use babel compiler
// @author       xingqiyi
// @match        *://*sl.ciitc.com.cn:3003/*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @icon         <$ICON$>
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/446496/zhongbaoxin_order_grabbing.user.js
// @updateURL https://update.greasyfork.org/scripts/446496/zhongbaoxin_order_grabbing.meta.js
// ==/UserScript==

(function(){

    return
    const getTask = function (){
        var clickCount = 0
        var taskCount = 0
        setTimeout(() => {
            if($("#condition_task_status").parent().children()[1].children[1].children[2] && clickCount == 0){
                clickCount = 1
                $("#condition_task_status").parent().children()[1].children[1].children[2].click()
                $(".btn_form80.btn-danger")[0].click()
                //setTimeout(()=>{
                console.log("2222222")
                clickCount = 0
                if(!$("#taskTable").parent().find("tbody>tr .btnView").length == 0){
                    setTimeout(location.reload(),3000)
                }
                console.log($("#taskTable").parent().find("tbody>tr .btnView"))
                var e = $("#taskTable").parent().find("tbody>tr .btnView")[0]
                console.log(e)
                if(/(layCheck|审核)/.test(e.outerHTML)){
                    taskCount = 1
                    e.click()
                }
                setTimeout(getTask(),3000)
                if(taskCount == 0){
                    //getTask()
                }else{
                    //setTimeout(getTask(),30*60*1000)
                    return
                }

                // ///////////下面没用的///////////
                $("#taskTable").parent().find("tbody>tr .btnView").each(function (i, e) {
                    console.log(i+"---"+$("#taskTable").parent().find("tbody>tr .btnView").length/2)
                    //return
                    if(i<$("#taskTable").parent().find("tbody>tr .btnView").length/2){
                        console.log(/(layCheck|审核)/.test(e.outerHTML))
                        if(/(layCheck|审核)/.test(e.outerHTML)){
                            console.log("1111111111")
                            e.click()
                            return
                        }
                        //setTimeout(getTask(),0)
                        //return
                    }
                })
                //},2000)
            }
        }, 1000);
    }
    getTask()
})()