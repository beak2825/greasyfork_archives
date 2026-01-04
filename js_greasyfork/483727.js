// ==UserScript==
// @name         GitHub的Commits记录相关的按钮外围加上黑色边框，并以蓝色字体和黄色背景高亮显示
// @name:en      GitHub's Commits Related Button: Black Border & Blue Text on Yellow
// @description  GitHub的Commits记录按钮外围加上黑色边框，并以蓝色字体和黄色背景高亮显示
// @description:en  GitHub's Commits recording button is surrounded by a black border, displayed in blue font, and highlighted with a yellow background
// @name:ar      زر متعلق بتسجيلات Commits في GitHub: حدود سوداء ونص أزرق على خلفية صفراء
// @description:ar  زر تسجيل Commits في GitHub محاط بحدود سوداء، يُعرض بخط أزرق، ويتم إبرازه بخلفية صفراء
// @name:bg      Бутон за запис на Commits в GitHub: Черна рамка и син текст на жълт фон
// @description:bg  Бутонът за запис на Commits в GitHub е заобиколен от черна рамка, показан със син шрифт и подчертан с жълт фон
// @name:cs      Tlačítko související s Commits na GitHubu: Černý rámeček a modrý text na žlutém pozadí
// @description:cs  Tlačítko pro záznam Commits na GitHubu je obklopeno černým rámečkem, zobrazeno modrým písmem a zvýrazněno žlutým pozadím
// @name:da      GitHubs Commits-relaterede knap: Sort kant og blå tekst på gul baggrund
// @description:da  GitHubs knap til registrering af Commits er omgivet af en sort kant, vist med blå skrift og fremhævet med en gul baggrund
// @name:de      GitHubs Commits-bezogener Button: Schwarzer Rand & blauer Text auf Gelb
// @description:de  Der Commits-Aufzeichnungsbutton von GitHub ist von einem schwarzen Rand umgeben, wird in blauer Schrift angezeigt und mit gelbem Hintergrund hervorgehoben
// @name:el      Κουμπί Σχετικό με Commits του GitHub: Μαύρο Περίγραμμα & Μπλε Κείμενο σε Κίτρινο
// @description:el  Το κουμπί εγγραφής Commits του GitHub περιβάλλεται από μαύρο περίγραμμα, εμφανίζεται με μπλε γραμματοσειρά και τονίζεται με κίτρινο φόντο
// @name:eo      Butono Rilata al Commits de GitHub: Nigra Bordero kaj Blua Teksto sur Flava
// @description:eo  La butono por registri Commits de GitHub estas ĉirkaŭita de nigra bordero, montrita per blua tiparo, kaj elstarigita per flava fono
// @name:es      Botón Relacionado con Commits de GitHub: Borde Negro y Texto Azul sobre Amarillo
// @description:es  El botón de grabación de Commits de GitHub está rodeado por un borde negro, se muestra en fuente azul y se destaca con un fondo amarillo
// @name:fi      GitHubin Commits-liittyvä painike: Musta reuna ja sininen teksti keltaisella
// @description:fi  GitHubin Commits-tallennuspainike on ympäröity mustalla reunalla, näytetään sinisellä fontilla ja korostetaan keltaisella taustalla
// @name:fr      Bouton Lié aux Commits de GitHub : Bordure Noire & Texte Bleu sur Jaune
// @description:fr  Le bouton d'enregistrement des Commits de GitHub est entouré d'une bordure noire, affiché en police bleue et mis en évidence avec un fond jaune
// @name:fr-CA   Bouton Relié aux Commits de GitHub : Bordure Noire et Texte Bleu sur Jaune
// @description:fr-CA  Le bouton d’enregistrement des Commits de GitHub est entouré d’une bordure noire, affiché en police bleue et mis en surbrillance avec un fond jaune
// @name:he      כפתור קשור ל-Commits של GitHub: גבול שחור וטקסט כחול על צהוב
// @description:he  כפתור ההקלטה של Commits ב-GitHub מוקף בגבול שחור, מוצג בגופן כחול ומודגש עם רקע צהוב
// @name:hr      Gumb povezan s Commits na GitHubu: Crni obrub i plavi tekst na žutom
// @description:hr  Gumb za snimanje Commits na GitHubu okružen je crnim obrubom, prikazan plavim slovima i istaknut žutom pozadinom
// @name:hu      GitHub Commits-hez Kapcsolódó Gomb: Fekete Keret és Kék Szöveg Sárgán
// @description:hu  A GitHub Commits rögzítő gombja fekete kerettel van körülvéve, kék betűtípussal jelenik meg, és sárga háttérrel van kiemelve
// @name:id      Tombol Terkait Commits GitHub: Batas Hitam & Teks Biru pada Kuning
// @description:id  Tombol perekaman Commits GitHub dikelilingi oleh batas hitam, ditampilkan dengan font biru, dan disorot dengan latar belakang kuning
// @name:it      Pulsante Relativo ai Commits di GitHub: Bordo Nero e Testo Blu su Giallo
// @description:it  Il pulsante di registrazione dei Commits di GitHub è circondato da un bordo nero, visualizzato in carattere blu e evidenziato con uno sfondo giallo
// @name:ja      GitHubのCommits関連ボタン：黒枠と青文字、黄背景
// @description:ja  GitHubのCommits記録ボタンは黒い枠で囲まれ、青いフォントで表示され、黄色の背景でハイライトされます
// @name:ka      GitHub-ის Commits-თან დაკავშირებული ღილაკი: შავი ჩარჩო და ლურჯი ტექსტი ყვითელზე
// @description:ka  GitHub-ის Commits ჩაწერის ღილაკი გარშემორტყმულია შავი ჩარჩოთი, ნაჩვენებია ლურჯი შრიფტით და გამოკვეთილია ყვითელი ფონით
// @name:ko      GitHub의 Commits 관련 버튼: 검은 테두리와 파란 글씨, 노란 배경
// @description:ko  GitHub의 Commits 기록 버튼은 검은 테두리로 둘러싸여 있으며, 파란 글씨로 표시되고 노란 배경으로 강조됩니다
// @name:nb      GitHubs Commits-relaterte knapp: Svart kant og blå tekst på gul bakgrunn
// @description:nb  GitHubs knapp for opptak av Commits er omgitt av en svart kant, vist med blå skrift og uthevet med gul bakgrunn
// @name:nl      GitHub's Commits-gerelateerde knop: Zwarte rand & blauwe tekst op geel
// @description:nl  De opnameknop voor Commits van GitHub is omringd met een zwarte rand, weergegeven in blauw lettertype en gemarkeerd met een gele achtergrond
// @name:pl      Przycisk Związany z Commits na GitHubie: Czarna Ramka i Niebieski Tekst na Żółtym
// @description:pl  Przycisk nagrywania Commits na GitHubie jest otoczony czarną ramką, wyświetlany niebieską czcionką i wyróżniony żółtym tłem
// @name:pt-BR   Botão Relacionado a Commits do GitHub: Borda Preta e Texto Azul em Amarelo
// @description:pt-BR  O botão de gravação de Commits do GitHub é cercado por uma borda preta, exibido em fonte azul e destacado com fundo amarelo
// @name:ro      Buton Legat de Commits pe GitHub: Margine Neagră și Text Albastru pe Galben
// @description:ro  Butonul de înregistrare a Commits pe GitHub este înconjurat de o margine neagră, afișat cu font albastru și evidențiat cu fundal galben
// @name:ru      Кнопка, Связанная с Commits в GitHub: Черная Рамка и Синий Текст на Желтом
// @description:ru  Кнопка записи Commits в GitHub окружена черной рамкой, отображается синим шрифтом и выделяется желтым фоном
// @name:sk      Tlačidlo Súvisiace s Commits na GitHube: Čierna Obruba a Modrý Text na Žltom
// @description:sk  Tlačidlo na zaznamenávanie Commits na GitHube je obklopené čiernou obrubou, zobrazené modrým písmom a zvýraznené žltým pozadím
// @name:sr      Дугме Повезано са Commits на GitHub-у: Црни Оквир и Плави Текст на Жутом
// @description:sr  Дугме за снимање Commits на GitHub-у је окружено црним оквиром, приказано плавим словима и истакнуто жутом позадином
// @name:sv      GitHubs Commits-relaterade knapp: Svart kant och blå text på gul bakgrund
// @description:sv  GitHubs knapp för inspelning av Commits omges av en svart kant, visas med blå text och framhävs med gul bakgrund
// @name:th      ปุ่มที่เกี่ยวข้องกับ Commits ของ GitHub: ขอบดำและข้อความสีน้ำเงินบนพื้นเหลือง
// @description:th  ปุ่มบันทึก Commits ของ GitHub ถูกล้อมรอบด้วยขอบสีดำ แสดงด้วยตัวอักษรสีน้ำเงิน และเน้นด้วยพื้นหลังสีเหลือง
// @name:tr      GitHub'un Commits ile İlgili Düğmesi: Siyah Çerçeve ve Sarı Üzerinde Mavi Metin
// @description:tr  GitHub'un Commits kayıt düğmesi siyah bir çerçeve ile çevrilidir, mavi yazı tipiyle gösterilir ve sarı arka planla vurgulanır
// @name:ug      GitHub نىڭ Commits بىلەن مۇناسىۋەتلىك كۇنۇپكىسى: قارا چەك ۋە سېرىق ئۈستىدىكى كۆك تېكىست
// @description:ug  GitHub نىڭ Commits خاتىرىلەش كۇنۇپكىسى قارا چەك بىلەن قورشالغان، كۆك خەت نۇسخىسىدا كۆرسىتىلگەن ۋە سېرىق تەگلىك بىلەن بەلگىلەنگەن
// @name:uk      Кнопка, Пов’язана з Commits у GitHub: Чорна Рамка та Синій Текст на Жовтому
// @description:uk  Кнопка запису Commits у GitHub оточена чорною рамкою, відображається синім шрифтом і виділена жовтим фоном
// @name:vi      Nút Liên Quan đến Commits của GitHub: Viền Đen và Chữ Xanh trên Nền Vàng
// @description:vi  Nút ghi lại Commits của GitHub được bao quanh bởi viền đen, hiển thị bằng phông chữ xanh và được làm nổi bật với nền vàng
// @name:zh      GitHub的Commits相关按钮：黑色边框与黄色背景上的蓝色文字
// @description:zh  GitHub的Commits记录按钮外围加上黑色边框，以蓝色字体显示，并以黄色背景高亮显示
// @name:zh-CN   GitHub的Commits相关按钮：黑色边框与黄色背景上的蓝色文字
// @description:zh-CN  GitHub的Commits记录按钮外围加上黑色边框，以蓝色字体显示，并以黄色背景高亮显示
// @name:zh-HK   GitHub嘅Commits相關按鈕：黑色邊框同黃色背景上嘅藍色文字
// @description:zh-HK  GitHub嘅Commits記錄按鈕外圍加咗黑色邊框，用藍色字體顯示，並以黃色背景高亮顯示
// @name:zh-SG   GitHub的Commits相关按钮：黑色边框与黄色背景上的蓝色文字
// @description:zh-SG  GitHub的Commits记录按钮外围加上黑色边框，以蓝色字体显示，并以黄色背景高亮显示
// @name:zh-TW   GitHub的Commits相關按鈕：黑色邊框與黃色背景上的藍色文字
// @description:zh-TW  GitHub的Commits記錄按鈕外圍加上黑色邊框，以藍色字體顯示，並以黃色背景高亮顯示
// @namespace    http://tampermonkey.net/
// @version      0.2.6.3
// @author       aspen138
// @match        *://github.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACEUExURUxpcRgWFhsYGBgWFhcWFh8WFhoYGBgWFiUlJRcVFRkWFhgVFRgWFhgVFRsWFhgWFigeHhkWFv////////////r6+h4eHv///xcVFfLx8SMhIUNCQpSTk/r6+jY0NCknJ97e3ru7u+fn51BOTsPCwqGgoISDg6empmpoaK2srNDQ0FhXV3eXcCcAAAAXdFJOUwCBIZXMGP70BuRH2Ze/LpIMUunHkpQR34sfygAAAVpJREFUOMt1U+magjAMDAVb5BDU3W25b9T1/d9vaYpQKDs/rF9nSNJkArDA9ezQZ8wPbc8FE6eAiQUsOO1o19JolFibKCdHGHC0IJezOMD5snx/yE+KOYYr42fPSufSZyazqDoseTPw4lGJNOu6LBXVUPBG3lqYAOv/5ZwnNUfUifzBt8gkgfgINmjxOpgqUA147QWNaocLniqq3QsSVbQHNp45N/BAwoYQz9oUJEiE4GMGfoBSMj5gjeWRIMMqleD/CAzUHFqTLyjOA5zjNnwa4UCEZ2YK3khEcBXHjVBtEFeIZ6+NxYbPqWp1DLKV42t6Ujn2ydyiPi9nX0TTNAkVVZ/gozsl6FbrktkwaVvL2TRK0C8Ca7Hck7f5OBT6FFbLATkL2ugV0tm0RLM9fedDvhWstl8Wp9AFDjFX7yOY/lJrv8AkYuz7fuP8dv9izCYH+x3/LBnj9fYPBTpJDNzX+7cAAAAASUVORK5CYII=
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483727/GitHub%E7%9A%84Commits%E8%AE%B0%E5%BD%95%E7%9B%B8%E5%85%B3%E7%9A%84%E6%8C%89%E9%92%AE%E5%A4%96%E5%9B%B4%E5%8A%A0%E4%B8%8A%E9%BB%91%E8%89%B2%E8%BE%B9%E6%A1%86%EF%BC%8C%E5%B9%B6%E4%BB%A5%E8%93%9D%E8%89%B2%E5%AD%97%E4%BD%93%E5%92%8C%E9%BB%84%E8%89%B2%E8%83%8C%E6%99%AF%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/483727/GitHub%E7%9A%84Commits%E8%AE%B0%E5%BD%95%E7%9B%B8%E5%85%B3%E7%9A%84%E6%8C%89%E9%92%AE%E5%A4%96%E5%9B%B4%E5%8A%A0%E4%B8%8A%E9%BB%91%E8%89%B2%E8%BE%B9%E6%A1%86%EF%BC%8C%E5%B9%B6%E4%BB%A5%E8%93%9D%E8%89%B2%E5%AD%97%E4%BD%93%E5%92%8C%E9%BB%84%E8%89%B2%E8%83%8C%E6%99%AF%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Add the custom styles
    GM_addStyle(`
       .custom-highlight {
            border: 2px solid black !important;
            background-color: yellow !important;
            color: blue !important;
        }
    `);

    // Function to check and apply styles to matching elements
    function applyCustomStyles() {
        // Select all span elements that could contain the text
        const spans = document.querySelectorAll('span[data-component="text"] span');

        // Regular expression to match the pattern "number Commits" with commas for thousand separators
        const regex = /\b\d{1,3}(,\d{3})*\sCommit*/;

        spans.forEach(span => {
            // If the span's text matches the pattern
            if (regex.test(span.textContent)) {
                // Add a custom class or directly apply styles here
                span.classList.add('custom-highlight');
            }
        });

         const buttons = document.querySelectorAll('a[id="browse-at-time-link"]');
         console.log(buttons);
         const regex1= /\bBrowse files\b/;
         buttons.forEach(btn => {
            // If the span's text matches the pattern
            if (regex1.test(btn.innerText)) {
                // Add a custom class or directly apply styles here
                btn.classList.add('custom-highlight');
            }
        });



    }

    // MutationObserver to observe changes in the document
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                applyCustomStyles();
            }
        });
    });

    // Configuration of the observer:
    const config = { childList: true, subtree: true };

    // Start observing the body for added nodes
    observer.observe(document.body, config);

    // Initial application of the styles
    applyCustomStyles();
})();

