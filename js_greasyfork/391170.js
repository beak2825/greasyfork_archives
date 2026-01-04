// ==UserScript==
// @name         广东继续教育和公需课自动刷课+自动答题
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  登录后自动刷课和自动答题
// @author       WCT
// @match        http://ggfw.gdhrss.gov.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391170/%E5%B9%BF%E4%B8%9C%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%92%8C%E5%85%AC%E9%9C%80%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%2B%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/391170/%E5%B9%BF%E4%B8%9C%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%92%8C%E5%85%AC%E9%9C%80%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%2B%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var year = "2019";
    var url = location.href;
    // 等待6分钟后进入听课
    if (url.match(/http:\/\/ggfw.gdhrss.gov.cn\/zjjyweb\/user\/index.do/i)) {
        //setTimeout(function() {
        location.href = "http://ggfw.gdhrss.gov.cn/zxpx/auc/myCourse";
        //}, 240000);
        return;
    }
    if (url.match(/http:\/\/ggfw.gdhrss.gov.cn\/zxpx\/index/i)) {
        if($("#x").length > 0){
        	$("#choiceWindow").slideUp(300);
	        $("#backGround").hide();
        }
    }
    // 我的课程 -> 课程详情
    if (url.match(/http:\/\/ggfw.gdhrss.gov.cn\/zxpx\/auc\/myCourse/i)) {
        var course = 0;
        $(".mycourse-row > tbody > tr > td:nth-child(5)").each(function() {
            if ($(this).text().trim() == year) {
                course++;
            }
        })
        if (course == 2) {
            var isOk = false;
            $("a.mycourse-green").each(function(){
                if($(this).parent().prev().prev().prev().text().trim() == year){
                    location.href = location.origin + $(this).attr("href");
                    isOk = ture;
                    return false;
                }
            })
            if(isOk) return;
            $("a.mycourse-orange").each(function(){
                if($(this).parent().prev().prev().prev().text().trim() == year){
                    location.href = location.origin + $(this).attr("href");
                    isOk = ture;
                    return false;
                }
            })
            if(isOk) return;
        }
    }
    // 课程详情 -> 听课 | 答题
    if (url.match(/http:\/\/ggfw.gdhrss.gov.cn\/zxpx\/hyper\/courseDetail/i)) {
        setTimeout(function() {
            if($(".nomap-error").length > 0){
                location.href = "http://ggfw.gdhrss.gov.cn/zxpx/auc/myCourse";
            }
            if ($(".append-plugin-tip > a").length > 0) {
                location.href = location.origin + $(".append-plugin-tip > a").first().attr("href");
                return;
            }
            if($("p.course-intro-status").length > 0 && $("p.course-intro-status").text().trim() != "学时申报状态：已申报学时"){
                toHomeWork();
                setTimeout(function() {
                    location.href = $("#courseDistopList > li > div.distop-topic > div > a.course-intro-btn.course-intro-footer-btn.button-enable").attr("href");
                    //$("#courseDistopList > li > div.distop-topic > div > a.course-intro-btn.course-intro-footer-btn.button-enable").click();
                }, 500)
            }
            return;
        }, 1000);
    }
    // 听课
    if (url.match(/http:\/\/ggfw.gdhrss.gov.cn\/zxpx\/auc\/play\/player/i)) {
        setTimeout(function() {
            var errChecking = setInterval(function() {
                if ($(".prism-ErrorMessage").css("display") != 'none') {
                    location.href = "http://ggfw.gdhrss.gov.cn/zxpx/auc/myCourse";
                    //location.reload();
                }
                if($("#realPlayVideoTime").text() == "100"){
                    if($(".content-unstart").length > 0){
                        location.href = $(".content-unstart").first().parent().attr("href");
                    }else{
                        location.href = "http://ggfw.gdhrss.gov.cn/zxpx/auc/myCourse";
                    }
                }
                if (!$('.prism-play-btn').hasClass('playing')) {
                    $('.prism-play-btn').click();
                } //停止时开始播放
            }, 5000); //错误自动刷新

            p.tag.muted = true; //静音
            p.on("ended", function() {
                $('body').stopTime();
                p.dispose;
                overWatch();
                var learnlist = $("a:contains('未完成')").length != 0 ? $("a:contains('未完成')") : $("a:contains('未开始')");
                if (learnlist.length == 0) {
                    location.href = "http://ggfw.gdhrss.gov.cn/zxpx/auc/myCourse";
                } else {
                    learnlist.each(function() {
                        this.click();
                    })
                }
            });
            map = {}; //删题
            if (!$('.prism-play-btn').hasClass('playing')) {
                $('.prism-play-btn').click();
            } //播放
        }, 1000); //延时1秒进行
        return;
    }
    // 答题
    if (url.match(/http:\/\/ggfw.gdhrss.gov.cn\/zxpx\/auc\/courseExam/i)) {
        $.get("http://tools.xuyinghan.top/api/Question", function(answerItems) {
            $(".exam-subject-text-que").each(function() {
                var questionTitle = $(this).children().prop("lastChild").nodeValue;
                var answer = answerItems.find(p => p["title"] == questionTitle);
                var answers = answer ? JSON.parse(answer["answers"]) : null;
                if (!answers) {
                    $(this).next().find('input').first().prop("checked", true);
                    return true;
                }
                var isOk = false
                $(this).next().children().each(function() {
                    var qa = $(this).text().replace(/(\s+|A、|B、|C、|D、|E、|F、)/gi, '');
                    if (answers.some(p => p == qa)) {
                        $(this).find("input").prop("checked", true);
                        isOk = true;
                    }
                })
                if (!isOk) {
                    $(this).next().find('input').first().prop("checked", true);
                }
            });
            submitExam();
        })
    }
    // 答题有错误则保存错误，都要回到我的课程
    if (url.match(/http:\/\/ggfw.gdhrss.gov.cn\/zxpx\/auc\/examination\/subexam/i)) {
        var newQuestions = [];
        $(".exam-subject-text-panel").each(function() {
            var title = $(this).find(".exam-subject-text-que-title").text().replace(/(\d+、)/gi, '');
            var answers = $(this).find(".exam-subject-text-queanswar").last().html();
            // answers = answers.match(/[A、|B、|C、|D、|E、](.*)<?/gi)[1];
            answers = answers.replace(/(正确答案：|&nbsp;|A、|B、|C、|D、|E、|F、)/gi, '');
            answers = answers.replace(/(<br>)$/, '');
            answers = answers.split("<br>");
            newQuestions.push({
                "Title": title,
                "Answers": JSON.stringify(answers)
            });
        });
        if (newQuestions.length > 0) {
            $.ajax({
                type: "POST",
                url: "http://tools.xuyinghan.top/api/question",
                contentType: 'application/json',
                data: JSON.stringify(newQuestions),
                success: function(res) {
                    // location.href = "http://ggfw.gdhrss.gov.cn/zxpx/auc/myCourse";
                    alert("没拿满分！请截图给开发者Q188655147，谢谢！");
                }
            })
        } else {
            location.href = "http://ggfw.gdhrss.gov.cn/zxpx/auc/myCourse";
            return;
        }
    }
})();