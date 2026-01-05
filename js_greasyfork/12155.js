// ==UserScript==
// @name         Google Logo Reviver (Chrome)
// @version      1.1
// @description  for the chrome users who hate every single change anybody makes
// @author       @Anth0ny62
// @match        *://*.google.tld/*
// @grant        GM_addStyle
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.js
// @namespace https://greasyfork.org/users/13403
// @downloadURL https://update.greasyfork.org/scripts/12155/Google%20Logo%20Reviver%20%28Chrome%29.user.js
// @updateURL https://update.greasyfork.org/scripts/12155/Google%20Logo%20Reviver%20%28Chrome%29.meta.js
// ==/UserScript==

var css = "._P7b {"                                                                                           +
            "left: 395px!important;"                                                                          +
            "top: 60px!important;"                                                                            +
          "}"                                                                                                 +
          "div#hplogo {"                                                                                      +
            "background: url(https://i.imgur.com/mB72ah9.png) no-repeat!important;"                           +
            "background-size: 285px 173px!important;"                                                         +
            "height: 173px!important;"                                                                        +
            "width: 285px!important;"                                                                         +
            "margin-top: -70px;"                                                                              +
          "}"                                                                                                 +
          ".init img#hplogo { padding-top: 55px!important; }"                                                 +
          "#hplogo div { left: 222px!important; top: 120px!important; }"                                      +
          ".nojsv.logocont #logo {"                                                                           +
            "height: 69.2px!important;"                                                                       +
            "width: 120px!important;"                                                                         +
            "left: -10px!important;"                                                                          +
            "top: -21px!important;"                                                                           +
          "}"                                                                                                 +
          "#logo img { top: 0; }"                                                                             +
          ".cur .csb {"                                                                                       +
            "background: url(http://i.imgur.com/cetTIuK.png) no-repeat!important;"                            +
            "background-position: -53px 0!important;"                                                         +
          "}"                                                                                                 +
          ".csb.ch {"                                                                                         +
            "background: url(http://i.imgur.com/cetTIuK.png) no-repeat!important;"                            +
            "background-position: -74px 0!important;"                                                         +
          "}"                                                                                                 +
          ".b.navend .csb {"                                                                                  +
            "background: url(http://i.imgur.com/cetTIuK.png) no-repeat!important;"                            +
            "background-position: -24px 0!important;"                                                         +
          "}"                                                                                                 +
          ".b.navend .csb.ch {"                                                                               +
            "background: url(http://i.imgur.com/cetTIuK.png) no-repeat!important;"                            +
            "background-position:-94px 0!important;"                                                          +
            "width: 73px!important;"                                                                          +
          "}"                                                                                                 +
          "#pnprev .csb.ch {"                                                                                 +
            "background: url(http://i.imgur.com/cetTIuK.png) no-repeat!important;"                            +
            "width: 53px!important;"                                                                          +
          "}"                                                                                                 ;

GM_addStyle(css);


$("#hplogo a:first img").attr("src", "https://i.imgur.com/mB72ah9.png");
$("img#hplogo").attr("src", "https://i.imgur.com/mB72ah9.png");

$(".init img#hplogo").attr("height", "152");

$(".nojsv.logocont #logo img").attr("width", "114");
$(".nojsv.logocont #logo img").attr("height", "69.2");
$(".nojsv.logocont #logo img").attr("src", "https://i.imgur.com/mB72ah9.png");