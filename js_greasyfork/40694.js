// ==UserScript==
// @name         EbsIntel
// @namespace    xiongfw@ebs.org.cn
// @version      0.1
// @description  测试版本暂时只支持企业、个体工商户自动填写字段，需要登录天眼查获取一些数据
// @author       Xiongfw
// @match        https://wxyz.ebs.org.cn/MpVerifyInfo/NewIndex/*
// @match        https://wxyz.ebs.org.cn/MpVerifyInfo/Index/*
// @match        http://*.gsxt.gov.cn/%7B*
// @match        http://*.gsxt.gov.cn/corp-query-entprise-info-primaryinfo*
// @match        http://*.gsxt.gov.cn/index.html
// @match        http://*.gsxt.gov.cn/corp-query-search-1.html
// @require      https://greasyfork.org/scripts/40093-xiongfw-data/code/xiongfw-data.js?version=262644
// @require      http://code.jquery.com/jquery-2.2.4.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/40694/EbsIntel.user.js
// @updateURL https://update.greasyfork.org/scripts/40694/EbsIntel.meta.js
// ==/UserScript==
(function() {

    'use strict';
    // clearValue(); // return;
    // if (!GM_getValue('EbsIntel')) {
    //     clearValue();
    //     location.reload();
    //     GM_setValue('EbsIntel', 'EbsIntel');
    //     return;
    // }
    var fullName;
    if (isEbsPage() && $("[value='成功审核']").length !== 0) {
        var ordersObj = {};
        ordersObj.id = $('table tr td:eq(1)').text();
        ordersObj.id = $.trim(ordersObj.id);
        ordersObj.name = $('table tr td:eq(3)').text();
        ordersObj.name = ordersObj.name.substring(0, ordersObj.name.indexOf('(申请昵称')) || ordersObj.name;
        ordersObj.name = ordersObj.name.replace(/\s/g, '').replace('(', '（').replace(')', '）');
        ordersObj.type = $('table tr:eq(1) td:eq(1)').text();
        ordersObj.type = ordersObj.type.substring(0, ordersObj.type.indexOf('-'));
        ordersObj.type = $.trim(ordersObj.type);
        fullName = ordersObj.name;

        $("[value='成功审核']").on('click', function() {
            $($('iframe')[1]).on('load', function() {
                $(this).contents().find('input.confirm-btn').on('click', function() {
                    for (let name of GM_listValues()) {
                        if (GM_getValue(name).indexOf(ordersObj.id) !== -1) {
                            GM_deleteValue(name);
                            // break;
                        }
                    }
                });
            });
        });

        $('[value="录音上传"],[value="下载录音"]').on('click', function() {
            $($('iframe')[1]).on('load', function() {
                $(this).contents().find('[name="Remark"]').text(getRemark($('table tr:eq(1) td:eq(1)').text() + $('table tr:eq(1) td:eq(3)').text()));
            });
        });

        if (ordersObj.type == '企业' || ordersObj.type == '个体工商户') {
            addGlobalStyle('.ebsintel-area { width: 5px; height: 100px;position: fixed; bottom:0; z-index: 1000;} .ebsintel-content { width: 120px; background: #2f3e45;position:fixed;z-index: 1000; bottom:0} .ebsintel-content ul { margin: 0; padding: 0; width: 100%; list-style: none; text-align: center; } .ebsintel-content li { width: 100%; padding: 10px 0; color: #40b2bf; } .ebsintel-content li:hover { cursor: pointer; background: cadetblue; border-radius: 3px 3px 0 0;color:white }}');
            $('body').prepend('<div id="ebsIntel"><div class="ebsintel-area"></div><div class="ebsintel-content"><ul> <li id="btn_setData">字段</li> <li id="btn_gsxt">工商</li> </ul></div></div>');
            var $ebscontent = $(".ebsintel-content");
            $ebscontent.hide();

            $(".ebsintel-area").mouseenter(function(e) {
                $ebscontent.slideDown();
            });

            $(".ebsintel-content").mouseleave(function() {
                $ebscontent.slideUp();
            });
            if (!GM_getValue(fullName)) {
                companyInti(ordersObj);
            }

            var setId = setInterval(function() { //核准日期
                if (GM_getValue(fullName)) {
                    addGlobalStyle('@font-face {' +
                        '    font-family: "tyc-num";' +
                        '    src: url(' + JSON.parse(GM_getValue(fullName)).tycFontUri + ') format("woff");' +
                        '}' +
                        '.tyc-num {' +
                        '    font-family: "tyc-num" !important;' +
                        '    font-style: normal;' +
                        '    color:red;' +
                        '}');
                    var hzrq = JSON.parse(GM_getValue(fullName)).hzrq;
                    $(".ebsintel-content ul").append($('<li class="tyc-num"></li>').text(hzrq));

                    console.log(GM_listValues());
                    console.log(GM_getValue(fullName));

                    clearInterval(setId);
                }
            }, 10);
            $('#btn_setData').on('click', setCompanyData);
            $('#btn_gsxt').on('click', function() {
                if (!GM_getValue(fullName)) {
                    alert('请登录天眼查，或者刷新一下试试看:)');
                    return;
                }
                GM_setValue('GsxtSearchName', fullName);
                GM_setValue('GsxtSearchQueryName', fullName);
                GM_openInTab(gsxtUrl[JSON.parse(GM_getValue(fullName)).province.substring(0, 2)][1], false);
            });
        } else {
            $('#btn_setData').on('click', function() { alert('暂不支持这个类型订单'); });
        }
    } else if (isGsxtPage()) {
        $(function() {
            fullName = $('.fullName').text().replace(/\s/g, '').replace('(', '（').replace(')', '）');
            GM_setClipboard(fullName);
            $('#btn_share').attr('id', 'btn_getData').on('click', getCompanyData);
        });
    } else if (isGsxtSearchPage()) {
        $(window).load(function() {
            if (GM_getValue('GsxtSearchName')) {
                $('#keyword').val(GM_getValue('GsxtSearchName'));
                GM_deleteValue('GsxtSearchName');
                setTimeout(() => {
                    $('#btn_query').trigger('click');
                }, 1000);
            }
        });
    } else if (isGsxtSearchQueryPage()) {
        $(function() {
            $('.search_list_item').each(function() {
                var h1Text = $(this).find('h1').text();
                if ($.trim(h1Text) === GM_getValue('GsxtSearchQueryName')) {
                    GM_deleteValue('GsxtSearchQueryName');
                    window.open($(this).attr('href'), '_self');
                    return false;
                }
            });
        });
    }

    function companyInti(ordersObj) {
        var pc = getCity(ordersObj.name);
        if (pc) {
            ordersObj.province = pc.province;
            ordersObj.city = pc.city;
        }
        getTycData(ordersObj);
    };

    function setCompanyData() { //自动填写字段
        if (!$('#verifyContent').contents().find('#name').length) {
            alert('请切换到填字段页面 :)');
            return;
        }
        if (!GM_getValue(fullName)) {
            alert('请登录天眼查，或者刷新一下试试看:)');
            return;
        }
        var company = JSON.parse(GM_getValue(fullName));
        if (!company.socialcreditCode) {
            alert('你还没到工商网保存数据哦 :)');
            return;
        }
        if (isNewOrders()) {
            newOrders();
        } else {
            oldOrders();
        }

        function newOrders() {
            var verifyContent = $('#verifyContent').contents();
            verifyContent.find('#name').val(company.name); //主体名称
            verifyContent.find('#socialcredit_code').val(company.socialcreditCode); //统一社会信用码
            $('#verifyContent')[0].contentWindow.$("#organization_type").combobox('select', company.organizationType); //机构类型
            $('#verifyContent')[0].contentWindow.$("#industry_category").val(company.classify); //保存行业分类
            $('#verifyContent')[0].contentWindow.getCategoryTabText(company.classify); //行业分类函数;
            verifyContent.find('#province').val(gsxtUrl[company.province.substring(0, 2)][0]); //省份
            $('#verifyContent')[0].contentWindow.changeProvince(() => { verifyContent.find('#city').val(company.city); }); //城市
            verifyContent.find('#registered_address').text(company.registeredAddress); //注册地址
            verifyContent.find('#legal_person').val(company.legalPerson); //法人
            verifyContent.find('#registered_capital').val(company.registeredCapital); //注册资本金
            verifyContent.find('#org_begin_date').val(company.orgBeginDate); //企业成立日期
            verifyContent.find('#org_validity_period').val(company.orgValidityPeriod); //企业营业期限
            verifyContent.find('#generic_business_type').text(company.genericBusinessType); //经营范围(一般经营范围)
            verifyContent.find('#front_business_type').text('无'); //经营范围(前置许可经营范围)
            alert("-------填完了，自己也要好好检查字段哦(●'◡'●)");
        }

        function oldOrders() {
            var verifyContent = $('#verifyContent').contents();
            verifyContent.find('#name').val(company.name); //主体名称
            verifyContent.find('#registered_id').val(company.socialcreditCode); //工商注册号
            verifyContent.find('#socialcredit_code').val(company.socialcreditCode); //统一社会信用码
            if ($('table tr:eq(1) td:eq(1)').text().indexOf('企业号') > 0) {
                verifyContent.find('#organization_code').val(company.socialcreditCode); //组织机构代码
            } else {
                verifyContent.find('#organization_code').val('无'); //组织机构代码
            }
            $('#verifyContent')[0].contentWindow.$("#enterprise_type").combobox('select', company.organizationType); //机构类型
            var regProvince = new RegExp('value="(\\d+)">' + gsxtUrl[company.province.substring(0, 2)][0]);
            var $province = verifyContent.find('#province');
            try {
                $province.val($province.html().match(regProvince)[1]); //省份
                $('#verifyContent')[0].contentWindow.changeProvince(() => {
                    var regCity = new RegExp('value="(\\d+)">' + company.city);
                    var $city = verifyContent.find('#city');
                    $city.val($city.html().match(regCity));
                }); //城市
            } catch (e) {
                console.log(e.message);
            }

            verifyContent.find('#registered_address').text(company.registeredAddress); //注册地址
            verifyContent.find('#legal_person').val(company.legalPerson); //法人
            verifyContent.find('#registered_capital').val(company.registeredCapital); //注册资本金
            verifyContent.find('#enterprise_establishment_date').val(company.orgBeginDate); //企业成立日期
            verifyContent.find('#enterprise_expired_date').val(company.orgValidityPeriod); //企业营业期限
            verifyContent.find('#generic_business_type').text(company.genericBusinessType); //经营范围(一般经营范围)
            verifyContent.find('#front_business_type').text('无'); //经营范围(前置许可经营范围)
            alert("-------填完了，自己也要好好检查字段哦(●'◡'●)");
        }
    }

    function getCompanyData() { //保存工商网的数据
        if (!GM_getValue(fullName)) {
            alert('------------请从订单页面打开工商网 :)');
            return;
        }
        var ordersObj = JSON.parse(GM_getValue(fullName));
        if (ordersObj.socialcreditCode) {
            alert('------------你已经保存过了哦 :)');
            return;
        }
        var primaryInfo = $('#primaryInfo').contents();
        var type = primaryInfo.find('dl:eq(2) dd').text();
        ordersObj.socialcreditCode = $.trim(primaryInfo.find('dl:eq(0) dd').text());
        ordersObj.name = fullName;
        ordersObj.organizationType = type.replace('（', '(').replace('）', ')');
        ordersObj.legalPerson = primaryInfo.find('dl:eq(3) dd').text();
        ordersObj.orgBeginDate = primaryInfo.find('dl:eq(5) dd').text();
        if ('个体工商户' === type) {
            ordersObj.registeredCapital = '无';
            ordersObj.orgValidityPeriod = '';
            ordersObj.registeredAddress = primaryInfo.find('dl:eq(9) dd').text();
            ordersObj.genericBusinessType = primaryInfo.find('dl:eq(10) dd').text();
        } else if (/分公司/.test(type)) {
            ordersObj.registeredCapital = '无';
            ordersObj.orgValidityPeriod = primaryInfo.find('dl:eq(7) dd').text();
            ordersObj.registeredAddress = primaryInfo.find('dl:eq(10) dd').text();
            ordersObj.genericBusinessType = primaryInfo.find('dl:eq(11) dd').text();
        } else if ('个人独资企业' === type) {
            ordersObj.registeredCapital = '无';
            ordersObj.orgValidityPeriod = '';
            ordersObj.registeredAddress = primaryInfo.find('dl:eq(8) dd').text();
            ordersObj.genericBusinessType = primaryInfo.find('dl:eq(9) dd').text();
        } else if (/合作/.test(type)) {
            ordersObj.registeredCapital = primaryInfo.find('dl:eq(4) dd').text();
            ordersObj.orgValidityPeriod = '';
            ordersObj.registeredAddress = primaryInfo.find('dl:eq(9) dd').text();
            ordersObj.genericBusinessType = primaryInfo.find('dl:eq(10) dd').text();
        } else if ('全民所有制' === type || '股份合作制' === type) {
            ordersObj.registeredCapital = primaryInfo.find('dl:eq(4) dd').text();
            ordersObj.orgValidityPeriod = primaryInfo.find('dl:eq(7) dd').text();
            ordersObj.registeredAddress = primaryInfo.find('dl:eq(10) dd').text();
            ordersObj.genericBusinessType = primaryInfo.find('dl:eq(12) dd').text();
        } else if ('有限合伙企业' === type) {
            ordersObj.registeredCapital = '无';
            ordersObj.orgValidityPeriod = primaryInfo.find('dl:eq(5) dd').text();
            ordersObj.orgBeginDate = primaryInfo.find('dl:eq(7) dd').text();
            ordersObj.registeredAddress = primaryInfo.find('dl:eq(10) dd').text();
            ordersObj.genericBusinessType = primaryInfo.find('dl:eq(11) dd').text();
        } else {
            ordersObj.registeredCapital = primaryInfo.find('dl:eq(4) dd').text();
            ordersObj.orgValidityPeriod = primaryInfo.find('dl:eq(7) dd').text();
            ordersObj.registeredAddress = primaryInfo.find('dl:eq(11) dd').text();
            ordersObj.genericBusinessType = primaryInfo.find('dl:eq(12) dd').text();
        }
        if (!JSON.parse(GM_getValue(fullName)).city) {
            var drjg = $('#primaryInfo').html().replace(/\s/g, '').match(/登记机关.+?">(.+?)</)[1];
            ordersObj.city = ordersObj.registeredAddress.match(/(?:.*省)?(.*?市)/);
            if (!ordersObj.city) {
                ordersObj.city = drjg.match(/(?:.*省)?(.*?市)/);
            }
            if (ordersObj.city) {
                ordersObj.city = ordersObj.city[1];
            } else {
                ordersObj.city = '';
            }
        }
        var companyStr = JSON.stringify(ordersObj, function(key, value) {
            if (key == 'registeredCapital') {
                return value.replace(/\.0{2,}/, '').replace(/\s/g, '');
            }
            if (key == 'orgBeginDate') {
                return value.replace(/[年月]/g, '-').replace('日', '').replace(/\s/, '');
            }
            if (key === 'orgValidityPeriod' && value !== '') {
                if ((value.substring(0, value.indexOf('年')) - new Date().getFullYear()) > 100) {
                    return '';
                }
                return value.replace(/[年月]/g, '-').replace('日', '').replace(/\s/, '');
            }
            return value;
        });
        GM_setValue(ordersObj.name, companyStr);
        alert("保存数据成功！(●'◡'●)");

    }

    function getTycData(ordersObj, callback) { //从天眼查抓取企业所属省和分类
        GM_xmlhttpRequest({
            method: 'get',
            url: 'https://www.tianyancha.com/search?key=' + encodeURI(ordersObj.name), //天眼查搜索地址
            onload: function(response) {
                var res = response.responseText;
                var reg = /<em>.+<\/em></;
                if (response.finalUrl.indexOf('verify') !== -1) {
                    // GM_openInTab(response.finalUrl, false);
                    layer.open({
                        type: 2,
                        title: '请输入验证码',
                        shadeClose: true, //点击遮罩关闭层
                        area: ['800px', '620px'],
                        content: response.finalUrl
                    });
                    return;
                } else if (response.finalUrl.indexOf('login') !== -1) {
                    if (confirm('请登录天眼查,要不然无法正常使用 :(')) {
                        GM_openInTab('https://www.tianyancha.com/login', false);
                    }
                    return;
                } else if (res.indexOf('没有找到相关结果') !== -1 || !reg.test(res)) {
                    alert('主体证件可能太新了或主体名称错误');
                    ordersObj.province = ordersObj.province || '全国';
                    ordersObj.classify = '零售业';
                    ordersObj.hzrq = '无';
                    GM_setValue(ordersObj.name, JSON.stringify(ordersObj));
                    return;
                }
                try {
                    ordersObj.province = ordersObj.province || res.match(/<span class="pr30 ">(.*?)<\/span>/)[1]; //获取省份
                    var tycUrl = res.match(/https:\/\/www\.tianyancha\.com\/company\/\d+/)[0]; //抓取企业详细的URL
                    getTycPage(tycUrl);
                } catch (error) {
                    ordersObj.province = ordersObj.province || '全国';
                    ordersObj.classify = '零售业';
                    ordersObj.hzrq = '无';
                    GM_setValue(ordersObj.name, JSON.stringify(ordersObj));
                    console.log('获取天眼查数据出错' + error.message);
                    return;
                }
            }
        });

        function getTycPage(url) { //从天眼查获取企业的数据
            GM_xmlhttpRequest({
                method: 'get',
                url: url,
                onload: function(response) {
                    var res = response.responseText;
                    try {
                        var tycNumReg1 = /<link rel="stylesheet" href="(https:\/\/static\.tianyancha\.com\/fonts-styles\/css.+?font\.css)">/;
                        var tycNumReg2 = /<link rel="stylesheet" href="(https:\/\/static\.tianyancha\.com\/web-require-js\/public\/styles\/.+?\.css)">/;
                        var tycNumCssUrl1 = res.match(tycNumReg1);
                        var tycNumCssUrl2 = res.match(tycNumReg2);
                        if (tycNumCssUrl1) {
                            $.get(tycNumCssUrl1[1], function(data) {
                                var woffReg = /url\(('https:\/\/static\.tianyancha\.com\/fonts-styles\/fonts.+?tyc-num\.woff')\)/;
                                if (Array.isArray(data.match(woffReg))) {
                                    ordersObj.tycFontUri = data.match(woffReg)[1];
                                } else {
                                    ordersObj.tycFontUri = '""';
                                    console.log('存放tyc-num字体文件的CSS内容可能更新了');
                                }
                            });
                        } else {
                            $.get(tycNumCssUrl2[1], function(data) {
                                var woffReg = /, url\(("https:\/\/static\.tianyancha\.com\/web-require-js\/public\/fonts\/tyc-num-.+?\.woff")\)/;
                                if (Array.isArray(data.match(woffReg))) {
                                    ordersObj.tycFontUri = data.match(woffReg)[1];
                                } else {
                                    ordersObj.tycFontUri = '""';
                                    console.log('存放tyc-num字体文件的CSS内容可能更新了');
                                }
                            });
                        }
                        var tycNum = res.match(/核准日期.+?tyc-num".*?>(.+?)</)[1]; //核准日期
                    } catch (error) {
                        console.log('获取tyc-num字体URI失败-------' + error.message);
                        ordersObj.tycFontUri = '""';
                        var tycNum = '无';
                    }

                    try {
                        var classify = res.match(/<\/span><\/td><td colspan="2">(.+)<\/td><\/tr><tr><td class\="table-left">营业期限/)[1]; //抓行业分类
                        classify = classify === '未公开' ? '零售业' : classify;
                        classify = classify === '批发业' ? '零售业' : classify;

                    } catch (error) {
                        var classify = '零售业';
                        console.log(error.message);
                    }
                    ordersObj.classify = classify;
                    ordersObj.hzrq = tycNum;
                    var tycSetId = setInterval(() => {
                        if (ordersObj.tycFontUri) {
                            GM_setValue(ordersObj.name, JSON.stringify(ordersObj));
                            console.log(ordersObj);
                            clearInterval(tycSetId);
                        }
                    }, 10);
                    if (callback instanceof Function) {
                        callback();
                    }
                }
            });
        }
    }

    function getCity(companyName) { //根据公司名字返回省市
        var province, city;
        var [strStart, strEnd] = [0, 2];
        var zhiXiaShi = { 110000: "北京市", 120000: "天津市", 310000: "上海市", 500000: "重庆市" };
        var code = '';
        if (typeof companyName !== 'string') {
            return null;
        }
        for (; strEnd <= companyName.length; strStart++, strEnd++) {
            var tempstr = companyName.substring(strStart, strEnd);
            if (citydata.indexOf(tempstr) > 0) {
                var reg = new RegExp(`\\d+":"${tempstr}`, 'g');
                var results = citydata.match(reg);
                if (!Array.isArray(results) || results.length !== 1) {
                    if (code) {
                        return {
                            province: provinces[code]
                        };
                    }
                    return null;
                }
                let coderesult = results[0].match(/\d{6}/)[0];
                if (code && coderesult.substring(0, 2) !== code.substring(0, 2)) {
                    return {
                        province: provinces[code]
                    };
                } else {
                    code = coderesult;
                }
                if (provinces[code] && !zhiXiaShi[code]) {
                    strStart++;
                    strEnd++;
                    continue;
                }
                break;
            }
        }
        var provincecode = code.substring(0, 2) + '0000';
        if (zhiXiaShi[provincecode]) {
            return {
                province: zhiXiaShi[provincecode],
                city: zhiXiaShi[provincecode]
            };
        } else {
            province = provinces[provincecode];
            city = citys[code.substring(0, 4) + '00'];
            return {
                province,
                city
            };
        }
    }

    function getRemark(str) { //录音上传话术
        var remark = '已验证公众号运营人身份真实性、授权真实性及与运营人核对了以下资料真实性：基本资料、发票信息、';
        remark += str.indexOf('资质认证') === -1 ? '认证名称、' : '';
        if (str.indexOf('企业号认证') !== -1) {
            remark += '企业号使用权、';
            remark = remark.replace('已验证公众号', '已验证企业号');
        } else {
            remark += '公众号使用权、';
        }
        if (str.indexOf('对公转账') !== -1) {
            remark += '打款金额';
        } else {
            remark = remark.substring(0, remark.length - 1);
        }
        return remark;
    }

    function isNewOrders() { //判断新旧订单
        if (location.href.indexOf('NewIndex') != -1) {
            return true;
        }
        return false;
    }

    function isEbsPage() { //判断当前页面是否是审核系统页面
        if (location.href.indexOf("https://wxyz.ebs.org.cn/MpVerifyInfo/NewIndex/") != -1 || location.href.indexOf("https://wxyz.ebs.org.cn/MpVerifyInfo/Index/") != -1) {
            return true;
        }
        return false;
    }

    function isGsxtSearchQueryPage() { // 工商网搜索结果页面
        if (/http:\/\/\w+\.gsxt\.gov\.cn\/corp-query-search-1\.html/.test(location.href)) {
            return true;
        }
        return false;
    }


    function isGsxtPage() { //判断当前页面是否是工商网
        if (/http:\/\/\w{2,3}\.gsxt\.gov\.cn\/%7B.*%7D/.test(location.href) || location.href.indexOf('primaryinfo') !== -1) {
            return true;
        }
        return false;
    }

    function isGsxtSearchPage() { //工商网搜索页面
        if (/http\:\/\/\w+\.gsxt\.gov.cn\/index.html/.test(location.href)) {
            return true;
        }
        return false;
    }

    function isEmptyObject(obj) { //判断对象是否为空
        for (var x in obj) {
            return false;
        }
        return true;
    }

    function clearValue() { //清空GM_setValue
        for (var item of GM_listValues()) {
            GM_deleteValue(item);
        }
    }

    function addGlobalStyle(css) { //添加全局css
        var elHead, elStyle;
        elHead = document.head;
        elStyle = document.createElement('style');
        elStyle.innerText = css;
        elHead.appendChild(elStyle);
    }
})();