// ==UserScript==
// @name         本地开发-ebay-listing抓取
// @namespace    http://maxpeedingrods.cn/
// @version      0.1.3
// @description  ebay-listing抓取
// @author       knight
// @license      No License
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/layer.min.js
// @downloadURL https://update.greasyfork.org/scripts/476053/%E6%9C%AC%E5%9C%B0%E5%BC%80%E5%8F%91-ebay-listing%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/476053/%E6%9C%AC%E5%9C%B0%E5%BC%80%E5%8F%91-ebay-listing%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==

function start()
{
    addStyle();

    createButton();
}

function createButton()
{
    let buttonId = "my-add-btn";
    let button = document.createElement("span");
    button.innerText = '开始抓取';
    button.id = buttonId;
    button.className = "cqgg-auto-order-remark-button";
    button.onclick = function (){
        document.getElementById(buttonId).innerText = "抓取中";
        getListings();
    };

    console.log("#str-tabpanel-tab0 > div.str-tabs__section-wrap > section > div:nth-child(2) > div.str-filters");
    console.log(document.querySelector("#str-tabpanel-tab0 > div.str-tabs__section-wrap > section > div:nth-child(2) > div.str-filters"));

    if (document.querySelector("#str-tabpanel-tab0 > div.str-tabs__section-wrap > section > div:nth-child(2) > div.str-filters")) {
        document.querySelector("#str-tabpanel-tab0 > div.str-tabs__section-wrap > section > div:nth-child(2) > div.str-filters").append(button);
    }
}

function getListings()
{
    //获取当页Listing
    let listings = getCurrentPageListings();

    //检查是否有下一页
    let hasNext = hasNextPage();
    hasNext=false;
    // while (hasNext) {
    //     //点击下一页
    //     clickNextPage();
    //     let pageListings = [];
    //     pageListings = getCurrentPageListings();
    //     listings.concat(pageListings);
    // }

    //格式化数据
    downloadData(formatListing(listings), 'listing.csv', 'text/csv,charset=UTF-8');
}

function formatListing(listings)
{
    console.log(listings);
    let results = "";
    for (let i=0; i< listings.length; i++) {
        results += listings[i].id + "," + listings[i].title + "," + listings[i].price + "," + listings[i].image + "\n";
    }
    console.log(results);
    return results;
}

function downloadData(data, filename, type) {

    var file = new Blob(["\ufeff" + data], { type: type });
    if (window.navigator.msSaveOrOpenBlob)
        // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else {
        // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}


function clickNextPage()
{
    document.querySelector("#str-tabpanel-tab0 > div.str-tabs__section-wrap > section > div.str-marginals.str-marginals__footer > div > nav > a.pagination__next.icon-link")
        .click();
}

function hasNextPage()
{
    let nextDisable = document.querySelector("#str-tabpanel-tab0 > div.str-tabs__section-wrap > section > div.str-marginals.str-marginals__footer > div > nav > a.pagination__next.icon-link")
        .getAttribute("aria-disabled");
    if (nextDisable) {
        return false;
    }
    return true;
}

function getCurrentPageListings()
{
    let result = [];
    let listNode = document.querySelectorAll("#str-tabpanel-tab0 > div.str-tabs__section-wrap > section > section > article");

    for (let i=0; i< listNode.length; i++) {
        let item = {};
        console.log("---start----3-------");
        item.title = listNode[i].querySelector("div > div.str-quickview-button.str-item-card__property-title > h3 > span").innerText;
        item.image = listNode[i].querySelector("div.str-item-card__header-container > div > div.str-quickview-button.str-item-card__link > div > picture > img").getAttribute("src");
        item.price = listNode[i].querySelector("div.str-item-card__primary > span.str-text-span.str-item-card__property-displayPrice").innerText.replace(',','');
        item.id = listNode[i].getAttribute("data-testid");
        result.push(item);
    }

    return result;
}


/**
 * 添加CSS样式
 */
function addStyle()
{
    let css = `
        .cqgg-auto-order-remark-button {
            display: inline-block;
            border: 1px solid #199EDB;
            background-color: #199EDB;
            color: #fff;
            cursor: pointer;
            text-align: center;
            margin: 2px;
            border-radius: 2px;
        }
        .cqgg-auto-order-remark-ul {
            text-align: left;
            font-size: 14px;
        }
        .cqgg-auto-order-remark-ul li{
            list-style-type: decimal;
            margin: 10px 20px;
            border-bottom: 1px dashed gray;
        }
        .cqgg-auto-order-remark-ul li i{
            font-weight: bold;
        }
        .cqgg-auto-order-remark-ul li p{
            text-indent: 2em;
        }
    `
    GM_addStyle(css);
}

(function() {
    'use strict';

    start();
})();
