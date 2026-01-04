// ==UserScript==
// @name Download_Monitor_Product
// @namespace Violentmonkey Scripts - Download_Monitor_Product
// @match https://sycm.taobao.com/mc/ci/item/monitor*
// @author          Toddy Zhou
// @description     下载生意参谋下的竞品监控数据
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         0.0.2
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/376992/Download_Monitor_Product.user.js
// @updateURL https://update.greasyfork.org/scripts/376992/Download_Monitor_Product.meta.js
// ==/UserScript==
(function() {
    'use strict';

    //与元数据块中的@grant值相对应，功能是生成一个style样式
    GM_addStyle('#down_video_btn{color:#fa7d3c;}');

    //视频下载按钮的html代码
    var down_btn_html = '<div>';
    down_btn_html += '<button type="button" id="monitor_product_btn_setting">设定条件</button>';
    down_btn_html += '<button type="button" id="monitor_product_btn_download_1">运动鞋-生成数据文件</button>';
    down_btn_html += '<button type="button" id="monitor_product_btn_download_2">运动服-生成数据文件</button>';
    down_btn_html += ' </div>';

    function download(filename) {
        var rows = document.getElementsByClassName('ant-table-tbody')[0].childNodes;
        var i;
        var content = '';
        var product,product_link, kpi_1, kpi_2, kpi_3, kpi_4, kpi_5;
        for (i = 0; i < rows.length; i++) {
            product = rows[i].childNodes[0].getElementsByClassName('sycm-goods-td')[0].childNodes[0].getAttribute('title');
          product_link = rows[i].childNodes[0].getElementsByClassName('sycm-goods-td')[0].childNodes[0].getAttribute('href');
            kpi_1 = rows[i].childNodes[1].getElementsByClassName('alife-dt-card-common-table-sortable-value')[0].innerText.replace(/,/g,'');
            kpi_2 = rows[i].childNodes[2].getElementsByClassName('alife-dt-card-common-table-sortable-value')[0].innerText.replace(/,/g,'');
            kpi_3 = rows[i].childNodes[3].getElementsByClassName('alife-dt-card-common-table-sortable-value')[0].innerText.replace(/,/g,'');
            kpi_4 = rows[i].childNodes[4].getElementsByClassName('alife-dt-card-common-table-sortable-value')[0].innerText.replace(/,/g,'');
            kpi_5 = rows[i].childNodes[5].getElementsByClassName('alife-dt-card-common-table-sortable-value')[0].innerText.replace(/,/g,'');
            content = content + product + ',' +product_link + ',' + kpi_1 + ',' + kpi_2 + ',' + kpi_3 + ',' + kpi_4 + ',' + kpi_5 + '\r\n';
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

    $(function() {

        //将以上拼接的html代码插入到网页里的ul标签中
        var div_tag = $(".oui-card-header");
        if (div_tag) {
            div_tag.append(down_btn_html);
            $('#monitor_product_btn_setting').click(function() {
                //将指标设定为指定的5项
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

            $('#monitor_product_btn_download_1').click(function() {
              var curr_time = new Date().getTime();
              var select_date = document.getElementsByClassName('oui-date-picker-current-date')[0].innerText.substring(5,15);
              var store_name = document.getElementsByClassName('ebase-Selector__title')[0].getAttribute('title');
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
              
              var file_name = '竞争商品_' + store + '_运动鞋_' + select_date + '_'+ curr_time + '.csv';
              download(file_name);

            });

            $('#monitor_product_btn_download_2').click(function() {
              var curr_time = new Date().getTime();
              var select_date = document.getElementsByClassName('oui-date-picker-current-date')[0].innerText.substring(5,15);
              var store_name = document.getElementsByClassName('ebase-Selector__title')[0].getAttribute('title');
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
              
              var file_name = '竞争商品_' + store + '_运动服_' + select_date + '_'+ curr_time + '.csv';
              download(file_name);
            });
          
        }
    });

})();