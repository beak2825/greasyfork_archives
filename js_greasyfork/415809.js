// ==UserScript==
// @name         HR_one_day
// @author       HR_one_day

// @namespace    http://tampermonkey.net/
// @version      2020年11月09日
// @description  try to take over the world!
// @include      *www.home-for-researchers.com/9*
// @include      *www.home-for-researchers.com/8*
// @include      *www.home-for-researchers.com/7*
// @include      *139.196.222.84/rzk/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/415809/HR_one_day.user.js
// @updateURL https://update.greasyfork.org/scripts/415809/HR_one_day.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setCookies_(domain_) {
        var couponUrl = window.location.href;
        var author = couponUrl.split('/')[3]
        GM_xmlhttpRequest({
            method: "GET",
            url: 'http://139.196.222.84/rzk/' + author,
            onload: function(response) {
                var ret0 = response.responseText;
                var ret = ret0.split(';');
                var ret1 = ret[0];
                var ret2 = ret[1];
                document.cookie = ret1 + "; Domain=" + domain_ + ";";
                document.cookie = ret2 + "; Domain=" + domain_ + ";";
                console.log("?");
                window.open("http://www.home-for-researchers.com/static/index.html#/");
                window.close()
            },
            onerror: function(response) {
                console.log("error")
            }
        })
    }
    var couponUrl = window.location.href;
    console.log(couponUrl);
    if (couponUrl.indexOf('home-for-researchers.com') != -1) {
        setCookies_("www.home-for-researchers.com")
    }
})();