// ==UserScript==
// @name         SetNum
// @namespace    bld
// @version      0.3
// @description  自动填写手机号，到付款
// @author       bld fanfan
// @match        https://lm.189.cn/jdrecharge/jdrecharge_activity*
// @match        https://wappay.189.cn/pay/onlinePay.html?sessionid*
// @match        https://mclient.alipay.com/cashier/mobilepay.htm?alipay_exterface_invoke_assign_target*
// @match        https://mclient.alipay.com/h5*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382677/SetNum.user.js
// @updateURL https://update.greasyfork.org/scripts/382677/SetNum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //方法--------------------------------
    //这个页面已经引入自己的库$了
    //获取页面参数
    var getPageParams = function(){
        let url = window.location.href
        let option = {}
        if (url.indexOf("?") > -1) {
            let arr = url.split("?")[1].split("&")
            arr.forEach(function (str) {
                let arrTemp = str.split("=")
                option[arrTemp[0]] = arrTemp[1]
            })
        }
        return option
    }
    //执行---------------------------------
    let htmlDom=document.documentElement

    let url= window.location.href
    let timer1=null

    window.onload=function(){
        //填手机号页面-----------------------
        if(url.indexOf("frombldphone")>-1){
            //样式
            //htmlDom.style.width="400px"
            //htmlDom.style.margin="0 auto"

            let phoneNum=getPageParams().frombldphone
            let $input=$("input.indexPhoneNum[type='tel']")
            $input.val(phoneNum)
            setTimeout(function(){
                let btnDom=document.getElementsByClassName("indexBtn")[0]
                let btnImg=btnDom.getElementsByTagName("img")[0]
                btnImg.click()
            },20)
            //点击确定
            timer1=setInterval(function(){
                let mask=document.getElementsByClassName("indexPopup")[0]
                if(mask.style.display==="block"){
                    let confirmBtn=document.getElementsByClassName("indexConfirm")[0]
                    confirmBtn.click()
                    clearInterval(timer1)
                }
            },20)
        }
        //选择支付方式页面-----------------------
        if(url.indexOf(`wappay.189.cn/pay/onlinePay.html`)>-1&&url.indexOf("sessionid")>-1){
            //样式
            //htmlDom.style.width="400px"
            //htmlDom.style.margin="0 auto"

            //点击radio
            let radio=$("li.onlinePay_item[bankcode='ZFB001']").get(0)
            radio.click()
            //填input value
            let typeInput=document.getElementById("onlinePay_bankCode")
            typeInput.value="ZFB001"
            //点击submit btn
            let submitBtn=document.getElementsByClassName("onlinePay_btn")[0]
            submitBtn.click()
        }
        //支付宝页面-------------------------------
        if(url.indexOf(`mclient.alipay.com/cashier/mobilepay`)>-1){
           let titleDom=$(".result .result-title").get(0)
           titleDom.style.visibility="hidden"
           //点击继续支付
           let payBtn=$("a.J-h5pay.am-button.am-button-blue").get(0)
           payBtn.click()
        }
        //支付宝确认付款页面-------------------------------
        if(url.indexOf(`mclient.alipay.com/h5`)>-1&&url.indexOf("h5_route_token")>-1){
           //样式
           //htmlDom.style.width="400px"
           //htmlDom.style.margin="0 auto"
        }
    }
})();