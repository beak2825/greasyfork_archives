// ==UserScript==
// @name         Ozon 自动填写仓库表单字段
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动填写仓库字段并替换 company_id 为 sc_company_id 的 cookie 值
// @match        https://seller.ozon.ru/app/crossborder/warehouse*
// @match        https://seller.ozon.ru/app/crossborder/warehouse/*
// @match        https://seller.ozon.ru/app/crossborder/warehouse/draft/*
// @grant        none
// @license      TANGMING
// @downloadURL https://update.greasyfork.org/scripts/532779/Ozon%20%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E4%BB%93%E5%BA%93%E8%A1%A8%E5%8D%95%E5%AD%97%E6%AE%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/532779/Ozon%20%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E4%BB%93%E5%BA%93%E8%A1%A8%E5%8D%95%E5%AD%97%E6%AE%B5.meta.js
// ==/UserScript==

console.log("✅ 脚本已注入！");


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
const warehouse = `仓库-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
async function fetchPostJson(url, body, scCompanyId, referrer) {
    const headers = {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/json",
        "x-o3-app-name": "seller-ui",
        "x-o3-company-id": scCompanyId,
        "x-o3-language": "ru",
        "x-o3-page-type": "cb-warehouse-other"
    };

    const resp = await fetch(url, {
        method: "POST",
        headers,
        credentials: "include",
        referrer,
        body: JSON.stringify(body)
    });

    return resp.json();
}

async function getLegalName(scCompanyId) {
    try {
        const data = await fetchPostJson(
            "https://seller.ozon.ru/api/company/seller-info",
            { marketplaceSellerId: scCompanyId },
            scCompanyId,
            "https://seller.ozon.ru/app/crossborder/warehouse/create"
        );
        console.log('✅ 获取到 sellerInfoData：', data);
        return data.legalName || "Default Company Name";
    } catch (e) {
        console.error('❌ 获取 legalName 失败：', e);
        return "Default Company Name";
    }
}

async function createWarehouse(scCompanyId, legalName) {
    const warehouseBody = {
        company_id: scCompanyId,
        name: warehouse,
        address: {
            country: "Китай",
            city: "Путянь",
            street: "Building 1, Area B, Riverside Yashun, Xialin Street",
            zipcode: "351100",
            house: "1",
            building: "",
            apartment: "",
            latitude: 25.4557366,
            longitude: 119.0029034
        },
        is_rfbs: true,
        phone: "+86 131 2328 0129",
        sla_cut_in: 7200,
        first_mile_type: "",
        timetable_template: {
            holidays_override: [
                { day: "2025-05-02", from: "00:00", to: "23:59" },
                { day: "2025-06-01", from: "00:00", to: "23:59" },
                { day: "2025-10-03", from: "00:00", to: "23:59" },
                { day: "2025-10-04", from: "00:00", to: "23:59" },
                { day: "2025-10-05", from: "00:00", to: "23:59" }
            ],
            working_hours: {
                "1": { from: "00:00", to: "23:59" },
                "2": { from: "00:00", to: "23:59" },
                "3": { from: "00:00", to: "23:59" },
                "4": { from: "00:00", to: "23:59" },
                "5": { from: "00:00", to: "23:59" },
                "6": { from: "00:00", to: "23:59" },
                "7": { from: "00:00", to: "23:59" }
            }
        },
        postings_limit: -1,
        return_address: {
            country: "Китай",
            city: "Путянь",
            street: "Building 1, Area B, Riverside Yashun, Xialin Street",
            zipcode: "351100",
            house: "1",
            building: "",
            apartment: "",
            latitude: 25.4557366,
            longitude: 119.0029034,
            phone: "+86 131 2328 0129",
            recipient: legalName,
            comment: `Адрес склада возвратов\n351100, Китай, Путянь, Building 1, Area B, Riverside Yashun, Xialin Street, 1\n\nТелефон склада возвратов\n+86 131 2328 0129\n\nПолучатель\n${legalName}`
        },
        return_post_index: "",
        return_provider_id: 1336
    };

    try {
        const data = await fetchPostJson(
            "https://seller.ozon.ru/api/site/logistic-service/v2/warehouse/draft/create",
            warehouseBody,
            scCompanyId,
            "https://seller.ozon.ru/app/crossborder/warehouse/create"
        );
        console.log("✅ 仓库创建返回数据：", data);
        return data.result;
    } catch (e) {
        console.error("❌ 仓库创建失败：", e);
        return null;
    }
}

async function createDeliveryMethod(scCompanyId, warehouseDraftId) {
    const deliveryBody = {
        company_id: Number(scCompanyId),
        warehouse_draft_id: warehouseDraftId,
        name: "ePacket Economy Track China Post ePacket Economy Track Putian",
        cutoff: "17:00",
        tpl_integration_type: "aggregator",
        provider_id: 780,
        template_id: 339,
        tpl_dropoff_point_id: 56439,
        delivery_type_id: 2,
        tariff_type: "STANDARD_OZON"
    };

    try {
        const result = await fetchPostJson(
            "https://seller.ozon.ru/api/delivery-method-service/delivery-method/create",
            deliveryBody,
            scCompanyId,
            `https://seller.ozon.ru/app/crossborder/warehouse/draft/${warehouseDraftId}/method/rfbs/create`
        );
        console.log("✅ 配送方式创建返回：", result);
        return result.result
    } catch (e) {
        console.error("❌ 配送方式创建失败：", e);
    }
}

async function createDeliveryMethod2(scCompanyId, warehouseDraftId) {
    const deliveryBody = {
        company_id: Number(scCompanyId),
        warehouse_id: warehouseDraftId,
        name: "CEL Standard Extra Small CEL Extra Small Standard Putian",
        cutoff: "17:00",
        tpl_integration_type: "aggregator",
        provider_id: 995,
        template_id: 768,
        tpl_dropoff_point_id: 64282,
        delivery_type_id: 2,
        tariff_type: "STANDARD_OZON"
    };

    try {
        const result = await fetchPostJson(
            "https://seller.ozon.ru/api/delivery-method-service/delivery-method/create",
            deliveryBody,
            scCompanyId,
            `https://seller.ozon.ru/app/crossborder/warehouse/draft/${warehouseDraftId}/method/rfbs/create`
        );
        console.log("✅ 配送方式创建返回：", result);
        return result.result
    } catch (e) {
        console.error("❌ 配送方式创建失败：", e);
    }
}

async function createDeliveryMethod3(scCompanyId, warehouseDraftId) {
    const deliveryBody = {
        company_id: Number(scCompanyId),
        warehouse_id: warehouseDraftId,
        name:"CEL Standard Budget CEL Standard Budget PUDO CEL 标准低客单价到点 Putian",
        cutoff: "17:00",
        tpl_integration_type: "aggregator",
        provider_id: 1164,
        template_id: 1077,
        tpl_dropoff_point_id: 24039093,
        delivery_type_id: 2,
        tariff_type: "STANDARD_OZON"
    };

    try {
        const result = await fetchPostJson(
            "https://seller.ozon.ru/api/delivery-method-service/delivery-method/create",
            deliveryBody,
            scCompanyId,
            `https://seller.ozon.ru/app/crossborder/warehouse/draft/${warehouseDraftId}/method/rfbs/create`
        );
        console.log("✅ 配送方式创建返回：", result);
        return result.result
    } catch (e) {
        console.error("❌ 配送方式创建失败：", e);
    }
}

async function createDeliveryMethod4(scCompanyId, warehouseDraftId) {
    const deliveryBody = {
        company_id: Number(scCompanyId),
        warehouse_id: warehouseDraftId,
        name:"CEL Standard Small CEL Standard Small PUDO CEL 标准轻小件到点 Putian",
        cutoff: "17:00",
        tpl_integration_type: "aggregator",
        provider_id: 1167,
        template_id: 1308,
        tpl_dropoff_point_id: 24039168,
        delivery_type_id: 2,
        tariff_type: "STANDARD_OZON"
    };

    try {
        const result = await fetchPostJson(
            "https://seller.ozon.ru/api/delivery-method-service/delivery-method/create",
            deliveryBody,
            scCompanyId,
            `https://seller.ozon.ru/app/crossborder/warehouse/draft/${warehouseDraftId}/method/rfbs/create`
        );
        console.log("✅ 配送方式创建返回：", result);
        return result.result
    } catch (e) {
        console.error("❌ 配送方式创建失败：", e);
    }
}

async function createDeliveryMethod5(scCompanyId, warehouseDraftId) {
    const deliveryBody = {
        company_id: Number(scCompanyId),
        warehouse_id: warehouseDraftId,
        name:"CEL Standard Big CEL Standard Big PUDO CEL 标准大件到点 Putian",
        cutoff: "17:00",
        tpl_integration_type: "aggregator",
        provider_id: 1170,
        template_id: 1091,
        tpl_dropoff_point_id: 24072837,
        delivery_type_id: 2,
        tariff_type: "STANDARD_OZON"
    };

    try {
        const result = await fetchPostJson(
            "https://seller.ozon.ru/api/delivery-method-service/delivery-method/create",
            deliveryBody,
            scCompanyId,
            `https://seller.ozon.ru/app/crossborder/warehouse/draft/${warehouseDraftId}/method/rfbs/create`
        );
        console.log("✅ 配送方式创建返回：", result);
        return result.result
    } catch (e) {
        console.error("❌ 配送方式创建失败：", e);
    }
}

async function createDeliveryMethod6(scCompanyId, warehouseDraftId) {
    const deliveryBody = {
        company_id: Number(scCompanyId),
        warehouse_id: warehouseDraftId,
        name:"CEL Standard Premium Small CEL Standard Premium Small PUDO CEL 标准高客单价轻小件到点 Putian",
        cutoff: "17:00",
        tpl_integration_type: "aggregator",
        provider_id: 1173,
        template_id: 1097,
        tpl_dropoff_point_id: 24072912,
        delivery_type_id: 2,
        tariff_type: "STANDARD_OZON"
    };

    try {
        const result = await fetchPostJson(
            "https://seller.ozon.ru/api/delivery-method-service/delivery-method/create",
            deliveryBody,
            scCompanyId,
            `https://seller.ozon.ru/app/crossborder/warehouse/draft/${warehouseDraftId}/method/rfbs/create`
        );
        console.log("✅ 配送方式创建返回：", result);
        return result.result
    } catch (e) {
        console.error("❌ 配送方式创建失败：", e);
    }
}

async function createDeliveryMethod7(scCompanyId, warehouseDraftId) {
    const deliveryBody = {
        company_id: Number(scCompanyId),
        warehouse_id: warehouseDraftId,
        name:"CEL Standard Premium Big CEL Standard Premium Big PUDO CEL 标准高客单价大件到点 Putian",
        cutoff: "17:00",
        tpl_integration_type: "aggregator",
        provider_id: 1176,
        template_id: 1103,
        tpl_dropoff_point_id: 24072987,
        delivery_type_id: 2,
        tariff_type: "STANDARD_OZON"
    };

    try {
        const result = await fetchPostJson(
            "https://seller.ozon.ru/api/delivery-method-service/delivery-method/create",
            deliveryBody,
            scCompanyId,
            `https://seller.ozon.ru/app/crossborder/warehouse/draft/${warehouseDraftId}/method/rfbs/create`
        );
        console.log("✅ 配送方式创建返回：", result);
        return result.result
    } catch (e) {
        console.error("❌ 配送方式创建失败：", e);
    }
}

async function activateCreate(company_id,delivery_method_id){
    const deliveryBody = {
        company_id: parseInt(company_id),
        delivery_method_id: delivery_method_id,
    };

    try {
        const result = await fetchPostJson(
            "https://seller.ozon.ru/api/delivery-method-service/delivery-method/activate",
            deliveryBody,
            company_id,

            `https://seller.ozon.ru/app/crossborder/warehouse/draft/${company_id}/method/rfbs/create`
        );
        console.log("✅ 最新仓库id获取返回：", result);
        return result
    } catch (e) {
        console.error("❌  最新仓库id获取失败：", e);
    }
}

(async function () {
    'use strict';

    const scCompanyId = getCookie('sc_company_id');
    if (!scCompanyId) {
        console.warn('❌ 未能找到 sc_company_id 的 cookie');
        return;
    }

    console.log('✅ sc_company_id 获取成功：', scCompanyId);

    const legalName = await getLegalName(scCompanyId);
    const warehouseDraftId = await createWarehouse(scCompanyId, legalName);

    if (warehouseDraftId) {
        await sleep(1000); // 稍等一下，确保草稿创建完毕
        const createDeliveryMethodInFor = await createDeliveryMethod(scCompanyId, warehouseDraftId);
        console.log("激活配送1")

        const activateResult = await activateCreate(scCompanyId, createDeliveryMethodInFor.id);
        const createDeliveryMethodInFor2 = await createDeliveryMethod2(scCompanyId, activateResult.warehouse_id);
        console.log("激活配送2")
        const activateResult2 = await activateCreate(scCompanyId, createDeliveryMethodInFor2.id);
        const createDeliveryMethodInFor3= await createDeliveryMethod3(scCompanyId, activateResult2.warehouse_id);
        console.log("激活配送3")
        const activateResult3 = await activateCreate(scCompanyId, createDeliveryMethodInFor3.id);
        const createDeliveryMethodInFor4= await createDeliveryMethod4(scCompanyId, activateResult3.warehouse_id);
        console.log("激活配送4")
        const activateResult4 = await activateCreate(scCompanyId, createDeliveryMethodInFor4.id);
        const createDeliveryMethodInFor5= await createDeliveryMethod5(scCompanyId, activateResult4.warehouse_id);

        console.log("激活配送5")
        const activateResult5 = await activateCreate(scCompanyId, createDeliveryMethodInFor5.id);
        const createDeliveryMethodInFor6= await createDeliveryMethod6(scCompanyId, activateResult5.warehouse_id);
        console.log("激活配送6")

        const activateResult6 = await activateCreate(scCompanyId, createDeliveryMethodInFor6.id);
        const createDeliveryMethodInFor7= await createDeliveryMethod7(scCompanyId, activateResult6.warehouse_id);
        console.log("激活配送7")
        const activateResult7 = await activateCreate(scCompanyId, createDeliveryMethodInFor7.id);



    }
})();

alert("✅ 仓库信息已自动填写，请关闭插件");