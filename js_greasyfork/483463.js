// ==UserScript==
// @name            Flibusteam
// @name:en         Flibusteam
// @namespace       http://tampermonkey.net/
// @version         1.3
// @description:en  Download torrents from Rutor, RuTracker, NNMClub, BitRU, MegaPeer and Selezen without leaving Steam!
// @description     Скачивай раздачи с Rutor, RuTracker, NNMClub, BitRU, MegaPeer и Selezen не выходя со Steam!
// @author          4acher
// @match           https://store.steampowered.com/app/*
// @grant           GM_addElement
// @grant           GM_xmlhttpRequest
// @require         https://code.jquery.com/jquery-3.6.0.min.js
// @connect         admrenskiy.temp.swtest.ru
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/483463/Flibusteam.user.js
// @updateURL https://update.greasyfork.org/scripts/483463/Flibusteam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.game_area_purchase').prepend(`<div class="game_area_purchase_game_wrapper">
    <div class="game_area_purchase_game" style="background: linear-gradient( 60deg, rgba(117, 176, 34, 0.7) 5%,rgba(88, 138, 27, 0.6) 95%);" id="game_area_purchase_section_download_torrent">
        <div class="game_area_purchase_platform"><span class="platform_img linux"></span></div>
        <div class="game_area_purchase_platform"><span class="platform_img mac"></span></div>
        <div class="game_area_purchase_platform"><span class="platform_img win"></span></div>
        <h1>Скачать ` + $('#appHubAppName_responsive').text() + ` через торрент</h1>

        <p class="game_purchase_discount_countdown" style="color: white; opacity: 0.5;">Поиск осуществляется по Rutor, RuTracker, NNMClub, BitRU, MegaPeer и Selezen</p>
        <div class="game_purchase_action">
            <div class="game_purchase_action_bg">
                <div class="discount_block game_purchase_discount" data-bundlediscount="0" data-discount="100"><div class="discount_pct">-100%</div><div class="discount_prices"><div class="discount_final_price" style="padding: 8px;">Бесплатно</div></div></div>
                <div class="btn_addtocart">
                    <a class="btn_green_steamui btn_medium torrent_dl">
                        <span>Скачать</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
    </div>`);

    $(document).on('click', '.torrent_dl', function(){
        console.log(window.location.protocol);
        var $ModalContent = $J(`
<div class="gotsteamModal">
    <div class="got_steam_ctn">
        <div class="got_steam_box">
            <h1>Результаты поиска по трекерам</h1>
            <div class="gotsteam_buttons">
                <div class="results" style="overflow-y: scroll; height:200px; position:relative; vertical-align: middle; text-align: center;">
                    <img style="width: 100px; margin: 50px auto;" class="loader" src="https://store.akamai.steamstatic.com/public/images/applications/store/steam_spinner.png"/>
                </div>
                <div style="clear: left;"></div>
            </div>
            <div class="got_steam_low_block">
                <div class="gotsteam_steam_ico"><img src="https://store.akamai.steamstatic.com/public/images/v6/steam_ico.png" width="40" height="40" border="0" /></div>
                Сделано с любовью 4acher'ом. Тема с обсуждением проекта на <a href="https://zelenka.guru/threads/6356670/">Lolzteam (Zelenka)</a> и <a href="https://pikabu.ru/story/kachaem_torrentyi_ne_vyikhodya_so_steam_pri_pomoshchi_flibusteam__moya_alternativa_zapadnogo_imsteam_11000252">Pikabu</a>.
            </div>
        </div>
    </div>
</div>
        `);
	    var Modal = new CModal( $ModalContent );

        var year = $('.release_date .date').text().split(' ').at(-1);
        console.log(year);

        GM_xmlhttpRequest({
              method: "GET",
              url: "http://admrenskiy.temp.swtest.ru/index.php?title="+encodeURIComponent($('#appHubAppName_responsive').text()),
              responseType: 'json',
              onload: function(data) {
                if (data.response.length !== 0) {
                    data.response.forEach(function (e) {
                        if (e.title.indexOf($('#appHubAppName_responsive') != -1)) {
                            if (e.title.indexOf(year) != -1) {
                               var title = e.title;
                               var sid = e.sid;
                               var pir = e.pir;
                               var size = e.sizeName;
                               var tracker = e.tracker;
                               var link = e.url;

                               $('.results').prepend('' +
                                   '<a href="'+link+'" class="btn_blue" style="width: 93%; margin-bottom: 10px;">' +
                                   '    <h3 style="font-size: 16px;">' + title + '</h3>' +
                                   `    <h5>${tracker} / Раздают: ${sid} / Качают: ${pir} / Размер: ${size}</h5>` +
                                   '</a>');
                            }
                        };
                    });
                    $('.results').css('text-align', 'left');
                    $('.loader').css('display', 'none');
                } else {
                    $('.got_steam_box > h1').text('Йо-хо-хо, ничего не найдено.');
                    $('.loader').css('display', 'none');
                    $('.results').css('text-align', 'left');
                    $('.results').prepend('<h5>Возможно, игра очень малоизвестна, либо ее еще не хакнули.</h5>');
                }
            }
            });
	    Modal.Show();
    });
})();