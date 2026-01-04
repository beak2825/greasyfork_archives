// ==UserScript==
// @name        AO3: Language names in English
// @description Display language names in English and sort language dropdowns by this order.
// @namespace	https://greasyfork.org/en/scripts/373145-ao3-language-names-in-english
// @author	Min
// @version	1.5
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @include     http://*archiveofourown.org/*
// @include     https://*archiveofourown.org/*
// @downloadURL https://update.greasyfork.org/scripts/373145/AO3%3A%20Language%20names%20in%20English.user.js
// @updateURL https://update.greasyfork.org/scripts/373145/AO3%3A%20Language%20names%20in%20English.meta.js
// ==/UserScript==


(function ($) {

    const DEBUG = false;

    const languages = [
        { english_name: "Afrikaans", name: ["Afrikaans"], code: ["afr"] },
        { english_name: "Albanian", name: ["Shqip"], code: ["sq"] },
        { english_name: "Arabic", name: ["العربية"], code: ["ar"] },
        { english_name: "Aramaic", name: ["ܐܪܡܝܐ | ארמיא"], code: ["arc"] },
        { english_name: "Armenian", name: ["հայերեն"], code: ["hy"] },
        { english_name: "Asturian", name: ["asturianu"], code: ["ast"] },
        { english_name: "Azerbaijani", name: ["Азәрбајҹан дили | آذربایجان دیلی"], code: ["azj"] },
        { english_name: "Bashkir", name: ["Башҡорт теле"], code: ["ba"] },
        { english_name: "Basque", name: ["Euskara"], code: ["eu"] },
        { english_name: "Belarusian", name: ["беларуская"], code: ["be"] },
        { english_name: "Bengali", name: ["বাংলা"], code: ["bn"] },
        { english_name: "Bosnian", name: ["Bosanski"], code: ["bos"] },
        { english_name: "Breton", name: ["Brezhoneg"], code: ["br"] },
        { english_name: "Bulgarian", name: ["Български"], code: ["bg"] },
        { english_name: "Burmese", name: ["မြန်မာဘာသာ"], code: ["my"] },
        { english_name: "Catalan", name: ["Català"], code: ["ca"] },
        { english_name: "Cebuano", name: ["Cebuano"], code: ["ceb"] },
        { english_name: "Chechen", name: ["Нохчийн мотт"], code: ["ce"] },
        { english_name: "Chinese", name: ["中文"], code: ["zh-CN"] },
        { english_name: "CHINESE - Mandarin", name: ["中文-普通话 國語"], code: ["zh"] },
        { english_name: "Chinese - Cantonese", name: ["中文-广东话 粵語"], code: ["yue"] },
        { english_name: "Chinese - Hakka", name: ["中文-客家话"], code: ["hak"] },
        { english_name: "Chinese - Taiwanese", name: ["中文-闽南话 臺語"], code: ["nan"] },
        { english_name: "Chinese - Wu", name: ["中文-吴语"], code: ["wuu"] },
        { english_name: "Chinook Jargon", name: ["Chinuk Wawa"], code: ["chn"] },
        { english_name: "Coptic", name: ["ϯⲙⲉⲧⲣⲉⲙⲛ̀ⲭⲏⲙⲓ"], code: ["cop"] },
        { english_name: "Croatian", name: ["Hrvatski"], code: ["hr"] },
        { english_name: "Czech", name: ["Čeština"], code: ["cs"] },
        { english_name: "Danish", name: ["Dansk"], code: ["da"] },
        { english_name: "Dutch", name: ["Nederlands"], code: ["nl"] },
        { english_name: "Egyptian", name: ["𓂋𓏺𓈖 𓆎𓅓𓏏𓊖"], code: ["egy"] },
        { english_name: "English", name: ["English"], code: ["en"] },
        { english_name: "Esperanto", name: ["Esperanto"], code: ["eo"] },
        { english_name: "Estonian", name: ["eesti keel"], code: ["et"] },
        { english_name: "Filipino", name: ["Filipino"], code: ["fil"] },
        { english_name: "Finnish", name: ["suomi"], code: ["fi"] },
        { english_name: "French", name: ["Français"], code: ["fr"] },
        { english_name: "Friulian", name: ["Furlan"], code: ["fur"] },
        { english_name: "Gaelic", name: ["Gàidhlig"], code: ["gd"] },
        { english_name: "Galician", name: ["Galego"], code: ["gl"] },
        { english_name: "Georgian", name: ["ქართული"], code: ["kat"] },
        { english_name: "German", name: ["Deutsch"], code: ["de"] },
        { english_name: "Gothic", name: ["Sprēkō Þiudiskō"], code: ["gem"] },
        { english_name: "Gothic", name: ["𐌲𐌿𐍄𐌹𐍃𐌺𐌰"], code: ["got"] },
        { english_name: "Greek", name: ["Ελληνικά"], code: ["el"] },
        { english_name: "Haitian Creole", name: ["kreyòl ayisyen"], code: ["ht"] },
        { english_name: "Hausa | هَرْشَن هَوْسَ", name: ["Hausa | هَرْشَن هَوْسَ"], code: ["hau"] },
        { english_name: "Hawaiian", name: ["ʻŌlelo Hawaiʻi"], code: ["haw"] },
        { english_name: "Hebrew", name: ["עברית"], code: ["he"] },
        { english_name: "Hindi", name: ["हिन्दी", "हिंदी"], code: ["hi"] },
        { english_name: "Hungarian", name: ["Magyar"], code: ["hu"] },
        { english_name: "Icelandic", name: ["Íslenska"], code: ["is"] },
        { english_name: "Indonesian", name: ["Bahasa Indonesia"], code: ["id"] },
        { english_name: "Interlingua", name: ["Interlingua"], code: ["ia"] },
        { english_name: "Irish", name: ["Gaeilge"], code: ["ga"] },
        { english_name: "Italian", name: ["Italiano"], code: ["it"] },
        { english_name: "Japanese", name: ["日本語"], code: ["ja"] },
        { english_name: "Javanese", name: ["Basa Jawa"], code: ["jv"] },
        { english_name: "Kannada", name: ["ಕನ್ನಡ"], code: ["kan"] },
        { english_name: "Kazakh", name: ["qazaqşa | қазақша"], code: ["kaz"] },
        { english_name: "Khmer", name: ["ភាសាខ្មែរ"], code: ["khm"] },
        { english_name: "Khuzdul", name: ["Khuzdul"], code: ["qkz"] },
        { english_name: "Kiswahili", name: ["Kiswahili"], code: ["sw"] },
        { english_name: "Klingon", name: ["tlhIngan-Hol"], code: ["tlh"] },
        { english_name: "Korean", name: ["한국어", "한국말"], code: ["ko"] },
        { english_name: "Kurdish", name: ["Kurdî | کوردی"], code: ["ku"] },
        { english_name: "Kyrgyz", name: ["Кыргызча"], code: ["kir"] },
        { english_name: "Latin", name: ["Lingua latina"], code: ["la"] },
        { english_name: "Latvian", name: ["Latviešu valoda"], code: ["lv"] },
        { english_name: "Lithuanian", name: ["Lietuvių kalba"], code: ["lt"] },
        { english_name: "Low German", name: ["Plattdüütsch"], code: ["nds"] },
        { english_name: "Luxembourgish", name: ["Lëtzebuergesch"], code: ["lb"] },
        { english_name: "Macedonian", name: ["македонски"], code: ["mk"] },
        { english_name: "Malay", name: ["Bahasa Malaysia"], code: ["ms"] },
        { english_name: "Malayalam", name: ["മലയാളം"], code: ["ml"] },
        { english_name: "Maltese", name: ["Malti"], code: ["mt"] },
        { english_name: "Manchu", name: ["ᠮᠠᠨᠵᡠ ᡤᡳᠰᡠᠨ"], code: ["mnc"] },
        { english_name: "Marathi", name: ["मराठी"], code: ["mr"] },
        { english_name: "Mikasuki", name: ["Mikisúkî"], code: ["mik"] },
        { english_name: "Mongolian", name: ["ᠮᠣᠩᠭᠣᠯ ᠪᠢᠴᠢᠭ᠌ | Монгол Кирилл үсэг"], code: ["mon"] },
        { english_name: "Nahuatl", name: ["Nāhuatl"], code: ["nah"] },
        { english_name: "Norwegian", name: ["Norsk"], code: ["no"] },
        { english_name: "Old English", name: ["Eald Englisċ"], code: ["ang"] },
        { english_name: "Ottoman Turkish", name: ["لسان عثمانى"], code: ["ota"] },
        { english_name: "Pashto", name: ["پښتو"], code: ["ps"] },
        { english_name: "Persian", name: ["فارسی"], code: ["fa"] },
        { english_name: "Polish", name: ["Polski"], code: ["pl"] },
        { english_name: "Portuguese-BR", name: ["Português brasileiro"], code: ["ptBR", "pt-BR"] },
        { english_name: "Portuguese-PT", name: ["Português europeu"], code: ["ptPT", "pt-PT"] },
        { english_name: "Punjabi", name: ["ਪੰਜਾਬੀ"], code: ["pa"] },
        { english_name: "Quebec Sign Language", name: ["Langue des signes québécoise"], code: ["fcs"] },
        { english_name: "Quenya", name: ["Quenya"], code: ["qya"] },
        { english_name: "Romanian", name: ["Română"], code: ["ro"] },
        { english_name: "Russian", name: ["Русский"], code: ["ru"] },
        { english_name: "Scots", name: ["Scots"], code: ["sco"] },
        { english_name: "Serbian", name: ["Српски"], code: ["sr"] },
        { english_name: "Sindarin", name: ["Sindarin"], code: ["sjn"] },
        { english_name: "Sinhala", name: ["සිංහල"], code: ["si"] },
        { english_name: "Slovak", name: ["Slovenčina"], code: ["sk"] },
        { english_name: "Slovenian", name: ["Slovenščina"], code: ["slv"] },
        { english_name: "Somali", name: ["af Soomaali"], code: ["so"] },
        { english_name: "Spanish", name: ["Español"], code: ["es"] },
        { english_name: "Sumerian", name: ["𒅴𒂠"], code: ["sux"] },
        { english_name: "Swedish", name: ["Svenska"], code: ["sv"] },
        { english_name: "Tamil", name: ["தமிழ்"], code: ["ta"] },
        { english_name: "Telugu", name: ["తెలుగు"], code: ["tel"] },
        { english_name: "Thermian", name: ["Thermian"], code: ["tqx"] },
        { english_name: "Thai", name: ["ไทย"], code: ["th"] },
        { english_name: "Tibetan", name: ["བོད་སྐད་"], code: ["bod"] },
        { english_name: "toki pona", name: ["toki pona"], code: ["qtp"] },
        { english_name: "Tsakonian", name: ["τσακώνικα"], code: ["tsd"] },
        { english_name: "Turkish", name: ["Türkçe"], code: ["tr"] },
        { english_name: "Ukrainian", name: ["Українська"], code: ["uk"] },
        { english_name: "Urdu", name: ["اُردُو"], code: ["urd"] },
        { english_name: "Uyghur", name: ["ئۇيغۇر تىلى"], code: ["uig"] },
        { english_name: "Vietnamese", name: ["Tiếng Việt"], code: ["vi"] },
        { english_name: "Volapük", name: ["Volapük"], code: ["vol"] },
        { english_name: "Welsh", name: ["Cymraeg"], code: ["cy"] },
        { english_name: "Yiddish", name: ["יידיש"], code: ["yi"] },
        { english_name: "Yucatec Maya", name: ["maayaʼ tʼàan"], code: ["yua"] },
        { english_name: "Zulu", name: ["isiZulu"], code: ["zu"] },
    ];

    // new: { english_name: "", name: [""], code: [""] },

    const languages_by_name = languages.reduce((acc, lang) => {
        lang.name.forEach((name) => {
            acc[name.toLowerCase()] = lang.english_name;
        });
        return acc;
    }, {});

    const getNameWithEnglish = (lang_name) => {
        const result = {
            name_with_english: undefined,
            found_language: false,
        };

        const lang_name_lowercase = lang_name.toLowerCase();
        if (languages_by_name[lang_name_lowercase]) {
            result.found_language = true;
            
            if (lang_name !== languages_by_name[lang_name_lowercase]) {
                result.name_with_english = `${languages_by_name[lang_name_lowercase]} (${lang_name})`;
            }
        }

        return result;
    };

    // dropdowns
    $('select[id$="language_id"]').each(function () {
        const options = $(this).find('option');
        const selected_val = $(this).val();
        const translation_not_found = [];

        options.each(function () {
            const lang_name = $(this).text();
            const { name_with_english, found_language } = getNameWithEnglish(lang_name);
            let option_name = lang_name;

            if (name_with_english) {
                option_name = name_with_english;
                $(this).text(option_name);
            }
            else if (DEBUG && lang_name && !found_language) {
                translation_not_found.push(`{ english_name: "", name: ["${lang_name}"], code: ["${$(this).val()}"] },`);
            }
            $(this).data('sort', $(this).val() ? option_name.toLowerCase() : '');
        });

        if (DEBUG) { console.log(translation_not_found.length + '\n\n' + translation_not_found.join('\n')); }

        options.sort(function (a, b) {
            return ($(a).data('sort') > $(b).data('sort') ? 1 : -1);
        });

        $(this).empty().append(options).val(selected_val);
    });

    // language labels
    $('dd.language, dl.language dt a, .translations a').each(function () {
        const lang_name = $(this).text().trim();
        const { name_with_english } = getNameWithEnglish(lang_name);

        if (name_with_english) {
            $(this).text(name_with_english);
        }
    });

    // translations count in news posts
    const translations_label = $('.news .meta dt.translations');
    if (translations_label.length) {
        translations_label.html(`Translations <b>(${$('.news .meta .translations .languages li').length})</b>:`);
    }

})(jQuery);
