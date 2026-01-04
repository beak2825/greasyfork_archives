// ==UserScript==
// @name         Itsnotlupus' I18N Support
// @namespace    Itsnotlupus Industries
// @version      1.2.2
// @description  no budget? no translators? no problem.
// @author       Itsnotlupus
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

/*jshint esversion: 11 */

/* There are 2 kind of localized strings you'll find in userscripts:
 * 1. strings found in the original web page.
 * 2. strings used by the userscript itself.
 *
 * To get the former translated, you will need to hook into the web app and somehow get a hold of the proper localized strings.
 *
 * For the latter, you can rely on this library to ask Google Translate for some machine-translated strings.  
 * It's not going to be flawless, but it should generally be close enough.  
 * API results are cached locally to keep things friendly with Google.
 *
 * Pass an array for strings found in the original page, and an object mapping ids to strings for your userscript strings.
 *
 * Usage pattern:
 *
 * await i18n.init({
 *    stringsArray: [ <Array of english app strings> ],
 *    stringsObject: { <Object mapping ids to english script settings> },
 *    strings: <either of the above values>,
 *    lang: "<language code ('en','fr','es', etc.)>",
 *    callback: async (stringsArray) => return {<Object mapping english app strings to localized app strings>}
 * });
 *
 * All of the object values are optional. `document.documentElement.lang` will be used as value for `lang` by default.
 * The callback function can be asynchronous and will be awaited correctly.
 * Only pass a callback if you pass an array of string, as it's useless otherwise.  
 * Note that the .init() method is asynchronous and must be awaited before you can start using t`string`.
 *
 * Afterward, you can use t`<english app string>` or t`<script id>` to get a localized string.
 *
 * ( setEnStrings, setLanguage and initLanguage are kept around for backward whateverability, but probably don't use them. )
 *
 * MISSING: templating, pluralization, or really anything difficult. this is just a cheap stop-gap.
 */
 
class I18N {
    constructor() {
        this.translations = GM_getValue("translations", {});
    }
    
    setEnStrings(enStringsArray = [], enStringsObject = {}) {
        this.enStringsArray = enStringsArray;
        this.enStringsObject = enStringsObject;
        this.i18n = { 'en': Object.assign(this.enStringsArray.reduce((o, v) => (o[v]=v,o), {}), this.enStringsObject) };
    }
    
    async setLanguage(lang = document.documentElement.lang, callback = ()=>{}) {
        this.lang = lang;
        if (lang !== 'en') {
            this.i18n[lang] = await callback(this.enStringsArray) ?? {};
             
            return Promise.all(Object.keys(this.i18n.en).filter(k=>!this.i18n[lang][k]).map(async id => {
                this.i18n[lang][id] = await this.getTranslation(this.i18n.en[id], 'en', lang);
            }));
        }
    }
    
    async initLanguage(lang, callback) { return this.setLanguage(lang, callback); }
    
    // one shot setup rather than using the above methods
    async init({ strings, stringsArray, stringsObject, lang = document.documentElement.lang, callback = ()=>{} }) {
        stringsArray = Array.isArray(strings) ? strings : stringsArray ?? [];
        stringsObject = !Array.isArray(strings) && Object(strings) === strings ? strings : stringsObject ?? {};
        this.setEnStrings(stringsArray, stringsObject);
        return this.setLanguage(lang, callback);
    }
    
    async getTranslation(text, from, to) {
        const key = JSON.stringify({text,from,to});
        let translated = this.translations[key];
        if (!translated) {
          const string = await this._getTranslation(text, from, to);
          if (string) {
            this.translations[key] = string;
            GM_setValue("translations", this.translations);
            translated = string;
          } else {
            translated = text;
          }
        }
        return translated;
    }
    
    _getTranslation(text, from, to) {
        return new Promise((r,e) =>
            GM_xmlhttpRequest({
                method: 'POST',
                url: `https://translate.google.com/translate_a/single?client=at&dt=t&dt=rm&dj=1`,
                data: new URLSearchParams({
                  sl: from,
                  tl: to,
                  q: text
                }),
                responseType: "json",
                onload: v => r(v.response?.sentences.map(s=>s.trans).join('') ?? text),
                onerror: e
              })
            );
    }
    
    translate(s) {
        return this.i18n[this.lang]?.[s] ?? s;
    }
}

const i18n = new I18N();

const t = s => i18n.translate(s);