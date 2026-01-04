// ==UserScript==
// @name         学习十九届六中全会精神考试答题
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  一键自动答题!
// @author       叶海晨星
// @match        *://dj.hbisco.com/mobile/zhuanti/yzyh20210413/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446836/%E5%AD%A6%E4%B9%A0%E5%8D%81%E4%B9%9D%E5%B1%8A%E5%85%AD%E4%B8%AD%E5%85%A8%E4%BC%9A%E7%B2%BE%E7%A5%9E%E8%80%83%E8%AF%95%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/446836/%E5%AD%A6%E4%B9%A0%E5%8D%81%E4%B9%9D%E5%B1%8A%E5%85%AD%E4%B8%AD%E5%85%A8%E4%BC%9A%E7%B2%BE%E7%A5%9E%E8%80%83%E8%AF%95%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //填充答案
    var tiku = [{ tkId: "3535", answer: "AC" }, { tkId: "3536", answer: "ABC" }, { tkId: "3537", answer: "ABCD" }, { tkId: "3538", answer: "ABCD" }, { tkId: "3539", answer: "ABC" }, { tkId: "3540", answer: "ABCD" }, { tkId: "3541", answer: "A" }, { tkId: "3542", answer: "ABCD" }, { tkId: "3543", answer: "ABD" }, { tkId: "3544", answer: "C" }, { tkId: "3545", answer: "ABCD" }, { tkId: "3546", answer: "ABCD" }, { tkId: "3547", answer: "BC" }, { tkId: "3548", answer: "AB" }, { tkId: "3549", answer: "B" }, { tkId: "3550", answer: "BC" }, { tkId: "3551", answer: "A" }, { tkId: "3552", answer: "ABC" }, { tkId: "3553", answer: "ABCD" }, { tkId: "3554", answer: "BCD" }, { tkId: "3555", answer: "D" }, { tkId: "3556", answer: "C" }, { tkId: "3557", answer: "ABC" }, { tkId: "3558", answer: "CD" }, { tkId: "3559", answer: "B" }, { tkId: "3560", answer: "BCD" }, { tkId: "3561", answer: "ABCD" }, { tkId: "3562", answer: "BD" }, { tkId: "3563", answer: "C" }, { tkId: "3564", answer: "AD" }, { tkId: "3565", answer: "ABC" }, { tkId: "3566", answer: "AB" }, { tkId: "3567", answer: "D" }, { tkId: "3568", answer: "B" }, { tkId: "3569", answer: "BCD" }, { tkId: "3570", answer: "A" }, { tkId: "3571", answer: "C" }, { tkId: "3572", answer: "AC" }, { tkId: "3573", answer: "ABC" }, { tkId: "3574", answer: "AB" }, { tkId: "3575", answer: "ABC" }, { tkId: "3576", answer: "AC" }, { tkId: "3577", answer: "AC" }, { tkId: "3578", answer: "ABC" }, { tkId: "3579", answer: "B" }, { tkId: "3580", answer: "ABC" }, { tkId: "3581", answer: "ABC" }, { tkId: "3582", answer: "BC" }, { tkId: "3583", answer: "ABC" }, { tkId: "3584", answer: "ABC" }, { tkId: "3585", answer: "ABCD" }, { tkId: "3586", answer: "ABCD" }, { tkId: "3587", answer: "ABCD" }, { tkId: "3588", answer: "ABCD" }, { tkId: "3589", answer: "ABCD" }, { tkId: "3590", answer: "ABCD" }, { tkId: "3591", answer: "ABCD" }, { tkId: "3592", answer: "ABCD" }, { tkId: "3593", answer: "ABC" }, { tkId: "3594", answer: "ABCD" }, { tkId: "3595", answer: "D" }, { tkId: "3596", answer: "ABCD" }, { tkId: "3597", answer: "ABCD" }, { tkId: "3599", answer: "ABCD" }, { tkId: "3600", answer: "C" }, { tkId: "3601", answer: "ABC" }, { tkId: "3604", answer: "B" }, { tkId: "3605", answer: "AB" }, { tkId: "3606", answer: "C" }, { tkId: "3607", answer: "B" }, { tkId: "3608", answer: "D" }, { tkId: "3609", answer: "ABCD" }, { tkId: "3610", answer: "B" }, { tkId: "3611", answer: "D" }];


    //清空已勾选的选项的内容
    function clear_checked(tiID) {
        let ti = "#tiku" + tiID + " input";
        $(ti).each(function () {
            $(this).prop('checked', false);
        });
    }
    //按给定答案勾选选项
    function click_option(tiID, answer) {
        let ti = "#tiku" + tiID;
        if ($(ti).length > 0) {
            clear_checked(tiID);
            for (let i = 0; i < answer.length; i++) {
                let char = answer[i].toUpperCase();
                let id = "#options" + tiID + char;
                let option = $(id);
                if ((option).length > 0) {
                    option.prop('checked', true);
                }
            }
        }
    }

    var time = setInterval(function () {
        if ($(".daojishi").length > 0) {
            //停止计时器
            clearInterval(time);
            //添加自动答题和提交按钮按钮
            $(".daojishi").prepend("<button class='btn btn-primary' id='submit'>提交答案</button><br>");
            $(".daojishi").prepend("<button class='btn btn-success' id='auto'>自动答题</button> ");
            //添加答题点击事件
            $("#auto").click(function () {
                if ($(".list-li").length > 0) {
                    tiku.forEach(t => {
                        click_option(t.tkId, t.answer);
                    });
                }
            });
            //添加提交点击事件
            $("#submit").click(function () {
                if ($(".list-li").length > 0) {
                    $("#submitButton").click();
                }
            });
        }
    }, 1000);
})();