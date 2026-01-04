// ==UserScript==
// @name         斗鱼TV
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       MyHGG
// @match        https://www.douyu.com/*
// @match        http://www.douyu.com/*
// @exclude      https://www.douyu.com/directory/myFollow
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/380847/%E6%96%97%E9%B1%BCTV.user.js
// @updateURL https://update.greasyfork.org/scripts/380847/%E6%96%97%E9%B1%BCTV.meta.js
// ==/UserScript==

(function() {
    var interval=1,continued=5;
    var status=0,i=0;
    var text="666666";


    var btn1=$("<div class='text'style='display:nline-block;display:inline-block;vertical-align:middle;vertical-align:middle;width:18px;height:18px;margin-right:8px;cursor:pointer;'>\
<div class='text1 'style='width:20px;height:18px;background:url(https://sta-op.douyucdn.cn/front-publish/live-master/assets/images/spring-head-icos_9a52fbd.png) -22px 0 no-repeat'></div></div>");

    var btn2=$("<div class='text2' style='position:absolute;left:-7px;right: -7px;bottom:100%;margin:auto;padding:10px;border-top:1px solid #ddd;border-bottom:1px solid #ddd;background:#fff;animation:slideUp .3s cubic-bezier(.22,.58,.12,.98) forwards;'></div>");
    var btn3=$("<div class='text3' style='line-height:40px;height:30px;margin:1px 14px 0;text-align:center'>\
<h1 style='font-size:18px;color: #f70;font-weight: 400;'>自动弹幕机</h1></div>\
<div class='text4'style='text-align:right;'><h1 style='color: #f70;'>作者：坏哥哥</h1></div>\
<textarea class='textar' placeholder='请输入内容多段换行！'style='height:150px;width:98%;border:1px solid #ff921a;resize:none;border-radius:4px;'value=''></textarea>\
<div class='text6'  style='color: #f14700;line-height:25px;height:30px;' >\
弹幕 间隔： <div style='display:inline'><input class='input1' type='text' value='' style='width: 45px;border:1px solid #ff921a'></div>秒 \
弹幕 持续： <div style='display:inline'><input class='input2' type='text' value='' style='width: 45px;border:1px solid #ff921a'></div>秒 \
<div class='button' style='width: 40px;height: 30px;line-height: 30px;background: #f70;color: #fff;font-size: 14px;text-align: center;float: right;'>开始</div>\
</div>");

     //  $('.text2').css('')
   function funcName(){
       $('.ShieldTool-checkIcon').css('margin-right','0px')
       $('.ChatToolBar').append(btn1);
       $(".text1").click(function(){
          if($(".text").find(".text2").length==1)
           {   $(".text").children(".text2").remove();
           }else
           {
              funcboby();
           }
       });
   }
    function times(){
        if(interval==0||continued==0||status==0)
        {
            $('.button').text("开始")
            $('.input1').attr('disabled',false);
            $('.input2').attr('disabled',false);
            status=0;
            continued=60;
            return;
        }
        continued--;
        $('.input1').val(interval);
        $('.input2').val(continued);
        var texts=text.split('\n')
        if(i>=texts.length)
        {
            i=0;
        }
        if(continued%interval==0)
        if(Star(texts[i])==1)
        {
            i++;
        }
        setTimeout(times,1000);
    }
   function Star(text){//发送函数
       var catsendtext=$('.ChatSend-txt');//内容
       var catsendbutton=$('.ChatSend-button');//发送
       if(catsendbutton.text()=="发送"||catsendbutton.text()=="开火")
       {
           catsendtext.val(text);
           catsendbutton.click();
           return 1;
       }else{
           return 0;
       }
   }
   function funcboby(){//加载显示
       $('.text').append(btn2);
       $('.text2').append(btn3);
       $('.input1').val(interval);
       $('.input2').val(continued);
       $('.textar').val(text);
       if(status==0)
       {
           $('.button').text("开始");
           $('.input1').attr('disabled',false);
           $('.input2').attr('disabled',false);
       }else
       {
           $('.button').text("暂停");
           $('.input1').attr('disabled',true);
           $('.input2').attr('disabled',true);

       }
       $(".button").click(function(){
           if(status==0)
           {
               status=1;
               $('.button').text("暂停");
               $('.input1').attr('disabled',true);
               $('.input2').attr('disabled',true);
               interval= $('.input1').val();
               continued= $('.input2').val();
               text=$('.textar').val();
               setTimeout(times,1000);
           }else
           {
               status=0;
               $('.button').text("开始");
               $('.input1').attr('disabled',false);
               $('.input2').attr('disabled',false);
           }
       });
   }

    setTimeout(funcName,5000);

})();







