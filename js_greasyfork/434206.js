// ==UserScript==
// @name         RR: MOE Tools
// @namespace    -
// @version      0.0.1-basic.interface
// @description  只是一個試圖讓 MOE 更方便執行某些任務的簡易工具。
// @author       LianSheng
// @include      http://rivalregions.com/*
// @include      https://rivalregions.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434206/RR%3A%20MOE%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/434206/RR%3A%20MOE%20Tools.meta.js
// ==/UserScript==

const STATE_ID = 3411;

(async () => {
    class RegionData {
        /**
         * 產生 RegionData 物件
         * 
         * @constructor
         * @param {number} id 地區 Id
         * @param {string} name 地區名稱
         * @param {number} ho Hospital
         * @param {number} mb Military Base
         * @param {number} sc School
         * @param {number} ms Missile System
         * @param {number} po Sea Port
         * @param {number} pp Power Plant
         * @param {number} sp Spaceport
         * @param {number} ae Airport
         * @param {number} hf House Fund
         */
        constructor(id, name, ho, mb, sc, ms, po, pp, sp, ae, hf) {
            /** 地區 Id */
            this.id = id;
            /** 地區名稱 */
            this.name = name;
            /** 醫院 Hospital */
            this.ho = ho;
            /** Military Base */
            this.mb = mb;
            /** School */
            this.sc = sc;
            /** Missile System */
            this.ms = ms;
            /** Sea Port */
            this.po = po;
            /** Power Plant */
            this.pp = pp;
            /** Spaceport */
            this.sp = sp;
            /** Airport */
            this.ae = ae;
            /** House Found */
            this.hf = hf;
        }
    }

    class Util {
        /**
         * 等待指定的毫秒數
         * 
         * @async
         * @param {number} ms
         * @returns {Promise<void>}
         */
        static wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        /**
         * 將 HTML 轉成 DOM
         * 
         * @param {string} html
         * @returns {HTMLElement}
         */
        static convertHtmlToDom(html) {
            let d = document.createElement("div");
            d.innerHTML = html;

            return d;
        }

        /**
         * 將指定數字加上千位分隔符（使用 RR 的小數點）
         * 
         * @param {number} number
         * @returns {string}
         */
        static formatNumber(number) {
            return number.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$&.').split(/\.\d*$/)[0];
        }
    }

    class RR {
        /**
         * 取得 cToken
         * 
         * @async
         * @returns {Promise<string>}
         */
        static async getCToken() {
            let cToken = await fetch("/").then(
                r => r.text()
            ).then(
                r => r.match(/var\ c_html\ =\ '(.+?)';/)[1]
            ).catch(
                e => "GET_CTOKEN_ERROR"
            );

            return cToken;
        }

        /**
         * 取得地區清單的 DOM
         * 
         * @param {number} [countryId]
         * @returns {HTMLElement|string}
         */
        static async getRegionsElement(countryId = -1) {
            let target = "/info/regions";

            if (countryId != -1) {
                target = `/info/regions/${countryId}`;
            }

            let regionsElement = await fetch(target).then(
                r => r.text()
            ).then(
                html => Util.convertHtmlToDom(html)
            ).catch(
                e => "GET_REGIONS_ERROR"
            );

            return regionsElement;
        }

        /**
         * 解析地區資料（in place）
         * 
         * @param {Ui} obj
         * @param {HTMLElement} regionsElement
         */
        static parseRegionData(obj, regionsElement) {
            let rows = [...regionsElement.querySelectorAll("tbody tr")];

            rows.forEach(each => {
                let id = each.children[0].children[0].getAttribute("href").match(/\/(\d+)$/)[1];
                let name = each.children[0].children[0].innerText.split(",")[0];

                obj.status.regions.devLevels[id] = new RegionData(
                    id,
                    name,
                    each.children[6].innerText - 0,
                    each.children[7].innerText - 0,
                    each.children[8].innerText - 0,
                    each.children[9].innerText - 0,
                    each.children[10].innerText - 0,
                    each.children[11].innerText - 0,
                    each.children[12].innerText - 0,
                    each.children[13].innerText - 0,
                    each.children[14].innerText - 0,
                );
            });
        }

        /**
         * 根據指定欄位取得地區的遞增或遞減排行
         * 
         * @param {Ui} ui 
         * @param {"ho"|"mb"|"sc"|"ms"|"po"|"pp"|"sp"|"ae"|"hf"} sortBy
         * @param {"asc"|"desc"} orderBy
         */
        static sortRegionsRank(ui, sortBy="hf", orderBy="asc") {
            return Object.values(ui.status.regions.devLevels).sort((a, b) => orderBy == "asc" ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]);
        }        
    }

    class Ui {
        /**
         * 產生前端顯示用的界面
         */
        constructor() {
            let tag = document.createElement("div");
            let container = document.createElement("div");
            let header =  document.createElement("div");
            let body = document.createElement("div");
            let footer = document.createElement("div");

            tag.id = "mt_tag";
            container.id = "mt_container";
            header.id = "mt_header";
            body.id = "mt_body";
            footer.id = "mt_footer";

            container.append(header, body, footer);

            this.ui = {
                tag: tag,
                container: {
                    self: container,
                    header: header,
                    body: body,
                    footer: footer
                }
            };

            this.status = {
                regions: {
                    devLevels: [],
                    ownRegions: [],
                }
            };
        }

        /**
         * 界面初始化
         * 
         * @async
         */
        async init() {
            let tag = this.ui.tag;
            let container = this.ui.container.self;
            let mtHeader = this.ui.container.header;
            let mtBody = this.ui.container.body;
            let mtFooter = this.ui.container.footer;
            
            // 預設隱藏容器
            container.classList.add("hide");

            // 書籤圖案，用於開關主要容器
            tag.onclick = () => container.classList.toggle("hide");

            let itemRegionAnalyze = document.createElement("div");
            itemRegionAnalyze.classList.add("mt_item");
            itemRegionAnalyze.innerHTML = "地區分析";
            itemRegionAnalyze.onclick = () => this.changePageRegionAnalyze();

            let itemAbout = document.createElement("div");
            itemAbout.classList.add("mt_item");
            itemAbout.innerHTML = "關於";
            itemAbout.onclick = () => this.changePageAbout();

            let itemTBC = document.createElement("div");
            itemTBC.classList.add("mt_item");
            itemTBC.innerHTML = "（未來推出）";
            itemTBC.onclick = () => {};

            mtHeader.appendChild(itemRegionAnalyze);
            mtHeader.appendChild(itemAbout);
            mtHeader.appendChild(itemTBC);

            let appendStyle = `
                #mt_tag {
                    width: 100px;
                    height: 100px;
                    z-index: 10001;

                    position: fixed;
                    top: -50px;
                    left: 75vw;

                    opacity: 0.4;

                    background-repeat: no-repeat;
                    background-size: contain;
                    background-position: center center;
                    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAPFBMVEX/////AAD/4+P/YWH/oKD/6en/2Nj/3d3/2tr/ExP/JCT/6Oj/ICD/ISH/HBz/GRn/8fH/trb/Wlr/KipkZQlEAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQflChEOCgzRj4FhAAAByklEQVR42u3PS05EMQxFwUYwcfQ+Eux/r6yBThz7ofLc56per3fva++99t/H3vv+98JPQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCwj/fz/XPhfHu41OE19ufDxGO91+fIYyJ30cIY+b5CcJz6vsBwnPuvb8wJv/bC+/ZQHfhmC40F17zid7CWNBoLTxWRDoLx5JKY2GsyfQVxqJOW+FYFeoqPJaVmgpjXaqn8F7YaikcK2MdhffSWkNhrM31Ex6Le+2E5+pgN2EsLzYTxvpkL+FIaLYSXhnRTsJIqTYSXjnZPsKR1G0jjKxwF2GklZsIz7x0D+GZ2G4hjMx4B2Gk1hsIR26+Xngl98uFkT1QLbzSF4qFI3+iVhgbNkqFsWOkUnhuWSkUHntm6oSxaadMeO8aqhKObUtFwnvfVI0wNm6VCI+dYxXCc+tahXDvXIHwKfcLm9RbUlXFh9UAAAAASUVORK5CYII=');

                    transition: all 0.5s;
                    cursor: pointer;
                }

                #mt_tag:hover {
                    top: -5px;
                    opacity: 0.65;
                }

                #mt_tag:active {
                    opacity: 1;
                }

                #mt_container * {
                    all: default;
                }

                #mt_container {
                    width: 80vw;
                    height: 80vh;
                    z-index: 10000;

                    position: fixed;
                    top: 10vh;
                    left: 10vw;

                    background-color: #ccca;

                    /*border: 5px solid #cc07;*/
                    border-radius: 4px;
                    box-shadow: 5px 5px 5px black;

                    transition: all 0.5s;
                }

                #mt_container.hide {
                    top: -20px;
                    height: -20vh;
                    opacity: 0;
                    visibility: hidden;
                }

                #mt_header {
                    width: 98%;
                    height: 3rem;
                    margin: 1%;

                    align-items: center;
                    box-sizing: border-box;
                    box-shadow: #0004 0 2px 4px;
                    display: flex;
                    flex-wrap: nowrap;
                    overflow-x: auto;
                    background: #27ad;
                    padding: 0 4rem;
                }

                #mt_header .mt_item {
                    color: #fff;
                    display: flex;
                    align-items: center;
                    white-space: nowrap;
                    width: fit-content;
                    height: 100%;
                    padding: 0 1rem;
                    transition: all 0.33s;
                    text-decoration: none;
                    user-select: none;
                    background-color: #0000;
                    cursor: pointer;
                }

                #mt_header .mt_item:hover {
                    background: #38cf;
                }

                #mt_body {
                    width: 96%;
                    height: calc(100% - 12% - 6rem);
                    margin: 1%;
                    padding: 1%;
                    overflow-y: scroll;

                    background-color: #ccce;
                }

                #mt_footer {
                    width: 98%;
                    height: 3rem;
                    margin: 1%;

                    align-items: center;
                    box-sizing: border-box;
                    box-shadow: #0004 0 2px 4px;
                    display: flex;
                    flex-wrap: nowrap;
                    overflow-x: auto;
                    padding: 0 4rem;
                    background: #000d;
                    color: #fffc;

                    direction: rtl;
                }

                /* Custom Table with mt- or m- prefix [START] */
                mtable {
                    display: table;
                    border-collapse: collapse;
                    box-sizing: border-box;
                    text-indent: initial;
                    border-spacing: 2px;
                    border-color: grey;

                    width: 98%;
                }

                mthead, mtbody {
                    display: table-row-group;
                    vertical-align: middle;
                    border-color: inherit;
                }

                mtr {
                    display: table-row;
	                vertical-align: inherit;
                }

                mth {
                    display: table-cell;
                    vertical-align: inherit;
                    font-weight: bold;
                    text-align: internal-center;

                    border: 1px solid black;
                    padding: 1rem 0.5rem;
                }

                mtd {
                    display: table-cell;
	                vertical-align: inherit;

                    border: 1px solid black;
                    padding: 1rem 0.5rem;
                }   
                
                mtcaption {
                    display: table-caption;
	                text-align: -webkit-center;
                }
                /* Custom Table with mt- or m- prefix [END] */
            `;
            let style = document.createElement("style");
            style.innerHTML = appendStyle;

            document.body.append(tag, container, style);
        }

        /**
         * 顯示目前狀態的訊息（在 #mt_footer 顯示）
         * 
         * @param {string} message
         */
        showStatusMessage(message) {
            let footer = this.ui.container.footer;
            footer.innerHTML = message;
        }

        /**
         * 切換頁面：地區分析
         */
        changePageRegionAnalyze() {
            let body = this.ui.container.body;
            let bodyHTML = `
            `;

            body.innerHTML = bodyHTML;
        }

        /**
         * 切換頁面：關於
         */
        changePageAbout() {
            let body = this.ui.container.body;
            let bodyHTML = `
                <p class="XL">${GM_info.script.name}</p>
                <p>只是一個試圖讓 MOE 更方便執行某些任務的簡易工具。</p>

                <p>作者：UnitedWeStand.</p>
                <p>最後更新：2021-10-18</p>
                <p>目前版本：v${GM_info.script.version}</p>

                <mtable>
                    <mtcaption>目前功能</mtcaption>
                    <mtcolgroup>
                        <col style="width: 10%">
                        <col style="width: 30%">
                        <col style="width: 50%">
                        <col style="width: 10%">
                    </mtcolgroup>
                    <mthead>
                        <mtr>
                            <mth style="width: fit-content;">#</mth>
                            <mth>名稱</mth>
                            <mth>描述</mth>
                            <mth>添加於...</mth>
                        </mtr>
                    </mthead>
                    <mtbody>
                        <mtr>
                            <mtd>1</mtd>
                            <mtd>地區分析</mtd>
                            <mtd>提供指定國家的相關地區的 dev 分析</mtd>
                            <mtd>v0.1.0</mtd>
                        </mtr>
                    </mtbody>
                </mtable>

                <style>
                    .XL {
                        font-size: 2rem;
                    } 
                </style>
            `;

            body.innerHTML = bodyHTML;
        }
    }

    // await Util.wait(2000);
    let ui = new Ui();
    await ui.init();
    // let regionsElement = await RR.getRegionsElement();

    ui.showStatusMessage("就緒");

    // RR.parseRegionData(ui, regionsElement);
    window.ui = ui;
})();