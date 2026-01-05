// ==UserScript==
// @name       bbs simple - 简版论坛
// @version    2.0
// @auther		tumuyan
// @include      http://*/read.php?tid=*
// @include      http://*topic_*
// @include      http://*/thread-*
// @namespace https://greasyfork.org/users/13201
// @description 和我的另一个作品discuz archiver to thread很相似，（事实上正是相反）  现支持phpwind和discuz X，慢慢完善吧。 注意，有些论坛关闭了archiver，会显示No input file specified之类的错误 所以请自行添加 @exclude 防止误作用。
// @downloadURL https://update.greasyfork.org/scripts/30127/bbs%20simple%20-%20%E7%AE%80%E7%89%88%E8%AE%BA%E5%9D%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/30127/bbs%20simple%20-%20%E7%AE%80%E7%89%88%E8%AE%BA%E5%9D%9B.meta.js
// ==/UserScript==
var autoload=1
var url=document.URL

if (url.match(/\/topic_\d.htm.*/)  )  
{var simpleurl=url.replace(/topic_/,"simple/?t");add(simpleurl + '.html')}
else if (url.match(/\/read.php\?tid=/)  )
{var simpleurl=url.replace(/read.php.tid./,"simple/?t");;add(simpleurl + '.html')}
else if (url.match(/\/thread-\d{3,12}.*\d.html$/)  )
{var simpleurl=url.replace(/thread/,"archiver/tid");add(simpleurl.replace(/-\d*-\d*.html/,".html"))}


function add(url)
{
    var cssbot = document.createElement("style");
    cssbot.type="text/css";
    cssbot.innerHTML = ' a#fulltextbot {color:#336 !important;  position:fixed !important;display:block !important;  padding:4px !important;border-radius:0px 12px 12px 0px;  width:16px !important;max-height:120px !important;overflow:hidden !important;  top:40px;left:-2px;font-size: 12px !important;line-height: 30px !important;  background:#eed !important;box-shadow:5px 3px 6px #bbb  ;-o-transition: .3s ease-in;-moz-transition: .3s ease-in;-webkit-transition: .3s ease-in;}      a#cssbot2:hover    {background:#fdd !important;box-shadow:4px 4px 5px #bcd;  -o-transition: .3s ease-in;-moz-transition: .3s ease-in;-webkit-transition: .3s ease-in;} ';
    document.head.appendChild(cssbot);   
var cssbot2 = document.createElement("a");
    cssbot2.href=url
    cssbot2.id='fulltextbot'
    cssbot2.innerHTML = '简版模式'
    document.body.appendChild(cssbot2);   
if (autoload)
    cssbot2.click()
}
    
    