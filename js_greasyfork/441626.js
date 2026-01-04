// ==UserScript==
// @name         雨天的自动回复机器人
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  获取bilibili的直播弹幕内容并自动发送回复弹幕
// @author       雨天lul
// @include      /https?:\/\/live\.bilibili\.com\/?\??.*/
// @include      /https?:\/\/live\.bilibili\.com\/\d+\??.*/
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/gh/google/brotli@5692e422da6af1e991f9182345d58df87866bc5e/js/decode.js
// @require      https://cdn.jsdelivr.net/npm/pako@2.0.3/dist/pako_inflate.min.js

// @grant        none

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441626/%E9%9B%A8%E5%A4%A9%E7%9A%84%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E6%9C%BA%E5%99%A8%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/441626/%E9%9B%A8%E5%A4%A9%E7%9A%84%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E6%9C%BA%E5%99%A8%E4%BA%BA.meta.js
// ==/UserScript==

//填入自己的id，检测弹幕的时候过滤掉自己发送的弹幕
var selfId = '4955333';
var autoReply = false;

//cgd
(function () {
    console.log('autoreply st')
    const HEADER_SIZE = 16

    const WS_BODY_PROTOCOL_VERSION_NORMAL = 0
    const WS_BODY_PROTOCOL_VERSION_HEARTBEAT = 1
    const WS_BODY_PROTOCOL_VERSION_DEFLATE = 2
    const WS_BODY_PROTOCOL_VERSION_BROTLI = 3

    const OP_HEARTBEAT_REPLY = 3
    const OP_SEND_MSG_REPLY = 5

    let textEncoder = new TextEncoder()
    let textDecoder = new TextDecoder()

    function main() {
        if (window.bliveproxy) {
            // 防止多次加载
            return
        }
        initApi()
        hook()
    }

    function initApi() {
        window.bliveproxy = api
    }

    let api = {
        addCommandHandler(cmd, handler) {
            let handlers = this._commandHandlers[cmd]
            if (!handlers) {
                handlers = this._commandHandlers[cmd] = []
            }
            handlers.push(handler)
        },
        removeCommandHandler(cmd, handler) {
            let handlers = this._commandHandlers[cmd]
            if (!handlers) {
                return
            }
            this._commandHandlers[cmd] = handlers.filter(item => item !== handler)
        },

        // 私有API
        _commandHandlers: {},
        _getCommandHandlers(cmd) {
            // if (this._commandHandlers[cmd] != null) {
            //     console.log('HAND EXT ' + cmd);
            // } else {
            //     console.log('HAND NE! ' + cmd);
            // }
            return this._commandHandlers[cmd] || null
        }
    }

    function hook() {
        window.WebSocket = new Proxy(window.WebSocket, {
            construct(target, args) {
                let obj = new target(...args)
                return new Proxy(obj, proxyHandler)
            }
        })
    }

    let proxyHandler = {
        get(target, property) {
            let value = target[property]
            if ((typeof value) === 'function') {
                value = value.bind(target)
            }
            return value
        },
        set(target, property, value) {
            if (property === 'onmessage') {
                let realOnMessage = value
                value = function (event) {
                    myOnMessage(event, realOnMessage)
                }
            }
            target[property] = value
            return value
        }
    }

    function myOnMessage(event, realOnMessage) {
        if (!(event.data instanceof ArrayBuffer)) {
            realOnMessage(event)
            return
        }

        let data = new Uint8Array(event.data)
        function callRealOnMessageByPacket(packet) {
            realOnMessage({ ...event, data: packet })
        }
        try {
            handleMessage(data, callRealOnMessageByPacket)
        } catch (e) {

            console.log('handlemessage Error: ' + e.message)
            // console.log(data)
        }
    }

    function makePacketFromCommand(command) {
        let body = textEncoder.encode(JSON.stringify(command))
        return makePacketFromUint8Array(body, OP_SEND_MSG_REPLY)
    }

    function makePacketFromUint8Array(body, operation) {
        let packLen = HEADER_SIZE + body.byteLength
        let packet = new ArrayBuffer(packLen)

        // 不需要压缩
        let ver = operation === OP_HEARTBEAT_REPLY ? WS_BODY_PROTOCOL_VERSION_HEARTBEAT : WS_BODY_PROTOCOL_VERSION_NORMAL
        let packetView = new DataView(packet)
        packetView.setUint32(0, packLen)        // pack_len
        packetView.setUint16(4, HEADER_SIZE)    // raw_header_size
        packetView.setUint16(6, ver)            // ver
        packetView.setUint32(8, operation)      // operation
        packetView.setUint32(12, 1)             // seq_id

        let packetBody = new Uint8Array(packet, HEADER_SIZE, body.byteLength)
        for (let i = 0; i < body.byteLength; i++) {
            packetBody[i] = body[i]
        }
        return packet
    }

    function handleMessage(data, callRealOnMessageByPacket) {
        let offset = 0
        while (offset < data.byteLength) {
            let dataView = new DataView(data.buffer, offset)
            let packLen = dataView.getUint32(0)
            // let rawHeaderSize = dataView.getUint16(4)
            let ver = dataView.getUint16(6)
            let operation = dataView.getUint32(8)
            // let seqId = dataView.getUint32(12)

            let body = new Uint8Array(data.buffer, offset + HEADER_SIZE, packLen - HEADER_SIZE)
            if (operation === OP_SEND_MSG_REPLY) {
                switch (ver) {
                    case WS_BODY_PROTOCOL_VERSION_NORMAL:
                        body = textDecoder.decode(body)
                        body = JSON.parse(body)
                        handleCommand(body, callRealOnMessageByPacket)
                        break
                    case WS_BODY_PROTOCOL_VERSION_DEFLATE:
                        body = pako.inflate(body)
                        handleMessage(body, callRealOnMessageByPacket)
                        break
                    case WS_BODY_PROTOCOL_VERSION_BROTLI:
                        body = BrotliDecode(body)
                        handleMessage(body, callRealOnMessageByPacket)
                        break
                    default: {
                        let packet = makePacketFromUint8Array(body, operation)
                        callRealOnMessageByPacket(packet)
                        break
                    }
                }
            } else {
                let packet = makePacketFromUint8Array(body, operation)
                callRealOnMessageByPacket(packet)
            }

            offset += packLen
        }
    }

    function handleCommand(command, callRealOnMessageByPacket) {
        if (command instanceof Array) {
            for (let oneCommand of command) {
                this.handleCommand(oneCommand)
            }
            return
        }

        let cmd = command.cmd || ''
        let pos = cmd.indexOf(':')
        if (pos != -1) {
            cmd = cmd.substr(0, pos)
        }
        // console.log('!! ' + cmd);
        let handlers = api._getCommandHandlers(cmd)
        if (handlers) {
            for (let handler of handlers) {
                handler(command)
            }
        }
        // console.log(command)

        let packet = makePacketFromCommand(command)
        callRealOnMessageByPacket(packet)
    }

    main()

    setTimeout(() => {

        //添加面板
        var div = document.getElementById('control-panel-ctnr-box');
        var btn = document.createElement('button');
        btn.innerHTML = '自动回复：' + (autoReply ? '开' : '关');
        btn.style.background = '#23ade5';
        btn.style.color = 'white';
        btn.style.cursor = 'pointer';;
        btn.style.padding = '6px 12px';
        btn.style.border = '0';
        btn.style.borderRadius = '4px';
        btn.id = 'autoReplyBtn';
        div.appendChild(btn);
        btn.addEventListener('click', () => {
            autoReply = !autoReply;
            btn.innerHTML = '自动回复：' + (autoReply ? '开' : '关');
        });
    }, 1000);



})();


async function sendDM(sendMsg) {
    let shortUid = window.location.href.split('live.bilibili.com/')[1];
    let room = await fetch(`http://api.live.bilibili.com/room/v1/Room/room_init?id=${shortUid}`, {
        method: 'GET',
        credentials: 'include'
    })
    let roomid = await room.json();
    roomid = roomid['data']['room_id'];
    let scrf = document.cookie.split(';').map(c => c.trim()).filter(c => c.startsWith('bili_jct='))[0].split('bili_jct=')[1];

    let send = await fetch('https://api.live.bilibili.com/msg/send', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: `color=16777215&fontsize=25&mode=1&msg=${sendMsg}&rnd=16082868&roomid=${roomid}&csrf_token=${scrf}&csrf=${scrf}`
    });
    let sendApiRes = await send.json();
    if (sendApiRes['message'] !== "") {
        console.log(`发送弹幕：【${sendMsg}】失败，原因：${sendApiRes['message']}。\n`);
    } else {
        console.log(`发送弹幕：【${sendMsg}】成功\n`);
    };

}
(async function () {
    bliveproxy.addCommandHandler('DANMU_MSG', command => {
        console.log('get ' + command.info[1]);
        if (autoReply) {
            let info = command.info
            console.log('info--DANMU_MSG')
            console.log('user: ' + command.info[2][1] + ' : ' + command.info[2][0]);
            console.log('cont: ' + command.info[1]);

            var _dm = command.info[1];
            var _userid = command.info[2][0];
            var _username = command.info[2][1];
            if (_userid == selfId.toString()) {
                console.log('idok');
                if (_dm.match(/确实/)) {
                    sendDM(_username + ', 确实');
                }
                // } else if (_username.match(/^[a-zA-Z\_]*$/)) {//纯英文id
                // console.log('纯英文id: ' + _userid);
                else if (_dm.match(/晚安/)) {
                    sendDM(_username + '晚安');
                }
            }
        }
    }


        // if (command.info[1].toString().substr(0, 5) != 'reply')
        //     sendDM('reply-- ' + command.info[2][1])
    );

    bliveproxy.addCommandHandler('ROOM_REAL_TIME_MESSAGE_UPDATE', command => {
        if (autoReply) {
            let info = command
            console.log('info--ROOM_REAL_TIME_MESSAGE_UPDATE  ' + Object.keys(info.data))
            console.log(Object.values(info.data));
            console.log('');
        }
    });
    // bliveproxy.addCommandHandler('NOTICE_MSG', command => {
    //     let info = command
    //     console.log('info--NOTICE_MSG  ' + Object.keys(info.data))
    //     console.log(Object.values(info.data));
    //     console.log('');
    // });
    // bliveproxy.addCommandHandler('INTERACT_WORD', command => {
    //     let info = command
    //     console.log('info--INTERACT_WORD  ' + Object.keys(info.data))
    //     console.log(Object.values(info.data));
    //     console.log('');
    // });
    // bliveproxy.addCommandHandler('STOP_LIVE_ROOM_LIST', command => {
    //     let info = command
    //     console.log('info--STOP_LIVE_ROOM_LIST  ' + Object.keys(info.data))
    //     console.log(Object.values(info.data));
    //     console.log('');
    // });
    // bliveproxy.addCommandHandler('NOTICE_MSG', command => {
    //     let info = command
    //     console.log('info--NOTICE_MSG  ' + Object.keys(info.data))
    //     console.log(Object.values(info.data));
    //     console.log('');
    // });
})();