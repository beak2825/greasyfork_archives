// ==UserScript==
// @name         复制ParentAsin
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  复制亚马逊ParentAsin
// @author       You
// @match        https://www.amazon.com/*/dp/*
// @match        https://www.amazon.com/gp/product/*
// @match        https://www.amazon.com/dp/*
// @match        https://yuanbao.tencent.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        GM.setClipboard
// @downloadURL https://update.greasyfork.org/scripts/530539/%E5%A4%8D%E5%88%B6ParentAsin.user.js
// @updateURL https://update.greasyfork.org/scripts/530539/%E5%A4%8D%E5%88%B6ParentAsin.meta.js
// ==/UserScript==

function copyAsin() {
    const asin = getAsin();
    GM.setClipboard(asin);
    alert('已复制！')
}

function copyTitle() {
    const title = getTitle();
    const regex = /"parentAsin":"(.*?)"/; // 非贪婪匹配，避免匹配到多余的字符
    const asin = getAsin();
    const content = asin + "|x|" + title;
    GM.setClipboard(content);
    alert('已复制！')
}

function copyCookie() {
    GM.setClipboard(document.cookie);
    alert('已复制！')
}

function getAsin() {
    const regex = /"parentAsin":"(.*?)"/; // 非贪婪匹配，避免匹配到多余的字符
    const result = document.body.textContent.match(regex);
    let asin = '';
    if (result && result[1]) {
        asin = result[1];
    }
    return asin;
}

function getBrand() {
    // 辅助函数：执行XPath查询
    function xpathQuery(xpath) {
        const result = [];
        const xpathResult = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.ORDERED_NODE_ITERATOR_TYPE,
            null
        );

        let node = xpathResult.iterateNext();
        while (node) {
            result.push(node.textContent);
            node = xpathResult.iterateNext();
        }
        return result;
    }

    // 首先尝试从主要位置获取品牌
    let brand = xpathQuery('//tr[@class="a-spacing-small po-brand"]/td[2]/span/text()');

    // 如果没有找到，尝试从bylineInfo获取
    if (brand.length === 0) {
        try {
            const bylineInfo = xpathQuery('//a[@id="bylineInfo"]/text()')[0];
            if (bylineInfo) {
                if (bylineInfo.includes('Visit the')) {
                    const match = bylineInfo.match(/Visit the (.+?) Store/);
                    brand = match ? match[1] : "";
                } else if (bylineInfo.includes('Brand: ')) {
                    brand = bylineInfo.replace('Brand: ', '');
                } else {
                    brand = "";
                }
            }
        } catch (error) {
            brand = "";
        }
    }
    // 如果还没找到，从商品详情中获取
    if (!brand.length) {
        const productDetails = xpathQuery('//table[@id="productDetails_detailBullets_sections1"]//tr/th/text()');
        if (productDetails.length > 0) {
            let brandNumber = 0;
            for (let i = 0; i < productDetails.length; i++) {
                brandNumber++;
                if (productDetails[i].includes('Brand')) {
                    break;
                }
            }
            const detailBrand = xpathQuery(
                `//table[@id="productDetails_detailBullets_sections1"]//tr[${brandNumber}]//td/text()`
            );
            if (detailBrand.length) {
                brand = detailBrand[0].trim();
            }
        }
    }

    // 最后尝试从店铺中获取品牌
    if (!brand.length) {
        const brandHref = xpathQuery('//a[@id="bylineInfo"]/@href');
        if (brandHref.length) {
            brand = brandHref[0].split('/')[2];
        } else {
            brand = '';
        }
    }

    return brand;
}

function getTitle() {
    return document.getElementById('productTitle').textContent.trim()
}

function getCategoryName() {
    // 创建一个XPath表达式求值器
    const evaluator = new XPathEvaluator();

    // 使用XPath查询获取所有匹配的节点
    const expression = '//li/span[@class="a-list-item"]/a[@class="a-link-normal a-color-tertiary"]/text()';
    const result = evaluator.evaluate(
        expression,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    );

    // 收集所有类别名称
    const categoryNames = [];
    for (let i = 0; i < result.snapshotLength; i++) {
        categoryNames.push(result.snapshotItem(i).textContent);
    }

    // 处理并连接类别名称
    let categoryName = "";
    if (categoryNames.length > 0) {
        categoryName = categoryNames
            .map(name => name.trim())
            .join(">>")
            .replace(/\n/g, "")
            .replace(/\s{2,}/g, "");
    }

    return categoryName;
}


function copyCheckData() {
    const brand = getBrand();
    const title = getTitle();
    const categoryName = getCategoryName();
    const asin = getAsin();
    GM.setClipboard(JSON.stringify({
        brand,
        title,
        categoryName,
        asin
    }));
    alert('复制成功')
}


/**
 * 复制所有asin
 */
function copyAsinAll() {
    const lis = document.querySelectorAll('li[data-asin]');
    const asins = Array.from(document.querySelectorAll('li[data-asin]'))
        .map(li => li.dataset.asin)
        .join('\n');
    if (asins) {
        GM.setClipboard(asins);
        alert('已复制所有asin！');
    } else {
        alert('复制失败');
    }
}


//获取商品规格
function get_dimensions_display(text) {
    let dimensions_display = text.match(/dimensionsDisplay" : ($$[\s\S]*?$$),/);
    if (!dimensions_display || dimensions_display.length === 0) {
        dimensions_display = text.match(/variationDisplayLabels" : ({[\s\S]*?})/);
        if (dimensions_display && dimensions_display.length > 0) {
            dimensions_display = JSON.parse(dimensions_display[1]);
            dimensions_display = Object.entries(dimensions_display).map(([name, value]) => value);
        }
    } else {
        dimensions_display = JSON.parse(dimensions_display[1]);
    }
    if (dimensions_display == null) {
        dimensions_display = [];
    }
    return dimensions_display;
}


function get_sku_name(skus, asin, dimensions_display) {

    let new_list = {};
    for (let [key, value] of Object.entries(skus)) {
        for (let i = 0; i < value.length; i++) {
            let v = value[i];
            if (!new_list.hasOwnProperty(dimensions_display[i])) {
                new_list[dimensions_display[i]] = [];
            }
            new_list[dimensions_display[i]].push(v);
        }
    }

    let new_dimensions_display = [];
    for (let [key, value] of Object.entries(new_list)) {
        new_list[key] = [...new Set(value)].length;
    }
    return new_list


}

//获取当前sku_name
function get_local_sku_name(skus, asin, dimensions_display) {
    var local_sku_name = skus[asin]
    console.log('local_sku_name:', local_sku_name)
    // return `'${local_sku_name.join("")}'`;
    return local_sku_name.join("").replace(/["']/g, '')  // 移除双引号和单引号
        .replace(/\s+/g, '');  // 移除所有空格;
    // return process.stdout.write(local_sku_name.join(""));
}

function copy_sku_name() {
    const text = document.documentElement.outerHTML;
    const dimensions_display = get_dimensions_display(text)
    console.log('dimensions_display', dimensions_display)
    // 假设你已经有了 HTML 文本，可以使用 DOMParser 来解析
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(text, 'text/html');
    // 1. 使用 XPath 获取 ASIN
    // 方法一：使用 document.evaluate (标准 XPath)
    const asinXPathResult = document.evaluate(
        '//input[@id="ASIN"]/@value',
        htmlDoc,
        null,
        XPathResult.STRING_TYPE,
        null
    );
    const asin = asinXPathResult.stringValue;
    console.log('asin', asin)
    var skus = text.match(/dimensionValuesDisplayData" : ({[\s\S]*?}),/g) || []; //字符串类型的字典
    var sku_name = 'Default'
    if (skus.length === 0) {
        skus = text.match(/dimensionValuesData": ({[\s\S]*?}),/g) || [];
    }
    console.log('skus', skus)

    if (skus.length) {
        // const skus = JSON.parse(skus[0]);   //方案1   未通过

        //方案二
        const match = skus[0].match(/({.*})/);
        if (match) {
            //字符串转json
            skus = JSON.parse(match[1]);

        } else {
            skus = JSON.parse(skus[0]);

        }


        sku_name = get_local_sku_name(skus, asin, dimensions_display)
        console.log('skus:', skus)
        console.log('asin:', asin)
        console.log('dimensions_display:', dimensions_display)
        console.log('sku_name:', sku_name)


    }
    if (sku_name) {
        console.log('sku_name', JSON.stringify(sku_name))
        GM.setClipboard(sku_name);
        alert('已复制sku_name！');
    } else {
        alert('复制失败');
    }
}


(function () {
    'use strict';
    window.debugger = function () {
    };
    document.oncontextmenu = null;
    document.onkeydown = null;
    window.addEventListener('load', function () {
        // 创建按钮
        const button = document.createElement('button');
        button.textContent = '复制ParentAsin';
        // 设置间隔 10px
        button.style.cssText = `
        margin: 20px;
        padding: 8px 16px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        `;
        const titleButton = button.cloneNode(true);
        const cookieButton = button.cloneNode(true);
        const checkButton = button.cloneNode(true);
        const SkuNameButton = button.cloneNode(true);
        titleButton.textContent = '复制标题+ParentAsin';
        cookieButton.textContent = '复制Cookie';
        checkButton.textContent = '复制校验参数';
        SkuNameButton.textContent = '复制SkuName';
        // 绑定点击事件
        button.addEventListener('click', function () {
            copyAsin();
        });

        titleButton.addEventListener('click', function () {
            copyTitle();
        });

        cookieButton.addEventListener('click', function () {
            copyCookie();
        });
        checkButton.addEventListener('click', function () {
            copyCheckData();
        });
        SkuNameButton.addEventListener('click', function () {
            copy_sku_name();
        });

        // 复制所有asin
        const asinButton = button.cloneNode(true);
        asinButton.addEventListener('click', function () {
            copyAsinAll();
        });
        asinButton.textContent = '复制全部Asin';

        const targetElement = document.getElementById('desktop-breadcrumbs_feature_div');
        const appElement = document.getElementById('app');
        // 注入页面
        if (targetElement) {
            targetElement.parentNode.insertBefore(button, targetElement);
            targetElement.parentNode.insertBefore(titleButton, targetElement);
            targetElement.parentNode.insertBefore(checkButton, targetElement);
            targetElement.parentNode.insertBefore(asinButton, targetElement);
            targetElement.parentNode.insertBefore(SkuNameButton, targetElement);
        }
        if (appElement) {
            appElement.parentNode.insertBefore(cookieButton, appElement);
        }

    }, false);

})();