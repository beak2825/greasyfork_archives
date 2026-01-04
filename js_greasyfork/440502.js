// ==UserScript==
// @name          雨课堂自动滚动
// @version       1.3
// @license       GPLv3
// @namespace     htpps://oair.top/
// @description   雨课堂v2版进入课件页面自动开启，每五秒翻一次，按空格暂停
// @include       https://www.yuketang.cn/v2/*
// @include       https://pro.yuketang.cn/v2/*
// @include       https://changjiang.yuketang.cn/v2/*
// @include       https://huanghe.yuketang.cn/v2/*
// @require       https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/440502/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/440502/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

//清理循环变量
try { clearInterval(window.interval); } catch {}

//模拟按下按键
function fireKeyEvent(el, evtType, keyCode){
    var doc = el.ownerDocument,
        win = doc.defaultView || doc.parentWindow,
        evtObj;
    if(doc.createEvent){
        if(win.KeyEvent) {
            evtObj = doc.createEvent('KeyEvents');
            evtObj.initKeyEvent( evtType, true, true, win, false, false, false, false, keyCode, 0 );
        }
        else {
            evtObj = doc.createEvent('UIEvents');
            Object.defineProperty(evtObj, 'keyCode', {
                get : function() { return this.keyCodeVal; }
            });
            Object.defineProperty(evtObj, 'which', {
                get : function() { return this.keyCodeVal; }
            });
            evtObj.initUIEvent( evtType, true, true, win, 1 );
            evtObj.keyCodeVal = keyCode;
            if (evtObj.keyCode !== keyCode) {
                console.log("keyCode " + evtObj.keyCode + " 和 (" + evtObj.which + ") 不匹配");
            }
        }
        el.dispatchEvent(evtObj);
    }
    else if(doc.createEventObject){
        evtObj = doc.createEventObject();
        evtObj.keyCode = keyCode;
        el.fireEvent('on' + evtType, evtObj);
    }
}

//暂停控制变量
var go_on = true;

//暂停-监控键盘空格
$(document).keypress(function(event){
    if(event.keyCode == 32){
        if(window.go_on){
            window.go_on = false;
            $(".tt").text("(滚动已暂停)");
        } else {
            window.go_on = true;
            $(".tt").text("(正在滚动中)");
        }
    }
   });

//控制翻页循环
var interval = setInterval(function() {
    if($(".tt").length == 0){
        $($(".dialog-header").children()[0]).after($("<span></span>").text("(正在滚动中)").attr("class","tt"));
        window.go_on=true;
    }
    else if(window.go_on == true){
        fireKeyEvent($(".layout_left")[0],"keydown",40);
    }
},5000);