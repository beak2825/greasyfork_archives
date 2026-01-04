// ==UserScript==
// @name         天猫反恶
// @namespace    tm_fe_net
// @version      0.24
// @description  天猫订单列表反恶;0.24:修正登录页面，并更新通知方式
// @author       fidcz
// @match        *wuliu.taobao.com/user/order_list_new.htm*
// @match        *myseller.taobao.com/home.htm*
// @match        *error.taobao.com/app/tbhome/common/error*
// @match        *login.taobao.com/member/login*
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @connect      192.168.101.122
// @connect      127.0.0.1
// @connect      trade.tmall.com
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// @require      https://greasyfork.org/scripts/435392-crypto-js-fid/code/crypto-js-fid.js?version=987517
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/429800/%E5%A4%A9%E7%8C%AB%E5%8F%8D%E6%81%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/429800/%E5%A4%A9%E7%8C%AB%E5%8F%8D%E6%81%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /**说明
     * https://wuliu.taobao.com/user/ajax_real_address.do?orderId=   发货中心获取地址
     * https://wuliu.taobao.com/user/ajax_real_address.do?orderId=468301104851&_input_charset=utf-8
     * 发送地址信息格式: 温*元,139****5353,黑龙江省哈尔滨市南岗区*******路***号苹果体验店,-1
     * 2021-09-18 待修改为发货中心获取
     */

    var ip_port = '127.0.0.1:5005';


    // 延迟
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    async function waitAlert(){
        console.log('开始判断小框框');
        var yzTip = true;
        while ($("div[data-reactid='.0.8']").attr("class").indexOf("hidden") == -1 || $("iframe#baxia-dialog-content").length > 0) {
            await sleep(1000);
            if($("iframe#baxia-dialog-content").length > 0 && yzTip){
                // 改为发送消息提醒
                yzTip = false;
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "http://" + ip_port + "/send/dx/天猫反恶需要验证|||需要用你可爱的小手滑一下才能起来",
                    timeout: 2000,
                    onload: (response) => {
                        console.log(response.status)
                    }
                });
            }
            // if($("iframe#baxia-dialog-content").length > 0){
            //     try{
            //         if(document.getElementById("baxia-dialog-content").contentWindow.document.querySelector("span.nc-lang-cnt").innerHTML.indexOf('出错了') != -1){
            //             // 刷新
            //             if(document.getElementById("baxia-dialog-content").contentWindow.document.querySelector("span.nc-lang-cnt").children.length > 0){
            //                 document.getElementById("baxia-dialog-content").contentWindow.document.querySelector("span.nc-lang-cnt").children[0].click();
            //             }

            //         }else{
            //             // 哎呀，出错了，点击<a href="javascript:noCaptcha.reset(1)">刷新</a>再来一次
            //             // console.log(document.getElementById("baxia-dialog-content").contentWindow.document.querySelector("span.nc-lang-cnt").innerHTML);
            //             console.log('出现滑块，开始滑动');
            //             await sleep(5000);
            //             slide();

            //         }
            //         continue;

            //     }catch(err){
            //         console.log('自动滑块失败');
            //         console.log(err);
            //         continue;
            //     }

            // }
            if ($("div[data-reactid='.0.8']").attr("class").indexOf("hidden") != -1) {
                //console.log("小框框藏起来了")
                break;
            }
        }
        console.log('小框框通过');
    }

    async function run2() {
        // 定时刷新
        console.log("开始刷新倒计时");
        await sleep(8 * 60 * 1000);
        console.log("开始定时刷新");
        window.location.href = 'https://wuliu.taobao.com/user/order_list_new.htm?order_status_show=send';
        //document.querySelector("div[data-reactid='.0.5.0.$waitSend']").click();
        run2();
    }

    async function run(){
        // 主运行

        // 首先获取页码数量
        // var nowPage = 1;
        // try{
        //     var allPage = $('div[class="page-top"]').eq(0).children(':not([class])').length + 1;
        // }catch(error){
        //     console.error('获取页码出错：' + error.message)
        // }

        // console.log('遍历所有页码');
        // // 遍历所有页码
        // for(; nowPage <= allPage; nowPage++){
            // 遍历所有订单

            // 获取订单列表1,tbody中的id就是发货id
            //$('table[id="J_Express"]').children('tbody[class="j_expressTbody"]')

        // 获取订单列表的,获取的是订单号元素
        var elements_order = $('span[class="order-number"]');

        // 等待订单加载完毕
        while(elements_order.length <= 0){
            await sleep(200);
            elements_order = $('span[class="order-number"]');
        }

        // 获取每个订单对应的订单号
        // 获取发送test的订单号

        var sendData = {};
        var test_orders = [];

        for(let eleIndex=0; eleIndex<elements_order.length; eleIndex++){
            // 遍历获取所有订单号
            test_orders.push(elements_order.eq(eleIndex).text().replace(/订单编号[:：]/g, ''));
        }

        sendData['test'] = test_orders;
        console.log('发送TEST:');
        console.log(sendData);

        // 准备发送test
        var testResult = {};
        GM_xmlhttpRequest({
            url: 'http://' + ip_port + '/zg/gettbmost',
            data: JSON.stringify(sendData),
            method: 'POST',
            onload: (respon)=>{
                if(respon.status == 200){
                    testResult = JSON.parse(respon.responseText);
                }
            }
        });

        // 等待test处理结果
        while(Object.keys(testResult).length <= 0){
            // 如果TEST没有返回结果就等待
            await sleep(500);
            if(Object.keys(testResult).length > 0){
                break;
            }
        }

        // 输出test结果
        console.log(testResult);

        sendData = {'sku': {}, 'fane': {}};

        for(let eleIndex=0; eleIndex<elements_order.length; eleIndex++){
            // 遍历所有订单元素
            // 订单号
            let orderId = elements_order.eq(eleIndex).text().replace(/订单编号[:：]/g, '');
            // 旺旺id
            let wwId = elements_order.eq(eleIndex).parents('tbody').find('span.ww').text();
            // 快递id
            // let expId = elements_order.eq(eleIndex).siblings('input[name="orderId"]').val();
            // 订单创建时间
            let orderTime = elements_order.eq(eleIndex).siblings('span[class="order-date"]').text().replace('创建时间：', '').trim() + ':00';

            // console.log(orderId + ":" + wwId + ":" + expId);

            if(testResult['fane'].indexOf(orderId) >= 0){
            // if(true){
                // 需要反恶
                // 在线获取地址
                var addr = '';
                // 2021-11-29 修改为使用本地接口获取地址,防止淘宝验证
                // GM_xmlhttpRequest({
                //     url: 'https://wuliu.taobao.com/user/ajax_real_address.do?orderId=' + expId + '&_input_charset=utf-8',
                //     method: 'GET',
                //     onload: (respon)=>{
                //         //console.log(respon.responseText);
                //         try{
                //             let addrData = JSON.parse(respon.responseText)['data'];
                //             if(addrData == ''){
                //                 addrData = 'null';
                //             }else{
                //                 // 删除空格
                //                 addrData = addrData.replace(/\s+/g, '');
                //                 // console.log(addrData);
                //                 let temp_split = addrData.split(',');
                //                 let phone = '';
                //                 let name = '';
                //                 let yb = '';

                //                 for(let index=temp_split.length-1; index>=0; index--){
                //                     if(!phone){
                //                         phone = temp_split[index];
                //                     }else if(!name){
                //                         name = temp_split[index];
                //                     }else if(/^[0-9]{6}$/.test(temp_split[index])){
                //                         yb = temp_split[index];
                //                     }
                //                 }

                //                 // 获取地址
                //                 let temp_addr = trim4Address(addrData.replace(wwId, '').replace(phone, '').replace(name, '').replace(yb, ''))



                //                 // if(temp_split[3] == '' || temp_split[3].length < 11){
                //                 //     // 第四位号码为空
                //                 //     if(temp_split.length > 4){
                //                 //         phone = temp_split[4];
                //                 //     }else{
                //                 //         phone = 'null';
                //                 //     }
                //                 // }else{
                //                 //     phone = temp_split[3];
                //                 // }

                //                 // 处理手机号码
                //                 if(phone != '' && phone != 'null'){
                //                     // 手机号不为空
                //                     if(phone.indexOf('-') == -1){
                //                         // 非电话号码
                //                         if(phone.indexOf('+86') != -1){
                //                             // +86
                //                             phone = phone.replace('+86', '');
                //                         }else if(phone.length == 13 && phone.substr(0, 2) == '86'){
                //                             phone = phone.substr(2, 11);
                //                         }
                //                     }
                //                 }

                //                 addr = name + ',' + phone + ',' + temp_addr + ',-1'
                //             }
                //         }catch(error){
                //             console.error('订单:' + orderId + ',获取地址出错:' + error.message);
                //         }


                //     },
                //     ontimeout: ()=>{
                //         addr = 'timeout';
                //     },
                //     onerror: ()=>{
                //         addr = 'error';
                //     }
                // });

                GM_xmlhttpRequest({
                    url: 'http://' + ip_port + '/zg/addr/' + orderId,
                    method: 'GET',
                    onload: (respon)=>{
                        // 加载成功
                        addr = respon.responseText;
                        if(addr == ''){
                            addr = 'err';
                        }
                    },
                    ontimeout: ()=>{
                        console.log('本地接口获取地址超时');
                        addr = 'err';
                    },
                    onerror: ()=>{
                        console.log('本地接口获取地址出错');
                        addr = 'err';
                    }
                });


                // 等待地址获取完毕
                while(addr == ''){
                    await sleep(200);
                    if(addr != ''){
                        // 全部不为空
                        break;
                    }
                }

                if(addr != 'err'){
                    sendData['fane'][orderId] = [wwId, addr, orderTime, encrypt(addr)];
                }

            }

            if(testResult['sku'].indexOf(orderId) >= 0){
            // if(true){
                // 需要获取SKU

                // 获取商品条目tr
                let itemTr = elements_order.eq(eleIndex).parents('tbody').children('tr:not([class])');
                // console.log(itemTr);
                var skuList = [];
                for(let index=0; index<itemTr.length; index++){
                    // 获取套餐名
                    try{
                        var tc = itemTr.eq(index).find('span[class="attr"]').children('span').text();
                        if(tc == undefined || tc == '') tc = '1盒装-';
                    }catch{
                        var tc = '1盒装-';
                    }
                    // 获取SKU
                    try{
                        var sku = itemTr.eq(index).find('li[class="desc"]').attr('title');
                        if(sku == undefined || sku == '') sku = '未设置';
                    }catch{
                        var sku = '未设置';
                    }
                    // 获取标题
                    try{
                        var title = itemTr.eq(index).find('ul[class="des"]').children('li:not([class])').find('a').attr('title');
                        if(title == undefined || title == '') title = '';
                    }catch{
                        var title = '';
                    }


                    skuList.push([sku, tc, title]);

                }

                sendData['sku'][orderId] = skuList;
            }

            await sleep(750);

        }

        // 发送所有信息
        console.log('准备发送信息');
        console.log(sendData);
        GM_xmlhttpRequest({
            url: 'http://' + ip_port + '/zg/gettbmost',
            data: JSON.stringify(sendData),
            method: 'POST',
            onload: (respon)=>{
                if(respon.status == 200){
                    console.log('发送sendDate结果:');
                    console.log(JSON.parse(respon.responseText));
                }else{
                    console.log('发送sendData失败Code: ' + respon.status);
                }
            },
            ontimeout: ()=>{
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'http://' + ip_port +'/send?title=天猫反恶掉线了&content=获取数据超时&touchfrom=天猫前端反恶&wxchannel=dx&wxmsgtype=textcard'
                });
            }
        });





        // 当前页处理完毕，点击下一页
        await sleep(2000);
        if($('a.page-next').length > 0) $('a.page-next').click();
        await sleep(500);

        // }





    }


    function trim4Address(str){
        /**处理替换 */
        if(str){
            return str.replace(/[\u200B\u3000\u00a0\ufe0f\u202d\u007f\u206b]/g, '').replace(/\s|&nbsp;|，|,|\*/g, '');
        }else{
            return str
        }
    }

    function encrypt(addr){
        /**DES/CBC/p7加密 */
        // 获取信息拼接
        var content = window.location.href.replace(/,/g, '');

        // 处理链接后的时间
        if(content.indexOf('?') >= 0){
            content += '&t=' + Date.now();
        }else{
            content += '?t=' + Date.now();
        }

        // 拼接坐标和用户名
        content += ',' + Math.round(Math.random()*(650-550)+550) + '_' + Math.round(Math.random()*(705-600)+550) + '_70_20,0_0,13729927497,12:' + (Date.now()-800) + ',';

        // 处理地址
        if(addr && addr.length){
            if(addr.substr(0,1) == ','){
                // 地址前缀为空格
                addr = '0';
            }else{
                addr = addr.substr(0,1);
            }
        }else{
            addr = '0';
        }

        content += addr;

        var key = CryptoJS.enc.Utf8.parse('XI55I*!j@25ElR#3');
        var iv = CryptoJS.enc.Utf8.parse('bB70smZn');
        var v = CryptoJS.DES.encrypt(escape(content), key, {
            'iv': iv,
            'mode': CryptoJS.mode.CBC,
            'padding': CryptoJS.pad.Pkcs7
        });

        return v.ciphertext.toString(CryptoJS.enc.Base64);

    }

    async function tryLogin(){
        // 尝试登录
        if($("button[class='fm-button fm-submit ']").length > 0){
            if($("button[class='fm-button fm-submit ']").text() == '快速进入'){
                $("button[class='fm-button fm-submit ']").click();
                return;
            }
        }
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://' + ip_port +'/send?title=天猫反恶掉线了&content=需要重新登录&touchfrom=天猫前端反恶&wxchannel=dx&wxmsgtype=textcard'
        });

    }

    window.onload = function () {
        var d = new Date();
        console.log(d);
        if(/myseller\.taobao\.com\/home\.htm/.test(window.location.href)){
            // 如果是首页，自动跳转
            console.log('当前是店铺主页');
            window.location.href = 'https://wuliu.taobao.com/user/order_list_new.htm';
        }else if(/login\.taobao\.com\/member\/login\.jhtml\?redirectURL=/.test(window.location.href)){
            // 已经登录的登录页面
            console.log('当前是登录页面');
            tryLogin();
        }else if(/error.taobao.com\/app\/tbhome\/common\/error\.html/.test(window.location.href)){
            // 出错页面，重新跳转
            GM_openInTab('https://wuliu.taobao.com/user/order_list_new.htm');
            window.open("about:blank","_self").close();
            // window.location.href = 'https://wuliu.taobao.com/user/order_list_new.htm';
        }else if(/wuliu\.taobao\.com\/user\/order_list_new\.htm/.test(window.location.href)){
            // 如果是订单页开始运行
            console.log('当前是待发货订单页面');
            run();
            run2();
        }

        console.log('主线程执行完毕');
    }
})();