// ==UserScript==
// @name         查缺的日志
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  查出本月到今天为止缺的日志
// @author       kkopite
// @match        http://oa.smart-core.com.hk:7000/km/summary/index.jsp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418997/%E6%9F%A5%E7%BC%BA%E7%9A%84%E6%97%A5%E5%BF%97.user.js
// @updateURL https://update.greasyfork.org/scripts/418997/%E6%9F%A5%E7%BC%BA%E7%9A%84%E6%97%A5%E5%BF%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 1.修改显示条数为 40条
    // 2.填写年份，月份开始搜索
    // 3.获取所有显示的日志信息，抓取日期
    // 4.从本月第一天开始比对是否有对应的日志
    // Your code here...

    // step 2 之后再调整每页数量，再次查询
    const step2 = () => {
        $('[data-lui-mark="paging.amount"]').val(40)
        document.querySelector('.lui_paging_btn').click()
    };

    // step 1 先使用日期查询
    const step1 = () => {
        const date = new Date()
        const query = date.format('yyyy-MM')
        $('[data-lui-date-input-name]').val(query)
        $('.criteria-input-ok').click()
    }

    const sleep = (time) => new Promise((res) => {
        setTimeout(res, time)
    })


    // step 3
    const step3 = () => {
        const arr = $('.lui_listview_rowtable_summary_box a.textEllipsis.com_subject > span > span')
        const reg = /.*?(\d{4}-\d{2}-\d{2}).*/
        const allDate = Array.prototype.map.call(arr, t => t.title.match(reg)[1])
        console.log(allDate)
        const temp = []
        const date = new Date()
        // step 4 今天是几号
        const today = date.getDate()
        for (let i = 1; i <= today; i++) {
            date.setDate(i)
            const day = date.getDay()
            if (day === 0 || day === 6) continue; // 双休日直接跳过
            const query = date.format('yyyy-MM-dd')
            // 去allDate里面找有没有
            const idx = allDate.findIndex(val => val === query)
            if (idx === -1) {
                temp.push(query)
            }
        }

        alert('以下日期没有写日志：' + temp.join(','))
    }

    function addBtn(name, func) {
        const btn = document.createElement("button");
        btn.innerText = name;
        btn.addEventListener("click", func);
        btnContainer.appendChild(btn);
    }

  let btnContainer = null;

  function init() {
    btnContainer = document.createElement("div");
    btnContainer.style.position = "fixed";
    btnContainer.style.top = "64px";
    btnContainer.style.right = 0;
    btnContainer.style.padding = "10px";
    document.body.append(btnContainer);

    addBtn("查询缺的日期", async function(){
        step1()
        await sleep(3000)
        step2()
        await sleep(3000)
        step3()
    });
  }

  init()

})();