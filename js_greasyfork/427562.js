// ==UserScript==
// @name         慕课神器
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  慕课
// @author       Aisen
// @match        http://mooc.neumooc.com/course/play/*
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_download
// @connect      neu.aisencode.cn
// @requier      https://code.jquery.com/jquery-3.1.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/427562/%E6%85%95%E8%AF%BE%E7%A5%9E%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/427562/%E6%85%95%E8%AF%BE%E7%A5%9E%E5%99%A8.meta.js
// ==/UserScript==
 
 
var window = unsafeWindow;
var $ = unsafeWindow.jQuery;
var setting = {
    time: 3e3, // 默认响应速度为5秒，不建议小于3秒
    answers: {}, //如果有答案则会从服务器获取，如果没有则为空,如果自己有答案可加入
    //格式为 {"outl_D247C619659A4B12987B5E5D148E8065": "B B C"，"outl_6C746E61867D457FAA6218C73AAF5AC3": "C C B"}
    doTest: true, //做题，默认开启true，关闭为false
    doVideo: true, //看视频，默认开启true,关闭为false
    pass:80 //测试通过得分，如果小于80则会重做
 
};
 
 
 
$(function() {
    try{
        main();
 
    }catch (err){
        window.location.reload();
    }
})
 
 
function main(){
    logger('info', 'Init: Neumooc injected.');
    pannel();
    if (isVideo() && setting.doVideo) {
        var tryInitTime = 0;
        var initInterval = setInterval(function() {
            is_500();
            if (isPlayerReady()) {
                clearInterval(initInterval);
                logger('info', 'Init: Success find video player.');
                disableBlurPause();
                waitVideo();
            } else {
                tryInitTime++;
                logger('info', 'Init: Waiting video player.');
                if ($(".fp-ui")) $(".fp-ui").click();
                if (tryInitTime >= 6) {
                    clearInterval(initInterval);
                    logger('warn', 'Init: Can not find player, next outline.');
                }
            }
        }, 1000);
 
    } else {
        logger('info', 'Init: doTest is true or this is test.')
        getAnswer();
    }
 
}
function is_500() {
    //<div class="error-text-2 bounceInDown animated">
    //				<img src="/resources/img/500_bg.png">
    //			</div>
    var err = $('.error-text-2');
    if (err.length != 0) {
        logger('warn', 'is_500: the web is 500.');
        window.location.reload();
 
    }
}
 
// Logger
function logger(type, msg) {
    $(".info").text(msg);
    msg = "[NsumoocStar] " + msg;
    switch (type) {
        case 'warn':
            console.warn(msg);
            break;
        case 'log':
            console.log(msg);
            break;
        case 'info':
            console.info(msg);
            break;
    }
}
//面板
function pannel() {
    GM_addStyle('.mypanel {position: fixed;overflow: hidden;top: 100px;right: 10px; width: 300px;height: 200px;background-color: rgba(251,114,153, 0.8);z-index: 999999;border-radius: 5%;}');
    GM_addStyle('.answers, .askMe, .info {height: 70px;line-height: 70px;flote:left;padding-left: 10px;;border-bottom: rgba(0, 0, 0, .2) dashed 2px;font-size: 13px;color:#fff}');
    GM_addStyle('.askMe {display: none; }');
    GM_addStyle('.askMe a {color:red !important}');
    var html = '<div class="mypanel">'
    html += '<div class="answers"><a href=\"http://www.aisencode.cn" target=\"_blank\">Aisen的博客(゜-゜)つロ 干杯~</a></div>'
    html += '<div class="askMe">'
    html += '<a href="http://wpa.qq.com/msgrd?v=3&uin=201826658&site=qq&menu=yes" target="_blank">如果你有答案！点我联系作者添加。</a>'
    html += '</div>'
    html += '<div class="info">info</div>'
    html += '</div>'
    $("body").append(html);
 
 
 
}
 
//获取答案
function getAnswer() {
    var courseId = window.location.href.match(/courseId=(\S*)/)[1].split("&")[0];
    if (localStorage.getItem('NeumoocCourseId=' + courseId)) {
        localStorage.removeItem('NeumoocCourseId=' + courseId);
        logger('info', 'getAnswer: delete answers from the local.');
    } 
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://neu.aisencode.cn/answer.php",
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(res) {
            if (res.status == 200) {
                var json = JSON.parse(res.responseText);
                if (json[courseId]) {
                    setting.answers = json[courseId].answers;
                    //console.log(answers);
                   // var strAnswer = JSON.stringify(json[courseId].answers);
                    $(".answers").html("该课程有答案。<a href=\"http://wpa.qq.com/msgrd?v=3&uin=201826658&site=qq&menu=yes\" target=\"_blank\">也可以帮刷哦(゜-゜)つロ 干杯~</a>");
                    logger('info', 'getAnswer: Success find answers form the server.');
                    doTest();
 
 
 
                } else {
                    logger('info', 'getAnswer: Not find answers form the server.');
                    $(".answers").text('暂时没有该课程的答案。<a href=\"http://wpa.qq.com/msgrd?v=3&uin=201826658&site=qq&menu=yes\" target=\"_blank\">点我提交(゜-゜)つロ 干杯~</a>');
                    $(".askMe").show();
                }
 
 
            } else {
                $(".answers").text('连接答案服务器失败！');
                logger('warn', 'getAnswer:  can not find the server');
                setting.doTest = false;
            }
        }
    })
 
   
}
 
//测试是否通过
function testHasPassed() {
    var maxCorrectRate = Number($('#maxCorrectRate').text().slice(0, -1));
    if (maxCorrectRate >= setting.pass) {
        return true;
    } else {
        return false;
    }
 
 
 
}
//测试
function doTest() {
    var outlineId = $("li[class ^= 'childLi'][style = 'background-color:#eee;']")[0].classList[1];
    var seq = $(".seq_html");
    if (setting.answers[outlineId] && setting.doTest) {
        if (seq) {
            seq.click();
            setTimeout(function() {
                if (!testHasPassed()) {
                    var answers = setting.answers[outlineId].split(' ');
                    $(".answers").html("该课程有答案。<a href=\"http://wpa.qq.com/msgrd?v=3&uin=201826658&site=qq&menu=yes\" target=\"_blank\">也可以帮刷哦(゜-゜)つロ 干杯~</a>");
                    logger('info', 'doTest: will do test in ' + setting.time + 'ms');
                    setTimeout(function() {
                        logger('info', 'doTest: test is doing.');
                        var btn = $(".btn-primary")[0];
                        btn.click();
                        var num = 0;
                        $(".answers").text('本题答案为：' + answers[num]);
                        var timer = setInterval(function() {
                            is_500();
                            chooseAnswer(answers[num]);
                            num++;
                            var btnNext = $('.btn-primary:last');
                            btnNext.click()
                            if (num == answers.length) {
                                clearInterval(timer);
                                var btnOk = $('.ui-dialog_art-autofocus');
                                var btnClose = $('.ui-dialog_art-button').children('button');
                                setTimeout(function() { btnOk.click(); }, setting.time);
                                setTimeout(function() {
                                    btnClose.click();
                                    logger('info', 'doTest: Finished, will go next Outline in ' + setting.time + 'ms');
                                    //5s后点击下一节
                                    setTimeout(function() { nextOutline() }, setting.time);
                                }, setting.time + 1000);
 
                            } else {
                                $(".answers").text('本题答案为：' + answers[num]);
 
                            }
                        }, setting.time);
                    }, setting.time);
 
 
 
                } else {
 
                    logger('info', 'doTest: the test already passed, will go next Outline in ' + setting.time + 'ms');
                    //等待后点击下一节
                    setTimeout(function() { nextOutline() }, setting.time);
 
                }
            }, 2000);
 
        }
    } else {
        logger('info', 'doTest: dotest is closed or not a test, will go next Outline in ' + setting.time + 'ms');
        //等待后点击下一节
        setTimeout(function() { nextOutline() }, setting.time);
    }
 
 
 
}
 
//选择
function chooseAnswer(answers) {
 
    var btns = $("input[name='optionSelect']");
    var btn;
    for (var i = 0; i < answers.length; i++) {
        try {
            switch (answers[i]) {
                case 'A':
                    btn = btns[0];
                    break;
                case 'B':
                    btn = btns[1];
                    break;
                case 'C':
                    btn = btns[2];
                    break;
                case 'D':
                    btn = btns[3];
                    break;
                case 'E':
                    btn = btns[4];
                    break;
                case 'F':
                    btn = btns[5];
                    break;
                case 'G':
                    btn = btns[6];
                    break;
                case 'H':
                    btn = btns[7];
                    break;
            }
        } catch (err) {
            btn = btns[0];
        }
        btn.click();
    }
}
 
//是否为视频
function isVideo() {
    if ($('.fp-player').length >= 1) {
        return true;
    } else {
        return false;
 
    }
 
}
 
// 视频是否加载完成
function isPlayerReady() {
 
    if (window.flowPlayerObj) {
        //console.log(window.flowPlayerObj);
        return window.flowPlayerObj
    } else {
        return false;
    }
}
 
//解锁暂停
function disableBlurPause() {
    logger('info', 'disableBlurPause: disableBlurPause service started.');
    var disableBlurPauseTimer = setInterval(function() {
        try {
            window.flowPlayerObj.play();
        } catch (e) {
            clearInterval(disableBlurPauseTimer);
            logger('warn', 'Can not find player.');
        }
    }, 500)
}
//等待视频完成
function waitVideo() {
    logger('info', 'waitVideo: waitVideo service started.');
    var nextInterval = setInterval(function() {
        //如果播放完成
        if (isFinished()) {
            clearInterval(nextInterval);
            getAnswer()
 
        } else {
            logger('info', 'waitVideo: Waiting video finish.');
        }
    }, 1000)
}
 
// 跟进播放进度
function isFinished() {
    return window.flowPlayerObj.finished;
}
 
// 跳转到下节课
function nextOutline() {
    var outlineId = $("input#outlineId").val();
    var currentOutline = $('ul li.outl_' + outlineId); // 当前课程li
    var nextOutline;
    var next = currentOutline.nextAll();
    if (next.length != 0) {
        nextOutline = $(next[0]);
 
    } else {
        var nextAll = currentOutline.parents('li.parent_li').nextAll();
        if (nextAll.length != 0) {
            nextOutline = $($(nextAll[0]).children("ul").children('li')[0]);
        }
 
    }
    //var text = nextOutline.find('font').text();
    var nextOutlineUrl = nextOutline.find("a:first").attr('href');
    nextOutlineUrl ? window.location.href = nextOutlineUrl : logger('warn', 'Can not find next Outline or had finished.');
}