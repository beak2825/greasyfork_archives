// ==UserScript==
// @name         云呼系统自动接听
// @namespace    power by yyds
// @version      0.1
// @description  当云湖系统接收到电话，就自动接听
// @author       蝶影双双
// @match        *://ccc-v2.aliyun.com/*
// @icon         https://www.google.com/s2/favicons?domain=segmentfault.com
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/430067/%E4%BA%91%E5%91%BC%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E6%8E%A5%E5%90%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/430067/%E4%BA%91%E5%91%BC%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E6%8E%A5%E5%90%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("running")
    var jq = document.createElement('script');
    jq.src = "https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js";
    var times = 0
    test111("btn-answer")
    function test111(selector,time = 0, desc = 'has'){
        return new Promise(resolve => {
            //obs node
            let timer = setInterval(() => {
              let target = document.getElementById("btn-answer")
              if (!!target) {
                if (times < 3){
                    times++;
                    target.click()
                    console.log("点击接听第" + times + "次")
                }
                console.log("还在接听中")

              } else {
                if (times > 2){
                    console.log("电话挂了哦！")
                    times = 0
                }
                console.log("坐等电话中")                
                return
              }
            }, 2000)
          })
    }
    //obsHas("btn-answer")
    //
    function obsHas(selector, time = 0, desc = 'has') {
        return new Promise(resolve => {
          //obs node
          let timer = setInterval(() => {
            let target = document.getElementById("btn-answer")
            if (!!target) {
              //clearInterval(timer)
              if (Math.abs(time) > 0) {
                setTimeout(() => {
                  console.log(desc, selector)
                  resolve(selector)
                }, Math.abs(time) * 1000)
              } else {
                console.log(desc, selector)
                  target.click()
                resolve(selector)
              }
            } else {
              return
            }
          }, 1000)
        })
      }
    // Your code here...
})();