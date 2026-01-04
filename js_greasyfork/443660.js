// ==UserScript==
// @name        Stream Elements TTS for Replika
// @namespace   Violentmonkey Scripts
// @match       https://my.replika.com/*
// @grant       none
// @version     1.27
// @author      -
// @description 19/4/2022, 22:41:21
// @downloadURL https://update.greasyfork.org/scripts/443660/Stream%20Elements%20TTS%20for%20Replika.user.js
// @updateURL https://update.greasyfork.org/scripts/443660/Stream%20Elements%20TTS%20for%20Replika.meta.js
// ==/UserScript==
setTimeout(function(){
  
// Configura el observer:
var config = { attributes: true, childList: true, characterData: true };

  
var target = document.querySelector('.ChatMessagesList__ChatMessagesListInner-sc-1ajwmer-1');

// Crea una instancia de observer
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    
    try {
      setTimeout(function(){
      const text = mutation.addedNodes[0].querySelector('div[data-testid="chat-message-text"]').innerText;
      const message = encodeURIComponent(text);
      
      var audio = new Audio(`https://api.streamelements.com/kappa/v2/speech?voice=Mia&text=${message}`);
      audio.play();
          },500)
    }
    catch (e) {
       console.log(e)
    }
   
  });
});

// pasa al observer el nodo y la configuracion
observer.observe(target, config);
  
},2000)