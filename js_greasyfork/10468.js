// ==UserScript==
// @name        pic替换通用脚本(自用版本-非公开版)
// @description pic替换通用脚本自行添加网站(自用版本-非公开版)
// @namespace   sh228800@qq.com
// @include     http://apk.hiapk.com/appinfo/*
// @include     http://www.baidu.com/*
// @include     http://www.ura-akiba.jp/*
// @include     http://www.dlsite.com/*
// @include     http://dl.getchu.com/index.php?action=gd*
// @include     http://www.sh2288.com/*
// @include     http://www.sh2288.com/*
// @include     http://www.sh2288.com/*
// @version     1.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10468/pic%E6%9B%BF%E6%8D%A2%E9%80%9A%E7%94%A8%E8%84%9A%E6%9C%AC%28%E8%87%AA%E7%94%A8%E7%89%88%E6%9C%AC-%E9%9D%9E%E5%85%AC%E5%BC%80%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/10468/pic%E6%9B%BF%E6%8D%A2%E9%80%9A%E7%94%A8%E8%84%9A%E6%9C%AC%28%E8%87%AA%E7%94%A8%E7%89%88%E6%9C%AC-%E9%9D%9E%E5%85%AC%E5%BC%80%E7%89%88%29.meta.js
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

var remove = function (x) {
  var ob = document.querySelectorAll(x)
  ob[0].parentNode.removeChild(ob[0])
}
//----定义函数----//移动节点函数(旧节点,新节点)

var renode = function (o, d) {
  var oldnode = document.querySelectorAll(o) [0]
  var newnode = document.querySelectorAll(d) [0]
  newnode.appendChild(oldnode)
}
//----定义函数----//节点内img移动(旧节点,新节点)链接图片使用

var move = function (o, d) {
  var imgs = document.querySelectorAll(o)
  var nnode = document.querySelectorAll(d) [0]
  //print(nnode)
  for (i = 0; i < imgs.length; i++)
  {
    var nimg = document.createElement('img')
    var nbr = document.createElement('br')
    nimg.setAttribute('src', imgs[i].href)
    nnode.insertBefore(nbr, nnode.childNodes[0])
    nnode.insertBefore(nimg, nnode.childNodes[0])
    nnode.insertBefore(nbr, nnode.childNodes[0])
  }
}
//----定义函数----//节点内img移动(旧节点,新节点)

var move2 = function (o, d,s) {
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
//----定义函数----//Search_In_Nyaa

var snyaa = function (o) {
  var a = document.querySelector(o)
  //print(a.innerHTML)
  var url = document.createElement('a')
  url.href = 'http://sukebei.nyaa.eu/?page=search&cats=0_0&filter=0&term=' + a.innerHTML
  url.className = 'sh2288'
  url.textContent = '   Search_In_Nyaa'
  url.target = '_blank'
  a.appendChild(url)
}

var url = document.location.toString();
var m = null;
//----匹配网站----//1
m = url.match(/hiapk\.com/);
//print(m)
if (m) {
  $('.left img', '.png', '.png1')
  resize('#screenImgUl img', 'auto', 'auto')
  renode('#screenImgUl', '#appScreen')
  remove('.detail_screen')
}
//----匹配网站----//2

m = url.match(/ura-akiba\.jp/);
//print(m)
if (m) {
  $('.kiji-column-main img', 'small', 'large')
  $('.kiji-column-main img', 's.jpg', '.jpg')
}
//----匹配网站----//3

m = url.match(/blog\.fc2\.com/);
//print(m)
if (m) {
  $('.entry-body img', 's.jpg', '.jpg')
  resize('.entry-body img', 'auto', 'auto')
}
//----匹配网站----//4

m = url.match(/dlsite\.com/);
//print(m)
if (m) {
  move('#work_sample a', '.work_story')
}
//----匹配网站----//5

m = url.match(/getchu\.com/);
//print(m)
if (m) {
  move2('.highslide img', '.m_main_c','800')
}
//----匹配网站----//5

m = url.match(/hiapk44\.com/);
//print(m)
if (m) {
  $('.left img', '.png', '.png1')
  resize('#screenImgUl img', 'auto', 'auto')
}

