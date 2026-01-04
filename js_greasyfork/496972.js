// ==UserScript==
// @name         国家开放大学视频一键挂机脚本
// @namespace    http://tampermonkey.net/
// @version      2024-06-01
// @description  国家开放大学视频一键挂机脚本（0.1）
// @author       OrangeMinus
// @match        https://lms.ouchn.cn/course/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ouchn.cn
// @require https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496972/%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E8%A7%86%E9%A2%91%E4%B8%80%E9%94%AE%E6%8C%82%E6%9C%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/496972/%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E8%A7%86%E9%A2%91%E4%B8%80%E9%94%AE%E6%8C%82%E6%9C%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {

    $(document).on('click', '#auto-button', function () {
        var $this = $(this);
        requestActivitiesRead(this.dataset.activityId,this.dataset.time,$this)
    });
    setInterval(function (){
        const activity = document.getElementsByClassName("learning-activity ng-scope")
        for (const element of activity) {
            let autoButton = element.getElementsByClassName("auto-button");
            if (autoButton && autoButton.length>0) {
                continue
            }
            let id =  extractNumber(element.id)
            let activityValue = element.getElementsByClassName("attribute-value number ng-binding")
            if (activityValue.length>0) {
                let completeness = element.getElementsByClassName("completeness full");
                let activityTimeStr = activityValue[0].textContent
                let time = timeStringToSeconds(activityTimeStr);
                let buttonText = completeness && completeness.length>0?"已完成":"点击挂机"
                let btnHtml = '<span id="auto-button" class="button button-green small gtm-label auto-button" style="font-size: 12px; width: 58px; margin-left: 4px;" data-activity-id="'+id+'" data-time="'+time+'">'+buttonText+'</span>';
                $(element).prepend(btnHtml)
                console.log("课程id:",id,"时间:",time);
            }
        }
    },500)
    function requestActivitiesRead(id,end,$this){
        $.ajax({
            type: "POST",
            url: "https://lms.ouchn.cn/api/course/activities-read/"+id,
            contentType: 'application/json',
            data: JSON.stringify({
                start: 0,
                end: parseInt(end),
            }),
            success: function (response) {
                console.log('响应结果',response);
                if (response.completeness=="full"){
                    $this.text('已完成');
                }
            }
        });
    }

    function timeStringToSeconds(timeString) {
        // 按冒号分割字符串
        var parts = timeString.split(':');

        // 将每个部分转换为整数
        var hours = parseInt(parts[0], 10);
        var minutes = parseInt(parts[1], 10);
        var seconds = parseInt(parts[2], 10);

        // 计算总秒数
        var totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

        return totalSeconds;
    }

    function extractNumber(str) {
        // 找到最后一个连字符的位置
        var lastDashIndex = str.lastIndexOf('-');
        // 提取该位置之后的子字符串
        return str.substring(lastDashIndex + 1);
    }
})();

