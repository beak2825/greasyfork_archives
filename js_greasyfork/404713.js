// ==UserScript==
// @name         Aliexpress Plus FiZ
// @namespace    http://www.zaoios.ru/
// @version      2.5.5
// @description  Sorts search results by item price properly with shipping costs included, enhances item pages for Google Chrome
// @author       FiZ, Tophness
// @match        https://*.aliexpress.com/w/wholesale?*
// @match        https://*.aliexpress.com/wholesale?*
// @match        https://*.aliexpress.com/af/*
// @match        https://*.aliexpress.com/item/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/tinysort/2.3.6/tinysort.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/tinysort/2.3.6/tinysort.charorder.min.js
// @license MIT
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/404713/Aliexpress%20Plus%20FiZ.user.js
// @updateURL https://update.greasyfork.org/scripts/404713/Aliexpress%20Plus%20FiZ.meta.js
// ==/UserScript==
// known bug: after windows resize sometimes need to revert original sort order

var SortTimeoutID;
var CurPageGoods = 0;
var BottomLinksRewritten = false;
var sortmethod = 3;
var showUnitPrice = false;

var elh = {
    'sortchange1' : 'Cheapest Unit',
    'sortchange2' : 'Cheapest Total',
    'sortchange3' : 'Cheapest Total (Max Price)',
    'sortchange4' : 'Cheapest',
    'sortchange5' : 'Max Price',
};

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if(mutation.type == 'childList'){
            for (var j = 0; j < mutation.addedNodes.length; j++) {
                //console.log("mutcn: "+ mutation.addedNodes[j].className);
                processall(mutation.addedNodes[j].childNodes);
            }
        }
    });
});

function waitForEl(){
    var observera = new MutationObserver(function (mutations, me) {
        if(document.querySelector("ul.list-items")) {
            me.disconnect();
            if(document.location.href.indexOf('g=y') == -1){
                observer.observe(document.querySelector("ul.list-items"), { childList: true, subtree: true });
            }
            else{
                observer.observe(document.querySelector("ul.list-items"), { childList: true });
            }
            return;
        }
    });

    observera.observe(document, {
        childList: true,
        subtree: true
    });
}

function CleanPriceText(pricefixed){
    pricefixed=pricefixed.replace("US $","");
    pricefixed=pricefixed.replace(" руб.","");
    //pricefixed=pricefixed.split(" ").join(""); //pricefixed=pricefixed.replaceAll(" ","");
    pricefixed=pricefixed.split("\u00a0").join(""); //pricefixed=pricefixed.replaceAll(/\u00a0/g, ""); //.replace("\&nbsp;","");
    pricefixed=pricefixed.split(",").join("."); //pricefixed=pricefixed.replaceAll(",",".");
    return(pricefixed);
}

function process(listitem){
    if(!listitem.querySelector)
        return(0);

    var pricerow = listitem.querySelector('div.item-price-row');
    if(!pricerow)
        return(0);

    if(listitem.querySelector('span.orig-ord'))
        return(0);

    var price = pricerow.querySelector('.price-current');
    var shipping = listitem.querySelector('.shipping-value');
    var shippingtext = (shipping)? shipping.innerText : "";
    if(!price || listitem.className == "moved")// && listitem.className.indexOf('product-card') == -1 //&& price.innerText.indexOf('$') != -1
        return(0);
    //var pricefixed = price.innerText.substring(price.innerText.indexOf('$')+1);
    var pricefixed = CleanPriceText(price.innerText);
    //console.log("pricefixed: "+pricefixed);

    var shippingfixed;
    if(shippingtext.indexOf('Free Shipping') != -1 || shippingtext == ''){
        shippingfixed = "0.00";
    }
    else{
        shippingfixed = CleanPriceText(shippingtext.substring(shippingtext.indexOf(' ')+1));
    }
    var pricepretext = price.innerText.substring(0, price.innerText.indexOf('$')+1);
    var finalcosttext = "", finalmaxcost = "";
    var pricesplit;
    if(pricefixed.indexOf(' - ') != -1){
        pricesplit = pricefixed.split(' - ');
        //if(sortmethod == 3){
        //    finalcosttext = (parseFloat(pricesplit[1]) + parseFloat(shippingfixed)).toFixed(2) + " - " + (parseFloat(pricesplit[0]) + parseFloat(shippingfixed)).toFixed(2);
        //}
        //else{
        finalcosttext = (parseFloat(pricesplit[0]) + parseFloat(shippingfixed)).toFixed(2) + " - " + (parseFloat(pricesplit[1]) + parseFloat(shippingfixed)).toFixed(2);
        finalmaxcost =(parseFloat(pricesplit[1]) + parseFloat(shippingfixed)).toFixed(2);

        //}
    }
    else{
        finalcosttext = (parseFloat(pricefixed) + parseFloat(shippingfixed)).toFixed(2);
        finalmaxcost = finalcosttext;
    }
    var finalcostpost;
    var finalcostpostwhole;
    var priceunitparttemp;
    var priceunitel = pricerow.querySelector('span.price-unit');
    var packagingsale = listitem.querySelector('div.item-price-row.packaging-sale')
    if(packagingsale){
        priceunitel = packagingsale.querySelector('span.price-unit');
    }
    if(showUnitPrice && priceunitel){
        var priceuniteltext = priceunitel.innerText;
        var priceunit = priceuniteltext.substring(0, priceuniteltext.indexOf(' '));
        var priceunitposttext = priceuniteltext.substring(priceuniteltext.indexOf(' '));
        var finalcostpart;
        if(pricefixed.indexOf(' - ') != -1){
            if(sortmethod == 3){
                finalcostpart = (parseFloat(pricesplit[1]) / parseFloat(priceunit)).toFixed(2);
            }
            else{
                finalcostpart = (parseFloat(pricesplit[0]) / parseFloat(priceunit)).toFixed(2);
            }
        }
        else{
            finalcostpart = (finalcosttext / parseFloat(priceunit)).toFixed(2);
        }
        if(priceunitposttext.indexOf('/') != -1){
            var priceunitsplit = priceunitposttext.split('/');
            var priceunitpart = priceunitsplit[0];
            var priceunitwhole = priceunitsplit[1];
            finalcostpostwhole = finalcosttext + " / " + priceunitwhole;
            finalcosttext = finalcostpart + " / " + priceunitpart;
            priceunitparttemp = priceunitpart;
        }
    }
    var finalcostdiv = document.createElement('div');
    finalcostdiv.className = 'item-total-wrap';
    var finalcostpretext = document.createElement('span');
    finalcostpretext.className = 'total-pretext';
    finalcostpretext.innerHTML = "Total: " + pricepretext;
    var finalcostspan = document.createElement('span');
    finalcostspan.className = 'total-current';
    if(finalcostpostwhole){
        finalcostspan.innerHTML = finalcostpostwhole;
        if(packagingsale){
            pricerow.querySelector('span.price-unit').innerHTML = " / " + priceunitparttemp;
        }
        else{
            listitem.querySelector('div.item-price-row.packaging-sale').querySelector('span.price-unit').innerHTML = " / " + priceunitparttemp;
        }
        price.innerHTML = pricepretext + finalcostpart;
        finalcostdiv.appendChild(finalcostpretext);
        if(sortmethod == 1){
            finalcostspan.className = 'total-posttext';
            var finalcostbr = document.createElement('br');
            finalcostbr.style.display = "none";
            var finalcostspan2 = document.createElement('span');
            finalcostspan2.className = 'total-current';
            finalcostspan2.innerHTML = finalcosttext;
            finalcostspan2.style.display = "none";
            finalcostdiv.appendChild(finalcostspan2);
            finalcostdiv.appendChild(finalcostbr);
        }
        finalcostdiv.appendChild(finalcostspan);
    }
    else{
        finalcostspan.innerHTML = finalcosttext;
        var finalmaxcostspan = document.createElement('span');
        finalmaxcostspan.className = 'total-max';
        finalmaxcostspan.innerHTML = finalmaxcost;
        finalmaxcostspan.style.display = "none";
        var origOrderspan = document.createElement('span');
        origOrderspan.className = 'orig-ord';
        origOrderspan.innerHTML = CurPageGoods++;
        origOrderspan.style.display = "none";
        finalcostdiv.appendChild(finalcostpretext);
        finalcostdiv.appendChild(finalcostspan);
        finalcostdiv.appendChild(finalmaxcostspan);
        finalcostdiv.appendChild(origOrderspan);
    }
    if(shipping && shipping.parentNode.nextSibling.className != finalcostdiv.className){
        price.parentNode.parentNode.parentNode.insertBefore(finalcostdiv, shipping.parentNode.nextSibling);
    }else
        price.parentNode.parentNode.parentNode.insertBefore(finalcostdiv, price.parentNode.parentNode.nextSibling);

    PlanToSortall();
}

function processall(list){
    for (var i = 0; i < list.length; i++) {
        process(list[i]);
    }
}

function PlanToSortall(){
    if(SortTimeoutID)
        clearTimeout(SortTimeoutID);

    SortTimeoutID=setTimeout((function(){
        sortall(document.querySelectorAll("li.list-item"), sortmethod);
    }),100);

}

function sortall(listitems, sortmethod){
    //console.log("Sorting");
    //return(0);
    SortTimeoutID=0;

    if(sortmethod == 0){
        tinysort(listitems,{selector:'span.orig-ord', natural:true});// Original sort order, //our new span
    }else if(sortmethod == 1){
        tinysort(listitems,{selector:'span.tsotal-current', natural:true}); //Cheapest Unit',
    }
    else if(sortmethod == 2){
        tinysort(listitems,{selector:'span.total-current', natural:true}); // Cheapest Total', //our new span
    }
    else if(sortmethod == 3){
        tinysort(listitems,{selector:'span.total-max', natural:true}); //'Cheapest Total (Max Price)', //our new span
    }
    else if(sortmethod == 4){
        tinysort(listitems,{selector:'span.price-current', natural:true}); // 'Cheapest', //ali present
    }
    else if(sortmethod == 5){
        tinysort(listitems,{selector:'span.price-current', natural:true, order: 'desc'}); // 'Max Price', //ali present
    }
    return(0);
}

function SortRows(mode){
    if (sortmethod != mode){
        if(mode>0){
            document.getElementById('sortchange' + sortmethod).setAttribute('style', 'font-weight: regular');
            document.getElementById('sortchange' + mode).setAttribute('style', 'font-weight: bold');
            sortmethod = mode;
        }
    }
    sortall(document.querySelectorAll("li.list-item"), mode);
    fakeScrollDown();
}


function doalilink(){
//    console.log("Start Revert sorting");
    SortRows(0);
}

function rewriteAliLinks(){
    var proplist = document.querySelector('.sort-by-wrapper');
    if(proplist && proplist.childNodes.length > 0){
        var proplistall = proplist.querySelectorAll('.sort-item');
        for (var i = 0; i < proplistall.length; i++) {
            proplistall[i].addEventListener('click', function () {doalilink()}, false);
        }
    }

}

document.body.onscroll = function() {
    if(!BottomLinksRewritten)
        rewriteAliBottomLinks();
      };

function rewriteAliBottomLinks(){
    var proplist, i, proplistall;

    proplist = document.querySelector('.next-pagination-pages');
    if(proplist && proplist.childNodes.length > 0){
        BottomLinksRewritten=true;
        //console.log("pl ");
        proplistall = proplist.querySelectorAll('.next-btn');
        for (i = 0; i < proplistall.length; i++) {
            //console.log("ib: "+i);
            proplistall[i].addEventListener('click', function () {doalilink()}, false);
        }
    }
}

function insertsearch(){
    rewriteAliLinks();

    var sortdiv = document.createElement('span');
    sortdiv.className = 'sort-item';
    var sortspan = document.createElement('span');
    sortspan.className = 'sort-item';
    var sortspan2 = document.createElement('span');
    sortspan2.className = 'sort-item';
    var sortspan3 = document.createElement('span');
    sortspan3.className = 'sort-item';
    var sortspan4 = document.createElement('span');
    sortspan4.className = 'sort-item';
    var sortspan5 = document.createElement('span');
    sortspan5.className = 'sort-item';
    var sortchange = document.createElement('span');
    sortchange.id = 'sortchange1';
    sortchange.innerHTML = elh[sortchange.id];
    sortchange.addEventListener("click", function () {
        SortRows(1) //'Cheapest Unit',
    }, false);
    var sortchange2 = document.createElement('span');
    sortchange2.id = 'sortchange2';
    sortchange2.innerHTML = elh[sortchange2.id];
    sortchange2.addEventListener("click", function () {
        SortRows(2) // 'Cheapest Total',
    }, false);
    var sortchange3 = document.createElement('span');
    sortchange3.id = 'sortchange3';
    sortchange3.innerHTML = elh[sortchange3.id];
    sortchange3.addEventListener("click", function () {
        SortRows(3) //'Cheapest Total (Max Price)',
    }, false);
    var sortchange4 = document.createElement('span');
    sortchange4.id = 'sortchange4';
    sortchange4.innerHTML = elh[sortchange4.id];
    sortchange4.addEventListener("click", function () {
        SortRows(4) //'Cheapest',
    }, false);

    var sortchange5 = document.createElement('label');
    sortchange5.id = 'sortchange5';
    sortchange5.innerHTML = elh[sortchange5.id] + ': ';
    var sortchange5t = document.createElement('input');
    sortchange5t.id = 'sortchange5t';
    sortchange5t.addEventListener("keydown", function () {
        SortRows(5) //'Max Price',
    }, false);
    sortspan.appendChild(sortchange);
    sortspan2.appendChild(sortchange2);
    sortspan3.appendChild(sortchange3);
    sortspan4.appendChild(sortchange4);
    sortspan5.appendChild(sortchange5);
    sortspan5.appendChild(sortchange5t);
    sortdiv.appendChild(sortspan);
    sortdiv.appendChild(sortspan2);
    sortdiv.appendChild(sortspan3);
    sortdiv.appendChild(sortspan4);
    sortdiv.appendChild(sortspan5);
    var searchbox = document.querySelector(".sort-by-wrapper");
    if(searchbox){
       // searchbox.appendChild(sortdiv);
        searchbox.appendChild(sortspan);
        searchbox.appendChild(sortspan2);
        searchbox.appendChild(sortspan3);
        searchbox.appendChild(sortspan4);
        searchbox.appendChild(sortspan5);
        if(sortmethod>0)
            document.getElementById('sortchange' + sortmethod).setAttribute('style', 'font-weight: bold');
    }
}

function process2(item){
    if(item.className == "item-info"){
        if(item.querySelector("div.item-title.line-limit-length")){
            item.querySelector("div.item-title.line-limit-length").classList.remove('line-limit-length');
            //item.parentNode.parentNode.style.marginBottom = "88px";
            item.parentNode.parentNode.style.height = "auto";
        }
    }
}

function checkall(list){
    for (var i = 0; i < list.length; i++) {
        process2(list[i]);
    }
}

var observer2 = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if(mutation.type == 'childList'){
            for (var j = 0; j < mutation.addedNodes.length; j++) {
                checkall(mutation.addedNodes[j].childNodes);
            }
        }
    });
});

function waitForEl2(){
    var observerb = new MutationObserver(function (mutations, me) {
        if(document.querySelector(".item-title-block")) {
            me.disconnect();
            observer2.observe(document.querySelector(".bottom-recommendation"), { childList: true, subtree: true });
            return;
        }
    });

    observerb.observe(document, {
        childList: true,
        subtree: true
    });
}

function fakeScrollDown(){
    window.scrollBy(0, window.innerHeight);
    setTimeout((function(){
        //window.scrollByPages(1);;
        //window.scrollBy(0, window.innerHeight);;
       // console.log("height: "+(window.scrollY+ window.innerHeight) +"from "+ document.body.scrollHeight + "wh "+ window.innerHeight);
        if((window.scrollY+ window.innerHeight) < document.body.scrollHeight){ //window.scrollMaxY
            fakeScrollDown();
        }
        else{
            window.scrollTo(0,0);
        }
    }),100);
}

function docalctotal(){
    var itempageshipping = document.querySelector('.product-shipping-price');
    if(itempageshipping){
        itempageshipping = itempageshipping.innerText;
        if(itempageshipping.indexOf('Free Shipping') != -1){
            itempageshipping = '0.00';
        }
        itempageshipping = itempageshipping.substring(itempageshipping.indexOf(':')+2);
        itempageshipping = parseFloat(CleanPriceText(itempageshipping)); //itempageshipping = parseFloat(itempageshipping.substring(itempageshipping.indexOf('$')+1).trimEnd());
        var itempageprice = document.querySelector('.product-price-value');
        if(itempageprice){
            itempageprice = itempageprice.innerText;
            var preprice = itempageprice.substring(itempageprice.indexOf(':')+1, itempageprice.indexOf('$')+1);
            //itempageprice = parseFloat(itempageprice.substring(itempageprice.indexOf('$')+1).trimEnd());
            itempageprice = parseFloat(CleanPriceText(itempageprice));
            var itempagetotal = parseFloat(itempageshipping + itempageprice).toFixed(2).toString();
            var finalcostpretext = document.createElement('span');
            finalcostpretext.className = 'total-pretext';
            finalcostpretext.innerHTML = "Total: " + preprice + itempagetotal;
            finalcostpretext.style.fontSize = "24px";
            finalcostpretext.style.fontWeight = "700";
            var finalcostdiv = document.createElement('div');
            finalcostdiv.className = 'total-current';
            finalcostdiv.appendChild(finalcostpretext);
            var insertitemtotal = document.querySelector('.product-action');
            if(insertitemtotal){
                var pretextitem = document.querySelector('.total-pretext');
                if(pretextitem){
                    pretextitem.innerHTML = "Total: " + preprice + itempagetotal;
                }
                else{
                    insertitemtotal.parentNode.insertBefore(finalcostdiv, insertitemtotal);
                }
            }
        }
    }
}

function calctotal(){
    var proplist = document.querySelector('.sku-wrap');
    if(proplist && proplist.childNodes.length > 0){
        var proplistall = proplist.querySelectorAll('.sku-property');
        for (var i = 0; i < proplistall.length; i++) {
            var propitem = proplistall[i].querySelectorAll('.sku-property-item');
            if(!propitem[0].classList.contains('selected')){
                propitem[0].click();
            }
            for (var i2 = 0; i2 < propitem.length; i2++) {
                propitem[i2].addEventListener('click', function() {
                    setTimeout((function(){
                        docalctotal();
                    }),1000);
                });
            }
        }
        setTimeout((function(){
            docalctotal();
        }),1000);
    }
    else{
        docalctotal();
    }
}
if(document.location.href.indexOf('/wholesale') != -1 || document.location.href.indexOf('/af') != -1){
    waitForEl();
    processall(document.querySelectorAll("li.list-item"));
    //sortall(document.querySelectorAll("li.list-item"));
    insertsearch();

    fakeScrollDown();
}
else if(document.location.href.indexOf('/item') != -1){
    waitForEl2();
    setTimeout((function(){
        checkall(document.querySelectorAll(".item-info"));
        calctotal();
    }),2000);
}
