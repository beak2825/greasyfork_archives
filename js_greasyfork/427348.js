// ==UserScript==
// @name         倒计时自动设置当前时间
// @namespace    yuywo.org
// @version      0.1.1
// @description  这个网站的倒计时
// @author       yuywo
// @match        http://jishi.00cha.net/rqdjs.asp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427348/%E5%80%92%E8%AE%A1%E6%97%B6%E8%87%AA%E5%8A%A8%E8%AE%BE%E7%BD%AE%E5%BD%93%E5%89%8D%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/427348/%E5%80%92%E8%AE%A1%E6%97%B6%E8%87%AA%E5%8A%A8%E8%AE%BE%E7%BD%AE%E5%BD%93%E5%89%8D%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function dateFormat(fmt, date) {
        if(date.getDay() >= 6 ){
            date.setDate(date.getDate() + (8 - date.getDay()))
        }
        let ret;
        const opt = {
            "Y+": date.getFullYear().toString(),
            "m+": (date.getMonth() + 1).toString(),
            "d+": date.getDate().toString(),
            "H+": date.getHours().toString(),
            "M+": date.getMinutes().toString(),
            "S+": date.getSeconds().toString()
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };

        if(date.getHours() >= 12){
            fmt+=' 18:00:00';
        } else {
            fmt+=' 12:00:00';
        }
        return fmt;
    }


    var edtime = document.getElementById('edtime');
    var time = edtime.value;
    var now = dateFormat('YYYY-mm-dd',new Date());
    if(now != time){
        edtime.value=now;
        var myform = document.forms;
        myform[0].submit();
    }
})();