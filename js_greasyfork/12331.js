// ==UserScript==
// @name        MATAHARI-SHIPPING
// @namespace   intelchallenge
// @include     https://m.mataharimall.com/checkout/shipping
// @version     1
// @grant       none
// @description MATAHARI-shippingx
// @downloadURL https://update.greasyfork.org/scripts/12331/MATAHARI-SHIPPING.user.js
// @updateURL https://update.greasyfork.org/scripts/12331/MATAHARI-SHIPPING.meta.js
// ==/UserScript==



function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

function main() {
  //alert(jQ('.opt-wrapper').find('a').html());
  //jQ('.delivery-option:eq(0)').trigger('click');

  jQ("#shipping-form").addClass("dblock");
  
  var address_id = jQ('#shipping_label option:eq(1)').prop('value');
  
  
   //jQ('#shipping_label option:eq(1)').prop('selected', true);
   jQ('#shipping_label').val(address_id).change();
  
  
   var strURL = window.location.origin + '/checkout/address/1/' + address_id;
     
    // when changing is not null or empty string

        $.getJSON(strURL, function(data) {
            $('#shipping_address_id').val(data.id);
            $('#shipping_fullname').val(data.fullname);
            $('#shipping_address').val(data.address);
            $('#shipping_zipcode').val(data.zipcode);
            $('#shipping_mobile_number').val(data.mobile_number);
            // $('#shipping_province_id').val(data.province_id);
 
            // get province until district
            $.get(window.location.origin + '/user/ajax/loadhtml?type=province&selected=' + data.province_id).done(function( data ) {
                    $('#shipping_province_id').html(data)
                    $('#shipping_province_id').selectmenu('refresh');
                });
            $.get(window.location.origin + '/user/ajax/loadhtml?type=city&parent=' + data.province_id + '&selected=' + data.city_id).done(function( data ) {
                    $('#shipping_city_id').html(data);
                    $('#shipping_city_id').selectmenu('refresh');
                });
            $.get(window.location.origin + '/user/ajax/loadhtml?type=district&parent=' + data.city_id + '&selected=' + data.district_id).done(function( data ) {
                    $('#shipping_district_id').html(data)
                    $('#shipping_district_id').selectmenu('refresh');
                });
          
          $(document).ajaxStop(function() {
                   jQ('.checkout-process button').click();
    
            
            
          });
          
          
 
          
          
          
          
          
        });
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
    //alert(jQ('#shipping_label option:eq(1)').html());

  
  
  //alert(jQ('#shipping_label').val());
  
}
addJQuery(main);
