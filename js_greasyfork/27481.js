// ==UserScript==
// @name            Automatic Clicker for reCAPTCHA of URL Shortener
// @name:ja         shink.inとかのreCAPTCHAを自動クリック
// @namespace       http://hogehoge/
// @version         1.15
// @description     This script is not resolver, only can click.
// @description:ja  画像認識を自動処理するものではありません。使用は自己責任で。
// @author          H. Amami
// @match           *://www.google.com/recaptcha/api2/anchor?*
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/27481/Automatic%20Clicker%20for%20reCAPTCHA%20of%20URL%20Shortener.user.js
// @updateURL https://update.greasyfork.org/scripts/27481/Automatic%20Clicker%20for%20reCAPTCHA%20of%20URL%20Shortener.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var check = function(ref) {
        //You can add domain(s) if you want.
        var domains = [
            "fas.li", "ouo.io", "ouo.press", "shink.in", "al.ly", "coinlink.co", "uploadbank.com", "croco.site", "urlst.me",
            "cpmlink.net", "ally.sh", "elde.me", "cut-urls.com", "linkfly.gaosmedia.com", "uskip.me", "adshorte.com", "u2s.io", "urle.co", "tmearn.com",
            "clik.pw"
        ];
        for (var domain of domains) {
            if (~ref.indexOf(domain)) return true;
        }
        return false;
    };
    if (check(document.referrer.split("/")[2])) {
        var hoge = function() {
            document.getElementById("recaptcha-anchor").click();
        };
        setTimeout(hoge, 0);
        console.info("Automatic click of reCAPTCHA has been executed");
    }
})();