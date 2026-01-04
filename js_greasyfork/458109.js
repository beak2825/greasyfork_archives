// ==UserScript==
// @name         Charlie's Gua - demo version
// @version      0.9999
// @description  try to take over the wtfgame!
// @author       Charlie
// @match        https://game.elfive.cn:91/wtfgame/
// @match        http://game.liulin5.xyz/wtfgame/
// @grant        GM_addStyle
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/890174
// @downloadURL https://update.greasyfork.org/scripts/458109/Charlie%27s%20Gua%20-%20demo%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/458109/Charlie%27s%20Gua%20-%20demo%20version.meta.js
// ==/UserScript==

window.addEventListener('load', () => ((w) => {
    GM_addStyle(`
    .btn-group {
        position: fixed;
        left: 1em;
        bottom: 0;
        width: calc(100vw - 2em);
    }
    .btn-group > div {
        margin: 0.6em 0;
        display: flex;
        height: 2.25em;
    }
    .btn-group button,
    .btn-group input {
        margin-right: 0.6em;
        border-radius: 4px;
        font-size: 1rem;
        font-family: "Noto Sans CJK SC", "Source Han Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft Yahei", "WenQuanYi Micro Hei", sans-serif;
        color: rgba(0, 0, 0, 0.87);
        outline: none;
        text-decoration: none;
        flex: 0 0 auto;
        user-select: none;
        padding: 0.928571em 0.942857em;
        text-transform: none;
        transition: background .1s ease, box-shadow .1s ease, color .1s ease, -webkit-box-shadow .1s ease;
        display: flex;
        align-items: center;
        font-weight: 400;
        text-align: center;
        cursor: pointer;
        background-color: white;
        border-top: none;
        padding-top: 0.92857143em;
        border: 1px solid rgba(34, 36, 38, 0.8);
        box-shadow: 1px 2px 2px rgba(34, 36, 38, 0.12);
        line-height: 0.3;
    }
    .btn-group button:hover {
        background-color: #f2f2f2;
    }
    .btn-group button:active {
        background-color: rgb(70, 70, 70);
        color: rgba(255, 255, 255, 0.95);
        box-shadow: 1px 2px 2px rgba(34, 36, 38, 0.04);
    }
    .btn-group input {
        cursor: text;
        flex: 1;
        text-align: left;
    }
    `)
    w.document.body.innerHTML += `<button id="nullbtn" style="position:absolute;left:0;top:0;opacity:0"></button><div class="btn-group"><div>${[['记录详细日志', 'detailed'], ['抽搐(防afk踢出)', 'dance']].map(([desc, varName]) => (w[varName] = false, `<button onclick="this.innerText='${desc} '+(${varName}?'❌':'✅'),${varName}^=1">${desc} ❌</button>`)).join('')}<button onclick="qc.wtf.Player.me.kill()">回出生点</button><input id="msg" spellcheck="false"><button onclick="msg(document.getElementById('msg').value)">发送</button></div><div><button onclick="room('py')">PY</button>${Array(16).fill().map((_, i) => `<button onclick="room(${i + 1})">${i<9?'0':''}${i + 1}</button>`).join('')}</div></div>`
    console.log("%c %c %c Charlie 的增强脚本 | demo version %c %c %c", "margin: 8px 0; font-size: 2em; background: #9854d8", "font-size: 2em; background: #6c2ca7", "font-size: 2em; color: #ffffff; background: #450f78;", "font-size: 2em; background: #6c2ca7", "font-size: 2em; background: #9854d8", "font-size: 2em; background: #ffffff, color: #ff2424; background: #fff")
    console.log("把 console 上方的过滤设置为【仅限信息】获得最佳体验\n注意“详细日志”使用了 console.debug ，需要显示调试才能看到")
    w.document.getElementById('msg').onkeydown = (evt) => { if(evt.code == "Enter") evt.stopPropagation(), w.msg(evt.target.value), evt.target.value = '' }
    const Base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode: function(e) {
            var t = "", n, r, i, s, o, a, f, l = 0;
            e = Base64._utf8_encode(e);
            while (l < e.length)
                n = e.charCodeAt(l++),
                    r = e.charCodeAt(l++),
                    i = e.charCodeAt(l++),
                    s = n >> 2,
                    o = (n & 3) << 4 | r >> 4,
                    a = (r & 15) << 2 | i >> 6,
                    f = i & 63,
                    isNaN(r) ? a = f = 64 : isNaN(i) && (f = 64),
                    t = t + Base64._keyStr.charAt(s) + Base64._keyStr.charAt(o) + Base64._keyStr.charAt(a) + Base64._keyStr.charAt(f);
            return t
        },
        decode: function(e) {
            var t = "", n, r, i, s, o, a, f, l = 0;
            e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (l < e.length)
                s = Base64._keyStr.indexOf(e.charAt(l++)),
                    o = Base64._keyStr.indexOf(e.charAt(l++)),
                    a = Base64._keyStr.indexOf(e.charAt(l++)),
                    f = Base64._keyStr.indexOf(e.charAt(l++)),
                    n = s << 2 | o >> 4,
                    r = (o & 15) << 4 | a >> 2,
                    i = (a & 3) << 6 | f,
                    t += String.fromCharCode(n),
                    a != 64 && (t += String.fromCharCode(r)),
                    f != 64 && (t += String.fromCharCode(i));
            return t = Base64._utf8_decode(t),
                t
        },
        _utf8_encode: function(e) {
            e = e.replace(/\r\n/g, "\n");
            var t = "";
            for (var n = 0; n < e.length; n++) {
                var r = e.charCodeAt(n);
                r < 128 ? t += String.fromCharCode(r) : r > 127 && r < 2048 ? (t += String.fromCharCode(r >> 6 | 192),
                                                                               t += String.fromCharCode(r & 63 | 128)) : (t += String.fromCharCode(r >> 12 | 224),
                                                                                                                          t += String.fromCharCode(r >> 6 & 63 | 128),
                                                                                                                          t += String.fromCharCode(r & 63 | 128))
            }
            return t
        },
        _utf8_decode: function(e) {
            var t = ""
            , n = 0
            , r = 0
            ,c1 = 0
            ,c2 = 0;
            while (n < e.length)
                r = e.charCodeAt(n),
                    r < 128 ? (t += String.fromCharCode(r),
                               n++) : r > 191 && r < 224 ? (c2 = e.charCodeAt(n + 1),
                                                            t += String.fromCharCode((r & 31) << 6 | c2 & 63),
                                                            n += 2) : (c2 = e.charCodeAt(n + 1),
                                                                       t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | e.charCodeAt(n + 2) & 63),
                                                                       n += 3);
            return t
        }
    };

    'use strict'
    let ws, names = {}
    w.WebSocket = class WebSocket extends w.WebSocket {
        constructor(...args) {
            super(...args)
            this.addEventListener('message', ({ data }) => {
                w.cb(data)
                this._onmessage({ data })
            })
            ws = this
        }
        set onmessage(fn) { this._onmessage = fn }
    }
    w.cb = (rawData) => {
        const { k: key, v: data } = JSON.parse(Base64.decode(rawData))
        if(w.detailed && key !== '$move') console.debug(key, JSON.stringify(data))
        switch(key) {
            case '$playerdata':
                console.table(data.map(({ score, scored, name, uuid }) => ({ name, uuid, scored, score })))
                data.forEach(e => names[e.uuid] = e.name)
                break

            case '$msg':
                if(data.uuid == qc.wtf?.Player?.me?.uuid) data.name = "[我自己]"
                console.log(`%c${data.uuid}%c${data.name}%c ${data.msg.trim()}`, 'padding: .04em .36em; border: 1.5px solid #1e8eff', 'background: #1e8eff; padding: .04em .36em; border: 1.5px solid #1e8eff', '')
                break

            case '$newplayer':
                console.log(`%c${data.uuid}%c${data.name}%c 加入了房间`, 'padding: .04em .36em; border: 1.5px solid #0dbc79', 'background: #0dbc79; padding: .04em .36em; border: 1.5px solid #0dbc79', '')
                names[data.uuid] = data.name
                break

            case '$leave':
                console.log(`%c${data.uuid}%c${names[data.uuid]}%c 离开了房间`, 'padding: .04em .36em; border: 1.5px solid #e13a22', 'background: #e13a22; padding: .04em .36em; border: 1.5px solid #e13a22', '')
                delete names[data.uuid]
                break
        }
    }
    w.msg = (msg) => { ws.send(Base64.encode(JSON.stringify({ k: 'msg', v: { msg } }))) }
    w.room = (id) => w.msg("/room " + id)
    setInterval(() => { if(w.dance) [() => w.qc.wtf.Player.me.move(0), () => w.qc.wtf.Player.me.move(1), () => w.qc.wtf.Player.me.dock()][~~(Math.random() * 3)]() }, 80)
    document.querySelectorAll('.btn-group button').forEach(e=>e.addEventListener('click',()=>document.getElementById('nullbtn').focus()))
    setInterval(() => {
        try {
            w.qc.engine.HelpPanelManager.instance.showHelp = () => console.log("成功阻止弹窗！")
        } catch {}
        try {
            w.qc.wtf.LoginManager.instance.inpUsername.characterLimit = 0
        } catch {}
    }, 1000)
})(unsafeWindow))