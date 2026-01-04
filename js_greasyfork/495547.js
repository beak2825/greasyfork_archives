// ==UserScript==
// @name         零售链山姆供应商订单页面本地化与增强
// @namespace    https://retaillink.wal-mart.com/
// @version      1.7
// @description  在沃尔玛零售链山姆供应商的WebEDI订单页面上进行文本本地化，设置默认下拉选项，并格式化日期
// @author       Mr.WOO
// @match        *://*.retaillink2.wal-mart.com/Webedi2/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/495547/%E9%9B%B6%E5%94%AE%E9%93%BE%E5%B1%B1%E5%A7%86%E4%BE%9B%E5%BA%94%E5%95%86%E8%AE%A2%E5%8D%95%E9%A1%B5%E9%9D%A2%E6%9C%AC%E5%9C%B0%E5%8C%96%E4%B8%8E%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/495547/%E9%9B%B6%E5%94%AE%E9%93%BE%E5%B1%B1%E5%A7%86%E4%BE%9B%E5%BA%94%E5%95%86%E8%AE%A2%E5%8D%95%E9%A1%B5%E9%9D%A2%E6%9C%AC%E5%9C%B0%E5%8C%96%E4%B8%8E%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 翻译字典
    var translationDict = {
        "There are no active announcements at this time.": "当前没有活动公告",
        "Search returned no available pdf documents": "未找到搜索的PDF文档",
        "Total Order Amount (After Adjustments)": "订单合计金额(折扣后)",
        "NET 60 based on Receipt of Goods": "自收货单生效起至少60天",
        "Search returned no results": "没有搜索结果",
        "THIS IS A FREE GOODS ORDER": "这是一张货物免费的订单",
        "Modify Search Criteria": "修改搜索条件",
        "Purchase Order Number": "订单号",
        "Retail Link Homepage": "零售链首页",
        "Vendor Mailbox Setup": "供应商邮箱设置",
        "Mailbox Maintenance": "邮箱维护",
        "Prepaid (By Seller)": "预付（售货方）",
        "Purchase Order Date": "订单日期",
        "Total Units Ordered": "订货单位数合计",
        "Additional Details": "补充的细节",
        "Allowance / Charge": "补贴/收款",
        "Exclude Downloaded": "排除已下载",
        "Order Instructions": "说明",
        "Vendor Information": "供应商信息",
        "Your Requests Only": "仅限您的请求",
        "Download Selected": "下载选定",
        "Exception Message": "异常信息",
        "F.O.B. Ship Point": "F.O.B. 装运点",
        "Inbound Documents": "订单收件箱",
        "PO Number & Dates": "订单号码&日期",
        "Promotional Event": "促销活动",
        "Item Description": "商品说明",
        "Quantity Ordered": "订货数量（箱）",
        "Item Instructions": "项目说明",
        "Supplier Stock #": "供应商商品号",
        "Total Line Items": "商品(行)合计",
        "Unique Documents": "唯一文档",
        "Document Number": "文档编号",
        "Inbound Account": "收件箱账户",
        "Supplier Number": "供应商编号",
        "Partially Read": "部分已读",
        "Purchase Order": "订单",
        "Request Status": "请求状态",
        "Vendor Country": "供应商国家",
        "Announcements": "公告",
        "Back to Inbox": "返回收件箱",
        "Document Type": "文档类型",
        "Download Date": "下载日期",
        "Extended Cost": "合计成本",
        "Payment Terms": "付款条件",
        "PDF Dashboard": "PDF仪表板",
        "Supplier Name": "供应商名称",
        "Vendor Number": "供应商编号",
        "Request Date": "请求日期",
        "VENDOR ROUTE": "供应商路线",
        "Cancel Date": "交货日期",
        "Description": "说明",
        "Expire Date": "过期日期",
        "Export Grid": "导出表格",
        "Retail Link": "零售链",
        "Vendor Name": "供应商名称",
        "Walmart Inc": "沃尔玛公司",
        "Department": "部门",
        "Free Goods": "免征税货物",
        "Mailbox Id": "邮箱ID",
        "Order Type": "订单类型",
        "Start Time": "开始时间",
        "Allowance": "补贴",
        "Queue PDF": "PDF队列",
        "Reporting": "报告",
        "Ship Date": "起运日期",
        "Complete": "完成",
        "Continue": "继续",
        "Currency": "货币",
        "Document": "订单号",
        "End Time": "结束时间",
        "Handling": "人工",
        "Location": "DC仓号",
        "Q Search": "快速搜索",
        "Sequence": "排序",
        "SHENZHEN": "深圳",
        "Supplier": "供应商",
        "Tax Type": "税类型",
        "VAT - IN": "进项税率",
        "Account": "账户",
        "Archive": "归档",
        "Carrier": "承运人",
        "Country": "国家",
        "Inbound": "收件箱",
        "Percent": "百分比",
        "Ship To": "送货至：",
        "F.O.B.": "离岸价",
        "Logout": "退出",
        "Search": "搜索",
        "Status": "状态",
        "Unread": "未读",
        "Vendor": "供应商",
        "Color": "箱×层",
        "Total": "合计",
        "Cost": "成本",
        "Date": "订单日期",
        "GTIN": "条码",
        "Item": "商品号",
        "Line": "序号",
        "Pack": "罐/件",
        "Read": "已读",
        "Size": "罐",
        "Type": "类型",
        "CA\t": "箱",
        "CNY": "人民币",
        "UOM": "单位",
        "CN": "中国",
        "PO": "采购订单",
        "4802": "嘉兴DC(4802)",
        "4817": "成都DC(4817)",
        "4819": "武汉DC(4819)",
        "4873": "天津DC(4873)",
        "4874": "深圳DC(4874)"
        // 根据需要继续添加更多的翻译对
    };

    // 翻译页面中的文本内容，保留HTML标签
    function translateText(text) {
        let translatedText = text;
        // 遍历翻译字典中的每个条目
        for (let enWord in translationDict) {
            // 对于数字，直接替换
            if (isNaN(enWord)) {
                let regex = new RegExp('\\b' + enWord + '\\b', 'g');
                translatedText = translatedText.replace(regex, translationDict[enWord]);
            } else {
                // 对于其他文本，保持原有替换逻辑
                translatedText = translatedText.split(enWord).join(translationDict[enWord]);
            }
        }
        return translatedText;
    }

    function translateDOMText() {
        var walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        var node;

        while (node = walker.nextNode()) {
            // 确保只替换每个文本节点一次
            if (!node.translated) {
                node.textContent = translateText(node.textContent);
                node.translated = true;
            }
        }
    }


    // 观察 DOM 变动的函数
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    translateDOMText();
                }
            });
        });

        // 翻译具有特定属性的元素，例如title或alt
        var elementsWithTitle = document.querySelectorAll('[type="button"], [type="submit"]');
        elementsWithTitle.forEach(function(el) {
            if (el.title) {
                el.title = translateText(el.title);
            }
        });

        // 翻译placeholder属性
        var inputs = document.querySelectorAll('input[placeholder]');
        inputs.forEach(function(input) {
            var placeholderText = input.getAttribute('placeholder');
            var translatedText = translationDict[placeholderText] || placeholderText;
            input.setAttribute('placeholder', translatedText);
        });

        // 设置默认下拉选项
        var selects = document.getElementsByClassName('form-control');
        for (var i = 0; i < selects.length; i++) {
            var select = selects[i];
            switch (select.id) {
                case 'docTypeInput':
                    select.value = '2'; // PO
                    break;
                case 'statusInput':
                    select.value = 'A'; // Archive
                    break;
                case 'vendorNumberInput':
                    select.value = '24980'; // Vendor Number
                    break;
                case 'countryInput':
                    select.value = 'CN'; // CN
                    break;
                    // ... 其他下拉框的默认值设置
            }
        }

        // 调整表格列宽度的函数
        function adjustTableColumnWidths() {
            // 获取所有的th元素
            const tableHeaders = document.querySelectorAll('th[scope="col"]');

            // 遍历所有的th元素
            tableHeaders.forEach(header => {
                // 获取现有的style.width值
                const width = header.style.width;

                // 检查是否存在width属性，并进行相应的调整
                if (width === '50px') {
                    header.style.width = '60px'; // 将50px调整为60px
                } else if (width === '80px') {
                    header.style.width = '100px'; // 将80px调整为100px
                }
            });
        }

        // 页面加载完成后执行调整列宽的操作
        window.addEventListener('load', adjustTableColumnWidths);

        // 如果页面已经加载完成，则立即执行调整列宽的操作
        if (document.readyState === 'complete') {
            adjustTableColumnWidths();
        }
    });


    // 格式化日期的函数
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    };


    // 观察 DOM 变动的函数，包括data-bind和<a>标签的翻译
    const observeFormatting = () => {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 确保这个选择器与您的目标元素相匹配
                        const dateSpans = node.querySelectorAll('[data-bind="text: createdDateTime"]');
                        dateSpans.forEach(dateSpan => {
                            if (dateSpan.textContent) {
                                const formattedDate = formatDate(dateSpan.textContent);
                                dateSpan.textContent = formattedDate;
                            }
                        });

                        // 翻译<a>标签内的文本
                        const links = node.querySelectorAll('a');
                        links.forEach(link => {
                            if (link.textContent) {
                                link.textContent = translateText(link.textContent);
                            }
                        });
                    }
                });
            });
        });


        // 获取所有需要更改格式的日期元素
        const dateElements = document.querySelectorAll('span[id="poDate"], span[id="shipDate"], span[id="cancelDate"]');

        // 遍历所有元素，进行日期格式的转换
        dateElements.forEach(element => {
            // 读取原始日期字符串
            let originalDate = element.textContent;
            // 匹配月份和日期
            const match = originalDate.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            if (match) {
                // 重新组合日期为 yyyy/mm/dd 格式
                let newDate = `${match[3]}/${match[1]}/${match[2]}`;
                // 更新元素内容
                element.textContent = newDate;
            }
        });

        // 观察整个文档树，观察新增的节点
        observer.observe(document.body, { childList: true, subtree: true });
    };

    // 页面加载完成后开始观察
    window.addEventListener('load', observeFormatting);

    // 如果页面已经加载完成，则立即开始观察
    if (document.readyState === 'complete') {
        observeFormatting();
    }

    // 等待页面加载完成后执行文本替换
    window.addEventListener('load', function() {
        translateDOMText();
        observer.observe(document.body, { childList: true, subtree: true });
    });

    // 如果页面已经加载完成，则立即开始观察
    if (document.readyState === 'complete') {
        observer.observe(document.body, { childList: true, subtree: true });
    }
    // 创建一个按钮并设置文本和样式
    const checkButton = document.createElement('button');
    checkButton.textContent = '检查重复';
    checkButton.className = 'mr-4 d-none d-lg-inline'; // 添加类以匹配周围的元素
    checkButton.style.textDecoration = 'none'; // 移除下划线

    // 检查订单号是否重复并高亮显示的函数
    function checkOrderNumbers() {
        // 创建一个映射，用于存储订单号和对应的DOM元素
        const orderNumbers = {};

        // 获取所有订单号链接
        const orderNumberLinks = document.querySelectorAll('tbody tr td:nth-child(5) a');

        // 遍历所有订单号链接
        orderNumberLinks.forEach(link => {
            // 获取订单号文本
            const orderNumberText = link.textContent.trim();
            // 如果映射中已有该订单号，说明发现重复
            if (orderNumbers.hasOwnProperty(orderNumberText)) {
                // 标记重复的订单号为红色背景和黄色文字
                highlightDuplicates(orderNumbers[orderNumberText], link);
            } else {
                // 否则，将订单号和对应的DOM元素存储到映射中
                orderNumbers[orderNumberText] = link;
            }
        });
    }

    // 标记重复订单号的函数
    function highlightDuplicates(existingLink, newLink) {
        // 为已存在的订单号和新发现的订单号添加样式
        existingLink.style.backgroundColor = 'red';
        existingLink.style.color = 'yellow';
        existingLink.style.fontWeight = 'bold';

        newLink.style.backgroundColor = 'red';
        newLink.style.color = 'yellow';
        newLink.style.fontWeight = 'bold';
    }

    // 将按钮插入到特定位置
    const targetDiv = document.querySelector('.col-lg-8.p-0.m-0.mb-1.text-left');
    if (targetDiv) {
        // 在特定元素前插入按钮
        const anchorTag = targetDiv.querySelector('a[data-toggle="modal"][data-target="#exportListing"]');
        if (anchorTag) {
            targetDiv.insertBefore(checkButton, anchorTag);
        }
    }

    // 添加点击事件监听器
    checkButton.addEventListener('click', checkOrderNumbers);
})();