// ==UserScript==
// @name        pic替换通用脚本
// @description pic替换通用脚本自行添加网站
// @namespace   sh228800@qq.com
// @include     http://apk.hiapk.com/appinfo/*
// @include     http://www.baidu.com/*
// @include     http://www.sh2288.com/*
// @version     1.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10271/pic%E6%9B%BF%E6%8D%A2%E9%80%9A%E7%94%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/10271/pic%E6%9B%BF%E6%8D%A2%E9%80%9A%E7%94%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

//----定义函数----//替换函数("定位 img元素",原始名,目标名)
var $ = function (s, o, r) {
  var imgs = document.querySelectorAll(s)
  for (i = 0; i < imgs.length; i++)
  {
    imgs[i].src = imgs[i].src.replace(o, r)
  }
}
//----定义函数-----//放大函数("定位 img元素","百分比或像素")
var resize = function (x, y, z) {
  var imgs = document.querySelectorAll(x)
  for (i = 0; i < imgs.length; i++)
  {
    imgs[i].style.width = y,
    imgs[i].style.height = z
    //  imgs[i].appendChild(br);
  }
}
//----定义函数----//移除节点函数("节点")
var remove = function(x){
var ob= document.querySelectorAll(x)
ob[0].parentNode.removeChild(ob[0])
}
//----定义函数----//移动节点函数(旧节点,新节点)
var renode = function (o, d) {
	var oldnode = document.querySelectorAll(o)[0]
	var newnode = document.querySelectorAll(d)[0]
	newnode.appendChild(oldnode)
	}
//----定义函数----//节点内img移动(旧节点,新节点)

var move2 = function (o, d, s) {
  var imgs = document.querySelectorAll(o)
  var nnode = document.querySelectorAll(d) [0]
  //print(nnode)
  for (i = 0; i < imgs.length; i++)
  {
    var nimg = document.createElement('img')
    var nbr = document.createElement('br')
    nimg.width = s
    nimg.setAttribute('src', imgs[i].src)
    nnode.insertBefore(nbr, nnode.childNodes[0])
    nnode.insertBefore(nimg, nnode.childNodes[0])
    nnode.insertBefore(nbr, nnode.childNodes[0])
  }
}
//----定义函数----//
var url = document.location.toString();
var m = null;
//----匹配网站----//1
m = url.match(/hiapk\.com/);
//print(m)
if (m) {
  $('.left img', '.png', '.png1')
  resize('#screenImgUl img', 'auto', 'auto')
  renode('#screenImgUl','#appScreen')
  remove('.detail_screen')
}
//----匹配网站----//2
m = url.match(/www\.sh2288\.com/);
if (m) {
  var node = '.entry_body_p img';
  $(node, 's.jpg', '.jpg')
  resize(node, '100%', '100%')
}