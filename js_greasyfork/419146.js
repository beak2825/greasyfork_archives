// ==UserScript==
// @name         西南科技大学答题
// @namespace    https://greasyfork.org/zh-CN/users/707063-genexy
// @version      202106101513
// @description  西南科技大学答题助手，进入试题等答案出来交卷
// @author       流浪的蛊惑
// @match        *://learnspace.swust.net.cn/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/419146/%E8%A5%BF%E5%8D%97%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/419146/%E8%A5%BF%E5%8D%97%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==
var href = location.href;
var sfsc=true;
window.alert=function(e){console.log(e);};
window.confirm=function(e){console.log(e);};
function submitPaper(sj){
    $.ajax({
        method:"POST",
        url:"/learnspace/course/test/coursewareTest_autoSubmitPaper.action",
        dataType:"json",
        data:sj,
        success:function(data){
            location.reload();
        }
    });
}
(function() {
    'use strict';
    setInterval(function(){
        if(sfsc){
            sfsc=false;
            let cslj=document.getElementById("test_menu_button");
            if(cslj!=null){
                cslj.setAttribute("target","_blank");
            }
            if(href.includes("/learnspace/course/test/coursewareTest_intoCourseTestListStudent.action")){
                let kclb=document.getElementsByClassName("shadow2 test_card");
                let cjks=true;
                for(let i=0;i<kclb.length;i++){
                    let fsb=kclb[i].getElementsByClassName("t_score");
                    if(fsb.length>0){
                        let fs=parseInt(fsb[0].innerText);
                        if(fs>=60){
                            cjks=false;
                        }
                    }
                    if(cjks){
                        kclb[i].getElementsByTagName("a")[0].click();
                        break;
                    }
                    cjks=true;
                }
            }
            if(href.includes("/learnspace/course/test/coursewareTest_intoTestPage.action")){
                let zql=document.getElementsByClassName("record_rate_num");
                let sfdt=true;
                if(zql.length>0){
                    let fs=parseInt(zql[0].innerText.replace(/%/g,""));
                    if(fs>=60){
                        sfdt=false;
                        let back=document.getElementsByClassName("bj_back_container");
                        if(back.length>0){
                            back[0].click();
                        }
                    }
                }
                if(sfdt){
                    let testId=document.getElementById("current_testId").value;
                    let itemId=document.getElementById("current_itemId").value;
                    let historyId=document.getElementById("current_historyId").value;
                    let ad={
                        testId:testId,
                        itemId:itemId,
                        historyId:historyId,
                        myAnswers:""
                    };
                    localStorage.setItem("试卷信息",JSON.stringify(ad));
                    location.href="/learnspace/course/test/coursewareTest_intoTestAnswerPage.action?itemId="+itemId+"&params.courseId="+_ACTIVITYID_+"&flag=true";
                }
            }
            let sji=localStorage.getItem("试卷信息");
            if(sji!=null){
                if(href.includes("/learnspace/course/test/coursewareTest_intoTestAnswerPage.action")){
                    localStorage.removeItem("试卷信息");
                    let da=document.getElementsByClassName("test_item_key_tit");
                    let das=[];
                    for(let i=0;i<da.length;i++){
                        das.push(da[i].innerText.replace(/参考答案：/g,"").replace(/对/g,"T").replace(/错/g,"F"));
                    }
                    let tjda=JSON.parse(sji);
                    tjda.myAnswers=das.join("|");
                    submitPaper(tjda);
                }
            }else{
                let back=document.getElementsByClassName("mod_back");
                if(back.length>0){
                    back[0].click();
                }
            }
        }
    },1000);
})();