// ==UserScript==
// @name        Bing Bangs
// @namespace   Bing Bangs
// @description 向必应Bing添加DuckDuckGo的Bang特性。
// @include     *.bing.com/search*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/40572/Bing%20Bangs.user.js
// @updateURL https://update.greasyfork.org/scripts/40572/Bing%20Bangs.meta.js
// ==/UserScript==

var bangs=[],search=document.getElementById('sb_form_q').value;

//BANGS
new Bang('yt','https://youtube.com/feed/subscriptions','https://www.youtube.com/results?search_query=','+');
new Bang('ddg','https://duckduckgo.com','https://duckduckgo.com/?q=','+');
new Bang('so','https://stackoverflow.com','http://stackoverflow.com/search?q=','+');
new Bang('imdb','http://imdb.com','http://www.imdb.com/find?s=all&q=','+');
new Bang('gh','https://github.com','https://github.com/search?q=','+');
new Bang('gf','https://greasyfork.org/scripts','https://greasyfork.org/scripts/search?q=','+');
new Bang('gg','https://google.com','https://www.google.com/search?q=','+');
new Bang('zh','https://www.zhihu.com/topic','https://www.zhihu.com/search?q=','+');
new Bang('tb','https://taobao.com','https://s.taobao.com/search?q=','+');
new Bang('db','https://douban.com','https://www.douban.com/search?q=','+');
new Bang('bd','https://baidu.com','https://www.baidu.com/s?wd=','%20');
new Bang('bl','https://bilibili.com','https://search.bilibili.com/all?keyword=','%20');
new Bang('wb','http://s.weibo.com/','http://s.weibo.com/weibo/','%2520');
//BANGS

for(var i in bangs){
  var bang=bangs[i];
  if(search.charAt(0) == '!' || search.charAt(0) == "！" )
  {
    if(search.substr(1,bang.bang.substr(0).length)==bang.bang)
    {
      if(bang.urlSearch&&search.indexOf(' ')>=0)location.assign(bang.urlSearch+search.substr(bang.bang.length+2).replace(new RegExp(' ','g'),bang.spaceReplace));
      else location.assign(bang.urlEmpty);
    }
  }
}

function Bang(bang,urlEmpty,urlSearch,spaceReplace){
  this.bang=bang;
  this.urlEmpty=urlEmpty;
  this.urlSearch=urlSearch;
  this.spaceReplace=spaceReplace;
  bangs.push(this);
}