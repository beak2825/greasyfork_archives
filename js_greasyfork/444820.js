// ==UserScript==
// @name         Show Chinese translation in Google search result page
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  在google翻译页面增加来自google的翻译结果，只翻译英文单词
// @author       dttutty <dttutty#gmail.com>
// @include      /^https:\/\/www.google.*\/*/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @license      GPL v3
// @downloadURL https://update.greasyfork.org/scripts/444820/Show%20Chinese%20translation%20in%20Google%20search%20result%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/444820/Show%20Chinese%20translation%20in%20Google%20search%20result%20page.meta.js
// ==/UserScript==


(function() {
    'use strict';
    function getQueryVariable(variable)
    {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }

    function Request(url, opt = {}) {
        const originURL = new URL(url)
        const originParams = originURL.searchParams

        new URLSearchParams(opt.params).forEach((value, key) => originParams.append(key, value))

        const newQS = originParams.toString() !== '' ? `?${originParams.toString()}` : ''
        const newURL = `${originURL.origin}${originURL.pathname}${newQS}`
    Object.assign(opt, {
        url: newURL,
        timeout: 20000,
        responseType: 'json'
    })

        return new Promise((resolve, reject) => {
            opt.onerror = opt.ontimeout = reject
            opt.onload = resolve

            GM_xmlhttpRequest(opt)
        })
    }

    var q = getQueryVariable('q')

    if(/^[a-zA-Z]+$/.test(q)){

        Request('https://translate.google.com/translate_a/t',
                {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json charset=UTF-8',
            },
            params: {
                client: 'dict-chrome-ex',
                sl: 'auto',
                tl: 'zh-CN',
                q: q.trim(),
            }
        })
            .then(function (response) {
            const result = JSON.parse(response.responseText)
            let div = document.createElement("div")
            div.innerHTML = `<div title="反馈翻译脚本问题可联系微信funnybook" style="font-size: large; border:1px solid gray; padding: 5px;">Google翻译结果：<a target="_blank" href="https://translate.google.cn/?sl=en&tl=zh-CN&text=${q}&op=translate">${result[0][0]}</a></div>`

            document.getElementById('search').prepend(div)
        })
    }


})();