// ==UserScript==
// @name         ftv
// @version      5.2.1
// @namespace    http://tampermonkey.net/
// @description  try to take over the world!
// @author       You
// @match https://www.youtube.com/*
// @require http://code.jquery.com/jquery-2.1.4.min.js
// @require https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33991/ftv.user.js
// @updateURL https://update.greasyfork.org/scripts/33991/ftv.meta.js
// ==/UserScript==
$(document).ready(function(){
    //var bitchcookie = $.cookie('name');
    //  $("body").click(function(){$("div#items").append("<p>123123</p>");});
    // var mysrc = $("#avatar").find("img#img").attr("src");
    $("label#label").html("");
    $("head").append("<style> .facee{cursor:pointer} </style>");
    var myicon = $("#avatar").children(".style-scope .yt-img-shadow").attr("src");           //這裡自訂發言頭像網址
    var idlength = 100;        //這裡修改長ID預設長度
    var msg1hg   = "650";      //這裡修改主聊天室高度
    var newmsg1hg ="650";       //新版聊天室高度
    var msg2hg   = "650" ;     //這裡修改副聊天室高度
    var msgcolor = "#000000";  //這裡修改留言的顏色
    var msgbg    = "#ffffff";     //這裡修改聊天室內背景色
    var msgid    = "#707070";      //這裡修改聊天室內ID顏色
    var htm      = "https://www.youtube.com/live_chat?is_popout=1&v=9xwjg3W8cyA"; //這裡可以修改副聊天室網址
    //========顏文字變數=============☆PS：需要新增的文字或顏文字，請勿使用(半形)["]跟[,]跟[/]否則會破壞陣列結構，欲新增請自行加入["",]例如 新增 (o o) 就寫成 ,"(o o)" 特別注意，中間不可以有(半形)空白~否則會斷掉!☆

    var sp = [":awesome:","m(_　_)m","☮","凸^_^凸"];

    //========常用句變數=============☆PS：需要新增的文字或顏文字，請勿使用(半形)["]跟[,]跟[/]否則會破壞陣列結構，欲新增請自行加入["",]例如 新增 (o o) 就寫成 ,"(o o)" 特別注意，中間不可以有(半形)空白~否則會斷掉!☆

    var sp2= ["先來瓶雲碧解解渴??????youtube.com/watch?v=XAQ5lcaRjbk","聊天室過濾教學網址yee.updog.co","✌-網路沒有路-支那有賤畜-✌"];

    //========內建過濾===============
    var bitch = "垃圾貼這裡";

    //上面的bitch ="..."裡面...為內建名單 -ccnIoVz_htA=DYY <<可以自行修改~修改依據對方頭像(在對方頭像上按滑鼠右鍵=>檢查=>找it="xxxx")的[it]中間看以下範例
    //it="-gHEhhkPbHN8"取[-gHEhhkPbHN8]
    //===================================

    var pa00 = "https://";
    var pa01 = "https://lh3.googleusercontent.com/-UFPoMRu_fOU/V-YFuyEkO4I/AAAAAAAAA78/yyyK_KG_z_k_j3muMa27IW4i-Dt7J1lLACL0B/w41-d-h14-rw/%25E6%2594%25AF%25E9%2582%25A3%25E7%258B%2597.gif";

    var pc96 = "";
    var pc97 = "";
    var pc98 = "";
    var pc99 = "";
    setTimeout(function(){
        /*  $("#picker-buttons")
            .append("<img id='gifbtn' style='cursor:pointer' src='https://lh3.googleusercontent.com/-_MoGTTBxZNM/WSs-ajQcfuI/AAAAAAAADhE/j1vIWNqkBeEg_7_C9sDoVdyKcqMBtM21wCL0B/w25-d-h21-p-rw/gif.png'>"+
                    "<div id='gifdiv' style='height:300px;width:200px;border:1px solid #eee;display:none;overflow: auto;'>"+
                    "<img src='"+pa00+"' id='#a00' class='facee' >"+

                    "</div>");*/
        // $("#gifbtn").click(function(){$("#gifdiv").toggle();});
        $("span#author-name").after(" <span id='name_id'style='margin-left:15px;color:#fff;'></span>");
        $(".facee").click(function(){ $("div#input").append($(this).attr("id"));$("div#input").focus().keydown(); $("yt-live-chat-text-input-field-renderer#input").attr("has-text","");});
        $("ytd-live-chat-frame").css("height",newmsg1hg);
        $("#live-chat-iframe").css("height",msg1hg);
        $("div#contents").css({"background":msgbg});


        $("#item-offset").attr("class","");
        $("#item-offset").attr("style","");
        $("#watch7-sidebar-contents").before("<div id='dragg' style='padding-top:5px;padding-bottom:15px;background:#123;color:#fff;position:relative;z-index:999;'> 可拖曳 "+
                                             "<b><a href='https://greasyfork.org/zh-TW/scripts/33991-ftv' target='_blank' style='color:#FFF;border:1px solid #FFF;background:#663333'>　 最新腳本連結點我　 </a></b>"+
                                             "<a href='https://www.facebook.com/ftvnews53/?hc_ref=NEWSFEED&fref=nf' target='_blank'>民視粉絲團</a>"+
                                             "　　<span id='two' sw='off' style='color:#fff;font-size:16px;cursor:pointer'>聊</span>"+
                                             "<iframe  id='if' src="+htm+" style='display:none;width:100%;height:"+msg2hg+"px;'></iframe></div>");
        $("#two").click(function(){
        if($("#two").attr("sw") == "on"){$("#two").attr("sw","off").html("聊");$("#if").hide(200);}else{$("#two").attr("sw","on").html("不聊");$("#if").show(200);}
        });
        // $("#watch7-sidebar-contents").before("<div><iframe src='https://www.youtube.com/live_chat?is_popout=1&v=B2SbTqPobTo' style='width:100%;height:300px;'></iframe></div>");
        $("#dragg").draggable();
        $("div#items").attr("id","old").attr("class","old");
        $("div#old").before("<div id='items' class='' ></div>");
        $("div#old").hide();
        $("#title").html("");
        $("yt-live-chat-header-renderer").css({"padding":"0px"});
        $("#primary-content").css({"margin":"0px"});
        $("#title").append("<button id='save'>名</button><span style='font-size:8px;'> <button id='sp'>顏</button> <button id='sp2'>文</button> <button id='sp3' sc=''>捲</button>");//長ID</span><input type='text' value='"+idlength+"' id='idsize' style='font-size:8px;width:25px;'>
        $("#sp").after("<div id='sppage' style='overflow:auto;border:1px solid blue;height:400px;width:80%;position:absolute;left:60px;z-index:999;display:none;background:#fff;opacity:.8;font-size:small;'></div>");
        for(var i=0;i<sp.length;i++){$("#sppage").append("<button class='face' alt="+sp[i]+">"+sp[i]+"</button>");}
        $("#sp2").after("<div id='sp2page' style='overflow:auto;border:1px solid red;height:400px;width:80%;position:absolute;left:60px;z-index:999;display:none;background:#fff;opacity:.8;font-size:small;'></div>");
        for(var j=0;j<sp2.length;j++){$("#sp2page").append("<button class='face' alt="+sp2[j]+">"+sp2[j].substr(0,7)+"</button>");}
        $("#save").after("<div id='savepage' style='overflow:auto;border:1px solid #823;height:400px;width:80%;position:absolute;left:60px;z-index:999;display:none;background:#fff;opacity:.8;font-size:small;'><button id='killcookie'>主控台顯示名單</button><hr></div>");
        $("#killcookie").click(function(){console.log($('.mp').map(function(){return "["+this.innerHTML+"]"+this.id;}).get().join(''));});
        $(".face").css({"cursor":"pointer","margin":"2px","background":"#ffffcc","border":".5px solid #426"});
        $(".mp").css({"cursor":"pointer","margin":"2px","background":"#ffffcc","border":".5px solid #426"});
        $(".face").click(function(){ $("div#input").append($(this).attr("alt"));$("div#input").focus(); });
        $(".face").mouseover(function(){ $(this).css({"opacity":".3"}); });$(".face").mouseleave(function(){ $(this).css({"opacity":"1"}); });

        $("#sp").click(function(){
            if($("#sppage").css("display") == "none"){
                $("#sppage").show(100);
                $("#sp2page").hide(100);
                $("#savepage").hide(100);
            }else{
                $("#sppage").hide(100);
                $("#sp2page").hide(100);
                $("#savepage").hide(100);
            }
        });

        $("#sp2").click(function(){
            if($("#sp2page").css("display") == "none"){
                $("#sp2page").show(100);
                $("#sppage").hide(100);
                $("#savepage").hide(100);
            }else{
                $("#sppage").hide(100);
                $("#sp2page").hide(100);
                $("#savepage").hide(100);
            }
        });

        $("#save").click(function(){
            if($("#savepage").css("display") == "none"){
                $("#savepage").show(100);
                $("#sp2page").hide(100);
                $("#sppage").hide(100);
            }else{
                $("#sppage").hide(100);
                $("#sp2page").hide(100);
                $("#savepage").hide(100);
            }
        });

        //$("#test").click(function(){ document.execCommand("Open"); alert("213");});
        //$("#sp3").attr("alt","").attr("title","點擊(鎖定/解鎖)捲動軸").css({"cursor":"pointer"});
        $("#sp3").click(function(){
            if($(this).attr("sc") === ""){
                $(this).attr("sc","1");

            }else if($(this).attr("sc") === "1"){
                $(this).attr("sc","");
            }
        });

    },1000);
    function start(){

        $(".old").children("yt-live-chat-text-message-renderer").each(function(){
            var me = String($(this).find("yt-img-shadow").attr("class").match("empty"));
            //console.log(me);

            var liid = $(this).attr("id").substr(0,6);

            var liscr = $(this).find("img#img").attr("src");

            var liit = String($(this).find("img#img").attr("src")).substr(22,6);
            //  console.log( liit);
            //var nt30 = $(this).find("div#purchase-amount").html();

            /*-------------------GIF區段-----------------------
            $(this).find("span#message")
                .html($(this).find("span#message").html()
                      .replace(/#a01/g,"<img src='"+pa01+"'>")

                     );*/


            //  console.log("["+$(this).find("span#author-name").html()+"]的ID合計["+str4+"]字元");
            var mt = "-KD6Kd99cj_k";
            var cname = $(this).find("#author-name").text();
            var chat = $(this).find("#message").html();
            var mp = $('.mp').map(function() {
                return this.id;
            }).get().join('');//+$.cookie('name');

            if(me == "empty"){
                $("div#items").append("<table class='"+liit+" yt-live-chat-text-message-renderer-0' ><td><img title='點擊頭像過濾' id='"+liid+"' it="+liit+" class='img' in='"+cname+"' style='width:26px;height:26px;cursor:pointer;border-radius:13px;margin-right:8px;' src='"+myicon+"' onclick='$('#select_name').hide();'></td><td><span style='color:"+msgid+";padding-right:5px;' mt="+liit+" class='mtclass'>"+cname+"</span><span  style='color:"+msgcolor+";' id='message' class='yt-live-chat-text-message-renderer'>"+chat+"</span></td></table>");
            }
            if(liit != mp.match(liit) && liit != bitch.match(liit)){
                if(liit != mt){
                    if(liit == "-1OE4o"){cname = "支那賤賣";}
                    if(liit == "-nRQ7Y"){cname = "我是五字狗";chat = String($(this).find("#message").html()).substr(0,5)+"支那賤畜死全家";}
                    if(liit == "-5LR2H"){cname = "老毒蟲";chat = String($(this).find("#message").html()).substr(0,5)+"支那賤畜死全家";}
                    if(liit == "-dm2q_"){cname = "百度 泡兒";chat = String($(this).find("#message").html()).substr(0,5)+"支那賤畜死全家";}
                    if(liit == "-0-8qC"){cname = "欠五百";chat = String($(this).find("#message").html()).substr(0,5)+"?imgur。com/lraFKzK?";}
                    if(liit == "-8lpSk"){cname = "賴奷五";chat = String($(this).find("#message").html()).substr(0,5)+"我媽雞巴以受檢-舔共";}
                    if(liit == "-0N6OS"){cname = "詐騙犯";chat = String($(this).find("#message").html()).substr(0,5)+"我是詐騙犯 我應該被狗幹";}
                    
        
                    $("div#items").append("<table class='"+liit+" yt-live-chat-text-message-renderer-0' ><td><img title='點擊頭像過濾' id='"+liid+"' it="+liit+" class='img' in='"+cname+"' style='width:26px;height:26px;cursor:pointer;border-radius:13px;margin-right:8px;' src='"+liscr+"' onclick='$('#select_name').hide();'></td><td><span style='color:"+msgid+";padding-right:5px;' mt="+liit+" class='mtclass'>"+cname+"</span><span  style='color:"+msgcolor+";' id='message' class='yt-live-chat-text-message-renderer'>"+chat+"</span></td></table>");
                    //console.log(mp);
                }else{
                    $("div#items").append("<table class='"+liit+" yt-live-chat-text-message-renderer-0' ><td><img title='點擊頭像過濾' id='"+liid+"' it="+liit+" class='img' in='"+cname+"' style='width:32px;height:32px;cursor:pointer;border-radius:13px;margin-right:8px;' src='"+liscr+"' onclick='$('#select_name').hide();'></td><td><span style='color:#5573e5;padding-right:5px;' mt="+liit+" class='mtclass'><img src='https://lh3.googleusercontent.com/-blbj4qkA8V4/WSuyDKFFmwI/AAAAAAAADkQ/YRj_I0Q89ogeDyyxFKOwI00-qeNPDrv4wCL0B/w16-d-h15-rw/ma.gif'>"+cname+"</span><span  style='color:"+msgcolor+";' id='message' class='yt-live-chat-text-message-renderer'>"+chat+"</span></td></table>");
                }

                $("[it='"+liit+"']:last").click(function(){
                    $("#savepage").append("<button class='mp' id='"+$(this).attr("it")+"'>"+String($(this).attr("in")).substr(0,6)+"</button>");

                    //$(this).parents("table").remove();
                    $("[it='"+liit+"']").parents("table").remove();
                });
               // $.cookie('name',String(mp),{expires:7});
                //console.log($.cookie('name'));
                 $("[mt='"+liit+"']:last").click(function(){ $("div#input").append($(this).html()); $("#name_id").html(""); $("#name_id").html(" "+$(this).attr("mt"));});
                //$("#save").click(function(){
                //  $("#"+$("#select_name").val()).remove();
                //});
                $(".mp").click(function(){$(this).remove();});
                $(".img").mouseover(function(){
                    $(this).css({"opacity":".2"});
                });
                $(".img").mouseleave(function(){
                    $(this).css({"opacity":"1"});
                });
                $(this).remove();
            }else{
                console.log(cname+"："+$(this).find("#message").text());
                $(this).remove();
            }
            // $(".mtclass").each(function(){ if($(this).attr("mt") == mt){$(this).css({"color":"#5573e5"}); } });
            $(".img").each(function(){ var my =$("img#avatar").attr("src");  if($(this).attr("src").substr(0,4) == "data"){$(this).attr("src",my);} });
        });
        var say = $("div#items").children("table").size();
        if(say>200){
            while(say>200){ $("div#items").children("table").first().remove(); say--; }
        }
    }
    setInterval(function(){
        var oldli = $(".old").children("yt-live-chat-text-message-renderer").size();
        if(oldli>0){

            start();
        }
        if($("#sp3").attr("sc") === ""){
            $("div#item-scroller").scrollTop(1700000);}
    },400);
});