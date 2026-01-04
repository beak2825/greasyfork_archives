// ==UserScript==
// @name         Nova Castelijns İmza Toplama Scripti
// @namespace    popmundo
// @author       Nova Castelijns (2641094)
// @version      1.0
// @description  Bu özellik, envanterinizdeki tüm imza defterlerinizi kullanarak birkaç burnu havada popüler isimden imza alacak!
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/Items/*
// @license      MIT
// @icon         https://www.pngmart.com/files/22/Star-Emojis-PNG-HD.png
// @downloadURL https://update.greasyfork.org/scripts/533483/Nova%20Castelijns%20%C4%B0mza%20Toplama%20Scripti.user.js
// @updateURL https://update.greasyfork.org/scripts/533483/Nova%20Castelijns%20%C4%B0mza%20Toplama%20Scripti.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let ilkToplamadakiSure = 0;
    let ilkDefterZamani = null;
    let ilkDefterId = 0;
    let insanBloguIndex = 0;
    let sabitDefterIdleri = [];
    let blokIsleniyor = false;
    let defterIndex = 0;
    let TOPLAM_SURE = 360; // 6 dakika = 360 saniye
    let KAYIT_INDEX = 0;

    function defterSayisiniAl() {
        const defterElementi = jQuery('#checkedlist a:contains("İmza Defteri")');
        if (defterElementi.length > 0) {
            const defterSayisi = defterElementi.closest('td').find('em').text().trim();
            if (defterSayisi.startsWith('x')) {
                return parseInt(defterSayisi.substring(1));
            }
        }
        return 0;
    }

    function kayitEkle(veri) {
        if (window.parent === window) {
            jQuery("#imza-kayitlari").append(`<tr class="${KAYIT_INDEX % 2 == 0 ? "odd" : "even"}"><td>${veri}</td></tr>`);
            KAYIT_INDEX++;
        }
    }

    async function toplanacakKisileriAl(iframe) {
        let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        let kisiler = [];
        let ilkKisilerTablosu = iframeDocument.querySelector('#tablepeople');

        let imzaCheckbox = iframeDocument.querySelector('#ctl00_cphLeftColumn_ctl00_chkAutograph');
        if (imzaCheckbox) {
            imzaCheckbox.checked = true;
        }

        let digerCheckboxlar = [
            '#ctl00_cphLeftColumn_ctl00_chkGame',
            '#ctl00_cphLeftColumn_ctl00_chkRelationships'
        ];

        digerCheckboxlar.forEach(selector => {
            let checkbox = iframeDocument.querySelector(selector);
            if (checkbox && checkbox.checked) {
                checkbox.checked = false;
            }
        });

        let filtreButonu = iframeDocument.querySelector('#ctl00_cphLeftColumn_ctl00_btnFilter');
        if (filtreButonu) {
            filtreButonu.click();
        } else {
            throw new Error("Filtre butonu bulunamadı.");
        }

        return new Promise((resolve) => {
            let interval = setInterval(() => {
                let yeniIframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                let yeniKisilerTablosu = yeniIframeDocument.querySelector('#tablepeople');

                if (yeniKisilerTablosu && yeniKisilerTablosu !== ilkKisilerTablosu) {
                    clearInterval(interval);
                    let filtrelenmisKisiler = [];

                    Array.from(yeniKisilerTablosu.querySelectorAll('tbody tr')).forEach(satir => {
                        let karakterLinki = satir.querySelector('a');
                        let durumMetni = satir.querySelectorAll('td')[1]?.textContent.trim().toLowerCase();

                        let mesgulDurumlar = ["seyahatte", "keşifte", "keşif", "uçuyor"];
                        let mesgulMu = mesgulDurumlar.some(durum => durumMetni.includes(durum));

                        if (!mesgulMu && karakterLinki) {
                            let karakterId = karakterLinki.href.split('/').pop();
                            filtrelenmisKisiler.push({
                                name: karakterLinki.textContent,
                                id: karakterId,
                                status: durumMetni
                            });
                        }
                    });

                    resolve(filtrelenmisKisiler);
                }
            }, 1000);
        });
    }

    async function iframeOlustur() {
        let domain = window.location.hostname;
        let path = '/World/Popmundo.aspx/City/PeopleOnline/';
        let url = 'https://' + domain + path;

        let iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        return new Promise((resolve, reject) => {
            iframe.onload = function () {
                resolve(iframe);
            };
            iframe.onerror = function () {
                reject('İframe yüklenirken hata oluştu');
            };
        });
    }

    async function konumaGit(iframe, karakterId, karakterAdi) {
        let iframeGuncelHost = iframe.contentWindow.location.host;
        let domain = iframeGuncelHost;
        let path = `/World/Popmundo.aspx/Character/${karakterId}`;
        let url = 'https://' + domain + path;

        iframe.src = url;
        await iframeYuklemeBekle(iframe);

        let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        let konumLinki = iframeDocument.querySelector('#ctl00_cphRightColumn_ctl00_lnkInteract')?.href ||
                        iframeDocument.querySelector('#ctl00_cphRightColumn_ctl00_btnInteract')?.href;

        if (!konumLinki) {
            let karakterSunumu = iframeDocument.querySelector('.characterPresentation');
            if (karakterSunumu) {
                let linkler = karakterSunumu.querySelectorAll('a');
                if (linkler.length > 0) {
                    let sonLink = linkler[linkler.length - 1];
                    let href = sonLink.getAttribute('href');
                    let konumId = href.split('/').pop();
                }
                if (!konumId) {
                    kayitEkle(`${karakterAdi} artık şehirde değil veya bir sorun oluştu!`);
                    return;
                }
                konumLinki = `https://${domain}/World/Popmundo.aspx/Locale/MoveToLocale/${konumId}/${karakterId}`;
            }
        }

        let gorecliYol = konumLinki.includes('/World/') ? konumLinki.split('/World/')[1] : null;
        if (!gorecliYol) {
            kayitEkle('Bir şeyler yanlış gitti ama devam ediyoruz!');
            return;
        }

        let yeniUrl = 'https://' + iframe.contentWindow.location.host + '/World/' + gorecliYol;
        kayitEkle(`<b>${karakterAdi}</b> konumuna gidiliyor`);
        iframe.src = yeniUrl;

        await iframeYuklemeBekle(iframe);
    }

    function iframeYuklemeBekle(iframe) {
        return new Promise((resolve) => {
            iframe.onload = function () {
                resolve();
            };
        });
    }

    async function defterIdleriniAl(iframe, kisi) {
        let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        let defterIdleri = [];

        await new Promise(resolve => setTimeout(resolve, 2000));

        let errorElements = jQuery(iframeDocument).find('.error, .warning, .message');
        let errorMessage = '';
        errorElements.each(function() {
            errorMessage += jQuery(this).text().trim() + ' ';
        });

        if (errorMessage) {
            kayitEkle(`Debug - Bulunan hata mesajı: ${errorMessage}`);
        }

        let select = jQuery(iframeDocument).find('#ctl00_cphTopColumn_ctl00_ddlUseItem');
        if (select.length === 0) {
            kayitEkle(`<b>${kisi.name}</b> artık müsait değil veya eşya kullanımına izin vermiyor`);
            return [];
        }

        jQuery(iframeDocument).find('#ctl00_cphTopColumn_ctl00_ddlUseItem option').each(function () {
            let secenekMetni = jQuery(this).text().trim();
            let secenekDegeri = jQuery(this).val();

            if (secenekMetni === 'İmza Defteri') {
                defterIdleri.push(secenekDegeri);

                if (ilkDefterId === 0) {
                    ilkDefterId = secenekDegeri;
                }
            }
        });

        return defterIdleri;
    }

    async function imzaAl(iframe, defterId, kisi) {
        let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        let select = iframeDocument.querySelector('#ctl00_cphTopColumn_ctl00_ddlUseItem');
        if (!select || select.length === 0) {
            return;
        }
        select.value = defterId;

        let gonderButonu = iframeDocument.querySelector('#ctl00_cphTopColumn_ctl00_btnUseItem');
        if (!gonderButonu) {
            kayitEkle(`<b>${kisi.name}</b> için eşya kullanma butonu bulunamadı`);
            return;
        }

        gonderButonu.click();
        await iframeYuklemeBekle(iframe);

        let toplamDefter = defterSayisiniAl();
        if (toplamDefter > 1) {
            let beklemeZamani = Math.floor(TOPLAM_SURE / toplamDefter);
            await new Promise(resolve => setTimeout(resolve, beklemeZamani * 1000));
        }
    }

    jQuery(document).ready(function () {
        jQuery('#checkedlist').before('<div class="box" id="imzalar-kutusu"><h2>✨ İmza Defteri Toplayıcı</h2></div>');
        jQuery('#imzalar-kutusu').append('<p>📝 Bu özellik, envanterinizdeki tüm imza defterlerinizi kullanarak birkaç burnu havada popüler isimden imza alacak!</p>');
        jQuery('#imzalar-kutusu').append('<p class="actionbuttons"><input type="button" name="btn-basla" value="🚀 Başlat" id="imza-basla" class="rmargin5"></p>');
        jQuery('#imzalar-kutusu').append('<table id="imza-kayitlari" class="data dataTable"></table>');
        jQuery('#imza-kayitlari').append('<tbody><tr><th>📋 Kayıtlar</th></tr></tbody>');

        jQuery('#imza-basla').click(async function () {
            try {
                jQuery('#imza-basla').prop('disabled', true);
                jQuery('#imza-basla').prop('value', '🔄 İmzalar Toplanıyor...');

                while (true) {
                    let defterMiktari = defterSayisiniAl();
                    if (defterMiktari === 0) {
                        kayitEkle('❌ İmza defteri bulunamadı. Tekrar deneniyor...');
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        continue;
                    }
                    kayitEkle(`📦 Bulunan imza defteri sayısı: ${defterMiktari}`);

                    let iframe = await iframeOlustur();
                    let musaitKisiler = await toplanacakKisileriAl(iframe);
                    let islenenKisiSayisi = 0;

                    if (musaitKisiler.length > 0) {
                        for (const kisi of musaitKisiler) {
                            if (islenenKisiSayisi >= defterMiktari) break;

                            await new Promise(resolve => setTimeout(resolve, 3000));
                            await konumaGit(iframe, kisi.id, kisi.name);
                            let defterIdleri = await defterIdleriniAl(iframe, kisi);

                            if (defterIdleri.length > 0) {
                                await new Promise(resolve => setTimeout(resolve, 3000));
                                kayitEkle(`✍️ <b>${kisi.name}</b>'den imza alınıyor. Defter ID: ${defterIdleri[defterIndex]}`);

                                await imzaAl(iframe, defterIdleri[defterIndex], kisi);

                                defterIndex = (defterIndex + 1) % defterIdleri.length;
                                islenenKisiSayisi++;
                            }
                        }
                    } else {
                        kayitEkle('❌ Müsait kişi bulunamadı, 30 saniye sonra tekrar denenecek...');
                        await new Promise(resolve => setTimeout(resolve, 30000));
                    }

                    if (iframe) {
                        iframe.remove();
                    }
                }
            } catch (hata) {
                console.error('Hata:', hata);
                kayitEkle('❌ Script çalışırken bir hata oluştu.');
                jQuery('#imza-basla').prop('disabled', false).prop('value', '🚀 Başlat');
            }
        });
    });
})();
