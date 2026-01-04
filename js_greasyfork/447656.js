// ==UserScript==
// @name         MoegirlPediaDamagedScriptReloader
// @version      1.1.4.5.1.4
// @description  萌娘百科损坏 Script 重新加载器
// @author       AnnAngela
// @namespace    https://zh.moegirl.org.cn/User:AnnAngela
// @mainpage     https://greasyfork.org/scripts/447656-moegirlpediadamagedscriptreloader
// @supportURL   https://greasyfork.org/scripts/447656-moegirlpediadamagedscriptreloader/feedback
// @license      GNU General Public License v3.0 or later
// @compatible   chrome 100
// @compatible   edge 100
// @match        *://*.moegirl.org.cn/*
// @run-at       document-start
// @grant        GM_info
// @icon         https://public.annangela.cn/MoegirlPedia/InterfaceAdmin.png
// @icon64       https://public.annangela.cn/MoegirlPedia/InterfaceAdmin.png
// @downloadURL https://update.greasyfork.org/scripts/447656/MoegirlPediaDamagedScriptReloader.user.js
// @updateURL https://update.greasyfork.org/scripts/447656/MoegirlPediaDamagedScriptReloader.meta.js
// ==/UserScript==
"use strict";
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const inpageNotificationRoot = document.createElement("div");
class InPageNotification {
    static setStyle(ele, styleJson) {
        for (const [k, v] of Object.entries(styleJson)) {
            ele.style[k] = v;
        }
    }
    constructor() {
        this.doms = {
            container: document.createElement("div"),
            logo: document.createElement("img"),
            content: document.createElement("div"),
        };
        InPageNotification.setStyle(this.doms.container, {
            padding: "0.75em 1.5em 0.75em 0",
            marginBottom: "0.5em",
            border: "1px solid #a2a9b1",
            cursor: "pointer",
            opacity: "0",
            transition: "opacity 0.35s ease-in-out",
            backgroundColor: "white",
            borderRadius: "2px",
            boxShadow: "0 2px 2px 0 rgba(0,0,0,0.25)",
            pointerEvents: "none",
            display: "flex",
        });
        InPageNotification.setStyle(this.doms.logo, {
            flex: "0",
            height: "64px",
            margin: "0 0.75em",
        });
        InPageNotification.setStyle(this.doms.content, {
            flex: "1",
            minHeight: "64px",
        });
        this.doms.logo.src = GM_info.script.icon64;
        inpageNotificationRoot.append(this.doms.container);
        this.doms.container.append(this.doms.logo);
        this.doms.container.append(this.doms.content);
    }
    setContent(html) {
        this.doms.content.innerHTML = html;
    }
    show() {
        InPageNotification.setStyle(this.doms.container, {
            opacity: "1",
            pointerEvents: "all",
        });
    }
    hide() {
        InPageNotification.setStyle(this.doms.container, {
            opacity: "0",
            pointerEvents: "none",
        });
    }
    hideAndDestroy() {
        this.hide();
        setTimeout(() => {
            this.doms.container.remove();
        }, 350);
    }
}
InPageNotification.setStyle(inpageNotificationRoot, {
    position: "fixed",
    top: "7em",
    right: "1em",
    width: "23em",
    lineHeight: "1.35",
    zIndex: "100000",
    overflow: "hidden",
});
(async () => {
    console.info("MoegirlPediaDamagedScriptReloader", "start");
    while (!document.body || typeof unsafeWindow?.jQuery?.fn?.on !== "function") {
        await sleep(16);
    }
    console.info("MoegirlPediaDamagedScriptReloader", "loaded");
    document.body.append(inpageNotificationRoot);
    let c = 0;
    $(document).on("ajaxError", async (_, xhr, config) => {
        // console.error("ajaxError", xhr, config);
        if (config.dataType === "script" && config.url?.includes("load.php?") && xhr.status === 404
            && !config.url?.endsWith?.("&AnnTools_retrying=1")) {
            const inpageNotification = new InPageNotification();
            const url = `${config.url}&AnnTools_retrying=1`;
            let i = 0;
            c++;
            while (i++ > Number.MIN_SAFE_INTEGER) {
                inpageNotification.setContent(`<b>萌娘百科损坏 Script 重新加载器</b><div>发现第 ${c} 个损坏的 Script，正在尝试第 ${i} 次重新加载……</div>`);
                inpageNotification.show();
                console.info("MoegirlPediaDamagedScriptReloader", "Retrying at #", i, "for loading script #", c, url);
                try {
                    await $.ajax({
                        url,
                        dataType: "script",
                        crossDomain: true,
                        cache: true,
                    });
                    console.info("MoegirlPediaDamagedScriptReloader", "Successfully retried at #", i, "for loading script #", c, url);
                    inpageNotification.setContent(`<b>萌娘百科损坏 Script 重新加载器</b><div>第 ${c} 个损坏的 Script，在第 ${i} 次重新加载后成功载入！</div>`);
                    setTimeout(() => {
                        inpageNotification.hideAndDestroy();
                    }, 5000);
                    break;
                } catch (e) {
                    console.error(e);
                }
            }
        }
    });
})();