
// ==UserScript==
// @name         可可英语刷单词助手
// @namespace    http://tampermonkey.net/
// @version      V1.0.2
// @description  适用于可可英语新网页版，自动设置刷单词数量，30分钟可刷5000单词
// @author       Boxsky
// @match        https://bdc.kekenet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kekenet.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496115/%E5%8F%AF%E5%8F%AF%E8%8B%B1%E8%AF%AD%E5%88%B7%E5%8D%95%E8%AF%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/496115/%E5%8F%AF%E5%8F%AF%E8%8B%B1%E8%AF%AD%E5%88%B7%E5%8D%95%E8%AF%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var div = document.createElement('div');

    var panDu = 0;
    var displayoption = 0;
    var Detapotion = 0;
    var Detapotioncount = 1;
    var Modecount = -1;
    var word = [15];
    var wordComment =[15]
    var audioData = [15]
    var optionString = [];
    var optionbutten;
    var optionData;
    var Detaoption1 = 0;
    var wordcount = 0;
    var Modecountend = 0;
    div.style.position = 'fixed';
    div.style.bottom = '10px';
    div.style.right = '10px';
    div.style.width = '200px';
    div.style.height = '200px';
    div.style.backgroundColor = '#f9f9f9';
    div.style.border = '1px solid #ccc';
    div.style.padding = '10px';
    div.style.zIndex = '10000';
    div.style.overflow = 'auto';
    var p = document.createElement('p');
    p.textContent = '显示设置';
    p.style.color = 'red';
    p.style.marginLeft = '10px';
    p.style.marginTop = '8px';

    var display = document.createElement('display');
    p.textContent = 'tmp';
    p.style.color = 'blue';
    p.style.marginLeft = '10px';
    p.style.marginTop = '8px';
    div.appendChild(p);
    var elementdata;
    var transferdataText;
    var button = document.createElement('button');
    button.style.marginLeft = '10px';
    button.style.marginTop = '10px';
    button.textContent = '测试数据按钮';
    var optionAnswer = 0;
    button.addEventListener('click', function() {
        optionAnswer = 1;
        var element1next1 = document.getElementsByClassName("word-btn-do")[0];
        if (element1next1) {
            element1next1.click();
        }
        var element1next2 = document.getElementsByClassName("res-btn-next")[0];
        if (element1next2) {
            element1next2.click();
        }
        console.log(word[0]);

    });
    div.appendChild(button);
    document.body.appendChild(div);
    var buttonDeta = document.createElement('button');
    buttonDeta.style.marginLeft = '10px';
    buttonDeta.style.marginTop = '13px';
    buttonDeta.textContent = '自动模式';
    div.appendChild(buttonDeta);
     buttonDeta.addEventListener('click', function() {
        if(Detapotioncount){
            Detaoption1 = 1;
            buttonDeta.textContent = '自动模式开启';
            Detapotioncount = 0;
        }else{
            Detaoption1 = 0;
            buttonDeta.textContent = '自动模式关闭';
            Detapotioncount = 1;
        }
    });
    var buttonDeta1 = document.createElement('button');
    buttonDeta1.style.marginLeft = '10px';
    buttonDeta1.style.marginTop = '20px';
    div.appendChild(buttonDeta1);
    // 创建一个新的 MutationObserver 对象
    var countB = 0;
    var countendNum = 0;
    var observer = new MutationObserver(function(mutations) {
        if(Modecountend == 1){
            setTimeout(function() {
                var element1next2 = document.getElementsByClassName("res-btn-next")[0];
                if (element1next2) {
                    element1next2.click();
                }
                Modecountend = 0;
            },2000);
        }
        //buttonDeta1.textContent = ""
        setTimeout(function() {
        var judgePage = document.querySelector("div[data-v-f24f413a].top-title");
        var judgePagetrans = judgePage.textContent;
        var judge = /单词预览/;
        var judgeresult = judge.test(judgePagetrans);
        if(judgeresult){
            for(var pushcount = 0 ; pushcount < 15 ; pushcount++){
                word.shift();
                wordComment.shift();
                audioData.shift();
            }

            Modecount = 5;
            p.textContent = "单词预览模式"

            setTimeout(function() {
                var elementComment = document.querySelectorAll('span[data-v-f24f413a]');
                elementComment.forEach(function(element){
                    var text = element.innerText;
                    var wordbiaoshou = /标熟/;
                    var result = wordbiaoshou.test(text);
                    if(result){
                        return;
                    }
                    text = text.replace(/[\n\s]/g, '');
                    wordComment.push(text);
                });
                var elementaudio = document.querySelectorAll('audio[data-v-f24f413a]');
                elementaudio.forEach(function(element){
                    var text = element.src;
                    audioData.push(text);
                });
                let elementWordtrans = document.querySelectorAll("b[data-v-f24f413a]");
                elementWordtrans.forEach(function(element){
                    var text = element.innerText;
                    console.log(text);
                    word.push(text);
                });
                if(wordcount == 1){
                    var element1next2 = document.getElementsByClassName("word-btn-do")[0];
                    if (element1next2) {
                        element1next2.click();
                    }
                    wordcount = 0;
                }else{
                    wordcount++;
                }


            }, 1000);
        }
        },1000);
        if(Modecount != 5){
            var Modeoption = document.querySelector("div[data-v-6ca8079b] .exam-top-left");
            var Modeoptiontran = Modeoption.textContent.substring(0, 4);
            var textcoun = Modeoption.textContent.substring(5, 7);
            var textcounall = Modeoption.textContent.substring(8, 10);
            if(textcoun === textcounall){
                Modecountend = 1;
            }
            var Mode1 = /看单词选/;
            var Mode2 = /根据例句/;
            var Mode3 = /听发音选/;
            var Mode4 = /看解释选/;
            var Mode5 = /补全单词/;
            var Mode6 = /下一关/;
            var result = Mode1.test(Modeoptiontran);
            if(result){p.textContent = "单词模式";Modecount = 0;};
            result = Mode2.test(Modeoptiontran);
            if(result){p.textContent = "例句模式";Modecount = 1;}
            result = Mode3.test(Modeoptiontran);
            if(result){p.textContent = "听音模式";Modecount = 2;}
            result = Mode4.test(Modeoptiontran);
            if(result){p.textContent = "解释模式";Modecount = 3;}
            result = Mode5.test(Modeoptiontran);
            if(result){p.textContent = "补全模式";
                       Modecount = 4;
                      }
        }
        console.log(Modecount);
        if(Detapotion){
           alert("模式"+Modecount);
        }
        if(optionString.length != 0){
            for(var i = 1; i < 5 ; i++){
                optionString.shift();
            }
        }
        var elementoption = document.querySelectorAll("div[data-v-6ca8079b].exam-option");
        elementoption.forEach(function(element) {
        var text = element.innerText;
        text = text.replace(/[\n\s]/g, '');
        optionString.push(text);
        });
        elementdata = document.querySelector("div[data-v-6ca8079b].exam-row.exam-question");
        if (elementdata) {
            transferdataText = elementdata.innerText;
            transferdataText = transferdataText.replace(/[\n\s]/g, '');
            button.textContent = transferdataText;
        }else{
            var elementT = document.querySelector("audio[data-v-6ca8079b]");
            var idData = elementT.id;
            var idtmp = idData.split('-');
            var number = idtmp[1];
            button.textContent = '听力题ID: ' + number;
        }
        if(Modecount == 1){
            for(var optionNum1 = 0 ; optionNum1 < 4 ; optionNum1++ ){
                for(var wordNum1 = 0 ; wordNum1 < 15 ; wordNum1++){
                    if(optionString[optionNum1] === word[wordNum1]){
                        var optionwrdtran1 = optionNum1 + 1;
                        optionbutten = optionwrdtran1;
                        console.log("1option" + optionwrdtran1);
                        if(Detaoption1){
                            var element1 = document.getElementsByClassName("exam-option")[optionwrdtran1 - 1];
                            element1.click();
                        }
                        break;
                    }
                }
            }
        setTimeout(function() {
                var element1next2 = document.getElementsByClassName("exam-next")[0];
                if (element1next2) {
                    element1next2.click();
                }
                Modecountend = 0;
            },2000);
        }
        if(Modecount == 3){
            console.log(transferdataText);
            for(var wordNum3 = 0 ; wordNum3 < 15 ; wordNum3++){
                if(transferdataText === wordComment[wordNum3]){
                    for(var optionNum3 = 0 ; optionNum3 < 4 ; optionNum3++){
                        if(optionString[optionNum3] === word[wordNum3]){
                            var optionwordtran3 = optionNum3 + 1;
                            console.log("0option = "+optionwordtran3);
                            if(Detaoption1){
                                var element3 = document.getElementsByClassName("exam-option")[optionwordtran3 - 1];
                                element3.click();
                            }
                            optionbutten = optionwordtran3;
                            break;
                        }
                    }
                }
            }
        }
        if(Modecount == 0){
            for(var wordNum0 = 0 ; wordNum0 < 15 ; wordNum0++){
                if(word[wordNum0] === transferdataText){
                    for(var optionNum0 = 0 ; optionNum0 < 4 ; optionNum0++){
                        if(optionString[optionNum0] === wordComment[wordNum0]){
                            var optionwordtran0 = optionNum0 + 1;
                            console.log("0option = "+optionwordtran0);
                            if(Detaoption1){
                                var element0 = document.getElementsByClassName("exam-option")[optionwordtran0 - 1];
                                element0.click();
                            }
                            optionbutten = optionwordtran0;
                            break;
                        }
                    }
                }
            }
        }
        if(Modecount == 2){
            var ExamString = document.querySelector("audio[data-v-6ca8079b]");
            var textString = ExamString.src;
            for(var id = 0; id < 15 ; id++){
                if(textString === audioData[id]){
                    optionData = id;
                    break;
                }
            }
            var count = 0;
            console.log("str");//wordComment
            for( var optionword = 0 ; optionword < 4 ; optionword++){
                if(wordComment[optionData] === optionString[optionword]){
                    var optionwordtran = optionword + 1;
                    console.log("2option = "+optionwordtran);
                    if(Detaoption1){
                        var element2 = document.getElementsByClassName("exam-option")[optionwordtran - 1];
                        element2.click();
                    }

                    optionbutten = optionwordtran;
                    break;
                }
            }
        }
        if(Modecount == 4){
            var elementB = document.querySelectorAll(".fill-space");
            elementB.forEach(function(element) {
            countB++;
            });
            var wordkeytmp = [];
            var wordexamNum;
            var prmword;
            for(wordexamNum = 0; wordexamNum < 15 ; wordexamNum++){
                if(transferdataText === wordComment[wordexamNum]){
                    console.log(word[wordexamNum]);
                    prmword = word[wordexamNum];
                }
            }
            var wordkeyData = document.querySelectorAll("div[data-v-6ca8079b] .exam-row.exam-question");
            setTimeout(function(){
            },1000);
            var countkey = 0;
            wordkeyData.forEach(function(element) {
                var text = element.innerText;
                if(countkey != 0){
                    wordkeytmp.push(text);
                }
                console.log(text);
                countkey++;
            });
            var wordSplicing = wordkeytmp.join("");
            var keykey = [];
            for(var keyword = 0; keyword < wordSplicing.length ; keyword++){
                if(wordSplicing[keyword] != prmword[keyword]){
                    keykey.push(prmword[keyword]);
                }
            }
            var optionkeyData = document.querySelectorAll("div[data-v-6ca8079b] .exam-key");
            var optionkeyDatarr = [];
            optionkeyData.forEach(function(element){
                var text = element.textContent;
                optionkeyDatarr.push(text);
            });
            var optionNum = 0;
            for(var optionkeyNum = 0 ; optionkeyNum < 9 ; optionkeyNum++){
                if(optionkeyDatarr[optionkeyNum] == keykey[optionNum] || optionkeyNum == 8){

                    if(optionkeyNum != 8){
                        var buttons = document.getElementsByClassName("exam-key")[optionkeyNum];
                        buttons.click();
                        optionNum++;
                    }else if(optionkeyNum == 8) {
                        buttons = document.getElementsByClassName("exam-key")[9];
                        buttons.click();
                    }

                }
            }
        }
        if(Detapotion){
            setTimeout(function() {
            displayoption++;
            if(displayoption == 2){
                alert(optionString);
                displayoption =0;
            }
            }, 1000);
        }
        Modecount = -1;
        console.log('end');

    });
    observer.observe(document, { childList: true, subtree: true });
})();
