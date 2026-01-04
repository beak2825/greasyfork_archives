// ==UserScript==
// @name        janets decrapifier
// @namespace   Violentmonkey Scripts
// @match       https://www.janets.org.uk/*
// @grant       none
// @version     1.0
// @license     MIT
// @author      -
// @description 11/29/2022, 12:24:47 AM
// @downloadURL https://update.greasyfork.org/scripts/455633/janets%20decrapifier.user.js
// @updateURL https://update.greasyfork.org/scripts/455633/janets%20decrapifier.meta.js
// ==/UserScript==

function start(){
  console.clear();

  var counter = 2;
  observeDOM(document.body, function(m){

    var banner = null;
    m.forEach(record => {
      record.addedNodes.forEach(node => {
        if(node.classList && node.classList.contains("Campaign")){
          Delete(node);
          console.log("Deleted top crap");
          counter++;
        }
        if(node.id == "chat-widget-container"){
          Delete(node);
          console.log("Deleted chat crap");
          counter++;
        }
      });
    });

    if(banner){
      console.log(banner);
      banner.parentElement.removeChild(banner);
    }

    if(counter == 2){
      observeDOM = null;
    }
  });

  var chat = document.getElementById("chat-widget-container");
  Delete(chat);

  var money = document.getElementsByClassName("woocommerce-multi-currency")[0];
  Delete(money);

  var social = document.getElementsByClassName("col-sm-5")[0];
  Delete(social);

  var reviews = document.getElementsByClassName("col-sm-3")[0];
  Delete(reviews);

  var vbpcart = document.getElementsByClassName("vbpcart")[0];
  if(vbpcart && vbpcart.parentElement){
    Delete(vbpcart.parentElement);
  }

  var header = document.getElementsByTagName("header")[0];
  if(header && header.children.length > 1){ Delete(header.children[1]); }

  var member_header = document.getElementsByClassName("member_header")[0];
  Delete(member_header);

  //-------------------------------------------------

  var menu = document.getElementsByClassName("topmenu")[0];
  if(menu){
    menu.parentElement.parentElement.appendChild(menu);
    menu.style.marginTop = "-20px";
  }

  var topArea = document.getElementsByClassName("janets-top-area")[0];
  if(topArea){
    topArea.style.height = "33px";
  }

  var buttons = document.getElementById("object-nav");
  buttons.style.marginTop = "-5px";

  var container = document.getElementsByClassName("container")[0];
  container.style.height = "10px";

  var elementor = document.getElementsByClassName("elementor")[0];
  Delete(elementor);

  var notifButton = document.getElementById("notifications-personal-li");
  Delete(notifButton);

  var messageButton = document.getElementById("user-messages");
  Delete(messageButton);

  var giftButton = document.getElementById("user-gift");
  Delete(giftButton);

  var wishlistButton = document.getElementById("user-wishlist");
  Delete(wishlistButton);

  var ordersButton = document.getElementById("user-my-account");
  Delete(ordersButton);

  var subnav1 = document.getElementsByClassName("item-list-tabs")[0];
  var subnav2 = document.getElementsByClassName("item-list-tabs")[1];
  var subnav3 = document.getElementsByClassName("item-list-tabs")[2];

  if(subnav2){
    subnav2.style.position = "absolute";
    subnav2.style.marginTop = "-82px";
    subnav2.style.marginLeft = "600px";
    var sbut = document.getElementById('singleButton');
    if(!sbut){
    	subnav2.insertAdjacentHTML(
        "beforeend",
				`<button	id='singleButton'
        					style='padding:5px; border-radius:10px; margin:6px 290px;'
        					onclick='toggleHidden();'>Toggle search</button>`);
    }
  }

  if(subnav3){
    subnav3.classList.add("hidden");
    var hidden = document.createElement("style");
    hidden.innerHtml = ".hidden{ height: 0px; padding-top: 0px; margin: 0px; }";
    document.head.appendChild(hidden);
  }

  var dropMenu = document.getElementById("vibe_bp_login");
  if(dropMenu){ dropMenu.style.left = "943px"; dropMenu.style.top = "29px"; }

  var __campaign = document.getElementsByClassName("Campaign")[0];
  var __chat = document.getElementById("chat-widget-container");

  if(__campaign || __chat){
    Delete(__campaign);
    Delete(__chat);
    observeDOM = null;

    var html = document.getElementsByClassName("om-position-floating-top")[0];
    if(html){ html.style.paddingTop = 0; }
  }
}

function toggleHidden(){
  var subnav3 = document.getElementsByClassName("item-list-tabs")[2];
  if(subnav3.classList.contains("hidden")){
    subnav3.classList.remove("hidden");
  }else{
    subnav3.classList.add("hidden");
  }
}

function Delete(element, parent = null){
  if(element){
    parent = parent || element.parentElement;
    if(parent){
      parent.removeChild(element);
    }
  }
}

var observeDOM = (function(){
  console.log("observing");
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  return function( obj, callback ){
    if( !obj || obj.nodeType !== 1 ) return;

    if( MutationObserver ){
      // define a new observer
      var mutationObserver = new MutationObserver(callback)

      // have the observer observe foo for changes in children
      mutationObserver.observe( obj, { childList:true, subtree:true })
      return mutationObserver
    }

    // browser support fallback
    else if( window.addEventListener ){
      obj.addEventListener('DOMNodeInserted', callback, false)
      obj.addEventListener('DOMNodeRemoved', callback, false)
    }
  }
})()

window.onload = start;