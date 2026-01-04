// ==UserScript==
// @name         自动批改超星作业
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  自动批改超星作业，以自定义score数组中的概率打分，并提交下一份
// @author       zgggy
// @match        https://mooc1-1.chaoxing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404301/%E8%87%AA%E5%8A%A8%E6%89%B9%E6%94%B9%E8%B6%85%E6%98%9F%E4%BD%9C%E4%B8%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/404301/%E8%87%AA%E5%8A%A8%E6%89%B9%E6%94%B9%E8%B6%85%E6%98%9F%E4%BD%9C%E4%B8%9A.meta.js
// ==/UserScript==

// function here



// 批改结束调用系统通知
if(window.location.pathname == "/work/reviewTheList"){
    if (document.getElementsByClassName("ZuoYe")[0].children[2].children[0].children[3].children[0].innerText != "0人"){
        alert('点击批阅即开始');
    } else {
        if (window.Notification) {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf('safari') != -1) {
                if (ua.indexOf('chrome') > -1) {
                    // Chrome
                    Notification.requestPermission().then(function (permission) {
                        if (permission == "granted") {
                            var notification = new Notification('作业改完了', {
                                body: '作业改完了',
                                icon: 'some/icon/url',
                            });
                            notification.onclick = function () {

                                console.log('点击');
                                notification.close();
                            };
                        } else {
                            Notification.requestPermission();
                            console.log('没有权限,用户拒绝:Notification');
                        }
                    });
                } else {
                    // Safari
                    Notification.requestPermission(function (permission) {
                        if (permission == "granted") {
                            var notification = new Notification('作业改完了', {
                                body: '作业改完了',
                                icon: 'some/icon/url'
                            });
                            notification.onclick = function () {
                                console.log('点击');
                                notification.close();
                            };
                        } else {
                            Notification.requestPermission();
                            console.log('没有权限,用户拒绝:Notification');
                        }
                    })
                }
            }
        } else {
            console.log('不支持Notification');
        }
    }
}

// 重载批改函数，取消页面的confirm对话框
function pigai(back){
    $("#back").val(back);
    var a = "88286357,88286358,";
    $("#answerwqbid").val(a);
    var dengji = $("#dengji").val();
    var tmpScore = $("#tmpscore").val();
    tmpScore = tmpScore.replace(/\s+/g, "");
    $("#score").val(tmpScore);
    var score = $("#score").val();
    var fullScore = $("#fullScore").val();
    if(score.length == 0){
        alert("请输入分数。");
        return;
    }
    if(score < 0){
        alert("分数不能小于0。");
        return;
    }
    if(Number(score) > Number(fullScore)){
        alert("分数不能超过满分" +　fullScore);
        return;
    }
    if(isNaN(score)){
        alert("分数只能是数字！");
        return;
    }

    if(Number(score)==0){
        if(window.confirm("总分为0,确认要提交批阅结果吗？")){
            setCompoundSubjectQuesScore();
            setCompoundSubjectQuesComment();
            formSubmit();
        }else{
            return false;
        }
    }else{
        if(1){
            setCompoundSubjectQuesScore();
            setCompoundSubjectQuesComment();
            formSubmit();
        }
    }

}

(function score() {
    // 定义分数轮盘
    var score = [90,90,90,90,90,90,90,85,95,100]

    // 获取分数框
    var divA = document.getElementById("tmpscore");

    // 按轮盘概率填充分数
    divA.value=score[Math.floor(Math.random()*10)];

    // 超星的批改函数，延时自定义（最大值↓ 最小值↓，单位：毫秒）
    setTimeout(pigai, Math.random() * (3000) + 1000);
})();