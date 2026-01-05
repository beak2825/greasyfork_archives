// ==UserScript==
// @name        Google Bangs
// @namespace   Google Bangs
// @description Easily add DuckDuckGo bangs to Google.
// @include     *.google.com/search*
// @include     *.google.com/webhp*
// @version     1.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11111/Google%20Bangs.user.js
// @updateURL https://update.greasyfork.org/scripts/11111/Google%20Bangs.meta.js
// ==/UserScript==

var bangs=[],search=document.getElementById('lst-ib').value;

//BANGS
new Bang('yt','https://youtube.com/feed/subscriptions','https://www.youtube.com/results?search_query=','+');
new Bang('ddg','https://duckduckgo.com','https://duckduckgo.com/?q=','+');
new Bang('so','https://stackoverflow.com','http://stackoverflow.com/search?q=','+');
new Bang('imdb','http://imdb.com','http://www.imdb.com/find?s=all&q=','+');
new Bang('rt','http://rottentomatoes.com','http://www.rottentomatoes.com/m/','_');
new Bang('rts','http://rottentomatoes.com','http://www.rottentomatoes.com/search/?search=','+');
new Bang('mc','http://minecraft.gamepedia.com/Minecraft_Wiki','http://minecraft.gamepedia.com/index.php?search=','+');
new Bang('sc','https://soundcloud.com','https://soundcloud.com/search?q=','%20');
new Bang('wot','https://mywot.com','https://www.mywot.com/scorecard/','');
new Bang('gm','https://mail.google.com','https://mail.google.com/mail/u/#search/','+');
new Bang('isup','http://isup.me','http://isup.me/','');
new Bang('gh','https://github.com','https://github.com/search?q=','+');
new Bang('gf','https://greasyfork.org/scripts','https://greasyfork.org/scripts/search?q=','+');
//BANGS

for(var i in bangs){
  var bang=bangs[i];
  if(search.substr(0,bang.bang.substr(1).length+1)==bang.bang){
    if(bang.urlSearch&&search.indexOf(' ')>=0)location.assign(bang.urlSearch+search.substr(bang.bang.length+1).replace(new RegExp(' ','g'),bang.spaceReplace));
    else location.assign(bang.urlEmpty);
  }
}

function Bang(bang,urlEmpty,urlSearch,spaceReplace){
  this.bang='!'+bang;
  this.urlEmpty=urlEmpty;
  this.urlSearch=urlSearch;
  this.spaceReplace=spaceReplace;
  bangs.push(this);
}