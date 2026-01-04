// ==UserScript==
// @name         _Hisense_mx_modify
// @namespace    http://ysslang.space/
// @version      1.4.0
// @description  不断不断优化会议系统！！
// @author       ysslang
// @match        https://172.16.45.198/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33612/_Hisense_mx_modify.user.js
// @updateURL https://update.greasyfork.org/scripts/33612/_Hisense_mx_modify.meta.js
// ==/UserScript==

(function(){
    //导出文件表头
    var CSVTableTitle="技 术 支 持 工 作 日 志\n日期,受理人,所属园区,受理时间,用户姓名,所属公司,联系电话,	故障类别,故障描述,解决措施,是否重装系统\n";


    //初始化系统
    function initialize(){
        if(!localStorage.operator){localStorage.setItem('operator',prompt("请输入操作人姓名："));}
        if(!localStorage.LoginInfoUser){localStorage.setItem('LoginInfoUser',prompt("请输入登录用户名："));}
        if(!localStorage.LoginInfoPwd){localStorage.setItem('LoginInfoPwd',prompt("请输入登录密码："));}
        if(!localStorage.addr){localStorage.setItem('addr',prompt("请输入所在园区："));}
        if(!localStorage.mxCounts){localStorage.setItem('mxCounts',0);}
        if(localStorage.mxlog===""){localStorage.setItem('mxCounts',0);}
    }

    // 自动登录
    function AutoLogin(){
        document.getElementById('loginForm:emailAddress').value = localStorage.LoginInfoUser;
        document.getElementById('loginForm:password').value = localStorage.LoginInfoPwd;
        document.getElementById('loginForm:loginButton').click();
    }

    // 自动切换到“会议预定”
    function AutoClickConferenceReservations(){
        document.getElementById('navigationForm:submenu_view:conferencereservations_lnk').click();
    }

    //自动刷新出错页
    function ReloadPage(){
        document.location.href="https://172.16.45.198/mx/faces/Portal.jsp";
    }

    // “会议预定”列表首行加粗放大
    function EmphasizeFirstRow(){
        document.getElementById('contentForm:content_view:reservationResult_table:0:reservation_nameValue').style.font='normal bolder 20px arial,serif';
        document.getElementById('contentForm:content_view:reservationResult_table:0:reservation_profileValue').style.font='normal bolder 20px arial,serif';
        document.getElementById('contentForm:content_view:reservationResult_table:0:reservation_participantCodeValue').style.font='normal bolder 30px arial,serif';
    }
    // 优化“添加会议”页样式
    function StylizeFrame(){
        // 定义样式优化通用函数addStyle
        function addStyle(rules) {
            var styleElement = document.createElement('style');
            styleElement.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(styleElement);
            styleElement.appendChild(document.createTextNode(rules));
        }

        // “添加会议”页开启第二第三页，隐藏左侧导航栏，隐藏右侧非必填项
        document.getElementsByClassName('wizardForm')[0].childNodes[0].style.display='block';
        document.getElementsByClassName('wizardForm')[0].childNodes[1].style.display='block';
        document.getElementsByClassName('wizardForm')[0].childNodes[0].childNodes[1].style.display='none';
        document.getElementsByClassName('wizardForm')[0].childNodes[0].childNodes[2].style.display='none';
        document.getElementsByClassName('wizardForm')[0].childNodes[0].childNodes[3].style.display='none';
        document.getElementsByClassName('wizardForm')[0].childNodes[0].childNodes[4].childNodes[3].style.display='none';
        document.getElementsByClassName('wizardForm')[0].childNodes[0].childNodes[5].style.display='none';
        document.getElementsByClassName('wizardForm')[0].childNodes[0].childNodes[6].style.display='none';
        document.getElementsByClassName('wizardForm')[0].childNodes[0].childNodes[7].style.display='none';
        document.getElementsByClassName('wizardForm')[0].childNodes[0].childNodes[8].style.display='none';
        document.getElementsByClassName('wizardForm')[0].childNodes[0].childNodes[9].style.display='none';
        document.getElementsByClassName('wizardForm')[0].childNodes[0].childNodes[10].style.display='none';
        document.getElementsByClassName('wizardForm')[0].childNodes[0].childNodes[11].style.display='none';
        document.getElementsByClassName('wizardForm')[0].childNodes[1].childNodes[3].childNodes[3].style.display='none';
        document.getElementsByClassName('wizardForm')[0].childNodes[1].childNodes[4].style.display='none';
        document.getElementsByClassName('wizardForm')[0].childNodes[1].childNodes[5].style.display='none';
        document.getElementById('addReservationForm:schedulingDetails:chooseAdate').style.display='none';

        // 样式调整
        var strStyle=
             //整体框架调整
            ".wizardContentLeft,.wizardFormTitleSpace,.wizardFormTitleGraphic,.wizardFormTitleText,/*.wizardFormTitle,*/.lightBlueLine,.wizardDivBack,.wizardDivContinue,.wizardDivCancel,.smallOutputLabel{display:none;}\n"+
            ".wizardOverallContainer{max-width:640px;max-height:510px;padding:20px;background-color:#f0f0f0;border-radius:8px;margin-top:10px;margin-left:auto;margin-right:auto;}\n"+
            ".width{min-width:480px;max-width:800px;}\n"+
            ".wizardContentRight{width:100%;height:360px;background:#f0f0f0;}\n"+
            ".wizardOverallHeader{display:block;height:60px;width:600px;float:none;margin-left:auto;margin-right:auto;}\n"+
            ".wizardOverallFooter{display:block;width:60%;float:none;border-radius:4px;border-bottom:0px;padding:0px;margin-top:396px;margin-left:auto;margin-right:auto;}\n"+
            "\n"+
            //表单分布调整
            ".wizardFormTitle{padding-bottom:5px;}\n"+
            ".wizardFormContainer{background-image:none;}\n"+
            ".wizardForm{width:100%;margin-left:10px;}\n"+
            ".wizardErrors{height:auto;}\n"+
            ".wizardErrorTextarea{width:620px;height:40px;font-size:16px;}\n"+
            ".wizardFormLine{line-height:3.5em;}\n"+
            ".outputLabel{background-color:transparent;font-size:20px;color:#000;font-weight:bolder;padding:0px 20px;}\n"+
            ".inputButton{background-color:transparent;font-size:24px;width:auto;height:auto;display:block;margin-left:auto;margin-right:auto;}\n"+
            "input,textarea,select{border-radius:3px;height:50px;background-color:transparent;border:0;font-size:20px;color:#000000;padding:0;}\n"+
            ".wizardMid-colfirst{display:none}\n"+
            ".wizardMid-col3-2{width:37%;font-weight:bolder;}\n"+
            ".wizardMid-col3-3{border:0px solid rgba(0,0,0,0);border-radius:3px;height:50px;vertical-align:middle;padding:0px;width:62%;}\n"+
            ".wizardMid-col4-2{width:37%;}\n"+
            ".wizardMid-col4short-3{border:0px solid rgba(0,0,0,0);border-radius:3px;height:50px;vertical-align:middle;padding:0px;width:55%;}\n"+
            ".wizardDivFinish{display:block;float:none;width:100%;padding:0;margin:0;border:0;}\n"+
            "\n"+
            //细节调整
            "#addReservationForm\\:generalSettings\\:conferenceNameInput{border:0.5px solid rgba(0,0,0,0.2);vertical-align:middle;padding:0px 16px;width:88.5%;}\n"+
            "#addReservationForm\\:generalSettings\\:seatsInput{border:0.5px solid rgba(0,0,0,0.2);vertical-align:middle;padding:0px 16px;width:100%;}\n"+
            "#addReservationForm\\:schedulingDetails\\:wizardConferenceStartDateMonthList{border:0.5px solid rgba(0,0,0,0.2);text-align-last:center;vertical-align:middle;width:40%;}\n"+
            "#addReservationForm\\:schedulingDetails\\:wizardConferenceStartDateDayList{border:0.5px solid rgba(0,0,0,0.2);text-align-last:center;vertical-align:middle;width:30%;}\n"+
            "#addReservationForm\\:schedulingDetails\\:conferenceNameStartDateYear{border:0.5px solid rgba(0,0,0,0.2);text-align:center;vertical-align:middle;width:27.3%;}\n"+
            "#addReservationForm\\:schedulingDetails\\:wizardConferenceStartTimeHour{border:0.5px solid rgba(0,0,0,0.2);text-align-last:center;vertical-align:middle;width:30%;}\n"+
            "#addReservationForm\\:schedulingDetails\\:wizardConferenceStartTimeMidcolon{font-size:32px;margin:3.5%;padding:0;}\n"+
            "#addReservationForm\\:schedulingDetails\\:wizardConferenceStartTimeMinute{border:0.5px solid rgba(0,0,0,0.2);text-align-last:center;vertical-align:middle;width:30%;}\n"+
            "#addReservationForm\\:schedulingDetails\\:wizardConferenceStartTimeAMPM{border:0.5px solid rgba(0,0,0,0.2);text-align-last:center;vertical-align:middle;width:27.3%;}\n"+
            "#addReservationForm\\:schedulingDetails\\:wizardConferenceEndTimeHour{border:0.5px solid rgba(0,0,0,0.2);text-align-last:center;vertical-align:middle;width:30%;}\n"+
            "#addReservationForm\\:schedulingDetails\\:wizardConferenceEndTimeMidcolon{font-size:32px;margin:3.5%;padding:0;}\n"+
            "#addReservationForm\\:schedulingDetails\\:wizardConferenceEndTimeMinute{border:0.5px solid rgba(0,0,0,0.2);text-align-last:center;vertical-align:middle;width:30%;}\n"+
            "#addReservationForm\\:schedulingDetails\\:wizardConferenceEndTimeAMPM{border:0.5px solid rgba(0,0,0,0.2);text-align-last:center;vertical-align:middle;width:27.3%;}\n"+
            "#addReservationForm\\:schedulingDetails\\:wizardConferenceDuration{border:0.5px solid rgba(0,0,0,0.2);text-align-last:center;vertical-align:middle;width:110.5%;}\n"+
            "#addReservationForm\\:conferenceReservationWizardButton_finish{;height:54px;font-size:32px;}\n"+
            "\n"+
            "');";
        //应用调整
        addStyle(strStyle);

        //几处bug修改
        document.getElementById('addReservationForm:generalSettings:seatsInput').style='';
        document.getElementsByClassName('wizardMid-col3-3')[9].childNodes[1].id='addReservationForm:schedulingDetails:wizardConferenceStartTimeMidcolon';
        document.getElementsByClassName('wizardMid-col3-3')[10].childNodes[1].id='addReservationForm:schedulingDetails:wizardConferenceEndTimeMidcolon';

        // 汉化
        document.getElementById('addReservationForm:generalSettings:conferenceNameInput').placeholder='会议名';
        document.getElementsByClassName('wizardMid-col3-2')[0].childNodes[0].innerHTML="会议名称(Alt+1)";
        document.getElementsByClassName('wizardMid-col4-2')[1].childNodes[0].innerHTML="与会人数(Alt+2)";
        document.getElementsByClassName('wizardMid-col3-2')[8].childNodes[0].innerHTML="开始日期(Alt+3)";
        document.getElementsByClassName('wizardMid-col3-2')[9].childNodes[0].innerHTML="开始时间(Alt+4)";
        document.getElementsByClassName('wizardMid-col3-2')[10].childNodes[0].innerHTML="结束时间(Alt+5)";
        document.getElementsByClassName('wizardMid-col4-2')[2].childNodes[0].innerHTML="持续时间(Alt+6)";
        document.getElementById('addReservationForm:conferenceReservationWizardButton_finish').value="确认(Alt+7)";
    }

    //抓取“添加会议”页信息并临时存入本地存储
    function Recordmx(){
        var mxName = document.getElementById('addReservationForm:generalSettings:conferenceNameInput').value;
        var mxSeats = document.getElementById('addReservationForm:generalSettings:seatsInput').value;
        var mxStartMon = document.getElementById('addReservationForm:schedulingDetails:wizardConferenceStartDateMonthList').value;
        var mxStartDay = document.getElementById('addReservationForm:schedulingDetails:wizardConferenceStartDateDayList').value;
        var mxStartYear = document.getElementById('addReservationForm:schedulingDetails:conferenceNameStartDateYear').value;
        var mxStartH = document.getElementById('addReservationForm:schedulingDetails:wizardConferenceStartTimeHour').value;
        var mxStartM = document.getElementById('addReservationForm:schedulingDetails:wizardConferenceStartTimeMinute').value;
        var mxStartP = document.getElementById('addReservationForm:schedulingDetails:wizardConferenceStartTimeAMPM').value;
        var mxEndH = document.getElementById('addReservationForm:schedulingDetails:wizardConferenceStartTimeHour').value;
        var mxEndM = document.getElementById('addReservationForm:schedulingDetails:wizardConferenceEndTimeMinute').value;
        var mxEndP = document.getElementById('addReservationForm:schedulingDetails:wizardConferenceEndTimeAMPM').value;
        var mxDuration = document.getElementById('addReservationForm:schedulingDetails:wizardConferenceDuration').value;
        var RecTime = new Date();

        var mxerName = mxName.split(/[0123456789-]+/)[1];
        var mxerComp = mxName.split(/[0123456789-]+/)[0];
        var mxStartDate = mxStartYear +"/"+ mxStartMon +"/"+ mxStartDay;
        var mxStartTime = mxStartH +":"+ mxStartM +" "+ mxStartP;
        var mxEndTime = mxEndH +":"+ mxEndM +" "+ mxEndP;
        var mxDetail = mxSeats+"seats from "+ mxStartTime;
        if(mxDuration){mxDetail += " at "+ mxStartDate +" for "+ mxDuration;}
        else{mxDetail += " to "+ mxEndTime +" at "+ mxStartDate;}

        var mxRecord = RecTime.getFullYear()+"/"+(RecTime.getMonth()+1)+"/"+RecTime.getDate()+","+localStorage.operator+","+localStorage.addr+","+RecTime.getHours()+":"+RecTime.getMinutes()+","+mxerName+","+mxerComp+",,,电话会议,"+mxDetail+",";
        localStorage.setItem('mxRecord',mxRecord);
        localStorage.setItem('lastmx',mxName);

        setTimeout(function(){
            if((document.getElementById("addReservationForm:conferenceReservationWizardButton_finish")!==null)&&(document.getElementById("addReservationForm:errorTextArea"))===null){
                self.close();
            }else{
                localStorage.setItem('mxRecord',"");
                localStorage.setItem('lastmx',"");
            }
        },2000);
    }

    //抓取会议密码并以csv格式存入本地存储
    function Logmx(){
        if(localStorage.lastmx){
            ReloadPage();
            var psCode="", mxLast = localStorage.lastmx;
            for(var i=0, tbRows=document.getElementById('contentForm:content_view:conferenceReservationsPanel4_searchRowsPerPageInput').value;i<tbRows;i++){
                if(document.getElementById('contentForm:content_view:reservationResult_table:'+i+':reservation_nameValue').innerHTML===mxLast){
                    psCode = document.getElementById('contentForm:content_view:reservationResult_table:'+i+':reservation_participantCodeValue').innerHTML;
                    var mxRecordFull = localStorage.mxRecord + psCode +",\n";
                    var mxlog = (localStorage.getItem("mxlog")!==null)?(localStorage.mxlog + mxRecordFull):(mxRecordFull);
                    localStorage.setItem('mxlog',mxlog);
                    localStorage.setItem('mxCounts',parseInt(localStorage.mxCounts)+1);
                    break;
                }
            }

        }
        localStorage.setItem('lastmx',"");
        localStorage.setItem('mxRecord',"");
    }

    //导出日志为csv文件
    function ExportLogToCSV(){
        if(localStorage.mxlog){
            var ddate = new Date();
            var fileName = "工作日志"+ddate.getYear()+(ddate.getMonth()+1)+ddate.getDate()+"-"+ddate.getTime()+".csv";
            var data = CSVTableTitle+localStorage.mxlog;
            data = encodeURIComponent(data);
            var uri = 'data:text/plain;charset=utf-8,\ufeff' + data;
            var downloadLink = document.createElement("a");
            downloadLink.href = uri;
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            if(confirm("是否清空日志？")){
                localStorage.setItem('mxlog',"");
                localStorage.setItem('mxCounts',0);
            }
        }else{
            alert("并没有日志可以导出。。。");
        }
    }

    //修改出错提醒
    function AlertErrorMsg(){
        if(document.getElementById('addReservationForm:errorTextArea')){
            var errText = document.getElementById('addReservationForm:errorTextArea').childNodes[0].data;
            if(errText.match('General Settings: Conference Name')){
                document.getElementsByClassName('wizardFormLine')[0].style.background='violet';
                document.getElementById('addReservationForm:generalSettings:conferenceNameInput').select();
                document.getElementById('addReservationForm:generalSettings:conferenceNameInput').focus();
                document.getElementById('addReservationForm:generalSettings:conferenceNameInput').style.background='#f00';
            }
            if(errText.match('General Settings: The number of participants')){
                document.getElementsByClassName('wizardFormLine')[4].style.background='violet';
                document.getElementById('addReservationForm:generalSettings:seatsInput').select();
                document.getElementById('addReservationForm:generalSettings:seatsInput').focus();
                document.getElementById('addReservationForm:generalSettings:seatsInput').style.background='#f00';
            }
            if(errText.match('First Date Time')){
                document.getElementsByClassName('wizardFormLine')[10].style.background='violet';
                document.getElementsByClassName('wizardFormLine')[11].style.background='violet';
                document.getElementById('addReservationForm:schedulingDetails:wizardConferenceStartTimeAMPM').focus();
                document.getElementById('addReservationForm:schedulingDetails:wizardConferenceStartDateDayList').style.background='#f66';
                document.getElementById('addReservationForm:schedulingDetails:wizardConferenceStartTimeAMPM').style.background='#f00';
            }
            if(errText.match('Not enough free ports in Reserved pool')){
                document.getElementsByClassName('wizardFormLine')[4].style.background='violet';
                document.getElementsByClassName('wizardFormLine')[11].style.background='violet';
                document.getElementsByClassName('wizardFormLine')[12].style.background='violet';
                document.getElementById('addReservationForm:schedulingDetails:wizardConferenceStartTimeMinute').focus();
                document.getElementById('addReservationForm:schedulingDetails:wizardConferenceStartTimeMinute').style.background='#f00';
            }
            if(errText.match('Scheduling Details: The specified End Time must have a value where the duration is between')){
                document.getElementsByClassName('wizardFormLine')[13].style.background='violet';
                document.getElementById('addReservationForm:schedulingDetails:wizardConferenceDuration').focus();
                document.getElementById('addReservationForm:schedulingDetails:wizardConferenceDuration').style.background='#f00';
            }
        }
    }

    initialize();
    // 触发动作
    if(document.getElementById('loginForm')){
        AutoLogin();
    }
    if(document.getElementById('contentForm:content_view:myaccount')){
        AutoClickConferenceReservations();
    }
    if(document.title.match('Apache Tomcat/5.5 - Error report')){
        ReloadPage();
    }
    if(document.getElementById('contentForm:content_view:reservationResult_table')){
        EmphasizeFirstRow();
        Logmx();
    }
    if(window.location.pathname.match('popups/AddReservation.jsp')){
        window.onload = StylizeFrame();
        document.getElementById('addReservationForm:generalSettings:conferenceNameInput').select();
        document.getElementById('addReservationForm:generalSettings:conferenceNameInput').focus();
        document.getElementById('addReservationForm').addEventListener('submit',function(){Recordmx();});
    }
    if(document.getElementById('addReservationForm:errorTextArea')){
               AlertErrorMsg();
    }

    // 设置快捷键
    window.addEventListener('keydown', function(event) {
        //alert(event.keyCode);
        if(event.keyCode==65&&event.altKey){//Alt+A 添加会议
            document.getElementById('contentForm:content_view:conferenceReservationsCommandButtons_add').click();
            return false;
        }else if((event.keyCode==49&&event.altKey)||(event.keyCode==97&&event.altKey)){//Alt+1 会议名
            document.getElementById('addReservationForm:generalSettings:conferenceNameInput').select();
            document.getElementById('addReservationForm:generalSettings:conferenceNameInput').focus();
            document.getElementById('addReservationForm:generalSettings:conferenceNameInput').style.background='#faa';
            return false;
        }else if((event.keyCode==50&&event.altKey)||(event.keyCode==98&&event.altKey)){//Alt+2 参会人数
            document.getElementById('addReservationForm:generalSettings:seatsInput').select();
            document.getElementById('addReservationForm:generalSettings:seatsInput').focus();
            document.getElementById('addReservationForm:generalSettings:seatsInput').style.background='#faa';
            return false;
        }else if((event.keyCode==51&&event.altKey)||(event.keyCode==99&&event.altKey)){//Alt+3 开始日期
            document.getElementById('addReservationForm:schedulingDetails:wizardConferenceStartDateDayList').focus();
            document.getElementById('addReservationForm:schedulingDetails:wizardConferenceStartDateDayList').value ++;
            document.getElementById('addReservationForm:schedulingDetails:wizardConferenceStartDateDayList').style.background='#faa';
            return false;
        }else if((event.keyCode==52&&event.altKey)||(event.keyCode==100&&event.altKey)){//Alt+4 开始时间
            document.getElementById('addReservationForm:schedulingDetails:wizardConferenceStartTimeHour').focus();
            document.getElementById('addReservationForm:schedulingDetails:wizardConferenceStartTimeHour').style.background='#faa';
            return false;
        }else if((event.keyCode==53&&event.altKey)||(event.keyCode==101&&event.altKey)){//Alt+5 结束时间
            document.getElementById('addReservationForm:schedulingDetails:wizardConferenceEndTimeHour').focus();
            document.getElementById('addReservationForm:schedulingDetails:wizardConferenceEndTimeHour').style.background='#faa';
            return false;
        }else if((event.keyCode==54&&event.altKey)||(event.keyCode==102&&event.altKey)){//Alt+6 持续时间
            document.getElementById('addReservationForm:schedulingDetails:wizardConferenceDuration').focus();
            document.getElementById('addReservationForm:schedulingDetails:wizardConferenceDuration').value="2h";
            document.getElementById('addReservationForm:schedulingDetails:wizardConferenceDuration').style.background='#faa';
            return false;
        }else if((event.keyCode==55&&event.altKey)||(event.keyCode==103&&event.altKey)||(event.keyCode==13&&event.ctrlKey)||(event.keyCode==90&&event.ctrlKey&&event.altKey)){//Alt+7或Enter或Ctrl+Alt+Z 提交
            document.getElementById('addReservationForm:conferenceReservationWizardButton_finish').click();
            return false;
        }else if(event.keyCode==69&&event.ctrlKey&&event.altKey){//Ctrl+Alt+E 导出
            ExportLogToCSV();
            return false;
        }
    });
})();