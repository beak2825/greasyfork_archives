// ==UserScript==
// @name         设置答案
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  电子科技大学答题 
// @author       ljx
// @include      http://learning.uestcedu.com/learning3/exam/portal/view_answer.jsp?exam_id*
// @include      http://learning.uestcedu.com/learning3/exam/portal/exam.jsp?ls*
// @require      http://code.jquery.com/jquery-2.2.4.min.js
// @match        http://learning.uestcedu.com/learning3/exam/portal/view_answer.jsp?exam_id*
// @match        http://learning.uestcedu.com/learning3/exam/portal/exam.jsp?ls*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/386627/%E8%AE%BE%E7%BD%AE%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/386627/%E8%AE%BE%E7%BD%AE%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==
jQuery.noConflict();
(function( $ ) {
    //debugger;
    var storageKey = "answer";
    var setAnswer = function () {
        localStorage.removeItem(storageKey);
        var data = [];
        var optMap = {
            "A": 0,
            "B": 1,
            "C": 2,
            "D": 3,
            "E": 4,
        };
        $('table[isitem="1"]').each(function () {
            var reg = /[^\u4e00-\u9fa5a-zA-z0-9]/g;
            var title = $(this).find("tr").eq(0).text();
            var titleText = title.replace(reg, "");
            var answer = $(this).find("tr").eq(1).text();
            var options = answer.match(/参考答案：(\w+)]/)[1];
            var opts = options.split("");
            var optonsText = [];
            $(this).find('table[isitemoption="1"]').find("tr").each(function () {
                optonsText.push($(this).find('td:last-child').text());
            });
            var answers = [];
            for (let i = 0; i < opts.length; i++) {
                answers.push(optonsText[optMap[opts[i]]]);
            }
            var titleAnswer = {title: titleText, answers: answers};
            data.push(titleAnswer);
        });
        if (data.length > 0) {
            localStorage.setItem(storageKey, JSON.stringify(data));
            alert("答案获取保存成功!");
            var html = '<div class="setAnswer" style="position: fixed;top: 30%;left: 48%;">' +
                '<input type="button" value="答案获取保存成功!" style="display: inline-block;height: 100px;background-color: red;color: white;">' +
                '</div>';
            $("#_block_content_exam_1").append(html);
        }
    };

    var autoAnswer = function () {
        var answers = JSON.parse(localStorage.getItem(storageKey));
        if (answers.length > 1) {
            $('table[isitem="1"]').each(function () {
                var reg = /[^\u4e00-\u9fa5a-zA-z0-9]/g;
                var title = $(this).find("tr").eq(0).text();
                title = title.replace(reg, "");
                for (let i = 0; i < answers.length; i++) {
                    if (title == answers[i].title) {
                        $(this).find('table[isitemoption="1"]').find("tr").each(function () {
                            var f_answer = $(this).find('td:last-child').text();
                            if ($.inArray(f_answer, answers[i].answers) > -1) {
                                $(this).find('td:first-child').find("input").click();
                            }
                        });
                        continue;
                    }
                }
                //alert("答题完毕!请点击检查!");
            });
        } else {
            alert("没有获取到保存的答案,清先获取答案")
        }
    };

    if (location.href.indexOf('/exam/portal/view_answer.jsp?exam_id') > -1) {
        setAnswer();
    } else if (location.href.indexOf('/exam/portal/exam.jsp?ls') > -1) {
        autoAnswer()
    }

})( jQuery );