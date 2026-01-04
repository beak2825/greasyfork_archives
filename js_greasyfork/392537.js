// ==UserScript==
// @name        xhamster download video
// @namespace   http://57utjhgkkyuj.com
// @include     https://xhamster.com/videos/*
// @include     https://*.xhamster.com/videos/*
// @version     2.0
// @grant       none
// @description Download videos from xhamster.com
// @downloadURL https://update.greasyfork.org/scripts/392537/xhamster%20download%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/392537/xhamster%20download%20video.meta.js
// ==/UserScript==


var s = document.getElementsByTagName('script');

for (var a=0; a<s.length; a++) {
  if (s[a].innerHTML.indexOf('window.initials')!=-1) {
    var ih = s[a].innerHTML.toString();
    var link = ih.split('"mp4File"')[1].split('"')[1].split('"')[0];
    var nlink = ih.split('"sources"')[1].split('"download"')[1];
    var nnlink, nnlink1, nnlink2 = null;
    try {
      nnlink1 = nlink.split('"480p"')[1].split('"link"')[1].split('"')[1];
      nnlink1 = unescape(nnlink1);
    } catch(e) {}
    try {
        nnlink2 = nlink.split('"240p"')[1].split('"link"')[1].split('"')[1];
        nnlink2 = unescape(nnlink2);
      }
      catch(e) {}
    
    link = unescape(link);
    break;
  }
  
}

link = link.replace(/\\/g, "");



if (nnlink1 != null) {
  nnlink1 = nnlink1.replace(/\\/g, "");
  var c1 = document.createElement("div");
  c1.id="480download";
c1.style='display: block; z-index:10001 !important; font-size:108%; line-height:108%; color: #ffffff; background-color: #222222; border: 2px solid #7f7ebe; margin-left: auto; margin-right:auto; text-align:center; font-weight:bold;'
c1.innerHTML = "<a href='"+nnlink1+"' style='color: #ffffff; background-color: #222222; margin-right:auto; margin-left:auto; align:center;'>Download 480p Video</a>"
if (!document.getElementById("480download")) {
  document.body.insertBefore(c1, document.body.firstChild);
 }
}

if (nnlink2 != null) {
  nnlink2 = nnlink2.replace(/\\/g, "");
  var c2 = document.createElement("div");
  c2.id="240download";
c2.style='display: block; z-index:10001 !important; font-size:108%; line-height:108%; color: #ffffff; background-color: #222222; border: 2px solid #7f7ebe; margin-left: auto; margin-right:auto; text-align:center; font-weight:bold;'
c2.innerHTML = "<a href='"+nnlink2+"' style='color: #ffffff; background-color: #222222; margin-right:auto; margin-left:auto; align:center;'>Download 240p Video</a>"
if (!document.getElementById("240download")) {
  document.body.insertBefore(c2, document.body.firstChild);
}
}

var c = document.createElement("div");
c.id="defaultdownload";
c.style='display: block; z-index:10001 !important; font-size:108%; line-height:108%; color: #ffffff; background-color: #222222; border: 2px solid #7f7ebe; margin-left: auto; margin-right:auto; text-align:center; font-weight:bold;'
c.innerHTML = "<a href='"+link+"' style='color: #ffffff; background-color: #222222; margin-right:auto; margin-left:auto; align:center;'>Download Video</a>"
if (!document.getElementById("defaultdownload")) {
  document.body.insertBefore(c, document.body.firstChild);
}
