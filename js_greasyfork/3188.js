// ==UserScript==
// @name           XKCD tooltip
// @namespace      https://github.com/Lorentz83
// @description    This script puts the xkcd tooltip under the picture and adds a link to explainxkcd.com. It does the same work with what-if tooltips. Finally, it adds links to the printed comics sold in the store.
// @include        http*://xkcd.com/*
// @include        http*://www.xkcd.com/*
// @include        http*://what-if.xkcd.com/*
// @include        http*://www.what-if.xkcd.com/*
// @include        http*://store.xkcd.com/collections/everything/products/signed-prints
// @grant          none
// @version        1.6a
// @icon           https://raw.githubusercontent.com/Lorentz83/userscripts/master/XKCDTooltip/icon.png
// @supportURL     https://github.com/Lorentz83/userscripts
// @license        GPLv2; http://www.gnu.org/licenses/
// @downloadURL https://update.greasyfork.org/scripts/3188/XKCD%20tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/3188/XKCD%20tooltip.meta.js
// ==/UserScript==

/**
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var css = [];
var i = 0;
css[i++] = ".tooltip { ";
css[i++] = "    padding: 5px; ";
css[i++] = "    margin: 15px auto 20px; ";
css[i++] = "    font-size: 80%; ";
css[i++] = "    width: 60%; ";
css[i++] = "    border-style: solid; ";
css[i++] = "    border-radius: 12px; ";
css[i++] = "}";
css[i++] = ".xkcdtooltip {";
css[i++] = "    border-width: 1px; ";
css[i++] = "}";
css[i++] = ".whatiftooltip { ";
css[i++] = "    border: 1px solid #005994; ";
css[i++] = "    padding: 1.5ex; ";
css[i++] = "    margin-top: 0; ";
css[i++] = "}";

var addAfter = function (dom, newNode){
  dom.parentNode.insertBefore(newNode, dom.nextSibling);
}

var addTitleBox = function(img, after, cssClass) {
  var title = img.title;
  if(title.length == 0)
    return null;
  //img.title='';

  var titleBox = document.createElement('div');
  titleBox.textContent = title;
  titleBox.classList.add('tooltip');
  titleBox.classList.add(cssClass);

  addAfter(after,titleBox);
  return titleBox;
}

var addComicLinksInStore = function() {
  if ( document.location.host !== 'store.xkcd.com')
      return false;
  $(function(){
   $('#product-select-option-0 option').each(function(){ 
      val = $(this).val(); 
      var a = $('<a>'); 
      a.text(val); 
      a.attr('href','http://xkcd.com/'+val.split(' ')[0].substr(1));
      a.css('display','block'); 
      $('#product-header').append(a);
    });
  });
  return true; 
}

if ( addComicLinksInStore() )
  return;

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = css.join('\n');
document.head.appendChild(style);

var comicBox = document.getElementById('comic');

if (comicBox) {
  var img = comicBox.querySelector('*[title]');
  if (img) {
    addTitleBox(img, comicBox, 'xkcdtooltip');
  }

  var id = document.location.href.split('/')[3];
  var navs = document.getElementsByClassName('comicNav');
  for (var i = 0 ; i < navs.length ; i++ ) {
    var a = document.createElement('a');
    a.href = 'http://www.explainxkcd.com/wiki/index.php?title=' + id;
    a.textContent = 'Explain';
    var li = document.createElement('li');
    li.appendChild(a);
    addAfter(navs[i].children [2], li);
  }
}

var article = document.getElementsByTagName('article');
if(article.length > 0){
  var imgs = article[0].getElementsByTagName('img');
  for (var i =0 ; i<imgs.length ; i++){
    addTitleBox(imgs[i], imgs[i], 'whatiftooltip');
  }
}
