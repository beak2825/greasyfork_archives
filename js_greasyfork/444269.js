// ==UserScript==
// @name         找寻5000
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  可以用来确定天眼查5000条的时间段。
// @author       havedbb1
// @match        https://www.tianyancha.com/advance/search/e-pc_homeicon
// @match        https://www.tianyancha.com/advance/search/e-pc_homeicon#rollback
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tianyancha.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444269/%E6%89%BE%E5%AF%BB5000.user.js
// @updateURL https://update.greasyfork.org/scripts/444269/%E6%89%BE%E5%AF%BB5000.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('我的脚本加载了');
    var button = document.createElement("button"); //创建一个input对象（提示框按钮）
    button.id = "id001";
    button.textContent = "找寻5000";
    button.style.width = "120px";
    button.style.height = "50px";
    button.style.align = "center";
    var timestart = document.getElementById('retTimeStart')
    var timeend = document.getElementById('retTimeEnd')

    timestart.value = '2010-01-01'
    timeend.value = '2011-12-31'


    var quedingriqi=document.getElementsByClassName('custom-submit-btn button button-primary-bd -sm')[1]
    quedingriqi.click()

    var itnum = document.getElementById('click-result-num')
    //绑定按键点击功能
    button.onclick = function (){
        console.log('点击了按键');

        if (4000<Number(itnum.innerText) && Number(itnum.innerText)<5000==true) {
            var se = new Date(timeend.value)
            se.setDate(se.getDate() +10)
            timeend.value = dateFormat("YYYY-mm-dd", se)
            quedingriqi.click()
            sleep(50)
            itnum = document.getElementById('click-result-num')
            timeend = document.getElementById('retTimeEnd')
        }else{
            if (Number(itnum.innerText) < 5000 == true) {
                var se = new Date(timeend.value)
                se.setMonth(se.getMonth() + 1)
                timeend.value = dateFormat("YYYY-mm-dd", se)
                quedingriqi.click()
                sleep(50)
                itnum = document.getElementById('click-result-num')
                timeend = document.getElementById('retTimeEnd')
            }else{
                var se = new Date(timeend.value)
                se.setDate(se.getDate() -10)
                timeend.value = dateFormat("YYYY-mm-dd", se)
                quedingriqi.click()
            }
        }

        return;
	};
      var x = document.getElementsByClassName('custom-input-warp')[1];
    //在浏览器控制台可以查看所有函数，ctrl+shift+I 调出控制台，在Console窗口进行实验测试
	x.appendChild(button);

    //插入另一个按钮
    //插入另一个按钮
    var button2 = document.createElement("button"); //创建一个input对象（提示框按钮）
    button2.id = "id001";
    button2.textContent = "下一个5000";
    button2.style.width = "120px";
    button2.style.height = "50px";
    button2.style.align = "center";
    //


    //绑定按键点击功能
    button2.onclick = function (){
        console.log('点击了按键');

        var ts0=new Date(document.getElementById('retTimeEnd').value)

        ts0.setDate(ts0.getDate() +1)
        document.getElementById('retTimeStart').value=dateFormat("YYYY-mm-dd", ts0)
        return;
    };
    var x2 = document.getElementsByClassName('custom-input-warp')[1];
    //在浏览器控制台可以查看所有函数，ctrl+shift+I 调出控制台，在Console窗口进行实验测试
    x2.appendChild(button2);



    function dateFormat(fmt, date) {
        let ret;
        const opt = {
            "Y+": date.getFullYear().toString(), // 年
            "m+": (date.getMonth() + 1).toString(), // 月
            "d+": date.getDate().toString(), // 日
            "H+": date.getHours().toString(), // 时
            "M+": date.getMinutes().toString(), // 分
            "S+": date.getSeconds().toString() // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;
    }


    function sleep(time){
        var timeStamp = new Date().getTime();
        var endTime = timeStamp + time;
        while(true){
            if (new Date().getTime() > endTime){
                return;
            }
        }
    }
})();