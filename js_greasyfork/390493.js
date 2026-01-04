// ==UserScript==
// @name        Spotify_ListenBot
// @namespace   Spotify_ListenBot
// @include     https://open.spotify.com*
// @include     http://open.spotify.com*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js
// @version     0.3
// @description Auto listen spotify music 32s then change it to next.
// @author      hcakkuzu
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/390493/Spotify_ListenBot.user.js
// @updateURL https://update.greasyfork.org/scripts/390493/Spotify_ListenBot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Main Func.
    $(document).ready(function() {
        checkIsLoaded();
        injectElements();
        setEvents();
        handleSongList();
        handleBotStatus();

        // Boş açıksa ve track sayfasında ise (dinliyorsa)
        if (isBotStarted() && window.location.toString().includes("track")) {
            // Interval çalıştır her 1 saniyede bir süreyi kontrol etsin
            setInterval(function(){
                // eğer 32 saniye yada fazla olduysa startbot olsun.
                var timeElem = $('.playback-bar__progress-time:visible:first').text();
                if (parseInt(timeElem.substr(2,2)) >= 32) {
                    // Başka şarkı aç. Baştan Başla Döngüye
                    startBot();
                }
             }, 999);
        } else if (isBotStarted()) {
            // botu başlat.
            startBot();
        }
    });

    function checkIsLoaded() {
        if ($('body').text().indexOf('connection failure') != -1) {
            location.reload(true);
        }
    }

    function injectElements() {
        $('.Root__top-container .ExtraControls').prepend('  ' +
                                                         ' <div style="display: flex; height: 50px; color: coral;"> ' +
                                                         ' <button id="bot_showList" class="btn" style="width: 125px; color: black; margin-top: 0; padding: 0;"> Şarkı Listesini Göster </button>  ' +
                                                         ' <button id="bot_start" class="btn" style="width: 125px; color: black; margin-top: 0; padding: 0; margin-left: 10px;">Botu Başlat</button>  ' +
                                                         ' <p class = "TrackListHeader__text-silence TrackListHeader__entity-additional-info" style = "flex: 1; align-items: center; margin-left: 10px; margin-top: 10px;">  ' +
                                                         ' Durum  ' +
                                                         ' <span id="bot_status">ÇALIŞMIYOR!</span> ' +
                                                         ' </p>  ' +
                                                         ' <span style="margin:10px; border-right:1px solid #464646;"> &nbsp </span> ' +
                                                         ' </div> ' +
                                                         '  ');

        $('body').prepend('  ' +
                          ' <div id="botOverlaySongList" style="height: 0%;width: 100%;position: fixed;z-index: 2;top: 0;left: 0;background-color: rgb(0,0,0);background-color: rgba(0,0,0, 0.9);overflow-y: hidden;transition: 0.5s;">  ' +
                          ' <a href="#" id="bot_closeList" style="position: absolute;top: 20px;right: 45px;font-size: 60px;padding: 8px;text-decoration: none;font-size: 36px;color: #818181;display: block;transition: 0.3s;">&times;</a>  ' +
                          ' <div style="position: relative;top: 25%;width: 100%;text-align: center;">  ' +
                          ' <textarea id="songList" rows="30" style="width:50%;height:50%;"></textarea>  ' +
                          ' <button id="saveSongList" class="btn" style="height: 30px; width: 125px; color: black; margin-top: 0; padding: 0;display: block;margin: 0 auto;">Kaydet</button>  ' +
                          ' </div>  ' +
                          ' </div>  ' +
                          '  ');

        console.warn('[SPOTY_BOT] Bot Injected');
    }

    function setEvents() {
        $(document).on("click", "#bot_start", function(){
            if (isBotStarted()) {
                GM_setValue('IS_BOT_STARTED', 'NO');
            } else {
                GM_setValue('IS_BOT_STARTED', 'YES');
                // Ateşle
                setBotSongIndex(0);
                startBot();
            }
            handleBotStatus();
        });

        $(document).on("click", "#bot_showList", function(){
            document.getElementById("botOverlaySongList").style.height = "100%";
        });

        $(document).on("click", "#bot_closeList", function(){
            document.getElementById("botOverlaySongList").style.height = "0%";
        });

        $(document).on("click", "#saveSongList", function(){
            var array = $('#songList').val().split("\n").map(trimString).filter(filterResult);
            GM_setValue('SONG_LIST', JSON.stringify(array));
            alert('Şarkı Listesi Kaydedildi!');
            handleSongList();
            document.getElementById("botOverlaySongList").style.height = "0%";
        });

        console.warn('[SPOTY_BOT] Events Ready');
    }

    function startBot() {
        // BOTU BAŞLAT

        // Şarkı listesini al.
        var songArray = getSongListArray();

        // Eğer şarkı listesi bittiyse sıfırla.
        // TODO: index sıfırlandıktan sonra şarkı listesini karıştır. Hep aynı sıra ile çalmasın.
        if (songArray.length == getBotSongIndex() - 1) {
            setBotSongIndex(0);
        }

        // Dinlenecek şarkıyı bul.
        var nextSong = songArray[getBotSongIndex()];
        // Gelecek şarkı için indexi artır.
        increaseBotSongIndex();
        // Çal keke çal.
        window.location = nextSong;
    }

    function increaseBotSongIndex(index) {
        var index = getBotSongIndex();
        setBotSongIndex(index + 1);
    }

    function setBotSongIndex(index) {
        GM_setValue('BOT_SONG_INDEX', parseInt(index));
    }

    function getBotSongIndex() {
        return parseInt(GM_getValue('BOT_SONG_INDEX', 0));
    }

    function handleSongList() {
        $('#songList').val(getSongListString())
    }

    function trimString(string) {
        return string.trim();
    }

    function filterResult(string) {
        return string.length > 0;
    }

    function isBotStarted() {
        return GM_getValue('IS_BOT_STARTED', 'NO') == 'NO' ? false : true;
    }

    function getSongListString() {
        var array = JSON.parse(GM_getValue('SONG_LIST', ''));
        var stringResult = '';
        array.forEach(function(element) {
            stringResult += element + '\n';
        });
        return stringResult;
    }

    function getSongListArray() {
        var array = JSON.parse(GM_getValue('SONG_LIST', ''));
        return array;
    }

    function handleBotStatus() {
        if (isBotStarted()) {
            $('#bot_start').text('Botu Durdur');
            $('#bot_status').text('ÇALIŞIYOR!');
            $('#bot_status').css('color', '#83ff83');
            $('#bot_showList').hide(200);
            console.warn('[SPOTY_BOT] Bot Running');
        } else {
            $('#bot_start').text('Botu Başlat');
            $('#bot_status').text('ÇALIŞMIYOR!');
            $('#bot_status').css('color', '#ff8b8b');
            $('#bot_showList').show(200);
            console.warn('[SPOTY_BOT] Bot Waiting');
        }
    }

})();