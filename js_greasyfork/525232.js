// ==UserScript==
// @name         Fz Anlatım
// @namespace    http://tampermonkey.net/
// @version      31.1
// @description  Flipper Zero benzeri cihaz yapımı hakkında anlatım
// @author       Paxera
// @match        none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525232/Fz%20Anlat%C4%B1m.user.js
// @updateURL https://update.greasyfork.org/scripts/525232/Fz%20Anlat%C4%B1m.meta.js
// ==/UserScript==

// Flipper Zero gibi bir cihaz yapmak aslında birkaç temel parçayı bir araya getirmekten ibaret.
// Yani piyasada zaten var olan parçaları alıp bunları bir kart üzerinde birleştireceksin ve 
// hepsini kontrol eden bir yazılım yazacaksın. Şimdi adım adım anlatıyorum.

document.write(`
    <div id="mesaj"></div>

    <script>
        document.getElementById("mesaj").innerHTML = "<h2>Cihazın Temel Mantığı Nedir?</h2>"
        + "<p>Flipper Zero gibi cihazların yaptığı şey şu: Etraftaki kablosuz sinyalleri dinleyip analiz etmek, "
        + "bazen de bu sinyalleri tekrar göndermek. Bunu yapmak için içinde farklı modüller var:</p>"
        + "<ul>"
        + "<li><b>RF Modülü:</b> Radyo sinyallerini dinleyip göndermek için</li>"
        + "<li><b>NFC/RFID Modülü:</b> Kartları okuyup klonlamak için</li>"
        + "<li><b>Kızılötesi Modülü:</b> Uzaktan kumanda sinyallerini kaydedip tekrar göndermek için</li>"
        + "<li><b>Ekran ve Kontroller:</b> Kullanıcı arayüzü için</li>"
        + "<li><b>Mikrodenetleyici:</b> Bütün bu parçaları yöneten beyin</li>"
        + "</ul>";

        document.getElementById("mesaj").innerHTML += "<h3>2. Donanımı Seç ve Birleştir</h3>"
        + "<p>Cihazı yapmak için temel olarak şu parçalara ihtiyacın var:</p>"
        + "<ul>"
        + "<li><b>Mikrodenetleyici:</b> ESP32 veya STM32</li>"
        + "<li><b>Radyo Frekansı (RF) Modülü:</b> CC1101 çipi</li>"
        + "<li><b>NFC/RFID Modülü:</b> PN532 veya MFRC522</li>"
        + "<li><b>Kızılötesi (IR) Modülü:</b> TSOP38238 IR alıcı ve IR LED</li>"
        + "<li><b>Ekran ve Kontroller:</b> OLED ekran (128x64, I2C destekli) ve joystick / butonlar</li>"
        + "<li><b>Batarya ve Güç Yönetimi:</b> LiPo batarya (3.7V, 1000mAh) + TP4056 şarj modülü</li>"
        + "</ul>";

        document.getElementById("mesaj").innerHTML += "<h3>3. Donanımı Montajla ve PCB Tasarla</h3>"
        + "<p>Bu modülleri birbirine bağlamanın iki yolu var:</p>"
        + "<ol>"
        + "<li>Breadboard ve jumper kablolar ile test et</li>"
        + "<li>PCB tasarla ve lehimle (KiCad veya EasyEDA ile)</li>"
        + "</ol>";

        document.getElementById("mesaj").innerHTML += "<h3>4. Yazılım Geliştirme</h3>"
        + "<p>ESP32 veya STM32 için C/C++ ile bir yazılım geliştirmen lazım.</p>";

        document.getElementById("mesaj").innerHTML += "<h3>5. Test Et ve Geliştir</h3>"
        + "<p>RF modülü, NFC kart okuma, kızılötesi klonlama, ekran ve kontrolleri tek tek test et.</p>";

        document.getElementById("mesaj").innerHTML += "<h3>6. Kasayı Yap ve Son Haline Getir</h3>"
        + "<p>3D yazıcı ile kasa basabilirsin.</p>";

        document.getElementById("mesaj").innerHTML += "<h2>Sonuç</h2>"
        + "<p>Flipper Zero gibi bir cihaz yapmak, birkaç elektronik modülü bir araya getirip bir yazılımla yönetmekten ibaret.</p>";
    </script>
`);