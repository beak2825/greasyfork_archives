// ==UserScript==
// @name         浦发信用卡交易统计插件
// @version      0.1
// @description  可按自然月、自定义日期范围（例如输入：g('2018-02-07','2018-03-06')）统计
// @match        https://cardsonline.spdbccc.com.cn/icard/*
// @run-at       document-start
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/176496
// @downloadURL https://update.greasyfork.org/scripts/39917/%E6%B5%A6%E5%8F%91%E4%BF%A1%E7%94%A8%E5%8D%A1%E4%BA%A4%E6%98%93%E7%BB%9F%E8%AE%A1%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/39917/%E6%B5%A6%E5%8F%91%E4%BF%A1%E7%94%A8%E5%8D%A1%E4%BA%A4%E6%98%93%E7%BB%9F%E8%AE%A1%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

var frm, bill = [],
    fetched = [],
    spdbstatTimer;

function start() {
    if ((typeof $ === 'undefined') || $('#frmright').length == 0) return;
    clearInterval(spdbstatTimer);
    var w = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
    w.g = function (date1, date2) {
        statBill(date1, date2);
    };

    $('#frmright').load(function () {
        frm = $('#frmright')[0].contentWindow.document;
        var dt = getBillDate();
        if (!dt || fetched.indexOf(dt) >= 0) return;
        fetchBill();
        statBill();
        if (!$('input[name=Next]', frm).is(':disabled'))
            setTimeout(function () {
                $('input[name=Next]', frm).click();
            }, 700);
        else {
            fetched.push(dt);
            console.log('<当前账单统计完毕！>');
        }
    });
    $('#frmright').trigger('load');
}

function getBillDate() {
    if (!frm) return null;
    var dt = null;
    var billtype = getBillType();
    if (billtype == 0) // 未出账单
        dt = '0000-00-00';
    else if (billtype == 1) { // 已出账单
        var $dt = $('form[name=form1] .table_comm_noze td:last-child', frm);
        if ($dt.prev().html() == '到期还款日')
            dt = $dt.html();
    }
    return dt;
}

function getBillType() {
    var billtype = -1;
    if (!frm) return billtype;
    var page = $('.tabsl>a>span', frm).html();
    if (page == '账户近期交易')
        billtype = 0; // 未出账单
    else if (page == '近期对账单查询')
        billtype = 1; // 已出账单
    return billtype;
}

function fetchBill() {
    if (!frm) return;
    var billtype = getBillType();
    if (billtype == -1) return;
    var page = $('.tabsl>a>span', frm).html();

    var tbl = $('form[name=form1] .table_comm', frm);
    $('tr', tbl).each(function () {
        var row = [];
        $('td', $(this)).each(function () {
            row.push($(this).html());
        });
        if (!isNaN(Date.parse(row[1]))) {
            if (billtype == 0)
                bill.push([row[1], row[2], row[6]]);
            else
                bill.push([row[1], row[2], row[3]]);
        }
    });
}

function pad(n, width, z) {
    z = z || '0';
    n = n.toFixed(2) + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function sumRow(row, sum, item, val) {
    sum[item].total += val;
    if (row[1].indexOf('支付宝') >= 0)
        sum[item].alipay += val;
    else if (row[1].indexOf('财付通') >= 0)
        sum[item].tenpay += val;
    else
        sum[item].other += val;
}

function statBill(date1, date2) {
    var sum = {},
        range = 'range';
    if (date1)
        sum[range] = {
            total: 0,
            alipay: 0,
            tenpay: 0,
            other: 0,
            mindate: date1,
            maxdate: date1
        };
    for (var i = 0; i < bill.length; i++) {
        var row = bill[i];
        var mon = row[0].substr(0, 7);
        var val = parseFloat(row[2].replace(/,/g, ''));
        if (!sum[mon]) sum[mon] = {
            total: 0,
            alipay: 0,
            tenpay: 0,
            other: 0,
            mindate: row[0],
            maxdate: row[0]
        };
        if (row[1].indexOf('还款') < 0) { // 还款的不计入
            sumRow(row, sum, mon, val);

            if (date1 && row[0] >= date1 && (!date2 || row[0] <= date2)) {
                sumRow(row, sum, range, val);
                if (row[0] > sum[range].maxdate) sum[range].maxdate = row[0];
            }
        }
        if (row[0] < sum[mon].mindate) sum[mon].mindate = row[0];
        if (row[0] > sum[mon].maxdate) sum[mon].maxdate = row[0];
    }
    console.clear();
    for (var item in sum) {
        if (date1 && item != range) continue;
        var s = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
            '周　期：' + sum[item].mindate + ' 至 ' + sum[item].maxdate + '\n' +
            '───────────────────────────────────\n' +
            '支付宝：' + pad(sum[item].alipay, 12, ' ') + '\n' +
            '财付通：' + pad(sum[item].tenpay, 12, ' ') + '\n' +
            '-----------------------------------\n' +
            '小　计：' + pad(sum[item].alipay + sum[item].tenpay, 12, ' ') + '\n' +
            '───────────────────────────────────\n' +
            '其　它：' + pad(sum[item].other, 12, ' ') + '\n' +
            '───────────────────────────────────\n' +
            '合　计：' + pad(sum[item].total, 12, ' ') + '\n' +
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
        console.log(s);
    }
}

spdbstatTimer = setInterval(function() {
    start();
}, 2000);