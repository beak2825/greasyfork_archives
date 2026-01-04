// ==UserScript==
// @name         UCAS auto evaluate
// @namespace    https://github.com/sun-jiao
// @version      3.5
// @description  在中国科学院大学评教系统中自动选中“非常符合/非常满意”，并将文本框最小字数改为1个字。
// @author       Sun Jiao
// @match        *://jwxk.ucas.ac.cn/evaluate/*
// @grant        none
// @license     description: CC BY-SA 4.0; code: GPL.
// @downloadURL https://update.greasyfork.org/scripts/393618/UCAS%20auto%20evaluate.user.js
// @updateURL https://update.greasyfork.org/scripts/393618/UCAS%20auto%20evaluate.meta.js
// ==/UserScript==

(function(){
    'use strict';

    function choose(name){
        var radio;
        radio = document.getElementsByName(name);
        if(radio.length > 0){
            radio[0].checked = 1;
        }
    };

    function setlength(name){
        var text;
        text = document.getElementsByName(name);
        if(text.length > 0){
            text[0].setAttribute("minlength","1");
        }
    };

    function autofill(name, string){
        var text;
        text = document.getElementsByName(name);
        if(text.length > 0){
            text[0].value = string;
        }
    };

    var i;

    for (i = 2; i <= 159; i++) {
        choose("item_" + i.toString());
    }

    choose("radio_19");
    choose("radio_102");

    var multi = document.getElementsByName("item_25");
    if(multi.length > 0){
        for (i = 1; i <= 3; i++) {
            multi[i].checked = 1;
        }
    }

    for (i = 14; i <= 18; i++) {
        setlength("item_" + i.toString());
    }

    setlength("item_43");
    setlength("item_44");

    for (i = 97; i <= 101; i++) {
        setlength("item_" + i.toString());
    }

    setlength("item_145");
    setlength("item_146");

    //为避免不必要的麻烦，请您务必修改以下自动评价文本。
    //前五个为课程评价，后两个为教师评价。
    //教师评价的自动填充可能会失效，原因未知。
    //非计算机相关专业的同学，请注意保留英文双引号！！！

    var strings = ["1.这门课程我最喜欢什么？",
                   "2.我认为本课程应从哪些方面需要进一步改进和提高？",
                   "3.我平均每周在这门课程上花费多少小时？",
                   "4.在参与这门课之前，我对这个学科领域兴趣如何",
                   "5.我对该课程的课堂参与度（包括出勤、回答问题等）",
                   "这位老师的教学，你最喜欢什么？",
                   "您对老师有哪些意见和建议？"]

    for (i = 0; i <= 4; i++) {
        autofill("item_" + (i + 14).toString(), strings[i]);
    }

    autofill("item_43", strings[5]);
    autofill("item_44", strings[6]);

    for (i = 0; i <= 4; i++) {
        autofill("item_" + (i + 97).toString(), strings[i]);
    }

    autofill("item_145", strings[5]);
    autofill("item_146", strings[6]);


})();
