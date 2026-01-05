// ==UserScript==
// @name         Moodle - Easy Read
// @namespace    http://flowbooks.fr/
// @version      1.4
// @description  Un userscript vraiment leger pour justifier les données des sites d'infos français et d'augmenter un peu la taille de lecture.
// @author       Antoine Tagah
// @include     http://moodle.univ-angers.fr/mod/book/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12787/Moodle%20-%20Easy%20Read.user.js
// @updateURL https://update.greasyfork.org/scripts/12787/Moodle%20-%20Easy%20Read.meta.js
// ==/UserScript==

 WebFontConfig = {
    google: { families: [ 'Lora:400,400italic,700,700italic:latin' ] }
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();

 url= document.URL;

if (/moodle.univ-angers.fr\/mod/.test(url)) {

    var el = document.getElementById('region-main');
}
//el.setAttribute('style', 'text-align: justify; word-spacing: 2px;');
el.style.fontSize="20px";
el.style.fontFamily="'Slabo 27px',Bookerly, Lora";
el.style.wordSpacing="3px";
el.style.textAlign="justify";
el.style.textIndent="15px";
//el.setAttribute("class", "span11 offset3");

if(document.createElement){
  head=document.getElementsByTagName('head').item(0);
  script=document.createElement('script');
  script.src='http://sd-g1.archive-host.com/membres/up/3cae4e4a561c71fb9af9e0fe3052acfc9ed06627/Hyphenator.js?bm=true';
  script.type='text/javascript';
  head.appendChild(script);
}
