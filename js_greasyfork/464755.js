// ==UserScript==
// @name         TCOA Time
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  工时脚本插件
// @author       arthas.ma
// @match        http://tcoa.17usoft.com/portal/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=17usoft.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464755/TCOA%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/464755/TCOA%20Time.meta.js
// ==/UserScript==

// 添加 css 样式
function addStyle() {
    let css = `
    .mjt_wrap{

    line-height: var(--header-height);
    font-weight: 400;
    font-size: 16px;
    color: #fffc;
    padding: 0 20px;
    cursor: pointer;
    transition: all .1s ease-in-out;
    position: relative;

    }


.mjt_wrap2 {
    text-align: center;
}




    `

    GM_addStyle(css)
}


function createHTML() {
    // 获取百度首页 logo
    let logo = document.getElementsByClassName("nav")
    // 创建一个自己的结构
    let example = document.createElement("li")
    // 给 example 这个 div 设置类名
    example.classList.add("mjt_wrap")
    example.innerHTML = `工时计算`
    logo[0].append(example)
    let flag = false
    example.addEventListener("click", function () {
        let example2 = document.createElement("div")

        if (flag) {
document.getElementsByClassName("mjt_wrap2")[0].style.display='none'
            flag = false
            return
        }
        const response = window.arthas_response
        console.log(JSON.parse(response.response).Message)


        example2.classList.add("mjt_wrap2")

        example2.innerHTML = JSON.parse(response.response).Message
        document.getElementById("app").prepend(example2)

        function calcTime(str) {
            let totalHour = str.split('-').at(-1).split(':')[0] - str.split('-').at(0).split(':')[0]
            let min = str.split('-').at(-1).split(':')[1] - str.split('-').at(0).split(':')[1]
            if (min < 0) {
                min = 60 + min
                totalHour -= 1
            }
            return totalHour * 60 + min

        }

        const nowMonth = new Date().getMonth() + 1
        let totalDays = 0
        let totalMin = 0
        JSON.parse(response.response).ReturnValue.forEach((item) => {
            if (item.AccountingWork && nowMonth == item.Month) {
                totalDays++
                totalMin += calcTime(item.CreditCardData)
                // console.log(item.Month, item.Day, calcTime(item.CreditCardData))
            }

        })
        let monthAvg = ((totalMin / totalDays) / 60).toFixed(2)
     const weekTimeArr=JSON.parse(response.response).Message.replace(/<\/?.+?\/?>/gm, '').trim().split("】")[0].split('，')[1].match(/\d+/g)

const avgWeek=((weekTimeArr[0]*60+weekTimeArr[1]/1)/(new Date().getDay()-1)/60).toFixed(2)
        example2.innerHTML += `<p style='margin: 20px 0 0em;'><span>月出勤天数<span style="color:#ff7800;font-weight:bold;">${totalDays}</span>天，月平均工时<span
            style="color:#ff7800;font-weight:bold;">${monthAvg}</span>小时，周平均工时<span
            style="color:#ff7800;font-weight:bold;">${avgWeek}</span>小时</span>
    </p>`
        flag = true

    });


}

(function () {
    'use strict';
    GM_xmlhttpRequest({
        method: "POST",
        url: `http://tcoa.17usoft.com/platform/EmployeeBase/GetAttendanceByDate?selectDate=`,
        data: "",

        onload: function (response) {
            window.arthas_response = response
        },
        onerror: function () {
            alert(`操作失败`);
        }
    });

    setTimeout(() => {
        createHTML()
        addStyle()
    }, 1000)


    // Your code here...
})();


