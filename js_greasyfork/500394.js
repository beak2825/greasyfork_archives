// ==UserScript==
// @name         搜索屏蔽CSDN
// @icon         https://cdn.jsdelivr.net/gh/ArcherTrister/ArcherTrister/assets/images/x.png
// @namespace    https://github.com/ArcherTrister
// @version      0.1.1
// @license      MIT
// @description  屏蔽csdn网站信息，支持百度、必应、360、搜狗、谷歌搜索
// @author       ArcherTrister
// @match        *://www.baidu.com/s*
// @match        *://www.baidu.com/$
// @match        *://cn.bing.com/search*
// @match        *://cn.bing.com/$
// @match        *://www.so.com/s*
// @match        *://www.so.com/$
// @match        *://www.sogou.com/web*
// @match        *://www.sogou.com/$
// @match        *://www.google.com/search*
// @match        *://www.google.com/$
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500394/%E6%90%9C%E7%B4%A2%E5%B1%8F%E8%94%BDCSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/500394/%E6%90%9C%E7%B4%A2%E5%B1%8F%E8%94%BDCSDN.meta.js
// ==/UserScript==

(function () {
    ('use strict');

    let searchKeys = [];
    searchKeys['baidu'] = 'wd';
    searchKeys['bing'] = 'q';
    searchKeys['so'] = 'q';
    searchKeys['sogou'] = 'query';
    searchKeys['google'] = 'q';

    function replaceQueryParam(url, keyWordName, sites) {
        const parsedUrl = new URL(url);
        const params = new URLSearchParams(parsedUrl.search);
        const keyWord = params.get(keyWordName);
        if (!keyWord || keyWord.indexOf('-site:') != -1)
        {
            return;
        }

        const newValue = keyWord + sites;
        params.set(keyWordName, newValue);
        parsedUrl.search = params.toString();
        window.location.href = parsedUrl.toString();
    }

    var wordInput;
    var key;
    //baidu
    if (
        window.location.hostname == 'www.baidu.com' &&
        window.location.pathname == '/s'
    ) {
        wordInput = document.getElementById('kw');
        key = "baidu";
    }
    //bing
    else if (
        window.location.hostname == 'cn.bing.com' &&
        window.location.pathname == '/search'
    ) {
        wordInput = document.getElementById('sb_form_q');
        key = "bing";
    }
    //360 so
    else if (
        window.location.hostname == 'www.so.com' &&
        window.location.pathname == '/s'
    ) {
        wordInput = document.getElementById('keyword');
        key = "so";
    }
    //sogou
    else if (
        window.location.hostname == 'www.sogou.com' &&
        window.location.pathname == '/web'
    ) {
        wordInput = document.getElementById('upquery');
        key = "sogou";
    }
    //google
    else {
        wordInput = document.getElementsByClassName('gLFyf')[0];
        key = "google";
    }

    if (wordInput) {
        wordInput.addEventListener('keydown', function (e) {
            console.info("keydown value", this.value);
            if (
                e.key == 'Enter' &&
                this.value.length > 0 &&
                this.value.indexOf('.csdn.') == -1
            ) {
                console.info("location", window.location);
                this.value += ' -site:*.csdn.net -site:*.csdn.com';
            }
        });
        wordInput.addEventListener('blur', function () {
            if (
                this.value.length > 0 &&
                this.value.indexOf('.csdn.') == -1
            ) {
                this.value += ' -site:*.csdn.net -site:*.csdn.com';
            }
        });
        wordInput.addEventListener('focus', function () {
            if (this.value.indexOf('.csdn.net') != -1) {
                this.value = this.value.substring(
                    0,
                    this.value.indexOf(' -site:*.csdn.net -site:*.csdn.com')
                );
            }
        });
    }
    replaceQueryParam(window.location.href, searchKeys[key], ' -site:*.csdn.net -site:*.csdn.com');
})();