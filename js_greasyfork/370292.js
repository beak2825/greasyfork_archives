// ==UserScript==
// @name         直播工具箱
// @namespace    https://greasyfork.org/zh-CN/users/117402
// @version      2.3.2.3
// @description  屏蔽了用户进入提示，各种vip图标，过滤刷屏弹幕，屏蔽礼物，斗鱼画中画等。
// @author       ski.原作者khanid
// @match        *://*.douyu.com/*
// @match        *://*.panda.tv/*
// @match        *://*.zhanqi.tv/*
// @match        *://*.huya.com/*
// @match        *://*.longzhu.com/*
// @match        *://live.bilibili.com/*
// @icon         https://live.bilibili.com/favicon.ico
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/370292/%E7%9B%B4%E6%92%AD%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/370292/%E7%9B%B4%E6%92%AD%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==
(function () {
    'use strict';

    var filter = [
        /^[^\u4e00-\u9fa5].*?6{3}.*?[^\u4e00-\u9fa5]$/,
        /^233/,
        /^111/,
        /^222/,
        /^333/,
        /^\d{2,}$/,
        /^\?+$/,
        /^\？+$/,
        /([a-zA-Z])\1{4,}/,
        /^[^\u4e00-\u9fa5](\S)(\1){5,}[^\u4e00-\u9fa5]$/,
        /^[^\u4e00-\u9fa5]$/
    ];
    var defilter = filter;
    var userfilter = GM_getValue('userfilter', "");
    var fontsize = GM_getValue('fontsize','18px');
    var n1=0,n2=0,n3=0,n6=0,n23=0,nq=0,activenum;
    var actman=new Array();
    setTimeout(function () {
        $('#filtertext').val(userfilter);
    }, 2000);
    //读取用户配置
 /*   if (userfilter != 0 && userfilter != '') {
        if (userfilter.indexOf('/,/') > 0) {
            var usergroup = userfilter.split(',');
            filter = $.merge(filter, usergroup);
        } else {
            filter.push(userfilter);
        }
    }*/
    $(document).ready(function () {
        if (location.href.indexOf('douyu.com') > 0) {
            setTimeout(function () {
                douyu();
            }, 200);
        }
        if (location.href.indexOf('panda.tv') > 0) {
            setTimeout(function () {
                panda();
            }, 1000);
        }
        if (location.href.indexOf('zhanqi.tv') > 0) {
            setTimeout(function () {
                zhanqi();
            }, 1000);
        }
        if (location.href.indexOf('huya.com') > 0) {
            setTimeout(function () {
                huya();
            }, 1000);
        }
        if (location.href.indexOf('longzhu.com') > 0) {
            setTimeout(function () {
                longzhu();
            }, 1000);
        }
        if (location.href.indexOf('bilibili.com') > 0) {
            setTimeout(function () {
                bilibili();
            }, 1000);
        }
    });
    function douyu() {
        hidead();
        douyucss();
        publiccss();
        dmplugin();
/*        $("body").append('<script>setInterval(function(){jQuery(document).trigger("mousemove")}, 60000);</script>');
        setTimeout(function(){
            var roomid=/\d+/.exec($(".anchor-cover-wrap").attr("href"));
            $("#showroomid").text("房间号："+ roomid);
        },4000);*/
        var dmnum = 0,
            dmave = new Array(25),
            dmi = 0,
            dmavi = 0,
            dmopline = 0,
            dmcolors,dmimage,fansicon,dmpos,offdm;
        //弹幕计数
        setInterval(function() {
            if (dmi > 24) {
                dmi = 0;
            }
            dmave[dmi] = dmnum;
            dmavi = (Math.max.apply(null, dmave) - Math.min.apply(null, dmave)) / 5;
            dmi++;
        },200);
        $('.focus-box-con').css('width', '250px');
        $('#js-fans-rank').hide();
        $('#js-chat-cont').prepend('<input type="hidden" id="chatboxhg" value="0" />');
        $('#js-room-video').prepend('<div id="dmbox" style="width:100%;position:absolute;top:0px;z-index:99;"></div>');
        $(".r-else").append('<li><span id="showroomid">房间号：</span></li>');
        $('body').prepend('<div id="sebox"><div id="seflash"></div><div id="coor"></div></div>');
        $('#sebox').prepend('<div id="seboxtitle"><span id="changeroom">切换房间</span><span id="closesebox">关闭</span></div>');
        $('#sebox').prepend('<div id="setroom"><input type="text" id="roomid" placeholder="请输入房间号"/><input id="setroomid" type="button" value="确定"><input id="cancelchange" type="button" value="取消"></div>');
        //$(".r-else").append('<li title="统计不重复的发言用户数量"><span id="showroomid">活跃人数：</span><span id="active">0</span><button id="clearactive" style="margin-left:10px;">清空</button></li>');
        $('#gift-content').before('<div style="float:left;position:relative;"><input type="button" id="showsebox" value="打开画中画"><div id="opendmbt"><span id="dmkg"></span><input type="hidden" id="cjdm_state" value="0"><span id="kgstate">插件弹幕关</span></div><div id="dmset"><div></div>');
        $('#opendmbt').after('<div tabindex="99" id="dmsetbox"></div>');
        $('#dmsetbox').append('<div style="margin-left:7px;margin-top:5px;"><span>关注用户：</span><input type="text" id="highline" placeholder="格式：用户名/用户名/……" width="180"></div>');
        $('#dmsetbox').append('<div style="margin-left:7px;margin-top:5px;"><span>弹幕速度：</span><input type="number" id="dmspeed" value="16" max="30" min="5"><span style="margin-left:10px;">透明度：</span><input type="number" id="dmop" value="10" max="10" min="1"></div>');
        $('#dmsetbox').append('<div style="margin-left:7px;margin-top:5px;"><span>屏蔽低级用户：</span><input type="number" id="userlevel" value="0" min="0"><span style="margin-left:10px;">字体大小：</span><input type="number" id="dmsize" value="18" max="28" min="14"></div>');
        $('#dmsetbox').append('<div style="margin-left:7px;margin-top:5px;"><span>弹幕位置：</span><select id="dmpos"><option value ="0">上方</option><option value ="1">下方</option></select><span style="margin-left:10px;">关闭弹幕提示：</span><select id="offdm"><option value ="0">开启</option><option value ="1">关闭</option></select></div>');
        $('#dmsetbox').append('<div style="margin-left:7px;margin-top:20px;"><div class="slideThree"><p>彩色弹幕</p><input type="checkbox" id="dmcolorswitch" value="None" checked><label for="dmcolorswitch"></label></div><div class="slideThree" style="margin-left:5px;"><p>表情过滤</p><input type="checkbox" id="dmimage" value="None"><label for="dmimage"></label></div><div class="slideThree" style="margin-left:5px;"><p>火箭过滤</p><input type="checkbox" id="rocketfilter" value="None"><label for="rocketfilter"></label></div><div class="clear"></div></div>');
        $('#dmsetbox').append('<div style="margin-left:7px;margin-top:20px;"><div class="slideThree"><p>铭牌过滤</p><input type="checkbox" id="fans-icon" value="None" checked><label for="fans-icon"></label></div><div class="slideThree" style="margin-left:5px;"><p>弹幕背景</p><input type="checkbox" id="dmbgcolor" value="None" checked><label for="dmbgcolor"></label></div><div class="slideThree" style="margin-left:5px;"><p>弹幕穿透</p><input type="checkbox" id="dmthrough" value="None"><label for="dmthrough"></label></div><div class="clear"></div></div>');
        $('#dmsetbox').append('<div style="margin-left: 7px;margin-top: 20px;width: 90%;height: auto;border: 1px solid #999;padding: 5px;" id="h5box"></div>');
        $('#h5box').append('<div><input type="checkbox" id="jcts"><label for="jcts">屏蔽竞猜提示框</label></div>');
        $('#h5box').append('<div><input type="checkbox" id="autoh5"><label for="autoh5">自动开启Html5播放器</label></div>');
        $('#h5box').append('<div><input type="checkbox" id="pbcj" disabled><label for="pbcj">屏蔽抽奖框</label></div>');
        $('#h5box').append('<div><input type="checkbox" id="qmhd" disabled><label for="qmhd">屏蔽亲密互动</label></div>');
        $('#h5box').append('<div><input type="checkbox" id="hfgb" disabled><label for="hfgb">屏蔽横幅广播</label></div>');
        $('#dmsetbox').append('<input type="button" id="setfilterbt" value="保存并关闭">');
        $('.focus-box-con').append('<button type="button" id="fansbox" value="1">显示粉丝区→</button>');
        $("#js-chat-cont").prepend('<div id="dmjs"></div>');
        $("#dmjs").prepend('<div class="dmnumbox" id="dmjs_n6" style="display:none;"><div class="icon6"></div><div class="numpic nx"></div><div class="baiwei numpic alln n0" style="display:none;"></div><div class="shiwei numpic alln n0" style="display:none;"></div><div class="gewei numpic alln n0"></div></div>');
        $("#dmjs").prepend('<div class="dmnumbox" id="dmjs_nq" style="display:none;"><div class="iconq"></div><div class="numpic nx"></div><div class="baiwei numpic alln n0" style="display:none;"></div><div class="shiwei numpic alln n0" style="display:none;"></div><div class="gewei numpic alln n0"></div></div>');
        var playerpos = $("#js-room-video").offset().top-85;
        setTimeout(function(){$("body").animate({scrollTop:playerpos},400);},1000);
        //读取设置
        var dmspeed = GM_getValue('dmspeed', 16);
        var highline=GM_getValue('highline','');
        $("#highline").val(highline);
        dmimage=GM_getValue("dmimage",0);
        dmcolors=GM_getValue("dmcolor",1);
        dmpos=GM_getValue("dmpos",0);
        offdm=GM_getValue("offdm",0);
        var userlevel=GM_getValue("userlevel",0);
        var rocketfilter=GM_getValue("rocketfilter",0);
        fansicon=GM_getValue("fansicon",1);
        var dmbgcolor=GM_getValue("dmbgcolor",1);
        var dmthrough=GM_getValue("dmthrough",0);
        $("#userlevel").val(userlevel);
        $("#dmsize").val(parseInt(fontsize));
        var autoh5 = GM_getValue("autoh5",0);
        var pbcj = GM_getValue("pbcj",0);
        var qmhd = GM_getValue("qmhd",0);
        var hfgb = GM_getValue("hfgb",0);
        var jcts = GM_getValue("jcts",0);
        if(jcts==0){
            $("#jcts").attr("checked",false);
        }else{
            $("#jcts").attr("checked",true);
            GM_addStyle(".guess-user-reminding-out{display:none!important}");
        }
        if(autoh5==0){
            $("#autoh5").attr("checked",false);
        }else{
            $("#autoh5").attr("checked",true);
            $("#pbcj").removeAttr("disabled");
            $("#qmhd").removeAttr("disabled");
            $("#hfgb").removeAttr("disabled");
        }
        if(pbcj==0){
            $("#pbcj").attr("checked",false);
        }else{
            $("#pbcj").attr("checked",true);
        }
        if(qmhd==0){
            $("#qmhd").attr("checked",false);
        }else{
            $("#qmhd").attr("checked",true);
            var chktime=0;
            const chkqmhd = setInterval(function(){
                if($("div[class^=black]").length){
                    $("div[class^=black]").next().remove();
                    clearInterval(chkqmhd);
                }
                chktime++;
                if(chktime>300){
                    clearInterval(chkqmhd);
                }
            },200);
        }
        if(hfgb==0){
            $("#hfgb").attr("checked",false);
        }else{
            $("#hfgb").attr("checked",true);
            const delcan = setInterval(function(){
                if($("canvas[class^=bigEffect]").length){
                    $("canvas[class^=bigEffect]").remove();
                    $("canvas[class^=canvas]").remove();
                    $("div[class^=customBc]").remove();
                    clearInterval(delcan);
                }
            },200);
        }
        if(dmpos==1){
            $("#dmpos").val(1);
            $("#dmbox").css("top","auto");
            $("#dmbox").css("bottom","40px");
        }else{
            $("#dmpos").val(0);
        }
        if(dmcolors==0){
            $("#dmcolorswitch").attr("checked",false);
        }else{
            $("#dmcolorswitch").attr("checked",true);
        }
        if(dmimage==0){
            $("#dmimage").attr("checked",false);
        }else{
            $("#dmimage").attr("checked",true);
        }
        if(fansicon==0){
            $("#fans-icon").attr("checked",false);
        }else{
            $("#fans-icon").attr("checked",true);
        }
        if(dmbgcolor==0){
            $("#dmbgcolor").attr("checked",false);
        }else{
            $("#dmbgcolor").attr("checked",true);
        }
        if(dmthrough==0){
            $("#dmthrough").attr("checked",false);
            $("#dmbox").css("pointer-events","auto");
        }else{
            $("#dmthrough").attr("checked",true);
            $("#dmbox").css("pointer-events","none");
        }
        if(rocketfilter==0){
            $("#rocketfilter").attr("checked",false);
        }else{
            $("#rocketfilter").attr("checked",true);
            GM_addStyle(".giftbatter-box{display:none!important;}");
        }
        $('#dmop').val(GM_getValue('dmop', 10));
        $('#dmspeed').val(dmspeed);
        $('#dmbox').css('opacity', $('#dmop').val() / 10);
        if(GM_getValue("danmu_state",0)==1){
            if(offdm==0){opendm();$("#offdm").val(0);}else{opendm(); $('#dmbox').barrager.removeAll();$("#offdm").val(1);}
            if(autoh5){
                var chkdbn=0;
                const chkdmbt = setInterval(function(){
                    if($("div[class^=showdanmu]").length){
                        $("div[class^=showdanmu]").click();
                        clearInterval(chkdmbt);
                    }
                    chkdbn++;
                    if(chkdbn>150){
                        clearInterval(chkdmbt);
                    }
                },200);
            }
        }
        /*清空活跃人数
        $("#clearactive").click(function(){
            actman.splice(0,actman.length);
            $("#active").text(0);
        });
        */
        //屏蔽抽奖
        function _pbcj(){
            if($('div[class^=luckDraw]').length){
                $('div[class^=luckDraw]').hide();
            }
        }
        if(pbcj==1){
            const chkluckdraw = setInterval(function(){
                if($("div[id^=__h5player]").length){
                    const h5player=$("div[id^=__h5player]");
                    h5player.on('DOMNodeInserted',_pbcj);
                    clearInterval(chkluckdraw);
                }
            },200);
        }
        //
        $("#autoh5").click(function(){
            if($("#autoh5").is(":checked")){
                $("#pbcj").removeAttr("disabled");
                $("#qmhd").removeAttr("disabled");
                $("#hfgb").removeAttr("disabled");
            }else{
                $("#pbcj").attr("disabled","disabled");
                $("#qmhd").attr("disabled","disabled");
                $("#pbcj").removeAttr("checked");
                $("#qmhd").removeAttr("checked");
                $("#hfgb").removeAttr("checked");
            }
        });
        //切换h5播放器
        if(autoh5){
            var switchH5 = setInterval(function(){
                if(unsafeWindow.__player.isH5Support && !unsafeWindow.__player.isSwitched){
                    unsafeWindow.__player.switchPlayer('h5');
                    clearInterval(switchH5);
                }
            },300);
        }
        //写入设置
        $('#setfilterbt').click(function () {
            GM_setValue('dmspeed', $('#dmspeed').val());
            GM_setValue('dmop', $('#dmop').val());
            GM_setValue('userlevel', $('#userlevel').val());
            GM_setValue('fontsize', $('#dmsize').val()+"px");
            GM_setValue('dmpos',$("#dmpos").val());
            GM_setValue('offdm',$("#offdm").val());
            GM_setValue('highline',$("#highline").val());
            highline=$("#highline").val();
            fontsize=$('#dmsize').val()+"px";
            userlevel=$('#userlevel').val();
            if($("#offdm").val()=='1'){
                offdm=1;
            }else{
                offdm=0;
            }

            if($("#dmpos").val()=='0'){
                $("#dmbox").css("top","0px");
                dmpos=0;
            }else{
                $("#dmbox").css("top","auto");
                $("#dmbox").css("bottom","40px");
                dmpos=1;
            }
            if($("#jcts").is(":checked")){
                GM_setValue('jcts', 1);
                jcts=1;
                GM_addStyle(".guess-user-reminding-out{display:none!important}");
            }else{
                GM_setValue('jcts', 0);
                jcts=0;
            }
            if($("#autoh5").is(":checked")){
                GM_setValue('autoh5', 1);
                autoh5=1;
            }else{
                GM_setValue('autoh5', 0);
                autoh5=0;
            }
            if($("#pbcj").is(":checked")){
                GM_setValue('pbcj', 1);
                pbcj=1;
                if($('div[class^=luckDraw]').length){
                    $('div[class^=luckDraw]').hide();
                }
                $("div[id^=__h5player]").on('DOMNodeInserted',_pbcj);
            }else{
                GM_setValue('pbcj', 0);
                pbcj=0;
            }
            if($("#qmhd").is(":checked")){
                GM_setValue('qmhd', 1);
                qmhd=1;
                $("div[class^=black]").next().remove();
            }else{
                GM_setValue('qmhd', 0);
                qmhd=0;
            }
            if($("#hfgb").is(":checked")){
                GM_setValue('hfgb', 1);
                hfgb=1;
                $("canvas[class^=bigEffect]").remove();
                $("canvas[class^=canvas]").remove();
                $("div[class^=customBc]").remove();
            }else{
                GM_setValue('hfgb', 0);
                hfgb=0;
            }
            if($("#dmcolorswitch").is(":checked")){
                GM_setValue('dmcolor', 1);
                dmcolors=1;
            }else{
                GM_setValue('dmcolor', 0);
                dmcolors=0;
            }
            if($("#dmimage").is(":checked")){
                GM_setValue('dmimage', 1);
                dmimage=1;
            }else{
                GM_setValue('dmimage', 0);
                dmimage=0;
            }
            if($("#fans-icon").is(":checked")){
                GM_setValue('fansicon', 1);
                fansicon=1;
            }else{
                GM_setValue('fansicon', 0);
                fansicon=0;
            }
            if($("#dmbgcolor").is(":checked")){
                GM_setValue('dmbgcolor', 1);
                dmbgcolor=1;
            }else{
                GM_setValue('dmbgcolor', 0);
                dmbgcolor=0;
            }
            if($("#dmthrough").is(":checked")){
                GM_setValue('dmthrough', 1);
                dmthrough=1;
                $("#dmbox").css("pointer-events","none");
            }else{
                GM_setValue('dmthrough', 0);
                dmthrough=0;
                $("#dmbox").css("pointer-events","auto");
            }
            if($("#rocketfilter").is(":checked")){
                GM_setValue('rocketfilter', 1);
                GM_addStyle(".giftbatter-box{display:none!important;}");
            }else{
                GM_setValue('rocketfilter', 0);
            }
            setTimeout(function () {
                $('#dmsetbox').fadeOut();
            }, 500);
            $('#dmbox').css('opacity', $('#dmop').val() / 10);
        });
        $('#changeroom').click(function () {
            $('#setroom').fadeIn();
            $('#changeroom').fadeOut();
        });
        $('#cancelchange').click(function () {
            $('#setroom').fadeOut();
            $('#changeroom').fadeIn();
        });
        $('#opendmbt').click(function () {
            opendm();
        });
        $('#dmset').click(function () {
            $('#dmsetbox').fadeIn();
            $('#filtertext').select();
        });
        $('#sebox').mouseover(function () {
            $('#seboxtitle').stop();
            $('#seboxtitle').fadeIn();
        });
        $('#sebox').mouseout(function () {
            $('#seboxtitle').stop();
            $('#seboxtitle').fadeOut();
        });
        //弹幕过滤
        function glmain(lastli){
            //过滤进入房间提示
            var gl = 0,own = 0;
            if (lastli.find('a.hy-name').length) {
                gl = 1;
                lastli.remove();
                return false;
            }
            if(lastli.find(".hy-org").length){
                gl = 1;
                lastli.remove();
                return false;
            }
            if(userlevel!=0){
                if(lastli.data("level")<userlevel){
                    gl=1;
                    lastli.remove();
                    console.log("低等级用户被过滤："+lastli.data("level"));
                    return false;
                }
            }
            //活跃发言人数统计
            /*var userid = lastli.find(".nick.js-nick").attr("rel");
            if($.inArray(userid,actman)==-1){
                actman.push(userid);
                $("#active").text(actman.length);
            }*/
            //过滤正则
            var textbox;
            if (lastli.find('span.text-cont').length) {
                textbox = lastli.find('span.text-cont');
            } else {
                textbox = lastli.find('span.m');
                own = 1;
            }
            var str = textbox.text();
            //加亮关注
            if(lastli.find('img.icon-role').length>0){
                let imgsrc = lastli.find("img.icon-role").attr("src");
                if(imgsrc.indexOf('super_admin')>0){
                    var barrager={
                        'info': lastli.find(".name a").text()+str,
                        'top': 600,
                        'speed': 20,
                        'size':18,
                        'superadmin':1,
                        'focus':1
                    };
                    $('#dmbox').barrager(barrager);
                }
            }
            if(highline!=''){
                var keyword = highline.split('/');
                var username = lastli.find(".nick.js-nick").text();
                username=username.replace("：","");
                $.each(keyword,function(i,value){
                    if(username==value){
                        q = textbox.find('img').length;
                        var barrager={
                            'info': lastli.find(".name a").text()+str,
                            'top': 600,
                            'speed': 20,
                            'size':18,
                            'bgcolor':"rgba(183, 0, 0,0.8)",
                            'focus':1
                        };
                        if (q >= 1) {barrager.img=textbox.find('img').attr('src');barrager.imgnum=q;}
                        $('#dmbox').barrager(barrager);
                        lastli.addClass('highlinechat');
                    }
                });
            }
            //filter
            $.each(filter, function (i, value) {
                if (eval(value).test(str)) {
                    lastli.remove();
                    switch (i) {
                        case 0:
                            n6++;
                            n6gal();
                            break;
                        case 6:
                            nq++;
                            nqgal();
                            break;
                        case 7:
                            nq++;
                            nqgal();
                            break;
                    }
                    gl = 1;
                    return false;
                }
            });
            if (gl==1){
                return false;
            }
            if (gl != 1) {
                dmnum++;
                var q;
                //过滤vip图标
                if(fansicon==1){
                    lastli.find(".chat-icon-pad[data-msg='fans']").remove();
                }
                lastli.removeClass("noble-chart");
                //------------
                if(dmimage==1){
                    textbox.find("img").remove();
                    if(str==""){
                        lastli.remove();
                    }
                }else{
                    q = textbox.find('img').length;
                }
                if ($('#cjdm_state').val() == '1' && (str!="" || q>0)) {
                    dmavi = (dmavi > 1) ? dmavi : 1;
                    var maxline=parseInt($("#js-room-video").height()/35);
                    var wdfactor=1920/$("#js-room-video").width()*2.8;
                    var dmline = (Math.round(dmavi * wdfactor) > 3) ? Math.round(dmavi * wdfactor)  : 4;
                    dmline = (dmline < maxline-1) ? dmline  : maxline-1;
                    dmopline = (dmopline < dmline) ? dmopline : 0;
                    var dmopl = dmopline * 35 + 1;
                    dmopline++;
                    var barrager={
                        'info': str,
                        'top': dmopl,
                        'speed': $('#dmspeed').val(),
                        'size':fontsize,
                        'username':lastli.find(".name a").text()
                    };
                    if (own == 1) {barrager.own=1;}
                    if (dmpos==1) {barrager.dmpos=1;}
                    if (q >= 1) {barrager.img=textbox.find('img').attr('src');barrager.imgnum=q;}
                    if(dmbgcolor){
                        barrager.bgcolor="rgba(60, 60, 60, 0.4)";
                    }else{
                        barrager.bgcolor="rgba(60, 60, 60, 0)";
                    }
                    if(dmcolors==1){
                        var dmcolor = textbox.css('color');
                        if(dmcolor&&dmcolor!="rgb(85, 85, 85)"){
                            barrager.color=dmcolor;
                        }
                    }
                    $('#dmbox').barrager(barrager);
                }
            }
        }//----------------------getli
        var dmmain = function (records) {
            var lastli,dmul,lastli_2,lastli_3,lastli_4,lastli_5,lastli_6,lastli_7,lastli_8;
            if(records.map){
                records.map(function(record) {
                    dmul = record.target;
                    lastli = $(dmul).children("li:last");
                    lastli_2=$(dmul).children("li").eq(-2);
                    lastli_3=$(dmul).children("li").eq(-3);
                    lastli_4=$(dmul).children("li").eq(-4);
                    lastli_5=$(dmul).children("li").eq(-5);
                    lastli_6=$(dmul).children("li").eq(-6);
                    lastli_7=$(dmul).children("li").eq(-7);
                    lastli_8=$(dmul).children("li").eq(-8);
                });
            }else{
                lastli = $(this).find('.jschartli:last');
            }
            if(!lastli.hasClass("process")){lastli.addClass("process");glmain(lastli);}
            if(!lastli_2.hasClass("process")){lastli_2.addClass("process");glmain(lastli_2);}
            if(!lastli_3.hasClass("process")){lastli_3.addClass("process");glmain(lastli_3);}
            if(!lastli_4.hasClass("process")){lastli_4.addClass("process");glmain(lastli_4);}
            if(!lastli_5.hasClass("process")){lastli_5.addClass("process");glmain(lastli_5);}
            if(!lastli_6.hasClass("process")){lastli_6.addClass("process");glmain(lastli_6);}
            if(!lastli_7.hasClass("process")){lastli_7.addClass("process");glmain(lastli_7);}
            if(!lastli_8.hasClass("process")){lastli_8.addClass("process");glmain(lastli_8);}
        };
        var obser2 = new MutationObserver(dmmain);
        var obj2 = document.querySelector('.chat-cont-wrap .c-list');
        var options2 = {
            'childList': true
        };
        obser2.observe(obj2, options2);
        //$('.chat-cont-wrap .c-list').on('DOMNodeInserted',dmmain);
        //画中画
        $('#showsebox').click(function () {
            $('#sebox').fadeIn(300);
        });
        $('#closesebox').click(function () {
            $('#sebox').fadeOut(300);
        });
        $('.list-wrap').on('DOMNodeInserted', function () { //关注画中画
            $(".f-list li").each(function(){
                if($(this).find(".pip").length==0){
                    $(this).children("p").append('<span class="pip">画中画</span>');
                }
            });
        });
        $('.list-wrap').on('click', '.pip', function () { //关注画中画写入地址
            var rid = $(this).prev().attr('href');
            rid = rid.replace('/', '');
            $('#sebox').fadeIn();
            getval(rid);
        });
        $('#setroomid').click(function () {
            getval($('#roomid').val());
        });
        //创建可移动缩放窗口
        $(function () {
            $(document).mousemove(function (e) {
                if (!!this.move) {
                    var scrollTop = $(document).scrollTop();
                    var posix = !document.move_target ? {
                        'x': 0,
                        'y': 0
                    }
                    : document.move_target.posix,
                        callback = document.call_down || function () {
                            $(this.move_target).css({
                                'top': e.pageY - posix.y - scrollTop,
                                'left': e.pageX - posix.x
                            });
                        };
                    callback.call(this, e, posix);
                }
            }).mouseup(function (e) {
                if (!!this.move) {
                    var callback = document.call_up || function () {
                    };
                    callback.call(this, e);
                    $.extend(this, {
                        'move': false,
                        'move_target': null,
                        'call_down': false,
                        'call_up': false
                    });
                }
            });
            var $box = $('#sebox').mousedown(function (e) {
                var offset = $(this).offset();
                this.posix = {
                    'x': e.pageX - offset.left,
                    'y': e.pageY - offset.top
                };
                $.extend(document, {
                    'move': true,
                    'move_target': this
                });
            }).on('mousedown', '#coor', function (e) {
                var posix = {
                    'w': $box.width(),
                    'h': $box.height(),
                    'x': e.pageX,
                    'y': e.pageY
                };
                $.extend(document, {
                    'move': true,
                    'call_down': function (e) {
                        $box.css({
                            'width': Math.max(30, e.pageX - posix.x + posix.w),
                            'height': Math.max(30, e.pageY - posix.y + posix.h)
                        });
                    }
                });
                return false;
            });
        });
        function getval(x) { //取得播放属性
            $("#seflash").html('<embed width="100%" height="100%" allownetworking="all" allowscriptaccess="always" src="https://staticlive.douyucdn.cn/common/share/play.swf?room_id=' + x + '" quality="high" bgcolor="#000" wmode="window" allowfullscreen="true" allowFullScreenInteractive="true" type="application/x-shockwave-flash">')
            $('#setroom').fadeOut();
            $('#changeroom').fadeIn();
        }
        // 过滤礼物及广告
        function hidead() {
            var shielding=setInterval(function(){
                if($(".jschartli").length>0||$(".giftbatter-item.item-1,.giftbatter-item.item-2,.giftbatter-item.item-3,.giftbatter-item.item-4").length>0){
                    if(!$("#js-shie-gift").hasClass("shie-switch-open")){
                        $("#shie-switch").click();
                        clearInterval(shielding);
                    }
                }else{
                    if($("#js-shie-gift").hasClass("shie-switch-open")){
                        $("#shie-switch").click();
                    }
                }
            },200);
            setTimeout(function(){
                if(!$("#js-shie-gift").hasClass("shie-switch-open")){
                    $("#shie-switch").click();
                }
                clearInterval(shielding);
            },8000);
            setTimeout(function () {
                var chatboxheight = $('#js-chat-cont').height();
                $('#chatboxhg').val(chatboxheight);
                $('#js-chat-cont').css({"top":"0px"});
                $('.giftbatter-noble-enter,.chat-ad,.chat-notice,.fishop-anchor-recommands-box,.pay-task,.room-ad-top,.f-sign-cont,.assort-ad,.no-login,.fishop-anchor-push-box,.pay-task').remove();
            }, 1000);
        }
        //隐藏粉丝区
        $('#fansbox').click(function() {
            var chatboxheight;
            chatboxheight = $('#js-chat-cont').height();
            if ($('#fansbox').val() == 1) {
                $('#fansbox').val(0);
                $('#js-fans-rank').show();
                $('#fansbox').html('隐藏粉丝区→');
            } else {
                $('#fansbox').val(1);
                $('#js-fans-rank').hide();
                $('#fansbox').html('显示粉丝区→');
            }
        });
        //flashvars过滤
    }
    function panda(){
        console.log('panda');
        publiccss();
        pandacss();
        dmplugin();
        var dmnum = 0,
            dmave = new Array(25),
            dmi = 0,
            dmavi = 0,
            dmopline = 0,
            dmcolors,dmimage,dmpos,offdm;
        //弹幕计数
        setInterval(function() {
            if (dmi > 24) {
                dmi = 0;
            }
            dmave[dmi] = dmnum;
            dmavi = (Math.max.apply(null, dmave) - Math.min.apply(null, dmave)) / 5;
            dmi++;
        },200);
        $('.room-rank-container').hide();
        $('.room-chat-container').css('top', '0px');
        if($(".h5player-player-container").length){
            $('.h5player-player-container').prepend('<div id="dmbox" style="width:100%;position:absolute;z-index:999;"></div>');
        }else{
            $("#room-player-swf").after('<div id="dmbox" style="width:100%;position:absolute;z-index:999;"></div>');
        }
        $('.room-speical-gift-container').before('<div style="float:left;position:relative;left:16px;top:14px;"><div id="opendmbt"><span id="dmkg"></span><input type="hidden" id="cjdm_state" value="0"><span id="kgstate">插件弹幕关</span></div><div id="dmset"><div></div>');
        $('#opendmbt').after('<div tabindex="99" id="dmsetbox"><h3 style="text-align:center;font-size:16px;">自定义过滤</h3><input type="text" id="filtertext" placeholder="格式（英文符号）：/关键字/,/关键字/" value=""><input type="button" id="setfilterbt" value="保存并关闭"></div>');
        $('#filtertext').after('<div style="margin-left:7px;margin-top:5px;"><span>弹幕位置：</span><select id="dmpos"><option value ="0">上方</option><option value ="1">下方</option></select><span style="margin-left:10px;">关闭弹幕提示：</span><select id="offdm"><option value ="0">开启</option><option value ="1">关闭</option></select></div>');
        $('#filtertext').after('<div style="margin-left:7px;margin-top:5px;"><span>字体大小：</span><input type="number" id="dmsize" value="18" max="28" min="14"></div>');
        $('#filtertext').after('<div style="margin-left:7px;margin-top:5px;"><span>弹幕速度：</span><input type="number" id="dmspeed" value="16" max="30" min="5"><span style="margin-left:10px;">透明度：</span><input type="number" id="dmop" value="10" max="10" min="1"></div>');
        $('#setfilterbt').before('<div style="margin-left:7px;margin-top:20px;"><div class="slideThree"><p>表情过滤</p><input type="checkbox" id="dmimage" value="None"><label for="dmimage"></label></div><div class="slideThree" style="margin-left:5px;"><p>弹幕背景</p><input type="checkbox" id="dmbgcolor" value="None" checked><label for="dmbgcolor"></label></div><div class="slideThree" style="margin-left:5px;"><p>弹幕穿透</p><input type="checkbox" id="dmthrough" value="None"><label for="dmthrough"></label></div><div class="clear"></div></div>');
        $('.room-head-tool-follow').after('<button type="button" id="fansbox" style="line-height: 30px;width: 120px;margin-left:10px;border-radius: 5px;border: none;background-color: #04C073;color: #fff;font-size: 14px;" value="1">显示粉丝区→</button>');
        $(".room-chat-container").prepend('<div id="dmjs"></div>');
        $("#dmjs").prepend('<div class="dmnumbox" id="dmjs_n6" style="display:none;"><div class="icon6"></div><div class="numpic nx"></div><div class="baiwei numpic alln n0" style="display:none;"></div><div class="shiwei numpic alln n0" style="display:none;"></div><div class="gewei numpic alln n0"></div></div>');
        $("#dmjs").prepend('<div class="dmnumbox" id="dmjs_nq" style="display:none;"><div class="iconq"></div><div class="numpic nx"></div><div class="baiwei numpic alln n0" style="display:none;"></div><div class="shiwei numpic alln n0" style="display:none;"></div><div class="gewei numpic alln n0"></div></div>');
        $("#dmsize").val(parseInt(fontsize));
        $('#room-player-video-danmu>div').on('DOMNodeInserted', function () {
            var lastdm = $(this).find('div.cmt:last');
            var h5str = lastdm.text();
            $.each(filter, function (i, value) {
                if (value.test(h5str)) {
                    lastdm.remove();
                }
            });
        });
        var dmspeed = GM_getValue('dmspeed', 16);
        var dmimage=GM_getValue("dmimage",0);
        var dmop=GM_getValue('dmop', 10);
        var dmbgcolor=GM_getValue("dmbgcolor",1);
        var dmthrough=GM_getValue("dmthrough",0);
        var offdm=GM_getValue("offdm",0);
        dmpos=GM_getValue("dmpos",0);

        if(dmpos==1){
            $("#dmpos").val(1);
            $("#dmbox").css("top","auto");
            $("#dmbox").css("bottom","40px");
        }else{
            $("#dmpos").val(0);
        }
        if(dmbgcolor==0){
            $("#dmbgcolor").attr("checked",false);
        }else{
            $("#dmbgcolor").attr("checked",true);
        }
        if(dmthrough==0){
            $("#dmthrough").attr("checked",false);
            $("#dmbox").css("pointer-events","auto");
        }else{
            $("#dmthrough").attr("checked",true);
            $("#dmbox").css("pointer-events","none");
        }
        setTimeout(function(){
            if(dmimage==0){
                $("#dmimage").attr("checked",false);
            }else{
                $("#dmimage").attr("checked",true);
            }
            $('#dmop').val(dmop);
            $('#dmspeed').val(dmspeed);
            $('#dmbox').css('opacity', $('#dmop').val() / 10);
        },1000);
        if(GM_getValue("danmu_state",0)==1){
            if(offdm==0){opendm();$("#offdm").val(0);}else{opendm(); $('#dmbox').barrager.removeAll();$("#offdm").val(1);}
        }
        $('#opendmbt').click(function () {
            opendm();
        });
        $('#dmset').click(function () {
            $('#dmsetbox').fadeIn();
            $('#filtertext').select();
        });
        $('.room-chat-scroller').on('DOMNodeInserted', 'ul.room-chat-messages', function () {
            var lastli1 = $(this).find('li.room-chat-message').eq(-1);
            var lastli2 = $(this).find('li.room-chat-message').eq(-2);
            var lastli3 = $(this).find('li.room-chat-message').eq(-3);
            var lastli4 = $(this).find('li.room-chat-message').eq(-4);
            var lastli5 = $(this).find('li.room-chat-message').eq(-5);
            var lastli6 = $(this).find('li.room-chat-message').eq(-6);
            if(!lastli1.hasClass("process")){lastli1.addClass("process");glmain(lastli1);}
            if(!lastli2.hasClass("process")){lastli2.addClass("process");glmain(lastli2);}
            if(!lastli3.hasClass("process")){lastli3.addClass("process");glmain(lastli3);}
            if(!lastli4.hasClass("process")){lastli4.addClass("process");glmain(lastli4);}
            if(!lastli5.hasClass("process")){lastli5.addClass("process");glmain(lastli5);}
            if(!lastli6.hasClass("process")){lastli6.addClass("process");glmain(lastli6);}
        });
        function glmain(lastli){
            var gl=0;
            var str = lastli.find('.room-chat-content').text();
            if(str==""){gl=1;lastli.remove();return false;}
            $.each(filter, function (i, value) {
                if (eval(value).test(str)) {
                    lastli.remove();
                    switch (i) {
                        case 0:
                            n6++;
                            n6gal();
                            break;
                        case 6:
                            nq++;
                            nqgal();
                            break;
                        case 7:
                            nq++;
                            nqgal();
                            break;
                    }
                    gl=1;
                    return false;
                }
            });
            if (gl != 1) {
                dmnum++;
                var q;
                //------------
                if(dmimage==1){
                    lastli.find('i.icon-panda-emoji').remove();
                    if(str==""){
                        lastli.remove();
                    }
                }else{
                    q = lastli.find('.icon-panda-emoji').length;
                }
                if ($('#cjdm_state').val() == '1' && (str!="" || q>0)) {
                    dmavi = (dmavi > 1) ? dmavi : 1;
                    var maxline=parseInt(parseInt($(".room-player-box").css("height"))/35);
                    var dmline = (Math.round(dmavi * 3.5) > 3) ? Math.round(dmavi * 3.5)  : 4;
                    dmline = (Math.round(dmavi * 3.5) < maxline-1) ? Math.round(dmavi * 3.5)  : maxline-1;
                    dmopline = (dmopline < dmline) ? dmopline : 0;
                    var dmopl = dmopline * 35 + 1;
                    dmopline++;
                    var barrager={
                        'info': str,
                        'top': dmopl,
                        'speed': $('#dmspeed').val(),
                        'size':fontsize
                    };
                    if (lastli.find("span[data-is-self='true']").length) {barrager.own=1;}
                    if (q >= 1) {
                        var img=lastli.find('.icon-panda-emoji').css('background-image');
                        var url=/http.+gif/.exec(img);
                        barrager.img=url;
                        barrager.imgnum=q;
                    }
                    if (dmpos==1) {barrager.dmpos=1;}
                    if(dmbgcolor){
                        barrager.bgcolor="rgba(60, 60, 60, 0.4)";
                    }else{
                        barrager.bgcolor="rgba(60, 60, 60, 0)";
                    }
                    $('#dmbox').barrager(barrager);
                }
            }
        }
        $('#fansbox').click(function (e) {
            if ($('#fansbox').val() == 1) {
                $('#fansbox').val(0);
                $('.room-rank-container').show();
                $('.room-chat-container').css('top', '165px');
                $('#fansbox').html('隐藏粉丝区→');
            } else {
                $('#fansbox').val(1);
                $('.room-rank-container').hide();
                $('.room-chat-container').css('top', '0px');
                $('#fansbox').html('显示粉丝区→');
            }
        });
        $('#setfilterbt').click(function () {
            GM_setValue('userfilter', $('#filtertext').val());
            GM_setValue('dmspeed', $('#dmspeed').val());
            GM_setValue('dmop', $('#dmop').val());
            GM_setValue('offdm', $('#offdm').val());
            GM_setValue('fontsize', $('#dmsize').val()+"px");
            fontsize=$('#dmsize').val()+"px";
            GM_setValue('dmpos',$("#dmpos").val());
            if($("#offdm").val()=='1'){
                offdm=1;
            }else{
                offdm=0;
            }
            if($("#dmpos").val()==0){
                $("#dmbox").css("top","0px");
                dmpos=0;
            }else{
                $("#dmbox").css("top","auto");
                $("#dmbox").css("bottom","40px");
                dmpos=1;
            }
            if($("#dmimage").is(":checked")){
                GM_setValue('dmimage', 1);
                dmimage=1;
            }else{
                GM_setValue('dmimage', 0);
                dmimage=0;
            }
            if($("#dmbgcolor").is(":checked")){
                GM_setValue('dmbgcolor', 1);
                dmbgcolor=1;
            }else{
                GM_setValue('dmbgcolor', 0);
                dmbgcolor=0;
            }
            if($("#dmthrough").is(":checked")){
                GM_setValue('dmthrough', 1);
                dmthrough=1;
                $("#dmbox").css("pointer-events","none");
            }else{
                GM_setValue('dmthrough', 0);
                dmthrough=0;
                $("#dmbox").css("pointer-events","auto");
            }
            userfilter = $('#filtertext').val();
            if ($('#filtertext').val() == '') {
                filter = defilter;
                setTimeout(function () {
                    $('#dmsetbox').fadeOut();
                }, 500);
            } else {
                if (userfilter.indexOf('/,/') > 0) {
                    var usergroup = userfilter.split(',');
                    filter = $.merge(defilter, usergroup);
                } else {
                    filter = defilter;
                    filter.push(userfilter);
                }
                setTimeout(function () {
                    $('#dmsetbox').fadeOut();
                }, 500);
            }
            $('#dmbox').css('opacity', $('#dmop').val() / 10);
        });
    }
    function zhanqi(){
        publiccss();
        zhanqicss();
        dmplugin();

        $('.fans-list').hide();
        $(".js-right-chat-layer").height($(".js-right-chat-layer").height()+150);
        $(".slimScrollDiv").height($(".js-right-chat-layer").height());
        $(".js-chat-msg-scroll").height($(".js-right-chat-layer").height());
        $('#js-flash-panel').prepend('<div id="dmbox" style="width:100%;position:absolute;z-index:999;"></div>');
        $('.js-active-btn-list').append('<div style="margin-left:9px;margin-top:6px;"><div id="opendmbt"><span id="dmkg"></span><input type="hidden" id="cjdm_state" value="0"><span id="kgstate">插件弹幕关</span></div><div id="dmset"><div></div>');
        $('#opendmbt').after('<div tabindex="99" id="dmsetbox"><h3 style="text-align:center;font-size:16px;">自定义过滤</h3><input type="text" id="filtertext" placeholder="格式（英文符号）：/关键字/,/关键字/" value=""><input type="button" style="margin-top:60px;" id="setfilterbt" value="保存并关闭"></div>');
        $('#filtertext').after('<div style="margin-left:7px;margin-top:5px;"><span>字体大小：</span><input type="number" id="dmsize" value="18" max="28" min="14"><span style="margin-left:10px;">关闭弹幕提示：</span><select id="offdm"><option value ="0">开启</option><option value ="1">关闭</option></select></div>');
        $('#filtertext').after('<div style="margin-left:7px;margin-top:5px;"><span>弹幕速度：</span><input type="number" id="dmspeed" value="16" max="30" min="5"><span style="margin-left:10px;">透明度：</span><input type="number" id="dmop" value="10" max="10" min="1"></div>');
        $('#setfilterbt').before('<div style="margin-left:7px;margin-top:20px;"><div class="slideThree"><p>表情过滤</p><input type="checkbox" id="dmimage" value="None"><label for="dmimage"></label></div><div class="slideThree" style="margin-left:5px;"><p>弹幕背景</p><input type="checkbox" id="dmbgcolor" value="None" checked><label for="dmbgcolor"></label></div><div class="slideThree" style="margin-left:5px;"><p>弹幕穿透</p><input type="checkbox" id="dmthrough" value="None"><label for="dmthrough"></label></div><div class="clear"></div></div>');
        $('.js-room-follow-area').after('<button type="button" id="fansbox" style="float:right; margin-top:15px; line-height: 32px;width: 120px;margin-right:10px;border: none;background-color: #12b7f5;color: #fff;font-size: 14px;" value="1">显示粉丝区→</button>');
        $(".liveDialog-box").prepend('<div id="dmjs"></div>');
        $("#dmjs").prepend('<div class="dmnumbox" id="dmjs_n6" style="display:none;"><div class="icon6"></div><div class="numpic nx"></div><div class="baiwei numpic alln n0" style="display:none;"></div><div class="shiwei numpic alln n0" style="display:none;"></div><div class="gewei numpic alln n0"></div></div>');
        $("#dmjs").prepend('<div class="dmnumbox" id="dmjs_nq" style="display:none;"><div class="iconq"></div><div class="numpic nx"></div><div class="baiwei numpic alln n0" style="display:none;"></div><div class="shiwei numpic alln n0" style="display:none;"></div><div class="gewei numpic alln n0"></div></div>');
        var dmspeed = GM_getValue('dmspeed', 16);
        var dmimage=GM_getValue("dmimage",0);
        var dmop=GM_getValue('dmop', 10);
        var dmbgcolor=GM_getValue("dmbgcolor",1);
        var dmthrough=GM_getValue("dmthrough",0);
        var offdm=GM_getValue("offdm",0);
        if(dmthrough==0){
            $("#dmthrough").attr("checked",false);
            $("#dmbox").css("pointer-events","auto");
        }else{
            $("#dmthrough").attr("checked",true);
            $("#dmbox").css("pointer-events","none");
        }
        $("#filtertext").val(userfilter);
        $("#dmsize").val(parseInt(fontsize));
        if(GM_getValue("danmu_state",0)==1){
            if(offdm==0){opendm();$("#offdm").val(0);}else{opendm(); $('#dmbox').barrager.removeAll();$("#offdm").val(1);}
        }
        $('#opendmbt').click(function () {
            opendm();
        });
        if(dmbgcolor==0){
            $("#dmbgcolor").attr("checked",false);
        }else{
            $("#dmbgcolor").attr("checked",true);
        }
        $('#dmset').click(function () {
            $('#dmsetbox').fadeIn();
            $('#filtertext').select();
        });
        setTimeout(function(){
            if(dmimage==0){
                $("#dmimage").attr("checked",false);
            }else{
                $("#dmimage").attr("checked",true);
            }
            $('#dmop').val(dmop);
            $('#dmspeed').val(dmspeed);
            $('#dmbox').css('opacity', $('#dmop').val() / 10);
        },1000);
        var dmnum = 0,
            dmave = new Array(5),
            dmi = 0,
            dmavi = 0,
            dmopline = 0,
            dmcolors,dmimage;
        //点击屏蔽小礼物
        var shielding=setInterval(function(){ad()},800);
        function ad(){
        if($(".refreshingBtn-show-icon").hasClass("refreshingBtn-show-icon"))
        {$(".refreshingBtn-show-icon").click();clearInterval(shielding);}else{clearInterval(shielding);}
        }
        //弹幕计数
        setInterval(function() {
            if (dmi > 24) {
                dmi = 0;
            }
            dmave[dmi] = dmnum;
            dmavi = (Math.max.apply(null, dmave) - Math.min.apply(null, dmave)) / 5;
            dmi++;
        },200);
        $('.js-chat-msg-scroll').on('DOMNodeInserted', 'ul.js-chat-msg-list', function () {
            var lastli1 = $(this).find('li.js-chat-list-li ').eq(-1);
            var lastli2 = $(this).find('li.js-chat-list-li ').eq(-2);
            var lastli3 = $(this).find('li.js-chat-list-li ').eq(-3);
            var lastli4 = $(this).find('li.js-chat-list-li ').eq(-4);
            var lastli5 = $(this).find('li.js-chat-list-li ').eq(-5);
            var lastli6 = $(this).find('li.js-chat-list-li ').eq(-6);
            if(!lastli1.hasClass("process")){lastli1.addClass("process");glmain(lastli1);}
            if(!lastli2.hasClass("process")){lastli2.addClass("process");glmain(lastli2);}
            if(!lastli3.hasClass("process")){lastli3.addClass("process");glmain(lastli3);}
            if(!lastli4.hasClass("process")){lastli4.addClass("process");glmain(lastli4);}
            if(!lastli5.hasClass("process")){lastli5.addClass("process");glmain(lastli5);}
            if(!lastli6.hasClass("process")){lastli6.addClass("process");glmain(lastli6);}
        });
        function glmain(lastli){
            var gl=0;
            var str = lastli.find('.chat-span').text();
            if($(".js-chat-list-li").length>100){
                $(".js-chat-list-li:first").remove();
            }
            if(str==""){gl=1;lastli.remove();return false;}
            $.each(filter, function (i, value) {
                if (eval(value).test(str)) {
                    lastli.remove();
                    switch (i) {
                        case 0:
                            n6++;
                            n6gal();
                            break;
                            /*case 1:
                            n23++;
                            break;
                        case 2:
                            n1++;
                            break;
                        case 3:
                            n2++;
                            break;
                        case 4:
                            n3++;
                            break;*/
                        case 6:
                            nq++;
                            nqgal();
                            break;
                        case 7:
                            nq++;
                            nqgal();
                            break;
                    }
                    gl=1;
                    return false;
                }
            });
            if (gl != 1) {
                dmnum++;
                var q;
                //------------
                if(dmimage==1){
                    lastli.find('img').remove();
                    if(str==""){
                        lastli.remove();
                    }
                }else{
                    q = lastli.find('.img').length;
                }
                if ($('#cjdm_state').val() == '1' && (str!="" || q>0)) {
                    dmavi = (dmavi > 1) ? dmavi : 1;
                    var maxline=parseInt(parseInt($("#js-flash-layer").css("height"))/35);
                    var dmline = (Math.round(dmavi * 3.5) > 3) ? Math.round(dmavi * 3.5)  : 4;
                    dmline = (Math.round(dmavi * 3.5) < maxline-1) ? Math.round(dmavi * 3.5)  : maxline-1;
                    dmopline = (dmopline < dmline) ? dmopline : 0;
                    var dmopl = dmopline * 35 + 1;
                    dmopline++;
                    var barrager={
                        'info': str,
                        'top': dmopl,
                        'speed': $('#dmspeed').val(),
                        'size':fontsize
                    };
                    if (lastli.find("span[data-is-self='true']").length) {barrager.own=1;}
                    if (q >= 1) {
                        var img=lastli.find('img').attr('src');
                        var url=/http.+gif/.exec(img);
                        barrager.img=url;
                        barrager.imgnum=q;
                    }
                    if(dmbgcolor){
                        barrager.bgcolor="rgba(60, 60, 60, 0.4)";
                    }else{
                        barrager.bgcolor="rgba(60, 60, 60, 0)";
                    }
                    $('#dmbox').barrager(barrager);
                }
            }
        }
        $('#setfilterbt').click(function () {
            GM_setValue('userfilter', $('#filtertext').val());
            GM_setValue('dmspeed', $('#dmspeed').val());
            GM_setValue('dmop', $('#dmop').val());
            GM_setValue('fontsize', $('#dmsize').val()+"px");
            GM_setValue('offdm',$("#offdm").val());
            fontsize=$('#dmsize').val()+"px";
            if($("#offdm").val()=='1'){
                offdm=1;
            }else{
                offdm=0;
            }
            if($("#dmimage").is(":checked")){
                GM_setValue('dmimage', 1);
                dmimage=1;
            }else{
                GM_setValue('dmimage', 0);
                dmimage=0;
            }
            if($("#dmbgcolor").is(":checked")){
                GM_setValue('dmbgcolor', 1);
                dmbgcolor=1;
            }else{
                GM_setValue('dmbgcolor', 0);
                dmbgcolor=0;
            }
            if($("#dmthrough").is(":checked")){
                GM_setValue('dmthrough', 1);
                dmthrough=1;
                $("#dmbox").css("pointer-events","none");
            }else{
                GM_setValue('dmthrough', 0);
                dmthrough=0;
                $("#dmbox").css("pointer-events","auto");
            }
            userfilter = $('#filtertext').val();
            if ($('#filtertext').val() == '') {
                filter = defilter;
                setTimeout(function () {
                    $('#dmsetbox').fadeOut();
                }, 500);
            } else {
                if (userfilter.indexOf('/,/') > 0) {
                    var usergroup = userfilter.split(',');
                    filter = $.merge(defilter, usergroup);
                } else {
                    filter = defilter;
                    filter.push(userfilter);
                }
                setTimeout(function () {
                    $('#dmsetbox').fadeOut();
                }, 500);
            }
            $('#dmbox').css('opacity', $('#dmop').val() / 10);
        });
        $('#fansbox').click(function (e) {
            if ($('#fansbox').val() == 1) {
                $('#fansbox').val(0);
                $('.fans-list').show();
                $(".js-right-chat-layer").height($(".js-right-chat-layer").height()-156);
                $(".slimScrollDiv").height($(".js-right-chat-layer").height());
                $(".js-chat-msg-scroll").height($(".js-right-chat-layer").height());
                $('#fansbox').html('隐藏粉丝区→');
            } else {
                $('#fansbox').val(1);
                $('.fans-list').hide();
                $(".js-right-chat-layer").height($(".js-right-chat-layer").height()+156);
                $(".slimScrollDiv").height($(".js-right-chat-layer").height());
                $(".js-chat-msg-scroll").height($(".js-right-chat-layer").height());
                $('#fansbox').html('显示粉丝区→');
            }
        });
    }
    function huya() {
        publiccss();
        huyacss();
        dmplugin();
        //删除xxx标语
        $("li[data-id='0']").remove();
        //点击屏蔽按钮
        var shielding=setInterval(function(){ad()},800);
        function ad(){
        if($("#J-room-chat-shield").hasClass("shield-on"))
        {$(".room-footer-r").remove();clearInterval(shielding);}else{$("#J-room-chat-shield").click();$(".room-footer-r").remove();clearInterval(shielding);}
        }

        $('.host-control-other.J_roomHdCtrlOther').append('<button style="margin-right:10px;" type="button" id="fansbox" value="1">显示粉丝榜</button>');
        function glmain(lastli){
            if($(lastli).find(".box-noble-enter").length){
                $(lastli).remove();
                return;
            }
            if($(lastli).find(".tit-h-send").length){
                $(lastli).remove();
                return;
            }
            $(lastli).find(".box-noble").removeClass();
        }
        var dmmain = function (records) {
            var lastli_1,dmul,lastli_2,lastli_3,lastli_4,lastli_5,lastli_6;
            if(records.map){
                records.map(function(record) {
                    dmul = record.target;
                    lastli_1=$(dmul).children("li:last");
                    lastli_2=$(dmul).children("li").eq(-2);
                    lastli_3=$(dmul).children("li").eq(-3);
                    lastli_4=$(dmul).children("li").eq(-4);
                    lastli_5=$(dmul).children("li").eq(-5);
                    lastli_6=$(dmul).children("li").eq(-6);
                });
            }
            if(!lastli_1.hasClass("process")){lastli_1.addClass("process");glmain(lastli_1);}
            if(!lastli_2.hasClass("process")){lastli_2.addClass("process");glmain(lastli_2);}
            if(!lastli_3.hasClass("process")){lastli_3.addClass("process");glmain(lastli_3);}
            if(!lastli_4.hasClass("process")){lastli_4.addClass("process");glmain(lastli_4);}
            if(!lastli_5.hasClass("process")){lastli_5.addClass("process");glmain(lastli_5);}
            if(!lastli_6.hasClass("process")){lastli_6.addClass("process");glmain(lastli_6);}
        };
        var obser2 = new MutationObserver(dmmain);
        var obj2 = document.querySelector('#chat-room__list');
        var options2 = {
            'childList': true
        };
        obser2.observe(obj2, options2);
        $("#fansbox").click(function(){
            if($("#fansbox").val()==1){
                $("#fansbox").val(0);
                $("#fansbox").text("隐藏粉丝榜");
                showfans();
            }else{
                $("#fansbox").text("显示粉丝榜");
                $("#fansbox").val(1);
                hidefans();
            }
        });
        var mh=$(".room-sidebar").height()-$(".chat-room__ft").height()-$(".chat-room__hd").height()-20;
        $("#watchChat_pub").css("min-height",mh+"px");
        hidefans();
        function showfans(){
            $("#J-weekRank").show();
        }
        function hidefans(){
            $("#hd-wrap").hide();
            $("#J-weekRank").hide();
        }
    }
    function bilibili()
    {
     $('.attention-btn-ctnr').append('<button style="margin-left:10px;" type="button" id="fansbox" value="1">显示粉丝区→</button>');
     $("#rank-list-vm").hide();
     $(".chat-history-panel").css("height","calc(100% - 0px - 145px)");
     $("#fansbox").click(function(){
		 if($("#fansbox").val()==1){
                $("#fansbox").val(0);
                $("#fansbox").text("隐藏粉丝榜→");
                $("#rank-list-vm").show();
                $(".chat-history-panel").css("height","calc(100% - 128px - 145px)");
            }else{
                $("#fansbox").text("显示粉丝榜→");
                $("#fansbox").val(1);
                $("#rank-list-vm").hide();
                $(".chat-history-panel").css("height","calc(100% - 0px - 145px)");
            }
	 });


    var shielding=setInterval(function(){ad()},800);
    //屏蔽哔哩哔哩礼物
    function ad()
    {if($(".radio-icon").hasClass("radio-icon"))
    {
     $(".icon-block-on").click();
     $("#my-dear-haruna-vm").remove();
     $("#penury-gift-msg").remove();
     $("#chat-history-list").css("height","calc(100% - 0px)");
     $(".bilibili-live-player-video-operable-container").remove();
     clearInterval(shielding);}
     else
     {$(".radio-icon").click();
      $(".icon-block-on").click();
      $("#my-dear-haruna-vm").remove();
      //移除聊天框礼物
      $("#penury-gift-msg").remove();
      $("#chat-history-list").css("height","calc(100% - 0px)");
      //移除系统提示
      $(".bilibili-live-player-video-operable-container").remove();}

    }



    //屏蔽聊天框系统提示
    var styleNode = document.createElement("style");
	styleNode.type = "text/css";
	var rule = document.createTextNode(".system-msg{display:none;}");
	styleNode.appendChild(rule);
	document.getElementsByTagName("head")[0].appendChild(styleNode);



    }

    function longzhu() {
        longzhucss();
        publiccss();
        dmplugin();
       // $('.star-info-title').append('<button style="margin-left:100px;" type="button" id="fansbox" value="1">显示粉丝区</button>');
         //点击屏蔽礼物按钮
        var shielding=setInterval(function(){ad()},800);
        function ad(){
        if($(".chat-filter-checkbox-checked").hasClass("chat-filter-checkbox-checked"))
        {$(".chat-filter-checkbox-checked").click();clearInterval(shielding);}else{$(".chat-filter-checkbox-checked").click();$(".chat-filter-checkbox-checked").click();clearInterval(shielding);}
        }
        function glmain(lastli){
            if($(lastli).hasClass("user_enter_msg")){
                $(lastli).remove();
                return;
            }
            var str=lastli.find(".message-content").text();
            $.each(filter, function (i, value) {
                if (eval(value).test(str)) {
                    lastli.remove();
                    gl=1;
                    return false;
                }
            });
        }

        var dmmain = function (records) {
            var lastli_1,dmul,lastli_2,lastli_3,lastli_4,lastli_5,lastli_6;
            if(records.map){
                records.map(function(record) {
                    dmul = record.target;
                    lastli_1=$(dmul).children("div").eq(-1);
                    lastli_2=$(dmul).children("div").eq(-2);
                    lastli_3=$(dmul).children("div").eq(-3);
                    lastli_4=$(dmul).children("div").eq(-4);
                    lastli_5=$(dmul).children("div").eq(-5);
                    lastli_6=$(dmul).children("div").eq(-6);
                });
            }
            if(!lastli_1.hasClass("process")){lastli_1.addClass("process");glmain(lastli_1);}
            if(!lastli_2.hasClass("process")){lastli_2.addClass("process");glmain(lastli_2);}
            if(!lastli_3.hasClass("process")){lastli_3.addClass("process");glmain(lastli_3);}
            if(!lastli_4.hasClass("process")){lastli_4.addClass("process");glmain(lastli_4);}
            if(!lastli_5.hasClass("process")){lastli_5.addClass("process");glmain(lastli_5);}
            if(!lastli_6.hasClass("process")){lastli_6.addClass("process");glmain(lastli_6);}
        };
        var obser2 = new MutationObserver(dmmain);
        var obj2 = document.querySelector('#scroll-con div');
        var options2 = {
            'childList': true
        };
        obser2.observe(obj2, options2);
    }

    function opendm() {
        if ($('#cjdm_state').index()>0 && $('#cjdm_state').val() == '0') {
            GM_setValue("danmu_state",1);
            $('#cjdm_state').val('1');
            $('#dmkg').css({
                'float': 'left',
                'background-color': '#FD7521'
            });
            $('#kgstate').text('插件弹幕开');
            $('#dmbox').barrager({
                'info': '弹幕插件已开启，请关闭自带弹幕。',
                'top': 400,
                'href': 'https://greasyfork.org/zh-CN/scripts/29026',
                'speed': 12
            });
            if($("div[id^=__h5player]").length){
                $("div[class^=showdanmu]").click();
            }
        } else if($('#cjdm_state').index()>0 && $('#cjdm_state').val() == '1') {
            GM_setValue("danmu_state",0);
            $.fn.barrager.removeAll();
            $('#cjdm_state').val('0');
            $('#dmkg').css({
                'float': 'right',
                'background-color': '#333'
            });
            $('#kgstate').text('插件弹幕关');
        }
    }
    checkdmjs_a();
    checkdmjs_b();
    function checkdmjs_a(lastx,lasty){
        if(n6-lastx==0){
            $("#dmjs_n6").fadeOut();
        }
        if(n6-lastx>1){
            $("#dmjs_n6").show();
        }
        if(nq-lasty==0){
            $("#dmjs_nq").fadeOut();
        }
        if(nq-lasty>1){
            $("#dmjs_nq").show();
        }
        lastx=n6;lasty=nq;
        setTimeout(function(){checkdmjs_a(lastx,lasty);},1000);
    }
    function checkdmjs_b(lastx,lasty){
        if(n6-lastx==0){
            n6=0;
            $("#dmjs_n6 .shiwei,#dmjs_n6 .baiwei").hide();
            $("#dmjs_n6 .gewei,#dmjs_n6 .shiwei,#dmjs_n6 .baiwei").removeClass("n0 n1 n2 n3 n4 n5 n6 n7 n8 n9").addClass("n0");
        }
        if(nq-lasty==0){
            nq=0;
            $("#dmjs_nq .shiwei,#dmjs_nq .baiwei").hide();
            $("#dmjs_nq .gewei,#dmjs_nq .shiwei,#dmjs_nq .baiwei").removeClass("n0 n1 n2 n3 n4 n5 n6 n7 n8 n9").addClass("n0");
        }
        lastx=n6;lasty=nq;
        setTimeout(function(){checkdmjs_b(lastx,lasty);},3000);
    }
    function n6gal(){
        var gw=n6%10;
        if($("#dmjs_n6").css("display")!="none"){
            $("#dmjs_n6").stop();
            $("#dmjs_n6").fadeIn(0);
        }
        if(gw==0&&n6>=10){
            $("#dmjs_n6 .shiwei").show();
            $("#dmjs_n6 .gewei").removeClass("n9").addClass("anim n0");setTimeout(function(){$("#dmjs_n6 .gewei").removeClass("anim");},101);
            var sw=(n6-n6%10)/10%10;
            if(sw==0&&n6>=100){
                $("#dmjs_n6 .baiwei").show();
                $("#dmjs_n6 .shiwei").removeClass("n9").addClass("anim n0");setTimeout(function(){$("#dmjs_n6 .shiwei").removeClass("anim");},101);
                var bw=(n6-n6%100)/100;
                $("#dmjs_n6 .baiwei").removeClass("n"+(bw-1)).addClass("anim n"+bw);setTimeout(function(){$("#dmjs_n6 .baiwei").removeClass("anim");},101);
                if(n6>999){
                    n6=0;
                    $("#dmjs_n6 .shiwei,#dmjs_n6 .baiwei").hide();
                    $("#dmjs_n6 .gewei,#dmjs_n6 .shiwei,#dmjs_n6 .baiwei").removeClass("n0 n1 n2 n3 n4 n5 n6 n7 n8 n9").addClass("n0");
                }
            }else{
                $("#dmjs_n6 .shiwei").removeClass("n"+(sw-1)).addClass("anim n"+sw);setTimeout(function(){$("#dmjs_n6 .shiwei").removeClass("anim");},101);
            }
        }else{
            $("#dmjs_n6 .gewei").removeClass("n"+(gw-1)).addClass("anim n"+gw);setTimeout(function(){$("#dmjs_n6 .gewei").removeClass("anim");},101);
        }
    }

    function nqgal(){
        var gw=nq%10;
        if($("#dmjs_nq").css("display")!="none"){
            $("#dmjs_nq").stop();
            $("#dmjs_nq").fadeIn(0);
        }
        if(gw==0&&nq>=10){
            $("#dmjs_nq .shiwei").show();
            $("#dmjs_nq .gewei").removeClass("n9").addClass("anim n0");setTimeout(function(){$("#dmjs_nq .gewei").removeClass("anim");},101);
            var sw=(nq-nq%10)/10%10;
            if(sw==0&&nq>=100){
                $("#dmjs_nq .baiwei").show();
                $("#dmjs_nq .shiwei").removeClass("n9").addClass("anim n0");setTimeout(function(){$("#dmjs_nq .shiwei").removeClass("anim");},101);
                var bw=(nq-nq%100)/100;
                $("#dmjs_nq .baiwei").removeClass("n"+(bw-1)).addClass("anim n"+bw);setTimeout(function(){$("#dmjs_nq .baiwei").removeClass("anim");},101);
                if(nq>999){
                    nq=0;
                    $("#dmjs_nq .shiwei,#dmjs_nq .baiwei").hide();
                    $("#dmjs_nq .gewei,#dmjs_nq .shiwei,#dmjs_nq .baiwei").removeClass("n0 n1 n2 n3 n4 n5 n6 n7 n8 n9").addClass("n0");
                }
            }else{
                $("#dmjs_nq .shiwei").removeClass("n"+(sw-1)).addClass("anim n"+sw);setTimeout(function(){$("#dmjs_nq .shiwei").removeClass("anim");},101);
            }
        }else{
            $("#dmjs_nq .gewei").removeClass("n"+(gw-1)).addClass("anim n"+gw);setTimeout(function(){$("#dmjs_nq .gewei").removeClass("anim");},101);
        }
    }
    (function ($) {
        $.fn.barrager = function (a) {
            a = $.extend({
                close: true,
                dmpos:0,
                top: 0,
                max: 10,
                speed: 30,
                color: '#fff',
                bgcolor: '#000',
                href: 'javascript:void(0)',
                size:'18px'
            }, a || {
            });
            var b = new Date().getTime();
            var c = 'barrage_' + b;
            var d = '#' + c;
            var e = $('<div class=\'barrage\' id=\'' + c + '\'></div>').appendTo($(this));
            var f = $(window).height() - 100;
            var g = (f > this.height()) ? this.height()  : f;
            var h = $(window).width() + 500;
            var j = (h > this.width()) ? this.width()  : h;
            var k = (a.top == 0) ? Math.floor(Math.random() * g)  : a.top;
            if(a.dmpos==0){
                e.css('top', k + 'px');
            }else{
                e.css('bottom',k + 'px');
            }
            if (a.own == 1) {
                $(d).addClass("own");
            }
            if (a.focus == 1){
                $(d).css("z-index",99);
            }
            var div_barrager_box = $('<div class=\'barrage_box cl\'></div>').appendTo(e);
            div_barrager_box.css('background-color', a.bgcolor);
            div_barrager_box.append(' <div class=\'z p\'></div>');
            if (a.img) {
                div_barrager_box.append('<div class=\'portrait z\'></div>');
                if (a.imgnum) {
                    $(d).css("min-width",80+a.imgnum*26);
                    for (var u = 0; u < a.imgnum; u++) {
                        var l = $('<img src=\'\' >').appendTo(d + ' .barrage_box .portrait');
                        l.attr('src', a.img);
                    }
                }
            }
            if(a.superadmin){
                div_barrager_box.prepend('<div class=\'portrait z\'></div>');
                var l = $('<img src=\'https://shark.douyucdn.cn/app/douyu/res/page/room-normal/super_admin.png?v=20170706\'>').appendTo(d + ' .barrage_box .portrait');
                $(d).find(".portrait").css("line-height","34px");
                $(d).find(".portrait img").css("height","18px");
            }
            if (a.close) {
                div_barrager_box.append(' <div class=\'close z\'></div>');
            }
            var m = $('<a title="'+a.username+'" href=\'\' target=\'_blank\'></a>').appendTo(d + ' .barrage_box .p');
            m.attr({
                'href': a.href,
                'id': a.id
            }).empty().append(a.info);
            m.css('color', a.color);
            m.css('font-size',a.size);
            var i = 0;
            e.css('margin-right', 0);
            var dmw = ($(d).width() + 2) + 'px';
            $(d).css('width', dmw);
            $(d).css('right', '-' + dmw);
            var dmtrim=$(d).width()/($(this).width()+500);
            var dmtime=parseFloat(a.speed)+parseFloat(a.speed*dmtrim);
            $(d).css("transition","transform "+dmtime+"s linear");
            $(d).css("transform","translateX(-"+parseInt(200+j+$(d).width())+"px)");
            $(d + '.barrage .barrage_box .close').click(function () {
                $(d).remove();
            });
            $(d).on("transitionend",function(){
                $(d).remove();
            });
            $(d).on("mouseover",function(){
                var nowpos = $(this).css("transform");
                nowpos=nowpos.split(",")[4];
                $(d).css("transform","translateX("+nowpos+"px)");
                if(a.focus!=1){
                    $(d).css("z-index",30);
                }
                $(d).off("transitionend");
            });
            $(d).on("mouseout",function(){
                var nowpos = $(this).css("transform");
                nowpos=nowpos.split(",")[4];
                var nowtime =(1-(-nowpos)/parseInt(200+j+$(d).width()))*dmtime;
                $(d).css("transform","translateX(-"+parseInt(200+j+$(d).width())+"px)");
                $(d).css("transition","transform "+nowtime+"s linear");
                if(a.focus!=1){
                    $(d).css("z-index",25);
                }
                $(d).on("transitionend",function(){
                    $(d).remove();
                });
            });
        };
        $.fn.barrager.removeAll = function () {
            $('.barrage').remove();
        };
    }) (jQuery);
    function dmplugin(){
        GM_addStyle(`
.barrage {
cursor: pointer;
white-space: nowrap;
position: absolute;
bottom: 70px;
right: -1920px;
display: inline-block;
z-index: 20;
height: 34px;
min-width:100px;
}
.barrage.own .barrage_box{
border:2px solid #fff;
border-radius:20px;
}
.barrage_box {
overflow: hidden;
background-color: rgba(0,0,0,.5);
padding-right: 8px;
height: 34px;
display: inline-block;
border-radius: 25px;
transition: all .3s
}
.barrage_box .portrait {
display: inline-block;
margin-top: 4px;
margin-left: 5px;
height: 26px;
overflow: hidden
}
.barrage_box .portrait img {
height: 100%;
width: 100%:
}
.barrage_box div.p a {
text-shadow: #000000 1px 0px 1px, #000000 0px 1px 1px, #000000 0px -1px 1px, #000000 -1px 0px 1px;
margin-right: 2px;
color: #fff;
line-height: 34px;
margin-left: 18px
}
.barrage_box div.p a:hover {
text-decoration: underline
}
.barrage_box .close {
opacity: 0;
text-align: center;
width: 28px;
height: 25px;
margin-left: 10px;
border-radius: 50%;
margin-top: 5px;
background-image: url("data:image/png;base64,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");
}
.barrage_box:hover .close {
visibility: visible;
opacity: 1
}
.barrage_box .close a {
display: block
}
.barrage_box .close .icon-close {
font-size: 14px;
color: rgba(255,255,255,.5);
display: inline-block;
margin-top: 5px
}
.barrage .z {
float: left!important
}
.barrage a {
text-decoration: none;
}
`);
    }
    function publiccss(){
        GM_addStyle(`
.slideThree {
width: 80px;
height: 26px;
background: #333;
float:left;
position: relative;
-moz-border-radius: 50px;
-webkit-border-radius: 50px;
border-radius: 50px;
-moz-box-shadow: inset 0px 1px 1px rgba(0, 0, 0, 0.5), 0px 1px 0px rgba(255, 255, 255, 0.2);
-webkit-box-shadow: inset 0px 1px 1px rgba(0, 0, 0, 0.5), 0px 1px 0px rgba(255, 255, 255, 0.2);
box-shadow: inset 0px 1px 1px rgba(0, 0, 0, 0.5), 0px 1px 0px rgba(255, 255, 255, 0.2);
}
.slideThree p{
margin-top:-20px;
text-align:center;
}
.slideThree:after {
content: 'OFF';
color: #000;
top:1px;
position: absolute;
right: 10px;
z-index: 0;
font: 12px/26px Arial, sans-serif;
font-weight: bold;
text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.15);
}
.slideThree:before {
content: 'ON';
color: #00bf00;
position: absolute;
left: 10px;
z-index: 0;
font: 12px/26px Arial, sans-serif;
font-weight: bold;
}
.slideThree label {
display: block;
width: 34px;
height: 20px;
cursor: pointer;
position: absolute;
top: 3px;
left: 3px;
z-index: 1;
background: #fcfff4;
background: -moz-linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
background: -webkit-linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
background: linear-gradient(to bottom, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
-moz-border-radius: 50px;
-webkit-border-radius: 50px;
border-radius: 50px;
-moz-transition: all 0.4s ease;
-o-transition: all 0.4s ease;
-webkit-transition: all 0.4s ease;
transition: all 0.4s ease;
-moz-box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.3);
-webkit-box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.3);
box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.3);
}
.slideThree input[type=checkbox] {
visibility: hidden;
}
.slideThree input[type=checkbox]:checked + label {
left: 43px;
}
#dmjs{
position:absolute;
right:20px;
bottom:55%;
z-index:99;
}
.dmnumbox{
height:40px;
background: rgba(170,170,170,.5);
padding: 5px 10px;
border-radius: 25px;
}
.dmnumbox>div{
float:left
}
.numpic{
background-repeat:no-repeat;
background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAFHCAYAAACs+hynAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowODc4Mzg0YS1lZjgxLTY3NDctOTRlYy02ODcxNmMxNWMxYTQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjMyOEUxREE1MTRCMTFFNUFCNENEMjgxMkY1OTBDRUUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjMyOEUxRDk1MTRCMTFFNUFCNENEMjgxMkY1OTBDRUUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmM1MThlMWQyLThlNmUtYzc0MC1hMzFkLTQ0Zjk2NGYxN2UzZiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowODc4Mzg0YS1lZjgxLTY3NDctOTRlYy02ODcxNmMxNWMxYTQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4PoBnyAAAccUlEQVR42uxcCWxc13W982dfSA5JkRQ3idRmLZQsWxJlSaRjyYqpxFIM23FtN5Zr13XaJoEdBAWSok1tNy2QIGgQBQaSujXSSiniQKmXyEm8OwmpyNZiW5ZMSRQl7hySw9m3P3+23vvef3/+DGco1i2KJuEHLmb+/PfvvP2ed+59zxD5ezuo12Mo3Si9KN+D0tecNK6vx9kDQ/gJG32+i9Kpe+FVlLtQ4uq9A+VZlPt0aU6ibK94MsFupFwG9qN0Si2rwHb/vWCoaQK870F5HsWhCn2/D2yVLA2lpXdQDgqtUjaT60YB0/pVYG6vAce92wBqGgB/60F5XpUeqFkKzkfvBfOKBjBfv5Sek3TnFaWhFwViL/4SsjOTIBnj4LqzA6AalaWhh4SUuD73aZAcEmQnPoLo0V56RtKbV5TKvYxyGAX8//QCpCdiqCwDFQfWgsFdB4bqeqj4XA9IdgOkB86B/9DrQGnVd44IRYbpL1pEZX4f5UG6qXlwB5gqJcjEc3jTAsZKOyq5AP4fnRTvHUb5S2qM+qeTXJHn82Z9834X5XH6UvvH28DsxC8mC6T8CfD95D2R5hDKl8XN0n9WeNEyKQBVmlHW0ndDzRIwtq8ASEkAgQgY0woYnA6Rbq2alt3n60jB8iq5ZpRnUXqk6mqoe6QLJCUByhUvKKMhkOJJqOtqAcldRWl71LT0jqbIMPRZI32+gtJjWuqGpi/sYp1L+fU5mHxrgiVq+tQKsBjTkM0ZYPJUANIzYdFp97UdTatFU3IHM5STmgpoenQbSMkEJH9+GsZeGQf8ncnYS1cgGU6DFElA0zo75sxJv/fQu7qiQTcKuD/RjkpkSL50Bkbf8gL9hnJIFRj9xQQkE1mQojK43SCeax3SlEnlqFM9OvvKACTeMUGgP1yydag1h16bgeoVNoh5kljRrH60Dmn46BOg1ZH6Wwbl6SIlomt8CcWoG9j71v+KV7jhfJeWcD0K3fWh9JeZRuak2dA7V9HHuoQiCf6XLkMul1tU9DunSGfXPtYl7Nr/Wj+aT9F6dXydRsmpEkD5GcrBOUULP2krpaR4gJa6aNA+UvFEgs1+ply24CFZk+fFTGDZ0QXmzdeBsd7NHuaSKUgNjIHS+y5kvZM9atrtLEfBvy3I0Y/Jvkt1jeC4Zx9XkMX5KRMkLWoSI+RSOCf95BRkRq+yeavqG4kvS5QjVR5DuQ/sleD83H4w1mJrysMok2hNsGXSGVXQohjCYN+7XLzH5g+D/6tW+qRsfYiy2vnA3WBZtRQgMYKpUqBc9YNydgLnaQfYd7aBwZqvtvCPP4DM2DR97TLlMuy3r5IS87r1qKQRgQDWXwrn7wteiP3ibL6JEQ/YNrgA1JdMzW5IDzNF3WR56Pe99GnbgS0uY53EsJWVNMTeuAjq88fpU7niQ20u9owJFlV9DiaEJrsoa8b6ejC3VAP4R1kiecAHGbQY6rR6gbVaFitFwqpIcluWS2UYvOHNn+EmxdKxChUg+oqE2IPUZFiUQEMcOXqJKlxTlBVpMEfp3E72paESay+gJVImwoh/2L+dQfkka/jG6kJFSkakYda5m7RaWrDPRCOYKMVEmQiJ8p9BWUffCd5ALJ8m5YloaShHrNtKJgPWD3a8TAZSwaQ+N6AiWf5nMT82CM9RAruGevWasmlhFvFfIhyhZsIyqL+jZqDGaDc11IDJZQIYwZcVBRKTMZGmr/VISjZlU+rEhjmBhAp48B/V36m3fp2+2De1Ij7DPwrFeG7GwiLNUbWy1RylUUmCoy8bgU7+O+v+ZoQ7lduaATwzLE06kYHQhaAw72+IVqN+0pUY8oE9kYdgtRuqIJZzIpK1gLurDaQU/snlcdZqvnN+UYf/sfLFTD/vR2mmsSt61gP2emwVH0cjlTVmqGzBLrG0mg/aM1PYqjKEPTJEhllHnUX5mjaxXeoxrFcHrLHl3jXg8M6WnckC4wnwDiTELSHgI2te4ROa4cJeA30+gfIkK1JHJbhdOTBb87NwxKdA0KNAzJcpUEJf1r6uKurfbRAPNWXzXJdRvoLysvhh3Vuqoo9uLkhIfebzagds1/3epzbzM9Q5CizErxfx0aKi32d8ZCrxGw2TvWKe1g/++VgKhDW5YiV98/zxZ1F2oNxfQtFcJdY9t4KxrakgYU5WQH7pl5CLhYnW+CKKv5yibq5kD1i7NuFsjCXJxQuUKU21kL7EZtAtKK+XU8QvKqqCs2R67kyZQ2w0J72mKKPVEVsNyr9F7GlMgqk2C8YlzgI8lB6dBTX9mTmoVsASlOMoz2XDYYj//DiED5+ATAhfIsOCNj4XVSAbkSldEMUv3iuliOR+lAMa5mldjXVlYDAnraITFQtAsSJTNjNniHjYg7blWF+YMhblFT3kF1iot0wdzfltJcuqG22aHNMgTBaLpqb1lFQk8I3uWscVIeSWE5qi9GxcWNehheaIQ5hltWjn4xwLUWte9RW07kJytIKhM5cFR9cUQyZFeEkuo6jg3ibsGcdCUYaFeLGgbLG4olRuTrHsG5dzvKRioeR0TGChM+UVFeZoC8NDjdhis34NLyl+DcFdnUdRQY6q2bRpwfnOH9YQnOyNF2PKEq1WIkfWOpx+41g/MlekBLWRemWhOeKKCHC9P8n6UNSntVjfvEtRGgU66aXP4GnsvN4IpCIpmL2SEM+OFqVlolkRHT6iaz/KsRJ/eFKsFOcMAxUfSTS/6ORlFBz9uT71fgjlMMruonSaaDlaxEeLsOZ3ifZ5TKV5Ah+X9nlCXTnOR/vQ+LurHO2jMTaC9jG2N4NpWQNiALNG+6ROn4PM6GDnNWkfg7MSHPcdQJNdz2mfbJwLW3kK2uddVDZM7zxZ9Y3EU3ra56BG+xy8E0zNNThDjnLaRwkyukdP+9i6W8V7e4thzeeZBbntZjDWOtHmj2AuZEb7pEcCYFpeDZYVNfmpFWdR9d0uvaVlRItUvxSsHWiK4mgYlVgB7WP40AmWx25DmBPJA6/MXJPNzfQGhDEptPfRWcZ7CNqHowiJrAKnhOg2ooGKIeHNEp4pLG+GJ8RJP9Y3zGgf/P0kPbNu34h1neagAiXxoUe816vPEbuJvXIcUlewEqM48Xs0gqDT3LYMHNsQ7YRnmZIMQpzEe+MiR89w39Gfm/Xw+IdEkek6XKe5fRlUP3gzDgF8a2qYmQ7fsUuQmmI803NLf6DcXwxrjqNsUuvrTxmN6HJC5f4bQcogAJkYZnggdMrDKCH1jx4pZyARFME/UE4klwNqHt4DZrcVUQnWp5yE8DkvRD/wiCI/ovNRFoCIZrXLd1pWNEHtvVvB5MRiX7rEWJrYSARCpzXUR96U86VgTV7JyqVQ98A2kKgnn72MlatAdDQKvlNTehZiLs7GHDWjPI/SaV7eAA0PbAEpgbjo/Qtou6MQuRwA74kp4XMkOYzyIcouPSQyDN4hMR+tdVUdND2EShChwfuX2bhKou33D2DF2nFgV1VoL8U/nBBfu1a+mDkuYA0qWQJNBzeDFMe6Oz2AvZs3Jc4c0LijEWBNc0ExfFVmCLw9LEbEca3V7KtrUAkW5x3MSaoQMIE3zEW/uBmOQTGINdGoUGZikBmRwBhLXnNujodSEBhWBKTp1cMaL34u+Rjz/XO0khSwhuajzaqPlsrrXoCCPpWge6pg8l+ENYuK/uDw0f4SbrHT6m+7FoKPOtSxd63Bw4hfxEclSRZS8gFhF6muCSzbNoNxeaPmFsvMBCF9aRiSb71Jt4fVd44U4yON17bs3IWopJPoGZykgxwbCbeYwQpKfxASLzBlJxEbbeerozw++iaK0XzTTrDv3YozJWKAxCBakdlCtxh+t6y2gNTcRO90Bv/Gvku/zKqh5RXYKsDevYlWwzgVTjKGRj45BvHXBiDjCfO5XBVTa4VYanXrTTZb6xtrasFAUCA8jSVRIPL8h5Ce4AxEJpCDijvW4RdZ9RvlSuIjMngnU1eGOpPvDYAhPQuJ02OoJE+jSfgnYEbElhjlTqorXtAjGcPMYxaR9qCuJfL9w+kC2w3rwLm7AwwZtDRhD0KeKAT/831W2XWHktuL0cgRHRtxJxkE12duAUfnSo7x4mgoQzOQno1C6Fi/yM0vyqERUkbt/Khtawc4trYBzCKqDXHiLotwMPTWVUhHkgLWPFWOGiMJ0Gc2Sn4irOgZj+YGo75SfesKMLU0ioio7xbnaL/q0BQRGJcTZwdXT0/OgrnSCPblVWBvdmmDs6qjCmauTIJ+GBE+Kl7ri4d9iifYpWCGYpd80PwwQp04h8ZmEwjSZUse1qRyLxJGqjqwFVr/8W6o/qMdIuKpAeU2lCF2X4fLiVSWEy8oapoC2sdYuXstVG5tAhgcAVdgGqItbkgMBwmUvsb5pFZEb0beq2VEtP6k5qQrqKMsjaGxKe72wqu+3QpeVyNkswYw4XKiFisYvDj2ApyYCvZrbrE3Cmif+HmsiA2VGs1DFdpQT/MBLifMmJMpbP6BcZYjcovFJhXhR/qWPkd9ybFw18zJGag36bARIfyTA/O5xb6hJ+7ILaZNZs5VleC2paCiVhs2kEpmIR5MgW80CUo8d023WIeKalcvANJ8q5RbTKzXzquon9Zs9xTN10PqCH9D746eM7gX8dGioj84fFRMA/XqcFJvMYdU7BYrdWk0UNG83lUAa0J/Z5tPCYshJRrIfu8dnAYifvvcVZCff0GstjdVPpXo18OaYtmF8jh9dxy8G20Z2v3UGE54l8CyJgXmzuspjVFE+5jKuLmaVVYCbHt2g3FJJeeSsnlPhsGUEi6ymmL+SH8RhlxtXrsebF0dDGzlIuECF1k2mhT8kb+cyX6CPFoEupx3dnO+KDoFykWv5iIjyczGRPqhUi4fgnFP0peKe3vAYMR/DIxC/N0RzA2aVwN23mSQV/glT4ELSM8fOVC+Q99te3byECLfCIKtIMR6L4OpEQ0o2bIk+doi4p0ztd+R5eKiPUsIw9S6DJxda9EKTrMQosibg+y5eVUbd3EQf+SPFxRLj0YOajTP3TvQtqNFnZmEWL8XkmMBMNbVcpdDiMcmKZSjIocL1dF60dSuT3WC0YGjZvQKZIJxiCKiZeFCtQjYk3kXWcafEIhtqY5kwXpJ54z2nZvAsaERYHICixTH3Mwiyq0A85o2sK5v5gE6FC5EYgDgmCH3+MTDZga2DKMPmHIUEtTwhVtAwr4CY+P5NmxCxQ51mglga/nyKFex18D0v/2WFa/1SGor448qPnEdj6++OsrRveYpGi3vTUd0q+KjlRqjFb84DS5rQgtkutaVTWchcCkkMFKv4I/m5Uas1SZoualeu/cPhiFwOSpu2ein0CEJ8dFulD7CSaXEuhH7zw2rOHZCkWeT4tkxlE0i/oha7TxKN4qhSP6aWsZgVZ12ghGdTYkWewilv4A/KnMxNyFxS9Bogkw8DbMjcUjJmq+twN9f7BbTX43qQrC4/uivNwv6sJxbTC8e1R0mXGRBlGMom1DOL7rFFhX9YeAjU5nfbeoat3uedwvCiErxRwQg3l7AAkfzs1U8kdheCh+RR++AaW0HWHbeUPZtCiNS+s6Qn40Br2JYQ1PHAQas7rgFDGacFbOBssoy41WQHubsRbEi7itbtRqV4DyVnCh0WRUbgWhYYCR/MT66hylqw4wpERbqkUtyCFOggIDESACSpwbFRNenhzU2zT22GpFH0sdwUPKsB+JvflS2dDRb1nxb7tcromK5zevWIqwz8DhkfJj8yFOqdK+qTM0bCGv61ck/V1isFY08Rlvm5Jxj2zIwP3w7pAO4OB72gvzOecjMzFAgfDXoQtH0+IgFM1sp7DyaNz/mGiyxfxJMiVFwtOag+p4tiHBbBFvzhB6NCDvVTp/GClyqB/2aIiaEi+gzEsXBOQvODrd4Z28xxyZsVZd8YQLM8SDEBwMs2jkTTIDrxmaouD5vti1VJlFvXaUYLYpS7fL966tzajZ8chzsm1di8QI6IFHsqUlraJZ2HfxU/X2LOiCfUdca7VBVhUULsL7FFRWNfsQ4peL7iD/7kaqw3bS0GkwuMwcSFE0eVuaEEVGOmBL3pzeCpakSQm8PQvLKdKfgjtizfQgzo1Hmb6MrMhAozR9V374BqruXAYxMg/OmWvC3VEDSy2e+yk6EyysRjJ4fYkxWWs5AeEhDtc8U8EeWeifAIGLHgYn8KmUHTkuVDp7qvQGAKV7RMx8E+d4/7oTSYA2FVedsq2ug5YYqkGZD88C9HExfjkDEkxYkFCGSuAirJnx0Mn7R3zkciIPbbYAKhHr6kGo5loHIrALBiZTYakbspn77p4aPaGqlfaA9C5hWiWakbYsTxfyRPqx6vzpwi0Oqz0A+rPp4sebFsOpFRb/TtM8uHe1Da5R/V2fU/xbtU+wvaVelAWWfTtHClFCEtLV7M2TDMYj/6Gdit9h6MSfNR/tQ9M9h+m678w4eIZ32gWQdB2NbVcEGr/lypOXEcfdnwLIBV5FJD0IGXMeG0XSfHRJwpk9nIHPllXz2ACpZjnP1JOYmxOBN5LnTkIvLc6baUmwNU+K8Zz8PIYrxQCYKiY0cPYNKkkLJI4WtllfkENSGfW83WDe0oIlFgyCjEl8cwj89C7lEUky1ypx+pKN9nkVZbbpuDTi616LxmmHOp1wE62QoANbrl4P5+g5KtwTlQZS3iSrShoi65ZxZW8npguovfAaMNqxJ74ju74xYVoRDEm1Dz0L42FlIDTOW4nD908k/0cOab9Kn9aYNYCSPzNRYIayhIs1OMSrIGJ2Cyh0NAtZ8euovLI0CaNFBAV3SkiVQ0YUY3e/FCo7x3WBTaMdOTkD8gldzjZEYDSmwrWogaLNE7H8jk80gX8U2VJJIAIxztiY2FIJgX7542cxacLXm/SUSwmfVbK9QiwbdBAhsq3F5Pz2NZk9hEjwxLoJyDtFnYgr7ToVbe06wWQTuCFjTLrlsHLYM8iLIPhnS0bTouewfre34RzabFo+cwdZUoY1fA1pGSkBh5ipssVigYLeY5LKCa2O9tluMaJ/IlVABtGGwJjkeYH4z8W80SdXfWAtRqQLMtQ5w72jl8HfIw4iq4GAY0nE22I7pd4sxEBrGlqmU89vOnE4DOJdicRtc3Pc2NMXcYkkssv+Cxh8VuMWeYSD01QFw7W4EyePLd8QRLxf1osjo6X4tVvuQHguI3WJsE7zRZYTaZksBtMngS1GfAmFvSr9bjEX6lHKLNauM8YFrTLsEsJ7WLx3K7RYrBW2C6sR/VJXF3WKLiv7/w5riHB1Ue/WKBb7PFoeYK4+erSnltVrIRQZzswARzAtB5Iq151aQ3K4FaUi9fxHlFHG53xeKmEmx3bYbLB3L1H1ZqWsqMu5pBeXMqQK2hpsUWuglpxl8WciVoZ3S/P0zAtZQpd0af/UdtPH1YKwoTU2bmisL7mMvnxMMcq/B91dW8Xvx+T6FpNvNG8GxAzOe5hRQ/J0xkI9fYlak5ttytx7WbC/T/Lea2trAsQdxRoK2UocYzEn85pJ4/rVitkY4Jo/oZstjFO3jvB0zmsScBCb5cv21AbHh61DdoeTxUohtjuvQectWMNXYOcxR0hB9zwOpsYAgGb5cihspdh0u0SJ+fNOMqUkFZIj+VvOEfaUc9BMXbRI4wFxk+zbmI37wCv1qSLA0h4rXt8U52qUmAvedN4FkwE4yOsrCqSkSOjkRnlOkYrZGXN9hNMa+G8G+sgbN9DDzJykhRR8J/ZWSfUwXsUN+MhYNXdHZivYeX/Rwc+07MSEgzKFSS/Zi/ogfV7R/A4+GvjrGkEdgIATylFy2SPo6sommJtbGsgRvT13EIsk8Gvp8cN4i6dka6smrHdc3QU13K2dtvCGVmfGDugmsbJH0OWLhUZYmnIOmsaOd4wB0djgGidn0NYuk92Yxj130oxmorpXAqGTAPyHD7GByQUUq9maVG/kEc16eT0GxN+su1VMVVO/71M1eL8/j7Vr0Zi2ikf9TkmUX/A+P5Cl10F2p65pH8pADqpOQiWX7NjBd1/bxj+QxLl8JjrsR3tDRKQQospH5juR5vOobie9JRUE5bG+W4849IDmx+hJDHJ2UOJLH2tkg3runmGRhe7Os225AJWa+NyuXgmT/DKQuTbNd0Y7dK7Wsm9XYYyjam6WBLesmxA8y+UVkLFESYi+9n3957RpcmuZpkVKxx4LywoUwOVjG2Pap1FCgILGxGlFeDi1vKsb4EvVZXzEaIbp5S3rKjz+q4eR1DjDQOXVyGly37wKpArEU+QLwT2LvjAhEclRPsggD+bh1y0ao2oX/rKjrOxPWV91yTrQEZ9gmsMiJMUicZYzFyfqn1SBm1fZThCadCQXpmSBkUq1gTKoraSJZYhe14inTaF0+mhIL5BNaz578M7N2iJLj5s1QRQgkiUXzYD2llNKwWDbC7I9PizXupsZ/UWTKETtEydqxEqo+uR4NGtp7zwTbZu7/zQikQzKYqmxQe2s732JFrQdpMLfUQHLYt1pt7deJZNlL9t+1E5s9iGPyyhAjUfy9OBR8fGM3fcb8qITspUqymO1GQbJs4WxNKtdFSMNG0Hd0kntj/AmQPWybOcUdH6PnBjs2SmWVFnuc8iVE/PHVQnxER/JMcRZCSmcFgcLo1GKShWHssUhBbE0esdH+PR3JUr2uChIG3ZE8OpIlPBkXJEvfyhczngKSJXHVB3YdyeJeYgZ3O6K22go+aN+9yo7kScl0tk9IoJRn9GiEne3jffkitHS4QApF8+18cbyg2ZOxNEyeQ3TLc/OcDpNrJAsDEZYGbOY6Izhc0pwjeSj+ODCe1s+OzH9UimRZiP9oznGG5UiWg5A/a6TUkTxvQNFxhosky++j7Sc3RXEsrd7u265l+xdq9y+rPft8qX1H2n5RsvvmTZvAtK5di6UVdj/dfxnSF8/TzEgh/ZtEBxWKxHl+nQV2PxvlsbTZOEUugmWNESxrr4fEm3ZQTpwyquu7fXpPzbO0h0hqXQHO+3rydp/tyY4U2H3aSmTrdIOhpo7e69HvO9qFch8Pf90NBmOK2320a1l/nO07Ui55C/YcGSQDmK9bMmffEQcPnQgeiByP4PIzS+f5BSD6Qn7brOO2LWDbWJ23+0pmznEzLDrDRmeMxHycIKf1/c/Pi+iNw+woPlx2gbGq5FF8wvZz8MDsOgcPabQQ6lF8lCVm042NNWWP4itEI3TiSVztE1hEg8UK2USSbNYWcrywHKtxtXTJ/dMFO6FoziZqoT0TiKK9z6/dXTvbQPZJaEVs4NyxhjteJujwoDTIo2FIednc3rf0B4rGjZDG9viZq1Cx3KDZe1uDHWyrsE5clbw/DXm1Z9EzEyI3R7UhMv6QSYvScN++GZw18/sSo5f8EDo5Lta625t/yE0YxdUWOOcsTW6w1VrA4sY6SmXBuTy/aZkYCe/bCLCSGW2Z2nokVcBECPv0JXkk0Cljf7Q0V0PD3jbsQNhoMz6m1HdiUjhenite6+q5EUKd/EyWlQ3Q8NBWfnLe+UHWZ2bf9+kZiftLrfvF/MM26FTuXsP2GUl0ro+6P9t7MQiRobggL+8qx0TQ9U1SUrVnFdT1IE4az+8z8g5EIDQiC+O4G3SBFaVyxAZe7e5lAMNTCAQ5GzFzOYpIWRFKtMjVckyE6J0H6JiZGv80ZBJpmL4Sg/BUZkFK9La/3DEzs2pxzi+UiSg+ZkbE0G7Wx9DOx0T8lwADAAvo3YGauu6EAAAAAElFTkSuQmCC");
}
.alln{
width: 20px;
height: 28px;
margin-top: 7px;
}
.n0 {
background-position:0 -25px;
}
.n1 {
background-position:0 -57px;
}
.n2 {
background-position:0 -88px;
}
.n3 {
background-position:0 -120px;
}
.n4 {
background-position:0 -152px;
}
.n5 {
background-position:0 -184px;
}
.n6 {
background-position:0 -215px;
}
.n7 {
background-position:0 -246px;
}
.n8 {
background-position:0 -276px;
}
.n9 {
background-position:0 -304px;
}
.nx{
width:20px;
height:20px;
margin-top:15px;
margin-left:5px;
}
.icon6{
background-image:url("https://shark.douyucdn.cn/app/douyu/res/page/room-normal/face/dy101.png?v=20161108");
background-repeat:no-repeat;
width:37px;
height:37px;
}
.iconq{
background-image:url("https://shark.douyucdn.cn/app/douyu/res/page/room-normal/face/dy012.png?v=20161108");
background-repeat:no-repeat;
width:37px;
height:37px;
}
.anim{
animation: number .1s;
}
@keyframes number
{
from {transform: scale(2);}
to {transform: scale(1);}
}
#dmsize{
width:35px;
}
.highlinechat{
background: #ffebde;
border: 1px solid #ffb3b3;
border-radius: 5px;
}
`);
    }
    function huyacss(){
        GM_addStyle(`
.g-gift.g-show{
display:none!important;
}
#fansbox{
margin-left: 10px;
background: #ff8a00;
border: 1px solid #c5863c;
color: #fff;
}
.msg-nobleEnter{
display:none!important;
}
msg-nobleSpeak{
display:none!important;
}
#J-weekRank{
position:absolute;
width:100%;
}
.subscribe-notice{
display:none!important;
}
.chat-room__bd3{
height: 875px!important;
}
`);
    }
    function pandacss(){
        GM_addStyle(`
.room-chat-tag-user-level,.room-chat-tag-plat-mobile,.room-chat-tags,.room-co-activity-container,.time-limit-task-container{
display:none!important;
}
#opendmbt {
float: left;
width: 100px;
height: 33px;
line-height: 33px;
border: 1px solid #FD7521;
margin-left: 5px;
text-align: center;
cursor: pointer;
font-size: 14px;
background:#fff;
}
#dmkg {
width: 20px;
height: 33px;
float: right;
background-color: #333;
}
#dmset {
margin: 6px 0 0 5px;
width:25px;
height:25px;
cursor: pointer;
float:left;
background-image: url("data:image/jpeg;base64,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");
background-size:cover;
background-repeat:no-repeat;
}
#dmsetbox {
position: absolute;
width: 265px;
height: 210px;
background-color: #ffffff;
border: 1px solid;
right: -100px;
display: none;
z-index:999;
top:-190px;
}
#filtertext {
width: 230px;
margin-left: 7px;
}
#setfilterbt {
width: 100px;
height: 25px;
margin: 5px auto;
display: block;
background-color: #FD7521;
border: 1px solid #ccc;
color: #fff;
cursor: pointer;
}
#dmspeed {
width: 35px;
}
#dmop {
width: 35px;
}
`);
    }
    function douyucss(){
        GM_addStyle(`
.giftbatter-noble-enter,.chat-ad,.chat-notice,.fishop-anchor-recommands-box,.pay-task,.room-ad-top,.f-sign-cont,.assort-ad,.no-login,.fishop-anchor-push-box,.pay-task,.sq-ad,.myvip--guide--oncar,.js-live-room-recommend,.room-wbshare,.wbshare-wel,.focus-lead,.pc-client-icon{
display:none!important;
}
.f-phone,.cq-level,.cq-other,.user-level,.user-honor,.user-noble,.chat-task-madel,img.chat-icon-pad,.status-low-enter,.madel-list,.ticket-list,.firstpay-award-icon,.task-btn.fl,.QRcode{
display:none!important;
}
.pip{
position:absolute;
margin-top:-25px;
right:0px;
background:url(https://shark.douyucdn.cn/app/douyu/res/com/head-pericos.png) 0 4px no-repeat;
display:block;
width:56px;
padding-left:20px;
cursor:pointer;
}
#showsebox {
width: 120px;
height: 35px;
border: none;
background-color: #FD7521;
color: #fff;
font-size: 16px;
cursor: pointer;
float: left;
}
#opendmbt {
float: left;
width: 100px;
height: 33px;
line-height: 33px;
border: 1px solid #FD7521;
margin-left: 5px;
text-align: center;
cursor: pointer;
font-size: 14px;
background:#fff;
}
#dmkg {
width: 20px;
height: 33px;
float: right;
background-color: #333;
}
#dmset {
margin: 6px 0 0 5px;
width:25px;
height:25px;
cursor: pointer;
float:left;
background-image: url("data:image/jpeg;base64,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");
background-size:cover;
background-repeat:no-repeat;
}
#dmsetbox {
position: absolute;
width: 265px;
height: 360px;
background-color: #ffffff;
border: 1px solid;
right: -100px;
top: -370px;
display: none;
}
#filtertext {
width: 230px;
margin-left: 7px;
}
#setfilterbt {
width: 100px;
height: 25px;
margin: 5px auto;
display: block;
background-color: #FD7521;
border: 1px solid #ccc;
color: #fff;
cursor: pointer;
}
#dmspeed {
width: 35px;
}
#dmop {
width: 35px;
}
#userlevel{
width: 35px;
}
#sebox {
display: none;
z-index: 9999;
position: fixed;
width: 513px;
height: 330px;
cursor: move;
bottom: 30px;
right: 30px;
background-color: #FFF;
border: 1px solid #ff630e;
-webkit-box-shadow: 10px 10px 25px #ccc;
-moz-box-shadow: 10px 10px 25px #ccc;
box-shadow: 10px 10px 25px #000;
}
#seflash {
width: 100%;
height: 100%;
}
#coor {
width: 10px;
height: 10px;
overflow: hidden;
cursor: se-resize;
position: absolute;
right: 0;
bottom: 0;
background-color: #FF630E;
}
#seboxtitle {
width: 100%;
height: 35px;
background-color: #FF630E;
position: absolute;
top: -35px;
border: 1px solid #FF630E;
margin-left: -1px;
}
#changeroom {
color: #fff;
font-size: 14px;
line-height: 35px;
float: right;
margin-right: 100px;
text-decoration: underline;
cursor: pointer;
display: none;
}
#closesebox {
cursor: pointer;
position: absolute;
right: 10px;
line-height: 33px;
font-size: 16px;
color: #fff;
}
#setroom {
top: 10%;
left: 25%;
position: absolute;
}
#roomid {
line-height: 20px;
padding: 5px 10px;
}
#setroomid {
cursor: pointer;
margin-left: 5px;
height: 34px;
width: 60px;
background-color: #FE630E;
border: none;
border-radius: 5px;
color: #fff;
font-size: 18px;
}
#cancelchange {
cursor: pointer;
margin-left: 5px;
height: 34px;
width: 60px;
background-color: #FFF;
border: none;
border-radius: 5px;
color: #000;
font-size: 18px;
}
#fansbox {
line-height: 22px;
width: 90px;
margin-left: 10px;
background-color: #FD7521;
border: 1px solid #ddd;
color: #ffffff;
}
#dm {
z-index: 9999;
position: absolute;
left: 162px;
top: 5px;
border: 1px solid;
padding: 2px 6px;
cursor: pointer;
}
#js-room-video{
overflow:hidden;
}
`);
    }
    function longzhucss(){
    GM_addStyle(`
.top-banner-pic,#right-nav,.gift-guide,.chatroom-ap,.task_finished_dialog,.challenge-task,.fresh-guide,.tp-link{
display:none!important;
}
`);
    }
    function zhanqicss(){
        GM_addStyle(`
.liveos-resize-detector,.room-chat-tag-user-level,.room-chat-tag-plat-mobile,.room-chat-tags,#js-activity-show,.user-goRoom,#js-room-app-panel,.js-guide-panel,#js-baibian-top-area,#js-for-app-guide{
display:none!important;
}
#js-flash-layer{
position:relative;
}
#js-flash-panel{
overflow:hidden;
}
.js-right-chat-layer{
height:71%!important;
padding:160px 0 6px!important;
}
.js-chat-msg-scroll{
margin-top: 0px!important;
}
#opendmbt {
float: left;
width: 100px;
height: 33px;
line-height: 33px;
border: 1px solid #FD7521;
margin-left: 5px;
text-align: center;
cursor: pointer;
font-size: 14px;
background:#fff;
}
#dmkg {
width: 20px;
height: 33px;
float: right;
background-color: #333;
}
#dmset {
margin: 6px 0 0 5px;
width:25px;
height:25px;
cursor: pointer;
float:left;
background-image: url("data:image/jpeg;base64,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");
background-size:cover;
background-repeat:no-repeat;
}
#dmsetbox {
position: absolute;
width: 265px;
height: 180px;
background-color: #ffffff;
border: 1px solid;
right: -100px;
display: none;
z-index:999;
top:-190px;
}
#filtertext {
width: 230px;
margin-left: 7px;
}
#setfilterbt {
width: 100px;
height: 25px;
margin: 5px auto;
display: block;
background-color: #FD7521;
border: 1px solid #ccc;
color: #fff;
cursor: pointer;
}
#dmspeed {
width: 35px;
}
#dmop {
width: 35px;
}
`);
    }
}) ();