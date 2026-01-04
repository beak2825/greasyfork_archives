// ==UserScript==
// @name         Travian发兵助手
// @namespace    http://tampermonkey.net/
// @version      0.52
// @description  倒计时准时发兵
// @author       bingkx
// @match        https://*.travian.com/build.php?gid=16&tt=2
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/463610/Travian%E5%8F%91%E5%85%B5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/463610/Travian%E5%8F%91%E5%85%B5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
(function (workerScript) {
	if (!/MSIE 10/i.test (navigator.userAgent)) {
		try {
			var blob = new Blob (["\
var fakeIdToId = {};\
onmessage = function (event) {\
	var data = event.data,\
		name = data.name,\
		fakeId = data.fakeId,\
		time;\
	if(data.hasOwnProperty('time')) {\
		time = data.time;\
	}\
	switch (name) {\
		case 'setInterval':\
			fakeIdToId[fakeId] = setInterval(function () {\
				postMessage({fakeId: fakeId});\
			}, time);\
			break;\
		case 'clearInterval':\
			if (fakeIdToId.hasOwnProperty (fakeId)) {\
				clearInterval(fakeIdToId[fakeId]);\
				delete fakeIdToId[fakeId];\
			}\
			break;\
		case 'setTimeout':\
			fakeIdToId[fakeId] = setTimeout(function () {\
				postMessage({fakeId: fakeId});\
				if (fakeIdToId.hasOwnProperty (fakeId)) {\
					delete fakeIdToId[fakeId];\
				}\
			}, time);\
			break;\
		case 'clearTimeout':\
			if (fakeIdToId.hasOwnProperty (fakeId)) {\
				clearTimeout(fakeIdToId[fakeId]);\
				delete fakeIdToId[fakeId];\
			}\
			break;\
	}\
}\
"]);
			// Obtain a blob URL reference to our worker 'file'.
			workerScript = window.URL.createObjectURL(blob);
		} catch (error) {
			/* Blob is not supported, use external script instead */
		}
	}
	var worker,
		fakeIdToCallback = {},
		lastFakeId = 0,
		maxFakeId = 0x7FFFFFFF, // 2 ^ 31 - 1, 31 bit, positive values of signed 32 bit integer
		logPrefix = 'HackTimer.js by turuslan: ';
	if (typeof (Worker) !== 'undefined') {
		function getFakeId () {
			do {
				if (lastFakeId == maxFakeId) {
					lastFakeId = 0;
				} else {
					lastFakeId ++;
				}
			} while (fakeIdToCallback.hasOwnProperty (lastFakeId));
			return lastFakeId;
		}
		try {
			worker = new Worker (workerScript);
			window.setInterval = function (callback, time /* , parameters */) {
				var fakeId = getFakeId ();
				fakeIdToCallback[fakeId] = {
					callback: callback,
					parameters: Array.prototype.slice.call(arguments, 2)
				};
				worker.postMessage ({
					name: 'setInterval',
					fakeId: fakeId,
					time: time
				});
				return fakeId;
			};
			window.clearInterval = function (fakeId) {
				if (fakeIdToCallback.hasOwnProperty(fakeId)) {
					delete fakeIdToCallback[fakeId];
					worker.postMessage ({
						name: 'clearInterval',
						fakeId: fakeId
					});
				}
			};
			window.setTimeout = function (callback, time /* , parameters */) {
				var fakeId = getFakeId ();
				fakeIdToCallback[fakeId] = {
					callback: callback,
					parameters: Array.prototype.slice.call(arguments, 2),
					isTimeout: true
				};
				worker.postMessage ({
					name: 'setTimeout',
					fakeId: fakeId,
					time: time
				});
				return fakeId;
			};
			window.clearTimeout = function (fakeId) {
				if (fakeIdToCallback.hasOwnProperty(fakeId)) {
					delete fakeIdToCallback[fakeId];
					worker.postMessage ({
						name: 'clearTimeout',
						fakeId: fakeId
					});
				}
			};
			worker.onmessage = function (event) {
				var data = event.data,
					fakeId = data.fakeId,
					request,
					parameters,
					callback;
				if (fakeIdToCallback.hasOwnProperty(fakeId)) {
					request = fakeIdToCallback[fakeId];
					callback = request.callback;
					parameters = request.parameters;
					if (request.hasOwnProperty ('isTimeout') && request.isTimeout) {
						delete fakeIdToCallback[fakeId];
					}
				}
				if (typeof (callback) === 'string') {
					try {
						callback = new Function (callback);
					} catch (error) {
						console.log (logPrefix + 'Error parsing callback code string: ', error);
					}
				}
				if (typeof (callback) === 'function') {
					callback.apply (window, parameters);
				}
			};
			worker.onerror = function (event) {
				console.log (event);
			};
		} catch (error) {
			console.log (logPrefix + 'Initialisation failed');
			console.error (error);
		}
	} else {
		console.log (logPrefix + 'Initialisation failed - HTML5 Web Worker is not supported');
	}
}) ('HackTimerWorker.js');

window.startFromStr = function (string, sStart, iCount) {
    var iPos = string.indexOf(sStart);
    if (iPos < 0)
        return "";
    return string.substr(iPos + sStart.length, iCount);
}
window.endWithStr = function (string, sEnd) {
    var iPos = string.indexOf(sEnd);
    if (iPos < 0)
        return "";
    return string.substr(0, iPos);
}
window.getStrBetween = function (string, start, end, maxLength) {
    if (maxLength == null)
        maxLength = 100;//default result string max length
    var result = startFromStr(string, start, maxLength + end.length);
    result = endWithStr(result, end);
    return result;
}
window.parseDecimal = function (str) {
    var result = parseInt(str, 10);

    if (isNaN(result)) {
        postMessage("无法解析的数字:" + str);
        return NaN;
    } else {
        return result;
    }
}
window.parseTime = function (str) {
    //str is like "0:29:45"
    var iHour = parseDecimal(endWithStr(str, ":"));
    str = startFromStr(str, ":", 50);
    var iMin = parseDecimal(endWithStr(str, ":"));
    str = startFromStr(str, ":", 50);
    var iSec = parseDecimal(str);
    var result = ((iHour * 60) + iMin) * 60 + iSec;

    if (isNaN(result)) {
        postMessage("无法解析的时间:" + str);
        return NaN;
    } else {
        return result;
    }
}
window.getTimed = function (time) {
    var timed = (parseTime(time.substr(0, 8)) + parseDecimal(time.substr(9, 1)) * 0.1) * 1000;
    return timed;
}

window.getAverage = function (arr) {
    if (arr && arr.length != 0) {
        var sum = 0;
        for (var i = 0; i < arr.length; i++) {
            sum = sum + arr[i];
        }
        return Math.floor(sum / arr.length);
    }
    return 0;
}

window.getTimeDiff = function () {
    var startTime = getTimeStr(new Date());
    var xhr = new XMLHttpRequest();
    var url = "https://"+server+"/build.php?gid=16&tt=2";
    xhr.open("GET", url, false);
    xhr.send();
    var text = xhr.responseText;

    var info = getStrBetween(text, '<span  format="24h" class="timer" counting="up" value="', "/span>", 200);
    info = getStrBetween(info, '>', "<", 200);
    var realMS = parseTime(info) * 1000 + 100; //We suppose that server floors millisecs instead of rounds them
    var estimateMS = (parseTime(startTime.substr(0, 8)) + parseDecimal(startTime.substr(9, 3)) * 0.001) * 1000;
    var diff = realMS - estimateMS;
    //postMessage("timeDiff:" + diff);
    return diff;
}

window.sendTroops = function () {
    var btn = document.getElementById("checksum");
    if (btn) {
        setLocalStorage("TAR_running", "0");
        btn.click();
    }
}

window.getLocalStorage=function(lcProp){
    if(lcProp){
        return localStorage[lcProp];
    }
}
window.setLocalStorage=function(lcProp, val){
    if(lcProp){
        localStorage[lcProp]=val;
    }
}

window.timeDiffs = [];

window.timerAttackRefresh=function(){
    //getTimeDiff();
    //timerAttack();
    var backBtn = document.getElementById("back");
    if(!backBtn){
        backBtn=document.getElementById("editWave-0");
    }
    if(backBtn){
        setLocalStorage("TAR_refresh","1");
        backBtn.click();
        return;
    }
    var okBtn= document.getElementById("ok");
    if(okBtn){
        setLocalStorage("TAR_refresh", "0");
        okBtn.click();
        return;
    }
}
window.timerAttack = function () {
    var arrTime = document.getElementById("time").value;
    setLocalStorage("TAR_time", arrTime);
    var dur = document.getElementById("in").innerText;
    dur = getStrBetween(dur, "剩餘時間", "小時", null);
    var durTime = parseTime(dur) * 1000; //ms
    arrTime = (parseTime(arrTime.substr(0, 8)) + parseDecimal(arrTime.substr(9, 3)) * 0.001) * 1000; //ms
    var nowStr = getTimeStr(new Date());
    var iNow = (parseTime(nowStr.substr(0, 8)) + parseDecimal(nowStr.substr(9, 3)) * 0.001) * 1000;
    //var iNow = (new Date()).getTime(); //ms
    var timeOut = arrTime - iNow - durTime;
    if(timeOut<0){
        //postMessage("当天不可到达，改第二天");
        timeOut=timeOut+24*60*60*1000; //到第二天
    }
    if (timeOut < 30 * 1000) { //时间小于20秒, 最后一次校准，出发
        postMessage("时间小于30秒, 最后一次校准，马上出发");
        var diff = getTimeDiff(); //ms
        nowStr = getTimeStr(new Date());
        iNow = (parseTime(nowStr.substr(0, 8)) + parseDecimal(nowStr.substr(9, 3)) * 0.001) * 1000;
        timeDiffs.push(diff);
        var avgDiff = getAverage(timeDiffs);
        timeOut = arrTime - iNow - durTime - avgDiff;
        //postMessage("最后一次校准时差:" + diff);
        //postMessage("平均校准时差:" + diff);
        //postMessage("马上出发:" + timeOut);
        window.tarTimer=setTimeout(sendTroops, timeOut);
        return;
    } else if  (timeOut > 60*60 * 1000){//大于1小时要每小时刷新，防止退出登录
        postMessage("等待时间大于1小时，每小时刷新");
        if(timeOut<65*60*1000){
            timeOut=timeOut-5*60*1000;
        }else{
            timeOut=3600*1000;
        }
        window.tarTimer=setTimeout(timerAttackRefresh, timeOut);
        return;
    }else if (timeOut > 2 * 60 * 1000) { //到大约2分钟再发起
        postMessage("出发时间大于2分钟：" + timeOut); //???
        nowStr = getTimeStr(new Date());
        iNow = (parseTime(nowStr.substr(0, 8)) + parseDecimal(nowStr.substr(9, 3)) * 0.001) * 1000;
        timeOut = arrTime - iNow - durTime - 2 * 59 * 1000;
        postMessage("等待:" + timeOut);
        window.tarTimer=setTimeout(timerAttack, timeOut);
        return;
    }
    if (timeDiffs.length == 0) {
        for (var i = 0; i < 5; i++) { //初次校准5次取平均
            var diff = getTimeDiff();
            postMessage("第" + (i + 1) + "次校准，时差：" + diff + "毫秒");
            timeDiffs.push(diff);
        }
    } else {
        var diff = getTimeDiff();
        postMessage("单次校准，时差：" + diff + "毫秒");
        timeDiffs.push(diff);
    }
    var avgDiff = getAverage(timeDiffs); //ms
    postMessage("平均校准时差：" + avgDiff + "毫秒");
    nowStr = getTimeStr(new Date());
    iNow = (parseTime(nowStr.substr(0, 8)) + parseDecimal(nowStr.substr(9, 3)) * 0.001) * 1000;
    var tot = arrTime - iNow - durTime - avgDiff;
    if(tot<0){
        tot=tot+24*60*60*1000;
    }
    if (tot < 45 * 1000) {
        timeOut = tot - 20 * 1000;
    } else {
        timeOut = 25 * 1000;
    }
    postMessage("等待:" + timeOut + ",剩余：" + tot);
    window.tarTimer=setTimeout(timerAttack, timeOut); //25秒后再校准
}

window.tarBtnOnClick=function(){
    //var btnText="开始发兵";
    if(getLocalStorage("TAR_running")=="1"){
        clearTimeout(tarTimer);
        setLocalStorage("TAR_running", "0");
        var btnText="开始发兵";
        document.getElementById('tarBtn').innerHTML=btnText;
    }else{
        setLocalStorage("TAR_running", "1");
        timerAttack();
        var btnText="取消发兵";
        document.getElementById('tarBtn').innerHTML=btnText;
    }
}

window.getNowTimestamp = function () {
    var now = new Date();
    var hour = "0" + now.getHours();
    hour = hour.substr(hour.length - 2, 2);
    var min = "0" + now.getMinutes();
    min = min.substr(min.length - 2, 2);
    var sec = "0" + now.getSeconds();
    sec = sec.substr(sec.length - 2, 2);
    return now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " " + hour + ":" + min + ":" + sec;
    //return new Date().toLocaleString();
}

window.getTimeStr = function (date) {
    var timePos = date.toString().indexOf(":") - 2;
    var str = date.toString().substr(timePos, 8);
    var milliSec = date.getTime() % 1000;
    if (milliSec > 0) {
        var milliStr = "00" + milliSec;
        milliStr = milliStr.substr(milliStr.length - 3, 3);
        str += "." + milliStr;
    }

    return str;
}

window.g_sMessage = "";
window.postMessage = function (msg) {
    var nowTime=getNowTimestamp();
    g_sMessage += nowTime + ": " + msg + "<br/>\r\n";
    if (g_sMessage.length > 5000)
        g_sMessage = startFromStr(g_sMessage, "\r\n", 6000);
    document.getElementById('message').innerHTML = g_sMessage;
    var stoLog=getLocalStorage("travianLog");
    stoLog+=nowTime + ": " + msg + "\r\n";
    setLocalStorage("travianLog", stoLog);
}

window.server="";
window.getServer=function(){
    server=getStrBetween(window.location.href, "https://", "/", null);
}




window.dragElement = function (elmnt, localStorageProp) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    elmnt.querySelector(`.${elmnt.id}__header`).onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;

        if (elmnt.offsetLeft + elmnt.offsetWidth <= 50) {
            elmnt.style.left = 50 - elmnt.offsetWidth + "px";
        }

        if (elmnt.offsetTop < 0) {
            elmnt.style.top = "0";
        }

        if (localStorageProp !== undefined) {
            localStorage[localStorageProp] = JSON.stringify([elmnt.offsetTop, elmnt.offsetLeft]);
        }
    }
}


var cssText = (`
        .us-draggable {
            position: absolute;
            z-index: 9;
            background-color: #f1f1f1;
            border: 1px solid #d3d3d3;
            text-align: center !important;
            white-space: nowrap;
        }

        .us-draggable .us-draggable--header {
            padding: 8px;
            cursor: move;
            z-index: 10;
            background-color: #2196f3;
            color: #fff;
        }

        .us-draggable li {
            text-align: left;
        }

        .us-draggable ul {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin: 0 5px;
            padding: 0 0 0 16px;
        }

        .us-draggable td > a {
            display: block;
            padding: 14px;
        }

        .us-draggable td {
            padding: unset;
        }

        .us-draggable li.done {
            background-color: green;
        }

        .us-barBox {
            width: 50px;
            height: 7px;
            background-color: #52372a;
            margin: 0 2px;
        }

        .us-tmAttacker {
            display: flex;
            flex-direction: row;
            margin: 5px;
        }

        .us-bar {
            background-color: #699e32;
            height: 100%;
        }

        .us-resourceValue {
            font-size: 11px;
            font-weight: 700;
            text-align: end;
            margin-right: 2px;
        }

        .us--text-alert {
            color: #0022af;
        }

        .us-map-open {
            position: fixed !important;
            inset: 0 !important;
            width: unset !important;
            height: unset !important;
        }

        .us-alertFill--yellow {
            fill: yellow;    
        }
    
        .us--display-block {
            display: block !important;
        }

        .us-settingsIconSVG > svg:hover {
            fill: whitesmoke;
        }
        
        .message {
            font-size: 11px;
            font-weight: 700;
            text-align: left;
            margin-right: 2px;
        }
    `);



var insertCSS = function (cssStyle) {
    var style = document.createElement("style");
    var theHead = document.head || document.getElementsByTagName('head')[0];
    style.type = "text/css";//IE需要设置
    if (style.styleSheet) {  //IE
        var ieInsertCSS = function () {
            try {
                style.styleSheet.cssText = cssStyle;
            } catch (e) {
            }
        };
        //若当前styleSheet不能使用，则放到异步中
        if (style.styleSheet.disable) {
            setTimeout(ieInsertCSS, 10);
        } else {
            ieInsertCSS();
        }
    } else { //W3c浏览器
        style.appendChild(document.createTextNode(cssStyle));
        theHead.appendChild(style);
    }

}

insertCSS(cssText);
getServer();
if(getLocalStorage("TAR_refresh")=="1"){
    timerAttackRefresh();
}
if (document.getElementById("checksum")) { //确认是发兵页面
    const localStorageProp = `us_tmAttacker_coords`;

    // get draggable element coordinates
    let localStorage_coords = localStorage[localStorageProp];
    if (localStorage_coords === undefined) {
        localStorage_coords = [250, 0]; // top left
        localStorage[localStorageProp] = JSON.stringify(localStorage_coords);
    } else {
        localStorage_coords = JSON.parse(localStorage_coords);
    }
    const topTA = localStorage_coords[0];
    const leftTA = localStorage_coords[1];
    var arrTime=getLocalStorage("TAR_time");
    if(!arrTime){
        arrTime="23:00:00.4";
    }
    var btnText="开始发兵";
    if(getLocalStorage("TAR_running")=="1"){
        btnText="取消发兵";
    }
    const html = `<div id="us-tmAttacker" class="us-draggable" style="top:${topTA}px; left:${leftTA}px;">
<div class="us-tmAttacker__header us-draggable--header">TimerAttacker</div>
<div>输入到达时间：<input id="time" type="text" value=${arrTime} size="12" /></div>
<div class="us-draggable"><button id="tarBtn" onClick="tarBtnOnClick();">${btnText}</button></div>
<br />
<br /><div class="message"> 消息记录:</div>
<br />
<div id="message" class="message"></div>
<br />
</div>`;
    document.body.insertAdjacentHTML("beforeend", html);
    dragElement(document.getElementById("us-tmAttacker"), localStorageProp);
    if(getLocalStorage("TAR_running")=="1"){
        timerAttack();
    }
}

})();