// ==UserScript==
// @name         hywjxyyjy
// @version      0.0.1
// @description  storehouse
// @author       Xiguayaodade
// @license      MIT
// @match        *://sdnew.91huayi.com/*
// @grant        GM_info
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @namespace    http://tampermonkey.net/
// @homepage     http://8.130.116.135/?article/
// @source       http://8.130.116.135/?article/
// @icon         https://picx.zhimg.com/v2-ce62b58ab2c7dc67d6cabc3508db5795_l.jpg?source=32738c0c
// @connect      icodef.com
// @connect      localhost
// @connect      8.130.116.135
// @connect      aip.baidubce.com
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */

    unsafeWindow.GM_getValue = GM_getValue

    var ddds3 = null;
    var addMessage = null;

    /**
     *播放器
     *@type {dom}
     */
    var elevideo;
    /**
     *var courseId = GM_getValue("courseId");
     *@type {int}
     */
    var courseId = 1;
    /**
     *courseCount
     *@type {int}
     */
    var courseCount = null;
    /**
     *courseIndex
     *@type {int}
     */
    var courseIndex = null;
    /**
     *capterCount
     *@type {int}
     */
    var capterCount = null;

    var stInter = null;

    let btn1=GM_registerMenuCommand ("\u4f5c\u8005\uff1a\ud83c\udf49\u897f\u74dc\u8981\u5927\u7684\ud83c\udf49", function(){
        confirm("Hello,\u611f\u8c22\u4f7f\u7528\ud83c\udf49\u897f\u74dc\u5237\u8bfe\u52a9\u624b\ud83c\udf49\uff01\u591a\u591a\u53cd\u9988\u54e6");
        GM_unregisterMenuCommand(btn1);
    }, "");
    let btn2=GM_registerMenuCommand ("\u4ed8\u8d39\u5185\u5bb9", function(){
        alert("\u9650\u65f6\u514d\u8d39\uff0c\u5168\u529b\u5f00\u53d1\u4e2d...");
    }, "p");

    var bootstrapCSS = document.createElement("link");
    bootstrapCSS.rel = "stylesheet";
    bootstrapCSS.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-alpha1/dist/css/bootstrap.min.css";
    document.head.appendChild(bootstrapCSS);

    var bootstrapJS = document.createElement("script");
    bootstrapJS.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-alpha1/dist/js/bootstrap.min.js";
    document.body.appendChild(bootstrapJS);

    //----解决重复监听start----
    //视频开始的公共方法
    var vdplay = null;
    //视频正在播放的公共方法
    var vdplaying = null;
    //视频暂停的公共方法
    var vdpause = null;
    //视频结束的公共方法
    var vdended = null;
    //监听音量的公共方法
    var vdvolume = null;
    //----解决重复监听end----


    var radioIndex = 0;
    var checkboxIndex = 0;
    var radioCount = 0;
    var checkboxCount = 0;
    var examAllCount = 0;
    var trueAnswrItem;

    //------等待网页加载完成start-----
    var wait = setInterval(function (){
        ddds3.children().remove();
        addMessage("注意：脚本自动答题期间请勿操作");
        let nowHost = window.location.host;
        if(nowHost === 'sdnew.91huayi.com'){
            try {
                addMessage("考试页...");
                trueAnswrItem = document.querySelector("#examNav > dl > dd").children;
                examAllCount = trueAnswrItem.length;
                let wahtDo = true;
                if(wahtDo){
                    addMessage("开始考试...");
                    // examAnswerNew();
                    $("#exampage").delegate(':radio', 'click', function () {
                        console.log("=======开始=======");
                        console.log("$(this)",$(this));
                        console.log("$(this).parents('dd')",$(this).parents('dd'));
                        console.log("$(this).parents('dd').attr('id')",$(this).parents('dd').attr('id'));
                        var qid = $(this).parents('dd').attr('id');
                        console.log("qid",qid);
                        console.log("=======qid=======");
                        $("[liqid='" + qid + "']").addClass("right_part02_blue");
                        $(this).parent('span').removeClass("span02").addClass("span01");
                        $(this).parent('span').siblings(".span01").removeClass("span01").addClass("span02");
                        console.log("$(this).val()",$(this).val());
                        var root = $(this).val();
                        console.log("=======$(this).val()=======");
                        $(this).parents('dd').attr('title', root);
                        var answer = "";
                        if (root != null) {
                            answer = root;
                            console.log("answer",answer);
                            console.log("=======结束=======");
                        }
                        console.log("qid.substring(1, qid.length)", qid.substring(1, qid.length));
                        SetAnswer(answer, qid.substring(1, qid.length));
                        // SetCompleteCount();
                    });
                    GetPaperQuestions();
                    setTimeout(function(){
                        if(autoExam()){
                            $("#reExam").text("自动收集已开启");
                            examAnswerNew();
                        }
                        else{
                            $("#reExam").text("自动收集已关闭");
                        }
                    },500);
                }
                else if(document.getElementsByClassName("ant-alert-message")[0] === undefined){
                    addMessage("请单击重新考试按钮...");
                    // examAnswerRe();
                    // examAnswerNew();
                }
                else{
                    addMessage("请单击搜集，将自动抓取正确答案");
                    // examRadio();
                }
                clearInterval(wait);
            }catch(e){
                addMessage("发现异常："+e+"|程序已终止运行...");
                clearInterval(wait);
                return;
            }
        }
        else{
            addMessage("请前往考试页");
        }
    }, 1000);

    function autoExam(){
        let oldData = GM_getValue('autoExam');

        if(oldData === undefined || oldData === '' || oldData === null){
            GM_setValue('autoExam',true);
            return GM_getValue('autoExam');
        }

        return GM_getValue('autoExam');
    }
    //------等待网页加载完成end-----

    //提交
    function SubPaper(pid,qid,opAnswer) {
        // $.cookie("switchTime" + $("#exam_id").val() + "_" + $("#user_id").val(), '', { expires: -1 });
        $("#subPaper").attr("disabled", "disabled");
        clearTimeout(timer);
        var signData = {};
        signData["user_id"] = $("#user_id").val();
        signData["examId"] = $("#exam_id").val();
        signData["paperId"] = $("#paper_id").val();
        signData["examLogId"] = $("#examLogId").val();
        signData["answerTime"] = answer_duration;
        signData["totalTime"] = totalTime;
        signData["timestamp"] = Date.parse(new Date(Common.GetSystemDateTime())) / 1000;
        console.log("==========sub==================")
        console.log("signData",signData);
        var sign = Common.Signature(signData);
        console.log("sign",sign);
        console.log("==========ajax==================")
        console.log("userAnswer",userAnswer);
        $.ajax({
            url: "/ExamInterface/SaveExamData",
            type: "POST",
            headers: {
                "sign": sign
            },
            timeout: 1000 * 30,
            data: {
                userAnswer: JSON.stringify(userAnswer),
                paperContent: "",
                userId: $("#user_id").val(),
                examId: $("#exam_id").val(),
                index: $("#paper_index").val(),
                paperId: $("#paper_id").val(),
                answerDuration: answer_duration,
                genre: 'pc',
                totalTimes: totalTime,
                timestamp:signData["timestamp"],
                wrongQuestionState: $("#wrongQuestion_state").val(),
                examLogId: $("#examLogId").val(),
                t: new Date().getTime()
            },
            dataType: "json",
            success: function (json) {
                if (json.status === 0) {
                    console.log("错误", "提交失败！");

                } else if (json.status === 3) {

                    console.log("错误", "考试次数已达到限制，不可再进行考试！");
                }
                else if (json.status === 4) {
                    console.log("提示", "本场考试开始" + json.answer_time_less + "分钟内不允许交卷，请知悉！");

                }
                else if (json.status === 5) {
                    console.log("错误");
                }
                else if (json.status === 6 || json.status === 7) {
                    var tipsMsg = json.status == 6 ? "提交数据异常，答题结果已保存，请等待管理员审核，错误码：" + json.errorCode : "没有查询到人脸识别记录，请重新作答！";
                    console.log("/ExamInterface/ComputerExamError?msg=" + tipsMsg);
                }
                else if (json.status === 1) {
                    // $.cookie('switchTime' + $("#exam_id").val(), null);
                    var total = json.totalQuestion;
                    //答对题数(总题数-错题数)
                    var dd = total - json.wrongQuestion;
                    console.log("得到",dd,"分");
                    if(dd >= 80){
                        addMessage('提交成功：'+dd+"分。")
                        return;
                    }
                    if(dd == 1 && opAnswer != ''){
                        saveErrorAnswers(pid,qid,opAnswer,'');
                    }else if(dd == 0 && opAnswer != ''){
                        saveErrorAnswers(pid,qid,'',opAnswer);
                    }
                    var resultUrl = $("#result_url").val();
                    if (resultUrl != null && resultUrl !== "" && resultUrl !== undefined) {
                        var param = "score=" + json.Score + "&correctNum=" + dd + "&mistakeNum=" + json.wrongQuestion + "&user_id=" + $("#user_id").val() + "&exam_result_id=" + json.exam_result;
                        console.log(resultUrl.indexOf('?') > 0 ? resultUrl + "&" + param : resultUrl + "?" + param);
                    } else {
                        console.log("/ExamInterface/ComputerExamResult?examResultId=" + json.exam_result + "&user_id=" + $("#user_id").val() + "&backUrl=" + $("#back_url").val() + "&analysis=" + $("#analysis_state").val());
                    }
                } else {
                    console.log("错误", "提交失败！");

                }
            },
            complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                if (status === 'timeout') {
                    console.log("提示", "提交超时，请重试！");
                }
            }
        });
    };

    //设置提交答案
    function SetAnswer(answer, qid) {
        for (var i = 0; i < userAnswer.length; i++) {
            if (userAnswer[i].question_id == qid) {
                userAnswer[i].answer = $.trim(answer);
                break;
            }
        }
        console.log("userAnswer",userAnswer);
    }

    //获取整卷考题
    function GetPaperQuestions(){
        $.ajax({
            type: "POST",
            url: "/ExamPage/GetPaperQuestions",
            data: {
                paperID: $("#paper_id").val(),
                userId: $("#user_id").val(),
                examId: $("#exam_id").val(),
                breakPoint: true,
                t: new Date().getTime()
            },
            async: false,
            dataType: "JSON",
            success: function (json) {
                if (json.status == 1) {
                    if(savePaperQuestions($("#paper_id").val(),json.data[0].Question)){
                        console.log("试卷保存成功")
                    }
                    if(saveUserAnswer($("#paper_id").val(),userAnswer)){
                        console.log("答题模板本地保存成功")
                    }
                } else {
                    console.log("错误", "加载失败！");
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("错误", "加载失败！");
            }
        });
    }

    //保存整卷考题
    function savePaperQuestions(paperID,paperQuestions){
        let gmPaperQuestions = getGMPaperQuestions();
        let juge = gmPaperQuestions.some(obj => obj.hasOwnProperty(paperID));

        if (juge) {
            addMessage("该试卷已存在...");
            console.log("该试卷已存在");
            console.log("本地试卷",GM_getValue('paperQuestions'));
            return false;
        }

        let tempMap = {};
        tempMap[paperID] = paperQuestions;

        gmPaperQuestions.push(tempMap);

        console.log("整卷考题:",gmPaperQuestions);

        GM_setValue('paperQuestions',gmPaperQuestions);

        return true;
    }

    //更新整卷考题答案
    function upPaperQuestions(paperID,question_id,answer){
        let gmPaperQuestions = getGMPaperQuestions();
        // 找到键为'paperID'的对象
        let obj = gmPaperQuestions.find(item => paperID in item);
        // 找到qid为'question_id'的对象
        let qidObj = obj[paperID].find(item => item.question_id === question_id);
        // 更新answer为answer
        if (qidObj) {
            qidObj.answer = answer;
        }
        GM_setValue('paperQuestions',gmPaperQuestions);
    }

    //获取本地整卷考题
    function getGMPaperQuestions(){
        let oldData = GM_getValue('paperQuestions');
        if (Array.isArray(oldData)) {
            return oldData;
        }
        return [];
    }

    //保存答题模板至本地
    function saveUserAnswer(paperID,userAnswer){
        let gmUserAnswer = getGMUserAnswer();
        let juge = gmUserAnswer.some(obj => obj.hasOwnProperty(paperID));

        if (juge) {
            addMessage("本地答题模板已存在...");
            console.log("本地答题模板已存在");
            console.log("本地答题模板",GM_getValue('userAnswer'));
            return false;
        }

        let tempMap = {};
        tempMap[paperID] = userAnswer;

        gmUserAnswer.push(tempMap);

        console.log("本地答题模板:",gmUserAnswer);

        GM_setValue('userAnswer',gmUserAnswer);

        return true;
    }

    //获取本地答题模板
    function getGMUserAnswer(){
        let oldData = GM_getValue('userAnswer');
        if (Array.isArray(oldData)) {
            return oldData;
        }
        return [];
    }

    //获取本地错题集
    function getGMErrorAnswers(){
        let oldData = GM_getValue('errorAnswers');
        if (Array.isArray(oldData)) {
            return oldData;
        }
        return [];
    }

    //更新本地错题集
    function saveErrorAnswers(pid,qid,rightAnswer = '',errorAnswer = ''){
        let gmErrorAnswers = getGMErrorAnswers();
        let juge = gmErrorAnswers.some(obj => obj.hasOwnProperty(qid));

        let tempMap = {};
        if (juge) {
            addMessage("找到错题记录...");
            console.log("找到错题记录...");
            if(rightAnswer != ''){
                console.log("保存正确答案到本地试卷...");
            }
            else{
                console.log("更新错题集...");
                gmErrorAnswers.reduce((accumulator, obj) => {
                    if (qid in obj) {
                        obj[qid].push(errorAnswer);
                    }
                    return accumulator;
                }, undefined);
                console.log("gmErrorAnswers",gmErrorAnswers);
            }
        }else{
            console.log("没有错题记录...");
            if(rightAnswer != ''){
                console.log("保存正确答案到本地试卷...");
                upPaperQuestions(pid,qid,rightAnswer)
                console.log(pid,qid);
                console.log("getGMPaperQuestions",getGMPaperQuestions());
                setTimeout(function(){
                    window.location.reload();
                    // examAnswerNew();
                },250);
            }
            else{
                console.log("记录新的错题集并清除本地考卷内错误答案...");
                let tempMap = {};
                tempMap[qid] = [errorAnswer];
                gmErrorAnswers.push(tempMap);
                console.log("gmErrorAnswers",gmErrorAnswers);

                console.log(pid,qid);
                delGMErrorAnswer(pid,qid,errorAnswer);
                setTimeout(function(){
                    window.location.reload();
                    // examAnswerNew();
                },250);
            }
        }
    }

    //清除本地考卷错误答案
    function delGMErrorAnswer(pid,qid,errorAnswer){
        let gMPaperQuestions = getGMPaperQuestions();
        console.log("gMPaperQuestions",gMPaperQuestions)
        // 找到键为'pid'的对象
        let obj = gMPaperQuestions.find(item => pid in item);

        // 找到qid为'qid'的对象
        let qidObj = obj[pid].find(item => item.question_id === qid);

        console.log("qidObj",qidObj)

        // 更新answer为'A'
        if (qidObj) {
            qidObj.Options.shift();
        }
        console.log("删除结果",gMPaperQuestions);
        GM_setValue('paperQuestions',gMPaperQuestions)
    }

    //根据错题集得到试探选项
    function getOptionByErrorAnswer(pid,qid){
        let gMPaperQuestions = getGMPaperQuestions();
        let Options = gMPaperQuestions.reduce((accumulator, obj) => {
            if (pid in obj) {
                return obj[pid].find(obj => obj.question_id === qid).Options;
            }
            return accumulator;
        }, undefined);
        console.log('Options',Options);
        return Options[0].question_options_id;
    }

    function goTest(){
        let nowUrl = window.location.href;
        if(nowUrl.substring(0,30) === 'http://www.lnlpa.cn/OnlineTest'){
            try {
                ddds3.children().remove();
                addMessage("开始考试...");
                if(document.querySelector(".radioList") != null){
                    radioCount = document.querySelector(".questionList").children[0].children[1].childElementCount;
                }
                if(document.querySelector(".checkboxList") != null){
                    checkboxCount = document.querySelector(".questionList").children[1].children[1].childElementCount;
                }
                examRadio();
            }catch(e){
                addMessage("发现异常："+e+"|程序已终止运行...");
                clearInterval(wait);
                return;
            }
        }
        else{
            ddds3.children().remove();
            addMessage("请进入考试页再使用此功能...");
        }
    }

    function wkAnswer(wkType,answor){
        if(wkType === '单选题：'){
            console.log("单选\u7b2c"+(radioIndex+1)+"\u9898");
            addMessage("单选\u7b2c"+(radioIndex+1)+"\u9898");
            let answerPrint;
            try{
                answerPrint = answor.match(/[A-E]/g)[0];
            }
            catch(e){
                addMessage("请查看参考答案："+answor);
            }
            console.log("answerPrint",answerPrint);
            addMessage(answerPrint);
            switch(answerPrint)
            {
                case 'A':
                    document.querySelector(".questionList").children[0].children[1].children[radioIndex].children[1].children[0].click();
                    break;
                case 'B':
                    document.querySelector(".questionList").children[0].children[1].children[radioIndex].children[1].children[1].click();
                    break;
                case 'C':
                    document.querySelector(".questionList").children[0].children[1].children[radioIndex].children[1].children[2].click();
                    break;
                case 'D':
                    document.querySelector(".questionList").children[0].children[1].children[radioIndex].children[1].children[3].click();
                    break;
                case 'E':
                    document.querySelector(".questionList").children[0].children[1].children[radioIndex].children[1].children[4].click();
                    break;
            }
            radioIndex++;
        }
        if(wkType === '多选题：'){
            console.log("多选\u7b2c"+(checkboxIndex+1)+"\u9898");
            addMessage("多选\u7b2c"+(checkboxIndex+1)+"\u9898");
            let answerPrint;
            let duoxuan = /\[(.*?)\]/.exec(answor)[1];
            if(duoxuan === null){
                let str1 = answor.split('。')[0];
                answerPrint = str1.match(/[A-E]/g);
            }
            else{
                answerPrint = duoxuan.split('');
            }
            console.log("---------------------",answerPrint);
            addMessage(answerPrint);
            answerPrint.forEach((answer, index) => {
                setTimeout(() => {
                    let clickTarget;
                    switch(answer) {
                        case 'A':
                            console.log("---------------------"+checkboxIndex);
                            clickTarget = document.querySelector(".questionList").children[1].children[1].children[checkboxIndex].children[1].children[0];
                            break;
                        case 'B':
                            console.log("---------------------"+checkboxIndex);
                            clickTarget = document.querySelector(".questionList").children[1].children[1].children[checkboxIndex].children[1].children[1];
                            break;
                        case 'C':
                            console.log("---------------------"+checkboxIndex);
                            clickTarget = document.querySelector(".questionList").children[1].children[1].children[checkboxIndex].children[1].children[2];
                            break;
                        case 'D':
                            console.log("---------------------"+checkboxIndex);
                            clickTarget = document.querySelector(".questionList").children[1].children[1].children[checkboxIndex].children[1].children[3];
                            break;
                        case 'E':
                            console.log("---------------------"+checkboxIndex);
                            clickTarget = document.querySelector(".questionList").children[1].children[1].children[checkboxIndex].children[1].children[4];
                            break;
                        case 'F':
                            clickTarget = document.querySelector(".questionList").children[1].children[1].children[checkboxIndex].children[1].children[5];
                            break;
                        case 'G':
                            clickTarget = document.querySelector(".questionList").children[1].children[1].children[checkboxIndex].children[1].children[6];
                            break;
                        case 'H':
                            clickTarget = document.querySelector(".questionList").children[1].children[1].children[checkboxIndex].children[1].children[7];
                            break;
                        case 'I':
                            clickTarget = document.querySelector(".questionList").children[1].children[1].children[checkboxIndex].children[1].children[8];
                            break;
                        default:
                            console.log("当前多选题选择过多，系统需更新！");
                            addMessage("当前多选题选择过多，系统需更新！");
                            return;
                    }
                    if (clickTarget) {
                        clickTarget.click();
                        console.log("点击" + answer);
                    }
                }, index * 50); // 将每次点击的延迟设置为 500ms * 索引
            });
            setTimeout(function(){
                checkboxIndex++;
            },3000);
        }
        setTimeout(function(){
            examRadio();
        },3500);
    }

    var examRadioText = '单选题：';
    var examCheckboxText = '多选题：';

    function juTorF(rIndex){
        let a = trueAnswrItem[rIndex-1].className;
        if(a === 'right_part02_blue'){
            return false;
        }else{
            return true;
        }
    }

    function getAnswer(){
        let oldData = GM_getValue('answerList');
        if (Array.isArray(oldData)) {
            return oldData;
        }
        return [];
    }

    function saveAnswer(answer_key,answer){
        let answerList = getAnswer();
        let juge = answerList.some(obj => obj.hasOwnProperty(answer_key));

        if (juge) {
            addMessage("该答案已存在...");
            console.log("该答案已存在");
            return false;
        }

        let tempMap = {};
        tempMap[answer_key] = answer;

        answerList.push(tempMap);

        // console.log(answerList);

        GM_setValue('answerList',answerList);

        return true;
    }

    function examRadio(){
        if(radioIndex < examAllCount){
            let answer_key = trueAnswrItem[radioIndex].getAttribute('ques_key');
            if(juTorF(radioIndex)){
                let answerStr = trueAnswrItem[radioIndex].getElementsByClassName("true-answer")[0].innerText;
                let regex = /[A-Za-z]+/g;
                let answer = answerStr.match(regex)[0];
                console.log("第",(radioIndex+1),"题答案：",answer,"开始保存");
                if(saveAnswer(answer_key,answer)){
                    console.log("错题保存成功...");
                }else{
                    console.log("错题保存失败...");
                }
                radioIndex++;
                examRadio();
            }else{
                let trueAe = optionTrue(radioIndex);
                console.log("第",(radioIndex+1),"正确答案:",trueAe);
                if(saveAnswer(answer_key,trueAe)){
                    console.log("正确答案记录成功...");
                }else{
                    console.log("正确答案记录失败...");
                }
                radioIndex++;
                examRadio();
            }
        }else{
            console.log("搜集完毕，开始纠错");
            addMessage("搜集完毕，可以开始重新考试");
            toggleOverlay(false);
            // let as = getAnswer();
            // console.log(as);
            radioIndex = 0;
            setTimeout(function(){
                console.log('-------');
                // examAnswer();
            },1500);
        }
    }

    function goExam(){
        let as1 = getGMPaperQuestions();
        radioIndex = parseInt(document.querySelector("#exampage > dl > dd.dd_01 > span").innerText);
        if(radioIndex <= examAllCount){
            let paperID = $("#paper_id").val();
            let questionid = document.querySelector("#exampage").children[0].children[1].getAttribute('questionid');

            addMessage("questionid"+questionid);
            let result = as1.reduce((accumulator, obj) => {
                if (paperID in obj) {
                    return obj[paperID].find(obj => obj.question_id === questionid).answer;
                }
                return accumulator;
            }, undefined);


            if (result !== undefined && result !== '') {

                addMessage('right',result);
                if(document.querySelector("#btnNext").style[0] === 'display'){
                    addMessage('作答完毕，提交');
                    SubPaper('','','')
                    toggleOverlay(false);
                    return;
                }
                SetAnswer(result, questionid);
                setTimeout(function(){
                    document.querySelector("#btnNext").click();
                    setTimeout(function(){
                        goExam();
                    },100);
                },10);

                // inputRadio(0,result.length,result);

            }
        }
    }

    function examAnswerNew(){
        let as1 = getGMPaperQuestions();
        radioIndex = parseInt(document.querySelector("#exampage > dl > dd.dd_01 > span").innerText);
        if(radioIndex <= examAllCount){
            let paperID = $("#paper_id").val();
            let questionid = document.querySelector("#exampage").children[0].children[1].getAttribute('questionid');

            addMessage("questionid"+questionid);
            let result = as1.reduce((accumulator, obj) => {
                if (paperID in obj) {
                    return obj[paperID].find(obj => obj.question_id === questionid).answer;
                }
                return accumulator;
            }, undefined);


            if (result !== undefined && result !== '') {

                addMessage('right',result);
                console.log('找到答案',result);
                if(document.querySelector("#btnNext").style[0] === 'display'){
                    addMessage('此试卷已经收录所有答案，请关闭自动收集后刷新页面点击“开始考试”');
                    return;
                }
//                 SetAnswer(result, questionid);
                setTimeout(function(){
                    document.querySelector("#btnNext").click();
                    setTimeout(function(){
                        examAnswerNew();
                    },100);
                },10);
                // toggleOverlay(false);
                // inputRadio(0,result.length,result);

            } else {
                console.log('未找到答案');
                //拿到无答案提交模板
                // let subAnswer = getGMUserAnswer().reduce((accumulator, obj) => {
                //     if (paperID in obj) {
                //         return obj[paperID];
                //     }
                //     return accumulator;
                // }, undefined);
                // console.log('拿到无答案提交模板',subAnswer);

                //获取当前题目的试探选项
                let options_id = getOptionByErrorAnswer(paperID,questionid);




                //设置要提交的答案
                SetAnswer(options_id, questionid)

                SubPaper(paperID,questionid,options_id);







//                 let rand = Math.floor(Math.random() * 5 + 1);
//                 document.querySelector("#exampage").children[0].getElementsByClassName('dd_03 q-content')[0].children[rand].children[0].click();

//                 setTimeout(function(){
//                     document.querySelector("#btnNext").click();
//                     setTimeout(function(){
//                         if(radioIndex == examAllCount){
//                             addMessage("考试完毕，提交");
//                             console.log('as1',as1);
//                             toggleOverlay(false);

//                             setTimeout(function(){},2000);
//                         }
//                         else{
//                             examAnswerNew();
//                         }
//                     },100);
//                 },100);
            }
        }
    }

    function inputRadio(index,count,result){
        if(index < count){
            switch(result[index])
            {
                case 'A':
                    console.log("第"+(radioIndex+1)+"题选","A");
                    radioOk(1)
                    break;
                case 'B':
                    console.log("第"+(radioIndex+1)+"题选","B");
                    radioOk(2)
                    break;
                case 'C':
                    console.log("第"+(radioIndex+1)+"题选","C");
                    radioOk(3)
                    break;
                case 'D':
                    console.log("第"+(radioIndex+1)+"题选","D");
                    radioOk(4)
                    break;
                case 'E':
                    console.log("第"+(radioIndex+1)+"题选","E");
                    radioOk(5)
                    break;
            }
            setTimeout(function(){
                inputRadio(index+1,count,result);
            },100);
        }
        else{
            addMessage("ok");
        }
    }

    function radioOk(index){
        if(!document.querySelector("#exampage").children[0].getElementsByClassName('dd_03 q-content')[0].children[2].children[0].checked){
            document.querySelector("#exampage").children[0].getElementsByClassName('dd_03 q-content')[0].children[2].children[0].click();
        }
    }

    function examAnswerRe(){
        if(radioIndex < examAllCount){
            let answer_key = trueAnswrItem[radioIndex].getAttribute('ques_key');

            console.log("radioIndex",radioIndex);

            if(!juTorF(radioIndex)){
                let trueAe = optionTrue(radioIndex);
                console.log("第",(radioIndex+1),"正确答案:",trueAe);
                if(saveAnswer(answer_key,trueAe)){
                    console.log("正确答案记录成功...");
                }else{
                    console.log("无需重复记录...");
                }
                radioIndex++;
                examAnswerRe();
            }else{
                console.log("第",(radioIndex+1),"题答案错误无需记录");
                trueAnswrItem[radioIndex].getElementsByClassName("ant-radio-group ant-radio-group-outline")[0].children[0].click();
                radioIndex++;
                examAnswerRe();
            }
        }else{
            console.log("单项搜集完毕...");
            let as1 = getAnswer();
            console.log(as1);
        }
    }

    function examAnswer(){
        let as1 = getAnswer();
        radioIndex = parseInt(document.querySelector("#exampage > dl > dd.dd_01 > span").innerText);
        if(radioIndex <= examAllCount){
            let answer_key = document.querySelector("#exampage").children[0].children[1].getAttribute('questionid');
            if(juTorF(radioIndex)){
                let result = as1.reduce((accumulator, obj) => {
                    if (answer_key in obj) {
                        return obj[answer_key];
                    }
                    return accumulator;
                }, undefined);

                console.log('result',result);

                if (result !== undefined) {

                    addMessage('result',result);
                    inputRadio(0,result.length,result);

                } else {
                    addMessage('未找到答案');
                    document.querySelector("#exampage").children[0].getElementsByClassName('dd_03 q-content')[0].children[3].children[0].click();

                    setTimeout(function(){
                        document.querySelector("#btnNext").click();
                        setTimeout(function(){
                            if(radioIndex == examAllCount){
                                addMessage("考试完毕，提交后如满分需刷新一次网页（以避免该平台BUG");
                                console.log('as1',as1);
                                toggleOverlay(false);

                                setTimeout(function(){},2000);
                            }
                            else{
                                examAnswerNew();
                            }
                        },100);
                    },200);
                }
            }else{
                console.log("第"+(radioIndex+1)+"题正确(save)");
            }
        }else{
            console.log("纠错完毕");
            ddds3.children().remove();
            addMessage("已完成纠错，请提交，提交后需刷新一次网页（以避免该平台BUG）");
            console.log('as1',as1);
            toggleOverlay(false);
        }
    }

    function optionTrue(radioIndex){
        var parentElement = trueAnswrItem[radioIndex].getElementsByClassName("ant-radio-group ant-radio-group-outline")[0];

        var childElement = trueAnswrItem[radioIndex].getElementsByClassName("ant-radio-group ant-radio-group-outline")[0].getElementsByClassName("ant-radio-wrapper ant-radio-wrapper-checked ant-radio-wrapper-in-form-item")[0];

        var children = Array.from(parentElement.children);

        var index = children.indexOf(childElement);
        switch(index)
            {
                case 0:
                    return 'A';
                case 1:
                    return 'B';
                case 2:
                    return 'C';
                case 3:
                    return 'D';
                case 4:
                    return 'E';
                case 5:
                    return 'F';
                default:
                    console.log("未知题型，需更新！");
                    return '未知';
            }

    }

    function examCheckbox(){
        if(checkboxIndex < checkboxCount){
            console.log("多选题开始作答");
            let qusetionStr = document.querySelector(".questionList").children[1].children[1].children[checkboxIndex].innerText;
            let newQusetionStr = qusetionStr.replace(/\n/g, '');
            console.log(checkboxIndex,examCheckboxText,newQusetionStr);
            wait1(examCheckboxText,newQusetionStr);
        }else{
            console.log("多选题作答完毕");
            checkboxIndex = 0;
            addMessage("作答完毕,请手动提交");
        }
    }

    var overlay = null;
    function toggleOverlay(show) {
        if (show) {
            overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '9999';

            overlay.addEventListener('click', function(event) {
                event.stopPropagation();
                event.preventDefault();
            });

            document.body.appendChild(overlay);
        } else {
            if (overlay) {
                overlay.parentNode.removeChild(overlay);
                overlay = null;
            }
        }
    }

    const panel = function(){
        var container = $('<div id="gm-interface"></div>');
        var titleBar = $('<div id="gm-title-bar">\ud83c\udf49\u897f\u74dc\u7f51\u8bfe\u52a9\u624b\ud83c\udf49</div>');
        var minimizeButton = $('<div title="\u6536\u8d77" style="display:black"><svg id="gm-minimize-button" class="bi bi-dash-square" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path fill-rule="evenodd" d="M3.5 8a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5z"/></svg></div>');
        var maxButton = $('<div title="\u5c55\u5f00" style="display:none"><svg id="gm-minimize-button" class="bi bi-plus-square" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/><path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/><path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/></svg></div>');
        var content = $('<div id="gm-content"></div>');
        var tips = $('<div class="tip" style="display:none;">\u957f\u6309\u62d6\u62fd</div>');
        var scrollText = $('<marquee>').text('\u4e7e\u5764\u672a\u5b9a\uff0c\u4f60\u6211\u7686\u662f\u9ed1\u9a6c----\u4f5c\u8005\uff1a\u897f\u74dc\u8981\u5927\u7684\uff08\u611f\u8c22\u652f\u6301\uff01\uff09').css({
            'position': 'absolute',
            'top': '15%',
            'left': '50%',
            'transform': 'translate(-50%, -50%)',
            'width': '90%',
            'height': '25px',
            'font-size': '16px',
            'line-height': '1.5',
            'white-space': 'nowrap'
        }).appendTo(content);
        //var ddds1 = $('<div style="position: absolute;top: 20%;width:90%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u70b9\u51fb\u542f\u52a8\uff1a<button id="startxg" style="position: absolute;width:48px;right: 10px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">\u542f\u52a8</button></div>');
        //var ddds5 = $('<div style="position: absolute;top: 35%;width:90%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u70b9\u51fb\u542f\u52a8\uff1a<button id="stopxg" style="position: absolute;width:48px;right: 10px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">暂停</button></div>');
        var ddds2 = $('<div style="position: absolute;top: 73%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">操作\uff1a<button id="goExam" style="position: absolute;width:80px;right: 248px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">开始考试</button><button id="reExam" style="position: absolute;width:150px;right: 98px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">自动收集已开启<button id="speedxgone" style="position: absolute;width:88px;right: 8px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">清空缓存</button></div>');
        ddds3 = $('<div id="message-container" style="position: absolute;display: ;align-content: center;justify-content: center;top: 20%;width:94%;height:52%;max-height:9999%;overflow-y:auto;padding: 3px;background: #ffffff;border-radius: 5px;"></div>');
        var ddds4 = $('<div style="position: absolute;top: 85%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;"><a href="http://8.130.116.135/?article/" style="position: absolute;right: 10px;text-decoration: none;color: pink;">\u003e\u003e\u003e\u8054\u7cfb\u003a\u0031\u0039\u0030\u0038\u0032\u0034\u0035\u0033\u0030\u0032\u0040\u0071\u0071\u002e\u0063\u006f\u006d</a></div>');

        container.append(titleBar);
        //content.append(ddds1);
        //content.append(ddds5);
        content.append(ddds2);
        content.append(ddds3);
        content.append(ddds4);
        container.append(content);
        container.append(maxButton);
        container.append(minimizeButton);
        $('body').append(container);
        $('body').append(tips);

        GM_addStyle(`
        #gm-interface {
            position: fixed;
            top: 50%;
            left: 50%;
            border-radius: 5px;
            background-color: white;
            z-index: 9999;
        }

        #gm-title-bar {
            padding: 5px;
            background-color: #ffc0c0;
            border: 1px solid black;
            border-radius: 5px;
            cursor: grab;
        }

        #gm-minimize-button {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 30px;
            height: 30px;
            border-radius: 5px;
            padding: 0;
            font-weight: bold;
            background-color: #ffc0c0;
            cursor: pointer;
        }

        #gm-content {
            padding: 10px;
            border: 1px solid black;
            border-radius: 2px 2px 5px 5px;
            background-color: #ffe5e5;
            width: 400px;
            height: 300px;
        }
        .tip{
            font-family: "黑体";
            color: black;
            -webkit-transform: scale(0.8);
            position:absolute;
            padding: 6px 5px;
            background-color:#ffe8f0;
            border-radius: 4px;
            z-index: 9999;
        }
    `);

        titleBar.on('mousemove',function(e){
            tips.attr("style", "display:black;");
            var top = e.pageY+5;
            var left = e.pageX+5;
            tips.css({
                'top' : top + 'px',
                'left': left+ 'px'
            });
        });

        titleBar.on('mouseout',function(){
            tips.hide();
        });

        titleBar.on('mousedown', function(e) {
            var startX = e.pageX - container.offset().left + window.scrollX;
            var startY = e.pageY - container.offset().top + window.scrollY;

            $(document).on('mousemove', function(e) {
                e.preventDefault();
                var newX = e.pageX - startX;
                var newY = e.pageY - startY;
                container.css({ left: newX, top: newY });
            });

            $(document).on('mouseup', function() {
                $(document).off('mousemove');
                $(document).off('mouseup');
            });
        });


        minimizeButton.on('click', function() {
            minimizeButton.attr("style", "display:none;");
            maxButton.attr("style", "display:black;");
            content.slideToggle(0);
            container.css({ width: 200 });
        });

        maxButton.on('click', function() {
            minimizeButton.attr("style", "display:black;");
            maxButton.attr("style", "display:none;");
            content.slideToggle(0);
            container.css({ width: 400 });
        });

        $("#goTest").on('click',function(){
            goTest();
        });

        $("#goExam").on('click',function(){
            toggleOverlay(true);
            ddds3.children().remove();
            addMessage("当前禁止点击，请不要关闭页面");
            addMessage("开始考试(10s~20s)，请耐心等待。。。");
            setTimeout(function(){
                radioIndex = 0;
                goExam();
            },800);
        });

        $("#reExam").on('click',function(){
            if(autoExam()){
                GM_setValue('autoExam',false);
                $("#reExam").text("自动收集已关闭");
            }else{
                GM_setValue('autoExam',true);
                $("#reExam").text("自动收集已开启");
            }
        });

        $("#goGetExam").on('click',function(){
            toggleOverlay(true);
            ddds3.children().remove();
            addMessage("当前禁止点击，请不要关闭页面");
            addMessage("开始搜集，请稍后。。。");
            setTimeout(function(){
                try{
                    radioIndex = 0;
                    examRadio();
                }catch(e){
                    ddds3.children().remove();
                    addMessage("违规操作，请刷新后重试");
                    console.log(e);
                    toggleOverlay(false);
                }
            },800);
        });

        $("#speedxgone").on('click',function(){
            GM_deleteValue("courseId");
            GM_deleteValue("answerList");
            GM_deleteValue("paperQuestions");
            ddds3.children().remove();
            addMessage("已清空缓存");
            addMessage("调用wait1()");
            console.log("调用wait1()");
            wait1();
        });

        $("#switchButton").on('click',function(){
            // if (speedonoff) {
            //     speedonoff = false;
            //     addMessage("\u500d\u901f\uff1a\u5173\u95ed");
            //     $("#switchButton").text("当前：关闭");
            // } else {
            //     speedonoff = true;
            //     addMessage("\u500d\u901f\uff1a\u5f00\u542f");
            //     $("#switchButton").text("当前：开启");
            // }
        });

        // 监听鼠标滚轮事件，实现消息框滚动
        ddds3.on('mousewheel', function(event) {
            event.preventDefault();
            var scrollTop = ddds3.scrollTop();
            ddds3.scrollTop(scrollTop + event.originalEvent.deltaY);
        });

        // 添加新消息
        addMessage = function(message){
            // 检查消息数量，移除最早的一条消息
            // if (ddds3.children().length >= 288) {
            //     ddds3.children().first().remove();
            // }
            // 创建消息元素并添加到消息框容器
            var messageElement = $('<div class="message"></div>').text(message).css({
                'margin-bottom': '10px'
            }).appendTo(ddds3);
        }

    }
    panel();
    addMessage("\u002d\u002d\u002d\u002d\u6b63\u5728\u542f\u52a8\uff0c\u8bf7\u7a0d\u540e\u002e\u002e\u002e\u002d\u002d\u002d\u002d");
    })();