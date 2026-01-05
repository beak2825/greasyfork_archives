// ==UserScript==
// @name        URL_Shortener_Script
// @namespace   Рианти
// @description По нажатию клавиш ctrl+Q с любой веб страницы создает короткую ссылку на нее в сервисе goo.gl и копирует в буфер обмена
// @include     *
// @version     1
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/15940/URL_Shortener_Script.user.js
// @updateURL https://update.greasyfork.org/scripts/15940/URL_Shortener_Script.meta.js
// ==/UserScript==

try{

var keyToCode = [];
for (var i = 48; i <= 57; i++) keyToCode[String.fromCharCode(i)] = i;
for (var i = 65; i <= 90; i++) keyToCode[String.fromCharCode(i)] = i;

window.addEventListener('keydown',function(e){
   if(e.keyCode == keyToCode['Q'] && e.ctrlKey){
       e.preventDefault();
       requestShortening (window.location.href, function(shortURL){
           presentShortenedURL(shortURL);
       });
   }
});

var div = document.createElement('div');
div.innerHTML = '<div id="urlShortenerDiv" style="position: fixed; width: 100%; height: 100%; left: 0px; top: 0px; background-color: white; opacity: 0.8; align-content: center; z-index: 999; visibility: hidden;"><div valign="center" style="margin: 0px -50% 0px 0px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 22px;" align="center">Короткая ссылка скопирована в буфер<br><br><i id="urlShortenerDivInner" style="visibility: inherit;"></i></div></div>';
document.body.appendChild(div);

} catch (e) { console.log(e) }

function presentShortenedURL(link){
  try{
  new Audio('http://www.soundjay.com/button/button-15.mp3').play();
  document.querySelector('#urlShortenerDivInner').innerHTML = link;
  document.querySelector('#urlShortenerDiv').style['visibility'] = 'inherit';
  setTimeout(function(){
    document.querySelector('#urlShortenerDiv').style['visibility'] = 'hidden';
  }, 1000);
  GM_setClipboard (link);
  console.log(link);
  } catch (er) { console.log(er) }
}

function requestShortening (pageURL, onloadHandler){
    console.log('[URL_Shortener_Script] creating shortcut for: ', pageURL);
    try{
      GM_xmlhttpRequest({
        method: "POST",
        synchronous: false,
        url: "https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyCKraBCeTbm_ZmaQNZ5LZ3Fej_YNUIxKeg",
        data: JSON.stringify({ longUrl: pageURL }),
        headers: { "Content-Type": "application/json" },
        onload: function(response) {
          onloadHandler(JSON.parse(response.responseText).id);
        },
        onerror: function(){ setTimeout( function() { requestPage (url, onloadHandler) }, 500 ) },
        ontimeout: function(){ requestPage (url, onloadHandler) },
        timeout: 5000
      });
    } catch (e) {
        console.log(e);
    }
}