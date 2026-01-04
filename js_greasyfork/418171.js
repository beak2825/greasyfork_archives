// ==UserScript==
// @name         F**K_Quality_Education
// @namespace    http://tampermonkey.net/
// @version      0.4_alpha
// @description  辣鸡素质教育，毁我青春！
// @author       muyulong
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js
// @match        http://szjz.hytc.edu.cn/student/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/418171/F%2A%2AK_Quality_Education.user.js
// @updateURL https://update.greasyfork.org/scripts/418171/F%2A%2AK_Quality_Education.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //界面。。
    let div = document.createElement('div'); //定时按钮
    let stop = document.createElement('div'); //停止按钮
    let view = document.createElement('div'); //状态
    let css =
        'background: #ff9100;' +
        'color:#ffffff;' +
        'overflow: hidden;' +
        'z-index: 996;' +
        'position: fixed;' +
        'text-align:center;' +
        'width: 80px;' +
        'height: 40px;' +
        'font-size:17px;' +
        'border-radius:30px;' +
        'border:2px solid #804d0a;' +
        'padding: 0;left: 200px;' +
        'top: 25%;display: flex;' +
        'justify-content: center;' +
        'align-items: center;' +
        'cursor: pointer;' +
        'text-shadow:1px 1px 5px #000000;' +
        'line-height: 100%;';

    let statu_css =
        'color:#ffffff;' +
        'overflow: hidden;' +
        'z-index: 996;' +
        'position: fixed;' +
        'text-align:center;' +
        'width: 250px;' +
        'height: 50px;' +
        'font-size:17px;' +
        'padding: 0;left: 200px;' +
        'top: 25%;display: flex;' +
        'justify-content: center;' +
        'align-items: center;' +
        'cursor: pointer;' +
        'text-shadow:1px 1px 5px #000000;' +
        'line-height: 100%;';


    div.id = 'btn';
    div.style.cssText = css;
    div.innerHTML = '金手指';

    stop.id = 'stop';
    stop.style.cssText = css;
    stop.innerHTML = '停止';

    view.id = 'view';
    view.style.cssText = statu_css;
    view.innerHTML = '当前状态：已开启（默认）';
    jwplayer().setMute(true);
    document.getElementById('container').appendChild(div);
    document.getElementById('container').appendChild(stop);
    document.getElementById('container').appendChild(view);

    document.getElementById('stop').style.marginTop = '100px';
    document.getElementById('view').style.marginTop = '50px';
    var myVar;
    myVar = setInterval(obsTextClick, 3000);
    div.onclick = function () {
        myVar = setInterval(obsTextClick, 3000);
        jwplayer().setMute(true);
        console.log("金手指已开启");
        view.innerHTML = '当前状态：已开启';
    };

    stop.onclick = function () {
        myVar = clearInterval(myVar);
        jwplayer().setMute(false);
        console.log("金手指已关闭");
        view.innerHTML = '当前状态：已关闭';
    };


    function obsTextClick() {
        if ($("#alertDiv").prop('disabled') == true) {
            //存在 点击
            save();
            $("#popupButton").click(function () {
                $("#popupButton").trigger("click");
                console.log("111");
            });
            console.log("点击确定");
        }
        if ($("#alertDiv").css("display") != "none") {
            save();
            $("#popupButton").click(function () {
                $("#popupButton").trigger("click");
                console.log("222");
            });
            console.log("点击确定");
        }
    }

})();