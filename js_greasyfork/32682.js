// ==UserScript==
// @name        OCP_CCTracking
// @description:en OCP CC 1
// @namespace   OCP_cctracking
// @include     http://www.oberthurcp.com/tracking.htm
// @include     https://mongol.brono.com/*
// @version     1
// @grant       none
// @description OCP CC 1
// @downloadURL https://update.greasyfork.org/scripts/32682/OCP_CCTracking.user.js
// @updateURL https://update.greasyfork.org/scripts/32682/OCP_CCTracking.meta.js
// ==/UserScript==


// https://mongol.brono.com/mongol/fiona/index.php?m=home

console.log('Jquery', $.fn.jquery);

$( document ).ready(function() {
  /*
  var associative = {[
    elementSelector : "input[name=ad]", value : "+33", 
    elementSelector : "#combo_um", value : "8", 
    elementSelector : ".icon_select[rel=10]", value : ""
  ]};*/

    $("#combo_um").bind("change", function(a) { 
      console.log("value changed", a.options); 
    });
  
  
  $('#d4').show();
  $('input[name=ad]').attr('value', '+33');
  $('#combo_um').attr('value', '8');
  $('.icon_select[rel=10]').click();

  // Captions

  $('input[name=c_key]').attr('value', 'N/A');
  $('input[name=c_door]').attr('value', 'N/A');
  $('input[name=c_emergencybutton]').attr('value', 'N/A');
  $('input[name=c_disarminput]').attr('value', 'N/A');
  $('input[name=c_immobilizer]').attr('value', 'N/A');

  $('input[name=c_analoginput1]').attr('value', 'N/A');
  $('input[name=c_analoginput2]').attr('value', 'N/A');
  $('input[name=c_analoginput1a]').attr('value', '0.0146484375');
  $('input[name=c_analoginput1a]').attr('title', '0.0146484375');
  
  $('input[name=c_analoginput2a]').attr('value', '0.0146484375');
  $('input[name=c_analoginput2a]').attr('title', '0.0146484375');
  $('input[name=c_analoginput2b]').attr('value', '0');
  $('input[name=c_analoginput2b]').attr('title', '0');



  $('input[name=c_arminput]').attr('value', 'N/A');
  $('input[name=c_siren]').attr('value', 'N/A');
  $('input[name=c_lock]').attr('value', 'N/A');
  $('input[name=c_unlock]').attr('value', 'N/A');
  
  $('input[name=c_reason_5_3]').attr('value', 'N/A');
  $('input[name=c_reason_5_5]').attr('value', 'N/A');
  $('input[name=c_reason_5_6]').attr('value', 'N/A');
  $('input[name=c_reason_5_7]').attr('value', 'N/A');
  $('input[name=c_reason_5_8]').attr('value', 'N/A');
  $('input[name=c_reason_5_9]').attr('value', 'N/A');
  $('input[name=c_reason_5_10]').attr('value', 'N/A');
  $('input[name=c_reason_5_11]').attr('value', 'N/A');
  $('input[name=c_reason_5_12]').attr('value', 'N/A');
  $('input[name=c_reason_5_13]').attr('value', 'N/A');
  $('input[name=c_reason_5_14]').attr('value', 'N/A');
  $('input[name=c_reason_5_15]').attr('value', 'N/A');
  $('input[name=c_reason_5_16]').attr('value', 'N/A');
  $('input[name=c_reason_5_17]').attr('value', 'N/A');
  
  $('input[name=c_reason_5_18]').attr('value', 'N/A');
  $('input[name=c_reason_5_19]').attr('value', 'N/A');
  $('input[name=c_reason_5_21]').attr('value', 'N/A');
  $('input[name=c_reason_5_22]').attr('value', 'N/A');
  $('input[name=c_reason_5_23]').attr('value', 'N/A');
  $('input[name=c_reason_5_24]').attr('value', 'N/A');
  $('input[name=c_reason_5_25]').attr('value', 'N/A');
  $('input[name=c_reason_5_26]').attr('value', 'N/A');
  $('input[name=c_reason_5_27]').attr('value', 'N/A');
  $('input[name=c_reason_5_28]').attr('value', 'N/A');
  //$('input[name=c_reason_5_29]').attr('value', 'N/A');
  $('input[name=c_reason_5_30]').attr('value', 'N/A');
  $('input[name=c_reason_5_37]').attr('value', 'N/A');
  $('input[name=c_state_5_1]').attr('value', 'N/A');
  
  $("input").each(function(index, domObject) {
    if($(domObject).val() === "N/A") {
      $(domObject).css("background-color","rgb(239, 240, 241)");
      $(domObject).css("color","#aaa");
    }
  });
  
});


