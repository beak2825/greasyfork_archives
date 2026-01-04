// ==UserScript==
// @name         批阅助手
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  不通用的批阅助手!
// @author       Chipmuck
// @license MIT
// @match       *://exam.iflysse.com/Pages/ExamMarkManage/MarkByTeacher/ProjectMarkPage.aspx?*
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454470/%E6%89%B9%E9%98%85%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/454470/%E6%89%B9%E9%98%85%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let selectedNum = 0;
    const a = {
        sub: "页面效果",
        level: [{
            s: 8,
            t: "完美",
            c: '页面效果与设计图一致;'
        }, {
            s: 6,
            t: "美观",
            c: '页面效果与设计图接近;'
        },
        {
            s: 4,
            t: "及格",
            c: '页面效果与设计图有差距;'
        }, {
            s: 2,
            t: "较差",
            c: '页面效果与设计图偏差较大;'
        }, {
            s: 0,
            t: "未实现",
            c: '未实现页面效果;'
        }]
    }
    const b = {
        sub: "问卷首页数据显示",
        level: [
            {
                s: 4,
                t: "正确",
                c: '能够正确显示问卷首页数据;'
            }, {
                s: 3,
                t: "有误-小",
                c: '首页数据实现逻辑有较小错误;'
            }, {
                s: 2,
                t: "有误-中",
                c: '首页数据实现逻辑有部分错误;'
            }, {
                s: 1,
                t: "有误-大",
                c: '首页数据实现逻辑有较大错误;'
            },
            {
                s: 0,
                t: "未实现",
                c: '首页数据没有实现逻辑;'
            }
        ]
    }

    const c = {
        sub: "问卷搜索功能",
        level: [
            {
                s: 4,
                t: "正确",
                c: '能够正确实现问卷搜索功能;'
            }, {
                s: 3,
                t: "有误-小",
                c: '搜索功能实现逻辑有较小错误;'
            }, {
                s: 2,
                t: "有误-中",
                c: '搜索功能实现逻辑有部分错误;'
            }, {
                s: 1,
                t: "有误-大",
                c: '搜索功能实现逻辑有较大错误;'
            },
            {
                s: 0,
                t: "未实现",
                c: '搜索功能没有实现逻辑;'
            }
        ]
    }

    const d = {
        sub: "添加问卷功能",
        level: [
            {
                s: 4,
                t: "正确",
                c: '能够正确实现添加问卷功能;'
            }, {
                s: 3,
                t: "有误-小",
                c: '添加问卷实现逻辑有较小错误;'
            }, {
                s: 2,
                t: "有误-中",
                c: '添加问卷实现逻辑有部分错误;'
            }, {
                s: 1,
                t: "有误-大",
                c: '添加问卷实现逻辑有较大错误;'
            },
            {
                s: 0,
                t: "未实现",
                c: '添加问卷没有实现逻辑;'
            }
        ]
    }

    const e = {
        sub: "问卷跳转",
        level: [
            {
                s: 4,
                t: "正确",
                c: '能够正确实现问卷跳转功能;'
            }, {
                s: 3,
                t: "有误-带参错误",
                c: '问卷跳转实现逻辑携带参数不合规;'
            }, {
                s: 2,
                t: "有误-未带参数",
                c: '问卷跳转实现逻辑未携带参数;'
            }, {
                s: 1,
                t: "有误-跳转错",
                c: '问卷跳转实现逻辑跳转错误;'
            },
            {
                s: 0,
                t: "未实现",
                c: '问卷跳转没有实现逻辑;'
            }
        ]
    }

    const f = {
        sub: "题目列表获取与显示",
        level: [
            {
                s: 4,
                t: "正确",
                c: '能够正确获取题目列表与展示题目;'
            }, {
                s: 3,
                t: "仅获取",
                c: '仅获取题目列表未展示;'
            }, {
                s: 3,
                t: "仅展示",
                c: '未获取题目列表仅固定数据展示;'
            }, {
                s: 2,
                t: "有误-中",
                c: '获取题目列表与展示题目实现逻辑有部分错误;'
            },
            {
                s: 1,
                t: "有误-大",
                c: '获取题目列表与展示题目实现逻辑有较大错误;'
            },
            {
                s: 0,
                t: "未实现",
                c: '未够正确获取题目列表与展示题目;'
            }
        ]
    }

    const g = {
        sub: "弹窗显示新增题目",
        level: [
            {
                s: 4,
                t: "正确",
                c: '能够正确实现弹窗显示新增题目;'
            }, {
                s: 3,
                t: "有误-小",
                c: '弹窗显示新增题目实现逻辑有较小错误;'
            }, {
                s: 2,
                t: "有误-中",
                c: '弹窗显示新增题目实现逻辑有部分错误;'
            }, {
                s: 1,
                t: "有误-大",
                c: '弹窗显示新增题目实现逻辑有较大错误;'
            },
            {
                s: 0,
                t: "未实现",
                c: '弹窗显示新增题目没有实现逻辑;'
            }
        ]
    }

    const h = {
        sub: "题目保存与页面数据更新",
        level: [
            {
                s: 4,
                t: "正确",
                c: '能够正确保存题目并刷新页面数据;'
            }, {
                s: 3,
                t: "仅保存",
                c: '仅保存题目数据;'
            }, {
                s: 3,
                t: "仅刷新",
                c: '未保存题目，仅刷新了页面数据;'
            }, {
                s: 2,
                t: "有误-中",
                c: '保存题目并刷新页面数据实现逻辑有部分错误;'
            },
            {
                s: 1,
                t: "有误-大",
                c: '保存题目并刷新页面数据实现逻辑有较大错误;'
            },
            {
                s: 0,
                t: "未实现",
                c: '未够正确保存题目并刷新页面数据;'
            }
        ]
    }



    const code = {
        sub: "代码格式规范",
        level: [
            {
                s: 4,
                t: "优秀",
                c: '代码格式规范，变量、函数等命名清晰;'
            },
            {
                s: 3,
                t: "良好",
                c: '代码格式较为规范，变量、函数等命名较为清晰;'
            }, {
                s: 2,
                t: "及格",
                c: '代码格式基本规范，变量、函数等命名基本清晰;'
            }, {
                s: 1,
                t: "较差",
                c: '代码格式不规范，变量、函数等命名不清晰;'
            }
        ]
    }

    const data = [a, b,c,d,e,f,g,h, code];

    let box = $('<div data-show="yes"></div>');
    box.css({ "display": "flex", "position": "absolute", "top": '50px', "right": "0px", "align-items": "center", "transition": "1s" })

    let pic = $('<svg id="assistant_logo" t="1667912741319" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2544" width="200" height="200"><path d="M513.3 214.2m-34.1 0a34.1 34.1 0 1 0 68.2 0 34.1 34.1 0 1 0-68.2 0Z" fill="#FBFCFF" p-id="2545"></path><path d="M513.3 255.3c-22.7 0-41.1-18.4-41.1-41.1s18.4-41.1 41.1-41.1c22.7 0 41.1 18.4 41.1 41.1s-18.4 41.1-41.1 41.1z m0-68.2c-14.9 0-27.1 12.2-27.1 27.1s12.2 27.1 27.1 27.1c14.9 0 27.1-12.2 27.1-27.1s-12.1-27.1-27.1-27.1z" fill="#4D4D4D" p-id="2546"></path><path d="M439.8 127.3l67.4 53.4" fill="#FBFCFF" p-id="2547"></path><path d="M507.2 187.7c-1.5 0-3.1-0.5-4.3-1.5l-67.4-53.4c-3-2.4-3.5-6.8-1.1-9.8 2.4-3 6.8-3.5 9.8-1.1l67.4 53.4c3 2.4 3.5 6.8 1.1 9.8-1.4 1.7-3.5 2.6-5.5 2.6z" fill="#4D4D4D" p-id="2548"></path><path d="M730.5 525.8h60v73.9h-60z" fill="#FBFCFF" p-id="2549"></path><path d="M790.5 606.8h-60c-3.9 0-7-3.1-7-7v-73.9c0-3.9 3.1-7 7-7h60c3.9 0 7 3.1 7 7v73.9c0 3.8-3.1 7-7 7z m-53-14h46v-59.9h-46v59.9z" fill="#4D4D4D" p-id="2550"></path><path d="M234.1 525.8h60v73.9h-60z" fill="#FBFCFF" p-id="2551"></path><path d="M294.1 606.8h-60c-3.9 0-7-3.1-7-7v-73.9c0-3.9 3.1-7 7-7h60c3.9 0 7 3.1 7 7v73.9c0 3.8-3.1 7-7 7z m-53-14h46v-59.9h-46v59.9z" fill="#4D4D4D" p-id="2552"></path><path d="M394.1 860.3m-35.8 0a35.8 35.8 0 1 0 71.6 0 35.8 35.8 0 1 0-71.6 0Z" fill="#FBFCFF" p-id="2553"></path><path d="M394.1 903.1c-23.6 0-42.8-19.2-42.8-42.8 0-23.6 19.2-42.8 42.8-42.8s42.8 19.2 42.8 42.8c0 23.6-19.2 42.8-42.8 42.8z m0-71.7c-15.9 0-28.8 12.9-28.8 28.8s12.9 28.8 28.8 28.8 28.8-12.9 28.8-28.8c0-15.8-12.9-28.8-28.8-28.8z" fill="#4D4D4D" p-id="2554"></path><path d="M513.9 860.3m-35.8 0a35.8 35.8 0 1 0 71.6 0 35.8 35.8 0 1 0-71.6 0Z" fill="#FBFCFF" p-id="2555"></path><path d="M513.9 903.1c-23.6 0-42.8-19.2-42.8-42.8 0-23.6 19.2-42.8 42.8-42.8 23.6 0 42.8 19.2 42.8 42.8 0.1 23.6-19.1 42.8-42.8 42.8z m0-71.7c-15.9 0-28.8 12.9-28.8 28.8S498 889 513.9 889s28.8-12.9 28.8-28.8c0.1-15.8-12.9-28.8-28.8-28.8z" fill="#4D4D4D" p-id="2556"></path><path d="M628.1 860.3m-35.8 0a35.8 35.8 0 1 0 71.6 0 35.8 35.8 0 1 0-71.6 0Z" fill="#FBFCFF" p-id="2557"></path><path d="M628.1 903.1c-23.6 0-42.8-19.2-42.8-42.8 0-23.6 19.2-42.8 42.8-42.8 23.6 0 42.8 19.2 42.8 42.8 0.1 23.6-19.2 42.8-42.8 42.8z m0-71.7c-15.9 0-28.8 12.9-28.8 28.8s12.9 28.8 28.8 28.8 28.8-12.9 28.8-28.8c0.1-15.8-12.9-28.8-28.8-28.8z" fill="#4D4D4D" p-id="2558"></path><path d="M710 847H314c-11.4 0-20.8-9.3-20.8-20.8V439.6c0-120.3 98.5-218.8 218.8-218.8 120.3 0 218.8 98.5 218.8 218.8v386.7c0 11.4-9.4 20.7-20.8 20.7z" fill="#FBFCFF" p-id="2559"></path><path d="M710 854H314c-15.3 0-27.8-12.5-27.8-27.8V439.6c0-60.1 23.6-116.7 66.3-159.5s99.4-66.3 159.5-66.3 116.7 23.6 159.5 66.3 66.3 99.4 66.3 159.5v386.7c0 15.3-12.5 27.7-27.8 27.7zM512 227.8c-56.3 0-109.4 22.1-149.6 62.2s-62.2 93.2-62.2 149.6v386.7c0 7.6 6.2 13.8 13.8 13.8h396c7.6 0 13.8-6.2 13.8-13.8V439.6c0-56.3-22.1-109.4-62.2-149.6s-93.3-62.2-149.6-62.2z" fill="#4D4D4D" p-id="2560"></path><path d="M365.5 340.1c8.9-14.1 19.7-26.9 32.1-38.1" fill="#FBFCFF" p-id="2561"></path><path d="M365.5 347.1c-1.3 0-2.6-0.4-3.7-1.1-3.3-2.1-4.2-6.4-2.2-9.7 9.3-14.6 20.5-27.9 33.3-39.5 2.9-2.6 7.3-2.4 9.9 0.5 2.6 2.9 2.4 7.3-0.5 9.9-11.9 10.7-22.3 23.1-30.9 36.6-1.3 2.2-3.6 3.3-5.9 3.3z" fill="#4D4D4D" p-id="2562"></path><path d="M348.7 374.1c1.7-4.6 3.6-9.2 5.7-13.7" fill="#FBFCFF" p-id="2563"></path><path d="M348.7 381.1c-0.8 0-1.6-0.1-2.4-0.4-3.6-1.3-5.5-5.4-4.1-9 1.8-4.8 3.8-9.6 5.9-14.2 1.6-3.5 5.8-5 9.3-3.4 3.5 1.6 5 5.8 3.4 9.3-2 4.3-3.8 8.7-5.5 13.2-1.1 2.8-3.8 4.5-6.6 4.5z" fill="#4D4D4D" p-id="2564"></path><path d="M510.8 382.7m-55.9 0a55.9 55.9 0 1 0 111.8 0 55.9 55.9 0 1 0-111.8 0Z" fill="#FBFCFF" p-id="2565"></path><path d="M510.8 445.5c-34.7 0-62.9-28.2-62.9-62.9s28.2-62.9 62.9-62.9 62.9 28.2 62.9 62.9-28.3 62.9-62.9 62.9z m0-111.7c-26.9 0-48.9 21.9-48.9 48.9s21.9 48.9 48.9 48.9c26.9 0 48.9-21.9 48.9-48.9s-22-48.9-48.9-48.9z" fill="#4D4D4D" p-id="2566"></path><path d="M510.8 382.7m-7 0a7 7 0 1 0 14 0 7 7 0 1 0-14 0Z" fill="#FBFCFF" p-id="2567"></path><path d="M510.8 396.7c-7.7 0-14-6.3-14-14s6.3-14 14-14 14 6.3 14 14-6.3 14-14 14z" fill="#4D4D4D" p-id="2568"></path><path d="M574.8 644.9H449.2c0-34.7 28.1-62.8 62.8-62.8s62.8 28.1 62.8 62.8z" fill="#00DFD4" p-id="2569"></path><path d="M574.8 651.9H449.2c-3.9 0-7-3.1-7-7 0-38.5 31.3-69.8 69.8-69.8s69.8 31.3 69.8 69.8c0 3.9-3.2 7-7 7z m-118.2-14h110.7c-3.5-27.5-27-48.8-55.4-48.8s-51.8 21.3-55.3 48.8z" fill="#4D4D4D" p-id="2570"></path><path d="M504.6 611.3l22.6 33.6" fill="#FBFCFF" p-id="2571"></path><path d="M527.2 651.9c-2.3 0-4.5-1.1-5.8-3.1l-22.6-33.6c-2.2-3.2-1.3-7.6 1.9-9.7 3.2-2.2 7.6-1.3 9.7 1.9L533 641c2.2 3.2 1.3 7.6-1.9 9.7-1.2 0.8-2.6 1.2-3.9 1.2z" fill="#4D4D4D" p-id="2572"></path><path d="M799.2 690.7h-15.6c-10.5 0-19-8.6-19-19V544.9c0-10.5 8.6-19 19-19h15.6c10.5 0 19 8.6 19 19v126.8c0.1 10.4-8.5 19-19 19z" fill="#FBFCFF" p-id="2573"></path><path d="M799.2 697.7h-15.6c-14.4 0-26-11.7-26-26V544.9c0-14.4 11.7-26 26-26h15.6c14.4 0 26 11.7 26 26v126.8c0.1 14.3-11.6 26-26 26z m-15.6-164.9c-6.6 0-12 5.4-12 12v126.8c0 6.6 5.4 12 12 12h15.6c6.6 0 12-5.4 12-12V544.9c0-6.6-5.4-12-12-12h-15.6z" fill="#4D4D4D" p-id="2574"></path><path d="M225.3 690.7h15.6c10.5 0 19-8.6 19-19V544.9c0-10.5-8.6-19-19-19h-15.6c-10.5 0-19 8.6-19 19v126.8c0 10.4 8.6 19 19 19z" fill="#FBFCFF" p-id="2575"></path><path d="M240.9 697.7h-15.6c-14.4 0-26-11.7-26-26V544.9c0-14.4 11.7-26 26-26h15.6c14.4 0 26 11.7 26 26v126.8c0.1 14.3-11.6 26-26 26z m-15.6-164.9c-6.6 0-12 5.4-12 12v126.8c0 6.6 5.4 12 12 12h15.6c6.6 0 12-5.4 12-12V544.9c0-6.6-5.4-12-12-12h-15.6z" fill="#4D4D4D" p-id="2576"></path><path d="M293.5 529H731" fill="#FBFCFF" p-id="2577"></path><path d="M731 536H293.5c-3.9 0-7-3.1-7-7s3.1-7 7-7H731c3.9 0 7 3.1 7 7s-3.1 7-7 7z" fill="#4D4D4D" p-id="2578"></path></svg>');

    let div = $('<div id="scoring_assistant"></div');
    div.css({ "background-color": "LightCyan", "border-radius": "5px", "width": "280px", "box-shadow": "rgba(0, 0, 0, 0.1) 0px 4px 12px" });
    data.forEach(d => {
        const section = $('<section></section>')
        section.css({ "padding-left": "5px", "margin-bottom": "5px" });
        const title = $('<b style="display:block">' + d.sub + '</b>')
        section.append(title);
        d.level.forEach(l => {
            section.append('<button class="item_btn" data-s="' + l.s + '" data-c="' + l.c + '">' + l.t + '</button>')
        })
        div.append(section);
    })

    div.append($('<hr><b class="statistics">已选：' + selectedNum + '/' + data.length + '个</b><button class="reset">重置</button>'))

    box.append(pic).append(div);
    $("body").append(box);

    $(".reset").css({ "float": "right", "border": "none", "background-color": "DarkOrange", "width": "100px" }).hover(function () {
        $(this).css({ "cursor": "pointer" });
    }).bind('click', function () {
        // 分数输入Element
        let scoreEle = $("input.inputScore");
        // 评语输入Element
        let commendEle = $("textarea.form-control");
        scoreEle.val('');
        commendEle.val('');
        selectedNum = 0;
        $('.statistics').text('已选：' + selectedNum + '/' + data.length + '个');
        $('.item_btn').removeClass('selected');
        $('.item_btn').css({ "background-color": "#eee" });
    })

    $('#assistant_logo').css("cssText", "width: 50px !important").bind('click', function () {
        if (box.data('show') == 'yes') {
            box.data('show', 'no');
            box.css({ "right": "-280px" })
        } else {
            box.data('show', 'yes');
            box.css({ "right": "0px" })
        }
    })

    $('.item_btn').css({ "margin-right": "5px", "border": "none", "border-radius": "5px", "background-color": "#eee" }).hover(function () {
        $('.item_btn').css({ "cursor": "pointer" });
    });

    $('#scoring_assistant .item_btn').bind('click', function () {
        // 分数输入Element
        let scoreEle = $("input.inputScore");
        // 评语输入Element
        let commendEle = $("textarea.form-control");
        const s = $(this).data('s') - 0;
        const c = $(this).data('c');

        if ((scoreEle.val() - 0 + s) > 100) {
            alert("已超过满分");
            return;
        }

        if ($(this).hasClass('selected')) {
            selectedNum--;
            $('.statistics').text('已选：' + selectedNum + '/' + data.length + '个');
            $(this).removeClass('selected');
            $(this).css({ "background-color": "#eee" });
            scoreEle.val(scoreEle.val() - 0 - s);
            commendEle.val(commendEle.val().replace(c, ""));
        } else {
            selectedNum++;
            $('.statistics').text('已选：' + selectedNum + '/' + data.length +'个');
            $(this).addClass('selected');
            $(this).css({ "background-color": "HotPink" });
            scoreEle.val(scoreEle.val() - 0 + s);
            commendEle.val(commendEle.val() + c);
        }
    }).bind('mouseover', function () {
        $(this).css({ "box-shadow": "rgb(0 0 0 / 24%) 0px 3px 8px" });
    }).bind('mouseout', function () {
        $(this).css({ "box-shadow": "none" });
    })

})();