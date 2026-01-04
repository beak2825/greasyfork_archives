// ==UserScript==
// @name         CSGO饰品价格对比脚本_Steam挂刀助手版
// @connect      *
// @version      2.2.5
// @description  将各个CSGO饰品交易平台的价格放在一起显示，省去打开多个网页的繁琐操作！该版本原作者为RookieHong，因饰品平台接口网页已更新过原版本不适用，因此大地球就更新了下，有问题可在公众号（Steam挂刀助手）反馈给我，感谢大家支持。 支持平台：BUFF、C5、IGXE、悠悠有品
// @updater      大地球
// @origin_author RookieHong
// @grant        GM_xmlhttpRequest
// @match        https://www.c5game.com/csgo*
// @match        https://www.igxe.cn/market/csgo*
// @match        https://buff.163.com/market/csgo*
// @match        https://www.v5fox.com/csgo*
// @match        https://www.youpin898.com/market/csgo?gameId=730*
// @match        http://www.898yp.com/market/csgo?gameId=730*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @namespace https://greasyfork.org/users/209766
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/456770/CSGO%E9%A5%B0%E5%93%81%E4%BB%B7%E6%A0%BC%E5%AF%B9%E6%AF%94%E8%84%9A%E6%9C%AC_Steam%E6%8C%82%E5%88%80%E5%8A%A9%E6%89%8B%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/456770/CSGO%E9%A5%B0%E5%93%81%E4%BB%B7%E6%A0%BC%E5%AF%B9%E6%AF%94%E8%84%9A%E6%9C%AC_Steam%E6%8C%82%E5%88%80%E5%8A%A9%E6%89%8B%E7%89%88.meta.js
// ==/UserScript==

//UUYP接口更新 Cookie需定时登陆自己账号更新(大概15天一次)
function GetUUYPCookie(){
    var UUYPCookie = "填写自己UUYP账号Cookie"
    return UUYPCookie
}

// 防止点击价格列表时触发重叠的物品点击事件
function stopBubbling(e) {
    e = window.event || e;
    if (e.stopPropagation) {
        e.stopPropagation();      //阻止事件 冒泡传播
    } else {
        e.cancelBubble = true;   //ie兼容
    }
}

//去除名字中的所有空格
function Trim(str) {
    return str.replace(/\s*/g, "");
}

//用来替代GM_addStyle的方法
function addStyle(cssStr) {
    try {
        let node = document.createElement('style');
        node.textContent = cssStr;
        document.querySelector(':root').appendChild(node);
    } catch (e) { }
}

//生成表单内容的json结构体
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a,
        function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
    return o;
};

//IGXE上的生成下一页链接的函数
function IGXE_gen_url(url, params) {
    var new_params = {};
    var new_params_length = 0;
    for (var key in params) {
        if (params[key]) {
            new_params[key] = params[key];
            new_params_length += 1;
        }
    }
    if (new_params_length <= 0) {
        return url;
    }

    return url + '?' + jQuery.param(new_params);
};

$(document).ready(function () {
    var myScriptStyle = '.myTitle {font-weight: bold;} \
                    .mySum {color: #429605;}\
                    .myPrice{color: #0b84d3;}\
                    .c5li{margin: 0px!important;white-space: nowrap; font-size: 12px; list-style-type:none;}\
                    .igli{padding:4px; font-size: 12px; white-space: nowrap; list-style-type:none;}\
                    .buffli{ width:auto!important; height: auto!important; float:none!important; margin: 0px!important; padding:4px!important; font-size: 12px; white-space: nowrap; border: inherit!important; border-radius: 0!important; background: #959595!important; }\
                    .buffli a{background: #959595!important; text-align: left!important;}\
                    .v5li {padding: 4px; font-size: 12px; white-space: nowrap; list-style-type:none;}\
                    .youpinli{padding:4px; font-size: 12px; white-space: nowrap; list-style-type:none;}'; // list-style-type:none;是为了去掉列表元素前面的小点，即::marker
    myScriptStyle = myScriptStyle + '/* 容器 <div> - 需要定位下拉内容 */\
.dropdown {\
    position: relative;\
    display: inline-block;\
}\
\
/* 下拉内容 (默认隐藏) */\
.c5-dropdown-content {\
    display: none;\
    position: absolute;\
    background-color: #1c2734!important;\
    min-width: 160px;\
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);\
    z-index: 9999;\
}\
\
/* 下拉菜单的链接 */\
.c5-dropdown-content a {\
    color: white;\
    padding: 12px 16px;\
    text-decoration: none;\
    display: block;\
}\
\
/* 鼠标移上去后修改下拉菜单链接颜色 */\
.c5-dropdown-content a:hover {background-color: #313d4d!important;}\
\
/* 下拉内容 (默认隐藏) */\
.igxe-dropdown-content {\
    display: none;\
    position: absolute;\
    background-color: #1c2734!important;\
    min-width: 160px;\
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);\
    z-index: 9999;\
}\
\
/* 下拉菜单的链接 */\
.igxe-dropdown-content a {\
    color: white;\
    padding: 12px 16px;\
    text-decoration: none;\
    display: block;\
}\
\
/* 鼠标移上去后修改下拉菜单链接颜色 */\
.igxe-dropdown-content a:hover {background-color: #313d4d!important;}\
\
/* 下拉内容 (默认隐藏) */\
.buff-dropdown-content {\
    display: none;\
    position: absolute;\
    background-color: #1c2734!important;\
    min-width: 160px;\
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);\
    z-index: 9999;\
}\
\
/* 下拉菜单的链接 */\
.buff-dropdown-content a {\
    color: white;\
    padding: 12px 16px;\
    text-decoration: none;\
    display: block;\
}\
\
/* 鼠标移上去后修改下拉菜单链接颜色 */\
.buff-dropdown-content a:hover {background-color: #f2efef!important;}\
\
/* 下拉内容 (默认隐藏) */\
.v5-dropdown-content {\
    display: none;\
    position: absolute;\
    background-color: #1c2734!important;\
    min-width: 160px;\
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);\
    z-index: 9999;\
}\
\
/* 下拉菜单的链接 */\
.v5-dropdown-content a {\
    color: white;\
    padding: 12px 16px;\
    text-decoration: none;\
    display: block;\
}\
\
\
/* 鼠标移上去后修改下拉菜单链接颜色 */\
.v5-dropdown-content a:hover {background-color: #313d4d!important;}\
\
/* 下拉内容 (默认隐藏) */\
.youpin-dropdown-content {\
    display: none;\
    position: absolute;\
    background-color: #1c2734!important;\
    min-width: 160px;\
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);\
    z-index: 9999;\
}\
\
/* 下拉菜单的链接 */\
.youpin-dropdown-content a {\
    color: white;\
    padding: 12px 16px;\
    text-decoration: none;\
    display: block;\
}\
/* 鼠标移上去后修改下拉菜单链接颜色 */\
.youpin-dropdown-content a:hover {background-color: #313d4d!important;}';
    addStyle(myScriptStyle);

    if (location.href.indexOf('c5game.com') > 0) {
        c5();
    }
    else if (location.href.indexOf('igxe.cn') > 0) {
        igxe();
    }
    else if (location.href.indexOf('buff.163.com') > 0) {
        buff();
    }
    else if (location.href.indexOf('v5fox.com') > 0) {
        v5fox();
    }
    else if (location.href.indexOf('youpin898.com') > 0) {
        youpin();
    }
    else if (location.href.indexOf('898yp.com') > 0) {
        youpin();
    }
});

function addC5(c5URL, li, itemName) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: c5URL,
        onload: function (response) {
            var doc = (new DOMParser).parseFromString(response.responseText, 'text/html');
            var body = doc.querySelector('body');
            var items = $(body).find('.list').find('.li-btm');
            var hasNextPage = $(body).find('.el-pager').find('.li').length == 0 ? false : true;
            for (var i = 0; i < items.length; i++) {
                var name = $(items[i]).find('h4').text();
                if (Trim(name) == Trim(itemName)) {
                    var price = $(items[i]).find('.price').text().replace('￥','').replace(' ','');
                    var url = 'https://www.c5game.com/csgo?keyword=' + name + '&page=1';
                    var sum = $(items[i]).find('.count').text().replace('件在售','').replace(' ','');
                    //sum = sum.substring(0, sum.length - 3);
                    $(li).html('<a href="' + url + '" style="padding: 0px"><span class="myTitle">C5</span>' + '在售：<span class="mySum">' + sum + '</span>售价：<span class="myPrice">' + price + '</span></a>');
                    return price;
                }
            }
            if (!hasNextPage) $(li).html('<a href="javascript:return false;" style="padding: 0px"><span class="myTitle">C5：</span><span style="color: #FF0000">查找不到数据！</span></a>');  //若没有下一页则可以判断没有该物品的数据
            else {
                var cur_page = $(body).find('.pagination').find('.active').find('a').text();
                var next_page = cur_page + 1;
                var url = 'https://www.c5game.com/csgo?keyword=' + itemName + '&page=' + next_page;
                addC5(url, li, itemName);
            }
        }
    })
}

function addIGXE(igxeURL, li, itemName) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: igxeURL,
        onload: function (response) {
            var doc = (new DOMParser).parseFromString(response.responseText, 'text/html');
            var body = doc.querySelector('body');
            var items = $(body).find(".list").find('a');
            var hasNextPage = $(body).find('.paginate .btn-next').disabled;   //判断是否有下一页
            for (var i = 0; i < items.length; i++) {
                var name = $(items[i]).find('div.name').text().trim();
                if (Trim(name) == Trim(itemName)) {
                    var url = 'https://www.igxe.cn' + $(items[i]).attr('href');
                    var sum = $(items[i]).find('div.stock').text().trim().substring(3);
                    var price = $(items[i]).find('div.price').text().trim().replace("￥","");
                    $(li).html('<a href="' + url + '" style="padding: 0px"><span class="myTitle">IGXE</span>' + '在售：<span class="mySum">' + sum + '</span>售价：<span class="myPrice">' + price + '</span></a>');
                    return price;
                }
            }
            if (!hasNextPage) $(li).html('<a href="javascript:return false;" style="padding: 0px"><span class="myTitle">IGXE：</span><span style="color: #FF0000">查找不到数据！</span></a>');  //若没有下一页则可以判断没有该物品的数据
            else {  //走igxe网站的流程到下一页查询
                var page_no = parseInt($(body).find('.paginate .el-pager .active').textContent) + 1
                var url_param = $(body).find('#params_form').serializeObject(); //params_form是网站上的一个隐藏元素，存放各种表单信息
                url_param['page_no'] = page_no; //把里面的page_no项换成下一页
                url_param['_t'] = new Date().getTime(); //得到当前时间戳
                url = 'https://www.igxe.cn/market/csgo?sort=3&keyword=' + itemName + '&page_no=' + page_no.toString();
                addIGXE(url, li, itemName); //递归调用该函数直到找到该物品
            }
        }
    });
}

function addBUFF(buffURL, li, itemName) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: buffURL,
        onload: function (response) {
            var data = $.parseJSON(response.responseText);
            if ('error' in data) {
                $(li).html('<a href="https://buff.163.com/?game=csgo" style="padding: 0px"><span class="myTitle">BUFF：</span><span style="color: #FF0000">需要登录BUFF！</span></a>');
                return;
            }
            data = data.data;
            for (var i = 0; data.items != 'undefined' && i < data.items.length; i++) {
                var name = data.items[i].name;
                if (Trim(name) == Trim(itemName)) {
                    var url = 'https://buff.163.com/market/goods?goods_id=' + data.items[i].id + '&from=market#tab=selling';
                    var sum = data.items[i].sell_num;
                    var price =  data.items[i].sell_min_price;
                    var steamPrice = data.items[i].goods_info.steam_price_cny;
                    var PricePercent = parseFloat(price / (steamPrice / 1.15)).toFixed(2);
                    //(li).html('<a href="' + url + '" style="padding: 0px"><span class="myTitle">BUFF<span>' + '比例：'+ PricePercent +  '</span>售价：<span class="myPrice">' + price +  ' 在售：<span class="mySum">' + sum + '</span> </a>'
                    //    );
                    $(li).html('<a href="' + url + '" style="padding: 0px"><span class="myTitle">BUFF  <span>' +  ' 在售：<span class="mySum">' + sum + '  售价：<span class="myPrice">' + price + '</span> </a>'
                               + '<a href="' + url + '" style="padding: 0px"><span style="color:#FFFF00" class="myTitle">BUFF<span style="color:#FFFF00">' + '  挂刀比例：'+ PricePercent +  '</span> </a>');
                    return [price,steamPrice];
                }
            }
            var total_pages = data.total_page;
            var cur_page = data.page_num;
            if (cur_page >= total_pages) $(li).html('<a href="javascript:return false;" style="padding: 0px"><span class="myTitle">BUFF：</span><span style="color: #FF0000">查找不到数据！</span></a>');
            else {
                var next_page = cur_page + 1;
                var url = 'https://buff.163.com/api/market/goods?game=csgo&page_num=' + next_page + '&search=' + itemName.trim() + '&_=' + (new Date()).valueOf().toString();
                addBUFF(url, li, itemName);
            }
        }
    });
}

function addV5(v5URL, li, itemName) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: v5URL,
        onload: function (response) {
            var doc = (new DOMParser).parseFromString(response.responseText, 'text/html');
            var body = doc.querySelector('body');
            var items = $(body).find(".list-box").find('a');
            var hasNextPage = $(body).find('.laypage_next').length == 0 ? false : true;   //判断是否有下一页
            for (var i = 0; i < items.length; i++) {
                var name = $(items[i]).find('div.list-item-top').find('div.list-text-box').find('h5').text().trim();
                if (Trim(name) == Trim(itemName)) {
                    var url = 'https://www.v5fox.com' + $(items[i]).attr('href');
                    var sum = $(items[i]).find('div.list-item-bot').find('div.r').text().trim();
                    var price = $(items[i]).find('div.list-item-top').find('div.list-text-box').find('p').find('span').text().trim();
                    $(li).html('<a href="' + url + '" style="padding: 0px"><span class="myTitle">V5FOX：</span>' + '在售：<span class="mySum">' + sum + '</span>售价：<span class="myPrice">' + price + '</span></a>');
                    return;
                }
            }
            if (!hasNextPage) $(li).html('<a href="javascript:return false;" style="padding: 0px"><span class="myTitle">V5FOX：</span><span style="color: #FF0000">查找不到数据！</span></a>');
            else {
                var cur_page = $('.laypage_curr').text();
                var next_page = cur_page + 1;
                var url = 'https://www.v5fox.com/csgo/0-0?keyword=' + itemName + '&pageNum=' + next_page;
                addV5(url, li, itemName);
            }
        }
    });
}

function addyoupin_buy(youpin_url, li, itemName) {
    var pageIndex = 1
    var data_str = `{\"listType\":\"30\",\"gameId\":\"730\",\"keyWords\":\"${itemName}\",\"stickers\":{},\"stickersIsSort\":false,\"pageIndex\":${pageIndex},\"pageSize\":20,\"sortType\":\"0\",\"listSortType\":\"2\"}`;
    console.log(data_str)
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://api.youpin898.com/api/homepage/es/template/GetCsGoPagedList',
        data: data_str,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/110.0",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "Content-Type": "application/json",
            "AppType": "1",
            "Authorization": GetUUYPCookie(),
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site"
                },
        onload: function (response) {
            console.log(response)
            response = JSON.parse(response.response);
            var items = response.Data;
            if (items == null) {
                $(li).html('<a href="javascript:return false;" style="padding: 0px"><span class="myTitle">悠悠出售：</span><span style="color: #FF0000">查找不到数据！</span></a>');
                return;
            }
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var name = item.CommodityName;
                if (Trim(name) == Trim(itemName)) {
                    var url = 'http://www.youpin898.com/goodInfo?id=' + item.Id;
                    var sum = item.OnSaleCount;
                    var price = item.Price;
                    $(li).html('<a href="' + url + '" style="padding: 0px"><span class="myTitle">UUYP</span>' + '在售：<span class="mySum">' + sum + '</span>售价：<span class="myPrice">' + price + '</span></a>');
                    return price;
                }
            }
        }
    });
}

function addyoupin_lease(youpin_url, li, itemName) {
    var pageIndex = 1
    var data_str = `{\"listType\":\"30\",\"gameId\":\"730\",\"keyWords\":\"${itemName}\",\"pageIndex\":${pageIndex},\"pageSize\":20,\"sortType\":\"0\",\"listSortType\":\"2\"}`;
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://api.youpin898.com/api/homepage/es/template/GetCsGoPagedList',
        data: data_str,
        headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/110.0",
                "Accept": "application/json, text/plain, */*",
                "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
                "Content-Type": "application/json",
                "AppType": "1",
                "Authorization": GetUUYPCookie(),
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-site"
        },
        onload: function (response) {
            response = JSON.parse(response.response);
            var items = response.Data;
            if (items == null) {
                $(li).html('<a href="javascript:return false;" style="padding: 0px"><span class="myTitle">UUYP出租：</span><span style="color: #FF0000">查找不到数据！</span></a>');
                return;
            }
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var name = item.CommodityName;
                if (Trim(name) == Trim(itemName)) {
                    var url = 'http://www.youpin898.com/goodInfo?id=' + item.Id;
                    var sum = item.OnLeaseCount;
                    var short_price = item.LeaseUnitPrice;
                    var long_price = item.LongLeaseUnitPrice;
                    //var shortPricePercent = parseFloat(short_price * 8 *365 / 16 / / steamPrice).toFixed(2);
                    //var longPricePercent = parseFloat(price / steamPrice).toFixed(2);
                    $(li).html('<a href="' + url + '" style="padding: 0px"><span class="myTitle">悠悠</span>' + '出租：<span class="mySum">' + sum + '</span>短租：<span class="myPrice">¥' + short_price + '\/天</span>长租：<span class="myPrice">¥' + long_price + '\/天</span></a>');
                    return;
                }
            }
            $(li).html('<a href="javascript:return false;" style="padding: 0px"><span class="myTitle">悠悠出租：</span><span style="color: #FF0000">查找不到数据！</span></a>');
        }
    });
}

function c5() {
    console.log("--start--");

    $('.list').on('mouseenter', 'div:not(.el-col)', function () { // 选择不包含c5li类的li，否则会嵌套触发事件
        if ($(this).find('li').length > 0) {
            $(this).find('li').css('max-height', 'none');
            $(this).find('li').css('overflow', 'visible');
            return;
        }

        $(this).attr('mouseover', 'true');   //当前鼠标在该物品上
        //新创建一个列表来存放各个饰品网站的相同物品数据
        // var list = $('<ul class="rm-menu rm-css-animate rm-menu-expanded" aria-hidden="false" style="max-height: 0px; display: block; overflow: hidden; padding: 0px; position: absolute; z-index: 999999; left:-0.125em; top: -1px;"></ul>');
        var list = $('<ul class="c5-dropdown-content" style="max-height: 0px; display: block; overflow: hidden; padding: 0px; position: absolute; z-index: 999999; left:-0.125em; top: -1px;"></ul>');
        var itemName = $(this).find('h4')[0].outerText; //获取该物品的名字
        //var itemName = $(this).find('h4')[0].textContent;

        var youpinURL = 'https://api.youpin898.com/api/homepage/es/template/GetCsGoPagedList'
        var youpin_leaseLi = $('<li class="rm-menu-item c5li" style="height: 25px;"><span class="myTitle">悠悠出租：</span><span>载入中...</li>');
        $(list).append(youpin_leaseLi);
        addyoupin_lease(youpinURL, youpin_leaseLi, itemName);  //获取悠悠有品上出租的数据

        // var igxeURL = 'https://www.igxe.cn/csgo/730?keyword=' + itemName;
        var igxeURL = 'https://www.igxe.cn/market/csgo?sort=3&keyword=' + itemName;
        var igxeLi = $('<li class="c5li" style="height: 25px;"><span class="myTitle">IGXE：</span><span>载入中...</li>');
        $(list).append(igxeLi);

        var IGXEprice = addIGXE(igxeURL, igxeLi, itemName);  //获取igxe上的数据
        console.log("--IGXEprice--");
        console.log(IGXEprice);
        console.log("--IGXEprice--");

        var youpinURL = 'https://api.youpin898.com/api/homepage/es/template/GetCsGoPagedList'
        var youpin_buyLi = $('<li class="rm-menu-item c5li" style="height: 25px;"><span class="myTitle">悠悠出售：</span><span>载入中...</li>');
        $(list).append(youpin_buyLi);
        addyoupin_buy(youpinURL, youpin_buyLi, itemName);  //获取悠悠有品上出售的数据

        var buffURL = 'https://buff.163.com/api/market/goods?game=csgo&page_num=1&search=' + itemName.trim() + '&_=' + (new Date()).valueOf().toString();
        var buffLi = $('<li class="rm-menu-item c5li" style="height: 25px;"><span class="myTitle">BUFF：</span><span>载入中...</li>');
        $(list).append(buffLi);
        addBUFF(buffURL, buffLi, itemName);  //获取BUFF上的数据

        //var v5URL = 'https://www.v5fox.com/csgo/0-0?keyword=' + itemName;
        //var v5Li = $('<li class="rm-menu-item c5li" style="height: 25px;"><span class="myTitle">V5FOX：</span><span>载入中...</li>');
        //$(list).append(v5Li);
        //addV5(v5URL, v5Li, itemName);  //获取V5FOX上的数据

        if ($(this).attr('mouseover') == 'true') {   //若鼠标还在该物品上就不隐藏刚创建的列表
            $(list).css('max-height', 'none');
            $(list).css('overflow', 'visible');
        }
        $(this).append(list);
        $('.csgo-list li').css('overflow', 'visible'); // 这个css属性如果不修改则字不能溢出显示
    });

    //$('.list').on('mouseleave', 'div:not(.el-col)', function () { // 选择不包含c5li类的li，否则会嵌套触发事件
    $('.list').on('mouseleave', 'el-col', function () { // 选择不包含c5li类的li，否则会嵌套触发事件
        if ($(this).find('li').length > 0) {
            $(this).find('li').css('max-height', '0px');
            $(this).find('li').css('overflow', 'hidden');
            $(this).attr('mouseover', 'false');
        }
    });
}


function igxe() {
    $('.list').on('mouseenter', 'a.item', function () {
        if ($(this).find('div.igxe-dropdown-content').length > 0) {
            $(this).find('div.igxe-dropdown-content').css('display', 'block');
            return;
        }

        $(this).css({
            display: 'inline - block'
        });
        $(this).attr('mouseover', 'true');   //当前鼠标在该物品上

        var list = $('<ul class="igxe-dropdown-content"></ul>');
        var itemName = $(this).find('div.name').text();

        //var c5URL = 'https://www.c5game.com/csgo/default/result.html?k=' + itemName + '&page=1';
        var c5URL = 'https://www.c5game.com/csgo?keyword=' + itemName + '&page=1';
        console.log(c5URL)
        var c5Li = $('<li class="igli"><span class="myTitle">C5：</span><span>载入中...</li>');
        $(list).append(c5Li);
        addC5(c5URL, c5Li, itemName);  //获取C5上的数据

        var buffURL = 'https://buff.163.com/api/market/goods?game=csgo&page_num=1&search=' + itemName.trim() + '&_=' + (new Date()).valueOf().toString();
        var buffLi = $('<li class="igli"><span class="myTitle">BUFF：</span><span>载入中...</li>');
        $(list).append(buffLi);
        addBUFF(buffURL, buffLi, itemName);  //获取BUFF上的数据

        var youpinURL = 'https://api.youpin898.com/api/homepage/es/template/GetCsGoPagedList'
        var youpin_buyLi = $('<li class="igli" style="height: 25px;"><span class="myTitle">悠悠出售：</span><span>载入中...</li>');
        $(list).append(youpin_buyLi);
        addyoupin_buy(youpinURL, youpin_buyLi, itemName);  //获取悠悠有品上出售的数据

        var youpinURL = 'https://api.youpin898.com/api/homepage/es/template/GetCsGoPagedList'
        var youpin_leaseLi = $('<li class="igli" style="height: 25px;"><span class="myTitle">悠悠出租：</span><span>载入中...</li>');
        $(list).append(youpin_leaseLi);
        addyoupin_lease(youpinURL, youpin_leaseLi, itemName);  //获取悠悠有品上出租的数据

        //var v5URL = 'https://www.v5fox.com/csgo/0-0?keyword=' + itemName;
        //var v5Li = $('<li class="igli"><span class="myTitle">V5FOX：</span><span>载入中...</li>');
        //$(list).append(v5Li);
        //addV5(v5URL, v5Li, itemName);  //获取V5FOX上的数据

        if ($(this).attr('mouseover') == 'true') {   //若鼠标还在该物品上就不隐藏刚创建的列表
            $(list).css('display', 'block');
        }
        $(this).append(list);
    });

    $('.list').on('mouseleave', 'a.item', function () {
        if ($(this).find('ul.igxe-dropdown-content').length > 0) {
            $(this).find('ul.igxe-dropdown-content').css('display', 'none');
            return;
        }
        $(this).attr('mouseover', 'false');
    });
}

function buff() {
    $('#j_market_card').on('mouseenter', '#j_list_card li:not([class])', function () {
        if ($(this).find('div.buff-dropdown-content').length > 0) {
            $(this).find('div.buff-dropdown-content').css('display', 'block');
            return;
        }

        $(this).css({
            display: 'inline - block'
        });
        $(this).attr('mouseover', 'true');   //当前鼠标在该物品上

        var list = $('<div class="buff-dropdown-content"></div>');
        var itemName = $(this).find('a:first').attr('title');

        //var c5URL = 'https://www.c5game.com/csgo/default/result.html?k=' + itemName + '&page=1';
        var c5URL = 'https://www.c5game.com/csgo?keyword=' + itemName + '&page=1';
        var c5Li = $('<li class="buffli"><span class="myTitle">C5：</span><span>载入中...</li>');
        $(list).append(c5Li);
        addC5(c5URL, c5Li, itemName);  //获取C5上的数据

        // var igxeURL = 'https://www.igxe.cn/csgo/730?keyword=' + itemName;
        var igxeURL = 'https://www.igxe.cn/market/csgo?sort=3&keyword=' + itemName;
        var igxeLi = $('<li class="buffli"><span class="myTitle">IGXE：</span><span>载入中...</li>');
        $(list).append(igxeLi);
        addIGXE(igxeURL, igxeLi, itemName);  //获取igxe上的数据

        //var v5URL = 'https://www.v5fox.com/csgo/0-0?keyword=' + itemName;
        //var v5Li = $('<li class="buffli"><span class="myTitle">V5FOX：</span><span>载入中...</li>');
        //$(list).append(v5Li);
        //addV5(v5URL, v5Li, itemName);  //获取V5FOX上的数据

        var youpinURL = 'https://api.youpin898.com/api/homepage/es/template/GetCsGoPagedList'
        var youpin_buyLi = $('<li class="buffli" style="height: 25px;"><span class="myTitle">悠悠出售：</span><span>载入中...</li>');
        $(list).append(youpin_buyLi);
        addyoupin_buy(youpinURL, youpin_buyLi, itemName);  //获取悠悠有品上出售的数据

        var youpinURL = 'https://api.youpin898.com/api/homepage/es/template/GetCsGoPagedList'
        var youpin_leaseLi = $('<li class="buffli" style="height: 25px;"><span class="myTitle">悠悠出租：</span><span>载入中...</li>');
        $(list).append(youpin_leaseLi);
        addyoupin_lease(youpinURL, youpin_leaseLi, itemName);  //获取悠悠有品上出租的数据

        if ($(this).attr('mouseover') == 'true') {   //若鼠标还在该物品上就不隐藏刚创建的列表
            $(list).css('display', 'block');
        }
        $(this).append(list);
    });

    $('#j_market_card').on('mouseleave', '#j_list_card li:not([class])', function () {
        if ($(this).find('div.buff-dropdown-content').length > 0) {
            $(this).find('div.buff-dropdown-content').css('display', 'none');
            return;
        }
        $(this).attr('mouseover', 'false');
    });
}

function v5fox() {
    $('.list-box').on('mouseenter', 'a.list-item', function () {
        if ($(this).find('div.v5-dropdown-content').length > 0) {
            $(this).find('div.v5-dropdown-content').css('display', 'block');
            return;
        }

        $(this).css({
            display: 'inline - block'
        });
        $(this).attr('mouseover', 'true');   //当前鼠标在该物品上

        var list = $('<div class="v5-dropdown-content"></div>');
        var itemName = $(this).attr('title');

        //var c5URL = 'https://www.c5game.com/csgo/default/result.html?k=' + itemName + '&page=1';
        var c5URL = 'https://www.c5game.com/csgo?keyword=' + itemName + '&page=1';
        var c5Li = $('<li class="v5li"><a href="javascript:return false;" style="padding: 0px"><span class="myTitle">C5：</span><span>载入中...</a></li>');
        $(list).append(c5Li);
        addC5(c5URL, c5Li, itemName);  //获取C5上的数据

        var buffURL = 'https://buff.163.com/api/market/goods?game=csgo&page_num=1&search=' + itemName.trim() + '&_=' + (new Date()).valueOf().toString();
        var buffLi = $('<li class="v5li"><a href="javascript:return false;" style="padding: 0px"><span class="myTitle">BUFF：</span><span>载入中...</a></li>');
        $(list).append(buffLi);
        addBUFF(buffURL, buffLi, itemName);  //获取BUFF上的数据

        var igxeURL = 'https://www.igxe.cn/market/csgo?sort=3&keyword=' + itemName;
        var igxeLi = $('<li class="v5li"><a href="javascript:return false;" style="padding: 0px"><span class="myTitle">IGXE：</span><span>载入中...</a></li>');
        $(list).append(igxeLi);
        addIGXE(igxeURL, igxeLi, itemName);  //获取igxe上的数据

        var youpinURL = 'https://api.youpin898.com/api/homepage/es/template/GetCsGoPagedList'
        var youpin_buyLi = $('<li class="v5li" style="height: 25px;"><span class="myTitle">悠悠出售：</span><span>载入中...</li>');
        $(list).append(youpin_buyLi);
        addyoupin_buy(youpinURL, youpin_buyLi, itemName);  //获取悠悠有品上出售的数据

        var youpinURL = 'https://api.youpin898.com/api/homepage/es/template/GetCsGoPagedList'
        var youpin_leaseLi = $('<li class="v5li" style="height: 25px;"><span class="myTitle">悠悠出租：</span><span>载入中...</li>');
        $(list).append(youpin_leaseLi);
        addyoupin_lease(youpinURL, youpin_leaseLi, itemName);  //获取悠悠有品上出租的数据

        if ($(this).attr('mouseover') == 'true') {   //若鼠标还在该物品上就不隐藏刚创建的列表
            $(list).css('display', 'block');
        }
        $(this).append(list);
    });

    $('.list-box').on('mouseleave', 'a.list-item', function () {
        if ($(this).find('div.v5-dropdown-content').length > 0) {
            $(this).find('div.v5-dropdown-content').css('display', 'none');
            return;
        }
        $(this).attr('mouseover', 'false');
    });
}

function youpin() {
    $('.goods-list').on('mouseenter', '.good-box', function () {
        if ($(this).find('div.youpin-dropdown-content').length > 0) {
            $(this).find('div.youpin-dropdown-content').css('display', 'block');
            return;
        }

        $(this).css({
            display: 'inline - block'
        });
        $(this).attr('mouseover', 'true');   //当前鼠标在该物品上

        var list = $('<div class="youpin-dropdown-content"></div>');
        var itemName = $(this).attr('title');

        //var c5URL = 'https://www.c5game.com/csgo/default/result.html?k=' + itemName + '&page=1';
        var c5URL = 'https://www.c5game.com/csgo?keyword=' + itemName + '&page=1';
        var c5Li = $('<li class="youpinli"><a href="javascript:return false;" style="padding: 0px"><span class="myTitle">C5：</span><span>载入中...</a></li>');
        $(list).append(c5Li);
        addC5(c5URL, c5Li, itemName);  //获取C5上的数据

        var buffURL = 'https://buff.163.com/api/market/goods?game=csgo&page_num=1&search=' + itemName.trim() + '&_=' + (new Date()).valueOf().toString();
        var buffLi = $('<li class="youpinli"><a href="javascript:return false;" style="padding: 0px"><span class="myTitle">BUFF：</span><span>载入中...</a></li>');
        $(list).append(buffLi);
        addBUFF(buffURL, buffLi, itemName);  //获取BUFF上的数据

        var igxeURL = 'https://www.igxe.cn/market/csgo?sort=3&keyword=' + itemName;
        var igxeLi = $('<li class="youpinli"><a href="javascript:return false;" style="padding: 0px"><span class="myTitle">IGXE：</span><span>载入中...</a></li>');
        $(list).append(igxeLi);
        addIGXE(igxeURL, igxeLi, itemName);  //获取igxe上的数据

        //var v5URL = 'https://www.v5fox.com/csgo/0-0?keyword=' + itemName;
        //var v5Li = $('<li class="youpinli"><span class="myTitle">V5FOX：</span><span>载入中...</li>');
        //$(list).append(v5Li);
        //addV5(v5URL, v5Li, itemName);  //获取V5FOX上的数据

        if ($(this).attr('mouseover') == 'true') {   //若鼠标还在该物品上就不隐藏刚创建的列表
            $(list).css('display', 'block');
        }
        $(this).append(list);
    });

    $('.goods-list').on('mouseleave', 'div.good-box', function () {
        if ($(this).find('div.youpin-dropdown-content').length > 0) {
            $(this).find('div.youpin-dropdown-content').css('display', 'none');
            return;
        }
        $(this).attr('mouseover', 'false');
    });
}