// ==UserScript==
// @name Download_Monitor_Shop_V2
// @namespace Violentmonkey Scripts - Download_Monitor_Shop
// @match https://sycm.taobao.com/mc/ci/shop/monitor*
// @author          Toddy Zhou
// @description     下载生意参谋下的竞店监控数据
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         0.0.3
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/391206/Download_Monitor_Shop_V2.user.js
// @updateURL https://update.greasyfork.org/scripts/391206/Download_Monitor_Shop_V2.meta.js
// ==/UserScript==
(function () {
    'use strict';

    //与元数据块中的@grant值相对应，功能是生成一个style样式
    GM_addStyle('#down_video_btn{color:#fa7d3c;}');

    //视频下载按钮的html代码
    var down_btn_html = '<div>';
    down_btn_html += '<button type="button" id="monitor_shop_btn_setting_1">全店-设定条件</button><button type="button" id="monitor_shop_btn_download_1">全店-生成数据文件</button>';
    down_btn_html += '<button type="button" id="monitor_shop_btn_setting_2">类别-设定条件</button><button type="button" id="monitor_shop_btn_download_2">运动鞋-生成数据文件</button>';
    down_btn_html += '<button type="button" id="monitor_shop_btn_download_3">运动服-生成数据文件</button>';
    down_btn_html += ' </div>';

    function download(filename) {
        var rows = document.getElementsByClassName('ant-table-tbody')[0].childNodes;
        var i;
        var content = '';
        var shop, kpi_1, kpi_2, kpi_3, kpi_4, kpi_5;
        //var shop = rows[0].childNodes[0].getElementsByClassName('sycm-common-shop-td')[0].getAttribute('title');
        //var kpi_1 = rows[0].childNodes[1].getElementsByTagName('div')[0].innerText.replace(',','');
        //var kpi_2 = rows[0].childNodes[2].getElementsByTagName('div')[0].innerText.replace(',','');
        //var kpi_3 = rows[0].childNodes[3].getElementsByTagName('div')[0].innerText.replace(',','');
        //var kpi_4 = rows[0].childNodes[4].getElementsByTagName('div')[0].innerText.replace(',','');
        //var kpi_5 = rows[0].childNodes[5].getElementsByTagName('div')[0].innerText.replace(',','');
        //alert(shop + ',' + kpi_1 + ',' + kpi_2 + ',' + kpi_3 + ','+kpi_4+','+kpi_5);
        for (i = 0; i < rows.length; i++) {
            shop = rows[i].childNodes[0].getElementsByClassName('sycm-common-shop-td')[0].getAttribute('title');
            kpi_1 = rows[i].childNodes[1].getElementsByTagName('div')[0].innerText.replace(/,/g, '');
            kpi_2 = rows[i].childNodes[2].getElementsByTagName('div')[0].innerText.replace(/,/g, '');
            kpi_3 = rows[i].childNodes[3].getElementsByTagName('div')[0].innerText.replace(/,/g, '');
            kpi_4 = rows[i].childNodes[4].getElementsByTagName('div')[0].innerText.replace(/,/g, '');
            kpi_5 = rows[i].childNodes[5].getElementsByTagName('div')[0].innerText.replace(/,/g, '');
            content = content + shop + ',' + kpi_1 + ',' + kpi_2 + ',' + kpi_3 + ',' + kpi_4 + ',' + kpi_5 + '\r\n';
        }
        alert(content);


        var data = new Blob([content], {
            type: "text/plain;charset=UTF-8"
        });
        var downloadUrl = window.URL.createObjectURL(data);
        var anchor = document.createElement("a");
        anchor.href = downloadUrl;
        anchor.download = filename;
        anchor.click();
        //window.URL.revokeObjectURL(data);
    }

    $(function () {

        //将以上拼接的html代码插入到网页里的ul标签中
        var div_tag = $(".oui-card-header");
        if (div_tag) {
            div_tag.append(down_btn_html);
            $('#monitor_shop_btn_setting_1').click(function () {
                //将类别下选中的KPI全部去掉选择
                var categorys = document.getElementsByClassName('oui-index-picker')[0].childNodes[1].getElementsByTagName('input');
                var i;
                for (i = 0; i < categorys.length; i++) {
                    //如果有勾选，则移除勾选
                    if (categorys[i].parentNode.getAttribute('class').indexOf('ant-checkbox-checked') != -1) {
                        categorys[i].parentNode.parentNode.click();
                    }
                }
                //将全店监控下的指标设定为指定的5项
                var categorys = document.getElementsByClassName('oui-index-picker')[0].childNodes[0].getElementsByTagName('input');
                var i;
                var tmp_text;

                for (i = 0; i < categorys.length; i++) {
                    tmp_text = categorys[i].parentNode.nextSibling.children[0].innerText;
                    if ((tmp_text != '流量指数' || tmp_text != '搜索人气' || tmp_text != '收藏人气' || tmp_text != '加购人气' || tmp_text != '交易指数') && (categorys[i].parentNode.getAttribute('class').indexOf('ant-checkbox-checked') != -1)) {
                        categorys[i].parentNode.parentNode.click();
                    }
                    if ((tmp_text === '流量指数' || tmp_text === '搜索人气' || tmp_text === '收藏人气' || tmp_text === '加购人气' || tmp_text === '交易指数') && (categorys[i].parentNode.getAttribute('class').indexOf('ant-checkbox-checked') === -1)) {
                        categorys[i].parentNode.parentNode.click();
                    }



                }

            });



            $('#monitor_shop_btn_setting_2').click(function () {
                //将全店下选中的KPI全部去掉选择
                var categorys = document.getElementsByClassName('oui-index-picker')[0].childNodes[0].getElementsByTagName('input');
                var i;
                for (i = 0; i < categorys.length; i++) {
                    //如果有勾选，则移除勾选
                    if (categorys[i].parentNode.getAttribute('class').indexOf('ant-checkbox-checked') != -1) {
                        categorys[i].parentNode.parentNode.click();
                    }
                }
                //将全店监控下的指标设定为指定的5项
                var categorys = document.getElementsByClassName('oui-index-picker')[0].childNodes[1].getElementsByTagName('input');
                var i;
                var tmp_text;

                for (i = 0; i < categorys.length; i++) {
                    tmp_text = categorys[i].parentNode.nextSibling.children[0].innerText;
                    if ((tmp_text != '流量指数' || tmp_text != '搜索人气' || tmp_text != '收藏人气' || tmp_text != '加购人气' || tmp_text != '交易指数') && (categorys[i].parentNode.getAttribute('class').indexOf('ant-checkbox-checked') != -1)) {
                        categorys[i].parentNode.parentNode.click();
                    }
                    if ((tmp_text === '流量指数' || tmp_text === '搜索人气' || tmp_text === '收藏人气' || tmp_text === '加购人气' || tmp_text === '交易指数') && (categorys[i].parentNode.getAttribute('class').indexOf('ant-checkbox-checked') === -1)) {
                        categorys[i].parentNode.parentNode.click();
                    }



                }

            });

            $('#monitor_shop_btn_download_1').click(function () {
                var curr_time = new Date().getTime();
                var select_date = document.getElementsByClassName('oui-date-picker-current-date')[0].innerText.substring(5, 15);
                var store_name = document.getElementsByClassName('ebase-ModernFrame__title')[0].innerText;
                //document.getElementsByClassName('ebase-Selector__title')[0].getAttribute('title');
                var category = document.getElementsByClassName('common-picker-header')[0].title.replace(/ /g, '');
                var store;
                switch (store_name) {
                    case 'adidas儿童官方旗舰店':
                        store = 'KIDS00';
                        break;
                    case 'adidas官方旗舰店':
                        store = 'ADIDAS';
                        break;
                    default:
                        store = 'ERROR';
                        break;
                }

                var file_name = '竞争店铺_' + store + '_全店_' + select_date + '_' + category + '_' + curr_time + '.csv';
                download(file_name);
            });

            $('#monitor_shop_btn_download_2').click(function () {
                var curr_time = new Date().getTime();
                var select_date = document.getElementsByClassName('oui-date-picker-current-date')[0].innerText.substring(5, 15);
                //var store_name = document.getElementsByClassName('ebase-Selector__title')[0].getAttribute('title');
                var store_name = document.getElementsByClassName('ebase-ModernFrame__title')[0].innerText;
                var store;
                switch (store_name) {
                    case 'adidas儿童官方旗舰店':
                        store = 'KIDS00';
                        break;
                    case 'adidas官方旗舰店':
                        store = 'ADIDAS';
                        break;
                    default:
                        store = 'ERROR';
                        break;
                }

                var file_name = '竞争店铺_' + store + '_类目_运动鞋_' + select_date + '_' + curr_time + '.csv';
                download(file_name);
            });

            $('#monitor_shop_btn_download_3').click(function () {
                var curr_time = new Date().getTime();
                var select_date = document.getElementsByClassName('oui-date-picker-current-date')[0].innerText.substring(5, 15);
                //var store_name = document.getElementsByClassName('ebase-Selector__title')[0].getAttribute('title');
                var store_name = document.getElementsByClassName('ebase-ModernFrame__title')[0].innerText;
                var store;
                switch (store_name) {
                    case 'adidas儿童官方旗舰店':
                        store = 'KIDS00';
                        break;
                    case 'adidas官方旗舰店':
                        store = 'ADIDAS';
                        break;
                    default:
                        store = 'ERROR';
                        break;
                }

                var file_name = '竞争店铺_' + store + '_类目_运动服_' + select_date + '_' + curr_time + '.csv';
                download(file_name);

            });
        }
    });

})();