// ==UserScript==
// @name         [DP] PlanetDP MAL İzleme Durumu
// @version      1.1
// @description  PlanetDP portalında anime sayfalarındaki MAL ID'leri kullanarak listenizdeki animelerdeki izleme durumunuzu gösteririr.
// @author       nht.ctn
// @namespace    https://github.com/nhtctn
// @icon         data:image/png;base64,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

// @include      *://*planetdp.org/title/*
// @include      *://*planetdp.org/subtitle/*

// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/393642/%5BDP%5D%20PlanetDP%20MAL%20%C4%B0zleme%20Durumu.user.js
// @updateURL https://update.greasyfork.org/scripts/393642/%5BDP%5D%20PlanetDP%20MAL%20%C4%B0zleme%20Durumu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var listCacheTime = 1200000; // 86400000 - 1 gün // 600000 - 10 dk
    var malIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEa8AABGvAff9S4QAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAAO9SURBVFhHvVfpTxNREN9+9/im/4CJCbbVCKgfNPGL0S/QrVivRg1IFE0EjWKJiTEeifpJSYwxUYxdsIVGoF4lHgiJ4hUPxIuKqHhEiqJGAhI5xpnp27q7rrRQ6yS/dGfevPnNe/tm+lZKXMAyzXky0+pUPDZZqbQ5vbdtTiXMkPFZ9vptDmW7Ncebgc6W6Jx/IFOzT4ynwEjwyu5UICHISjv6F6e5AuNEmLEIWOyyNw9X22VKkgAwiQjuWC4GG92OpLsCEzFA0BgwCQRnucsniPAjizXLNxlX3mwSJCngbjRbs45PFjTmwitPAXkMGHuEncB3/m+3/S/w1iLZn2eCDpz5hBQAuQRtVLjUkjjtowVVh65Eqc7NHFMJ4hT0VO/YONDoKDwHjqJzMG91lc553poA27M2ndXZVcxZ6YfFOL5mRx2sKqmDdFcF22X0d28PwYL8M3/MIU4kt0jUXsmADQMGB4eApP3dN8hc7mPHuauq4H1nD9t7en/i9v0OUri/AZpbu2BoaJjHVSE7jTfcfcv66VA4NkcL4paszlMeUrQJkNRcbYMZOeXQ9PCDsOgTOFr5SFgBnrV3w+WmN3D1Vgdj15Gb7BMvAeKW6I8lqugTILnT8lE8RUVNQMZXNTwcXfVh5T4HW7btIvzoH2Cs332FbfESIG6J/tVI0SZw20B872mEf9UESssfsP6tp59fVcbS05C38xLbSDbsrWeCuAkgNyaghEnRJrDlYCME61/yc/DaSyg80MjPagK+UCvrJDRnQECVxBNQwqYJbD7QAOm4qorzz2HmkgooMiRQVv04pj8Kf2K0dXxlG0nBqBLAywQpxgS0jsYEdpTeYJ2qRfVxe0JsI9m4T59A1eU2mL3Cj/DBLFFdBOKmBPykaBMo2n8t5kQwJrBwXTUeQuDym58bYB+3p459SIwJ0HEdwgnk3/qqOxaXuHVl2Pm5F7q+9EGBOMUqCvbUQwTtrz985wSoabW8+MTBjwVa2Gfp1gvwEecT8ndF59fiOers7tOhrOZJLC53Q7URxQORElS95NB1bkIOTXc0+qi6FuoYwZrN90eJW7F2IBFQk7IvNh9LCLKXWnFU8F0UmzqlEMQp6CWJ/hrREDFzTAWIK811RH9jxkOYa+acEhgvJEL+55XMXOjCiNuTskspxZ6yKM71nK7OdHs1C5AMxMImCZqRhXaCtsoYZOzw1sZduYlY7A5lbTLVQXOnRz/Nxi5conRpxcZhRmIK9EVy/Dg1lFqSIj7PT438eS7aa2IiSb8ApGbFYLZqKncAAAAASUVORK5CYII="
    var enter = `
`
    var title = document.querySelector( 'h1[itemprop="name"]' ).textContent;
    var seriesCheck = document.querySelector( '[id="listnum"]' ) != null;
    var animeLink = document.querySelector( 'h1 span > a[href*="myanimelist.net/anime"]');
    if (animeLink != null) {
        var firstTimeCheck;
        var userAnimeList = [];
        var updateAnimeList = [];
        var userNameGlo = malUserNameFunc();
        malListFunc(userNameGlo);

        // Eksikse altyazı üstü barını yerleştir
        var fisrtSeason = document.querySelector( '.season_1 th[colspan="12"]' );
        if (!fisrtSeason) {
            var text = (seriesCheck) ? '1. Sezon ' + title : title + ' Altyazıları';
            var barHTML = '<tbody></tbody><thead style="background-color:#ffd564;"><tr class="season_1"><th colspan="12" style="color:#fff;padding-left:15px">' + text + '</th></tr></thead>'
            document.querySelector('tr.rowhead').parentElement.insertAdjacentHTML("afterend",barHTML);
        }

        var malID = animeLink.href.toString().replace( /.+\/anime\/(\d+)/, "$1");
        document.querySelector( '.season_1 th[colspan="12"]' ).insertAdjacentHTML( "beforeend", html( malID ) );

        var css =
`
.malBox        {position: relative; float: right; margin: 3px 5px 0 0; min-width: 25px;}
.malBorder     {height: 25px; border-radius: 15px; border: 2.5px solid #fff;}
.malEpisode    {white-space: nowrap; line-height: 14.5px; font-size: 16px; width: 0; padding: 2px 0; color: transparent; overflow:hidden; transition: .3s ease-out}
.malButton     {position: absolute; top: 0; right: 0; height: 25px; width: 25px; border-radius: 15px; background-color: #fff;}
.malImg        {position: absolute; width: 20px; height: 20px; top: 2.5px; left: 2.5px;}

.completed     {background-color: #404B9E;}
.watching      {background-color: #0fc420;}
.on_hold       {background-color: #f1c83e;}
.dropped       {background-color: #ff0004;}
.plan_to_watch {background-color: #c3c3c3;}

.malBox:hover .malEpisode {padding: 2px 28px 2px 10px; width:auto; color: #fff}
`
        GM_addStyle( css );
    }


    function malUserNameFunc() {
        var userName = GM_getValue( "userName" );
        if (userName == null) {
            userName = prompt("İzleme durumunuzu site üstünde görmek için MyanimeList kullanıcı adınızı giriniz.")
            GM_setValue( "userName", userName );
            GM_setValue( "lastUpdateTime", 0 );
            firstTimeCheck = true;
        }
        return userName;
    }

    function malListFunc( userName ) {
        userAnimeList = GM_getValue( "cachedUserList" )
        var d = new Date();
        var currentTime = d.getTime();

        var lastUpdateTime = GM_getValue( "lastUpdateTime" );
        if (currentTime - lastUpdateTime > listCacheTime && GM_getValue( "userName" ) != null) {
            updateList( userName );
        }
    }

    function updateList ( userName, repeat ) {
        repeat = (repeat != null) ? repeat : 0;
        var offset = repeat*300;
        GM_xmlhttpRequest({
                method: "GET",
                url: "https://myanimelist.net/animelist/" + userName + "/load.json?status=7&offset=" + offset,
                onload: function(response) {
                    var json = response.responseText;
                    var newAnimeList = JSON.parse( json );

                    if (newAnimeList.errors == null) {
                        var anime;
                        for (var x = 0; x < newAnimeList.length; x++ )
                        {
                            anime = newAnimeList[x];
                            updateAnimeList[ anime.anime_id ] = anime;
                        }

                        var d = new Date();
                        var currentTime = d.getTime();

                        var pageLength = newAnimeList.length;
                        if (pageLength == 300) {
                            updateList( userName, repeat + 1 )
                        }
                        else {
                            GM_setValue( "cachedUserList", updateAnimeList);
                            GM_setValue( "lastUpdateTime", currentTime );
                            if (firstTimeCheck == true) {location.reload();}
                        }
                    }
                    else {
                        var newUserName = prompt("Girmiş olduğunuz \"" + userName + "\" kullanıcı adı bulunamadı." + enter + "İzleme durumunuzu site üstünde görmek için MyanimeList kullanıcı adınızı giriniz.")
                        GM_setValue( "userName", newUserName );
                        updateList ( newUserName );
                    }
                }
        });
    }

    function html( ID ) {
        var anime = userAnimeList[ID];
        var isInList = anime != null;

        var episodeCheck, episodes, status, animeName;
        if (isInList) {
            episodeCheck = "malEpisode"
            episodes = anime.num_watched_episodes + `/` + anime.anime_num_episodes.toString().replace( /^0$/, "?" );
            status = watchStatus(anime.status).toLowerCase().replace( / /g, "_" );
            animeName = anime.anime_title + ` (` + watchStatusTR(anime.status) + `)`
        }
        else {
            episodeCheck = "";
            episodes = "";
            status = '';
            animeName = "";
        }

        return `
<div class="malBox">
  <a href="https://myanimelist.net/anime/` + ID + `" target="_blank" style="text-decoration: none;">
    <div class="malBorder">
      <div class="` + episodeCheck + `">
          ` + episodes + `
      </div>
    </div>
    <div class="malButton ` + status + `" title="` + animeName + `">
      <img class="malImg" src="` + malIcon + `">
    </div>
  </a>
</div>
`
    }

    function watchStatus( ID ) {
        if (ID == 1) {return "Watching";}
        else if (ID == 2) {return "Completed";}
        else if (ID == 3) {return "On Hold";}
        else if (ID == 4) {return "Dropped";}
        else if (ID == 6) {return "Plan to Watch";}
    }

    function watchStatusTR( ID ) {
        if (ID == 1) {return "İzleniyor";}
        else if (ID == 2) {return "Tamamlandı";}
        else if (ID == 3) {return "Beklemede";}
        else if (ID == 4) {return "Bırakıldı";}
        else if (ID == 6) {return "İzlenecek";}
    }

})();