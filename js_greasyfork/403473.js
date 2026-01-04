// ==UserScript==
// @name         阿沐限定辣条姬_浪行舟版
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  快速升级B站粉丝牌牌,为你心爱的主播打call
// @author      作者:浪行舟    借鉴:逆回十六夜的部分代码  
// @include      /https?:\/\/live\.bilibili\.com\/\d+\??.*/
// @include      /https?:\/\/live\.bilibili\.com/blanc/\d+\??.*/
// @require      https://greasyfork.org/scripts/38140-bilibiliapi/code/BilibiliAPI.js
// @require      https://greasyfork.org/scripts/44866-ocrad/code/OCRAD.js
// @downloadURL https://update.greasyfork.org/scripts/403473/%E9%98%BF%E6%B2%90%E9%99%90%E5%AE%9A%E8%BE%A3%E6%9D%A1%E5%A7%AC_%E6%B5%AA%E8%A1%8C%E8%88%9F%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/403473/%E9%98%BF%E6%B2%90%E9%99%90%E5%AE%9A%E8%BE%A3%E6%9D%A1%E5%A7%AC_%E6%B5%AA%E8%A1%8C%E8%88%9F%E7%89%88.meta.js
// ==/UserScript==
/*
[greasyfork源]//出问题请自行切换
// @require      https://greasyfork.org/scripts/38140-bilibiliapi/code/BilibiliAPI.js
// @require      https://greasyfork.org/scripts/44866-ocrad/code/OCRAD.js
[gitee源]//出问题请自行切换
// @require      https://gitee.com/SeaLoong/Bilibili-LRHH/raw/master/BilibiliAPI.js
// @require      https://gitee.com/SeaLoong/Bilibili-LRHH/raw/master/OCRAD.min.js
[腾讯云源]//出问题请自行切换
// @require      https://js-1258131272.file.myqcloud.com/BilibiliAPI.js
// @require      https://js-1258131272.file.myqcloud.com/OCRAD.min.js
[jsDelivr源]//出问题请自行切换
// @require      https://cdn.jsdelivr.net/gh/SeaLoong/Bilibili-LRHH/BilibiliAPI.js
// @require      https://cdn.jsdelivr.net/gh/SeaLoong/Bilibili-LRHH/OCRAD.min.js
*/

let NAME = 'ZDBGJ';
let BAPI;
let server_host;
let ZBJ= '你的阿沐';
// let room_id='10010100000110100100001010111';//房间号二进制化,淘汰不用 
let fjh='102200310201113';//房间号四进制化,第一次调用和服务器核对
let ROMMld='2240644127';//房间号八进制化,第二次调用和服务器核对
let ROMM1d='310593623';//房间号十进制化,第三次调用和服务器核对
let rooMlD='12834857';//房间号十六进制化,第四次调用和服务器核对
let rooM1D='986i2n';//房间号三十二进制化,第五次调用和服务器核对
//console.log = () => {
//    };//关闭控制台输出

let Live_info = {room_id: undefined, uid: undefined};
$(function () {//DOM完毕，等待弹幕加载完成
    let loadInfo = (delay) => {
        setTimeout(function () {
            if (BilibiliLive === undefined || parseInt(BilibiliLive.UID) === 0 || isNaN(parseInt(BilibiliLive.UID))) {
                loadInfo(5000);
                console.log('无配置信息');
                init();
            } else {
                Live_info.room_id = BilibiliLive.ROOMID;
                Live_info.uid = BilibiliLive.UID;
                console.log(Live_info);
                init();
            }
        }, delay);
    };
    loadInfo(3000);
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
    } catch (err) {
        console.error(`[${NAME}]`, err);
        return;
    }
    const MY_API = {
        CONFIG_DEFAULT: {
            TIME_FLASH: 10e3,
            TIME_GET: 130,
            TOP: false,
            TALK: false,  //不显示抽奖反馈
            RANDOM_DELAY: true,
            TIMEAREADISABLE: true,
            TIMEAREASTART: 1,
            TIMEAREAEND: 8,
            RANDOMSKIP: 5,
            MAXGIFT: 999999,
            CZ:15,
        },

        CONFIG: {},
        GIFT_COUNT: {
            COUNT: 0,
            LOVE_COUNT: 0,
            CLEAR_TS: 0,
            TTCOUNT: 0,
            TTLOVE_COUNT: 0,
            DJLVMK:100,
        },
        init: function () {
            let p = $.Deferred();
            try {
                MY_API.loadConfig().then(function () {
                    MY_API.chatLog('脚本载入配置成功', 'success');
                    p.resolve()
                });
            } catch (e) {
                console.log('API初始化出错', e);
                MY_API.chatLog('脚本初始化出错', 'warning');
                p.reject()
            }
            return p
        },
		// let csrf_token, visit_id;
		
		// var BilibiliAPI = {
		//     setCommonArgs: (csrfToken = '', visitId = '') => {
		//         csrf_token = csrfToken;
		//         visit_id = visitId;
		//     },
		//     // 整合常用API
		//     TreasureBox: {
		//         getAward: (time_start, end_time, captcha) => BilibiliAPI.lottery.SilverBox.getAward(time_start, end_time, captcha),
		//         getCaptcha: (ts) => BilibiliAPI.lottery.SilverBox.getCaptcha(ts),
		//         getCurrentTask: () => BilibiliAPI.lottery.SilverBox.getCurrentTask()
		//     },
        loadConfig: function () {
            let p = $.Deferred();
            try {
                let config = JSON.parse(localStorage.getItem(`${NAME}_CONFIG`));
                $.extend(true, MY_API.CONFIG, MY_API.CONFIG_DEFAULT);
                for (let item in MY_API.CONFIG) {
                    if (!MY_API.CONFIG.hasOwnProperty(item)) continue;
                    if (config[item] !== undefined && config[item] !== null) MY_API.CONFIG[item] = config[item];
                }
                MY_API.loadGiftCount();//载入礼物统计
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
            MY_API.chatLog('配置已重置为默认3秒后刷新页面', 'warning');
            setTimeout(() => {
                window.location.reload()
            }, 3000);
        },
        loadGiftCount: function () {
            try {
                let config = JSON.parse(localStorage.getItem(`${NAME}_GIFT_COUNT`));
                for (let item in MY_API.GIFT_COUNT) {
                    if (!MY_API.GIFT_COUNT.hasOwnProperty(item)) continue;
                    if (config[item] !== undefined && config[item] !== null) MY_API.GIFT_COUNT[item] = config[item];
                }
                console.log(MY_API.GIFT_COUNT);
            } catch (e) {
                console.log('读取统计失败', e);
            }
        },
        saveGiftCount: function () {
            try {
                localStorage.setItem(`${NAME}_GIFT_COUNT`, JSON.stringify(MY_API.GIFT_COUNT));
                console.log('统计保存成功', MY_API.GIFT_COUNT);
                return true
            } catch (e) {
                console.log('统计保存出错', e);
                return false
            }
        },
        addGift: function (count) {
            MY_API.GIFT_COUNT.COUNT += count;
            $('#giftCount span:eq(0)').text(MY_API.GIFT_COUNT.COUNT);
            MY_API.saveGiftCount();
        },
        addLove: function (count) {
            MY_API.GIFT_COUNT.LOVE_COUNT += count;
            $('#giftCount span:eq(1)').text(MY_API.GIFT_COUNT.LOVE_COUNT);
            MY_API.saveGiftCount();
        },
        creatSetBox: function () {//创建设置框

            let div = $('<div>');
            div.css({
                'width': '320px',
                'height': '350px',
                'position': 'absolute',
                'top': '110px',
                'right': '10px',
                'background': 'rgba(255,255,255,.8)',
                'padding': '10px',
                'z-index': '-1',
                'border-radius': '12px',
                'transition': 'height .3s',
                'overflow': 'hidden',
            });

               div.on('mouseover mouseout', '', function (e) {
                if (e.type === 'mouseover') {
                    $(this).css('height', '350px');
                    $(this).css('opacity','1.0');
                } else {
                    $(this).css('height', '37px');
                    $(this).css('opacity','0.5');
                }
            });
onclick
            div.append(`
<fieldset>
<legend append style="color: #FF34B3;text-align: left;">欢迎来到<span>${ZBJ}</span>的直播间，糟老头浪行舟(警觉)</a></legend> </div>
<div id="giftCount" style="font-size: large; text-shadow: 1px 1px #00000066; color: blueviolet;">辣条·<span>${MY_API.GIFT_COUNT.COUNT}</span> 亲密度·<span>${MY_API.GIFT_COUNT.LOVE_COUNT}</span></div>

</fieldset>

<fieldset>
<legend append style="color: #FF34B3">插件参数设置</legend></div>
<div data-toggle="TOP">
<input style="vertical-align: text-top;" type="checkbox" ><append style="color: blueA">关闭实时榜抽奖 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<data-toggle="CZ">缓存重置（分）
</div>
<div data-toggle="TALK">
<input style="vertical-align: text-top;" type="checkbox" ><append style="color: blue">隐藏信息提示框 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<input class="CZTIME" style="width: 35px;vertical-align: AUTO;" type="text">
<button data-action="save" style="color: red">保存</button>
</div>

<div data-toggle="RANDOM_DELAY">
<apend style="margin: 5px auto; color: blue">
<input style="vertical-align: text-top;" type="checkbox">抽奖随机延迟（2-10秒后点击抽奖）
</div>


<div data-toggle="MAXGIFT">
<apend style="margin: 5px auto; color: blue">
每日辣条数上限(整数)<input class="num" style="width: 40px;vertical-align: top;" type="text">
<button data-action="save" style="color: red">保存</button>
</div>

<div data-toggle="TIME_GET" style="color: #FF34B3">
礼物点击速度(整数)：
<input class="delay-seconds" type="text" style="width: 30px;vertical-align: top;" style="color: #FF34B3">毫秒
<button data-action="save" style="color: red">保存</button>
</div>

<div data-toggle="RANDOMSKIP">
<apend style="color: purple">
百分比随机跳过礼物<input class="per" style="width: 20px;vertical-align: top;" type="text">%（整数0-100）
<button data-action="save" style="color: red">保存</button>
</div>


<div data-toggle="TIMEAREADISABLE">
<apend style="margin: 5px auto; color: purple">
<input style="vertical-align: text-top;" type="checkbox">启用
<input class="start" style="width: 20px;vertical-align: top;" type="text">点至
<input class="end" style="width: 20px;vertical-align: top;" type="text">点不抽奖（24小时制）
<button data-action="save" style="color: red">保存</button>
</div>
</fieldset>

<fieldset>
<legend append style="color: #FF34B3">温馨提示：本插件仅在以下直播间有效</legend>
<div style="color: red">传送门：<a href="https://live.bilibili.com/12834857" target="_blank">@你的阿沐</a>建议请在晚上捕捉不同形态的阿沐</div>
<div style="color: #FF34B3">欢迎投喂B坷垃/20币/充电50电池领取阿沐勋章[沐有病]</div>
</fieldset>

<fieldset>
<legend append style="color: #FF34B3">你需要立即清空缓存归零吗</legend>
<div id="giftCount" style="color: blue">
归零辣条亲密度，三秒后刷新直播间 <button style="font-size: small" data-action="countReset">重置</button></div>
<div><button data-action="reset" style="color: red;">重置所有为默认</button></div>
</fieldset>

<fieldset>
<legend append style="color: #FF34B3">说明</legend>
<div id="giftCount" style="color: blue">
B站有风控的,不关注进小黑屋概率较高 QAQ
</div>
</fieldset>

`);
// <fieldset>
// <legend append style="color: #FF34B3">说明:</legend>
// <div id="giftCount" style="color: blue">
//     <span style="color: #e600ff">因为你长时间挂在该直播间,建议点击关注,因为B站有风控的,不关注进小黑屋概率较高</span><br>
//     <span style="color: #770080;">随机跳过礼物,请参考自己的直播用户等级</span><br>
//     <span style="color: red;">0-15级,建议:跳过礼物10%-15%,16-25级,建议:跳过礼物7%-13%,25-40级,建议:跳过礼物4%-7%,此数据个人经过两年测试得出</span><br>
//     <span style="color: #488e1d;">如果脚本载入配置成功后没有提示连接弹幕服务器成功的话，请尝试刷新页面,查看
// 	 <a href="https://www.bilibili.com/blackroom/ban" target="_blank">小黑屋</a></span><br>
//     <span style="color: #d58fff;">如果不注意看这些提醒,导致进小黑屋,请不要惊慌一星期后自动解封</span><br>
// 	 <span style="color: #d58fff;">此版本是我修改别人版本定制的,十分感谢提供代码的老哥</span><br>
// </div>
// </fieldset>

              $('.player-ctnr').append(div);
           // $('.player-ctnr').append(tp);

            //对应配置状态
            div.find('div[data-toggle="TIME_FLASH"] .delay-seconds').val((MY_API.CONFIG.TIME_FLASH / 1000).toString());
            div.find('div[data-toggle="TIME_GET"] .delay-seconds').val(MY_API.CONFIG.TIME_GET.toString());
            div.find('div[data-toggle="RANDOMSKIP"] .per').val((parseInt(MY_API.CONFIG.RANDOMSKIP)).toString());
            div.find('div[data-toggle="MAXGIFT"] .num').val((parseInt(MY_API.CONFIG.MAXGIFT)).toString());
            div.find('div[data-toggle="TALK"] .CZTIME').val((parseInt(MY_API.CONFIG.CZ)).toString());
            if (MY_API.CONFIG.TOP) div.find('div[data-toggle="TOP"] input').attr('checked', '');
            if (MY_API.CONFIG.TALK) div.find('div[data-toggle="TALK"] input').attr('checked', '');
            if (MY_API.CONFIG.RANDOM_DELAY) div.find('div[data-toggle="RANDOM_DELAY"] input').attr('checked', '');
            if (MY_API.CONFIG.TIMEAREADISABLE) div.find('div[data-toggle="TIMEAREADISABLE"] input').attr('checked', '');
            div.find('div[data-toggle="TIMEAREADISABLE"] .start').val(MY_API.CONFIG.TIMEAREASTART.toString());
            div.find('div[data-toggle="TIMEAREADISABLE"] .end').val(MY_API.CONFIG.TIMEAREAEND.toString());

            //事件绑定
            div.find('button[data-action="reset"]').click(function () {//重置按钮
                MY_API.setDefaults();
            });
            div.find('div[data-toggle="TIME_FLASH"] [data-action="save"]').click(function () {//TIME_FLASH save按钮
                if (MY_API.CONFIG.TIME_FLASH === parseInt(parseInt(div.find('div[data-toggle="TIME_FLASH"] .delay-seconds').val()) * 1000)) {
                    MY_API.chatLog('改都没改保存嘛呢');
                    return
                }
                MY_API.CONFIG.TIME_FLASH = parseInt(parseInt(div.find('div[data-toggle="TIME_FLASH"] .delay-seconds').val()) * 1000);
                MY_API.saveConfig()
            });

            div.find('div[data-toggle="TIME_GET"] [data-action="save"]').click(function () {//TIME_GET save按钮
                if (MY_API.CONFIG.TIME_GET === parseInt(div.find('div[data-toggle="TIME_GET"] .delay-seconds').val())) {
                    MY_API.chatLog('改都没改保存嘛呢');
                    return
                }
                MY_API.CONFIG.TIME_GET = parseInt(div.find('div[data-toggle="TIME_GET"] .delay-seconds').val());
                MY_API.saveConfig()
            });

            div.find('div[data-toggle="RANDOMSKIP"] [data-action="save"]').click(function () {//RANDOMSKIP save按钮
                let val = parseInt(div.find('div[data-toggle="RANDOMSKIP"] .per').val());
                if (MY_API.CONFIG.RANDOMSKIP === val) {
                    MY_API.chatLog('改都没改保存嘛呢');
                    return
                }
                MY_API.CONFIG.RANDOMSKIP = val;
                MY_API.saveConfig()
            });

            div.find('div[data-toggle="MAXGIFT"] [data-action="save"]').click(function () {//MAXGIFT save按钮
                let val = parseInt(div.find('div[data-toggle="MAXGIFT"] .num').val());
                if (MY_API.CONFIG.MAXGIFT === val) {
                    MY_API.chatLog('改都没改保存嘛呢');
                    return
                }
                MY_API.CONFIG.MAXGIFT = val;
                MY_API.saveConfig()
            });

            div.find('div[data-toggle="TALK"] [data-action="save"]').click(function () {//MAXGIFT save按钮
                let val = parseInt(div.find('div[data-toggle="TALK"] .CZTIME').val());
                if (MY_API.CONFIG.CZ === val) {
                    MY_API.chatLog('改都没改保存嘛呢');
                    return
                }

                if(val<10){
                    MY_API.chatLog('要这么快吗？慢一点吧');
                    val=10

                }else if(val>1000){
                    MY_API.chatLog('你要上天啊?这太慢了吧');
                    val=1000
                }
                MY_API.CONFIG.CZ = val;
                MY_API.saveConfig()
                MY_API.chatLog('重置时间已设置，刷新页面后生效');

            });


            div.find('div[data-toggle="TOP"] input').change(function () {//
                MY_API.CONFIG.TOP = $(this).prop('checked');
                MY_API.saveConfig()
                MY_API.chatLog('提示：打√是关闭刷实时榜哦φ(゜▽゜*)♪');
            });


            div.find('div[data-toggle="TALK"] input').change(function () {//
                MY_API.CONFIG.TALK = $(this).prop('checked');
                if (MY_API.CONFIG.TALK == true) {//自定义提示开关
                    $('.zdbgjMsg').hide(); //隐藏反馈信息
                }
                MY_API.saveConfig()
                MY_API.chatLog('提示：打√是清空聊天栏抽奖反馈，然后再也不显示哦φ(゜▽゜*)♪');
            });


            div.find('div[data-toggle="RANDOM_DELAY"] input').change(function () {//配置随机延迟
                MY_API.CONFIG.RANDOM_DELAY = $(this).prop('checked');
                MY_API.saveConfig()
            });

            div.find('div[data-toggle="TIMEAREADISABLE"] input:checkbox').change(function () {//配置时间区域禁用
                MY_API.CONFIG.TIMEAREADISABLE = $(this).prop('checked');
                MY_API.saveConfig()
            });

            div.find('div[data-toggle="TIMEAREADISABLE"] [data-action="save"]').click(function () {//开始结束时间
                MY_API.CONFIG.TIMEAREASTART = parseInt(div.find('div[data-toggle="TIMEAREADISABLE"] .start').val());
                MY_API.CONFIG.TIMEAREAEND = parseInt(div.find('div[data-toggle="TIMEAREADISABLE"] .end').val());
                MY_API.saveConfig()
            });

            if(Live_info.room_id === 12834857){
                div.css({
                    'z-index': '10',
                });}

             div.find('#giftCount [data-action="countReset"]').click(function () {//
                MY_API.GIFT_COUNT = {
                    COUNT: 0,
                    LOVE_COUNT: 0,
                    CLEAR_TS: 0,
                };
                MY_API.saveGiftCount();
               MY_API.chatLog('辣条亲密度正在清零，3秒后刷新页面');
               setTimeout(() => {
                   window.location.reload()
                }, 3000);
            });

        },



        chatLog: function (text, type = 'info') {//自定义提示
            let div = $("<div class='zdbgjMsg'>");
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
                'color': '#00B2EE',
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
            BAPI.room.getConf(roomId).then((response) => {
                server_host = response.data.host;
                console.log('服务器地址', response);
                let wst = new BAPI.DanmuWebSocket(uid, roomId, response.data.host_server_list, response.data.token);
                wst.bind((newWst) => {
                    wst = newWst;
                    if (MY_API.GIFT_COUNT.CLEAR_TS) {
                        MY_API.chatLog(`【${area}】弹幕服务器连接断开，尝试重连`, 'warning');
                    }
                }, () => {
                    if (MY_API.GIFT_COUNT.CLEAR_TS) {
                        MY_API.chatLog(`【${area}】连接弹幕服务器成功 `, 'success');
                    }
                }, () => {
                    if (MY_API.blocked) {
                        wst.close();
                        MY_API.chatLog(`进了小黑屋主动与弹幕服务器断开连接-【${area}】`, 'warning')
                    }
                }, (obj) => {
                    if (inTimeArea(MY_API.CONFIG.TIMEAREASTART, MY_API.CONFIG.TIMEAREAEND) && MY_API.CONFIG.TIMEAREADISABLE) return;//当前是否在两点到八点 如果在则返回
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
                    if (MY_API.GIFT_COUNT.COUNT >= MY_API.CONFIG.MAXGIFT) {//判断是否超过辣条限制
                        console.log('超过今日辣条限制，不参与抽奖');
                        return
                    }
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
                    if (MY_API.GIFT_COUNT.COUNT >= MY_API.CONFIG.MAXGIFT) {//判断是否超过辣条限制
                        console.log('超过今日辣条限制，不参与抽奖');
                        return
                    }
                    if (MY_API.pkId_list.indexOf(data.id) >= 0) {
                        return
                    } else {
                        MY_API.pkId_list.push(data.id);
                    }
                    break;
            }

            let delay = data.time_wait || 0;
            if (MY_API.CONFIG.RANDOM_DELAY) delay += 2 + Math.ceil(Math.random() * 8);//随机延迟
            let div = $("<div class='zdbgjMsg'>");
            let msg = $("<div>");
            let aa = $("<div>");
            let ct = $('#chat-history-list');
            let myDate = new Date();
            msg.text(`【${area}】` + data.thank_text.split('<%')[1].split('%>')[0] + data.thank_text.split('%>')[1]);
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

            div.css({
                'border': '1px solid rgb(203, 195, 255)',
                'background': 'rgb(233, 230, 255) none repeat scroll 0% 0%',
            });


            if (MY_API.CONFIG.TALK == false) {//自定义提示开关
                ct.append(div);//向聊天框加入信息
            }


            let timer = setInterval(function () {
                aa.text(`等待抽奖倒计时${delay}秒`);
                if (delay <= 0) {
                    if (probability(MY_API.CONFIG.RANDOMSKIP)) {
                        aa.text(`跳过此礼物抽奖`);
                    } else {
                        aa.text(`进行抽奖...`);
                        switch (type) {
                            case 'gift':
                                MY_API.gift_join(roomId, data.raffleId, data.type).then(function (msg, num) {
                                    aa.text('获得' + msg);
                                    if (num && msg.indexOf('辣条') >= 0) {
                                        MY_API.addGift(num);
                                    }
                                });
                                break;
                            case 'guard':
                                MY_API.guard_join(roomId, data.id).then(function (msg, num) {
                                    aa.text('获得' + msg);
                                    if (num) {
                                        MY_API.addLove(num);
                                    }
                                });
                                break;
                            case 'pk':
                                MY_API.pk_join(roomId, data.id).then(function (msg, num) {
                                    aa.text('获得' + msg);
                                    if (num && msg.indexOf('辣条') >= 0) {
                                        MY_API.addGift(num);
                                    }
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
                            p.resolve(response.data.award_text, response.data.award_num);
                        } else {
                            p.resolve(response.data.award_name + 'X' + response.data.award_num.toString()
                                      , response.data.award_num);
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
                            p.resolve(response.data.award_text, response.data.award_num);
                        } else {
                            p.resolve(response.data.award_name + 'X' + response.data.award_num.toString()
                                      , response.data.award_num);
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
                            p.resolve(response.data.award_text, response.data.award_num);
                        } else {
                            p.resolve(response.data.award_name + 'X' + response.data.award_num.toString()
                                      , response.data.award_num);
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
        if (parseInt(Live_info.uid) === 0 ||isNaN(parseInt(Live_info.uid))) {
            MY_API.chatLog('未登录，请先登录再使用脚本', 'warning');
            return
        }
        console.log(MY_API.CONFIG);
        StartPlunder(MY_API);
        //let h = $('html,body');
        //h.animate({scrollLeft: h.prop('scrollWidth')}, 0);//画面最右边
    });
}



function StartPlunder(API) {
    'use strict';
    let index, nowIndex,fengling;
    let LIVE_PLAYER_STATUS = window.localStorage["LIVE_PLAYER_STATUS"];

    if (Live_info.room_id === 12834857) {
        if (LIVE_PLAYER_STATUS.indexOf("flash") >= 0) {
            window.localStorage["LIVE_PLAYER_STATUS"] = window.localStorage["LIVE_PLAYER_STATUS"].replace("flash", 'html5');
            window.location.reload();
            return
        }


        let LT_Timer = () => {//判断是否清空辣条数量
            if (checkNewDay(API.GIFT_COUNT.CLEAR_TS)) {
                API.GIFT_COUNT.COUNT = 0;
                API.GIFT_COUNT.LOVE_COUNT = 0;
                API.GIFT_COUNT.CLEAR_TS = dateNow();
                API.saveGiftCount();
                console.log('清空辣条数量')
            } else {
                console.log('无需清空辣条数量')
            }
        };
        setInterval(LT_Timer, 60e3);
        LT_Timer();
        API.creatSetBox();//创建设置框

        BAPI.room.getList().then((response) => {//获取各分区的房间号
            console.log('直播间列表', response);
            for (const obj of response.data) {
                BAPI.room.getRoomList(obj.id, 0, 0, 1, 1).then((response) => {
                    console.log('直播间号列表', response);
                    for (let j = 0; j < response.data.length; ++j) {
                        API.listen(response.data[j].roomid, Live_info.uid, `${obj.name}区`);
                    }
                });
            }
        });
        let check_top_room = () => { //检查实时榜房间时钟

            if (API.blocked) {//如果被禁用则停止
                API.chatLog('已进小黑屋，检测实时榜已停止运行');
                clearInterval(check_timer);
                return
            }
            if (inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE) {//判断时间段
                API.chatLog('当前时间段不检查实时榜礼物', 'warning');
                return
            }

            if (API.CONFIG.TOP) {

                return
            } else {

                $.get("https://api.live.bilibili.com/rankdb/v1/Rank2018/" +
                      "getTop?type=master_realtime_hour&type_id=areaid_realtime_hour", function (data) {
                    let list = data.data.list;// [{id: ,link:}]
                    API.chatLog('检查实时榜房间的礼物', 'warning');
                    console.log(list);
                    for (let i of list) {
                        API.checkRoom(i.roomid, `实时榜-${i.area_v2_parent_name}区`);
                    }
                });
            }

        };
        let check_timer = setInterval(check_top_room, 90e3);


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
        reset(API.CONFIG.CZ * 60000);

    }

    else {

        API.chatLog('插件未启用，请前往限定直播间开启!', 'warning');
        let csm = $('<apend style="position: absolute; top: 128px; left: 1;right: 1;z-index: 1;background-color:#FFFAFA;color:red;border-radius: 4px;border: none;padding: 5px;box-shadow: 1px 1px 2px #00000075;resizable:no">' +
                    '插件限定直播间：' +
                    '<div style="color:#FF34B3">传送门：<a href="https://live.bilibili.com/12834857" target="_blank">@你的阿沐</a>建议请在晚上捕捉不同形态的阿沐</div>');
        $('.chat-history-panel').append(csm);
        return
    }


    function mode_old() {
        try {
            index = getUrlParam("index");
            nowIndex = parseInt(index) + 1;
            if (nowIndex === 12) {
                nowIndex = 0;
            }
            if (isNaN(nowIndex)) nowIndex = 0;
        } catch (error) {
            nowIndex = 0;
        }
        setInterval(function () {
            $(".main").click();//点击抽奖
            $(".draw-full-cntr .function-bar").click();//点击抽奖
        }, parseInt(API.CONFIG.TIME_GET));
        setInterval(function () {
            goTop(nowIndex);//跳转到下一个直播间
        }, API.CONFIG.TIME_FLASH);
    }

    function goTop(index) {
        $.get("https://api.live.bilibili.com/rankdb/v1/Rank2018/getTop?type=master_realtime_hour&type_id=areaid_realtime_hour", function (data) {
            let list = data.data.list;// [{id: ,link:}]
            let link = list[index].link;
            let href = parent.location.href;
            //
            if (href.match(/\/\d+/) != null) {
                href = href.replace(/\/\d+/, link);
            } else {
                href = 'https://live.bilibili.com' + link;
            }
            //
            if (href.indexOf('index') >= 0) {
                href = href.replace(/index=\d+/, 'index=' + nowIndex);
            } else {
                if (href.indexOf('?') >= 0) {
                    href += '&index=' + nowIndex;
                } else {
                    href += '?index=' + nowIndex;
                }
            }
            //
            parent.location.href = href;
        });
    }
}

function yinchang(){
	div.find('div[data-toggle="TALK"] input').change(function () {//
	    MY_API.CONFIG.TALK = $(this).prop('checked');
	    if (MY_API.CONFIG.TALK == true) {//自定义提示开关
	        $('.zdbgjMsg').hide(); //隐藏反馈信息
	    }
	    MY_API.saveConfig()
	    MY_API.chatLog('提示：打√是清空聊天栏抽奖反馈，然后再也不显示哦φ(゜▽゜*)♪');
	});
}
function getUrlParam(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/**
 * （16,20） 当前是否在16点到20点之间
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

const dateNow = () => Date.now();
/**
 * 检查是否为新一天
 * @param ts
 * @returns {boolean}
 */
const checkNewDay = (ts) => {
    if (ts === 0) return true;
    let t = new Date(ts);
    let d = new Date();
    let td = t.getDate();
    let dd = d.getDate();
    return (dd !== td);
};






