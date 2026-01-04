// ==UserScript==
// @name        Customize Google Translate
// @description  For Google Translate, you can customize and specify tags and keywords without translating
// @author       levinu634
// @name:zh-CN   自定义谷歌翻译
// @name:en      Customize Google Translate
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description:zh-cn 针对谷歌翻译，可以自定义指定标签、关键词不翻译
// @description:en  For Google Translate, you can customize and specify tags and keywords without translating
// @match        *://github.com/*
// @match        *://www.elastic.co/*
// @match        *://spring.io/*
// @match        *://docs.spring.io/*
// @license      GPL
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @supportURL   https://github.com/levinu634/Customize-Google-Translate
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453162/Customize%20Google%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/453162/Customize%20Google%20Translate.meta.js
// ==/UserScript==

(function () {
    'use strict'
    const commonWords = []; //适配所有网页的通用不翻译关键词  Universal untranslated keywords for all web pages
    const filterList = [
        {
            //Customize the target site of the translation configuration. be careful! Before adding a new target page configuration, please add the matching of the target page in the script header
            'website': 'spring.io', //自定义翻译配置的目标网站。注意！添加新目标网页配置前，请在脚本头部添加目标网页的匹配，参考// @match *://github.com/*
            'notranslate': {
                'classes': ['sidebar', 'sidebar_children'],  //特定class属性标签不翻译  Specific class attribute labels are not translated
                'ids': [],  //特定id标签不翻译  No translation of specific id tags
                'elements': [],  //特定标签不翻译
                'words': ['Spring Data REST'],  //目标网页下不翻译的关键词 Keyword not translated under the target page
            }
        },
        {
            'website': 'github.com',
            'notranslate': {
                'classes': ['file-navigation', 'flex-wrap', 'js-navigation-open', 'BorderGrid-cell', 'filter-list', 'mr-31', 'topic-tag', 'v-align-middle', 'js-navigation-open',],
                'ids': [],
                'elements': ['pre'],
                'words': [],
            }
        },
        {
            'website': 'www.elastic.co',
            'notranslate': {
                'classes': ['programlisting'],
                'ids': [],
                'elements': [],
                'words': [],
            }
        },
    ]

    function filter() {
        for (let i = 0; i < filterList.length; i++) {
            const web = filterList[i];
            if (web.website !== window.location.host) {
                continue;
            }
            var notranslate = web.notranslate;
            if (notranslate.classes !== null) {
                addNotranlate(notranslate.classes, 'classes');
            }
            if (notranslate.ids !== null) {
                addNotranlate(notranslate.ids, 'ids');
            }
            if (notranslate.elements !== null) {
                addNotranlate(notranslate.elements, 'elements');
            }
            if (notranslate.words !== null) {
                addNotranlate(notranslate.words, 'words');
            }
        }
        if (commonWords.length > 0) {
            addNotranlate(commonWords, 'words');
        }
    }

    function addNotranlate(filterArrray, type) {
        for (let index in filterArrray) {
            console.log(filterArrray)
            let selector;
            if (type === 'classes') {
                selector = '.' + filterArrray[index]
            } else if (type === 'ids') {
                selector = '#' + filterArrray[index]
            } else if (type === 'elements') {
                selector = filterArrray[index]
            } else if (type === 'words') {
                var reg=new RegExp(filterArrray[index],"gi");
                document.body.innerHTML = document.body.innerHTML.replace(reg, '<span class="notranslate">' + filterArrray[index] + '</span>');
                continue;
            }
            $(selector).addClass('notranslate');
            // $(selector).addClass('cyxy-no-trs'); //对彩云小译的支持  Support for another translation plug-in
        }
    }

    filter();
})();