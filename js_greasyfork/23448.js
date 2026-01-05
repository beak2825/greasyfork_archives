// ==UserScript==
// @name        SGW Item Modification Helper
// @namespace   greasyfork.org
// @version     1.4.0.9
// @grant       none
// @include     https://sellers.shopgoodwill.com/sellers/modifyItem.asp*

// @require     https://greasyfork.org/scripts/37273-underdollar-jquery-replacement/code/Underdollar%20jQuery%20replacement.js?upDate=2018_01_11sq2
// @description Improves the modification page
// @downloadURL https://update.greasyfork.org/scripts/23448/SGW%20Item%20Modification%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/23448/SGW%20Item%20Modification%20Helper.meta.js
// ==/UserScript==


console.log('squirrel?')

// @require     https://greasyfork.org/scripts/23449-gm-api-script/code/GM%20API%20script.js?upDate=2016_09_23

//NodeList.prototype.forEach = Array.prototype.forEach;

//Array.prototype.forEach.call(document.querySelectorAll('*[name]'), function(el) {
document.querySelectorAll('*[name]').forEach(function(el) {
	if (typeof el.id == 'undefined' || el.id.length < 1) {
		el.id = el.getAttribute('name');
	}
});




_$('#itemTitle').parent().parent().parent().hide();
_$('#itemTitle').parent().parent().parent().before("<tr><td valign='top' width='10' bgcolor='#2045A3'><img src='../images/spacer.gif' height=' 0' width='10'></td><td id='contentTD'></td></tr>");

_$('#contentTD').append("<p id='itemTitleContainer'><b>Item Title:</b> </p>");
_$('#itemTitleContainer').append(_$('#itemTitle'));

_$('#contentTD').append("<p id='itemCategoryContainer'><b>Category:</b> </p>");
_$('#itemCategoryContainer').append(_$('#s1'));

_$('#contentTD').append("<p id='itemDescriptionContainer'><b>Description:</b> </p>");
_$('#itemDescriptionContainer').append(_$('#colourPalette').parent());

_$('#contentTD').append("<div id='itemShippingDetailsContainer'></div>");
_$('#itemShippingDetailsContainer').append("<p id='itemShippingWeightContainer'><b>Shipping Weight:</b> </p>");
_$('#itemShippingWeightContainer').append(_$('#itemWeight'));
_$('#itemShippingDetailsContainer').append("<p id='itemDisplayWeightContainer'><b>Display (Actual) Weight:</b> </p>");
_$('#itemDisplayWeightContainer').append(_$('#itemDisplayWeight'));
_$('#itemShippingDetailsContainer').append("<p id='itemShippingPriceContainer'><b>Shipping Charge:</b><br></p>");
_$('#itemShippingPriceContainer').append(_$('#itemShippingPrice'));
_$('#itemShippingDetailsContainer').append("<p id='itemShipMethodContainer'><b>Shipping Method:</b> <br></p>");
_$('#itemShipMethodContainer').append(_$('#itemShipMethod'));
_$('#itemShippingDetailsContainer').append("<p id='itemNoCombineShippingContainer'><b>Item Shipment Combining:</b><br></p>");
_$('#itemNoCombineShippingContainer').append(_$('#itemNoCombineShipping'));
_$('#itemNoCombineShippingContainer').append(" Select this option if the buyer of this item should not be allowed to combine this item with shipment of other items.");
_$('#itemShippingDetailsContainer').append("<p id='itemAutoInsuranceContainer'><b>Auto Include Insurance (USPS Only):</b></p>");
_$('#itemAutoInsuranceContainer').append(_$('#itemAutoInsurance'));

_$('#contentTD').append("<p id='itemsellerstoreContainer'><b>Seller Store:</b> </p>");
_$('#itemsellerstoreContainer').append(_$('#itemsellerstore'));

//_$('#itemSellerInventoryLocationID').parent().attr('id', 'itemSellerInventoryLocationIDContainer').appendTo(_$('#contentTD')); // no appendTo, appendTo is stupid
_$('#contentTD').append(_$('#itemSellerInventoryLocationID').parent().attr('id', 'itemSellerInventoryLocationIDContainer'));

_$('#contentTD').append("<p id='itemSellerInfoContainer'><b>Seller Private Description:</b><br></p>");
_$('#itemSellerInfoContainer').append(_$('#itemSellerInfo'));

_$('#contentTD').append("<p style='position:relative; left: 10px; padding-bottom:4px;'><span class='fakeButton' onclick='_$(\"#hiddenJunk\").toggle();'>Show/hide hidden fields/etc.</span></p>");


_$('#contentTD').parent().after("<tr style='display:none;' id='hiddenJunk'><td valign='top' width='10' bgcolor='#2045A3'><img src='../images/spacer.gif' height=' 0' width='10'></td><td id='hiddenJunkTD'></td></tr>");

_$('#hiddenJunkTD').append("<p id='itemQuantityContainer'><b>Item Quantity: </b></p>");
_$('#itemQuantityContainer').append(_$('#itemQuantity').parent());

_$('#hiddenJunkTD').append("<p id='itemMinimumBidContainer'><b>Minimum Bid: </b></p>");
_$('#itemMinimumBidContainer').append(_$('#itemMinimumBid').parent());

_$('#hiddenJunkTD').append("<p id='itemBidIncrementContainer'><b>Bid Increment: </b></p>");
_$('#itemBidIncrementContainer').append(_$('#itemBidIncrement').parent());

_$('#hiddenJunkTD').append("<p id='itemReserveContainer'><b>Reserve Price: </b></p>");
_$('#itemReserveContainer').append(_$('#itemReserve').parent());
_$('#itemReserve').parent().children().first().remove();

_$('#hiddenJunkTD').append("<p id='itemBuyNowPriceContainer'><b>Buy Now Price: </b></p>");
_$('#itemBuyNowPriceContainer').append(_$('#itemBuyNowPrice').parent());
_$('#itemBuyNowPrice').parent().children().first().remove();

_$('#hiddenJunkTD').append("<p id='itemActualDimensionsContainer'></p>");
_$('#itemActualDimensionsContainer').append(_$('#itemLength').parent().parent().parent());

_$('#hiddenJunkTD').append("<p id='itemShippingDimensionsContainer'></p>");
_$('#itemShippingDimensionsContainer').append('<font face="Arial" size="2"><strong>Shipping Dimension - Length x Width x Height in inches (optional)</font><font face="arial" color="#a3223a" size="4"></font>:</strong>');
_$('#itemShippingDimensionsContainer').append(_$('#itemShipLength'));
_$('#itemShippingDimensionsContainer').append(" <font face='Arial' size='2'>(Numbers and decimal point '.' only) Used for shipping optimization and prevention of oversized charges.</font>");

_$('#hiddenJunkTD').append("<p id='itemShippingContainer'><b>Shipping: </b><p>");
_$('#itemShippingContainer').append(_$('#itemShipping'));
_$('#itemShippingContainer').append(_$('select[name="itemShipping"]'));

_$('#hiddenJunkTD').append("<p id='itemHandlingPriceContainer'><b>Handling Charge: </b></p>");

_$('#itemHandlingPriceContainer').append(_$('#itemHandlingPrice').parent());
_$('#itemHandlingPrice').parent().children().first().remove();

_$('#hiddenJunk').after("<tr><td valign='top' width='10' bgcolor='#2045A3' height='10px'><img src='../images/spacer.gif' height=' 0' width='10'></td><td id='hiddenJunkTD'></td></tr>");

_$('#itemShipMethod option[value="3"]').text('Post Office');


_$('#itemTitleContainer').after('<div id="counterContainer"><font face="Arial" size="4">You have <b><span id="myCounter"></span></b> characters remaining.</font></div>');
_$("#myCounter").html(50-_$('#itemTitle').val().length);
_$('#itemTitle').bind('keyup', function(){
  _$("#myCounter").html(50-_$('#itemTitle').val().length);
});

// --------- Shipping calculator --------------------------------------------

if (_$('#gesMN_shippingCalculatorContainer').length > 0) {
  _$("#itemDescriptionContainer").append(_$('#gesMN_shippingCalculatorContainer'));
  var sgwTimeouts = window.setTimeout(function(){


      function combineCheck(){
          var noCombine = false;
          var myWeight = _$('#itemWeight').val();
          if (myWeight >= 20) {
              console.log('badWeight: >= 20');
              noCombine = true;
          } else if (_$('#combineCheck').html() != 'true') {
              var myCat = _$('#s1').val();
              var badCats = ['Paintings', 'Prints', 'Strings', 'Brass', 'Formalwear', 'Outerwear', 'Wedding > Dresses', 'Lamps', 'Dinnerware', 'Sewing Machines', 'Typewriters', 'Receivers', 'Turntables', 'Dinnerware', 'Trains'];
              _$.each(badCats, function(index, category){//__$.each == __$().each
                  if (myCat.indexOf(category) >= 0)  {
                      noCombine = true;
                      console.log('badCat: ' + category);
                  }
              });
              if (noCombine == false) {
                  var myDescription = '';
                  if (typeof _$('#WebWizRTE').contents()[0]['body']['innerText'] != 'undefined') { // this may not work
                      var myDesc = _$('#WebWizRTE').contents()[0]['body']['innerText'].replace(/(?:\r\n|\r|\n)/g, '').toLowerCase();
                  }
                  var myTitle = _$('#itemTitle').val().toLowerCase();
                  var badWords = ['Framed', 'Saxophone', 'Guitar', 'Keyboard', 'Trombone', 'Telescope', 'Saxophone', 'Lamp', 'Snowboard', 'Skateboard', 'Glass', 'Crystal', 'Cast iron', 'Tool', 'Drum', 'Sewing machine', 'Typewriter', 'Printer', 'Desktop', 'Receiver', 'Turntable', 'Monitor'];
                  //                console.log(myDescription);
                  //                console.log(myTitle);
                  _$.each(badWords, function(index, word){
                      word = word.toLowerCase();
                      if (myDescription.indexOf(word) >= 0 || myTitle.indexOf(word) >= 0)  {
                          noCombine = true;
                          console.log('badWord: '+word);
                      } else {
                      }
                  });
                  if (noCombine == false && (myCat.indexOf('Speaker') >= 0 || myTitle.indexOf('speaker') >= 0 || myDescription.indexOf('speaker') >= 0) && myWeight > 5) {
                      noCombine = true;
                      console.log('badWeight (speaker)');
                  }
              }
          }
          if (noCombine == true) {
              console.log('no combine');
              _$('#itemNoCombineShipping').attr('checked', true);
          } else {
              console.log('combine');
              _$('#itemNoCombineShipping').attr('checked', false);
          }
      }

      function dummyWeight() {
          if (_$('#itemWeight').val().length < 1) {
              _$('#itemWeight').val(1);
          }
          if (_$('#itemDisplayWeight').val().length < 1) {
              _$('#itemDisplayWeight').val(1);
          }
      }

      function setCombinable(bool) {
          // true == CAN be combined; false == CANNOT
          _$('#combineCheck').html(bool);
          if (bool === true || bool == 'true') {
              _$('itemNoCombineShipping').attr('checked', false);
          } else {
              _$('itemNoCombineShipping').attr('checked', true);
          }
      }
      function getElement(queryString) {
          if (queryString.indexOf('#') == 0) {
              return document.getElementById(queryString.replace('#',''));
          } else {
              return document.querySelectorAll(queryString)[0];
          }
      }
      function getElements(queryString) {
          return document.querySelectorAll(queryString);
      }
      function hide(el){
          el.style.display = 'none';
          el.classList += 'gesHidden';
          return false;
      }
      function show(el){
          el.style.display = '';
          return false;
      }
      function addCSS(element, styleText) {
          element.style.cssText +=';'+ styleText;
          return false;
      }


      _$('#gesMN_useThisButton').bind('click', function(){
          var method;
          var actualWeight = _$('#gesMN_actualWeight').val();
          var shippingWeight = 0;
          var shippingCharge = 0;
          console.log(actualWeight);
          if (_$('#gesMN_shippingWeight').filter(function(el){
              return _$(el).isVisible();
          }).length > 0) {
              shippingWeight = _$('#gesMN_shippingWeight').html();
              _$('#itemShipMethod').val(2);
              _$('#itemAutoInsurance').attr('checked', false);
              console.log(shippingWeight);
          } else if (_$('#gesMN_shippingCharge').filter(function(el){
              return _$(el).isVisible();
          }).length > 0) {
              shippingWeight = actualWeight;
              _$('#itemShipMethod').val(3);
              _$('#itemAutoInsurance').attr('checked', true);
              shippingCharge = _$('#gesMN_shippingCharge').html();
          } else {
              shippingWeight = actualWeight;
              _$('#itemShipMethod').val(0);
              _$('#itemAutoInsurance').attr('checked', false);
          }
          _$('#itemWeight').val(shippingWeight);
          _$('#itemDisplayWeight').val(actualWeight);
          _$('#itemShippingPrice').val(shippingCharge);
      });

  }, 1100);

}

_$('.fakeButton').css({
  'border' : '1px solid #CCC',
  'background-color' : '#EEE',
  'padding' : '3px',
  'margin' : '3px',
});


// can I touch _$('body.WebWizRTEtextarea')???