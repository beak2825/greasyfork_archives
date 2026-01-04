// ==UserScript==
// @name        2025全国高校教师网络培训中心-自动刷课
// @namespace    https://onlinenew.enetedu.com/
// @version      1.0
// @description  适用于网址是 https://onlinenew.enetedu.com/ 的网站自动刷课，您需要手动打开课程播放页面，程序会监测视频是否暂停，自动点击播放，当前视频播放完成则自动播放下一个视频。
// @author       Praglody
// @match        https://onlinenew.enetedu.com/*/MyTrainCourse/ChoiceCourse*
// @match        https://onlinenew.enetedu.com/*/MyTrainCourse/OnlineCourse*
// @grant        none
// @require      https://cdn.jsdelivr.net/gh/rand2019/qggxjspx@a28d9a1bd37daa3d26d3b0b9c173df3f867f0c96/code/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540901/2025%E5%85%A8%E5%9B%BD%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E7%BD%91%E7%BB%9C%E5%9F%B9%E8%AE%AD%E4%B8%AD%E5%BF%83-%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/540901/2025%E5%85%A8%E5%9B%BD%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E7%BD%91%E7%BB%9C%E5%9F%B9%E8%AE%AD%E4%B8%AD%E5%BF%83-%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

/* global $ */

(function() {
    'use strict';

    function randomNum(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
                break;
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                break;
            default:
                return 0;
                break;
        }
    }

    // 自动点击SweetAlert弹窗的确定按钮
    function autoClickSweetAlertConfirm() {
        // 方法1: 查找SweetAlert的确定按钮
        const sweetAlertConfirm = document.querySelector('.sweet-alert .sa-button-container .confirm');
        if (sweetAlertConfirm && sweetAlertConfirm.offsetParent !== null) {
            sweetAlertConfirm.click();
            console.log('自动点击SweetAlert确定按钮');
            return true;
        }

        // 方法2: 查找包含"确定"文本的按钮
        const buttons = document.querySelectorAll('button');
        for (let btn of buttons) {
            if (btn.textContent.trim() === '确定' && btn.offsetParent !== null) {
                btn.click();
                console.log('自动点击确定按钮');
                return true;
            }
        }

        // 方法3: 查找SweetAlert相关的其他可能选择器
        const sweetAlertBtn = document.querySelector('.sweet-alert button[tabindex="1"]');
        if (sweetAlertBtn && sweetAlertBtn.offsetParent !== null) {
            sweetAlertBtn.click();
            console.log('自动点击SweetAlert按钮');
            return true;
        }

        return false;
    }

    // 检测iframe内的弹窗
    function checkIframeAlert() {
        try {
            const iframe = document.querySelector('.classcenter-chapter1 iframe');
            if (iframe && iframe.contentDocument) {
                const iframeDoc = iframe.contentDocument;

                // 在iframe内查找确定按钮
                const confirmBtn = iframeDoc.querySelector('button');
                if (confirmBtn && confirmBtn.textContent.trim() === '确定' && confirmBtn.offsetParent !== null) {
                    confirmBtn.click();
                    console.log('自动点击iframe内确定按钮');
                    return true;
                }
            }
        } catch (e) {
            // 跨域限制，忽略错误
        }
        return false;
    }

    window.onload = function() {
        // 定时检测并点击弹窗确定按钮
        const alertInterval = setInterval(function() {
            if (autoClickSweetAlertConfirm() || checkIframeAlert()) {
                // 找到并点击了按钮，可以选择清除定时器或继续检测
                // clearInterval(alertInterval);
            }
        }, 1000); // 每秒检测一次

        let pppplay = setInterval(function() {
            // 先检测弹窗
            autoClickSweetAlertConfirm();
            checkIframeAlert();

            if ($(".classcenter-chapter1 iframe").contents().find(".layui-layer-content iframe").length > 0) {
                setTimeout(function() {
                    $(".classcenter-chapter1 iframe").contents().find(".layui-layer-content iframe").contents().find("#questionid~div button").trigger("click")
                }, randomNum(15, 40) * 100);
            } else {
                $(".classcenter-chapter1 iframe").contents().find("video").trigger("play")
            }
            console.log(new Date().getTime(), $(".classcenter-chapter1 iframe").length, $(".classcenter-chapter1 iframe").contents().find(".layui-layer-content iframe").length)
        }, 5000);

        setTimeout(function() {
            $(".classcenter-chapter1 iframe").contents().find("video").on("timeupdate", function() {
                if (Math.ceil(this.currentTime) >= Math.ceil(this.duration)) {
                    let flag = false;
                    $(".classcenter-chapter2 ul li").each(function(t) {
                        console.log($(this).css("background-color") == "rgb(204, 197, 197)")
                        if ($(this).css("background-color") != "rgb(204, 197, 197)") {
                            if ($(this).find("span").text() != "[100%]") {
                                flag = true;
                                $(this).trigger("click");
                                return false;
                            }
                        }
                    });
                    if (!flag) {
                        clearInterval(pppplay);
                        clearInterval(alertInterval);
                    }
                }
            })
        }, 8000);
    }
})();
