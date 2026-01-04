// ==UserScript==
// @name         弹幕助手
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  获取直播弹幕信息并发送详情
// @match        https://liveplatform.taobao.com/*
// @icon         https://cdn.52ym.vip/temp/a0whr-l6z8y-001.ico
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475628/%E5%BC%B9%E5%B9%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/475628/%E5%BC%B9%E5%B9%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

const TIME = 2000;


const platformMap = new Map([
    ['taobao', handleTaoBaoBarrage]
]);

let barrageIds = []; // 存储已处理的弹幕ID

let requestData = {
  "rommId": 0,//直播间ID
  "username":"",//用户
  "content":"",//评论
  "onlineCount":0,//在线人数
  "isSub":false,//是否关注
}


//发送弹幕消息
function handleRequest(params) {
    // 构造弹幕数据对象
    let data = {
        nickname: params.username,
        content: params.content,
        time: params.time
    };

    console.log(data);
    // 将已处理的弹幕ID添加到列表中
    barrageIds.push(params.username+params.content+params.time+params.top);
    if (barrageIds.length > 1) {
        barrageIds.splice(0, 1);
    }
    httpRequest({
        method:"post",
        url:"https://dev.zb.51szr.com/api/live/comment/push/",
        data:params,
        async:true,
    },(res)=>{
        console.log('res:',res)
    },(err)=>{
        console.log("err:",err)
    })
}

//查询直播间ID
function getQueryName(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURI(r[2]);
  }
  return null;
}


function getTokeFromCookie(e) {
    var t = new RegExp("(?:^|;\\s*)" + e + "\\=([^;]+)(?:;\\s*|$)").exec(document.cookie);
    return t ? t[1] : void 0
}



//获取在线人数
function getOnlineCount(roomId) {
    let _ = "_m_h5_c"
    , k = "_m_h5_tk"
    , P = "_m_h5_tk_enc";
    const token = getTokeFromCookie(k);
    const appKey ="12574478";
    const t = new Date().getTime();
    const data = {"checkedUserId":null,"checkedUserOrderFactor":null,"liveId":roomId,"algorithmScore":null,"sort":"time"}
    const sign = getSign(token + "&" + t + "&" + appKey + "&"+ JSON.stringify(data));
    const params = {
        "jsv": "2.7.0",
        "appKey": appKey,
        "t": t,
        "sign": sign,
        "api": "mtop.taobao.iliad.live.user.list",
        "v": "2.0",
        "preventFallback": true,
        "type": "jsonp",
        "dataType": "jsonp",
        "callback": "mtopjsonp100000",
        "data":JSON.stringify(data)
    }
    let url="https://h5api.m.taobao.com/h5/mtop.taobao.iliad.live.user.list/2.0/"
    // 将参数拼接到URL中
    let queryString = Object.keys(params).map(function(key) {
        if (key ==="data"){
           return key + "=" + encodeURIComponent(params[key])
        }
        return key + "=" + params[key];
    }).join("&");

    url += "?" + queryString;
    console.log("request url:",url);
    // GET请求示例
    // 在脚本中发送带有 Cookie 的请求
    /**GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers: {
            "Cookie": document.cookie, // 使用当前页面的 Cookie
        },
        data: params,
        onload: function(response) {
            // 处理响应
            console.log(response.responseText);
        }
    });**/
}
function getSign(e) {
    function t(e, t) {
        return e << t | e >>> 32 - t
    }
    function n(e, t) {
        var n, r, o, i, a;
        return o = 2147483648 & e,
            i = 2147483648 & t,
            a = (1073741823 & e) + (1073741823 & t),
            (n = 1073741824 & e) & (r = 1073741824 & t) ? 2147483648 ^ a ^ o ^ i : n | r ? 1073741824 & a ? 3221225472 ^ a ^ o ^ i : 1073741824 ^ a ^ o ^ i : a ^ o ^ i
    }
    function r(e, t, n) {
        return e & t | ~e & n
    }
    function o(e, t, n) {
        return e & n | t & ~n
    }
    function i(e, t, n) {
        return e ^ t ^ n
    }
    function a(e, t, n) {
        return t ^ (e | ~n)
    }
    function s(e, o, i, a, s, l, c) {
        return e = n(e, n(n(r(o, i, a), s), c)),
            n(t(e, l), o)
    }
    function l(e, r, i, a, s, l, c) {
        return e = n(e, n(n(o(r, i, a), s), c)),
            n(t(e, l), r)
    }
    function c(e, r, o, a, s, l, c) {
        return e = n(e, n(n(i(r, o, a), s), c)),
            n(t(e, l), r)
    }
    function u(e, r, o, i, s, l, c) {
        return e = n(e, n(n(a(r, o, i), s), c)),
            n(t(e, l), r)
    }
    function d(e) {
        for (var t, n = e.length, r = n + 8, o, i = 16 * ((r - r % 64) / 64 + 1), a = new Array(i - 1), s = 0, l = 0; n > l; )
            s = l % 4 * 8,
                a[t = (l - l % 4) / 4] = a[t] | e.charCodeAt(l) << s,
                l++;
        return s = l % 4 * 8,
            a[t = (l - l % 4) / 4] = a[t] | 128 << s,
            a[i - 2] = n << 3,
            a[i - 1] = n >>> 29,
            a
    }
    function p(e) {
        var t, n, r = "", o = "";
        for (n = 0; 3 >= n; n++)
            r += (o = "0" + (t = e >>> 8 * n & 255).toString(16)).substr(o.length - 2, 2);
        return r
    }
    function f(e) {
        e = e.replace(/\r\n/g, "\n");
        for (var t = "", n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            128 > r ? t += String.fromCharCode(r) : r > 127 && 2048 > r ? (t += String.fromCharCode(r >> 6 | 192),
                                                                           t += String.fromCharCode(63 & r | 128)) : (t += String.fromCharCode(r >> 12 | 224),
                                                                                                                      t += String.fromCharCode(r >> 6 & 63 | 128),
                                                                                                                      t += String.fromCharCode(63 & r | 128))
        }
        return t
    }
    var h, m, v, g, y, b, w, x, E, C = [], S = 7, O = 12, T = 17, _ = 22, k = 5, P = 9, N = 14, I = 20, M = 4, R = 11, j = 16, A = 23, D = 6, L = 10, F = 15, V = 21, B;
    for (C = d(e = f(e)),
         b = 1732584193,
         w = 4023233417,
         x = 2562383102,
         E = 271733878,
         h = 0; h < C.length; h += 16)
        m = b,
            v = w,
            g = x,
            y = E,
            b = s(b, w, x, E, C[h + 0], 7, 3614090360),
            E = s(E, b, w, x, C[h + 1], O, 3905402710),
            x = s(x, E, b, w, C[h + 2], T, 606105819),
            w = s(w, x, E, b, C[h + 3], _, 3250441966),
            b = s(b, w, x, E, C[h + 4], 7, 4118548399),
            E = s(E, b, w, x, C[h + 5], O, 1200080426),
            x = s(x, E, b, w, C[h + 6], T, 2821735955),
            w = s(w, x, E, b, C[h + 7], _, 4249261313),
            b = s(b, w, x, E, C[h + 8], 7, 1770035416),
            E = s(E, b, w, x, C[h + 9], O, 2336552879),
            x = s(x, E, b, w, C[h + 10], T, 4294925233),
            w = s(w, x, E, b, C[h + 11], _, 2304563134),
            b = s(b, w, x, E, C[h + 12], 7, 1804603682),
            E = s(E, b, w, x, C[h + 13], O, 4254626195),
            x = s(x, E, b, w, C[h + 14], T, 2792965006),
            b = l(b, w = s(w, x, E, b, C[h + 15], _, 1236535329), x, E, C[h + 1], 5, 4129170786),
            E = l(E, b, w, x, C[h + 6], 9, 3225465664),
            x = l(x, E, b, w, C[h + 11], N, 643717713),
            w = l(w, x, E, b, C[h + 0], I, 3921069994),
            b = l(b, w, x, E, C[h + 5], 5, 3593408605),
            E = l(E, b, w, x, C[h + 10], 9, 38016083),
            x = l(x, E, b, w, C[h + 15], N, 3634488961),
            w = l(w, x, E, b, C[h + 4], I, 3889429448),
            b = l(b, w, x, E, C[h + 9], 5, 568446438),
            E = l(E, b, w, x, C[h + 14], 9, 3275163606),
            x = l(x, E, b, w, C[h + 3], N, 4107603335),
            w = l(w, x, E, b, C[h + 8], I, 1163531501),
            b = l(b, w, x, E, C[h + 13], 5, 2850285829),
            E = l(E, b, w, x, C[h + 2], 9, 4243563512),
            x = l(x, E, b, w, C[h + 7], N, 1735328473),
            b = c(b, w = l(w, x, E, b, C[h + 12], I, 2368359562), x, E, C[h + 5], 4, 4294588738),
            E = c(E, b, w, x, C[h + 8], R, 2272392833),
            x = c(x, E, b, w, C[h + 11], j, 1839030562),
            w = c(w, x, E, b, C[h + 14], A, 4259657740),
            b = c(b, w, x, E, C[h + 1], 4, 2763975236),
            E = c(E, b, w, x, C[h + 4], R, 1272893353),
            x = c(x, E, b, w, C[h + 7], j, 4139469664),
            w = c(w, x, E, b, C[h + 10], A, 3200236656),
            b = c(b, w, x, E, C[h + 13], 4, 681279174),
            E = c(E, b, w, x, C[h + 0], R, 3936430074),
            x = c(x, E, b, w, C[h + 3], j, 3572445317),
            w = c(w, x, E, b, C[h + 6], A, 76029189),
            b = c(b, w, x, E, C[h + 9], 4, 3654602809),
            E = c(E, b, w, x, C[h + 12], R, 3873151461),
            x = c(x, E, b, w, C[h + 15], j, 530742520),
            b = u(b, w = c(w, x, E, b, C[h + 2], A, 3299628645), x, E, C[h + 0], 6, 4096336452),
            E = u(E, b, w, x, C[h + 7], L, 1126891415),
            x = u(x, E, b, w, C[h + 14], F, 2878612391),
            w = u(w, x, E, b, C[h + 5], V, 4237533241),
            b = u(b, w, x, E, C[h + 12], 6, 1700485571),
            E = u(E, b, w, x, C[h + 3], L, 2399980690),
            x = u(x, E, b, w, C[h + 10], F, 4293915773),
            w = u(w, x, E, b, C[h + 1], V, 2240044497),
            b = u(b, w, x, E, C[h + 8], 6, 1873313359),
            E = u(E, b, w, x, C[h + 15], L, 4264355552),
            x = u(x, E, b, w, C[h + 6], F, 2734768916),
            w = u(w, x, E, b, C[h + 13], V, 1309151649),
            b = u(b, w, x, E, C[h + 4], 6, 4149444226),
            E = u(E, b, w, x, C[h + 11], L, 3174756917),
            x = u(x, E, b, w, C[h + 2], F, 718787259),
            w = u(w, x, E, b, C[h + 9], V, 3951481745),
            b = n(b, m),
            w = n(w, v),
            x = n(x, g),
            E = n(E, y);
    return (p(b) + p(w) + p(x) + p(E)).toLowerCase()
}

let xmlHttp=""
//推送数据
function httpRequest(requestObj,successFun,failFun) {
    let { url:httpUrl, method, data, async } = requestObj

    xmlHttp = checkBrowser(xmlHttp);

    //请求方式， 转换为大写
    var httpMethod = (method || "Get").toUpperCase();
    //post请求时参数处理
    if (httpMethod === "POST") requestData = JSON.stringify(data)

    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            // 请求成功的回调函数
            successFun(xmlHttp.responseText);

        } else {
            //请求失败的回调函数
            failFun(xmlHttp.responseText);
        }
    }

    // 发送请求
    sendRequest(httpUrl, requestData, httpMethod, async );
}

/**
 * 校验浏览器创建xmlHttp对象
 * @param xmlHttp
 */
function checkBrowser(xmlHttp) {
    //创建 XMLHttpRequest 对象，老版本的 Internet Explorer （IE5 和 IE6）
    //使用 ActiveX 对象：xmlhttp=new ActiveXObject("Microsoft.XMLHTTP")
    if (window.XMLHttpRequest) {
        //code for all new browsers
        xmlHttp = new XMLHttpRequest;

    } else if (window.ActiveXObject) {
        //code for IE5 and IE6
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    // console.log(xmlHttp)
    return xmlHttp;
}

/**
 * 发送请求
 * @param xmlHttp
 * @param requestData
 */
function sendRequest(httpUrl, requestData, httpMethod, async) {

    if (httpMethod === "GET") {
        xmlHttp.open("GET", httpUrl, async);
        //xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlHttp.send(requestData);
    } else if (httpMethod === "POST") {
        xmlHttp.open("POST", httpUrl, async);
        xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlHttp.setRequestHeader("Access-Control-Allow-Origin", "*"); // 用来解决跨域
        xmlHttp.send(requestData);
    }
}


//处理弹幕消息
function handleTaoBaoBarrage() {
    let barrageContainer = document.querySelector('#rc-tabs-1-panel-AssistantCommentCard > div.alpw-container > div > div:last-child');
    if (!barrageContainer) {
        return; // Exit if the barrage container element is not found
    }
    let top = barrageContainer.style.top;
    let usernameElement = barrageContainer.querySelector('div.alpw-userinfo > div > div > div.alpw-username-text');
    let usernickElement = barrageContainer.querySelector('div.alpw-userinfo > div > div > div.alpw-username-nick');
    let timeElement = barrageContainer.querySelector('div.alpw-userinfo > span');
    let contentElement = barrageContainer.querySelector('div.alpw-comment-content');

    let username = usernameElement.textContent.trim()+usernickElement.textContent.trim();
    let content = contentElement.textContent.trim();
    let time = timeElement.textContent.trim();
    // 检查是否已处理过该弹幕
    if (barrageIds.includes((username+content+time+top))) {
        return;
    }
    const roomId = getQueryName("liveId");
    let is_sub=false;
    if(content.indexOf("关注了主播")!==-1){
        is_sub=true
    }
    //getOnlineCount(roomId);
    requestData = {
      "roomId":roomId,
      "username":username,//用户
      "content":content,//评论
      "onlineCount": 0,//在线人数
      "isSub":is_sub,//是否关注,
      "time":time,
      "top":top,
    }
    handleRequest(requestData);
}

(function () {
    setTimeout(()=>{
        const currUrl = window.location.href;
        platformMap.forEach((value, key) => {
            if (currUrl.indexOf(key) !== -1) {
                setInterval(value, TIME);
            }
        });
    },5000)
})();