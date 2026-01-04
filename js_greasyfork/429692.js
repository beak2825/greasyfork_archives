// ==UserScript==
// @name         实现弹幕自由silisili版dandanplayAPI
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在其他网站上显示弹幕
// @author       Neil Willing
// @match        http://www.silisili.in/play/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @connect      api.acplay.net
// @connect      dandan-comment-1.chinacloudsites.cn
// @connect      cdn.jsdelivr.net
// @icon         https://i2.hdslb.com/bfs/face/de10acf4fadca5b922eeff575b7928b01b34ad99.jpg@85w_85h.jpg
// @require      https://cdn.jsdelivr.net/npm/jquery@1.11.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/gh/chiruom/jquery.danmu.js@412a9ad45dc5efbb3c38a4d524a0195ae77cd464/dist/jquery.danmu.min.js

// @downloadURL https://update.greasyfork.org/scripts/429692/%E5%AE%9E%E7%8E%B0%E5%BC%B9%E5%B9%95%E8%87%AA%E7%94%B1silisili%E7%89%88dandanplayAPI.user.js
// @updateURL https://update.greasyfork.org/scripts/429692/%E5%AE%9E%E7%8E%B0%E5%BC%B9%E5%B9%95%E8%87%AA%E7%94%B1silisili%E7%89%88dandanplayAPI.meta.js
// ==/UserScript==
//jquery.danmu.js (//github.com/chiruom/danmu/) - Licensed under the MIT license


GM_addStyle('button {background-color: #008CBA;border: none;color: white;padding: 5px 10px;text-align: center;text-decoration: none;display: inline-block;font-size: 14px;border-radius: 12px;}');
(function() {
    'use strict';
    const videolocation = "#video";
    const btnlocation = ".player_sx ";
    const top_margin = 0;
    const left_margin = 0;

    var video = $(videolocation);//#vjsp #play2 .player_zanpian #player
    var btnbox = $(btnlocation); //.playding .clearfix .player_sx li div[class='playding clearfix']

    var divbox=$("<div></div>").attr("id","danmu");
    video.prepend(divbox);
    $("#danmu").danmu({
        height: video.height()-60,  //弹幕区高度
        width: video.width(),   //弹幕区宽度
        top:top_margin,
        left:left_margin,
        zindex: 100,   //弹幕区域z-index属性
        speed: 7000,      //滚动弹幕的默认速度，这是数值值得是弹幕滚过每672像素所需要的时间（毫秒）
        sumTime: 65535,   //弹幕流的总时间
        danmuLoop: false,   //是否循环播放弹幕
        defaultFontColor: "#FFFFFF",   //弹幕的默认颜色
        fontSizeSmall: 16,     //小弹幕的字号大小
        FontSizeBig: 24,       //大弹幕的字号大小
        opacity: "0.9",			//默认弹幕透明度
        topBottonDanmuTime: 6000,   // 顶部底部弹幕持续时间（毫秒）
        SubtitleProtection: true,     //是否字幕保护
        positionOptimize: true,         //是否位置优化，位置优化是指像AB站那样弹幕主要漂浮于区域上半部分
        maxCountInScreen: 40,   //屏幕上的最大的显示弹幕数目,弹幕数量过多时,优先加载最新的。
        maxCountPerSec: 5      //每分秒钟最多的弹幕数目,弹幕数量过多时,优先加载最新的。
    });

    var playbarrage = $("<button></button>").text("播放弹幕");
    var stopbarrage = $("<button></button>").text("暂停弹幕");
    var searchtext = $("<input/>").attr("type","text").attr("id","search").attr("placeholder","输入番剧名称");
    var searchbtn = $("<input/>").attr("type","button").attr("value","搜索");
    var bangumiselect = $("<select></select>").attr("id","bangumi");
    var episodeselect = $("<select></select>").attr("id","barrage");
    var barragenumbertip = $("<label></label>").text("本集弹幕数量");
    var barragenumber = $("<a></a>");
    var minutetext = $("<input/>").attr("type","number").attr("name","timer").attr("id","minute").attr("placeholder","分钟");
    var secondtext = $("<input/>").attr("type","number").attr("name","timer").attr("id","second").attr("placeholder","秒");
    var timerbtn = $("<input/>").attr("type","button").attr("value","跳转");
    var timetip = $("<label></label>").text("弹幕当前时间");
    var time = $("<a></a>").attr("id","time");
    var danmuswitch = $("<button></button>").text("弹幕开关");

    var jsonarray = new Array();//封装剧集信息的json对象
    var valuelist = GM_listValues();

    var flag_animeId = false;
    var flag_episodeId = false;
    for(var i=0;i<valuelist.length;i++){
        if(valuelist[i]=="animeId"){
            flag_animeId = true;
        }
        if(valuelist[i]=="episodeId"){
            flag_episodeId = true;
        }
    }
    if(!flag_animeId){
        GM_setValue("animeId",0);
    }
    if(!flag_episodeId){
        GM_setValue("episodeId",0);
    }
    //console.log(GM_getValue("animeId"));
    //console.log(GM_getValue("episodeId"));

    if(GM_getValue("jsonarray") && typeof(GM_getValue("jsonarray"))!="undefined" && GM_getValue("jsonarray")!=0) {
        jsonarray = GM_getValue("jsonarray");
    }
    if(GM_getValue("animeId") && typeof(GM_getValue("animeId"))!="undefined") {
        getmediarequest(GM_getValue("animeId"));
    }
    if(GM_getValue("episodeId") && typeof(GM_getValue("episodeId"))!="undefined") {
        var opts = episodeselect.children();
        for(var k=0;k<opts.length;k++) {
            if($(opts[k]).val() == GM_getValue("episodeId")){
                $(opts[k]).prop("selected",true);
                break;
            }
        }
        getbarragerequest(GM_getValue("episodeId"));
    }

    btnbox.prepend(danmuswitch,playbarrage,stopbarrage,searchtext,searchbtn,bangumiselect,episodeselect,"<br/>",barragenumbertip,barragenumber,minutetext,secondtext,timerbtn,timetip,time);

    /*
      封装弹幕列表
    */
    function getbarragerequest(episodeId){
        GM_xmlhttpRequest({
            url:"https://api.acplay.net/api/v2/comment/"+episodeId,
            method:"get",
            async:false,
            headers:{
                "content-type": "application/json"
            },
            onload:function(xhr) {
                var jsonbarrage = JSON.parse(xhr.responseText);
                var barragearray =jsonbarrage.comments;
                barragenumber.text(barragearray.length);
                for(var i=0;i<barragearray.length;i++){
                    var text = barragearray[i].m;
                    var attr = barragearray[i].p;
                    var attrvalue = attr.split(",");
                    attrvalue[1] = attrvalue[1]<4 ? 0 : (attrvalue[1]==4 ? 1 : 2);
                    $("#danmu").danmu("addDanmu",{text:text,color:"white",size:1,position:attrvalue[1],time:parseInt(attrvalue[0])*10});
                }
            }
        });
    }
    /*
      通过animeId封装剧集列表
    */
    function getmediarequest(animeId) {
        for(var i=0;i<jsonarray.length;i++){
            if(animeId == jsonarray[i].animeId){
                var episodelist = jsonarray[i].episodes;
                episodeselect.empty();
                episodeselect.append($("<option></option>").attr("value","").text("-------"));
                for(var j=0;j<episodelist.length;j++){
                    var opt = $("<option></option>").attr("value",episodelist[j].episodeId).text(episodelist[j].episodeTitle);
                    episodeselect.append(opt);
                }
                break;
            }
        }
    }
    /*
    通过关键词获取剧集列表
    */
    function getmediarequestbyword(){
        GM_xmlhttpRequest({
            url:"https://api.acplay.net/api/v2/search/episodes?anime="+searchtext.val(),
            method:"get",
            async:false,
            headers:{
                "content-type": "application/json"
            },
            onload:function(xhr) {
                var mediastr = JSON.parse(xhr.responseText);
                jsonarray = mediastr.animes;
                GM_setValue("jsonarray",jsonarray);
                var md=new Array();
                var bangumilist=new Array();
                for(var i=0;i<jsonarray.length;i++){
                        for(var j=0;j<jsonarray.length;j++){
                            bangumilist[j] = jsonarray[j].animeTitle;
                            md[j] = jsonarray[j].animeId;
                        }
                }
                bangumiselect.empty();
                bangumiselect.append($("<option></option>").attr("value","").text("-------"));
                for(var k=0;k<bangumilist.length;k++){
                    var opt = $("<option></option>").attr("value",md[k]).text(bangumilist[k]);
                    bangumiselect.append(opt);
                }
            }
        });
    }

    /*
      弹幕播放按钮的点击事件
    */
    playbarrage.click(function(){
        $("#danmu").danmu('danmuResume');
    });
    /*
      弹幕暂停按钮的点击事件
    */
    stopbarrage.click(function(){
        $("#danmu").danmu('danmuPause');
    });

    /*
      通过番剧名搜索剧集
    */
    searchbtn.click(function(){
        if(this.checked){
            searchbtn.prop("checked", true);
        }else{
            searchbtn.prop("checked", false);
        }
        getmediarequestbyword();
    });
    /*
      番剧切换列表的点击事件
    */
    bangumiselect.on('change',function(){
        $("#danmu").danmu('danmuStop');
        if(GM_getValue("animeId")!=bangumiselect.find("option:selected").val()) {
            GM_setValue("animeId",bangumiselect.find("option:selected").val());
            GM_deleteValue("episodeId");
        }
        getmediarequest(bangumiselect.find("option:selected").val());
    });
    /*
      单集切换列表的点击事件
    */
    episodeselect.on('change',function(){
        $("#danmu").danmu('danmuStop');
        GM_deleteValue("episodeId");
        GM_setValue("episodeId",episodeselect.find("option:selected").val());
        getbarragerequest(episodeselect.find("option:selected").val());
    });

    /*
      弹幕时间跳转
    */
    timerbtn.click(function(){
        if(this.checked){
            timerbtn.prop("checked", true);
        }else{
            timerbtn.prop("checked", false);
        }
        var minute = parseInt(minutetext.val());
        var second = parseInt(secondtext.val());
        $("#danmu").danmu("setTime",(minute*60+second)*10);//1:30
    });
    /*
      弹幕时间显示
    */
    setInterval(function(){
        var now = $("#danmu").data("nowTime");
        time.text(Math.floor(now/10/60)+":"+Math.floor(now/10)%60);
    },1000);
    /*
      点击弹幕可以使其消失（解决弹幕卡住的问题）
    */
    $("#danmu").click(function(){
        $(this).children("span").click(function(){
            $(this).hide();
        });
    });
    /*
      弹幕开关的点击事件
    */
    danmuswitch.click(function(){
        if(this.checked){
            timerbtn.prop("checked", true);
        }else{
            timerbtn.prop("checked", false);
        }
        $("#danmu").slideToggle();
    });

})();