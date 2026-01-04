// ==UserScript==
// @name          CoinbaseNeoSonicLight
// @version       1.0.0
// @description   Allège l'écran de coinbase
// @include       https://pro.coinbase.com/trade/*
// @namespace https://greasyfork.org/users/162124
// @downloadURL https://update.greasyfork.org/scripts/422604/CoinbaseNeoSonicLight.user.js
// @updateURL https://update.greasyfork.org/scripts/422604/CoinbaseNeoSonicLight.meta.js
// ==/UserScript==
(function() {
  // Pour activer les debug console
  var  debug = true;
  console.debug('toto');
  
  // Récupère un élément qui contient une partie du nom d'une classe
  function getElementByTagNameLike(tag) {
    if(debug) console.debug('getElementByTagNameLike debut : ' + tag);
    var xpathResult = document.evaluate( "//*[contains(@class,'" + tag + "')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
    if(!xpathResult) {
      if(debug) console.debug('getElementByTagNameLike non trouvé : ' + tag);
      return null;
    }
    if(debug) console.debug('getElementByTagNameLike fin : ' + tag);
    return xpathResult;
  }
  
  // Suppression des zones inutiles pour alléger l'écran
  function nettoyageEcran() {
    if(debug) console.debug("nettoyageEcran 0");
    
    // OrderBook
    document.getElementsByName('order-book')[0].remove();
    document.getElementsByName('chart')[0].style.marginLeft = "-313px";
    document.getElementsByName('orders')[0].style.marginLeft = "-313px";
    
    // Trade History
    document.getElementsByName('trade-history')[0].remove();
    document.getElementsByName('chart')[0].style.marginRight = "-285px";
    document.getElementsByName('fills')[0].style.marginRight = "-285px";
    
    // Mid Market Place
    document.getElementsByName('chart')[0].childNodes[0].childNodes[1].childNodes[0].childNodes[1].remove();
    
    // IGraal
    document.getElementById('igraal-notification').remove();
    document.body.style.marginTop = 0;
    
    
    
  }
  
  window.setTimeout(function () {
  	nettoyageEcran()  
  }, 8000);
   
  
  })();