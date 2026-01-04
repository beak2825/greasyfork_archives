// ==UserScript==
// @name         广东烟草粤易购css显示优化及隐藏0.6(按页面分类)
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  none
// @match        *://www.yueyigou.com/*
// @match        https://dh.sztobacco.cn/*
// @match        *://96368.hntobacco.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467860/%E5%B9%BF%E4%B8%9C%E7%83%9F%E8%8D%89%E7%B2%A4%E6%98%93%E8%B4%ADcss%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96%E5%8F%8A%E9%9A%90%E8%97%8F06%28%E6%8C%89%E9%A1%B5%E9%9D%A2%E5%88%86%E7%B1%BB%29.user.js
// @updateURL https://update.greasyfork.org/scripts/467860/%E5%B9%BF%E4%B8%9C%E7%83%9F%E8%8D%89%E7%B2%A4%E6%98%93%E8%B4%ADcss%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96%E5%8F%8A%E9%9A%90%E8%97%8F06%28%E6%8C%89%E9%A1%B5%E9%9D%A2%E5%88%86%E7%B1%BB%29.meta.js
// ==/UserScript==

//0选择地区页页面调整(ok完美)
var intervalId1 = setInterval(function() {
    //将所有class="tip_txt"和所有class="enter_item"元素及其所有子元素和所有后代元素的字体设置为微软雅黑26号加粗字体
    var tipElements = [
        ...document.querySelectorAll('.tip_txt, .tip_txt *, .enter_item, .enter_item *')
    ];
    for (var i = 0; i < tipElements.length; i++) {
        if (tipElements[i] != null) {
            tipElements[i].style.fontFamily = '微软雅黑';
            tipElements[i].style.fontSize = '26px';
            tipElements[i].style.fontWeight = 'bold';
        }
    }

    //将#guide > div > div > h1这个元素及其所有子元素和所有后代元素的字体设置为微软雅黑32号加粗字体
    var guideElements = [
        document.querySelector('#guide > div > div > h1, #guide > div > div > h1 *')
    ];
    for (var j = 0; j < guideElements.length; j++) {
        if (guideElements[j] != null) {
            guideElements[j].style.fontFamily = '微软雅黑';
            guideElements[j].style.fontSize = '32px';
            guideElements[j].style.fontWeight = 'bold';
        }
    }

    clearInterval(intervalId1);
}, 500);




//①登录页页面调整(ok完美)
var intervalId2 = setInterval(function() {
    //登录页面登录框字体调整为26号字体
    var elements = [
        document.querySelector('.login_box')
    ];
    for (var i = 0; i < elements.length; i++) {
        if (elements[i] != null) {
            elements[i].style.fontFamily = '微软雅黑';
            elements[i].style.fontSize = '26px';
            elements[i].style.fontWeight = 'bold';
            var descendants = elements[i].querySelectorAll('*');
            for (var j = 0; j < descendants.length; j++) {
                descendants[j].style.fontFamily = '微软雅黑';
                descendants[j].style.fontSize = '26px';
                descendants[j].style.fontWeight = 'bold';
            }
        }
    }

    //将登录页的登录框整体放大至1.35倍
    var element = document.querySelector('.login_box');
    if (element) {
        element.style.transform = 'scale(1.35)';
    }
    clearInterval(intervalId2);
}, 500);




//②通用导航栏调整(ok完美)
var intervalId = setInterval(function() {
    // 欢迎您与我的会员(或我的订购)+返回商品首页
    var elements = [
        document.querySelector('.frm_header'),
        document.querySelector('.buy_banner_btn_goindex')
    ];
    for (var i = 0; i < elements.length; i++) {
        if (elements[i] != null) {
            elements[i].style.fontFamily = '微软雅黑';
            elements[i].style.fontSize = '22px';
            elements[i].style.fontWeight = 'bold';
            var descendants = elements[i].querySelectorAll('*');
            for (var j = 0; j < descendants.length; j++) {
                descendants[j].style.fontFamily = '微软雅黑';
                descendants[j].style.fontSize = '22px';
                descendants[j].style.fontWeight = 'bold';
            }
        }
    }

    // 顶部安全退出按钮宽度调整
    var quitBtnElement = document.querySelector('.cell.quit_btn.btn_success');
    if (quitBtnElement) {
        quitBtnElement.style.width = '99px';
    }

    // 将顶部我的订购这一行元素向左移动240像素
    var headerNavElement = document.querySelector('.frm_header_nav');
    if (headerNavElement) {
        headerNavElement.style.transform = 'translateX(-100px)';
    }

    clearInterval(intervalId); // 停止检测和运行
}, 500);






//③首页页面调整(ok完美)
var intervalId3 = setInterval(function() {
    //一键购买和暂不订货+购物车字体调整为26号
    var elements = [
        document.querySelector('.frm_info_handle'),//一键购买和暂不订货
        document.querySelector('.shopping_cart.btn_success')//购物车
    ];
    for (var i = 0; i < elements.length; i++) {
        if (elements[i] != null) {
            elements[i].style.fontFamily = '微软雅黑';
            elements[i].style.fontSize = '26px';
            elements[i].style.fontWeight = 'bold';
            var descendants = elements[i].querySelectorAll('*');
            for (var j = 0; j < descendants.length; j++) {
                descendants[j].style.fontFamily = '微软雅黑';
                descendants[j].style.fontSize = '26px';
                descendants[j].style.fontWeight = 'bold';
            }
        }
    }

    //用户信息栏字体调整为18号
    var element = document.querySelector('.frm_info_user');
    if (element != null) {
        element.style.fontFamily = '微软雅黑';
        element.style.fontSize = '18px';
        element.style.fontWeight = 'bold';
        var excludeElement = document.querySelector('.frm_info_handle');
        var descendants2 = element.querySelectorAll('*');
        for (var k = 0; k < descendants2.length; k++) {
            if (!excludeElement.contains(descendants2[k]) && descendants2[k] != excludeElement) {
                descendants2[k].style.fontFamily = '微软雅黑';
                descendants2[k].style.fontSize = '18px';
                descendants2[k].style.fontWeight = 'bold';
            }
        }
    }

    //首页广告移除
    var element12 = document.querySelector('#web_nav');
    if (element12) {
        element12.parentNode.removeChild(element12);
    }

    clearInterval(intervalId3);

}, 500);





//④订购页面调整(还未检测是否能运行)
var intervalId4 = setInterval(function() {
        //订购页移除用户展示信息(放在全局完美)
        let elements = document.querySelectorAll('#dragTable > tbody > tr > td:nth-child(3), #CA39A9BAAF500001316E101318591730 > div > div.cq_buy_main_box.cq_buy_main_product_box > div.cq_buy_main_content_box > div.cq_buy_main_product_searchbox > div:nth-child(2) > div.input_group > div > font:nth-child(2)');
        elements.forEach(function(element) {
            element.remove();
        });


        //订购页"最大可购量"和"需求量"这列文本居中,且"最大可购量"和"批发价"这列文本改为红色
        var elements1 = document.querySelectorAll('div.cq_buy_main_grid_c8[name="lmtqty"], div.cq_buy_main_grid_c5[name="req_qty"], div.cq_buy_main_grid_c5');
        for (var i = 0; i < elements1.length; i++) {
            elements1[i].style.textAlign = 'center';
        }
        var elements2 = document.querySelectorAll('div.cq_buy_main_grid_c3[name="whole_sale_price"], div.cq_buy_main_grid_c8[name="lmtqty"]');
        for (var k = 0; k < elements2.length; k++) {
            elements2[k].style.color = 'red';
        }

        //订购页面-商品列表这一行+商品列表字体调整
        var elements5 = [
            document.querySelector('#CA39A9BAAF500001316E101318591730 > div > div.cq_buy_main_box.cq_buy_main_product_box > div.cq_buy_main_title'),
            document.querySelector('#grid_product_body')
        ];
        for (var c = 0; c < elements5.length; c++) {
            if (elements5[c] != null) {
                elements5[c].style.fontFamily = '微软雅黑';
                elements5[c].style.fontSize = '22px';
                elements5[c].style.fontWeight = 'bold';
                var descendants = elements5[c].querySelectorAll('*');
                for (var j = 0; j < descendants.length; j++) {
                    descendants[j].style.fontFamily = '微软雅黑';
                    descendants[j].style.fontSize = '22px';
                    descendants[j].style.fontWeight = 'bold';
                }
            }
        }

        //(助记码这行)字体改为微软雅黑14号粗体
        var elements3 = document.querySelectorAll('#CA39A9BAAF500001316E101318591730 > div > div.cq_buy_main_box.cq_buy_main_product_box > div.cq_buy_main_content_box > div.cq_buy_main_product_grid > div.cq_buy_main_grid_header, #CA39A9BAAF500001316E101318591730 > div > div.cq_buy_main_box.cq_buy_main_product_box > div.cq_buy_main_content_box > div.cq_buy_main_product_grid > div.cq_buy_main_grid_header *');
        elements3.forEach(function(element) {
            element.style.fontFamily = '微软雅黑';
            element.style.fontSize = '16px';
            element.style.fontWeight = 'bold';
        });

        //品牌企业这一行"搜索框"宽度调整
        var element0 = document.querySelector('#filter_product');
        element0.style.width = '206px';

        //批发价这一行价格输入框宽度调整
        var elements55 = document.querySelectorAll('.buy_main_price_begin.form_control, .buy_main_price_end.form_control');
        elements55.forEach(function(element) {
            element.style.width = '28px';
        });


        //(品牌企业+批发价这两行)字体改为微软雅黑18号粗体
        var element3 = document.querySelector('#CA39A9BAAF500001316E101318591730 > div > div.cq_buy_main_box.cq_buy_main_product_box > div.cq_buy_main_content_box > div.cq_buy_main_product_searchbox');
        element3.style.fontFamily = '微软雅黑';
        element3.style.fontSize = '16px';
        element3.style.fontWeight = 'bold';

        var descendants3 = element3.querySelectorAll('*');
        for (var b = 0; b < descendants3.length; b++) {
            descendants3[b].style.fontFamily = '微软雅黑';
            descendants3[b].style.fontSize = '16px';
            descendants3[b].style.fontWeight = 'bold';
        }

        clearInterval(intervalId4); // 停止检测和运行
}, 2000);




//⑤历史订单页面调整(ok完美)
var intervalId5 = setInterval(function() {
    var scaleElement = document.querySelector('#order_list > div, .pagebar_con');
    var moveElement = document.querySelector('#order_list > div');
    var heightElement = document.querySelector('#order_list > div');
    var fontElement = document.querySelector('#order_list_box');
    var beginDateElement = document.querySelector('#begin_date');
    var endDateElement = document.querySelector('#end_date');
    var marginLeftElement = document.querySelector('.aside_sum_qty');

    if (scaleElement && moveElement && heightElement && fontElement && beginDateElement && endDateElement && marginLeftElement) {
        //将历史订单放大1.09倍
        scaleElement.style.transform = 'scale(1.09)';

        //订单列表下移40像素
        moveElement.style.position = 'relative';
        moveElement.style.top = '40px';

        //订单列表整体高度调整到880像素
        heightElement.style.height = '880px';



        //历史订单页字体设置
        fontElement.style.fontFamily = 'Microsoft YaHei';
        fontElement.style.fontSize = '22px';
        fontElement.style.fontWeight = 'bold';
        var allElements = fontElement.querySelectorAll('*');
        for (var i = 0; i < allElements.length; i++) {
            allElements[i].style.fontFamily = 'Microsoft YaHei';
            allElements[i].style.fontSize = '22px';
            allElements[i].style.fontWeight = 'bold';
        }

        //历史订单-开始日期框框宽度调整
        beginDateElement.style.width = '140px';

        //历史订单-结束日期框框宽度调整
        endDateElement.style.width = '140px';

        //历史订单-底部(***)条元素向右移动50像素(避免和前面元素重叠)
        marginLeftElement.style.marginLeft = '+50px';

        clearInterval(intervalId5); // 停止检测和运行
    }
}, 1000);




//⑥历史订单-订单详情页面调整(ok完美)--还有些问题(cpu占用高,页面跳动,把放大1.09倍功能去掉正常)
var intervalId6 = setInterval(function() {
    // 历史订单-订单详情列表字体调整
    var intervalId888 = setInterval(function() {
        var element = document.querySelector('#order_detail_box');
        if (element != null) {
            element.style.fontFamily = '微软雅黑';
            element.style.fontSize = '26px';
            element.style.fontWeight = 'bold';
            var descendants = element.querySelectorAll('*');
            for (var j = 0; j < descendants.length; j++) {
                descendants[j].style.fontFamily = '微软雅黑';
                descendants[j].style.fontSize = '26px';
                descendants[j].style.fontWeight = 'bold';
            }
        }

        // 历史订单-订单详情-商品 卷烟编码这一行高度调整到固定值88像素
        var element1 = document.querySelector('.order_goods_header.head.clarfix, #order_detail_content > div.order_goods_wrap > div.head.clarfix');
        if (element1 != null) {
            element1.style.height = '90px';
        }
        clearInterval(intervalId888);
    }, 1000);



    //历史订单-订单详情列表放大到1.09倍(将#order_detail > div替换成了.main_wrap),高度增加0.09倍像素,下移0.09倍像素
    //将id="order_detail_box"的元素的css以此元素顶部的中心点为原点,放大1.09倍,同时高度增加0.09倍像素,并下移0.09倍像素,用js实现
    var intervalId999= setInterval(function() {
        var element2 = document.querySelector('#order_detail > div');
        if (element2) {
            element2.style.transformOrigin = "top";
            element2.style.transform = "scale(1.09)";
            element2.style.height = (element2.offsetHeight * 1.09) + "px";
            element2.style.top = (element2.offsetTop + element2.offsetHeight * 0.09) + "px";
            clearInterval(intervalId999);
        }
    }, 1000);

    clearInterval(intervalId6); // 停止检测和运行
}, 1000);





