// ==UserScript==
// @name         外挂弹幕系统
// @namespace    https://tool.zcmzcm.org/webBarrage/
// @version      0.1
// @description  在页面中实现类似直播的弹幕系统
// @author       张城铭
// @include        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368785/%E5%A4%96%E6%8C%82%E5%BC%B9%E5%B9%95%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/368785/%E5%A4%96%E6%8C%82%E5%BC%B9%E5%B9%95%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

((dom) => {
    if(lock)return;
    let webBarrage = {
        style: 'https://cdn.zcmzcm.org/css/webBarrage/style.css',
        danmu: 'https://cdn.zcmzcm.org/js/webBarrage/jquery.barrager.min.js',
        jquery: 'https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js',
        server: 'wss://tool.zcmzcm.org/webBarrage',
        session_id: 'https://tool.zcmzcm.org/user/session_id',
        init: function() {
            let jq
            ,c = (e) => {return dom.createElement(e)}
            ,a = (e) => {return dom.body.appendChild(e)}
            ,danmujs = c('script')
            ,send = c('div')
            ,style = c('link')
            ,load = async () => {
                // org暂时无法备案,无法申请QQ登录
                this.session_id = await this.getSessionId();
                danmujs.src = this.danmu,a(danmujs);
                danmujs.onload = () => {
                    this.connect();
                }
            }

            style.rel = 'stylesheet';
            style.href = this.style,a(style);
            danmujs.charset = 'utf-8';
            jq = danmujs.cloneNode();
            jq.src = this.jquery;
            jq.onload = load;

            window.jQuery && load() || a(jq)

            send.id = 'barrageSend';a(send);
            send.innerHTML = `<div id="wb_speak"><input/><span>回车发送</span></div>`;
        },
        connect: function() {
            let ws = new WebSocket(this.server, [this.session_id.data]);
            ws.onopen = (evt) => {
                console.log('连接到服务器');
                $('#wb_speak>input').focus();
            };
            ws.onclose = (evt) => {
                console.log('服务器断开连接');
            };
            ws.onmessage = (evt) => {
                let data = JSON.parse(evt.data),
                item = {
                   //img: data.avatar, //图片
                   info: data.text,        //文字
                   //href:'http://www.yaseng.org', //链接
                   //close:true, //显示关闭按钮
                   //speed:8, //延迟,单位秒,默认8
                   //bottom:70, //距离底部高度,单位px,默认随机
                   //color:'#fff', //颜色,默认白色
                   //old_ie_color:'#000000', //ie低版兼容色,不能与网页背景相同,默认黑色
                }
                $('body').barrager(item);
            };
            ws.onerror  = (evt, e) => {
                console.log('Error occured: ' + evt.data);
            };
            $('#wb_speak>input').bind('keydown', function(e){
                if (e.keyCode == 13){
                    if (! $(this).val()) return false;
                    ws.send($(this).val());
                    $(this).val('');
                }
            });
        },
        getSessionId: async function() {
            return (await fetch(this.session_id, {method: "GET",credentials:"include", mode: "cors", headers: {"Content-Type": "application/x-www-form-urlencoded"},})).json();
        },
    }
    webBarrage.init();
})(document);
var lock = true;