// ==UserScript==
// @name         乐教小助手
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       caixiang
// @match       https://www.zybang.com/question/rcswebview/*
// @require     https://code.jquery.com/jquery-3.3.1.min.js
// @require     https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require     https://unpkg.com/ali-oss@6.1.0/dist/aliyun-oss-sdk.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.4/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/383957/%E4%B9%90%E6%95%99%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/383957/%E4%B9%90%E6%95%99%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let token = "eyJ0eXBlIjoiSldUIiwiYWxnIjoiSFM1MTIifQ.eyJpc3MiOiJYdWVIdWlMZSBKV1QgQnVpbGRlciIsInVzZXIiOiJ7XCJ1c2VySWRcIjpcIjM4MDUzMzY0NjU3NjE5MzUzNlwiLFwidXNlckNvZGVcIjpcInh5dGUwMDdcIixcIm5pY2tOYW1lXCI6XCJcIixcInJlYWxOYW1lXCI6XCLmn4_ojLlcIixcImhlYWRVcmxcIjpcImh0dHA6Ly9vc3MuZXp1b3llLmNvbS8xMjM0NTY3ODlfNDc3MTg1OTg5ODM2NjczMDI0LmpwZWdcIixcInNpZ25cIjpcIuiOq-WQjeWFtuWmmVwiLFwicGhvbmVOdW1cIjpcIlwiLFwiZW1haWxcIjpcIjI3NTEyMTk1NzBAcXEuY29tXCIsXCJwYXNzd29yZFwiOm51bGwsXCJzYWx0XCI6bnVsbCxcInVzZXJTdHlsZVwiOlwiNFwiLFwiYXZhaWxhYmxlXCI6XCIxXCIsXCJsb2NrZWRcIjpcIjBcIixcImFjdGl2ZVwiOlwiMVwiLFwiY29uZmlybVBhc3N3b3JkXCI6bnVsbCxcInZhbGlkYXRlQ29kZVwiOm51bGwsXCJzY2hvb2xJZFwiOlwiMjQ4NjMxODU3Mjk2NTc2NTExXCIsXCJvcGVuSWRcIjpudWxsLFwidXNlclN0eWxlTmFtZVwiOm51bGwsXCJyb2xlSWRcIjpcIjY2MzU2NjA2OTMzMjc0NjI0XCIsXCJsb2dpbkZpcnN0XCI6ZmFsc2UsXCJjaGlsZHNcIjpudWxsLFwiYWNjZXNzVG9rZW5cIjpudWxsLFwicmVnaXN0ZXJUaW1lXCI6MTUyMDI0MDgxMzAwMCxcInVwZGF0ZVRpbWVcIjpudWxsLFwiYnVzaW5lc3NQYXR0ZXJuXCI6XCIxXCIsXCJzZXJ2ZXJDb2RlXCI6XCIxMjM0NTY3ODlcIixcImdyYWRlSWRcIjpudWxsLFwic2V4XCI6XCJGXCIsXCJvcHRpb25hbEZ1bmNcIjpcImFsbGJhc2ljLGdvb2RRdWVzdGlvblwiLFwicm9sZXNcIjpbe1wicm9sZUlkXCI6XCI2NjM1NjYwNjkzMzI3NDYyNFwiLFwicm9sZU5hbWVcIjpcIuWtpuagoeS7u-ivvuaVmeW4iFwiLFwiYXZhaWxhYmxlXCI6XCIxXCIsXCJyb2xlRGVzY1wiOm51bGwsXCJyb2xlX3R5cGVcIjpcIjVcIixcInJhbmdlX2NvZGVcIjowfSx7XCJyb2xlSWRcIjpcIjI2MjM1NjY5MDcwNjUwMTYzMlwiLFwicm9sZU5hbWVcIjpcIuePreS4u-S7u1wiLFwiYXZhaWxhYmxlXCI6XCIxXCIsXCJyb2xlRGVzY1wiOm51bGwsXCJyb2xlX3R5cGVcIjpcIjMxXCIsXCJyYW5nZV9jb2RlXCI6MH0se1wicm9sZUlkXCI6XCI0MTYzMTA0MTQwNzExNzMxMjBcIixcInJvbGVOYW1lXCI6XCLmoKHplb9cIixcImF2YWlsYWJsZVwiOlwiMVwiLFwicm9sZURlc2NcIjpudWxsLFwicm9sZV90eXBlXCI6XCI0XCIsXCJyYW5nZV9jb2RlXCI6MH0se1wicm9sZUlkXCI6XCIyMDgwNzUwNDc2NjYwNjEzMTJcIixcInJvbGVOYW1lXCI6XCLlrabmoKHotYTmupDlrqHmoLjlkZhcIixcImF2YWlsYWJsZVwiOlwiMVwiLFwicm9sZURlc2NcIjpudWxsLFwicm9sZV90eXBlXCI6XCIxN1wiLFwicmFuZ2VfY29kZVwiOjB9LHtcInJvbGVJZFwiOlwiMjk1Njg3NjExMDI3MTY1MTg0XCIsXCJyb2xlTmFtZVwiOlwi5pWZ5Yqh5Li75Lu7XCIsXCJhdmFpbGFibGVcIjpcIjFcIixcInJvbGVEZXNjXCI6bnVsbCxcInJvbGVfdHlwZVwiOlwiMzJcIixcInJhbmdlX2NvZGVcIjowfV0sXCJzY2hvb2xOYW1lXCI6bnVsbH0ifQ.eoGyDdKrMj82DiBf7GLrcu4-Ya7YxhZs_g2hXUg4uheMU9E3qNEi7OaVbR-RRZj2t6yBi221BEIWtIAmWt_6JQ"
    let api = "120.55.163.11:8080"
    let centerApi = "api.xuehuile.top"
    let questionTypes = [{title:"单选题",type:"01",selected:false},{title:"多选题",type:"03",selected:false},{title:"判断",type:"02",selected:false},{title:"填空题",type:"04",selected:false},{title:"简答题",type:"05",selected:false}]
    let appendConent = "<div class='overshotQuestion' style='display: flex;flex-direction: row;justify-content: center;margin-top:10px;margin-bottom:30px'>"+
        "<div style='display: flex;flex-direction: column;width: 90%;background-color:white'>"+
        "<div class='examPaperId' style='margin-left: 10px;color: #666;margin-top:20px'>试卷ID：<input id='examPaperId' type='text' placeholder='请输入试卷ID' style='text-align: center;height: 40px; width: 200px;'/></div>"+
        "<div class=\"questionType\" style=\"display: flex;flex-direction: row;margin-left: 10px;color: #666;margin-top: 30px;align-items: center;\">题型："+
        "<div></div>"+
        "</div>"+
        "<div class=\"questionOptionAnswer\" hidden=\"hidden\"  style='margin-left: 10px;color: #666;margin-top: 30px;'>答案：<label style=\"color:#009d85\">C</label></div>"+
        "<div style='display: flex;flex-direction: row;justify-content:flex-end;'>"+
        "<div class='sendQuestion' style='background-color:red;color:white;height:50px;width:160px;display:flex;flex-direction: row; justify-content:center;align-items: center;margin-top:20px;margin-bottom:20px;margin-right:20px'>发送到服务器</div>"+
        "</div>"+
        "</div>"+
        "</div>"

    // let OSS = require('ali-oss');
    let questionTypesHtml = getQuestionTypesHtml()
    let matchResult = window.location.href.match(/\?[0-9]*&/)
    let exampaperId = ""
    let zybUrl = window.location.href
    if(matchResult && matchResult.length>0){
       let result = matchResult[0]
       exampaperId = result.replace(/\W/g,"")
    }
    if(exampaperId){
        zybUrl = zybUrl.replace(exampaperId+"&","")
    }
    let optionAnswer = $(".refer-answer").text()
    let regex1 = /故选:?\W?[A-Za-z]+/g
    let regex2 = /[A-Za-z]+/g
    let matchStr1 = optionAnswer.match(regex1)?optionAnswer.match(regex1)[0]:null
    let matchStr2 = matchStr1?matchStr1.match(regex2)[0]:""
    let selectedQuestionType = null
    optionAnswer = matchStr2;
    let questionOptionHtml = getQuestionOptionAnswerHtml()
    $("head").append("<meta http-equiv=\"Content-Security-Policy\" content=\"upgrade-insecure-requests\">")
    $(".book-content").append(appendConent)
    $(".sendQuestion").click(sendQuestionInfo)
    $(".refer-answer dd").css({"border":"1px solid red","padding-left":"8px"})
    $(".refer-ques dd").css({"border":"1px solid green","padding-left":"8px"})
    $(".questionType div").append(questionTypesHtml)
    $(".questionType button").click(chooseQuestionType)
    $(".questionOptionAnswer").replaceWith(questionOptionHtml)
    $("#examPaperId").val(exampaperId)
    $(".copyExampaperId").click(copyExampaperId)
    $(".card.question img").css({"height":"200px"})
    downloadImageAndReplaceImageUrl()
    function getQuestionTypesHtml(){
        let questionTypesHtml = ''
        questionTypes.forEach((questionInfo)=>{
            let backgroundStyle = questionInfo.selected?"background-color: #1296db;color:white;":"background-color: whitesmoke;color: #1296db;"
            let questionType = "<button style=\"margin-left: 10px;height: 40px;width: 120px;"+backgroundStyle+"border:1px solid #1296db\" type=\"button\" id='"+questionInfo.type+"'>"+questionInfo.title+"</button>"
            questionTypesHtml += questionType
        })
        return questionTypesHtml
    }

    function copyExampaperId(e){
        let clipboard = new ClipboardJS('.copyExampaperId')
        clipboard.on('success',function(e){
            alert(e.text)
        })

        clipboard.on('error',function(e){
            alert("error")
        })
        if(window.netscape){
            alert("存在")
        }
        // alert(content)
    }

    function getQuestionOptionAnswerHtml(){
        let isObjectQues = isObjectQuestion();
        let questionOptionAnswer = isObjectQues?"<div class=\"questionOptionAnswer\" style='margin-left: 10px;color: #666;margin-top: 30px;'>答案：<input style=\"color:#009d85;height:30px;width:200px;text-align:center\" placeholder='请输入答案' value='"+optionAnswer+"'></input></div>":"<div class=\"questionOptionAnswer\" hidden=\"hidden\"  style='margin-left: 10px;color: #666;margin-top: 30px;'>答案：<label style=\"color:#009d85\">"+optionAnswer+"</label></div>"
        return questionOptionAnswer;
    }

    function sendQuestionInfo(){
         let examPaperId = $(".examPaperId input").val()
        if(examPaperId == ""){
            alert("请输入试卷Id")
            return
        }

        if(!selectedQuestionType){
            alert("请选择题目类型")
            return
        }

        let isObjectQues = isObjectQuestion()
        if(isObjectQues){
            optionAnswer = $(".questionOptionAnswer input").val()
            if(!optionAnswer){
                alert("请输入选项！")
                return;
            }
        }
        let questionJsonInfo = null
        if(isObjectQues){
            questionJsonInfo = getObjectQuestionJsonInfo(examPaperId)
        }else{
            questionJsonInfo = getSubjectQuestionJsonInfo(examPaperId)
        }

        $(".sendQuestion").text("题目发送中")
        $(".sendQuestion").css({"background-color":"Yellow","color":"red"})
        $.ajax({
            type:"post",
            dataType:"json",
            url:"https://wx-api.ezuoye.com/wordquestion/addQuestionFormThird",
            headers: { 'content-type': 'application/x-www-form-urlencoded', 'from': 'WECHAT', 'token': token, 'real-backend-host': centerApi},
            data:{questionJson:questionJsonInfo,queUrl:zybUrl},
            success:function(data){
                if (data.title == "Success") {
                    $(".sendQuestion").css({"background-color":"#007AFF","color":"white"})
                    $(".sendQuestion").text("上传成功")
                }else{
                    alert(data.result)
                    $(".sendQuestion").css({"background-color":"Orange","color":"white"})
                    $(".sendQuestion").text("上传失败，重新上传")
                }
               
            },
            error:function(xhr,text){
                alert(text)
                $(".sendQuestion").css({"background-color":"Orange","color":"white"})
                $(".sendQuestion").text("上传失败，重新上传")
            }
        })
    }

    function getObjectQuestionJsonInfo(examinationPaperId){
        let questionContent  = $(".refer-ques dd").html()
        let questionAnswers = $(".refer-answer")
        let questionOptions = getObjectQuestionOptions()[0]
        let matchResult = getObjectQuestionOptions()[1]
        let questionPoint = ''
        let questionAnalysis = ''
        let questionAnswer = ''
        // let needToReplaceImagesHtmlDic = {questionOptions:questionOptions}
        $.each(questionAnswers,function(index,answerInfo){
            if($(answerInfo).find('dt').text().match(/解答/g)){
                questionAnswer = $(answerInfo).find('dd').html()
            }

            if($(answerInfo).find('dt').text().match(/考点/g)){
                questionPoint = $(answerInfo).find('dd').html()
                if (questionPoint.match(/videoName/) || questionPoint.match(/<img/)){
                    questionPoint = ""
                }
            }

            if($(answerInfo).find('dt').text().match(/分析/g)){
                questionAnalysis = $(answerInfo).find('dd').html()
                if (questionAnalysis.match(/<img/)) {
                    questionAnalysis = ""
                }
                // needToReplaceImagesHtmlDic.push({questionPoint:questionPoint})
            }
        })
        if(matchResult && matchResult.length>0){
            matchResult.forEach((result)=>{
                questionContent = questionContent.replace(result,"")
                questionContent = questionContent.replace("<br>","")
            })
        }
        let points = questionPoint == ""?[]:[{pointKey:1,pointValue:questionPoint}];
        let questionInfo = {examinationPaperId:examinationPaperId,examination:questionContent,comment:questionAnalysis,description:questionAnswer,kind:selectedQuestionType.type,optionPojoList:questionOptions,points:points,answer:optionAnswer}
        let questionJsonInfo = JSON.stringify(questionInfo)
        return questionJsonInfo;
    }

    function getObjectQuestionOptions(){
        let questionOptions = handleLiTagQuestion()[0];
        let matchResult = handleLiTagQuestion()[1]
        if(!questionOptions || questionOptions.length == 0){
            questionOptions = handleTdTagQuestion()[0]
            matchResult = handleTdTagQuestion()[1]
        }
        if(!questionOptions || questionOptions.length == 0){
            questionOptions = handleBRTagQuestion()[0]
            matchResult = handleBRTagQuestion()[1]
        }
        if(!questionOptions || questionOptions.length == 0){
            questionOptions = hanleOpItemTagQuestion()[0]
            matchResult = hanleOpItemTagQuestion()[1]
        }
        if(!questionOptions || questionOptions.length == 0){
            questionOptions = handleSpanTagQuestion()[0]
            matchResult = handleSpanTagQuestion()[1]
        }
        if(!questionOptions || questionOptions.length == 0){
            questionOptions = handlePTagQuestion()[0]
            matchResult = handlePTagQuestion()[1]
        }
        if(!questionOptions || questionOptions.length == 0){
            questionOptions = hanleTDTagQuestion()[0]
            matchResult = hanleTDTagQuestion()[1]
        }
        return [questionOptions,matchResult]
    }

    //li标签的选择题处理
    function handleLiTagQuestion(){
        let questionOptions = [];
        let handledQuestionOptions = []
        $(".refer-ques dd li").map((index,optionInfo)=>{
            if ($(optionInfo).find('li')){
                questionOptions.push($(optionInfo).html())
            }
        })
        handledQuestionOptions = questionOptions.map((optionInfo,index)=>{
            let optionContent = optionInfo.replace(/^([A-Za-z].)/,"")
            return {content:optionContent}
        })
        return [handledQuestionOptions,questionOptions];
    }

    //td 标签的选择题处理
    function handleTdTagQuestion(){
        let quesHtml = $(".refer-ques dd .pt2").html()
        if(!quesHtml || quesHtml == ""){
           return [[],[]]
        }
        let matchResult = quesHtml.match(/<td.*?>.*?<\/td>/g)
        let questionOptions = []
        if(matchResult && matchResult.length>0){
            matchResult.forEach((optionStr)=>{
                if (optionStr != "") {
                   let optionContent = optionStr.replace(/[A-Za-z]．|\./,"")
                   questionOptions.push({content:optionContent})
                }
            })
        }
        return [questionOptions,matchResult];
    }

    //被br标签包围的选择题处理
    function handleBRTagQuestion(){
        let questionOptionsHtml = $(".refer-ques dd .special-style").html()
        if (!questionOptionsHtml) {
            questionOptionsHtml = $(".refer-ques dd").html()
        }
        let questionOptions = [];
        let questionOptionArr = []
        if (questionOptionsHtml) {
            questionOptions = questionOptionsHtml.match(/<br>?\W?([A-Za-z]\.).*/g)?questionOptionsHtml.match(/<br>?\W?([A-Za-z].).*/g)[0]:null
        }
        if(questionOptions && questionOptions.length > 0){
            questionOptions.split("<br>").map((str,index)=>{
                if(str != ""&& (str.match(/([A-Za-z]\.)/g))){
                    questionOptionArr.push(str)
                }
            })
            questionOptions = questionOptionArr
            questionOptions = questionOptions.map((optionInfo,index)=>{
            let optionContent = optionInfo.replace(/^([A-Za-z].)/,"")
            return {content:optionContent}
        })
        }
        return [questionOptions,questionOptionArr]
    }

    function hanleOpItemTagQuestion(){
        let questionOptions = [];
        let handledQuestionOptions = []
        $(".refer-ques dd .op-item").map((index,optionInfo)=>{
            if ($(optionInfo).find('li')){
                questionOptions.push($(optionInfo).html())
            }
        })

        handledQuestionOptions = questionOptions.map((optionInfo,index)=>{
            let optionContent = optionInfo.replace(/^([A-Za-z].)/,"")
            return {content:optionContent}
        })
        return [handledQuestionOptions,questionOptions]
    }

    function handleSpanTagQuestion(){
        let optionStr = $(".refer-ques dd").html();
        optionStr = optionStr.match(/<span>[A-Za-z]\..*?<\/p>/)?optionStr.match(/<span>[A-Za-z]\..*?<\/p>/)[0]:null
        let questionOptions = []
        let questionOptionArr = []
        if (optionStr && optionStr.length>0) {
            let splitQuestionOptions = optionStr.split('&nbsp;')
            splitQuestionOptions.forEach((optionStr)=>{
                if (optionStr != "") {
                   let optionContent = optionStr.replace(/[A-Za-z]\./,"")
                   questionOptionArr.push(optionStr)
                   questionOptions.push({content:optionContent})
                }
            })
        }
        return [questionOptions,questionOptionArr]
    }

    function handlePTagQuestion(){
        let optionStr = $(".refer-ques dd").html();
        let matchResult = optionStr.match(/<p>[A-Za-z]\..*?<\/p>/g)
        let questionOptions = []
        if(matchResult && matchResult.length>0){
            matchResult.forEach((optionStr)=>{
                if (optionStr != "") {
                   let optionContent = optionStr.replace(/[A-Za-z]\./,"")
                   questionOptions.push({content:optionContent})
                }
            })
        }
        return [questionOptions,matchResult]
    }

    function hanleTDTagQuestion(){
        let optionStr = $(".refer-ques dd").html();
        let matchResult = optionStr.match(/<td>\W?[A-Za-z]、.*?<\/td>/g)
        let questionOptions = []
        if(matchResult && matchResult.length>0){
            matchResult.forEach((resultStr)=>{
                if (resultStr != "") {
                    let optionContent = resultStr.replace(/<td>|<\/td>/g,"")
                    let options = optionContent.split("<br>")
                    options.forEach((optionStr)=>{
                        let optionContent = optionStr.replace(/[A-Za-z]、/,"")
                        questionOptions.push({content:optionContent})
                    })
                }
            })
        }
        return [questionOptions,matchResult]
    }

    function getSubjectQuestionJsonInfo(examinationPaperId){
        let questionContent  = $(".refer-ques dd").html()
        let questionAnswers = $(".refer-answer")
        let questionPoint = ''
        let questionAnalysis = ''
        let questionAnswer = ''
        // let needToReplaceImagesHtmlDic = {}
        $.each(questionAnswers,function(index,answerInfo){
            if($(answerInfo).find('dt').text().match(/解答/g)){
                questionAnswer = $(answerInfo).find('dd').html()
                // needToReplaceImagesHtmlDic.push({questionAnswer:questionAnswer})
            }

            if($(answerInfo).find('dt').text().match(/考点/g)){
                questionPoint = $(answerInfo).find('dd').html()
                if (questionPoint.match(/videoName/) || questionPoint.match(/<img/)){
                    questionPoint = ""
                }
                // needToReplaceImagesHtmlDic.push({questionPoint:questionPoint})
            }

            if($(answerInfo).find('dt').text().match(/分析/g)){
                questionAnalysis = $(answerInfo).find('dd').html()
                if (questionAnalysis.match(/<img/)) {
                    questionAnalysis = ""
                }
                // needToReplaceImagesHtmlDic.push({questionAnalysis:questionAnalysis})
            }
        })
        questionContent = questionContent.replace("<br>","")
        let points = [{pointKey:1,pointValue:questionPoint}];
        let questionInfo = {examinationPaperId:examinationPaperId,examination:questionContent,comment:questionAnalysis,description:questionAnswer,kind:selectedQuestionType.type,optionPojoList:[],points:points,answer:questionAnswer}
        let questionJsonInfo = JSON.stringify(questionInfo)
        return questionJsonInfo
    }

    function isObjectQuestion(){
        let isObjectQues = false;
        questionTypes.forEach((questionInfo)=>{
            if((questionInfo.type == 1||questionInfo.type == 2) && questionInfo.selected){
                isObjectQues = true
            }
        })
        return isObjectQues;
    }

    function chooseQuestionType(e){
        questionTypes.forEach((questionTypeInfo)=>{
            questionTypeInfo.selected = questionTypeInfo.type == $(e.target).attr("id")
            if(questionTypeInfo.selected){
                selectedQuestionType = questionTypeInfo;
            }
        })
        let questionTypesHtml = getQuestionTypesHtml()
        let questionOptionHtml = getQuestionOptionAnswerHtml()
        $(".questionType div").empty()
        $(".questionType div").append(questionTypesHtml)
        $(".questionType button").click(chooseQuestionType)
        $(".questionOptionAnswer").replaceWith(questionOptionHtml);
        //alert($(e.target).attr("id"))
    }

    async function downloadImage(url){
        let blob = null
        let response = await fetch(url)
        return response.blob()
    }

    function getOSSKey(){
        let ossKey = ""
        $.ajax({
            type:"GET",
            dataType:"json",
            url:"https://wx-api.ezuoye.com/system/getUniqueKey",
            headers: { 'content-type': 'application/x-www-form-urlencoded', 'from': 'WECHAT', 'token': token, 'real-backend-host': centerApi},
            async:false,
            data:{extraInfo:".png"},
            success:function(data){
                ossKey = data.resultData
            },
            error:function(xhr,text){
               ossKey = ""
            }
        })
        return ossKey;
    }

   async function uploadOSS(blob){
        let ossKey = getOSSKey()
        let ossImageUrl =  await uploadOSSRquest(ossKey,blob);
        return ossImageUrl
    }

    async function uploadOSSRquest(key,blob){
        let imageUrl = ""
        let ossConfig = {
            region:'oss-cn-shanghai',
            accessKeyId:'LTAIWWJJkLUxzxPS',
            accessKeySecret:'FackGGqlOT1itnc0Ad5AvLQH492oWb',
            bucket:'looedu-oss1'
        }
        let client = new OSS(ossConfig)
        console.log("");
         try{
                let result = await client.put(key,blob,{type:'text/plain'})
                imageUrl = result.url;
                if (imageUrl) {
                    imageUrl = imageUrl.replace("looedu-oss1.oss-cn-shanghai.aliyuncs.com","oss.ezuoye.com")
                }else{
                    imageUrl = ""
                }
            }catch(e){
                imageUrl = ""
            }
        return imageUrl;
    }

    function downloadImageAndReplaceImageUrl(){
        let questionContent = $(".refer").html();
        let imageUrls = questionContent.match(/(http|https):.*?(jpg|png)/g);
        let replaceIndex = 0
        if (!imageUrls || imageUrls.length == 0 ) {
            return;
        }
        imageUrls.forEach((imageUrl,index)=>{
            (async()=>{
                replaceIndex = index;
                let blob = await downloadImage(imageUrl)
                let ossImageUrl = await uploadOSS(blob)
                questionContent = questionContent.replace(imageUrl,ossImageUrl)
                if (replaceIndex+1 == imageUrls.length) {
                    $(".refer").html(questionContent)
                }
            })();
        })
    }

    // Your code here...
})();