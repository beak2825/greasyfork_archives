// ==UserScript==
// @name         华为商城提前排队
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  添加提前排队按钮
// @author       You
// @match        https://www.vmall.com/product/*.html
// @grant        
// @downloadURL https://update.greasyfork.org/scripts/392726/%E5%8D%8E%E4%B8%BA%E5%95%86%E5%9F%8E%E6%8F%90%E5%89%8D%E6%8E%92%E9%98%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/392726/%E5%8D%8E%E4%B8%BA%E5%95%86%E5%9F%8E%E6%8F%90%E5%89%8D%E6%8E%92%E9%98%9F.meta.js
// ==/UserScript==

(function() {
    var btn_html="<a onclick='rush.business.clickBtn(1)' class='product-button02' style='margin-left:10px;'><span>提前排队</span></a>"
    var time_html="<button ' id='schedule-btn' style='margin-left:10px;'>定时排队<button>"
    var input_html="<input type=‘text’ style='width:180px;' id='time-input' placeholder='输入时间 如2019-11-11 18:00:00'>"
    var div_html="<div id='timedown-div'></div>"
    var div
    window.onload=function(){
        div=$('#pro-operation');
        div.append(btn_html)
        div.append(input_html)
        div.append(time_html)
        //-------------
    var schedule_btn=$('#schedule-btn')
    var time_input=$('#time-input')

    //time_input.val("1232131231")
    schedule_btn.click(function(){
        var val=time_input.val()
        time_input.remove()
        schedule_btn.remove()
        div.append(div_html)
        var time=TimeDown("timedown-div",val)

    })

    }

})();

function timeTransfer(time){
    //var time = "2017-06-23 17:00:00";
    time = time.replace(/-/g,':').replace(' ',':'); // 注意，第二个replace里，是' '，中间有个空格，千万不能遗漏
    time = time.split(':');
    var time1 = new Date(time[0],(time[1]-1),time[2],time[3],time[4],time[5]);
    return time1;
}

function TimeDown(id, endDateStr) {
            //结束时间
            var endDate = new Date(endDateStr);
            //当前时间
            var nowDate = new Date();
    if(nowDate.getTime()>=endDate.getTime()){
        rush.business.clickBtn(1)
    }
            //相差的总秒数
            var totalSeconds = parseInt((endDate - nowDate) / 1000);
            //天数
            var days = Math.floor(totalSeconds / (60 * 60 * 24));
            //取模（余数）
            var modulo = totalSeconds % (60 * 60 * 24);
            //小时数
            var hours = Math.floor(modulo / (60 * 60));
            modulo = modulo % (60 * 60);
            //分钟
            var minutes = Math.floor(modulo / 60);
            //秒
            var seconds = modulo % 60;
            //输出到页面
            document.getElementById(id).innerHTML = "还剩:" + days + "天" + hours + "小时" + minutes + "分钟" + seconds + "秒";
            //延迟一秒执行自己
            setTimeout(function() {
                TimeDown(id, endDateStr);
            }, 500)
}


