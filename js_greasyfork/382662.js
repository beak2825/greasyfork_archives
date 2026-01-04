// ==UserScript==
// @name         SetPhoneNumberJs
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动填写手机号
// @author       fanfan
// @match        https://lm.189.cn/jdrecharge/jdrecharge_activity*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382662/SetPhoneNumberJs.user.js
// @updateURL https://update.greasyfork.org/scripts/382662/SetPhoneNumberJs.meta.js
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
    window.onload=function(){
        //点击按钮
        let url= window.location.href
        if(url.indexOf("frombldphone")>-1){
            let phoneNum=getPageParams().frombldphone
            let $input=$("input.indexPhoneNum[type='tel']")
            $input.val(phoneNum)
            //点击
            setTimeout(function(){
                let btnDom=document.getElementsByClassName("indexBtn")[0]
                let btnImg=btnDom.getElementsByTagName("img")[0]
                btnImg.click()
            },10)
        }
    }
})();