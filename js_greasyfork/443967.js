// ==UserScript==
// @name         JDM售后待收货填单号辅助
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  支持订单备注的采购单号，妙手订单的订单号，支持自动同步拼多多到单号，展示淘宝的售后状态
// @author       俊辉
// @license      俊辉 license
// @match        https://sh.shop.jd.com/afs/list/*
// @icon         https://www.jd.com/favicon.ico
// @grant GM_xmlhttpRequest
// @connect      47.100.163.17
// @connect      chengji-inc.com
// @connect      yangkeduo.com
// @connect      haochen8.com
// @connect      taobao.com
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @require https://greasyfork.org/scripts/448566-pdd%E5%BF%AB%E9%80%92%E5%BA%93/code/pdd%E5%BF%AB%E9%80%92%E5%BA%93.js
// @downloadURL https://update.greasyfork.org/scripts/443967/JDM%E5%94%AE%E5%90%8E%E5%BE%85%E6%94%B6%E8%B4%A7%E5%A1%AB%E5%8D%95%E5%8F%B7%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/443967/JDM%E5%94%AE%E5%90%8E%E5%BE%85%E6%94%B6%E8%B4%A7%E5%A1%AB%E5%8D%95%E5%8F%B7%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

//----全局变量----//
var hcmobile = "13316689961",
    hcpass = "Ljh21025",
    //浩辰工具的账号密码
    isgethctoken=true;//是否登录浩辰工具，false则不登录，不会同步快递单号到拼多多
var 拼多多账号请求参数, 备注等级 = 5,待收货订单总数, 服务单号, 全部商家ID = [], 取得采购订单号, 采购订单号, 快递单号, 快递公司, 订单号, 服务单等级, 商品SKUID, 京东售后单退货方式, 名字, 拼多多快递信息结果, 查找账号的id, pddToken, pddNumber, PDDheaders, PDD快递ID, PDD快递公司, data, 拼多多售后单状态, 拼多多售后单号, 拼多多确认收货版本 = 2, getpddorder = false

setInterval(function () {
    if(!navigator.appVersion.match(/JM_PC\//g)){
        if (!document.getElementById("btnthtk")) {
            //按键不存在，创建按键
            创建同步退货快递单号到拼多多();
        };
        if (!document.getElementById("xfc")) {
            //悬浮窗不存在，创建按键
            悬浮窗();
        }
    }
}, 500);

async function 获取待收货订单() {
    向悬浮窗添加内容("开始");
    if(isgethctoken==true){
        await gethctoken();//获取浩辰工具账号token
    };
    向悬浮窗添加内容("++++++++++++++++++++++++");
    let time = new Date();
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let date = time.getDate();
    if (month < 10) { month = '0' + month };
    if (date < 10) { date = '0' + date };
    let 开始时间 = time.getFullYear() - 1 + '-' + month + '-' + date;
    let 截至时间 = year + '-' + month + '-' + date;
    var data = {
        "wareId": null,
        "afsApplyTimeBegin": 开始时间 + " 00:00:00",
        "afsApplyTimeEnd": 截至时间 + " 23:59:59",
        "afsApplyTime": [开始时间, 截至时间],
        "customerExpect": null,
        "customerName": null,
        "customerPin": null,
        "expressCode": null,
        "storeId": [],
        "orderByType": null,
        "afsServiceApprovedResult": null,
        "smartRefund": null,
        "customerTel": null,
        "pageIndex": 1,
        "pageSize": 99
    };
    let res = new XMLHttpRequest();
    let url = "https://sh.shop.jd.com/self/api/receive/list";
    res.open('POST', url, true);
    res.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    res.send(JSON.stringify(data))
    res.onreadystatechange = async function () {
        if (res.readyState == 4 && res.status == 200) {
            data = JSON.parse(res.responseText);
            待收货订单总数 = data.data.totalRecord;
            var 备注售后单等级结果 = data.success
            if (备注售后单等级结果 == true) {
                向悬浮窗添加内容("待收货订单总数  " + 待收货订单总数);
                for (var i = 0; i < 待收货订单总数; i++) {
                    服务单号 = data.data.list[i].afsServiceId;
                    订单号 = data.data.list[i].orderId;
                    服务单等级 = data.data.list[i].remarkFlag;
                    商品SKUID = data.data.list[i].wareId;//用于妙手订单匹配对应的采购订单
                    京东售后单退货方式 = data.data.list[i].pickWareTypeDesc;//用于判断客户发货的售后单是否发货"客户发货"
                    /*初始化变量*/
                    取得采购订单号=null;
                    /*初始化变量*/
                    ////判断服务单号是否为5级////
                    //                   if (服务单等级 == 备注等级) {continue;};
                    ////5级就跳过///
                    await 获取快递单号(服务单号);
                    if (快递单号 == null) {
                        continue;
                    };
                    if (快递公司 == null) {
                        //有快递单号却没有快递公司
                        await 获取快递单号2(服务单号);
                    }
                    if (快递单号 == null) {
                        向悬浮窗添加内容("----------------------------------");//分割连续订单
                        向悬浮窗添加内容(订单号);
                        向悬浮窗添加内容("手动核实此订单");
                        continue;
                    };

                    向悬浮窗添加内容("----------------------------------");//分割连续订单
                    向悬浮窗添加内容(订单号);

                    获取采购订单号(服务单号);
                    if (取得采购订单号 == null) {//订单备注没有采购单号执行
                        全部商家ID = []//初始化商家ID
                        await 获取妙手订单商家ID();
                        await 获取妙手订单采购信息(订单号);//通过妙手订单获取采购单号
                        if (取得采购订单号 == null) {
                            continue;//淘宝上家就跳过
                        }
                    };

                    if(isgethctoken==true){
                        await 切换拼多多账号(采购订单号);


                        await getpddexpressmessage(快递单号);

                        if (拼多多快递信息结果 == null) {
                            向悬浮窗添加内容("快递单号：" + 快递单号);
                            向悬浮窗添加内容("匹配拼多多快递公司失败");
                            continue;
                        };
                        await 获取拼多多售后单号(采购订单号);
                        switch (拼多多售后单状态) {
                            case "1":
                                向悬浮窗添加内容("售后状态：申请收到，商家处理中");
                                break;
                            case "5":
                                向悬浮窗添加内容("售后状态：退款成功");
                                break;
                            case "10":
                                await 拼多多提交退货单号(拼多多售后单号);
                                break;
                            case "11":
                                向悬浮窗添加内容("售后状态：已填过快递单号");
                                京东售后单备注等级(服务单号);
                                break;
                            case "12":
                                向悬浮窗添加内容("售后状态：退款失败");
                                break;
                            case "18":
                                向悬浮窗添加内容("售后状态：换货商品已发出");
                                break;
                            default:
                                向悬浮窗添加内容("售后状态：未在上家申请售后");
                        }
                    };
                };
                向悬浮窗添加内容("++++++++++++++++++++++++");
                向悬浮窗添加内容("结束");
                创建清除悬浮窗内容按钮();
            };
        }
    }
};

function 创建清除悬浮窗内容按钮() {
    $("#xfc_clear").remove();
    //在同步单号已启动后面添加小字按钮
    setTimeout(function () {
        $("#xfc").append("<br><button id='xfc_clear' style='color: #000000;padding: 5px;outline: none;border: none;border-radius: 10px;background: #f0f0f0;box-shadow: 2px 2px 5px #cccccc, -5px -5px 5px #ffffff;'>清空</button>");
        $("#xfc_clear").click(function () {
            //将xfc的内容设置为同步单号已启动
            $("#xfc").html("同步单号已启动");
        });
    }, 0);
}

function 获取快递单号(服务单号) {
    return new Promise((resolve) => {
        setTimeout(() => {
            var url = "https://sh.shop.jd.com/self/api/receive/detail?afsServiceId=" + 服务单号;
            $.ajax({
                type: "GET",
                url: url,
                async: true,
                dataType: "json",
                success: function (data) {
                    ////判断客户有没有发货////
                    if (data.data.afsServiceExpressInfoDto == null) {
                        快递公司 = data.data.shipwayName;
                        快递单号 = data.data.expressNumber;
                        resolve("客户发货了");
                    } else {
                        快递公司 = data.data.afsServiceExpressInfoDto.expressCompany;
                        快递单号 = data.data.afsServiceExpressInfoDto.expressCode;
                        resolve("有快递单号却没有快递公司");
                    }
                }
            });
            ////获取到京东售后快递单号////
        }, 0)
    });
}

function 获取快递单号2(服务单号) {
    return new Promise((resolve) => {
        setTimeout(() => {
            var url = "https://sh.shop.jd.com/self/api/common/logistic?afsServiceId=" + 服务单号;
            $.ajax({
                type: "GET",
                url: url,
                async: false,
                dataType: "json",
                success: function (data) {
                    快递公司 = data.data.shipwayName;
                    快递单号 = data.data.expressNumber;
                    ////判断客户有没有发货////
                    if (快递单号 == null) {
                        //console.log("客户没有发货");
                        resolve("客户没有发货");
                    }
                    //console.log("客户发货了");
                    resolve("客户发货了");
                },
            });
            ////获取到京东售后快递单号////
        }, 0)
    });
}

function 获取妙手订单采购信息(订单号) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            //时间模块
            let time = new Date();
            let year = time.getFullYear();
            let month = time.getMonth();
            let endmonth = time.getMonth() + 1;
            let date = time.getDate();
            if (month < 10) { month = '0' + month };
            if (date < 10) { date = '0' + date };
            let 开始时间 = time.getFullYear() - 1 + '-' + month + '-' + date;
            let 截至时间 = year + '-' + endmonth + '-' + date;
            //时间模块结束
            //构造请求参数
            let authVenderIds = [];
            //全部商家id的长度
            var 商家数量 = 全部商家ID.length;
            for (var i = 0; i < 商家数量; i++) {
                //向数组添加元素
                authVenderIds = authVenderIds + "&authVenderIds%5B%5D=" + 全部商家ID[i];
            }
            //构造请求参数结束
            var 妙手订单请求参数 = "_zc_csrf=MWB3SHZwQkdkdRN5ABI6BQ5NGCwABQBxLSQZCk4CKiwGMRoLRAM0cVYk&useOrderStateFilter=0&purchaseOrderTab=wait_purchase&pageSize=20&sortType=orderStartTimeAsc&isFromExport=0&isPurchase=&onlyShowOutstorageFail=&isOrderAddressDifferent=&isPurchaseOrderingAndWaitPay=&onlyShowMoreThanTwoHoursOrder=&hasUploadOrderMobile=&expressStatus=&oldFilterAuthVenderIds=" + 全部商家ID + authVenderIds + "&searchTimeType=orderStartTime&orderStartTime=" + 开始时间 + "&orderEndTime=" + 截至时间 + "&orderId=" + 订单号 + "&searchType=byItemNum&itemNumSearchType=accurate&page=1";
            var 妙手订单采购信息请求头 = { "Content-type": "application/x-www-form-urlencoded; charset='UTF-8'" };
            GM_xmlhttpRequest({
                url: "http://order.chengji-inc.com/order/stock_up/search_order_list",
                method: "post",
                data: 妙手订单请求参数,
                headers: 妙手订单采购信息请求头,
                onload: async function (data) {
                    if (data.readyState == 4 && data.status == 200) {
                        if (data.finalUrl == "http://order.chengji-inc.com/user/user/exit_app") {
                            alert("妙手订单采购信息获取失败，前往登录妙手订单");
                            window.open("http://order.chengji-inc.com/user/user/exit_app");
                            setTimeout(() => { location.reload(); }, 3000);
                            reject('done');
                        }
                        data = JSON.parse(data.responseText);
                        if(data.result=="fail"){
                            var 过期店铺id = data.reason.match(/[0-9]+/g)[0];
                            var index = 全部商家ID.indexOf(过期店铺id);//过期店铺id的索引值
                            if (index > -1) {
                                全部商家ID.splice(index, 1); // 第二个参数为删除的次数，设置只删除一次
                            }
                            获取妙手订单采购信息(订单号);
                            resolve('done');
                        };
                        if(data.orderList.length==0){
                            向悬浮窗添加内容("没有找到相应的订单信息~~~");
                            向悬浮窗添加内容("可以切换到妙手订单的多店铺群主再试");
                            resolve('done');
                        };
                        var 妙手订单号 = data.orderList[0].skuIdAndPurchaseOrderIdMap[商品SKUID];
                        if (妙手订单号 == undefined) {
                            向悬浮窗添加内容("此商品没有采购信息，请手动核实");
                            resolve('done');
                        }
                        //'<div class="jumbotron mt_10">\n\t<p class="lead text-center">没有找到相应的订单信息~~~</p>\n</div>\n'
                        if (data.orderList[0].purchaseOrders.length == 0) {
                            向悬浮窗添加内容("没有找到相应的订单信息")
                            if (采购订单号 == undefined) {
                                向悬浮窗添加内容("这是淘宝上家");
                                resolve('done');
                            }
                            resolve('done');
                        }
                        var 采购平台 = data.orderList[0].purchaseOrders[妙手订单号].purchasePlatformName;
                        if (采购平台 == "拼多多") {
                            if(isgethctoken==true){
                                let 采购账号 = data.orderList[0].purchaseOrders[妙手订单号].purchaseOrderBuyer;
                                取得采购订单号 = data.orderList[0].purchaseOrders[妙手订单号].purchaseOrderSn;
                                采购订单号 = data.orderList[0].purchaseOrders[妙手订单号].purchaseOrderSn;
                                向悬浮窗添加内容(采购订单号);
                                resolve('done');
                                return true;
                            }else{
                                let 采购账号 = data.orderList[0].purchaseOrders[妙手订单号].purchaseOrderBuyer;
                                取得采购订单号 = data.orderList[0].purchaseOrders[妙手订单号].purchaseOrderSn;
                                采购订单号 = data.orderList[0].purchaseOrders[妙手订单号].purchaseOrderSn;
                                向悬浮窗添加内容("退货单号：" + 快递单号);
                                向悬浮窗添加内容(采购账号 + "：" + 采购订单号,"https://mobile.yangkeduo.com/order.html?order_sn="+采购订单号,"a");
                                resolve('done');
                                return true
                            }}
                        if (采购平台) {
                            let 采购账号 = data.orderList[0].purchaseOrders[妙手订单号].purchaseOrderBuyer;
                            采购订单号 = data.orderList[0].purchaseOrders[妙手订单号].purchaseOrderSn;
                            向悬浮窗添加内容(采购账号 + "：" + 采购订单号);
                            向悬浮窗添加内容("退货单号：" + 快递单号);
                            //2022/10/15添加查询淘宝订单状态功能
                            await 获取淘宝订单状态(采购订单号);
                            resolve('done');
                        }
                    }
                }
            });
        }, 0)
    });
}

function 获取妙手订单商家ID() {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            GM_xmlhttpRequest({
                url: "http://order.chengji-inc.com/user/vender_auth/getVenderAuthGroupMap",
                method: "GET",
                headers: { "Content-type": "application/json; charset='UTF-8'" },
                onload: function (data) {
                    if (data.readyState == 4 && data.status == 200) {
                        /*判断是否登录妙手订单*/
                        if (data.finalUrl == "http://order.chengji-inc.com/user/user/exit_app") {
                            alert("妙手订单采购信息获取失败，前往登录妙手订单");
                            window.open("http://order.chengji-inc.com/user/user/exit_app");
                            reject('done');
                        };
                        var 妙手id = data.responseText.match(/[0-9]+/g)[0];
                        data = JSON.parse(data.responseText);
                        var 群主的商家ID = data.authGroupMap[妙手id].group_owner_vender_id;
                        全部商家ID.push(群主的商家ID);
                        var 店铺数量 = 1;
                        店铺数量 = 店铺数量 + data.authGroupMap[妙手id].members.length;
                        //向全部商家ID添加当前的商家ID
                        if (店铺数量 > 0) {
                            //遍历店铺数量获取商家ID
                            for (var i = 0; i <= 店铺数量 - 2; i++) {
                                var 商家ID = data.authGroupMap[妙手id].members[i].vender_id;
                                if(群主的商家ID==商家ID){
                                    //当前非群主，提示切换
                                    let r=confirm("当前使用的账号不是妙手订单群主账号，是否去切换到群主\n建议去切换，不切换会漏单");
                                    if (r==true){
                                        //去切换
                                        window.open("http://order.chengji-inc.com/user/vender_auth/index");
                                    }
                                }
                                全部商家ID.push(商家ID);
                            };
                        };
                        resolve('done');
                    }
                }
            });
        })
    }, 0)
}

function 获取采购订单号(服务单号) {
    ////获取订单备注的采购订单号////
    return new Promise((resolve) => {
        setTimeout(() => {
            var url = "https://sh.shop.jd.com/self/api/receive/detail?afsServiceId=" + 服务单号;
            $.ajax({
                type: "GET",
                url: url,
                async: false,
                dataType: "json",
                success: function (data) {
                    let 京东备注信息 = data.data.venderRemark.remark;
                    let 正则匹配采购订单号 = new RegExp("[0-9]{6}-[0-9]{15}", "g");
                    取得采购订单号 = 正则匹配采购订单号.exec(京东备注信息);
                    if (data.data.venderRemark == null) {
                        resolve("订单备注没有采购单号");
                        return false;//订单备注没有采购单号就跳过
                    };
                    ////判断是否拼多多订单////
                    if (取得采购订单号 == null) {
                        resolve("订单备注没有采购信息");
                        return false;//没有采购订单号就跳过
                    }
                    ////判断是否拼多多订单////
                    采购订单号 = 取得采购订单号[0];
                    向悬浮窗添加内容(采购订单号);
                    resolve("1");
                },
            });
        }, 0)
    });
}

function gethctoken() {
    ////获取浩辰工具token////
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            var url = "http://47.100.163.17/hcOrder/jm_app/login";
            var data = { "username": hcmobile, "password": hcpass, "agentId": 1 }
            GM_xmlhttpRequest({
                url: url,
                method: "post",
                data: JSON.stringify(data),
                headers: {
                    "Content-type": "application/json; charset='UTF-8'"
                },
                onload: function (data) {
                    if (data.readyState == 4 && data.status == 200) {
                        data = JSON.parse(data.responseText);
                        switch (data.code) {
                            case 1:
                                拼多多账号请求参数 = { "token": data.data.token, "uid": data.data.uid };
                                向悬浮窗添加内容("登录浩辰工具成功");
                                resolve("登录浩辰工具成功");
                                break;
                            case 2:
                                alert(data.message);
                                向悬浮窗添加内容("登录浩辰工具失败");
                                向悬浮窗添加内容(data.message);
                                resolve(data.message);
                                return false;
                            default:
                                alert(data.message);
                                向悬浮窗添加内容("登录浩辰工具失败");
                                向悬浮窗添加内容(data.message);
                                resolve(data.message);
                                return false;
                        }
                    }

                }
            })
        }, 0)
    });
}


function 切换拼多多账号(采购订单号) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            GM_xmlhttpRequest({
                url: "http://www.haochen8.com/hcOrder/user/find_buy_pdd_list",
                method: "post",
                data: JSON.stringify(拼多多账号请求参数),
                headers: {
                    "Content-type": "application/json; charset='UTF-8'"
                },
                onload: async function (data) {
                    if (data.readyState == 4 && data.status == 200) {
                        data = JSON.parse(data.responseText);
                        if (data.code == 1) {
                            for (var i = 0; i < data.data.length; i++) {
                                pddToken = data.data[i].pddToken;
                                pddNumber = data.data[i].pddNumber;
                                名字 = data.data[i].remark;
                                /////////设置拼多多账号/////////
                                PDDheaders = {
                                    "Content-type": "application/json; charset='UTF-8'",
                                    "accesstoken": pddToken,
                                    "cookie": "PDDAccessToken=" + pddToken + ";pdd_user_id=" + pddNumber
                                };
                                /*在这里测试检测是否改订单的拼多多*/
                                await 获取拼多多售后单号(采购订单号);
                                if (getpddorder == false) {
                                    continue;
                                }
                                向悬浮窗添加内容("采购账号：" + 名字);
                                拼多多确认收货版本 = 2;
                                resolve('done');
                                /////////设置拼多多账号/////////
                            }
                        } else {
                            向悬浮窗添加内容("拼多多账号查询失败");
                            reject('拼多多账号查询失败');
                        }
                    } else {
                        向悬浮窗添加内容("拼多多账号查询失败");
                        reject('拼多多账号查询失败');
                    }

                }
            })
        }, 0)
    });
}

function getpddexpressmessage(couriernumber) {
    return new Promise((resolve) => {
        setTimeout(() => {
            var data = { "trackingNumber": couriernumber };
            GM_xmlhttpRequest({
                url: "https://mobile.yangkeduo.com/proxy/api/api/blade/match_ship_list?pdduid=" + pddNumber,
                method: "post",
                data: JSON.stringify(data),
                headers: PDDheaders,
                onload: function (data) {
                    if (data.readyState == 4 && data.status == 200) {
                        data = JSON.parse(data.responseText);
                        var results = data.result.shipInfoList;
                        if (results == null) {
                            接口请求失败查找本地拼多多快递信息(快递公司)
                            resolve('done');
                        }
                        if (data.result.shipInfoList == null) {
                            resolve('done');
                        } else {
                            PDD快递ID = data.result.shipInfoList[0].shippingId;
                            PDD快递公司 = data.result.shipInfoList[0].shippingName;
                            resolve('done');
                        }
                    } else if (data.readyState == 424) {
                        alert("拼多多账号掉线");
                        resolve('done');
                    }
                }
            });
            ////获取拼多多快递ID和公司////
        })
    }, 0)
}

function 接口请求失败查找本地拼多多快递信息(查找内容) {
    for (let i = 0; i < 拼多多快递公司.length; i++) {
        let 对比 = 拼多多快递公司[i].shippingName;
        if (对比 == 查找内容) {
            拼多多快递信息结果 = 拼多多快递公司[i];
            PDD快递ID = 拼多多快递公司[i].shippingId;
            PDD快递公司 = 拼多多快递公司[i].shippingName;
            return true;
        } else {
            continue;
        }
    }
}

function 获取拼多多售后单号(采购订单号) {
    return new Promise(resolve => {
        setTimeout(() => {
            ////获取拼多多售后单号////
            GM_xmlhttpRequest({
                url: "https://mobile.yangkeduo.com/proxy/api/order/" + 采购订单号 + "?pdduid=" + pddNumber,
                method: "get",
                headers: PDDheaders,
                onload: function (data) {
                    if (data.readyState == 4 && data.status == 200) {
                        getpddorder = true;
                        data = JSON.parse(data.responseText);
                        if (!data.after_sales) {
                            //after_sales == undefined则未申请售后
                            resolve('done');
                        } else {
                            拼多多售后单号 = data.after_sales.after_sales_id;
                            拼多多售后单状态 = data.after_sales.after_sales_status;
                            resolve('done');
                        }
                    } else if (data.status == 400) {
                        getpddorder = false;
                        resolve('done');
                    }else if(data.status == 424){//拼多多账号掉线
                        向悬浮窗添加内容("----------------------------------");//分割连续订单
                        向悬浮窗添加内容(名字+"此拼多多号掉线");
                        向悬浮窗添加内容("----------------------------------");//分割连续订单
                        getpddorder = false;
                        resolve('done');
                    }
                }
            });
        })
    }, 0)
    ////获取拼多多售后单号////
}

function 拼多多提交退货单号(拼多多售后单号) {
    return new Promise(resolve => {
        setTimeout(() => {
            ////拼多多提交退货单号////
            var data = {
                "after_sales_id": 拼多多售后单号,
                "question_desc": "已发" + PDD快递公司 + "(" + 快递单号 + ")",
                "version": 拼多多确认收货版本,
                "images": [],
                "shipping_id": PDD快递ID,
                "shipping_name": PDD快递公司,
                "tracking_number": 快递单号,
                "express_fee": 0
            }
            GM_xmlhttpRequest({
                url: "https://mobile.yangkeduo.com/proxy/api/after_sales/confirm_delivery/" + 拼多多售后单号 + "?pdduid=" + pddNumber,
                method: "post",
                data: JSON.stringify(data),
                headers: PDDheaders,
                onload: async function (data) {
                    if (data.readyState == 4 && data.status == 200) {
                        data = JSON.parse(data.responseText);
                        if (data.error_code == "71007") {
                            拼多多确认收货版本 = 拼多多确认收货版本 + 1;
                            await 重试(拼多多确认收货版本);
                            async function 重试(拼多多确认收货版本) {
                                if (拼多多确认收货版本 <= 10) {
                                    await 拼多多提交退货单号(拼多多售后单号);
                                } else {
                                    向悬浮窗添加内容(data.error_msg + "请手动核实");
                                }
                            };
                            resolve('done');
                        } else if (data.result == "ok") {
                            拼多多确认收货版本 = 2;
                            向悬浮窗添加内容("拼多多提交退货单号成功");
                            京东售后单备注等级(服务单号);
                            resolve('done');
                        };
                    };
                    ////////拼多多提交退货单号////
                },
            });
        });
    }, 0);

};

function 京东售后单备注等级(服务单号) {
    let url = "https://sh.shop.jd.com/self/api/common/saveServiceTrack";
    var data = {
        "trackContext": "",
        "flagMark": 备注等级,
        "ifAudited": true,
        "afsServiceId": 服务单号
    };
    let res = new XMLHttpRequest();
    res.open('POST', url, false);
    res.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    res.send(JSON.stringify(data));
    if (res.readyState == 4 && res.status == 200) {
        data = JSON.parse(res.responseText);
        let 备注售后单等级结果 = data.success;
        if (备注售后单等级结果 == true) {
            向悬浮窗添加内容("备注等级" + 备注等级 + "成功");
        } else if (备注售后单等级结果 == false) {
        }
    }
};

function 向悬浮窗添加内容(添加内容,url,type) {
    if(type==undefined){
        type="p";
    }
    var para = document.createElement(type);
    var node = document.createTextNode(添加内容);
    para.appendChild(node);
    if(url!=undefined){
        para.href = url;
        para.target="_blank";
    }
    var element = document.getElementById("xfc");
    element.appendChild(para);
};

function 创建同步退货快递单号到拼多多() {
    if(document.getElementsByClassName("el-row")[0].nextElementSibling.firstElementChild.innerText != "查询"){return false;};
    let button = document.createElement("button");
    button.type="button";
    button.id = "btnthtk";
    button.className = "el-button el-tooltip item el-button--default is-functional";
    button.innerHTML = "<span>同步单号</span>";
    button.onclick = function () { 获取待收货订单() };
    let x = document.getElementsByClassName("el-row")[0].nextElementSibling;
    x.appendChild(button);
};

function 悬浮窗() {
    setTimeout(function () {
        $("body").append("<div id='xfc'onmouseover=javascript:this.style.background='#f7f9fa' onmouseout=javascript:this.style.background='#ffffff' class='is-plain' style='left: 10px;bottom: 10px;color: #000000;overflow: hidden;z-index: 9999;position: fixed;padding:10px;text-align:center;width: auto;height:auto;border-radius: 16px;background: #ffffff;box-shadow:  5px 5px 18px #b5b5b5,-5px -5px 18px #ffffff;overflow-y:auto; max-height: 400px;'>同步单号已就绪</div>");
    }, 0);
}

function 获取淘宝订单状态(order){
    return new Promise(resolve => {
        setTimeout(() => {
            GM_xmlhttpRequest({
                url: "https://buyertrade.taobao.com/trade/itemlist/asyncBought.htm?action=itemlist/BoughtQueryAction&event_submit_do_query=1&_input_charset=utf8",
                method: "post",
                //data: JSON.stringify(data),
                data: "canGetHistoryCount=false&historyCount=0&needQueryHistory=false&onlineCount=0&pageNum=1&pageSize=50&queryForV2=false&auctionTitle="+order+"&itemTitle="+order+"&prePageNo=1",
                headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                          "referer": "https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm?spm=a1z09.2.1997525045.2.67002e8dDaKSsV"
                         },
                onload: function (data) {
                    if (data.readyState == 4 && data.status == 200) {
                        if(data.finalUrl.match(/login.taobao.com/g)!=null){
                            向悬浮窗添加内容("建议登录淘宝账号哦！");
                            向悬浮窗添加内容("悄悄告诉你可以显示淘宝的订单状态~~~~~");
                            resolve('done');
                        }
                        data = JSON.parse(data.responseText);
                        if(data.mainOrders.length!=0){
                            var orderstate = data.mainOrders[0].subOrders[0].operations[0].text;
                            var url = data.mainOrders[0].subOrders[0].operations[0].url;
                            向悬浮窗添加内容(orderstate,url,"a");
                            resolve('done');
                        }else{
                            resolve('done');
                        };
                    };
                },
            });
        });
    }, 0);
};