// ==UserScript==
// @name         首页统计表格
// @namespace    http://tampermonkey.net/
// @version      0.7.4
// @description  按照分类统计每天销售额
// @author       Ming
// @match        http://admin.linjiayoho.com/association/index/index.html
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/418524/%E9%A6%96%E9%A1%B5%E7%BB%9F%E8%AE%A1%E8%A1%A8%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/418524/%E9%A6%96%E9%A1%B5%E7%BB%9F%E8%AE%A1%E8%A1%A8%E6%A0%BC.meta.js
// ==/UserScript==
(function () {
    const strCSS = '<style>' +
        '.loader {margin: 100px auto;width: 100px;height: 100px;border: 10px solid #f5f5f5;border-bottom: darkblue 10px solid;border-radius: 50%;animation: load 1.1s infinite linear;-webkit-animation: load 1.1s infinite linear;-moz-animation: load 1.1s infinite linear;-o-animation: load 1.1s infinite linear}' +
        '@keyframes load { from {transform: rotate(0);-ms-transform: rotate(0)} to {transform: rotate(360deg);-ms-transform: rotate(360deg)} }' +
        '@-webkit-keyframes load { from {-webkit-transform: rotate(0)} to {-webkit-transform: rotate(360deg)} }' +
        '@-moz-keyframes load { from {-moz-transform: rotate(0)} to {-moz-transform: rotate(360deg)} }' +
        '@-o-keyframes load { from {-o-transform: rotate(0)} to {-o-transform: rotate(360deg)} }' +
        '.injet_table th{text-align: center} ' +
        '.injet_table tr{opacity:.999}' +
        '.injet_table td{position:relative;font-size: 14px; text-align: center}' +
        '.bg{position:absolute;left:0;top:0;bottom:0;background-color:#bee2fc;z-index:-1;border-radius: 5px;margin:5px 0;}' +
        '</style>'

    const strLoading = '<div class="space-6"></div><div class="loader"></div></div>';
    const oldTable = $("div.col-xs-12 > div.row:last-child").html();
    $("div.col-xs-12 > div.row:last-child").hide();
    $(".page-content").append(strCSS).append(strLoading);

    function getDate(strDate) {
        return eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
            function (a) {
                return parseInt(a, 10) - 1;
            }).match(/\d+/g) + ')');
    }


    function setFormat(now, mask) {
        const d = now;
        return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function ($0) {
            switch ($0) {
                case 'd':
                    return d.getDate();
                case 'dddd':
                    return ['周日', '周一', '周二','周三', '周四', '周五', '周六'][d.getDay()];
                case 'M':
                    return d.getMonth() + 1;
                default:
                    return $0.substr(1, $0.length - 2);
            }
        });
    }
    function getMaxSum(oJson) {
        let nBer = Number(oJson[0].sales_sum.replace(',', ''));
        for (let i in oJson) {
            let this_sum = Number(oJson[i].sales_sum.replace(',', ''));
            nBer = Math.max(nBer, this_sum);
        }
        return nBer;
    }
    const getCurrency = function (o) {
        return parseFloat(o).toLocaleString('zh-Hans-CN', {style: 'currency', currency: 'CNY'});
    }
    
    function getLTable(json) {
        const tableHeader = ['<div class="row">' +
        '<div class="col-md-6">' +
        '<div class="panel panel-default">',
            '   <div class="panel-heading" ><h3 class="panel-title"><span class="glyphicon glyphicon-yen" aria-hidden="true"></span>每日销售数据</h3>(仅统计有效订单的订单总额)</div>' +
            '   <table class="table injet_table table-striped">',
            '        <thead>',
            '       <tr>',
            '            <th style="width:14%;">日期</th>',
            '            <th style="width:14%;">福利销售额</th>',
            '            <th style="width:14%;">礼包销售额</th>',
            '            <th style="width:14%;">自营销售额</th>',
            '            <th style="">自营福利礼包合计</th>',
            '           <th style="width:14%;">团品销售额</th>',
            '       </tr>',
            '       </thead>',
            '    <tbody>'].join("");
        const tableFoot = '    </tbody>' + '</table>' +
            '</div>' +
            '</div>';


        const getPercent = function (json, z) { //计算百分比
            return ((Number(json[z].sales_sum.replace(',', '')) / getMaxSum(json)) * 100).toFixed(0)
        }
        const getAvg = function (n, length) {
            return getCurrency(n / length);
        }
        let tableTr = "";
        let fSum = {fuli: 0.0, libao: 0.0, self: 0.0, osum: 0.0, tuanpin: 0.0};
        let length = json.length - 1;
        for (let i in json) {
            fSum.fuli += parseFloat(json[i].sales_fuli);
            fSum.libao += parseFloat(json[i].sales_libao);
            fSum.self += parseFloat(json[i].sales_self);
            fSum.osum += parseFloat(json[i].sales_sum.replace(',', ''));
            fSum.tuanpin += parseFloat(json[i].sales_tuanpin);
            tableTr += "<tr>";
            tableTr += `<td><a href="javascript:void(0)" data-html='${json[i].day}' id='test_link'>` + setFormat(getDate(json[i].day), 'M月d日 dddd') + "</a></td>";
            tableTr += "<td>" + getCurrency(json[i].sales_fuli) + "</td>";
            tableTr += "<td>" + getCurrency(json[i].sales_libao) + "</td>";
            tableTr += "<td>" + getCurrency(json[i].sales_self) + "</td>";

            tableTr += "<td style='text-align: left'> <div class=\"bg\" style=\"width: " + getPercent(json, i) + "%\"></div><b style=\"color: #1616a8;\">" + getCurrency(json[i].sales_sum.replace(',', '')) + "</b></td>";
            tableTr += "<td>" + getCurrency(json[i].sales_tuanpin) + "</td>";
            tableTr += "</tr>";
        }
        //--------合计行------
        tableTr += `<tr style='font-size: 15px;font-weight: bold;'>
                        <td>合计</td>
                        <td>${getCurrency(fSum.fuli)}</td>
                        <td>${getCurrency(fSum.libao)}</td>
                        <td>${getCurrency(fSum.self)}</td>
                        <td><b style="color: darkblue">${getCurrency(fSum.osum)}</b></td>
                        <td>${getCurrency(fSum.tuanpin)}</td>
                    </tr>`;
        //--------平均值行------
        tableTr += `<tr style="font-size: 15px;font-weight: bold">
                        <td>日均</td>
                        <td>${length === 0 ? json[0].sales_fuli : getAvg(fSum.fuli - json[0].sales_fuli, length)}</td>
                        <td>${length === 0 ? json[0].sales_libao : getAvg(fSum.libao - json[0].sales_libao, length)}</td>
                        <td>${length === 0 ? json[0].sales_self : getAvg(fSum.self - json[0].sales_self, length)}</td>
                        <td><b style="color: darkblue">${length === 0 ? json[0].sales_sum : getAvg(fSum.osum - -json[0].sales_sum.replace(',', ''), length)}</b></td>
                        <td>${length === 0 ? json[0].sales_tuanpin : getAvg(fSum.tuanpin - json[0].sales_tuanpin, length)}</td>
                    </tr>`;
        return tableHeader + tableTr + tableFoot;
    }

    function getRTable(json) {
        const tableHead = ['<div class="col-md-6">' +
        '<div class="panel panel-default">',
            '<div class="panel-heading""><h3 class="panel-title"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>每日订单数据&签到人数</h3>(仅统计有效订单)</div>',
            '<table class="table injet_table table-striped">',
            '    <thead>',
            '    <tr>',
            '        <th style="width: 14%;">日期</th>',
            '        <th style="width: 11%;">福利订单数</th>',
            '        <th style="width: 11%;">礼包订单数</th>',
            '        <th style="width: 11%;">自营订单数</th>',
            '        <th style="">合计订单数</th>',
            '        <th style="width: 11%;">团品订单数</th>',
            '        <th style="width: 20%;">签到人数</th>',
            '    </tr>',
            '    </thead>',
            '    <tbody>'
        ].join("");
        const tableFoot = '</tbody>' +
            '</table>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        const getAvg = function (n, length) {
            return (n / length).toFixed(0);
        }
        let tableTr = "";
        let iSum = {fuli: 0, libao: 0, self: 0, osum: 0, tuanpin: 0, inger: 0};
        let toThousands = function (num) {
            return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        }
        let length = json.length - 1;
        for (let i in json) {
            iSum.fuli += Number(json[i].orders_fuli);
            iSum.libao += Number(json[i].orders_libao);
            iSum.self += Number(json[i].orders_self);
            iSum.tuanpin += Number(json[i].orders_tuanpin);
            iSum.osum += Number(json[i].orders_sum.replace(',', ''));
            iSum.inger += Number(json[i].day_inger);
            tableTr += "<tr>";
            tableTr += "<td>" + setFormat(getDate(json[i].day), 'M月d日 dddd') + "</td>";
            tableTr += "<td>" + json[i].orders_fuli + "</td>";
            tableTr += "<td>" + json[i].orders_libao + "</td>";
            tableTr += "<td>" + json[i].orders_self + "</td>";
            tableTr += "<td class=\"text-center\"><b style=\"color: darkblue\">" + json[i].orders_sum + "</b></td>";
            tableTr += "<td>" + json[i].orders_tuanpin + "</td>";
            tableTr += "<td class=\"text-center\">" + json[i].day_inger + "人</td>";
            tableTr += "</tr>";
        }
        tableTr += "<tr style='font-size: 15px;font-weight: bold'>";
        tableTr += "<td>合计</td>";
        tableTr += "   <td>    " + toThousands(iSum.fuli) + "</td>";
        tableTr += "   <td>    " + toThousands(iSum.libao) + "</td>";
        tableTr += "   <td>    " + toThousands(iSum.self) + "</td>";
        tableTr += "   <td>    <b style=\"color: darkblue\">" + toThousands(iSum.osum, 1) + "</b></td>";
        tableTr += "   <td>    " + toThousands(iSum.tuanpin) + "</td>";
        tableTr += "   <td>    " + iSum.inger + "</td>";
        tableTr += "</tr>";
        //--------平均值行------
        tableTr += `<tr style="font-size: 15px;font-weight: bold">
                        <td>日均</td>
                        <td>${length === 0 ? json[0].orders_fuli : getAvg(iSum.fuli - json[0].orders_fuli, length)}</td>
                        <td>${length === 0 ? json[0].orders_libao :getAvg(iSum.libao - json[0].orders_libao, length)}</td>
                        <td>${length === 0 ? json[0].orders_self :getAvg(iSum.self - json[0].orders_self, length)}</td>
                        <td><b style="color: darkblue">${length === 0 ? json[0].orders_sum :getAvg(iSum.osum - json[0].orders_sum, length)}</b></td>
                        <td>${length === 0 ? json[0].orders_tuanpin :getAvg(iSum.tuanpin - json[0].orders_tuanpin, length)}</td>
                        <td>${length === 0 ? json[0].day_inger :getAvg(iSum.inger - json[0].day_inger, length)}人</td>
                    </tr>`;
        return tableHead + tableTr + tableFoot;
    }

    function getRankTable(json, re = 0) {
        const jsonFuliRank = json['fuli'];
        const jsonSelfRank = json['self'];
        const jsonLibaoRank = json['libao'];
        let strFuliTr = '';
        let strSelfTr = '';
        let strLibaoTr = '';
        const getOptionName = function (a = '') {
            if (a === null || a === undefined || a === '0') return "";
            else return "<span class='text-primary'>" + a + "</span>";
        }
        const getStoreCount = function (b) {
            if (parseInt(b) < 11)
                return `<span class='badge badge-danger font-weight-bold text-monospace'>&nbsp;${b}&nbsp;</span>`;
            else
                return b;
        }
        let nSumSales = 0 ;
        let nSumOrders = 0 ;
        for (let i in jsonFuliRank) {
            nSumSales += parseFloat(jsonFuliRank[i].sales_fuli_price);
            nSumOrders += parseInt(jsonFuliRank[i].order_fuli_num);
            let id = parseInt(i) + 1;
            strFuliTr +=
                '<tr>\n' +
                '<td>' + id + '</td>\n' +
                `<td class="align-left">${jsonFuliRank[i].goods_fuli_name} ${getOptionName(jsonFuliRank[i].fuli_option_name)}</td>\n` +
                '<td>' + jsonFuliRank[i].sales_fuli_price + '</td>\n' +
                '<td>' + jsonFuliRank[i].order_fuli_num + '</td>\n' +
                '<td>' + getStoreCount(jsonFuliRank[i].store_count) + '</td>\n' +
                '</tr>';
        }

        strFuliTr += `<tr style="font-size: 15px;font-weight: bold">` +
                        `   <td></td>` +
                        '   <td class="text-left">合计</td>' +
                        `   <td>${getCurrency(nSumSales)}</td>` +
                        `   <td>${nSumOrders}</td>` +
                        '   <td></td>' +
                        '</tr>';
        nSumSales = 0 ;
        nSumOrders = 0;
        for (let i in jsonSelfRank) {
            let id = parseInt(i) + 1;
            nSumSales += parseFloat(jsonSelfRank[i].sales_self_price);
            nSumOrders += parseInt(jsonSelfRank[i].orders_self_num);
            strSelfTr +=
                '<tr>\n' +
                '<td>' + id + '</td>\n' +
                `<td class="align-left"> ${jsonSelfRank[i].goods_self_name} ${getOptionName(jsonSelfRank[i].self_option_name)}</td>\n` +
                ' <td>' + jsonSelfRank[i].sales_self_price + '</td>\n' +
                ' <td>' + jsonSelfRank[i].orders_self_num + '</td>\n' +
                ' <td>' + getStoreCount(jsonSelfRank[i].store_count) + '</td>\n' +
                '</tr>';

        }
        strSelfTr += `<tr style="font-size: 15px;font-weight: bold">` +
            `   <td></td>` +
            '   <td class="text-left">合计</td>' +
            `   <td>${getCurrency(nSumSales)}</td>` +
            `   <td>${nSumOrders}</td>` +
            '   <td></td>' +
            '</tr>';
        nSumSales = 0 ;
        nSumOrders = 0;
        for (let i in jsonLibaoRank) {
            let id = parseInt(i) + 1;
            nSumSales += parseFloat(jsonLibaoRank[i].sales_libao_price);
            nSumOrders += parseInt(jsonLibaoRank[i].orders_libao_num);
            strLibaoTr +=
                '<tr>\n' +
                '<td>' + id + '</td>\n' +
                `<td class="align-left"> ${jsonLibaoRank[i].goods_libao_name} ${getOptionName(jsonLibaoRank[i].libao_option_name)}</td>\n` +
                ' <td>' + jsonLibaoRank[i].sales_libao_price + '</td>\n' +
                '<td>' + jsonLibaoRank[i].orders_libao_num + '</td>\n' +
                '<td>' + getStoreCount(jsonLibaoRank[i].store_count) + '</td>\n' +
                '</tr>';

        }
        strLibaoTr += `<tr style="font-size: 15px;font-weight: bold">` +
            `   <td></td>` +
            '   <td class="text-left">合计</td>' +
            `   <td>${getCurrency(nSumSales)}</td>` +
            `   <td>${nSumOrders}</td>` +
            '   <td></td>' +
            '</tr>';

        let strHeaddiv = "";
        let strFootDiv = "";
        if (re === 0) {
            strHeaddiv = '<div class="space-6"></div>' +
                '<div class="row" id="rank_list">';
            strFootDiv = '</div>';
        }

        return strHeaddiv +
            '   <div class="col-md-6">' +
            '<div class="panel panel-success">\n' +
            '    <div class="panel-heading">\n' +
            '        <h3 class="panel-title">⭕福利商品销量排行\n</h3>' +
            '    </div>\n' +
            '    <table class="table injet_table">\n' +
            '        <thead>\n' +
            '        <tr>\n' +
            '            <th style=" ">#</th>\n' +
            '            <th style=" ">产品名称</th>\n' +
            '            <th style=" ">销售额</th>\n' +
            '            <th style=" ">销量</th>\n' +
            '            <th style=" ">库存</th>\n' +
            '        </tr>\n' +
            '        </thead>\n' +
            '        <tbody>\n'
            +
            strFuliTr
            +
            '        </tbody>\n' +
            '    </table>\n' +
            '</div>' +
            '</div>' +
            '   <div class="col-md-6">' +
            '<div class="panel panel-info">\n' +
            '    <div class="panel-heading">\n' +
            '        <h3 class="panel-title">⭕自营商品销量排行\n</h3>' +
            '    </div>\n' +
            '    <table class="table injet_table">\n' +
            '        <thead>\n' +
            '        <tr>\n' +
            '            <th style=" ">#</th>\n' +
            '            <th style=" ">产品名称</th>\n' +
            '            <th style=" ">销售额</th>\n' +
            '            <th style=" ">销量</th>\n' +
            '            <th style=" ">库存</th>\n' +
            '        </tr>\n' +
            '        </thead>\n' +
            '        <tbody>\n' +
            strSelfTr
            +
            '        </tbody>\n' +
            '    </table>\n' +
            '</div>' +
            '<div class="panel panel-warning">\n' +
            '    <div class="panel-heading" >\n' +
            '        <h3 class="panel-title">⭕礼包商品销量排行\n</h3>' +
            '    </div>\n' +
            '    <table class="table injet_table">\n' +
            '        <thead>\n' +
            '        <tr>\n' +
            '            <th style=" ">#</th>\n' +
            '            <th style=" ">产品名称</th>\n' +
            '            <th style=" ">销售额</th>\n' +
            '            <th style=" ">销量</th>\n' +
            '            <th style=" ">库存</th>\n' +
            '        </tr>\n' +
            '        </thead>\n' +
            '        <tbody>\n'
            +
            strLibaoTr
            +
            '        </tbody>\n' +
            '    </table>\n' +
            '</div>' +
            '</div>' +
            strFootDiv;

    }

    const reRank = function (){
        let date_from_link = this.getAttribute('data-html');
          $("#rank_list").empty();
          $('#rank_list').append('<div class="col-md-12" id="temp"><div class="loader"></div></div>');
          $("div.page-content > div.col-sm-8.infobox-container").hide();
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://yz.muzizy.top/yoho/out_data.php",
            data: `redate=${date_from_link}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function (ra) {
                let aJson = jQuery.parseJSON(ra.responseText);
                $('#temp').fadeOut().remove();
                let join_html =  getRankTable(aJson['rank_json'],1);
                $("#rank_list").append(join_html).hide().fadeIn();
                $("div.page-content > div.col-sm-8.infobox-container").show();
            },
            onerror: function (error) {
                $('.loader').html('读取数据失败...请刷新一下试试<div>错误信息:' + error + '</div>');
            }
        });
    }



    GM_xmlhttpRequest({
        method: "GET",
        url: "http://yz.muzizy.top/yoho/out_data.php",
        onload: function (response) {
            let pJson = jQuery.parseJSON(response.responseText);
            $('.loader').hide();
            let join_html = getLTable(pJson['sum_json']) + getRTable(pJson['sum_json']) + getRankTable(pJson['rank_json']);
            $('.page-content').append(join_html).append(oldTable);
            let ele_a = document.querySelectorAll('#test_link');
            ele_a.forEach(function (item){
                item.addEventListener('click',reRank,false)
            });

        },
        onerror: function (error) {
            $('.loader').html('读取数据失败...请刷新一下试试<div>错误信息:' + error + '</div>');
        }
    });
})();