// ==UserScript==
// @name         微软文档中英文切换
// @version      1.3.3
// @description  微软文档自动跳转中文+按钮快速切换中英文
// @license MIT
// @match        https://learn.microsoft.com/zh-cn/*
// @match        https://learn.microsoft.com/id-id/*
// @match        https://learn.microsoft.com/ms-my/*
// @match        https://learn.microsoft.com/bs-latn-ba/*
// @match        https://learn.microsoft.com/ca-es/*
// @match        https://learn.microsoft.com/cs-cz/*
// @match        https://learn.microsoft.com/da-dk/*
// @match        https://learn.microsoft.com/de-at/*
// @match        https://learn.microsoft.com/de-ch/*
// @match        https://learn.microsoft.com/de-de/*
// @match        https://learn.microsoft.com/et-ee/*
// @match        https://learn.microsoft.com/en-au/*
// @match        https://learn.microsoft.com/en-ca/*
// @match        https://learn.microsoft.com/en-in/*
// @match        https://learn.microsoft.com/en-ie/*
// @match        https://learn.microsoft.com/en-my/*
// @match        https://learn.microsoft.com/en-nz/*
// @match        https://learn.microsoft.com/en-sg/*
// @match        https://learn.microsoft.com/en-za/*
// @match        https://learn.microsoft.com/en-gb/*
// @match        https://learn.microsoft.com/en-us/*
// @match        https://learn.microsoft.com/es-mx/*
// @match        https://learn.microsoft.com/es-es/*
// @match        https://learn.microsoft.com/eu-es/*
// @match        https://learn.microsoft.com/fil-ph/*
// @match        https://learn.microsoft.com/fr-be/*
// @match        https://learn.microsoft.com/fr-ca/*
// @match        https://learn.microsoft.com/fr-ch/*
// @match        https://learn.microsoft.com/fr-fr/*
// @match        https://learn.microsoft.com/ga-ie/*
// @match        https://learn.microsoft.com/gl-es/*
// @match        https://learn.microsoft.com/ka-ge/*
// @match        https://learn.microsoft.com/hr-hr/*
// @match        https://learn.microsoft.com/is-is/*
// @match        https://learn.microsoft.com/it-ch/*
// @match        https://learn.microsoft.com/it-it/*
// @match        https://learn.microsoft.com/lv-lv/*
// @match        https://learn.microsoft.com/lb-lu/*
// @match        https://learn.microsoft.com/lt-lt/*
// @match        https://learn.microsoft.com/hu-hu/*
// @match        https://learn.microsoft.com/mt-mt/*
// @match        https://learn.microsoft.com/nl-be/*
// @match        https://learn.microsoft.com/nl-nl/*
// @match        https://learn.microsoft.com/nb-no/*
// @match        https://learn.microsoft.com/pl-pl/*
// @match        https://learn.microsoft.com/pt-br/*
// @match        https://learn.microsoft.com/pt-pt/*
// @match        https://learn.microsoft.com/ro-ro/*
// @match        https://learn.microsoft.com/sk-sk/*
// @match        https://learn.microsoft.com/sl-si/*
// @match        https://learn.microsoft.com/sr-latn-rs/*
// @match        https://learn.microsoft.com/fi-fi/*
// @match        https://learn.microsoft.com/sv-se/*
// @match        https://learn.microsoft.com/vi-vn/*
// @match        https://learn.microsoft.com/tr-tr/*
// @match        https://learn.microsoft.com/el-gr/*
// @match        https://learn.microsoft.com/bg-bg/*
// @match        https://learn.microsoft.com/kk-kz/*
// @match        https://learn.microsoft.com/ru-ru/*
// @match        https://learn.microsoft.com/sr-cyrl-rs/*
// @match        https://learn.microsoft.com/uk-ua/*
// @match        https://learn.microsoft.com/he-il/*
// @match        https://learn.microsoft.com/ar-sa/*
// @match        https://learn.microsoft.com/hi-in/*
// @match        https://learn.microsoft.com/th-th/*
// @match        https://learn.microsoft.com/ko-kr/*
// @match        https://learn.microsoft.com/zh-tw/*
// @match        https://learn.microsoft.com/zh-hk/*
// @match        https://learn.microsoft.com/ja-jp/*
// @icon         https://www.microsoft.com/favicon.ico
// @run-at       document-body
// @namespace https://greasyfork.org/users/1023459
// @downloadURL https://update.greasyfork.org/scripts/459631/%E5%BE%AE%E8%BD%AF%E6%96%87%E6%A1%A3%E4%B8%AD%E8%8B%B1%E6%96%87%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/459631/%E5%BE%AE%E8%BD%AF%E6%96%87%E6%A1%A3%E4%B8%AD%E8%8B%B1%E6%96%87%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    var allLanguageRegex = /\/((zh-cn)|(id-id)|(ms-my)|(bs-latn-ba)|(ca-es)|(cs-cz)|(da-dk)|(de-at)|(de-ch)|(de-de)|(et-ee)|(en-au)|(en-ca)|(en-in)|(en-ie)|(en-my)|(en-nz)|(en-sg)|(en-za)|(en-gb)|(en-us)|(es-mx)|(es-es)|(eu-es)|(fil-ph)|(fr-be)|(fr-ca)|(fr-ch)|(fr-fr)|(ga-ie)|(gl-es)|(ka-ge)|(hr-hr)|(is-is)|(it-ch)|(it-it)|(lv-lv)|(lb-lu)|(lt-lt)|(hu-hu)|(mt-mt)|(nl-be)|(nl-nl)|(nb-no)|(pl-pl)|(pt-br)|(pt-pt)|(ro-ro)|(sk-sk)|(sl-si)|(sr-latn-rs)|(fi-fi)|(sv-se)|(vi-vn)|(tr-tr)|(el-gr)|(bg-bg)|(kk-kz)|(ru-ru)|(sr-cyrl-rs)|(uk-ua)|(he-il)|(ar-sa)|(hi-in)|(th-th)|(ko-kr)|(zh-tw)|(zh-hk)|(ja-jp))\//i
    var allLanguageLocaleRegex = /\/((zh-cn)|(id-id)|(ms-my)|(bs-latn-ba)|(ca-es)|(cs-cz)|(da-dk)|(de-at)|(de-ch)|(de-de)|(et-ee)|(en-au)|(en-ca)|(en-in)|(en-ie)|(en-my)|(en-nz)|(en-sg)|(en-za)|(en-gb)|(en-us)|(es-mx)|(es-es)|(eu-es)|(fil-ph)|(fr-be)|(fr-ca)|(fr-ch)|(fr-fr)|(ga-ie)|(gl-es)|(ka-ge)|(hr-hr)|(is-is)|(it-ch)|(it-it)|(lv-lv)|(lb-lu)|(lt-lt)|(hu-hu)|(mt-mt)|(nl-be)|(nl-nl)|(nb-no)|(pl-pl)|(pt-br)|(pt-pt)|(ro-ro)|(sk-sk)|(sl-si)|(sr-latn-rs)|(fi-fi)|(sv-se)|(vi-vn)|(tr-tr)|(el-gr)|(bg-bg)|(kk-kz)|(ru-ru)|(sr-cyrl-rs)|(uk-ua)|(he-il)|(ar-sa)|(hi-in)|(th-th)|(ko-kr)|(zh-tw)|(zh-hk)|(ja-jp))\/locale\//i

    var nonZhCnRegex = /\/((id-id)|(ms-my)|(bs-latn-ba)|(ca-es)|(cs-cz)|(da-dk)|(de-at)|(de-ch)|(de-de)|(et-ee)|(en-au)|(en-ca)|(en-in)|(en-ie)|(en-my)|(en-nz)|(en-sg)|(en-za)|(en-gb)|(en-us)|(es-mx)|(es-es)|(eu-es)|(fil-ph)|(fr-be)|(fr-ca)|(fr-ch)|(fr-fr)|(ga-ie)|(gl-es)|(ka-ge)|(hr-hr)|(is-is)|(it-ch)|(it-it)|(lv-lv)|(lb-lu)|(lt-lt)|(hu-hu)|(mt-mt)|(nl-be)|(nl-nl)|(nb-no)|(pl-pl)|(pt-br)|(pt-pt)|(ro-ro)|(sk-sk)|(sl-si)|(sr-latn-rs)|(fi-fi)|(sv-se)|(vi-vn)|(tr-tr)|(el-gr)|(bg-bg)|(kk-kz)|(ru-ru)|(sr-cyrl-rs)|(uk-ua)|(he-il)|(ar-sa)|(hi-in)|(th-th)|(ko-kr)|(zh-tw)|(zh-hk)|(ja-jp))\//i
    var zhCnRegex = /\/zh-cn\//i
    var noNeedRedirRegex = /microsoft.com\/[^\/]+\/(answers)/i
    var href = window.location.href;
    const url = new URL(href);
    if (href.match(noNeedRedirRegex)){
        console.log('no need redir');
        return;
    }

    if (href.match(allLanguageLocaleRegex)){
        if (!href.match(/userswitch/i)){
            const target = url.searchParams.get('target');
            const targetUrl = new URL(target);
            targetUrl.searchParams.set('userswitch', '1');
            url.searchParams.set('target',targetUrl.href);
            window.location.href = url.href;}
        else{
            return;
        }
    }

    if (!href.match(zhCnRegex) && !href.match(/userswitch=1/i)){
        window.location.href = href.replace(nonZhCnRegex, "/zh-cn/");
    }


    var div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.top = '25vh';
    div.style.right = '0';

    var button = document.createElement('button');
    button.type='button';
    button.style.height = '2.5em';
    button.style.width = '5em';
    button.style.opacity = '0.4';
    button.style.borderStyle = 'none';

    if(href.match(nonZhCnRegex)){
        button.innerText = '中文';
        button.onclick = () => {
            url.searchParams.set('userswitch', '1');
            window.location.href = url.href.replace(allLanguageRegex, "/zh-cn/");
        };
    }
    else if (href.match(zhCnRegex))
    {
        button.innerText = '英文';
        button.onclick = () => {
            url.searchParams.set('userswitch', '1');
            window.location.href = url.href.replace(allLanguageRegex, "/en-us/");
        };
    }

    div.appendChild(button);
    document.body.appendChild(div);
})();