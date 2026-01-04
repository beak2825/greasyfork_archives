// ==UserScript==
// @name         青岛农业大学自动评教脚本
// @namespace    https://github.com/CodingDogzxg
// @version      0.3.7 beta 2023/6/12 built
// @description  青岛农业大学 QAU 期末评教 自动评教
// @author       QAUCodingDog_zxg
// @include      http://jwglxt.qau.edu.cn/jsxsd/xspj/xspj_find.do?*
// @include      http://jwglxt.qau.edu.cn/jsxsd/xspj/xspj_list.do?*
// @include      http://jwglxt.qau.edu.cn/jsxsd/xspj/xspj_edit.do?*
// @grant        GM_addStyle
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/418987/%E9%9D%92%E5%B2%9B%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/418987/%E9%9D%92%E5%B2%9B%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
 
 
// 变量
var url = location.pathname,
mainPage = "http://jwglxt.qau.edu.cn/jsxsd/xspj/xspj_find.do",
evaluationInfoPage = "http://jwglxt.qau.edu.cn/jsxsd/xspj/xspj_list.do",
evaluationMainPage = "http://jwglxt.qau.edu.cn/jsxsd/xspj/xspj_edit.do";
 
// 绘制窗口
if (mainPage.indexOf(url) != -1) {
    // 主题
    var style_btn = 'float:right;background:rgba(228,228,228,0.4); cursor:pointer; margin:0px 1px 0px 0px; padding:0px 3px;color:black; border:2px ridge black;border:2px groove black;';
    var style_win_top = 'z-index:998; padding:6px 10px 8px 15px;background-color:lightGrey;position:fixed;left:5px;top:5px;border:1px solid grey; ';
    var style_win_buttom = 'z-index:998; padding:6px 10px 8px 15px;background-color:lightGrey;position:fixed;right:5px;bottom:5px;border:1px solid grey;  ';
 
    // 开始绘制
    var newDiv = document.createElement("div");
    newDiv.id = "controlWindow";
    newDiv.align = "left";
    document.body.appendChild(newDiv);
    GM_addStyle("#controlWindow{" + style_win_top + " }");
    var table = document.createElement("table");
    newDiv.appendChild(table);
    var th = document.createElement("th");
    th.id = "headTd";
    var thDiv = document.createElement("span");
    thDiv.id = "thDiv";
    thDiv.innerHTML = "QAU Evaluator";
    GM_addStyle("#thDiv{color:red;font-size: 12pt;}");
    th.appendChild(thDiv);
    table.appendChild(th);
    var tr = document.createElement("tr");
    table.appendChild(tr);
    var tr2= document.createElement("tr");
    table.appendChild(tr2);
    var td = document.createElement("td");
    td.id = "footTd";
    var td2 = document.createElement("td");
    td2.id = "footTd2";
    tr.appendChild(td);
    tr2.appendChild(td2);
    var close = document.createElement("span");
    close.id = "close";
    close.innerHTML = "关闭弹窗";
    close.addEventListener("click", function () {document.body.removeChild(document.getElementById("controlWindow"));}, false);
    td.appendChild(close);
    GM_addStyle("#close{" + style_btn + "}");
    var score = document.createElement("span");
    score.id = "score";
    score.innerHTML = "开始评教";
    score.addEventListener("click", StartEvaluate);
    td.appendChild(score);
    GM_addStyle("#score{" + style_btn + "}");
    var star = document.createElement("span");
    star.id = "star";
    star.innerHTML = "联系作者";
    star.addEventListener("click", function () {window.open("mailto:codingdogzxg@gmail.com", "_blank");});
    td2.appendChild(star);
    GM_addStyle("#star{" + style_btn + "}");
    var open = document.createElement("span");
    open.id = "open";
    open.innerHTML = "项目地址";
    open.addEventListener("click", function () {window.open("https://github.com/CodingDogzxg/QAUAutoEvaluater", "_blank");});
    td2.appendChild(open);
    GM_addStyle("#open{" + style_btn + "}");
}
 
function StartEvaluate() {
    // 评教页面第一页 显示课程分类
    var tableBox = document.getElementsByClassName("Nsb_r_list Nsb_table");
    var tableList = tableBox[0].getElementsByTagName("a");
 
    // window.open() 非用户发出会被浏览器阻挡 延时则不会
    // setTimeout(window.open("http://www.baidu.com", "_blank"), 500);
 
    var pageList = [];
    for(var i = 0;i < tableList.length;i++){
        pageList.push(tableList[i].getAttribute("href"));
    }
    for(var j = 0; j < pageList.length; j++) {
        window.open(pageList[j], "_blank");
    }
}
 
// 评教页面第二页 显示老师
if (evaluationInfoPage.indexOf(url) != -1) {
    console.log(1);
    var teacherTableBox = document.getElementsByClassName("Nsb_r_list Nsb_table");
    var teacherTableList = teacherTableBox[0].getElementsByTagName("a");
    // /\'(.*)\'/.exec(c)[0].slice(1, -1)
 
    var teacherPageList = [];
    for(var t_i=0;t_i<teacherTableList.length;t_i++){
        teacherPageList.push(/\'(.*)\'/.exec(teacherTableList[t_i].getAttribute("href"))[0].slice(1, -11));
    }
    // console.log(teacherPageList[0]);
    for(var t_j = 0; t_j < teacherPageList.length; t_j++) {
        window.open(teacherPageList[t_j], "_blank");
    }
}
 
// 评教页面第三页 等级判断 保存按钮
if (evaluationMainPage.indexOf(url) != -1) {
    var allTable = document.getElementById("table1").getElementsByTagName("tr");
    var allTableLen = allTable.length;
    for(var k = 1; k < allTableLen; k++){
        if(k != allTableLen - 1){
            allTable[k].getElementsByTagName("td")[1].getElementsByTagName("input")[0].setAttribute("checked", "checked");
        }
        else{
            allTable[k].getElementsByTagName("td")[1].getElementsByTagName("input")[2].setAttribute("checked", "checked");
        }
    }
    var saveButton = document.getElementById("bc");
    saveButton.click();
}