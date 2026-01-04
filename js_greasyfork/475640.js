// ==UserScript==
// @name         Mortal 显示恶手率
// @namespace    https://viayoo.com/
// @version      1.0
// @description  Mortal牌谱解析脚本
// @author       mcube-12139
// @run-at       document-idle
// @match        *://mjai.ekyu.moe/report/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475640/Mortal%20%E6%98%BE%E7%A4%BA%E6%81%B6%E6%89%8B%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/475640/Mortal%20%E6%98%BE%E7%A4%BA%E6%81%B6%E6%89%8B%E7%8E%87.meta.js
// ==/UserScript==

{
    const badMoveUpperLimit = 5;

    let badChooseNum = 0;

    const lang = document.documentElement.lang;
    const i18nText = {};
    if (lang == "zh-CN") {
        i18nText.badMove = "恶手";
        i18nText.badMoveRatio = "恶手率";
    } else {
        i18nText.badMove = "Bad move";
        i18nText.badMoveRatio = "bad moves/total";
    }

    const orderLosses = document.getElementsByClassName("order-loss");
    for (let i = 0, length = orderLosses.length; i != length; ++i) {
        const orderLoss = orderLosses[i];
        const chosenIndex = parseInt(orderLoss.innerText.substring(2));

        const turnInfo = orderLoss.parentElement;
        const summary = turnInfo.parentElement;
        const collapseEntry = summary.parentElement;

        const details = collapseEntry.lastChild;
        const table = details.firstChild;
        const tbody = table.lastChild;

        const chosenTr = tbody.childNodes[chosenIndex - 1];
        const weightTd = chosenTr.lastChild;
        const intSpan = weightTd.firstChild;

        const chosenWeight = parseInt(intSpan.textContent);

        if (chosenWeight < badMoveUpperLimit) {
            const badChooseNode = document.createElement("span");
            badChooseNode.innerHTML = ` \u00A0\u00A0\u00A0${i18nText.badMove}`;
            badChooseNode.style.color = "#f55";
            turnInfo.appendChild(badChooseNode);

            badChooseNum++;
        }
    }

    //const metaData = document.body.childNodes[4];
    const metaData = document.getElementsByClassName("collapse")[1];
    const metaDataDl = metaData.lastChild;
    const version = metaDataDl.childNodes[16];

    const sameRatioDd = metaDataDl.childNodes[15];
    const sameRatioText = sameRatioDd.textContent;
    const chooseNumStr = sameRatioText.substring(sameRatioText.indexOf("/") + 1);
    const chooseNum = parseInt(chooseNumStr);

    const badChooseRatioDt = document.createElement("dt");
    badChooseRatioDt.innerHTML = i18nText.badMoveRatio;
    const badChooseRatioDd = document.createElement("dd");
    badChooseRatioDd.innerHTML = `${badChooseNum}/${chooseNum} = ${(100 * badChooseNum / chooseNum).toFixed(3)}%`;
    metaDataDl.insertBefore(badChooseRatioDd, version);
    metaDataDl.insertBefore(badChooseRatioDt, badChooseRatioDd);
}



