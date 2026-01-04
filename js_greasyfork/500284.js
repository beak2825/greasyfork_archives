// ==UserScript==
// @name            wegame-lol-aram-elo
// @namespace       https://greasyfork.org/zh-CN/users/1331729
// @homepageURL     https://greasyfork.org/zh-CN/scripts/500284
// @supportURL      https://greasyfork.org/zh-CN/scripts/500284/feedback
// @version         1.1
// @description     WeGame LOL历史战绩显示大乱斗团队ELO均分
// @author          YmdElf
// @match           *://www.wegame.com.cn/helper/lol/v2/index.html*
// @icon            data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/500284/wegame-lol-aram-elo.user.js
// @updateURL https://update.greasyfork.org/scripts/500284/wegame-lol-aram-elo.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 仅在历史战绩页面中生效
    if (window.location.hash.startsWith('#/life/history')) {
        const queryURI = '/api/v1/wegame.pallas.game.LolBattle/GetBattleDetail';
        const lolPanelVSdata = "body>div#app>div.page-history-record>div.lol-row>div.lol-row-container>div.lol-row-main>div.lol-panel.lol-panel-vsdata"
        let battleDetail = {};
        const MAX_RETRIES = 100;

        // 在指定元素中添加ELO元素
        function appendEloElement(teamDataElement, elo) {
            if (teamDataElement) {
                let teamDataHDElement = teamDataElement.querySelector("div[class='team-data-hd']");
                teamDataHDElement.querySelector("div[class='team-data-desc my-elo']")?.remove();

                let newElement = document.createElement("div");
                newElement.className = "team-data-desc my-elo";

                let iconElement = document.createElement("i");
                iconElement.className = "";
                newElement.appendChild(iconElement);

                let spanElement = document.createElement("span");
                spanElement.textContent = "ELO: " + elo;
                newElement.appendChild(spanElement);

                teamDataHDElement.appendChild(newElement);
            }
        }

        // 异步向API请求对战详细数据
        function fetchGetBattleDetail(callback) {
            // 获取URL的hash部分
            const hash = window.location.hash.substring(1); // 去掉开头的#

            // 去掉hash中的路径部分，只保留参数部分
            const hashParamsString = hash.includes('?') ? hash.split('?')[1] : hash;

            // 将hash参数转换为对象
            function parseHashParameters(hash) {
                const params = {};
                const pairs = hash.split('&');
                pairs.forEach(pair => {
                    const [key, value] = pair.split('=');
                    params[decodeURIComponent(key)] = decodeURIComponent(value);
                });
                return params;
            }

            // 解析hash参数
            const hashParams = parseHashParameters(hashParamsString);

            // 在控制台输出解析后的参数
            // console.log(hashParams);

            let payloadTemplate = {
                "account_type": hashParams.account_type ? parseInt(hashParams.account_type, 10) : null,
                "area": hashParams.area_id ? parseInt(hashParams.area_id, 10) : null,
                "id": hashParams.uin || "",
                "game_id": hashParams.gameId || "",
                "from_src": "lol_helper"
            };

            fetch(queryURI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payloadTemplate)
            })
                .then(response => response.json())
                .then(data => {
                    // console.log('Success:', data);
                    battleDetail = data;
                    if (callback) callback();
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }

        // 处理对战详细数据
        function processBattleDetail() {
            // let winTeamDataElement = document.querySelector("div[class='team-data team-data--win']");
            let winTeamDataElement = document.querySelector(lolPanelVSdata + ">div.vsdata-bd>div.team-data.team-data--win");
            // let failTeamDataElement = document.querySelector("div[class='team-data team-data--fail']");
            let failTeamDataElement = document.querySelector(lolPanelVSdata + ">div.vsdata-bd>div.team-data.team-data--fail");
            // console.log(battleDetail);
            const teamDetails = battleDetail.battle_detail.team_details;
            for (let i = 0; i < teamDetails.length; i++) {
                const teamDetail = teamDetails[i];
                const teamElo = teamDetail.teamElo;
                if (teamDetail.win === "Win" && winTeamDataElement) {
                    appendEloElement(winTeamDataElement, teamElo);
                } else if (teamDetail.win === "Fail" && failTeamDataElement) {
                    appendEloElement(failTeamDataElement, teamElo);
                }
            }
            battleDetail = {};
        }

        function showBattleDetail() {
            let retryCount = 0;
            const checkInterval = setInterval(() => {
                if (isLoad()) {
                    clearInterval(checkInterval);
                    // 元素加载完毕，执行操作
                    if (isEmpty(battleDetail)) {
                        // fetch请求
                        fetchGetBattleDetail(processBattleDetail);
                    } else {
                        processBattleDetail();
                    }
                } else if (retryCount >= MAX_RETRIES) {
                    clearInterval(checkInterval);
                    console.error('已达到最大重试限制，停止执行以防止崩溃。');
                }
                retryCount++;
            }, 100); // 每100毫秒检测一次
        }

        // 检查对战详细表格元素是否加载完毕
        function isLoad() {
            // 最大的元素
            // return !!document.querySelector(lolPanelVSdata);
            // 时间元素
            // return !!document.querySelector(lolPanelVSdata + ">div.vsdata-hd>div.vsdata-type>div.vsdata-type-item>div.vsdata-type-desc");
            // 最精确元素
            return !!document.querySelector(lolPanelVSdata + ">div.vsdata-bd>div.team-data.team-data--win>div.team-data-hd>div.team-data-desc");
        }

        // 检查JSON对象是否为空
        function isEmpty(obj) {
            return Object.keys(obj).length === 0;
        }


        // main

        // 登录检查
        let observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                let historyListNoDataElement = document.querySelector("body>div#app>div.page-history-record>div.lol-row>div.lol-row-container>div.lol-row-aside>div.lol-panel.lol-panel-hisitory>div.lol-panel-bd>div.no-data-txt");
                if (historyListNoDataElement) {
                    // 创建一个新的超链接元素
                    let newElement = document.createElement("a");

                    // 设置超链接的目标网址
                    newElement.href = "https://www.wegame.com.cn/home";

                    // 设置点击后在新的标签页打开
                    newElement.target = "_blank";

                    // 设置超链接的显示文字
                    newElement.innerHTML = `可能未登录，点击我跳转到登录界面，在新的网页中的右上角登录，然后刷新此页面<br>如果新的网页中的右上角显示已登录，那就注销再登录一次，然后刷新此页面`;

                    // 将新的超链接元素添加到指定的元素中
                    historyListNoDataElement.appendChild(newElement);
                }
                // 选择指定的元素
                let noLoginElement = document.querySelector("div.no-data");
                let noLogin;
                if (noLoginElement) {
                    noLogin = noLoginElement.querySelector("p.no-data-text").innerText === "暂无数据";
                }
                // 如果元素存在
                if (noLogin && !noLoginElement.querySelector("a")) {
                    // 创建一个新的超链接元素
                    let newElement = document.createElement("a");

                    // 设置超链接的目标网址
                    newElement.href = "https://www.wegame.com.cn/home";

                    // 设置点击后在新的标签页打开
                    newElement.target = "_blank";

                    // 设置超链接的显示文字
                    newElement.innerHTML = `未登录，点击我跳转到登录界面，在新的网页中的右上角登录，然后刷新此页面<br>如果新的网页中的右上角显示已登录，那就注销再登录一次，然后刷新此页面`;

                    // 将新的超链接元素添加到指定的元素中
                    noLoginElement.appendChild(newElement);

                    // 一旦找到目标元素并添加链接，停止观察
                    observer.disconnect();
                }
            });
        });

        // 配置MutationObserver监听整个文档的子节点和子树的变化
        observer.observe(document, {
            childList: true,
            subtree: true
        });

        // 重写XMLHttpRequest的open方法，拦截queryURI的API请求的内容
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            this.addEventListener('load', function () {
                if (url === queryURI && this.responseText) {
                    battleDetail = JSON.parse(this.responseText);
                    // console.log(battleDetail);
                }
            });
            originalOpen.apply(this, arguments);
        }

        // 首次打开
        let firstOpen = true;
        window.addEventListener('replaceState', function (e) {
            if (firstOpen) {
                firstOpen = false;
            } else {
                return;
            }
            showBattleDetail();
            // console.log("replaceState: " + window.location.hash);
        });

        // 后续打开
        window.addEventListener('pushState', function (e) {
            showBattleDetail();
            // console.log("pushState: " + window.location.hash);
        });

    }

})();
