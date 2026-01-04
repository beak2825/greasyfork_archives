// ==UserScript==
// @name         超星尔雅_智慧树_助手
// @namespace    http://oibit.cn/
// @version      1.1.0
// @description  超星尔雅、智慧树|答题、查询、收录
// @author       LangHu
// @match        *://mooc1-1.chaoxing.com/*
// @match        *://*.zhihuishu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/370610/%E8%B6%85%E6%98%9F%E5%B0%94%E9%9B%85_%E6%99%BA%E6%85%A7%E6%A0%91_%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/370610/%E8%B6%85%E6%98%9F%E5%B0%94%E9%9B%85_%E6%99%BA%E6%85%A7%E6%A0%91_%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

'use strict';

var CourseListElement = [];
var CourseListArray = [];
var Timer = null;
var VideoPlayer = {};
var QuestionListElement = [];
var QuestionListArray = [];
var QuestionAnwserSize = 0;

function CollectRequest(title,answer) {
    var url = 'http://erya.oibit.cn/collect.php?title=' + title + '&answer=' + answer;
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
           // 这里写处理函数
            // console.log(response.responseText);
            var Result = jQuery.parseJSON(response.responseText);
            if ( Result.code == 1) {
                $('#SearchAnswer').children('table').children('tbody').append('<tr><td>' + title + '</td><td>' + answer + '</td><td>收录成功</td></tr>');
            } else if ( Result.code == 2) {
                $('#SearchAnswer').children('table').children('tbody').append('<tr><td>' + title + '</td><td>' + answer + '</td><td>更新成功</td></tr>');
            } else if ( Result.code == 3) {
                $('#SearchAnswer').children('table').children('tbody').append('<tr><td>' + title + '</td><td>' + answer + '</td><td>更新失败</td></tr>');
            } else {
                $('#SearchAnswer').children('table').children('tbody').append('<tr><td>' + title + '</td><td>' + answer + '</td><td>收录失败</td></tr>');
            }
        }
    });
}

function CollectionAnswer() {
    $('body').append('<div id="SearchAnswer" style="position: fixed; top:20%; right:10px; width:400px; height:300px; background-color:#0f0; border:2px; border-style:dashed; overflow:auto; text-align:center; z-index:999;"><h3>收录答案</h3><table border="1"><thead><tr><th>问题</th><th>答案</th><th>状态</th></tr></thead><tbody></tbody></table></div>');
    var QuestionList = $('.TiMu');
    for (var i = 0 ; i < QuestionList.length ; i++) {
        var answerList = "ABCD";
        var title = $(QuestionList[i]).children('.Cy_TItle').children('div').text();
        title = $.trim(title.substring(0,title.length-6));
        var answer = $($(QuestionList[i]).children('.Py_answer').children('span')[0]).text();
        answer = $.trim(answer.replace('\r','').replace('\n','').replace(' ','').replace('正确答案：',''));
        if ( answerList.indexOf(answer) >= 0 ) {
            answer = $($(QuestionList[i]).children('.Cy_ulTop').children('form').children('li')[answerList.indexOf(answer)]).children('div').children('a').text();
            answer = $.trim(answer.replace('\r','').replace('\n','').replace(' ','').replace('正确答案：',''));
        }
        if ( answer.length == 0 ){
            answer = $($(QuestionList[i]).find('.Py_answer').children('span')[0]).text();
            answer = $.trim(answer.replace('\r','').replace('\n','').replace(' ','').replace('正确答案：',''));
        }
        CollectRequest(title,answer);
    }
    console.log('收录完成');
};

function SearchAnswer() {
    $('body').append('<div id="SearchAnswer" style="position: fixed; top:20%; right:10px; width:400px; height:300px; background-color:#afa; border:2px; border-style:dashed; overflow:auto; text-align:center; z-index:999;"><h3>查询答案</h3><table border="1"><thead><tr><th>问题</th><th>答案</th></tr></thead><tbody></tbody></table></div>');
    var title = $('.Cy_TItle')[0].lastElementChild.firstChild.data;
    title = $.trim(title);
    title = title.substring(0,title.length-6).replace('\r','').replace('\n','').replace(' ','');
    console.log(title);
    var url = 'http://erya.oibit.cn/search.php?title='+ title ;
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
        //这里写处理函数
            var Result = jQuery.parseJSON(response.responseText);
            if ( Result.data.length == 0 ) {
                $('#SearchAnswer').children('table').children('tbody').append('<tr><td>' + title + '</td><td>未查询到答案</td></tr>');
            } else {
                for (var i = 0 ; i < Result.data.length ; i++ ) {
                    $('#SearchAnswer').children('table').children('tbody').append('<tr><td>' + Result.data[i].title + '</td><td>' + Result.data[i].answer + '</td></tr>');
                }
            }
        }
    });
}


function Study(){
    var IframeUrl = '#';
    var obj = $('#iframe');
    console.log(obj);
    //alert(IframeUrl);
    if ( IframeUrl.indexOf('/knowledge/cards') >=0 ) {
        $('body').append('<div id="SearchAnswer" style="position: fixed; top:20%; left:10px; width:400px; height:300px; background-color:#afa; border:2px; border-style:dashed; overflow:auto; text-align:center; z-index:999;"><h3>查询答案</h3><table border="1"><thead><tr><th>问题</th><th>答案</th></tr></thead><tbody></tbody></table></div>');
        return;
    }
}

function tips(text, color="red") {
    console.log("%c【oibit.cn】：" + text , "color:" + color);
}

function RegisterBody() {
    $('body').append('<div id="Erya_oibit_cn" style="position: fixed; top:20%; left:10px; width:400px; height:300px; background-color:#0f0; border:2px; border-style:dashed; overflow:auto; text-align:center; z-index:999;"><h3>查询答案</h3><table border="1"><thead><tr><th>问题</th><th>答案</th></tr></thead><tbody></tbody></table></div>');
}

function ReleaseBody() {
    $('#Erya_oibit_cn').remove();
}

function RegisterLine(title, answer) {
    $('#Erya_oibit_cn').children('table').children('tbody').append('<tr><td>' + title + '</td><td>' + answer + '</td></tr>');
}

/*
**    尔雅课程脚本
**    oibit.cn
**    Begin
*/
function eryaAnwserQuestion() {
    QuestionListElement = {};
    QuestionListArray = [];
    QuestionAnwserSize = 0;
    tips("尝试获取题目......");
    var AnwserQuestuionStatus = $("iframe").contents().find(".ans-job-finished").length > 0 ? true : false;
    if ( AnwserQuestuionStatus == true ) {
        tips("题目已完成，进入下一个课时......(3s)");
        setTimeout(function() {
            eryaSwitchToCourse();
        }, 3000);
        return false;
    }
    QuestionListElement = $("iframe").contents().find("iframe").contents().find("iframe").contents().find("div.TiMu");
    QuestionListArray = new Array();
    for (var i = 0; i < QuestionListElement.length; i++) {
        var QuestionElement = {};
        var titleElement = $(QuestionListElement[i]).children("div.Zy_TItle");
        var anwserElement = titleElement.next("div");
        var QuestionTitle = titleElement.children("div").html().replace('\r','').replace('\n','').replace(' ','');
        if ( QuestionTitle.indexOf("【判断题】") != -1 ) {
            QuestionElement.type = "pd";
            QuestionElement.title = QuestionTitle.replace('【判断题】',''); //.replace('【单选题】','');
            QuestionElement.yesElement = $(anwserElement.find("div>ul>li")[0]).children(1);
            QuestionElement.noElement = $(anwserElement.find("div>ul>li")[1]).children(1);
        } else if ( QuestionTitle.indexOf("【单选题】") != -1 ) {
            QuestionElement.type = "dx";
            QuestionElement.title = QuestionTitle.replace('【单选题】','');
            QuestionElement.AElement = $(anwserElement.find("ul>li")[0]).children(1);
            QuestionElement.AText = $(anwserElement.find("ul>li")[0]).find("a").text();
            QuestionElement.BElement = $(anwserElement.find("ul>li")[1]).children(1);
            QuestionElement.BText = $(anwserElement.find("ul>li")[1]).find("a").text();
            QuestionElement.CElement = $(anwserElement.find("ul>li")[2]).children(1);
            QuestionElement.CText = $(anwserElement.find("ul>li")[2]).find("a").text();
            QuestionElement.DElement = $(anwserElement.find("ul>li")[3]).children(1);
            QuestionElement.DText = $(anwserElement.find("ul>li")[3]).find("a").text();
        } else if ( QuestionTitle.indexOf("【多选题】") != -1 ) {
            QuestionElement.type = "zdx";
            QuestionElement.title = QuestionTitle.replace('【多选题】','');
            QuestionElement.AElement = $(anwserElement.find("ul>li")[0]).children(1);
            QuestionElement.AText = $(anwserElement.find("ul>li")[0]).find("a").text();
            QuestionElement.BElement = $(anwserElement.find("ul>li")[1]).children(1);
            QuestionElement.BText = $(anwserElement.find("ul>li")[1]).find("a").text();
            QuestionElement.CElement = $(anwserElement.find("ul>li")[2]).children(1);
            QuestionElement.CText = $(anwserElement.find("ul>li")[2]).find("a").text();
            QuestionElement.DElement = $(anwserElement.find("ul>li")[3]).children(1);
            QuestionElement.DText = $(anwserElement.find("ul>li")[3]).find("a").text();
        }
        QuestionListArray.push(QuestionElement);
    }
    if (QuestionListArray.length == 0) {
        tips("未获取到题目，5秒后重试......(5s)");
        setTimeout(function() {
            eryaAnwserQuestion();
        }, 5000);
        return 0;
    }
    RegisterBody();
    for (i = 0; i < QuestionListArray.length; i++) {
        var title = QuestionListArray[i].title;
        eryaGetAndDoAnswer(title);
    }
    Timer = setInterval(function(){
        if (QuestionAnwserSize == QuestionListElement.length) {
            clearInterval(Timer);
            RegisterLine("查询完毕！60秒自动提交......", null);
            tips("查询完毕！60秒自动提交！......(60s)");
            setTimeout(function() {
                $("iframe").contents().find("iframe").contents().find('iframe').contents().find('div.ZY_sub>a.Btn_blue_1').click();
                setTimeout(function() {
                    $("iframe").contents().find("iframe").contents().find('iframe').contents().find('div#confirmSubWin').find("a.bluebtn").click();
                    setTimeout(function() {
                        ReleaseBody();
                        tips("当前课程已完成 | 剩余课程：" + CourseListArray.length, 'blue');
                        tips("进入下一节课程......");
                        eryaSwitchToCourse();
                    }, 5000);
                }, 5000);
            },60000);
        }
    }, 1000);

}

function eryaGetAndDoAnswer(title) {
    var url = 'http://erya.oibit.cn/search.php?title='+ title ;
    /*var data = {
                    question: encodeURIComponent(title), // url编码 urlencode(ev)
                    token: $.md5("eryananayunn" + encodeURIComponent(title)),
                    source: "z",
                    appendMsg: "RWlMekFIMUc5M1pYZklXb3N1WFRBQT09", // appendMsg
                };
    $.ajax({
                    method: "POST",
                    url: "https://houtaiguaya.nanayun.com/eryaconfig/auto_answer.php",
                    data: data,
                    success: function(response) {
                        console.log(response);
                    }
                });*/
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
        //这里写处理函数
            QuestionAnwserSize++;
            var Result = jQuery.parseJSON(response.responseText);
            if ( Result.data.length == 0 ) {
                RegisterLine(title, "未查询到答案");
                for (var i = 0; i < QuestionListArray.length; i++) {
                    if ( QuestionListArray[i].title == title ) {
                        if ( QuestionListArray[i].type == "pd" ) {
                            QuestionListArray[i].yesElement.click();
                        } else{
                            QuestionListArray[i].AElement.click();
                        }
                    }
                }
            } else {
                RegisterLine(title, Result.data[0].answer.replace(' ','').replace('\r','').replace('\n',''));
                if ( Result.data[0].answer.indexOf("×") == -1 && Result.data[0].answer.indexOf("√") == -1) {
                    if ( Result.data[0].answer.indexOf("|") == -1 ) {
                        for (var i = 0; i < QuestionListArray.length; i++) {
                            var answer = Result.data[0].answer.replace(' ','').replace('\r','').replace('\n','');
                            if ( QuestionListArray[i].title == title ) {
                                if ( QuestionListArray[i].AText == answer ) {
                                    QuestionListArray[i].AElement.click();
                                } else if ( QuestionListArray[i].BText == answer ) {
                                    QuestionListArray[i].BElement.click();
                                } else if ( QuestionListArray[i].CText == answer ) {
                                    QuestionListArray[i].CElement.click();
                                } else if ( QuestionListArray[i].DText == answer ) {
                                    QuestionListArray[i].DElement.click();
                                }
                            }
                        }
                    } else {

                    }
                } else {
                    for (var i = 0; i < QuestionListArray.length; i++) {
                        var answer = Result.data[0].answer.replace(' ','').replace('\r','').replace('\n','');
                        if ( QuestionListArray[i].title == title ) {
                            if ( answer == "×" ) {
                                QuestionListArray[i].noElement.click();
                            } else if ( answer == "√" ) {
                                QuestionListArray[i].yesElement.click();
                            }
                        }
                    }
                }
            }
        }
   });
}

function eryaGetAllCourse() {
    CourseListElement = $("div.right#selector");
    var html = CourseListElement.html();
    var pattern = /getTeacherAjax\('(.+)','(.+)','(.+)'\);/gum;
    CourseListArray = html.match(pattern);
    tips("获取完成 | 课程数：" + CourseListArray.length);
}

function eryaSwitchToCourse() {
    if ( CourseListArray.length == 0 ) {
        tips("刷课完成，请刷新查看最新结果。");
        return false;
    }
    var CurrentCourse = CourseListArray.shift();
    var pattern = /[\s\S]+\'(\d+)\'\)/;
    var CurrentCourseId = CurrentCourse.match(pattern)[1];
    var Course = $('h4#cur' + CurrentCourseId);
    var CourseStatus = $('h4#cur' + CurrentCourseId + '>span').eq(1).hasClass('blue');
    if ( CourseStatus == true ) {
        tips("跳过已刷课程：" + CurrentCourseId + " | 剩余课程：" + CourseListArray.length, 'blue');
        eryaSwitchToCourse();
    } else {
      Course.click();
      tips("5秒后尝试播放");
      setTimeout(function(){
          eryaPlayCorese(CurrentCourseId);
      }, 5000);
    }
}

function eryaPlayCorese(CurrentCourseId) {

    var ThisCourseStatus = $("iframe").contents().find("div.ans-job-finished").length > 0;
    // 任务点检测 已完成则跳转答题页面
    if ( ThisCourseStatus == true ) {
        tips('任务点已完成，切换到答题页面......(5s)');
        setTimeout(function(){
            $("span[title=\"章节测验\"]").click();
            tips("10s后答题开始......(10s)");
            setTimeout(function() {
                tips("答题开始......");
                eryaAnwserQuestion();
            },10000);
        }, 5000);
        return false;
    }
    // 固定到视频播放页面
    if ( $("span[title=\"视频\"]").hasClass("currents") == false ) {
        tips("正在固定到视频页面......(5s)");
        $("span[title=\"视频\"]").click();
        setTimeout(function(){
            eryaPlayCorese();
        }, 5000);
        return false;
    }
    // 等待视频可用数据足以开始播放时开始播放
    Timer = setInterval(function() {
        VideoPlayer = $("iframe").contents().find("iframe").contents().find('video#video_html5_api')[0];
        if ( VideoPlayer.error == null ) {
            clearInterval(Timer);
            VideoPlayer.muted = true;
            tips("开始播放课程:" + CurrentCourseId);
            VideoPlayer.play();
            eryaPlayListener();
        }
    }, 2000);
}

function eryaPlayListener() {
    VideoPlayer.addEventListener('ended',function(){
        tips('视频播放完毕，5秒后切换到答题页面......(5s)');
        setTimeout(function(){
              $("span[title=\"章节测验\"]").click();
              tips("10s后答题开始......(10s)");
              setTimeout(function() {
                  tips("答题开始......");
                  eryaAnwserQuestion();
              },10000);
        }, 5000);
    },false);
    VideoPlayer.addEventListener('pause',function(){
        VideoPlayer.play();
    },false);
}
/*
**    尔雅课程脚本
**    oibit.cn
**    End
*/

/*
**    智慧树
**    oibit.cn
**    Begin
*/

function zhihuishuGetAllCourse() {
    CourseListElement = $("div[id=\"Tabs_1\"]>ul#chapterList>li.video,li.chapterExam");
    CourseListElement.each(function() {
        var Course = {};
        var elem = $(this);
        if (elem.hasClass("chapterExam") == false ) {
            Course.Type = "video";
            Course.Id = elem.attr("_videoid");
            Course.Status = elem.attr("watchstate") == 1? true : false;
            Course.Name = elem.attr("_name");
        } else {
            Course.Type = "exam";
            Course.Elem = elem;
            Course.Status = elem.children("span.fl").hasClass("time_ico3");
            Course.Name = "章测试";
        }
        CourseListArray.push(Course);
    });
    tips("获取完成 | 课程数：" + CourseListArray.length);
}

function zhihuishuSwitchToCourse() {
    if ( CourseListArray.length == 0 ) {
        tips("刷课完成，请刷新查看最新结果。");
        return false;
    }
    var CurrentCourse = CourseListArray.shift();
    if ( CurrentCourse.Status == true ) {
        tips("跳过已刷课程：" + CurrentCourse.Name + " | 剩余课程：" + CourseListArray.length, 'blue');
        zhihuishuSwitchToCourse();
        return false;
    } else if ( CurrentCourse.Type == "video") {
        tips("5秒后尝试播放" + CurrentCourse.Name);
        setTimeout(function() {
            zhihuishuPlayCourse(CurrentCourse);
        }, 5000);
    } else if (CurrentCourse.Type == "exam") {
        zhihuishuSwitchToCourse();
    }
}

function zhihuishuPlayCourse(Course) {
    // 等待视频可用数据足以开始播放时开始播放
    var CourseElement = $("li[_videoid=\""+Course.Id+"\"]").click();
    Timer = setInterval(function() {
        VideoPlayer = $("video#vjs_mediaplayer_html5_api")[0];
        if ( VideoPlayer.error == null ) {
            clearInterval(Timer);
            VideoPlayer.muted = true;
            tips("开始播放课程:" + Course.Name + "|剩余课程数量：" + CourseListArray.length);
            zhihuishuPlayListener();
        }
    }, 2000);
}

function zhihuishuPlayListener() {
    Timer = setInterval(function(){
        if( $("a.tmui_txt_hidd").length > 0 ) {
            clearInterval(Timer);
            $("a.tmui_txt_hidd")[0].click();
        }
    }, 2000);
    VideoPlayer.addEventListener('ended',function(){
        tips('视频播放完毕，5秒后切换到下一小节......(5s)');
        zhihuishuSwitchToCourse();
    },false);
    VideoPlayer.addEventListener('pause',function(){
        VideoPlayer.play();
    },false);
}

function zhihuishuAnwserQuestion() {
    QuestionListElement = {};
    QuestionListArray = [];
    QuestionAnwserSize = 0;
    tips("尝试获取题目......");
    QuestionListElement = $("div.examPaper_subject");
    QuestionListElement.each(function() {
        var QuestionElement = {};
        QuestionElement.Title = $(this).contents().find("div.subject_describe>p").text().replace('\r','').replace('\n','').replace(' ','');
        QuestionElement.Type = $(this).contents().find("span.subject_type").text();
        if ( QuestionElement.Type.indexOf("【判断题】") != -1 ) {
            QuestionElement.Type = "pd";
            QuestionElement.yesElement = $(this).contents().find("div.nodeLab:nth-child(1)").contents().find("input[type=\"radio\"]");
            QuestionElement.noElement = $(this).contents().find("div.nodeLab:nth-child(2)").contents().find("input[type=\"radio\"]");
        } else if ( QuestionElement.Type.indexOf("【单选题】") != -1 ) {
            QuestionElement.Type = "dx";
            QuestionElement.AElement = $(this).contents().find("div.nodeLab:nth-child(1)").contents().find("input[type=\"radio\"]");
            QuestionElement.AText = $.trim($(this).contents().find("div.nodeLab:nth-child(1)").contents().find("div.node_detail").text());
            QuestionElement.BElement = $(this).contents().find("div.nodeLab:nth-child(2)").contents().find("input[type=\"radio\"]");
            QuestionElement.BText = $.trim($(this).contents().find("div.nodeLab:nth-child(2)").contents().find("div.node_detail").text());
            QuestionElement.CElement = $(this).contents().find("div.nodeLab:nth-child(3)").contents().find("input[type=\"radio\"]");
            QuestionElement.CText = $.trim($(this).contents().find("div.nodeLab:nth-child(3)").contents().find("div.node_detail").text());
            QuestionElement.DElement = $(this).contents().find("div.nodeLab:nth-child(4)").contents().find("input[type=\"radio\"]");
            QuestionElement.DText = $.trim($(this).contents().find("div.nodeLab:nth-child(4)").contents().find("div.node_detail").text());
        } else if ( QuestionElement.Type.indexOf("【多选题】") != -1 ) {
            QuestionElement.Type = "zdx";
            QuestionElement.AElement = $(this).contents().find("div.nodeLab:nth-child(1)").contents().find("input[type=\"checkbox\"]");
            QuestionElement.AText = $.trim($(this).contents().find("div.nodeLab:nth-child(1)").contents().find("div.node_detail").text());
            QuestionElement.BElement = $(this).contents().find("div.nodeLab:nth-child(2)").contents().find("input[type=\"checkbox\"]");
            QuestionElement.BText = $.trim($(this).contents().find("div.nodeLab:nth-child(2)").contents().find("div.node_detail").text());
            QuestionElement.CElement = $(this).contents().find("div.nodeLab:nth-child(3)").contents().find("input[type=\"checkbox\"]");
            QuestionElement.CText = $.trim($(this).contents().find("div.nodeLab:nth-child(3)").contents().find("div.node_detail").text());
            QuestionElement.DElement = $(this).contents().find("div.nodeLab:nth-child(4)").contents().find("input[type=\"checkbox\"]");
            QuestionElement.DText = $.trim($(this).contents().find("div.nodeLab:nth-child(4)").contents().find("div.node_detail").text());

        }
        QuestionListArray.push(QuestionElement);
    });
    if (QuestionListArray.length == 0) {
        tips("未获取到题目，5秒后重试......(5s)");
        setTimeout(function() {
            zhihuishuAnwserQuestion();
        }, 5000);
        return false;
    }
    RegisterBody();
    for (var i = 0; i < QuestionListArray.length; i++) {
        zhihuishuGetAndDoAnswer(QuestionListArray[i].Title,QuestionListArray[i].Type);
    }
    Timer = setInterval(function(){
        if (QuestionAnwserSize == QuestionListElement.length) {
            clearInterval(Timer);
            RegisterLine("查询完毕！60秒自动提交......", null);
            tips("查询完毕！60秒自动提交！......(60s)");
            setTimeout(function() {
                $("a[title=\"提交作业\"]").click();
                setTimeout(function() {
                    ReleaseBody();
                    $("a.popbtn_yes").click();
                });
            },60000);
        }
    }, 1000);
}

function zhihuishuGetAndDoAnswer(title, type) {
    var url = 'http://erya.oibit.cn/search.php?title='+ title ;
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
        //这里写处理函数
            QuestionAnwserSize++;
            var Result = jQuery.parseJSON(response.responseText);
            if ( Result.data.length == 0 ) {
                RegisterLine(title, "未查询到答案");
                for (var i = 0; i < QuestionListArray.length; i++) {
                    if ( QuestionListArray[i].title == title ) {
                        if ( QuestionListArray[i].Type == "pd" ) {
                            QuestionListArray[i].yesElement.click();
                        } else{
                            QuestionListArray[i].AElement.click();
                        }
                    }
                }
            } else {
                RegisterLine(title, $.trim(Result.data[0].answer).replace(' ','').replace('\r','').replace('\n',''));
                if ( type == "dx" ) {
                    for (var i = 0; i < QuestionListArray.length; i++) {
                        var answer = $.trim(Result.data[0].answer);
                        if ( QuestionListArray[i].Title == title ) {
                            if ( QuestionListArray[i].AText == answer ) {
                                QuestionListArray[i].AElement.click();
                            } else if ( QuestionListArray[i].BText == answer ) {
                                QuestionListArray[i].BElement.click();
                            } else if ( QuestionListArray[i].CText == answer ) {
                                QuestionListArray[i].CElement.click();
                            } else if ( QuestionListArray[i].DText == answer ) {
                                QuestionListArray[i].DElement.click();
                            }
                        }
                    }
                }
                if ( type == "zdx" ) {
                    for (var i = 0; i < QuestionListArray.length; i++) {
                        var answer = $.trim(Result.data[0].answer);
                        if ( QuestionListArray[i].Title == title ) {
                            if (  answer.indexOf(QuestionListArray[i].AText) >= 0 ) {
                                QuestionListArray[i].AElement.prop("checked",true);
                            } else {
                                QuestionListArray[i].AElement.prop("checked",false);
                            }
                            if (  answer.indexOf(QuestionListArray[i].BText) >= 0 ) {
                                QuestionListArray[i].BElement.prop("checked",true);
                            } else {
                                QuestionListArray[i].BElement.prop("checked",false);
                            }
                            if (  answer.indexOf(QuestionListArray[i].CText) >= 0 ) {
                                QuestionListArray[i].CElement.prop("checked",true);
                            } else {
                                QuestionListArray[i].CElement.prop("checked",false);
                            }
                            if (  answer.indexOf(QuestionListArray[i].DText) >= 0 ) {
                                QuestionListArray[i].DElement.prop("checked",true);
                            } else {
                                QuestionListArray[i].DElement.prop("checked",false);
                            }
                        }
                    }
                }
                if (type == "pd") {
                    for (var i = 0; i < QuestionListArray.length; i++) {
                        var answer = $.trim(Result.data[0].answer);
                        if ( QuestionListArray[i].Title == title ) {
                            if ( answer == "×" || answer == "错" ) {
                                QuestionListArray[i].noElement.click();
                            } else if ( answer == "√" || answer == "对" ) {
                                QuestionListArray[i].yesElement.click();
                            }
                        }
                    }
                }
            }
        }
   });
}

/*
**    智慧树课程脚本
**    oibit.cn
**    End
*/

function Launcher(courseName) {
    switch(courseName) {
        case "erya":
            eryaGetAllCourse();
            eryaSwitchToCourse();
            break;
        case "zhihuishu":
            zhihuishuGetAllCourse();
            zhihuishuSwitchToCourse();
            break;
    }
}

$(function() {
    var CurrentUrl = window.location.href ;
    if ( CurrentUrl.indexOf('mooc1-1.chaoxing.com/exam/test/reVersionPaperMarkContentNew') >= 0 ) {
        CollectionAnswer();
    } else if( CurrentUrl.indexOf('mooc1-1.chaoxing.com/exam/test/reVersionTestStartNew') >= 0 ) {
        // SearchAnswer();
    } else if( CurrentUrl.indexOf('mooc1-1.chaoxing.com/mycourse/studentstudy') >= 0 ) {
        tips("初始化课程数据......(5s)");
        setTimeout(function() {
            tips("当前课程：尔雅");
            Launcher("erya");
        },5000);
    } else if( CurrentUrl.indexOf('study.zhihuishu.com/learning/videoList') >= 0 ) {
        tips("初始化课程数据......(5s)");
        setTimeout(function() {
            tips("当前课程：智慧树");
            Launcher("zhihuishu");
        },5000);
    } else if ( CurrentUrl.indexOf('exam.zhihuishu.com/onlineExam/studentHomework/doHomework') >= 0 ) {
        zhihuishuAnwserQuestion();
    }
});