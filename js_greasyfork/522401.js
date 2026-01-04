// ==UserScript==
// @name         2320
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @license MIT
// @description  try to take over the world!
// @author       You
// @match         https://wapact.189.cn:9001/*
// @match         https://wapside.189.cn:9001/*
// @match         https://www.189.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @require      https://unpkg.com/axios/dist/axios.min.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js
// @downloadURL https://update.greasyfork.org/scripts/522401/2320.user.js
// @updateURL https://update.greasyfork.org/scripts/522401/2320.meta.js
// ==/UserScript==

function getQueryParam(param) {
    let urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams,window.location);
    return urlParams.get(param);
}

function timeToRun(time, aheadMS, cb) {
    let sleepTime = moment(time).diff(moment(), "milliseconds") - aheadMS;
    console.log(`当前时间：${getTime()}，距离 ${time} 还有 ${sleepTime} 毫秒`);
    setTimeout(async function () {
        console.log(`当前时间：${getTime()}，开始执行任务`);
        await cb();
    }, sleepTime);
}

function sleepMS(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function sleep(s, t, printFlag = true) {
    if (s < 1000) s = s * 1000;
    if (t < 1000) t = t * 1000;
    let ms = s + Math.floor(Math.random() * (t - s + 1));
    if (printFlag) {
        console.log(`\t\t\t\t\t\t\t sleep ${ms} ms`);
    }
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getTime() {
    return moment().format('HH:mm:ss.SSS');
}

function getString(code){
    switch(code){
        case "413": return "商品已兑完";
        case "412": return "兑换次数已达上限";
        case "410": return "该活动已失效";
        case "0": return "============>>>>>> 兑换成功 <<<<<<===============";
    }
}

let picBusHallCode;
function getBusHallCode(){
    if(!picBusHallCode) picBusHallCode = '330122' + String(Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000);
    return picBusHallCode;
}

async function seckill({phone, name, id, count}) {
    try {
        console.log('seckill',phone,name,id,count)
        for (let i = 0; i < count; i++) {
            // setTimeout(async function () {
            try {
                console.log(getTime(), phone, name, `\t${i}\t start`);
                $.ajax({
                    url: window.location.origin + "/gateway/standExchange/detailNew/exchange",
                    type: "POST",
                    cache: !1,
                    async: !0,
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({
                        activityId: id
                    }),
                    timeout: 2001,
                    headers: {
                        Authorization: "Bearer " + JinDouMall.loginData.token + "",
                        "dzqd-version": JinDouMall.sessData.version
                    },
                    success: function (t) {
                        console.log(getTime(), phone, name, `\t${i}\t`,t?.biz?.resultCode?getString(t?.biz?.resultCode):t.message);
                    }
                })
            } catch (e) {
                process.stdout.write('-');
            }
            await sleepMS(5);
        }
    } catch (e) {
        console.log(getTime(), phone, name, e.message, "超时1");
    }
}


(function() {
    'use strict';

    // Your code here...
    let group = getQueryParam('group');
    let ws = getQueryParam('ws')||'new';
    console.log(group,ws);
    if(!group && getQueryParam('activityCode') === 'ACTCODE20240411NJMLX6LZ') group = 'jml';

    function Hlclient(wsURL) {
        this.wsURL = wsURL;
        this.handlers = {
            _execjs: function (resolve, param) {
                var res = eval(param)
                if (!res) {
                    resolve("没有返回值")
                } else {
                    resolve(res)
                }

            }
        };
        this.socket = undefined;
        if (!wsURL) {
            throw new Error('wsURL can not be empty!!')
        }
        this.connect()
    }
    if(ws === 'new'){
        Hlclient.prototype.connect = function () {
            console.log('begin of connect to wsURL: ' + this.wsURL);
            var _this = this;
            try {
                this.socket = new WebSocket(this.wsURL);
                this.socket.onmessage = function (e) {
                    _this.handlerRequest(e.data)
                }
            } catch (e) {
                console.log("connection failed,reconnect after 10s");
                setTimeout(function () {
                    _this.connect()
                }, 10000)
            }
            this.socket.onclose = function () {
                console.log('rpc已关闭');
                setTimeout(function () {
                    _this.connect()
                }, 10000)
            }
            this.socket.addEventListener('open', (event) => {
                console.log("rpc连接成功");
            });
            this.socket.addEventListener('error', (event) => {
                console.error('rpc连接出错,请检查是否打开服务端:', event.error);
            });

        };
        Hlclient.prototype.send = function (msg) {
            this.socket.send(msg)
        }
        Hlclient.prototype.regAction = function (func_name, func) {
            if (typeof func_name !== 'string') {
                throw new Error("an func_name must be string");
            }
            if (typeof func !== 'function') {
                throw new Error("must be function");
            }
            console.log("register func_name: " + func_name);
            this.handlers[func_name] = func;
            return true

        }
        //收到消息后这里处理，
        Hlclient.prototype.handlerRequest = function (requestJson) {
            var _this = this;
            try {
                var result = JSON.parse(requestJson)
                } catch (error) {
                    console.log("请求信息解析错误", requestJson);
                    return
                }
            if (!result['action'] || !result["message_id"]) {
                console.warn('没有方法或者消息id,不处理');
                return
            }
            var action = result["action"], message_id = result["message_id"]
            var theHandler = this.handlers[action];
            if (!theHandler) {
                this.sendResult(action, message_id, 'action没找到');
                return
            }
            try {
                if (!result["param"]) {
                    theHandler(function (response) {
                        _this.sendResult(action, message_id, response);
                    })
                    return
                }
                var param = result["param"]
                try {
                    param = JSON.parse(param)
                } catch (e) {
                }
                theHandler(function (response) {
                    _this.sendResult(action, message_id, response);
                }, param)

            } catch (e) {
                console.log("error: " + e);
                _this.sendResult(action, message_id, e);
            }
        }
        Hlclient.prototype.sendResult = function (action, message_id, e) {
            if (typeof e === 'object' && e !== null) {
                try {
                    e = JSON.stringify(e)
                } catch (v) {
                    console.log(v)//不是json无需操作
                }
            }
            this.send(JSON.stringify({"action": action, "message_id": message_id, "response_data": e}));
        }
        function transjson(formdata) {
            var regex = /"action":(?<actionName>.*?),/g
            var actionName = regex.exec(formdata).groups.actionName
            stringfystring = formdata.match(/{..data..:.*..\w+..:\s...*?..}/g).pop()
            stringfystring = stringfystring.replace(/\\"/g, '"')
            paramstring = JSON.parse(stringfystring)
            tens = `{"action":` + actionName + `,"param":{}}`
            tjson = JSON.parse(tens)
            tjson.param = paramstring
            return tjson
        }
    }else{
        Hlclient.prototype.connect = function () {
            console.log('begin of connect to wsURL: ' + this.wsURL);
            var _this = this;
            try {
                this.socket = new WebSocket(this.wsURL);
                this.socket.onmessage = function (e) {
                    _this.handlerRequest(e.data)
                }
            } catch (e) {
                console.log("connection failed,reconnect after 10s");
                setTimeout(function () {
                    _this.connect()
                }, 10000)
            }
            this.socket.onclose = function () {
                console.log('rpc已关闭');
                setTimeout(function () {
                    _this.connect()
                }, 10000)
            }
            this.socket.addEventListener('open', (event) => {
                console.log("rpc连接成功");
            });
            this.socket.addEventListener('error', (event) => {
                console.error('rpc连接出错,请检查是否打开服务端:', event.error);
            });

        };
        Hlclient.prototype.send = function (msg) {
            this.socket.send(msg)
        }
        Hlclient.prototype.regAction = function (func_name, func) {
            if (typeof func_name !== 'string') {
                throw new Error("an func_name must be string");
            }
            if (typeof func !== 'function') {
                throw new Error("must be function");
            }
            console.log("register func_name: " + func_name);
            this.handlers[func_name] = func;
            return true

        }
        //收到消息后这里处理，
        Hlclient.prototype.handlerRequest = function (requestJson) {
            var _this = this;
            try {
                var result = JSON.parse(requestJson)
                } catch (error) {
                    console.log("catch error", requestJson);
                    result = transjson(requestJson)
                }
            //console.log(result)
            if (!result['action']) {
                this.sendResult('', 'need request param {action}');
                return
            }
            var action = result["action"]
            var theHandler = this.handlers[action];
            if (!theHandler) {
                this.sendResult(action, 'action not found');
                return
            }
            try {
                if (!result["param"]) {
                    theHandler(function (response) {
                        _this.sendResult(action, response);
                    })
                    return
                }
                var param = result["param"]
                try {
                    param = JSON.parse(param)
                } catch (e) {}
                theHandler(function (response) {
                    _this.sendResult(action, response);
                }, param)

            } catch (e) {
                console.log("error: " + e);
                _this.sendResult(action, e);
            }
        }
        Hlclient.prototype.sendResult = function (action, e) {
            if (typeof e === 'object' && e !== null) {
                try {
                    e = JSON.stringify(e)
                } catch (v) {
                    console.log(v)//不是json无需操作
                }
            }
            this.send(action + atob("aGxeX14") + e);
        }
        function transjson(formdata) {
            var regex = /"action":(?<actionName>.*?),/g
            var actionName = regex.exec(formdata).groups.actionName
            stringfystring = formdata.match(/{..data..:.*..\w+..:\s...*?..}/g).pop()
            stringfystring = stringfystring.replace(/\\"/g, '"')
            paramstring = JSON.parse(stringfystring)
            tens = `{"action":` + actionName + `,"param":{}}`
            tjson = JSON.parse(tens)
            tjson.param = paramstring
            return tjson
        }
    }

    let port = ws === 'new' ? 12080:12090;
    let demo = new Hlclient(`ws://127.0.0.1:${port}/ws?group=${group}`);



    demo.regAction('login', function (resolve, param) {
        $.ajax({
            url: 'https://wapact.189.cn:9001/unified/user/login',
            type: "POST",
            cache: !1,
            async: !0,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                ticket: param.ticket,
                "backUrl": `https%3A%2F%2Fwapact.189.cn%3A9001%2FJinDouMall%2FJinDouMall_luckDraw.html%3Fticket%3D${param.ticket}%26utm_ch%3Dhg_app%26utm_sch%3Dhg_xbwd%26utm_as%3Djdsc`,
                "platformCode": "P201042201",
                "loginType": "2"
            }),
            headers: {
                // Authorization: "Bearer " + JinDouMallDetails.loginData.token,
                // "dzqd-version": JinDouMallDetails.sessData.version
            },
            success: function (t) {
                resolve(t)
            }
        })
    })
    demo.regAction('exchangePrize', async function (resolve, param) {
        var t = {
            activityId: param.activitieId
        };
        $.ajax({
            url: window.location.origin + "/gateway/standExchange/detailNew/exchange",
            type: "POST",
            cache: !1,
            async: !0,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: JSON.stringify(t),
            timeout: param.timeout || 200,
            headers: {
                Authorization: "Bearer " + param.token,
                "dzqd-version": JinDouMall.sessData.version
            },
            success: function (t) {
                resolve(t)
            }
        })
    })
    demo.regAction('queryCoupon', async function (resolve, param) {
        console.log(getTime(),"queryCoupon",param);
        $.ajax({
            url: `https://wapact.189.cn:9001/gateway/golden/api/queryBigDataAppGetOrInfo?floorType=0&userType=1&page=1&order=2`,
            type: "GET",
            cache: !1,
            async: !0,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 2000,
            headers: {
                Authorization: "Bearer " + JinDouMall.loginData.token + "",
                // "dzqd-version": JinDouMall.sessData.version
            },
            success: function (t) {
                let coupons = t?.biz?.ExchangeGoodslist || [];
                let couponDict = {};
                for (const coupon of coupons) {
                    if (!coupon.title.includes('代金券')) {
                        couponDict[coupon.title] = coupon.id;
                    }
                }
                //10 点
                let coupon5Id = {
                    time: '10:00:00',
                    name: '5毛',
                    id: couponDict["0.5元话费"]
                }
                let coupon50Id = {
                    time: '10:00:00',
                    name: '50毛',
                    id: couponDict["5元话费"]
                };
                let coupon60Id = {
                    time: '10:00:00',
                    name: '60毛',
                    id: couponDict["6元话费"]
                };
                //14 点
                let coupon10Id = {
                    time: '14:00:00',
                    name: '10毛',
                    id: couponDict["1元话费"]
                };
                let coupon100Id = {
                    time: '14:00:00',
                    name: '100毛',
                    id: couponDict["10元话费"]
                };
                let coupon30Id = {
                    time: '14:00:00',
                    name: '30毛',
                    id: couponDict["3元话费"]
                };
                const today = moment().format('YYYY-MM-DD');
                function runJob(couponId, exchange) {
                    if (exchange) return;
                    if (!couponId.id) return;
                    console.log(group, JSON.stringify(couponId))
                    setTimeout(() => {
                        timeToRun(moment(today + ' ' + couponId.time).format('YYYY-MM-DD HH:mm:ss'), param.beforeTime, async () => {
                            await seckill({phone:group,count:param.count, ...couponId});
                        });
                    })
                }

                let exchange = param.exchange;

                if (moment().hour() < 12) {
                    runJob(coupon50Id, exchange.c50);
                    if (exchange.c50 || ws !== 'new') {
                        runJob(coupon60Id, exchange.c60);
                        if (exchange.c60 || ws !== 'new') {
                            runJob(coupon5Id, exchange.c5);
                        }
                    }
                } else {
                    runJob(coupon100Id, exchange.c100);
                    if (exchange.c100 || ws !== 'new') {
                        runJob(coupon30Id, exchange.c30);
                        if (exchange.c30 || ws !== 'new') {
                            runJob(coupon10Id, exchange.c10);
                        }
                    }
                }
            },
        })
    })

    demo.regAction('aiJobFinish', async function (resolve, param) {
        $.ajax({
            url: `https://wapact.189.cn:9001/gateway/job/zodiacsigns/taskRecord?ticket=${param.ticket}`,
            type: "GET",
            cache: !1,
            async: !0,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 200,
            headers: {
                SESSION: param.sessionValue
            },
            success: function (t) {
                console.log(t)
                resolve(t)
            },
        })
    })

    demo.regAction('detailHallNearby', async function (resolve, param) {
        $.ajax({
            url: window.location.origin + `/wapzt/gmsBusinessHall/detailHallNearby.do?busHall=${param.busHall}`,
            type: "GET",
            cache: !1,
            async: !0,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            headers: {
                SESSION: param.sessionValue
            },
            success: function (t) {
                resolve(t)
            },
        })
    })

    demo.regAction('getCollectedTicketUserid', async function (resolve, param) {
        $.ajax({
            url: `https://www.189.cn/wapzt/getCollectedTicketUserid.do?ticket=${param.ticket}`,
            type: "GET",
            cache: !1,
            async: !0,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function () {
            },
        })
    })

    demo.regAction('hallClockNew', async function (resolve, param) {
        var t = {
            "hallCode": param.busHallCode,
            "hallName": param.busHallName,
            "provinceCode": param.province,
            "provinceName": param.provName,
            "cityCode": param.city,
            "cityName": param.cityName,
            "userlongitude": Number(param.longitude + Math.floor(100 + Math.random() * (999 - 100 + 1))),
            "userlatitude": Number(param.latitude + Math.floor(100 + Math.random() * (999 - 100 + 1))),
            "yytlongitude": param.longitude,
            "yytlatitude": param.latitude,
            "type": param.type
        };
        $.ajax({
            url: `https://www.189.cn/wapzt/hall/clock.do`,
            type: "POST",
            cache: !1,
            async: !0,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: JSON.stringify(t),
            success: function (t) {
                resolve(t)
            },
        })
    })

    demo.regAction('ssoHomLogin', async function (resolve, param) {
        $.ajax({
            url: `https://wapside.189.cn:9001/jt-sign/ssoHomLogin?ticket=${param.ticket}`,
            type: "GET",
            cache: !1,
            async: !0,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (t) {
                resolve(t)
            },
        })
    })

    demo.regAction('webSign', async function (resolve, param) {
        $.ajax({
            url: `https://wapside.189.cn:9001/jt-sign/webSign/sign`,
            type: 'POST',
            cache: !1,
            async: !0,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                sign:param.sign
            },
            data: JSON.stringify({
                encode:param.para
            }),
            success: function (t) {
                resolve(t)
            },
        })

        //  var t = {
        //     encode:param.para
        //  };
        //  fetch(`https://wapside.189.cn:9001/jt-sign/webSign/sign`, {
        //      method: "POST",
        //      headers: {
        //          "Content-Type": "application/json;charset=utf-8",
        //          sign:param.sign
        //      },
        //      body: JSON.stringify(t),
        //   }).then(response => response.text()).then((res) => {
        //      resolve(res); // 将解析结果传递给 resolve
        //   });
    })

    demo.regAction('getData', async function (resolve, param) {
        $.ajax({
            url: `https://wapside.189.cn:9001/jt-sign/${param.api}`,
            type: 'POST',
            cache: !1,
            async: !0,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                sign:param.sign
            },
            data: JSON.stringify({
                para:param.para
            }),
            success: function (t) {
                resolve(t)
            },
        })
        //  var t = {
        //      para:param.para
        //  };
        //  fetch(`https://wapside.189.cn:9001/jt-sign/${param.api}`, {
        //      method: "POST",
        //      headers: {
        //          "Content-Type": "application/json;charset=utf-8",
        //          sign:param.sign
        //      },
        //      body: JSON.stringify(t),
        //  }).then(response => response.text()).then((res) => {
        //      resolve(res); // 将解析结果传递给 resolve
        //  });
    })

    demo.regAction('wapactSend', async function (resolve, param) {
        $.ajax({
            url: `https://wapact.189.cn:9001/${param.api}?${param.param?param.param:''}`,
            type: param.method,
            cache: !1,
            async: !0,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            headers: {
                "Authorization": `Bearer ${param.token}`  // 设置 Authorization 请求头
            },
            data: JSON.stringify(param.body),
            success: function (t) {
                resolve(t)
            },
        })
    })

    demo.regAction('newSend', async function (resolve, param) {
        $.ajax({
            url: `https://wappark.189.cn/${param.api}?${param.param?param.param:''}`,
            type: param.method,
            cache: !1,
            async: !0,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            headers: {
                SESSION: param.sessionValue
            },
            data: JSON.stringify({
                para:param.para
            }),
            success: function (t) {
                resolve(t)
            },
        })
    })

    demo.regAction('delCookieAndRefresh', async function (resolve, param) {
        const cookies = document.cookie.split("; ");

        // 删除指定的 cookie
        cookies.forEach(cookie => {
            const cookieName = cookie.split("=")[0]; // 获取 cookie 名称
            // 删除 cookie（设置过期时间为过去）
            document.cookie = `${cookieName}=; path=/; domain=.example.com; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            console.log(`Cookie "${cookieName}" 已删除`);
        });

        // 刷新页面
        location.reload();
        resolve('ok')
    })

    demo.regAction('yingYeTingJob', async function (resolve, param) {
        let {tingList,store,inStore,photo} = param;
        let index = Math.floor(Math.random() * tingList.length);
        let busHall = tingList[index];
        function clock({provName,cityName,province,city,busHallCode,busHallName,longitude,latitude,type}){
            return new Promise((resolve, reject) =>{
                var t = {
                    "hallCode": busHallCode,
                    "hallName": busHallName,
                    "provinceCode": province,
                    "provinceName": provName,
                    "cityCode": city,
                    "cityName": cityName,
                    "userlongitude": Number(longitude + Math.floor(100 + Math.random() * (999 - 100 + 1))),
                    "userlatitude": Number(latitude + Math.floor(100 + Math.random() * (999 - 100 + 1))),
                    "yytlongitude": longitude,
                    "yytlatitude": latitude,
                    "type": type
                };
                if(type === 3) t.pic = '/9j/4AAQSkZJRgABAQAASABIAAD';
                $.ajax({
                    url: `https://www.189.cn/wapzt/hall/clock.do`,
                    type: "POST",
                    cache: !1,
                    async: !0,
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(t),
                    success: function (t) {
                        resolve(t);
                    },
                })
            })
        }

        $.ajax({
            url: window.location.origin + `/wapzt/gmsBusinessHall/detailHallNearby.do?busHall=${busHall}`,
            type: "GET",
            cache: !1,
            async: !0,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            //      headers: {
            //        SESSION: param.sessionValue
            //  },
            success: async function (t) {
                let {
                    provName,
                    cityName,
                    province,
                    city,
                    busHallCode,
                    busHallName,
                    longitude,
                    latitude
                } = t?.dataObject?.data;
                if(store){
                    await clock({provName,
                                 cityName,
                                 province,
                                 city,
                                 busHallCode,
                                 busHallName,
                                 longitude,
                                 latitude,
                                 type:1});
                    await sleep(3, 6);

                }
                if(inStore){
                    await clock({provName,
                                 cityName,
                                 province,
                                 city,
                                 busHallCode,
                                 busHallName,
                                 longitude,
                                 latitude,
                                 type:2});
                    await sleep(3, 6);
                }
                if(photo){
                    await clock({provName,
                                 cityName,
                                 province,
                                 city,
                                 busHallCode:getBusHallCode(),
                                 busHallName,
                                 longitude,
                                 latitude,
                                 type:3});
                    await sleep(3, 6);
                }
            },
        })
    })
})();