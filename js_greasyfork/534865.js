// ==UserScript==
// @name         Nova Castelijns Otomatik Grafiti Botu
// @namespace    popmundo
// @author       Nova Castelijns (2641094)
// @version      1.0
// @match       https://*.popmundo.com/World/Popmundo.aspx/Character/Items/*
// @grant       none
// @description Nova Castelijns Grafiti Botu
// @icon         https://www.pngmart.com/files/22/Star-Emojis-PNG-HD.png
// @downloadURL https://update.greasyfork.org/scripts/534865/Nova%20Castelijns%20Otomatik%20Grafiti%20Botu.user.js
// @updateURL https://update.greasyfork.org/scripts/534865/Nova%20Castelijns%20Otomatik%20Grafiti%20Botu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var BEKLEME_SURESI = 5 * 60 * 1000; // 5 dakika
    var SPREY_KUTU_ISIMLERI = ["Sprey Boya Kutusu"];
    var MEKAN_TIPI_KULUP = "1"; // Kulüp
    var calisiyor = false;
    var kulupler = [];
    var simdikiKulupIndex = 0;
    var beklemeBitisSuresi = 0;
    var simdikiSehir = null;
    var sehirId = null;
async function spreyKullan(iframe) {
    logKaydet(`🎨 Grafiti yapılıyor...`);
    const esyalarUrl = `https://${window.location.hostname}/World/Popmundo.aspx/Character/Items/`;

    try {
        const doc = await iframeSayfaYukle(iframe, esyalarUrl);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Sayfa yüklenme süresi 5 saniyeye çıkarıldı

        const esyaTablosu = doc.querySelector('#checkedlist');
        if (!esyaTablosu) {
            logKaydet('❌ Eşya tablosu bulunamadı');
            return false;
        }

        const esyaSatirlari = esyaTablosu.querySelectorAll('tr');
        logKaydet(`📦 ${esyaSatirlari.length} eşya satırı bulundu`);

        for (const satir of esyaSatirlari) {
            const esyaIsimElementi = satir.querySelector('td a');
            if (!esyaIsimElementi) continue;

            const esyaMetni = esyaIsimElementi.textContent.trim();
            logKaydet(`🔍 Kontrol edilen eşya: ${esyaMetni}`);

            if (esyaMetni === "Sprey Boya Kutusu") {
                // Genişletilmiş buton seçicileri
                const kullanButonu = satir.querySelector('input[type="image"][title="Kullan"], ' +
                                                       'input[type="image"][alt="Tamam"], ' +
                                                       'input[id*="btnUse"]');

                if (kullanButonu) {
                    logKaydet(`✅ Sprey kutusu ve kullan butonu bulundu: ${esyaMetni}`);
                    kullanButonu.click();
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    logKaydet(`✅ Grafiti tamamlandı`);
                    return true;
                }
                logKaydet(`⚠️ Sprey kutusu bulundu ama kullan butonu bulunamadı: ${esyaMetni}`);
                // Debug için buton araması detayları
                logKaydet(`🔍 Satırdaki tüm input elementleri: ${satir.querySelectorAll('input').length}`);
                satir.querySelectorAll('input').forEach(input => {
                    logKaydet(`📌 Input özellikleri: type=${input.type}, title=${input.title}, alt=${input.alt}, id=${input.id}`);
                });
            }
        }
        logKaydet('❌ Hiç sprey kutusu bulunamadı');
    } catch (hata) {
        logKaydet(`❌ Sprey kullanma hatası: ${hata.message}`);
    }
    return false;
}
    function stilleriEkle() {
        var stil = document.createElement('style');
        stil.textContent = `
            .pm-container {
                font-family: "Lucida Grande", Verdana, sans-serif;
                font-size: 10px;
                margin: 10px;
                position: relative;
                z-index: 1000;
            }
            .pm-header {
                background: #6d7f8c;
                color: white;
                padding: 8px 12px;
                border-radius: 3px 3px 0 0;
            }
            .pm-content {
                background: #fff;
                border: 1px solid #6d7f8c;
                border-top: none;
                padding: 10px;
            }
            .pm-status {
                color: #333;
                margin: 5px 0;
            }
            .pm-button {
                background: #6d7f8c;
                color: white;
                border: 1px solid #5d6f7c;
                padding: 5px 10px;
                cursor: pointer;
                font-size: 10px;
                margin: 5px 0;
            }
            .pm-button:disabled {
                background: #a5b3bd;
                border-color: #95a3ad;
                cursor: not-allowed;
            }
            .pm-logs {
                margin-top: 10px;
            }
            .pm-logs summary {
                cursor: pointer;
                color: #6d7f8c;
                font-weight: bold;
                padding: 5px 0;
            }
            .pm-log-container {
                max-height: 200px;
                overflow-y: auto;
                margin-top: 5px;
            }
            #logList {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            #logList li {
                padding: 4px 0;
                border-bottom: 1px solid #eee;
                color: #333;
            }
            .pm-progress {
                margin: 10px 0;
                color: #555;
            }
        `;
        document.head.appendChild(stil);
    }

    function arayuzOlustur() {
        var konteyner = document.createElement('div');
        konteyner.className = 'pm-container';
        konteyner.innerHTML = `
            <div class="pm-header">
                <h3>Otomatik Grafiti Botu</h3>
            </div>
            <div class="pm-content">
                <div class="pm-status" id="durum">Başlamaya hazır</div>
                <input type="button" class="pm-button" id="baslatBtn" value="Grafiti Yapmaya Başla">
                <div class="pm-progress" id="ilerleme"></div>
                <details class="pm-logs">
                    <summary>Log Kayıtları</summary>
                    <div class="pm-log-container">
                        <ul id="logList"></ul>
                    </div>
                </details>
            </div>
        `;

        var hedef = document.querySelector('#checkedlist') || document.querySelector('#aspnetForm') || document.body;
        hedef.parentNode.insertBefore(konteyner, hedef);

        document.getElementById('baslatBtn').addEventListener('click', grafitiBaslat);
        stilleriEkle();
    }

    function logKaydet(mesaj) {
        var logList = document.getElementById('logList');
        if (logList) {
            var logItem = document.createElement('li');
            logItem.textContent = `${new Date().toLocaleTimeString()} - ${mesaj}`;
            logList.appendChild(logItem);

            var container = document.querySelector('.pm-log-container');
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }
        console.log(`[Grafiti Bot] ${mesaj}`);
    }

    function durumGuncelle(mesaj) {
        var durumEl = document.getElementById('durum');
        if (durumEl) durumEl.innerHTML = mesaj;
    }

    function ilerlemeyiGuncelle(mesaj) {
        var ilerlemEl = document.getElementById('ilerleme');
        if (ilerlemEl) ilerlemEl.innerHTML = mesaj;
    }

    async function iframeOlustur() {
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        return iframe;
    }

    async function iframeSayfaYukle(iframe, url) {
        return new Promise((resolve, reject) => {
            iframe.onload = () => {
                setTimeout(() => {
                    if (iframe.contentDocument) {
                        resolve(iframe.contentDocument);
                    } else {
                        reject(new Error(`Iframe içeriğine erişilemiyor: ${url}`));
                    }
                }, 2000);
            };
            iframe.onerror = () => reject(new Error(`Iframe yüklenemedi: ${url}`));
            iframe.src = url;
        });
    }

    async function sehriTespitEt(iframe) {
        logKaydet(`🔍 Şehir tespit ediliyor...`);
        var sehirUrl = `https://${window.location.hostname}/World/Popmundo.aspx/City`;
        var doc = await iframeSayfaYukle(iframe, sehirUrl);

        var sehirBaslik = doc.querySelector('#ctl00_cphLeftColumn_ctl00_hdrMain, .cityHeader, h1');

        if (sehirBaslik) {
            var sehirAdi = sehirBaslik.textContent.replace("Hoş geldiniz", "").trim();

            if (sehirAdi) {
                simdikiSehir = sehirAdi;
                logKaydet(`🏙️ Şehir: ${simdikiSehir}`);

                var mekanlarLink = doc.querySelector('a[href*="/City/Locales/"]');

                if (mekanlarLink) {
                    var href = mekanlarLink.getAttribute('href');
                    sehirId = href.split('/').pop();
                    logKaydet(`✅ Şehir ID bulundu: ${sehirId}`);
                    return true;
                }
            }
        }

        logKaydet("❌ Şehir tespit edilemedi");
        return false;
    }

    async function kulupleriGetir(iframe) {
        if (!sehirId) {
            logKaydet("❌ Şehir ID'si bulunamadı");
            return false;
        }

        logKaydet(`🎯 ${simdikiSehir} şehrindeki kulüpler aranıyor...`);
        var url = `https://${window.location.hostname}/World/Popmundo.aspx/City/Locales/${sehirId}`;

        var doc = await iframeSayfaYukle(iframe, url);
        var tipSecici = doc.querySelector('#ctl00_cphLeftColumn_ctl00_ddlLocaleType');

        if (!tipSecici) {
            logKaydet("❌ Mekan tipi seçici bulunamadı");
            return false;
        }

        tipSecici.value = MEKAN_TIPI_KULUP;
        var araButon = doc.querySelector('#ctl00_cphLeftColumn_ctl00_btnFind');

        if (!araButon) {
            logKaydet("❌ Arama butonu bulunamadı");
            return false;
        }

        araButon.click();
        await new Promise(resolve => setTimeout(resolve, 3000));

        var guncelDoc = iframe.contentDocument;
        var kulupLinkleri = guncelDoc.querySelectorAll('table#tablelocales tbody tr td:first-child a[href*="/Locale/"]');

        if (kulupLinkleri.length === 0) {
            logKaydet("❌ Kulüp bulunamadı");
            return false;
        }

        kulupler = Array.from(kulupLinkleri).map(link => link.href);
        simdikiKulupIndex = 0;
        logKaydet(`✅ ${kulupler.length} kulüp bulundu`);
        return true;
    }

    async function grafitiKontrol(iframe, kulupUrl) {
        var kulupAdi = kulupUrl.split('/').pop();
        logKaydet(`👀 ${kulupAdi} kulübünde grafiti kontrolü yapılıyor...`);
        var doc = await iframeSayfaYukle(iframe, kulupUrl);
        var grafitiDiv = doc.querySelector('#ctl00_cphLeftColumn_ctl00_divGraffiti');
        var grafitiVar = !!grafitiDiv;
        logKaydet(grafitiVar ? `✅ Zaten grafiti yapılmış` : `❌ Grafiti yapılmamış`);
        return grafitiVar;
    }

    async function kulubeGit(iframe, kulupUrl) {
        var kulupAdi = kulupUrl.split('/').pop();
        logKaydet(`🚶 ${kulupAdi} kulübüne gidiliyor...`);

        try {
            var doc = await iframeSayfaYukle(iframe, kulupUrl);
            var hareketLinki = doc.querySelector('img[src*="movetolocale.png"]')?.parentElement ||
                              doc.querySelector('a[href*="MoveToLocale"]');

            if (hareketLinki) {
                await new Promise(resolve => setTimeout(resolve, 3000));
                await iframeSayfaYukle(iframe, hareketLinki.href);
                logKaydet(`✅ ${kulupAdi} kulübüne varıldı`);
                return true;
            } else {
                logKaydet(`❌ "Mekâna Git" butonu bulunamadı`);
            }
        } catch (hata) {
            logKaydet(`❌ Hata: ${hata.message}`);
        }

        return false;
    }

    async function grafitiBaslat() {
        if (calisiyor) return;
        calisiyor = true;
        var baslatBtn = document.getElementById('baslatBtn');
        if (baslatBtn) {
            baslatBtn.disabled = true;
            baslatBtn.value = 'Çalışıyor...';
        }

        try {
            var simdi = Date.now();
            if (simdi < beklemeBitisSuresi) {
                var kalanDakika = Math.ceil((beklemeBitisSuresi - simdi) / 60000);
                logKaydet(`⏳ ${kalanDakika} dakika bekleme süresi var`);
                durumGuncelle(`⏳ Bekleme süresi (${kalanDakika}dk)`);
                return;
            }

            var iframe = await iframeOlustur();

            if (!await sehriTespitEt(iframe)) {
                logKaydet("❌ Şehir tespit edilemedi");
                return;
            }

            if (kulupler.length === 0) {
                var kuluplerBulundu = await kulupleriGetir(iframe);
                if (!kuluplerBulundu) {
                    logKaydet('❌ Grafiti yapılacak kulüp bulunamadı');
                    return;
                }
            }

            durumGuncelle('🎨 Grafiti yapılıyor...');
            while (simdikiKulupIndex < kulupler.length) {
                var kulupUrl = kulupler[simdikiKulupIndex];
                var kulupAdi = kulupUrl.split('/').pop();
                ilerlemeyiGuncelle(`📈 ${simdikiKulupIndex + 1}/${kulupler.length} (%${Math.round((simdikiKulupIndex + 1) / kulupler.length * 100)})`);

                if (await grafitiKontrol(iframe, kulupUrl)) {
                    logKaydet(`⏩ ${kulupAdi} atlanıyor`);
                } else {
                    if (await kulubeGit(iframe, kulupUrl)) {
                        if (await spreyKullan(iframe)) {
                            beklemeBitisSuresi = Date.now() + BEKLEME_SURESI;
                            logKaydet(`⏳ ${new Date(beklemeBitisSuresi).toLocaleTimeString()} kadar bekleniyor`);
                            await new Promise(resolve => setTimeout(resolve, BEKLEME_SURESI));
                        } else {
                            logKaydet(`❌ ${kulupAdi} için sprey kutusu yok`);
                        }
                    }
                }

                simdikiKulupIndex++;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            durumGuncelle('🏁 Tamamlandı!');
            ilerlemeyiGuncelle('');
            logKaydet('🎉 Tüm kulüplere grafiti yapıldı');
            kulupler = [];
        } catch (hata) {
            logKaydet(`❌ Hata: ${hata.message}`);
            durumGuncelle('❌ Hata oluştu');
        } finally {
            calisiyor = false;
            if (baslatBtn) {
                baslatBtn.disabled = false;
                baslatBtn.value = 'Grafiti Yapmaya Başla';
            }
        }
    }

    function baslat() {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            arayuzOlustur();
        } else {
            document.addEventListener('DOMContentLoaded', arayuzOlustur);
            setTimeout(() => {
                if (!document.querySelector('.pm-container')) {
                    arayuzOlustur();
                }
            }, 1000);
        }
    }

    baslat();
})();