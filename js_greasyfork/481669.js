// ==UserScript==
// @name         MT_GOODS_INFO_DOWNLOAD
// @namespace    spider
// @version      1.1.7
// @description  下载网页上的商品基本信息和图片信息，并保存到一个excel文件汇总
// @author       flying
// @match        https://h5.waimai.meituan.com/waimai/mindex/menu*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/481669/MT_GOODS_INFO_DOWNLOAD.user.js
// @updateURL https://update.greasyfork.org/scripts/481669/MT_GOODS_INFO_DOWNLOAD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var spuMap = new Map(); // 创建一个新的Map对象来存储spu name和品类的关系
    var shop_name; //门店名称

    // 创建下载按钮
    var downloadButton = document.createElement('div');
    downloadButton.innerHTML = '下载信息';
    downloadButton.style.position = 'fixed';
    downloadButton.style.top = '10px';
    downloadButton.style.right = '10px';
    downloadButton.style.zIndex = '9999';
    downloadButton.style.backgroundColor = '#fff';
    downloadButton.style.padding = '10px';
    document.body.appendChild(downloadButton);

    downloadButton.addEventListener('click', function() {
        //滚到底部 --待确认功能 目前还需要手动划到底部
        //scrollToBottom();

        // 等待3秒，让页面的图片充分加载完成
        setTimeout(downloadInfo, 3000);
    });

    function scrollToBottom() {
        var distance = document.documentElement.offsetHeight - window.innerHeight;
        var scrollInterval = setInterval(function() {
            window.scrollBy(0, 50);
            if (window.pageYOffset >= distance) {
                clearInterval(scrollInterval);
                // 等待图片加载完成
                setTimeout(downloadImages, 3000);
            }
        }, 100);
    }

    // 点击下载按钮时执行下载操作
    function downloadInfo(){

        createSpu2CategaryMap();

        shop_name = document.querySelector('.title_X4W1xy').textContent;

        var data = [];
        var rows = document.querySelectorAll('dd[data-tag="spu"]');
        rows.forEach(function(row) {
            var item = {};
            var nameElement = row.querySelector('.name_hTGUTi');
            var unitElement = row.querySelector('.unit_tMOCKq');
            var descElement = row.querySelector('.subInfo_M4eCI1 .desc_JKp2Zf');
            var soldElement = row.querySelector('.mtsi-num');
            var imageElement = row.querySelector('.imgTag_M6x_zl');
            var priceElement = row.querySelector('.cprice_RfVnJ3');
            var estimateElement = row.querySelectorAll('.price_EwEf0X span');


            item.good_name = nameElement ? nameElement.textContent : '';
            item.unit = unitElement ? unitElement.textContent : '';
            item.desc = descElement ? descElement.textContent : '';
            item.sales_num = soldElement ? soldElement.textContent : '';
            item.pic_url = imageElement ? imageElement.getAttribute('src') : '';
            item.sale_price = priceElement ? priceElement.textContent.replace('¥', '') : '';
            item.estimate_price = estimateElement.length > 0 ? estimateElement[1].textContent : '';

         //   console.log(item.good_name + ',' + item.unit + ',' +item.desc+','+ item.sale_price + ',' + item.estimate_price + ',' + item.sales_num + ',' + item.pic_url );
            console.log(item.good_name + ',' +item.desc);


            data.push(item);
        });

        saveCsv(data);
     
    }

    function saveCsv(data){
        // 创建excel文件
        //var csvContent = '序号,品类,商品名,规格,价格,到手预估,销量,描诉\n';
        var csvContent = ',分类名称,商品名称,规格名称,价格,当前库存,每日库存,自动补足库存,餐盒数量,餐盒价格,UPC码,SKU码,位置码,单位,最小购买量,属性,描述\n';


        data.forEach(function(item, index) {
            let categary = spuMap.get(item.good_name)
            let desc = item.desc.replace(/\n/g, "");
           // csvContent += (index + 1) + ','   + categary + ','+ item.good_name + ',' + item.unit + ',' + item.sale_price + ',' + item.estimate_price + ',' + item.sales_num + ',' + desc + '\n';

            csvContent += (index + 1) + ','
                + categary + ','
                + ( item.good_name ? item.good_name : '') + ','
                + ( item.unit ? item.unit : '') + ','

                + ( item.sale_price ? item.sale_price : '') + ','
                + ( item.stock ? item.stock : '') + ','
                + ( item.daily_stock ? item.daily_stock : '') + ','
                + ( item.auto_replenish ? item.auto_replenish : '') + ','

                + ( item.box_quantity ? item.box_quantity : '') + ','
                + ( item.box_price ? item.box_price : '') + ','
                + ( item.upd_code ? item.upd_code : '') + ','
                + ( item.sku_code ? item.sku_code : '') + ','
                + ( item.location_code ? item.location_code : '') + ','

                + ( item.spec_name ? item.spec_name : '') + ','
                + ( item.min_purchase ? item.min_purchase : '') + ','
                + ( item.attributes ? item.attributes : '') + ','
                + ( desc ? desc : '') + '\n';

            downlaodImage(item.pic_url,item.good_name)
        });

        // 添加UTF-8的BOM
        var BOM = "\uFEFF";
        csvContent = BOM + csvContent;

        // 下载excel文件
        var encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
        var link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', shop_name +'.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }



     function downlaodImage(pic_url,good_name){
        if(!pic_url) {
            return ;
        }
        var parts = pic_url.split("@"); //获得真实图片地址
        var processed_url = parts[0];

        var pic_name= good_name.replace(/_+$/,"");

        setTimeout(function () {
            GM_download(processed_url, pic_name + '.jpg');
        }, 2000); // 间隔2000毫秒下载
    }


    //创建spuName和品类的映射关系
    function createSpu2CategaryMap(){
        var dlList = document.getElementsByTagName("dl"); // 获取所有dl元素

        for (var i = 0; i < dlList.length; i++) { // 遍历所有dl元素
            var dl = dlList[i];
            var titleBar = dl.getElementsByClassName("titleBar__TkU8j")[0].innerText; // 获取titleBar的值
            var spuList = dl.getElementsByClassName("spu_s6NtPr"); // 获取所有spu元素

            for (var j = 0; j < spuList.length; j++) { // 遍历所有spu元素
                var spu = spuList[j];
                var name = spu.getElementsByClassName("name_hTGUTi")[0].innerText; // 获取spu name的值
                spuMap.set(name, titleBar); // 将spu name和titleBar的关系存储到Map中
            }
        }

        // 现在你可以通过spu name来获取对应的titleBar的值，例如：
        // var title = spuMap.get("镇店腊味四宝煲仔饭");
    }

})();
