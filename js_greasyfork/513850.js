// ==UserScript==
// @name         bilibili-视频动态评论转发区编号
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  为评论/转发区一人编一个号。注意这不是楼层号。
// @author       Y_jun
// @match        https://www.bilibili.com/video*
// @match        https://t.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513850/bilibili-%E8%A7%86%E9%A2%91%E5%8A%A8%E6%80%81%E8%AF%84%E8%AE%BA%E8%BD%AC%E5%8F%91%E5%8C%BA%E7%BC%96%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/513850/bilibili-%E8%A7%86%E9%A2%91%E5%8A%A8%E6%80%81%E8%AF%84%E8%AE%BA%E8%BD%AC%E5%8F%91%E5%8C%BA%E7%BC%96%E5%8F%B7.meta.js
// ==/UserScript==

'use strict';
$(function () {
    const commBtn = `<button style='width: 30px;
    height: 130px;
    margin: 0 auto;
    line-height: 20px;
    background-color: #FB7299;
    position: fixed;
    top: 50%;
    right: 10px;
    color: white;
    font-size: 14px;
    border: 2px solid #FB7299;
    border-radius: 5px;
    cursor:pointer'
    id="getCommNum">获取评论编号</button>`
    const forwBtn = `<button style='width: 30px;
    height: 130px;
    margin: 0 auto;
    line-height: 20px;
    background-color: #FB7299;
    position: fixed;
    top: 50%;
    right: 45px;
    color: white;
    font-size: 14px;
    border: 2px solid #FB7299;
    border-radius: 5px;
    cursor:pointer'
    id="getForwNum">获取转发编号</button>`
    const delBtn = `<button style='width: 30px;
    height: 85px;
    margin: 0 auto;
    line-height: 20px;
    background-color: #FB7299;
    position: fixed;
    top: 65%;
    right: 10px;
    color: white;
    font-size: 14px;
    border: 2px solid #FB7299;
    border-radius: 5px;
    cursor:pointer'
    id="delAllNum">删除编号</button>`
    const addBtn = $("body");
    if (location.pathname.length < 2) return;
    if (location.host === "t.bilibili.com") {
        $(addBtn).append(commBtn);
        $(addBtn).append(forwBtn);
        $(addBtn).append(delBtn);
        $("#getCommNum").click(() => {
            getAll("comment", "dyn");
        });
        $("#getForwNum").click(() => {
            getAll("forw", "dyn");
        });
        $("#delAllNum").click(() => {
            $(".added-floor").remove();
        });
    } else {
        $(addBtn).append(commBtn);
        $(addBtn).append(delBtn);
        $("#getCommNum").click(() => {
            getAll("comment", "video");
        });
        $("#delAllNum").click(() => {
            delAll("comment", "video");
        });
    }

    function getAll(type, area) {
        let get = setInterval(() => {
            let loading
            if (type == "comment") {
                loading = $(".loading-state").text()
            } else {
                loading = $(".bili-dyn-forward__more").text().replace(/\s*/g, "");
            }
            $('html, body').animate({ scrollTop: $(document).height() }, 500)
            if (type == "comment") {
                if (loading) {
                    if (area === "dyn") {
                        $(window).scrollTop($('.bili-dyn-item__header').offset().top - 50)
                        printCommNum()
                        clearInterval(get)
                    } else {
                        $(window).scrollTop($('.comment-header').offset().top - 50)
                        printCommNum()
                        clearInterval(get)
                    }
                }
            } else {
                if (loading !== "查看更多转发") {
                    $(window).scrollTop($('.bili-dyn-item__header').offset().top - 50)
                    printForwNum()
                    clearInterval(get)
                }
            }

        }, 1000)
    }

    function printCommNum() {
        const idMap = new Map();
        let i = 1;
        $(".con > .user").each(function (index, element) {
            let num;
            const uid = $(this).find(".name").attr("data-usercard-mid");
            if (idMap.has(uid)) {
                num = idMap.get(uid);
            } else {
                num = i;
                idMap.set(uid, num);
                i++;
            }
            const temp = `<span class='added-floor' style='margin-left: 20px; color: #FB7299;'>${num}号</span>`
            $(this).append(temp)
        })
    }

    function printForwNum() {
        const idMap = new Map();
        let i = 1;
        $(".bili-dyn-forward-item__uname").each(function (index, element) {
            let num;
            const uid = $(this).prop("_profile").uid;
            if (idMap.has(uid)) {
                num = idMap.get(uid);
            } else {
                num = i;
                idMap.set(uid, num);
                i++;
            }
            const temp = `<span class='added-floor' style='margin-left: 20px; color: #FB7299;'>${num}号</span>`
            $(this).append(temp)
        })
    }
});