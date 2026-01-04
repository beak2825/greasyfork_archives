// ==UserScript==
// @name         山东大学（威海）新生入馆测试自动答题助手
// @name:en      SduwLibExamHelper

// @namespace    SduwLibExamHelper

// @version      1.2
// @author       bz2021

// @license MIT

// @description     One key to complete the study and one key to complete the examination
// @description:en  

// @require      https://code.jquery.com/jquery-1.12.4.min.js

// @match        http://202.194.40.185:8001/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449050/%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%EF%BC%88%E5%A8%81%E6%B5%B7%EF%BC%89%E6%96%B0%E7%94%9F%E5%85%A5%E9%A6%86%E6%B5%8B%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/449050/%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%EF%BC%88%E5%A8%81%E6%B5%B7%EF%BC%89%E6%96%B0%E7%94%9F%E5%85%A5%E9%A6%86%E6%B5%8B%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

var delaytime = 300;

var Qdata = ["R", "R", "R", "R", "R", "R", "R", "AC", "B", "B", "AC", "C", "C",
    "A", "A", "D", "A", "D", "R", "D", "A", "B", "D", "B", "B", "R", "R", "C", "A", "A",
    "CD", "C", "A", "D", "R", "D", "A", "C", "C", "BCD", "C", "A", "ABCD", "B", "A", "D",
    "A", "R", "B", "C", "R", "D", "D", "D", "R", "B", "R", "C", "A", "R", "R", "D", "R", "R",
    "D", "B", "A", "B", "R", "B", "A", "B", "R", "R", "B", "A", "B", "D", "D", "D", "D", "R",
    "C", "R", "D", "A", "D", "B", "R", "B", "C", "C", "R", "A", "R", "A", "B", "A", "D", "R",
    "D", "A", "R", "C", "C", "D", "C", "C", "ABCD", "C", "C", "R", "C", "R", "R", "R", "R",
    "R", "R", "R", "C", "D", "B", "A", "R", "R", "ABC", "R", "A", "ABC", "ABCD", "B", "B",
    "B", "R", "B", "B", "B", "R", "A", "B", "R", "B", "B", "A", "B", "B", "R", "D", "D", "R",
    "R", "BD", "ABCD", "ABCE", "R", "R", "A"];

//感谢某大佬提供的数据

var donateImgURL = "https://ibb.co/sRFbh8S";

(function () {
    
    'use strict';

    function startlearning() {

        var learnbtn = document.querySelector(".idxMain .learning .btn")

        learnbtn.click();

    }

    function startEaxm() {

        var exambtn = document.querySelector(".idxMain .testing .btn")

        exambtn.click();

    }

    function findAnwser() {

        var Qid = document.querySelector(".libTestCnt #options #examid").value;

        var rand = ['A', 'B', 'C', 'D'];

        var answerresult;

        answerresult = Qdata[parseInt(Qid)];

        //如果是数据库中没有的数据，将随机选择一个选项

        if (answerresult === "R") {

            answerresult = rand[Math.floor((Math.random() * 4) + 1)];

        }

        $.ajax({
            type: 'post',
            data: { examid: Qid, option: answerresult },
            url: 'http://202.194.40.185:8001/Test/Answer',
            success: function (data) {
            }
        })

        var nextbtn = document.querySelector(".libTestCnt .btns").children[1];

        var submit = document.querySelector(".libTestCnt .btns").children[2];

        if (document.querySelector(".libTestCnt #options .t .light-blue").textContent === '50') {

            alert("已完成答题，即将为您提交");

            submit.click();
        }

        else {
            nextbtn.click();

            setTimeout(function () {

                findAnwser();

            }, delaytime);

        }

    }

    function AddButton() {

        var Learnbtn = document.createElement("button");

        Learnbtn.textContent = "一键学习";
        Learnbtn.style.fontSize = "26px";
        Learnbtn.style.height = "86px";
        Learnbtn.style.width = "140px";
        Learnbtn.style.backgroundColor = "lightgreen";

        var Exambtn = document.createElement("button");

        Exambtn.textContent = "一键考试";
        Exambtn.style.fontSize = "26px";
        Exambtn.style.height = "86px";
        Exambtn.style.width = "140px";
        Exambtn.style.backgroundColor = "lightgreen";

        var Donatebtn = document.createElement("button");

        Donatebtn.textContent = "打赏";
        Donatebtn.style.fontSize = "14px";
        Donatebtn.style.height = "30px";
        Donatebtn.style.width = "45px";
        Donatebtn.style.position = 'absolute';
        Donatebtn.style.backgroundColor = "red";

        var father = document.querySelector("#idxBanner");

        father.appendChild(Learnbtn);

        father.appendChild(Exambtn);

        father.appendChild(Donatebtn);

        Learnbtn.addEventListener("click", function () {

            startlearning();
        });

        Exambtn.addEventListener("click", function () {

            startEaxm();

        });

        Donatebtn.addEventListener("click", function () {

            window.location.href = donateImgURL;

        });
    }

    $(document).ready(function () {

        var url = window.location.href;

        if (url === "http://202.194.40.185:8001/" || url === "http://202.194.40.185:8001/Home/Index") {

            AddButton();
        }

        var list = document.querySelector(".wrapper .subLeft .menu");

        if (url === "http://202.194.40.185:8001/Column?group=zjtsg") {
            list.children[1].children[0].click();
        }
        else if (url === "http://202.194.40.185:8001/Column?group=rstsg&groupname=%E8%AE%A4%E8%AF%86%E5%9B%BE%E4%B9%A6%E9%A6%86") {
            list.children[2].children[0].click();
        }
        else if (url === "http://202.194.40.185:8001/Column?group=lytsg&groupname=%E5%88%A9%E7%94%A8%E5%9B%BE%E4%B9%A6%E9%A6%86") {
            list.children[3].children[0].click();
        }
        else if (url === "http://202.194.40.185:8001/Column?group=zxtsg&groupname=%E5%92%A8%E8%AF%A2%E5%9B%BE%E4%B9%A6%E9%A6%86") {
            list.children[4].children[0].click();
        }
        else if (url === "http://202.194.40.185:8001/Column?group=gdfw&groupname=%E6%9B%B4%E5%A4%9A%E6%9C%8D%E5%8A%A1") {

            alert("您已完成学习，将自动跳转至首页");

            window.location.href = "http://202.194.40.185:8001/";
        }

        if (url === "http://202.194.40.185:8001/Test") {

            setTimeout(function () {

                findAnwser();

            }, delaytime);

        }

        if (url === "http://202.194.40.185:8001/Home/Test_Success") {

            var res = confirm("你愿意给作者打赏嘛？")

            if (res == true) {
                window.location.href = donateImgURL;
            }
            else {
                alert("感谢使用！");
            }
        }
    });
})();