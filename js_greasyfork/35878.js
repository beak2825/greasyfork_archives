// ==UserScript==
// @name         m.facebook.com notification for Firefox Android
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Push a notification when a message comes. This script only works on Android Firefox.
// @author       Psyblade
// @match        https://m.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35878/mfacebookcom%20notification%20for%20Firefox%20Android.user.js
// @updateURL https://update.greasyfork.org/scripts/35878/mfacebookcom%20notification%20for%20Firefox%20Android.meta.js
// ==/UserScript==

function notifyMe() {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support system notifications");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var options = {
             body: 'Touch here to open Facebook',
             vibrate: [200,200]
        }
        var notification = new Notification("New message!",options);
        setTimeout(notification.close.bind(notification), 5000); 
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var options = {
             body: 'Touch here to open Facebook',
             vibrate: [200,200]
        }
        var notification = new Notification("New message!",options);
        setTimeout(notification.close.bind(notification), 5000); 
      }
    });
  }

  // Finally, if the user has denied notifications and you 
  // want to be respectful there is no need to bother them any more.
}

//Disable page visibility api to make browser play sound even when browser is off to the bottom, or when the active web tab is not Facebook.
Object.defineProperties(document.wrappedJSObject,{ 'hidden': {value: false}, 'visibilityState': {value: 'visible'} });
window.addEventListener( 'visibilitychange', evt => evt.stopImmediatePropagation(), true);

//Add event listener to element #2 of classes named "_59tg". Event will fire if the web browser detects changes in inner HTML of that element.
document.getElementsByClassName("_59tg")[2].addEventListener("DOMNodeInserted", function(){
        var b =  document.getElementsByClassName("_59tg");
    //If there is a mess, then its inner HTML of this element will be something, like "1","2" or "3".... except "0"
        if(b[2].innerHTML != "0")
        {
                notifyMe();
        }
});