// ==UserScript==
// @name         智慧树刷课，作业脚本(暂时不能考试)
// @namespace    xp9797
// @version      1.0
// @description  智慧树刷课脚本，支持自动刷课，自动跳转下一节，作业自动答题
// @author       xp9797
// @connect      ykhulian.com
// @run-at       document-end
// @connect      http://c.ykhulian.com/main.css
// @match        *://*.zhihuishu.com/stuExamWeb*
// @match        https://www.zhihuishu.com/portals_h5/*
// @match        https://studyh5.zhihuishu.com/portals_h5/2clearning.html*
// @match        https://studyh5.zhihuishu.com/videoStudy*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource      skcss https://c.ykhulian.com/resourse/components/main.css
// @require      https://greasyfork.org/scripts/406149-skeleton-mediautil/code/skeleton-MediaUtil.js?version=820961
// @require      https://greasyfork.org/scripts/406147-skeleton%E8%84%9A%E6%9C%AC%E7%AA%97%E5%8F%A3%E7%BB%98%E5%88%B6/code/skeleton%E8%84%9A%E6%9C%AC%E7%AA%97%E5%8F%A3%E7%BB%98%E5%88%B6.js?version=820972
// @require      https://greasyfork.org/scripts/406148-skeleton-answerutil/code/skeleton-AnswerUtil.js?version=820959
// @downloadURL https://update.greasyfork.org/scripts/416950/%E6%99%BA%E6%85%A7%E6%A0%91%E5%88%B7%E8%AF%BE%EF%BC%8C%E4%BD%9C%E4%B8%9A%E8%84%9A%E6%9C%AC%28%E6%9A%82%E6%97%B6%E4%B8%8D%E8%83%BD%E8%80%83%E8%AF%95%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416950/%E6%99%BA%E6%85%A7%E6%A0%91%E5%88%B7%E8%AF%BE%EF%BC%8C%E4%BD%9C%E4%B8%9A%E8%84%9A%E6%9C%AC%28%E6%9A%82%E6%97%B6%E4%B8%8D%E8%83%BD%E8%80%83%E8%AF%95%29.meta.js
// ==/UserScript==

(function() {
    var rate=   1.5  //默认播放速度，1.5倍速
    var stop_time = 30*60*1000 //自动关闭时长，默认半个钟
    var $=unsafeWindow.jQuery;
    var url=window.location.href;
    setTimeout(function(){document.onselectstart=null},2000);//解除智慧树网页不能复制的限制

    let skcss = GM_getResourceText('skcss')
    GM_addStyle(skcss)

    function start(all_li,with_out_what){
        //获取所有要播放的视频
        var all=$(all_li);
        var new_video=new Array();
        for(let i =0 ;i<all.length;i++){
            if(all.eq(i).find(with_out_what).length==0){
                new_video.push(all.eq(i)[0]);
            }
        }
        console.log(new_video);
        //视频播放组件的设置参数：
        var vusetting = {
            auto: true,
            muted: true,
            playbackRate: rate,
            timeout_reload: true,
            debug: true,
            MediaEndEvent() {
                console.log("媒体播放完毕");
                new_video.shift().click(); // 队列模式
                setTimeout(function(){
                    var mu = new MediaUtil($('video'), vusetting);//播放
                    mu.start();
                },2000);
            },
            timeOut() {
                console.log("媒体加载超时");
            }
        }
        var mu = new MediaUtil($('video'), vusetting);
        mu.start();//开始播放

        //题目弹窗，选择A,关闭
        setInterval(function(){
            if($('.speedBox').find('span').text()=="X 1.0")$('.speedTab15').click();
            if($('.topic-item').length!=0){
                setTimeout("$('.topic-item').eq(0).click();",500)//选择A
                setTimeout("$('div.btn').eq(0).click();",1000)//关闭
            }

        },2000);
    }



    var index=0;

    //把所有选中的答案清空
    function clear_options(){
        setTimeout(function(){
            let options=$('.examPaper_subject').find('.examquestions-answer.onChecked');
            //把所有选中的答案清空
            var i=0;
            var s=setInterval(function(){
                console.log("清空选中的选项...");
                options.eq(i++).click();
                if(i>options.length){
                    clearInterval(s);
                    $('#ready').text('清除完毕！开始自动答题');
                    setTimeout(function(){autoAnswer()},3000);
                }
            },200);

        },3000);

    }

    function autoAnswer(){
        if($('#ready')!=undefined)$('#ready').remove();
        var test_topicText=$('.examPaper_subject .subject_describe')//所有题目的描述
        var regexp= /===|---|#/;
        var question=test_topicText.eq(index).text().replace(/\s/g,'');
        console.log(question);
        console.log($('.examPaper_subject .subject_describe'));
        GM_xmlhttpRequest({
            type: "get",
            url: "http://c.ykhulian.com/chati/0/"+question ,
            dataType: "json",
            onload: function (r) {
                var json = JSON.parse(r.responseText);
                var answer = json.answer;
                var json_question = json.question;
                //==============================================如果找不到答案==============================================
                if (answer.indexOf('抱歉找不到结果') != -1) {
                    test_topicText.eq(index).append('<p class="mysk"  style="background-color:rgb(255, 92, 92, 0.4)">【问题】：无<br>【回答】：抱歉找不到结果</p>');
                    if (index++ < test_topicText.length - 1) setTimeout(autoAnswer(), 3000);
                    else $('#none').css('display','block');
                    return;
                }
                test_topicText.eq(index).append('<p  class="mysk"  style="background-color:rgb(69, 204, 98,0.2)">【问题】：' + json_question.substring(json_question.indexOf('】') + 1) + '。</p>');
                test_topicText.eq(index).append('<p  class="mysk"  style="background-color:rgb(69, 204, 98, 0.2)">【回答】：' + answer + '。</p>');

                var options=$('.examPaper_subject').eq(index).find('.examquestions-answer');
                var input = $('.examPaper_subject').eq(index).find('.subject_node input');

                var answer_array = answer.split(regexp);

                var opt_array=new Array();
                for(let i =0 ;i <options.length;i++){
                    opt_array.push(options.eq(i).text());
                }

                //获取答案
                var au=new AnswerUtil(question,answer_array,opt_array);
                console.log(answer_array);
                console.log(au.getAnswer());
                let au_answer=au.getAnswer();

                var j=0;
                loop(function(){
                    options.eq(au_answer[j++]).click();
                },au_answer.length);
                drawDiv(test_topicText.eq(index),index, au_answer.length==0?0:1);

                setTimeout(function(){
                    if(au_answer.length==0){
                        test_topicText.eq(index).append('<p  class="mysk"  style="background-color:rgb(255, 92, 92, 0.4)">没有符合回答的答案，请自行选择</p>');
                    }
                    if(index<test_topicText.length){
                        index++;
                        setTimeout(function(){autoAnswer()},3000);
                    }
                },options.length*200);


            },
            onerror: function(e){
                console.log('服务器错误');
            }
        })
    };

    function loop(fn,times){
        let i=0;
        var s=setInterval(function(){
            fn();
            if(i>times)clearInterval(s);
        },200);
    }


    var sleep = function(time) {
        var startTime = new Date().getTime() + parseInt(time, 10);
        while(new Date().getTime() < startTime) {}
    };

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





    if(url.indexOf('zhihuishu.com/videoStudy')!=-1){
        //绘制窗口
        drawWindow();

        console.log('开始刷视频');
        let time = 0
        $('#content').html('<div ><p  id="rate_txt" >播放速度：默认1.5倍速</p>');
        $('#skdiv').append('<button   id="back">半小时自动关闭</button>');
        $('#back').click(        function(){
            if(time==0){
                time = stop_time
                console.log("半小时自动关闭");setTimeout(function(){window.history.back(-1);},stop_time)
                setInterval(function(){
                    if(time>1000){
                        $('#back').text("剩余秒："+(time-=1000))
                    }
                },1000)
            }
        })

        setTimeout(function(){start('li.clearfix.video','.time_icofinish')},3000)//开始刷共享课视频，传入视频li元素：li.clearfix.video和完成的视频.time_icofinish，即可刷课

    }else if(url.indexOf('zhihuishu.com/portals_h5/2clearning.html#/course2cStudy')!=-1){
        drawWindow();
        console.log('开始刷视频');
        $('#content').html('<div ><p  id="rate_txt" >播放速度：默认1.5倍速</p>');
        setTimeout(function(){start('li.lessonItem','.icon.finishProgress')},3000)//开始刷兴趣课视频，传入视频li元素：li.lessonItem 和完成的视频包含的元素：icon.finishProgress即可刷课。
    }
    else if(url.indexOf('zhihuishu.com/stuExamWeb')!=-1 &&url.indexOf('dohomework')!=-1 ){
        drawWindow();
        $('#content').html('<div ><p  id="ready" >正在准备自动答题中...(清除选择)</p>');
        console.log('开始自动答题');

        clear_options();

    }



})();