// ==UserScript==
// @name         Gomelend
// @namespace    http://tampermonkey.net/
// @version      v0.5.2
// @description  国美深度分析数据
// @author       Bor1s
// @match        https://ermas-n1.gomelend.cn/
// @match        https://sso-n.gomelend.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gomelend.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502603/Gomelend.user.js
// @updateURL https://update.greasyfork.org/scripts/502603/Gomelend.meta.js
// ==/UserScript==



//导入xlsx.min.js
let script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.src = "https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.mini.min.js";
document.documentElement.appendChild(script);

(function () {
    'use strict';

    var currentUrl = window.location.href;

    if (currentUrl.indexOf('sso-n.gomelend.cn') !== -1) {
        var checkExistence = setInterval(function () {
            var targetContainer = document.querySelector("#panal");
            if (targetContainer) {
                clearInterval(checkExistence);
                targetContainer.setAttribute('target', '_blank');
                targetContainer.href = 'https://ermas-n1.gomelend.cn/';
                targetContainer.innerText = '前往获取数据';
            }
        }, 1000);

    }

    if (currentUrl.indexOf('ermas-n1.gomelend.cn') !== -1) {
        // 创建一个按钮并添加到页面上
        var body = document.querySelector("body");
        body.innerHTML = '<button id="start">开始运行</button><p><span id="sNum">0</span>/<span id="eNum">0</span></p>';
        var btn = document.getElementById("start");

        // 定义一个数组来存放所有页的 ACCT_NBR, idNo, userinfo 和 linkInfo 数据
        var allData = [];

        // 定义一个函数来请求数据
        function fetchData(page, limit) {
            return fetch('https://ermas-n1.gomelend.cn/newErmas/tellColl/getCaseQueueList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
                body: `isHistory=false&collectionFlag=Y&page=${page}&start=${(page - 1) * limit}&limit=${limit}`,
                credentials: 'include'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(text => {
                    try {
                        const fixedText = text.replace(/(\w+):/g, '"$1":');
                        const trimmedText = fixedText.trim();
                        const data = JSON.parse(trimmedText);
                        return data;
                    } catch (error) {
                        // 如果解析失败
                        console.error('Failed to parse JSON from text:', error);
                        return null;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    return null;
                });
        }

        // 定义一个函数来请求 idNo
        function fetchIdNo(acctNbr) {
            return fetch(`https://ermas-n1.gomelend.cn/newErmas//tellColl/toWorkbench/tellColl/${acctNbr}/MJ`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const scripts = doc.querySelectorAll('script');
                    let idno = null;
                    scripts.forEach(script => {
                        const scriptContent = script.textContent;
                        const match = scriptContent.match(/var\s+_IDNO\s*=\s*"([^"]+)"/);
                        if (match && match[1]) {
                            idno = match[1];
                        }
                    });
                    return idno;
                })
                .catch(error => {
                    console.error('Error:', error);
                    return null;
                });
        }

        // 定义一个函数来请求 userinfo
        function fetchUserInfo(acctNbr) {
            return fetch(`https://ermas-n1.gomelend.cn/newErmas//collectionWorkbench/getBaseInfoFor6?acctNbr=${acctNbr}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(text => {
                    try {
                        const fixedText = text.replace(/(\w+):/g, '"$1":');
                        const trimmedText = fixedText.trim();
                        const data = JSON.parse(trimmedText);
                        return data.data;
                    } catch (error) {
                        // 如果解析失败
                        console.error('Failed to parse JSON from text:', error);
                        return null;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    return null;
                });
        }
        //定义一个函数来请求customerInfo
        function fetchCustomerInfo(acctNbr) {
            return fetch(`https://ermas-n1.gomelend.cn/newErmas//collectionWorkbench/getCustomerInfoFor6?acctNbr=${acctNbr}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(text => {
                    try {
                        const fixedText = text.replace(/(\w+):/g, '"$1":');
                        const trimmedText = fixedText.trim();
                        const data = JSON.parse(trimmedText);
                        return data.data.corpName;
                    } catch (error) {
                        // 如果解析失败
                        console.error('Failed to parse JSON from text:', error);
                        return null;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    return null;
                });
        }
//定义一个函数来请求LoanInfoFor
        function fetchLoanInfo(acctNbr) {
            return fetch(`https://ermas-n1.gomelend.cn/newErmas//collectionWorkbench/getLoanInfoFor6?acctNbr=${acctNbr}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(text => {
                    try {
                        const trimmedText = text.slice(19,-1);
                        const data = JSON.parse(trimmedText);
                        return data;
                    } catch (error) {
                        // 如果解析失败
                        console.error('Failed to parse JSON from text:', error);
                        return null;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    return null;
                });
        }

        // 定义一个函数来请求 linkInfo
        function fetchLinkInfo(acctNbr, idNo) {
            return fetch(`https://ermas-n1.gomelend.cn/newErmas/collectionWorkbench/getLinkManInfo?idNo=${idNo}&acctNbr=${acctNbr}&isLeader=N&page=1&start=0&limit=5`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => data.result)
                .catch(error => {
                    console.error('Error:', error);
                    return null;
                });
        }
        function exportXlsx() {
            const customHeader = ["借款号", "姓名", "身份证", "电话", "逾期总金额","逾期本金", "逾期天数", "分期类型","账单日","分期期数","还款行","原始单位", "原始户籍地", "联系人姓名1", "电话1", "联系人姓名2", "电话2", "联系人姓名3", "电话3"];
            const formattedData = allData.map(item => ({
                "借款号": item?.userInfo?.contrNbr ?? "",
                "姓名": item?.userInfo?.name ?? "",
                "身份证": item?.idNo ?? "",
                "电话": item?.userInfo?.mobileNo ?? "",
                "逾期总金额": item?.userInfo?.passDueAmt ?? "",
                "逾期本金": item?.userInfo?.overduePrincipal ?? "",
                "逾期天数": item?.userInfo?.overDueDays ?? "",
                "分期类型": item?.loanInfo?.loanType ?? "",
                "账单日": item?.loanInfo?.cycleDay ?? "",
                "分期期数": item?.loanInfo?.loanInitTerm ?? "",
                "还款行": item?.loanInfo?.ddBankName ?? "",
                "原始单位": item?.customerInfo ?? "",
                "原始户籍地": item?.userInfo?.registerAddress ?? "",
                "联系人姓名1": item?.linkInfo?.[0]?.name ?? "",
                "电话1": item?.linkInfo?.[0]?.mobileNo ?? "",
                "联系人姓名2": item?.linkInfo?.[1]?.name ?? "",
                "电话2": item?.linkInfo?.[1]?.mobileNo ?? "",
                "联系人姓名3": item?.linkInfo?.[2]?.name ?? "",
                "电话3": item?.linkInfo?.[2]?.mobileNo ?? "",
            }));
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: customHeader });
            worksheet['!cols'] = [
                { wch: 10 },
                { wch: 10 },
                { wch: 20 },
                { wch: 12 },
                { wch: 10 },
                { wch: 10 },
                { wch: 10 },
                { wch: 10 },
                { wch: 10 },
                { wch: 10 },
                { wch: 10 },
                { wch: 20 },
                { wch: 20 },
                { wch: 10 },
                { wch: 12 },
                { wch: 10 },
                { wch: 12 },
                { wch: 10 },
                { wch: 12 }
            ];
            XLSX.utils.book_append_sheet(workbook, worksheet, "导出结果");
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;
            const currentDay = currentDate.getDate();
            XLSX.writeFile(workbook, `${currentYear}年${currentMonth}月${currentDay}日_国美-导出数据.xlsx`);
        }

        // 添加按钮点击事件监听器
        btn.addEventListener("click", async function () {
            console.log("点击了按钮");

            // 请求第一页数据以获取总数量和每页数量
            const initialData = await fetchData(1, 25);
            if (!initialData) return;

            // 计算总页数
            const totalCount = initialData.totalCount;
            const limit = 25;
            const totalPages = Math.ceil(totalCount / limit);
            document.getElementById("eNum").innerText = totalCount;
            document.getElementById("sNum").innerText = 1;

            // 维护一个全局计数器来追踪当前处理的总行数
            let globalIndex = 0;

            // 提取第一页数据中的 ACCT_NBR 并获取 idNo, userinfo 和 linkInfo
            for (let index = 0; index < initialData.rows.length; index++) {
                const row = initialData.rows[index];
                const acctNbr = row.ACCT_NBR;
                const idNo = await fetchIdNo(acctNbr);
                const userInfo = await fetchUserInfo(acctNbr);
                const customerInfo = await fetchCustomerInfo(acctNbr);
                const loanInfo = await fetchLoanInfo(acctNbr);
                const linkInfo = await fetchLinkInfo(acctNbr, idNo);
                allData.push({ acctNbr, idNo, userInfo, customerInfo,loanInfo, linkInfo });

                // 更新全局索引
                globalIndex++;
                document.getElementById("sNum").innerText = globalIndex;
            }

            // 请求剩余所有页的数据并获取 idNo, userinfo 和 linkInfo
            for (let page = 2; page <= totalPages; page++) {
                const data = await fetchData(page, limit);
                if (data) {
                    for (let index = 0; index < data.rows.length; index++) {
                        const row = data.rows[index];
                        const acctNbr = row.ACCT_NBR;
                        const idNo = await fetchIdNo(acctNbr);
                        const userInfo = await fetchUserInfo(acctNbr);
                        const customerInfo = await fetchCustomerInfo(acctNbr);
                        const loanInfo = await fetchLoanInfo(acctNbr);
                        const linkInfo = await fetchLinkInfo(acctNbr, idNo);
                        allData.push({ acctNbr, idNo, userInfo, customerInfo,loanInfo, linkInfo });

                        // 更新全局索引
                        globalIndex++;
                        document.getElementById("sNum").innerText = globalIndex;
                    }
                }
            }

            // 输出所有数据
            console.log(allData);
            exportXlsx();
            document.getElementById("sNum").innerText = "已完成";
        });
    }

})();
