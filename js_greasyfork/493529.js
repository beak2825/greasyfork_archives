// ==UserScript==
// @name         bank.gov.ua BOT
// @version      1.1
// @description  Обновляем пока не увидим КУПИТЬ
// @author       Kam
// @grant        GM_setValue
// @grant        GM_getValue
// @include      https://coins.bank.gov.ua/*
// @require      https://code.jquery.com/jquery-3.1.1.slim.min.js
// @namespace https://greasyfork.org/users/237404
// @downloadURL https://update.greasyfork.org/scripts/493529/bankgovua%20BOT.user.js
// @updateURL https://update.greasyfork.org/scripts/493529/bankgovua%20BOT.meta.js
// ==/UserScript==

$(document).ready(function(){

    if( !document.location.pathname.match(/\/(.+)\/p-([0-9]+)\.html/i)[2] ){
        exit;
    }

    var urlCoin = GM_getValue("urlCoin");
    var gpAutobuy = GM_getValue("GP_Autobuy")*1 ? 1 : 0 ;

    var configHtml = '<div id="GP_config" style="width:250px;position:fixed;bottom:0;right:0;background:rgba(0,0,0,0.4);font-size:10px;text-align:center;color:#fff;">';
    configHtml += '<div><input type="text" id="urlCoin" value="'+urlCoin+'" style="width:100%;font-size:12px;text-align:center;" placeholder="Ссылка на товар"></div>';
    configHtml += '<div><input type="checkbox" id="GP_Autobuy" '+ (gpAutobuy==1 ? 'checked' : '') +' value="1" style="display:inline;"> <label for="GP_Autobuy">обновлять</label></div>';
    configHtml += '</div>';
    $('body').append(configHtml);

    $(document).on('change click keyup', '#GP_config ', function() {
        GM_setValue('urlCoin', $('#GP_config #urlCoin').val() );
        GM_setValue('GP_Autobuy', $('#GP_config #GP_Autobuy').prop('checked') ? 1 : 0 );
    });

    if( $('#r_buy_intovar button').text() == 'Купити' ){
        GM_setValue('GP_Autobuy', 0 );
        //var audio = new Audio("https://cdn.pixabay.com/audio/2023/07/14/audio_c58f71a2f5.mp3");audio.play();
        setTimeout(function(){
            $('#r_buy_intovar button').trigger('click').click();
            $('body').append('<div style="height:200px;position:fixed;left:0;right:0;bottom:0;background:#DC143C;"></div>');
        }, 10 );
    }else if( gpAutobuy ){
        var time = Math.floor(Math.random() * (3500 - 1300 + 1) + 1300);
        setTimeout(function(){ location.reload(); }, time );
        console.log( time );
    }

});
