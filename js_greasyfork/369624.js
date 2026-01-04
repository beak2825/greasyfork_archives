// ==UserScript==
// @name        Google Translation Bar
// @namespace   googletranslationbar
// @description On-page Google Translate, work on all web browsers from desktop to mobile!
// @include     http*
// @include     https*
// @include     https://javengsub.com
// @exclude     https://javengsub.com/ajg/
// @exclude     /^.*translate.google.com.*/
// @exclude     /^.*translate.googleapis.com.*/
// @version     1.2
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/369624/Google%20Translation%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/369624/Google%20Translation%20Bar.meta.js
// ==/UserScript==
//don't run on frames or iframes
//if (window.top != window.self)  {
//    return;
//}

if(top == self) {
  
  function gtranslateproxy() {
  var d=document;
  var b=d.body;
  var o=d.createElement('scri'+'pt');
  o.setAttribute('src','//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
  o.setAttribute('type','text/javascript');
  b.appendChild(o);
  var v=b.insertBefore(d.createElement('div'),b.firstChild);
  v.id='google_translate_element';
  v.style.display='none';
  var p=d.createElement('scri'+'pt');
  p.text='function googleTranslateElementInit(){new google.translate.TranslateElement({pageLanguage:""},"google_translate_element");}';
  p.setAttribute('type','text/javascript');
  b.appendChild(p);
  
  }
  
  gtranslateproxy();

}