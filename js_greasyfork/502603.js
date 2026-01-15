// ==UserScript==
// @name         Gomelend
// @namespace    http://tampermonkey.net/
// @version      v0.6.0
// @description  国美深度分析数据
// @author       Bor1s
// @match        https://ermas-n1.gomelend.cn/
// @match        https://sso-n.gomelend.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gomelend.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502603/Gomelend.user.js
// @updateURL https://update.greasyfork.org/scripts/502603/Gomelend.meta.js
// ==/UserScript==

// 导入xlsx.min.js
let script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.src = "https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.mini.min.js";
document.documentElement.appendChild(script);

(function () {
    const style = document.createElement('style');
    style.innerHTML = `
        body { font-family: 'Microsoft YaHei', sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; }
        #app-container { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); max-width: 1600px; margin: 0 auto; }
        .control-panel { display: flex; gap: 15px; align-items: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
        select, button { padding: 8px 15px; border: 1px solid #dcdfe6; border-radius: 4px; font-size: 14px; cursor: pointer; outline: none; }
        select:hover, button:hover { border-color: #409eff; }
        button#start { background-color: #409eff; color: white; border-color: #409eff; font-weight: bold; }
        button#start:disabled { background-color: #a0cfff; cursor: not-allowed; }
        .status-bar { margin-left: auto; font-size: 14px; color: #606266; }
        .status-bar span { font-weight: bold; color: #303133; }
        /* 表格样式 */
        .table-wrapper { overflow-x: auto; max-height: 75vh; overflow-y: auto; border: 1px solid #ebeef5; border-radius: 4px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { background-color: #fafafa; color: #909399; font-weight: 600; padding: 12px 8px; text-align: left; position: sticky; top: 0; z-index: 10; border-bottom: 1px solid #ebeef5; }
        td { padding: 10px 8px; border-bottom: 1px solid #ebeef5; color: #606266; white-space: nowrap; }
        tr:hover { background-color: #f5f7fa; }
        .tag { padding: 2px 6px; border-radius: 4px; font-size: 12px; }
        .tag-blue { background: #ecf5ff; color: #409eff; border: 1px solid #d9ecff; }
        .tag-red { background: #fef0f0; color: #f56c6c; border: 1px solid #fde2e2; }
    `;
    document.head.appendChild(style);

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
        var body = document.querySelector("body");
        body.innerHTML = `
            <div id="app-container">
                <div class="control-panel">
                    <label>数据类型：</label>
                    <select id="collectionFlag">
                        <option value="Y">多期 (Y)</option>
                        <option value="N">单期 (N)</option>
                    </select>
                    <button id="start">开始采集并导出</button>
                    <div class="status-bar">
                        当前进度：<span id="sNum" style="color:#409eff">0</span> / <span id="eNum">0</span>
                        <span id="statusText" style="margin-left:10px; color:#67c23a"></span>
                    </div>
                </div>
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>序号</th>
                                <th>借款号</th>
                                <th>姓名</th>
                                <th>身份证</th>
                                <th>电话</th>
                                <th>逾期总金额</th>
                                <th>逾期天数</th>
                                <th>分期类型</th>
                                <th>账单日</th>
                                <th>还款行</th>
                            </tr>
                        </thead>
                        <tbody id="data-body">
                            </tbody>
                    </table>
                </div>
            </div>
        `;

        var btn = document.getElementById("start");
        var allData = [];

        function fetchData(page, limit, flag) {
            return fetch('https://ermas-n1.gomelend.cn/newErmas/tellColl/getCaseQueueList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
                body: `isHistory=false&collectionFlag=${flag}&page=${page}&start=${(page - 1) * limit}&limit=${limit}`,
                credentials: 'include'
            })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.text();
            })
            .then(text => {
                try {
                    const fixedText = text.replace(/(\w+):/g, '"$1":');
                    return JSON.parse(fixedText.trim());
                } catch (error) {
                    console.error('Failed to parse JSON:', error);
                    return null;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                return null;
            });
        }

        function fetchIdNo(acctNbr) {
            return fetch(`https://ermas-n1.gomelend.cn/newErmas//tellColl/toWorkbench/tellColl/${acctNbr}/MJ`, {
                method: 'GET', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).then(r => r.text()).then(html => {
                const match = html.match(/var\s+_IDNO\s*=\s*"([^"]+)"/);
                return match ? match[1] : null;
            }).catch(() => null);
        }

        function fetchUserInfo(acctNbr) {
            return fetch(`https://ermas-n1.gomelend.cn/newErmas//collectionWorkbench/getBaseInfoFor6?acctNbr=${acctNbr}`, {
                method: 'GET', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).then(r => r.text()).then(text => {
                try { return JSON.parse(text.replace(/(\w+):/g, '"$1":').trim()).data; } catch { return null; }
            }).catch(() => null);
        }

        function fetchCustomerInfo(acctNbr) {
            return fetch(`https://ermas-n1.gomelend.cn/newErmas//collectionWorkbench/getCustomerInfoFor6?acctNbr=${acctNbr}`, {
                method: 'GET', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).then(r => r.text()).then(text => {
                try { return JSON.parse(text.replace(/(\w+):/g, '"$1":').trim()).data.corpName; } catch { return null; }
            }).catch(() => null);
        }

        function fetchLoanInfo(acctNbr) {
            return fetch(`https://ermas-n1.gomelend.cn/newErmas//collectionWorkbench/getLoanInfoFor6?acctNbr=${acctNbr}`, {
                method: 'GET', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).then(r => r.text()).then(text => {
                try { return JSON.parse(text.slice(19, -1)); } catch { return null; }
            }).catch(() => null);
        }

        function fetchLinkInfo(acctNbr, idNo) {
            return fetch(`https://ermas-n1.gomelend.cn/newErmas/collectionWorkbench/getLinkManInfo?idNo=${idNo}&acctNbr=${acctNbr}&isLeader=N&page=1&start=0&limit=5`, {
                method: 'GET', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).then(r => r.json()).then(data => data.result).catch(() => null);
        }
        function addRowToTable(index, item) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index}</td>
                <td>${item.acctNbr}</td>
                <td><strong>${item.userInfo?.name || '-'}</strong></td>
                <td>${item.idNo || '-'}</td>
                <td>${item.userInfo?.mobileNo || '-'}</td>
                <td style="color:#f56c6c">${item.userInfo?.passDueAmt || '0'}</td>
                <td>${item.userInfo?.overDueDays || '0'}</td>
                <td><span class="tag tag-blue">${item.loanInfo?.loanType || '-'}</span></td>
                <td>${item.loanInfo?.cycleDay || '-'}</td>
                <td>${item.loanInfo?.ddBankName || '-'}</td>
            `;
            document.getElementById('data-body').appendChild(tr);
            const wrapper = document.querySelector('.table-wrapper');
            wrapper.scrollTop = wrapper.scrollHeight;
        }
        function exportXlsx(flag) {
            const customHeader = ["借款号", "姓名", "身份证", "电话", "逾期总金额", "逾期本金", "逾期天数", "分期类型", "账单日", "分期期数", "还款行", "原始单位", "原始户籍地", "联系人姓名1", "电话1", "联系人姓名2", "电话2", "联系人姓名3", "电话3"];
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
            worksheet['!cols'] = [{wch:10}, {wch:10}, {wch:20}, {wch:12}, {wch:10}, {wch:10}, {wch:10}, {wch:10}, {wch:10}, {wch:10}, {wch:10}, {wch:20}, {wch:20}, {wch:10}, {wch:12}, {wch:10}, {wch:12}, {wch:10}, {wch:12}];
            XLSX.utils.book_append_sheet(workbook, worksheet, "导出结果");
            const d = new Date();
            const typeText = flag === 'Y' ? '多期' : '单期';
            const filename = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日_国美${typeText}_数据导出.xlsx`;
            XLSX.writeFile(workbook, filename);
        }

        // --- 按钮点击事件 ---
        btn.addEventListener("click", async function () {
            const flag = document.getElementById("collectionFlag").value;
            console.log("开始运行，模式：", flag);
            btn.disabled = true;
            btn.innerText = "正在采集中...";
            document.getElementById('data-body').innerHTML = ''; // 清空表格
            allData = [];
            const initialData = await fetchData(1, 25, flag);
            if (!initialData) {
                alert("请求失败或数据为0，请检查参数");
                btn.disabled = false;
                btn.innerText = "重新开始";
                return;
            }
            const totalCount = initialData.totalCount;
            const limit = 25;
            const totalPages = Math.ceil(totalCount / limit);
            document.getElementById("eNum").innerText = totalCount;
            document.getElementById("sNum").innerText = 0;
            let globalIndex = 0;
            async function processRow(row) {
                const acctNbr = row.ACCT_NBR;
                const [idNo, userInfo, customerInfo, loanInfo] = await Promise.all([
                    fetchIdNo(acctNbr),
                    fetchUserInfo(acctNbr),
                    fetchCustomerInfo(acctNbr),
                    fetchLoanInfo(acctNbr)
                ]);
                const linkInfo = await fetchLinkInfo(acctNbr, idNo);
                const completeData = { acctNbr, idNo, userInfo, customerInfo, loanInfo, linkInfo };
                allData.push(completeData);
                globalIndex++;
                document.getElementById("sNum").innerText = globalIndex;
                addRowToTable(globalIndex, completeData);
            }
            if (initialData.rows) {
                for (const row of initialData.rows) {
                    await processRow(row);
                }
            }
            for (let page = 2; page <= totalPages; page++) {
                const data = await fetchData(page, limit, flag);
                if (data && data.rows) {
                    for (const row of data.rows) {
                        await processRow(row);
                    }
                }
            }
            document.getElementById("statusText").innerText = "采集完成，正在导出...";
            exportXlsx(flag);
            btn.disabled = false;
            btn.innerText = "再次运行";
            document.getElementById("statusText").innerText = "已完成";
        });
    }

})();