// ==UserScript==
// @name         SteamCN 投票帖子清理
// @namespace    local.CR
// @version      0.0.1
// @description  清理 SteamCN 投票帖子
// @author       CharRun
// @match        https://steamcn.com/f148*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/388158/SteamCN%20%E6%8A%95%E7%A5%A8%E5%B8%96%E5%AD%90%E6%B8%85%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/388158/SteamCN%20%E6%8A%95%E7%A5%A8%E5%B8%96%E5%AD%90%E6%B8%85%E7%90%86.meta.js
// ==/UserScript==

(() => {
    let config = {
        autoClean: true,
        cleanAll: false,
        whiteList: [] // todo
    };

    let voteList = [];
    let cleanList = [];
    let display = false;

    function addButton() {
        let displayButton = document.createElement("a");
        let autoCleanButton = document.createElement("a");
        let cleanAllButton = document.createElement("a");
        displayButton.href = "javascript:;";
        autoCleanButton.href = "javascript:;";
        cleanAllButton.href = "javascript:;";
        displayButton.innerHTML = `${display ? "隐藏" : "显示"}`;
        autoCleanButton.innerHTML = `${
            config.autoClean ? "取消自动隐藏" : "打卡自动隐藏"
        }`;
        cleanAllButton.innerHTML = `${
            config.cleanAll ? "取消全部隐藏" : "打开全部隐藏"
        }`;

        displayButton.onclick = function() {
            display = !display;
            this.innerHTML = `${display ? "隐藏" : "显示"}`;
            display ? removeClean() : filter();
        };
        autoCleanButton.onclick = function() {
            config.autoClean = !config.autoClean;
            this.innerHTML = `${
                config.autoClean ? "取消自动隐藏" : "打卡自动隐藏"
            }`;
            localStorage.setItem("cleanVote", JSON.stringify(config));
        };
        cleanAllButton.onclick = function() {
            config.cleanAll = !config.cleanAll;
            this.innerHTML = `${
                config.cleanAll ? "取消全部隐藏" : "打开全部隐藏"
            }`;
            localStorage.setItem("cleanVote", JSON.stringify(config));
        };
        let pNode = document.querySelectorAll("#separatorline > tr > td");
        pNode[1].appendChild(displayButton);
        pNode[3].appendChild(autoCleanButton);
        pNode[4].appendChild(cleanAllButton);
    }

    function cleanVote() {
        voteList = [];
        let ele = document.querySelectorAll("#threadlisttableid tbody");
        for (let index = 0; index < ele.length; index++) {
            let e = ele[index].querySelector("tr td img");
            if (e && e.alt === "投票") {
                let a = ele[index].querySelector(".by.by-author a");
                let author = a.innerHTML;
                let uid = a.href.match(/[0-9]+?$/);
                voteList.push({ author, uid, dom: ele[index] });
            }
        }
        let pNode = document.querySelectorAll("#separatorline > tr > td");
        pNode[2].innerHTML = `投票帖子数量 : ${voteList.length}`;
        !display && filter();
    }

    function filter() {
        cleanList = voteList.filter(ele => {
            if (config.autoClean) {
                if (config.cleanAll) {
                    ele.dom.style.display = "none";
                    return true;
                } else {
                    if (config.whiteList.indexOf(ele.uid) >= 0) return false;
                    ele.dom.style.display = "none";
                    return true;
                }
            }
            return false;
        });
    }

    function removeClean() {
        cleanList = cleanList.filter(ele => {
            ele.dom.style.display = "table-row-group";
            return false;
        });
    }

    config = JSON.parse(localStorage.getItem("cleanVote") || null) || config;
    let ob = new MutationObserver(cleanVote);
    ob.observe(document.querySelector("#threadlisttableid"), {
        childList: true
    });
    addButton();
    cleanVote();
})();
