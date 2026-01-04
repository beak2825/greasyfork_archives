// ==UserScript==
// @name        Greasyfork.org - remove lang from url
// @namespace   UserScript
// @match       https://greasyfork.org/*
// @grant       none
// @version     1.2
// @author      CY Fung
// @description To remove lang from Greasy Fork's url
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/472342/Greasyforkorg%20-%20remove%20lang%20from%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/472342/Greasyforkorg%20-%20remove%20lang%20from%20url.meta.js
// ==/UserScript==

(function (__CONTEXT__) {

  const delayTime = -1; // ms, -1 disable

  let pathnames = {before: '', after:''};

  function main(){



  const { setInterval, clearInterval, Promise } = __CONTEXT__;

  let lastURL = null;

  const langs = [
    "ar",
    "bg",
    "cs",
    "da",
    "de",
    "el",
    "en",
    "eo",
    "es",
    "fi",
    "fr",
    "fr-CA",
    "he",
    "hu",
    "id",
    "it",
    "ja",
    "ka",
    "ko",
    "nb",
    "nl",
    "pl",
    "pt-BR",
    "ro",
    "ru",
    "sk",
    "sr",
    "sv",
    "th",
    "tr",
    "uk",
    "ug",
    "vi",
    "zh-CN",
    "zh-TW"
  ];

  const regex = new RegExp("\/(" + langs.join('|') + ")\/");

  function tim() {

    const url = location.pathname;

    if (url === lastURL) return;
    lastURL = url;


    const m = regex.exec(url);
    if (m) {
      pathnames.before = url;
      pathnames.after = url.replace(`${m[0]}`, '\/');
     // history.replaceState(history.state, '', pathnames.after + location.search);
    }



  }
  let cid = setInterval(tim, 1);



  function onReady() {
    clearInterval(cid);
    cid = 0;
    let mza=false;
    Promise.resolve().then(tim).then(()=>{


      document.addEventListener('mousemove', function(evt){
        if(!mza && evt.target.id==='script-info' && pathnames.before && pathnames.after){
        mza= true;
          history.replaceState(history.state, '', pathnames.before + location.search);
        }
      },true);


      document.addEventListener('mouseenter', function(evt){
        if(evt.target.id==='script-info' && pathnames.before && pathnames.after){
        mza= true;
          history.replaceState(history.state, '', pathnames.before + location.search);
        }
      },true);


      document.addEventListener('mouseleave', function(evt){
        if(evt.target.id==='script-info' && pathnames.before && pathnames.after){
        mza=false;
          history.replaceState(history.state, '', pathnames.after + location.search);
        }
      },true);




      window.addEventListener('focus', function(evt){
        console.log(123, evt.target);
        if( pathnames.before && pathnames.after && !mza){
        mza= true;
          history.replaceState(history.state, '', pathnames.before + location.search);
        }
      },false);


      window.addEventListener('blur', function(evt){
        console.log(124, evt.target);
        if( pathnames.before && pathnames.after && mza){
        mza=false;
          history.replaceState(history.state, '', pathnames.after + location.search);
        }
      },false);

    });
  }

  Promise.resolve().then(() => {
    if (document.readyState !== 'loading') {
      onReady();
    } else {
      window.addEventListener("DOMContentLoaded", onReady, false);
    }
  });

  }

  if(delayTime>=0){

    setTimeout(main, delayTime);
  }else{
    main();
  }





})({ setInterval, clearInterval, Promise });



// No more language tag