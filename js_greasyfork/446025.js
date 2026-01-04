/* eslint-disable require-atomic-updates */
// ==UserScript==
// @name         FF14 2023年女儿节应援计划批量领取
// @description  最终幻想14 2023年 -LITTLE SPARK- 女儿节企划再启 应援计划批量领取
// @namespace    AnnAngela
// @match        https://actff1.web.sdo.com/20230430_NEJ23/*
// @version      2023.2.8
// @license      GNU General Public License v3.0 or later
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @run-at       document-idle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/446025/FF14%202023%E5%B9%B4%E5%A5%B3%E5%84%BF%E8%8A%82%E5%BA%94%E6%8F%B4%E8%AE%A1%E5%88%92%E6%89%B9%E9%87%8F%E9%A2%86%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/446025/FF14%202023%E5%B9%B4%E5%A5%B3%E5%84%BF%E8%8A%82%E5%BA%94%E6%8F%B4%E8%AE%A1%E5%88%92%E6%89%B9%E9%87%8F%E9%A2%86%E5%8F%96.meta.js
// ==/UserScript==
"use strict";
(async () => {
    const win = unsafeWindow;
    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
    const getUUID = () => "xxxxxxxxxxxxxxxx".replace(/./g, () => (16 * Math.random() | 0).toString(16));
    const button = document.createElement("div");
    const styles = {
        height: "0.53rem",
        left: "0",
        top: "0.3rem",
        cursor: "not-allowed",
        transition: "all 0.3s ease 0s",
        display: "inline-block",
        position: "fixed",
        zIndex: "1",
        background: "rgb(120,84,167)",
        borderRadius: "0 .53rem .53rem 0",
        fontSize: "0.25rem",
        lineHeight: "1",
        padding: ".14rem .265rem 0 .1rem",
        boxSizing: "border-box",
        color: "rgb(255,253,225)",
        fontFamily: "宋体, sans-serif",
        fontWeight: "700",
    };
    for (const [k, v] of Object.entries(styles)) {
        button.style[k] = v;
    }
    document.body.append(button);
    button.innerText = "正在等待道具数据加载完成";
    const prefetchImage = (url) => {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = url;
        link.as = "image";
        link.crossOrigin = "anonymous";
        link.priority = "low";
        document.head.appendChild(link);
    };
    prefetchImage("https://static.web.sdo.com/jijiamobile/pic/ff14/20230616ladiesday/ff14_68913dc578ef46ea.png");
    while (!Reflect.has(win, "actConfig")) {
        await sleep(1000);
    }
    try {
        const baseStyle = {
            fontSize: "16px",
            lineHeight: "1",
            textAlign: "center",
            color: "white",
        };
        const voteAllStyle = {
            left: "2.55rem",
            minWidth: "1.5rem",
            textAlign: "center",
        };
        const splitNumber = (n) => `${n}`.split(/(?=(?:\d{4})+$)/).join("\u2009");
        button.innerText = "正在加载应援数据";
        const voteResponse = await fetch("https://actff1.web.sdo.com/20230430_NEJ23/Handler/Vote/GetAllVoteList.ashx", {
            body: null,
            method: "POST",
            mode: "cors",
            credentials: "include",
        });
        const voteData = await voteResponse.json();
        const votes = voteData.vVoteNpc;
        const totalVotes = votes.reduce((p, c) => p + c, 0);
        const indexMap = {
            0: 2,
            1: 0,
            2: 1,
        };
        const percentagesInText = votes.map((num) => +(num * 100 / totalVotes).toFixed(2));
        let sumOfPercentagesInText = percentagesInText.reduce((acc, percentage) => acc + percentage, 0);
        while (sumOfPercentagesInText !== 100) {
            for (const [index, percentageInText] of Object.entries(percentagesInText)) {
                percentagesInText[index] = +(percentageInText * 100 / sumOfPercentagesInText).toFixed(2);
            }
            sumOfPercentagesInText = percentagesInText.reduce((acc, percentage) => acc + percentage, 0);
        }
        const voteAllNum = document.querySelector(".pageChoose .stage_view .voteAllNum");
        for (const [k, v] of Object.entries(voteAllStyle)) {
            voteAllNum.style[k] = v;
        }
        voteAllNum.classList.add("voteShow");
        voteAllNum.dataset.percentageInText = `${+(totalVotes / (1.5 * 10 ** 6)).toFixed(2)}%`;
        voteAllNum.dataset.vote = `${splitNumber(totalVotes)} / 1.5亿`;
        voteAllNum.dataset.current = "vote";
        voteAllNum.innerText = voteAllNum.dataset.percentageInText;
        for (const [index, vote] of Object.entries(votes)) {
            const percentage = vote * 100 / totalVotes;
            const item = document.querySelector(`.npcline > .item.item${indexMap[index]}`);
            item.style.width = `${percentage}%`;
            item.classList.add("voteShow");
            item.dataset.percentageInText = `${percentagesInText[index]}%`;
            item.dataset.vote = splitNumber(vote);
            item.dataset.current = "vote";
            item.innerText = item.dataset.percentageInText;
            for (const [k, v] of Object.entries(baseStyle)) {
                item.style[k] = v;
            }
        }
        const stageView = document.querySelector(".pageChoose .stage_view");
        /**
         * @type {HTMLElement}
         */
        const newStageView = stageView.cloneNode(true);
        stageView.style.zIndex = "2";
        stageView.style.marginTop = "2.11rem";
        stageView.querySelector(".stageName").innerText = "百分比计";
        const newStageViewStyles = {
            zIndex: "1",
            transitionDuration: ".73s",
            transitionTimingFunction: "ease-out",
            transitionProperty: "opacity, margin-left",
            opacity: "1",
        };
        for (const [k, v] of Object.entries(newStageViewStyles)) {
            newStageView.style[k] = v;
        }
        for (const node of stageView.querySelectorAll(".voteShow[data-current='vote']")) {
            node.dataset.current = "percentageInText";
        }
        newStageView.querySelector(".stage_view > .icon").remove();
        const myVoteStyles = {
            backgroundColor: "#8F64B8",
            width: "2.05rem",
            height: ".4rem",
            top: ".7rem",
            left: "1.9rem",
        };
        const myVote = newStageView.querySelector(".myvote");
        for (const [k, v] of Object.entries(myVoteStyles)) {
            myVote.style[k] = v;
        }
        stageView.after(newStageView);
        /**
         * @type {HTMLElement[]}
         */
        const items = [...document.querySelectorAll(".voteShow[data-current]")];
        let lastOpacity = +getComputedStyle(stageView).opacity;
        setInterval(() => {
            for (const item of items) {
                if (item.dataset.current === "vote") {
                    if (item.innerText !== item.dataset.vote) {
                        item.innerText = item.dataset.vote;
                    }
                } else {
                    if (item.innerText !== item.dataset.percentageInText) {
                        item.innerText = item.dataset.percentageInText;
                    }
                }
            }
            const stageViewOpacity = +getComputedStyle(stageView).opacity;
            newStageView.style.opacity = stageViewOpacity > 0 && stageViewOpacity >= lastOpacity ? "1" : "0";
            newStageView.style.marginLeft = stageViewOpacity > 0 && stageViewOpacity >= lastOpacity ? "0" : "200px";
            lastOpacity = stageViewOpacity;
        }, 100);
    } catch (e) { console.error(e); }
    button.innerText = "正在加载可批量领取道具";
    let stage = 0;
    const availableExps = {
        0: [],
        29: [],
        88: [],
    };
    let isPay29 = false, isPay88 = false;
    let targetExp = 0;
    try {
        const response = await (await fetch("https://actff1.web.sdo.com/20230430_NEJ23/Handler/Item/GetMyItemStatus.ashx", {
            headers: {
                "x-requested-with": "XMLHttpRequest",
            },
            body: null,
            method: "POST",
            mode: "cors",
            credentials: "include",
        })).json();
        const { result, vItemStatus, IsPay29, IsPay88, myExp } = response;
        if (result !== "1") {
            throw response;
        }
        console.info("[stage=1] response:", response);
        isPay29 = !!IsPay29;
        isPay88 = !!IsPay88;
        targetExp = myExp;
        for (let i = 0; i < vItemStatus.length; i++) {
            const item = vItemStatus[i];
            if (item.Status === 0) {
                availableExps[item.ItemLevel].push(item.Exp);
            }
        }
        stage = 1;
    } catch (e) {
        console.error("[stage=1]", e);
        button.innerText = "加载可批量领取道具失败（请检查是否登录）";
    }
    if (stage < 1) {
        return;
    }
    const availableItems = {
        0: [],
        29: [],
        88: [],
    };
    const needPurchaseItems = {
        29: [],
        88: [],
    };
    for (const { exp, nq, ncode, hq, hcode, bq, bcode } of win.actConfig.passRet) {
        if (availableExps[0].includes(exp) && /^\d{4,}$/.test(ncode)) {
            availableItems[0].push({ type: "n", name: nq, code: ncode, exp });
        }
        if (availableExps[29].includes(exp) && /^\d{4,}$/.test(hcode)) {
            availableItems[29].push({ type: "h", name: hq, code: hcode, exp });
        }
        if (availableExps[88].includes(exp) && /^\d{4,}$/.test(bcode)) {
            availableItems[88].push({ type: "b", name: bq, code: bcode, exp });
        }
        if (!isPay29 && !!hcode && exp <= targetExp) {
            needPurchaseItems[29].push({ type: "h", name: hq, code: hcode, exp });
        }
        if (!isPay88 && !!bcode && exp <= targetExp) {
            needPurchaseItems[88].push({ type: "b", name: bq, code: bcode, exp });
        }
    }
    const availableItemsCount = Object.values(availableItems).reduce((p, { length }) => p + length, 0);
    const needPurchaseItemsCount = Object.values(needPurchaseItems).reduce((p, { length }) => p + length, 0);
    if (availableItemsCount + needPurchaseItemsCount === 0) {
        button.innerText = "暂无可批量领取道具（优惠券和自选等请手动领取）";
        return;
    }
    button.style.cursor = "pointer";
    button.innerText = `有${availableItemsCount}个可批量领取道具，点击查看详情`;
    button.addEventListener("click", async () => {
        if (button.style.cursor !== "pointer") {
            return;
        }
        for (const [targetType, targetLevel, targetTypeName] of [
            ["n", 0, "普通"],
            ["h", 29, "黄金"],
            ["b", 88, "白金"],
        ]) {
            const availableItemsForTargetType = availableItems[targetLevel].filter(({ type }) => type === targetType);
            if (targetType === "h" && !isPay29 || targetType === "b" && !isPay88) {
                alert(`您尚未购买${targetTypeName}版偶像应援徽章，${needPurchaseItems[targetLevel].length > 0 ? `无法领取对应${needPurchaseItems[targetLevel].length}个道具` : "当前暂无符合条件对应道具"}。`);
                continue;
            }
            if (availableItemsForTargetType.length === 0) {
                alert(`当前版本：${targetTypeName}\n可领取道具：（无）`);
                continue;
            }
            alert(`当前版本：${targetTypeName}\n可领取道具：${availableItemsForTargetType.map(({ name, exp }) => `[${exp / 100}级] ${name}`).join("、")}`);
            if (!confirm(`您是否批量领取${targetTypeName}版所有可领取道具？\n点击【取消】可取消操作。`) || !confirm(`您真的要批量领取${targetTypeName}版所有可领取道具？\n点击【取消】可取消操作，批量领取流程可在左侧按钮查看。`)) {
                continue;
            }
            button.style.cursor = "not-allowed";
            const success = [], failed = [];
            for (let i = 0; i < availableItemsForTargetType.length; i++) {
                button.innerText = `正在批量领取${targetTypeName}版所有可领取道具：${i}/${availableItemsForTargetType.length}`;
                if (i !== 0) {
                    await sleep(2000);
                }
                const availableItem = availableItemsForTargetType[i];
                try {
                    const response = await (await fetch("https://actff1.web.sdo.com/20230430_NEJ23/Handler/Item/Exchange.ashx", {
                        headers: {
                            "x-requested-with": "XMLHttpRequest",
                            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        },
                        referrer: "https://actff1.web.sdo.com/20230430_NEJ23/index.html?2023/6/28%208:52:44",
                        referrerPolicy: "strict-origin-when-cross-origin",
                        body: new URLSearchParams({
                            ItemExp: availableItem.exp,
                            ItemLevel: targetLevel,
                            ItemCode: availableItem.code,
                            ItemPeathID: getUUID(),
                        }).toString(),
                        method: "POST",
                        mode: "cors",
                        credentials: "include",
                    })).json();
                    if (response.result !== "1") {
                        throw response;
                    }
                    console.info({ targetType, targetLevel, targetTypeName, i, availableItem, response });
                    success.push(availableItem);
                } catch (error) {
                    console.error({ targetType, targetLevel, targetTypeName, i, availableItem, error });
                    failed.push(availableItem);
                }
            }
            button.innerText = `正在批量领取${targetTypeName}版所有可领取道具：${availableItemsForTargetType.length}/${availableItemsForTargetType.length}`;
            await sleep(100);
            alert(`批量领取${targetTypeName}版所有可领取道具结果：\n成功：${success.map(({ name, exp }) => `[${exp / 100}级] ${name}`).join("、") || "（无）"}\n失败：${failed.map(({ name, exp }) => `[${exp / 100}级] ${name}`).join("、") || "（无）"}`);
        }
        if (button.style.cursor !== "pointer") {
            await sleep(100);
            alert("批量领取流程结束，即将刷新页面！");
            await sleep(100);
            location.reload();
        }
    });
})();
