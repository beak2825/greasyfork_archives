// ==UserScript==
// @name        4chan - Redirect 404s to Archive
// @namespace   user@user
// @include     *://boards.4chan.org/*/thread/*
// @description Redirects dead thread links to archives
// @grant       none
// @run-at      document-end
// @version 0.0.1.20181113090434
// @downloadURL https://update.greasyfork.org/scripts/374312/4chan%20-%20Redirect%20404s%20to%20Archive.user.js
// @updateURL https://update.greasyfork.org/scripts/374312/4chan%20-%20Redirect%20404s%20to%20Archive.meta.js
// ==/UserScript==
var dead = document.evaluate('//title[text()="4chan - 404 Not Found"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

if (dead.singleNodeValue) {
  var url = window.location.href;
  var res = url.split("/");
  var board = res[3];
  var thread = res[5];
  switch(board) {
    case "b":
      var archive = "thebarchive.com";
      break;
    case "asp":
    case "cm":
    case "h":
    case "hc":
    case "hm":
    case "n":
    case "p":
    case "qa":
    case "r":
    case "s":
    case "soc":
    case "toy":
    case "y":
    case "a":
    case "an":
    case "biz":
    case "c":
    case "co":
    case "diy":
    case "fit":
    case "gd":
    case "gif":
    case "i":
    case "int":
    case "jp":
    case "k":
    case "m":
    case "mlp":
    case "out":
    case "po":
    case "r9k":
    case "s4s":
    case "sci":
    case "tg":
    case "tv":
    case "u":
    case "v":
    case "vg":
    case "vp":
    case "vr":
    case "wsg":
    case "adv":
    case "f":
    case "hr":
    case "o":
    case "pol":
    case "trv":
    case "x":
    case "3":
    case "cgl":
    case "ck":
    case "fa":
    case "g":
    case "ic":
    case "lit":
    case "mu":
    case "w":
    case "d":
    case "e":
    case "lgbt":
    case "t":
    case "wg":
    case "sp":
      var archive = "archived.moe";
      break;
    default:
      console.log("4chan redirect: no archive specified for board /" + board + "/");
      throw alert("no archive specified for board /" + board + "/");
  }
  window.location = "https://" + archive + "/" + board + "/thread/" + thread;
}