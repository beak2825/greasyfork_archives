// ==UserScript==
// @name        Cricut Store enhancements
// @namespace   A Better Geek
// @include     https://shop.cricut.com/*
// @version     1
// @grant       none
// @description Enhances Cricut product gallery pages.
// @downloadURL https://update.greasyfork.org/scripts/20818/Cricut%20Store%20enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/20818/Cricut%20Store%20enhancements.meta.js
// ==/UserScript==

//strip HTML comments from product listing
d = document.querySelector('.category-products');
d.innerHTML = d.innerHTML.replace(/<!--/g,'').replace(/-->/g,'');

//fade and disable URLs for out-of-stock items
n = document.querySelectorAll('.out-of-stock')
for (i = 0; i < n.length; i++)
  {
    n[i].style.height = '30px';
    n[i].style.lineHeight = '28px';
    z = n[i].parentElement;
    z = z.parentElement;
    z = z.parentElement;
    z.style.opacity = 0.5;
    z.style.display = 'none';
    
    z.innerHTML = z.innerHTML.replace(/<a/g,'<span').replace(/a>/g,'span>');
  }

//reduce font size of "Add to" links and move links to one row of text
a = document.querySelectorAll('.add-to-links');
for (i = 0; i < a.length; i++)
  {
    a[i].style.fontSize = '10px';
  }

w = document.querySelectorAll('.link-wishlist')
for (i = 0; i < w.length; i++)
  {
    w[i].parentElement.style.float = 'left';
  }

c = document.querySelectorAll('.link-compare')
for (i = 0; i < w.length; i++)
  {
    c[i].parentElement.style.float = 'right';
  }

e = document.querySelectorAll('.products-grid--max-4-col > li')
for (i = 0; i < e.length; i++)
  {
    e[i].style.height = '500px';
    e[i].style.clear = 'none';
    e[i].style.padding = '0 10px';
  }