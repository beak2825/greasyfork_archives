// ==UserScript==
// @name         斗鱼自动弹幕测试
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  自动发送斗鱼弹幕
// @author       Shroud
// @match        https://www.douyu.com/*
// @match        http://www.douyu.com/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/372704/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E5%BC%B9%E5%B9%95%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/372704/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E5%BC%B9%E5%B9%95%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==
$("body").append('\
<div id="stupid2k" style=" position: absolute; top: 50px; left: 50px; z-index: 900; display: block; background: #eee; padding: 4px; border-radius: 5px; -webkit-box-shadow: 2px 2px 5px #000; -moz-box-shadow: 2px 2px 5px #000; box-shadow: 2px 2px 5px #000; -moz-user-select: none; -khtml-user-select: none; user-select: none;">\
<textarea id="robot-danmu" class="doTMove" rows="6" cols="30" style="resize: none; border-radius: 5px;">在此输入弹幕内容(多条用|或换行分隔)</textarea><br/>\
<span class="doTMove" style="font-family: Microsoft YaHei; font-size: 82%; letter-spacing:1px; padding: 1px 0 0 0; margin-left: 1px;">时间间隔</span>\
<input id="robot-interval" class="doTMove" style="display:inline-block; width: 30px; border: 1px solid #ccc; padding: 0 0 0 5px; border-radius: 5px; font-family: Microsoft YaHei;"  value="5" >\
<span class="doTMove" style="font-family: Microsoft YaHei; font-size: 82%; padding: 1px 0 0 0;">秒</span>\
<span id = "robot-play" class="doTMove" style="float: right; padding: 2px 10px 2px 10px; margin: 0 1px 0 0; background: #eee; border: 1px solid #ccc; border-radius: 5px; font-family: Microsoft YaHei; font-size: 75%;">发送</span>\
</div>\
');

// div拖动
$(document).ready(function(){
    var $div = $("div#stupid2k");
    /* 绑定鼠标左键按住事件 */
    $div.bind("mousedown",function(event){
        var offset_x = $(this)[0].offsetLeft;
        var offset_y = $(this)[0].offsetTop;
        var mouse_x = event.pageX;
        var mouse_y = event.pageY;

        /* 绑定拖动事件 */
        $(document).bind("mousemove",function(ev){
            var _x = ev.pageX - mouse_x;
            var _y = ev.pageY - mouse_y;
            var now_x = (offset_x + _x ) + "px";
            var now_y = (offset_y + _y ) + "px";
            $div.css({
                top:now_y,
                left:now_x
            });
        });
    });
    // 阻止事件冒泡
    $('.doTMove').mousedown(function (event) {
        event.stopPropagation();
    });
    // 解除事件绑定
    $(document).bind("mouseup",function(){
        $(this).unbind("mousemove");
    });
    // 修改鼠标悬停样式
    $('#robot-play').hover(function () {
        this.style.cursor = 'pointer';
    });
})

// 机器人对象
msg0 = ['66','666','6666'];
function Robot() {}
Robot.prototype = {

    constructor: Robot,
    msg: msg0,
    lastText: '',
    suffix: ["!","!!","!!!", " @@", " :)", " T_T", " ##", " **","1","2"],
    flag: 0,
    interval: 5000,

    getText: function () {
        if(this.msg.length === 1) {
            return this.msg[0] + this.suffix[Math.floor(Math.random()*10)]
        }
        return this.msg[Math.floor(Math.random()*10)]
    },
    stop: function () {
        clearTimeout(this.flag);
    },
    setMessage: function (arr) {
        this.msg = arr;
        if(this.msg.length === 0){
            this.msg = msg0;
        }
    },
    setInterval: function (seconds) {
        sec = parseInt(seconds);
        this.interval = sec * 1000;
    },
    send: function (text) {
        $('#js-send-msg > textarea.cs-textarea').val(text);
        $('#js-send-msg > .b-btn').click();
    },
    start: function () {
        var that = this;
        text = this.getText();

        // 冷却
        if($('#js-send-msg > .b-btn').hasClass('b-btn-gray')) {
            nextTime = parseInt($('#js-send-msg > .b-btn').text());
            if(isNaN(nextTime)) {
                this.flag = setTimeout(function () {
                    that.start();
                }, nextTime*1000);
                return;
            }
        }

        this.send(text);
        this.flag = setTimeout(function(){that.start();}, this.interval);
    }
};

robot = new Robot();

// 鼠标移入输入框阴影
$('#robot-danmu').mouseover(function () {
    $('#robot-danmu').css({
        'box-shadow': '0px 1px 1px #363433',
        '-moz-box-shadow': '0px 1px 1px #363433',
        '-webkit-box-shadow': '0px 1px 1px #363433'
    });
});
$('#robot-danmu').mouseout(function () {
    $('#robot-danmu').css({
        'box-shadow': '0px 0px 0px red',
        '-moz-box-shadow': '0px 0px 0px white',
        '-webkit-box-shadow': '0px 0px 0px white'
    });
});
$('#robot-interval').mouseover(function () {
    $('#robot-interval').css({
        'box-shadow': '0px 1px 1px #363433',
        '-moz-box-shadow': '0px 1px 1px #363433',
        '-webkit-box-shadow': '0px 1px 1px #363433'
    });
});
$('#robot-interval').mouseout(function () {
    $('#robot-interval').css({
        'box-shadow': '0px 0px 0px red',
        '-moz-box-shadow': '0px 0px 0px white',
        '-webkit-box-shadow': '0px 0px 0px white'
    });
});

// 鼠标移入按钮高亮
$('#robot-play').mouseover(function () {
    if($('#robot-play').text() != '停止') {
        $('#robot-play').css({'background':'#F5F5F5',
                              '-moz-box-shadow':'0px 0px 10px #F5F5F5',
                              '-webkit-box-shadow':'0px 0px 10px #F5F5F5',
                              'box-shadow':'0px 0px 10px #F5F5F5',
                              'border': '0px solid white'});
    } else {
        $('#robot-play').css({'background':'#ee3f4d',
                              '-moz-box-shadow':'0px 0px 3px #ee3f4d',
                              '-webkit-box-shadow':'0px 0px 3px #ee3f4d',
                              'box-shadow':'0px 0px 4px #ee3f4d',
                              'border': '0px solid white'});
    }
});
$('#robot-play').mouseout(function () {
    if($('#robot-play').text() != '停止') {
        $('#robot-play').css({'background':'#eee',
                              '-moz-box-shadow':'0px 0px 0px white',
                              '-webkit-box-shadow':'0px 0px 0px white',
                              'box-shadow':'0px 0px 0px white',
                              'border':'1px solid #ccc'});
    } else {
        $('#robot-play').css({'background':'#c02c38',
                              '-moz-box-shadow':'0px 0px 0px white',
                              '-webkit-box-shadow':'0px 0px 0px white',
                              'box-shadow':'0px 0px 0px white',
                              'border':'1px solid #ccc'});
    }
});

// 执行脚本
$('#robot-play').click(function () {
    if($('#robot-play').text() != '停止') {
        $('#robot-play').css({'background':'#c02c38','color':'white'}).text('停止');
        robot.setInterval($('#robot-interval').val());
        robot.setMessage($('#robot-danmu').val().split(/[\n|]/));
        robot.start();
    } else {
        robot.stop();
        $('#robot-play').css({'background':'#eee', 'color':'black'}).text('发送');
    }
});