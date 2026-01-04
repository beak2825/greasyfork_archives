// ==UserScript==
// @name         直播间挂机抢辣条
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  自动抢辣条，直播间挂机全b站抢辣条，注意只能在b站房间号为22001178的直播间使用
// @author       QIN-AN秦安
// @include      /https?:\/\/live\.bilibili\.com\/\d+\??.*/
// @include      /https?:\/\/live\.bilibili\.com/blanc/\d+\??.*/
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://greasyfork.org/scripts/38140-bilibiliapi/code/BilibiliAPI.js
// @downloadURL https://update.greasyfork.org/scripts/399399/%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8C%82%E6%9C%BA%E6%8A%A2%E8%BE%A3%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/399399/%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8C%82%E6%9C%BA%E6%8A%A2%E8%BE%A3%E6%9D%A1.meta.js
// ==/UserScript==
let NAME = 'ZDBGJ';
let BAPI;
let server_host;
let ZBJ= '略略略';
let CJ;
let riqi

riqi = new Date();
let yue= riqi.getMonth()+1;
let ri=riqi.getDate();
let xiaoshi=riqi.getHours();
let fenzhong=riqi.getMinutes();
let jishu=0;
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
            TIME_GET: 233,
            TOP: false,
            TALK: false,  //不显示抽奖反馈
            RANDOM_DELAY: true,
            TIMEAREADISABLE: false,
            TIMEAREASTART: 2,
            TIMEAREAEND: 8,
            RANDOMSKIP: 0,
            MAXGIFT: 99999,
            CZ:180,
        },

        CONFIG: {},
        GIFT_COUNT: {
            COUNT: 0,
            LOVE_COUNT: 0,
            CLEAR_TS: 0,
            TTCOUNT: 0,
            TTLOVE_COUNT: 0,
            BPJY:0,
            BPDJ:1,
            DJLVMK:100,
        },
        init: function () {
            let p = $.Deferred();
            try {
                MY_API.loadConfig().then(function () {
                MY_API.chatLog('脚本载入配置成功，运行自动签到', 'success');
                //MY_API.GIFT_COUNT.CLEAR_TS = dateNow();
                setTimeout(() => {
                $("div.checkin-btn.t-center.pointer").click();
            }, 3000);
        if (MY_API.GIFT_COUNT.BPDJ<20) {
               CJ='筑基白嫖怪';
            } else if(MY_API.GIFT_COUNT.BPDJ<30){
               CJ='旋照白嫖怪'
            } else if(MY_API.GIFT_COUNT.BPDJ<40){
               CJ='辟谷白嫖怪'
            } else if(MY_API.GIFT_COUNT.BPDJ<50){
               CJ='结丹白嫖怪'
            } else if(MY_API.GIFT_COUNT.BPDJ<60){
               CJ='元婴白嫖怪'
            } else if(MY_API.GIFT_COUNT.BPDJ<70){
               CJ='出窍白嫖怪'
            } else if(MY_API.GIFT_COUNT.BPDJ<80){
               CJ='分神白嫖怪';
            } else if(MY_API.GIFT_COUNT.BPDJ<90){
               CJ='合体白嫖怪'
            }else if(MY_API.GIFT_COUNT.BPDJ<100){
               CJ='渡劫白嫖怪'
            }else if(MY_API.GIFT_COUNT.BPDJ<200){
               CJ='渡劫成功'
            }else if(MY_API.GIFT_COUNT.BPDJ<300){
               CJ='白嫖仙人'
            }else if(MY_API.GIFT_COUNT.BPDJ<400){
               CJ='白嫖地仙'
            }else if(MY_API.GIFT_COUNT.BPDJ<500){
               CJ='白嫖天仙'
            }else if(MY_API.GIFT_COUNT.BPDJ<600){
               CJ='白嫖玄仙'
            }else if(MY_API.GIFT_COUNT.BPDJ<700){
               CJ='白嫖神境'
            }else if(MY_API.GIFT_COUNT.BPDJ<900){
               CJ='白嫖神人'
            }else if(MY_API.GIFT_COUNT.BPDJ<1200){
               CJ='白嫖准神'
            }else if(MY_API.GIFT_COUNT.BPDJ<1500){
               CJ='白嫖主神'
            }else if(MY_API.GIFT_COUNT.BPDJ<2000){
               CJ='白嫖神王'
            }else if(MY_API.GIFT_COUNT.BPDJ>=2000){
               CJ='白嫖天尊'
            }
                    p.resolve()
                });
            } catch (e) {
                console.log('API初始化出错', e);
                MY_API.chatLog('脚本初始化出错', 'warning');
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
            MY_API.chatLog('肉身破灭，转世投胎，重修仙路！', 'warning');
            CJ='筑基白嫖怪';
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

        cjcheck: function () {
            if (MY_API.GIFT_COUNT.BPDJ<20) {
               CJ='筑基白嫖怪';
            } else if(MY_API.GIFT_COUNT.BPDJ==20){
               CJ='旋照白嫖怪'
               MY_API.chatLog('仙路漫漫，道法天成，恭喜你成为【旋照白嫖怪】');
            } else if(MY_API.GIFT_COUNT.BPDJ==30){
               CJ='辟谷白嫖怪'
                MY_API.chatLog('仙路漫漫，道法天成，恭喜你成为【避谷白嫖怪】');
            } else if(MY_API.GIFT_COUNT.BPDJ==40){
               CJ='结丹白嫖怪'
               MY_API.chatLog('仙路漫漫，道法天成，恭喜你成为【结丹白嫖怪】');
            } else if(MY_API.GIFT_COUNT.BPDJ==50){
               CJ='元婴白嫖怪'
                MY_API.chatLog('仙路漫漫，道法天成，恭喜你成为【元婴白嫖怪】');
            } else if(MY_API.GIFT_COUNT.BPDJ==60){
               CJ='出窍白嫖怪'
               MY_API.chatLog('仙路漫漫，道法天成，恭喜你成为【出窍白嫖怪】');
            } else if(MY_API.GIFT_COUNT.BPDJ==70){
               CJ='分神白嫖怪';
               MY_API.chatLog('仙路漫漫，道法天成，恭喜你成为【分神白嫖怪】');
            } else if(MY_API.GIFT_COUNT.BPDJ==80){
               CJ='合体白嫖怪'
               MY_API.chatLog('仙路漫漫，道法天成，恭喜你成为【合体白嫖怪】');
            }else if(MY_API.GIFT_COUNT.BPDJ==90){
               CJ='渡劫白嫖怪'
               MY_API.chatLog('仙路漫漫，道法天成，恭喜你成为【渡劫白嫖怪】');
            }else if(MY_API.GIFT_COUNT.BPDJ==100){
               CJ='大乘白嫖怪'
               MY_API.chatLog('仙路漫漫，道法天成，恭喜你成为【大乘白嫖怪】');
            }else if(MY_API.GIFT_COUNT.BPDJ==200){
               CJ='仙人白嫖怪'
               MY_API.chatLog('仙路漫漫，道法天成，恭喜你成为【仙人白嫖怪】');
            }else if(MY_API.GIFT_COUNT.BPDJ==300){
               CJ='地仙白嫖怪'
               MY_API.chatLog('仙路漫漫，道法天成，恭喜你成为【地仙白嫖怪】');
            }else if(MY_API.GIFT_COUNT.BPDJ==400){
               CJ='天仙白嫖怪'
               MY_API.chatLog('仙路漫漫，道法天成，恭喜你成为【天仙白嫖怪】');
            }else if(MY_API.GIFT_COUNT.BPDJ==500){
               CJ='玄仙白嫖怪'
               MY_API.chatLog('仙路漫漫，道法天成，恭喜你成为【玄仙白嫖怪】');
            }else if(MY_API.GIFT_COUNT.BPDJ==600){
               CJ='神境白嫖怪'
               MY_API.chatLog('仙路漫漫，道法天成，恭喜你成为【神境白嫖怪】');
            }else if(MY_API.GIFT_COUNT.BPDJ==700){
               CJ='神人白嫖怪'
               MY_API.chatLog('仙路漫漫，道法天成，恭喜你成为【神人白嫖怪】');
            }else if(MY_API.GIFT_COUNT.BPDJ==900){
               CJ='准神白嫖怪'
               MY_API.chatLog('仙路漫漫，道法天成，恭喜你成为【准神白嫖怪】');
            }else if(MY_API.GIFT_COUNT.BPDJ==1200){
               CJ='主神白嫖怪'
               MY_API.chatLog('仙路漫漫，道法天成，恭喜你成为【主神白嫖怪】');
            }else if(MY_API.GIFT_COUNT.BPDJ==1500){
               CJ='神王白嫖怪'
               MY_API.chatLog('仙路漫漫，道法天成，恭喜你成为【神王白嫖怪】');
            }else if(MY_API.GIFT_COUNT.BPDJ>=2000){
               CJ='天尊白嫖怪'
               MY_API.chatLog('仙路漫漫，道法天成，恭喜你成为修仙至尊【天尊白嫖怪】');
            }
            console.log('成就',CJ);

        },
        addGift: function (count) {
            MY_API.GIFT_COUNT.COUNT += count;
            MY_API.GIFT_COUNT.TTCOUNT+= count;
            let BPJY=MY_API.GIFT_COUNT.BPJY
            MY_API.GIFT_COUNT.BPJY += count*4;
            if (MY_API.GIFT_COUNT.BPJY >= MY_API.GIFT_COUNT.DJLVMK && BPJY < MY_API.GIFT_COUNT.DJLVMK ) {
                MY_API.GIFT_COUNT.BPDJ +=1;
                MY_API.cjcheck();
                MY_API.GIFT_COUNT.DJLVMK +=1000
                MY_API.chatLog('ohhh恭喜你升级了ヾ(o◕∀◕)ﾉヾ');
            }
            console.log('等级',MY_API.GIFT_COUNT.BPDJ);
            $('#TTgiftCount span:eq(0)').text(MY_API.GIFT_COUNT.TTCOUNT);
            $('#giftCount span:eq(2)').text(MY_API.GIFT_COUNT.COUNT);
            $('#giftCount span:eq(0)').text(yue);
            $('#giftCount span:eq(1)').text(ri);
            $('#giftCoun span:eq(0)').text(MY_API.GIFT_COUNT.COUNT);
            MY_API.saveGiftCount();
            $('#CJ span:eq()').text(CJ);
            $('#BPJY span:eq(0)').text(MY_API.GIFT_COUNT.BPJY);
            $('#BPJY span:eq(1)').text(MY_API.GIFT_COUNT.BPDJ);
        },
        addLove: function (count) {
            MY_API.GIFT_COUNT.LOVE_COUNT += count;
            MY_API.GIFT_COUNT.TTLOVE_COUNT += count;
            let BPJY=MY_API.GIFT_COUNT.BPJY
            MY_API.GIFT_COUNT.BPJY += count*6;
             if (MY_API.GIFT_COUNT.BPJY >= MY_API.GIFT_COUNT.DJLVMK && BPJY < MY_API.GIFT_COUNT.DJLVMK ) {
                MY_API.GIFT_COUNT.BPDJ +=1;
                MY_API.cjcheck();
                MY_API.GIFT_COUNT.DJLVMK +=1000
                MY_API.chatLog('恭喜你升级了ヾ(o◕∀◕)ﾉヾ');
            }
            console.log('等级',MY_API.GIFT_COUNT.BPDJ);
            $('#TTgiftCount span:eq(1)').text(MY_API.GIFT_COUNT.TTLOVE_COUNT);
            $('#giftCount span:eq(3)').text(MY_API.GIFT_COUNT.LOVE_COUNT);
            $('#giftCoun span:eq(1)').text(MY_API.GIFT_COUNT.LOVE_COUNT);
            MY_API.saveGiftCount();
            $('#BPJY span:eq(0)').text(MY_API.GIFT_COUNT.BPJY);
            $('#BPJY span:eq(1)').text(MY_API.GIFT_COUNT.BPDJ);
        },
        creatSetBox: function () {//创建设置框


            let btn1 = $('<button style="position: absolute; top: 132px; left: 0;z-index: 1;background-color: pink;color: #FF34B3;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                '隐藏插件参数界面</button>');
            btn1.click(function () {
                 div.css({
                        'z-index': '-1',
                       });
                tp.css({
                        'z-index': '-1',
                       });
                 msg.css({
                        'z-index': '10',
                       });

               });
            $('.chat-history-panel').append(btn1);
            let btn2 = $('<button style="position: absolute; top: 156px; left: 0;z-index:1;background-color:yellow;color: #FF34B3;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                '显示插件参数界面</button>');
            btn2.click(function () {
               div.css({
                        'z-index': '10',
                       });
                tp.css({
                        'z-index': '10',
                       });
                msg.css({
                        'z-index': '-1',
                       });
               });
             $('.chat-history-panel').append(btn2);

             let btn3 = $('<button style="position: absolute; top: 179px; left: 0;z-index:1;background-color:purple;color: #FF34B3;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                '清空抽奖反馈信息</button>');
            btn3.click(function () {
                $('.zdbgjMsg').hide();
            });
            $('.chat-history-panel').append(btn3);
            let msg = $("<div>");
            msg.css({
                 'width': '99px',
                'height': '30px',
                'position': 'absolute',
                'top': '203px',
                'left': '0px',
                'background': '#00FFFF',
                'padding': '4px',
                'z-index': '10',
                'border-radius': '4px',
                'transition': 'height .3s',
                'overflow': 'hidden',
            });


             msg.append(`

         <div id="giftCoun" style="font-size: small;color:blue;">
         辣条：<span>${MY_API.GIFT_COUNT.COUNT}</span>
         <div id="giftCoun" style="font-size: small;color:blue;">
         亲密度：<span>${MY_API.GIFT_COUNT.LOVE_COUNT}</span>
`);
             $('.chat-history-panel').append(msg);

            let div = $('<div>');
            div.css({
                'width': '320px',
                'height': '340px',
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

            let TP_Timer = () => {
            setTimeout(() => {
            var img = document.getElementById("img1")
            img.src = "https://i0.hdslb.com/bfs/article/10aca7fbe5247b1f217763a12afa0012d988d311.png@1320w_2198h.webp";
            }, 5000);
                 setTimeout(() => {
            var img = document.getElementById("img1")
            img.src = "https://i0.hdslb.com/bfs/article/fe789e3af417418ad8c0a4e03ba40867dba0c55f.png@1320w_2198h.webp";
            }, 10000);
                 setTimeout(() => {
            var img = document.getElementById("img1")
            img.src = "https://i0.hdslb.com/bfs/article/69468feeb1263f7653adf2bc0e3379d32ad71ac3.png@1320w_2198h.webp";
            }, 15000);
                 setTimeout(() => {
            var img = document.getElementById("img1")
            img.src = "https://i0.hdslb.com/bfs/article/1986b954aff538dc8b18ca1cc29e9eccc49df4fc.png@1320w_2198h.webp";
            }, 20000);
                 setTimeout(() => {
            var img = document.getElementById("img1")
            img.src = "https://i0.hdslb.com/bfs/article/fce8ebfb187e0f979da10bd32e9e912da9535dd4.png@1320w_2198h.webp";
            }, 25000);
                 setTimeout(() => {
            var img = document.getElementById("img1")
            img.src = "https://i0.hdslb.com/bfs/article/18e41e6720042647581bca0b24b86082e995f5be.png@1320w_2198h.webp";
            }, 30000);
            };
            TP_Timer();
            setInterval(TP_Timer, 35e3);

            let tp = $('<div>');
            tp.css({
                'position': 'absolute',
                'top': '115px',
                'right': '30px',
                'z-index': '-1',
                'overflow': 'hidden',
            });
tp.append(`
         <img id="img1" src="https://i0.hdslb.com/bfs/article/18e41e6720042647581bca0b24b86082e995f5be.png@1320w_2198h.webp" width="92" height="154" />

`);

       /*     div.on('mouseover mouseout', '', function (e) {
                if (e.type === 'mouseover') {
                    $(this).css('height', '380px');
                } else {
                    $(this).css('height', '80px');
                }
            });
       */

            div.append(`
<fieldset>
         <legend append style="color: #FF34B3;text-align: left;">欢迎来到<span>${ZBJ}</span>的直播间</legend> </div>
         <div id="giftCount" style="font-size: small;color:  green;">
         <span>${yue}</span>月<span>${ri}</span>日&nbsp;&nbsp;&nbsp辣条：<span>${MY_API.GIFT_COUNT.COUNT}</span> &nbsp;&nbsp;亲密度：<span>${MY_API.GIFT_COUNT.LOVE_COUNT}</span></div>
</fieldset>

<fieldset>
         <legend id="CJ" style="color: #FF34B3;text-align: left;">我要修仙【<span>${CJ}</span>】</legend></div>
         <div id="TTgiftCount" style="font-size: small;color:  green;">
         <div>攻击：<span>${MY_API.GIFT_COUNT.TTCOUNT}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
         防御：<span>${MY_API.GIFT_COUNT.TTLOVE_COUNT}</span></div>

         <div id="BPJY" style="font-size: small;color:  green;">
         <div>经验：<span>${MY_API.GIFT_COUNT.BPJY}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
         等级：Lv<span>${MY_API.GIFT_COUNT.BPDJ}</span></div>
        <div id="giftCountsent" style="color: blue">
        <button data-action="countsent" style="color: blue">一键发送修仙成果</button>
        </div>


</fieldset>



<fieldset>
         <legend append style="color: #FF34B3">修仙插件参数设置</legend></div>
         <div data-toggle="TOP">
         <input style="vertical-align: text-top;" type="checkbox" ><append style="color: yellow">关闭刷实时榜（实时榜抽奖） &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
         <data-toggle="CZ">缓存重置（分）
         </div>
         <div data-toggle="TALK">
         <input style="vertical-align: text-top;" type="checkbox" ><append style="color: yellow">关闭聊天弹幕（可隐藏抽奖） &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
       <div style="color: red">传送门：<a href="https://live.bilibili.com/22001178" target="_blank">@秦安</a>（哈哈哈哈求关注）</div>
       <div style="color: #FF34B3">欢迎投喂B坷垃/20币/充电</div>
       <div style="color: #FF34B3">关注再嫖辣条大概不容易被关小黑屋</div>
</fieldset>

`);

/*<div id="giftCount" style="color: blue">
        归零辣条亲密度，三秒后刷新直播间<button style="font-size: small" data-action="countReset" ><append style="color: red">归零</button>
        </div>
*/
            $('.player-ctnr').append(div);
             $('.player-ctnr').append(tp);

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

                 if(val<30){
                 MY_API.chatLog('男人不能太快哦ლ(╹◡╹ლ)');
                 val=30

                 }else if(val>1000){
                 MY_API.chatLog('你要上天啊Σ( ° △ °|||)︴');
                 val=1000
                 }
                MY_API.CONFIG.CZ = val;
                MY_API.saveConfig()
                MY_API.chatLog('重置时间已设置，刷新页面后生效');

            });


            div.find('div[data-toggle="TOP"] input').change(function () {//
                MY_API.CONFIG.TOP = $(this).prop('checked');
                MY_API.saveConfig()
                MY_API.chatLog('提示：打√是关闭实时榜哦φ(゜▽゜*)♪');
           });


			 div.find('div[data-toggle="TALK"] input').change(function () {//
                MY_API.CONFIG.TALK = $(this).prop('checked');
                 if (MY_API.CONFIG.TALK == true) {//自定义提示开关
                     $('.zdbgjMsg').hide(); //隐藏反馈信息
                 }
                    MY_API.saveConfig()
                    MY_API.chatLog('提示：弹幕聊天打√是清空聊天栏抽奖反馈，然后再也不显示哦φ(゜▽゜*)♪');
            });


            div.find('div[data-toggle="RANDOM_DELAY"] input').change(function () {//
                MY_API.CONFIG.RANDOM_DELAY = $(this).prop('checked');
                MY_API.saveConfig()
            });

            div.find('div[data-toggle="TIMEAREADISABLE"] input:checkbox').change(function () {//
                MY_API.CONFIG.TIMEAREADISABLE = $(this).prop('checked');
                MY_API.saveConfig()
            });

            div.find('div[data-toggle="TIMEAREADISABLE"] [data-action="save"]').click(function () {//
                MY_API.CONFIG.TIMEAREASTART = parseInt(div.find('div[data-toggle="TIMEAREADISABLE"] .start').val());
                MY_API.CONFIG.TIMEAREAEND = parseInt(div.find('div[data-toggle="TIMEAREADISABLE"] .end').val());
                MY_API.saveConfig()
            });

            if(Live_info.room_id === 2374828){
                div.css({
                        'z-index': '10',
                       });
                tp.css({
                        'z-index': '10',
                       });
                msg.css({
                        'z-index': '-1',
                       });}

         div.find('#giftCountsent [data-action="countsent"]').click(function () {//
                var event = document.createEvent('Event');
                event.initEvent('input', true, true);
                $('.chat-input.border-box').val(`Lv${MY_API.GIFT_COUNT.BPDJ}级${CJ}：今日捡了${MY_API.GIFT_COUNT.COUNT}根辣条`);
                $('.chat-input.border-box')[0].dispatchEvent(event);
                setTimeout(() => {
                $('.bl-button.live-skin-highlight-button-bg.bl-button--primary.bl-button--small').click();
               }, 500);
             });



           /* div.find('#giftCount [data-action="countReset"]').click(function () {//
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

            */
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

	if (Live_info.room_id === 22001178) {

        ZBJ='QIN-AN秦安'

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
                yue= riqi.getMonth()+1;
                ri=riqi.getDate()
               // jishu=1
                console.log('清空辣条数量')
                API.chatLog('新的一天，元气满满，3秒后刷新页面重新统计辣条和亲密度并运行自动签到');
            setTimeout(() => {
                window.location.reload()
            }, 3000);
            } else {
                console.log('无需清空辣条数量')
               // jishu=1
            }
        };
        LT_Timer();
        setInterval(LT_Timer, 30e3);
        API.cjcheck();
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
                //API.chatLog('检查实时榜房间的礼物', 'warning');
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



    } else

	if (Live_info.room_id === 2374828)

		{

        ZBJ='【风绫丨钰袖】'
       if (LIVE_PLAYER_STATUS.indexOf("flash") >= 0) {
            window.localStorage["LIVE_PLAYER_STATUS"] = window.localStorage["LIVE_PLAYER_STATUS"].replace("flash", 'html5');
            window.location.reload();
            return
        }

        let LT_Timer = () => {//判断是否清空辣条数量
            xiaoshi=riqi.getHours();
            fenzhong=riqi.getMinutes();
            if (checkNewDay(API.GIFT_COUNT.CLEAR_TS)) {
                if (API.GIFT_COUNT.CLEAR_TS && xiaoshi==0 && fenzhong==0) {
                var event = document.createEvent('Event');
                event.initEvent('input', true, true);
                $('.chat-input.border-box').val(`Lv${API.GIFT_COUNT.BPDJ}级${CJ}：今日捡了${API.GIFT_COUNT.COUNT}根辣条`);
                $('.chat-input.border-box')[0].dispatchEvent(event);
                  setTimeout(() => {
                $('.bl-button.live-skin-highlight-button-bg.bl-button--primary.bl-button--small').click();
                }, 500);
                }
                API.GIFT_COUNT.COUNT = 0;
                API.GIFT_COUNT.LOVE_COUNT = 0;
                API.GIFT_COUNT.CLEAR_TS = dateNow();
                API.saveGiftCount();
                yue= riqi.getMonth()+1;
                ri=riqi.getDate()
               // jishu=0
                console.log('清空辣条数量')
                API.chatLog('仙路漫漫，道法天成，积沙成海，5秒后再启修行');
            setTimeout(() => {
                window.location.reload()
            }, 5000);
            } else {
                console.log('无需清空辣条数量')
            }
        };
        LT_Timer();
        setInterval(LT_Timer, 30e3);
        API.cjcheck();

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
                //API.chatLog('检查实时榜房间的礼物', 'warning');
                console.log(list);
                for (let i of list) {
                    API.checkRoom(i.roomid, `实时榜-${i.area_v2_parent_name}区`);
                }
            });
           }
        };
        //setTimeout(check_top_room, 2e3);
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




    } else {

            API.chatLog('插件未启用，请前往限定直播间开启!直播间号：22001178', 'warning');
            let csm = $('<apend style="position: absolute; top: 128px; left: 1;right: 1;z-index: 1;background-color:#FFFAFA;color:red;border-radius: 4px;border: none;padding: 5px;box-shadow: 1px 1px 2px #00000075;resizable:no">' +
                '插件限定直播间：' +
            '<div style="color:#FF34B3">传送门：<a href="https://live.bilibili.com/22001178" target="_blank">@秦安</a></div>' +
            '<div style="color:#FF34B3">传送门：<a href="https://live.bilibili.com/22001178" target="_blank">@还是秦安</a></div>');
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
            if (!link) {
                link = '/22001178';
            }
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

function getUrlParam(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
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
}