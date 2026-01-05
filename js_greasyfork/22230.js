// ==UserScript==
// @name         Stop stupid translations
// @namespace    http://alhur.es/
// @version      0.9
// @description  Replace language codes in URLs (like "pt-BR", for example) to "en".
// @author       fiatjaf
// @run-at       document-start
// @license      MIT
// @include      /^https?://[^/]+.*/[a-z]{2}([-_][A-Z]{2})?(\/|$).*/
// @include      /=[a-z]{2}([-_][A-Z]{2})?(&|$)/
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/22230/Stop%20stupid%20translations.user.js
// @updateURL https://update.greasyfork.org/scripts/22230/Stop%20stupid%20translations.meta.js
// ==/UserScript==

(function() {
    let lastTried = GM_getValue('trying::' + location.href, 0)
    if ((new Date).getTime() - lastTried < 3000) {
        console.log(`Stop stupid translations: this URL will not work. we've tried.`)
        return
    }

    if (location.href.length > 800) {
      console.log(`Stop stupid translations: this URL is too big, we'll probably break up something if we change it, so we'll not touch it.`)
      return
    }

    var codes = {'af':1,'af-ZA':1,'ar-AE':1,'ar-BH':1,'ar-DZ':1,'ar-EG':1,'ar-IQ':1,'ar-JO':1,'ar-KW':1,'ar-LB':1,'ar-LY':1,'ar-MA':1,'ar-OM':1,'ar-QA':1,'ar-SA':1,'ar-SY':1,'ar-TN':1,'ar-YE':1,
                 'az':1,'az-AZ':1,'be':1,'be-BY':1,'bg':1,'bg-BG':1,'bs-BA':1,'ca-ES':1,'cs':1,'cs-CZ':1,'cy':1,'cy-GB':1,'da-DK':1,'de-AT':1,'de-CH':1,'de-DE':1,'de-LI':1,
                 'de-LU':1,'dv':1,'dv-MV':1,'el':1,'el-GR':1,'eo':1,
                 'es':1,'es-AR':1,'es-BO':1,'es-CL':1,'es-CO':1,'es-CR':1,'es-DO':1,'es-EC':1,'es-ES':1,'es-GT':1,'es-HN':1,'es-MX':1,'es-NI':1,'es-PA':1,'es-PE':1,'es-PR':1,'es-PY':1,'es-SV':1,
                 'es-UY':1,'es-VE':1,'et':1,'et-EE':1,'eu':1,'eu-ES':1,'fa':1,'fa-IR':1,'fi':1,'fi-FI':1,'fo':1,'fo-FO':1,'fr':1,'fr-BE':1,'fr-CA':1,'fr-CH':1,'fr-FR':1,'fr-LU':1,'fr-MC':1,'gl':1,'gl-ES':1,
                 'gu':1,'gu-IN':1,'he':1,'he-IL':1,'hi':1,'hi-IN':1,'hr':1,'hr-BA':1,'hr-HR':1,'hu':1,'hu-HU':1,'hy':1,'hy-AM':1,'id':1,'id-ID':1,'it-CH':1,'it-IT':1,'ja':1,'ja-JP':1,
                 'ka':1,'ka-GE':1,'kk':1,'kk-KZ':1,'kn':1,'kn-IN':1,'ko':1,'ko-KR':1,'kok':1,'kok-IN':1,'ky':1,'ky-KG':1,'lt':1,'lt-LT':1,'lv':1,'lv-LV':1,'mi':1,'mi-NZ':1,'mk':1,'mk-MK':1,'mn':1,'mn-MN':1,
                 'mr':1,'mr-IN':1,'ms':1,'ms-BN':1,'ms-MY':1,'mt':1,'mt-MT':1,'nb':1,'nb-NO':1,'nl':1,'nl-BE':1,'nl-NL':1,'nn-NO':1,'ns':1,'ns-ZA':1,'pa':1,'pa-IN':1,'pl':1,'pl-PL':1,'ps':1,'ps-AR':1,
                 'pt':1,'pt-BR':1,'pt-PT':1,'qu':1,'qu-BO':1,'qu-EC':1,'qu-PE':1,'ro':1,'ro-RO':1,'ru':1,'ru-RU':1,'sa':1,'sa-IN':1,'se':1,'se-FI':1,'se-NO':1,
                 'se-SE':1,'sk':1,'sk-SK':1,'sl':1,'sl-SI':1,'sq':1,'sq-AL':1,'sr-BA':1,'sr-SP':1,'sv':1,'sv-FI':1,'sv-SE':1,'sw':1,'sw-KE':1,'syr':1,'syr-SY':1,
                 'ta':1,'ta-IN':1,'te':1,'te-IN':1,'th':1,'th-TH':1,'tl-PH':1,'tn':1,'tn-ZA':1,'tt':1,'tt-RU':1,'ts':1,'uk':1,'uk-UA':1,'ur':1,'ur-PK':1,'uz':1,'uz-UZ':1,
                 'vi':1,'vi-VN':1,'xh':1,'xh-ZA':1,'zh':1,'zh-CN':1,'zh-HK':1,'zh-MO':1,'zh-SG':1,'zh-TW':1,'zu':1,'zu-ZA':1}

    var newurl = location.href.replace(/([^\w-_])[a-z]{2}([-_][A-Z]{2})?([^\w-_]|$)/g, function (m, first, _, last) {
      m = m.replace('_', '-')

      let code = last == '' ? m.slice(1) : m.slice(1, -1)

      if (codes[code]) {
        return first + 'en' + last
      }

      return m
    })

    if (newurl !== location.href) {
      GM_setValue('trying::' + location.href, (new Date).getTime())
      location.href = newurl
    }
})()