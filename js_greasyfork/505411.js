// ==UserScript==
// @name              沧海梦幻工具箱
// @namespace         http://tampermonkey.net/
// @version           1.0
// @description       日常任务、大号抢小号妖王功能；
// @icon              data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAkACQAAD//gAUU29mdHdhcmU6IFNuaXBhc3Rl/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAGgAeAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A8/stTivZLhFV0eBtrhwB+PXpXc/Bj4bXXxy1ObTdE1XTrDUE3GO31PzkMyqMsytHE64Gf4iD6A15TrUx0fUriVQcXcBUY/vjivpb9hGz+w/GLTocYK6dcbvqQCa/Q6ec46dWth21zUFNzdt3zfuvS8btng5rwnkuCy3DZrSi3DGyoqiuZ6JQf1m/flq2hG+yMPTf2e9X1nVPEFlZa9olx/YTmO9nDXKxo4LB1G6AMxUockDB7E1i+Jvg/rnhzw/peuRSWut6RqP+pu9MMjgHBIDK6KwOAe3bBwa+g/hQEPiP41CVmSM6ndbmRdxA3zZIGRn8xXkniP42Wdr4C0Dwp4XhvPI0/wDeTX2oIsbyvhshUR2AGWJ5Y9h71+cUuKuK8ZxVisry6KqUqFSkpJxSiqc6DnKUp7qXPyqKV7pv3WtV8NWyzLKGAhXrNxlNTtZ3fNGdkku3Le/5njU1tDcbfNiSXacrvUHB9q3/AA/438R+Eo5o9D1/VNGSYhpV0+8kgDkdCwRhn8axaK/od0abbbitd9N7bXPh/rNflhDndo3sruyvvbtfrbc6Kf4j+LLq4uJ5vFGszT3CCOaSTUJmaVBnCsS2SBk8H1Nc7RRUU8NRoylOlBRcrXaSTdtFfvZbGU6tSpbnk3buz//Z
// @author            沧海
// @include           *://xyh5.163.com/*
// @connect           api.bilibili.com
// @grant             unsafeWindow
// @grant             GM_addStyle
// @grant             GM_openInTab
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @charset		      UTF-8
// @license           GPL License
// @downloadURL https://update.greasyfork.org/scripts/505411/%E6%B2%A7%E6%B5%B7%E6%A2%A6%E5%B9%BB%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/505411/%E6%B2%A7%E6%B5%B7%E6%A2%A6%E5%B9%BB%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

const CH = (function () {
    "use strict";
    (function(){
        // 初始化加载Jquery
        let script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.src = "https://cdn.bootcdn.net/ajax/libs/jquery/3.2.1/jquery.min.js";
        document.documentElement.appendChild(script);

        // 用法同setInterval
        function mySetInterval(callback, interval) {
            let counter=1, startTime=Date.now();
            let _sto = window.setTimeout(instance, interval);

            function instance(){
                let ideal = counter * interval, real=Date.now() - startTime;
                counter++;
                let diff = real - ideal;
                callback();
                clearTimeout(_sto);
                _sto = window.setTimeout(instance, interval - diff);
            }

        }

        window.setInterval = mySetInterval;
    })();

    class GlobalConfig {
        constructor() {
            /**
			 * 区号
			 */
            this.hostId = 0;
            /**
			 * 是否在线
			 */
            this.isOnLine = false;
            /**
			 * 是否登陆进入游戏中: Gaming/WaitingLoginAuth
			 */
            this.isGaming = false;
            /**
			 * 初始化函数
			 */
            this._initFn = this._init();
        }
        _init() {
            this.hostId = LoginManager.getInstance().serverInfo.hostid;
            this.isOnLine = WebSocketManger.getInstance().socketConnected;
            this.isGaming = this.isGaming = LoginManager.getInstance().loginState === "Gaming";
        }

        static getHostId() {
            return LoginManager.getInstance().serverInfo.hostid;
        }

        static geIsOnLine() {
            return WebSocketManger.getInstance().socketConnected;
        }

        static getIsGaming() {
            return LoginManager.getInstance().loginState === "Gaming";
        }
    }

    var Commons = {
        command: {
            jump(warId) {
                return { 6: [warId, GlobalConfig.getHostId(), 1], 7: 50033 };
            },
            fireDemonKing(level) {
                return { 6: [(level - 40) / 10, 0], 7: 58004 };
            },
            fireSealMonster(level) {
                return { 6: [level], 7: 50386 };
            },
            goto: {
                main: {"6":[],"7":62009}
            },
            renWu: {
                openTask1: { 6: [1001], 7: 52007 },
                shenqirenwu(flag) {
                    return { 6: [flag, 0], 7: 52054 };
                },
                dakaibeibao: { 6: [1017], 7: 52007 },
                zidongfenjie(goodsArray) {
                    return { 6: [2, goodsArray], 7: 50015 };
                }
            },
            zhuaGui: {
                into: { 6: [10001], 7: 52008 },
                startTask(hostId) {
                    return { 6: [1, 2, hostId], 7: 50100 };
                },
                tianYanRefresh: { 6: [], 7: 50138 },
                challenge: { 6: [], 7: 50137 },
                reward: { 6: [], 7: 50160 }
            },
            zhongZu: {
                into: { 6: [10002], 7: 52008 },
                startTask(hostId) {
                    return { 6: [1, 3, hostId], 7: 50100 };
                },
                generateTask: { 6: [1, 3, 128289], 7: 50100 },
                fireWar: { 6: [], 7: 50179 },
                collect: { 6: [], 7: 50189 },
                reward() {
                    //下标：2-9，最后领2次9，总共9次。
                    for (var i = 2; i < 11; i++) {
                        WebSocketManger.getInstance().doSend({ 6: [], 7: 50178 });
                        if (i == 10) {
                            WebSocketManger.getInstance().doSend({ 6: [9], 7: 50190 });
                            break;
                        }
                        WebSocketManger.getInstance().doSend({ 6: [i], 7: 50190 });
                    }
                }
            },
            riChangRenWuJiHe: {
                youxiang: {
                    shouqu: { 6: [0], 7: 50021 },
                    shanchu: { 6: [1], 7: 50021 }
                },
                yingfudating: {
                    meiriqiandao: {
                        shangwu: { 6: [], 7: 52251 }
                    },
                    lingtiaozhanling: { 6: [0, 0], 7: 61004 }
                },
                bangpai: {
                    migong: { 6: [], 7: 79052 },
                    shilian: { 6: [], 7: 75161 },
                    yunbiao: { 6: [], 7: 79084 },
                    jianshe: { "6": [130002], "7": 79102}
                },
                lilian: {
                    shengsijie: { 6: [9, 3], 7: 52170 },
                    juezhanhuashan: { 6: [], 7: 50117 },
                    yantadigong: { 6: [], 7: 50060 }
                },
                shangcheng: {
                    meirilibao: { 6: [10001], 7: 58069 }
                },
                juese: {
                    fabao: {
                        huoquyici: { 6: [3], 7: 57035 }
                    },
                    jingmai: {
                        wuxue: {
                            jingyanlianhua: { 6: [4001, 1, 0], 7: 61022 }
                        }
                    },
                    qiannengguo: {
                        chouquyici: { 6: [1], 7: 52038 }
                    }
                },
                shanghui: {
                    leitaishangdian: [
                        {
                            6: ["arena", 10001, 5, true],
                            7: 50275
                        },
                        {
                            6: ["arena", 10002, 5, true],
                            7: 50275
                        },
                        {
                            6: ["arena", 10003, 7, true],
                            7: 50275
                        },
                        {
                            6: ["arena", 10004, 2, true],
                            7: 50275
                        },
                        {
                            6: ["arena", 10005, 7, true],
                            7: 50275
                        },
                        {
                            6: ["arena", 10006, 7, true],
                            7: 50275
                        },
                        {
                            6: ["arena", 10007, 2, true],
                            7: 50275
                        }
                    ],
                    xingxiushangdian: [
                        {
                            6: ["star_welfare", 240003, 18, true],
                            7: 50275
                        }
                    ],
                    shilianshangdian: [
                        {
                            6: ["shilian", 320001, 1, true],
                            7: 50275
                        },
                        {
                            6: ["shilian", 320017, 1, true],
                            7: 50275
                        },
                        {
                            6: ["shilian", 320035, 1, true],
                            7: 50275
                        }
                    ]
                },
                richangrenwu: {
                    juqingtiaozhan: {
                        6: [3],
                        7: 50249
                    },
                    fubenrenwu: {
                        6: [1],
                        7: 50245
                    },
                    huoyue: { 6: [0], 7: 50287 }
                },
                leitai: {
                    leitai: {
                        jinru: {
                            6: [0, 1],
                            7: 50045
                        },
                        zhanwuci: {
                            6: [],
                            7: 62010
                        }
                    }
                },
                fengyinyaowang: {
                    lieshoubintuan: {
                        guyongbintuan: {
                            6: [],
                            7: 58138
                        }
                    }
                }
            },
            fengYao: {
                mailing(hostId) {
                    return [
                        {
                            6: [],
                            7: 50388
                        },
                        {
                            6: [1, hostId],
                            7: 56010
                        }
                    ];
                }
            }
        },
        methods: {
            /**
			 * 休眠
			 * @param {超时毫秒数} duration
			 * @returns
			 */
            sleep(duration) {
                return new Promise(resolve => {
                    setTimeout(resolve, duration);
                });
            },
            /**
			 * 休眠指定时间，超时后继续执行。
			 * @param {promise对象} promise
			 * @param {超时毫秒数} timeout
			 * @param {消息} message
			 * @returns
			 */
            execTimeout(promise, timeout, message = "超时") {
                let timer;
                const timeoutPromise = new Promise((resolve, reject) => {
                    timer = setTimeout(reject, timeout, message);
                }).finally(() => {
                    clearTimeout(timer);
                });
                return Promise.race([promise, timeoutPromise]);
            },
            /**
			 * 发包
			 * @param {命令对象} commandPackage
			 * @param {日志消息} logMsg
			 * @param {第一个参数为数组时，间隔延时毫秒数} delayMilliSecond
			 * @returns
			 */
            doSend(commandPackage = {}, logMsg = "", delayMilliSecond = 500) {
                return new Promise((resolve, reject) => {
                    if (logMsg) {
                        console.log(logMsg);
                    }
                    if (commandPackage && Array.prototype.isPrototypeOf(commandPackage)) {
                        (async () => {
                            for (let i = 0; i < commandPackage.length; i++) {
                                await Commons.methods.sleep(delayMilliSecond).then(() => {
                                    WebSocketManger.getInstance().doSend(commandPackage[i]);
                                    console.log("发送指令：", JSON.stringify(commandPackage[i]));
                                });
                            }
                            resolve();
                        })();
                    } else if (commandPackage && Object.prototype.isPrototypeOf(commandPackage)) {
                        WebSocketManger.getInstance().doSend(commandPackage);
                        console.log("发送指令：", JSON.stringify(commandPackage));
                        resolve();
                    } else {
                        reject("命令行参数不正确");
                    }
                });
            },
            /**
			 * 收包
			 * @param {命令对象} commandPackage
			 * @returns
			 */
            doReceive(commandPackage = {}, logMsg = "") {
                return new Promise(resolve => {
                    if (logMsg) {
                        console.log(logMsg);
                    }
                    prot_$.exceProtData_$(commandPackage);
                    resolve();
                });
            },
            /**
			 * 跳过战斗
			 * @param {战斗ID} warId
			 * @returns
			 */
            jump(warId) {
                return new Promise(resolve => {
                    RecordWarMgr.Inst.onWarRecording=0;
					UIManager.getInst(WarUI).onTouchSkipBtn();
                    resolve();
                });
            },
            /**
			 * 显示消息
			 * @param {数组类型-消息体} msg 如：['#W关闭#Y【跳过】#W功能']
			 * @returns
			 */
            showMsg(msg = "") {
                return new Promise(resolve => {
                    let arrs = [];
                    if (msg) {
                        arrs.push(msg);
                    }
                    this.doReceive({
                        6: arrs,
                        7: 22
                    });
                    console.log(msg);
                    resolve();
                });
            },
            /**
			 * 格式化输出日期时间字符串
			 * @param x 待显示的日期时间，例如new Date()
			 * @param y 需要显示的格式，例如yyyy-MM-dd hh:mm:ss
			 */
            date2str(x, y) {
                if (!x) {
                    x = new Date();
                }
                if (!y) {
                    y = "yyyy-MM-dd hh:mm:ss";
                }
                var z = {
                    y: x.getFullYear(),
                    M: x.getMonth() + 1,
                    d: x.getDate(),
                    h: x.getHours(),
                    m: x.getMinutes(),
                    s: x.getSeconds()
                };
                return y.replace(/(y+|M+|d+|h+|m+|s+)/g, function (v) {
                    return ((v.length > 1 ? "0" : "") + eval("z." + v.slice(-1))).slice(-(v.length > 2 ? v.length : 2));
                });
            },
            utils: {
                sys: {
                    /**
					 * 不用判空取值
					 * 如：get(['user','posts',2,'time'],res))
					 */
                    get: (p, o) => p.reduce((xs, x) => (xs && xs[x] ? xs[x] : null), o)
                },
                localStorage: {
                    get(key) {
                        let val = window.localStorage.getItem(key);
                        if (val) {
                            return JSON.parse(val);
                        }
                        return "";
                    },
                    set(key, val) {
                        window.localStorage.setItem(key, JSON.stringify(val));
                    },
                    del(key) {
                        window.localStorage.removeItem(key);
                    },
                    exist(key) {
                        return !!window.localStorage.getItem(key);
                    },
                    addEvent(fnHandle = e => {}) {
                        window.addEventListener("storage", fnHandle);
                    },
                    removeEvent(fnHandle = e => {}) {
                        window.removeEventListener("storage", fnHandle);
                    }
                }
            }
        }
    };

    /**
	 * 延时调用类
	 */
    class DelayManage {
        constructor() {
            this.params = []; // 用来缓存链式调用的结果进行传递
            this.queue = Promise.resolve();
        }

        /**
		 * 睡眠指定时间。默认1秒
		 */
        sleep(time = 1) {
            this.queue = this.queue.then(() => {
                return new Promise(res => {
                    setTimeout(res, time*1000);
                });
            });
            return this;
        }
        /**
		 * 执行传入的方法
		 */
        do(callback) {
            this.queue = this.queue.then(() => {
                if (typeof callback == "function") {
                    // 将上一次执行结果作为参数传入。将本次执行结果保存备用。
                    this.params.push(callback(this.params.pop()));
                } else {
                    console.info("请传入回调函数，当前是个：", typeof callback);
                }
            });
            return this;
        }
    }

    /**
	 * 异常处理类
	 */
    class ExceptionHandle {
        /**
		 * 在线检测
		 */
        static checkOnLine() {
            // socket closed
            if (!GlobalConfig.isOnLine) {
            }
        }
    }

    class FengYao {
        constructor() {
            // 延时任务管理
            this.dm = new DelayManage();

            // 待打妖王数组,如：[50,60,70,130]
            this.demons = [];
            // 远程返回的妖王所有数据
            this.remoteDemonKingsData = {};
            // 有效的妖王数据，根据demons排查后得到status为2的数据。
            this.validDemons = [];
            // 抢妖王的数组，如：[350,340,360]
            this.robDemons = [];
            // 被抢妖王的数组，如：[350,340,360]
            this.robbedDemons = [];
            // 被抢妖王的号的监控数组，如：[350,340,360]
            this.robbedMonitorDemons = [];
            // 抢妖王的用户ID
            this.robUserId = 0;
            // 被抢妖王的用户ID
            this.robbedUserIds = [];
            // 封妖开关打开后，调用抢妖王任务的延时秒数
            this.sealDemonsDelaySecond = 30;
            // 封妖-数据 seal_monster_net
            this.remoteSealMonsters = {};
            // 封妖-待封妖数组, 如:[380,400,420,440,460,480]
            this.sealMonsters = [];
            // 封妖-购买令牌当前次数
            this.sealMonsterCurrentNum = 0;
            // 封妖-购买令牌最大次数
            this.sealMonsterMaxNum = 20;

            // 封妖王开关
            this.sealDemonSwitch = false;
            // 小号打高级妖王开关
            this.robbedDemonSwitch = false;
            // 大号抢高级妖王开关
            this.robDemonSwitch = false;
            // 封妖-开关
            this.sealMonsterSwitch = false;
        }

        /**
		 * 更新远程数据
		 */
        _queryRemoteData() {
            let fn = async () => {
                await this._refreshRemoteData()
                    .then(data => {
                    if (data == 1) {
                        this._sealDemonKingsCheck();
                        return "远程数据-获取成功";
                    } else {
                        console.log("妖王归属次数用完, 停止所有任务。");
                        this.stopAllSealTask();
                        return "妖王归属次数用完";
                    }
                })
                    .catch(err => {
                    console.log(err);
                    Commons.methods.sleep(1000).then(fn);
                });
            };
            return fn();
        }

        _refreshRemoteData() {
            return new Promise((resolve, reject) => {
                const _this = this;
                return UIManager.open(egret.g("ChallengeBaseUI")).then(function (n) {
                    // 1、妖王远程数据获取
                    if (_this.sealDemonSwitch || _this.robDemonSwitch || _this.robbedDemonSwitch) {
                        demonking_net.C_OPEN_MAIN();
                        const data = n.activityPanelMap.get("demonking");
                        if (data && data.data) {
                            _this.remoteDemonKingsData = data;
                        } else {
                            reject("远程数据-获取失败");
                        }
                    }
                    // 2、封妖远程数据获取
                    if (_this.sealMonsterSwitch) {
                        seal_monster_net.C_OPEN_MAIN();
                        let data = n.activityPanelMap.get("sealMonster");
                        if (data && data.$monsterData) {
                            _this.remoteSealMonsters = data;
                            _this._sealMonstersExitCheck();
                        } else {
                            reject("远程数据-获取失败");
                        }
                    }
                    resolve(1);
                }).catch(err=>Commons.methods.showMsg("#R请打开妖王页面！。"));
            });
        }

        /**
		 * 封妖王相关检测
		 */
        _sealDemonKingsCheck() {
            // 1、大号检测
            const selfUserId = HeroMainManager.getInstance().userId;
            if (!this.robUserId) {
                this.robUserId = parseInt(Commons.methods.utils.localStorage.get("robUserId"));
            }
            // 1.1、检测次数
            if (this.robUserId == selfUserId) {
                var remainingTimes = 100 - this.remoteDemonKingsData.data.fight_cnt;
                console.log("当前妖王归属次数=" + remainingTimes);
                if (remainingTimes == 0) {
                    Commons.methods.utils.localStorage.set("robDemonKingsTask", "0");
                    Commons.methods.showMsg("#Y任务结束，妖王归属次数已用完。");
                    this.stopAllSealTask();
                }
            }

            // 2、小号检测
            if (!this.robbedUserIds || this.robbedUserIds.length == 0) {
                this.robbedUserIds = Commons.methods.utils.localStorage.get("robbedUserIds");
            }
            if (this.robbedUserIds.includes(selfUserId)) {
                const robDemonKingsTask = Commons.methods.utils.localStorage.get("robDemonKingsTask");
                // 2.1、检测次数
                if (!robDemonKingsTask || (robDemonKingsTask && parseInt(robDemonKingsTask) == 0)) {
                    Commons.methods.showMsg("#Y小号检测到robDemonKingsTask=0，停止所有封妖王任务。");
                    this.stopAllSealTask();
                }
                // 2.2、检测大号是否卡住未打了-即妖王归属为小号并且已死亡
                const remoteDemonsData = Object.values(this.remoteDemonKingsData.demonsData);
                if (remoteDemonsData) {
                    const rebbedUserDemonKings = remoteDemonsData.filter(item => this.demons.some(ele => ele == item.level && item.status == 3 && item.owner == selfUserId));
                    if (rebbedUserDemonKings && rebbedUserDemonKings.length > 1) {
                        Commons.methods.showMsg("#Y检测到大号卡住未攻击妖王，停止所有封妖王任务。");
                        this.stopAllSealTask();
                    }
                }
            }
        }

        /**
		 * 获取命令包
		 * @param {有效的怪物对象数组} validObjectArray
		 * @param {类型：1=封妖；2=妖王} type
		 * @return 命令包
		 */
        _getCommandPackage(validObjectArray = [], type = 1) {
            let command = "";
            if (validObjectArray && validObjectArray.length > 0) {
                const levelArray = validObjectArray.map(item => item.level).sort((a, b) => a - b);
                console.log("有效怪物数组：" + JSON.stringify(levelArray));
                const validDataLevel = levelArray.pop();
                console.log("待战斗怪物级别：" + validDataLevel);
                if (type === 1) {
                    command = Commons.command.fireSealMonster(validDataLevel);
                } else if (type === 2) {
                    command = Commons.command.fireDemonKing(validDataLevel);
                }
            }
            console.log("待发送指令：", JSON.stringify(command));
            return command;
        }

        /**
		 * 战斗并跳过
		 *
		 */
        _fireWar(commandPackage = "", jumpDelayMilliSecond = 1500, callBackFn = () => {}) {
            return Commons.methods
                .doSend(commandPackage)
                .then(() => Commons.methods.sleep(500))
                .then(() => {
                const warManage = UIManager.getInst(WarUI);
                return GlobalFunc.safeInvokeFunc(warManage, function () {
                    const currentWarId = warManage.warID;
                    if (warManage && warManage.type != 0 && WarUI.WarState && currentWarId) {
                        console.log("参数=【warManage.type=" + warManage.type + ",WarUI.WarState=" + WarUI.WarState + ",currentWarId=" + currentWarId + "】");
                        return Commons.methods.sleep(jumpDelayMilliSecond).then(() => Commons.methods.jump(currentWarId));
                    }
                });
            })
                .then(() => {
                console.log("战斗结束");
                callBackFn();
            })
                .catch(e => {
                console.error(e);
            });
        }
        /**
		 * 战斗前检查
		 * @param {延时秒} delaySecond
		 * @param {回调函数} callback
		 */
        _fireWarPrefixCheck(delaySecond = 3) {
            // todo: 1、战斗次数检测；  2、当前玉检测；
            return new Promise((resolve, reject) => {
                if (UIManager && UIManager.getInst(WarUI) && UIManager.getInst(WarUI).type != 0) {
                    console.log("当前正在战斗中，延时" + delaySecond + "秒后重试。");
                    this.dm.sleep(delaySecond).do(this._fireWarPrefixCheck.bind(this, delaySecond));
                    resolve();
                }
            }).catch(err => {
                console.error("战斗前检查-发生错误：" + err);
            });
        }

        /**
		 * 获取妖王相关时间，返回秒数。
		 * @param type 1:escaptTime; 2:refreshTime
		 * @return 秒数
		 */
        _getDemonsTime(type = 1) {
            try {
                // escapeTime表示下一次刷新时间（包括刷出和刷没）,当妖王逃跑后则此值为-1；
				let escapeTime = this.remoteDemonKingsData.escapeCountdown.leftTime;
				// refreshTime表示下一次刷出时间；
				let refreshTime = this.remoteDemonKingsData.refreshCountdown.leftTime;
				if (!escapeTime) {
					escapeTime = 1;
				} else if (escapeTime > 30 * 60) {
					return this.dm
						.sleep(2 * 60)
						.do(this._queryRemoteData.bind(this))
						.sleep(2)
						.do(this._getDemonsTime.bind(this, type));
				}
				if (!refreshTime) {
					refreshTime = 1000;
                } else if (refreshTime > 30 * 60) {
                    return this.dm
                        .sleep(2 * 60)
                        .do(this._queryRemoteData.bind(this))
                        .sleep(2)
                        .do(this._getDemonsTime.bind(this, type));
                }
                // prettier-ignore
                return type === 1 ? escapeTime : type === 2 ? refreshTime : new Error("类型参数必传！");
            } catch (e) {
                console.error(e);
                this.dm.sleep(1).do(this._queryRemoteData.bind(this)).sleep(2).do(this._getDemonsTime.bind(this, type));
            }
        }

        /**
		 * 封妖任务
		 */
        _sealMonsters() {
            if (!this.sealMonsterSwitch) {
                // prettier-ignore
                console.log( "封妖任务开关 sealMonsterSwitch=" + this.sealMonsterSwitch + "，任务停止。" );
                return;
            }
            if (!this.remoteSealMonsters) {
                console.log("【封妖任务】- 远程数据未同步，3秒后重试。");
                return this.dm.do(this._queryRemoteData.bind(this)).sleep(5).do(this._sealMonsters.bind(this));
            }

            if (this.remoteSealMonsters.$cnt.cur == 0) {
                this.sealMonsterCurrentNum++;
                return this.dm
                    .do(
                    Commons.methods.doSend.bind(
                        this,
                        Commons.command.fengYao.mailing(GlobalConfig.getHostId()),
                        "【封妖任务】- 当前买令次数为:" + this.sealMonsterCurrentNum + ",最大买令次数为：" + this.sealMonsterMaxNum + "次。",
                        1000
                    )
                )
                    .sleep(1)
                    .do(this._queryRemoteData.bind(this))
                    .sleep(3)
                    .do(this._sealMonsters.bind(this));
            }

            this.validSealMonsters = this.remoteSealMonsters.$monsterData.filter(item =>
                                                                                 this.sealMonsters.some(ele => ele == item.level && item.status == 1 && item.hp | (0 == 100))
                                                                                );
            if (this.validSealMonsters.length > 0) {
                const command = this._getCommandPackage(this.validSealMonsters, 1);
                return this.dm
                    .do(this._fireWar.bind(this, command, 2000))
                    .sleep(2 * 60)
                    .do(this._queryRemoteData.bind(this))
                    .sleep(1)
                    .do(this._sealMonsters.bind(this));
            }
            console.log("【封妖任务】- 10分钟后再打。");
            return this.dm
                .sleep(10 * 60)
                .do(this._queryRemoteData.bind(this))
                .sleep(1)
                .do(this._sealMonsters.bind(this));
        }

        /**
		 * 封妖任务-退出检查
		 */
        _sealMonstersExitCheck() {
            // 买令次数超过最大设置次数，则任务停止。
            if (this.sealMonsterCurrentNum > this.sealMonsterMaxNum) {
                console.log("【封妖任务】- 当前买令次数达到" + this.sealMonsterCurrentNum + "次，任务中止。");
                this.sealMonsterSwitch = false;
            }
        }

        /**
		 * 封妖王任务
		 */
        _sealDemons() {
            try {
                if (!this.sealDemonSwitch) {
                    console.log("封妖王任务开关 sealDemonSwitch=" + this.sealDemonSwitch + "，任务停止。");
                    return;
                }

                if (!this.remoteDemonKingsData || !this.remoteDemonKingsData.demonsData) {
                    console.log("【封妖王任务】- 远程数据未同步，5秒后重试。");
                    return this.dm.do(this._queryRemoteData.bind(this)).sleep(5).do(this._sealDemons.bind(this));
                }

                // refreshTime表示下一次刷出时间；
                const refreshTime = this._getDemonsTime(2);
                console.log(refreshTime);

                const remoteDemonsData = Object.values(this.remoteDemonKingsData.demonsData);
                this.validDemons = remoteDemonsData.filter(item => this.demons.some(ele => ele == item.level && item.status == 2));
                console.log("远程妖王数据：" + JSON.stringify(this.remoteDemonKingsData.demonsData));
                if (this.validDemons.length > 0) {
                    const command = this._getCommandPackage(this.validDemons, 2);
                    this.dm.do(this._fireWar.bind(this, command, 1500)).sleep(2).do(this._queryRemoteData.bind(this)).sleep(1).do(this._sealDemons.bind(this));
                } else if (!refreshTime) {
                    console.log("刷新时间refreshTime未获取到，5秒后重试。");
                    this.dm.sleep(5).do(this._queryRemoteData.bind(this)).sleep(1).do(this._sealDemons.bind(this));
                } else if (refreshTime > 20) {
                    console.log("下次刷新在" + (refreshTime - 20) + "秒后。");
                    this.dm
                        .sleep(refreshTime - 20)
                        .do(this._queryRemoteData.bind(this))
                        .sleep(1)
                        .do(this._sealDemons.bind(this));
                } else {
                    Commons.methods.showMsg("#R请勿操作游戏，妖王刷新倒数中..." + refreshTime);
                    this.dm.do(this._queryRemoteData.bind(this)).sleep(1).do(this._sealDemons.bind(this));
                }
            } catch (error) {
                console.error(this);
                throw new Error(error);
            }
        }

        /**
		 * 检查用户是否拥有未死亡的归属妖王
		 */
        _checkHaveDemons(demons = [], userIds = []) {
			return Object.values(this.remoteDemonKingsData.demonsData).some(item => demons.some(ele => ele == item.level && item.status == 2 && userIds.includes(item.owner)));
		}

        /**
		 * 初始化大号用户信息
		 */
        _initRobUserInfo() {
            this.robbedUserIds = Commons.methods.utils.localStorage.get("robbedUserIds");
            if (this.robbedUserIds.length == 0) {
                Commons.methods.showMsg("#Y请先执行小号打被抢妖王的任务，大号才能抢。");
                return false;
            }
            if (!this.robUserId) {
                this.robUserId = HeroMainManager.getInstance().userId;
                Commons.methods.utils.localStorage.set("robUserId", this.robUserId);
            }
            if (!this.robUserId) {
                console.error("大号用户ID未获取到，5秒后重试。");
                return false;
            }
            return true;
        }
        /**
		 * 初始化小号用户信息
		 */
        _initRobbedUserInfo() {
            let robbedUserIds = Commons.methods.utils.localStorage.get("robbedUserIds");
            let selfUserId = HeroMainManager.getInstance().userId;
            if (robbedUserIds && robbedUserIds.length > 0) {
                if (!robbedUserIds.includes(selfUserId)) {
                    robbedUserIds.push(selfUserId);
                    Commons.methods.utils.localStorage.set("robbedUserIds", robbedUserIds);
                }
            } else {
                Commons.methods.utils.localStorage.set("robbedUserIds", [selfUserId]);
            }

            this.robbedUserIds = Commons.methods.utils.localStorage.get("robbedUserIds");
            if (this.robbedUserIds.length == 0) {
                console.error("小号用户ID未获取到，5秒后重试。");
                return false;
            }
            // 大号是后运行的，所以第一时间是获取不到的。
            if (!this.robUserId) {
                this.robUserId = parseInt(Commons.methods.utils.localStorage.get("robUserId"));
            }
            if (!this.robUserId) {
                Commons.methods.showMsg("#Y请启动大号抢妖王任务！等待大号启动任务中...");
                console.error("大号用户ID未获取到，等待大号连接中5秒后重试。");
                return false;
            }
            return true;
        }
        /**
		 * 被抢妖王的英雄(小号)的任务入口
		 */
        _robbedDemonsHandle() {
            try {
                if (!this.robbedDemons || this.robbedDemons.length == 0 || !this.robbedDemonSwitch) {
                    console.log("被抢妖王任务，开关：robbedDemonSwitch=" + this.robbedDemonSwitch + "，robbedDemons=" + this.robbedDemons + "，任务停止。");
                    return;
                }

                if (!this._initRobbedUserInfo()) {
                    this.dm.sleep(5).do(this._queryRemoteData.bind(this)).sleep(0.5).do(this._robbedDemonsHandle.bind(this));
                    return;
                }

                // escapeTime表示下一次刷新时间（包括刷出和刷没）,当妖王逃跑后则此值为-1；
                let escapeTime = this._getDemonsTime(1);
                // refreshTime表示下一次刷出时间；
                let refreshTime = this._getDemonsTime(2);
                console.log(refreshTime, escapeTime);

                // escapeTime == -1 时，表示没刷新；
                if (escapeTime > -1) {
                    // 检查大号、小号是否有归属妖王
                    if (this._checkHaveDemons(this.robbedMonitorDemons, [this.robUserId])) {
                        console.log("大号有归属妖王，等待5秒。");
                        this.dm.sleep(5).do(this._queryRemoteData.bind(this)).sleep(0.5).do(this._robbedDemonsHandle.bind(this));
                        return;
                    }
                    if (this._checkHaveDemons(this.robbedMonitorDemons, this.robbedUserIds)) {
                        console.log("小号有归属妖王，等待5秒。");
                        this.dm.sleep(5).do(this._queryRemoteData.bind(this)).sleep(0.5).do(this._robbedDemonsHandle.bind(this));
                        return;
                    }

                    // 检测大号是否停止
                    if (!Commons.methods.utils.localStorage.exist("robDemonKingsTask")) {
                        this.stopAllSealTask();
                        return;
                    }

                    // 获取还未打的妖王。
                    let validDemons = Object.values(this.remoteDemonKingsData.demonsData).filter(item => this.robbedDemons.some(ele => ele == item.level && item.status == 2 && item.owner == 0));
					if (validDemons && validDemons.length > 0) {
                        const command = this._getCommandPackage(validDemons, 2);
                        this.dm
                            .do(
                            this._fireWar.bind(this, command, 1000 * 10, () => {
                                const level = validDemons
                                .map(item => item.level)
                                .sort((a, b) => a - b)
                                .pop();
                                Commons.methods.utils.localStorage.set("robbedCurrentDemonKingLevel", level);
                                console.log("小号当前战斗完成妖王等级=%s级，等待触发大号抢妖王任务。", level);
                            })
                        )
                            .sleep(60 * 3)
                            .do(this._queryRemoteData.bind(this))
                            .sleep(0.5)
                            .do(this._robbedDemonsHandle.bind(this));
                        return;
                    }
                    // 设置的妖王打完了,下一次刷出的时间为:escapeTime(秒)+5(分)。
                    let nextOnline = escapeTime + 5 * 60;
                    if (this.sealDemonSwitch) {
                        nextOnline += this.sealDemonsDelaySecond;
                    }
                    console.error("妖王" + this.robbedDemons + "已全部打完，" + (nextOnline + 3) + "秒后重试。");
                    this.dm
                        .sleep(nextOnline + 3)
                        .do(this._queryRemoteData.bind(this))
                        .sleep(0.5)
                        .do(this._robbedDemonsHandle.bind(this));
                    return;
                } else {
                    console.log(refreshTime + 2, "秒后再调用！");
                    this.dm
                        .sleep(refreshTime + 2)
                        .do(this._queryRemoteData.bind(this))
                        .sleep(0.5)
                        .do(this._robbedDemonsHandle.bind(this));
                    return;
                }
            } catch (error) {
                console.error(this);
                throw new Error(error);
            }
        }

        /**
		 * 大号事件绑定函数
		 * @param {监听事件} e
		 */
        _robDemonsEvent(e) {            
            // 1、中止条件
            const newValue = parseInt(e.newValue);
            if (e.key === "robDemonKingsTask") {
                if (newValue === 0) {
                    console.log("storage.robDemonKingsTask=0,大号任务终止。");
                    this.stopAllSealTask();
                }
            }
            // 2、获取小号当前战斗过的怪，发起攻击。
            if (e.key === "robbedCurrentDemonKingLevel") {
                // 刷新查询大号剩余次数-次数不够停止
                this._queryRemoteData();
                if (newValue > 0) {
                    console.log("storage.robbedCurrentDemonKingLevel=%s", newValue);
                    const command = Commons.command.fireDemonKing(newValue);
                    this._fireWar.call(this, command, 1500, () => {
                        Commons.methods.utils.localStorage.set("robbedCurrentDemonKingLevel", "0");
                        console.log("storage.robbedCurrentDemonKingLevel=0,大号攻击完毕。");
                    });
                }
            }
        }

        /**
		 * 小号事件绑定函数
		 * @param {监听事件} e
		 */
        _robbedDemonsEvent(e) {
            // 1、中止条件
            const newValue = parseInt(e.newValue);
            if (e.key === "robDemonKingsTask") {
                if (newValue === 0 || newValue === NaN) {
                    console.log("storage.robDemonKingsTask=0,小号任务终止。oldValue=%s,newValue=%s", e.oldValue, e.newValue);
                    this.stopAllSealTask();
                }
            }
        }

        /**
		 * 封妖任务
		 */
        taskStartSealMonsters(monsterArray = []) {
            Commons.methods
                .showMsg("#Y启动自动封妖任务")
                .then(() => {
                this.sealMonsterSwitch = true;
                this.sealMonsters = monsterArray;
            })
                .then(() => this._queryRemoteData.bind(this))
                .then(() => this._sealMonsters());
        }

        /**
		 * 封妖王任务入口
		 */
        taskStartSealDemon(demonsArray = []) {
            Commons.methods
                .showMsg("#Y启动自动封妖王任务")
                .then(() => {
                this.sealDemonSwitch = true;
                this.demons = demonsArray;
            })
                .then(() => this._queryRemoteData.bind(this))
                .then(() => this._sealDemons());
        }

        /**
		 * 抢妖王任务入口
		 */
        taskStartRobDemons(robDemonsArray = []) {
            Commons.methods
                .showMsg("#Y启动大号抢妖任务")
                .then(() => {
                this.robDemonSwitch = true;
                this.robDemons = robDemonsArray;
                this.robUserId = HeroMainManager.getInstance().userId;
                Commons.methods.utils.localStorage.set("robUserId", this.robUserId);
                Commons.methods.utils.localStorage.set("robDemonKingsTask", "1");
                // 监控是否掉线
                const t1 = setInterval(() => {
                    this._onlineCheck();
                    clearInterval(t1);
                }, 5000);
            })
                .then(() => Commons.methods.utils.localStorage.addEvent(this._robDemonsEvent.bind(this)));
        }
        /**
		 * 被抢妖王任务入口
		 * @param {*} robbedDemonsArray 待打的妖王
		 * @param {*} robbedDemonsMonitorArray 待监控的妖王
		 */
        taskStartRobbedDemons(robbedDemonsArray = [], robbedDemonsMonitorArray = []) {
            Commons.methods
                .showMsg("#Y启动小号封高级妖任务")
                .then(() => {
                this.robbedDemonSwitch = true;
                this.robbedDemons = robbedDemonsArray;
                if (!robbedDemonsMonitorArray || robbedDemonsMonitorArray.length == 0) {
                    this.robbedMonitorDemons = robbedDemonsArray;
                } else {
                    this.robbedMonitorDemons = robbedDemonsMonitorArray;
                }
            })
                .then(() => Commons.methods.utils.localStorage.set("robbedUserIds", ""))
                .then(() => Commons.methods.utils.localStorage.addEvent(this._robbedDemonsEvent.bind(this)))
                .then(() => this._queryRemoteData.bind(this))
                .then(() => this._robbedDemonsHandle());
        }

        _onlineCheck() {
            if (!GlobalConfig.geIsOnLine()) {
                Commons.methods.utils.localStorage.set("robDemonKingsTask", 0);
            }
        }

        /**
		 * 明天大号自动开启任务
		 * @param {*} robDemons 抢妖王任务数组：[360,350,340,330,320,310,300,290]
		 * @param {*} demonKings 封妖王任务数组：[80,90,100,110,120,130]
		 * @returns
		 */
        taskStartRobUserTomorrow(robDemons = [], demonKings = []) {
            if (robDemons.length === 0 && demonKings.length === 0) {
                console.log("明日任务启动失败-参数未传");
                return;
            }
            var selfUserId = HeroMainManager.getInstance().userId;
            // ms
            var diff = new Date(new Date().toLocaleDateString()).getTime() + 86400000 - new Date().getTime();

            var tomorrowDelaySecond = diff / 1000;
            var daHaoRobNextDelaySecond = tomorrowDelaySecond + 70;
            var daHaoFengYaoNextDelaySecond = tomorrowDelaySecond + 10;
            if (robDemons.length > 0) {
                var daHaoTipTime = Commons.methods.date2str(new Date(new Date().getTime() + daHaoRobNextDelaySecond * 1000), "yyyy-MM-dd hh:mm:ss");
                console.log("下次开启大号抢高级妖任务的时间为：" + daHaoTipTime);
                this.dm.sleep(daHaoRobNextDelaySecond).do(() => {
                    // 大号
                    var fengyao = new FengYao();
                    fengyao.taskStartRobDemons(robDemons);
                    console.log("开启-大号抢高级妖任务，robDemons=" + robDemons);
                });
            }
            if (demonKings.length > 0) {
                var daHaoFengYaoTipTime = Commons.methods.date2str(new Date(new Date().getTime() + daHaoFengYaoNextDelaySecond * 1000), "yyyy-MM-dd hh:mm:ss");
                console.log("下次开启大号自动封妖任务的时间为：" + daHaoFengYaoTipTime);
                this.dm.sleep(daHaoFengYaoNextDelaySecond).do(() => {
                    var fengyao = new FengYao();
                    fengyao.taskStartSealDemon(demonKings);
                    console.log("开启-自动封妖任务，demonKings=" + demonKings);
                });
            }
        }

        /**
		 * 明天小号自动开启任务
		 * @param {*} robDemons 抢妖王任务数组：[360,350,340,330,320,310,300,290]
		 * @param {*} demonKings 封妖王任务数组：[80,90,100,110,120,130]
		 * @returns
		 */
        taskStartRobbedUserTomorrow(robDemons = [], demonKings = []) {
            if (robDemons.length === 0 && demonKings.length === 0) {
                console.log("明日任务启动失败-参数未传");
                return;
            }
            var selfUserId = HeroMainManager.getInstance().userId;
            // ms
            var diff = new Date(new Date().toLocaleDateString()).getTime() + 86400000 - new Date().getTime();

            var tomorrowDelaySecond = diff / 1000;
            var daHaoRobNextDelaySecond = tomorrowDelaySecond + 70;
            var daHaoFengYaoNextDelaySecond = tomorrowDelaySecond + 10;
            if (robDemons.length > 0) {
                var xiaoHaoTipTime = Commons.methods.date2str(new Date(new Date().getTime() + daHaoRobNextDelaySecond * 1000), "yyyy-MM-dd hh:mm:ss");
                console.log("下次开启小号封高级妖任务的时间为：" + xiaoHaoTipTime);
                this.dm.sleep(daHaoRobNextDelaySecond).do(() => {
                    // 小号
                    var fengyao = new FengYao();
                    fengyao.taskStartRobbedDemons(robDemons);
                    console.log("开启-小号封高级妖任务，robDemons=" + robDemons);
                });
            }
            if (demonKings.length > 0) {
                var daHaoFengYaoTipTime = Commons.methods.date2str(new Date(new Date().getTime() + daHaoFengYaoNextDelaySecond * 1000), "yyyy-MM-dd hh:mm:ss");
                console.log("下次开启大号自动封妖任务的时间为：" + daHaoFengYaoTipTime);
                this.dm.sleep(daHaoFengYaoNextDelaySecond).do(() => {
                    var fengyao = new FengYao();
                    fengyao.taskStartSealDemon(demonKings);
                    console.log("开启-自动封妖任务，demonKings=" + demonKings);
                });
            }
        }

        /**
		 * 停止所有封妖任务
		 */
        stopAllSealTask(callback) {
            this.sealDemonSwitch = false;
            this.robDemonSwitch = false;
            this.robbedDemonSwitch = false;
            Commons.methods.utils.localStorage.del("robUserId");
            Commons.methods.utils.localStorage.del("robbedUserIds");
            Commons.methods.utils.localStorage.del("robDemonKingsTask");
            Commons.methods.utils.localStorage.removeEvent(this._robDemonsEvent);
            Commons.methods.utils.localStorage.removeEvent(this._robbedDemonsEvent);
            callback && callback();
            Commons.methods.showMsg("#Y所有妖王任务停止。");
        }
    }

    class ZhuaGui {
        startTask() {
            return Commons.methods
                .doSend(Commons.command.zhuaGui.into, "开始执行抓鬼任务")
                .then(() => Commons.methods.sleep(500))
                .then(() => Commons.methods.doSend(Commons.command.zhuaGui.startTask(GlobalConfig.getHostId()), "开始"))
                .then(() => Commons.methods.sleep(500))
                .then(async () => {
                for (let i = 1; i < 21; i++) {
                    console.log("开始战斗:第" + i + "轮");
                    await Commons.methods
                        .doSend(Commons.command.zhuaGui.tianYanRefresh, "刷新天眼")
                        .then(() => Commons.methods.sleep(1000))
                        .then(() => Commons.methods.doSend(Commons.command.zhuaGui.challenge, "挑战"))
                        .then(() => Commons.methods.sleep(1500))
                        .then(async () => {
                        const warManage = UIManager.getInst(WarUI);
                        if (warManage && warManage.type == 1) {
                            await GlobalFunc.safeInvokeFunc(warManage, async function () {
                                const currentWarId = warManage.warID;
                                if (WarUI.WarState && currentWarId) {
                                    await Commons.methods.jump(currentWarId);
                                }
                            });
                        }
                    });
                }
            })
                .then(() => Commons.methods.doSend(Commons.command.zhuaGui.reward, "领取奖励"))
                .then(() => Commons.methods.sleep(500))
                .then(() => view_net.C_MAIN_CITY_TOUCHED())
                .catch(err => console.error(err));
        }
    }

    /**
	 * 日常任务集-全部（
	 *    收清邮件;
	 *    商会：擂台、星宿、试炼；
	 *    帮派：迷宫、历练、运镖；
	 *    历练：生死劫、雁塔地宫、决战华山；
	 *    擂台：擂台；
	 *    日常：剧情、副本；
	 *    盈福大厅：每日签到、领挑战令；
	 *    商城：每日礼包；
	 *    角色：法宝-获取一次、经脉-武学经验炼化、潜能果-抽取一次；
	 *
	 */
    class UsuallyTask {
        startAllTask() {
            return Commons.methods
                .showMsg("#G开始执行#R【日常任务集】#G功能")
                .then(() => Commons.methods.sleep(1000))
                .then(() => Commons.methods.showMsg("#Y2、邮箱收清件"))
                .then(() => Commons.methods.sleep(1000))
                .then(() => Commons.methods.doSend(Commons.command.riChangRenWuJiHe.youxiang.shouqu, "邮箱收件"))
                .then(() => Commons.methods.sleep(500))
                .then(() => Commons.methods.doSend(Commons.command.riChangRenWuJiHe.youxiang.shanchu, "邮箱清件"))
                .then(() => Commons.methods.sleep(500))
                .then(() => Commons.methods.showMsg("#Y3、商会：擂台、星宿、试炼"))
                .then(() => Commons.methods.sleep(1000))
                .then(() => {
                if (HeroMainManager.getInstance().level < 400) {
                    Commons.methods.doSend(Commons.command.riChangRenWuJiHe.shanghui.leitaishangdian, "商会-擂台");
                }
            })
                .then(() => Commons.methods.sleep(500))
                .then(() => Commons.methods.doSend(Commons.command.riChangRenWuJiHe.shanghui.xingxiushangdian, "商会-星宿"))
                .then(() => Commons.methods.sleep(500))
                .then(() => Commons.methods.doSend(Commons.command.riChangRenWuJiHe.shanghui.shilianshangdian, "商会-试炼"))
                .then(() => Commons.methods.sleep(500))
                .then(() => Commons.methods.showMsg("#Y4、帮派：迷宫、试炼、运镖、建设"))
                .then(() => Commons.methods.sleep(1000))
                .then(() => Commons.methods.doSend(Commons.command.riChangRenWuJiHe.bangpai.migong, "帮派-迷宫"))
                .then(() => Commons.methods.sleep(500))
                .then(() => Commons.methods.doSend(Commons.command.riChangRenWuJiHe.bangpai.shilian, "帮派-试炼"))
                .then(() => Commons.methods.sleep(500))
                .then(() => Commons.methods.doSend(Commons.command.riChangRenWuJiHe.bangpai.yunbiao, "帮派-运镖"))
                .then(() => Commons.methods.sleep(500))
                .then(() => Commons.methods.doSend(Commons.command.riChangRenWuJiHe.bangpai.jianshe, "帮派-建设"))
                .then(() => Commons.methods.sleep(500))
                .then(() => Commons.methods.showMsg("#Y5、历练：生死劫、雁塔地宫、决战华山"))
                .then(() => Commons.methods.sleep(1000))
                .then(() => Commons.methods.doSend(Commons.command.riChangRenWuJiHe.lilian.shengsijie, "历练-生死劫"))
                .then(() => Commons.methods.sleep(500))
                .then(() => Commons.methods.doSend(Commons.command.riChangRenWuJiHe.lilian.yantadigong, "历练-雁塔地宫"))
                .then(() => Commons.methods.sleep(500))
                .then(() => Commons.methods.doSend(Commons.command.riChangRenWuJiHe.lilian.juezhanhuashan, "历练-决战华山"))
                .then(() => Commons.methods.sleep(500))
                .then(() => Commons.methods.showMsg("#Y6、擂台"))
                .then(() => Commons.methods.sleep(1000))
                .then(() => Commons.methods.doSend(Commons.command.riChangRenWuJiHe.leitai.leitai.zhanwuci, "擂台-擂台5连战"))
                .then(() => Commons.methods.sleep(500))
                .then(() => Commons.methods.showMsg("#Y7、盈福大厅：每日签到、领挑战令"))
                .then(() => Commons.methods.sleep(1000))
                .then(() => Commons.methods.doSend(Commons.command.riChangRenWuJiHe.yingfudating.meiriqiandao.shangwu, "盈福大厅-每日签到"))
                .then(() => Commons.methods.sleep(500))
                .then(() => Commons.methods.doSend(Commons.command.riChangRenWuJiHe.yingfudating.lingtiaozhanling, "盈福大厅-领挑战令"))
                .then(() => Commons.methods.sleep(500))
                .then(() => Commons.methods.showMsg("#Y8、商城：每日礼包"))
                .then(() => Commons.methods.sleep(1000))
                .then(() => Commons.methods.doSend(Commons.command.riChangRenWuJiHe.shangcheng.meirilibao, "商城-每日礼包"))
                .then(() => Commons.methods.sleep(500))
                .then(() => Commons.methods.showMsg("#Y9、角色：法宝获取一次、经脉武学经验炼化、潜能果抽取一次；"))
                .then(() => Commons.methods.sleep(1000))
                .then(() => Commons.methods.doSend(Commons.command.riChangRenWuJiHe.juese.fabao.huoquyici, "角色-法宝获取一次"))
                .then(() => Commons.methods.sleep(500))
                .then(() => Commons.methods.doSend(Commons.command.riChangRenWuJiHe.juese.jingmai.wuxue.jingyanlianhua, "角色-经脉武学经验炼化"))
                .then(() => Commons.methods.sleep(500))
                .then(() => Commons.methods.doSend(Commons.command.riChangRenWuJiHe.juese.qiannengguo.chouquyici, "角色-潜能果抽取一次"))
                .then(() => Commons.methods.sleep(500))
                .then(() => Commons.methods.showMsg("#Y10、封印妖王：猎兽兵团雇佣；"))
                .then(() => Commons.methods.sleep(1000))
                .then(() => Commons.methods.doSend(Commons.command.riChangRenWuJiHe.fengyinyaowang.lieshoubintuan.guyongbintuan, "封印妖王-猎兽兵团雇佣"))
                .then(() => Commons.methods.sleep(500))
                .then(() => Commons.methods.showMsg("#Y11、日常：剧情、副本、神器"))
                .then(() => Commons.methods.sleep(1000))
                .then(() => Commons.methods.doSend(Commons.command.riChangRenWuJiHe.richangrenwu.juqingtiaozhan, "日常-剧情"))
                .then(() => Commons.methods.sleep(500))
                .then(() => Commons.methods.doSend(Commons.command.riChangRenWuJiHe.richangrenwu.fubenrenwu, "日常-副本"))
                .then(() => Commons.methods.sleep(500))
                .then(async () => {
                for (let i = 1; i < 10; i++) {
                    await Commons.methods
                        .doSend(Commons.command.renWu.shenqirenwu(i), "日常-神器-" + i)
                        .then(() => Commons.methods.sleep(200))
                        .then(() => UIManager.getInst(WarUI))
                        .then(async warManage => {
                        if (warManage && warManage.type === 1) {
                            const currentWarId = warManage.warID;
                            if (WarUI.WarState && currentWarId) {
                                await Commons.methods.sleep(2000).then(() => Commons.methods.jump(currentWarId));
                            }
                        }
                    });
                }
            })
                .then(() => Commons.methods.doSend(Commons.command.riChangRenWuJiHe.richangrenwu.huoyue, "日常-领取任务活跃"))
                .then(() => Commons.methods.sleep(500))
                .then(() => {
                view_net.C_MAIN_CITY_TOUCHED();
            })
                .catch(err => console.error(err));
        }
    }

    return {
        FengYao: FengYao,
        ZhuaGui: ZhuaGui,
        UsuallyTask: UsuallyTask,
        Commons: Commons
    };
})();

const util = (function () {
    function findTargetElement(targetContainer) {
        const body = window.document;
        let tabContainer;
        let tryTime = 0;
        const maxTryTime = 120;
        return new Promise((resolve, reject) => {
            let interval = setInterval(() => {
                tabContainer = body.querySelector(targetContainer);
                if (tabContainer) {
                    clearInterval(interval);
                    resolve(tabContainer);
                }
                if (++tryTime === maxTryTime) {
                    clearInterval(interval);
                    reject();
                }
            }, 500);
        });
    }

    function urlChangeReload() {
        const oldHref = window.location.href;
        let interval = setInterval(() => {
            let newHref = window.location.href;
            if (oldHref !== newHref) {
                clearInterval(interval);
                window.location.reload();
            }
        }, 500);
    }

    function syncRequest(option) {
        return new Promise((resolve, reject) => {
            option.onload = res => {
                resolve(res);
            };
            option.onerror = err => {
                reject(err);
            };
            GM_xmlhttpRequest(option);
        });
    }

    return {
        req: option => syncRequest(option),
        findTargetEle: targetEle => findTargetElement(targetEle),
        urlChangeReload: () => urlChangeReload()
    };
})();

const superVip = (function () {
    const _CONFIG_ = {
        isMobile: navigator.userAgent.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)/i),
        currentPlayerNode: null,
        vipBoxId: "vip_jx_box" + Math.ceil(Math.random() * 100000000),
        flag: "flag_vip"
    };
    class BaseConsumer {
        constructor() {
            this.parse = () => {
                util.findTargetEle(".egret-player")
                    .then(container => this.preHandle(container))
                    .then(container => this.generateElement(container))
                    .then(container => this.bindEvent(container));
            };
        }

        preHandle(container) {
            return new Promise((resolve, reject) => resolve(container));
        }

        generateElement(container) {
            GM_addStyle(`
                        #${_CONFIG_.vipBoxId} {cursor:pointer; position:fixed; top:120px; left:0px; z-index:9999999; text-align:left;}
                        #${_CONFIG_.vipBoxId} .img_box{width:32px; height:32px;line-height:32px;text-align:center;background-color:#red;margin:10px 0px;}
                        #${_CONFIG_.vipBoxId} .vip_list {display:none; position:absolute; border-radius:5px; left:32px; top:0; text-align:center; background-color: #3f4149; border:1px solid white;padding:10px 0px; width:380px; max-height:400px; overflow-y:auto;}
                        #${_CONFIG_.vipBoxId} .vip_list input{border-radius:2px; font-size:12px; color:#333333; text-align:center; width:calc(45%); line-height:21px; float:left; border:1px solid gray; padding:0 4px; margin:4px 2px;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;}
                        #${_CONFIG_.vipBoxId} .vip_list input:hover{color:#1c84c6; border:1px solid #1c84c6;}
                        #${_CONFIG_.vipBoxId} .vip_list ul{padding-left: 10px;}
                        #${_CONFIG_.vipBoxId} .vip_list::-webkit-scrollbar{width:5px; height:1px;}
                        #${_CONFIG_.vipBoxId} .vip_list::-webkit-scrollbar-thumb{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#A8A8A8;}
                        #${_CONFIG_.vipBoxId} .vip_list::-webkit-scrollbar-track{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#F1F1F1;}
                        #${_CONFIG_.vipBoxId} input.selected{color:#1c84c6; border:1px solid #1c84c6;}
						`);

            if (_CONFIG_.isMobile) {
                GM_addStyle(`
                    #${_CONFIG_.vipBoxId} {top:300px;}
                    #${_CONFIG_.vipBoxId} .vip_list {width:300px;}
                    `);
            }

            $(container).append(`
              <div id="${_CONFIG_.vipBoxId}">
                  <div class="vip_icon">
                      <div class="img_box" title="工具箱" style="color:white;font-size:16px;font-weight:bold;border-radius:5px;">
                          <span style="color: red;">沧海</span></span>
                      </div>
                      <div class="vip_list">
					      <input class="tc-li" type="button" name="usuallyActiveOneTask" value="日常-一条龙(活跃)"/>
                          <input class="tc-li" type="button" name="usuallyChostCatching" value="日常-抓鬼"/>
                          <div style="clear:both;"></div>
                          <input class="tc-li" type="button" name="robUserDemonKings" value="妖王-大号抢"/>
                          <input class="tc-li" type="button" name="robbedUserDemonKings" value="妖王-小号封"/>
                          <div style="clear:both;"></div>
                      </div>
                  </div>
              </div>`);
            return new Promise((resolve, reject) => resolve(container));
        }

        bindEvent(container) {
            const vipBox = $(`#${_CONFIG_.vipBoxId}`);
            if (_CONFIG_.isMobile) {
                vipBox.find(".vip_icon").on("click", () => vipBox.find(".vip_list").toggle());
            } else {
                vipBox.find(".vip_icon").on("mouseover", () => vipBox.find(".vip_list").show());
                vipBox.find(".vip_icon").on("mouseout", () => vipBox.find(".vip_list").hide());
            }

            let _this = this;
            vipBox.find(".vip_list input[type=button]").each((index, item) => {
                item.addEventListener("click", () => {
                    switch ($(item).attr("name")) {
                        case "robUserDemonKings":
                            new CH.FengYao().taskStartRobDemons([360, 350, 340, 330, 320, 310, 300, 290]);
                            CH.Commons.methods.showMsg("#Y妖王-大号抢");
                            break;
                        case "robbedUserDemonKings":
                            new CH.FengYao().taskStartRobbedDemons([360, 350, 340, 330, 320, 310, 300, 290]);
                            CH.Commons.methods.showMsg("#Y妖王-小号封");
                            break;
                        case "usuallyChostCatching":
                            new CH.ZhuaGui().startTask();
                            CH.Commons.methods.showMsg("#Y日常-抓鬼");
                            break;
                        case "usuallyActiveOneTask":
                            new CH.ZhuaGui()
                                .startTask()
                                .then(() => new CH.UsuallyTask().startAllTask());
                            CH.Commons.methods.showMsg("#Y日常-活跃一条龙");
                            break;
                        default:
                            break;
                    }
                });
            });

            //移动位置
            vipBox.mousedown(function (e) {
                if (e.which !== 3 && e.which !== 1) {
                    return;
                }
                e.preventDefault();
                vipBox.css("cursor", "move");
                const positionDiv = $(this).offset();
                let distenceX = e.pageX - positionDiv.left;
                let distenceY = e.pageY - positionDiv.top;

                $(document).mousemove(function (e) {
                    let x = e.pageX - distenceX;
                    let y = e.pageY - distenceY;
                    const windowWidth = $(window).width();
                    const windowHeight = $(window).height();

                    if (x < 0) {
                        x = 0;
                    } else if (x > windowWidth - vipBox.outerWidth(true) - 100) {
                        x = windowWidth - vipBox.outerWidth(true) - 100;
                    }

                    if (y < 0) {
                        y = 0;
                    } else if (y > windowHeight - vipBox.outerHeight(true)) {
                        y = windowHeight - vipBox.outerHeight(true);
                    }
                    vipBox.css("left", x);
                    vipBox.css("top", y);
                });
                $(document).mouseup(function () {
                    $(document).off("mousemove");
                    vipBox.css("cursor", "pointer");
                });
                $(document).contextmenu(function (e) {
                    e.preventDefault();
                });
            });
            return new Promise((resolve, reject) => resolve(container));
        }
    }

    class DefaultConsumer extends BaseConsumer {}

    return {
        start: () => {
            let mallCase = "Default";
            const targetConsumer = eval(`new ${mallCase}Consumer`);
            targetConsumer.parse();
        }
    };
})();

(function () {
    superVip.start();
})();
