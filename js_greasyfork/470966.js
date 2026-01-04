// ==UserScript==
// @name         小当导出价格
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  导出的表格中携带参考价
// @author       hzwang
// @match        https://www.tampermonkey.net/index.php?version=4.19.0&ext=dhdg&updated=true
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @include      *://www.xiaodangjingpai.com/static/*
// @include      *:///www.xiaodangjingpai.com/*
// @require      https://unpkg.com/xlsx/dist/xlsx.full.min.js
// @require      https://unpkg.com/file-saver/dist/FileSaver.min.js
// @connect www.xiaodangjingpai.com
// @grant        GM_xmlhttpRequest
// @grant unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470966/%E5%B0%8F%E5%BD%93%E5%AF%BC%E5%87%BA%E4%BB%B7%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/470966/%E5%B0%8F%E5%BD%93%E5%AF%BC%E5%87%BA%E4%BB%B7%E6%A0%BC.meta.js
// ==/UserScript==
(function () {
    'use strict';

    /**
     * 进度
     */
    class Process {
        constructor() {
            this.progressContainer = null
            this.progressBar = null
            this.processElement = null
            this.progressFillValue = null
            this.init();
        }

        init() {
            this.progressContainer = document.createElement("div");
            this.progressContainer.style.position = "fixed";
            this.progressContainer.style.top = "0";
            this.progressContainer.style.left = "0";
            this.progressContainer.style.width = "100%";
            this.progressContainer.style.height = "100%";
            this.progressContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            this.progressContainer.style.display = "none";
            this.progressContainer.style.zIndex = "1000";

            this.progressBar = document.createElement("div");
            this.progressBar.style.position = "absolute";
            this.progressBar.style.top = "50%";
            this.progressBar.style.left = "50%";
            this.progressBar.style.transform = "translate(-50%, -50%)";
            this.progressBar.style.width = "200px";
            this.progressBar.style.height = "20px";
            this.progressBar.style.backgroundColor = "#f5f5f5";
            this.progressBar.style.borderRadius = "10px";

            this.progressFill = document.createElement("div");
            this.progressFill.style.width = "0";
            this.progressFill.style.height = "100%";
            this.progressFill.style.backgroundColor = "#4caf50";
            this.progressFill.style.borderRadius = "inherit";

            this.progressFillValue = document.createElement("span");
            // this.progressFillValue.textContent = `0/${this.total}`
            this.progressFillValue.style.color = "red"
            this.progressFillValue.style.marginLeft = "100px"

            this.progressBar.appendChild(this.progressFill);
            this.progressBar.appendChild(this.progressFillValue);
            this.progressContainer.appendChild(this.progressBar);

            document.documentElement.appendChild(this.progressContainer);
        }

        // 显示全屏进度条
        showProgressBar() {
            this.progressContainer.style.display = "block";
        }

        // 更新进度条（0-100之间的进度值）
        updateProgressBar(progressCnt, total) {
            this.progressFill.style.width = (progressCnt * 100 / total) + "%";
            this.progressFillValue.textContent = `${progressCnt}/${total}`
        }

        // 隐藏全屏进度条
        hideProgressBar() {
            this.progressContainer.style.display = "none";
        }

    }

    class QueryDataApi {

        constructor() {
        }

        queryList(bidder, biddingNo, pageNum) {
            return new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                    url: "https://www.xiaodangjingpai.com/api/dh/sale/bid/bidding/list",
                    method: "POST",
                    synchronous: true,
                    headers: {
                        "content-type": "application/json",
                        "user-agent": navigator.userAgent,
                        'authority': 'www.xiaodangjingpai.com',
                        'accept': 'application/json, text/plain, */*',
                        'accept-language': 'zh-CN,zh;q=0.9',
                        'bversion': '2.2',
                        'cache-control': 'no-cache',
                        'channelid': '700001',
                        'content-type': 'application/json;charset=UTF-8',
                        'eagleeye-pappname': 'hzqilpvzo4@cc28cea285a2501',
                        'eagleeye-sessionid': 'Fal8tknk4tUbkackX4RbwwOa3qnk',
                        'eagleeye-traceid': '4f823d6116894439996801001a2501',
                        'origin': 'https://www.xiaodangjingpai.com',
                        'pragma': 'no-cache',
                        'referer': 'https://www.xiaodangjingpai.com/static/index.html',
                        'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"macOS"',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'same-origin',
                    },
                    data: JSON.stringify({ "bidder": bidder, "biddingNo": biddingNo, "bidType": "1", "pageNum": pageNum, "pageSize": 100, "isHasPrice": "", "status": "", "brand": "", "product": "", "evaluationLevel": "" }),
                    responseType: "json",
                    onload(response) {
                        resolve(JSON.parse(response.responseText));
                    },
                });
            })
        }

        queryTypeList() {
            return new Promise((function (resolve, reject) {
                GM_xmlhttpRequest({
                    url: "https://www.xiaodangjingpai.com/api/dh/sale/bid/list/type",
                    method: "POST",
                    synchronous: true,
                    headers: {
                        "user-agent": navigator.userAgent,
                        'authority': 'www.xiaodangjingpai.com',
                        'accept': 'application/json, text/plain, */*',
                        'accept-language': 'zh-CN,zh;q=0.9',
                        'bversion': '2.2',
                        'cache-control': 'no-cache',
                        'channelid': '700001',
                        'content-type': 'application/json;charset=UTF-8',
                        'eagleeye-pappname': 'hzqilpvzo4@cc28cea285a2501',
                        'eagleeye-sessionid': 'R6lhskFX4LRwR0w0wdOmq82yg1sk',
                        'eagleeye-traceid': '2fe3272016894811314141010a2501',
                        'origin': 'https://www.xiaodangjingpai.com',
                        'pragma': 'no-cache',
                        'referer': 'https://www.xiaodangjingpai.com/static/index.html',
                        'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"macOS"',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'same-origin',
                        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
                    },
                    data: JSON.stringify({ "status": 2, "gmtStart": "", "gmtExpire": "", "biddingNo": "", "pageNum": 1, "pageSize": excelExport.pageSize, "isChecked": 0, "bidType": 1 }),
                    responseType: "json",
                    onload(response) {
                        resolve(JSON.parse(response.responseText));
                    },
                });
            }));
        }

    }

    class ExcelExport {
        constructor() {
            this.exportData = []
            this.pageSize = 100
        }

        init() {
            this.exportData = []
        }

        addExportDataList(exportDataList) {
            try {
                exportDataList.forEach(item => {
                    this.exportData.push({
                        "场次编号": item.biddingNo,
                        "竞拍物品id": item.id,
                        "品牌": item.brand,
                        "机型": item.product,
                        "物品编号": item.merchandiseId,
                        "IMEI": item.imei,
                        "SKU": item.skuDesc == null ? (item.merchandiseDetectionInformationDTO != null ? this.processDesc(item.merchandiseDetectionInformationDTO.skuDesc) : "") : this.processDesc(item.skuDesc),
                        "附加选项": "",
                        "skuId": item.merchandiseDetectionInformationDTO != null ? item.merchandiseDetectionInformationDTO.skuId : "",
                        "成色": item.merchandiseDetectionInformationDTO != null ? item.merchandiseDetectionInformationDTO.evaluationLevel : "",
                        "机况描述": `正常项:${this.processDesc(item.normalItem)}****瑕疵项:${this.processDesc(item.defectiveItem)}`,
                        "备注": item.merchandiseDetectionInformationDTO != null ? item.merchandiseDetectionInformationDTO.remark : "",
                        "参考价": item.referencePrice,
                    })
                })
            } catch (error) {
                console.log("发生异常: " + error);
            }
        }

        processDesc(sku) {
            let res = ""
            if (sku != null) {
                sku.split(",").forEach(item => {
                    try {
                        if (item != '' && item != null) {
                            res += item.split(":")[1].replace(/&#&[0-9]*\|/g, '、').replace(/^[0-9]*\|/g, '') + "、"
                        }
                    } catch (error) {
                        console.log("发生异常: " + error);
                    }
                })
            }
            return res
        }

        async exportExcel(type) {
            this.init()
            let completeCnt = 0
            process.updateProgressBar(completeCnt, type.bidNum)
            process.showProgressBar();

            let pageNums = Math.ceil(type.bidNum * 1.0 / this.pageSize)
            for (let i = 0; i < pageNums; i++) {
                let items = await queryDataApi.queryList(userInfo.id, type.biddingNo, i + 1).then(value => {
                    return value.data.items;
                })
                completeCnt += this.pageSize
                process.updateProgressBar(completeCnt, type.bidNum)
                excelExport.addExportDataList(items)
            }

            this.exportToExcel(`场次为${type.biddingNo}`)
        }

        // 导出数据为 Excel 文件
        exportToExcel(filename) {
            // 创建工作簿和工作表
            var workbook = XLSX.utils.book_new();
            var sheet = XLSX.utils.json_to_sheet(this.exportData);

            // 将工作表添加到工作簿
            XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");

            // 将工作簿保存为 Excel 文件
            var wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            var blob = new Blob([wbout], { type: "application/octet-stream" });
            saveAs(blob, filename + ".xlsx");
            process.hideProgressBar();
        }

        /**
         * 生成下载按钮
         */
        generateDownloadButton(typeList) {
            document.querySelectorAll(".ivu-table-fixed-body .ivu-table-tbody .ivu-table-row").forEach((rowElement, index) => {
                let firstDiv = rowElement.firstElementChild.firstElementChild
                var buttonElementString = `<button type="button" class="ivu-btn ivu-btn-primary ivu-btn-small"><!----><!----><span>导出</span></button>`;
                // 创建一个临时容器元素
                var container = document.createElement('div');
                // 将字符串赋值给容器元素的 innerHTML 属性
                container.innerHTML = buttonElementString;
                // 获取容器中的第一个子元素，即转换后的元素
                var buttonElement = container.firstChild;
                buttonElement.addEventListener('click', function () {
                    excelExport.exportExcel(typeList[index])
                });
                firstDiv.appendChild(buttonElement)
            })

        }
    }

    class Test {
        // 示例：模拟长时间运行的操作
        longRunningOperation() {
            var process = new Process(100);
            process.showProgressBar();

            var progressCnt = 0;
            var interval = setInterval(function () {
                progressCnt += 10;
                process.updateProgressBar(progressCnt);

                if (progressCnt >= 100) {
                    clearInterval(interval);
                    process.hideProgressBar();
                }
            }, 1000);
        }
    }

    let process = new Process();
    let queryDataApi = new QueryDataApi();
    let excelExport = new ExcelExport();
    let userInfo = window.sessionStorage.getItem('userInfo');

    class Application {

        // 等待DOM元素加载完毕的函数
        waitForElementToLoad(selector, callback) {
            var observer = new MutationObserver(function (mutationsList, observer) {
                var element = document.querySelector(selector);
                if (element) {
                    // 停止观察变化
                    observer.disconnect();
                    // 执行回调函数
                    callback();
                }
            });

            observer.observe(document.documentElement, { childList: true, subtree: true });
        }

        // 在DOM元素加载完毕后执行的函数
        scriptAfterDOMLoaded() {
            queryDataApi.queryTypeList().then(value => {
                excelExport.generateDownloadButton(value.data.items);
            });
        }

        main() {
            this.waitForElementToLoad(".ivu-table-fixed-body .ivu-table-tbody .ivu-table-row", this.scriptAfterDOMLoaded);
        }
    }

    let application = new Application();
    application.main();

})();