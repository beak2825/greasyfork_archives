// ==UserScript==
// @name           Google Images direct link
// @namespace      https://github.com/Lorentz83
// @description    NOTE: Since July 2016 this script is unmaintained. It is here just for historical purposes and to let other people fork it. Adds direct links to images and pages in google image search
// @include        http*://images.google.*/images*
// @include        http*://www.google.*/images*
// @include        http*://www.google.*/webhp*
// @include        http*://www.google.*/search?*
// @include        http*://www.google.*/imgres*
// @include        http*://images.google.*/search?*
// @include        https://encrypted.google.com/search?*
// @version        7.1
// @grant          none
// @icon           https://raw.githubusercontent.com/Lorentz83/userscripts/master/GoogleImageDirectLink/icon.png
// @supportURL     https://github.com/Lorentz83/userscripts
// @license        GPLv2; http://www.gnu.org/licenses/
// @downloadURL https://update.greasyfork.org/scripts/3187/Google%20Images%20direct%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/3187/Google%20Images%20direct%20link.meta.js
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


var addCss = function ( /* args... */) {
  var css = new Array(arguments.length);
  for (var i = 0; i < arguments.length; i++) {
    css[i] = arguments[i];
  }
  var style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css.join('\n')));
  document.head.appendChild(style);
}

var parseUrl = function (url) {
  var pos = url.indexOf('?');
  if (pos < 0) {
    return {};
  }
  var qparms = url.substring(pos + 1);
  var rawparams = qparms.split('&');
  var par = {};
  for (var i = 0; i < rawparams.length; i++) {
    var p = rawparams[i].split('=');
    var key = decodeURIComponent(p[0]);
    var value = decodeURIComponent(p[1]);
    par[key] = value;
  }
  return par;
}

var getImageLinks = function (url) {
  var param = parseUrl(url);
  return {
    toImgHref: param['imgurl'],
    toPageHref: param['imgrefurl']
  };
}

var stopEvent = function (event) {
  event.stopPropagation();
}

var fixImageBox = function (div) {
  if (div.dataset.fixed) {
    return;
  }
  div.dataset.fixed = true;
  // useful objects
  var a = div.getElementsByTagName('a')[0];
  var span = div.querySelector('span.rg_ilmn');
  var links = getImageLinks(a.href);
  //mirror style to container
  div.style.height = a.style.height;
  div.style.width = a.style.width;
  div.style.left = a.style.left;
  //replace image anchor
  var newA = document.createElement('a');
  newA.style = a.style;
  while (a.childNodes.length) { 
    newA.appendChild(a.firstChild); 
  }
  newA.href = links.toImgHref;
  a.parentNode.replaceChild(newA, a);
  a = newA;
  //create the new container
  var newContainer = document.createElement('div');
  div.appendChild(newContainer);
  newContainer.className = 'newCont';
  newContainer.appendChild(a);
  newContainer.appendChild(span.parentNode);
  //create the link to the website
  var spanLink = document.createElement('a');
  spanLink.style.color = '#fff';
  spanLink.textContent = span.textContent;
  spanLink.href = links.toPageHref;
  while (span.firstChild) {
    span.removeChild(span.firstChild);
  }
  span.appendChild(spanLink);
  span.addEventListener('click', stopEvent, false);
}

var waitLink = {
  _conf: {
    attributes: true,
    attributeFilter: ['href']
  },
  _observer: new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.target.parentNode != null) {
        waitLink.prepareImageFix(mutation.target.parentNode)
      }
    });
  }),
  _watch: function (a) {
    waitLink._observer.observe(a, waitLink._conf);
  },
  reset: function () {
    waitLink._observer.disconnect();
  },
  prepareImageFix: function (div) {
    var as = div.getElementsByTagName('a');
    if (as.length > 0) {
      if (as[0].href != '') {
        fixImageBox(div);
      } else {
        waitLink._watch(as[0]);
      }
    }
  }
}

// when the page loads, the first bunch of images are included directly in the html, 
// the others are loaded asynchronously. This function fixs the first set.
var fixInitialImages = function () {
  var container = document.getElementById('rg_s');
  if (container === null) {
    console.log('Cannot find the image container, is it a visually similar search?');
    return;
  }
  var divs = container.children
  for (var i = 0; i < divs.length; i++) {
    var div = divs.item(i);
    waitLink.prepareImageFix(div);
  }
}

// img preview in google search or visually similar (only links to page)
// this function fixes the bunch of images at the top of a search (both visually similar and web)
var fixSearchPreview = function(){
  var images = document.getElementsByClassName('bicc');
  if (images.length) {
    console.log('This appear to be a visually similar search')
  }
  for (var i = 0 ; i<images.length ; i++) {
    var div = images[i];
    var anchor = div.getElementsByTagName('a');
    var img = div.getElementsByTagName('img');
    if ( img.length == 1 && !div.classList.contains('imgPrev') ) {
      div.className += ' imgPrev';
      //div.style.border = '4em solid black';
      var link = img[0].title;

      var a = document.createElement('a');
      a.href = link;
      a.classList.add('imgSiteLnk');
      a.textContent = link.split('/')[2];
      div.appendChild(a);
    }
  }
}

var newSearchObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.target.id=='irc_bg') {
      // a big preview has been opened (i.e. clicking on a preview in a visually similar search)
      var hash = parseUrl('?'+document.location.hash);
      var name = hash['#imgrc'];
      var els = document.getElementsByName(name);
      if ( els.length > 0 ) {
        var redirectTo = els.item(0).parentNode.href;
        if (redirectTo) {
          document.location.replace(redirectTo);
          return;
        } else {
          console.log('Error, a big preview has been opened, but no url to redirect has been found');
        }
      }
    }
    if (mutation.target.id === 'rg_s') { // just other images have been loaded
      for (var i = 0; i < mutation.addedNodes.length; i++) {
        var newNode = mutation.addedNodes.item(i);
        if (newNode.classList && newNode.classList.contains('rg_el')) {
          waitLink.prepareImageFix(newNode);
        }
      }
    }
    if (mutation.target.id === 'rg') { // a new search has been done
      waitLink.reset();
      fixInitialImages();
      fixSearchPreview();
    }
  });
});

// normal usage
var biggerContainer = document.getElementById('center_col');
newSearchObserver.observe(biggerContainer, {childList: true,subtree: true});
fixInitialImages();
fixSearchPreview();

// visually similar search img preview (oly links to image)
// these are the small images aside the page snippets
var similars = document.querySelectorAll('div#ires div.th a');
for (var i = 0 ; i < similars.length ; i++){
  var a = similars[i];
  var href = getImageLinks(a.href);
  var newA = document.createElement('a');
  newA.href = href.toImgHref;
  newA.appendChild(a.firstChild);
  a.parentNode.replaceChild(newA, a);
}

addCss(
  '.newCont { min-height: 30px; position: relative; height:100%; overflow: hidden; }',
  '.newCont>a { display: block; width: 100%; text-align: center; }',
  '.newCont>a>img { display: inline-block; }', '.newCont > a :not(img) { display: none; visibility: hidden; }',
  '.newCont .rg_ilmbg { display: none; left:0; }',
  '.newCont:hover .rg_ilmbg { display: block; }',
  '.newCont .rg_anbg, .newCont .rg_an { display: block; visibility: visible; text-align: left;}',
  'a.imgSiteLnk {',
  '  background-color: rgba(0, 0, 0, 0.77);',
  '  bottom: 0;',
  '  color: #fff !important;',
  '  display: block;',
  '  line-height: normal;',
  '  position: absolute;',
  '  width: 100%; ',
  '  display: none;',
  '  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',
  '}',
  '.imgPrev:hover .imgSiteLnk { display: block }'
);
