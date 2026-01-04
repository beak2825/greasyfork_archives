// ==UserScript==
// @name        Etsy Tools
// @namespace   https://greasyfork.org
// @include     https://www.etsy.com/*/tools/listings/create*
// @include     https://www.etsy.com/your*
// @version     1.0
// @description Adds easy buttons for Etsy posting.
// @grant       none
// @require     https://greasyfork.org/scripts/23449-gm-api-script/code/GM%20API%20script.js?upDate=2016_09_23
// @downloadURL https://update.greasyfork.org/scripts/36740/Etsy%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/36740/Etsy%20Tools.meta.js
// ==/UserScript==

// @include     https://www.etsy.com/*/tools/listings/create*

var jewelryTypes = [
  'earring',
//  'pendant',
  'necklace',
  'bracelet',
  'brooch',
  
];

var oldLocation = location.href;
 setInterval(function() {
      if(location.href != oldLocation) {
           oldLocation = location.href;
           prepareFields();
           addButtons();
      }
  }, 1000);

var myTimeouts = window.setTimeout(function(){
  prepareFields();
  addButtons();
}, 3000);

var mySlightlyLongerTimeouts = window.setTimeout(function(){
  prepareFields();
  addButtons();
}, 5000);

var myMediumTimeouts = window.setTimeout(function(){
  addButtons();
}, 10000);

var myLongTimeouts = window.setTimeout(function(){
  addButtons();
}, 20000);

function addButtons() {
  if ($('#autoShip').length < 1) {
    $('div:contains("Shipping options")').last().prepend("<span class='customButton' id='autoShip'>Default shipping</span>")
    $('#autoShip').bind('click', function(){
      $('input[name="source_shipping_profile"]').first()[0].checked = true;
      $('input[name="source_shipping_profile"]').first().trigger('click');
      $('input[name="source_shipping_profile"]').first().trigger('change');
      changeValue($('#weight_secondary'), '6');
      changeValue($('#item_length'), '6');
      changeValue($('#item_width'), '4');
      changeValue($('#item_height'), '2');
    });
  }
  $('.customButton').css({
    'border' : '1px solid #ddd',
    'border-radius' : '3px',
    'padding' : '5px',
    'position' : 'relative',
    'top' : '7px',
    'background-color' : '#fafafa',
  });
  $('#autoShip').css({
    'top' : '80px',
    'left' : '20px',
  });
  $('#who_made').trigger('change');
  $('#is_supply').trigger('change');
  $('#when_made').trigger('change');
}

function triggerEffect(target) {
  if (target[0].tagName.toLowerCase() == 'input') {
//    target.trigger('focus');
    target.trigger('keydown');
    target.trigger('keyup');
    target.trigger('keypress');
    target.trigger('click');
    target.trigger('blur');
  } else {
    target.trigger('change');
  }
}

function changeValue(target, value) {
  target.val(value);
  triggerEffect(target);
}

function prepareFields() {
  changeValue($('#who_made'), 'someone_else');
  changeValue($('#is_supply'), 0);
  changeValue($('#when_made'), 'before_1998');
  changeValue($('.select-custom[data-field="taxonomy_id"]').first(), '1179');
  if ($('#gesCustomSKU').length < 1) {
    $('.panel').first().after('<div class="panel p-xs-2 p-md-4 mb-xs-2 mb-md-3 mb-lg-4"><b>SKU number:</b> <input id="gesCustomSKU" class="gesSKU"><br><b>Store number:</b> <input id="gesCustomStoreNumber" class="gesSKU"></div>');
    $('.gesSKU').bind('focusout', function(){
      if ($('#gesCustomSKU').val().length > 0 && $('#gesCustomStoreNumber').val().length > 0) {
        var mySKU = 'EJ-'+$('#gesCustomStoreNumber').val()+'-'+$('#gesCustomSKU').val();
//        $('input[name="sku-input"]').val(mySKU);
        changeValue($('input[name="sku-input"]'), mySKU);
      }
    })
  }
}

setInterval(function(){
  
  $('option:contains("Choose a unit")').each(function(){
    
    var unitMenu = $(this).parent();
    var myVal = unitMenu.find('option:contains("Inches")').val();
    var myInput = unitMenu.parent().find('input').first();
    $(myInput).bind('keyup', function(){
      changeValue(unitMenu, myVal);
    });
    
    
    
  });
  $('input[name="Recycled"]').first().prop('checked', true);
  $('input[name="Can be personalized"]').first().prop('checked', true);
},5000);