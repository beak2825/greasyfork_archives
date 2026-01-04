// ==UserScript==
// @name         GorevTakipUfakDuzeltmeler
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description  Site üzerinde ufak düzeltmeler içerir.
// @author       MÇ
// @match        https://www.gorevtakip.com/*
// @match        https://gorevtakip.com/*
// @match        https://yardim.adayazilim.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gorevtakip.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452471/GorevTakipUfakDuzeltmeler.user.js
// @updateURL https://update.greasyfork.org/scripts/452471/GorevTakipUfakDuzeltmeler.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', function() {
        var extraCSS = '.buyukMetin,.faaliyetNotlarDiv{ word-break: break-word !important; }'
                     + 'img{ display: block !important; max-width: 100% !important; height: auto !important; }'
                     + 'li.isAkisiListItem:hover{ background-color: #ddd !important; }'
                     + 'div[ng-repeat="etiket in is.Etiketler"]{ display:none; }'
                     + '.isAkisiListItemAyrintiRenksiz{ float: left !important; text-align: right !important; margin:0 2px 0 -48px !important; }'
                     + '.btn-group>.btn+.dropdown-toggle{ padding-left:0 !important; padding-right:0 !important; }'
                     + '.isAkisiListItemAyrintiRenksiz ul.dropdown-menu{ float:none !important; right:auto !important; }';

        var myStyle = document.createElement('style');
            myStyle.style = '';
            myStyle.innerHTML = extraCSS;
            document.getElementsByTagName('body')[0].appendChild(myStyle);

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var $ = window.jQuery;
        var observer = new MutationObserver(function(mutations) {
            setTimeout(function () {
                var isListesi = $('.gorevBilgiSatiri');
                if (typeof(isListesi) !== 'undefined' && isListesi !== null)
                {
                    for (var i=0; i<isListesi.length; i++)
                    {
                        var aktifEtiket = isListesi.eq(i).find('div[ng-repeat="etiket in is.Etiketler"]');
                        if(isListesi.eq(i).attr('tagCount') != aktifEtiket.length){
                            isListesi.eq(i).find('span.eetiket').remove();
                            for(var e=0; e<aktifEtiket.length; e++){
                                if(aktifEtiket.eq(e).attr('title') !== undefined){
                                    var rgb = aktifEtiket.eq(e).attr('style').match(/rgb\((\d+), (\d+), (\d+)\)/);
                                    var tmpHTML2 = '<span ng-class="{badge:true, badgeMargin:true, \'hidden-xs\':true, gorevBadgeOkunmadi:!is.Okunmus}" class="badge badgeMargin eetiket hidden-xs" style="background-color:'+rgb[0]+' !important;">'+aktifEtiket.eq(e).attr('title')+'</span> ';
                                    $(isListesi[i]).find('a.gorevLink').closest('div').prepend(tmpHTML2);
                                }
                            }
                            isListesi.eq(i).attr('tagCount',aktifEtiket.length);
                        }

                        if($(isListesi[i]).attr('faalKisiYazildi') === '1') continue;
                        var aktifFaaliyet = isListesi[i].querySelector('span[ng-repeat="faaliyet in is.AktifFaaliyetler"]');
                        var renk = ($(aktifFaaliyet).attr('title') !== undefined && $(aktifFaaliyet).attr('title')?.indexOf('Acente Web Yazılım Ekibi') !== -1 ? 'darkslateblue' : 'crimson');
                        var renkBackground = ($(aktifFaaliyet).attr('title')?.indexOf('Acente Web Yazılım Ekibi') !== -1 ? '#f6f6f6' : '#fff');
                        $(aktifFaaliyet).closest('li.isAkisiListItem').css("background-color",renkBackground);

                        if($(aktifFaaliyet).attr('title') !== undefined){
                            var tmpHTML = '<span ng-class="{badge:true, badgeMargin:true, \'hidden-xs\':true, gorevBadgeOkunmadi:!is.Okunmus}" ng-show="!is.Sonlanmis &amp;&amp; !is.Ertelenmis" class="badge badgeMargin" style="background-color:'+renk+' !important;">'+$(aktifFaaliyet).attr('title')+'</span>';
                            isListesi[i].querySelector('a.gorevLink').insertAdjacentHTML("beforeBegin", tmpHTML);
                        }
                        $(isListesi[i]).closest('tekis').find('div.btn-group').prepend('<button onclick="$(this).closest(\'tekis\').find(\'ul.dropdown-menu li a[ng-click=\\\'etiketle(is);\\\']\').first().trigger(\'click\')[0].click();" class="btn-mini2 btn-round btn btn-dark btn-sm2 btn-islemler" ng-show="kullaniciYonetimYapabilir"><i class="fa fa-tags" aria-hidden="true"></i></button>');
                        $(isListesi[i]).attr('faalKisiYazildi','1');
                    }
                }
            }, 300);
        });
        observer.observe(document.body, {childList: true, subtree:true});
    });
})();