// ==UserScript==
// @name         bilibili直播间简易版独轮车
// @namespace    https://greasyfork.org/zh-TW/users/725704
// @version      1.0.2
// @description  这是bilibili直播间简易版独轮车
// @author       quiet
// @match        *://live.bilibili.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/421507/bilibili%E7%9B%B4%E6%92%AD%E9%97%B4%E7%AE%80%E6%98%93%E7%89%88%E7%8B%AC%E8%BD%AE%E8%BD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/421507/bilibili%E7%9B%B4%E6%92%AD%E9%97%B4%E7%AE%80%E6%98%93%E7%89%88%E7%8B%AC%E8%BD%AE%E8%BD%A6.meta.js
// ==/UserScript==

var $ = window.jQuery;
var Msg = [];
const scriptInitVal = {Msg:'',MsgSendInterval:1}
for(let initVal in scriptInitVal) {
    if(GM_getValue(initVal)===undefined) GM_setValue(initVal,scriptInitVal[initVal]);
}

var sendMsg = false;

(function() {
    var check = setInterval(() => {
        var input = document.getElementsByClassName('chat-input border-box')[0];
        if (input !== undefined) {
            var div = document.getElementsByClassName('bottom-actions p-relative')[0];
            var btn = document.createElement('button');
            btn.innerHTML = '独轮车面版';
            btn.style.background = '#23ade5';
            btn.style.color = 'white';
            btn.style.cursor = 'pointer';;
            btn.style.padding = '6px 12px';
            btn.style.border = '0';
            btn.style.borderRadius = '4px';
            div.appendChild(btn);
            var list = document.createElement('fieldset');
            list.style.position = 'absolute';
            list.style.zIndex = '1000';
            list.style.background = 'white'
            list.style.display = 'none';
            list.style.minWidth = '50px';
            list.style.left = '1094px';
            list.style.top = '809px';
            list.style.height = '300px';
            list.style.width = '250px';
            list.innerHTML = `<div style="margin:10px; height:80px; width: 200px;">
<button class="startSendBtn" style="background:#757575; cursor:pointer; border-radius: 4px; padding: 3px 6px;">开启独轮车</button>
<textarea class="MsgList" placeholder="在这输入弹幕，每一句不可超过20字（否则无法发送），每次发送一句。" style="height: 100px; width: 220px; resize: none;"></textarea>
<div class="MsgCount" style="display:inline;"></div><div style="display:inline;">  发送弹幕间隔:</div>
<input id="MsgSendInterval" style="display:inline; width:25px;" autocomplete="off" type="number" min="0" value="${GM_getValue('MsgSendInterval')}">
<div style="display:inline;">秒</div>
<br>
<div>日誌:</div>
<textarea class="MsgLogs" style="height: 100px; width: 220px; resize: none;" readonly></textarea>
</div>`;
            let i;
            document.body.appendChild(list);
            var startSendBtn = document.getElementsByClassName('startSendBtn')[0];
            startSendBtn.addEventListener('click',() => {
                if (!sendMsg) {
                    sendMsg = true;
                    startSendBtn.textContent = '关闭独轮车';
                    startSendBtn.style.background = '#23ade5';
                }else{
                    sendMsg = false;
                    startSendBtn.textContent = '开启独轮车';
                    startSendBtn.style.background = '#757575';
                };
            });
            btn.addEventListener('click',() => {
                if (list.style.display === 'none') {$(list).slideDown();}else{$(list).slideUp();};
            });
            var MsgInput = document.getElementsByClassName('MsgList')[0];
            var MsgCount = document.getElementsByClassName('MsgCount')[0];
            var MsgIntervalInput = document.getElementById('MsgSendInterval');
            MsgInput.addEventListener('input',() => {
                Msg = MsgInput.value.split('\n');
                if (MsgInput.value === '') {
                    MsgCount.textContent = `共0个弹幕`;
                }else{MsgCount.textContent = `共${Msg.length}个弹幕`;};
                GM_setValue('Msg', MsgInput.value);
            });
            MsgIntervalInput.addEventListener('input',()=>{
                if(!(parseInt(MsgIntervalInput.value)>=0)) MsgIntervalInput.value = 0;
                GM_setValue('MsgSendInterval',MsgIntervalInput.value);
            });
            let MsgValue = GM_getValue('Msg');
            MsgInput.value = MsgValue;
            MsgValue = MsgValue.split('\n');
            for (i = 0; i < MsgValue.length; i++) {
                Msg.push(MsgValue[i]);
            };
            if (MsgInput.value === '') {
                MsgCount.textContent = `共0个弹幕`;
            }else{MsgCount.textContent = `共${Msg.length}个弹幕`;};
            loop();
            clearInterval(check);
        };
    },100);
})();
async function loop() {
    let count = 0;
    let i;
    let MsgLogs = document.getElementsByClassName('MsgLogs')[0];
    let shortUid = window.location.href.split('live.bilibili.com/')[1];
    let room = await fetch(`http://api.live.bilibili.com/room/v1/Room/room_init?id=${shortUid}`,{
        method: 'GET',
        credentials: 'include'
    })
    let roomid = await room.json();
    roomid = roomid['data']['room_id'];
    let scrf = document.cookie.split(';').map(c=>c.trim()).filter(c => c.startsWith('bili_jct='))[0].split('bili_jct=')[1];
    while (true) {
        if (sendMsg === true) {
            let MsgSendInterval = GM_getValue('MsgSendInterval');
            for (i = 0; i < Msg.length; i++) {
                if (sendMsg === true) {
                    let send = await fetch('https://api.live.bilibili.com/msg/send',{
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'accept': 'application/json, text/javascript, */*; q=0.01',
                            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        body: `color=16777215&fontsize=25&mode=1&msg=${Msg[i]}&rnd=16082868&roomid=${roomid}&csrf_token=${scrf}&csrf=${scrf}`
                    });
                    let sendApiRes = await send.json();
                    if (sendApiRes['message'] !== "") {
                        MsgLogs.value = MsgLogs.value + `发送弹幕：【${Msg[i]}】失败，原因：${sendApiRes['message']}。\n`;
                    }else{MsgLogs.value = MsgLogs.value + `发送弹幕：【${Msg[i]}】成功\n`;};
                    MsgLogs.scrollTop = MsgLogs.scrollHeight;
                    await new Promise(r => setTimeout(r,MsgSendInterval*1000));
                };
            };
            count += 1;
            MsgLogs.value = MsgLogs.value + `第${count}轮弹幕发送完成\n`;
            MsgLogs.scrollTop = MsgLogs.scrollHeight;
        } else {let count = 0;;await new Promise(r => setTimeout(r,1000));};
    };
};