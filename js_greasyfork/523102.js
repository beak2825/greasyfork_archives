// ==UserScript==
// @name         产品编辑工具-店小秘
// @namespace    http://tampermonkey.net/
// @version      5.1.1
// @description  Extract account name, current timestamp, and SKU attributes on Dianxiaomi edit page and populate SKU inputs
// @author       Your Name
// @match        https://www.dianxiaomi.com/web/temu/edit?id=*
// @grant        GM_xmlhttpRequest
// @connect      jianguoyun.com
// @connect      open.feishu.cn
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523102/%E4%BA%A7%E5%93%81%E7%BC%96%E8%BE%91%E5%B7%A5%E5%85%B7-%E5%BA%97%E5%B0%8F%E7%A7%98.user.js
// @updateURL https://update.greasyfork.org/scripts/523102/%E4%BA%A7%E5%93%81%E7%BC%96%E8%BE%91%E5%B7%A5%E5%85%B7-%E5%BA%97%E5%B0%8F%E7%A7%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // ----------------------------------------填写SKU货号-店小秘-----------------------------------------
    // 62进制字符集
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    // 将数字转换为62进制字符串
    function toBase62(num) {
        let result = '';
        while (num > 0) {
            result = chars[num % 62] + result;
            num = Math.floor(num / 62);
        }
        return result || '0';
    }

    // 将62进制字符串还原为数字
    function fromBase62(str) {
        let result = 0;
        for (let i = 0; i < str.length; i++) {
            result = result * 62 + chars.indexOf(str[i]);
        }
        return result;
    }

    function getCurrentTimestamp() {
        const now = new Date();
        const yymmdd = now.getFullYear().toString().slice(2) +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0');
        const HHMM = String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0');
        return yymmdd + HHMM;
    }

    // --------------------查询员工id-------------------
    // 员工id -- 不需要了
    const accountNameMap = {
        "YUEY123": "yy",
        "QIQI1123": "qq",
        "ZIHANxu": "zh",
        "zhaofang123": "zf",
        "NIAN112233": "nn",
        "niannian1123": "zc",
        "ZHangyu1102": "zyy",
        "WANGKAIA": "wk",
        "GTX001": "gtx",
        "WXY0618": "wjy",
        "WJL0721": "wjl",
        "Tanghh123": "thh",
        "ZHIP": "dzp",
        "XUEJ": "jing",
        "HONGY123": "zhy",
        "WangZhe1122": "wz",
        "Ronggang": "srg",
        "WFMing": "wfm",
    };
    // 员工id唯一性检查 -- 不需要了
    function checkDuplicateAccountIDs() {
        const values = Object.values(accountNameMap);
        const duplicates = values.filter((value, index, self) => self.indexOf(value) !== index);
        if (duplicates.length > 0) {
            alert("警告：存在重复运营代号: " + [...new Set(duplicates)].join(", "));
            console.warn("重复的运营代号: ", [...new Set(duplicates)]);
        }
    }

    async function getUserID(accountName) {
        // 参考https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/create?appId=cli_a720855221fb1013
        // 多维表格需要添加APP权限：点击表格右上角“...” -> 选择 “更多” -> 选择“添加应用”；添加后在左边“分享”里改变APP权限为“可管理”
        const app_token = "PdimbM51UaLkb7smtfTcLNQhnBb"; //如果多维表格的 URL 以 feishu.cn/wiki 开头，你需调用知识库相关获取知识空间节点信息接口获取多维表格的 app_token。当 obj_type 的值为 bitable 时，obj_token 字段的值才是多维表格的 app_token https://open.feishu.cn/document/server-docs/docs/wiki-v2/space-node/get_node?appId=cli_a720855221fb1013
        const table_id = "tblpPGyL7cmix2VN";
        const view_id = "vewp9Ut4lc";

        const AppID = "cli_a720855221fb1013"; //飞书开放平台https://open.feishu.cn/ --> 开发者后台
        const AppSecret = "FrdmRnmyFxpMGLdLlxBgxdVHOkwJzvDo";

        // const accountName = "WANGKAIA";

        //获取tenant_access_token
        const response = await makeRequest('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal/', { //console中测试直接替换makeRequest为fetch
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                app_id: AppID,
                app_secret: AppSecret
            })
        });

        // const data_tenant_access_token = await response.json();
        const data_tenant_access_token = await response.response; //跟fetch处理不一样，.response就是json
        const tenant_access_token = data_tenant_access_token.tenant_access_token;
        console.log("tenant_access_token: ", tenant_access_token);

        //查询ID
        const res_searchRecord = await makeRequest(`https://open.feishu.cn/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/search?page_size=500`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tenant_access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "view_id": view_id,
                "field_names": ["ID"],
                "filter": {
                    "conjunction": "and",
                    "conditions": [{
                        "field_name": "店小秘账号",
                        "operator": "is",
                        "value": [accountName]
                    }]
                },
                "automatic_fields": false
            })
        });

        // const data_searchRecord = await res_searchRecord.json();
        const data_searchRecord = await res_searchRecord.response;
        const ID = data_searchRecord.data.items[0]?.fields.ID[0].text || null;

        return ID
    }

    // Hook fetch，拦截请求并用 GM_xmlhttpRequest 代理 --- 仅适用于console测试fetch外部链接飞书，且只能油猴中加载才有用
    function hookFeishuFetch({ matchDomain = "open.feishu.cn", debug = false } = {}) {
        function parseHeaders(headerStr) {
            const headers = new Headers();
            if (!headerStr) return headers;
            headerStr.trim().split("\n").forEach(line => {
                const [key, ...value] = line.split(": ");
                if (key && value.length) {
                    headers.append(key.trim(), value.join(": ").trim());
                }
            });
            return headers;
        }

        async function extractBody(url, options) {
            if (url instanceof Request) {
                const clone = url.clone();
                return await clone.text(); // 返回字符串（如 JSON 字符串）
            } else {
                return options?.body || null;
            }
        }

        unsafeWindow.fetch = async function(url, options) {
            const realUrl = typeof url === "string"
            ? url
            : url instanceof Request
            ? url.url
            : "";

            const method = options?.method || (url instanceof Request ? url.method : "GET");
            const headers = options?.headers || (url instanceof Request ? Object.fromEntries(url.headers.entries()) : {});
            const body = await extractBody(url, options);  // 👈 async 处理 body

            if (debug) {
                console.log("📡 fetch hooked:");
                console.log("   → realUrl:", realUrl);
                console.log("   → method:", method);
                console.log("   → headers:", headers);
                console.log("   → body:", body);
            }

            if (typeof realUrl === "string" && realUrl.includes(matchDomain)) {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method,
                        url: realUrl,
                        headers,
                        data: body,
                        responseType: "json",
                        onload: function(response) {
                            resolve(new Response(JSON.stringify(response.response), {
                                status: response.status,
                                statusText: response.statusText,
                                headers: parseHeaders(response.responseHeaders)
                            }));
                        },
                        onerror: function(error) {
                            reject(new Error("GM_xmlhttpRequest failed: " + JSON.stringify(error)));
                        }
                    });
                });
            } else {
                return window.fetch.call(window, url, options);
            }
        };

        console.log(`🛠️ fetch hook enabled for domain: ${matchDomain}`);
    }

    hookFeishuFetch({
        matchDomain: "open.feishu.cn",  // 要拦截的域名
        debug: false                     // 是否打印调试信息
    });

    // 通用的请求函数，替换 fetch
    function makeRequest(url, options) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method || 'GET',
                url: url,
                headers: options.headers,
                data: options.body,
                responseType: 'json',  // 可以保留为json，虽然返回的响应类型将是原始响应
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        // 直接返回原始的 response 对象
                        resolve(response);
                    } else {
                        reject(new Error(`HTTP error! Status: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // ----------------------------------------产地-店小秘-----------------------------------------
    // 等待加载并找到元素
    function waitForElement(selector, timeout = 8000) {
        return new Promise((resolve, reject) => {
            const interval = 100;
            let elapsed = 0;
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    resolve(el);
                }
                elapsed += interval;
                if (elapsed >= timeout) {
                    clearInterval(timer);
                    reject(`Timeout: ${selector}`);
                }
            }, interval);
        });
    }
    // 模拟点击
    function simulateRealClick(el) {
        ['pointerdown', 'mousedown', 'mouseup', 'click'].forEach(type => {
            el.dispatchEvent(new MouseEvent(type, {
                bubbles: true,
                cancelable: true
            }));
        });
    }
    // ✅ 通用滚动查找器
    async function scrollUntilElementAppears(selector, scrollContainerSelector, maxAttempts = 20) {
        const scrollContainer = await waitForElement(scrollContainerSelector);
        for (let i = 0; i < maxAttempts; i++) {
            const el = document.querySelector(selector);
            if (el) return el;

            scrollContainer.scrollTop += 100;
            await new Promise(res => setTimeout(res, 200));
        }
        throw new Error(`未找到目标元素: ${selector}`);
    }
    // 模拟点击选项
    async function simulateSelect(input_ID, target_title) {
        // ✅ 1. 打开下拉框（通过 input#rc_select_3 找到 select 容器点击）
        const input = await waitForElement(input_ID);
        const selectBox = input.closest('.ant-select').querySelector('.ant-select-selector');
        simulateRealClick(selectBox);

        // ✅ 2. 通用滚动 + 查找目标
        const targetSelector = `div[title="${target_title}"]`;
        const scrollContainerSelector = '.rc-virtual-list-holder'; // 若换成 el-scrollbar、.dropdown-list 也可
        const targetElement = await scrollUntilElementAppears(targetSelector, scrollContainerSelector);

        // ✅ 3. 点击目标项
        simulateRealClick(targetElement);
    }
    // 函数：选择产地浙江省
    async function selectLocation() {
        await simulateSelect('#rc_select_3',"浙江省");
        console.log('已成功选择浙江省');
    }

    // ----------------------------------------SKU货号-店小秘-----------------------------------------
    function setNativeValue(el, value) {
        const lastValue = el.value;
        el.value = value;
        const tracker = el._valueTracker;
        if (tracker) tracker.setValue(lastValue);
        el.dispatchEvent(new Event('input', { bubbles: true }));
    }
    function populateSkuInputs(accountID) {
        const timestamp = Math.floor(Date.now() / 1000);
        const timestamp_Baseb2 = toBase62(timestamp);

        // 1. 获取表头的列顺序
        const headerCells = document.querySelectorAll('div.sku-data-table table thead tr th');
        let colorIndex = -1;
        let sizeIndex = -1;

        headerCells.forEach((th, index) => {
            const text = th.textContent.trim();
            if (text.includes('颜色')) colorIndex = index;
            if (text.includes('尺码')) sizeIndex = index;
        });

        // 2. 遍历每一行 SKU，拼接颜色+尺码
        const skuRows = document.evaluate(
            '//div[@class="sku-data-table"]//tbody//tr',
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );
        for (let i = 0; i < skuRows.snapshotLength; i++) {
            const row = skuRows.snapshotItem(i);
            const cells = row.querySelectorAll('td');

            // SKU货号
            const color = colorIndex >= 0 ? cells[colorIndex]?.textContent.trim() : '';
            const size = sizeIndex >= 0 ? cells[sizeIndex]?.textContent.trim() : '';        
            const combined = [color, size].filter(Boolean).join('-');
            const fullSku = `${accountID}-${timestamp_Baseb2}-${combined}`;            
            const input_sku = cells[Math.max(colorIndex, sizeIndex) + 1].querySelector('input');
            setNativeValue(input_sku, fullSku);
    
            // 尺寸
            const input_dimensions = cells[Math.max(colorIndex, sizeIndex) + 4].querySelectorAll('input');
            const values = [30, 20, 10]; // 长、宽、高
            if (input_dimensions?.length >= 3) {
                input_dimensions.forEach((input, index) => {
                    if (index < values.length) {
                        setNativeValue(input, values[index]);
                    }
                });
            }
    
            // 重量
            const input_weight = cells[Math.max(colorIndex, sizeIndex) + 5].querySelector('input');
            setNativeValue(input_weight, 500);
        };
    }

    // ----------------------------------------外包装信息-店小秘-----------------------------------------
    // 模拟鼠标悬停
    function simulateHover(el) {
        ['mouseenter', 'mouseover'].forEach(type => {
            el.dispatchEvent(new MouseEvent(type, {
                bubbles: true,
                cancelable: true
            }));
        });
    }

    async function addPackageInfo() {
        // -----外包装形状：长方体
        await simulateSelect('#rc_select_5',"长方体");

        // -----外包装类型：软包装+硬物
        await simulateSelect('#rc_select_6',"软包装+硬物");

        // -----三张外包装图
        const targetButton = document.evaluate(
            '//label[@title="外包装图片"]/ancestor::div[contains(@class,"ant-form-item-row")]//div[contains(@class,"ant-form-item-control")]//button',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        simulateHover(targetButton);

        const netImageLi = await waitForElement('li[data-menu-id="net"]');
        await new Promise(res => setTimeout(res, 200));
        netImageLi.click();

        // 修改 textarea 的值
        const textArea = await waitForElement('textarea.ant-input');;
        await new Promise(res => setTimeout(res, 200));
        if (textArea) {
            const urls = [
                'https://www.jianguoyun.com/p/Daj_-HAQxfSEDRjM7-cFIAA',
                'https://www.jianguoyun.com/p/DTOezncQxfSEDRjB7-cFIAA',
                'https://www.jianguoyun.com/p/DfjV4esQxfSEDRjJ7-cFIAA',
            ];
            let IMG_url = '';
            // 遍历 URL 列表并获取 photoURL
            // urls.forEach((url, index) => {
            //     getFullUrl(url, function (fullUrl) { // -- 异步，需要把后续操作都放进去
            //         if (fullUrl) {
            //             IMG_url += `${fullUrl}\n`; // 拼接到 IMG_url
            //         }
            //         // 如果是最后一个 URL，则输出结果 -- 后续操作
            //         if (index === urls.length - 1) {
            //             console.log(`IMG_url = \`\n${IMG_url}\``);
            //             // textArea.value = IMG_url.trim();
            //             // textArea.dispatchEvent(new Event('input', { bubbles: true }));  // ✅ 关键补充
            //             setNativeValue(textArea, IMG_url.trim())
            //             console.log('Textarea value updated successfully!');

            //             // 点击目标按钮
            //             const buttonXPath = '//div[@role="document" and not(contains(@style,"display: none"))]//button[@class="css-l74pc ant-btn ant-btn-primary"]';
            //             const buttonResult = document.evaluate(buttonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

            //             const button = buttonResult.singleNodeValue;
            //             if (button) {
            //                 button.click();
            //                 console.log('Button clicked successfully!');
            //             } else {
            //                 console.warn('Target button not found!');
            //             }
            //         }
            //     });
            // });
            (async () => {
                let fullUrls = [];
                fullUrls = await Promise.all(urls.map(url => getFullUrl(url)));
                // fullUrls = [
                //     'https://wxalbum-10001658.image.myqcloud.com/wxalbum/1297563/20250515091923/39b1269b4d7d15efed66b585d45e612d.jpg',
                //     'https://wxalbum-10001658.image.myqcloud.com/wxalbum/1297563/20250515091923/0f709ce88d0e638df3ab472325f34077.jpg',
                //     'https://wxalbum-10001658.image.myqcloud.com/wxalbum/1297563/20250515091923/dff0f5dcfcabf2dcb2531c56b000468c.jpg',
                // ];
                const IMG_url = fullUrls.filter(Boolean).join('\n');
            
                console.log(`IMG_url = \`\n${IMG_url}\``);
                setNativeValue(textArea, IMG_url.trim())
                console.log('Textarea value updated successfully!');
            
                const buttonXPath = '//div[@role="document" and not(contains(@style,"display: none"))]//button[@class="css-l74pc ant-btn ant-btn-primary"]';
                const buttonResult = document.evaluate(buttonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const button = buttonResult.singleNodeValue;
                if (button) {
                    button.click();
                    console.log('Button clicked successfully!');
                } else {
                    console.warn('Target button not found!');
                }
            })();
        } else {
            console.warn('Textarea not found!');
            return; // 如果没找到目标 textarea，停止后续操作
        }
    }

    // 获取图片链接的方法
    // function getFullUrl(targetUrl, callback) {
    //     GM_xmlhttpRequest({
    //         method: 'GET',
    //         url: targetUrl,
    //         onload: function (response) {
    //             const html = response.responseText;
    //             const photoUrlMatch = html.match(/photoURL:\s*['"]([^'"]+)['"]/);
    //             const fullUrl = photoUrlMatch ? `https://www.jianguoyun.com${photoUrlMatch[1]}` : null;
    //             callback(fullUrl);
    //         }
    //     });
    // }
    function getFullUrl(targetUrl) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: targetUrl,
                onload: function (response) {
                    try {
                        const html = response.responseText;
                        const photoUrlMatch = html.match(/photoURL:\s*['"]([^'"]+)['"]/);
                        const fullUrl = photoUrlMatch ? `https://www.jianguoyun.com${photoUrlMatch[1]}` : null;
                        resolve(fullUrl);
                    } catch (err) {
                        reject(err);
                    }
                },
                onerror: function (err) {
                    reject(err);
                }
            });
        });
    }
    

    // ----------------------------------------加入按钮--------------------------------------------
    // 等待页面加载完成
    window.addEventListener('load', async function () {
        //checkDuplicateAccountIDs()//检查员工id是否重复
        await selectLocation();//选择产地浙江省

        //查询员工id
        const accountNameElement = document.evaluate(
            '//div[contains(@class, "user-name")]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        const accountName = accountNameElement ? accountNameElement.getAttribute('title') || 'Unknown' : 'Unknown';
        const accountID = await getUserID(accountName);
        console.log(accountID);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.top = '30px';
        buttonContainer.style.left = '10px';
        buttonContainer.style.zIndex = '1000';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.alignItems = 'flex-start';

        const buttons = [];

        // 创建按钮的通用部分
        const createButton = (text) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.padding = '10px 20px';
            button.style.backgroundColor = '#007bff';
            button.style.color = '#fff';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            buttons.push(button); // 保存按钮
            return button;
        };

        const button_SKU_No = createButton('填写SKU货号');
        const button_addPackageInfo = createButton('导入商品外包装图');

        // 绑定事件
        button_SKU_No.addEventListener('click', () => populateSkuInputs(accountID));
        button_addPackageInfo.addEventListener('click', addPackageInfo);

        // 统一宽度为最长的按钮
        document.body.appendChild(buttonContainer);
        requestAnimationFrame(() => {
            const maxWidth = Math.max(...buttons.map(btn => btn.offsetWidth));
            buttons.forEach(btn => (btn.style.width = `${maxWidth}px`));
        });

        // 添加按钮到容器
        buttonContainer.appendChild(button_SKU_No);
        buttonContainer.appendChild(button_addPackageInfo);
    });

})();
