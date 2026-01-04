// ==UserScript==
// @name         WhatsApp Web VA-11 Hall-A Theme
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Dark Theme for whatsapp
// @author       Damakuno
// @match        https://web.whatsapp.com/
// @include      https://web.whatsapp.com/
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/39739/WhatsApp%20Web%20VA-11%20Hall-A%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/39739/WhatsApp%20Web%20VA-11%20Hall-A%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';
var css = `
        @namespace url(http://www.w3.org/1999/xhtml);
        * {

        }
body{
background-image: url("https://i.imgur.com/FFsSHHt.png");
 background-size: contain;
}
html[dir] ._1FKgS::after {
 background-color: #014a43b8;
}
html[dir] .bFqKf::-webkit-scrollbar-track, html[dir] .bN4GZ::-webkit-scrollbar-track{
 background-color: #009262b8;
}
.pane-chat-tile {
opacity: 1;
background-image:url("https://i.imgur.com/x0tkw5E.gif") !important;
background-size: cover;
background-position: 60% 0%;
}
._3zJZ2{
background-image:url("https://i.imgur.com/x0tkw5E.gif") !important;
background-size: cover;
background-position: 60% 0%;
}

html[dir] ._1GX8_{

}
html[dir=ltr] ._1i1U7.jZ4tp {
  background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, #ffffff45 50%); }
  html[dir=rtl] ._1i1U7.jZ4tp {
  background: linear-gradient(to left, rgba(255, 255, 255, 0) 0%, #ffffff45 50%); }
  html[dir=ltr] ._1i1U7._2DNgV {
  background: linear-gradient(to right, rgba(220, 248, 198, 0) 0%, #ffffff45 50%); }
  html[dir=rtl] ._1i1U7._2DNgV {
  background: linear-gradient(to left, rgba(220, 248, 198, 0) 0%, #ffffff45 50%); }

html[dir] .message-in{
  background-color: #5d90ce; }

html[dir] .message-out{
  background-color: #dc4283; }

._3_7SH {
  font-family: "Open Sans", sans-serif;
  font-size: 13.6px;
  line-height: 19px;
  color: #f3f3f3;
  position: relative; }

html[dir=ltr] ._3Ye_R {
  color: #fff !important;
  margin-left: 8px; }

html[dir=rtl] ._3Ye_R {
  color: #fff !important;
  margin-right: 8px; }

html[dir] .message-out a{
  color:aliceblue;}

html[dir] .message-in a{
  color:aliceblue;}

html[dir] ._1iJeo {
  background-color: rgba(255, 255, 255, 0.42);}

html[dir] .Zq3Mc{background-color: rgba(37, 228, 87, 0.92); }
html[dir] ._2uLFU, html[dir] ._1ArIP {background-color: #00a5a4cc;}

._2dGjP {color: #ececec;}

html[dir] ._28zBA._14ou2 {background-color: #006d6dc9; }

.message-in .tail-container,.message-in.tail-override-right .tail-container,.message-out.tail-override-right .tail-container,.message-in.tail-override-left .tail-container {
    background-image: url(https://i.imgur.com/GR0Jgun.png);
}

.message-out .tail-container {
    background-image: url(https://i.imgur.com/VMOvuLd.png);
}
.rAUz7 span{
  color: #fff !important;
}
.rAUz7 span svg {
    fill:currentColor !important;
}
`
;

    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        heads[0].appendChild(node);
    } else {
        // no head yet, stick it whereever
        document.documentElement.appendChild(node);
    }


})();