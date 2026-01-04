// ==UserScript==
// @name         Ali-national 助手 by chr1s
// @namespace    http://www.alibaba.com
// @version      4.6
// @description  一键获取商品编辑页的产品信息
// @author       Chr1s

// @match *://www.alibaba.com/*
// @match *://data.alibaba.com/*
// @match *://*.alibaba.com/trade/search*
// @match *://*.alibaba.com/product-detail/*
// @match *://keywordIndex.alibaba.com/*
// @match *://photobank.alibaba.com/*
// @match *://post.alibaba.com/*
// @match *://hz-productposting.alibaba.com/*
// @match *.alibaba.com/product/*

// @icon http://is.alicdn.com/favicon.ico
// @grant GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469529/Ali-national%20%E5%8A%A9%E6%89%8B%20by%20chr1s.user.js
// @updateURL https://update.greasyfork.org/scripts/469529/Ali-national%20%E5%8A%A9%E6%89%8B%20by%20chr1s.meta.js
// ==/UserScript==

// **************************************全局变量 ↓ **************************************
var author_name = '';

var oeCodeStr = '';
var productTitle = document.getElementById('productTitle').value; // 产品标题
var categoryNode = document.querySelector('.category');// chatGPT目标区域1
var ChatGPTarea = document.querySelector('.sell-right-element'); // chatGPT目标区域2
var keywordElements = document.querySelectorAll('div[role="keywords"] input[role="input"]'); // 关键词
var ChatGPTwords = `仅回答当前问题,我提供给你一个汽配产品的标题:"` + productTitle + `"
根据以下要求,在不改变关键主语的条件下重拟标题,并根据该产品设计3个英文关键词.
1. 标题应当根据文意联想这个产品的应用场景,尽量参考Amazon上销量靠前的产品标题的用词特征.
2. 第1个关键词是"营销词+产品中心词",如:Best selling Tablet pc.
3. 第2个关键词是"产品中心词+产品中心词" ,如:16GB 10.1'' Tablet pc.
4. 第3个关键词是"营销词/产品中心词+产品中心词的 近义词/变体", 如:New style laptops/32GB red laptops.
5. 一个产品如有多种叫法,可以在关键词中体现,如"phone"的关键词可以是cellphone或mobile phone等.
6. 禁止从新标题中拆分词汇充当关键词.`;
// **************************************全局变量 ↑ **************************************


(function () {
    'use strict';
    setTimeout(() => {

        getUserName(); // 获取用户名
        document.getElementById('struct-globalMessage').parentElement.removeChild(document.getElementById('struct-globalMessage')); // 删掉碍眼元素
        getTypeCode();
        // **************************************生成元素 ↓ **************************************
        let categoryDiv = document.querySelector('.category');
        let buildImageDiv = document.querySelector('.suggestion');
        // 插入剪切型号按钮
        let cutTypeButton = document.querySelector('.trigger-wrapper');
        // 添加产品信息获取按钮 和 chatgpt查询输入框
        buildButton('一键获取商品信息 by Chr1s', categoryDiv, getProductInfo)
        // 拷贝chat文本按钮生成
        buildButton('一键生成检索词 by Chr1s', document.getElementById('struct-catInfo'), copyChatWords);
        // 生成chatgpt界面
        addChatGPTframe();

        buildParamsButton('检索谷歌', buildImageDiv, searchImage, 'google'); // 添加一键检索型号按钮(一键检索前必须先获取商品信息！！！！！！！！)
        buildParamsButton('检索MadeInChina', buildImageDiv, searchImage, 'MadeInChina');
        buildParamsButton('检索Amazon', buildImageDiv, searchImage, 'amazon');
        buildParamsButton('检索U-buy', buildImageDiv, searchImage, 'u-buy');
        buildParamsButton('检索Aliexpress', buildImageDiv, searchImage, 'Aliexpress');
        buildParamsButton('检索bueno-air', buildImageDiv, searchImage, 'bueno-air');
        buildButton('复制型号', cutTypeButton, copyModelNum);
        // **************************************生成元素 ↑ **************************************
    }, 1500);

})();




// 创建chatGPT窗口
function addChatGPTframe() {
    // 创建一个新的 iframe 元素并设置其 URL
    let iframe = document.createElement('iframe');
    // ChatGPT #1
    // iframe.setAttribute('src', 'https://venivediveci.site/#/chat/1687531884569');
    // ChatGPT #2
    iframe.setAttribute('src', 'https://ai.8abox.art/#/home');
    iframe.setAttribute('style', 'width: 850px; height: 480px;');
    // 将 iframe 添加到文档中

    categoryNode.appendChild(iframe);
}

//  **************************************操作函数 ↓ **************************************
// 点击拷贝检索词
function copyChatWords() {
    copyToClipboard(ChatGPTwords, 'category-card'); // 假设 ChatGPTwords 是要拷贝的文本

    // 创建提示词元素
    let successMessage = document.createElement('span');
    successMessage.textContent = '检索词已拷贝√';
    successMessage.style.color = 'green';

    // 在按钮下方插入提示词元素，并在两秒钟后隐藏
    let tipElem = event.target; // 获取被点击的按钮元素
    tipElem.insertAdjacentElement('afterend', successMessage);
    successMessage.style.display = '';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 2000);
}

// 获取型号 struct-p-3  OE型号struct-p-191294249  struct-p-191288987  通版为Standard
// 针对多个产品型号批量调用 getOECode 函数
function getTypeCode() {
    let productModels = ['struct-p-191294249', 'struct-p-191288987', 'struct-p-3'];
    let oeCodes = [];
    for (let i = 0; i < productModels.length; i++) {
        let oeCode = getOECode(productModels[i]);
        if (oeCode != null) {
            oeCodes.push(oeCode);
        }
    }
    oeCodeStr = oeCodes[0];
}

// 获取指定产品型号的 OE 编码
function getOECode(productModel) {
    let oeCode = null;
    let productElement = document.getElementById(productModel);
    if (productElement) {
        let inputElement = productElement.querySelector('input[type="text"], input[type="hidden"]');
        if (inputElement) {
            oeCode = inputElement.value.trim();
        }
    }
    return oeCode;
}

// 一键检索
function searchImage(params) {
    if (oeCodeStr != '') {
        switch (params) {
            case 'google':
                window.open(`https://www.google.com/search?q=` + oeCodeStr + `&tbm=isch&ved=2ahUKEwiwnNOlsOL_AhXtsVYBHdPNCy0Q2-cCegQIABAA&oq=3874-99-356&gs_lcp=CgNpbWcQDDIECCMQJ1AAWABgoAxoAHAAeACAAewFiAHsBZIBAzYtMZgBAKoBC2d3cy13aXotaW1nwAEB&sclient=img&ei=30WaZPCwO-3j2roP05uv6AI&bih=959&biw=1523#imgrc=yBAEMoImOol1jM`, '_blank');
                break;
            case 'MadeInChina':
                window.open(`https://www.made-in-china.com/productdirectory.do?subaction=hunt&style=b&mode=and&code=0&comProvince=nolimit&order=0&isOpenCorrection=1&org=top&keyword=&file=&searchType=0&word=` + oeCodeStr, '_blank');
                break;
            case 'amazon':
                window.open(`https://www.amazon.com/s?k=` + oeCodeStr + `&ref=nb_sb_noss`, '_blank');
                break;
            case 'u-buy':
                window.open(`https://www.u-buy.com.ng/search/?ref_p=ser_tp&q=` + oeCodeStr, '_blank');
                break;
            case 'Aliexpress':
                window.open(`https://www.aliexpress.com/`, '_blank');
                break;
            case 'bueno-air':
                window.open(`https://www.bueno-air.com/search/index.html?name=` + oeCodeStr, '_blank');
                break;
            default:
                break;
        }
    } else {
        alert('请确认已获取商品信息,或检查该产品是否有型号!');
    }
};

// 复制型号函数
function copyModelNum() {
    copyToClipboard(oeCodeStr, 'struct-scImages');
    // 创建提示词元素
    let successMessage = document.createElement('span');
    successMessage.textContent = '型号已拷贝√';
    successMessage.style.color = 'green';

    // 在按钮下方插入提示词元素，并在两秒钟后隐藏
    let tipElem = event.target; // 获取被点击的按钮元素
    tipElem.insertAdjacentElement('afterend', successMessage);
    successMessage.style.display = '';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 2000);
}

// 直接获取用户名
function getUserName() {
    var nameElement = document.querySelector('.ui-header-wel-name');
    if (nameElement) {
        // author_name = (nameElement.textContent.trim() == 'Frost' ? nameElement.textContent.trim() : 'Ethan');
        author_name = nameElement.textContent.trim();
        console.log(author_name);  // 输出 "Ziv"
    } else {
        console.log("未找到用户名");
    }
}

// **************************************操作函数 ↑ **************************************


// **************************************工具类函数 ↓ **************************************
// 生成按钮工具函数   (按钮名字   ,要传入的元素位置, 添加被监听的函数)
function buildButton(buttonName, elementPosition, watchFunction) {
    let buttonElem = document.createElement('button');
    buttonElem.setAttribute('role', 'btn');
    buttonElem.setAttribute('type', 'button');
    buttonElem.classList.add('next-btn', 'next-btn-normal', 'next-btn-medium', 'category-button');
    buttonElem.textContent = buttonName;
    buttonElem.addEventListener('click', watchFunction);
    elementPosition.appendChild(buttonElem);

    return buttonElem
}

// 生成带参按钮工具函数   (按钮名字   ,要传入的元素位置, 添加被监听的函数,参数)
function buildParamsButton(buttonName, elementPosition, watchFunction, params) {
    let buttonElem = document.createElement('button');
    buttonElem.setAttribute('role', 'btn');
    buttonElem.setAttribute('type', 'button');
    buttonElem.classList.add('next-btn', 'next-btn-normal', 'next-btn-medium', 'category-button');
    buttonElem.textContent = buttonName;
    buttonElem.addEventListener('click', () => watchFunction(params));
    elementPosition.appendChild(buttonElem);

    return buttonElem;
}

function capitalizeInputValue(element) {
    // 获取输入框中的内容并按空格拆分为多个单词
    let words = element.value.split(' ');
    // 对每个单词进行首字母大写处理
    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        // 如果当前单词非空，则将第一个字母转换成大写
        if (word.length > 0) {
            words[i] = word.substr(0, 1).toUpperCase() + word.substr(1);
        }
    }
    // 将单词重新组合成字符串并更新输入框中的值
    element.value = words.join(' ');
    console.log(words);
}

// 将指定文本复制到剪贴板
function copyToClipboard(str, position) {
    let tempTextArea = document.createElement('textarea');
    tempTextArea.value = str;
    document.getElementById(position).appendChild(tempTextArea);
    tempTextArea.focus();
    tempTextArea.select();
    document.execCommand('copy');
    document.getElementById(position).removeChild(tempTextArea);
}

// 输出当前时间
function exportTime() {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // 将月份和日期统一格式化为两位数
    month = ("0" + month).slice(-2);
    day = ("0" + day).slice(-2);

    let formattedDate = `${year}.${month}.${day}`;
    return formattedDate
}

// 触发产品信息获取
function getProductInfo() {
    // 获取产品分组
    let productGroupStr = document.querySelector('span[value]').getAttribute('value');
    let subStrings = productGroupStr.split(' > ');
    let subcategories = [];
    for (let i = 0; i < 3; i++) {
        subStrings[i] ? subcategories.push(subStrings[i].trim()) : subcategories.push('无');
    }

    // 获取型号
    getTypeCode();

    // 判断是否为修改
    let action = '';
    action = (document.querySelector('h1').innerText === '修改产品' ? '修改' : '重发');

    // 获取产品标题
    let productTitle = document.getElementById('productTitle').value;

    // 获取产品原关键词
    let keywords = [];
    for (let i = 0; i < keywordElements.length; i++) {
        keywords.push(keywordElements[i].value);
    }

    // 产品品类
    let productTypes = '';
    productTypes = (document.querySelector('h1').innerText === '修改产品' ? '低分品' : '下架品');

    // 将产品信息拼接成文本并复制到剪贴板
    let productInfoStr = `${subcategories[0]}	${subcategories[1]}	${subcategories[2]}	${oeCodeStr}	${productTypes}	${action}	${productTitle}		"${keywords[0]}
${keywords[1]}
${keywords[2]}"		${oeCodeStr}	${oeCodeStr}			${exportTime()}	${author_name}`;
    copyToClipboard(productInfoStr, 'category-card');
    alert(`已自动将产品信息复制到剪贴板：${productInfoStr}`);
}
// **************************************工具类函数 ↑ **************************************