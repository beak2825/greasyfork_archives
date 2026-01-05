// ==UserScript==
// @name        SGW Item Modification Helper - DEPRECATED
// @namespace   greasyfork.org
// @version     1.3.1
// @grant       none
// @require     https://greasyfork.org/scripts/10208-gm-api-script/code/GM%20API%20script.js?version=54964
// @include     https://sellers.shopgoodwill.com/sellers/modifyItem.asp*
// @description Improves the modification page
// @downloadURL https://update.greasyfork.org/scripts/19933/SGW%20Item%20Modification%20Helper%20-%20DEPRECATED.user.js
// @updateURL https://update.greasyfork.org/scripts/19933/SGW%20Item%20Modification%20Helper%20-%20DEPRECATED.meta.js
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
/*
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
    });*//*
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
      }*//*
      myTable += "]]<br>";
      $('body').first().append(myTable);
      myNote = $('#itemSellerInfo').val();
//      $('#itemSellerInfo').val(myNote + myTable)
    } else {
      console.dir(changedValues);
    }
    $('#FORM1').submit();
  });*/
}


$('#itemTitle').parent().parent().parent().hide();
$('#itemTitle').parent().parent().parent().before("<tr><td valign='top' width='10' bgcolor='#2045A3'><img src='../images/spacer.gif' height=' 0' width='10'></td><td id='contentTD'></td></tr>");

$('#contentTD').append("<p id='itemTitleContainer'><b>Item Title:</b> </p>");
$('#itemTitleContainer').append($('#itemTitle'));

$('#contentTD').append("<p id='itemCategoryContainer'><b>Category:</b> </p>");
$('#itemCategoryContainer').append($('#s1'));

$('#contentTD').append("<p id='itemDescriptionContainer'><b>Description:</b> </p>");
$('#itemDescriptionContainer').append($('#colourPalette').parent());

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
$('#itemNoCombineShippingContainer').append(" Select this option if the buyer of this item should not be allowed to combine this item with shipment of other items.");
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

$('#itemShipMethod option[value="3"]').text('Post Office');


$('#itemTitleContainer').after('<div id="counterContainer"><font face="Arial" size="4">You have <b><span id="myCounter"></span></b> characters remaining.</font></div>');
$("#myCounter").html(50-$('#itemTitle').val().length);
$('#itemTitle').bind('keyup', function(){
  $("#myCounter").html(50-$('#itemTitle').val().length);
});

// --------- Shipping calculator --------------------------------------------

if ($('#shipCalcContainer').length > 0) {
  // Doesn't do these things if the user doesn't have the new shipping calculator script installed.

//  $("#itemSellerInfo").after("<b>Note to shipping:</b><br><textarea id='noteToShipping' rows='2' cols='40'></textarea><br>");
//  $('#itemSellerInfo').hide();
  
  $("b:contains('Shipping Charge')").before($('.shippingOptions').first());
  $('.shippingOptions').eq(1).remove();
  // I have NO IDEA why the shippingOptions div gets duplicated, rather than just moved!
  
  $('#itemDescriptionContainer').after($('#shipCalcContainer').css({'margin-top' : '15px', 'margin-bottom' : '20px'}));

  var sgwTimeouts = window.setTimeout(function(){
      

  //    $('#myCounter').bind('change', function(){
  //        var len49 = Math.ceil($('#myCounter').html());
  //        $('#myCounter2').html(len49 + 1);
  //    })

      function dummyWeight() {
          if ($('#itemWeight').val().length < 1) {
             $('#itemWeight').val(1);
          }
          if ($('#itemDisplayWeight').val().length < 1) {
              $('#itemDisplayWeight').val(1);
          }
      }
// disabling this due to conflicts
/*      
      $('#submit1').bind('click', function(e){
          e.preventDefault();
          var submitForm = true;
          while ($('#itemTitle').val().length < 1) {
              $('#itemTitle').val(prompt('Item title?'));
          }
          if ($('#itemWeight').val().length < 1) {
              if ($('#currentShipCalcType').val() == 'USPS') {
                  while ($('#itemWeight').val().length < 1) {
                      var weight = prompt("Item's weight?");
                      $('#itemWeight').val(weight);
                      $('#itemDisplayWeight').val(weight);
                  }
              } else if ($('#currentShipCalcType').val() == 'pickup') {
                  $('#itemWeight').val(150);
              } else {
                  alert('Please enter shipping information!');
                  $('.calcInput:empty').first().focus();
                  submitForm = false;
              }
          }
          while ($('#itemDisplayWeight').val().length < 1) {
              $('#itemDisplayWeight').val(prompt('Item\'s actual weight?'));
          }
          if ($('#itemDescription').val().length < 1) {
  //            alert('Please enter a description!');
  //            submitForm = false;
  // Doesn't work. Huh.
          }
          if (submitForm === true) {
              if ($('#itemsellerstore').val() == '999') {
                  $('#itemsellerstore').val('999 - Mixed Locations');
              }
              var shipString = '<<';
              if ($('#Clothing').css('background-color') == 'rgb(170, 170, 170)') {
                  shipString += 'clth:'+$('#actualWeight').val()+'#';
                  if ($('#itemShipMethod').val() == 2) {
                      shipString += '/' + $('#dim1').val() + 'x' + $('#dim2').val() + 'x' + $('#dim3').val();
                  }
              } else if ($('#Media').css('background-color') == 'rgb(170, 170, 170)') {
                  shipString += 'mdia+'+$('#actualWeight').val()+'#';
              } else {
                  if ($('#currentShipCalcType').val() == 'general') {
                      shipString += 'gen:';
                  } else if ($('#currentShipCalcType').val() == 'guitar') {
                      shipString += 'guit:';
                  } else if ($('#currentShipCalcType').val() == 'art') {
                      shipString += 'art:';
                  } else if ($('#currentShipCalcType').val() == 'long') {
                      shipString += 'long:';
                  }
                  if ($('#dim1').val().length > 0 && $('#dim2').val().length > 0 && $('#dim3').val().length > 0) {
                    shipString += $('#actualWeight').val() + '#/' + $('#dim1').val() + 'x' + $('#dim2').val() + 'x' + $('#dim3').val();
                  }
              }
              shipString += '>>';
              console.log(shipString);
              $('#itemSellerInfo').val($('#itemSellerInfo').val()+shipString);
              if ($('#noteToShipping').val().length > 0) {
                  $('#itemSellerInfo').val($('#itemSellerInfo').val()+'<br><br><b>Note from ' + $('#posterName').html() + ': </b>' + $('#noteToShipping').val());
              }
              $('#form1').submit();
          }
      });
*/
      function validateCombineCat(cat) {
          noCombine = ['Sculpture', 'Figurine', 'Cookie Jar', 'Music Box', 'Glass', 'Grabbag', 'Barware', 'China', 'Cookware', 'Serving Piece', 'Wedding Dress', 'Gown',];
          combine = true;
  //        $.each()
  // I don't think I want it to automatically do this.
      }

      $('.upsButton').bind('click', function(){
          useSuggestion('UPS');
      });
      $('.uspsButton').bind('click', function(){
          useSuggestion('USPS');
      });
      $('.pickupOnlyButton').bind('click', function(){
          useSuggestion('pickup');
      });

      function buttonClickAnimate(button) {
          button.css('background-color', '#AAA').animate({
              'background-color' : '#EEE',
          }, 500);
      }

      function weightPrompt() {
          var displayWeight = Math.ceil($('#addPounds').html());
          while ($('#actualWeight').val().length < 1) {
             var actualWeight = prompt('Item\'s actual weight?');
             actualWeight = actualWeight.replace(/[^\d.-]/g,'');
             $('#actualWeight').val(actualWeight);
            displayWeight += Math.ceil(actualWeight);
             $('#calc-'+$('#currentShipCalcType').val()).trigger("click");
          }

          $('#itemDisplayWeight').val(displayWeight);
      }

      $('#calc-media').bind('click', function(){
          buttonClickAnimate($(this));
          $('#Media') .trigger('click');
      });

      $('#calc-clothing').bind('click', function(){
          buttonClickAnimate($(this));
          weightPrompt();
          var weight = parseFloat($('#actualWeight').val());
          $('#itemDisplayWeight').val(weight);
          calculateUSPS(weight);
      });

      function calculateUSPS(weight) {
          if (weight >= 3) {
              $('#UPS').trigger('click');
          } else {
              if (weight < .56) {
                  charge = 2.99;
              } else if (weight < 1) {
                  charge = 3.99;
              } else if (weight < 2) {
                  charge = 6.99;
              } else {
                  charge = 8.99;
              }
              $('#itemShippingPrice').val(charge);
              shippingMethod('USPS');
          }
      }

      $('.shipCharge').bind('click', function(){
          $('.shipType').css('background-color', '#EEE');
          $(this).css('background-color', '#AAA');
          var thisBox = $(this).text();
          var boxData = $('#boxDefinitions').data()[thisBox];
          weightPrompt();
          if (thisBox == 'Media') {
              doMedia($('#actualWeight').val());

          } else if (thisBox == 'Clothing' || thisBox == 'Small&light') {
              $('#calc-clothing').trigger('click');
          } else if (boxData['method'] == 'USPS') {
              $('#itemDisplayWeight').val($('#actualWeight').val());
              $('#itemWeight').val($('#actualWeight').val());
              $('#itemShippingPrice').val(boxData['price']);
              $('#shipTypeNote') == thisBox;
          } else if (boxData['method'] == 'UPS') {
              $('#itemDisplayWeight').val($('#actualWeight').val());
              realWeight = Math.ceil($('#actualWeight').val())+Math.ceil($('#addInches').html());
              if (realWeight > boxData['weight']) {
                  $('#itemWeight').val(realWeight);
              } else {
                 $('#itemWeight').val(boxData['weight']);
              }
              $('#shipTypeNote') == boxData['note'];
          }
          if (boxData['method'].length > 0) {
  //            console.log('.shipCharge():'+boxData['method']);
              shippingMethod(boxData['method']);
          }
      });

      function useSuggestion(type)   {
          buttonClickAnimate($('.'+type+'Button:visible'));
          if (type == 'pickupOnly') {
              type = 'pickup';
          }
  //        console.log('useSuggestion():'+type);
          shippingMethod(type);
          weightPrompt();
          $('#itemDisplayWeight').val($('#actualWeight').val());
          if (type == 'UPS') {
              $('#itemWeight').val($('#shipCalcShippingWeight').html());
          } else if (type == 'USPS') {
              $('#itemWeight').val($('#actualWeight').val());
              $('#itemShippingPrice').val($('#uspsSuggPrice').html());
          } else if (type == 'pickup') {
              $('#itemWeight').val(150);
          }
      }

      $('#UPS').bind('click', function(){
         weightPrompt();
         dimList = [$('#dim1').val(), $('#dim2').val(), $('#dim3').val()];
         $.each(dimList, function(index, dim){
             index+=1;
             while (dim.length < 1) {
                 dim = prompt('Dimension ' + index);
                 $('#dim'+index).val(dim);
             }
         });
         $('#calc-'+$('#currentShipCalcType').val()).trigger('click'); 
         if($('.upsButton:visible').length > 0) {
            useSuggestion('UPS');
         } else {
            useSuggestion('pickup');
         }
      });

      $('#pickupOnly').bind('click', function(){
         weightPrompt();
         shippingMethod('pickup');
      });

      function shippingMethod(method)  {
   //       console.log('shippingMethod() '+method);
          $('#UPS, #pickup').css('background-color', '#EEE');
          $('#itemShipMethod > option').removeAttr('selected');
          if (method == 'UPS') {
             $('#itemShipMethod').val(2);
             $('#itemAutoInsurance').removeProp('checked');
             $('#itemShippingPrice').val(0);
             $('#UPS').css('background-color', '#AAA');
          } else if (method =='pickup') {
  //            console.log('a');
             $('#itemShipMethod').val(0);
             $('#itemAutoInsurance').removeProp('checked');
             $('#itemShippingPrice').val(0);
             $('#itemWeight').val(150);
             $('#pickupOnly').css('background-color', '#AAA');
          } else if (method == 'USPS') {
  //            console.log('???');
             $('#itemShipMethod').val(3);
             $('#itemAutoInsurance').prop('checked', true);
             $('#itemWeight').val(Math.ceil($('#actualWeight').val()) + Math.ceil($('#addPounds').html()));
          }
      }

      function getCharge(myWeight) {
          console.log('getCharge:'+myWeight);
          if (myWeight <= 3) {
              return '3.99';
          } else if (myWeight <= 6) {
              return '5.99';
          } else if (myWeight <= 10) {
              return '7.99';
          } else if (myWeight <= 13) {
              return '8.99';
          } else if (myWeight <= 15) {
              return '9.99';
          } else if (myWeight <= 19) {
              return '11.99';
          } else if (myWeight <= 25) {
              return '15.99';
          } else if (myWeight <= 27) {
              return '16.99';
          } else if (myWeight <= 29) {
              return '17.99';
          } else if (myWeight <= 31) {
              return '18.99';
          } else if (myWeight <= 33) {
              return '19.99';
          } else if (myWeight <= 35) {
              return '20.99';
          } else if (myWeight <= 37) {
              return '21.99';
          } else if (myWeight <= 39) {
              return '22.99';
          } else if (myWeight <= 41) {
              return '23.99';
          } else if (myWeight <= 43) {
              return '24.99';
          } else if (myWeight <= 45) {
              return '25.99';
          } else if (myWeight <= 47) {
              return '26.99';
          } else if (myWeight <= 49) {
              return '27.99';
          } else if (myWeight <= 51) {
              return '28.99';
          } else if (myWeight <= 53) {
              return '29.99';
          } else if (myWeight <= 55) {
              return '30.99';
          } else if (myWeight <= 57) {
              return '31.99';
          } else if (myWeight <= 59) {
              return '32.99';
          } else if (myWeight <= 61) {
              return '33.99';
          } else if (myWeight <= 63) {
              return '34.99';
          } else if (myWeight <= 65) {
              return '35.99';
          } else if (myWeight <= 67) {
              return '36.99';
          } else if (myWeight <= 68) {
              return '37.99';
          } else if (myWeight <= 69) {
              return '38.99';
          } else if (myWeight <= 70) {
              return '39.99';
          }
    }
      function doMedia(weight) {    
          console.log('media:'+weight);
          var myCharge;
          if (weight < 50) {
              myCharge = getCharge(weight);
          } else if (weight < 70) {
              myCharge = 2 * getCharge(weight/2);
          } else {
              if (weight <= 140) {
                  weight /= 2;
                  myCharge = 2.25 * getCharge(weight);
              } else if (weight <= 210) {
                  weight /= 3;
                  myCharge = 3.5 * getCharge(weight);
              }
              myCharge = (Math.ceil(myCharge) - .01)
          }

          $('#itemDisplayWeight').val(weight);
          $('#itemWeight').val(weight);
          $('#itemShippingPrice').val(myCharge);
          $('#shipTypeNote').val('Media');
          shippingMethod('USPS');
      }
  }, 1100);

}

$('.fakeButton').css({
  'border' : '1px solid #CCC',
  'background-color' : '#EEE',
  'padding' : '3px',
  'margin' : '3px',
});

// don't forget checkboxes! also #table does not have a val()...

// can I touch $('body.WebWizRTEtextarea')???