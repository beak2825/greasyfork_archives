// ==UserScript==
// @name           Google網頁翻譯
// @name:en        Google Translate for browser 
// @author         KFxxx
// @namespace      https://github.com/KFxxx/xxxx/blob/main/GT.js
// @description    自動（可關閉）網頁翻譯（預設為其他語言自動轉繁體）
// @description:en Google Translate for browser.. 
// @version        0.02
// @license        CC v4.0 https://creativecommons.org/licenses/by/4.0/
// @icon           https://raw.githubusercontent.com/KFxxx/xxxx/main/2875363.png
// @include        *
// @run-at         document-end
// @note         20211101 v0.02 --- 補上一開始忘記加上消除 text hover 時候煩人的 tipssss
// @downloadURL https://update.greasyfork.org/scripts/434727/Google%E7%B6%B2%E9%A0%81%E7%BF%BB%E8%AD%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/434727/Google%E7%B6%B2%E9%A0%81%E7%BF%BB%E8%AD%AF.meta.js
// ==/UserScript==
;(function () {
  "use strict"
  // 抓網頁使用的語言
  const pLang = document.documentElement.lang.toLowerCase().substr(0,5);
  // 抓自己使用的語言
  const uLang = (navigator.language||navigator.browserLanguage).toLowerCase().substr(0,5);
   // 空 DIV
  let xdiv = document.createElement("div");
  xdiv.id = "google_translate_element";
  // 本體 CSS
  let xcss = document.createElement("style");
  xcss.innerHTML = ".goog-text-highlight{background-color:transparent!important;border:none!important;box-shadow:none!important;}body{top:0px!important;}.goog-te-banner-frame.skiptranslate{display:none!important;}select.goog-te-combo,#xcancel{z-index: 88888888;opacity:0.5;position:fixed;font-size:8px; font-weight:bold;width:90px;left:5px;top:55px;color:#666;background:#f8f8f8;border:solid #aaa 2px;}#xcancel{top:85px;opacity:0;}select.goog-te-combo:hover,#xcancel:hover{opacity:1;}#google_translate_element{display:block;width:0px;overflow:hidden;}";
  // 關閉按鈕
  let button = document.createElement("button");
  button.innerHTML = "取消翻譯";
  button.id = "xcancel";
  button.onclick = function(){
    let iframe = document.getElementsByClassName("goog-te-banner-frame")[0];
    if(!iframe)return;
    let innerDoc = iframe.contentDocument||iframe.contentWindow.document;
    let restore_el = innerDoc.getElementsByTagName("button");
    for(let i=0;i<restore_el.length;i++){
      if(restore_el[i].id.indexOf("restore")>=0) {
        restore_el[i].click();
        let close_el = innerDoc.getElementsByClassName("goog-close-link");
        close_el[0].click();
      return;}
    }
  };
  // 翻譯選單/本體
  function googleTranslateElementInit(){
    new google.translate.TranslateElement({
      pageLanguage:"auto",
      // 可翻譯的語言，繁簡中，英語，日語，法語
      includedLanguages: "zh-TW,zh-CN,en,ja,fr",
    },"google_translate_element");
      document.body.appendChild(button);
    setTimeout(function(){
      var select = document.querySelector("select.goog-te-combo");
      // 自動翻譯語言
      select.value = "zh-TW";
      select.dispatchEvent(new Event("change"));
      // 刪除顯示原文 POP
      var xpopx = document.getElementById("goog-gt-tt");
      xpopx.parentNode.removeChild(xpopx);
    },100);
  };
  (function() {
  var googleTranslateScript = document.createElement("script");
  googleTranslateScript.type = "text/javascript";
  googleTranslateScript.async = true;
  googleTranslateScript.src = "https://translate.google.com/translate_a/element.js";
  ( document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0] ).appendChild( googleTranslateScript );
  })();
  if(pLang==uLang){
    // 使用者語言與網頁相同不動作
  } else if (pLang!==uLang){
    // 網頁語言不是指定語言：寫入
    window.onload = googleTranslateElementInit;
    document.body.appendChild(xdiv);
    document.head.appendChild(xcss);
  }else{
    // 其他
  };
})()
