// ==UserScript==
// @name         mstdn 画像表示展開
// @namespace    https://twitter.com/zzz5t
// @version      0.0.1
// @description  mstdnの画像表示が、縦幅小さいし一部しか見えないので、ユーザーのTLとかトゥート詳細ページとかで、画像をクリックすると、一回目は、最大縦幅が伸びて画像全体が収まるように表示が変わる
// @author       @zt@friends.nico
// @match        https://mstdn.jp/@*
// @match        https://mstdn.jp/users/*
// @match        https://pawoo.net/@*
// @match        https://pawoo.net/users/*
// @match        https://friends.nico/@*
// @match        https://friends.nico/users/*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/29154/mstdn%20%E7%94%BB%E5%83%8F%E8%A1%A8%E7%A4%BA%E5%B1%95%E9%96%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/29154/mstdn%20%E7%94%BB%E5%83%8F%E8%A1%A8%E7%A4%BA%E5%B1%95%E9%96%8B.meta.js
// ==/UserScript==

jQuery.noConflict();
(function($) {
    $('.entry .status__attachments__inner').each(function() {
        $( this ).one('click', function(e) {
            var height = $(this).width();
            $(this).css({'cssText': 'max-height: '+height+'px !important; height: auto'});
            //video-item
            $(this).find('.media-item').each(function() {
                if ($(this).find('a.u-video').length) {
                    $(this).find('video').css({'transform':'translateY(0%)','-webkit-transform':'translateY(0%)','top':'0','object-fit':'contain','height':'100%','width':'auto','max-width':'100%','margin':'0 auto','display':'block'});
                    $(this).find('a').css({
                        'cursor':'pointer'
                    });
                } else {
                    var bgImg = $(this).find('a').css("background-image").match(/https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:@&=+$,%#]+[a-zA-Z0-9]/g);
                    $(this).find('a').css({
                        'background-image':'',
                        'cursor':'pointer'
                    });
                    bgImg = bgImg[0];
                    $(this).find('a').append('<img class="ext-append-img" src="' + bgImg + '">');
                }
                $(this).find('img.ext-append-img').css({'cssText': 'display: block; margin: 0 auto; max-width: 100%; max-height: '+ height +'px;'});
            });
            $(this).find('.video-item').each(function() {
                var bgImg = $(this).find('a').css("background-image").match(/https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:@&=+$,%#]+[a-zA-Z0-9]/g);
                $(this).find('a').css('background-image','');
                bgImg = bgImg[0];
                $(this).css({'cssText': 'max-height: '+height+'px !important; height: auto'});
                $(this).find('a').append('<img class="ext-append-img" src="' + bgImg + '">');
                $(this).find('img.ext-append-img').css({'cssText': 'display: block; margin: 0 auto; max-width: 100%; max-height: '+ height +'px;'});
            });
            $(this).find('a').unbind("click");
        });
        $( this ).find('a').one('click', function(e) {
            $( this ).closest('.entry .status__attachments__inner').click();
            return false;
        });
    });
})(jQuery);
