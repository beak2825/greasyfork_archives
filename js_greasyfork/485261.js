// ==UserScript==
// @name         翼展工具
// @namespace    http://tampermonkey.net/
// @version      2024-01-21-1414
// @description  Help Me!
// @author       Ziten
// @match        https://www.lifeccp.com/portal4/layout/task/diagnose*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      none
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/485261/%E7%BF%BC%E5%B1%95%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/485261/%E7%BF%BC%E5%B1%95%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var try_count=1;
    var auto_proc=false;
    var in_processing=false;
    var last_proc_date=0;
    var hist_display_html="";
    var hist_finish_list=[];
    var hist_finish_str="";
    var checkbox_wait_report;
    const ewmxs_time_id = setInterval( function () {
        var bx=$("div.ant-form-item-control:contains('待报告')");
        var do_start_proc=false;
        if(bx.size()==1)
        {
            var lst=bx.find(".ant-checkbox-input");
            var checked_count=0;
            var wait_report_checked=false;
            if(lst.length==5)
            {
                for(var i=0;i<lst.length;i++)
                {
                    if(lst.eq(i).attr("ng-reflect-model")=="true")
                    {
                        checked_count++;
                        if(i==0) wait_report_checked=true;
                    }
                }
                checkbox_wait_report=lst.eq(0);
                if(checked_count==0)
                {
                    lst.eq(0).click();
                }
                else if(checked_count==1&&wait_report_checked)
                {
                    if(auto_proc==true)
                    {
                        do_start_proc=true;
                        if(in_processing==false)
                        {   proc();}
                        else
                        {
                            var nowDate=new Date();
                            if(nowDate-last_proc_date>10000) // 大于 10 秒
                            { proc(); }
                        }
                    }
                }
            }
         }
         var lb_out=$("#extlb_out");
         if(do_start_proc==true)
         {
              if(lb_out.text()!="正在运行中")  lb_out.text("正在运行中");
         }
         else
         {
             if(lb_out.text()!="已停止")  lb_out.text("已停止");
             $("#extcb_run").prop("checked",false);
             auto_proc=false;
         }
       }, 500);


    function addbtn()
    {
        var append_str=`<div id="extbtn_proc" style="display:block;color:#FFD700;width:260px; height:30px; padding:1px 7px 7px 7px; position:fixed; top:10px;left:45%;z-index: 9999;">
                      <input id="extcb_run" style="cursor:pointer" type="checkbox"/><b>自动抢单</b>&nbsp;&nbsp;&nbsp;
                      <input id="extcb_speech" style="cursor:pointer" type="checkbox" checked/><b>通知音</b>&nbsp;&nbsp;&nbsp;
                      <label id="extlb_out" style="color:#7CFC00;font-weight:normal"></label>
                      </div>
                      <audio id="ext_audio_01" autoplay src="data:audio/mpeg;base64,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VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NIxPshk83hQhhGgVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NIxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NIxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NIxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NIxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NIxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NIxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NIxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NIxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NIxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NIxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NIxHwAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV" >
                      `;

        $("body").append(append_str);

        $("#extcb_run").click(function(){
            if($(this).prop("checked")){ auto_proc=true; }else{ auto_proc=false; }
        });
        $("#extcb_speech").click(function(){
            //$("#ext_audio_01")[0].play();
        });
    }
    addbtn();
    function playnotice()
    {
        if($("#extcb_speech").prop("checked"))
        {
            $("#ext_audio_01")[0].play();
        }

    }
    function proc()
    {
        var ss=sessionStorage.getItem('userInfo');
        var current_jo=JSON.parse(ss);
        //alert(jo.sessionId);
        var tm=new Date();
        var today_date_str=tm.getFullYear().toString().padStart(4, '0')+'-'+(tm.getMonth() + 1).toString().padStart(2, '0')+'-'+tm.getDate().toString().padStart(2, '0');
        tm.setDate(tm.getDate() - 2);
        var before_date_str=tm.getFullYear().toString().padStart(4, '0')+'-'+(tm.getMonth() + 1).toString().padStart(2, '0')+'-'+tm.getDate().toString().padStart(2, '0');
        in_processing=true;
        //alert(today_date_str+" "+before_date_str);
        $.ajax({
            type: "GET",
            contentType: "text/json",
            url: " https://www.lifeccp.com/api/diagnoseService/tasks/diagnosedoctor?caseUid=&patientName=&uploadHospitalName=&patientNumber=&modality=&caseStatus=1&groupId=&caseType=&submitTimeStart="+today_date_str+"&submitTimeEnd="+today_date_str+"&examTimeStart="+before_date_str+"&examTimeEnd="+today_date_str+"&diagnoseUser=&showOtherLocked=0&currentPage=1&pageSize=40",
            headers: {
               "Source": '501',
               'Content-Type': 'application/json',
               'Sessionid':current_jo.sessionId
            },
            data: "",
            dataType: 'json',
            cache: false,
            success: function (res){
                var i,lst,v;
                var last_proc_date=new Date();
                var my_locked_count=0;
                if(res.total>0)
                {
                    lst=res.list;

                    for(i=0;i<lst.length;i++)
                    {
                        if(lst[i].status==0 && lst[i].locked==0) // &&lst[i].modality=="CT"
                        {
                           var submitDate=new Date(lst[i].submitTime);
                           var nowDate=new Date();
                           //var nowDate=new Date("2024-01-19 00:18:00");
                           if(nowDate-submitDate<1000*60*20 && hist_finish_list.indexOf(lst[i].caseId)<0)
                           {
                               console.log("match - submit:"+submitDate.toLocaleString());
                               console.log("match -    now:"+nowDate.toLocaleString());
                               grabcase(lst[i].caseId,current_jo.sessionId);
                           }
                        }
                        else if(lst[i].locked==1 && lst[i].lockUserId==current_jo.id)
                        {
                            my_locked_count++;
                        }
                    }

                    if(my_locked_count>0)
                    {
                        v=hist_finish_list.join();
                        if(v!=hist_finish_str)
                        {
                            hist_finish_str=v;
                            playnotice();
                            try
                            {
                                if(checkbox_wait_report.is(":visible"))
                                {
                                    checkbox_wait_report.click();
                                }
                            }catch(err){}
                        }
                        //console.log("my_locked_count="+my_locked_count);
                    }

                }
                //alert(res.list.length+"/"+res.total);
            },
            complete: function (xhr,ts){
                in_processing=false;
            }
        });
    };

    function grabcase(caseid,sessionid)
    {
        $.ajax({
            type: "POST",
            contentType: "text/json",
            url: "https://www.lifeccp.com/api/grabService/cases/"+caseid+"/grab",
            headers: {
               "Source": '501',
               'Content-Type': 'application/json',
               'SESSIONID':sessionid,
               'Accept':'application/json, text/plain, */*'
            },
            data: "{}",
            dataType: 'json',
            cache: false,
            success: function (res){
                console.log("grab ["+caseid+"] finish");
            },
            complete: function (xhr,ts){
                hist_finish_list.push(caseid);
            }
        });
    }

    // Your code here...
})();