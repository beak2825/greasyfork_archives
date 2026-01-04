/*
 
MIT License
 
Copyright 2023 CY Fung
 
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

================================= Disclaimer =================================

Note: Before installing the "Enable ChatGPT Mobile" userscript, please be aware that the script is solely intended to enable the mobile version of ChatGPT in desktop browsers. While the userscript enhances the functionality of the ChatGPT website, it does not control or guarantee the availability, performance, or specific features of the mobile models implemented by OpenAI.

OpenAI may introduce updates, modifications, or discontinuations to the mobile models or features without prior notice. As a result, the behavior, capabilities, and performance of the mobile models enabled by this userscript may vary and may not meet your specific expectations or requirements.

Please keep in mind that this userscript is an independent implementation designed to enable mobile features. OpenAI is responsible for the original ChatGPT platform, its models, and the overall user experience. Any concerns or feedback regarding the behavior or performance of the mobile models should be directed to OpenAI for further assistance.

By installing and using the "Enable ChatGPT Mobile" userscript, you acknowledge and understand that OpenAI's implementation of mobile models and features is beyond the control of this userscript, and you accept any risks or limitations associated with the functionality provided.

Proceed with the installation of this userscript only if you agree to the terms and conditions mentioned above.

==============================================================================

*/
// ==UserScript==
// @name         Enable ChatGPT Mobile
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @license      MIT
// @author       CY Fung
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        unsafeWindow
// @run-at       document-start

// @description            To enable mobile version of ChatGPT in desktop browsers
// @description:ja         デスクトップブラウザでChatGPTモバイル版を有効にする
// @description:zh-TW      在桌面瀏覽器上啟用ChatGPT行動版
// @description:zh-CN      在桌面浏览器上启用ChatGPT移动版本

// @description:ko         데스크톱 브라우저에서 ChatGPT 모바일 버전 활성화
// @description:ru         Включение мобильной версии ChatGPT в браузерах для компьютера
// @description:af         Aktiveer ChatGPT Mobile op rekenaarblaaier
// @description:az         Masaüstü brauzerlərdə ChatGPT Mobile versiyasını aktivləşdirin
// @description:id         Mengaktifkan versi mobile ChatGPT di browser desktop
// @description:ms         Mengaktifkan versi mudah alih ChatGPT di pelayar desktop
// @description:bs         Aktivirajte mobilnu verziju ChatGPT-a u desktop preglednicima
// @description:ca         Activar la versió mòbil de ChatGPT en navegadors d'escriptori
// @description:cs         Povolení mobilní verze ChatGPT v desktopových prohlížečích
// @description:da         Aktivér mobilversionen af ChatGPT i desktop-browsere
// @description:de         Aktivieren Sie die mobile Version von ChatGPT in Desktop-Browsern
// @description:et         Luba ChatGPT mobiiliversioon töölauabrauserites
// @description:es         Habilitar la versión móvil de ChatGPT en navegadores de escritorio
// @description:eu         Gaitu ChatGPT Mobile-ren bertsioa mahaigaineko nabigatzaileetan
// @description:fr         Activer la version mobile de ChatGPT dans les navigateurs de bureau
// @description:gl         Activar a versión móbil de ChatGPT nos navegadores de escritorio
// @description:hr         Omogućite mobilnu verziju ChatGPT-a u preglednicima za stolna računala
// @description:zu         Vumela ukuqalisa i-versi ye-ChatGPT Mobile kumakhompyutha we-deskithophu
// @description:is         Virkjaðu ChatGPT Mobile-útgáfu í tölvuvafrum
// @description:it         Attiva la versione mobile di ChatGPT nei browser per desktop
// @description:sw         Wezesha toleo la ChatGPT Mobile kwenye vivinjari vya kompyuta
// @description:lv         Iespējot ChatGPT Mobile versiju datora pārlūkprogrammās
// @description:lt         Įgalinkite „ChatGPT Mobile“ versiją darbalaukio naršyklėse
// @description:hu         Engedélyezze a ChatGPT Mobile verziót asztali böngészőkben
// @description:nl         Schakel de mobiele versie van ChatGPT in op desktopbrowsers
// @description:uz         Desktop brauzerlarda ChatGPT Mobile versiyasini yoqish
// @description:pl         Włącz wersję mobilną ChatGPT w przeglądarkach na komputery
// @description:pt         Ative a versão móvel do ChatGPT nos navegadores de desktop
// @description:pt-BR      Ative a versão móvel do ChatGPT em navegadores de desktop
// @description:ro         Activează versiunea mobilă ChatGPT în browserele de pe desktop
// @description:sq         Aktivizo versionin mobile të ChatGPT në shfletuesit e desktopit
// @description:sk         Povoliť mobilnú verziu ChatGPT v desktopových prehliadačoch
// @description:sl         Omogočite mobilno različico ChatGPT v namiznih brskalnikih
// @description:sr         Активирајте мобилну верзију ChatGPT-а у десктоп прегледачима
// @description:fi         Ota käyttöön ChatGPT Mobile -versio työpöytäselaimissa
// @description:sv         Aktivera mobila versionen av ChatGPT i skrivbordswebbläsare
// @description:vi         Kích hoạt phiên bản di động của ChatGPT trên trình duyệt máy tính
// @description:tr         Masaüstü tarayıcılarda ChatGPT Mobile sürümünü etkinleştirin
// @description:be         Уключыць мабільную версію ChatGPT у настольных браўзерах
// @description:bg         Активиране на мобилната версия на ChatGPT в десктоп браузъри
// @description:ky         Стол таракчаларында ChatGPT Mobile версиясын иштетүү
// @description:kk         Столтік шолғыштарда ChatGPT Mobile нұсқасын қосу
// @description:mk         Овозможи мобилна верзија на ChatGPT во десктоп прелистувачи
// @description:mn         Дэскутоп браузерд ChatGPT Mobile ихэвчлэн ашиглах
// @description:uk         Увімкнути мобільну версію ChatGPT у браузерах для робочого столу
// @description:el         Ενεργοποίηση της κινητής έκδοσης του ChatGPT σε προγράμματα περιήγησης επιφάνειας εργασίας
// @description:hy         Միացնել ChatGPT բջջային տարբերակը աշխատանքային ժամանցման զննարկիչներում
// @description:ur         ڈیسک ٹاپ براؤزرز میں چیٹ جی پی ٹی موبائل کو فعال کریں
// @description:ar         تمكين نسخة ChatGPT المحمول في متصفحات سطح المكتب
// @description:fa         فعال کردن نسخه تلفن همراه ChatGPT در مرورگرهای دسکتاپ
// @description:ne         डेस्कटप ब्राउजरहरूमा ChatGPT मोबाइल सक्षम गर्नुहोस्
// @description:mr         डेस्कटॉप ब्राउझरमध्ये ChatGPT मोबाईल सक्षम करा
// @description:hi         डेस्कटॉप ब्राउज़रों में ChatGPT मोबाइल सक्षम करें
// @description:as         ডেক্সটপ ব্ৰাউজাৰত ChatGPT মোবাইল সক্ৰিয় কৰক
// @description:bn         ডেস্কটপ ব্রাউজারে ChatGPT মোবাইল সক্রিয় করুন
// @description:pa         ਡੈਸਕਟਾਪ ਬਰਾ browserਜ਼ਰ 'ਤੇ ਚੈਟਜੀਪੀਟੀ ਮੋਬਾਈਲ ਯੋਗ ਕਰੋ
// @description:gu         ડેસ્કટોપ બ્રાઉઝરમાં ChatGPT મોબાઇલ સક્રિય કરો
// @description:or         ଡେସ୍କଟପ ବ୍ରାଉଜରରେ ChatGPT ମୋବାଇଲ ସକ୍ରିୟ କରନ୍ତୁ
// @description:ta         மேல இணைய உலாவிகளில் ChatGPT மொபைல் பதிப்பை இயக்க
// @description:te         డెస్క్‌టాప్ బ్రౌజర్‌లో ChatGPT మొబైల్ వెర్షన్‌ను ప్రారంభించండి
// @description:kn         ಡೆಸ್ಕ್‌ಟಾಪ್ ಬ್ರೌಸರ್‌ಗಳಲ್ಲಿ ChatGPT ಮೊಬೈಲ್ ಆವೃತ್ತಿಯನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ
// @description:ml         ഡെസ്ക്ടോപ് ബ്രൌസറുകളിൽ ChatGPT മൊബൈൽ പതിപ്പ് പ്രവർത്തനമാക്കുക
// @description:si         ඩෙස්ක්ටොප් බ්‍රවුසර් වල ChatGPT ජංගම අනුවාදය සක්‍රීය කරන්න
// @description:th         เปิดใช้งาน ChatGPT บนมือถือในเบราว์เซอร์เดสก์ท็อป
// @description:lo         ເປີດໃຊ້ ChatGPT ສະບັບມືຖືໃນໂປຣແກຣມທ່ອງເວັບໃນຄອມພິວເຕີ
// @description:my         ဒက်စ်တော့ဘရောင်ဇာများတွင် ChatGPT မိုဘိုင်းဗားရှင်းကို ဖွင့်ရန်
// @description:ka         ჩართეთ ChatGPT Mobile სამუშაო ბრაუზერებში
// @description:am         በዴስክቶፕ ብራውዘሮች ውስጥ ChatGPT ተቀናቃኝ ስሪትን አብረውው
// @description:km         បើក ChatGPT កំណែទូរស័ព្ទលើកម្មវិធីរុករកលើផ្ទៃតុ


// @downloadURL https://update.greasyfork.org/scripts/468921/Enable%20ChatGPT%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/468921/Enable%20ChatGPT%20Mobile.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const REPLACE_DESKTOP_MODELS = false;

  const mzs = [{
    //      category: "other",
    desktop: "text-davinci-002-render-sha",
    mobile: "text-davinci-002-render-sha-mobile",
    human_category_name_mobile: "GPT-3.5-M"
  }, {
    //      category: "other",
    desktop: "gpt-4",
    mobile: "gpt-4-mobile",
    human_category_name_mobile: "GPT-4-M"
  }];

  const gptModels = {}
  for (const mz of mzs) {
    gptModels[mz.mobile] = {
      human_category_name: mz.human_category_name_mobile,
      default_model: mz.mobile
    };
  }

  /** @type {globalThis.Window} */
  const win = typeof unsafeWindow === 'object' ? unsafeWindow : typeof window === 'object' ? window : this;


  /**
   * @typedef Category
   * @type {object}
   * @property {string} category
   * @property {string} human_category_name
   * @property {string} subscription_level
   * @property {string} default_model
   * @property {string} browsing_model
   * @property {string} code_interpreter_model
   * @property {string} plugins_model
   */

  /**
   * @typedef Model
   * @type {object}
   * @property {string} slug
   * @property {number} max_tokens
   * @property {string} title
   * @property {string} description
   * @property {string[]} tags
   * @property {object} capabilities
   */

  /**
   * @typedef JsonRes
   * @type {object}
   * @property {Category[]} categories
   * @property {Model[]} models
   */


  /**
   * @param {Model} model
   */
  function fixTitle(model) {

    if (model.slug === "text-davinci-002-render-sha") {
      model.title = /\bdefault\b/i.test(model.title) ? "Default (GPT-3.5)" : "GPT-3.5";
    } else if (model.slug === "text-davinci-002-render-sha-mobile") {
      model.title = /\bdefault\b/i.test(model.title) ? "Default (GPT-3.5) (Mobile)" : "GPT-3.5 (Mobile)";
    } else if (model.slug === "gpt-4") {
      model.title = /\bdefault\b/i.test(model.title) ? "Default (GPT-4)" : "GPT-4";
    } else if (model.slug === "gpt-4-mobile") {
      model.title = /\bdefault\b/i.test(model.title) ? "Default (GPT-4) (Mobile)" : "GPT-4 (Mobile)";
    }

    let suffix = `[${model.tags.join(', ')}]`;
    if (model.description.indexOf(suffix) < 0) model.description = `${model.description} ${suffix}`;

  }

  ((Response) => {

    Response.prototype.__json7942__ = Response.prototype.json;
    Response.prototype.json = function () {

      /** @type {globalThis.Response} */
      const __this__ = this;
      /** @type {Promise<any>} */
      let jsonPromise = __this__.__json7942__.apply(__this__, arguments);

      jsonPromise = jsonPromise.then(__jsonRes__ => {

        if (typeof (__jsonRes__ || 0).browsing === 'boolean' && typeof (__jsonRes__ || 0).code_interpreter === 'boolean' && typeof (__jsonRes__ || 0).plugins === 'boolean') {
          __jsonRes__.browsing = true;
          __jsonRes__.code_interpreter = true;
          __jsonRes__.plugins = true;
        }


        if (typeof (__jsonRes__ || 0).message_cap === 'number') {

          if (__jsonRes__.message_cap < 9999) {
            __jsonRes__.message_cap = 9999;
          }
        }

        if (typeof ((((__jsonRes__ || 0).accounts || 0).default || 0).features || 0) == 'object') {

          let features = __jsonRes__.accounts.default.features;

          let extraFeatures = [
            "model_preview",
            "browsing_available",
            "model_switcher",
            "plugins_available",
            "beta_features"
          ];

          for (const s of extraFeatures) {
            if (features.indexOf(s) < 0) features.push(s);
          }

        }

        if (((__jsonRes__ || 0).categories || 0).length >= 1 && ((__jsonRes__ || 0).models || 0).length >= 1) {


          try {
            /** @type {JsonRes} */
            const jsonRes = __jsonRes__;

            const categories = [...jsonRes.categories];
            let add_gpt_4_mobile = false;
            let add_gpt_3_mobile = false;

            /** @type {Map<string, Category>} */
            const default_models = new Map();
            for (const cat of categories) {
              default_models.set(`${cat.default_model}`, cat);
            }

            /** @type {Map<string, Model>} */
            const availableModels = new Map();
            for (const model of jsonRes.models) {
              availableModels.set(`${model.slug}`, model);
              fixTitle(model);
            }

            const b = (d, m) => (default_models.has(d) && !default_models.has(m) && availableModels.has(d) && availableModels.has(m));

            let gpt3 = mzs[0];
            let gpt4 = mzs[1];
            if (b(gpt3.desktop, gpt3.mobile)) add_gpt_3_mobile = true;
            if (b(gpt4.desktop, gpt4.mobile)) add_gpt_4_mobile = true;

            if (add_gpt_3_mobile) {
              REPLACE_DESKTOP_MODELS
                ? Object.assign(default_models.get(gpt3.desktop), gptModels[gpt3.mobile])
                : categories.push(Object.assign({}, default_models.get(gpt3.desktop), gptModels[gpt3.mobile]));
            }
            if (add_gpt_4_mobile) {
              REPLACE_DESKTOP_MODELS
                ? Object.assign(default_models.get(gpt4.desktop), gptModels[gpt4.mobile])
                : categories.push(Object.assign({}, default_models.get(gpt4.desktop), gptModels[gpt4.mobile]));
            }

            jsonRes.categories = categories;

          } catch (e) {
            console.warn(e);
          }

        }

        return __jsonRes__;

      });
      return jsonPromise;

    };
  })(win.Response)

})();