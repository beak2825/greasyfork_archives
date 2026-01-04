// ==UserScript==
// @name           Better cametek.jp
// @author         NarwhalKid
// @namespace      https://github.com/KFxxx/xxxx/blob/main/GT.js
// @description    自動（可關閉）網頁翻譯（預設為其他語言自動轉繁體）
// @description:en Better camtek.jp
// @version        0.03
// @license        CC v4.0 https://creativecommons.org/licenses/by/4.0/
// @match          https://cametek.jp/*
// @match          https://nanahira.jp/*
// @match          http://camtek.seesaa.net/*
// @match          http://www.studiosatuki.com/*
// @match          http://younoumi.com/*
// @match          https://www.tanocstore.net/*
// @match          http://tenjemi.com/*
// @match          http://www.orc2000.com/*
// @match          http://wakusei.birdtune.jp/*
// @match          http://alst.net/*
// @match          http://confetto.chu.jp/*
// @match          http://holicservice.com/*
// @match          https://www.nicovideo.jp/*
// @match          https://live.nicovideo.jp/*
// @match          http://movementonthefloor.net/*
// @match          http://downforce.jp/*
// @match          http://innocent-key.com/*
// @match          https://www.voiceblog.jp/*
// @match          http://www.vocalomakets.com/*
// @match          http://www.ugc-pub.com/*
// @match          https://www.iosysos.com/*
// @match          http://djgenki.net/*
// @match          http://usao926.blog.fc2.com/*
// @match          http://www.tano-c.net/*
// @match          http://www.sketchuprecordings.com/*
// @match          http://club-mixus.com/*
// @match          http://tweetvite.com/*
// @match          http://forestpireo.jp/*
// @match          https://sparkle-of-voices.tumblr.com/*
// @match          https://twipla.jp/*
// @match          http://phquase.web.fc2.com/*
// @match          http://beatlogic.jp/*
// @match          http://zytokine-web.com/*
// @match          http://soundave.net/*
// @match          https://www.stpaulsigncompany.com/*
// @match          https://ameblo.jp/*
// @match          https://iosystrax.com/*
// @match          http://blog.livedoor.jp/*
// @match          http://www.dtmm.co.jp/*
// @match          http://diverse.jp/*
// @match          http://spriterecordings.upper.jp/*
// @match          http://www.cubegrams.com/*
// @match          https://www.rittor-music.co.jp/*
// @match          http://vocalabo.web.fc2.com/*
// @match          http://c-h-s.me/holix/
// @match          http://zytokine-web.com/*
// @match          http://www.tamstarrecords.jp/*
// @match          https://dx-penguin.tumblr.com/*
// @match          https://club-mogra.jp/*
// @match          https://twipla.jp/*
// @match          http://ototonekoushiki.wix.com/*
// @match          http://nagomix.co.jp/*
// @match          http://binzo.co/*
// @match          https://hkcd-0008.tumblr.com/*
// @match          https://shandybass2.tumblr.com/*
// @match          http://movementonthefloor.net/*
// @match          https://error.fc2.com/*
// @match          https://kc-versus.tumblr.com/*
// @match          http://massivecirclez.jp/*
// @match          http://www.otoculture.com/*
// @match          http://r135.net/*
// @icon           https://cametek.jp/img/cametekjp.ico
// @run-at         document-end
// @note           20211101 v0.02 --- 補上一開始忘記加上消除 text hover 時候煩人的 tipssss
// @downloadURL https://update.greasyfork.org/scripts/441564/Better%20cametekjp.user.js
// @updateURL https://update.greasyfork.org/scripts/441564/Better%20cametekjp.meta.js
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
  
  
  //Get link
  let endurl = window.location.href.split('/',3)
  let fc2 = window.location.href.split('/',5)
  //Get archive if any of these links
  if ((endurl == 'http:,,www.studiosatuki.com') || (endurl == 'http:,,forestpireo.jp') || (endurl == 'https:,,www.tanocstore.net') || (endurl == 'http:,,alst.net') || (endurl == 'http:,,downforce.jp') || (endurl == 'http:,,movementonthefloor.net') || (endurl == 'http:,,innocent-key.com') || (endurl == 'https:,,www.voiceblog.jp') || (endurl == 'http:,,www.ugc-pub.com') || (endurl == 'http:,,club-mixus.com') || (endurl == 'http:,,soundave.net') || (endurl == 'http:,,www.dtmm.co.jp') || (endurl == 'https:,,twipla.jp') || (endurl == 'http:,,movementonthefloor.net') || (endurl == 'http:,,www.otoculture.com') || (endurl == 'http:,,r135.net')) {
    window.location.href = "https://web.archive.org/web/*/" + window.location.href
  }
  if (fc2 == 'https:,,error.fc2.com,web,404.html') {
    window.location.href = "https://web.archive.org/web/*/http://phquase.web.fc2.com/cd/pqcd_0002_quarnival.html"
  }
  if (endurl == 'https:,,www.iosysos.com') {
    window.location.href = "https://www.narwhalkid.com/iosysos/"
  }
  if (endurl == 'https:,,www.stpaulsigncompany.com' || endurl == 'http:,,massivecirclez.jp') {
    window.location.href = "https://www.narwhalkid.com/massivecirclez/"
  }
  if (endurl == 'https:,,iosystrax.com') {
    window.location.href = "https://web.archive.org/web/*/http://iosystrax.com/2013/08/11/iopakiba2013-2/"
  }
  if (endurl == 'http:,,ototonekoushiki.wix.com') {
    window.location.href = "https://www.narwhalkid.com/hensyuu1/"
  }

  
  
  
  // 翻譯選單/本體
  function googleTranslateElementInit(){
    new google.translate.TranslateElement({
      pageLanguage:"auto",
      // 可翻譯的語言，繁簡中，英語，日語，法語
      includedLanguages: "en,fr",
    },"google_translate_element");
      document.body.appendChild(button);
    setTimeout(function(){
      var select = document.querySelector("select.goog-te-combo");
      // 自動翻譯語言
      select.value = "en";
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