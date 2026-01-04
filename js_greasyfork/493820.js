// ==UserScript==
// @name         导入采购信息
// @namespace    http://tampermonkey.net/
// @version      1.20
// @description  导出商品的排号和对应的订单号
// @author       You
// @match        http://47.115.125.92:8087/main*
// @match        https://admin.smartrogi.com/main*
// @match        http://admin.smart777v.com/main*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=125.92
// @grant        none
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.core.min.js
// @downloadURL https://update.greasyfork.org/scripts/493820/%E5%AF%BC%E5%85%A5%E9%87%87%E8%B4%AD%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/493820/%E5%AF%BC%E5%85%A5%E9%87%87%E8%B4%AD%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

// 使用说明
// https://doc.weixin.qq.com/doc/w3_ADEAZQaeADkiBLbjy0YTyqq1TDqWJ?scode=AAAAIgd7AAkyn4du8cADEAZQaeADk

(function () {
    "use strict";
    // 在第1行第4格添加导出按钮，并绑定点击事件
    setInterval(() => {
        try {
            let table = document.querySelector("iframe").contentWindow.document.querySelectorAll("tbody")[1];
            // 当检测到表格的ID是fromBody（即仓库管理）时，不执行脚本
            if (table.getAttribute("id") === 'fromBody') return;

            let r1c3 = table.children[1].children[3];
            if (!r1c3.innerText.includes("导入采购信息")) {
                let btn = document.createElement("span");
                btn.appendChild(document.createTextNode("导入采购信息"));
                r1c3.appendChild(btn);
                btn.style.marginLeft = "3px";
                btn.style.border = "1px solid"
                btn.style.padding = "2px";
                btn.style.cursor = "pointer";

                return btn.addEventListener("click", e => {
                    let input = document.createElement('input')
                    input.type = 'file';

                    input.onchange = event => { changes(event) };
                    input.click()
                })
            }
        }
        catch {
        }
    }, 1000)

    function changes(e) {
        if (e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            const fileNameSplitArr = fileName.split('.')
            const fileSuffix = fileNameSplitArr[fileNameSplitArr.length - 1];
            if (fileSuffix === 'xlsx' || fileSuffix === 'xls') {
                // 解析工作表
                fileToJson(e.target.files[0], (sheets) => {
                    console.log('获取到的表格数据', sheets);
                    let TO_map = mapTransactionOrders(sheets);
                    console.log('映射后的订单map', TO_map)
                    let goodList = getItemData();
                    comparisonData(goodList, TO_map)
                    console.log('比对后的map', goodList)
                    fillInData(goodList);
                })
            } else {
                alert('不支持该格式的解析');
            }
        } else {
            alert('请选择文件上传')
        }
    }
    function mapTransactionOrders(sheetObject) {
        let sheetArr = sheetObject[0].list;
        let TO_arr = [];
        sheetArr.forEach(item => {
            if (item[9] !== '交易关闭') {
                TO_arr.push(item);
            }
        })
        TO_arr.forEach(item => {
            if (item[18] === '货品标题') return;
            // 若货品标题里没有冒号，即没有商品属性的话，则输出"無い"
            if (item[18].includes(': ')) {
                // 正则表达式匹配的是 " 颜色: ", " 长度(CM): "
                let productProperties = item[18].split(/\s[^\x00-\xff]*\S*:\s*/).slice(1,)
                item[18] = productProperties.sort((a, b) => a.localeCompare(b)).join('|');
            } else {
                item[18] = '無い'
            }

        })
        let TO_map = new Map()
        TO_arr.forEach((item) => {
            // // 确认运输方式 空运或船运
            // let transportationType;
            // if (item[13] == '松田' || item[13] == 'EC松田' || item[13] == '样品松田') {
            //     transportationType = '空'
            // } else if (item[13].includes('叶松田')) {
            //     transportationType = '海'
            // };

            if (TO_map.has(item[0])) {
                TO_map.get(item[0]).set(`${item[24]}__${item[18]}__${item[20]}`, [item[19], item[20]])
            } else {
                TO_map.set(item[0], new Map([
                    [
                        'orderInformation', {
                            'totalPriceOfGoods': item[5],
                            'freight': item[6],
                            'actualPayment': item[8],
                            // 差额 = 货品总价 + 运费 — 实付款
                            'difference': computeNum(item[5], '+', item[6]).next('-', item[8]).result,
                            'orderCreationDate': item[10].split(" ")[0],
                        }
                    ],
                    [`${item[24]}__${item[18]}__${item[20]}`, [item[19], item[20]]]
                ]))
            }
        })
        // 计算变动后的商品单价
        // 优惠部分优先从商品价格中扣除，再从运费中扣除
        TO_map.forEach((value, key) => {
            if (key !== '订单编号') {
                let orderItemQuantity = 0;
                value.forEach((item, goodName) => {
                    if (goodName !== 'orderInformation') {
                        orderItemQuantity = computeNum(orderItemQuantity, '+', item[1]).result;
                    }
                })
                let difference = value.get('orderInformation').difference;
                let unitDifference = 0;
                [unitDifference, value.get('orderInformation').freight] = priceCorrection(difference, orderItemQuantity, value.get('orderInformation').freight)
                value.forEach((item, goodName) => {
                    if (goodName !== 'orderInformation') {
                        item[0] = computeNum(item[0], '-', unitDifference).result;
                    }
                })
            }
        })
        // 以
        let item_map = new Map();
        TO_map.forEach((value, key) => {
            if (key === '订单编号') return;
            value.forEach((item, goodName) => {
                if (goodName === 'orderInformation') return;
                item_map.set(goodName, {
                    'poNo': `${key}`,
                    'purchasePrice': item[0],
                    'quantity': item[1],
                    'orderCreationDate': value.get('orderInformation').orderCreationDate,
                    'freight': value.get('orderInformation').freight,
                })

            })
        })
        return item_map;
    }
    function getItemData() {
        let goodList = new Map();
        let table = document.querySelector("iframe").contentWindow.document.querySelectorAll("tbody")[1];
        let trList = Array.from(table.children).slice(10);
        for (let i = 0; i < trList.length; i = i + 11) {
            // 实发数量
            let actualShipmentQuantity = trList[i + 7].children[5].children[0].getAttribute("value");
            // 入库数量
            let receiptQuantity = trList[i + 5].children[1].children[0].getAttribute("value");
            // 采购数量 = 实发数量 + 入库数量
            let purchaseQuantity = Number(actualShipmentQuantity) + Number(receiptQuantity);
            // 1688商品id
            let goodLink = trList[i + 2].children[0].children[0].textContent
            let offerId = '';
            if (goodLink.includes('taobao') || goodLink.includes('tmall')) {
                // for (let i of goodLink.split('?')[1].split('&')) {
                //     if (i.slice(0, 3) === 'id=') {
                //         offerId = i.slice(3);
                //         break;
                //     }
                // }
                // imgid
                let img = trList[i].children[2].querySelector('img');
                if (img?.src.match(/\b[a-zA-Z0-9]+_!![0-9]+\b/)) {
                    offerId = img.src.match(/\b[a-zA-Z0-9]+_!![0-9]+\b/)[0] ?? 'id读取错误'
                }
            }
            if (goodLink.includes('1688')) {
                offerId = goodLink.split('/')[4].split('.')[0];
            }
            // 商品编号
            let itemNumber = trList[i].children[1].children[0].textContent.replace(/\s/g, '');
            // 商品属性
            let itemProperties = trList[i].children[3].children[0].querySelectorAll("textarea");
            let itemText = [];
            itemProperties.forEach((element) => {
                itemText.push(element.value.trim());
            });
            itemProperties = itemText.sort((a, b) => a.localeCompare(b)).join('|');

            // // 运输方式
            // let transportationType = '';
            // let orderNo = table.children[2].children[1].textContent;
            // let select = table.children[0].children[2].children[0]
            // // 如果为S或O的，修改为空运
            // if (orderNo.includes('O') || orderNo.includes('S')) {
            //     transportationType = '空';
            // } else {
            //     transportationType = `${select.options[select.selectedIndex].textContent[0]}`;
            // }

            goodList.set(itemNumber, { goodKey: `${offerId}__${itemProperties}__${purchaseQuantity}` })
        }
        console.log('系统订单信息', goodList)
        return goodList;
    }

    function comparisonData(orderlist, dataSource) {
        let poNoList = [];
        orderlist.forEach((value) => {
            if (dataSource.has(value.goodKey)) {
                let itemInfo = dataSource.get(value.goodKey);
                value.poNo = itemInfo.poNo;
                if (!poNoList.includes(value.poNo)) {
                    poNoList.push(value.poNo);
                    value.freight = itemInfo.freight;
                }
                value.purchasePrice = itemInfo.purchasePrice;
                value.quantity = itemInfo.quantity;
                value.orderCreationDate = itemInfo.orderCreationDate;
            }
        })
    };
    function fillInData(goodListMap) {
        let unprocessedArr = [];
        let table = document.querySelector("iframe").contentWindow.document.querySelectorAll("tbody")[1];
        let trList = Array.from(table.children).slice(10);
        for (let i = 0; i < trList.length; i = i + 11) {
            let itemNumber = trList[i].children[1].children[0].textContent.replace(/\s/g, '');
            if (itemNumber.includes('(')) {
                continue;
            }
            if (goodListMap.get(itemNumber).poNo === undefined) {
                unprocessedArr.push(itemNumber);
                continue;
            }
            // 采购单号
            trList[i + 7].children[3].children[0].setAttribute(
                "value", goodListMap.get(itemNumber).poNo
            );
            // 手动触发采购单号的input元素的onchange
            trList[i + 7].children[3].children[0].dispatchEvent(new CustomEvent('change'));
            // 采购价格
            trList[i + 7].children[1].children[0].setAttribute(
                "value", goodListMap.get(itemNumber).purchasePrice
            );
            // 订单生成日期
            trList[i + 8].children[3].children[0].setAttribute(
                "value", goodListMap.get(itemNumber).orderCreationDate
            );
            // 运费
            if ('freight' in goodListMap.get(itemNumber)) {
                trList[i + 8].children[1].children[0].setAttribute(
                    "value", goodListMap.get(itemNumber).freight
                )
            } else {
                trList[i + 8].children[1].children[0].setAttribute("value", 0)
            }
        }
        if (unprocessedArr.length > 0) {
            let unprocessedStr = unprocessedArr.join(' , ');
            alert(`下列商品在购买记录中找不到
${unprocessedStr}`);
            console.log(`下列商品在购买记录中找不到
${unprocessedStr}`)
        } else {
            alert('导入已完成')
        }
    }

    function fileToJson(file, callback) {
        // 数据处理结果
        let result;
        // 是否用BinaryString（字节字符串格式） 否则使用base64（二进制格式）
        let isBinary = true;
        // 创建一个FileReader对象
        var reader = new FileReader();
        // reader在onload解析结束事件时触发
        reader.onload = function (e) {
            var data = e.target.result;
            if (isBinary) {
                result = XLSX.read(data, {
                    type: 'binary',
                    cellDates: true,// 为了获取excel表格中的时间，返回格式为世界时间
                });
            } else {
                result = XLSX.read(btoa(fixdata(data)), {
                    type: 'base64',
                    cellDates: true,
                });
            }
            // 格式化数据
            formatResult(result, callback);
        };
        if (isBinary) {
            reader.readAsBinaryString(file);// 使用 BinaryString 来解析文件数据
        } else {
            reader.readAsArrayBuffer(file);// 使用base64 来解析文件数据
        }
    }

    // 文件流转 base64
    function fixdata(data) {
        var o = '',
            l = 0,
            w = 10240;
        for (; l < data.byteLength / w; ++l)
            o += String.fromCharCode.apply(
                null,
                new Uint8Array(data.slice(l * w, l * w + w))
            );
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
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
            })
        });
        // 返回数据
        callback(sheetArr)
    }

    // 格式化Item时间数据
    function formatItemDate(data) {
        data.forEach((row) => {
            row.forEach((item, index) => {
                // 若有数据为时间格式则格式化时间
                if (item instanceof Date) {
                    // 坑：这里因为XLSX插件源码中获取的时间少了近43秒，所以在获取凌晨的时间上会相差一天的情况,这里手动将时间加上
                    var date = new Date(Date.parse(item) + 43 * 1000);
                    row[index] = `${date.getFullYear()}-${String(
                        date.getMonth() + 1
                    ).padStart(2, 0)}-${String(date.getDate()).padStart(2, 0)}`;
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
})();

/**
 * 数字运算（主要用于小数点精度问题）
 * [see](https://juejin.im/post/6844904066418491406#heading-12)
 * @param {number} a 前面的值
 * @param {"+"|"-"|"*"|"/"} type 计算方式
 * @param {number} b 后面的值
 * @example 
 * ```js
 * // 可链式调用
 * const res = computeNum(1.3, "-", 1.2).next("+", 1.5).next("*", 2.3).next("/", 0.2).result;
 * console.log(res);
 * ```
*/
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
    }
};

/**
 * 返回每个商品单价的调整额和调整后的运费
 * @param {number} diffence 差额
 * @param {number} quantity 商品数量
 * @param {number} freight 运费
 * @return {[perDifference, freight]} 
 */
function priceCorrection(diffence, quantity, freight) {
    // 总差额乘于100，除以数量取余
    let surplus = computeNum(computeNum(diffence, '*', 100).result % quantity, '/', 100).result;
    let perDifference = 0;
    if (surplus === 0) {
        perDifference = computeNum(diffence, '/', quantity).result;
    } else if (surplus !== 0) {
        perDifference = computeNum(diffence, '-', surplus).next('+', quantity / 100).next('/', quantity).result;
        freight = computeNum(freight, '-', surplus).next('+', quantity / 100).result;
    }
    // 返回的是[每个商品的单价差额, 调整后的运费]
    return [perDifference, freight];
};