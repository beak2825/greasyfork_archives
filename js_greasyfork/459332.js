// ==UserScript==
// @name         起点大屏阅读适配
// @namespace    http://tampermonkey.net/
// @require        https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @require           https://cdn.jsdelivr.net/npm/sweetalert2@10.15.6/dist/sweetalert2.min.js
// @resource          swalStyle https://cdn.jsdelivr.net/npm/sweetalert2@10.15.6/dist/sweetalert2.min.css
// @version      0.6
// @description  默认的宽度不满足高分屏浏览.进行修改.(可以更改默认宽度).
// @author       AozoraWings
// @match        https://read.qidian.com/chapter/*
// @match        https://vipreader.qidian.com/chapter/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant             GM_registerMenuCommand
// @grant             GM_getResourceText
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459332/%E8%B5%B7%E7%82%B9%E5%A4%A7%E5%B1%8F%E9%98%85%E8%AF%BB%E9%80%82%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/459332/%E8%B5%B7%E7%82%B9%E5%A4%A7%E5%B1%8F%E9%98%85%E8%AF%BB%E9%80%82%E9%85%8D.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let comment_status=0;
    let content_width = parseInt(typeof (GM_getValue('content_width')) == "undefined" || (GM_getValue('content_width')) == "undefined" ? 2500 : GM_getValue('content_width'));
    const customClass = {
        container: 'mactype-container',
        popup: 'mactype-popup',
        header: 'mactype-header',
        title: 'mactype-title',
        closeButton: 'mactype-close',
        icon: 'mactype-icon',
        image: 'mactype-image',
        content: 'mactype-content',
        htmlContainer: 'mactype-html',
        input: 'mactype-input',
        inputLabel: 'mactype-inputLabel',
        validationMessage: 'mactype-validation',
        actions: 'mactype-actions',
        confirmButton: 'mactype-confirm',
        denyButton: 'mactype-deny',
        cancelButton: 'mactype-cancel',
        loader: 'mactype-loader',
        footer: 'mactype-footer'
    };

    let util = {
        getValue(name) {
                return GM_getValue(name);
            },
            setValue(name, value) {
                GM_setValue(name, value);
            }
    };
    let main = {
        init() {
                $(window).resize(function () {
                    main.window_set(0);
                });
                $("#j_bodyRecWrap").remove();
                $(window).scroll(function () {
                    if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                        //window.location.href = $("#j_chapterNext").eq(0).attr("href");
                    }
                });
            },
            UI_change(number, ui) {
                content_width = parseInt(content_width);
                number = parseInt(number);
                ui = parseInt(ui);
                var auto_width = 0;
                auto_width = parseInt(document.body.clientWidth);
                number = content_width + 800 < auto_width ? content_width : auto_width - 800;
                $("#j_readMainWrap").css("width", number);
                $("#j-mainReadContainer").css("margin-left", ((auto_width - number) / 2) - 100);
                $("#j-mainReadContainer").css("width", 0);
                $("#j-mainReadContainer").css("margin-right", ((auto_width - number) / 2) - 100);
                //算tm,不算了，放左边去.
                $("#j_rightBarList").css("left", (auto_width - number) / 2 - 170);
                $("#j_leftBarList").css("left", (auto_width - number) / 2 - 170);
                $("#j_leftBarList").css("margin-left", 0);
                $("body > div.wrap > div.crumbs-nav").css("margin-left", (auto_width - number) / 2);
                $("body > div.wrap > div.crumbs-nav").css("margin-right", "0");
                $("#readHeader > div").css("margin-right", "0px");
                $(".read-header .wrap-center").css("max-width", number);
                $("#readHeader").css("width", auto_width - 17);
                $("#readHeader > div").css("margin-left", (auto_width - number) / 2);
                $("#readHeader > div").css("margin-right", (auto_width - number) / 2 - 40);
                $("#j_readMainWrap").css("font-szie", "26px");
                $("#j_floatWrap > div.guide-btn-wrap").css("left", (auto_width - number) / 2 - 120);
                $("#j_floatWrap > div.guide-btn-wrap").css("right", 0);
                $("#j_floatWrap > div.guide-btn-wrap").css("margin-left", 0);
                $("#j_floatWrap > div.guide-btn-wrap").css("width", 20);
                var reset_num = parseInt($("#j-mainReadContainer").css("margin-left").match(/(.*?)px/)[1]) != ((auto_width - number) / 2) - 100 ? number + ($("#j-mainReadContainer").css("margin-left") - ((auto_width - number) / 2) - 100) : number;
                $("#paragraph-review-app").css("left", reset_num);
            },
            showSetting() {
                Swal.fire({
                    title: '请选择页面宽度',
                    icon: 'info',
                    input: 'range',
                    showCancelButton: true,
                    confirmButtonText: '保存',
                    cancelButtonText: '还原',
                    showCloseButton: true,
                    inputLabel: '调整至个人感觉合适位置即可,超出当前窗口最大可视值时继续增加将无效.',
                    customClass,
                    inputAttributes: {
                        min: 100,
                        max: 5000,
                        step: 1
                    },
                    inputValue: content_width
                }).then((res) => {
                    if (res.isConfirmed) {
                        util.setValue('content_width', res.value);
                        location.reload();
                    }
                    if (res.isDismissed && res.dismiss === "cancel") {
                        location.reload();
                    }
                });

                document.getElementById('swal2-input').addEventListener('change', (e) => {
                    content_width = e.target.value;
                    main.window_set(0);
                });
            },
            registerMenuCommand() {
                GM_registerMenuCommand('页面宽度设置', () => {
                    this.showSetting();
                });
            },
            window_set(test, ui) {
                var content_num = parseInt(content_width) + 400 + 200 < document.body.clientWidth ? content_width : document.body.clientWidth - 200 - 400;
                if (test) {
                    auto_width = parseInt(document.body.clientWidth);
                    var reset_num = $("#j-mainReadContainer").css("margin-left").match(/(.*?)px/)[1] != ((auto_width - content_num) / 2) - 100 ? content_num + ($("#j-mainReadContainer").css("margin-left") - ((auto_width - content_num) / 2) - 100) : content_num;
                    $("#paragraph-review-app").css("left", reset_num);
                    this.UI_change(content_num, ui);
                } else {
                    this.UI_change(content_num, ui);
                }
            },
            comment_dete() {
                var watch_comment = $("p[data-type='2']");
                var watch_comment_title = $("h3[data-type='2']");
                var watch_comment_close = $("iconfont.close-panel");
                comment_status = 1;
                var status = 0;
                var home = new Array()
                watch_comment_close.click(function (e) {
                    this.window_set(1)
                });
                for (var i = 0; i < watch_comment.length; i++) {
                    $(watch_comment[i]).dblclick(function (e) {
                        this.window_set(1)
                    });
                }
                watch_comment_title.dblclick(function (e) {
                    this.window_set(1)
                });
                //修复评论区
                window.onscroll = function () {
                    if (document.documentElement.scrollTop == 0) {
                        $("#paragraph-review-app > div").addClass("fixed");
                        $("#paragraph-review-app > div").css("top", 0);
                        $("#j_floatWrap > div.guide-btn-wrap").css("bottom", 120);
                    } else {
                        $("#paragraph-review-app > div").css("top", 0);
                        $("#j_floatWrap > div.guide-btn-wrap").css("bottom", 180);
                    }
                }
            },
            start() {
                this.init();
                this.UI_change(content_width, 0);
                this.comment_dete();
                this.registerMenuCommand();
            }
    }
    main.start();
})();