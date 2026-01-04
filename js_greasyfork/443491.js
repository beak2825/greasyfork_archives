// ==UserScript==
// @name               Baidu Google Bing URL Shorten
// @name:zh-CN         百度谷歌必应链接缩短
// @namespace          https://www.runningcheese.com
// @version            0.4
// @description        Mark Baidu、Google、Bing URL Shortest.
// @description:zh-CN  将 Baidu、Google、Bing 搜索引擎的冗长链接缩短，变干净。
// @author             RunningCheese
// @match              *://*.google.com/*
// @match              *://*.baidu.com/*
// @match              *://*.bing.com/*
// @icon               https://t1.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.google.com
// @grant              none
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/443491/%E7%99%BE%E5%BA%A6%E8%B0%B7%E6%AD%8C%E5%BF%85%E5%BA%94%E9%93%BE%E6%8E%A5%E7%BC%A9%E7%9F%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/443491/%E7%99%BE%E5%BA%A6%E8%B0%B7%E6%AD%8C%E5%BF%85%E5%BA%94%E9%93%BE%E6%8E%A5%E7%BC%A9%E7%9F%AD.meta.js
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
    var qs = [
        //Baidu
        'rsp','prefixsug','fr','bsst','f','inputT','usm','rsv_page','rqlang','rsv_t','oq','rsv_pq','rsv_spt', 'ie', 'rsv_enter','rsv_sug1', 'rsv_sug7','rsv_sug2','rsv_sug3','rsv_iqid', 'rsv_bp', 'rsv_btype', 'rsv_idx', 'rsv_dl', 'issp', 'cshid', 'tn','rsv_sug4',
        //Google
        'tbas','ved', 'uact', 'ei', 'ie', 'oq', 'sclient', 'cshid', 'dpr','iflsig', 'aqs', 'gs_lcp', 'source', 'sourceid', 'sxsrf', 'pccc', 'sa', 'biw', 'bih', 'hl', 'newwindow',
        //Bing
        'tsc','sp','FORM','form','pq','sc','qs','sk','cvid','lq','ghsh','ghacc','ghpl','ghc'

    ];
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



