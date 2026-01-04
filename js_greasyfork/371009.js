// ==UserScript==
// @name         花心拯救者
// @namespace    Cutemon
// @version      1.60
// @description  白嫖没有错，花心也没有猜错，错的是这个破站直播！
// @author       Cutemon
// @include      /https?:\/\/live\.bilibili\.com\/\d+\??.*/
// @require      https://static.hdslb.com/live-static/libs/jquery/jquery-1.11.3.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/371009/%E8%8A%B1%E5%BF%83%E6%8B%AF%E6%95%91%E8%80%85.user.js
// @updateURL https://update.greasyfork.org/scripts/371009/%E8%8A%B1%E5%BF%83%E6%8B%AF%E6%95%91%E8%80%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let room_id = window.location.pathname.slice(1),
        medal_id = '';
    let xx, yy;
    let left, top;

    // 获取用户cookie
    let getCookie = Name => {
        let search = Name + '='; //查询检索的值
        let returnvalue = ''; //返回值
        if (document.cookie.length > 0) {
            let sd = document.cookie.indexOf(search);
            if (sd != -1) {
                sd += search.length;
                let end = document.cookie.indexOf(';', sd);
                if (end == -1) end = document.cookie.length;
                //unescape() 函数可对通过 escape() 编码的字符串进行解码。
                returnvalue = unescape(document.cookie.substring(sd, end));
            }
        }
        return returnvalue;
    };

    function bindInput() {
        let bindTimer = setInterval(() => {
            console.log(`弹幕输入框事件绑定中……`);

            if ($('.chat-input').length) {
                // 一般情况下获取dom
                $('.chat-input').focus(checkMedal);
                left = $('#control-panel-ctnr-box').offset().left + 8 + 'px';
                top = $('#control-panel-ctnr-box').offset().top - 50 + 'px';
                console.log(`勋章自动切换功能已启动`);
                toast('勋章自动切换功能已启动', 'success');
                clearInterval(bindTimer);
            } else {
                // iframe情况下获取dom
                try {
                    let ifr = document
                        .getElementById('player-ctnr')
                        .getElementsByTagName('iframe');
                    if (ifr.length) {
                        $('head').append(`<style type="text/css">/*
                    *  Link Toast Style By LancerComet at 17:31, 2015.12.16.
                    *  # Carry Your World #
                    *  ---
                    *  直播站 Toast 组件样式文件.
                    */
                   .link-toast {
                     position: absolute;
                     padding: 12px 24px;
                     font-size: 14px;
                     border-radius: 8px;
                     white-space: nowrap;
                     color: #fff;
                     -webkit-animation: link-msg-move-in-top cubic-bezier(0.22, 0.58, 0.12, 0.98) 0.4s;
                             animation: link-msg-move-in-top cubic-bezier(0.22, 0.58, 0.12, 0.98) 0.4s;
                     z-index: 10000;
                   }
                   .link-toast.fixed {
                     position: fixed;
                   }
                   .link-toast.success {
                     background-color: #47d279;
                     -webkit-box-shadow: 0 0.2em 0.1em 0.1em rgba(71,210,121,0.2);
                             box-shadow: 0 0.2em 0.1em 0.1em rgba(71,210,121,0.2);
                   }
                   .link-toast.caution {
                     background-color: #ffb243;
                     -webkit-box-shadow: 0 0.2em 0.1em 0.1em rgba(255,190,68,0.2);
                             box-shadow: 0 0.2em 0.1em 0.1em rgba(255,190,68,0.2);
                   }
                   .link-toast.error {
                     background-color: #ff6464;
                     -webkit-box-shadow: 0 0.2em 1em 0.1em rgba(255,100,100,0.2);
                             box-shadow: 0 0.2em 1em 0.1em rgba(255,100,100,0.2);
                   }
                   .link-toast.info {
                     background-color: #48bbf8;
                     -webkit-box-shadow: 0 0.2em 0.1em 0.1em rgba(72,187,248,0.2);
                             box-shadow: 0 0.2em 0.1em 0.1em rgba(72,187,248,0.2);
                   }
                   .link-toast.out {
                     -webkit-animation: link-msg-fade-out cubic-bezier(0.22, 0.58, 0.12, 0.98) 0.4s;
                             animation: link-msg-fade-out cubic-bezier(0.22, 0.58, 0.12, 0.98) 0.4s;
                   }
                   @-webkit-keyframes link-msg-move-in-top {
                     from {
                       opacity: 0;
                       -webkit-transform: translate(0, 5em);
                               transform: translate(0, 5em);
                     }
                     to {
                       opacity: 1;
                       -webkit-transform: translate(0, 0);
                               transform: translate(0, 0);
                     }
                   }
                   @keyframes link-msg-move-in-top {
                     from {
                       opacity: 0;
                       -webkit-transform: translate(0, 5em);
                               transform: translate(0, 5em);
                     }
                     to {
                       opacity: 1;
                       -webkit-transform: translate(0, 0);
                               transform: translate(0, 0);
                     }
                   }
                   @-webkit-keyframes link-msg-fade-out {
                     from {
                       opacity: 1;
                     }
                     to {
                       opacity: 0;
                     }
                   }
                   @keyframes link-msg-fade-out {
                     from {
                       opacity: 1;
                     }
                     to {
                       opacity: 0;
                     }
                   }
                   </style>`);

                        let domChat = ifr[0].contentWindow.document.getElementsByClassName(
                            'chat-input'
                        )[0];
                        $(domChat).focus(checkMedal);
                        let domPanel = ifr[0].contentWindow.document.getElementById(
                            'control-panel-ctnr-box'
                        );
                        left = $(domPanel).offset().left + 8 + 'px';
                        top = $(domPanel).offset().top - 50 + 'px';
                        console.log(`勋章自动切换功能已启动`);
                        toast('勋章自动切换功能已启动', 'success');
                        clearInterval(bindTimer);
                    }
                } catch (err) {
                    let ifr = document
                        .getElementById('player-ctnr')
                        .getElementsByTagName('iframe');
                    console.log(
                        `chatinput: ${$('.chat-input')
                            .length}\niframe: ${ifr.length}`
                    );
                }
            }
        }, 1e3);

        $('body').mousemove(e => {
            xx = e.originalEvent.x || e.originalEvent.layerX || 0;
            yy = e.originalEvent.y || e.originalEvent.layerY || 0;
            //let d = document.getElementById("div");获取某div在当前窗口的位置
            //let dx = xx - p.getBoundingClientRect().left;
            //let dy = yy - p.getBoundingClientRect().top;
            //$(this).text(dx + '---' + dy);鼠标在该div内位置
        });
    }

    function getMedal() {
        $.ajax({
            type: 'GET',
            url:
                '//api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom',
            data: {
                room_id
            },
            success: res => {
                if (res.code == 0) {
                    console.log('勋章id获取成功');
                    medal_id = res.data.anchor_info.medal_info.medal_id;
                    bindInput();
                }
            }
        });
    }

    function checkMedal() {
        // let left = '85%',
        //     top = '70%';
        $.ajax({
            type: 'GET',
            // url: '//api.live.bilibili.com/i/ajaxWearFansMedal',
            url:
                '//api.live.bilibili.com/live_user/v1/UserInfo/get_weared_medal',
            success: res => {
                if (medal_id == res.data.medal_id) {
                    toast('已经佩戴本房间勋章，无需重复佩戴', 'caution');
                } else {
                    wearMedal(medal_id);
                }
            }
        });
    }

    function wearMedal(medal_id) {
        // let left = xx - 100 + 'px',
        //     top = yy - 100 + 'px';
        // let left = '85%',
        //     top = '70%';
        $.ajax({
            type: 'POST',
            // url: '//api.live.bilibili.com/i/ajaxWearFansMedal',
            url: '//api.live.bilibili.com/xlive/web-room/v1/fansMedal/wear',
            data: {
                medal_id
            },
            success: res => {
                if (res.code == 0) {
                    toast(res.message || res.msg, 'success');
                    console.log(left, top, res.message || res.msg);
                } else {
                    toast(res.message || res.msg, 'caution');
                    // $('.chat-input').unbind();
                }
            }
        });
    }

    function toast(text, level) {
        text = text || '这是一个提示';
        level = level || 'success'; // success,caution,info,error
        // left = left || '75%';
        // top = top || '80%';
        if (level != 'success') {
            console.log(text);
        }
        let id = new Date().valueOf();

        $('body').append(
            '<div class="link-toast ' +
                level +
                '"data-id="' +
                id +
                '" style="position: fixed; left: ' +
                left +
                '; top: ' +
                top +
                ';"><span class="toast-text">' +
                text +
                '</span></div>'
        );
        $(
            "div.link-toast[data-id='" + id + "']"
        ).slideDown('normal', function() {
            setTimeout(function() {
                $(
                    "div.link-toast[data-id='" + id + "']"
                ).fadeOut('normal', function() {
                    $("div.link-toast[data-id='" + id + "']").remove();
                });
            }, 1500);
        });
    }

    window.onload = function() {
        let token = getCookie('bili_jct');
        $.ajaxSetup({
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {
                csrf: token,
                csrf_token: token
            }
        });
        console.log(`花心拯救者脚本已开始工作！`);
        getMedal();
    };
})();
