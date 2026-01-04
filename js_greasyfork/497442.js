// ==UserScript==
// @name         [Bilibili] 自动切P
// @namespace    ckylin-bilibili-auto-next-part
// @version      0.1
// @description  自动在多P分集中切换下一P或跳过进度
// @author       CKylinMC
// @match        https://*.bilibili.com/video/av*
// @match        https://*.bilibili.com/video/BV*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @require      https://greasyfork.org/scripts/429720-cktools/code/CKTools.js?version=1023553
// @grant        unsafeWindow
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497442/%5BBilibili%5D%20%E8%87%AA%E5%8A%A8%E5%88%87P.user.js
// @updateURL https://update.greasyfork.org/scripts/497442/%5BBilibili%5D%20%E8%87%AA%E5%8A%A8%E5%88%87P.meta.js
// ==/UserScript==

(function () {
    'use strict';
    class Logger {
        constructor(prefix = '[logUtil]') {
            this.prefix = prefix;
        }
        log(...args) {
            console.log(this.prefix, ...args);
        }
        info(...args) {
            console.info(this.prefix, ...args);
        }
        warn(...args) {
            console.warn(this.prefix, ...args);
        }
        error(...args) {
            console.error(this.prefix, ...args);
        }
    }
    const logger = new Logger("[AUTOP]");
    if (CKTools.ver < 1.2) {
        logger.warn("Library script 'CKTools' was loaded incompatible version " + CKTools.ver + ", so that SNI may couldn't work correctly. Please consider update your scripts.");
    }
    const { get, getAll, domHelper, wait, waitForDom, waitForPageVisible, addStyle, modal, bili } = CKTools;

    const getVideoID = () => {
        let id = new URL(location.href).pathname.replace('/video/', '')
        if (id.endsWith('/')) {
            id = id.substring(0, id.length - 2);
        }
        if (id.startsWith('av')) {
            return { type: 'aid', id };
        }
        if (id.startsWith('BV')) {
            return { type: 'bvid', id };
        }
        return { type: 'unknown', id };
    }
    const getCurrentTime = () => dataStore.vid?.currentTime??-1;
    const getCurrentPart = () => {
        let part = new URL(location.href).searchParams.get('p');
        if (!part) part = '1';
        return +part;
    }
    async function playerReady() {
        let i = 150;
        while (--i > 0) {
            await wait(100);
            if (unsafeWindow.player?.isInitialized() ?? false) break;
        }
        if (i < 0) return false;
        await waitForPageVisible();
        while (1) {
            await wait(200);
            if (document.querySelector(".bilibili-player-video-control-wrap, .bpx-player-control-wrap")) return true;
        }
    }
    const dataStore = unsafeWindow.autonextpart = {
        p: 0,
        id: null,
        vid: null,
        config: {
            autoNextAt: -1,//>0 to enable
            partsDefined: [
                null,
                /* 1: *//*{
                    startsAt: -1,
                    endsAt: -1,
                    ignoreGlobal: false,
                    skip: [
                        {
                            from: -1,
                            to: -1
                        }
                    ]
                }*/
            ]
        },
        next: () => {
            unsafeWindow.dispatchEvent(new KeyboardEvent("keydown", {
                key: "]",
                keyCode: 221,
                code: "BracketRight",
                which: 221,
                shiftKey: false,
                ctrlKey: false,
                metaKey: false
            }));
        },
        hasNext: () => {

        }
    };

    function parseDesc(desc) {
        const rootRegex = /AP:=(GP!(?<GP>\d+)!GP;){0,1}(?<parts>.+)*=:AP/m;
        let rootResult = rootRegex.exec(desc);
        if (!rootRegex || !rootResult.groups) return false;

        const { GP, parts } = rootResult.groups;
        if (!isNaN(+GP)) dataStore.config.autoNextAt = +GP;

        if (parts.length) {
            let partsSplited = parts.split(';').filter(i => i.trim().length);
            for (let part of partsSplited) {
                let [partName, start, end, subs, ignoreGlobal] = part.split('!');
                let partId = +(partName.substring(1));
                if (isNaN(partId)) continue;
                let config = { startAt: -1, endsAt: -1, skip: [] };
                if (!isNaN(+start)) config.startAt = +start;
                if (!isNaN(+end)) config.endsAt = +end;
                let subsParts = subs.split("+").filter(i => i.trim().length);
                for (let sub of subsParts) try {
                    const [from, to] = JSON.parse(sub);
                    if (!isNaN(+from) && !isNaN(+to)) config.skip.push({ from, to });
                } catch (e) { continue; }
                if (ignoreGlobal) config.ignoreGlobal = true;
                logger.info("发现配置: 分P", partId, "设定", config);
                dataStore.config.partsDefined[+partId] = config;
            }
        }
        return true;
    }

    async function tryInject() {
        logger.log("注入开始");
        dataStore.vid = document.querySelector('.bpx-player-video-wrap>video');
        if (!dataStore.vid) {
            logger.error("未能找到播放器...");
            return false;
        }
        logger.info("已找到播放器：", dataStore.vid);
        dataStore.id = getVideoID();
        if (dataStore.id.type == "unknown") {
            logger.error("无法识别的视频ID：", dataStore.id.id);
            // return;
        } else {
            logger.log("视频ID", dataStore.id);
        }
        dataStore.p = getCurrentPart();
        if (isNaN(dataStore.p)) {
            logger.error("未知分P：", dataStore.p);
            return;
        } else {
            logger.log("视频分P", dataStore.p);
        }
        dataStore.vid.removeEventListener("timeupdate", onTimeUpdate);
        dataStore.vid.addEventListener("timeupdate", onTimeUpdate);
        logger.log("视频进度已hook");
        try {
            let desc = document.querySelector('.desc-info-text');
            if (!desc) throw "";
            let descTxt = desc.textContent;
            // let descTxt = `AP:=GP!5!GP;=:AP`;
            if (descTxt.includes("AP:=")) {
                let startIdx = descTxt.indexOf("AP:=");
                let endIdx = descTxt.indexOf("=:AP");
                if (startIdx === -1 || endIdx === -1) throw "";
                parseDesc(descTxt);
            } else throw "";
            unsafeWindow.player?.toast.create({text:"自动切P已启用"})
        } catch (e) {
            logger.log("没有在描述中发现信息", e);
        }
        logger.log("注入完成");
    }

    function onTimeUpdate(event) {
        let t = getCurrentTime();
        if (t == -1) return;
        if (dataStore.config.partsDefined[dataStore.p]) {
            let cfg = dataStore.config.partsDefined[dataStore.p];
            if (cfg.startsAt > -1 && t < cfg.startsAt) {
                if (unsafeWindow.player)
                    unsafeWindow.player.seek?.(cfg.startsAt);
                else if (dataStore.vid)
                    dataStore.vid.currentTime = cfg.startsAt;
                return;
            }
            if (cfg.endsAt > -1 && t >= cfg.endsAt) {
                if (unsafeWindow.player){
                    unsafeWindow.player.pause();
                    unsafeWindow.player.toast.create({text:"正在切换下一P"})
                }
                else if (dataStore.vid)
                    dataStore.vid.pause();
                dataStore.next();
                dataStore.p++;
                return;
            }
            //skip
        }
        if (dataStore.config.autoNextAt > -1 && t >= dataStore.config.autoNextAt) {
            if (unsafeWindow.player){
                unsafeWindow.player.pause();
                unsafeWindow.player.toast.create({text:"正在切换下一P"})
            }
            else if (dataStore.vid)
                dataStore.vid.pause();
            dataStore.next();
            dataStore.p++;
            
            return;
        }
    }

    function run() {
        logger.log("等待播放器...");
        playerReady().then(tryInject);
    }
    run();
})();