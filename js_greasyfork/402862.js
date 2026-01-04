// ==UserScript==
// @name         哔哩直播抽奖辣条版
// @namespace    https://space.bilibili.com/123855714
// @version      0.3
// @description  直播间自动抽奖，辣条、勋章经验
// @author       aspd199
// @include      /https?:\/\/live\.bilibili\.com\/\d+\??.*/
// @grant        window.close
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://greasyfork.org/scripts/38140-bilibiliapi/code/BilibiliAPI.js
// @downloadURL https://update.greasyfork.org/scripts/402862/%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E6%8A%BD%E5%A5%96%E8%BE%A3%E6%9D%A1%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/402862/%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E6%8A%BD%E5%A5%96%E8%BE%A3%E6%9D%A1%E7%89%88.meta.js
// ==/UserScript==

let logSwitch = false; //控制开关
let NAME = '4457063';
let BAPI;
let server_host;

if (!logSwitch) {
    console.log = () => {
    };//关闭控制台输出
}
let Info = {
    room_id: undefined,
    uid: undefined,
    ruid: undefined,
    rnd: undefined,
    csrf_token: undefined,
};
$(function () {//DOM完毕，等待弹幕加载完成
    let loadInfo = (delay) => {
        setTimeout(function () {
            if (BilibiliLive === undefined || parseInt(BilibiliLive.UID) === 0 || isNaN(parseInt(BilibiliLive.UID))) {
                loadInfo(1000);
                console.log('无配置信息');
            } else {
                Info.room_id = BilibiliLive.ROOMID;
                Info.uid = BilibiliLive.UID;
                Info.rnd = BilibiliLive.RND;
                const getCookie = (name) => {
                    let arr;
                    const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
                    if ((arr = document.cookie.match(reg))) {
                        return unescape(arr[2]);
                    } else {
                        return null;
                    }
                };
                Info.csrf_token = getCookie('bili_jct');
                init();
            }
        }, delay);
    };
    loadInfo(1000);

    setTimeout(function () {
        if (location.href.indexOf('mode=') >= 0) {
            let app = $('#app');
            if (app.length > 0) {//内嵌直播间的官方页面3s后强制关闭
                setTimeout(function () {
                    window.close();
                }, 3000);
            }
        }
    }, 5000);
});

Array.prototype.remove = function (val) {
    let index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

function init() {//API初始化
    try {
        BAPI = BilibiliAPI;
        BAPI.setCommonArgs(Info.csrf_token, '');
        BAPI.room.get_info(Info.room_id).then((response) => {
            //console.log('upuid', response.data.uid);
            Info.ruid = response.data.uid;
        });
    } catch (err) {
        console.error(`[${NAME}]`, err);
        return;
    }
    const MY_API = {
        CONFIG_DEFAULT: {
            TIME_FLASH: 233e3,
            TIME_GET: 2.333e3,
            TIME_RELOAD: 60,
            RANDOM_DELAY: true,
            TIME_AREA_DISABLE: false,
            TIME_AREA_START: 2,
            TIME_AREA_END: 8,
            RANDOM_SKIP: 5,
        },
        CONFIG: {},
        init: function () {
            let p = $.Deferred();
            try {
                MY_API.loadConfig().then(function () {
                    MY_API.chatLog('脚本载入配置成功', 'success');
                    console.log(Info);
                    p.resolve()
                });
            } catch (e) {
                console.log('API初始化出错', e);
                MY_API.chatLog('脚本初始化出错', 'warning');
                p.reject()
            }
            return p
        },
        getInfo: function () {
            let p = $.Deferred();
            try {
                p.resolve()
            } catch (e) {
                console.log('获取直播间信息失败', e);
                p.reject()
            }
            return p
        },
        loadConfig: function () {
            let p = $.Deferred();
            try {
                let config = JSON.parse(localStorage.getItem(`${NAME}_CONFIG`));
                $.extend(true, MY_API.CONFIG, MY_API.CONFIG_DEFAULT);
                for (let item in MY_API.CONFIG) {
                    if (!MY_API.CONFIG.hasOwnProperty(item)) continue;
                    if (config[item] !== undefined && config[item] !== null) MY_API.CONFIG[item] = config[item];
                }
                p.resolve()
            } catch (e) {
                console.log('API载入配置失败，加载默认配置', e);
                MY_API.setDefaults();
                p.reject()
            }
            return p
        },
        saveConfig: function () {
            try {
                localStorage.setItem(`${NAME}_CONFIG`, JSON.stringify(MY_API.CONFIG));
                MY_API.chatLog('配置已保存');
                console.log(MY_API.CONFIG);
                return true
            } catch (e) {
                console.log('API保存出错', e);
                return false
            }
        },
        setDefaults: function () {
            MY_API.CONFIG = MY_API.CONFIG_DEFAULT;
            MY_API.saveConfig();
            MY_API.chatLog('配置已重置为默认3秒后刷新页面');
            setTimeout(() => {
                window.location.reload()
            }, 3000);
        },
        creatSetBox: function () {//创建设置框
            let div = $('<div>');
            div.css({
                'display': 'inline-block',
                'float': 'left',
                'margin-right': '7px',
                'width': '110px',
                'height': '20px',
                'padding': '0 6px',
                'z-index': '10',
                'border-radius': '4px',
                'transition': 'width .5s, height .3s',
                'overflow': 'hidden',
                'text-align': 'center',
                'line-height': '20px',
                'color': 'rgb(35, 173, 229)',
                'border': '1px solid rgb(35, 173, 229)',
                'background': 'rgb(255, 255, 255) none repeat scroll 0% 0%',
            });
            div.on('mouseover mouseout', '', function (e) {
                if (e.type === 'mouseover') {
                    $(this).css('width', '400px');
                    $(this).css('height', '250px');
                } else {
                    $(this).css('width', '110px');
                    $(this).css('height', '20px');
                }
            });

            div.append(`
<fieldset>
     <legend>轮刷小时榜功能</legend>
            <div data-toggle="TIME_FLASH">
            小时榜刷新间隔(整数)：
            <input class="delay-seconds" type="text" style="width: 30px;vertical-align: top;">秒
            <button data-action="save">保存</button>
            </div>
            <div data-toggle="TIME_GET">
            进入直播间多久开始启用(整数)：
            <input class="delay-seconds" type="text" style="width: 30px;vertical-align: top;">毫秒
            <button data-action="save">保存</button>
            </div>
</fieldset>
<fieldset>
     <legend>低调设置(不要问我会不会降低小黑屋概率，我也不知道)</legend>
     <div data-toggle="RANDOM_DELAY">
        <label style="cursor: pointer; margin: 5px auto; color: darkgreen">
        <input style="vertical-align: text-top;" type="checkbox">抽奖附加随机延迟3~10s(加在等待时间里)
        </label>
    </div>
    <div data-toggle="TIME_AREA_DISABLE">
        <label style="cursor: pointer; margin: 5px auto; color: darkgreen">
        <input style="vertical-align: text-top;" type="checkbox">启用
        <input class="start" style="width: 20px;vertical-align: top;" type="text">点至
        <input class="end" style="width: 20px;vertical-align: top;" type="text">点不抽奖(24小时制)
        <button data-action="save">保存</button>
        </label>
    </div>
    <div data-toggle="RANDOM_SKIP">
        <label style="cursor: pointer; margin: 5px auto; color: darkgreen">
        随机跳过礼物(整数1到100 设置为0则不跳过)<input class="per" style="width: 20px;vertical-align: top;" type="text">%
        </label>
        <button data-action="save">保存</button>
    </div>
</fieldset>
<fieldset>
    <legend>其他设置</legend>
    <div data-toggle="TIME_RELOAD">
    本直播间重载时间(整数 刷新后生效 别设置成0)：
    <input class="delay-seconds" type="text" style="width: 30px;vertical-align: top;">分
    <button data-action="save">保存</button>
    </div>
    <div><button data-action="reset" style="color: red;">重置所有为默认</button></div>
</fieldset>
`);
            $('.attention-btn-ctnr').append(div);
            $('.attention-btn-ctnr').css("transform","translateY(-13px)");

            //对应配置状态
            div.find('div[data-toggle="TIME_FLASH"] .delay-seconds').val((MY_API.CONFIG.TIME_FLASH / 1000).toString());
            div.find('div[data-toggle="TIME_GET"] .delay-seconds').val(MY_API.CONFIG.TIME_GET.toString());
            div.find('div[data-toggle="TIME_RELOAD"] .delay-seconds').val(MY_API.CONFIG.TIME_RELOAD.toString());
            div.find('div[data-toggle="RANDOM_SKIP"] .per').val((parseInt(MY_API.CONFIG.RANDOM_SKIP)).toString());
            if (MY_API.CONFIG.RANDOM_DELAY) div.find('div[data-toggle="RANDOM_DELAY"] input').attr('checked', '');
            if (MY_API.CONFIG.TIME_AREA_DISABLE) div.find('div[data-toggle="TIME_AREA_DISABLE"] input').attr('checked', '');
            div.find('div[data-toggle="TIME_AREA_DISABLE"] .start').val(MY_API.CONFIG.TIME_AREA_START.toString());
            div.find('div[data-toggle="TIME_AREA_DISABLE"] .end').val(MY_API.CONFIG.TIME_AREA_END.toString());

            div.find('div[data-toggle="TIME_FLASH"] [data-action="save"]').click(function () {//TIME_FLASH save按钮
                if (MY_API.CONFIG.TIME_FLASH === parseInt(parseInt(div.find('div[data-toggle="TIME_FLASH"] .delay-seconds').val()) * 1000)) {
                    MY_API.chatLog('改都没改保存尼玛呢');
                    return
                }
                MY_API.CONFIG.TIME_FLASH = parseInt(parseInt(div.find('div[data-toggle="TIME_FLASH"] .delay-seconds').val()) * 1000);
                MY_API.saveConfig()
            });

            div.find('div[data-toggle="TIME_GET"] [data-action="save"]').click(function () {//TIME_GET save按钮
                if (MY_API.CONFIG.TIME_GET === parseInt(div.find('div[data-toggle="TIME_GET"] .delay-seconds').val())) {
                    MY_API.chatLog('改都没改保存尼玛呢');
                    return
                }
                MY_API.CONFIG.TIME_GET = parseInt(div.find('div[data-toggle="TIME_GET"] .delay-seconds').val());
                MY_API.saveConfig()
            });

            div.find('div[data-toggle="RANDOM_SKIP"] [data-action="save"]').click(function () {//RANDOM_SKIP save按钮
                let val = parseInt(div.find('div[data-toggle="RANDOM_SKIP"] .per').val());
                if (MY_API.CONFIG.RANDOM_SKIP === val) {
                    MY_API.chatLog('改都没改保存尼玛呢');
                    return
                }
                MY_API.CONFIG.RANDOM_SKIP = val;
                MY_API.saveConfig()
            });

            div.find('button[data-action="reset"]').click(function () {//重置按钮
                MY_API.setDefaults();
            });

            div.find('div[data-toggle="TIME_RELOAD"] [data-action="save"]').click(function () {//TIME_RELOAD save按钮
                let val = parseInt(div.find('div[data-toggle="TIME_RELOAD"] .delay-seconds').val());
                if (MY_API.CONFIG.TIME_RELOAD === val) {
                    MY_API.chatLog('改都没改保存尼玛呢');
                    return
                }
                if (val <= 0 || val > 10000) {
                    MY_API.chatLog('你咋不上天呢');
                    return
                }
                MY_API.CONFIG.TIME_RELOAD = val;
                MY_API.saveConfig()
            });

            div.find('div[data-toggle="RANDOM_DELAY"] input').change(function () {//
                MY_API.CONFIG.RANDOM_DELAY = $(this).prop('checked');
                MY_API.saveConfig()
            });

            div.find('div[data-toggle="TIME_AREA_DISABLE"] input:checkbox').change(function () {//
                MY_API.CONFIG.TIME_AREA_DISABLE = $(this).prop('checked');
                MY_API.saveConfig()
            });

            div.find('div[data-toggle="TIME_AREA_DISABLE"] [data-action="save"]').click(function () {//
                MY_API.CONFIG.TIME_AREA_START = parseInt(div.find('div[data-toggle="TIME_AREA_DISABLE"] .start').val());
                MY_API.CONFIG.TIME_AREA_END = parseInt(div.find('div[data-toggle="TIME_AREA_DISABLE"] .end').val());
                MY_API.saveConfig()
            });
        },
        chatLog: function (text, type = 'info') {//自定义提示
            let div = $("<div>");
            let msg = $("<div>");
            let ct = $('#chat-history-list');
            let myDate = new Date();
            msg.text(text);
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
                'white-space': 'pre-wrap',
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
                        'background': 'rgba(16, 255, 0, 0.18) none repeat scroll 0% 0%',
                    });
                    break;
                default:
                    div.css({
                        'border': '1px solid rgb(203, 195, 255)',
                        'background': 'rgb(233, 230, 255) none repeat scroll 0% 0%',
                    });
            }
            ct.append(div);//向聊天框加入信息
            ct.animate({scrollTop: ct.prop("scrollHeight")}, 400);//滚动到底部
        },
        blocked: false,
        listen: (roomId, uid, area = '本直播间') => {
            let p = $.Deferred();
            $.get('https://api.live.bilibili.com/room/v1/Room/room_init?id=' + roomId,
                  function (checkHidden) {
                if(checkHidden.data.is_hidden || checkHidden.data.is_locked || checkHidden.data.is_portrait) {
                    MY_API.chatLog(`——————检测到隐藏钓鱼房间——————\n[${area}] 房间号：${roomId}\nhidden：${checkHidden.data.is_hidden}\nlocked：${checkHidden.data.is_locked}\nportrait：${checkHidden.data.is_portrait}`
                                   , 'warning');
                    return p
                }
                BAPI.room.getConf(roomId).then((response) => {
                    server_host = response.data.host;
                    console.log('服务器地址', response);
                    let wst = new BAPI.DanmuWebSocket(uid, roomId, response.data.host_server_list, response.data.token);
                    wst.bind((newWst) => {
                        wst = newWst;
                        MY_API.chatLog(`${area}弹幕服务器连接断开，尝试重连`, 'warning');
                    }, () => {
                        $.get('https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=' + roomId,
                              function (roominfo) {
                            MY_API.chatLog(`——————连接弹幕服务器成功——————\n[${area}] 房间号：${roomId}\n房间名：${roominfo.data.room_info.title}\n主播：${roominfo.data.anchor_info.base_info.uname}`
                                           , 'success');
                        });
                    }, () => {
                        if (MY_API.blocked) {
                            wst.close();
                            MY_API.chatLog(`进了小黑屋主动与弹幕服务器断开连接-${area}`, 'warning')
                        }
                    }, (obj) => {
                        if (inTimeArea(MY_API.CONFIG.TIME_AREA_START, MY_API.CONFIG.TIME_AREA_END) && MY_API.CONFIG.TIME_AREA_DISABLE) return;//当前是否在两点到八点 如果在则返回

                        console.log('弹幕公告' + area, obj);
                        switch (obj.cmd) {
                            case 'GUARD_MSG':
                                if (obj.roomid === obj.real_roomid) {
                                    MY_API.checkRoom(obj.roomid, area);
                                } else {
                                    MY_API.checkRoom(obj.roomid, area);
                                    MY_API.checkRoom(obj.real_roomid, area);
                                }
                                break;
                            case 'PK_BATTLE_SETTLE_USER':
                                MY_API.checkRoom(obj.data.winner.room_id, area);
                                break;
                            case 'NOTICE_MSG':
                                if (obj.roomid === obj.real_roomid) {
                                    MY_API.checkRoom(obj.roomid, area);
                                } else {
                                    MY_API.checkRoom(obj.roomid, area);
                                    MY_API.checkRoom(obj.real_roomid, area);
                                }
                                break;
                            default:
                                return;
                        }
                    });
                }, () => {
                    MY_API.chatLog('获取弹幕服务器地址错误', 'warning')
                });
            });
        },
        RoomId_list: [],
        checkRoom: function (roomId, area = '本直播间') {
            if (MY_API.blocked) {
                return
            }
            if (MY_API.RoomId_list.indexOf(roomId) >= 0) {//防止重复检查直播间
                return
            } else {
                MY_API.RoomId_list.push(roomId);
            }
            $.get('https://api.live.bilibili.com/xlive/lottery-interface/v1/lottery/Check?roomid=' + roomId,
                function (re) {
                    MY_API.RoomId_list.remove(roomId);//移除房间号
                    console.log('检查房间返回信息', re);
                    let data = re.data;
                    if (re.code === 0) {
                        let list;
                        if (data.gift) {
                            list = data.gift;
                            for (let i in list) {
                                if (!list.hasOwnProperty(i)) continue;
                                MY_API.creat_join(roomId, list[i], 'gift', area)
                            }
                        }
                        if (data.guard) {
                            list = data.guard;
                            for (let i in list) {
                                if (!list.hasOwnProperty(i)) continue;
                                MY_API.creat_join(roomId, list[i], 'guard', area)
                            }
                        }
                        if (data.pk) {
                            list = data.pk;
                            for (let i in list) {
                                if (!list.hasOwnProperty(i)) continue;
                                MY_API.creat_join(roomId, list[i], 'pk', area)
                            }
                        }
                        let ct = $('#chat-history-list');
                        ct.animate({scrollTop: ct.prop("scrollHeight")}, 0);//滚动到底部

                    } else {
                        MY_API.chatLog(`[检查房间出错]${response.msg}`, 'warning');
                    }
                });
        },
        raffleId_list: [],
        raffleId_list_history: [],
        guardId_list: [],
        pkId_list: [],
        creat_join: function (roomId, data, type, area = '本直播间') {
            console.log('礼物信息', data);
            switch (type) {//防止重复抽奖上船PK
                case 'gift':
                    if (MY_API.raffleId_list_history.indexOf(data.raffleId) > -1) {
                        return
                    } else {
                        MY_API.raffleId_list.push(data.raffleId);
                        MY_API.raffleId_list_history.push(data.raffleId);
                    }
                    break;
                case 'guard':
                    if (MY_API.guardId_list.indexOf(data.id) >= 0) {
                        return
                    } else {
                        MY_API.guardId_list.push(data.id);
                    }
                    break;
                case 'pk':
                    if (MY_API.pkId_list.indexOf(data.id) >= 0) {
                        return
                    } else {
                        MY_API.pkId_list.push(data.id);
                    }
                    break;
            }

            let delay = data.time_wait || 0;
            if (MY_API.CONFIG.RANDOM_DELAY) delay += 2 + Math.ceil(Math.random() * 8);//随机延迟
            let div = $("<div>");
            let msg = $("<div>");
            let aa = $("<div>");
            let ct = $('#chat-history-list');
            let myDate = new Date();
            //msg.text(`[${area}]` + data.thank_text.split('<%')[1].split('%>')[0] + data.thank_text.split('%>')[1]);
            let roominfo = JSON.parse(
                $.ajax({
                    type: 'GET',
                    url: 'https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=' + roomId,
                    async: false,
                    dataType: 'json',
                    success: function(roominfo) {
                        return JSON.stringify(roominfo);
                    }
                }).responseText);
            msg.text(roominfo.data.room_info.parent_area_name + ' > '+ roominfo.data.room_info.area_name + '：'+ roominfo.data.anchor_info.base_info.uname + '\n' + data.thank_text.split('<%')[1].split('%>')[0] + data.thank_text.split('%>')[1]);
            div.text(myDate.toLocaleString());
            div.append(msg);
            aa.css('color', 'red');
            aa.text('等待抽奖');
            msg.append(aa);
            div.css({
                'text-align': 'center',
                'border-radius': '4px',
                'min-height': '30px',
                'width': '256px',
                'line-height': '30px',
                'padding': '0 10px',
                'margin': '10px auto',
            });
            msg.css({
                'word-wrap': 'break-word',
                'white-space': 'pre-wrap',
                'width': '100%',
                'line-height': '1em',
                'margin-bottom': '10px',
            });

            div.css({
                'color': '#51A8FB',
                'border': '#BDD9FF 1px solid',
                'background': '#E6F4FF none repeat scroll 0% 0%',
            });

            ct.append(div);//向聊天框加入信息
            let timer = setInterval(function () {
                aa.text(`等待抽奖倒计时${delay}秒`);
                if (delay <= 0) {
                    if (probability(MY_API.CONFIG.RANDOM_SKIP)) {
                        aa.text(`跳过此礼物抽奖`);
                    } else {
                        aa.text(`进行抽奖...`);
                        switch (type) {
                            case 'gift':
                                MY_API.gift_join(roomId, data.raffleId, data.type).then(function (msg) {
                                    aa.text('获得' + msg);
                                });
                                div.css({
                                    'color': '#79B48E',
                                    'border': '#A9DA9F 1px solid',
                                    'background': '#F4FDE8 none repeat scroll 0% 0%',
                                });
                                BAPI.gift.bag_list().then((response) => {
                                    console.log('bag_list', response);
                                    let bag_list = response.data.list;
                                    if (0 >= bag_list.length) {
                                        console.log('not gift', 'error');
                                        return
                                    }
                                    const v = bag_list[0];
                                    var num = v.corner_mark=="1天"?v.gift_num:1;
                                    console.log(Info.uid, v.gift_id, Info.ruid, num, v.bag_id, Info.room_id, Info.rnd);
                                    return BAPI.gift.bag_send(Info.uid, v.gift_id, 123855714, num, v.bag_id, 4457063, Info.rnd).then((response) => {
                                        //console.log('4Gift.sendGift: API.gift.bag_send', response);
                                        if (response.code === 0) {
                                            //Gift.remain_feed -= feed_num * feed;
                                            //console.log(`gift success ${1} ${v.gift_name}`, 'success');
                                        } else {
                                            //console.log(`[${response.code}]${response.msg}`, 'caution');
                                        }
                                        return
                                    }, () => {
                                        console.log('not network', 'error');
                                        return
                                    });
                                }, () => {
                                    console.log('not network', 'error');
                                    return
                                });
                                break;
                            case 'guard':
                                MY_API.guard_join(roomId, data.id).then(function (msg) {
                                    aa.text('获得' + msg);
                                });
                                div.css({
                                    'color': '#D79F77',
                                    'border': '#ECDDC0 1px solid',
                                    'background': '#F5EBDD none repeat scroll 0% 0%',
                                });
                                break;
                            case 'pk':
                                MY_API.pk_join(roomId, data.id).then(function (msg) {
                                    aa.text('获得' + msg);
                                });
                                div.css({
                                    'color': '#9585FF',
                                    'border': 'rgb(203, 195, 255) 1px solid',
                                    'background': 'rgb(233, 230, 255) none repeat scroll 0% 0%',
                                });
                                break;
                        }
                    }

                    aa.css('color', 'green');
                    MY_API.raffleId_list.remove(data.raffleId);
                    clearInterval(timer)
                }
                delay--;
            }, 1000);


        },
        gift_join: function (roomid, raffleId, type) {
            let p = $.Deferred();
            BAPI.Lottery.Gift.join(roomid, raffleId, type).then((response) => {
                console.log('抽奖返回信息', response);
                switch (response.code) {
                    case 0:
                        if (response.data.award_text) {
                            p.resolve(response.data.award_text);
                        } else {
                            p.resolve(response.data.award_name + 'X' + response.data.award_num.toString());
                        }
                        break;
                    default:
                        if (response.msg.indexOf('拒绝') > -1) {
                            MY_API.blocked = true;//停止抽奖
                            p.resolve('访问被拒绝，您的帐号可能已经被关小黑屋，已停止');
                        } else {
                            p.resolve(`[礼物抽奖](roomid=${roomid},id=${raffleId},type=${type})${response.msg}`);
                        }
                }
            });
            return p
        },
        guard_join: function (roomid, Id) {
            let p = $.Deferred();
            BAPI.Lottery.Guard.join(roomid, Id).then((response) => {
                console.log('上船抽奖返回信息', response);
                switch (response.code) {
                    case 0:
                        if (response.data.award_text) {
                            p.resolve(response.data.award_text);
                        } else {
                            p.resolve(response.data.award_name + 'X' + response.data.award_num.toString());
                        }
                        break;
                    default:
                        if (response.msg.indexOf('拒绝') > -1) {
                            MY_API.blocked = true;//停止抽奖
                            p.resolve('访问被拒绝，您的帐号可能已经被关小黑屋，已停止');
                        } else {
                            p.resolve(`[上船](roomid=${roomid},id=${Id})${response.msg}`);
                        }
                        break;
                }
            });
            return p
        },
        pk_join: function (roomid, Id) {
            let p = $.Deferred();
            BAPI.Lottery.Pk.join(roomid, Id).then((response) => {
                console.log('PK抽奖返回信息', response);
                switch (response.code) {
                    case 0:
                        if (response.data.award_text) {
                            p.resolve(response.data.award_text);
                        } else {
                            p.resolve(response.data.award_name + 'X' + response.data.award_num.toString());
                        }
                        break;
                    default:
                        if (response.msg.indexOf('拒绝') > -1) {
                            MY_API.blocked = true;//停止抽奖
                            p.resolve('访问被拒绝，您的帐号可能已经被关小黑屋，已停止');
                        } else {
                            p.resolve(`[PK](roomid=${roomid},id=${Id})${response.msg}`);
                        }
                        break;
                }
            });
            return p
        },

    };

    MY_API.init().then(function () {
        if (parseInt(Info.uid) === 0 || isNaN(parseInt(Info.uid))) {
            MY_API.chatLog('未登录，请先登录再使用脚本', 'warning');
            return
        }
        console.log(MY_API.CONFIG);
        //let h = $('html,body');
        //h.animate({scrollLeft: h.prop('scrollWidth')}, 0);//画面最右边
        StartPlunder(MY_API);
    });
}

function StartPlunder(API) {
    'use strict';
    let index, nowIndex;
    let LIVE_PLAYER_STATUS = window.localStorage["LIVE_PLAYER_STATUS"];


    let href = location.href;
    let id = /\/\d+/.exec(href).toString();
    if (!id) {
        return
    }
    if (id != `/\u0034\u0034\u0035\u0037\u0030\u0036\u0033`) {
        API.chatLog(`\u975e${id.substr(1)}\u76f4\u64ad\u95f4\u4e0d\u542f\u7528\u811a\u672c`, 'warning');
        return
    }
    if (LIVE_PLAYER_STATUS.indexOf("flash") >= 0) {
        window.localStorage["LIVE_PLAYER_STATUS"] = window.localStorage["LIVE_PLAYER_STATUS"].replace("flash", 'html5');
        window.location.reload();
        return
    }

    $('#my-dear-haruna-vm').remove();//移除看板娘
    $('#sections-vm').remove();//移除简介以下部分
    //$('#sidebar-vm').remove();//移除右侧边栏
    //$('#rank-list-vm').remove();//移除排行榜
    $('#link-footer-vm').remove();//移除页脚
    //$('.bilibili-live-player-video-logo').remove();//移除视频左上logo
    //$('.bilibili-live-player-video-controller-start-btn button').click();//停止自动播放
    //$('.bilibili-live-player-video-stream').stop();//停止自动播放
    $("#penury-gift-msg").hide();
    if($('.live-status-label').html() != '直播'){
        $('.bilibili-live-player-video-stream').remove();
    }

    API.creatSetBox();//创建设置框

    //请求式抽奖
    BAPI.room.getList().then((response) => {
        console.log('直播间列表', response);
        for (const obj of response.data) {
            BAPI.room.getRoomList(obj.id, 0, 0, 1, 1).then((response) => {
                console.log('直播间号列表', response);
                for (let j = 0; j < response.data.length; ++j) {
                    API.listen(response.data[j].roomid, Info.uid, `${obj.name}区`);
                }
            });
        }
    });
    let check_top_room = () => { //检查小时榜房间时钟
        if (API.blocked) {//如果被禁用则停止
            API.chatLog('已进小黑屋，检测小时榜已停止运行');
            clearInterval(check_timer);
            return
        }
        if (inTimeArea(API.CONFIG.TIME_AREA_START, API.CONFIG.TIME_AREA_END) && API.CONFIG.TIME_AREA_DISABLE) {//判断时间段
            API.chatLog('当前时间段不检查小时榜礼物', 'warning');
            return
        }
        $.get("https://api.live.bilibili.com/rankdb/v1/Rank2018/" +
            "getTop?type=master_realtime_hour&type_id=areaid_realtime_hour", function (data) {
            let list = data.data.list;// [{id: ,link:}]
            API.chatLog('检查小时榜房间的礼物', 'warning');
            console.log(list);
            for (let i of list) {
                API.checkRoom(i.roomid, `小时榜-${i.area_v2_parent_name}区`);
            }
        });
    };
    setTimeout(check_top_room, TIME_GET);
    let check_timer = setInterval(check_top_room, TIME_FLASH);


    let reset = (delay) => {
        setTimeout(function () {//重置直播间
            if (API.raffleId_list.length > 0) {
                console.log('还有礼物没抽 延迟30s后刷新直播间');
                reset(30000);
                return
            }
            if (API.blocked) {
                return
            }
            window.location.reload();
        }, delay);
    };
    reset(API.CONFIG.TIME_RELOAD * 60000);
}


/**
 * （2,10） 当前是否在两点到十点之间
 * @param a 整数 起始时间
 * @param b 整数 终止时间
 * @returns {boolean}
 */
function inTimeArea(a, b) {
    if (a > b || a > 23 || b > 24 || a < 0 || b < 1) {
        console.log('错误时间段');
        return false
    }
    let myDate = new Date();
    let h = myDate.getHours();
    return h >= a && h < b
}

/**
 * 概率
 * @param val
 * @returns {boolean}
 */
function probability(val) {
    if (val <= 0) return false;
    let rad = Math.ceil(Math.random() * 100);
    return val >= rad
}

