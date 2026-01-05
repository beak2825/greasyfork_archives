// ==UserScript==
// @name         Aliexpress Tracking QR/Barcode
// @namespace    http://tampermonkey.net/
// @description  Add a QR/barcode to tracking number inside order details page and create link's to 17track.net
// @author       Tiago Conceição
// @copyright    2016-2020, Tiago Conceição
// @license      https://raw.githubusercontent.com/sn4k3/Aliexpress-Tracking-QRBarcode/master/LICENSE
// @icon         https://raw.githubusercontent.com/sn4k3/Aliexpress-Tracking-QRBarcode/master/app-icon.png
// @homepage     https://github.com/sn4k3/Aliexpress-Tracking-QRBarcode
// @supportURL   https://github.com/sn4k3/Aliexpress-Tracking-QRBarcode/issues
// @include      http*://*trade.aliexpress.com/order_detail.htm*
// @include      http*://*track.aliexpress.com/logisticsdetail.htm*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lrsjng.jquery-qrcode/0.17.0/jquery-qrcode.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.0/barcodes/JsBarcode.code128.min.js
// @version 1.0.1
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/19878/Aliexpress%20Tracking%20QRBarcode.user.js
// @updateURL https://update.greasyfork.org/scripts/19878/Aliexpress%20Tracking%20QRBarcode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var defaultUrlTracking = 'https://t.17track.net/en#nums=';
    var urlTracking = defaultUrlTracking;
    var i = 0;
    var trackingNumbers = [];

    function addStyleString(str) {
        var node = document.createElement('style');
        node.innerHTML = str;
        document.body.appendChild(node);
    }

    addStyleString('.btn {\n' +
                   'display: inline-block;\n' +
                   'padding: 6px 15px;\n' +
                   'margin-bottom: 0;\n' +
                   'font-size: 14px;\n' +
                   'font-weight: 400;\n' +
                   'line-height: 1.57142857;\n' +
                   'text-align: center;\n' +
                   'white-space: nowrap;\n' +
                   'vertical-align: middle;\n' +
                   '-ms-touch-action: manipulation;\n' +
                   'touch-action: manipulation;\n' +
                   'cursor: pointer;\n' +
                   '-webkit-user-select: none;\n' +
                   '-moz-user-select: none;\n' +
                   '-ms-user-select: none;\n' +
                   'user-select: none;\n' +
                   'background-image: none;\n' +
                   'border: 1px solid transparent;\n' +
                   'border-radius: 3px;\n' +
                   '}' +
                   '' +
                   '.btn-warning {\n' +
                   '    color: #fff !important;\n' +
                   '    background-color: #ff8c00;\n' +
                   '    border-color: #ff8c00;\n' +
                   '}' +
                   '' +
                   '.btn-warning.focus, .btn-warning:focus, .btn-warning:hover {\n' +
                   '    background-color: #ff9916;\n' +
                   '    border-color: #ff9916;\n' +
                   '}' +
                   '' +
                   '.btn.focus, .btn:focus, .btn:hover {\n' +
                   '    color: #757575;\n' +
                   '    text-decoration: none;\n' +
                   '}' +
                   '' +
                   '.btn-block {\n' +
                   '    display: block;\n' +
                   '    width: 100%;\n' +
                   '}' +
                   '' +
                   '.hide{ display:none; }');

    function trackingNumberToURL(trackingNumber)
    {
        if(trackingNumber.startsWith('LP')) // Aliexpress Logistics
            return 'http://global.cainiao.com/detail.htm?mailNoList=';
        return defaultUrlTracking;
    }

    // trade.aliexpress.com/order_detail.htm
    $('.shipping-bd .no').each(function() {
        var trackingNumber = $(this).text().trim();
        if(trackingNumber)
        {
            i++;
            trackingNumbers.push(trackingNumber);
            //$(this).html('<svg id="trackingBarcode'+i+'" class="trackingBarcode" jsbarcode-format="CODE128A" jsbarcode-value="'+trackingNumber+'" jsbarcode-textmargin="0" jsbarcode-fontoptions="bold" jsbarcode-width="1"></svg>');
            urlTracking = trackingNumberToURL(trackingNumber);
            $(this).html(trackingNumber+'<a href="'+urlTracking+trackingNumber+'" target="_blank"><div id="trackingQRCode'+i+'" class="trackingQRCode"></div></a>');
            $(this).prev().append('<div style="margin: 10px 10px 0 0;"><a id="tracking_no'+i+'" data-tracking="'+trackingNumber+'" class="tracking_no tracking_no_inline btn btn-warning btn-block hide" href="javascript:;">Inline Track</a></div>');

            $("#trackingQRCode"+i).qrcode({
                "size": 100/*parseInt($(this).css('width'))*/,
                "color": "#3a3",
                //'label': trackingNumber,
                "text": trackingNumber
            });

            if(i == 1)
            {
                var tableID = $(this).parent().attr('id');
                $('<div align="center"><a href="'+urlTracking+trackingNumber+'" target="_blank"><svg id="trackingBarcode'+i+'" class="trackingBarcode" jsbarcode-format="CODE128A" jsbarcode-value="'+trackingNumber+'" jsbarcode-textmargin="0" jsbarcode-fontoptions="bold" jsbarcode-width="2"></svg></a></div>').insertAfter( "#"+tableID+" .list-box");
            }
        }
        //console.log(trackingNumber);
    });

    // track.aliexpress.com/logisticsdetail.htm
    var trackingNumber = $('.ship-info .order-item .info:first').text();
    if(trackingNumber)
    {
        i++;
        trackingNumbers.push(trackingNumber);
        urlTracking = trackingNumberToURL(trackingNumber);
        $('<div align="center"><a href="'+urlTracking+trackingNumber+'" target="_blank"><svg id="trackingBarcode'+i+'" class="trackingBarcode" jsbarcode-format="CODE128A" jsbarcode-value="'+trackingNumber+'" jsbarcode-textmargin="0" jsbarcode-fontoptions="bold" jsbarcode-width="2"></svg></a></div>').insertBefore( ".ship-info:first");
        $('.pkg-content, .pkg-no-content').parent().append('<div style="margin: 10px 0 0 0;"><a id="tracking_no'+i+'" data-tracking="'+trackingNumber+'" class="tracking_no tracking_no_inline btn btn-warning btn-block hide" href="javascript:;">Inline Track</a></div>');
    }

    // Track All Link
    if(trackingNumbers.length > 0)
    {
        urlTracking = trackingNumberToURL(trackingNumbers[0]);
        var element = $('#shipping-section .ui-box-title');
        element.append('<a href="'+urlTracking+trackingNumbers.join(',')+'" target="_blank" style="margin-left:30px">(Track All)</a>');

		// Inline Track
        $.getScript( '//www.17track.net/externalcall.js' ).then( function() {
            if(typeof YQV5 === "object" && typeof YQV5.trackSingleF1 === 'function') {
                $('.tracking_no_inline').click(function(){
                    $('html, body').animate({
                        scrollTop: $(this).offset().top-50
                    }, 500);

                });

                $('.tracking_no_inline').each(function(){
                    YQV5.trackSingleF1({
                        //Required, Specify the element ID of the floating position.
                        YQ_ElementId: this,
                        //Optional, specify the tracking result width, min width 260px, default is 470px.
                        YQ_Width: 512,
                        //Optional, specify tracking result height, max height 800px, default is 560px.
                        YQ_Height: 560,
                        //Optional, select carrier, default to auto identify.
                        YQ_Fc: "0",
                        //Optional, specify UI language, default language is automatically detected based on the browser settings.
                        //YQ_Lang:"en",
                        //Required, specify the number needed to be tracked.
                        YQ_Num: $(this).attr('data-tracking')
                    });
                    $(this).removeClass('hide');
                });

            }
        });
    }

    if($('.trackingBarcode').length){
        JsBarcode('.trackingBarcode').init();
    }
    // Finish

})();
