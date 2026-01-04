

    // ==UserScript==
    // @name         Camwhores
    // @version      1.0.1
    // @description  Show full sizes image on https://www.camwhores.tv/
    // @match        https://www.camwhores.tv/*
    // @match        https://www.camwhores.video/*
    // @require      http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
    // @grant        GM_addStyle
    // @namespace https://greasyfork.org/users/1291978
// @downloadURL https://update.greasyfork.org/scripts/493227/Camwhores.user.js
// @updateURL https://update.greasyfork.org/scripts/493227/Camwhores.meta.js
    // ==/UserScript==
     
     
    var $ = unsafeWindow.jQuery;
     
    function sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }
     
    $(function () {
        $('.table').remove();
     
        const regex = /videos_screenshots\/(\d*)\/(\d*)/gm;
        var finded = null;
        //do {
        try{
            var new_thumbs = [];
            var private_url = '';
            var thumbs = $(".block-screenshots").find('img');
            try{
                private_url = $(thumbs[0]).data('original');
            } catch (err){
                private_url = thumbs[0].src;
            }
            console.log(private_url);
            finded = regex.exec(private_url);
            new_thumbs.push('https://cdn.camwhores.tv/contents/videos_sources/'+finded[1]+'/'+finded[2]+'/screenshots/1.jpg')
            new_thumbs.push('https://cdn.camwhores.tv/contents/videos_sources/'+finded[1]+'/'+finded[2]+'/screenshots/2.jpg')
            new_thumbs.push('https://cdn.camwhores.tv/contents/videos_sources/'+finded[1]+'/'+finded[2]+'/screenshots/3.jpg')
            new_thumbs.push('https://cdn.camwhores.tv/contents/videos_sources/'+finded[1]+'/'+finded[2]+'/screenshots/4.jpg')
            new_thumbs.push('https://cdn.camwhores.tv/contents/videos_sources/'+finded[1]+'/'+finded[2]+'/screenshots/5.jpg')
            console.log(new_thumbs);
            $(".block-screenshots").html('');
            $.each( new_thumbs , function( key, value ) {
                $(".block-screenshots").append('<a href="'+value+'" class="item" rel="screenshots" data-fancybox-type="image"><img class="thumb lazy-load" src="'+value+'" width="180" height="135" style="display: inline;"></a>')
            });
        } catch (err){
        }
     
        //} while (finded === null);
    });
     
     
    GM_addStyle(`
        .block-video .no-player img {
            opacity: 1;
        }
    `);

