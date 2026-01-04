// ==UserScript==
// @name         Tw piç arası
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Eğer ping süreniz 100ms civarındaysa, isteğin sunucuya ulaşması + yanıt alması yaklaşık 100-200ms sürebilir.Bu yüzden, ping süresini düşürmek en önemli faktörlerden biridir.Kablolu bağlantı kullanmak (Wi-Fi yerine).Sunucuya daha yakın bir VPN veya düşük gecikmeli bir DNS servisi (Cloudflare 1.1.1.1 veya Google 8.8.8.8) kullanmak.Arka planda interneti kullanan diğer programları kapatmak gerekebilir. İşlem yapmadan önce test ediniz ve ping değerinizi ölçerek ms cinsinden hesaptan düşünüz.
// @match        https://tr93.klanlar.org/game.php?*screen=place*&try=confirm*
// @author       berigel
// @grant        GM_getValue
// @grant        GM_setValue
// @lisans      berigel
// @downloadURL https://update.greasyfork.org/scripts/531030/Tw%20pi%C3%A7%20aras%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/531030/Tw%20pi%C3%A7%20aras%C4%B1.meta.js
// ==/UserScript==

(function() {
    "use strict";

    let timeouts = []; // Her görev için setTimeout ID'si tutacağız

    /* ----------------------------------
       Ayarların Yönetimi
    -------------------------------------*/
    function loadSettings() {
        const data = GM_getValue("supportSettings");
        return data ? JSON.parse(data) : [];
    }
    function saveSettings(settings) {
        GM_setValue("supportSettings", JSON.stringify(settings));
    }

    /* ----------------------------------
       Zaman Parse Fonksiyonları
    -------------------------------------*/
    function parseArrivalTime(dateStr, timeStr) {
        dateStr = dateStr.trim();
        timeStr = timeStr.trim();
        if (!dateStr) {
            const now = new Date();
            dateStr = now.toISOString().split("T")[0];
        }
        const dateParts = dateStr.split("-");
        if (dateParts.length !== 3) {
            console.error("Geçersiz tarih formatı!");
            return null;
        }
        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const day = parseInt(dateParts[2], 10);

        const parts = timeStr.split(":");
        if (parts.length < 3) {
            console.error("Eksik varış saati formatı!");
            return null;
        }
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        const seconds = parseInt(parts[2], 10);
        const milliseconds = parts[3] ? parseInt(parts[3], 10) : 0;

        return new Date(year, month, day, hours, minutes, seconds, milliseconds).getTime();
    }
    function parseTravelTime(timeStr) {
        const parts = timeStr.split(":");
        if (parts.length < 2) {
            console.error("Eksik seyahat süresi formatı!");
            return 0;
        }
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        const seconds = parts.length >= 3 ? parseInt(parts[2], 10) : 0;
        return (hours * 3600 + minutes * 60 + seconds) * 1000;
    }
    function getSendTime(arrivalDate, arrivalTime, travelStr) {
        const arrivalTimestamp = parseArrivalTime(arrivalDate, arrivalTime);
        const travelTimeMs = parseTravelTime(travelStr);
        if (arrivalTimestamp === null) return null;
        return arrivalTimestamp - travelTimeMs;
    }

    function formatTurkeyTime(date) {
        const turkeyOffset = 3 * 60; // UTC+3
        const turkeyDate = new Date(date.getTime() + turkeyOffset * 60 * 1000);
        return turkeyDate.toISOString().replace("Z", " (Türkiye Saati)");
    }

    /* ----------------------------------
       Onay İşlemi
    -------------------------------------*/
    function confirmSend() {
        const confirmButton = document.querySelector("#troop_confirm_submit");
        if (confirmButton && !confirmButton.disabled) {
            console.log("Askerler gönderiliyor: " + formatTurkeyTime(new Date()));
            confirmButton.click();
        } else {
            console.log("HATA: Onay butonu bulunamadı veya devre dışı!");
        }
    }

    /* ----------------------------------
       Modern Arayüz Oluşturma
    -------------------------------------*/
    function createUI() {
        if (document.getElementById("supportUI")) return;

        const container = document.createElement("div");
        container.id = "supportUI";
        container.innerHTML = `
            <div class="su-header">
                <h3>Asker Gönderme Ayarları</h3>
                <button id="su-close" title="Kapat">&times;</button>
            </div>
            <div id="missionList"></div>
            <div class="su-controls">
                <button id="addMission">Yeni Ayar Ekle</button>
                <button id="saveAll">Kaydet</button>
            </div>
            <div class="su-hint">
                <small>
                    Varış Tarihi: <strong>(takvimden seç)</strong><br>
                    Varış Saati: <strong>HH:MM:SS:MS</strong> (örn. 23:57:09:285)<br>
                    Seyahat Süresi: <strong>H:MM:SS</strong> (örn. 1:10:59)
                </small>
            </div>
        `;
        document.body.appendChild(container);

        const style = document.createElement("style");
        style.textContent = `
            #supportUI {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 380px;
                background: #f9f9f9;
                border: 1px solid #ccc;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                border-radius: 4px;
                padding: 15px;
                font-family: Arial, sans-serif;
                z-index: 10000;
            }
            .su-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #ddd;
                margin-bottom: 10px;
            }
            .su-header h3 {
                margin: 0;
                font-size: 18px;
                color: #333;
            }
            #su-close {
                background: transparent;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #999;
            }
            .missionRow {
                margin-bottom: 10px;
                padding: 8px;
                background: #fff;
                border: 1px solid #ddd;
                border-radius: 4px;
                position: relative;
            }
            label {
                display: block;
                margin-bottom: 5px;
                font-size: 14px;
                color: #555;
            }
            input[type="text"],
            input[type="date"] {
                width: calc(100% - 10px);
                padding: 4px;
                font-size: 14px;
                margin-bottom: 5px;
                border: 1px solid #ccc;
                border-radius: 3px;
            }
            .deleteRow {
                background: #e74c3c;
                border: none;
                color: #fff;
                padding: 4px 8px;
                font-size: 12px;
                border-radius: 3px;
                cursor: pointer;
                position: absolute;
                top: 8px;
                right: 8px;
            }
            .su-controls {
                text-align: right;
                margin-top: 10px;
            }
            .su-controls button {
                background: #3498db;
                border: none;
                color: #fff;
                padding: 6px 12px;
                margin-left: 5px;
                font-size: 14px;
                border-radius: 3px;
                cursor: pointer;
            }
            .su-hint {
                margin-top: 10px;
                font-size: 12px;
                color: #777;
                text-align: center;
            }
            .sendTimeDisplay {
                font-size: 13px;
                color: #2c3e50;
                margin-top: 4px;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);

        document.getElementById("su-close").addEventListener("click", () => {
            container.style.display = "none";
        });
        document.getElementById("addMission").addEventListener("click", () => {
            addMissionRow();
        });
        document.getElementById("saveAll").addEventListener("click", () => {
            const settings = [];
            const rows = document.querySelectorAll(".missionRow");
            rows.forEach(row => {
                const arrivalDate = row.querySelector(".arrivalDate").value.trim();
                const arrivalTime = row.querySelector(".arrivalTime").value.trim();
                const travel = row.querySelector(".travelTime").value.trim();
                settings.push({ arrivalDate, arrivalTime, travelTime: travel });
            });
            saveSettings(settings);
            // Tekrar setTimeout kurmak için
            scheduleAllTimeouts(settings);
            alert("Ayarlar kaydedildi!");
        });
        loadMissionRows();
    }

    // Görev satırlarını oluşturur
    function loadMissionRows() {
        const missionList = document.getElementById("missionList");
        missionList.innerHTML = "";
        const settings = loadSettings();
        settings.forEach(setting => {
            addMissionRow(setting);
        });
        // Ayarlar yüklendiğinde setTimeout kur
        scheduleAllTimeouts(settings);
    }

    function addMissionRow(setting = { arrivalDate: "", arrivalTime: "", travelTime: "" }) {
        const missionList = document.getElementById("missionList");
        const row = document.createElement("div");
        row.className = "missionRow";
        const today = new Date().toISOString().split("T")[0];
        row.innerHTML = `
            <label>Varış Tarihi:</label>
            <input type="date" class="arrivalDate" value="${setting.arrivalDate || today}">
            <label>Varış Saati:</label>
            <input type="text" class="arrivalTime" placeholder="23:57:09:285" value="${setting.arrivalTime}">
            <label>Seyahat Süresi:</label>
            <input type="text" class="travelTime" placeholder="1:10:59" value="${setting.travelTime}">
            <div class="sendTimeDisplay">Gönderim Saati: Hesaplanamadı</div>
            <button class="deleteRow" title="Sil">Sil</button>
        `;
        missionList.appendChild(row);
        row.querySelector(".deleteRow").addEventListener("click", () => row.remove());
    }

    // Mevcut timeouts'ları temizle, yeni timeouts kur
    function scheduleAllTimeouts(settings) {
        // Önce eski timeouts temizle
        timeouts.forEach(t => clearTimeout(t));
        timeouts = [];

        // Her görev için setTimeout ayarla
        const now = Date.now();
        settings.forEach(setting => {
            if (!setting.arrivalDate || !setting.arrivalTime || !setting.travelTime) return;
            const sendTime = getSendTime(setting.arrivalDate, setting.arrivalTime, setting.travelTime);
            if (sendTime === null) return;

            const diff = sendTime - now;
            if (diff > 0) {
                // Gönderim saati gelecek bir zaman
                const timeoutId = setTimeout(() => {
                    console.log(
                        "Gönderme zamanı geldi (" +
                        setting.arrivalDate + " " + setting.arrivalTime +
                        " - " + setting.travelTime + "): " + formatTurkeyTime(new Date())
                    );
                    confirmSend();
                }, diff);
                timeouts.push(timeoutId);
            } else {
                // Gönderim saati geçmişse (bugünün saatinden önce)
                console.log("Uyarı: Bir görev geçmiş zaman ayarlı görünüyor. " + JSON.stringify(setting));
            }
        });
    }

    // Her satırdaki "Gönderim Saati" bilgisini güncelle
    function updateSendTimeDisplay() {
        const rows = document.querySelectorAll(".missionRow");
        rows.forEach(row => {
            const arrivalDate = row.querySelector(".arrivalDate").value.trim();
            const arrivalTime = row.querySelector(".arrivalTime").value.trim();
            const travel = row.querySelector(".travelTime").value.trim();
            const display = row.querySelector(".sendTimeDisplay");
            if (arrivalDate && arrivalTime && travel) {
                const sendTime = getSendTime(arrivalDate, arrivalTime, travel);
                if (sendTime !== null) {
                    display.textContent = "Gönderim Saati: " + formatTurkeyTime(new Date(sendTime));
                } else {
                    display.textContent = "Gönderim Saati: Hesaplanamadı";
                }
            } else {
                display.textContent = "Gönderim Saati: Bilgiler eksik";
            }
        });
    }

    // Sayfa yüklendiğinde
    const url = window.location.href;
    if (url.includes("screen=place") && url.includes("try=confirm")) {
        createUI();
        console.log("Script başlatıldı (Onay Sayfası): " + formatTurkeyTime(new Date()));

        // Her 500ms, satırlardaki "Gönderim Saati"ni güncelle
        setInterval(() => {
            updateSendTimeDisplay();
        }, 500);

    } else {
        console.log("HATA: Doğru sayfada değilsiniz! 'Asker Gönderme Onayı' ekranını açın.");
    }
})();
