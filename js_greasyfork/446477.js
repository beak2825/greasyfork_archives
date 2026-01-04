// ==UserScript==
// @name         whsfclick
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  安逸自动刷新商品
// @author       You
// @match        https://www.marriott.com.cn/reservation/availabilityCalendar.mi*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shangri-la.com
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-cookie/1.4.0/jquery.cookie.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      *
/* globals jQuery, $, waitForKeyElements */
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/446477/whsfclick.user.js
// @updateURL https://update.greasyfork.org/scripts/446477/whsfclick.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
//香港海洋公园万豪酒店 香港万怡酒店 香港沙田万怡酒店 香港 W 酒店 香港东涌福朋喜来登酒店
    //机器号  腾讯云:机器1，云电脑:机器2，个人：名字拼音
    //var machineName = "机器1（微软）";
    //抢第几天的票，多个机器抢一个酒店，最好错开号码抢
   // var qiangNum = 1;

    //循环点击翻页休息秒数
    var sleepNum =4;
    var machineName = window.localStorage.getItem('machine_name');
    if(!machineName){
          machineName=window.prompt("机器多少号(浏览器)","机器1(微软)");
          window.localStorage.setItem('machine_name', machineName)
    }
    var qiangNum = window.localStorage.getItem('machine_qiangNum');
    if(!qiangNum){
          qiangNum=window.prompt("抢第几天的号","1");
          window.localStorage.setItem('machine_qiangNum', qiangNum)
    }


    var baseUrl = "https://www.marriott.com.cn";
    //代码
    var params = dataLayer ;
    document.title=params.prop_name;

    var aaa = $(".t-calendar-current-month-title")[0];


    var oldText ="";
    if(aaa){
        oldText = aaa.innerText;
    }
    var newText = ""
    var end = false;
    setInterval(() => {

            newText = $('.t-calendar-current-month-title')[0].innerText
            if(newText && oldText && newText !== oldText) {
                oldText = newText

               var success = doChange(newText);
                if(success){

                    clearInterval;
                }
            }
        }, 800)


    function doChange(currTitle){
         var list = $(".l-pos-relative.l-s-padding-top-three-quarters");

        var find = new Array();
        var find_num = 0;
 // console.log("开始对比");
        for (let i = 0; i < list.length; i++) {

            var obj = $(list[i]);
            var text =obj.text();
            //获取有数据的
            if(text.indexOf("优惠")==-1){
                continue;
            }
            //只计算总计的
            if(text.indexOf("总计")==-1){
                continue;
            }
            var price_str =obj.find(".t-extend-h3.l-margin-none.t-font-l.t-font-weight-bold");
            if(price_str.length>0){
                var price =price_str[0].innerText
                price = price.replace(",","");
                var xq_idx = text.indexOf("星期");
                //text.substring(xq_idx+1
                 //     星期日  6/12  优惠价    1,140
                //   星期六  6/11  优惠价    2,630    HKD/总计 2 晚

                if(price<21000){

                    var link =baseUrl+$(obj.find(".rate-link.t-no-decor.t-no-hover-link")[0]).attr("href");
                    var dd = text.substring(xq_idx+3,xq_idx+9).trim();
                    if((dd.substring(0,1)==7 &&dd.substring(2)>24) || (dd.substring(0,1)==8)){
                        continue;

                    }

                    if(qiangNum ==1 ){
                        
                        var msgs = "酒店通知:@@酒店名字="+dataLayer.prop_name+"@@日期=2022-"+dd.replace("/","-")+",总价格="+price+"@@程序位置="+machineName+"@@通知时间="+new Date().toLocaleTimeString();
                        sendMsg(msgs);
                        end=true;
                         location.href=link;
                         //console.log("跳转url");
                         return true;
                    }


                    find[find_num++]=link;
                    if(find.length>=qiangNum){
                        end=true;
                        location.href=find[qiangNum-1];
                         //console.log("跳转url");
                        return true;
                    }

                }



           }


        }
        if(find.length>=qiangNum){
             end=true;
             location.href=find[qiangNum-1];
             //console.log("跳转url");
            return true;
        }
        if(find.length>0){
             end=true;
            location.href=find[0];
             //lconsole.log("跳转url");
            return true;
        }
    
        return false;

    }
     setInterval(() => {
             var first = $(document.getElementsByClassName("ui-tabs-panel ui-widget-content ui-corner-bottom")[0]);
             var obj = null;
             if(first.attr("style")){
                 obj = $(document.getElementsByClassName("ui-tabs-panel ui-widget-content ui-corner-bottom")[1]);
             }else{
                 obj = first;
             }

             var clicklist = obj.find(".t-control-link.t-no-decor.analytics-click");

              for (let i = 0; i < clicklist.length; i++) {

                      var click = clicklist[i];
                      var dd3 = $(click).attr("data-paramvalue");
                      var dd = dd3.substring(0,2);
                      if(dd=='06' || dd=='07'){
                          if(!end){
                              console.log("点击切换");
                              click.click();
                          }
                         
                      }

              }

        },sleepNum*1000)


    setInterval(function(){

        location.reload();
    },1000*60*15);



   // $("js-booking-btn").click();

   // $($("#js-hotel-list .flex-item:not(.hotel-info)")[0]).find(".current-currency").text()

      function sendMsg( msg){
          GM_xmlhttpRequest({
            url:'http://139.155.6.142:18888',
            method:"POST",
            data:'dd2='+msg,
           headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload:function (res){

                console.log(res);
            }
			});
    }
   // sendMsg("md222222");
})();