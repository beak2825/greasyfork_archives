// ==UserScript==
// @name         shopify autofill
// @version      1.0
// @description  Autofills info
// @author       gonz
// @include      *checkout.shopify.com/*
// @include      *eflash.doverstreetmarket.com/*
// @include      *yeezysupply.com/*
// @include      *kith.com/*
// @include      *checkout.shopifycs.com/*
// @require      http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/18630
// @downloadURL https://update.greasyfork.org/scripts/386922/shopify%20autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/386922/shopify%20autofill.meta.js
// ==/UserScript==

// ADD SHIPPING INFO

var email = "email@email.com"
var firstName = "First";
var lastName = "Last";
var addy1 = "123 Dank St"
var addy2 = "Room 1"
var city = "City"
var state = "CA"
var zip = "55555"
var phone = "5555555555"



// ADD BILLING INFO

var ccNum = "1111222233334444";
var ccName = "First Last";
var ccExp = "04/20";
var ccCVV = "420";


// DO NOT EDIT ANYTHING BELOW 

var firstName_field = $("#checkout_shipping_address_first_name");
var marketing_field = $("#checkout_buyer_accepts_marketing");
var email_field = $("#checkout_email");
var lastName_field = $("#checkout_shipping_address_last_name");
var addy1_field = $("#checkout_shipping_address_address1");
var addy2_field = $("#checkout_shipping_address_address2");
var city_field = $("#checkout_shipping_address_city");
var state_field = $("#checkout_shipping_address_province");
var zip_field = $("#checkout_shipping_address_zip");
var phone_field = $("#checkout_shipping_address_phone");
var ccNum_field = $("#number");
var ccName_field = $("#name");
var ccExp_field = $("#expiry");
var ccCVV_field = $("#verification_value");

$(document).ready(function() {

    if ( firstName_field.length ) {
        marketing_field.click();
        email_field.val(email);
        firstName_field.val(firstName);
        lastName_field.val(lastName);
        addy1_field.val(addy1);
        addy2_field.val(addy2);
        city_field.val(city);
        state_field.val(state);
        zip_field.val(zip);
        phone_field.val(phone);

    }

    if ( ccNum_field.length) {

        ccNum_field.val(ccNum);
        ccName_field.val(ccName);
        ccExp_field.val(ccExp);
        ccCVV_field.val(ccCVV);


        }

});



