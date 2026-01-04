// ==UserScript==
// @name         手动批改超星作业
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  添加几个按钮，点击自动批改作业
// @author       zgggy
// @match        https://mooc1-1.chaoxing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416468/%E6%89%8B%E5%8A%A8%E6%89%B9%E6%94%B9%E8%B6%85%E6%98%9F%E4%BD%9C%E4%B8%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/416468/%E6%89%8B%E5%8A%A8%E6%89%B9%E6%94%B9%E8%B6%85%E6%98%9F%E4%BD%9C%E4%B8%9A.meta.js
// ==/UserScript==

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

var scores = [95,90,85,80,75,70,65,60,50];
var pingyus = [
    "课程论文排版符合规范，语言流畅，分析深入，按照论文的要求，很好的完成了任务。",
    "课程论文排版符合规范，语言流畅，分析深入，按照论文的要求，很好的完成了任务。",
    "课程论文排版符合规范，语言流畅，分析较深入，按照论文的要求，较好的完成任务。",
    "课程论文排版符合规范，语言流畅，分析较深入，按照论文的要求，较好的完成任务。",
    "课程论文排版符合规范，语言比较流畅，有一定的分析。按照论文的要求，完成了任务。",
    "课程论文排版符合规范，语言比较流畅，有一定的分析。按照论文的要求，完成了任务。",
    "课程论文排版比较符合规范，语言比较流畅，按照论文的要求，基本完成了任务。",
    "课程论文排版比较符合规范，语言比较流畅，按照论文的要求，基本完成了任务。",
    "课程论文排版不规范，语言不流畅，未完成课程任务。"
];

function fillscore(i) {
    // 评语
    var pingyu = document.getElementById("ueditor_1").contentWindow.document.getElementsByTagName("body")[0];
    var p = document.getElementById("ueditor_1").contentWindow.document.getElementsByTagName("p")[0];

    // 不写评语就把下一行注释掉！！！！！！！！！！
    p.innerHTML=String(pingyus[i]); // 写评语

    // 获取分数框
    var divA = document.getElementById("tmpscore");

    // 按轮盘概率填充分数
    divA.value=scores[i];

    // 超星的批改函数，写评语的话，目前只能手动点提交，不能自动跳转！！！！！！！！
    //pigai(0);
}

window.onload = function() {
    var e=document.getElementById("edui1").parentNode;
    e.style.display="block";
};

(function() {
    var body = document.body;
    for (let i=0;i<scores.length;i++)
    {
        var btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", String(scores[i]));
        btn.onclick=function(){
            fillscore(i)
            document.getElementById("ueditor_1").contentWindow.document.getElementsByTagName("body")[0].focus();
        };
        btn.style.cssText = "height:60px; width:100px; z-index:1000; position:fixed; right:120px;";
        btn.style.bottom=String(80+60*(scores.length-i))+"px";
        body.appendChild(btn);
    }
})();