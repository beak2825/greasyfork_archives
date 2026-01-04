// ==UserScript==
// @name         农大叛逆分子
// @description  CAU入党积极分子
// @author       sanbei101
// @match        http://202.205.91.77:8090/*
// @match        http://ncst.dangqipiaopiao.com/jjfz/*
// @match        http://ncst.dangqipiaopiao.com/exam/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.0.0/jquery.js
// @icon         http://www.gov.cn/ztzl/17da/183d03632724084a01bb02.jpg
 
// @version 0.0.1.20240507142255
// @namespace https://greasyfork.org/users/1225751
// @downloadURL https://update.greasyfork.org/scripts/494309/%E5%86%9C%E5%A4%A7%E5%8F%9B%E9%80%86%E5%88%86%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/494309/%E5%86%9C%E5%A4%A7%E5%8F%9B%E9%80%86%E5%88%86%E5%AD%90.meta.js
// ==/UserScript==
 
let settings = {
        // 1表示开启,0表示关闭
        // 视频播放相关
        video: 1, // 视频弹窗自动关闭,默认开启
        jump: 1, // 自动切换下一个视频任务点,默认开启(需要开启视频弹窗自动关闭)
        back: 1, // 視頻播放完成自動回到章節列表,默认关闭(需要开启自动切换到下一个任务点)
        class: 1, // 自动切换到未播放的章节,默认开启(需要开启視頻播放完成自動回到章節列表)
        // 章节测试及综合测试
        copy: 1, // 允许右键复制,开启右键菜单
        answer: 1, // 显示“查答案”按钮
        // 期末测试
        test: 1 // 期末测试允许复制
    },
    _self = unsafeWindow,
    url = location.pathname,
    classLists = [],
    videoLists = [];
 
let $$ = top.jQuery;
//console.log(url)
if (url == "/jjfz/lesson/video" && settings.class) {
    //console.log("测试")
 
    if (GM_getValue("dont_note")) {
        let passNum = 0;
        let cl = setInterval(() => {
            getClassList();
            passNum = $$(".lesson_pass").length;
            console.log(passNum)
            if (classLists.length) {
                jumpToVideoFromClass(passNum)
            }
            if (classLists.length) clearInterval(cl);
        }, 1000);
    } else {
 
        video_note();
    }
}
 
if (url.indexOf("play") != -1&& settings.video) {
    playVideo();
    let nextVideoFlag = false,
        nextClassFlag = false;
    console.log("这是视频播放方法")
    let vp = setInterval(() => {
        if (!videoLists.length) {
            getVideoList();
        }
        nextVideoFlag = closeAlert();
        if (settings.jump) {
            nextClassFlag = jumpToVideo(videoLists);
            if (nextVideoFlag) nextClassFlag = nextVideo(videoLists);
        }
        if (settings.back) {
            if (nextClassFlag) goBack();
        }
    }, 1000)
}
 
if (url == "/jjfz/lesson/exam") {
    if (settings.copy) {
        openCopy();
        test_note();
    }
 
    if (settings.answer) {
        let ga = setInterval(() => {
            if ($$("#get_answer").length == 0) {
                $$("#next_question").after("<a href=\"javascript:void(0);\" id=\"get_answer\" data-val=\"2\">查答案</a>");
                $$("#next_question").after("<span> &nbsp; &nbsp; &nbsp; &nbsp;</span>");
                $$("#get_answer").click(function () {
                    getAnswer();
                })
            }
        }, 250)
    }
}
 
if (url == "/jjfz/exam_center/end_exam") {
    if (settings.copy) {
        openCopy();
        test_note();
    }
    if (settings.answer) {
        let ga = setInterval(() => {
            if ($$("#get_answer").length == 0) {
                $$("#next_question").after("<a href=\"javascript:void(0);\" id=\"get_answer\" data-val=\"2\">查答案</a>");
                $$("#next_question").after("<span> &nbsp; &nbsp; &nbsp; &nbsp;</span>");
                $$("#get_answer").click(function () {
                    getAnswer();
                })
            }
        }, 250)
    }
}
if (/\/exam\//.test(url)) {
    openCopy();
    if (GM_getValue("exam_note")) {
    } else {
        exam_note();
    }
}
settings.type = {
    '单选题': "单选题",
    '多选题': '多选题',
    '填空题': '填空题',
    '问答题': '问答题',
    '分析题/解答题/计算题/证明题': 5,
    '阅读理解（选择）/完型填空': 9,
    '判断题': '判断题'
};
 
function getClassList() {
    let classList = []
    if ($$(".l_list_right")) {
        $$(".l_list_right").each((ind, ele) => {
            if ($$(ele).find("div .r_read").text() == " 必 修 ") {
                classList.push($$(ele).find("h2 a"))
            }
        })
    }
    classLists = classList;
}
 
function getVideoList() {
    if ($$(".video_lists li").length) {
        console.log("当前视频" + $$(".video_red1").text())
        videoLists = $$(".video_lists li");
    }
}
 
function jumpToVideoFromClass(passNum) {
    if (passNum != classLists.length) {
        $$(classLists[passNum]).attr('id', 'aRemoveAllTxt');
        document.getElementById("aRemoveAllTxt").click();
    }
}
 
 
function closeAlert() {
    //console.log("测试")
    if ($$(".public_submit").length) {
        //console.log("视频数量" + $$(".video_lists li"))
        let text = $$(".public_text").text();
        if (text.indexOf("当前视频播放完毕") >= 0) {
            return true;
        } else if (text.indexOf("该课程视频你上次观看到") >= 0) {
            $$(".public_cancel").attr('id', 'aRemoveAllTxt');
            document.getElementById("aRemoveAllTxt").click();
            return false;
        } else {
            $$(".public_submit").attr('id', 'aRemoveAllTxt');
            document.getElementById("aRemoveAllTxt").click();
            return false;
        }
    }
}
 
function nextVideo(videoList) {
    let index = $$(videoList).index($$(".video_red1"));
    if (videoList[index + 1]) {
        $$(videoList[index + 1]).children("a").attr('id', 'aRemoveAllTxt');
        document.getElementById("aRemoveAllTxt").click();
        return false;
    } else {
        return true;
    }
}
 
function jumpToVideo(videoList) {
    if ($$(".video_red1").find("a").attr("style") == "width:70%;color:red") {
        let index = $$(videoList).index($$(".video_red1"));
        if (videoList[index + 1]) {
            $$(videoList[index + 1]).children("a").attr('id', 'aRemoveAllTxt');
            document.getElementById("aRemoveAllTxt").click();
        } else {
            return true;
        }
    }
}
 
function goBack() {
    $$(".video_goback").attr('id', 'aRemoveAllTxt');
    document.getElementById("aRemoveAllTxt").click();
}
 
function playVideo() {
    _self.studyTime = function () {
        var diff_time = 5000;
        $.ajax({
            type: "POST",
            cache: false,
            dataType: "json",
            url: "/jjfz/lesson/study_time",
            data: {
                rid: "630089",
                study_time: diff_time,
                _xsrf: $(":input[name='_xsrf']").val()
            },
            success: function () {
            }
        });
        flag = setTimeout("studyTime()", diff_time);
    }
    _self.player.on('pause', function (event) {
        if ($$(".public_submit").length) {
        } else _self.player.play();
    });
}
 
function getAnswer() {
 
    let question = $$(".exam_h2").text(),
        type = String(settings.type[$$(".e_cont_title span").text()]);
    let postData = {
        question: filterImg($$(".exam_h2"), this).replace(/^（\S*）/, '').replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').replace(/[(]\s*[)]。$/, '').replace(/（\s*）。$/, '').replace(/[(]\s*[)]$/, '').replace(/（\s*）$/, ''),
        option: "政治",
        type: Boolean(type) ? type : 10
    }
 
 
    console.log(postData.question);
    console.log(postData.type);
 
 
 
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://api.902000.xyz:88/wkapi.php',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        data: 'q=' +encodeURIComponent(postData.question) + '&type=' + postData.type,
        timeout: 5000,
        onload: function (xhr) {
 
            //console.log(xhr)
            if (xhr.status == 200) {
                let obj = $$.parseJSON(xhr.responseText) || {};
                //return obj.answer;
                let answer = obj.answer;
 
 
                if ($$(".e_cont_title").find("span").text() == "判断题") {
                    if (answer != "网络题库目前没有答案哦，推荐使用学小易或百度查询！（搜不出来可以多点几次，后台会在百度搜索答案）" & answer.indexOf("无答案") == -1) {
                        if (question.indexOf(answer) != -1) {
                            answer = "提示：" + answer + "——可根据提示自行判断正误！"
                        } else {
                            answer = "提示：" + answer + "——可根据提示自行判断正误！"
                        }
                    }
                }
                if ($$(".fuck_answer").length == 0) {
                    $$(".answer_list").after("<div class='fuck_answer'>" + answer + "</div>");
                    $$(".answer_list_box").after("<div class='fuck_answer'>" + answer + "</div>");
                } else {
                    $$(".fuck_answer").text(answer);
                }
            }
        }
    })
}
 
function openCopy() {
    $$(document).ready(new function () {
        document.oncontextmenu = new Function("event.returnValue=true");
        document.onselectstart = new Function("event.returnValue=true");
        document.oncopy = new Function("return true");
    })
}
 

 
 
function alert_note(btn_num, btn_text, note_text, public_text, public_cont_class, submit_fun, cancel_fun) {
    if (btn_num == 1) {
        var public_a = '<a href="#" class="public_submit">' + btn_text[0] + '</a>';
    } else {
        var public_a = '<a href="#" class="public_submit">' + btn_text[0] + '</a> <a href="#" class="public_cancel">' + btn_text[1] + '</a>';
    }
    var public_html = '<div class="public_mask"></div><div class="public_cont ' + public_cont_class + '"><div class="public_title"><h3>' + note_text + '</h3><div class="public_close"></div></div><div class="public_text">' + public_text + '</div><div class="public_btn">' + public_a + '</div></div>';
    $("body").append(public_html);
    $(".public_close").click(function () {
        $(".public_mask").remove();
        $(".public_cont").remove();
    });
    $(".public_mask").click(function () {
        $(".public_mask").remove();
        $(".public_cont").remove();
    });
    if (btn_num == 1) {
        $(".public_submit").click(function () {
            submit_fun();
        })
    } else {
        $(".public_submit").click(function () {
            submit_fun();
        });
        $(".public_cancel").click(function () {
            cancel_fun();
        })
    }
}
 
function filterImg(dom) {
    return $$(dom).clone().find("img[src]").replaceWith(function () {
        return $$("<p></p>").text('<img src="' + $$(this).attr("src") + '">');
    }).end().find("iframe[src]").replaceWith(function () {
        return $$("<p></p>").text('<iframe src="' + $$(this).attr("src") + '"></irame>');
    }).end().text().trim();
}