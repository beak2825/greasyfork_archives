// ==UserScript==
// @name         answer-in-my-language-deepseek
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Add a "answer in my language" prefix to deepseek textarea
// @license      BSD
// @author       Julius Kiesian
// @match        https://chat.deepseek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541603/answer-in-my-language-deepseek.user.js
// @updateURL https://update.greasyfork.org/scripts/541603/answer-in-my-language-deepseek.meta.js
// ==/UserScript==
(function () {
  'use strict';

  const LANGUAGES_LIST = {
    "af": {
      "name": "Afrikaans"
    },
    "af-ZA": {
      "name": "Afrikaans (South Africa)"
    },
    "ar": {
      "name": "Arabic"
    },
    "ar-AE": {
      "name": "Arabic (U.A.E.)"
    },
    "ar-BH": {
      "name": "Arabic (Bahrain)"
    },
    "ar-DZ": {
      "name": "Arabic (Algeria)"
    },
    "ar-EG": {
      "name": "Arabic (Egypt)"
    },
    "ar-IQ": {
      "name": "Arabic (Iraq)"
    },
    "ar-JO": {
      "name": "Arabic (Jordan)"
    },
    "ar-KW": {
      "name": "Arabic (Kuwait)"
    },
    "ar-LB": {
      "name": "Arabic (Lebanon)"
    },
    "ar-LY": {
      "name": "Arabic (Libya)"
    },
    "ar-MA": {
      "name": "Arabic (Morocco)"
    },
    "ar-OM": {
      "name": "Arabic (Oman)"
    },
    "ar-QA": {
      "name": "Arabic (Qatar)"
    },
    "ar-SA": {
      "name": "Arabic (Saudi Arabia)"
    },
    "ar-SY": {
      "name": "Arabic (Syria)"
    },
    "ar-TN": {
      "name": "Arabic (Tunisia)"
    },
    "ar-YE": {
      "name": "Arabic (Yemen)"
    },
    "az": {
      "name": "Azeri (Latin)"
    },
    "az-AZ": {
      "name": "Azeri (Cyrillic) (Azerbaijan)"
    },
    "be": {
      "name": "Belarusian"
    },
    "be-BY": {
      "name": "Belarusian (Belarus)"
    },
    "bg": {
      "name": "Bulgarian"
    },
    "bg-BG": {
      "name": "Bulgarian (Bulgaria)"
    },
    "bs-BA": {
      "name": "Bosnian (Bosnia and Herzegovina)"
    },
    "ca": {
      "name": "Catalan"
    },
    "ca-ES": {
      "name": "Catalan (Spain)"
    },
    "cs": {
      "name": "Czech"
    },
    "cs-CZ": {
      "name": "Czech (Czech Republic)"
    },
    "cy": {
      "name": "Welsh"
    },
    "cy-GB": {
      "name": "Welsh (United Kingdom)"
    },
    "da": {
      "name": "Danish"
    },
    "da-DK": {
      "name": "Danish (Denmark)"
    },
    "de": {
      "name": "German"
    },
    "de-AT": {
      "name": "German (Austria)"
    },
    "de-CH": {
      "name": "German (Switzerland)"
    },
    "de-DE": {
      "name": "German (Germany)"
    },
    "de-LI": {
      "name": "German (Liechtenstein)"
    },
    "de-LU": {
      "name": "German (Luxembourg)"
    },
    "dv": {
      "name": "Divehi"
    },
    "dv-MV": {
      "name": "Divehi (Maldives)"
    },
    "el": {
      "name": "Greek"
    },
    "el-GR": {
      "name": "Greek (Greece)"
    },
    "en": {
      "name": "English"
    },
    "en-AU": {
      "name": "English (Australia)"
    },
    "en-BZ": {
      "name": "English (Belize)"
    },
    "en-CA": {
      "name": "English (Canada)"
    },
    "en-CB": {
      "name": "English (Caribbean)"
    },
    "en-GB": {
      "name": "English (United Kingdom)"
    },
    "en-IE": {
      "name": "English (Ireland)"
    },
    "en-JM": {
      "name": "English (Jamaica)"
    },
    "en-NZ": {
      "name": "English (New Zealand)"
    },
    "en-PH": {
      "name": "English (Republic of the Philippines)"
    },
    "en-TT": {
      "name": "English (Trinidad and Tobago)"
    },
    "en-US": {
      "name": "English (United States)"
    },
    "en-ZA": {
      "name": "English (South Africa)"
    },
    "en-ZW": {
      "name": "English (Zimbabwe)"
    },
    "eo": {
      "name": "Esperanto"
    },
    "es": {
      "name": "Spanish"
    },
    "es-AR": {
      "name": "Spanish (Argentina)"
    },
    "es-BO": {
      "name": "Spanish (Bolivia)"
    },
    "es-CL": {
      "name": "Spanish (Chile)"
    },
    "es-CO": {
      "name": "Spanish (Colombia)"
    },
    "es-CR": {
      "name": "Spanish (Costa Rica)"
    },
    "es-DO": {
      "name": "Spanish (Dominican Republic)"
    },
    "es-EC": {
      "name": "Spanish (Ecuador)"
    },
    "es-ES": {
      "name": "Spanish (Spain)"
    },
    "es-GT": {
      "name": "Spanish (Guatemala)"
    },
    "es-HN": {
      "name": "Spanish (Honduras)"
    },
    "es-MX": {
      "name": "Spanish (Mexico)"
    },
    "es-NI": {
      "name": "Spanish (Nicaragua)"
    },
    "es-PA": {
      "name": "Spanish (Panama)"
    },
    "es-PE": {
      "name": "Spanish (Peru)"
    },
    "es-PR": {
      "name": "Spanish (Puerto Rico)"
    },
    "es-PY": {
      "name": "Spanish (Paraguay)"
    },
    "es-SV": {
      "name": "Spanish (El Salvador)"
    },
    "es-UY": {
      "name": "Spanish (Uruguay)"
    },
    "es-VE": {
      "name": "Spanish (Venezuela)"
    },
    "et": {
      "name": "Estonian"
    },
    "et-EE": {
      "name": "Estonian (Estonia)"
    },
    "eu": {
      "name": "Basque"
    },
    "eu-ES": {
      "name": "Basque (Spain)"
    },
    "fa": {
      "name": "Farsi"
    },
    "fa-IR": {
      "name": "Farsi (Iran)"
    },
    "fi": {
      "name": "Finnish"
    },
    "fi-FI": {
      "name": "Finnish (Finland)"
    },
    "fo": {
      "name": "Faroese"
    },
    "fo-FO": {
      "name": "Faroese (Faroe Islands)"
    },
    "fr": {
      "name": "French"
    },
    "fr-BE": {
      "name": "French (Belgium)"
    },
    "fr-CA": {
      "name": "French (Canada)"
    },
    "fr-CH": {
      "name": "French (Switzerland)"
    },
    "fr-FR": {
      "name": "French (France)"
    },
    "fr-LU": {
      "name": "French (Luxembourg)"
    },
    "fr-MC": {
      "name": "French (Principality of Monaco)"
    },
    "gl": {
      "name": "Galician"
    },
    "gl-ES": {
      "name": "Galician (Spain)"
    },
    "gu": {
      "name": "Gujarati"
    },
    "gu-IN": {
      "name": "Gujarati (India)"
    },
    "he": {
      "name": "Hebrew"
    },
    "he-IL": {
      "name": "Hebrew (Israel)"
    },
    "hi": {
      "name": "Hindi"
    },
    "hi-IN": {
      "name": "Hindi (India)"
    },
    "hr": {
      "name": "Croatian"
    },
    "hr-BA": {
      "name": "Croatian (Bosnia and Herzegovina)"
    },
    "hr-HR": {
      "name": "Croatian (Croatia)"
    },
    "hu": {
      "name": "Hungarian"
    },
    "hu-HU": {
      "name": "Hungarian (Hungary)"
    },
    "hy": {
      "name": "Armenian"
    },
    "hy-AM": {
      "name": "Armenian (Armenia)"
    },
    "id": {
      "name": "Indonesian"
    },
    "id-ID": {
      "name": "Indonesian (Indonesia)"
    },
    "is": {
      "name": "Icelandic"
    },
    "is-IS": {
      "name": "Icelandic (Iceland)"
    },
    "it": {
      "name": "Italian"
    },
    "it-CH": {
      "name": "Italian (Switzerland)"
    },
    "it-IT": {
      "name": "Italian (Italy)"
    },
    "ja": {
      "name": "Japanese"
    },
    "ja-JP": {
      "name": "Japanese (Japan)"
    },
    "ka": {
      "name": "Georgian"
    },
    "ka-GE": {
      "name": "Georgian (Georgia)"
    },
    "kk": {
      "name": "Kazakh"
    },
    "kk-KZ": {
      "name": "Kazakh (Kazakhstan)"
    },
    "kn": {
      "name": "Kannada"
    },
    "kn-IN": {
      "name": "Kannada (India)"
    },
    "ko": {
      "name": "Korean"
    },
    "ko-KR": {
      "name": "Korean (Korea)"
    },
    "kok": {
      "name": "Konkani"
    },
    "kok-IN": {
      "name": "Konkani (India)"
    },
    "ky": {
      "name": "Kyrgyz"
    },
    "ky-KG": {
      "name": "Kyrgyz (Kyrgyzstan)"
    },
    "lt": {
      "name": "Lithuanian"
    },
    "lt-LT": {
      "name": "Lithuanian (Lithuania)"
    },
    "lv": {
      "name": "Latvian"
    },
    "lv-LV": {
      "name": "Latvian (Latvia)"
    },
    "mi": {
      "name": "Maori"
    },
    "mi-NZ": {
      "name": "Maori (New Zealand)"
    },
    "mk": {
      "name": "FYRO Macedonian"
    },
    "mk-MK": {
      "name": "FYRO Macedonian (Former Yugoslav Republic of Macedonia)"
    },
    "mn": {
      "name": "Mongolian"
    },
    "mn-MN": {
      "name": "Mongolian (Mongolia)"
    },
    "mr": {
      "name": "Marathi"
    },
    "mr-IN": {
      "name": "Marathi (India)"
    },
    "ms": {
      "name": "Malay"
    },
    "ms-BN": {
      "name": "Malay (Brunei Darussalam)"
    },
    "ms-MY": {
      "name": "Malay (Malaysia)"
    },
    "mt": {
      "name": "Maltese"
    },
    "mt-MT": {
      "name": "Maltese (Malta)"
    },
    "nb": {
      "name": "Norwegian (Bokm?l)"
    },
    "nb-NO": {
      "name": "Norwegian (Bokm?l) (Norway)"
    },
    "nl": {
      "name": "Dutch"
    },
    "nl-BE": {
      "name": "Dutch (Belgium)"
    },
    "nl-NL": {
      "name": "Dutch (Netherlands)"
    },
    "nn-NO": {
      "name": "Norwegian (Nynorsk) (Norway)"
    },
    "ns": {
      "name": "Northern Sotho"
    },
    "ns-ZA": {
      "name": "Northern Sotho (South Africa)"
    },
    "pa": {
      "name": "Punjabi"
    },
    "pa-IN": {
      "name": "Punjabi (India)"
    },
    "pl": {
      "name": "Polish"
    },
    "pl-PL": {
      "name": "Polish (Poland)"
    },
    "ps": {
      "name": "Pashto"
    },
    "ps-AR": {
      "name": "Pashto (Afghanistan)"
    },
    "pt": {
      "name": "Portuguese"
    },
    "pt-BR": {
      "name": "Portuguese (Brazil)"
    },
    "pt-PT": {
      "name": "Portuguese (Portugal)"
    },
    "qu": {
      "name": "Quechua"
    },
    "qu-BO": {
      "name": "Quechua (Bolivia)"
    },
    "qu-EC": {
      "name": "Quechua (Ecuador)"
    },
    "qu-PE": {
      "name": "Quechua (Peru)"
    },
    "ro": {
      "name": "Romanian"
    },
    "ro-RO": {
      "name": "Romanian (Romania)"
    },
    "ru": {
      "name": "Russian"
    },
    "ru-RU": {
      "name": "Russian (Russia)"
    },
    "sa": {
      "name": "Sanskrit"
    },
    "sa-IN": {
      "name": "Sanskrit (India)"
    },
    "se": {
      "name": "Sami (Northern)"
    },
    "se-FI": {
      "name": "Sami (Inari) (Finland)"
    },
    "se-NO": {
      "name": "Sami (Southern) (Norway)"
    },
    "se-SE": {
      "name": "Sami (Southern) (Sweden)"
    },
    "sk": {
      "name": "Slovak"
    },
    "sk-SK": {
      "name": "Slovak (Slovakia)"
    },
    "sl": {
      "name": "Slovenian"
    },
    "sl-SI": {
      "name": "Slovenian (Slovenia)"
    },
    "sq": {
      "name": "Albanian"
    },
    "sq-AL": {
      "name": "Albanian (Albania)"
    },
    "sr-BA": {
      "name": "Serbian (Cyrillic) (Bosnia and Herzegovina)"
    },
    "sr-SP": {
      "name": "Serbian (Cyrillic) (Serbia and Montenegro)"
    },
    "sv": {
      "name": "Swedish"
    },
    "sv-FI": {
      "name": "Swedish (Finland)"
    },
    "sv-SE": {
      "name": "Swedish (Sweden)"
    },
    "sw": {
      "name": "Swahili"
    },
    "sw-KE": {
      "name": "Swahili (Kenya)"
    },
    "syr": {
      "name": "Syriac"
    },
    "syr-SY": {
      "name": "Syriac (Syria)"
    },
    "ta": {
      "name": "Tamil"
    },
    "ta-IN": {
      "name": "Tamil (India)"
    },
    "te": {
      "name": "Telugu"
    },
    "te-IN": {
      "name": "Telugu (India)"
    },
    "th": {
      "name": "Thai"
    },
    "th-TH": {
      "name": "Thai (Thailand)"
    },
    "tl": {
      "name": "Tagalog"
    },
    "tl-PH": {
      "name": "Tagalog (Philippines)"
    },
    "tn": {
      "name": "Tswana"
    },
    "tn-ZA": {
      "name": "Tswana (South Africa)"
    },
    "tr": {
      "name": "Turkish"
    },
    "tr-TR": {
      "name": "Turkish (Turkey)"
    },
    "tt": {
      "name": "Tatar"
    },
    "tt-RU": {
      "name": "Tatar (Russia)"
    },
    "ts": {
      "name": "Tsonga"
    },
    "uk": {
      "name": "Ukrainian"
    },
    "uk-UA": {
      "name": "Ukrainian (Ukraine)"
    },
    "ur": {
      "name": "Urdu"
    },
    "ur-PK": {
      "name": "Urdu (Islamic Republic of Pakistan)"
    },
    "uz": {
      "name": "Uzbek (Latin)"
    },
    "uz-UZ": {
      "name": "Uzbek (Cyrillic) (Uzbekistan)"
    },
    "vi": {
      "name": "Vietnamese"
    },
    "vi-VN": {
      "name": "Vietnamese (Viet Nam)"
    },
    "xh": {
      "name": "Xhosa"
    },
    "xh-ZA": {
      "name": "Xhosa (South Africa)"
    },
    "zh": {
      "name": "Chinese"
    },
    "zh-CN": {
      "name": "Chinese (S)"
    },
    "zh-HK": {
      "name": "Chinese (Hong Kong)"
    },
    "zh-MO": {
      "name": "Chinese (Macau)"
    },
    "zh-SG": {
      "name": "Chinese (Singapore)"
    },
    "zh-TW": {
      "name": "Chinese (T)"
    },
    "zu": {
      "name": "Zulu"
    },
    "zu-ZA": {
      "name": "Zulu (South Africa)"
    }
  }

  class ISO6391 {
    static getLanguages(codes = []) {
      return codes.map(code => ({
        code,
        name: ISO6391.getName(code),
      }));
    }

    static getName(code) {
      return ISO6391.validate(code) ? LANGUAGES_LIST[code].name : '';
    }

    static getAllNames() {
      return Object.values(LANGUAGES_LIST).map(l => l.name);
    }


    static getCode(name) {
      const code = Object.keys(LANGUAGES_LIST).find(code => {
        const language = LANGUAGES_LIST[code];

        return (
          language.name.toLowerCase() === name.toLowerCase()
          // || language.nativeName.toLowerCase() === name.toLowerCase()
        );
      });
      return code || '';
    }

    static getAllCodes() {
      return Object.keys(LANGUAGES_LIST);
    }

    static validate(code) {
      return LANGUAGES_LIST.hasOwnProperty(code);
    }
  }


  function krijgHuidigeTaal() {
    var taal = navigator.language || navigator.userLanguage;
    return taal;
  }

  // Roep de functie aan en toon de huidige taal in de console
  const huidigeTaalCode = krijgHuidigeTaal();
  const huidegeTaal = ISO6391.getName(huidigeTaalCode)
  console.log("De huidige taal van de gebruiker is: " + huidigeTaalCode);

  function replaceText(textarea) {
    const currentValue = textarea.value
    // console.log("replacing text...");
    if (currentValue.length < 5) {
      textarea.value = `You are a helpful assistent with  with excellent problem solving skills and logical thinking. You speak ${huidegeTaal} natively and answer me always in ${huidegeTaal}. before answering the question, first generate a title for your answer in ${huidegeTaal}, then in the first paragraph of your answer, translate the question in good ${huidegeTaal}. \n${currentValue}`;
    } else {
      // console.log("nothing to do...");
    }
  }
  let textarea;
  const callback = function () {
    replaceText(textarea);
  };
  function mijnFunctie() {
    console.log("Looking for textarea");
    // Plaats hier je JavaScript-code die je wilt uitvoeren
    textarea = document.getElementById('chat-input');
    if (!textarea) {
      console.error("No textarea found");
      return;
    }
    console.log("Found textarea with id: " + textarea.id + " , adding event listener...");
    // Voeg een event listener toe voor het 'input'-event
    textarea.addEventListener('input',
      // Deze functie wordt uitgevoerd telkens wanneer de inhoud van de textarea verandert.
      // Hier kun je de waarde van de textarea ophalen en bewerken zoals nodig.
      callback
    );
  }
  setInterval(mijnFunctie, 1500);

  // Gebruik het "load" evenement om de functie aan te roepen wanneer de pagina is geladen
  // window.addEventListener("load", mijnFunctie);


})();


