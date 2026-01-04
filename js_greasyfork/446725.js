// ==UserScript==
// @name            B站直播间定时发随机弹幕
// @namespace       https://live.bilibili.com/暂无主页
// @home            https://github.com/Gamyou/bilibili-live-random-send
// @update          https://greasyfork.org/scripts/446725-b%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%AE%9A%E6%97%B6%E5%8F%91%E9%9A%8F%E6%9C%BA%E5%BC%B9%E5%B9%95/code/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%AE%9A%E6%97%B6%E5%8F%91%E9%9A%8F%E6%9C%BA%E5%BC%B9%E5%B9%95.user.js
// @download        https://greasyfork.org/scripts/446725-b%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%AE%9A%E6%97%B6%E5%8F%91%E9%9A%8F%E6%9C%BA%E5%BC%B9%E5%B9%95/code/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%AE%9A%E6%97%B6%E5%8F%91%E9%9A%8F%E6%9C%BA%E5%BC%B9%E5%B9%95.user.js
// @version         2.5.0
// @description     定时发送；凌晨打卡；设置随机弹幕；弹幕分组管理；各直播间弹幕互不干扰；无人值守参与、关闭天选时刻；直播间防休眠；隐藏模块简化直播间
// @author          Gamyou
// @match           *://live.bilibili.com/*
// @icon            https://www.bilibili.com/favicon.ico
// @license         Apache License, Version 2.0
// @run-at          document-idle
// @grant           GM_info
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @grant           GM_notification
// @grant           GM_openInTab
// @grant           GM_xmlhttpRequest
// @connect         jsdelivr.net
// @connect         greasyfork.org
// @note            24-09-10 2.5.0      处理缓存长时间不失效导致加载不了新版本的问题
// @downloadURL https://update.greasyfork.org/scripts/446725/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%AE%9A%E6%97%B6%E5%8F%91%E9%9A%8F%E6%9C%BA%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/446725/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%AE%9A%E6%97%B6%E5%8F%91%E9%9A%8F%E6%9C%BA%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==


window.onload = (function () {
    const local = {
            "id": "RandomSendHelper",
            "text": "打卡",
            "default": "danmu",
            "config": "config"
        },
        infoUrl = "https://update.greasyfork.org/scripts/448354/RandomSendBaseInfo.js",
        frameUrl = 'https://greasyfork.org/zh-CN/scripts/446725',
        isNull = str => {
            if (!str || str == "") {
                return true;
            }

            let regu = "^[ ]+$";
            let re = new RegExp(regu);
            return re.test(str);
        },
        delValue = key => GM_deleteValue(key),
        getValue = (key, defaultVaue) => {
            return GM_getValue(key, defaultVaue);
        },
        setValue = (key, obj) => {
            if (isNull(key)) { console.warn('key为空，保存失败'); return; }
            if (obj) { GM_setValue(key, obj); }
        },
        notice = (msg) => {
            if (isNull(msg)) { GM_notification(msg); }
            else { console.warn('消息对象为空，无效通知'); }
        },
        compareVersion = (v1, v2) => {
            if (isNull(v1)) return -1;
            if (isNull(v2)) return 1;

            const a1 = v1.split('.').map(x => x * 1),
                a2 = v2.split('.').map(x => x * 1),
                len = Math.max(a1.length, a2.length);
            for (let i = 0; i < len; i++) {
                if ((a1[i] || 0) > (a2[i] || 0)) return 1;
                if ((a1[i] || 0) < (a2[i] || 0)) return -1;
            }

            return 0;
        },
        getVersion = txt => {
            let m = txt.match(/@version\s+\d+\.\d+\.\d+/i);
            if (!m || 1 > m.length || !m[0]) {
                return 0;
            }

            let n = m[0].match(/\d+\.\d+\.\d+/);
            if (!n || 1 > n.length || !n[0]) {
                return 0;
            }

            return n[0];
        },
        getInfo = count => {
            count = count || 0;
            if (1 < count) {
                create();
            }
            if (8 > count) {
                const d = {
                    "url": infoUrl,
                    "method": "GET",
                    "nocache": true,
                    "timeout": 15e3,
                    "responseType": "json",
                    "ontimeout": t => {
                        console.log(`===> 获取信息超时【${t}】`);
                        getInfo(++count);
                    },
                    "onerror": e => {
                        console.log(`===> 获取信息出错【${e}】`);
                        getInfo(++count);
                    },
                    "onload": r => {
                        if (!r || !r.response) {
                            console.log(`===> 获取信息为空，进行重试`);
                            getInfo(++count);
                            return;
                        }

                        let info = {...r.response, ...local};
                        info.url = (info.url || "").replace("@latest/", `@${info.version || "latest"}/`);
                        if (0 < compareVersion(info.frame, GM_info?.script?.version)) {
                            alert(`定时发随机弹幕版本过低，请及时升级`);
                            GM_openInTab(frameUrl, {active: true});
                            return;
                        }

                        updateScript(info);
                    }
                };
                GM_xmlhttpRequest(d);
            }
        },
        updateScript = (info, count) => {
            count = count || 0;
            let c = getValue((info.config || local.config), {});
            if (!isNull(c.moduleVersion) && 0 == compareVersion(c.moduleVersion, info.version)) {
                create(info, c.script);
                return;
            }
            if (1 < count) {
                create(info, c.script);
            }
            if (!isNull(info.url) && 6 > count) {
                const d = {
                    "url": info.url,
                    "method": "GET",
                    "nocache": true,
                    "timeout": 20e3,
                    "ontimeout": t => {
                        console.log(`===> 获取脚本超时【${t}】`);
                        updateScript(info, ++count);
                    },
                    "onerror": e => {
                        console.log(`===> 获取脚本出错【${e}】`);
                        updateScript(info, ++count);
                    },
                    "onload": r => {
                        if (!r || !r.responseText) {
                            console.log(`===> 获取脚本为空，进行重试`);
                            updateScript(info, ++count);
                            return;
                        }

                        create(info, r.responseText);
                        c.script = r.responseText;
                        c.moduleVersion = info.version;
                        c.lastUpdate = new Date().toLocaleString();
                        setValue(info.config, c);
                        checkVersion();
                    }
                };
                GM_xmlhttpRequest(d);
            }
        },
        create = (info, txt) => {
            if (!info) info = local;
            let script = document.getElementById(info.id);
            if (!script) {
                if (isNull(txt)) {
                    let config = getValue((info.config), null);
                    if (!config || !config.script) {
                        return;
                    }

                    txt = config.script;
                }

                script = document.createElement('script');
                script.id = info.id;
                script.type = 'text/javascript';
                script.text = txt;
                document.head.appendChild(script);
                init(info);
            }
        },
        init = info => {
            setGmNotice(notice);
            setGmGetValue(getValue);
            setGmSetValue(setValue);
            setGmDelValue(delValue);
            setBaseInfo(info);
            runStart();
        };

    getInfo();
})();