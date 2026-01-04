// ==UserScript==
// @name         清除雨课堂做题痕迹
// @namespace    http://tampermonkey.net/
// @version      5.0.0
// @description  清除雨课堂试卷做题痕迹（仅UI变更，不涉及雨课堂后台数据），便于复习。支持黑暗模式、日光模式（需更新到V3.0.0.RELEASE及以上版本）。支持吃菇子的“手气不错”模式（需更新到V3.1.0.RELEASE及以上版本）。支持设置答题正误并导出错题（需要更新到V4.0.0版本及以上）
// @author       冰镇杨梅瑞纳冰YYDS
// @match        https://examination.xuetangx.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xuetangx.com
// @grant        none
// @license     Mozilla Public License 2.0
// @downloadURL https://update.greasyfork.org/scripts/446101/%E6%B8%85%E9%99%A4%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%81%9A%E9%A2%98%E7%97%95%E8%BF%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/446101/%E6%B8%85%E9%99%A4%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%81%9A%E9%A2%98%E7%97%95%E8%BF%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var checkDiv = document.createElement("div");
    var rightAnswer;
    var questions;
    var congrasDivs=document.getElementsByClassName("congras");
    var button;
    var isClicked = 0;
    checkDiv.setAttribute("id","test");
    document.body.appendChild(checkDiv);
    var testBlock = document.getElementById("test");
    var folded = 0;
    testBlock.style.height="auto";
    testBlock.style.width="auto";
    testBlock.style.position="fixed";
    testBlock.style.top=0;
    testBlock.style.right=0;
    testBlock.style.zindex=1000;
    testBlock.innerHTML+='<div style="margin:60px;margin-right:10px; z-index:1000; text-align:center;width:150px;" ><button id="start" onClick="ErasAll()" style=\"width:100%; background-color:#4286F3; padding:15px; border-radius:5px;border:0;color:white\">清除答案与水印</button><br><div id="functions"><button id="nightmode" onClick="Night()" style=\"background-color:#002361; width:45%; padding:15px; border-radius:5px;border:0;color:white;margin-top:10px;\">🌙</button><button id="daymode" onClick="Day()" style=\"background-color:#fcd5c0; padding:15px; width:45%;border-radius:5px;border:0;color:white;margin-top:10px;margin-left:10%;\">🌞</button><br><button id="start" onClick="ImFeelingLucky()" width="40px" style=\"background-color:#4286F3; padding:15px; border-radius:5px;border:0;color:white;margin-top:10px;width:100%\">🦚 手气不错</button><br><button id="start" onClick="SaveError()" style=\"background-color:#4286F3; width:100%;padding:15px; margin-top:10px;border-radius:5px;border:0;color:white\">📔只保留错题</button><button id="start" style=\"background-color:#4286F3; width:100%;padding:15px; margin-top:10px;border-radius:5px;border:0;color:white\"><p><a href="https://greasyfork.org/zh-CN/scripts/446101-%E6%B8%85%E9%99%A4%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%81%9A%E9%A2%98%E7%97%95%E8%BF%B9" style="text-decoration: none;color:white">⏫检查更新</a></p></button></div><button id="foldbtn" onClick="Folding()" width="40px" style=\"background-color:#4286F3; padding:15px; border-radius:5px;border:0;color:white;margin-top:10px;width:100%\">⬆️折叠</button></div>'
    // Your code here...
    window.Folding = function(){
        var functionarea= document.getElementById("functions");
        var foldingbtn= document.getElementById("foldbtn");
        if(folded==0){
            //未折叠
            functionarea.style.display="none";
            foldingbtn.innerHTML="⬇️展开";
            folded=1;
        }else{
            functionarea.style.display="block";
            foldingbtn.innerHTML="⬆️折叠";
            folded=0;
        }
    }
    // 保存错题
    window.SaveError = function(){
        var allCorrects = document.getElementsByClassName("correct");

        for(var i=0;i<congrasDivs.length;i++){
            allCorrects[i].parentNode.parentNode.style.display="none";
        }
    }



    window.Night = function(){
        var mainbackground = document.getElementsByClassName("exam-main");
        mainbackground[0].style.backgroundColor="black";
        mainbackground[0].style.backgroundColor="black";
        mainbackground[0].style.transitionDuration="1s";
        mainbackground = document.getElementsByClassName("header-content");
        mainbackground[0].style.backgroundColor="black";
        mainbackground[0].style.transitionDuration="1s";
        mainbackground = document.getElementsByClassName("exam-aside");
        mainbackground[0].style.backgroundColor="black";
        mainbackground[0].style.transitionDuration="1s";
        mainbackground = document.getElementsByClassName("exam-main--body");
        mainbackground[0].style.backgroundColor="#0c0d0d";
        mainbackground[0].style.color="#d4d4d4";
        mainbackground[0].style.transitionDuration="1s";
        mainbackground = document.getElementsByClassName("item-footer");

        for(let i=0;i<mainbackground.length;i++){
            mainbackground[i].style.backgroundColor="black";
            mainbackground[i].style.color="#d4d4d4";
            mainbackground[i].style.transitionDuration="1s";

        }

        mainbackground = document.getElementsByTagName("p");
        for(let i=0;i<mainbackground.length;i++){
            mainbackground[i].style.color="#d4d4d4";
            mainbackground[0].style.transitionDuration="1s";

        }
        var bala = document.getElementsByClassName("radioInput");
        for(let i=0;i<bala.length;i++){
            bala[i].style.backgroundColor="black";
            bala[i].style.color="#d4d4d4";
            bala[i].style.transitionDuration="1s";
        }
    }

    window.Day = function(){
        var mainbackground = document.getElementsByClassName("exam-main");
        mainbackground[0].style.backgroundColor="#f7f7f7";
        mainbackground = document.getElementsByClassName("header-content");
        mainbackground[0].style.backgroundColor="white";
        mainbackground = document.getElementsByClassName("exam-aside");
        mainbackground[0].style.backgroundColor="white";
        mainbackground = document.getElementsByClassName("exam-main--body");
        mainbackground[0].style.backgroundColor="white";
        mainbackground[0].style.color="black";
        mainbackground = document.getElementsByTagName("p");
        for(let i=0;i<mainbackground.length;i++){
            mainbackground[i].style.color="black";

        }
        mainbackground = document.getElementsByClassName("item-footer");

        for(let i=0;i<mainbackground.length;i++){
            mainbackground[i].style.backgroundColor="#f9f9f9";
            mainbackground[i].style.color="black";
            mainbackground[i].style.transitionDuration="1s";

        }
        var bala = document.getElementsByClassName("radioInput");
        for(let i=0;i<bala.length;i++){
            bala[i].style.backgroundColor="white";
            bala[i].style.color="#d4d4d4";
            bala[i].style.transitionDuration="1s";
        }


    }

    window.RandomColor=function(){
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        return "rgb(" + r + "," + g + "," + b + ")";
    };

    window.ImFeelingLucky=function(){
        var mainbackground = document.getElementsByClassName("exam-main");
        mainbackground[0].style.backgroundColor=RandomColor();
        mainbackground[0].style.backgroundColor=RandomColor();
        mainbackground[0].style.transitionDuration="1s";
        mainbackground = document.getElementsByClassName("header-content");
        mainbackground[0].style.backgroundColor=RandomColor();
        mainbackground[0].style.transitionDuration="1s";
        mainbackground = document.getElementsByClassName("exam-aside");
        mainbackground[0].style.backgroundColor=RandomColor();
        mainbackground[0].style.transitionDuration="1s";
        mainbackground = document.getElementsByClassName("exam-main--body");
        mainbackground[0].style.backgroundColor=RandomColor();
        mainbackground[0].style.color=RandomColor();
        mainbackground[0].style.transitionDuration="1s";
        mainbackground = document.getElementsByClassName("item-footer");
        let theColor = RandomColor();
        let theColor2 = RandomColor();
        for(let i=0;i<mainbackground.length;i++){
            mainbackground[i].style.backgroundColor=theColor;
            mainbackground[i].style.color=theColor2;
            mainbackground[i].style.transitionDuration="1s";

        }

        mainbackground = document.getElementsByTagName("p");
        for(let i=0;i<mainbackground.length;i++){
            mainbackground[i].style.color=theColor2;
            mainbackground[0].style.transitionDuration="1s";

        }
        var bala = document.getElementsByClassName("radioInput");
        for(let i=0;i<bala.length;i++){
            bala[i].style.backgroundColor=theColor;
            bala[i].style.color=theColor2;
            bala[i].style.transitionDuration="1s";
        }
    }



    window.ErasAll = function(){
        isClicked++;
        //设置Css
        let style = document.createElement('style')
        style.type = 'text/css';
        style.innerHTML = '.right{padding:15px; border-radius:5px;border:0;color:white;margin-left:10px;}';

        document.querySelector('head').appendChild(style)
        //删除水印
        var testBody = document.getElementsByClassName("exam-main--content");
        var testChild = testBody[0].childNodes;
        for(i=0; i<testChild.length;i++){
            if(testChild[i].getAttribute("class")!="subject-item"){
                testBody[0].removeChild(testChild[i]);
            }
        }
        var erasAllBtn = document.getElementById("start");
        if(isClicked>1){
            // 如果点击次数超过一次，则不执行任何操作
            return;
        }
        erasAllBtn.innerHTML="水印消失👹";
        var i,j;
        // 删除所有蓝色选项按钮
        var sideBar = document.getElementsByClassName('exam-aside');
        sideBar[0].style.transitionDuration="1s";
        sideBar[0].style.display="none";
        var headerbar = document.getElementsByClassName("header");
        headerbar[0].style.display="none";
        var isChecked = document.getElementsByClassName('el-radio');
        for(let i=0;i<isChecked.length;i++){
            isChecked[i].className="el-radio is-disabled";
            isChecked[i].style.transitionDuration="1s";
        }

        //添加笔记
         var itemBodys = document.getElementsByClassName("item-body");
         for(i=0;i<itemBodys.length;i++){
             itemBodys[i].innerHTML+='<div class="addNotes" style="display:none;"><textarea rows="5" cols="40" class="notes" placeholder="输入笔记" style="width:100%;margin-top:20px;padding:20px;"></textarea></div>';
         }

        //隐藏所有正确答案
        rightAnswer = document.getElementsByClassName("item-footer");
        for(let g=0;g<rightAnswer.length;g++){
            rightAnswer[g].style.display="none";
        }
        //新增显示答案
        var questions = document.getElementsByClassName("item-body");
        var functionsBar = document.getElementsByClassName("functionbar");
        var thisone;
        var questionChilds;

        for(i=0;i<questions[i].length; i++){
            questionChilds=questions[i].childNodes;
            for(j=0;j<questionChilds.length;j++){
                if(questionChilds[j].getAttribute("class")=="functionbar"){
                    questions[i].removeChild(questionChilds[j]);
                }
            }
        }

        for(let t=0;t<questions.length;t++){
            var num = t;
            questions[t].innerHTML+='<div class="functionbar>"><button id="'+t+'" class="ShowAnswerBtn" style="background-color: #4286F3; padding:15px; border-radius:5px;border:0;color:white" onClick="ShowAnswer('+t+')"><p>显示答案</p></button><a id="num" style="display:none;">'+num+'</a><button class="right" style="background-color: #83e939; " onClick="Result('+t+',1)"><p>✔️</p></button><button class="right" style="background-color: #fc9696;" onClick="Result('+t+',2)"><p>❌</p></button><button class="right" style="background-color: #f6a76b;" onClick="Result('+t+',3)"><p>⭐</p></button><button class="right" style="background-color: #d5a6bd;" onClick="Result('+t+',4)"><p>❓</p></button><button class="right" style="background-color: #6d9eeb;" onClick="Result('+t+',5)"><p>📒笔记</p></button></div>';
            questions[t].parentNode.parentNode.innerHTML+='<div class="congras" style="display:none"><a style="font-size:200%;">🎉</a><a>答对啦，已隐藏该问题。<br></a><button onClick="RowBack('+t+')" style="background-color: #4286F3; padding:15px; border-radius:5px;border:0;color:white; ">我点错啦😳</button></div>';
        }



        var myTextAnswer = document.getElementsByClassName("subject-answer");
        for(i=0;i<myTextAnswer.length;i++){
            myTextAnswer[i].innerHTML="🦖你的答案已被脚本吃掉了";
        }
        for(j=0;j<50;j++){
            //删除所有的标记（多删几次）
            var rightAnswerMark = document.getElementsByClassName("dot");
            for(i=0;i<rightAnswerMark.length;i++){
                let dotParent = rightAnswerMark[i].parentNode;
                dotParent.removeChild(rightAnswerMark[i]);
            }
        }
    }
    window.ShowAnswer=function(num){
        rightAnswer[num].style.display="block";
        var thebutton = document.getElementsByClassName('ShowAnswerBtn');
        var foldedAnswer = document.getElementsByClassName('item-footer--body');
        for(var i=0;i<foldedAnswer.length;i++){
            foldedAnswer[i].style.display="block";
        }
        thebutton[num].style.display="none";
    }



    var isShowNotes=0;
    window.Result = function(num,type){

        //var rightbtns = document.getElementsByClassName('right');
        questions = document.getElementsByClassName("result_item");
        let questionstitle = document.getElementsByClassName("item-type");
        let parent = document.getElementsByClassName("subject-item");
        var html;
        if(type==1){
            questions[num].style.display="none";
            questions[num].style.transitionDuration="1s";
            let thecount = num+1;

            congrasDivs[num].innerHTML+='<a class="correct"></a>';
            var statusid = document.getElementById("correct");

            congrasDivs[num].style.display="block";
            questions[num].style.transitionDuration="1s";
            questions[num].parentNode.transitionDuration="1s";
            questions[num].style.backgroundColor="";
            questions[num].parentNode.style.backgroundColor="";
        }else if(type==2){
            var htmforerror = questionstitle[num].innerHTML;
            questionstitle[num].innerHTML='<a style="background-color:white;padding:5px;border-radius:20px;height:10px;width:10px;">❌</a>'+htmforerror;
            questionstitle[num].style.transitionDuration="1s";
            questionstitle[num].parentNode.transitionDuration="1s";
            questionstitle[num].style.backgroundColor="#ffb6dc";
            questionstitle[num].style.color="black";
        }else if(type==3){
            html = questionstitle[num].innerHTML;
            questionstitle[num].innerHTML='<a style="background-color:white;padding:5px;border-radius:20px;height:10px;width:10px;">⭐</a>'+html;
            questionstitle[num].style.transitionDuration="1s";
            questionstitle[num].parentNode.transitionDuration="1s";
            questionstitle[num].style.backgroundColor="#fff500";
            questionstitle[num].style.color="black";
        }else if(type ==4){
            html = questionstitle[num].innerHTML;
            questionstitle[num].innerHTML='<a style="background-color:white;padding:5px;border-radius:20px;height:10px;width:10px;">❓</a>'+html;
            questionstitle[num].style.transitionDuration="1s";
            questionstitle[num].parentNode.transitionDuration="1s";
            questionstitle[num].style.backgroundColor="#d5a6bd";
            questionstitle[num].style.color="black";
        }else if(type ==5){
            var noteAreas = document.getElementsByClassName("addNotes");
            noteAreas[num].style.display="block";
        }
    }
    // “我点错啦”按钮
    window.RowBack=function(num){
        questions[num].style.display="block";
        congrasDivs[num].style.display="none";
        var childs = congrasDivs[num].childNodes;
        congrasDivs[num].removeChild(childs[3]);

    }

})();