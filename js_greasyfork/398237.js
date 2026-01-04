// ==UserScript==
// @name         广东继续教育和公需课自动登录+刷课+答题
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  登录后自动刷课和自动答题
// @author       WCT
// @match        http://ggfw.gdhrss.gov.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398237/%E5%B9%BF%E4%B8%9C%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%92%8C%E5%85%AC%E9%9C%80%E8%AF%BE%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%2B%E5%88%B7%E8%AF%BE%2B%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/398237/%E5%B9%BF%E4%B8%9C%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%92%8C%E5%85%AC%E9%9C%80%E8%AF%BE%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%2B%E5%88%B7%E8%AF%BE%2B%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var cookieName = "jinshui"
    var year = "2019";
    var url = location.href;
    var ck = getCk(cookieName);
    if(!ck){
        return false;
    }
    year = ck.listenYear;
    if (url.match(/http:\/\/ggfw.gdhrss.gov.cn\/ssologin\/login/i)) {
        setTimeout(function(){
            $("#username_personal").val(ck.account);
            $("#password_personal").val(ck.password);
            var img = document.getElementById('codeimg');
            var imgBase64 = getBase64Image(img);
            var ttdata = {
                "username": "wangchengtian",
                "password": "wct742368",
                "image": imgBase64
            }
            $.ajax({
                type: "post",
                url: "http://api.ttshitu.com/base64",
                contentType: "application/json; charset=utf-8",
                async: false,
                dataType : "json",
                data: JSON.stringify(ttdata),
                success: function(res){
                    if(res.success){
                        $("#vcode_personal").val(res.data.result);
                        fnDoPersonLogin();
                        setTimeout(function(){
                            fnDoNormalLogin();
                        },1500);
                    }
                }
            });
        },1000);
    }
    // 等待6分钟后进入听课
    if (url.match(/http:\/\/ggfw.gdhrss.gov.cn\/zjjyweb\/user\/index.do/i)) {
        //setTimeout(function() {
        location.href = "http://ggfw.gdhrss.gov.cn/zxpx/auc/myCourse";
        //}, 240000);
        return;
    }
    if (url.match(/http:\/\/ggfw.gdhrss.gov.cn\/zxpx\/index/i)) {
        //         if($("#x").length > 0){
        //         	$("#choiceWindow").slideUp(300);
        // 	        $("#backGround").hide();
        //         }
        location.href = "http://ggfw.gdhrss.gov.cn/zxpx/auc/myCourse";
    }
    // 自动添加课程
    if(url.match(/http:\/\/ggfw.gdhrss.gov.cn\/zxpx\/hyper\/search\/courselist/i)) {
        var addCourse = 1;
        $(".course-detail-btn > a").each(function(i){
            if($(this).text() == "进入选课"){
                // /zxpx/hyper/courseDetail?ocid=OC201903290000005403&rt=-1&cls=-1
                var ocid = $(this).attr("href").match(/ocid=(.*?)&/i)[1];
                com.insigma.ajax({
                    url:"/zxpx/auc/shopcart/good",
                    dataType:'json',
                    data:{'ocid':ocid},
                    type:'post',
                    success: function(data) {

                    }
                });
                addCourse -= 1;
                if(addCourse <= 0){
                    return false;
                }
            }
        });
        if(addCourse <= 0){
            location.href = "http://ggfw.gdhrss.gov.cn/zxpx/auc/myCourse";
        }
    }
    // 我的课程 -> 课程详情
    if (url.match(/http:\/\/ggfw.gdhrss.gov.cn\/zxpx\/auc\/myCourse/i)) {
        $("#btn-logout").click(function(){
            clearCookie(cookieName);
            //                 location.href = "http://ggfw.gdhrss.gov.cn/ssologin/login";
            top.location.href="/zxpx/dologout?ret_url=http://ggfw.gdhrss.gov.cn:80/zxpx";
        })
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
        else if(course < 2){
            $(".mycourse-row > tbody > tr > td:nth-child(5)").each(function(i) {
                if ($(this).text().trim() == "暂未选定") {
                    course += 1;
                    var stucouid = $(".mycourse-row-operate").eq(i).find("a:nth-child(3)").attr("href").match(/selectExtyear\('(.*?)'\)/i)[1];
                    com.insigma.ajax({
                        url: "/zxpx/auc/mycourse/changeyear",
                        dataType: 'json',
                        data: {
                            _method: 'put',
                            'stucouid': stucouid,
                            'year': year
                        },
                        type: 'post',
                        success: function(data) {
                            //                         window.location.reload();
                        }
                    });
                    if(course >= 2){
                        return false;
                    }
                }
            })
            if(course >= 2){
                location.reload();
            }
            else {
                location.href = "http://ggfw.gdhrss.gov.cn/zxpx/hyper/search/courselist";
            }
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
        var grade = $(".exam-message-question").text().match(/\d+/g).toString();
        var ck = JSON.parse(getCookie(cookieName));
        $.ajax({
            type: "get",
            async: false,
            url: "http://tools.xuyinghan.top/api/Customer/UploadGrade?year=" + year + "&account=" + ck.account + "&grade=" + grade,
            success: function(d){
                if(!d || !d.data){
                    return false;
                }
            }
        });
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

// 设置cookie
function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ";expires=" + exdate.toGMTString() + ";path=/";
}
// 读取cookie
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
    }
    return "";
}
// 检查cookie
function checkCookie(c_name) {
    var username = getCookie(c_name);
    console.log(username);
    if (username != null && username != "")
    { return true; }
    else
    { return false; }
}
// 清除cookie
function clearCookie(name) {
    setCookie(name, "", -1);
}
function getCk(cookieName){
    var ck = getCookie(cookieName);
    if(ck && ck != "undefined"){
        ck = JSON.parse(ck);
    } else {
        $.ajax({
            type: "get",
            async: false,
            url: "http://tools.xuyinghan.top/api/Customer/GetCustomerIsAwait",
            success: function(d){
                if(!d){
                    return false;
                }
                ck = d;
                setCookie(cookieName, JSON.stringify(d), 2);
            }
        });
    }
    return ck;
}
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
    var dataURL = canvas.toDataURL(ext);
    var base64 = dataURL.slice(22);
    return base64;
}