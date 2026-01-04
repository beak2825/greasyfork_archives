// ==UserScript==
// @name         CookieTaker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  copy
// @author       You
// @match        https://www.heroeswm.ru/home.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/453654/CookieTaker.user.js
// @updateURL https://update.greasyfork.org/scripts/453654/CookieTaker.meta.js
// ==/UserScript==
// @require http://code.jquery.com/jquery-latest.js
// @require https://raw.githubusercontent.com/js-cookie/js-cookie/master/src/js.cookie.js



(function() {
    var nick
    try{
        nick=document.evaluate('/html/body/center/div[2]/div/div[2]/div[1]/div/div[2]/div[1]/center/a[1]/b', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    catch{
        nick=document.evaluate('/html/body/center/table[2]/tbody/tr/td/table/tbody/tr[2]/td[1]/table/tbody/tr/td/center/a[1]/b', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        nick=nick.innerHTML
    }
    var ca = document.cookie;
    let agent = navigator.userAgent;
    let tot='"'+nick+"@"+ca+"@"+agent+'",'
    GM_setClipboard (tot);

})();