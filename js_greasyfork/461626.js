// ==UserScript==
// @name         b站分p视频时间计算器（含倍速计算）
// @namespace    https://github.com/srx-2000/
// @version      0.1
// @description  输入想要查看的分p视频的起始p和结尾p，输入倍速，即可计算看完所需时间。
// @author       Beier
// @match        https://www.bilibili.com/video/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/461626/b%E7%AB%99%E5%88%86p%E8%A7%86%E9%A2%91%E6%97%B6%E9%97%B4%E8%AE%A1%E7%AE%97%E5%99%A8%EF%BC%88%E5%90%AB%E5%80%8D%E9%80%9F%E8%AE%A1%E7%AE%97%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/461626/b%E7%AB%99%E5%88%86p%E8%A7%86%E9%A2%91%E6%97%B6%E9%97%B4%E8%AE%A1%E7%AE%97%E5%99%A8%EF%BC%88%E5%90%AB%E5%80%8D%E9%80%9F%E8%AE%A1%E7%AE%97%EF%BC%89.meta.js
// ==/UserScript==


(function() {
        $(document).ready(function () {
        $(document).click(function () {
            event.srcElement.id !== "btn" && event.srcElement.className !== "window" ? $("#choiceWindow").slideUp(300) : $("#choiceWindow").slideDown(300);
        });
        let result="";
        $("#cal").click(function(){
            var begin=parseInt($('input[name="begin"]').val());
            var end=parseInt($('input[name="end"]').val());
            var speed=parseInt($('input[name="speed"]').val());
            let result=getResult(begin,end,speed);
            $("#result").html(result);

        })
    });

    function getResult(begin, end, speedP) {
        const page = $(".cur-page").text();
        const pageNum = parseInt(page.split("/")[1]);
        let speed = 1;
        if (begin > end || (typeof speedP) !== 'number'||end>pageNum||begin<=0) {
            return "<span>输入有误</span>"
        }
        speedP > 3 ? speed = 3 : speedP < 0.5 ? speed = 0.5 : speed = speedP;
        let hourList = [];
        let minList = [];
        let secList = [];
        $("div.duration").each(function(){
        const time = $(this).text();
        const list = time.split(":");
        if(list.length==3){
            hourList.push(list[0]);
            minList.push(list[1]);
            secList.push(list[2]);
        }else{
            hourList.push('0');
            minList.push(list[0]);
            secList.push(list[1]);
        }
    })
        const subhourList = hourList.slice(begin - 1,end);
        const subminList = minList.slice(begin - 1,end);
        const subsecList = secList.slice(begin - 1,end);
        const leftTime = calcLeftTime(subhourList ,subminList, subsecList,speed);
        return "<span>"+leftTime+"</span>"

    }
    function calcLeftTime(hourList ,minList, secList,speedP){
    if(hourList.length!=minList.length ||minList.length!= secList.length){
        return "计算失败";
    }else{
        let hour = listsum(hourList);
        let min = listsum(minList);
        let sec = listsum(secList);
        let all_sec=parseInt((hour*60*60+min*60+sec)/speedP)
        let m = all_sec / 60;
        min =parseInt(m);
        let s = all_sec-min*60;
        let h = parseInt(min/60);
        m = min%60;

        return h+"小时"+m+"分钟"+s+"秒";
    }

}
    function listsum(list){
    let sum = 0;
    for(let i =0;i<list.length;i++ ){
        sum += parseInt(list[i])
    }
    return sum;
}
})();

(function(){

    let html = `
    <button id="btn" style="width: 1.5rem;
        height: 1.5rem;
        border: 1px solid gray;
        background: linear-gradient(currentColor, currentColor) no-repeat center/.875em 2px,
        linear-gradient(currentColor, currentColor) no-repeat center/2px .875em,
        ghostwhite;
        color: dimgray;
        top: 30%;
        right: 3%;
        z-index:999;
        position:absolute;
        padding: 10px;">
     </button>
    <div id="choiceWindow" class="window" style="display: none;
        position: absolute;
        top: 30%;
        right: 3%;
        width: 150px;
        height: 150px;
        padding: 20px;
        text-align: center;
        border: 3px solid #ccc;
        background-color: white;">
    
        <label class="window">计算器：</label><br/>
        起始：<input class="window" type="text" name="begin" maxlength="4" style='width: 60px; margin:5px;'>
        <br/>
        截止：<input class="window" type="text" name="end" maxlength="4" style='width: 60px;margin:5px;'>
        <br/>
        倍速：<input class="window" type="number" name="speed" maxlength="1" maxlength="1" step="0.5" max="3" style='width: 60px;margin:5px;'>
<br/>
        <button id="cal" class="window"style='margin:5px;'>计算</button>
        <br/>
        <div id="result" class="window" style="text-align: center;">
            结果:
        </div>
</div>
`
    setTimeout($('body').append(html),1000);


})();

