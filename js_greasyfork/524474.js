// ==UserScript==
// @name        Poster collection
// @namespace   Poster collection
// @description Play a sound if Poster collection is in stock
// @version     1.4
// @include 	https://www.target.com/p/pok-233-mon-trading-card-game-scarlet-38-violet-8212-twilight-masquerade-elite-trainer-box/-/A-91619960
// @include 	https://www.target.com/cart
// @include     https://www.target.com/checkout
// @author      willhe
 
// @downloadURL https://update.greasyfork.org/scripts/524474/Poster%20collection.user.js
// @updateURL https://update.greasyfork.org/scripts/524474/Poster%20collection.meta.js
// ==/UserScript==
 
//LOAD LEAVE THE BROWSER ON THIS PAGE:https://www.target.com/p/pok-233-mon-trading-card-game-scarlet-38-violet-8212-twilight-masquerade-elite-trainer-box/-/A-91619960
 
  setTimeout(function(){
    if (document.getElementById('addToCartButtonOrTextIdFor91619960') && !document.getElementById('addToCartButtonOrTextIdFor91619960').disabled)
    {
        document.getElementById('addToCartButtonOrTextIdFor91619960').click()
        window.location = 'https://www.target.com/cart'
    }
    else if(document.querySelector(`[data-test="cartItem-qty"]`)) {
        document.querySelector(`[data-test="cartItem-qty"]`).value = '3'
        document.querySelector(`[data-test="checkout-button"]`).click()
    }
    else if(document.querySelector(`[data-test="placeOrderButton"]`)) {
        document.querySelector(`[data-test="placeOrderButton"]`).click()
    }
    else {
        setTimeout(function(){ location.reload(); }, 10*1000);
    }
  }, 5*1000)