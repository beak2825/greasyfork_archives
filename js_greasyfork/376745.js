// ==UserScript==
// @name        SIM-T Kittyfier
// @description Replace all images in SIM-T with random images of cats
// @version     6
// @include     https://t.corp.amazon.com/*
// @grant       none
// @namespace   Neamow
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require     https://greasyfork.org/scripts/376784-waitforkeyelementsneamow/code/waitForKeyElementsNeamow.js?version=1194139
// @downloadURL https://update.greasyfork.org/scripts/376745/SIM-T%20Kittyfier.user.js
// @updateURL https://update.greasyfork.org/scripts/376745/SIM-T%20Kittyfier.meta.js
// ==/UserScript==

waitForKeyElements ("div.badge-photo", function() {

  console.log("image switcher start");
  
  var ImageTags = document.querySelectorAll("div.badge-photo > img");
  
  console.log(ImageTags.length);
  
  var neededElements = [];
  
  for (var i = 0, length = ImageTags.length; i < length; i++) {
  	if (ImageTags[i].className.indexOf('top-nav-lse-button' || 'top-nav-product-logo') != 0) {
      neededElements.push(ImageTags[i]);
    }
  }
  
  var Links = [
    "https://i.imgur.com/wiI5Zcf.png",
    "https://i.imgur.com/cvxVbia.png",
    "https://i.imgur.com/lrawrSt.png",
    "https://i.imgur.com/QqPuns3.png",
    "https://i.imgur.com/WyITkwX.jpg",
    "https://i.imgur.com/G8mSNdl.png",
    "https://i.imgur.com/IpzQ6e4.jpg",
    "https://i.imgur.com/HlljmXK.png",
    "https://i.imgur.com/2iJnDSm.png",
    "https://i.imgur.com/4xklRq1.png"
  ];
  var Size = Links.length;

  for( var i = 0; i < neededElements.length; i++ )
  {
  var x = Math.floor(Size*Math.random());
  neededElements[i].src = Links[x];
  console.log("image switcher within loop");
  }

	}
)