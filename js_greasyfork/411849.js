// ==UserScript==
// @name         vclass_exam
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  vclass exam autosubmit
// @author       CopyTIME
// @match        http://vclass.neusoft.edu.cn/exam/*
// @match        http://vclass.neusoft.edu.cn/course/video*
// @run-at       document-end
// @grant        unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/411849/vclass_exam.user.js
// @updateURL https://update.greasyfork.org/scripts/411849/vclass_exam.meta.js
// ==/UserScript==


logger('info','Init: vclass injected.');

var _self = unsafeWindow,
$ = _self.$ || top.$;

//var outlineId = $("input#outlineId").val();

//var myplayer = $("#flowPlayerId");
String.prototype.endWith=function(str){
if(str==null||str==""||this.length==0||str.length>this.length){
  return false;}
if(this.substring(this.length-str.length)==str){
  return true;}
else{
  return false;}
return true;
}
String.prototype.startWith=function(str){
if(str==null||str==""||this.length==0||str.length>this.length)
{return false;}
if(this.substr(0,str.length)==str)
{ return true;}
else{
  return false;}
return true;
}

var vclass_realAnswer = []
//GM_setValue("realAnswer",vclass_realAnswer)

var vclass_realAS = {}




$(function(){
    setTimeout(function (){




    var patt1=new RegExp("/exam/examing/");
    var patt2=new RegExp("exam/finishExam.htm");
    var patt3=new RegExp("/exam/report/");
    var videoPage = new RegExp("/course/video");
    let location = window.location.href
    if (videoPage.test(location)){
        //视频页面 直接启用答题按钮

        $("#startExamId").css({"backgroundColor":"blue"});
        $("#startExamId").attr({"data-toggle":"modal","data-target":".practice-exampaper-modal"});

    }
       if(patt2.test(location)){
         //alert("结束页面")
         if(GM_getValue("realAnswer").length == 0){
             //没答案
             //alert("请点击左边答案解析")
             showMsg("请点击左边答案解析")
         }
         else if($('#wrongNo').text() === "0"){
             //alert("全对")
             //有答案了，应该是自动填充好进来的，清理掉
             vclass_realAnswer = []
             GM_setValue("realAnswer",vclass_realAnswer)
             showMsg("原有答案已清除")
         }
           //console.log($('#wrongNo').text())

     }
     if(patt3.test(location)){
         //alert("答案页面")
         if(GM_getValue("realAnswer").length == 0){
             //没答案，写进去
             $('.answer_value').each(function () {
                 vclass_realAnswer.push($(this).context.innerText)
             })
             GM_setValue("realAnswer",vclass_realAnswer)
             console.log(GM_getValue("realAnswer"))

             //alert("答案已加载")
             showMsg("答案已加载，请点击两次返回键回到答题页面")

         }
         else{

             //有答案了，应该是自动填充好进来的，清理掉
             //alert("clean data")
             showMsg("原有答案已清除")

             vclass_realAnswer = []
             GM_setValue("realAnswer",vclass_realAnswer)
         }

     }
     if(patt1.test(location)){
         //alert("考试页面")
        if(GM_getValue("realAnswer")===undefined){
            GM_setValue("realAnswer",vclass_realAnswer)
        }
         if(GM_getValue("realAnswer").length == 0){
             console.log("here",GM_getValue("realAnswer"))
             //alert("等待提交")
             showMsg("等待提交")
             //等待提交
         }
         else{
             //有答案了，自动填充
             vclass_realAnswer = GM_getValue("realAnswer")
             vclass_realAS = {}
             vclass_realAnswer.map((item, idx) => {
                 let vclass_answerSheetItem = new Object();
                 if (item.length == 1) {
                     //单选
                     vclass_answerSheetItem.answer = item
                     vclass_answerSheetItem.point = idx
                     vclass_realAS[idx] = vclass_answerSheetItem
                 }
                 else{
                     vclass_answerSheetItem.answer = item
                     vclass_answerSheetItem.question_type_id = 3
                     vclass_answerSheetItem.point = idx
                     vclass_realAS[idx] = vclass_answerSheetItem
                 }
             })


             //自动提交

             vclass_finishExam()
         }


     }

                 	}, 1000);



})


// Logger
function logger(type, msg){
    msg = "[vclass] "+msg;
    switch(type){
        case 'warn':
            console.warn(msg);
            break;
        case 'log':
            console.log(msg);
            break;
        case 'info':
            console.info(msg);
            break;
    }
}


function showMsg(output){
            var html = document.createElement('div');
            html.style.color = 'black'
            html.style.position = 'fixed';
            html.style.top = '10px';
            html.style.left = '10px';
            html.style.width = '150px'
            html.style.height = '80px'
            html.style.backgroundColor = 'rgba(0.2,0.2,0.2,0.2)'
            html.style.pointerEvents = 'none'
            html.style.zIndex = 9999;
            html.innerHTML='<div>'+output+'</div>'
            document.body.appendChild(html)
}

function vclass_finishExam() {
    var answerSheet = vclass_realAS
    var data = new Object();
    data.as = answerSheet;
    var timeStr = $("#exam-clock").text();
    var time = timeStr.split(":");
    var hours = parseInt(time[0]);
    var minutes = parseInt((Math.random()*100%20).toFixed());
    var seconds = parseInt((Math.random()*100%55).toFixed());
    data.duration = hours * 3600 + minutes * 60 + seconds;
    $("#question-submit button").attr("disabled", "disabled");
    var eeeeId = $("#eidspan").text();
    data.eid=eeeeId;
    $.ajax({
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        url: '/exam/ques.html',
        type: 'post',
        data : JSON.stringify(data),
        success:function (result) {
                $(window).unbind('beforeunload');
                util.success("交卷成功",function () {
                    var address = window.location.hostname;
                    var port = window.location.port;
                    var base = "http://"+address+":"+port+"/";
                    window.location.replace(base+'exam/finishExam.html');

                });
                util.success("交卷成功",function () {

                });
        },
        error:function () {
            alert("系统繁忙请稍后尝试");
        }
    });
}