// ==UserScript==
// @name             Remove sponsored posts from Facebook
// @name:it          Rimuovi post sponsorizzati da Facebook
// @namespace        https://andrealazzarotto.com/
// @version          1.0
// @description      Remove sponsored posts and ands from Facebook
// @description:it   Rimuovi elementi sponsorizzati e pubblicità da Facebook
// @author           Andrea Lazzarotto
// @match            http://facebook.com/*
// @match            https://facebook.com/*
// @match            http://*.facebook.com/*
// @match            https://*.facebook.com/*
// @require          https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.slim.min.js
// @require          https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @grant            none
// @license          GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/444003/Remove%20sponsored%20posts%20from%20Facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/444003/Remove%20sponsored%20posts%20from%20Facebook.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let $ = window.jQuery;
    // Thanks to https://greasyfork.org/scripts/404309-facebook-hide-ads-a-k-a-sponsored-posts
    let flags = [
        'Babestua',
        'Bersponsor',
        'Chartered',
        'Commandité',
        'Disponsori',
        'Ditaja',
        'Được tài trợ',
        'Geborg',
        'Gesponsert',
        'Gesponsord',
        'Giisponsoran',
        'Hirdetés',
        'La maalgeliyey',
        'May Sponsor',
        'Noddwyd',
        'Oñepatrosinapyre',
        'Paeroniet',
        'Patrocinado',
        'Patrocinat',
        'Publicidad',
        'Reklamo',
        'Sponsitud',
        'Sponsor dəstəkli',
        'Sponsore',
        'Sponsored',
        'Sponsoreret',
        'Sponsorisé',
        'Sponsorizzata',
        'Sponsorizzato',
        'Sponsorlu',
        'Sponsoroitu',
        'Sponsorowane',
        'Sponsrad',
        'Sponzorirano',
        'Sponzorováno',
        'Spunsurizatu',
        'Stuðlað',
        'Urraithe',
        'Yatiyanaka',
        'Χορηγούμενη',
        'Χορηγούμενον',
        'Демеушілік көрсеткен',
        'Ивээн тэтгэсэн',
        'Реклама',
        'Рэклама',
        'Спонзорирано',
        'Спонсорирано',
        'إعلان مُموَّل',
        'پاڵپشتیکراو',
        'تعاون کردہ',
        'تمويل شوي',
        'دارای پشتیبانی مالی',
        'ⵉⴷⵍ',
        'የተከፈለበት ማስታወቂያ',
        'प्रायोजितः |',
        'प्रायोजित',
        'পৃষ্ঠপোষকতা কৰা',
        'সৌজন্যে',
        'ਸਰਪ੍ਰਸਤੀ ਪ੍ਰਾਪਤ',
        'ପ୍ରଯୋଜିତ',
        'స్పాన్సర్ చేసినవి',
        'സ്പോൺസർ ചെയ്തത്',
        'අනුග්‍රහය දක්වන ලද',
        'ได้รับการสนับสนุน',
        'ໄດ້ຮັບການສະໜັບສະໜູນ',
        'បានឧបត្ថម្ភ',
        '広告',
        '贊助',
        '赞助内容',
    ].map(el => el.toLocaleLowerCase());

    let fixAds = () => {
        let units = $('div[data-pagelet*=FeedUnit]:not(.frsp-processed)');
        units.each(function () {
            let unit = $(this);
            let links = unit.find('a[aria-label]').slice(0, 2);
            links.each(function() {
                let lower = $(this).attr('aria-label').toLocaleLowerCase();
                if (flags.indexOf(lower) >= 0) {
                    unit.remove();
                    return false;
                }
            });
            unit.addClass('.frsp-processed');
        });

        let sidebars = $('*[data-pagelet=RightRail] > div > *');
        sidebars.each(function () {
            let unit = $(this);
            let title = unit.find('h3').text().toLocaleLowerCase();
            if (flags.indexOf(title) >= 0) {
                unit.hide();
            }
        });
    }

    fixAds();
    $(document).arrive('div[data-pagelet*=FeedUnit]:not(.frsp-processed)', () => {
        fixAds();
    });
})();