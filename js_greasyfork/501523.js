// ==UserScript==
// @name         亚马逊广告ID显示
// @namespace    http://www.wukui.fun/
// @version      202407295
// @description  在搜索结果页和商品页显示亚马逊广告活动ID或广告活动的名称
// @author       吴奎
// @match        https://www.amazon.com/s*
// @match        https://www.amazon.ca/s*
// @match        https://www.amazon.de/s*
// @match        https://www.amazon.com/*/B0*
// @match        https://www.amazon.com.mx/s*
// @match        https://www.amazon.com/*dp/B0*
// @match        https://www.amazon.ca/*/B0*
// @match        https://www.amazon.ca/*dp/B0*
// @match        https://www.amazon.de/*dp/B0*
// @match        https://www.amazon.de/*/B0*
// @match        https://www.amazon.com.mx/*dp/B0*
// @match        https://www.amazon.com.mx/*/B0*
// @match        https://www.amazon.com/gp/product/B0*
// @match        https://www.amazon.com.mx/gp/product/B0*
// @match        https://www.amazon.ca/gp/product/B0*
// @match        https://www.amazon.de/gp/product/B0*
// @license      MIT license
// @icon         https://www.amazon.com/favicon.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/501523/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%B9%BF%E5%91%8AID%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/501523/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%B9%BF%E5%91%8AID%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //创建广告活动名称导入按钮
    (function () {
        // 动态创建导入按钮
        var importButton = document.createElement('button');
        importButton.textContent = '导入';
        importButton.style.position = 'fixed'; // 固定位置
        importButton.style.left = '3px'; // 左侧距离
        importButton.style.bottom = '3px'; // 底部距离
        importButton.style.zIndex = '999999'; // 确保按钮在最上层

        // 为按钮添加点击事件处理程序
        importButton.addEventListener('click', function () {
            // 创建一个文件输入元素（隐藏）
            var fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json'; // 限制只接受.json文件
            fileInput.onchange = handleFileSelect; // 文件选择后调用处理函数

            // 触发点击事件
            fileInput.click();
        });

        // 将按钮添加到页面
        document.body.appendChild(importButton);
    })();




    // 获取当前页面的URL
    var currentURL = window.location.href;

    // 根据URL模式调用不同的函数
    if (currentURL.includes('/s')) {
        // 假设以'/s'开头的URL是搜索页面
        handleSearchPage();
    } else if (currentURL.includes('/dp/B0')) {
        // 假设包含'/dp/B0'的URL是产品页面
        handleProductPage();
    }

    // 定义两个函数，分别对应不同的URL模式
    // 在这里编写处理搜索页面的代码  ----------------------------------------------------------------------
    function handleSearchPage() {
        //console.log('Handling search page...');
        // 在这里编写处理搜索页面的代码
        // 选择要观察的目标节点
        const targetNode = document.querySelector("#search>div>div:first-child>div.sg-col-inner>span>div:first-child");

        let previousChildCount = 0;
        let debounceTimer = null;
        const DEBOUNCE_DELAY = 1; // 500毫秒的延迟

        // 防抖函数
        function debounce(func, delay) {
            return function () {
                const context = this;
                const args = arguments;
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => func.apply(context, args), delay);
            };
        }

        // 处理子元素变化的函数
        const handleChildrenChange = debounce(() => {
            const currentChildCount = targetNode.children.length;

            if (currentChildCount !== previousChildCount) {
                //调用操作html页面的函数
                modifyAdElements();
                hengFuGungGaoWei();
                previousChildCount = currentChildCount;
            }
        }, DEBOUNCE_DELAY);

        // 创建一个观察者实例
        const observer = new MutationObserver(handleChildrenChange);

        // 配置观察选项
        const config = { childList: true, subtree: false };

        // 开始观察目标节点
        if (targetNode) {
            previousChildCount = targetNode.children.length;
            observer.observe(targetNode, config);
            console.log('开始观察目标节点');
            console.log('初始子元素数量:', previousChildCount);
        } else {
            console.log('未找到目标节点');
        }

        // 如果需要停止观察
        // observer.disconnect();

        //操作html页面
        function modifyAdElements() {
            document.querySelectorAll('[data-asin^="B0"].AdHolder:not(.modified)').forEach((element, index) => {
                // 1. 获取当前元素下的"[id^="a-popover-sp-info-popover-"]>div>div>span"标签中的"data-s-safe-ajax-modal-trigger"属性
                const popoverSpan = element.querySelector('[id^="a-popover-sp-info-popover-"] > div > div > span');
                const modalTriggerAttribute = popoverSpan ? popoverSpan.getAttribute('data-s-safe-ajax-modal-trigger') : null;

                // 2. 把当前元素下的".puis-label-popover-default>span.a-color-secondary"标签中的文本内容修改为当前元素的序号
                const labelSpan = element.querySelector('.puis-label-popover-default > span.a-color-secondary');
                //如果span内容是"Featured from Amazon brands"则跳过当前循环
                if (labelSpan.textContent != "Featured from Amazon brands") {
                    //读取'campaignId'
                    let campaignId = extractAdInfo(modalTriggerAttribute, 'campaignId');
                    let quMingCheng = duQuZhi(campaignId);
                    if (quMingCheng) {
                        campaignId = quMingCheng
                    }
                    if (labelSpan) {
                        // console.log(modalTriggerAttribute)
                        labelSpan.textContent = campaignId; // 当前元素的序号（从1开始）
                    }
                    const labelSpan2 = element.querySelector('.puis-label-popover-hover > span.a-color-base');
                    if (labelSpan2) {

                        labelSpan2.textContent = campaignId; // 当前元素的序号（从1开始）
                    }
                }
                // 给当前顶级元素添加一个类名标记已修改
                element.classList.add('modified');
            });
        }



        //延时函数
        function delay(ms) {
            return function (callback) {
                setTimeout(callback, ms);
            };
        }

        // 使用方法
        delay(1000)(() => {
            //调用操作html页面的函数
            modifyAdElements();
            hengFuGungGaoWei();
            //console.log("这条消息在 2 秒后显示");
        });

        //处理横幅广告区域位置
        function hengFuGungGaoWei() {
            console.log("处理横幅广告区域位置");
            // Select the span element using the provided CSS selector
            const element = document.querySelector('span[data-multi-ad-feedback-form-trigger].a-declarative:not(.modified)');
            if (!element) {
                console.log("没找到横幅广告");
                return;
            }
            let jsonData = "";
            // Extract the attribute value
            if (element) {
                const attributeValue = element.getAttribute('data-multi-ad-feedback-form-trigger');
                jsonData = attributeValue; // This will print out the JSON string value of the attribute
            } else {
                console.log('Element not found');
            }
            // 解析外层JSON
            let data = JSON.parse(jsonData);

            // 提取并解析multiAdfPayload中的JSON字符串
            let multiAdfPayloadStr = data.multiAdfPayload;

            let multiAdfPayload = JSON.parse(multiAdfPayloadStr);
            // 输出multiAdfPayload的内容
            //console.log(multiAdfPayload);
            // 假设multiAdfPayload已经是解析后的对象
            let adCreativeDetails = multiAdfPayload.adCreativeMetaData.adCreativeDetails;
            // 遍历adCreativeDetails数组
            adCreativeDetails.forEach(detail => {
                // 提取并打印adId, campaignId, asin
                console.log(`adId: ${detail.adId}`);
                console.log(`campaignId: ${detail.campaignId}`);
                console.log(`asin: ${detail.asin}`);
                // 调用函数-给4星等横向区域广告添加广告活动名或活动id
                appendParagraphAfterFirstChild(detail.asin, detail.campaignId);
                // 如果需要将这些值存储或进一步处理，可以这样做
                // let extractedData = { adId: detail.adId, campaignId: detail.campaignId, asin: detail.asin };
                // ...进一步处理extractedData...
            });
            // 给当前顶级元素添加一个类名标记已修改
            element.classList.add('modified');
        }

        // 给4星等横向区域广告添加广告活动名或活动id
        function appendParagraphAfterFirstChild(ASIN, campaignId) {
            // 使用CSS选择器获取首个匹配的元素
            var element = document.querySelector(`ol > li > div[data-asin="${ASIN}"] > div > div > span > div > div`);

            if (element) {
                let firstDivChild = Array.from(element.children).find(child => child.nodeName.toLowerCase() === 'div');

                if (firstDivChild) {
                    // 创建一个新的<p>元素
                    let mingCheng = campaignId;
                    var newParagraph = document.createElement('p');
                    // 根据campaignId获取活动名
                    let huoDongMing = duQuZhi(campaignId);
                    if (huoDongMing) {
                        mingCheng = huoDongMing;
                    }
                    // 设置新<p>元素的内容
                    newParagraph.textContent = mingCheng;
                    // 为新<p>元素添加类名和设置样式
                    newParagraph.classList.add('a-color-secondary');
                    newParagraph.style.fontSize = '11px';
                    newParagraph.style.marginLeft = '10px'; // 设置左边距为10像素
                    newParagraph.style.marginRight = '10px'; // 设置右边距为10像素
                    newParagraph.style.marginBottom = '0px'; // 设置下边距为0像素
                    // 将新<p>元素插入到第一个<div>子元素之后
                    element.insertBefore(newParagraph, firstDivChild.nextSibling);
                } else {
                    console.log("匹配的元素下没有<div>子元素");
                }
            } else {
                console.log("未找到匹配的元素");
            }
        }


    }

    // 在这里编写处理产品页面的代码  -------------------------------------------------------------------------
    function handleProductPage() {
        // 使用 load 事件
        window.addEventListener('load', function () {
            // 调用函数
            setTimeout(function () {
                //console.log("匿名函数在1秒后执行");
                addFeedbackDetails();
                modifyElementContent();
                // 调用函数来添加事件监听器
                addClickEventToCarouselButtons();
            }, 500); // 正确

        });

        //console.log('Handling product page...');

        //产品页-提取json中的广告ID
        function extractValue(jsonString, key) {
            try {
                const data = JSON.parse(jsonString);
                if (key in data) {
                    return data[key];
                } else {
                    console.log(`键 "${key}" 不存在于数据中`);
                    return null;
                }
            } catch (error) {
                console.error('解析JSON时出错:', error);
                return null;
            }
        }

        //console.log(extractValue(text, 'adId'));
        //console.log(extractValue(text, 'campaignId'));
        //console.log(extractValue(text, 'title'));
        function addFeedbackDetails() {
            // 定义标记类名
            const processedClass = 'feedback-processed';

            // 获取所有匹配选择器的元素，排除已处理的元素
            const elements = document.querySelectorAll(`li>div[id^="sp_detail"]:not(.${processedClass})`);

            // 循环遍历每个元素
            elements.forEach(element => {
                // 获取data-adfeedbackdetails属性的值
                const feedbackDetails = element.getAttribute('data-adfeedbackdetails');

                // 如果属性存在
                if (feedbackDetails) {
                    // 创建新的p元素
                    const pElement = document.createElement('p');

                    // 设置p元素的文本内容
                    let campaignId = extractValue(feedbackDetails, 'campaignId');

                    // 根据campaignId获取活动名
                    let huoDongMing = duQuZhi(campaignId);
                    if (huoDongMing) {
                        campaignId = huoDongMing;
                    }
                    //添加广告活动ID或广告活动名称
                    pElement.textContent = campaignId;
                    // 添加第一个类名  
                    pElement.classList.add('sp_detail_thematic-highly_rated_sponsored_label');
                    // 添加第二个类名  
                    pElement.classList.add('sp_detail_thematic-recent_history_sponsored_label');
                    // 添加内联样式
                    pElement.style.marginBottom = '0px';
                    // 找到当前元素下的a>img元素
                    const imgElement = element.querySelector('a>div>img');

                    // 如果找到了img元素
                    if (imgElement) {
                        // 在img元素后插入新创建的p元素
                        imgElement.parentNode.insertBefore(pElement, imgElement.nextSibling);

                        // 给顶级元素添加已处理的标记类
                        element.classList.add(processedClass);
                    }
                }
            });
        }

        //给翻页按钮添加点击事件
        function addClickEventToCarouselButtons() {
            // 选择所有匹配的元素
            const buttons = document.querySelectorAll('.a-row>.a-row .a-carousel-row-inner>div.a-carousel-col>a.a-button.a-button-image.a-carousel-button');

            // 为每个按钮添加点击事件监听器
            buttons.forEach(button => {
                button.addEventListener('click', function (event) {
                    // 阻止默认行为（如果需要的话）
                    // event.preventDefault();

                    // 设置100毫秒延时
                    setTimeout(() => {
                        // 调试输出函数
                        addFeedbackDetails();
                    }, 2000);
                });
            });
        }



    }

   


    //公用函数-------------------------------------------------------------------------
    //产品页-提取json中的广告ID
    function extractValue(jsonString, key) {
        try {
            const data = JSON.parse(jsonString);
            if (key in data) {
                return data[key];
            } else {
                console.log(`键 "${key}" 不存在于数据中`);
                return null;
            }
        } catch (error) {
            console.error('解析JSON时出错:', error);
            return null;
        }
    }
    

    //搜索也-提取ID
    function extractAdInfo(jsonString, infoType) {
        // 解析JSON字符串
        const jsonObject = JSON.parse(jsonString);
        // 获取ajaxUrl的值
        const ajaxUrl = jsonObject.ajaxUrl;
        //console.log(ajaxUrl);
        // 提取查询参数
        const queryParams = new URLSearchParams(ajaxUrl.split('?')[1]);
        // 获取并解码'pl'参数的值
        // console.log(queryParams.get('pl'));
        //const decodedPlValue = decodeURIComponent(queryParams.get('pl'));
        // 解析解码后的'pl'值
        const plObject = JSON.parse(queryParams.get('pl'));
        // const plObject = JSON.parse(decodedPlValue);
        // 根据infoType返回对应的值
        if (infoType === 'adId') {
            return plObject.adCreativeMetaData.adCreativeDetails[0].adId;
        } else if (infoType === 'campaignId') {
            return plObject.adCreativeMetaData.adCreativeDetails[0].campaignId;
        } else {
            throw new Error('Invalid infoType. Please provide "adId" or "campaignId".');
        }
    }

    // 导入数据文件选择处理函数
    function handleFileSelect(event) {
        var file = event.target.files[0]; // 获取选中的文件
        if (!file) {
            alert('没有选择文件！');
            return;
        }

        // 使用FileReader读取文件内容
        var reader = new FileReader();
        reader.onload = function (e) {
            try {
                var content = e.target.result; // 读取到的文件内容
                var importedData = JSON.parse(content); // 解析JSON字符串为对象

                // 存储到localStorage
                localStorage.setItem('myData', JSON.stringify(importedData));

                console.log('数据导入成功！');
                alert('文件导入成功,请刷新页面');
                // 可以在这里添加更多处理导入数据的逻辑
            } catch (error) {
                console.error('解析JSON数据时出错:', error);
                alert('文件内容不是有效的JSON格式！');
            }
        };
        reader.readAsText(file); // 以文本形式读取文件
    }

    //通过读取广告活动名称
    function duQuZhi(id) {
        //console.log("提取id","从localStorage获取数据");
        // 从localStorage获取数据
        var storedUsersStr = localStorage.getItem('myData');
        //console.log(storedUsersStr);
        if (storedUsersStr) {
            // 将字符串转换回对象
            var users = JSON.parse(storedUsersStr);

            // 访问对象中的值
            //console.log(id,users[id]);
            return users[id];

        }

    }
    //获取详情页英雄快速促销广告的json内容
    function getIframeName() {
        var iframeElement = document.querySelector('#hero-quick-promo iframe');
        if (iframeElement) {
            return iframeElement.name;
        } else {
            return 'Iframe not found';
        }
    }
    //用正则表达式获取campaignId字符串
    function extractCampaignId(text) {
        const regex = /\W+"campaignId\W+"\s:\s\W+"(A0\w{18,19})\W+"/;
        const match = text.match(regex);

        if (match && match[1]) {
            return match[1]; // 返回匹配到的 campaignId 值
        } else {
            return null; // 如果没有找到匹配项，则返回 null
        }
    }
    //extractCampaignId(getIframeName());

    //处理详情页英雄快速促销广告活动名称
    function modifyElementContent() {
        // 选择元素
        var element = document.querySelector('#hero-quick-promo div > a > span:not(.modified)');

        if (element) {
            // 修改元素的内容
            let campaignId = extractCampaignId(getIframeName());
            console.log('campaignId:', campaignId);
            let huoDongMing = duQuZhi(campaignId);
            if (huoDongMing) {
                campaignId = huoDongMing;
            }
            element.textContent = campaignId;

            // 添加类名 "modified"
            element.classList.add('modified');
            let divElement = document.querySelector('#hero-quick-promo > div > div');
            divElement.style.width = '140px';
            return true; // 表示操作成功
        } else {
            return false; // 表示没有找到元素
        }
    }
    //modifyElementContent();









    // Your code here...
})();