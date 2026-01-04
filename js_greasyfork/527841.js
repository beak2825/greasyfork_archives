// ==UserScript==
// @name         UaKino hide viewed
// @version      1.01
// @description  Приховуємо у видачі кіно яке дивились
// @author       Kam
// @grant        GM_setValue
// @grant        GM_getValue
// @include      https://uakino.me/
// @include      https://uakino.me/*
// @require      https://code.jquery.com/jquery-3.1.1.slim.min.js
// @namespace https://greasyfork.org/users/237404
// @downloadURL https://update.greasyfork.org/scripts/527841/UaKino%20hide%20viewed.user.js
// @updateURL https://update.greasyfork.org/scripts/527841/UaKino%20hide%20viewed.meta.js
// ==/UserScript==

window.onload = function() {

    let favorites = GM_getValue("favorites") ? GM_getValue("favorites") : '';

    // сторінка переглянутих
    if( document.location.pathname.match(/\/favorites\/list\/3\//i) ){
        console.log(17);
        $('#dle-content .movie-item.short-item .movie-img a').each(function(){
            var movieID = $(this).attr('href').match(/\/(\d+)\-(.+)/i)[1];
            if(parseInt(movieID)>0){
                favorites = favorites + ',' + movieID;
            }
        });
    }
    // сторінка кіно
    if( document.location.pathname.match(/\/(\d+)\-(.+)/i) ){
        favorites = checkMovieFav(favorites);
    }
    // додаємо в улюблені
    $('.mylists-switch .mylisttooltip').click(function(){
        setTimeout(() => {
            favorites = checkMovieFav(favorites);
        }, "300");
    });

    favorites = removeDuplicates(favorites);
    GM_setValue("favorites", favorites);
    console.log('find fav:',favorites);

if( !document.location.pathname.match(/\/favorites\/list\/3\//i) ){
    let favoritesArr = favorites.split(',').map(num => num.trim());
    $('.swiper-wrapper .swiper-slide a.full-movie, .swiper-wrapper .swiper-slide a.movie-title, .movie-item a.movie-title').each(function(){
        var movieID = $(this).attr('href').match(/\/(\d+)\-(.+)/i)[1];
        if( favoritesArr.includes(movieID) ){
            $(this).closest('.swiper-slide').remove();
            $(this).closest('.movie-item').remove();
            console.log('removed '+movieID);
        }
    });
}

};

function removeDuplicates(favorites) {
    return [...new Set(favorites.split(',').map(num => num.trim()).filter(num => num !== ''))].join(',');
}

function checkMovieFav(favorites){
    var movieID = document.location.pathname.match(/\/(\d+)\-(.+)/i)[1];
    console.log('movie page', movieID);
    if( $('.mylists-switch .mylisttooltip.active img[src="/templates/uakino/images/list3.png"]').length == 1 ){
        favorites = favorites + ',' + movieID;
    }
    if( $('.mylists-switch .mylisttooltip.active img[src="/templates/uakino/images/list3.png"]').length == 0 ){
        favorites = favorites.replace(movieID, ',');
    }

    favorites = removeDuplicates(favorites);
    GM_setValue("favorites", favorites);
    console.log('find fav:',favorites);

    return favorites;
}