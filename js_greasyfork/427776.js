// ==UserScript==
// @name         斗鱼直播自动发弹幕
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  斗鱼直播自动发弹幕，右小角出现盒子，输出内容，点击发送就行。要停止就点停止
// @author       河狸兽
// @match        *://*.douyu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427776/%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E5%8F%91%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/427776/%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E5%8F%91%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function () {
    var _timer_ = null;
    var spred = ['.', '.', '.', '.', '.'];
    var start = 1;
    // 加载样式
    var fixInp = document.createElement('textarea');
    var fixSend = document.createElement('input');
    var fixStop = document.createElement('input');
    var tips1 = document.createElement('p');
    var tips2 = document.createElement('span');
    var times = document.createElement('input');
    var fixWrap = document.createElement('div');
    var outer = document.createElement('div');
    var hide = document.createElement('span');
    var show = document.createElement('span');
    var checkdiv = document.createElement('div');
    var checkTip = document.createElement('span');
    var check = document.createElement('input');
    fixSend.setAttribute('type', 'submit');
    fixSend.setAttribute('value', '发送');
    fixStop.setAttribute('type', 'submit');
    fixStop.setAttribute('value', '停止');
    times.setAttribute('type', 'number');
    check.setAttribute('type', 'checkbox');
    tips1.innerHTML = '内容:';
    tips2.innerHTML = '间隔(秒):';
    hide.innerHTML = '隐藏';
    show.innerHTML = '显示';
    checkTip.innerHTML = '防重复发言:';
    outer.style.cssText = 'position: fixed; right: 10px; bottom: 10px; display: block; width:200px;padding: 10px; background:#4CAF50;z-index: 9999999;';
    times.style.cssText = 'display: inline-block; width: 40px;';
    fixInp.style.cssText = 'display: block;width: 100%;height:62px;box-sizing: border-box;';
    tips1.style.cssText = 'margin:0;padding:0;';
    fixWrap.style.cssText = 'display: inline-block;width:100%;';
    show.style.cssText = 'position: fixed; right: 10px; bottom: 10px;display:none;padding:2px; background:#4CAF50;font-size: 12px;color: #fff; cursor: pointer;';
    hide.style.cssText = 'display:inline-block;padding:2px; background:#b22;font-size: 12px;color: #fff; cursor: pointer;';
    times.value = 10;
    fixWrap.appendChild(hide);
    fixWrap.appendChild(tips1);
    fixWrap.appendChild(fixInp);
    fixWrap.appendChild(tips2);
    fixWrap.appendChild(times);
    fixWrap.appendChild(fixSend);
    fixWrap.appendChild(fixStop);
    checkdiv.appendChild(checkTip);
    checkdiv.appendChild(check);
    fixWrap.appendChild(checkdiv);
    outer.appendChild(fixWrap);
    document.body.appendChild(outer);
    document.body.appendChild(show);
    // 发送弹幕
    function send(message, bool) {
        if (bool) {
            var s = spred.slice(0, start++);
            message += s.join('');
            if (start > spred.length) {
                start = 1
            }
        }
        document.querySelector('.ChatSend-txt').value = message;
        document.querySelector('.ChatSend-button').click();
    }
    // 事件
    fixSend.addEventListener('click', function () {
        var time = parseInt(times.value);
        var message = fixInp.value;
        var bool = check.checked;
        fixSend.style.display = 'none';
        send(message);
        _timer_ = setInterval(function () {
            send(message, bool);
        }, time * 1000);
    });
    fixStop.addEventListener('click', function () {
        fixSend.style.display = 'inline-block';
        clearInterval(_timer_);
        _timer_ = null;
    });
    hide.addEventListener('click', function () {
        outer.style.display = 'none';
        show.style.display = 'inline-block';
    });
    show.addEventListener('click', function () {
        outer.style.display = 'block';
        show.style.display = 'none';
    });
})();