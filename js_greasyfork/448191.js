// ==UserScript==
// @name         Bilibili直播弹幕防吞
// @namespace    https://github.com/MicroCBer/BilibiliLiveDanmakuSender
// @version      0.1.6
// @description  检测并显示B站被B站吞的直播弹幕
// @author       MicroBlock
// @match        https://live.bilibili.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/448191/Bilibili%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E9%98%B2%E5%90%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/448191/Bilibili%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E9%98%B2%E5%90%9E.meta.js
// ==/UserScript==

const FAIL_SEND_TIMEOUT=1000; // ms
const ENABLE_REST_API_CHECK=true; // 是否开启双重发送失败检测




(function() {
    'use strict';
    let packageType={
        WS_OP_HEARTBEAT: 2,
        WS_OP_HEARTBEAT_REPLY: 3,
        WS_OP_MESSAGE: 5,
        WS_OP_USER_AUTHENTICATION: 7,
        WS_OP_CONNECT_SUCCESS: 8,
        WS_PACKAGE_HEADER_TOTAL_LENGTH: 16,
        WS_PACKAGE_OFFSET: 0,
        WS_HEADER_OFFSET: 4,
        WS_VERSION_OFFSET: 6,
        WS_OPERATION_OFFSET: 8,
        WS_SEQUENCE_OFFSET: 12,
        WS_BODY_PROTOCOL_VERSION_NORMAL: 0,
        WS_BODY_PROTOCOL_VERSION_BROTLI: 3,
        WS_HEADER_DEFAULT_VERSION: 1,
        WS_HEADER_DEFAULT_OPERATION: 1,
        WS_HEADER_DEFAULT_SEQUENCE: 1,
        WS_AUTH_OK: 0,
        WS_AUTH_TOKEN_ERROR: -101
    }
    let headerList=[{
        name: "Header Length",
        key: "headerLen",
        bytes: 2,
        offset: packageType.WS_HEADER_OFFSET,
        value: packageType.WS_PACKAGE_HEADER_TOTAL_LENGTH
    }, {
        name: "Protocol Version",
        key: "ver",
        bytes: 2,
        offset: packageType.WS_VERSION_OFFSET,
        value: packageType.WS_HEADER_DEFAULT_VERSION
    }, {
        name: "Operation",
        key: "op",
        bytes: 4,
        offset: packageType.WS_OPERATION_OFFSET,
        value: packageType.WS_HEADER_DEFAULT_OPERATION
    }, {
        name: "Sequence Id",
        key: "seq",
        bytes: 4,
        offset: packageType.WS_SEQUENCE_OFFSET,
        value: packageType.WS_HEADER_DEFAULT_SEQUENCE
    }]


    let decode=function(t) {
        return decodeURIComponent(window.escape(String.fromCharCode.apply(String, new Uint8Array(t))))
    }
    let convertToObject = function(t) {
        var e = new DataView(t)
        , n = {
            body: []
        };
        if (n.packetLen = e.getInt32(packageType.WS_PACKAGE_OFFSET),
            headerList.forEach(function(t) {
            4 === t.bytes ? n[t.key] = e.getInt32(t.offset) : 2 === t.bytes && (n[t.key] = e.getInt16(t.offset))
        }),
            n.packetLen < t.byteLength && convertToObject(t.slice(0, n.packetLen)),
            (window.TextDecoder ? new window.TextDecoder : {
            decode: function(t) {
                return decodeURIComponent(window.escape(String.fromCharCode.apply(String, new Uint8Array(t))))
            }
        }),
            !n.op || packageType.WS_OP_MESSAGE !== n.op && n.op !== packageType.WS_OP_CONNECT_SUCCESS)
            n.op && packageType.WS_OP_HEARTBEAT_REPLY === n.op && (n.body = {
                count: e.getInt32(packageType.WS_PACKAGE_HEADER_TOTAL_LENGTH)
            });
        else
            for (var i = packageType.WS_PACKAGE_OFFSET, s = n.packetLen, a = "", u = ""; i < t.byteLength; i += s) {
                s = e.getInt32(i),
                    a = e.getInt16(i + packageType.WS_HEADER_OFFSET);
                try {
                    if (n.ver === packageType.WS_BODY_PROTOCOL_VERSION_NORMAL) {
                        var c = decode(t.slice(i + a, i + s));
                        u = 0 !== c.length ? JSON.parse(c) : null
                    } else if (n.ver === packageType.WS_BODY_PROTOCOL_VERSION_BROTLI) {
                        var l = t.slice(i + a, i + s)
                        , h = window.BrotliDecode(new Uint8Array(l));
                        u = convertToObject(h.buffer).body
                    }
                    u && n.body.push(u)
                } catch (e) {
                    console.err("decode body error:", new Uint8Array(t), n, e)
                }
            }
        return n
    }

    let accepted_texts=[],enabled=false
    let danmaku_local_save=[]

    let _WebSocket=WebSocket
    class FakeWs{
        constructor(...args){
            let ws = new _WebSocket(...args)

            if(args[0].includes("chat")){
                ws.addEventListener("open",()=>{
                    if(!enabled){
                        waitfor(".chat-item .danmaku-item-right.v-middle.pointer").then(()=>{
                            danmaku_local_save=get_danmu(true);
                            enabled=true
                        })
                    }
                })
                ws.addEventListener("message",(msg)=>{
                    if(!enabled){
                        danmaku_local_save=get_danmu(true);
                        enabled=true
                    }

                    let data=(convertToObject(msg.data))
                    if(data.op===5){
                        for(let message of data.body){
                            if(message[0]&&message[0].cmd==="DANMU_MSG"){
                                accepted_texts.push(message[0].info[1])
                            }
                        }
                    }
                })
                ws.addEventListener("error",()=>{
                    enabled=false
                })
                ws.addEventListener("close",()=>{
                    enabled=false
                })
            }

            return ws
        }
    }
    WebSocket=FakeWs

    let dicts=[],sensitiveChars={'.':'*'};
    async function addDict(url){
        let resp=await(await fetch(url)).text()
        dicts.push(...resp.replace(/\r/g,"").split("\n"));
    }
    addDict("https://cdn.jsdelivr.net/gh/MicroCBer/BilibiliLiveDanmakuSender/dict.txt")


    function waitfor(selector){
        return new Promise((rs)=>{
            let handle=setInterval(()=>{
                if(document.querySelector(selector)){
                    rs();
                    clearInterval(handle);
                }
            },100)
            })
    }

    function get_danmu(received=false){
        return [...document.querySelectorAll(".chat-item .danmaku-item-right.v-middle.pointer")].map(
            v=>({
                text:v.innerText,
                dom:v,
                uid:v.parentElement.getAttribute("data-uid"),
                received,
                time:new Date().getTime()
            })).filter(v=>v.uid===document.querySelector(".user-panel-ctnr").children[0].getAttribute("href").split("/").pop())
    }

    function send_message(msg){
        var inpEle = document.querySelector(".chat-input")
        var t = inpEle
        let evt = document.createEvent('HTMLEvents');
        evt.initEvent('input', true, true);
        t.value=msg;
        t.dispatchEvent(evt)
        var event = document.createEvent('Event')
        event.initEvent('keydown', true, false)
        event = Object.assign(event, {
            ctrlKey: false,
            metaKey: false,
            altKey: false,
            which: 13,
            keyCode: 13,
            key: 'Enter',
            code: 'Enter'
        })
        inpEle.focus()
        inpEle.dispatchEvent(event)
    }


    waitfor(".chat-item .danmaku-item-right.v-middle.pointer").then(()=>{
        async function update_danmu(){

            let last=danmaku_local_save[danmaku_local_save.length-1]
            let now=get_danmu()
            let pos=now.findLastIndex(v=>v.text===last.text);
            let updated=now.slice(pos+1)
            for(let msg of updated){
                msg.dom.style.color="#0169ff";
            }

            // Receive messages
            for(let msg of danmaku_local_save){
                let index=accepted_texts.indexOf(msg.text)
                if(index!=-1&&!msg.received){
                    accepted_texts.splice(index,1)
                    msg.received=true
                    msg.dom.style.color=""
                    msg.dom.style.background="";
                    function removeBtn(){
                        if(msg.dom.parentElement.lastChild.tagName==="BUTTON")
                            msg.dom.parentElement.lastChild.remove();
                    }
                    removeBtn()
                    removeBtn()
                }
            }

            function auto_avoid_kw(_text,max_length=20){
                let text=_text
                const SEPARATOR="/"
                if(text.length<=max_length/2)return text.split('').join(SEPARATOR)

                for(let word of dicts){
                    if(text.includes(word))text=text.replace(word,word.split('').join(SEPARATOR))
                    if(text.length==max_length)return text
                }

                for(let char in sensitiveChars){
                    while(text.includes(char))text=text.replace(char,sensitiveChars[char]);
                }

                if(text.length>max_length)return null
                return text
            }


            for(let msg of danmaku_local_save){
                if(!msg.received&&msg.time<(new Date().getTime()-FAIL_SEND_TIMEOUT)&&!msg.failed){
                    msg.failed=true

                    if(ENABLE_REST_API_CHECK){
                        msg.dom.style.background="#feb13a";
                        msg.dom.style.color="white"
                        let roomId=__NEPTUNE_IS_MY_WAIFU__?.roomInitRes?.data?.room_id || __SSR_INITIAL_STATE__.baseInfoRoom.room_info.room_id
                        let data=await(await fetch("https://api.live.bilibili.com/xlive/web-room/v1/dM/gethistory?roomid="+roomId)).json()
                        if(data.data.room.findIndex(v=>v.text===msg.text)!==-1){
                            msg.received=true
                            msg.dom.style.color="";
                            msg.dom.style.background="";
                            continue;
                        }
                    }
                    msg.dom.style.background="#b22727";
                    msg.dom.style.color="white"
                    function buildBtn(text,onclick){
                        let btn=document.createElement("button")
                        btn.innerText=text
                        btn.onclick=onclick
                        return btn
                    }

                    msg.dom.parentElement.appendChild(buildBtn("手动修改",()=>{
                        let resp=prompt("请输入修改后的弹幕",msg.text)
                        if(resp)send_message(resp)
                    }))

                    if(auto_avoid_kw(msg.text))
                        msg.dom.parentElement.appendChild(buildBtn("尝试自动修改",()=>{
                            send_message(auto_avoid_kw(msg.text))
                        }))

                }
            }

            danmaku_local_save.push(...updated);
        }

        setInterval(()=>{
            if(!danmaku_local_save.length){
                danmaku_local_save=get_danmu(true);
            }
            if(enabled){
                update_danmu()
            }
        },100)
    })

})();
