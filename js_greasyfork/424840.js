// ==UserScript==
// @name         拼多多-打单工具-反恶
// @namespace    pdd-zg-print
// @version      0.29
// @description  拼多多反恶-打单工具页面初步排查 自动，0.29:适配页面新版规格和SKU，修改单次页码为20,适配新地址,下一页延迟
// @author       fidcz
// @match        *mms.pinduoduo.com/print/order/list
// @connect      192.168.101.122
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/424840/%E6%8B%BC%E5%A4%9A%E5%A4%9A-%E6%89%93%E5%8D%95%E5%B7%A5%E5%85%B7-%E5%8F%8D%E6%81%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/424840/%E6%8B%BC%E5%A4%9A%E5%A4%9A-%E6%89%93%E5%8D%95%E5%B7%A5%E5%85%B7-%E5%8F%8D%E6%81%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var shopid = ''; // 店铺id: bl,mb,dnt,yys
    var ip_port = '192.168.101.122:5005';
    //var reloadTime = 5; // 自动刷新时间(分钟)

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    async function run2(reloadTime) {
        // 定时刷新
        console.log("开始刷新倒计时");
        await sleep(reloadTime * 60 * 1000);
        console.log("开始定时刷新");
        location.reload();
        //document.querySelector("div[data-reactid='.0.4.0.$waitSend']").click();
        run2(reloadTime);
    }

    async function waitLoat(){
        let waitLoad = $("div[class^='TB_loadingInner']");
        while(waitLoad != null || waitLoad.length > 0){
            //console.log('等待加载框消失...');
            await sleep(800);
            waitLoad = $("div[class^='TB_loadingInner']");
            if(waitLoad == null || waitLoad.length <= 0){
                break;
            }
        }
    }

    async function run(){

        await waitLoat();

        await sleep(1000);

        var shopName = '';
        // 有时右上角信息会消失，查询iframe里的店铺名
        if($("div.desc-block").length > 0){
            // 右上角商家存在
            shopName = $("div.desc-block").children("div").eq(0).text();
        }else{
            shopName = $("iframe").eq(0).contents().find("div.desc-block").children("div").eq(0).text();
        }

        // 获取店铺名称
         
        if(shopName.indexOf('菠萝大药房') != -1){
            // 拼多多菠萝
            shopid = 'bl';
        }else if(shopName.indexOf('菠萝慢病') != -1){
            shopid = 'mb';
        }else if(shopName.indexOf('德年堂') != -1){
            shopid = 'dnt';
        }else if(shopName.indexOf('研医生') != -1){
            shopid = 'yys';
        }else if(shopName.indexOf('药友') != -1){
            shopid = 'yy';
        }else{
            shopid = 'bl';
        }

        console.log('当前店铺: ' + shopid);

        // 点击所有x
        var closeButton = $("i[data-testid='beast-core-icon-close']");
        for(var i=0; i<closeButton.length; i++){
            // 点击所有
            closeButton.eq(i).click();
        }

        console.log('修改页内容数');
        // 修改页内容数
        var selectList = $("div[data-testid='beast-core-select']").filter("[class*='PGT_sizeSelect']");
        selectList.click();

        await sleep(500);
        // 点击50  超过50的无法一次加载完毕
        // 2022-07-27 修改为20每页,疑似一次最多加载21条
        selectList = $("ul[class^='ST_dropdownPanel']").children("li");
        selectList.eq(selectList.length - 5).click();

        //console.log(selectList);
        //$("div[class^='PGT_sizeSelect']").children().click();

        // 开始获取规格和SKU编码位置
        var specsIndex = -1;
        // var skuIndex = -1;
        var buyerInfoIndex = -1;
        var titleElement = $("thead[data-testid='beast-core-table-middle-thead']").children('tr').children('th');
        // 2022-07-27 pdd平台合并套餐规格和SKU编码
        for(var index=0; index<titleElement.length; index++){
            // 遍历获取判断所有的
            try{
                if(titleElement.eq(index).children("span").text().indexOf('规格信息') != -1){
                    // 规格信息
                    specsIndex = index;
                    // break;
                }else if(titleElement.eq(index).children("span").text().indexOf('收件信息') != -1){
                    // 收货人信息
                    buyerInfoIndex = index;
                }
            }catch{}
        }
        if(specsIndex == -1){
            // 有未设置
            alert('未设置规格或SKU编码,请设置后重试');
            return;
        }
        // 默认地址列为3
        if(buyerInfoIndex == -1){
            buyerInfoIndex = 3;
        }

        while(true){
            await waitLoat();

            console.log('加载完毕，开始获取订单数量...');
    
            //console.log($("tbody[data-testid='beast-core-table-middle-tbody']"));
            // 需要等待tbody载入
            var waitTbody = $("tbody[data-testid='beast-core-table-middle-tbody']");
            while(waitTbody == null || waitTbody.length <= 0){
                //console.log('等待加载框消失...');
                await sleep(800);
                waitTbody = $("tbody[data-testid='beast-core-table-middle-tbody']");
                if(waitTbody != null || waitTbody.length > 0){
                    break;
                }
            }
    
            var orderTbody = $("tbody[data-testid='beast-core-table-middle-tbody']").children("tr");
            var orderTimes = Math.ceil(orderTbody.length / 10);
            console.log('总共有' + orderTbody.length + '个订单; 总共需要发送' + orderTimes + '次');

            for(let num=0; num<orderTimes; num++){
                var sendDict = {};
                for(let orderIndex=num*10; orderIndex<num*10+10; orderIndex++){
                    if(orderIndex >= orderTbody.length){
                        break;
                    }
                    // 遍历订单
                    var orderId = orderTbody.eq(orderIndex).find("span.order-sn").text();
                    var buyerName = orderTbody.eq(orderIndex).children("td").eq(buyerInfoIndex).children('div').children('div').eq(0).text().replace('查看', '').split(' | ')[0];
                    var buyerPhone = orderTbody.eq(orderIndex).children("td").eq(buyerInfoIndex).children('div').children('div').eq(0).text().replace('查看', '').split(' | ')[1];
                    var buyerAddr = orderTbody.eq(orderIndex).children("td").eq(buyerInfoIndex).children('div').children('div').eq(1).find('style').next('span').text();
                    // orderTbody.eq(orderIndex).children("td").eq(6).find("style").text('');                     // 删除掉style中多余的文本内容
                    // buyerAddr = buyerAddr + orderTbody.eq(orderIndex).children("td").eq(6).find("div[class^='elli_outerWrapper']").text();
                    // orderTbody.eq(orderIndex).children("td").eq(specsIndex).find("style").text('');
                    var buySpecs = orderTbody.eq(orderIndex).children("td").eq(specsIndex).find('style[data-testid="beast-core-ellipsis-style"]').eq(0).next('span').text();
                    var buySku = orderTbody.eq(orderIndex).children("td").eq(specsIndex).find('style[data-testid="beast-core-ellipsis-style"]').eq(1).next('span').text().replace(/编码[:：]\s?/, '').split('单价:')[0];
                    //console.log(orderId + ': ' + buyerName + ',' + buyerPhone + ',' + buyerAddr);
    
                    sendDict[orderId] = [buyerName, buyerPhone, buyerAddr, buySpecs, buySku];
                    
                }
                console.log(sendDict);
                console.log('第'+ (num + 1) + '次发送');
                var resultStauts = ''
                var resultList = ''
                // 发送获取
                GM_xmlhttpRequest({
                    url: 'http://' + ip_port + '/zg/getpddmost/' + shopid,
                    method: 'POST',
                    data: JSON.stringify(sendDict),
                    onload: (respon)=>{
                        resultList = respon.responseText;
                        resultStauts = '1'
                    },
                    onerror: ()=>{
                        resultStauts = '失败'
                    },
                    ontimeout: ()=>{
                        resultStauts = '超时了'
                    }
                });
                // 等待返回结果
                while(resultStauts == ''){
                    await sleep(800);
                    if(resultStauts != ''){
                        continue;
                    }
                }
        
                if(resultStauts != '1'){
                    alert('获取失败');
                    continue;
                }
                console.log(resultList);
    
            }

            await waitLoat();

            // 判断页面元素数量
            var pageElement = $("ul[data-testid='beast-core-pagination']").children("li");
            if(pageElement.length == 2){
                // 只有一页
                break;
            }else{
                if($("li[data-testid='beast-core-pagination-next']").attr('class').indexOf('disable') != -1){
                    // 有disable
                    break;
                }else{
                    // 没有disable 点击下一页
                    console.log('当前页面查询完毕,开始加载下一页...');
                    await sleep(1500);  // 延迟1.5s再点击下一页
                    $("li[data-testid='beast-core-pagination-next']").click();
                }
            }
        }

        console.log('获取所有页面完毕');
    }

    !async function startRun(){
        await sleep(100);
        console.log('脚本开始运行');
        var d = new Date();
        console.log(d);
        run();
        run2(5);
    }()

})();