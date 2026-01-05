// ==UserScript==
// @name        SGW Item Modification Fixer (Chrome) - DEPRECATED
// @namespace   greasyfork.org
// @version     1.1.1
// @grant       none
// @require     https://greasyfork.org/scripts/10208-gm-api-script/code/GM%20API%20script.js?version=54964
// @include     https://sellers.shopgoodwill.com/sellers/modifyItem.asp*
// @description Keeps a log of edits
// @downloadURL https://update.greasyfork.org/scripts/19964/SGW%20Item%20Modification%20Fixer%20%28Chrome%29%20-%20DEPRECATED.user.js
// @updateURL https://update.greasyfork.org/scripts/19964/SGW%20Item%20Modification%20Fixer%20%28Chrome%29%20-%20DEPRECATED.meta.js
// ==/UserScript==


$('*[name]').not('[id]').each(function(){
  $(this).attr('id', $(this).attr('name'));
});

if ($('#itemSellerInfo').val().indexOf("[[<") < 0) {
    var labels = {
  //    'itemTitle' : 'Title',
  //    's1' : 'Cat',
    //  'table' : 'Description',
      'itemWeight' : 'ShipWt',
  //    'itemDisplayWeight' : 'RealWt',
      'itemShippingPrice' : 'Shipp$',
      'itemShipMethod' : 'ShipBy',
  //    'itemsellerstore' : 'Store',
      'itemSellerInventoryLocationID' : 'Loc',
    }

  var values = {};
  $.each(labels, function(elementID, fieldLabel){
    values[fieldLabel] = $('#'+elementID).val();
  });

  $('body').append("<div id='originalValues'></div>");
  $('#originalValues').data('originalValues', values);
  /*
  var labelsCB = {
    'itemNoCombineShipping' : 'No combine shipping',
    'itemAutoInsurance' : 'Automatic insurance (USPS)',
  }

  var valuesCB = {};
  $.each(labelsCB, function(elementID, fieldLabel){
    if ($('#'+elementID+":checked").length > 0) {
      valuesCB[fieldLabel] = 'Yes';
    } else {
      valuesCB[fieldLabel] = 'No';
    }
  });

  $('body').append("<div id='originalValuesCB'></div>");
  $('#originalValuesCB').data('originalValuesCB', valuesCB);
  */

  $('#submit1').bind("click", function(e){
    e.preventDefault();
    var labels = {
  //    'itemTitle' : 'Title',
  //    's1' : 'Cat',
    //  'table' : 'Description',
      'itemWeight' : 'ShipWt',
  //    'itemDisplayWeight' : 'RealWt',
      'itemShippingPrice' : 'Ship$',
      'itemShipMethod' : 'ShipBy',
  //    'itemsellerstore' : 'Store',
      'itemSellerInventoryLocationID' : 'Loc',
    }
    originalValues = $('#originalValues').data('originalValues');
  //  originalValuesCB = $('#originalValuesCB').data('originalValuesCB');
    var changedValues = {};
    var newValues = {};
  //  var changedValuesCB = {};
  //  var newValuesCB = {};
    $.each(labels, function(elementID, fieldLabel) {
      if ($('#'+elementID).val() != originalValues[fieldLabel]){
        changedValues[fieldLabel] = originalValues[fieldLabel];
        newValues[fieldLabel] = $('#'+elementID).val();
      }
    });
  /*  $.each(labelsCB, function(elementID, fieldLabel) {
      oldVal = originalValuesCB[fieldLabel];
      if ($('#'+elementID+":checked").length > 0) {
        newVal = "Yes";
      } else {
        newVal = "No";
      }
      if (newVal != oldVal){
        changedValuesCB[fieldLabel] = oldVal;
        newValuesCB[fieldLabel] = newVal;
      }
    });*/
    var d = new Date();
    if (!$.isEmptyObject(changedValues) || !$.isEmptyObject(changedValuesCB)) {
      myID = 'edit-' + d.getTime();
      myTable = "[[<" + d.getMonth() + "/" + d.getDate() + ", " + (d.getHours() - 2) + ":" + ("0" + d.getMinutes()).slice(-2) + " PT- ";
      if (!$.isEmptyObject(changedValues)){
          $.each(changedValues, function(fieldLabel, originalValue){
             myTable += fieldLabel + ": ";
             myTable += originalValue;
             myTable += ";";
          });
      }
  /*     if (!$.isEmptyObject(changedValuesCB)){
          $.each(changedValuesCB, function(fieldLabel, originalValue){
             myTable += fieldLabel + ": ";
             myTable += originalValue;
             myTable += "<br>";
          });
      }*/
      myTable += "]]<br>";
      $('body').first().append(myTable);
      myNote = $('#itemSellerInfo').val();
      $('#itemSellerInfo').val(myNote + myTable)
    } else {
      console.dir(changedValues);
    }
    $('#FORM1').submit();
  });
}


$('#itemTitle').parent().parent().parent().hide();
$('#itemTitle').parent().parent().parent().before("<tr><td valign='top' width='10' bgcolor='#2045A3'><img src='../images/spacer.gif' height=' 0' width='10'></td><td id='contentTD'></td></tr>");

$('#contentTD').append("<p id='itemTitleContainer'><b>Item Title:</b> </p>");
$('#itemTitleContainer').append($('#itemTitle'));

$('#contentTD').append("<p id='itemCategoryContainer'><b>Category:</b> </p>");
$('#itemCategoryContainer').append($('#s1'));

$('#contentTD').append("<p id='itemDescriptionContainer'></p>");
//$('#itemDescriptionContainer').append($('#WebWizRTE').parent().parent());
//$('#WebWizRTE').show().appendTo($('#contentTD'));
$('font:contains("HTML tags")').parent().appendTo($('#contentTD'));

// TODO: Shipping calculator?
$('#contentTD').append("<div id='itemShippingDetailsContainer'></div>");
$('#itemShippingDetailsContainer').append("<p id='itemShippingWeightContainer'><b>Shipping Weight:</b> </p>");
$('#itemShippingWeightContainer').append($('#itemWeight'));
$('#itemShippingDetailsContainer').append("<p id='itemDisplayWeightContainer'><b>Display (Actual) Weight:</b> </p>");
$('#itemDisplayWeightContainer').append($('#itemDisplayWeight'));
$('#itemShippingDetailsContainer').append("<p id='itemShippingPriceContainer'><b>Shipping Charge:</b><br></p>");
$('#itemShippingPriceContainer').append($('#itemShippingPrice'));
$('#itemShippingDetailsContainer').append("<p id='itemShipMethodContainer'><b>Shipping Method:</b> <br></p>");
$('#itemShipMethodContainer').append($('#itemShipMethod'));
$('#itemShippingDetailsContainer').append("<p id='itemNoCombineShippingContainer'><b>Item Shipment Combining:</b><br></p>");
$('#itemNoCombineShippingContainer').append($('#itemNoCombineShipping'));
$('#itemNoCombineShippingContainer').append(" Select this option if the buyer of this item should bot be allowed to combine this item with shipment of other items.");
$('#itemShippingDetailsContainer').append("<p id='itemAutoInsuranceContainer'><b>Auto Include Insurance (USPS Only):</b></p>");
$('#itemAutoInsuranceContainer').append($('#itemAutoInsurance'));

$('#contentTD').append("<p id='itemsellerstoreContainer'><b>Seller Store:</b> </p>");
$('#itemsellerstoreContainer').append($('#itemsellerstore'));

$('#itemSellerInventoryLocationID').parent().attr('id', 'itemSellerInventoryLocationIDContainer').appendTo($('#contentTD'));

$('#contentTD').append("<p id='itemSellerInfoContainer'><b>Seller Private Description:</b><br></p>");
$('#itemSellerInfoContainer').append($('#itemSellerInfo'));

$('#contentTD').append("<p style='position:relative; left: 10px; padding-bottom:4px;'><span class='fakeButton' onclick='$(\"#hiddenJunk\").toggle();'>Show/hide hidden fields/etc.</span></p>");


$('#contentTD').parent().after("<tr style='display:none;' id='hiddenJunk'><td valign='top' width='10' bgcolor='#2045A3'><img src='../images/spacer.gif' height=' 0' width='10'></td><td id='hiddenJunkTD'></td></tr>");

$('#hiddenJunkTD').append("<p id='itemQuantityContainer'><b>Item Quantity: </b></p>");
$('#itemQuantityContainer').append($('#itemQuantity').parent());

$('#hiddenJunkTD').append("<p id='itemMinimumBidContainer'><b>Minimum Bid: </b></p>");
$('#itemMinimumBidContainer').append($('#itemMinimumBid').parent());

$('#hiddenJunkTD').append("<p id='itemBidIncrementContainer'><b>Bid Increment: </b></p>");
$('#itemBidIncrementContainer').append($('#itemBidIncrement').parent());

$('#hiddenJunkTD').append("<p id='itemReserveContainer'><b>Reserve Price: </b></p>");
$('#itemReserveContainer').append($('#itemReserve').parent());
$('#itemReserve').parent().children().first().remove();

$('#hiddenJunkTD').append("<p id='itemBuyNowPriceContainer'><b>Buy Now Price: </b></p>");
$('#itemBuyNowPriceContainer').append($('#itemBuyNowPrice').parent());
$('#itemBuyNowPrice').parent().children().first().remove();

$('#hiddenJunkTD').append("<p id='itemActualDimensionsContainer'></p>");
$('#itemActualDimensionsContainer').append($('#itemLength').parent().parent().parent());

$('#hiddenJunkTD').append("<p id='itemShippingDimensionsContainer'></p>");
$('#itemShippingDimensionsContainer').append('<font face="Arial" size="2"><strong>Shipping Dimension - Length x Width x Height in inches (optional)</font><font face="arial" color="#a3223a" size="4"></font>:</strong>');
$('#itemShippingDimensionsContainer').append($('#itemShipLength'));
$('#itemShippingDimensionsContainer').append(" <font face='Arial' size='2'>(Numbers and decimal point '.' only) Used for shipping optimization and prevention of oversized charges.</font>");

$('#hiddenJunkTD').append("<p id='itemShippingContainer'><b>Shipping: </b><p>");
$('#itemShippingContainer').append($('#itemShipping'));
$('#itemShippingContainer').append($('select[name="itemShipping"]'));

$('#hiddenJunkTD').append("<p id='itemHandlingPriceContainer'><b>Handling Charge: </b></p>");

$('#itemHandlingPriceContainer').append($('#itemHandlingPrice').parent());
$('#itemHandlingPrice').parent().children().first().remove();

$('#hiddenJunk').after("<tr><td valign='top' width='10' bgcolor='#2045A3' height='10px'><img src='../images/spacer.gif' height=' 0' width='10'></td><td id='hiddenJunkTD'></td></tr>");




$('.fakeButton').css({
  'border' : '1px solid #CCC',
  'background-color' : '#EEE',
  'padding' : '3px',
  'margin' : '3px',
});

// don't forget checkboxes! also #table does not have a val()...

// can I touch $('body.WebWizRTEtextarea')???