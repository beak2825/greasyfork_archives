// ==UserScript==
// @name         售价同步 - TEMU卖家中心
// @namespace    http://tampermonkey.net/
// @version      2.2.1
// @description  TEMU卖家中心更新 上新生命周期->已创建首单|已发布到站点|已下架/终止 中所有SPU的全部sku日常和活动价到飞书多维表格；管理绕过CSP，允许 Feishu API 请求；上传若报错持续上传
// @author       wk
// @match        https://seller.kuajingmaihuo.com/main/product/seller-select
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      open.feishu.cn
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527272/%E5%94%AE%E4%BB%B7%E5%90%8C%E6%AD%A5%20-%20TEMU%E5%8D%96%E5%AE%B6%E4%B8%AD%E5%BF%83.user.js
// @updateURL https://update.greasyfork.org/scripts/527272/%E5%94%AE%E4%BB%B7%E5%90%8C%E6%AD%A5%20-%20TEMU%E5%8D%96%E5%AE%B6%E4%B8%AD%E5%BF%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function getUserInfo() {
        // 获取当前主体下 [店铺名 和 mallID]，只要全托 isSemiManagedMall: false

        const response = await fetch("https://seller.kuajingmaihuo.com/bg/quiet/api/mms/userInfo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const dataJson = await response.json();
        const companyList = dataJson.result.companyList;
        const nonSemiManagedMallList = companyList.flatMap(company =>
            company.malInfoList
                .filter(mall => mall.isSemiManagedMall === false)
                .map(mall => ({
                    mallName: mall.mallName,
                    mallId: mall.mallId
                }))
        );

        console.log(nonSemiManagedMallList);
        return nonSemiManagedMallList;
    }

    async function getAllSPU(mallId, ListID=11, pageNum=1) {
        //获取 上新生命周期管理 下 已创建首单（ListID=11）已发布到站点（ListID=12）已下架（ListID=13）已终止（ListID=17）的所有spu
        console.log(`获取List ${ListID} 的全部SPU`);

        if (!mallId) {
            mallId = localStorage.getItem('mall-info-id');
            console.log("mallId:", mallId);
        }

        try {
            const response = await fetch("https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/xmen/select/searchForChainSupplier", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "mallid": mallId
                },
                body: JSON.stringify({
                    pageSize: 100,
                    pageNum: pageNum,
                    secondarySelectStatusList: [ListID],
                    supplierTodoTypeList: []
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const dataJson = await response.json();//必须let，后面递归重新赋值
            
            let SPUs = dataJson?.result?.dataList?.map(item => item.productId) || [];
            console.log(`请求${ListID}第${pageNum}页SPU成功, SPUs:`, SPUs);

            // 如果数据达到上限，递归获取下一页数据
            if (SPUs.length === 100) {
                const nextPageSPUs = await getAllSPU(mallId, ListID, pageNum + 1);
                SPUs = [...SPUs, ...nextPageSPUs]; // 合并数组
            }

            return SPUs;
        } catch (error) {
            console.error(`请求${ListID}第${pageNum}页SPU失败:`, error);
            return [];
        }
    }

    async function getSKUPrices(mallId, SPUs_List) {
        //获取所有spu list下面全部sku的日常价格、最低活动价、货币
        const SKUPricesList = []; // 用来存储所有的 SKU 信息

        if (!mallId) {
            mallId = localStorage.getItem('mall-info-id');
            console.log("mallId:", mallId);
        }
        
        // 循环每个 spu
        let temp = 1; 
        for (const spu of SPUs_List) {
            console.log(`正在获取SKU信息：${temp}/${SPUs_List.length}`)
            const spuRes = await fetch("https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/magneto/price-adjust/product-adjust-query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "mallid": mallId
                },
                body: JSON.stringify({
                    items: [
                        {
                            supplierId: mallId,
                            productId: spu
                        }
                    ]
                })
            });
            const spuJson = await spuRes.json();
            const skcList = spuJson?.result?.spuAdjustResult[spu]?.skcItems?.map(item => item.productSkcId) || [];
            
            
            // 循环每个 skc
            for (const skc of skcList) {
                const skuPriceList = spuJson?.result?.adjustResult?.[skc]?.skuPriceList || [];
                
                // 循环每个 sku
                for (const skuData of skuPriceList) {
                    // 不能只选择核价通过的 sku （skuData.orderStatus === 0），因为有些上架后系统会发起调价导致skuData.orderStatus变1
                    const sku = `${skuData.productSkuId}`; // 强制转换为字符串
                    const skuNormalPrice = skuData.originSupplyPrice / 100;
                    const prices = skuData?.marketingActivityPriceDTOList?.map(item => item.supplyPrice) || [];
                    const skuMinPriceProAct = prices.length > 0 ? Math.min(...prices) / 100 : skuNormalPrice;
                    const currency = skuData.priceCurrency;
                    
                    // 将每个 SKU 信息添加到 SKUPricesList 数组中
                    SKUPricesList.push({ "SKU" : sku, "日常价格" : skuNormalPrice, "活动后最低价" : skuMinPriceProAct, "货币单位" : currency });
                }
            }
            temp = temp + 1;
        }

        return SKUPricesList;  // 返回所有 SKU 信息
    }

    async function searchFeishu_batch({
        // 参考https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/create?appId=cli_a720855221fb1013
        // 多维表格需要添加APP权限：点击表格右上角“...” -> 选择 “更多” -> 选择“添加应用”；添加后在左边“分享”里改变APP权限为“可管理”
        app_token = "O2PebplRpa0pLFsmND8c40RPnGf", //如果多维表格的 URL 以 feishu.cn/wiki 开头，你需调用知识库相关获取知识空间节点信息接口获取多维表格的 app_token。当 obj_type 的值为 bitable 时，obj_token 字段的值才是多维表格的 app_token https://open.feishu.cn/document/server-docs/docs/wiki-v2/space-node/get_node?appId=cli_a720855221fb1013
        table_id = "tblEu0iGt5kxE12w",
        view_id = "vewas7Kt4n",
        field_names = ["SKU", "日常价格", "活动后最低价", "货币单位"],
        data = [{"SKU" : "test001", "日常价格" : -999.99, "活动后最低价" : -999.99, "货币单位" : "CNY"}]
    }) {
        // 批量查询飞书表格，把SKU分为已有记录和无记录两类
        console.log(`处理飞书多维表格: ${table_id}, 数据:`, data);

        const AppID = "cli_a720855221fb1013"; //飞书开放平台https://open.feishu.cn/ --> 开发者后台
        const AppSecret = "FrdmRnmyFxpMGLdLlxBgxdVHOkwJzvDo";

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

        //查询
        //组装查询条件
        const primary_field = field_names[0]; // 默认第一个字段为主键
        // 构建批量查询条件
        const filterConditions = data.map(item => ({
            field_name: primary_field,
            operator: "is",
            value: [item[primary_field]]
        }));

        const res_searchRecord = await makeRequest(`https://open.feishu.cn/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/search?page_size=500`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tenant_access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "view_id": view_id,
                "field_names": field_names,
                "filter": {
                    "conjunction": "or",
                    "conditions": filterConditions
                },
                "automatic_fields": false
            })
        });

        // const data_searchRecord = await res_searchRecord.json();
        const data_searchRecord = await res_searchRecord.response;

        // 创建 SKU 到原始数据的映射
        const dataMap = new Map(data.map(item => [item[primary_field], item]));
        // 处理查询结果
        const existingSKUs = data_searchRecord.data.items.map(item => {
            const sku = item.fields.SKU[0].text;
            const originalData = dataMap.get(sku);  // 从切片数据中获取最新信息
            return {
                "SKU": sku,  // 假设SKU字段是array类型，取第一个值
                "日常价格": originalData ? originalData["日常价格"] : null,
                "活动后最低价": originalData ? originalData["活动后最低价"] : null,
                "货币单位": originalData ? originalData["货币单位"] : null,
                "record_id": item.record_id
            }
        });
        // nonExistingSKUs 从原始 data 中获取完整信息
        const nonExistingSKUs = data
            .filter(item => !existingSKUs.some(record => record.SKU === item[primary_field]))
            .map(item => ({
                "SKU": item["SKU"],
                "日常价格": item["日常价格"],
                "活动后最低价": item["活动后最低价"],
                "货币单位": item["货币单位"]
            }));

        return { existingSKUs, nonExistingSKUs };
    }

    async function updateFeishu_batch({
        // 参考https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/create?appId=cli_a720855221fb1013
        // 多维表格需要添加APP权限：点击表格右上角“...” -> 选择 “更多” -> 选择“添加应用”；添加后在左边“分享”里改变APP权限为“可管理”
        app_token = "O2PebplRpa0pLFsmND8c40RPnGf", //如果多维表格的 URL 以 feishu.cn/wiki 开头，你需调用知识库相关获取知识空间节点信息接口获取多维表格的 app_token。当 obj_type 的值为 bitable 时，obj_token 字段的值才是多维表格的 app_token https://open.feishu.cn/document/server-docs/docs/wiki-v2/space-node/get_node?appId=cli_a720855221fb1013
        table_id = "tblEu0iGt5kxE12w",
        data = [{"SKU" : "test001", "日常价格" : -999.99, "活动后最低价" : -999.99, "货币单位" : "CNY", "record_id": "recuDeWdbMYIDI"}]
    }) {
        // 批量更新飞书记录
        const AppID = "cli_a720855221fb1013"; //飞书开放平台https://open.feishu.cn/ --> 开发者后台
        const AppSecret = "FrdmRnmyFxpMGLdLlxBgxdVHOkwJzvDo";

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

        // 组装 data 到新的 records 结构
        const records = data.map(item => ({
            "record_id": item.record_id,
            "fields": {
                "SKU": item.SKU,
                "日常价格": item["日常价格"],
                "活动后最低价": item["活动后最低价"],
                "货币单位": item["货币单位"]
            }
        }));

        const res_updateRecord = await makeRequest(`https://open.feishu.cn/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/batch_update`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tenant_access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "records": records })
        });

        // const data_updateRecord = await res_updateRecord.json();
        const data_updateRecord = await res_updateRecord.response;
        if (data_updateRecord.code === 0) {
            console.log("更新记录：", data_updateRecord.msg);
        } else {
            throw new Error(`更新错误: ${data_updateRecord.msg}`);
        }
    }

    async function createFeishu_batch({
        // 参考https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/create?appId=cli_a720855221fb1013
        // 多维表格需要添加APP权限：点击表格右上角“...” -> 选择 “更多” -> 选择“添加应用”；添加后在左边“分享”里改变APP权限为“可管理”
        app_token = "O2PebplRpa0pLFsmND8c40RPnGf", //如果多维表格的 URL 以 feishu.cn/wiki 开头，你需调用知识库相关获取知识空间节点信息接口获取多维表格的 app_token。当 obj_type 的值为 bitable 时，obj_token 字段的值才是多维表格的 app_token https://open.feishu.cn/document/server-docs/docs/wiki-v2/space-node/get_node?appId=cli_a720855221fb1013
        table_id = "tblEu0iGt5kxE12w",
        data = [{"SKU" : "test001", "日常价格" : -999.99, "活动后最低价" : -999.99, "货币单位" : "CNY", "record_id": "recuDeWdbMYIDI"}]
    }) {
        // 批量新建飞书记录
        const AppID = "cli_a720855221fb1013"; //飞书开放平台https://open.feishu.cn/ --> 开发者后台
        const AppSecret = "FrdmRnmyFxpMGLdLlxBgxdVHOkwJzvDo";

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

        // 组装 data 到新的 records 结构
        const records = data.map(item => ({
            "fields": {
                "SKU": item.SKU,
                "日常价格": item["日常价格"],
                "活动后最低价": item["活动后最低价"],
                "货币单位": item["货币单位"]
            }
        }));

        const res_createRecord = await makeRequest(`https://open.feishu.cn/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/batch_create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tenant_access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "records": records })
        });

        // const data_createRecord = await res_createRecord.json();
        const data_createRecord = await res_createRecord.response;
        if (data_createRecord.code === 0) {
            console.log("新增记录：", data_createRecord.msg);
        } else {
            throw new Error(`新增错误: ${data_createRecord.msg}`);
        }
    }

    async function updateToFeishu_single({
        // 参考https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/create?appId=cli_a720855221fb1013
        // 多维表格需要添加APP权限：点击表格右上角“...” -> 选择 “更多” -> 选择“添加应用”；添加后在左边“分享”里改变APP权限为“可管理”
        app_token = "O2PebplRpa0pLFsmND8c40RPnGf", //如果多维表格的 URL 以 feishu.cn/wiki 开头，你需调用知识库相关获取知识空间节点信息接口获取多维表格的 app_token。当 obj_type 的值为 bitable 时，obj_token 字段的值才是多维表格的 app_token https://open.feishu.cn/document/server-docs/docs/wiki-v2/space-node/get_node?appId=cli_a720855221fb1013
        table_id = "tblEu0iGt5kxE12w",
        view_id = "vewas7Kt4n",
        field_names = ["SKU", "日常价格", "活动后最低价", "货币单位"],
        data = {"SKU" : "test001", "日常价格" : -999.99, "活动后最低价" : -999.99, "货币单位" : "CNY"}
    }) {
        //用api把数据更新到飞书数据表 （先查询记录（根据第一项）是否存在，存在就更新记录，不存在就新增记录）
        console.log(`更新飞书多维表格: ${table_id}, 数据:`, data);

        const AppID = "cli_a720855221fb1013"; //飞书开放平台https://open.feishu.cn/ --> 开发者后台
        const AppSecret = "FrdmRnmyFxpMGLdLlxBgxdVHOkwJzvDo";

        try {
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
    
            //查询
            //组装查询条件
            const primary_field = field_names[0]; // 默认第一个字段为主键
            const filterConditions = [{
                "field_name": primary_field,
                "operator": "is",
                "value": [data[primary_field]]
            }];

            const res_searchRecord = await makeRequest(`https://open.feishu.cn/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/search?page_size=500`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tenant_access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "view_id": view_id,
                    "field_names": field_names,
                    "filter": {
                        "conjunction": "and",
                        "conditions": filterConditions
                    },
                    "automatic_fields": false
                })
            });
    
            // const data_searchRecord = await res_searchRecord.json();
            const data_searchRecord = await res_searchRecord.response;
            const record_id = data_searchRecord.data.items[0]?.record_id || null;

            if (record_id) {
                console.log(`存在 ${data[field_names[0]]} 记录 ${record_id}，检查是否需要更新...`);
                const fields = data_searchRecord.data.items[0].fields;
                let isChanged = false;
                for (const key of field_names) {
                    const existingValue = fields[key] ? (Array.isArray(fields[key]) && fields[key][0]?.text !== undefined ? fields[key][0].text : fields[key]) : null;
                    if (data[key] !== (existingValue || null)) {
                        console.log(data[key]);
                        console.log(existingValue);
                        isChanged = true;
                        break;
                    }
                }
                if (!isChanged) {
                    console.log("无变动，跳过更新");
                    return;
                }
                //更新
                console.log(`有变动，开始更新...`)
                const res_updateRecord = await makeRequest(`https://open.feishu.cn/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/${record_id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${tenant_access_token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "fields": data })
                });

                // const data_updateRecord = await res_updateRecord.json();
                const data_updateRecord = await res_updateRecord.response;
                if (data_updateRecord.code === 0) {
                    console.log("更新记录：", data_updateRecord.msg);
                } else {
                    throw new Error(`更新错误: ${data_updateRecord.msg}`);
                }
            } else {
                //新增
                console.log(`无 ${data[field_names[0]]} 记录，开始新增...`);
                const res_createRecord = await makeRequest(`https://open.feishu.cn/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${tenant_access_token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "fields": data })
                });
                
                // const data_createRecord = await res_createRecord.json();
                const data_createRecord = await res_createRecord.response;
                if (data_createRecord.code === 0) {
                    console.log("新增记录：", data_createRecord.msg);
                } else {
                    throw new Error(`新增错误: ${data_createRecord.msg}`);
                }
            }
        } catch (error) {
            console.error(`同步 ${data[field_names[0]]} 时发生错误:`, error);
            await updateToFeishu({app_token, table_id, view_id, field_names, data});
        }
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


    // ---------------------添加按钮---------------------
    // 创建并显示蒙版
    function showLoadingOverlay() {
        // 创建蒙版
        const overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // 半透明背景
        overlay.style.zIndex = '10000'; // 确保在最上层
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';

        // 创建显示信息的容器
        const messageContainer = document.createElement('div');
        messageContainer.id = 'loadingMessage';
        messageContainer.style.color = 'white';
        messageContainer.style.fontSize = '16px';
        messageContainer.style.textAlign = 'center';
        messageContainer.style.maxWidth = '80%';
        messageContainer.style.padding = '20px';
        messageContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        messageContainer.style.borderRadius = '10px';
        overlay.appendChild(messageContainer);

        // 将蒙版添加到页面中
        document.body.appendChild(overlay);

        return messageContainer; // 返回容器，方便更新内容
    }

    // 隐藏蒙版
    function hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    // 切片函数
    function sliceArray(array, size = 50) {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    }
    
    // 单个mall处理
    async function processOneMall (mallName, mallId, messageContainer) {
        messageContainer.innerHTML = `🔄 正在同步价格...上传到飞书多维表格...${mallName}...获取SPU列表`;
        const SPUs_List = [...await getAllSPU(mallId,11), ...await getAllSPU(mallId,12), ...await getAllSPU(mallId,13)]; // 合并数组
        console.log("📌 SPUs_List:", SPUs_List);
        
        if (SPUs_List.length > 0) {
            messageContainer.innerHTML = `🔄 正在同步价格...上传到飞书多维表格...${mallName}...获取SKU最新价格`;
            const SKUPricesList = await getSKUPrices(mallId,SPUs_List);
            console.log("📦 SKUPricesList:", SKUPricesList);
            
            // 批量查询已有记录和无记录两类
            const slicedSKUPrices = sliceArray(SKUPricesList, 50); // 按50个切片
            
            let allExistingSKUs = [];
            let allNonExistingSKUs = [];
            let temp = 1;//计数
            
            for (const slice of slicedSKUPrices) {
                messageContainer.innerHTML = `🔄 正在同步价格...上传到飞书多维表格...${mallName}...匹配飞书记录（${temp}~${temp+slice.length-1}/${SKUPricesList.length}）`;
                const { existingSKUs, nonExistingSKUs } = await searchFeishu_batch({
                    app_token: "O2PebplRpa0pLFsmND8c40RPnGf",
                    table_id: "tblEu0iGt5kxE12w",
                    view_id: "vewas7Kt4n",
                    field_names: ["SKU", "日常价格", "活动后最低价", "货币单位"],
                    data: slice
                });
                
                // 合并结果
                allExistingSKUs = [...allExistingSKUs, ...existingSKUs];
                allNonExistingSKUs = [...allNonExistingSKUs, ...nonExistingSKUs];
                temp = temp + 50
            }
            
            // 批量更新已存在SKU
            if (allExistingSKUs) {
                const slicedExistingSKUs = sliceArray(allExistingSKUs, 1000); // 按1000个切片
                let temp = 1;
                for (const slice of slicedExistingSKUs) {
                    messageContainer.innerHTML = `🔄 正在同步价格...上传到飞书多维表格...${mallName}...更新飞书记录（${temp}~${temp+slice.length-1}/${allExistingSKUs.length}）`;
                    await updateFeishu_batch({
                        app_token: "O2PebplRpa0pLFsmND8c40RPnGf",
                        table_id: "tblEu0iGt5kxE12w",
                        data: slice
                    });
                    temp = temp + 1000
                }
            }
            
            // 批量新建未存在SKU
            if (allExistingSKUs) {
                const slicedNonExistingSKUs = sliceArray(allNonExistingSKUs, 1000); // 按1000个切片
                let temp = 1;
                for (const slice of slicedNonExistingSKUs) {
                    messageContainer.innerHTML = `🔄 正在同步价格...上传到飞书多维表格...${mallName}...新建飞书记录（${temp}~${temp+slice.length-1}/${allNonExistingSKUs.length}）`;
                    await createFeishu_batch({
                        app_token: "O2PebplRpa0pLFsmND8c40RPnGf",
                        table_id: "tblEu0iGt5kxE12w",
                        data: slice
                    });
                    temp = temp + 1000
                }
            }
            
            await updateToFeishu_single({
                app_token: "O2PebplRpa0pLFsmND8c40RPnGf",
                table_id: "tblGQ8grVGulm6Ah",
                view_id: "vewCqfYabT",
                field_names: ["mallId", "店铺", "更新时间"],
                data : {"mallId": String(mallId),"店铺" : mallName, "更新时间" : Date.now()}
            });
            console.log("价格同步完成!");
        } else {
            console.log("⚠️ 没有找到 SPU，无法更新价格！");
        }
    }
    
    let btn = document.createElement("button");
    btn.id = "updatePriceBtn";
    btn.innerText = "更新所有店铺价格";
    btn.style.position = 'fixed';
    btn.style.top = '10px';
    btn.style.left = '10px';
    btn.style.fontSize = "12px";
    btn.style.zIndex = '9999';
    document.body.appendChild(btn);
    
    // 设置按钮点击事件
    btn.addEventListener('click', async function() {
        const messageContainer = showLoadingOverlay();  // 显示蒙版

        messageContainer.innerHTML = "🔄 开始同步价格...获取全托店铺信息"
        const nonSemiManagedMallList = await getUserInfo();

        //处理
        for (const mall of nonSemiManagedMallList) {
            await processOneMall(mall.mallName, mall.mallId, messageContainer);
        }

        messageContainer.innerHTML = `🔄 开始同步价格...同步完成`;
        console.log(`🔄 开始同步价格...同步完成`);
        setTimeout(() => {}, 2000); //等待2s
        hideLoadingOverlay(); // 隐藏蒙版
    });

    let btn_currentMall = document.createElement("button");
    btn_currentMall.id = "updatePriceBtn_currentMall";
    btn_currentMall.innerText = "更新当前店铺价格";
    btn_currentMall.style.position = 'fixed';
    btn_currentMall.style.top = '40px';
    btn_currentMall.style.left = '10px';
    btn_currentMall.style.fontSize = "12px";
    btn_currentMall.style.zIndex = '9999';
    document.body.appendChild(btn_currentMall);

    btn_currentMall.addEventListener('click', async function() {
        const messageContainer = showLoadingOverlay();  // 显示蒙版

        messageContainer.innerHTML = "🔄 开始同步价格...获取全托店铺信息"
        const nonSemiManagedMallList = await getUserInfo();

        const mallName = document.querySelectorAll('div[class*="account-info_accountInfo"] span span')[0].textContent;
        const mallId = localStorage.getItem('mall-info-id');

        if (nonSemiManagedMallList.some(item => String(item.mallId) === mallId)) {
            await processOneMall(mallName,mallId,messageContainer);//0则为当前店铺
            messageContainer.innerHTML = `🔄 开始同步价格...${mallName}...同步完成`;
            console.log(`🔄 开始同步价格...${mallName}...同步完成`);
        } else {
            messageContainer.innerHTML = `🔄 开始同步价格...${mallName}...当前店铺非全托店铺，停止同步`;
            console.log(`🔄 开始同步价格...${mallName}...当前店铺非全托店铺，停止同步`);
        }

        setTimeout(() => {}, 2000); //等待2s
        hideLoadingOverlay(); // 隐藏蒙版
    });

    let btn_test = document.createElement("button");
    btn_test.id = "testBtn";
    btn_test.innerText = "test";
    btn_test.style.position = 'fixed';
    btn_test.style.top = '70px';
    btn_test.style.left = '10px';
    btn_test.style.fontSize = "12px";
    btn_test.style.zIndex = '9999';
    btn_test.style.display = 'none';
    document.body.appendChild(btn_test);

    btn_test.addEventListener('click', async function() {
        const messageContainer = showLoadingOverlay();  // 显示蒙版

        messageContainer.innerHTML = "🔄 开始更新价格...";

        let testSKUs = [
            {"SKU" : "test001", "日常价格" : -999.99, "活动后最低价" : -1999.99, "货币单位" : "CNY"},
            {"SKU" : "test002", "日常价格" : -999.99, "活动后最低价" : null, "货币单位" : "CNY"}
        ];
        let allExistingSKUs = [];
        let allNonExistingSKUs = [];
        const { existingSKUs, nonExistingSKUs } = await searchFeishu_batch({
            app_token: "O2PebplRpa0pLFsmND8c40RPnGf",
            table_id: "tblEu0iGt5kxE12w",
            view_id: "vewas7Kt4n",
            field_names: ["SKU", "日常价格", "活动后最低价", "货币单位"],
            data: testSKUs
        });
        allExistingSKUs = [...allExistingSKUs, ...existingSKUs];
        allNonExistingSKUs = [...allNonExistingSKUs, ...nonExistingSKUs];
        await updateFeishu_batch({
            app_token: "O2PebplRpa0pLFsmND8c40RPnGf",
            table_id: "tblEu0iGt5kxE12w",
            data : allExistingSKUs
        });

        const mallName = document.querySelectorAll('div[class*="account-info_accountInfo"] span span')[0].textContent
        await updateToFeishu_single({
            app_token: "O2PebplRpa0pLFsmND8c40RPnGf",
            table_id: "tblGQ8grVGulm6Ah",
            view_id: "vewCqfYabT",
            field_names: ["mallId", "店铺", "更新时间"],
            data : {"mallId":"test001","店铺" : "test001", "更新时间" : Date.now()}
        });

        console.log("测试完成！");
        hideLoadingOverlay(); // 隐藏蒙版
    });

    console.log("✅ 更新价格按钮已添加");

})();