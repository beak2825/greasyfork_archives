// ==UserScript==
// @name         易仓订单备注
// @namespace    http://maxpeedingrods.cn/
// @version      0.1.21
// @description  国贵-易仓快捷访问订单中心备注
// @author       knight
// @license      No License
// @match        https://*.eccang.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/layer/3.1.1/layer.min.js
// @downloadURL https://update.greasyfork.org/scripts/463741/%E6%98%93%E4%BB%93%E8%AE%A2%E5%8D%95%E5%A4%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/463741/%E6%98%93%E4%BB%93%E8%AE%A2%E5%8D%95%E5%A4%87%E6%B3%A8.meta.js
// ==/UserScript==


//全局变量
//DOM变化触发队列
let triggerEventQueue = [];

/**
 * 常量信息
 */
class Constant {
    static buttonName = '订单备注';
    static crmUrl = 'https://crm.maxpeedingrods.cn/orderdetail/';
    static createButtonPerPageMax = 100;
}

/**
 * 页面位置类
 */
class Page {
    /**
     * 获取该页面需要添加
     */
    getPositions() {
        return [];
    }
}

class Positions {
    constructor(css, maxButton, inserLocation, orderIdMethod, isFilterOrderId) {
        this.css = css;
        this.inserLocation = inserLocation || 'before';    //插入位置的方法
        this.maxButton = maxButton || Constant.createButtonPerPageMax;
        this.orderIdMethod = orderIdMethod || 'innerText'; //获取订单号的方法
        this.isFilterOrderId = isFilterOrderId || true;
    }

    getIsFilterOrderId() {
        return this.isFilterOrderId;
    }

    setIsFilterOrderId(isFilter) {
        return this.isFilterOrderId = isFilter;
    }

    getCss() {
        return this.css;
    }

    getInsertLocation() {
        return this.inserLocation;
    }

    getOrderIdMethod() {
        return this.orderIdMethod;
    }

    getMaxButton() {
        return this.maxButton;
    }

    setPositionCss(cssSelector) {
        this.css = cssSelector;
    }

    setPositionOrderId(orderIdMethod) {
        this.orderIdMethod = orderIdMethod;
    }

    setMaxButton(maxNum) {
        this.maxButton = maxNum;
    }

    setInsertLocation(location) {
        this.inserLocation = location;
    }
}

/**
 * ERP订单列表页
 */
class ErpOrderListPage extends Page {
    static pagePath = '/order/order-list/list/platform';

    getPositions() {
        let p = new Positions('td.order_line > p.refrence_no_platform.ellipsis a');

        return [p];
    }
}

/**
 * 订单详情页
 */
class OrderDetailPage extends Page {
    static pagePath = '/order/order/detail/orderId';

    getPositions() {
        let p = new Positions('#order_product_form > table:nth-child(4) > tbody > tr:nth-child(1) > td:nth-child(2)', 1, 'prepend');
        let p2 = new Positions('#order_product_form > table:nth-child(4) > tbody > tr:nth-child(4) > td:nth-child(2)', 1, 'prepend', 'innerText', false);
        return [p, p2];
    }
}

/**
 * ebay站内信
 */
class EbayMessagePage extends Page {
    static pagePath = '/siteMail';

    getPositions() {
        let p = new Positions('body > div > div > div > div.left-wrapper > div > section > div > div.siteMail-order-info-tab.ant-tabs.ant-tabs-top.ant-tabs-line > div.ant-tabs-content.ant-tabs-content-animated.ant-tabs-top-content > div.ant-tabs-tabpane.ant-tabs-tabpane-active > div.siteMail-horizontal-order.scrollbar > div > div > div > div.info-detail-wrap > div.flex-wrap > div.item.itemorderMessage > div:nth-child(1) > a', 1);

        //多窗口模式
        let p2 = new Positions('body > div > div > div > div.mail-info-wrap > div.right-info > section > div > div.order-cont-wrap > div.column-order-wrap.normal-height > div > div > div > div.order.currency.has-remarks-wrap > div.body > div:nth-child(1) > a', 1);

        return [p, p2];
    }
}

/**
 * amazon邮箱
 */
class AmazonMailPage extends Page {
    static pagePath = '/entry/E2JRLA/ERP/amazon';

    getPositions() {
        let p = new Positions('#components-layout-custom-trigger > section > div > section > div > div.flexColumnPageWrap > section > section > aside > div > div.layoutSiderWrap_content > div > div:nth-child(3) > span.value.link.text-overflow_ellipsis', 1);

        return [p];
    }
}

/**
 * amazon运营操作界面
 */
class AmazonOperationPage extends Page {
    static pagePath = '/entry/E2JRLA/AMAZON_OPERATE/amazon';

    getPositions() {
        return [];
    }
}

/**
 * amazon运营操作界面-订单列表
 */
class AmazonOpOrderLlistPage extends AmazonOperationPage {
    static pageHash = '#/sales/order_list';

    getPositions() {
        let p = new Positions('#components-layout-custom-trigger > section > div > div > div.order_list.flexColumnPageWrap.flexColumnPageWrap_hidden > div.tableWrap > div.tableBody > div.vxeTableParentEl > div > div.vxe-table--render-wrapper > div.vxe-table--main-wrapper > div.vxe-table--body-wrapper.body--wrapper > table > tbody > tr > td.vxe-body--column.col_22.col--left > div > div:nth-child(1)');
        let p2 = new Positions('body > div > div > div.ec-ant-drawer-content-wrapper > div > div > div.ec-ant-drawer-body > div:nth-child(3) > div:nth-child(1) > div:nth-child(4) > span.item_txt', 1);
        return [p, p2];
    }
}

/**
 * 新建线下订单（审核订单）
 */
class ErpOrderVerificationListPage extends Page {
    static pagePath = '/order/order-verification/list';

    getPositions() {
        let p = new Positions('td.order_line > p.refrence_no_platform.ellipsis a');
        let p2 = new Positions('#table-module-list-data > tr > td.order_line > p:nth-child(8) > a');

        return [p, p2];
    }
}

/**
 * RMA管理-退款管理
 */
class ErpRmaRefundPage extends Page {
    static pagePath = '/fee/paypal-refund/list';

    getPositions() {
        let p = new Positions('#table-module-list-data > tr > td:nth-child(4) > p:nth-child(2) > a');

        return [p];
    }
}

/**
 * RMA管理-仓库退件
 */
class ErpRmaReturnPage extends Page {
    static pagePath = '/order/returns/list';

    getPositions() {
        let p = new Positions('#table-module-list-data > tr > td.order_line > p.refrence_no_platform.ellipsis.zclip_code_copy > a');

        return [p];
    }
}

/**
 * RMA管理-退件重地
 */
class ErpRmaListPage extends Page {
    static pagePath = '/order/rma/list';

    getPositions() {
        let p = new Positions('#table-module-list-data > tr > td:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(2) > a');

        return [p];
    }
}

/**
 * 订单管理-极速发货
 */
class ErpFastOrderListPage extends Page {
    static pagePath = '/order/order-list/list/p_mode/fast';

    getPositions() {
        let p = new Positions('#table-module-list-data > tr > td.order_line > p:nth-child(2) > a');

        return [p];
    }
}

/**
 * 订单管理-极速发货-详情
 */
class ErpFastOrderDetailPage extends Page {
    static pagePath = '/order/order/detail/orderId/p_mode/fast';

    getPositions() {
        let p = new Positions('#order_product_form > table:nth-child(4) > tbody > tr:nth-child(4) > td:nth-child(2)', 1, 'prepend', 'innerText', false);

        return [p];
    }
}

/**
 * ERP-客服-ebay取消订单申请
 */
class EbayCancelOrderPage extends Page {
    static pagePath = '/customerservice/ebay-cancellation/list';

    getPositions() {
        let p = new Positions('#table-module-list-data > tr > td:nth-child(3) > span:nth-child(1) > a');

        return [p];
    }
}

/**
 * ERP-客服-ebay纠纷
 */
class EbayCaseOrderPage extends Page {
    static pagePath = '/case/ebay-user-cases/list';

    getPositions() {
        let p = new Positions('#table-module-list-data > tr > td:nth-child(3) > a');

        return [p];
    }
}

/**
 * ERP-客服-ebay评价
 */
class EbayFeedbackPage extends Page {
    static pagePath = '/feedback/ebay-customer-feedback/list';

    getPositions() {
        let p = new Positions('#table-module-list-data > tr > td:nth-child(2) > a:nth-child(1)');

        return [p];
    }
}

/**
 * ERP-客服-ebay退换货申请
 */
class EbayReturnPage extends Page {
    static pagePath = '/customerservice/ebay-return-request/list';

    getPositions() {
        let p = new Positions('#table-module-list-data > tr > td:nth-child(3) > a');

        return [p];
    }
}

/**
 * 自发货-订单查询-详情页
 */
class SelfShipOrderDetailPage extends Page {
    static pagePath = '/order/orders/view/order_code';

    getPositions() {
        let p = new Positions('#content > div:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(4) > b', 1, 'prepend', 'innerText', false);

        return [p];
    }
}

/**
 * 页面工厂类
 */
class PageFactory {
    static make(path, hash) {
        let formatPath = PageFactory.formatUrlPath(path);
        console.log('------format path-----------' + formatPath);

        switch (formatPath) {
            case ErpOrderListPage.pagePath:
                return new ErpOrderListPage();
            case OrderDetailPage.pagePath:
                return new OrderDetailPage();
            case EbayMessagePage.pagePath:
                return new EbayMessagePage();
            case AmazonMailPage.pagePath:
                return new AmazonMailPage();
            case ErpOrderVerificationListPage.pagePath:
                return new ErpOrderVerificationListPage();
            case ErpRmaRefundPage.pagePath:
                return new ErpRmaRefundPage();
            case ErpRmaReturnPage.pagePath:
                return new ErpRmaReturnPage();
            case ErpRmaListPage.pagePath:
                return new ErpRmaListPage();
            case ErpFastOrderListPage.pagePath:
                return new ErpFastOrderListPage();
            case ErpFastOrderDetailPage.pagePath:
                return new ErpFastOrderDetailPage();
            case EbayCancelOrderPage.pagePath:
                return new EbayCancelOrderPage();
            case EbayCaseOrderPage.pagePath:
                return new EbayCaseOrderPage();
            case EbayFeedbackPage.pagePath:
                return new EbayFeedbackPage();
            case EbayReturnPage.pagePath:
                return new EbayReturnPage();
            case SelfShipOrderDetailPage.pagePath:
                return new SelfShipOrderDetailPage();
            case AmazonOperationPage.pagePath:
                return PageFactory.makeAmazonOpreationPage(hash);
            default:
                return null;
        }
    }

    /**
     * 亚马逊运营子页面
     * @param hash
     */
    static makeAmazonOpreationPage(hash) {
        switch (hash) {
            case AmazonOpOrderLlistPage.pageHash:
                return new AmazonOpOrderLlistPage();
            default:
                return null;
        }
    }

    /**
     * 格式化path
     * @param path
     * @returns {*}
     */
    static formatUrlPath(path) {
        let formatPath = path;

        //将 /order/order-list/list/platform/amazon 格式化为 /order/order-list/list/platform
        formatPath = formatPath.replace(/^(\/order\/order-list\/list\/platform)\/([a-zA-Z0-9]+)$/g, "$1");
        //将 /order/order/detail/orderId/485088 格式化为 /order/order/detail/orderId
        formatPath = formatPath.replace(/^(\/order\/order\/detail\/orderId)\/(\d+)$/g, "$1");

        //将 /order/order/detail/orderId/123456/p_mode/fast 格式化为 /order/order/detail/orderId/p_mode/fast
        formatPath = formatPath.replace(/^(\/order\/order\/detail\/orderId)\/(\d+)(\/p_mode\/fast)$/g, "$1$3");

        //将自发货-订单查询-详情页 /order/orders/view/order_code/SO25042830936 格式化为 /order/orders/view/order_code
        formatPath = formatPath.replace(/^(\/order\/orders\/view\/order_code)\/([a-zA-Z0-9]+)$/g, "$1");

        //去掉末尾/
        formatPath = formatPath.replace(/^(.*)\/$/g, "$1");

        return formatPath;
    }
}

//匹配页面
function getPage() {
    console.log('------in getPage-----------');

    let currentPath = window.location.pathname;
    console.log(currentPath);
    console.log(window.location);

    return PageFactory.make(window.location.pathname, window.location.hash);

}

//在指定位置添加按钮
function addButton(page) {
    console.log('------in addButton-----------');
    console.log(page);

    if (page) {

        let positions = page.getPositions();

        for (let i = 0; i < positions.length; i++) {
            console.log('-----------------' + i);
            let createButtonNum = 0;

            $.each($(positions[i].getCss()), function (j, element) {
                console.log(element);
                console.log(positions[i]);

                if (createButtonNum < positions[i].getMaxButton()) {
                    let orderIdMethod = positions[i].getOrderIdMethod();
                    let orderId = element[orderIdMethod];

                    if (orderId) {
                        orderId = orderId.trim();
                    }

                    console.log(orderId);
                    if (positions[i].getIsFilterOrderId) {
                        orderId = parseOrderIdFromText(orderId);
                    }
                    console.log(orderId);

                    creatButton(element, i, createButtonNum, orderId, positions[i].getInsertLocation())
                    createButtonNum += 1;
                }
            });

        }
    }

}

/**
 * 解析订单ID
 * @param orderText
 */
function parseOrderIdFromText(orderText) {
    let orderId = orderText;
    //去掉[订单备注]文字，避免设置为prepend创建时，通过innerText拿到的订单号不对
    let reg = new RegExp(Constant.buttonName, 'g');
    orderId = orderId.replace(reg, "");

    //去掉[参考号:]文字
    orderId = orderId.replace(/参考号[\:\：]/gi, "");

    //去掉[订单：]文字
    orderId = orderId.replace(/订单[\:\：]/gi, "");

    //去掉[Order# :]文字
    orderId = orderId.replace('Order\# \:', "");

    orderId = smallPlatformOrderIdFormat(orderId);

    return orderId;
}

/**
 * 小渠道订单号格式化
 * @param orderId
 */
function smallPlatformOrderIdFormat(orderId) {
    //特殊小渠道，去掉前缀，例如：allegro-5a9ef7f0d770
    let orderSource = orderId;
    let allegroReg = new RegExp('(allegro|alibaba|fnac|jd|LZD|manomano|mcdcbt|newegg|PM|real|SPE|WAL)\-', 'gi');
    orderId = orderSource.replace(allegroReg, "");

    if (orderSource.startsWith('LZD')) {
        orderId = orderSource.replace(/LZD\-\d+\-(.*)/gi, "$1");
    }

    if (orderSource.startsWith('SPE')) {
        orderId = orderSource.replace(/SPE\-\d+\-(.*)/gi, "$1");
    }

    if (orderSource.startsWith('WAL')) {
        orderId = orderSource.replace(/WAL\-\d+\-(.*)/gi, "$1");
    }


    return orderId;
}

//创建按钮
function creatButton(node, position, buttonNum, orderId, insertLocation) {
    console.log('------nods-----------' + position + '_' + buttonNum + '_' + orderId);
    //先检查按钮是否存在
    let buttonId = 'crmk_' + position + '_' + buttonNum;
    let isButtonExist = document.getElementById(buttonId);

    console.log('button exist:' + isButtonExist);

    if (!isButtonExist) {
        createButtonReal(node, buttonId, orderId, insertLocation);
    } else {
        changeButtonClickEvent(buttonId, orderId);
    }

    console.log('------createButton end-----------');
}

/**
 * 改变按钮click事件
 * @param buttonId
 * @param orderId
 */
function changeButtonClickEvent(buttonId, orderId) {
    let button = document.getElementById(buttonId);
    button.onclick = function () {
        let url = Constant.crmUrl + orderId;
        layer.open({
            type: 2,
            skin: 'layui-layer-rim',
            area: ['45%', '600px'],
            offset: ['0', '0'],
            title: Constant.buttonName,
            anim: 1,
            shade: false,
            maxmin: true,
            content: url,
        });
    };
}

/**
 * 真正创建按钮
 * @param buttonId
 * @param orderId
 */
function createButtonReal(node, buttonId, orderId, insertLocation) {
    console.log("begin add");
    let button = document.createElement("span");
    button.innerText = Constant.buttonName;
    button.id = buttonId;
    button.className = "crm-remark-button";
    button.onclick = function () {
        let url = Constant.crmUrl + orderId;
        layer.open({
            type: 2,
            skin: 'layui-layer-rim',
            area: ['45%', '600px'],
            offset: ['0', '0'],
            title: Constant.buttonName,
            anim: 1,
            shade: false,
            maxmin: true,
            content: url,
        });
    };
    node[insertLocation](button);
    console.log("button add end------------");
}

/**
 * 监听DOM节点变化
 */
function addListener() {
    console.log("---------------addListener------------------------");
    let targetNode = document.querySelector('body');
    let config = { childList: true, subtree: true };
    let callback = function (mutationsList) {
        console.log("----------------------------------dom change-------------------------------------");
        //触发增加按钮
        // addButton(getPage());
        triggerEventQueue.push(true);

        //延迟触发，避免DOM变化频繁，导致频繁处理
        setTimeout(function () {
            console.log("----------------------------------timer trigger-------------------------------------" + triggerEventQueue.length);
            if (triggerEventQueue.length > 0 && triggerEventQueue.pop()) {
                console.log("----------------------------------timer exec-------------------------------------");
                //触发一次之后，清空队列
                triggerEventQueue = [];
                addButton(getPage());
            }
        }, 3000);
    };

    let observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}

/**
 * 添加CSS样式
 */
function addStyle() {
    let css = `
        .crm-remark-button {
            display: inline-block;
            border: 1px solid #199EDB;
            background-color: #199EDB;
            color: #fff;
            cursor: pointer;
            text-align: center;
            margin: 2px;
            border-radius: 2px;
        }
    `
    GM_addStyle(css);
}

/**
 * 开始
 */
function start() {
    addStyle();

    //引入layer弹窗css
    $(document.body).append(`<link href="https://lib.baomitu.com/layer/3.1.1/theme/default/layer.min.css" rel="stylesheet">`);

    //第一次触发
    addButton(getPage());

    //后续DOM变化触发
    addListener();
}


(function () {
    'use strict';

    console.log("---------------start------------------------");
    start();
})();
