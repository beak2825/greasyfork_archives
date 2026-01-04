// ==UserScript==
// @name         Buyee Helper
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  Making Buyee.jp into the site that Buyee should have made in the first place
// @author       Jake Lewis
// @supportURL   jakelewis3d@gmail.com
// @match        https://buyee.jp/snipe/*
// @match        https://buyee.jp/bid/*
// @match        https://buyee.jp/myorders/*
// @match        https://buyee.jp/item/search*
// @match        https://buyee.jp/item/search/query/*
// @match        https://buyee.jp/item/yahoo/auction/*
// @match        https://buyee.jp/mybaggages/shipped

// @match        https://page.auctions.yahoo.co.jp/jp/auction/*
// @match        https://auctions.yahoo.co.jp/search/*
// @match        https://auctions.yahoo.co.jp/closedsearch/*

// @connect      http://free.currencyconverterapi.com
// @grant        GM.addStyle
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @require      http://code.jquery.com/jquery-latest.min.js



// @downloadURL https://update.greasyfork.org/scripts/377831/Buyee%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/377831/Buyee%20Helper.meta.js
// ==/UserScript==

/*https://auctions.yahoo.co.jp/search/search?
va=5126-8100
&vo=
&ve=
&ngrm=2
&fixed=0
&auccat=23140
&aucminprice=
&aucmaxprice=&
aucmin_bidorbuy_price=
&aucmax_bidorbuy_price=
&l0=0
&abatch=0
&istatus=0
&gift_icon=0
&charity=&
slider=0
&ei=UTF-8
&f_adv=1
&fr=auc_adv
&f=0x4

https://buyee.jp/item/search/query/
seiko%20(6105%206106%206109%206117%206118%206119%20advan%20actus%20vanac%20diamatic)%20-quartz%20-7019%20-%E9%A2%A8%E9%98%B2%20-%E8%85%95%E6%99%82%E8%A8%88%E7%AB%9C%E9%A0%AD%20-%E3%82%AC%E3%83%A9%E3%82%B9/category/23140/?aucmaxprice=5000&new=1&translationType=1
*/


(function() {
    'use strict';


    var COOKIE_PREFIX_noShow = "noShow_";
    var COOKIE_PREFIX_includeNoShows = "IncludeNoShows_";
    var COOKIE_PREFIX_bidAmount = "BidAmount_";
    var COOKIE_PREFIX_notes = "Notes_";
    var COOKIE_PREFIX_DEFERRED_WATCH = "DeferredWatch";

    var globalLocalTimeEndMillis = 0;
    var QUERY_LOCAL_TIME_TO_END_MILLIS = "ToEndMillis";
    var QUERY_MAX_BID = "Bid";

    wordswitch();
    //var html = document.querySelector("html.no-js");   if(html!=null){     console.log("html.lang="+html.lang);    html.lang="ja";} //will now use google translate on whole page doesn't work - too much english in text?
    //debug_ListAllNotes();
    GM.addStyle(' .mybtn{   padding: 1px 1.1em 1px;  letter-spacing: 0.1em;  font-weight: bold;  color: #ffffff;  background-color: #eb9200;  border: 0;  border-radius: 3px;  outline: none;  cursor: pointer;  box-sizing: border-box;');
    var url = window.location.href;
  
    //preSelect('select#snipeYahooCoupon', 1); not sure this is discounting
    bidFinish();
  //  autoTranslate();

    // setSortOrder(1);https://buyee.jp/myorders/bids?snipe_sort=MSxhc2M=

    if(url.startsWith("https://page.auctions.yahoo.co.jp/jp/auction/") ) {
       relocateYahooToBuyee(document, getAuctionId());
    }else{
        checkYahooDeferedAdds();
    }

    if(url.startsWith("https://auctions.yahoo.co.jp/closedsearch/closedsearch")){
       yahooSearchResults();
    }

    if( url.startsWith("https://buyee.jp/item/search") ) {
       searchResultsPage();//url.includes("ranking=popular"));
    }

    if (url.startsWith("https://buyee.jp/myorders/watchlist")){
        parseWatchList();}


    if( url.startsWith("https://buyee.jp/snipe/")){ //record snipes as they are made
        insuredDelivery();
       copySnipeButton("submit");
       recordBid(getAuctionId(), "submit");
       prependChild(document.querySelector("section.info_section"), notesElement(getAuctionId(), 100,2));
    }

    if(url.startsWith("https://buyee.jp/bid/")){
        insuredDelivery();
       copySnipeButton("bid_submit");
       recordBid(getAuctionId(), "bid_submit");
       prependChild(document.querySelector("section.info_section"), notesElement(getAuctionId(), 100,2));

       if(!checkUnderBid()){
           let URLsearchParams = new URL(document.location.toString()).searchParams;
           countDownTimer(URLsearchParams.get(QUERY_LOCAL_TIME_TO_END_MILLIS), URLsearchParams.get(QUERY_MAX_BID));
       }
    }

    if( url.startsWith("https://buyee.jp/myorders/bids")){
        verifyBids();}

    if( url.startsWith("https://auctions.yahoo.co.jp/search/search")){
        yahooSearchResults()}

    if( url.startsWith("https://buyee.jp/mybaggages/shipped")){
        checkShipping()}

    if( url.startsWith("https://buyee.jp/item/yahoo/auction/")){

        if(url.endsWith("/detail")){
            window.location.href = url.substring(0,url.lastIndexOf("/"));
        }
        auctionPage();

    }

     // ------------------------- currency conversion -----------------------------

    function convertFromYen(yen){
        //TODO http://free.currencyconverterapi.com/api/v5/convert?q=JPY_USD&compact=y
        var dollars = yen * 0.00715384615385 / 1.07 //* 1.085;
        return dollars.toFixed(2);


    }


    function checkShipping(){
        var tables = document.querySelectorAll("div.amount_info_container_right");
        for( var t = 0; t<tables.length; t++){
            var table = tables[t];
            var trs = table.querySelectorAll("tr");
            for(var i=1; i< trs.length; i++){
                var tr = trs[i];
                var td = tr.children[0];
                var el = document.createElement("a");
                el.href="https://buyee.jp/item/yahoo/auction/"+td.innerText;
                el.target="_blank";
                el.innerText = td.innerText;
                td.innerText = "";
                td.appendChild(el);
            }
        }
    }

    function parseYahooDateStringToDate(dateString){
        var dateSplit = dateString.split(" ");
        if(dateSplit.length == 4){
            let d = new Date();
            d.setDate(dateSplit[0]);
            let MonthStr = dateSplit[1];
            if(MonthStr == "Jan") {d.setMonth(0);}
            if(MonthStr == "Feb") {d.setMonth(1);}
            if(MonthStr == "Mar") {d.setMonth(2);}
            if(MonthStr == "Apr") {d.setMonth(3);}
            if(MonthStr == "May") {d.setMonth(4);}
            if(MonthStr == "Jun") {d.setMonth(5);}
            if(MonthStr == "Jul") {d.setMonth(6);}
            if(MonthStr == "Aug") {d.setMonth(7);}
            if(MonthStr == "Sep") {d.setMonth(8);}
            if(MonthStr == "Oct") {d.setMonth(9);}
            if(MonthStr == "Nov") {d.setMonth(10);}
            if(MonthStr == "Dec") {d.setMonth(11);}
            d.setYear(dateSplit[2]);
            var timeSplit = dateSplit[3].split(":");
            d.setHours(timeSplit[0]);
            d.setMinutes(timeSplit[1]);
            d.setSeconds(timeSplit[2]);
            return d;
        }
        return null;
    }

    function dateIntervalToString(date){
     return (parseInt(date.getUTCDate())-1)+":"+date.getUTCHours().toString().padStart(2,"0")+":"+date.getUTCMinutes().toString().padStart(2,"0")+":"+date.getUTCSeconds().toString().padStart(2,"0");
    }

    function prefillBidAmount(bidYen){
        if(bidYen <= 45000){ //todo during testing
            var bid = document.querySelector("input#snipeYahoo_price");
            if(bid==null){
                bid = document.querySelector("input#bidYahoo_price");
            }
            if(bid!=null){
                bid.value = bidYen;
                return true;
            }
        }
        return false;
    }

    function checkUnderBid(){

        let input_error = document.querySelector("span.input_error");
        if(input_error!=null){
            let bidhigherStr = input_error.innerText;
            if(bidhigherStr != null){
                let bidhigherSplit = bidhigherStr.split("than ");
                if(bidhigherSplit.length > 1){
                   let bidhigher = parseInt(cleanupPriceStr(bidhigherSplit[1]));
                   prefillBidAmount(bidhigher + 1);
                   return true;
                }
            }
        }
        return false;
    }

    function countDownTimer(localEndMillisStr, maxBidStr){

        var localEndMillis = parseInt(localEndMillisStr);
        if(maxBidStr != null){
            var maxBidYen = parseInt(maxBidStr);
            

   
            if(prefillBidAmount(maxBidYen)){
                var bidButton = document.querySelector("button#bid_submit");
                if(bidButton != null){
                    bidButton.click();
                }
            }
        }
    }


    function nextHigerBid(current, mult){

        if(mult <= 0 || mult > 5) return current;
        if(current < 1000) return nextHigerBid(current + 10, mult-1);
        if(current < 5000) return nextHigerBid(current + 100, mult-1);
        if(current < 10000) return nextHigerBid(current + 250, mult-1);
        if(current < 50000) return nextHigerBid(current + 500, mult-1);
        return nextHigerBid(current + 1000, mult-1);
    }

    function auctionPage(){

        var auctionID = getAuctionId();
        let maxPrice = 0;
        if(auctionID.indexOf("/")<0){
            var fadeElement = null;
            var itemDetail_sec = document.querySelector("section#itemDetail_sec");
            if(itemDetail_sec != null){
                noShowDecision(auctionID, fadeElement, itemDetail_sec, itemDetail_sec.firstChild, function(noShow){
                    if(noShow == true){
                        if(window.history.length > 1){
                            window.history.go(-1);
                        }else{
                            window.close();
                        }
                    }
                });

                //current time
                var remainingSpan = null;
                var infoItem = document.querySelector("div.itemInformation__infoItem");
                if(infoItem != null){
                    remainingSpan = infoItem.querySelector("span.g-text");
                }

                var itemDetail_data = itemDetail_sec.querySelector("ul#itemDetail_data");
                var closingDate = null;
                if(itemDetail_data != null){
                    for(var i=0; i<itemDetail_data.children.length; i++){
                        let li = itemDetail_data.children[i];
                         if(li.innerText.startsWith("Closing Time")){
                             //"Closing Time　(JST)\n15 Jul 2024 22:07:20"
                             var lineSplit = li.innerText.split("\n");
                             if(lineSplit.length > 0){
                                closingDate = parseYahooDateStringToDate(lineSplit[1]);
                                //console.log(closingDate.toString());
                             }
                         }
                        if(li.innerText.startsWith("Current Time")){

                             //"Current Time　(JST)\n15 Jul 2024 22:07:20"
                             var lineSplit2 = li.innerText.split("\n");
                             if(lineSplit2.length > 0){
                                let currentDate = parseYahooDateStringToDate(lineSplit2[1]);
                                if(currentDate != null && closingDate != null){
                                    let closingMillis = closingDate.valueOf();
                                    let currentMillis = currentDate.valueOf();
                                    let gTogoMillis = closingMillis - currentMillis;
                                    let leftString = "To go ";
                                    let fabsTogoMillis = gTogoMillis;
                                    if(gTogoMillis < 0){
                                        leftString = "Ago ";
                                        fabsTogoMillis = -gTogoMillis;
                                    }
                                    var togoDate = new Date(fabsTogoMillis);
                                    console.log(togoDate.toUTCString()); // console.log(togoDate.getUTCDate()+" : "+parseInt(togoDate.getUTCDate()));
                                    var span = li.querySelector("span");

                                    span.innerText += "\n"+leftString+"("+dateIntervalToString(togoDate)+")";//span.style.color = 'green';


                                    if(remainingSpan != null && gTogoMillis>0){
                                        remainingSpan.innerText = dateIntervalToString(togoDate);
                                        globalLocalTimeEndMillis = Date.now() + gTogoMillis;
                                        var timer = setInterval(function(remainingSpan2, localTimeEndMillis2){
                                            let stillLeftMillis = localTimeEndMillis2-Date.now();

                                            var togoDate2 = new Date(stillLeftMillis);
                                            //console.log(togoDate.toUTCString());
                                            if((togoDate2.getUTCSeconds()==0 && (togoDate2.getUTCMinutes()<7 || (togoDate2.getUTCMinutes()%10)==0)) || ( togoDate2.getUTCSeconds()==30 && togoDate2.getUTCMinutes()==0) ){
                                                if(togoDate2.getUTCHours()==0){
                                                    if(togoDate2.getUTCDate()==1){
                                                        window.location.reload();//reload page
                                                    }
                                                }
                                            }
                                            if(stillLeftMillis>0){
                                                remainingSpan2.innerText = dateIntervalToString(togoDate2);
                                            }else{
                                                clearInterval(timer);
                                            }
                                        }, 1000, remainingSpan, globalLocalTimeEndMillis);

                                        //add our snipe button(s)
                                        var bidButtons = document.querySelector("ul.bidButton");
                                        if(bidButtons!=null){
                                            var snipe5Li = document.createElement("li");
                                            bidButtons.appendChild(snipe5Li);



                                            let current_prices = document.querySelectorAll("dl.current_price");
                                            if(current_prices){
                                              
                                              for(var priceIndex=0;priceIndex<current_prices.length;priceIndex++){
                                                    let current_price = current_prices[priceIndex];
                                                    let div_price = current_price.querySelector("div.price");
                                                    if(div_price != null){
                                                        let priceStr = cleanupPriceStr(div_price.innerText);
                                                        let price = parseInt(priceStr);
                                                        if(price > maxPrice) maxPrice = price;
                                                    }
                                                }

                                                for(var bidOptions=0; bidOptions<5; bidOptions++){
                                                    let bidPrice = nextHigerBid(maxPrice, bidOptions+1) + 1;
                                                    var snipe1Button = createURLButton("Snipe "+bidPrice+" yen, $"+convertFromYen(bidPrice),
                                                                                       "https://buyee.jp/bid/"+auctionID+"?"
                                                                                       +QUERY_LOCAL_TIME_TO_END_MILLIS+"="+globalLocalTimeEndMillis
                                                                                       +"&"+QUERY_MAX_BID+"="+bidPrice
                                                                                       , false);// false for debugging; true);
                                                    snipe5Li.appendChild(snipe1Button);
                                                }

                                            }
                                        }
                                    }
                                }
                             }
                         }
                        if(li.innerText == "Automatic Extension\nNo"){
                            li.style.color = "#ff0000";
                             addToAutoNotes(auctionID, "NO_AUTO_EX"); //needs work - notes already loaded?
                        }
                    }

                }
            }
        }
        debugger;
        var messageBox = document.querySelector("p.inbox.joybox");
        if(messageBox !=null){
            var sniperBidText = messageBox.innerText;
            var split = sniperBidText.split("sniper bid of ");
            if(split.length > 1){
                var yenBid = split[1].split(" yen for this auction")[0];
                messageBox.innerText = sniperBidText.replace(" yen ", " yen (US$"+convertFromYen(yenBid)+") ");
                // console.log("sniperBidText:"+sniperBidText);


                var currentPrice = maxPrice;

                messageBox.style.color = (currentPrice < parseFloat(yenBid)) ? "#2eab57":"#ff0000";;

                //GM.addStyle(' .messagebox .joybox{  color: #ff0000;  font-size: 2.0em;} !important;}');

                var cancelButton = createButton("Cancel Snipe Bid");
                messageBox.appendChild(cancelButton);
                addButtonOnClickCallback(cancelButton, auctionID, function(auctionID){
                    removeBuyeeSnipeBid(auctionID, function successCallback(){
                        messageBox.removeChild(cancelButton);
                        messageBox.innerText = "No Bid";messageBox.style.color = "#0x0000ffs";
                    });
                });
            }
        }

        //notes
        var aside = querySelectorError(document, "aside.auction_order_info");
        if(aside!=null){
            prependChild(aside, notesElement(auctionID, 41, 3));
        }

    }





     function insuredDelivery(){
        
        var insLink = document.querySelector('select#snipeYahoo_plan');
        if(insLink == null){
            insLink = document.querySelector('select#bidYahoo_plan');}
        if(insLink != null){
            var wasSelected = insLink.selectedIndex;
           // if(wasSelected == 0){
                insLink.selectedIndex = 0;
                insLink.selectedIndex = 3;
            //}
            console.log('selected item: '+ insLink.selectedIndex+' was '+wasSelected);
        }
    }

    function preSelect(selector, index){
        var insLink = document.querySelector(selector);

        if(insLink != null){
            var wasSelected = insLink.selectedIndex;
            if(wasSelected == 0){
                insLink.selectedIndex = index;}
            console.log('selected item: '+ insLink.selectedIndex+' was '+wasSelected);
        }
    }


    function bidFinish(){
        var bidfinish = document.querySelector("div.bid_finish");
        if(bidfinish!=null){
            var button = document.createElement("button");
            button.appendChild(document.createTextNode('Return to list'));
            button.onclick = function buttonClick(evt){
                window.history.go(-3);
            }
            bidfinish.appendChild(button);
        }
    }

    function autoTranslate(){
        var transLink = document.querySelector('span.translate-link');
        if(transLink != null){
            var link = transLink.children[0];
            var ifrm = document.createElement("iframe");
            ifrm.setAttribute("src", link.href);
           ifrm.style.width = "100%";
           ifrm.style.height = "800px";
            transLink.parentNode.insertBefore(ifrm, transLink);
        }
    }







    function wordswitch(){
        //works pretranslation!
        var innerSection = document;//document.querySelector("section.inner");
        if(innerSection!=null){
            textTree(innerSection, function(textNode, element){
              //  var copy = textNode.nodeValue.substring(0);//copy
                //console.log(textNode.nodeValue);
                //textNode.nodeValue = textNode.nodeValue.replace("ン 風防", 'crystal'); //windshield
                textNode.nodeValue = textNode.nodeValue.replace("風防", 'crystal'); //glass
                textNode.nodeValue = textNode.nodeValue.replace('belt', 'strap');

                textNode.nodeValue = textNode.nodeValue.replace('石', ' jewels '); //no more 'stones'!
              //  needle
              //  console.log(textNode.nodeValue);
            });
        }
    }


    function setSortOrder(index){
        var sortOptions = document.querySelector("div.sort_options");
        if(sortOptions != null){
            var select = sortOptions.querySelector("select");
            if(select != null) {
                select.selectedIndex = index;
            }
        }
    }
    function getSortOrder(){
        var sortOptions = document.querySelector("div.sort_options");
        if(sortOptions != null){
            var select = sortOptions.querySelector("select");
            if(select != null) {
                return select.selectedIndex;
            }
        }
        return -1;
    }


    function searchResultsPage(){

    (async () => {
        GM.addStyle(' .list_layout .product_image{ max-width: 175px;background-color: #ffffff; padding: 0px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.3); !important;}');
        GM.addStyle(' .image_container .product_image_wrap .product_image {  max-height: 156px;  box-sizing: border-box; !important;}');


         // if(nHits>20){  var nHits = querySelectorThrow(document,"div.result-num").innerText.split("/ ")[1].split(" hits")[0];    console.log("Hits:"+nHits);       loadOtherPage(window.location.href+"&page=2");          }
                            //console.log("debugListbids:"); var keys = await GM.listValues(); for (var i = 0; i < keys.length; i++){ var key = keys[i]; if(key.startsWith(COOKIE_PREFIX_bidAmount)){ console.log("__debug: "+key+" "+ await GM.getValue(key));}}
                            var searchOptions = querySelectorThrow(document,"div.search_options");
                            var includeNoShows = await GM.getValue(COOKIE_PREFIX_includeNoShows,false);
                            console.log("includeNoShows:"+includeNoShows);
                            var includeNoShowControl = createCheckControl('include noShow',
                                                                          "IncludeNoShow",
                                                                          includeNoShows,
                                                                          null,
                                                                          function(event){
                                GM.setValue(COOKIE_PREFIX_includeNoShows, event.target.checked );
                                window.location.reload(false);
                            });
                            searchOptions.appendChild(includeNoShowControl);

        //var productFieldLists = document.querySelectorAll("ul.product_field");
        //productFieldList = removeDataBind(productFieldList, "ul", "product_field", "product_field list_layout logged in"); not necc, and breaks watchlist
        var auctionSearchResult = document.querySelectorAll("ul.auctionSearchResult");
       console.log("auctionSearchResult.length:"+auctionSearchResult.length);
        for(var ax=0; ax<auctionSearchResult.length;ax++){
        var productFieldLists = auctionSearchResult[ax].querySelectorAll("li.itemCard");
        //opens a clicked image in a new window:

        try{
            if(productFieldLists!=null){
                console.log("productFieldLists.length:"+productFieldLists.length);
                for(var b=0; b<productFieldLists.length;b++){
                    var productFieldList = productFieldLists[b];
                    var thumbnail__outer = productFieldList.querySelectorAll("div.g-thumbnail__outer");
                    console.log("li.product_whole.length:"+thumbnail__outer.length);
                    if(thumbnail__outer!=null){


                            //var bJustNew = getSortOrder()==8; // Most Popular and newly listed



                            for(var p = 0; p < thumbnail__outer.length; p++){
                                var pic = thumbnail__outer[p];

                                var auctionLink = pic.children[0];
                                var auctionID = auctionLink.href.substring(auctionLink.href.lastIndexOf("/")+1).split("?")[0];

                                //auctionLink.target="_blank";
                                //divert the image towards yahoo page
                                auctionLink.href = switchToYahooItemPage(auctionID);
                                auctionLink.setAttribute("target", "_blank");//disable this for easier debugging


                                //Mmm, the <a> is causing clicking issues (due to it's data-bind) lets replace it;
                                var href = auctionLink.href;
                                auctionLink = removeDataBind(auctionLink, "a", "auctionLink");

                                var a = wrapItem(auctionLink.querySelector("div.g-thumbnail"), href);
                                // var a = document.createElement("a"); myAuctionLink.appendChild(a);
                                // a.href = auctionLink.href; a.target = auctionLink.target;
                                // a.appendChild(auctionLink.querySelector("div.image_container"));

                                //var fadeElement = a;//auctionLink.querySelector("div.image_container");

                               // wrapItem(auctionLink.querySelector("p.product_title"), href);
                                var productInfo = productFieldList.querySelector("div.g-priceDetails");
                                var addDiv = document.createElement("div");addDiv.name = "addDiv"; prependChild(productInfo, addDiv);
                                var notes = notesElement(auctionID, 70,2);
                                addDiv.appendChild(notes);
                                noShowDecision(auctionID, productFieldList, addDiv, notes);
                                //
                                //var br = document.createElement('br');
                                //productInfo.insertBefore(br, productInfo.firstChild);

                                var productPrice = querySelectorThrow(productInfo, "div.g-price__outer");
                                var bidSpan = getBid(await GM.getValue(COOKIE_PREFIX_bidAmount+auctionID, ""),cleanupPriceStr(productPrice.innerText), auctionID);
                                if(bidSpan!=null){
                                    productPrice.appendChild(lineBreak());
                                    productPrice.appendChild(bidSpan);
                                }

                                var buyeeLink = productFieldList.querySelector("div.itemCard__itemName");
                                if(buyeeLink != null){
                                    var link = buyeeLink.children[0];
                                    if(link!=null){
                                        link.setAttribute("target", "_blank");//disable this for easier debugging
                                    }
                                }

                            }

                    }
                }
            }
        }catch(e){console.log(e);}
        }//ax
    })();//async
    }


    function removeDataBind(input, type, name, className){

        //var success = Reflect.set(input, "data-bind", null);        return input;  //that would be too easy, but the bind hasn't been set yet
        var output = document.createElement(type);
        output.name = name+"_noDataBind";
        output.className = className;

        input.parentNode.insertBefore(output, input);

        while(input.firstChild!=null){
            output.appendChild(input.firstChild);}

       input.parentNode.removeChild(input);
       return output;
    }

    function wrapItem( child, href){
        var a = document.createElement("a");
        child.parentNode.insertBefore(a, child);
        a.href = href;
        a.target="_blank";
        a.appendChild(child);
        return a;
    }

/*    function loadOtherPage(url){
         GM_xmlhttpRequest({
                            method: "GET",
                            url: window.location.href+"&page=2",
                            headers: {
                                "User-Agent": "Mozilla/5.0", // If not specified, navigator.userAgent will be used.
                                "Accept": "text/xml" // If not specified, browser defaults will be used.
                            },
                            onload: function(response) {
                                var responseXML = null;
                                // Inject responseXML into existing Object (only appropriate for XML content).
                                if (!response.responseXML) {
                                    responseXML = new DOMParser()
                                        .parseFromString(response.responseText, "text/xml");
                                    var junk =1;
                                }

                                console.log([
                                    response.status,
                                    response.statusText,
                                    response.readyState,
                                    response.responseHeaders,
                                    response.responseText,
                                    response.finalUrl,
                                    responseXML
                                ].join("\n"));
                            }
                        });
    }*/

    function parseWatchList(){
         //watchlist
        GM.addStyle(' .wl_item_title > img {  height: auto;  width: 200px;} !important;}');

        try{
            var items = document.querySelectorAll("a.wl_item_title");
            if(items!=null){
                (async () => {
                    for(var i=0; i<items.length; i++){//=2){
                        var item = items[i];
                        item.target="_blank";
                       // items[i+1].target="_blank";
                        var auctionID = item.href.substring(item.href.lastIndexOf("/")+1).split("?")[0];
                       // item.href = switchToYahooItemPage(auctionID);

                        var productPrice = querySelectorThrow(item.parentElement.parentElement, "div.g-price__outer");//"td.col_right");
                        productPrice.appendChild(lineBreak());

                        var bidSpan = getBid(await GM.getValue(COOKIE_PREFIX_bidAmount+auctionID, ""),cleanupPriceStr(productPrice.innerText), auctionID);
                        if(bidSpan!=null){
                            productPrice.appendChild(bidSpan);
                        }

                        //ugh, this isn't laying out easily. lets put it in it's own table.
                        var table = document.createElement("table");var tbody = document.createElement("tbody"); table.appendChild(tbody); var tr = document.createElement("tr"); tbody.appendChild(tr);
                        item.parentNode.appendChild(table);
                       // tr.appendChild(items[i+1]);
                        var tr2 = document.createElement("tr"); tbody.appendChild(tr2);
                        tr2.appendChild(notesElement(auctionID, 27,3));

                        var buyeeLink = item.querySelector("div.itemCard__itemName");
                        if(buyeeLink != null){
                            var link = buyeeLink.children[0];
                            link.href = switchToYahooItemPage(auctionID);
                            if(link!=null){
                                link.setAttribute("target", "_blank");//disable this for easier debugging
                            }
                        }

                        // items[i+1].target="_blank";


                    }
                })();//async
            }
        }catch(e){console.log(e);}
    }

    // ------------------- NO SHOW ---------------

    function noShowDecision(auctionID, fadeElement, insertParent, insertBefore, funcCallback){

    (async () => {
       
       var noShow = await GM.getValue(COOKIE_PREFIX_noShow+auctionID, false);
       var inlcudeNoShows = await GM.getValue(COOKIE_PREFIX_includeNoShows,false);

       var noShowControl = createCheckControl('noShow',
                                                auctionID,
                                                           noShow,
                                                           fadeElement,
                                                           function(event){
                                                                var auctionID = event.target.id;
                                                                var noShow = event.target.checked;
                                                                if(noShow){
                                                                      GM.setValue(COOKIE_PREFIX_noShow+auctionID, timeStamp() );
                                                                }else{
                                                                    GM.deleteValue(COOKIE_PREFIX_noShow+auctionID);
                                                                }
                                                                hideNoShow(event.target.actOnData, noShow, inlcudeNoShows);
                                                                if(funcCallback!=null){
                                                                    funcCallback(noShow);}
                                                          });

      if(insertBefore!=null){
          insertParent.insertBefore(noShowControl,insertBefore);
      }else{
          insertParent.appendChild(noShowControl);
      }

     // console.log("noShow:"+noShow+"   "+auctionID);
      hideNoShow(fadeElement, noShow, await GM.getValue(COOKIE_PREFIX_includeNoShows,false));

     })();//async

    }

   function createBaseControl(prettyName, label, inputNode){
    var controlSpan = document.createElement("span");
    var labelNode = document.createElement("label");
    labelNode.style="white-space: nowrap";
    labelNode.for = label;
    labelNode.innerText = prettyName;
    controlSpan.appendChild(labelNode);
    if(inputNode!=null){
        labelNode.appendChild(inputNode);}
    return controlSpan;
}

    function createCheckControl(prettyName, label, currentValue, actOnData, onChangeFunc){
        var inputNode = document.createElement('input');
        inputNode.type = 'checkbox';
        inputNode.id = inputNode.name = label;
        inputNode.checked = currentValue;
        inputNode.onchange = onChangeFunc;
        inputNode.actOnData = actOnData; // the parameters needed in the callback function

       return createBaseControl(prettyName, label, inputNode);

}

    function hideNoShow(el, noShow, includeNoShows){

        if(el!=null){
            //el.hidden = true;
            if(noShow){
                if(includeNoShows){
                    el.style="opacity:0.4;filter:alpha(opacity=20)";
                    el.hidden = false; //was el.parentNode
                }else{
                    el.hidden = true;
                }
            }else{
                el.style="opacity:1.0;filter:alpha(opacity=100)";
            }
        }
    }


    // ---------------------- recording bids -----------------------------------------

    function recordBid(auctionID, submitStr){
     /*  var button =createButton("wishlist");
         addButtonOnClickCallback(button, auctionID, function(auctionID){
             addToBuyeeWishlist(auctionID);
         });
         querySelectorThrow(document,"span.description").appendChild(button);
     */

        try{
            addButtonOnClickCallback(querySelectorThrow(document, "button#"+submitStr),
                                     null,
                                    function(){

                addToBuyeeWishlist(auctionID);
                var bid = document.querySelector("input#snipeYahoo_price");
                if(bid==null){
                    bid = querySelectorThrow(document,"input#bidYahoo_price");
                }
                var yenBid = bid.value;
                GM.setValue(COOKIE_PREFIX_bidAmount+auctionID, yenBid); //store it as a cookie
                console.log("recorded bid of Y"+yenBid);

                var junk = 1;
            });
        }catch(e){console.log(e)};
    }


    function verifyBids(){
        GM.addStyle(' .my_auctions .bids_your_info ul li.under_price{font-size: 1.1em; color: #ff0000;} !important;}');
        GM.addStyle(' .bids_item_image img{  box-sizing: content-box;  display: block;  width: 200px;  height: auto;  padding: 5px;  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);} !important;}');
        try{
            var snipes = document.querySelectorAll("li.clearfix");
            if(snipes!=null && snipes.length>0){
                (async () => {
                    //debugListBids();
                    //clearBids();
                   /* if we leave them we can still view them in ended auctions
                    console.log("clearBids");
                    var keys = await GM.listValues();
                    for (var i = 0; i < keys.length; i++){
                        var key = keys[i];
                        if(key.startsWith(COOKIE_PREFIX_bidAmount)){
                            //console.log("delete "+key);
                            await GM.deleteValue(key);
                        }
                    }*/
                    //debugListBids();
                    for(var s=0; s<snipes.length; s++){
                        var snipe = snipes[s];
                        var auctionID = snipe.id.split("_")[1];

                        var price = snipe.querySelector("li.highest_price, li.under_price");
                        var txt = price.childNodes[2];
                        var yenPrice = cleanupPriceStr(txt.nodeValue);
                        await GM.setValue(COOKIE_PREFIX_bidAmount+auctionID, yenPrice);
                        console.log("store bid: "+COOKIE_PREFIX_bidAmount+auctionID+" "+yenPrice);

                        var button = querySelectorThrow(snipe, "button.btn.silver");

                        addButtonOnClickCallback(button, auctionID, function(auctionID){
                            GM.deleteValue(COOKIE_PREFIX_bidAmount+auctionID);
                            console.log(COOKIE_PREFIX_bidAmount+auctionID+" deleted");
                           // debugListBids();
                        });
                      snipe.querySelector("b.snipe_info").appendChild(notesElement(auctionID, 50,2));
                    }
                    debugListBids();
               })();//async
            }
        }catch(e){console.log(e);}
    }

    function getBid(bidAmount, currentPrice, auctionID, bBlank){// 1,600 yen

           // debugListBids();
            var bidSpan = document.createElement("span");
            bidSpan.id = "bidSpan";
            if(bidAmount.length>0){

               var yenBid = parseFloat(bidAmount);
               bidSpan.innerText = " Your Bid: JPY:"+bidAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" (US$"+convertFromYen(yenBid)+")";
               bidSpan.style.color = (parseFloat(currentPrice) < yenBid) ? "#2eab57":"#ff0000";

               //cancel bid
               if(!url.includes("yahoo.co.jp/")){ //until we get GM_xml working cross domain
                   var cancelButton = createButton("Cancel Bid");
                   bidSpan.appendChild( lineBreak());
                   bidSpan.appendChild(cancelButton);

                   addButtonOnClickCallback(cancelButton, auctionID, function(auctionID){
                       removeBuyeeSnipeBid(auctionID, function successCallback(){
                           bidSpan.removeChild(cancelButton);
                           bidSpan.innerText = "No Bid"; bidSpan.style.color ="#0000ff";
                           bidSpan.appendChild(createURLButton("Snipe", "https://buyee.jp/snipe/"+auctionID));
                       });
                   });
               }

            }else{
              bidSpan.innerText = "No Bid"; bidSpan.style.color ="#0000ff";
            }
            bidSpan.appendChild( lineBreak());
            bidSpan.appendChild(//createImgURLButton("https://cdn.buyee.jp/images/common/logo_buyee.png", "https://buyee.jp/snipe/"+auctionID, 45,13)
               createURLButton("Snipe", "https://buyee.jp/snipe/"+auctionID, bBlank)//
            );
            return bidSpan;

    }

    function cleanupPriceStr(price){
        return price.trim().replace(",","").split(" ")[0];
    }

    /*function clearBids(){
        (async () => {
            console.log("clearBids");
            var keys = await GM.listValues();
            for (var i = 0; i < keys.length; i++){
                var key = keys[i];
                if(key.startsWith(COOKIE_PREFIX_bidAmount)){
                    console.log("delete "+key);
                    await GM.deleteValue(key);
                }
            }
        })();//async
    }*/

    function debugListBids(){
        (async () => {
            var keys = await GM.listValues();
            console.log("debugListbids:");
            for (var i = 0; i < keys.length; i++){
                var key = keys[i];
                if(key.startsWith(COOKIE_PREFIX_bidAmount)){
                    console.log("__debug: "+key+" "+ await GM.getValue(key));}
            }
        })();//async
    }

    function copySnipeButton(summitStr){
        try{
            //<button id="bid_submit" class="btn btn_settlement btn_ok point_settlement_display js_bid_btn js_bid_submit">Complete</button>
            //<button id="submit" class="btn btn_settlement btn_ok btn_shadow point_settlement_display js_bid_btn js_bid_submit">Snipe it now</button>
            var snipeItNowButton = querySelectorThrow(document, "button#"+summitStr);
            var snipeItNowButton2 = snipeItNowButton.cloneNode(true);
            var bidInputContents = querySelectorThrow(document, "label.bid_item_price");
            bidInputContents.appendChild(snipeItNowButton2);
            bidInputContents.appendChild(createURLButton("Cancel\nBid", "http://buyee.jp/item/yahoo/auction/"+getAuctionId(), false));
        }catch(e){
            console.log(e);}
    }







    // ---------------------- Yahoo site

    //https://buyee.jp/item/search/advanced/yahoo/auction?query=seiko%20(6105%206106%206109%206117%206118%206119%20advan%20actus%20vanac%20diamatic)%20-quartz%20-7019%20-%E9%A2%A8%E9%98%B2%20-%E8%85%95%E6%99%82%E8%A8%88%E7%AB%9C%E9%A0%AD%20-%E3%82%AC%E3%83%A9%E3%82%B9&category=23140&aucmaxprice=5000&translationType=1
    //https://auctions.yahoo.co.jp/search/search?va=seiko&vo=6105+6106+6109+6117+6118+6119+advan+actus+vanac+diamatic&ve=quartz+7019+%E9%A2%A8%E9%98%B2+%E8%85%95%E6%99%82%E8%A8%88%E7%AB%9C%E9%A0%AD+%E3%82%AC%E3%83%A9%E3%82%B9&ngrm=2&fixed=0&auccat=23140&aucminprice=&aucmaxprice=5000&aucmin_bidorbuy_price=&aucmax_bidorbuy_price=&l0=0&abatch=0&istatus=0&new=1&gift_icon=0&charity=&slider=0&ei=UTF-8&f_adv=1&fr=auc_adv&f=0x4

    function switchToYahooItemPage(auctionID){
        return "https://page.auctions.yahoo.co.jp/jp/auction/"+auctionID;
    }

    function relocateYahooToBuyee(root, auctionID){

        try{ // for some reason Google Translate is rearranging our elements!!
         //  var bidButton = querySelectorThrow(document, "div.Price__buttonArea");        bidButton.hidden = true;

            //hide the buyee ad
           var buyeeAd = document.querySelector("div.acMdBuyee");
           if(buyeeAd != null) {buyeeAd.hidden = true;}

            //hide the recommended carousal
            var carousal = document.querySelector("div#modPallAuc");
           if(carousal != null) {carousal.hidden = true;}

           //var shippingPrice = document.querySelector("span.Price__postageValue.Price__postageValue--bold");
           var shippingPrice = document.querySelector("span.Price__postageValue");

            addToAutoNotes(auctionID, (shippingPrice!=null)?"ship:"+shippingPrice.innerText+" yen":null, function(){
                var sellersDescription = querySelectorThrow(document, "div.ProductExplanation__body");
                scanForCentimeters(sellersDescription.innerText, auctionID, function(){
                    var priceDiv = querySelectorError(document, "div.Price.Price--current");
                    if(priceDiv!=null){
                        prependChild(priceDiv, notesElement(auctionID, 50, 4));}
                });
            });

           /* var watchlistBtn = document.querySelector("li.Count__watch").children[0];
            //var oldFunc = watchlistBtn.onclick; todo we should really call this
            watchlistBtn.onclick = null;
            addButtonOnClickCallback(watchlistBtn, auctionID, function(auctionID){
                addToBuyeeWishlistDeferred(auctionID);
                return false; // the old function return
            });*/

           var priceYen = querySelectorThrow(root, "dd.Price__value--aucValue, dd.Price__value, p.dectxtaucprice, td.pr1");



            var priceYenStr = priceYen.innerText.split('円')[0]
           // console.log("priceYen:"+priceYen.innerText+ "__"+priceYenStr+"___"+cleanupPriceStr(priceYenStr));
           //priceYen.innerText = "Yen "+priceYenStr+ " (US$"+convertFromYen(parseFloat(cleanupPriceStr(priceYenStr)))+")";
             priceYen.appendChild(textElement(" (US$"+convertFromYen(parseFloat(cleanupPriceStr(priceYenStr)))+")"));
             // priceYen.appendChild(lineBreak());
            priceYen.appendChild(lineBreak());
             var buyeeButton = createImgURLButton("https://cdn.buyee.jp/images/common/logo_buyee.png","https://buyee.jp/item/yahoo/auction/"+auctionID, 90,26);
            priceYen.appendChild(buyeeButton);
            var FromJapanButton = createImgURLButton("https://s3-eu-west-1.amazonaws.com/tpd/logos/59f99f520000ff0005af3c30/0x0.png","https://www.fromjapan.co.jp/japan/en/auction/yahoo/input/"+auctionID, 90,90);
            priceYen.appendChild(FromJapanButton);

            priceYen.appendChild(lineBreak());
             (async () => {//
                 var bidSpan = getBid(await GM.getValue(COOKIE_PREFIX_bidAmount+auctionID, ""),cleanupPriceStr(priceYenStr), auctionID, false);


                  if(bidSpan!=null){
                    // priceYen.appendChild(lineBreak());
                     priceYen.appendChild(bidSpan);
                    //  priceYen.appendChild(lineBreak());

                 }
             })();//async


          var priceNote = document.querySelector( "span.Price__note");
          if(priceNote !=null){
              if(priceNote.childNodes[0].href == "https://www.yahoo-help.jp/app/answers/detail/a_id/40664/p/353"){
                  addToAutoNotes(auctionID, "Has Reserve");
             }
          }

        }catch(e){console.log(e);}
    }

     function yahooSearchResults(){

        var ProductItems = querySelectorThrow(document,"ul.Products__items");
      //  var tbody = divlist.querySelector("tbody");
        var Products = ProductItems.children;

         for(var i=0; i< Products.length; i+=1){
            var Product = Products[i];

            var piclink = Product.querySelector("a");
            if(piclink !=null){
                var auctionID = getAuctionId(piclink.href);
                // console.log(auctionID);

              //not working relocateYahooToBuyee(a, auctionID);

                piclink.target = "_blank";
                (async () => {//
                    //set main link to buyee page
                    var ProductTitleLink = Product.querySelector("a.Product__titleLink");
                    if(ProductTitleLink){
                        ProductTitleLink.href = "https://buyee.jp/item/yahoo/auction/"+auctionID;
                        ProductTitleLink.target = "_blank";
                    }

                    //diplay dollars
                    var ProductPriceValue = Product.querySelector("span.Product__priceValue");
                    if(ProductPriceValue){
                        var fontTag = ProductPriceValue.firstChild;
                        var priceText = fontTag.textContent;
                        var split = priceText.split(" ");
                        if(split.length==1){
                            split = priceText.split("円");
                        }
                        if (split.length >= 1)
                        {
                            var yenBid = split[0];
                            fontTag.textContent = priceText + " (US$" + convertFromYen(cleanupPriceStr(yenBid)) + ") ";
                        }



                        
                        var bidSpan = getBid(await GM.getValue(COOKIE_PREFIX_bidAmount+auctionID, ""), cleanupPriceStr(yenBid), auctionID, false);

                        if(bidSpan!=null){
                            ProductTitleLink.appendChild(bidSpan);
                        }

                    }


                })();//async

                //date check
                  
                    var ProductTime = Product.querySelector("span.Product__time");
                    if(ProductTime){
                        var fontTag = ProductTime.firstChild;
                        if(fontTag){
                            var timeText = fontTag.textContent;  //06/16 23:42
                            var split = timeText.split(" ");//0 is date, 1 is time
                            var datesplit = split[0].split("/");//0 is date, 1 is time
                            const d = new Date();//will fill in current year; //todo wraps around previous year.
                            var month = parseInt(datesplit[0]) - 1;
                            d.setMonth(month);
                            d.setDate( datesplit[1]);
                            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                            const colors= ['red', 'black', 'black', 'black', 'black', 'black', 'blue'];
                            let day = days[d.getDay()];
                            fontTag.textContent = timeText + " " + day;
                            ProductTime.style.color = colors[d.getDay()];
                        }
                    }

            /*  not working!  var fadeElement = tr;//.firstChild;
            //    var productInfo = a.parentNode.parentNode.parentNode;
                var h3 = tr.querySelector("h3");
                var br = document.createElement('br');
                h3.insertBefore(br, h3.firstChild);
                noShowDecision(auctionID, fadeElement, h3, br);
*/
/*                 var watchlistBtn = trs[i+1].querySelector("p.modWlBtn").children[0];
                //var oldFunc = watchlistBtn.onclick; todo we should really call this
                watchlistBtn.onclick = null;
                addButtonOnClickCallback(watchlistBtn, auctionID, function(auctionID){
                    addToBuyeeWishlistDeferred(auctionID);
                    return false; // the old function return
                }); */

            }
        }

        console.log("trs.length ",trs.length);

    }
    // ----------------------Buyee Wishlist ------------------------------
    function addToBuyeeWishlistDeferred(auctionID){
        //save these to cookies so we can add them to buyee watchlist next buyee pageload;
        (async () => {
            var deferedWatchAdds = await GM.getValue(COOKIE_PREFIX_DEFERRED_WATCH, "");
            if(deferedWatchAdds.length > 0){
                deferedWatchAdds += ",";}
            deferedWatchAdds+=auctionID;
            console.log("deferedWatch:"+deferedWatchAdds);
            await GM.setValue(COOKIE_PREFIX_DEFERRED_WATCH, deferedWatchAdds);
         })();//async
    }

    function checkYahooDeferedAdds(){
         (async () => {
            var deferedWatchAdds = await GM.getValue(COOKIE_PREFIX_DEFERRED_WATCH, "");
            console.log("deferedWatch:"+deferedWatchAdds);
            GM.deleteValue( COOKIE_PREFIX_DEFERRED_WATCH );
            if(deferedWatchAdds.length > 0){
                var split = deferedWatchAdds.split(",");
                for(var i=0; i<split.length; i++){
                    addToBuyeeWishlist(split[i]);
                }
            }
         })();//async
    }

    function addToBuyeeWishlist(auctionID){
        xmlPOST( "https://buyee.jp/api/v1/watch_list/add",auctionID, null );
    }

    function removeBuyeeSnipeBid(auctionID, successCallback){
        xmlPOST( "https://buyee.jp/api/v1/snipe/remove",auctionID, function(){
                           GM.deleteValue(COOKIE_PREFIX_bidAmount+auctionID);
                           if(successCallback!=null)successCallback();
        } );
    }


    // -------------------------- Notes ----------------------------------------

    function notesElement(auctionID, width, height){
        if(width == undefined) width = 40;
        if(height== undefined) height = 3;

        var input = document.createElement("textarea");
        //input.type="text";
        input.id = input.name = "notes_"+auctionID;
        input.rows = height;
        input.cols = width;
        input.placeholder = "Notes";
         (async () => {
         input.value = await GM.getValue(COOKIE_PREFIX_notes+auctionID, null);
         })();//async
         input.onblur = function(){
                console.log(auctionID+" "+input.value);
                if(input.value==null || input.value.length == 0){
                     console.log("notes: "+auctionID+" deleteNote");
                     GM.deleteValue(COOKIE_PREFIX_notes+auctionID);
                }else{
                    console.log("notes: "+ auctionID+" store note:"+input.value);
                    GM.setValue(COOKIE_PREFIX_notes+auctionID, input.value);
                }
         }
        input.onclick = function(event){event.stopPropagation();event.stopImmediatePropagation();}

        return input;
    }

    function debug_ListAllNotes(){
         (async () => {

            var keys = await GM.listValues();
            for (var i = 0; i < keys.length; i++){
                var key = keys[i];
                if(key.startsWith(COOKIE_PREFIX_notes)){
                   console.log("notes: "+key+" "+ await GM.getValue(key));}
            }
        })();//async
    }

    function addToAutoNotes(auctionID, notetext, callbackFunc){
         if(notetext==null)
            { if(callbackFunc!=null) callbackFunc();}
         else{
             (async () => {
                 //await GM.deleteValue(COOKIE_PREFIX_notes+auctionID);
                 var decoratedNotetext = " { "+notetext+" }";
                 var currentNote = await GM.getValue(COOKIE_PREFIX_notes+auctionID,"");
                 if(!currentNote.includes(decoratedNotetext)){
                     GM.setValue(COOKIE_PREFIX_notes+auctionID, currentNote+decoratedNotetext );
                     console.log("Buyee Helper addToAutoNotes:"+currentNote+decoratedNotetext);
                 }
                 if(callbackFunc!=null) callbackFunc();
             })();//async
         }
    }

    function scanForCentimeters(text, auctionID, callbackFunc){
     //text = "Description of item Thank you very much for seeing this product from among a number of auctions ! We will try to pleasant dealings ♪ ※※ in any case we do not enclosed dispatch is ※※because it will re-send when there is no payment within three days from a successful bid even if I have to deposit then Shipment refunds can not be made dead stock ♪ operation OK ☆ SEIKO 5 Seiko Five 7009-3110 3 needle deidite self-winding men's wristwatch ★ 7009-3110: Google, Images, Jules, Boley, YouTube, Ebay, Ebay, picclick, buyee, sleuth 5, 17, bidfun, closed, photo Database, trovestar,Case 3.3 cm ※ circumference excluding crown : 21 cm "
     var cmRegEx = /[.\d]*(\s)*[cm]m/g;

       var matches = text.match(cmRegEx);
       if(matches!=null){
           var total = "";
           for(var key in matches){
              var match = matches[key];

              if(match.length>0){
                   total += match+", ";
              }
           }
           addToAutoNotes(auctionID, total, callbackFunc);
       }else{
           callbackFunc();
       }
        /*
       //if after translation
       var textlines = text.split("\n");
       for (var l=0; l<textlines.length; l++){
           var textline = textlines[l]
           var matches = textline.match(cmRegEx);
           if(matches && matches.length > 0){
               addToAutoNotes(auctionID, textline);
           }
       }*/
    }




    //-------------------------- Helpers -------------------------------------

    function prependChild(parent, child){ parent.insertBefore( child, parent.firstChild );}

    function getAuctionId(u){

        if(u==null){
            u = url; }
        u = u.split("?")[0];
        u = u.split("ProductProcedures")[0];
        u = u.split("group")[0];
        //auctionIDs are not always the same length
        return u.substring(u.lastIndexOf("/")+1).replace("#","");
    }

    function createButton(text){
         //var button = document.createElement("button");         button.appendChild(document.createTextNode(text));//buyee is adding all kinds of form data to buttons :(
         var button = textElement(text, "#ffffff");
         button.className = "mybtn";
         return button;
    }

    function createImgURLButton(imgsrc, url, width, height){
         var el = document.createElement("a");
         el.href=url;
         el.target="_blank";
         //el.innerText = label;
        var img = document.createElement("img");
        img.src = imgsrc;
        img.height = height;
        img.width = width;
        //console.log(img.src);
        el.style.margin = "1px 1px";

        el.appendChild(img);
        return el;
    }


    function createURLButton(text, url, bBlank){
         var el = document.createElement("a");
         el.href=url;
         if(bBlank!=false) el.target="_blank";
         //el.innerText = label;
         var button = createButton(text);
         //button.className = "btn";
        //button.form = null;
        //console.log(img.src);

        el.style.margin = "1px 1px";
        el.appendChild(button);
        return el;
      }

    function addButtonOnClickCallback(button, callbackData, onClickCallback){
        if(button.onclick != null) throw "button already has onclick";
        button.callbackData = callbackData;
        if(onClickCallback!=null){
            button.onclick = function(e){
                onClickCallback(e.target.callbackData);
            }
        }
    }


    function querySelectorThrow(root, sel){
        var res = root.querySelector(sel);
        if(res==null) {
            console.error(" Could not find "+sel+" in "+root);
            throw " Could not find "+sel+" in "+root;
        }
        return res;
    }

    function querySelectorError(root, sel){
        var res = root.querySelector(sel);
        if(res==null) {
            console.error(" Could not find "+sel+" in "+root);
        }
        return res;
    }

    function lineBreak(){ return document.createElement("br");}

    function textElement(text, color){
        var element = document.createElement("span");
        if(color!=null){
            element.style.color=color;}
        element.innerText = text;
        return element;
    }

    function timeStamp(){ return new Date().getTime(); }

    function textTree(parentEl, callbackFunction){
        for(var c=0; c<parentEl.childElementCount; c++){
            var el = parentEl.children[c];
            textTree(el, callbackFunction);
        }
        for (var i = 0; i < parentEl.childNodes.length; i++) {
            var node = parentEl.childNodes[i];
            if(node.nodeName == "#text"){
            // console.log(i+" "+node.nodeName+" value:"+node.nodeValue );
                callbackFunction(node, parentEl);
            }
        }

    }



    /*/eg post( url, {     'SEARCH':searchTerm,     'SEARCHFIELDS':'name',   }     );
    function post(path, params, method) {
        method = method || "post"; // Set method to post by default if not specified.
        var form = document.createElement("form");
        form.setAttribute("method", method);
        form.setAttribute("action", path);
        form.setAttribute("enctype", "multipart/form-data");
        form.setAttribute("target", "_blank");//disable this for easier debugging

        for(var key in params) {
            if(params.hasOwnProperty(key)) {
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", params[key]);


                form.appendChild(hiddenField);
            }
        }

        document.body.appendChild(form);
        form.submit();
    }
*/

   /* {    "User-Agent": "Mozilla/5.0", // If not specified, navigator.userAgent will be used.
         "Accept": "text/xml" // If not specified, browser defaults will be used.
     }*/


    function xmlPOST(url,auctionID, successCallback){
    //only jquery is working correctly at the moment, but no cross-domain
    $.ajax({
            type:     'POST',
            url:      url,
            data:     {auctionId: auctionID},
            dataType: 'json',
        }).done(function() {
              if(successCallback!=null)successCallback();
        }).fail(function() {
               alert( "Bid NOT Cancelled" );
        });
         /*
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", url);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify({auctionId: auctionID}));
      */


        /*
        var data = new FormData(); data.set( 'auctionId', auctionID);
            //JSON.stringify({auctionId: auctionID});
        GM_xmlhttpRequest({
                            method: "POST",
                            url: url,
                            data:data,// formData,
                            //dataType: 'json',
                            headers:  { "Accept": "application/json, text/javascript","Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
                            overrideMimeType:'json',
                            onload: function(response) {
                                 console.log([
                                    "status: "+response.status,
                                    "statusText: "+response.statusText,
                                    "status: "+response.readyState,
                                    "readyState: "+response.responseHeaders,
                                  //  "responseText: "+response.responseText,
                                    "finalUrl: "+response.finalUrl,
                                    "responseXML: "+response.responseXML
                                ].join("\n"));

                                if(onloadCallback!=null){
                                    onloadCallback(response);}
                            }
                        });
                        */

    }


})();