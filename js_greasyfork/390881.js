// ==UserScript==
// @name         tiy-1688
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  -------------
// @author       thank
// @match        https://detail.1688.com/offer/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390881/tiy-1688.user.js
// @updateURL https://update.greasyfork.org/scripts/390881/tiy-1688.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var currentIndex = 0;
var maxLength = 0;
var colorsArray = Array();


window.findSKU1688 = function(){
    var skus = new Array();
    $('.table-sku').find('tr').each(function(index,val){
        var sizeItem = {
            name : $(this).find('td.name').text().trim(),
            stock: $(this).find('td.count').text().replace('件可售','').trim()
        }
        skus[index] = sizeItem;
    })
    return skus;
};


window.caiji1688 = function(){
    $('.fashiontiy_caiji').attr({value: "正在采集,请稍等",disabled:'true' });
    currentIndex = 0;
    var colors = $('.list-leading').children();
    if(colors.length == 0){//单一色卡
        caijiItem1688OfNoColor();
    } else {
        maxLength = colors.length;
        caijiItem1688();
    }
};

window.caijiItem1688OfNoColor = function(){
    setTimeout(function(){
        let sizeItems = findSKU1688();
        let colorItem = {
            name:'单一色卡',
            image:'' ,
            sizes:sizeItems
        }
        colorsArray[currentIndex] = colorItem;
        $('.fashiontiy_caiji').attr({ value: "采集完成" ,disabled:''});
        finishCaiji1688();
    },1500+Math.ceil(Math.random()*1500));

};

window.caijiItem1688 = function(){
    if(currentIndex>(maxLength-1)){
        $('.fashiontiy_caiji').attr({ value: "采集完成" ,disabled:''});
        finishCaiji1688();
        return ;
    }
    var itemParent = $('.list-leading').children()[currentIndex];
    var item = $(itemParent).find('a');
    var colorName = item.attr('title');
    item.click();
    setTimeout(function(){
        var sizeItems =  !$(item).hasClass('unit-detail-spec-operator-lack')? findSKU1688():[];
        var isHasImg = $(item).find('img').length>0;
        var colorItem = {
            name:colorName,
            image:isHasImg ? $(item).find('img').attr('src').replace('.32x32','').trim() :'' ,
            sizes:sizeItems
        }
        colorsArray[currentIndex] = colorItem;
        currentIndex++;
        caijiItem1688();

    },1500+Math.ceil(Math.random()*1500));

};

window.finishCaiji1688 = function(){
    var result = {
        from:'1688',
        author:'fashiontiy',
        sourceUrl:window.location.href,
        title:$('.mod-detail-title').find('.d-title').text().trim(),
        prices:getPriceAndMOQ1688(),
        shippingFee:$($('div.cost-entries-type').find('em.value')[0]).text().trim(),
        imgs:getProductImgs1688(),
        colors:colorsArray,
        attrs:getAttrs1688()
    };
    console.log(result);
    var  newWindow = window.open('',"newWindow","menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
    newWindow.document.write("<p>"+JSON.stringify(result, null, '\t')+"</p>");
    newWindow.document.close();
    newWindow.focus();
}



window.getPriceAndMOQ1688 = function(){
    var prices = Array();
    let priceTr = $('.d-content table').find('tr.price');
    let priceTds = priceTr.children();
    if(priceTds.length > 1 && $(priceTds[1]).attr('data-range')){
        $('.d-content table').find('tr.price').children().each(
            function(index,item){
                if(index>0){
                    prices[index-1] = JSON.parse($(this).attr('data-range'));
                }
            }
        );
    } else { //单一价格
        let price = {};
        price.begin = $('.d-content table').find('tr.amount').find("td span.value").text().replace(/[^0-9]/ig,"");
        price.end = "";


        if(priceTr.find("div.price-original-sku").length == 1){ //如果有折扣，取原价
            let priceDiv = priceTr.find("div.price-original-sku")[0];
            price.price = $(priceDiv).children("span.value").text();
        }

        if(!price.price){
            let priceSpan = priceTr.find("span.value");
            price.price = $(priceSpan[0]).text();
        }

        prices.push(price);
    }

    return prices;

};

window.getProductImgs1688 = function(){
    var imgs = Array();
    $('.tab-content-container ul').find('li').each(
        function (index) {
            imgs[index] =  JSON.parse($(this).attr('data-imgs')).original;
        }
    );
    return imgs;

};

window.getAttrs1688 = function(){
    var attrs = Array();
    $('.kuajing-attribues').find('span').each(
        function (index) {
            attrs[index] = {
                name:$(this).find('b').text().trim(),
                value:$(this).find('em').text().trim()
            }
        }
    );
    let beginLength = attrs.length;

    var  detailAttrs = $('.mod-detail-attributes table tbody').find('td');
    for (var i=0; i<detailAttrs.length/2;i++){
        var key = $(detailAttrs[i*2]).text().trim();
        var value = $(detailAttrs[i*2+1]).text().trim();
        attrs[i+beginLength] = {
            name:key,
            value:value
        }
    }
    return attrs;
};



var buttonText = '<p>'+'<input class="fashiontiy_caiji" type = "button" value = "采集" onclick="window.caiji1688()" style="color: white;padding:0.5rem 1.5rem;font-size:1rem;background: rebeccapurple;margin: 1rem 2rem;" />'+'</p>';

window.onload = function() {
    $('.mod-detail-postage').append(buttonText);
};

})();
