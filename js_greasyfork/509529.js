// ==UserScript==
// @name         Autodarts - AutoCalibration
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  auto-calibration while lobby is opened
// @match        https://play.autodarts.io/*
// @include      http://*:3180/monitor?autocalibration*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autodarts.io
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-end
// @grant        GM_openInTab
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/509529/Autodarts%20-%20AutoCalibration.user.js
// @updateURL https://update.greasyfork.org/scripts/509529/Autodarts%20-%20AutoCalibration.meta.js
// ==/UserScript==

(function() {
    'use strict';

        function calibrate(ip, boardID){
        $.ajax({
            url: 'http://'+ip+'/api/config/calibration/auto?distortion=true',
            type: 'POST',
            asynch: false,
            contentType: "application/json",
            success: function(){
                console.log('Board has been calibrated!');
                $('.css-1wq9qmd').eq(0).find(":selected").append(' (calibrated)')
                window.close();
            }  ,
            error : function(){
                //alert('Tampermonkey: Error auto-calibration! Please allow mixed content in your browser for autodarts-URL!')
            }
        });
    }

    function startBoard(ip, boardID) {
        $.ajax({
            type: 'PUT',
            url: 'http://'+ip+'/api/start',
        }).done(function () {
            console.log('Start board: SUCCESS '+boardID);
            calibrate(ip, boardID);

        }).fail(function (msg) {
            console.log('Start: FAIL '+boardID);
        }).always(function (msg) {
            //console.log('Start: in progress');
        });


    }



    $(document).on('click','button:contains("Open Lobby")', function(){
        setTimeout(function() {
            const boardID = $('.css-1wq9qmd').eq(0).find(":selected").val() ;
            console.log( 'Selected  boardID: '+ boardID);
            console.log('calibration starting...');
            $.ajax({
                url: 'https://api.autodarts.io/bs/v0/boards',
                type: 'GET',
                asynch: false,
                xhrFields: {
                    withCredentials: true
                },
                success: function(response){
                    console.log(response);
                    for (let i = 0; i < response.length; i++)
                        if( response[i]['state']['connected'] == true && response[i]['id'] == boardID) {
                            console.log('Board '+response[i]['name'] + ' still in calibration...');
                           console.log('State '+response[i]['state']['event'] + ' ');
                          var event =  response[i]['state']['event'];
                            GM_openInTab("http://"+response[i]['ip']+'/monitor?autocalibration=1&boardID='+boardID+'&event='+event , true);
                        }
                        else {console.log('Board nicht connected oder falsche id: '+   response[i]['id'])}
                }

            });

        }, 3000);
    });

////////////////////

    var urlparm = (new URL(location.href)).searchParams.get('autocalibration');
    if(urlparm) {

        var boardID = (new URL(location.href)).searchParams.get('boardID');
        var event = (new URL(location.href)).searchParams.get('event');
        document.title = 'Please wait: Calibration in progress...';

        if (event !== 'Started') {
            document.title = 'starting board...';
            startBoard(location.hostname+':3180', boardID);

            setTimeout(function() {
                document.title = 'starting calibration...';
                console.log('starting calibration...');
                calibrate(location.hostname+':3180', boardID);
            }, 3000);
        }
        else {
            document.title = 'starting calibration...';
            console.log('starting calibration...');
            calibrate(location.hostname+':3180', boardID);
        }

    }

})();