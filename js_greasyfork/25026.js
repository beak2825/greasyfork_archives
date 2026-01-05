// ==UserScript==
// @name         Add12306Calender
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  将Gmail收到的12306邮件加入日历项
// @author       Formax
// @match        https://mail.google.com/*
// @match        https://gmail.com/*
// @match        https://www.gmail.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/25026/Add12306Calender.user.js
// @updateURL https://update.greasyfork.org/scripts/25026/Add12306Calender.meta.js
// ==/UserScript==

(function() {
    'use strict';
    jQuery(document).ready(function () {

        $(document).keydown(function(e){
            if((e.which == 49||e.which==16) && e.ctrlKey && e.shiftKey){
                var innerContent = $('.Bu')[0].innerHTML;
                var contt=new Object();
                try{
                    contt = decripCR(innerContent,contt);
                    var addUrl="https://www.google.com/calendar/render?action=TEMPLATE&text="+contt.title+"&dates="+contt.start+"/"+contt.end+"&details="+contt.remarkd+"&location="+contt.locat+"&sf=true&output=xml&ctz=Asia/Shanghai";
                    window.open(addUrl);
                }
                catch(e)
                {
                    console.log(e);
                }
            }
        });

        var decripCR = (function(innerHtm,calend){
            debugger;
            var numMatch = innerHtm.match(/EC\d{8}/g);
            var infoMatch = innerHtm.match(/1\..{20,100}检票口.{1,10}/g);
            if(infoMatch==null){
                infoMatch = innerHtm.match(/1\..{20,100}候车地点.{1,10}/g);
            }
            if(infoMatch==null){
                infoMatch = innerHtm.match(/1\..{20,100}票价.{1,50}/g);
            }
            var infoContents =infoMatch[0].split(',');
            if(infoContents.length==1){
                var infoContents =infoMatch[0].split('，');
            }
            var timeContents =infoContents[1].split('日');
            var mydate=new Date();
            var newdate;
            if(timeContents[0].length>5){
                var timeString = (timeContents[0].replace('年','-').replace('月','-')+" "+timeContents[1].split(':')[0]+":00").match(/\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2} \d{1,2}:\d{1,2}/);
                newdate = new Date(timeString[0]);
            }
            else{
                var stdate=timeContents[0].split('月');
                newdate= new Date(mydate.getFullYear(),stdate[0]-1,stdate[1],timeContents[1].split(':')[0]);
            }
            if(newdate<mydate){
                newdate.setFullYear(mydate.getFullYear()+1,newdate.getMonth(),newdate.getDate());
            }

            calend.start=newdate.getFullYear()+("0" + (newdate.getMonth()+1)).slice(-2)+("0" + newdate.getDate()).slice(-2)+"T"+("0" + newdate.getHours()).slice(-2)+"0000";
            var enddate = new Date(newdate);
            enddate.setHours(enddate.getHours()+1);
            calend.end   =  enddate.getFullYear()+("0" + (enddate.getMonth()+1)).slice(-2)+("0" + enddate.getDate()).slice(-2)+"T"+("0" + enddate.getHours()).slice(-2)+"0000";
            calend.locat = infoContents[2].split('—')[0]+"火车站";
            calend.title = infoContents[3];
            calend.remarkd ="订单号:"+numMatch[0]+", 座位号:"+infoContents[4]+infoContents[7];
            return   calend;
        });
    });
})();