// ==UserScript==
// @name        Fix Images on Present Day HTML
// @namespace   http://ewg
// @include     http://*
// @include     https://*
// @version     1.0.1
// @description Show all images on modern webpages
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/33575/Fix%20Images%20on%20Present%20Day%20HTML.user.js
// @updateURL https://update.greasyfork.org/scripts/33575/Fix%20Images%20on%20Present%20Day%20HTML.meta.js
// ==/UserScript==

imgs = document.getElementsByTagName("img");
for (var x=0; x< imgs.length; x++) {
  var t = imgs[x].getAttribute("src");
  if (t==null) {
    var t1 = imgs[x].getAttribute("data-src");
    var t2 = imgs[x].getAttribute("content");
    if (t1!= null && t1 != "") {
      imgs[x].setAttribute("src", t1)
    } else if (t2!= null && t2 != "") {
      imgs[x].setAttribute("src", t2)
    }
  }
  else if (t.indexOf("base64")!=-1) {
    try {
     var t3 = imgs[x].getAttribute("data-lazy-src");
     var ni = document.createElement("img");
     ni.src = t3;
     if (t3!=null) {
      imgs[x].parentNode.appendChild(ni);
     }
    } catch(e) {}
    try {
     var t3 = imgs[x].getAttribute("data-src");
     var ni = document.createElement("img");
     ni.src = t3;
     if (t3!=null) {
      imgs[x].parentNode.appendChild(ni);
     }
    } catch(e) {}
  }
}

imgs2 = document.getElementsByTagName("span");
for (var x=0; x< imgs2.length; x++) {
  if (imgs2[x].getAttribute("data-image")) {
    var dsac = document.createElement("img");
    dsac.setAttribute("src", imgs2[x].getAttribute("data-image"));
    imgs2[x].appendChild(dsac);
  }
}

imgs3 = document.getElementsByTagName("div");
for (var x=0; x< imgs3.length; x++) {
if (imgs3[x].getAttribute("data-image")) {
    var dsac = document.createElement("img");
    dsac.setAttribute("src", imgs3[x].getAttribute("data-image"));
    imgs3[x].appendChild(dsac);
  }
}

imgs4 = document.getElementsByTagName("amp-img");
for (var x=0; x< imgs4.length; x++) {
if (imgs4[x].getAttribute("src")) {
    var dsac = document.createElement("img");
    dsac.setAttribute("src", imgs4[x].getAttribute("src"));
    imgs4[x].parentNode.appendChild(dsac);
  }
}