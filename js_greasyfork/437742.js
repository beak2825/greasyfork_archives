// ==UserScript==
// @name         yftech自动答题程序
// @namespace    https://v6ym.com/
// @version      1.0.6
// @description  作用于www.yftechweb.cn，是一款针对网页端考试，练习作业的一款轻量级自动化答题插件。
// @author       朱岩松
// @match        https://www.yftechweb.cn/exam.html
// @icon         https://sou.zhuyansong.com/favicon.ico
// @require       http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @connect v6ym.com
// @grant GM_xmlhttpRequest
// @license zys
// @supportURL   https://v6ym.com/
// @homepage     https://v6ym.com/
// @downloadURL https://update.greasyfork.org/scripts/437742/yftech%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E7%A8%8B%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/437742/yftech%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E7%A8%8B%E5%BA%8F.meta.js
// ==/UserScript==
/**
 * 文档注释
 * 开发感言：2021年12月26日 17点54分写下
 * 此插件已有前身，项目地址：https://greasyfork.org/zh-CN/scripts/436116 关于它的前身，我只能表示程序写的非常烂。
 * 采用原生JavaScript，面向过程的写法。并且无法解决JS的异步问题（即便递归也没办法），所以新开项目，采用Jqurey来写它。
 * 希望这个新项目能很好的解决我的需求并让我同步学习并掌控Jqurey知识。
 * 完结感言：2021年12月29日 15点34分写下
 * 零零散散的时间写完它，这个插件对我有特殊意义，它是我第一次尝试边学边写，使用Jqurey来获取对象，确实比用原生JavaScript
 * 好多了，虽然异步问题也没用解决，但是通过settimeout完成了流程控制。总体感觉不错。
 * 目前还有一个非常之大的BUG，那就是无法完成他的特殊字符处理，比如答案中有+-/""''这写特殊符号都会导致答案虽然获取到但是无
 * 法通过indexof来进行判断是否统配，可能需要做适配。还在持续开发中。
 * */
//----用户自定义变量开始----
var key

//----用户自定义变量结束----

//----全局变量开始----
var nowversion = '1.0.6'
var nowAnswer
var totalAnswer
var thisSubject
var thisAnswer
var error=""
    //----全局变量结束----
    //----菜单区域开始----
    //菜单几乎废弃，目前使用的是jqurey的弹窗提醒！
buju = 'auto';
pifu = 2

function IsPC() {
    var a = navigator.userAgent;
    var b = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var c = true;
    for (var v = 0; v < b.length; v++) {
        if (a.indexOf(b[v]) > 0) {
            c = false;
            break
        }
    }
    if (c == false) {
        buju = 80
    } else if (buju == "auto") {
        if (window.screen.height == 1080) {
            buju = 300
        } else if (window.screen.height == 768) {
            buju = 100
        } else if (window.screen.height == 720) {
            buju = 50
        } else if (window.screen.height < 720) {
            buju = 0
        } else if (window.screen.height > 1080) {
            buju = 500
        } else {
            buju = 300
        }
    }
}
IsPC();
var btnList = {},
    paddingLeft = '0px',
    paddingRight = '0px',
    clrs1 = 'color',
    clrs2 = 'ground',
    color0 = '#E0EEEE',
    ground0 = '#9370DB',
    color1 = '#BFEFFF',
    ground1 = '#BDB76B',
    color2 = '#E0EEE0',
    ground2 = '#CD661D',
    color3 = '#FFFAFA',
    ground3 = '#FFB6C1',
    color4 = null,
    ground4 = null,
    color = eval(clrs1 + pifu),
    ground = eval(clrs2 + pifu),
    buttonWidth = '70px',
    buttonHeight = '20px',
    currentPos = 5,
    delta = 30,

    database = window.localStorage;
var btnBox2 = document.createElement('div');
btnBox2.style.position = 'absolute';
btnBox2.style.top = '210px';
btnBox2.style.left = 460 + buju + 'px';
btnBox2.style.width = buttonWidth;
btnBox2.style.height = buttonHeight;
document.body.appendChild(btnBox2);

var btnBox1 = document.createElement('div');
btnBox1.style.position = 'absolute';
btnBox1.style.top = '210px';
btnBox1.style.left = 540 + buju + 'px';
btnBox1.style.width = buttonWidth;
btnBox1.style.height = buttonHeight;
document.body.appendChild(btnBox1);

function createButton(a, b, c) {
    btnList[a] = document.createElement('button');
    var d = btnList[a];
    d.innerText = a;
    d.style.marginTop = currentPos + "px";
    d.style.color = color;
    d.style.background = ground;
    d.style.paddingLeft = paddingLeft;
    d.style.paddingRight = paddingRight;
    d.style.width = '100%';
    d.style.height = '100%';;
    d.addEventListener('click', c);
    b.appendChild(d)
}
var html580ads = {
    init: function(a, c) {
        a = '<h2  id="outle" style="height: 40px; top:-15px; line-height: 30px; padding-left: 5px; font-size: 20px;text-align:center; color:' + color + ";background:" + ground + ';border-bottom: 1px solid #aaaaaa; position: relative; "><b>' + a + '</b><span style="width: 21px; height: 20px;position: absolute; top: 1px; right:30px;"><a id="btn_min" href="javascript:void(0); ">一</a>&nbsp&nbsp<a id="btn_close" href="javascript:void(0);" >X</a></span></h2><div id="mainoutle" style="height:200px; width:300px; overflow: hidden; font-size: 18px; line-height: 18px;text-decoration:underline; color:rgb(195, 66, 255);"><div style="padding:2px;"><b>' + c + "</b></div></div>";
        var b = this;
        c = document.body;
        b.oDiv = document.createElement("div");
        b.oDiv.id = "miaov_float_layer";
        b.oDiv.style.cssText = "border: 1px solid #aaaaaa; display:none;width:300px;";
        c.appendChild(b.oDiv);
        b.oDiv.innerHTML = a;
        var d = document.getElementById("btn_min");
        a = document.getElementById("btn_close");
        b.oDivContent = b.oDiv.getElementsByTagName("div")[0];
        var e = 0;
        c = window.navigator.userAgent.match(/MSIE 6/ig) && !window.navigator.userAgent.match(/MSIE 7|8/ig);
        b.oDiv.style.display = "block";
        e = b.oDivContent.offsetHeight;
        c ? (b.oDiv.style.position = "absolute", b.repositionAbsolute(), window.attachEvent("onscroll", function() {
            b.repositionAbsolute()
        }), window.attachEvent("onresize", function() {
            b.repositionAbsolute()
        })) : (b.oDiv.style.position = "fixed", b.repositionFixed());
        d.timer = null;
        d.isMax = !0;
        d.onclick = function() {
            b.startMove(b.oDivContent, (this.isMax = !this.isMax) ? e : 0, function() {
                d.className = "min" == d.className ? "max" : "min"
            })
        };
        a.onclick = function() {
            b.oDiv.remove()
        }
    },
    startMove: function(a, c, b) {
        a.timer && clearInterval(a.timer);
        var d = this;
        a.timer = setInterval(function() {
            d.doMove(a, c, b)
        }, 30)
    },
    doMove: function(a, c, b) {
        var d = (c - a.offsetHeight) / 8;
        a.offsetHeight == c ? (clearInterval(a.timer), a.timer = null, b && b()) : (d = 0 < d ? Math.ceil(d) : Math.floor(d), a.style.height = a.offsetHeight + d + "px", window.navigator.userAgent.match(/MSIE 6/ig) && 2 == window.navigator.userAgent.match(/MSIE 6/ig).length ? this.repositionAbsolute() : this.repositionFixed())
    },
    repositionFixed: function() {
        this.oDiv.style.right = 0;
        this.oDiv.style.bottom = 0
    },
    repositionAbsolute: function() {
        var a = document.body.scrollTop || document.documentElement.scrollTop,
            c = document.documentElement.clientHeight;
        this.oDiv.style.left = (document.body.scrollLeft || document.documentElement.scrollLeft) + document.documentElement.clientWidth - this.oDiv.offsetWidth + "px";
        this.oDiv.style.top = a + c - this.oDiv.offsetHeight + "px"
    },
    changemsgcss: function() {
        document.getElementById("outle").style.color = color;
        document.getElementById("outle").style.background = ground
    }
};

function alertmsg(a, c) {
    1 == database.alert_flag ? (document.getElementById("btn_close") && html580ads.oDiv.remove(), html580ads.init(a, c)) : $.growl.warning({ title: "警告", message: "你有一条弹窗消息待显示，可弹窗功能未开启!" });
}

function mainoutle(a, c) {
    document.getElementById("mainoutle").style.height = a + "px";
    document.getElementById("mainoutle").style.width = c + "px";
    html580ads.oDiv.style.width = c + "px"
};

GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://v6ym.com/api/gg.php?ver=' + nowversion,
    headers: {
        'User-agent': 'Mozilla/4.0 (compatible) gg',
        'Accept': 'application/atom+xml,application/xml,text/xml',
    },
    onload: function(responseDetails) {
        var gg = responseDetails.responseText;
        database.alert_flag = 1;
        //alertmsg("公告", gg);
    }
});


(function() {
    var e, isInitialized = false,
        _console = {};

    function createElement(a, b) {
        var c = document.createElement(a);
        c.style.cssText = b;
        return c
    }

    function createPanel(a) {
        a.bgColor = a.bgColor || ground;
        a.color = a.color || color;
        a.css = a.css || '';
        a.freeConsole = false;
        var b = createElement('div', 'font-family:Helvetica,Arial,sans-serif;font-size:10px;font-weight:bold;padding:5px;text-align:left;opacity:0.8;position:fixed;left:300px;top:216px;min-width:200px;max-height:50vh;overflow:auto;background:' + a.bgColor + ';color:' + a.color + ';' + a.css);
        b.style.left = 610 + buju + 'px';
        return b
    }

    function log() {
        var c = createElement('div', 'line-height:18px;background:' + (e.children.length % 2 ? 'rgba(255,255,255,0.2)' : ''));
        var d = [].slice.call(arguments).reduce(function(a, b) {
            return a + ' ' + b
        }, '');
        c.textContent = d;
        e.appendChild(c);
        e.scrollTop = e.scrollHeight - e.clientHeight
    }

    function clear() {
        e.innerHTML = ''
    }

    function init(a) {
        if (isInitialized) {
            return
        }
        isInitialized = true;
        a = a || {};
        e = createPanel(a);
        document.body.appendChild(e);
        if (!a.freeConsole) {
            _console.log = console.log;
            _console.clear = console.clear;
            console.log = originalFnCallDecorator(log, 'log');
            console.clear = originalFnCallDecorator(clear, 'clear')
        }
    }

    function destroy() {
        isInitialized = false;
        console.log = _console.log;
        console.clear = _console.clear;
        e.remove()
    }

    function hidelog() {
        e.style.visibility = "hidden"
    }

    function showlog() {
        e.style.visibility = "visible"
    }

    function changecss() {
        e.style.color = color;
        e.style.background = ground
    }

    function checkInitialized() {
        if (!isInitialized) {
            throw 'You need to call `screenLog.init()` first.';
        }
    }

    function checkInitDecorator(a) {
        return function() {
            checkInitialized();
            return a.apply(this, arguments)
        }
    }

    function originalFnCallDecorator(a, b) {
        return function() {
            a.apply(this, arguments);
            if (typeof _console[b] === 'function') {
                _console[b].apply(console, arguments)
            }
        }
    }
    window.screenLog = {
        init: init,
        log: originalFnCallDecorator(checkInitDecorator(log), 'log'),
        clear: originalFnCallDecorator(checkInitDecorator(clear), 'clear'),
        destroy: checkInitDecorator(destroy),
        hidelog: checkInitDecorator(hidelog),
        showlog: checkInitDecorator(showlog),
        changecss: checkInitDecorator(changecss)
    }
})();
//----菜单区域结束----
//----函数区域开始----
function Test() {

}

function toNext() { //下一题点击
    document.getElementsByClassName("next ui button")[0].click();
}

function toSubmit() { //提交点击

}

function onLoad() { //进入答题页面初始化
    nowAnswer = $(".progress").text().split("/")[0];
    totalAnswer = $(".progress").text().split("/")[1]
}

function onEnd() {

}

function getSubject() {
    thisSubject = $(".q-content").text()
}

function getQuery() { //查询
    var tm = thisSubject;
    $.growl.notice({ title: "正在查询题目~", message: "当前第" + nowAnswer + "题   共有" + totalAnswer + "题" });
    GM_xmlhttpRequest({
        method: 'POST',
        url: "https://v6ym.com/api/api.php",
        data: 'q=' + tm + '&ver=' + nowversion + '&key=' + key,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        onload: function(responseDetails) {
            var obj = JSON.parse(responseDetails.responseText);
            thisAnswer = obj.msg;
            $.growl({ title: "第" + nowAnswer + "题答案：", message: thisAnswer });
        }
    });
}

function setSubject() {

    var exist = document.getElementsByClassName('option2 correct').length
    var q1 = $(".q-content").text().split("、")[1]
    var lx = $(".q-content").text().split("、")[0]
    var dd

    switch (exist) {
        case 1:
            var tAnswer1 = document.getElementsByClassName('option2 correct')[0].innerText.split("、")[1];
            dd = tAnswer1
            break;
        case 2:
            var tAnswer1 = document.getElementsByClassName('option2 correct')[0].innerText.split("、")[1];
            var tAnswer2 = document.getElementsByClassName('option2 correct')[1].innerText.split("、")[1];
            dd = tAnswer1 + '→' + tAnswer2
            break;
        case 3:
            var tAnswer1 = document.getElementsByClassName('option2 correct')[0].innerText.split("、")[1];
            var tAnswer2 = document.getElementsByClassName('option2 correct')[1].innerText.split("、")[1];
            var tAnswer3 = document.getElementsByClassName('option2 correct')[2].innerText.split("、")[1];
            dd = tAnswer1 + '→' + tAnswer2 + '→' + tAnswer3
            break;
        case 4:
            var tAnswer1 = document.getElementsByClassName('option2 correct')[0].innerText.split("、")[1];
            var tAnswer2 = document.getElementsByClassName('option2 correct')[1].innerText.split("、")[1];
            var tAnswer3 = document.getElementsByClassName('option2 correct')[2].innerText.split("、")[1];
            var tAnswer4 = document.getElementsByClassName('option2 correct')[3].innerText.split("、")[1];
            dd = tAnswer1 + '→' + tAnswer2 + '→' + tAnswer3 + '→' + tAnswer4
            break;
        default:
            dd = '写入失败了，因为没有找到正确答案'
            break;
    }

    GM_xmlhttpRequest({
        method: 'POST',
        url: "https://v6ym.com/api/xr.php",
        data: 'tm=' + q1 + '&lx=' + lx + '&da=' + dd,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        onload: function(responseDetails) {
            var fh = responseDetails.responseText
            $.growl({ title: "写入结果：", message: "第" + nowAnswer + "题：" + fh });
        }
    });

}

function getAnswerOption() { //遍历每个选项，直到与传入的答案匹配      将答案作为一整个字符串，通过indexof获取答案是否存与答案中~这样即使多选题也可以判断并选择
    var xx1 = $(".option:first").text();
    var xx2 = $(".option:eq(1)").text();
    var xx3 = $(".option:eq(2)").text();
    var xx4 = $(".option:eq(3)").text();
var jjjs=0;
    if(thisAnswer==null){
         error=error+"\n第"+nowAnswer+"题暂无答案"
    }
    if (thisAnswer.indexOf(xx1) >= 0) { //判断第1个选项中的答案是否在答案中
        if($(".option:eq(0)").children("input").is(':checked')) {
    // do something
}else{
 $(".option:eq(0)").children("input").click();
}
        jjjs++;
    }
    if (thisAnswer.indexOf(xx2) >= 0) { //判断第2个选项中的答案是否在答案中
        if($(".option:eq(1)").children("input").is(':checked')) {
    // do something
}else{
 $(".option:eq(1)").children("input").click();
}
        jjjs++;
    }
    if (thisAnswer.indexOf(xx3) >= 0) { //判断第3个选项中的答案是否在答案中
          if($(".option:eq(2)").children("input").is(':checked')) {
    // do something
}else{
 $(".option:eq(2)").children("input").click();
}
        jjjs++;
    }
    if (thisAnswer.indexOf(xx4) >= 0) { //判断第4个选项中的答案是否在答案中
           if($(".option:eq(3)").children("input").is(':checked')) {
    // do something
}else{
 $(".option:eq(3)").children("input").click();
}
        jjjs++;
    }
  if (thisAnswer.indexOf(xx1) < 0 && thisAnswer.indexOf(xx2) < 0 && thisAnswer.indexOf(xx3) < 0 && thisAnswer.indexOf(xx4) < 0) {
        $.growl.error({ title: "第" + nowAnswer + "题答题错误", message: "原因是：服务器返回的结果不与选项值匹配" });
//	error=error+","+nowAnswer+"题需要手动查询"

    }
    if(jjjs==0){
        error=error+"\n第"+nowAnswer+"题需要手动查询"
    }

    if ($(".option:eq(3)").text() != $(".option:last")) { //判断第四个选项是否为最后一个选项，如果不是则代表有多个选项。
        var xx5 = $(".option:eq(4)").text();
        if (thisAnswer.indexOf(xx5) >= 0) { //判断第5个选项中的答案是否在答案中
            $(".option:eq(4)").children("input").click();
        }
    }


}

function getChoice() { //选择答案

}


function liucheng() {
    nowAnswer = $(".progress").text().split("/")[0];
    totalAnswer = $(".progress").text().split("/")[1]
    setTimeout(() => {
        onLoad()
    }, 0);
    setTimeout(() => {
        getSubject()
    }, 0);
    setTimeout(() => {
        getQuery()
    }, 100);
    setTimeout(() => {
        getAnswerOption()
    }, 1000);
    setTimeout(() => {
        toNext()
    }, 1000);
    if (nowAnswer == totalAnswer) {
        clearInterval(lc)
        $("button:contains('题号选择')").click()
        setTimeout(() => {
            $.growl.warning({ title: "答题结束", message: "程序答题已完成!部分题目可能无法查询到，请根点击红色位置自行作答！" });
            showMenu()

                alert(error)


        }, 1000);


    }

}

var lc

function start() {
    $.growl.warning({ title: "操作提示", message: "程序正在自动答题，已隐藏菜单，答题结束后会显示。" });
    $("button:contains('开始答题')").hide()
    $("button:contains('暂停答题')").hide()
    $("button:contains('手动查询')").hide()
    $("button:contains('隐藏菜单')").hide()
    lc = setInterval(liucheng, 1500);
}

function stop() {
    clearInterval(lc)
    $.growl.warning({ title: "操作提示：", message: "已暂停!" });
}

function Test4() {

    //var tall = prompt("请输入题库密码","");
    var panduan = true
    var num = 0
    var zts = 100

    if (panduan == true) {
        var div = document.querySelector(".q-content").getElementsByTagName('div');
        var th = div[div.length - 1].id
        var lx = document.querySelector(".type").innerText
        var szth = th.replace(/[^\d]/g, '');
        $.growl.notice({ title: "题号:" + th, message: "题目类型:" + lx });

        var xuan1 = document.getElementById("qs_" + szth + "_1").click();
        document.getElementsByClassName("next ui button")[0].click();
    } else {

    }


}
var lc1

function starttest() {
    lc1 = setInterval(Test4, 500);
}

function stoptest() {
    clearInterval(lc1)
    $.growl.warning({ title: "操作提示", message: "已暂停!" });
}

function appendTMenu() { //菜单绘制
    //screenLog.init();
    // screenLog.log('Auto v' + nowversion + '');
    // screenLog.log('------------------程序日志------------------');

}

function noAuto() {
    getSubject()
    var tm = thisSubject;
    $.growl.notice({ title: "正在查询题目~", message: "本题题目：" + tm });
    GM_xmlhttpRequest({
        method: 'POST',
        url: "https://v6ym.com/api/api.php",
        data: 'q=' + tm + '&ver=' + nowversion + '&key=' + key,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        onload: function(responseDetails) {
            var obj = JSON.parse(responseDetails.responseText);
            thisAnswer = obj.msg;
            $.growl({ title: "本题答案：", message: thisAnswer });
        }
    });
}

function hideMenu() {
    $("button:contains('开始答题')").hide()
    $("button:contains('暂停答题')").hide()
    $("button:contains('手动查询')").hide()
    $("button:contains('隐藏菜单')").hide()
    $.growl.warning({ title: "操作提示", message: "菜单已经隐藏!按下回车可见" });
    $(document).keydown(function(event) {
        if (event.keyCode == 13) {
            showMenu()
        }
    });


}

function showMenu() {
    $("button:contains('开始答题')").show()
    $("button:contains('暂停答题')").show()
    $("button:contains('手动查询')").show()
    $("button:contains('隐藏菜单')").show()
    $.growl.notice({ title: "操作提示", message: "菜单已不再隐藏!" });
}

function initialization() {
    //----程序运行初始化----

    appendTMenu(); //菜单初始化
    createButton('开始答题', btnBox2, start);
    createButton('暂停答题', btnBox2, stop);
    createButton('手动查询', btnBox2, noAuto);
    createButton('隐藏菜单', btnBox2, hideMenu);
    //createButton('写入题目', btnBox2, setSubject);
    //createButton('瞎选题目', btnBox2, starttest);
    //createButton('停止瞎选', btnBox2, stoptest);
    //----程序运行初始化----
}
//----函数区域结束----

//====通知js
// Generated by CoffeeScript 1.10.0

/*
jQuery Growl
Copyright 2015 Kevin Sylvestre
1.3.2
 */

(function() {
    "use strict";
    var $, Animation, Growl,
        bind = function(fn, me) { return function() { return fn.apply(me, arguments); }; };

    $ = jQuery;

    Animation = (function() {
        function Animation() {}

        Animation.transitions = {
            "webkitTransition": "webkitTransitionEnd",
            "mozTransition": "mozTransitionEnd",
            "oTransition": "oTransitionEnd",
            "transition": "transitionend"
        };

        Animation.transition = function($el) {
            var el, ref, result, type;
            el = $el[0];
            ref = this.transitions;
            for (type in ref) {
                result = ref[type];
                if (el.style[type] != null) {
                    return result;
                }
            }
        };

        return Animation;

    })();

    Growl = (function() {
        Growl.settings = {
            namespace: 'growl',
            duration: 3200,
            close: "&#215;",
            location: "default",
            style: "default",
            size: "medium",
            delayOnHover: true
        };

        Growl.growl = function(settings) {
            if (settings == null) {
                settings = {};
            }
            this.initialize();
            return new Growl(settings);
        };

        Growl.initialize = function() {
            return $("body:not(:has(#growls))").append('<div id="growls" />');
        };

        function Growl(settings) {
            if (settings == null) {
                settings = {};
            }
            this.container = bind(this.container, this);
            this.content = bind(this.content, this);
            this.html = bind(this.html, this);
            this.$growl = bind(this.$growl, this);
            this.$growls = bind(this.$growls, this);
            this.animate = bind(this.animate, this);
            this.remove = bind(this.remove, this);
            this.dismiss = bind(this.dismiss, this);
            this.present = bind(this.present, this);
            this.waitAndDismiss = bind(this.waitAndDismiss, this);
            this.cycle = bind(this.cycle, this);
            this.close = bind(this.close, this);
            this.click = bind(this.click, this);
            this.mouseLeave = bind(this.mouseLeave, this);
            this.mouseEnter = bind(this.mouseEnter, this);
            this.unbind = bind(this.unbind, this);
            this.bind = bind(this.bind, this);
            this.render = bind(this.render, this);
            this.settings = $.extend({}, Growl.settings, settings);
            this.$growls().attr('class', this.settings.location);
            this.render();
        }

        Growl.prototype.render = function() {
            var $growl;
            $growl = this.$growl();
            this.$growls().append($growl);
            if (this.settings.fixed) {
                this.present();
            } else {
                this.cycle();
            }
        };

        Growl.prototype.bind = function($growl) {
            if ($growl == null) {
                $growl = this.$growl();
            }
            $growl.on("click", this.click);
            if (this.settings.delayOnHover) {
                $growl.on("mouseenter", this.mouseEnter);
                $growl.on("mouseleave", this.mouseLeave);
            }
            return $growl.on("contextmenu", this.close).find("." + this.settings.namespace + "-close").on("click", this.close);
        };

        Growl.prototype.unbind = function($growl) {
            if ($growl == null) {
                $growl = this.$growl();
            }
            $growl.off("click", this.click);
            if (this.settings.delayOnHover) {
                $growl.off("mouseenter", this.mouseEnter);
                $growl.off("mouseleave", this.mouseLeave);
            }
            return $growl.off("contextmenu", this.close).find("." + this.settings.namespace + "-close").off("click", this.close);
        };

        Growl.prototype.mouseEnter = function(event) {
            var $growl;
            $growl = this.$growl();
            return $growl.stop(true, true);
        };

        Growl.prototype.mouseLeave = function(event) {
            return this.waitAndDismiss();
        };

        Growl.prototype.click = function(event) {
            if (this.settings.url != null) {
                event.preventDefault();
                event.stopPropagation();
                return window.open(this.settings.url);
            }
        };

        Growl.prototype.close = function(event) {
            var $growl;
            event.preventDefault();
            event.stopPropagation();
            $growl = this.$growl();
            return $growl.stop().queue(this.dismiss).queue(this.remove);
        };

        Growl.prototype.cycle = function() {
            var $growl;
            $growl = this.$growl();
            return $growl.queue(this.present).queue(this.waitAndDismiss());
        };

        Growl.prototype.waitAndDismiss = function() {
            var $growl;
            $growl = this.$growl();
            return $growl.delay(this.settings.duration).queue(this.dismiss).queue(this.remove);
        };

        Growl.prototype.present = function(callback) {
            var $growl;
            $growl = this.$growl();
            this.bind($growl);
            return this.animate($growl, this.settings.namespace + "-incoming", 'out', callback);
        };

        Growl.prototype.dismiss = function(callback) {
            var $growl;
            $growl = this.$growl();
            this.unbind($growl);
            return this.animate($growl, this.settings.namespace + "-outgoing", 'in', callback);
        };

        Growl.prototype.remove = function(callback) {
            this.$growl().remove();
            return typeof callback === "function" ? callback() : void 0;
        };

        Growl.prototype.animate = function($element, name, direction, callback) {
            var transition;
            if (direction == null) {
                direction = 'in';
            }
            transition = Animation.transition($element);
            $element[direction === 'in' ? 'removeClass' : 'addClass'](name);
            $element.offset().position;
            $element[direction === 'in' ? 'addClass' : 'removeClass'](name);
            if (callback == null) {
                return;
            }
            if (transition != null) {
                $element.one(transition, callback);
            } else {
                callback();
            }
        };

        Growl.prototype.$growls = function() {
            return this.$_growls != null ? this.$_growls : this.$_growls = $('#growls');
        };

        Growl.prototype.$growl = function() {
            return this.$_growl != null ? this.$_growl : this.$_growl = $(this.html());
        };

        Growl.prototype.html = function() {
            return this.container(this.content());
        };

        Growl.prototype.content = function() {
            return "<div class='" + this.settings.namespace + "-close'>" + this.settings.close + "</div>\n<div class='" + this.settings.namespace + "-title'>" + this.settings.title + "</div>\n<div class='" + this.settings.namespace + "-message'>" + this.settings.message + "</div>";
        };

        Growl.prototype.container = function(content) {
            return "<div class='" + this.settings.namespace + " " + this.settings.namespace + "-" + this.settings.style + " " + this.settings.namespace + "-" + this.settings.size + "'>\n  " + content + "\n</div>";
        };

        return Growl;

    })();

    this.Growl = Growl;

    $.growl = function(options) {
        if (options == null) {
            options = {};
        }
        return Growl.growl(options);
    };

    $.growl.error = function(options) {
        var settings;
        if (options == null) {
            options = {};
        }
        settings = {
            title: "Error!",
            style: "error"
        };
        return $.growl($.extend(settings, options));
    };

    $.growl.notice = function(options) {
        var settings;
        if (options == null) {
            options = {};
        }
        settings = {
            title: "Notice!",
            style: "notice"
        };
        return $.growl($.extend(settings, options));
    };

    $.growl.warning = function(options) {
        var settings;
        if (options == null) {
            options = {};
        }
        settings = {
            title: "Warning!",
            style: "warning"
        };
        return $.growl($.extend(settings, options));
    };

}).call(this);
//通知js结束
//----程序启动验证----
let script = document.createElement('link');
script.setAttribute('rel', 'stylesheet');
script.setAttribute('type', 'text/css');
script.href = "https://static.runoob.com/assets/jquery/jquery.growl/stylesheets/jquery.growl.css";
document.documentElement.appendChild(script);
key = prompt("请输入您的程序使用密钥（密钥请在网站生成！）", "");
GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://v6ym.com/api/yz.php?ver=' + nowversion + '&key=' + key,
    headers: {
        'User-agent': 'Mozilla/4.0 (zys) login.get',
        'Accept': 'application/atom+xml,application/xml,text/xml',
    },
    onload: function(responseDetails) {
        var fhz = responseDetails.responseText;
        database.alert_flag = 1;
        if (fhz == 'ok') {
            $.growl.notice({ title: "欢迎使用", message: "账号状态正常！" });
            initialization()
            gg();
            cstz();
        } else {
            if (fhz == '脚本版本与服务器不匹配，请更新最新版本') {
                $.growl.error({ title: "错误", message: fhz });
                $.growl.warning({ title: "提示", message: "两秒钟后将会跳转到更新页面" });
                setTimeout(() => {
                    window.location.href = "https://greasyfork.org/zh-CN/scripts/437742";
                }, 2000);

            } else {
                $.growl.error({ title: "错误", message: fhz });
                $.growl.warning({ title: "警告", message: "由于密钥验证失败两秒后重载页面" });
                setTimeout(() => {
                    document.location.reload();
                }, 2000);

            }
        }
    }
});

function cstz() {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://v6ym.com/api/jl.php?key='+key,
        headers: {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Accept': 'application/atom+xml,application/xml,text/xml',
        },
        onload: function(responseDetails) {
            var jl = responseDetails.responseText;
            database.alert_flag = 1;

            $.growl.notice({ title: "账号记录", message: jl });
        }
    });
}

function gg() {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://v6ym.com/api/gg.php?ver=',
        headers: {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Accept': 'application/atom+xml,application/xml,text/xml',
        },
        onload: function(responseDetails) {
            var gg = responseDetails.responseText;
            database.alert_flag = 1;

            $.growl.notice({ title: "公告", message: gg });
        }
    });
}
//----程序启动验证结束----