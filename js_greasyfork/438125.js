// ==UserScript==
// @name        古雅应-自动评价
// @namespace   Violentmonkey Scripts
// @match       http://jwxt.ncvt.net:8088/*
// @grant       none
// @version     1.0
// @author      -
// @description 2022/1/6 下午7:15:05
// @downloadURL https://update.greasyfork.org/scripts/438125/%E5%8F%A4%E9%9B%85%E5%BA%94-%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/438125/%E5%8F%A4%E9%9B%85%E5%BA%94-%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==
window.onload = function () {
    dian()


    function dian() {
        let dianping = setInterval(() => {
            if (document.querySelectorAll('td[title="未评"]').length > 0) {
                let jiancha = document.querySelectorAll('td[aria-describedby="tempGrid_tjztmc"]')
                for (let i =0;i<jiancha.length;i++){
                    if(jiancha[i].innerHTML==="未评"){
                        jiancha[i].click()
                        pingjia(dianping)
                    }
                }
            }
        })
    }

    function pingjia(dianping) {
        let cc = setInterval(() => {
            let anniu = document.querySelectorAll('[class="radio-inline input-xspj input-xspj-1"]')
            if (anniu.length>0) {
                clearInterval(cc)
                clearInterval(dianping)
                for (let i = 0; i < anniu.length; i++) {
                    anniu[i].children[0].click()
                }
                document.querySelector('.form-control').value ='老师上课时备课充分，语言流畅，思路清晰，课堂上有许多生动的案例分析，课堂互动时间也很多。不足之处是实验课程没有太多收获。'
                document.querySelector('#btn_xspj_tj').click()
                document.querySelector('#btn_ok').click()

                dian()
                // document.querySelectorAll('[class="ui-widget-content jqgrow ui-row-ltr"]')
            }

        },100)
    }
}