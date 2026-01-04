// ==UserScript==
// @name         京东反恶
// @namespace    jd-zg
// @version      0.42
// @description  京东反恶待出库订单0.42:去除非处方药重复判断
// @author       fidcz
// @match        *porder.shop.jd.com/order/orderlist/waitOut*
// @connect      192.168.101.122
// @connect      127.0.0.1
// @connect      shop.jd.com
// @connect      jd.com
// @connect      item.jkcsjd.com
// @grant        GM_xmlhttpRequest
// @grant        window.focus
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/424951/%E4%BA%AC%E4%B8%9C%E5%8F%8D%E6%81%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/424951/%E4%BA%AC%E4%B8%9C%E5%8F%8D%E6%81%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var ip_port = '192.168.101.122:5005'
    // Your code here...

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    async function waitAlert() {
        // 等待加载动画完毕
        var kkClass = $('div.ivu-loading-bar').css('display');
        while (kkClass == 'block') {
            await sleep(800);
            kkClass = $('div.ivu-loading-bar').css('display');
            if (kkClass != 'block') {
                //console.log("小框框藏起来了")
                break;
            }
        }
    }

    async function autoReload(reloadTime) {
        // 定时刷新
        console.log("开始刷新倒计时: " + reloadTime + "分");
        await sleep(reloadTime * 60 * 1000);
        // console.log("开始定时刷新");
        location.reload();
        //document.querySelector("div[data-reactid='.0.4.0.$waitSend']").click();
        autoReload(10);
    }


    // 主运行
    async function run() {
        window.focus();
        // 页面列表
        var pageList = $("ul.ivu-page").children("li");
        // 点击最后一页
        pageList[pageList.length - 2].click();
        // 等待动画加载完毕
        await waitAlert();

        while (true) {
            await waitAlert();

            // 等待订单加载
            while ($(".orderid-mr10").length <= 0) {
                await sleep(500);
                // 如果这里无限重复代表没有订单
                if ($(".orderid-mr10").length > 0) {
                    break;
                }
            }

            // 获取所有订单列表
            var orderIdList = $(".orderid-mr10");

            // $(".orderid-mr10").closest("div.shopweb-table").find("div.dongdong").children("p").eq(1).text()

            // 遍历所有订单号，获取准备发送test
            var sendData = {};
            var orderDivs = {};
            var testList = [];
            for (let index = 0; index < orderIdList.length; index++) {
                testList.push(orderIdList.eq(index).text());
                orderDivs[orderIdList.eq(index).text()] = orderIdList.eq(index).closest("div.shopweb-table");
            }
            sendData['test'] = testList

            // 发送test
            var testResult = {};
            console.log('发送TEST:');
            console.log(sendData);
            GM_xmlhttpRequest({
                url: 'http://' + ip_port + '/zg/getjdmost',
                data: JSON.stringify(sendData),
                method: 'POST',
                onload: (respon) => {
                    if (respon.status == 200) {
                        testResult = JSON.parse(respon.responseText);
                    }
                }
            });

            while (Object.keys(testResult).length <= 0) {
                // 如果TEST没有返回结果就等待
                await sleep(500);
                if (Object.keys(testResult).length > 0) {
                    break;
                }
            }

            console.log(testResult);

            sendData = { 'sku': {}, 'fane': {} };
            // 遍历订单Div列表
            for (let orderDiv in orderDivs) {
                // 获取订单号和咚咚
                var orderId = orderDivs[orderDiv].find(".orderid-mr10").text();
                var dongdong = orderDivs[orderDiv].find("div.dongdong").children("p").eq(1).text();
                dongdong = dongdong.replace(/(^\s*)|(\s*$)/g, "");

                if (testResult['fane'].indexOf(orderId) >= 0) {
                    // 需要反恶
                    // 获取手机号
                    var phone = '';
                    GM_xmlhttpRequest({
                        url: 'https://porder.shop.jd.com/order/global/viewOrderMobile?orderId=' + orderId,
                        method: 'GET',
                        onload: (respon) => {
                            //console.log(respon.responseText);
                            phone = JSON.parse(respon.responseText)['phone'];
                            if (phone == '') {
                                phone = JSON.parse(respon.responseText)['tel'];
                                if (phone == '') {
                                    phone = 'null';
                                }
                            }

                        },
                        ontimeout: () => {
                            phone = 'timeout';
                        },
                        onerror: () => {
                            phone = 'error';
                        }
                    });

                    // 获取地址
                    var addr = '';
                    var name = '';

                    GM_xmlhttpRequest({
                        url: 'https://porder.shop.jd.com/order/global/getConsigneeInfo?orderId=' + orderId,
                        method: 'GET',
                        onload: (respon) => {
                            //console.log(respon.responseText);
                            addr = JSON.parse(respon.responseText)['model']['consigneeInfo']['address'];
                            name = JSON.parse(respon.responseText)['model']['consigneeInfo']['name'];
                            if (addr == '') {
                                addr = JSON.parse(respon.responseText)['tel'];
                                if (addr == '') {
                                    addr = 'null';
                                }
                            }

                        },
                        ontimeout: () => {
                            addr = 'timeout';
                            name = 'timeout';
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: 'https://' + ip_port + '/send/dx/京东反恶获取客户信息超时'
                            });
                        },
                        onerror: () => {
                            addr = 'error';
                            name = 'error';
                        }
                    });


                    // 等待获取完毕
                    while (addr == '' || name == '' || phone == '') {
                        await sleep(200);
                        if (addr != '' && name != '' && phone != '') {
                            // 全部不为空
                            break;
                        }
                    }

                    var buyerInfo = name + ',' + phone + ',' + addr + ',-1'
                    sendData['fane'][orderId] = [dongdong, buyerInfo]
                    // 反恶获取完毕
                }

                if (testResult['sku'].indexOf(orderId) >= 0) {
                    // 需要获取SKU
                    // 根据订单下明细浏览网页，网页获取是否处方药和各种id
                    // 根据id访问商品编辑页面，获取套餐对应SKU
                    /**
                     * 2021-11-12 修改获取方法为搜索商品编辑页
                     */
                    var orderDetailTrs = orderDivs[orderDiv].find("tbody.shopweb-table-tbody").children("tr");
                    var skuList = [];
                    for (let detailIndex = 0; detailIndex < orderDetailTrs.length; detailIndex++) {
                        // 遍历每个商品
                        // 获取商品链接
                        var itemUrl = orderDetailTrs.eq(detailIndex).find("div.commodity_dli").children("a").attr("href");
                        if (itemUrl.substring(0, 2) == '//') {
                            // 链接前段加上https
                            itemUrl = 'https:' + itemUrl;
                        }

                        // 访问商品链接
                        // \scat-3-(\d{1,7})\scat-4-(\d*)\sitem-\d{5,25}
                        var ypCat3 = '';  // 三级类目
                        var ypCat4 = '';  // 四级类目
                        var ypSkuid = /\d{5,15}/.exec(itemUrl)[0]; // 京东SKU
                        var ypPid = '';   // pid
                        var isCf = '';    // 处方类型
                        var sku = '';
                        var tc = '';
                        var ypCfStatus = false;  // 是否完全获取处方信息
                        /* 2021-09-16 修改为直接通过修改商品获取信息 */

                        // 1.搜索在售商品

                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: 'https://ware.shop.jd.com/rest/ware/list/search',
                            headers: {
                                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                                //'cookie': 'language=zh_CN; __jdv=56585130|direct|-|none|-|1630745714367; pinId=asvbsw2tB_kkqNAf7jYWGQ; pin=%E8%8F%A0%E8%90%9D%E8%8D%AF%E5%B8%8802; unick=%E8%8F%A0%E8%90%9D%E8%8D%AF%E5%B8%8802; _tp=iJHO1KUT1WsYStdGqyyUYUbn%2FO0NJgW3BjCIE7PcgwTpPKthKmHnh4EnbmNjV1y8; _pst=%E8%8F%A0%E8%90%9D%E8%8D%AF%E5%B8%8802; TrackID=1qCH3h_w7KYps0l2r-g8Vawebrz1jvlLEglDyt3WUu1OpzTRQtkBd0xpydWweuzJK4ctLy1FAHetiabmw4VEsUk6HENVtqyUbOtgN8GAtFlM; ceshi3.com=000; _vender_=TNK3O6PALVQGHRI5TU3CFMYHR2GLX3PO5OP6R6V37QCTECFKDWRE5RJ6KSCMVVQQ5YP6KQOIJQYBKV2I5HXF6TM2OLXCOHMMX6RUXWD3SD6HH7S5D4VP7CZASBATHXGWHBKROSKNBUHNCKZLOAE4BUCUZ7UNGG4ZZ5BUKDLB4HESFASS5BEE4IGAZWUMUEF3RZDIHZ4H6QB73QTTZFKFAM2LWWRZH65Z6C5XKDMQQCZD6R72KBKNNWCITHQ32SVZKLN526Z2KM5T3DCVCND4YAK4AZMYIVI7ULYSDQD34K63YVC2TN5CPHRMXE7IQ6FROB435A55KHLOOQSZJQLY4R6MXQJHYXKEV6DFSTYET4S3K4MSIDHYASEKA7SG6LJSRN63HAW554GZVREIKMQHQAC5IUOFHLGXCCSGA356JVHENGQRZULRDC35OONJCFTROGKKKV2WQVCB4JRYRBOMWGBWLI54R5PAXPC62DI; csrf_token=ad230195-2bfe-4670-bcd6-e42d0480f9d7; shshshfp=ff76ed04faa44cae6bcb9f74e150b5d2; shshshfpa=b58a1bb3-c53b-97cb-a4a8-f1af35e997a2-1631756429; shshshfpb=qKzwpvd3u2XwCZodvkW1nug%3D%3D; areaId=19; ipLoc-djd=19-1655-4886-0; __jdu=16307457143651527862252; _BELONG_CLIENT_=WPSC4XJXWK5USS4JNZY2X7VRLR5MCBKRSVHEXABGTHDGISIQK5YOLZUXYE7IOIM7MOKO74H6CRN6WHAAR4TMDV3XZWMXZRCRT5XRNE3V356BTOB2Y7LPK66VWQK6HPTGWVXIDXDCPVE3W5WMHAIO6AT2LX2XXVNUCXR34ZWFK6HY45CORGIKOSYDYZBF27WOKTUX6BS4FZMIJWNUX6CB4JAA25ZLF7ZEKYOO4QV5HTSBXGNRM3E242MBI6V5D4C5VJDQ3EOYCOW5BMTUJZACIBHXQFAVLRF76VQY5PNJGGJNBEZHSFYYJA3YORRT7FB5AHCOIFQKF3W5RWNUX6CB4JAA26JNMO7AYWNUPZF5HTSBXGNRM3E242MBI6V5D4C5VJDQ3EOYCOW5BWZDKMOJ5BS6II53ERY6ALV3ZWPF42L4CPUHEGPYIII35KDC4FCNVCORCXFD6IVNLBEDPB2GGP4UHWNRUDOQBDIW7RZJXBA2WV5ANZOTEGUCDWYRVQS2YUTIZNZ276PRYG4N56V6YTII7MBKBC7LYHO7C555HTSBXGNRM3E466AYN67DHWVM5HQFJ4NFDO5BTOGH5TKKZOWCOX7SUUJISLNPRGI; _base_=YKH2KDFHMOZBLCUV7NSRBWQUJPBI7JIMU5R3EFJ5UDHJ5LCU7R2NILKK5UJ6GLA2RGYT464UKXAI5KK7PNC5B5UHJ2HVQ4ENFP57OCYENRXDGB7ETIBTXQZFQH3G3N3TTCNE6YVKRXISU2GZTCURBNWRJ6S3GKYL2ZCNGXSSG4SOQWCP5WPWO6EFS7HEHMRWVKBRVHB33TFD46U4AZWPHSMOZ4VPLMCUPICAG56KT47K7XGVE7YCKG56TWAYX6AUIDNNVKQBHDZTEGTVVVDPUXA6G6B7T2MEDZYGN7LDJKXDEVH7G4OZZZJYSJEAJFZVLPJTB2UQKU2MMU3NUMAMLLWUHS7XFLXQUMNDJOEMSS3BELAJDGORCTTM2NWQ2EFXTHKDHHYQA7AW6; _vender_new_=GI63BGTJFDBQ4HFUWAXEULAOADZUMX2LEBA6GOSA3LNKUAJY6MZCAWFSLKPCOJOCCH3WDQKLW322IWUJZZYDAQY72RE7Z2MXJ2D3BUIJB467POZEGXWS2K463PTNIRXVW2UKAKHR5KOGIYGEMOCATRNMRJN7IWNCU7A2GUQGF56KZM5TAQ7IPXCWJFNZQAJPEUN35HMBRP4BIQG23KVACOHTGINHLLKG7JOB4N4D7HUYIHTQM36QGHGNOY4GVMNU624YWAGMQEQTIZESBPZPNK2JBXPOM4PLEUSSJS7FWEPUDVMGYGYVIV52HTK2ABNOLAOEUTT7NHPRK4LDIQUHLIXBSCO3F74TDXIVHQSTNWRQBRNO2Q6EVKRMGAOVMUAWTWZP7EY52FJ4EU3NUMAMLLWUHQWDTQ3AKKOSL3RHHEYQ6G3P7G3SBY2S6GY5EQUYVPRNK46HWS3OMC7F3OW4SC4VOVUTNWJ7CDQWKB4DNBMTTV34NZFVPXP6BOGKFEPKVBYLB6LFFOC22LEO6GINUVE5KWIIILJXZCXT62764UNQY65AQVHC4EUMIOKZH6RHGLANXZVQHOIEG3MSPGIM4YY2YLFBNXUBPAEVOV7VG2ZZ2GDPEPGNZ7L3QJXV5QPVZ5VEOIBIQ6LXXPFUGBBBZNFVV5LPA7TIR4L2GKY; b-sec=PVTGABYXGY6M5BUP7EFTZJBARSP6RSX7BGM6ILGK4SJ4KZML6TSUL36OF4BAE5VHX26ES3FD5CQWC; thor=BF71F8A0947F0F9B8B5B977398887F5257F346538ED6B319F0D8D2D23811159DF11BF10A5CCCE1D0FD83F650689CE688259A3BB1C69F73A41AC15DF72825777A0B3883C0E17887DF9548E535AE95B4A1BFCD1FD8C66510D36C385BC0A2058DDD35DCAE396BC33AAED295BF655BE9C0F1D74F6C12A6944BA9F1F8B66D82761DA8; __jda=122270672.16307457143651527862252.1630745714.1631665434.1631752133.17; __jdb=122270672.90.16307457143651527862252|17.1631752133; __jdc=122270672; 3AB9D23F7A4B3C9B=VNPNVIH5NCL4GTMOJSXNW2WKG6HASH2OROG2KSLGKNGXWJB2XX7LP5SOOYNINVJOU755PAYNR3P4ONPAUTBYMTA7RQ',
                                'content-type': 'application/json;charset=UTF-8'
                            },
                            data: JSON.stringify({ 'brandId': '', 'categoryId': '', 'colType': '', 'hasImage': '', 'imei': '', 'itemNum': '', 'jdPriceHighString': '', 'jdPriceLowString': '', 'multiCategoryId': '', 'orderBy': 'onsaletime,desc', 'page': '1', 'pageSize': '2', 'skuId': ypSkuid, 'stockNumHigh': '', 'stockNumLow': '', 'wareId': '', 'wareName': '', 'wareStatusStr': 'onSale' }),
                            onload: (response) => {
                                try {
                                    let temp_data = JSON.parse(response.responseText);

                                    console.log(ypSkuid + ':Search onSale result Num:' + temp_data['data']['data'].length);
                                    ypPid = temp_data['data']['data'][0]['ware']['wareId'];
                                    ypCat3 = temp_data['data']['data'][0]['ware']['categoryId'];
                                    try {
                                        // 如果cat4获取出错默认和3一致
                                        ypCat4 = temp_data['data']['data'][0]['ware']['multiCategoryId'];
                                    } catch {
                                        ypCat4 = ypCat3;
                                    }

                                } catch (error) {
                                    // 报错，出售中的宝贝搜索无结果;搜索待出售中的宝贝
                                    console.log('搜索在售出错,' + ypSkuid + ',' + error.message);
                                    GM_xmlhttpRequest({
                                        method: 'POST',
                                        url: 'https://ware.shop.jd.com/rest/ware/list/search',
                                        headers: {
                                            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                                            //'cookie': 'language=zh_CN; __jdv=56585130|direct|-|none|-|1630745714367; pinId=asvbsw2tB_kkqNAf7jYWGQ; pin=%E8%8F%A0%E8%90%9D%E8%8D%AF%E5%B8%8802; unick=%E8%8F%A0%E8%90%9D%E8%8D%AF%E5%B8%8802; _tp=iJHO1KUT1WsYStdGqyyUYUbn%2FO0NJgW3BjCIE7PcgwTpPKthKmHnh4EnbmNjV1y8; _pst=%E8%8F%A0%E8%90%9D%E8%8D%AF%E5%B8%8802; TrackID=1qCH3h_w7KYps0l2r-g8Vawebrz1jvlLEglDyt3WUu1OpzTRQtkBd0xpydWweuzJK4ctLy1FAHetiabmw4VEsUk6HENVtqyUbOtgN8GAtFlM; ceshi3.com=000; _vender_=TNK3O6PALVQGHRI5TU3CFMYHR2GLX3PO5OP6R6V37QCTECFKDWRE5RJ6KSCMVVQQ5YP6KQOIJQYBKV2I5HXF6TM2OLXCOHMMX6RUXWD3SD6HH7S5D4VP7CZASBATHXGWHBKROSKNBUHNCKZLOAE4BUCUZ7UNGG4ZZ5BUKDLB4HESFASS5BEE4IGAZWUMUEF3RZDIHZ4H6QB73QTTZFKFAM2LWWRZH65Z6C5XKDMQQCZD6R72KBKNNWCITHQ32SVZKLN526Z2KM5T3DCVCND4YAK4AZMYIVI7ULYSDQD34K63YVC2TN5CPHRMXE7IQ6FROB435A55KHLOOQSZJQLY4R6MXQJHYXKEV6DFSTYET4S3K4MSIDHYASEKA7SG6LJSRN63HAW554GZVREIKMQHQAC5IUOFHLGXCCSGA356JVHENGQRZULRDC35OONJCFTROGKKKV2WQVCB4JRYRBOMWGBWLI54R5PAXPC62DI; csrf_token=ad230195-2bfe-4670-bcd6-e42d0480f9d7; shshshfp=ff76ed04faa44cae6bcb9f74e150b5d2; shshshfpa=b58a1bb3-c53b-97cb-a4a8-f1af35e997a2-1631756429; shshshfpb=qKzwpvd3u2XwCZodvkW1nug%3D%3D; areaId=19; ipLoc-djd=19-1655-4886-0; __jdu=16307457143651527862252; _BELONG_CLIENT_=WPSC4XJXWK5USS4JNZY2X7VRLR5MCBKRSVHEXABGTHDGISIQK5YOLZUXYE7IOIM7MOKO74H6CRN6WHAAR4TMDV3XZWMXZRCRT5XRNE3V356BTOB2Y7LPK66VWQK6HPTGWVXIDXDCPVE3W5WMHAIO6AT2LX2XXVNUCXR34ZWFK6HY45CORGIKOSYDYZBF27WOKTUX6BS4FZMIJWNUX6CB4JAA25ZLF7ZEKYOO4QV5HTSBXGNRM3E242MBI6V5D4C5VJDQ3EOYCOW5BMTUJZACIBHXQFAVLRF76VQY5PNJGGJNBEZHSFYYJA3YORRT7FB5AHCOIFQKF3W5RWNUX6CB4JAA26JNMO7AYWNUPZF5HTSBXGNRM3E242MBI6V5D4C5VJDQ3EOYCOW5BWZDKMOJ5BS6II53ERY6ALV3ZWPF42L4CPUHEGPYIII35KDC4FCNVCORCXFD6IVNLBEDPB2GGP4UHWNRUDOQBDIW7RZJXBA2WV5ANZOTEGUCDWYRVQS2YUTIZNZ276PRYG4N56V6YTII7MBKBC7LYHO7C555HTSBXGNRM3E466AYN67DHWVM5HQFJ4NFDO5BTOGH5TKKZOWCOX7SUUJISLNPRGI; _base_=YKH2KDFHMOZBLCUV7NSRBWQUJPBI7JIMU5R3EFJ5UDHJ5LCU7R2NILKK5UJ6GLA2RGYT464UKXAI5KK7PNC5B5UHJ2HVQ4ENFP57OCYENRXDGB7ETIBTXQZFQH3G3N3TTCNE6YVKRXISU2GZTCURBNWRJ6S3GKYL2ZCNGXSSG4SOQWCP5WPWO6EFS7HEHMRWVKBRVHB33TFD46U4AZWPHSMOZ4VPLMCUPICAG56KT47K7XGVE7YCKG56TWAYX6AUIDNNVKQBHDZTEGTVVVDPUXA6G6B7T2MEDZYGN7LDJKXDEVH7G4OZZZJYSJEAJFZVLPJTB2UQKU2MMU3NUMAMLLWUHS7XFLXQUMNDJOEMSS3BELAJDGORCTTM2NWQ2EFXTHKDHHYQA7AW6; _vender_new_=GI63BGTJFDBQ4HFUWAXEULAOADZUMX2LEBA6GOSA3LNKUAJY6MZCAWFSLKPCOJOCCH3WDQKLW322IWUJZZYDAQY72RE7Z2MXJ2D3BUIJB467POZEGXWS2K463PTNIRXVW2UKAKHR5KOGIYGEMOCATRNMRJN7IWNCU7A2GUQGF56KZM5TAQ7IPXCWJFNZQAJPEUN35HMBRP4BIQG23KVACOHTGINHLLKG7JOB4N4D7HUYIHTQM36QGHGNOY4GVMNU624YWAGMQEQTIZESBPZPNK2JBXPOM4PLEUSSJS7FWEPUDVMGYGYVIV52HTK2ABNOLAOEUTT7NHPRK4LDIQUHLIXBSCO3F74TDXIVHQSTNWRQBRNO2Q6EVKRMGAOVMUAWTWZP7EY52FJ4EU3NUMAMLLWUHQWDTQ3AKKOSL3RHHEYQ6G3P7G3SBY2S6GY5EQUYVPRNK46HWS3OMC7F3OW4SC4VOVUTNWJ7CDQWKB4DNBMTTV34NZFVPXP6BOGKFEPKVBYLB6LFFOC22LEO6GINUVE5KWIIILJXZCXT62764UNQY65AQVHC4EUMIOKZH6RHGLANXZVQHOIEG3MSPGIM4YY2YLFBNXUBPAEVOV7VG2ZZ2GDPEPGNZ7L3QJXV5QPVZ5VEOIBIQ6LXXPFUGBBBZNFVV5LPA7TIR4L2GKY; b-sec=PVTGABYXGY6M5BUP7EFTZJBARSP6RSX7BGM6ILGK4SJ4KZML6TSUL36OF4BAE5VHX26ES3FD5CQWC; thor=BF71F8A0947F0F9B8B5B977398887F5257F346538ED6B319F0D8D2D23811159DF11BF10A5CCCE1D0FD83F650689CE688259A3BB1C69F73A41AC15DF72825777A0B3883C0E17887DF9548E535AE95B4A1BFCD1FD8C66510D36C385BC0A2058DDD35DCAE396BC33AAED295BF655BE9C0F1D74F6C12A6944BA9F1F8B66D82761DA8; __jda=122270672.16307457143651527862252.1630745714.1631665434.1631752133.17; __jdb=122270672.90.16307457143651527862252|17.1631752133; __jdc=122270672; 3AB9D23F7A4B3C9B=VNPNVIH5NCL4GTMOJSXNW2WKG6HASH2OROG2KSLGKNGXWJB2XX7LP5SOOYNINVJOU755PAYNR3P4ONPAUTBYMTA7RQ',
                                            'content-type': 'application/json;charset=UTF-8'
                                        },
                                        data: JSON.stringify({ 'brandId': '', 'categoryId': '', 'colType': '', 'hasImage': '', 'imei': '', 'itemNum': '', 'jdPriceHighString': '', 'jdPriceLowString': '', 'multiCategoryId': '', 'orderBy': 'forsaletime,desc', 'page': '1', 'pageSize': '2', 'skuId': ypSkuid, 'stockNumHigh': '', 'stockNumLow': '', 'wareId': '', 'wareName': '', 'wareStatusStr': 'forSale' }),
                                        onload: (response) => {
                                            try {
                                                let temp_data = JSON.parse(response.responseText);

                                                console.log(ypSkuid + ':Search forSale result Num:' + temp_data['data']['data'].length);
                                                ypPid = temp_data['data']['data'][0]['ware']['wareId'];
                                                ypCat3 = temp_data['data']['data'][0]['ware']['categoryId'];
                                                try {
                                                    // 如果cat4获取出错默认和3一致
                                                    ypCat4 = temp_data['data']['data'][0]['ware']['multiCategoryId'];
                                                } catch {
                                                    ypCat4 = ypCat3;
                                                }

                                            } catch {
                                                if (response.responseText.indexOf('您没有该功能的操作权限') != -1) {
                                                    // 无权限提醒
                                                    ypCat3 = '无权限';
                                                    ypCat4 = '无权限';
                                                }
                                                // 报错，获取失败
                                                ypCat3 = '-1';
                                                ypCat4 = '-1';
                                            }

                                        },
                                        onerror: () => {
                                            console.log(ypSkuid + ":search forSale Error");
                                            ypCat3 = '-1';
                                            ypCat4 = '-1';
                                        },
                                        ontimeout: () => {
                                            console.log(ypSkuid + ":search forSale Timeout");
                                            ypCat3 = '-1';
                                            ypCat4 = '-1';
                                        }
                                    });
                                }

                            },
                            onerror: () => {
                                console.log(ypSkuid + ":search onSale Error");
                                ypCat3 = '-1';
                                ypCat4 = '-1';
                            },
                            ontimeout: () => {
                                console.log(ypSkuid + ":search onSale Timeout");
                                ypCat3 = '-1';
                                ypCat4 = '-1';
                            }
                        });

                        // 等待sku获取完毕
                        // 等待获取完毕
                        while (ypCat3 == '') {
                            await sleep(200);
                            if (ypCat3 != '') {
                                // 全部不为空
                                break;
                            }
                        }

                        if (ypCat3 == '-1' || ypCat4 == '-1') {
                            continue;
                        } else if (ypCat3 == '无权限' && ypCat4 == '无权限') {
                            skuList.push(['无权限', '无权限', '无权限']);
                            continue;
                        }

                        // 2.打开编辑商品详细-判断处方药


                        // 获取SKU明细
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: 'https://ware.shop.jd.com/rest/shop/ware/publish3/' + ypCat3 + '/' + ypCat4 + '/' + ypPid + '?isLoc=0',
                            timeout: 10000,
                            onload: (response) => {
                                //console.log(response.responseText);

                                // 判断处方药

                                try {
                                    // 2021-11-25 添加通过cat2id判断类目
                                    // catString:\s?['"](.{4,27})["']
                                    var execTemp = /catString:\s?['"](.{4,27})["']/.exec(response.responseText);
                                    var catSplit =  execTemp[1].split(',');
                                    if(catSplit.length > 1){
                                        // 分割catid有结果
                                        let ypCat2 = catSplit[1];
                                        // 开始判断cat2
                                        /**医药->非处方药->cat2:21909
                                            医药->处方药->cat2:13315-13693
                                            医疗保健->非处方药->cat2:9193-12190、12632 */
                                        try{
                                            ypCat2 = Number(ypCat2);
                                            if(ypCat2 == 21909 || ypCat2 == 12632 || (ypCat2>=9193 && ypCat2<=12190)){
                                                isCf = '非处方药';
                                            }else if(ypCat2>=13315 && ypCat2<=13693){
                                                isCf = '处方药';
                                            }else{
                                                isCf = '';
                                            }
                                        }catch{
                                            console.error('通过cat2判断出错');
                                        }
                                    }
                                        
                                    



                                    var execTemp = /ware:(.*),\s*wareBoot:/.exec(response.responseText);
                                    var result = JSON.parse(execTemp[1]);
                                    //console.log(result);

                                    // 获取药品通用名+规格
                                    var ypTypeId = '';  // 药品分类ID

                                    GM_xmlhttpRequest({
                                        url: 'https://ware.shop.jd.com/rest/shop/category/attr/' + ypCat4 + '/0',
                                        method: 'GET',
                                        onload: (response2) => {
                                            //console.log('https://ware.shop.jd.com/rest/shop/category/attr/' + ypCat4 + '/0');
                                            //console.log(response2.responseText);
                                            let catResult = JSON.parse(response2.responseText);
                                            catResult = catResult['data'];
                                            for (let catIndex = 0; catIndex < catResult.length; catIndex++) {
                                                // console.log('get id');
                                                // 遍历所有结果
                                                // 主要的结果
                                                for (let attrIndex = 0; attrIndex < catResult[catIndex]['catAttrList'].length; attrIndex++) {
                                                    // 遍历获取id
                                                    //console.log(catResult[catIndex]['catAttrList'][attrIndex]['categoryAttributeId'] + ':' + catResult[catIndex]['catAttrList'][attrIndex]['name']);
                                                    if (catResult[catIndex]['catAttrList'][attrIndex]['name'] == '药品分类') {
                                                        ypTypeId = String(catResult[catIndex]['catAttrList'][attrIndex]['categoryAttributeId']);

                                                        // 遍历result获取通用名和规格
                                                        for (let propIndex = 0; propIndex < result['propsSet'].length; propIndex++) {
                                                            //console.log(result['propsSet'][propIndex]['attrId'] + ':' + result['propsSet'][propIndex]['attrValueAlias'][0]);
                                                            if (String(result['propsSet'][propIndex]['attrId']) == ypTypeId) {
                                                                // 药品分类
                                                                // 2022-06-05去除非处方药重新判定
                                                                if (isCf == '') {
                                                                    // 非处方药重新判断
                                                                    if (result['propsSet'][propIndex]['attrValueAlias'][0].indexOf('非处方药') != -1) {
                                                                        // 查询到非处方药
                                                                        isCf = '非处方药';
                                                                        // ypLink.eq(y).find("span[id^='ypNeedNum']").text('非处方药');
                                                                        // console.log('非处方药设定');
                                                                    } else if (result['propsSet'][propIndex]['attrValueAlias'][0].indexOf('处方药') != -1) {
                                                                        isCf = '处方药';
                                                                    } else {
                                                                        isCf = '非处方药';
                                                                        // ypLink.eq(y).find("span[id^='ypNeedNum']").text('非处方药');
                                                                    }
                                                                    break;
                                                                }
                                                            }
                                                        }

                                                        break;
                                                    }
                                                }
                                                // break;
                                                
                                            }
                                            if(isCf == '') isCf = '非处方药';
                                            ypCfStatus = true;
                                        },
                                        onerror: () => {
                                            if(isCf == '') isCf = '非处方药';
                                            ypCfStatus = true;
                                            console.log(ypSkuid + ':load catAttr Error');
                                        },
                                        ontimeout: () => {
                                            if(isCf == '') isCf = '非处方药';
                                            ypCfStatus = true;
                                            console.log(ypSkuid + ':load catAttr Timeout');
                                        }
                                    });

                                    // 获取SKU数量

                                    var skuIdList = result['skus'];

                                    for (let skuIndex = 0; skuIndex < skuIdList.length; skuIndex++) {
                                        //console.log(String(skuIdList[skuIndex]['skuId']) + ',' + ypSkuid);
                                        //console.log(String(skuIdList[skuIndex]['skuId']) == ypSkuid);
                                        try {
                                            if (String(skuIdList[skuIndex]['skuId']) == ypSkuid) {
                                                // 就是这个

                                                sku = String(skuIdList[skuIndex]['outerId']);
                                                // 获取套餐规格
                                                let props = skuIdList[skuIndex]['props'];
                                                if(props.length == 1){
                                                    tc = props[0]['attrValueAlias'];
                                                }else{
                                                    for (let proIndex = 0; proIndex < props.length; proIndex++) {
                                                        if (props[proIndex]['attrName'] == '规格' || props[proIndex]['attrName'] == '型号' || props[proIndex]['attrName'] == '颜色') {
                                                            tc = props[proIndex]['attrValueAlias'];
                                                            break;
                                                        }
                                                    }
                                                }
                                                break;
                                            }
                                        } catch (error) {
                                            console.error(ypSkuid + ',获取套餐信息出错:' + error.message);
                                        }

                                    }
                                    // 如果出错或者未设置
                                    if (tc == '' || tc == undefined) tc = '1盒装-';


                                } catch (error) {
                                    console.error(error.message);
                                    if (response.responseText.indexOf('您没有该功能的操作权限') != -1) {
                                        // 无权限提醒
                                        sku = '无权限';
                                        tc = '无权限';
                                    } else {
                                        sku = 'error';
                                        tc = 'error';
                                    }
                                }

                            }
                        });

                        // 组合信息
                        while (sku == '' || tc == '' || !ypCfStatus) {
                            await sleep(200);
                        }
                        skuList.push([isCf, sku, tc]);

                    }
                    sendData['sku'][orderId] = skuList;

                }

            }

            window.focus();

            // 发送所有信息
            console.log('准备发送信息');
            console.log(sendData);
            GM_xmlhttpRequest({
                url: 'http://' + ip_port + '/zg/getjdmost',
                data: JSON.stringify(sendData),
                method: 'POST',
                onload: (respon) => {
                    if (respon.status == 200) {
                        console.log('发送sendDate结果:');
                        console.log(JSON.parse(respon.responseText));
                    } else {
                        console.log('发送sendData失败Code: ' + respon.status);
                    }
                },
                ontimeout: () => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: 'https://' + ip_port + '/send/dx/京东反恶掉线了'
                    });
                }
            });


            if ($("li.ivu-page-prev").attr('class').indexOf('disabled') != -1) {
                // 如果有disable
                break;
            }
            // 上一页
            console.log("点击上一页...");
            $("li.ivu-page-prev").click();

        }

        console.log('全部订单获取完毕，等待刷新...')
        // 结束


    }

    window.onload = function () {
        var d = new Date();
        console.log(d);

        run();
        autoReload(10);

        console.log('主线程执行完毕');
    }
})();