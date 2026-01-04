// ==UserScript==
// @name        xuxx test
// @match       *://uc.dlysjg.td.gd.gov.cn/*
// @grant       GM_notification
// @require     http://code.jquery.com/jquery-1.12.4.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @description  个人使用，获取信息
// @version 0.0.1.20220824123639
// @namespace https://greasyfork.org/users/157971
// @downloadURL https://update.greasyfork.org/scripts/450094/xuxx%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/450094/xuxx%20test.meta.js
// ==/UserScript==
//<code>@description</code> 
var timel=1000*12*60;
var synth = window.speechSynthesis;
var voices = new window.SpeechSynthesisUtterance();
voices.lang = "zh-CN";
GM_setValue("play", false)
var th;
GM_notification ( {
                                  title: '运行正常', text:  Date(),image:'http://uc.dlysjg.td.gd.gov.cn/img/level.35336bcf.png',timeout:1000*12-1   });
var intervalId = window.setInterval(function(){
    var login=localStorage.getItem("pigx-access_token");
    var token="";
    if(login){
        token=JSON.parse(login).content;
        console.log(token);


    console.log(localStorage.getItem("pigx-access_token"));
    var date=new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    month = (month > 9) ? month : ("0" + month);
   day = (day < 10) ? ("0" + day) : day;
    var nowday= date.getFullYear()+"-"+(month)+"-"+day;
    console.log(day);
    var url="http://uc.dlysjg.td.gd.gov.cn/alarm/alarmCentre/page?current=1&size=10&driverName=&areaId=&areaIds=&ownerId=&vehicleNo=&czStatus&dbStatus=&threshold=&vehicleColor=&isdb=&shStatus=&clStatus=&wbStatus=&vehicleType=&alarmCode=&alarmLevel=&thirdPartyId=&isProof=&czTypeSource=&isResult=&beginAlarmTime="+nowday+"&endAlarmTime="+nowday;
     url="http://uc.dlysjg.td.gd.gov.cn/alarm/alarmCentre/page?current=1&size=10&driverName=&areaId=&areaIds=&ownerId=&vehicleNo=&czStatus=0&dbStatus=&threshold=&vehicleColor=&isdb=&shStatus=&clStatus=&wbStatus=&vehicleType=&alarmCode=&alarmLevel=&thirdPartyId=&isProof=&czTypeSource=&isResult=&beginAlarmTime="+nowday+"&endAlarmTime="+nowday;
    console.log(url);
    console.log(date.toLocaleDateString())



    var httpRequest = new XMLHttpRequest();//第一步：建立所需的对象
       httpRequest.open('GET', url, true);//第二步：打开连接  将请求参数写在url中  ps:"http://localhost:8080/rest/xxx"
    httpRequest.setRequestHeader ("Connection","keep-alive");
httpRequest.setRequestHeader ("Accept","application/json, text/plain, */*");
httpRequest.setRequestHeader ("Authorization","Bearer "+token);
httpRequest.setRequestHeader ("TENANT-ID","6");
httpRequest.setRequestHeader ("User-Agent","Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36");
httpRequest.setRequestHeader ("Accept-Encoding","gzip, deflate");
httpRequest.setRequestHeader ("Accept-Language","zh-CN,zh;q=0.9,en;q=0.8");

       httpRequest.send();//第三步：发送请求  将请求参数写在URL中
        /**
         * 获取数据后的处理程序
*/
   // console.log(httpRequest.responseText);
voices.text="你有报警信息待处理！"
var pl=GM_getValue("play", true)
pl=!pl;
    GM_setValue("play", pl)



        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var json = JSON.parse(httpRequest.responseText);//获取到json字符串，还需解析
                console.log(json);
                console.log(pl);
                if(json.code==0&&json.data.total>0){
                     console.log(json.data.records[0].alarmStartTime);
                     var alarmt=new Date(json.data.records[0].alarmStartTime);
                             //alarmt=new Date("2022-08-24 18:00:59");
                       alarmt= alarmt.setHours(alarmt.getHours() + 1);//+1个小时；
                       console.log(new Date(alarmt));
                       alarmt=(alarmt-new Date())/1000;//现在时间差多少秒
                       //console.log(alarmt/1000);
                        if(alarmt<111200&&alarmt>(-3600)) {//秒
                            console.log(alarmt); //1200秒，即20分钟
                              GM_notification ( {
                                  title: '报警处理', text:  Date(),timeout:timel-1,
                              ondone:()=>window.clearInterval(th)});
                            window.clearInterval(th);
                            th=window.setInterval(function(){synth.speak(voices);}, 5000); //声音简隔



                                        }else  window.clearInterval(th);
                }else  GM_notification ( {
                                  title: '没有报警', text:  '正在运行'+Date(),timeout:timel-1,
                              ondone:()=>window.clearInterval(th)});
            }
        };


}
else GM_notification ( {
                                  title: '未登陆，请先登陆', text:  Date(),timeout:1000*12-1,
                              ondone:()=>window.clearInterval(th)});


}, timel); //10分钟