// ==UserScript==
// @icon         http://fund.eastmoney.com/favicon.ico
// @name         天天基金-自选基金估值自动刷新
// @namespace    https://github.com/ekoooo/tampermonkey_eastmoney_auto_refresh
// @version      0.1.2
// @description  天天基金-自选基金-估值自动刷新
// @author       liuwanlin
// @match        *://favor.fund.eastmoney.com
// @match        *://favor.fund.eastmoney.com/#mykfs
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/392124/%E5%A4%A9%E5%A4%A9%E5%9F%BA%E9%87%91-%E8%87%AA%E9%80%89%E5%9F%BA%E9%87%91%E4%BC%B0%E5%80%BC%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/392124/%E5%A4%A9%E5%A4%A9%E5%9F%BA%E9%87%91-%E8%87%AA%E9%80%89%E5%9F%BA%E9%87%91%E4%BC%B0%E5%80%BC%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    // 请求接口地址
    var URL = 'https://api.fund.eastmoney.com/Favor/Get?&callback=?';
    // 选择器
    var TABLE_SELECTOR = '.js-fundlist-table';
    // 始化失败次数
    var INIT_CHECK_FAIL_NUMBER = 0;

    $(`
    <style type='text/css'>
        .js-fundlist-table .gz,
        .js-fundlist-table .zf {
            font-weight: bold;
            text-align: center;
        }
    </style>
    `).appendTo("head");


    // 检查并开始
    function init() {
        setTimeout(function() {
            if($(TABLE_SELECTOR + ' tbody tr').length) {
                injectTemplate2Table();
                startGetDataTimer();
            }else {
                ++INIT_CHECK_FAIL_NUMBER;
                INIT_CHECK_FAIL_NUMBER <= 20 && init();
            }
        }, 500);
    }

    // 注入模板给表格中
    function injectTemplate2Table() {
        const columnIndex = 2;
        const table = $(TABLE_SELECTOR);
        const tbody = table.find('tbody');
        const th = table.find('thead th');
        // 隐藏原来的列
        table.find('.js-gsz, .js-gszzl').hide();
        th.eq(2).hide();
        th.eq(3).hide();
        // 注入表格头
        table.find('thead th').eq(columnIndex - 1).after(`
            <th class="zf em-sortable"><p>估值 | <span class="lwl-update-time">-</span></p></th>
            <th class="zf em-sortable"><p>涨幅</p></th>
        `);
        const tr = tbody.find('tr');
        for(var i = 0; i < tr.length; i++) {
            tr.eq(i).find('td').eq(columnIndex - 1).after(`
                <td class="rq js-dwjz lwl-ssgz lwl-gz-${ tr.eq(i).data('fundcode') }" data-sortvalue="-"><p class="gz">-</p></td>
                <td class="rq js-dwjz lwl-ssgz lwl-zf-${ tr.eq(i).data('fundcode') }" data-sortvalue="-"><p class="zf">-</p></td>
            `);
        }
    }

    // 获取当前时间 00:00:00
    function getNowTime(now) {
        now = now ? now : new Date();

        var format = function(num) {
            return num >= 10 ? num : '0' + num;
        }

        return format(now.getHours()) + ':' + format(now.getMinutes()) + ':' + format(now.getSeconds());
    }

    // 注入数据
    async function injectData() {
        const rt = await get(URL);

        if(rt.ErrCode === 0) {
            $('.lwl-update-time').text(getNowTime());

            const kfs = rt.Data.KFS;
            for(var i = 0; i < kfs.length; i++) {
                let code = kfs[i].FCODE;
                let gz = kfs[i].gsz; // 估值
                let zf = kfs[i].gszzl; // 涨幅

                let gzTr = $('.lwl-gz-' + code);
                let zfTr = $('.lwl-zf-' + code);
                let gzNode = gzTr.find('.gz');
                let zfNode = zfTr.find('.zf');

                gzTr.attr('data-sortvalue', gz);
                zfTr.attr('data-sortvalue', zf);

                gzNode.html(gz);
                zfNode.html(zf + '%');

                if(zf < 0) {
                    gzNode.addClass('ep-green').removeClass('ep-red');
                    zfNode.addClass('ep-green').removeClass('ep-red');
                }else if(zf > 0) {
                    gzNode.addClass('ep-red').removeClass('ep-green');
                    zfNode.addClass('ep-red').removeClass('ep-green');
                }else {
                    gzNode.removeClass('ep-green');
                    zfNode.removeClass('ep-green');
                }
            }
        }
    }

    // 开始获取数据并注入
    async function startGetDataTimer() {
        await injectData();
        setTimeout(function() {
            startGetDataTimer();
        }, 5000);
    }

    // 获取数据
    function get(url) {
        return new Promise(function(resolve, reject) {
            $.getJSON(url, function(e) {
                resolve(e);
            });
        });
    }

    init();
})(unsafeWindow.jQuery);