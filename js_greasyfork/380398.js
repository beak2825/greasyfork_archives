// ==UserScript==
// @name Google Search Filter By Language Separately
// @description Google Search's language filter is painful to use for multi-language users. It only support filtering between All language, Your primary language, and all languages you know. So as an chinese user who also know english, google can only show english and chinese results together, I can not filter English content only.
// @version 201903112
// @include https://www.google.com/*
// @grant none
// @namespace https://greasyfork.org/users/165728
// @downloadURL https://update.greasyfork.org/scripts/380398/Google%20Search%20Filter%20By%20Language%20Separately.user.js
// @updateURL https://update.greasyfork.org/scripts/380398/Google%20Search%20Filter%20By%20Language%20Separately.meta.js
// ==/UserScript==

(function() {
    function addNewLangFilters() {
        const langList = [
            ['lang_zh-CN', '中文 (简体)'],
            ['lang_ja', '日本語'],
            ['lang_en', 'English'],
        ]
        langList.reverse() 
        let langItems = document.querySelectorAll("ul.hdtbU")[0].querySelectorAll(".hdtbItm")
        let primaryLang = langItems[1]
        let search_qs = primaryLang.querySelector('a').href

        for (const [code, name] of langList) {
            let newLang = primaryLang.cloneNode(true)
            let newLink = newLang.querySelector('a')
            newLink.innerHTML = name
            let url = new URL(newLink.href)
            let qs = new URLSearchParams(url.search);
            qs.set('lr', code)
            url.search = qs.toString()
            newLink.href = url.href
            primaryLang.after(newLang)
        }
    }
    function enableSearchTools() {
        document.getElementById('hdtb-tls').click()
    }

    setTimeout(addNewLangFilters, 1000*3)
})();