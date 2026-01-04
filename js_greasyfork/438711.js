// ==UserScript==
// @name         Google網址縮短
// @namespace    https://greasyfork.org/scripts/438711
// @version      3.6
// @description  Google搜尋結果的網址很冗長，將其縮短，方便複製、分享、儲存成乾淨的書籤
// @author       fmnijk
// @include      /^https?://www\.google\.com.*$/
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438711/Google%E7%B6%B2%E5%9D%80%E7%B8%AE%E7%9F%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/438711/Google%E7%B6%B2%E5%9D%80%E7%B8%AE%E7%9F%AD.meta.js
// ==/UserScript==

// main function
(function() {
    'use strict';
    sturl();
    window.addEventListener('locationchange', function (){
        sturl();
    })
})();

// shorten url
function sturl() {
    // url
    var url = window.location.href;
    // new url
    var nurl = window.location.href;
    // query string need to be removed
    var qs = ['ved', 'uact', 'ei', 'ie', 'oq', 'sclient', 'cshid', 'dpr', 'iflsig', 'aqs', 'gs_lp', 'gs_lcp', 'gs_lcrp', 'sca_upv', 'source', 'sourceid', '{google:searchboxStats}sourceid', 'sxsrf', 'pccc', 'sa', 'biw', 'bih', 'client', 'gws_rd', 'prmd', 'sca_esv', 'bshm', 'sstk', 'fbs', 'zx', 'no_sw_cr'];
    qs = qs.concat(['newwindow']);
    //qs = qs.concat(['gl', 'hl']);

    // query string need to be removed if equal to something
    var qseq = [['start', '0']];

    // remove not necessary query string
    nurl = rmqs(nurl, qs);
    // remove not necessary query string if equal to something
    nurl = rmqseq(nurl, qseq);

    // do nothing if new url is the same as url
    if (url == nurl){
        return false;
    }

    // update url in address bar to new url
    window.history.replaceState(null, null, nurl);

    // update url in address bar to new url(deprecated)
    //window.location.replace(nurl)
}

// remove not necessary query string
function rmqs(url, qs) {
    url = new URL(url);
    qs.forEach(function(i){
        url.searchParams.delete(i);
    });
    return url.toString();
}

// remove not necessary query string if equal to something
function rmqseq(url, qseq) {
    url = new URL(url);
    qseq.forEach(function(i){
        if (url.searchParams.get(i[0]) == i[1]){
            url.searchParams.delete(i[0]);
        }
    });
    return url.toString();
}

/*----force listen to locationchange work start----*/
history.pushState = ( f => function pushState(){
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('pushstate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.pushState);

history.replaceState = ( f => function replaceState(){
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('replacestate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.replaceState);

window.addEventListener('popstate',()=>{
    window.dispatchEvent(new Event('locationchange'))
});
/*----force listen to locationchange work end----*/

// Ref
// https://gist.github.com/sshay77/4b1f6616a7afabc1ce2a
// https://moz.com/blog/the-ultimate-guide-to-the-google-search-parameters
// https://developer.chrome.com/docs/extensions/mv3/match_patterns
// https://www.google.com/supported_domains

