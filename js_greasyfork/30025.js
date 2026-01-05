// ==UserScript==
// @name         斗鱼自动弹幕
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  自动发斗鱼弹幕
// @author       Lang
// @match        https://www.douyu.com/*
// @match        http://www.douyu.com/*
// @exclude      https://www.douyu.com/directory/myFollow
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/30025/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/30025/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

jQuery.noConflict();
jQuery(document).ready(function($){
/*jshint multistr: true */
$("body").append("\
<div id='robot' style='position: absolute; top: 580px; left: 240px; z-index: 900; display: block; background: #65c294; padding:5px;'> \
<div id='robot-show' style='display: inline-block;padding:5px; border: 1px solid gray;background: #65c294;'>弹</div>\
<div id='robot-content' style='display:none'>\
弹幕间隔：<input id='robot-interval' placeholder='秒数' value='45' style='display:inline-block;width: 30px'/>秒<br />\
弹幕内容(多条用|或换行分隔):<br/>\
<textarea id='robot-danmu' rows='5' cols='30'>666666666666666666666666</textarea><br />\
<div id='robot-save' style='display: none; margin-top: 5px;padding:5px; border: 1px solid gray; float:left'>Save</div>\
<div id='robot-play' style='display: inline-block; margin-top: 5px;padding:5px; border: 1px solid gray; float:right'>启动</div>\
<div id='robot-drag' style='position: absolute; top: 0px; right:5px; display: inline-block; margin-top: 5px;padding:5px; border: 1px solid gray; float:right'>拖我</div>\
</div>\
</div>");

// 实现可拖动
var ismousedown = false;
var dialogleft,dialogtop;
var downX,downY;
dialog = $("#robot");
dialogleft = parseInt(dialog.css("left"));
dialogtop = parseInt(dialog.css("top"));
$("#robot-drag").mousedown(function(e){
    ismousedown = true;
    downX = e.clientX;
    downY = e.clientY;
});
document.onmousemove = function(e){
    if(ismousedown){
        dialog.css("top", e.clientY - downY + dialogtop + "px");
        dialog.css("left", e.clientX - downX + dialogleft + "px");
    }
};
/*松开鼠标时要重新计算当前窗口的位置*/
document.onmouseup = function(){
    dialogleft = parseInt(dialog.css("left"));
    dialogtop = parseInt(dialog.css("top"));
    ismousedown = false;
};


defaultMsg = ["666666666666666666666666666"];
function Robot() {}
Robot.prototype = {
    constructor: Robot,
    msg: defaultMsg,
    lastText: '',
    flag: 0,
    interval: 5000,
    send: function(text) {
        //$("#js-send-msg > textarea.cs-textarea").val(text);
        //$("#js-send-msg > .b-btn").click();
        $('#js-player-asideMain div.ChatSend > textarea.ChatSend-txt').val(text);
        $('#js-player-asideMain div.ChatSend > .ChatSend-button').click();

        console.debug(text);
    },
    getText: function() {
        if(this.msg.length === 1) {
            text = this.msg[0];
            sliceIndex = Math.floor(Math.random() * text.length);
            return text.substr(0, sliceIndex) + " " + text.substr(sliceIndex, text.length);
        }
        return this.msg[Math.floor(Math.random() * this.msg.length)];
    },
    start: function() {
        this.stop();
        this.run();
    },
    run: function() {
        var that = this;
        text = this.getText();
        while(text == this.lastText) {
            text = this.getText();
        }
        // 不能发送，冷却中
        /*if($("#js-send-msg > .b-btn").hasClass('b-btn-gray')) {
            nextTime = parseInt($("#js-send-msg > .b-btn").text());
            if(!isNaN(nextTime)) {
                this.flag = setTimeout(function(){that.run();}, nextTime * 1000 + 200);
                return;
            }
        }*/
        if($('#js-player-asideMain div.ChatSend > .ChatSend-button').hasClass('is-gray')) {
            nextTime = parseInt($('#js-player-asideMain div.ChatSend > .ChatSend-button').text());
            if(!isNaN(nextTime)) {
                randomMs = 100 + Math.floor(Math.random() * 100) * 10
                this.flag = setTimeout(function(){sendDanmu(text, interval);}, nextTime * 1000 + randomMs);
                return;
            }
        }

        this.send(text);
        this.lastText = text;
        this.flag = setTimeout(function(){that.run();}, this.interval);
    },
    stop: function() {
        clearTimeout(this.flag);
        //this.saveConfig();
    },
    setMessage: function(arr) {
        if(!(arr instanceof Array)) {
            console.error("setMessage: arr should be an array!");
            return;
        }
        this.msg = arr;
        console.log("setMessage " + arr);
        if(this.msg.length === 0) {
            this.msg = defaultMsg;
        }
    },
    setInterval: function(seconds) {
        sec = parseInt(seconds);
        console.log('set interval to ' + seconds);
        if((!isNaN(sec)) && sec > 0) {
            this.interval = sec * 1000;
        } else {
            console.warn("set interval " + seconds + " failed.");
        }
    },
    saveConfig: function(){
        var config={};
        config.left = $("#robot").css("left");
        config.top = $("#robot").css("top");
        config.interval = this.interval;
        config.msg = this.msg;
        window.localStorage.root_config = config;
    }
};
robot = new Robot();
window.robot = robot;

$("#robot-play").click(function(){
    if($("#robot-play").text() != "停止") {
        $("#robot-play").text("停止");
        robot.setInterval($('#robot-interval').val());
        robot.setMessage($('#robot-danmu').val().split(/[\n|]/).filter(function(s){return s && s.trim();}));
        window.localStorage.root_msg = $('#robot-danmu').val();
        robot.start();
    } else {
        robot.stop();
        $("#robot-play").text("启动");
    }
});
$("#robot-save").click(function(){
    robot.saveConfig();
    $("#robot-save").text("saved.");
});
$("#robot-show").click(function(){
    $("#robot-content").toggle();
    if($("#robot-content").is(':visible')) {
        $("#robot-show").text("隐藏");
    } else {
        $("#robot-show").text("显示");
    }
});

//console.log('#' + typeof(window.localStorage));
config=window.localStorage.root_config;
if(typeof(config) !="undefined") {
     console.log(typeof(config));
    dialog.css("top", config.top);
    dialog.css("left", config.left);
    robot.interval = config.interval;
    robot.msg = config.msg;
    console.log('msg'+config);
}
if(typeof(window.localStorage.root_msg) != "undefined"){
    $('#robot-danmu').val(window.localStorage.root_msg);
}
/*
    setInterval(function(){
        $peck = $(".peck");
        if($peck.prop("style").display==="block"&&$peck.hasClass("peck-open"))  {
            $peck.mouseover();
            $(".peck-cdn").click();
        }
    }, 500);*/
//$('body aside').hide();
console.log("斗鱼自动弹幕已准备完毕.");
});