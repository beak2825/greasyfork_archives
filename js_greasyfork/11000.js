// ==UserScript==
// @name        [4chan] Redirect 404s to Archive
// @namespace   user@user
// @include     *://boards.4chan.org/*/thread/*
// @version     1.1
// @date        2015-07-26
// @description Redirects dead thread links to archives
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/11000/%5B4chan%5D%20Redirect%20404s%20to%20Archive.user.js
// @updateURL https://update.greasyfork.org/scripts/11000/%5B4chan%5D%20Redirect%20404s%20to%20Archive.meta.js
// ==/UserScript==
var dead = document.evaluate('//title[text()="4chan - 404 Not Found"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

if (dead.singleNodeValue) {
  var url = window.location.href;
  var res = url.split("/");
  var board = res[3];
  var thread = res[5];
  switch(board) {
    case "asp":
    case "b":
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
      var archive = "fgts.jp";
      break;
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
      var archive = "archive.moe";
      break;
    case "adv":
    case "f":
    case "hr":
    case "o":
    case "pol":
    case "trv":
    case "x":
      var archive = "4plebs.org";
      break;
    case "3":
    case "cgl":
    case "ck":
    case "fa":
    case "g":
    case "ic":
    case "lit":
      var archive = "warosu.org";
      break;
    case "mu":
    case "w":
      var archive = "archive.rebeccablacktech.com";
      break;
    case "d":
    case "e":
    case "lgbt":
    case "t":
      var archive = "archive.loveisover.me";
      break;
    case "wg":
      var archive = "archive.nyafuu.org";
      break;
    case "sp":
      var archive = "totally.not4plebs.org";
      break;
    default:
      console.log("4chan redirect: no archive specified for board /" + board + "/");
      throw alert("no archive specified for board /" + board + "/");
  }
  window.location = "https://" + archive + "/" + board + "/thread/" + thread;
}