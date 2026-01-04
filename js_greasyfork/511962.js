// ==UserScript==
// @name         YouTube 會員徽章及自訂表情符號圖標下載器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  下載最佳畫質的YouTube在留言和聊天室中，顯示頻道的會員徽章及自訂表情符號。
// @author       ChatGPT, kkom kbro
// @license      MIT
// @match        https://youtube.com/*
// @match        https://www.youtube.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.0.2/jszip-utils.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511962/YouTube%20%E6%9C%83%E5%93%A1%E5%BE%BD%E7%AB%A0%E5%8F%8A%E8%87%AA%E8%A8%82%E8%A1%A8%E6%83%85%E7%AC%A6%E8%99%9F%E5%9C%96%E6%A8%99%E4%B8%8B%E8%BC%89%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/511962/YouTube%20%E6%9C%83%E5%93%A1%E5%BE%BD%E7%AB%A0%E5%8F%8A%E8%87%AA%E8%A8%82%E8%A1%A8%E6%83%85%E7%AC%A6%E8%99%9F%E5%9C%96%E6%A8%99%E4%B8%8B%E8%BC%89%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", main, false);

    const replacementNames = [
        "新規メンバー",
        "１か月",
        "２か月",
        "６か月",
        "１年",
        "２年",
        "３年",
        "４年",
        "５年"
    ];

    const labels = {
    "af-ZA": {
        prefix: "Voorvoegsel",
        suffix: "Achtervoegsel",
        capitalize: "Kapitaliseer die eerste letter as dit met 'n letter begin",
        download: "Ikone aflaai!"
    },
    "az-Latn-AZ": {
        prefix: "Ön əlavə",
        suffix: "Arxa əlavə",
        capitalize: "Əgər hərf ilə başlayırsa, ilk hərfi böyük edin",
        download: "İkonu yükləyin!"
    },
    "id-ID": {
        prefix: "Awalan",
        suffix: "Akhiran",
        capitalize: "Jika dimulai dengan huruf, kapitalisasi huruf pertama",
        download: "Unduh ikon!"
    },
    "ms-MY": {
        prefix: "Awalan",
        suffix: "Akhiran",
        capitalize: "Jika bermula dengan huruf, besar huruf pertama",
        download: "Muat turun ikon!"
    },
    "bs-Latn-BA": {
        prefix: "Prefiks",
        suffix: "Sufiks",
        capitalize: "Ako počinje sa slovom, kapitalizuj prvo slovo",
        download: "Preuzmi ikonu!"
    },
    "ca-ES": {
        prefix: "Prefix",
        suffix: "Sufix",
        capitalize: "Si comença per una lletra, posa en majúscula la primera lletra",
        download: "Descarrega la icona!"
    },
    "cs-CZ": {
        prefix: "Předpona",
        suffix: "Přípona",
        capitalize: "Pokud začíná písmenem, velké první písmeno",
        download: "Stáhnout ikonu!"
    },
    "da-DK": {
        prefix: "Præfiks",
        suffix: "Suffiks",
        capitalize: "Hvis det starter med et bogstav, skal det første bogstav skrives med stort",
        download: "Hent ikon!"
    },
    "de-DE": {
        prefix: "Präfix",
        suffix: "Suffix",
        capitalize: "Wenn es mit einem Buchstaben beginnt, den ersten Buchstaben großschreiben",
        download: "Symbol herunterladen!"
    },
    "et-EE": {
        prefix: "Eesliide",
        suffix: "Tagae liide",
        capitalize: "Kui see algab tähega, siis suurtäht esimese tähega",
        download: "Laadi ikoon alla!"
    },
    "en-IN": {
        prefix: "Prefix",
        suffix: "Suffix",
        capitalize: "If it starts with a letter, capitalize the first letter",
        download: "Download icon!"
    },
    "en-GB": {
        prefix: "Prefix",
        suffix: "Suffix",
        capitalize: "If it starts with a letter, capitalize the first letter",
        download: "Download icon!"
    },
    "en": {
        prefix: "Prefix",
        suffix: "Suffix",
        capitalize: "If it starts with a letter, capitalize the first letter",
        download: "Download icon!"
    },
    "es-ES": {
        prefix: "Prefijo",
        suffix: "Sufijo",
        capitalize: "Si empieza con una letra, pon en mayúscula la primera letra",
        download: "¡Descargar ícono!"
    },
    "es-419": {
        prefix: "Prefijo",
        suffix: "Sufijo",
        capitalize: "Si empieza con una letra, pon en mayúscula la primera letra",
        download: "¡Descargar ícono!"
    },
    "es-US": {
        prefix: "Prefijo",
        suffix: "Sufijo",
        capitalize: "Si empieza con una letra, pon en mayúscula la primera letra",
        download: "¡Descargar ícono!"
    },
    "eu-ES": {
        prefix: "Aurkeztu",
        suffix: "Atzizkia",
        capitalize: "Letra batekin hasten bada, idatzi lehen letra nagusian",
        download: "Ikonoa jaitsi!"
    },
    "fil-PH": {
        prefix: "Paunang salita",
        suffix: "Sugnay",
        capitalize: "Kung nagsisimula ito sa isang titik, i-capitalize ang unang titik",
        download: "I-download ang icon!"
    },
    "fr-FR": {
        prefix: "Préfixe",
        suffix: "Suffixe",
        capitalize: "S'il commence par une lettre, mettre la première lettre en majuscule",
        download: "Télécharger l'icône !"
    },
    "fr-CA": {
        prefix: "Préfixe",
        suffix: "Suffixe",
        capitalize: "S'il commence par une lettre, mettre la première lettre en majuscule",
        download: "Télécharger l'icône !"
    },
    "gl-ES": {
        prefix: "Prefixo",
        suffix: "Sufixo",
        capitalize: "Se comeza cunha letra, escribe a primeira letra en maiúscula",
        download: "Descargar o ícono!"
    },
    "hr-HR": {
        prefix: "Prefiks",
        suffix: "Sufiks",
        capitalize: "Ako počinje slovom, kapitaliziraj prvo slovo",
        download: "Preuzmi ikonu!"
    },
    "zu-ZA": {
        prefix: "Isithako",
        suffix: "Isiphetho",
        capitalize: "Uma iqala ngeleta, khuphula ileta yokuqala",
        download: "Landa isithonjana!"
    },
    "is-IS": {
        prefix: "Forskeyti",
        suffix: "Eftirskeyti",
        capitalize: "Ef það byrjar á staf, skaltu stórskrifa fyrsta stafinn",
        download: "Sækið táknið!"
    },
    "it-IT": {
        prefix: "Prefisso",
        suffix: "Suffisso",
        capitalize: "Se inizia con una lettera, maiuscola la prima lettera",
        download: "Scarica l'icona!"
    },
    "sw-TZ": {
        prefix: "Kichwa",
        suffix: "Kiambatanishi",
        capitalize: "Ikiwa inaanza na herufi, inua herufi ya kwanza",
        download: "Pakua ikoni!"
    },
    "lv-LV": {
        prefix: "Priekšmets",
        suffix: "Pielikums",
        capitalize: "Ja tas sākas ar burtu, lielais pirmais burts",
        download: "Lejupielādēt ikonu!"
    },
    "lt-LT": {
        prefix: "Priešdėlis",
        suffix: "Priedas",
        capitalize: "Jei prasideda su raide, didžiuoju pirmą raide",
        download: "Atsisiųsti ikoną!"
    },
    "hu-HU": {
        prefix: "Előtag",
        suffix: "Utótag",
        capitalize: "Ha betűvel kezdődik, a nagybetűt az első betűvel",
        download: "Ikont letölteni!"
    },
    "nl-NL": {
        prefix: "Voorvoegsel",
        suffix: "Achtervoegsel",
        capitalize: "Als het begint met een letter, maak de eerste letter hoofdletter",
        download: "Pictogram downloaden!"
    },
    "nb-NO": {
        prefix: "Prefiks",
        suffix: "Suffiks",
        capitalize: "Hvis det begynner med en bokstav, kapitaliser den første bokstaven",
        download: "Last ned ikonet!"
    },
    "uz-Latn-UZ": {
        prefix: "Oldingi qo'shimcha",
        suffix: "Yana qo'shimcha",
        capitalize: "Agar harf bilan boshlangan bo'lsa, birinchi harfni katta qilib qo'ying",
        download: "Ikonni yuklab oling!"
    },
    "pl-PL": {
        prefix: "Prefiks",
        suffix: "Sufiks",
        capitalize: "Jeśli zaczyna się od litery, użyj wielkiej litery na pierwszej literze",
        download: "Pobierz ikonę!"
    },
    "pt-PT": {
        prefix: "Prefixo",
        suffix: "Sufixo",
        capitalize: "Se começar com uma letra, capitaliza a primeira letra",
        download: "Baixar ícone!"
    },
    "pt-BR": {
        prefix: "Prefixo",
        suffix: "Sufixo",
        capitalize: "Se começar com uma letra, capitaliza a primeira letra",
        download: "Baixar ícone!"
    },
    "ro-RO": {
        prefix: "Prefix",
        suffix: "Sufix",
        capitalize: "Dacă începe cu o literă, pune prima literă cu majuscule",
        download: "Descarcă pictograma!"
    },
    "sq-AL": {
        prefix: "Prefiks",
        suffix: "Shtesë",
        capitalize: "Nëse fillon me një shkronjë, shkruaj me shkronjë të madhe shkronjën e parë",
        download: "Shkarko ikonën!"
     },
     "sk-SK": {
        prefix: "Predpona",
        suffix: "Prípona",
        capitalize: "Ak začína písmenom, veľké prvé písmeno",
        download: "Stiahnuť ikonu!"
    },
    "sl-SI": {
        prefix: "Predpona",
        suffix: "Pripona",
        capitalize: "Če se začne z črko, z velikimi začetnicami",
        download: "Prenesi ikono!"
    },
    "sr-Latn-RS": {
        prefix: "Prefiks",
        suffix: "Sufiks",
        capitalize: "Ako počinje slovom, kapitalizuj prvo slovo",
        download: "Preuzmi ikonu!"
    },
    "fi-FI": {
        prefix: "Etuliite",
        suffix: "Loppuliite",
        capitalize: "Jos se alkaa kirjaimella, isolla ensimmäisellä kirjaimella",
        download: "Lataa ikoni!"
    },
    "sv-SE": {
        prefix: "Prefix",
        suffix: "Suffix",
        capitalize: "Om det börjar med en bokstav, skriv första bokstaven med stort",
        download: "Ladda ner ikon!"
    },
    "vi-VN": {
        prefix: "Tiền tố",
        suffix: "Hậu tố",
        capitalize: "Nếu bắt đầu bằng chữ cái, viết hoa chữ cái đầu tiên",
        download: "Tải xuống biểu tượng!"
    },
    "tr-TR": {
        prefix: "Önek",
        suffix: "Sonek",
        capitalize: "Eğer bir harfle başlıyorsa, ilk harfi büyük yaz",
        download: "İkonu indir!"
    },
    "be-BY": {
        prefix: "Префікс",
        suffix: "Суфікс",
        capitalize: "Калі пачынаецца з літары, напішыце першую літару з вялікай",
        download: "Спампаваць значок!"
    },
    "bg-BG": {
        prefix: "Префикс",
        suffix: "Суфикс",
        capitalize: "Ако започва с буква, направете първата буква главна",
        download: "Изтеглете иконата!"
    },
    "ky-KG": {
        prefix: "Префикс",
        suffix: "Суфикс",
        capitalize: "Эгер ал бугаардан башталса, биринчи харфин чоң кыл",
        download: "Иконканы жүктөө!"
    },
    "kk-KZ": {
        prefix: "Префикс",
        suffix: "Суфикс",
        capitalize: "Егер әріптен басталса, бірінші әріпті бас әріппен жазыңыз",
        download: "Иконканы жүктеңіз!"
    },
    "mk-MK": {
        prefix: "Префикс",
        suffix: "Суфикс",
        capitalize: "Ако започнува со буква, напиши го првото слово со голема буква",
        download: "Преземи икона!"
    },
    "mn-MN": {
        prefix: "Урьдчилсан",
        suffix: "Дүгнэлт",
        capitalize: "Хэрвээ үсэгтэй эхэлж байвал, анхны үсгийг томоор бич",
        download: "Икон хуулах!"
    },
    "ru-RU": {
        prefix: "Префикс",
        suffix: "Суффикс",
        capitalize: "Если оно начинается с буквы, сделайте первую букву заглавной",
        download: "Скачать иконку!"
    },
    "sr-Cyrl-RS": {
        prefix: "Префикс",
        suffix: "Суфикс",
        capitalize: "Ако почиње словом, капитализуј прво слово",
        download: "Преузми иконку!"
    },
    "uk-UA": {
        prefix: "Префікс",
        suffix: "Суфікс",
        capitalize: "Якщо починається з літери, напишіть першу літеру з великої",
        download: "Завантажити іконку!"
    },
    "el-GR": {
        prefix: "Πρόθεμα",
        suffix: "Επίθημα",
        capitalize: "Αν αρχίζει με γράμμα, κεφαλαιοποιήστε το πρώτο γράμμα",
        download: "Κατεβάστε το εικονίδιο!"
    },
    "hy-AM": {
        prefix: "Առաջադիմություն",
        suffix: "Վերջաբան",
        capitalize: "Եթե սկսվում է տառով, մեծացրեք առաջին տառը",
        download: "Բեռնել սիմվոլը!"
    },
    "he-IL": {
        prefix: "קידומת",
        suffix: "סופית",
        capitalize: "אם זה מתחיל באות, הכנס אות גדולה ראשונה",
        download: "הורד סמל!"
    },
    "ur-PK": {
        prefix: "پیش لفظ",
        suffix: "لاحقہ",
        capitalize: "اگر یہ کسی حرف سے شروع ہوتا ہے تو پہلے حرف کو بڑے حروف میں لکھیں",
        download: "آئیکن ڈاؤن لوڈ کریں!"
    },
    "ar": {
        prefix: "بادئة",
        suffix: "لاحقة",
        capitalize: "إذا بدأت بحرف، اجعل الحرف الأول كبيرًا",
        download: "تنزيل الأيقونة!"
    },
    "fa-IR": {
        prefix: "پیشوند",
        suffix: "پسوند",
        capitalize: "اگر با حرف شروع می‌شود، حرف اول را بزرگ کنید",
        download: "دانلود آیکون!"
    },
    "ne-NP": {
        prefix: "प्रीफिक्स",
        suffix: "सफिक्स",
        capitalize: "यदि यो अक्षरले सुरु हुन्छ भने, पहिलो अक्षरलाई ठूलो बनाउनुहोस्",
        download: "आइकन डाउनलोड गर्नुहोस्!"
    },
    "mr-IN": {
        prefix: "पूर्वसूचक",
        suffix: "अंतसूचक",
        capitalize: "जर तुमच्या अक्षराने सुरूवात केली, तर पहिल्या अक्षराला मोठा करा",
        download: "आइकन डाउनलोड करा!"
    },
    "hi-IN": {
        prefix: "पूर्ववर्ती",
        suffix: "उपसर्ग",
        capitalize: "यदि यह एक अक्षर से शुरू होता है, तो पहले अक्षर को बड़े अक्षर में करें",
        download: "आइकन डाउनलोड करें!"
    },
    "as-IN": {
        prefix: "পূৰ্বৰ অংশ",
        suffix: "অংশ",
        capitalize: "যদি এটি এখন অক্ষৰে আৰম্ভ হয়, তেনেহ'লে প্ৰথম অক্ষৰখন বৃহৎ কৰক",
        download: "আইকন ডাউনলোড কৰক!"
    },
    "bn-BD": {
        prefix: "প্রিফিক্স",
        suffix: "সাফিক্স",
        capitalize: "যদি এটি একটি অক্ষর দিয়ে শুরু হয় তবে প্রথম অক্ষরকে বড় করুন",
        download: "আইকন ডাউনলোড করুন!"
    },
    "pa-Guru-IN": {
        prefix: "ਪੂਰਵਲੇਖ",
        suffix: "ਲਾਗੂ",
        capitalize: "ਜੇ ਇਹ ਅੱਖਰ ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ, ਤਾਂ ਪਹਿਲੇ ਅੱਖਰ ਨੂੰ ਵੱਡਾ ਕਰੋ",
        download: "ਆਈਕਨ ਡਾਊਨਲੋਡ ਕਰੋ!"
    },
    "gu-IN": {
        prefix: "પૂર્વવાહી",
        suffix: "અર્થશાસ્ત્ર",
        capitalize: "જો તે અક્ષરથી શરૂ થાય તો પ્રથમ અક્ષરને મોટા બનાવો",
        download: "આઇકન ડાઉનલોડ કરો!"
    },
    "or-IN": {
        prefix: "ପ୍ରିଫିକ୍ସ",
        suffix: "ସୁଫିକ୍ସ",
        capitalize: "ଯଦି ଏହା ଏକ ଅକ୍ଷରରୁ ଆରମ୍ଭ ହୁଏ, ତେବେ ପ୍ରଥମ ଅକ୍ଷରକୁ ବଡ ରଖନ୍ତୁ",
        download: "ଆଇକନ୍‌ ଡାଉନଲୋଡ୍‌ କରନ୍ତୁ!"
    },
    "ta-IN": {
        prefix: "முன்சொல்",
        suffix: "இணைப்பு",
        capitalize: "அது எழுத்தில் தொடங்கின், முதல் எழுத்தை பெரிய எழுத்தில் மாற்றவும்",
        download: "அச்சொல்லை பதிவிறக்கம் செய்க!"
    },
    "te-IN": {
        prefix: "ప్రీఫిక్స్",
        suffix: "సఫిక్స్",
        capitalize: "అది అక్షరంతో ప్రారంభం అయితే, మొదటి అక్షరాన్ని పెద్దదిగా చేయండి",
        download: "ఐకాన్ డౌన్లోడ్ చేయండి!"
    },
    "kn-IN": {
        prefix: "ಮೂರು",
        suffix: "ಅನುಕ್ರಮ",
        capitalize: "ಅದು ಅಕ್ಷರದಿಂದ ಪ್ರಾರಂಭವಾದರೆ, ಮೊದಲ ಅಕ್ಷರವನ್ನು ದೊಡ್ಡದಾಗಿ ಮಾಡಿ",
        download: "ಐಕಾನ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ!"
    },
    "ml-IN": {
        prefix: "മുൻപറഞ്ഞത്",
        suffix: "ശേഷം",
        capitalize: "അത് അക്ഷരത്തിൽ തുടങ്ങുകയാണെങ്കിൽ, ആദ്യ അക്ഷരം വലിയയാക്കി",
        download: "അയോൺ ഡൗൺലോഡ് ചെയ്യുക!"
    },
    "si-LK": {
        prefix: "පෙරපදය",
        suffix: "අනුපදය",
        capitalize: "එය අක්ෂරයකින් ආරම්භ කළහොත්, පළමු අක්ෂරය විශාල කරන්න",
        download: "ලොාකීකරණය කරන්න!"
    },
    "th-TH": {
        prefix: "คำนำ",
        suffix: "คำต่อท้าย",
        capitalize: "ถ้าเริ่มด้วยตัวอักษรให้ตัวอักษรตัวแรกเป็นตัวพิมพ์ใหญ่",
        download: "ดาวน์โหลดไอคอน!"
    },
    "lo-LA": {
        prefix: "ເຄື່ອນຄົນ",
        suffix: "ປ່ອນອັນ",
        capitalize: "ໂດຍຖ້າເລີ່ມດ້ວຍອັກສອນ ຂອງເລີ່ມສຽງດິບໃນຂອບໃນ",
        download: "ດາວເລີ່ອຄອນ!"
    },
    "my-MM": {
        prefix: "အကြောင်းအရာ",
        suffix: "အဆုံးသတ်",
        capitalize: "အက္ခရာဖြင့်စလွှတ်သည့်အခါ၊ ပထမဆုံးအက္ခရာကို အကြီးစီးရေးပါ",
        download: "အိုင်ကွန်းဒေါင်းလုပ်လုပ်ပါ!"
    },
    "ka-GE": {
        prefix: "წინადადება",
        suffix: "საფუძველი",
        capitalize: "თუ ის იწყება ასოზე, გააკეთეთ პირველი ასო დიდი",
        download: "დაამატეთ აიკონი!"
    },
    "am-ET": {
        prefix: "ቅድመ ቃል",
        suffix: "መደብ",
        capitalize: "እንደ የዕለት አይደለም፣ የመጀመሪያ ፊደል ይትወዳድር",
        download: "መልዕክት ይላኩ!"
    },
    "km-KH": {
        prefix: "គម្រូ",
        suffix: "សរុប",
        capitalize: "បើវាលើកឡើងដោយអក្សរ សូមធ្វើអក្សរដំបូងអោយធំបំផុត",
        download: "ទាញយកស្លាក!"
    },
    "zh-Hans-CN": {
        prefix: "前缀",
        suffix: "后缀",
        capitalize: "如果以字母开头则大写第一个字母",
        download: "下载图标！"
    },
    "zh-Hant-TW": {
        prefix: "前綴",
        suffix: "後綴",
        capitalize: "如果以字母開頭則大寫第一個字母",
        download: "下載圖標！"
    },
    "zh-Hant-HK": {
        prefix: "前綴",
        suffix: "後綴",
        capitalize: "如果以字母開頭則大寫第一個字母",
        download: "下載圖標！"
    },
    "ja-JP": {
        prefix: "接頭辞",
        suffix: "接尾辞",
        capitalize: "文字で始まる場合は最初の文字を大文字にする",
        download: "アイコンをダウンロード！"
    },
    "ko-KR": {
        prefix: "접두사",
        suffix: "접미사",
        capitalize: "문자로 시작하면 첫 글자를 대문자로 작성하세요",
        download: "아이콘 다운로드!"
    }
    };

    let jsInitChecktimer = null;

    function main() {
        jsInitChecktimer = setInterval(addDownloadButtons, 1000);
    }

    function getFullSizeImgUrl(url) {
        return url.split("=").slice(0, -1).join("=") + "=s0";
    }

    function getIconNameFromAlt(alttext, index) {
        if (alttext === "Custom badge for members") {
            alttext = null;
        }
        return alttext || "Icon_" + (index + 1);
    }

    async function getExtensionFromURL(url) {
        try {
            let response = await fetch(url, { method: 'HEAD' });
            if (response.ok) {
                let contentType = response.headers.get('Content-Type');
                if (contentType) {
                    return contentTypeToExtension(contentType);
                }
            }
            return 'png';
        } catch (error) {
            console.error("Failed to fetch Content-Type for URL:", url, error);
            return 'png';
        }
    }

    function contentTypeToExtension(contentType) {
        const mapping = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/webp': 'webp',
        };
        return mapping[contentType] || 'png';
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function applyPrefixSuffix(filename, prefix, suffix, capitalize) {
        if (capitalize && /[a-zA-Z]/.test(filename.charAt(0))) {
            filename = capitalizeFirstLetter(filename);
        }
        return (prefix || '') + filename + (suffix || '');
    }

    function extractUrls(imgs, prefix, suffix, capitalize) {
        const urls = [];
        const metadata = []; // 用來保存alt文本、url和filename的metadata
        const filenameCount = {}; // 用來記錄每個名稱出現的次數
        const firstAppearanceMap = {}; // 用來記錄每個文件名第一次出現的index和對應的url信息

        for (let i = 0; i < imgs.snapshotLength; i++) {
            const img = imgs.snapshotItem(i);
            let originalFilename = getIconNameFromAlt(img.alt, i); // 使用原始名稱

            let finalFilename;

            // 初始化計數器
            if (!filenameCount[originalFilename]) {
                filenameCount[originalFilename] = 0; // 初始化名稱計數為 0
            }

            // 獲取當前計數
            const count = filenameCount[originalFilename];

            if (count === 0) {
                // 第一次出現，保留原始名稱，但記錄它的位置以便後續修改
                finalFilename = applyPrefixSuffix(originalFilename, prefix, suffix, capitalize);

                // 記錄第一次出現的位置和相關信息
                firstAppearanceMap[originalFilename] = {
                    index: i,  // 記錄第一次出現的 index
                    url: getFullSizeImgUrl(img.src)  // 記錄對應的圖片URL
                };
            } else {
                // 重複出現，則根據計數獲取 replacementNames
                const replacementIndex = Math.min(count, replacementNames.length - 1); // 確保索引不超過範圍
                finalFilename = applyPrefixSuffix(replacementNames[replacementIndex], prefix, suffix, capitalize); // 使用替換名稱

                // 如果是第二次出現，修改第一次的文件名
                if (count === 1) {
                    const firstAppearance = firstAppearanceMap[originalFilename];
                    if (firstAppearance) {
                        // 將第一次的文件名更新為替換名稱的第一個
                        urls[firstAppearance.index].filename = applyPrefixSuffix(replacementNames[0], prefix, suffix, capitalize);
                        metadata[firstAppearance.index].altText = applyPrefixSuffix(replacementNames[0], prefix, suffix, capitalize); // 同步更新metadata的altText
                    }
                }
            }

            // 增加計數
            filenameCount[originalFilename]++;

            // 將網址和檔名推入數組
            urls.push({
                "url": getFullSizeImgUrl(img.src),
                "filename": finalFilename
            });

            // 保存metadata信息，包括最終的文件名
            metadata.push({
                "altText": finalFilename,
                "url": getFullSizeImgUrl(img.src)
            });
        }
        return { urls, metadata }; // 返回圖片數據與metadata
    }

    function addDownloadButtons() {
        const iconContainerXPath = "//ytd-sponsorships-perk-renderer[descendant::img]";
        const iconContainers = document.evaluate(iconContainerXPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (iconContainers.snapshotLength !== 0) {
            clearInterval(jsInitChecktimer);
            jsInitChecktimer = null;
        }

        // 獲取 YouTube 的介面語言
        const lang = document.documentElement.lang || 'en'; // 默認為英文
        const currentLabels = labels[lang] || labels['en']; // 如果沒有對應的語言則使用英文

        for (let i = 0; i < iconContainers.snapshotLength; i++) {
            const container = iconContainers.snapshotItem(i);
            const titleResult = document.evaluate(".//yt-formatted-string[@id=\"title\"]/text()", container, null, XPathResult.STRING_TYPE, null);
            const sectionTitle = titleResult.stringValue || "";
            const header = sectionTitle.split(" ").slice(0, 2).join(" ") || "unknown";

            if (container.querySelector('.download-icons-button')) continue;

            // 創建前綴、後綴的輸入框和大寫切換
            const prefixInput = document.createElement("input");
            prefixInput.placeholder = currentLabels.prefix; // 設置前綴的佔位符
            prefixInput.style.marginRight = "5px";
            prefixInput.style.display = "block";

            const capitalizeLabel = document.createElement("label");
            capitalizeLabel.style.marginRight = "5px";
            capitalizeLabel.style.display = "block";

            const capitalizeCheckbox = document.createElement("input");
            capitalizeCheckbox.type = "checkbox";

            // 創建描述文本並設置綠色字體
            const descriptionText = document.createElement("span");
            descriptionText.textContent = currentLabels.capitalize; // 設置描述文本

            // 定義函數來找到背景色
            function getBackgroundColor(element) {
                let bgColor = window.getComputedStyle(element).backgroundColor;

                // 當背景顏色是透明或者無法檢測時，繼續查找父元素
                while (element && (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent')) {
                    element = element.parentElement;
                    if (element) {
                        bgColor = window.getComputedStyle(element).backgroundColor;
                    } else {
                        break;
                    }
                }

                return bgColor;
            }

            // 獲取背景色（從 body 開始檢測）
            const backgroundColor = getBackgroundColor(document.body);

            // 將背景顏色轉換為 RGB 格式
            function getRGBValues(color) {
                if (color.startsWith('rgb')) {
                    // 如果是 rgb/rgba 顏色，解析 RGB 數值
        return color.match(/\d+/g).map(Number);
                } else if (color.startsWith('#')) {
                    // 如果是 hex 顏色，將 hex 轉換為 RGB
                    let hex = color.replace('#', '');
                    if (hex.length === 3) {
                        hex = hex.split('').map(h => h + h).join('');
                    }
                    const bigint = parseInt(hex, 16);
                    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
                }
                return [255, 255, 255]; // 默認為白色（避免異常情況）
            }

            const rgb = getRGBValues(backgroundColor);
            const brightness = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]); // 計算亮度

            // 根據亮度設置文本顏色
            descriptionText.style.color = brightness > 186 ? "black" : "white";

            capitalizeLabel.appendChild(capitalizeCheckbox);
            capitalizeLabel.appendChild(descriptionText); // 添加描述文本

            const suffixInput = document.createElement("input");
            suffixInput.placeholder = currentLabels.suffix; // 設置後綴的佔位符
            suffixInput.style.marginRight = "5px";

            const btnDownload = document.createElement("button");
            btnDownload.innerText = currentLabels.download; // 設置按鈕文本
            btnDownload.className = 'download-icons-button';
            btnDownload.style.marginTop = '10px';
            btnDownload.addEventListener("click", (e) => {
                const prefix = prefixInput.value;
                const suffix = suffixInput.value;
                const capitalize = capitalizeCheckbox.checked;
                downloadIcons(container, header, prefix, suffix, capitalize);
            });

            container.appendChild(prefixInput);
            container.appendChild(capitalizeLabel); // 把大寫選項移到前綴後面並包含描述
            container.appendChild(suffixInput);
            container.appendChild(btnDownload);
        }
    }

    async function downloadIcons(container, header, prefix, suffix, capitalize) {
        const channelHandleXPath = "//*[@id=\"page-header\"]/yt-page-header-renderer/yt-page-header-view-model/div/div[1]/div/yt-content-metadata-view-model/div[1]/span";
        const channelHandleNode = document.evaluate(channelHandleXPath, document, null, XPathResult.STRING_TYPE, null);
        let channelHandle;
        if (!channelHandleNode || !channelHandleNode.stringValue) {
            channelHandle = "unknown_channel";
            console.log("YouTube updated the DOM again--needs update");
        } else {
            channelHandle = channelHandleNode.stringValue;
        }
        const folderName = channelHandle + "-" + header;
        const imgsContainer = document.evaluate(".//img", container, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const { urls, metadata } = extractUrls(imgsContainer, prefix, suffix, capitalize);

        const zip = new JSZip();
        const iconZip = zip.folder(folderName);
        const promises = [];

        // 生成 metadata.json，保留原始的冒號 ':'
        const metadataJson = JSON.stringify(metadata, null, 2);
        iconZip.file("metadata.json", metadataJson);

        for (let i = 0; i < urls.length; i++) {
            const iconObj = urls[i];
            const url = iconObj.url;
            const filename = iconObj.filename; // 保留原始文件名

            const promise = new Promise(async (resolve, reject) => {
                try {
                    const extension = await getExtensionFromURL(url);
                    // 將文件名中的特殊字符替換為可顯示字符
                    const sanitizedFilename = filename
                        .replace(/\//g, '⧸')
                        .replace(/\\/g, '＼')
                        .replace(/\?/g, '？')
                        .replace(/%/g, '％')
                        .replace(/\*/g, '＊')
                        .replace(/:/g, '：')
                        .replace(/\|/g, '｜')
                        .replace(/</g, '＜')
                        .replace(/>/g, '＞');
                    const fullFilename = sanitizedFilename + "." + extension; // 最終文件名

                    JSZipUtils.getBinaryContent(url, function (err, data) {
                        if (err) {
                            reject(err);
                        } else {
                            iconZip.file(fullFilename, data);
                            resolve();
                        }
                    });
                } catch (error) {
                    reject(error);
                }
            });

            promises.push(promise);
        }

        Promise.all(promises).then(function () {
            zip.generateAsync({
                type: "blob",
                compression: "DEFLATE"
            }).then(function (blob) {
                saveAs(blob, folderName + ".zip");
            }, function (err) {
                alert("Failed. See the log for details.");
                console.log(err);
            });
        }).catch(function(error) {
            alert("An error occurred during the download process. See the log for details.");
            console.error(error);
        });
    }
})();
