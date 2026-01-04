// ==UserScript==
// @name         UESTC Auto Evaluate
// @namespace    http://www.tinywhite.work/
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @version      1.0
// @description  Try to save your time to prepare for exams!
// @author       smlW
// @match        *://eams.uestc.edu.cn/eams/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/406190/UESTC%20Auto%20Evaluate.user.js
// @updateURL https://update.greasyfork.org/scripts/406190/UESTC%20Auto%20Evaluate.meta.js
// ==/UserScript==
var debug = 1;
var words = new Array("老师授课有条理，有重点，对同学既热情又严格",
                      "老师对待教学认真负责，语言生动，条理清晰，举例充分恰当，对待学生严格要求，能够鼓励学生踊跃发言，课堂气氛比较积极热烈。",
                      "老师教学认真，课堂效率高，授课内容详细，我们学生大部分都能跟着老师思路学习，气氛活跃，整节课学下来有收获、欣喜，使人对此门课程兴趣浓厚。",
                      "老师上课诙谐有趣，他善于用凝练的语言将复杂难于理解的过程公式清晰、明确的表达出来。讲课内容紧凑、丰富，并附有大量例题和练习题，十分有利于同学们在较短时间内掌握课堂内容。",
                      "老师教学的另一个特点师风趣，它能用日常生活中的简单例子来解释说明课程中的一些专有名词和概念，使课堂气氛活跃课程简单易学。",
                      "课堂气氛也很活跃，老师在课程深度上也做了较好的拓展，使学生对所学内容有更深了解，并且，授课内容所选择的角度，即切入点新颖，很有新意，能充分吸引学生的注意力，符合学生的学习兴趣.师生间有较好的互动，营造了良好的课堂氛围",
                      "教师通过对文章的独到深入的讲解，达到了很好的教学效果，知识系统深入，并能结合多种教学手段，使学生对知识的掌握更深刻。教学内容重点突出，教学目的十分明确",
                      "老师授课的方式非常适合我们，他根据本课程知识结构的特点，重点突出，层次分明。理论和实际相结合，通过例题使知识更条理化",
                      "课堂内容充实，简单明了，使学生能够轻轻松松掌握知识");
                      //可按照格式修改、添加评语
(function() {
    'use strict';
    $('body').append('<div class="bottom"><input type="button" id="fill" value="点我评价"></div>');
    document.getElementById ("fill").addEventListener (
        "click", fill, false
    );
})();

function fill(){
    if(document.querySelectorAll("input[id^='star']").length) fillStars();
    if(document.querySelectorAll("input[index='0']").length) fillRadio();
    if(document.getElementsByName("evaIndex").length) fillMulti();
    if(document.getElementById("evaText") != null) fillRandomComment();
    if(debug){
        console.log("stars = " + document.querySelectorAll("input[id^='star']").length);
        console.log("noq = " + document.querySelectorAll("input[index='0']").length);
        console.log("noc = " + document.getElementsByName("evaIndex").length);
    }
}

function fillRandomComment(){
    var random = 0;
    do{
        random = Math.floor((Math.random() * (words.length)));
    }while (random == words.length);
    var comment = words[random];
    document.getElementById("evaText").value = comment;
    if(debug){
        console.log("word.length = " + words.length);
        console.log(comment);
        console.log("random = " + random);
    }
}

function fillStars(){
    var length = document.querySelectorAll("input[id^='star']").length;
    for(var i=0;i<length;i++){
        document.querySelectorAll("input[id^='star']")[i].value = 4;
        for(var j=0;j<4;j++){
            document.querySelectorAll("td[id^=starTd]")[i].getElementsByTagName("li")[j].setAttribute("class","light");
        }
    }
    confirm("Tips(必读):\n 1.默认值为4星，总评五星占比须达到30%~50%，，请手动修改。\n！！2.点完按钮后，课程已经全部评价为4星，暂存后能看到结果。第一次点亮的结果仅供标记使用，即便一颗没亮或者鼠标滑过熄灭了也没关系。");
    if(debug){
        console.log("rows = " + length);
    }
}

function fillRadio(){
    var length = document.querySelectorAll("input[index='0']").length;
    for(var i=0;i<length;i++){
        document.querySelectorAll("input[index='0']")[i].checked = 1;
    }
    document.getElementById("sub").click();
}

function fillMulti(){
    var length = document.getElementsByName("evaIndex").length;
    for(var i=0;i<length;i++){
        document.getElementsByName("evaIndex")[i].checked = 1;
    }
}

//按钮样式
GM_addStyle (`
    #fill {
    position:fixed;
    bottom:50px;
    right:15px;
    width:90px;
    height:50px;
    opacity: 0.75;
    background: "";
    color:"";
    text-align: center;
    line-height: 50px;
    cursor: pointer;}
`);
