// ==UserScript==
// @name         B站魔法球助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  无需看动画，快速开魔法球
// @author       逆回十六夜
// @license      MIT License
// @include      /https?:\/\/live\.bilibili\.com\/\d+\??.*/
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/407252/B%E7%AB%99%E9%AD%94%E6%B3%95%E7%90%83%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/407252/B%E7%AB%99%E9%AD%94%E6%B3%95%E7%90%83%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

let logSwitch = false;
if (!logSwitch) {
    console.log = () => {
    };
}

$(function () {
    run();
    addStyle();
});

function addStyle() {
    $('head').append(`
<style>
    .izayoi_input{
        outline: none;
        border: 1px solid #e9eaec;
        background-color: #fff;
        border-radius: 4px;
        padding: 1px 0 0;
        overflow: hidden;
        font-size: 12px;
        line-height: 19px;
        width: 30px;
    }
    .izayoi_btn{
        background-color: #23ade5;
        color: #fff;
        border-radius: 4px;
        border: none;
        padding: 5px;
        cursor: pointer;
        box-shadow: 0 0 2px #00000075;
    }
    .izayoi_fs{
        border: 2px solid #d4d4d4;
    }
    .izayoi_box{
        position: absolute;
        top: 130px;
        right: 35px;
        z-index: 999;
        padding: 5px;
        border-radius: 5px;
        background-color: lightblue;
        box-shadow: 0 0 5px #0fe0d6;
    }
    .izayoi_line{
        line-height: 30px;
    }
</style>
    `)
}

function run() {
    const getCookie = (name) => {
        let arr;
        const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
        if ((arr = document.cookie.match(reg))) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    };
    const MFQ = {
        visit_id: undefined,
        csrf_token: undefined,
        num: undefined,
        auto: false,
        timer: undefined,
        init: () => {
            MFQ.visit_id = window.__statisObserver ? window.__statisObserver.__visitId : '';
            MFQ.csrf_token = getCookie('bili_jct');
            MFQ.getNum().then(function (num) {
                MFQ.num = num;
                MFQ.creatBox();
            });
        },
        creatBox: () => {
            let box = $(`
<div class="izayoi_box">
    <div style="background-color: white; padding: 5px;border-radius: 5px;">
        <div class="izayoi_line">
            普通扭蛋剩余：<span>${MFQ.num}</span>
        </div>
        <div class="izayoi_line">
            抽取个数：
            <select>
                <option value="1">1个</option>
                <option value="10">10个</option>
                <option value="100">100个</option>
            </select>
        </div>
        <div class="izayoi_line">
            <button data-action="one" class="izayoi_btn">手动抽一次</button>
            <button data-action="auto" class="izayoi_btn">开始自动抽</button>
        </div>
    </div>
</div>`);
            let numSpan = box.find('span');
            let select = box.find('select');
            box.on('click', 'button', function () {
                let act = $(this).data('action');
                let btn = $(this);
                switch (act) {
                    case 'one':
                        op();
                        break;
                    case 'auto':
                        if (!MFQ.auto) {
                            btn.text('停止自动抽');
                            MFQ.timer = setInterval(op, 500)
                        } else {
                            btn.text('开始自动抽');
                            clearInterval(MFQ.timer);
                        }
                        MFQ.auto = !MFQ.auto;
                        break;
                }
            });
            let op = () => {
                MFQ.open(select.val()).then(function (data) {
                    let text = '';
                    if (Array.isArray(data.data.text)) {
                        for (let t of data.data.text) {
                            text += t;
                        }
                    }
                    numSpan.text(data.data.info.normal.coin);
                    MFQ.chatLog(text);
                });
            };

            $('.player-ctnr').append(box);
        },
        open: (count) => {
            let p = $.Deferred();
            $.ajax({
                url: 'https://api.live.bilibili.com/xlive/web-ucenter/v1/capsule/open_capsule',
                method: 'POST',
                data: {
                    count: count,
                    platform: 'h5',
                    type: 'normal',
                    csrf_token: MFQ.csrf_token,
                    csrf: MFQ.csrf_token,
                    visit_id: MFQ.visit_id,
                },
                success: function (result) {
                    if (result && result.code === 0) p.resolve(result);
                    p.resolve(0);
                },
                crossDomain: true,
                dataType: 'json',
                xhrFields: {
                    withCredentials: true,
                },
            });
            return p
        },
        getNum: () => {
            let p = $.Deferred();
            $.ajax({
                url: 'https://api.live.bilibili.com/xlive/web-ucenter/v1/capsule/get_detail?from=h5',
                method: 'GET',
                success: function (result) {
                    console.log(result.data.normal.coin);
                    if (result && result.code === 0) p.resolve(result.data.normal.coin);
                    p.resolve(0);
                },
                crossDomain: true,
                dataType: 'json',
                xhrFields: {
                    withCredentials: true,
                },
            });
            return p
        },
        chatLog: function (text, type = 'info') {//自定义提示
            let div = $("<div class='izayoiMsg'>");
            let msg = $("<div>");
            let ct = $('#chat-history-list');
            let myDate = new Date();
            msg.html(text);
            div.text(myDate.toLocaleString());
            div.append(msg);
            div.css({
                'text-align': 'center',
                'border-radius': '4px',
                'min-height': '30px',
                'width': '256px',
                'color': '#9585FF',
                'line-height': '30px',
                'padding': '0 10px',
                'margin': '10px auto',
            });
            msg.css({
                'word-wrap': 'break-word',
                'width': '100%',
                'line-height': '1em',
                'margin-bottom': '10px',
            });
            switch (type) {
                case 'warning':
                    div.css({
                        'border': '1px solid rgb(236, 221, 192)',
                        'color': 'rgb(218, 142, 36)',
                        'background': 'rgb(245, 235, 221) none repeat scroll 0% 0%',
                    });
                    break;
                case 'success':
                    div.css({
                        'border': '1px solid rgba(22, 140, 0, 0.28)',
                        'color': 'rgb(69, 171, 69)',
                        'background': 'none 0% 0% repeat scroll rgba(16, 255, 0, 0.18)',
                    });
                    break;
                case 'error':
                    div.css({
                        'border': '1px solid rgba(255, 0, 39, 0.28)',
                        'color': 'rgb(116,0,15)',
                        'background': 'none 0% 0% repeat scroll rgba(255, 0, 39, 0.18)',
                    });
                    break;
                default:
                    div.css({
                        'border': '1px solid rgb(203, 195, 255)',
                        'background': 'rgb(233, 230, 255) none repeat scroll 0% 0%',
                    });
            }
            ct.find('#chat-items').append(div);//向聊天框加入信息
            ct.scrollTop(ct.prop("scrollHeight"));//滚动到底部
        },
    };
    MFQ.init();
}