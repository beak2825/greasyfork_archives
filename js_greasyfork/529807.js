// ==UserScript==
// @name         Nova Castelijns Mekân Nakit Scripti
// @namespace    popmundo
// @author       Nova Castelijns (2641094)
// @version      1.0
// @description  Popmundo'da şirket ve lokasyonları arasındaki para transferlerini yönetmek için bir araç.
// @match        https://*.popmundo.com/World/Popmundo.aspx/Company/LocaleMoneyTransfer*
// @license      MIT
// @icon         https://www.pngmart.com/files/22/Star-Emojis-PNG-HD.png
// @downloadURL https://update.greasyfork.org/scripts/529807/Nova%20Castelijns%20Mek%C3%A2n%20Nakit%20Scripti.user.js
// @updateURL https://update.greasyfork.org/scripts/529807/Nova%20Castelijns%20Mek%C3%A2n%20Nakit%20Scripti.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Sayfanın yüklenmesini bekler
    jQuery(document).ready(function() {
        // Mevcut fonları saklamak için global değişken
        let availableFunds = 0;

        // Ana div'den mevcut fonları çıkar
        const fundsText = jQuery("#ppm-content p:nth-of-type(2) strong").text();
        if (fundsText) {
            availableFunds = parseFloat(fundsText.replace(/[^\d,]/g, '').replace(',', '.'));
            console.log("Mevcut fonlar:", availableFunds);
        }

        // `tablelocales` elementini seç
        const tableLocales = jQuery("#tablelocales");

        // Element var mı kontrol et
        if (tableLocales.length) {
            // `box` sınıfı ile yeni div oluştur
            const newDiv = jQuery("<div>").addClass("box");

            // H2 başlığını div'e ekle
            const newH2 = jQuery("<h2>").text("Lokasyon Para Yöneticisi");
            newDiv.append(newH2);

            // Açıklama paragrafını ekle
            const hintParagraph = jQuery("<p>")
                .html("<strong>Talimatlar:</strong> Bu alanı şirketiniz ve kontrol ettiği lokasyonlar arasında para transferi yapmak için kullanın. <br>"
                    + "<strong>Pozitif</strong> bir değer girerek parayı <strong>şirketten lokasyonlara</strong> transfer edin. <br>"
                    + "<strong>Negatif</strong> bir değer girerek parayı <strong>lokasyonlardan şirkete</strong> transfer edin. <br>"
                    + "Aşağıda listelenen tüm lokasyonlara değeri uygulamak için <strong>Doldur</strong> butonuna tıklayın. <br>"
                    + "Onay kutusu işaretliyse, yeterli bakiyesi olmayan lokasyonlar için otomatik olarak mümkün olan maksimum değer ayarlanacaktır.");
            newDiv.append(hintParagraph);

            // Sayısal input ekle
            const inputNumber = jQuery("<input>")
                .attr("type", "number")
                .attr("min", "0")
                .attr("placeholder", "Tam sayı değer girin")
                .attr("class", "round width100px")
                .attr("data-custom-input", "true");
            newDiv.append(inputNumber);

            // Doldur butonu ekle
            const inputSubmit = jQuery("<input>")
                .attr("type", "button")
                .attr("value", "Doldur")
                .on("click", function(event) {
                    event.preventDefault();

                    const inputValue = parseFloat(inputNumber.val()) || 0;

                    // Toplam fon kontrolü
                    if (inputValue > 0 && availableFunds < inputValue * localeData.length) {
                        alert("Şirketin kasasında yeterli bakiye yok.");
                        return;
                    }

                    // Bireysel fon kontrolü
                    if (inputValue < 0 && !jQuery("#removePartial").is(":checked")) {
                        const insufficientLocales = localeData.filter(locale => locale.moneyAvailable + inputValue < 0);
                        if (insufficientLocales.length > 0) {
                            alert("Şu lokasyonlarda yeterli para yok:\n" + insufficientLocales.map(locale => locale.localeName).join("\n"));
                            return;
                        }
                    }

                    // İlgili inputları doldur
                    localeData.forEach(locale => {
                        if (jQuery("#removePartial").is(":checked") && inputValue < 0) {
                            const valueToFill = Math.min(Math.abs(inputValue), locale.moneyAvailable);
                            jQuery(`#${locale.inputId}`).val(-valueToFill);
                        } else {
                            jQuery(`#${locale.inputId}`).val(inputValue);
                        }
                    });
                    inputNumber.val(0);
                });
            newDiv.append(inputSubmit);

// Tüm parayı çek butonu ekle
const withdrawAllButton = jQuery("<input>")
    .attr("type", "button")
    .attr("value", "Mekanlardaki Tüm Parayı Çek")
    .css("margin-left", "10px")
    .on("click", function(event) {
        event.preventDefault();

        // Her mekan için mevcut parayı negatif değer olarak ayarla
        localeData.forEach(locale => {
            if (locale.moneyAvailable > 0) {
                // Mevcut paradan 1 eksik çek
                const amountToWithdraw = Math.max(Math.floor(locale.moneyAvailable) - 1, 0);
                jQuery(`#${locale.inputId}`).val(-amountToWithdraw);
            }
        });
    });
            newDiv.append(withdrawAllButton);

            // Onay kutusu ve açıklamasını ekle
            const checkboxDiv = jQuery("<div>");
            const inputCheckbox = jQuery("<input>")
                .attr("type", "checkbox")
                .attr("id", "removePartial");
            const checkboxLabel = jQuery("<label>")
                .attr("for", "removePartial")
                .text(" Eğer lokasyonda yeterli para yoksa, mevcut olanı kullan");
            checkboxDiv.append(inputCheckbox).append(checkboxLabel);
            newDiv.append(checkboxDiv);

            // Mevcut fonları ve güncel bakiyeyi gösteren paragraf
            const fundsParagraph = jQuery("<p>").html(`Şirketin Tahmini Kasası: <strong id="updatedFunds">${availableFunds.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} M$</strong>`);
            const warningMessage = jQuery("<span>")
                .attr("id", "warningMessage")
                .css({ color: "red", display: "none" })
                .text(" - Yeterli bakiye olmayacak");
            fundsParagraph.append(warningMessage);
            newDiv.append(fundsParagraph);

            // Yetersiz bakiyeli lokasyonlar listesi
            const insufficientFundsList = jQuery("<ul>").attr("id", "insufficientFundsList").css("color", "red");
            newDiv.append(insufficientFundsList);

            // Yeni div'i tablelocales'in hemen üstüne ekle
            tableLocales.before(newDiv);

            // Tablodan verileri çıkar
            const localeData = [];
            tableLocales.find("tbody tr").each(function() {
                const row = jQuery(this);
                const localeId = row.find("input[type='hidden']").val();
                const localeName = row.find("td:first-child a").text();
                const moneyAvailable = parseFloat(row.find("td:nth-child(2)").text().replace(/[^\d,]/g, '').replace(',', '.'));
                const inputId = row.find("input[type='text']").attr("id");

                localeData.push({
                    localeId: localeId,
                    localeName: localeName,
                    moneyAvailable: moneyAvailable,
                    inputId: inputId
                });
            });

            console.log("Çıkarılan veriler:", localeData);

            // Girilen değere göre mevcut fonları güncelle
            inputNumber.on("input", function() {
                const inputValue = parseFloat(inputNumber.val()) || 0;
                const totalCost = inputValue * localeData.length;
                const updatedFunds = availableFunds - totalCost;

                const updatedFundsElement = jQuery("#updatedFunds");
                const warningMessageElement = jQuery("#warningMessage");
                const insufficientFundsListElement = jQuery("#insufficientFundsList");

                updatedFundsElement.text(updatedFunds.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + " M$");

                if (updatedFunds < 0) {
                    updatedFundsElement.css("color", "red");
                    warningMessageElement.show();
                } else {
                    updatedFundsElement.css("color", "");
                    warningMessageElement.hide();
                }

                // Yetersiz bakiyeli lokasyonları kontrol et
                insufficientFundsListElement.empty();
                if (inputValue < 0) {
                    localeData.forEach(locale => {
                        const projectedFunds = locale.moneyAvailable + inputValue;
                        if (projectedFunds < 0) {
                            insufficientFundsListElement.append(jQuery("<li>").text(`${locale.localeName} için yeterli bakiye yok.`));
                        }
                    });
                }
            });
        }
    });
})();
