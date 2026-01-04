// ==UserScript==
// @name         onlinedu自动播放
// @namespace    c-h.cc
// @version      0.7.1
// @description  自动点击播放器元素以继续播放
// @author       JKRaks
// @match        *://www.onlinedu.org.cn/*
// @include      http://www.onlinedu.org.cn/*
// @include      https://www.onlinedu.org.cn/*
// @require      https://lib.baomitu.com/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/layer.min.js
// @icon         http://www.onlinedu.org.cn/images/logo.gif
// @license      GPL License
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.setClipboard
// @grant        GM.info
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/419126/onlinedu%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/419126/onlinedu%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    //框架渲染
    $("head").append('<script crossorigin="anonymous" integrity="sha512-bLT0Qm9VnAYZDflyKcBaQ2gg0hSYNQrJ8RilYldYQ1FxQYoCLtUjuuRuZo+fjqhx/qtq/1itJ0C2ejDxltZVFg==" src="https://lib.baomitu.com/jquery/3.5.1/jquery.min.js"></script>')
    $("head").append('<link rel="stylesheet" type="text/css" href="https://www.layuicdn.com/layui/css/layui.css" />')
    $("head").append('<link rel="stylesheet" type="text/css" href="https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/layer.min.css" />')
    $("head").append('<script src="https://www.layuicdn.com/layui/layui.js"></script>')
    $("head").append('<script src="https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/layer.min.js"></script>')

    layer.open({
		type: 1,
        id:'uul',
		title: '运行日志',
		shadeClose: true,
		shade: false,
		offset: 'r',
		area: ['200px', '410px'],
		content: '<div><a href="javascript:" id="btnLoadTime" class="layui-btn layui-btn-radius layui-btn-xs layui-btn-normal">设置选课延迟</a><p></p><a href="javascript:" id="btnStopScript" class="layui-btn layui-btn-radius layui-btn-xs layui-btn-normal">停止脚本</a><a href="javascript:" id="btnReloadScript" class="layui-btn layui-btn-radius layui-btn-xs layui-btn-normal">重新运行脚本</a></div><ul id="uul" style="list-style:\'✔\';height:250px;width:170px;overflow:auto;margin:auto;margin-top:5px"><li id="startLi">已启动</li></ul><div id="dvNowClass" style="width:80%;height:40px"></div><p style="margin:5px">当前播放状态:<span id="nowIsLoading"></span></p>',
	});
    layer.open({
        type: 1,
        id:'setTime',
        title: '延迟选课设置',
        shadeClose: true,
        shade: false,
        area: ['240px', '170px'],
        content: '<div><input id="txtNum" type="number" name="num" lay-verify="title" autocomplete="off" placeholder="请输入延迟时间" class="layui-input" /><button type="button" id="btnUpdateLoadTime" class="layui-btn layui-btn-normal layui-btn-sm">确认</button><span>单位:毫秒;请根据网页加载速度修改</span><p>当前:&nbsp;&nbsp;&nbsp;&nbsp;默认:</p><span id="NowLoadTime"></span><span>&nbsp;&nbsp;&nbsp;&nbsp;3000</span></div>',
        cancel: function(){
            //右上角关闭回调
            $("#layui-layer2").hide();
            return false
        }
    });
    $("#layui-layer2").hide();

    //程序入口
    function Inside(){
        setSelectClassTimer()
        setAutoVedioTimer()
    }

    //定义定时器
    var outTimer;
    var intTimer;

    var loadTime;
    //取出延迟启动值
    try{
        loadTime = GM_getValue('loadTime',3000)
    }
    catch(err){
        GM_setValue('loadTime',3000)
        loadTime = 3000
    }

    //设置自动选课定时器
    function setSelectClassTimer(){
        //自动选课
        outTimer=setTimeout(function(){
            AutoSelectCalss();
        },loadTime);
    }
    //自动选课方法
    function AutoSelectCalss(){
        var $Lst=$(".el-progress__text")
        for(var i=0;i<$Lst.length;i++){
            if($Lst.eq(i).text()!="100%"){
                if(!$Lst.eq(i).parent().parent().parent().parent().prev().find("h3").prev().is('.hj_bg_color'))
                    $Lst.eq(i).parent().parent().parent().parent().prev().find("h3").click()
                $Lst.eq(i).parent().parent().click()
                $Lst.eq(i).click()
                return;
            }
            layer.msg('自动选课已运行完毕,若未自动选课,则请手动选课');
        }
    }

    //等待时间设置
    var stayTime;
    //取出等待时间
    try{
        stayTime = GM_getValue('stayTime',33)
    }
    catch(err){
        GM_setValue('stayTime',33)
        stayTime = 33
    }
    //缓冲次数
    var loadingTime=0;
    //设置自动播放定时器
    function setAutoVedioTimer(){
        //定时判断视频是否暂停
        intTimer=setInterval(function(){
            try{
                var vdo =$('video').get(0)
                var State = vdo.paused
                if(State){
                    ck()
                }
                //判断是否在缓冲
                if($("#dplayer").is(".dplayer-loading")){
                    loadingTime+=1;
                    $("#nowIsLoading").text("缓冲中")
                }else if($("#dplayer").is(".dplayer-playing")){
                    loadingTime=0;
                    $("#nowIsLoading").text("播放中")
                }
                //连续缓冲时间超过等待时间则重新载入页面
                if(loadingTime>stayTime){
                    window.location.reload();
                }
                checkPage()
            }
            catch(err){
                checkPage()
            }
        },300)
    }
    //重放日志
    function ck(){
        $(".dplayer-video-wrap").click()
        $("#uul li:eq(0)").before('<li>'+getNow()+'重新播放</li>')
    }
    //时间获取
    function getNow() {
        var myDate = new Date();
        var month=myDate.getMonth()+1;
        var date=myDate.getDate();
        var h=myDate.getHours();
        var m=myDate.getMinutes();
        var s=myDate.getSeconds();
        var now = month+'/'+date+' '+h+':'+m+':'+s;
        return now
    }

    //检查页面是否为课程视频页面
    function checkPage(){
        if(window.location.pathname!='/video'){
            clearTimer()
            $("#nowIsLoading").text("检测到当前页面不是播放页面,已停止运行脚本")
        }
    }

    //定时器清除
    function clearTimer(){
        clearInterval(outTimer);
        clearInterval(intTimer);
    }

    //显示延迟加载
    $("#btnLoadTime").click(function(){
        $("#layui-layer2").show()
        $("#NowLoadTime").text(GM_getValue('loadTime',3000))
    })
    //自定义延迟启动
    $("#btnUpdateLoadTime").click(function(){
        var Time = $("#txtNum").val();
        if (!(/(^[1-9]\d*$)/.test(Time)))
            layer.msg("有误")
        else{
            layer.msg("启动延迟设置为 "+Time+" ms")
            GM_setValue("loadTime",Time)
            $("#layui-layer2").hide();
        }
    })
    $("#btnReloadScript").click(function(){
        clearTimer()
        Inside();
        $("#uul li:eq(0)").before('<li>脚本已重新运行</li>')
    })
    $("#btnStopScript").click(function(){
        clearTimer()
        $("#uul li:eq(0)").before('<li>脚本已停止</li>')
    })

    Inside();
})();