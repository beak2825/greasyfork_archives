// ==UserScript==
// @name         Image Favourites
// @namespace    pxgamer
// @version      0.4
// @description  Add favourites for images.
// @author       pxgamer
// @include      *kat.cr/user/*/albums/
// @include      *kat.cr/user/*/recentimages/
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://code.jquery.com/jquery-1.12.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/19816/Image%20Favourites.user.js
// @updateURL https://update.greasyfork.org/scripts/19816/Image%20Favourites.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    var dataVal = GM_getValue('favouriteImagesData', '[]');
    var data = JSON.parse(dataVal);
    var htmlD = '';

    $('a.turnoverButton.siteButton.bigButton[href$="/albums/"]').before('<a class="turnoverButton siteButton bigButton favouriteImages">Favourites</a><a class="favouritePop" style="display: none;"></a>');
    if (location.href.indexOf('/recentimages/') > -1) {
        $('a[href^="/image/delete/"][data-id].deleteImageJs').after('<a class="favouriteImageJS topmarg2px absolute" style="margin-left: 25px;"><i class="ka ka16 ka-star"></i></a>');
    }

    $('a.favouriteImages').on('click', function() {
        $('a.turnoverButton').removeClass('active');
        $('a.favouriteImages').addClass('active');
        $('h2').text('Favourites');
        $('a[href="/account/newalbum/"]').parent().hide();
        $('.pages.botmarg5px.floatright').hide();
        var imgCan = $('div.galleryThumbSizerStills.inlineblock:first').parent();
        imgCan.html('');

        if (data.length === 0) {
            imgCan.append('<h3>No Favourites Were Found!</h3>');
        }
        else {
            for (var i = 0; i < data.length; i++) {
                imgCan.append('<div class="galleryThumbSizerStills inlineblock">\
<a data-point="'+i+'" class="topmarg2px leftmarg2px absolute favRemove"><i class="ka ka16 ka-delete ka-green"></i></a>\
<a data-href="'+data[i].imageUrl+'" class="galleryThumb favouritePop">\
<img class="lazyjs" data-id="'+data[i].imageId+'" data-original="'+data[i].imageUrl+'" src="'+data[i].imageUrl+'" style="display: inline;" />\
</a>\
</div>');
            }
        }
        $('a.favouritePop').css('cursor', 'pointer');

        $('a.favouritePop').on('click', function() {
            var imgLoc = $(this).attr('data-href');
            var w = ($( window ).width()/100*80);
            var h = ($( window ).height()/100*80);
            htmlD = '<div style="width: '+w+'px; height: '+h+'px; overflow: auto; scroll: hidden; position:relative;"><img src="'+imgLoc+'" style="width: '+(w-5)+'px; height: '+(h-5)+'px;" /></div>';
            $.fancybox(htmlD);
        });

        $('a.favRemove').on('click', function() {
            var dPoint = $(this).attr('data-point');
            data.splice(dPoint, 1);
            $(this).parent().remove();
            GM_setValue('favouriteImagesData', JSON.stringify(data));
        });
    });

    $('a.favouriteImageJS').on('click', function() {
        var dataId   = $(this).prev('a.deleteImageJs').attr('data-id');
        var imageUrl = $(this).next('a.galleryThumb').attr('href');
        var dataArr = {
            'imageId':   dataId,
            'imageUrl':  imageUrl
        };
        data.push(dataArr);
        GM_setValue('favouriteImagesData', JSON.stringify(data));
    });
})();
