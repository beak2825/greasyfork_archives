// ==UserScript==
// @name         一键打分超星作业
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  添加几个按钮，点击一键批改作业
// @author       光影
// @match        https://mooc1-1.chaoxing.com/*
// @match        https://mooc2-ans.chaoxing.com/work/library/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434024/%E4%B8%80%E9%94%AE%E6%89%93%E5%88%86%E8%B6%85%E6%98%9F%E4%BD%9C%E4%B8%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/434024/%E4%B8%80%E9%94%AE%E6%89%93%E5%88%86%E8%B6%85%E6%98%9F%E4%BD%9C%E4%B8%9A.meta.js
// ==/UserScript==
var scores = [100,90,85,80,75,70,65,60,50];
var str = '';
function fillscore(i) {
    // 获取分数框
    var divB=document.getElementsByClassName("inputBranch")[0];
    var divA = document.getElementById("tmpscore");
    divA.value=scores[i];
    divB.value=scores[i];
    //定位提交下一份按钮 并点击
    var btn = document.getElementsByClassName("jb_btn_160")[0];
    btn.click();
}
function dahui(str){
    var btndh = document.querySelector("body > div.fanyaMarkingBootm > div > a.btnBlue.btn_92.fr.fs14.marginLeft30");
    var btndhText = document.getElementById("textCon");
    btndh.click()
    btndhText.value=str
    var dhsumbit = document.querySelector("#back_maskDiv > div > div.popBottom > a.jb_btn.jb_btn_92.fr.fs14").click();
    dhsumbit.click();


}
(function() {
    var body = document.body;
    for (let i=0;i<scores.length;i++)
    {
        var btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", String(scores[i]));
        btn.onclick=function(){
            fillscore(i);
        };
        btn.style.cssText = "height:60px; width:100px; z-index:1000; position:fixed; right:120px;";
        btn.style.bottom=String(80+60*(scores.length-i))+"px";
        btn.style.border="1px solid black"
        body.appendChild(btn);
    }
        btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "作业不匹配");
        btn.onclick=function(){
            str = "作业不匹配"
            dahui(str);
        };
        btn.style.cssText = "height:60px; width:100px; z-index:1000; position:fixed; right:10px;";
        btn.style.top="140px";
        btn.style.border="1px solid black"
        body.appendChild(btn);
        btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "没有成功截图");
        btn.onclick=function(){
            str = "没有运行成功截图"
            dahui(str);
        };
        btn.style.cssText = "height:60px; width:100px; z-index:1000; position:fixed; right:10px;";
        btn.style.top="200px";
        btn.style.border="1px solid black"
        body.appendChild(btn);
})();