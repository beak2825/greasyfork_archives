// ==UserScript==
// @name           GOG Orders history prices summary
// @version        1.52
// @namespace      XcomeX
// @author         XcomeX
// @license        Copyleft (Ɔ) GPLv3
// @description    Sum paid and original prices on orders history pages and get your total saved money on sales. Add new button (SUM ORDERS on this page) on Orders history page in settings.
// @include        https://www.gog.com/account/settings/orders
// @grant          GM_addStyle
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/14022/GOG%20Orders%20history%20prices%20summary.user.js
// @updateURL https://update.greasyfork.org/scripts/14022/GOG%20Orders%20history%20prices%20summary.meta.js
// ==/UserScript==


var targBtnLocation = document.getElementsByClassName("_search orders-header__search")[0].parentNode;

var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="sumPageButton" type="button">SUM THIS Page</button> <button id="sumAllButton" type="button">SUM ALL ORDERS</button>';
zNode.setAttribute ('id', 'sumContainer');
targBtnLocation.appendChild (zNode);

var xNode       = document.createElement ('div');
xNode.setAttribute ('id', 'sumResultsContainer');
targBtnLocation.appendChild (xNode);

var yNode       = document.createElement ('div');
yNode.setAttribute ('id', 'totalSumContainer');
targBtnLocation.appendChild (yNode);

document.getElementById ("sumPageButton").addEventListener (
    "click", SumPageButtonClickAction, false
);
document.getElementById ("sumAllButton").addEventListener (
    "click", SumAllPagesButtonClickAction, false
);

$( ".pagin" ).click(function() {
  window.scrollTo(0, 0);
});

GM_addStyle ( "                                    \
    #sumContainer  {                               \
        float:               right;                \
    }                                              \
    .sumRow  {                                     \
        font-weight:         100;                  \
    }                                              \
    .priceSum  {                                   \
        width:               51px;                 \
        display:             inline-block;         \
    }                                              \
    #sumAllButton, #sumPageButton {                \
        color:               #262626;              \
        font-weight:         600;                  \
        font-size:           14px                  \
        line-height:         1.5;                  \
        position:            relative;             \
        top:                 10px;                 \
        background:          #E0E0E0;              \
        border:              none;                 \
        padding-top: 3px;                          \
    }                                              \
    #sumAllButton {                                \
        color:               #ffffff;              \
        background:          #337ab7;              \
    }                                              \
    .deleteSumRowButton {                          \
        color:               gray;                 \
        font-size:           11px;                 \
        line-height:         1.5;                  \
        background:          none;                 \
        border:              none;                 \
        bottom:              2px;                  \
        position:            relative;             \
    }                                              \
    #sumAllButton:hover {                          \
        background:          #286090;              \
    }                                              \
    #sumPageButton:hover  {                        \
        background:          #EBEBEB;              \
    }                                              \
    .deleteSumRowButton:hover                  {   \
       text-decoration: underline;                 \
    }                                              \
    #sumResultsContainer, #totalSumContainer {     \
        text-align:          right;                \
    }                                              \
" );

async function SumNextPageAction() {
    var page = getCurrentPage();
    var totalPages = getTotalPages();
    if (page == totalPages) {
        return;
    } else {
        $(".pagin__next").click();
        sleep(800).then(() => {
            SumPageAction();
            SumNextPageAction();
        })
    }
}

function SumAllFromFirstPageAction() {
    $(".pagin__prev").click();
    sleep(500).then(() => {
        var page = getCurrentPage();
        if (page == "1") {
            SumPageAction();
            SumNextPageAction();
            return;
        }
        SumAllFromFirstPageAction();
    })
}

function SumPageButtonClickAction (zEvent) {
    SumPageAction();
}

function SumAllPagesButtonClickAction (zEvent) {
    SumAllFromFirstPageAction();
}

// ---------------------------------------------------------------------------------

function SumPageAction () {
    $("#sumResultsContainer").append(SumRow());

    $(".deleteSumRowButton").each(function( index ) {
        $(this).click(function() {
              $(this).closest('div').remove();
              $("#totalSumContainer").html(TotalSumRow());
            });
       });

    $("#totalSumContainer").html(TotalSumRow());
}

function SumRow() {
    purchasePrice = SumPurchasePrices().toFixed(2);
    originalPrice = SumOriginalPrices().toFixed(2);
    saved = (originalPrice - purchasePrice).toFixed(2);
    currency = "";
    page = pad(getCurrentPage());
    totalPages = getTotalPages();
    
    sumRow = 
        "<div id='sumRow" + page + "' class='sumRow'>" 
          + "ORDERS HISTORY PAGE " + page + " of " + totalPages + " | "
          + " Paid: " + currency + "<span class='priceSum sumPurchasePrice'>" + purchasePrice + "</span>"
          + " | Original price: " + currency + "<span class='priceSum sumOriginalPrice'>" + originalPrice + "</span>"
          + " | Saved: " + currency + "<span class='priceSum sumSaved'>" + saved + "</span>"
          + '<button class="deleteSumRowButton" type="button">remove</button>' 
        + "</div>"
    return sumRow;
}

function TotalSumRow () {
    var purchasePricesSum = 0.00;   
    $(".sumPurchasePrice").each(function( index ) {
       var price = $(this).text();    
        purchasePricesSum = purchasePricesSum + parseFloat(price || 0.0);
    });    

    var originalPricesSum = 0.00;   
    $(".sumOriginalPrice").each(function( index ) {
       var price = $(this).text();    
        originalPricesSum = originalPricesSum + parseFloat(price || 0.0);
    });    
    
    var savedSum = 0.00;   
    $(".sumSaved").each(function( index ) {
       var price = $(this).text();    
        savedSum = savedSum + parseFloat(price || 0.0);
    });        
    
    currency = getCurrencySymbol();
    totalSumRow = 
        "<div id='totalSumRow'>" 
          + "TOTAL"
          + " | Paid: " + currency + purchasePricesSum.toFixed(2)
          + " | Original price: " + currency + originalPricesSum.toFixed(2)
          + " | Saved: " + currency + savedSum.toFixed(2)
        + "</div>";
    return totalSumRow;
}

function SumPurchasePrices () {
    var sum = 0.00;
    tagWalletOrders();
    $(":not('.order-item__wallet').order-item__products [ng-bind='product.price.amount']").each(function( index ) {
       var price = 
          $(this)
           .clone()    //clone the element
           .children() //select all the children
           .remove()   //remove all the children
           .end()  //again go back to selected element
           .text();    
        sum = sum + parseFloat(price || 0.0);
    });    

    return sum;
}

function SumOriginalPrices () {
    var sum = 0.00;   
    $(".order-item__products [ng-bind='product.price.baseAmount']").each(function( index ) {
       var price = $(this).text();    
        sum = sum + parseFloat(price || 0.0);
    });    
    
    return sum;
}

function tagWalletOrders() {
    var wallet = $('span:contains("Wallet funds")');
    var walletOrders = wallet.closest(".order-item__products");
    walletOrders.addClass("order-item__wallet");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function pad (str) {
  str = str.toString();
  var max = getTotalPages().length;
  return str.length < max ? pad("0" + str, max) : str;
}

function getCurrencySymbol() {
    var priceText = $(".order-item__products [ng-bind='product.price.amount']").get(0);
    var symbol = window.getComputedStyle(priceText,':before').content.replace(/\"/g, '').trim();
    return symbol;
}

function getCurrentPage() {
    var currentPage = $(".pagin__input:first").val();    
    return currentPage;
}

function getTotalPages() {
    var totalPages = $(".pagin__total:first").text();    
    return totalPages;
}