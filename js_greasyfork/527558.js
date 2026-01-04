// ==UserScript==
// @name         Add Code Copy Button at GreasyFork Site
// @name:zh-CN   在GreasyFork网站添加代码复制按钮
// @name:zh-TW   在GreasyFork網站添加代碼複製按鈕
// @name:ja      GreasyForkサイトにコードコピーボタンを追加
// @name:ko      GreasyFork 사이트에 "코드 복사" 버튼 추가
// @name:ru      Добавить кнопку "Копировать код" на сайте GreasyFork
// @name:es      Añadir un botón "Copiar código" en el sitio GreasyFork
// @name:fr      Ajouter un bouton "Copier le code" sur le site GreasyFork
// @name:de      Einen "Code kopieren"-Button auf der GreasyFork-Seite hinzufügen
// @name:it      Aggiungi un pulsante "Copia codice" sul sito GreasyFork
// @name:pt-BR   Adicionar um botão "Copiar código" no site GreasyFork
// @name:pt      Adicionar um botão "Copiar código" no site GreasyFork
// @name:ar      إضافة زر "نسخ الكود" في موقع GreasyFork
// @name:hi      GreasyFork साइट पर "कोड कॉपी करें" बटन जोड़ें
// @name:tr      GreasyFork sitesine "Kodu Kopyala" düğmesi ekle
// @name:vi      Thêm nút "Sao chép mã" vào trang GreasyFork
// @name:th      เพิ่มปุ่ม "คัดลอกโค้ด" ในเว็บไซต์ GreasyFork
// @name:pl      Dodaj przycisk "Kopiuj kod" na stronie GreasyFork
// @name:nl      Voeg een knop "Code kopiëren" toe op de GreasyFork-site
// @name:sv      Lägg till en knapp "Kopiera kod" på GreasyFork-webbplatsen
// @name:da      Tilføj en knap "Kopiér kode" på GreasyFork-siden
// @name:fi      Lisää painike "Kopioi koodi" GreasyFork-sivustolle
// @name:no      Legg til en knapp "Kopier kode" på GreasyFork-nettstedet
// @name:el      Προσθήκη κουμπιού "Αντιγραφή κώδικα" στον ιστότοπο GreasyFork
// @name:he      הוסף כפתור "העתק קוד" לאתר GreasyFork
// @name:cs      Přidejte tlačítko „Kopírovat kód“ na stránku GreasyFork
// @name:hu      Adjon hozzá egy „Kód másolása” gombot a GreasyFork webhelyhez
// @name:ro      Adăugați un buton „Copiază codul” pe site-ul GreasyFork
// @name:id      Tambahkan tombol "Salin kode" di situs GreasyFork
// @name:ms      Tambah butang "Salin kod" di laman GreasyFork
// @name:uk      Додайте кнопку "Копіювати код" на сайті GreasyFork
// @name:bg      Добавете бутон "Копирай кода" на сайта GreasyFork
// @namespace    http://tampermonkey.net/
// @version      1.0.2.6
// @description  Adds a "复制代码" button next to the "安装此脚本" button, imitating its style.
// @description:zh-CN  在“安装此脚本”按钮旁添加一个“复制代码”按钮，模仿其样式。
// @description:zh-TW  在“安裝此腳本”按鈕旁添加一個“複製代碼”按鈕，模仿其樣式。
// @description:ja     「このスクリプトをインストール」ボタンの横に「コードをコピー」ボタンを追加し、そのスタイルを模倣します。
// @description:ko     "이 스크립트 설치" 버튼 옆에 "코드 복사" 버튼을 추가하며, 그 스타일을 모방합니다。
// @description:ru     Добавляет кнопку "Копировать код" рядом с кнопкой "Установить этот скрипт", повторяя её стиль.
// @description:es     Añade un botón "Copiar código" junto al botón "Instalar este script", imitando su estilo.
// @description:fr     Ajoute un bouton "Copier le code" à côté du bouton "Installer ce script", en imitant son style.
// @description:de     Fügt einen "Code kopieren"-Button neben den "Dieses Skript installieren"-Button hinzu und imitiert dessen Stil.
// @description:it     Aggiunge un pulsante "Copia codice" accanto al pulsante "Installa questo script", imitando il suo stile.
// @description:pt-BR  Adiciona um botão "Copiar código" ao lado do botão "Instalar este script", imitando seu estilo.
// @description:pt     Adiciona um botão "Copiar código" ao lado do botão "Instalar este script", imitando seu estilo.
// @description:ar     يضيف زر "نسخ الكود" بجانب زر "تثبيت هذا السكربت"، مقلدًا أسلوبه.
// @description:hi     "इस स्क्रिप्ट को इंस्टॉल करें" बटन के बगल में "कोड कॉपी करें" बटन जोड़ता है, इसकी शैली की नकल करता है。
// @description:tr     "Bu betiği yükle" düğmesinin yanına "Kodu Kopyala" düğmesi ekler ve stilini taklit eder.
// @description:vi     Thêm nút "Sao chép mã" bên cạnh nút "Cài đặt tập lệnh này", bắt chước phong cách của nó.
// @description:th     เพิ่มปุ่ม "คัดลอกโค้ด" ถัดจากปุ่ม "ติดตั้งสคริปต์นี้" โดยเลียนแบบสไตล์ของมัน
// @description:pl     Dodaje przycisk „Kopiuj kod” obok przycisku „Zainstaluj ten skrypt”, naśladując jego styl.
// @description:nl     Voegt een knop "Code kopiëren" toe naast de knop "Dit script installeren" en imiteert de stijl ervan.
// @description:sv     Lägger till en knapp "Kopiera kod" bredvid knappen "Installera detta skript" och imiterar dess stil.
// @description:da     Tilføjer en knap "Kopiér kode" ved siden af "Installer dette script"-knappen og efterligner dens stil.
// @description:fi     Lisää "Kopioi koodi" -painikkeen "Asenna tämä skripti" -painikkeen viereen ja jäljittelee sen tyyliä.
// @description:no     Legger til en knapp "Kopier kode" ved siden av "Installer dette skriptet"-knappen, og etterligner stilen.
// @description:el     Προσθέτει ένα κουμπί "Αντιγραφή κώδικα" δίπλα στο κουμπί "Εγκατάσταση αυτού του σεναρίου", μιμούμενο το στυλ του.
// @description:he     מוסיף כפתור "העתק קוד" ליד הכפתור "התקן סקריפט זה", מחקה את הסגנון שלו.
// @description:cs     Přidává tlačítko „Kopírovat kód“ vedle tlačítka „Nainstalovat tento skript“ a napodobuje jeho styl.
// @description:hu     Hozzáad egy „Kód másolása” gombot a „Telepítse ezt a szkriptet” gomb mellé, utánozva annak stílusát.
// @description:ro     Adaugă un buton „Copiază codul” lângă butonul „Instalează acest script”, imitând stilul acestuia.
// @description:id     Menambahkan tombol "Salin kode" di samping tombol "Pasang skrip ini", meniru gayanya.
// @description:ms     Menambah butang "Salin kod" di sebelah butang "Pasang skrip ini", meniru gayanya.
// @description:uk     Додає кнопку "Копіювати код" поруч із кнопкою "Встановити цей скрипт", наслідуючи її стиль.
// @description:bg     Добавя бутон "Копирай кода" до бутона "Инсталирай този скрипт", имитирайки стила му.
// @author       aspen138
// @license      MIT
// @match        https://greasyfork.org/*/scripts/*/code
// @match        https://sleazyfork.org/*/scripts/*/code
// @match        https://greasyfork.org/*/scripts/*/code?locale_override=1
// @match        https://sleazyfork.org/*/scripts/*/code?locale_override=1
// @icon         data:image/png;base64,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
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/527558/Add%20Code%20Copy%20Button%20at%20GreasyFork%20Site.user.js
// @updateURL https://update.greasyfork.org/scripts/527558/Add%20Code%20Copy%20Button%20at%20GreasyFork%20Site.meta.js
// ==/UserScript==


//轻提醒
function Toast(msg, duration) {
    let p1 = new Promise((resolve, reject) => {
        duration = isNaN(duration) ? 3000 : duration;
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText = "font-family:siyuan;max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        document.body.appendChild(m);
        setTimeout(function() {
            var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function() {
                document.body.removeChild(m)
            }, d * 1000);
        }, duration);
    });
}

(function() {
    'use strict';

    // Internationalization strings
    const i18n = {
        'en': {
            copyCode: 'Copy Code',
            codeNotFound: 'Code element not found!',
            codeCopied: 'Code copied to clipboard!'
        },
        'zh-CN': {
            copyCode: '复制代码',
            codeNotFound: '代码元素未找到！',
            codeCopied: '代码已复制到剪贴板！'
        },
        'zh-TW': {
            copyCode: '複製代碼',
            codeNotFound: '代碼元素未找到！',
            codeCopied: '代碼已複製到剪貼簿！'
        },
        'ja': {
            copyCode: 'コードをコピー',
            codeNotFound: 'コード要素が見つかりません！',
            codeCopied: 'コードをクリップボードにコピーしました！'
        },
        'fr': {
            copyCode: 'Copier le code',
            codeNotFound: 'Élément de code introuvable !',
            codeCopied: 'Code copié dans le presse-papiers !'
        },
        'fr-CA': {
            copyCode: 'Copier le code',
            codeNotFound: 'Élément de code introuvable !',
            codeCopied: 'Code copié dans le presse-papiers !'
        },
        'es': {
            copyCode: 'Copiar código',
            codeNotFound: '¡Elemento de código no encontrado!',
            codeCopied: '¡Código copiado al portapapeles!'
        },
        'es-419': {
            copyCode: 'Copiar código',
            codeNotFound: '¡No se encontró el elemento de código!',
            codeCopied: '¡Código copiado al portapapeles!'
        },
        'de': {
            copyCode: 'Code kopieren',
            codeNotFound: 'Code-Element nicht gefunden!',
            codeCopied: 'Code in die Zwischenablage kopiert!'
        },
        'ru': {
            copyCode: 'Копировать код',
            codeNotFound: 'Элемент кода не найден!',
            codeCopied: 'Код скопирован в буфер обмена!'
        },
        'it': {
            copyCode: 'Copia codice',
            codeNotFound: 'Elemento del codice non trovato!',
            codeCopied: 'Codice copiato negli appunti!'
        },
        'ko': {
            copyCode: '코드 복사',
            codeNotFound: '코드 요소를 찾을 수 없습니다!',
            codeCopied: '코드가 클립보드에 복사되었습니다!'
        },
        'pt-BR': {
            copyCode: 'Copiar código',
            codeNotFound: 'Elemento de código não encontrado!',
            codeCopied: 'Código copiado para a área de transferência!'
        },
        'ar': {
            copyCode: 'نسخ الكود',
            codeNotFound: 'عنصر الكود غير موجود!',
            codeCopied: 'تم نسخ الكود إلى الحافظة!'
        },
        'be': {
            copyCode: 'Скапіраваць код',
            codeNotFound: 'Элемент кода не знойдзены!',
            codeCopied: 'Код скапіраваны ў буфер абмену!'
        },
        'bg': {
            copyCode: 'Копирай кода',
            codeNotFound: 'Елементът на кода не е намерен!',
            codeCopied: 'Кодът е копиран в клипборда!'
        },
        'ckb': {
            copyCode: 'کۆد لەبەرگرتنەوە',
            codeNotFound: 'توخمەی کۆد نەدۆزرایەوە!',
            codeCopied: 'کۆد کۆپی کرا بۆ کلیپ‌بۆرد!'
        },
        'cs': {
            copyCode: 'Kopírovat kód',
            codeNotFound: 'Prvek kódu nebyl nalezen!',
            codeCopied: 'Kód zkopírován do schránky!'
        },
        'da': {
            copyCode: 'Kopiér kode',
            codeNotFound: 'Kodeelement blev ikke fundet!',
            codeCopied: 'Koden er kopieret til udklipsholderen!'
        },
        'el': {
            copyCode: 'Αντιγραφή κώδικα',
            codeNotFound: 'Το στοιχείο κώδικα δεν βρέθηκε!',
            codeCopied: 'Ο κώδικας αντιγράφηκε στο πρόχειρο!'
        },
        'eo': {
            copyCode: 'Kopii kodon',
            codeNotFound: 'Koda elemento ne trovita!',
            codeCopied: 'Kodo kopiita al tondujo!'
        },
        'fi': {
            copyCode: 'Kopioi koodi',
            codeNotFound: 'Koodielementtiä ei löytynyt!',
            codeCopied: 'Koodi kopioitu leikepöydälle!'
        },
        'he': {
            copyCode: 'העתק קוד',
            codeNotFound: 'אלמנט הקוד לא נמצא!',
            codeCopied: 'הקוד הועתק ללוח!'
        },
        'hr': {
            copyCode: 'Kopiraj kôd',
            codeNotFound: 'Element koda nije pronađen!',
            codeCopied: 'Kôd kopiran u međuspremnik!'
        },
        'hu': {
            copyCode: 'Kód másolása',
            codeNotFound: 'A kódelem nem található!',
            codeCopied: 'Kód vágólapra másolva!'
        },
        'id': {
            copyCode: 'Salin Kode',
            codeNotFound: 'Elemen kode tidak ditemukan!',
            codeCopied: 'Kode disalin ke papan klip!'
        },
        'ka': {
            copyCode: 'კოდის კოპირება',
            codeNotFound: 'კოდის ელემენტი ვერ მოიძებნა!',
            codeCopied: 'კოდი დაკოპირდა ბუფერში!'
        },
        'mr': {
            copyCode: 'कोड कॉपी करा',
            codeNotFound: 'कोड घटक सापडला नाही!',
            codeCopied: 'कोड क्लिपबोर्डवर कॉपी केला!'
        },
        'nb': {
            copyCode: 'Kopier kode',
            codeNotFound: 'Kodeelement ikke funnet!',
            codeCopied: 'Kode kopiert til utklippstavlen!'
        },
        'nl': {
            copyCode: 'Code kopiëren',
            codeNotFound: 'Code-element niet gevonden!',
            codeCopied: 'Code gekopieerd naar klembord!'
        },
        'pl': {
            copyCode: 'Kopiuj kod',
            codeNotFound: 'Nie znaleziono elementu kodu!',
            codeCopied: 'Kod skopiowano do schowka!'
        },
        'ro': {
            copyCode: 'Copiază codul',
            codeNotFound: 'Elementul de cod nu a fost găsit!',
            codeCopied: 'Cod copiat în clipboard!'
        },
        'sk': {
            copyCode: 'Skopírovať kód',
            codeNotFound: 'Prvok kódu sa nenašiel!',
            codeCopied: 'Kód skopírovaný do schránky!'
        },
        'sr': {
            copyCode: 'Копирај код',
            codeNotFound: 'Елемент кода није пронађен!',
            codeCopied: 'Код је копиран у клипборд!'
        },
        'sv': {
            copyCode: 'Kopiera kod',
            codeNotFound: 'Kodelement hittades inte!',
            codeCopied: 'Kod kopierad till urklipp!'
        },
        'th': {
            copyCode: 'คัดลอกรหัส',
            codeNotFound: 'ไม่พบองค์ประกอบโค้ด!',
            codeCopied: 'คัดลอกรหัสไปยังคลิปบอร์ดแล้ว!'
        },
        'tr': {
            copyCode: 'Kodu kopyala',
            codeNotFound: 'Kod öğesi bulunamadı!',
            codeCopied: 'Kod panoya kopyalandı!'
        },
        'uk': {
            copyCode: 'Скопіювати код',
            codeNotFound: 'Елемент коду не знайдено!',
            codeCopied: 'Код скопійовано до буфера обміну!'
        },
        'ug': {
            copyCode: 'كود كۆچۈرۈش',
            codeNotFound: 'كود ئەزاسى تېپىلمىدى!',
            codeCopied: 'كود چاپلاش تاختىسىغا كۆچۈرۈلدى!'
        },
        'vi': {
            copyCode: 'Sao chép mã',
            codeNotFound: 'Không tìm thấy phần tử mã!',
            codeCopied: 'Đã sao chép mã vào clipboard!'
        }
    };

    // Function to detect current page language
    function detectLanguage() {
        // Try to get language from URL path
        const urlMatch = window.location.pathname.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)\//);
        if (urlMatch) {
            return urlMatch[1];
        }

        // Try to get from HTML lang attribute
        const htmlLang = document.documentElement.lang;
        if (htmlLang && i18n[htmlLang]) {
            return htmlLang;
        }

        // Try to get from browser language
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang && i18n[browserLang]) {
            return browserLang;
        }

        // Check for simplified Chinese language codes
        if (browserLang && (browserLang.startsWith('zh-CN') || browserLang === 'zh')) {
            return 'zh-CN';
        }

        // Check for traditional Chinese
        if (browserLang && (browserLang.startsWith('zh-TW') || browserLang.startsWith('zh-HK'))) {
            return 'zh-TW';
        }

        // Default to English
        return 'en';
    }

    // Get current language
    const currentLang = detectLanguage();
    const strings = i18n[currentLang] || i18n['en'];

    // Optional: add some basic styling for the copy button, if needed.
    // We replicate the "install-link" style from the example.
    GM_addStyle(`
    .install-link.copy-button {
      margin-left: 8px;
      text-decoration: none;
      display: inline-block;
      padding: 0.5em 1em;
      border-radius: 4px;
      background: #449d44;
      color: #fff !important;
      transition: background-color 0.2s ease-in-out;
    }
    .install-link.copy-button:hover {
      background: #398439;
    }
  `);

    // A small helper to safely query elements by selector
    function $(selector, parent = document) {
        return parent.querySelector(selector);
    }

    // Wait until the page is fully loaded
    window.addEventListener('load', () => {
        // 1. Find the parent area that contains the "安装此脚本" button
        const installArea = $('#install-area');
        if (!installArea) return;

        // 2. Create a new button to copy the code
        const copyBtn = document.createElement('a');
        copyBtn.classList.add('install-link', 'copy-button');
        copyBtn.href = 'javascript:void(0)';
        copyBtn.textContent = strings.copyCode;

        // 3. Insert this copy button to the right of the existing button
        installArea.appendChild(copyBtn);

        // 4. When user clicks the copy button, grab code from .code-container
        copyBtn.addEventListener('click', () => {
            // Retrieve the code text from the <pre> element
            const codePre = $('.code-container pre');
            if (!codePre) {
                alert(strings.codeNotFound);
                return;
            }

            // The innerText should contain the displayed code
            const codeText = codePre.innerText || '';

            // Put this text into the clipboard
            GM_setClipboard(codeText);

            // Provide some user feedback
            Toast(strings.codeCopied, 1000);
        });
    });
})();