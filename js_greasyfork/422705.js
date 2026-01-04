// ==UserScript==
// @name Translate YouTube subtitle
// @version 1.8.8
// @description Translate YouTube subtitles into your browser language
// @author 우유밥
// @match https://www.youtube.com/*
// @require https://unpkg.com/ajax-hook@2.0.2/dist/ajaxhook.min.js
// @grant none
// @namespace https://github.com/CoinkWang/Y2BDoubleSubs
// @downloadURL https://update.greasyfork.org/scripts/422705/Translate%20YouTube%20subtitle.user.js
// @updateURL https://update.greasyfork.org/scripts/422705/Translate%20YouTube%20subtitle.meta.js
// ==/UserScript==
ah.proxy({
    onRequest: (config, handler) => {
        handler.next(config);
    },
    onResponse: (response, handler) => {
        if (response.config.url.includes('/api/timedtext') & !response.config.url.includes('&translate_h00ked')){
            var x = new XMLHttpRequest();
            x.open('GET', `${response.config.url.replace(RegExp("tlang"))}&tlang=${navigator.language}&translate_h00ked`, false);
            x.send();
            response.response = JSON.stringify(JSON.parse(x.response))
        }
        handler.resolve(response)
    }
})