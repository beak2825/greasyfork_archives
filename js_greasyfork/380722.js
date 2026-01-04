// ==UserScript==
// @name         斗鱼TV自动发送弹幕
// @namespace    http://1025.me/
// @version      0.1
// @description  斗鱼TV自动发送弹幕 for www.douty.tv/485503
// @author       Cgons
// @match        *://www.douyu.com/*
// @require           https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require           https://cdn.bootcss.com/jquery-sidebar/3.3.2/jquery.sidebar.min.js
// @require           https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require           https://cdn.bootcss.com/toastr.js/latest/toastr.min.js
// @grant             unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/380722/%E6%96%97%E9%B1%BCTV%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/380722/%E6%96%97%E9%B1%BCTV%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;

    $("head").append("<link>");
    var csslink = $("head").children(":last");
    csslink.attr({
        rel: "stylesheet",
        type: "text/css",
        href: "https://cdn.bootcss.com/toastr.js/latest/toastr.min.css"
    });


    var DanMuList = '';
    var DanMu = '';
    var Model = '';
    var Time = '';

    var DanMuIpt = null;
    var SendBtn = null;

    var isStart = false;
    var timer = null;

    var randomOld = 0;
    var oldDanMu = '666';
    var flag = true;

    SendInit();

    setTimeout(function(){
        Init();
    } ,3000)

    function SendInit(){
        try
        {
            DanMuList = $.cookie('AutoDanMuList');
            DanMu = $.cookie('AutoDanMu');
            Model = $.cookie('AutoModel');
            Time = $.cookie('AutoTime');

            DanMuIpt = document.getElementsByClassName("ChatSend-txt");
            SendBtn = document.getElementsByClassName("ChatSend-button ");
        }catch(err){
            console.log('读取COOKIE失败','AutoDanMu');
        }
    }

    function SendEvent(btn){
        if(Model == '' || Time == ''){
            ShowTip('请先设置自动弹幕信息!',false);
            return false;
        }
        if(Model == '0' && DanMu == ''){
            ShowTip('请先设置自动弹幕信息!',false);
            return false;
        }
        if(Model == '1' && DanMuList == ''){
            ShowTip('请先设置自动弹幕信息!',false);
            return false;
        }

        if(isStart == false){
            isStart = true
            $(btn).text('关闭');
            $(btn).css('background-color','green');
            $(btn).css('border-color','green');

            timer = setInterval(send,parseInt(Time));
        }else{
            isStart = false
            $(btn).text('开始');
            $(btn).css('background-color','red');
            $(btn).css('border-color','red');
            clearInterval(timer);
        }

        function send(){
            DanMuIpt[0].maxLength = 2000;
            if(Model == 0){
                if(flag){
                    sendEvent(DanMu);
                }else{
                    sendEvent(DanMu+'′');
                }
                flag = !flag;
            }else if(Model == 1){
                let list = DanMuList.split('\n');
                let random = 0;
                if(list.length > 1){
                    random = Math.floor(Math.random()*list.length);
                    while(randomOld == random){
                        random = Math.floor(Math.random()*list.length);
                    }
                    randomOld = random;
                }
                sendEvent(list[random]);
            }else if(Model == 2){
                $.ajax({
                    url: "https://v1.hitokoto.cn/",
                    success: function(data,status){
                        if(status == 'success'){
                            sendEvent(data.hitokoto);
                        }
                    },
                    error: function(e){
                        console.log('hitokoto get error');
                    }
                });
            }else if(Model == 3){
                var dom = $('#js-barrage-list').children().first();
                var txt = $(dom).children().children('.Barrage-content').text();
                txt = txt.replace(/\s*/g,"");
                if(txt == ''){
                    return false;
                }
                if(oldDanMu == txt){
                    return false;
                }
                oldDanMu = txt;
                if(filter(txt)){
                    sendEvent(txt);
                }
            }
        }
    }

    function filter(val){
        var list = [
            '妈',
            '死',
            '草',
            '335',
        ]

        for ( var i = 0; i <list.length; i++){
            if(val.indexOf(list[i]) != -1){
                return false;
            }
        }
        return true;
    }

    function sendEvent(txt){
        DanMuIpt[0].value = txt;
        while($(SendBtn[0]).text() == '发送'){
            SendBtn[0].click();
        }
    }


    function Init(){
        var css =  `
<style>
.setBtn{
float:left;
display: inline-block;
margin-bottom: 0;
margin-right:10px;
padding: .5em 1em;
vertical-align: middle;
font-weight: 400;
line-height: 1.2;
text-align: center;
white-space: nowrap;
background-image: none;
border: 1px solid transparent;
border-radius: 3px;
cursor: pointer;
outline: 0;
-webkit-appearance: none;    color: #fff;
background-color: #5eb95e;
border-color: #5eb95e;
}
.setBtn:focus, .setBtn:hover {
background-color: #4aaa4a;
}
.sidebar.right {
z-index:1031;
top: 0;
right: 0;
bottom: 0;
width: 320px;
background: #FFF;
}
.sidebars > .sidebar {
box-shadow: 0 0 5px rgba(0, 0, 0, 0.64);
position: fixed;
padding: 30px;
text-align: center;
}
.danMuBox{
display: flex;
flex-direction: column;
}
.successBtn{
display: inline-block;
height: 38px;
line-height: 38px;
padding: 0 18px;
background-color: #009688;
color: #fff;
white-space: nowrap;
text-align: center;
font-size: 14px;
border: none;
border-radius: 2px;
cursor: pointer;
}
.successBtn-primary {
border: 1px solid #C9C9C9;
background-color: #fff;
color: #555;
}

</style>
`;
        var setBtn =  `
<div id="AutoSetBtn" class="setBtn" style="background-color: #009688;border-color: #009688;">设置</div><div id="AutoStartBtn" class="setBtn" style="background-color: red;border-color: red;">开始</div>
`;
        $('head').append(css);
        //放置按钮
        var location = $('.Title-videoSiteLink')[0];
        $(location).before(setBtn);

        SidebarInit();
        GetCookie();

        $("#AutoSetBtn").on("click", function () {
            $(".sidebar.right").trigger("sidebar:toggle");
        });

        $('#AutoStartBtn').on('click',function(){
            SendEvent(this);
        });

        $(document).bind("click",function(e){
            if($(e.target).closest(".sidebar.right").length == 0 && $(e.target).closest(".setBtn").length == 0){
                if($(".sidebar.right").css('right') === '0px'){
                    $(".sidebar.right").trigger("sidebar:close");
                }
            }
        });

        $('#timeIpt').bind('input propertychange', function(){
            $(this).val($(this).val().replace(/^(0+)|[^\d]+/g,''))
        });

        $('#success').on('click',function(){
            SaveCookie();
            SendInit();
            $(".sidebar.right").trigger("sidebar:close");
        });

        $('#cancel').on('click',function(){
            $(".sidebar.right").trigger("sidebar:close");
        });

    }

    function SidebarInit(){
        var sideBarHtml = `
<div class="sidebars">
<div class="sidebar right">
<h2>自动弹幕设置</h2>
<div class="danMuBox">
<span style="text-align: left;color: #009688;border-top: 1px solid #e6e6e6;border-right: 1px solid #e6e6e6;border-left: 1px solid #e6e6e6;height: 30px;line-height:30px;padding-left: 10px;background-color: #f9f8f8;">随机弹幕(每条一行)</span>
<textarea class="" id="txtList" style="height: 300px;margin-bottom: 20px;border-color: #e6e6e6;" maxlength="500"></textarea>
<span style="text-align: left;color: #009688;border-top: 1px solid #e6e6e6;border-right: 1px solid #e6e6e6;border-left: 1px solid #e6e6e6;height: 30px;line-height:30px;padding-left: 10px;background-color: #f9f8f8;">单条重复</span>
<textarea class="" id="txt" style="height: 80px;margin-bottom: 20px;border-color: #e6e6e6;" maxlength="200"></textarea>

<select id="model" style="height: 38px;margin-bottom: 20px;border-color: #e6e6e6;padding-left: 10px;color: #757575;">
<option value="0">单条重复</option>
<option value="1">随机弹幕</option>
<option value="2">一言Hitokoto</option>
<option value="3">模仿弹幕</option>
</select>

<input type="text" id="timeIpt" placeholder="间隔时间(毫秒)" maxlength="10" value="500" autocomplete="off" style="height: 38px;width:200px;line-height: 1.3;border-width: 1px;border-style: solid;background-color: #fff;border-radius: 2px;border-color: #e6e6e6;padding-left: 10px;margin-bottom: 20px;">

<div style="text-align: left;">
<button id="success" class="successBtn" style="margin-right: 20px;">确定</button>
<button id="cancel" type="reset" class="successBtn successBtn-primary">取消</button>
</div>
</div>

</div>
</div>
`;
        $('body').append(sideBarHtml);
        $(".sidebar.right").sidebar({side: "right"});
    }

    function GetCookie(){
        try
        {
            var danMuList = $.cookie('AutoDanMuList');
            var danMu = $.cookie('AutoDanMu');
            var model = $.cookie('AutoModel');
            var time = $.cookie('AutoTime');

            $('#txtList').val(danMuList);
            $('#txt').val(danMu);
            $('#model').val(model);
            $('#timeIpt').val(time);
        }catch(err){
            console.log('读取COOKIE失败','AutoDanMu');
        }
    }

    function SaveCookie(){
        var danMuList = $('#txtList').val();
        var danMu = $('#txt').val();
        var model = $('#model').val();
        var time = $('#timeIpt').val();

        if(model == '0' && danMu == ''){
            ShowTip('单条弹幕不能为空!',false);
            return false;
        }
        if(model == '1' && danMuList == ''){
            ShowTip('随机弹幕不能为空!',false);
            return false;
        }
        if(time == '' || time == null){
            ShowTip('间隔时间不能为空!',false);
            return false;
        }

        $.cookie('AutoDanMuList', danMuList, { expires: 60*60 });
        $.cookie('AutoDanMu', danMu, { expires: 60*60 });
        $.cookie('AutoModel', model, { expires: 60*60 });
        $.cookie('AutoTime', time, { expires: 60*60 });

        ShowTip('保存成功!',true);
    }

    function ShowTip(msg,status){
        console.log(status,msg);
        if(status){
            toastr.success(msg);
        }else{
            toastr.error(msg);
        }
    }

})();
