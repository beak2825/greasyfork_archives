// ==UserScript==
// @name         斗鱼自动抢宝箱领鱼丸和发弹幕zz
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  自动领取火箭飞机宝箱；自动发送弹幕；不闪屏，不影响背包打开；有可控制关停和发送间隔的页面开关
// @author       lansun_mail@foxmail.com
// @match        https://www.douyu.com/*
// @match        http://www.douyu.com/*
// @match        http://www.douyu.com/t/*
// @match        https://xiu.douyu.com/*
// @match        http://xiu.douyu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39182/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E6%8A%A2%E5%AE%9D%E7%AE%B1%E9%A2%86%E9%B1%BC%E4%B8%B8%E5%92%8C%E5%8F%91%E5%BC%B9%E5%B9%95zz.user.js
// @updateURL https://update.greasyfork.org/scripts/39182/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E6%8A%A2%E5%AE%9D%E7%AE%B1%E9%A2%86%E9%B1%BC%E4%B8%B8%E5%92%8C%E5%8F%91%E5%BC%B9%E5%B9%95zz.meta.js
// ==/UserScript==

(function() {
    // 随机发送的弹幕，可自行新增修改
    var danmuList = new Array("666666666666","哈哈哈哈哈哈哈哈哈哈","红红火火恍恍惚惚红红火火恍恍惚惚","111111111111111","0000000000000","233333333333333"); 
    
    var  bx_siv = 0; // 宝箱定时接收值，用来控制定时开或关
    var  dm_siv = 0; // 弹幕定时接收值，用来控制定时开或关
    // 添加控制开关html
    $(function(){
        var switchHtml = '<li class="myFlLi fl assort current" style="margin-left:20px;" id="bx_switch">' +
            '<a href="javascript:;" data="1">领宝箱</a><i></i>' + 
			'<div class="a-pop">' +
            '<div class="a-list">' +
            '<h3 style="font-weight:normal">发送弹幕数：<span style="font-weight:bold" id="dm_count"><span></h3>' + 
            '<h3 style="font-weight:normal">领取到的礼物：<span style="font-weight:bold" id="click_count"></span><span style="font-weight:bold" id="gift_show"></span></h3>'+
            '</div>' +
            '</div>' +
			'</li>' +
            
            '<li class="myFlLi fl assort" style="height:50px;margin-left:20px" id="dm_switch">' +
            '<a href="javascript:;" data="0">发弹幕</a><i></i>' +
            '<div class="a-pop">' +
            '<div class="a-list">' +
            '<h3>弹幕内容</h3>' +
            '<ul class="btns">' +
           // '<li><a target="_blank" class="btn dm_type" style="background:#ececec" href="javascript:;" data="mf">模仿弹幕</a></li>' +
            '<li><a target="_blank" class="btn dm_type current" style="background:#ff630e" href="javascript:;" data="gd">固定内容</a></li>' +
            '</ul>' +
            '<h3>自动发送间隔</h3>' +
            '<ul class="btns">' +
            '<li><a target="_blank" class="btn dm_times" style="background:#ececec" href="javascript:;" data="3000">3秒</a></li>' +
            '<li><a target="_blank" class="btn dm_times" style="background:#ececec" href="javascript:;" data="6000">6秒</a></li>' +
            '<li><a target="_blank" class="btn dm_times" style="background:#ececec" href="javascript:;" data="11000">11秒</a></li>' +
            '<li><a target="_blank" class="btn dm_times" style="background:#ececec" href="javascript:;" data="60000">1分钟</a></li>' +
            '<li><a target="_blank" class="btn dm_times current" style="background:#ff630e" href="javascript:;" data="180000">3分钟</a></li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</li>';
        $(".head-nav").append(switchHtml);
        
        $("#header div.head").css("width", "100%");
        $("a.head-logo").css("margin-left", "30px");
        $("div.head-oth").css("margin-right", "50px");
    });
    
    // 自动领取宝箱
    var clickNum = 0;
    var successTip = "<br/>";
    bx_siv = setInterval(baoxiang, 300);
    function baoxiang()
    {
        var bx_switch = $("#bx_switch>a").attr("data")+"";
        if(bx_switch=="1"){
            var right_col_peck = $("#right_col_peck").css("display")+""; // 宝箱div是否出现
            var peck_class = $("#right_col_peck").attr("class")+""; // 宝箱是否为可领取，宝箱可领取时才做点击
            // 解决某些点击事件被定时点击事件影响的问题（不能点击背包和彩色弹幕选择的问题）
            var packFlag = $(".backpack").css("display")+""; // 背包按钮
            var dm_sw = $(".color-box").attr("class")+""; // 弹幕控制按钮
            if(right_col_peck=="block" && peck_class.indexOf("open")>-1 && packFlag=="none" && dm_sw.indexOf("open")==-1 ){
                $("div.peck-cdn").click();
                var showJq = $(".peck-back-tip>p");
                var show = $(".peck-back-tip>p>span").html()+"";
                if(show=="undefined"|| show=="领过" || show.indexOf("没有")>-1 || show.indexOf("洗劫")>-1 || show.indexOf("不佳")>-1){ // 领取不到或者已经领过东西，不记录到领取结果
                    show="";
                } else { // 领到东西
                    $(".peck-back-tip>p>span").html("领过");
                    show =  $(showJq).find("strong").html()+"&nbsp;&nbsp;&nbsp;"; // 宝箱派发人
                    show = show + $(showJq).next("p").find("strong").html() + "<br/>"; // 领到的东西
                }
                successTip = successTip + show;
                clickNum++;
                $("#gift_show").html(successTip);
            }
        }
    }

    //自动发送弹幕
    var maxNum = danmuList.length;
    var lastNum = -1;
    var sendNum = 0;
    var dmSended = ""; // 上次发送的弹幕
    dm_siv = setInterval(send, 180000);
    function send()
    {
        var dm_switch = $("#dm_switch>a").attr("data")+"";
        if(dm_switch=="1"){
            // 解决某些事件被定时点击事件影响的问题
            var packFlag = $(".backpack").css("display")+"";
            var dm_sw = $(".color-box").attr("class")+"";
            if(packFlag=="none" && dm_sw.indexOf("open")==-1){
                var dm_type = $("a.dm_type.current").attr("data")+"";
                var danmu = "";
                if(dm_type === "mf"){
                    var pt = $("span.text-cont");
                    var ptLen = pt.length;
                    var lastPt = pt[ptLen-1];
                    danmu = $(lastPt).text();
                }
                else{
                    var num = parseInt(Math.random()*maxNum); // 固定内容的弹幕中随机发送一个
                    if(lastNum!=-1&&num==lastNum){ // 当前发送的弹幕不能和上次发送的弹幕相同
                        if(num===0){num=num+1;}
                        else{num=num-1;}
                    }
                    lastNum = num;
                    danmu = danmuList[num];
                }
                if(danmu!=="" && danmu!=dmSended){
                    $(".cs-textarea").val(danmu);
                    $("div.b-btn[data-type='send']").click();
                    dmSended = danmu;
                    sendNum++;
                    $("#dm_count").html(sendNum);
                }
            }
        }
    }

    // 宝箱开关控制
    $(document).on('click', '#bx_switch', function(){
		var old_switch = $("#bx_switch>a").attr("data")+"";
        if(old_switch=="1"){ // 由开到关
            $("#bx_switch").removeClass("current");
            $("#bx_switch>a").attr("data", "0");
            clearInterval(bx_siv);
        }
        else{
            $("#bx_switch").addClass("current");
            $("#bx_switch>a").attr("data", "1");
            bx_siv = setInterval(baoxiang, 300);
        }
	});
    // 弹幕开关控制
    $(document).on('click', '#dm_switch>a', function(){
		var old_switch = $("#dm_switch>a").attr("data")+"";
        if(old_switch=="1"){ // 由开到关
            $("#dm_switch").removeClass("current");
            $("#dm_switch>a").attr("data", "0");
            clearInterval(dm_siv);
        }
        else{
            $("#dm_switch").addClass("current");
            $("#dm_switch>a").attr("data", "1");
            var dm_times = $(".dm_times.current").attr("data")+"";
            dm_siv = setInterval(send, Number(dm_times));
        }
	});
    
    // 弹幕内容切换
    $(document).on('click', '.dm_type', function(){
        var $this_type = $(this);
        var dm_type = $this_type.attr("data")+"";
        $this_type.css("background","#ff630e").addClass("current");
        var $this_siblings = $this_type.parent("li").siblings("li");
        var sblLen = $this_siblings.length;
        for(var i=0;i<sblLen;i++){
            $this_siblings.eq(i).find("a.dm_type").css("background","#ececec").removeClass("current");
        }
        var old_switch = $("#dm_switch>a").attr("data")+"";
        if(old_switch=="1"){
            clearInterval(dm_siv);
            var dm_times = $("a.dm_times.current").attr("data")+"";
            dm_siv = setInterval(send, Number(dm_times));
        }
    });
    
    // 弹幕发送时间间隔切换
    $(document).on('click', '.dm_times', function(){
        var $this_time = $(this);
        var dm_times = $this_time.attr("data")+"";
        $this_time.css("background","#ff630e").addClass("current");
        var $this_siblings = $this_time.parent("li").siblings("li");
        var sblLen = $this_siblings.length;
        for(var i=0;i<sblLen;i++){
            $this_siblings.eq(i).find("a.dm_times").css("background","#ececec").removeClass("current");
        }
        var old_switch = $("#dm_switch>a").attr("data")+"";
        if(old_switch=="1"){
            clearInterval(dm_siv);
            dm_siv = setInterval(send, Number(dm_times));
        }
    });
    
    $(document).on('mouseover', '.myFlLi,.a-pop', function(){
        var $this_time = $(this);
        $this_time.addClass("open");
        $this_time.find(".a-pop").show();
    });
    $(document).on('mouseout', '.myFlLi,.a-pop', function(){
        var $this_time = $(this);
        $this_time.removeClass("open");
        $this_time.find(".a-pop").hide();
    });

})();