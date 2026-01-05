// ==UserScript==
// @name        imgur to embed.ly redirector
// @namespace   helloworld
// @description replaces all imgur links on reddit with embed.ly
// @include     https://*.reddit.com/*
// @include     https://reddit.com/*
// @include     http://*.reddit.com/*
// @include     http://reddit.com/*
// @version     1.0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19432/imgur%20to%20embedly%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/19432/imgur%20to%20embedly%20redirector.meta.js
// ==/UserScript==
var a = document.getElementsByTagName('a');
var addThisExt = ".jpg";
var addThisGfyCatExt = "-mobile.mp4";
for (i = 0; i < a.length; i++) {
  p = /imgur\.com\/([\a/[A-Za-z0-9]+|[A-Za-z0-9]+)/;
  p2 = /gfycat\.com\/([a-z0-9]*)/;
  res = p.exec(a[i]);
  if (res !== null) {
    res2 = res[1].replace("a/","");
    //res2 = res[1].replace(".gifv",".webm");
    if (a[i].href.indexOf(addThisExt, this.length - addThisExt.length) == -1){a[i].href = a[i].href + addThisExt;}
    a[i].href = 'https://i-cdn.embed.ly/1/display?key=fd92ebbc52fc43fb98f69e50e7893c13&url=' + a[i];
    a[i].href = a[i].href.replace(".gifv",".webm");
  }
    /*else if (res == null){
        res = p2.exec(a[i]);
        if(res != null)
        {
            a[i].href = a[i].href.replace("gfycat.com","thumbs.gfycat.com");
            a[i].href = a[i].href + addThisGfyCatExt;
            a[i].href = 'https://i-cdn.embed.ly/1/display?key=fd92ebbc52fc43fb98f69e50e7893c13&url=' + a[i].href;

        }
    }
  */
}
var a_col = document.getElementsByTagName('a');
var ab, actual_fucking_url;
for(var i = 0; i < a_col.length; i++) {
  ab = a_col[i];
  actual_fucking_url = ab.getAttribute('href');
  if(actual_fucking_url)
  {
      ab.setAttribute('data-outbound-url', actual_fucking_url);
      ab.setAttribute('data-href-url', actual_fucking_url);
  }
}