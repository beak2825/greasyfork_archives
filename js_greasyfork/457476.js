// ==UserScript==
// @name         Youtube double language subtitle / Youtube 双语字幕
// @version      2023.1.2
// @description  Youtube double language subtitle / Youtube 双语字幕. 如果不能自动加载，请关闭字幕再次打开即可。默认语言为浏览器首选语言。
// @author       Coink
// @match        *://www.youtube.com/watch?v=*
// @match        *://www.youtube.com
// @match        *://www.youtube.com/*
// @match        *://m.youtube.com/watch?v=*
// @require      https://unpkg.com/ajax-hook@2.1.3/dist/ajaxhook.min.js
// @grant        none
// @run-at       document-start
// @namespace    https://github.com/CoinkWang/Y2BDoubleSubs
// @downloadURL https://update.greasyfork.org/scripts/457476/Youtube%20double%20language%20subtitle%20%20Youtube%20%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/457476/Youtube%20double%20language%20subtitle%20%20Youtube%20%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    let localeLang = document.documentElement.lang || navigator.language ||
        // localeLang = 'zh'  // uncomment this line to define the language you wish here
        'en' // follow the language used in YouTube Page
    ah.proxy({
        onRequest: (config, handler) => {
            handler.next(config);
        },
        onResponse: (response, handler) => {
            if (response.config.url.includes('/api/timedtext') && !response.config.url.includes('&translate_h00ked')) {
                let xhr = new XMLHttpRequest();
                // Use RegExp to clean '&tlang=...' in our xhr request params while using Y2B auto translate.
                let url = response.config.url
                url = url.replace(/(^|[&?])tlang=[^&]*/g, '')
                url = `${url}&tlang=${localeLang}&translate_h00ked`
                xhr.open('GET', url, false);
                xhr.send();
                let defaultJson = null
                if (response.response) {
                    const jsonResponse = JSON.parse(response.response)
                    if (jsonResponse.events) defaultJson = jsonResponse
                }
                const localeJson = JSON.parse(xhr.response)
                let isOfficialSub = true;
                for (const defaultJsonEvent of defaultJson.events) {
                    if (defaultJsonEvent.segs && defaultJsonEvent.segs.length > 1) {
                        isOfficialSub = false;
                        break;
                    }
                }
                // Merge default subs with locale language subs
                if (isOfficialSub) {
                    // when length of segments are the same
                    for (let i = 0, len = defaultJson.events.length; i < len; i++) {
                        const defaultJsonEvent = defaultJson.events[i]
                        if (!defaultJsonEvent.segs) continue
                        const localeJsonEvent = localeJson.events[i]
                        if (`${defaultJsonEvent.segs[0].utf8}`.trim() !== `${localeJsonEvent.segs[0].utf8}`.trim()) {
                            // avoid merge subs while the are the same
                            defaultJsonEvent.segs[0].utf8 = localeJsonEvent.segs[0].utf8 + '\n' + defaultJsonEvent.segs[0].utf8
                        }
                    }
                    response.response = JSON.stringify(defaultJson)
                } else {
                    // when length of segments are not the same (e.g. automatic generated english subs)
                    let pureLocalEvents = localeJson.events.filter(event => event.aAppend !== 1 && event.segs)
                    for (const defaultJsonEvent of defaultJson.events) {
                        if (!defaultJsonEvent.segs) continue
                        let currentStart = defaultJsonEvent.tStartMs,
                            currentEnd = currentStart + defaultJsonEvent.dDurationMs
                        for (const localeJsonEvent of pureLocalEvents) {
                           if (localeJsonEvent.tStartMs === currentStart) {
                              defaultJsonEvent.segs[0].utf8 = localeJsonEvent.segs[0].utf8 + '\n' + defaultJsonEvent.segs[0].utf8
                              break;
                           } 
                        }
                    }
                    response.response = JSON.stringify(defaultJson)
                }
            }
            handler.resolve(response)
        }
    })
})();