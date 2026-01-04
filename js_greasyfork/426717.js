// ==UserScript==
// @name         易班优课YOOC浙理助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  浙江理工大学易班优课YOOC测试、刷题
// @author       STZG
// @match        *://*.yooc.me/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @require      https://code.jquery.com/jquery-3.5.1.js#sha256=QWo7LDvxbWT2tbbQ97B53yJnYU3WhH/C8ycbRAkjPDc=
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/426717/%E6%98%93%E7%8F%AD%E4%BC%98%E8%AF%BEYOOC%E6%B5%99%E7%90%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/426717/%E6%98%93%E7%8F%AD%E4%BC%98%E8%AF%BEYOOC%E6%B5%99%E7%90%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
 
 
(function() {
    // 设置修改后，需要刷新或重新打开网课页面才会生效
    var setting = {
 
    },
    _self = unsafeWindow,
    top = _self,
    url;
    var $ = _self.jQuery || top.jQuery,
    parent = _self == top ? self : _self.parent,
    Ext = _self.Ext || parent.Ext || {},
    UE = _self.UE,
    vjs = _self.videojs;
    var ajaxUsualErrorMessage=(e) =>{
        if(e.status==500){
            //页面函数
            xAlert('失败','网络请求失败')
        }else if(e.status==404){
            //页面函数
            xAlert('失败','找不到网页')
        }
    }
 
    var htmlToQuestionObj=(id,questionHTML)=>{
        return {id:id,question:questionHTML
            .replace(/the-ans fls/g,"the-ans crt")
            .replace(/<li class="crt"/g,'<li class=""')
            .replace(/<li class="fls"/g,'<li class=""')}
    }
    var analysisDetailAnswerPage=(pagehtml)=>{
        console.log(pagehtml);
        //创建DOM
        var pageDOM=document.createElement("html");
        pageDOM.innerHTML=pagehtml
        var page=$(pageDOM)
        console.log(page)
        //获取考试信息
        var groupData=page.find('#group-data')
        var groupId=groupData.attr("data-group-id")
        var examId=groupData.attr("data-exam-id")
        //获取问题信息
        var question=page.find('.question-board')
        console.log(question)
        //数据封装
        var question_arr=[]
        question.each((index,q)=>{
            question_arr.push(htmlToQuestionObj(q.id,q.outerHTML))
            let aq=$("#"+q.id).find('.the-ans')
            if(aq.length==1){
                aq.html($(q).find('.the-ans').html())
            }
        })
        return {group:groupId,
                exam:examId,
                questions:question_arr}
    }
    var getDetailPage=(groupId,examId)=>{
        return $.ajax({
            //请求方式
            type : "GET",
            //请求地址
            url :'https://www.yooc.me/group/'+groupId+'/exam/'+examId+'/detail'
        });
    }
    var uploadAnswer=(groupId,examId,question_arr)=>{
        return $.ajax({
            //请求方式
            type : "POST",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url : "https:///MyZSTU/yooc/group/"+groupId+"/exam/"+examId+"/upload",
            //数据，json字符串
            data : JSON.stringify(question_arr)
        });
    }
    var getAnswer=(groupId,examId,question_arr)=>{
        return $.ajax({
            //请求方式
            type : "GET",
            //请求地址
            url : "https:///MyZSTU/yooc/group/"+groupId+"/exam/"+examId+"/answer?question="+question_arr,
        });
    }
    var unblock=()=>{
        //选择
        document.onselectstart= function(e){
            e = e || window.event;
            e.returnValue = true;
            return true;
        }
    
        //鼠标按下
        document.onmousedown = function(e) {
            e = e || window.event;
            e.returnValue = true;
            return true;
        }
        //鼠标右键菜单
        document.oncontextmenu = function(e) {
            e = e || window.event;
            e.returnValue = true;
            return true;
        }
    
        window.onkeydown = function(e) {
            //Ctrl+S 保存
            if (e.ctrlKey && e.keyCode == 83) {
                e.returnValue = true;
                return true;
            }
            //Ctrl+P 打印
            if (e.ctrlKey && e.keyCode == 80) {
                e.returnValue = true;
                return true;
            }
            //Ctrl+C 复制
            if (e.ctrlKey && e.keyCode == 67) {
                e.returnValue = true;
                return true;
            }
        }
    }
    var examsPage=()=>{
        //获取考试信息
        var group=document.getElementById('group-data')
        var groupId=group.getAttribute("data-group-id")
        var csrf=group.getAttribute("data-csrf")
        var auth=group.getAttribute("data-auth")
        var seeExam=(exam)=>{
            let a_score=exam.getElementsByClassName('score')[0]
            if(a_score&&a_score.innerHTML==='禁止查卷'){
                    let t_bgc=document.getElementsByClassName('t-bgc fl')[7]
                    let edit_history_url=t_bgc.getElementsByTagName('a')[0].href
                    a_score.href=edit_history_url.replace('edit_history','detail')
                    a_score.innerHTML='查看详情'
            }
        }
        var autoPractice=(exam)=>{
            let search=exam.getElementsByClassName('board-bottom')[0]
            if(search){
                return
            }
            let examId=exam.getAttribute("data-exam-id")
            let sum=Number(/(.*)\u9898/.exec(exam.getElementsByClassName('board-det')[0].childNodes[1]
                                                 .getElementsByTagName('span')[0]
                                                 .innerText.trim())[1])
            let is_repeat=exam.getElementsByClassName('board-left')[0].childNodes[25].innerText.trim()==='允许'
            let template='<div class="fl board-bottom robot" style="width: 770px;"><div class="fl board-left" style="    height: 40px!important;line-height: 40px;font-size: 14px;padding: 0 10px;"><div class="progress-tar" style="width:70%;display: inline-block;"><span style="line-height:  20px;height:  20px;">刷题进度：</span><progress class="progress" value="30" max="100" style="width: 60%;border-radius: 2px;border-left: 1px #ccc solid;border-right: 1px #ccc solid;border-top: 1px #aaa solid;background-color: #eee;margin-bottom: 1px;">您的浏览器不支持progress元素</progress><span style="margin: 10px;    line-height: 20px;"><span class="count-practice">0</span>/<span  class="sum-practice"></span></span></div><div style="width: 30%;text-align: center;display: inline-block;"><span class="status-practice" style="margin: 10px;">正在xxxx</span></div></div><div class="fl board-right" style="height: 40px!important;line-height:40px;font-size:14px;background-color: #fe8333;cursor: pointer;color: white;"><div class="button-practice"></div></div></div>'
            //添加伪元素CSS
            document.styleSheets[0].addRule('progress::-webkit-progress-bar','background-color: #d7d7d7;'); // 支持IE
            document.styleSheets[0].addRule('progress::-webkit-progress-value','background-color: #aadd6a;'); // 支持IE
            let board_bottom=document.createElement('div')
            board_bottom.innerHTML=template
            board_bottom=board_bottom.childNodes[0]
            exam.appendChild(board_bottom)
            let button_practice=board_bottom.getElementsByClassName('button-practice')[0]
            let count_practice=board_bottom.getElementsByClassName('count-practice')[0]
            let sum_practice=board_bottom.getElementsByClassName('sum-practice')[0]
            let status_practice=board_bottom.getElementsByClassName('status-practice')[0]
            let progress=board_bottom.getElementsByClassName('progress')[0]
            sum_practice.innerHTML=sum
            progress.value=0/sum*100
            count_practice.innerHTML=0
            let updateFlag=false;
            let now_sum=0;
            let updateStatus=(o)=>{
                now_sum=o
                if(updateFlag){
                        return
                }else{
                    let timer=setInterval(()=>{
                        let now_num=Math.round(Number(count_practice.innerHTML))
                        let cmp=now_sum-now_num
                        if(cmp===0){
                            updateFlag=false;
                            clearInterval(timer);
                        }else{
                            if(now_num===0){
                                now_num=1;
                            }else{
                                now_num=now_num+Math.round(cmp/Math.abs(cmp))
                            }
                            count_practice.innerHTML=now_num
                            progress.value=now_num/sum*100
                        }
                    },50)
                }
            }
            let refreshStatusSum=()=>{
                updateStatus(0)
                return $.ajax({
                    url:'https:///MyZSTU/yooc/group/'+groupId+'/exam/'+examId+'/answer/total',
                    type:'get',
                    success:(res)=>{
                        console.log(res)
                        updateStatus(res.data)
                    }
                })
            }
            if(is_repeat){
                button_practice.innerHTML="开始自动刷题"
                let autoPracticeStatus=false
                button_practice.onclick=e=>{
                    let exam_status=0
                    let repeat=exam.getElementsByClassName('repeat')[0]
                    if(repeat){
                        if(autoPracticeStatus){
                            autoPracticeStatus=false
                            button_practice.innerHTML="开始自动刷题"
                            window.location.href=document.URL
                        }else{
                            autoPracticeStatus=true
                            button_practice.innerHTML="关闭自动刷题"
                            let repeat_url=repeat.getAttribute("repeat-url")
                            let start_exam=exam.getElementsByClassName('start_exam')[0]
                            if(start_exam){
                                exam_status=0
                            }else if(repeat){
                                exam_status=4
                            }
                            let autoPracticeMain=()=>{
                                if(!autoPracticeStatus){return}
                                console.log("start")
                                status_practice.innerHTML="刷题开始"
                                console.log("apply-repeat")
                                status_practice.innerHTML="申请重做"
                                $.ajax({
                                    url: repeat_url,
                                    type : "POST",
                                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                                    headers:{'X-CSRFToken':csrf},
                                    data: {'csrfmiddlewaresretoken': csrf},
                                    success: (res)=>{
                                        if(!autoPracticeStatus){return}
                                        status_practice.innerHTML="申请重做成功"
                                        let data=res
                                        if(data.result){
                                            console.log('申请重做成功')
                                            if(data.url){
                                                console.log("practice")
                                                if(!autoPracticeStatus){return}
                                                status_practice.innerHTML="申请考试页面"
                                                $.ajax({
                                                    url: data.url,
                                                    type: 'GET',
                                                    success: (res)=>{
                                                        if(!autoPracticeStatus){return}
                                                        status_practice.innerHTML="自动练习开始"
                                                        let examuser=/var AnswerData = JSON.parse\(localStorage.getItem\("exam(.*)"\)\) \|\| {};/.exec(res)[1]
                                                        console.log(examuser)
                                                        repeat_url='https://www.yooc.me/group/'+groupId+'/exam/'+examId+'/examuser/'+examuser+'/repeat'
                                                        let practice=document.createElement('html')
                                                        practice.innerHTML=res
                                                        console.log(practice)
                                                        //获取问题信息
                                                        var question=Array.from(practice.getElementsByClassName('question-board'))
                                                        let AnswerData={}
                                                        question.forEach(q=>{console.log(q)
                                                                let inputTag=q.getElementsByTagName('input')
                                                                console.log(inputTag)
                                                                if(inputTag.length>0){
                                                                        let Ele=inputTag[0]
                                                                        if(Ele.type==="radio"||Ele.type==="checkbox"){
                                                                            let arr=Ele.id.split('_')
                                                                            let questionId=arr[0]
                                                                            let name=arr[1]
                                                                            let qData=[arr[2]]
                                                                            AnswerData[questionId] = {};
                                                                            AnswerData[questionId][name] = qData;
                                                                        }else if(Ele.type==="text"){
                                                                            let Eles=Array.from(inputTag)
                                                                            Eles.forEach(e=>{
                                                                                e.value="test"
                                                                                let arr=e.id.split('_')
                                                                                let questionId=arr[0]
                                                                                let name=arr[1]
                                                                                AnswerData[questionId] = {};
                                                                                if (AnswerData[questionId][name]===undefined) {
                                                                                    AnswerData[questionId][name] = [e.value.trim()];
                                                                                } else {
                                                                                    AnswerData[questionId][name].push(e.value.trim());
                                                                                }
                                                                            })
                                                                        }
                                                                }
                                                        })
                                                        status_practice.innerHTML="自动练习完成"
                                                        console.log("save")
                                                        localStorage.setItem("exam"+examuser,JSON.stringify(AnswerData));
                                                        status_practice.innerHTML="提交答案"
                                                        $.ajax({
                                                            url: 'https://www.yooc.me/group/'+groupId+'/exam/'+examId+'/answer/save',
                                                            type : "POST",
                                                            contentType: "application/json; charset=UTF-8",
                                                            headers:{'X-CSRFToken':csrf},
                                                            data: JSON.stringify(AnswerData),
                                                            success: (res)=>{	
                                                                if(!autoPracticeStatus){return}
                                                                status_practice.innerHTML="提交答案成功"
                                                                console.log("submit")
                                                                var submitUrl = 'https://www.yooc.me/group/'+groupId+'/exam/'+examId+'/answer/submit';
                                                                var _AnswerData = [];
                                                                for(let obj in AnswerData){
                                                                    var m = {};
                                                                    m[obj] = AnswerData[obj];
                                                                    _AnswerData.push(m);
                                                                }
                                                                var postData = {
                                                                    'csrfmiddlewaretoken': csrf,
                                                                    'answers': JSON.stringify(_AnswerData),
                                                                    'type': 0,
                                                                    'auto': 0,
                                                                    'completed':1
                                                                };
                                                                if(!autoPracticeStatus){return}
                                                                status_practice.innerHTML="提交试卷"
                                                                $.ajax({
                                                                    url: submitUrl,
                                                                    type : "POST",
                                                                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                                                                    headers:{'X-CSRFToken':csrf},
                                                                    data: postData,
                                                                    success: (res)=>{
                                                                        if(!autoPracticeStatus){return}
                                                                        status_practice.innerHTML="提交试卷成功"
                                                                        console.log("upload")
                                                                        status_practice.innerHTML="申请答案页面"
                                                                        getDetailPage(groupId,examId)
                                                                        .then(detailPage=>{
                                                                            if(!autoPracticeStatus){return}
                                                                            status_practice.innerHTML="答案分析"
                                                                            let info=analysisDetailAnswerPage(detailPage)
                                                                            if(!autoPracticeStatus){return}
                                                                            status_practice.innerHTML="上传答案"
                                                                            uploadAnswer(info.group,info.exam,info.questions)
                                                                            .then(res=>{
                                                                                console.log(res)
                                                                                if(!autoPracticeStatus){return}
                                                                                status_practice.innerHTML="上传成功"
                                                                                console.log("end")
                                                                                refreshStatusSum()
                                                                                .then((res)=>{
                                                                                    if(!autoPracticeStatus){return}
                                                                                    console.log("update")
                                                                                    status_practice.innerHTML="更新状态"
                                                                                    updateStatus(res.data)
                                                                                    console.log("reboot")
                                                                                    status_practice.innerHTML="正在重新开始"
                                                                                    autoPracticeMain()
                                                                                },(e)=>{
                                                                                    //页面方法
                                                                                    xAlert('失败','网络请求失败')
                                                                                    autoPracticeStatus=false
                                                                                    button_practice.innerHTML="开始自动刷题"
                                                                                    window.location.href=document.URL
                                                                                })
                                                                            },(e)=>{
                                                                                //页面方法
                                                                                xAlert('失败','网络请求失败')
                                                                                autoPracticeStatus=false
                                                                                button_practice.innerHTML="开始自动刷题"
                                                                                window.location.href=document.URL
                                                                            })
                                                                        },(e)=>{
                                                                            //页面方法
                                                                            xAlert('失败','网络请求失败')
                                                                            autoPracticeStatus=false
                                                                            button_practice.innerHTML="开始自动刷题"
                                                                            window.location.href=document.URL
                                                                        })
                                                                    },
                                                                    error:(e)=>{
                                                                        //页面方法
                                                                        xAlert('失败','网络请求失败')
                                                                        autoPracticeStatus=false
                                                                        button_practice.innerHTML="开始自动刷题"
                                                                        window.location.href=document.URL
                                                                    }
                                                                });
                                                            },
                                                            error:(e)=>{
                                                                //页面方法
                                                                xAlert('失败','网络请求失败')
                                                                autoPracticeStatus=false
                                                                button_practice.innerHTML="开始自动刷题"
                                                                window.location.href=document.URL
                                                            }
                                                        })
                                                    },
                                                    error:(e)=>{
                                                        //页面方法
                                                        xAlert('失败','网络请求失败')
                                                        autoPracticeStatus=false
                                                        button_practice.innerHTML="开始自动刷题"
                                                        window.location.href=document.URL
                                                    }
                                                })
                                            }
                                        }else{
                                            //页面方法
                                            xAlert(data.message);
                                            autoPracticeStatus=false
                                            button_practice.innerHTML="开始自动刷题"
                                            window.location.href=document.URL
                                        }
                                    },
                                    error:(e)=>{
                                        //页面方法
                                        xAlert('失败','网络请求失败')
                                        autoPracticeStatus=false
                                        button_practice.innerHTML="开始自动刷题"
                                        window.location.href=document.URL
                                    }
                                });
                                
                            }
                            autoPracticeMain()
                        }
                    }else{
                        //页面方法
                            xAlert('失败','无法获取重做按钮，请测试允许反复练习并且确保有重做按钮在页面上')
                    }
                }
            }else{
                button_practice.innerHTML="刷新刷题进度"
                button_practice.onclick=e=>{
                    console.log("start")
                    console.log("get")
                    console.log("update")
                    refreshStatusSum()
                    console.log("end")
                }
            }
            //初始化状态
            refreshStatusSum(res=>{},ajaxUsualErrorMessage)
            status_practice.innerHTML=""
        }
        let exams_board=document.getElementsByClassName('exams-board')[0]
		if(exams_board){
			let exams=Array.from( exams_board.getElementsByTagName('li'))
			if(exams||exams!==[]){
                exams.forEach(exam=>{
                        autoPractice(exam)
                        seeExam(exam)
                })
			}else{
				return
			}
		}
    }
    var detailPage=()=>{
        //获取考试信息
        var group=document.getElementById('group-data')
        var groupId=group.getAttribute("data-group-id")
        var examId=group.getAttribute("data-exam-id")
        var examQuestionNum=Number(group.getAttribute("data-questions"))
        //获取问题信息
        var questions=document.getElementsByClassName('question-board')
        var questionNum = questions.length
        //获取答案信息
        var ansElements = document.getElementsByClassName('the-ans')
        var ansNum = ansElements.length
        var addIdTag=()=>{
            //获取问题信息
            var question=Array.from(document.getElementsByClassName('question-board'))
            question.forEach(q=>{
                let board_type=q.id.split('-')[0]
                let question_id=q.id.split('-')[1]
                let idTag=q.getElementsByClassName('question-id-tag')
                if(idTag.length===0){
                    idTag=document.createElement('span')
                    idTag.classList.add('question-id-tag')
                    q.children[0].appendChild(idTag)
                }
                if(board_type==='question'){
                    idTag.innerHTML=" 题目ID："+question_id
                }else if(board_type==='answer'){
                    idTag.innerHTML=" 答案ID："+question_id
                }
            })
        }
        var nullSubmit=()=>{
            //获取问题信息
            var question=Array.from(document.getElementsByClassName('question-board'))
            question.forEach(q=>{console.log(q)
                let inputTag=q.getElementsByTagName('input')
                console.log(inputTag)
                if(inputTag.length>0){
                    let Ele=inputTag[0]
                    if(Ele.type==="radio"||Ele.type==="checkbox"){
                        if(Ele.type==="radio"){
                            Ele.checked=true;
                        }else if(Ele.type==="checkbox"){
                            Ele.checked=true;
                        }
                        //页面方法
                        choiceAnswerData($(q))
                    }else if(Ele.type==="text"){
                        let Eles=Array.from(inputTag)
                        Eles.forEach(e=>{
                            e.value="test"
                        })
                        //页面方法
                        inputAnswerData($(q))
                    }
                    let ele_name=Ele.name.replace(/\_[0-9]+/, '')
                    let questionTag=document.getElementById(ele_name)
                    questionTag.classList.add('done')
                }
            })
        }
        var writeAnswer=(question)=>{
            let ansEle=question.getElementsByClassName(('the-ans'))[0]
            let pattern=/\u6b63\u786e\u7b54\u6848\uff1a(.*)/
            let ans=ansEle.children[0].innerText.trim()
            if(pattern.test(ans)){
                var answers=pattern.exec(ans)[1]
                let question_id=question.id.split('-')[1]
                let answers_arr=answers.split('、')
                answers_arr.forEach(answer=>{
                    if(/[A-Z]/.test(answer)){
                        let li_Eles=question.getElementsByTagName('li')
                        let li_Ele=li_Eles[answer.charCodeAt(0)-65]
                        let input_id=li_Ele.dataset.questionName+"_"+li_Ele.dataset.questionValue
                        let Ele=document.getElementById(input_id)
                        if(Ele.type==="radio"){
                            Ele.checked=true;
                        }else if(Ele.type==="checkbox"){
                            Ele.checked=true;
                        }
                        //页面方法
                        choiceAnswerData($(document.getElementById('question-'+question_id)))
                    }else{
                        let input_name=question_id+"_" + (answers_arr.indexOf(answer) + 1)
                        let Ele=$("[name='"+input_name+"']").get(0)
                        if(Ele){
                            Ele.value=answer.split('|')[0]
                            //页面方法
                            inputAnswerData($(document.getElementById('question-'+question_id)))
                        }
                    }
                })
                let questionTag=document.getElementById(question_id)
                questionTag.classList.add('done')
            }    
        }
 
        var autoAnswer=()=>{
            var ansElements = Array.from(document.getElementsByClassName('the-ans'))
            ansElements.forEach(ansEle=>{
                writeAnswer(ansEle.parentNode)
            })
        }
        var copyMobileAnswer=()=>{
            //获取问题信息
            questions=$('.question-board')
            var questionContainer=document.getElementsByClassName('exam-detial-container')[0]
            console.log(questionContainer)
            $.ajax({
                type : "GET",
                url:"https://www.yooc.me/mobile/group/"+groupId+"/exams/"+examId+"/subject?view_type=result",
            })
            .then(res=>{
                let data=JSON.parse(/var data=(.*);\n/.exec(res)[1])
                let question_arr=[]
                let num=0
                data.forEach(e=>{
                    console.log(e[2]);
                    e[2].forEach(q=>{
                        let question=document.createElement('div')
                        question.innerHTML=q.question
                        question.classList.add('question-board')
                        question.id=questions.get(num).id
                        console.log(question)
                        question_arr.push(htmlToQuestionObj(question.id,question.outerHTML))
                        writeAnswer(question)
                        question.id = 'answer-' + question.id.split('-')[1]
                        questionContainer.insertBefore(question,questions.get(num++))
                        console.log(num)
                    })
                })
                console.log(question_arr)
                uploadAnswer(groupId,examId,question_arr)
                addIdTag() 
            },ajaxUsualErrorMessage)
        }
        var appendsomething=()=>{
            var releaseButton=document.getElementsByClassName('release-board')[0]
            var ns=document.createElement('a')
            ns.id="null-submit"
            ns.href="javascript:;"
            ns.innerText="提交白卷"
            ns.style="margin-left: 0px;margin-top: 10px;"
            ns.title="随机答案提交试卷"
            ns.onclick=()=>{
                nullSubmit()
                //页面方法
                xAlert('提示','随机答案选择完毕，可以提交了')
            }
            releaseButton.appendChild(ns)
            var qa=document.createElement('a')
            qa.id="query-answer"
            qa.href="javascript:;"
            qa.innerText="查询答案"
            qa.style="margin-left: 20px;margin-top: 10px;"
            qa.title="云端题库查询答案"
            qa.onclick=()=>{
                var ansElements = document.getElementsByClassName('the-ans')
                var ansNum = ansElements.length
                if(ansNum<=0){
                    showAnswer()
                    addIdTag() 
                }else{
                    //页面方法
                    xAlert('失败','已经有答案了哦')
                }
            }
            releaseButton.appendChild(qa)
            var autoAnswerButton=document.createElement('a')
            autoAnswerButton.id="auto-answer-submit"
            autoAnswerButton.href="javascript:;"
            autoAnswerButton.innerText="自动答题"
            autoAnswerButton.style="margin-left: 0px;margin-top: 10px;"
            autoAnswerButton.title="答案自动选择"
            autoAnswerButton.onclick=()=>{
                autoAnswer()
                addIdTag() 
                //页面方法
                xAlert('提示','答案自动选择完毕，请自行检查填空题部分')
            }
            releaseButton.appendChild(autoAnswerButton)
 
            var copyAnswerButton=document.createElement('a')
            copyAnswerButton.id="auto-answer-submit"
            copyAnswerButton.href="javascript:;"
            copyAnswerButton.innerText="正确答案"
            copyAnswerButton.style="margin-left: 20px;margin-top: 10px;"
            copyAnswerButton.title="利用PC端和移动端之间BUG实现获取正确答案"
            copyAnswerButton.onclick=()=>{
                var ansElements = document.getElementsByClassName('the-ans')
                var ansNum = ansElements.length
                if(ansNum<=0){
                    copyMobileAnswer()
                    addIdTag() 
                    //页面方法
                    xAlert('提示','正确答案复制完毕，请自行检查填空题部分')
                }else{
                    //页面方法
                    xAlert('失败','已经有答案了哦')
                }
            }
            releaseButton.appendChild(copyAnswerButton)
        }
        var showAnswer=()=>{
            //获取问题信息
            questions=$('.question-board')
            var question_arr=[]
            questions.each((index,q)=>{
                question_arr.push(q.id.substr(9))
            })
            getAnswer(groupId,examId,question_arr)
            .then(res=>{
                console.log(res)
                var questionContainer=document.getElementsByClassName('exam-detial-container')[0]
                res.forEach(q=>{
                    var question=document.getElementById('question-'+q.id)
                    var answer = document.createElement("div");
                    answer.innerHTML = q.question;
                    var child=answer.childNodes[0]
                    child.id='answer-'+q.id
                    questionContainer.insertBefore(child,question)
                    console.log(question)
                    console.log(answer)
                })
                addIdTag() 
            },ajaxUsualErrorMessage)
        }
        if(ansNum>0){
            if(questionNum===examQuestionNum){
                getDetailPage(groupId,examId)
                .then(detailPage=>{
                    let info=analysisDetailAnswerPage(detailPage)
                    uploadAnswer(info.group,info.exam,info.questions)
                    .then(res=>{console.log(res)},ajaxUsualErrorMessage)
                },ajaxUsualErrorMessage)
            }else{
                console.log("现在是考试中，不能上传答案哦。")
            }
        }else{
            appendsomething()
            unblock()
        }
        addIdTag() 
    }
	var start=()=>{
        if(url!=location.pathname){
            url=location.pathname
            console.log(url)
            if(!url.match(/^\/mobile/)){
                if(url.match(/\/group\/[0-9]*\/exams.*/)){
                    examsPage()
                }
                else if(url.match(/\/group\/[0-9]*\/exam\/[0-9]*\/detail/)){
                    detailPage()
                }
            }
        }
	}
    var int=self.setInterval(()=>{
		start()
	},1000);
})();
