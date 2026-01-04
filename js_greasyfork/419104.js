// ==UserScript==
// @name        saucenao简单汉化
// @namespace   Violentmonkey Scripts
// @match       *://saucenao.com/
// @grant       none
// @version     1.0
// @author      -
// @description 2020/12/24 下午5:14:31
// @downloadURL https://update.greasyfork.org/scripts/419104/saucenao%E7%AE%80%E5%8D%95%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/419104/saucenao%E7%AE%80%E5%8D%95%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

document.querySelector("#advanced > p:nth-child(1)").innerHTML='<p>链接: <input type="TEXT" name="url" size="40">\
</p>'

document.querySelector("#advanced > p:nth-child(2").innerHTML='<p>帧: <input type="TEXT" name="frame" value="1" size="5">\
</p>'

document.querySelector("#Search > form > p > a").innerHTML='~高级选项~'

document.querySelector("#advanced > p:nth-child(3)").innerHTML='<p>筛选: <select name="hide" size="1">\
  <option selected="selected" value="0">禁用筛选</option>\
  <option value="1">已知的显式</option>\
    <option value="2">已知和可疑的显式</option>\
    <option value="3">除了已知的安全</option>\
</select></p>'

document.querySelector("body > ul").innerHTML='<li><a href="/about.html" class="style7">:: 关于本网站 ::</a></li>\
<li><a href="https://twitter.com/SauceNAO" class="style7">:: 推特 ::</a></li>\
<li><a href="tools/" class="style7">:: 工具 ::</a></li>\
<li><a href="legal.html" class="style7">:: 法律 ::</a></li>\
<li><a href="/status.html" class="style7">:: 索引状态 Status ::</a></li>\
<li><a href="/user.php" class="style7">:: 账号 ::</a></li>'

document.querySelector("#advanced > p:nth-child(4) > select").innerHTML='<option selected="selected" value="999">所有数据库</option>\
  <option value="0">R18-杂志</option>\
    <option value="2">R18-游戏CG</option>\
    <option value="3">同人志</option>\
    <option value="5">Pixiv图片</option>\
	  <option value="8">Niconico动画</option>\
	  <option value="9">Danbooru图墙</option>\
	  <option value="10">绘制图像</option>\
	  <option value="11">Nijie图墙</option>\
	  <option value="12">Yande图墙</option>\
	  <option value="15">Shutterstock图墙</option>\
	  <option value="16">FAKKU</option>\
	  <option value="18">H-杂项 (nH)</option>\
	  <option value="19">2D-市场</option>\
	  <option value="20">漫画</option>\
	  <option value="21">动画</option>\
	  <option value="22">R18-动画</option>\
	  <option value="23">电影</option>\
	  <option value="24">电视</option>\
	  <option value="25">Gelbooru图墙</option>\
	  <option value="26">Konachan图墙</option>\
	  <option value="27">Sankaku图墙</option>\
	  <option value="28">动漫-图片.net</option>\
	  <option value="29">e621.net</option>\
	  <option value="30">偶像 复杂</option>\
	  <option value="31">bcy.net 插画</option>\
	  <option value="32">bcy.net 角色扮演</option>\
	  <option value="33">PortalGraphics.net (Hist)</option>\
	  <option value="34">deviantArt</option>\
	  <option value="35">Pawoo.net</option>\
	  <option value="36">Madokami (漫画)</option>\
	  <option value="37">MangaDex</option>\
	  <option value="38">H-杂项 (eH)</option>\
	  <option value="39">艺术品</option>\
	  <option value="40">FurAffinity</option>\
	  <option value="41">推特</option>\
	  <option value="42">Furry Network</option>\
	  <option value="999">待定...</option>'