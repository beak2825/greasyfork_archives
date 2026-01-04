// ==UserScript==
// @name         HWM BOT: покупка товара на рынке
// @version      1
// @description  Вводим устраивающую нас цену на товар
// @description  время обновления в секундах, не сильно маленькое чтобы не отследили.
// @description  И все, бот купит все за вас.
// @author       CumshotToAdmin
// @grant        GM_setValue
// @grant        GM_getValue
// @include      https://www.heroeswm.ru/auction.php*
// @include      https://www.heroeswm.ru/auction_buy_now.php
// @require      https://code.jquery.com/jquery-3.1.1.slim.min.js
// @namespace https://greasyfork.org/users/237404
// @downloadURL https://update.greasyfork.org/scripts/493254/HWM%20BOT%3A%20%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B0%20%D1%82%D0%BE%D0%B2%D0%B0%D1%80%D0%B0%20%D0%BD%D0%B0%20%D1%80%D1%8B%D0%BD%D0%BA%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/493254/HWM%20BOT%3A%20%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B0%20%D1%82%D0%BE%D0%B2%D0%B0%D1%80%D0%B0%20%D0%BD%D0%B0%20%D1%80%D1%8B%D0%BD%D0%BA%D0%B5.meta.js
// ==/UserScript==

(function (undefined) {

    if( document.location.href == 'https://www.heroeswm.ru/auction_buy_now.php' ){
        window.history.back();
    }

    urlHash = '__GPURL_' + document.location.search.replace(/[^A-Za-z]/g, '');
    var gpActive = GM_getValue("GP_Active"+urlHash)*1 ? 1 : 0 ;
    var gpPrice = GM_getValue("GP_Price"+urlHash)*1 ? GM_getValue("GP_Price"+urlHash)*1 : 1000000 ;
    var gpReloadFrom = GM_getValue("GP_ReloadFrom"+urlHash)*1 ? GM_getValue("GP_ReloadFrom"+urlHash)*1 : 20 ;
    var gpReloadTo = GM_getValue("GP_ReloadTo"+urlHash)*1 ? GM_getValue("GP_ReloadTo"+urlHash)*1 : 60 ;
    var gpAutobuy = GM_getValue("GP_Autobuy"+urlHash)*1 ? 1 : 0 ;

    configHtml = '<div id="GP_config" style="width:90px;position:fixed;top:0;right:0;background:rgba(0,0,0,0.4);font-size:10px;text-align:center;color:#fff;">';
    configHtml += '<label><input type="checkbox" id="GP_Active" '+ (gpActive==1 ? 'checked' : '') +' value="1">активность</label>';
    configHtml += '<div><input type="text" id="GP_Price" value="'+gpPrice+'" style="width:100%;font-size:12px;text-align:center;" placeholder="Цена"></div>';
    configHtml += '<input type="text" id="GP_ReloadFrom" value="'+gpReloadFrom+'" style="width:50%;font-size:12px;" placeholder="сек.ОТ">';
    configHtml += '<input type="text" id="GP_ReloadTo" value="'+gpReloadTo+'" style="width:50%;font-size:12px;" placeholder="сек.ДО">';
    configHtml += '<div><label><input type="checkbox" id="GP_Autobuy" '+ (gpAutobuy==1 ? 'checked' : '') +' value="1">покупать</label></div>';
    configHtml += '</div>';
    $('body').append(configHtml);

    if( gpActive ){
        elPrice = $('a:contains("Купить >>"):first').closest('tr').find('>td:eq( 2 )');
        findedPrice = parseInt( elPrice.text().trim().replace(',','') );
        $('#GP_config').append('<div>На рынке: '+findedPrice+'</div>');
        console.log(findedPrice, parseInt(gpPrice));
        if( findedPrice > 0 && findedPrice <= parseInt(gpPrice) ){
            console.log('yes');
            okTr = elPrice.closest('tr');
            cnt = parseInt( okTr.find('td:eq(2) b:last').html() );
            //okTr.find('td:last>form>div[id]>a').trigger('click');
            if(1)//if( $('body>table').hide() && $('body img').hide() )
            {
                console.log('Найдена устраивающая цена: ' + findedPrice );
                if( gpAutobuy ){
                    setTimeout(function(){
                        // проверим - вдруг админ добавил проверочных полей.
                        console.log('полей в строке: ' + okTr.find('*').length );
                        if( (cnt==1 && okTr.find('*').length != 45) || (cnt>1 && okTr.find('*').length != 46) ){
                            alert('шухер. Полей в строке '+okTr.find('*').length+', что то изменили.');
                            return;
                        }
                        if( okTr.find('td:last form input[type="submit"][value="Купить"]:visible').length ){
                            console.log('Есть кнопка покупки');
                            if( cnt > 1 ){
                                input = okTr.find('td:last form input[type="text"]').val( cnt );
                            }
                            button = okTr.find('td:last form input[type="submit"][value="Купить"]:visible');
                            button.trigger('click');
                            //GM_setValue('GP_Autobuy'+urlHash, 0 );
                        }
                    },2000);
                }else{
                    elPrice.closest('table').find('>tbody>tr').each(function(a,b){
                        if( a > 2 ){
                            //$(this).hide();
                        }
                    });
                    $('body').append('<div style="height:180px;position:fixed;left:0;right:0;bottom:0;background:#DC143C;"></div>');
                    var audio = new Audio('https://soundbible.com/mp3/Battle%20Axe%20Swing-SoundBible.com-1901696187.mp3');
                    audio.volume = 0.2;
                    audio.play();
                }
            }
        }else{
            time = Math.floor(Math.random() * (gpReloadTo-gpReloadFrom)) + 1 + gpReloadFrom;
            $('#GP_config').append('<div>timer: <span id="GP_TimerCountdown">'+time+'</span> sec</div>');
            setTimeout(function(){ location.reload(); }, time*1000 );
            GP_Countdown( time );
        }
    }

    $(document).on('change click keyup', '#GP_config ', function() {
        GM_setValue('GP_Active'+urlHash, $('#GP_config #GP_Active').prop('checked') ? 1 : 0 );
        GM_setValue('GP_Price'+urlHash, parseInt( $('#GP_config #GP_Price').val() ) );
        GM_setValue('GP_ReloadFrom'+urlHash, parseInt( $('#GP_config #GP_ReloadFrom').val() ) );
        GM_setValue('GP_ReloadTo'+urlHash, parseInt( $('#GP_config #GP_ReloadTo').val() ) );
        GM_setValue('GP_Autobuy'+urlHash, $('#GP_config #GP_Autobuy').prop('checked') ? 1 : 0 );
    });
}());

function GP_Countdown( leftSec ){
    leftSec--;
    $('#GP_TimerCountdown').html( leftSec );
    setTimeout(function(){
        GP_Countdown( leftSec );
    }, 1000);
}
