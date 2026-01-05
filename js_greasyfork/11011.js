// ==UserScript==
// @name         硕鼠跳过前置广告
// @name:en      Flvcd NoAD
// @namespace    org.jixun.noad.flvcd
// @version      0.3
// @description:en Skip pre-dl ads.
// @description  跳过「为了保护视频网站的合法权益，需要观看广告后才能下载。」提示。
// @author       Jixun
// @match        http://www.flvcd.com/parse.php?*
// @grant        none
// @run-at       document-end
// @compatible   firefox GreaseMonkey 3.2
// @compatible   chrome  TamperMonkey Beta v3.12.4712
// @downloadURL https://update.greasyfork.org/scripts/11011/%E7%A1%95%E9%BC%A0%E8%B7%B3%E8%BF%87%E5%89%8D%E7%BD%AE%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/11011/%E7%A1%95%E9%BC%A0%E8%B7%B3%E8%BF%87%E5%89%8D%E7%BD%AE%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

if (document.evaluate('table/tbody/tr[4]/th/table/tbody/tr/td/strong[1]/span', document.body,
                      null, 0/*XPathResult.ANY_TYPE*/, null).iterateNext())
{
    window.thisMovie = false;
    window.avdPlay('about:jixun');
}