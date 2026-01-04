// ==UserScript==
// @name         拼多多商品数据获取
// @namespace    http://tampermonkey.net/
// @version      2024-05-34
// @description 1.使得点击【登录复制】后可以直接复制，而不用登录; 2.设置整个页面的文本为可选的以及复制。
// @author       逃逸线
// @match        *://mms.pinduoduo.com/goods/goods_list*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pinduoduo.com
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.3/dist/xlsx.full.min.js
// @license MIT
// @description 1.使得点击【登录复制】后可以直接复制，而不用登录; 2.设置整个页面的文本为可选的以及复制。
// @downloadURL https://update.greasyfork.org/scripts/496607/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%95%86%E5%93%81%E6%95%B0%E6%8D%AE%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/496607/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%95%86%E5%93%81%E6%95%B0%E6%8D%AE%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let dataList = [];
    let dataDetail=[];
    function waitForElement(selector, callback) {
        var element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(function() {
                waitForElement(selector, callback);
            }, 500);
        }
    }
    // 尝试等页面元素加载完成
    waitForElement('.batch_operate_batchOperate__1mERa', function(element) {
        // 找到元素后执行您的操作
        return createBtn()
    });

    function createBtn(){
        // 创建按钮元素
        var button = document.createElement('button')
        button.textContent = '下载数据（最大数<30），请先进行筛选，确保不超过30条，刷新请按 F5。';
        button.id = 'downloadButton';

        // 设置按钮样式
        button.style.padding = '10px';
        button.style.backgroundColor = '#3498db';
        button.style.color = '#ffffff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.disabled=false
        var element = document.querySelector('.batch_operate_batchOperate__1mERa');
        element.appendChild(button); //插入按钮


        // 添加点击事件处理程序
        button.addEventListener('click', function() {
            dataList = [];
            var button = document.getElementById('downloadButton');
            button.disabled=true
            button.textContent='请求获取中...'
            button.style.backgroundColor = '#056b00';
             // 经常会变化
            var bottomPGT = document.querySelector('.TB_bottom_5-119-0');

            console.log("111111111111")
            var pageNum=bottomPGT.querySelector('[data-testid="beast-core-select-htmlInput"]')


            // 创建点击事件
            var clikeEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true
            });



            pageNum.dispatchEvent(clikeEvent) //模拟点击页码 弹出下拉选择


            // var dropdown = document.querySelector('.ST_dropdownPanel_5-116-0 '); //下拉组件
            //  var lastChild = dropdown.lastElementChild;
            //  lastChild.dispatchEvent(clikeEvent)
            setTimeout(() => getList(), 2000);
        });
    }

    async function getList(){
        var rows = document.querySelectorAll('[data-testid="beast-core-table-body-tr"]'); //获取表格里的每一行数据
        let i = 0;

        for (let i = 0; i < rows.length; i++) {
            var row=rows[i]
            var tds= row.querySelectorAll('[data-testid="beast-core-table-td"]');
            var id= row.querySelector('.goods-id').children[0].textContent;//商品id

            await getDeatil(id)
            await new Promise(resolve => setTimeout(resolve, 5000)); // 延迟5秒后处理下一个商品


            var pic=row.querySelector('img').src////商品图片
            var goodsName=row.querySelector('.goods-name').textContent//商品标题

            var sumSales=tds[4].children[0].textContent
            var thirtySales=tds[5].children[0].textContent
            var createText=tds[7].textContent
            var createTime
            var operator
            var datetimeRegex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/;
            var match = createText.match(datetimeRegex);


          //  var operatorText =row.querySelector('[data-testid="beast-core-box"]').children[0].children[0].querySelector('span').textContent


            // 检查字符串中是否包含 ':'
         //   if (operatorText.split(':').length>1) {
        //        operator = operatorText.split(':')[1].trim();
        //    } else {
                // 如果不包含 ':'，直接使用整个文本内容
         //       operator = operatorText.trim();
       //     }

            if (match) {
                createTime = match[1]; // 提取匹配到的时间部分
            }

            let obj={}
           obj.链接标题=goodsName
            obj.商品id=id
       //     obj.运营人员=operator
            obj.商品图片=pic
            obj.三十天销量=thirtySales
            obj.总销量=sumSales
            obj.上架时间=createTime
            obj.商品链接="https://mobile.yangkeduo.com/goods.html?goods_id="+id
            dataList.push(obj)
        };
        console.log(dataList)
        console.log(dataDetail)

        var next = document.querySelector('[data-testid="beast-core-pagination-next"]'); // 获取下一页按钮  如果没有下一页终止递归 导出表格
        if(dataList.length>29){
            next=null
        }


        if(!next||next.classList.contains("PGT_disabled_5-119-0")){
            download(dataList,dataDetail)
        }

        else if(next.classList.contains("PGT_next_5-119-0")){
            // 创建点击事件
            var clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
            });
            // 触发点击事件
            next.dispatchEvent(clickEvent);
            var delay = Math.floor(Math.random() * (1000 + 1)) + 500; //  做延迟处理 防止请求过快风控
            setTimeout(() => getList(), delay);
        }
        else{
            alert('脚本出错，请检查！！！')
        }

    }

    async function getDeatil(goods_id){

        // 异步请求的具体实现
        return new Promise(resolve => {
            // 异步操作...
            // 在操作完成后调用 resolve

            var detailUrl = 'https://mms.pinduoduo.com/goods/goods_detail?goods_id='+goods_id+'&page_num=12';
            var newTab = window.open(detailUrl, '_blank');
            if (newTab) {
                newTab.onload = async function() {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    // 等待一段时间确保页面加载完全（可根据实际情况调整）

                    var trs=newTab.document.querySelectorAll('[data-testid="beast-core-table-th"]');
                    var guigeSize
                    var trTitle={}

                    for(var i=0; i<trs.length ;i++){
                        if(trs[i].children[0].textContent=='库存'){
                            guigeSize=i
                        }
                        var titleText = trs[i].children[0].textContent.trim(); // 获取标题文本并去除首尾空格
                        if(titleText=="拼单价(元)"){
                            trTitle['拼单价'] = i
                        }
                        else if(titleText=="单买价(元)"){
                            trTitle['单买价'] = i
                        }
                        else{
                            trTitle[titleText] = i; // 将标题文本作为键，列索引 i 作为值存储到对象中
                        }

                    }


                    // 提取详情页中的内容
                    var rows = newTab.document.querySelectorAll('[data-testid="beast-core-table-body-tr"]');
                    let rowspan
                    let rowIndex

                    for (let i = 0; i < rows.length; i++) {
                        var rowSpan= rows[i].querySelectorAll('[data-testid="beast-core-table-td"]')[0];

                        if(rowSpan.getAttribute('rowspan')>1){
                            rowspan=rowSpan.getAttribute('rowspan')
                            var curSpan=rowSpan
                            rowIndex=i
                            rowSpan.setAttribute('rowspan',1)
                            curSpan.setAttribute('rowspan',1)
                        }

                        let row=rows[i]
                        var tds= row.querySelectorAll('[data-testid="beast-core-table-td"]');
                        if(rowspan>1&&i!=rowIndex){
                            var parentElement = tds[0].parentNode; // 获取第一个 td 元素的父节点

                            // 复制第一个节点的数据
                            var clonedNode = curSpan.cloneNode(true);

                            // 在第一个节点之前插入复制的节点
                            parentElement.insertBefore(clonedNode, tds[0]);
                            tds= row.querySelectorAll('[data-testid="beast-core-table-td"]');
                        }

                        var skuName
                        var promotionPrice
                        var unitPrice
                        var purchasePrice
                        var code
                        var img

                        if(guigeSize==1){
                            skuName=tds[0].children[0].textContent
                        }else{
                            skuName=tds[0].children[0].textContent+tds[1].children[0].textContent          
                        }

                        if(trTitle.活动价){
                            promotionPrice=tds[trTitle.活动价].textContent

                        }

                        unitPrice=tds[trTitle.拼单价].textContent
                        purchasePrice=tds[trTitle.单买价].textContent
                        code=tds[trTitle.规格编码].textContent
                        img=tds[trTitle.规格预览图].querySelector('img').src
                        let obj={}
                        obj.商品id=goods_id
                        obj.sku名称=skuName
                        obj.活动价=promotionPrice
                        obj.拼单价=unitPrice
                        obj.单买价=purchasePrice
                        obj.规格编码=code
                        obj.sku图片=img
                        dataDetail.push(obj)

                    }
                    // 处理详情页内容，例如输出到控制台

                    // 关闭新标签页
                    newTab.close();

                };
            }

            resolve();
        });

    }


    function download(dataList, dataDetail) {
        function exportToExcel(data, sheetName,nullHeader) {
            var headers = Object.keys(data[0]);
            headers = headers.concat(nullHeader);

            var rows = data.map(obj => {
                var row = headers.map(header => {
                    if (Array.isArray(nullHeader) && nullHeader.includes(header)) {
                        return ''; // 空白值
                    } else {
                        return obj[header];
                    }
                });
                return row;
            });


            var workbook = XLSX.utils.book_new();
            var worksheet = XLSX.utils.aoa_to_sheet([headers].concat(rows));
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

            var xlsxData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            var blob = new Blob([xlsxData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            var today = new Date();
            var formattedDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            link.download = 'PDD' +formattedDate+ sheetName + '.xlsx';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        var dataListNullHeader=["款式编码","保本投产比","预设投产比","前置利润率","运营人员"]
        var dataDetailNullHeader=["利润率"]

        exportToExcel(dataList, '商品数据',dataListNullHeader);
        exportToExcel(dataDetail, 'sku数据',dataDetailNullHeader);

        var button = document.getElementById('downloadButton');
        button.disabled = false;
        button.textContent =  '下载数据（最大数<30），请先进行筛选，确保不超过30条，刷新请按 F5。';
        button.style.backgroundColor = '#3498db';
   
 }

})();