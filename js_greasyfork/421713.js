// ==UserScript==
// @name         我們的浮游城 介面強化
// @namespace    -
// @version      0.1.4
// @description  純介面強化，沒有任何額外請求，不會增加伺服器負擔。
// @author       LianSheng
// @include      https://ourfloatingcastle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421713/%E6%88%91%E5%80%91%E7%9A%84%E6%B5%AE%E6%B8%B8%E5%9F%8E%20%E4%BB%8B%E9%9D%A2%E5%BC%B7%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/421713/%E6%88%91%E5%80%91%E7%9A%84%E6%B5%AE%E6%B8%B8%E5%9F%8E%20%E4%BB%8B%E9%9D%A2%E5%BC%B7%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ownClass = "css-1mub2pk";

    /**
     * Simplified: single selector.
     * @param {String} selector
     * @param {HTMLElement} root
     * @return {HTMLElement}
     */
    const find = (selector, root = document) => root.querySelector(selector);

    /**
     * Simplified: Multiple selector.
     * @param {String} selector
     * @param {HTMLElement} root
     * @return {Array}
     */
    const finds = (selector, root = document) => [...root.querySelectorAll(selector)];

    class Main {
        /**
         * Add custom event listener
         * @param {requestCallback} callback
         * @return {callback}
         */
        static listenUrlChange = callback => {
            history.pushState = (f => function pushState() {
                var ret = f.apply(this, arguments);
                window.dispatchEvent(new Event('pushstate'));
                window.dispatchEvent(new Event('urlchange'));
                return ret;
            })(history.pushState);

            history.replaceState = (f => function replaceState() {
                var ret = f.apply(this, arguments);
                window.dispatchEvent(new Event('replacestate'));
                window.dispatchEvent(new Event('urlchange'));
                return ret;
            })(history.replaceState);

            window.addEventListener('popstate', () => {
                window.dispatchEvent(new Event('urlchange'))
            });

            window.addEventListener("urlchange", e => callback(e.currentTarget.location));
        }

        /**
         * Pin header
         */
        static pinHeader = () => {
            let id = setInterval(() => {
                let element = find("nav");

                if (element) {
                    element.style.cssText = "position: fixed; x: 0px; y: 20px; width: 100%; z-index: 100; background-color: #18283aee";
                    clearInterval(id);
                }
            }, 10);
        }

        /**
         * Move main container
         */
        static moveContainer = () => {
            let id = setInterval(() => {
                let element = find(".chakra-container");

                if (element) {
                    let originTop = element.offsetTop;
                    let navHeight = find("nav").clientHeight;
                    element.style.cssText = `margin-top: ${originTop + navHeight}px`;
                    clearInterval(id);
                }
            }, 10);
        }

        /**
         * Insert custom css to head.
         */
        static customCSS = () => {
            let css = `
                <style id="oftp_customCSS">
                    .ofcp_hover {
                        user-select: none;
                    }
                    .ofcp_hover:hover {
                        background-color: #eee;
                    }

                    [ofcp-filter]:hover {
                        background-color: #fdd;
                    }
                </style>
            `;

            find("head").insertAdjacentHTML("beforeend", css);
        }

        /**
         * Try to disconnect mutation observer.
         */
        static disconnect = () => {
            if (this.observer instanceof MutationObserver) {
                this.observer.disconnect();
                this.observer = undefined;
            }
        }

        static observer = undefined;
        static lastPath = undefined;
    }

    class Page {
        /**
         * Force empty all stored data and return true.
         * @return {boolean}
         */
        static emptyData = () => {
            Market.tableEquipmentData.goods = [];
            Market.tableEquipmentData.types = [];

            return true;
        }

        static isItems = path => this.emptyData() && path == "/items";
        static isMarket = path => this.emptyData() && path == "/market";
        static isMessageWall = path => this.emptyData() && path == "/message-wall"
        static isCasino = path => this.emptyData() && path == "/casino";
    }

    class Items {

    }

    class Market {
        /**
         * Move market type tab after the table loaded.
         * @return {Promise}
         */
        static moveTab = () => {
            return new Promise(resolve => {
                let id = setInterval(() => {
                    let tab = find(".chakra-tabs__tablist");

                    if (tab) {
                        let navHeight = find("nav").clientHeight;
                        let table = find(".chakra-table");
                        let tableWidth = table.clientWidth;
                        let originTop = tab.offsetTop;

                        window.onscroll = () => {
                            if (window.scrollY + navHeight + 20 >= originTop) {
                                tab.style.cssText = `position: fixed; top: ${navHeight + 20}px; background-color: #fffd; width: ${tableWidth}px; margin: 0px; border: 4px;`;
                                table.style.cssText = `margin-top: ${tab.clientHeight + 20}px;`;
                            } else {
                                tab.style.cssText = "";
                                table.style.cssText = "";
                            }
                        }

                        clearInterval(id);
                        resolve();
                    }
                }, 10);
            })
        }

        /**
         * Custom market table.
         */
        static customTable = () => {
            let container = find(".chakra-tabs__tab-panels");

            // tab button event.
            finds(".chakra-tabs__tab").forEach(each => each.onclick = this.changeTab);

            // check custom table exists.
            if (!find("#ofcp_equipment")) {
                let html = `
                <ofcp id="ofcp_equipment">
                    <div class="css-fvl16n">
                        <table role="table" class="chakra-table css-n60bx1">
                            <thead class="css-il9fs9">
                                <tr role="row" class="css-0" style="user-select: none; cursor: pointer;">
                                    <th class="css-1x90mmm">#</th>
                                    <th class="css-1x90mmm">名稱</th>
                                    <th class="css-1x90mmm">類型</th>
                                    <th class="css-1x90mmm">價格</th>
                                    <th class="css-1x90mmm">攻防</th>
                                    <th class="css-1x90mmm">攻擊</th>
                                    <th class="css-1x90mmm">防禦</th>
                                    <th class="css-1x90mmm">挖礦</th>
                                    <th class="css-1x90mmm">剩餘耐久</th>
                                </tr>
                            </thead>
                            <tbody class="css-0"></tbody>
                        </table>
                    </div>
                </ofcp>
                `;

                container.parentElement.insertAdjacentHTML("beforeend", html);

                let ths = finds("#ofcp_equipment th");

                ths[0].onclick = () => this.drawEquipmentTable("index");
                ths[1].onclick = () => this.drawEquipmentTable("name");
                ths[2].onclick = () => this.drawEquipmentTable("type");
                ths[3].onclick = () => this.drawEquipmentTable("price");
                ths[4].onclick = () => this.drawEquipmentTable("total");
                ths[5].onclick = () => this.drawEquipmentTable("atk");
                ths[6].onclick = () => this.drawEquipmentTable("def");
                ths[7].onclick = () => this.drawEquipmentTable("mine");
                ths[8].onclick = () => this.drawEquipmentTable("remaining");
            }

            if (!find("#ofcp_mine")) {
                let html = `
                <ofcp id="ofcp_mine">
                    <div class="css-fvl16n">
                        <table role="table" class="chakra-table css-n60bx1">
                            <thead class="css-il9fs9">
                                <tr role="row" class="css-0" style="user-select: none; cursor: pointer;">
                                    <th class="css-1x90mmm">#</th>
                                    <th class="css-1x90mmm">名稱</th>
                                    <th class="css-1x90mmm">數量</th>
                                    <th class="css-1x90mmm">單價</th>
                                    <th class="css-1x90mmm">總價</th>
                                    <th class="css-1x90mmm">說明</th>
                                </tr>
                            </thead>
                            <tbody class="css-0"></tbody>
                        </table>
                    </div>
                </ofcp>
                `;

                container.parentElement.insertAdjacentHTML("beforeend", html);

                let ths = finds("#ofcp_mine th");

                ths[0].onclick = () => this.drawMineTable("index");
                ths[1].onclick = () => this.drawMineTable("name");
                ths[2].onclick = () => this.drawMineTable("quantity");
                ths[3].onclick = () => this.drawMineTable("unitprice");
                ths[4].onclick = () => this.drawMineTable("price");
            }
            // check custom table exists. [END]

            // first
            this.changeTab();

            let option = {
                attributes: true,
                childList: true,
                subtree: true
            };

            // v0.1.2: 修正第五輪市場介面調整導致的錯誤
            let nowTab = find("button[aria-selected='true']");
            if (nowTab.innerText == "裝備") {
                this.updateEquipmentTableData(container);
                this.drawEquipmentTable();
            } else if (nowTab.innerText == "礦石") {
                this.updateMineTableData(container);
                this.drawMineTable();
            } else if (nowTab.innerText == "道具") {
                this.drawItemTable();
            }

            Main.disconnect();
            Main.observer = new MutationObserver(records => {
                let important = records.filter(e => e.attributeName != "style");

                if (important.length > 0) {
                    let nowTab = find("button[aria-selected='true']");
                    if (nowTab.innerText == "裝備") {
                        this.updateEquipmentTableData(container);
                        this.drawEquipmentTable();
                    } else if (nowTab.innerText == "礦石") {
                        this.updateMineTableData(container);
                        this.drawMineTable();
                    } else if (nowTab.innerText == "道具") {
                        this.drawItemTable();
                    }
                }
            });
            Main.observer.observe(container, option);
        }

        /**
         * Check now tab.
         */
        static changeTab = () => {
            let container = find(".chakra-tabs__tab-panels");
            let ofcpEquipment = find("#ofcp_equipment");
            let ofcpMine = find("#ofcp_mine");
            let ofcpItem = find("#ofcp_item");

            let nowTab = find("button[aria-selected='true']");
            if (nowTab.innerText == "裝備") {
                container.style.cssText = "display: none;"
                ofcpEquipment.style.cssText = "";
                ofcpMine.style.cssText = "display: none";

                if (this.tableEquipmentData.goods.length === 0) {
                    this.updateEquipmentTableData(container);
                }

                this.drawEquipmentTable();
            } else if (nowTab.innerText == "礦石") {
                container.style.cssText = "display: none";
                ofcpEquipment.style.cssText = "display: none";
                ofcpMine.style.cssText = "";

                if (this.tableMineData.length == 0) {
                    this.updateMineTableData(container);
                }

                this.drawMineTable();
            } else if (nowTab.innerText == "道具") {
                container.style.cssText = "";
                ofcpEquipment.style.cssText = "display: none";
                ofcpMine.style.cssText = "display: none";

                // if (this.tableItemData.length == 0) {
                //     this.updateItemTableData(container);
                // } else {
                //     this.drawItemTable();
                // }
            }
        }

        /**
         * Draw equipment custom table
         * @param {string} sortBy
         */
        static drawEquipmentTable = (sortBy = undefined, filter = undefined) => {
            let container = find(".chakra-tabs__tab-panels");

            if (this.tableEquipmentData.goods.length == 0) {
                this.updateEquipmentTableData(container);
            }

            let tbody = find("#ofcp_equipment tbody");
            tbody.innerHTML = "";

            let data = this.tableEquipmentData.goods;

            // v0.1.4 單一篩選（實驗性）
            if (filter !== undefined) {
                if (this.tableEquipmentData.singleFilter !== undefined) {
                    this.tableEquipmentData.singleFilter = undefined;
                } else {
                    this.tableEquipmentData.singleFilter = ["type", filter];
                    console.log(this.tableEquipmentData.singleFilter);
                }
            }

            if (this.tableEquipmentData.singleFilter !== undefined) {
                let type = this.tableEquipmentData.singleFilter[0];
                let filter = this.tableEquipmentData.singleFilter[1];
                data = data.filter(e => e[type] === filter);
            }

            if (sortBy) {
                this.tableEquipmentData.sortBy = sortBy;
            }

            let nowSortBy = this.tableEquipmentData.sortBy;
            if (["name", "type"].includes(nowSortBy)) {
                data.sort();
            } else if (["price", "index"].includes(nowSortBy)) {
                data.sort((a, b) => a[nowSortBy] - b[nowSortBy]);
            } else {
                data.sort((a, b) => b[nowSortBy] - a[nowSortBy]);
            }

            data.forEach(each => {
                let tr = document.createElement("tr");
                if (each.own) {
                    tr.style.cssText = "background-color: #ff06;";
                }
                tr.innerHTML = `
                    <td class="css-1xrq5x">${("0"+(each.index+1).toString()).substr(-2)}</td>
                    <td class="css-1xrq5x">${each.name}</td>
                    <td class="css-1xrq5x" ofcp-filter="type">${each.type}</td>
                    <td class="css-1xrq5x" style="background-color: #ff03;">${each.price}</td>
                    <td class="css-1xrq5x">${each.total}</td>
                    <td class="css-1xrq5x">${each.atk}</td>
                    <td class="css-1xrq5x">${each.def}</td>
                    <td class="css-1xrq5x">${each.mine}</td>
                    <td class="css-1xrq5x">${each.remaining}</td>
                `;

                let ft = find("[ofcp-filter='type']", tr);
                ft.onclick = e => {
                    e.stopPropagation();

                    if(ft.getAttribute("ofcp-active")){
                        ft.removeAttribute("ofcp-active");
                        this.drawEquipmentTable(undefined, "");
                    } else {
                        ft.setAttribute("ofcp-active", "");
                        this.drawEquipmentTable(undefined, ft.innerText);
                    }
                };

                tr.classList.add("ofcp_hover");
                tr.style.cssText += `cursor: pointer;`;
                tr.onclick = () => {
                    each.element.click()
                };

                tbody.insertAdjacentElement("beforeend", tr);

                find("#ofcp_equipment").style.cssText = "display: block; margin-top: 30px";
            });
        }

        /**
         * Draw mine custom table
         * @param {string} sortBy
         */
        static drawMineTable = (sortBy = undefined) => {
            let container = find(".chakra-tabs__tab-panels");

            if (this.tableMineData.goods.length == 0) {
                this.updateMineTableData(container);
            }

            let tbody = find("#ofcp_mine tbody");
            tbody.innerHTML = "";

            let data = this.tableMineData.goods;
            if (sortBy) {
                this.tableMineData.sortBy = sortBy;
            }

            let nowSortBy = this.tableMineData.sortBy;
            if (["name", "type"].includes(nowSortBy)) {
                data.sort();
            } else if (["price", "index", "unitprice"].includes(nowSortBy)) {
                data.sort((a, b) => a[nowSortBy] - b[nowSortBy]);
            } else {
                data.sort((a, b) => b[nowSortBy] - a[nowSortBy]);
            }

            data.forEach(each => {
                let tr = document.createElement("tr");
                if (each.own) {
                    tr.style.cssText = "background-color: #ff06;";
                }
                tr.innerHTML = `
                    <td class="css-1xrq5x">${("0"+(each.index+1).toString()).substr(-2)}</td>
                    <td class="css-1xrq5x">${each.name}</td>
                    <td class="css-1xrq5x">${each.quantity}</td>
                    <td class="css-1xrq5x"><b>${parseInt(each.unitprice)}</b>.<small>${each.unitprice.split(".")[1]}</small></td>
                    <td class="css-1xrq5x" style="background-color: #ff03;">${each.price}</td>
                    <td class="css-1xrq5x">${each.description}</td>
                `;

                tr.classList.add("ofcp_hover");
                tr.style.cssText += `cursor: pointer;`;
                tr.onclick = () => {
                    each.element.click()
                };

                tbody.insertAdjacentElement("beforeend", tr);
                find("#ofcp_mine").style.cssText = "display: block; margin-top: 30px";
            });
        }

        static drawItemTable = () => {

        }

        /**
         * Update equipment data from original table.
         * @param {HTMLElement} container
         */
        static updateEquipmentTableData = container => {
            let nowTableRows = finds("table tbody tr", container);

            this.tableEquipmentData.types = [];
            this.tableEquipmentData.goods = [];
            nowTableRows.forEach((tr, index) => {
                let datum = {
                    index: index,
                    name: tr.children[0].innerText,
                    type: tr.children[1].innerText,
                    price: tr.children[2].innerText,
                    total: (tr.children[3].innerText - 0) + (tr.children[4].innerText - 0),
                    atk: tr.children[3].innerText,
                    def: tr.children[4].innerText,
                    mine: tr.children[5].innerText,
                    remaining: tr.children[6].innerText.split("/")[0].replace(/\ /g, ""),
                    element: tr,
                    own: tr.classList.contains(ownClass)
                }

                this.tableEquipmentData.goods.push(datum);
                if (!this.tableEquipmentData.types.includes(tr.children[1].innerText)) {
                    this.tableEquipmentData.types.push(tr.children[1].innerText);
                }
            });
        }

        /**
         * Update mine data from original table.
         * @param {HTMLElement} container
         */
        static updateMineTableData = container => {
            let nowTableRows = finds("table tbody tr", container);

            this.tableMineData.types = [];
            this.tableMineData.goods = [];
            nowTableRows.forEach((tr, index) => {
                let datum = {
                    index: index,
                    name: tr.children[0].innerText,
                    quantity: tr.children[1].innerText,
                    price: tr.children[2].innerText,
                    unitprice: (tr.children[2].innerText / tr.children[1].innerText).toFixed(2),
                    description: tr.children[3].innerText,
                    element: tr,
                    own: tr.classList.contains(ownClass)
                }

                this.tableMineData.goods.push(datum);
                if (!this.tableMineData.types.includes(tr.children[0].innerText)) {
                    this.tableMineData.types.push(tr.children[0].innerText);
                }
            });
        }

        /**
         * Update item data from original table.
         * @param {HTMLElement} container
         */
        static updateItemTableData = container => {

        }

        static tableEquipmentData = {
            sortBy: undefined,
            singleFilter: undefined,
            types: [],
            goods: []
        };

        static tableMineData = {
            sortBy: undefined,
            singleFilter: undefined,
            types: [],
            goods: []
        };
        static tableItemData = {
            sortBy: undefined,
            singleFilter: undefined,
            types: [],
            goods: []
        };
    }

    class MessageWall {

    }

    class Casino {

    }

    Main.listenUrlChange(async loc => {
        if (loc.pathname !== Main.lastPath) {
            Main.lastPath = loc.pathname;
            Main.customCSS();
            Main.pinHeader();
            Main.moveContainer();

            if (Page.isItems(loc.pathname)) {

            } else if (Page.isMarket(loc.pathname)) {
                await Market.moveTab();
                Market.customTable();

            } else if (Page.isMessageWall(loc.pathname)) {

            } else if (Page.isCasino(loc.pathname)) {

            }
        }
    });
})();