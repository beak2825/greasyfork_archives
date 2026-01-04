// ==UserScript==
// @name        Pogdesign TV Calendar Tweaks
// @namespace   driver8.net
// @description Compact everything and fix display of shows on current day
// @match       *://*.pogdesign.co.uk/cat/*
// @version     0.1
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/37825/Pogdesign%20TV%20Calendar%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/37825/Pogdesign%20TV%20Calendar%20Tweaks.meta.js
// ==/UserScript==

var usrStyle =
'.today .firstep { /* season first episode bg colour */ \
  border: 1px solid rgba(37,186,195,0.99); \
  box-shadow: inset 0px 0px 25px rgba(37,186,195,0.99), 0px 0px 5px rgba(37,186,195,0.99); \
  background-color: rgba(37,186,195,0.25);  \
  padding: 0 0 0 3px !important; \
  margin: 1px 1px 1px 1px !important; \
} \
.today .vfirstep { /* very first episode bg colour */\
  border: 1px solid rgba(250,220,100,0.99);\
  box-shadow: inset 0px 0px 25px rgba(250,220,100,0.99), 0px 0px 5px rgba(250,220,100,0.99);\
  background-color: rgba(250,220,100,0.25);\
  padding: 0 0 0 3px !important;\
  margin: 1px 1px 1px 1px !important;\
}\
.today .lastep { /* season last episode bg colour */\
  border: 1px solid rgba(200,50,50,0.99);\
  box-shadow: inset 0px 0px 25px rgba(200,50,50,0.99), 0px 0px 5px rgba(200,50,50,0.99);\
  background-color: rgba(200,50,50,0.25);\
  padding: 0 0 0 3px !important;\
  margin: 1px 1px 1px 1px !important;  \
}\
#month_box .ep span { margin: 0px 0 0px 0; } \
#month_box p { width: auto; }\
.day p a, .today p a { display: inline; }';

GM_addStyle(usrStyle);