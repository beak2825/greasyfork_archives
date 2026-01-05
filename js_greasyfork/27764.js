// ==UserScript==
// @name         UploadCrazy Navigation With PgUp/PgDown + Ad remover
// @version      2
// @description  Navigate through episodes with PgUp/PgDown.
// @author       jsutilities
// @namespace    jsutilities
// @include      http://uploadcrazy.net/embed.php?file=*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/27764/UploadCrazy%20Navigation%20With%20PgUpPgDown%20%2B%20Ad%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/27764/UploadCrazy%20Navigation%20With%20PgUpPgDown%20%2B%20Ad%20remover.meta.js
// ==/UserScript==
var url = location.href;
var numsize = 0;
function getnumber() {
  var numstr = url.match(/\d*(?=($|&))/)[0];
  numsize = numstr.length;
  return parseInt(numstr);
}
function padnum(num){
  var numstr = "" + num;
  var padding = "";
  for(var i = 0; i < numsize-numstr.length; i++) padding+="0";
  return padding+numstr;
}
function nextepisode() {
  var num = getnumber();
  location.href = url.replace(/\d*(?=($|&))/, padnum(num+1));
}
function previousepisode() {
  var num = getnumber();
  if (num > 0) {
    location.href = url.replace(/\d*(?=($|&))/, padnum(num-1));
  } 
  else alert('No more episodes');
}
document.onkeypress = function (event) {
  if (url.search('file=')) {
    var key = event.keyCode;
    if (key == 33) {
      nextepisode();
    }
    if (key == 34) {
      previousepisode();
    }
  }
}