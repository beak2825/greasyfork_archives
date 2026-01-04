// ==UserScript==
// @name         (改)豆瓣电影添加Rarbg搜索
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  从豆瓣电影直达Rarbg
// @author       Fxck
// @include      /^https://movie.douban.com/subject/\d*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427743/%28%E6%94%B9%29%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E6%B7%BB%E5%8A%A0Rarbg%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/427743/%28%E6%94%B9%29%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E6%B7%BB%E5%8A%A0Rarbg%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

var urlRegex = /tt\d{7}/;

var s=document.getElementById('info')
var p=s.innerText.match(urlRegex)
if (p){
  //s.appendChild(document.createElement("br"));
  var txt = document.createElement("span");
  txt.className='pl'
  txt.innerText='RARbg: '
  s.appendChild(txt);
  var elmLink = document.createElement("a");
  elmLink.rel="nofollow"
  elmLink.href='https://rarbgprx.org/torrents.php?imdb='+p
  elmLink.target="_blank";
  elmLink.innerText='𝕹𝖆𝖗𝖇𝖌'
  s.appendChild(elmLink);
  s.appendChild(document.createElement("br"));
  var e = document.createElement("span");
  e.className='p1'
  e.innerText='subhd: '
  s.appendChild(e);
  var ex = document.createElement("a");
  ex.rel="nofollow"
  ex.href='https://subhd.tv/search/'+p
  ex.target="_blank";
  ex.innerText='subhd'
  s.appendChild(ex);
}
else {
  var ts = document.createElement("span");
	ts.className='pl'
	ts.innerText='🤷‍♂️没有IMDb号🤷'
	s.appendChild(ts);
}