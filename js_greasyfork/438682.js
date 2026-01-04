// ==UserScript==
// @name        Copy Udemy Transcript to the clipboard! 
// @license     good2see
// @namespace   udemyTranscript
// @match       *://*.udemy.com/course/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant       GM_addStyle
// @version     1.0.0.2
// @author      -
// @description You can copy the Udemy transcript text and manupilate newlines automatically.
// @downloadURL https://update.greasyfork.org/scripts/438682/Copy%20Udemy%20Transcript%20to%20the%20clipboard%21.user.js
// @updateURL https://update.greasyfork.org/scripts/438682/Copy%20Udemy%20Transcript%20to%20the%20clipboard%21.meta.js
// ==/UserScript==

var kontrol = setInterval(function () {
  
  //if ($("h2").hasClass("udlite-heading-md")) { //Eğer Transkript section açıksa kopyalama işlemlerini yap
    if ($( "div[class*='transcript--transcript-panel']" )) {
    
    //transcript--transcript-panel--kfMxM
      console.log("transkript sectionı açık. kopyalamaya başlıyorum...");
      $("h2.udlite-heading-md").text("Transkript (Wait!)");
    
      const body = document.querySelector('body');
      var str = document.getElementById("ct-sidebar-scroll-container");
    
      const area = document.createElement('textarea');
      body.appendChild(area);
    
      var transkriptMetni = str.innerText.replace(/(\r\n|\n|\r)/gm," ");
      transkriptMetni = transkriptMetni.replaceAll('  ',' ');
      transkriptMetni = transkriptMetni.replaceAll('. ','.\r\n\r\n');

      area.value = transkriptMetni;
      console.log(transkriptMetni);

    
      const cb = navigator.clipboard;

      cb.writeText(area.value).then(() => console.log('#### Transkript copied ####'));
      
      if (area.value.length>100) {
          clearInterval(this); //kontrolü durduryoruz
          console.log("**** kopyalama başarılı olduğundan timeri durdurdum");
          $("h2.udlite-heading-md").text("Transkript (Copied!)");

        var videoLink = document.querySelector(".vjs-tech").getAttribute('src'); 
        $( "div[class*='header--header-title']" ).html(oncekiBaslik + "<a class='font-text-sm leave-rating--helper-text--21RPx' style='text-decoration:none!important;a:link{color:white!important;}' href='" + videoLink + "' target='_blank'>&#8681; Download Video</a>");
 

      }
    
      body.removeChild(area);
  }
  //alert("Hello");
  
}, 4000);


let lastUrl = location.href; 
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    onUrlChange();
  }
}).observe(document, {subtree: true, childList: true});
 
 
function onUrlChange() {
  console.log('URL changed!', location.href);
  kontrol;
}






