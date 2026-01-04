// ==UserScript==
// @name         Oof Focus
// @namespace    https://redcodi.space
// @version      0.12
// @description  OOF
// @author       Trash
// @match        https://*.pcsb.org/*
// @match        http://*.pcsb.org/*
// @supportURL   https://github.com/RealRedcodi/user-scripts/issues
// @homepage     https://github.com/RealRedcodi/user-scripts/tree/main/OofFocus
// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://greasyfork.org/scripts/407905-loggerjs/code/LoggerJS.js?version=831993
// @require      https://greasyfork.org/scripts/411028-oof-api/code/OOF%20API.user.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411024/Oof%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/411024/Oof%20Focus.meta.js
// ==/UserScript==

function msg() {
  //console.log("Work in progress");
  logger("This is a work in progress! Things might break!", "log");
  //swal("Warning", "This is a work in progress! Things might break!", "warning");
}
msg();

if (window.location.href.indexOf("focus") > -1) {
  //console.log("On Focus Placeholder");
  logger("Loaded on Focus", "log");
}