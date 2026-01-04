// ==UserScript==
// @name         党旗飘飘，实现一键连播所有视频的功能（SDU适配版）（某些其它党旗飘飘平台也可适用）
// @namespace    DeepWater
// @version      1.0.6
// @description  适配山大。去除网页切换监听器，去除暂停计数器，实现进入课程之后，自动连播完成所有的必修课的功能。由“我就是积极分子”插件修改而成，与之相比，实现完全的自动连播。此文件仅供脚本学习！！！禁止应用到入党培训平台！！！
// @author       DeepWater
// @match        http://rudangpx.sdu.edu.cn/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @require      https://code.jquery.com/jquery-2.0.0.min.js
// @icon         http://www.gov.cn/ztzl/17da/183d03632724084a01bb02.jpg

// @downloadURL https://update.greasyfork.org/scripts/517145/%E5%85%9A%E6%97%97%E9%A3%98%E9%A3%98%EF%BC%8C%E5%AE%9E%E7%8E%B0%E4%B8%80%E9%94%AE%E8%BF%9E%E6%92%AD%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%91%E7%9A%84%E5%8A%9F%E8%83%BD%EF%BC%88SDU%E9%80%82%E9%85%8D%E7%89%88%EF%BC%89%EF%BC%88%E6%9F%90%E4%BA%9B%E5%85%B6%E5%AE%83%E5%85%9A%E6%97%97%E9%A3%98%E9%A3%98%E5%B9%B3%E5%8F%B0%E4%B9%9F%E5%8F%AF%E9%80%82%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/517145/%E5%85%9A%E6%97%97%E9%A3%98%E9%A3%98%EF%BC%8C%E5%AE%9E%E7%8E%B0%E4%B8%80%E9%94%AE%E8%BF%9E%E6%92%AD%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%91%E7%9A%84%E5%8A%9F%E8%83%BD%EF%BC%88SDU%E9%80%82%E9%85%8D%E7%89%88%EF%BC%89%EF%BC%88%E6%9F%90%E4%BA%9B%E5%85%B6%E5%AE%83%E5%85%9A%E6%97%97%E9%A3%98%E9%A3%98%E5%B9%B3%E5%8F%B0%E4%B9%9F%E5%8F%AF%E9%80%82%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==





let settings = {
    // 1表示开启,0表示关闭
    // 视频播放相关
    video: 1, // 视频弹窗自动关闭,默认开启
    jump: 1, // 自动切换下一个视频任务点,默认开启(需要开启视频弹窗自动关闭)
    back: 1, // 視頻播放完成自動回到章節列表,默认关闭(需要开启自动切换到下一个任务点)
    class: 1, // 自动切换到未播放的章节,默认开启(需要开启視頻播放完成自動回到章節列表)
},
    _self = unsafeWindow,
    url = location.pathname,
    classLists = [],
    videoLists = [];

GM_setValue("dont_note", true);
const urlregex = /\?([^&]*&)?required/;
const numregex = /\d+/g;
let $$ = top.jQuery;

//console.log("测试");
//console.log(url)
console.log($$(".l_list_right"));
//console.log("测试");
//console.log(url)
if (url == "/jjfz/lesson/video" && settings.class) {
    console.log(GM_getValue("dont_note"));
    var locatedflag = urlregex.test(window.location.href);

    if (locatedflag == 0){

        console.log($$('a:contains("必修")'));
        $$('a:contains("必修")')[0].click();
        //         let selectinterval = setInterval(() => {
        //             console.log(url);
        //             console.log($$('a:contains("必修")'));
        //             $$('a:contains("必修")')[0].click();
        //         }, 100000000);
    }
    if (GM_getValue("dont_note")) {
        let passNum = 0;
        let cl = setInterval(() => {
            getClassList();
            console.log($$(".lesson_pass".length));
            passNum = $$(".lesson_pass").length;
            console.log('数字',passNum);
            console.log('视频表',classLists);
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
    window.addEventListener('load', ()=>{
        var video = document.getElementById("video");
        console.log(video);
        console.log("自动播放");
        video.play().catch(function(error) {
            console.log("自动播放失败: ", error);
        });
    });
    playVideo();
    let nextVideoFlag = false,
        nextClassFlag = false;
    //console.log("这是视频播放方法")
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
        //console.log("自动播放视频测试");
    }, 1000)
    }

// if (url == "/jjfz/lesson/exam") {
//     if (settings.copy) {
//         openCopy();
//         test_note();
//     }

//     if (settings.answer) {
//         let ga = setInterval(() => {
//             if ($$("#get_answer").length == 0) {
//                 $$("#next_question").after("<a href=\"javascript:void(0);\" id=\"get_answer\" data-val=\"2\">查答案</a>");
//                 $$("#next_question").after("<span> &nbsp; &nbsp; &nbsp; &nbsp;</span>");
//                 $$("#get_answer").click(function () {
//                     getAnswer();
//                 })
//             }
//         }, 250)
//         }
// }

// if (url == "/jjfz/exam_center/end_exam") {
//     if (settings.copy) {
//         openCopy();
//         test_note();
//     }
//     if (settings.answer) {
//         let ga = setInterval(() => {
//             if ($$("#get_answer").length == 0) {
//                 $$("#next_question").after("<a href=\"javascript:void(0);\" id=\"get_answer\" data-val=\"2\">查答案</a>");
//                 $$("#next_question").after("<span> &nbsp; &nbsp; &nbsp; &nbsp;</span>");
//                 $$("#get_answer").click(function () {
//                     getAnswer();
//                 })
//             }
//         }, 250)
//         }
// }
// if (/\/exam\//.test(url)) {  不懂
//     openCopy();
//     if (GM_getValue("exam_note")) {
//     } else {
//         exam_note();
//     }
// }
// settings.type = {
//     '单选题': "单选题",
//     '多选题': '多选题',
//     '填空题': '填空题',
//     '问答题': '问答题',
//     '分析题/解答题/计算题/证明题': 5,
//     '阅读理解（选择）/完型填空': 9,
//     '判断题': '判断题'
// };

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
        console.log($$(classLists[passNum]).attr('id', 'aRemoveAllTxt'));
        console.log(document.getElementById("aRemoveAllTxt"));
        document.getElementById("aRemoveAllTxt").target = "_self";
        document.getElementById("aRemoveAllTxt").click();
    }
    else{
        console.log('是否返回',$$('a.head_cut:contains("课程中心")'));
        $$('a.head_cut:contains("课程中心")')[0].click();
    }
}



if(url=='/jjfz/lesson'){


    // 你的代码
    console.log('111');
    var listItems = document.querySelectorAll('.lesson_c_ul li');
    var Iitem
    // 遍历每个 li 元素
    for( Iitem = 0 ; Iitem <= listItems.length ; Iitem++){

        // 在这里，你可以访问每个 li 元素


        // 例如，获取每个 li 元素中的 a 标签
        var dllink = listItems[Iitem].querySelector('dl');
        if (dllink) {
            let usefultext = dllink.textContent;
            let Numbers = usefultext.match(/\d+/g);

            let totaliednumber = parseInt(Numbers[0]);
            let finishiednumber = parseInt(Numbers[1]);
            if (totaliednumber > finishiednumber){
                var clickterm = listItems[Iitem].querySelector('.study[href="javascript:void(0);"]');
                clickterm.click();
                console.log(listItems[Iitem]);
                break;
            }
            console.log('数字们',Numbers)
            console.log(totaliednumber > finishiednumber)
        }

        // 你可以在这里添加更多的逻辑来处理每个 li 元素

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

// function getAnswer() {

//     let question = $$(".exam_h2").text(),
//         type = String(settings.type[$$(".e_cont_title span").text()]);
//     let postData = {
//         question: filterImg($$(".exam_h2"), this).replace(/^（\S*）/, '').replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').replace(/[(]\s*[)]。$/, '').replace(/（\s*）。$/, '').replace(/[(]\s*[)]$/, '').replace(/（\s*）$/, ''),
//         option: "政治",
//         type: Boolean(type) ? type : 10
//     }


//     console.log(postData.question);
//     console.log(postData.type);



//     GM_xmlhttpRequest({
//         method: 'POST',
//         url: 'http://api.902000.xyz:88/wkapi.php',
//         headers: {
//             'Content-type': 'application/x-www-form-urlencoded',
//         },
//         data: 'q=' +encodeURIComponent(postData.question) + '&type=' + postData.type,
//         timeout: 5000,
//         onload: function (xhr) {

//             //console.log(xhr)
//             if (xhr.status == 200) {
//                 let obj = $$.parseJSON(xhr.responseText) || {};
//                 //return obj.answer;
//                 let answer = obj.answer;


//                 if ($$(".e_cont_title").find("span").text() == "判断题") {
//                     if (answer != "网络题库目前没有答案哦，推荐使用学小易或百度查询！（搜不出来可以多点几次，后台会在百度搜索答案）" & answer.indexOf("无答案") == -1) {
//                         if (question.indexOf(answer) != -1) {
//                             answer = "提示：" + answer + "——可根据提示自行判断正误！"
//                         } else {
//                             answer = "提示：" + answer + "——可根据提示自行判断正误！"
//                         }
//                     }
//                 }
//                 if ($$(".fuck_answer").length == 0) {
//                     $$(".answer_list").after("<div class='fuck_answer'>" + answer + "</div>");
//                     $$(".answer_list_box").after("<div class='fuck_answer'>" + answer + "</div>");
//                 } else {
//                     $$(".fuck_answer").text(answer);
//                 }
//             }
//         }
//     })
// }

// function openCopy() {
//     $$(document).ready(new function () {
//         document.oncontextmenu = new Function("event.returnValue=true");
//         document.onselectstart = new Function("event.returnValue=true");
//         document.oncopy = new Function("return true");
//     })
// }

// function exam_note() {
//     alert_note(2, ["不同意", "同意"], "考试说明及免责声明", '<p><font color=red>期末考试未经测试，不保证可用性！！！</font></p>' +
//                '<p><font color="red">请仔细阅读以下内容</font></p>' +
//                '<p>考试平台目前无法测试，脚本是否可以还不清楚</p>' +
//                '<p>当前实现方式由推测而来</p>' +
//                '<p><font color="red">你使用脚本造成的损失自行承担</font></p>' +
//                '<p><font color="red">你点击同意视为遵守以上内容！</font></p>' +
//                '<p>欢迎捐赠,对于你的捐赠表示由衷感谢&nbsp; &nbsp;<a href="https://greasyfork.org/rails/active_storage/representations/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBazlZIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2148cc9198f8c2d3ac31d261accd3b51e8b97442/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCam9VY21WemFYcGxYM1J2WDJ4cGJXbDBXd2RwQWNocEFjZz0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--1a5b26c2d16a60cf381d61dcd5b41cdffac6d9dc/15991110507.jpg?locale=zh-CN"><font color="red">|点击向我捐赠|</font></a></p>',
//                'public_cont1', function () {
//         $(".public_close").click(); //此为关闭方法
//         GM_setValue("exam_note", false)
//         err_note()
//     }, function () {
//         $(".public_close").click(); //此为关闭方法
//         GM_setValue("exam_note", true)
//         location.href = "https://greasyfork.org/zh-CN/scripts/414487-%E6%88%91%E5%B0%B1%E6%98%AF%E7%A7%AF%E6%9E%81%E5%88%86%E5%AD%90";
//     });
// }

function video_note() {
    alert_note(2, ["关闭", "不再提示"], "我就是积极分子脚本使用说明",'本章已学完',
               'public_cont1', function () {
        $(".public_close").click(); //此为关闭方法
        GM_setValue("dont_note", true)
    }, function () {
        $(".public_close").click(); //此为关闭方法
        GM_setValue("dont_note", true)
        location.href = "https://greasyfork.org/zh-CN/scripts/414487-%E6%88%91%E5%B0%B1%E6%98%AF%E7%A7%AF%E6%9E%81%E5%88%86%E5%AD%90";
    });
}

// function test_note() {
//     alert_note(1, ["关闭"], "我就是积极分子答题使用说明", '<p>由于精力有限，实在无法提供用户界面</p>' +
//                '<p>题库来源于网络，不保证准确性！！！</p>' +
//                '<p><font color=red>这个题库的无延迟查询通道已经关了,免费的果然一般（哈哈）</font></p>' +
//                '<p>作者没钱搞服务器整题库，所以你懂的</p>' +
//                '<p>将就用一下就好，建议打开复制自行搜索！</p>' +
//                '<p>推荐使用学小易，非常准确，或者百度,<font color=red>欢迎向我捐赠</font></p>' +
//                //'<p>欢迎捐赠,对于你的捐赠表示由衷感谢&nbsp; &nbsp;<a href="https://greasyfork.org/rails/active_storage/representations/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBazlZIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2148cc9198f8c2d3ac31d261accd3b51e8b97442/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCam9VY21WemFYcGxYM1J2WDJ4cGJXbDBXd2RwQWNocEFjZz0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--1a5b26c2d16a60cf381d61dcd5b41cdffac6d9dc/15991110507.jpg?locale=zh-CN">|点击向我捐赠|</a></p>', +
//                '<img src="https://greasyfork.org/rails/active_storage/representations/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBazlZIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2148cc9198f8c2d3ac31d261accd3b51e8b97442/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCam9VY21WemFYcGxYM1J2WDJ4cGJXbDBXd2RwQWNocEFjZz0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--1a5b26c2d16a60cf381d61dcd5b41cdffac6d9dc/15991110507.jpg?locale=zh-CN">',
//                'public_cont1', function () {
//         $(".public_close").click(); //此为关闭方法
//     });
// }

function err_note() {
    alert_note(1, ["关闭"], "如果要继续使用脚本请点击同意", '<p>如果要继续使用脚本请点击同意</p>' +
               //'<p>欢迎捐赠,对于你的捐赠表示由衷感谢&nbsp; &nbsp;<a href="https://greasyfork.org/rails/active_storage/representations/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBazlZIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2148cc9198f8c2d3ac31d261accd3b51e8b97442/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCam9VY21WemFYcGxYM1J2WDJ4cGJXbDBXd2RwQWNocEFjZz0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--1a5b26c2d16a60cf381d61dcd5b41cdffac6d9dc/15991110507.jpg?locale=zh-CN">|点击向我捐赠|</a></p>', +
               '<img src="https://greasyfork.org/rails/active_storage/representations/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBazlZIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2148cc9198f8c2d3ac31d261accd3b51e8b97442/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCam9VY21WemFYcGxYM1J2WDJ4cGJXbDBXd2RwQWNocEFjZz0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--1a5b26c2d16a60cf381d61dcd5b41cdffac6d9dc/15991110507.jpg?locale=zh-CN">',
               'public_cont1', function () {
        $(".public_close").click(); //此为关闭方法
        exam_note();
    });
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
