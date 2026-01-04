  // ==UserScript==
// @name         考试自动答题脚本（作者 ）
// @namespace    skeleton
// @connect      52dw.net
// @connect      51aidian.com
// @connect      http://p.52dw.net:81/main.css
// @version      1.2.26
// @description  超星作业，考试自动答题开放。
// @author       skeleton
// @match        */umooc/user/study.do*
// @match        */learnCourse/learnCourse.html*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/405779/%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC%EF%BC%88%E4%BD%9C%E8%80%85%20%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/405779/%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC%EF%BC%88%E4%BD%9C%E8%80%85%20%EF%BC%89.meta.js
// ==/UserScript==
var version = '1.2.26';
var last_set_time = '2020/6/18';

var exam_ready_time =        2       ;//考试的时候，会停止左边你设置的秒数（默认暂停2秒），然后再搜索题目，答题。
var exam_response_time=   5       ;//考试的题目间隔时间5秒一题。
var error_response_time=   30       ;//答题时出错了，20秒的自己答题时间。
var auto_submit=   0      ; //如果为 0，则表示考试不提交，如果为 1，则表示考试全自动交卷，并提交试卷。


(function() {
    var regexp = /===|---/;
    var special_characters = /[^\u4e00-\u9fa5a-zA-Z0-9]/g;
    var ABCD = /(A|B|C|D|E|F|G|H|I|J)/;
    var singal = /((A|B|C|D|E|F|G|H|I|J)|。$)/g;

    var $ = unsafeWindow.jQuery;

    //所有的题目
    var questions = $('.Zy_TItle div');
    //所有的题目下面的选择题的ul元素
    var all_ul = $('.TiMu ul');
    //题目的索引
    var index = 0;
    //没有选择的数量
    var no_click = 0;

    $('input').css('width', '15px');

    //=================================================================作业界面的查找答案=================================================================
    function findAnswer() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: "http://p.52dw.net:81/chati?q=" + encodeURI(questions.eq(index).text().substring(questions.eq(index).text().indexOf('】') + 1).substring(0, questions.eq(index).text().length - 4)),
            onload: function (r) {
                try {
                    //==============================================初始化数据==============================================
                    var json = JSON.parse(r.responseText);
                    var answer = json.data.answer.replace(/\s+/g, "");
                    let isclick = 0;
                    var array = answer.split(regexp);
                    var li = all_ul.eq(index).find('li');//填空题

                    var test_textarea_p = li.find('iframe').contents().find('p');//填空题
                    var textarea=all_ul.eq(index).find("textarea");
                    //==============================================如果找不到答案==============================================
                    if (answer.indexOf('抱歉找不到结果') != -1) {
                        questions.eq(index).append('<p class="mysk"  style="background-color:rgb(255, 92, 92, 0.4)">【问题】：无<br>【回答】：抱歉找不到结果</p>');
                        if (index++ < questions.length - 1) setTimeout(findAnswer, 3000);
                        else $('#none').css('display','block');
                        return;
                    }
                    questions.eq(index).append('<p  class="mysk"  style="background-color:rgb(69, 204, 98,0.2)">【问题】：' + json.data.question.substring(json.data.question.indexOf('】') + 1) + '。</p>');
                    questions.eq(index).append('<p  class="mysk"  style="background-color:rgb(69, 204, 98, 0.2)">【回答】：' + answer + '。</p>');


                    //==============================================选择题找答案==============================================
                    if (li.length != 0) {
                        //对错选择题
                        if (li.find('input').length == 2 && answer.match(/(^|,)(正确|是|对|√|T|ri)(,|$)/)) {
                            li.eq(0).find('input').click();
                            isclick = 1;
                        } else if (li.find('input').length == 2 && answer.match(/(^|,)(错误|否|错|×|F|wr)(,|$)/)) {
                            li.eq(1).find('input').click();
                            isclick = 1;
                        }
                        //多项选择题
                        else if (array != null && array.length > 1) {
                            if (array.length == 0) return;
                            var str = '';
                            for (let li_len = 0; li_len < array.length; li_len++) {
                                let opt = li.eq(li_len).text().replace(/\s+/g, "");
                                opt = opt.replace(ABCD, "").replace(special_characters, "");
                                //先for循环查找全等的，如果没有再模糊查找
                                for (let i = 0; i < array.length; i++) {
                                    array[i] = array[i].replace(/\s+/g, "").replace(special_characters, "");
                                    if (array[i] == opt) {
                                        li.eq(li_len).find('input').click();
                                        isclick = 1;
                                        break;
                                    }
                                }
                                //如果没有相等的答案，就模糊查找
                                if (isclick == 0) {
                                    for (let i = 0; i < array.length; i++) {
                                        array[i] = array[i].replace(/\s+/g, "").replace(special_characters, "");
                                        //模糊查找
                                        if (opt.length > array[i].length ? opt.indexOf(array[i]) != -1 : array[i].indexOf(opt) != -1) {
                                            li.eq(li_len).find('input').click();
                                            isclick = 1;
                                            break;
                                        }
                                    }

                                }

                            }
                        }
                        //单项选择题
                        else if (array != null && array.length == 1) {
                            for (let i = 0; i < li.length; i++) {
                                let opt = li.eq(i).text().replace(/\s+/g, "");
                                answer = answer.replace(special_characters, "");
                                opt = opt.replace(ABCD, "").replace(special_characters, "");
                                //先for循环查找全等的，如果没有再模糊查找
                                if (opt == answer) {
                                    if (isclick == 0) li.eq(i).find('input').click();
                                    isclick = 1;
                                    break;
                                }
                            }
                            //如果没有相等的答案，就模糊查找
                            if (isclick == 0) {
                                for (let i = 0; i < li.length; i++) {
                                    let opt = li.eq(i).text().replace(/\s+/g, "");
                                    answer = answer.replace(special_characters, "");
                                    opt = opt.replace(ABCD, "").replace(special_characters, "");

                                    //模糊查找
                                    if (opt.length > answer.length ? opt.indexOf(answer) != -1 : answer.indexOf(opt) != -1) {
                                        li.eq(i).find('input').click();
                                        isclick = 1;
                                        break;
                                    }
                                }

                            }
                            //如果答案直接给出ABCD...
                        } else if (answer.match(singal).length != 0) {
                            let arrays = answer.match(singal);
                            for (let i in arrays) {
                                if (arrays[i] == "A") li.eq(0).find('input').click();
                                if (arrays[i] == "B") li.eq(1).find('input').click();
                                if (arrays[i] == "C") li.eq(2).find('input').click();
                                if (arrays[i] == "D") li.eq(3).find('input').click();
                                if (arrays[i] == "E") li.eq(4).find('input').click();
                                if (arrays[i] == "F") li.eq(5).find('input').click();
                                if (arrays[i] == "G") li.eq(6).find('input').click();
                            }

                        }
                        else {

                            mylog("发生了未知的错误", 'error');
                        }
                    }
                    //==============================================填空题==============================================
                    if (test_textarea_p.length != 0) {
                        if (array != null && array.length > 1) {
                            mylog("多个填空题填空完成");
                            find_Mfill_answer(array,textarea, test_textarea_p, isclick);
                        }
                        else if (array != null && array.length == 1) {
                            mylog("单项填空题填空完成");
                            test_textarea_p.eq(0).text(array[0]);
                            textarea.eq(0).text(array[0]);
                            textarea.eq(0).val(array[0]);
                            isclick = 1;
                        }
                        else {
                            mylog("发生了未知的错误,请耐心等待，可能是服务器正在维护，过一天再重新使用脚本即可，请不要加q问我什么的，这服务器不是问我就能好的QAQ", 'error');
                        }
                    }



                    if (isclick == 0) {
                        questions.eq(index).append('<p  class="mysk"  style="background-color:rgb(255, 92, 92, 0.4)">没有符合回答的答案，请自行选择</p>');
                        no_click++;
                    }
                    mylog(index + "|" + answer + "|是否作答:" + (isclick == 1));
                    drawDiv(questions.eq(index),index, isclick);
                    if (index++ < questions.length - 1) setTimeout(findAnswer, 3000);//下一个
                    else {
                        $('#none').css('display','block');
                        $('#myresult').text("共" + questions.length + "道题目，错" + no_click + "道题，正确率" + (100 - (no_click / questions.length) * 100).toFixed(2) + "%");
                    }
                } catch (e) {
                    mylog( e);
                    var confirm=confirm("未知的错误，点击确定跳过次题，点击取消暂停");
                    if (confirm==true){
                        if (index++ < questions.length - 1) setTimeout(findAnswer, 3000);//下一个
                        else {
                            $('#none').css('display','block');
                            $('#myresult').text("共" + questions.length + "道题目，错" + no_click + "道题，正确率" + (100 - (no_click / questions.length) * 100).toFixed(2) + "%");
                        }
                    }
                }
            },
            onerror: function (err) {
                alert("服务器错误!!!，请耐心等待，可能是服务器正在维护，过一天再重新使用脚本即可，请不要加q问我什么的，这服务器不是问我就能好的QAQ");
                mylog("服务器错误" + err);
            }
        });
    }
    //填充多项填空题的答案
    function find_Mfill_answer(array,textarea ,test_textarea_p, isclick) {
        if (array.length == 0 || array.length > test_textarea_p.length) return;
        for (let i = 0; i < test_textarea_p.length; i++) {
            test_textarea_p.eq(i).text(array[i]);
            textarea.eq(i).text(array[i]);
            textarea.eq(i).val(array[i]);
        }
        isclick = 1;
    }

    //绘制回答对错的框
    function drawDiv(questions,index, isclick) {
        questions.attr("id", "topic" + index);

        var topic_div = $("<a href='#topic" + index + "'>" + (index + 1) + ((index + 1) >= 10 ? "" : " ") + "." + ((index + 1) >= 10 ? "" : " ") + "<span style='font-weight:bold'>" + (isclick == 1 ? "√" : "×") + "</span></a>");
        var divcss = {
            float: "left",
            color: (isclick == 1 ? "green" : "red"),
            padding: "5px",
            border: "1px solid",
            margin: " 5px"
        };
        topic_div.css(divcss);
        $('#content').append(topic_div);

    }
    //播放设置，点击后淡出淡入
    function setting(downDiv) {
        if ($(downDiv).css('display') == 'none') {
            $(downDiv).fadeIn();
        } else {
            $(downDiv).css('display', 'none');
        }
    }

    //绘制窗口
    function drawWindow() {
        //加载css文件
        $('head').append('<link href="http://p.52dw.net:81/main.css?t=' + new Date().getTime() + '" rel="stylesheet" type="text/css" />');
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://p.52dw.net:81/main.css?t=' + new Date().getTime(),
            onload: function (r) {
                console.log(r.responseText);
                var style=$('<style></style>');
                style.html(r.responseText);
                $('head').append(style);

            }});
        //下面是标签拼接
        $("body").append("<div id='skdiv' class='zydiv'></div>");
        var maindiv = $("<div id='skMainDiv'></div>");
        $('#skdiv').append(maindiv);
        $("#skMainDiv").html("\
<p>\
<span style='font-weight:bold;    font-size: large;'>超星作业，考试自动答题脚本 </span><span style='font-weight:bold;'> v"+ version + "</span><button id='skmaindiv-btn'>▲</button><br/>\
<p>\
<p>最后更新时间："+ last_set_time + "</p><br>\
有任何问题可以在群里艾特我进行反馈：<a style='color:blue;font-weight:blod;' href='https://shang.qq.com/wpa/qunwpa?idkey=2be1ed62e97e0d0ea236713d9fb82bfb493f6905156734c15e57d36699ccdf2e'>点击加入脚本交流群</a>\
\
<div id='content' style='   border-top: 2px solid;'></div>");
        $('#content').html("\
<b>点击下面任意框框，跳转到相应题目</b><br>\
<b id='none' style='display:none'>题目作答完毕！！！</b>\
<b id='myresult'></b>\
<div>\
</div>"
                          );
        //刷课界面的收缩
        $('#skmaindiv-btn').click(function () {
            setting('#content');
            if ($('#content').css('display') == 'none') {
                $('#skmaindiv-btn').text('▼');
            } else {
                $('#skmaindiv-btn').text('▲');
            }
        });
    }

    function mylog(str) {

        console.log(str);
    }


    //==================================================================考试界面的查找答案=================================================================
    function find_examAnswer(){


        let regexp = /===|---/;
        let special_characters = /[^\u4e00-\u9fa5a-zA-Z0-9]/g;
        let ABCD = /(A|B|C|D|E|F|G|H|I|J|K)、/;
        let test_line_regexp = /(A|B|C|D|E|F|G|H|I|J|K)/g;
        let singal = /((A|B|C|D|E|F|G|H|I|J)|。$)/g; //如果答案直接给出ABCD...
        let M_topic_regexp = /\(\d+\)[\u4e00-\u9fa5]+/g;//多选题的正则表达式
        let imgurl = /[a-zA-Z0-9]*\.(png|jpg)/g;


        let title_regexp = /(（.*分）|\s|(\(|\)。))/g;
        let li_regexp = /(A|B|C|D|E|F|G|H|I|J|K)/;

        let topic_title = $('.Cy_TItle.clearfix .clearfix').text().replace(title_regexp, "");
        let all_topic = $('.leftCardChild a');


        let index = 0;

        let notfind_num = 0;
        var topic=$('.Cy_TItle.clearfix .clearfix');
        GM_xmlhttpRequest({
            method: 'GET',
            url: "http://p.52dw.net:81/chati?q=" + encodeURI(topic_title),
            onload: function (r) {
                //延时
                setTimeout(function(){

                    try {

                        mylog("搜索成功");
                        var json = JSON.parse(r.responseText);

                        var answer = json.data.answer.replace(/\s+/g, "");
                        let isclick = 0;
                        var array = answer.split(regexp);
                        let li = $('#submitTest ul').eq(0).find("li");
                        var test_textarea_p = $('iframe').contents().find('p');//填空题，暂时不提供
                        var textarea = $('textarea');
                        //连线题
                        var test_line = $('');//$('ul').eq(0).siblings('ul.ulTop.thirdUlList').find('select'); //连线题，暂时不提供

                        console.log(li);
                        console.log(array);


                        if (answer.indexOf('抱歉找不到结果') != -1) {
                            notfind_num++;
                            topic.append('<p  class="mysk"  style="background-color:rgb(255, 92, 92, 0.4)">【问题】：无<br>【回答】：抱歉找不到结果,将在'+error_response_time+'秒后继续下一个答题</p>');
                            //填充答案
                            //fill_answer(li, test_textarea_p, test_line);
                            setTimeout(function(){
                                if($('.saveYl01').text()=="下一题")auto_submit==1?$('.fr.saveYl').click():alert("考试已经完成");
                                else setTimeout(function () {index++; getTheNextQuestion(1) },1000* exam_response_time);//下一个
                            },error_response_time*1000);
                            return;
                        }

                        topic.append('<p  class="mysk"  style="background-color:rgb(69, 204, 98,0.2)">【问题】：' + json.data.question.substring(json.data.question.indexOf('】') + 1).replace(/\s+/g, "") + '。</p>');

                        if (answer.match(/http.*(png|jpg)/g) != null)topic.append('<p  class="mysk"  style="background-color:rgb(69, 204, 98, 0.2)">【回答】：<img src=' + answer.match(/http.*(png|jpg)/g)[0] + '></p>');
                        else topic.append('<p  class="mysk"  style="background-color:rgb(69, 204, 98, 0.2)">【回答】：' + answer + '。</p>');

                        //==============================================如果是填空题============================================
                        if (test_textarea_p.length != 0) {
                            mylog("填空题");
                            if (array != null && array.length > 1) {
                                mylog("多个填空题填空完成");
                                find_Mfill_answer(array, textarea, test_textarea_p, isclick);
                                isclick = 1;
                            }
                            else if (array != null && array.length == 1) {
                                mylog("单项填空题填空完成");
                                test_textarea_p.eq(0).text(array[0]);
                                textarea.eq(0).text(array[0]);
                                textarea.eq(0).val(array[0]);
                                isclick = 1;
                            }
                            else {
                                topic.append('<p style="background-color:rgb(255, 92, 92, 0.4)">发生了未知的错误,将在'+error_response_time+'秒后继续下一个答题</p>');
                                mylog("发生了未知的错误,请耐心等待，可能是服务器正在维护，过一天再重新使用脚本即可，请不要加q问我什么的，这服务器不是问我就能好的QAQ", 'error');
                            }
                        }
                        //==============================================选择题==============================================
                        else if (li.length != 0) {
                            //如果答案直接给出ABCD...
                            if (answer.match(singal) != null && answer.match(singal).length != 0) {
                                mylog("直接给出答案");
                                let arrays = answer.match(singal);
                                click_answer(li, arrays);
                                isclick = 1;

                            }
                            //图片题
                            else if (li.find("img").length != 0 && answer.match(imgurl)) {
                                mylog("图片题");
                                answer = answer.match(imgurl);
                                for (let i = 0; i < li.length; i++) {
                                    let opt = li.eq(i).find("img").attr('data-original').match(imgurl);
                                    //先for循环查找全等的，如果没有再模糊查找
                                    if (opt[0] == answer[0]) {
                                        if (isclick == 0) if(!li.eq(i).hasClass("Hover"))li.eq(i).click();
                                        isclick = 1;
                                        break;
                                    }
                                }
                            }
                            //对错选择题
                            else if (li.length == 2 && answer.match(/(^|,)(正确|是|对|√|T|ri)(,|$)/)) {
                                if(li.eq(0).find('input').attr('checked')==undefined)li.eq(0).find('input').click();
                                isclick = 1;
                            } else if (li.length == 2 && answer.match(/(^|,)(错误|否|错|×|F|wr)(,|$)/)) {
                                if(li.eq(1).find('input').attr('checked')==undefined)li.eq(1).find('input').click();
                                isclick = 1;
                            }
                            //多项选择题
                            else if (array != null && array.length > 1) {
                                mylog("多选题");
                                if (array.length == 0 || array.length > li.length) return;
                                isclick =multiple_choice_click(li,array);
                            }
                            //单项选择题
                            else if (array != null && array.length == 1) {
                                isclick = single_choice_click(li, answer);
                            }else {
                                topic.append('<p  class="mysk"  style="background-color:rgb(255, 92, 92, 0.4)">发生了未知的错误</p>');
                                mylog("发生了未知的错误", 'error');
                            }
                        }
                        if (isclick == 0) {
                            topic.append('<p  class="mysk"  style="background-color:rgb(255, 92, 92, 0.4)">没有符合回答的答案，请自行选择,将在'+error_response_time+'秒后继续下一个答题</p>');
                            //填充答案
                            //fill_answer(li, test_textarea_p, test_line);
                            setTimeout(function(){
                                if($('.saveYl01').text()=="下一题")auto_submit==1?$('.fr.saveYl').click():console.log("考试已经完成");
                                else setTimeout(function () {index++; getTheNextQuestion(1) },1000* exam_response_time);//下一个
                            },error_response_time*1000);
                        }else{
                            if($('.saveYl01').text()=="下一题")auto_submit==1?$('.fr.saveYl').click():console.log("考试已经完成");
                            else setTimeout(function () {index++; getTheNextQuestion(1) },1000* exam_response_time);//下一个
                        }





                    } catch (e) {
                        mylog("未知的错误");
                        console.log(e);
                    }


                },exam_ready_time*1000);



            },
            onerror: function (err) {
                topic.append('<p  class="mysk"  style="background-color:rgb(255, 92, 92, 0.4)">服务器错误!!!，请耐心等待，可能是服务器正在维护，过一会再重新使用脚本即可，请不要加q问我什么的，这服务器不是问我就能好的QAQ</p>');
                //alert("服务器错误!!!，请耐心等待，可能是服务器正在维护，过一会再重新使用脚本即可，请不要加q问我什么的，这服务器不是问我就能好的QAQ");
            }


        });

        //点击左边栏的题目
        function draw_question(index,isclick){
            if(isclick==0)all_topic.eq(index).css("background", "red");
            else all_topic.eq(index).css("background", "#86b430");
        }

        function single_choice_click(li, answer) {
            console.log(li);
            var isclick = 0;
            for (let i = 0; i < li.length; i++) {
                let opt = li.eq(i).text().replace(/\s+/g, "");
                answer = answer.replace(special_characters, "");
                opt = opt.replace(ABCD, "").replace(special_characters, "");
                //先for循环查找全等的，如果没有再模糊查找
                if (opt == answer) {
                    if(!li.eq(i).hasClass("Hover"))li.eq(i).click();
                    console.log("点击");
                    isclick = 1;
                    break;
                }
            }
            //如果没有相等的答案，就模糊查找
            if (isclick == 0) {
                for (let i = 0; i < li.length; i++) {
                    let opt = li.eq(i).text().replace(/\s+/g, "");
                    answer = answer.replace(special_characters, "");
                    opt = opt.replace(ABCD, "").replace(special_characters, "");

                    //模糊查找
                    if (opt.length > answer.length ? opt.indexOf(answer) != -1 : answer.indexOf(opt) != -1) {
                        if(!li.eq(i).hasClass("Hover"))li.eq(i).click();
                        isclick = 1;
                        break;
                    }
                }
            }

            return isclick;
        }

        function multiple_choice_click(li, array) {
            var isclick = 0;
            for (let li_len = 0; li_len < li.length; li_len++) {
                let opt = li.eq(li_len).text().replace(/\s+/g, "");
                opt = opt.replace(ABCD, "").replace(special_characters, "");
                //先for循环查找全等的，如果没有再模糊查找
                for (let i = 0; i < array.length; i++) {
                    array[i] = array[i].replace(/\s+/g, "").replace(special_characters, "");
                    if (array[i] == opt) {
                        if(!li.eq(li_len).hasClass("Hover"))if(!li.eq(0).hasClass("Hover"))li.eq(li_len).click();
                        isclick = 1;
                        break;
                    }

                }
                //如果没有相等的答案，就模糊查找
                for (let i = 0; i < array.length; i++) {
                    array[i] = array[i].replace(/\s+/g, "").replace(special_characters, "");
                    //模糊查找
                    if (opt.length > array[i].length ? opt.indexOf(array[i]) != -1 : array[i].indexOf(opt) != -1) {
                        if(!li.eq(li_len).hasClass("Hover"))li.eq(li_len).click();
                        isclick = 1;
                        break;
                    }
                }
            }
            return isclick;

        }

        function click_answer(li, arrays) {

            for (let i in arrays) {
                if (arrays[i] == "A") if(!li.eq(0).hasClass("Hover"))li.eq(0).click();
                if (arrays[i] == "B") if(!li.eq(1).hasClass("Hover"))li.eq(1).click();
                if (arrays[i] == "C") if(!li.eq(2).hasClass("Hover"))li.eq(2).click();
                if (arrays[i] == "D") if(!li.eq(3).hasClass("Hover"))li.eq(3).click();
                if (arrays[i] == "E") if(!li.eq(4).hasClass("Hover"))li.eq(4).click();
                if (arrays[i] == "F") if(!li.eq(5).hasClass("Hover"))li.eq(5).click();
                if (arrays[i] == "G") if(!li.eq(6).hasClass("Hover"))li.eq(6).click();
            }

        }

        //填充答案
        function fill_answer(li, test_textarea_p, test_line) {
            if (li.length != 0) {
                if(!li.eq(0).hasClass("Hover"))li.eq(0).click();
            }
            if (test_textarea_p.length != 0) {
                var random = String(new Date().getTime()).substr(-1);
                //10个里面找一个随机填写，要改自己改吧
                var random_array = ["不知道", "不清楚", "不懂", "不会啊", "不会写", "不懂怎么写啊", "太难了，不会", "不会", "我不懂", "不晓得"];
                test_textarea_p.eq(0).text(random_array[random]);
            }
        }


    }

    if(self==top && window.location.href.indexOf("/work/doHomeWorkNew")!=-1){
        findAnswer();
        drawWindow();
    }

    if(self==top && window.location.href.indexOf("/exam/test/reVersionPaperPreview")!=-1){

        if( auto_submit==1)setTimeout(function(){confirmSubTest();},3000);//直接提交
    }
    if (window.location.href.indexOf("/test/reVersionTestStartNew") != -1) {
        find_examAnswer();
        console.log("开始答题");
    }


})();