// ==UserScript==
// @name         Chain report ranking
// @namespace    m0tch.torn.ChainRank
// @version      0.1
// @description  Add ranking column to chain reports
// @author       m0tch
// @run-at       document-end
// @grant        GM_addStyle
// @match        https://www.torn.com/war.php?step=chainreport*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453926/Chain%20report%20ranking.user.js
// @updateURL https://update.greasyfork.org/scripts/453926/Chain%20report%20ranking.meta.js
// ==/UserScript==

GM_addStyle(`
.rank-row {
    color: #666;
    color: var(--default-gray-6-color);
    border: 1px solid #fff;
    border-color: var(--default-panel-divider-inner-side-color);
    border-right-color: #ccc;
    border-right-color: var(--default-panel-divider-outer-side-color);
    border-bottom-color: #ccc;
    border-bottom-color: var(--default-panel-divider-outer-side-color);
    line-height: 34px;
    height: 32px;
    width: 23px;
    padding: 0 8px;
}

.d .chain-report-wrap {
    max-width: 826px;
    width: 826px;
}

.d .header .container {
    width: 1020px;
}

.d.with-sidebar .content-wrapper {
    width: 826px;
}

#tt-page-status {
    right: calc(((100vw - 976px) / 2) - 70px);
}
`);


function addRankings() {
    if (!document.getElementsByClassName("members-names-rows")) return;
    if (document.getElementById("rank-container")) return;
    let numMembers = document.getElementsByClassName("members-names-rows")[0].children.length;

    let rankContainer = document.createElement("div");
    rankContainer.id = "rank-container";
    rankContainer.style = "width: 41px;";

    let rankHeader = document.createElement("ul");
    let rankHeaderItem = document.createElement("li");
    rankHeaderItem.innerText = "Rank";
    rankHeader.className = "report-stats-titles white-grad";
    rankHeader.appendChild(rankHeaderItem);

    rankContainer.appendChild(rankHeader);

    let rankList = document.createElement("ul");
    rankList.className = "rank-rows"

    for (var i = 0; i < numMembers; i++){
        var item = document.createElement("li");
        item.className = "rank-row";
        item.innerText = i + 1;
        rankList.appendChild(item);
    }

    rankContainer.appendChild(rankList);

    let statsContent = document.getElementsByClassName("report-members-stats-content")[0];

    statsContent.insertBefore(rankContainer, statsContent.firstChild);
}

new MutationObserver(mutations => {
    addRankings();
}).observe(document.getElementById("react-root"), {childList: true, subtree: true});