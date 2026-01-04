// ==UserScript==
// @name         华医网 《继续教育 & 公需课》 辅助学习工具
// @author        极品小猫
// @namespace      https://greasyfork.org/users/3128
// @version       3.2.1
// @update        2025-06-24
// @description    打开视频播放页面后，自动播放视频，自动答题，自动下一个课程。切勿使用任何支持跳过视频的脚本，避免记录违规作弊，否则可能会记录不良诚信档案。
// @include       https://*.91huayi.com/pages/course.aspx?*
// @include        https://*.91huayi.com/course_ware/course_ware_cc.aspx?*
// @include        https://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @include        https://*.91huayi.com/pages/exam.aspx?*
// @include        https://*.91huayi.com/pages/exam_result.aspx?*
// @homepage      https://greasyfork.org/zh-CN/scripts/427824
// @supportURL    https://greasyfork.org/zh-CN/scripts/427824/feedback
// @icon           https://www.91huayi.com/upload/images/2019/12/3017338625.png
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @grant        GM_info
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceURL
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/427824/%E5%8D%8E%E5%8C%BB%E7%BD%91%20%E3%80%8A%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%20%20%E5%85%AC%E9%9C%80%E8%AF%BE%E3%80%8B%20%E8%BE%85%E5%8A%A9%E5%AD%A6%E4%B9%A0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/427824/%E5%8D%8E%E5%8C%BB%E7%BD%91%20%E3%80%8A%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%20%20%E5%85%AC%E9%9C%80%E8%AF%BE%E3%80%8B%20%E8%BE%85%E5%8A%A9%E5%AD%A6%E4%B9%A0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

/**
 * @version: 3.2.1
  @update: 2025-06-24
  @description:
   - 1、【修复】考试结果页面无法继续学习
   - 2、【修复】修正课程数据记录，因课程标题含有多余信息导致答题功能异常
   - 3、【修复】视频播放页面自动答题功能
   - 4、【修复】某些情况下视频无法自动播放的问题

 * @version: 3.2.0
 * @update: 2024-10-30
 * @description 1、【增加】禁用《课堂问答》功能

 * @version: 3.1.9
 * @update 2024-10-23
 * @description 1、【修复】考试功能\n2、移除layer依赖库（网站已经引入）

 * @version: 3.1.8
 * @update: 2024-10-18
 * description: 1、【优化】数据库结构。\n2、【优化】视频答题功能

 * version: 3.1.7
 * update: 2024.07.14
 * description: 1、【修复】考试结束不会自动学习下一章节。\n2、【修复】视频答题不会自动答题。

 * 2024-10-12
 banSeek 替换为 ban_seek_by_limit_time

2021-11-29
1、优化自动考试，延迟交卷，避免触发验证码
2、优化自动进入考试逻辑

保利视频API文档：https://www.polyv.net/help/guide/polyvdoc/list_108_2.html
保利播放器API文档：https://help.polyv.net/index.html#/vod/js/video_player/reference?id=%e6%92%ad%e6%94%be%e5%99%a8%e6%8e%a5%e5%8f%a3

//变量解析
@cwid = 课程列表中，节的 ID
@cwrid = 课程列表中，章的 ID
banSeek = '0' == '0' ? 'on' : 'off'; //==0时，禁用进度跳转功能，该数据由打开页面时生成，如果已经答完视频题，则开启跳转功能
if_deny_multiterminal_play = '0' //多个播放页面状态判断，= 1 时启用

页面函数作用解析
showExam(true); 显示考试按钮，会在播放完毕时执行
delCookie("playState"); //删除播放状态的Cookie, 不删除无法进入考试页面，会在播放发完毕时执行

getCourseWarePlayState 获取课程播放状态，返回结果 {errMsg: "ok", errorCode: "1", reBody: null, reValue: null}，Code == 2 时，跳转到 "../pages/noplay.aspx?cid=" + cid;
addCourseWarePlayRecord 添加课程进度记录，会在播放完毕时执行
updateCourseWareProcess 更新课程进度记录，会在关闭网页窗口时执行

//计时器事件
setIntervalDemo 定时执行函数，300000（30分钟）执行一次更新课程进度记录函数，调用 updateCourseWareProcess
setCourseWarePlay 定时执行播放状态检测，调用 getCourseWarePlayState

custom_player_stop 视频播放结束时执行的函数，通过监听添加到视频播放结束时间中

s2j_onPlayerInitOver 播放器播放执行事件

*/
/**
 * 华医网接口
 * @function addCourseWarePlayRecord 添加课程进度记录
        $.ajax({
            type: "get",
            url: "/ashx/add_course_ware_play_record.ashx",
            dataType: "json",
            data: {
                relation_id: cwrid,
                user_id: uid
            },
            error: function () { alert("请求异常"); },
            success: function (res) {
                if (res.code != 0) {
                    alert(res.msg);
                }
            }
        });

 * @function getCourseWareProcessQuestion //视频题问答数据位置
 function getCourseWareProcessQuestion() {
        if (1 == 0) {
            return;
        }
        if (player.getCurrentMode() == 'audio') {
            return;
        }
        $.ajax({
            type: "get",
            timeout: 1000 * 30, //超时时间 单位毫秒
            dataType: "json",
            url: "../ashx/get_course_ware_process.ashx",
            data: { cwid: cwid, video_type: "polyv" },
            error: function () { },
            success: function (data) {
                player.sendQuestion(data);
            }

        });
    }
**/





(function () {
    //GM_deleteValue('setting')
    'use strict';
var updatenote='优化【自动进入考试】功能，可进入除公需课外的考试。<br>优化答题功能，题库数据结构<p>本脚本的使用需要进入到课程的视频播放页面才能看见设置按钮。<br><br>支持【公需课】，点击右下角的设置按钮进行功能勾选，建议勾选“除（视频跳过）的全部”选项。屏蔽功能可以按照自身的需要选择，对学习考试不影响，主要是让页面整洁。<br><b>跳过视频功能使用建议</b>：建议尽可能不使用该功能，该功能虽然能够完成学习，但是无法改变学习时长的记录。学习时长的记录在后台可查询，如果在一些严格审查的课程中使用，可能会遭到“记录不良诚信档案”的处罚，可能影响职称评定。';

    (function() {
        let s = document.createElement("link");
        s.href = GM_getResourceURL("layerCSS");
        s.rel = "stylesheet";
        document.body.appendChild(s);
    })();
    let u=unsafeWindow, $=u.$, layer=u.layer;
    let path = location.pathname,
        webTitle = document.title,
        cid = u.cid, //项目ID，即课程ID
        cwid = u.cwid, //课程列表，章ID，CourseWareID
        cwrid = u.cwrid, //课程列表，节ID（课程内容ID）
        CourseTitle = webTitle.replace(/---.+/i,''), //课程标题
        CourseWareTitle = webTitle.replace(/.+---/,'');

    let CourseWareAnswer; //试题数据缓存

    let onceSetting=typeof(GM_getValue('setting'))=='undefined';

    //设置按钮函数体
    let fn={
        UJS_Setting : function(){
            settingUI(true);
        },
        UJS_Course_ware : function(){ //视频问答
            let CourseDB = GM_getValue('CourseDB'); //课程数据库
          console.log(cid, CourseDB);
          let CourseData = CourseDB[cid], //加载课程数据
                CourseData_cwrid = CourseData['CourseWare'][cwrid]; //加载课件数据
            console.table({cwid, cwrid, CourseData_cwrid})
            console.log(`CourseData: `, CourseData);
                let CourseData_cwrid_qa = CourseData_cwrid['qa']; //加载问答数据

            if($.isEmptyObject(CourseData_cwrid_qa)) { //检查课程数据是否存在，不存在时创建课程数据记录
                let QuestFixed=/(?<=;)amp;?/; //问题修正补丁，修正记录到数据库中的问题（因不规范无法正常在HTML中显示，需要进行数据库修正）
                console.trace('课程数据不存在，拉取视频答题库');
                $.ajax({
                    type: "get",
                    timeout: 1000 * 30, //超时时间 单位毫秒
                    dataType: "json",
                    url: "../ashx/get_course_ware_process.ashx",
                    data: {
                        cwid: u.cwid, //章ID
                        relation_id: cwrid, //节IDcwid
                        video_type: "polyv" },
                    success: function (data) {
                        console.log(`视频题库：`, data);
                        $.each(data, function(i, bodyItem){
                            //获取选项
                            let choices=bodyItem.choices,
                                examid=bodyItem.examid, //视频答题ID
                                answer;
                            CourseData_cwrid_qa[examid]={}; //生成视频问题数据
                            CourseData_cwrid_qa[examid]['showTime']=bodyItem.showTime; //问题出现时间
                            CourseData_cwrid_qa[examid]['question']=bodyItem.question.replace(QuestFixed,''); //问题
                            console.log('题库信息：', bodyItem.question.replace(QuestFixed,''))

                            //获取正确答案序号
                            $.each(choices, function(i, val){
                                console.log('答题：', i, val)
                                if(val.right_answer===1) {
                                    answer=i; //记录答案选项的序号
                                    CourseData_cwrid_qa[examid]['answer']=answer;
                                    return false;
                                }
                            });
                        });

                        console.log('视频答题题库：',CourseData_cwrid_qa);
                        GM_setValue('CourseDB', CourseDB);
                        console.log(this);
                        fn.UJS_CourseWareAnswer(CourseData_cwrid_qa);

                        //视频题问答数据位置
                        //player.sendQuestion(data.body);
                        //first = false;
                    },
                    error: function () {
                    }
                });
            } else {
                console.log('数据存在，读取数据');
                fn.UJS_CourseWareAnswer(CourseData_cwrid_qa);
            }
        },
        UJS_CourseWareAnswer(CourseWareAnswer){ //视频答题——选择题答题模块
            let t=setInterval(function(){
                if(document.querySelector('.pv-ask-form')) {
                    clearInterval(t);
                    let question=$('.pv-ask-right h3').text().replace(/【单选题】/,'').trim(),
                        CurrentTime=parseInt(player.j2s_getCurrentTime()),
                        course_question={}; //转置为使用showTime排列，以供后面答题模块使用
                    $.each(CourseWareAnswer, function(i, val){
                        course_question[val.question]=val;
                    });

                    console.log(`课程QA`, CourseWareAnswer, course_question);
                    $('.pv-ask-form>[id^="pv-"]')[course_question[question].answer].checked=true;

                    //关闭回答框
                    setTimeout(()=>{
                      console.log('提交答案');
                      $('.pv-ask-submit').click();
                    }, 2000);
                    setTimeout(()=>{
                        $('.pv-ask-default').click();
                    }, 2000);
                }
            }, 1000);
        }
    }

    var UJS_Config=UJS_Setting();

    //主线程函数体
    let huayi={
        createDB(){
            let CourseDB = GM_getValue('CourseDB',{CourseList:{},desc:'记录课程列表，视频问答，考试问答'});
          //获取课程cid
                let cid = new URLSearchParams(location.search).get('cid'),
                    //获取课程标题
                    CourseTitle=$('.info>h3>.f14blue').replace(/\s*公需科目\s*$/,'').text().trim();
            //添加课程信息
            if(!CourseDB[cid]) {
                CourseDB['CourseList'][CourseTitle] = cid;
                let cidDB = {cid:cid, CourseTitle:CourseTitle, CourseWare:{}}, CourseWareDB=cidDB['CourseWare'];
                //获取课程列表，并创建数据库
                $('.course a[target="new_courseWare"]').each((i,e)=>{
                    let cwid = new URLSearchParams(e.search).get('cwid'), cwid_name=$(e).text().trim();
                    CourseWareDB[cwid] = {index:i, cwid:cwid, cwrid:cwrid, name:cwid_name, qa:{}, exam:{}};
                });

                CourseDB[cid] = cidDB;
                GM_setValue('CourseDB', CourseDB)
            }
        },
        polyv : function(){ //保利视频，course_ware_polyv.aspx

          /*
          // 该方法会引发播放器功能异常，放弃使用
          //修改播放器配置
          let newPlayerConfig = {
            ban_seek_by_limit_time : 'on', //如果允许跳过视频进度，则直接进入考试
            speed : 'ifRatePlay',//false关闭倍速
            audioMode : false,
            is_interaction : 'off',//on打开过程题,off关闭过程题(保利威后台题目)
            speed: true,//开启倍速播放, false关闭倍速
            //maxPlaybackRateLimit: ratePlayLimitNum, 倍速播放限制
          }

                //修改播放配置
                Object.assign(u.playerConfig, newPlayerConfig);
                $('.pv-video-player').remove();//移除掉播放器
                //重新加载播放器

                setTimeout(()=>{
                  u.player = polyvPlayer(playerConfig);
                }, 3*1000)

                console.log(u.playerConfig);
                */

          if(u.playerConfig.ban_seek_by_limit_time =='off') {//是否禁止拖拽进度至视频未播放到的位置，为on时只可在已播放过的进度范围内拖拽
            //u.showExam(true);
            //u.delCookie("playState");
            //u.addCourseWarePlayRecord();
          }



            /**
             * Hack 弹窗提示

            */
            u.openProcessbarTip=()=>{}

            //移除不能拖拽弹窗提示
            $('#div_processbar_tip').remove()

            var t=setInterval(function(){
                var oVideo = document.querySelector('video');
              if(oVideo) {
                //延时10秒，检测是否开始自动播放，如果还没开始播放，恢复播放
                setTimeout(()=>{
                  console.warn('检测视频是否已经开始播放', u.player.j2s_getCurrentTime());
                  if(u.player.j2s_getCurrentTime()===0) u.player.j2s_resumeVideo();
                  //播放失败提醒
                  setTimeout(()=>{
                    if(u.player.j2s_getCurrentTime()===0) alert('视频恢复播放失败，请手动播放');
                  }, 3*1000)
                }, 10*1000)

                    //console.warn('获取到视频对象：', oVideo);
                    clearInterval(t);
                    sessionStorage[`cid`]=cid;

                  //视频触发播放事件时，静音视频
                    if(UJS_Config.VideoMute) u.player.on('s2j_onVideoPlay', (e)=>{
                        console.log('静音视频');
                        u.player?.j2s_setVolume(0);
                        document.querySelector("video").defaultMuted = true;
                        document.querySelector('video').volume=0;
                    });

                    if(UJS_Config.PlayOverNotif) u.player.on('s2j_onPlayOver', (e)=>{GM_notification({text:'课程播放结束，准备进入考试', timeout: 5000})});

                    //破解跳转功能（现在会记录播放时长，时长不足无法跳过）
                    //if(UJS_Config.polyv.banSeek) u.player.html5.banSeek=false; //进度条拖动控制， = false 时可可拖动，= true 不可拖动

                    //自动进入下一个视频
                    if(UJS_Config.VideoNext) {
                        //u.s2j_onPlayOver(); //完成学习
                      console.log('添加播放结束监听');
                        u.player.on('s2j_onPlayOver', function(){
                        console.log('--- 视频播放结束，自动进入考试监听');
                            countDown('10', '秒后进入考试', '', function () {//进入考试
                                if($('#jrks').attr('href')!=='#') location.href=$('#jrks').attr('href');
                            });
                        });

                        if(!/公需课/.test(webTitle)) { //非公需课科目可以立刻自动进入考试
                            if($('#jrks').attr('href')!=='#') {
                                countDown('10', '秒后进入考试', '', function () {//进入考试
                                    location.href=$('#jrks').attr('href');
                                });
                            }
                            GM_xmlhttpRequest({
                                url: `/pages/exam.aspx?cwid=${u.cwrid}`,
                                onload : (result)=>{
                                    //console.log(result, result.response)
                                    if(/在线考试/.test(result.response))
                                        countDown('10', '秒后进入考试', '', x=>location.href=`/pages/exam.aspx?cwid=${u.cwrid}`);//进入考试
                                }
                            })
                        }
                    }

                    if(UJS_Config.polyv.couserSkip) {
                        console.log('开启【禁用《课堂问答》】')
                        u.old_getCourseWareProcessQuestion = u.getCourseWareProcessQuestion;
                        u.player.old_sendQuestion = u.player.sendQuestion;
                        u.getCourseWareProcessQuestion = () => {
                            console.warn('禁用视频答题功能');
                            $.ajax({
                                type: "get",
                                timeout: 1000 * 30, //超时时间 单位毫秒
                                dataType: "json",
                                url: "../ashx/get_course_ware_process.ashx",
                                data: { cwid: cwid, video_type: "polyv" },
                                error: function () { },
                                success: function (data) {
                                    //player.sendQuestion(data);
                                }
                            });
                        }
                    }
                    if(UJS_Config.polyv.couserAnswer) {
                        console.log('开启视频答案功能')
                        u.player.on('s2j_onVideoPause', function(e){
                            console.log(`视频暂停了, vid: ${e}, 检测是否需要视频答题`);
                            fn.UJS_Course_ware();
                            //u.player.on('s2j_onVideoSeek', fn.UJS_Course_ware());
                        });
                        $('video').on(`pause`, (e)=>{
                            console.log(`jQuery 方法监测到视频暂停，调用视频答题`, e)
                            fn.UJS_Course_ware();

                        })
                    }
                }
            }, 3000);
        },
        ccVideo: function () {
            var myid = u.prefix + u.vid;
            if(UJS_Config.cc.isStrict) isStrict=1; //进度条拖动控制， = 1 时可可拖动，= 0 不可拖动

            console.log(getSWF, myid);
            var myinter = setInterval(function () {
                var oVideo = getSWF(myid);
                if(oVideo) {
                    //console.warn('获取到视频对象：', oVideo);
                    window.clearInterval(myinter);
                    var old_custom_player_start = u.custom_player_start; //克隆开始事件
                    u.custom_player_start=function(){ //播放结束事件，自动跳到下一个视频
                        //old_custom_player_start();
                        if(UJS_Config.VideoMute) oVideo.setVolume(0);//静音视频
                        //if(UJS_Config.cc.VideoQuality) oVideo.setQuality(0); //切换低清晰度视频（节约资源）

                        if(UJS_Config.VideoSeek) {
                            if(!/2020年公需课/.test(document.title)) {
                                countDown(10, '秒后跳过视频，进入考试','', function(){
                                    getSWF(myid).seek(getSWF(myid).getDuration()-10);
                                })
                            }
                        }

                    }
                    var old_custom_player_stop = u.custom_player_stop; //克隆结束事件
                    u.custom_player_stop=function(){ //播放结束事件，自动进入考试
                        old_custom_player_stop();
                        if(UJS_Config.VideoNext) {
                            setTimeout(function () {
                                u.check_next_click();
                            }, 3000);
                        }
                    }
                }
            }, 3000);
            //自动进入下一个视频
            if(UJS_Config.VideoNext) {
                countDown('10', '秒后进入考试', '', x=>location.href=`/pages/exam.aspx?cwid=${u.cwrid}`);//进入考试
            }
        },
        doTest: function () {
            if(UJS_Config.Exam) {
                $('.five-stars').click(); //五星好评
                $('[id^="gvQuestion_result_"]').each(function(){ //#gvQuestion_result_0 隐藏 input 存放着正确答案，提取答案自动回答
                    var Question_result=$(this).val();
                    $('input[type="radio"][value="'+ Question_result +'"]').click();
                });

                var delay=parseInt(Math.random()*10+10); //生成随机作答时间，模拟作答
                countDown(delay, '\n秒后自动提交回答', '模拟作答过程', function(){
                    $('#btn_submit').click();
                });
            }
        },
        doResult: function () {
            /**
             * @url *\/pages\/exam_result.aspx
             * @description 考试结束结果页面，记录考试状态，如果考试没通过，则记录错误的题目，重新考试，换个答案
            */
            if(UJS_Config.Exam) {
                let result = $("p.tips_text").text().trim(), //获取考试状态标题
                    ExamBtn = document.querySelector('input[value="重新考试"]');
                if($('state_edu').text().includes("申请证书")) {

                }
                if (/考试通过|已学习完毕/.test(result)) {
                    if(UJS_Config.PlayOverNotif) GM_notification({text:'考试通过，进入下一个课程', timeout: 5000});
                    delete sessionStorage['wrongExam'];
                    let next = document.querySelector('input[value="立即学习"]');
                    if (next) {
                        next.click();
                    }
                } else if(ExamBtn){ //考试没过，记录错误题目
                    let wrongTitle = {},
                        CourseDB = GM_getValue('CourseDB'),
                        cid = sessionStorage[`cid`],
                        cwid = getQueryString('cwid', ExamBtn.getAttribute('onclick')),
                        ExamQuest = CourseDB[cid]['CourseWare'][cwid]['exam'];

                    $('li.state_cour_lis').each(function(){//记录错误的题目
                        if($(this).find('img[src$="error_icon.png"]').length>0) {
                            let quest=$(this).find('p:first').text().trim().replace(/^\d+、/,'');
                            console.log(quest);
                            wrongTitle[quest]=ExamQuest[quest];
                        }
                    });

                    sessionStorage['wrongExam']=JSON.stringify(wrongTitle);
                    ExamBtn.click(); //考试未通过，重新考试
                }
            }
        },
        doExam : function(){ //考试答题
            $('.one-stars').click(); //五星好评

            let CourseDB = GM_getValue('CourseDB'),
                sessionTitle = $('.point-box span').text().trim(),  //课程标题
                CourseTitle = $('.point-box a').eq(1).text().trim().replace('归属于 项目:',''),
                cid = sessionStorage[`cid`]||CourseDB['CourseList'][CourseTitle],
                cwid = getQueryString('cwid'),
                ExamQuest = CourseDB[cid]['CourseWare'][cwid]['exam'],
                wrongExam; //错误题目

            if(sessionStorage['wrongExam']) {
                wrongExam=JSON.parse(sessionStorage['wrongExam']); //处理错误题目为JSON对象
            }

            //自动答题
            $('label.q_name').each(function(i, e){
                let QuestionID=$(this).data('qid'), //获取题目ID
                    quest=$(this).text().trim().replace(/^\d+、/,''), //题目内容，处理题目编号
                    ChoicesIndex=0, //初始化选项索引
                    ChoicesList=$(`input[type="radio"][name^="radio_${QuestionID}"]`), //获取题目对应的所有选项
                    ChoicesLength=ChoicesList.length; //获取选项的数量

                if(wrongExam && wrongExam[quest])
                    ChoicesIndex=Number(wrongExam[quest]['index'])+1; //如果该题目为错误题目，则进行答案选项序列+1
                else 
                    ChoicesIndex=Number(ExamQuest[quest]?.['index'])||0;//如果不是错误的题目，则从缓存中读取上一个选择的答案

                console.log(CourseTitle, sessionTitle, ExamQuest);
                console.table({课程ID:cwid,题目对象:e,题目ID:QuestionID,题目内容:quest,题目答案:ChoicesList.textContent,题目答案索引:ChoicesIndex})
                console.log(ChoicesList[ChoicesIndex]);
                ChoicesList[ChoicesIndex].checked=true;
            });

            //保存数据
            $('#btn_submit').click(function(){
                //保存题目
                $('label.q_name').each(function(i, e){
                let QuestionID=$(this).data('qid'), //获取题目ID
                    quest=$(this).text().replace(/^\d+、/,''),//获取题目
                    choicesID;
                    //遍历该题目的答案
                    $(`input[type="radio"][name^="radio_${QuestionID}"]`).filter((i,e)=>{
                        if(e.checked) choicesID = {index:i,value:e.value}
                    })
                    $(`input[type="radio"][name^="radio_${QuestionID}"]:checked`).val(); //记录正确答案的ID
                    ExamQuest[quest]=choicesID;
                    //console.log(quest, choicesID)
                });
                GM_setValue('CourseDB', CourseDB);
            })//.click(); //立刻提交

            //延迟提交
            var delay=parseInt(Math.random()*10+10); //生成随机作答时间，模拟作答
            countDown(delay, '\n秒后自动提交回答', '模拟作答过程', function(){
                $('#btn_submit').click();
            });
        },
        Init : function(){
            if(!onceSetting) {
                switch(path){
                    case '/pages/course.aspx':
                        this.createDB(); //创建课程数据
                        break;
                    case '/course_ware/course_ware_polyv.aspx':
                        huayi.polyv();
                        break;
                    case '/course_ware/course_ware_cc.aspx':
                        huayi.ccVideo();
                        break;
                    //case '/pages/exam.aspx': //旧版考试
                        //huayi.doTest();
                    case '/pages/exam.aspx': //新版考试
                        huayi.doExam();
                        break;
                    case '/pages/exam_result.aspx': //考试结束，自动下一个课程
                        huayi.doResult();
                        break;
                }
            }
        }
    }
    huayi.Init();

    // Your code here...
    function countDown(second, content, title, delayFn, layerFn){
        layer.msg(content, {
            time : 0,
            title : title||'',
            //shade: 0.6,
            success: function(layero, index){
                var msg = layero.text();
                var msgbody = layero.find(".layui-layer-content");
                var i = second;
                var timer = null;
                var msgfn = function() {
                    msgbody.text(' ' + i + ' ' + content);
                    if(!i) {
                        layer.close(index);
                        clearInterval(timer);
                        delayFn();
                    }
                    i--;
                };
                timer = setInterval(msgfn, 1000);
                msgfn();
            },
        }, layerFn);
    }



    function UJS_Setting(){
        var Config={polyv:{}, cc:{isStrict:false}, Exam:true, VideoSeek:false, VideoMute:true, VideoNext:true, changyan:false, extension:{settingtips:false, updataTips:true, version: GM_info.script.version}},
            setting=GM_getValue('setting')||Config;

        GM_addStyle(`
        #UJS_Wrap {font-size: 18px;position:fixed;right:18px;bottom:18px;}
        .UJS_Btn {border:1px;font-size:18px;width:80px;height:80px;line-height:80px;cursor:pointer;text-align:center;padding:2px;}
        #UJS_Setting {background:#ccc;}
        #UJS_Course_ware {background:#81d2f1;}
        `);

        let UJS_Wrap=$('<div id="UJS_Wrap">'),
            UJS_item={
                UJS_Setting: $('<div id="UJS_Setting" class="UJS_Btn">').text('设置').on('click', function(){settingUI(true)}),
                UJS_Course_ware: $('<div id="UJS_Course_ware" class="UJS_Btn">').text('视频答题').on('click', fn.UJS_Course_ware)
            };

        $.each(UJS_item, function(key, value){ //遍历创建的对象，并绑定对应的函数
            //console.log(key, value, fn[key]);
            UJS_Wrap.append(value);
            //value.click(fn[key]);
        });
        UJS_Wrap.appendTo('body');


        GM_addStyle(`
        #OptionConfigUI > input[type="button"] {border:2px solid #ccc;padding:5px 10px;font-size:18px;margin:0 2px;} #OptionConfigUI>input{margin:5px 0;}
        #OptionConfigUI input{appearance:auto};
        #OptionConfigUI > fieldset {padding:5px 10px;border:1px;}
        `);

        if(!setting.extension.settingtips) {
            layer.tips('看看这里，华医网辅助脚本现在可以自行按需要设置功能', '#UJS_Setting', {time:30*1000, tipsMore: true});
        }
        if(setting.extension.version!==GM_info.script.version) {
            var l=layer.open({
                title:'华医网辅助工具 更新日志',
                area: '600px',
                content:'<style>.layui-layer-content{text-align:left;}</style><h2>脚本已更新到：'+GM_info.script.version+'</h2><br><h2>更新内容</h2><hr>'+updatenote,
                yes : function(index, layero){
                    layer.close(index);
                    setting.extension.version=GM_info.script.version;
                    GM_setValue('setting', setting);
                }
            });
        }

        var com={
            init : function(e){ //应用脚本配置
                if(setting.changyan) $('.evaluation').hide();
                if(setting.lybox) $('.ly_box').hide();
                if(setting.ad) $('body>.top, #floatTips').hide();
                if(onceSetting) settingUI();
            }
        }

        let settingUI=function(ConfigChange){ //创建设置界面
            if(!document.querySelector('#OptionConfigUI')) {
                setting=GM_getValue('setting')||Config;
                var mainUI=$('<div style="border:solid #033fff 3px;width:550px;height:550px;position:fixed;left:25%;top:10%;padding:20px;background:#eeeeee;z-index:9;font-size:16px;line-height:24px;text-align:justify;z-index:999">').attr({'id':'OptionConfigUI'}).append(`
欢迎首次使用“华医网”辅助学习脚本，脚本程序为了提高学习速度而制作，在使用之前请先了解使用方法，如担忧加速学习的功能会影响职称考核，建议不要启用“自动跳过视频”功能。<p></p><style>#OptionConfigUI>input{padding:0 5px;}</style>
两种播放器对应两种学习网址：course_ware_cc 与 course_ware_polyv
<fieldset id="UI_polyv"><legend> polyv 播放器 </legend><p>*在公需课中，由于后台记录播放时长，因此禁止使用【解除视频进度条拖动限制】。\n禁用《课堂问答》，答题则由脚本后台发送答题结果至服务器，尽可能保证学习记录的完整性。</p></fieldset>
<fieldset id="UI_cc"><legend> cc 播放器 </legend></fieldset>
`);
                var UIBox={
                    polyv : {
                        banSeek:'<input type="checkbox" id="UI_polyv_banSeek"><label for="UI_polyv_banSeek">解除视频进度条拖动限制（公需课禁用）</label>',
                        couserAnswer:'<input type="checkbox" id="UI_polyv_couserAnswer"><label for="UI_polyv_couserAnswer">视频《课堂问答》自动答题</label>',
                        couserSkip:'<input type="checkbox" id="UI_polyv_couserSkip"><label for="UI_polyv_couserSkip">禁用《课堂问答》</label>',
                    },
                    cc : {
                        isStrict:'<input type="checkbox" id="UI_cc_isStrict"><label for="UI_cc_isStrict">解除视频进度条拖动限制</label>',
                    },
                    VideoMute:'<input type="checkbox" id="UI_VideoMute"><label for="UI_VideoMute">自动静音播放视频</label>',
                    VideoSeek:'<input type="checkbox" id="UI_VideoSeek"><label for="UI_VideoSeek">自动跳过视频（秒看功能，默认不对<b>公需课</b>生效）</label>',
                    VideoNext:'<input type="checkbox" id="UI_VideoNext"><label for="UI_VideoNext">自动进入考试/自动进入下一个视频</label>',
                    PlayOverNotif:'<input type="checkbox" id="UI_PlayOverNotif"><label for="UI_PlayOverNotif">播放/考试 完成桌面通知</label>',
                    Exam:'<input type="checkbox" id="UI_Exam"><label for="UI_Exam">自动考试</label>',
                    changyan:'<input type="checkbox" id="UI_changyan"><label for="UI_changyan">屏蔽畅言评论区</label>',
                    lybox:'<input type="checkbox" id="UI_lybox"><label for="UI_lybox">屏蔽评论区（常见问题）</label>',
                    ad: '<input type="checkbox" id="UI_ad"><label for="UI_ad">屏蔽下载APP广告、顶部浏览器推荐</label>',
                }
                var UI_SaveBtn=$('<input type="button" id="UI_SaveBtn" value="保存">'),
                    UI_RecoveryBtn=$('<input type="button" id="UI_RecoveryBtn" value="恢复设置">'),
                    UI_CloseBtn=$('<input type="button" id="UI_CloseBtn" value="关闭">');

                var Event={
                    SaveBtn : function(){
                        if(setting.extension.settingtips==false) setting.extension.settingtips=true;

                        //配置回写
                        $('input[type="checkbox"][id^="UI_"]').each(function(e) {
                            var obj_id=this.id, setting_id=obj_id.replace(/^UI_/,'');

                            if(setting_id.indexOf('_')>-1) {
                                var setting_id_arr=setting_id.split('_');
                                setting[setting_id_arr[0]][setting_id_arr[1]]=this.checked;
                            } else {
                                setting[setting_id]=this.checked;
                            }
                        });

                        GM_setValue('setting', setting);
                        if(onceSetting) {
                            //首次保存设置时，刷新页面
                            location.reload();
                        } else {
                            com.init();
                            Event.CloseBtn();
                            layer.confirm('视频答题等功能需要刷新页面才能起作用，是否现在刷新页面？',{icon: 7,title:'脚本设置生效需刷新页面！'}, function(index, layero){
                                location.reload();
                            });
                        }
                    },
                    CloseBtn : function(){
                        mainUI.remove();
                    },
                    RecoveryBtn : function(){
                        GM_setValue('setting', Config);
                        com.init();
                        location.reload();
                    },
                    VideoSeekTips : function(e, s){
                        layer.confirm('视频跳过功能可以快速完成学习，但是无法改变学习时长的记录，如果单位审查学习时长，有可能会“记录诚信不良档案”，严重情况下可能会影响职称评定，你确定要开启该功能吗？',{icon: 7,title:'视频跳过功能警告！'}, function(index, layero){
                            layer.close(index);
                            console.log(e.target.checked=true);
                        }, function(index, layero){
                            layer.close(index);
                            console.log(e.target.checked=false);
                        });
                        e.preventDefault();
                    }
                }
                UI_SaveBtn.on('click', Event.SaveBtn);
                UI_RecoveryBtn.on('click', Event.RecoveryBtn);
                UI_CloseBtn.on('click', Event.CloseBtn);
                //$('body').append(mainUI.append(UI_VideoMute, '<br>', UI_VideoSeek, '<br>', UI_Exam, '<br>', UI_SaveBtn, UI_RecoveryBtn));
                //$('#UI_cc').append(UI_cc_isStrict);

                //创建界面选项
                $('body').append(mainUI);
                console.log(UIBox);
                for(var UIBox_e in UIBox){
                    //console.log(UIBox_e, UIBox[UIBox_e]);
                    if(typeof(UIBox[UIBox_e])=='object') {
                        for(var UIBox_f in UIBox[UIBox_e]){
                            console.log(UIBox[UIBox_e], UIBox_f, UIBox[UIBox_e][UIBox_f]);
                            $('#UI_'+UIBox_e).append(UIBox[UIBox_e][UIBox_f], '<br>');
                        }
                    } else {
                        mainUI.append(UIBox[UIBox_e], '<br>');
                    }
                }
                mainUI.append(UI_SaveBtn, UI_CloseBtn, UI_RecoveryBtn, '部分设置修改需要<span color="red">刷新</span>页面才会起作用');
                $('#UI_VideoSeek').on('click', Event.VideoSeekTips)

                //载入配置数据到界面
                for(var e in setting){
                    if(e=='extension') continue;
                    if(typeof(setting[e])=='object') {
                        for(var f in setting[e]) {
                            //console.log(e, f, setting[e][f]);
                            $('#UI_'+e+"_"+f).prop('checked', setting[e][f]);
                        }
                    } else {
                        //console.log(e, setting[e]);
                        $('#UI_'+e).prop('checked', setting[e]);
                        //console.log($('#UI_'+e));
                    }
                }
            }
        }

        com.init();
        UJS_Config=setting;

        return UJS_Config;
    }


    function getQueryString(name,url) {//筛选参数
        var reg, str;
        url=url?url.match(/[?#].*/).toString():location.search;	//网址传递的参数提取，如果传入了url参数则使用传入的参数，否则使用当前页面的网址参数

        if(Array.isArray(name)){
            for(var i in name){
                reg = new RegExp("(?:^|&)(" + name[i] + ")=([^&]*)(?:&|$)", "i");		//正则筛选参数
                str = url.substr(1).match(reg);
                if (str !== null) return unescape(str[2]);
            }
        } else {
            reg = new RegExp("(?:^|&)(" + name + ")=([^&]*)(?:&|$)", "i");		//正则筛选参数
            str = url.substr(1).match(reg);
            if (str !== null) return unescape(str[2]).replace(/'/,'');
        }
        return null;
    }
})();