// ==UserScript==
// @name         Amazon Name Hider
// @version      0.1
// @description  Just Replaces your name and address with what you set
// @description  This should just work on the home page, product pages, orders page, and order details pages.
// @author       NickTh3M4l4chi
// @match        https://www.amazon.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at       document-start
// @namespace https://greasyfork.org/users/582957
// @downloadURL https://update.greasyfork.org/scripts/456295/Amazon%20Name%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/456295/Amazon%20Name%20Hider.meta.js
// ==/UserScript==

var SleepTime = 1;

const ReplaceName = "No Name for you";
const FakeAddress = "101 NoneYaBiz Lane‌"
const FakeAddressLocal = "NonYaBizton, Fu 101011"


var TopLeftNextToSearch = setInterval(function() {
    if ($('#glow-ingress-line1').length) {
        $('#glow-ingress-line1').text('Deliver to ' + ReplaceName);
        $('#glow-ingress-line2').text(FakeAddressLocal);
        clearInterval(TopLeftNextToSearch);
    }
}, SleepTime);

var ProductPageRightSide = setInterval(function() {
    if ($(document.querySelector("#contextualIngressPtLabel_deliveryShortLine > span:nth-child(1)")).length) {
        $(document.querySelector("#contextualIngressPtLabel_deliveryShortLine > span:nth-child(1)")).text('Deliver to ' + ReplaceName + ' -');
        $(document.querySelector("#contextualIngressPtLabel_deliveryShortLine > span:nth-child(2)")).text(FakeAddressLocal);
        clearInterval(ProductPageRightSide);
    }
}, SleepTime);

var OrdersPageMain = setInterval(function() {
    if ($(".a-popover-trigger.a-declarative.insert-encrypted-trigger-text").length) {
        $(".a-popover-trigger.a-declarative.insert-encrypted-trigger-text").text(ReplaceName);
        const OrdersPageMainWorking = 1;
    }
    if ($(".trigger-text").length) {
        $(".trigger-text").text(ReplaceName);
        const OrdersPageMainWorking = 1;
    }
}, SleepTime);


var OrdersPopup = setInterval(function() {
    if ($("[id^=a-popover-content-] > span > div:nth-child(1) > span").length) {
        $("[id^=a-popover-content-] > span > div:nth-child(1) > span").text(ReplaceName);
        $("[id^=a-popover-content-] > span > div:nth-child(2)").text(FakeAddress);
        const OrdersPopupWorking = 1;
    }
    if ($("[id^=a-popover-content-] > div > div > ul > li.displayAddressLI.displayAddressFullName").length) {
        $("[id^=a-popover-content-] > div > div > ul > li.displayAddressLI.displayAddressFullName").text(ReplaceName);
        $("[id^=a-popover-content-] > div > div > ul > li.displayAddressLI.displayAddressAddressLine1").text(FakeAddress);
        $("[id^=a-popover-content-] > div > div > ul > li.displayAddressLI.displayAddressCityStateOrRegionPostalCode").text(FakeAddressLocal);
        $("[id^=a-popover-content-] > div > div > ul > li.displayAddressLI.displayAddressPhoneNumber").remove();
        const OrdersPopupWorking = 1;
    }
}, SleepTime);

var OrderDetailsPage = setInterval(function() {
    if ($("#orderDetails > div.a-box-group.a-spacing-base > div.a-box.a-first > div > div > div > div.a-fixed-right-grid-col.a-col-left > div > div.a-column.a-span5 > div.a-section.a-spacing-none.od-shipping-address-container > div > div > ul > li.displayAddressLI.displayAddressFullName").length) {
        $("#orderDetails > div.a-box-group.a-spacing-base > div.a-box.a-first > div > div > div > div.a-fixed-right-grid-col.a-col-left > div > div.a-column.a-span5 > div.a-section.a-spacing-none.od-shipping-address-container > div > div > ul > li.displayAddressLI.displayAddressFullName").text(ReplaceName);
        $("#orderDetails > div.a-box-group.a-spacing-base > div.a-box.a-first > div > div > div > div.a-fixed-right-grid-col.a-col-left > div > div.a-column.a-span5 > div.a-section.a-spacing-none.od-shipping-address-container > div > div > ul > li.displayAddressLI.displayAddressAddressLine1").text(FakeAddress);
        $("#orderDetails > div.a-box-group.a-spacing-base > div.a-box.a-first > div > div > div > div.a-fixed-right-grid-col.a-col-left > div > div.a-column.a-span5 > div.a-section.a-spacing-none.od-shipping-address-container > div > div > ul > li.displayAddressLI.displayAddressCityStateOrRegionPostalCode").text(FakeAddressLocal);
        const OrderDetailsPageWorking = 1;
    }
}, SleepTime);

var KillLoopsNotInUse = setInterval(function() {
    clearInterval(TopLeftNextToSearch);
    clearInterval(ProductPageRightSie);

    if(OrdersPageMainWorking !== 1) {
        clearInterval(OrdersPageMain);
        console.log('OrdersPageMain killed');
    }
    if(OrdersPopupWorking !== 1) {
        clearInterval(OrdersPopup);
        console.log('OrdersPopup killed');
    }
    if(OrderDetailsPageWorking !== 1) {
        clearInterval(OrderDetailsPage);
        console.log('OrderDetailsPage killed');
    }
}, 2000);