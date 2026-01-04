// ==UserScript==
// @name         弹幕修仙发弹幕
// @namespace    https://dmxx.org/1111
// @version      1.0
// @description  这是弹幕修仙发弹幕脚本
// @author       积木风车
// @match        *://live.bilibili.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require      https://code.jquery.com/jquery-3.6.0.js
// @downloadURL https://update.greasyfork.org/scripts/449122/%E5%BC%B9%E5%B9%95%E4%BF%AE%E4%BB%99%E5%8F%91%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/449122/%E5%BC%B9%E5%B9%95%E4%BF%AE%E4%BB%99%E5%8F%91%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

var $ = window.jQuery;
const scriptInitVal = {Msg:'',MsgSendInterval:1}
for(let initVal in scriptInitVal) {
    if(GM_getValue(initVal)===undefined) GM_setValue(initVal,scriptInitVal[initVal]);
}


(function() {
    var check = setInterval(() => {
        var input = document.getElementsByClassName('chat-input border-box')[0];
        if (input !== undefined) {
            var div = document.getElementsByClassName('bottom-actions p-relative')[0];
            var btn = document.createElement('button');
            btn.innerHTML = '辅助面板';
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
            list.style.left = '1400px';
            list.style.top = '200px';
            list.style.height = '300px';
            list.style.width = '250px';
            list.innerHTML = `<div style="margin:10px; height:80px; width: 200px;">
<button class="zhaohuanleijieBtn" style="background:#757575; cursor:pointer; border-radius: 4px; padding: 3px 6px;">召唤雷劫</button>
<button class="qiangduoBtn" style="background:#757575; cursor:pointer; border-radius: 4px; padding: 3px 6px;">抢夺</button>
<button class="mosuoBtn" style="background:#757575; cursor:pointer; border-radius: 4px; padding: 3px 6px;">摸索</button>
<button class="xmsqBtn" style="background:#757575; cursor:pointer; border-radius: 4px; padding: 3px 6px;">心魔煞气</button>
<br>
<button class="upBtn" style="background:#757575; cursor:pointer; border-radius: 4px; padding: 3px 6px;">上</button>
<button class="downBtn" style="background:#757575; cursor:pointer; border-radius: 4px; padding: 3px 6px;">下</button>
<button class="leftBtn" style="background:#757575; cursor:pointer; border-radius: 4px; padding: 3px 6px;">左</button>
<button class="rightBtn" style="background:#757575; cursor:pointer; border-radius: 4px; padding: 3px 6px;">右</button>
<br>
<button class="xiulianBtn" style="background:#757575; cursor:pointer; border-radius: 4px; padding: 3px 6px;">修炼</button>
<button class="xiuyangBtn" style="background:#757575; cursor:pointer; border-radius: 4px; padding: 3px 6px;">休养</button>

<button class="tupoBtn" style="background:#757575; cursor:pointer; border-radius: 4px; padding: 3px 6px;">突破</button>

<br>
<div>日誌:</div>
<textarea class="MsgLogs" style="height: 100px; width: 220px; resize: none;" readonly></textarea>
</div>`;


            let i;
            document.body.appendChild(list);
            var zhaohuanleijieBtn = document.getElementsByClassName('zhaohuanleijieBtn')[0];
            var qiangduoBtn = document.getElementsByClassName('qiangduoBtn')[0];
            var mosuoBtn = document.getElementsByClassName('mosuoBtn')[0];
            var xmsqBtn = document.getElementsByClassName('xmsqBtn')[0];
            var upBtn = document.getElementsByClassName('upBtn')[0];
            var downBtn = document.getElementsByClassName('downBtn')[0];
            var leftBtn = document.getElementsByClassName('leftBtn')[0];
            var rightBtn = document.getElementsByClassName('rightBtn')[0];
            var xiulianBtn = document.getElementsByClassName('xiulianBtn')[0];
            var xiuyangBtn = document.getElementsByClassName('xiuyangBtn')[0];
            var tupoBtn = document.getElementsByClassName('tupoBtn')[0];
            zhaohuanleijieBtn.addEventListener('click',() => {
                sendMsg('召唤雷劫')
            });
             qiangduoBtn.addEventListener('click',() => {
                sendMsg('抢夺')
            });
              mosuoBtn.addEventListener('click',() => {
                sendMsg('摸索')
            });
             xmsqBtn.addEventListener('click',() => {
                sendMsg('心魔煞气')
            });
              upBtn.addEventListener('click',() => {
                sendMsg('上')
            });
              downBtn.addEventListener('click',() => {
                sendMsg('下')
            });
              leftBtn.addEventListener('click',() => {
                sendMsg('左')
            });
             rightBtn.addEventListener('click',() => {
                sendMsg('右')
            });
             xiulianBtn.addEventListener('click',() => {
                sendMsg('修炼')
            });
             xiuyangBtn.addEventListener('click',() => {
                sendMsg('休养')
            });
             tupoBtn.addEventListener('click',() => {
                sendMsg('突破')
            });

            btn.addEventListener('click',() => {
                if (list.style.display === 'none') {$(list).slideDown();}else{$(list).slideUp();};
            });
            clearInterval(check);
        };

    },100);
})();
async function sendMsg(Msg){
    let MsgLogs = document.getElementsByClassName('MsgLogs')[0];
    let shortUid = window.location.href.split('live.bilibili.com/')[1];
    let room = await fetch(`http://api.live.bilibili.com/room/v1/Room/room_init?id=${shortUid}`,{
        method: 'GET',
        credentials: 'include'
    })
    let roomid = await room.json();
    roomid = roomid['data']['room_id'];
    let scrf = document.cookie.split(';').map(c=>c.trim()).filter(c => c.startsWith('bili_jct='))[0].split('bili_jct=')[1];
    let send = await fetch('https://api.live.bilibili.com/msg/send',{
        method: 'POST',
        credentials: 'include',
        headers: {
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: `color=16777215&fontsize=25&mode=1&msg=${Msg}&rnd=16082868&roomid=${roomid}&csrf_token=${scrf}&csrf=${scrf}`
    });
    let sendApiRes = await send.json();
    if (sendApiRes['message'] !== "") {
        MsgLogs.value = MsgLogs.value + `发送弹幕：【${Msg}】失败，原因：${sendApiRes['message']}。\n`;
    }else{MsgLogs.value = MsgLogs.value + `发送弹幕：【${Msg}】成功\n`;};
    MsgLogs.scrollTop = MsgLogs.scrollHeight;

};