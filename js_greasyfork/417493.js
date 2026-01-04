// ==UserScript==
// @name         请假大师
// @namespace    http://tampermonkey.net/
// @version      0.1.1.8
// @description  请假的时候辅助选择时间事由
// @author       王二
// @match        https://kq.wangyuan.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417493/%E8%AF%B7%E5%81%87%E5%A4%A7%E5%B8%88.user.js
// @updateURL https://update.greasyfork.org/scripts/417493/%E8%AF%B7%E5%81%87%E5%A4%A7%E5%B8%88.meta.js
// ==/UserScript==

(function() {
    let SelectCause = function(){
        let scroll_body = document.querySelector("#lType > xm-select > div.xm-body.absolute > div > div > div.scroll-body")
        let div_all = scroll_body.querySelectorAll('div.xm-option-content'), i;
        for (i = 0; i < div_all.length; ++i) {
            let div_line = div_all[i]
            // console.log(div_line.outerText, div_line.outerText.indexOf('请优先使用'))
            let outerText = div_line.outerText
            console.log('outerText', outerText)
            if (outerText.indexOf('请优先使用') == -1 & outerText.indexOf('余 0 小时') == -1) {
                div_line.click()
                break
            }
        }
    }

    let interval = setInterval(function(){
        let layui1 = document.querySelector("body > div.layui-layout.layui-layout-admin > div.layui-body > div:nth-child(1) > div.layui-layer.layui-layer-page")
        if (layui1){

            //通过假别判断填过没
            let label_content = document.querySelector("#lType > xm-select > div.xm-label.single-row > div > div.label-content")
            let xm_icon = document.querySelector("#lType > xm-select > i")
            let bFindA = label_content && label_content.outerText.indexOf('余 0 小时') != -1
            if (bFindA) {
                // "xm-icon xm-icon-expand"
                if (xm_icon.className.indexOf('xm-icon-expand') == -1) {
                    xm_icon.click()
                    SelectCause()
                    setTimeout(function(){xm_icon.click()}, 1)
                }
            }

            let reason = document.querySelector("#fMainLeave > div:nth-child(6) > div.layui-col-md6.layui-col-space10 > div:nth-child(10) > div > div > textarea")
            let lLTime = Number(document.querySelector("#lLTime").value)
            let bFindB = reason && reason.value == '' && (lLTime >= 7 | lLTime <= 0)
            if (bFindB) {
                //选假别
                let xm_select = document.querySelector("#lType > xm-select > div.xm-tips")
                let bFindC = xm_select && xm_select.outerText == '请选择'
                if (bFindC){
                    SelectCause()
                }

                //选开始时间
                document.querySelector("#lsTime").click()
                document.querySelector("#layui-laydate5 > div.layui-laydate-footer > span").click()
                document.querySelector("#layui-laydate5 > div.layui-laydate-main.laydate-main-list-0.laydate-time-show > div.layui-laydate-content > ul > li:nth-child(2) > ol > li.t1.tv30").click()
                document.querySelector("#layui-laydate5 > div.layui-laydate-footer > div > span.laydate-btns-confirm").click()

                //延迟一下再点
                setTimeout(function(){
                    //选结束时间
                    document.querySelector("#leTime").click()
                    document.querySelector("#layui-laydate6 > div.layui-laydate-footer > span").click()
                    document.querySelector("#layui-laydate6 > div.layui-laydate-main.laydate-main-list-0.laydate-time-show > div.layui-laydate-content > ul > li:nth-child(1) > ol > li.t0.tv13").click()
                    document.querySelector("#layui-laydate6 > div.layui-laydate-main.laydate-main-list-0.laydate-time-show > div.layui-laydate-content > ul > li:nth-child(2) > ol > li.t1.tv30").click()
                }, 1)


                //填原因
                let content_text = '加班太晚'
                let content = document.querySelector('#fMainLeave > div:nth-child(6) > div.layui-col-md6.layui-col-space10 > div:nth-child(10) > div > div > textarea');
                if (!content) {
                    content = document.querySelector("#fWorkLeave > div:nth-child(6) > div.layui-col-md6.layui-col-space10 > div:nth-child(10) > div > div > textarea")
                }
                if (content.value != content_text) {
                    content.value = content_text
                    //console.log(i, content.value)
                }
            }
        }
    }, 1000);
})();
