// ==UserScript==
// @name         AliExpress Tracking Chile
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Inserta enlaces e imágenes para rastrear los pedidos directamente en AliExpress desde los detalles del pedido.
// @author       Me
// @icon         https://k61.kn3.net/E/3/0/4/C/5/45F.png
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @match        http*://*trade.aliexpress.com/order_detail.htm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26025/AliExpress%20Tracking%20Chile.user.js
// @updateURL https://update.greasyfork.org/scripts/26025/AliExpress%20Tracking%20Chile.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        var i = 0;
        var trackingNumbers = [];

        // trade.aliexpress.com/order_detail.htm
        $('.shipping-bd .no').each(function() {
            var trackingNumber = $(this).text().trim();
            if(trackingNumber)
            {
                i++;
                trackingNumbers.push(trackingNumber);
            }
            //console.log(trackingNumber);
        });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        var element = $('#shipping-section .ui-box-title');
        var banners = $('.shipping-bd .remark');
        var moover = "this.style.border = '1px solid black';";
        var moout = "this.style.border = 'none';";
        
        
        if(trackingNumbers.length == 1)
        {   $('.col-name .remark').text('Seguimiento');
            
            if(trackingNumbers[0].length > 20){
                var trackingNumberCL = trackingNumbers[0];
                trackingNumberCL = trackingNumberCL.replace('\n', '');
                var ln = trackingNumberCL.length;
            
                element.html(element.text().trim()+
                '<a href="http://www.17track.net/es/track?nums='+trackingNumberCL.substring(ln-15,ln-3)+'" target="_blank" style="margin-left:30px">(17 Track)</a>'+
                '<a href="http://www.correos.cl/SitePages/seguimiento/seguimiento.aspx?envio=ALS'+trackingNumberCL.substring(ln-11,ln-3)+
                '" target="_blank" style="margin-left:30px">(Correos Chile)</a>');
                
                banners.html('<a href="http://www.17track.net/es/track?nums='+trackingNumberCL.substring(ln-15,ln-3)+'" target="_blank">'+
                             '<img src="https://k60.kn3.net/9/D/E/2/C/8/358.png" width="200" height="60" style="margin-bottom: 30px;" onmouseover="'+moover+'" onmouseout="'+moout+'"></a>'+
                             '<a href="http://www.correos.cl/SitePages/seguimiento/seguimiento.aspx?envio=ALS'+trackingNumberCL.substring(ln-11,ln-3)+
                             '" target="_blank"><img src="https://k61.kn3.net/2/A/A/8/6/B/60E.jpg" width="200" height="60" style="margin-bottom: 30px;" onmouseover="'+moover+'" onmouseout="'+moout+'"></a>');
            }
            else if(trackingNumbers[0].substring(0,2) == 'S0' || trackingNumbers[0].substring(0,1) == '0' || trackingNumbers[0].substring(0,2) == 'LP'){
                element.html(element.text().trim()+
                '<a href="https://global.cainiao.com/detail.htm?mailNoList='+trackingNumbers[0]+'" target="_blank" style="margin-left:30px">(Cainiao - Solo China)</a>');
                
                banners.html('<a href="https://global.cainiao.com/detail.htm?mailNoList='+trackingNumbers[0]+'" target="_blank">'+
                             '<img src="https://k61.kn3.net/7/2/E/1/C/7/5D5.png" width="200" height="60" style="margin-bottom: 30px;" onmouseover="'+moover+'" onmouseout="'+moout+'"></a>');
            }
            else{
                element.html(element.text().trim()+
                '<a href="http://www.17track.net/es/track?nums='+trackingNumbers[0]+'" target="_blank" style="margin-left:30px">(17 Track)</a>'+
                '<a href="http://www.correos.cl/SitePages/seguimiento/seguimiento.aspx?envio='+trackingNumbers[0]+'" target="_blank" style="margin-left:30px">(Correos Chile)</a>');
                
                banners.html('<a href="http://www.17track.net/es/track?nums='+trackingNumbers[0]+'" target="_blank">'+
                             '<img src="https://k60.kn3.net/9/D/E/2/C/8/358.png" width="200" height="60" style="margin-bottom: 30px;" onmouseover="'+moover+'" onmouseout="'+moout+'"></a>'+
                             '<a href="http://www.correos.cl/SitePages/seguimiento/seguimiento.aspx?envio='+trackingNumbers[0]+
                             '" target="_blank"><img src="https://k61.kn3.net/2/A/A/8/6/B/60E.jpg" width="200" height="60" style="margin-bottom: 30px;" onmouseover="'+moover+'" onmouseout="'+moout+'"></a>');
            }
        }
        else if(trackingNumbers.length > 1){
           element.html(element.text().trim()+'<a href="http://www.17track.net/es/track?nums='+trackingNumbers.join(',')+'" target="_blank" style="margin-left:30px">(17 Track)</a>'+
           '<a href="https://global.cainiao.com/detail.htm?mailNoList='+trackingNumbers.join(',')+'" target="_blank" style="margin-left:30px">(Cainiao - Solo China)</a>');
            
            banners.html('<a href="http://www.17track.net/es/track?nums='+trackingNumbers.join(',')+'" target="_blank" style="margin-left:30px">'+
                         '<img src="https://k60.kn3.net/9/D/E/2/C/8/358.png" width="200" height="60" style="margin-bottom: 30px;" onmouseover="'+moover+'" onmouseout="'+moout+'"></a>'+
                         '<a href="https://global.cainiao.com/detail.htm?mailNoList='+trackingNumbers.join(',')+'" target="_blank" style="margin-left:30px">'+
                         '<img src="https://k61.kn3.net/7/2/E/1/C/7/5D5.png" width="200" height="60" style="margin-bottom: 30px;" onmouseover="'+moover+'" onmouseout="'+moout+'"></a>');
        }
        //JsBarcode(".trackingBarcode").init();
        // Your code here...
    });
})();