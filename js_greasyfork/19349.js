// ==UserScript==
// @name         京东凑单增强
// @namespace    http://greasyfork.org/
// @version      1.02
// @description  京东凑单页面的增强程序，增强了筛选功能，增加了单价查看和排序功能，帮助你在京东轻轻松松凑单
// @author       Yarmu
// @include        http://coudan.jd.com/coudan.html?*
// @grant        GM_getValue
// @grant        GM_setValue
// @supportURL     https://greasyfork.org/zh-CN/scripts/19349-%E4%BA%AC%E4%B8%9C%E5%87%91%E5%8D%95%E5%A2%9E%E5%BC%BA
// @downloadURL https://update.greasyfork.org/scripts/19349/%E4%BA%AC%E4%B8%9C%E5%87%91%E5%8D%95%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/19349/%E4%BA%AC%E4%B8%9C%E5%87%91%E5%8D%95%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    var dl = $('<dl></dl>');
    var txtInput = $('<input type="text" value="" class="input-txt" id="nameFilter">');
    var btnOK = $('<a data-type="all" class="btn btn-default">确定</a>');
    var btnUnit = $('<dd id="unitOrder"><a href="javascript:orderFunc(5);">单价</a><b></b></dd>');
    btnOK.bind("click",function(){
        filterResult();
    });
    txtInput.bind('keypress',function(event) {
        if(event.keyCode==13) {filterResult();return false;}
    });
    dl.append(txtInput);
    dl.append(btnOK);
    var outContent = $('.order');
    outContent.append(btnUnit);
    outContent.after(dl);

    $('#salesOrder').removeClass();
    $('#salesOrder').addClass('curr down');
    $('#salesOrder').find('a').attr('href','javascript:orderFunc(2);');
    $('#orderValue').attr('value',1);
    $('.float-nav-wrap').removeClass('float-nav-wrap');
    $('#refilter').find('h2').html('<h2><a href="javascript:getResultByCat(0);">分类筛选</a></h2>');
})();

var cacheData = {};
var totalData = [];
var totalIndex = {};

getResult = function(currentPage){
    if (currentPage == 1 && totalData.length === 0) {
        GetAllItem(1);
    } else if (currentPage == 1) {
        filterResult();
    } else {
        loadResult(currentPage);
    }
};

function loadResult(currentPage) {
    var data = getPageFromCache(currentPage);
    showData(data);
    pageList(data);
    registerSucInfo();

    $("html,body").animate({scrollTop:$('#product-detail').offset().top},50);
}

function filterResult() {
    var price = '';
    var lowPrice ='';
    var highPrice ='';
    var defaultPrice = $('#priceSelect dd.selected');//.attr('data');

    if(defaultPrice!==null && defaultPrice.length>0){
        price = defaultPrice.attr('data');
        var prices = price.split('-');
        if(prices.length==1){
            lowPrice= $.trim(prices[0]);
            highPrice ='';
        }else{
            lowPrice= prices[0];
            highPrice =prices[1];
        }
    }
    var inputLowPrice = $('#lowPrice').val();
    var inputHighPrice = $('#highPirce').val();

    if($.trim(inputLowPrice)!=='' || $.trim(inputHighPrice)!==''){
        var numLow = parseFloat(lowPrice);
        var numHigh = parseFloat(highPrice);
        if(numLow>=numHigh){
            alert('开始价格不能大于等于结束价格!');
            $('#lowPrice').focus();
            return;
        }
        lowPrice = $.trim(inputLowPrice);
        highPrice = $.trim(inputHighPrice);
    }

    var orderValue = $('#orderValue').val();
    var thirdCid = $('#thirdCid').val();
    var nameFilter = $.trim($('#nameFilter').val());
    var nameFilters = nameFilter.split(' ');

    cacheData = {
        currentPage : 1,
        totalPage : 1,
        pageSize : 0,
        total : 0,
        list : []
    };

    $.each(totalData, function(index, item) {
        if (lowPrice !== '' && parseFloat(item.price) < parseFloat(lowPrice)) {
            return;
        }
        if (highPrice !== '' && parseFloat(item.price) > parseFloat(highPrice)) {
            return;
        }
        if (thirdCid !== '' && thirdCid !== '0' && item.cid != thirdCid) {
            return;
        }
        var isOr = false;
        var isOrPass = false;
        var isAnd = false;
        for(var i = 0; i <nameFilters.length; ++i) {
            var filter = nameFilters[i];
            if (filter.startsWith('-')) {
                filter = filter.substr(1);
                if (item.name.indexOf(filter) > -1) {
                    return;
                }
            }
            else if (filter.startsWith('+') ){
                filter = filter.substr(1);
                if (item.name.indexOf(filter) > -1) {
                    isOrPass = true;
                }
                isOr = true;
            }
            else if (item.name.indexOf(filter) < 0) {
                return;
            } else {
                isAnd = true;
            }
        }
        if (isAnd && !isOr || isOr && isOrPass) {
            cacheData.list.push(item);
            ++cacheData.total;
        }
    });
    cacheData.totalPage = Math.ceil(cacheData.total / 20);

    if (orderValue == '2') {
        cacheData.list.reverse();
    } else if (orderValue == '3') {
        cacheData.list.sort(function(a,b) {
            var x = parseFloat(a.price);
            var y = parseFloat(b.price);
            return x < y ? -1 : x > y ? 1 : 0;
        });
    } else if (orderValue == '4') {
        cacheData.list.sort(function(a,b) {
            var x = parseFloat(a.price);
            var y = parseFloat(b.price);
            return x < y ? 1 : x > y ? -1 : 0;
        });
    } else if (orderValue == '5') {
        cacheData.list.sort(function(a,b) {
            var x = a.unit ? a.unit.price : parseFloat(a.price);
            var y = b.unit ? b.unit.price : parseFloat(b.price);
            return x < y ? -1 : x > y ? 1 : 0;
        });
    } else if (orderValue == '6') {
        cacheData.list.sort(function(a,b) {
            var x = a.unit ? a.unit.price : parseFloat(a.price);
            var y = b.unit ? b.unit.price : parseFloat(b.price);
            return x < y ? 1 : x > y ? -1 : 0;
        });
    }
    loadResult(1);
}

function getPageFromCache(currentPage) {
    var data = {
        currentPage : currentPage,
        totalPage : cacheData.totalPage,
        pageSize : 0,
        total : cacheData.total,
        list : []
    };
    for(var i = (currentPage-1)*20; i < currentPage*20; ++i) {
        if (i >= cacheData.total) {
            break;
        }
        data.list.push(cacheData.list[i]);
    }
    return data;
}

function addUnitPrice(item) {
    if (parseFloat(item.price) <= 0) {
        return;
    }

    var name = item.name.replace(/[(（][^)）]+[)）]/ig, '');
    var reg = /\b(\d+\.?\d*?)\s*(g|kg|ml|l|千克|克|毫升|升)\/?[个盒]?(\s*[*x×]\s*(\d+))?/ig;
    if (!reg.test(name)) {
        name = item.name;
    }
    reg.lastIndex = 0;

    var match = null;
    var cap = 0;
    var un = '';
    var isOnlyOne = !/[+|＋|送]/i.test(name);
    //var count = 0;
    while((match = reg.exec(name))) {
        var capacity = parseFloat(match[1]);
        if (match.length > 4 && match[4]) {
            capacity *= parseInt(match[4]);
        }
        if (capacity <= 0) {
            continue;
        }
        var unit = match[2].toLowerCase();

        if (unit === 'g' || unit === '克') {
            capacity /= 1000;
            unit = 'kg';
        } else if (unit === '千克') {
            unit = 'kg';
        } else if (unit === 'ml' || unit === '毫升') {
            capacity /= 1000;
            unit = 'L';
        } else if (unit === 'l' || unit === '升') {
            unit = 'L';
        }
        if (un === '' || un == unit) {
            un = unit;
            cap += capacity;
            //++count;
        }
        if (isOnlyOne) {
            break;
        }
    }

    if(cap>0) item.unit = {
        capacity : cap,
        unit : un,
        price : parseFloat(item.price) / cap
    };
    //if (count>1) {
    //    alert(item.name + ' ' + cap + un);
    //}
}

GetWarePriceimg = function(data) {
    $.each(data, function(index, item) {
        if(parseFloat(item.price)>0) {
            var unit = '';
            if (item.unit && item.unit.capacity > 0) {
                unit = ' (' + toDecimal(item.unit.price) + '/' + item.unit.unit + ')';
            }
            $('#J_'+item.id).html('￥'+toDecimal(item.price) + unit);
        }else{
            $('#J_'+item.id).html('暂无报价');
        }
    });
};

function GetAllItem(currentPage) {
    var outContainer = $('#plist');
    outContainer.text('正在加载数据....' + currentPage + '页');
    var targetId = getParams();
    $.getJSON(coudanDomain+"/coudan/listProducts.jsonp?callback=?",
              {
        'wr.currentPage':currentPage,
        'wr.orderValue':'2',
        'wr.lowPrice':'',
        'wr.highPrice':'',
        'wr.targetId':targetId,
        'wr.cids':cids,
        'wr.defaultMoney':1000,
        'wr.locationId':getLocationId(),
        'wr.pageSize':20,
        'wr.spareSize':30,
        'wr.thirdCid':''
    }, function(data){
        if (currentPage == 1) {
            totalData = [];
            totalIndex = {};
        }
        $.each(data.list, function(index, item) {
            if (!totalIndex[item.id]) {
                totalIndex[item.id] = item;
                totalData.push(item);
            }
        });
        if(data.list.length < 20) {
            GetAllPrice(0);
        } else {
            GetAllItem(currentPage+1);
        }
    });
}

function GetAllPrice(begin) {
    var skus = '';
    for(var i = begin; i < begin + 100; ++i) {
        if (i >= totalData.length) {
            break;
        }
        var item = totalData[i];
        skus+=item.id+',';
    }
    if(skus!==null && skus!==''){
        skus = skus.substring(0,skus.length-1);
    }else{
        return;
    }
    var outContainer = $('#plist');
    outContainer.text('正在加载价格....' + parseInt((begin / 20) + 1) + '页');
    $.getJSON("http://pm.3.cn/prices/pcpmgets?callback=?", {
        'skuids':skus,
        'origin':2
    }, function(dataI){
        $.each(dataI, function(index, item) {
            if(item.p>0){
                var theItem = totalIndex[item.id];
                if (theItem) {
                    theItem.price = item.p;
                    addUnitPrice(theItem);
                }
            }
        });
        begin += 100;
        if (begin < totalData.length) {
            GetAllPrice(begin);
        } else {
            filterResult();
            $('#menuDiv').empty();
            initCart(getParams());
        }
    });
}

function toDecimal(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return;
    }
    f = Math.round(x*100)/100;
    return f;
}

var orderFunc_o = orderFunc;
orderFunc = function(ordervalue){
    if(ordervalue==5){
        $('#unitOrder').removeClass();
        $('#unitOrder').addClass('curr up');
        $('#unitOrder').find('a').attr('href','javascript:orderFunc(6);');
        $('#orderValue').attr('value',5);
    }
    else if(ordervalue==6){
        $('#unitOrder').removeClass();
        $('#unitOrder').addClass('curr down');
        $('#unitOrder').find('a').attr('href','javascript:orderFunc(5);');
        $('#orderValue').attr('value',6);
    } else {
        $('#unitOrder').removeClass();
        $('#unitOrder').find('a').attr('href','javascript:orderFunc(5);');
        orderFunc_o(ordervalue);
        return;
    }
    $('#salesOrder').removeClass();
    $('#salesOrder').find('a').attr('href','javascript:orderFunc(1);');
    $('#priceOrder').removeClass();
    $('#priceOrder').find('a').attr('href','javascript:orderFunc(3);');
    initFlagA = 2;
    getResult(1);
};

var listCart_o = listCart;
var totalMoney = 0;
listCart = function(data) {
    if(data.list && totalData.length) {
        if (totalMoney === 0) {
            if (parseFloat(data.balanceMoney) > 0) {
                totalMoney = parseFloat(data.totalPrice) + parseFloat(data.balanceMoney);
                GM_setValue('jd_' + getParams(), totalMoney);
            } else if (parseFloat(GM_getValue('jd_' + getParams(), 0)) > 0) {
                totalMoney = parseFloat(GM_getValue('jd_' + getParams(), 0));
            }
        }
        $.each(data.list, function(index, iteml) {
            var item = iteml.mainSku;
            var less = (parseFloat(item.discountedPrice) - parseFloat(totalIndex[item.id].price)) * parseInt(item.num);
            if (less > 0) {
                data.totalPrice = toDecimal(parseFloat(data.totalPrice) - less);
                item.discountedPrice = totalIndex[item.id].price;
            }
        });
        if (totalMoney > 0) {
            data.balanceMoney = toDecimal(totalMoney - parseFloat(data.totalPrice));
        }
    }
    listCart_o(data);
};

getCartImageUrl = function (Wid, folder, Imgurl){
    if(Imgurl===null || Imgurl===''){
        return "http://www.jd.com/images/none/none_50.gif";
    }
    var img = '';
    if (Imgurl.indexOf("http:") >= 0) {
        img = Imgurl;
    }
    else {
        img = GetImgMasterUrl(Wid, folder) + Imgurl;
    }
    if (totalIndex[Wid]) {
         img = img + '" title="' + totalIndex[Wid].name + '" onclick="window.open(\'http://item.jd.com/' + Wid + '.html\')" style="cursor:pointer;';
    }
    return img;
};
