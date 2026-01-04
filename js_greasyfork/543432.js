// ==UserScript==
// @name       datatools2
// @namespace  npm/vite-plugin-monkey
// @version    1.7
// @author     monkey
// @description run datatools
// @license    MIT
// @icon       https://cdn3.iconfinder.com/data/icons/picons-social/57/46-facebook-512.png
// @match      *.url66.me/*
// @match      *kf.007.tools/*
// @match      *007.mn/*
// @match      *www.yf.lu/*
// @match      *jsq.007.tools/*
// @match      *haixiang.app/*
// @match      *qihang10.8888ws.net/*
// @match      *web.sihai.plus/*
// @match      *qh.yinchao.ws/*
// @match      *sys.helloworlds.cn/*
// @match      */share/share/*
// @match      https://app.imx.chat/*
// @match      https://imx.chat/*
// @grant      GM.addElement
// @grant      GM.addStyle
// @grant      GM.deleteValue
// @grant      GM.getResourceUrl
// @grant      GM.getValue
// @grant      GM.info
// @grant      GM.listValues
// @grant      GM.notification
// @grant      GM.openInTab
// @grant      GM.registerMenuCommand
// @grant      GM.setClipboard
// @grant      GM.setValue
// @grant      GM.xmlHttpRequest
// @grant      GM_addElement
// @grant      GM_addStyle
// @grant      GM_addValueChangeListener
// @grant      GM_cookie
// @grant      GM_deleteValue
// @grant      GM_download
// @grant      GM_getResourceText
// @grant      GM_getResourceURL
// @grant      GM_getTab
// @grant      GM_getTabs
// @grant      GM_getValue
// @grant      GM_info
// @grant      GM_listValues
// @grant      GM_log
// @grant      GM_notification
// @grant      GM_openInTab
// @grant      GM_registerMenuCommand
// @grant      GM_removeValueChangeListener
// @grant      GM_saveTab
// @grant      GM_setClipboard
// @grant      GM_setValue
// @grant      GM_unregisterMenuCommand
// @grant      GM_webRequest
// @grant      GM_xmlhttpRequest
// @run-at     document-start
// @grant      unsafeWindow
// @grant      window.close
// @grant      window.focus
// @grant      window.onurlchange


// @downloadURL https://update.greasyfork.org/scripts/543432/datatools2.user.js
// @updateURL https://update.greasyfork.org/scripts/543432/datatools2.meta.js
// ==/UserScript==

console.log("油猴脚本----")



const NumStateType = {
    NumType_OffLine: 0,   // 离线
    NumType_OnLine: 1,    // 在线
    NumType_Lock: 2,      // 封号
    NumType_Freeze: 3,    // 冻结
    NumType_Lost: 4       // 丢失
};

const monkey_url = "http://8.219.232.159:8080/app/sendData";
const monkey_url2 = "http://8.219.232.159:8080/app/sendData";

let data_url = "";
let post_data = {};
let uuid = {};
let agentToken = ""
let haixiangCode = ""
let workId = ""
let orderNum = ""
let shareToken = ""

window.onload = function () {
    console.log("页面加载完------- DOMContentLoaded")
    //可以手动点一下查询 不然记录不到地址

    setTimeout(function () {
        clickQuery();
    }, 500); // 延迟0.5秒后执行，可能开始还没有按钮


    setTimeout(function () {
        createBtn();
    }, 1000); // 延迟1秒后执行，可能开始还没有按钮
}

listenForRequests();

// 监听XMLHttpRequest网络请求
function listenForRequests() {
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        console.log("访问的URL == " + url)
        // 找出请求数据的接口
        if (url.includes("counter-api/detail/user-detail/get_share_list")) {
            console.log("007出海 KF007 接口URL:", url);
            // data_url = "https://kf.007.tools/counter-api/detail/user-detail/get_share_list?order_id=45717704aa3987e397f4b0dd0834ba4d481ae2e23a9b282c05ea9716767d1283&uuid=cff26c7e4ccc47f695c6f58eea016d7f&code=nOMZqNKz&share_pwd=a123&page=1&perpage=500";
            data_url = "https//" + window.location.hostname + url.replace(/(perpage=)\d+/, "perpage=500");
            console.log("data_url = " + data_url)
            // startSend()
        }

        if (url.includes("counter-api/detail/user-detail/get_share_code_list")) {
            console.log("007出海 KF007 get_share_code_list 接口URL--:", url);
            // data_url = "https://kf.007.tools/counter-api/detail/user-detail/get_share_code_list?software_code=6l/IU8VmN1U6iWBtSU0cZQ==&uuid=ab67b292bc084823b370a568fe0b29cb&share_pwd=a111&platform=1&platform=0&platform=6&platform=3&platform=2&platform=4&platform=5&platform=7&platform=9&platform=10&&page=1&per_page=50";
            data_url = "https//" + window.location.hostname + url.replace(/(perpage=)\d+/, "perpage=500");
            console.log("data_url get_share_code_list = " + data_url)
        }
        if (url.includes("java-api/shunt/fans_details_list") || url.includes("java-api/staff/get_share_list") || url.includes("java-api/staff/staff-share")) {
            console.log("MN云控接口 007.mn 接口URL:", url);
            // data_url = "https://007.mn/java-api/shunt/fans_details_list?page=1&per_page=10&link_uuid=8a0dacc14d15416fb426cfa3157a643b&sid=74d571ee9c9a4fe0ae550379dfd6e6fc&password=8888";
            data_url = "https//" + window.location.hostname + url.replace(/(per_page=)\d+/, "per_page=500");
            console.log("data_url = " + data_url)
        }

        //https://007.mn/new-ws-api/counter/work-share/open/detail
        // '/new-ws-api/counter/work-share/open/checkExpired'
        // '/new-ws-api/counter/work-share/open/detail'
        //post接口的
        if (url.includes("/new-ws-api/counter/work-share/open/detail")) {
            console.log('post接口请求数据的工单');
            data_url = "https://" + window.location.hostname + "/new-ws-api/counter/work-share/open/detail";
        }

        if (window.location.hostname.includes("haixiang.app")) {
            console.log("haixiang接口 URL:", url);
            data_url = "https//" + window.location.hostname + url;
            console.log('海象 data_url ---  ' + data_url)
        }

        if (url.includes("apiqihang10.8888ws") || url.includes("sihai.plus") || url.includes("qhapi.yinchao.ws")) {
            console.log("四海接口--- url：" + url);
            //https://apiqihang10.8888ws.net/agent/wa.json
            //"https://s1.sihai.plus/agent/wa.json"
            console.log("域名-- " + window.location.hostname)
            data_url = url
        }

        if (url.includes("/apis/orderDetails/shareOrder")) {
            console.log("helloworlds--- url：" + url);
            //https://sys.helloworlds.cn/apis/orderDetails/shareOrder
            console.log("域名-- " + window.location.hostname)
            data_url = "https://sys.helloworlds.cn/apis/orderDetails/shareOrder";
        }

        if (url.includes("/biz/link/share")) {
            console.log("url66.e--- url：" + url);
            //新版地址https://v3.url66.me/prod-api1/biz/link/share?shareId=10697&sharePassword=518518&pageNum=1&pageSize=10&isDelete=0
            data_url = "https://" + window.location.hostname + url.replace(/(pageSize=)\d+/, "pageSize=500");
            // http://url66.me/prod-api1/biz/link/share?shareId=636&sharePassword=123123
            // data_url = "http://" + window.location.hostname + url;

            var shareIdMatch = url.match(/shareId=([^&]+)/);
            var sharePasswordMatch = url.match(/sharePassword=([^&]+)/);
            // 获取提取的值
            var shareId = shareIdMatch ? shareIdMatch[1] : '';
            var sharePassword = sharePasswordMatch ? sharePasswordMatch[1] : '';
            // 拼接 orderNum
            orderNum = shareId + '-' + sharePassword;
            console.log('orderNum --- ' + orderNum);
        }

        if (url.includes("/share/share/")) {
            console.log('share 工单-----' + url);
            //http://47.242.190.206/share/share/api_yinliu_count.html?page=1&limit=10&id=&class_id=&is_repet=1&start_time=&end_time=

            // 检查当前页面是否有端口号
            var port = window.location.port ? ":" + window.location.port : "";

            // 构建包含端口的 data_url
            data_url = "http://" + window.location.hostname + port + "/share/share/api_yinliu_count.html?page=1&limit=500&id=&class_id=&is_repet=1&start_time=&end_time=";
        }

        console.log("data_url -- " + data_url)
        open.apply(this, arguments);
    };

    var send = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.send = function (data) {
        if (window.location.hostname.includes("haixiang")) {
            console.log('post 数据--- ' + data);
            let aa = JSON.parse(data)
            aa.page_size = 500;
            haixiangCode = aa.code
            post_data = JSON.stringify(aa);
        }

        if (window.location.href.includes("007.mn/work-order-sharing") || window.location.href.includes("imx.chat/work-order-sharing")|| window.location.href.includes("yf.lu/work-order-sharing")) {
            //{"page":1,"per_page":10,"workId":"1701124542770438145"}
            //将per_page的值改为500
            //let aa = JSON.parse(data)
            //aa.per_page = 500;
            //workId = aa.workId;
            //post_data = JSON.stringify(aa);
            post_data = data
            console.log('007.mn imx.chat post 数据--- ' + JSON.stringify(post_data));
        }

        console.log(' send window.location.href -- ' + window.location.href)
        if (window.location.href.includes("qihang") || window.location.href.includes("sihai") || window.location.href.includes("yinchao")) {
            //{page: 1, page_size: 50}
            //将per_page的值改为500
            let aa = JSON.parse(data)
            aa.page_size = 500;
            post_data = JSON.stringify(aa);
            console.log('四海 post 数据--- ' + post_data);
        }

        if (window.location.href.includes("sys.helloworlds.cn")) {

            var params = data.split('&');

            for (var i = 0; i < params.length; i++) {
                var pair = params[i].split('=');
                if (pair[0] === 'rows') {
                    pair[1] = '500';
                    params[i] = pair.join('=');
                }

                if (pair[0] === 'orderNum') {
                    orderNum = pair[1];
                }
            }

            post_data = params.join('&');
            // console.log('helloworlds 数据--- ' + post_data);
        }

        if (window.location.href.includes("/share/share")) {
            var tokenRegex = /token=([^&]+)/;
            var match = window.location.href.match(tokenRegex);
            shareToken = match[1]
            console.log("share的 token --- " + shareToken)
        }
        var datas = send.apply(this, arguments);
        console.log("获取datas数据");
        return datas;
    };

    // 拦截请求头
    var originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
        console.log('Set Header:', header, value);
        if (header === 'uuid') {
            console.log(" header -- " + header + "  value = " + value)
            uuid = value;
        }
        if (header === 'agent-token') {
            agentToken = value;
        }
        originalSetRequestHeader.apply(this, arguments);
    }
}

function getDataAndSendToMonkey() {
    console.log('request url -- ' + data_url)
    console.log(" window.location.href --" + window.location.href)

    if (window.location.hostname.includes("haixiang") || window.location.href.includes("007.mn/work-order-sharing") || window.location.href.includes("imx.chat/work-order-sharing")|| window.location.href.includes("yf.lu/work-order-sharing") ) {
        console.log('海象 007.mn imx.chat  yf.lu post 11111---' + data_url)
        if (window.location.href.includes("007.mn/work-order-sharing") || window.location.href.includes("imx.chat/work-order-sharing")|| window.location.href.includes("yf.lu/work-order-sharing") ) {
            //{"page":1,"per_page":10,"workId":"1701124542770438145"}
            //将per_page的值改为500
            console.log("work-order-sharing---------------" + post_data);
            let aa = JSON.parse(post_data);
            aa.per_page = 500;
            workId = aa.workId;
            post_data = JSON.stringify(aa);
        }
        GM_xmlhttpRequest({
            method: "POST",
            url: data_url,
            data: post_data,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Uuid": uuid
            },
            onload: function (response) {
                let dataStr = ""
                //根据不同类型处理数据
                // console.log('post 返回数据-- ' + response.responseText)
                console.log('海象 007.mn imx.chat yf.lu 22222')
                if (window.location.href.includes("007.mn/work-order-sharing") || window.location.href.includes("imx.chat/work-order-sharing") || window.location.href.includes("yf.lu/work-order-sharing") ) {
                    console.log('海象 007.mn imx.chat yf.lu 33333 get007MNPostData')
                    let aa = get007MNPostData(response)
                    dataStr = JSON.stringify(aa)
                } else if (window.location.href.includes("haixiang.app")) {
                    let aa = getHaiXiangPostData(response)
                    dataStr = JSON.stringify(aa)
                }
                console.log('海象 007.mn imx.chat yf.lu 44444 get007MNPostData')
                sendDataToMonkey(dataStr);
            },
            onerror: function (error) {
                console.error("Error fetching data:", error);
            }
        });
    }

    if (window.location.href.includes("helloworlds")) {
        console.log('helloworlds post---' + data_url)
        console.log('helloworlds post_data---' + post_data)
        GM_xmlhttpRequest({
            method: "POST",
            url: data_url,
            data: post_data,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            onload: function (response) {
                let dataStr = ""
                //根据不同类型处理数据
                // console.log('post 返回数据-- ' + response.responseText)
                if (window.location.href.includes("helloworlds")) {
                    let aa = getHelloWorldPostData(response)
                    dataStr = JSON.stringify(aa)
                }
                // console.log('发送数据---- dataStr ' + dataStr);
                sendDataToMonkey(dataStr);
            },
            onerror: function (error) {
                console.error("Error fetching data:", error);
            }
        });
    }

    if (window.location.href.includes("qihang") || window.location.href.includes("sihai") || window.location.href.includes("yinchao")) {
        console.log('四海手动post---' + data_url)
        GM_xmlhttpRequest({
            method: "POST",
            url: data_url,
            data: post_data,
            headers: {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Content-Type': 'application/json',
                'Agent-Token': agentToken,
                'Client-Id': 'vps'
            },
            onload: function (response) {
                let dataStr = ""
                //根据不同类型处理数据
                // console.log('post 返回数据-- ' + response.responseText)
                if (window.location.href.includes("qihang") || window.location.href.includes("sihai") || window.location.href.includes("yinchao")) {
                    let aa = getSiHaiPostData(response)
                    dataStr = JSON.stringify(aa)
                }
                sendDataToMonkey(dataStr);
            },
            onerror: function (error) {
                console.error("Error fetching data:", error);
            }
        });
    } else if (window.location.href.includes("/biz/link/share")){
        console.log("类型为url66,开始处理");
        const dynamicReferer = document.referrer || window.location.href;
        fetch(data_url, {
            method: "GET",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Referer": dynamicReferer
            },
            credentials: "include" // 自动带上浏览器 Cookie（包括 cf_clearance）
        })
            .then(response => response.json())
            .then(data => {
                let dataStr = JSON.stringify(getUrl66Data({ responseText: JSON.stringify(data) }));
                sendDataToMonkey(dataStr);
            })
            .catch(error => {
                console.error("Error fetching url66 data:", error);
            });
    } else {
        var headers = {}
        console.log("均不是走007/url66逻辑");
        console.log("data_url:" + data_url);
        if (data_url.includes("/share/share/")) {
            headers = {
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Accept-Language": "zh-CN,zh;q=0.9",
                "Cookie": "share_token=" + shareToken,
                "Referer": "http://47.242.190.206/share/share/index.html?token=lwvhhhdbtjbkwzdjz9a0rg8rj0eg3h2gvdvscnvo8ti2o85e29",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                "X-Requested-With": "XMLHttpRequest"
            };
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: data_url,
            headers: headers,
            onload: function (response) {
                console.log("urlhost为" + window.location.host)
                let dataStr = ""
                //根据不同类型处理数据
                if (window.location.host == "kf.007.tools") {
                    //console.log('接受到的数据---- response ' + response.responseText);
                    console.log("类型为kf.007.tools,开始处理")
                    let aa = getKF007Data(response)
                    dataStr = JSON.stringify(aa)
                } else if (window.location.host == "007.mn" || window.location.host == "imx.chat") {
                    console.log("类型为007.mn/imx.chat,开始处理")
                    let aa = get007MNData(response)
                    dataStr = JSON.stringify(aa)
                } else if (data_url.includes("url66.me")) {
                    console.log("类型为url66,开始处理")
                    let aa = getUrl66Data(response)
                    dataStr = JSON.stringify(aa)
                } else if (data_url.includes("/share/share/")) {
                    console.log("类型为/share/share/,开始处理")
                    let aa = getShareData(response)
                    dataStr = JSON.stringify(aa)
                }

                //console.log('发送数据---- dataStr ' + dataStr);
                sendDataToMonkey(dataStr);
            },
            onerror: function (error) {
                console.error("Error fetching data:", error);
            }
        });
    }
}

//将数据发送到服务器
function sendDataToMonkey(data) {

    console.log('开始判断subuuid');
    // 获取当前页面的 URL 路径作为唯一标识
    const pagePath = window.location.href;

    // 根据页面路径生成唯一的存储键
    const localStorageKey = `character_${pagePath}`;

    // 检查本地存储是否已有对应字符
    let storedChar = localStorage.getItem(localStorageKey);

    if (!storedChar) {
        // 如果没有设置过字符，则弹出输入框
        let inputChar = prompt(`当前页面(${pagePath})没有设置子链，请输入子链：`);

        // 检查用户是否输入内容，避免保存空字符
        if (inputChar) {
            localStorage.setItem(localStorageKey, inputChar);
            alert("子链已保存！");
        } else {
            alert("未输入任何字符！");
        }
    } else {
        console.log(`当前页面(${pagePath})的子链是：`, storedChar);
    }
    // 从本地存储中获取字符，作为 subuuid 添加到数据中
    const subuuid = localStorage.getItem(localStorageKey);

    if (subuuid) {
        // 将字符串 data 转换为对象并添加 subuuid
        let dataObj;
        try {
            dataObj = JSON.parse(data);  // 假设 data 是 JSON 字符串
            dataObj.subuuid = subuuid;   // 添加 subuuid 属性
        } catch (error) {
            // 如果 data 不是 JSON 格式字符串，则初始化为对象
            dataObj = { originalData: data, subuuid: subuuid };
        }

        data = JSON.stringify(dataObj); // 将对象转换回字符串存储
        console.log("data添加subuuid", subuuid);
    } else {
        console.warn("subuuid 不存在，请确保已设置字符");
    }
    console.log('subuuid判断结束');
    console.log('发送数据: ' + JSON.stringify(data));
    GM_xmlhttpRequest({
        method: "POST",
        url: monkey_url,
        data: data,
        headers: {
            "Content-Type": "application/json"
        },
        onload: function (response) {
            console.log("Data sent to monkey_url:", response.responseText);
        },
        onerror: function (error) {
            console.error("Error sending data to monkey_url:", error);
        }
    });
    //发送到新服务器
    // sendDataToMonkey2(data)
}


//将数据发送到服务器
function sendDataToMonkey2(data) {


    console.log('发送数据: ' + JSON.stringify(data));

    GM_xmlhttpRequest({
        method: "POST",
        url: monkey_url2,
        data: data,
        headers: {
            "Content-Type": "application/json"
        },
        onload: function (response) {
            console.log("Data sent to monkey_url2:", response.responseText);
        },
        onerror: function (error) {
            console.error("Error sending data to monkey_url2:", error);
        }
    });
}


//KF007的处理
function getKF007Data(response) {

    var text = response.responseText;
    var new_data = {};

    if (response.status_code === 403) {
        new_data.code = 7;
        new_data.msg = "工单地址拒绝访问";
        return new_data;
    }

    var data = JSON.parse(text);
    console.log("KF007 工单2 data code == " + data.code + '\n');

    if (!data || !data.code || data.code !== 200) {
        new_data.code = data.code;
        new_data.msg = data.msg;
        return new_data;
    }

    // 因为工单不同 code 正确 返回值不同 有的0 有的200 这里统一200
    new_data.code = 200;
    new_data.data = {};
    new_data.data.intoAllFuns = parseInt(data.data.total);
    new_data.data.list = [];


    for (var i = 0; i < data.data.list.length; i++) {
        var item = data.data.list[i];
        var numId = item.line_id && item.line_id.length > 0 ? item.line_id : item.line_account;
        var intoFans = parseInt(item.day_target);
        console.log("intoFans -- " + intoFans);
        if (isNaN(intoFans)) {
            intoFans = 0;
        }

        var new_item = {
            "numId": numId,
            "state": item.status,
            "intoFans": intoFans,
            "repeatFans": 0
        };
        new_data.data.list.push(new_item);
    }
    new_data.orderUrl = window.location.href;

    // var match = window.location.search.match(/u=([^&]*)/);
    // var code = match ? match[1] : window.location.search;
    // new_data.monkeyName = code;
    // console.log('monkeyName -- ' + new_data.monkeyName);

    var params = new URLSearchParams(window.location.search);
    console.log("params --- " + params);
    var uValue = params.get('u');
    var codeValue = params.get('code');
    if (codeValue === null) {
        codeValue = params.get('encode');
    }
    new_data.monkeyName = uValue + codeValue;
    console.log('monkeyName -- ' + new_data.monkeyName);
    return new_data;
}

//007.mn工单处理
function get007MNData(response) {
    var text = response.responseText;

    var new_data = {};

    if (response.status === 403) {
        new_data.code = 7;
        new_data.msg = "工单地址拒绝访问";
        return new_data;
    }

    var data = JSON.parse(text);
    if (!data || !data.code || data.code !== 200) {
        new_data.code = data.code;
        new_data.msg = data.msg;
        return new_data;
    }

    new_data.code = 200;
    new_data.data = {};
    var intoAllFans = 0;
    new_data.data.list = [];

    for (var i = 0; i < data.data.list.length; i++) {
        var item = data.data.list[i];
        var state = item.online_status;

        if (state === 2) {
            state = NumStateType.NumType_OffLine;
        } else if (state === 3) {
            state = NumStateType.NumType_Lock;
        }

        if (item.single_into_fans_num === null) {
            continue;
        }

        intoAllFans += parseInt(item.single_into_fans_num);
        var new_item = {
            numId: item.username,
            state: state,
            intoFans: parseInt(item.single_into_fans_num),
            repeatFans: parseInt(item.single_repeat_fans_num)
        };

        new_data.data.list.push(new_item);
    }

    new_data.data.intoAllFuns = intoAllFans;

    new_data.orderUrl = window.location.href;

    // var match = window.location.search.match(/u=([^&]*)/);
    // var code = match ? match[1] : window.location.search;
    // new_data.monkeyName = code;
    // console.log('monkeyName -- ' + new_data.monkeyName);

    var params = new URLSearchParams(window.location.search);
    var uValue = params.get('u');
    var codeValue = params.get('code');
    if (codeValue === null) {
        codeValue = params.get('encode');
    }
    if (codeValue === null) {
        codeValue = params.get('uuid');
    }
    new_data.monkeyName = uValue + codeValue;
    console.log('monkeyName -- ' + new_data.monkeyName);
    return new_data;
}

//007.mn  Post工单处理
function get007MNPostData(response) {
    var text = response.responseText;

    var new_data = {};

    if (response.status === 403) {
        new_data.code = 7;
        new_data.msg = "工单地址拒绝访问";
        return new_data;
    }
    var data = JSON.parse(text);
    if (!data || !data.code || data.code !== 200) {
        new_data.code = data.code;
        new_data.msg = data.msg;
        return new_data;
    }
    new_data.code = 200;
    new_data.data = {};
    var intoAllFans = 0;
    new_data.data.list = [];
    for (var i = 0; i < data.data.list.length; i++) {
        var item = data.data.list[i];
        var state = item.isOnline;

        if (state === 2 || item.isAllocation == 0) {
            state = NumStateType.NumType_OffLine;
        } else if (state === 3) {
            state = NumStateType.NumType_Lock;
        }

        // 这里减去了重复的fans
        intoAllFans += parseInt(item.dayNewFans - item.dayRepeatFans);
        var new_item = {
            numId: (item.account).toString(),
            state: state,
            intoFans: parseInt(item.dayNewFans),
            repeatFans: parseInt(item.dayRepeatFans)
        };

        new_data.data.list.push(new_item);
    }

    new_data.data.intoAllFuns = intoAllFans;
    new_data.orderUrl = window.location.href;
    new_data.monkeyName = workId;
    // console.log("解析完的 new_data == " + JSON.stringify(new_data));
    return new_data;
}

function getHaiXiangPostData(response) {
    var text = response.responseText;

    var new_data = {};

    if (response.status === 403) {
        new_data.code = 7;
        new_data.msg = "工单地址拒绝访问";
        return new_data;
    }
    var data = JSON.parse(text);
    if (!data || !data.code || data.code !== 200) {
        new_data.code = data.code;
        new_data.msg = data.msg;
        return new_data;
    }

    new_data.code = 200;
    new_data.data = {};
    var intoAllFans = 0;
    new_data.data.list = [];

    for (var i = 0; i < data.data.list.length; i++) {
        var item = data.data.list[i];
        var state = item.status;

        if (state === 0) {
            state = NumStateType.NumType_OffLine;
        } else if (state === -1) {
            state = NumStateType.NumType_OffLine;
        }
        var userName = item.username;
        if (userName.startsWith('@')) {
            userName = userName.substring(1);
        }
        intoAllFans += parseInt(item.add_contact);
        var new_item = {
            numId: userName,
            state: state,
            intoFans: parseInt(item.add_contact),
            repeatFans: 0
        };

        new_data.data.list.push(new_item);
    }

    new_data.data.intoAllFuns = intoAllFans;
    new_data.orderUrl = window.location.href;
    new_data.monkeyName = haixiangCode;
    // console.log("解析完的 new_data == " + JSON.stringify(new_data));
    return new_data;
}

//四海  Post工单处理
function getSiHaiPostData(response) {
    var text = response.responseText;

    var new_data = {};

    if (response.status === 403) {
        new_data.code = 7;
        new_data.msg = "工单地址拒绝访问";
        return new_data;
    }
    var data = JSON.parse(text);
    if (!data || !data.success || data.success !== 1) {
        new_data.code = 7;
        new_data.msg = data.alert;
        return new_data;
    }
    new_data.code = 200;
    new_data.data = {};
    var intoAllFans = 0;
    new_data.data.list = [];
    for (var i = 0; i < data.data.list.length; i++) {
        var item = data.data.list[i];
        var state = NumStateType.NumType_OffLine;

        if ("在线" === item.state_text) {
            state = NumStateType.NumType_OnLine;
        }

        // 这里减去了重复的fans
        intoAllFans += parseInt(item.friend);
        var new_item = {
            numId: (item.mobile).toString(),
            state: state,
            intoFans: parseInt(item.friend),
            repeatFans: 0
        };

        new_data.data.list.push(new_item);
    }

    new_data.data.intoAllFuns = intoAllFans;
    new_data.orderUrl = window.location.href;
    new_data.monkeyName = agentToken;
    // console.log("解析完的 new_data == " + JSON.stringify(new_data));
    return new_data;
}

function getHelloWorldPostData(response) {
    var text = response.responseText;

    var new_data = {};

    if (response.status === 403) {
        new_data.code = 7;
        new_data.msg = "工单地址拒绝访问";
        return new_data;
    }
    var data = JSON.parse(text);
    // if (!data || !data.success || data.success !== 1) {
    //     new_data.code = 7;
    //     new_data.msg = data.alert;
    //     return new_data;
    // }

    new_data.code = 200;
    new_data.data = {};
    var intoAllFans = 0;
    new_data.data.list = [];
    for (var i = 0; i < data.rows.length; i++) {
        var item = data.rows[i];
        var state = item.onlineStatus;

        // 这里减去了重复的fans
        intoAllFans += parseInt(item.completedDayTarget - item.dayRepeatQuantity);
        var new_item = {
            numId: item.account,
            state: state,
            intoFans: parseInt(item.completedDayTarget),
            repeatFans: parseInt(item.dayRepeatQuantity)
        };

        new_data.data.list.push(new_item);
    }

    new_data.data.intoAllFuns = intoAllFans;
    new_data.orderUrl = window.location.href;
    new_data.monkeyName = orderNum;
    // console.log("解析完的 new_data == " + JSON.stringify(new_data));
    return new_data;
}

function getUrl66Data(response) {
    console.log("开始处理url66数据")
    var text = response.responseText;

    var new_data = {};

    if (response.status === 403) {
        new_data.code = 7;
        new_data.msg = "工单地址拒绝访问";
        console.error("工单地址拒绝访问")
        return new_data;
    }
    var data = JSON.parse(text).list;
    // if (!data || !data.success || data.success !== 1) {
    //     new_data.code = 7;
    //     new_data.msg = data.alert;
    //     return new_data;
    // }

    new_data.code = 200;
    new_data.data = {};
    var intoAllFans = 0;
    new_data.data.list = [];
    for (var i = 0; i < data.rows.length; i++) {
        var item = data.rows[i];
        var state = item.onlineType;

        // 这里减去了重复的fans
        intoAllFans += parseInt(item.addCountNow - item.repCountNow);
        var new_item = {
            numId: item.login,
            state: state,
            intoFans: parseInt(item.addCountNow),
            repeatFans: parseInt(item.repCountNow)
        };

        new_data.data.list.push(new_item);
    }

    new_data.data.intoAllFuns = intoAllFans;
    new_data.orderUrl = window.location.href;
    new_data.monkeyName = orderNum;
    // console.log("解析完的 new_data == " + JSON.stringify(new_data));
    console.log("url66数据处理完毕")
    return new_data;
}

function getShareData(response) {
    var text = response.responseText;
    console.log("text --- "  +text)
    var new_data = {};

    if (response.status === 403) {
        new_data.code = 7;
        new_data.msg = "工单地址拒绝访问";
        return new_data;
    }
    var data = JSON.parse(text);
    if (!data || data.code !== 0) {
        new_data.code = 7;
        new_data.msg = data.alert;
        return new_data;
    }

    new_data.code = 200;
    new_data.data = {};
    var intoAllFans = 0;
    new_data.data.list = [];
    for (var i = 0; i < data.data.length; i++) {
        var item = data.data[i];
        var state = item.online;

        // 这里减去了重复的fans
        intoAllFans += item.day_sum;
        var new_item = {
            numId: item.user,
            state: state,
            intoFans: parseInt(item.day_sum),
            repeatFans: 0
        };

        new_data.data.list.push(new_item);
    }

    new_data.data.intoAllFuns = intoAllFans;
    new_data.orderUrl = window.location.href;
    new_data.monkeyName = shareToken;
    // console.log("解析完的 new_data == " + JSON.stringify(new_data));
    return new_data;
}

//创建提取按钮
function createBtn() {
    //kf007 界面  007.mn 界面
    var resetButton = document.querySelector('.el-icon-refresh-right'); // 找到重置按钮图标
    if (resetButton) {
        var parentButton = resetButton.closest('.el-button'); // 找到包含按钮图标的父按钮

        if (parentButton) {
            var extractButton = parentButton.cloneNode(true); // 克隆父按钮
            extractButton.textContent = '提取号码'; // 修改按钮文本

            // 创建页面内提示元素
            var messageElement = document.createElement('div');
            messageElement.className = 'message';

            extractButton.addEventListener('click', function () {

                if (extractButton.textContent == '复制提取码') {
                    let monkeyName = "";
                    if (window.location.href.includes("007.mn/work-order-sharing") || window.location.href.includes("imx.chat/work-order-sharing")|| window.location.href.includes("yf.lu/work-order-sharing")) {
                        console.log("复制成功 -- " + workId);
                        monkeyName = workId;
                    }
                    else {

                        //var str = "?u=81101c82ef2c4b979f60e1be812b64fe&code=suqHgXZx";
                        var params = new URLSearchParams(window.location.search);
                        var uValue = params.get('u');
                        var codeValue = params.get('code');
                        if (codeValue === null) {
                            codeValue = params.get('encode');
                        }
                        if (codeValue === null) {
                            codeValue = params.get('uuid');
                        }
                        // // 拼接成一个新的字符串
                        // var newStr = 'u=' + uValue + '&code=' + codeValue;

                        // var match = window.location.search.match(/u=([^&]*)/);
                        // var code = match ? match[1] : window.location.search;
                        monkeyName = uValue + codeValue;
                    }

                    copyToClipboard(monkeyName);

                    // 显示提示信息
                    messageElement.textContent = '复制成功';
                    parentButton.parentNode.parentNode.parentNode.appendChild(messageElement);
                    // 延迟一定时间后清除提示信息
                    setTimeout(function () {
                        parentButton.parentNode.parentNode.parentNode.removeChild(messageElement);
                    }, 2000); // 2秒后清除提示信息
                } else {
                    startSend()
                }

                extractButton.textContent = '复制提取码';
            });

            // 在父按钮后插入提取号码按钮
            parentButton.parentNode.insertBefore(extractButton, parentButton.nextSibling);
        }
    }
    //海象界面
    if (window.location.hostname == "haixiang.app") {
        var buttons = document.querySelectorAll('button');
        // Iterate through the buttons to find the "查询" button
        let resetBtn = null;
        buttons.forEach(function (button) {
            if (button.textContent.includes('重 置')) {
                resetBtn = button
            }
        });
        console.log('resetBtn --- ' + resetBtn)
        if (resetBtn != null) {
            // var parentButton = resetBtn.closest('.ant-btn'); // 找到包含按钮图标的父按钮
            var parentDiv = resetBtn.closest('.ant-space-item');
            if (parentDiv) {
                let extractButton = parentDiv.cloneNode(true);
                extractButton.textContent = '提取号码'; // 修改按钮文本

                // 创建页面内提示元素
                var messageElement = document.createElement('div');
                messageElement.className = 'message';

                extractButton.addEventListener('click', function () {

                    if (extractButton.textContent == '复制提取码') {
                        console.log("复制成功")

                        copyToClipboard(haixiangCode)

                        // 显示提示信息
                        messageElement.textContent = '复制成功';
                        parentDiv.appendChild(messageElement);
                        // 延迟一定时间后清除提示信息
                        setTimeout(function () {
                            parentDiv.removeChild(messageElement);
                        }, 2000); // 2秒后清除提示信息
                    } else {
                        startSend();
                    }

                    extractButton.textContent = '复制提取码';
                });

                // 在按钮后插入提取号码按钮
                parentDiv.appendChild(extractButton);
            }
        }
    }

    console.log('添加按钮----' + window.location.hostname)

    //四海工单
    if (window.location.hostname.includes("sihai") || window.location.hostname.includes("qihang") || window.location.href.includes("yinchao")) {
        console.log('四海工单 添加按钮')
        const originalButton = document.querySelector('.layui-btn.cy');

        if (originalButton) {
            //这里因为开始截获不到数据 要手动点下搜索按钮
            originalButton.click();
            const extractButton = originalButton.cloneNode(true);

            // 找到这个按钮的父节点
            const parentDiv = originalButton.parentNode;

            if (parentDiv) {

                extractButton.textContent = '提取号码';
                // 创建页面内提示元素
                var messageElement = document.createElement('div');
                messageElement.className = 'message';

                extractButton.addEventListener('click', function () {

                    if (extractButton.textContent == '复制提取码') {
                        console.log("复制成功")

                        copyToClipboard(agentToken)

                        // 显示提示信息
                        messageElement.textContent = '复制成功';
                        parentDiv.appendChild(messageElement);
                        // 延迟一定时间后清除提示信息
                        setTimeout(function () {
                            parentDiv.removeChild(messageElement);
                        }, 2000); // 2秒后清除提示信息
                    } else {
                        startSend();
                    }

                    extractButton.textContent = '复制提取码';
                });
                parentDiv.appendChild(extractButton);

            }
        }
    }

    //helloworlds 界面
    if (window.location.hostname.includes("helloworlds")) {


        let searchButton = document.querySelector('.el-button.el-button--primary');

        if (searchButton) {
            // 创建复制按钮
            let copyButton = document.createElement('button');
            copyButton.type = "button";
            copyButton.className = "el-button el-button--default";
            copyButton.innerHTML = '<i class="el-icon-copy"></i><span>提取号码</span>';

            // 创建页面内提示元素
            var messageElement = document.createElement('div');
            messageElement.className = 'message';

            copyButton.addEventListener('click', function () {

                if (copyButton.textContent == '复制提取码') {
                    console.log("复制成功")

                    console.log('orderNum ---' + orderNum);
                    copyToClipboard(orderNum)

                    // 显示提示信息
                    messageElement.textContent = '复制成功';
                    searchButton.parentNode.appendChild(messageElement);
                    // 延迟一定时间后清除提示信息
                    setTimeout(function () {
                        searchButton.parentNode.removeChild(messageElement);
                    }, 2000); // 2秒后清除提示信息
                } else {
                    startSend();
                }

                copyButton.textContent = '复制提取码';
            });

            searchButton.parentNode.insertBefore(copyButton, searchButton.nextSibling);
        }
    }

    if (window.location.hostname.includes("url66.me")) {


        let resetButton = document.querySelector('.el-icon-search').parentElement;

        if (resetButton) {
            // 创建复制按钮
            let copyButton = document.createElement('button');
            copyButton.type = "button";
            copyButton.className = "el-button el-button--default";
            copyButton.innerHTML = '<i class="el-icon-copy"></i><span>提取号码</span>';

            // 创建页面内提示元素
            var messageElement = document.createElement('div');
            messageElement.className = 'message';

            copyButton.addEventListener('click', function () {

                if (copyButton.textContent == '复制提取码') {
                    console.log("复制成功")

                    console.log('orderNum ---' + orderNum);
                    copyToClipboard(orderNum)

                    // 显示提示信息
                    messageElement.textContent = '复制成功';
                    resetButton.parentNode.appendChild(messageElement);
                    // 延迟一定时间后清除提示信息
                    setTimeout(function () {
                        resetButton.parentNode.removeChild(messageElement);
                    }, 2000); // 2秒后清除提示信息
                } else {
                    startSend();
                }

                copyButton.textContent = '复制提取码';
            });

            resetButton.parentNode.insertBefore(copyButton, resetButton.nextSibling);
        }else {
            console.error("url66页面布局需要重新校验")
        }
    }

    if (data_url.includes("/share/share/")) {

        let searchButton = document.querySelector('.layui-btn');

        if (searchButton) {
            // 创建复制按钮
            let copyButton = document.createElement('button');
            copyButton.type = "button";
            copyButton.className = "layui-btn";
            copyButton.innerHTML = '<i class="el-icon-copy"></i><span>提取号码</span>';

            // 创建页面内提示元素
            var messageElement = document.createElement('div');
            messageElement.className = 'message';

            copyButton.addEventListener('click', function () {

                if (copyButton.textContent == '复制提取码') {
                    console.log("复制成功")

                    console.log('shareToken ---' + shareToken);
                    copyToClipboard(shareToken)

                    // 显示提示信息
                    messageElement.textContent = '复制成功';
                    searchButton.parentNode.appendChild(messageElement);
                    // 延迟一定时间后清除提示信息
                    setTimeout(function () {
                        searchButton.parentNode.removeChild(messageElement);
                    }, 2000); // 2秒后清除提示信息
                } else {
                    startSend();
                }

                copyButton.textContent = '复制提取码';
            });

            searchButton.parentNode.insertBefore(copyButton, searchButton.nextSibling);
        }
    }
}

function clickQuery() {
    var queryButton = document.querySelector('.el-button--primary .el-icon-search');

    // Click the query button if found
    if (queryButton) {
        queryButton.parentElement.click();
    }

    var buttons = document.querySelectorAll('button');
    // Iterate through the buttons to find the "查询" button
    buttons.forEach(function (button) {
        if (button.textContent.includes('查 询')) {
            button.click();
        }
    });

    //自动就开始发送数据
    setTimeout(function () {
        startSend();
    }, 500);
}



// 将内容放入剪贴板
function copyToClipboard(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

//开始定时发送服务器
function startSend() {
    getDataAndSendToMonkey();
    // setInterval(getDataAndSendToMonkey, 3 * 60 * 1000); // 3 minutes in milliseconds
    setInterval(getDataAndSendToMonkey, 1 * 60 * 1000); // 3 minutes in milliseconds
}