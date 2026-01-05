// ==UserScript==
// @name        RealPrice
// @version    0.04
// @description Sales + Shipping Cost Calculator Tool for Amazon
// @include        *://*.amazon.com/gp/*
// @include        *://*.amazon.com/*/gp/*
// @include        *://*.amazon.com/dp/*
// @include        *://*.amazon.com/*/dp/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @icon
// @namespace   ae815016b48133558af667b55c9b2c93
// @downloadURL https://update.greasyfork.org/scripts/10161/RealPrice.user.js
// @updateURL https://update.greasyfork.org/scripts/10161/RealPrice.meta.js
// ==/UserScript==
$(document).ready(function(){ 
    
console.log("RealPrice activated");

function mainPrice() {
    var price1 = $("#priceblock_ourprice").text();
    var price2 = $("#priceBadging_feature_div").text();
    var price = price1.replace ( /[^\d.]/g, '' );
    var sPrice = price2.replace ( /[^\d.]/g, '' );
    var totalt = parseFloat(price) + parseFloat(sPrice);
    
    // Insertion
    $('<tr id="testt1" >Blah<tr>').insertAfter($("#priceblock_ourprice_row"));

    // Free Shipping Check
    if($.isNumeric(sPrice)) {
        $("#testt1").html('<td class="a-color-secondary a-size-base a-text-right a-nowrap">RealPrice:</td><td><b class="a-span12 a-size-medium a-color-price">$' + totalt.toFixed(2) + '</b></td>');
    }
    else {
        // do nothing
    }
}
    
function bbPrice() {
    var bprice1 = $("#mbc .a-size-medium").text();
    var bprice2 = $("#mbc .a-section .a-color-secondary").text();
    var bprice = bprice1.replace ( /[^\d.]/g, '' );
    var bsPrice = bprice2;
    var numbersArray = bprice1.split('$');
    var numbersArray2 = bprice2.split('+' || $('#a-icon-prime').length < 0);
    //var numbersArray2 = bprice2.split('+');
    //alert(numbersArray2);
    var btotalt;
    var bb;
    
    $.each(numbersArray, function(index, value) { 
        console.log(index + ': ' + value);
    });
    
    $.each(numbersArray2, function(index, value) { 
        if(value.replace( /[^\d.]/g, '' ) == $.isNumeric(value)) {
           value = "0"; 
           numbersArray2[index] = value;
        }
        else {  
            var phold = value.replace ( /[^\d.]/g, '' );
            value = phold;
            numbersArray2[index] = phold;
        }
        console.log(index + ': ' + value);
    });
   
        setTimeout(
  function() 
  {
    //do something special
      for(var i = 0; i < 4; i++) {
          if ($(numbersArray2).length == 3) {
          var tempn = parseFloat(numbersArray[i + 1]) + parseFloat(numbersArray2[i]);
          $("#mbc .a-button-inner a:eq(" + i + ")").text("$" + tempn.toFixed(2));  
              } 
          else if($(numbersArray2).length == 4 || $(numbersArray2).length <= 3) {
          var tempn1 = parseFloat(numbersArray[i]) + parseFloat(numbersArray2[i]);
          var num1 = i - 1;
          $("#mbc .a-button-inner a:eq(" + num1 + ")").text("$" + tempn1.toFixed(2)); 
              
              }
          else {
              
          }
    
      }}, 100);
      
        
  }  

    
mainPrice();
bbPrice();
});

function multilineStr (dummyFunc) {
    var str = dummyFunc.toString ();
    str     = str.replace (/^[^\/]+\/\*!?/, '') // Strip function () { /*!
    .replace (/\s*\*\/\s*\}\s*$/, '')   // Strip */ }
    .replace (/\/\/.+$/gm, '') // Double-slash comments wreck CSS. Strip them.
    ;
    return str;
}
