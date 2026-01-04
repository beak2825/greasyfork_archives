// ==UserScript==
// @name       YouTube Lite (melhor experiência)
// @name:pt       YouTube Lite (melhor experiência)
// @name:pt-PT       YouTube Lite (melhor experiência)
// @name:pt-BR       YouTube Lite (melhor experiência)
// @name:es       YouTube Lite (la mejor experiencia)
// @name:en       YouTube Lite (best experience)
// @name:fr       YouTube Lite (meilleure expérience)
// @name:ru       YouTube Lite (лучший опыт)
// @name:ja       YouTube Lite (最高のエクスペリエンス)
// @name:ko       YouTube Lite (최고의 경험)
// @name:zh-TW       YouTube Lite (更佳體驗)
// @name:zh-CN       YouTube Lite (更好的体验)
// @name:id       YouTube Lite (pengalaman terbaik)
// @name:ug       YouTube Lite (ئەڭ ياخشى تەجرىبە)
// @name:ar       YouTube Lite (أفضل تجربة)
// @name:he       YouTube Lite (חוויית השימוש הטובה ביותר)
// @name:hi       YouTube Lite (सर्वश्रेष्ठ अनुभव)
// @name:th       YouTube Lite (ประสบการณ์ที่ดีที่สุด)
// @name:bg       YouTube Lite (най-добър опит)
// @name:ro       YouTube Lite (cea mai bună experiență)
// @name:fi       YouTube Lite (paras kokemus)
// @name:it       YouTube Lite (migliore esperienza)
// @name:el       YouTube Lite (καλύτερη εμπειρία)
// @name:eo       YouTube Lite (plej bona sperto)
// @name:hu       YouTube Lite (legjobb élmény)
// @name:nb       YouTube Lite (beste opplevelse)
// @name:sk       YouTube Lite (najlepšia skúsenosť)
// @name:sv       YouTube Lite (bästa upplevelsen)
// @name:sr       YouTube Lite (најбоље искуство)
// @name:pl       YouTube Lite (najlepsze doświadczenie)
// @name:nl       YouTube Lite (beste ervaring)
// @name:de       YouTube Lite (beste Erfahrung)
// @name:da       YouTube Lite (bedste oplevelse)
// @name:cs       YouTube Lite (nejlepší zkušenost)
// @name:uk       YouTube Lite (найкращий досвід)
// @name:tr       YouTube Lite (en iyi deneyim)
// @name:vi       YouTube Lite (trải nghiệm tốt nhất)
// @name:fr-CA       YouTube Lite (meilleure expérience)

// @namespace    http://linkme.bio/jhonpergon/?userscript=youtube_lite
// @version      3.4
// @author       Jhon Pérgon
// @license      MIT

// @description       Deixa a interface do YouTube mais leve, oculta vídeos com palavras-chaves, adiciona botão de download e abre o vídeo em uma página livre de anúncios (embed youtube-nocookie).
// @description:pt       Deixa a interface do YouTube mais leve, oculta vídeos com palavras-chaves, adiciona botão de download e abre o vídeo em uma página livre de anúncios (embed youtube-nocookie).
// @description:pt-PT       Deixa a interface do YouTube mais leve, oculta vídeos com palavras-chaves, adiciona botão de download e abre o vídeo em uma página livre de anúncios (embed youtube-nocookie).
// @description:pt-BR       Deixa a interface do YouTube mais leve, oculta vídeos com palavras-chaves, adiciona botão de download e abre o vídeo em uma página livre de anúncios (embed youtube-nocookie).
// @description:es      Hace que la interfaz de YouTube sea más dinámica, oculta videos con palabras clave, agrega un botón de descarga y abre el video en una página sin publicidad (embed youtube-nocookie).
// @description:en      Makes the YouTube interface lighter, hides videos with keywords, adds a download button and opens the video on an ad-free page (embed youtube-nocookie).
// @description:fr      Il rend l'interface YouTube plus dynamique, masque les vidéos avec des mots-clés, ajoute un bouton de téléchargement et ouvre la vidéo sur une page sans publicité (embed youtube-nocookie).
// @description:ru      Он делает интерфейс YouTube более динамичным, скрывает видео с ключевыми словами, добавляет кнопку загрузки и открывает видео на странице без рекламы (встроить youtube-nocookie).
// @description:ja      YouTube インターフェースをより動的にし、キーワードを含むビデオを非表示にし、ダウンロード ボタンを追加して、広告なしのページ (youtube-nocookie embed) でビデオを開きます。
// @description:ko      YouTube 인터페이스를 더욱 동적으로 만들고, 키워드로 동영상을 숨기고, 다운로드 버튼을 추가하고, 광고 없는 페이지에서 동영상을 엽니다(youtube-nocookie embed).
// @description:zh-TW      使YouTube介面更加動態，隱藏包含關鍵字的影片，新增下載按鈕，並在無廣告頁面（嵌入youtube-nocookie）中開啟影片。
// @description:zh-CN      使YouTube界面更加动态，隐藏包含关键词的视频，添加下载按钮并在无广告页面（嵌入youtube-nocookie）中打开视频。
// @description:id      Membuat antarmuka YouTube lebih ringan, menyembunyikan video dengan kata kunci, menambahkan tombol unduh, dan membuka video di halaman tanpa iklan (sematkan youtube-nocookie).
// @description:ug      يوتۇب يېڭىلاندۇرغۇچى كىرىشتىمىنى ياقسى قىلىدۇ، ئاڭلىق سۆزلىك ۋىدېئولارنى يوپۇش قىلىدۇ، چۈشۈرمە تومبۇلى قوشىدۇ ۋە چىراق ئېكراندا (youtube-nocookie sematka qilish) ۋىدېئونى ئېچىدۇ.
// @description:ar      يجعل واجهة يوتيوب أخف وزنًا، يخفي مقاطع الفيديو بكلمات مفتاحية، يضيف زر تنزيل ويفتح الفيديو على صفحة خالية من الإعلانات (تضمين youtube-nocookie).
// @description:he      הופך את ממשק YouTube לקל יותר, מסתיר סרטונים עם מילות מפתח, מוסיף לחצן הורדה ופותח את הסרטון על דף נטול פרסומות (הטמעת youtube-nocookie).
// @description:hi      यूट्यूब इंटरफ़ेस को हल्का बनाता है, कीवर्ड के साथ वीडियो को छुपाता है, डाउनलोड बटन जोड़ता है और एड-मुक्त पृष्ठ पर वीडियो खोलता है (youtube-nocookie embed)।
// @description:th      ทำให้อินเตอร์เฟซ YouTube เบาขึ้น, ซ่อนวิดีโอด้วยคำสำคัญ, เพิ่มปุ่มดาวน์โหลด และเปิดวิดีโอบนหน้าไม่มีโฆษณา (ฝัง youtube-nocookie) ให้ดู
// @description:bg      Прави интерфейса на YouTube по-лек, скрива видеоклипове с ключови думи, добавя бутон за изтегляне и отваря видеоклипа на страница без реклами (вграждане на youtube-nocookie).
// @description:ro      Face interfața YouTube mai ușoară, ascunde videoclipurile cu cuvinte cheie, adaugă un buton de descărcare și deschide videoclipul pe o pagină fără reclame (încorporare youtube-nocookie).
// @description:fi      Tekee YouTube-liittymästä kevyemmän, piilottaa avainsanalla varustetut videot, lisää latauspainikkeen ja avaa videon mainoksettomalle sivulle (upottaa youtube-nocookie).
// @description:it      Rende l'interfaccia di YouTube più leggera, nasconde i video con parole chiave, aggiunge un pulsante di download e apre il video su una pagina senza pubblicità (embed youtube-nocookie).
// @description:el      Καθιστά τη διεπαφή του YouTube πιο ελαφριά, αποκρύπτει τα βίντεο με λέξεις-κλειδιά, προσθέτει ένα κουμπί λήψης και ανοίγει το βίντεο σε μια σελίδα χωρίς διαφημίσεις (ενσωμάτωση youtube-nocookie).
// @description:eo      Faras la interfaco de YouTube pli malpeza, kaŝas videojn kun ŝlosilvortoj, aldonas elŝut-butonon kaj malfermas la videon en senanonca paĝo (enteni youtube-nocookie).
// @description:hu      Könnyebbé teszi a YouTube felületét, kulcsszavakkal elrejti a videókat, hozzáad egy letöltés gombot, és az videót hirdetések nélküli oldalon nyitja meg (beágyazott youtube-nocookie).
// @description:nb      Gjør YouTube-grensesnittet lettere, skjuler videoer med søkeord, legger til en nedlastingsknapp og åpner videoen på en annonsefri side (innbygg youtube-nocookie).
// @description:sk      Robí rozhranie YouTube ľahším, skrýva videá s kľúčovými slovami, pridáva tlačidlo na stiahnutie a otvára video na stránke bez reklám (vložiť youtube-nocookie).
// @description:sv      Gör YouTube-gränssnittet lättare, gömmer videor med nyckelord, lägger till en nedladdningsknapp och öppnar videon på en annonsfri sida (bädda in youtube).
// @description:sr      Прави интерфејс YouTube-а лакшим, сакрива видее са кључним речима, додаје дугме за преузимање и отвара видео на страници без реклама (уградња youtube-nocookie).
// @description:pl      Uczy interfejs YouTube'a lżejszym, ukrywa filmy z słowami kluczowymi, dodaje przycisk do pobierania i otwiera film na stronie bez reklam (osadzanie youtube-nocookie).
// @description:nl      Maakt de YouTube-interface lichter, verbergt video's met trefwoorden, voegt een downloadknop toe en opent de video op een advertentievrije pagina (insluiten youtube-nocookie).
// @description:de      Macht die YouTube-Benutzeroberfläche leichter, versteckt Videos mit Schlüsselwörtern, fügt einen Download-Button hinzu und öffnet das Video auf einer werbefreien Seite (einbetten youtube-nocookie).
// @description:da      Gør YouTube-grænsefladen lettere, skjuler videoer med søgeord, tilføjer en downloadknap og åbner videoen på en reklamefri side (indlejre youtube-nocookie).
// @description:cs      Dělá YouTube rozhraní lehčí, skrývá videa s klíčovými slovy, přidává tlačítko ke stažení a otevírá video na stránce bez reklam (vložit youtube-nocookie).
// @description:uk      Робить інтерфейс YouTube легшим, приховує відео з ключовими словами, додає кнопку завантаження та відкриває відео на сторінці без реклами (вбудовувати youtube-nocookie).
// @description:tr      YouTube arayüzünü daha hafif hale getirir, anahtar kelimelerle videoları gizler, indirme düğmesi ekler ve videoyu reklamsız bir sayfada açar (yerleştirme youtube-nocookie).
// @description:vi      Làm cho giao diện YouTube nhẹ hơn, ẩn đi các video có từ khóa, thêm nút tải xuống và mở video trên trang không có quảng cáo (nhúng youtube-nocookie).
// @description:fr-CA      Rend l'interface YouTube plus légère, masque les vidéos avec des mots-clés, ajoute un bouton de téléchargement et ouvre la vidéo sur une page sans publicité (intégrer youtube-nocookie).

// @match           https://www.youtube.com/*
// @match           https://m.youtube.com/*
// @match           https://youtu.be/*
// @match           https://www.youtube-nocookie.com/*
// @exclude         https://music.youtube.com/*
// @exclude         https://www.youtube.com/embed/*
// @exclude         https://youtube.com/embed/*
// @icon         https://icons.iconarchive.com/icons/designbolts/cute-social-media/256/Youtube-icon.png

// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @run-at      document-start

// @compatible      chrome
// @compatible      firefox
// @compatible      opera
// @compatible      edge
// @compatible      safari
// @compatible      berrybrowser
// @downloadURL https://update.greasyfork.org/scripts/476133/YouTube%20Lite%20%28melhor%20experi%C3%AAncia%29.user.js
// @updateURL https://update.greasyfork.org/scripts/476133/YouTube%20Lite%20%28melhor%20experi%C3%AAncia%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let sessao = 1;
    let atualx = false;
    let videoId = getVideoIdFromUrl();
    let idiomaPadrao = "";

    // Define o valor inicial do select com base no idioma salvo
     if(GM_getValue('xidiomaSelecionado') == undefined){
        GM_setValue('xidiomaSelecionado', "en");
        idiomaPadrao = GM_getValue('xidiomaSelecionado');
      }

    // Lista de ações de API barradas
    const blockedApiUrls = [
        'https://use.typekit.net',
        'https://pagead2.googlesyndication.com',
        'https://www.gstatic.com',
        '/ip',
        '/ajax',
        '/ads',
        '/static',
        '/js',
        '/script',
        '/scripts',
        '/event',
        '/events',
        'https://accounts.youtube.com',
        'https://www.google.com',
        'https://www.google.com.br',
        '/api/session',
        'https://youtube.com',
        'https://www.youtube.com',
        'https://m.youtube.com',
        'https://play.google.com',
        '//googleads.g.doubleclick.net',
        'https://rr',
        '/youtubei',
        'https://yt3.ggpht.com',
        'https://i.ytimg.com',
        'https://rr5---sn-o097znze.googlevideo.com',
        'https://rr4---sn-5ufvuxaxxpgxap-hj1e.googlevideo.com',
        'https://rr2---sn-voxuxaxjvh-gxj6.googlevideo.com',
        'https://jnn-pa.googleapis.com',
        'https://suggestqueries-clients6.youtube.com',
        '/player',
        '/a',
        '/b',
        '/c',
        '/d',
        '/e',
        '/f',
        '/g',
        '/i',
        '/j',
        '/k',
        '/l',
        '/m',
        '/n',
        '/o',
        '/p',
        '/q',
        '/r',
        '/s',
        '/t',
        '/u',
        '/v',
        '/w',
        '/x',
        '/y',
        '/z',
        // Adicione mais URLs de API que deseja bloquear, se necessário
    ];


    // Intercepta as solicitações AJAX feitas pelo website
    var verifyc1 = false;
  if(window.location.href.includes("youtube.com")){
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (blockedApiUrls.some(apiUrl => url.startsWith(apiUrl))) {
            verifyc1 = true;
            limparCookies();
            addLinks();
            return; // Interrompe a execução da solicitação
        }
        open.apply(this, arguments);
    };
  }



  let bloquearFetch = true;
  var verifyc2 = false;

  function interceptarFetch(url, options) {
    if (bloquearFetch && correspondeAUrlBloqueada(url)) {
      limparCookies();
      addLinks();
      verifyc2 = true;
      return Promise.resolve({ status: 200, body: 'A solicitação foi bloqueada.' });
    } else {
      return window.originalFetch.call(this, url, options);
    }
  }

  function correspondeAUrlBloqueada(url) {
    for (const urlBloqueada of blockedApiUrls) {
      if (url.startsWith(urlBloqueada)) {
        return true;
      }
    }
    return false;
  }

  // Substituir a função fetch globalmente
  if(window.location.href.includes("youtube.com")){
    window.originalFetch = window.fetch;
    window.fetch = interceptarFetch;
  }

  // Aguarde o evento de carregamento total da página
  window.addEventListener('load', function() {
    // Após o carregamento total da página, permitir todas as solicitações fetch
    bloquearFetch = false;
  });




  const alertIdioms1 = [
    "pt-BR", "Nota: Você está acessando a versão 3.4 do Youtube Lite pela primeira vez. Para garantir o seu correto funcionamento, iremos limpar os cookies e reiniciar a página.",
    "es", "Nota: Estás accediendo a la versión 3.4 de Youtube Lite por primera vez. Para garantizar su correcto funcionamiento, limpiaremos las cookies y reiniciaremos la página.",
    "en", "Note: You are accessing version 3.4 of Youtube Lite for the first time. To ensure its proper functioning, we will clear the cookies and restart the page.",
    "fr", "Remarque : Vous accédez à la version 3.4 de Youtube Lite pour la première fois. Pour garantir son bon fonctionnement, nous allons effacer les cookies et redémarrer la page.",
    "ru", "Примечание: Вы впервые открываете версию 3.4 Youtube Lite. Для обеспечения её правильной работы мы очистим куки и перезапустим страницу.",
    "ja", "注意: これは初めてのYouTube Liteのバージョン3.4へのアクセスです。正常に機能させるために、クッキーをクリアしてページを再起動します。",
    "ko", "알림: 처음으로 Youtube Lite의 3.4 버전에 접근하고 있습니다. 올바른 작동을 위해 쿠키를 지우고 페이지를 다시 시작하겠습니다.",
    "zh-tw", "注意：您首次訪問 Youtube Lite 的 3.4 版本。為確保其正常運作，我們將清除 cookie 並重新啟動頁面。",
    "zh-cn", "注意：您首次访问 Youtube Lite 的 3.4 版本。为确保其正常运作，我们将清除 cookie 并重新启动页面。",
    "id", "Catatan: Anda sedang mengakses versi 3.4 Youtube Lite untuk pertama kalinya. Untuk memastikan fungsinya dengan benar, kami akan membersihkan cookie dan me-restart halaman.",
    "ug", "ئەسكەرتمە: سىز 3.4-نۋمبەر Youtube Lite نى بىرىنجى قېتىم زىيارەت قىلىۋاتقاندا. ۋاقتىنىڭ دوغروق ھالىتىغا ئېرىشىش ۋەب بەتنى رەستەرت قىلىمىز.",
    "ar", "ملاحظة: أنت تقوم بالوصول إلى الإصدار 3.4 من YouTube Lite لأول مرة. لضمان عملها الصحيح، سنقوم بمسح الكوكيز وإعادة تشغيل الصفحة.",
    "he", "הערה: אתה נכנס לגרסה 3.4 של YouTube Lite לראשונה. כדי להבטיח את הפעולה הנכונה, נקלוט את העוגיות ונפעיל מחדש את הדף.",
    "hi", "नोट: आप पहली बार YouTube Lite के संस्करण 3.4 का उपयोग कर रहे हैं। इसके सही कार्य की सुनिश्चित करने के लिए, हम कुकी को साफ करेंगे और पृष्ठ को पुनः आरंभ करेंगे।",
    "th", "หมายเหตุ: คุณกำลังเข้าถึงรุ่น 3.4 ของ Youtube Lite ครั้งแรก โปรดตรวจสอบความถูกต้องให้ดี เราจะล้างคุกกี้และเริ่มหน้าใหม่",
    "bg", "Бележка: Вие получавате достъп до версия 3.4 на Youtube Lite за първи път. За да гарантираме правилното му функциониране, ще изчистим бисквитките и ще рестартираме страницата.",
    "ro", "Notă: Accesați pentru prima dată versiunea 3.4 a YouTube Lite. Pentru a asigura funcționarea corectă, vom șterge cookie-urile și vom reporni pagina.",
    "fi", "Huomautus: Käytät YouTube Liten versiota 3.4 ensimmäistä kertaa. Varmistaaksemme sen oikean toiminnan, tyhjennämme evästeet ja käynnistämme sivun uudelleen.",
    "it", "Nota: Stai accedendo alla versione 3.4 di Youtube Lite per la prima volta. Per garantirne il corretto funzionamento, elimineremo i cookie e riavvieremo la pagina.",
    "el", "Σημείωση: Έχετε πρόσβαση στην έκδοση 3.4 του Youtube Lite για πρώτη φορά. Για να εξασφαλίσουμε τη σωστή λειτουργία του, θα καθαρίσουμε τα cookies και θα επανεκκινήσουμε τη σελίδα.",
    "eo", "Noto: Vi aliradas la version 3.4 de Youtube Lite por la unua fojo. Por certigi ĝian ĝustan funkciadon, ni forviros la kuketojn kaj restartigos la paĝon.",
    "hu", "Megjegyzés: Első alkalommal lépsz be a Youtube Lite 3.4 verziójához. A megfelelő működés érdekében törölni fogjuk a sütiket és újraindítjuk az oldalt.",
    "nb", "Merknad: Du får tilgang til versjon 3.4 av Youtube Lite for første gang. For å sikre riktig funksjon, vil vi tømme informasjonskapslene og starte siden på nytt.",
    "sk", "Poznámka: Prvýkrát pristupujete k verzii 3.4 Youtube Lite. Pre zabezpečenie jeho správneho fungovania vymažeme cookies a reštartujeme stránku.",
    "sv", "Observera: Du har tillgång till version 3.4 av Youtube Lite för första gången. För att säkerställa dess korrekta funktion kommer vi att rensa kakorna och starta om sidan.",
    "sr", "Напомена: Први пут приступате верзији 3.4 Youtube Lite. Да бисмо обезбедили његово исправно радење, избришемо колачиће и поново покренемо страницу.",
    "pl", "Uwaga: Po raz pierwszy uzyskujesz dostęp do wersji 3.4 Youtube Lite. Aby zapewnić jego poprawne działanie, wyczyścimy pliki cookie i zrestartujemy stronę.",
    "nl", "Opmerking: U krijgt voor het eerst toegang tot versie 3.4 van Youtube Lite. Om de juiste werking te garanderen, zullen we de cookies wissen en de pagina opnieuw opstarten.",
    "de", "Hinweis: Sie greifen zum ersten Mal auf die Version 3.4 von Youtube Lite zu. Um einen ordnungsgemäßen Betrieb zu gewährleisten, löschen wir die Cookies und starten die Seite neu.",
    "da", "Bemærk: Du har adgang til version 3.4 af Youtube Lite for første gang. For at sikre korrekt funktion vil vi slette cookies og genstarte siden.",
    "cs", "Poznámka: Poprvé přistupujete k verzi 3.4 Youtube Lite. Pro zajištění jeho správného fungování vymažeme cookies a restartujeme stránku.",
    "uk", "Примітка: Ви вперше входите в версію 3.4 Youtube Lite. Для забезпечення його правильної роботи ми видалимо файли cookie і перезапустимо сторінку.",
    "tr", "Not: İlk kez Youtube Lite'ın 3.4 sürümüne erişiyorsunuz. Doğru çalışmasını sağlamak için çerezleri temizleyip sayfayı yeniden başlatacağız.",
    "vi", "Lưu ý: Bạn đang truy cập vào phiên bản 3.4 của Youtube Lite lần đầu tiên. Để đảm bảo hoạt động đúng đắn, chúng tôi sẽ xóa cookie và khởi động lại trang.",
    "fr-CA", "Note: Vous accédez à la version 3.4 de Youtube Lite pour la première fois. Pour garantir son bon fonctionnement, nous allons effacer les cookies et redémarrer la page."
  ];


  const alertIdioms2 = [
    "pt-BR", "Feito. A página será recarregada com seu idioma.",
    "es", "Hecho. La página se recargará con tu idioma.",
    "en", "Done. The page will be reloaded with your language.",
    "fr", "Fait. La page sera rechargée avec votre langue.",
    "ru", "Готово. Страница будет перезагружена с вашим языком.",
    "ja", "完了しました。ページがあなたの言語で再読み込まれます。",
    "ko", "완료되었습니다. 페이지가 귀하의 언어로 다시로드됩니다.",
    "zh-tw", "完成。頁面將以您的語言重新載入。",
    "zh-cn", "完成。页面将重新加载，使用您的语言。",
    "id", "Selesai. Halaman akan dimuat ulang dengan bahasa Anda.",
    "ug", "ئۆتكۈزۈلدى. بەت ئىسپانىيىنى قايتا يۈكلەيدۇ.",
    "ar", "تم. سيتم إعادة تحميل الصفحة بلغتك.",
    "he", "בוצע. הדף ייטען מחדש בשפתך.",
    "hi", "हो गया। पृष्ठ आपकी भाषा के साथ पुनः लोड होगा।",
    "th", "เสร็จสิ้น หน้าจอจะถูกโหลดใหม่ด้วยภาษาของคุณ",
    "bg", "Готово. Страницата ще бъде презаредена с вашия език.",
    "ro", "Gata. Pagina va fi reîncărcată cu limba ta.",
    "fi", "Tehty. Sivu ladataan uudelleen kielelläsi.",
    "it", "Fatto. La pagina verrà ricaricata con la tua lingua.",
    "el", "Έγινε. Η σελίδα θα φορτωθεί ξανά με τη γλώσσα σας.",
    "eo", "Farite. La paĝo estos reŝarĝita per via lingvo.",
    "hu", "Kész. Az oldal újratöltődik a nyelveddel.",
    "nb", "Ferdig. Siden blir lastet på nytt med språket ditt.",
    "sk", "Hotovo. Stránka bude znovu načítaná s vaším jazykom.",
    "sv", "Klart. Sidan kommer att laddas om med ditt språk.",
    "sr", "Урађено. Страница ће бити поново учитана са вашим језиком.",
    "pl", "Gotowe. Strona zostanie ponownie załadowana w twoim języku.",
    "nl", "Klaar. De pagina wordt opnieuw geladen met jouw taal.",
    "de", "Erledigt. Die Seite wird mit Ihrer Sprache neu geladen.",
    "da", "Færdig. Siden vil blive genindlæst med dit sprog.",
    "cs", "Hotovo. Stránka bude znovu načtena ve vašem jazyce.",
    "uk", "Готово. Сторінка буде перезавантажена з вашою мовою.",
    "tr", "Tamamlandı. Sayfa, dilinizle yeniden yüklenecek.",
    "vi", "Hoàn tất. Trang sẽ được tải lại với ngôn ngữ của bạn.",
    "fr-CA", "Fait. La page sera rechargée avec votre langue."
  ];

  const alertIdioms3 = [
    "pt-BR", "Salvo! A página será recarregada para ativar a ocultação das novas palavras-chave.",
    "es", "¡Guardado! La página se recargará para activar la ocultación de las nuevas palabras clave.",
    "en", "Saved! The page will be reloaded to activate the hiding of new keywords.",
    "fr", "Enregistré ! La page sera rechargée pour activer la dissimulation des nouveaux mots-clés.",
    "ru", "Сохранено! Страница будет перезагружена для активации скрытия новых ключевых слов.",
    "ja", "保存されました！新しいキーワードの非表示を有効にするためにページがリロードされます。",
    "ko", "저장되었습니다! 새로운 키워드를 숨기기 위해 페이지가 다시로드됩니다.",
    "zh-tw", "已儲存！將重新載入頁面以啟用隱藏新關鍵字。",
    "zh-cn", "已保存！页面将重新加载以激活新关键字的隐藏。",
    "id", "Tersimpan! Halaman akan dimuat ulang untuk mengaktifkan penyembunyian kata kunci baru.",
    "ug", "ساقلاشتۇرۇلدى! يېڭى سۆزلەر كۆڭۈلدىكى كۆرسىتىشنى قوللايدۇ.",
    "ar", "تم الحفظ! سيتم إعادة تحميل الصفحة لتنشيط إخفاء الكلمات الرئيسية الجديدة.",
    "he", "נשמר! הדף ייטען מחדש כדי להפעיל את ההסתרה של המילות המפתח החדשות.",
    "hi", "सहेजा गया! पृष्ठ को पुनः लोड करके नए कीवर्ड को छुपाने के लिए।",
    "th", "บันทึกแล้ว! หน้าจะถูกโหลดใหม่เพื่อเปิดใช้การซ่อนคำคีย์เวิร์ดใหม่",
    "bg", "Запазено! Страницата ще бъде презаредена, за да активира скриването на новите ключови думи.",
    "ro", "Salvat! Pagina va fi reîncărcată pentru a activa ascunderea noilor cuvinte cheie.",
    "fi", "Tallennettu! Sivu ladataan uudelleen uusien avainsanojen piilottamiseksi.",
    "it", "Salvato! La pagina sarà ricaricata per attivare la nascosta delle nuove parole chiave.",
    "el", "Αποθηκεύτηκε! Η σελίδα θα φορτωθεί ξανά για να ενεργοποιήσει την απόκρυψη των νέων λέξεων-κλειδιών.",
    "eo", "Konservite! La paĝo estos reŝarĝita por aktivigi la kaŝadon de novaj ŝlosilvortoj.",
    "hu", "Mentve! Az oldal újratöltődik az új kulcsszavak elrejtéséhez.",
    "nb", "Lagret! Siden blir lastet på nytt for å aktivere skjulingen av nye nøkkelord.",
    "sk", "Uložené! Stránka bude znovu načítaná pre aktiváciu skrytia nových kľúčových slov.",
    "sv", "Sparat! Sidan kommer att laddas om för att aktivera döljandet av nya nyckelord.",
    "sr", "Сачувано! Страница ће бити поново учитана како би активирала сакривање нових кључних речи.",
    "pl", "Zapisano! Strona zostanie ponownie załadowana, aby aktywować ukrywanie nowych słów kluczowych.",
    "nl", "Opgeslagen! De pagina wordt opnieuw geladen om het verbergen van nieuwe zoekwoorden te activeren.",
    "de", "Gespeichert! Die Seite wird neu geladen, um das Ausblenden neuer Schlüsselwörter zu aktivieren.",
    "da", "Gemt! Siden bliver genindlæst for at aktivere skjulningen af nye nøgleord.",
    "cs", "Uloženo! Stránka bude znovu načtena pro aktivaci skrytí nových klíčových slov.",
    "uk", "Збережено! Сторінка буде перезавантажена для активації приховування нових ключових слів.",
    "tr", "Kaydedildi! Sayfa, yeni anahtar kelimelerin gizlenmesini etkinleştirmek için yeniden yüklenecek.",
    "vi", "Đã lưu! Trang sẽ được tải lại để kích hoạt việc ẩn từ khóa mới.",
    "fr-CA", "Enregistré ! La page sera rechargée pour activer la dissimulation des nouveaux mots-clés."
  ];

  const alertIdioms4 = [
    "pt-BR", "Abrir página do projeto Youtube Lite",
    "es", "Abrir página del proyecto Youtube Lite",
    "en", "Open Youtube Lite project page",
    "fr", "Ouvrir la page du projet Youtube Lite",
    "ru", "Открыть страницу проекта Youtube Lite",
    "ja", "Youtube Lite プロジェクトのページを開く",
    "ko", "Youtube Lite 프로젝트 페이지 열기",
    "zh-tw", "打開 Youtube Lite 項目頁",
    "zh-cn", "打开 Youtube Lite 项目页面",
    "id", "Buka halaman proyek Youtube Lite",
    "ug", "Youtube Lite dastur beti ochuq",
    "ar", "افتح صفحة مشروع يوتيوب لايت",
    "he", "פתח דף של פרויקט Youtube Lite",
    "hi", "Youtube Lite परियोजना का पृष्ठ खोलें",
    "th", "เปิดหน้าของโครงการ Youtube Lite",
    "bg", "Отвори страницата на проекта Youtube Lite",
    "ro", "Deschideți pagina proiectului Youtube Lite",
    "fi", "Avaa Youtube Lite -projektin sivu",
    "it", "Apri la pagina del progetto Youtube Lite",
    "el", "Ανοίξτε τη σελίδα του έργου Youtube Lite",
    "eo", "Malfermi paĝon de la projekto Youtube Lite",
    "hu", "Nyissa meg a Youtube Lite projekt oldalát",
    "nb", "Åpne siden til Youtube Lite-prosjektet",
    "sk", "Otvorte stránku projektu Youtube Lite",
    "sv", "Öppna sidan för Youtube Lite-projektet",
    "sr", "Отвори страницу пројекта Youtube Lite",
    "pl", "Otwórz stronę projektu Youtube Lite",
    "nl", "Open pagina van het Youtube Lite-project",
    "de", "Öffne die Seite des Youtube Lite-Projekts",
    "da", "Åbn side for Youtube Lite-projektet",
    "cs", "Otevřít stránku projektu Youtube Lite",
    "uk", "Відкрити сторінку проекту Youtube Lite",
    "tr", "Youtube Lite projesi sayfasını aç",
    "vi", "Mở trang của dự án Youtube Lite",
    "fr-CA", "Ouvrir la page du projet Youtube Lite"
  ];





  function getUrl(xxx) {
    try {
      if (typeof xxx !== 'string') {
        throw new Error('Input is not a string');
      }
      const url = new URL(xxx);
      const vParam = url.searchParams.get('v');

      if (vParam) {
        return vParam;
      }
    } catch (error) {
      console.error('ERROR "v":', error);
    }
    return null;
  }







  GM_addStyle('@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.3/font/bootstrap-icons.css");');



// Função para extrair o ID do vídeo da URL
function getVideoIdFromUrl() {
    const url = window.location.href;
    const match = url.match(/[?&]v=([^&]+)/);
    if (match && match[1]) {
        return match[1];
    }
    return null;
}





  // Recupere o texto salvo no armazenamento local
  var palavrasSalvas = GM_getValue('keyWords', '')

  function stringParaArray(xpalavrasChave) {
    const arrayDePalavras = xpalavrasChave.split(',');
    const palavrasLimparEspacos = arrayDePalavras
      .map(palavra => palavra.trim())
      .filter(palavra => palavra !== '');
    return palavrasLimparEspacos;
  }

  const palavrasChaveString = palavrasSalvas;
  const palavrasChave = stringParaArray(palavrasChaveString);;

  //console.log(palavrasChave);

  function converterParaArray() {
      // Obtém o valor da textarea
      const listaTexto = document.getElementById('listaDeTermos').value;

      // Divide o texto em termos separados por vírgulas
      const termosArray = listaTexto.split(',');

      // Remove espaços em branco em excesso em cada termo
      const termosLimpos = termosArray.map(termo => termo.trim());

      // Exibe o resultado na página
      const resultado = document.getElementById('resultado');
      resultado.textContent = JSON.stringify(termosLimpos);
  }

  // Função para verificar se uma palavra-chave está presente em um elemento
  function verificaPalavrasChave(elemento) {
    var texto = elemento.textContent.toLowerCase();
    for (var i = 0; i < palavrasChave.length; i++) {
      var palavra = palavrasChave[i].toLowerCase();
      if (texto.includes(palavra)) {
        return true;
      }
    }
    return false;
  }


function getUrl(xxx) {
  try {
    if (typeof xxx !== 'string') {
      throw new Error('Input is not a string');
    }
    const url = new URL(xxx);
    const vParam = url.searchParams.get('v');

    if (vParam) {
      return vParam;
    }
  } catch (error) {
    console.error('ERROR "v":', error);
  }
  return null;
}



  // Função para remover tags "ytd-rich-item-renderer" com base nas palavras-chave
  function removeTagsComPalavrasChave() {
    var elementos = document.querySelectorAll("ytd-rich-item-renderer");
    elementos.forEach(function (elemento) {
      if (verificaPalavrasChave(elemento)) {
        elemento.remove();
      }
    });
    //remove palavras-chave na pesquisa
    var elementosShorts = document.querySelectorAll("ytd-video-renderer");
    elementosShorts.forEach(function (elemento) {
      if (verificaPalavrasChave(elemento)) {
        elemento.remove();
      }
    });
  }





  // CÓDIGO IMPORTADO
  const equalText1 = "Skip Ads";
  const equalText2 = "Skip Ad";

  function addNewStyle(newStyle) {
      var styleElement = document.getElementById('styles_js');
      if (!styleElement) {
          styleElement = document.createElement('style');
          styleElement.type = 'text/css';
          styleElement.id = 'styles_js';
          document.getElementsByTagName('head')[0].appendChild(styleElement);
      }
      styleElement.appendChild(document.createTextNode(newStyle));
  }
  function skipAd(){
      if(document.getElementsByClassName("ytp-ad-skip-button").length > 0){
          if(document.getElementsByClassName("ytp-ad-skip-button")[0].childNodes[0].textContent === equalText1 || document.getElementsByClassName("ytp-ad-skip-button")[0].childNodes[0].textContent === equalText2){
              document.getElementsByClassName("ytp-ad-skip-button")[0].click();
          } else {
              setTimeout(skipAd(), 1000);
          }
      }
  }


    // Função para remover todos os elementos desnecessários
    function removerTagsScript() {
        if(sessao == 1 && window.location.href.includes("v=") !== true){
          addButtons();
          sessao = 2;
        }
        if(sessao == 2 && window.location.href.includes("v=") == true){
          window.location.reload();
        }

        setTimeout(function(){
          const scripts = document.querySelectorAll('script');
          scripts.forEach(function(script) {
              script.parentNode.removeChild(script);
          });

          const tagthumbnails = document.querySelectorAll('ytd-playlist-thumbnail');
          tagthumbnails.forEach(function(thumbnail) {
              thumbnail.parentNode.removeChild(thumbnail);
          });
          const tagthumbnail2s = document.querySelectorAll('ytd-moving-thumbnail-renderer');
          tagthumbnail2s.forEach(function(thumbnail2) {
              thumbnail2.parentNode.removeChild(thumbnail2);
          });
          const tagthumbnail3s = document.querySelectorAll('ytd-thumbnail-overlay-toggle-button-renderer');
          tagthumbnail3s.forEach(function(thumbnail3) {
              thumbnail3.parentNode.removeChild(thumbnail3);
          });
          const tagthumbnail4s = document.querySelectorAll('ytd-thumbnail-overlay-inline-unplayable-renderer');
          tagthumbnail4s.forEach(function(thumbnail4) {
              thumbnail4.parentNode.removeChild(thumbnail4);
          });
          const tagthumbnail5s = document.querySelectorAll('ytd-thumbnail-overlay-resume-playback-renderer');
          tagthumbnail5s.forEach(function(thumbnail5) {
              thumbnail5.parentNode.removeChild(thumbnail5);
          });

          const iconsets = document.querySelectorAll('iron-iconset-svg');
          iconsets.forEach(function(iconset) {
              iconset.parentNode.removeChild(iconset);
          });

          const recomendados = document.querySelectorAll('ytd-watch-next-secondary-results-renderer');
          recomendados.forEach(function(recomendado) {
              recomendado.parentNode.removeChild(recomendado);
          });
          const recomendado2s = document.querySelectorAll('ytd-statement-banner-renderer');
          recomendado2s.forEach(function(recomendado2) {
              recomendado2.parentNode.removeChild(recomendado2);
          });
          const ychats = document.querySelectorAll('ytd-live-chat-frame');
          ychats.forEach(function(ychat) {
              ychat.parentNode.removeChild(ychat);
          });
          const ycanvas = document.querySelectorAll('canvas');
          ycanvas.forEach(function(ycanva) {
              ycanva.parentNode.removeChild(ycanva);
          });
          const yminiplayers = document.querySelectorAll('ytd-miniplayer');
          yminiplayers.forEach(function(yminiplayer) {
              yminiplayer.parentNode.removeChild(yminiplayer);
          });

          const ythirds = document.querySelectorAll('ytd-third-party-manager');
          ythirds.forEach(function(ythird) {
              ythird.parentNode.removeChild(ythird);
          });
          const yannouncers = document.querySelectorAll('iron-a11y-announcer');
          yannouncers.forEach(function(yannouncer) {
              yannouncer.parentNode.removeChild(yannouncer);
          });
          const ymediaQuerys = document.querySelectorAll('iron-media-query');
          ymediaQuerys.forEach(function(ymediaQuery) {
              ymediaQuery.parentNode.removeChild(ymediaQuery);
          });
          const ytdAds = document.querySelectorAll('ytd-ad-slot-renderer');
          ytdAds.forEach(function(ytdAd) {
              ytdAd.parentNode.removeChild(ytdAd);
          });
          const ytdAd3s = document.querySelectorAll('ytd-merch-shelf-renderer');
          ytdAd3s.forEach(function(ytdAd3) {
              ytdAd3.parentNode.removeChild(ytdAd3);
          });
          /*const ytdAd4s = document.querySelectorAll('tp-yt-paper-dialog');
          ytdAd4s.forEach(function(ytdAd4) {
              ytdAd4.parentNode.removeChild(ytdAd4);
          });*/
          const ytdAd5s = document.querySelectorAll('ytd-action-companion-ad-renderer');
          ytdAd5s.forEach(function(ytdAd5) {
              ytdAd5.parentNode.removeChild(ytdAd5);
          });
          const ytdAd6s = document.querySelectorAll('ytm-video-with-context-renderer');
          ytdAd6s.forEach(function(ytdAd6) {
              ytdAd6.parentNode.removeChild(ytdAd6);
          });
          const ytdAd7s = document.querySelectorAll('ytm-continuation-item-renderer');
          ytdAd7s.forEach(function(ytdAd7) {
              ytdAd7.parentNode.removeChild(ytdAd7);
          });

          const videosAds = document.querySelectorAll('.video-ads');
          if(videosAds){
            if (videosAds.length > 0) {
            videosAds.forEach(function(videosAd) {
                videosAd.parentNode.removeChild(videosAd);
              });
            }
          }



          if(GM_getValue('imgShow') !== undefined && GM_getValue('imgShow') == "no"){
            const thumbnails = document.querySelectorAll('#thumbnail');
            if (thumbnails) {
              thumbnails.forEach(function(xthumbnail) {
                  if(xthumbnail.href == undefined){
                    xthumbnail.parentNode.removeChild(xthumbnail);
                  }else if(xthumbnail.href.includes("/shorts/") == true){
                    //console.log(xthumbnail.href)
                  }else{
                    xthumbnail.parentNode.removeChild(xthumbnail);
                  }
              });
            }
          }

          if(GM_getValue('shortsShow') == undefined || GM_getValue('shortsShow') == "no"){
                const shortsOpt = document.querySelectorAll('#endpoint');
                if(shortsOpt){
                  if (shortsOpt.length > 0) {
                  shortsOpt.forEach(function(shots) {
                      if(shots.title == "Shorts"){
                        shots.parentNode.removeChild(shots);
                      }
                    });
                  }
                }

              let mediaElements = document.querySelectorAll('video, audio');
              if(mediaElements){
                mediaElements.forEach(function (media) {
                  if (typeof media.play === 'function') {
                      media.play = function () {};
                    }
                  });
              }

              const xplayers = document.querySelectorAll('ytd-player');
              xplayers.forEach(function(player) {
                  player.parentNode.removeChild(player);
              });
              const interactions = document.querySelectorAll('yt-interaction');
              interactions.forEach(function(interaction) {
                  interaction.parentNode.removeChild(interaction);
              });

              const renderers = document.querySelectorAll('ytd-rich-shelf-renderer');
              renderers.forEach(function(renderer) {
                  renderer.parentNode.removeChild(renderer);
              });

              const ytdAd2s = document.querySelectorAll('ytd-rich-section-renderer');
              ytdAd2s.forEach(function(ytdAd2) {
                  ytdAd2.parentNode.removeChild(ytdAd2);
              });

              const recomendado3s = document.querySelectorAll('ytd-reel-shelf-renderer');
              recomendado3s.forEach(function(recomendado3) {
                  recomendado3.parentNode.removeChild(recomendado3);
              });
              const ytshots = document.querySelectorAll('ytd-shorts');
              ytshots.forEach(function(shotsPage) {
                  shotsPage.parentNode.removeChild(shotsPage);
              });

            //remove Shorts in search
            var elementosShorts = document.querySelectorAll("ytd-video-renderer");
            elementosShorts.forEach(elemento => {
                var subElemento = elemento.querySelector("#text");
                if (subElemento.textContent.includes("SHORTS")) {
                    elemento.remove();
                }
            });


          }



          const previews = document.querySelectorAll('.ytp-gradient-top');
          if(previews){
            if (previews.length > 0) {
            previews.forEach(function(preview) {
                preview.style.display = 'none';
                preview.parentNode.removeChild(preview);
              });
            }
          }
          const previews2 = document.querySelectorAll('#hover-overlays');
          if(previews2){
            if (previews2.length > 0) {
            previews2.forEach(function(preview) {
                preview.style.display = 'none';
                preview.parentNode.removeChild(preview);
              });
            }
          }
          const previews3 = document.querySelectorAll('#mouseover-overlay');
          if(previews3){
            if (previews3.length > 0) {
            previews3.forEach(function(preview) {
                preview.style.display = 'none';
                preview.parentNode.removeChild(preview);
              });
            }
          }



          if(window.location.href.includes("youtube.com")){
              skipAd();
          }

        // Selecione todos os elementos do DOM
        var allElements = document.querySelectorAll('*');
        // Itere por todos os elementos e remova os manipuladores de eventos de clique
        allElements.forEach(function(element) {
            element.click = "";
            element.keydown = "";
            element.mousedown = "";
            element.down = "";
            element.attached = "";
            //element.onclick = "";
            element.auxclick = "";
            element.dblclick = "";
            element.copy = "";
            element.change = "";
            element.keypress = "";
            element.mouseover = "";
        });


          // Obtém todos os elementos pelo ID e os remove
          let currentURL = window.location.href;
          if (currentURL.includes("v=")) {
              const playerPrincipal = document.querySelectorAll('#player-container-outer');
              for (const element of playerPrincipal) {
                  element.remove();
                };
              const allSecundary = document.querySelectorAll('#secondary');
              for (const element of allSecundary) {
                  element.remove();
                };
              const primaryx = document.querySelector('#primary');
              if (primaryx) {
                  primaryx.style.maxWidth = "720px";
                  primaryx.style.margin = "auto";
                  primaryx.style.padding = "2px 10px";
                }
            };
          const playerAds = document.querySelectorAll('#player-ads');
          for (const element of playerAds) {
              element.remove();
            };
          const alertRemoves = document.querySelectorAll('#clarify-box');
          for (const element of alertRemoves) {
              element.remove();
            };
          const elementsToRemove = document.querySelectorAll('#video-preview');
          for (const element of elementsToRemove) {
              element.remove();
            };

          const adsInfo = document.querySelectorAll('#ads-info-button');
          for (const element of adsInfo) {
              element.remove();
            };

      }, 500);
    }

  let errorPlay = false;
  function tagsNonePlay(){
    const vernoYt = document.querySelector('.ytp-impression-link');
    if (vernoYt) {
        vernoYt.style.display = "none";
      }
    const pausenokoo = document.querySelector('.ytp-pause-overlay');
    if (pausenokoo) {
        pausenokoo.style.display = "none";
      }
    const notificKoo1 = document.querySelector('.ytp-info-panel-preview');
    if (notificKoo1) {
        notificKoo1.style.display = "none";
      }
    const notificKoo2 = document.querySelector('.html5-endscreen.ytp-player-content.videowall-endscreen.ytp-endscreen-paginate.ytp-show-tiles');
    if (notificKoo2) {
        notificKoo2.style.display = "none";
      }
    const errorx1 = document.querySelector('.ytp-error-content');
    if (errorx1 && errorPlay == false) {
        errorPlay = true;
        let notError= document.querySelector('.ytp-error-content-wrap');
        let videoId = "";
        let currentURL = window.location.href;
          var urlxx = currentURL;
          var videoCode = urlxx.match(/embed\/([A-Za-z0-9_-]+)/);
          if (videoCode && videoCode.length > 1) {
              var codigoDoVideo = videoCode[1];
              videoId = codigoDoVideo;
          }
        idiomaPadrao = GM_getValue('xidiomaSelecionado');
        notError.innerHTML = `
        <div class="ytp-error-content-wrap-reason">
          <span>Youtube Lite (error). Options:</span></div>
        <div class="ytp-error-content-wrap-subreason">
          <div style="line-height: 1.8">
            <a style="text-decoration: none" href="https://yewtu.be/latest_version?id=${videoId}" onclick="this.textContent = '→ Loading...';">→ Open with Player 2</a>
            <br>
            <a style="text-decoration: none" href="https://riservato-xyz.frama.io/watch/?v=${videoId}" onclick="this.textContent = '→ Loading...';">→ Open with Player 3</a>
            <br>
            <a style="text-decoration: none" href="https://invidious.slipfox.xyz/watch?v=${videoId}&dark_mode=true&hl=${idiomaPadrao}&iv_load_policy=3&quality=medium&related_videos=false&region=3166&controls=1&player_style=youtube" target="_blank">→ Open in Invidious</a>
        </div>`;
        let baixeError = document.querySelector('.ytp-small-redirect');
        baixeError.innerHTML = `<i class="bi bi-download"></i>`;
        baixeError.href = `https://www.y2mate.com/pt/youtube/${videoId}`;
        baixeError.title = "Download";
        baixeError.style.fontSize = "2.1rem";
        baixeError.setAttribute('target', '_blank');
      }
  }


    function addLinks(){
      // Troca links
      function removaTudo(event) {
        event = ``;
      }

      const richItemRenderers = document.querySelectorAll('ytd-rich-item-renderer');
      const brocken = document.querySelectorAll('body');
      for (const xbrocken of brocken) {
        const childElements = xbrocken.querySelectorAll('*'); // Seleciona todos os elementos filhos do elemento
          childElements.forEach((retiraEvento) => {
            retiraEvento.removeEventListener('click', removaTudo(this));
            retiraEvento.removeEventListener('mousedown', removaTudo(this));
            retiraEvento.removeEventListener('down', removaTudo(this));
            retiraEvento.removeEventListener('pointerdown', removaTudo(this));
            retiraEvento.removeEventListener('mouseover', removaTudo(this));
            retiraEvento.removeEventListener('keypress', removaTudo(this));
            retiraEvento.removeEventListener('keydown', removaTudo(this));
            retiraEvento.removeEventListener('load', removaTudo(this));
            retiraEvento.removeEventListener('yt-action', removaTudo(this));
            retiraEvento.removeEventListener('mouseenter', removaTudo(this));
            retiraEvento.removeEventListener('mouseleave', removaTudo(this));
            retiraEvento.removeEventListener('wheel', removaTudo(this));
          });
      };
      for (const renderer of richItemRenderers) {
        idiomaPadrao = GM_getValue('xidiomaSelecionado');
        const links = renderer.querySelectorAll('a');
        for (const link of links) {
          if (link.href.indexOf('v=') !== -1) {
            let linkID = getUrl(link.href);
            link.setAttribute('href', `https://www.youtube-nocookie.com/embed/${linkID}?rel=0&controls=2&color=red&iv_load_policy=3&showinfo=0&modestbranding=1&hl=${idiomaPadrao}&autoplay=1`);
            link.setAttribute('target', '_blank')
            //link.setAttribute('onclick', `event.preventDefault(); window.location.href='https://www.youtube-nocookie.com/embed/${linkID}?rel=0&controls=2&color=red&iv_load_policy=3&showinfo=0&modestbranding=1&hl=${idiomaPadrao}&autoplay=1', '_blank';`);
          }
        }
      }
    }




    // Função para criar o iframe personalizado
    function createCustomIframe(videoId) {
      document.body.innerHTML = ``;
    }


    // Função para limpar todos os cookies do site na primeira vez
    function limparCookies() {
        if(localStorage.getItem('verificarCookies') == null){
            localStorage.setItem('verificarCookies', "primeiraVez");
        }
        if (localStorage.getItem('verificarCookies') == "primeiraVez" || localStorage.getItem('verificarVersao') !== "3.4"){
          localStorage.setItem('verificarVersao', "3.4");
          idiomaPadrao = GM_getValue('xidiomaSelecionado');
          let idiomSelect = alertIdioms1.indexOf(idiomaPadrao)
          alert(alertIdioms1[idiomSelect+1])
          localStorage.setItem('verificarCookies', "tudoSuave");
          var cookies = document.cookie.split(';');
          for (var i = 0; i < cookies.length; i++) {
              var cookie = cookies[i];
              var igualPos = cookie.indexOf('=');
              var nome = igualPos > -1 ? cookie.substr(0, igualPos) : cookie;
              document.cookie = nome + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
          }
          window.location.reload();
        }
    }





  function addButtons(){
    if(window.location.href.includes("v=") !== true && window.location.href.includes("youtube-nocookie.com") !== true){

      let imgX = "yes";
      let shortX = "no";

      if(GM_getValue('imgShow') == undefined){ //imagem hidden
         GM_setValue('imgShow', "yes");
      }
      if(GM_getValue('imgShow') !== undefined){
        imgX = GM_getValue('imgShow');
      }
      if(GM_getValue('shortsShow') == undefined){ //shorts hidden
         GM_setValue('shortsShow', "no");
      }
      if(GM_getValue('shortsShow') !== undefined){
        shortX = GM_getValue('shortsShow');
      }

      var xmyMenus = document.createElement('div');
      xmyMenus.style.position = 'absolute';
      xmyMenus.id = 'xmenus';
      xmyMenus.style.width = '80%';
      xmyMenus.style.height = '40px';
      xmyMenus.style.top = '52px';
      xmyMenus.style.right = '2%';
      xmyMenus.style.textAlign = 'center';
      xmyMenus.style.zIndex = '999';
      xmyMenus.style.marginTop = '1px';
      xmyMenus.style.borderBottom = '1px solid #332a73';
      xmyMenus.style.backgroundColor = 'rgba(3, 3, 4, 0.12)';
      xmyMenus.style.borderRadius = '5px';

      // Cria o botão "Editar Palavras"
      var editarPalavrasButton = document.createElement('button');
      editarPalavrasButton.className = 'buttonsLite';
      editarPalavrasButton.title = 'List of keywords to hide videos';
      editarPalavrasButton.style.fontSize = '17px';
      editarPalavrasButton.style.marginTop = '9px';
      editarPalavrasButton.style.backgroundColor = '#000';
      editarPalavrasButton.style.color = '#fff';
      editarPalavrasButton.style.height = '27px';
      editarPalavrasButton.style.padding = '2px 1.5%';
      editarPalavrasButton.innerHTML = "<i class='bi bi-card-list'></i> → <i class='bi bi-trash3'></i>";

      var gaveta = document.createElement('div');
      gaveta.style.position = 'fixed';
      gaveta.id = 'gavetax';
      gaveta.style.top = '40px';
      gaveta.style.zIndex = '9999';
      gaveta.style.width = '320px';
      gaveta.style.height = '170px';
      gaveta.style.right = '50%';
      gaveta.style.left = '50%';
      gaveta.style.textAlign = 'center';
      gaveta.style.transform = 'translate(-50%, 12%)';
      gaveta.style.border = '1px solid #fff';
      gaveta.style.borderRadius = '5px';
      gaveta.style.backgroundColor = 'rgba(14, 10, 28, 0.94)';
      gaveta.style.overflow = 'hidden';
      gaveta.style.display = 'none';

      var textarea = document.createElement('textarea');
      textarea.style.width = '200px';
      textarea.style.width = '93%';
      textarea.style.height = '130px';
      textarea.style.backgroundColor = '#0d0d0f';
      textarea.style.color = '#fff';
      textarea.style.padding = '5px 9px';
      textarea.style.lineHeight = '1.5';
      textarea.style.border = 'none';
      textarea.style.borderBottom = 'solid 1px gray';
      textarea.placeholder = 'Exemples: futebol, Big Brother, etc';
      textarea.value = palavrasSalvas;

      var salvarButton = document.createElement('button');
      salvarButton.className = 'buttonsLite';
      salvarButton.style.marginTop = '2px';
      salvarButton.style.width = '85%';
      salvarButton.style.padding = '2px 10px';
      salvarButton.style.backgroundColor = '#000';
      salvarButton.style.color = '#fff';
      salvarButton.innerHTML = 'Save and hide all';

      var cancelarTag = document.createElement('button');
      cancelarTag.className = 'buttonsLite';
      cancelarTag.style.marginTop = '2px';
      cancelarTag.style.marginLeft = '5px';
      cancelarTag.style.width = '10%';
      cancelarTag.style.padding = '2px 10px';
      cancelarTag.style.backgroundColor = '#000';
      cancelarTag.style.color = '#fff';
      cancelarTag.innerHTML = 'X';
      //cancelarTag.setAttribute("onclick", "document.getElementById('gavetax').style.display = 'none';")

      var toggleImg = document.createElement('button');
      toggleImg.className = 'buttonsLite';
      toggleImg.title = 'Toggle';
      toggleImg.style.fontSize = '17px';
      toggleImg.style.marginTop = '9px';
      toggleImg.style.backgroundColor = '#000';
      toggleImg.style.color = '#fff';
      toggleImg.style.height = '27px';
      toggleImg.style.marginLeft = '10px';
      toggleImg.style.padding = '2px 1.5%';
      toggleImg.innerHTML = `<i id='mudeImg' class='bi bi-image-fill'></i> → ${imgX}`;

      var toggleShorts = document.createElement('button');
      toggleShorts.className = 'buttonsLite';
      toggleShorts.title = 'Toggle';
      toggleShorts.style.fontSize = '17px';
      toggleShorts.style.marginTop = '9px';
      toggleShorts.style.backgroundColor = '#000';
      toggleShorts.style.color = '#fff';
      toggleShorts.style.height = '27px';
      toggleShorts.style.marginLeft = '10px';
      toggleShorts.style.padding = '2px 1.5%';
      toggleShorts.innerHTML = `<img style="float: left; height: 16px; margin-top: 2px;" src=" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABE0lEQVRIibWWUbGDMBBFKwEJSKgEJCChDirhVUId8BwUB42D1kGrYA8OeB9sZxgmuwnJa2buDwnnbpbcDIdDwQAa4AzcVTegK2HF4CfgBcwRDTXgTquNgdfq94JbYMgAf/TYA7+wjFz4DMw54N7pc52BVl0EVo0evKuEz+5xBcbYSyIyicjkgXXeP0FAMACBJVxXY/4JtC48ZbBaczTWDUCTMrAqDJG1PfDeZsA1ARqj1zGDBviJrL2mdnHUnpoGLPcRxm5xDYx2BX3WaRuqk7z9Fg8y7yMRmVLwaBZ26NeDVyVZD0j7reqDC1cDK2ie3sDJBa8MrKBZupBKb+E3GJPtKNzFk//4e2BJ6vqeye/zZvwBitjBRqJM6NMAAAAASUVORK5CYII=">
      → ${shortX}`;






    // Array de idiomas disponíveis
    const idiomas = [
        "Português", "pt-BR",
        "Español", "es",
        "English", "en",
        "Français", "fr",
        "Русский", "ru",
        "日本語", "ja",
        "한국어", "ko",
        "繁體中文", "zh-tw",
        "简体中文", "zh-cn",
        "Bahasa Indonesia", "id",
        "Uyghur", "ug",
        "العربية", "ar",
        "עברית", "he",
        "हिन्दी", "hi",
        "ไทย", "th",
        "Български", "bg",
        "Română", "ro",
        "Suomi", "fi",
        "Italiano", "it",
        "Ελληνικά", "el",
        "Esperanto", "eo",
        "Magyar", "hu",
        "Norsk Bokmål", "nb",
        "Slovenčina", "sk",
        "Svenska", "sv",
        "Српски", "sr",
        "Polski", "pl",
        "Nederlands", "nl",
        "Deutsch", "de",
        "Dansk", "da",
        "Čeština", "cs",
        "Українська", "uk",
        "Türkçe", "tr",
        "Tiếng Việt", "vi",
        "Français canadien", "fr-CA"
    ];

    // Recupera o idioma salvo
    const idiomaSalvo = GM_getValue('xidiomaSelecionado', idiomas[0]);

    // Cria o elemento select
    const selectIdioma = document.createElement('select');
    selectIdioma.id = 'selectIdioma';
    selectIdioma.className = 'buttonsLite';
    selectIdioma.title = 'Select your language';
    selectIdioma.style.width = '130px';
    selectIdioma.style.fontSize = '17px';
    selectIdioma.style.marginTop = '9px';
    selectIdioma.style.backgroundColor = '#000';
    selectIdioma.style.color = '#fff';
    selectIdioma.style.height = '27px';
    selectIdioma.style.marginLeft = '10px';
    selectIdioma.style.padding = '2px 1.5%';

    // Adiciona as opções de idiomas ao select
    for (let i = 0; i < idiomas.length; i += 2) {
        const option = document.createElement('option');
        option.value = idiomas[i + 1];
        option.text = idiomas[i];
        selectIdioma.appendChild(option);
    }

    selectIdioma.value = idiomaSalvo;

    // Adiciona um evento de mudança ao select
    selectIdioma.addEventListener('change', function() {
        // Salva o novo idioma selecionado
        GM_setValue('xidiomaSelecionado', this.value);
        idiomaPadrao = GM_getValue('xidiomaSelecionado');
        let idiomSelect = alertIdioms2.indexOf(idiomaPadrao)
        alert(alertIdioms2[idiomSelect+1])

        window.location.reload();
    });

    //console.log(GM_getValue('xidiomaSelecionado'));
    //console.log(idiomaPadrao);



      // Adiciona os elementos criados como filhos de xmyMenus
        xmyMenus.appendChild(editarPalavrasButton);
        gaveta.appendChild(textarea);
        gaveta.appendChild(salvarButton);
        gaveta.appendChild(cancelarTag);

        xmyMenus.appendChild(toggleImg);
        xmyMenus.appendChild(toggleShorts);
        xmyMenus.appendChild(selectIdioma);

        document.body.appendChild(xmyMenus);
        document.body.appendChild(gaveta);




      // Adicione um evento de clique ao botão de abrir a gaveta
      editarPalavrasButton.addEventListener('click', function() {
          gaveta.style.display = 'block';
      });

      // Adicione um evento de clique ao botão de salvar
      salvarButton.addEventListener('click', function() {
          var palavrasSalvas = textarea.value;
          GM_setValue('keyWords', palavrasSalvas);
          idiomaPadrao = GM_getValue('xidiomaSelecionado');
          let idiomSelect = alertIdioms3.indexOf(idiomaPadrao)
          alert(alertIdioms3[idiomSelect+1])
          gaveta.style.display = 'none';
          window.location.reload();
      });
      cancelarTag.addEventListener('click', function() {
          gaveta.style.display = "none";
      });

      toggleImg.addEventListener('click', function() {
          if(GM_getValue('imgShow') == "yes"){
             GM_setValue('imgShow', "no");
             toggleImg.innerHTML = "<i class='bi bi-image-fill'></i> → no";
          }else{
            GM_setValue('imgShow', "yes");
            toggleImg.innerHTML = "<i class='bi bi-image-fill'></i> → yes";
          }
      });

      toggleShorts.addEventListener('click', function() {
          if(GM_getValue('shortsShow') == "no"){
             GM_setValue('shortsShow', "yes");
             toggleShorts.innerHTML = `<img style="float: left; height: 16px; margin-top: 2px;" src=" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABE0lEQVRIibWWUbGDMBBFKwEJSKgEJCChDirhVUId8BwUB42D1kGrYA8OeB9sZxgmuwnJa2buDwnnbpbcDIdDwQAa4AzcVTegK2HF4CfgBcwRDTXgTquNgdfq94JbYMgAf/TYA7+wjFz4DMw54N7pc52BVl0EVo0evKuEz+5xBcbYSyIyicjkgXXeP0FAMACBJVxXY/4JtC48ZbBaczTWDUCTMrAqDJG1PfDeZsA1ARqj1zGDBviJrL2mdnHUnpoGLPcRxm5xDYx2BX3WaRuqk7z9Fg8y7yMRmVLwaBZ26NeDVyVZD0j7reqDC1cDK2ie3sDJBa8MrKBZupBKb+E3GJPtKNzFk//4e2BJ6vqeye/zZvwBitjBRqJM6NMAAAAASUVORK5CYII=">
      → yes`;
            window.location.reload();
          }else{
            GM_setValue('shortsShow', "no");
            toggleShorts.innerHTML = `<img style="float: left; height: 16px; margin-top: 2px;" src=" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABE0lEQVRIibWWUbGDMBBFKwEJSKgEJCChDirhVUId8BwUB42D1kGrYA8OeB9sZxgmuwnJa2buDwnnbpbcDIdDwQAa4AzcVTegK2HF4CfgBcwRDTXgTquNgdfq94JbYMgAf/TYA7+wjFz4DMw54N7pc52BVl0EVo0evKuEz+5xBcbYSyIyicjkgXXeP0FAMACBJVxXY/4JtC48ZbBaczTWDUCTMrAqDJG1PfDeZsA1ARqj1zGDBviJrL2mdnHUnpoGLPcRxm5xDYx2BX3WaRuqk7z9Fg8y7yMRmVLwaBZ26NeDVyVZD0j7reqDC1cDK2ie3sDJBa8MrKBZupBKb+E3GJPtKNzFk//4e2BJ6vqeye/zZvwBitjBRqJM6NMAAAAASUVORK5CYII=">
      → no`;
          }
      });

    }

      // Estilização
        const estiloHover = document.createElement('style');

        // Defina o conteúdo CSS para o efeito de hover
        estiloHover.innerHTML = `
          .buttonsLite{
            border: solid 1px aliceblue;
            border-radius: 5px;
            width: 115px;
          }
          .buttonsLite:hover{
            border: solid 1px #2f6797;
            background-color: rgb(6, 7, 15)
          }
          ytd-rich-item-renderer{
            border: solid 1px #0a0913ad;
            background-color: rgba(0, 0, 0, 0.44);
            border-radius: 1.1rem;
          }
          ytd-rich-item-renderer:hover {
            border: solid 1px #3f3c93;
            border-radius: 1.1rem;
            text-shadow: .5px 1px 6px #2e2451;
            background-color: rgba(0, 0, 0, 0.65);
          }
          ytd-video-renderer{
            border: solid 1px #0a0913ad;
            background-color: rgba(0, 0, 0, 0.44);
            border-radius: 1.1rem;
          }
          ytd-video-renderer:hover{
            border: solid 1px #3f3c93;
            border-radius: 1.1rem;
            text-shadow: .5px 1px 6px #2e2451;
            background-color: rgba(0, 0, 0, 0.65);
          }
        `;
        document.body.appendChild(estiloHover);
  }





    // Função para verificar a URL a cada 2 segundos
    function checkURL() {
        const currentURL = window.location.href;
        removeTagsComPalavrasChave();
        if (currentURL !== localStorage.getItem('lastCheckedURL') && currentURL.includes("v=")) {
            localStorage.setItem('trocou', "false");
            localStorage.setItem('trocardeNovo', "true");
            localStorage.setItem('atualReload', "false");
          if(currentURL !== localStorage.getItem('lastCheckedURL')){
              localStorage.setItem('lastCheckedURL', currentURL);
              window.location.reload();
            }
        }
      if(currentURL.includes("v=") && atualx == false){
        atualx = true;
        idiomaPadrao = GM_getValue('xidiomaSelecionado');
          setTimeout(function(){
            setTimeout(function(){
            const addPlayer1 = document.querySelector('#full-bleed-container');
            const addPlayer2 = document.querySelector('#player-container-id');
              if(addPlayer1){
                addPlayer1.style.textAlign = "center";
                addPlayer1.innerHTML = ``;
                addPlayer1.innerHTML += `<iframe style="width: 99%;max-width: 720px; border-radius: 1rem; height: 70%; height: 320px; margin-left: -1%;" id="xplayer" src="https://www.youtube-nocookie.com/embed/${videoId}?rel=0&controls=2&color=red&iv_load_policy=3&showinfo=0&modestbranding=1&hl=${idiomaPadrao}&autoplay=1" allow="accelerometer; autoplay='autoplay'; gyroscope; picture-in-picture" frameborder="0" frameborder="autoplay" scrolling="no" referrerpolicy="no-referrer" allowfullscreen=""></iframe>`;
              }else if(addPlayer2){
                let removeIt = document.querySelector('.player-size.player-placeholder');
                addPlayer2.style.position = "relative";
                removeIt.style.display = "none";
                addPlayer2.style.textAlign = "center";
                addPlayer2.innerHTML = ``;
                addPlayer2.innerHTML += `<iframe style="width: 99%;max-width: 720px; border-radius: 1rem; height: 70%; height: 320px; margin-left: -1%;" id="xplayer" src="https://www.youtube-nocookie.com/embed/${videoId}?rel=0&controls=2&color=red&iv_load_policy=3&showinfo=0&modestbranding=1&hl=${idiomaPadrao}&autoplay=0" allow="accelerometer; autoplay='autoplay'; gyroscope; picture-in-picture" frameborder="0" frameborder="autoplay" scrolling="no" referrerpolicy="no-referrer" allowfullscreen=""></iframe>`;
              }else{
                window.location.reload();
              }
            }, 500);
          }, 1500);
      }
      if (currentURL.includes("youtube.com")) {
          removerTagsScript();
        }
      if (currentURL.includes("youtube-nocookie.com/embed")) {
          tagsNonePlay();
      }

      let youtubeTag = document.querySelector('ytd-app');
        if (youtubeTag) {
          youtubeTag.setAttribute('id', 'ytdLite');
          if(window.location.href.includes("/shorts/") == true){
            youtubeTag.style.marginTop = '0px';
            let menusHidden = document.getElementById("xmenus");
            if(menusHidden){
              menusHidden.remove();
            }
          }else{
            addButtons();
            //youtubeTag.style.marginTop = '40px';
            if(window.location.href.includes("v=") !== true){
              let youtubeTag = document.querySelector('ytd-app');
              if (youtubeTag) {
                  youtubeTag.setAttribute('id', 'ytdLite');
                  youtubeTag.style.marginTop = '40px';
              }
            }
          }
        }
    }







      // Objeto que mapeia classes ou IDs de elementos para estilos de substituição
      const estilosParaSubstituir = {
          // INTERFACE
          'ytp-cued-thumbnail-overlay-image': 'background-position: center;background-repeat: no-repeat;background-attachment: fixed;background-size: 99% auto;', //campo inicial
          'ytp-gradient-top': 'height: 20px;',
        // Adicione mais pares de classes ou IDs aqui
      };

        // Função para substituir estilos CSS em elementos
        function substituirEstilos() {
            for (const seletor in estilosParaSubstituir) {
                const elementos = document.querySelectorAll(`.${seletor}, #${seletor}`);
                elementos.forEach(elemento => {
                    elemento.style.cssText += estilosParaSubstituir[seletor];
                });
            }
          }





     function notificaAlert() {
      document.title = "Youtube (Lite)";
      let currentURL = window.location.href;
        if (currentURL.includes("youtube-nocookie.com/embed")) {
        setTimeout(function(){
          substituirEstilos();
          let videoId = "";
          var urlxx = currentURL;
          var videoCode = urlxx.match(/embed\/([A-Za-z0-9_-]+)/);
          if (videoCode && videoCode.length > 1) {
              var codigoDoVideo = videoCode[1];
              videoId = codigoDoVideo;
          }

            var pageProject = document.querySelector(".ytp-title-link.yt-uix-sessionlink");
            if (pageProject) {
                var novaTagp = document.createElement("a");
                novaTagp.style.fontSize = "1.2rem";
                novaTagp.style.display = "inline-block";
                novaTagp.style.height = "35px";
                novaTagp.style.width = "100%";
                novaTagp.style.padding = "0px 5%";
                novaTagp.style.textAlign = "center";
                novaTagp.style.textShadow = "1px 2px 4px #3b3bf4";
                novaTagp.setAttribute('target', '_blank')

                idiomaPadrao = GM_getValue('xidiomaSelecionado');
                novaTagp.href = `https://greasyfork.org/${idiomaPadrao}/scripts/476133-youtube-lite-melhor-experi%C3%AAncia`;

                idiomaPadrao = GM_getValue('xidiomaSelecionado');
                let idiomSelect = alertIdioms4.indexOf(idiomaPadrao)

                novaTagp.innerHTML = `<i class="bi bi-code-slash"></i> <span>${alertIdioms4[idiomSelect+1]}</span>`;
                // Substitui o elemento original pelo novo elemento
                pageProject.parentNode.replaceChild(novaTagp, pageProject);
            }

            var invidiousPage = document.querySelector(".ytp-youtube-button.ytp-button.yt-uix-sessionlink");
            if (invidiousPage) {
                var novaTagV = document.createElement("a");
                novaTagV.style.fontSize = "1.3rem";
                novaTagV.style.display = "inline-block";
                novaTagV.style.float = "left";
                novaTagV.style.height = "40px";
                novaTagV.style.padding = "0px 10px";
                novaTagV.title = "Open video in Invidious";

                idiomaPadrao = GM_getValue('xidiomaSelecionado');
                novaTagV.href = `https://invidious.slipfox.xyz/watch?v=${videoId}&dark_mode=true&hl=${idiomaPadrao}&iv_load_policy=3&quality=medium&related_videos=false&region=3166&controls=1&player_style=youtube`;
                novaTagV.setAttribute('target', '_blank')

                novaTagV.innerHTML = `<img style="max-height: 23px; width: auto; margin: 8px 0px" src="https://invidious.snopyta.org/favicon-32x32.png">`;
                invidiousPage.parentNode.replaceChild(novaTagV, invidiousPage);
            }
          var filmSimple = document.querySelector(".ytp-right-controls");
            if (filmSimple) {
                var novaTagC = document.createElement("a");
                novaTagC.style.fontSize = "1.3rem";
                novaTagC.style.display = "inline-block";
                novaTagC.style.float = "left";
                novaTagC.style.height = "40px";
                novaTagC.style.padding = "0px 10px";
                novaTagC.title = "Simple video";

                novaTagC.href = `https://yewtu.be/latest_version?id=${videoId}`;

                novaTagC.innerHTML = `<i class="bi bi-film"></i>`;
                filmSimple.appendChild(novaTagC);
            }
          var downloadRun = document.querySelector(".ytp-right-controls");
            if (downloadRun) {
                var novaTagD = document.createElement("a");
                novaTagD.style.fontSize = "1.3rem";
                novaTagD.style.display = "inline-block";
                novaTagD.style.float = "left";
                novaTagD.style.height = "40px";
                novaTagD.style.padding = "0px 10px";
                novaTagD.title = "Download";
                novaTagD.setAttribute('target', '_blank')

                novaTagD.href = `https://www.y2mate.com/pt/youtube/${videoId}`;

                novaTagD.innerHTML = `<i class="bi bi-download"></i>`;
                downloadRun.appendChild(novaTagD);
            }
        }, 1000);


      }
      setInterval(checkURL, 550);
      addButtons()

      // Verifica a URL quando o script é carregado pela primeira vez
      let videoId = getVideoIdFromUrl();

      setTimeout(function(){
        if(verifyc1 == true){
          console.log("IPBLOCK: IP capture attempt blocked.");
        }
        if(verifyc2 == true){
          console.log("IPBLOCK: Fetch request attempt blocked.");
        }

      },1000);
    }

    window.addEventListener('load', notificaAlert);

})();

