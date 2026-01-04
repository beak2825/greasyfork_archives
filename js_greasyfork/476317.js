// ==UserScript==
// @name        B站-破茧
// @namespace   Violentmonkey Scripts
// @match       *://www.bilibili.com/video/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_addValueChangeListener
// @grant       GM_info
// @grant       GM_addElement
// @grant       GM_addStyle
// @grant       GM_openInTab
// @version     0.4.7.8
// @inject-into page
// @require     https://greasyfork.org/scripts/476522-config-manager/code/Config_Manager.js?version=1285584
// @author      axototl
// @license     MPL-2.0
// @description 破除信息茧房，我看什么我决定！
// @icon        https://s1.hdslb.com/bfs/static/laputa-home/client/assets/vip-login-banner.c0cbe3b2.png
// @downloadURL https://update.greasyfork.org/scripts/476317/B%E7%AB%99-%E7%A0%B4%E8%8C%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/476317/B%E7%AB%99-%E7%A0%B4%E8%8C%A7.meta.js
// ==/UserScript==
'use strict';

(() => {
    if (GM_info.scriptHandler === "Violentmonkey") return true;
    GM_addElement("p", {
        textContent: `脚本 ${GM_info.script.name} 大量使用了暴力猴独有特性, 建议使用Violentmonkey(暴力猴)获得更好体验.`,
        style: "position: fixed; bottom: 0; right: 0; color: #F92672; font-size: 16px; font-weight: bold;"
    }).onclick = () => GM_openInTab("https://violentmonkey.github.io/get-it/");
    return false;
})();

let kw;
(() => {
    const upd = (x => kw = x?.split(' ').filter(el => !!el));
    upd(GM_getValue("keywords"));
    GM_registerMenuCommand("设置自定义搜索关键词", () => {
        const p = prompt("请输入自定义搜索关键词，用 空格 隔开", kw.join(" "));
        if (p == null) return;
        GM_setValue("keywords", p || null);
    });
    GM_addValueChangeListener("keywords", (_1, _2, nv) => upd(nv));
})();


const translate = json => {
    const params = new URLSearchParams();
    for (const it in json)
        params.append(it, json[it]);
    return params;
};


let sender;
const sendTrash = (uri, body) => fetch(uri, {
    referrer: "no-referrer",
    referrerPolicy: "no-referrer",
    method: "POST",
    credentials: "omit",
    priority: "low",
    mode: 'no-cors',
    body,
});

let Random; // Random-js Lib
let engine;

const delay = n => new Promise(resolve => setTimeout(resolve, n));

// const cid_api = [
//     "https://api.bilibili.com/x/web-interface/view/detail?aid=",
//     "https://api.bilibili.com/x/web-interface/view?aid="
// ];

const vid_arr = [];
const get_rand = async () => {
    const MAX = config.maxaid;
    const _rnd_helper = Random.integer(2, MAX);
    const getf = () => _rnd_helper(engine);
    for (let aid; ;) {
        if (vid_arr.length <= 0)
            for (let _ = 1; _ <= 20; ++_) vid_arr.push(getf());
        aid = vid_arr.pop();
        let res = await (await fetch("https://api.bilibili.com/x/web-interface/view?aid=" + aid)).json();
        if (res.code == -412) {
            throw Error("API被拦截");
        }
        if (res.code != 0) {
            await delay(500);
            continue;
        }
        res = res.data;
        if (undefined != res.forward) {
            aid = res.forward;
            continue;
        }
        let subtype = null;
        let type = res.rights?.movie ? (subtype = 2, 4) : 3;
        res = res.pages;
        const ct = res[(Math.random() * res.length) | 0];
        return {aid, type, subtype, ...ct};
    }
}

const getmid = async () => {
    let js = await (await fetch("https://api.bilibili.com/x/web-interface/nav", {credentials: "include"})).json();
    // console.debug(js);
    return js.data?.mid;
};

let jscookie;

// getmid();

let id0, id2;

const main_light = () => {
    id0 = setInterval(async () => {
        if (!config.cookie) {
            config.light_main = false;
            return;
        }
        const csrf = jscookie.get("bili_jct");
        if (!csrf) return;
        const {aid, cid, duration: last} = await get_rand();
        const para = {
            aid, cid,
            progress: Math.trunc(last*Math.random()),
            csrf
        };
        const params = translate(para);
        sender("https://api.bilibili.com/x/v2/history/report", params);
    }, config.delay);
};


// 建议根据自己的喜好动态调整
const refer_uris = [
    "https://www.bilibili.com/",
    "https://www.bing.com/",
    "https://www.zhihu.com/",
    "https://example.org/",
    '',
];

const main_classical = () => {

    const engine = Random.MersenneTwister19937.autoSeed();
    const _die4 = Random.die(4);
    const die4 = () => _die4(engine);
    // let x = 0;
    // let reducing = false;
    id0 = setInterval(async () => {
        // if (x > 65536) reducing = true;
        // if (reducing)
        //     if (--x > 0) return;
        //     else reducing = false;
        // else ++x;
        // 暂时禁用冷却
        // 冷却时间 65536 防止卡顿
        const {aid, cid, duration: last, type, subtype: sub_type} = await get_rand();
        // const time2 = (next()) % last;
        const time = Random.die(last)(engine);
        // console.log("time = ", time, "time2 = ", t2);
        const now = (Date.now() / 1000 | 0);
        const real = (1 + die4()) * time;
        const play_type = Random.pick(engine, [0, 2, 3]);
        const para = {
            start_ts: now - real,
            aid, cid, type,
            sub_type: sub_type ?? 0,
            dt: 2,
            play_type,
            realtime: real,
            played_time: time,
            real_played_time: time,
            refer_url: Random.pick(engine, refer_uris),
            quality: 0,
            video_duration: last,
            last_play_progress_time: time,
            max_play_progress_time: time,
            outer: 0,
            extra: '{"player_version":"4.5.7"}',
        };
        const jct = config.cookie ? jscookie.get("bili_jct") : undefined;
        // console.debug("your CSRF token(bili_jct) =", jct);
        if (!!jct) para.csrf = jct;
        const params = translate(para);
        // console.debug("parsing -------->");
        sender("https://api.bilibili.com/x/click-interface/web/heartbeat", params);
    }, config.delay);
};
const unload = () => (clearInterval(id0));

const load_query = () => {
    if (kw?.length == 0) return;
    const _ref_pick = Random.picker(kw);
    const ref_pick = () =>_ref_pick(engine);
    const cfg = {credentials: "include", referrer: "search.bilibili.com"};
    const MAX = 100;
    id2 = setInterval(async () => {
        let res = fetch("https://api.bilibili.com/x/web-interface/search/all/v2?keyword=" + ref_pick(), cfg);
        if (vid_arr.length > MAX || !config.main) return;
        res = await (await res).json();
        if (res.code != 0) return config.query = false;
        res = res.data.result;
        while(res.length > 0) {
            const s = res.pop();
            if (s.result_type === 'video') {
                res = s;
                break;
            }
        }
        if (typeof res !== 'object') return;
        res = res.data;
        Random.shuffle(engine, res);
        for (const x of res) vid_arr.push(x.aid);
    }, 15e3);
};
const unload_query = () => clearInterval(id2);

let load;

const _need_cookie = (_1, val) => val ? config.cookie : true;

const reload_cb = (_1, _2, nv) => {
    if (!config.main) return;
    unload();
    load = (nv ? main_light : main_classical);
    load();
};

let __dislike_div;
const cfgs = [
    {
        name: "delay",
        type: "uint",
        desc: "设置轮询时间",
        tips: "设置轮询时间（请输入正数）",
        default: 60e3,
    },
    {
        name: "maxaid",
        type: "uint",
        desc: "设置最大AV号",
        tips: "请输入轮询应当获取到的最大av号\n(注意只需要输入数字即可)",
        default: (1e9|0),
    },
    {
        name: "use_beacon",
        type: "bool",
        default: false,
        desc: "[实验性] 使用SendBeacon API（缓解内存泄露）",
        callback: (_1, _2, nv) => (sender = (nv ? (uri, para) => navigator.sendBeacon(uri, para) : sendTrash)),
        init: true,
        autoClose: false,
    },
    {
        name: "query",
        type: 'bool',
        desc: "轮询搜索API (定制推送内容)",
        callback: (_1, _2, nv) => ((nv ? load_query : unload_query)()),
        default: false,
        init: true,
        autoClose: false,
    },
    {
        name: "cookie",
        type: "bool",
        desc: "携带Cookie（会污染历史记录）",
        default: true,
        judge: (_, i) => !i || !!cookie.get("bili_jct"),
        autoClose: false,
    },
    {
        name: "light_main",
        type: "bool",
        desc: "[试验性] 使用轻量版主程序",
        default: false,
        callback: reload_cb,
        init: (_1, val) => load = (val ? main_light : main_classical),
        autoClose: false,
        judge: _need_cookie,
    },
    {
        name: "main",
        type: 'bool',
        desc: "主程序 (清洗个人喜好)",
        callback: ((_1, _2, nv) => (nv ? load : unload)()),
        default: true,
        init: true,
    },
    {
        name: "access_key",
        type: "other",
        desc: "设置access_token",
        tips: "请输入access_token",
        default: null,
    },
    {
        name: "dislike",
        type: "bool",
        desc: "[实验性] 点踩 (需APP_token)",
        callback: (_1, _2, nv) => (nv ? (__dislike_div = dislike_f()) : __dislike_div?.remove()),
        judge: () => (alert("注意，只有在bilibili.com/video/av123456 情况下可用 BV号不可用"), true),
        init: (name, val) => (val ? (__dislike_div = dislike_f()) : 0),
    },
];

let md5;
const require = mod => import(`https://fastly.jsdelivr.net/npm/${mod}/+esm`);

(async () => {
    Random = await require("random-js");
    // engine = Random.MersenneTwister19937.autoSeed();
    engine = Random.nativeMath;
    const {default: cookie} = await require("js-cookie");
    jscookie = cookie;
    const {md5: hash} = await require("js-md5");
    md5 = hash;
    // console.debug("Loading.....");
    cfgs.forEach(register);
    GM_registerMenuCommand("[实验性] 登录（获取Access Token）", getkey_ui);


    GM_addStyle(`
#gm_deslike {
    /* 设置形状及阴影 */
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: black;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);

    display: flex;
    align-items: center;
    justify-content: center;

    /* 设置按钮的位置 */
    position: fixed;
    right: 20px;
    bottom: 20px;

    /* 设置过渡属性 */
    transition: width 0.5s, height 0.5s;
}

#gm_deslike:hover {
    /* 鼠标悬停时 */
    width: 60px;
    height: 60px;
}
`);
})();


async function dislike_f() {
    const paras = {
        access_key: config.access_key,
        dislike: 0,
    };
    // console.warn("11111111111111111111111111111");
    let id = /av(\d+)/.exec(location.pathname);
    if (id) id = id[1];
    else {
        id = /BV(\w+)/.exec(location.pathname);
        if (!id) return -2;
        id = (bv => {
            const pos = [11, 10, 3, 8, 4, 6];
            const base = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
            const table = {};
            for (let i = 0; i < base.length; i++) table[base[i]] = i;
            let r = 0;
            for (let i = 0; i < pos.length; i++) r += table[bv[pos[i]]] * 58 ** i;
            return (r - 8728348608) ^ 177451812;
        })(id[0]);
    }
    // console.warn("你好222222222222222");
    paras.aid = id;
    const div = GM_addElement("div", {id: "gm_deslike"});
    const p = GM_addElement(div, "p", {textContent: "不喜欢"});
    const par = translate(paras);
    par.sort();
    p.onmousedown = async ev => {
        div.remove();
        if (ev.button == 2) return;
        let res = fetch("https://app.biliapi.net/x/v2/view/dislike", {
            referrer: "no-referrer",
            referrerPolicy: "no-referrer",
            method: "POST",
            credentials: "omit",
            priority: "low",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: par,
        });
        res = (await res);
        console.log(res);
        res = await res.json();
        if (res.code === 0) return;
        alert("点踩失败\n 原因: " + res.message);
    };
    return div;
}


function api_signer (salt, appkey, paras) {
    let par = {
        appkey,
        local_id: 0,
        ts: Math.trunc(Date.now()/1000),
    };
    Object.assign(par, paras);
    par = translate(par);
    par.sort();
    const sign = md5('' + par + salt);
    par.append("sign", sign);
    return {
        method: "POST",
        credentials: "omit",
        referrer: "no-referrer",
        referrerPolicy: "no-referrer",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: par,
    };
}

let _share_win;
async function _alerter(uri) {
    const {default: QRCode} = await require("qrcode-svg");
    let img = new QRCode({content: uri}).svg();
    img = new Blob([img], {type: "image/svg+xml"});
    img = URL.createObjectURL(img);
    // console.log("你好 =========================");
    let xhtm =
`<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="zh-CN">
<head>
    <script>
    setTimeout(()=>{
        alert("已超时！请重新获取二维码。");
        window.close();
    }, ${180e3 | 0});
    </script>
</head>
<body>
    <p style="font-size: 30px;">请在180秒内扫扫描以下二维码登录 <br/><br/> 若过期请关闭此标签页并重新开始</p>
    <img src="${img}" />
</body>
</html>
`;
    xhtm = new Blob([xhtm], {type: "application/xhtml+xml"});
    xhtm = URL.createObjectURL(xhtm);
    const revoker = () => [img, xhtm].forEach(URL.revokeObjectURL);
    if (GM_info.platform?.browserName === "firefox") {
        _share_win = window.open(xhtm, "_blank"); // Firefox disallow calling GM_openInTab with Data URL.
        alert("请注意窗口顶部，请允许打开弹出式窗口");
    } else {
        _share_win = GM_openInTab(xhtm);
    }
    setTimeout(revoker, 180e3 | 0);
}

async function getkey_ui () {
    const sign = par => api_signer("59b43e04ad6965f34319062b478f83dd", "4409e2ce8ffd12b8", par);
    let res = fetch("https://passport.bilibili.com/x/passport-tv-login/qrcode/auth_code", sign());
    res = await (await res).json();
    console.log(" =====> parsing <======");
    if (res.code != 0) return new Error(res.message);
    res = res.data;
    await _alerter(res.url);
    const auth_code = res.auth_code;
    const get_id_worker = setInterval(async () => {
        let res = fetch("https://passport.bilibili.com/x/passport-tv-login/qrcode/poll", sign({auth_code}));
        res = await (await res).json();
        if (res.code == 86038 || res.code < 0) {
            clearInterval(get_id_worker);
            throw "Timeout!";
        } else if (res.code != 0) return console.warn("登录未成功，原因：", res.message);
        res = res.data;
        config.access_key = res.access_token;
        clearInterval(get_id_worker);
        _share_win.close();
        alert("登录成功! 已获取到Access Token!");
    }, 5000);
};
