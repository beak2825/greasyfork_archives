// ==UserScript==
// @name         （2023最新）问卷网破解答案自动填写并显示
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  破解问卷网考试答案，目前支持单选，多选，填空，有其它问题或者题型请进群反馈QQ交流群：1027881795
// @author       阿龙
// @include      https://www.wenjuan.ltd/*
// @include      https://www.wenjuan.com/*
// @icon         https://preview.qiantucdn.com/agency/dp/dp_thumbs/5266903/143966767/staff_1024.jpg!kuan320_webp
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@2.2.3/dist/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456714/%EF%BC%882023%E6%9C%80%E6%96%B0%EF%BC%89%E9%97%AE%E5%8D%B7%E7%BD%91%E7%A0%B4%E8%A7%A3%E7%AD%94%E6%A1%88%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%B9%B6%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/456714/%EF%BC%882023%E6%9C%80%E6%96%B0%EF%BC%89%E9%97%AE%E5%8D%B7%E7%BD%91%E7%A0%B4%E8%A7%A3%E7%AD%94%E6%A1%88%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%B9%B6%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==
var information = 0;
var anslist = [];
var no_answer = "";
let question_lists
var Id
var optionGroupList
var questionpageIdListname
var question
var question_type
var optionGroupListProcessed
var optionList
var alltheAnswers=[]
var topicAnswer
var totalnumber=0

function Radiojudgmentoptions(question) {
    var options=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","","","",""]
    for (var cc = 0; cc< question.length; cc++) {
        if(question[cc]==1){
            return options[cc];}
    }
}
//多选判断选项
function JudgingMultiplechoice(question) {
    var options=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","","","",""]
    var collection=[]
    for (var cc = 0; cc< question.length; cc++) {
        if(question[cc]==1){
            collection.push(options[cc]);}
    }
    return collection
}

(function () {
    let questionpageIdList=this.__INITIAL_STATE__.QUESTIONPAGE_DICT
    let questionpage=this.__INITIAL_STATE__.questionpageIdList
    for (var x = 0; x < questionpage.length; x++) {
        Id=questionpage[x]
        questionpageIdListname=questionpageIdList[Id]
        totalnumber+=questionpageIdListname.question_list.length
        for (var i = 0; i < questionpageIdListname.question_list.length; i++) {
            var num=questionpageIdListname.question_list.length
            var theTitle=totalnumber-num+i+1
            question=questionpageIdListname.question_list[i]
            question_type=question.question_type
            optionList=[]
            if(question_type==2){
                optionGroupListProcessed=question.optionGroupListProcessed[0]
                for (var c = 0; c < optionGroupListProcessed.option_list.length; c++) {
                    var option=optionGroupListProcessed.option_list[c].custom_attr.is_correct
                    if(option==1){
                        optionList.push(option)
                        answerParse(theTitle,c)//自动选择代码
                    }
                    else{
                        optionList.push(0)
                    }
                }
                topicAnswer=Radiojudgmentoptions(optionList)
                alltheAnswers.push(topicAnswer)
            }
            if(question_type==6){
                for (var p = 0; p <question.option_list.length; p++) {
                    var textarea=question.option_list[p].custom_attr.correct_answer
                    alltheAnswers.push(textarea)
                    textareaValue(theTitle,textarea)
                }
            }
            if(question_type==3){
                optionGroupListProcessed=question.optionGroupListProcessed[0]
                for (var d = 0; d < optionGroupListProcessed.option_list.length; d++) {
                    var duooption=optionGroupListProcessed.option_list[d].custom_attr.is_correct
                    if(duooption==1){
                        optionList.push(duooption)
                        answerParse(theTitle,d)//自动选择代码
                    }
                    else{
                        optionList.push(0)
                    }
                }
                topicAnswer=JudgingMultiplechoice(optionList)
                alltheAnswers.push(topicAnswer)
            }
        }
    }
})(this);
(function () {
    var area = document.createElement("div");
    $(area).attr("id", "area");
    document.body.appendChild(area);
    var menu = document.createElement("div");
    $(menu).attr("id", "menu");
    area.appendChild(menu);
    var ul1 = document.createElement("ul");
    $(ul1).attr("id", "myul");
    menu.appendChild(ul1);
    var ul2 = document.createElement("ul");
    $(ul2).attr("id", "review_box");
    menu.appendChild(ul2);
    var ondiv = document.createElement("div");
    $(ondiv).attr("id", "on");
    area.appendChild(ondiv);
    var p = document.createElement("p");
    $(p).attr("style", "");
    $(p).attr("id", "passage");
    p.innerHTML = "显示答案";
    ondiv.appendChild(p);
    var style = document.createElement("style");
    style.innerHTML =
        `        #area{
 position:fixed;
 z-index:999;
 width:160px;
 left:500px
 //height:5000px;
 top:2%;}
 #menu ul {
 list-style: none;
 }
 #menu {
 border:1px solid lightgreen;
 height: 500px;
 overflow: scroll;
 }
 #on{
 z-index:999;
 position: absolute;
 top: 2%;
 right: 12%;
 width: 30px;
 height: 30px;
 cursor: pointer;
 border-radius: 15px;
 //background-color: rgba(13, 143, 143, 0.2);
 }
 #area #on p{
 font-size:15px;
 text-align:center;
 margin-top:-6px;
 color:#01E290;
 }  `;

    document.head.appendChild(style);
})();
(function () {
    var cli_on = document.getElementById("on");
    var passage = document.getElementById("passage");
    var answers = document.getElementById("menu");
    answers.style.visibility = "hidden";
    cli_on.onclick = function () {
        if (passage.innerHTML == "收起答案") {
            passage.innerHTML = "显示答案";
            answers.style.visibility = "hidden";
        } else {
            passage.innerHTML = "收起答案";
            answers.style.visibility = "visible";
        }
    };

})();
/**实现拖动功能*/
function make_draggable(handle, container) {
    function get_css(ele, prop) {
        return parseInt(window.getComputedStyle(ele)[prop]);
    }

    let initX, initY,
        draggable = false,
        containerLeft = get_css(container, "left"),
        containerRight = get_css(container, "top");

    handle.addEventListener("mousedown", e => {
        draggable = true;
        initX = e.clientX;
        initY = e.clientY;
    }, false);

    document.addEventListener("mousemove", e => {
        if (draggable === true) {
            var nowX = e.clientX,
                nowY = e.clientY,
                disX = nowX - initX,
                disY = nowY - initY;
            container.style.left = containerLeft + disX + "px";
            container.style.top = containerRight + disY + "px";
        }
    });

    handle.addEventListener("mouseup", () => {
        draggable = false;
        containerLeft = get_css(container, "left");
        containerRight = get_css(container, "top");
    }, false);
}
(function () {
make_draggable(document.querySelector("#area"), document.querySelector("#area"));
var li = document.createElement("li");
$(li).attr("id", `annotationAnswer`);
li.innerHTML ="QQ交流群：1027881795</br>注:请自行删去的自动填写的填空题中的多余的空格</br>答案仅供参考"
menu.appendChild(li)
for (var p = 0; p< alltheAnswers.length; p++) {
    li = document.createElement("li");
    $(li).attr("id", `answer${p}`);
    li.innerHTML ="第"+(p+1)+"题"+alltheAnswers[p]
    menu.appendChild(li);}
})();
//单选多选选择
function answerParse(i,question) {
    var lists=document.querySelectorAll('.question-box')
    lists[i-1].querySelectorAll("span input")[question].click()
}
//填空
function textareaValue(number,newText){
    try{
        var lists=document.querySelectorAll('.question-box')
        var inputDom=lists[number-1].querySelector('textarea')
        inputDom.value = newText
        inputDom.dispatchEvent(new Event('input'))
        inputDom.dispatchEvent(new Event('click'))
        inputDom.dispatchEvent(new Event('focus'))
        inputDom.dispatchEvent(new Event('blur'))
    }
    catch(err){
        //console.log(err)
    }
}
