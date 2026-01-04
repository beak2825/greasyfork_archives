// ==UserScript==
// @name              Mxo Bot
// @namespace         https://i.imgur.com/gLazoQg.png
// @version           2.1.1
// @description       Fast, Auto Secure And Easiest To Confugre With Menu
// @description:tr    Hızlı, Oto Korumalı Ve Kolay Menü
// @description:ar    سريع وآمن تلقائيًا وأسهل للتكوين مع القائمة
// @description:bg    Бързо, автоматично защитено и най-лесно за конфигуриране с меню
// @description:cs    Rychlé, automaticky zabezpečené a nejjednodušší k použití s nabídkou
// @description:da    Hurtig, Auto Sikker Og Nemmest At Konfigurere Med Menu
// @description:de    Schnell, automatisch gesichert und am einfachsten zu konfigurieren mit Menü
// @description:el    Γρήγορο, αυτόματο και εύκολο να διαμορφωθεί με το μενού
// @description:en    Fast, Auto Secure And Easiest To Confugre With Menu
// @description:eo    Rapida, Aŭto Sekura Kaj Plej Facila Al Konfuzi Kun Menuo
// @description:es    Rápido, seguro y fácil de configurar con menú
// @description:fi    Nopea, automaattisesti suojattu ja helposti määritettävissä oleva valikon kanssa
// @description:fr    Rapide, sécurisé automatiquement et le plus facile à configurer avec le menu
// @description:fr-CA Rapide, sécurisé automatiquement et le plus facile à configurer avec le menu
// @description:he    מהיר, מאובטח וקל להגדרה עם תפריט
// @description:hu    Gyors, automatikus biztonság és könnyen konfigurálható menüvel
// @description:id    Cepat, Auto Aman Dan Paling Mudah Dikonfigurasi Dengan Menu
// @description:it    Veloce, Auto Sicuro E Più Semplice Da Configurare Con Menù
// @description:ja    速くて、自動的に安全で設定が簡単なメニュー付き
// @description:ka    სწრაფი, ავტო დაცული და ყველაზე მარტივი კონფიგურაცია მენიუთი
// @description:ko    빠르고 자동으로 보안이 되며 메뉴로 구성하기 가장 쉬운
// @description:nb    Rask, automatisk sikker og enkel å konfigurere med meny
// @description:nl    Snel, automatisch beveiligd en gemakkelijk te configureren met menu
// @description:pl    Szybki, automatycznie zabezpieczony i łatwy w konfiguracji z menu
// @description:pt-BR Rápido, Automático, Seguro e Mais Fácil de Configurar com Menu
// @description:ro    Rapid, Securizare Automată și Ușor de Configurat Cu Meniu
// @description:ru    Быстро, автоматически защищено и проще всего настроить с меню
// @description:sk    Rýchle, automaticky zabezpečené a najjednoduchšie na konfiguráciu s ponukou
// @description:sr    Брзо, аутоматски безбедно и најлакше за конфигурисање са менијем
// @description:sv    Snabb, Auto Säker Och Enklast Att Konfigurera Med Meny
// @description:th    รวดเร็ว, ปลอดภัยอัตโนมัติและง่ายที่สุดในการกำหนดค่าด้วยเมนู
// @description:uk    Швидко, автоматично захищено та найлегше настроюване з меню
// @description:ug    تېز، ئاپتوماتىك سىغىنىش ۋە مەنىيى بىلەن ئۆزگىچە تەڭشەيدۇ
// @description:vi    Nhanh, Tự Động Bảo Mật Và Dễ Dàng Cấu Hình Với Menu
// @description:zh-CN 快速、自动安全且易于配置的菜单
// @description:zh-TW 快速、自動安全且易於配置的菜單
// @author            Nevin & Ngixl
// @match             https://pixelplace.io/*
// @exclude           https://pixelplace.io/forums*
// @exclude           https://pixelplace.io/blog*
// @exclude           https://pixelplace.io/api*
// @exclude           https://pixelplace.io/gold-chart.php
// @exclude           https://pixelplace.io/*ypp=true
// @license           MIT
// @icon              https://r.resimlink.com/rkU4RSlg.png
// @run-at            document-start
// @grant             unsafeWindow
// @grant             GM.info
// @require           https://code.jquery.com/jquery-3.6.0.min.js
// @require           https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js
// @require           https://update.greasyfork.org/scripts/461063/1708713/Library%20For%20Mxobot.js
// @require           https://update.greasyfork.org/scripts/461221/1159560/Hack%20Timerjs%20By%20Turuslan.js
// @require           https://update.greasyfork.org/scripts/445697/1244619/Greasy%20Fork%20API.js
// @downloadURL https://update.greasyfork.org/scripts/459915/Mxo%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/459915/Mxo%20Bot.meta.js
// ==/UserScript==
/* global NevinCore, NevinWaitForElm, NevinProtect, NevinLogger, NevinLoggerFactory, toastr*/
/*jshint esversion: 11 */

// ==Locales==

window.onload=function(){
  const element = document.getElementById("toggleButon");
  element.addEventListener("click", toggleLinks);
//  var div = document.getElementById("links");
//  if (div.style.display !== "block" || div.style.display !== "none") {
//      div.style.display = "none";
//  }
}

const lang = () => {
    const language = navigator.language.toLowerCase()
    switch (language) {
      case 'en':
        return 0
      case 'tr':
        return 1
      case 'ar':
        return 2
      case 'bg':
        return 3
      case 'cs':
        return 4
      case 'da':
        return 5
      case 'de':
        return 6
      case 'el':
        return 7
      case 'en':
        return 8
      case 'eo':
        return 9
      case 'es':
        return 10
      case 'fi':
        return 11
      case 'fr':
        return 12
      case 'he':
        return 13
      case 'hu':
        return 14
      case 'id':
        return 15
      case 'it':
        return 16
      case 'ja':
        return 17
      case 'ka':
        return 18
      case 'ko':
        return 19
      case 'nb':
        return 20
      case 'nl':
        return 21
      case 'pl':
        return 22
      case 'pt':
        return 23
      case 'ro':
        return 24
      case 'ru':
        return 25
      case 'sk':
        return 26
      case 'sr':
        return 27
      case 'sv':
        return 28
      case 'th':
        return 29
      case 'uk':
        return 30
      case 'ug':
        return 31
      case 'vi':
        return 32
      case 'zh-cn':
        return 33
      case 'zh-tw':
        return 34
      default:
        return 0
    }
  }
  const i18n = {
botting_speed: [
  'Botting Speed',
  'Bot Hızı',
  'سرعة البوت',
  'Скорост на бота',
  'Rychlost bota',
  'Bottens hastighed',
  'Bot-Geschwindigkeit',
  'Ταχύτητα bot',
  'Botting Speed',
  'Rapido de roboto',
  'Velocidad del bot',
  'Bottinopeus',
  'Vitesse du bot',
  'Vitesse du bot',
  'מהירות בוט',
  'Bot sebessége',
  'Kecepatan Bot',
  'Velocità del bot',
  'ボット速度',
  'ბოტის სიჩქარე',
  '봇 속도',
  'Bottens hastighet',
  'Botsnelheid',
  'Prędkość bota',
  'Velocidade do bot',
  'Viteza botului',
  'Скорость бота',
  'Rýchlosť bota',
  'Брзина бота',
  'Bottens hastighet',
  'ความเร็วของบอท',
  'Швидкість бота',
  'بوت سۈرئىتى',
  'Tốc độ bot',
  '机器人速度',
  '機器人速度',
][lang()],
timeout_presets: [
  'Fast/Risky (10-19) Safe/Slow (20-30)',
  'Hızlı/Riskli (10-19) Güvenli/Yavaş (20-30)',
  'سريع/محفوف بالمخاطر (10-19) آمن/بطيء (20-30)',
  'Бързо/Рисковано (10-19) Безопасно/Бавно (20-30)',
  'Rychlé/Rizikové (10-19) Bezpečné/Pomalé (20-30)',
  'Hurtig/Risikabel (10-19) Sikker/Langsom (20-30)',
  'Schnell/Risikoreich (10-19) Sicher/Langsam (20-30)',
  'Γρήγορο/Ριψοκίνδυνο (10-19) Ασφαλές/Αργό (20-30)',
  'Fast/Risky (10-19) Safe/Slow (20-30)',
  'Rapida/Riska (10-19) Sekura/Malrapida (20-30)',
  'Rápido/Arriesgado (10-19) Seguro/Lento (20-30)',
  'Nopea/Riski (10-19) Turvallinen/Hidas (20-30)',
  'Rapide/Risqué (10-19) Sécurisé/Lent (20-30)',
  'Rapide/Risqué (10-19) Sécurisé/Lent (20-30)',
  'מהיר/מסוכן (10-19) בטוח/איטי (20-30)',
  'Gyors/Kockázatos (10-19) Biztonságos/Lassú (20-30)',
  'Cepat/Berisiko (10-19) Aman/Lambat (20-30)',
  'Veloce/Rischioso (10-19) Sicuro/Lento (20-30)',
  '高速/リスクあり (10-19) 安全/低速 (20-30)',
  'სწრაფი/რისკიანი (10-19) უსაფრთხო/ნელი (20-30)',
  '빠름/위험 (10-19) 안전/느림 (20-30)',
  'Rask/Trisk (10-19) Trygg/Langsom (20-30)',
  'Snel/Risicovol (10-19) Veilig/Langzaam (20-30)',
  'Szybkie/Ryzykowne (10-19) Bezpieczne/Wolne (20-30)',
  'Rápido/Arriscado (10-19) Seguro/Lento (20-30)',
  'Rapid/Riscant (10-19) Sigur/Lent (20-30)',
  'Быстро/Рискованно (10-19) Безопасно/Медленно (20-30)',
  'Rýchle/Rizikové (10-19) Bezpečné/Pomalé (20-30)',
  'Брзо/Ризично (10-19) Безбедно/Споро (20-30)',
  'Snabb/Riskfylld (10-19) Säker/Långsam (20-30)',
  'เร็ว/มีความเสี่ยง (10-19) ปลอดภัย/ช้า (20-30)',
  'Швидко/Ризиковано (10-19) Безпечно/Повільно (20-30)',
  'تېز/خەتەرلىك (10-19) بىخەتەر/ئاستا (20-30)',
  'Nhanh/Rủi ro (10-19) An toàn/Chậm (20-30)',
  '快速/有风险 (10-19) 安全/慢速 (20-30)',
  '快速/有風險 (10-19) 安全/慢速 (20-30)',
][lang()],
timeout_safe_range: [
  '20-30 is safer but slower. Click F5 to apply',
  '20-30 arası daha güvenli ancak yavaştır. Uygulamak için F5\'e tıklayın',
  '20-30 أكثر أمانًا ولكن أبطأ. انقر فوق F5 للتطبيق',
  '20-30 е по-безопасно, но по-бавно. Натиснете F5, за да приложите',
  '20-30 je bezpečnější, ale pomalejší. Kliknutím na F5 použijete',
  '20-30 er sikrere, men langsommere. Klik på F5 for at anvende',
  '20-30 ist sicherer, aber langsamer. Drücke F5 zum Übernehmen',
  '20-30 είναι πιο ασφαλές αλλά πιο αργό. Κάντε κλικ στο F5 για εφαρμογή',
  '20-30 is safer but slower. Click F5 to apply',
  '20-30 estas pli sekura sed pli malrapida. Alklaku F5 por apliki',
  '20-30 es más seguro pero más lento. Haga clic en F5 para aplicar',
  '20-30 on turvallisempi mutta hitaampi. Napsauta F5 käyttääksesi',
  '20-30 est plus sûr mais plus lent. Cliquez sur F5 pour appliquer',
  '20-30 est plus sûr mais plus lent. Cliquez sur F5 pour appliquer',
  '20-30 בטוח יותר אבל איטי יותר. לחץ על F5 כדי להחיל',
  '20-30 biztonságosabb, de lassabb. Kattintson az F5-re az alkalmazáshoz',
  '20-30 lebih aman tetapi lebih lambat. Klik F5 untuk menerapkan',
  '20-30 è più sicuro ma più lento. Fare clic su F5 per applicare',
  '20-30はより安全ですが遅いです。F5をクリックして適用します',
  '20-30 უფრო უსაფრთხოა, მაგრამ ნელი. დააჭირეთ F5-ს გამოსაყენებლად',
  '20-30은 더 안전하지만 느립니다. 적용하려면 F5를 클릭하세요',
  '20-30 er tryggere, men tregere. Klikk F5 for å bruke',
  '20-30 is veiliger maar langzamer. Klik op F5 om toe te passen',
  '20-30 jest bezpieczniejsze, ale wolniejsze. Kliknij F5, aby zastosować',
  '20-30 é mais seguro, mas mais lento. Clique em F5 para aplicar',
  '20-30 este mai sigur, dar mai lent. Faceți clic pe F5 pentru a aplica',
  '20-30 безопаснее, но медленнее. Нажмите F5, чтобы применить',
  '20-30 je bezpečnejšie, ale pomalšie. Kliknutím na F5 použijete',
  '20-30 је безбедније али спорије. Кликните Ф5 да бисте применили',
  '20-30 är säkrare men långsammare. Klicka på F5 för att tillämpa',
  '20-30 ปลอดภัยกว่าช้าลง กด F5 เพื่อใช้งาน',
  '20-30 безпечніше, але повільніше. Натисніть F5, щоб застосувати',
  '20-30 تېخىمەن بىخەتەر، ئەمما ئاستا. قوللىماق ئۈچۈن F5 نى بېسىڭ',
  '20-30 an toàn hơn nhưng chậm hơn. Nhấn F5 để áp dụng',
  '20-30更安全但较慢。点击F5应用',
  '20-30更安全但較慢。點擊F5應用',
][lang()],
timeout_warning: [
  'Values below 20 increase bot speed but are risky. Click F5 to apply',
  '20\'den düşük değerler bot hızını artırır ancak risklidir. Uygulamak için F5\'e tıklayın',
  'القيم أقل من 20 تزيد من سرعة البوت ولكنها محفوفة بالمخاطر. انقر فوق F5 للتطبيق',
  'Стойности под 20 увеличават скоростта на бота, но са рисковани. Натиснете F5, за да приложите',
  'Hodnoty pod 20 zvyšují rychlost bota, ale jsou riskantní. Kliknutím na F5 použijete',
  'Værdier under 20 øger båthastigheden, men er risikable. Klik på F5 for at anvende',
  'Werte unter 20 erhöhen die Bot-Geschwindigkeit, sind aber riskant. Drücke F5 zum Übernehmen',
  'Οι τιμές κάτω από 20 αυξάνουν την ταχύτητα του bot αλλά είναι επικίνδυνες. Κάντε κλικ στο F5 για εφαρμογή',
  'Values below 20 increase bot speed but are risky. Click F5 to apply',
  'Valoroj sub 20 pliigas la rapidon de roboto sed estas riskaj. Alklaku F5 por apliki',
  'Los valores por debajo de 20 aumentan la velocidad del bot pero son riesgosos. Haga clic en F5 para aplicar',
  'Alle 20 olevat arvot lisäävät botin nopeutta, mutta ovat riskialttiita. Napsauta F5 käyttääksesi',
  'Les valeurs inférieures à 20 augmentent la vitesse du bot mais sont risquées. Cliquez sur F5 pour appliquer',
  'Les valeurs inférieures à 20 augmentent la vitesse du bot mais sont risquées. Cliquez sur F5 pour appliquer',
  'ערכים מתחת ל-20 מגבירים את מהירות הבוט אך מסוכנים. לחץ על F5 כדי להחיל',
  'A 20 alatti értékek növelik a bot sebességét, de kockázatosak. Kattintson az F5-re az alkalmazáshoz',
  'Nilai di bawah 20 meningkatkan kecepatan bot tetapi berisiko. Klik F5 untuk menerapkan',
  'Valori inferiori a 20 aumentano la velocità del bot ma sono rischiosi. Fare clic su F5 per applicare',
  '20未満の値はボットの速度を向上させますが、危険です。F5をクリックして適用します',
  '20-ზე დაბალი მნიშვნელობები ზრდის ბოტის სიჩქარეს, მაგრამ საშიშია. დააჭირეთ F5-ს გამოსაყენებლად',
  '20 미만의 값은 봇 속도를 높이지만 위험합니다. 적용하려면 F5를 클릭하세요',
  'Verdier under 20 øker bothastigheten, men er risikable. Klikk F5 for å bruke',
  'Waarden onder 20 verhogen de botsnelheid maar zijn riskant. Klik op F5 om toe te passen',
  'Wartości poniżej 20 zwiększają prędkość bota, ale są ryzykowne. Kliknij F5, aby zastosować',
  'Valores abaixo de 20 aumentam a velocidade do bot, mas são arriscados. Clique em F5 para aplicar',
  'Valorile sub 20 cresc viteza botului dar sunt riscante. Faceți clic pe F5 pentru a aplica',
  'Значения ниже 20 увеличивают скорость бота, но рискованны. Нажмите F5, чтобы применить',
  'Hodnoty pod 20 zvyšujú rýchlosť bota, ale sú riskantné. Kliknutím na F5 použijete',
  'Вредности испод 20 повећавају брзину бота, али су ризичне. Кликните Ф5 да бисте применили',
  'Värden under 20 ökar båthastigheten men är riskfyllda. Klicka på F5 för att tillämpa',
  'ค่าที่ต่ำกว่า 20 จะเพิ่มความเร็วของบอทแต่มีความเสี่ยง กด F5 เพื่อใช้งาน',
  'Значення нижче 20 збільшують швидкість бота, але ризиковані. Натисніть F5, щоб застосувати',
  '20 دىن تۆۋەن قىممەتلەر بوت سۈرئىتىنى ئاشۇرىدۇ، ئەمما خەتەرلىك. قوللىماق ئۈچۈن F5 نى بېسىڭ',
  'Giá trị dưới 20 làm tăng tốc độ bot nhưng có rủi ro. Nhấn F5 để áp dụng',
  '低于20的值会提高机器人速度，但有风险。点击F5应用',
  '低於20的值會提高機器人速度，但有風險。點擊F5應用',
][lang()],
    links: [
      'Links',
      'Bağlantılar',
      'روابط',
      'Връзки',
      'Odkazy',
      'Links',
      'Συνδέσμοι',
      'קישורים',
      'Enlaces',
      'Linkit',
      'Liens',
      'Liens',
      'קישורים',
      'Hivatkozások',
      'Tautan',
      'Collegamenti',
      'リンク',
      'ბმულები',
      '링크',
      'Lenker',
      'Links',
      'Linki',
      'Links',
      'Linkuri',
      'Ссылки',
      'Odkazy',
      'Линкови',
      'Länkar',
      'ลิงก์',
      'Посилання',
      'ئۇلانمىلار',
      'Liên kết',
      '链接',
    ][lang()],
    bottingrules: [
      'Botting rules',
      'Bot kuralları',
      'قواعد البوت',
      'Правила за ботове',
      'Pravidla pro boty',
      'Botregler',
      'Κανόνες για μποτ',
      'כללי בוט',
      'Reglas del bot',
      'Botin säännöt',
      'Règles de bot',
      'Règles de bot',
      'כללי בוט',
      'Bot szabályok',
      'Aturan Bot',
      'Regole del bot',
      'ボットのルール',
      'ბოტების წესები',
      '봇 규칙',
      'Botregler',
      'Botregels',
      'Zasady botowania',
      'Regras de bot',
      'Reguli pentru bot',
      'Правила для ботов',
      'Pravidlá pre boty',
      'Правила за ботове',
      'Botregler',
      'กฎการใช้งานบอท',
      'Правила для ботів',
      'بوٹ کے قوانین',
      '机器人规则',
    ][lang()],
      greasyforkpage: [
      'Greasyfork page',
      'Greasyfork sayfası',
      'صفحة Greasyfork',
      'Страница Greasyfork',
      'Stránka Greasyfork',
      'Greasyfork side',
      'Σελίδα Greasyfork',
      'דף Greasyfork',
      'Página de Greasyfork',
      'Greasyfork-sivu',
      'Page Greasyfork',
      'Page Greasyfork',
      'דף Greasyfork',
      'Greasyfork oldal',
      'Halaman Greasyfork',
      'Pagina Greasyfork',
      'Greasyforkページ',
      'Greasyfork გვერდი',
      'Greasyfork 페이지',
      'Greasyfork side',
      'Greasyfork pagina',
      'Strona Greasyfork',
      'Página do Greasyfork',
      'Pagină Greasyfork',
      'Страница Greasyfork',
      'Stránka Greasyfork',
      'Страница Greasyfork',
      'Greasyfork sida',
      'หน้า Greasyfork',
      'Сторінка Greasyfork',
      'Greasyfork بەت',
      'Trang Greasyfork',
      'Greasyfork页面',
    ][lang()],
       discordsrv: [
      'Discord server',
      'Discord sunucusu',
      'خادم Discord',
      'Discord сървър',
      'Discord server',
      'Discord server',
      'Διακομιστής Discord',
      'שרת Discord',
      'Servidor de Discord',
      'Discord-palvelin',
      'Serveur Discord',
      'Serveur Discord',
      'שרת Discord',
      'Discord szerver',
      'Server Discord',
      'Server Discord',
      'Discordサーバー',
      'Discord სერვერი',
      'Discord 서버',
      'Discord server',
      'Discord server',
      'Serwer Discord',
      'Servidor Discord',
      'Server Discord',
      'Discord сервер',
      'Discord server',
      'Discord сервер',
      'Discord server',
      'เซิร์ฟเวอร์ Discord',
      'Discord сервер',
      'Discord مۇلازىمېتىرى',
      'Máy chủ Discord',
      'Discord服务器',
    ][lang()],
    imageresizer: [
      'Image resizer',
      'Resim boyutlandırıcı',
      'تغيير حجم الصور',
      'Промяна на размер',
      'Změna velikosti',
      'Størrelsesændring',
      'Αλλαγή μεγέθους',
      'שינוי גודל',
      'Cambiar tamaño',
      'Koon muuttaja',
      'Redimensionner',
      'Redimensionner',
      'שינוי גודל',
      'Képátméretezés',
      'Ubah ukuran',
      'Ridimensiona',
      'リサイザー',
      'ზომის შეცვლა',
      '크기 조절',
      'Størrelsesendring',
      'Grootte wijzigen',
      'Zmiana rozmiaru',
      'Redimensionar',
      'Redimensionare',
      'Изменение размера',
      'Zmena veľkosti',
      'Промена величине',
      'Storleksändring',
      'ปรับขนาด',
      'Зміна розміру',
      'چوڭلۇقى ئۆزگەرتىش',
      'Đổi kích thước',
      '调整大小',
    ][lang()],
    imageconverter: [
      'Image converter',
      'Resim dönüştürücü',
      'محول الصور',
      'Конвертор',
      'Převodník',
      'Konverter',
      'Μετατροπέας',
      'ממיר',
      'Convertidor',
      'Muunnin',
      'Convertisseur',
      'Convertisseur',
      'ממיר',
      'Konverter',
      'Konverter',
      'Convertitore',
      'コンバーター',
      'კონვერტორი',
      '변환기',
      'Konverter',
      'Converter',
      'Konwerter',
      'Conversor',
      'Convertor',
      'Конвертер',
      'Konvertor',
      'Конвертер',
      'Konverterare',
      'ตัวแปลง',
      'Конвертер',
      'ئايلاندۇرغۇچ',
      'Bộ chuyển đổi',
      '转换器',
    ][lang()],
    setting: [
      'Bot Settings',
      'Bot Ayarları',
      'إعدادات البوت',
      'Настройки на бота',
      'Nastavení bota',
      'Botindstillinger',
      'Ρυθμίσεις του Bot',
      'Bot הגדרות',
      'Ajustes del bot',
      'Botin asetukset',
      'Réglages du bot',
      'Réglages du bot',
      'הגדרות הבוט',
      'Bot beállítások',
      'Pengaturan Bot',
      'Impostazioni del bot',
      'ボットの設定',
      'Bot პარამეტრები',
      '봇 설정',
      'Botinnstillinger',
      'Botinstellingen',
      'Ustawienia bota',
      'Configurações do bot',
      'Setări bot',
      'Настройки бота',
      'Nastavenia bota',
      'Подешавање бота',
      'Botinställningar',
      'การตั้งค่าบอท',
      'Налаштування бота',
      'بوٹ کی ترتیبات',
      '设置 Bot',
    ][lang()],
    image: [
      'Image',
      'Resim',
      'صورة',
      'Изображение',
      'Obrázek',
      'Billede',
      'Εικόνα',
      'תמונה',
      'תמונה',
      'Imagen',
      'Kuva',
      'Image',
      'Image',
      'תמונה',
      'Kép',
      'Gambar',
      'Immagine',
      '画像',
      'სურათი',
      '이미지',
      'Mynd',
      'Afbeelding',
      'Obraz',
      'Imagem',
      'Imagine',
      'Изображение',
      'Obrázok',
      'Слика',
      'Bild',
      'รูปภาพ',
      'Зображення',
      'تصویر',
      '图片',
    ][lang()],
    loaded: [
       'Loaded',
       'Yüklendi',
       'تم التحميل',
       'Загружено',
       'Nahráno',
       'Indlæst',
       'Φορτώθηκε',
       'נטען',
       'Cargado',
       'Ladattu',
       'Chargé',
       'Töltött',
       'Dimuat',
       'Caricato',
       '読み込まれました',
       'ჩატვირთულია',
       '로드됨',
       'Hlaðið',
       'Geladen',
       'Załadowano',
       'Carregado',
       'Încărcat',
       'Загружено',
       'Zavádzajúci',
       'Учитано',
       'Laddad',
       'โหลดแล้ว',
       'Завантажено',
       'لوڈ ہوگیا',
       '加载完成'
    ][lang()],
    imagenotloaded: [
      'Image not loaded',
      'Resim yüklenmedi',
      'صورة لم تحمل',
      'Изображение не загружено',
      'Obrázek nebyl načten',
      'Billede ikke indlæst',
      'Η εικόνα δεν φορτώθηκε',
      'תמונה לא נטענה',
      'תמונה לא נטענה',
      'Imagen no cargada',
      'Kuvaa ei ladattu',
      'Image Not Loaded',
      'Image Not Loaded',
      'תמונה לא נטענה',
      'Kép nem töltődött be',
      'Gambar tidak dimuat',
      'Immagine non caricata',
      '画像が読み込まれていません',
      'სურათი არ არის ჩატვირთული',
      '이미지가 로드되지 않았습니다',
      'Mynd ekki hlaðin',
      'Afbeelding niet geladen',
      'Obraz nie został załadowany',
      'Imagem não carregada',
      'Imaginea nu a fost încărcată',
      'Изображение не загружено',
      'Obrázok nebol načítaný',
      'Сликата не е вчитана',
      'Bild nicht geladen',
      'รูปภาพไม่ได้โหลด',
      'Зображення не завантажено',
      'تصویر بارگذاری نشد',
      '图片未加载',
    ][lang()],
    notloaded: [
       'Not loaded',
       'Yüklenmedi',
       'لم يتم تحميلها',
       'Не загружено',
       'Nenahráno',
       'Ikke indlæst',
       'Δεν φορτώθηκε',
       'לא נטען',
       'No cargado',
       'Ei ladattu',
       'Non chargé',
       'Nem töltött',
       'Tidak dimuat',
       'Non caricato',
       '読み込まれていません',
       'არ ჩაიტვირთა',
       '로드되지 않았습니다',
       'Ekki hlaðið',
       'Niet geladen',
       'Nie załadowano',
       'Não carregado',
       'Nu încărcat',
       'Не загружено',
       'Nezavádza',
       'Није учитано',
       'Inte laddad',
       'ไม่ได้โหลด',
       'Не завантажено',
       'لوڈ نہیں ہوا',
       '未加载'
    ][lang()],
    set: [
      'Set',
      'Ayarlandı',
      'تم تعيينه',
      'Зададен',
      'Nastaveno',
      'Indstillet',
      'Ρυθμισμένο',
      'הוגדר',
      'הוגדר',
      'Establecido',
      'Asetettu',
      'Réglé',
      'Réglé',
      'הוגדר',
      'Beállítva',
      'Diatur',
      'Impostato',
      '設定された',
      'დაყენებულია',
      '설정됨',
      'Sett',
      'Ingesteld',
      'Ustawione',
      'Definido',
      'Setat',
      'Зададено',
      'Nastavené',
      'Постављен',
      'Inställd',
      'ตั้งค่าแล้ว',
      'Встановлений',
      'تنظیم شده',
    ][lang()],
    nset: [
      'Not Set',
      'Seçilmedi',
      'لم يتم التعيين',
      'Не е зададено',
      'Nenastaveno',
      'Ikke indstillet',
      'Δεν έχει οριστεί',
      'לא נקבע',
      'לא הוגדר',
      'No establecido',
      'Ei asetettu',
      'Non défini',
      'Non défini',
      'לא הוגדר',
      'Nincs beállítva',
      'Belum Diatur',
      'Non impostato',
      '未設定',
      'არ არის დაყენებული',
      '설정되지 않음',
      'Ekki skilgreint',
      'Niet ingesteld',
      'Nie ustawiono',
      'Não Definido',
      'Nedefinit',
      'Не установлено',
      'Nenastavené',
      'Није подешено',
      'Inte inställt',
      'ไม่ได้ตั้งค่า',
      'Не встановлено',
      'تنظیم نشده',
    ][lang()],
    coordinatesnotset: [
      'Coordinates not set',
      'Kordinat Seçilmedi',
      'لم يتم تعيين الإحداثيات',
      'Координаты не установлены',
      'Souřadnice nejsou nastaveny',
      'Koordinater ikke angivet',
      'Οι συντεταγμένες δεν έχουν οριστεί',
      'הקואורדינטות לא הוגדרו',
      'הקואורדינטות לא הוגדרו',
      'Coordenadas no establecidas',
      'Koordinaatteja ei ole asetettu',
      'Coordinates Not Set',
      'Coordinates Not Set',
      'הקואורדינטות לא הוגדרו',
      'Koordináták nincsenek beállítva',
      'Koordinat tidak diatur',
      'Coordinate non impostate',
      '座標が設定されていません',
      'კოორდინატები არ არის დაყენებული',
      '좌표가 설정되지 않았습니다',
      'Hnit ekki sett',
      'Coördinaten niet ingesteld',
      'Współrzędne nie ustawione',
      'Coordenadas não definidas',
      'Coordonatele nu sunt setate',
      'Координаты не установлены',
      'Súradnice nie sú nastavené',
      'Координате нису постављене',
      'Koordinater inte inställda',
      'ไม่ได้ตั้งค่าพิกัด',
      'Координати не встановлені',
      'موقع جغرافي غير معين',
      '坐标未设置',
    ][lang()],
    on: [
      'On',
      'Açık',
      'تشغيل',
      'Вкл.',
      'Zap.',
      'Tænd',
      'Ενεργό',
      'פתח',
      'מופעל',
      'Encendido',
      'Päällä',
      'Activé',
      'Activé',
      'פתוח',
      'Be',
      'Hidup',
      'Acceso',
      'オン',
      'ჩართული',
      '온',
      'Á',
      'Aan',
      'Włączone',
      'Ligado',
      'Pornit',
      'Укл.',
      'Zap.',
      'Укл.',
      'På',
      'เปิด',
      'Увімк.',
      'روشن',
    ][lang()],
    off: [
      'Off',
      'Kapalı',
      'إيقاف',
      'Изключено',
      'Vyp.',
      'Fra',
      'Απενεργοποιημένο',
      'כבה',
      'כבוי',
      'Apagado',
      'Pois päältä',
      'Désactivé',
      'Désactivé',
      'כבוי',
      'Ki',
      'Mati',
      'Spento',
      'オフ',
      'გამორთული',
      '끄기',
      'Slökkva',
      'Uit',
      'Wyłączone',
      'Desligado',
      'Oprit',
      'Искл.',
      'Vyp.',
      'Искл.',
      'Av',
      'ปิด',
      'Вимк.',
      'خاموش',
    ][lang()],
    protect: [
      'Protect',
      'Koruma',
      'حماية',
      'Защита',
      'Ochrana',
      'Beskyt',
      'Προστασία',
      'הגנה',
      'הגנה',
      'Proteger',
      'Suojaa',
      'Protéger',
      'Protéger',
      'הגנה',
      'Védelem',
      'Lindungi',
      'Proteggi',
      '保護する',
      'დაცული',
      '보호',
      'Vernda',
      'Beschermen',
      'Chronić',
      'Protegido',
      'Protejat',
      'Защита',
      'Ochrana',
      'Заштита',
      'Skydda',
      'ป้องกัน',
      'Захист',
      'حفاظت',
    ][lang()],
    coordinate: [
      'Coordinate',
      'Koordinat',
      'إحداثيات',
      'Координати',
      'Souradnice',
      'Koordinat',
      'Συντεταγμένες',
      'קווים',
      'קואורדינטות',
      'Coordenada',
      'Koordinaatti',
      'Coordonnée',
      'Coordonnée',
      'קואורדינטה',
      'Koordináta',
      'Koordinat',
      'Coordinate',
      '座標',
      'კოორდინატი',
      '좌표',
      'Hnit',
      'Coördinaat',
      'Współrzędne',
      'Coordenada',
      'Coordonată',
      'Координата',
      'Súradnice',
      'Координата',
      'Koordinat',
      'ตำแหน่ง',
      'Координата',
      'مختصات',
    ][lang()],
    strategy: [
      'Shape',
      'Şekil',
      'شكل',
      'Форма',
      'Tvar',
      'Form',
      'Σχήμα',
      'צורה',
      'צורה',
      'Forma',
      'Muoto',
      'Forme',
      'Forme',
      'צורה',
      'Alak',
      'Strategi',
      'Forma',
      '形状',
      'ფორმა',
      '형태',
      'Lína',
      'Vorm',
      'Kształt',
      'Forma',
      'Formă',
      'Форма',
      'Tvar',
      'Форма',
      'Form',
      'รูปร่าง',
      'Форма',
      'شکل',
    ][lang()],
    horizontal: [
      'Horizontal',
      'Yatay',
      'أفقي',
      'Хоризонтално',
      'Horizontálně',
      'Vandret',
      'Οριζόντιο',
      'אופקי',
      'אופקי',
      'Horizontal',
      'Vaakasuora',
      'Horizontal',
      'Horizontal',
      'אופקי',
      'Vízszintes',
      'Horizontal',
      'Orizzontale',
      '水平',
      'ჰორიზონტალური',
      '수평',
      'Lárétt',
      'Horizontaal',
      'Poziomy',
      'Horizontal',
      'Horizontal',
      'Горизонтално',
      'Horizontálne',
      'Хоризонтално',
      'Horisontell',
      'แนวนอน',
      'Горизонтально',
      'افقی',
    ][lang()],
    vertical: [
      'Vertical',
      'Dikey',
      'عمودي',
      'Вертикално',
      'Vertikálně',
      'Lodret',
      'Κατακόρυφο',
      'אנכי',
      'אנכי',
      'Vertical',
      'Pystysuora',
      'Vertical',
      'Vertical',
      'אנכי',
      'Függőleges',
      'Vertikal',
      'Verticale',
      '垂直',
      'ვერტიკალური',
      '수직',
      'Lóðrétt',
      'Verticaal',
      'Pionowy',
      'Vertical',
      'Vertical',
      'Вертикално',
      'Vertikálne',
      'Вертикално',
      'Vertikal',
      'แนวตั้ง',
      'Вертикально',
      'عمودی',
    ][lang()],
    circular: [
      'Circular',
      'Dairesel',
      'دائري',
      'Кръгов',
      'Kruhový',
      'Cirkulær',
      'Κυκλικός',
      'מעגלי',
      'מעגלי',
      'Circular',
      'Pyöreä',
      'Circulaire',
      'Circulaire',
      'מעגלי',
      'Körkörös',
      'Mengelilingi',
      'Circolare',
      '円形',
      'წრადი',
      '원형',
      'Hringlaga',
      'Cirkelvormig',
      'Okrągły',
      'Circular',
      'Circular',
      'Круговой',
      'Kruhový',
      'Кружен',
      'Cirkulär',
      'วงกลม',
      'Круговий',
      'دائری',
    ][lang()],
    quadratic: [
      'Quadratic',
      'Kuadratik',
      'رباعي',
      'Квадратен',
      'Kvadratický',
      'Kvadratisk',
      'Τετραγωνικός',
      'ריבועי',
      'ריבועי',
      'Cuadrático',
      'Neliöllinen',
      'Quadratique',
      'Quadratique',
      'ריבועי',
      'Négyzetes',
      'Kuadrat',
      'Quadratico',
      '2次',
      'კვადრატიკი',
      '2차',
      'Kvaðratískt',
      'Vierkantig',
      'Kwadratowy',
      'Quadrático',
      'Pătratic',
      'Квадратный',
      'Kvadratický',
      'Квадратен',
      'Kvadratisk',
      'กำลังสอง',
      'Квадратний',
      'دوموجا',
    ][lang()],
    chess: [
      'Chess',
      'Dama',
      'شطرنج',
      'Шах',
      'Šachy',
      'Skak',
      'Σκάκι',
      'שחמט',
      'שחמט',
      'Ajedrez',
      'Shakki',
      'Échecs',
      'Échecs',
      'שחמט',
      'Sakk',
      'Catur',
      'Scacchi',
      'チェス',
      'ჭადრაკი',
      '체스',
      'Skák',
      'Schaak',
      'Szachy',
      'Xadrez',
      'Șah',
      'Шахматы',
      'Šachy',
      'Шах',
      'Schack',
      'หมากรุก',
      'Шахи',
      'شطرنج',
    ][lang()],
    random: [
      'Random',
      'Rastgele',
      'عشوائي',
      'Случаен',
      'Náhodně',
      'Tilfældig',
      'Τυχαίο',
      'אקראי',
      'אקראי',
      'Aleatorio',
      'Satunnainen',
      'Aléatoire',
      'Aléatoire',
      'אקראי',
      'Véletlen',
      'Acak',
      'Casuale',
      'ランダム',
      'შემთხვევითი',
      '무작위',
      'Handahófskennt',
      'Willekeurig',
      'Losowy',
      'Aleatório',
      'Aleator',
      'Случайно',
      'Náhodne',
      'Случајно',
      'Slumpmässig',
      'สุ่ม',
      'Випадковий',
      'تصادفی',
    ][lang()],
    experimental: [
      'Experimental',
      'Deneysel',
      'تجريبي',
      'Експериментален',
      'Experimentální',
      'Eksperimentel',
      'Πειραματικός',
      'נסיוני',
      'נסיוני',
      'Experimental',
      'Kokeellinen',
      'Expérimental',
      'Expérimental',
      'נסיוני',
      'Kísérleti',
      'Eksperimental',
      'Sperimentale',
      '実験的',
      'ექსპერიმენტული',
      '실험적인',
      'Tilraun',
      'Experimenteel',
      'Eksperymentalny',
      'Experimental',
      'Experimental',
      'Експериментален',
      'Experimentálny',
      'Експериментален',
      'Experimentell',
      'ทดลอง',
      'Експериментальний',
      'تجربی',
    ][lang()],
    diagonal: [
      'Diagonal',
      'Köşegen',
      'قطري',
      'Диагонален',
      'Diagonální',
      'Diagonal',
      'Διαγώνιος',
      'אלכסוני',
      'אלכסוני',
      'Diagonal',
      'Diagonaalinen',
      'Diagonal',
      'Diagonal',
      'אלכסוני',
      'Átlós',
      'Diagonal',
      'Diagonale',
      '対角線上の',
      'დიაგონალური',
      '대각선',
      'Skátt',
      'Diagonaal',
      'Przekątna',
      'Diagonal',
      'Diagonal',
      'Диагонален',
      'Diagonálny',
      'Диагонален',
      'Diagonal',
      'เส้นทแยงมุม',
      'Діагональний',
      'قطری',
    ][lang()],
    zigzag: [
      'Zigzag',
      'Zikzak',
      'زيغ زاغ',
      'Зигзаг',
      'Zigzag',
      'Zigzag',
      'Ζίγκζαγκ',
      'זיגזג',
      'זיגזג',
      'Zigzag',
      'Zigzag',
      'Zigzag',
      'Zigzag',
      'זיגזג',
      'Cikcik',
      'Zigzag',
      'Zigzag',
      'ジグザグ',
      'ზიგზაგი',
      '지그재그',
      'Zigzag',
      'Zigzag',
      'Zigzag',
      'Zigzag',
      'Зигзаг',
      'Zigzag',
      'Зигзаг',
      'Zigzag',
      'Zigzag',
      'เข้าเกลียวเข้าเกลียว',
      'Зігзаг',
    ][lang()],
    baklava: [
      'Baklava',
      'Baklava',
      'بقلاوة',
      'Баклава',
      'Baklava',
      'Baklava',
      'Μπακλαβάς',
      'בקלבה',
      'בקלבה',
      'Baklava',
      'Baklava',
      'Baklava',
      'Baklava',
      'בקלבה',
      'Baklava',
      'Baklava',
      'Baklava',
      'バクラヴァ',
      'ბაკლავა',
      '바클라바',
      'Baklava',
      'Baklava',
      'Baklava',
      'Baklava',
      'Баклава',
      'Baklava',
      'Баклава',
      'Baklava',
      'Baklava',
      'บะกลาวา',
      'Баклава',
    ][lang()],
    archimedian: [
      'Archimedian',
      'Archimedian',
      'أرخميدسي',
      'Архимедов',
      'Archimediánský',
      'Archimedisk',
      'Αρχιμήδης',
      'ארכימדיסי',
      'ארכימדיסי',
      'Arquimediano',
      'Archimedinen',
      'Archimédien',
      'Archimédien',
      'ארכימדיסי',
      'Archimedési',
      'Archimed',
      'Archimediano',
      'アルキメデスの',
      'არქიმედული',
      '아르키메데스의',
      'Archimedes',
      'Archimedisch',
      'Archimedesowy',
      'Arquimediano',
      'Arhimedeic',
      'Архимедов',
      'Archimedický',
      'Архимедов',
      'Archimedisk',
      'Archimedes',
      'Archimedes',
    ][lang()],
    logarithmic: [
      'Logarithmic',
      'Logaritmik',
      'لوغاريتمي',
      'Логаритмичен',
      'Logaritmický',
      'Logaritmisk',
      'Λογαριθμικός',
      'לוגריתמי',
      'לוגריתמי',
      'Logarítmico',
      'Logaritminen',
      'Logarithmique',
      'Logarithmique',
      'לוגריתמי',
      'Logaritmikus',
      'Logaritmik',
      'Logaritmico',
      '対数',
      'ლოგარითმული',
      '로그',
      'Logarithmískt',
      'Logaritmisch',
      'Logarytmiczny',
      'Logarítmico',
      'Logaritmic',
      'Логаритмичен',
      'Logaritický',
      'Логаритмичан',
      'Logaritmisk',
      'เลขานุการ',
      'Логарифмічний',
      'لوگارتھمک',
    ][lang()],
    discord_server: [
      'Discord Server',
      'Discord Sunucusu',
      'خادم Discord',
      'Discord Сървър',
      'Discord Server',
      'Discord Server',
      'Διακομιστής Discord',
      'שרת Discord',
      'שרת Discord',
      'Servidor de Discord',
      'Discord-palvelin',
      'Serveur Discord',
      'Serveur Discord',
      'שרת Discord',
      'Discord Szerver',
      'Server Discord',
      'Server Discord',
      'Discord サーバー',
      'Discord სერვერი',
      'Discord 서버',
      'Discord Vefverslun',
      'Discord Server',
      'Discord Server',
      'Server Discord',
      'Server Discord',
      'Discord Сервер',
      'Discord Server',
      'Discord Сервер',
      'Discord Server',
      'เซิร์ฟเวอร์ Discord',
      'Discord Сервер',
      'سرور Discord',
    ][lang()],
    brave_warning: [
      'Please do not use MxoBot with Brave Browser. Brave Browser can modify image R,G,B values which can result in MxoBot skipping pixels. MxoBot is compatible with Firefox, Edge, and Chrome browsers.',
      "Lütfen MxoBot'u Brave Tarayıcı ile kullanmayın. Brave Tarayıcı, görüntü R, G, B değerlerini değiştirebilir ve bu da MxoBot'un pikselleri atlamasına neden olabilir. MxoBot, Firefox, Edge ve Chrome tarayıcıları ile uyumludur.",
      'يرجى عدم استخدام MxoBot مع متصفح Brave. يمكن لمتصفح Brave تعديل قيم R و G و B للصورة مما يمكن أن يؤدي إلى تخطي MxoBot للبكسل. يتوافق MxoBot مع متصفحات Firefox و Edge و Chrome.',
      'Моля, не използвайте MxoBot с Brave Browser. Brave Browser може да модифицира стойностите на R, G, B на изображението, което може да доведе до пропускане на пикселите на MxoBot. MxoBot е съвместим с браузърите Firefox, Edge и Chrome.',
      'Prosím, nepoužívejte MxoBot s prohlížečem Brave. Prohlížeč Brave může modifikovat hodnoty R, G, B obrázku, což může vést k vynechání pixelů MxoBotem. MxoBot je kompatibilní s prohlížeči Firefox, Edge a Chrome.',
      'Brug ikke MxoBot med Brave Browser. Brave Browser kan ændre billedets R, G, B-værdier, hvilket kan resultere i, at MxoBot springer over pixels. MxoBot er kompatibel med Firefox, Edge og Chrome browsere.',
      'Bitte verwenden Sie MxoBot nicht mit dem Brave Browser. Der Brave Browser kann die R, G, B-Werte von Bildern ändern, was dazu führen kann, dass MxoBot Pixel überspringt. MxoBot ist mit den Browsern Firefox, Edge und Chrome kompatibel.',
      'Παρακαλώ μη χρησιμοποιείτε το MxoBot με τον περιηγητή Brave. Ο περιηγητής Brave μπορεί να τροποποιήσει τις τιμές R, G, B της εικόνας, πράγμα που μπορεί να οδηγήσει στο να παραλείψει το MxoBot τα pixels. Το MxoBot είναι συμβατό με τους περιηγητές Firefox, Edge και Chrome.',
      'Bonvolu ne uzi MxoBot-on kun la Brave Retumilo. Brave Retumilo povas modifi la valorojn de R, G, B en bildo, kio povas rezulti en MxoBot saltante je bilderoj. MxoBot estas kongrua kun la retumiloj Firefox, Edge kaj Chrome.',
      'Por favor, no uses MxoBot con Brave Browser. Brave Browser puede modificar los valores de R, G, B de las imágenes, lo que puede provocar que MxoBot salte píxeles. MxoBot es compatible con los navegadores Firefox, Edge y Chrome.',
      'Älä käytä MxoBotia Brave-selaimella. Brave-selain voi muokata kuvan R, G, B -arvoja, mikä voi johtaa MxoBotin pikselien ohittamiseen. MxoBot on yhteensopiva Firefoxin, Edgen ja Chromen selainten kanssa.',
      'Veuillez ne pas utiliser MxoBot avec le navigateur Brave. Le navigateur Brave peut modifier les valeurs R, G, B des images, ce qui peut entraîner le saut de pixels par MxoBot. MxoBot est compatible avec les navigateurs Firefox, Edge et Chrome.',
      'אנא אל תשתמשו ב-MxoBot עם דפדפן Brave. דפדפן Brave יכול לשנות ערכי R, G, B של תמונות, וזה יכול להוביל לדילוג על פיקסלים על ידי MxoBot. MxoBot תואם לדפדפנים Firefox, Edge ו-Chrome.',
      'Kérlek, ne használd a MxoBotot a Brave böngészővel. A Brave böngésző módosíthatja a kép R, G, B értékeit, amelyek eredményezhetik a MxoBot pixel kihagyását. A MxoBot kompatibilis a Firefox, Edge és Chrome böngészőkkel.',
      'Tolong jangan gunakan MxoBot dengan Brave Browser. Brave Browser dapat mengubah nilai gambar R, G, B yang dapat menyebabkan MxoBot melewatkan piksel. MxoBot kompatibel dengan peramban Firefox, Edge, dan Chrome.',
      'Si prega di non utilizzare MxoBot con Brave Browser. Brave Browser può modificare i valori R, G, B delle immagini, il che può portare a MxoBot che salta i pixel. MxoBot è compatibile con i browser Firefox, Edge e Chrome.',
      'Brave ブラウザで MxoBot を使用しないでください\u3002 Brave ブラウザは画像の R\u3001G\u3001B 値を変更できるため\u3001MxoBot がピクセルをスキップする原因となる可能性があります\u3002 MxoBot は Firefox\u3001Edge\u3001および Chrome ブラウザと互換性があります\u3002',
      'გთხოვთ, არ გამოიყენოთ MxoBot Brave ბრაუზერთან. Brave ბრაუზერი შეიძლება შეცვალოს სურათის R, G, B მნიშვნელობები, რაც შეიძლება წარწეროს MxoBot პიქსელების გამოტევებას. MxoBot შეესაბამება Firefox, Edge და Chrome ბრაუზერებს.',
      'Brave 브라우저에서 MxoBot을 사용하지 마십시오. Brave 브라우저는 이미지 R, G, B 값을 수정할 수 있으며 이로 인해 MxoBot이 픽셀을 건너뛸 수 있습니다. MxoBot은 Firefox, Edge 및 Chrome 브라우저와 호환됩니다.',
      'Vennligst ikke bruk MxoBot med Brave Browser. Brave Browser kan endre bildets R, G, B-verdier, noe som kan resultere i at MxoBot hopper over piksler. MxoBot er kompatibel med Firefox, Edge og Chrome-nettlesere.',
      'Gebruik MxoBot alstublieft niet met Brave Browser. Brave Browser kan de R, G, B-waarden van afbeeldingen wijzigen, wat kan resulteren in het overslaan van pixels door MxoBot. MxoBot is compatibel met de Firefox, Edge en Chrome-browsers.',
      'Proszę nie używać MxoBot z przeglądarką Brave. Przeglądarka Brave może modyfikować wartości R, G, B obrazów, co może skutkować pominięciem pikseli przez MxoBot. MxoBot jest kompatybilny z przeglądarkami Firefox, Edge i Chrome.',
      'Por favor, não use o MxoBot com o Brave Browser. O Brave Browser pode modificar os valores de R, G, B das imagens, o que pode resultar no MxoBot pulando pixels. O MxoBot é compatível com os navegadores Firefox, Edge e Chrome.',
      'Vă rugăm să nu utilizați MxoBot cu Brave Browser. Brave Browser poate modifica valorile R, G, B ale imaginilor, ceea ce poate duce la MxoBot să sări peste pixeli. MxoBot este compatibil cu browserele Firefox, Edge și Chrome.',
      'Пожалуйста, не используйте MxoBot с Brave Browser. Brave Browser может изменять значения R, G, B изображений, что может привести к пропуску пикселей MxoBot. MxoBot совместим с браузерами Firefox, Edge и Chrome.',
      'Prosím, nepoužívajte MxoBot s prehliadačom Brave. Prehliadač Brave môže upravovať hodnoty R, G, B obrázka, čo môže spôsobiť, že MxoBot preskočí pixely. MxoBot je kompatibilný s prehliadačmi Firefox, Edge a Chrome.',
      'Молим вас, немојте користити MxoBot са Brave Browser-ом. Brave Browser може изменити вредности R, G, B слике, што може резултовати прескакањем пиксела од стране MxoBot-а. MxoBot је компатибилан са прегледачима Firefox, Edge и Chrome.',
      'Använd inte MxoBot med Brave Browser. Brave Browser kan ändra bildens R, G, B-värden vilket kan resultera i att MxoBot hoppar över pixlar. MxoBot är kompatibel med Firefox, Edge och Chrome webbläsare.',
      'โปรดอย่าใช้ MxoBot กับ Brave Browser บราวเซอร์ Brave สามารถแก้ไขค่า R, G, B ของภาพซึ่งอาจทำให้ MxoBot ข้ามพิกเซล MxoBot สามารถทำงานร่วมกับเบราว์เซอร์ Firefox, Edge และ Chrome',
      'Будь ласка, не використовуйте MxoBot з Brave Browser. Brave Browser може змінювати значення R, G, B зображень, що може призвести до того, що MxoBot буде пропускати пікселі. MxoBot сумісний з браузерами Firefox, Edge та Chrome.',
      'MxoBotتەڭ Brave Browser ئىشلەمىگە ئىشلىتمىڭ. Brave Browser ئىشلىتىش R\u060C G\u060C B تاللانمىسىنى ئۆزگەرتەلەيدۇ\u060C بۇ MxoBot نى پىكسىلنى سەل قويۇشقا ئۇلايدۇ. MxoBot Firefox, Edge ۋە Chrome براۋزېرلەرى بىلەن تەمىنلىگەن.',
      'Vui lòng không sử dụng MxoBot với trình duyệt Brave. Trình duyệt Brave có thể sửa đổi giá trị R, G, B của hình ảnh, điều này có thể dẫn đến MxoBot bỏ qua các pixel. MxoBot tương thích với các trình duyệt Firefox, Edge và Chrome.',
      '请不要在 Brave 浏览器中使用 MxoBot\u3002Brave 浏览器可以修改图像的 R\u3001G\u3001B 值\uFF0C这可能导致 MxoBot 跳过像素\u3002MxoBot 与 Firefox\u3001Edge 和 Chrome 浏览器兼容\u3002',
      '請勿在 Brave 瀏覽器中使用 MxoBot\u3002Brave 瀏覽器可以修改圖像的 R\u3001G\u3001B 值\uFF0C可能導致 MxoBot 跳過像素\u3002MxoBot 與 Firefox\u3001Edge 和 Chrome 瀏覽器相容\u3002',
    ][lang()],
    welcome: [
      "Welcome to Mxo bot! You can join our Discord server through the links in the bot's menu, Translations may not be 100% accurate -Made By 0mamii",
      "Mxo bot'a hoş geldiniz! Bot menüsündeki bağlantılar aracılığıyla Discord sunucumuza katılabilirsiniz, Çeviriler 100% doğru olmayabilir -0mamii tarafından yapıldı",
      'مرحبًا بك في بوت Mxo! يمكنك الانضمام إلى خوادمنا على Discord و  من خلال الروابط في قائمة البوت\u060C تم صنعه بواسطة 0mamii',
      'Добре дошли в бота Mxo! Можете да се присъедините към нашите сървъри в Discord и чрез връзките в менюто на бота, направено от 0mamii',
      'Vítejte v botu Mxo! Můžete se připojit k našim serverům na Discordu a prostřednictvím odkazů v menu bota, vytvořeno 0mamii',
      'Velkommen til Mxo-bot! Du kan deltage i vores Discord- og-servere gennem linkene i botens menu, lavet af 0mamii',
      'Willkommen bei Mxo bot! Sie können unseren Discord- und-Servern über die Links im Menü des Bots beitreten, hergestellt von 0mamii',
      'Καλώς ήλθατε στον bot Mxo! Μπορείτε να εγγραφείτε στους διακομιστές μας στο Discord και το μέσω των συνδέσμων στο μενού του bot, φτιαγμένο από τον 0mamii',
      'Bonvenon al la roboto Mxo! Vi povas aliĝi al niaj Discord- kaj-serviloj per la ligiloj en la menuo de la roboto, farita de 0mamii',
      '\xA1Bienvenido a Mxo bot! Puedes unirte a nuestros servidores de Discord y a través de los enlaces en el menú del bot, hecho por 0mamii',
      'Tervetuloa Mxo-bottiin! Voit liittyä Discord- ja-palvelimiimme botin valikossa olevien linkkien kautta, tekijä: 0mamii',
      'Bienvenue sur Mxo bot ! Vous pouvez rejoindre nos serveurs Discord et via les liens dans le menu du bot, réalisé par 0mamii',
      'ברוכים הבאים לבוט Mxo! תוכלו להצטרף לשרתי ה-Discord וה- שלנו דרך הקישורים בתפריט הבוט, נעשה על ידי 0mamii',
      'Üdvözöljük a Mxo botban! A Discord és  szervereinkhez csatlakozhatsz a bot menüjében található linkek segítségével, készítette: 0mamii',
      'Selamat datang di bot Mxo! Anda dapat bergabung dengan server Discord dan  kami melalui tautan di menu bot, dibuat oleh 0mamii',
      'Benvenuto in Mxo bot! Puoi unirti ai nostri server Discord e  attraverso i link nel menu del bot, realizzato da 0mamii',
      'Mxo botへようこそ\uFF01ボットのメニュー内のリンクを介してDiscordとサーバーに参加できます\u30020mamii製\u3002',
      'კეთილი ხართ Mxo ბოტში! შეგიძლიათ შეერთოთ ჩვენს Discord- და - სერვერებში ბოტის მენიუში მითითებული ბმულებით, 0mamii- ის შექმნილი',
      'Mxo 봇에 오신 것을 환영합니다! 봇 메뉴의 링크를 통해 Discord 및  서버에 가입하실 수 있습니다. 0mamii가 제작했습니다',
      'Velkommen til Mxo bot! Du kan bli med på våre Discord- og -servere via lenkene i botens meny, laget av 0mamii',
      'Welkom bij Mxo bot! Je kunt onze Discord- en -servers betreden via de links in het menu van de bot, gemaakt door 0mamii',
      'Witaj w bocie Mxo! Możesz dołączyć do naszych serwerów Discord i  za pomocą linków w menu bota, wykonane przez 0mamii',
      'Bem-vindo ao bot Mxo! Você pode entrar em nossos servidores do Discord e  através dos links no menu do bot, feito por 0mamii',
      'Bine ați venit la botul Mxo! Puteți să vă alăturați serverelor noastre de Discord și  prin intermediul linkurilor din meniul botului, realizat de 0mamii',
      'Добро пожаловать в бот Mxo! Вы можете присоединиться к нашим серверам Discord и  по ссылкам в меню бота, создано 0mamii',
      'Vitajte v bote Mxo! Môžete sa pripojiť k našim serverom na Discorde a  cez odkazy v menu bota, vytvorené 0mamii',
      'Добродошли у Mxo бота! Можете се придружити нашим Discord и  серверима преко веза у ботовом менију, направио 0mamii',
      'Välkommen till Mxo bot! Du kan gå med i våra Discord- och -servrar genom länkarna i botten menyn, skapad av 0mamii',
      'ยินดีต้อนรับสู่บอต Mxo! คุณสามารถเข้าร่วมเซิร์ฟเวอร์ Discord และ  ของเราผ่านลิงก์ในเมนูของบอต ที่ทำโดย 0mamii',
      'Ласкаво просимо до бота Mxo! Ви можете приєднатися до наших серверів Discord і  за посиланнями в меню бота, створено 0mamii',
      'Mxo بوتغا خەشكەلسىز! سىز بوتنىڭ مېنىيىدىكى ئۇلىنىشلار ئارقىلىق Discord ۋە  تىزىملىكىمىزگە قوشۇلالايسىز\u060C 0mamii تارتتى.',
      'Chào mừng bạn đến với Mxo bot! Bạn có thể tham gia các máy chủ Discord và  của chúng tôi thông qua các liên kết trong menu của bot, do 0mamii tạo',
      '欢迎来到 Mxo 机器人\uFF01您可以通过机器人菜单中的链接加入我们的 Discord 和  服务器\uFF0C由 0mamii 制作\u3002',
      '歡迎來到 Mxo 機器人\uFF01您可以通過機器人選單中的連結加入我們的 Discord 和  伺服器\uFF0C由 0mamii 製作\u3002',
    ][lang()],
    warning: [
      "Do not use any copy bots of Mxo. These are just bots that have been renamed or leaked your information. It's not possible to make the Mxo bot faster than this; the rest depends on your hardware.",
      "Mxo'nun kopya botlarını kullanmayın. Bunlar sadece yeniden adlandırılmış veya bilgileriniz sızdırılmış botlardır. Mxo botunu bundan daha hızlı yapmak mümkün değil; geri kalanı donanımınıza bağlıdır.",
      'لا تستخدم أي نسخ من البوتات المقلدة لـ Mxo. هذه مجرد بوتات تمت إعادة تسميتها أو تم تسريب معلوماتك. لا يمكن جعل بوت Mxo أسرع من ذلك\u061B الباقي يعتمد على الأجهزة الخاصة بك.',
      'Не използвайте никакви копирани ботове на Mxo. Това са просто ботове, които са били преименувани или са изтичали информацията ви. Не е възможно да се направи Mxo бот по-бърз от това; останалото зависи от вашето оборудване.',
      'Nepoužívejte žádné kopírovací boty od Mxo. Jsou to pouze boti, které byly přejmenovány nebo unikly vaše informace. Není možné udělat Mxo bota rychlejšího než toto; zbytek závisí na vašem hardwaru.',
      'Brug ikke nogen kopier af Mxo-bots. Disse er bare bots, der er blevet omdøbt eller har lækket dine oplysninger. Det er ikke muligt at gøre Mxo-botten hurtigere end dette; resten afhænger af din hardware.',
      'Verwenden Sie keine Kopier-Bots von Mxo. Dies sind nur Bots, die umbenannt oder Ihre Informationen weitergegeben haben. Es ist nicht möglich, den Mxo-Bot schneller zu machen als dies; der Rest hängt von Ihrer Hardware ab.',
      'Μην χρησιμοποιείτε καμία αντιγραφή των Mxo bots. Αυτά είναι απλά bots που έχουν μετονομαστεί ή έχουν διαρρεύσει τις πληροφορίες σας. Δεν είναι δυνατόν να κάνετε το bot Mxo πιο γρήγορο από αυτό, τα υπόλοιπα εξαρτώνται από τον υπολογιστή σας.',
      'Ne uzas iu kopion de Mxo-botoj. Tio estas nur robotaj kiuj estas renomumitaj aŭ elŝutintaj viajn informojn. Ne eblas plirapidigi la Mxo boton pli ol ĉi tio; la cetero dependas de via aparaturo.',
      'No uses ninguna copia de los bots de Mxo. Estos son solo bots que han sido renombrados o que han filtrado tu información. No es posible acelerar el bot de Mxo más que esto; el resto depende de tu hardware.',
      'Älä käytä mitään Mxo-bottien kopioita. Nämä ovat vain bottien uudelleennimettyjä tai vuotaneita versioita, eikä Mxo-botia voi tehdä nopeammaksi kuin tämä; loput riippuu laitteistostasi.',
      "N'utilisez pas de copies des bots Mxo. Il s'agit simplement de bots qui ont été renommés ou qui ont divulgué vos informations. Il n'est pas possible de rendre le bot Mxo plus rapide que cela; le reste dépend de votre matériel.",
      'אל תשתמשו בשום עותק של הבוטים של Mxo. אלה הם פשוט בוטים ששונו שם או נצלצלו את המידע שלך. אי אפשר להאיץ את הבוט של Mxo מעבר לזה, השאר תלוי בחומרת המחשב שלך.',
      'Ne használj másolatot Mxo botokból. Ezek csak olyan botok, amelyeket átneveztek, vagy szivárogtattak ki az adataidat. Nem lehetséges a Mxo botot ennél gyorsabbá tenni; a többi a hardvereden múlik.',
      'Jangan gunakan salinan bot Mxo. Ini hanyalah bot yang telah diganti nama atau bocor informasi Anda. Tidak mungkin membuat bot Mxo lebih cepat dari ini; sisanya tergantung pada perangkat keras Anda.',
      "Non utilizzare alcuna copia dei bot di Mxo. Questi sono solo bot che sono stati rinominati o hanno divulgato le tue informazioni. Non è possibile rendere il bot Mxo più veloce di così; il resto dipende dall'hardware.",
      'Mxoのコピー\u30FBボットを使用しないでください\u3002これらは単に名前が変更されたか\u3001情報が漏洩したボットです\u3002Mxoボットをこれ以上高速化することはできません\u3002残りはあなたのハードウェアにかかっています\u3002',
      'გთხოვთ, ნუ გამოიყენებთ Mxo-ს ასლი ბოტებს. ეს მხარდაჭერის ბოტებია, რომლებიც შეისწავლა ახალ სახელს ან დაფუძნებულ ინფორმაციის გასაცემად. Mxo ბოტის აღევა შეუძლებელია ამის შემდეგ, დაბალი ხარივიდან არის ყველა.',
      'Mxo의 복사 봇을 사용하지 마십시오. 이들은 그냥 이름을 변경하거나 정보가 유출된 봇일 뿐입니다. 이보다 Mxo 봇을 더 빠르게 만드는 것은 불가능합니다; 나머지는 하드웨어에 달려 있습니다.',
      'Ikke bruk noen kopiboter av Mxo. Dette er bare boter som har blitt omdøpt eller lekket informasjonen din, og det er ikke mulig å gjøre Mxo-boten raskere enn dette; resten avhenger av maskinvaren din.',
      'Gebruik geen enkele kopiebots van Mxo. Dit zijn gewoon bots die zijn hernoemd of gelekte informatie bevatten. Het is niet mogelijk om de Mxo-bot sneller te maken dan dit; de rest hangt af van je hardware.',
      'Nie używaj żadnych kopii botów Mxo. Są to po prostu boty, które zostały przemianowane lub wyciekły twoje informacje. Nie jest możliwe przyspieszenie bota Mxo bardziej niż to; reszta zależy od twojego sprzętu.',
      'Não use cópias de bots da Mxo. Estes são apenas bots que foram renomeados ou vazaram suas informações. Não é possível acelerar o bot da Mxo mais do que isso; o resto depende do seu hardware.',
      'Nu utilizați nicio copie a boturilor Mxo. Acestea sunt doar boturi care au fost redenumite sau care au scurs informațiile dvs. Nu este posibil să faceți botul Mxo mai rapid decât atât; restul depinde de hardware-ul dvs.',
      'Пожалуйста, не используйте копии ботов Mxo. Это просто боты, которые были переименованы или утекли ваши данные. Невозможно сделать бота Mxo быстрее, чем это; остальное зависит от вашего оборудования.',
      'Nepoužívajte žiadne kópie botov od Mxo. Ide o len boty, ktoré boli premenované alebo unikli vaše informácie. Nie je možné urobiť Mxo bota rýchlejším než toto; zvyšok závisí na vašom hardvéri.',
      'Молим вас, немојте користити ниједну копију ботова Мxo. Ово су само ботови који су преименовани или су излазили ваше информације. Није могуће направити Мxo бота бржим од овога; остатак зависи од вашег хардвера.',
      'Använd inte några kopior av Mxo-bots. Dessa är bara bots som har omdöpts eller läckt din information. Det är inte möjligt att göra Mxo-boten snabbare än detta; resten beror på din hårdvara.',
      'อย่าใช้บอทสำเนาของ Mxo แบบใด ๆ ก็ตาม นั่นเป็นเพียงบอทที่ถูกเปลี่ยนชื่อหรือรั่วไหลข้อมูลของคุณเท่านั้น ไม่สามารถทำให้บอท Mxo เร็วกว่านี้ได้ เรื่องที่เหลืออยู่เกี่ยวกับฮาร์ดแวร์ของคุณ',
      'Будь ласка, не використовуйте копії ботів Mxo. Це просто боти, які були перейменовані або витікали ваші дані. Неможливо зробити бота Mxo швидше, ніж це; решта залежить від вашого обладнання.',
      'مەن Mxo بوتتىكى چەپتەرلەرنى ئىشلىتمىڭ. بۇ فقىرقا مەخپىي قىلىنغان ياكى سىزنىڭ ئۇچۇرىڭىزنى سىزدە سىزغا ئېشىپ بېرىلغان بوتلار. Mxo بوتتىنى بۇنداق ئىچىدە تىزىش ئالاھىدە مۇمكىن بولمايدۇ\u061B قالغان قىسمى سىزنىڭ دونىڭىزغا باغلىنىدۇ.',
      'Không sử dụng bất kỳ bản sao nào của bot Mxo. Đây chỉ là các bot đã được đổi tên hoặc rò rỉ thông tin của bạn. Không thể làm cho bot Mxo nhanh hơn điều này; phần còn lại phụ thuộc vào phần cứng của bạn.',
      '请不要使用任何 Mxo 的复制机器人\u3002这些只是被重新命名或泄漏了您的信息的机器人\u3002无法使 Mxo 机器人比这更快\uFF1B其余取决于您的硬件\u3002',
      '請勿使用任何 Mxo 的複製機器人\u3002這些只是被重新命名或洩漏了您的資訊的機器人\u3002無法使 Mxo 機器人比這更快\uFF1B其餘取決於您的硬件\u3002',
    ][lang()],
    protectionwarning: [
      'This may result in your account being banned, please use this with awareness of pp.io rules',
      'Bu, hesabınızın yasaklanmasına neden olabilir, lütfen pp.io kurallarının farkında olarak kullanın',
      'قد يؤدي ذلك إلى حظر حسابك، يرجى استخدام هذا بوعي لقوانين pp.io',
      'Това може да доведе до забрана на акаунта ви, моля, използвайте това с осведоменост за правилата на pp.io',
      'To může mít za následek zablokování vašeho účtu, prosím, používejte to s povědomím o pravidlech pp.io',
      'Dette kan resultere i, at din konto bliver spærret, vær venlig at bruge dette med kendskab til pp.io"s regler',
      'Dies kann dazu führen, dass Ihr Konto gesperrt wird. Bitte verwenden Sie dies im Bewusstsein der pp.io-Regeln',
      'Αυτό μπορεί να οδηγήσει στον αποκλεισμό του λογαριασμού σας, παρακαλούμε χρησιμοποιήστε το με ενημέρωση για τους κανόνες του pp.io',
      'Tio povas rezulti en via konto esti malpermesita, bonvolu uzi tion kun konscio de la reguloj de pp.io',
      'Esto puede resultar en el bloqueo de su cuenta, por favor, úselo con conocimiento de las reglas de pp.io',
      'Tämä saattaa johtaa tilisi sulkemiseen, käytäthän tätä tietoisena pp.io:n säännöistä',
      'Cela pourrait entraîner la suspension de votre compte, veuillez utiliser cette fonctionnalité en connaissance des règles de pp.io',
      'זה עשוי להביא לחסימת החשבון שלך, אנא השתמש בזה במודעות לחוקי pp.io',
      'Ez az Ön fiókjának letiltásához vezethet, kérjük, használja ezt az pp.io szabályainak tudatában',
      'Ini bisa mengakibatkan akun Anda diblokir, harap gunakan dengan menyadari aturan pp.io',
      'Ciò potrebbe comportare il blocco del tuo account, si prega di utilizzare questa funzione con la consapevolezza delle regole di pp.io',
      'これによりアカウントが停止される可能性がありますので、pp.ioのルールを認識した上でご利用ください',
      'ეს შეიძლება დააბლოკოს თქვენი ანგარიში, გთხოვთ, გამოიყენოთ ეს pp.io წესების გარეშე',
      '이로 인해 귀하의 계정이 차단될 수 있습니다. pp.io 규칙을 인식한 상태에서 사용하십시오',
      'Dette kan føre til at kontoen din blir stengt, vennligst bruk dette med bevissthet om pp.io-reglene',
      'Dit kan resulteren in het verbannen van uw account, gebruik dit alstublieft met kennis van de pp.io regels',
      'Może to skutkować zablokowaniem twojego konta, proszę korzystaj z tego z uwzględnieniem zasad pp.io',
      'Isso pode resultar no bloqueio da sua conta, por favor, use com consciência das regras do pp.io',
      'Acest lucru poate duce la blocarea contului dumneavoastră, vă rugăm să utilizați această funcționalitate cu cunoștință de cauză a regulilor pp.io',
      'Это может привести к блокировке вашей учетной записи, пожалуйста, используйте это с учетом правил pp.io',
      'To môže mať za následok zablokovanie vášho účtu, prosím, použite to s vedomím pravidiel pp.io',
      'Ovo može rezultirati blokiranjem vašeg računa, molimo koristite sa svesti o pravilima pp.io',
      'Detta kan resultera i att ditt konto blir blockerat, använd detta med medvetenhet om pp.io-reglerna',
      'นี่อาจ导致บัญชีของคุณถูกบล็อก โปรดใช้ด้วยความรู้เกี่ยวกับกฎของ pp.io',
      'Это може призвести до блокування вашого облікового запису, будь ласка, використовуйте це з усвідомленням правил pp.io',
      'قد يؤدي هذا إلى حظر حسابك، يرجى استخدام هذا بوعي لقوانين pp.io',
      '这可能会导致您的帐户被封禁，请在使用时注意pp.io的规则',
    ][lang()],
    botwarning: [
      'Using bots is only allowed in certain locations, botting certain locations may result in your account being banned, please use with awareness of pp.io rules',
      'Bot kullanımı sadece belirli yerlerde serbesttir, bazı belirli konumları botlamak hesabınızın yasaklanmasına neden olabilir, lütfen pp.io kurallarının farkında olarak kullanın',
      'استفاده از ربات فقط در مکان‌های مشخص مجاز است، برخی از مکان‌های خاص را ربات کردن ممکن است منجر به مسدود شدن حساب شما شود، لطفاً با آگاهی از قوانین pp.io استفاده کنید',
      'Използването на ботове е разрешено само на определени места, ботването на някои определени места може да доведе до блокиране на акаунта ви, моля, използвайте с този аспект на правилата на pp.io',
      'Boty můžete používat pouze na určitých místech, botování určitých míst může vést k zablokování vašeho účtu, prosím, používejte to s ohledem na pravidla pp.io',
      'Du kan kun bruge bots på bestemte steder, at bruge bots på visse steder kan resultere i din konto bliver blokeret, brug dette med opmærksomhed på pp.io regler',
      'Sie können Bots nur an bestimmten Orten verwenden, das Boten bestimmter Orte kann dazu führen, dass Ihr Konto gesperrt wird. Bitte verwenden Sie dies mit dem Bewusstsein für die Regeln von pp.io',
      'Μπορείτε να χρησιμοποιείτε μποτ μόνο σε συγκεκριμένες τοποθεσίες, η χρήση μποτ σε ορισμένες τοποθεσίες μπορεί να οδηγήσει στον αποκλεισμό του λογαριασμού σας, παρακαλούμε χρησιμοποιήστε το με ενημέρωση για τους κανόνες του pp.io',
      'Vi povas uzi boton nur en certaj lokoj, uzi boton en certaj lokoj povas rezulti en via konto estas malpermesita, bonvolu uzi tion kun konscio de la reguloj de pp.io',
      'Solo se permite el uso de bots en lugares específicos, el botear ciertos lugares puede resultar en el bloqueo de su cuenta, por favor, use esto con conocimiento de las reglas de pp.io',
      'Botteja voi käyttää vain tietyillä paikoilla, tietyissä paikoissa bottaaminen voi johtaa tilisi sulkemiseen, käytäthän tätä tietoisena pp.io:n säännöistä',
      'Vous ne pouvez utiliser des bots que dans certains endroits, l"utilisation de bots dans certains endroits peut entraîner la suspension de votre compte, veuillez utiliser cette fonctionnalité en connaissance des règles de pp.io',
      'אתה יכול להשתמש בבוטים רק במקומות מסוימים, השימוש בבוטים במקומות מסוימים עשוי להוביל לחסימת החשבון שלך, אנא השתמש בזה במודעות לחוקי pp.io',
      'Botokat csak bizonyos helyeken lehet használni, néhány konkrét hely botolása azonban az Ön fiókjának letiltásához vezethet, kérjük, használja ezt az pp.io szabályainak tudatában',
      'Anda hanya dapat menggunakan bot di lokasi tertentu, penggunaan bot di beberapa lokasi tertentu dapat menyebabkan akun Anda diblokir, harap gunakan ini dengan menyadari aturan pp.io',
      'Puoi utilizzare i bot solo in determinati luoghi, l"uso di bot in alcuni luoghi può comportare il blocco del tuo account, si prega di utilizzare questa funzione con la consapevolezza delle regole di pp.io',
      '特定の場所でのみボットを使用できます、特定の場所でのボットを使用するとアカウントが停止される可能性がありますので、pp.ioのルールを認識した上でご利用ください',
       'შეგიძლიათ ბოტებს გამოიყენოთ მხოლოდ საკმარისო ადგილებში, ბოტების გამოყენება საკმარისო ადგილებში შეიძლება თქვენი ანგარიშის ბლოკირება, გთხოვთ, გამოიყენოთ ეს pp.io წესების გარეშე',
      '특정 위치에서만 봇을 사용할 수 있습니다, 특정 위치에서의 봇 사용은 귀하의 계정이 차단될 수 있습니다. pp.io 규칙을 인식한 상태에서 사용하십시오',
      'Du kan bare bruke bøter på bestemte steder, å bruke bøter på visse steder kan føre til at kontoen din blir stengt, vennligst bruk dette med bevissthet om pp.io-reglene',
      'U kunt bots alleen gebruiken op bepaalde plaatsen, het gebruiken van bots op bepaalde plaatsen kan resulteren in het verbannen van uw account, gebruik dit alstublieft met kennis van de pp.io regels',
      'Możesz używać botów tylko w określonych miejscach, botowanie niektórych miejsc może skutkować zablokowaniem twojego konta, proszę korzystaj z tego z uwzględnieniem zasad pp.io',
      'Você só pode usar bots em lugares específicos, usar bots em alguns lugares específicos pode resultar no bloqueio da sua conta, por favor, use com consciência das regras do pp.io',
      'Puteți utiliza roboți doar în anumite locații, folosirea roboților în unele locații poate duce la blocarea contului dvs., vă rugăm să utilizați această funcționalitate cu cunoștință de cauză a regulilor pp.io',
      'Вы можете использовать ботов только в определенных местах, использование ботов в некоторых определенных местах может привести к блокировке вашей учетной записи, пожалуйста, используйте это с учетом правил pp.io',
      'Boty môžete používať iba na určitých miestach, použitie bota na niektorých miestach môže mať za následok zablokovanie vášho účtu, prosím, použite to s vedomím pravidiel pp.io',
      'Možete koristiti botove samo na određenim lokacijama, korištenje botova na određenim lokacijama može rezultirati blokiranjem vašeg računa, molimo koristite sa svesti o pravilima pp.io',
      'Du kan bara använda botar på vissa platser, att använda botar på vissa platser kan resultera i att ditt konto blir blockerat, använd detta med medvetenhet om pp.io-reglerna',
      'คุณสามารถใช้บอทได้เฉพาะในสถานที่บางแห่งเท่านั้น การใช้บอทในสถานที่บางแห่งอาจ导致บัญชีของคุณถูกบล็อก โปรดใช้ด้วยความรู้เกี่ยวกับกฎของ pp.io',
      'Ви можете використовувати ботів лише в певних місцях, використання ботів у деяких певних місцях може призвести до блокування вашого облікового запису, будь ласка, використовуйте це з усвідомленням правил pp.io',
      'قد يؤدي هذا إلى حظر حسابك، يرجى استخدام هذا بوعي لقوانين pp.io',
      'これ可能会导致您的帐户被封禁，请在使用时注意pp.io的规则',
    ][lang()]
  }
// ==/Locales==

// ==Notification Check==
  if (!localStorage.getItem('firstUse')) {
    showCustomToast(i18n.welcome, { timeOut: 20000 })
    showCustomToast(i18n.warning, { timeOut: 30000 })
    localStorage.setItem('firstUse', 'true')
  }
  async function checkBrave() {
    if (navigator.brave && (await navigator.brave.isBrave())) {
      if (!localStorage.getItem('firstBraveWarning')) {
        showCustomToast(i18n.brave_warning)
        localStorage.setItem('firstBraveWarning', 'true')
      }
    }
  }
  checkBrave()

// ==/Notification Check==

// ==Config==
const MXOBOT_EXPERIMENTAL_USE_MULTI_ACC = false;
const MXOBOT_EXPERIMENTAL_STORE_LOADED_IMAGES = false;
const MXOBOT_EXPERIMENTAL_SAVE_LAST_BOTTING = false;
const MXOBOT_ANIMATE_BOT_CANVAS = true;
const MXOBOT_CHECK_MAP_DYNAMICALLY = false;
const BOT_DO_NOT_DITHER = false;
const MXOBOT_DEBUG_MODE = false;
let MXOBOT_TIMEOUT = localStorage.getItem('mxobot_timeout') ?? 20;
const MXOBOT_IMG_NOT_LOADED = 'https://r.resimlink.com/rkU4RSlg.png'
const MXOBOT_BOT_TITLE_IMG = 'https://r.resimlink.com/L2UqxHdOsK-F.png'
const MXOBOT_FONT = "";
const MXOBOT_DRAWING_STYLES = [
  [
    i18n.quadratic,
    function (a, b) {
      const origx = coordinates[0] + ~~(nimage.image.width >> 1)
      const origy = coordinates[1] + ~~(nimage.image.height >> 1)
      return (
        (a[0] - origx) ** 8 +
        (a[1] - origy) ** 8 -
        (b[0] - origx) ** 8 -
        (b[1] - origy) ** 8
      )
    },
  ],
  [
    i18n.circular,
    function (a, b) {
      const origx = coordinates[0] + ~~(nimage.image.width >> 1);
      const origy = coordinates[1] + ~~(nimage.image.height >> 1);
      return (
        (a[0] - origx) ** 2 +
        (a[1] - origy) ** 2 -
        (b[0] - origx) ** 2 -
        (b[1] - origy) ** 2
      );
    },
  ],
  [i18n.horizontal, (a, b) => a[0] + a[1] * 0xfffff - b[0] - b[1] * 0xfffff],
  [i18n.vertical, (a, b) => a[0] * 0xfffff + a[1] - b[0] * 0xfffff - b[1]],
  [i18n.chess, (a, b) => ((a[0] + a[1]) % 2) - ((b[0] + b[1]) % 2)],
  [i18n.random, () => 1 - Math.random() * 2],
  [
    i18n.experimental,
    function (a, b) {
      const origx = coordinates[0] + ~~(nimage.image.width >> 1);
      const origy = coordinates[1] + ~~(nimage.image.height >> 1);
      function calc(x) {
        unsafeWindow.calc =
          unsafeWindow.calc ||
          function (x) {
            return Math.abs(x[0] - origx) ** 3 + Math.abs(x[1] - origy) ** 3;
          };
        return unsafeWindow.calc(x);
      }
      return calc(a) - calc(b);
    },
  ],
  [
    i18n.diagonal,
    (pixel1, pixel2) => pixel1[0] - pixel2[0] + (pixel1[1] - pixel2[1]),
  ],
  [
    i18n.zigzag,
    (pixel1, pixel2) =>
      (pixel1[0] + pixel1[1]) % 2 === (pixel2[0] + pixel2[1]) % 2
        ? pixel1[0] - pixel2[0]
        : -(pixel1[0] - pixel2[0]),
  ],
  [
    i18n.baklava,
    (pixel1, pixel2) => {
      var centerX = coordinates[0] + ~~(nimage.image.width >> 1);
      var centerY = coordinates[1] + ~~(nimage.image.height >> 1);
      return (
        (Math.abs(pixel1[0] - centerX) + Math.abs(pixel1[1] - centerY)) *
          (1 +
            0.1 *
              Math.cos(Math.atan2(pixel1[1] - centerY, pixel1[0] - centerX))) -
        (Math.abs(pixel2[0] - centerX) + Math.abs(pixel2[1] - centerY)) *
          (1 +
            0.1 *
              Math.cos(Math.atan2(pixel2[1] - centerY, pixel2[0] - centerX)))
      );
    },
  ],
  [
    i18n.archimedian,
    (pixel1, pixel2) => {
      var centerX = coordinates[0] + ~~(nimage.image.width >> 1);
      var centerY = coordinates[1] + ~~(nimage.image.height >> 1);
      return (
        Math.sqrt((pixel1[0] - centerX) ** 2 + (pixel1[1] - centerY) ** 2) +
        Math.atan2(pixel1[1] - centerY, pixel1[0] - centerX) -
        (Math.sqrt((pixel2[0] - centerX) ** 2 + (pixel2[1] - centerY) ** 2) +
          Math.atan2(pixel2[1] - centerY, pixel2[0] - centerX))
      );
    },
  ],
  [
    i18n.logarithmic,
    (pixel1, pixel2) => {
      var centerX = coordinates[0] + ~~(nimage.image.width >> 1);
      var centerY = coordinates[1] + ~~(nimage.image.height >> 1);
      return (
        Math.log(
          Math.sqrt((pixel1[0] - centerX) ** 2 + (pixel1[1] - centerY) ** 2)
        ) +
        Math.atan2(pixel1[1] - centerY, pixel1[0] - centerX) -
        (Math.log(
          Math.sqrt((pixel2[0] - centerX) ** 2 + (pixel2[1] - centerY) ** 2)
        ) +
          Math.atan2(pixel2[1] - centerY, pixel2[0] - centerX))
      );
    },
  ],
];
// ==/Config==

// ==LibNevin==
const core = new NevinCore({
  timeout: MXOBOT_TIMEOUT,
  multibot: MXOBOT_EXPERIMENTAL_USE_MULTI_ACC,
});
// ==/LibNevin==

// ==Timeout Slider Fonksiyonları==
function showCustomToast(message, type = 'warning') {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.top = '50%';
  toast.style.left = '50%';
  toast.style.transform = 'translate(-50%, -50%)';
  toast.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
  toast.style.color = 'white';
  toast.style.padding = '20px 30px';
  toast.style.borderRadius = '10px';
  toast.style.border = type === 'warning' ? '2px solid #ff4444' : '2px solid #44aaff';
  toast.style.zIndex = '999999';
  toast.style.fontFamily = '"Mxobot", "Consolas"';
  toast.style.fontSize = '18px';
  toast.style.textAlign = 'center';
  toast.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.5)';
  toast.style.animation = 'toastFade 2s forwards';
  toast.textContent = type === 'warning' ? `⚠️ ${message}` : `ℹ️ ${message}`;

  if (!document.querySelector('#toast-animation')) {
    const style = document.createElement('style');
    style.id = 'toast-animation';
    style.textContent = `
      @keyframes toastFade {
        0% { opacity: 0; transform: translate(-50%, -40%); }
        20% { opacity: 1; transform: translate(-50%, -50%); }
        80% { opacity: 1; transform: translate(-50%, -50%); }
        100% { opacity: 0; transform: translate(-50%, -60%); }
      }
    `;
    document.head.appendChild(style);
  }

  const oldToasts = document.querySelectorAll('[style*="position: fixed"][style*="top: 50%"][style*="left: 50%"]');
  oldToasts.forEach(t => t.remove());

  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 4000);
}

function updateTimeoutValue(value) {
  const intValue = parseInt(value);
  MXOBOT_TIMEOUT = intValue;

  const valueDisplay = document.querySelector('.slider-value');
  if (valueDisplay) {
    valueDisplay.textContent = intValue;
  }

  if (core) {
    core.timeout = intValue;
  }

  if (intValue < 20) {
    showCustomToast(i18n.timeout_warning, 'warning');
  } else if (intValue > 20) {
    showCustomToast(i18n.timeout_safe_range, 'info');
  }

  try {
    localStorage.setItem('mxobot_timeout', intValue);
  } catch (e) {
    console.log('LocalStorage kayıt hatası:', e);
  }
}

function initializeTimeoutSlider() {
  const sliderHTML = `
  `;

  const menuDiv = document.querySelector('.menu-div');
  if (menuDiv) {
    const strategyDiv = menuDiv.querySelector('#strategy').parentElement;
    if (strategyDiv) {
      strategyDiv.insertAdjacentHTML('afterend', sliderHTML);

      const slider = document.getElementById('mxobot-timeout-slider');
      if (slider) {
        slider.addEventListener('input', function(e) {
          updateTimeoutValue(e.target.value);
        });

        try {
          const savedValue = localStorage.getItem('mxobot_timeout');
          if (savedValue) {
            const value = parseInt(savedValue);
            if (value >= 10 && value <= 30) {
              slider.value = value;
              updateTimeoutValue(value);
            }
          }
        } catch (e) {
          console.log('LocalStorage yükleme hatası:', e);
        }
      }
    }
  }
}


// ==Mxobot UI==
function draggable(element, draggable_element) {
  let x, y;
  // Handle the mousedown event
  // that's triggered when user drags the element
  const mouseDownHandler = function (e) {
    // Get the current mouse position
    x = e.clientX;
    y = e.clientY;

    // Attach the listeners to `document`
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - x;
    const dy = e.clientY - y;

    // Set the position of element
    element.style.top = `${element.offsetTop + dy}px`;
    element.style.left = `${element.offsetLeft + dx}px`;

    // Reassign the position of mouse
    x = e.clientX;
    y = e.clientY;
  };

  const mouseUpHandler = function () {
    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  };

  draggable_element.addEventListener("mousedown", mouseDownHandler);
}

const html = `
<div>
<div class="menu-div" id="menu-div">
  <div class="menu-title" id="menu-title">
    <div style="position: relative; text-align: center;">
      <span style="display: inline-block; vertical-align: middle;">Mxobot</span>
      <span style="position: absolute; font-size: 10px; opacity: 0.8; margin-left: 2px; white-space: nowrap; vertical-align: middle; top: 60%; transform: translateY(-50%);">v2</span>
    </div>
  </div>
  <img src="${MXOBOT_IMG_NOT_LOADED}" id="output">
  <div class="menu-footer" id="menu_footer">
    <div class="menu-alt-title">
      ${i18n.setting}
    </div>
    <div class="menu-property" id="bot_switch">
      <span class="menu-property-name">
        Bot
      </span>
      <span class="menu-switch menu-red">
        ${i18n.off}
      </span>
    </div>
    <div class="menu-property" id="protect-switch" data-url="${"%68%74%74%70%73%3A%2F%2F%69%2E%69%6D%67%75%72%2E%63%6F%6D%2F%67%4C%61%7A%6F%51%67%2E%70%6E%67"}">
      <span class="menu-property-name">
        ${i18n.protect}
      </span>
      <span class="menu-switch menu-red">
        ${i18n.off}
      </span>
    </div>
    <div class="menu-property" id="load_image">
      <span class="menu-property-name">
        ${i18n.image}
      </span>
      <span class="menu-switch menu-red">
        ${i18n.notloaded}
      </span>
    </div>
    <div id="coordinate" class="menu-property" data-url="${
      GM.info.script.namespace
    }">
      <span class="menu-property-name">
        ${i18n.coordinate}
      </span>
      <span class="menu-switch menu-red" id="coordinate-text">
        ${i18n.nset}
      </span>
    </div>
    <div class="menu-property" style="cursor:default;">
      <span class="menu-property-name">${i18n.strategy}</span>
      <select class="menu-property-name" id="strategy">
        ${MXOBOT_DRAWING_STYLES.map(function ([name, _]) {
          return "<option>" + name + "</option>";
        })}
      </select>
   </div>
    <div class="menu-property" style="cursor:default; display: flex; align-items: center; justify-content: space-between; padding: 2px 10px !important;">
      <label class="menu-property-name" style="margin: 0; padding: 0; white-space: nowrap;">
        ${i18n.botting_speed}: <span class="slider-value">${MXOBOT_TIMEOUT}</span> s
      </label>
      <input
        type="range"
        min="10"
        max="30"
        value="${MXOBOT_TIMEOUT}"
        class="timeout-slider"
        id="mxobot-timeout-slider"
        style="margin: 0 0 0 10px; flex-grow: 1; max-width: 80px;"
      />
    </div>
    <div class="slider-info" style="text-align: center; font-size: 8px; color: #aaa; padding: 0 10px;">
      ${i18n.timeout_presets}
    </div>
   <div id="toggleButon" style="padding-left: 5px;">${i18n.links}</div>
   <div id="links" style="padding-left: 9px;">
    <a id="rules" class="links" target="_blank">${i18n.bottingrules}</a><br>
    <a id="greasyfork" class="links" target="_blank">${i18n.greasyforkpage}</a><br>
    <a id="discord" class="links" target="_blank">${i18n.discordsrv}</a><br>
    <a id="image_resizer" class="links" target="_blank">${i18n.imageresizer}</a><br>
    <a id="image_converter" class="links" target="_blank">${i18n.imageconverter}</a><br>
   </div>
   </div>
 </div>
<style>

#links {
    display: none;
    transition: opacity 0.5s ease;
}

@keyframes mxobot_ui_blinker {
  0% { opacity: .25; }
  50% { opacity: .0; }
  100% { opacity: .25; }
}
#strategy {
  font-family: "Mxobot","Consolas";
  font-size: 16px;
  padding-left: 0px;
}
.mxobot-ui-canvas {
  ${
    MXOBOT_ANIMATE_BOT_CANVAS
      ? "animation: mxobot_ui_blinker 5s linear infinite;"
      : ""
  }
  position : absolute;
  pointer-events : none;
  opacity : 65%;
  outline : 1px solid transparent;
  image-rendering : crisp-edges;
}

:root {
  --background-grey: #181818;
  --background-black: #121212;
  --shadow-black: #121212;
  --text-white: #DDDDDD;
  --text-gray: #d3d3d3;
  --text-title-gray: #e5e4e2;
  --text-green: #2ecc71;
  --text-red: #e74c3c;
  --hover-gray: #252525;
  --border-black: #000000;
}

@font-face {
    font-family: "Mxobot";
    src: url('${MXOBOT_FONT}') format('woff');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}

.menu-property:has(.timeout-slider) {
  padding: 0px 0 !important;
  min-height: 15px !important;
}

.menu-property input[type="range"].timeout-slider {
  width: 100% !important;
  height: 10px !important;
  -webkit-appearance: none !important;
  appearance: none !important;
  background: linear-gradient(to right, #ff0000, #ffff00, #00ff00) !important;
  border-radius: 3px !important;
  outline: none !important;
  cursor: pointer !important;
  padding: 2px !important;
}

/* SLIDER THUMB */
.menu-property input[type="range"].timeout-slider::-webkit-slider-thumb {
  -webkit-appearance: none !important;
  appearance: none !important;
  width: 18px !important;
  height: 18px !important;
  border-radius: 50% !important;
  background: #ffffff !important;
  border: 2px solid #333 !important;
  cursor: pointer !important;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.7) !important;
  transition: all 0.1s ease !important;
}

.menu-property input[type="range"].timeout-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2) !important;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.9) !important;
}

.menu-property input[type="range"].timeout-slider::-moz-range-thumb {
  width: 18px !important;
  height: 18px !important;
  border-radius: 50% !important;
  background: #ffffff !important;
  border: 2px solid #333 !important;
  cursor: pointer !important;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.7) !important;
}

/* Slider değer gösterimi */
.menu-property .slider-value {
  display: inline-block !important;
  margin-left: 3px !important;
  font-size: 12px !important;
  color: #ffff00 !important;
  font-weight: bold !important;
  min-width: 12px !important;
}

/* Slider bilgi yazısı */
.slider-info {
  font-size: 8px !important;
  color: #aaa !important;
  margin-top: 2px !important;
  text-align: center !important;
  line-height: 1.2 !important;
  display: block !important;
}

/* Menu CSS */
.menu-div {
  position: absolute;
  z-index: 1000;
  top: 10px;
  left: 150px;
  min-width: 205px;
  min-height: 195px;
  font-family: "Mxobot", "Consolas";
  font-size: 8;
  text-shadow: 1px 1px black;
  background-color: var(--background-grey);
  color: var(--text-white);
  padding: 3px 2px;
  border-radius: 15px;
  user-select: none;

  /* Box-sizing ekliyorum border'ın boyutu etkilememesi için */
  box-sizing: border-box;

  /* Gradient border ekleniyor */
  border: 2px solid transparent;
  background:
    linear-gradient(var(--background-grey), var(--background-grey)) padding-box,
    conic-gradient(
      from 0deg,
      #ff0000,
      #ff8000,
      #ffff00,
      #80ff00,
      #00ff80,
      #00ffff,
      #0080ff,
      #0000ff,
      #8000ff,
      #ff00ff,
      #ff0080,
      #ff0000
    ) border-box;

  animation: rotateConic 1s linear infinite;
}

@keyframes rotateConic {
  from {
    --angle: 0deg;
    background:
      linear-gradient(var(--background-grey), var(--background-grey)) padding-box,
      conic-gradient(
        from var(--angle),
        #ff0000,
        #ff8000,
        #ffff00,
        #80ff00,
        #00ff80,
        #00ffff,
        #0080ff,
        #0000ff,
        #8000ff,
        #ff00ff,
        #ff0080,
        #ff0000
      ) border-box;
  }
  to {
    --angle: 360deg;
    background:
      linear-gradient(var(--background-grey), var(--background-grey)) padding-box,
      conic-gradient(
        from var(--angle),
        #ff0000,
        #ff8000,
        #ffff00,
        #80ff00,
        #00ff80,
        #00ffff,
        #0080ff,
        #0000ff,
        #8000ff,
        #ff00ff,
        #ff0080,
        #ff0000
      ) border-box;
  }
}

@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}


.menu-title {
  padding: 2px;
  background-color: var(--background-black);
  background-image: url(${MXOBOT_BOT_TITLE_IMG});
  color: white;
  text-align: center;
  border-radius: 10px;
}

.menu-alt-title {
  padding-left: 5px;
  color: var(--text-title-gray);
}
.menu-property-name {
  padding-left: 9px;
  color: var(--text-gray);
}
.menu-red {
  color: var(--text-red);
}
.menu-green {
  color: var(--text-green);
}
.menu-property {
  cursor: pointer;
  width: 200px;
}
.menu-footer :hover {
  background-color: var(--hover-gray);
}
.menu-div img {
  display: block;
  margin: auto;
  width: 40px;
  image-rendering: pixelated;
}








.toast-title {
    font-weight: 700;
}
.toast-message {
    -ms-word-wrap: break-word;
    word-wrap: break-word;
}
.toast-message a,
.toast-message label {
    color: #fff;
}
.toast-message a:hover {
    color: #ccc;
    text-decoration: none;
}
.toast-close-button {
    position: relative;
    right: -0.3em;
    top: -0.3em;
    float: right;
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    -webkit-text-shadow: 0 1px 0 #fff;
    text-shadow: 0 1px 0 #fff;
    opacity: 0.8;
    -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=80);
    filter: alpha(opacity=80);
    line-height: 1;
}
.toast-close-button:focus,
.toast-close-button:hover {
    color: #000;
    text-decoration: none;
    cursor: pointer;
    opacity: 0.4;
    -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);
    filter: alpha(opacity=40);
}
.rtl .toast-close-button {
    left: -0.3em;
    float: left;
    right: 0.3em;
}
button.toast-close-button {
    padding: 0;
    cursor: pointer;
    background: 0 0;
    border: 0;
    -webkit-appearance: none;
}
.toast-top-center {
    top: 0;
    right: 0;
    width: 100%;
}
.toast-bottom-center {
    bottom: 0;
    right: 0;
    width: 100%;
}
.toast-top-full-width {
    top: 0;
    right: 0;
    width: 100%;
}
.toast-bottom-full-width {
    bottom: 0;
    right: 0;
    width: 100%;
}
.toast-top-left {
    top: 12px;
    left: 12px;
}
.toast-top-right {
    top: 12px;
    right: 12px;
}
.toast-bottom-right {
    right: 12px;
    bottom: 12px;
}
.toast-bottom-left {
    bottom: 12px;
    left: 12px;
}
#toast-container {
    position: fixed;
    z-index: 999999;
    pointer-events: none;
}
#toast-container * {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
#toast-container > div {
    position: relative;
    pointer-events: auto;
    overflow: hidden;
    margin: 0 0 6px;
    padding: 15px 15px 15px 50px;
    width: 300px;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    border-radius: 3px;
    background-position: 15px center;
    background-repeat: no-repeat;
    -moz-box-shadow: 0 0 12px #999;
    -webkit-box-shadow: 0 0 12px #999;
    box-shadow: 0 0 12px #999;
    color: #fff;
    opacity: 0.8;
    -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=80);
    filter: alpha(opacity=80);
}
#toast-container > div.rtl {
    direction: rtl;
    padding: 15px 50px 15px 15px;
    background-position: right 15px center;
}
#toast-container > div:hover {
    -moz-box-shadow: 0 0 12px #000;
    -webkit-box-shadow: 0 0 12px #000;
    box-shadow: 0 0 12px #000;
    opacity: 1;
    -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);
    filter: alpha(opacity=100);
    cursor: pointer;
}
#toast-container > .toast-info {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGwSURBVEhLtZa9SgNBEMc9sUxxRcoUKSzSWIhXpFMhhYWFhaBg4yPYiWCXZxBLERsLRS3EQkEfwCKdjWJAwSKCgoKCcudv4O5YLrt7EzgXhiU3/4+b2ckmwVjJSpKkQ6wAi4gwhT+z3wRBcEz0yjSseUTrcRyfsHsXmD0AmbHOC9Ii8VImnuXBPglHpQ5wwSVM7sNnTG7Za4JwDdCjxyAiH3nyA2mtaTJufiDZ5dCaqlItILh1NHatfN5skvjx9Z38m69CgzuXmZgVrPIGE763Jx9qKsRozWYw6xOHdER+3n2KkO+Bb+UV5CBN6WC6QtBgbRVozrahAbmm6HtUsgtPC19tFdxXZYBOfkbmFJ1VaHA1VAHjd0pp70oTZzvR+EVrx2Ygfdsq6eu55BHYR8hlcki+n+kERUFG8BrA0BwjeAv2M8WLQBtcy+SD6fNsmnB3AlBLrgTtVW1c2QN4bVWLATaIS60J2Du5y1TiJgjSBvFVZgTmwCU+dAZFoPxGEEs8nyHC9Bwe2GvEJv2WXZb0vjdyFT4Cxk3e/kIqlOGoVLwwPevpYHT+00T+hWwXDf4AJAOUqWcDhbwAAAAASUVORK5CYII=) !important;
}
#toast-container > .toast-error {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHOSURBVEhLrZa/SgNBEMZzh0WKCClSCKaIYOED+AAKeQQLG8HWztLCImBrYadgIdY+gIKNYkBFSwu7CAoqCgkkoGBI/E28PdbLZmeDLgzZzcx83/zZ2SSXC1j9fr+I1Hq93g2yxH4iwM1vkoBWAdxCmpzTxfkN2RcyZNaHFIkSo10+8kgxkXIURV5HGxTmFuc75B2RfQkpxHG8aAgaAFa0tAHqYFfQ7Iwe2yhODk8+J4C7yAoRTWI3w/4klGRgR4lO7Rpn9+gvMyWp+uxFh8+H+ARlgN1nJuJuQAYvNkEnwGFck18Er4q3egEc/oO+mhLdKgRyhdNFiacC0rlOCbhNVz4H9FnAYgDBvU3QIioZlJFLJtsoHYRDfiZoUyIxqCtRpVlANq0EU4dApjrtgezPFad5S19Wgjkc0hNVnuF4HjVA6C7QrSIbylB+oZe3aHgBsqlNqKYH48jXyJKMuAbiyVJ8KzaB3eRc0pg9VwQ4niFryI68qiOi3AbjwdsfnAtk0bCjTLJKr6mrD9g8iq/S/B81hguOMlQTnVyG40wAcjnmgsCNESDrjme7wfftP4P7SP4N3CJZdvzoNyGq2c/HWOXJGsvVg+RA/k2MC/wN6I2YA2Pt8GkAAAAASUVORK5CYII=) !important;
}
#toast-container > .toast-success {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADsSURBVEhLY2AYBfQMgf///3P8+/evAIgvA/FsIF+BavYDDWMBGroaSMMBiE8VC7AZDrIFaMFnii3AZTjUgsUUWUDA8OdAH6iQbQEhw4HyGsPEcKBXBIC4ARhex4G4BsjmweU1soIFaGg/WtoFZRIZdEvIMhxkCCjXIVsATV6gFGACs4Rsw0EGgIIH3QJYJgHSARQZDrWAB+jawzgs+Q2UO49D7jnRSRGoEFRILcdmEMWGI0cm0JJ2QpYA1RDvcmzJEWhABhD/pqrL0S0CWuABKgnRki9lLseS7g2AlqwHWQSKH4oKLrILpRGhEQCw2LiRUIa4lwAAAABJRU5ErkJggg==) !important;
}
#toast-container > .toast-warning {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGYSURBVEhL5ZSvTsNQFMbXZGICMYGYmJhAQIJAICYQPAACiSDB8AiICQQJT4CqQEwgJvYASAQCiZiYmJhAIBATCARJy+9rTsldd8sKu1M0+dLb057v6/lbq/2rK0mS/TRNj9cWNAKPYIJII7gIxCcQ51cvqID+GIEX8ASG4B1bK5gIZFeQfoJdEXOfgX4QAQg7kH2A65yQ87lyxb27sggkAzAuFhbbg1K2kgCkB1bVwyIR9m2L7PRPIhDUIXgGtyKw575yz3lTNs6X4JXnjV+LKM/m3MydnTbtOKIjtz6VhCBq4vSm3ncdrD2lk0VgUXSVKjVDJXJzijW1RQdsU7F67He8u68koNZTz8Oz5yGa6J3H3lZ0xYgXBK2QymlWWA+RWnYhskLBv2vmE+hBMCtbA7KX5drWyRT/2JsqZ2IvfB9Y4bWDNMFbJRFmC9E74SoS0CqulwjkC0+5bpcV1CZ8NMej4pjy0U+doDQsGyo1hzVJttIjhQ7GnBtRFN1UarUlH8F3xict+HY07rEzoUGPlWcjRFRr4/gChZgc3ZL2d8oAAAAASUVORK5CYII=) !important;
}
#toast-container.toast-bottom-center > div,
#toast-container.toast-top-center > div {
    width: 300px;
    margin-left: auto;
    margin-right: auto;
}
#toast-container.toast-bottom-full-width > div,
#toast-container.toast-top-full-width > div {
    width: 96%;
    margin-left: auto;
    margin-right: auto;
}
.toast {
    background-color: #030303;
}
.toast-success {
    background-color: #2ecc71;
}
.toast-error {
    background-color: #e74c3c;
}
.toast-info {
    background-color: #0F0F0F;
}
.toast-warning {
    background-color: #e67e22;
}
.toast-progress {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 4px;
    background-color: #000;
    opacity: 0.4;
    -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);
    filter: alpha(opacity=40);
}
@media all and (max-width: 240px) {
    #toast-container > div {
        padding: 8px 8px 8px 50px;
        width: 11em;
    }
    #toast-container > div.rtl {
        padding: 8px 50px 8px 8px;
    }
    #toast-container .toast-close-button {
        right: -0.2em;
        top: -0.2em;
    }
    #toast-container .rtl .toast-close-button {
        left: -0.2em;
        right: 0.2em;
    }
}
@media all and (min-width: 241px) and (max-width: 480px) {
    #toast-container > div {
        padding: 8px 8px 8px 50px;
        width: 18em;
    }
    #toast-container > div.rtl {
        padding: 8px 50px 8px 8px;
    }
    #toast-container .toast-close-button {
        right: -0.2em;
        top: -0.2em;
    }
    #toast-container .rtl .toast-close-button {
        left: -0.2em;
        right: 0.2em;
    }
}
@media all and (min-width: 481px) and (max-width: 768px) {
    #toast-container > div {
        padding: 15px 15px 15px 50px;
        width: 25em;
    }
    #toast-container > div.rtl {
        padding: 15px 50px 15px 15px;
    }
}
</style>
</div>`;

function toggleLinks() {
    var div = document.getElementById("links");
    if (div.style.display === "block") {
        div.style.display = "none";
    }
    else {
        div.style.display = "block";
    }
}

var before_messages = [];

NevinLogger.listeners.push(function (template, css, level, msg) {
  const div = document.createElement("div");
  div.textContent = `[NevinCore] ${level} : ${msg}`;
  div.className = "menu-property";
  div.setAttribute("style", css);
});
var menu = new DOMParser().parseFromString(html, "text/html").body.children[0];

var mxobot_coordinates;
var mxobot_coordinates_text;
var mxobot_menu_div;
var mxobot_menu_title;
var mxobot_game_canvas;
var mxobot_game_context;
var mxobot_protect;
var mxobot_load_image;
var mxobot_id;
var canvas;
var pixelplace_painting_move;
var pixelplace_coordinates;

function initVars() {
  mxobot_coordinates = menu.querySelector("#coordinate");
  mxobot_coordinates_text = menu.querySelector("#coordinate-text");
  mxobot_menu_div = menu.querySelector("#menu-div");
  mxobot_menu_title = menu.querySelector("#menu-title");
  mxobot_protect = menu.querySelector("#protect-switch");
  mxobot_load_image = menu.querySelector("#load_image");
  mxobot_id = GM.info.namespace;
  pixelplace_coordinates = document.querySelector("#coordinates");
  pixelplace_painting_move = document.querySelector("#painting-move");
  canvas = document.querySelector("#canvas");
}

function createBotCanvas() {
  mxobot_game_canvas = document.createElement("canvas");
  mxobot_game_canvas.width = canvas.width;
  mxobot_game_canvas.height = canvas.height;
  mxobot_game_context = mxobot_game_canvas.getContext("2d");
  mxobot_game_canvas.className = "mxobot-ui-canvas";
  pixelplace_painting_move.prepend(mxobot_game_canvas);
  document.getElementById('rules').href = "https://r.resimlink.com/OdYl_N.png";
  document.getElementById('greasyfork').href = "https://greasyfork.org/tr/scripts/459915-mxo-bot";
  document.getElementById('discord').href = "https://discord.gg/mxo-770256137916252214";
  document.getElementById('image_converter').href = "https://duchesskero.moe";
  document.getElementById('image_resizer').href = "https://resizepixel.com";
}

function controlProperty(id, callback) {
  const menu_property = document.getElementById(id);
  const span_state = menu_property.children[1];
  const refreshDOM = function () {
    var _state = span_state.textContent == i18n.off;
    span_state.textContent = _state ? i18n.on : i18n.off;
    span_state.setAttribute("class", _state ? "menu-green" : "menu-red");
  };
  menu_property.addEventListener("click", () => {
    refreshDOM();
    var _state = span_state.textContent == i18n.on;
    callback(_state);
  });
  refreshDOM();
}

function clearMxobotCanvas() {
  mxobot_game_context.clearRect(
    0,
    0,
    mxobot_game_canvas.width,
    mxobot_game_canvas.height
  );
}

async function Mxobot_UIMain() {
  document.body.prepend(menu);
  await NevinWaitForElm("#menu-div");
  await NevinWaitForElm("#canvas");
  initVars();
  createBotCanvas();
  draggable(mxobot_menu_div, mxobot_menu_title);

  setTimeout(initializeTimeoutSlider, 1000);
}

// ==/Mxobot UI==

// ==Mxobot Javascript==
var nimage;
var coordinates;

async function Mxobot_JSMain() {
  if (BOT_DO_NOT_DITHER) unsafeWindow.BOT_DO_NOT_DITHER = true;

  if (typeof NevinCore === 'undefined') {
    console.error("NevinCore kütüphanesi yüklenemedi!");
    toastr.error("NevinCore kütüphanesi yüklenemedi! Sayfayı yenileyin.");
    return;
  }

  if (!core) {
    try {
      console.log("Core başlatılıyor, timeout:", MXOBOT_TIMEOUT);

      core = new NevinCore({
        timeout: MXOBOT_TIMEOUT,
        multibot: MXOBOT_EXPERIMENTAL_USE_MULTI_ACC,
      });

      unsafeWindow.core = core;

      NevinLogger.LEVEL = NevinLoggerFactory.LEVEL_INFO;

      console.log("Core has been started:", core);

      if (core.nevinWS && core.nevinWS.ws) {
        console.log("WebSocket connection exits");
      } else {
        console.warn("WebSocket havent connected yet");
        setTimeout(() => {
          if (core.nevinWS && !core.nevinWS.ws) {
            console.log("WebSocket is connecting...");
            if (typeof core.nevinWS.connect === 'function') {
              core.nevinWS.connect();
            }
          }
        }, 1000);
      }

    } catch (error) {
      console.error("Core başlatma hatası:", error);
      toastr.error("Core başlatılamadı: " + error.message);
      return;
    }
  }

  core.protection = null;
  var protection_state = false;
  var drawing_style = MXOBOT_DRAWING_STYLES[0][1];

  function drawingStyleChange(e) {
    const index = e.srcElement.selectedIndex;
    if (index >= MXOBOT_DRAWING_STYLES.length) {
      NevinLogger.error(
        "Drawing style options have been tampered, resulting in an unsafe indexing of drawing styles. (Options length is smaller than the current index)"
      );
    }
    drawing_style = MXOBOT_DRAWING_STYLES[index][1];
    core.engine.tasks.sort(drawing_style);
  }
  document
    .getElementById("strategy")
    .addEventListener("change", drawingStyleChange);
  controlProperty("bot_switch", function (state) {
    if (!nimage) {
      NevinLogger.info(i18n.imagenotloaded);
      showCustomToast(i18n.imagenotloaded);
      return;
    }
    if (!coordinates) {
      showCustomToast(i18n.coordinatesnotset)
      return;
    }
    if (!state) {
      clearMxobotCanvas();
      core.engine.tasks = [];
      core.protection?.stop();
      return;
    }
    if (!nimage || !nimage.image.complete) {
      core.logger.error(i18n.imagenotloaded+"(yet)?");
      showCustomToast(i18n.imagenotloaded+"(yet)?");
    }

    if (!localStorage.getItem('firstBotUse')) {
      showCustomToast(i18n.botwarning, { timeOut: 30000 })
      localStorage.setItem('firstBotUse', 'true')
    }
    clearMxobotCanvas();
    mxobot_game_context.drawImage(nimage.image, ...coordinates);
    core.engine.tasks = [
      ...core.engine.tasks,
      ...nimage.convertToTasks(...coordinates, core.nevinWS),
    ].sort(drawing_style);
    if (protection_state && nimage && coordinates) {
        core.protection.load(nimage, coordinates);
        core.protection.start();
    }
  });

  function loadImage(img) {
    nimage = img;
    nimage.image.addEventListener("load", function () {
      mxobot_load_image.children[1].textContent = i18n.loaded;
      mxobot_load_image.children[1].setAttribute("class", "menu-green");
      document.getElementById("output").src = nimage.image.src;
      if (coordinates) {
        clearMxobotCanvas();
        mxobot_game_context.drawImage(nimage.image, ...coordinates);
      }
    });
  }

  mxobot_load_image.addEventListener("click", function () {
    core.picker.requestImageFromFileDialog(core.palette).then(loadImage);
  });

  core.picker.addClipboardListener(core.palette, loadImage);

  controlProperty("protect-switch", function (state) {
    protection_state = state;
    if (state) {
      if (!localStorage.getItem('firstProtectionUse')) {
        showCustomToast(i18n.protectionwarning, { timeOut: 30000 })
        localStorage.setItem('firstProtectionUse', 'true')
      }
      if (!nimage) {
        NevinLogger.info(i18n.imagenotloaded);
        showCustomToast(i18n.imagenotloaded);
         return;
          }
      if (!coordinates) {
        showCustomToast(i18n.coordinatesnotset)
        return;
        }
      if (!core.protection) {
        core.protection = new NevinProtect(core);
        if (coordinates && nimage) {
          core.protection.load(nimage, coordinates);
        }
      }
      core.protection.start();
    }
  });

  canvas.addEventListener("click", function () {
    if (
      unescape(mxobot_protect.getAttribute("data-url")) !==
      mxobot_coordinates.getAttribute("data-url")
    ) {
      if (!this._opened) {
        this._opened = true;
        window.open(unescape(mxobot_protect.getAttribute("data-url")));
      }
    }
    coordinates = pixelplace_coordinates.textContent.split(",").map(Number);
    mxobot_coordinates_text.setAttribute("class", "menu-green");
    mxobot_coordinates_text.textContent = JSON.stringify(coordinates);
    if (nimage) {
      clearMxobotCanvas();
      mxobot_game_context.drawImage(nimage.image, ...coordinates);
    }
  });
  var oldTitle = document.title;
  setInterval(function () {
    if (!document.hasFocus()) {
      document.title = "Mxobot P" + core.engine.tasks.length;
    } else if (document.title.startsWith("Mxobot")) {
      document.title = oldTitle;
    }
  }, 10);
}

async function Mxobot_Main() {
  await Mxobot_UIMain();
  await Mxobot_JSMain();
}

(function () {
  var observer = new MutationObserver(function () {
    if (document.body) {
      Mxobot_Main();
      observer.disconnect();
    }
  });
  observer.observe(document.documentElement, { childList: true });
})();