// ==UserScript==
// @name         zb213cs
// @namespace    fuShe
// @version      1.6.3
// @description  河科院一键评教
// @author       fuShe
// @match       https://jxzlbz.hist.edu.cn:80/*
// @icon        http://jwgl.hist.edu.cn/favicon.ico
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/494651/zb213cs.user.js
// @updateURL https://update.greasyfork.org/scripts/494651/zb213cs.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    //获取评教按钮
    setTimeout(()=>{
     alert('本次评教需要一分钟时间，点击下方评教任务后，由于网页原因，可能会一直处于提交状态，这属于正常情况，在此期间请勿点击该页面/最小化该浏览器，但是可以切换到其他页面，等待提示出现即可结束')
    },1000)
    let dingshi2 = setInterval(() => {
        let pingjias = document.querySelectorAll('.btn_theme')
        console.log(pingjias)
        if (pingjias.length) {
            clearInterval(dingshi2)
            let ypjs = document.querySelectorAll('.ypj')
            let id = 0
            function xunhuan(id) {
                pingjias[id].click()
                setTimeout(() => {
                    let fenshus = document.querySelectorAll('.el-radio__original')
                    for (let i = 0; i < fenshus.length; i++) {
                        if (i % 7 === 0) {
                            fenshus[i].click()
                        }
                    }
                    let tijiao = document.querySelectorAll('.el-button--default')
                    tijiao[tijiao.length - 1].click()
                }, 1000)
            }
            let dingshi = setInterval(() => {
                //console.log(id,'id')//用来直观的查看
                xunhuan(id)
                id++
                if (id >= pingjias.length) {
                    clearInterval(dingshi)
                    setTimeout(()=>{
                      alert('评教成功，请关闭插件后刷新页面')
                    },1500)
                }
            }, 3000);
        }
    }, 1000)
    })();