// ==UserScript==
// @name         badminton place get
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  get badminton place
// @author       haoxinren
// @match        http://202.117.17.144
// @match        http://202.117.17.144/index.html
// @match        http://202.117.17.144/product/show.html?id=103
// @match        http://202.117.17.144/order/show.html?id=103
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441127/badminton%20place%20get.user.js
// @updateURL https://update.greasyfork.org/scripts/441127/badminton%20place%20get.meta.js
// ==/UserScript==
/**
 * FOR THE TAMPERMONKEY
 */
 (function() {
    'use strict';

    var serverTime = new Date($.ajax({async:false}).getResponseHeader("Date"));//服务器时间
    var currentTime = new Date();//本地时间
    var currentTimeStr = currentTime.toString();
    var restString = " 08:40:01 GMT+08:00";
    var targetTimeStr = currentTimeStr.substring(0,15)+restString;
    var targetTime = new Date(targetTimeStr);//目标时间(根据今天的时间自动更新);
    console.log(targetTime);
    var calenderLoc = calcCalenderLoc(targetTime);
    console.log(calenderLoc);
    console.log(` div.calendar-body > table > tbody > tr:nth-child(${calenderLoc.col}) > td:nth-child(${calenderLoc.row}) `);
    if(window.location.href=="http://202.117.17.144/index.html"){
        // window's location
        console.log("==============window.location.href==============");
        console.log(window.location.href);
        var restTime=getRestTime(targetTime);
        if(restTime>1000){
            console.log("======相差时间大于1s，设置等待时间======")
            setTimeout(()=>{
                location.reload();
            },restTime-1400);
        }else{
            restTime=getRestTime(targetTime);
            console.log("======相差时间小于1s，设置等待时间======")
            console.log(`相差时间:${restTime}`);
            if(restTime<0){
                document.querySelector("#content > div.boxes.relative > ul.item-2-ul > li:nth-child(14) > dl > dt > a > div > img").click();
            }
            else{
                console.log("======相差时间在0s与1s之间，设置等待时间======")
                setTimeout(()=>{
                    location.reload();
                },restTime);
            }
        }
    }
    else if(window.location.href=="http://202.117.17.144/product/show.html?id=103"){
        if(Math.abs(serverTime.getTime()-currentTime.getTime())>3*60*1000){//本地时间与服务器时间校核，当大于3分钟的时候才通过服务器时间进行操作
            //进行服务器时间的操作
            console.log("===本地校核开始===");
        }
        else{//直接通过本地时间进行操作
        //select date
        //make it input...
        //设定时间对齐
            var restTime=getRestTime(targetTime);
            console.log("======本地时间操作======")
            console.log(`相差时间:${restTime}`);
            if(restTime>1000){
                console.log("======相差时间大于1s，设置等待时间======")
                setTimeout(()=>{
                    location.reload();
                },restTime-1400);
            }
            else{
                restTime=getRestTime(targetTime);
                console.log("======相差时间小于1s，设置等待时间======")
                console.log(`相差时间:${restTime}`);
                if(restTime<0){
                    console.log("======！！！！！开始抢！！！！！======")
                    console.log(`相差时间:${restTime}`);
                    document.querySelector("#day > dd > span > span > a").click()    //点击日历图标
                    document.querySelector(` div.calendar-body > table > tbody > tr:nth-child(${calenderLoc.col}) > td:nth-child(${calenderLoc.row})  `).click();
                    //select seat
                    //document.querySelector("#time_no > span:nth-child(1)").click();
                    //两种不同的元素，对其进行判断
                    //======生产时将其注释去除=========
                    //select time
                    // 删除下拉菜单校验界面
                    document.querySelector("#time_no > span > span > a").click()        //下拉菜单
                    if(document.querySelector("#_easyui_combobox_i1_10")!=null){
                        document.querySelector("#_easyui_combobox_i1_10").click();
                    }
                    else{
                        document.querySelector("#_easyui_combobox_i2_10").click();
                    }
                    //======生产时将其注释去除=========
                    // if(document.querySelector("#time_no > span > span > a")!=null){
                    //     document.querySelector("#time_no > span > span > a").click()
                    //     document.querySelector("#_easyui_combobox_i1_10").click();          //选择场次  晚上八点
                    // }
                    // else{
                    //     document.querySelector("#time_no > span:nth-child(10)").click(); //选择场次  //晚上8点
                    // }
                    document.querySelector("#seat_1").click();//场地6
                    //confirm
                    document.querySelector("#reserve").click();
                    //验证码界面校核                    
                }
                else{
                    console.log("======相差时间在0s与1s之间，设置等待时间======")
                    setTimeout(()=>{
                        location.reload();
                    },restTime);
                }
            }

        }
    }
    
    if(window.location.href=="http://202.117.17.144/order/show.html?id=103"){
        yzmWindow();
        console.log("yzm");
        var img = document.querySelector("#typecode > span > img");     //应该是图片不可以跨域访问导致的问题
       
        // img.crossOrigin = "anonymous";
        // var dataURL = getBase64Image (img);
        // img.setAttribute("crossOrigin", "anonymous");
        // console.log(dataURL);

        var url = downloadIamge(img.src);
  


        //验证码框输入值
    }

    //document.querySelector("#_easyui_textbox_input5");          //日期框
    //获取时间差值
    function getRestTime(targetTime){
        currentTime=new Date();
        var restTime=targetTime.getTime()-currentTime.getTime();
        return restTime;
    }

    //计算目标日期在日历上的位置（5，3）
    //Tdate  ---->  Date类型
    function calcCalenderLoc(Tdate){
        var calendarLoc={
            row:0,
            col:0
        };
        // 计算一天后的星期和日期
        calendarLoc.row = Tdate.getDay();
        if (calendarLoc.row+1>=7){
            calendarLoc.row = (calendarLoc.row+1)%7+2;
        }
        else{
            calendarLoc.row = calendarLoc.row + 2+1;
        }
        //计算一天后在日历表上的日期行数 
        var tommorowDay = 0;
        if(calendarLoc.row == 1){
            tommorowDay = 7;
        }
        else{
            tommorowDay = calendarLoc.row - 1;
        }

        var tommorow =  Tdate.getDate()+1;
        var a = tommorow % 7;
        var OneDay = 0;
        if (tommorowDay >= a ){
            OneDay = a + 7 -tommorowDay + 1;
        }
        else{
            OneDay = a - tommorowDay + 1;
        }
        calendarLoc.col = Math.floor((OneDay + tommorow)/7+1);
        console.log(calendarLoc);
        return calendarLoc;
    }


    function getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL
        // return dataURL.replace("data:image/png;base64,", "");
    }


   
    function downloadIamge(imgsrc) {//下载图片地址和图片名
        let image = new Image();
        // 解决跨域 Canvas 污染问题
        image.setAttribute("crossOrigin", "anonymous");
        image.onload = function() {
          let canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          let context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, image.width, image.height);
          let baseURL = canvas.toDataURL("image/png"); //得到图片的base64编码数 
          var acessToken="24.8d19432cfcd1ff560c502b47a1b9f550.2592000.1664368126.282335-26440698";
          var request_url = "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic";
          var webURL = baseURL.slice(22);
          GM_xmlhttpRequest({
              method:"post",
              url:request_url+"?access_token="+acessToken,
              data:"image="+encodeURIComponent(webURL),
              headers:{
                'content-type': 'application/x-www-form-urlencoded'
              },
              onload:async(res)=>{
                  var data = JSON.parse(res.response);
                  console.log(data.words_result[0].words);
                  document.querySelector("#yzm").value=data.words_result[0].words;
                  document.querySelector("#dlg > div.dialog-foot > button").click();
                  
              }
          })


          // 在这里进行wa
        };
        image.src = imgsrc;
      }


})();