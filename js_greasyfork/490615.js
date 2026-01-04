// ==UserScript==
// @name         系统插件
// @namespace    http://tampermonkey.net/
// @version      3.15.6
// @description  为大货的管理系统添加功能
// @author       You
// @match        http://47.115.125.92:8087/main*
// @match        https://admin.smartrogi.com/main*
// @match        http://admin.smart777v.com/main*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=125.92
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.core.min.js
// @require      https://unpkg.com/a-calc@2.2.10/browser/index.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490615/%E7%B3%BB%E7%BB%9F%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/490615/%E7%B3%BB%E7%BB%9F%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let 商品字段 = {
        '流水号': { cellPosition: [], selector: '', valueType: 'number', setSerial: (serial) => serial },
        '编号': { cellPosition: [0, 1], selector: '', valueType: 'string' },
        '商品图片链接': { cellPosition: [0], selector: 'img[name="productCover"]', attribute: 'src', valueType: 'string' },
        '商品属性': {
            cellPosition: [0, 3], selector: 'div.productSkuBox', attribute: 'value', valueType: 'string',
            processCellContent: (target) => {
                if (target) {
                    const textareas = target.querySelectorAll('textarea');
                    const values = Array.from(textareas)
                        .map(textarea => textarea.value.trim())
                        .filter(value => value.length > 0); // 过滤掉空字符串
                    const sortAndJoin = (arr) => arr.sort().join('|');
                    return sortAndJoin(values);
                }
                else {
                    return '無い';
                }
            }
        },
        '发货日期': { cellPosition: [0], selector: 'input[name="sendDateStr"]', attribute: 'value', valueType: 'string' },
        '管理者备注': { cellPosition: [0], selector: 'textarea[name="remark"]', attribute: 'value', valueType: 'string' },
        'offerId': {
            cellPosition: [2], selector: 'textarea[name="productUrl"]', attribute: 'value', valueType: 'string',
            processCellContent: ((target) => {
                if (target.textContent) {
                    let goodLink = target.textContent;
                    if (goodLink.includes('taobao') || goodLink.includes('tmall')) {
                        for (let i of goodLink.split('?')[1].split('&')) {
                            if (i.slice(0, 3) === 'id=') {
                                return i.slice(3);
                            }
                        }
                    }
                    if (goodLink.includes('1688')) {
                        return goodLink.split('/')[4].split('.')[0];
                    }
                }
                return 'id解析错误';
            })
        },
        '总采购数量': { cellPosition: [2], selector: 'input[name="totalCount"]', attribute: 'value', valueType: 'number' },
        '内部笔记': { cellPosition: [2], selector: 'textarea[name="keyNote"]', attribute: 'value', valueType: 'string' },
        '商品单价': { cellPosition: [3, 1], selector: 'input[name="price"]', attribute: 'value', valueType: 'number' },
        '发货数量': { cellPosition: [4, 1], selector: 'input[name="sendCount"]', attribute: 'value', valueType: 'number' },
        '商品小计_sys': { cellPosition: [4, 3], selector: 'input[name="totalPrice"]', attribute: 'value', valueType: 'number' },
        '商品小计_cal': {
            cellPosition: [], selector: '', valueType: 'number',
            computed: (itemData) => calcWithValidation(' a * b ', { a: '发货数量', b: '商品单价' }, itemData)
        },
        '商品小计_error': {
            cellPosition: [], selector: '', valueType: 'number',
            errorCheck(itemData) {
                let [商品小计_sys, 商品小计_cal] = [itemData['商品小计_sys'], itemData['商品小计_cal']];
                if (商品小计_sys != 商品小计_cal) {
                    return `${商品小计_sys}_${商品小计_cal}`;
                }
                return '';
            },
        },
        '跳转链接': { cellPosition: [4], selector: 'textarea[name="webUrl"]', attribute: 'value', valueType: 'string' },
        '入库数量': { cellPosition: [5, 1], selector: 'input[name="wareHouseCount"]', attribute: 'value', valueType: 'number' },
        '国内运费': { cellPosition: [5, 3], selector: 'input[name="logisticsPrice"]', attribute: 'value', valueType: 'number' },
        '手续费': { cellPosition: [6], selector: 'input[name="handlePrice"]', attribute: 'value', valueType: 'number' },
        '要望栏内容': { cellPosition: [6], selector: 'textarea[name="clientRemark"]', attribute: 'value', valueType: 'string' },
        '附加服务费': { cellPosition: [6], selector: 'input[name="additionalServicePrice"]', attribute: 'value', valueType: 'number' },
        '采购价格': { cellPosition: [7, 1], selector: 'input[name="purchasePrice"]', attribute: 'value', valueType: 'number' },
        '采购单号': { cellPosition: [7], selector: 'input[name="purchaseNo"]', attribute: 'value', valueType: 'string' },
        '实发数量': { cellPosition: [7], selector: 'input[name="sendCount"]', attribute: 'value', valueType: 'number' },
        '实际运费': { cellPosition: [8], selector: 'input[name="realityLogisticsPrice"]', attribute: 'value', valueType: 'number' },
        '采购日期': { cellPosition: [8], selector: 'input[name="purchaseDateStr"]', attribute: 'value', valueType: 'string' },
        '小计_sys': { cellPosition: [8], selector: 'input.tempallprice_val', attribute: 'value', valueType: 'number' },
        '小计_cal': {
            cellPosition: [], selector: '', valueType: 'number',
            computed: (itemData) => calcWithValidation('a * b + c + d ', { a: '发货数量', b: '商品单价', c: '国内运费', d: '手续费' }, itemData)
        },
        '小计_error': {
            cellPosition: [], selector: '', valueType: 'number',
            errorCheck(itemData) {
                let [小计_sys, 小计_cal] = [itemData['小计_sys'], itemData['小计_cal']];
                if (小计_sys != 小计_cal) {
                    return `${小计_sys}_${小计_cal}`;
                }
                return '';
            },
        },
    };
    const calc = a_calc.calc;
    // calcWithValidation 函数，fieldMap 存储变量名到字段名的映射，optionalVars 是额外的常量或变量
    function calcWithValidation(expression, fieldMap, // 变量名到 ItemDetail 字段名的映射
    data, optionalVars = {} // 可选参数，用于提供额外的常量或变量
    ) {
        const values = {};
        // 提取 fieldMap 中的值，并从 data 中获得实际字段值
        Object.entries(fieldMap).forEach(([variable, fieldName]) => {
            const fieldValue = Number(data[fieldName]);
            values[variable] = isNaN(fieldValue) ? 0 : fieldValue;
        });
        // 添加 optionalVars 中的变量
        Object.assign(values, optionalVars);
        // 使用 calc 函数计算。在表达式后加上|!n，以确定返回的是number
        return calc(`${expression}|!n`, values); // 假设 calc 执行表达式计算
    }
    function setItemField(item, key, value) {
        item[key] = value;
    }
    function extractOrderItems(rows, mapField) {
        const items = [];
        let 流水号 = 1;
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < rows.length; i += 11) {
            for (let j = i; j < i + 11 && j < rows.length; j++) {
                fragment.appendChild(rows[j].cloneNode(true));
            }
            let item = {};
            for (const [fieldName, fieldConfig] of Object.entries(mapField)) {
                if (fieldConfig.setSerial) {
                    setItemField(item, fieldName, fieldConfig.setSerial(流水号));
                    continue;
                }
                if (fieldConfig.computed) {
                    setItemField(item, fieldName, fieldConfig.computed(item));
                    continue;
                }
                if (fieldConfig.errorCheck) {
                    const error = fieldConfig.errorCheck(item);
                    setItemField(item, fieldName, error);
                    continue;
                }
                // 获取目标子元素或单元格
                const targetElement = getCellElement(fragment, fieldConfig);
                if (targetElement) {
                    if (fieldConfig.processCellContent) {
                        setItemField(item, fieldName, fieldConfig.processCellContent(targetElement));
                        continue;
                    }
                    else {
                        const cellValue = extractFieldValue(targetElement, fieldConfig);
                        if (cellValue) {
                            setItemField(item, fieldName, cellValue);
                            continue;
                        }
                    }
                }
            }
            fragment.textContent = '';
            items.push(item);
            流水号++;
        }
        return items;
    }
    function getCellElement(fragment, fieldConfig) {
        const { cellPosition, selector } = fieldConfig;
        const [rowIndex, colIndex] = cellPosition;
        // 若有selector，返回子元素；否则返回单元格
        if (selector) {
            const targetElement = fragment.querySelector(selector);
            if (targetElement) {
                return targetElement;
            }
            else {
                console.warn(`Element not found for selector: ${selector}`);
                return null;
            }
        }
        else if (colIndex !== undefined) {
            return fragment.children[rowIndex].children[colIndex] || null;
        }
        else {
            console.warn(`Cannot locate cell for row ${rowIndex}, col ${colIndex}`);
            return null;
        }
    }
    function extractFieldValue(element, fieldConfig) {
        const { attribute, valueType } = fieldConfig;
        // 优先提取 attribute 的值
        if (attribute) {
            const attrValue = element.getAttribute(attribute);
            if (attrValue !== null) {
                // 若需要数值类型时再转换
                if (valueType === 'string') {
                    return `${attrValue}`;
                }
                const isNumber = !isNaN(parseFloat(attrValue));
                return isNumber ? parseFloat(attrValue) : attrValue;
            }
        }
        // 若无 attribute，返回文本内容
        return element.textContent?.trim() || '';
    }
    let productScript = document.createElement('script');
    productScript.src = "https://ruminel.github.io/product-remark/index.js";
    document.body.append(productScript);
    // 根据已选标签页来变更网页标题
    let menuTree = document.querySelector('ul[data-widget="tree"]');
    if (menuTree) {
        let oldSerf = 'http://admin.smart777v.com';
        let newSerf = 'https://admin.smartrogi.com';
        const versionMap = {
            [oldSerf]: { versionName: '' },
            [newSerf]: { versionName: '新_' }
        };
        let versionName = versionMap[window.origin].versionName || '';
        document.title = `${versionName}${document.title}`;
        menuTree.addEventListener('click', (event) => {
            let target = event.target;
            if (target?.parentElement?.className == 'active' && target.textContent) {
                document.title = `${versionName}${target.textContent}`;
            }
        });
    }
    // 用户名
    let userName = document.querySelector('.pull-left.info').children[0].textContent ?? '';
    // 分工
    let userDivision = getUserDivision(userName);
    let content_wrapper = document.querySelector('.content-wrapper');
    if (content_wrapper && userDivision) {
        const config = { childList: true, subtree: true };
        let observer = new MutationObserver(mutations => {
            for (let mutation of mutations) {
                for (let node of Array.from(mutation.addedNodes)) {
                    if (!(node instanceof HTMLElement)) {
                        continue;
                    }
                    setchajian(node);
                }
            }
        });
        observer.observe(content_wrapper, config);
    }
    function setchajian(node) {
        node.addEventListener('change', (event) => {
            const target = event.target;
            if (target.matches(`input[placeholder^="订单"],input[placeholder^="库存编号"]`)) {
                let regex;
                switch (target.getAttribute('placeholder')) {
                    case '订单编号':
                    case '订单号':
                        regex = /[0-9]{8}/;
                        break;
                    case '库存编号':
                        regex = /[0-9]{8}-*_*?[0-9]*/;
                        break;
                    default:
                        regex = null;
                }
                if (regex) {
                    const match = target.value.match(regex);
                    if (match) {
                    // 只保留匹配到的第一个部分，如 "12345678"
                    target.value = match[0];
                   }
                }
            }
        });
        let sentInventoryTable_wrapper = node.querySelector('#sentInventoryTable_wrapper');
        if (sentInventoryTable_wrapper) {
            // 采购单号 输入框
            let poInputTextDiv = document.createElement('label');
            poInputTextDiv.textContent = '采购单号';
            poInputTextDiv.className = 'col-sm-1 control-label';
            let poInputDiv = document.createElement('div');
            poInputDiv.className = 'col-sm-2';
            let poInput = document.createElement('input');
            poInput.type = 'text';
            poInput.className = 'form-control';
            poInput.id = 'purchaseNo';
            poInput.name = 'purchaseNo';
            poInput.placeholder = '采购单号';
            poInputDiv.append(poInput);
            node.querySelector('div[class="form-group"]')?.insertBefore(poInputTextDiv, document.querySelector('#advancedQuery'));
            node.querySelector('div[class="form-group"]')?.insertBefore(poInputDiv, document.querySelector('#advancedQuery'));
        }
        let inventoryConfirmTableTable_wrapper = node.querySelector('#inventoryConfirmTableTable_wrapper');
        if (inventoryConfirmTableTable_wrapper) {
            // 采购单号 输入框
            let poInputTextDiv = document.createElement('label');
            poInputTextDiv.textContent = '采购单号';
            poInputTextDiv.className = 'col-sm-1 control-label';
            let poInputDiv = document.createElement('div');
            poInputDiv.className = 'col-sm-2';
            let poInput = document.createElement('input');
            poInput.type = 'text';
            poInput.className = 'form-control';
            poInput.id = 'purchaseNo';
            poInput.name = 'purchaseNo';
            poInput.placeholder = '采购单号';
            poInputDiv.append(poInput);
            node.querySelector('div[class="form-group"]')?.insertBefore(poInputTextDiv, document.querySelector('#advancedQuery'));
            node.querySelector('div[class="form-group"]')?.insertBefore(poInputDiv, document.querySelector('#advancedQuery'));
        }
    }
    setInterval(() => {
        // 子页面
        let iframe_ziyemian = document.querySelector('iframe');
        if (iframe_ziyemian && !iframe_ziyemian.getAttribute('query')) {
            let table = iframe_ziyemian.contentWindow?.document.querySelectorAll('tbody')[1];
            // 仓库管理
            if (table?.id === 'fromBody') {
                let inventorytable = iframe_ziyemian.contentWindow?.
                    document.querySelector('table[id="inventoryTable"]');
                if (!inventorytable?.getAttribute('listened')) {
                    inventorytable?.setAttribute('listened', 'listen');
                    // 订单编号格
                    let r1c1 = table.children[0].querySelector('td');
                    if (r1c1 && r1c1?.style.cursor !== 'pointer') {
                        r1c1.style.cursor = 'pointer';
                    }
                    // 入库按钮
                    let inboundBtn = inventorytable.querySelector(`button[onclick="saveWarehouse('Y')"]`);
                    let saveWarehouse = iframe_ziyemian.contentWindow.saveWarehouse;
                    // 为入库函数添加检查
                    if (inboundBtn && saveWarehouse) {
                        let 商品数量 = inventorytable.querySelector('input[id="totalCount"]')?.value ?? '';
                        let 待入库数量 = inventorytable.querySelector('input[class="gteenText sendCount"]').value ?? '';
                        function decorate(func) {
                            return (x) => {
                                if (商品数量 == 待入库数量) {
                                    func(x);
                                }
                                if (商品数量 != 待入库数量) {
                                    if (prompt(`待入库数量和商品数量不符。
待入库数量：${待入库数量}     商品数量：${商品数量}

如要继续，请输入“继续入库”`) == '继续入库') {
                                        func(x);
                                    }
                                    else {
                                        alert('入库已取消');
                                    }
                                }
                            };
                        }
                        iframe_ziyemian.contentWindow.saveWarehouse = decorate(saveWarehouse);
                    }
                    inventorytable.addEventListener('click', (event) => {
                        // 修改1688的商品订单打开方式。
                        handleRedirectLinks(event, userDivision);
                        if (!userDivision.includes('采购')) {
                            return;
                        }
                        // 添加复制订单号功能
                        if (event.target == r1c1) {
                            let result = getInventoryData(inventorytable);
                            // 为新系统的订单号后添加“新”字
                            if (location.href.includes('https://admin.smartrogi.com/main#')) {
                                result.inventoryNumber = `${result.inventoryNumber}新`;
                            }
                            let article = `<table><tbody><tr style="text-align:center;"><td>${result.orderDate}</td><td>${result.purchaseDate}</td><td>${result.staffName}</td><td>${result.customerName}</td><td>="${result.inventoryNumber}"</td><td></td><td></td><td></td><td></td><td></td><td>${result.staffCode}<br/>${result.po}</td><td></td><td></td><td></td><td></td><td>${result.profitCal}</td><td>${result.purchasePriceTotal}</td><td>${result.handlePrice}</td><td>${result.checkPrice}</td><td>${result.otherPrice}</td><td>${result.profitError}</td></tr></tbody></table>`;
                            // 获取按钮的文字
                            let btnTextContent = inventorytable.querySelector('button')?.textContent ?? '';
                            let statu = function getStatus(res, btnTextContent) {
                                let status = {
                                    'btnTextContent': {
                                        name: 'btnTextContent', msg: '订单内容未保存，是否要复制？'
                                    },
                                    'po': {
                                        name: 'po', msg: '采购单号为空，请确认。'
                                    },
                                    'staffName': {
                                        name: 'staffName', msg: '未选择采购负责人，请确认。'
                                    },
                                    'purchaseUnitPrice': {
                                        name: 'purchaseUnitPrice', msg: '采购单价为0，请确认。'
                                    },
                                };
                                if (btnTextContent === '保存' && res.po && res.staffName !== '-请选择-') {
                                    return status.btnTextContent;
                                }
                                if (!res.po) {
                                    return status.po;
                                }
                                if (res.staffName == '-请选择-') {
                                    return status.staffName;
                                }
                                if (res.purchaseUnitPrice === 0) {
                                    return status.purchaseUnitPrice;
                                }
                                return;
                            }(result, btnTextContent);
                            // 正常情况
                            if (!statu) {
                                copyToText(article);
                                // 导出后存入记录
                                setlocalStorage('exportRecords', result.inventoryNumber, { 'e': 'T' });
                                alert(`已复制\u3000\u3000${result.staffName}\t${result.customerName}\t${result.inventoryNumber}`);
                                return;
                            }
                            // 采购单价为0时
                            if (statu.name == 'purchaseUnitPrice') {
                                copyToText(article);
                                setlocalStorage('exportRecords', result.inventoryNumber, { 'e': 'T' });
                                alert(`已复制\u3000\u3000${result.staffName}\t${result.customerName}\t${result.inventoryNumber}

${statu.msg}`);
                                return;
                            }
                            // 订单未保存时
                            if (statu.name == 'btnTextConten' && confirm(`${statu.msg}`)) {
                                copyToText(article);
                                setlocalStorage('exportRecords', result.inventoryNumber, { 'e': 'T' });
                                return;
                            }
                            // 未选择采购负责人或未填采购单号
                            if (statu.name == 'po' || statu.name == 'staffName') {
                                alert(statu.msg);
                                return;
                            }
                        }
                        // 点击保存按钮时触发
                        let r4c2 = table.children[3].children[1].children[0];
                        let staffCode = r4c2.options[r4c2.selectedIndex].textContent;
                        let saveBtn = inventorytable.querySelector('button[onclick="update_g()"]');
                        if (saveBtn?.textContent == '保存' && staffCode == userName) {
                            let result = getInventoryData(inventorytable);
                            if (result.po && result.inventoryNumber.length === 8) {
                                setlocalStorage('cache', result.inventoryNumber, {
                                    'purchaseDate': result.purchaseDate,
                                    'name': result.staffName,
                                    'po': result.po,
                                    'profitCal': result.profitCal,
                                    'purchasePriceTotal': result.purchasePriceTotal,
                                });
                                let msgSpan = document.querySelector('#cacheNum');
                                if (msgSpan) {
                                    msgSpan.textContent = ` 当天数量 ${getCacheNum()}件`;
                                }
                            }
                        }
                    });
                }
            }
            // 常规采购订单
            if (table && table.id !== 'fromBody') {
                if (table.getAttribute('listened')) {
                    return;
                }
                table.setAttribute('listened', 'listen');
                let r3c1 = table.children[2].querySelector('td');
                if (r3c1 && r3c1.style.cursor !== 'pointer') {
                    r3c1.style.cursor = "pointer";
                }
                const selectElement = table.querySelector('select#internationLogisticsType');
                const clientAddressElement = table.querySelector('textarea[name="clientAddress"]');
                function checkClient(selectElement, clientAddressElement) {
                    if (!selectElement || !clientAddressElement) {
                        console.error('选择器或地址没加载成功');
                        return;
                    }
                    // 为 select 和客户地址输入框绑定事件，实时检查
                    selectElement.addEventListener('change', () => updateSelectBackground(selectElement, clientAddressElement));
                    clientAddressElement.addEventListener('input', () => updateSelectBackground(selectElement, clientAddressElement));
                    // 初始调用一次，确保页面加载时检查
                    setTimeout(updateSelectBackground, 0, selectElement, clientAddressElement);
                }
                let style = document.createElement('style');
                style.textContent = `
                    .remarkLogo {
                        z-index: 999;
                        color: blue;
                        position: relative;
                        bottom: 20px;
                        height: 0px;
                        font-weight: bolder;
                        font-size: 20px;
                        width: 200px;
                        border: 1px dashed;
                    }`;
                iframe_ziyemian.contentWindow?.document.head.append(style);
                function setRemarks() {
                    if (userDivision.includes('检品')) {
                        return;
                    }
                    let trList = Array.from(table.children).slice(10);
                    for (let i = 0; i < trList.length; i = i + 11) {
                        // offer Id
                        let offerId = '';
                        let goodLink = trList[i + 2].children[0].textContent ?? '';
                        if (goodLink.includes('taobao') || goodLink.includes('tmall')) {
                            for (let i of goodLink.split('?')[1].split('&')) {
                                if (i.slice(0, 3) === 'id=') {
                                    offerId = i.slice(3);
                                    break;
                                }
                            }
                        }
                        if (goodLink.includes('1688')) {
                            offerId = goodLink.split('/')[4].split('.')[0];
                        }
                        if (productRemarks.has(offerId)) {
                            let markDiv = document.createElement('div');
                            markDiv.className = 'remarkLogo';
                            markDiv.textContent = productRemarks.get(offerId).remarks;
                            trList[i + 2].children[5].append(markDiv);
                        }
                    }
                }
                // let r1c3 = table.children[1].children[3];
                // let r1c3Btn = document.createElement('span');
                // if (r1c3 && !r1c3.querySelector('span')) {
                //     r1c3Btn.style.marginLeft = '3px';
                //     r1c3Btn.style.border = '1px solid';
                //     r1c3Btn.style.padding = '2px';
                //     r1c3Btn.style.cursor = 'pointer';
                //     r1c3Btn.textContent = '导入采购信息';
                //     r1c3.append(r1c3Btn);
                // }
                // 创建下拉菜单 复制至剪贴板 导出到CSV
                const selectOption = {
                    'select': {
                        backgroundColor: '#ffebc3',
                        width: '100px',
                        marginLeft: '3px',
                        border: '1px solid'
                    },
                    'selectBtn': {
                        height: '21.75px',
                        marginLeft: '3px',
                        border: '1px solid',
                        padding: '2px',
                        cursor: 'pointer',
                    }
                };
                let r10c1 = table.children[9].children[0];
                let r10c1Select = createElement('select', {}, '', selectOption.select);
                let r10c1SelectBtn = createElement('span', {}, '确定', selectOption.selectBtn);
                if (r10c1 && !r10c1.querySelector('select')) {
                    r10c1Select.append(new Option('复制商品订单', 'copyData'), new Option('导出商品订单', 'exportToCSV'));
                    r10c1.append(r10c1Select, r10c1SelectBtn);
                }
                let r2c1 = table.children[1].children[0];
                let r2c1Selection = createElement('select', {}, '', selectOption.select);
                let r2c1SelectBtn = createElement('span', {}, '确定', selectOption.selectBtn);
                if (r2c1 && !r2c1.querySelector('select')) {
                    r2c1Selection.append(new Option('复制商品JSON', 'copyData'), new Option('导出商品信息', 'exportToCSV'));
                    r2c1.append(r2c1Selection, r2c1SelectBtn);
                }
                let 添加附加费用按钮 = iframe_ziyemian.contentWindow?.document.querySelector('div[onclick="sentOrderView(this)"]');
                let firstproductSkuBox = table.querySelector('div[class="productSkuBox"]');
                monitorElementLoad(firstproductSkuBox, () => {
                    table.addEventListener('click', (event) => initializeOrderClick(event, table));
                    setRemarks();
                    checkClient(selectElement, clientAddressElement);
highlightTextareasByLinks(table);
                });
                function monitorElementLoad(targetElement, callback) {
                    if (!targetElement) {
                        console.warn(`Element with selector '${targetElement}' not found.`);
                        return;
                    }
                    const hasTextContent = (targetElement.textContent?.trim() ?? '').length > 0;
                    if (hasTextContent) {
                        console.info(`${targetElement}'已加载. 执行回调函数.`);
                        callback();
                        return;
                    }
                    const observer = new MutationObserver(() => {
                        const hasTextContent = (targetElement.textContent?.trim() ?? '').length > 0;
                        if (hasTextContent) {
                            observer.disconnect(); // 停止观察
                            console.info(`观察到'${targetElement}'已加载. 执行回调函数.`);
                            callback();
                        }
                    });
                    console.info('开始观察');
                    // 初始化观察器
                    observer.observe(targetElement, {
                        childList: true, // 观察子节点变化
                        subtree: true, // 观察后代节点
                    });
                }
                function initializeOrderClick(event, table) {
                    // 修改商品链接打开方式，改为打开对应的搜索页面
                    handleRedirectLinks(event, userDivision);
                    // 订单号
                    let orderNo = table.children[2].children[1].textContent ?? '';
                    if (event.target == r3c1) {
                        let result = getItemData();
                        if (result) {
                            if (location.href.includes('https://admin.smartrogi.com/main#')) {
                                result.orderNo += '新';
                            }
                            let article = `
<table>
  <tbody>
    <tr style="background-color:${result.backgroundColor}; font-size:13px;">
      <td style="font-weight:${result.staffCode_bold}; vertical-align: middle;">${result.staffCode}</td>
      <td style="vertical-align: middle;">${result.customerName}</td>
      <td style="color:${result.orderNo_Color}; vertical-align: middle;">${result.orderNo}</td>
    </tr>
  </tbody>
</table>`;
                            copyToText(article);
                            alert(`已复制\u3000\u3000${result.staffCode}\t${result.customerName}\t${result.orderNo}`);
                        }
                        else {
                            alert('采购员为空，请确认');
                        }
                    }
                    // 复制或导出商品订单
                    if (event.target == r10c1SelectBtn) {
                        exportPOList(r10c1Select.value);
                        function exportPOList(selectValue) {
                            let trList = Array.from(table.children).slice(10);
                            let r6c2 = table?.children[5].children[1].children[0];
                            let staffCode = getStaffCode(r6c2.options[r6c2.selectedIndex].textContent ?? '');
                            let itemList = [];
                            let poIsNone = [];
                            // 抓取商品列表
                            // 要修改匹配思路。把保管发货和本次采购的分开处理后，再拼合到一起
                            // 导出的订单的排序要和系统里的商品排序一致
                            for (let i = 0, j = 1; i < trList.length; i = i + 11, j++) {
                                let itemLink = trList[i + 2].children[0].children[0].innerHTML;
                                let isTaobao;
                                if (itemLink.includes("taobao") || itemLink.includes("tmall")) {
                                    isTaobao = true;
                                }
                                else {
                                    isTaobao = false;
                                }
                                let itemNumber = trList[i].children[1].children[0].textContent.replace(/\s/g, '');
                                let itemNo = trList[i].children[1].children[0].textContent.replace(/\s/g, '').split('-')[1];
                                if (itemNumber.includes('(')) {
                                    itemNo = itemNumber;
                                }
                                let po = `${trList[i + 7].children[3].children[0].getAttribute("value")}`;
                                if (!po) {
                                    poIsNone.push(itemNumber);
                                    continue;
                                }
                                itemList.push({
                                    'itemNumber': itemNumber,
                                    'itemNo': itemNo,
                                    'po': po,
                                    'isTaobao': isTaobao,
                                    'staffCode': staffCode
                                });
                            }
                            itemList.sort((x, y) => (x.itemNo - y.itemNo));
                            // 合并相同订单号的商品
                            let result = quchong(itemList);
                            if (selectValue == 'copyData') {
                                let articelArr = ['<table><tbody style="text-align:center;">'];
                                for (let i of Object.values(result)) {
                                    let fieldName = i.isTaobao ? `${i.staffCode}(淘宝)` : `${i.staffCode}`;
                                    articelArr.push(`<tr><td>${i.itemNo}</td><td>${fieldName}<br/>${i.po}</td></tr>`);
                                }
                                articelArr.push('</tbody></table>');
                                let article = articelArr.join('');
                                copyToText(article);
                                alert('已复制商品订单至剪贴板');
                            }
                            if (selectValue == 'exportToCSV') {
                                let csvName = `${table.children[2].children[1].innerText} 商品列表`;
                                let resultList = [["商品编号", "排号", "订单号"]];
                                result.forEach(element => {
                                    if (element.isTaobao) {
                                        element.po = `="${element.staffCode}(淘宝)"&char(10)&"${element.po}"`;
                                    }
                                    else {
                                        element.po = `="${element.staffCode}"&char(10)&"${element.po}"`;
                                    }
                                    resultList.push([element.itemNumber, element.itemNo, element.po]);
                                });
                                export_csv(resultList, csvName);
                            }
                            if (poIsNone.length > 0) {
                                alert(`下列商品未填写订单号
${poIsNone}`);
                            }
                            function quchong(list) {
                                let cacheList = [];
                                let itemList = list;
                                // 在cacheList中查找是否有该订单号，若有则修改该订单号对应的排号，若没则存入cacheList中
                                itemList.forEach(element => {
                                    let cacheListkeys = [];
                                    cacheList.forEach(e => cacheListkeys.push(e.po));
                                    if (!cacheListkeys.includes(element.po)
                                        || element.itemNo.includes('(')) {
                                        cacheList.push(element);
                                        return;
                                    }
                                    let samePoIndex = cacheList.findIndex(item => item.po == element.po);
                                    let samePoNo = cacheList[samePoIndex].itemNo;
                                    let temp = samePoNo;
                                    switch (true) {
                                        case samePoNo.includes("~") && samePoNo.includes("、"):
                                            temp = `${samePoNo.replaceAll("、", "~").split("~").slice(-1)}`;
                                            break;
                                        case !samePoNo.includes("~") && !samePoNo.includes("、"):
                                            break;
                                        case !samePoNo.includes("~") && samePoNo.includes("、"):
                                            temp = `${samePoNo.split("、").slice(-1)}`;
                                            break;
                                        case samePoNo.includes("~") && !samePoNo.includes("、"):
                                            temp = `${samePoNo.split("~").slice(-1)}`;
                                            break;
                                    }
                                    if (Math.abs(Number(element.itemNo) - Number(temp)) > 1) {
                                        cacheList[samePoIndex].itemNo = `${samePoNo}、${element.itemNo}`;
                                    }
                                    if (Math.abs(Number(element.itemNo) - Number(temp)) == 1) {
                                        cacheList[samePoIndex].itemNo = `${samePoNo.replace(`~${temp}`, "")}~${element.itemNo}`;
                                    }
                                });
                                return cacheList;
                            }
                        }
                    }
                    // 导入商品信息
                    // if (event.target == r1c3Btn) {
                    //     let input = document.createElement('input');
                    //     input.type = 'file';
                    // }
                    // 导出商品信息
                    if (event.target == r2c1SelectBtn) {
                        let itemList = extractOrderItems(Array.from(table.rows).slice(10), 商品字段);
                        if (r2c1Selection.value === 'exportToCSV') {
                            let csvHead = ['流水号', '编号', '商品属性', '实发数量', '商品图片链接', '商品单价', '采购价格', '采购单号'];
                            itemList.sort((a, b) => (a.流水号) - (b.流水号));
                            const csvArray = itemList.map(item => csvHead.map(fieldName => {
                                if (fieldName === '采购单号') {
                                    return `="${item[fieldName]}"`;
                                }
                                return `${item[fieldName]}`;
                            }));
                            let csvName = `${orderNo} 商品信息`;
                            export_csv([csvHead, ...csvArray], csvName);
                        }
                        if (r2c1Selection.value === 'copyData') {
                            const fields = ["编号", "商品属性", "offerId", "总采购数量"]; // 要筛选的字段数组
                            let copyArr = Array.from(itemList.values()).flatMap(v => {
                                if (v["编号"].includes('\n')) {
                                    return [];
                                }
                                const item = {}; // 创建一个空对象来存放筛选出的字段
                                for (const field of fields) { // 遍历每个需要的字段
                                    setItemField(item, field, v[field]); // 将该字段的值赋给 item
                                }
                                return item; // 返回包含筛选字段的新对象
                            });
                            const orderWithMeta = {
                                "订单号": orderNo,
                                "订单详情": copyArr
                            };
                            copyToText(JSON.stringify(orderWithMeta), 'text/plain');
                            alert(`已复制${orderNo}的商品信息到剪贴板`);
                        }
                    }
                    if (event.target === 添加附加费用按钮) {
                        let iframe = iframe_ziyemian.contentWindow?.document.querySelector('iframe');
                        if (iframe) {
                            // 定义颜色配置对象的类型
                            const colorConfig = {
                                'OPO': '#FFDAB9',
                                'OPI': '#AFEEEE',
                                '': 'white',
                            };
                            // 定义 handler 函数，确保它可以访问 `iframe` 的 contentWindow
                            const handler = () => {
                                // 确保 contentWindow 已经加载并且可以访问
                                const changePriceClass = (func) => {
                                    return (x) => {
                                        // 获取 textarea 和 subjoinPrice 元素并设置背景色
                                        const textarea = iframe.contentWindow?.document.querySelector('textarea');
                                        const subjoinPrice = iframe.contentWindow?.document.querySelector('input[id="subjoinPrice"]');
                                        if (textarea) {
                                            textarea.style.backgroundColor = colorConfig[x.value] || 'white';
                                        }
                                        if (subjoinPrice) {
                                            subjoinPrice.style.backgroundColor = colorConfig[x.value] || 'white';
                                        }
                                        // 执行原始的回调函数
                                        func(x);
                                    };
                                };
                                // 给 contentWindow 添加新的 changePriceClass 函数
                                if (iframe.contentWindow) {
                                    iframe.contentWindow.changePriceClass = changePriceClass(iframe.contentWindow.changePriceClass);
                                }
                            };
                            // 添加 iframe 加载完成后的事件监听器
                            iframe.addEventListener('load', handler);
                        }
                    }
                }
            }
        }
        // 在待采购库存
        let waitBuyInventoryTable_wrapper = document.querySelector('#waitBuyInventoryTable_wrapper');
        let waitBuyInventoryTable = document.querySelector('#waitBuyInventoryTable');
        if (waitBuyInventoryTable && document.querySelector('#goodcountnum') && userDivision.includes('采购')) {
            document.querySelector('#goodcountnum').textContent = getListNum();
        }
        if (waitBuyInventoryTable && userDivision.includes('采购')) {
            function setTableSytle() {
                let exportRecords = JSON.parse(localStorage.getItem('exportRecords') ?? '{}');
                if (waitBuyInventoryTable.children[1]?.children.length > 1) {
                    for (const i of Array.from(waitBuyInventoryTable.children[1].children)) {
                        if (!i.children[1]) {
                            return;
                        }
                        let inventoryButton = i.children[1].querySelector('button');
                        let inventoryNumber = inventoryButton?.textContent ?? '';
                        // 为已导出的订单染色
                        if (inventoryButton?.style.color !== '#fe7f2d' &&
                            exportRecords[inventoryNumber]?.e == 'T') {
                            inventoryButton.style.color = '#fe7f2d';
                        }
                        // 为已填采购运费的单元格染色。
                        let firstTD = i.children[0];
                        if (firstTD.style.color != 'blue' &&
                            exportRecords[inventoryNumber]?.isFirstPO == 'T') {
                            firstTD.style.color = 'blue';
                        }
                        // 在首列单元格内添加复选框。
                        if (!firstTD.getAttribute('has-checkbox')) {
                            let checkbox = document.createElement('input');
                            firstTD.setAttribute('has-checkbox', 'T');
                            checkbox.type = 'checkbox';
                            checkbox.setAttribute('data-id', inventoryButton.getAttribute('data-id') ?? '');
                            firstTD.insertBefore(checkbox, firstTD.childNodes[0]);
                        }
                    }
                }
            }
            setTableSytle();
        }
        function getListNum() {
            let listNum = 0;
            let firstTr = waitBuyInventoryTable.children[1].children[0];
            if (waitBuyInventoryTable.children[1].children.length == 0 || firstTr.textContent == '表中数据为空')
                return '0';
            for (let i of Array.from(waitBuyInventoryTable.children[1].children)) {
                let inventoryNumber = i.children[1].querySelector('button')?.textContent ?? '';
                if (inventoryNumber.length == 8) {
                    listNum = listNum + Number(i.children[7].textContent);
                }
            }
            return `${listNum}`;
        }
        if (waitBuyInventoryTable_wrapper && !waitBuyInventoryTable_wrapper.getAttribute('listened') && userDivision.includes('采购')) {
            waitBuyInventoryTable_wrapper.setAttribute('listened', 'listen');
            // 采购单号 输入框
            let poInputTextDiv = createElement('label', { className: 'col-sm-1 control-label' }, '采购单号');
            let poInputDiv = createElement('div', { className: 'col-sm-2' });
            let poInput = createElement('input', {
                type: 'text', className: 'form-control', id: 'purchaseNo', name: 'purchaseNo', placeholder: '采购单号'
            });
            poInputDiv.append(poInput);
            document.querySelector('div[class="form-group"]')?.insertBefore(poInputTextDiv, document.querySelector('#advancedQuery'));
            document.querySelector('div[class="form-group"]')?.insertBefore(poInputDiv, document.querySelector('#advancedQuery'));
            // 加总复选框
            let firstThTd = document.querySelector('.sorting_disabled');
            let topCheckBox = createElement('input', { id: 'top-check', type: 'checkbox' }); // HTMLInputElement 推断
            firstThTd?.insertBefore(topCheckBox, firstThTd.children[0]);
            // 显示当前页EC订单的商品数量
            let goodCount = createElement('span', {}, '    当前页EC采购的商品总数'); // HTMLSpanElement 推断
            let goodCountNum = createElement('span', { id: 'goodcountnum' }, '', { fontWeight: 'bold' }); // HTMLSpanElement 推断
            // 读取订单按钮
            let exportSelectedBtn = createElement('button', { id: 'exportbtn', type: 'button' }, '读取所选项', { width: '86px' }); // HTMLButtonElement 推断
            // 复制按钮（不可见）
            let copyBtn = createElement('button', { id: 'copybtn', type: 'button' }, '复制', { visibility: 'hidden' }); // HTMLButtonElement 推断
            // 导入按钮
            let fillInBtn = createElement('button', { id: 'fillinbtn', type: 'button' }, '导入采购数据'); // HTMLButtonElement 推断
            document.querySelector('#waitBuyInventoryTable_length')
                .append(goodCount, goodCountNum, exportSelectedBtn, copyBtn, fillInBtn);
            // 显示当天已采购的数量
            let firstRow = waitBuyInventoryTable_wrapper.children[0];
            let summaryBtn = createElement('button', { type: 'button' }, '汇总EC采购数量');
            let msgSpan = createElement('button', { id: 'cacheNum' }, ` 当天数量 ${getCacheNum()}件`);
            firstRow.append(msgSpan, summaryBtn);
            waitBuyInventoryTable_wrapper.addEventListener('click', event => {
                if (event.target.nodeName == 'TD'
                    && event.target.getAttribute('has-checkbox')) {
                    (event.target.querySelector('input[type="checkbox"]')).click();
                }
                if (event.target == topCheckBox) {
                    for (const i of Array.from(waitBuyInventoryTable.children[1].children)) {
                        i.querySelector('input[type="checkbox"]').checked = topCheckBox.checked;
                    }
                }
                if (event.target == copyBtn) {
                    let article = sessionStorage.getItem('article') ?? '';
                    copyToText(article);
                    exportSelectedBtn.removeAttribute('disabled');
                    exportSelectedBtn.style.cursor = 'pointer';
                    exportSelectedBtn.textContent = '读取所选项';
                    copyBtn.style.visibility = 'hidden';
                }
                function getSelectedSrcList(waitBuyInventoryTable) {
                    const srcHead = 'http://admin.smart777v.com/warehouse/warenhouseTemplate?id=';
                    let tbody = waitBuyInventoryTable.children[1];
                    let list = [];
                    let index = 1;
                    for (const i of Array.from(tbody.children)) {
                        let checkBox = i.querySelector('input[type="checkbox"]');
                        let staffName = i.querySelector('td')?.textContent ?? '';
                        let id = checkBox.getAttribute('data-id');
                        let inventoryNumber = i.children[1].querySelector('button')?.textContent ?? '';
                        if (checkBox.checked && inventoryNumber.length == 8 && userName == staffName) {
                            let temp = {
                                'inventoryNumber': inventoryNumber,
                                'url': `${srcHead}${id}`,
                                'staffName': staffName,
                                'index': index,
                            };
                            list.push(temp);
                        }
                        index = index + 1;
                    }
                    return list;
                }
                function loadIframe(src) {
                    return new Promise((resolve, reject) => {
                        let iframe = document.createElement('iframe');
                        iframe.setAttribute('query', 'query');
                        iframe.style.display = 'none';
                        iframe.src = src;
                        iframe.onload = () => { resolve(iframe); };
                        iframe.onerror = () => reject(new Error(`iframe load error for ${src}`));
                        document.body.append(iframe);
                    });
                }
                function setPromise(listArr, TOmap) {
                    // 获取按钮
                    function getBtn(doc, text) {
                        let btnList = doc.querySelectorAll('button');
                        for (let i of Array.from(btnList)) {
                            if (i.textContent === text) {
                                return i;
                            }
                        }
                        return undefined;
                    }
                    // 填写内容
                    function fillInData(map, ifr, result, index) {
                        // if (result.orderTotalRpiceError) {
                        //     return result
                        // }
                        let table = ifr.contentWindow?.document.querySelector('#inventoryTable');
                        // 国内运费
                        let domesticLogisticsPriceINput = table.querySelector('#domesticLogisticsPrice');
                        domesticLogisticsPriceINput.value = map.freight;
                        // 采购单价
                        let platformPriceInput = table.querySelector('#platformPrice');
                        platformPriceInput.value = `${map.purchasePrice}`;
                        // 采购运费
                        let platformFreightInput = table.querySelector('#platformFreight');
                        platformFreightInput.value = map.platformFreight;
                        if (map.isFirstPO) {
                            setlocalStorage('exportRecords', result.inventoryNumber, { 'isFirstPO': 'T' });
                        }
                        // 商品小计
                        let priceSub = Number(table.querySelector('#priceSub').value);
                        // 总计
                        let orderTotalRpiceCal = `${computeNum(priceSub, '+', map.freight)
                            .next('+', result.handlePrice)
                            .next('+', result.checkPrice)
                            .next('+', result.otherPrice).result}`;
                        let orderTotalRpiceInput = table.querySelector('#orderTotalRpice');
                        orderTotalRpiceInput.value = orderTotalRpiceCal;
                        // 采购支出
                        let purchasePriceTotalInput = table.querySelector('#purchasePriceTotal');
                        purchasePriceTotalInput.value = `${computeNum(map.purchasePrice, '*', result.totalCount).next('+', map.platformFreight).result}`;
                        // 总支出
                        let expenditureTotalInput = table.querySelector('#expenditureTotal');
                        let expenditureTotal = `${computeNum(map.purchasePrice, '*', result.totalCount).next('+', map.platformFreight).result}`;
                        expenditureTotalInput.value = expenditureTotal;
                        // 采购盈余
                        let profitInput = table.querySelector('#profit');
                        profitInput.value = `${computeNum(priceSub, '+', map.freight).next('-', expenditureTotal).result}`;
                        // 采购单号
                        let purchaseNoInput = table.querySelector('#purchaseNo');
                        purchaseNoInput.value = map.poNo;
                        // 采购日期
                        table.querySelector('#purchaseDate').value = map.orderCreationDate;
                        let saveBtn = getBtn(ifr.contentWindow.document, '保存');
                        return new Promise(resolve => {
                            ifr.addEventListener('load', () => { resolve(ifr); }, { once: true });
                            saveBtn?.click();
                        }).then(() => {
                            let result = getInventoryData(table);
                            result.index = index;
                            result.orderTotalRpiceCal = orderTotalRpiceCal;
                            document.body.removeChild(ifr);
                            return result;
                        });
                    }
                    let requsts = listArr.map(async (list) => {
                        const ifr = await loadIframe(list.url);
                        let iframeWindow = ifr.contentWindow;
                        let table = iframeWindow.document.querySelector('#inventoryTable');
                        let result = getInventoryData(table);
                        if (!TOmap) {
                            result.index = list.index;
                            document.body.removeChild(ifr);
                            return result;
                        }
                        let itemKey = TOmap.has(`${result.offerId}__${result.itemProperties}__${result.totalCount}`)
                            ? `${result.offerId}__${result.itemProperties}__${result.totalCount}`
                            : `${result.imgId}__${result.itemProperties}__${result.totalCount}`;
                        if (TOmap.has(itemKey)) {
                            let lockBtn = getBtn(iframeWindow.document, '锁定');
                            let map = TOmap.get(itemKey);
                            if (lockBtn) {
                                return new Promise((resolve) => {
                                    ifr.addEventListener('load', () => { resolve(ifr); }, { once: true });
                                    lockBtn.click();
                                }).then(ifr_1 => {
                                    return fillInData(map, ifr_1, result, list.index);
                                });
                            }
                            let saveBtn = getBtn(iframeWindow.document, '保存');
                            if (saveBtn) {
                                return fillInData(map, ifr, result, list.index);
                            }
                            let btnText = iframeWindow?.document.querySelector('button')?.textContent;
                            if (!saveBtn && !lockBtn) {
                                document.body.removeChild(ifr);
                                result.index = list.index;
                                result.errorMsg = `${btnText}编辑中`;
                                return result;
                            }
                        }
                        document.body.removeChild(ifr);
                        result.index = list.index;
                        result.errorMsg = '没找到对应商品';
                        return result;
                    });
                    return requsts;
                }
                if (event.target == exportSelectedBtn) {
                    let articelArr = [['0', '<table><tbody style="text-align:center;">']];
                    let rejList = [];
                    let list = getSelectedSrcList(waitBuyInventoryTable);
                    if (list.length == 0) {
                        alert('没有EC订单被选中，请确认');
                        return;
                    }
                    // 设置按钮禁用
                    exportSelectedBtn.disabled = true;
                    exportSelectedBtn.style.cursor = 'not-allowed';
                    exportSelectedBtn.textContent = '读 取 中';
                    Promise.all(setPromise(list)).then((respones) => {
                        for (const result of respones) {
                            if (result.index && !result.errorMsg) {
                                let fieldName = result.isTaobao ? `${result.staffCode}(淘宝)` : result.staffCode;
                                articelArr.push([`${result.index}`, `<tr><td>${result.orderDate}</td><td>${result.purchaseDate}</td><td>${result.staffName}</td><td>${result.customerName}</td><td>="${result.inventoryNumber}"</td><td></td><td></td><td></td><td></td><td></td><td>${fieldName}<br/>${result.po}</td><td></td><td></td><td></td><td></td><td>${result.profitCal}</td><td>${result.purchasePriceTotal}</td><td>${result.handlePrice}</td><td>${result.checkPrice}</td><td>${result.otherPrice}</td><td>${result.profitError}<br/>${result.orderTotalRpiceError}</td></tr>`]);
                                setlocalStorage('exportRecords', `${result.inventoryNumber}`, { 'e': 'T' });
                            }
                            if (result.index && result.errorMsg) {
                                rejList.push([`${result.index}`, result.staffName, result.inventoryNumber, result.errorMsg]);
                            }
                        }
                        articelArr.sort((a, b) => Number(a[0]) - Number(b[0]));
                        let articleArr_1 = articelArr.map(x => x[1]);
                        articleArr_1.push('</tbody></table>');
                        let article = articleArr_1.join('');
                        sessionStorage.setItem('article', article);
                        copyBtn.style.visibility = 'visible';
                        let alertText = `已读取${articleArr_1.length - 2}项`;
                        if (rejList.length > 0) {
                            rejList.sort((a, b) => Number(a[0]) - Number(b[0]));
                            export_csv(rejList.map(x => [x[1], x[2], x[3]]), `${getNowFormatDate()}未成功导出清单`);
                            alertText = `已读取${articleArr_1.length - 2}项，${rejList.length}项异常`;
                        }
                        else {
                            alert(alertText);
                        }
                    });
                }
                if (event.target == fillInBtn) {
                    let articelArr = [['0', '<table><tbody style="text-align:center;">']];
                    let rejList = [];
                    let list = getSelectedSrcList(waitBuyInventoryTable);
                    if (list.length == 0) {
                        alert('没有EC订单被选中，请确认');
                        return;
                    }
                    let input = document.createElement('input');
                    input.type = 'file';
                    input.onchange = (e => analyzeProcurementData(e, fill));
                    input.click();
                    function fill(TO_map) {
                        Promise.all(setPromise(list, TO_map)).then((respones) => {
                            let cache = JSON.parse(localStorage.getItem('cache') ?? '{}');
                            for (const result of respones) {
                                if (result.index && !result.errorMsg && !result.orderTotalRpiceError) {
                                    articelArr.push([`${result.index}`, `<tr><td>${result.orderDate}</td><td>${result.purchaseDate}</td><td>${result.staffName}</td><td>${result.customerName}</td><td>="${result.inventoryNumber}"</td><td></td><td></td><td></td><td></td><td></td><td>${result.staffCode}<br/>${result.po}</td><td></td><td></td><td></td><td></td><td>${result.profitCal}</td><td>${result.purchasePriceTotal}</td><td>${result.handlePrice}</td><td>${result.checkPrice}</td><td>${result.otherPrice}</td><td>${result.profitError}<br/>${result.orderTotalRpiceError}</td></tr>`]);
                                    // 存入缓存
                                    let sources = {
                                        'purchaseDate': result.purchaseDate,
                                        'name': result.staffName,
                                        'po': result.po,
                                        'profitCal': result.profitCal,
                                        'purchasePriceTotal': result.purchasePriceTotal,
                                    };
                                    if (cache[result.inventoryNumber]) {
                                        Object.assign(cache[result.inventoryNumber], sources);
                                    }
                                    else {
                                        cache[result.inventoryNumber] = sources;
                                    }
                                }
                                if (result.index && result.errorMsg) {
                                    rejList.push([`${result.index}`, result.staffName, result.inventoryNumber, result.errorMsg]);
                                }
                                if (result.orderTotalRpiceError) {
                                    rejList.push([`${result.index}`, result.staffName, result.inventoryNumber, result.orderTotalRpiceError]);
                                }
                            }
                            localStorage.setItem('cache', JSON.stringify(cache));
                            // 更新待采购库存里的件数
                            let msgSpan = document.querySelector('#cacheNum');
                            if (msgSpan) {
                                msgSpan.textContent = ` 当天数量 ${getCacheNum()}件`;
                            }
                            articelArr.sort((a, b) => Number(a[0]) - Number(b[0]));
                            let articleArr_1 = articelArr.map(x => x[1]);
                            articleArr_1.push('</tbody></table>');
                            // let article = articleArr_1.join('');
                            // copyToText(article);
                            let alertText = `已导入${articleArr_1.length - 2}项`;
                            if (rejList.length > 0) {
                                rejList.sort((a, b) => Number(a[0]) - Number(b[0]));
                                export_csv(rejList.map(x => [x[1], x[2], x[3]]), `${getNowFormatDate()}未成功导入清单`);
                                alertText = `已导入${articleArr_1.length - 2}项，${rejList.length}项异常`;
                            }
                            else {
                                alert(alertText);
                            }
                        });
                    }
                }
                function getCacheSummary(cache, date, userName) {
                    let num = 0;
                    let profitSum = 0;
                    let purchasePriceTotalSum = 0;
                    for (const i of Object.entries(cache)) {
                        if (i[1].purchaseDate == date && i[0].length === 8 && i[1].name == userName) {
                            num = num + 1;
                            profitSum = computeNum(profitSum, '+', i[1].profitCal).result;
                            purchasePriceTotalSum = computeNum(purchasePriceTotalSum, '+', i[1].purchasePriceTotal).result;
                        }
                    }
                    return {
                        'num': num,
                        'profitSum': computeNum(Math.round(computeNum(profitSum, '*', 100).result), '/', 100).result,
                        'purchasePriceTotalSum': computeNum(Math.round(computeNum(purchasePriceTotalSum, '*', 100).result), '/', 100).result,
                    };
                }
                if (event.target == summaryBtn && localStorage.getItem('cache')) {
                    let cache = JSON.parse(localStorage.getItem('cache') ?? '{}');
                    let nowDate = getNowFormatDate();
                    let result = getCacheSummary(cache, nowDate, userName);
                    let article = `<table><tbody><tr style="text-align:center;font-size:16px"><td>${result.num}</td><td>${result.purchasePriceTotalSum}</td><td>${result.profitSum}</td></tr></tbody></table>`;
                    copyToText(article);
                    alert(`已复制 ${nowDate} 的EC采购汇总数据`);
                }
                if (!localStorage.getItem('cache') && event.target == summaryBtn) {
                    alert('当前没数据可导出');
                }
            });
        }
        let inventoryConfirmTableTable_wrapper = document.querySelector('div#inventoryConfirmTableTable_wrapper');
        if (inventoryConfirmTableTable_wrapper && !inventoryConfirmTableTable_wrapper.getAttribute('listened')) {
            inventoryConfirmTableTable_wrapper.setAttribute('listened', 'listen');
            let dataTables_scrollNode = document.querySelector('div.dataTables_scroll');
            if (!dataTables_scrollNode) {
                console.error('dataTables_scrollNode not found');
                return;
            }
            let rowMap = new Map();
            let stopObserving;
            let 库存确认表Map = {
                theadSelector: 'div.dataTables_scrollHead thead',
                tbodySelector: 'div.dataTables_scrollBody tbody',
                change: {
                    '库存编号': (td) => {
                        let button = td.querySelector('button');
                        if (button) {
                            td.textContent = button.textContent ?? '';
                        }
                    }
                },
                columns: ['库存编号', '商品规格', '商品简图', '客户库存', '库存剩余', '商品数量', '入库时间', '注册用户'],
                shouldSkip: {
                    '客户姓名': ['客户姓名', '叶', '测试', '张靖松', 'test叶'],
                },
                width: {
                    '库存编号': '120px',
                    '商品规格': '200px',
                },
                getRowKey: (row, type) => {
                    let button = row.cells[1].querySelector('button');
                    if (button) {
                        const inventoryCode = button.textContent?.trim() || '';
                        if (type === 'EC库存' && /^[0-9]{8}$/.test(inventoryCode)) {
                            return inventoryCode;
                        }
                        else if (type === '普通库存' && /^[0-9]{8}-[0-9]+$/.test(inventoryCode)) {
                            return inventoryCode;
                        }
                    }
                    return '';
                }
            };
            function collectRowsAsMap(rows, type) {
                rows.forEach(row => {
                    const inventoryCode = 库存确认表Map.getRowKey(row, type);
                    if (inventoryCode) {
                        rowMap.set(inventoryCode, row);
                    }
                });
                layer.msg('已记录当前页面数据', { time: 2000, offset: 't', icon: 1, shade: 0 });
            }
            let coutrolRow = inventoryConfirmTableTable_wrapper.querySelector('#inventoryConfirmTableTable_length');
            let select = createElement('select', {}, '');
            select.append(new Option('EC库存', 'EC库存'), new Option('普通库存', '普通库存'));
            let startBtn = createElement('button', {}, '▶ 开始采集', { width: '85.54px' });
            let clearBtn = createElement('button', { id: 'claerBtn' }, '清除当前页的行', { visibility: 'hidden' });
            let generateBtn = createElement('button', {}, '⏹ 结束并生成', { visibility: 'hidden' });
            coutrolRow.append(select, startBtn, clearBtn, generateBtn);
            startBtn.addEventListener('click', () => {
                // 设置按钮状态
                select.disabled = true;
                clearBtn.style.visibility = 'visible';
                generateBtn.style.visibility = 'visible';
                startBtn.textContent = '记录中';
                startBtn.disabled = true;
                // 获取选择值
                let selectValue = select.value;
                // 把当前页的行添加至Map
                const rows = Array.from(dataTables_scrollNode.querySelectorAll('tbody tr'));
                collectRowsAsMap(rows, selectValue);
                // 开始观察表格变化，并把新行添加至Map，返回停止观察函数
                stopObserving = observeTableUpdates(dataTables_scrollNode, 库存确认表Map, (newRows) => collectRowsAsMap(newRows, selectValue));
            });
            clearBtn.addEventListener('click', () => {
                let currentRows = Array.from(dataTables_scrollNode.querySelectorAll('tbody tr'));
                currentRows.forEach(row => {
                    const inventoryCode = 库存确认表Map.getRowKey(row);
                    rowMap.delete(inventoryCode);
                });
                clearBtn.disabled = true;
                console.log(rowMap);
            });
            generateBtn.addEventListener('click', () => {
                // 重置开始/结束按钮
                select.removeAttribute('disabled');
                startBtn.textContent = '▶ 开始采集';
                startBtn.removeAttribute('disabled');
                clearBtn.style.visibility = 'hidden';
                generateBtn.style.visibility = 'hidden';
                // 结束记录并生成报表
                stopObserving();
                let rows = Array.from(rowMap.values());
                let thead = dataTables_scrollNode.querySelector(`${库存确认表Map.theadSelector}`);
                if (!thead) {
                    return;
                }
                let tbody = processRows(rows, getColIndexMap(thead), 库存确认表Map);
                // 表头
                let newThead = document.createElement('thead');
                let newTheadRow = document.createElement('tr');
                库存确认表Map.columns.forEach(colName => {
                    let th = document.createElement('th');
                    th.textContent = colName;
                    let width = 库存确认表Map.width?.[colName];
                    if (width) {
                        th.style.width = width;
                    }
                    newTheadRow.append(th);
                });
                newThead.append(newTheadRow);
                generateHTML(`${select.value}_${getNowFormatDate()}`, newThead, tbody);
                rowMap.clear();
            });
        }
        // 已出库库存
        let sentInventoryTable_wrapper = document.querySelector('#sentInventoryTable_wrapper');
        if (sentInventoryTable_wrapper && !sentInventoryTable_wrapper.hasAttribute('listened')) {
            sentInventoryTable_wrapper.setAttribute('listened', 'listen');
            let customerNameInput = document.querySelector('input[placeholder="注册用户"]');
            if (customerNameInput) {
                customerNameInput.setAttribute('name', 'name');
            }
        }
    }, 1000);
    // Your code here...
    function copyToText(article, formats = 'text/html') {
        let copyHandler = copy(article, formats);
        document.addEventListener('copy', copyHandler);
        document.execCommand('copy');
        document.removeEventListener('copy', copyHandler);
    }
    function copy(article, formats) {
        return function (event) {
            if (!event.clipboardData) {
                alert('浏览器不支持，请确认');
                return;
            }
            event.clipboardData.setData(formats, article); //设置格式text/html
            event.preventDefault();
        };
    }
})();
function analyzeProcurementData(e, callback) {
    function changes() {
        let inputF = e.target;
        let TO_map;
        if (inputF.files.length > 0) {
            const fileName = inputF.files[0].name;
            const fileNameSplitArr = fileName.split('.');
            const fileSuffix = fileNameSplitArr[fileNameSplitArr.length - 1];
            if (fileSuffix === 'xlsx' || fileSuffix === 'xls') {
                fileToJson(inputF.files[0], (sheets) => {
                    console.log('获取到的表格数据', sheets);
                    TO_map = mapTransactionOrders(sheets);
                    console.log('映射后的订单map', TO_map);
                    callback(TO_map);
                });
            }
        }
    }
    changes();
    /**
     * 从表格对象中提取信息，整理成map。
     * @param {object} sheetObject XLSX工作表对象
     */
    function mapTransactionOrders(sheetObject) {
        function priceCorrection(diffence, quantity, freight) {
            // 总差额乘于100，除以数量取余
            let surplus = computeNum(computeNum(diffence, '*', 100).result % quantity, '/', 100).result;
            let perDifference = 0;
            if (surplus === 0) {
                perDifference = computeNum(diffence, '/', quantity).result;
            }
            else if (surplus !== 0) {
                perDifference = computeNum(diffence, '-', surplus).next('+', quantity / 100).next('/', quantity).result;
                freight = computeNum(freight, '-', surplus).next('+', quantity / 100).result;
            }
            // 返回的是[每个商品的单价差额, 调整后的运费]
            return [perDifference, freight];
        }
        let sheetArr = sheetObject[0].list;
        let TO_arr = [];
        // 把订单状态不为交易关闭的订单添加至订单列表。
        sheetArr.forEach((item) => {
            if (item[9] !== '交易关闭' || item[9] !== '已取消') {
                TO_arr.push(item);
            }
        });
        let TO_map = new Map();
        // 迭代订单列表
        TO_arr.forEach(item => {
            if (item[18] === '货品标题') {
                return;
            }
            // 由商品标题整理出商品属性
            if (item[18].match(/\s[^\x00-\xff]*\S*:\s*/)) {
                // 正则表达式匹配的是 " 颜色: ", " 长度(CM): "
                let productProperties = item[18].split(/\s[^\x00-\xff]*\S*:\s*/).slice(1);
                item[18] = productProperties.sort((a, b) => a.localeCompare(b)).join('|');
            }
            else {
                item[18] = '無い';
            }
            // 以订单号为主键创建map属性
            if (TO_map.has(item[0])) {
                // 订单号→offer ID__商品属性__商品数量
                TO_map.get(item[0]).set(`${item[24]}__${item[18]}__${item[20]}`, [item[19], item[20]]);
            }
            else {
                TO_map.set(item[0], new Map([
                    [
                        'orderInformation', {
                            'totalPriceOfGoods': item[5],
                            'freight': item[6],
                            'platformFreight': item[6],
                            'actualPayment': item[8],
                            // 差额 = 货品总价 + 运费 — 实付款
                            'difference': computeNum(item[5], '+', item[6]).next('-', item[8]).result,
                            'orderCreationDate': item[10].split(" ")[0],
                        }
                    ],
                    [`${item[24]}__${item[18]}__${item[20]}`, [item[19], item[20]]]
                ]));
            }
        });
        // 计算变动后的商品单价
        // 优惠部分优先从商品价格中扣除，再从运费中扣除
        TO_map.forEach((value, key) => {
            if (key !== '订单编号') {
                let orderItemQuantity = 0;
                value.forEach((item, goodName) => {
                    if (goodName !== 'orderInformation') {
                        orderItemQuantity = computeNum(orderItemQuantity, '+', item[1]).result;
                    }
                });
                let difference = value.get('orderInformation').difference;
                let unitDifference = 0;
                [unitDifference, value.get('orderInformation').platformFreight] = priceCorrection(difference, orderItemQuantity, value.get('orderInformation').platformFreight);
                value.forEach((item, goodName) => {
                    if (goodName !== 'orderInformation') {
                        item[0] = computeNum(item[0], '-', unitDifference).result;
                    }
                });
            }
        });
        // 以offer ID__商品属性__商品数量为键名，新建Map
        let item_map = new Map();
        TO_map.forEach((value, key) => {
            if (key === '订单编号') {
                return;
            }
            let isFirstPO = true;
            let po_offidList = [];
            let isFirstOfferid = true;
            value.forEach((item, goodName) => {
                if (goodName === 'orderInformation') {
                    return;
                }
                let currentOfferid = goodName.split('__')[0];
                if (!po_offidList.includes(currentOfferid)) {
                    po_offidList.push(currentOfferid);
                    isFirstOfferid = true;
                }
                item_map.set(goodName, {
                    'poNo': `${key}`,
                    'purchasePrice': item[0],
                    'quantity': item[1],
                    'orderCreationDate': value.get('orderInformation').orderCreationDate,
                    'freight': isFirstOfferid ? value.get('orderInformation').freight : '0',
                    'platformFreight': isFirstPO ? value.get('orderInformation').platformFreight : '0',
                    'isFirstPO': isFirstPO,
                });
                isFirstPO = false;
                isFirstOfferid = false;
            });
        });
        return item_map;
    }
}
function fileToJson(file, callback) {
    // 数据处理结果
    let result;
    // 是否用BinaryString（字节字符串格式） 否则使用base64（二进制格式）
    let isBinary = true;
    // 创建一个FileReader对象
    let reader = new FileReader();
    // reader在onload解析结束事件时触发
    reader.onload = function (e) {
        let data = e.target.result;
        if (!isBinary) {
            result = XLSX.read(data, {
                type: 'binary',
                cellDates: true, // 为了获取excel表格中的时间，返回格式为世界时间
            });
        }
        else {
            result = XLSX.read(btoa(fixdata(data)), {
                type: 'base64',
                cellDates: true,
            });
        }
        // 格式化数据
        formatResult(result, callback);
    };
    if (!isBinary) {
        reader.readAsBinaryString(file); // 使用 BinaryString 来解析文件数据
    }
    else {
        reader.readAsArrayBuffer(file); // 使用base64 来解析文件数据
    }
    // 文件流转 base64
    function fixdata(data) {
        var o = '', l = 0, w = 10240;
        for (; l < data.byteLength / w; ++l)
            o += String.fromCharCode.apply(null, [...new Uint8Array(data.slice(l * w, l * w + w))]);
        o += String.fromCharCode.apply(null, [...new Uint8Array(data.slice(l * w))]);
        return o;
    }
    function formatResult(data, callback) {
        // 获取总数据
        const sheets = data.Sheets;
        // 获取每个表格
        const sheetItem = Object.keys(sheets);
        // 返回sheetJSON数据源
        let sheetArr = [];
        // 获取
        sheetItem.forEach((item) => {
            const sheetJson = XLSX.utils.sheet_to_json(sheets[item], { header: 1 });
            console.log('sheetJson', sheetJson);
            // 格式化Item时间数据
            formatItemDate(sheetJson);
            // 格式化Item合并数据
            formatItemMerge(sheets[item], sheetJson);
            // 组合数据
            sheetArr.push({
                name: item,
                list: sheetJson
            });
        });
        // 返回数据
        callback(sheetArr);
    }
    // 格式化Item时间数据
    function formatItemDate(data) {
        data.forEach((row) => {
            row.forEach((item, index) => {
                // 若有数据为时间格式则格式化时间
                if (item instanceof Date) {
                    // 坑：这里因为XLSX插件源码中获取的时间少了近43秒，所以在获取凌晨的时间上会相差一天的情况,这里手动将时间加上
                    var date = new Date(Date.parse(item) + 43 * 1000);
                    row[index] = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                }
            });
        });
        console.log('data', data);
    }
    // 格式化Item合并数据
    function formatItemMerge(sheetItem, data) {
        // 保存每一项sheet中的合并单元格记录
        const merges = sheetItem['!merges'] || [];
        merges.forEach((el) => {
            const start = el.s;
            const end = el.e;
            // 处理行合并数据
            if (start.r === end.r) {
                const item = data[start.r][start.c];
                for (let index = start.c; index <= end.c; index++) {
                    data[start.r][index] = item;
                }
            }
            // 处理列合并数据
            if (start.c === end.c) {
                const item = data[start.r][start.c];
                for (let index = start.r; index <= end.r; index++) {
                    data[index][start.c] = item;
                }
            }
        });
    }
}
// 角色划分
function getUserDivision(userName) {
    const roleDivisionMap = {
        "张靖松": "综合管理 采购",
        "叶健华": "综合管理 采购",
        "付凝霜": "采购",
        "吴诗琴": "采购",
        "钟雪韵": "采购",
        "邓健萍": "采购",
        "赵丽瑜": "采购 报关",
        "陈凤仙": "检品",
        "陈海婷": "检品",
        "陈金玲": "检品",
        "蒋付冰": "检品",
        "凌儒琴": "检品",
        "林晶滢": "检品",
        "林郁源": "检品",
        "陆平": "检品",
        "吕欣怡": "综合管理 采购",
        "潘海灵": "检品",
        "孙利珍": "检品",
        "王同芬": "检品",
        "余庆华": "检品",
        "赵琴琴": "检品",
        "朱潮威": "检品",
        "黄小恩": "采购",
        "许文聪": "采购",
    };
    return roleDivisionMap[userName] ?? '';
}
function getCacheNum() {
    let num = 0;
    if (localStorage.getItem('cache')) {
        let startDate = document.querySelector('#startDate').value;
        let nowDate = getNowFormatDate();
        let cache = JSON.parse(localStorage.getItem('cache') ?? '{}');
        if (Object.entries(cache).length == 0) {
            return num;
        }
        for (const [key, value] of Object.entries(cache)) {
            if (value.purchaseDate === (startDate || nowDate) && key.length === 8) {
                num += 1;
            }
        }
    }
    return num;
}
function getNowFormatDate() {
    let nowDate = new Date();
    let year = nowDate.getFullYear();
    let month = String(nowDate.getMonth() + 1);
    let strDate = String(nowDate.getDate());
    if (Number(month) < 10) {
        month = `0${month}`;
    }
    if (Number(strDate) < 10) {
        strDate = `0${strDate}`;
    }
    return `${year}-${month}-${strDate}`;
}
function getItemData() {
    let table = document.querySelector("iframe").contentWindow.document.querySelectorAll("tbody")[1];
    let trList = Array.from(table.children).slice(10);
    // 采购员
    let staffCode, staffCode_bold;
    let r6c2 = table.children[5].children[1].children[0];
    let staffName = r6c2.options[r6c2.selectedIndex].textContent;
    switch (staffName) {
        case "钟雪韵":
            staffCode = "钟";
            staffCode_bold = 'normal';
            break;
        case "邓健萍":
            staffCode = "萍";
            staffCode_bold = 'bold';
            break;
        case "付凝霜":
            staffCode = "付";
            staffCode_bold = 'normal';
            break;
        case "叶健华":
            staffCode = "叶";
            staffCode_bold = 'bold';
            break;
        case "吴诗琴":
            staffCode = "琴";
            staffCode_bold = 'normal';
            break;
        case "张靖松":
            staffCode = "张";
            staffCode_bold = 'bold';
            break;
        case "许文聪":
            staffCode = "许文聪";
            staffCode_bold = 'bold';
            break;
        default:
            staffCode = staffName;
            staffCode_bold = 'normal';
            break;
    }
    // 客户名
    let customerName = table.children[4].children[1].textContent;
    // 订单号
    let orderNo = table.children[2].children[1].textContent ?? '';
    if (!orderNo.includes('S') && !orderNo.includes('O') && !orderNo.includes('EC')) {
        // 获取运输方式
        let select = table.children[0].children[2].children[0];
        orderNo = `${orderNo}_${select.options[select.selectedIndex].textContent[0]}`;
        // 判断是否有出库或入库的商品
        for (let index = 0; index < trList.length; index = index + 11) {
            let itemNumber = trList[index].children[1].children[0].textContent?.replace(/\s/g, '') ?? '';
            let receiptQuantity = trList[index + 5].children[1].children[0].getAttribute('value');
            if (itemNumber.includes('(') || Number(receiptQuantity) > 0) {
                orderNo = `${orderNo}库`;
                break;
            }
        }
    }
    // 订单号的文字颜色
    let orderNo_Color = orderNo.includes('F') ? 'red' : 'black';
    // 单元格背景颜色
    let backgroundColor = orderNo.includes('S') ? 'white' : 'rgb(252,229,205)';
    return staffCode == '(空)' ? null : {
        'staffCode': staffCode,
        'staffCode_bold': staffCode_bold,
        'customerName': customerName,
        'orderNo': orderNo,
        'orderNo_Color': orderNo_Color,
        'backgroundColor': backgroundColor,
    };
}
function getInventoryData(inventorytable) {
    let tbody = inventorytable.children[1];
    let result = {};
    // 下单日期
    result.orderDate = tbody.children[1].children[1].textContent.split(' ')[0];
    // 采购日期
    result.purchaseDate = tbody.children[7].children[5].children[0].value;
    // 采购负责人
    let r4c2 = tbody.children[3].children[1].children[0];
    result.staffName = r4c2.options[r4c2.selectedIndex].textContent ?? '';
    // 客户名
    result.customerName = tbody.children[2].children[1].textContent ?? '';
    // 库存编码
    result.inventoryNumber = tbody.children[0].children[1].textContent.match(/[0-9]+-*[0-9]*/)[0];
    // 采购负责人代号
    result.staffCode = getStaffCode(result.staffName);
    // offer Id
    let goodLink = tbody.querySelector('#ProductLink')?.textContent ?? '';
    if (goodLink.includes('taobao') || goodLink.includes('tmall')) {
        for (let i of goodLink.split('?')[1].split('&')) {
            if (i.slice(0, 3) === 'id=') {
                result.offerId = i.slice(3);
                break;
            }
        }
    }
    if (goodLink.includes('1688')) {
        result.offerId = goodLink.split('/')[4].split('.')[0];
    }
    // isTaobao
    result.isTaobao = (goodLink.includes("taobao") || goodLink.includes("tmall")) ? true : false;
    // imgid
    let img = tbody.querySelector('img');
    if (img?.src.match(/\b[a-zA-Z0-9]+_!![0-9]+\b/)) {
        result.imgId = img.src.match(/\b[a-zA-Z0-9]+_!![0-9]+\b/)[0] ?? 'id读取错误';
    }
    let itemTd = tbody.children[0].children[6];
    // EC采购的SKU，是写在同一个TD里，用<br>来分隔。
    result.itemProperties = function () {
        const skuLines = [];
        itemTd.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const trimmedText = node.textContent?.trim() ?? '';
                if (trimmedText) {
                    skuLines.push(trimmedText);
                }
            }
        });
        return skuLines
            .map(line => {
            const parts = line.split(/:|：/); // 分割 key 和 value
            return parts.length > 1 ? parts[parts.length - 1].trim() : ''; // 直接访问最后一个元素
        })
            .filter(value => value) // 过滤掉空值
            .sort((a, b) => a.localeCompare(b))
            .join('|');
    }();
    // 采购单号
    result.po = tbody.children[6].children[3].children[0].value ?? '';
    // 采购盈余（系统）
    result.profitSys = Number(tbody.querySelector('#profit').value);
    // 采购支出
    result.purchasePriceTotal = tbody.querySelector('#expenditureTotal').value ?? '0';
    // 手续费
    result.handlePrice = tbody.children[6].children[5].children[0].value;
    // 检品费
    result.checkPrice = tbody.children[7].children[7].children[0].value;
    // 其他费用
    result.otherPrice = tbody.children[8].children[5].children[0].value;
    // 采购单价
    result.purchaseUnitPrice = Number(tbody.children[7].children[3].children[0].value);
    // 采购运费
    let platformFreight = Number(tbody.children[8].children[1].children[0].value);
    // 商品数量
    result.totalCount = Number(tbody.querySelector('#totalCount').value);
    // 商品小计
    let priceSub = Number(tbody.querySelector('#priceSub').value);
    // 国内运费
    let domesticLogisticsPrice = Number(tbody.querySelector('#domesticLogisticsPrice').value);
    // 采购盈余（计算）
    result.profitCal = computeNum(priceSub, '+', domesticLogisticsPrice)
        .next('-', computeNum(result.totalCount, '*', result.purchaseUnitPrice).result)
        .next('-', platformFreight).result;
    // 总计
    result.orderTotalRpiceSys = tbody.querySelector('#orderTotalRpice').value;
    // 总计（计算）
    result.orderTotalRpiceCal = `${computeNum(priceSub, '+', domesticLogisticsPrice)
        .next('+', result.handlePrice)
        .next('+', result.checkPrice)
        .next('+', result.otherPrice).result}`;
    if (result.profitCal != result.profitSys) {
        result.profitError = `${result.profitCal}_${result.profitSys}`;
    }
    else {
        result.profitError = '';
    }
    if (Number(result.orderTotalRpiceSys) != Number(result.orderTotalRpiceCal)) {
        result.orderTotalRpiceError = `总计费用有误 ${result.orderTotalRpiceCal}|${result.orderTotalRpiceSys}`;
    }
    else {
        result.orderTotalRpiceError = '';
    }
    return result;
}
function getStaffCode(staffName) {
    let staffCode = '';
    switch (staffName) {
        case "钟雪韵":
            staffCode = "c";
            break;
        case "邓健萍":
            staffCode = "P";
            break;
        case "付凝霜":
            staffCode = "F";
            break;
        case "叶健华":
            staffCode = "W";
            break;
        case "吴诗琴":
            staffCode = "s";
            break;
        case "张靖松":
            staffCode = "";
            break;
        default:
            staffCode = staffName;
            break;
    }
    return staffCode;
}
function computeNum(a, type, b) {
    /**
     * 获取数字小数点的长度
     * @param {number} n 数字
     */
    function getDecimalLength(n) {
        const decimal = n.toString().split(".")[1];
        return decimal ? decimal.length : 0;
    }
    /**
     * 修正小数点
     * @description 防止出现 `33.33333*100000 = 3333332.9999999995` && `33.33*10 = 333.29999999999995` 这类情况做的处理
     * @param {number} n
     */
    a = Number(a);
    b = Number(b);
    const amend = (n, precision = 15) => parseFloat(Number(n).toPrecision(precision));
    const power = Math.pow(10, Math.max(getDecimalLength(a), getDecimalLength(b)));
    let result = 0;
    a = amend(a * power);
    b = amend(b * power);
    switch (type) {
        case "+":
            result = (a + b) / power;
            break;
        case "-":
            result = (a - b) / power;
            break;
        case "*":
            result = (a * b) / (power * power);
            break;
        case "/":
            result = a / b;
            break;
    }
    result = amend(result);
    return {
        /** 计算结果 */
        result,
        /**
         * 继续计算
         * @param {"+"|"-"|"*"|"/"} nextType 继续计算方式
         * @param {number} nextValue 继续计算的值
         */
        next(nextType, nextValue) {
            return computeNum(result, nextType, nextValue);
        }
    };
}
/**
 * 返回每个商品单价的调整额和调整后的运费
 * @param {number} totalDiff 差额
 * @param {number} quantity 商品数量
 * @param {number} freight 运费
 * @return {[number, number]}
 */
function priceCorrection(totalDiff, quantity, freight) {
    // 总差额乘于100，除以数量取余
    let surplus = computeNum(computeNum(totalDiff, '*', 100).result % quantity, '/', 100).result;
    let priceAdjustment = 0;
    if (surplus === 0) {
        priceAdjustment = computeNum(totalDiff, '/', quantity).result;
    }
    if (surplus !== 0) {
        priceAdjustment = computeNum(totalDiff, '-', surplus).next('+', quantity / 100).next('/', quantity).result;
        freight = computeNum(freight, '-', surplus).next('+', quantity / 100).result;
    }
    // 返回的是[每个商品的单价差额, 调整后的运费]
    return [priceAdjustment, freight];
}
function setlocalStorage(key, index, sources) {
    try {
        const storedData = JSON.parse(localStorage.getItem(key) ?? '{}');
        if (storedData[index]) {
            Object.assign(storedData[index], sources);
        }
        else {
            storedData[index] = sources;
        }
        localStorage.setItem(key, JSON.stringify(storedData));
    }
    catch (error) {
        console.error('Error while updating localStorage:', error);
        // Handle the error appropriately (e.g., show a user-friendly message).
    }
}
function handleRedirectLinks(event, link) {
  if (link.textContent?.trim() === "跳转" && link.href.includes("1688.com")) {
    event.preventDefault();
    const offerId = new URL(link.href).pathname.split("/")[2].split(".")[0];
    const searchLink = `https://aibuy.1688.com/landingpage/home/inventory/products.html?bizType=purchasingAgent&customerId=smartwuliu&keyword=`;
    window.open(searchLink + offerId, "_blank");
  }
}
function export_csv(list, name) {
    const newList = list.map(res => res.join(","));
    const data = newList.join(",\n");
    // “\ufeff” BOM头
    var uri = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(data);
    var downloadLink = document.createElement("a");
    downloadLink.href = uri;
    downloadLink.download = `${name ?? 'temp'}.csv`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
/**
 * 创建一个指定类型的 HTML 元素，并设置其属性、文本内容和样式。
 *
 * @template K - HTML 元素的标签名，限制为 HTMLElementTagNameMap 中的键。
 * @param {K} tag - 要创建的元素的标签名，如 'div', 'span' 等。
 * @param {Object<string, string>} [attributes={}] - 要设置的元素属性，键为属性名，值为属性值。
 * @param {string} [textContent] - 要设置的元素文本内容。
 * @param {Partial<CSSStyleDeclaration>} [styles] - 要设置的元素样式，可部分指定 CSS 样式。
 * @returns {HTMLElement} - 返回创建的 HTML 元素，类型为 HTMLElementTagNameMap 中对应的类型。
 */
function createElement(tag, attributes = {}, // 默认空对象
textContent, styles) {
    let element = document.createElement(tag);
    // 设置属性
    for (let key in attributes) {
        if (attributes[key] !== undefined) {
            if (key === 'className') {
                element.setAttribute('class', attributes[key]); // 直接设置 class 属性
            }
            else {
                element.setAttribute(key, attributes[key]);
            }
        }
    }
    // 设置文本内容
    if (textContent) {
        element.textContent = textContent;
    }
    // 设置样式
    if (styles) {
        for (let styleKey in styles) {
            element.style[styleKey] = styles[styleKey] ?? '';
        }
    }
    return element;
}
// 定义一个函数来检查
function checkIsNonRemote(selectElement, clientAddressElement) {
    let selectedText = selectElement.options[selectElement.selectedIndex].text;
    selectedText = selectedText.replace('冲绳', '沖縄');
    const clientAddress = clientAddressElement.value;
    // 判断不匹配的情况
    const isNonRemoteMismatch = selectedText === '非偏远' && (clientAddress.includes('北海道') || clientAddress.includes('沖縄'));
    const isHokkaidoMismatch = selectedText === '北海道' && !clientAddress.includes('北海道');
    const isOkinawaMismatch = selectedText === '沖縄' && !clientAddress.includes('沖縄');
    const matchedResult = (isNonRemoteMismatch || isHokkaidoMismatch || isOkinawaMismatch);
    console.info(`客户地址是${clientAddress}，与select${selectedText}的匹配是${!matchedResult}`);
    if (matchedResult) {
        // 不匹配
        return false;
    }
    else {
        // 匹配
        return true;
    }
}
// 更新select背景颜色的函数
function updateSelectBackground(selectElement, clientAddressElement) {
    if (!checkIsNonRemote(selectElement, clientAddressElement)) {
        selectElement.style.backgroundColor = 'darkorange';
        layer.msg(`客户地址和偏僻地址选择器不匹配，请确认。`, {
            time: 2000,
            offset: 't',
            icon: 3,
            shade: 0
        });
    }
    else {
        selectElement.style.backgroundColor = '';
    }
}
function exportInventoryData(node, map) {
    let { theadSelector, tbodySelector } = map;
    // 参数检查，确保 node、theadSelector、tbodySelector 存在，否则直接返回
    if (!node || !theadSelector || !tbodySelector) {
        console.warn(node, theadSelector, tbodySelector);
        return;
    }
    // 获取表头 (`thead`) 和表体 (`tbody`)，如果找不到则返回
    let thead = node.querySelector(theadSelector);
    let tbody = node.querySelector(tbodySelector);
    if (!thead || !tbody) {
        console.error(thead, tbody, '没找到表头或表体，已停止操作');
        return;
    }
    // **构建 colIndexMap **
    let originalThs = Array.from(thead.querySelectorAll('th'));
    let colIndexMap = new Map(originalThs.map((th, index) => [th.textContent?.trim() ?? '', index]));
    // 表头
    let newThead = document.createElement('thead');
    let newTheadRow = document.createElement('tr');
    map.columns.forEach(colName => {
        let th = document.createElement('th');
        th.textContent = colName;
        let width = map.width?.[colName];
        if (width) {
            th.style.width = width;
        }
        newTheadRow.append(th);
    });
    newThead.append(newTheadRow);
    // 表体
    let rows = Array.from(tbody.querySelectorAll('tr'));
    let newTbody = document.createElement('tbody');
    // 创建所需的列的列名和原表格列的索引
    let selectedIndexes = map.columns.map(col => colIndexMap.get(col) ?? null);
    rows.forEach(row => {
        // 过滤
        if (map.shouldSkip) {
            let shouldSkip = Object.entries(map.shouldSkip).some(([colName, condition]) => {
                let colIndex = colIndexMap.get(colName);
                if (colIndex !== undefined) {
                    let td = row.cells[colIndex];
                    let textContent = td.textContent?.trim() || '';
                    if (Array.isArray(condition)) {
                        return condition.includes(textContent);
                    }
                    else if (typeof condition === "function") {
                        return condition(textContent);
                    }
                }
                return false;
            });
            if (shouldSkip) {
                return;
            }
        }
        let newRow = document.createElement('tr');
        selectedIndexes.forEach((colIndex, newIndex) => {
            if (colIndex === null) {
                return;
            }
            let newTd = document.createElement('td');
            newTd.innerHTML = row.cells[colIndex].innerHTML;
            // 处理change
            let colName = map.columns[newIndex];
            if (map.change && map.change[colName]) {
                map.change[colName](newTd);
            }
            newRow.append(newTd);
        });
        newTbody.append(newRow);
    });
    const newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(`<!DOCTYPE html>
        <html lang="zh-cn">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>库存报表</title>
            <style>
              table { width: 1000px; border-collapse: collapse; }
              th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            </style>
          </head>
          <body>
            <table>
              ${newThead.outerHTML}
              ${newTbody.outerHTML}
            </table>
          </body>
        </html>
      `);
    }
}
function observeTableUpdates(node, map, callback, delayMs = 100) {
    let timeoutId = null;
    const observer = new MutationObserver((mutations) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = window.setTimeout(() => {
            const tbody = node.querySelector(map.tbodySelector);
            if (!tbody) {
                console.warn('表体未找到');
                return;
            }
            const rows = Array.from(tbody.querySelectorAll('tr'));
            callback(rows);
            if (node.querySelector('#clearBtn')) {
                let clearBtn = node.querySelector('#clearBtn');
                clearBtn.removeAttribute('disabled');
            }
        }, delayMs);
    });
    const tbody = node.querySelector(map.tbodySelector);
    if (tbody) {
        observer.observe(tbody, { childList: true, subtree: true });
    }
    else {
        console.warn('表体未找到');
    }
    return () => {
        if (observer) {
            observer.disconnect();
        }
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    };
}
function getColIndexMap(thead) {
    let originalThs = Array.from(thead.querySelectorAll('th'));
    return new Map(originalThs.map((th, index) => [th.textContent?.trim() ?? '', index]));
}
function processRows(rows, colIndexMap, map) {
    let selectedIndexes = map.columns.map(col => colIndexMap.get(col) ?? null);
    let tbody = document.createElement('tbody');
    let fragment = document.createDocumentFragment();
    rows.forEach(row => {
        let shouldSkip = Object.entries(map.shouldSkip ?? {}).some(([colName, condition]) => {
            let colIndex = colIndexMap.get(colName);
            if (colIndex !== undefined) {
                let td = row.cells[colIndex];
                let textContent = td.textContent?.trim() || '';
                if (Array.isArray(condition)) {
                    return condition.includes(textContent);
                }
                else if (typeof condition === "function") {
                    return condition(textContent);
                }
            }
            return false;
        });
        if (shouldSkip) {
            return;
        }
        let newRow = document.createElement('tr');
        selectedIndexes.forEach((colIndex, newIndex) => {
            if (colIndex === null) {
                return;
            }
            let newTd = document.createElement('td');
            newTd.innerHTML = row.cells[colIndex].innerHTML;
            if (map.change && map.change[map.columns[newIndex]]) {
                map.change[map.columns[newIndex]](newTd, row);
            }
            newRow.append(newTd);
        });
        fragment.append(newRow);
    });
    tbody.append(fragment);
    return tbody;
}
function generateHTML(title, thead, tbody) {
    const newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(`<!DOCTYPE html>
        <html lang="zh-cn">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <style>
              table { width: 1000px; border-collapse: collapse; }
              th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            </style>
          </head>
          <body>
            <table>
              ${thead.outerHTML}
              ${tbody.outerHTML}
            </table>
          </body>
        </html>
      `);
    }
}
/**
 * 为页面中所有 name="clientRemark" 的 textarea，根据其中包含的链接进行分组，并为每组设置不同背景色
 */
function highlightTextareasByLinks(node) {
  // 1. 获取所有 name="clientRemark" 的 textarea
  const textareas = node.querySelectorAll('textarea[name="clientRemark"]');

  // 2. 按 “textarea 内的所有链接集合” 分组
  const groupMap = new Map(); // key: 链接集合的唯一标识（如 JSON 字符串）, value: [textarea]

  textareas.forEach((ta) => {
    const content = ta.value;

    // 2.1 提取所有链接
    const rawLinks = content.match(/https?:\/\/\S+/g) || [];
    // 🔒 只有当存在至少一个链接时，才进行分组和着色
    if (rawLinks.length === 0) {
      return; // 跳过不含链接的 textarea
    }
    // 2.2 去重并排序，生成唯一键
    const linkSet = new Set(rawLinks); // 去重
    const sortedLinks = Array.from(linkSet).sort(); // 排序，保证顺序不影响键
    const key = JSON.stringify(sortedLinks); // 转为字符串作为唯一键

    // 2.3 将当前 textarea 加入对应的分组
    if (!groupMap.has(key)) {
      groupMap.set(key, []);
    }
    groupMap.get(key).push(ta);
  });

  // 3. 定义一组柔和背景色
  const colors = [
    '#E8F4FD', '#F0F8F0', '#FFF8F0', '#F9F0FF', '#F0FFF8',
    '#FFFBF0', '#F8F0FF', '#F0F0FF', '#FFF0F5', '#F0FFF0', '#FAFAFA'
  ];

  // 4. 为每个组分配颜色并设置背景
  let colorIndex = 0;
  for (const [key, textareasInGroup] of groupMap.entries()) {
    const color = colors[colorIndex % colors.length];
    textareasInGroup.forEach((ta) => {
      ta.style.backgroundColor = color;
    });
    colorIndex++;
  }
}
