// ==UserScript==
// @name         懒懒辣条姬！（建议手机端使用）
// @namespace    http://tampermonkey.net/
// @version      2.33
// @description  修仙！修仙！修仙！修仙！
// @author       懒懒个懒
// @include      /https?:\/\/live\.bilibili\.com\/\d+\??.*/
// @include      /https?:\/\/live\.bilibili\.com/blanc/\d+\??.*/
// @iconURL      https://i0.hdslb.com/bfs/article/927cc195124c47474b4a150d8b09e00536d15a0a.gif
// @icon64URL    https://i0.hdslb.com/bfs/article/927cc195124c47474b4a150d8b09e00536d15a0a.gif
// @include      /https?:\/\/live\.bilibili\.com\/\d+\??.*/
// @include      /https?:\/\/live\.bilibili\.com/blanc/\d+\??.*/
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://greasyfork.org/scripts/38140-bilibiliapi/code/BilibiliAPI.js
// @require      https://cdn.bootcss.com/fetch-jsonp/1.1.3/fetch-jsonp.min.js
// @require      https://cdn.bootcss.com/axios/0.17.1/axios.js
// @require      https://cdn.bootcss.com/vue/2.5.13/vue.js
// @require      https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js
// @downloadURL https://update.greasyfork.org/scripts/403753/%E6%87%92%E6%87%92%E8%BE%A3%E6%9D%A1%E5%A7%AC%EF%BC%81%EF%BC%88%E5%BB%BA%E8%AE%AE%E6%89%8B%E6%9C%BA%E7%AB%AF%E4%BD%BF%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/403753/%E6%87%92%E6%87%92%E8%BE%A3%E6%9D%A1%E5%A7%AC%EF%BC%81%EF%BC%88%E5%BB%BA%E8%AE%AE%E6%89%8B%E6%9C%BA%E7%AB%AF%E4%BD%BF%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==
 (function(){
                let NAME='ZDBGJ';
                let BAPI;
                let server_host;
                let ZBJ='【Lokisonl懒懒】';
                let CJ;
                var riqi;
                var BPDJ;
                var COUNT;
                var QMD;
                var DMCHECK=0;
                riqi=new Date();
                let yue=riqi.getMonth()+1;
                let ri=riqi.getDate();
                let xiaoshi=riqi.getHours();
                let fenzhong=riqi.getMinutes();
                //console.log = () => {
                //    };//关闭控制台输出
                let i=0
                let Live_info = {room_id: undefined, uid: undefined};
                $(function () {//DOM完毕，等待弹幕加载完成
                    let loadInfo = (delay) => {
                        setTimeout(function () {
                            if (BilibiliLive === undefined || parseInt(BilibiliLive.UID) === 0 || isNaN(parseInt(BilibiliLive.UID))) {
                                loadInfo(5000);
                                i +=1
                                if(i>15) {
                                    window.location.reload()
                                }
                                console.log('无配置信息');
                                init();
                            } else {
                                Live_info.room_id = BilibiliLive.ROOMID;
                                Live_info.uid = BilibiliLive.UID;

                                // if(BilibiliLive.UID==20842051)  return;

                                console.log(Live_info);
                                init();
                                i=0
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

                    class DMApi{
                        async _api(url,data,method="post") {
                            return axios({
                                url,
                                baseURL: 'https://api.live.bilibili.com/',
                                method,
                                data: data,
                                transformRequest: [function (data) {
                                    let ret = '';
                                    for (let it in data) {
                                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
                                    }
                                    return ret;
                                }],
                                withCredentials: true,
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                }
                            }).then(function (res) {
                                return res.data;
                            });
                        }
                    }

                    //	$().ready(function(){
                    let DMapi = new DMApi();
                    DMinit();
                    async function DMinit(){
                        let input =await mscststs.wait("#chat-control-panel-vm > div > div.chat-input-ctnr.p-relative > div > textarea");
                        let SendBtn = await mscststs.wait("#chat-control-panel-vm div.control-panel-ctnr.border-box div.right-action button.bl-button");
                        window.helper_Focus = new Vue({
                            el:"#helper-Focus",
                            name:"helper_focus",
                            data:{
                                value:"",
                            },
                            mounted(){
                                setInterval(this.sendMsg,1000);
                            },
                            methods:{

                                sendMsg(){

                                    if(DMCHECK) {

                                        function sleep(millisecond) {
                                            return new Promise(resolve => {
                                                setTimeout(() => {
                                                    resolve()
                                                }, millisecond)
                                            })
                                        }


                                        async function test1() {
                                            input.value = (`Lv${BPDJ}级${CJ}在此洞天修仙！`);
                                            let e = new Event('input');
                                            e.myself = true;
                                            input.dispatchEvent(e); // 把弹幕喂给v-model
                                            let c = new Event("click");
                                            c.myself = true;
                                            SendBtn.dispatchEvent(c);


                                        };
                                        async function test2() {
                                            await sleep(1000);
                                            input.value = (`今日修得${COUNT}根辣条！`);
                                            let f = new Event('input');
                                            f.myself = true;
                                            input.dispatchEvent(f); // 把弹幕喂给v-model
                                            let d = new Event("click");
                                            d.myself = true;
                                            SendBtn.dispatchEvent(d);
                                        };
                                        async function test3() {
                                            await sleep(2000);
                                            input.value = (`我永远单推战斗吧歌姬！`);
                                            let g = new Event('input');
                                            g.myself = true;
                                            input.dispatchEvent(g); // 把弹幕喂给v-model
                                            let h = new Event("click");
                                            h.myself = true;
                                            SendBtn.dispatchEvent(h);
                                        };
                                        test1();
                                        test2();
                                        if(BilibiliLive.ROOMID==258453)  test3();
                                        DMCHECK=0;

                                    }
                                },
                            }
                        });
                    }

                    //})();
                    const MY_API = {
                        CONFIG_DEFAULT: {
                            TIME_FLASH: 10e3,
                            TIME_GET: 100,
                            TOP: false,
                            TALK: false,  //不显示抽奖反馈
                            RANDOM_DELAY: true,
                            TIMEAREADISABLE: true,
                            TIMEAREASTART: 2,
                            TIMEAREAEND: 8,
                            TIMESTART: 2,
                            TIMEEND: 8,
                            RANDOMSKIP: 0,
                            MAXGIFT: 99999,
                            CZ: 180,
                        },

                        CONFIG: {},
                        GIFT_COUNT: {
                            COUNT: 0,
                            LOVE_COUNT: 0,
                            CLEAR_TS: 0,
                            TTCOUNT: 0,
                            TTLOVE_COUNT: 0,
                            BPJY: 0,
                            BPDJ: 1,
                            DJLVMK: 100,
                            CLOCL01:0,
                            CLOCL26:0,
                            CLOCL712:0,
                            CLOCL1317:0,
                            CLOCL18:0,
                            CLOCL19:0,
                            CLOCL20:0,
                            CLOCL21:0,
                            CLOCL22:0,
                            CLOCL23:0,
                            YCLOCL01:0,
                            YCLOCL26:0,
                            YCLOCL712:0,
                            YCLOCL1317:0,
                            YCLOCL18:0,
                            YCLOCL19:0,
                            YCLOCL20:0,
                            YCLOCL21:0,
                            YCLOCL22:0,
                            YCLOCL23:0,
                            YGIFT:0,
                        },
                        init: function () {
                            let p = $.Deferred();
                            try {
                                MY_API.loadConfig().then(function () {
                                    MY_API.chatLog('脚本载入配置成功，运行自动签到', 'success');
                                    setTimeout(() => {
                                        $("div.checkin-btn.t-center.pointer").click();
                                    }, 1000);
                                    setTimeout(() => {
                                        $("div.checkin-btn.t-center.pointer").click();
                                    }, 10000);
                                    setTimeout(() => {
                                        $("div.checkin-btn.t-center.pointer").click();
                                    }, 100000);
                                    setTimeout(() => {
                                        $("div.checkin-btn.t-center.pointer").click();
                                    }, 1000000);
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
                                        CJ='大乘白嫖怪'
                                    }else if(MY_API.GIFT_COUNT.BPDJ<300){
                                        CJ='仙人白嫖怪'
                                    }else if(MY_API.GIFT_COUNT.BPDJ<400){
                                        CJ='地仙白嫖怪'
                                    }else if(MY_API.GIFT_COUNT.BPDJ<500){
                                        CJ='天仙白嫖怪'
                                    }else if(MY_API.GIFT_COUNT.BPDJ<600){
                                        CJ='玄仙白嫖怪'
                                    }else if(MY_API.GIFT_COUNT.BPDJ<700){
                                        CJ='神境白嫖怪'
                                    }else if(MY_API.GIFT_COUNT.BPDJ<900){
                                        CJ='神人白嫖怪'
                                    }else if(MY_API.GIFT_COUNT.BPDJ<1200){
                                        CJ='准神白嫖怪'
                                    }else if(MY_API.GIFT_COUNT.BPDJ<1500){
                                        CJ='主神白嫖怪'
                                    }else if(MY_API.GIFT_COUNT.BPDJ<2000){
                                        CJ='神王白嫖怪'
                                    }else if(MY_API.GIFT_COUNT.BPDJ<3000){
                                        CJ='天尊白嫖怪'
                                    }else if(MY_API.GIFT_COUNT.BPDJ<4000){
                                        CJ='天尊白嫖怪一重天'
                                    }else if(MY_API.GIFT_COUNT.BPDJ<5000){
                                        CJ='天尊白嫖怪二重天'
                                    }else if(MY_API.GIFT_COUNT.BPDJ<6000){
                                        CJ='天尊白嫖怪三重天'
                                    }else if(MY_API.GIFT_COUNT.BPDJ<7000){
                                        CJ='天尊白嫖怪四重天'
                                    }else if(MY_API.GIFT_COUNT.BPDJ<8000){
                                        CJ='天尊白嫖怪五重天'
                                    }else if(MY_API.GIFT_COUNT.BPDJ<9000){
                                        CJ='天尊白嫖怪六重天'
                                    }else if(MY_API.GIFT_COUNT.BPDJ<10000){
                                        CJ='天尊白嫖怪七重天'
                                    }else if(MY_API.GIFT_COUNT.BPDJ<11000){
                                        CJ='天尊白嫖怪八重天'
                                    }else if(MY_API.GIFT_COUNT.BPDJ<12000){
                                        CJ='天尊白嫖怪九重天'
                                    }else if(MY_API.GIFT_COUNT.BPDJ>=20000){
                                        CJ='天尊白嫖怪大圆满'
                                    };
                                    p.resolve();
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
                            MY_API.chatLog('欢迎来到白嫖怪的修仙世界！', 'warning');
                            MY_API.chatLog('正常开启传送，3秒后穿越次元！', 'warning');
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
                                BPDJ=MY_API.GIFT_COUNT.BPDJ;
                                COUNT=MY_API.GIFT_COUNT.COUNT;
                                QMD=MY_API.GIFT_COUNT.LOVE_COUNT;
                            } catch (e) {
                                console.log('读取统计失败', e);
                            }
                        },
                        saveGiftCount: function () {
                            try {
                                localStorage.setItem(`${NAME}_GIFT_COUNT`, JSON.stringify(MY_API.GIFT_COUNT));
                                console.log('统计保存成功', MY_API.GIFT_COUNT);
                                BPDJ=MY_API.GIFT_COUNT.BPDJ;
                                COUNT=MY_API.GIFT_COUNT.COUNT;
                                QMD=MY_API.GIFT_COUNT.LOVE_COUNT;
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
                            }else if(MY_API.GIFT_COUNT.BPDJ==2000){
                                CJ='天尊白嫖怪'
                                MY_API.chatLog('仙路漫漫，道法天成，恭喜你成为修仙至尊【天尊白嫖怪】');
                            }
                            console.log('成就',CJ);

                        },
                        addGift: function (count) {
                            let riqi=new Date();
                            let xiaoshi=riqi.getHours();
                            if(xiaoshi<2)
                            {
                                MY_API.GIFT_COUNT.CLOCL01 += count;
                            }else if(xiaoshi<7){
                                MY_API.GIFT_COUNT.CLOCL26 += count;
                            }else if(xiaoshi<13){
                                MY_API.GIFT_COUNT.CLOCL712 += count;
                            }else if(xiaoshi<18){
                                MY_API.GIFT_COUNT.CLOCL1317 += count;
                            }else if(xiaoshi<19){
                                MY_API.GIFT_COUNT.CLOCL18 += count;
                            }else if(xiaoshi<20){
                                MY_API.GIFT_COUNT.CLOCL19 += count;
                            }else if(xiaoshi<21){
                                MY_API.GIFT_COUNT.CLOCL20 += count;
                            }else if(xiaoshi<22){
                                MY_API.GIFT_COUNT.CLOCL21 += count;
                            }else if(xiaoshi<23){
                                MY_API.GIFT_COUNT.CLOCL22 += count;
                            }else if(xiaoshi<24){
                                MY_API.GIFT_COUNT.CLOCL23 += count;
                            };
                            $('#clockgift01 span:eq(0)').text(MY_API.GIFT_COUNT.CLOCL01);
                            $('#clockgift26 span:eq(0)').text(MY_API.GIFT_COUNT.CLOCL26);
                            $('#clockgift712 span:eq(0)').text(MY_API.GIFT_COUNT.CLOCL712);
                            $('#clockgift1317 span:eq(0)').text(MY_API.GIFT_COUNT.CLOCL1317);
                            $('#clockgift18 span:eq(0)').text(MY_API.GIFT_COUNT.CLOCL18);
                            $('#clockgift19 span:eq(0)').text(MY_API.GIFT_COUNT.CLOCL19);
                            $('#clockgift20 span:eq(0)').text(MY_API.GIFT_COUNT.CLOCL20);
                            $('#clockgift21 span:eq(0)').text(MY_API.GIFT_COUNT.CLOCL21);
                            $('#clockgift22 span:eq(0)').text(MY_API.GIFT_COUNT.CLOCL22);
                            $('#clockgift23 span:eq(0)').text(MY_API.GIFT_COUNT.CLOCL23);
                            MY_API.GIFT_COUNT.COUNT += count;
                            MY_API.GIFT_COUNT.TTCOUNT+= count;
                            let BPJY=MY_API.GIFT_COUNT.BPJY
                            MY_API.GIFT_COUNT.BPJY += count*4;
                            if (MY_API.GIFT_COUNT.BPJY >= MY_API.GIFT_COUNT.DJLVMK && BPJY < MY_API.GIFT_COUNT.DJLVMK ) {
                                MY_API.GIFT_COUNT.BPDJ +=1;
                                MY_API.cjcheck();
                                MY_API.GIFT_COUNT.DJLVMK +=1000
                                MY_API.chatLog('恭喜你升级了ヾ(o◕∀◕)ﾉヾ');
                            }
                            console.log('等级',MY_API.GIFT_COUNT.BPDJ);
                            $('#TTgiftCount span:eq(0)').text(MY_API.GIFT_COUNT.TTCOUNT);
                            $('#giftCount span:eq(2)').text(MY_API.GIFT_COUNT.COUNT);
                            $('#giftCount span:eq(0)').text(yue);
                            $('#giftCount span:eq(1)').text(ri);
                            $('#giftCoun span:eq(0)').text(MY_API.GIFT_COUNT.COUNT);
                            $('#CJ span:eq()').text(CJ);
                            $('#BPJY span:eq(0)').text(MY_API.GIFT_COUNT.BPJY);
                            $('#BPJY span:eq(1)').text(MY_API.GIFT_COUNT.BPDJ);
                            $('#clockgift span:eq(0)').text(MY_API.GIFT_COUNT.COUNT);
                            MY_API.saveGiftCount();
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
                            $('#BPJY span:eq(0)').text(MY_API.GIFT_COUNT.BPJY);
                            $('#BPJY span:eq(1)').text(MY_API.GIFT_COUNT.BPDJ);
                            MY_API.saveGiftCount();
                        },
                        creatSetBox: function () {//创建设置框


                            let btn1 = $('<button style="position: absolute; top: 132px; left: 0;z-index: 1;background-color: black;color: #66FFCC;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                                         '隐藏插件参数界面</button>');
                            btn1.click(function () {
                                div.css({
                                    'z-index': '-1',
                                });
                                tj.css({
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
                            let btn2 = $('<button style="position: absolute; top: 156px; left: 0;z-index:1;background-color:black;color: #66FFCC;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                                         '显示插件参数界面</button>');
                            btn2.click(function () {
                                div.css({
                                    'z-index': '10',
                                });
                                tj.css({
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

                            let btn3 = $('<button style="position: absolute; top: 179px; left: 0;z-index:1;background-color:black;color: #66FFCC;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
                                         '清空抽奖反馈信息</button>');
                            btn3.click(function () {
                                $('.zdbgjMsg').hide();
                            });
                            $('.chat-history-panel').append(btn3);
                            let msg = $("<div>");
                            msg.css({
                                'width': '99px',
                                'height': '15px',
                                'position': 'absolute',
                                'top': '203px',
                                'left': '0px',
                                'background': '#000000',
                                'padding': '4px',
                                'z-index': '10',
                                'border-radius': '4px',
                                'transition': 'height .3s',
                                'overflow': 'hidden',
                            });

                            //<div id="giftCoun" style="font-size: small;color:black;">
                            //亲密度：<span>${MY_API.GIFT_COUNT.LOVE_COUNT}</span>
                            msg.append(`

<div id="giftCoun" style="font-size: small;color:white;">
辣条：<span>${MY_API.GIFT_COUNT.COUNT}</span>

`);
                            $('.chat-history-panel').append(msg);

                            let div = $('<div>');
                            div.css({
                                'width': '320px',
                                'height': '460px',
                                'position': 'absolute',
                                'top': '110px',
                                'right': '10px',
                                'background': 'rgba(0,0,0,.8)',
                                'padding': '10px',
                                'z-index': '-1',
                                'border-radius': '12px',
                                'transition': 'height .3s',
                                'overflow': 'hidden',
                                'line-height': '20px'
                            });


                            let tj = $('<div>');
                            tj.css({
                                'width': '120px',
                                'height': '460px',
                                'position': 'absolute',
                                'top': '110px',
                                'right': '355px',
                                'background': 'rgba(0,0,0,.8)',
                                'padding': '10px',
                                'z-index': '-1',
                                'border-radius': '12px',
                                'transition': 'height .3s',
                                'overflow': 'hidden',
                                'line-height': '17px'
                            });


                            tj.append(`
<fieldset>
<legend append style="color: #66CCFF;text-align: left;">今日辣条统计</legend> </div>
<div id="clockgift01" style="font-size: small;color:#66CCFF;">
0-1点：<span>${MY_API.GIFT_COUNT.CLOCL01}</span></div>
<div id="clockgift26" style="font-size: small;color:#66CCFF;">
2-6点：<span>${MY_API.GIFT_COUNT.CLOCL26}</span></div>
<div id="clockgift712" style="font-size: small;color:#66CCFF;">
7-12点：<span>${MY_API.GIFT_COUNT.CLOCL712}</span></div>
<div id="clockgift1317" style="font-size: small;color:#66CCFF;">
13-17点：<span>${MY_API.GIFT_COUNT.CLOCL1317}</span></div>
<div id="clockgift18" style="font-size: small;color:#66CCFF;">
18点：<span>${MY_API.GIFT_COUNT.CLOCL18}</span></div>
<div id="clockgift19" style="font-size: small;color:#66CCFF;">
19点：<span>${MY_API.GIFT_COUNT.CLOCL19}</span></div>
<div id="clockgift20" style="font-size: small;color:#66CCFF;">
20点：<span>${MY_API.GIFT_COUNT.CLOCL20}</span></div>
<div id="clockgift21" style="font-size: small;color:#66CCFF;">
21点：<span>${MY_API.GIFT_COUNT.CLOCL21}</span></div>
<div id="clockgift22" style="font-size: small;color:#66CCFF;">
22点：<span>${MY_API.GIFT_COUNT.CLOCL22}</span></div>
<div id="clockgift23" style="font-size: small;color:#66CCFF;">
23点：<span>${MY_API.GIFT_COUNT.CLOCL23}</span></div>
<div id="clockgift" style="font-size: small;color:#66CCFF;">
合计：<span>${MY_API.GIFT_COUNT.COUNT}</span></div>
</fieldset>

<fieldset>
<legend append style="color: #66CCFF;text-align: left;">昨日辣条统计</legend> </div>
<div id="yclockgift01" style="font-size: small;color:#66CCFF;">
0-1点：<span>${MY_API.GIFT_COUNT.YCLOCL01}</span></div>
<div id="yclockgift26" style="font-size: small;color:#66CCFF;">
2-6点：<span>${MY_API.GIFT_COUNT.YCLOCL26}</span></div>
<div id="yclockgift712" style="font-size: small;color:#66CCFF;">
7-12点：<span>${MY_API.GIFT_COUNT.YCLOCL712}</span></div>
<div id="yclockgift1317" style="font-size: small;color:#66CCFF;">
13-17点：<span>${MY_API.GIFT_COUNT.YCLOCL1317}</span></div>
<div id="yclockgift18" style="font-size: small;color:#66CCFF;">
18点：<span>${MY_API.GIFT_COUNT.YCLOCL18}</span></div>
<div id="yclockgift19" style="font-size: small;color:#66CCFF;">
19点：<span>${MY_API.GIFT_COUNT.YCLOCL19}</span></div>
<div id="yclockgift20" style="font-size: small;color:#66CCFF;">
20点：<span>${MY_API.GIFT_COUNT.YCLOCL20}</span></div>
<div id="yclockgift21" style="font-size: small;color:#66CCFF;">
21点：<span>${MY_API.GIFT_COUNT.YCLOCL21}</span></div>
<div id="yclockgift22" style="font-size: small;color:#66CCFF;">
22点：<span>${MY_API.GIFT_COUNT.YCLOCL22}</span></div>
<div id="yclockgift23" style="font-size: small;color:#66CCFF;">
23点：<span>${MY_API.GIFT_COUNT.YCLOCL23}</span></div>
<div id="ygift" style="font-size: small;color:#66CCFF;">
合计：<span>${MY_API.GIFT_COUNT.YGIFT}</span></div>
</fieldset>
`);
                            $('.player-ctnr').append(tj);

                            let TP_Timer = () => {
                                setTimeout(() => {
                                    var img = document.getElementById("img1")
                                    img.src = "https://s1.ax1x.com/2020/05/20/YoikC9.th.png";
                                }, 5000);
                            };
                            TP_Timer();
                            setInterval(TP_Timer, 30e3);

                            let TPP_Timer = () => {
                                setTimeout(() => {
                                    var img = document.getElementById("img2")
                                    img.src = "http://ww1.sinaimg.cn/large/abb97071gy1gdbhx0sj55g20dw0dw7c1.gif";
                                }, 5000);
                            };
                            TPP_Timer();
                            setInterval(TPP_Timer, 30e3);

                            let tp = $('<div>');
                            tp.css({
                                'position': 'absolute',
                                'top': '105px',
                                'right': '30px',
                                'z-index': '-1',
                                'overflow': 'hidden',
                            });
                            tp.append(`
<img id="img1" src="https://s1.ax1x.com/2020/05/20/YoikC9.th.png" width="121" height="140" />

`);
                            let tpp = $("<div class='zdbgjtpp'>");
                            tpp.css({
                                'position': 'absolute',
                                'z-index': '-99',
                                'overflow': 'hidden',
                            });


                            tpp.append(`

<img id="img2" src="http://ww1.sinaimg.cn/large/abb97071gy1gdbhx0sj55g20dw0dw7c1.gif" />

`);
                            //     $('.bilibili-live-player-video-area').prepend(tpp);
                            $('.live-player-ctnr.w-100.h-100.p-absolute.normal').prepend(tpp);
                            /*     div.on('mouseover mouseout', '', function (e) {
                if (e.type === 'mouseover') {
                    $(this).css('height', '380px');
                } else {
                    $(this).css('height', '80px');
                }
            });
       */

                            //</span> &nbsp;&nbsp;亲密度：<span>${MY_API.GIFT_COUNT.LOVE_COUNT}</span>
                            div.append(`
<fieldset>
<legend append style="color: #66CCFF;text-align: left;">欢迎来到<span>${ZBJ}</span>的直播间</legend> </div>
<div id="giftCount" style="font-size: small;color:  pink;">
<span>${yue}</span>月<span>${ri}</span>日&nbsp;&nbsp;&nbsp今日辣条：<span>${MY_API.GIFT_COUNT.COUNT}</div>
</fieldset>

<fieldset>
<legend id="CJ" style="color: #66CCFF;text-align: left;">我要修仙【<span>${CJ}</span>】</legend></div>
<div id="TTgiftCount" style="font-size: small;color:  pink;">
<div>攻击：<span>${MY_API.GIFT_COUNT.TTCOUNT}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
防御：<span>${MY_API.GIFT_COUNT.TTLOVE_COUNT}</span></div>

<div id="BPJY" style="font-size: small;color:  pink;">
<div>经验：<span>${MY_API.GIFT_COUNT.BPJY}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
等级：Lv<span>${MY_API.GIFT_COUNT.BPDJ}</span></div>
<div id="giftCountsent" style="color: white">
<button data-action="countsent" style="color: blue">低调使用，闷声发财</button>
</div>


</fieldset>



<fieldset>
<legend append style="color: #66CCFF">修仙插件参数设置</legend></div>
<div data-toggle="TOP">
<input style="vertical-align: text-top;" type="checkbox" ><append style="color: Orange">轮刷开关（实时榜抽奖等） &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<data-toggle="CZ">缓存重置（分）
</div>
<div data-toggle="TALK">
<input style="vertical-align: text-top;" type="checkbox" ><append style="color: Orange">版聊开关（隐藏抽奖反馈） &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<input class="CZTIME" style="width: 35px;vertical-align: AUTO;" type="text">
<button data-action="save" style="color: red">保存</button>
</div>

<div data-toggle="RANDOM_DELAY">
<apend style="margin: 5px auto; color: white">
<input style="vertical-align: text-top;" type="checkbox">随机延迟

<input class="start" style="width: 15px;vertical-align: top;" type="text">~
<input class="end" style="width: 15px;vertical-align: top;" type="text">秒后抽奖
<button data-action="save" style="color: red">保存</button>
</div>


<div data-toggle="MAXGIFT">
<apend style="margin: 5px auto; color: white">
每日辣条数上限(整数)<input class="num" style="width: 40px;vertical-align: top;" type="text">
<button data-action="save" style="color: red">保存</button>
</div>






<div data-toggle="RANDOMSKIP">
<apend style="color: #66FFCC">
百分比随机跳过礼物<input class="per" style="width: 20px;vertical-align: top;" type="text">%（整数0-100）
<button data-action="save" style="color: red">保存</button>
</div>


<div data-toggle="TIMEAREADISABLE">
<apend style="margin: 5px auto; color: #66FFCC">
<input style="vertical-align: text-top;" type="checkbox">启用
<input class="start" style="width: 15px;vertical-align: top;" type="text">点至
<input class="end" style="width: 15px;vertical-align: top;" type="text">点不抽奖（24小时制）
<button data-action="save" style="color: red">保存</button>
</div>
</fieldset>

<fieldset>
<legend append style="color: #66CCFF">温馨提示：本插件仅在以下直播间有效</legend>
<div style="color: white">传送门：<a href="https://live.bilibili.com/258453" target="_blank">@Lokisonl懒懒</a>（墙裂推荐）</div>
<div style="color: white">传送门：<a href="https://live.bilibili.com/4211793" target="_blank">@桜落_</a>（无声挂机）</div>
<div style="color: #66CCFF">欢迎投喂B坷垃/20币/充电50电池领取修仙勋章[懒得哟]</div>
<div id="hb" style="color: #66CCFF">
挂机直播间【Lokisonl懒懒】<button data-action="tpphide" style="color: #66CCFF">隐藏</button><button data-action="tppshow" style="color: #66CCFF">显示</button></div>
<div style="color: #66CCFF">咸鱼Q群：976856880，欢迎加入，解惑吐槽！</div>
</fieldset>

`);

                            /*<div id="giftCount" style="color: white">
        归零辣条亲密度，三秒后刷新直播间<button style="font-size: small" data-action="countReset" ><append style="color: red">归零</button>
        </div>


        <div data-toggle="TIME_GET" style="color: #66CCFF">
礼物点击速度(整数)：
<input class="delay-seconds" type="text" style="width: 30px;vertical-align: top;" style="color: #66CCFF">毫秒
<button data-action="save" style="color: red">保存</button>
</div>
*/
                            $('.player-ctnr').append(div);
                            $('.player-ctnr').append(tp);

                            //对应配置状态
                            div.find('div[data-toggle="TIME_FLASH"] .delay-seconds').val((MY_API.CONFIG.TIME_FLASH / 1000).toString());
                            //div.find('div[data-toggle="TIME_GET"] .delay-seconds').val(MY_API.CONFIG.TIME_GET.toString());
                            div.find('div[data-toggle="RANDOMSKIP"] .per').val((parseInt(MY_API.CONFIG.RANDOMSKIP)).toString());
                            div.find('div[data-toggle="MAXGIFT"] .num').val((parseInt(MY_API.CONFIG.MAXGIFT)).toString());
                            div.find('div[data-toggle="TALK"] .CZTIME').val((parseInt(MY_API.CONFIG.CZ)).toString());
                            if (MY_API.CONFIG.TOP) div.find('div[data-toggle="TOP"] input').attr('checked', '');
                            if (MY_API.CONFIG.TALK) div.find('div[data-toggle="TALK"] input').attr('checked', '');
                            if (MY_API.CONFIG.RANDOM_DELAY) div.find('div[data-toggle="RANDOM_DELAY"] input').attr('checked', '');

                            div.find('div[data-toggle="RANDOM_DELAY"] .start').val(MY_API.CONFIG.TIMESTART.toString());
                            div.find('div[data-toggle="RANDOM_DELAY"] .end').val(MY_API.CONFIG.TIMEEND.toString());


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
                            MY_API.CONFIG.TIME_GET=100;
                            /*
                            div.find('div[data-toggle="TIME_GET"] [data-action="save"]').click(function () {//TIME_GET save按钮
                                if (MY_API.CONFIG.TIME_GET === parseInt(div.find('div[data-toggle="TIME_GET"] .delay-seconds').val())) {
                                    MY_API.chatLog('改都没改保存嘛呢');
                                    return
                                }
                                MY_API.CONFIG.TIME_GET = parseInt(div.find('div[data-toggle="TIME_GET"] .delay-seconds').val());
                                MY_API.saveConfig()
                            });
*/
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
                                MY_API.chatLog('提示：姬友版聊打√是清空聊天栏抽奖反馈，然后再也不显示哦φ(゜▽゜*)♪');
                            });


                            div.find('div[data-toggle="RANDOM_DELAY"] input').change(function () {//
                                MY_API.CONFIG.RANDOM_DELAY = $(this).prop('checked');
                                MY_API.saveConfig()
                            });

                            div.find('div[data-toggle="RANDOM_DELAY"] [data-action="save"]').click(function () {//
                                MY_API.CONFIG.TIMESTART = parseInt(div.find('div[data-toggle="RANDOM_DELAY"] .start').val());
                                MY_API.CONFIG.TIMEEND = parseInt(div.find('div[data-toggle="RANDOM_DELAY"] .end').val());
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

                            if(Live_info.room_id === 4211793){
                                let GJTP_Timer = () => {
                                    var kd=  $('.bilibili-live-player-video-area').width();
                                    var gd=  $('.bilibili-live-player-video-area').height();
                                    //$('.bilibili-live-player-ending-panel').remove();
                                    $("#img2").width(kd).height(gd);
                                };
                                GJTP_Timer();
                                setInterval(GJTP_Timer, 5e3);

                                div.css({
                                    'z-index': '10',
                                });
                                tj.css({
                                    'z-index': '10',
                                });
                                tp.css({
                                    'z-index': '10',
                                });
                                tpp.css({
                                    'z-index': '10',
                                });
                                msg.css({
                                    'z-index': '-1',
                                });

                            }else  {
                                tpp.css({
                                    'width': '0px',
                                    'height': '0px',
                                });
                            }


                            div.find('#giftCountsent [data-action="countsent"]').click(function () {//
                                //    DMCHECK=1;
                                /*       var event = document.createEvent('Event');
                event.initEvent('input', true, true);
                $('.chat-input.border-box').val(`Lv${MY_API.GIFT_COUNT.BPDJ}级${CJ}：今日捡了${MY_API.GIFT_COUNT.COUNT}根辣条`);
                $('.chat-input.border-box')[0].dispatchEvent(event);
                setTimeout(() => {
                $('.bl-button.live-skin-highlight-button-bg.bl-button--primary.bl-button--small').click();
               }, 500);
               */
                            });


                            div.find('#hb [data-action="tpphide"]').click(function () {//
                                $('.zdbgjtpp').hide();

                            });

                            div.find('#hb [data-action="tppshow"]').click(function () {//
                                $('.zdbgjtpp').show();
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
                            let ct = $('#chat-items');
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
                                        'background': 'rgb(0, 0, 0) none repeat scroll 0% 0%',
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
                                        'background': 'rgb(0, 0, 0) none repeat scroll 0% 0%',
                                    });
                            }

                            ct.append(div);//向聊天框加入信息
                            let ctt = $('#chat-history-list');
                            ctt.animate({scrollTop: ctt.prop("scrollHeight")}, 0);//滚动到底部
                        },
                        //blocked: false,
                        giftblocked: false,
                        guardblocked: false,
                        pkblocked: false,
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
                                },() => {
                                    if (MY_API.GIFT_COUNT.COUNT >= MY_API.CONFIG.MAXGIFT) {//判断是否超过辣条限制
                                        console.log('超过今日辣条限制，不参与抽奖');
                                        wst.close();
                                        MY_API.chatLog(`超过今日辣条限制，主动与弹幕服务器断开连接-【${area}】`, 'warning')
                                    };
                                    if (MY_API.giftblocked &MY_API.guardblocked &MY_API.pkblocked) {
                                        wst.close();
                                        MY_API.chatLog(`进了小黑屋主动与弹幕服务器断开连接-【${area}】`, 'warning')
                                    };
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
                            if (MY_API.giftblocked &MY_API.guardblocked &MY_API.pkblocked) {
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
                                        if (MY_API.giftblocked ) {
                                            return
                                        }
                                        list = data.gift;
                                        for (let i in list) {
                                            if (!list.hasOwnProperty(i)) continue;
                                            MY_API.creat_join(roomId, list[i], 'gift', area)
                                        }
                                    }
                                    if (data.guard) {
                                        if (MY_API.guardblocked) {
                                            return
                                        }
                                        list = data.guard;
                                        for (let i in list) {
                                            if (!list.hasOwnProperty(i)) continue;
                                            MY_API.creat_join(roomId, list[i], 'guard', area)
                                        }
                                    }
                                    if (data.pk) {
                                        if (MY_API.pkblocked) {
                                            return
                                        }
                                        list = data.pk;
                                        for (let i in list) {
                                            if (!list.hasOwnProperty(i)) continue;
                                            MY_API.creat_join(roomId, list[i], 'pk', area)
                                        }
                                    }
                                    let ct = $('#chat-items');
                                    let ctt = $('#chat-history-list');
                                    ctt.animate({scrollTop: ctt.prop("scrollHeight")}, 0);//滚动到底部

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
                                        MY_API.chatLog('超过今日辣条限制，不参与抽奖');
                                        return
                                    }
                                    if (MY_API.giftblocked ) {
                                        let bj1=0;
                                        if (bj1==0) {
                                            bj1=1;
                                            setTimeout(() => {
                                                MY_API.giftblocked=false;
                                            }, 1800000);
                                        };
                                        return;
                                    }
                                    if (MY_API.raffleId_list_history.indexOf(data.raffleId) > -1) {
                                        return
                                    } else {
                                        MY_API.raffleId_list.push(data.raffleId);
                                        MY_API.raffleId_list_history.push(data.raffleId);
                                    }
                                    break;
                                case 'guard':
                                    if (MY_API.GIFT_COUNT.COUNT >= MY_API.CONFIG.MAXGIFT) {//判断是否超过辣条限制
                                        console.log('超过今日辣条限制，不参与抽奖');
                                        MY_API.chatLog('超过今日辣条限制，不参与抽奖');
                                        return
                                    }
                                    if (MY_API.guardblocked ) {
                                        let bj2=0;
                                        if (bj2==0) {
                                            bj2=1;
                                            setTimeout(() => {
                                                MY_API.guardblocked=false;
                                            }, 1800000);
                                        };
                                        return;
                                    }
                                    if (MY_API.guardId_list.indexOf(data.id) >= 0) {
                                        return
                                    } else {
                                        MY_API.guardId_list.push(data.id);
                                    }
                                    break;
                                case 'pk':
                                    if (MY_API.GIFT_COUNT.COUNT >= MY_API.CONFIG.MAXGIFT) {//判断是否超过辣条限制
                                        console.log('超过今日辣条限制，不参与抽奖');
                                        MY_API.chatLog('超过今日辣条限制，不参与抽奖');
                                        return
                                    }
                                    if (MY_API.pkblocked ) {
                                        let bj3=0;
                                        if (bj3==0) {
                                            bj3=1;
                                            setTimeout(() => {
                                                MY_API.pkblocked=false;
                                            }, 1800000);
                                        };
                                        return;
                                    }
                                    if (MY_API.pkId_list.indexOf(data.id) >= 0) {
                                        return
                                    } else {
                                        MY_API.pkId_list.push(data.id);
                                    }
                                    break;
                            }

                            let delay = data.time_wait || 0;

                            if (MY_API.CONFIG.RANDOM_DELAY) delay += MY_API.CONFIG.TIMESTART + Math.ceil(Math.random() * (MY_API.CONFIG.TIMEEND-MY_API.CONFIG.TIMESTART));//随机延迟

                            console.log(delay)
                            let div = $("<div class='zdbgjMsg'>");
                            let msg = $("<div>");
                            let aa = $("<div>");
                            let ct = $('#chat-items');
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
                                'background': 'rgb(0, 0, 0) none repeat scroll 0% 0%',
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
                                                        MY_API.addGift(num);
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
                                            MY_API.giftblocked = true;//停止抽奖
                                            p.resolve('抽奖访问被拒绝，暂停抽奖，30分钟后重试');
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
                                            MY_API.guardblocked = true;//停止抽奖
                                            p.resolve('上舰抽奖访问被拒绝，暂停上船抽奖，30分钟后重试');
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
                                            MY_API.pkblocked = true;//停止抽奖
                                            p.resolve('PK抽奖访问被拒绝，暂停PK抽奖，30分钟后重试');
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

                    if (Live_info.room_id === 258453) {

                        ZBJ='【Lokisonl懒懒】'

                        if (LIVE_PLAYER_STATUS.indexOf("flash") >= 0) {
                            window.localStorage["LIVE_PLAYER_STATUS"] = window.localStorage["LIVE_PLAYER_STATUS"].replace("flash", 'html5');
                            window.location.reload();
                            return
                        }


                        let LT_Timer = () => {//判断是否清空辣条数量
                            if (checkNewDay(API.GIFT_COUNT.CLEAR_TS)) {

                                API.GIFT_COUNT.YCLOCL01=API.GIFT_COUNT.CLOCL01;
                                API.GIFT_COUNT.YCLOCL26=API.GIFT_COUNT.CLOCL26;
                                API.GIFT_COUNT.YCLOCL712=API.GIFT_COUNT.CLOCL712;
                                API.GIFT_COUNT.YCLOCL1317=API.GIFT_COUNT.CLOCL1317;
                                API.GIFT_COUNT.YCLOCL18=API.GIFT_COUNT.CLOCL18;
                                API.GIFT_COUNT.YCLOCL19=API.GIFT_COUNT.CLOCL19;
                                API.GIFT_COUNT.YCLOCL20=API.GIFT_COUNT.CLOCL20;
                                API.GIFT_COUNT.YCLOCL21=API.GIFT_COUNT.CLOCL21;
                                API.GIFT_COUNT.YCLOCL22=API.GIFT_COUNT.CLOCL22;
                                API.GIFT_COUNT.YCLOCL23=API.GIFT_COUNT.CLOCL23;
                                API.GIFT_COUNT.YGIFT=API.GIFT_COUNT.COUNT;

                                API.GIFT_COUNT.CLOCL01=0
                                API.GIFT_COUNT.CLOCL26=0;
                                API.GIFT_COUNT.CLOCL712=0;
                                API.GIFT_COUNT.CLOCL1317=0;
                                API.GIFT_COUNT.CLOCL18=0;
                                API.GIFT_COUNT.CLOCL19=0;
                                API.GIFT_COUNT.CLOCL20=0;
                                API.GIFT_COUNT.CLOCL21=0;
                                API.GIFT_COUNT.CLOCL22=0;
                                API.GIFT_COUNT.CLOCL23=0;


                                API.GIFT_COUNT.COUNT = 0;
                                API.GIFT_COUNT.LOVE_COUNT = 0;
                                API.GIFT_COUNT.CLEAR_TS = dateNow();
                                API.saveGiftCount();
                                yue= riqi.getMonth()+1;
                                ri=riqi.getDate()
                                console.log('清空辣条数量')
                                API.chatLog('新的一天，元气满满，要更爱歌姬们哦，3秒后突破次元');
                                setTimeout(() => {
                                    window.location.reload()
                                }, 3000);
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
                            if (API.GIFT_COUNT.COUNT >= API.CONFIG.MAXGIFT) {//判断是否超过辣条限制
                                console.log('超过今日辣条限制，关闭轮刷抽奖');
                                API.chatLog('超过今日辣条限制，关闭轮刷抽奖');
                                clearInterval(check_timer);
                                return
                            }
                            if (API.giftblocked &API.guardblocked &API.pkblocked) {//如果被禁用则停止
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
                        let check_timer = setInterval(check_top_room, 125e3);


                        let reset = (delay) => {
                            setTimeout(function () {//重置直播间
                                if (API.raffleId_list.length > 0) {
                                    console.log('还有礼物没抽 延迟30s后刷新直播间');
                                    reset(30000);
                                    return
                                }
                                if (API.giftblocked &API.guardblocked &API.pkblocked) {
                                    return
                                }
                                window.location.reload();
                            }, delay);
                        };
                        reset(API.CONFIG.CZ * 60000);
                    } else
                        if (Live_info.room_id === 4211793)
                        {
                            ZBJ='【桜落_】'
                            if (LIVE_PLAYER_STATUS.indexOf("flash") >= 0) {
                                window.localStorage["LIVE_PLAYER_STATUS"] = window.localStorage["LIVE_PLAYER_STATUS"].replace("flash", 'html5');
                                window.location.reload();
                                return
                            }

                            let LT_Timer = () => {//判断是否清空辣条数量
                                let riqicheck = new Date();
                                let xiaoshi=riqicheck.getHours();
                                let fenzhong=riqicheck.getMinutes();
                                xiaoshi=riqicheck.getHours();
                                fenzhong=riqicheck.getMinutes();
                                if (checkNewDay(API.GIFT_COUNT.CLEAR_TS)) {
                                    if (checkNewDay(API.GIFT_COUNT.CLEAR_TS) && API.GIFT_COUNT.CLEAR_TS && xiaoshi==0 && fenzhong==0) {

                                        //  DMCHECK=1;

                                        /*
                var event = document.createEvent('Event');
                event.initEvent('input', true, true);
                $('.chat-input.border-box').val(`Lv${API.GIFT_COUNT.BPDJ}级${CJ}：今日捡了${API.GIFT_COUNT.COUNT}根辣条`);
                $('.chat-input.border-box')[0].dispatchEvent(event);
                  setTimeout(() => {
                $('.bl-button.live-skin-highlight-button-bg.bl-button--primary.bl-button--small').click();
                }, 500);
             */
                                    };
                                    API.chatLog('修仙风暴即将到来，10秒后再启修行');
                                    setTimeout(() => {
                                        API.GIFT_COUNT.YCLOCL01=API.GIFT_COUNT.CLOCL01;
                                        API.GIFT_COUNT.YCLOCL26=API.GIFT_COUNT.CLOCL26;
                                        API.GIFT_COUNT.YCLOCL712=API.GIFT_COUNT.CLOCL712;
                                        API.GIFT_COUNT.YCLOCL1317=API.GIFT_COUNT.CLOCL1317;
                                        API.GIFT_COUNT.YCLOCL18=API.GIFT_COUNT.CLOCL18;
                                        API.GIFT_COUNT.YCLOCL19=API.GIFT_COUNT.CLOCL19;
                                        API.GIFT_COUNT.YCLOCL20=API.GIFT_COUNT.CLOCL20;
                                        API.GIFT_COUNT.YCLOCL21=API.GIFT_COUNT.CLOCL21;
                                        API.GIFT_COUNT.YCLOCL22=API.GIFT_COUNT.CLOCL22;
                                        API.GIFT_COUNT.YCLOCL23=API.GIFT_COUNT.CLOCL23;
                                        API.GIFT_COUNT.YGIFT=API.GIFT_COUNT.COUNT;
                                        API.GIFT_COUNT.CLOCL01=0
                                        API.GIFT_COUNT.CLOCL26=0;
                                        API.GIFT_COUNT.CLOCL712=0;
                                        API.GIFT_COUNT.CLOCL1317=0;
                                        API.GIFT_COUNT.CLOCL18=0;
                                        API.GIFT_COUNT.CLOCL19=0;
                                        API.GIFT_COUNT.CLOCL20=0;
                                        API.GIFT_COUNT.CLOCL21=0;
                                        API.GIFT_COUNT.CLOCL22=0;
                                        API.GIFT_COUNT.CLOCL23=0;
                                        API.GIFT_COUNT.COUNT = 0;
                                        API.GIFT_COUNT.LOVE_COUNT = 0;
                                        API.GIFT_COUNT.CLEAR_TS = dateNow();
                                        API.saveGiftCount();
                                        console.log('清空辣条数量')
                                    }, 9000);
                                    setTimeout(() => {
                                        window.location.reload()
                                    }, 10000);
                                } else {
                                    console.log('无需清空辣条数量');
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
                                if (API.GIFT_COUNT.COUNT >= API.CONFIG.MAXGIFT) {//判断是否超过辣条限制
                                    console.log('超过今日辣条限制，关闭轮刷抽奖');
                                    API.chatLog('超过今日辣条限制，关闭轮刷抽奖');
                                    clearInterval(check_timer);
                                    return
                                }
                                if (API.giftblocked &API.guardblocked &API.pkblocked) {//如果被禁用则停止
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
                           let check_timer = setInterval(check_top_room, 125e3);
                            let reset = (delay) => {
                                setTimeout(function () {//重置直播间
                                    if (API.raffleId_list.length > 0) {
                                        console.log('还有礼物没抽 延迟30s后刷新直播间');
                                        reset(30000);
                                        return
                                    }
                                    if (API.giftblocked &API.guardblocked &API.pkblocked) {
                                        return
                                    }
                                    window.location.reload();
                                }, delay);
                            };
                            reset(API.CONFIG.CZ * 60000);
                        } else {

                            API.chatLog('插件未启用，请前往限定直播间开启!', 'warning');
                            let csm = $('<apend style="position: absolute; top: 128px; left: 1;right: 1;z-index: 1;background-color:#000000;color:white;border-radius: 4px;border: none;padding: 5px;box-shadow: 1px 1px 2px #00000075;resizable:no">' +
                                        '插件限定直播间：' +
                                        '<div style="color:#66CCFF">传送门：<a href="https://live.bilibili.com/258453" target="_blank">@Lokisonl懒懒</a></div>' +
                                        '<div style="color:#66CCFF">传送门：<a href="https://live.bilibili.com/4211793" target="_blank">@桜落_</a></div>');
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
                        }, parseInt(API.CONFIG.TIME_GET + Math.ceil(Math.random() * 100)));
                        setInterval(function () {
                            goTop(nowIndex);//跳转到下一个直播间
                        }, API.CONFIG.TIME_FLASH);
                    }

                    function goTop(index) {
                        $.get("https://api.live.bilibili.com/rankdb/v1/Rank2018/getTop?type=master_realtime_hour&type_id=areaid_realtime_hour", function (data) {
                            let list = data.data.list;// [{id: ,link:}]
                            let link = list[index].link;
                            if (!link) {
                                link = '/258453';
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
                })();