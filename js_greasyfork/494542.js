// ==UserScript==
// @name         最新获取ss号
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取SS号
// @author       
// @match        http://book.gzlib.org/views/*
// @match        http://book.ucdrs.superlib.net/views/*
// @match        https://book.duxiu.com/bookDetail.jsp?*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/494542/%E6%9C%80%E6%96%B0%E8%8E%B7%E5%8F%96ss%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/494542/%E6%9C%80%E6%96%B0%E8%8E%B7%E5%8F%96ss%E5%8F%B7.meta.js
// ==/UserScript==


setTimeout(function () {
    var lt_url = window.location.href;
    var img_herf;
    try {
        img_herf = document.getElementsByClassName('testimg')[0].getElementsByTagName('a')[0].getAttribute('href');
    } catch {
        try{
            img_herf = document.getElementsByClassName('link')[0].getElementsByTagName('a')[0].getAttribute('href');
        }
        catch {
            img_herf = document.getElementsByClassName('bnt_content')[0].getElementsByTagName('a')[0].getAttribute('href');
        }
    }
    var reg = /\/.*?(?=')/;
    var url;
    if (lt_url.indexOf("ucdrs") !== -1) {
        url = "http://book.ucdrs.superlib.net/" + img_herf.match(reg);
    } else if (lt_url.indexOf("gzlib") !== -1) {
        url = "http://book.gzlib.org/" + img_herf.match(reg);
    } else if (lt_url.indexOf("duxiu") !== -1) {
        img_herf = document.getElementsByClassName('bnt_content')[0].getElementsByTagName('a')[0].getAttribute('href');
        url = "http://book.duxiu.com/" + img_herf.match(reg);
    }
    GM_xmlhttpRequest({
        url: url,
        method: "GET",
        onload: function (xhr) {
            var ssurl = xhr.finalUrl;
            var ssreg = /\d{8}(?=\/)/;
            var ssno = ssurl.match(ssreg);
            window.bookssno = ssno;
            sentback(ssno);
        }
    });

    function sentback(ssno) {
        const online = document.getElementsByClassName("tubookimg")[0];
        const ss_div = document.createElement('div');
        ss_div.className = 'ssno';
        ss_div.innerHTML = '<span><font color="blue" size="16">SS：' + window.bookssno + '</font></span>';

        if (online==undefined){
            const online1 = document.getElementsByClassName("card_pic leftF")[0];
            online1.insertAdjacentElement('afterend', ss_div);
        }else{
            online.insertAdjacentElement('afterend', ss_div);
        }
    }
    // Your code here...
}, 1000);