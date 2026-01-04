// ==UserScript==

// @name         Tw piç arası

// @namespace    http://violentmonkey.github.io/

// @version      1.15

// @description  Eğer ping süreniz 100ms civarındaysa, isteğin sunucuya ulaşması + yanıt alması yaklaşık 100-200ms sürebilir. Bu yüzden, ping süresini düşürmek en önemli faktörlerden biridir. Kablolu bağlantı kullanmak (Wi-Fi yerine). Sunucuya daha yakın bir VPN veya düşük gecikmeli bir DNS servisi (Cloudflare 1.1.1.1 veya Google 8.8.8.8) kullanmak. Arka planda interneti kullanan diğer programları kapatmak gerekebilir. İşlem yapmadan önce test ediniz ve ping değerinizi ölçerek ms cinsinden hesaptan düşünüz.

// @match        https://tr93.klanlar.org/game.php?screen=place&try=confirm*

// @author       berigel

// @grant        GM_getValue

// @grant        GM_setValue

// @license      berigel

// @downloadURL https://update.greasyfork.org/scripts/531087/Tw%20pi%C3%A7%20aras%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/531087/Tw%20pi%C3%A7%20aras%C4%B1.meta.js
// ==/UserScript==

(function() {

"use strict";



let timeouts = []; // Her görev için setTimeout ID'si tutacağız

let currentUserPing = 0; // Kullanıcı pingi (RTT)

let lastKnownUserPing = 0; // Ping değişimini kontrol etmek için

let currentServerLatency = 0; // Sunucu latency (RTT/2)

let lastKnownServerLatency = 0; // Sunucu latency değişimini kontrol etmek için

let settings = []; // Görev ayarlarını global olarak saklayacağız

let manualServerLatency = null; // Manuel sunucu latency

let manualAdjustment = 0; // Manuel gecikme düzeltme



/* ----------------------------------

   Ayarların ve Manuel Değerlerin Yönetimi

-------------------------------------*/

function loadSettings() {

    const data = GM_getValue("supportSettings");

    return data ? JSON.parse(data) : [];

}

function saveSettings(settings) {

    GM_setValue("supportSettings", JSON.stringify(settings));

}

function loadManualValues() {

    const data = GM_getValue("manualValues", {});

    manualServerLatency = data.serverLatency !== undefined ? parseFloat(data.serverLatency) : null;

    manualAdjustment = data.adjustment !== undefined ? parseFloat(data.adjustment) : 0;

}

function saveManualValues() {

    GM_setValue("manualValues", {

        serverLatency: manualServerLatency,

        adjustment: manualAdjustment

    });

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

        console.error("Geçersiz tarih formatı: " + dateStr);

        return null;

    }

    const year = parseInt(dateParts[0], 10);

    const month = parseInt(dateParts[1], 10) - 1;

    const day = parseInt(dateParts[2], 10);



    const parts = timeStr.split(":");

    if (parts.length < 3) {

        console.error("Eksik varış saati formatı: " + timeStr);

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

        console.error("Eksik seyahat süresi formatı: " + timeStr);

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



    // Toplam gecikme: Kullanıcı pingi (RTT) + Sunucu latency (RTT/2) + Manuel düzeltme

    const totalDelay = currentUserPing + currentServerLatency + manualAdjustment;

    console.log(`Toplam gecikme: ${totalDelay}ms (Ping: ${currentUserPing}ms + Server Latency: ${currentServerLatency}ms + Adjustment: ${manualAdjustment}ms)`);

    return arrivalTimestamp - travelTimeMs - totalDelay; // Gecikme kadar öne çek

}



function formatTurkeyTime(date) {

    const turkeyOffset = 3 * 60; // UTC+3

    const turkeyDate = new Date(date.getTime() + turkeyOffset * 60 * 1000);

    return turkeyDate.toISOString().replace("Z", " (Türkiye Saati)");

}



/* ----------------------------------

   Onay İşlemi

-------------------------------------*/

function confirmSend(arrivalDate, arrivalTime, travelStr) {

    const confirmButton = document.querySelector("#troop_confirm_submit");

    if (confirmButton && !confirmButton.disabled) {

        const sendTime = new Date();

        console.log("Askerler gönderiliyor: " + formatTurkeyTime(sendTime));



        // Tahmini varış zamanını logla

        const travelTimeMs = parseTravelTime(travelStr);

        const estimatedArrival = new Date(sendTime.getTime() + travelTimeMs);

        console.log("Tahmini varış zamanı: " + formatTurkeyTime(estimatedArrival));

        console.log("Hedef varış zamanı: " + arrivalDate + " " + arrivalTime);



        confirmButton.click();

    } else {

        console.log("HATA: Onay butonu bulunamadı veya devre dışı!");

    }

}



/* ----------------------------------

   Kullanıcı Pingini Ölç (RTT)

-------------------------------------*/

async function measureUserPing() {

    const url = 'https://www.klanlar.org/favicon.ico'; // Küçük dosya ile ping ölçme

    const measurements = [];

    const numMeasurements = 5; // 5 ölçüm yap



    for (let i = 0; i < numMeasurements; i++) {

        const startTime = performance.now();

        try {

            await fetch(url, { method: 'HEAD', cache: 'no-store' });

            const endTime = performance.now();

            const pingTime = Math.round(endTime - startTime);

            measurements.push(pingTime);

            console.log(`Ping ölçümü ${i + 1}: ${pingTime}ms`);

        } catch (error) {

            console.error(`Ping ölçümü ${i + 1} başarısız: `, error);

            measurements.push(100); // Varsayılan değer

        }

        // Her ölçüm arasında kısa bir bekleme (100ms)

        await new Promise(resolve => setTimeout(resolve, 100));

    }



    // Ortalamayı hesapla

    const averagePing = Math.round(measurements.reduce((a, b) => a + b, 0) / measurements.length);

    console.log(`Ortalama kullanıcı pingi: ${averagePing}ms (Ölçümler: ${measurements.join(", ")})`);

    return averagePing;

}



/* ----------------------------------

   Sunucu Latency'sini Al (RTT/2)

-------------------------------------*/

function getServerLatency() {

    // Manuel değer varsa, onu kullan

    if (manualServerLatency !== null && !isNaN(manualServerLatency) && manualServerLatency >= 0) {

        console.log("Manuel sunucu latency kullanılıyor: " + manualServerLatency + "ms");

        return manualServerLatency;

    }



    console.log("Sunucu latency hesaplanamadı, varsayılan değer kullanılıyor.");

    return 50; // Varsayılan değer

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

            <button id="su-close" title="Kapat">×</button>

        </div>

        <div class="su-latency">

            <span>Kullanıcı Pingi (RTT): <strong id="userPingValue">Ölçülüyor...</strong></span><br>

            <span>Sunucu Latency (RTT/2): <strong id="serverLatencyValue">Hesaplanıyor...</strong></span><br>

            <span>Toplam Gecikme: <strong id="totalDelayValue">Hesaplanıyor...</strong></span><br>

            <label>Manuel Sunucu Latency (ms):</label>

            <input type="number" id="manualServerLatency" placeholder="Varsayılan: 50" step="0.1" min="0">

            <label>Manuel Gecikme Düzeltme (ms):</label>

            <input type="number" id="manualAdjustment" placeholder="Varsayılan: 0" step="0.1">

            <button id="applyManualValues">Uygula</button>

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

        .su-latency {

            margin-bottom: 10px;

            font-size: 14px;

            color: #555;

        }

        .su-latency strong {

            color: #e74c3c;

        }

        .su-latency label {

            display: block;

            margin-top: 5px;

            font-size: 14px;

            color: #555;

        }

        .su-latency input[type="number"] {

            width: calc(100% - 10px);

            padding: 4px;

            font-size: 14px;

            margin-bottom: 5px;

            border: 1px solid #ccc;

            border-radius: 3px;

        }

        .su-latency button {

            background: #3498db;

            border: none;

            color: #fff;

            padding: 4px 8px;

            font-size: 14px;

            border-radius: 3px;

            cursor: pointer;

            margin-top: 5px;

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



    // Manuel değerleri yükle ve input alanlarına yerleştir

    loadManualValues();

    const manualServerLatencyInput = document.getElementById("manualServerLatency");

    const manualAdjustmentInput = document.getElementById("manualAdjustment");

    if (manualServerLatency !== null) manualServerLatencyInput.value = manualServerLatency;

    manualAdjustmentInput.value = manualAdjustment;



    // "Uygula" butonu için olay dinleyici

    document.getElementById("applyManualValues").addEventListener("click", () => {

        const serverLatencyValue = parseFloat(manualServerLatencyInput.value);

        const adjustmentValue = parseFloat(manualAdjustmentInput.value);



        manualServerLatency = !isNaN(serverLatencyValue) && serverLatencyValue >= 0 ? serverLatencyValue : null;

        manualAdjustment = !isNaN(adjustmentValue) ? adjustmentValue : 0;



        saveManualValues();

        console.log("Manuel değerler uygulandı: Sunucu Latency: " + manualServerLatency + "ms, Gecikme Düzeltme: " + manualAdjustment + "ms");



        // Değerleri hemen güncelle

        updatePingAndLatencyDisplay();

        scheduleAllTimeouts(settings); // Zamanlayıcıları güncelle

    });



    document.getElementById("su-close").addEventListener("click", () => {

        container.style.display = "none";

    });

    document.getElementById("addMission").addEventListener("click", () => {

        addMissionRow();

    });

    document.getElementById("saveAll").addEventListener("click", () => {

        const newSettings = [];

        const rows = document.querySelectorAll(".missionRow");

        rows.forEach(row => {

            const arrivalDate = row.querySelector(".arrivalDate").value.trim();

            const arrivalTime = row.querySelector(".arrivalTime").value.trim();

            const travel = row.querySelector(".travelTime").value.trim();

            newSettings.push({ arrivalDate, arrivalTime, travelTime: travel });

        });

        settings = newSettings; // Global ayarları güncelle

        saveSettings(settings);

        scheduleAllTimeouts(settings);

        alert("Ayarlar kaydedildi!");

    });

    loadMissionRows();

}



// Görev satırlarını oluşturur

function loadMissionRows() {

    const missionList = document.getElementById("missionList");

    missionList.innerHTML = "";

    settings = loadSettings();

    settings.forEach(setting => {

        addMissionRow(setting);

    });

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

    timeouts.forEach(t => clearTimeout(t));

    timeouts = [];



    const now = Date.now();

    settings.forEach(setting => {

        if (!setting.arrivalDate || !setting.arrivalTime || !setting.travelTime) return;

        const sendTime = getSendTime(setting.arrivalDate, setting.arrivalTime, setting.travelTime);

        if (sendTime === null) return;



        const diff = sendTime - now;

        if (diff > 0) {

            const timeoutId = setTimeout(() => {

                console.log(

                    "Gönderme zamanı geldi (" +

                    setting.arrivalDate + " " + setting.arrivalTime +

                    " - " + setting.travelTime + "): " + formatTurkeyTime(new Date())

                );

                confirmSend(setting.arrivalDate, setting.arrivalTime, setting.travelTime);

            }, diff);

            timeouts.push(timeoutId);

        } else {

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



// Ping ve Latency'yi arayüzde güncelle ve zamanlayıcıyı yeniden ayarla

async function updatePingAndLatencyDisplay() {

    const userPingValue = document.getElementById("userPingValue");

    const serverLatencyValue = document.getElementById("serverLatencyValue");

    const totalDelayValue = document.getElementById("totalDelayValue");



    if (userPingValue && serverLatencyValue && totalDelayValue) {

        // Kullanıcı pingini ölç

        const newUserPing = await measureUserPing();

        userPingValue.textContent = newUserPing === 0 ? "Bilinmiyor" : `${newUserPing}ms`;



        // Sunucu latency'sini güncelle

        const newServerLatency = getServerLatency();

        serverLatencyValue.textContent = newServerLatency === 0 ? "Bilinmiyor" : `${newServerLatency}ms`;



        // Toplam gecikmeyi güncelle

        const totalDelay = newUserPing + newServerLatency + manualAdjustment;

        totalDelayValue.textContent = `${totalDelay}ms`;



        // Ping veya latency değiştiyse zamanlayıcıyı güncelle

        if ((newUserPing !== lastKnownUserPing && newUserPing !== 0) || 

            (newServerLatency !== lastKnownServerLatency && newServerLatency !== 0)) {

            console.log(`Değerler değişti: Ping ${lastKnownUserPing}ms -> ${newUserPing}ms, Server Latency ${lastKnownServerLatency}ms -> ${newServerLatency}ms. Zamanlayıcılar güncelleniyor...`);

            currentUserPing = newUserPing;

            lastKnownUserPing = newUserPing;

            currentServerLatency = newServerLatency;

            lastKnownServerLatency = newServerLatency;

            scheduleAllTimeouts(settings); // Yeni değerlerle zamanlayıcıyı güncelle

        }

    }

}



// Sayfa yüklendiğinde

const url = window.location.href;

if (url.includes("screen=place") && url.includes("try=confirm")) {

    createUI();

    console.log("Script başlatıldı (Onay Sayfası): " + formatTurkeyTime(new Date()));



    // İlk ölçümü yap ve periyodik olarak güncelle

    updatePingAndLatencyDisplay();

    setInterval(updatePingAndLatencyDisplay, 5000); // Her 5 saniyede bir ölç

} else {

    console.log("HATA: Doğru sayfada değilsiniz! 'Asker Gönderme Onayı' ekranını açın.");

}

})();

