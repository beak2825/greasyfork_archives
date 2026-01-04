// ==UserScript==
// @name         京东审方
// @namespace    jd-sf
// @version      0.79
// @description  京东添加快速补方按钮，自动获取姓名信息并发送,0.79: 添加首页打开
// @author       fidcz
// @include      *rx.shop.jd.com/rx/rxInfo_auditView.action?rxId*
// @include      *rx.shop.jd.com/rx/rxInfo_list.action*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      192.168.101.122
// @connect      item.jkcsjd.com
// @connect      jd.com
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/423381/%E4%BA%AC%E4%B8%9C%E5%AE%A1%E6%96%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/423381/%E4%BA%AC%E4%B8%9C%E5%AE%A1%E6%96%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var ip_port = '192.168.101.122:5005';
    var ip = '192.168.101.122';

    var img_kong_yiwen = 'https://git.fidcz.top/https://raw.githubusercontent.com/fidcz/bl_tools/master/img/konglong_yiwen.png';
    var img_kong_kaixin = 'https://git.fidcz.top/https://raw.githubusercontent.com/fidcz/bl_tools/master/img/konglong_kaixin.png';
    var img_kong_shengqi = 'https://git.fidcz.top/https://raw.githubusercontent.com/fidcz/bl_tools/master/img/konglong_shengqi.png';
    var img_kong_daxiao = 'https://git.fidcz.top/https://raw.githubusercontent.com/fidcz/bl_tools/master/img/konglong_daxiao.png';

    var checkStatus = false;  // 当前是否正在检查是否开方
    var needWenzhen = true;

    // var ypName = null;
    var khYears = null;
    // var ypSpecs = null;

    // 修改恐龙状态
    function changeKonglong(string1, string2, pic = '') {
        if (pic != '' && pic != undefined) {
            // 需要修改状态
            $('img#div_fixed_img').prop('src', pic);
            // div_fixed_img.setAttribute('src', pic);
        }
        $('#div_fixed_span').text(string1);
        $('#div_fixed_span_tip').text(string2);
        // div_fixed_span.innerHTML = string1;
        // div_fixed_span_tip.innerHTML = string2;
    }

    // 延迟事件
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    function lianouLogin() {
        GM_openInTab('http://' + ip + '/lianou/login', { active: true })
    }
    function getUpdate() {
        GM_openInTab('https://greasyfork.org/scripts/423381-%E4%BA%AC%E4%B8%9C%E5%AE%A1%E6%96%B9/code/%E4%BA%AC%E4%B8%9C%E5%AE%A1%E6%96%B9.user.js', { active: true })
    }

    async function checkWenzhen() {
        // 判断该用户是否问诊成功
        checkStatus = true;
        while (true) {
            var nStatus = '';
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'http://' + ip_port + '/lianou/wenzhenlistname/' + $('input#input_name').val(),
                timeout: 10000,
                onload: (response) => {
                    //console.log('onload' + response.readyState);
                    //console.log(response.responseText);
                    nStatus = response.responseText;
                    if (nStatus == '1') {
                        changeKonglong('emmmmmm...', '好像莲藕已经给他开方了?', img_kong_kaixin);
                        checkStatus = false;
                    } else if (nStatus == '-1') {
                        changeKonglong('hhhhhhh笑死恐龙了', '他的处方被拒绝了', img_kong_daxiao);
                        checkStatus = false;
                    }

                }
            });
            while (nStatus == '') {
                await sleep(800);
                if (nStatus != '') {
                    break;
                }
            }

            if (!checkStatus) {
                break;
            }
            await sleep(1500);
        }
        checkStatus = false;
    }

    async function forceClick() {
        // 强制提交事件
        console.log('强制提交!');
        if ($('input#ypName').val() == '') {
            // 没有
            changeKonglong('你的药品框都是空的!', '你拿个头来问诊?', img_kong_shengqi);
            await sleep(200);
            // p_p1.innerHTML = '药品框为空';
            $('p#p_p1').text('药品框为空');
            return;
        }

        changeKonglong('是什么宝贝竟然要强制提交?', '现在就帮你提交问诊', img_kong_yiwen);
        await sleep(200);
        // p_p1.innerHTML = '发送中，请稍等...';
        $('p#p_p1').text('发送中，请稍等...');

        //console.log('发送内容: ' + 'http://' + ip_port + '/lianou/wenzhen?yp=' + inp2.value + '&name=' + khName + '&idcard=' + khSfz + '&phone=' + khPhone)
        // http://192.168.0.29:5000/lianou/wenzhen?yp=%E7%BC%AC%E6%B2%99%E5%9D%A6%E8%83%B6%E5%9B%8A@@80mg*28%E7%B2%92@@4&name=%E5%91%A8%E7%94%9C%E7%8F%8D&phone=17607606086&idcard=440620196604014225&weight=
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://' + ip_port + '/lianou/wenzhen?yp=' + $('input#ypName').val() + '&name=' + $('input#input_name').val() + '&idcard=' + $('input#input_idcard').val() + '&phone=' + $('input#input_phone').val() + '&weight=' + $('input#weight_num').val(),
            timeout: 30000,
            onload: (response) => {
                console.log('onload' + response.readyState);
                //console.log(response.responseText);
                if (/成功/.test(response.responseText)) {
                    changeKonglong('好耶!', '提交问诊成功了', img_kong_kaixin);
                    if (!checkStatus) {
                        checkWenzhen();
                    }
                } else if (/疾病错误.*None/.test(response.responseText)) {
                    changeKonglong('好像...提交失败了?', '快看看药品栏的名称对不对', img_kong_yiwen);
                } else if (/莲藕掉线了/.test(response.responseText)) {
                    changeKonglong('你莲藕掉线了!', '快点一下"登录"重新登录!');
                } else if (/身份证与姓名不一致/.test(response.responseText)) {
                    changeKonglong('连身份证信息都对不上', '它...说不定没救了');
                } else if (/非法身份证号/.test(response.responseText)) {
                    changeKonglong('身份证号都错了', '他还是人吗?');
                } else if (/药品信息缺少参数/.test(response.responseText)) {
                    changeKonglong('好像出了点问题', '你要不看看药品栏哪里错了?');
                } else if (/体重信息/.test(response.responseText)) {
                    changeKonglong('他还是个孩子!千万不要放过他', '没有提供体重信息!');
                } else {
                    changeKonglong('好像出了点问题', '但是我也不懂是啥问题?', img_kong_yiwen);
                }

                // p_p1.innerHTML = response.responseText;
                $('p#p_p1').text(response.responseText);
            },
            onabort: (response) => {
                console.log('onabort' + response.readyState);
            },
            onerror: (response) => {
                console.log('onerror' + response.readyState);
                changeKonglong('好像提交问诊出问题?', '为什么不问问神奇的恐龙呢?', img_kong_yiwen);
                // p_p1.innerHTML = '获取错误 请重试';
                $('p#p_p1').text('获取错误 请重试');
            },
            ontimeout: (response) => {
                console.log('ontimeout' + response.readyState);
                changeKonglong('好像提交问诊超时了?', '要不...重试一下?', img_kong_shengqi);
                // p_p1.innerHTML = '请求超时 请重试';
                $('p#p_p1').text('请求超时 请重试');
            },
        });
    }

    async function inputClick() {
        // 快速审方被点击事件


        if ($('input#ypName').val() != '') {
            // 如果有值
            changeKonglong('你好像提交过了', '还要再来一次吗?');
            await sleep(200);
            if (!confirm('看起来好像已经提交过一次了，还要再提交一次吗?')) {
                return;
            }
        }

        $('input#ypName').val('');
        changeKonglong('现在帮你看看你要提交什么药品', '我倒要看看你葫芦里买的什么药?', img_kong_yiwen);
        await sleep(200);
        $('p#p_p1').text('正在修改 请稍等...');
        // p_p1.innerHTML = '正在修改 请稍等...';
        getInfo()

    }


    async function getInfo() {

        if (Number(khYears) < 6) {
            // 小于6岁
            if (document.querySelectorAll('div.picture-upload-txt').length >= 2) {
                // 没有上传处方
                changeKonglong('这个崽子还不到6岁!', '连处方都没有?拒绝他!', img_kong_shengqi);
                await sleep(200);
                if (!confirm('年龄小于6岁 并且没有上传处方图片\n是否确定继续补方?')) {
                    return;
                }
            }
        } else if (Number(khYears) < 14) {
            // 小于14岁
            if (document.querySelectorAll('div.picture-upload-txt').length >= 2) {
                // 没有上传处方
                changeKonglong('这个崽子还不到14岁!', '快看看他多重!', img_kong_shengqi);
                await sleep(200);
                if (!confirm('年龄小于14岁\n是否确定继续补方?')) {
                    return;
                }
            }
        }

        //获取药品通用名
        var ypLink = $('tbody#skuListTB').children("tr");

        for (var y = 0; y < ypLink.length; y++) {
            // 遍历

            if (document.getElementById('ypNum' + y).value == '') {
                // 如果是空的
                changeKonglong('我看到你还有药品没有输入数量!', '这个药真的不用补方吗?');
                await sleep(200);
                continue
            }



            if ($('input#ypName').val() != '') {
                $('input#ypName').val($('input#ypName').val() + "||" + ypLink.eq(y).find("input[id^='ypName']").val() + '@@' + ypLink.eq(y).find("input[id^='ypSpecs']").val() + '@@' + ypLink.eq(y).find("input[id^='ypNum']").val());
            } else {
                $('input#ypName').val($('input#ypName').val() + ypLink.eq(y).find("input[id^='ypName']").val() + '@@' + ypLink.eq(y).find("input[id^='ypSpecs']").val() + '@@' + ypLink.eq(y).find("input[id^='ypNum']").val());
            }


        }
        changeKonglong('我在努力帮你提交问诊了!', '要是催我就罢工!', img_kong_shengqi);
        await sleep(200);
        $('p#p_p1').text('发送中，请稍等...');
        // p_p1.innerHTML = '发送中，请稍等...';

        if ($('input#ypName').val() == '') {
            // 没有
            changeKonglong('你的药品框都是空的!', '你拿个头来问诊?', img_kong_shengqi);
            await sleep(200);
            $('p#p_p1').text('药品框为空');
            // p_p1.innerHTML = '药品框为空';
            return;
        }



        //inp2.value = 'http://' + ip_port + '/lianou/wenzhen?yp=' + inp2.value + '&name=' + khName + '&idcard=' + khSfz + '&phone=' + khPhone

        console.log('http://' + ip_port + '/lianou/wenzhen?yp=' + $('input#ypName').val() + '&name=' + $('input#input_name').val() + '&idcard=' + $('input#input_idcard').val() + '&phone=' + $('input#input_phone').val() + '&weight=' + $('input#weight_num').val())
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://' + ip_port + '/lianou/wenzhen?yp=' + $('input#ypName').val() + '&name=' + $('input#input_name').val() + '&idcard=' + $('input#input_idcard').val() + '&phone=' + $('input#input_phone').val() + '&weight=' + $('input#weight_num').val(),
            timeout: 30000,
            onload: (response) => {
                console.log('onload' + response.readyState);
                //console.log(response.responseText);
                if (/成功/.test(response.responseText)) {
                    changeKonglong('好耶!', '提交问诊成功了', img_kong_kaixin);
                    if (!checkStatus) {
                        checkWenzhen();
                    }
                } else if (/疾病错误.*None/.test(response.responseText)) {
                    changeKonglong('好像...提交失败了?', '快看看药品栏的名称对不对', img_kong_yiwen);
                } else if (/莲藕掉线了/.test(response.responseText)) {
                    changeKonglong('你莲藕掉线了!', '快点一下"登录"重新登录!');
                } else if (/身份证与姓名不一致/.test(response.responseText)) {
                    changeKonglong('连身份证信息都对不上', '它...说不定没救了');
                } else if (/非法身份证号/.test(response.responseText)) {
                    changeKonglong('身份证号都错了', '他还是人吗?');
                } else if (/药品信息缺少参数/.test(response.responseText)) {
                    changeKonglong('好像出了点问题', '你要不看看药品栏哪里错了?');
                } else if (/体重信息/.test(response.responseText)) {
                    changeKonglong('他还是个孩子!千万不要放过他', '没有提供体重信息!');
                } else {
                    changeKonglong('好像出了点问题', '但是我也不懂是啥问题?', img_kong_yiwen);
                }

                $('p#p_p1').text(response.responseText);
                // p_p1.innerHTML = response.responseText;
            },
            onabort: (response) => {
                console.log('onabort' + response.readyState);
            },
            onerror: (response) => {
                console.log('onerror' + response.readyState);
                changeKonglong('好像提交问诊出问题?', '为什么不问问神奇的恐龙呢?', img_kong_yiwen);
                $('p#p_p1').text('获取失败 请重试');
                // p_p1.innerHTML = '获取失败 请重试';
                //await sleep(200);
            },
            ontimeout: (response) => {
                console.log('ontimeout' + response.readyState);
                changeKonglong('好像提交问诊超时了?', '要不...重试一下?', img_kong_shengqi);
                //await sleep(200);
                $('p#p_p1').text('请求超时 请重试');
                // p_p1.innerHTML = '请求超时 请重试';
            },
        });



    }

    async function getKhInfo() {
        try {
            // if (!needWenzhen) {
            //     // 如果不需要问诊，可以返回
            //     return;
            // }
            // 获取客户信息
            $('input#input_name').val($('input[name="rxInfo.rxExtendsInfo.patientName"]').val());
            // inp6.value = document.querySelector('input[name="rxInfo.rxExtendsInfo.patientName"]').value;  // 姓名
            console.log('姓名: ' + $('input#input_name').val());
            $('input#input_idcard').val($('input[name="rxInfo.rxExtendsInfo.idCardNum"]').val());
            // inp7.value = document.querySelector('input[name="rxInfo.rxExtendsInfo.idCardNum"]').value;  // 身份证
            console.log('身份证号: ' + $('input#input_idcard').val());
            khYears = $('input[name="rxInfo.rxExtendsInfo.age"]').val();       // 年龄
            // khYears = document.querySelector('input[name="rxInfo.rxExtendsInfo.age"]').value;       // 年龄
            console.log('年龄: ' + khYears);
            while ($('td#fullUserPhone').text().indexOf('****') != -1) {
                // 如果找不到电话框
                await sleep(1000);
            }
            
            $('input#input_phone').val($('td#fullUserPhone').text());
            // inp8.value = document.querySelector('td#fullUserPhone').innerHTML;  // 手机号码

            // 检查是否有问诊记录
            if (needWenzhen) {
                checkHaveWenzhen($('input#input_name').val());
            }
        } catch(error) {
            console.log('获取客户信息失败' + error.message);
        }

        let name = '', phone = '', idcard = '', illness = '', nexusMe = '', address = '', result = {};
        try{
            while (document.querySelector('span.ad-tell').innerHTML.indexOf('****') != -1) {
                // 如果找不到电话框
                await sleep(1000);
            }
            name = document.querySelector('input[name="rxInfo.rxExtendsInfo.patientName"]').value;  // 姓名
            phone = $('td#fullUserPhone').text();  // 手机号码
            idcard = document.querySelector('input[name="rxInfo.rxExtendsInfo.idCardNum"]').value.toUpperCase();  // 身份证
            nexusMe = document.querySelector('input[name="rxInfo.rxExtendsInfo.relationshipWithUserCn"]').value;  // 关系
            try{
                illness = $('textarea#diagnoseResult').text();
            }catch{console.log('');}
            address = $('span.ad-name').text() + ',,' + $('span.ad-tell').text() + ',,' + $('span.ad-address').text();
            result = {'idcard': idcard, 'name': name, 'phone': phone, 'illness': illness, 'addr': address, 'nexusMe': nexusMe};
            console.log(result);
        }catch{
            // console.warn('info Err');
            name = $('.case-body').find('table').find('tr').eq(1).children('td').eq(0).text();  // 姓名
            phone = $('td#fullUserPhone').text();  // 手机号码
            idcard = $('.case-body').find('table').find('tr').eq(3).children('td').eq(1).text().toUpperCase();  // 身份证
            nexusMe = $('.case-body').find('table').find('tr').eq(1).children('td').eq(1).text();  // 关系
            try{
                illness = $('td.resu').text();
            }catch{console.log('');}
            address = $('span.ad-name').text() + ',,' + $('span.ad-tell').text() + ',,' + $('span.ad-address').text();
            result = {'idcard': idcard, 'name': name, 'phone': phone, 'illness': illness, 'addr': address, 'nexusMe': nexusMe};
            console.log(result);
        }

        try{
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'http://' + ip_port + '/jd/info',
                data: JSON.stringify(result),
                timeout: 10000
            });
        }catch(error){
            console.log('api Err:' + error.message);
        }
    }

    /* 商品页信息处理函数 */
    function handlePage(ypLink, y, respon) {
        var typName = '';
        var typSpecs = '';
        // pid
        var ypPid = '';
        // catid
        var ypCat3 = '';
        var ypCat4 = '';
        // 是否为处方药
        var isCf = '';
        try {
            var result = /dt>药品通用名<\/dt><dd>(.{1,25})<\/dd>/.exec(respon);
            typName = result[1].replace(/(^\s*)|(\s*$)/g, "");  // 删首尾空
        } catch {
            typName = '未设置';
            console.log(respon);
        }

        try {
            var result2 = /dt>产品规格<\/dt><dd>(.{1,20})<\/dd>/.exec(respon);
            //console.log(result);
            typSpecs = result2[1].replace(/(^\s*)|(\s*$)/g, ""); // 删首尾空
            typSpecs = typSpecs.replace(/\\/g, '/'); // 替换\为/
        } catch {
            typSpecs = '未设置'
        }

        console.log(typName + ',' + typSpecs);

        //console.log(ypLink.eq(y).find("input[id^='ypName']"));

        ypLink.eq(y).find("input[id^='ypName']").val(typName);
        ypLink.eq(y).find("input[id^='ypSpecs']").val(typSpecs);

        var execTemp = /\scat-3-(\d{1,8})\scat-4-(\d*)\sitem-(\d{5,25})/.exec(respon);
        if (execTemp.length >= 3) {
            ypCat3 = execTemp[1];
            ypCat4 = execTemp[2];

            if (ypCat4 == '') {
                ypCat4 = ypCat3;
            }
        } else {
            // 获取出错
            console.error(execTemp);
            ypCat3 = ypCat4 = '-1';
        }

        execTemp = /&pid=(\d{3,15})&catId=/.exec(respon);
        ypPid = execTemp[1];

        // 获取是否为处方药
        try {

            // 1.通过加入购物车判断
            if (/a.*class=".*choose-btn-append.*href="\/\/(.*)\.com\//.test(respon)) {
                // 有结果
                execTemp = /a.*class=".*choose-btn-append.*href="\/\/(.*)\.com\//.exec(respon);
                if (execTemp[0].indexOf('cart.jd.com') != -1) {
                    // 是加入购物车
                    isCf = '非处方药';
                } else if (execTemp[0].indexOf('med.jkcsjd.com') != -1) {
                    // 加入药品清单
                    isCf = '处方药';
                }
            }

            // 2.通过药品分类判断
            if (/dt>药品分类<\/dt><dd>(.{1,20})<\/dd>/.test(respon) && isCf == '') {

                execTemp = /dt>药品分类<\/dt><dd>(.{1,20})<\/dd>/.exec(respon);
                if (execTemp.length > 1) {
                    if (execTemp[1].indexOf('非处方药') != -1) {
                        isCf = '非处方药';
                    } else {
                        // 找不到非处方药
                        if (execTemp[1].indexOf('处方药') != -1) {
                            // 找到了处方药
                            isCf = '处方药';
                        }
                    }
                }
            }

            // 3.通过类型判断
            if (/>类型[:：](.{2,10})<\/li>/.test(respon) && isCf == '') {
                execTemp = />类型[:：](.{2,10})<\/li>/.exec(respon);
                if (execTemp.length > 1) {
                    if (execTemp[1].indexOf('处方药') != -1) {
                        // 找到了处方药
                        isCf = '处方药';
                    }
                }
            }

            // 4.如果都不符合，直接设置为非处方药
            if (isCf == '') {
                isCf = '非处方药';
            }

        } catch (error) {
            // 获取处方类目出错
            console.error('获取处方类目出错: ' + error.message);
            isCf = '非处方药';
        }

        return [typName, typSpecs, ypPid, ypCat3, ypCat4, isCf];

    }

    async function getYpInfoThead(ypLink, ypSkuid, y){
        // pid
        var ypPid = '';
        // catid
        var ypCat3 = '';
        var ypCat4 = '';
        // 是否为处方药
        var isCf = '';


        /* 2021-09-16 修改为直接通过修改商品获取信息 */

        // 1.搜索在售商品

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://ware.shop.jd.com/rest/ware/list/search',
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
                'content-type': 'application/json;charset=UTF-8'
            },
            data: JSON.stringify({ 'brandId': '', 'categoryId': '', 'colType': '', 'hasImage': '', 'imei': '', 'itemNum': '', 'jdPriceHighString': '', 'jdPriceLowString': '', 'multiCategoryId': '', 'orderBy': 'onsaletime,desc', 'page': '1', 'pageSize': '2', 'skuId': ypSkuid, 'stockNumHigh': '', 'stockNumLow': '', 'wareId': '', 'wareName': '', 'wareStatusStr': 'onSale' }),
            onload: (response) => {
                let temp_data = JSON.parse(response.responseText);
                try{
                    console.log((y+1) + ':Search onSale result Num:' + temp_data['data']['data'].length);
                    ypPid = temp_data['data']['data'][0]['ware']['wareId'];
                    ypCat3 = temp_data['data']['data'][0]['ware']['categoryId'];
                    try{
                        // 如果cat4获取出错默认和3一致
                        ypCat4 = temp_data['data']['data'][0]['ware']['multiCategoryId'];
                    }catch{
                        ypCat4 = ypCat3;
                    }
                    
                }catch{
                    // 报错，出售中的宝贝搜索无结果;搜索待出售中的宝贝
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
                            let temp_data = JSON.parse(response.responseText);
                            try{
                                console.log((y+1) + ':Search forSale result Num:' + temp_data['data']['data'].length);
                                ypPid = temp_data['data']['data'][0]['ware']['wareId'];
                                ypCat3 = temp_data['data']['data'][0]['ware']['categoryId'];
                                try{
                                    // 如果cat4获取出错默认和3一致
                                    ypCat4 = temp_data['data']['data'][0]['ware']['multiCategoryId'];
                                }catch{
                                    ypCat4 = ypCat3;
                                }
                                
                            }catch{
                                // 报错，获取失败
                                ypCat3 = '-1';
                                ypCat4 = '-1';
                            }
                            
                        },
                        onerror: () => {
                            console.log((y+1) + ":search forSale Error");
                            ypCat3 = '-1';
                            ypCat4 = '-1';
                        },
                        ontimeout: () => {
                            console.log((y+1) + ":search forSale Timeout");
                            ypCat3 = '-1';
                            ypCat4 = '-1';
                        }
                    });
                }
                
            },
            onerror: () => {
                console.log((y+1) + ":search onSale Error");
                ypCat3 = '-1';
                ypCat4 = '-1';
            },
            ontimeout: () => {
                console.log((y+1) + ":search onSale Timeout");
                ypCat3 = '-1';
                ypCat4 = '-1';
            }
        });


        while (ypCat3 == '' || ypCat4 == '' || ypPid == '') {
            await sleep(200);
        }

        if (ypCat3 == '-1') {
            alert('第' + (y + 1) + '个药品获取信息出错\n如果需要补方请刷新重试')
            return;
        }

        // // 非处方药直接跳过
        // if (isCf == '非处方药') {
        //     ypLink.eq(y).find("span[id^='ypNeedNum']").text('非处方药');
        //     continue;
        // }


        // 2.打开编辑商品详细-判断处方药
        var skuNum = '';

        // 获取SKU明细
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://ware.shop.jd.com/rest/shop/ware/publish3/' + ypCat3 + '/' + ypCat4 + '/' + ypPid + '?isLoc=0',
            timeout: 10000,
            onload: (response) => {
                //console.log(response.responseText);

                // 判断处方药

                try {
                    // 2021-12-27 添加通过cat2id判断类目
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
                                ypLink.eq(y).find("span[id^='ypNeedNum']").text('非处方药');
                            }else if(ypCat2>=13315 && ypCat2<=13693){
                                isCf = '处方药';
                            }else{
                                isCf = '';
                            }
                        }catch{
                            console.error('通过cat2判断出错');
                        }
                    }
                    // var execTemp = /category-con[\s\S]{300,650}<\/div>/.exec(response.responseText);
                    // if(execTemp[0].indexOf('非处方药') != -1 || execTemp[0].indexOf('OTC') != -1 || execTemp[0].indexOf('otc') != -1){
                    //     // 非处方药,跳过
                    //     isCf = '非处方药';
                    //     ypLink.eq(y).find("span[id^='ypNeedNum']").text('非处方药');
                    // }else{
                    //     // 处方药
                    //     isCf = '处方药';

                    if(isCf == '处方药' || isCf == ''){

                        var execTemp = /ware:(.*),\s*wareBoot:/.exec(response.responseText);
                        var result = JSON.parse(execTemp[1]);
                        //console.log(result);

                        // 获取药品通用名+规格
                        var ypNameId = '';  // 药品通用名Id
                        var ypSpecsId = ''; // 药品规格Id
                        var ypTypeId = '';  // 药品分类ID
                        GM_xmlhttpRequest({
                            url: 'https://ware.shop.jd.com/rest/shop/category/attr/' + ypCat4 + '/0',
                            method: 'GET',
                            onload: (response2) => {
                                //console.log('https://ware.shop.jd.com/rest/shop/category/attr/' + ypCat4 + '/0');
                                //console.log(response2.responseText);
                                let catResult = JSON.parse(response2.responseText);
                                catResult = catResult['data'];
                                for(let catIndex=0; catIndex<catResult.length; catIndex++){
                                    // 遍历所有结果
                                    if(catResult[catIndex]['groupName'] != ''){
                                        // 主要的结果
                                        for(let attrIndex=0; attrIndex<catResult[catIndex]['catAttrList'].length; attrIndex++){
                                            // 遍历获取id
                                            //console.log(catResult[catIndex]['catAttrList'][attrIndex]['categoryAttributeId'] + ':' + catResult[catIndex]['catAttrList'][attrIndex]['name']);
                                            if(catResult[catIndex]['catAttrList'][attrIndex]['name'] == '药品通用名'){
                                                ypNameId = String(catResult[catIndex]['catAttrList'][attrIndex]['categoryAttributeId']);
                                            }else if(catResult[catIndex]['catAttrList'][attrIndex]['name'] == '产品规格'){
                                                ypSpecsId = String(catResult[catIndex]['catAttrList'][attrIndex]['categoryAttributeId']);
                                            }else if(catResult[catIndex]['catAttrList'][attrIndex]['name'] == '药品分类'){
                                                ypTypeId = String(catResult[catIndex]['catAttrList'][attrIndex]['categoryAttributeId']);
                                            }
                                        }
                                        //console.log('ypNameId: ' + ypNameId);
                                        //console.log('ypSpecsId: ' + ypSpecsId);
                                        if(ypNameId == '' && ypSpecsId == '' && ypTypeId == ''){
                                            // 全都获取失败，直接判定非处方药
                                            isCf = '非处方药';
                                            ypLink.eq(y).find("span[id^='ypNeedNum']").text('非处方药');
                                            break;
                                        }

                                        // 遍历result获取通用名和规格
                                        for(let propIndex=0; propIndex<result['propsSet'].length; propIndex++){
                                            //console.log(result['propsSet'][propIndex]['attrId'] + ':' + result['propsSet'][propIndex]['attrValueAlias'][0]);
                                            if(String(result['propsSet'][propIndex]['attrId']) == ypNameId){
                                                // 药品名称
                                                ypLink.eq(y).find("input[id^='ypName']").val(result['propsSet'][propIndex]['attrValueAlias'][0]);

                                            }else if(String(result['propsSet'][propIndex]['attrId']) == ypSpecsId){
                                                // 药品规格
                                                ypLink.eq(y).find("input[id^='ypSpecs']").val(result['propsSet'][propIndex]['attrValueAlias'][0]);
                                            }else if(String(result['propsSet'][propIndex]['attrId']) == ypTypeId){
                                                // 药品分类
                                                if(isCf == '非处方药' || isCf == ''){
                                                    // 非处方药重新判断
                                                    if(result['propsSet'][propIndex]['attrValueAlias'][0].indexOf('非处方药') != -1){
                                                        // 查询到非处方药
                                                        isCf = '非处方药';
                                                        ypLink.eq(y).find("span[id^='ypNeedNum']").text('非处方药');
                                                    }else if(result['propsSet'][propIndex]['attrValueAlias'][0].indexOf('处方药') != -1){
                                                        isCf = '处方药';
                                                    }else{
                                                        isCf = '非处方药';
                                                        ypLink.eq(y).find("span[id^='ypNeedNum']").text('非处方药');
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            onerror: ()=>{
                                console.log((y+1) + ':load catAttr Error');
                            },
                            ontimeout: ()=>{
                                console.log((y+1) + ':load catAttr Timeout');
                            }
                        })

                        // 获取SKU数量

                        var skuIdList = result['skus'];

                        for (let skuIndex = 0; skuIndex < skuIdList.length; skuIndex++) {
                            //console.log(String(skuIdList[skuIndex]['skuId']) + ',' + ypSkuid);
                            //console.log(String(skuIdList[skuIndex]['skuId']) == ypSkuid);
                            if (String(skuIdList[skuIndex]['skuId']) == ypSkuid) {
                                // 就是这个
                                var outerId = String(skuIdList[skuIndex]['outerId']);
                                //console.log(String(skuIdList[skuIndex]['outerId']));
                                if (outerId.indexOf('*') == '-1') {
                                    // 没有*
                                    skuNum = 1;
                                } else {
                                    skuNum = Number(outerId.split('*')[1]);
                                }

                                // 设置总量
                                //console.log(y);
                                let num = Number(ypLink.eq(y).children('td').eq(1).children("span").not("span[id^='ypNeedNum']").text());
                                //console.log(num);
                                ypLink.eq(y).find("span[id^='ypNeedNum']").text(String(num * skuNum));

                                break;
                            }
                        }
                    }


                } catch {
                    if (response.responseText.indexOf('您没有该功能的操作权限') != -1) {
                        // 无权限提醒
                        ypLink.eq(y).find("span[id^='ypNeedNum']").text('无权限');
                    } else {
                        ypLink.eq(y).find("span[id^='ypNeedNum']").text('非处方药');
                    }
                    skuNum = '-1'

                }

            }
        });

    }

    async function getYpInfo() {
        // 获取药品信息

        //获取药品通用名
        var ypLink = $('tbody#skuListTB').children('tr');

        for (var y = 0; y < ypLink.length; y++) {
            // 遍历

            // 获取这个药的SKU

            var itemUrl = ypLink.eq(y).find('a.drug-link').attr('href')
            if (itemUrl.substring(0, 2) == '//') {
                // 链接前段加上https
                itemUrl = 'http:' + itemUrl;
            }
            var ypSkuid = /\d{5,15}/.exec(itemUrl)[0];

            getYpInfoThead(ypLink, ypSkuid, y);
        }
        console.log('------初始化完毕------');

    }

    function checkHaveWenzhen(name) {
        // 检查是否有问诊记录
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://' + ip_port + '/lianou/wenzhenlistname/' + name,
            timeout: 10000,
            onload: (response) => {
                //console.log(response.responseText);
                if (response.responseText == '-3') {
                    // 掉线情况
                    changeKonglong('莲藕掉线了!', '快点重新扫码登录', img_kong_yiwen);
                } else if (response.responseText == '-4') {
                    changeKonglong('查询出现问题了!', '我也不知道啥问题', img_kong_yiwen);
                } else if (response.responseText != '-2') {
                    // 有记录
                    changeKonglong('好像今天他问诊过了', '要不先去莲藕看看?', img_kong_daxiao);
                }
            }
        });
    }

    // Your code here...

    //function setSubmit(){

    async function addConctrl(){

        console.log('创建按钮...');

        var parent = document.querySelector('div.curr_position').parentNode;
        var parent2 = document.querySelector('div.curr_position').parentNode.children;
        var parent2 = parent2[parent2.length - 7];
    
        // 添加大主框
        var div_main = document.createElement('div');
        div_main.setAttribute('id', 'div_main');
        div_main.setAttribute('class', 'mod-03');
        div_main.style.marginTop = '10px';
        div_main.style.marginBottom = '2px';
        parent.appendChild(div_main);
        $("div#div_main").insertAfter(parent2);
    
    
        // 添加标题框
        var div_title = document.createElement('div');
        div_title.setAttribute('id', 'div_main');
        div_title.setAttribute('class', 'mod-title');
        div_main.appendChild(div_title);
    
        // 添加标题P
        var title_p = document.createElement('h3');
        title_p.setAttribute('id', 'title_p');
        title_p.innerHTML = "快速补方";
        title_p.setAttribute('class', 'title');
        title_p.style.display = "inline-block";
        div_title.appendChild(title_p);
    
        // 主框框
        var div_p = document.createElement('div');
        div_p.setAttribute('id', 'div_p');
        div_p.style.margin = '3px';
        div_p.style.marginTop = '18px';
        div_p.style.marginBottom = '18px';
        div_p.style.height = '165px';
        div_p.style.border = "solid 1px #f1f1f1"
        div_p.style.background = '#f0f0f087';
        div_main.appendChild(div_p);
    
        // 说明p1: 提示框
        var p_p1 = document.createElement('p');
        p_p1.setAttribute('id', 'p_p1');
        p_p1.innerHTML = "这里显示提示信息";
        p_p1.style.fontSize = '16px';
        p_p1.style.textAlign = 'center';
        p_p1.style.color = '#ff0000';
        p_p1.style.marginTop = '4px';
        p_p1.style.padding = '8px';
        p_p1.style.width = '*';
        div_p.appendChild(p_p1);
    
        // 说明p2：
        var p_p2 = document.createElement('p');
        p_p2.setAttribute('id', 'p_p2');
        p_p2.innerHTML = "输入数量点击快速补方。如果身份证姓名不一致改正下面的姓名身份证然后重新点击强制提交。可以使用工具箱查看开具的处方";
        p_p2.style.fontSize = '14px';
        p_p2.style.margin = '2px';
        p_p2.style.padding = '8px';
        div_p.appendChild(p_p2);
    
    
        console.log('创建药品名称框...');
    
        // 药品名称输入框
        var inp4 = document.createElement('input');
        inp4.setAttribute('id', 'ypName');
        inp4.setAttribute('placeholder', '这里显示药品');
        //inp2.setAttribute('class', 'btn-h28 btn-white');
        inp4.style.width = '860px';
        inp4.style.height = '28px';
        inp4.style.paddingLeft = '6px';
        inp4.style.marginLeft = '8px';
        inp4.style.marginTop = '8px';
        //inp.innerHTML = '快速审方';
        div_p.appendChild(inp4);
    
        // 体重输入框
        var inp5 = document.createElement('input');
        inp5.setAttribute('id', 'weight_num');
        inp5.setAttribute('placeholder', '体重');
        //inp2.setAttribute('class', 'btn-h28 btn-white');
        inp5.style.width = '48px';
        inp5.style.height = '28px';
        inp5.style.paddingLeft = '6px';
        inp5.style.marginLeft = '8px';
        inp5.style.marginTop = '8px';
        //inp.innerHTML = '快速审方';
        div_p.appendChild(inp5);
    
    
        console.log('创建提示框...');
    
        // 姓名
        var inp6 = document.createElement('input');
        // inp6.setAttribute('id', 'khname');
        inp6.setAttribute('placeholder', '姓名');
        inp6.setAttribute('id', 'input_name');
        inp6.style.width = '75px';
        inp6.style.height = '28px';
        inp6.style.paddingLeft = '6px';
        inp6.style.marginLeft = '8px';
        inp6.style.marginTop = '8px';
        div_p.appendChild(inp6);
    
        // 身份证
        var inp7 = document.createElement('input');
        // inp7.setAttribute('id', 'khsfz');
        inp7.setAttribute('placeholder', '身份证');
        inp7.setAttribute('id', 'input_idcard');
        inp7.style.width = '220px';
        inp7.style.height = '28px';
        inp7.style.paddingLeft = '6px';
        inp7.style.marginLeft = '8px';
        inp7.style.marginTop = '8px';
        div_p.appendChild(inp7);
    
        // 手机号
        var inp8 = document.createElement('input');
        // inp8.setAttribute('id', 'khphone');
        inp8.setAttribute('placeholder', '手机号');
        inp8.setAttribute('id', 'input_phone');
        inp8.style.width = '120px';
        inp8.style.height = '28px';
        inp8.style.paddingLeft = '6px';
        inp8.style.marginLeft = '8px';
        inp8.style.marginTop = '8px';
        div_p.appendChild(inp8);
    
    
        // 创建快速补方按钮
        var inp1 = document.createElement('input');
        inp1.setAttribute('id', 'myInput1');
        inp1.setAttribute('type', 'button');
        inp1.setAttribute('class', 'btn-h28 btn-red');
        inp1.setAttribute('value', '快速补方');
        inp1.setAttribute('id', 'subRx')
        //inp.innerHTML = '快速审方';
        inp1.style.width = '61px';
        inp1.style.margin = '8px';
        inp1.style.marginLeft = '180px';
        div_p.appendChild(inp1);
        $(document).on('click', 'input#subRx', ()=>{
            inputClick();
        });
        // inp1.addEventListener('click', inputClick);
    
        // 创建强制提交按钮
        var inp2 = document.createElement('input');
        inp2.setAttribute('id', 'force_sub');
        inp2.setAttribute('type', 'button');
        inp2.setAttribute('class', 'btn-h28 btn-white');
        inp2.setAttribute('value', '强制提交');
        inp2.setAttribute('id', 'forceSubRx');
        //inp.innerHTML = '快速审方';
        inp2.style.margin = '8px';
        div_p.appendChild(inp2);
        $(document).on('click', 'input#forceSubRx', ()=>{
            forceClick();
        });
        // inp2.addEventListener('click', forceClick);
    
        // 创建登录莲藕按钮
        var inp3 = document.createElement('input');
        inp3.setAttribute('id', 'lianou_login');
        inp3.setAttribute('type', 'button');
        inp3.setAttribute('class', 'btn-h28 btn-white');
        inp3.setAttribute('value', '登录');
        inp3.setAttribute('id', 'loginLo');
        //inp.innerHTML = '快速审方';
        inp3.style.marginLeft = '8px';
        inp3.style.width = '30px';
        div_p.appendChild(inp3);
        $(document).on('click', 'input#loginLo', ()=>{
            lianouLogin();
        });
        // inp3.addEventListener('click', lianouLogin);
    
        // 创建更新按钮
        var inp9 = document.createElement('input');
        inp9.setAttribute('id', 'update_open');
        inp9.setAttribute('type', 'button');
        inp9.setAttribute('class', 'btn-h28 btn-white');
        inp9.setAttribute('value', '更新');
        inp9.setAttribute('id', 'getUpdate');
        //inp.innerHTML = '快速审方';
        inp9.style.marginLeft = '8px';
        inp9.style.width = '22px';
        div_p.appendChild(inp9);
        $(document).on('click', 'input#getUpdate', ()=>{
            getUpdate();
        });
        // inp9.addEventListener('click', getUpdate);
    
    
    
        console.log('删除多余元素');
    
        // 删除右边jimi的框框
        $("div.jimi-wrapper").remove();
        // 删除左边的菜单
        $("div.l-menu").remove();
    
        // 删除中间卡片灰色边框
        $("div.content").css('border', '0px solid #fff');
    
        // 创建左边l-content
        var div_l_content = document.createElement('div');
        div_l_content.setAttribute('id', 'contentleft');
        div_l_content.setAttribute('class', 'l-content');
        div_l_content.style.padding = '12px';
        div_l_content.style.width = '480px';
        div_l_content.style.float = 'left';
        div_l_content.style.marginLeft = '-300px';
        document.querySelector("section.custom").appendChild(div_l_content);
    
        // l-content添加标题
        var content_p = document.createElement('h3');
        content_p.innerHTML = "客户上传处方";
        content_p.setAttribute('class', 'title');
        content_p.style.marginBottom = '20px';
        div_l_content.appendChild(content_p);
    
        // 寻找img
        var imgList = $("div.tab02").find("img");
        //console.log(imgList);
    
        // 添加处方图片到左边
        for (let imgIndex = 0; imgIndex < imgList.length; imgIndex++) {
            var content_hr = document.createElement('hr');
            div_l_content.appendChild(content_hr);
    
            let content_img = document.createElement('img');
            content_img.setAttribute('width', '450px');
            content_img.setAttribute('src', imgList.eq(imgIndex).attr('src'));
            content_img.style.marginTop = '10px';
            content_img.style.marginBottom = '10px';
            div_l_content.appendChild(content_img);
    
        }
    
        // 添加右边悬浮提示框
        let div_fixed = document.createElement('div');
        div_fixed.setAttribute('id', 'div_fixed');
        div_fixed.style.background = '#fff';
        div_fixed.style.boxShadow = '0 0 5px 0 rgba(0, 0, 0, .2)';
        div_fixed.style.position = 'fixed';
        div_fixed.style.right = '8px';
        div_fixed.style.bottom = '380px';
        div_l_content.appendChild(div_fixed);
    
        // 恐龙图片
        var div_fixed_img = document.createElement('img');
        div_fixed_img.setAttribute('width', '180px');
        div_fixed_img.setAttribute('height', '180px');
        div_fixed_img.setAttribute('src', img_kong_kaixin);
        div_fixed_img.setAttribute('id', 'div_fixed_img');
        div_fixed_img.style.position = 'relative';
        div_fixed_img.style.margin = '5px 25px 10px 25px';
        div_fixed_img.style.left = '0px';
        div_fixed_img.style.top = '0px';
        div_fixed.appendChild(div_fixed_img);
    
        // 关闭彩蛋
        var clickNum = 0;
    
        // 首行提示文本
        var div_fixed_span = document.createElement('h4');
        div_fixed_span.setAttribute('width', '100%');
        div_fixed_span.setAttribute('height', '30px');
        div_fixed_span.setAttribute('id', 'div_fixed_span');
        div_fixed_span.innerHTML = '你来审方啦!';
        div_fixed_span.style.position = 'relative';
        div_fixed_span.style.color = '#f00';
        div_fixed_span.style.textAlign = 'center';
        div_fixed_span.style.marginBottom = '8px';
        div_fixed.appendChild(div_fixed_span);
    
        // 第二行
        var div_fixed_span_tip = document.createElement('h4');
        div_fixed_span_tip.setAttribute('width', '100%');
        div_fixed_span_tip.setAttribute('height', '30px');
        div_fixed_span_tip.setAttribute('id', 'div_fixed_span_tip');
        div_fixed_span_tip.innerHTML = '快看看用不用补方!';
        div_fixed_span_tip.style.position = 'relative';
        div_fixed_span_tip.style.color = '#f00';
        div_fixed_span_tip.style.textAlign = 'center';
        div_fixed_span_tip.style.marginBottom = '8px';
        div_fixed.appendChild(div_fixed_span_tip);
    
        // 判断能否审核处方
        if ($("div.drug-btns").length <= 0) {
            changeKonglong('不是?这个处方都不能审核', '你点开干啥?', img_kong_yiwen);
            needWenzhen = false;
        } else {
            // 可以审核
            if ($("div.tab01").find("a").length > 0) {
                // 如果有客服上传处方
                changeKonglong('看起来你已经上传处方了', '给他审核通过吧!', img_kong_kaixin);
                needWenzhen = false;
            }
        }
        // 添加被点击事件
        $(document).on('click', 'h4#div_fixed_img', async ()=>{
            clickNum += 1;
            div_fixed_img.setAttribute('src', img_kong_shengqi);
            div_fixed_span.innerHTML = '你点我干啥!';
            div_fixed_span_tip.innerHTML = '你再点多几次我就生气了啊!';
            if (clickNum >= 6) {
                try {
                    changeKonglong('再见了您嘞!', '让你点我!', img_kong_kaixin);
                    await sleep(1400);
                    window.close();
                    await sleep(500);
                    changeKonglong('不好!失策了!', '这$#!":网页@$"#咋关不掉%#!$@', img_kong_yiwen);
                } catch {
                    changeKonglong('不好!失策了!', '这$#!":网页@$"#咋关不掉%#!$@', img_kong_yiwen);
                }
    
            }
        });
        // div_fixed_img.addEventListener('click', async function () {

        // });
    
        // 删除部分白色背景
        //console.log($('section.custom'));
        $('section.custom').css('background', '#f8f8f8');
    
        // 添加上下Padding
        $('body').css('padding', '40px 0px');
    
    
        console.log('创建数量输入框...');
    
        // 创建数量输入框
        var ypLink2 = document.querySelector('tbody#skuListTB').children;
        for (var xx = 0; xx < ypLink2.length; xx++) {
            //console.log(xx);
            var con2 = document.createElement('input')
            con2.setAttribute('id', 'ypNum' + xx);
            con2.value = '';
            con2.style.textAlign = 'center';
            con2.style.width = '36px';
            con2.style.height = '28px';
            con2.style.marginLeft = '8px';
            con2.style.border = 'solid 1px #eeeeee'
            document.querySelector('tbody#skuListTB').children[xx].querySelectorAll('td')[1].appendChild(con2);
    
            // 创建总量提醒
            var sp1 = document.createElement('span')
            sp1.setAttribute('id', 'ypNeedNum' + xx);
            sp1.innerHTML = '0';
            sp1.style.textAlign = 'center';
            sp1.style.width = '36px';
            sp1.style.height = '28px';
            sp1.style.marginLeft = '8px';
            document.querySelector('tbody#skuListTB').children[xx].querySelectorAll('td')[1].appendChild(sp1);
    
            // 创建药品名称
            var con3 = document.createElement('input')
            con3.setAttribute('id', 'ypName' + xx);
            con3.value = '';
            con3.style.textAlign = 'center';
            con3.style.width = '64px';
            con3.style.height = '28px';
            con3.style.marginLeft = '8px';
            con3.style.border = 'solid 1px #eeeeee'
            document.querySelector('tbody#skuListTB').children[xx].querySelectorAll('td')[2].appendChild(con3);
    
            // 创建药品规格
            var con4 = document.createElement('input')
            con4.setAttribute('id', 'ypSpecs' + xx);
            con4.value = '';
            con4.style.textAlign = 'center';
            con4.style.width = '64px';
            con4.style.height = '28px';
            con4.style.marginLeft = '8px';
            con4.style.border = 'solid 1px #eeeeee'
            document.querySelector('tbody#skuListTB').children[xx].querySelectorAll('td')[3].appendChild(con4);
        }
    
    
        // 2021-08-13 添加修改标题信息
        $("div.drug-tb").find("thead").find("th").eq(1).text('数量 | 补方数量 | 下单总量')
        $("div.drug-tb").find("thead").find("th").eq(2).text('单价（元）| 药品通用名')
        $("div.drug-tb").find("thead").find("th").eq(3).text('商品金额（元）| 药品规格')
    }

    async function loadFinsh() {
        while (1) {
            // 等待手机号按钮
            await sleep(500);
            if ($(('a[name="fullPhone"]')).length > 0) {
                document.querySelector('a[name="fullPhone"]').click();
                break;
            }
        }
        // 点击下方收货地址手机号
        while (1) {
            await sleep(500);
            if ($(('a#fullConsigneePhone')).length > 0) {
                document.querySelector('a#fullConsigneePhone').click();
                break;
            }
        }

        try {
            // 删除右边jimi的框框
            $("div.jimi-wrapper").remove();
            // 删除左边的菜单
            $("div.l-menu").remove();

            //$(document.body).css('background', 'pink');
        } catch {
            console.log('尝试删除多余元素失败');
        }

        // 加载按钮
        //setSubmit();
        // 尝试先获取药品信息
        getYpInfo();
        // 尝试先获取客户信息
        getKhInfo();
        
        
    }

    async function addListConcrtl(){
        // 处方列表快速打开功能
        while($(".fetab-btns").length == 0){
            await sleep(500);
        }
        $(".fetab-btns").append('<span style="margin-left: 20px;">快速打开</span><input type="number" id="opentabCount" style="margin-top:5px; width: 30px; height: 24px; border: 1px solid rgba(175, 175, 175, 0.473)" /><span>条处方</span>');
        $(".fetab-btns").append('<button id="opentab" style="margin-left: 20px; margin-top:5px; width: 80px; height: 24px">快速打开</button>');

        // 尝试添加iframe打开页面
        try{
            let allLink = $('td.only a:contains("详情"),td.multi a:contains("详情")');
            // if(allLink.length == 0) allLink = $('td.multi a:contains("详情")');
            if(allLink.length > 0){
                // 遍历所有链接
                for(let linkIndex=0; linkIndex<allLink.length; linkIndex++){
                    let linkSrc = allLink.eq(linkIndex).prop('href');
                    if(/rxId=\d{10,18}$/.test(linkSrc)){
                        let frameId = /rxId=(\d{10,18})$/.exec(linkSrc)[1];
                        if($('iframe#f_'+frameId).length == 0){
                            $('footer.footer').append('<iframe id="f_' + frameId + '" style="display: none;" src="' + linkSrc + '"></iframe>');
                        }
                    }
                }
                
            }
        }catch(error){
            console.warn(error.message);
        }

        

        $(document).on('click', 'button#opentab', async ()=>{
            let count = $('input#opentabCount').val();
            var allTd = $('td.only a:contains("详情"),td.multi a:contains("详情")');
            // if(allTd.length <= 0){
            //     allTd = $('td.multi a:contains("详情")');
            // }
            if(count == ''){
                count = allTd.length;
                $('input#opentabCount').val(count);
            }else{
                try{
                    count = Number(count);
                    if(count > allTd.length) count = allTd.length;
                }catch{
                    count = allTd.length;
                    $('input#opentabCount').val(count);
                }
            }

            for(let index=0; index<count; index++){
                GM_openInTab(allTd.eq(index).prop('href'), {'active': false, 'insert': true});
                await sleep(300);
            }

            

        });
    }

    // 开始点击，并自动获取信息
    if(window.location.href.includes('rx.shop.jd.com/rx/rxInfo_list.action')){
        // 处方列表页
        // console.log('处方列表');
        addListConcrtl();
    }else if(window.location.href.includes('rx.shop.jd.com/rx/rxInfo_auditView.action?rxId=')){
        // console.log('处方审核页');
        addConctrl();
        loadFinsh();
    }
    
})();