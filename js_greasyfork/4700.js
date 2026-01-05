// ==UserScript==
// @name       5sing跳转新域名
// @namespace   5sing2new
// @description    从www.5sing.com到5sing.kugou.com
// @include     http://www.5sing.com/*
// @include     https://www.5sing.com/*
// @include     http://fc.5sing.com/*
// @include     https://fc.5sing.com/*
// @version     14.08.30.34
// @author     17yard
// @grant       none
// @icon        http://ww3.sinaimg.cn/large/5cf8ff8dgw1ehu56yclmpj20280283yb.jpg
// @namespace https://greasyfork.org/scripts/4700

// @downloadURL https://update.greasyfork.org/scripts/4700/5sing%E8%B7%B3%E8%BD%AC%E6%96%B0%E5%9F%9F%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/4700/5sing%E8%B7%B3%E8%BD%AC%E6%96%B0%E5%9F%9F%E5%90%8D.meta.js
// ==/UserScript==

//= =/.*\.5sing\.com\//
//alert(site);document.URL

var site=document.URL;


if(site.match(/\:\/\/www\.5sing\.com\//)!=null)
{
location.replace(
	location.href.replace('://www.5sing.com/', '://5sing.kugou.com/')
)
}
          else 
{

location.replace(
    location.href.replace('://fc.5sing.com/', '://5sing.kugou.com/fc/')
)
}

 
//               if(site.match(/\:\/\/yc\.5sing\.com\//)!=null)
//{
//alert(site);
//location.replace(
//	location.href.replace('://yc.5sing.com/', '://5sing.kugou.com/yc/')
//)
//}