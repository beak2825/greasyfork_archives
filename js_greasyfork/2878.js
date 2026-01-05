// ==UserScript==
// @name        Pokaż długość filmu YT na wykop.pl
// @description Wyświetla czas trwania filmu w tytule znaleziska (Aktualizacja 2023)
// @namespace   Wykop scripts
// @include     *://www.wykop.pl/link/*
// @include     https://wykop.pl/link/*
// @version     1.52.1
// @license     MIT License
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2878/Poka%C5%BC%20d%C5%82ugo%C5%9B%C4%87%20filmu%20YT%20na%20wykoppl.user.js
// @updateURL https://update.greasyfork.org/scripts/2878/Poka%C5%BC%20d%C5%82ugo%C5%9B%C4%87%20filmu%20YT%20na%20wykoppl.meta.js
// ==/UserScript==

function getYTDuration()
{
 var timeWithLetters = false; // false -> [3:13:37]; true -> [3h13m37s]

   //if(document.getElementsByClassName("youtube-player vtop").length > 0)
   if(document.getElementsByClassName("wrapper")[0].getElementsByTagName('iframe').length > 0)
   {

      var yw, yh, yId, yIframe;

//      yIframe = document.getElementsByClassName("youtube-player vtop")[0];
      yIframe = document.getElementsByClassName("wrapper")[0].getElementsByTagName('iframe')[0];
      //yClone = yIframe.cloneNode(true);

      yw = yIframe.width;
      yh = yIframe.height;
      yId = yIframe.src.match(/https?\:\/\/www\.youtube\.com\/embed\/(.+?)\?.*/i)[1];

      yDiv = document.createElement('div');
      yDiv.id = 'playerYT';
      yDiv.style.display = 'none';
     
//      yIframe.parentNode.insertBefore(yDiv, yIframe);
     yIframe.parentNode.appendChild(yDiv);
//      yIframe.parentNode.removeChild(yIframe);
          
       var taggg = document.createElement('script');

         taggg.src = "https://www.youtube.com/iframe_api";
         var firstScriptTag = document.getElementsByTagName('script')[0];
         firstScriptTag.parentNode.insertBefore(taggg, firstScriptTag);

         var playerYT;
         function onYouTubeIframeAPIReady()
         {
           playerYT  = new YT.Player('playerYT', {
             height: yh,
             width: yw,
             videoId: yId,
             events: {
               'onReady': onPlayerReady
             }
           });
         }

         function onPlayerReady(event)
         {
           var dur, dh, dm, ds;
           event.target.playVideo();
           event.target.pauseVideo();
           dur = parseInt(event.target.getDuration())-1;
           ds = ('0' + (dur % 60)).slice(-2);
           dur = Math.floor(dur/60);
           dm = ('0' + (dur % 60)).slice(-2);
           dur = Math.floor(dur/60);
           dh = dur;
           if(timeWithLetters)
             document.getElementsByTagName('h1')[0].getElementsByTagName('a')[0].innerHTML = ('[' + dh + 'h' + dm + 'm' + ds +'s] ') + document.getElementsByTagName('h1')[0].getElementsByTagName('a')[0].innerHTML;
           else
             document.getElementsByTagName('h1')[0].getElementsByTagName('a')[0].innerHTML = ('[' + dh + ':' + dm + ':' + ds +'] ') + document.getElementsByTagName('h1')[0].getElementsByTagName('a')[0].innerHTML;
           event.target.stopVideo();
           var py = document.getElementById('playerYT');
           py.parentNode.removeChild(py);
      
//alert(event.target.getDuration());
         }
   }
}

function addJS_Node (funcToRun) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
   
    scriptNode.type                         = "text/javascript";
    scriptNode.textContent  =  funcToRun.toString().replace(/^function .*?\(\)[\s\S]\{/i, '').replace(/\}$/,'');
    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);

}

setTimeout(function(){
  if(document.getElementsByClassName('wrapper').length > 0)
	{
  	    addJS_Node(getYTDuration);;
	}
}, 3000);
