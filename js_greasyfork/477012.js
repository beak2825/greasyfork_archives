// ==UserScript==
// @name         CoffeeMonsterz-appearance-rework
// @namespace    http://tampermonkey.net/
// @version      1.13
// @description  reorder things within orders, and adds the price after discounting
// @author       Sam Tang
// @match        https://admin.shopify.com/store/thecoffeemonsterzco/*/*
// @match        https://admin.shopify.com/store/thecoffeemonserzco/*
// @match        https://admin.shopify.com/store/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477012/CoffeeMonsterz-appearance-rework.user.js
// @updateURL https://update.greasyfork.org/scripts/477012/CoffeeMonsterz-appearance-rework.meta.js
// ==/UserScript==

// jQbYz : list elems
// PiJ5I : list self

// wait for full load

console.log("script active")

var interval = setInterval(function() {

    if (document.getElementsByClassName("_CustomStyledList_1lmi8_1").length > 0 && document.URL.match("thecoffeemonsterzco/orders/").length >= 1){
    main();
    }

 }, 500);


// auto refresh

function main(){
    var elemList = [];

    // ref parent list

    // UL count

    var totalUL = document.querySelectorAll("ul")
    for (var i = 0; i < totalUL.length; i++){
        if (totalUL[i].children.length > 0){
        //console.log(totalUL[i])
        //console.log(i)
        //console.log(totalUL[i].children.length)
        }
    }

    // find the total list
    var parentList = totalUL[7];
    for (let i of totalUL){
        var allSub = i.querySelectorAll("li");

        var found = false;
        for (let j of allSub){
            if (j.textContent.includes("SKU")){

                found = true;
                console.log("found item list");
                console.log(i);
                parentList = i;
                break;
            }

        }

        if (found){
            break
        }

    }

    // 7th item is the total list: use this to find what the total list is
    

    //console.log(parentList);

    var childList = parentList.children;
    for (let i of childList){
        elemList.push(i.cloneNode(true));
    }

    elemList.sort(compareElems);
    //console.log(elemList);
    // put sorted items back to orig list

    while(parentList.firstChild){
        parentList.removeChild(parentList.lastChild);
    }
    for (let i of elemList){
        parentList.appendChild(i);
    }

    //console.log(1)
    // put in discounted price
    //class="Polaris-Text--root_yj4ah Polaris-Text--bodyMd_jaf4s Polaris-Text--break_32vap"
    // parent: class="Polaris-LegacyCard__Subsection" class="_PaymentSection_1l60t_1"

    // check discount

    //console.log("before search for discount")

    var discountParent = null;
    for (const a of document.querySelectorAll("span")) {

        //console.log(a.textContent);

        if (a.textContent.includes("Subtotal")) {
            //console.log(a.textContent);

            discountParent = a.parentNode.parentNode.parentNode.parentNode;
            //console.log(a.parentNode.parentNode.parentNode.parentNode.textContent); // this is the parent of both of them


        }
    }

    // after finding the discount parent we find the child with the word discount in it


    // discounted prices
    if (discountParent == null){
        return;
    }


    var priceParent = discountParent;
    var priceEntries = priceParent.getElementsByClassName("Polaris-InlineGrid");
    var allPrices = priceParent.children;
    //console.log(priceEntries);
    var vals = [];

    for (let i of allPrices){
        vals.push(i.textContent);
    }
    //console.log(vals);



    var rawPrice = parseFloat(vals[0].split("$")[1].replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '').match(/([1234567890.]+)/)[0]);
    var discount = parseFloat(vals[1].split("$")[1].replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '').match(/([1234567890.]+)/)[0]);
    //console.log(rawPrice + "   " + discount);

    var discountPresent = false;
    for(let i of priceParent.children){
        if (i.textContent.includes("Discount")){
            discountPresent = true;
        }
    }


    if (vals.length > 3 && (document.getElementById("discountedPriceTag")==null) && discountPresent){

        //console.log(discountPresent);
        // 1st child of parent node

        var template = priceParent.firstChild.cloneNode(true);
        //console.log(template)

        //var priceTitle =getClsFromElem(template,"Polaris-Text--root Polaris-Text--bodyMd");

        // get all spans and stuff there

        var spans = template.querySelectorAll("span");

        //console.log(spans.length);

        var priceTitle = spans[0]

        //var priceMid = getClsFromElem(template,"Polaris-Box");

        var priceMid = spans[1]

        //var priceNum = getClsFromElem(template,"Polaris-Text--root Polaris-Text--bodyMd Polaris-Text--break");

        var priceNum =spans[2]


        priceTitle.textContent = "";
        priceMid.textContent = "Price After Discount";
        priceMid.style.marginLeft = "auto";
        priceMid.style.textAlign = "right";
        priceMid.style.marginRight = "0";
        priceMid.parentNode.parentNode.parentNode.style = "--pc-horizontal-stack-align: right; --pc-horizontal-stack-block-align: center; --pc-horizontal-stack-wrap: nowrap; --pc-horizontal-stack-gap-xs: var(--p-space-300);";
        priceNum.textContent = " $" + roundTo((rawPrice - discount), 8);
        template.id = "discountedPriceTag";


        var insertionPoint = priceParent.children[2]
        priceParent.insertBefore(template, insertionPoint);

    }

}
function roundTo(n, digits) {
  if (digits === undefined) {
    digits = 0;
  }

  var multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  var test =(Math.round(n) / multiplicator);
  return +(test.toFixed(digits));
}

// a: Elem
// b: Elem

// cls of unit index: Polaris-Text--root_yj4ah Polaris-Text--bodySm_nvqxj Polaris-Text--break_32vap Polaris-Text--subdued_17vaa
// cls of title: Polaris-Link_yj5sy Polaris-Link--removeUnderline_adav6

function compareElems(a,b){

    //console.log(a.querySelectorAll("span"))
    //console.log(b.querySelectorAll("span"))

    // find the span item that has the sku in it

    var aSkuElem = null
    var aTitle = null
    var bSkuElem = null
    var bTitle = null
    for (let i of a.querySelectorAll("span")){
        if (i.textContent.includes("SKU")){
            aSkuElem = i
        }else{
            aTitle = i;
        }
    }

    for (let i of b.querySelectorAll("span")){
        if (i.textContent.includes("SKU")){
            bSkuElem = i;
        }else{
            bTitle = i;
        }
    }




    //var aSkuElem = getClsFromElem(a,"Polaris-Text--root Polaris-Text--bodySm Polaris-Text--break Polaris-Text--subdued");
    //var bSkuElem = getClsFromElem(b,"Polaris-Text--root Polaris-Text--bodySm Polaris-Text--break Polaris-Text--subdued");
    //var aTitle = getClsFromElem(a, "Polaris-Link Polaris-Link--removeUnderline");
    //var bTitle = getClsFromElem(b, "Polaris-Link Polaris-Link--removeUnderline");

    var aSku = "";
    var bSku = "";
    var aText = "";
    var bText = "";

    // extract txt
    if (aSkuElem){
        aSku = aSkuElem.textContent.substring(4);
    }
    if (bSkuElem){
        bSku = bSkuElem.textContent.substring(4);
    }

    if (aTitle){
        aText = aTitle.textContent;
    }
    if (bTitle){
        bText = bTitle.textContent;
    }

    // handle null index/indexed
    if (aSkuElem != null && bSkuElem == null){
        return -1; // a is indexed, b is not indexed, a < b (ranked before)
    }
    if (aSkuElem == null && bSkuElem != null){
        return 1; // a is non-indexed, b is indexed, a > b (ranked later)
    }

    // handle null index/null index
    if (aSkuElem == null && bSkuElem == null){
        if (aText > bText){
            return 1;
        }
        if (aText<bText){
            return -1;
        }
        if (aText == bText){
            return 0;
        }

    }

    // handle indexed/ indexed
    //console.log("SKU list:");
    //console.log(aSku)
    //console.log(bSku)
    // regex test for SKU containing all Alphabets
    // let regex = /^[a-zA-Z]+$/;
    // seriously don't mess up your naming conventions, programmers will be very disappointed
    //
    let alphabetRegex = /^[a-zA-Z()]+$/;
    if (alphabetRegex.test(aSku.replace(/ /g,''))){
        if (!alphabetRegex.test(bSku.replace(/ /g,''))){
            return 1;
        }
    }
    if (alphabetRegex.test(bSku.replace(/ /g,''))){
        if (!alphabetRegex.test(aSku.replace(/ /g,''))){
            return -1;
        }
    }
    if (alphabetRegex.test(aSku.replace(/ /g,'')) && alphabetRegex.test(bSku.replace(/ /g,''))){
        return aSku < bSku;

    }


    var aVal = parseInt(aSku.match(/(\d+)/)[0],10);
    var bVal = parseInt(bSku.match(/(\d+)/)[0],10);
    var aPrefix = aSku.match(/[A-Z][A-Z]*/)[0];
    var bPrefix = bSku.match(/[A-Z][A-Z]*/)[0];

    if(aPrefix < bPrefix){
        return -1;
    }
    if (bPrefix < aPrefix){
        return 1;
    }

    if (aVal > bVal){
        return 1;
    }

    if (bVal > aVal){
        return -1;
    }

    var aType = 2147483647;

    if ([...aSku.matchAll(/[A-Z]+/g)].length >= 2){

        aType = [...aSku.matchAll(/[A-Z]+/g)][1][0];
    }
    var bType = 2147483647;

    if ([...bSku.matchAll(/[A-Z]+/g)].length >= 2){

        bType = [...bSku.matchAll(/[A-Z]+/g)][1][0];
    }

    if (aType > bType){
        return 1;
    }
    if (bType > aType){
        return -1;
    }

    return 0;
}

// returns 1st match
function getClsFromElem(node, cls) {
  if (node == null){
  	return null;
  }
  if (node.className == cls){
  	return node;
  }
  var nextEntry = null;
  for(let i of node.children){
 		nextEntry = getClsFromElem(i, cls);
    if (nextEntry != null){

    	return nextEntry;
    }
  }
  return nextEntry;
}
