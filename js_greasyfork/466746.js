// ==UserScript==

// @name         No-Cache UserScript Link Loader
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Forces the loading of UserScript links without caching to ensure the latest version is always fetched.
// @author       CY Fung
// @match        https://greasyfork.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @run-at       document-start
// @unwrap
// @allFrames
// @inject-into  page
// @license      MIT

// @description:zh-TW 強制載入 UserScript 連結而不進行快取，以確保總是取得最新版本。
// @description:zh-CN 强制加载 UserScript 链接而不进行缓存，以确保总是获取最新版本。
// @description:ja UserScript リンクのキャッシュなし読み込みを強制し、常に最新バージョンを取得します。
// @description:ko UserScript 링크를 캐시하지 않고 로드하여 항상 최신 버전을 가져옵니다.
// @description:ru Принудительная загрузка ссылок на UserScript без кэширования для обеспечения загрузки последней версии.
// @description:af Dwangmatige laai van UserScript-skakels sonder tussentydse opberging om altyd die nuutste weergawe te haal.
// @description:az Həmişə ən son versiyasını əldə etmək üçün ÖnTəlimləndirməsiz UserScript keçidlərinin yüklənməsini məcbur edir.
// @description:id Memaksa pemuatan tautan UserScript tanpa cache untuk memastikan versi terbaru selalu diambil.
// @description:ms Memaksa pemuatan pautan UserScript tanpa cacah untuk memastikan versi terkini sentiasa diambil.
// @description:bs Prisilno učitavanje UserScript veza bez keširanja kako bi se osigurala uvijek najnovija verzija.
// @description:ca Força la càrrega dels enllaços de UserScript sense emmagatzematge en memòria cau per assegurar-se que sempre es recuperi la versió més recent.
// @description:cs Vynutí načítání odkazů UserScriptu bez mezipaměti, aby se vždy získala nejnovější verze.
// @description:da Tvinger indlæsning af UserScript-links uden cache for at sikre, at den nyeste version altid hentes.
// @description:de Erzwingt das Laden von UserScript-Links ohne Zwischenspeicherung, um immer die neueste Version zu laden.
// @description:et Sunnib UserScripti linkide laadimist ilma vahemällu salvestamiseta, et tagada alati viimase versiooni hankimine.
// @description:es Forza la carga de enlaces de UserScript sin caché para asegurarse de obtener siempre la última versión.
// @description:eu UserScript estekak katxea gabe gertatzen duen kargatzea bultzatzen du, beti azken bertsioa eskuratzeko.
// @description:fr Force le chargement des liens UserScript sans mise en cache pour garantir que la dernière version soit toujours récupérée.
// @description:gl Forza a carga de ligazóns de UserScript sen caché para asegurarse de obter sempre a última versión.
// @description:hr Sili učitavanje UserScript veza bez predmemoriranja kako bi se uvijek dohvatila najnovija verzija.
// @description:zu Khulumisela izilungiselelo zezixhobo zomsebenzisi we-UserScript ngaphakathi kwe-cache ukuze kwenziwe sikugcwele lokuqalisa kudala.
// @description:is Krefst að hlaða UserScript tenglum án skyndiminnisgagnanna til að tryggja að alltaf sé sótt nýjusta útgáfa.
// @description:it Forza il caricamento dei collegamenti UserScript senza memorizzazione nella cache per garantire il recupero della versione più recente.
// @description:sw Kulazimisha upakiaji wa viungo vya UserScript bila usajiri ili kuhakikisha toleo la karibuni linapokewa daima.
// @description:lv Piespiež UserScript saites ielādi bez kešatmiņas, lai nodrošinātu vienmēr jaunāko versiju.
// @description:lt Priversti įkelti UserScript nuorodas be talpyklos, kad visada būtų gaunama naujausia versija.
// @description:hu Az UserScript linkek gyorsítótárazás nélküli betöltésének kényszerítése a legfrissebb verzió mindig eléréséhez.
// @description:nl Forceert het laden van UserScript-links zonder cache, zodat altijd de nieuwste versie wordt opgehaald.
// @description:uz UserScript havolasini kesirliklarda olmadan yuklash uchun, doimiy yangi versiyani olishni ta'minlash.
// @description:pl Wymusza ładowanie linków UserScript bez buforowania, aby zawsze pobierać najnowszą wersję.
// @description:pt Força o carregamento de links de UserScript sem cache para garantir que a versão mais recente seja sempre obtida.
// @description:pt-BR Força o carregamento de links de UserScript sem cache para garantir que a versão mais recente seja sempre obtida.
// @description:ro Forțează încărcarea legăturilor UserScript fără memorare cache pentru a asigura preluarea întotdeauna a celei mai recente versiuni.
// @description:sq Forcon ngarkimin e lidhjeve UserScript pa kešim, për të siguruar që gjithmonë merrni versionin më të ri.
// @description:sk Vynúti načítavanie odkazov UserScriptu bez vyrovnávacej pamäte, aby sa vždy získala najnovšia verzia.
// @description:sl Vsili nalaganje povezav UserScript brez predpomnjenja, da se vedno pridobi najnovejša različica.
// @description:sr Prisilno učitavanje UserScript veza bez keširanja kako bi se osigurala uvek najnovija verzija.
// @description:fi Pakottaa UserScript-linkkien lataamisen ilman välimuistia varmistaen, että aina haetaan uusin versio.
// @description:sv Tvingar laddning av UserScript-länkar utan cache för att säkerställa att den senaste versionen alltid hämtas.
// @description:vi Ép buộc tải các liên kết UserScript mà không lưu vào bộ nhớ cache để đảm bảo luôn lấy phiên bản mới nhất.
// @description:tr Her zaman en son sürümün alınmasını sağlamak için UserScript bağlantılarının önbelleğe alınmadan yüklenmesini zorlar.
// @description:be Прынудзіць загрузку спасылак на UserScript без кэшавання для забеспячэння загрузкі апошняй версіі.
// @description:bg Задължително зареждане на връзки на UserScript без кеширане, за да се гарантира винаги да се извлича най-новата версия.
// @description:ky UserScript байланыштыктарды кешке алып жоккоо үчүн жүктөлүүнү қолдонуу, акыркы нүсүни алуу үчүн мажбүрдөлөйт.
// @description:kk UserScript дәрежесін кешизсіз жүктеу үшін UserScript байланыстарын жүктеп алу.
// @description:mk Ги принудува врските на UserScript да се вчитуваат без кеш за да се обезбеди секогаш новата верзија.
// @description:mn UserScript холбоосыг кэштэй холбоо болгохгүйгээр ачаалахыг шаарддаг бөгөөд хамгийн сүүлийн хувилбарыг татаж авахыг батална.
// @description:uk Примусове завантаження посилань UserScript без кешування для забезпечення завжди останньої версії.
// @description:el Εξαναγκάζει τη φόρτωση συνδέσμων UserScript χωρίς την κρυφή μνήμη cache για να διασφαλίσει ότι ανακτάται πάντα η πιο πρόσφατη έκδοση.
// @description:hy Պարտադիրություն է UserScript հղումների բեռնումը մեկնարկել միայնակ քեշավորման առանց, որպեսզի միշտ ստանալու վերջին տարբերակը:
// @description:ur ہمیشہ تازہ ترین ورژن کو حاصل کرنے کے لئے کیش کے بغیر یوزر اسکرپٹ لنکس کو لوڈ کرنے کو مجبور کرتا ہے۔
// @description:ar يجبر على تحميل روابط UserScript بدون تخزين مؤقت لضمان الحصول دائمًا على أحدث إصدار.
// @description:fa برای اطمینان از دریافت همیشه آخرین نسخه، بارگیری پیوندهای UserScript بدون حافظه نهان اجباری می‌کند.
// @description:ne सधैं नवीनतम संस्करण प्राप्त गर्नका लागि UserScript लिङ्कहरूलाई क्यास छोडेर लोड गर्ने जबरजस्ती गर्दछ।
// @description:mr हरची आवृत्ती सापडण्यासाठी UserScript दुवा दुवा लोड करण्याचे जरूर करतो.
// @description:hi हमेशा सबसे नवीन संस्करण को हासिल करने के लिए UserScript लिंकों को कैशिंग के बिना लोड करने को मजबूर करता है।
// @description:as সদায় সর্বশেষ সংস্করণটো সংগ্রহ করা নিশ্চিত কৰিবলৈ কেশ নহয়কে UserScript লিংক ল’ড কৰিব বাধ্যতামূলক।
// @description:bn সর্বদা সর্বশেষ সংস্করণ পেতে UserScript লিংকগুলির ক্যাশ ছাড়াই লোড করা বাধ্যবাধক।
// @description:pa ਹਮੇਸ਼ਾ ਤਾਜ਼ਾ ਵਰਜਨ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ UserScript ਲਿੰਕਾਂ ਨੂੰ ਕੈਸ਼ ਛੱਡ ਕੇ ਲੋਡ ਕਰਵਾਉਂਦਾ ਹੈ।
// @description:gu સદાકાલ UserScript લિંક લોડ કરવા માટે કેશની આવશ્યકતા ન હોય તેવી આપવાનું કરે છે અને હંમેશા તાજેતરનું સંસ્કરણ લાવવું ખુબ આવશ્યક છે.
// @description:or ସଦାଶିର ପାଇଁ UserScript ଲିଙ୍କଗୁଡିକ କ୍ୟାଶିଂ ସହିତ ଲୋଡ୍ କରିବାକୁ ବାଧ୍ୟତା ଦେଇଥାଏ।
// @description:ta எப்போதும் சமீபத்திய பதிப்பை பெறுவதை உறுதிப்படுத்த, UserScript இணைப்புகளை கேசின் இல்லாமல் ஏற்றுமதி செய்வதை கட்டுப்படுத்துகிறது.
// @description:te ఎలాంటి క్యాష్ లేకుండా UserScript లింక్‌లను లోడ్ చేయడానికి బాధ్యత ప్రదానిస్తుంది ఎందుకంటే ఎప్పటికీ తాజా వెర్షన్‌ను పొందటానికి.
// @description:kn ಯಾವಾಗಲೂ ಇತ್ತಿಚೆಗೆಯ ಆವೃತ್ತಿಯನ್ನು ಪಡೆಯಲು UserScript ಲಿಂಕುಗಳನ್ನು ಕ್ಯಾಷ್ ಮಾಡದೆ ಲೋಡ್ ಮಾಡುವಂತೆ ಬಲಿಯಿಸುತ್ತದೆ.
// @description:ml പാലിക്കുന്നതിനായി UserScript കണ്ണികള്‍ കാഷേ ചെയ്തിട്ടതില്‍ നിന്നും ലോഡ് ചെയ്യുവാന്‍ പിരിയാനുകളോക്കുന്നു.
// @description:si UserScript සබැදිවා අවහිර සංස්කරණය කිරීමට UserScript සබැදියෙන් සබැඳි සංඛ්‍යාන බහුමාන්‍යය හාසිදු ඇති නවත්වන අතර, UserScript ලින්ක් බැලීමට වග වනු ඇත.
// @description:th บังคับการโหลดลิงก์ UserScript โดยไม่ใช้แคชเพื่อให้มั่นใจว่าจะดึงเวอร์ชันล่าสุดเสมอ
// @description:lo ປອດໄພ UserScript ລິ້ງຄ້າງໄກສອນໂດຍບໍ່ໃຊ້ການເປີດໃຊ້ໄອດີໄວ້ເພື່ອການໂຫຼດຮູບແບບໃໝ່ອີກມາສູ່.
// @description:my UserScript လင့်ခ်ကို cache များနှင့်အသုံးပြုသူမှာ သင်ပြန်လည်စစ်ဆေးရန် အသုံးပြုပုံသုံးမှုကို ခွင့်ပြုပါသည်။
// @description:ka UserScript ბმულების ჩატვირთვას კეშირების გარეშე საჭირო გახდება, რომ ყოველთვის მიიღოს უახლესი ვერსია.
// @description:am UserScript ሊውክን አድርጓል፣ ለመቀየር ባለፈውንም በካርታ መላክ የተሰራም ቀለም መግዛት ይችላል።
// @description:km UserScript ប្រតិបត្តិការទាញយកតំណល់ការបង្ហាញទាក់ទងនឹងការទាញយកទំហំបច្ចុប្បន្នដោយគ្មានការគ្រប់គ្រងបណ្តុំដើម្បីធ្វើការទាញយកថាមពលក្នុងប្រតិបត្តិការ។

// @downloadURL https://update.greasyfork.org/scripts/466746/No-Cache%20UserScript%20Link%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/466746/No-Cache%20UserScript%20Link%20Loader.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /*
    let f0 = null;

    f0 = () => {
        if (!cid) return;
        if (!document || !document.head) return;
        let meta = document.createElement('meta');
        meta.setAttribute('http-equiv', 'expires');
        meta.setAttribute('content', '0');
        document.head.appendChild(meta);
        clearInterval(cid);
        f0 = null;
    }
    let cid = setInterval(f0, 1);


    const rand4 = () => Math.floor(Math.random() * 8888 + 1000);
    const generateLink = async (href) => {
        let link = document.createElement("link");
        link.rel = "prefetch";
        link.setAttribute('crossorigin', "anonymous");
        link.setAttribute('as', "script");
        link.setAttribute('fetchpriority', 'high');
        link.href = href;
        document.head.appendChild(link);
    }
    const f = () => {
        let p = document.querySelectorAll('a[href*="scripts/"][href$=".user.js"]:not([no-cache-95])');
        for (const s of p) {
            s.setAttribute('no-cache-95', '');
            f0 ? f0() : null;
            let suffix = '?' + rand4() + '#' + rand4();
            let href1 = s.href + suffix;
            let href2 = s.getAttribute('href') + suffix;
            generateLink(href1);
            href1 === href2 || generateLink(href2);
        }
        if (document.readyState === 'complete') return;
        requestAnimationFrame(f);
    };
    requestAnimationFrame(f);


   */

    const rand6 = () => {

        let r = new Array(6).fill(0).map(() => {

            let k = Math.floor(Math.random() * 26);
            return 97 + k;
        });
        return String.fromCharCode(...r)

    }

    function onReady() {
        let p = document.querySelectorAll('a[href*="scripts/"][href$=".user.js"]:not([no-cache-95])');
        for (const s of p) {
            s.setAttribute('no-cache-95', '');
            let href = s.getAttribute('href');
            let newHref = href.replace(/scripts\/(\d+)-([^\/]+)\/code\/(\S+)\.user\.js$/, (_, id, name, k) => {
                let m = rand6();
                return `scripts/${id}-${m}/code/${k}.user.js`;
            });
            if (newHref !== href) s.setAttribute('href', newHref);
        }
    }
    if (document.readyState !== 'loading') {
        onReady();
    } else {
        document.addEventListener('DOMContentLoaded', onReady, false);
    }



    // Your code here...
})();