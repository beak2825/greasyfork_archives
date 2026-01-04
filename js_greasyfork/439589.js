// ==UserScript==
// @name       BloodyMod
// @namespace    -
// @version    2
// @description by MaximumTears#4440
// @author       MaximumTears
// @match        *://sandbox.moomoo.io/*
// @match        *://moomoo.io/*
// @grant        none
// @require https://greasyfork.org/scripts/368273-msgpack/code/msgpack.js?version=598723
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/439589/BloodyMod.user.js
// @updateURL https://update.greasyfork.org/scripts/439589/BloodyMod.meta.js
// ==/UserScript==

$("#consentBlock").css({display: "none"});
//$("#youtuberOf").css({display: "none"});
$("#mapDisplay").css({background: `url('https://i.imgur.com/fgFsQJp.png')`});

document.getElementById("moomooio_728x90_home").style.display = "none";
$("#moomooio_728x90_home").parent().css({display: "none"});