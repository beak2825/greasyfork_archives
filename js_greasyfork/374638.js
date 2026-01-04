// ==UserScript==
// @name         形势与政策自动挂机
// @version      1.0
// @description  自动定位章节、看视频、阅读、答题！
// @author       haimage
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @match	 https://ua.ulearning.cn/learnCourse/learnCourse.html?courseId=9611*
// @require      https://cdn.bootcss.com/clipboard.js/1.5.16/clipboard.min.js
// @supportURL	 
// @run-at       
// @grant        
// @namespace undefined
// @downloadURL https://update.greasyfork.org/scripts/374638/%E5%BD%A2%E5%8A%BF%E4%B8%8E%E6%94%BF%E7%AD%96%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/374638/%E5%BD%A2%E5%8A%BF%E4%B8%8E%E6%94%BF%E7%AD%96%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==
function init() {
    var uLearnUrl = "https://ua.ulearning.cn/learnCourse/learnCourse.html";
    if(!(window.location.href.indexOf(uLearnUrl) >= 0)){
        console.log("页面地址不对，不能进行挂机...");
        //return 0;
    }else {
        var totalUnit = $('.chapter-name').length;
        var i=0;
        var t = setInterval(function () {
            $(".section-list .section-item .page-list .text .page-icon i[class='iconfont']:eq(0)").trigger('click');
            i++;
            console.log("正在定位章节中...");
            if(i>=totalUnit)
                clearInterval(t);
        },3000);
        //由于上面的定时器代码是异步执行的，所以这里我们也加上相应的延时。
        setTimeout(function () {
            isExamPage();
        },totalUnit*3000+3000);
    }
}
//判断是否为考试页面
function isExamPage() {
    console.log("判断是否为考试页...");
    var timeExam = setTimeout(function () {
        if($('.course-title').text().indexOf("习题") >= 0 && $('.question-view').length > 0){
            if($('.question-setting-panel .question-setting-list>div:eq(1)>div:eq(0)').text() == "重复答题"){
                console.log("当前是考试页面,并允许重复提交，提交默认答案以获得正确答案");
                if($('.question-operation-area .btn-submit').length > 0){
                    setTimeout(function () {
                        console.log("考试没做，进行提交");
                        doExam();
                    },2000);
                }else{
                    console.log("已经做了,重做");
                    $('.question-operation-area .btn-redo').trigger('click');
                    doExam();
                }
            }else{
                console.log("是考试页面,自动答题条件不符正在跳过...");
                // 考试界面明天再做处理吧,,,,先写个跳过的
                $('.next-page-btn').trigger('click');
                setTimeout(function () {
                    $('.modal-operation .btn-hollow').trigger('click');
                    setTimeout(function () {
                        $(".btn-hollow span:contains('继续')").trigger('click');
                        console.log("已跳过测试...");
                    },1000);
                },1000);
                isTextPage();
            }
        }else{
            console.log("...");
            isTextPage();
        }
    },2000);
}
function doExam() {
    console.log("开始答题");
    //所有题目
    var questionList = $('.question-element-node-list .question-element-node');
    var choiceList = $('.choice-item ');
    for(var i=0;i<choiceList.length;i++){
        if(i%4==0){
            $(".choice-item:eq("+i+")").trigger('click');
        }
    }
    var checkList = $('.checking-type');
    for(var i=0;i<checkList.length;i++){
        if(i%2==0){
            $(".choice-btn:eq("+i+")").trigger('click');
        }
    }
    //提交题目以获取答案
    setTimeout(function () {
        $('.question-operation-area .btn-submit').trigger('click');
    },2000);
    //获取答案
    var answerList = [];
    for(var i=0;i<questionList.length;i++)
        answerList.push($('.correct-answer-area:eq('+i+')').text().replace("正确答案：","").replace(/[ \r\n]/g,""));
    //重做
    setTimeout(function () {
        $('.question-operation-area .btn-redo').trigger('click');
    },3000);
    //多选题初始化(已选择的取消选择)
    $('.choice-item .selected').trigger('click');
    var position = 0;
    var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
    for(var i=0;i<questionList.length;i++){
        console.log(answerList[i]);
        if(answerList[i].length == 1){
            //单选题
            position = swicthAnswer(answerList[i]);
        }else if(reg.test(answerList[i])){
            //有汉字 == 判断题
            if(answerList[i] == "正确")
                position = 0;
            else
                position = 1;
        }else{
            //多选题
            answerList[i] = answerList[i].replace(/,/g,"");
            // console.log(answerList[i]);
            for(var j=0;j<answerList[i].length+1;j++){
                position = swicthAnswer(answerList[i][j]);
                $($(questionList)[i].children[0].children[1].children[0].children[0].children[position]).trigger('click');
                console.log(position);
            }
        }
        $($(questionList)[i].children[0].children[1].children[0].children[0].children[position]).trigger('click');
    }
    //再次提交
    setTimeout(function () {
        console.log("答题完毕，提交答案");
        $('.question-operation-area .btn-submit').trigger('click');
    },3000);
    setTimeout(function () {
        console.log("等待三秒，进入下一步")
    },3000);
    isTextPage();
}
function swicthAnswer(inChar) {
    var position = 0;
    if(inChar == "A"){
        position = 0;
    }else if(inChar == "B"){
        position = 1;
    }else if(inChar == "C"){
        position = 2;
    }else if(inChar == "D"){
        position = 3;
    }else if(inChar == "E"){
        position = 4;
    }else if(inChar == "F"){
        position = 5;
    }else if(inChar == "G"){
        position = 6;
    }else if(inChar == "H"){
        position = 7;
    }
    return position;
}
//判断是否为纯文本页面(并延时加载)
function isTextPage() {
    console.log("判断是否为视频节点");
    setTimeout(function () {
        if($('.page-content .page-element .video-element .jwpreview').length>0){
            videoNode();
        }else{
            textNode();
        }
    },3000)
}
//纯文本节点，，等待5秒，点击下一页
function textNode(){
    console.log("当前是文本页面，5秒后进入下一页")
    setTimeout(function () {
        nextTime();
    },5000)
}

//有视频节点，点击播放视频，定时检测是否播放结束 ？ 下一页 ： 日志
function videoNode() {
    console.log("当前是视频页面，开始播放视频");
    $('.page-content .page-element .video-element .jwpreview').trigger('click');
    var startVideo = setInterval(function () {
        if($('.video-progress .text span').text() == "已看完"){
            clearInterval(startVideo);
            setTimeout(function () {
                nextTime();
            },3000)
        }else{
            console.log('还没有看完视频')
        }
    }, 3000);
}

function nextTime() {
    $('.next-page-btn').trigger('click');
    isExamPage();
}

init();
