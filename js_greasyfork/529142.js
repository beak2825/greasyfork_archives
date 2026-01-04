// ==UserScript==
// @name         少前2bbs自动兑换物品脚本
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  一个简单的少前2论坛自动兑换物品脚本(包括签到)；当因登录凭证过期时，可根据提供的账号密码自动登录(可选)；其中，若提供账号，则需要启用油猴插件"允许访问文件网址"权限，这是读取文件接口GM_getResourceText()的硬性要求，具体账号配置请查看文档。以chrome为例，浏览器右上角"更多设置(三点)" -> "拓展程序" -> "管理拓展程序" -> "篡改猴" -> "详情" -> "允许访问文件网址" -> 启用。
// @author       virtual___nova@outlook.com
// @match        https://gf2-bbs.exiliumgf.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=exiliumgf.com
// @grant        GM_getResourceText
// @grant        window.onurlchange
// @resource     config http://your/path/to/config.json
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529142/%E5%B0%91%E5%89%8D2bbs%E8%87%AA%E5%8A%A8%E5%85%91%E6%8D%A2%E7%89%A9%E5%93%81%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/529142/%E5%B0%91%E5%89%8D2bbs%E8%87%AA%E5%8A%A8%E5%85%91%E6%8D%A2%E7%89%A9%E5%93%81%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const SCRIPT_NAME = GM_info.script.name;
    log(`开始执行${SCRIPT_NAME}...`);
    const states = {};
    const PERFORMED = "performed", SIGNED = "signed", EXCHANGED = "exchanged";
    if ((states[SIGNED] = getKey(SIGNED)) && (states[PERFORMED] = getKey(PERFORMED)) && (states[EXCHANGED] = getKey(EXCHANGED))) {
        log('今日已执行.');
        return;
    }
    const TASK_1 = "点赞帖子", TASK_2 = "分享帖子", TASK_3 = "浏览帖子";
    const DEFAULT = {
        notification: 1,
        base_url: 'https://gf2-bbs-api.exiliumgf.com',
        threshold: 600, // 判断token是否过期阈值（单位秒）
        network_delay: 600 // 请求延迟（单位毫秒）
    };
    let _node;
    const configPath = getConfigPath();
    const configPathNotEmpty = configPath !== '';
    !configPathNotEmpty && log('配置文件路径为空', 'warn');
    const _config = configPathNotEmpty ? GM_getResourceText('config') : '';
    const config = Object.assign({}, DEFAULT, _config ? JSON.parse(_config) : {});
    const BASE_URL = config.base_url, OK = "OK";
    const NOTIFICATION_STYLE = "position: absolute; z-index: 1000; padding: 0 10px; display: flex; align-items: center; color: white; transition: all 0.2s;";
    const NOTIFICATION_STYLE_FOR_PC = "right: 0; font-size: .12rem;";
    const NOTIFICATION_STYLE_FOR_PHONE = "left: 0; font-size: .13rem;";
    const SIGNED_IMG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABXCAMAAAC3HXLTAAADAFBMVEVHcEzg4ODg4ODg4OD////g4ODf39/////////////h4eHg4ODg4ODg4ODe3t7g4OD////g4ODh4eHg4ODg4ODf39/////h4eH////g4ODg4ODg4OD+/v7c3Nzh4eHh4eHg4ODm5ub////////////g4ODc3Nzh4eH////////i4uL////g4ODh4eHg4OD////h4eHg4OD+/v7////g4ODh4eHj4+Pe3t7g4ODg4ODd3d3////////h4eHg4OD////f39/k5OT////////////////////////////////////////l5eX////e3t7f39/k5OTg4ODh4eH////////////////////////h4eH////f39/z8/P////////f39/////f39/////f39/////////////g4OD////////////////f39/////////////////////////////////////////////////h4eH////////////////////////i4uL////////////i4uL////j4+Ps7Oz19fX////////////////////t7e3////l5eX////////m5ub////+/v7b29ve3t7g4ODY2Njd3d3c3Nz////g4ODl5eXd3d3m5ubh4eH8/Pz////g4OD///////////+rq6vg4OCkpKSqqqqlpaWoqKinp6f4+Pjf39+srKz+/v6mpqapqanj4+PU1NSurq6jo6Pm5ua0tLS1tbXz8/PIyMjMzMzi4uLs7OywsLDS0tL7+/v9/f3k5OTh4eHd3d3JycmysrKtra3u7u709PTe3t78/Pz6+vrPz8/V1dXv7+/BwcHX19f5+fnl5eXr6+uvr6/Dw8P39/ezs7Pn5+fR0dHLy8vx8fHc3Nzq6urt7e3o6OjZ2dm7u7vw8PDHx8fb29vT09PFxcWxsbH29vby8vK3t7fQ0NDa2tqhoaG9vb2+vr6fn5+2tra4uLjOzs7AwMD19fXGxsbExMTNzc3CwsK/v7/W1tZAfWO5AAAAp3RSTlMA7tbylvQYRtAyN/bZERsuJfDc8DkwCh/+6dA8RSvUKc8TB/oz2hYyAx80NB3dPu/z3kpf6+0PJubcLdqzFjF5GS9n8QTsE8WVECL2HQs2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";
    // 获取配置文件路径；
    function getConfigPath() {
        const pattern = /(@resource\s+)(.*?)\n/;
        const meta = GM_info.scriptMetaStr;
        const groups = meta.match(pattern);
        if (groups) {
            const path = groups[2];
            if (!path.split(" ")[1].startsWith("file://")) {
                return "";
            }
            return path;
        }
        return "";
    }
    // 账号登录；返回一个令牌
    async function login(account, password) {
        if (!account || !password) {
            throw new Error("账号密码不能为空");
        }
        const pattern = /^1[3456789]\d{9}$/;
        let source;
        if (pattern.test(account)) {
            source = "phone";
        }
        else if (account.includes("@")) {
            source = "email";
        }
        else {
            throw new Error("账号格式错误");
        }
        const resp = await fetch(`${BASE_URL}/login/account`, {
            method: "post",
            headers: { Authorization: token, "Content-Type": "application/json" },
            body: JSON.stringify({ account_name: account, passwd: encrypt(password), source })
        });
        return (await resp.json()).data.account.token;
    }
    // 获取现在到凌晨的秒数，作为cookie的有效期；
    function getExpiration() {
        const date = new Date();
        const ms1 = date.getTime();
        const ms2 = date.setHours(24, 0, 0, 0);
        return ((ms2 - ms1) / 1000) >> 0;
    }
    // 是否已经签到
    async function signed(token) {
        const resp = await (await fetch(`${BASE_URL}/community/task/get_current_sign_in_status`, {
            headers: { Authorization: token, "Content-Type": "application/json" }
        })).json();
        return resp.data.has_sign_in;
    }
    function successful(resp) {
        return resp.Message === OK;
    }
    // 签到
    async function signIn(token, _signed) {
        log(signIn.name);
        // 一共两次判断，一次为本地判断，另一次为从服务器获取数据判断，兑换和执行每日任务同理
        if (_signed || (await signed(token))) {
            console.log('今日已签到');
            return { [SIGNED]: setKey(SIGNED) };
        }
        let resp = await fetch(`${BASE_URL}/community/task/sign_in`, {
            method: "post",
            headers: { Authorization: token, "Content-Type": "application/json" },
            body: "{}"
        });
        resp = await resp.json();
        successful(resp) && (resp[SIGNED] = setKey(SIGNED));
        return resp;
    }
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function like(token, topicId) {
        return await (await fetch(`${BASE_URL}/community/topic/like/${topicId}?id=${topicId}`, {
            headers: { Authorization: token, "Content-Type": "application/json" }
        })).json();
    }
    // 点赞(三个帖子)；
    // 如果帖子为"点赞"状态，则需要先取消点赞，再重新点赞
    async function task1(token, posts) {
        let resps = [], index = 0;
        while (index < posts.length) {
            const item = posts[index++];
            resps.push(await like(token, item.topic_id));
            await delay(config.network_delay);
            if (item.is_like) {
                item.is_like = false;
                index--;
            }
        }
        return resps;
    }
    // 分享
    async function task2(token, posts) {
        const topicId = posts[0].topic_id;
        const resp = await fetch(`${BASE_URL}/community/topic/share/${topicId}?id=${topicId}`, {
            headers: { Authorization: token, "Content-Type": "application/json" }
        });
        return await resp.json();
    }
    // 浏览
    async function task3(token, posts) {
        const resps = [];
        for(const item of posts) {
            const topicId = item.topic_id;
            const resp = await fetch(`${BASE_URL}/community/topic/${topicId}?id=${topicId}`, {
                headers: { Authorization: token, "Content-Type": "application/json" }
            });
            resps.push(await resp.json());
            await delay(config.network_delay);
        }
        return resps;
    }
    // 兑换物品；根据配置文件中的数据进行兑换；
    // 1->情报拼图，2->萨狄斯金，3->战场报告，4->解析图纸，5->基原信息核，此外，还有不定时加入的限定物品；
    // 每日都完成任务时，不会存在积分不足的问题。
    async function exchange(token, exchanged) {
        log(exchange.name);
        if (exchanged) {
            console.log('今日已兑换');
            return null;
        }
        const result = {};
        const [exchangeList, memberInfoResp] = await Promise.all([getExchangeList(token), getInfo(token)]);
        let score = (await memberInfoResp.json()).data.user.score;
        for (const item of exchangeList) {
            const id = item.exchange_id;
            while (score >= item.use_score && (item.exchange_count < item.max_exchange_count)) {
                const resp = await fetch(`${BASE_URL}/community/item/exchange`, {
                    method: 'post',
                    headers: { Authorization: token, "Content-Type": "application/json" },
                    body: JSON.stringify({ exchange_id: id })
                });
                item.exchange_count++;
                score -= item.use_score;
                result[id] = await resp.json();
                await delay(config.network_delay);
            }
        }
        Object.values(result).every(successful) && setKey(EXCHANGED);
        return result;
    }
    async function getPost(token) {
        const resp = await fetch(`${BASE_URL}/community/topic/list?sort_type=1&category_id=1&query_type=1&last_tid=0&pub_time=0&reply_time=0&hot_value=0`, {
            headers: { Authorization: token, "Content-Type": "application/json" },
        });
        const _resp = await resp.json();
        return _resp.data.list;
    }
    /**
     * 获取兑换列表
     * @param {String} token
     * @returns {Array}
     */
    async function getExchangeList(token) {
        const resp = await fetch(`${BASE_URL}/community/item/exchange_list`, {
            headers: { Authorization: token, "Content-Type": "application/json" },
        });
        return (await resp.json()).data.list;
    }
    /**
     * 过滤已点赞帖子
     * @param {*} list posts
     * @returns {Array}
     */
    function notLikeFilter(list) {
        return list.filter(item => !item.is_like);
    }
    async function getTask(token) {
        const resp = await (await fetch(`${BASE_URL}/community/task/get_current_task_list`, {
            headers: { Authorization: token, "Content-Type": "application/json" }
        })).json();
        return resp.data.daily_task;
    }
    function getKey(key) {
        for (const item of document.cookie.split(";").map(item => item.trim())) {
            if (item.startsWith(key)) {
                return item.split("=")[1];
            }
        }
        return "";
    }
    function setKey(key) {
        document.cookie = `${key}=1; max-age=${getExpiration()}; path=/;`;
        return 1;
    }
    // 执行每日任务
    async function performTask(token, performed) {
        log(performTask.name);
        if (performed) {
            console.log('今日已完成任务');
            return null;
        }
        const results = {};
        const tasks = await getTask(token);
        // 待执行任务列表；当key存在时表示需要执行
        const pending = {};
        for (const item of tasks) {
            if (item.complete_count < item.max_complete_count) {
                pending[item.task_name] = "1";
            }
        }
        if (!Object.keys(pending).length) {
            results[PERFORMED] = setKey(PERFORMED);
            console.log('今日已完成任务');
            return results;
        }
        const posts = await getPost(token);
        let filtered = notLikeFilter(posts);
        // 如果没有或少于符合条件的数据，则使用原始数据填充（但估计会很少遇到，毕竟是极端情况）
        if (filtered.length < 3) {
            filtered.push(...posts.slice(0, (3 - filtered.length)));
        }
        const _posts = filtered.slice(0, 3);
        pending[TASK_1] && (pending[TASK_1] = task1(token, _posts));
        pending[TASK_3] && (pending[TASK_3] = task3(token, _posts));
        pending[TASK_2] && (pending[TASK_2] = task2(token, _posts));
        const [a=null, b=null, c=null] = await Promise.all(Object.values(pending));
        results[TASK_1] = a;
        results[TASK_3] = b;
        results[TASK_2] = c;
        [...a, ...b, c].every(successful) && setKey(PERFORMED);
        return results;
    }
    // 更新节点(签到成功后)；pc貌似有点问题，即使刷新页面，文字也依旧不变；
    function updateNodeForSigning() {
        const selector = location.pathname.startsWith("/m") ? '.nav_con div:first-child' : '.btns .btn';
        const node = document.querySelector(selector) || { failed: true };
        if (node.failed) {
            log("未获取到: " + selector);
            return;
        }
        const [img, a, b] = [...node.children];
        if (img.src !== SIGNED_IMG) {
            img.src = SIGNED_IMG;
            a.innerText = "已签到";
            b.remove();
        }
    }
    async function runner(token, states) {
        const resp2signIn = await signIn(token, states[SIGNED]);
        if (resp2signIn) {
            console.log(resp2signIn);
            resp2signIn[SIGNED] && updateNodeForSigning();
        }
        const resp2performTask = await performTask(token, states[PERFORMED]);
        resp2performTask && console.log(resp2performTask);
        const resp2exchange = await exchange(token, states[EXCHANGED]);
        resp2exchange && console.log(resp2exchange);
    }
    // (md5)加密
    function encrypt(input) {
        return ke(input);
    }
    async function getInfo(token) {
        return await fetch(`${BASE_URL}/community/member/info`, {
            method: 'post',
            headers: { Authorization: token, "Content-Type": "application/json" },
            body: "{}"
        });
    }
    // 获取用户信息(其实是用于检查令牌是否有效)；
    // 测试发现，只要令牌未过期，都可获取到数据，即可存在多个令牌（服务器不记录状态）；
    // 当response.status为401时，表示令牌过期；
    // 更新判断方式；
    async function checkToken(token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return (payload.exp - (Date.now() / 1000)) > config.threshold;
    }
    function saveToken(token) {
        localStorage.setItem('key', token);
    }
    function log(msg, level='log') {
        console[level](`[${new Date().toLocaleString()} ${msg}]`);
    }
    function errorHandler(ev) {
        log(`${SCRIPT_NAME}执行出现错误：`, 'error');
        console.error(ev);
        console.warn("若未完成兑换时，请手动处理.");
        notice3(config);
    }
    function removeNotification(node, delay) {
        return new Promise(resolve => {
            setTimeout(() => {
                node.style.top = "-199px";
                setTimeout(() => {
                    node.remove();
                    resolve();
                }, 50);
            }, delay);
        })
    }
    async function notice(message, duration, _delay=50) {
        _node && await removeNotification(_node, 1000);
        const node = document.createElement("div");
        _node = node;
        const head = document.querySelector('.head') || { clientHeight: 60, failed: true };
        node.style = `${NOTIFICATION_STYLE}${location.pathname.startsWith("/m") ? NOTIFICATION_STYLE_FOR_PHONE : NOTIFICATION_STYLE_FOR_PC}top: -${head.clientHeight}px; height: ${head.clientHeight}px;`;
        node.innerText = message;
        if (head.failed) {
            log("未获取到: .head");
            node.style.position = "fixed";
            document.body.appendChild(node);
        }
        else {
            head.appendChild(node);
        }
        let callback;
        if (duration > 0) {
            callback = () => {
                node.style.top = "0";
                removeNotification(node, duration);
                _node = null;
            };
        }
        else {
            callback = () => {
                node.style.top = "0";
            };
        }
        setTimeout(callback, _delay)
    }
    function notice1(config) {
        if (+config.notification) {
            notice(`脚本执行完成.`, 3000);
        }
    }
    function notice2(config) {
        if (+config.notification) {
            notice(`脚本执行中...`, -1, 100);
        }
    }
    function notice3(config) {
        if (+config.notification) {
            notice(`脚本执行出现错误.`, 3000);
        }
    }
    // -----------------加密相关(无需理会)-----------------
    function Ht(t) {
        for (var e = 0; e < t; e++)
            this[e] = 0;
        this.length = t
    }
    function Dt(t) {
        return t % 4294967296
    }
    function Bt(t, e) {
        return t = Dt(t),
        e = Dt(e),
        t - 2147483648 >= 0 ? (t %= 2147483648,
        t >>= e,
        t += 1073741824 >> e - 1) : t >>= e,
        t
    }
    function Nt(t) {
        return t %= 2147483648,
        !0 & t ? (t -= 1073741824,
        t *= 2,
        t += 2147483648) : t *= 2,
        t
    }
    function Et(t, e) {
        t = Dt(t),
        e = Dt(e);
        for (var s = 0; s < e; s++)
            t = Nt(t);
        return t
    }
    function Mt(t, e) {
        t = Dt(t),
        e = Dt(e);
        var s = t - 2147483648
          , i = e - 2147483648;
        return s >= 0 ? i >= 0 ? 2147483648 + (s & i) : s & e : i >= 0 ? t & i : t & e
    }
    function Pt(t, e) {
        t = Dt(t),
        e = Dt(e);
        var s = t - 2147483648
          , i = e - 2147483648;
        return s >= 0 ? i >= 0 ? 2147483648 + (s | i) : 2147483648 + (s | e) : i >= 0 ? 2147483648 + (t | i) : t | e
    }
    function Zt(t, e) {
        t = Dt(t),
        e = Dt(e);
        var s = t - 2147483648
          , i = e - 2147483648;
        return s >= 0 ? i >= 0 ? s ^ i : 2147483648 + (s ^ e) : i >= 0 ? 2147483648 + (t ^ i) : t ^ e
    }
    function Rt(t) {
        return t = Dt(t),
        4294967295 - t
    }
    var Ut = new Ht(4)
      , Gt = new Ht(2);
    Gt[0] = 0,
    Gt[1] = 0;
    var Ft = new Ht(64)
      , Vt = new Ht(16)
      , qt = new Ht(16)
      , Kt = 7
      , Qt = 12
      , Xt = 17
      , Yt = 22
      , Jt = 5
      , Wt = 9
      , $t = 14
      , te = 20
      , ee = 4
      , se = 11
      , ie = 16
      , ne = 23
      , ae = 6
      , oe = 10
      , ce = 15
      , le = 21;
    function re(t, e, s) {
        return Pt(Mt(t, e), Mt(Rt(t), s))
    }
    function ge(t, e, s) {
        return Pt(Mt(t, s), Mt(e, Rt(s)))
    }
    function ue(t, e, s) {
        return Zt(Zt(t, e), s)
    }
    function he(t, e, s) {
        return Zt(e, Pt(t, Rt(s)))
    }
    function me(t, e) {
        return Pt(Et(t, e), Bt(t, 32 - e))
    }
    function de(t, e, s, i, n, a, o) {
        return t = t + re(e, s, i) + n + o,
        t = me(t, a),
        t += e,
        t
    }
    function Ae(t, e, s, i, n, a, o) {
        return t = t + ge(e, s, i) + n + o,
        t = me(t, a),
        t += e,
        t
    }
    function _e(t, e, s, i, n, a, o) {
        return t = t + ue(e, s, i) + n + o,
        t = me(t, a),
        t += e,
        t
    }
    function fe(t, e, s, i, n, a, o) {
        return t = t + he(e, s, i) + n + o,
        t = me(t, a),
        t += e,
        t
    }
    function pe(t, e) {
        var s = 0
          , i = 0
          , n = 0
          , a = 0
          , o = Vt;
        s = Ut[0],
        i = Ut[1],
        n = Ut[2],
        a = Ut[3];
        for (var c = 0; c < 16; c++) {
            o[c] = Mt(t[4 * c + e], 255);
            for (var l = 1; l < 4; l++)
                o[c] += Et(Mt(t[4 * c + l + e], 255), 8 * l)
        }
        s = de(s, i, n, a, o[0], Kt, 3614090360),
        a = de(a, s, i, n, o[1], Qt, 3905402710),
        n = de(n, a, s, i, o[2], Xt, 606105819),
        i = de(i, n, a, s, o[3], Yt, 3250441966),
        s = de(s, i, n, a, o[4], Kt, 4118548399),
        a = de(a, s, i, n, o[5], Qt, 1200080426),
        n = de(n, a, s, i, o[6], Xt, 2821735955),
        i = de(i, n, a, s, o[7], Yt, 4249261313),
        s = de(s, i, n, a, o[8], Kt, 1770035416),
        a = de(a, s, i, n, o[9], Qt, 2336552879),
        n = de(n, a, s, i, o[10], Xt, 4294925233),
        i = de(i, n, a, s, o[11], Yt, 2304563134),
        s = de(s, i, n, a, o[12], Kt, 1804603682),
        a = de(a, s, i, n, o[13], Qt, 4254626195),
        n = de(n, a, s, i, o[14], Xt, 2792965006),
        i = de(i, n, a, s, o[15], Yt, 1236535329),
        s = Ae(s, i, n, a, o[1], Jt, 4129170786),
        a = Ae(a, s, i, n, o[6], Wt, 3225465664),
        n = Ae(n, a, s, i, o[11], $t, 643717713),
        i = Ae(i, n, a, s, o[0], te, 3921069994),
        s = Ae(s, i, n, a, o[5], Jt, 3593408605),
        a = Ae(a, s, i, n, o[10], Wt, 38016083),
        n = Ae(n, a, s, i, o[15], $t, 3634488961),
        i = Ae(i, n, a, s, o[4], te, 3889429448),
        s = Ae(s, i, n, a, o[9], Jt, 568446438),
        a = Ae(a, s, i, n, o[14], Wt, 3275163606),
        n = Ae(n, a, s, i, o[3], $t, 4107603335),
        i = Ae(i, n, a, s, o[8], te, 1163531501),
        s = Ae(s, i, n, a, o[13], Jt, 2850285829),
        a = Ae(a, s, i, n, o[2], Wt, 4243563512),
        n = Ae(n, a, s, i, o[7], $t, 1735328473),
        i = Ae(i, n, a, s, o[12], te, 2368359562),
        s = _e(s, i, n, a, o[5], ee, 4294588738),
        a = _e(a, s, i, n, o[8], se, 2272392833),
        n = _e(n, a, s, i, o[11], ie, 1839030562),
        i = _e(i, n, a, s, o[14], ne, 4259657740),
        s = _e(s, i, n, a, o[1], ee, 2763975236),
        a = _e(a, s, i, n, o[4], se, 1272893353),
        n = _e(n, a, s, i, o[7], ie, 4139469664),
        i = _e(i, n, a, s, o[10], ne, 3200236656),
        s = _e(s, i, n, a, o[13], ee, 681279174),
        a = _e(a, s, i, n, o[0], se, 3936430074),
        n = _e(n, a, s, i, o[3], ie, 3572445317),
        i = _e(i, n, a, s, o[6], ne, 76029189),
        s = _e(s, i, n, a, o[9], ee, 3654602809),
        a = _e(a, s, i, n, o[12], se, 3873151461),
        n = _e(n, a, s, i, o[15], ie, 530742520),
        i = _e(i, n, a, s, o[2], ne, 3299628645),
        s = fe(s, i, n, a, o[0], ae, 4096336452),
        a = fe(a, s, i, n, o[7], oe, 1126891415),
        n = fe(n, a, s, i, o[14], ce, 2878612391),
        i = fe(i, n, a, s, o[5], le, 4237533241),
        s = fe(s, i, n, a, o[12], ae, 1700485571),
        a = fe(a, s, i, n, o[3], oe, 2399980690),
        n = fe(n, a, s, i, o[10], ce, 4293915773),
        i = fe(i, n, a, s, o[1], le, 2240044497),
        s = fe(s, i, n, a, o[8], ae, 1873313359),
        a = fe(a, s, i, n, o[15], oe, 4264355552),
        n = fe(n, a, s, i, o[6], ce, 2734768916),
        i = fe(i, n, a, s, o[13], le, 1309151649),
        s = fe(s, i, n, a, o[4], ae, 4149444226),
        a = fe(a, s, i, n, o[11], oe, 3174756917),
        n = fe(n, a, s, i, o[2], ce, 718787259),
        i = fe(i, n, a, s, o[9], le, 3951481745),
        Ut[0] += s,
        Ut[1] += i,
        Ut[2] += n,
        Ut[3] += a
    }
    function ve() {
        Gt[0] = Gt[1] = 0,
        Ut[0] = 1732584193,
        Ut[1] = 4023233417,
        Ut[2] = 2562383102,
        Ut[3] = 271733878;
        for (var t = 0; t < qt.length; t++)
            qt[t] = 0
    }
    function ze(t) {
        var e;
        e = Mt(Bt(Gt[0], 3), 63),
        Gt[0] < 4294967288 || (Gt[1]++,
        Gt[0] -= 4294967296),
        Gt[0] += 8,
        Ft[e] = Mt(t, 255),
        e >= 63 && pe(Ft, 0)
    }
    function ye() {
        var t, e = new Ht(8), s = 0, i = 0, n = 0;
        for (s = 0; s < 4; s++)
            e[s] = Mt(Bt(Gt[0], 8 * s), 255);
        for (s = 0; s < 4; s++)
            e[s + 4] = Mt(Bt(Gt[1], 8 * s), 255);
        i = Mt(Bt(Gt[0], 3), 63),
        n = i < 56 ? 56 - i : 120 - i,
        t = new Ht(64),
        t[0] = 128;
        for (s = 0; s < n; s++)
            ze(t[s]);
        for (s = 0; s < 8; s++)
            ze(e[s]);
        for (s = 0; s < 4; s++)
            for (var a = 0; a < 4; a++)
                qt[4 * s + a] = Mt(Bt(Ut[s], 8 * a), 255)
    }
    function be(t) {
        for (var e = "0123456789abcdef", s = "", i = t, n = 0; n < 8; n++)
            s = e.charAt(Math.abs(i) % 16) + s,
            i = Math.floor(i / 16);
        return s
    }
    var Te = "01234567890123456789012345678901 !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
    const ke = function(t) {
        var e, s, i, n, a, o;
        ve();
        for (var c = 0; c < t.length; c++)
            e = t.charAt(c),
            ze(Te.lastIndexOf(e));
        ye(),
        i = n = a = o = 0;
        for (var l = 0; l < 4; l++)
            i += Et(qt[15 - l], 8 * l);
        for (l = 4; l < 8; l++)
            n += Et(qt[15 - l], 8 * (l - 4));
        for (l = 8; l < 12; l++)
            a += Et(qt[15 - l], 8 * (l - 8));
        for (l = 12; l < 16; l++)
            o += Et(qt[15 - l], 8 * (l - 12));
        return s = be(o) + be(a) + be(n) + be(i),
        s
    };
    // ----------------------------------
    function getToken() {
        return localStorage.getItem('key') || "";
    }
    function clearToken() {
        return localStorage.removeItem('key');
    }
    // 等待登录；
    // 通过监听url的变化，当检测到从/login、/loading路径跳转时，尝试获取令牌进行判断（不提供账号密码时才会调用该方法）
    function waitingForLogin() {
        log(waitingForLogin.name, 'warn');
        let previous = location.href;
        const handler = (ev) => {
            if (previous === ev.url) {
                return;
            }
            if (previous.endsWith('login') || previous.includes('/loading')) {
                const token = getToken();
                if (token) {
                    log(`检测到已经登录，开始执行${SCRIPT_NAME}...`);
                    notice2(config);
                    runner(token, {})
                        .then(() => {
                            log(`${SCRIPT_NAME}执行完成.`);
                            notice1(config);
                            window.removeEventListener('urlchange', handler);
                        })
                        .catch(errorHandler);
                }
            }
            previous = ev.url;
        };
        window.addEventListener('urlchange', handler);
    }
    window.addEventListener('error', errorHandler);
    if (location.pathname.includes("/loading") && location.search.includes("token=")) {
        console.warn(`等待登录完成...`);
        waitingForLogin();
    }
    setTimeout(() => {
        let token;
        // 令牌不存在或过期时，进行登录；但若不提供配置时，则由用户自己进行
        if ((token = getToken())) {
            notice2(config);
            checkToken(token)
                .then(async valid => {
                    if (!valid) {
                        // 移除过期令牌
                        clearToken();
                        if (configPathNotEmpty) {
                            token = await login(config.account, config.password);
                            saveToken(token);
                        }
                        else {
                            notice('请重新登录.', 3000);
                            // log(`${SCRIPT_NAME}执行完成.`);
                            console.warn(`令牌已过期，等待重新登录...`);
                            waitingForLogin();
                            return;
                        }
                    }
                    await runner(token, states);
                    log(`${SCRIPT_NAME}执行完成.`);
                    notice1(config);
                })
                .catch(errorHandler);
        }
        else if (configPathNotEmpty) {
            notice2(config);
            login(config.account, config.password)
                .then(async token => {
                    saveToken(token);
                    await runner(token, states);
                    log(`${SCRIPT_NAME}执行完成.`);
                    notice1(config);
                })
                .catch(errorHandler);
        }
        else {
            log(`由于令牌已过期，且未提供配置文件，或当前为移动端环境，本次未执行任何有效动作.`, 'warn');
            console.warn(`尝试等待登录...`);
            waitingForLogin();
        }
    }, 1000);
})();