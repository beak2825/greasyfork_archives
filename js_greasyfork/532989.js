// ==UserScript==
// @name         bcs上架插件
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自动填写仓库字段、替换 cookie，并提取勾选行的 SKU、价格、图片，加价计算，支持店铺选择与一键添加
// @match        https://www.bcsozon.top/selectionZone/china
// @grant        none
// @license      TANGMING
// @downloadURL https://update.greasyfork.org/scripts/532989/bcs%E4%B8%8A%E6%9E%B6%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/532989/bcs%E4%B8%8A%E6%9E%B6%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
// 添加按钮到页面
    const button = document.createElement("button");
    button.innerText = "采集商品并设置库存";
    button.style.position = "fixed";
    button.style.top = "100px";
    button.style.right = "20px";
    button.style.zIndex = "9999";
    button.style.padding = "10px 16px";
    button.style.background = "#409EFF";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "4px";
    button.style.cursor = "pointer";
    button.onclick = extractCheckedRows;
    document.body.appendChild(button);

    // 显示 loading 遮罩
    function showLoading(text = "处理中...") {
        let loadingEl = document.createElement('div');
        loadingEl.id = 'custom-loading-mask';
        loadingEl.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.4);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        loadingEl.innerHTML = `
            <div style="background: white; padding: 24px 32px; border-radius: 10px; font-size: 18px; font-weight: bold; color: #409EFF; box-shadow: 0 0 15px rgba(0,0,0,0.2);">
                🔄 ${text}
            </div>
        `;
        document.body.appendChild(loadingEl);
    }

    // 隐藏 loading 遮罩
    function hideLoading() {
        const loadingEl = document.getElementById('custom-loading-mask');
        if (loadingEl) {
            loadingEl.remove();
        }
    }

    // 显示右下角通知
    function notify(msg, color = "#67C23A") {
        const notice = document.createElement('div');
        notice.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: ${color};
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 10001;
        `;
        notice.innerText = msg;
        document.body.appendChild(notice);
        setTimeout(() => notice.remove(), 3000);
    }

    console.log("✅ 脚本已注入！");

    const CHECKBOX_CLASS = 'my-checkbox-cell';

    async function fetchShops() {
        try {
            const adminToken = document.cookie.split('; ').find(row => row.startsWith('Admin-Token='))?.split('=')[1];
            if (!adminToken) {
                alert("❌ 未找到 Admin-Token，请检查是否已登录！");
                return [];
            }

            const res = await fetch("https://www.bcsozon.top/prod-api/system/ozonShop/ozon/list", {
                headers: {
                    accept: "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                    authorization: `Bearer ${adminToken}`,
                    "cache-control": "no-cache",
                    pragma: "no-cache"
                },
                method: "GET",
                mode: "cors",
                credentials: "include"
            });

            const data = await res.json();
            return data?.data?.rows || [];
        } catch (err) {
            console.error("❌ 获取店铺失败", err);
            return [];
        }
    }

    function addControlPanel(shops) {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            background: #fff;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        `;

        const options = shops.map(shop => `<option value="${shop.id}">${shop.shopUsername}</option>`).join('');

        panel.innerHTML = `
            <div style="margin-bottom: 8px;">
                <select id="shopSelect" style="height: 36px; width: 200px;">
                    <option value="">请选择店铺</option>
                    ${options}
                </select>
            </div>
            <div style="margin-bottom: 8px;">
                <input type="text" id="shopNameInput" readonly placeholder="请选择店铺" class="el-input__inner" style="height: 36px; width: 200px;">
            </div>
                    <div style="margin-bottom: 8px;">
            <button id="btnSelectAll" style="width: 200px; height: 36px; background: #67C23A; color: white; border: none; border-radius: 4px;">全选当前页</button>
        </div>
        <div style="margin-bottom: 8px;">
            <button id="btnDeselectAll" style="width: 200px; height: 36px; background: #F56C6C; color: white; border: none; border-radius: 4px;">取消全选</button>
        </div>
            <div style="margin-bottom: 8px;">
                <button id="btnExtract" style="width: 200px; height: 36px; background: #409EFF; color: white; border: none; border-radius: 4px;">采集商品并且设置库存</button>
            </div>
        `;

        document.body.appendChild(panel);
        // 全选按钮
        document.getElementById('btnSelectAll').addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('input[type="checkbox"].my-row-check');
            checkboxes.forEach(checkbox => checkbox.checked = true);
        });

        // 取消全选按钮
        document.getElementById('btnDeselectAll').addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('input[type="checkbox"].my-row-check');
            checkboxes.forEach(checkbox => checkbox.checked = false);
        });
        document.getElementById('btnExtract').addEventListener('click', extractCheckedRows);
        document.getElementById('btnMarkup').addEventListener('click', calculateMarkup);
        document.getElementById('btnAddToShop').addEventListener('click', addToSelectedShop);

        document.getElementById('shopSelect').addEventListener('change', (e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            document.getElementById('shopNameInput').value = selectedOption.text;
        });
    }

    async function extractCheckedRows() {

        const button = document.getElementById('btnExtract');
        button.disabled = true;
        const originalText = button.innerText;
        button.innerText = "处理中...";

        const checkedRows = [];
        const token = document.cookie.split('; ').find(c => c.startsWith('Admin-Token='))?.split('=')[1];
        if (!token) {
            alert("❌ 未获取到 Admin-Token，请确认已登录！");
            button.disabled = false;
            button.innerText = originalText;
            return;
        }

        const checkboxes = document.querySelectorAll('input[type="checkbox"].my-row-check:checked');
        if (checkboxes.length === 0) {
            alert("⚠️ 没有勾选任何行！");
            button.disabled = false;
            button.innerText = originalText;
            return;
        }

        const clientId = document.getElementById('shopSelect').value;
        if (!clientId) {
            alert("❌ 请选择一个店铺！");
            button.disabled = false;
            button.innerText = originalText;
            return;
        }
        showLoading("正在采集并设置库存，请稍候...");

        try {
            // 获取仓库 ID
            const res = await fetch("https://www.bcsozon.top/prod-api/system/ozonRecord/warehouse", {
                method: "POST",
                credentials: "include",
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "content-type": "application/json;charset=UTF-8",
                    "authorization": "Bearer " + token,
                },
                body: JSON.stringify({shopId: clientId})
            });
            const result = await res.json();
            const warehouse_id = result?.data?.result?.[0]?.warehouse_id;
            if (!warehouse_id) throw new Error("未获取到仓库ID");

            // 获取用户名
            const profile_res = await fetch("https://www.bcsozon.top/prod-api/system/user/profile", {
                method: "GET",
                credentials: "include",
                headers: {
                    "authorization": "Bearer " + token
                },
            });
            const profile_res_json = await profile_res.json();
            const userName = profile_res_json?.data?.userName;

            // 逐个处理勾选项
            for (const checkbox of checkboxes) {
                const row = checkbox.closest('tr');
                const cells = row.querySelectorAll('td');

                const img = row.querySelector('img')?.src || '';
                const sku = cells[2]?.innerText.trim();
                const priceText = cells[14]?.innerText.trim();
                const price = parseFloat(priceText?.replace(/[^\d.]/g, '') || 0);

                try {
                    const catRes = await fetch("https://www.bcsozon.top/prod-api/system/ozonRecord/getCategoryId", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "authorization": "Bearer " + token,
                            "content-type": "application/json;charset=UTF-8"
                        },
                        body: JSON.stringify({
                            oModel: true,
                            brandStatus: true,
                            sku
                        })
                    });

                    const categoryId = (await catRes.json())?.data;

                    // 添加商品
                    const addRes = await fetch("https://www.bcsozon.top/prod-api/system/ozonRecord/ht/user/add", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "authorization": "Bearer " + token,
                            "content-type": "application/json;charset=UTF-8"
                        },
                        body: JSON.stringify({
                            oModel: true,
                            brandStatus: true,
                            sku: parseInt(sku),
                            categoryId: categoryId,
                            categories: [],
                            price: price * 0.0856 * 1.15,
                            shopIds: [parseInt(clientId)],
                            sourcess: []
                        })
                    });

                    const addJson = await addRes.json();
                    if (addJson.code === 200) {
                        const prodRes = await fetch(`https://www.bcsozon.top/prod-api/system/ozonRecord/ozon/list?pageNum=1&pageSize=10&username=${userName}&sku=${sku}`, {
                            method: "GET",
                            credentials: "include",
                            headers: {
                                "authorization": "Bearer " + token
                            }
                        });

                        const prodData = await prodRes.json();
                        const ofprid = prodData?.rows?.[0]?.offerId;

                        // 设置库存
                        await fetch("https://www.bcsozon.top/prod-api/system/ozonRecord/pl/add/stocks", {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                "authorization": "Bearer " + token,
                                "content-type": "application/json;charset=UTF-8"
                            },
                            body: JSON.stringify({
                                warehouseId: warehouse_id,
                                stock: "999",
                                ofprid: [`${ofprid},0`]
                            })
                        });
                    } else {
                        alert(`❌ SKU ${sku} 添加失败：${addJson.msg || "未知错误"}`);
                    }

                    checkedRows.push({img, sku, price, categoryId});

                } catch (itemErr) {
                    console.error(`❌ 处理 SKU ${sku} 时出错:`, itemErr);
                    alert(`❌ SKU ${sku} 处理失败，请检查控制台`);
                }
            }

            console.table(checkedRows);
            hideLoading();
            notify("✅ 处理完成");
            alert(`✅ 成功处理 ${checkedRows.length} 个商品！`);
            window._checkedRows = checkedRows;

        } catch (err) {
            console.error("❌ 整体处理失败：", err);
            alert("❌ 操作失败，请查看控制台详情！");
        } finally {
            button.disabled = false;
            button.innerText = originalText;
        }
    }


    function addCheckboxToRows(rows) {
        rows.forEach((row, index) => {
            if (row.querySelector(`.${CHECKBOX_CLASS}`)) return;
            const checkboxTd = document.createElement('td');
            checkboxTd.className = `el-table__cell ${CHECKBOX_CLASS} is-center`;
            checkboxTd.style.textAlign = 'center';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'my-row-check';
            checkbox.dataset.index = index;

            checkboxTd.appendChild(checkbox);
            row.insertBefore(checkboxTd, row.firstChild);
        });
    }

    function addCheckboxHeader() {
        const headerRow = document.querySelector('.el-table__header-wrapper thead tr');
        if (headerRow && !headerRow.querySelector(`.${CHECKBOX_CLASS}`)) {
            const th = document.createElement('th');
            th.className = `el-table__cell ${CHECKBOX_CLASS} is-center`;
            th.innerText = '选择';
            headerRow.insertBefore(th, headerRow.firstChild);
        }
    }

    const waitForTable = setInterval(async () => {
        const rows = document.querySelectorAll('.el-table__body-wrapper tbody tr');
        if (rows.length > 0) {
            clearInterval(waitForTable);
            addCheckboxToRows(rows);
            addCheckboxHeader();
            const shops = await fetchShops();
            addControlPanel(shops);
        }
    }, 500);
})();
