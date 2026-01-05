// ==UserScript==
// @name         I9g4lo9Y:部分网站文章自动全文打开
// @namespace    undefined
// @version      0.3.5
// @description  I9g4lo9Y:部分文章自动全文打开
// @author       I9g4lo9Y
// @match        *://www.ftchinese.com/*
// @match        *://hk.crntt.com/*
// @match        *://cn.nikkei.com/*
// @grant        none
// @note         借鉴https://greasyfork.org/en/scripts/2283-replace-goog-tracking-url/code
// @note         已支持网站列表：
// @note         2017-05-27    www.ftchinese.com
// @note         2017-05-27    hk.crntt.com
// @note         2020-07-22    cn.nikkei.com
// @downloadURL https://update.greasyfork.org/scripts/28598/I9g4lo9Y%3A%E9%83%A8%E5%88%86%E7%BD%91%E7%AB%99%E6%96%87%E7%AB%A0%E8%87%AA%E5%8A%A8%E5%85%A8%E6%96%87%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/28598/I9g4lo9Y%3A%E9%83%A8%E5%88%86%E7%BD%91%E7%AB%99%E6%96%87%E7%AB%A0%E8%87%AA%E5%8A%A8%E5%85%A8%E6%96%87%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

/**
 * www.ftchinese.com/*
 */

function ftchinese_replace_url(elem, attr) {
    var elems = document.getElementsByTagName(elem);
    for (var i = 0; i < elems.length; i++){
        if(elems[i][attr].indexOf('/story/') != -1) {
            var article_id = elems[i][attr].match(/\d+/g)[0];
            //alert(article_id);
            //var article_id = '999';
            elems[i][attr] = 'http://www.ftchinese.com/story/' + article_id + '?full=y';
        }
        elems[i][attr] = unescape(elems[i][attr]);
    }
}

function cn_nikkei(elem, attr) {
    var elems = document.getElementsByTagName(elem);
    for (var i = 0; i < elems.length; i++){
        if(elems[i][attr].length > 50) {
            elems[i][attr] = elems[i][attr] + '?tmpl=component&print=1&page=';
            //var article_id = elems[i][attr].match(/\d+/g)[0];
            //alert(article_id);
            //var article_id = '999';
            //elems[i][attr] = 'http://www.ftchinese.com/story/' + article_id + '?full=y';
        }
        elems[i][attr] = unescape(elems[i][attr]);
    }
}

function hk_crntt() {
    elem = "a";
    attr = "href";
    var elems = document.getElementsByTagName(elem);
    for (var i = 0; i < elems.length && i < 300; i++){
        if(elems[i][attr].indexOf('/doc/') != -1) {
            var article_id = elems[i][attr].split('_')[2];
//            alert(article_id);
            //var article_id = '999';
            elems[i][attr] = 'http://hk.crntt.com/crn-webapp/doc/docDetailCNML.jsp?docid=' + article_id;
        }
        elems[i][attr] = unescape(elems[i][attr]);
    }
}

window.onload = function() {
    console.log("auto one page begin");
    if (location.host == "www.ftchinese.com") {
        ftchinese_replace_url('a', 'href');
    } else if (location.host == "cn.nikkei.com") {
        cn_nikkei('a', 'href');
    } else if (location.host == "hk.crntt.com") {
        hk_crntt();
    };
    //replace_url('img', 'src');
    // etc
    console.log("auto one page done");
};