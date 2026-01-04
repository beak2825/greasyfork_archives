// ==UserScript==
// @name        Japanese Theme for moomoo
// @namespace    -
// @version      1.0
// @description  I create themes for moomoo.io these that look hella good 😂
// @author       Yaya
// @match        *://moomoo.io/*
// @match       *://sandbox.moomoo.io/*
// @grant       [Nothing]
//@icon 
//@require http://greasyfork.org/scripts/368273-msgpack/code/msgpack.js?version=598723
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js

// @downloadURL https://update.greasyfork.org/scripts/405042/Japanese%20Theme%20for%20moomoo.user.js
// @updateURL https://update.greasyfork.org/scripts/405042/Japanese%20Theme%20for%20moomoo.meta.js
// ==/UserScript==

$("#consentBlock").css({display: "none"});
//$("#youtuberOf").css({display: "none"});
$("#mapDisplay").css({background: `url('https://i.imgur.com/fgFsQJp.png')`});

$("#mainMenu").css("background", "url('https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTo7m4O9N4t1gvj5xu9-A8rpXjCjLzzL_bXsE6BsSar9iOL--J9&usqp=CAU");

document.getElementById("moomooio_728x90_home").style.display = "none";
$("#moomooio_728x90_home").parent().css({display: "none"});