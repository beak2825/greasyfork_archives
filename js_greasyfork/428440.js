// ==UserScript==
// @name         佛山传媒集团云学堂自动学习
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  佛山传媒集团云课堂学习平台，自动看视频，自动考试
// @author       Roy Lu
// @match        http://fscm.yunxuetang.cn/kng/view/package/*
// @match        http://fscm.yunxuetang.cn/kng/course/package/video/*
// @match        http://fscm.yunxuetang.cn/exam/test/examquestionpreview.htm*
// @match        http://fscm.yunxuetang.cn/exam/exampreview.htm*
// @match        http://fscm.yunxuetang.cn/exam/test/userexam.htm*
// @match        http://fscm.yunxuetang.cn/plan/*
// @match        http://fscm.yunxuetang.cn/kng/plan/document/*
// @match        http://fscm.yunxuetang.cn/kng/plan/video/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/428440/%E4%BD%9B%E5%B1%B1%E4%BC%A0%E5%AA%92%E9%9B%86%E5%9B%A2%E4%BA%91%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/428440/%E4%BD%9B%E5%B1%B1%E4%BC%A0%E5%AA%92%E9%9B%86%E5%9B%A2%E4%BA%91%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==


//自动关闭页面
let closeWindow = function() {
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") != -1) {
        location.href = "about:blank";
    } else {
        window.opener = null;
        window.open('', '_self');
    }
    window.close();
}

$(function(){ 
    'use strict';
    // Your code here...
    //http://fscm.yunxuetang.cn/
    //程序配置
    let config = {
        //自动考试
        autoExam: true,
        //每页面跳转的按钮自动点击
        autoPressBtn: true
    }

    let url = window.location.href;
    let page = "list"  //默认视频列表页
    if(url.search("video")>-1) { page = "video"} //视频播放页
    if(url.search("userexam")>-1) { page = "userExam"} //考试页
    if(url.search("exampreview")>-1) { page = "examRetry"} //重新考试中转页
    if(url.search("examquestionpreview")>-1) { page = "examResult"} //考试结果页
    if(url.search("fscm.yunxuetang.cn/plan/")>-1) { page = "documentPlan"} //文档列表页（用于阅读学习文档），本代码行必须要放在文档明细页的前面
    if(url.search("plan/document/")>-1) { page = "documentRead"} //文档明细页（用于阅读学习文档）
    if(url.search("plan/video/")>-1) { page = "documentVideo"} //文档明细页（用于阅读学习文档）
    console.log("page=", page)


    //考试结果对象
    let examResultObj = []
    //题型
    let qType = {
        SingleChoice: 1,    //单选
        MultiChoice: 2,    //多选
        Judge: 3,       //判断
        Completion: 4,  //填空
        QA: 5           //问答
    }

    switch(page){
        case "list":{
            let _r = 0
            //视频列表页，页面打开后1秒点击开始按钮
            let _pressId = window.setInterval(function(){
                //任务对象
                let _task = GM_getValue("task")
                if(_task == undefined){
                    _task = {
                        p_list: false  //页面是否正常运行
                    }
                    GM_setValue("task", _task)
                }

                console.log("油猴-点击播放按钮")

                GM_deleteValue("examResult")  //删除页面已有的考试结果对象变量
                if(config.autoPressBtn && ($("#btnStartStudy").length > 0)){
                    $("#btnStartStudy").click()
                    _task.p_list = true
                    GM_setValue("task", _task)
                    window.clearInterval(_pressId)
                }

                i++

                if(i > 10) { window.location.reload()}
            }, 2000)

            //考试链接添加点击事件
            let examDiv = $("span.Knowledge_OteExam").parent().find("a")
            examDiv.on("click", function(){
                GM_deleteValue("examResult")
            })
            
            //考试按钮添加点击事件
            $("input.btnexam").off("click").on("click", function(){
                GM_deleteValue("examResult")
            })
            
            break
        }
        case "video":{
            //视频播放页，关闭声音
            // console.log("油猴-播放视频")

            //关闭播放器声音
            window.localStorage.setItem("baiducyberplayer.mute", "true")
            let _checkMuted = 0
            let _setMuted = window.setInterval(function(){
                document.querySelector("#vjs_video_3_html5_api").muted=true;
                _checkMuted++

                if(_checkMuted>4){
                    window.clearInterval(_setMuted)
                }
            }, 1000)

            //播放中定时检测，每10秒一次
            window.setInterval(function(){
                let _ck1, _ck2, _ck3
                _ck1=false, _ck2=false, _ck3=false

                if($("#divCompletedArea").css("display") != "none"){
                    _ck1=true
                    console.log(`[checkVideo] press go back button!`)
                    $("#divGoBack").click()
                }

                if($('input[value="我已学完此知识"]').length > 0){
                    _ck2=true
                    console.log(`[checkVideo] press study completed button!`)
                    completedStudy();
                }

                if($("#dvWarningView").length > 0 || $("#dvWarningView").css("display") != undefined){
                    _ck3=true
                    //移除提示按钮层
                    // console.log(`[checkVideo] press warning button!`)
                    // RemoveWarningHtml()
                    //弹出提示框时，直接刷新本页，代替点击确认键
                    window.location.reload();
                }

                console.log(`[checkVideo] Warning: ${_ck3}, Done: ${_ck1 || _ck2}`)
            }, 10000)

            //删除任务对象，保证返回列表页时能正常刷新页面
            GM_deleteValue("task")

        break
        }
        case "documentPlan":{
            //自动进行下一任务

            $("#tbodyTrainInfo>tr").each(function(i){
                if(i>0){
                    //跳过第一行标题行再进行检查
                    let _tr = $(this)
                    let _progress = _tr.find("td:last>span:last").text()
    
                    if(_progress != "100%"){
                        _tr.click();
                        return false;  //跳出本次循环
                    }
                }
            })

            break
        }
        case "documentRead":{
            //学习文档阅读页
            
            //播放中定时检测，每10秒一次
            window.setInterval(function(){
                //检查是否已完成
                if($("#divCompletedArea").css("display") != "none"){
                    console.log(`[checkVideo] press go back button!`)
                    // $("#divGoBack").click()  //点击返回上一页

                    window.opener.location.reload();  //刷新父页面
                    //关闭当前页面
                    window.setTimeout(function(){
                        closeWindow()
                    }, 1000)
                }

                //移除提示按钮层
                if($("#dvWarningView").length > 0 ){
                    console.log(`[继续学习] press warning button!`)
                    //按钮无法点击，改用页面刷新方法
                    // console.log(`[checkVideo] press warning button!`)
                    // RemoveWarningHtml()
                    window.location.reload();
                }

            }, 10000)

            break
        }
        case "documentVideo":{
            //学习文档中的视频播放页

            //关闭播放器声音
            window.localStorage.setItem("baiducyberplayer.mute", "true")
            let _checkMuted = 0
            let _setMuted = window.setInterval(function(){
                document.querySelector("#vjs_video_3_html5_api").muted=true;
                _checkMuted++

                if(_checkMuted>4){
                    window.clearInterval(_setMuted)
                }
            }, 1000)


            window.setInterval(function(){
                //检查是否有弹出提醒框
                if($("#dvWarningView").length > 0 || $("#dvWarningView").css("display") != undefined){
                    //移除提示按钮层
                    //按钮无法点击，改用页面刷新方法
                    // console.log(`[checkVideo] press warning button!`)
                    // RemoveWarningHtml()
                    window.location.reload();
                }

                //检查视频是否已播放完成
                if($("#divCompletedArea").css("display") != "none"){
                    console.log(`[checkVideo] press go back button!`)
                    // $("#divGoBack").click()

                    window.opener.location.reload()  //刷新父页面
                    //关闭当前页面
                    window.setTimeout(function(){
                        closeWindow()
                    }, 1000)
                }
            }, 10000)

            break
        }
        case "userExam":{
            //考试页

            //清空所有已选择的多选题
            $("ul.ques-list>li :checkbox").each(function(){
                if($(this).parent().hasClass("active")){
                    $(this).click()
                }
            })

            //是否第一次进入考试，是则跳到else子句，不修改题目显示
            if(GM_getValue("examResult") != undefined){
                examResultObj = GM_getValue("examResult")

                // console.log("油猴-考试结果变量", examResultObj)
                //在每题的旁边设置答案和解释
                $("ul.ques-list>li").each(function(){
                    let o = {}  //本题结果临时对象
                    let _qType = $(this).attr("qt")  //题目类型
                    let _titleDiv = $(this).find("div[class='col-18 font-size-16']")
                    let _vigntte = ""  //题目
                    //检查是否是判断题
                    switch(_qType){
                        case "Judge":{
                            //判断题
                            _vigntte = $.trim(_titleDiv.text())
                            break;
                        }
                        case "SingleChoice":
                        case "MultiChoice":{
                            _vigntte = $.trim(_titleDiv.find("div").text())
                            break;
                        }
                    }
                    _vigntte = _vigntte.replace(/（[\s\S]*?）|\([\s\S]*?\)/g, "")  //删除括号及内部文字

                    //题目对象与题目匹配
                    for(let i=0; i<examResultObj.length; i++){
                        o = examResultObj[i];
                        if(_vigntte == o.vigntte){
                            break
                        }
                    }

                    //在题目下方生成提示信息
                    let _html = `<div style="margin:20px 0 0 30px; line-height:24px;">本题答案：${o.answerTxt}</div>\n`
                    _html += `<div style="margin:10px 0 0 30px; line-height:24px;">本题考点：${o.point}</div>\n`
                    _html += `<div style="margin:10px 0 0 30px; line-height:24px;">本题解析：${o.analysis}</div>\n`
                    $(this).append(_html)

                    //如果设置了自动考试
                    if(config.autoExam){                        
                        $(this).find("label.btn-check").each(function(){
                            let _thisOption = $.trim($(this).text())
                            // console.log("油猴-网页题目：", _vigntte)
                            // console.log("油猴-答案题目：", o.vigntte)
                            
                            if(_qType == "Judge"){
                                //判断题
                                if(o.answerTxt.search(_thisOption) > -1){
                                    $(this).find(":radio").click()
                                }
                            }
                            
                            if(o.answerArr.indexOf(_thisOption) > -1){
                                //单选题
                                $(this).find(":radio").click()
                                //多选题
                                $(this).find(":checkbox").click()
                            }
                        })

                    }
                })

                //全部选中后，点击提交
                if(config.autoPressBtn){
                    //提交答案
                    window.setTimeout(function(){
                        $("#spn_submitText").click();
                    }, 2000)
                    //点击确认提交按钮
                    window.setTimeout(function(){
                        $("#btnMyConfirm").click()
                    }, 3000)
                }
            } else {
                //首次进入考试页面，自动选择每题第一个选项并提交
                if(config.autoExam){
                    $("ul.ques-list>li").each(function(){
                        //每题选第一个选项
                        //单选题、判断题
                        $(this).find(":radio:first").click()
                        //多选题
                        $(this).find(":checkbox:first").click();

                    }) 
                    
                    if(config.autoPressBtn){
                        //提交答案
                        window.setTimeout(function(){
                            console.log("考试提交")
                            $("#spn_submitText").click();
                        }, 2000)
                        //点击确认提交按钮
                        window.setTimeout(function(){
                            console.log("考试提交确认")
                            $("#btnMyConfirm").click()
                        }, 3000)
                    }
                }
            }

            break;
        }
        case "examRetry":{
            //重新考试中间页
            //http://fscm.yunxuetang.cn/exam/exampreview.htm
            if(config.autoPressBtn) {
                $("input#btnTest").click();
            }
            break
        }
        case "examResult":{
            //考试结果页
            //检查分数-整理答案和解析-点击再次考试按钮-在考试页生成解析层

            //根据题型名称获取编号
            let __getQType = function(qtname){
                let _qTypeId = 0
                switch (qtname){
                    case "单选题":{
                        _qTypeId = qType.SingleChoice
                        break
                    }
                    case "多选题":{
                        _qTypeId = qType.MultiChoice
                        break
                    }
                    case "判断题":{
                        _qTypeId = qType.Judge
                        break
                    }
                    case "填空题":{
                        _qTypeId = qType.Completion
                        break
                    }
                    case "问答题":{
                        _qTypeId = qType.QA
                        break
                    }
                }
                return _qTypeId
            }
            
            let _correctCount = parseInt($("span#lblRightQty").text())
            let _totalCount = parseInt($("span#lblTotalQuestions").text())
            if(_correctCount < _totalCount){
                //没全对，整理答案和解析        

                //遍历每一个题块
                $("div.exam-subject-box").each(function(){
                    let _subjectNo = $.trim($(this).find("h3.exam-serial-number").text()); //题号
                    let _vigntte = $.trim($(this).find("div.exam-vignette-con").text()); //题目
                    _vigntte = _vigntte.replace(/（[\s\S]*?）|\([\s\S]*?\)/g, "")  //将题目中的括号及括号内容删掉
                    let _correct = $.trim($(this).find("h3.rightanswer").text());  //正确答案
                    _correct = $.trim(_correct.replace(/正确答案：/, ""))
                    let _pointList = $.trim($(this).find("ul.exam-point-list").text());  //考点
                    let _analysis = $.trim($(this).find("div.exam-analysis-d").text());  //解析
                    let _option = $(this).find("[class='mt5 clearfix pl30']");
                    let _answerTxt = '' //正解答案的选项
                    let _correctArr = []
                    let _questTypeName = $(this).prevAll("h4:first").text()  //题型名称
                    _questTypeName = _questTypeName.match(/、([\s\S]*)/)[1]
                    let _qType = 0  //题型编号
                    _qType = __getQType(_questTypeName)  //将题型中文名称转换为id值
                    let _answerTxtArr = []  //答案选项的

                    if(_correct.search("、")>-1){
                        //如果正确答案中有顿号，表示是多选题，将对答案内容进行拆分检查
                        _correctArr = _correct.split("、")

                    } else {
                        _correctArr[0] = _correct
                    }
                    //根据选项内容整理完整的编号+选项文字
                    _option.each(function(){
                        let _answer2 = $.trim($(this).find("h3").text())  //题目选项中的编号

                        //根据正确答案选项编号数组对比
                        for(let i=0; i<_correctArr.length; i++){
                            let _thisId = _correctArr[i];
                            if(_answer2.search(_thisId) > -1){
                                let _answerFullTxt = _answer2 + $.trim($(this).find("div").text())
                                _answerTxt +=  _answerFullTxt+ '；'
                                _answerTxtArr.push(_answerFullTxt)
                            }
                        }
                        
                    })
                    let o = {
                        qType: _qType,
                        qTypeName: _questTypeName,
                        id: parseInt(_subjectNo),
                        vigntte: _vigntte,
                        answer: _correct,
                        answerArr: _correctArr,
                        answerTxtArr: _answerTxtArr,
                        answerTxt: _answerTxt,
                        point: _pointList,
                        analysis: _analysis
                    }
                    examResultObj.push(o);

                })

                //将对象保存到localstorage-------------------------------------------------------------
                // var _jsonTxt = JSON.stringify(examResultObj);
                // window.localStorage.removeItem('yh_examResult');
                // window.localStorage.setItem('yh_examResult', _jsonTxt);

                GM_setValue("examResult", examResultObj)

                //点击再次考试按钮
                if(config.autoPressBtn){ $("input#btnGoOnExam").click()}
                // console.log("油猴-考试对象", GM_getValue("examResult"))
            } else {
                //自动关闭页面
                if(config.autoPressBtn){ window.setTimeout(closeWindow, 1000)}
            }
            break
        }
    }

})
