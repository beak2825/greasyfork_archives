// ==UserScript==
// @name         外语通答案显示
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  破解外语通
// @author       diolam
// @match        https://student.waiyutong.org/Practice/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487573/%E5%A4%96%E8%AF%AD%E9%80%9A%E7%AD%94%E6%A1%88%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/487573/%E5%A4%96%E8%AF%AD%E9%80%9A%E7%AD%94%E6%A1%88%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

// 不引入 jQuery 是为了防止与网站本身的 jQuery 冲突，外语通的所有网站都使用了 jQuery，直接用就好。

(function () {
    "use strict";
    console.log("plug loaded");

    // https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
    function base64ToBytes(base64) {
        const binString = atob(base64);
        return Uint8Array.from(binString, (m) => m.codePointAt(0));
    }

    // 直接选择正确答案
    function set_right_answers() {
        $(".dib.question_content").each(function () {
            const ans = $(this).attr("data-right-answer");
            if (!ans) return;
            const id = atob(ans);
            $(this).find(`input[value="${id}"]`).trigger("click");
        });
    }

    // 提前批改
    function show_diff() {
        $(".dib.question_content").each(function () {
            const ans = $(this).attr("data-right-answer");
            if (!ans) return;
            const cur = $(this).find(":checked");

            const id = atob(ans);
            let color;
            if (cur.length === 0) {
                color = "deepskyblue";
            } else if (cur.attr("value") === id) {
                color = "limegreen";
            } else {
                color = "orangered";
            }

            $(this).css("background-color", color);
            let qid = $(this).parent(".question_container").attr("data-qid");
            $(`.dib[data-index="${qid}"]`).css("background-color", color);
        });
    }

    const dict = {};

    function show_answers() {
        $(".question_division_line").css("display", "block");

        $(".listening_text, .analysis")
            .each(function () {
            dict[$(this).parent().parent().attr("data-qid")] = $(this).html();
            const text = new TextDecoder().decode(base64ToBytes($(this).html()));
            $(this).html(text);
        });

        $(".listening_text, .analysis, .test_empty_content").css("display", "block")

        $('.test_ctrl').each(function () {
            $(this).css('display', 'block')
            $(this).text("过程\"" + $(this).attr('data-hint') + "\"（单击以移除此过程）")
            $(this).on("click", function () {
                $(this).remove();
            })
        })

        $('.test_ctrl_area').css('display', 'block');
    }

    function recovery() {
        $(".listening_text, .analysis")
            .each(function () {
            $(this).html(dict[$(this).parent().parent().attr("data-qid")]);
        });
    }

    let init = false;
    $(".time_box").click(function () {
        if (init) return;
        init = true;
        $(".p_answer_list").append(
            $('<div class="diolam_plug_btn">直接批改</div>').click(function () {
                show_diff();
            })
        );
        $(".p_answer_list").append(
            $('<div class="diolam_plug_btn">选择所有正确选项</div>').click(function () {
                set_right_answers();
            })
        );
        $(".p_answer_list").append(
            $('<div class="diolam_plug_btn">显示答案和听力原文</div>').click(function () {
                show_answers();
            })
        );
        $(".p_answer_list").append(
            $('<div class="diolam_plug_btn">恢复听力数据</div>').click(function () {
                recovery();
            })
        );
        $(".p_answer_list").append(
            $('<div class="diolam_plug_btn">设置剩余时间</div>').click(function () {
                const time = +prompt("剩余时间（按秒计）");
                window.count_down_time = time;
            })
        );
        $(".p_answer_list").append(
            $('<div class="diolam_plug_btn">速通试卷</div>').click(function () {
                show_answers();
                recovery();
                set_right_answers();
                $('.test_content').each(function () {
                    $(this).find('.test_ctrl[data-act-type!=2]').remove();
                });
                window.count_down_time = 600;
            })
        );
        $(".p_answer_list").append(
            $('<div class="diolam_plug_btn">快速完成情景问答专项</div>').click(function () {
                $('.test_content').each(function () {
                    $(this).find('.test_ctrl[data-act-type!=2][data-mp3-type!=10][data-mp3-type!=12]').remove();
                    $(this).find('.test_ctrl[data-act-type=2]').attr('data-wait-time', '5000');
                });
                window.count_down_time = 600;
            })
        );
        $(".diolam_plug_btn").attr(
            "style",
            "width:92%;margin:5px auto;padding:5px 0;background:#21B265;color:#fff;font-size:16px;font-family:'Hiragino Sans GB', 'Lantinghei SC', 'Microsoft Yahei', SimSun;cursor:pointer;text-align:center;border-radius:5px;"
        );
    });
})();
