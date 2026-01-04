// ==UserScript==
// @name         taobaoWorld导出采购信息
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  导出新淘宝的采购信息
// @author       You
// @match        https://distributor.taobao.global/apps/order/list?*
// @icon         https://img.alicdn.com/imgextra/i1/O1CN01pfZa9X29V1xmIDgfs_!!6000000008072-2-tps-500-500.png
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497998/taobaoWorld%E5%AF%BC%E5%87%BA%E9%87%87%E8%B4%AD%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/497998/taobaoWorld%E5%AF%BC%E5%87%BA%E9%87%87%E8%B4%AD%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==
(function () {
    if (!Array.prototype.at) {
        Object.defineProperty(Array.prototype, 'at', {
            value: function (index) {
                if (index < 0) {
                    index = this.length + index;
                }
                if (index < 0 || index >= this.length) {
                    return undefined;
                }
                return this[index];
            },
            configurable: true,
            writable: true
        });
    }
    let loading_wrap = document.querySelector('.Content--loading--g0hLiP5');
    let buttonRow = document.querySelector('.Filter--taskLine--HOIeyXP');
    if (loading_wrap && buttonRow) {
        let btn = document.createElement('button');
        btn.type = 'button';
        btn.style.height = '36px';
        btn.textContent = '导出当前页订单';
        btn.addEventListener('click', () => {
            let moreBtn = document.querySelector('div.Content--loadMore--n54XRx1 button');
            if (moreBtn) {
                setObserver(loading_wrap);
                moreBtn.click();
            }
            else {
                let dataList = groupOrders(document.querySelector('.next-loading-wrap'));
                if (dataList && dataList.length >= 1) {
                    exportExcel(dataList, `taobaoWorld ${timestampToTime(new Date())} 导出订单`);
                }
            }
        });
        buttonRow.append(btn);
    }
    function setObserver(loading_wrap) {
        let observer = new MutationObserver(obseverCallback);
        observer.observe(loading_wrap, { attributes: true });
        console.log('已添加DOM监听');
    }
    function obseverCallback(mutationList, observer) {
        for (let mutation of mutationList) {
            if (mutation.type == 'attributes'
                && mutation.target.className == 'next-loading next-loading-inline Content--loading--g0hLiP5') {
                let moreBtn = document.querySelector('div.Content--loadMore--n54XRx1 button');
                if (moreBtn) {
                    moreBtn.click();
                }
                else {
                    observer.disconnect();
                    console.log('已解除DOM监听');
                    let dataList = groupOrders(document.querySelector('.next-loading-wrap'));
                    if (dataList && dataList.length >= 1) {
                        exportExcel(dataList, `taobaoWorld ${timestampToTime(new Date())} 导出订单`);
                    }
                }
            }
        }
    }
    function groupOrders(wrap) {
        let noData = document.querySelector('.NoData--title--ILagHI5');
        if (noData) {
            return;
        }
        let dataList = [];
        let tableList = Array.from(wrap.querySelectorAll('.Table--orderItemWraper--vfIxDrh'));
        let regex = new RegExp(/\b[a-zA-Z0-9]+_!![0-9]+\b/);
        // 图片ID是：O1CN01EMHKdo1utYxTgMnfz_!!368626095
        // https://img.alicdn.com/bao/uploaded/i2/368626095/O1CN01EMHKdo1utYxTgMnfz_!!368626095.png_400x400q90.jpg
        tableList.forEach((table) => {
            let divList = Array.from(table.querySelectorAll('div'));
            divList.forEach((div) => {
                if (div.className === 'Header--wrapper--iCYgfyU') {
                    let orderDetail = {};
                    orderDetail.orderCreationTime = div.children[2].children[1].lastChild?.textContent ?? '';
                    orderDetail.buyerMemberName = div.children[3].children[1].children[1].textContent ?? '';
                    orderDetail.consigneeName = div.children[4].children[0].lastChild?.textContent ?? '';
                    dataList.push(orderDetail);
                }
                if (div.className === 'Content--listWraper--SWlDcAG') {
                    let current = dataList[dataList.length - 1];
                    // 订单号
                    if (!current.po) {
                        let currenPo = Array.from(div.querySelectorAll('.ProductCard--proDes--fMqofqf'))[3]?.textContent?.split(': ').at(-1) ?? '';
                        current.po = currenPo;
                    }
                    let seller = div.querySelectorAll('.ProductCard--flexCenter--tXn9Ezl');
                    // 卖家公司名
                    current.sellerCompanyName = seller[0]?.children[0].textContent?.split(': ').at(-1) ?? '';
                    // 卖家会员名
                    current.sellerMemberName = seller[1]?.children[0].textContent?.split(': ').at(-1) ?? '';
                    // 订单状态
                    current.orderStatus = div.querySelector('.Content--orderStatus--Pu_LvPp')?.textContent ?? '';
                    // 
                    let itemDivList = div.querySelectorAll('.Content--colStatus--F9DfIjZ');
                    itemDivList.forEach(itemDiv => {
                        // 图片id
                        let img = itemDiv.querySelector('img');
                        let imgId = '';
                        if (img?.src.match(regex)) {
                            imgId = img.src.match(regex)[0] ?? '';
                        }
                        let itemText = itemDiv.querySelectorAll('.chc-ellipsis-container')[1]?.getAttribute('title')?.replaceAll(':', ': ') ?? '';
                        let itemTitle = itemDiv.querySelector('.ProductCard--imgName--w54cJpP')?.textContent ?? '';
                        itemTitle = itemTitle + itemText;
                        // 商品数量
                        let quantity = `${itemDiv.querySelector('.Content--quantityContent--c0HrZdA')?.textContent ?? ''}`;
                        // 商品单价
                        let thisItemtotalPriceOfGoods = '';
                        itemDiv.querySelectorAll('div').forEach(value => {
                            if (value.textContent && value.textContent?.includes('货品金额: CNY')) {
                                thisItemtotalPriceOfGoods = value.textContent.split('货品金额: CNY')[1];
                            }
                        });
                        let price = computeNum(thisItemtotalPriceOfGoods, '/', quantity).result;
                        let item = {
                            price: `${price}`,
                            offerID: imgId,
                            quantity: `${quantity}`,
                            itemTitle: itemTitle,
                        };
                        if (current.itemsList) {
                            current.itemsList.push(item);
                        }
                        else {
                            current.itemsList = [item];
                        }
                    });
                }
                if (div.className.includes('Footer--wrapper--')) {
                    let priceCols = div.querySelectorAll('[class*="Footer--col--"]'); // 匹配所有列

                    let current = dataList[dataList.length - 1];

                    if (priceCols.length >= 3) {
                        // 商品总价（通常为第1个 .Footer--col--XX 元素）
                        let totalPriceSpan = priceCols[0].querySelector('[class*="Footer--normalMoney--"]');
                        current.totalPriceOfGoods = totalPriceSpan ? totalPriceSpan.textContent.replace(',', '') : '';

                        // 运费（通常为第2个 .Footer--col--XX 元素）
                        let freightSpan = priceCols[1].querySelector('[class*="Footer--normalMoney--"]');
                        current.freight = freightSpan ? freightSpan.textContent.replace(',', '') : '';

                        // 实付款（通常为第3个 .Footer--col--XX 元素，可能带 Footer--bigMoney-- 或其它后缀）
                        let actualPaymentSpan = priceCols[2].querySelector('[class*="Footer--normalMoney--"]');
                        current.actualPayment = actualPaymentSpan ? actualPaymentSpan.textContent.replace(',', '') : '';
                    }
                }
            });
        });
        console.log('当前页面订单列表', dataList);
        return dataList;
    }
    // Your code here...
})();
function timestampToTime(date) {
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
}
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
const exportExcel = (dataList, fileName = "ExcelJS.xlsx") => {
    // 创建工作簿
    const _workbook = new ExcelJS.Workbook();
    // 添加工作表
    const _sheet1 = _workbook.addWorksheet('sheet1');
    // 设置表头：一般把第一行设置为表头
    _sheet1.columns = [
        { header: '订单编号', key: 'po', width: 20, },
        { header: '买家公司名', key: 'buyerCompanyName', width: 11, },
        { header: '买家会员名', key: 'buyerMemberName', width: 11, },
        { header: '卖家公司名', key: 'sellerCompanyName', width: 11, },
        { header: '卖家会员名', key: 'sellerMemberName', width: 11, },
        { header: '货品总价(元)', key: 'totalPriceOfGoods', width: 15 },
        { header: '运费', key: 'freight', width: 11 },
        { header: '涨价或折扣(元)', width: 15 },
        { header: '实付款', key: 'actualPayment', width: 11 },
        { header: '订单状态', key: 'orderStatus', width: 11, },
        { header: '订单创建时间', key: 'orderCreationTime', width: 25, },
        { header: '订单付款时间', key: 'orderPaymentTime', width: 25, },
        { header: '发货方', width: 10, },
        { header: '收货人姓名', key: 'consigneeName', width: 10, },
        { header: '收货地址', key: 'address', width: 60, },
        { header: '邮编', key: 'postalCode' },
        { header: '联系电话' },
        { header: '联系手机', key: 'contactMobilePhone', width: 15, },
        { header: '货品标题', key: 'itemTitle', width: 70, },
        { header: '单价(元)', key: 'price', },
        { header: '数量', key: 'quantity' },
        { header: '单位' },
        { header: '货号' },
        { header: '型号' },
        { header: 'Offer ID', key: 'offerID', width: 15, },
        { header: 'SKU ID' },
        { header: '物料编号' },
        { header: '单品货号' },
        { header: '货品种类', key: 'productType' },
        { header: '买家留言' },
        { header: '物流公司', key: 'logisticsName', width: 18 },
        { header: '运单号', key: 'logisticsNum', width: 15, },
    ];
    _sheet1.columns.forEach((col, index) => {
        col.style = {
            alignment: {
                vertical: 'top',
            }
        };
        if (index == 18 || index == 15) {
            col.style.alignment.wrapText = true;
        }
    });
    const _titleCell = _sheet1.getRow(1);
    _titleCell.height = 14;
    // 设置标题行的字体样式
    _titleCell.font = {
        name: '宋体',
        bold: true,
        size: 11,
    };
    // 添加数据
    /* 起始行行号 */ let startRow = 2;
    // 合并列的列号
    let mergeColumns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'AC', 'AD', 'AE', 'AF'];
    dataList.forEach((e) => {
        let isFirst = true;
        e.itemsList.forEach((item) => {
            let row = _sheet1.addRow({
                'po': e.po,
                'buyerCompanyName': e.buyerCompanyName,
                'buyerMemberName': e.buyerMemberName,
                'sellerCompanyName': e.sellerCompanyName,
                'sellerMemberName': e.sellerMemberName,
                'totalPriceOfGoods': Number(e.totalPriceOfGoods),
                'freight': Number(e.freight),
                'actualPayment': Number(e.actualPayment),
                'orderStatus': e.orderStatus,
                'orderCreationTime': e.orderCreationTime,
                'orderPaymentTime': e.orderPaymentTime,
                'consigneeName': e.consigneeName,
                'address': e.address,
                'contactMobilePhone': e.contactMobilePhone,
                'postalCode': e.postalCode,
                'itemTitle': item.itemTitle,
                'price': Number(item.price),
                'quantity': Number(item.quantity),
                'offerID': item.offerID,
                'productType': e.itemsList.length,
                'logisticsName': e.logisticsName,
                'logisticsNum': e.logisticsNum,
            });
            // 设置行高
            row.height = 27;
        });
        if (e.itemsList.length > 1) {
            mergeColumns.forEach(colName => {
                _sheet1.mergeCells(`${colName}${startRow}:${colName}${startRow + e.itemsList.length - 1}`);
            });
        }
        ;
        startRow += e.itemsList.length;
    });
    _workbook.xlsx.writeBuffer().then((buffer) => {
        let _file = new Blob([buffer], {
            type: "application/octet-stream",
        });
        saveAs(_file, `${fileName}.xlsx`);
    });
};
