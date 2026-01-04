// ==UserScript==
// @name         XKCD Hover Text Displayer
// @namespace    http://tampermonkey.net/
// @version      2025-06-20
// @description  Display the title (tooltip) of xkcd comic below the comic image
// @author       vih-emp
// @match        https://xkcd.com/*
// @icon         https://xkcd.com/s/0b7742.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540181/XKCD%20Hover%20Text%20Displayer.user.js
// @updateURL https://update.greasyfork.org/scripts/540181/XKCD%20Hover%20Text%20Displayer.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 vih-emp

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*
 * Welcome to XKCD Hover Text Displayer!
 * ──────────────────────────────────────────────────────────────────────────────
 * English: Welcome! This displays the hover text from XKCD comics.
 * Español: ¡Bienvenido! Esto muestra el texto flotante de los cómics XKCD.
 * Français : Bienvenue ! Ceci affiche le texte survolé des bandes dessinées XKCD.
 * Deutsch: Willkommen! Hier wird der Hover-Text von XKCD-Comics angezeigt.
 * 中文（简体）: 欢迎！这里显示 XKCD 漫画的悬浮文本。
 * العربية: مرحبًا! يعرض هذا نص التلميح من قصص XKCD المصورة.
 * हिंदी: स्वागत है! यह XKCD कॉमिक्स का होवर टेक्स्ट दिखाता है।
 * русский: Добро пожаловать! Здесь отображается всплывающий текст комиксов XKCD.
 * 日本語: ようこそ！これはXKCDのホバーテキストを表示します。
 * Português: Bem-vindo! Isso exibe o texto flutuante das tirinhas XKCD.
 * 한국어: 환영합니다! 이곳은 XKCD 만화의 호버 텍스트를 보여줍니다.
 * Türkçe: Hoş geldiniz! Bu, XKCD çizgi romanlarının üzerine gelince çıkan metni gösterir.
 * Italiano: Benvenuto! Questo mostra il testo al passaggio del mouse dei fumetti XKCD.
 * Nederlands: Welkom! Dit toont de hovertekst van XKCD-strips.
 * Polski: Witamy! Tutaj wyświetlany jest tekst z dymków komiksów XKCD.
 * Bahasa Indonesia: Selamat datang! Ini menampilkan teks hover dari komik XKCD.
 * ภาษาไทย: ยินดีต้อนรับ! นี่แสดงข้อความโฮเวอร์จากการ์ตูน XKCD
 * Ελληνικά: Καλώς ήρθατε! Αυτό εμφανίζει το κείμενο αιώρησης των κόμικ XKCD.
 * עברית: ברוך הבא! כאן מוצג טקסט הריחוף מקומיקס XKCD.
 * Svenska: Välkommen! Detta visar hovringstexten från XKCD-serier.
 * Magyar: Üdvözlünk! Itt jelenik meg az XKCD képregények lebegő szövege.
 * Tiếng Việt: Chào mừng! Đây hiển thị văn bản nổi của truyện tranh XKCD.
 * Čeština: Vítejte! Toto zobrazuje hover text komiksů XKCD.
 * Suomi: Tervetuloa! Tämä näyttää XKCD-sarjakuvien hover-tekstin.
 * Română: Bun venit! Acesta afișează textul la hover din benzile desenate XKCD.
 * Dansk: Velkommen! Dette viser hover-teksten fra XKCD-tegneserier.
 * Norsk: Velkommen! Dette viser hover-teksten fra XKCD-tegneserier.
 * Українська: Ласкаво просимо! Тут відображається підказка з коміксів XKCD.
 * Filipino: Maligayang pagdating! Ipinapakita nito ang hover text mula sa XKCD comics.
 * ქართული: კეთილი იყოს თქვენი მობრძანება! აქ ნაჩვენებია XKCD კომიქსის ჰოვერ ტექსტი.
 * Hrvatski: Dobrodošli! Ovo prikazuje hover tekst iz XKCD stripova.
 * Srpski: Dobrodošli! Ovde se prikazuje hover текст iz XKCD stripova.
 * Slovenčina: Vitajte! Toto zobrazuje hover text komiksov XKCD.
 * Български: Добре дошли! Това показва hover текста на XKCD комиксите.
 * Lietuvių: Sveiki! Čia rodomas XKCD komiksų užvedimo tekstas.
 * Latviešu: Laipni lūdzam! Šeit tiek rādīts XKCD komiksu hover teksts.
 * Eesti: Tere tulemast! Siin kuvatakse XKCD koomiksite hover-tekst.
 * Melayu: Selamat datang! Ini memaparkan teks hover dari komik XKCD.
 * فارسی: خوش آمدید! این متن هاور کمیک‌های XKCD را نمایش می‌دهد.
 * Kiswahili: Karibu! Hii inaonyesha maandishi ya hover kutoka vibonzo vya XKCD.
 * Afrikaans: Welkom! Hierdie wys die hover-teks van XKCD strokiesprente.
 * Shqip: Mirë se vini! Këtu shfaqet teksti hover i komikëve XKCD.
 * Català: Benvingut! Això mostra el text flotant dels còmics XKCD.
 * Galego: Benvido! Isto mostra o texto flotante das cómics XKCD.
 * Basa Jawa: Sugeng Rawuh! Iki nampilake teks hover saka komik XKCD.
 * Tagalog: Maligayang pagdating! Ipinapakita nito ang hover text mula sa XKCD comics.
 * Malagasy: Tongasoa! Ity dia mampiseho ny lahatsoratra hover an'ny XKCD comics.
 * বাংলা: স্বাগতম! এখানে XKCD কমিক্সের হোভার টেক্সট প্রদর্শিত হয়।
 * ગુજરાતી: સ્વાગત છે! અહીં XKCD કોમિક્સનો હોવર ટેક્સ્ટ દર્શાવવામાં આવે છે.
 * ਪੰਜਾਬੀ: ਜੀ ਆਇਆਂ ਨੂੰ! ਇੱਥੇ XKCD ਕਾਮਿਕਸ ਦਾ ਹੋਵਰ ਟੈਕਸਟ ਦਿਖਾਇਆ ਜਾਂਦਾ ਹੈ।
 * தமிழ்: வரவேற்கின்றேன்! இது XKCD காமிக்ஸின் ஹோவர் உரையை காட்டுகிறது.
 * తెలుగు: స్వాగతం! ఇది XKCD కామిక్స్ యొక్క హోవర్ టెక్స్ట్ చూపిస్తుంది.
 * ಕನ್ನಡ: ಸ್ವಾಗತ! ಇಲ್ಲಿ XKCD ಕಾಮಿಕ್ಸ್‌ನ ಹೋವರ್ ಪಠ್ಯವನ್ನು ತೋರಿಸಲಾಗುತ್ತದೆ.
 * Sinhala: සාදරයෙන් පිළිගනිමු! මෙය XKCD කාටූන් වල හෝවර් පෙළ පෙන්වයි.
 * اردو: خوش آمدید! یہ XKCD کامکس کا ہوور ٹیکسٹ دکھاتا ہے۔
 * नेपाली: स्वागत छ! यहाँ XKCD कमिक्सको होभर पाठ देखिन्छ।
 * Khmer: សូមស្វាគមន៍! នេះបង្ហាញអត្ថបទ hover ពីកំប្លែង XKCD។
 * Lao: ຍິນດີຕ້ອນຮັບ! ນີ້ສະແດງຂໍ້ຄວາມ hover ຈາກ XKCD comics.
 * Myanmar (Burmese): ကြိုဆိုပါတယ်! ဒီမှာ XKCD ကာတွန်းတွေရဲ့ hover စာသားကို ပြသထားပါတယ်။
 * Mongolian: Тавтай морил! Энэ нь XKCD комиксын hover бичвэрийг харуулдаг.
 * Tibetan: དགའ་བསུ་ཞུ། འདི་ནི XKCD རིས་དཀར་གྱི་འཕྲོ་ཡིག་སྟོན་རོགས་གནང་།
 * Uzbek: Xush kelibsiz! Bu yerda XKCD komikslari uchun hover matni ko'rsatiladi.
 * Kazakh: Қош келдіңіз! Мұнда XKCD комикстерінің қалқымалы мәтіні көрсетіледі.
 * Kyrgyz: Кош келиңиз! Бул жерде XKCD комикстеринин ховер тексти көрсөтүлөт.
 * Tajik: Хуш омадед! Ин ҷо матни hover-и XKCD comics нишон дода мешавад.
 * Turkmen: Hoş geldiňiz! Bu ýerde XKCD komikleriniň hover ýazгysy görkezilýär.
 * Pashto: خوش آمدید! دلته د XKCD کامیونیکونو هوور متن ښودل کېږي.
 * Somali: Soo dhowow! Tani waxay muujineysaa qoraalka hover ee XKCD.
 * Oromo: Baga nagaan dhuftan! Kun XKCD komiksii irratti barruu hove agarsiisa.
 * Yoruba: Kaabo! Eyi nfi ọrọ hover lati XKCD comics han.
 * Igbo: Nnọọ! Nke a na-egosi ederede hover sitere na XKCD comics.
 * Hausa: Barka da zuwa! Wannan yana nuna rubutun hover daga XKCD comics.
 * Zulu: Siyakwamukela! Lokhu kubonisa umbhalo we-hover ovela kuma-XKCD comics.
 * Xhosa: Wamkelekile! Oku kubonisa umbhalo we-hover ovela kuma-XKCD comics.
 * Sesotho: Rea u amohela! Sena se bontša mongolo o phaphametseng oa XKCD comics.
 * Tswana: Re a go amogela! Se se bontsha mafoko a hover a XKCD comics.
 * Malagasy: Tongasoa! Ity dia mampiseho ny lahatsoratra hover an'ny XKCD comics.
 * Maori: Nau mai! E whakaatu ana tēnei i te tuhinga taupānga o XKCD comics.
 * Samoan: Afio mai! O lo’o fa’aalia iinei le tusitusiga hover mai XKCD comics.
 * Tongan: Malo e lelei! ‘Oku fakahā ai ‘a e hover text mei he XKCD comics.
 * Fijian: Ni bulabula vinaka! E vakaraitaka eke na hover text mai na XKCD comics.
 * Tahitian: Maeva! Te fa’ahiti nei i teie parau hover no te XKCD comics.
 * Hawaiian: Welina! Hōʻike kēia i ka huaʻōlelo lele o nā XKCD comics.
 * Greenlandic: Tikilluarit! Uani XKCD comics-imit hover teksti takuneqarsinnaavoq.
 * Inuktitut: ᑐᙵᓱᒃᑐᖅ! ᐅᖃᓪᓗᒋᑦ XKCD ᑕᑯᒃᑯᑦ hover ᐊᖏᕐᕋᓛᖅ ᐱᔪᖅᑕᐅᖅ.
 * Sámi: Buorisboahtin! Dát čájeha XKCD komikasa hover-teavstta.
 * Luxembourgish: Wëllkomm! Hei gëtt den Hover-Text vu XKCD-Comics ugewisen.
 * Scots Gaelic: Fàilte! Tha seo a’ sealltainn teacsa hover bho XKCD comics.
 * Irish: Fáilte! Taispeánann sé seo téacs an hover ó XKCD comics.
 * Welsh: Croeso! Mae hwn yn dangos testun hofran o gomics XKCD.
 * Breton: Degemer mat! Diskouez a ra an destenn hover eus XKCD comics.
 * Cornish: Dynnargh! Yma hemma ow kul skians an hover text dhyworth XKCD comics.
 * Manx: Failt! T’eh shoh taishbyney yn hover text veih XKCD comics.
 * Frisian: Wolkom! Dit toant de hovertekst fan XKCD-strips.
 * Interlingua: Benvenite! Isto monstra le texto de hover del comics XKCD.
 * Esperanto: Bonvenon! Ĉi tio montras la flosantan tekston de XKCD komiksoj.
 * Ido: Bonveno! To montras la hover-teksto de XKCD komikoj.
 * Volapük: Löfik! At pökön XKCD komikös hover-text.
 * Latin: Ave! Hic ostenditur textus supervolitans e XKCD comicis.
 * Klingon: yI'el! XKCD ngebwI' vIghro' Hover De' 'oH.
 * Lojban: coi rodo! ti se benji le hover se bacru be XKCD cukta se skicu.
 * Toki Pona: o kama pona! ni li toki pi toki lili tan XKCD.
 * Emoji: 👋😊🎉 This shows XKCD hover text! 🎈🖱️💬
 * ──────────────────────────────────────────────────────────────────────────────
 */

(function(){
    'use strict';

    window.addEventListener("load", function() {
        // The title is a property of the <img> inside #comic
        const img = document.querySelector("#comic img[title]");
        if (img) {
            const title = img.getAttribute('title');
            if (title) {
                let p = document.createElement("p");
                p.innerText = title;
                p.style.marginTop = "10px";
                p.style.fontStyle = "italic";
                p.style.background = "#eee";
                p.style.padding = "6px";
                p.style.borderRadius = "4px";
                // Insert after the comic image
                img.parentElement.appendChild(p);
            }
        }
    }, false);
})();