// ==UserScript==
// @name        restore downloads on vimm
// @namespace   Ueah
// @match       https://vimm.net/vault/*
// @grant       none
// @license     MIT
// @version     1.0
// @author      fisterfouch
// @description edits the vimm.net pages affected by the recent DMCA troll to bring back the download button, albeit with some missing functionality
// @downloadURL https://update.greasyfork.org/scripts/495207/restore%20downloads%20on%20vimm.user.js
// @updateURL https://update.greasyfork.org/scripts/495207/restore%20downloads%20on%20vimm.meta.js
// ==/UserScript==
if (document.body.innerHTML.indexOf("Download, box art, and screen shots unavailable at the request of Nintendo of America") != -1) {
  //sorry for my stupid variable names
  //this script finds the ID of the latest revision of the game whose page you're on, finds the index of the takedown notice,
  //and replaces the takedown notice with the download element, which is taken from a working page and edited to use the ID found earlier.
  var shit = allMedia[allMedia.length - 1].ID;
  var indexofAss = document.body.innerHTML.indexOf("Download, box art, and screen shots unavailable at the request of Nintendo of America");
  var goodBitA = document.body.innerHTML.substring(0, indexofAss);
  var goodBitB = document.body.innerHTML.substring(indexofAss + 85);
  var MissingBit = "<table style=\"width:100%\"><tr id=\"download-row\"><td style=\"width:33%\"></td><td style=\"width:34%\"><form action=\"//download3.vimm.net/download/\" method=\"POST\" id=\"download_form\" onsubmit=\"return submitDownload(this, 'tooltip4')\"><input type=\"hidden\" name=\"mediaId\" value=\"" + shit + "\"><input type=\"hidden\" name=\"alt\" value=\"0\" disabled><button type=\"submit\" style=\"width:100%\">Download</button></form></td><td style=\"width:33%; text-align:center\" id=\"download_size\">IDK MB</td></tr><tr id=\"upload-row\" style=\"display:none\"><td colspan=\"3\" style=\"text-align:center\"><span class=\"redBorder\">&#x26a0;</span> Download unavailable <span class=\"redBorder\">&#x26a0;</span><div style=\"margin-top:10px\">Do you have this game?<br><a href=\"/vault/2754/?p=upload\" onclick=\"upload('download_form'); return false\">Upload it to The Vault</a></div></td></tr></table><div style=\"margin-top:2px\"><button type=\"button\" title=\"Play Online\" onclick=\"location.href='/vault/?p=play&mediaId=' + document.forms['download_form'].elements['mediaId'].value\" style=\"width:33%\">Play Online</button></div>";
  document.body.innerHTML = goodBitA + MissingBit + goodBitB;
}