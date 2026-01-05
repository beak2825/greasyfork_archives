// ==UserScript==
// @name        Download original size pictures from Last.fm
// @namespace   http://www.last.fm
// @include     /last\.fm/
// @version     1.5
// @grant       none
// @description Adds a "Download" link to get the current original picture from Last.fm. Script by alin1.
// @downloadURL https://update.greasyfork.org/scripts/11697/Download%20original%20size%20pictures%20from%20Lastfm.user.js
// @updateURL https://update.greasyfork.org/scripts/11697/Download%20original%20size%20pictures%20from%20Lastfm.meta.js
// ==/UserScript==

var pageURLCheckTimer = setInterval(function(){
    if(this.lastPathStr !== location.pathname ||
        this.lastQueryStr !== location.search ||
        this.lastPathStr === null ||
        this.lastQueryStr === null
    ){
        this.lastPathStr  = location.pathname;
        this.lastQueryStr = location.search;

        setTimeout(function(){
            main();
        }, 1000);
    }
}, 200);

function main(){
  var i = window.location;
  i = i.toString();
  i = i.replace(i.substring(0, i.lastIndexOf('/')), '');
  i = i.replace('/', 'http://img2-ak.lst.fm/i/u/');
  
  var j = "\' style=\'margin-left:30px; font-family:Open Sans, Verdana, sans-serif; font-size:24px;\'>Download<\/a>";

  var k = document.createElement("a");
  k.innerHTML = "<a target=\'_blank\' href='" + i + j;
  document.getElementsByClassName("content-top-header")[0].appendChild(k);
}