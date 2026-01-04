// ==UserScript==
// @name        Tokopedia - Bulk Print
// @namespace   BulkPrint
// @description Plugin Tokopedia (unofficial) untuk menggabungkan 2 atau lebih detail pengiriman, tujuan utamanya untuk mengurangi jumlah kertas cetak.
// @include     https://www.tokopedia.com/myshop_order_process.pl
// @exclude     
// @version     1.1
// @grant       none
// @author      dimazarno
// @downloadURL https://update.greasyfork.org/scripts/31902/Tokopedia%20-%20Bulk%20Print.user.js
// @updateURL https://update.greasyfork.org/scripts/31902/Tokopedia%20-%20Bulk%20Print.meta.js
// ==/UserScript==

$(".maincontent-admin").append("<div id='bulk-print' style='display:nsone'></div>");

$("#myshop-order-list").find(".mt-10:first").append('<button id="printClick" class="btn btn-action btn-small mr-10"><i class="icon-fax-alt"></i> Bulk Print</button>');

$('#printClick').on('click',function(){
    var myHTML = $("#bulk-print").html();
    var scriptNode = document.createElement('script'), targ = document.getElementsByTagName ('head')[0] || document.body || document.documentElement;
    scriptNode.type = "text/javascript";
    scriptNode.textContent = "(function(html){var d=window.open('about:blank', '_blank').document;d.open();d.write(html);d.close();})(" + JSON.stringify(myHTML) + ");";
    targ.appendChild(scriptNode);
});

$('.order_checkbox').on('change',function(){
   var value = $(this).attr('value');
   if ($(this).is(':checked')){          
     var $row = $("#order-"+value);
     var dest_receiver_name = $row.find(".dest_receiver_name").val();
     var dest_address = $row.find(".dest_address").val().replace(new RegExp("<br>", "g"), ', ').replace(new RegExp("Telp", "g"), '<br>Telp');
     var ship_shipping_name = $row.find(".ship_shipping_name").val();
     var shop_phone = $row.find(".shop_phone").val();
     var shop_name = $('.fs-12:first').text();
     var dropship_name = $row.find(".dropship_name").val();
     var dropship_telp = $row.find(".dropship_telp").val();               
     
     if (dropship_name!=='') {
       shop_name = dropship_name;
       shop_phone = dropship_telp;
     }
     
     html = '<div style="padding:10px;border:1px solid black;font-size: 13px;line-height:17px" class="print" id="bp-'+value+'">';     
     html += 'Dari : '+shop_name+' ('+shop_phone+')<br>';
     html += 'Kurir : '+ship_shipping_name+'<br><strong>';
     html += 'Kepada : '+dest_receiver_name+'<br>';
     html += 'Alamat : '+dest_address+'<br></strong>Item : <br>';
     $row.find('.products').each(function (index, element) {
       var product_qty = $(element).find(".product_qty").val();     
       var mod_product_qty = product_qty.split("Barang");
       var notes = $(element).find('.product_notes').val();
       html += "- "+$(element).find('.product_name').val()+" (Qty : "+mod_product_qty[0]+") - "+notes+"<br>";
     });
          
     html += '</div>';          
     
     $("#bulk-print").append( html );           
   }  else {     
     $("#bp-"+value).remove();     
   }
});
