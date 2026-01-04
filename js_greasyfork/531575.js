// ==UserScript==
// @name         Clock in and out
// @namespace    http://tampermonkey.net/
// @version      2025-04-02
// @description  world!
// @author       You
// @match        https://forms.office.com/pages/responsepage.aspx?id=6N993P_V1ku1RFYKAxo2Sj2H6WUO6l5ClK0TYN6BgSpUQkJHWTRXNVhHUlRNUU5FT1NSRjRPSTNUTC4u&route=shorturl
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=office.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531575/Clock%20in%20and%20out.user.js
// @updateURL https://update.greasyfork.org/scripts/531575/Clock%20in%20and%20out.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CLOCK_TIME_SET=[800,1230,1329,1701]
    const INDEX=[0,9,16,21,23]; //其中第三個元素, INDEX[2] 要改變成15,16,17,18 分別是 上班打卡,吃飯打出,吃飯打入,下班打卡
    const CHECK_TIME=40*1000

    function fills(){
        $("#form-main-content1 input").eq(INDEX[0]).val("Jialiang Luo");
        $("#form-main-content1 input").eq(INDEX[1]).click();
        $("#form-main-content1 input").eq(INDEX[2]).click();
        $("#form-main-content1 input").eq(INDEX[3]).click();
        $("#form-main-content1 input").eq(INDEX[4]).val("conanluo@gmail.com");
    }

    let checkFirstBtn=setInterval(function(){
        console.log("1,----",new Date())
        if($("button").eq(1).text()=="立即开始"){
            $("button").eq(1).click();
        }
    },2000)

    let checkSecondBtn=setInterval(function(){
        let now_time=new Date().getHours()+":"+new Date().getMinutes()
        //console.log("2,----",now_time)
        //if($("button").eq(1).text()=="提交"){
            clearInterval(checkFirstBtn);

            //添加界面
            let html=`<nav id="my_set"><input type="text" size="2" id="in_day" value="${CLOCK_TIME_SET[0]}">
                      <input type="text" size="2" id="out_lunch" value="${CLOCK_TIME_SET[1]}">
                      <input type="text" size="2" id="in_lunch" value="${CLOCK_TIME_SET[2]}">
                      <input type="text" size="2" id="out_day" value="${CLOCK_TIME_SET[3]}">
                      <button id="set_time">set</button><span id="show_new_set" style="color:red"></span></nav>`
            if($("#my_set").length==0){
                $("body").prepend(html);
                $("#set_time").click(function(){
                    CLOCK_TIME_SET[0]=timeFomat($("#in_day").val())
                    CLOCK_TIME_SET[1]=timeFomat($("#out_lunch").val())
                    CLOCK_TIME_SET[2]=timeFomat($("#in_lunch").val())
                    CLOCK_TIME_SET[3]=timeFomat($("#out_day").val())
                    $("#show_new_set").text("-----"+new Date().getHours()+":"+new Date().getMinutes()+"-----"+CLOCK_TIME_SET.join("__"))
                })
            }


            now_time = timeFomat(now_time)
            console.log(now_time,CLOCK_TIME_SET[0],now_time==CLOCK_TIME_SET[0])
            if(now_time<=CLOCK_TIME_SET[0]){//Clock in
                //$("#form-main-content1 button").eq(1).text("上班")
                INDEX[2]=15
                console.log(now_time,CLOCK_TIME_SET[0],now_time==CLOCK_TIME_SET[0])
                if(now_time==CLOCK_TIME_SET[0]){
                    //console.log(1)
                    //$("#form-main-content1 button").eq(1).text("上班daka")
                }
            }else if(now_time>CLOCK_TIME_SET[0] && now_time<=CLOCK_TIME_SET[1]){//Clock out Lunch

                //$("#form-main-content1 button").eq(1).text("去Lunch")
                INDEX[2]=16
                if(now_time==CLOCK_TIME_SET[1]){
                    //console.log(1)
                    //$("#form-main-content1 button").eq(1).text("去Lunch daka")
                }
            }else if(now_time>CLOCK_TIME_SET[1] && now_time<=CLOCK_TIME_SET[2]){//Clock in Lunch

                //$("#form-main-content1 button").eq(1).text("起床啦")
                INDEX[2]=17
                if(now_time==CLOCK_TIME_SET[2]){
                    //console.log(1)
                    //$("#form-main-content1 button").eq(1).text("起床啦 daka")
                }
            }else if(now_time>CLOCK_TIME_SET[2] && now_time<=CLOCK_TIME_SET[3]){//Clock in Lunch

                //$("#form-main-content1 button").eq(1).text("下班")
                INDEX[2]=18
                if(now_time==CLOCK_TIME_SET[3]){
                    //console.log(1)
                    //$("#form-main-content1 button").eq(1).text("下班 daka")
                }
            }

            fills();
       // }
    },CHECK_TIME)

    function timeFomat(t){
        return parseInt(parseInt(t.split(":")[0])+(parseInt(t.split(":")[1])<10?"0":""+t.split(":")[1]))
    }
})();