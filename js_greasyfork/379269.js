// ==UserScript==
// @name         北京邮电大学MOOC平台半自动暴力答题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Xice <admin@xice.wang>
// @match        http://bupt.xuetangx.com/courses/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379269/%E5%8C%97%E4%BA%AC%E9%82%AE%E7%94%B5%E5%A4%A7%E5%AD%A6MOOC%E5%B9%B3%E5%8F%B0%E5%8D%8A%E8%87%AA%E5%8A%A8%E6%9A%B4%E5%8A%9B%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/379269/%E5%8C%97%E4%BA%AC%E9%82%AE%E7%94%B5%E5%A4%A7%E5%AD%A6MOOC%E5%B9%B3%E5%8F%B0%E5%8D%8A%E8%87%AA%E5%8A%A8%E6%9A%B4%E5%8A%9B%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    let minfun = function () {
        $ = jQuery;
        $(".problems-wrapper").map(function () {
            if ($(this).find(".problem-header").html().indexOf("单选题") > -1) {
                // 这个是单选题
                let first = true;
                $(this).find("label").map(function () {
                    if ($(this).attr("for").indexOf("choice_0") > -1)
                        $(this).find("input").click();
                })
                $(this).find(".action").append(`<button id="push">切换答案</button>`);
                // $(this).find("#check 提交").click();
                let tryDX = p => {
                    let finish = !first;
                    $(p).find("label").map(function () {
                        if ($(this).find("span").html() && $(this).find("span").html().indexOf("不正确") > -1) {
                            finish = false;
                            $(this).next().find("input").click();
                        }
                    })
                    $(p).find(".check.提交").click();
                    if (!finish)
                        setTimeout(() => {
                            first = false;
                            tryDX(p);
                        }, 1000);
                }
                $(this).find("#push").click(() => {
                    console.log("click!")
                    tryDX(this);
                })
            }
            else if ($(this).find(".problem-header").html().indexOf("多选题") > -1) {
                let table = [];
                $(this).find("form").map(function () {
                    let tmpf = {
                        id: $(this).attr("id").replace("inputtype_", ""),
                        long: $(this).find("fieldset").children("label").length
                    };
                    tmpf.isPass = () => {
                        let html = $("#status_" + tmpf.id).html();
                        return html.indexOf("不正确") == -1 && html.indexOf("正确") > -1;
                    }
                    tmpf.nextAs = () => {
                        let thisNum = []
                        for (let i = 0; i < tmpf.long; i += 1) {
                            //d0d98311ab694156ad30ae8b3ff573ec_2_1
                            //input_d0d98311ab694156ad30ae8b3ff573ec_2_1_choice_1
                            thisNum.push($(`#input_${tmpf.id}_choice_${i}`).is(":checked"));
                        }
                        let plus = true;
                        for (let i = 0; i < tmpf.long; i += 1) {
                            if (plus) {
                                if (thisNum[i]) {
                                    plus = true;
                                    thisNum[i] = false;
                                } else {
                                    thisNum[i] = true;
                                    plus = false;
                                }
                            }
                            $(`#input_${tmpf.id}_choice_${i}`).prop('checked', thisNum[i]);
                        }
                    }
                    table.push(tmpf);
                })
                let tryDX = p => {
                    for (const t of table) {
                        if (t.isPass() == false) {
                            t.nextAs();
                        }
                    }
                    $(p).find(".check.提交").click();
                    setTimeout(() => {
                        let finish = true;
                        table.map(t => finish = finish && t.isPass());
                        if (finish == false) tryDX(p);
                    }, 1000);
                }
                $(this).find(".action").append(`<button id="push">切换答案</button>`);
                $(this).find("#push").click(() => {
                    console.log("click!")
                    tryDX(this);
                })
            }
        })
    }
    window.onload = () => {jQuery(".sequence-list-wrapper").click(()=>setTimeout(minfun,500));jQuery(".sequence-nav-buttons").click(()=>setTimeout(minfun,500));minfun()};
})();