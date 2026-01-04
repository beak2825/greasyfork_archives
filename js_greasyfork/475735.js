// ==UserScript==
// @name         易仓订单备注图片解析
// @namespace    http://maxpeedingrods.cn/
// @version      0.1.14
// @description  国贵-易仓订单备注图片解析
// @author       knight
// @license      No License
// @match        https://*.eccang.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/layer.min.js
// @downloadURL https://update.greasyfork.org/scripts/475735/%E6%98%93%E4%BB%93%E8%AE%A2%E5%8D%95%E5%A4%87%E6%B3%A8%E5%9B%BE%E7%89%87%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/475735/%E6%98%93%E4%BB%93%E8%AE%A2%E5%8D%95%E5%A4%87%E6%B3%A8%E5%9B%BE%E7%89%87%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==


//全局变量
//DOM变化触发队列
let triggerEventQueue = [];

/**
 * 常量信息
 */
class Constant
{
    static buttonName = '查看图片';
    static createButtonPerPageMax = 100;
}

/**
 * 页面位置类
 */
class Page
{
    /**
     * 获取该页面需要添加
     */
    getPositions()
    {
        return [];
    }
}

class Positions
{
    constructor(css, maxButton, inserLocation)
    {
        this.css = css;
        this.inserLocation = inserLocation || 'after';    //插入位置的方法
        this.maxButton = maxButton || Constant.createButtonPerPageMax;
    }


    getCss()
    {
        return this.css;
    }

    getInsertLocation()
    {
        return this.inserLocation;
    }

    getMaxButton()
    {
        return this.maxButton;
    }

    setPositionCss(cssSelector)
    {
        this.css = cssSelector;
    }

    setMaxButton(maxNum)
    {
        this.maxButton = maxNum;
    }

    setInsertLocation(location)
    {
        this.inserLocation = location;
    }
}


/**
 * 订单管理-极速发货
 */
class ErpFastOrderListPage extends Page
{
    static pagePath = '/order/order-list/list/p_mode/fast';

    getPositions()
    {
        let p = new Positions('#table-module-list-data > tr > td:nth-child(3) > p:nth-child(4)');

        return [p];
    }
}

/**
 * 订单管理-极速发货-详情
 */
class ErpFastOrderDetailPage extends Page
{
    static pagePath = '/order/order/detail/orderId/p_mode/fast';

    getPositions()
    {
        let p = new Positions('#order_product_form > table:nth-child(4) > tbody > tr:nth-child(10) > td:nth-child(2)', 1, 'prepend');

        return [p];
    }
}

/**
 * 自发货-订单查询-详情
 */
class ErpOwnOrderDetailPage extends Page
{
    static pagePath = '/order/orders/view/order_code';

    getPositions()
    {
        let p = new Positions('#content > div:nth-child(2) > table > tbody > tr:nth-child(9) > td:nth-child(2)', 1);

        return [p];
    }
}

/**
 * 页面工厂类
 */
class PageFactory {
    static make(path, hash)
    {
        let formatPath = PageFactory.formatUrlPath(path);
        console.log('------format path-----------'+formatPath);

        switch (formatPath)
        {
            case ErpFastOrderListPage.pagePath:
                return new ErpFastOrderListPage();
            case ErpFastOrderDetailPage.pagePath:
                return new ErpFastOrderDetailPage();
            case ErpOwnOrderDetailPage.pagePath:
                return new ErpOwnOrderDetailPage();
            default:
                return null;
        }
    }

    /**
     * 亚马逊运营子页面
     * @param hash
     */
    static makeAmazonOpreationPage(hash)
    {
        switch (hash)
        {
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
    static formatUrlPath(path)
    {
        let formatPath = path;

        //将 /order/order-list/list/platform/amazon 格式化为 /order/order-list/list/platform
        formatPath = formatPath.replace(/^(\/order\/order-list\/list\/platform)\/([a-zA-Z0-9]+)$/g, "$1");
        //将 /order/order/detail/orderId/485088 格式化为 /order/order/detail/orderId
        formatPath = formatPath.replace(/^(\/order\/order\/detail\/orderId)\/(\d+)$/g, "$1");

        //将 /order/order/detail/orderId/123456/p_mode/fast 格式化为 /order/order/detail/orderId/p_mode/fast
        formatPath = formatPath.replace(/^(\/order\/order\/detail\/orderId)\/(\d+)(\/p_mode\/fast)$/g, "$1$3");

        //将 /order/orders/view/order_code/SO23092040775 格式化为 /order/orders/view/order_code
        formatPath = formatPath.replace(/^(\/order\/orders\/view\/order_code)\/([a-zA-Z0-9]+)$/g, "$1");

        //去掉末尾/
        formatPath = formatPath.replace(/^(.*)\/$/g, "$1");

        return formatPath;
    }
}

//匹配页面
function getPage()
{
    console.log('------in getPage-----------');

    let currentPath = window.location.pathname;
    console.log(currentPath);
    console.log(window.location);

    return PageFactory.make(window.location.pathname, window.location.hash);

}

//在指定位置添加按钮
function addButton(page)
{
    console.log('------in addButton-----------');
    console.log(page);

    if (page) {

        let positions = page.getPositions();

        for (let i=0; i < positions.length; i++)
        {
            console.log('-----------------'+i);
            let createButtonNum = 0;

            $.each($(positions[i].getCss()), function (j,element){
                console.log(element);
                console.log(positions[i]);
                if (createButtonNum < positions[i].getMaxButton()) {
                    let remrakContent =  element['innerText'];

                    creatButton(element, i, createButtonNum, remrakContent, positions[i].getInsertLocation())
                    createButtonNum += 1;
                }
            });

        }
    }

}


//创建按钮
function creatButton(node, position, buttonNum, remrakContent, insertLocation)
{
    console.log('------nods-----------'+position+ '_'+buttonNum + '_' );
    //先检查按钮是否存在
    let buttonId = 'crmimg_' + position + '_' + buttonNum;
    let isButtonExist = document.getElementById(buttonId);

    console.log('button exist:'+isButtonExist);

    if (!isButtonExist) {
        createButtonReal(node, buttonId, remrakContent, insertLocation);
    } else {
        changeButtonClickEvent(buttonId, remrakContent);
    }

    console.log('------createButton end-----------');
}

/**
 * 改变按钮click事件
 * @param buttonId
 * @param orderId
 */
function changeButtonClickEvent(buttonId, remrakContent)
{
    let imageLinks = parseRemarkContent(remrakContent);
    if (imageLinks.length > 0) {
        let button = document.getElementById(buttonId);
        button.onclick = function (){
            layer.open({
                type: 1,
                skin: 'layui-layer-rim',
                area: ['45%', '600px'],
                offset: ['0', '0'],
                title: Constant.buttonName,
                content: imageLinks,
                anim: 1,
                shade: false,
                maxmin: true,
            });
        };
    }

}

/**
 * 解析备注内容中的图片
 * @param remrakContent
 */
function parseRemarkContent(remrakContent)
{
    // 正则表达式匹配图片链接
    let imageRegex = /https:\/\/[^\s]+\.jpg/g;
    let imageLinks = remrakContent.match(imageRegex);
    let result = '';

    if (imageLinks.length > 0) {
        for (let i=0; i<imageLinks.length; i++) {
            result += '<img style="width: 80%;height: 80%;margin:10px;" src="' + imageLinks[i] + '"\/>';
        }
    }

    return result;
}

/**
 * 真正创建按钮
 * @param buttonId
 * @param orderId
 */
function createButtonReal(node, buttonId, remrakContent, insertLocation)
{
    let imageLinks = parseRemarkContent(remrakContent);
    if (imageLinks.length > 0) {
        console.log("begin add");
        let button = document.createElement("span");
        button.innerText = Constant.buttonName;
        button.id = buttonId;
        button.className = "crm-img-button";
        button.onclick = function (){
            layer.open({
                type: 1,
                skin: 'layui-layer-rim',
                area: ['45%', '600px'],
                offset: ['0', '0'],
                title: Constant.buttonName,
                content: imageLinks,
                anim: 1,
                shade: false,
                maxmin: true,
            });
        };
        node[insertLocation](button);
        console.log("button add end------------");
    }
}

/**
 * 监听DOM节点变化
 */
function addListener()
{
    console.log("---------------addListener------------------------");
    let targetNode = document.querySelector('body');
    let config = { childList: true, subtree: true };
    let callback = function (mutationsList) {
        console.log("----------------------------------dom change-------------------------------------");
        //触发增加按钮
        // addButton(getPage());
        triggerEventQueue.push(true);

        //延迟触发，避免DOM变化频繁，导致频繁处理
        setTimeout(function (){
            console.log("----------------------------------timer trigger-------------------------------------"+triggerEventQueue.length);
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
function addStyle()
{
    let css = `
        .crm-img-button {
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
function start()
{
    addStyle();

    //引入layer弹窗css
    $(document.body).append(`<link href="https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/layer.min.css" rel="stylesheet">`);

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
