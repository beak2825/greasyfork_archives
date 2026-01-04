// ==UserScript==
// @name         Waze Translate
// @namespace    https://github.com/SaiCode-DEV
// @version      0.03
// @description  Auto Translate using DeepL or LibreTranslate API for Waze Map Editor (WME)
// @author       SaiCode
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/498953/Waze%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/498953/Waze%20Translate.meta.js
// ==/UserScript==

/* global I18n, $ */

(() => {
  "use strict";

  /**
   * Load the translation library
   */
  function loadTranslationLib() {
    if (unsafeWindow.Translate) return;
    function Cache() {
      let e = Object.create(null);
      function a(a) {
        delete e[a];
      }
      (this.set = function(n, i, r) {
        if (void 0 !== r && (typeof r !== "number" || isNaN(r) || r <= 0)) throw new Error("Cache timeout must be a positive number");
        const t = e[n];
        t && clearTimeout(t.timeout);
        const o = { value: i, expire: r + Date.now() };
        return (
          isNaN(o.expire) || (o.timeout = setTimeout(() => a(n), r)),
          (e[n] = o),
          i
        );
      }),
      (this.del = function(n) {
        let i = !0;
        const r = e[n];
        return (
          r
            ? (clearTimeout(r.timeout),
            !isNaN(r.expire) && r.expire < Date.now() && (i = !1))
            : (i = !1),
          i && a(n),
          i
        );
      }),
      (this.clear = function() {
        for (const a in e) clearTimeout(e[a].timeout);
        e = Object.create(null);
      }),
      (this.get = function(a) {
        const n = e[a];
        if (void 0 !== n) {
          if (isNaN(n.expire) || n.expire >= Date.now()) return n.value;
          delete e[a];
        }
        return null;
      });
    }
    const cache = new Cache();
    cache.Cache = Cache;
    const googleUrl = "https://translate.googleapis.com/translate_a/single";
    const libreUrl = "https://libretranslate.com/translate";
    const google = {
      fetch: ({
        key, from, to, text,
      }) => [
        `${googleUrl}?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURI(text)}`,
      ],
      parse: res => res.json().then(body => {
        if (
          !(body = body
              && body[0]
              && body[0][0]
              && body[0].map(e => e[0]).join(""))
        ) throw new Error("Translation not found");
        return body;
      }),
    };
    const yandex = {
      needkey: !0,
      fetch: ({
        key: e, from, to, text,
      }) => [
        `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${e}&lang=${from}-${to}&text=${encodeURIComponent(
          text,
        )}`,
        { method: "POST", body: "" },
      ],
      parse: res => res.json().then(body => {
        if (body.code !== 200) throw new Error(body.message);
        return body.text[0];
      }),
    };
    const libre = {
      needkey: !1,
      fetch: ({
        url: e = libreUrl, key, from, to, text,
      }) => [
        e,
        {
          method: "POST",
          body: JSON.stringify({
            q: text,
            source: from,
            target: to,
            api_key: key,
          }),
          headers: { "Content-Type": "application/json" },
        },
      ],
      parse: res => res.json().then(body => {
        if (!body) throw new Error("No response found");
        if (body.error) throw new Error(body.error);
        if (!body.translatedText) throw new Error("No response found");
        return body.translatedText;
      }),
    };
    const deepl = {
      needkey: !0,
      fetch: ({
        key, from, to, text,
      }) => [
        `https://api${
          key.endsWith(":fx") ? "-free" : ""
        }.deepl.com/v2/translate?auth_key=${key}&source_lang=${from}&target_lang=${to}&text=${(text = encodeURIComponent(text))}`,
        { method: "POST", body: "" },
      ],
      parse: async res => {
        if (!res.ok) {
          if (res.status === 403) throw new Error("Auth Error, please review the key for DeepL");
          throw new Error(`Error ${res.status}`);
        }
        return res.json().then(e => e.translations[0].text);
      },
    };
    const engines = {
      google,
      yandex,
      libre,
      deepl,
    };
    const iso = {
      aar: "aa",
      abk: "ab",
      afr: "af",
      aka: "ak",
      alb: "sq",
      amh: "am",
      ara: "ar",
      arg: "an",
      arm: "hy",
      asm: "as",
      ava: "av",
      ave: "ae",
      aym: "ay",
      aze: "az",
      bak: "ba",
      bam: "bm",
      baq: "eu",
      bel: "be",
      ben: "bn",
      bih: "bh",
      bis: "bi",
      bos: "bs",
      bre: "br",
      bul: "bg",
      bur: "my",
      cat: "ca",
      cha: "ch",
      che: "ce",
      chi: "zh",
      chu: "cu",
      chv: "cv",
      cor: "kw",
      cos: "co",
      cre: "cr",
      cze: "cs",
      dan: "da",
      div: "dv",
      dut: "nl",
      dzo: "dz",
      eng: "en",
      epo: "eo",
      est: "et",
      ewe: "ee",
      fao: "fo",
      fij: "fj",
      fin: "fi",
      fre: "fr",
      fry: "fy",
      ful: "ff",
      geo: "ka",
      ger: "de",
      gla: "gd",
      gle: "ga",
      glg: "gl",
      glv: "gv",
      gre: "el",
      grn: "gn",
      guj: "gu",
      hat: "ht",
      hau: "ha",
      heb: "he",
      her: "hz",
      hin: "hi",
      hmo: "ho",
      hrv: "hr",
      hun: "hu",
      ibo: "ig",
      ice: "is",
      ido: "io",
      iii: "ii",
      iku: "iu",
      ile: "ie",
      ina: "ia",
      ind: "id",
      ipk: "ik",
      ita: "it",
      jav: "jv",
      jpn: "ja",
      kal: "kl",
      kan: "kn",
      kas: "ks",
      kau: "kr",
      kaz: "kk",
      khm: "km",
      kik: "ki",
      kin: "rw",
      kir: "ky",
      kom: "kv",
      kon: "kg",
      kor: "ko",
      kua: "kj",
      kur: "ku",
      lao: "lo",
      lat: "la",
      lav: "lv",
      lim: "li",
      lin: "ln",
      lit: "lt",
      ltz: "lb",
      lub: "lu",
      lug: "lg",
      mac: "mk",
      mah: "mh",
      mal: "ml",
      mao: "mi",
      mar: "mr",
      may: "ms",
      mlg: "mg",
      mlt: "mt",
      mon: "mn",
      nau: "na",
      nav: "nv",
      nbl: "nr",
      nde: "nd",
      ndo: "ng",
      nep: "ne",
      nno: "nn",
      nob: "nb",
      nor: "no",
      nya: "ny",
      oci: "oc",
      oji: "oj",
      ori: "or",
      orm: "om",
      oss: "os",
      pan: "pa",
      per: "fa",
      pli: "pi",
      pol: "pl",
      por: "pt",
      pus: "ps",
      que: "qu",
      roh: "rm",
      rum: "ro",
      run: "rn",
      rus: "ru",
      sag: "sg",
      san: "sa",
      sin: "si",
      slo: "sk",
      slv: "sl",
      sme: "se",
      smo: "sm",
      sna: "sn",
      snd: "sd",
      som: "so",
      sot: "st",
      spa: "es",
      srd: "sc",
      srp: "sr",
      ssw: "ss",
      sun: "su",
      swa: "sw",
      swe: "sv",
      tah: "ty",
      tam: "ta",
      tat: "tt",
      tel: "te",
      tgk: "tg",
      tgl: "tl",
      tha: "th",
      tib: "bo",
      tir: "ti",
      ton: "to",
      tsn: "tn",
      tso: "ts",
      tuk: "tk",
      tur: "tr",
      twi: "tw",
      uig: "ug",
      ukr: "uk",
      urd: "ur",
      uzb: "uz",
      ven: "ve",
      vie: "vi",
      vol: "vo",
      wel: "cy",
      wln: "wa",
      wol: "wo",
      xho: "xh",
      yid: "yi",
      yor: "yo",
      zha: "za",
      zul: "zu",
    };
    const names = {
      afar: "aa",
      abkhazian: "ab",
      afrikaans: "af",
      akan: "ak",
      albanian: "sq",
      amharic: "am",
      arabic: "ar",
      aragonese: "an",
      armenian: "hy",
      assamese: "as",
      avaric: "av",
      avestan: "ae",
      aymara: "ay",
      azerbaijani: "az",
      bashkir: "ba",
      bambara: "bm",
      basque: "eu",
      belarusian: "be",
      bengali: "bn",
      "bihari languages": "bh",
      bislama: "bi",
      tibetan: "bo",
      bosnian: "bs",
      breton: "br",
      bulgarian: "bg",
      burmese: "my",
      catalan: "ca",
      valencian: "ca",
      czech: "cs",
      chamorro: "ch",
      chechen: "ce",
      chinese: "zh",
      "church slavic": "cu",
      "old slavonic": "cu",
      "church slavonic": "cu",
      "old bulgarian": "cu",
      "old church slavonic": "cu",
      chuvash: "cv",
      cornish: "kw",
      corsican: "co",
      cree: "cr",
      welsh: "cy",
      danish: "da",
      german: "de",
      divehi: "dv",
      dhivehi: "dv",
      maldivian: "dv",
      dutch: "nl",
      flemish: "nl",
      dzongkha: "dz",
      greek: "el",
      english: "en",
      esperanto: "eo",
      estonian: "et",
      ewe: "ee",
      faroese: "fo",
      persian: "fa",
      fijian: "fj",
      finnish: "fi",
      french: "fr",
      "western frisian": "fy",
      fulah: "ff",
      georgian: "ka",
      gaelic: "gd",
      "scottish gaelic": "gd",
      irish: "ga",
      galician: "gl",
      manx: "gv",
      guarani: "gn",
      gujarati: "gu",
      haitian: "ht",
      "haitian creole": "ht",
      hausa: "ha",
      hebrew: "he",
      herero: "hz",
      hindi: "hi",
      "hiri motu": "ho",
      croatian: "hr",
      hungarian: "hu",
      igbo: "ig",
      icelandic: "is",
      ido: "io",
      "sichuan yi": "ii",
      nuosu: "ii",
      inuktitut: "iu",
      interlingue: "ie",
      occidental: "ie",
      interlingua: "ia",
      indonesian: "id",
      inupiaq: "ik",
      italian: "it",
      javanese: "jv",
      japanese: "ja",
      kalaallisut: "kl",
      greenlandic: "kl",
      kannada: "kn",
      kashmiri: "ks",
      kanuri: "kr",
      kazakh: "kk",
      "central khmer": "km",
      kikuyu: "ki",
      gikuyu: "ki",
      kinyarwanda: "rw",
      kirghiz: "ky",
      kyrgyz: "ky",
      komi: "kv",
      kongo: "kg",
      korean: "ko",
      kuanyama: "kj",
      kwanyama: "kj",
      kurdish: "ku",
      lao: "lo",
      latin: "la",
      latvian: "lv",
      limburgan: "li",
      limburger: "li",
      limburgish: "li",
      lingala: "ln",
      lithuanian: "lt",
      luxembourgish: "lb",
      letzeburgesch: "lb",
      "luba-katanga": "lu",
      ganda: "lg",
      macedonian: "mk",
      marshallese: "mh",
      malayalam: "ml",
      maori: "mi",
      marathi: "mr",
      malay: "ms",
      malagasy: "mg",
      maltese: "mt",
      mongolian: "mn",
      nauru: "na",
      navajo: "nv",
      navaho: "nv",
      "ndebele, south": "nr",
      "south ndebele": "nr",
      "ndebele, north": "nd",
      "north ndebele": "nd",
      ndonga: "ng",
      nepali: "ne",
      "norwegian nynorsk": "nn",
      "nynorsk, norwegian": "nn",
      "norwegian bokmål": "nb",
      "bokmål, norwegian": "nb",
      norwegian: "no",
      chichewa: "ny",
      chewa: "ny",
      nyanja: "ny",
      occitan: "oc",
      ojibwa: "oj",
      oriya: "or",
      oromo: "om",
      ossetian: "os",
      ossetic: "os",
      panjabi: "pa",
      punjabi: "pa",
      pali: "pi",
      polish: "pl",
      portuguese: "pt",
      pushto: "ps",
      pashto: "ps",
      quechua: "qu",
      romansh: "rm",
      romanian: "ro",
      moldavian: "ro",
      moldovan: "ro",
      rundi: "rn",
      russian: "ru",
      sango: "sg",
      sanskrit: "sa",
      sinhala: "si",
      sinhalese: "si",
      slovak: "sk",
      slovenian: "sl",
      "northern sami": "se",
      samoan: "sm",
      shona: "sn",
      sindhi: "sd",
      somali: "so",
      "sotho, southern": "st",
      spanish: "es",
      castilian: "es",
      sardinian: "sc",
      serbian: "sr",
      swati: "ss",
      sundanese: "su",
      swahili: "sw",
      swedish: "sv",
      tahitian: "ty",
      tamil: "ta",
      tatar: "tt",
      telugu: "te",
      tajik: "tg",
      tagalog: "tl",
      thai: "th",
      tigrinya: "ti",
      tonga: "to",
      tswana: "tn",
      tsonga: "ts",
      turkmen: "tk",
      turkish: "tr",
      twi: "tw",
      uighur: "ug",
      uyghur: "ug",
      ukrainian: "uk",
      urdu: "ur",
      uzbek: "uz",
      venda: "ve",
      vietnamese: "vi",
      volapük: "vo",
      walloon: "wa",
      wolof: "wo",
      xhosa: "xh",
      yiddish: "yi",
      yoruba: "yo",
      zhuang: "za",
      chuang: "za",
      zulu: "zu",
    };
    const isoKeys = Object.values(iso).sort();
    const languages = e => {
      if (typeof e !== "string") throw new Error(`The "language" must be a string, received ${typeof e}`);
      if (e.length > 100) throw new Error(`The "language" is too long at ${e.length} characters`);
      if (
        ((e = e.toLowerCase()),
        (e = names[e] || iso[e] || e),
        !isoKeys.includes(e))
      ) throw new Error(`The language "${e}" is not part of the ISO 639-1`);
      return e;
    };
    const Translate = function(e = {}) {
      if (!(this instanceof Translate)) return new Translate(e);
      const defaults = {
        from: "en",
        to: "en",
        cache: void 0,
        engine: "google",
        key: void 0,
        url: void 0,
        languages,
        engines,
        keys: {},
      };
      const translate = async(text, opts = {}) => {
        typeof opts === "string" && (opts = { to: opts });
        const invalidKey = Object.keys(opts).find(
          e => e !== "from" && e !== "to",
        );

        if (invalidKey) {
          throw new Error(`Invalid option with the name '${invalidKey}'`);
        }

        opts.text = text;
        opts.from = languages(opts.from || translate.from);
        opts.to = languages(opts.to || translate.to);
        opts.cache = translate.cache;
        opts.engine = translate.engine;
        opts.url = translate.url;
        opts.id = `${opts.url}:${opts.from}:${opts.to}:${opts.engine}:${opts.text}`;
        opts.keys = translate.keys || {};

        for (const name in translate.keys) {
          opts.keys[name] = opts.keys[name] || translate.keys[name];
        }
        opts.key = opts.key || translate.key || opts.keys[opts.engine];

        const engine = translate.engines[opts.engine];

        const cached = cache.get(opts.id);
        if (cached) return Promise.resolve(cached);

        // Target is the same as origin, just return the string
        if (opts.to === opts.from) return Promise.resolve(opts.text);

        if (engine.needkey && !opts.key) {
          throw new Error(
            `The engine "${opts.engine}" needs a key, please provide it`,
          );
        }
        const fetchOpts = engine.fetch(opts);
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: fetchOpts[1].method || "GET",
            url: fetchOpts[0],
            headers: fetchOpts[1].headers || {},
            data: fetchOpts[1].body || "",
            responseType: "json",
            onload(response) {
              console.log(response);
              const result = engine.parse(response.responseText);
              result.then(translated => {
                cache.set(opts.id, translated, opts.cache);
                resolve(translated);
              });
            },
            onerror(error) {
              reject(error);
            },
          });
        });
        return fetch(...fetchOpts)
          .then(engine.parse)
          .then(translated => cache.set(opts.id, translated, opts.cache));
      };
      for (const key in defaults) translate[key] = void 0 === e[key] ? defaults[key] : e[key];
      return translate;
    };

    console.info("Translation library loaded");
    if (!unsafeWindow.Translate) unsafeWindow.Translate = Translate;
    return Translate;
  }

  const Tranlate = loadTranslationLib();

  const lTrans = new Tranlate({
    engine: "libre",
    url: "https://translate.saicloud.de/translate",
  });
  const gTrans = new Tranlate({ engine: "google" });
  // test translation
  gTrans("en", "de", "Hello World").then(console.log);
})();

GM_addStyle(`

`);
