// ==UserScript==
// @name         YouTube Recommended Remover
// @namespace    AAAAAAAA.com
// @version      2.3
// @description  Removes recommended videos from the related videos section
// @author       ducktrshessami
// @match        *://www.youtube.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/372172/YouTube%20Recommended%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/372172/YouTube%20Recommended%20Remover.meta.js
// ==/UserScript==

(function() {
    const language = document.documentElement.lang;
    const Recommended = {
        "af-ZA": "Aanbeveel vir jou",
        "am-ET": "ለእርስዎ የተመከሩ",
        "ar-EG": "فيديوهات مقترحة",
        "az-AZ": "Sizin üçün tövsiyə yoxdur",
        "be-BY": "Рэкамендавана для вас",
        "bg-BG": "Препоръчан за вас",
        "bn-BD": "আপনার জন্য সুপারিশ করা হয়েছে",
        "bs-BA": "Preporučeno za vas",
        "ca-ES": "Recomanat per a tu",
        "cs-CZ": "Mohlo by se vám líbit",
        "da-DK": "Anbefalet til dig",
        "de-DE": "Empfohlenes Video",
        "el-GR": "Συνιστάται για εσάς",
        "en-GB": "Recommended for you",
        "en-US": "Recommended for you",
        "es-ES": "Recomendado para ti",
        "es-MX": "Recomendado para ti",
        "es-US": "Recomendado para ti",
        "et-EE": "Teile soovitatud",
        "eu-ES": "Zuri gomendatua",
        "fa-IR": "توصیه شده برای شما",
        "fi-FI": "Suositeltu sinulle",
        "fil-PH": "Inirerekomenda sa iyo",
        "fr-CA": "Recommandé pour vous",
        "fr-FR": "Recommandée pour vous",
        "gl-ES": "Recomendado para ti",
        "gu-IN": "ખાસ તમારા માટે",
        "hi-IN": "आपके लिए सुझाव",
        "hr-HR": "Preporuka za vas",
        "hu-HU": "Neked ajánlott",
        "hy-AM": "Առաջարկվող տեսանյութեր",
        "id-ID": "Rekomendasi untuk Anda",
        "is-IS": "Mælt með fyrir þig",
        "it-IT": "Consigliato per te",
        "iw-IL": "מומלץ עבורך",
        "ja-JP": "あなたへのおすすめ",
        "ka-GE": "თქვენთვის რეკომენდებული",
        "kk-KZ": "Сізге ұсынылғандар",
        "km-KH": "សូមណែនាំ​​​​សម្រាប់​អ្នក",
        "kn-IN": "ಶಿಫಾರಸು ಮಾಡಲಾಗಿದ್ದು",
        "ko-KR": "맞춤 동영상",
        "ky-KG": "Сизге сунушталган",
        "lo-LA": "ແນະນຳສຳລັບທ່ານ",
        "lt-LT": "Rekomenduojama",
        "lv-LV": "Iesakām jums",
        "mk-MK": "Препорачано за вас",
        "ml-IN": "നിങ്ങൾക്ക് ശുപാർശിതം",
        "mn-MN": "Танд санал болгож буй",
        "mr-IN": "तुमच्यासाठी शिफारस केले",
        "ms-MY": "Disyorkan untuk anda",
        "my-MM": "သင့်အတွက် အကြံပြုထားသည်များ",
        "nb-NO": "Anbefalt for deg",
        "ne-NP": "तपाईंको लागि सिफारिस गरिएको",
        "nl-NL": "Aanbevolen voor jou",
        "pa-IN": "ਤੁਹਾਡੇ ਲਈ ਸਿਫਾਰਸ਼ ਕੀਤੇ",
        "pl-PL": "Polecane dla Ciebie",
        "pt-BR": "Recomendado",
        "pt-PT": "Recomendado para si",
        "ro-RO": "Recomandate pentru tine",
        "ru-RU": "Рекомендуемые вам",
        "si-LK": "ඔබ සඳහා නිර්දේශිත",
        "sk-SK": "Odporúčané pre vás",
        "sl-SI": "Priporočamo za vas",
        "sq-AL": "Rekomanduar për ty",
        "sr-Latn-RS": "Preporučeno za vas",
        "sr-RS": "Препоручено за вас",
        "sv-SE": "Rekommendationer",
        "sw-TZ": "Unazopendekezewa",
        "ta-IN": "உங்களுக்காகப் பரிந்துரைக்கப்படுகிறது",
        "te-IN": "సిఫార్సు చేయబడింది",
        "th-TH": "ขอแนะนำสำหรับคุณ",
        "tr-TR": "Sizin için öneriliyor",
        "uk-UA": "Рекомендуємо вам",
        "ur-PK": "آپ کیلئے تجویز کردہ",
        "uz-UZ": "Tavsiya etiladi",
        "vi-VN": "Đề xuất cho bạn",
        "zh-CN": "为您推荐",
        "zh-HK": "為您推薦",
        "zh-TW": "為您推薦",
        "zu-ZA": "Kunconyelwe wena"
    };

    function hide() {
        $("div#items.style-scope.ytd-watch-next-secondary-results-renderer:visible").children(":has(span.style-scope.ytd-video-meta-block:contains('" + Recommended[language] + "'):visible):visible").hide();
    }

    var observer = new MutationObserver(hide);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();