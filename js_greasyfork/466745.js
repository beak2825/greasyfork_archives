// ==UserScript==
// @name          QuickLink: Website Boost
// @namespace     http://tampermonkey.net/
// @version       1.1.11
// @description   This userscript enhances website performance by preloading links in the background using QuickLink.
// @author        CY Fung
// @match         https://*/*
// @icon          data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5MCA5MCIgeG1sbnM6dj0iaHR0cHM6Ly92ZWN0YS5pby9uYW5vIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDkwdjkwSDB6Ii8+PHBhdGggZmlsbD0iIzAzMyIgZD0iTTAgMGg5MHY5MEgwVjB6bTQxLjMgNTAuOXEtLjctLjItMS4zLS4zLTEuMi0uMi0yLjYuMy0yLjMgMS0zLjIgMy4yLS43IDEuNi0uNCAzLjIuMyAxLjggMS42IDMgMS43IDEuNiA0LjUgMi41IDMuMiAxLjEgNi42IDEuMiAzLjEuMSA2LjUtLjggNy40LTEuOSAxMi43LTcuMiA2LjgtNi44IDEzLjctMTMuNyA0LjctNC43IDUuNi01LjggNS43LTcuMSA0LjgtMTYuNC0uNC00LjEtMi4yLTcuNi00LjMtOC40LTEzLjktMTEuMy0yLjItLjctNi4yLS43LTIuNiAwLTQuNi4zLTIuMi4zLTQuNCAxLjMtMy42IDEuNi02LjYgNC4zLTEuOSAxLjctMi41IDMuNC0uOCAyLjQuNiA0LjUgMS4yIDEuOSAzLjQgMi41IDIuMy42IDQuNS0uNy4zLS4yIDEuNi0xLjUgMS0xIDIuNC0xLjcgMy0xLjYgNS45LTEuNSA0LjEgMCA2LjkgMi4zIDIuOCAyLjIgMy44IDUuNy44IDIuOS4xIDYtLjQgMS41LTEuMiAyLjktLjggMS40LTIgMi41UTY3LjIgMzkgNTkgNDcuMnEtMy4zIDMuNC03LjIgNC44LTEuNC41LTMuMy42LTIuMSAwLTMuMi0uMS0xLjYtLjMtNC0xLjZ6bS0yLjYgMjMuMlEzNiA3MiAzMyA3My40cS0uNy4zLTIuMiAxLjgtNC4xIDMuOC05LjUgMy40LTMuMi0uMy01LjYtMi0yLjYtMS45LTMuOC01LTEuNy00LjcuMy05IC45LTEuOCAzLjctNC43IDcuNi03LjggMTUuNC0xNS4zIDIuNi0yLjUgNC40LTMuNSA1LjMtMi44IDExLjMtLjkuMi4xIDIuMSAxIDIuNiAxLjIgNS4yLS4zIDIuNC0xLjQgMi43LTQgLjItMi0uOC0zLjYtMS0xLjYtMy0yLjUtNS0yLjItOS40LTIuNS04LjUtLjgtMTQuOCA0LjQtMi43IDEuOC02LjUgNS42LTcgNy0xMy45IDEzLjktMy4xIDMuMS00LjQgNS4yUS0uMyA2Mi42IDEgNzFxLjYgNCAyLjYgNy41UTcgODQuMyAxMyA4Ny40cTMuNSAxLjggNy42IDIuMiA5LjkgMSAxNy41LTUuNiAxLjgtMS42IDIuMy0yLjIgMS0xLjQuNy0yLjktLjItMi42LTIuNC00Ljh6Ii8+PC9zdmc+
// @require       https://cdnjs.cloudflare.com/ajax/libs/quicklink/2.3.0/quicklink.umd.js
// @run-at        document-start
// @allFrames
// @inject-into   content
// @grant         GM.getValue
// @grant         GM.setValue
// @grant         unsafeWindow
// @license       MIT

// @description:zh-TW 這個 userscript 通過使用 QuickLink 在後台預先加載鏈接來增強網站性能。
// @description:zh-CN 这个 userscript 通过使用 QuickLink 在后台预先加载链接来增强网站性能。
// @description:ja この userscript は、QuickLink を使用してバックグラウンドでリンクをプリロードすることで、ウェブサイトのパフォーマンスを向上させます。
// @description:ko 이 사용자 스크립트는 QuickLink를 사용하여 링크를 백그라운드에서 사전로드하여 웹 사이트 성능을 향상시킵니다.
// @description:ru Этот пользовательский скрипт повышает производительность веб-сайта, предварительно загружая ссылки в фоновом режиме с помощью QuickLink.
// @description:af Hierdie gebruikerskrip verbeter webwerfprestasie deur skakels in die agtergrond vooraf te laai met QuickLink.
// @description:az Bu istifadəçi skripti QuickLink vasitəsilə linkləri arxa fon prosesində yükləyərək veb sayt performansını yaxşılaşdırır.
// @description:id Userscript ini meningkatkan kinerja situs web dengan memuat pralinks di latar belakang menggunakan QuickLink.
// @description:ms Skrip pengguna ini meningkatkan prestasi laman web dengan pra-muat pautan di latar belakang menggunakan QuickLink.
// @description:bs Ovaj korisnički skript poboljšava performanse web stranice predugrađujući veze u pozadini koristeći QuickLink.
// @description:ca Aquest script d'usuari millora el rendiment del lloc web precarregant enllaços en segon pla amb QuickLink.
// @description:cs Tento uživatelský skript zvyšuje výkon webové stránky přednačítáním odkazů na pozadí pomocí QuickLink.
// @description:da Dette brugerscript forbedrer webstedsydelse ved at forudindlæse links i baggrunden ved hjælp af QuickLink.
// @description:de Dieses Benutzerskript verbessert die Leistung der Website, indem Links im Hintergrund mit QuickLink vorab geladen werden.
// @description:et See kasutajaskript parandab veebisaidi jõudlust, eelkäivitades taustal QuickLink'i abil linke.
// @description:es Este script de usuario mejora el rendimiento del sitio web al precargar enlaces en segundo plano con QuickLink.
// @description:eu Erabiltzaile-script honek webgunearen errendimendua hobetzen du QuickLink erabiliz esteken aurretik kargatuz.
// @description:fr Ce script utilisateur améliore les performances du site Web en préchargeant les liens en arrière-plan à l'aide de QuickLink.
// @description:gl Este script de usuario mellora o rendemento do sitio web preadicionando ligazóns en segundo plano con QuickLink.
// @description:hr Ovaj korisnički skript poboljšava performanse web stranice prethodnim učitavanjem veza u pozadini pomoću QuickLink-a.
// @description:zu Le script yomsebenzisi livuselela impumelelo yewebhusayithi ngokwenza ukuphawula izixhumanisi nge-QuickLink.
// @description:is Þessi notandaskrifta bætir vefsvæðisþætti með því að fyrirhlaða tengla í bakgrunninum með QuickLink.
// @description:it Questo script per utenti migliora le prestazioni del sito web pre-caricando i collegamenti in background utilizzando QuickLink.
// @description:sw Script ya mtumiaji huyu inaboresha utendaji wa wavuti kwa kusoma kabla viungo katika mandharinyuma kwa kutumia QuickLink.
// @description:lv Šis lietotāja skripts uzlabo tīmekļa vietnes veiktspēju, iepriekšielādējot saites fonā, izmantojot QuickLink.
// @description:lt Šis naudotojo scenarijus pagerina svetainės veikimą iš anksto įkeldamas nuorodas fone naudojant QuickLink.
// @description:hu Ez a felhasználói script a QuickLink segítségével előre betölti a linkeket a háttérben, ezzel javítva a webhely teljesítményét.
// @description:nl Dit gebruikerscript verbetert de prestaties van de website door links op de achtergrond te preloaden met behulp van QuickLink.
// @description:uz Bu foydalanuvchi skripti QuickLink yordamida havola qabul qilib o‘zlashtirish orqali veb-saytning ishini yanada yaxshilaydi.
// @description:pl Ten skrypt użytkownika poprawia wydajność witryny, wczytując w tle linki za pomocą QuickLink.
// @description:pt Este script de usuário melhora o desempenho do site ao pré-carregar links em segundo plano usando QuickLink.
// @description:pt-BR Este script de usuário melhora o desempenho do site ao pré-carregar links em segundo plano usando QuickLink.
// @description:ro Acest script pentru utilizator îmbunătățește performanța site-ului prin preîncărcarea linkurilor în fundal folosind QuickLink.
// @description:sq Ky skript i përdoruesit përmirëson performancën e faqes duke parapërcjellë linket në sfond duke përdorur QuickLink.
// @description:sk Tento skript používateľa zlepšuje výkon webovej stránky prednačítavaním odkazov na pozadí pomocou QuickLink.
// @description:sl Ta uporabniški skript izboljša zmogljivost spletnega mesta s predhodnim nalaganjem povezav v ozadju s pomočjo QuickLink.
// @description:sr Ovaj korisnički skript poboljšava performanse veb sajta prethodnim učitavanjem veza u pozadini pomoću QuickLink-a.
// @description:fi Tämä käyttäjäskripti parantaa verkkosivuston suorituskykyä esilataamalla linkkejä taustalla QuickLinkin avulla.
// @description:sv Detta användarskript förbättrar webbplatsens prestanda genom att förhandsladda länkar i bakgrunden med QuickLink.
// @description:vi Userscript này cải thiện hiệu suất của trang web bằng cách tiền tải các liên kết trong nền với QuickLink.
// @description:tr Bu kullanıcı komut dosyası, QuickLink kullanarak bağlantıları arka planda önceden yükleyerek web sitesinin performansını artırır.
// @description:be Гэты скрыпт карыстальніка паляпшае прадукцыйнасць вэб-сайтаў, папярэдня прадзагрузкай спасылак у фонавым рэжыме з дапамогай QuickLink.
// @description:bg Този потребителски скрипт подобрява производителността на уебсайта, като предварително зарежда връзки във фона с помощта на QuickLink.
// @description:ky Бу колдонуучунун скрипти веб-сайттын ишини QuickLink колдонууга аткараттат жолу менен багытталтырганда жакшыртат.
// @description:kk Бұл пайдаланушы сценарийі веб-сайттың орнын алып жататын сілтемелерді QuickLink арқылы ұмытады.
// @description:mk Овој кориснички скрипт го подобрува перформансата на веб-страницата со предварително вчитување на врски во позадина користејќи го QuickLink.
// @description:mn Энэ хэрэглэгчийн скрипт нь QuickLink ашиглан холбоосуудыг дээдэлдэгчдээ хүрээлдэг вэб сайтын ажиллагааг сайжруулна.
// @description:uk Цей користувацький скрипт покращує продуктивність веб-сайту шляхом попереднього завантаження посилань в фоновому режимі за допомогою QuickLink.
// @description:el Αυτό το σενάριο χρήστη βελτιώνει την απόδοση του ιστότοπου προ-φορτώνοντας συνδέσμους στο παρασκήνιο χρησιμοποιώντας το QuickLink.
// @description:hy Այս օգտագործողական սցրիպտը բարձրացնում է կայքի արագությունը, նախապատրաստելով հղումները ուղարկելուց առաջինը QuickLink-ի օգնությամբ:
// @description:ur یہ یوزر اسکرپٹ QuickLink کا استعمال کرتے ہوئے لنکس کو پس منظر میں پہلے سے بارگیری کرکے ویب سائٹ کی کارکردگی میں بہتری لاتا ہے۔
// @description:ar يحسن هذا النص البرمجي للمستخدم أداء الموقع عن طريق تحميل الروابط مسبقًا في الخلفية باستخدام QuickLink.
// @description:fa این اسکریپت کاربر عملکرد وب سایت را با پیش‌بارگیری لینک‌ها در پس‌زمینه با استفاده از QuickLink بهبود می بخشد.
// @description:ne यस प्रयोगकर्ता स्क्रिप्टले QuickLink प्रयोग गरेर लिङ्कहरूलाई पछाडि पूर्व-लोड गरेर वेबसाइटको प्रदर्शनमा सुधार गर्दछ।
// @description:mr हे वापरकर्तास्वरूपी स्क्रिप्ट QuickLink वापरून दुसर्‍या पार्श्‍वभूमीत लिंक पूर्व-लोड करून वेबसाइटचे प्रदर्शन सुधारीत करते.
// @description:hi यह उपयोगकर्ता स्क्रिप्ट QuickLink का उपयोग करके लिंकों को पूर्व-लोड करके वेबसाइट के प्रदर्शन को सुधारता है।
// @description:as এই ব্যৱহাৰকাৰী স্ক্ৰিপ্টটো QuickLink ব্যৱহাৰ কৰি লিংকসমূহ প্ৰিলোড কৰি ওয়েবছাইটৰ কার্যক্ষমতা উন্নত কৰে।
// @description:bn এই ব্যবহারকারীস্ক্রিপ্ট QuickLink ব্যবহার করে লিঙ্কগুলি পূর্বলোড করে ওয়েবসাইটের কার্যক্ষমতা উন্নত করে।
// @description:pa ਇਹ ਯੂਜ਼ਰ ਸਕ੍ਰਿਪਟ QuickLink ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਲਿੰਕਾਂ ਨੂੰ ਪੂਰਵ-ਲੋਡ ਕਰ ਕੇ ਵੈਬਸਾਈਟ ਦੀ ਪ੍ਰਦਰਸ਼ਨ ਨੂੰ ਬਹਾਲ ਕਰਦਾ ਹੈ।
// @description:gu આ વપરાશકર્તાનો સ્ક્રિપ્ટ QuickLink નો ઉપયોગ કરીને વેબસાઇટના પ્રદર્શનને આધાર બનાવીને લિંકોને પૂર્વ-લોડ કરે છે.
// @description:or ଏହି ଇଉଜର ସ୍କ୍ରିପ୍ଟ QuickLink ବ୍ୟବହାର କରି ଲିଙ୍କଗୁଡ଼ିକୁ ପୂର୍ବଲୋଡ୍‌ କରିପାରିବେ ଓଏବସାଇଟର କାର୍ଯ୍ୟକ୍ଷମତା ଉନ୍ନତ କରିପାରିବେ ।
// @description:ta இந்த பயனர் ஸ்கிரிப்ட் QuickLink ஐ பயன்படுத்தி இணைப்புகளை பின்வரும் முன்னணி நிலையில் முதன்முதலில் ஏற்றுக் கொண்டுவருகின்றன.
// @description:te ఈ వినియోగదారు స్క్రిప్ట్ QuickLink ఉపయోగించి లింక్‌లను అగ్రపూర్వంగా ప్రీలోడ్ చేయడందున వెబ్‌సైట్ ప్రదర్శనను మెరుగైనట్లు చేస్తుంది.
// @description:kn ಈ ಬಳಕೆದಾರ ಸ್ಕ್ರಿಪ್ಟ್ QuickLink ಅನ್ನು ಬಳಸಿ ಲಿಂಕ್‌ಗಳನ್ನು ಹಿಂದೆಯೇ ಲೋಡ್ ಮಾಡುವುದರಿಂದ ವೆಬ್‌ಸೈಟ್‌ನ ನಿರ್ವಹಣೆಯನ್ನು ಉನ್ನತಗೊಳಿಸುತ್ತದೆ.
// @description:ml ഈ ഉപയോക്തൃ സ്ക്രിപ്റ്റ് QuickLink ഉപയോഗിച്ച് പിന്തിരിയൽ-താൽക്കാലികമായി കണ്ണികളെ മുൻലോഡുചെയ്യുന്നതിനും വെബ്സൈറ്റിന്റെ പ്രദർശനം മേൽപ്പറയുന്നതിനും മാറ്റം തരുന്നു.
// @description:si මෙම භාවිතා කිරීමේ ස්ක්‍රිප්ට් QuickLink හි සම්බන්ධයෙන් ලියාපදිංචි වෙමු.
// @description:th สคริปต์ผู้ใช้นี้ปรับปรุงประสิทธิภาพของเว็บไซต์โดยโหลดลิงก์ล่วงหน้าในพื้นหลังด้วย QuickLink
// @description:lo ສຳ ລັບເວັບໄຊຍະບູລີກສໍາລັບການສະແດງຊອດທາງຂອງເວັບໄຊຂອງຂ້ອຍດ້ວຍການໂຫລດລິເທີກເພື່ອໃຫ້ມີ QuickLink ທາງສໍາໄປແກ້ໄຂ.
// @description:my ဒီ userscript ကို QuickLink ကနေ website ကနေတစ်ချက်ပဲအဆင်ပြေဖို့အတွက် link တွေကို preloading လုပ်နိုင်အောင်လုပ်ဆောင်ပေးသွားပါပြီ။
// @description:ka ეს userscript გაუმჯობესებს ვებსაიტის პერფორმანსს ბმულების წინადადების გამოყენებით QuickLink-ის გამოყენებით.
// @description:am ይህ የ userscript ነው የ QuickLink በተከፋፈለት የድርጅትን ውጤቶች ከፈጠራቸው አይደለም።
// @description:km កម្មវិធី userscript នេះធ្វើអោយការងារប្រសើររបស់តំបនេយ។ ដោយការបិទលើតំបនេយនៅលើប្រព័ន្ធឯ

// @downloadURL https://update.greasyfork.org/scripts/466745/QuickLink%3A%20Website%20Boost.user.js
// @updateURL https://update.greasyfork.org/scripts/466745/QuickLink%3A%20Website%20Boost.meta.js
// ==/UserScript==

/* global GM, quicklink */ // eslint-disable-line no-unused-vars, no-redeclare


(function tM317() {
    'use strict';
    let scriptStack = /tM317[^a-zA-Z]+([^\s\(\)\r\n\:]+\:\/\/[^\s\(\)\r\n\:]+)/.exec(new Error().stack + "");
    if (!scriptStack) return;
    scriptStack = scriptStack[1];

    let ignoreScript = /\b(token|login|submit|form|logout|signup|sign_in|sign_out|register|cookie|cache|callback|jsonp|api|log|ads|cb)\b/i;
    if (ignoreScript.test(location.href)) return;


    // Your code here...
    if (typeof ((unsafeWindow || 0).quicklink || 0).listen === 'function') return;
    if (typeof GM === 'undefined') return;
    window.requestIdleCallback = unsafeWindow.requestIdleCallback;
    window.fetch = unsafeWindow.fetch;
    window.IntersectionObserver = unsafeWindow.IntersectionObserver;

    /*
        const fns = [];
        let promisesReadyTrue = () => { return true; };
        let promisesReadyFalse = () => { return false; };
        let promisesReady = promisesReadyTrue;
    
        const mapFn = f => new Promise(r => {
            try {
                f();
            } catch (e) { console.warn(e) }
            r(1);
        }).catch(console.warn);
    
        setInterval(() => {
            if (!promisesReady()) return;
            if (fns.length >= 1 && document.visibilityState === 'visible') {
                let promises = fns.map(mapFn);
                fns.length = 0;
                promisesReady = promisesReadyFalse;
                Promise.all(promises).then(() => {
                    promisesReady = promisesReadyTrue;
                })
            }
        }, 800);
    
        const timeoutFn = (fn, opts) => {
            fns.push(fn);
        };
    */
    let quicklinks339 = [];
    unsafeWindow.quicklinks339 = quicklinks339;
    const hrefFn = (target) => {

        if (ignoreScript.test(location.href)) return '';
        let href = target.href;
        if (quicklinks339.indexOf(href) >= 0) return '';
        // console.log('QuickLink: pre-fetch', target.href)
        quicklinks339.push(href);
        return href;
    }

    document.createElement = ((createElement) => {

        return function (tag) {
            let ret = createElement.apply(this, arguments);
            if (tag === 'link') {
                let stack = new Error().stack + "";
                let firstLine = stack.substring(0, stack.indexOf('\n', 7) + 1);
                // console.log(firstLine,firstLine.includes(scriptStack))
                if (firstLine.includes(scriptStack)) {
                    ret.setAttribute('crossorigin', 'anonymous');
                    /*
                    ret.setAttribute('as', 'fetch');
                    ret.setAttribute('fetchpriority', 'low');
                    ret.setAttribute('referrerpolicy', 'no-referrer');*/
                }
            }

            // console.log(ret);
            return ret;
        }

    })(document.createElement)


    let hostname = location.hostname;
    let origins = [hostname];

    if (/^[\w\-]+\.[\w\-]+\.[\w\-]+$/.test(hostname)) {
        let h = hostname.replace(/[\w\-]+\./, '');
        if (h !== hostname) {
            origins.push(h, 'www.' + h, 'cdn.' + h, 'cdnjs.' + h, 'static.' + h);
        }
    } else if (/^[\w\-]+\.[\w\-]+$/.test(hostname)) {
        let h = hostname;
        origins.push('www.' + h, 'cdn.' + h, 'cdnjs.' + h, 'static.' + h);

    }



    let inited = 0;


    function onReady() {

        requestAnimationFrame(() => {

            if (inited) return;
            inited = 1;

            setTimeout(() => {

                if (inited !== 1) return;
                inited = 2;

                quicklink.listen({

                    origins,
                    limit: 80,
                    throttle: 3,
                    // threshold: 0.25,
                    // timeout: 800,
                    priority: false,
                    // timeoutFn,
                    hrefFn,
                    ignores: [
                        /^(http|ftp|files|file|edge|chrome|firefox|javascript|vbscript|vb|ssl|shttp)\:/i,
                        ignoreScript,
                        /\.(zip|7z|rar|ini|txt|log|tmp|mov|mp4|mp3|webm|webp|svg|png|jpg|jpeg|gif|user\.css|user\.js|js|xhtml|xml|css|scss|json)\b[^/]*$/i,
                        (uri, elem) => elem.hasAttribute('noprefetch'),
                        /#[^\/\=\.]*$/,
                    ],
                });

            }, 800);

        });

    }
    
    if (document.readyState !== 'loading') {
        onReady();
    } else {
        document.addEventListener('DOMContentLoaded', onReady, false);
    }

    function cancelPrefetchEventHandler(evt) {
        if (evt && evt.isTrusted === true) inited = -1;
    }

    function addToWinEvents(win) {
        win.addEventListener('hashchange', cancelPrefetchEventHandler, false);
        win.addEventListener('beforeunload', cancelPrefetchEventHandler, false);
        win.addEventListener('unload', cancelPrefetchEventHandler, false);
        win.addEventListener('popstate', cancelPrefetchEventHandler, false);
    }

    addToWinEvents(unsafeWindow);
    if (unsafeWindow !== unsafeWindow.top) {
        try {
            addToWinEvents(unsafeWindow.top);
        } catch (e) { }
    }


})();