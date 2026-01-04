// ==UserScript==
// @name         Cutemon机器人 Multiple
// @namespace    Cutemon
// @version      5.04
// @description  暗中做个机器人岂不美哉|･ω･｀)
// @author       Cutemon
// @include      /https?:\/\/live\.bilibili\.com.*?/0\??.*/
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/pako/2.0.3/pako.es5.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/382811/Cutemon%E6%9C%BA%E5%99%A8%E4%BA%BA%20Multiple.user.js
// @updateURL https://update.greasyfork.org/scripts/382811/Cutemon%E6%9C%BA%E5%99%A8%E4%BA%BA%20Multiple.meta.js
// ==/UserScript==

(function() {
    window.onload = function() {
        CUTE_MODULE.toast.success(`Cutemon机器人ver_5.04|･ω･｀)`);
        // 修改浏览器标题
        document.title = `Cutemon机器人`;
        // 房间号输入
        // let arr = window.location.pathname.split('/');
        // for (let i = 0; i < arr.length; i++) {
        //     if (Number(arr[i]) == arr[i]) {
        //         $('.room_entry').val(arr[i]);
        //     }
        // }
        // 配置jqconfirm插件
        jconfirm.pluginDefaults.useBootstrap = false;
        jconfirm.pluginDefaults.boxWidth = '30%';

        // 读取直播间tag配置
        CUTE_TAG.load();
        // 绑定新增按钮
        CUTE_TAG.bindAdd();

        // if (CUTE_MODULE.getUrlParam('reconnect')) {
        //     CUTE_ROBOT.reconnect(room_id);
        // }
    };
    // 多标签配置
    let CUTE_TAG = {
        list: [],
        current: 0,
        load: () => {
            $('.tag ul').empty();
            if (!CUTE_TAG.list.length) {
                // CUTE_TAG.list.push(undefined);
                CUTE_TAG.current = 0;
            }
            for (let i = 0; i < CUTE_TAG.list.length; i++) {
                $('.tag ul').append(
                    `
                    <li class="c-flex c-align-center">
                        <div class="tag-title">直播间${CUTE_TAG.list[i] ||
                            '未定义'}</div>
                        <div class="close-btn">×</div>
                    </li>
                    `
                );
            }

            // 绑定标签切换
            CUTE_TAG.bindToggle();
            // 绑定关闭按钮
            CUTE_TAG.bindClose();
            // 激活当前标签
            CUTE_TAG.toggle();
        },
        bindAdd: () => {
            $('.add-btn').on('click', function(e) {
                CUTE_TAG.add(e);
            });
        },
        add: e => {
            if (!$('.room_entry').val()) {
                return $.alert(`请输入直播间号`);
            }
            let room_id = Number($('.room_entry').val());
            $('.room_entry').val('');
            if (~CUTE_TAG.list.indexOf(room_id)) {
                return $.alert(`请勿打开重复的直播间`);
            }
            CUTE_TAG.list.push(room_id);
            $('.live_room').append(CUTE_INTERFACE.room);
            CUTE_TAG.current = CUTE_TAG.list.length - 1;
            // 界面其他按钮绑定
            CUTE_ROBOT.bind(CUTE_TAG.current);
            CUTE_TAG.load();

            // 新建标签独立数据
            CUTE_DATA[room_id] = {
                ROOM_INFO: {
                    entry_id: room_id, //window.location.pathname.match(/\d{3,}/)[0],
                    short_id: undefined,
                    room_id: undefined,
                    ruid: undefined, // 主播的uid
                    uname: undefined, // 主播昵称
                    medal_name: undefined, // 主播勋章名
                    medal_id: undefined, // 主播勋章id
                    guard_list: [], // 主播舰队列表
                    live_status: undefined, // 直播状态
                    live_start_time: undefined, // 直播开始时间
                    follower: {
                        // 最新关注者
                        latest: {
                            ts: undefined, // 关注时间
                            name: undefined // 昵称
                        },
                        record: {
                            ts: undefined, // 上次记录时间
                            num: undefined // 上次记录关注数
                        },
                        repeat: {} // 重复关注
                    }
                },
                MEDAL_INFO: {
                    medal_name: undefined,
                    medal_id: undefined,
                    fansclub: undefined
                },
                INTERVAL: {
                    checkFollowerItv: undefined,
                    cooldownItv: undefined,
                    replyItv: undefined,
                    queueItv: undefined,
                    adItv: undefined,
                    fansTimeOut: undefined,
                    clockTimeOut: undefined,
                    lastMsgTimeOut: undefined
                },
                danmaku_filter: [`哔哩哔哩 (゜-゜)つロ 干杯~`, `哔哩哔哩干杯( ゜- ゜)つロ`],
                liveCD: undefined,
                connecting: false,
                connectMode: undefined,
                reconnect: 0,
                replyText: undefined,
                replyCD: undefined,
                repeat_user: undefined,
                blockIgnore: undefined,
                send_gift_ts: undefined
            };

            // 读取当前登陆用户信息
            CUTE_MODULE.user.info(room_id);

            // 获取房间信息
            CUTE_MODULE.room.info(room_id, 'new');
        },
        bindClose: () => {
            $('.close-btn').on('click', function(e) {
                CUTE_TAG.close(e, $(this).index('.close-btn'));
            });
        },
        close: (e, index) => {
            //防止冒泡
            e.stopPropagation();
            $.confirm({
                title: '关闭提示',
                content: '确认断开直播间，并关闭标签吗？',
                icon: 'glyphicon glyphicon-question-sign',
                buttons: {
                    confirm: {
                        text: '确定',
                        btnClass: 'btn-blue',
                        action: function() {
                            CUTE_ROBOT.disconnect(CUTE_TAG.list[index]);
                            CUTE_TAG.list.splice(index, 1);
                            $('.live_room').children().eq(index).remove();
                            index === CUTE_TAG.current &&
                                index > 0 &&
                                CUTE_TAG.current--;
                            CUTE_TAG.load();
                        }
                    },
                    cancel: {
                        text: '取消'
                    }
                }
            });
        },
        bindToggle: () => {
            $(`.tag ul li`).on('click', function(e) {
                CUTE_TAG.current = $(this).index('.tag ul li');
                CUTE_TAG.toggle(e);
            });
        },
        toggle: e => {
            // console.log('toggle' + CUTE_TAG.current);
            for (let i = 0; i < $(`.tag ul li`).length; i++) {
                $(`.tag ul li`).eq(i).removeClass('current');
                $(`.room_container`).eq(i).removeClass('current');
                if (i === CUTE_TAG.current) {
                    $(`.tag ul li`).eq(i).addClass('current');
                    $(`.room_container`).eq(i).addClass('current');
                    // 弹幕池滚动
                    let scrollHeight = $(
                        `#${CUTE_TAG.list[i]} .danmu_container`
                    ).prop('scrollHeight');
                    $(`#${CUTE_TAG.list[i]} .danmu_container`).scrollTop(
                        scrollHeight
                    );
                }
            }
            // console.log(CUTE_DATA);
        }
    };
    // 机器人总控制
    let CUTE_ROBOT = {
        init: () => {
            try {
                // 拦截弹幕服务器连接
                const webSocketConstructor = WebSocket.prototype.constructor;
                WebSocket.prototype.constructor = (url, protocols) => {
                    if (url === 'wss://broadcastlv.chat.bilibili.com/sub')
                        return webSocketConstructor(url, protocols);
                    throw new Error();
                };
            } catch (err) {
                console.log(err);
            }
            try {
                // 拦截直播流
                window.fetch = () =>
                    new Promise(() => {
                        throw new Error();
                    });
            } catch (err) {
                console.log(err);
            }
            try {
                // 清空页面元素和节点
                // $('html').remove();
                $('body').html(CUTE_INTERFACE.html);
            } catch (err) {
                console.log(err);
            }
            try {
                // 获取用户token
                CUTE_DATA.USER_INFO.token = CUTE_API.getCookie('bili_jct');
                // $.ajaxSetup({
                //   crossDomain: true,
                //   xhrFields: {
                //     withCredentials: true
                //   },
                //   data: {
                //     csrf: CUTE_DATA.USER_INFO.token,
                //     csrf_token: CUTE_DATA.USER_INFO.token
                //   }
                // });
            } catch (err) {
                console.log(err);
            }
        },
        // 界面功能按钮点击绑定
        bind: index => {
            let room_id = CUTE_TAG.list[index];
            // 连接弹幕服务器并启用全部功能
            $('.room_container').eq(index).attr('id', room_id);
            $(`#${room_id} .connect_full`).on('click', function(e) {
                CUTE_ROBOT.connect.check(room_id, 'common');
            });
            // 休眠模式
            $(`#${room_id} .connect_sleep`).on('click', function(e) {
                CUTE_ROBOT.connect.check(room_id, 'sleep');
            });
            // 聊天模式
            $(`#${room_id} .connect_chat`).on('click', function(e) {
                CUTE_ROBOT.connect.check(room_id, 'chat');
            });
            // 断开弹幕服务器
            $(`#${room_id} .disconnect`).on('click', function(e) {
                CUTE_ROBOT.disconnect(room_id);
            });
            // 打开直播间
            $(`#${room_id} .new_room`).on('click', function(e) {
                window.open(
                    'https://live.bilibili.com/' + CUTE_TAG.list[index]
                );
            });
            // 复读用户设定
            $(`#${room_id} .repeat_user`).blur(function() {
                CUTE_DATA[room_id].repeat_user = $(
                    `#${room_id} .repeat_user`
                ).val();
            });
            // 循环广告
            $(`#${room_id} .intervalTime`).blur(function() {
                CUTE_MODULE.ad.time(room_id);
            });
            $(`#${room_id} .danmu_clock_start`).on('click', function(e) {
                CUTE_MODULE.ad.time(room_id);
                CUTE_MODULE.ad.run(room_id);
            });
            $(`#${room_id} .danmu_clock_end`).on('click', function(e) {
                CUTE_MODULE.ad.end(room_id);
            });

            // 更换弹幕颜色
            $(`#${room_id} .danmu_color`).on('click', function(e) {
                CUTE_MODULE.danmaku.color(e, room_id);
            });
            // 弹幕发送
            $(`#${room_id} .danmu_send`).keypress(function(e) {
                CUTE_MODULE.danmaku.send(e, index);
            });
            // 添加新的广告/关键词回复
            $(`#${room_id} .ad_new_submit`).on('click', function() {
                CUTE_MODULE.ad.add(room_id);
            });
            $(`#${room_id} .autoreply_add`).on('click', function() {
                CUTE_MODULE.keyword.reply.add(room_id);
            });

            // 为textarea添加新行数的插件
            $.fn.autoHeightTextareaDefaults = {
                rows: 0,
                minRows: 0,
                maxRows: null,
                HIDDEN_STYLE: `
height:0 !important;
visibility:hidden !important;
overflow:hidden !important;
position:absolute !important;
z-index:-1000 !important;
top:0 !important;
right:0 !important;
`,
                CONTEXT_STYLE: [
                    'letter-spacing',
                    'line-height',
                    'padding-top',
                    'padding-bottom',
                    'font-family',
                    'font-weight',
                    'font-size',
                    'text-rendering',
                    'text-transform',
                    'width',
                    'text-indent',
                    'padding-left',
                    'padding-right',
                    'border-width',
                    'box-sizing'
                ],
                calculateNodeStyling: function(targetElement) {
                    var _this = this;
                    // 获取设置在当前textarea上的css属性
                    var style = window.getComputedStyle(targetElement);
                    var boxSizing = style.getPropertyValue('box-sizing');
                    var paddingSize =
                        parseFloat(style.getPropertyValue('padding-bottom')) +
                        parseFloat(style.getPropertyValue('padding-top'));
                    var borderSize =
                        parseFloat(
                            style.getPropertyValue('border-bottom-width')
                        ) +
                        parseFloat(style.getPropertyValue('border-top-width'));
                    var contextStyle = _this.CONTEXT_STYLE
                        .map(function(value) {
                            return value + ':' + style.getPropertyValue(value);
                        })
                        .join(';');

                    return {
                        contextStyle,
                        paddingSize,
                        borderSize,
                        boxSizing
                    };
                },
                mainAlgorithm: function(hiddenTextarea, textareaElement) {
                    var _this = this;
                    /**
                         * 主要的算法依据
                         * @param {string} textareaElement : textarea的DOM对象
                         */
                    var {
                        paddingSize,
                        borderSize,
                        boxSizing,
                        contextStyle
                    } = _this.calculateNodeStyling(textareaElement);

                    // 将获取到得当前得textarea的css属性作用于隐藏的textarea
                    hiddenTextarea.setAttribute(
                        'style',
                        _this.HIDDEN_STYLE + contextStyle
                    );
                    // 将当前的textarea的value设置到隐藏的textarea上面
                    hiddenTextarea.value =
                        textareaElement.value ||
                        textareaElement.placeholder ||
                        '';

                    // 获取隐藏的textarea的height
                    var height = hiddenTextarea.scrollHeight;
                    if (boxSizing === 'border-box') {
                        height = height + borderSize;
                    } else if (boxSizing === 'content-box') {
                        height = height - paddingSize;
                    }
                    hiddenTextarea.value = '';
                    var singleRowHeight =
                        hiddenTextarea.scrollHeight - paddingSize;

                    // 如果设置有最小行数和最大行数时的判断条件，如果没有设置则取rows为最小行数
                    var minRows;
                    var dataRows = $(textareaElement).attr('rows');
                    var dataMinRows = $(textareaElement).attr('data-min-rows');
                    if (dataRows > 0 && dataMinRows > 0) {
                        minRows = Math.max(dataRows, dataMinRows);
                    } else if (dataRows > 0) {
                        minRows = dataRows;
                    } else if (dataMinRows > 0) {
                        minRows = dataMinRows;
                    } else {
                        minRows = 1;
                    }
                    var maxRows = $(textareaElement).attr('data-max-rows')
                        ? $(textareaElement).attr('data-max-rows')
                        : null;

                    if (_this.rows && _this.minRows) {
                        minRows = Math.max(_this.rows, _this.minRows, minRows);
                    } else if (_this.rows) {
                        minRows = Math.max(_this.rows, minRows);
                    } else if (_this.minRows) {
                        minRows = Math.max(_this.minRows, minRows);
                    }

                    if (_this.maxRows && maxRows !== null) {
                        maxRows = Math.min(_this.maxRows, maxRows);
                    } else if (_this.maxRows) {
                        maxRows = _this.maxRows;
                    }

                    if (minRows !== null) {
                        var minHeight = singleRowHeight * minRows;
                        if (boxSizing === 'border-box') {
                            minHeight = minHeight + paddingSize + borderSize;
                        }
                        height = Math.max(minHeight, height);
                    }
                    if (maxRows !== null) {
                        var maxHeight = singleRowHeight * maxRows;
                        if (boxSizing === 'border-box') {
                            maxHeight = maxHeight + paddingSize + borderSize;
                        }
                        height = Math.min(maxHeight, height);
                    }
                    // 将得到的height的高度设置到当前的textarea上面
                    $(textareaElement).css('height', height + 'px');
                }
            };

            $.fn.autoHeightTextarea = function(options) {
                options = $.extend(
                    {},
                    $.fn.autoHeightTextareaDefaults,
                    options
                );

                this.each(function(index, textareaElement) {
                    var hiddenTextarea;
                    // 进入页面的初始化操作
                    if (!hiddenTextarea) {
                        hiddenTextarea = document.createElement('textarea');
                        document.body.appendChild(hiddenTextarea);
                    }
                    options.mainAlgorithm(hiddenTextarea, textareaElement);
                    hiddenTextarea.parentNode &&
                        hiddenTextarea.parentNode.removeChild(hiddenTextarea);
                    hiddenTextarea = null;

                    $(textareaElement)
                        .on('focus', function() {
                            if (!hiddenTextarea) {
                                hiddenTextarea = document.createElement(
                                    'textarea'
                                );
                                document.body.appendChild(hiddenTextarea);
                                hiddenTextarea.setAttribute(
                                    'style',
                                    options.HIDDEN_STYLE
                                );
                            }
                        })
                        .on('input', function() {
                            options.mainAlgorithm(
                                hiddenTextarea,
                                textareaElement
                            );
                        })
                        .on('blur', function() {
                            // 删除掉无用的隐藏的textarea
                            hiddenTextarea.parentNode &&
                                hiddenTextarea.parentNode.removeChild(
                                    hiddenTextarea
                                );
                            hiddenTextarea = null;
                        });
                });
                return this;
            };
        },
        // 连接弹幕websocket
        connect: {
            check: function(room_id, mode) {
                let _this = this;
                if (CUTE_DATA[room_id].connecting) {
                    $.confirm({
                        title: '重连提示',
                        content: '该房间已连接,确认重连吗？',
                        icon: 'glyphicon glyphicon-question-sign',
                        buttons: {
                            confirm: {
                                text: '确定',
                                btnClass: 'btn-blue',
                                action: function() {
                                    _this.init(room_id, mode);
                                }
                            },
                            cancel: {
                                text: '取消'
                            }
                        }
                    });
                } else {
                    this.init(room_id, mode);
                }
            },
            init: function(room_id, mode = 'auto', waiting = 0) {
                // console.log(mode, 'init执行了');
                CUTE_DATA[room_id].connectMode = mode;
                let _this = this;
                if (CUTE_DATA[room_id].connecting) {
                    console.log(`%c自动执行断开指令，断开当前连接后重连`, 'color: lightpink');
                    CUTE_ROBOT.disconnect(room_id, 2);
                } else {
                    setTimeout(() => {
                        _this[mode](room_id);
                    }, waiting * 1e3);
                }
            },
            common: room_id => {
                $(`#${room_id} .room_connect`)
                    .text(`全功能模式`)
                    .css('color', 'lightgreen');

                // 连接弹幕服务器
                CUTE_API.danmakuWebSocket.start(room_id).then(CUTE_DANMAKU_MGR);
                // 启动感谢关注功能
                if (
                    CUTE_DATA[room_id].ROOM_INFO.short_id != 164725 &&
                    CUTE_DATA[room_id].ROOM_INFO.short_id != 22557 &&
                    CUTE_DATA[room_id].ROOM_INFO.short_id != 3 &&
                    CUTE_DATA[room_id].ROOM_INFO.short_id != 8324350
                ) {
                    CUTE_DATA[
                        room_id
                    ].INTERVAL.checkFollowerItv = setInterval(() => {
                        CUTE_MODULE.room.follower.latest(room_id);
                    }, 10e3);
                }
                // 启动定时发言功能
                CUTE_MODULE.ad.run(room_id);
                // 启动每日0点记录粉丝数
                let waitingForRecord =
                    new Date().setHours(24, 0, 0, 0) - new Date() + 10000;
                CUTE_DATA[room_id].INTERVAL.fansTimeOut = setTimeout(() => {
                    CUTE_MODULE.room.follower.record(room_id);
                }, waitingForRecord);
                // 启动熬夜小助手报时器
                let HoursNow = new Date().getHours();
                let minutesNow = new Date().getMinutes();
                let SecondsNow = new Date().getSeconds();
                let waitingForClock =
                    (3600 - minutesNow * 60 - SecondsNow) * 1e3;
                CUTE_DATA[room_id].INTERVAL.clockTimeOut = setTimeout(() => {
                    CUTE_MODULE.clock(room_id);
                }, waitingForClock);
                return CUTE_ROBOT.connect;
            },
            sleep: room_id => {
                $(`#${room_id} .room_connect`)
                    .text(`休眠模式`)
                    .css('color', 'lightgreen');

                CUTE_API.danmakuWebSocket
                    .start(room_id)
                    .then(CUTE_SLEEP_MODE_MGR);
                // 启动每日0点记录粉丝数
                let waitingForRecord =
                    new Date().setHours(24, 0, 0, 0) - new Date() + 10000;
                CUTE_DATA[room_id].INTERVAL.fansTimeOut = setTimeout(() => {
                    CUTE_MODULE.room.follower.record(room_id);
                }, waitingForRecord);
            },
            chat: room_id => {
                $(`#${room_id} .room_connect`)
                    .text(`纯弹幕模式`)
                    .css('color', 'lightgreen');

                CUTE_API.danmakuWebSocket
                    .start(room_id)
                    .then(CUTE_CHAT_MODE_MGR);
            },
            auto: room_id => {
                CUTE_API.room.info(room_id).then(res => {
                    if (res.code === 0) {
                        CUTE_DATA[room_id].ROOM_INFO.live_status =
                            res.data.room_info.live_status;
                        if (CUTE_DATA[room_id].ROOM_INFO.live_status == 1) {
                            CUTE_ROBOT.connect.init(room_id, 'common');
                        } else {
                            CUTE_ROBOT.connect.init(room_id, 'sleep');
                        }
                    }
                });
            }
        },
        // 断开弹幕websocket
        disconnect: (room_id, reconnect = 0) => {
            CUTE_DATA[room_id].reconnect = reconnect;
            CUTE_DATA[room_id].replyCD = 0;
            try {
                CUTE_API.danmakuWebSocket.roomList[room_id].close();
            } catch (err) {
                console.log(err);
                CUTE_API.danmakuWebSocket.roomList[room_id] = null;
            }
        }
    };
    // 数据存储
    let CUTE_DATA = {
        USER_INFO: {
            uid: undefined,
            token: undefined
        }
    };
    // 配置信息
    let CUTE_CONFIG = {};
    // 操作界面
    let CUTE_INTERFACE = {
        html: `
        <head>
    <meta charset="UTF-8">
    <title></title>
    <link rel="stylesheet" href="https://cdn.bootcss.com/jquery-toast-plugin/1.3.2/jquery.toast.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css">
    <link rel="stylesheet"
        href="https://s1.hdslb.com/bfs/static/blive/blfe-live-room/static/css/2.ee9e4634828b7352b7e3.vip.css">
    <style type="text/css">
        * {
            margin: 0;
        }

        body {
            user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
        }

        button {
            padding: 5px 10px;
            margin: 0;
            color: skyblue;
            border: 1px solid skyblue;
            border-radius: 4px;
            background: transparent;
            cursor: pointer;
        }

        button:hover {
            color: #fff;
            background: skyblue;
        }

        button:disabled {
            color: #e6e6e6;
            background-color: #4c4c4c;
            border-color: #4c4c4c;
        }

        input {
            box-sizing: border-box;
        }

        input[type='text'] {
            height: 20px;
            padding: 10px 6px
        }

        input[type='radio'] {
            vertical-align: middle;
        }

        label {
            vertical-align: middle;
        }

        h1 {
            margin: 10px 0;
        }

        .font-12 {
            font-size: 12px;
        }

        .danmu_color {
            display: inline-block;
            vertical-align: middle;
            cursor: pointer;
            box-sizing: border-box-box;
            /* border: 1px solid #d0d7dd; */
            border-radius: 50%;
            width: 20px;
            height: 20px;
        }

        .set_color {
            display: inline-block;
            vertical-align: middle;
            box-sizing: border-box-box;
            border-radius: 50%;
            width: 20px;
            height: 20px;
        }

        .c-flex {
            display: flex;
        }

        .c-flex-1 {
            flex: 1;
        }

        .c-align-center {
            align-items: center;
        }

        .nowrap {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .gap-5 {
            height: 5px;
        }

        .gap-10 {
            height: 10px;
        }

        .gap-20 {
            height: 20px;
        }

        .gap-w-5 {
            display: inline-block;
            width: 5px;
        }

        .btn-group button {
            margin: 0 4px 0 0;
        }

        .container {
            min-height: 100vh;
            padding: 10px 20px;
        }

        .bg-black {
            background-color: rgb(36, 36, 36);
        }

        .font-white {
            color: white;
        }

        .border-white {
            border: 1px solid white;
        }

        .room_container {
            display: none;
        }

        .room_container.current {
            display: flex;
        }

        .tag {
            min-width: 80vh;
        }

        .tag ul {
            padding: 0;
            overflow-y: hidden;
            background-color: rgb(36, 36, 36);
            
        }

        .tag li {
            list-style: none;
            color: white;
            padding: 6px 20px;
            cursor: pointer;
            border: 1px solid #fff;
        }

        .tag li:not(:first-child) {
            border-left: 0;
        }

        .tag .current {
            color: #000;
            background: #ccc;
        }

        .add-btn {
            line-height: 26px;
            padding: 0 2px;
            font-size: 22px;
            margin-left: 20px;
            background-color: rgb(70, 70, 70);
            border-radius: 50%;
            cursor: pointer;
        }

        .close-btn {
            line-height: 20px;
            padding: 0 2px;
            font-size: 20px;
            margin-left: 20px;
            /* background-color: rgb(70, 70, 70); */
            border-radius: 50%;
            cursor: pointer;
        }

        .level-0 {
            border-color: #000;
        }

        .level-0 .label {
            background-color: #000;
        }

        .level-0 .level {
            color: #000;
        }

        .level-21 {
            border-color: #1a544b
        }

        .level-21 .label {
            background-image: linear-gradient(45deg, #1a544b, #529d92);
        }

        .level-21 .level {
            color: #1a544b
        }

        .level-22 {
            border-color: #1a544b
        }

        .level-22 .label {
            background-image: linear-gradient(45deg, #1a544b, #529d92);
        }

        .level-22 .level {
            color: #1a544b
        }

        .level-23 {
            border-color: #1a544b
        }

        .level-23 .label {
            background-image: linear-gradient(45deg, #1a544b, #529d92);
        }

        .level-23 .level {
            color: #1a544b
        }

        .level-24 {
            border-color: #1a544b
        }

        .level-24 .label {
            background-image: linear-gradient(45deg, #1a544b, #529d92);
        }

        .level-24 .level {
            color: #1a544b
        }

        .level-25 {
            border-color: rgb(6, 21, 76)
        }

        .level-25 .label {
            background-image: linear-gradient(45deg, rgb(6, 21, 76), rgb(104, 136, 241));
        }

        .level-25 .level {
            color: rgb(6, 21, 76)
        }

        .level-26 {
            border-color: rgb(6, 21, 76)
        }

        .level-26 .label {
            background-image: linear-gradient(45deg, rgb(6, 21, 76), rgb(104, 136, 241));
        }

        .level-26 .level {
            color: rgb(6, 21, 76)
        }

        .level-27 {
            border-color: rgb(6, 21, 76)
        }

        .level-27 .label {
            background-image: linear-gradient(45deg, rgb(6, 21, 76), rgb(104, 136, 241));
        }

        .level-27 .level {
            color: rgb(6, 21, 76)
        }

        .level-28 {
            border-color: rgb(6, 21, 76)
        }

        .level-28 .label {
            background-image: linear-gradient(45deg, rgb(6, 21, 76), rgb(104, 136, 241));
        }

        .level-28 .level {
            color: rgb(6, 21, 76)
        }

        .level-29 {
            border-color: rgb(45, 8, 85)
        }

        .level-29 .label {
            background-image: linear-gradient(45deg, rgb(45, 8, 85), rgb(157, 155, 255));
        }

        .level-29 .level {
            color: rgb(45, 8, 85)
        }

        .level-30 {
            border-color: rgb(45, 8, 85)
        }

        .level-30 .label {
            background-image: linear-gradient(45deg, rgb(45, 8, 85), rgb(157, 155, 255));
        }

        .level-30 .level {
            color: rgb(45, 8, 85)
        }

        .level-31 {
            border-color: rgb(45, 8, 85)
        }

        .level-31 .label {
            background-image: linear-gradient(45deg, rgb(45, 8, 85), rgb(157, 155, 255));
        }

        .level-31 .level {
            color: rgb(45, 8, 85)
        }

        .level-32 {
            border-color: rgb(45, 8, 85)
        }

        .level-32 .label {
            background-image: linear-gradient(45deg, rgb(45, 8, 85), rgb(157, 155, 255));
        }

        .level-32 .level {
            color: rgb(45, 8, 85)
        }

        .level-33 {
            border-color: rgb(122, 4, 35)
        }

        .level-33 .label {
            background-image: linear-gradient(45deg, rgb(122, 4, 35), rgb(233, 134, 187));
        }

        .level-33 .level {
            color: rgb(122, 4, 35)
        }

        .level-34 {
            border-color: rgb(122, 4, 35)
        }

        .level-34 .label {
            background-image: linear-gradient(45deg, rgb(122, 4, 35), rgb(233, 134, 187));
        }

        .level-34 .level {
            color: rgb(122, 4, 35)
        }

        .level-35 {
            border-color: rgb(122, 4, 35)
        }

        .level-35 .label {
            background-image: linear-gradient(45deg, rgb(122, 4, 35), rgb(233, 134, 187));
        }

        .level-35 .level {
            color: rgb(122, 4, 35)
        }

        .level-36 {
            border-color: rgb(122, 4, 35)
        }

        .level-36 .label {
            background-image: linear-gradient(45deg, rgb(122, 4, 35), rgb(233, 134, 187));
        }

        .level-36 .level {
            color: rgb(122, 4, 35)
        }

        .level-37 {
            border-color: rgb(255, 97, 11)
        }

        .level-37 .label {
            background-image: linear-gradient(45deg, rgb(255, 97, 11), rgb(255, 208, 132));
        }

        .level-37 .level {
            color: rgb(255, 97, 11)
        }

        .level-38 {
            border-color: rgb(255, 97, 11)
        }

        .level-38 .label {
            background-image: linear-gradient(45deg, rgb(255, 97, 11), rgb(255, 208, 132));
        }

        .level-38 .level {
            color: rgb(255, 97, 11)
        }

        .level-39 {
            border-color: rgb(255, 97, 11)
        }

        .level-39 .label {
            background-image: linear-gradient(45deg, rgb(255, 97, 11), rgb(255, 208, 132));
        }

        .level-39 .level {
            color: rgb(255, 97, 11)
        }

        .level-40 {
            border-color: rgb(255, 97, 11)
        }

        .level-40 .label {
            background-image: linear-gradient(45deg, rgb(255, 97, 11), rgb(255, 208, 132));
        }

        .level-40 .level {
            color: rgb(255, 97, 11)
        }


        .guard-icon {
            width: 18px;
            height: 18px;
            background-size: cover;
        }

        .guard-level-1 {
            background-image: url('//s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/icon.guard-thumb-01.e630a67.png');
        }

        .guard-level-2 {
            background-image: url(data:image/png;base64,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)
        }

        .guard-level-3 {
            background-image: url(data:image/png;base64,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);
        }

        .danmu_send {
            width: 100%;
        }

        .m-b-10 {
            margin-bottom: 10px;
        }

        .float-l {
            float: left;
        }

        .chat-history-panel .chat-history-list .chat-item.danmaku-item .admin-icon,
        .chat-history-panel .chat-history-list .chat-item.danmaku-item .anchor-icon,
        .chat-history-panel .chat-history-list .chat-item.danmaku-item .fans-medal-item-ctnr,
        .chat-history-panel .chat-history-list .chat-item.danmaku-item .guard-icon,
        .chat-history-panel .chat-history-list .chat-item.danmaku-item .title-label,
        .chat-history-panel .chat-history-list .chat-item.danmaku-item .user-level-icon {
            margin-right: 5px;
        }

        .dp-i-block {
            display: inline-block;
        }

        .v-middle {
            vertical-align: middle;
        }

        .p-relative {
            position: relative;
        }

        .u-name {
            line-height: 20px;
        }

        .admin-icon {
            background-color: #ffa340;
            margin-right: 3px;
            height: 14px;
            padding: 0 6px;
            border: 1px solid #ea9336;
            border-radius: 2px;
            line-height: 12px;
            font-size: 12px;
            color: #fff;
        }

        .admin-icon:before {
            content: "房管";
        }

        .danmu_container {
            width: 100%;
            height: 600px;
            margin-top: 10px;
            padding: 10px;
            box-sizing: border-box;
            border: 1px solid #fff;
            background-color: #222;
            overflow-y: auto;
            pointer-events: auto !important;
        }

        .danmu-item {
            height: 40px;
        }

        .jq-toast-wrap {
            width: 320px;
            max-height: 80%;
            overflow-y: auto;
            pointer-events: auto !important;
        }

        .jq-toast-wrap.top-right {
            top: 20px;
            right: 20px;
        }

        .jq-toast-single {
            width: initial;
        }

        .jq-toast-single button {
            position: relative;
            cursor: pointer;
            background-color: #444;
            color: #fff;
            font-size: 12px;
            padding: 2px 5px;
            border: 1px solid #fff;
        }

        .jq-toast-heading {
            font-weight: normal;
        }
    </style>

</head>

<body>
    <div class="font-12 container bg-black font-white">

        <!-- tab -->
        <div class="c-flex c-align-center">
            <input type="number" placeholder="请输入直播间号" class="room_entry" value="">
            <div class="add-btn c-flex c-align-center">＋</div>
        </div>
        <div class="gap-20"></div>
        <div class="tag c-flex c-align-center">
            <ul class="c-flex c-align-center">
                
            </ul>
        </div>

        <div class="gap-20"></div>

        <div class="live_room">
            
        </div>


    </div>
</body>
    <script src="https://cdn.bootcss.com/jquery-toast-plugin/1.3.2/jquery.toast.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js"></script>
        `,
        room: `
        <div class="room_container" style="width: 100%;">
            <div class="c-flex-1">
                <div class="">
                    <div class="c-flex c-align-center">
                        <h2 class="border-white" style="padding: 10px;">
                            <span class="host_name"></span>-<span class="room_area"></span>-<span class="room_status"></span>
                        </h2>
                        <h2 class="" style="padding: 10px;">
                            <span class="room_connect" style="color: #f8878d;">未连接</span>
                        </h2>
                        <button class="new_room">打开直播间</button>
                    </div>

                    <div class="gap-10"></div>

                    <div class="c-align-center">
                        <div class="btn-group c-flex c-align-center" style="margin-left: 5px;">
                            <div>连接直播间：</div>
                            <button class="connect_full">全功能模式</button>
                            <button class="connect_sleep">休眠模式</button>
                            <button class="connect_chat">纯弹幕模式</button>
                        </div>

                        <div class="gap-10"></div>

                        <div class="btn-group c-flex c-align-center" style="margin-left: 5px;">
                            <div>断开直播间：</div>
                            <button class="disconnect">断开连接</button>
                        </div>
                    </div>

                </div>

                <div class="gap-20"></div>

                <div>
                    <div class="c-flex">
                        <h2 class="border-white" style="padding: 10px;">
                            功能开关配置
                        </h2>
                    </div>
                    <div class="gap-10"></div>
                    <div>
                        感谢关注：
                        <input type="radio" name="follow" value="1" />
                        <label for="">开</label>
                        <div class="gap-w-5"></div>
                        <input type="radio" name="follow" value="0" />
                        <label for="">关</label>
                    </div>
                    <div class="gap-5"></div>
                    <div>
                        感谢礼物：
                        <input type="radio" name="gift" value="2" />
                        <label for="">所有礼物</label>
                        <div class="gap-w-5"></div>
                        <input type="radio" name="gift" value="1" />
                        <label for="">金瓜子礼物</label>
                        <div class="gap-w-5"></div>
                        <input type="radio" name="gift" value="0" />
                        <label for="">关</label>
                    </div>
                    <div class="gap-5"></div>
                    <div>
                        循环公告：
                        <input type="radio" name="ad" value="1" />
                        <label for="">开</label>
                        <div class="gap-w-5"></div>
                        <input type="radio" name="ad" value="0" />
                        <label for="">关</label>
                    </div>
                    <div class="gap-5"></div>
                    <div>
                        自动回复：
                        <input type="radio" name="reply" value="1" />
                        <label for="">开</label>
                        <div class="gap-w-5"></div>
                        <input type="radio" name="reply" value="0" />
                        <label for="">关</label>
                    </div>
                    <div class="gap-5"></div>
                    <div>
                        自动禁言：
                        <input type="radio" name="ban" value="1" />
                        <label for="">开</label>
                        <div class="gap-w-5"></div>
                        <input type="radio" name="ban" value="0" />
                        <label for="">关</label>
                    </div>
                    <div class="gap-5"></div>
                    <div>
                        pk播报：
                        <input type="radio" name="pk" value="1" />
                        <label for="">开</label>
                        <div class="gap-w-5"></div>
                        <input type="radio" name="pk" value="0" />
                        <label for="">关</label>
                    </div>
                    <div class="gap-5"></div>
                    <div>
                        复读机：
                        <input type="radio" name="repeat" value="1" />
                        <label for="">开</label>
                        <div class="gap-w-5"></div>
                        <input type="radio" name="repeat" value="0" />
                        <label for="">关</label>
                        <div class="gap-w-5"></div>
                        <input type="radio" name="repeat" value="2" />
                        <label for="">限定人员</label>
                    </div>
                    <div class="gap-5"></div>
                    <div>
                        复读用户名/UID：
                        <input class="repeat_user" type="text" />
                    </div>
                </div>

                <div class="gap-20"></div>

                <div>
                    <div class="c-flex">
                        <h2 class="border-white" style="padding: 10px;">
                            定时发言配置
                        </h2>
                    </div>

                    <div class="gap-10"></div>

                    <div>
                        发言间隔：<input style="width: 50px;" type="number" class="intervalTime" value="300"> 秒 <span
                            class="setTime" style="color: #f8878d; margin-left: 10px;">默认轰炸间隔为300秒</span>
                    </div>

                    <div class="gap-10"></div>

                    <div>
                        <button class="danmu_clock_start">启用</button>
                        <button class="danmu_clock_end">终止</button>
                    </div>

                    <div class="gap-10"></div>

                    <div><span class="switch"></span></div>

                    <div class="gap-10"></div>

                    <div>发言内容：<input class="ad_new_content" style="width: 500px; margin-bottom: 5px;" type="text"
                            value="" placeholder="请输入投放内容，最多30个字符" maxlength="30" />
                    </div>

                    <div class="gap-10"></div>

                    <div>
                        <button class="ad_new_submit">新增</button>
                    </div>

                    <div class="gap-10"></div>

                    <div class="ad_arr">

                    </div>
                    <div class="log" style="position: absolute; left: 45%; top: 0; margin: 0;">

                    </div>
                </div>

                <div class="gap-20"></div>

                <div>
                    <div class="c-flex">
                        <h2 class="border-white" style="padding: 10px;">
                            关键词回复配置
                        </h2>
                    </div>
                    <div class="gap-10"></div>
                    <div>
                        目标关键词：<input class="keyword" style="width: 200px; margin-bottom: 5px;" type="text" value=""
                            maxlength="20" />
                    </div>
                    <div class="gap-10"></div>
                    <div>
                        触发回复内容：<input class="reply" style="width: 500px; margin-bottom: 5px;" type="text" value=""
                            maxlength="30" />
                    </div>
                    <div class="gap-10"></div>
                    <div>
                        <button class="autoreply_add">新增</button>
                    </div>
                </div>

                <div class="gap-10"></div>

                <div class="autoreply_arr">

                </div>
            </div>

            <div class="c-flex-1">
                <div>弹幕池</div>
                <div class="danmu_container"></div>

                <div class="c-flex" style="width: 100%;">
                    <div class="c-flex-1">
                        <input class="danmu_send" type="text" placeholder="这是弹幕发射池……" maxlength="30" />
                    </div>
                </div>

                <div class="gap-10"></div>

                <div>
                    <div>弹幕颜色：</div>
                    <div class="gap-10"></div>
                    <div class="color-container">
                        <span class="danmu_color white" color="16777215"
                            style="background-color: rgb(255, 255, 255);"></span>
                        <span class="danmu_color red" color="16738408"
                            style="background-color: rgb(255, 104, 104);"></span>
                        <span class="danmu_color blue" color="6737151"
                            style="background-color: rgb(102, 204, 255);"></span>
                        <span class="danmu_color purple" color="14893055"
                            style="background-color: rgb(227, 63, 255);"></span>
                        <span class="danmu_color cyan" color="65532" style="background-color: rgb(0, 255, 252);"></span>
                        <span class="danmu_color green" color="8322816"
                            style="background-color: rgb(126, 266, 0);"></span>
                        <span class="danmu_color yellow" color="16772431"
                            style="background-color: rgb(255, 237, 79);"></span>
                        <span class="danmu_color orange" color="16750592"
                            style="background-color: rgb(255, 152, 0);"></span>
                        <span class="danmu_color pink" color="16741274"
                            style="background-color: rgb(255, 115, 154);"></span>
                    </div>
                    <div class="gap-10"></div>
                    <div class="c-flex c-align-center">
                        <div class="" style="color: #f8878d; margin-right: 5px;">当前弹幕颜色</div>
                        <div class="set_color" style=""></div>
                    </div>
                </div>
            </div>
        </div>
        `
    };
    // 封装请求
    let CUTE_API = {
        baseURL: `//api.live.bilibili.com/`,
        // websocket重构
        danmakuWebSocket: {
            roomList: {},
            start: function(room_id) {
                // 按钮禁用，防快速连接
                // $(`#${room_id} .connect_full`).attr('disabled', true);
                // $(`#${room_id} .connect_sleep`).attr('disabled', true);
                // $(`#${room_id} .connect_chat`).attr('disabled', true);
                // setTimeout(function() {
                //     $(`#${room_id} .connect_full`).attr('disabled', false);
                //     $(`#${room_id} .connect_sleep`).attr('disabled', false);
                //     $(`#${room_id} .connect_chat`).attr('disabled', false);
                // }, 10e3);
                this.roomList[room_id] = Object.create(this.RoomController);
                this.roomList[room_id].init(room_id);
                return this.roomList[room_id];
            },
            RoomController: {
                close: function() {
                    this.socket.close();
                },
                destroy: function(room_id) {
                    clearInterval(this.timer);
                    clearInterval(CUTE_DATA[room_id].INTERVAL.checkFollowerItv);
                    clearInterval(CUTE_DATA[room_id].INTERVAL.cooldownItv);
                    clearInterval(CUTE_DATA[room_id].INTERVAL.replyItv);
                    clearInterval(CUTE_DATA[room_id].INTERVAL.adItv);
                    clearTimeout(CUTE_DATA[room_id].INTERVAL.fansTimeOut);
                    clearTimeout(CUTE_DATA[room_id].INTERVAL.clockTimeOut);
                    this.socket = null;
                    this.timer = null;
                    this.room_id = null;
                    CUTE_API.danmakuWebSocket.roomList[room_id] = null;
                },
                init: function(room_id) {
                    this.room_id = room_id;

                    var self = this;

                    var dataStruct = [
                        {
                            name: 'Header Length',
                            key: 'headerLen',
                            bytes: 2,
                            offset: 4,
                            value: 16
                        },
                        {
                            name: 'Protocol Version',
                            key: 'ver',
                            bytes: 2,
                            offset: 6,
                            value: 1
                        },
                        {
                            name: 'Operation',
                            key: 'op',
                            bytes: 4,
                            offset: 8,
                            value: 1
                        },
                        {
                            name: 'Sequence Id',
                            key: 'seq',
                            bytes: 4,
                            offset: 12,
                            value: 1
                        }
                    ];

                    var protocol = location.origin.match(/^(.+):\/\//)[1];

                    var wsUrl = 'ws://broadcastlv.chat.bilibili.com:2244/sub';

                    if (protocol === 'https') {
                        wsUrl = 'wss://broadcastlv.chat.bilibili.com:2245/sub';
                    }

                    function str2bytes(str) {
                        var bytes = new Array();
                        var len, c;
                        len = str.length;
                        for (var i = 0; i < len; i++) {
                            c = str.charCodeAt(i);
                            if (c >= 0x010000 && c <= 0x10ffff) {
                                bytes.push(((c >> 18) & 0x07) | 0xf0);
                                bytes.push(((c >> 12) & 0x3f) | 0x80);
                                bytes.push(((c >> 6) & 0x3f) | 0x80);
                                bytes.push((c & 0x3f) | 0x80);
                            } else if (c >= 0x000800 && c <= 0x00ffff) {
                                bytes.push(((c >> 12) & 0x0f) | 0xe0);
                                bytes.push(((c >> 6) & 0x3f) | 0x80);
                                bytes.push((c & 0x3f) | 0x80);
                            } else if (c >= 0x000080 && c <= 0x0007ff) {
                                bytes.push(((c >> 6) & 0x1f) | 0xc0);
                                bytes.push((c & 0x3f) | 0x80);
                            } else {
                                bytes.push(c & 0xff);
                            }
                        }
                        return bytes;
                    }

                    function bytes2str(array) {
                        var __array = array.slice(0);
                        var j;
                        var filterArray = [
                            [0x7f],
                            [0x1f, 0x3f],
                            [0x0f, 0x3f, 0x3f],
                            [0x07, 0x3f, 0x3f, 0x3f]
                        ];
                        var str = '';
                        for (var i = 0; i < __array.length; i = i + j) {
                            var item = __array[i];
                            var number = '';
                            if (item >= 240) {
                                j = 4;
                            } else if (item >= 224) {
                                j = 3;
                            } else if (item >= 192) {
                                j = 2;
                            } else if (item < 128) {
                                j = 1;
                            }
                            var filter = filterArray[j - 1];
                            for (var k = 0; k < j; k++) {
                                var r = (__array[i + k] & filter[k]).toString(
                                    2
                                );
                                var l = r.length;
                                if (l > 6) {
                                    number = r;
                                    break;
                                }
                                for (var n = 0; n < 6 - l; n++) {
                                    r = '0' + r;
                                }
                                number = number + r;
                            }
                            str =
                                str + String.fromCharCode(parseInt(number, 2));
                        }
                        return str;
                    }

                    function getPacket(payload) {
                        return str2bytes(payload);
                    }

                    function generatePacket(action, payload) {
                        action = action || 2; // 2心跳  或  7加入房间
                        payload = payload || '';
                        var packet = getPacket(payload);
                        var buff = new ArrayBuffer(packet.length + 16);
                        var dataBuf = new DataView(buff);
                        dataBuf.setUint32(0, packet.length + 16);
                        dataBuf.setUint16(4, 16);
                        dataBuf.setUint16(6, 1);
                        dataBuf.setUint32(8, action);
                        dataBuf.setUint32(12, 1);
                        for (var i = 0; i < packet.length; i++) {
                            dataBuf.setUint8(16 + i, packet[i]);
                        }
                        return dataBuf;
                    }

                    function sendBeat() {
                        self.timer = setInterval(function() {
                            try {
                                self.socket.send(generatePacket());
                            } catch (err) {
                                setTimeout(() => {
                                    CUTE_ROBOT.connect.init(room_id, 'auto');
                                }, 3000);
                                console.log(err);
                            }
                        }, 3000);
                    }

                    function joinRoom(rid, uid) {
                        rid =
                            rid ||
                            CUTE_DATA[room_id].ROOM_INFO.room_id ||
                            22557;
                        uid =
                            uid || CUTE_DATA[room_id].ROOM_INFO.ruid || 193351;
                        var packet = JSON.stringify({
                            uid: uid,
                            roomid: rid
                        });
                        return generatePacket(7, packet);
                    }

                    var socket = new WebSocket(wsUrl);
                    socket.binaryType = 'arraybuffer';
                    socket.onopen = function(e) {
                        if (socket.readyState == 1) {
                            CUTE_MODULE.toast.success(`直播间${room_id} 连接成功`);
                            CUTE_DATA[room_id].connecting = true;
                            CUTE_DATA[room_id].reconnect = 1;
                            CUTE_MODULE.room.info(room_id);
                            console.log(
                                `%c直播间${room_id}（${CUTE_DATA[room_id].ROOM_INFO
                                    .room_id}） 连接成功`,
                                'color: lightgreen'
                            );
                        } else {
                            console.log(
                                '%c连接失败了，错误码：' + readyState,
                                'color: lightpink'
                            );
                            return;
                        }

                        var join = joinRoom();
                        socket.send(join.buffer);
                        sendBeat();
                    };

                    socket.onmessage = function(e) {
                        // console.log(e, e.data);
                        decodeBuffer(e.data);
                        function decodeBuffer(buff) {
                            var dataView = new DataView(buff);
                            // console.log(dataView);
                            var data = {};
                            data.packetLen = dataView.getUint32(0);
                            dataStruct.forEach(function(item) {
                                if (item.bytes === 4) {
                                    data[item.key] = dataView.getUint32(
                                        item.offset
                                    );
                                } else if (item.bytes === 2) {
                                    data[item.key] = dataView.getUint16(
                                        item.offset
                                    );
                                }
                            });
                            if (data.op && data.op === 5) {
                                data.body = [];
                                var packetLen = data.packetLen;
                                for (
                                    var offset = 0;
                                    offset < dataView.byteLength;
                                    offset += packetLen
                                ) {
                                    packetLen = dataView.getUint32(offset);
                                    headerLen = dataView.getUint16(offset + 4);

                                    var recData = [];
                                    for (
                                        var i = offset + headerLen;
                                        i < offset + packetLen;
                                        i++
                                    ) {
                                        recData.push(dataView.getUint8(i));
                                    }
                                    try {
                                        let body;
                                        try {
                                            body = JSON.parse(
                                                bytes2str(recData)
                                            );
                                            // console.log(body); // 弹幕、礼物、系统公告
                                        } catch (err) {
                                            let unzipedData;
                                            try {
                                                unzipedData = pako.ungzip(
                                                    buff.slice(
                                                        offset + headerLen,
                                                        offset + packetLen
                                                    )
                                                );
                                                return decodeBuffer(
                                                    unzipedData.buffer
                                                );
                                            } catch (err) {
                                                let utf8decoder = new TextDecoder();
                                                console.log(
                                                    'decode body error:',
                                                    utf8decoder.decode(
                                                        unzipedData.buffer
                                                    )
                                                );
                                            }
                                        }

                                        if (
                                            body.cmd === 'DANMU_MSG' ||
                                            body.cmd === 'DANMU_MSG:4:0:2:2:2:0'
                                        ) {
                                            //                              console.log(body.info[2][1], ':', body.info[1]) // 用户：弹幕内容
                                            self.fn.call(null, {
                                                cmd: body.cmd,
                                                color: body.info[0][3],
                                                uid: body.info[2][0],
                                                name: body.info[2][1],
                                                admin: body.info[2][2],
                                                vip: body.info[2][3],
                                                svip: body.info[2][4],
                                                text: body.info[1],
                                                medal_name:
                                                    body.info[3][1] || '没勋章',
                                                medal_level:
                                                    body.info[3][0] || '0',
                                                user_level: body.info[4][0],
                                                guard: body.info[7],
                                                room_id: self.room_id
                                            });
                                        } else if (body.cmd === 'GUARD_BUY') {
                                            self.fn.call(null, {
                                                cmd: body.cmd,
                                                uid: body.data.uid,
                                                username: body.data.username,
                                                gift_name: body.data.gift_name,
                                                price: body.data.price,
                                                room_id: self.room_id
                                            });
                                        } else if (body.cmd === 'SEND_GIFT') {
                                            self.fn.call(null, {
                                                cmd: body.cmd,
                                                coin_type: body.data.coin_type,
                                                giftName: body.data.giftName,
                                                uname: body.data.uname,
                                                num: body.data.num,
                                                room_id: self.room_id
                                            });
                                        } else if (
                                            body.cmd === 'SPECIAL_GIFT'
                                        ) {
                                            self.fn.call(null, {
                                                cmd: body.cmd,
                                                storm: body.data[39],
                                                storm_id: body.data[39].id,
                                                storm_content:
                                                    body.data[39].content,
                                                storm_action:
                                                    body.data[39].action,
                                                room_id: self.room_id
                                            });
                                        } else if (
                                            body.cmd === 'ANCHOR_LOT_START'
                                        ) {
                                            self.fn.call(null, {
                                                cmd: body.cmd,
                                                anchor_id: body.data.id,
                                                anchor_content: body.data.danmu,
                                                require_type:
                                                    body.data.require_type,
                                                room_id: self.room_id,
                                                award_name:
                                                    body.data.award_name,
                                                time: body.data.time
                                            });
                                        } else if (
                                            body.cmd === 'ROOM_BLOCK_MSG'
                                        ) {
                                            self.fn.call(null, {
                                                cmd: body.cmd,
                                                block_uid: body.data.uid,
                                                block_uname: body.data.uname,
                                                room_id: self.room_id
                                            });
                                        } else if (
                                            body.cmd === 'LIVE' ||
                                            body.cmd === 'PREPARING'
                                        ) {
                                            // console.log(body);
                                            self.fn.call(null, {
                                                cmd: body.cmd,
                                                room_id: self.room_id,
                                                live_id: body.roomid
                                            });
                                        } else if (
                                            body.cmd ===
                                            'MESSAGEBOX_USER_MEDAL_CHANGE'
                                        ) {
                                            self.fn.call(null, {
                                                cmd: body.cmd,
                                                is_lighted:
                                                    body.data.is_lighted,
                                                medal_level:
                                                    body.data.medal_level,
                                                medal_name:
                                                    body.data.medal_name,
                                                uid: body.data.uid,
                                                up_uid: body.data.up_uid,
                                                room_id: self.room_id
                                            });
                                        } else if (
                                            body.cmd === 'PK_BATTLE_PRE'
                                        ) {
                                            self.fn.call(null, {
                                                cmd: body.cmd,
                                                pk_uid: body.data.uid,
                                                pk_uname: body.data.uname,
                                                pk_roomid: body.data.room_id,
                                                room_id: self.room_id
                                            });
                                        }
                                        data.body.push(body);
                                        //                          console.log(data.body);
                                    } catch (err) {
                                        console.log(err);
                                    }
                                }
                            }
                        }
                    };

                    socket.onclose = function() {
                        CUTE_DATA[room_id].connecting = false;
                        self.destroy(room_id);
                        $(`#${room_id} .room_connect`)
                            .text(`已断开`)
                            .css('color', '#f8878d');
                        switch (CUTE_DATA[room_id].reconnect) {
                            case 1:
                                console.log(
                                    `%c直播间${room_id}意外断开，5秒后尝试重连`,
                                    'color: lightpink'
                                );
                                CUTE_ROBOT.connect.init(
                                    room_id,
                                    CUTE_DATA[room_id].connectMode,
                                    5
                                );
                                break;
                            case 2:
                                console.log(
                                    `%c直播间${room_id}已断开，立即执行重连指令`,
                                    'color: lightpink'
                                );
                                CUTE_ROBOT.connect.init(
                                    room_id,
                                    CUTE_DATA[room_id].connectMode
                                );
                                break;

                            default:
                                console.log(
                                    `%c直播间${room_id}已断开，现在可以安全重连`,
                                    'color: lightpink'
                                );
                                break;
                        }
                    };

                    socket.onerror = function() {
                        console.log(`%c直播间${room_id}连接错误`, 'color: lightpink');
                        self.close();
                    };

                    this.socket = socket;
                },

                then: function(fn) {
                    this.fn = fn;
                }
            }
        },
        // ajax调用B站API
        last_ajax: 0,
        cnt_frequently_ajax: 0,
        ajax: settings => {
            if (Date.now() - CUTE_API.last_ajax < 10) {
                CUTE_API.cnt_frequently_ajax++;
            } else {
                CUTE_API.cnt_frequently_ajax = 0;
            }
            CUTE_API.last_ajax = Date.now();
            if (CUTE_API.cnt_frequently_ajax > 20)
                throw new Error('调用BilibiliAPI太快，可能出现了bug');
            if (settings.xhrFields) {
                jQuery.extend(settings.xhrFields, {
                    withCredentials: true
                });
            } else {
                settings.xhrFields = {
                    withCredentials: true
                };
            }
            jQuery.extend(settings, {
                url:
                    (settings.url.substr(0, 2) === '//'
                        ? ''
                        : CUTE_API.baseURL) + settings.url,
                method: settings.method || 'GET',
                crossDomain: true,
                dataType: settings.dataType || 'json'
            });
            return jQuery.ajax(settings);
        },
        // 获取用户cookie
        getCookie: Name => {
            var search = Name + '='; //查询检索的值
            var returnvalue = ''; //返回值
            if (document.cookie.length > 0) {
                var sd = document.cookie.indexOf(search);
                if (sd != -1) {
                    sd += search.length;
                    var end = document.cookie.indexOf(';', sd);
                    if (end == -1) end = document.cookie.length;
                    //unescape() 函数可对通过 escape() 编码的字符串进行解码。
                    returnvalue = unescape(document.cookie.substring(sd, end));
                }
            }
            return returnvalue;
        },
        // 连接直播间初始化
        user: {
            info: room_id => {
                return CUTE_API.ajax({
                    // url: 'User/getUserInfo'
                    url: 'xlive/web-room/v1/index/getInfoByUser',
                    data: {
                        room_id: room_id
                    }
                });
            },
            //
            search: uid => {
                return CUTE_API.ajax({
                    url: '//api.bilibili.com/x/space/acc/info',
                    data: {
                        mid: uid
                    }
                });
            },
            // 勋章切换/直播间勋章
            medal: {
                check: () => {
                    return CUTE_API.ajax({
                        url: 'i/api/medal',
                        data: {
                            page: 1,
                            pageSize: 25
                        }
                    });
                },
                wear: room_id => {
                    CUTE_API.ajax({
                        url: 'i/ajaxWearFansMedal',
                        data: {
                            medal_id: CUTE_DATA[room_id].MEDAL_INFO.medal_id
                        }
                    });
                },
                cancel: () => {
                    CUTE_API.ajax({
                        url: 'i/ajaxCancelWear'
                    });
                }
            },
            // 发送
            send: {
                // 发送私信
                msg: (receiver_id, content) => {
                    return CUTE_API.ajax({
                        method: 'POST',
                        url: '//api.vc.bilibili.com/web_im/v1/web_im/send_msg',
                        data: {
                            msg: {
                                sender_uid: CUTE_DATA.USER_INFO.uid,
                                receiver_id: receiver_id,
                                receiver_type: 1,
                                msg_type: 1,
                                content: content,
                                timestamp: new Date().getTime(),
                                dev_id: 0
                            },
                            csrf_token: CUTE_DATA.USER_INFO.token,
                            csrf: CUTE_DATA.USER_INFO.token
                        }
                    });
                },
                // 发送弹幕
                danmaku: (msg, room_id) => {
                    if (!msg) {
                        return CUTE_MODULE.toast.failed(`发送内容不能为空`);
                    }
                    return CUTE_API.ajax({
                        method: 'POST',
                        url: 'msg/send',
                        data: {
                            // 字体颜色：默认白色：16777215 | 姥爷红：16738408 | 姥爷蓝：6737151 | 青色：65532 | 绿色：8322816 | 黄色：16772431 | 橙色：16750592
                            color: 16750592,
                            fontsize: 25,
                            mode: 1,
                            msg: msg,
                            rnd: new Date().getTime(),
                            roomid: CUTE_DATA[room_id].ROOM_INFO.room_id,
                            bubble: 0,
                            csrf_token: CUTE_DATA.USER_INFO.token,
                            csrf: CUTE_DATA.USER_INFO.token
                        }
                    });
                },
                config: (colorhex, room_id) => {
                    // todo
                    return CUTE_API.ajax({
                        method: 'POST',
                        url: 'xlive/web-room/v1/dM/AjaxSetConfig',
                        // url: 'api/ajaxSetConfig', // 旧
                        data: {
                            room_id: CUTE_DATA[room_id].ROOM_INFO.room_id,
                            color: colorhex,
                            csrf_token: CUTE_DATA.USER_INFO.token,
                            csrf: CUTE_DATA.USER_INFO.token
                        }
                    });
                }
            },
            // 送礼
            gift: {
                // 送礼物
                send: room_id => {
                    return CUTE_API.ajax({
                        method: 'POST',
                        url: 'gift/v2/gift/send',
                        data: {
                            uid: CUTE_DATA.USER_INFO.uid,
                            gift_id: gift_id,
                            ruid: CUTE_DATA[room_id].ROOM_INFO.ruid,
                            gift_num: gift_num,
                            coin_type: 'silver',
                            bag_id: 0,
                            platform: 'pc',
                            biz_code: 'live',
                            biz_id: CUTE_DATA[room_id].ROOM_INFO.room_id,
                            rnd: new Date().getTime(),
                            storm_beat_id: 0,
                            metadata: '',
                            price: 0,
                            csrf_token: CUTE_DATA.USER_INFO.token,
                            csrf: CUTE_DATA.USER_INFO.token
                        }
                    });
                },
                // 送礼物（从包裹）
                send_bag: (gift_id, gift_num, bag_id, room_id) => {
                    return CUTE_API.ajax({
                        method: 'POST',
                        url: 'gift/v2/live/bag_send',
                        data: {
                            uid: CUTE_DATA.USER_INFO.uid,
                            gift_id: gift_id,
                            ruid: CUTE_DATA[room_id].ROOM_INFO.ruid,
                            gift_num: gift_num,
                            coin_type: 'silver',
                            bag_id: bag_id,
                            platform: 'pc',
                            biz_code: 'live',
                            biz_id: CUTE_DATA[room_id].ROOM_INFO.room_id,
                            rnd: new Date().getTime(),
                            storm_beat_id: 0,
                            metadata: '',
                            price: 0,
                            csrf_token: CUTE_DATA.USER_INFO.token,
                            csrf: CUTE_DATA.USER_INFO.token
                        }
                    });
                },
                bag_list: () => {
                    return CUTE_API.ajax({
                        method: 'GET',
                        url: 'xlive/web-room/v1/gift/bag_list',
                        data: {
                            t: new Date().getTime()
                        }
                    });
                }
            }
        },
        room: {
            info: room_id => {
                return CUTE_API.ajax({
                    url: 'xlive/web-room/v1/index/getInfoByRoom',
                    async: false,
                    data: {
                        room_id: room_id
                    }
                });
            },
            guard: (page = 1, room_id, ruid) => {
                return CUTE_API.ajax({
                    url: 'xlive/app-room/v1/guardTab/topList',
                    // url: 'guard/topList',
                    data: {
                        page: page,
                        page_size: 30,
                        roomid: room_id,
                        ruid: ruid || CUTE_DATA[room_id].ROOM_INFO.ruid
                    }
                });
            },
            followers: room_id => {
                return CUTE_API.ajax({
                    url: '//api.bilibili.com/x/relation/followers',
                    data: {
                        vmid: CUTE_DATA[room_id].ROOM_INFO.ruid
                    }
                });
            },
            battle: (room_id, uid) => {
                return CUTE_API.ajax({
                    url: 'av/v1/Battle/anchorBattleRank',
                    data: {
                        roomid: room_id,
                        uid: uid
                    }
                });
            },
            block_user: {
                check: (room_id, page) => {
                    return CUTE_API.ajax({
                        url: 'liveact/ajaxGetBlockList',
                        data: {
                            roomid: CUTE_DATA[room_id].ROOM_INFO.room_id,
                            page: page
                        }
                    });
                },
                search: search => {
                    return CUTE_API.ajax({
                        url: 'banned_service/v2/Silent/search_user',
                        data: {
                            search: search
                        }
                    });
                },
                add: (room_id, block_uid, hour) => {
                    return CUTE_API.ajax({
                        method: 'POST',
                        url: 'banned_service/v2/Silent/add_block_user',
                        data: {
                            roomid: CUTE_DATA[room_id].ROOM_INFO.room_id,
                            block_uid: block_uid,
                            hour: hour,
                            csrf_token: CUTE_DATA.USER_INFO.token,
                            csrf: CUTE_DATA.USER_INFO.token
                        }
                    });
                    // 旧接口
                    // return CUTE_API.ajax({
                    //   method: 'POST',
                    //   url: 'liveact/room_block_user',
                    //   data: {
                    //     roomid: CUTE_DATA[room_id].ROOM_INFO.room_id,
                    //     method: 1,
                    //     content: block_user,
                    //     hour: hour,
                    //     csrf_token: CUTE_DATA.USER_INFO.token,
                    //     csrf: CUTE_DATA.USER_INFO.token
                    //   }
                    // });
                },
                del: (room_id, id) => {
                    return CUTE_API.ajax({
                        method: 'POST',
                        url: 'banned_service/v1/Silent/del_room_block_user',
                        data: {
                            id: id,
                            roomid: CUTE_DATA[room_id].ROOM_INFO.room_id,
                            csrf_token: CUTE_DATA.USER_INFO.token,
                            csrf: CUTE_DATA.USER_INFO.token
                        }
                    });
                },
                del_old: id => {
                    // 旧接口
                    return CUTE_API.ajax({
                        method: 'POST',
                        url: 'live_user/v1/RoomSilent/del',
                        data: {
                            uid: uid,
                            id: id,
                            csrf_token: CUTE_DATA.USER_INFO.token,
                            csrf: CUTE_DATA.USER_INFO.token
                        }
                    });
                }
            },
            silent: (room_id, minute, type, level) => {
                return CUTE_API.ajax({
                    method: 'POST',
                    url: 'liveact/room_silent',
                    data: {
                        minute: minute,
                        room_id: CUTE_DATA[room_id].ROOM_INFO.room_id,
                        type: type,
                        level: level,
                        csrf_token: CUTE_DATA.USER_INFO.token,
                        csrf: CUTE_DATA.USER_INFO.token
                    }
                });
            }
        }
    };
    // 功能模块
    let CUTE_MODULE = {
        // 配置初始化
        config: {
            init: room_id => {
                if (
                    Boolean(
                        localStorage.getItem(
                            `CUTE_CONFIG_${CUTE_DATA[room_id].ROOM_INFO
                                .room_id}`
                        )
                    )
                ) {
                    CUTE_CONFIG[room_id] = JSON.parse(
                        localStorage.getItem(
                            `CUTE_CONFIG_${CUTE_DATA[room_id].ROOM_INFO
                                .room_id}`
                        )
                    );
                    // let switch_name = ['gift', 'follow', 'ad', 'reply', 'ban', 'coin_type'];
                    let radios = $(`#${room_id} input[type="radio"]`);
                    // console.log(radios);
                    for (let i = 0; i < radios.length; i++) {
                        // console.log(radios[i].attr('name'));
                        let switch_name = radios.eq(i).attr('name');
                        radios.eq(i).attr('name', switch_name + room_id);
                        radios.eq(i).click(function() {
                            console.log(
                                `${$(this).attr('name')}：${$(this).val()}`
                            );
                            // console.log($(this).val());
                            CUTE_CONFIG[room_id].MODULE_SWITCH[
                                switch_name
                            ] = Number($(this).val());
                            localStorage.setItem(
                                `CUTE_CONFIG_${CUTE_DATA[room_id].ROOM_INFO
                                    .room_id}`,
                                JSON.stringify(CUTE_CONFIG[room_id])
                            );
                        });
                        if (
                            CUTE_CONFIG[room_id].MODULE_SWITCH[switch_name] ==
                            radios.eq(i).val()
                        ) {
                            // console.log(i);
                            radios.eq(i).prop('checked', true);
                        }
                    }
                } else {
                    CUTE_CONFIG[room_id] = {
                        AD: {
                            replyArr: [], // 自动广告列表
                            replySerial: 0, // 自动广告的发送位置
                            replyTime: 300 // 自动广告时间间隔
                        },
                        KEYWORD: {
                            replyArr: [],
                            replySerialArr: [], // 自动回复的发送位置
                            banArr: []
                        },
                        FOLLOWER: {
                            record: {
                                ts: undefined, // 上次记录时间
                                num: undefined // 上次记录关注数
                            }
                        },
                        IGNORELIST: [],
                        BLACKLIST: [],
                        MODULE_SWITCH: {
                            gift: 0,
                            follow: 0,
                            ad: 0,
                            reply: 0,
                            ban: 0,
                            coin_type: 'gold'
                        },
                        PERMISSION: {
                            author: 9999,
                            host: 5000,
                            admin: 1000,
                            guard: 200,
                            superfans: 100,
                            fans: 50,
                            normal: 10
                        }
                    };
                }

                // 获取循环广告列表
                CUTE_MODULE.ad.get(room_id);
                // 获取关键词自动回复列表
                CUTE_MODULE.keyword.reply.get(room_id);
                // 更新房间内舰队信息
                CUTE_MODULE.room.guard(1, room_id);
            },
            update: room_id => {
                localStorage.setItem(
                    `CUTE_CONFIG_${CUTE_DATA[room_id].ROOM_INFO.room_id}`,
                    JSON.stringify(CUTE_CONFIG[room_id])
                );
            }
        },

        user: {
            // 获取用户uid
            info: room_id => {
                return CUTE_API.user.info(room_id).then(res => {
                    if (res.code === 0) {
                        CUTE_DATA.USER_INFO.uid = res.data.info.uid;
                        CUTE_DATA.USER_INFO.uname = res.data.info.uname;
                        let color = res.data.property.danmu.color,
                            colorAttr =
                                '#' +
                                (Array(6).join(0) +
                                    Number(color).toString(16)).slice(-6);

                        $(`#${room_id} .set_color`).css(
                            'background-color',
                            colorAttr
                        );
                        console.log(
                            `%c当前登陆用户：${CUTE_DATA.USER_INFO.uname}（${CUTE_DATA
                                .USER_INFO.uid}）`,
                            `color: lightgreen`
                        );
                    }
                });
            }
        },
        room: {
            // 获取room基本信息
            info: (room_id, mode) => {
                return CUTE_API.room.info(room_id).then(res => {
                    if (res.code === 0) {
                        // 更新房间信息
                        CUTE_DATA[room_id].ROOM_INFO.room_id =
                            res.data.room_info.room_id;
                        CUTE_DATA[room_id].ROOM_INFO.short_id =
                            res.data.room_info.short_id ||
                            res.data.room_info.room_id;
                        CUTE_DATA[room_id].ROOM_INFO.ruid =
                            res.data.room_info.uid;
                        CUTE_DATA[room_id].ROOM_INFO.live_status =
                            res.data.room_info.live_status;
                        CUTE_DATA[room_id].ROOM_INFO.live_status_name =
                            res.data.room_info.live_status == 0
                                ? '未开播'
                                : res.data.room_info.live_status == 1
                                  ? '直播中'
                                  : '轮播中';
                        CUTE_DATA[room_id].ROOM_INFO.live_start_time =
                            res.data.room_info.live_start_time;
                        CUTE_DATA[room_id].ROOM_INFO.area_name =
                            res.data.room_info.area_name;
                        CUTE_DATA[room_id].ROOM_INFO.uname =
                            res.data.anchor_info.base_info.uname;
                        CUTE_DATA[room_id].MEDAL_INFO =
                            res.data.anchor_info.medal_info;

                        // 修改标签页标题
                        $(`#${room_id} .host_name`).text(
                            CUTE_DATA[room_id].ROOM_INFO.uname
                        );
                        $(`#${room_id} .room_area`).text(
                            CUTE_DATA[room_id].ROOM_INFO.area_name || '未选择分区'
                        );
                        $(`#${room_id} .room_status`).text(
                            CUTE_DATA[room_id].ROOM_INFO.live_status_name
                        );

                        // gift_recorder =
                        //   JSON.parse(
                        //     localStorage.getItem(`gift_${CUTE_DATA[room_id].ROOM_INFO.room_id}`)
                        //   ) || {};
                        if (mode === 'new') {
                            if (
                                CUTE_DATA[room_id].MEDAL_INFO &&
                                CUTE_DATA[room_id].MEDAL_INFO.medal_id
                            ) {
                                CUTE_MODULE.toast.success(
                                    `勋章${CUTE_DATA[room_id].MEDAL_INFO
                                        .medal_id}：${CUTE_DATA[room_id]
                                        .MEDAL_INFO
                                        .medal_name} \n粉丝团人数：${CUTE_DATA[
                                        room_id
                                    ].MEDAL_INFO.fansclub}`
                                );
                            }
                            console.log(
                                `%c主播：${CUTE_DATA[room_id].ROOM_INFO
                                    .uname}（${CUTE_DATA[room_id].ROOM_INFO
                                    .ruid}）, 直播间号：${CUTE_DATA[room_id].ROOM_INFO
                                    .room_id}`,
                                `color: lightgreen`
                            );

                            // 执行配置初始化
                            CUTE_MODULE.config.init(room_id);
                        }
                    }
                });
            },
            // 获取guard列表
            guard: (page, room_id) => {
                return CUTE_API.room.guard(page, room_id).then(res => {
                    if (res.code === 0) {
                        if (res.data.info.now == 1) {
                            CUTE_DATA[room_id].ROOM_INFO.guard_list = [];
                            let top3 = res.data.top3;
                            for (let i = 0; i < top3.length; i++) {
                                CUTE_DATA[room_id].ROOM_INFO.guard_list.push(
                                    top3[i].uid
                                );
                            }
                        }
                        let list = res.data.list;
                        for (let i = 0; i < list.length; i++) {
                            CUTE_DATA[room_id].ROOM_INFO.guard_list.push(
                                list[i].uid
                            );
                        }
                        if (res.data.info.now < res.data.info.page) {
                            CUTE_MODULE.room.guard(
                                res.data.info.now + 1,
                                room_id
                            );
                        } else {
                            setTimeout(() => {
                                if (
                                    res.data.info.num ==
                                    CUTE_DATA[room_id].ROOM_INFO.guard_list
                                        .length
                                ) {
                                    CUTE_MODULE.toast.success(
                                        `本房间舰长数：${CUTE_DATA[room_id].ROOM_INFO
                                            .guard_list.length}`
                                    );
                                } else {
                                    CUTE_MODULE.toast.failed(`舰队数据获取有误，请刷新重试`);
                                }
                            }, 1e3);
                        }
                    }
                });
            },
            // 获取关注人数
            follower: {
                now: room_id => {
                    return CUTE_API.room.info(room_id).then(res => {
                        if (res.code === 0) {
                            // console.log(`请求成功`);
                            let record = {
                                ts: CUTE_CONFIG[room_id].FOLLOWER.record.ts,
                                follower:
                                    CUTE_CONFIG[room_id].FOLLOWER.record.num
                            };
                            let now = {
                                ts: new Date().setHours(0, 0, 0, 0),
                                follower:
                                    res.data.anchor_info.relation_info
                                        .attention,
                                live_status: res.data.room_info.live_status,
                                online: res.data.room_info.online
                            };
                            let change;
                            let online;

                            if (record.ts >= now.ts) {
                                // 记录时间是今天
                                if (now.follower >= record.follower) {
                                    change = `(${now.follower -
                                        record.follower}↑)`;
                                } else {
                                    change = `(${record.follower -
                                        now.follower}↓)`;
                                }
                            }
                            if (now.live_status != 1) {
                                online = `，未开播`;
                            } else {
                                online = `，气人值${res.data.room_info.online}`;
                            }
                            return CUTE_MODULE.danmaku.queue_add(
                                `当前粉丝数${now.follower}${change || ''}${online}`,
                                room_id
                            );
                        }
                    });
                },
                latest: room_id => {
                    if (!CUTE_CONFIG[room_id].MODULE_SWITCH.follow) {
                        return;
                    }
                    return CUTE_API.room.followers(room_id).then(res => {
                        if (res.code === 0) {
                            let list = res.data.list;
                            let latest =
                                CUTE_DATA[room_id].ROOM_INFO.follower.latest;
                            let repeat =
                                CUTE_DATA[room_id].ROOM_INFO.follower.repeat;
                            let num;

                            if (latest.ts >= list[0].mtime) {
                                // console.log("没有新的关注");
                                return;
                            } else {
                                let follower_new = {
                                    uid: list[0].mid,
                                    name: list[0].uname
                                };
                                if (latest.ts) {
                                    if (!repeat[follower_new.name]) {
                                        for (let i = 0; i < list.length; i++) {
                                            if (latest.ts < list[i].mtime) {
                                                // 未记录的用户加入重复关注监控列表
                                                if (!repeat[list[i].uname]) {
                                                    repeat[list[i].uname] = 1;
                                                }
                                                // 新关注的用户有2人时的处理
                                                if (i == 1) {
                                                    follower_new.name +=
                                                        '，' + list[i].uname;
                                                }
                                            } else {
                                                // 新关注的用户高于3人时，会在下一个循环进入这个条件，所以i取3，之后循环获取到的都会是老关注，所以break
                                                if (i >= 3) {
                                                    num = i;
                                                }
                                                break;
                                            }
                                        }
                                        if (num >= 3) {
                                            switch (room_id) {
                                                case '21707611':
                                                    CUTE_MODULE.danmaku.queue_add(
                                                        `叮咚(๑•ω•๑)恭喜 ${follower_new.name} 等${num}个小伙伴收获宝藏女孩一只~`,
                                                        room_id
                                                    );
                                                    break;
                                                default:
                                                    CUTE_MODULE.danmaku.queue_add(
                                                        `能被@${follower_new.name} 等${num}位大佬关注真是太好了~♡`,
                                                        room_id
                                                    );
                                                    break;
                                            }
                                        } else {
                                            switch (room_id) {
                                                case '21707611':
                                                    CUTE_MODULE.danmaku.queue_add(
                                                        `叮咚(๑•ω•๑)恭喜 ${follower_new.name} 收获宝藏女孩一只~`,
                                                        room_id
                                                    );
                                                    break;
                                                default:
                                                    CUTE_MODULE.danmaku.queue_add(
                                                        `能被@${follower_new.name} 关注真是太好了~♡`,
                                                        room_id
                                                    );
                                                    break;
                                            }
                                        }
                                    }
                                    // switch (repeat[follower_new.name]) {
                                    //     case 1:
                                    //         CUTE_MODULE.danmaku.queue_add(
                                    //             `${follower_new.name} 你为什么又点了一次关注|･ω･｀)`,
                                    //             room_id
                                    //         );
                                    //         repeat[follower_new.name]++;
                                    //         break;

                                    //     case 2:
                                    //         CUTE_MODULE.danmaku.queue_add(
                                    //             `${follower_new.name} 再玩一次你就没了|･ω･｀)`,
                                    //             room_id
                                    //         );
                                    //         repeat[follower_new.name]++;
                                    //         break;

                                    //     case 3:
                                    //         repeat[follower_new.name]++;
                                    //         CUTE_MODULE.block.add(
                                    //             follower_new.uid,
                                    //             1,
                                    //             'follow'
                                    //         );
                                    //         break;

                                    //     case 4:
                                    //         console.log('重复关注过多，不搭理这个人');
                                    //         break;

                                    //     default:
                                    //         for (
                                    //             let i = 0;
                                    //             i < list.length;
                                    //             i++
                                    //         ) {
                                    //             if (latest.ts < list[i].mtime) {
                                    //                 // 未记录的用户加入重复关注监控列表
                                    //                 if (
                                    //                     !repeat[list[i].uname]
                                    //                 ) {
                                    //                     repeat[
                                    //                         list[i].uname
                                    //                     ] = 1;
                                    //                 }
                                    //                 // 新关注的用户有2人时的处理
                                    //                 if (i == 1) {
                                    //                     follower_new.name +=
                                    //                         '，' + list[i].uname;
                                    //                 }
                                    //             } else {
                                    //                 // 新关注的用户高于3人时，会在下一个循环进入这个条件，所以i取3，之后循环获取到的都会是老关注，所以break
                                    //                 if (i >= 3) {
                                    //                     num = i;
                                    //                 }
                                    //                 break;
                                    //             }
                                    //         }
                                    //         if (num >= 3) {
                                    //             switch (CUTE_DATA[room_id]
                                    //                 .ROOM_INFO.entry_id) {
                                    //                 case '21707611':
                                    //                     CUTE_MODULE.danmaku.queue_add(
                                    //                         `叮咚(๑•ω•๑)恭喜 ${follower_new.name} 等${num}个小伙伴收获宝藏女孩一只~`,
                                    //                         room_id
                                    //                     );
                                    //                     break;
                                    //                 default:
                                    //                     CUTE_MODULE.danmaku.queue_add(
                                    //                         `能被@${follower_new.name} 等${num}位大佬关注真是太好了~♡`,
                                    //                         room_id
                                    //                     );
                                    //                     break;
                                    //             }
                                    //         } else {
                                    //             switch (CUTE_DATA[room_id]
                                    //                 .ROOM_INFO.entry_id) {
                                    //                 case '21707611':
                                    //                     CUTE_MODULE.danmaku.queue_add(
                                    //                         `叮咚(๑•ω•๑)恭喜 ${follower_new.name} 收获宝藏女孩一只~`,
                                    //                         room_id
                                    //                     );
                                    //                     break;
                                    //                 default:
                                    //                     CUTE_MODULE.danmaku.queue_add(
                                    //                         `能被@${follower_new.name} 关注真是太好了~♡`,
                                    //                         room_id
                                    //                     );
                                    //                     break;
                                    //             }
                                    //         }
                                    //         break;
                                    // }
                                }
                                latest.ts = list[0].mtime;
                                latest.name = list[0].uname;
                                console.log(
                                    `最新关注（${room_id}）：${latest.name}`,
                                    CUTE_MODULE.tsFormatter(latest.ts)
                                );
                            }
                        }
                    });
                },
                record: (room_id, param) => {
                    return CUTE_API.room.info(room_id).then(res => {
                        if (res.code === 0) {
                            CUTE_CONFIG[room_id].FOLLOWER = {
                                record: {
                                    ts: new Date().getTime(),
                                    num:
                                        res.data.anchor_info.relation_info
                                            .attention
                                }
                            };
                            CUTE_MODULE.config.update(room_id);
                            if (param == 'reply') {
                                CUTE_MODULE.danmaku.queue_add(
                                    `当前粉丝数为${CUTE_CONFIG[room_id].FOLLOWER
                                        .record.num}，已记录`,
                                    room_id
                                );
                            }
                        }
                    });
                }
            }
        },

        // 弹幕发送及配置
        danmaku: {
            list: [],
            to_be_sent: [],
            last_msg: undefined,
            color: (e, room_id) => {
                let color = e.target.attributes.color.value,
                    colorAttr =
                        '#' +
                        (Array(6).join(0) + Number(color).toString(16)).slice(
                            -6
                        ),
                    colorhex = '0x' + Number(color).toString(16);
                //			console.log($(this)[0].outerHTML);
                return CUTE_API.user.send.config(colorhex, room_id).then(
                    res => {
                        if (res.code === 0) {
                            $(`#${room_id} .set_color`).css(
                                'background-color',
                                colorAttr
                            );
                            CUTE_MODULE.toast.success(`设置成功~`);
                        } else {
                            CUTE_MODULE.toast.failed(`${res.message}`);
                        }
                    },
                    err => {
                        console.log(`%c网络错误：`, `${err}`, 'color: #f8878d;');
                    }
                );
            },
            show: (msg, room_id) => {
                try {
                    let guard = '',
                        admin = '',
                        medal = '',
                        user_level = `<div class="user-level-icon lv-${msg.user_level} dp-i-block p-relative v-middle">
                        UL ${msg.user_level}
                    </div>`,
                        user_name = `<span class="v-middle level-${msg.medal_level ==
                        0
                            ? 'none'
                            : msg.medal_level}" title="${msg.uid}">
                        <span class="u-name">
                        ${msg.name}
                        </span>
                    </span>`;

                    if (msg.guard) {
                        guard = `<i class="guard-icon dp-i-block v-middle bg-center bg-no-repeat guard-level-${msg.guard}"></i>`;
                    }
                    if (msg.admin) {
                        admin = `<div class="admin-icon dp-i-block p-relative v-middle" title="这是位大人物 (=・ω・=)"></div>`;
                    }
                    if (msg.medal_level > 0) {
                        // console.log(msg.medal_level);
                        medal = `<div class="v-middle fans-medal-item level-${msg.medal_level ||
                            0}">
                        <span class="label">
                            ${msg.medal_name}
                        </span>
                        <span class="level">
                            ${msg.medal_level}
                        </span>
                    </div>`;
                    }
                    let ts = new Date().getTime();
                    let danmuSender = `<div class="v-middle nowrap">
                    ${guard}
                    ${admin}
                    ${medal}
                    ${user_level}
                    ${user_name}：
                </div>`,
                        danmuContent = `<div class="danmuContent btn-group nowrap c-flex c-align-center">
                    <div style="margin-right: 4px; color: #${msg.color.toString(
                        16
                    )}">${msg.text}</div>
                    <button class="repeat${ts}">复读</button>
                    <button class="ban${ts}">封禁</button>
                </div>`;
                    let danmuItem = `<div class="danmu-item c-flex c-align-center nowrap">${danmuSender}${danmuContent}</div>`;
                    // console.log(
                    //     `%c${msg.name}：${msg.text}`,
                    //     'color: lightgreen;'
                    // );
                    // 控制弹幕输出数量为100以内
                    if (
                        $(`#${room_id} .danmu_container`).children().length >=
                        100
                    ) {
                        $(`#${room_id} .danmu_container`)
                            .children(`:lt(50)`)
                            .remove();
                    }
                    // 输出新弹幕
                    $(`#${room_id} .danmu_container`).append(`
                            ${danmuItem}
                            `);
                    // 功能绑定
                    $(`#${room_id} .repeat${ts}`).on('click', e => {
                        return CUTE_MODULE.danmaku.queue_add(msg.text, room_id);
                    });
                    $(`#${room_id} .ban${ts}`).on('click', e => {
                        return CUTE_MODULE.block.add(room_id, msg.uid, 720);
                    });
                    // 弹幕池滚动
                    let scrollHeight = $(`#${room_id} .danmu_container`).prop(
                        'scrollHeight'
                    );
                    $(`#${room_id} .danmu_container`).scrollTop(scrollHeight);
                } catch (err) {
                    console.log(err);
                }
            },
            admin: (msg, room_id) => {
                let keyword = ['拉黑', '权限', '记录粉丝数', '存活测试', '私信功能测试'];
                for (let i = 0; i < keyword.length; i++) {
                    if (msg.text.indexOf(keyword[i]) == 7) {
                        switch (keyword[i]) {
                            case '拉黑':
                                CUTE_API.room.block_user
                                    .search(msg.text.split('=')[1])
                                    .then(res => {
                                        if (res.code === 0) {
                                            let block_uid =
                                                res.data.items[0].uid;
                                            let block_uname =
                                                res.data.items[0].uname;
                                            if (
                                                CUTE_CONFIG[
                                                    room_id
                                                ].IGNORELIST.indexOf(
                                                    block_uid
                                                ) == -1
                                            ) {
                                                CUTE_CONFIG[
                                                    room_id
                                                ].IGNORELIST.push(block_uid);
                                                CUTE_MODULE.config.update(
                                                    room_id
                                                );
                                                CUTE_MODULE.danmaku.queue_add(
                                                    `用户 ${block_uname} 已被本机加入无视列表|･ω･｀)`,
                                                    room_id
                                                );
                                            } else {
                                                CUTE_MODULE.danmaku.queue_add(
                                                    `该用户已经凉了，无需重复添加|･ω･｀)`,
                                                    room_id
                                                );
                                            }
                                        } else {
                                            console.log(res.msg);
                                        }
                                    });
                                break;
                            case '记录粉丝数':
                                CUTE_MODULE.room.follower.record(
                                    room_id,
                                    'reply'
                                );
                                break;
                            case '存活测试':
                                CUTE_MODULE.danmaku.queue_add(
                                    `确认存活！本机正常工作中( ˘•ω•˘ )`,
                                    room_id
                                );
                                break;
                            case '私信功能测试':
                                CUTE_MODULE.whisper(
                                    msg.uid,
                                    msg.name,
                                    `{"content":"[${CUTE_MODULE.tsFormatter(
                                        new Date() / 1000
                                    )}] 来自直播间${room_id}的私信发送测试|･ω･｀)"}`,
                                    room_id
                                );
                                break;

                            default:
                                CUTE_MODULE.danmaku.queue_add(
                                    `没这个指令喔，你这个小笨笨|･ω･｀)`,
                                    room_id
                                );
                                break;
                        }
                        return;
                    }
                }
                return CUTE_MODULE.danmaku.queue_add(
                    `没这个指令喔，你这个小笨笨|･ω･｀)`,
                    room_id
                );
            },
            command: (msg, room_id) => {
                // console.log(`command`);
                let keyword = [
                    '全部功能',
                    '礼物',
                    '关注',
                    '循环公告',
                    '回复',
                    '封禁',
                    '高阶魔法',
                    '复读',
                    '休眠',
                    '唤醒',
                    '关机',
                    '重连',
                    // '重启',
                    '查询粉丝数'
                ];
                for (let i = 0; i < keyword.length; i++) {
                    if (msg.text.indexOf(keyword[i]) == 4) {
                        // console.log(`指令：${keyword[i]}`);
                        let param, param1, param2;
                        try {
                            if (~msg.text.indexOf('=')) {
                                param = msg.text.split('=')[1].split(',');
                                param1 = param[0];
                                param2 = param[1];
                            }
                        } catch (err) {
                            console.log(err);
                        }

                        switch (keyword[i]) {
                            case '全部功能':
                                switch (param1) {
                                    case '0':
                                        CUTE_CONFIG[
                                            room_id
                                        ].MODULE_SWITCH.gift = 0;
                                        CUTE_CONFIG[
                                            room_id
                                        ].MODULE_SWITCH.follow = 0;
                                        CUTE_CONFIG[
                                            room_id
                                        ].MODULE_SWITCH.ad = 0;
                                        CUTE_CONFIG[
                                            room_id
                                        ].MODULE_SWITCH.reply = 0;
                                        CUTE_MODULE.danmaku.queue_add(
                                            `全部功能 -> 关闭`,
                                            room_id
                                        );
                                        break;
                                    case '1':
                                        CUTE_CONFIG[
                                            room_id
                                        ].MODULE_SWITCH.gift = 1;
                                        CUTE_CONFIG[
                                            room_id
                                        ].MODULE_SWITCH.follow = 1;
                                        CUTE_CONFIG[
                                            room_id
                                        ].MODULE_SWITCH.ad = 1;
                                        CUTE_CONFIG[
                                            room_id
                                        ].MODULE_SWITCH.reply = 1;
                                        CUTE_MODULE.danmaku.queue_add(
                                            `全部功能 -> 开启`,
                                            room_id
                                        );
                                        break;
                                }
                                break;
                            case '礼物':
                                switch (param1) {
                                    case '0':
                                        CUTE_CONFIG[
                                            room_id
                                        ].MODULE_SWITCH.gift = 0;
                                        CUTE_MODULE.danmaku.queue_add(
                                            `感谢礼物 -> 关闭`,
                                            room_id
                                        );
                                        break;
                                    case '1':
                                        CUTE_CONFIG[
                                            room_id
                                        ].MODULE_SWITCH.coin_type =
                                            'gold';
                                        CUTE_CONFIG[
                                            room_id
                                        ].MODULE_SWITCH.gift = 1;
                                        CUTE_MODULE.danmaku.queue_add(
                                            `感谢金瓜子礼物 -> 开启`,
                                            room_id
                                        );
                                        break;
                                    case '2':
                                        CUTE_CONFIG[
                                            room_id
                                        ].MODULE_SWITCH.coin_type = undefined;
                                        CUTE_CONFIG[
                                            room_id
                                        ].MODULE_SWITCH.gift = 2;
                                        CUTE_MODULE.danmaku.queue_add(
                                            `感谢所有礼物 -> 开启`,
                                            room_id
                                        );
                                        break;
                                }
                                break;
                            case '关注':
                                switch (param1) {
                                    case '0':
                                        CUTE_CONFIG[
                                            room_id
                                        ].MODULE_SWITCH.follow = 0;
                                        CUTE_MODULE.danmaku.queue_add(
                                            `感谢关注 -> 关闭`,
                                            room_id
                                        );
                                        break;
                                    case '1':
                                        CUTE_MODULE.danmaku.queue_add(
                                            `感谢关注 -> 开启`,
                                            room_id
                                        );
                                        CUTE_CONFIG[
                                            room_id
                                        ].MODULE_SWITCH.follow = 1;
                                        break;
                                }
                                break;
                            case '循环公告':
                                switch (param1) {
                                    case '0':
                                        CUTE_CONFIG[
                                            room_id
                                        ].MODULE_SWITCH.ad = 0;
                                        CUTE_MODULE.danmaku.queue_add(
                                            `循环公告 -> 关闭`,
                                            room_id
                                        );
                                        break;
                                    case '1':
                                        CUTE_CONFIG[
                                            room_id
                                        ].MODULE_SWITCH.ad = 1;
                                        CUTE_MODULE.danmaku.queue_add(
                                            `循环公告 -> 开启`,
                                            room_id
                                        );
                                        break;
                                }
                                break;
                            case '回复':
                                switch (param1) {
                                    case '0':
                                        CUTE_CONFIG[
                                            room_id
                                        ].MODULE_SWITCH.reply = 0;
                                        CUTE_MODULE.danmaku.queue_add(
                                            `关键词回复 -> 关闭`,
                                            room_id
                                        );
                                        break;
                                    case '1':
                                        CUTE_CONFIG[
                                            room_id
                                        ].MODULE_SWITCH.reply = 1;
                                        CUTE_MODULE.danmaku.queue_add(
                                            `关键词回复 -> 开启`,
                                            room_id
                                        );
                                        break;
                                }
                                break;
                            case '封禁':
                                break;
                            case '高阶魔法':
                                var minute = 3,
                                    type = 'level',
                                    level = 1;

                                if (~msg.text.indexOf('解除')) {
                                    minute = 3;
                                    type = 'off';
                                    level = 1;
                                } else if (param) {
                                    for (let i = 0; i < param.length; i++) {
                                        if (
                                            msg.text
                                                .split('=')
                                                [i].indexOf('分') != -1
                                        ) {
                                            if (param[i].split('分')[0] == 0) {
                                                minute = 0;
                                            } else if (
                                                param[i].split('分')[0] <= 3
                                            ) {
                                                minute = 3;
                                            } else if (
                                                param[i].split('分')[0] <= 10
                                            ) {
                                                minute = 10;
                                            } else if (
                                                param[i].split('分')[0] <= 30
                                            ) {
                                                minute = 30;
                                            } else {
                                                minute = 0;
                                            }
                                        }
                                        if (param[i].indexOf('等级') != -1) {
                                            type = 'level';
                                            if (
                                                param[i].split('等级')[1] >= 1 &&
                                                param[i].split('等级')[1] <= 60
                                            ) {
                                                level = param[i].split('等级')[1];
                                            } else {
                                                level = 1;
                                            }
                                        } else if (
                                            param[i].indexOf('勋章') != -1
                                        ) {
                                            type = 'medal';
                                            if (
                                                param[i].split('勋章')[1] >= 1 &&
                                                param[i].split('勋章')[1] <= 20
                                            ) {
                                                level = param[i].split('勋章')[1];
                                            } else {
                                                level = 1;
                                            }
                                        } else if (
                                            param[i].indexOf('全员') != -1
                                        ) {
                                            type = 'member';
                                            level = 1;
                                        }
                                    }
                                }
                                console.log(CUTE_MODULE.room);
                                // 启动范围魔法
                                CUTE_API.room
                                    .silent(room_id, minute, type, level)
                                    .then(res => {
                                        if (res.msg) {
                                            CUTE_MODULE.danmaku.queue_add(
                                                `高阶魔法启动失败：${res.msg}`,
                                                room_id
                                            );
                                        } else {
                                            if (type == 'off') {
                                                CUTE_MODULE.danmaku.queue_add(
                                                    `高阶魔法已解除(=・ω・=)`,
                                                    room_id
                                                );
                                            } else {
                                                CUTE_MODULE.danmaku.queue_add(
                                                    `成功启动高阶范围魔法打击！${minute}分钟后解除`,
                                                    room_id
                                                );
                                            }
                                        }
                                    });
                                break;
                            case '复读':
                                switch (param1) {
                                    case '0':
                                        CUTE_CONFIG[
                                            room_id
                                        ].MODULE_SWITCH.repeat = 0;
                                        CUTE_MODULE.danmaku.queue_add(
                                            `复读机 -> 关闭`,
                                            room_id
                                        );
                                        break;
                                    case '1':
                                        CUTE_CONFIG[
                                            room_id
                                        ].MODULE_SWITCH.repeat = 1;
                                        CUTE_MODULE.danmaku.queue_add(
                                            `限制型复读机 -> 开启`,
                                            room_id
                                        );
                                        break;
                                    case '2':
                                        CUTE_CONFIG[
                                            room_id
                                        ].MODULE_SWITCH.repeat = 2;
                                        CUTE_MODULE.danmaku.queue_add(
                                            `全员型复读机 -> 开启`,
                                            room_id
                                        );
                                        break;
                                    default:
                                        CUTE_CONFIG[
                                            room_id
                                        ].MODULE_SWITCH.repeat = 2;
                                        $(`#${room_id} .repeat_user`).val(
                                            param1
                                        );
                                        CUTE_DATA[room_id].repeat_user = param1;
                                        CUTE_MODULE.danmaku.queue_add(
                                            `复读${param1} -> 开启`,
                                            room_id
                                        );
                                        break;
                                }
                                break;
                            case '唤醒':
                                CUTE_ROBOT.connect.init(room_id, 'common');
                                CUTE_MODULE.danmaku.queue_add(
                                    `你这个居居为什么要叫醒我( ˘•ω•˘ )`,
                                    room_id
                                );
                                break;
                            case '关机':
                                CUTE_ROBOT.disconnect(room_id);
                                CUTE_MODULE.danmaku.queue_add(
                                    `啊我死了，下个ID见|･ω･｀)`,
                                    room_id
                                );
                                break;
                            case '休眠':
                                // todo
                                CUTE_ROBOT.connect.init(room_id, 'sleep');
                                CUTE_MODULE.danmaku.queue_add(
                                    `啊我睡了，谁吵醒我谁是居|･ω･｀)`,
                                    room_id
                                );
                                break;
                            case '重连':
                                // $('.connect_full').click();
                                CUTE_ROBOT.connect.init(room_id, 'auto');
                                CUTE_MODULE.danmaku.queue_add(
                                    `知道了啦，本机将重新接入|･ω･｀)`,
                                    room_id
                                );
                                break;
                            // case '重启':
                            //     // $('.connect_full').click();
                            //     CUTE_MODULE.danmaku.queue_add(
                            //         `知道了啦，本机将重新运行|･ω･｀)`,
                            //         room_id
                            //     );
                            //     if (!CUTE_MODULE.getUrlParam('reconnect')) {
                            //         location.href = `${window.location
                            //             .href}?reconnect=1`;
                            //     } else {
                            //         window.location.reload(true);
                            //     }
                            //     break;
                            case '查询粉丝数':
                                CUTE_MODULE.room.follower.now(room_id);
                                break;
                            default:
                                CUTE_MODULE.danmaku.queue_add(
                                    `没这个指令喔，你这个小笨笨|･ω･｀)`,
                                    room_id
                                );
                                break;
                        }
                        CUTE_MODULE.config.update(room_id);
                        return;
                    }
                }
                return CUTE_MODULE.danmaku.queue_add(
                    `没这个指令喔，你这个小笨笨|･ω･｀)`,
                    room_id
                );
            },
            cute: (msg, room_id, permission) => {
                let keyword = [
                    '添词',
                    '删词',
                    '制裁',
                    '捞人',
                    '弹幕颜色',
                    '召唤',
                    'roll点',
                    '抽个舰长',
                    '送个辣条',
                    '催下播',
                    '求求萌萌兽把我从小黑屋里放出来吧'
                ];
                for (let i = 0; i < keyword.length; i++) {
                    if (msg.text.indexOf(keyword[i]) == 4) {
                        // console.log(`指令：${keyword[i]}`);
                        let param, param1, param2;
                        try {
                            if (~msg.text.indexOf('=')) {
                                param = msg.text.split('=')[1].split(',');
                                param1 = param[0];
                                param2 = param[1];
                            }
                        } catch (err) {
                            console.log(err);
                        }
                        switch (keyword[i]) {
                            case '添词':
                                if (
                                    permission >=
                                    CUTE_CONFIG[room_id].PERMISSION.normal
                                ) {
                                    CUTE_MODULE.keyword.reply.add(room_id, msg);
                                } else {
                                    return CUTE_MODULE.danmaku.queue_add(
                                        `拒绝执行！你的权限：${permission}，需要：${CUTE_CONFIG[
                                            room_id
                                        ].PERMISSION.normal} |･ω･｀)`,
                                        room_id
                                    );
                                }
                                break;
                            case '删词':
                                if (
                                    permission >=
                                    CUTE_CONFIG[room_id].PERMISSION.superfans
                                ) {
                                    CUTE_MODULE.keyword.reply.delByDanmaku(
                                        msg,
                                        room_id
                                    );
                                } else {
                                    return CUTE_MODULE.danmaku.queue_add(
                                        `拒绝执行！你的权限：${permission}，需要：${CUTE_CONFIG[
                                            room_id
                                        ].PERMISSION.superfans} |･ω･｀)`,
                                        room_id
                                    );
                                }
                                break;
                            case '制裁':
                                var block_user = param1;
                                var hour = param2 || 1;
                                if (
                                    block_user == '193351' ||
                                    block_user.indexOf('萌萌兽') != -1
                                ) {
                                    if (msg.admin == 1) {
                                        return CUTE_MODULE.danmaku.queue_add(
                                            `小老弟，请收起你的骚操作，制裁不了的( ˘•ω•˘ )`,
                                            room_id
                                        );
                                    } else {
                                        CUTE_MODULE.block.add(
                                            room_id,
                                            msg.uid,
                                            hour,
                                            'reflect'
                                        );
                                    }
                                } else if (
                                    block_user == '我自己' ||
                                    block_user == '我'
                                ) {
                                    if (msg.admin == 1) {
                                        return CUTE_MODULE.danmaku.queue_add(
                                            `小老弟，请收起你的骚操作，制裁不了的( ˘•ω•˘ )`,
                                            room_id
                                        );
                                    } else {
                                        CUTE_MODULE.block.add(
                                            room_id,
                                            msg.uid,
                                            hour,
                                            'self'
                                        );
                                    }
                                } else if (permission >= 170) {
                                    hour = param2 || 720;
                                    return CUTE_MODULE.block.search(
                                        block_user,
                                        hour,
                                        'execute'
                                    );
                                } else {
                                    return CUTE_MODULE.danmaku.queue_add(
                                        `拒绝执行！你的权限：${permission}，需要：170 |･ω･｀)`,
                                        room_id
                                    );
                                }
                                break;
                            case '捞人':
                                if (permission >= 170) {
                                    let block_user = msg.text.split('=')[1];
                                    CUTE_MODULE.block.del(room_id, block_user);
                                } else {
                                    return CUTE_MODULE.danmaku.queue_add(
                                        `拒绝执行！你的权限：${permission}，需要：170 |･ω･｀)`,
                                        room_id
                                    );
                                }
                                break;
                            case '弹幕颜色':
                                if (
                                    permission >=
                                    CUTE_CONFIG[room_id].PERMISSION.fans
                                ) {
                                    var colorhex;
                                    switch (param1) {
                                        case '红':
                                            colorhex = '0xff6868';
                                            break;
                                        case '蓝':
                                            colorhex = '0x66ccff';
                                            break;
                                        case '黄':
                                            colorhex = '0xffed4f';
                                            break;
                                        case '绿':
                                            colorhex = '0x7eff00';
                                            break;
                                        case '橙':
                                            colorhex = '0xff9800';
                                            break;
                                        case '紫':
                                            colorhex = '0xe33fff';
                                            break;
                                        case '白':
                                            colorhex = '0xffffff';
                                            break;
                                        default:
                                            return;
                                    }
                                    CUTE_API.user.send
                                        .config(colorhex, room_id)
                                        .then(res => {
                                            if (res.code === 0) {
                                                CUTE_MODULE.danmaku.queue_add(
                                                    `设置成功！我${param1}了( ˘•ω•˘ )`,
                                                    room_id
                                                );
                                            } else {
                                                CUTE_MODULE.danmaku.queue_add(
                                                    `${res.message}(๑•́ ₃ •̀๑)`,
                                                    room_id
                                                );
                                            }
                                        });
                                } else {
                                    return CUTE_MODULE.danmaku.queue_add(
                                        `拒绝执行！你的权限：${permission}，需要：${CUTE_CONFIG[
                                            room_id
                                        ].PERMISSION.fans} |･ω･｀)`,
                                        room_id
                                    );
                                }
                                break;
                            case '召唤':
                                if (
                                    permission >=
                                    CUTE_CONFIG[room_id].PERMISSION.host
                                ) {
                                    CUTE_MODULE.danmaku.queue_add(
                                        `召唤中……请等待响应( ˘•ω•˘ )`,
                                        room_id
                                    );
                                    if (
                                        window.Notification &&
                                        Notification.permission !== 'denied'
                                    ) {
                                        Notification.requestPermission(function(
                                            status
                                        ) {
                                            let isClick;
                                            var notification = new Notification(
                                                '受到召唤',
                                                {
                                                    body:
                                                        CUTE_MODULE.tsFormatter(
                                                            new Date() / 1000
                                                        ) +
                                                        ' ' +
                                                        CUTE_DATA[room_id]
                                                            .ROOM_INFO.uname +
                                                        '的直播间发起了一个召唤'
                                                }
                                            );
                                            notification.onclick = function() {
                                                isClick = 1;
                                                return CUTE_MODULE.danmaku.queue_add(
                                                    `${msg.name}以为萌萌兽不在？太天真了！`,
                                                    room_id
                                                );
                                                // window.open(
                                                //     "https://live.bilibili.com/" + CUTE_DATA[room_id].ROOM_INFO.short_id
                                                // );
                                            };
                                            setTimeout(() => {
                                                if (!isClick) {
                                                    return CUTE_MODULE.danmaku.queue_add(
                                                        `好的吧，萌萌兽真的不在，你召唤也没用`,
                                                        room_id
                                                    );
                                                }
                                            }, 8e3);
                                        });
                                    }
                                } else {
                                    return CUTE_MODULE.danmaku.queue_add(
                                        `拒绝执行！你的权限：${permission}，需要：${CUTE_CONFIG[
                                            room_id
                                        ].PERMISSION.host} |･ω･｀)`,
                                        room_id
                                    );
                                }
                                break;
                            case 'roll点':
                                if (permission >= 1) {
                                    CUTE_MODULE.roll(msg, room_id);
                                } else {
                                    return CUTE_MODULE.danmaku.queue_add(
                                        `拒绝执行！你的权限：${permission}，需要：1 |･ω･｀)`,
                                        room_id
                                    );
                                }
                                break;
                            case '抽个舰长':
                                if (
                                    permission >=
                                    CUTE_CONFIG[room_id].PERMISSION.guard
                                ) {
                                    CUTE_MODULE.raffle(msg, room_id);
                                } else {
                                    return CUTE_MODULE.danmaku.queue_add(
                                        `拒绝执行！你的权限：${permission}，需要：${CUTE_CONFIG[
                                            room_id
                                        ].PERMISSION.guard} |･ω･｀)`,
                                        room_id
                                    );
                                }
                                break;
                            case '送个辣条':
                                if (
                                    permission >=
                                    CUTE_CONFIG[room_id].PERMISSION.guard
                                ) {
                                    CUTE_MODULE.gift.send_bag(msg, room_id);
                                } else {
                                    return CUTE_MODULE.danmaku.queue_add(
                                        `拒绝执行！你的权限：${permission}，需要：${CUTE_CONFIG[
                                            room_id
                                        ].PERMISSION.guard} |･ω･｀)`,
                                        room_id
                                    );
                                }
                                break;
                            case '催下播':
                                if (
                                    permission >=
                                    CUTE_CONFIG[room_id].PERMISSION.guard
                                ) {
                                    if (
                                        CUTE_DATA[room_id].ROOM_INFO
                                            .live_status == 1
                                    ) {
                                        CUTE_MODULE.clock(room_id, 'command');
                                    } else {
                                        return CUTE_MODULE.danmaku.queue_add(
                                            `没有开播呢，催什么催！ |･ω･｀)`,
                                            room_id
                                        );
                                    }
                                } else {
                                    return CUTE_MODULE.danmaku.queue_add(
                                        `拒绝执行！你的权限：${permission}，需要：${CUTE_CONFIG[
                                            room_id
                                        ].PERMISSION.guard} |･ω･｀)`,
                                        room_id
                                    );
                                }
                                break;
                            case '求求萌萌兽把我从小黑屋里放出来吧':
                                if (permission >= 1) {
                                    let block_index = CUTE_CONFIG[
                                        room_id
                                    ].IGNORELIST.indexOf(msg.uid);
                                    // console.log(`block_index: ${block_index}`);
                                    if (block_index != -1) {
                                        CUTE_CONFIG[room_id].IGNORELIST.splice(
                                            block_index,
                                            1
                                        );
                                        CUTE_MODULE.config.update(room_id);
                                        CUTE_MODULE.danmaku.queue_add(
                                            `${msg.name} 已被本机大发慈悲地赦免了|･ω･｀)`,
                                            room_id
                                        );
                                    } else {
                                        CUTE_MODULE.danmaku.queue_add(
                                            `求本机干啥，本机没拉黑你呀|･ω･｀)`,
                                            room_id
                                        );
                                    }
                                } else {
                                    return CUTE_MODULE.danmaku.queue_add(
                                        `拒绝执行！你的权限：${permission}，需要：1 |･ω･｀)`,
                                        room_id
                                    );
                                }
                                break;
                            default:
                                CUTE_MODULE.danmaku.queue_add(
                                    `没这个指令喔，你这个小笨笨|･ω･｀)`,
                                    room_id
                                );
                                break;
                        }
                        return;
                    }
                }
                return CUTE_MODULE.danmaku.queue_add(
                    `没这个指令喔，你这个小笨笨|･ω･｀)`,
                    room_id
                );

                // 切换勋章
                if (
                    msg.text.indexOf('萌萌兽') != -1 &&
                    msg.text.indexOf('勋章') != -1
                ) {
                    return CUTE_MODULE.danmaku.queue_add(
                        `勋章是什么？人家不知道呀|･ω･｀)`,
                        room_id
                    );
                }
            },
            query: (msg, room_id, permission) => {
                let keyword = ['指令', '权限', '粉丝数', '舰长群', '真爱群'];
                for (let i = 0; i < keyword.length; i++) {
                    if (msg.text.indexOf(keyword[i]) == 4) {
                        // console.log(`查询：${keyword[i]}`);
                        switch (keyword[i]) {
                            case '指令':
                                if (
                                    permission >=
                                    CUTE_CONFIG[room_id].PERMISSION.fans
                                ) {
                                    CUTE_MODULE.danmaku.queue_add(
                                        `由于字数限制，指令说明请到我的动态中查看哟|･ω･｀)`,
                                        room_id
                                    );
                                } else {
                                    return CUTE_MODULE.danmaku.queue_add(
                                        `拒绝执行！你的权限：${permission}，需要：${CUTE_CONFIG[
                                            room_id
                                        ].PERMISSION.fans} |･ω･｀)`,
                                        room_id
                                    );
                                }
                                break;
                            case '权限':
                                CUTE_MODULE.danmaku.queue_add(
                                    `@${msg.name} 当前权限：${permission}`,
                                    room_id
                                );
                                break;
                            case '粉丝数':
                                if (
                                    permission >=
                                    CUTE_CONFIG[room_id].PERMISSION.admin
                                ) {
                                    if (
                                        CUTE_DATA[room_id].ROOM_INFO.room_id !=
                                        8324350
                                    ) {
                                        CUTE_MODULE.room.follower.now(room_id);
                                    } else {
                                        return CUTE_MODULE.danmaku.queue_add(
                                            `本房间禁止使用该指令|･ω･｀)`,
                                            room_id
                                        );
                                    }
                                } else {
                                    return CUTE_MODULE.danmaku.queue_add(
                                        `拒绝执行！你的权限：${permission}，需要：${CUTE_CONFIG[
                                            room_id
                                        ].PERMISSION.admin} |･ω･｀)`,
                                        room_id
                                    );
                                }
                                break;
                            case '舰长群':
                                if (
                                    permission >=
                                    CUTE_CONFIG[room_id].PERMISSION.guard
                                ) {
                                    let whisperCtx = {
                                        631: `\\n欢迎新舰长，我地位-1！`,
                                        189: `\\n欢迎新舰长，我地位-1！\\n\\n狐妖的舰长QQ群：568744231，欢迎来玩♡\\n\\n私信由叽气人自动发送，无需回复|･ω･｀)`,
                                        223: `\\n欢迎新舰长，我地位-1！\\n\\n可可的舰长QQ群：88479489，欢迎加入♡\\n\\n私信由叽气人自动发送，无需回复|･ω･｀)`,
                                        64566: `\\n跪谢老板٩(๑^o^๑)۶对猫猫的船票支持！\\n\\n猫猫的欢乐舰长QQ群：823316645，快来一起玩耍吧٩(๑^o^๑)۶\\n\\n私信由叽气人自动发送，无需回复|･ω･｀)`
                                    };
                                    if (whisperCtx[room_id]) {
                                        CUTE_MODULE.whisper(
                                            msg.uid,
                                            msg.name,
                                            `{"content":"[${CUTE_MODULE.tsFormatter(
                                                new Date() / 1000
                                            )}] ${whisperCtx[room_id]}"}`,
                                            room_id,
                                            'guard'
                                        );
                                    } else {
                                        console.log(
                                            `【${room_id}】没有设置舰长群，不能发送私信|･ω･｀)`
                                        );
                                    }
                                } else {
                                    return CUTE_MODULE.danmaku.queue_add(
                                        `船都没上你查什么查|･ω･｀)`,
                                        room_id
                                    );
                                }
                                break;
                            case '真爱群':
                                let whisperCfg = {
                                    189: {
                                        permission: 130,
                                        danmu: `\\n感谢大佬一直以来对狐妖的支持！\\n\\n狐妖的真爱宝宝QQ群：633202159，欢迎加入♡\\n\\n私信由叽气人自动发送，无需回复|･ω･｀)`
                                    },
                                    223: {
                                        permission: 100,
                                        danmu: `\\n感谢大佬一直以来对可可的支持！\\n\\n可可的真爱QQ群：727774262，欢迎加入♡\\n\\n验证请填写：机器人\\n\\n私信由叽气人自动发送，无需回复|･ω･｀)`
                                    }
                                };
                                if (whisperCfg[room_id]) {
                                    if (
                                        permission >=
                                        whisperCfg[room_id].permission
                                    ) {
                                        CUTE_MODULE.whisper(
                                            msg.uid,
                                            msg.name,
                                            `{"content":"[${CUTE_MODULE.tsFormatter(
                                                new Date() / 1000
                                            )}] ${whisperCfg[room_id].danmu}"}`,
                                            room_id,
                                            'truelove'
                                        );
                                    } else {
                                        return CUTE_MODULE.danmaku.queue_add(
                                            `拒绝执行！你的权限：${permission}，需要：${whisperCfg[
                                                room_id
                                            ].permission} |･ω･｀)`,
                                            room_id
                                        );
                                    }
                                } else {
                                    return CUTE_MODULE.danmaku.queue_add(
                                        `这个直播间没有设置真爱群|･ω･｀)`,
                                        room_id
                                    );
                                }
                                break;

                            default:
                                break;
                        }
                        return;
                    }
                }
                return CUTE_MODULE.danmaku.queue_add(
                    `没这个指令喔，你这个小笨笨|･ω･｀)`,
                    room_id
                );
            },
            send: (e, index) => {
                let keyCode = e.keyCode
                    ? e.keyCode
                    : e.which ? e.which : e.charCode;
                if (keyCode == 13) {
                    // alert("响应键盘的enter事件");
                    // 获取时间戳
                    let room_id = CUTE_TAG.list[index];
                    let msg = $(`#${room_id} .danmu_send`).val().trim();
                    if (msg) {
                        return CUTE_API.user.send.danmaku(msg, room_id).then(
                            res => {
                                if (!res.msg) {
                                    CUTE_MODULE.toast.success(`弹幕发送成功`);
                                    $(`#${room_id} .danmu_send`).val('');
                                } else {
                                    CUTE_MODULE.toast.failed(res.msg);
                                }
                            },
                            err => {
                                CUTE_MODULE.toast.failed(`网络错误！`);
                            }
                        );
                        // .catch(err => {
                        //   CUTE_MODULE.toast.failed(`网络错误${err}`);
                        // });
                    } else {
                        CUTE_MODULE.toast.failed(`弹幕发送内容不能为空`);
                        return;
                    }
                }
            },
            queue_add: (msg, room_id) => {
                let danmu_list = CUTE_MODULE.danmaku.to_be_sent;
                if (msg.length > 30) {
                    msg = msg.substr(0, 30);
                    CUTE_MODULE.danmaku.queue_add(
                        msg.substr(msg.length - 30),
                        room_id
                    );
                }
                let danmu_info = `${room_id}##${msg}`;
                switch (CUTE_MODULE.danmaku.queue_status) {
                    case 0:
                        if (danmu_info != CUTE_MODULE.danmaku.last_msg) {
                            danmu_list.push(danmu_info);
                            CUTE_MODULE.danmaku.queue_send(msg, room_id);
                            CUTE_MODULE.danmaku.queue_status = 1;
                        } else {
                            console.log(
                                `%c该弹幕正在冷却中：【${danmu_info}】`,
                                'color: #f8878d;'
                            );
                            return;
                        }
                        break;
                    case 1:
                        if (
                            danmu_info != CUTE_MODULE.danmaku.last_msg &&
                            !~danmu_list.indexOf(danmu_info)
                        ) {
                            danmu_list.push(danmu_info);
                        } else {
                            console.log(
                                `%c队列中已存在弹幕：【${danmu_info}】`,
                                'color: #f8878d;'
                            );
                            return;
                        }
                        break;
                    default:
                        break;
                }

                console.log(
                    `%c弹幕队列：【${JSON.stringify(
                        danmu_list
                    )}】，队列长度：${danmu_list.length}`,
                    'color: yellow;'
                );
            },
            queue_send: (msg, room_id) => {
                let danmu_list = CUTE_MODULE.danmaku.to_be_sent;
                try {
                    room_id = Number(room_id);
                    CUTE_API.user.send.danmaku(msg, room_id).then(
                        res => {
                            let time = 1500;
                            if (!res.msg && !res.message) {
                                CUTE_MODULE.toast.success(`${room_id}：${msg}`);
                                CUTE_MODULE.danmaku.last_msg = danmu_list.shift();
                                clearTimeout(
                                    CUTE_DATA[room_id].INTERVAL.lastMsgTimeOut
                                );
                                CUTE_DATA[
                                    room_id
                                ].INTERVAL.lastMsgTimeOut = undefined;
                                CUTE_DATA[
                                    room_id
                                ].INTERVAL.lastMsgTimeOut = setTimeout(() => {
                                    CUTE_MODULE.danmaku.last_msg = undefined;
                                }, 5e3);
                                if (danmu_list.length) {
                                    console.log(
                                        `%c${time /
                                            1000}s后发送【${danmu_list[0]}】`,
                                        'color: orange;'
                                    );
                                }

                                setTimeout(() => {
                                    if (!danmu_list.length) {
                                        CUTE_MODULE.danmaku.queue_status = 0;
                                    } else {
                                        CUTE_MODULE.danmaku.queue_send(
                                            danmu_list[0].split('##')[1],
                                            danmu_list[0].split('##')[0]
                                        );
                                    }
                                }, time);
                            } else {
                                console.log(
                                    `%c发送失败（${res.msg}）：【${room_id}】${msg}`,
                                    'color: #f8878d;'
                                );
                                CUTE_MODULE.toast.failed(
                                    res.msg || res.message
                                );
                                if (
                                    res.msg == 'msg in 1s' ||
                                    res.msg == 'msg repeat'
                                ) {
                                    if (res.msg == 'msg repeat') {
                                        time = 3500;
                                    }

                                    if (danmu_list.length) {
                                        console.log(
                                            `%c${time /
                                                1000}s后发送【${danmu_list[0]}】`,
                                            'color: orange;'
                                        );
                                    }
                                } else {
                                    danmu_list.shift();
                                }

                                setTimeout(() => {
                                    if (!danmu_list.length) {
                                        CUTE_MODULE.danmaku.queue_status = 0;
                                    } else {
                                        CUTE_MODULE.danmaku.queue_send(
                                            danmu_list[0].split('##')[1],
                                            danmu_list[0].split('##')[0]
                                        );
                                    }
                                }, time);
                            }
                        },
                        err => {
                            console.log(`%c网络错误：`, `${err}`, 'color: #f8878d;');
                            CUTE_MODULE.danmaku.queue_error++;
                            if (CUTE_MODULE.danmaku.queue_error >= 3) {
                                danmu_list = [];
                                CUTE_MODULE.danmaku.queue_status = 0;
                                CUTE_MODULE.danmaku.queue_error = 0;
                                console.log(
                                    `%c重试失败超过3次，弹幕发送已终止`,
                                    'color: #f8878d;'
                                );
                            } else {
                                setTimeout(() => {
                                    if (!danmu_list.length) {
                                        CUTE_MODULE.danmaku.queue_status = 0;
                                    } else {
                                        CUTE_MODULE.danmaku.queue_send(
                                            danmu_list[0].split('##')[1],
                                            danmu_list[0].split('##')[0]
                                        );
                                    }
                                }, 1500);
                            }
                        }
                    );
                } catch (err) {
                    console.log(err);
                }
            },
            queue_status: 0,
            queue_error: 0,
            todo: () => {
                //		console.log(msg.text, keyword_reply[0].keyword);
                if (
                    msg.text.indexOf('点歌') != -1 &&
                    (CUTE_DATA[room_id].ROOM_INFO.short_id == 631 ||
                        CUTE_DATA[room_id].ROOM_INFO.short_id == 64566) &&
                    msg.uid != 64131034
                ) {
                    if (
                        CUTE_DATA[room_id].MEDAL_INFO &&
                        msg.medal_name ==
                            CUTE_DATA[room_id].MEDAL_INFO.medal_name
                    ) {
                        if (
                            msg.text.split('=')[0] == '点歌' ||
                            msg.text.split('=')[0] == '*点歌'
                        ) {
                            return CUTE_MODULE.danmaku.queue_add(
                                `滴~点歌格式正确！上车成功~`,
                                room_id
                            );
                        } else {
                            return CUTE_MODULE.danmaku.queue_add(
                                `你刚刚好像说了点歌？但是姿势好像不太对呢，要不再试试？`,
                                room_id
                            );
                        }
                    } else {
                        return CUTE_MODULE.danmaku.queue_add(
                            `你是不是想点歌？只有戴上主播勋章才能点歌成功哟~`,
                            room_id
                        );
                    }
                }
            }
        },
        // 私信发送
        whisper: (receiver_id, receiver_name, content, room_id, mode) => {
            return CUTE_API.user.send.msg(receiver_id, content).then(res => {
                if (res.code === 0) {
                    switch (mode) {
                        case 'help':
                            CUTE_MODULE.danmaku.queue_add(
                                `@${receiver_name} 指令已经私信您了|･ω･｀)`,
                                room_id
                            );
                            break;
                        case 'truelove':
                            CUTE_MODULE.danmaku.queue_add(
                                `@${receiver_name} 真爱群已经私信您了|･ω･｀)`,
                                room_id
                            );
                            break;
                        case 'guard':
                            CUTE_MODULE.danmaku.queue_add(
                                `@${receiver_name} 舰长群已经私信您了|･ω･｀)`,
                                room_id
                            );
                            break;

                        default:
                            CUTE_MODULE.danmaku.queue_add(
                                `@${receiver_name} 已经私信您了|･ω･｀)`,
                                room_id
                            );
                            break;
                    }
                } else {
                    console.log(`私信发送失败：${res.msg}`);
                }
            });
        },
        // 获取/添加/删除 循环广告内容
        ad: {
            // 未完成
            get: room_id => {
                let replyArr = CUTE_CONFIG[room_id].AD.replyArr;
                try {
                    $(`#${room_id} .ad_arr`).empty();
                    if (replyArr && replyArr.length) {
                        $(`#${room_id} .intervalTime`).val(
                            CUTE_CONFIG[room_id].AD.replyTime
                        );
                        for (let i = 0; i < replyArr.length; i++) {
                            $(`#${room_id} .ad_arr`).append(
                                [i + 1] +
                                    '、<input style="width: 500px; margin-bottom: 5px;" type="text" index="' +
                                    [i] +
                                    '" value="' +
                                    replyArr[i] +
                                    '" maxlength="30"/> <button class="danmudel" index="' +
                                    [i] +
                                    '">删除</button><br />'
                            );
                        }
                        $(`#${room_id} .danmudel`).on('click', function(e) {
                            CUTE_MODULE.ad.del(e, room_id);
                        });
                    }
                } catch (err) {
                    console.log(err);
                }
                $(`#${room_id} .ad_arr input`).blur(e => {
                    console.log(e);
                    let index = e.target.attributes.index.value,
                        val = e.target.value;
                    console.log(`内容修改：${(index, val)}`);
                    replyArr[index] = val;
                    CUTE_MODULE.config.update(room_id);
                });
            },
            add: room_id => {
                if (!CUTE_DATA[room_id].ROOM_INFO.room_id) {
                    $.alert('请先连接直播间再操作|･ω･｀)');
                    return false;
                }
                if ($(`#${room_id} .ad_new_content`).val()) {
                    CUTE_CONFIG[room_id].AD.replyArr.push(
                        $(`#${room_id} .ad_new_content`).val()
                    );
                    CUTE_MODULE.config.update(room_id);
                    CUTE_MODULE.ad.get(room_id);
                    $(`#${room_id} .ad_new_content`).val('');
                } else {
                    $.alert('定时发言内容不能为空|･ω･｀)');
                }
            },
            del: (e, room_id) => {
                let index = e.target.attributes.index.value;
                console.log(`删除：${index}`);
                CUTE_CONFIG[room_id].AD.replyArr.splice(index, 1);
                CUTE_MODULE.config.update(room_id);
                CUTE_MODULE.ad.get(room_id);
            },
            send: room_id => {
                return CUTE_API.room.info(room_id).then(res => {
                    if (res.code === 0) {
                        CUTE_DATA[room_id].ROOM_INFO.live_status =
                            res.data.room_info.live_status;
                        if (
                            CUTE_DATA[room_id].ROOM_INFO.live_status == 1 &&
                            CUTE_CONFIG[room_id].MODULE_SWITCH.ad
                        ) {
                            $(`#${room_id} .switch`).html(
                                '<span style="color: lightgreen;">定时发言功能运行中</span>'
                            );
                            let AD = CUTE_CONFIG[room_id].AD;
                            AD.replySerial =
                                AD.replySerial < AD.replyArr.length
                                    ? AD.replySerial
                                    : 0;
                            CUTE_MODULE.danmaku.queue_add(
                                AD.replyArr[AD.replySerial],
                                room_id
                            );
                            AD.replySerial < AD.replyArr.length - 1
                                ? AD.replySerial++
                                : (AD.replySerial = 0);
                            CUTE_MODULE.config.update(room_id);
                        } else {
                            $(`#${room_id} .switch`).html(
                                '<span style="color: orange;">定时发言功能未开启，或当前直播间未开播</span>'
                            );
                        }
                        return;
                    }
                });
            },
            run: room_id => {
                clearInterval(CUTE_DATA[room_id].INTERVAL.adItv); // 消除定时器的叠加
                CUTE_DATA[room_id].INTERVAL.adItv = undefined; // 清空保存定时器的变量
                if (
                    CUTE_DATA[room_id].ROOM_INFO.live_status == 1 &&
                    CUTE_CONFIG[room_id].MODULE_SWITCH.ad
                ) {
                    $(`#${room_id} .switch`).html(
                        '<span style="color: lightgreen;">定时发言功能运行中</span>'
                    );
                } else {
                    $(`#${room_id} .switch`).html(
                        '<span style="color: orange;">定时发言功能未开启，或当前直播间未开播</span>'
                    );
                }
                // console.log('发送间隔：' + CUTE_CONFIG[room_id].AD.replyTime);
                CUTE_DATA[room_id].INTERVAL.adItv = setInterval(() => {
                    CUTE_MODULE.ad.send(room_id);
                }, CUTE_CONFIG[room_id].AD.replyTime * 1e3);
            },
            end: room_id => {
                clearInterval(CUTE_DATA[room_id].INTERVAL.adItv);
                CUTE_DATA[room_id].INTERVAL.adItv = undefined; // 清空保存定时器的变量
                CUTE_CONFIG[room_id].AD.replySerial = 0;
                $(`#${room_id} .switch`).html(
                    '<span style="color: #f8878d;">定时发言功能已关闭</span>'
                );
            },
            time: room_id => {
                CUTE_CONFIG[room_id].AD.replyTime = $(
                    `#${room_id} .intervalTime`
                ).val();
                $(`#${room_id} .setTime`).html(
                    '<span style="color: lightgreen;">发射间隔已设置为' +
                        CUTE_CONFIG[room_id].AD.replyTime +
                        '秒</span>'
                );
                CUTE_MODULE.config.update(room_id);
                if (CUTE_DATA[room_id].INTERVAL.adItv) {
                    CUTE_MODULE.ad.run(room_id);
                }
                return;
            },
            interval: undefined
        },
        keyword: {
            // 获取/添加/删除 关键词自动回复
            reply: {
                // 未完成
                get: room_id => {
                    let replyArr = CUTE_CONFIG[room_id].KEYWORD.replyArr;
                    // 更新配置结构，单回复转为多回复
                    // try {
                    //   for (let i = 0; i < replyArr.length; i++) {
                    //     if (typeof replyArr[i].reply == 'string') {
                    //       replyArr[i].reply = replyArr[i].reply.split('1qaz2wsx');
                    //     }
                    //   }
                    //   localStorage.setItem(
                    //     'auto_keyword_reply_' + room_id,
                    //     JSON.stringify(replyArr)
                    //   );
                    // } catch (e) {}
                    $(`#${room_id} .autoreply_arr`).empty();
                    if (replyArr && replyArr.length) {
                        for (let i = 0; i < replyArr.length; i++) {
                            let reply = '';
                            for (let j = 0; j < replyArr[i].reply.length; j++) {
                                reply += replyArr[i].reply[j];
                                if (j != replyArr[i].reply.length - 1) {
                                    reply += '\n';
                                }
                            }
                            $(`#${room_id} .autoreply_arr`).append(
                                `
                                <div class="c-flex c-align-center">
                                    <div class="c-flex" style="width: 200px;">
                                        <div>${[i + 1]}、关键词：</div>
                                        <input disabled style="width: 50%; color: rgb(0, 0, 255);"
                                    type="text" index="${[
                                        i
                                    ]}" value="${replyArr[i]
                                    .keyword}" maxlength="20"/>
                                    </div>

                                    <div class="c-flex c-flex-1 c-align-center">
                                        <div>自动回复：</div>
                                        <textarea disabled style="width: 50%; resize: none; color: rgb(0, 0, 255);"
                                        index="${[i]}">${reply}</textarea>
                                        <button class="replydel" style="margin-left: 5px;" index="${[
                                            i
                                        ]}">删除</button>
                                    </div>
                                </div>
              `
                            );
                        }
                        $(`#${room_id} textarea`).autoHeightTextarea();
                        $(`#${room_id} .replydel`).on('click', function(e) {
                            CUTE_MODULE.keyword.reply.del(e, room_id);
                        });
                    }
                },
                add: (room_id, msg) => {
                    if (!CUTE_DATA[room_id].ROOM_INFO.room_id) {
                        return $.alert('请先连接直播间再操作|･ω･｀)');
                    }
                    let replyArr = CUTE_CONFIG[room_id].KEYWORD.replyArr;
                    let repeat = 0;
                    let keyword;
                    let reply;
                    if (msg) {
                        keyword = msg.text.split('=')[1].split('&')[0];
                        reply = msg.text.split('=')[1].split('&')[1];
                        if (!keyword || !reply) {
                            return CUTE_MODULE.danmaku.queue_add(
                                '关键词和自动回复不能为空|･ω･｀)',
                                room_id
                            );
                        }
                    } else {
                        keyword = $(`#${room_id} .keyword`).val();
                        reply = $(`#${room_id} .reply`).val();
                        if (!keyword || !reply) {
                            return $.alert('关键词和自动回复不能为空|･ω･｀)');
                        }
                    }
                    try {
                        // 查询关键词是否已经存在，不存在则新建对象
                        for (let i = 0; i < replyArr.length; i++) {
                            if (replyArr[i].keyword == keyword) {
                                replyArr[i].reply.push(reply);
                                repeat = 1;
                                if (msg) {
                                    CUTE_MODULE.danmaku.queue_add(
                                        `[${keyword}] 更新成功( ˘•ω•˘ )`,
                                        room_id
                                    );
                                }
                                break;
                            }
                        }
                        if (!repeat) {
                            let obj = {};
                            obj.keyword = keyword;
                            obj.reply = [reply];
                            replyArr.push(obj);
                            if (msg) {
                                CUTE_MODULE.danmaku.queue_add(
                                    `[${keyword}] 设置成功( ˘•ω•˘ )`,
                                    room_id
                                );
                            }
                        }
                        // localStorage.setItem(
                        //   'auto_keyword_reply_' + room_id,
                        //   JSON.stringify(replyArr)
                        // );
                        CUTE_MODULE.config.update(room_id);
                        CUTE_MODULE.keyword.reply.get(room_id);
                        $(`#${room_id} .keyword`).val('');
                        $(`#${room_id} .reply`).val('');
                    } catch (err) {
                        console.log(err);
                    }
                },
                del: (e, room_id) => {
                    let index = e.target.attributes.index.value;
                    let replyArr = CUTE_CONFIG[room_id].KEYWORD.replyArr;
                    console.log(index);
                    replyArr.splice(index, 1);
                    CUTE_MODULE.config.update(room_id);
                    CUTE_MODULE.keyword.reply.get(room_id);
                },
                delByDanmaku: (msg, room_id) => {
                    let replyArr = CUTE_CONFIG[room_id].KEYWORD.replyArr;
                    if (replyArr) {
                        let keyword = msg.text.split('=')[1];
                        for (let i = 0; i < replyArr.length; i++) {
                            if (replyArr[i].keyword == keyword) {
                                replyArr.splice(i, 1);
                                CUTE_MODULE.config.update(room_id);
                                CUTE_MODULE.keyword.reply.get(room_id);
                                return CUTE_MODULE.danmaku.queue_add(
                                    `[${keyword}] 删除成功( ˘•ω•˘ )`,
                                    room_id
                                );
                            }
                        }
                        return CUTE_MODULE.danmaku.queue_add(
                            `[${keyword}] 未找到|･ω･｀)`,
                            room_id
                        );
                    }
                }
            },
            // 获取/添加/删除 关键词自动封禁
            ban: {
                // 未完成
                get: () => {},
                add: msg => {
                    if (!room_id) {
                        return $.alert('请先连接直播间再操作|･ω･｀)');
                    }
                    let keyword = msg.text.split('=')[1];
                    if (keyword) {
                        let banArr = CUTE_CONFIG[room_id].KEYWORD.banArr;
                        for (let i = 0; i < banArr.length; i++) {
                            if (banArr[i] == keyword) {
                                CUTE_MODULE.toast.failed(`不可以添加重复的关键词！`);
                                // $.toast({
                                //   heading: '添加失败',
                                //   text: '错误原因：不可以添加重复的关键词！',
                                //   hideAfter: 1500,
                                //   stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                                //   icon: 'error',
                                //   position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                                //   textAlign: 'left', // Text alignment i.e. left, right or center
                                //   loader: false // Whether to show loader or not. True by default
                                // });
                                return CUTE_MODULE.danmaku.queue_add(
                                    `${keyword} 已存在，不可以重复添加`,
                                    room_id
                                );
                            }
                        }
                        banArr.push(keyword);
                        CUTE_MODULE.config.update(room_id);
                        return CUTE_MODULE.danmaku.queue_add(
                            `${keyword} 设置成功`,
                            room_id
                        );
                    }
                },
                del: () => {},
                delByDanmaku: msg => {
                    let keyword = msg.text.split('=')[1];
                    if (keyword) {
                        let banArr = CUTE_CONFIG[room_id].KEYWORD.banArr;
                        for (let i = 0; i < banArr.length; i++) {
                            if (banArr[i] == keyword) {
                                banArr.splice(i, 1);
                                CUTE_MODULE.config.update(room_id);
                                return CUTE_MODULE.danmaku.queue_add(
                                    `${keyword} 删除成功`,
                                    room_id
                                );
                            }
                        }
                        return CUTE_MODULE.danmaku.queue_add(
                            `${keyword} 未找到`,
                            room_id
                        );
                    }
                }
            }
        },
        // 封禁
        block: {
            // 可根据昵称查询用户uid
            search: (search, hour, mode) => {
                return CUTE_API.room.block_user.search(search).then(res => {
                    if (res.code === 0) {
                        let block_uid = res.data.items[0].uid;
                        switch (mode) {
                            case 'execute':
                                CUTE_MODULE.block.add(
                                    room_id,
                                    block_uid,
                                    hour,
                                    'execute'
                                );
                                break;

                            default:
                                break;
                        }
                    } else if (res.msg.indexOf('不能')) {
                        CUTE_MODULE.danmaku.queue_add(
                            `${res.msg} ( ˘•ω•˘ )`,
                            room_id
                        );
                    } else {
                        console.log(res.msg);
                    }
                });
            },
            add: (room_id, block_uid, hour, mode) => {
                return CUTE_API.room.block_user
                    .add(room_id, block_uid, hour)
                    .then(res => {
                        if (res.code === 0) {
                            console.log(
                                `用户 ${res.data.uname} 被封禁至 ${res.data
                                    .block_end_time}`
                            );
                            switch (mode) {
                                case 'follow':
                                    CUTE_MODULE.danmaku.queue_add(
                                        `※ ${res.data.uname} 由于多次关注被制裁了`,
                                        room_id
                                    );
                                    break;
                                case 'keyword':
                                    CUTE_MODULE.danmaku.queue_add(
                                        `※ ${res.data.uname} 由于触发关键词被制裁了`,
                                        room_id
                                    );
                                    break;
                                case 'self':
                                    CUTE_MODULE.danmaku.queue_add(
                                        `※ ${res.data.uname} 由于想不开，进行了自裁`,
                                        room_id
                                    );
                                    CUTE_MODULE.block.del(
                                        room_id,
                                        res.data.uname
                                    );
                                    break;
                                case 'execute':
                                    CUTE_MODULE.danmaku.queue_add(
                                        `※ ${res.data.uname} 被管理制裁了`,
                                        room_id
                                    );
                                    break;
                                case 'reflect':
                                    CUTE_MODULE.danmaku.queue_add(
                                        `※ ${res.data.uname} 由于作死，被反弹了制裁`,
                                        room_id
                                    );
                                    break;
                                case 'blacklist':
                                    CUTE_MODULE.danmaku.queue_add(
                                        `※ ${res.data.uname} 在本直播间黑名单中，被本机无情制裁`,
                                        room_id
                                    );
                                    break;
                                default:
                                    break;
                            }
                            return;
                        } else {
                            console.log(`触发了封禁，但是操作失败了：${res.message}`);
                            // CUTE_MODULE.danmaku.queue_add(
                            //     `${res.message}|･ω･｀)`
                            // );
                        }
                    });
            },
            del: (room_id, block_user, page = 1) => {
                // 首先查询房间封禁列表
                return CUTE_API.room.block_user
                    .check(room_id, page)
                    .then(res => {
                        if (res.code === 0) {
                            if (res.data.length > 0) {
                                for (let i = 0; i < res.data.length; i++) {
                                    // 查找比对封禁账号名或uid
                                    if (
                                        block_user == res.data[i].uname ||
                                        block_user == res.data[i].uid
                                    ) {
                                        // 对匹配用户进行解封
                                        block_user = res.data[i].uname;
                                        return CUTE_API.room.block_user.del(
                                            room_id,
                                            res.data[i].id
                                        );
                                    }
                                }
                                if (page <= 5 && res.data.length == 10) {
                                    // 若无匹配，则翻页继续查找，最多5页
                                    return CUTE_MODULE.block.del(
                                        room_id,
                                        block_user,
                                        page++
                                    );
                                }
                            }
                        } else {
                            console.log(`【小黑屋】${res.msg}`);
                        }
                    });
            }
        },
        // 感谢、赠送礼物
        gift: {
            // 感谢礼物列表
            list: {},
            // 添加新礼物进列表
            add: (msg, room_id) => {
                // console.log(`有新礼物加入感谢列表`);
                let list = CUTE_MODULE.gift.list;
                if (list[msg.uname]) {
                    if (list[msg.uname][room_id]) {
                        if (list[msg.uname][room_id][msg.giftName]) {
                            if (
                                list[msg.uname][room_id][msg.giftName].time ==
                                -1
                            ) {
                                // 同类礼物已存在，倒计时未启动
                                // console.log(`送礼闲置中，倒计时启动`);
                                list[msg.uname][room_id][msg.giftName].time = 5;
                                list[msg.uname][room_id][msg.giftName].giftNum =
                                    msg.num;
                                CUTE_MODULE.gift.thank(msg, room_id);
                            } else {
                                // 同类礼物已存在，倒计时中
                                // console.log(`送礼连击中，倒计时重置`);
                                list[msg.uname][room_id][msg.giftName].time = 5;
                                list[msg.uname][room_id][
                                    msg.giftName
                                ].giftNum +=
                                    msg.num;
                            }
                        } else {
                            // 送礼用户已存在，但送出礼物的类别尚未被记录
                            // console.log(`送出新礼物，倒计时启动`);
                            list[msg.uname][room_id][msg.giftName] = {};
                            list[msg.uname][room_id][msg.giftName].time = 5;
                            list[msg.uname][room_id][msg.giftName].giftNum =
                                msg.num;
                            CUTE_MODULE.gift.thank(msg, room_id);
                        }
                    } else {
                        // 送礼用户已存在，但送礼的直播间尚未被记录
                        // console.log(`送出新礼物，倒计时启动`);
                        list[msg.uname][room_id] = {};
                        list[msg.uname][room_id][msg.giftName] = {};
                        list[msg.uname][room_id][msg.giftName].time = 5;
                        list[msg.uname][room_id][msg.giftName].giftNum =
                            msg.num;
                        CUTE_MODULE.gift.thank(msg, room_id);
                    }
                } else {
                    // 送礼用户未记录
                    // console.log(`新送礼用户，倒计时启动`);
                    list[msg.uname] = {};
                    list[msg.uname][room_id] = {};
                    list[msg.uname][room_id][msg.giftName] = {};
                    list[msg.uname][room_id][msg.giftName].time = 5;
                    list[msg.uname][room_id][msg.giftName].giftNum = msg.num;
                    CUTE_MODULE.gift.thank(msg, room_id);
                }
            },
            // 执行感谢操作
            thank: (msg, room_id) => {
                let list = CUTE_MODULE.gift.list;
                setTimeout(() => {
                    if (list[msg.uname][room_id][msg.giftName].time > 0) {
                        list[msg.uname][room_id][msg.giftName].time--;
                        CUTE_MODULE.gift.thank(msg, room_id);
                        // console.log(list[msg.uname][msg.giftName].time);
                    } else {
                        list[msg.uname][room_id][msg.giftName].time = -1;
                        let unit = '个';
                        if (msg.giftName == '辣条') {
                            unit = '根';
                        }
                        switch (room_id) {
                            case '631':
                                CUTE_MODULE.danmaku.queue_add(
                                    `♡ ${msg.uname}献祭了${list[msg.uname][
                                        room_id
                                    ][msg.giftName].giftNum +
                                        unit +
                                        msg.giftName}给恶魔`,
                                    room_id
                                );
                                break;
                            case '189':
                                CUTE_MODULE.danmaku.queue_add(
                                    `狐妖吃掉了${msg.uname}的${list[msg.uname][
                                        room_id
                                    ][msg.giftName].giftNum +
                                        unit +
                                        msg.giftName}`,
                                    room_id
                                );
                                break;
                            case '223':
                                CUTE_MODULE.danmaku.queue_add(
                                    `收到${msg.uname}的${list[msg.uname][room_id][
                                        msg.giftName
                                    ].giftNum +
                                        unit +
                                        msg.giftName}，可爽了~`,
                                    room_id
                                );
                                break;
                            case '64566':
                                CUTE_MODULE.danmaku.queue_add(
                                    `${msg.uname}用${list[msg.uname][room_id][
                                        msg.giftName
                                    ].giftNum +
                                        unit +
                                        msg.giftName}锤了猫幼的头`,
                                    room_id
                                );
                                break;
                            default:
                                return CUTE_MODULE.danmaku.queue_add(
                                    `${msg.uname}的${list[msg.uname][room_id][
                                        msg.giftName
                                    ].giftNum +
                                        unit +
                                        msg.giftName}被吃掉了~嗷呜♡`,
                                    room_id
                                );
                        }
                    }
                }, 1e3);
            },
            // 赠送礼物
            send: msg => {},
            // 赠送礼物（从包裹）
            send_bag: (msg, room_id) => {
                if (
                    !CUTE_DATA[room_id].send_gift_ts ||
                    new Date().getTime() > CUTE_DATA[room_id].send_gift_ts
                ) {
                    return CUTE_API.user.gift.bag_list().then(res => {
                        if (res.code === 0) {
                            let bag_list = res.data.list;
                            let bag_id;
                            for (let i = 0; i < bag_list.length; i++) {
                                if (bag_list[i].gift_name == '辣条') {
                                    bag_id = bag_list[i].bag_id;
                                    return CUTE_API.user.gift
                                        .send_bag(1, 1, bag_id)
                                        .then(res => {
                                            console.log(res);
                                            if (res.code === 0) {
                                                CUTE_DATA[
                                                    room_id
                                                ].send_gift_ts =
                                                    new Date().getTime() + 6e5;
                                                return CUTE_MODULE.danmaku.queue_add(
                                                    `${msg.name} 通过本机送出了1个辣条|･ω･｀)`,
                                                    room_id
                                                );
                                            } else {
                                                return CUTE_MODULE.danmaku.queue_add(
                                                    `${msg.name} 投喂辣条失败了呢|･ω･｀)`,
                                                    room_id
                                                );
                                            }
                                        });
                                }
                            }
                            return CUTE_MODULE.danmaku.queue_add(
                                `本机的包裹中没有辣条可以送了！(๑•́ ₃ •̀๑)`,
                                room_id
                            );
                        }
                    });
                } else {
                    let cd = Math.round(
                        (CUTE_DATA[room_id].send_gift_ts -
                            new Date().getTime()) /
                            1000
                    );
                    return CUTE_MODULE.danmaku.queue_add(
                        `功能冷却中！请在${cd}秒后使用|･ω･｀)`,
                        room_id
                    );
                }
            }
        },
        // 小助手整点报时
        clock: (room_id, params) => {
            if (CUTE_DATA[room_id].ROOM_INFO.live_status == 1) {
                CUTE_MODULE.danmaku.queue_add(
                    `报时小助手提醒您：现在时间${CUTE_MODULE.tsFormatter(
                        new Date() / 1000,
                        'time'
                    )} |･ω･｀)`,
                    room_id
                );
                if (CUTE_DATA[room_id].ROOM_INFO.live_start_time) {
                    let live_time =
                        parseInt(new Date() / 1000) -
                        parseInt(CUTE_DATA[room_id].ROOM_INFO.live_start_time);
                    if (live_time / 3600 > 2) {
                        CUTE_MODULE.danmaku.queue_add(
                            `目前直播时长${CUTE_MODULE.secondsFormatter(
                                live_time
                            )}，要注意休息哦|･ω･｀)`,
                            room_id
                        );
                    }
                }
            }
            if (params != 'command') {
                CUTE_DATA[room_id].INTERVAL.clockTimeOut = setTimeout(() => {
                    CUTE_MODULE.clock(room_id);
                }, 36e5);
            }
        },
        // 转换时间戳
        tsFormatter: (ts, mode = 'date') => {
            var date = new Date(ts * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M =
                (date.getMonth() + 1 < 10
                    ? '0' + (date.getMonth() + 1)
                    : date.getMonth() + 1) + '-';
            var D =
                (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
                ' ';
            var h =
                (date.getHours() < 10
                    ? '0' + date.getHours()
                    : date.getHours()) + ':';
            var m =
                (date.getMinutes() < 10
                    ? '0' + date.getMinutes()
                    : date.getMinutes()) + ':';
            var s =
                date.getSeconds() < 10
                    ? '0' + date.getSeconds()
                    : date.getSeconds();
            if (mode == 'time') {
                return h + m + s;
            }
            return Y + M + D + h + m + s;
        },
        // 秒数转时分秒
        secondsFormatter(sec) {
            let result = parseInt(sec);
            let h =
                result / 3600 < 10
                    ? '0' + Math.floor(result / 3600)
                    : Math.floor(result / 3600);
            let m =
                result / 60 % 60 < 10
                    ? '0' + Math.floor(result / 60 % 60)
                    : Math.floor(result / 60 % 60);
            let s = result % 60 < 10 ? '0' + result % 60 : result % 60;
            result = `${h}:${m}:${s}`;
            return result;
        },
        // 获取日期
        getDate: () => {
            var date = new Date(); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '';
            var M =
                (date.getMonth() + 1 < 10
                    ? '0' + (date.getMonth() + 1)
                    : date.getMonth() + 1) + '';
            var D =
                (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
                '';
            return Y + M + D;
        },
        // 获取地址栏参数
        getUrlParam: name => {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
        },
        // roll点
        roll: (msg, room_id) => {
            let roll_range = 100;
            let roll_num;
            if (msg.text.split('=')[1]) {
                if (msg.text.split('=')[1].length > 6) {
                    return CUTE_MODULE.danmaku.queue_add(
                        `你不可以这么长，roll点失败|･ω･｀)`,
                        room_id
                    );
                } else if (
                    parseInt(msg.text.split('=')[1]) == msg.text.split('=')[1]
                ) {
                    roll_range = parseInt(msg.text.split('=')[1]);
                    roll_num = Math.floor(Math.random() * roll_range + 1);
                }
            } else {
                roll_num = Math.floor(Math.random() * roll_range + 1);
            }

            return CUTE_MODULE.danmaku.queue_add(
                `@${msg.name} roll出了${roll_num}点`,
                room_id
            );
        },
        // 抽奖
        raffle: (msg, room_id) => {
            let total = CUTE_DATA[room_id].ROOM_INFO.guard_list.length;
            let lucky_num = Math.floor(Math.random() * total);
            let lucky_uid = CUTE_DATA[room_id].ROOM_INFO.guard_list[lucky_num];
            return CUTE_API.user.search(lucky_uid).then(res => {
                if (res.code === 0) {
                    let lucky_dog = res.data.name;
                    CUTE_MODULE.danmaku.queue_add(
                        `@${lucky_dog} 被本机选中了，欧洲人西捏|･ω･｀)`,
                        room_id
                    );
                }
            });
        },
        // 操作提示封装
        toast: {
            success: msg => {
                try {
                    $.toast({
                        heading: '操作成功',
                        text: msg || '',
                        icon: 'success',
                        hideAfter: 5000,
                        stack: 20, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                        position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                        textAlign: 'left', // Text alignment i.e. left, right or center
                        loader: false // Whether to show loader or not. True by default
                    });
                    let scrollHeight = $('.jq-toast-wrap:first').prop(
                        'scrollHeight'
                    );
                    $('.jq-toast-wrap:first').scrollTop(scrollHeight);
                } catch (err) {
                    console.log(err);
                }
            },
            failed: msg => {
                $.toast({
                    heading: '操作失败',
                    text: msg || '',
                    hideAfter: 5000,
                    stack: 20, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    icon: 'error',
                    position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    textAlign: 'left', // Text alignment i.e. left, right or center
                    loader: false // Whether to show loader or not. True by default
                });
                let scrollHeight = $('.jq-toast-wrap:first').prop(
                    'scrollHeight'
                );
                $('.jq-toast-wrap:first').scrollTop(scrollHeight);
            }
        },
        // 礼物统计
        giftRecorder: undefined
    };

    // 弹幕管理器（全功能模式
    let CUTE_DANMAKU_MGR = msg => {
        let room_id = msg.room_id;
        switch (msg.cmd) {
            // 点亮牌牌
            // case 'MESSAGEBOX_USER_MEDAL_CHANGE':
            //     try {
            //         if (
            //             msg.is_lighted == 1 &&
            //             msg.up_uid == CUTE_DATA[room_id].ROOM_INFO.ruid
            //         ) {
            //             return CUTE_API.user.search(msg.uid).then(res => {
            //                 if (res.code === 0) {
            //                     let u_name = res.data.name;
            //                     CUTE_MODULE.danmaku.queue_add(
            //                         `${u_name} 点亮了${msg.medal_level}级${msg.medal_name}，欢迎肥家~♡`
            //                     );
            //                 }
            //             });
            //         } else {
            //             console.log('勋章处于熄灭状态！');
            //         }
            //     } catch (e) {
            //         console.log('啊这怎么报错了呢~');
            //     }
            //     break;
            // pk播报
            case 'PK_BATTLE_PRE':
                if (!CUTE_CONFIG[room_id].MODULE_SWITCH.pk) {
                    return;
                }
                try {
                    return CUTE_API.room.info(msg.pk_roomid).then(res => {
                        if (res.code === 0) {
                            // console.log(`请求成功`);
                            let pk_attention =
                                res.data.anchor_info.relation_info.attention;
                            let text;
                            if (pk_attention >= 500000) {
                                text = `${Math.floor(
                                    pk_attention / 10000
                                )}万粉神仙主播`;
                            } else if (pk_attention >= 100000) {
                                text = `${(pk_attention / 10000).toFixed(
                                    1
                                )}万粉超级主播`;
                            } else if (pk_attention >= 10000) {
                                text = `${(pk_attention / 10000).toFixed(
                                    1
                                )}万粉大主播`;
                            } else if (pk_attention >= 1000) {
                                text = `${pk_attention}粉主播`;
                            } else {
                                text = `${pk_attention}粉萌新主播`;
                            }
                            CUTE_API.room
                                .guard(1, msg.pk_roomid, msg.pk_uid)
                                .then(res => {
                                    if (res.code === 0) {
                                        let text2;
                                        let alive_num = 0;
                                        let top3 = res.data.top3;
                                        if (top3.length) {
                                            for (
                                                let i = 0;
                                                i < top3.length;
                                                i++
                                            ) {
                                                if (top3[i].is_alive) {
                                                    alive_num++;
                                                } else if (
                                                    top3[i].guard_level == 3 &&
                                                    !top3[i].is_alive
                                                ) {
                                                    text2 = `|･ω･｀)对方在线船员${alive_num}人`;
                                                }
                                            }
                                        } else {
                                            text2 = `|･ω･｀)对方在线船员${alive_num}人`;
                                        }
                                        let list = res.data.list;
                                        if (list.length) {
                                            for (
                                                let i = 0;
                                                i < list.length;
                                                i++
                                            ) {
                                                if (list[i].is_alive) {
                                                    alive_num++;
                                                } else if (
                                                    list[i].guard_level == 3 &&
                                                    !list[i].is_alive
                                                ) {
                                                    text2 = `|･ω･｀)对方在线船员${alive_num}人`;
                                                } else if (
                                                    i ==
                                                    list.length - 1
                                                ) {
                                                    text2 = `|･ω･｀)对方在线船员超过${alive_num}人`;
                                                }
                                            }
                                        } else {
                                            text2 = `|･ω･｀)对方在线船员${alive_num}人`;
                                        }
                                        CUTE_API.room
                                            .battle(msg.pk_roomid, msg.pk_uid)
                                            .then(res => {
                                                if (res.code === 0) {
                                                    let win_count =
                                                        res.data.score_info
                                                            .win_count;
                                                    if (text2) {
                                                        text2 += `，当前连胜${win_count}局`;
                                                    } else {
                                                        text2 = `当前连胜${win_count}局`;
                                                    }

                                                    CUTE_MODULE.danmaku.queue_add(
                                                        `[pk播报]匹配到：${text}@${msg.pk_uname}`,
                                                        room_id
                                                    );
                                                    CUTE_MODULE.danmaku.queue_add(
                                                        `${text2}`,
                                                        room_id
                                                    );
                                                }
                                            });
                                    }
                                });
                        }
                    });
                } catch (err) {
                    console.log(err);
                }
                break;
            // 特殊礼物刷屏
            case 'SPECIAL_GIFT':
                try {
                    if (msg.storm_action == 'start') {
                        CUTE_DATA[room_id].danmaku_filter.push(
                            msg.storm_content
                        );
                        CUTE_DATA[room_id].replyCD = 1;
                        CUTE_CONFIG[room_id].MODULE_SWITCH.ban = 0;
                    } else if (msg.storm_action == 'end') {
                        CUTE_DATA[room_id].replyCD = 0;
                        CUTE_CONFIG[room_id].MODULE_SWITCH.ban = 1;
                    }
                } catch (e) {
                    console.log('然而这并不是storm！');
                }
                break;
            // 开启天选抽奖
            case 'ANCHOR_LOT_START':
                try {
                    CUTE_DATA[room_id].danmaku_filter.push(msg.anchor_content);
                    if (CUTE_CONFIG[room_id].MODULE_SWITCH.follow == 1) {
                        CUTE_CONFIG[room_id].MODULE_SWITCH.follow = 0;
                        setTimeout(() => {
                            CUTE_CONFIG[room_id].MODULE_SWITCH.follow = 1;
                        }, msg.time * 1000);
                    }
                } catch (e) {}
                break;
            // 上船
            case 'GUARD_BUY':
                try {
                    let username_limit =
                        msg.username.length < 10
                            ? msg.username
                            : `${msg.username.substr(
                                  0,
                                  2
                              )}***${msg.username.substr(
                                  msg.username.length - 3
                              )}`;
                    if (msg.price == 50000) {
                        return CUTE_MODULE.danmaku.queue_add(
                            `[一週間${msg.gift_name}] ${username_limit} 关于舰长的记忆只有一周（误`,
                            room_id
                        );
                    } else if (
                        CUTE_DATA[room_id].ROOM_INFO.guard_list.indexOf(
                            msg.uid
                        ) != -1
                    ) {
                        return CUTE_MODULE.danmaku.queue_add(
                            `[续费${msg.gift_name}] ${username_limit} 一直续船一直爽！`,
                            room_id
                        );
                    } else {
                        CUTE_DATA[room_id].ROOM_INFO.guard_list.push(msg.uid);
                        CUTE_MODULE.danmaku.queue_add(
                            `[新${msg.gift_name}] ${username_limit} 上船了，我地位-1！`,
                            room_id
                        );
                        setTimeout(() => {
                            let whisperCtx = {
                                // 631: `\\n欢迎新舰长，我地位-1！\\n\\n恶魔的舰长QQ群：870309615，欢迎加入♡\\n\\n私信由叽气人自动发送，无需回复|･ω･｀)`,
                                189: `\\n欢迎新舰长，我地位-1！\\n\\n狐妖的舰长QQ群：568744231，欢迎来玩♡\\n\\n私信由叽气人自动发送，无需回复|･ω･｀)`,
                                223: `\\n欢迎新舰长，我地位-1！\\n\\n可可的舰长QQ群：88479489，欢迎加入♡\\n\\n私信由叽气人自动发送，无需回复|･ω･｀)`,
                                64566: `\\n跪谢老板٩(๑^o^๑)۶对猫猫的船票支持！\\n\\n猫猫的欢乐舰长QQ群：823316645，快来一起玩耍吧٩(๑^o^๑)۶\\n\\n私信由叽气人自动发送，无需回复|･ω･｀)`
                            };
                            if (whisperCtx[room_id]) {
                                CUTE_MODULE.whisper(
                                    msg.uid,
                                    msg.username,
                                    `{"content":"[${CUTE_MODULE.tsFormatter(
                                        new Date() / 1000
                                    )}] ${whisperCtx[room_id]}"}`,
                                    room_id,
                                    'guard'
                                );
                            } else {
                                console.log(`【${room_id}】没有设置舰长群，不能发送私信|･ω･｀)`);
                            }
                        }, 5e3);
                    }
                } catch (err) {
                    console.log(err);
                }

                break;
            // 礼物
            case 'SEND_GIFT':
                try {
                    if (
                        CUTE_CONFIG[room_id].MODULE_SWITCH.gift == 2 ||
                        (CUTE_CONFIG[room_id].MODULE_SWITCH.gift == 1 &&
                            msg.coin_type ==
                                CUTE_CONFIG[room_id].MODULE_SWITCH.coin_type)
                    ) {
                        return CUTE_MODULE.gift.add(msg, room_id);
                    }
                    // console.log(
                    //     `%c【${room_id}】 ${msg.uname}：${msg.giftName} x ${msg.num}`,
                    //     'color: lightpink'
                    // );
                } catch (err) {
                    console.log(err);
                }
                break;
            // 开播
            case 'LIVE':
                try {
                    if (!CUTE_DATA[room_id].liveCD) {
                        CUTE_DATA[room_id].liveCD = true;
                        setTimeout(() => {
                            CUTE_DATA[room_id].liveCD = false;
                        }, 1e4);
                    } else {
                        return;
                    }
                    if (typeof msg.live_id == 'number') {
                        let startCtx = {
                            631: `♡ 鸽叽鸽叽鸽叽鸽叽鸽叽鸽叽，阿姨洗铁路|･ω･｀)`,
                            189: `♡ 啊，是我最喜欢的小狐妖开播了|･ω･｀)`,
                            223: `♡ 咕才是世界的常态……然而居然开播了|･ω･｀)`,
                            64566: `♡ 第一次看直播，刚点进这个直播间就开播了|･ω･｀)`,
                            176190: `♡ 小酸奶你来辣！那就让我一口吃掉好了|･ω･｀)`
                        };
                        if (startCtx[room_id]) {
                            CUTE_MODULE.danmaku.queue_add(
                                startCtx[room_id],
                                room_id
                            );
                        }
                        CUTE_ROBOT.connect.init(room_id, 'common');
                        if (
                            window.Notification &&
                            Notification.permission !== 'denied'
                        ) {
                            Notification.requestPermission(function(status) {
                                let notification = new Notification('真香警告', {
                                    body:
                                        CUTE_MODULE.tsFormatter(
                                            new Date() / 1000
                                        ) +
                                        ' ' +
                                        CUTE_DATA[room_id].ROOM_INFO.uname +
                                        '出现了！我就是饿死也不会去看一眼！'
                                });
                                notification.onclick = function() {
                                    window.open(
                                        'https://live.bilibili.com/' +
                                            CUTE_DATA[room_id].ROOM_INFO
                                                .short_id
                                    );
                                };
                            });
                        }
                        // $('.connect_full').click();
                    }
                } catch (err) {
                    console.log(err);
                }
                break;
            // 下播
            case 'PREPARING':
                try {
                    if (!CUTE_DATA[room_id].liveCD) {
                        CUTE_DATA[room_id].liveCD = true;
                        setTimeout(() => {
                            CUTE_DATA[room_id].liveCD = false;
                        }, 1e4);
                    } else {
                        return;
                    }
                    CUTE_MODULE.danmaku.queue_add(
                        `${CUTE_MODULE.tsFormatter(
                            new Date() / 1000,
                            'time'
                        )} 直播结束，喜欢记得关注嗷~！`,
                        room_id
                    );
                    console.log(
                        `%c【${room_id}】${CUTE_MODULE.tsFormatter(
                            new Date() / 1000,
                            'time'
                        )} 直播结束`,
                        'color: skyblue'
                    );
                    CUTE_MODULE.ad.end(room_id);
                    setTimeout(() => {
                        // todo
                        CUTE_ROBOT.connect.init(room_id, 'sleep');
                    }, 2e4);
                } catch (err) {
                    console.log(err);
                }
                break;
            // 封禁提示
            case 'ROOM_BLOCK_MSG':
                try {
                    let danmuItem = `<div class="danmu-item c-flex c-align-center" style="color: #f8878d;">@${msg.block_uname} 被房管无情制裁了</div>`;
                    // 控制弹幕输出数量为100以内
                    if (
                        $(`#${room_id} .danmu_container`).children().length >=
                        100
                    ) {
                        $(`#${room_id} .danmu_container`)
                            .children(`:lt(50)`)
                            .remove();
                    }
                    // 输出新弹幕
                    $(`#${room_id} .danmu_container`).append(`
                            ${danmuItem}
                            `);
                    // 弹幕池滚动
                    let scrollHeight = $(`#${room_id} .danmu_container`).prop(
                        'scrollHeight'
                    );
                    $(`#${room_id} .danmu_container`).scrollTop(scrollHeight);

                    // 封禁CP
                    var couple_arr = [
                        {
                            memberA: '133502',
                            memberB: '1738519'
                        }
                    ];
                    let block_couple;
                    for (let i = 0; i < couple_arr.length; i++) {
                        if (
                            CUTE_DATA[room_id].blockIgnore ==
                                couple_arr[i].memberA ||
                            CUTE_DATA[room_id].blockIgnore ==
                                couple_arr[i].memberB
                        ) {
                            CUTE_DATA[room_id].blockIgnore = '';
                            console.log('cp已被封禁');
                            return;
                        }
                        if (msg.block_uid == couple_arr[i].memberA) {
                            block_couple = couple_arr[i].memberB;
                        } else if (msg.block_uid == couple_arr[i].memberB) {
                            block_couple = couple_arr[i].memberA;
                        }
                        // console.log(msg.block_uid, couple_arr[i].memberA, couple_arr[i].memberB);
                        if (block_couple) {
                            console.log('couple: ' + block_couple);
                            CUTE_DATA[room_id].blockIgnore = block_couple;
                            CUTE_API.room.block_user
                                .add(room_id, block_couple, 1)
                                .then(res => {
                                    if (res.code == 0) {
                                        console.log('禁言成功');
                                        CUTE_MODULE.danmaku.queue_add(
                                            `封禁用户存在CP，同步封禁CP用户|･ω･｀)`,
                                            room_id
                                        );
                                    } else {
                                        CUTE_MODULE.danmaku.queue_add(
                                            `封禁用户存在CP，CP用户已在小黑屋|･ω･｀)`,
                                            room_id
                                        );
                                    }
                                    CUTE_DATA[room_id].blockIgnore = '';
                                });
                            break;
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
                break;
            // 弹幕
            case 'DANMU_MSG':
            case 'DANMU_MSG:4:0:2:2:2:0':
                try {
                    if (~CUTE_DATA[room_id].danmaku_filter.indexOf(msg.text)) {
                        return;
                    }
                    CUTE_MODULE.danmaku.show(msg, room_id);
                    // 黑名单自动禁言
                    let blacklist = CUTE_CONFIG[room_id].BLACKLIST;
                    switch (room_id) {
                        case '6570610':
                            if (msg.uid == 382117992 || msg.uid == 258518077) {
                                blacklist.push(msg.uid);
                            }

                            break;
                        default:
                            break;
                    }
                    if (
                        blacklist.length !== 0 &&
                        blacklist.indexOf(msg.uid) != -1
                    ) {
                        console.log('触发黑名单自动禁言');
                        return CUTE_MODULE.block.add(
                            room_id,
                            msg.uid,
                            720,
                            'blacklist'
                        );
                    }

                    // 忽略名单返回
                    let ignorelist = CUTE_CONFIG[room_id].IGNORELIST || [];
                    if (
                        ignorelist.length !== 0 &&
                        ignorelist.indexOf(msg.uid) != -1 &&
                        msg.text.indexOf('求求萌萌兽把我从小黑屋里放出来吧') == -1
                    ) {
                        return;
                    }

                    let permission = 0;
                    // 指令管理
                    if (msg.text.indexOf('*') == 0) {
                        if (
                            msg.uid == 64131034 ||
                            msg.uid == 193351 ||
                            msg.uid == 2309133
                        ) {
                            permission += 9999;
                        }
                        if (msg.uid == CUTE_DATA[room_id].ROOM_INFO.ruid) {
                            permission += 5000;
                        }
                        if (msg.admin) {
                            permission += 1000;
                        }
                        if (msg.guard) {
                            permission += 1 / msg.guard * 600;
                        }
                        if (
                            CUTE_DATA[room_id].MEDAL_INFO &&
                            msg.medal_name ==
                                CUTE_DATA[room_id].MEDAL_INFO.medal_name
                        ) {
                            permission += msg.medal_level * 10;
                        }
                        if (msg.user_level) {
                            permission += Math.round(msg.user_level * 0.1);
                        }
                        // console.log(`用户权限：${permission}`);
                        switch (msg.text.split(' ')[0].split('*')[1]) {
                            case 'admin':
                                if (
                                    permission >=
                                    CUTE_CONFIG[room_id].PERMISSION.author
                                ) {
                                    CUTE_MODULE.danmaku.admin(msg, room_id);
                                } else {
                                    return CUTE_MODULE.danmaku.queue_add(
                                        `拒绝执行！你的权限：${permission}，需要：${CUTE_CONFIG[
                                            room_id
                                        ].PERMISSION.author} |･ω･｀)`,
                                        room_id
                                    );
                                }
                                break;
                            case '配置':
                                if (
                                    permission >=
                                    CUTE_CONFIG[room_id].PERMISSION.admin
                                ) {
                                    CUTE_MODULE.danmaku.command(msg, room_id);
                                } else {
                                    return CUTE_MODULE.danmaku.queue_add(
                                        `拒绝执行！你的权限：${permission}，需要：${CUTE_CONFIG[
                                            room_id
                                        ].PERMISSION.admin} |･ω･｀)`,
                                        room_id
                                    );
                                }
                                break;
                            case '功能':
                                CUTE_MODULE.danmaku.cute(
                                    msg,
                                    room_id,
                                    permission
                                );
                                break;
                            case '查询':
                                CUTE_MODULE.danmaku.query(
                                    msg,
                                    room_id,
                                    permission
                                );
                                break;
                            default:
                                break;
                        }
                    } else {
                        // 关键词自动回复
                        if (
                            CUTE_CONFIG[room_id].MODULE_SWITCH.reply &&
                            msg.uid != CUTE_DATA.USER_INFO.uid
                        ) {
                            let keyword = CUTE_CONFIG[room_id].KEYWORD;
                            for (let i = 0; i < keyword.replyArr.length; i++) {
                                if (
                                    ~msg.text.indexOf(
                                        keyword.replyArr[i].keyword
                                    )
                                ) {
                                    console.log(
                                        `%c【${room_id}】关键词：${keyword.replyArr[i]
                                            .keyword}`,
                                        'color: skyblue'
                                    );
                                    let r = Math.floor(
                                        Math.random() *
                                            keyword.replyArr[i].reply.length
                                    );
                                    CUTE_MODULE.danmaku.queue_add(
                                        keyword.replyArr[i].reply[r],
                                        room_id
                                    );
                                    return;
                                }
                            }
                        }
                        if (
                            CUTE_CONFIG[room_id].MODULE_SWITCH.repeat == 2 &&
                            msg.uid != CUTE_DATA.USER_INFO.uid
                        ) {
                            // 复读机
                            if (
                                msg.uid == CUTE_DATA[room_id].repeat_user ||
                                msg.name == CUTE_DATA[room_id].repeat_user
                            ) {
                                CUTE_MODULE.danmaku.queue_add(
                                    msg.text,
                                    room_id
                                );
                                return;
                            }
                        }
                    }
                    // }
                } catch (err) {
                    console.log(err);
                }
                break;

            default:
                try {
                } catch (err) {
                    console.log(err);
                }
                break;
        }
    };

    // 弹幕管理器（休眠模式
    let CUTE_SLEEP_MODE_MGR = msg => {
        let room_id = msg.room_id;
        switch (msg.cmd) {
            // 点亮牌牌
            // case 'MESSAGEBOX_USER_MEDAL_CHANGE':
            //     try {
            //         if (
            //             msg.is_lighted == 1 &&
            //             msg.up_uid == CUTE_DATA[room_id].ROOM_INFO.ruid
            //         ) {
            //             return CUTE_API.user.search(msg.uid).then(res => {
            //                 if (res.code === 0) {
            //                     let u_name = res.data.name;
            //                     CUTE_MODULE.danmaku.queue_add(
            //                         `${u_name} 点亮了${msg.medal_level}级${msg.medal_name}，欢迎肥家~♡`
            //                     );
            //                 }
            //             });
            //         } else {
            //             console.log('勋章处于熄灭状态！');
            //         }
            //     } catch (e) {
            //         console.log('啊这怎么报错了呢~');
            //     }
            //     break;
            // 特殊礼物刷屏
            case 'SPECIAL_GIFT':
                try {
                    if (msg.storm) {
                        if (msg.storm_action == 'start') {
                            CUTE_DATA[room_id].danmaku_filter.push(
                                msg.storm_content
                            );
                        } else if (msg.storm_action == 'end') {
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
                break;
            // 开启天选抽奖
            case 'ANCHOR_LOT_START':
                try {
                    CUTE_DATA[room_id].danmaku_filter.push(msg.anchor_content);
                    if (CUTE_CONFIG[room_id].MODULE_SWITCH.follow == 1) {
                        CUTE_CONFIG[room_id].MODULE_SWITCH.follow = 0;
                        setTimeout(() => {
                            CUTE_CONFIG[room_id].MODULE_SWITCH.follow = 1;
                        }, msg.time * 1000);
                    }
                } catch (err) {
                    console.log(err);
                }
                break;
            // 封禁提示
            case 'ROOM_BLOCK_MSG':
                let danmuItem = `<div class="danmu-item c-flex c-align-center" style="color: #f8878d;">@${msg.block_uname} 被房管无情制裁了</div>`;
                // 控制弹幕输出数量为100以内
                if (
                    $(`#${room_id} .danmu_container`).children().length >= 100
                ) {
                    $(`#${room_id} .danmu_container`)
                        .children(`:lt(50)`)
                        .remove();
                }
                // 输出新弹幕
                $(`#${room_id} .danmu_container`).append(`
                            ${danmuItem}
                            `);
                // 弹幕池滚动
                let scrollHeight = $(`#${room_id} .danmu_container`).prop(
                    'scrollHeight'
                );
                $(`#${room_id} .danmu_container`).scrollTop(scrollHeight);
                break;
            case 'DANMU_MSG':
            case 'DANMU_MSG:4:0:2:2:2:0':
                try {
                    if (~CUTE_DATA[room_id].danmaku_filter.indexOf(msg.text)) {
                        return;
                    }
                    CUTE_MODULE.danmaku.show(msg, room_id);
                    // 黑名单自动禁言
                    let blacklist = CUTE_CONFIG[room_id].BLACKLIST;
                    switch (room_id) {
                        case '6570610':
                            if (msg.uid == 382117992 || msg.uid == 258518077) {
                                blacklist.push(msg.uid);
                            }

                            break;
                        default:
                            break;
                    }
                    if (
                        blacklist.length !== 0 &&
                        blacklist.indexOf(msg.uid) != -1
                    ) {
                        console.log('触发黑名单自动禁言');
                        return CUTE_MODULE.block.add(
                            room_id,
                            msg.uid,
                            720,
                            'blacklist'
                        );
                    }

                    // 忽略名单返回
                    let ignorelist = CUTE_CONFIG[room_id].IGNORELIST || [];
                    if (
                        ignorelist.length !== 0 &&
                        ignorelist.indexOf(msg.uid) != -1 &&
                        msg.text.indexOf('求求萌萌兽把我从小黑屋里放出来吧') == -1
                    ) {
                        return;
                    }

                    let permission = 0;
                    // 指令管理
                    if (msg.text.indexOf('*') == 0) {
                        if (msg.uid == 64131034 || msg.uid == 193351) {
                            permission += 9999;
                        }
                        if (msg.uid == CUTE_DATA[room_id].ROOM_INFO.ruid) {
                            permission += 5000;
                        }
                        if (msg.admin) {
                            permission += 1000;
                        }
                        if (msg.guard) {
                            permission += 1 / msg.guard * 600;
                        }
                        if (
                            msg.medal_name ==
                            CUTE_DATA[room_id].MEDAL_INFO.medal_name
                        ) {
                            permission += msg.medal_level * 10;
                        }
                        if (msg.user_level) {
                            permission += Math.round(msg.user_level * 0.1);
                        }
                        // console.log(`用户权限：${permission}`);
                        switch (msg.text.split(' ')[0].split('*')[1]) {
                            case 'admin':
                                if (
                                    permission >=
                                    CUTE_CONFIG[room_id].PERMISSION.author
                                ) {
                                    CUTE_MODULE.danmaku.admin(msg, room_id);
                                } else {
                                    return CUTE_MODULE.danmaku.queue_add(
                                        `拒绝执行！你的权限：${permission}，需要：${CUTE_CONFIG[
                                            room_id
                                        ].PERMISSION.author} |･ω･｀)`,
                                        room_id
                                    );
                                }
                                break;
                            case '配置':
                                if (
                                    permission >=
                                    CUTE_CONFIG[room_id].PERMISSION.admin
                                ) {
                                    CUTE_MODULE.danmaku.command(msg, room_id);
                                } else {
                                    return CUTE_MODULE.danmaku.queue_add(
                                        `拒绝执行！你的权限：${permission}，需要：${CUTE_CONFIG[
                                            room_id
                                        ].PERMISSION.admin} |･ω･｀)`,
                                        room_id
                                    );
                                }
                                break;
                            case '功能':
                                CUTE_MODULE.danmaku.cute(
                                    msg,
                                    room_id,
                                    permission
                                );
                                break;
                            case '查询':
                                CUTE_MODULE.danmaku.query(
                                    msg,
                                    room_id,
                                    permission
                                );
                                break;
                            default:
                                break;
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
                break;
            // 开播
            case 'LIVE':
                try {
                    if (!CUTE_DATA[room_id].liveCD) {
                        CUTE_DATA[room_id].liveCD = true;
                        setTimeout(() => {
                            CUTE_DATA[room_id].liveCD = false;
                        }, 1e4);
                    } else {
                        return;
                    }
                    if (typeof msg.live_id == 'number') {
                        console.log(
                            `%c【${room_id}】${CUTE_MODULE.tsFormatter(
                                new Date() / 1000,
                                'time'
                            )} 直播开始`,
                            'color: skyblue'
                        );
                        let startCtx = {
                            631: `♡ 鸽叽鸽叽鸽叽鸽叽鸽叽鸽叽，阿姨洗铁路|･ω･｀)`,
                            189: `♡ 啊，是我最喜欢的小狐妖开播了|･ω･｀)`,
                            223: `♡ 咕才是世界的常态……然而居然开播了|･ω･｀)`,
                            64566: `♡ 第一次看直播，刚点进这个直播间就开播了|･ω･｀)`,
                            176190: `♡ 小酸奶你来辣！那就让我一口吃掉好了|･ω･｀)`
                        };
                        if (startCtx[room_id]) {
                            CUTE_MODULE.danmaku.queue_add(
                                startCtx[room_id],
                                room_id
                            );
                        } else {
                            CUTE_MODULE.danmaku.queue_add(
                                `♡ 第一次看直播，刚点进这个直播间就开播了|･ω･｀)`,
                                room_id
                            );
                        }
                        CUTE_ROBOT.connect.init(room_id, 'common');
                        if (
                            window.Notification &&
                            Notification.permission !== 'denied'
                        ) {
                            Notification.requestPermission(function(status) {
                                let notification = new Notification('真香警告', {
                                    body:
                                        CUTE_MODULE.tsFormatter(
                                            new Date() / 1000
                                        ) +
                                        ' ' +
                                        CUTE_DATA[room_id].ROOM_INFO.uname +
                                        '出现了！我就是饿死也不会去看一眼！'
                                });
                                notification.onclick = function() {
                                    window.open(
                                        'https://live.bilibili.com/' +
                                            CUTE_DATA[room_id].ROOM_INFO
                                                .short_id
                                    );
                                };
                            });
                        }
                        // $('.connect_full').click();
                    }
                } catch (err) {
                    console.log(err);
                }
                break;
            // 上船
            case 'GUARD_BUY':
                try {
                    let username_limit =
                        msg.username.length < 10
                            ? msg.username
                            : `${msg.username.substr(
                                  0,
                                  2
                              )}**${msg.username.substr(
                                  msg.username.length - 3
                              )}`;
                    if (msg.price == 50000) {
                        return CUTE_MODULE.danmaku.queue_add(
                            `[一週間${msg.gift_name}] ${username_limit} 关于舰长的记忆只有一周（误`,
                            room_id
                        );
                    } else if (
                        CUTE_DATA[room_id].ROOM_INFO.guard_list.indexOf(
                            msg.uid
                        ) != -1
                    ) {
                        return CUTE_MODULE.danmaku.queue_add(
                            `[续费${msg.gift_name}] ${username_limit} 一直续船一直爽！`,
                            room_id
                        );
                    } else {
                        CUTE_DATA[room_id].ROOM_INFO.guard_list.push(msg.uid);
                        CUTE_MODULE.danmaku.queue_add(
                            `[新${msg.gift_name}] ${username_limit} 上船了，我地位-1！`,
                            room_id
                        );
                        setTimeout(() => {
                            let whisperCtx = {
                                631: `\\n欢迎新舰长，我地位-1！\\n\\n恶魔的舰长QQ群：870309615，欢迎加入♡\\n\\n私信由叽气人自动发送，无需回复|･ω･｀)`,
                                189: `\\n欢迎新舰长，我地位-1！\\n\\n狐妖的舰长QQ群：568744231，欢迎来玩♡\\n\\n私信由叽气人自动发送，无需回复|･ω･｀)`,
                                223: `\\n欢迎新舰长，我地位-1！\\n\\n可可的舰长QQ群：88479489，欢迎加入♡\\n\\n私信由叽气人自动发送，无需回复|･ω･｀)`,
                                64566: `\\n跪谢老板٩(๑^o^๑)۶对猫猫的船票支持！\\n\\n猫猫的欢乐舰长QQ群：823316645，快来一起玩耍吧٩(๑^o^๑)۶\\n\\n私信由叽气人自动发送，无需回复|･ω･｀)`
                            };
                            if (whisperCtx[room_id]) {
                                CUTE_MODULE.whisper(
                                    msg.uid,
                                    msg.username,
                                    `{"content":"[${CUTE_MODULE.tsFormatter(
                                        new Date() / 1000
                                    )}] ${whisperCtx[room_id]}"}`,
                                    room_id,
                                    'guard'
                                );
                            } else {
                                console.log(`【${room_id}】没有设置舰长群，不能发送私信|･ω･｀)`);
                            }
                        }, 5e3);
                    }
                } catch (err) {
                    console.log(err);
                }

                break;
            default:
                break;
        }
    };

    // 弹幕管理器（聊天模式
    let CUTE_CHAT_MODE_MGR = msg => {
        let room_id = msg.room_id;
        // console.log(msg.cmd);
        switch (msg.cmd) {
            // 特殊礼物刷屏
            case 'SPECIAL_GIFT':
                try {
                    if (msg.storm) {
                        if (msg.storm_action == 'start') {
                            CUTE_DATA[room_id].danmaku_filter.push(
                                msg.storm_content
                            );
                        } else if (msg.storm_action == 'end') {
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
                break;
            // 开启天选抽奖
            case 'ANCHOR_LOT_START':
                try {
                    CUTE_DATA[room_id].danmaku_filter.push(msg.anchor_content);
                    if (CUTE_CONFIG[room_id].MODULE_SWITCH.follow == 1) {
                        CUTE_CONFIG[room_id].MODULE_SWITCH.follow = 0;
                        setTimeout(() => {
                            CUTE_CONFIG[room_id].MODULE_SWITCH.follow = 1;
                        }, msg.time * 1000);
                    }
                } catch (err) {
                    console.log(err);
                }
                break;
            // 封禁提示
            case 'ROOM_BLOCK_MSG':
                let danmuItem = `<div class="danmu-item c-flex c-align-center" style="color: #f8878d;">@${msg.block_uname} 被房管无情制裁了</div>`;
                // 控制弹幕输出数量为100以内
                if (
                    $(`#${room_id} .danmu_container`).children().length >= 100
                ) {
                    $(`#${room_id} .danmu_container`)
                        .children(`:lt(50)`)
                        .remove();
                }
                // 输出新弹幕
                $(`#${room_id} .danmu_container`).append(`
                            ${danmuItem}
                            `);
                // 弹幕池滚动
                let scrollHeight = $(`#${room_id} .danmu_container`).prop(
                    'scrollHeight'
                );
                $(`#${room_id} .danmu_container`).scrollTop(scrollHeight);
                break;
            case 'DANMU_MSG':
            case 'DANMU_MSG:4:0:2:2:2:0':
                try {
                    if (~CUTE_DATA[room_id].danmaku_filter.indexOf(msg.text)) {
                        return;
                    }
                    CUTE_MODULE.danmaku.show(msg, room_id);
                    // 黑名单自动禁言
                    let blacklist = CUTE_CONFIG[room_id].BLACKLIST;
                    switch (room_id) {
                        case '6570610':
                            if (msg.uid == 382117992 || msg.uid == 258518077) {
                                blacklist.push(msg.uid);
                            }

                            break;
                        default:
                            break;
                    }
                    if (
                        blacklist.length !== 0 &&
                        blacklist.indexOf(msg.uid) != -1
                    ) {
                        console.log('触发黑名单自动禁言');
                        return CUTE_MODULE.block.add(
                            room_id,
                            msg.uid,
                            720,
                            'blacklist'
                        );
                    }
                    if (
                        CUTE_CONFIG[room_id].MODULE_SWITCH.repeat == 2 &&
                        msg.uid != CUTE_DATA.USER_INFO.uid
                    ) {
                        // 复读机
                        if (
                            msg.uid == CUTE_DATA[room_id].repeat_user ||
                            msg.name == CUTE_DATA[room_id].repeat_user
                        ) {
                            CUTE_MODULE.danmaku.queue_add(msg.text, room_id);
                            return;
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
                break;
            default:
                break;
        }
    };
    CUTE_ROBOT.init();
})();
