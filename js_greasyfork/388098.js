// ==UserScript==
// @name         OA自动登录
// @namespace    mscststs
// @version      0.3
// @description  自用 腾讯OA自动登录
// @author       mscststs
// @match        *://passport.oa.com/modules/passport/signin.ashx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388098/OA%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/388098/OA%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

function sleep(ms){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(ms)
        },ms);
    })
}

let init = async ()=>{
    await sleep(500);
    if(!$("#btn_smartlogin")){
        return
    }

    $("#div_ioalogin .login_normal").append(`<div id="login_helper" style="color:#e6198e;margin-top：20px;text-align:center"><span id="login_helper_Timer">3</span>秒后自动登录,点击取消</div>`);
    let cancelFlag = false;
    $("#login_helper").click((e)=>{
        //取消
        cancelFlag = true;
        console.log(e);
        e.stopPropagation();
        $("#login_helper").text("自动登录已取消")
        setTimeout(()=>{
            $("#login_helper").remove();
        },2000)
    })
    let iv = setInterval(()=>{
        if(cancelFlag == true){
            clearInterval(iv);
            //$("#login_helper").text("自动登录已取消")
        }else{
            if(parseInt($("#login_helper_Timer").text()) <=1 ){
                $("#btn_smartlogin").click()
                clearInterval(iv);
            }else{
                $("#login_helper_Timer").text(parseInt($("#login_helper_Timer").text()) -1);
            }
        }
    },1000)
}

(function() {
    'use strict';
    $().ready(()=>{
        init();
    })
})();